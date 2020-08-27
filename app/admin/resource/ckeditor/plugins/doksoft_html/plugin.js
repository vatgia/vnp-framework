CKEDITOR.plugins.add("doksoft_html", {
	lang: ["en"],
	init: function(editor) {
		if (typeof editor.lang.doksoft_html.doksoft_html != "undefined") {
			editor.lang.doksoft_html = editor.lang.doksoft_html.doksoft_html;
		}
		var command = editor.addCommand("doksoft_html", new CKEDITOR.dialogCommand("doksoft_html"));
		command.modes = {
			wysiwyg: 1,
			source: 0
		};
		command.canUndo = true;
		command.addParam = "doksoft_html";
		editor.ui.addButton("doksoft_html", {
			label: editor.lang.doksoft_html.button_label,
			command: "doksoft_html",
			icon: this.path + "doksoft_html" + (CKEDITOR.version.charAt(0) == "4" ? "_4" : "") + ".png"
		});
		CKEDITOR.dialog.add("doksoft_html", this.path + "dlg.js");
	}
});