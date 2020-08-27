function loadjs(d) {
	var fileref = document.createElement("script");
	fileref.setAttribute("type", "text/javascript");
	fileref.setAttribute("src", d);
	if (typeof fileref != "undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref);
	}
}

function resizeEditor(dataAndEvents, lr) {
	var dummy = document.getElementById("doksoft_html_editor");
	dummy.setAttribute("style", "width: " + dataAndEvents + "px; height: " + lr + "px");
	el_doksoft_html_editor.resize();
}

(function() {
	CKEDITOR.dialog.add("doksoft_html", function(dataAndEvents) {
		return {
			onOk: function() {
				var dialog = this;
				var where = el_doksoft_html_editor.getSession().getValue();
				dialog.getParentEditor().insertHtml(where);
			},
			title: "Insert HTML",
			minWidth: 500,
			minHeight: 300,
			onLoad: function() {},
			onShow: function() {
				this.on("resize", function(body) {
					resizeEditor(body.data.width, body.data.height);
				});
				var p = this.getParentEditor().plugins.doksoft_html.path;
				var c = p.substring(0, p.lastIndexOf("/"));
				if (typeof el_doksoft_html_editor === "undefined") {
					loadjs(c + "/ace.js?r=" + Math.floor(Math.random() * 1E4));
				} else {
					el_doksoft_html_editor.getSession().setValue("");
				}
			},
			contents: [{
				id: "general",
				label: "HTML",
				elements: [{
					id: "html",
					type: "html",
					html: '<style type="text/css" media="screen">' + ".ace_editor, .ace_editor * {  font-family: 'Monaco','Menlo','Ubuntu Mono','Consolas','source-code-pro',monospace !important; font-size: 12px !important; font-weight: 400 !important; letter-spacing: 0 !important; }" + "</style>" + '<div id="doksoft_html_editor"></div>'
				}]
			}]
		};
	});
})();