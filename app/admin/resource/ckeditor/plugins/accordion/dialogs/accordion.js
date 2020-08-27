CKEDITOR.dialog.add('accordionDialog', function(editor) {
	return {
		title: 'Cấu hình bản ghi trượt lên xuống',
		minWidth: 400,
		minHeight: 200,
		contents: [{
			id: 'tab-basic',
			label: 'Basic Settings',
			elements: [{
				type: 'text',
				id: 'number',
				label: 'Số lượng bản ghi trượt lên xuống',
				validate: CKEDITOR.dialog.validate.notEmpty("Không thể để trống")
			}]
		}],
		onOk: function() {
			var dialog = this;
			var sections = parseInt(dialog.getValueOf('tab-basic', 'number'));
			intern = ""
			for (i = 0; i < sections; i++) {
				intern = intern + '<div class="accordion_title">Tiêu đề ' + (i+1) + '</div><div class="accordion_content"><p>Nhập nội dung trượt lên xuống tại đây</p></div>';
			}
			editor.insertHtml('<div class="accordion">' + intern + '</div>');
		}
	};
});