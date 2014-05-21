/**
 * @file
 * Drupal Media plugin.
 */

(function ($, Drupal, drupalSettings, CKEDITOR) {

  "use strict";

  CKEDITOR.dtd['drupalmedia'] = jQuery.extend({}, CKEDITOR.dtd['div']);

  $.each(CKEDITOR.dtd.$block, function (element) {
    CKEDITOR.dtd[element]['drupalmedia'] = 1;
  });

  delete (CKEDITOR.dtd['p']['drupalmedia']);

  CKEDITOR.dtd['body']['drupalmedia'] = 1;
  CKEDITOR.dtd.$empty['drupalmedia'] = 1;
  CKEDITOR.dtd.$block['drupalmedia'] = 1;
  CKEDITOR.dtd.$nonEditable['drupalmedia'] = 1;

  drupalSettings.syncIefCheckboxes = true || drupalSettings.syncIefCheckboxes;

  jQuery('input[data-entity-type][data-entity-id]').click(function () {
    drupalSettings.syncIefCheckboxes = false;
  });

  // set interval
  function syncIefCheckboxes() {
    if (drupalSettings.syncIefCheckboxes) {
      var editor = CKEDITOR.instances['edit-body-0-value'];
      var content = editor.getData();
      var dom = $('<div/>').html(content);
      jQuery('input[data-entity-type][data-entity-id]').each(function (key, value) {
        var element = jQuery(value);
        var entity_type = element.data('entity-type');
        var entity_id = element.data('entity-id');
        var selector = 'div[data-entity-type="' + entity_type + '"][data-entity-id="' + entity_id + '"]';

        if (dom.find(selector).length) {
          element.prop('checked', true);
        }
        else {
          element.prop('checked', false);
        }
      });
    }
  }
//  var tid = setInterval(syncIefCheckboxes, 2000);

// Register the plugin within the editor.
  CKEDITOR.plugins.add('drupalmedia', {
    // This plugin requires the Widgets System defined in the 'widget' plugin.
    requires: 'widget',

    // Register the icon used for the toolbar button. It must be the same
    // as the name of the widget.
    icons: 'drupalmedia',

    // The plugin initialization logic goes inside this method.
    init: function (editor) {
      // Default dialog
      CKEDITOR.dialog.add('drupalmedia_dialog_edit', this.path + 'dialogs/edit.js' );

      // Custom dialog
      editor.addCommand('drupalmedia_dialog', {
        modes: { wysiwyg : 1 },
        canUndo: true,
        exec: function (editor, override) {
          var dialogSettings = {
            title: 'Entity',
            dialogClass: 'editor-image-dialog',
            resizable: false,
            minWidth: 800
          };

          var existingValues = {};
          var saveCallback = function (values) {
            editor.fire('saveSnapshot');

            var element = editor.document.createElement('drupalmedia');
            element.setAttribute('data-entity-id', values.entity_id);
            element.setAttribute('data-entity-type', values.entity_type);
            editor.insertHtml(element.getOuterHtml());

            // Save snapshot for undo support.
            editor.fire('saveSnapshot');
          };

          // Open the dialog for the edit form.
          Drupal.ckeditor.openDialog(editor, Drupal.url('admin/entity-embed/media/image'), existingValues, saveCallback, dialogSettings);
        }
      });

      // Register the drupalmedia widget.
      editor.widgets.add('drupalmedia', {
        'dialog': 'drupalmedia_dialog_edit',

        // Minimum HTML which is required by this widget to work.
        requiredContent: 'drupalmedia[data-entity-type,data-entity-id]',

        // Button
        button: 'Add entity',

        // Check the elements that need to be converted to widgets.
        upcast: function (element) {
          var attributes = element.attributes;
          if (element.name == 'drupalmedia' && typeof attributes['data-entity-type'] !== undefined && typeof attributes['data-entity-id'] !== undefined) {
            return element;
          }
        },

        downcast: function (element) {
          element.setHtml('');
          return element;
        },

        // When a widget is being initialized, we need to read the data ("align" and "width")
        // from DOM and set it by using the widget.setData() method.
        // More code which needs to be executed when DOM is available may go here.
        init: function () {
          var entity_type = this.element.data('entity-type');
          if (entity_type) {
            this.setData('entity_type', entity_type);
          }

          var entity_id = this.element.data('entity-id');
          if (entity_id) {
            this.setData('entity_id', entity_id);
          }

          var view_mode = this.element.data('view-mode');
          if (view_mode) {
            this.setData('view_mode', view_mode);
          }

          var magnification = this.element.data('magnification');
          if (magnification) {
            this.setData('magnification', magnification);
          }

          var alt = this.element.data('alt');
          if (alt) {
            this.setData('alt', alt);
          }

          var title = this.element.data('title');
          if (title) {
            this.setData('title', title);
          }

          var caption = this.element.data('caption');
          if (caption) {
            this.setData('caption', caption);
          }

          var align = this.element.data('align');
          if (align) {
            this.setData('align', align);
          }
        },

        // Listen on the widget#data event which is fired every time the widget data changes
        // and updates the widget's view.
        // Data may be changed by using the widget.setData() method, which we use in the
        // Simple Box dialog window.
        data: function () {
          this.element.data('entity-type', this.data.entity_type);
          this.element.data('entity-id', this.data.entity_id);
          this.element.data('view-mode', this.data.view_mode);
          this.element.data('magnification', this.data.magnification);
          this.element.data('alt', this.data.alt);
          this.element.data('title', this.data.title);
          this.element.data('caption', this.data.caption);
          this.element.data('align', this.data.align);

          this.element.removeClass('align-left');
          this.element.removeClass('align-center');
          this.element.removeClass('align-right');

          this.wrapper.removeClass('align-left');
          this.wrapper.removeClass('align-center');
          this.wrapper.removeClass('align-right');

          if (this.data.align) {
            this.element.addClass('align-' + this.data.align);
            this.wrapper.addClass('align-' + this.data.align);
          }

          var element = this.element;
          var preview = jQuery.ajax({
           url: '/entity-embed/' + this.data.entity_type + '/' + this.data.entity_id + '/preview/' + this.data.view_mode,
           data: this.data,
           dataType: 'json',
           async: false,
           success: function (data) {
             element.setHtml(data.content);
           }
         });
        }
      });

      // Register the toolbar button.
      if (editor.ui.addButton) {
        editor.ui.addButton('DrupalMedia', {
          label: Drupal.t('Media'),
          command: 'drupalmedia_dialog',
          icon: this.path + 'icons/drupalmedia.png'
        });
      }
    }
  });

  // Drupal Ajax Commands to interact with ckeditor api.
  Drupal.AjaxCommands.prototype.ckeditorInsertHtml = function (ajax, response, status) {
    var editor = CKEDITOR.instances['edit-body-0-value'];
    if (editor.mode == 'wysiwyg') {
      var content = editor.getData();
      editor.setData(content + response.data);
      drupalSettings.syncIefCheckboxes = true;
    }
  };

  // Drupal Ajax Commands to interact with ckeditor api.
  Drupal.AjaxCommands.prototype.ckeditorRemoveHtml = function (ajax, response, status) {
    var editor = CKEDITOR.instances['edit-body-0-value'];
    if (editor.mode == 'wysiwyg') {
      var content = editor.getData();
      var dom = $('<div/>').html(content);
      dom.find(response.data.selector).remove();
      editor.setData(dom.html());
      drupalSettings.syncIefCheckboxes = true;
    }
  };

})(jQuery, Drupal, drupalSettings, CKEDITOR);
