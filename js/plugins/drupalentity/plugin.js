/**
 * @file
 * Drupal Link plugin.
 */

(function ($, Drupal, drupalSettings, CKEDITOR) {

  "use strict";

  CKEDITOR.dtd['drupalentity'] = jQuery.extend({}, CKEDITOR.dtd['div']);

  $.each(CKEDITOR.dtd.$block, function (element) {
    CKEDITOR.dtd[element]['drupalentity'] = 1;
  });

  delete (CKEDITOR.dtd['p']['drupalentity']);

  CKEDITOR.dtd['body']['drupalentity'] = 1;
  CKEDITOR.dtd.$empty['drupalentity'] = 1;
  CKEDITOR.dtd.$block['drupalentity'] = 1;
  CKEDITOR.dtd.$nonEditable['drupalentity'] = 1;

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
  CKEDITOR.plugins.add('drupalentity', {
    // This plugin requires the Widgets System defined in the 'widget' plugin.
    requires: 'widget',

    // Register the icon used for the toolbar button. It must be the same
    // as the name of the widget.
    icons: 'drupalentity',

    // The plugin initialization logic goes inside this method.
    init: function (editor) {
      // Custom dialog
      editor.addCommand('drupalentity_dialog', {
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

            var element = editor.document.createElement('drupalentity');
            element.setAttribute('data-entity-id', values.entity_id);
            element.setAttribute('data-entity-type', values.entity_type);
            editor.insertHtml(element.getOuterHtml());

            // Save snapshot for undo support.
            editor.fire('saveSnapshot');
          };

          // Open the dialog for the edit form.
          Drupal.ckeditor.openDialog(editor, Drupal.url('admin/entity-embed/micro/contact-person'), existingValues, saveCallback, dialogSettings);
        }
      });

      // Register the drupalentity widget.
      editor.widgets.add('drupalentity', {
        // Minimum HTML which is required by this widget to work.
        requiredContent: 'drupalentity[data-entity-type,data-entity-id]',

        // Add button
        button: 'Add entity',

        // Check the elements that need to be converted to widgets.
        upcast: function (element) {
          var attributes = element.attributes;
          if (element.name == 'drupalentity' && typeof attributes['data-entity-type'] !== undefined && typeof attributes['data-entity-id'] !== undefined) {
            var preview = jQuery.ajax({
              url: '/entity-embed/' + attributes['data-entity-type'] + '/' + attributes['data-entity-id'] + '/preview',
              dataType: 'json',
              async: false,
              success: function (data) {
                element.setHtml(data.content);
              }
            });

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
          var entity_id = this.element.data('entity-id');

          if (entity_type) {
            this.setData('entity_type', entity_type);
          }

          if (entity_id) {
            this.setData('entity_id', entity_id);
          }

          var view_mode = this.element.data('view-mode');
          if (view_mode) {
            this.setData('view_mode', view_mode);
          }
        },

        // Listen on the widget#data event which is fired every time the widget data changes
        // and updates the widget's view.
        // Data may be changed by using the widget.setData() method, which we use in the
        // Simple Box dialog window.
        data: function () {
          this.element.data('entity-type', this.data.entity_type);
          this.element.data('entity-id', this.data.entity_id);
        }
      });

      // Register the toolbar button.
      if (editor.ui.addButton) {
        editor.ui.addButton('DrupalEntity', {
          label: Drupal.t('Drupal Entity'),
          command: 'drupalentity_dialog',
          icon: this.path + 'icons/drupalentity.png'
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
