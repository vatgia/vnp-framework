CKEDITOR.plugins.add('accordion', {
	icons: 'accordion',
	init: function(editor) {
		editor.addCommand('accordionDialog', new CKEDITOR.dialogCommand('accordionDialog'));
		editor.ui.addButton('Accordion', {
			label: 'Chèn hiệu ứng nội dung trượt lên xuống',
			command: 'accordionDialog',
			toolbar: 'insert'
		});
		CKEDITOR.dialog.add('accordionDialog', this.path + 'dialogs/accordion.js');
	}
});