CKEDITOR.plugins.add("imagemaps", {
	requires: ["dialog"],
	lang: ["en", "de", "el", "es", "it", "nl", "sv", "tr"],
	init: function(editor) {

		var imgpath = this.path + "icon.png";
		var data = editor.lang.imagemaps;
		window.imgmapStrings = data.imgmapStrings;

		CKEDITOR.dialog.add("ImageMaps", this.path + "dialog/imagemaps.js");

		var outdent = editor.addCommand("ImageMaps", new CKEDITOR.dialogCommand("ImageMaps", {
			allowedContent: "img[usemap];map[id,name];area[alt,coords,href,shape,target,title]",
			requiredContent: "img[src]"
		}));

		outdent.startDisabled = true;
		editor.ui.addButton("ImageMaps", {
			label: data.toolbar,
			command: "ImageMaps",
			toolbar: "insert,10",
			icon: imgpath
		});
		if (editor.addMenuItems) {
			editor.addMenuItems({
				imagemaps: {
					label: data.menu,
					command: "ImageMaps",
					group: "image",
					order: 1,
					icon: imgpath
				}
			});
		}
		if (editor.contextMenu) {
			editor.contextMenu.addListener(function(el) {
				el = init(el);
				return !el ? null : {
					imagemaps: el.hasAttribute("usemap") ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF
				};
			});
		}
		editor.on("doubleclick", function(evt) {
			var el = evt.data.element;
			var editor = evt.editor;
			var element;
			if (el.is("area")) {
				var targetNode = el.getParent().$.getAttribute("id");
				var parentElement = editor.editable ? editor.editable().$ : editor.document.$;
				if (parentElement.querySelector) {
					element = parentElement.querySelector('img[usemap="#' + targetNode + '"]');
				}
				if (element) {
					editor.getSelection().selectElement(new CKEDITOR.dom.element(element));
					evt.data.dialog = "ImageMaps";
					return;
				}
			}
			if ((element = init(el)) && element.hasAttribute("usemap")) {
				editor.getSelection().selectElement(element);
				evt.data.dialog = "ImageMaps";
			}
		}, null, null, 20);
		if (editor.widgets) {
			editor.on("contentDom", function() {
				var doc = editor.editable();
				doc.attachListener(doc, "click", function(evt) {
					var e = evt.data.$;
					e = new CKEDITOR.dom.node(e.target || e.srcElement);
					if (e.is && e.is("area")) {
						if (CKEDITOR.env.ie) {
							evt.data.preventDefault();
						}
						e = e.getParent().$.getAttribute("id");
						var $ = doc.$;
						if ($.querySelector) {
							if (e = $.querySelector('img[usemap="#' + e + '"]')) {
								if (e = editor.widgets.getByElement(new CKEDITOR.dom.node(e))) {
									e.focus();
									evt.data.preventDefault();
								}
							}
						}
					}
				});
			});
		}
		var init = function(element) {
			if (editor.widgets) {
				var widget = editor.widgets.focused;
				if (!widget) {
					if (widget = editor.widgets.getByElement(element)) {
						widget.focus();
					}
				}
				if (widget && (widget.name == "image2" || widget.name == "image")) {
					element = widget.element;
					if (!element) {
						return null;
					}
					if (element.getName() == "img") {
						return element;
					}
					element = element.getElementsByTag("img");
					return element.count() == 1 ? element.getItem(0) : null;
				}
			}
			return !element || (!element.is("img") || (element.data && element.data("cke-realelement") || element.isReadOnly())) ? null : element;
		};
		editor.on("selectionChange", CKEDITOR.tools.bind(function(el) {
			if (el = init(el.data.path.lastElement)) {
				this.setState(el.hasAttribute("usemap") ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
			} else {
				this.setState(CKEDITOR.TRISTATE_DISABLED);
			}
		}, outdent));
		if (!CKEDITOR.env.ie || (editor.plugins.image2 || !(CKEDITOR.env.version < 9))) {
			CKEDITOR.on("dialogDefinition", function(e) {
				if (e.data.name == "image") {
					var definition = e.data.definition;
					e.removeListener();
					definition.onOk = CKEDITOR.tools.override(definition.onOk, function(next_callback) {
						return function() {
							next_callback.call(this);
							var el = this.imageElement;
							var local = el.getAttribute("usemap");
							if (local) {
								if (local = (editor.editable ? editor.editable().$ : editor.document.$).querySelector(local)) {
									CKEDITOR.plugins.imagemaps.drawMap(el.$, local);
								}
							}
						};
					});
				}
			});
			data = "dataReady";
			if (CKEDITOR.skins) {
				data = "contentDom";
			}
			editor.on(data, function(context) {
				context = context.editor;
				context = context.editable ? context.editable().$ : context.document.$;
				var codeSegments = context.getElementsByTagName("map");
				var i = 0;
				for (; i < codeSegments.length; i++) {
					var provider = codeSegments[i];
					var failuresLink = context.querySelector('img[usemap="#' + provider.name + '"]');
					if (failuresLink) {
						CKEDITOR.plugins.imagemaps.drawMap(failuresLink, provider);
					}
				}
			}, null, null, 50);
			if (!CKEDITOR.plugins.imagemaps) {
				CKEDITOR.plugins.imagemaps = {};
			}
			CKEDITOR.plugins.imagemaps.drawMap = function(el, provider, id) {
				if (el.width) {
					if (!id) {
						if (el.attributes["data-cke-saved-src"]) {
							var img = new Image;
							img.width = el.width;
							img.height = el.height;
							img.onload = function() {
								CKEDITOR.plugins.imagemaps.drawMap(el, provider, img);
							};
							img.src = el.attributes["data-cke-saved-src"].value;
							return;
						}
						id = el;
					}
					var canvas = el.ownerDocument.createElement("canvas");
					var ctx = canvas.getContext("2d");
					canvas.setAttribute("width", el.width);
					canvas.setAttribute("height", el.height);
					ctx.drawImage(id, 0, 0, el.width, el.height);
					ctx.strokeStyle = "#DDDDDD";
					ctx.lineWidth = 1;
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
					ctx.shadowBlur = 3;
					ctx.shadowColor = "#333333";
					id = 0;
					for (; id < provider.areas.length; id++) {
						var a = provider.areas[id];
						var c = a.coords.split(",");
						switch (a.shape) {
							case "circle":
								ctx.beginPath();
								ctx.arc(c[0], c[1], c[2], 0, Math.PI * 2, true);
								ctx.closePath();
								ctx.stroke();
								break;
							case "poly":
								ctx.beginPath();
								ctx.moveTo(c[0], c[1]);
								a = 2;
								for (; a < c.length; a = a + 2) {
									ctx.lineTo(c[a], c[a + 1]);
								}
								ctx.closePath();
								ctx.stroke();
								break;
							default:
								ctx.strokeRect(c[0], c[1], c[2] - c[0], c[3] - c[1]);
						}
					}
					try {
						el.src = canvas.toDataURL();
					} catch (o) {}
				} else {
					var completed = function() {
						el.removeEventListener("load", completed);
						CKEDITOR.plugins.imagemaps.drawMap(el, provider);
					};
					el.addEventListener("load", completed, false);
				}
			};
		}
	},
	afterInit: function(editor) {
		var dataProcessor = editor.dataProcessor;
		(dataProcessor && dataProcessor.htmlFilter).addRules({
			elements: {
				map: function(n) {
					if (n.attributes.id && !n.attributes.name) {
						n.attributes.name = n.attributes.id;
					}
					var parentElement = editor.editable ? editor.editable().$ : editor.document.$;
					return parentElement.querySelector && !parentElement.querySelector('img[usemap="#' + n.attributes.name + '"]') ? false : n;
				}
			}
		}, {
			applyToAll: true
		});
	}
});
if (CKEDITOR.skins) {
	CKEDITOR.plugins.setLang = CKEDITOR.tools.override(CKEDITOR.plugins.setLang, function(iterator) {
		return function(type, index, list) {
			if (type != "devtools" && typeof list[type] != "object") {
				var element = {};
				element[type] = list;
				list = element;
			}
			iterator.call(this, type, index, list);
		};
	});
}