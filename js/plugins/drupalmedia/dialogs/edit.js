// Note: This automatic widget to dialog window binding (the fact that every field is set up from the widget
// and is committed to the widget) is only possible when the dialog is opened by the Widgets System
// (i.e. the widgetDef.dialog property is set).
// When you are opening the dialog window by yourself, you need to take care of this by yourself too.

CKEDITOR.dialog.add('drupalmedia_dialog_edit', function (editor) {
  return {
    title: 'Image',
    minWidth: 600,
    minHeight: 400,
    contents: [
      {
        id: 'info',
        elements: [
          {
            id: 'alt',
            type: 'text',
            label: 'Alt',
            // When setting up this field, set its value to the "view_mode" value from widget data.
            // Note: Align values used in the widget need to be the same as those defined in the "items" array above.
            setup: function (widget) {
              this.setValue(widget.data.alt);
            },
            // When committing (saving) this field, set its value to the widget data.
            commit: function (widget) {
              widget.setData('alt', this.getValue());
            }
          },
          {
            id: 'title',
            type: 'text',
            label: 'Title',
            // When setting up this field, set its value to the "view_mode" value from widget data.
            // Note: Align values used in the widget need to be the same as those defined in the "items" array above.
            setup: function (widget) {
              this.setValue(widget.data.title);
            },
            // When committing (saving) this field, set its value to the widget data.
            commit: function (widget) {
              widget.setData('title', this.getValue());
            }
          },
          {
            id: 'caption',
            type: 'textarea',
            label: 'Caption',
            // When setting up this field, set its value to the "view_mode" value from widget data.
            // Note: Align values used in the widget need to be the same as those defined in the "items" array above.
            setup: function (widget) {
              this.setValue(widget.data.caption);
            },
            // When committing (saving) this field, set its value to the widget data.
            commit: function (widget) {
              widget.setData('caption', this.getValue());
            }
          },
          {
            id: 'view_mode',
            type: 'select',
            label: 'View mode',
            items: [
              ['Thumbnail', 'thumbnail'],
              ['Medium', 'medium'],
              ['Large', 'large']
            ],
            // When setting up this field, set its value to the "view_mode" value from widget data.
            // Note: Align values used in the widget need to be the same as those defined in the "items" array above.
            setup: function (widget) {
              this.setValue(widget.data.view_mode);
            },
            // When committing (saving) this field, set its value to the widget data.
            commit: function (widget) {
              widget.setData('view_mode', this.getValue());
            }
          },
          {
            id: 'align',
            type: 'select',
            label: 'Align',
            items: [
              [editor.lang.common.notSet, ''],
              [editor.lang.common.alignLeft, 'left'],
              [editor.lang.common.alignRight, 'right'],
              [editor.lang.common.alignCenter, 'center']
            ],
            // When setting up this field, set its value to the "align" value from widget data.
            // Note: Align values used in the widget need to be the same as those defined in the "items" array above.
            setup: function (widget) {
              this.setValue(widget.data.align);
            },
            // When committing (saving) this field, set its value to the widget data.
            commit: function (widget) {
              widget.setData('align', this.getValue());
            }
          },
          {
            id: 'magnification',
            type: 'checkbox',
            label: 'Enable magnification',
            setup: function (widget) {
              this.setValue(widget.data.magnification);
            },
            commit: function (widget) {
              widget.setData('magnification', this.getValue());
            }
          }
        ]
      }
    ]
  };
});
