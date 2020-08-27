(function() {
	var pluginName = "doksoft_youtube";
	CKEDITOR.plugins.add(pluginName, {
		requires: "dialog,fakeobjects",
		icons: "doksoft_youtube",
		lang: "en",
		onLoad: function() {
			CKEDITOR.addCss("img.cke_doksoft_youtube" + "{" + "background-image: url(" + CKEDITOR.getUrl(this.path + "images/placeholder.png") + ");" + "background-position: center center;" + "background-repeat: no-repeat;" + "border: 1px solid #a9a9a9;" + "width: 121px;" + "height: 80px;" + "}");
		},
		beforeInit: function(editor) {
			CKEDITOR.tools.extend(editor.lang.fakeobjects, {
				doksoft_youtube: editor.lang.doksoft_youtube.title
			});
		},
		init: function(editor) {
			var item = editor.lang.doksoft_youtube;
			CKEDITOR.dialog.add(pluginName, this.path + "dialogs/youtube.js");
			editor.addCommand(pluginName, new CKEDITOR.dialogCommand(pluginName, {
				allowedContent: "iframe[width,height,src,frameborder,allowfullscreen];object;param[name,value];embed[src,type,width,height,allowscriptaccess,allowfullscreen]",
				requiredContent: "iframe[src];embed[src]"
			}));
			if (editor.ui.addButton) {
				editor.ui.addButton("doksoft_youtube", {
					label: item.label,
					title: item.title,
					command: pluginName,
					toolbar: "insert,60"
				});
			}
			editor.on("doubleclick", function(evt) {
				var element = evt.data.element;
				if (element.is("img") && element.data("cke-real-element-type") == "doksoft_youtube") {
					evt.data.dialog = "doksoft_youtube";
				}
			});
			if (editor.addMenuItems) {
				editor.addMenuItems({
					doksoft_youtube: {
						label: item.menu,
						command: pluginName,
						group: "image"
					}
				});
			}
			if (editor.contextMenu) {
				editor.contextMenu.addListener(function(element, dataAndEvents) {
					if (element && (element.is("img") && element.data("cke-real-element-type") == "doksoft_youtube")) {
						return {
							doksoft_youtube: CKEDITOR.TRISTATE_OFF
						};
					}
				});
			}
		},
		afterInit: function(editor) {
			var dataProcessor = editor.dataProcessor;
			var dataFilter = dataProcessor && dataProcessor.dataFilter;
			var regExp = /www\.youtube(?:-nocookie)?\.com/;
			if (dataFilter) {
				dataFilter.addRules({
					elements: {
						iframe: function(element) {
							if (element.attributes && (element.attributes.src && regExp.test(element.attributes.src))) {
								return editor.createFakeParserElement(element, "cke_doksoft_youtube", "doksoft_youtube", true);
							}
							return element;
						},
						"cke:object": function(element) {
							var i = 0;
							for (; i < element.children.length; i++) {
								var image = element.children[i];
								if (image.name == "cke:embed" && (image.attributes && (image.attributes.src && regExp.test(image.attributes.src)))) {
									var o = editor.createFakeParserElement(element, "cke_doksoft_youtube", "doksoft_youtube");
									var c = new CKEDITOR.htmlParser.cssStyle;
									if (image.attributes.width) {
										c.rules.width = image.attributes.width + "px";
									}
									if (image.attributes.height) {
										c.rules.height = image.attributes.height + "px";
									}
									c.populate(o);
									return o;
								}
							}
							return element;
						}
					}
				});
			}
		}
	});
})();