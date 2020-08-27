(function() {
	CKEDITOR.plugins.add("imagemaps", {
		requires: ["dialog"],
		lang: ["en", "de", "el", "es", "it", "nl", "sv", "tr"],
		init: function(editor) {
			var data = editor.lang.imagemaps;
			window.imgmapStrings = data.imgmapStrings;
			CKEDITOR.dialog.add("ImageMaps", this.path + "dialog/imagemaps.js");
			var outdent = editor.addCommand("imagemaps", new CKEDITOR.dialogCommand("ImageMaps", {
				allowedContent: "img[usemap];map[id,name];area[alt,coords,href,shape,target,title]",
				requiredContent: "img[src]"
			}));
			outdent.startDisabled = true;
			editor.ui.addButton("ImageMaps", {
				label: data.toolbar,
				command: "imagemaps",
				toolbar: "insert,10"
			});
			if (editor.addMenuItems) {
				editor.addMenuItems({
					imagemaps: {
						label: data.menu,
						command: "imagemaps",
						group: "image",
						order: 1
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
								var q = el.getAttribute("usemap");
								if (q) {
									if (q = (editor.editable ? editor.editable().$ : editor.document.$).querySelector(q)) {
										CKEDITOR.plugins.imagemaps.drawMap(el.$, q);
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
					var resultItems = context.getElementsByTagName("map");
					var i = 0;
					for (; i < resultItems.length; i++) {
						var result = resultItems[i];
						var failuresLink = context.querySelector('img[usemap="#' + result.name + '"]');
						if (failuresLink) {
							CKEDITOR.plugins.imagemaps.drawMap(failuresLink, result);
						}
					}
				}, null, null, 50);
				if (!CKEDITOR.plugins.imagemaps) {
					CKEDITOR.plugins.imagemaps = {};
				}
				CKEDITOR.plugins.imagemaps.drawMap = function(el, e, i) {
					if (el.width) {
						if (!i) {
							if (el.attributes["data-cke-saved-src"]) {
								var img = new Image;
								img.width = el.width;
								img.height = el.height;
								img.onload = function() {
									CKEDITOR.plugins.imagemaps.drawMap(el, e, img);
								};
								img.src = el.attributes["data-cke-saved-src"].value;
								return;
							}
							i = el;
						}
						var canvas = el.ownerDocument.createElement("canvas");
						var ctx = canvas.getContext("2d");
						canvas.setAttribute("width", el.width);
						canvas.setAttribute("height", el.height);
						ctx.drawImage(i, 0, 0, el.width, el.height);
						ctx.strokeStyle = "#DDDDDD";
						ctx.lineWidth = 1;
						ctx.shadowOffsetX = 0;
						ctx.shadowOffsetY = 0;
						ctx.shadowBlur = 3;
						ctx.shadowColor = "#333333";
						i = 0;
						for (; i < e.areas.length; i++) {
							var a = e.areas[i];
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
							CKEDITOR.plugins.imagemaps.drawMap(el, e);
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
	delete CKEDITOR.dtd.$nonBodyContent.map;
	if (CKEDITOR.dtd.$body) {
		CKEDITOR.dtd.$body.map = 1;
	} else {
		CKEDITOR.dtd.head.map = 1;
	}
	CKEDITOR.dtd.body.map = 1;
})();
(function() {
	function render(options) {
		show(true);
		update();
		id = options.aid;
		self.setValueOf("info", "href", options.ahref);
		self.setValueOf("info", "target", options.atarget || "notSet");
		self.setValueOf("info", "alt", options.aalt);
		self.setValueOf("info", "title", options.atitle);
	}

	function init(_id) {
		show(true);
		update();
		id = _id;
		self.getContentElement("info", "href").setValue("", true);
		self.getContentElement("info", "target").setValue("notSet", true);
		self.getContentElement("info", "alt").setValue("", true);
		self.getContentElement("info", "title").setValue("", true);
	}

	function showCenteredOverlay() {
		id = null;
		show(false);
	}

	function show(recurring) {
		var err = 1;
		for (; 2 >= err; err++) {
			var that = self.getContentElement("info", "properties" + err).getElement();
			if (recurring) {
				that.setStyle("visibility", "");
			} else {
				that.setStyle("visibility", "hidden");
			}
		}
	}

	function update() {
		if (null !== id) {
			context.areas[id].ahref = self.getValueOf("info", "href");
			context.areas[id].aalt = self.getValueOf("info", "alt");
			context.areas[id].atitle = self.getValueOf("info", "title");
		}
	}

	function $(o) {
		if ("pointer" == o) {
			context.is_drawing = 0;
			context.nextShape = "";
			a.$.style.cursor = "default";
		} else {
			context.nextShape = o;
			a.$.style.cursor = "crosshair";
		}
		callback(o);
	}

	function callback(name) {
		if ($delegate) {
			$delegate.removeClass("imgmapButtonActive");
		}
		$delegate = self.getContentElement("info", "btn_" + name).getElement();
		$delegate.addClass("imgmapButtonActive");
	}

	function partial(data) {
		var buf = "";
		var i = 0;
		for (; i < data.areas.length; i++) {
			var a;
			a = data.areas[i];
			if (!a || "" === a.shape) {
				a = "";
			} else {
				var e = '<area shape="' + a.shape + '" coords="' + a.lastInput + '"';
				if (a.aalt) {
					e += ' alt="' + a.aalt + '"';
				}
				if (a.atitle) {
					e += ' title="' + a.atitle + '"';
				}
				if (a.ahref) {
					e += ' href="' + a.ahref + '" data-cke-saved-href="' + a.ahref + '"';
				}
				if (a.atarget) {
					if ("notSet" != a.atarget) {
						e += ' target="' + a.atarget + '"';
					}
				}
				a = e += "/>";
			}
			buf += a;
		}
		return buf;
	}

	function compile() {
		var moduleName = id;
		if (null !== moduleName) {
			context.areas[moduleName]["a" + this.id] = this.getValue();
			context._recalculate(moduleName);
		}
	}
	var context;
	var el;
	var elem;
	var $delegate;
	var self;
	var a;
	var id = null;
	CKEDITOR.dialog.add("ImageMaps", function(editor) {
		function load() {
			if (w && ("undefined" != typeof imgmap && !(CKEDITOR.env.ie && "undefined" == typeof window.CanvasRenderingContext2D))) {
				elem = id = null;
				el = editor.getSelection().getSelectedElement();
				if ((!el || !el.is("img")) && editor.widgets) {
					var target = editor.widgets.focused;
					if (target && ("image2" == target.name || "image" == target.name)) {
						if (target = target.element) {
							if ("img" == target.getName()) {
								el = target;
							} else {
								target = target.getElementsByTag("img");
								if (1 == target.count()) {
									el = target.getItem(0);
								}
							}
						}
					}
				}
				if (!el || !el.is("img")) {
					alert(lang.msgImageNotSelected);
					self.hide();
				} else {
					target = el.data ? el.data("cke-saved-src") : el.getAttribute("_cke_saved_src");
					var list = document.getElementById(element);
					var a = CKEDITOR.document.getWindow().getViewPaneSize().height - 290;
					a = Math.max(a, 315);
					list.style.maxHeight = a + "px";
					context = new imgmap({
						mode: "editor2",
						custom_callbacks: {
							onSelectArea: render,
							onRemoveArea: showCenteredOverlay,
							onStatusMessage: function(xhtml) {
								document.getElementById(nodeName).innerHTML = xhtml;
							},
							onLoadImage: function(el) {
								var w = el.getAttribute("width");
								var oldHeight = el.getAttribute("height");
								if (w) {
									el.style.width = w + "px";
								}
								if (oldHeight) {
									el.style.height = oldHeight + "px";
								}
								a = new CKEDITOR.dom.element(el);
								a.on("dragstart", function(evt) {
									evt.data.preventDefault();
								});
							}
						},
						pic_container: list,
						bounding_box: false,
						lang: "",
						CL_DRAW_SHAPE: "#F00",
						CL_NORM_SHAPE: "#AAA",
						CL_HIGHLIGHT_SHAPE: "#F00"
					});
					context.loadStrings(imgmapStrings);
					el = el.$;
					context.loadImage(target, parseInt(el.style.width || (el.width || 0), 10), parseInt(el.style.height || (el.height || 0), 10));
					target = el.getAttribute("usemap", 2) || el.usemap;
					if ("string" == typeof target && "" !== target) {
						target = target.substr(1);
						list = (editor.editable ? editor.editable().$ : editor.document.$).getElementsByTagName("MAP");
						a = 0;
						for (; a < list.length; a++) {
							if (list[a].name == target || list[a].id == target) {
								elem = list[a];
								context.setMapHTML(elem);
								self.setValueOf("info", "MapName", target);
								break;
							}
						}
					}
					context.config.custom_callbacks.onAddArea = init;
					if (elem) {
						context.blurArea(context.currentid);
						context.currentid = 0;
						context.selectedId = 0;
						render(context.areas[0]);
						context.highlightArea(0);
						$("pointer");
					} else {
						callback("rect");
					}
					update();
					window.setTimeout(update, 1E3);
				}
			}
		}

		function init() {
			editor.fire("saveSnapshot");
			if (el) {
				if ("IMG" == el.nodeName) {
					el.removeAttribute("usemap", 0);
					el.src = el.attributes["data-cke-saved-src"].value;
				}
			}
			if (elem) {
				elem.parentNode.removeChild(elem);
			}
			self.hide();
		}

		function update() {
			var temp = parseInt(CKEDITOR.revision, 10);
			if (isNaN(temp) || !(7296 > temp && (CKEDITOR.skins && editor.config.filebrowserBrowseUrl))) {
				temp = self.parts.contents;
				var toolboxContainer = temp.getFirst().getFirst();
				var outer = document.getElementById(element);
				outer.style.width = parseInt(temp.$.style.width, 10) + "px";
				outer.style.height = parseInt(outer.style.height, 10) + (parseInt(temp.$.style.height, 10) - toolboxContainer.$.offsetHeight) + "px";
			}
		}
		var lang = editor.lang.imagemaps;
		var generalLabel = editor.lang.common.generalTab;
		var element = "pic_container" + CKEDITOR.tools.getNextNumber();
		var nodeName = "StatusContainer" + CKEDITOR.tools.getNextNumber();
		var mime = editor.plugins.imagemaps;
		var w = false;
		if (CKEDITOR.env.ie) {
			if ("undefined" == typeof window.CanvasRenderingContext2D) {
				CKEDITOR.scriptLoader.load(mime.path + "dialog/excanvas.js", load);
			}
		}
		if ("undefined" == typeof imgmap) {
			CKEDITOR.scriptLoader.load(mime.path + "dialog/imgmap.js", load);
		}
		var str = "";
		var style = CKEDITOR.document.getHead().append("style");
		style.setAttribute("type", "text/css");
		str += '.imgmapButton {cursor:pointer; background: url("' + mime.path + 'images/sprite.png") no-repeat top left; width: 16px; height: 16px; display:inline-block;}';
		str = str + ".imgmapButtonActive {outline:1px solid #666; background-color:#ddd;}.imgmap_label {cursor:default;}" + ("#" + element + " img {max-width:none; max-height:none;}");
		if (CKEDITOR.env.ie && 11 > CKEDITOR.env.version) {
			style.$.styleSheet.cssText = str;
		} else {
			style.$.innerHTML = str;
		}
		mime = "fieldset";
		str = parseInt(CKEDITOR.revision, 10);
		if (!isNaN(str)) {
			if (7296 > str && (CKEDITOR.skins && editor.config.filebrowserBrowseUrl)) {
				mime = "vbox";
			}
		}
		return {
			title: lang.title,
			minWidth: 500,
			minHeight: 510,
			buttons: [{
					type: "button",
					label: lang.imgmapBtnRemove,
					onClick: init
				},
				CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton
			],
			contents: [{
				id: "info",
				label: generalLabel,
				title: generalLabel,
				elements: [{
					type: mime,
					label: lang.imgmapMap,
					id: "ContainerMapName",
					hidden: true,
					children: [{
						id: "MapName",
						type: "text",
						label: lang.imgmapMapName,
						labelLayout: "horizontal",
						onChange: function() {
							context.mapname = this.getValue();
						}
					}]
				}, {
					type: mime,
					label: lang.imgmapMapAreas,
					children: [{
						type: "hbox",
						id: "button_container",
						style: "margin-bottom:10px",
						widths: "20px 18px 18px 18px 26px 230px 100px".split(" "),
						children: [{
							type: "html",
							id: "btn_pointer",
							onClick: function() {
								$("pointer");
							},
							html: '<span style="background-position: 0 -64px;" class="imgmapButton" title="' + lang.imgmapPointer + '"></span>'
						}, {
							type: "html",
							id: "btn_rect",
							onClick: function() {
								$("rect");
							},
							html: '<span style="background-position: 0 -128px;" class="imgmapButton" title="' + lang.imgmapRectangle + '"></span>'
						}, {
							type: "html",
							id: "btn_circle",
							onClick: function() {
								$("circle");
							},
							html: '<span style="background-position: 0 0;" class="imgmapButton" title="' + lang.imgmapCircle + '"></span>'
						}, {
							type: "html",
							id: "btn_poly",
							onClick: function() {
								$("poly");
							},
							html: '<span style="background-position: 0 -96px;" class="imgmapButton" title="' + lang.imgmapPolygon + '"></span>'
						}, {
							type: "html",
							onClick: function() {
								context.removeArea(context.currentid);
							},
							html: '<span style="background-position: 0 -32px;" class="imgmapButton" title="' + lang.imgmapDeleteArea + '"></span>'
						}, {
							type: "html",
							html: '<div id="' + nodeName + '">&nbsp;</div>'
						}, {
							type: "select",
							id: "zoom",
							labelLayout: "horizontal",
							label: lang.imgmapLabelZoom,
							onChange: function() {
								var value = this.getValue();
								var item = document.getElementById(element).getElementsByTagName("img")[0];
								if (item) {
									if (!item.oldwidth) {
										item.oldwidth = item.width;
									}
									if (!item.oldheight) {
										item.oldheight = item.height;
									}
									item.style.width = item.oldwidth * value + "px";
									item.style.height = item.oldheight * value + "px";
									context.scaleAllAreas(value);
								}
							},
							"default": "1",
							items: [
								["25%", "0.25"],
								["50%", "0.5"],
								["100%", "1"],
								["200%", "2"],
								["300%", "3"]
							]
						}]
					}, {
						type: "hbox",
						id: "properties1",
						style: "visibility:hidden",
						children: [{
							type: "text",
							id: "href",
							label: lang.linkURL,
							onChange: compile
						}, {
							type: "button",
							id: "browse",
							label: editor.lang.common.browseServer,
							style: "display:inline-block;margin-top:10px;",
							align: "center",
							hidden: "true",
							filebrowser: "info:href"
						}, {
							id: "target",
							type: "select",
							label: lang.linkTarget,
							onChange: compile,
							items: [
								[lang.notSet, "notSet"],
								[lang.linkTargetSelf, "_self"],
								[lang.linkTargetBlank, "_blank"],
								[lang.linkTargetTop, "_top"]
							]
						}]
					}, {
						type: "hbox",
						id: "properties2",
						style: "visibility:hidden",
						children: [{
							type: "text",
							id: "title",
							label: lang.advisoryTitle,
							onChange: compile
						}, {
							type: "text",
							id: "alt",
							hidden: true,
							label: lang.altText,
							onChange: compile
						}]
					}]
				}, {
					type: "fieldset",
					style: "border:0; padding:0",
					label: "&nbsp;",
					children: [{
						type: "html",
						html: '<div id="' + element + '" style="overflow:auto;width:500px;height:390px;position:relative;"></div>'
					}]
				}]
			}],
			onLoad: function() {
				self = this;
				self.on("resize", update);
			},
			onShow: function() {
				w = true;
				load();
			},
			onHide: function() {
				if ($delegate) {
					$delegate.removeClass("imgmapButtonActive");
					$delegate = null;
				}
				document.getElementById(element).innerHTML = "";
			},
			onOk: function() {
				update();
				if (el && "IMG" == el.nodeName) {
					var value = partial(context);
					if (value) {
						context.mapid = context.mapname = self.getValueOf("info", "MapName");
						if ("boolean" == typeof editor.fire("imagemaps.validate", context)) {
							return false;
						}
						editor.fire("saveSnapshot");
						value = partial(context);
						if (!elem) {
							elem = editor.document.$.createElement("map");
							var node = el;
							if (editor.widgets) {
								var widget = editor.widgets.focused;
								if (widget) {
									node = widget.wrapper.$;
								}
							}
							node.parentNode.insertBefore(elem, node.nextSibling);
						}
						elem.innerHTML = value;
						if (elem.name) {
							elem.removeAttribute("name");
						}
						elem.name = context.getMapName();
						elem.id = context.getMapId();
						el.setAttribute("usemap", "#" + elem.name, 0);
						if (CKEDITOR.plugins.imagemaps) {
							if (CKEDITOR.plugins.imagemaps.drawMap) {
								CKEDITOR.plugins.imagemaps.drawMap(el, elem);
							}
						}
					} else {
						init();
					}
				}
			}
		};
	});
})();

function imgmap(config) {
	this.version = "2.2";
	this.buildDate = "2009/08/12 22:18";
	this.buildNumber = "113";
	this.config = {};
	this.is_drawing = 0;
	this.strings = [];
	this.memory = [];
	this.areas = [];
	this.eventHandlers = {};
	this.currentid = 0;
	this.selectedId = this.draggedId = null;
	this.nextShape = "rect";
	this.isLoaded = false;
	this.mapid = this.mapname = "";
	this.DM_RECTANGLE_DRAW = this.globalscale = 1;
	this.DM_RECTANGLE_MOVE = 11;
	this.DM_RECTANGLE_RESIZE_TOP = 12;
	this.DM_RECTANGLE_RESIZE_RIGHT = 13;
	this.DM_RECTANGLE_RESIZE_BOTTOM = 14;
	this.DM_RECTANGLE_RESIZE_LEFT = 15;
	this.DM_SQUARE_DRAW = 2;
	this.DM_SQUARE_MOVE = 21;
	this.DM_SQUARE_RESIZE_TOP = 22;
	this.DM_SQUARE_RESIZE_RIGHT = 23;
	this.DM_SQUARE_RESIZE_BOTTOM = 24;
	this.DM_SQUARE_RESIZE_LEFT = 25;
	this.DM_POLYGON_DRAW = 3;
	this.DM_POLYGON_LASTDRAW = 30;
	this.DM_POLYGON_MOVE = 31;
	this.config.mode = "editor";
	this.config.baseroot = "";
	this.config.lang = "";
	this.config.defaultLang = "en";
	this.config.loglevel = 0;
	this.config.custom_callbacks = {};
	this.event_types = "onModeChanged onAddArea onRemoveArea onDrawArea onResizeArea onRelaxArea onFocusArea onBlurArea onMoveArea onSelectRow onLoadImage onSetMap onGetMap onSelectArea onDblClickArea onStatusMessage onAreaChanged".split(" ");
	this.config.CL_DRAW_SHAPE = "#d00";
	this.config.CL_DRAW_BG = "#fff";
	this.config.CL_NORM_SHAPE = "#d00";
	this.config.CL_NORM_BG = "#fff";
	this.config.CL_HIGHLIGHT_SHAPE = "#d00";
	this.config.CL_HIGHLIGHT_BG = "#fff";
	this.config.CL_KNOB = "#555";
	this.config.bounding_box = true;
	this.config.label = "%n";
	this.config.label_class = "imgmap_label";
	this.config.label_style = "font: bold 10px Arial";
	this.config.hint = "#%n %h";
	this.config.draw_opacity = "35";
	this.config.norm_opacity = "50";
	this.config.highlight_opacity = "70";
	this.config.cursor_default = "crosshair";
	var ua = navigator.userAgent;
	this.isMSIE = "Microsoft Internet Explorer" == navigator.appName;
	this.isSafari = -1 != ua.indexOf("Safari");
	this.isOpera = "undefined" != typeof window.opera;
	this.setup(config);
}
imgmap.prototype.assignOID = function(arg) {
	try {
		if ("undefined" == typeof arg) {
			this.log("Undefined object passed to assignOID.");
		} else {
			if ("object" == typeof arg) {
				return arg;
			}
			if ("string" == typeof arg) {
				return document.getElementById(arg);
			}
		}
	} catch (e) {
		this.log("Error in assignOID", 1);
	}
	return null;
};
imgmap.prototype.setup = function(config) {
	var i;
	for (i in config) {
		if (config.hasOwnProperty(i)) {
			this.config[i] = config[i];
		}
	}
	this.addEvent(document, "keydown", this.eventHandlers.doc_keydown = this.doc_keydown.bind(this));
	this.addEvent(document, "keyup", this.eventHandlers.doc_keyup = this.doc_keyup.bind(this));
	this.addEvent(document, "mousedown", this.eventHandlers.doc_mousedown = this.doc_mousedown.bind(this));
	if (config) {
		if (config.pic_container) {
			this.pic_container = this.assignOID(config.pic_container);
			this.disableSelection(this.pic_container);
		}
	}
	if (!this.config.lang) {
		this.config.lang = this.detectLanguage();
	}
	var j;
	var subLn;
	for (i in this.config.custom_callbacks) {
		if (this.config.custom_callbacks.hasOwnProperty(i)) {
			config = false;
			j = 0;
			subLn = this.event_types.length;
			for (; j < subLn; j++) {
				if (i == this.event_types[j]) {
					config = true;
					break;
				}
			}
			if (!config) {
				this.log("Unknown custom callback: " + i, 1);
			}
		}
	}
	this.addEvent(window, "load", this.onLoad.bind(this));
	return true;
};
imgmap.prototype.onLoad = function() {
	if (this.isLoaded) {
		return true;
	}
	try {
		this.loadStrings(imgmapStrings);
	} catch (a) {
		this.log("Unable to load language strings", 1);
	}
	return this.isLoaded = true;
};
imgmap.prototype.addEvent = function(object, name, handler) {
	if (object.attachEvent) {
		return object.attachEvent("on" + name, handler);
	}
	if (object.addEventListener) {
		return object.addEventListener(name, handler, false), true;
	}
};
imgmap.prototype.removeEvent = function(elem, type, handle) {
	if (elem.detachEvent) {
		return elem.detachEvent("on" + type, handle);
	}
	if (elem.removeEventListener) {
		return elem.removeEventListener(type, handle, false), true;
	}
};
imgmap.prototype.loadStrings = function(modified) {
	var field;
	for (field in modified) {
		if (modified.hasOwnProperty(field)) {
			this.strings[field] = modified[field];
		}
	}
};
imgmap.prototype.loadImage = function(el, width, height) {
	if ("undefined" == typeof this.pic_container) {
		return this.log("You must have pic_container defined to use loadImage!", 2), false;
	}
	this.removeAllAreas();
	this.globalscale = 1;
	if ("string" == typeof el) {
		return "undefined" == typeof this.pic && (this.pic = document.createElement("IMG"), this.pic_container.appendChild(this.pic), this.addEvent(this.pic, "mousedown", this.eventHandlers.img_mousedown = this.img_mousedown.bind(this)), this.addEvent(this.pic, "mouseup", this.eventHandlers.img_mouseup = this.img_mouseup.bind(this)), this.addEvent(this.pic, "mousemove", this.eventHandlers.img_mousemove = this.img_mousemove.bind(this)), this.pic.style.cursor = this.config.cursor_default), this.pic.src =
			el, width && (0 < width && this.pic.setAttribute("width", width)), height && (0 < height && this.pic.setAttribute("height", height)), this.fireEvent("onLoadImage", this.pic), true;
	}
	if ("object" == typeof el) {
		var failuresLink = el.src;
		if (!width) {
			width = el.clientWidth;
		}
		if (!height) {
			height = el.clientHeight;
		}
		return this.loadImage(failuresLink, width, height);
	}
};
imgmap.prototype.statusMessage = function(inplace) {
	this.fireEvent("onStatusMessage", inplace);
};
imgmap.prototype.log = function() {};
imgmap.prototype.getMapName = function() {
	if ("" === this.mapname) {
		if ("" !== this.mapid) {
			return this.mapid;
		}
		var date = new Date;
		this.mapname = "imgmap" + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
	}
	return this.mapname;
};
imgmap.prototype.getMapId = function() {
	if ("" === this.mapid) {
		this.mapid = this.getMapName();
	}
	return this.mapid;
};
imgmap.prototype._normShape = function(line) {
	if (!line) {
		return "rect";
	}
	line = this.trim(line).toLowerCase();
	return "rect" == line.substring(0, 4) ? "rect" : "circ" == line.substring(0, 4) ? "circle" : "poly" == line.substring(0, 4) ? "poly" : "rect";
};
imgmap.prototype._normCoords = function(data, y, preserve) {
	var min;
	var h;
	var max;
	var i;
	data = this.trim(data);
	if ("" === data) {
		return "";
	}
	var toConvert = data;
	data = data.replace(/(\d)([^\d\.])+(\d)/g, "$1,$3");
	data = data.replace(/,\D+(\d)/g, ",$1");
	data = data.replace(/,0+(\d)/g, ",$1");
	data = data.replace(/(\d)(\D)+,/g, "$1,");
	data = data.replace(/^\D+(\d)/g, "$1");
	data = data.replace(/^0+(\d)/g, "$1");
	data = data.replace(/(\d)(\D)+$/g, "$1");
	var result = data.split(",");
	if ("rect" == y) {
		if ("fromcircle" == preserve) {
			data = result[2];
			result[0] -= data;
			result[1] -= data;
			result[2] = parseInt(result[0], 10) + 2 * data;
			result[3] = parseInt(result[1], 10) + 2 * data;
		} else {
			if ("frompoly" == preserve) {
				y = parseInt(result[0], 10);
				h = parseInt(result[0], 10);
				min = parseInt(result[1], 10);
				max = parseInt(result[1], 10);
				data = 0;
				i = result.length;
				for (; data < i; data++) {
					if (0 === data % 2) {
						if (parseInt(result[data], 10) < y) {
							y = parseInt(result[data], 10);
						}
					}
					if (1 === data % 2) {
						if (parseInt(result[data], 10) < min) {
							min = parseInt(result[data], 10);
						}
					}
					if (0 === data % 2) {
						if (parseInt(result[data], 10) > h) {
							h = parseInt(result[data], 10);
						}
					}
					if (1 === data % 2) {
						if (parseInt(result[data], 10) > max) {
							max = parseInt(result[data], 10);
						}
					}
				}
				result[0] = y;
				result[1] = min;
				result[2] = h;
				result[3] = max;
			}
		}
		if (!(0 <= parseInt(result[1], 10))) {
			result[1] = result[0];
		}
		if (!(0 <= parseInt(result[2], 10))) {
			result[2] = parseInt(result[0], 10) + 10;
		}
		if (!(0 <= parseInt(result[3], 10))) {
			result[3] = parseInt(result[1], 10) + 10;
		}
		if (parseInt(result[0], 10) > parseInt(result[2], 10)) {
			data = result[0];
			result[0] = result[2];
			result[2] = data;
		}
		if (parseInt(result[1], 10) > parseInt(result[3], 10)) {
			data = result[1];
			result[1] = result[3];
			result[3] = data;
		}
		data = result[0] + "," + result[1] + "," + result[2] + "," + result[3];
	} else {
		if ("circle" == y) {
			if ("fromrect" == preserve) {
				y = parseInt(result[0], 10);
				h = parseInt(result[2], 10);
				min = parseInt(result[1], 10);
				max = parseInt(result[3], 10);
				result[2] = h - y < max - min ? h - y : max - min;
				result[2] = Math.floor(result[2] / 2);
				result[0] = y + result[2];
				result[1] = min + result[2];
			} else {
				if ("frompoly" == preserve) {
					y = parseInt(result[0], 10);
					h = parseInt(result[0], 10);
					min = parseInt(result[1], 10);
					max = parseInt(result[1], 10);
					data = 0;
					i = result.length;
					for (; data < i; data++) {
						if (0 === data % 2) {
							if (parseInt(result[data], 10) < y) {
								y = parseInt(result[data], 10);
							}
						}
						if (1 === data % 2) {
							if (parseInt(result[data], 10) < min) {
								min = parseInt(result[data], 10);
							}
						}
						if (0 === data % 2) {
							if (parseInt(result[data], 10) > h) {
								h = parseInt(result[data], 10);
							}
						}
						if (1 === data % 2) {
							if (parseInt(result[data], 10) > max) {
								max = parseInt(result[data], 10);
							}
						}
					}
					result[2] = h - y < max - min ? h - y : max - min;
					result[2] = Math.floor(result[2] / 2);
					result[0] = y + result[2];
					result[1] = min + result[2];
				}
			}
			if (!(0 < parseInt(result[1], 10))) {
				result[1] = result[0];
			}
			if (!(0 < parseInt(result[2], 10))) {
				result[2] = 10;
			}
			data = result[0] + "," + result[1] + "," + result[2];
		} else {
			if ("poly" == y) {
				if ("fromrect" == preserve) {
					result[4] = result[2];
					result[5] = result[3];
					result[2] = result[0];
					result[6] = result[4];
					result[7] = result[1];
				} else {
					if ("fromcircle" == preserve) {
						y = parseInt(result[0], 10);
						min = parseInt(result[1], 10);
						h = parseInt(result[2], 10);
						max = 0;
						result[max++] = y + h;
						result[max++] = min;
						data = 0;
						for (; 60 >= data; data++) {
							var percent = data / 60;
							i = Math.cos(2 * percent * Math.PI);
							percent = Math.sin(2 * percent * Math.PI);
							i = y + i * h;
							percent = min + percent * h;
							result[max++] = Math.round(i);
							result[max++] = Math.round(percent);
						}
					}
				}
				data = result.join(",");
			}
		}
	}
	return "preserve" == preserve && toConvert != data ? toConvert : data;
};
imgmap.prototype.setMapHTML = function(src) {
	this.fireEvent("onSetMap", src);
	this.removeAllAreas();
	var target;
	if ("string" == typeof src) {
		target = document.createElement("DIV");
		target.innerHTML = src;
		target = target.firstChild;
	} else {
		if ("object" == typeof src) {
			target = src;
		}
	}
	if (!target || "map" !== target.nodeName.toLowerCase()) {
		return false;
	}
	this.mapname = target.name;
	this.mapid = target.id;
	src = target.getElementsByTagName("area");
	var data;
	var tmp;
	var name;
	var j = 0;
	var l2 = src.length;
	for (; j < l2; j++) {
		target = "";
		name = this.addNewArea();
		data = this._normShape(src[j].getAttribute("shape", 2));
		this.initArea(name, data);
		if (src[j].getAttribute("coords", 2)) {
			target = this._normCoords(src[j].getAttribute("coords", 2), data);
			this.areas[name].lastInput = target;
		}
		data = src[j].getAttribute("href", 2);
		if (tmp = src[j].getAttribute("data-cke-saved-href")) {
			data = tmp;
		}
		if (data) {
			this.areas[name].ahref = data;
		}
		if (data = src[j].getAttribute("alt")) {
			this.areas[name].aalt = data;
		}
		if (!(tmp = src[j].getAttribute("title"))) {
			tmp = data;
		}
		if (tmp) {
			this.areas[name].atitle = tmp;
		}
		if (data = src[j].getAttribute("target")) {
			data = data.toLowerCase();
		}
		this.areas[name].atarget = data;
		this._recalculate(name, target);
		this.relaxArea(name);
		this.fireEvent("onAreaChanged", this.areas[name]);
	}
	return true;
};
imgmap.prototype.addNewArea = function() {
	var id = this._getLastArea();
	id = id ? id.aid + 1 : 0;
	var data = this.areas[id] = document.createElement("DIV");
	data.id = this.mapname + "area" + id;
	data.aid = id;
	data.shape = "undefined";
	this.blurArea(this.currentid);
	this.currentid = id;
	this.fireEvent("onAddArea", id);
	return id;
};
imgmap.prototype.initArea = function(i, value) {
	var div = this.areas[i];
	if (div) {
		if (div.parentNode) {
			div.parentNode.removeChild(div);
		}
		if (div.label) {
			div.label.parentNode.removeChild(div.label);
		}
		div = this.areas[i] = document.createElement("CANVAS");
		this.pic_container.appendChild(div);
		this.pic_container.style.position = "relative";
		if ("undefined" != typeof G_vmlCanvasManager) {
			div = this.areas[i] = G_vmlCanvasManager.initElement(div);
		}
		div.id = this.mapname + "area" + i;
		div.aid = i;
		div.shape = value;
		div.ahref = "";
		div.atitle = "";
		div.aalt = "";
		div.atarget = "";
		div.style.position = "absolute";
		div.style.top = this.pic.offsetTop + "px";
		div.style.left = this.pic.offsetLeft + "px";
		this._setopacity(div, this.config.CL_DRAW_BG, this.config.draw_opacity);
		div.ondblclick = this.area_dblclick.bind(this);
		div.onmousedown = this.area_mousedown.bind(this);
		div.onmouseup = this.area_mouseup.bind(this);
		div.onmousemove = this.area_mousemove.bind(this);
		div.onmouseover = this.area_mouseover.bind(this);
		div.onmouseout = this.area_mouseout.bind(this);
		this.memory[i] = {};
		this.memory[i].downx = 0;
		this.memory[i].downy = 0;
		this.memory[i].left = 0;
		this.memory[i].top = 0;
		this.memory[i].width = 0;
		this.memory[i].height = 0;
		this.memory[i].xpoints = [];
		this.memory[i].ypoints = [];
		div.label = document.createElement("DIV");
		this.pic_container.appendChild(div.label);
		div.label.className = this.config.label_class;
		this.assignCSS(div.label, this.config.label_style);
		div.label.style.position = "absolute";
	}
};
imgmap.prototype.relaxArea = function(name) {
	var suiteView = this.areas[name];
	if (suiteView) {
		this.fireEvent("onRelaxArea", name);
		if (name != this.currentid) {
			this._setBorder(suiteView, "NORM");
			this._setopacity(suiteView, this.config.CL_NORM_BG, this.config.norm_opacity);
		} else {
			this.highlightArea(name);
		}
	}
};
imgmap.prototype.relaxAllAreas = function() {
	var i = 0;
	var valuesLen = this.areas.length;
	for (; i < valuesLen; i++) {
		if (this.areas[i]) {
			this.relaxArea(i);
		}
	}
};
imgmap.prototype._setBorder = function(obj, n) {
	if ("rect" == obj.shape || this.config.bounding_box) {
		obj.style.borderWidth = "1px";
		obj.style.borderStyle = "DRAW" == n ? "dotted" : "solid";
		obj.style.borderColor = this.config["CL_" + n + "_" + ("rect" == obj.shape ? "SHAPE" : "BOX")];
	} else {
		obj.style.border = "";
	}
};
imgmap.prototype._setopacity = function(obj, recurring, val) {
	if (recurring) {
		obj.style.backgroundColor = recurring;
	}
	if (val && ("string" == typeof val && val.match(/^\d*\-\d+$/))) {
		var pair = val.split("-");
		if ("undefined" != typeof pair[0]) {
			pair[0] = parseInt(pair[0], 10);
			this._setopacity(obj, recurring, pair[0]);
		}
		if ("undefined" != typeof pair[1]) {
			pair[1] = parseInt(pair[1], 10);
			recurring = this._getopacity(obj);
			var readyList = this;
			val = Math.round(pair[1] - recurring);
			if (5 < val) {
				window.setTimeout(function() {
					readyList._setopacity(obj, null, "-" + pair[1]);
				}, 20);
				val = 1 * recurring + 5;
			} else {
				if (-3 > val) {
					window.setTimeout(function() {
						readyList._setopacity(obj, null, "-" + pair[1]);
					}, 20);
					val = 1 * recurring - 3;
				} else {
					val = pair[1];
				}
			}
		}
	}
	if (!isNaN(val)) {
		val = Math.round(parseInt(val, 10));
		obj.style.opacity = val / 100;
		obj.style.filter = "alpha(opacity=" + val + ")";
	}
};
imgmap.prototype._getopacity = function(obj) {
	return 1 >= obj.style.opacity ? 100 * obj.style.opacity : obj.style.filter ? parseInt(obj.style.filter.replace(/alpha\(opacity\=([^\)]*)\)/ig, "$1"), 10) : 100;
};
imgmap.prototype.removeArea = function(k) {
	if (!(null === k || "undefined" == typeof k)) {
		try {
			this.areas[k].label.parentNode.removeChild(this.areas[k].label);
			this.areas[k].parentNode.removeChild(this.areas[k]);
			this.areas[k].label.className = null;
			this.areas[k].label = null;
			this.areas[k].onmouseover = null;
			this.areas[k].onmouseout = null;
			this.areas[k].onmouseup = null;
			this.areas[k].onmousedown = null;
			this.areas[k].onmousemove = null;
		} catch (e) {}
		this.areas[k] = null;
		this.fireEvent("onRemoveArea", k);
	}
};
imgmap.prototype.removeAllAreas = function() {
	var i = 0;
	var valuesLen = this.areas.length;
	for (; i < valuesLen; i++) {
		if (this.areas[i]) {
			this.removeArea(i);
		}
	}
};
imgmap.prototype.scaleAllAreas = function(name) {
	var pad_length = 1;
	try {
		pad_length = name / this.globalscale;
	} catch (b) {
		this.log("Invalid (global)scale", 1);
	}
	this.globalscale = name;
	name = 0;
	var yCompLen = this.areas.length;
	for (; name < yCompLen; name++) {
		if (this.areas[name]) {
			if ("undefined" != this.areas[name].shape) {
				this.scaleArea(name, pad_length);
			}
		}
	}
};
imgmap.prototype.scaleArea = function(name, multiplier) {
	var info = this.areas[name];
	info.style.top = parseInt(info.style.top, 10) * multiplier + "px";
	info.style.left = parseInt(info.style.left, 10) * multiplier + "px";
	this.setAreaSize(name, info.width * multiplier, info.height * multiplier);
	if ("poly" == info.shape) {
		var i = 0;
		var valuesLen = info.xpoints.length;
		for (; i < valuesLen; i++) {
			info.xpoints[i] *= multiplier;
			info.ypoints[i] *= multiplier;
		}
	}
	this._repaint(info, this.config.CL_NORM_SHAPE);
	this._updatecoords(name);
};
imgmap.prototype._putlabel = function(name) {
	var item = this.areas[name];
	if (item.label) {
		try {
			if (this.config.label) {
				item.label.style.display = "";
				var fmt = this.config.label;
				fmt = fmt.replace(/%n/g, "" + name);
				fmt = fmt.replace(/%c/g, "" + item.lastInput);
				fmt = fmt.replace(/%h/g, "" + item.ahref);
				fmt = fmt.replace(/%a/g, "" + item.aalt);
				fmt = fmt.replace(/%t/g, "" + item.atitle);
				item.label.innerHTML = fmt;
			} else {
				item.label.innerHTML = "";
				item.label.style.display = "none";
			}
			item.label.style.top = item.style.top;
			item.label.style.left = item.style.left;
		} catch (d) {
			this.log("Error putting label", 1);
		}
	}
};
imgmap.prototype._puthint = function(id) {
	try {
		if (this.config.hint) {
			var alt = this.config.hint;
			alt = alt.replace(/%n/g, "" + id);
			alt = alt.replace(/%c/g, "" + this.areas[id].lastInput);
			alt = alt.replace(/%h/g, "" + this.areas[id].ahref);
			alt = alt.replace(/%a/g, "" + this.areas[id].aalt);
			alt = alt.replace(/%t/g, "" + this.areas[id].atitle);
			this.areas[id].title = alt;
			this.areas[id].alt = alt;
		} else {
			this.areas[id].title = "";
			this.areas[id].alt = "";
		}
	} catch (b) {
		this.log("Error putting hint", 1);
	}
};
imgmap.prototype._repaintAll = function() {
	var ti = 0;
	var nTokens = this.areas.length;
	for (; ti < nTokens; ti++) {
		if (this.areas[ti]) {
			this._repaint(this.areas[ti], this.config.CL_NORM_SHAPE);
		}
	}
};
imgmap.prototype._repaint = function(info, i, top, v11) {
	var ctx;
	var d;
	var wt;
	var offset;
	var size;
	if ("circle" == info.shape) {
		d = parseInt(info.style.width, 10);
		top = Math.floor(d / 2) - 1;
		if (0 > top) {
			top = 0;
		}
		ctx = info.getContext("2d");
		ctx.clearRect(0, 0, d, d);
		ctx.beginPath();
		ctx.strokeStyle = i;
		ctx.arc(top, top, top, 0, 2 * Math.PI, 0);
		ctx.stroke();
		ctx.closePath();
		ctx.strokeStyle = this.config.CL_KNOB;
		ctx.strokeRect(top, top, 1, 1);
		this._putlabel(info.aid);
		this._puthint(info.aid);
	} else {
		if ("rect" == info.shape) {
			this._putlabel(info.aid);
			this._puthint(info.aid);
		} else {
			if ("poly" == info.shape) {
				d = parseInt(info.style.width, 10);
				wt = parseInt(info.style.height, 10);
				offset = parseInt(info.style.left, 10);
				size = parseInt(info.style.top, 10);
				if (info.xpoints) {
					ctx = info.getContext("2d");
					ctx.clearRect(0, 0, d, wt);
					ctx.beginPath();
					ctx.strokeStyle = i;
					ctx.moveTo(info.xpoints[0] - offset, info.ypoints[0] - size);
					i = 1;
					d = info.xpoints.length;
					for (; i < d; i++) {
						ctx.lineTo(info.xpoints[i] - offset, info.ypoints[i] - size);
					}
					if (this.is_drawing == this.DM_POLYGON_DRAW || this.is_drawing == this.DM_POLYGON_LASTDRAW) {
						ctx.lineTo(top - offset - 5, v11 - size - 5);
					}
					ctx.lineTo(info.xpoints[0] - offset, info.ypoints[0] - size);
					ctx.stroke();
					ctx.closePath();
				}
				this._putlabel(info.aid);
				this._puthint(info.aid);
			}
		}
	}
};
imgmap.prototype._updatecoords = function(info) {
	info = this.areas[info];
	var s = Math.round(parseInt(info.style.left, 10) / this.globalscale);
	var e = Math.round(parseInt(info.style.top, 10) / this.globalscale);
	var sign = Math.round(parseInt(info.style.height, 10) / this.globalscale);
	var d = Math.round(parseInt(info.style.width, 10) / this.globalscale);
	var value = "";
	if ("rect" == info.shape) {
		info.lastInput = s + "," + e + "," + (s + d) + "," + (e + sign);
	} else {
		if ("circle" == info.shape) {
			value = Math.floor(d / 2) - 1;
			info.lastInput = s + value + "," + (e + value) + "," + value;
		} else {
			if ("poly" == info.shape) {
				if (info.xpoints) {
					s = 0;
					e = info.xpoints.length;
					for (; s < e; s++) {
						value += Math.round(info.xpoints[s] / this.globalscale) + "," + Math.round(info.ypoints[s] / this.globalscale) + ",";
					}
					value = value.substring(0, value.length - 1);
				}
				info.lastInput = value;
			}
		}
	}
	this.fireEvent("onAreaChanged", info);
};
imgmap.prototype._recalculate = function(name, text) {
	var info = this.areas[name];
	try {
		text = text ? this._normCoords(text, info.shape, "preserve") : info.lastInput || "";
		var values = text.split(",");
		if ("rect" == info.shape) {
			if (4 != values.length || (parseInt(values[0], 10) > parseInt(values[2], 10) || parseInt(values[1], 10) > parseInt(values[3], 10))) {
				throw "invalid coords";
			}
			info.style.left = this.globalscale * (this.pic.offsetLeft + parseInt(values[0], 10)) + "px";
			info.style.top = this.globalscale * (this.pic.offsetTop + parseInt(values[1], 10)) + "px";
			this.setAreaSize(name, this.globalscale * (values[2] - values[0]), this.globalscale * (values[3] - values[1]));
			this._repaint(info, this.config.CL_NORM_SHAPE);
		} else {
			if ("circle" == info.shape) {
				if (3 != values.length || 0 > parseInt(values[2], 10)) {
					throw "invalid coords";
				}
				var i = 2 * values[2];
				this.setAreaSize(name, this.globalscale * i, this.globalscale * i);
				info.style.left = this.globalscale * (this.pic.offsetLeft + parseInt(values[0], 10) - i / 2) + "px";
				info.style.top = this.globalscale * (this.pic.offsetTop + parseInt(values[1], 10) - i / 2) + "px";
				this._repaint(info, this.config.CL_NORM_SHAPE);
			} else {
				if ("poly" == info.shape) {
					if (2 > values.length) {
						throw "invalid coords";
					}
					info.xpoints = [];
					info.ypoints = [];
					i = 0;
					var valuesLen = values.length;
					for (; i < valuesLen; i += 2) {
						info.xpoints[info.xpoints.length] = this.globalscale * (this.pic.offsetLeft + parseInt(values[i], 10));
						info.ypoints[info.ypoints.length] = this.globalscale * (this.pic.offsetTop + parseInt(values[i + 1], 10));
						this._polygongrow(info, this.globalscale * values[i], this.globalscale * values[i + 1]);
					}
					this._polygonshrink(info);
				}
			}
		}
	} catch (err) {
		this.log(err.message ? err.message : "error calculating coordinates", 1);
		this.statusMessage(this.strings.ERR_INVALID_COORDS);
		if (info.lastInput) {
			this.fireEvent("onAreaChanged", info);
		}
		this._repaint(info, this.config.CL_NORM_SHAPE);
		return;
	}
	info.lastInput = text;
};
imgmap.prototype._polygongrow = function(info, y, x) {
	var distY = y - parseInt(info.style.left, 10);
	var distX = x - parseInt(info.style.top, 10);
	if (y < parseInt(info.style.left, 10)) {
		info.style.left = y - 0 + "px";
		this.setAreaSize(info.aid, parseInt(info.style.width, 10) + Math.abs(distY) + 0, null);
	} else {
		if (y > parseInt(info.style.left, 10) + parseInt(info.style.width, 10)) {
			this.setAreaSize(info.aid, y - parseInt(info.style.left, 10) + 0, null);
		}
	}
	if (x < parseInt(info.style.top, 10)) {
		info.style.top = x - 0 + "px";
		this.setAreaSize(info.aid, null, parseInt(info.style.height, 10) + Math.abs(distX) + 0);
	} else {
		if (x > parseInt(info.style.top, 10) + parseInt(info.style.height, 10)) {
			this.setAreaSize(info.aid, null, x - parseInt(info.style.top, 10) + 0);
		}
	}
};
imgmap.prototype._polygonshrink = function(info) {
	info.style.left = info.xpoints[0] + "px";
	info.style.top = info.ypoints[0] + "px";
	this.setAreaSize(info.aid, 0, 0);
	var i = 0;
	var valuesLen = info.xpoints.length;
	for (; i < valuesLen; i++) {
		this._polygongrow(info, info.xpoints[i], info.ypoints[i]);
	}
	this._repaint(info, this.config.CL_NORM_SHAPE);
};
imgmap.prototype.img_mousemove = function(x) {
	var width;
	var y;
	var height;
	var top;
	y = this._getPos(this.pic);
	width = this.isMSIE ? window.event.x + this.pic_container.scrollLeft - this.pic.offsetLeft : x.clientX - y.x;
	y = this.isMSIE ? window.event.y + this.pic_container.scrollTop - this.pic.offsetTop : x.clientY - y.y;
	if (!(0 > width || (0 > y || (width > this.pic.width || y > this.pic.height)))) {
		if (this.memory[this.currentid]) {
			top = this.memory[this.currentid].top;
			var left = this.memory[this.currentid].left;
			height = this.memory[this.currentid].height;
			var w = this.memory[this.currentid].width;
		}
		var info = this.areas[this.currentid];
		if (this.isSafari) {
			if (x.shiftKey) {
				if (this.is_drawing == this.DM_RECTANGLE_DRAW) {
					this.is_drawing = this.DM_SQUARE_DRAW;
					this.statusMessage(this.strings.SQUARE2_DRAW);
				}
			} else {
				if (this.is_drawing == this.DM_SQUARE_DRAW) {
					if ("rect" == info.shape) {
						this.is_drawing = this.DM_RECTANGLE_DRAW;
						this.statusMessage(this.strings.RECTANGLE_DRAW);
					}
				}
			}
		}
		if (this.is_drawing == this.DM_RECTANGLE_DRAW) {
			if (this.fireEvent("onDrawArea", this.currentid), height = width - this.memory[this.currentid].downx, top = y - this.memory[this.currentid].downy, this.setAreaSize(this.currentid, Math.abs(height), Math.abs(top)), 0 > height && (info.style.left = width + 1 + "px"), 0 > top) {
				info.style.top = y + 1 + "px";
			}
		} else {
			if (this.is_drawing == this.DM_SQUARE_DRAW) {
				if (this.fireEvent("onDrawArea", this.currentid), height = width - this.memory[this.currentid].downx, top = y - this.memory[this.currentid].downy, x = Math.abs(height) < Math.abs(top) ? Math.abs(parseInt(height, 10)) : Math.abs(parseInt(top, 10)), this.setAreaSize(this.currentid, x, x), 0 > height && (info.style.left = this.memory[this.currentid].downx + -1 * x + "px"), 0 > top) {
					info.style.top = this.memory[this.currentid].downy + -1 * x + 1 + "px";
				}
			} else {
				if (this.is_drawing == this.DM_POLYGON_DRAW) {
					this.fireEvent("onDrawArea", this.currentid);
					this._polygongrow(info, width, y);
				} else {
					if (this.is_drawing == this.DM_RECTANGLE_MOVE || this.is_drawing == this.DM_SQUARE_MOVE) {
						this.fireEvent("onMoveArea", this.currentid);
						width -= this.memory[this.currentid].rdownx;
						y -= this.memory[this.currentid].rdowny;
						if (width + w > this.pic.width || (y + height > this.pic.height || (0 > width || 0 > y))) {
							return;
						}
						info.style.left = width + 1 + "px";
						info.style.top = y + 1 + "px";
					} else {
						if (this.is_drawing == this.DM_POLYGON_MOVE) {
							this.fireEvent("onMoveArea", this.currentid);
							width -= this.memory[this.currentid].rdownx;
							y -= this.memory[this.currentid].rdowny;
							if (width + w > this.pic.width || (y + height > this.pic.height || (0 > width || 0 > y))) {
								return;
							}
							height = width - left;
							top = y - top;
							if (info.xpoints) {
								w = 0;
								x = info.xpoints.length;
								for (; w < x; w++) {
									info.xpoints[w] = this.memory[this.currentid].xpoints[w] + height;
									info.ypoints[w] = this.memory[this.currentid].ypoints[w] + top;
								}
							}
							info.style.left = width + "px";
							info.style.top = y + "px";
						} else {
							if (this.is_drawing == this.DM_SQUARE_RESIZE_LEFT) {
								this.fireEvent("onResizeArea", this.currentid);
								x = width - left;
								if (0 < w + -1 * x) {
									info.style.left = width + 1 + "px";
									info.style.top = top + x / 2 + "px";
									this.setAreaSize(this.currentid, parseInt(w + -1 * x, 10), parseInt(height + -1 * x, 10));
								} else {
									this.memory[this.currentid].width = 0;
									this.memory[this.currentid].height = 0;
									this.memory[this.currentid].left = width;
									this.memory[this.currentid].top = y;
									this.is_drawing = this.DM_SQUARE_RESIZE_RIGHT;
								}
							} else {
								if (this.is_drawing == this.DM_SQUARE_RESIZE_RIGHT) {
									this.fireEvent("onResizeArea", this.currentid);
									x = width - left - w;
									if (0 < w + x - 1) {
										info.style.top = top + -1 * x / 2 + "px";
										this.setAreaSize(this.currentid, w + x - 1, height + x);
									} else {
										this.memory[this.currentid].width = 0;
										this.memory[this.currentid].height = 0;
										this.memory[this.currentid].left = width;
										this.memory[this.currentid].top = y;
										this.is_drawing = this.DM_SQUARE_RESIZE_LEFT;
									}
								} else {
									if (this.is_drawing == this.DM_SQUARE_RESIZE_TOP) {
										this.fireEvent("onResizeArea", this.currentid);
										x = y - top;
										if (0 < w + -1 * x) {
											info.style.top = y + 1 + "px";
											info.style.left = left + x / 2 + "px";
											this.setAreaSize(this.currentid, w + -1 * x, height + -1 * x);
										} else {
											this.memory[this.currentid].width = 0;
											this.memory[this.currentid].height = 0;
											this.memory[this.currentid].left = width;
											this.memory[this.currentid].top = y;
											this.is_drawing = this.DM_SQUARE_RESIZE_BOTTOM;
										}
									} else {
										if (this.is_drawing == this.DM_SQUARE_RESIZE_BOTTOM) {
											this.fireEvent("onResizeArea", this.currentid);
											x = y - top - height;
											if (0 < w + x - 1) {
												info.style.left = left + -1 * x / 2 + "px";
												this.setAreaSize(this.currentid, w + x - 1, height + x - 1);
											} else {
												this.memory[this.currentid].width = 0;
												this.memory[this.currentid].height = 0;
												this.memory[this.currentid].left = width;
												this.memory[this.currentid].top = y;
												this.is_drawing = this.DM_SQUARE_RESIZE_TOP;
											}
										} else {
											if (this.is_drawing == this.DM_RECTANGLE_RESIZE_LEFT) {
												this.fireEvent("onResizeArea", this.currentid);
												height = width - left;
												if (0 < w + -1 * height) {
													info.style.left = width + 1 + "px";
													this.setAreaSize(this.currentid, w + -1 * height, null);
												} else {
													this.memory[this.currentid].width = 0;
													this.memory[this.currentid].left = width;
													this.is_drawing = this.DM_RECTANGLE_RESIZE_RIGHT;
												}
											} else {
												if (this.is_drawing == this.DM_RECTANGLE_RESIZE_RIGHT) {
													this.fireEvent("onResizeArea", this.currentid);
													height = width - left - w;
													if (0 < w + height - 1) {
														this.setAreaSize(this.currentid, w + height - 1, null);
													} else {
														this.memory[this.currentid].width = 0;
														this.memory[this.currentid].left = width;
														this.is_drawing = this.DM_RECTANGLE_RESIZE_LEFT;
													}
												} else {
													if (this.is_drawing == this.DM_RECTANGLE_RESIZE_TOP) {
														this.fireEvent("onResizeArea", this.currentid);
														top = y - top;
														if (0 < height + -1 * top) {
															info.style.top = y + 1 + "px";
															this.setAreaSize(this.currentid, null, height + -1 * top);
														} else {
															this.memory[this.currentid].height = 0;
															this.memory[this.currentid].top = y;
															this.is_drawing = this.DM_RECTANGLE_RESIZE_BOTTOM;
														}
													} else {
														if (this.is_drawing == this.DM_RECTANGLE_RESIZE_BOTTOM) {
															this.fireEvent("onResizeArea", this.currentid);
															top = y - top - height;
															if (0 < height + top - 1) {
																this.setAreaSize(this.currentid, null, height + top - 1);
															} else {
																this.memory[this.currentid].height = 0;
																this.memory[this.currentid].top = y;
																this.is_drawing = this.DM_RECTANGLE_RESIZE_TOP;
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		if (this.is_drawing) {
			this._repaint(info, this.config.CL_DRAW_SHAPE, width, y);
			this._updatecoords(this.currentid);
		}
	}
};
imgmap.prototype.img_mouseup = function(t) {
	var startTouch = this._getPos(this.pic);
	var isMSIE = this.isMSIE ? window.event.x + this.pic_container.scrollLeft - this.pic.offsetLeft : t.clientX - startTouch.x;
	t = this.isMSIE ? window.event.y + this.pic_container.scrollTop - this.pic.offsetTop : t.clientY - startTouch.y;
	if (this.is_drawing != this.DM_RECTANGLE_DRAW) {
		if (this.is_drawing != this.DM_SQUARE_DRAW && (this.is_drawing != this.DM_POLYGON_DRAW && this.is_drawing != this.DM_POLYGON_LASTDRAW)) {
			this.draggedId = null;
			this.is_drawing = 0;
			this.statusMessage(this.strings.READY);
			this.relaxArea(this.currentid);
			if (this.areas[this.currentid] != this._getLastArea()) {
				this.memory[this.currentid].downx = isMSIE;
				this.memory[this.currentid].downy = t;
			}
		}
	}
};
imgmap.prototype.img_mousedown = function(e) {
	var pos = this._getPos(this.pic);
	var intX = this.isMSIE ? window.event.x + this.pic_container.scrollLeft - this.pic.offsetLeft : e.clientX - pos.x;
	pos = this.isMSIE ? window.event.y + this.pic_container.scrollTop - this.pic.offsetTop : e.clientY - pos.y;
	if (!e) {
		e = window.event;
	}
	if (e.shiftKey) {
		if (this.is_drawing == this.DM_POLYGON_DRAW) {
			this.is_drawing = this.DM_POLYGON_LASTDRAW;
		}
	}
	e = this.areas[this.currentid];
	if (this.is_drawing == this.DM_POLYGON_DRAW) {
		e.xpoints[e.xpoints.length] = intX - 5;
		e.ypoints[e.ypoints.length] = pos - 5;
		this.memory[this.currentid].downx = intX;
		this.memory[this.currentid].downy = pos;
	} else {
		if (this.is_drawing && this.is_drawing != this.DM_POLYGON_DRAW) {
			if (this.is_drawing == this.DM_POLYGON_LASTDRAW) {
				e.xpoints[e.xpoints.length] = intX - 5;
				e.ypoints[e.ypoints.length] = pos - 5;
				this._updatecoords(this.currentid);
				this.is_drawing = 0;
				this._polygonshrink(e);
			}
			this.is_drawing = 0;
			this.statusMessage(this.strings.READY);
			this.relaxArea(this.currentid);
			this._getLastArea();
		} else {
			if (this.nextShape) {
				this.addNewArea();
				this.initArea(this.currentid, this.nextShape);
				if ("poly" == this.areas[this.currentid].shape) {
					this.is_drawing = this.DM_POLYGON_DRAW;
					this.statusMessage(this.strings.POLYGON_DRAW);
					this.areas[this.currentid].style.left = intX + "px";
					this.areas[this.currentid].style.top = pos + "px";
					this.areas[this.currentid].style.width = 0;
					this.areas[this.currentid].style.height = 0;
					this.areas[this.currentid].xpoints = [];
					this.areas[this.currentid].ypoints = [];
					this.areas[this.currentid].xpoints[0] = intX;
					this.areas[this.currentid].ypoints[0] = pos;
				} else {
					if ("rect" == this.areas[this.currentid].shape) {
						this.is_drawing = this.DM_RECTANGLE_DRAW;
						this.statusMessage(this.strings.RECTANGLE_DRAW);
						this.areas[this.currentid].style.left = intX + "px";
						this.areas[this.currentid].style.top = pos + "px";
						this.areas[this.currentid].style.width = 0;
						this.areas[this.currentid].style.height = 0;
					} else {
						if ("circle" == this.areas[this.currentid].shape) {
							this.is_drawing = this.DM_SQUARE_DRAW;
							this.statusMessage(this.strings.SQUARE_DRAW);
							this.areas[this.currentid].style.left = intX + "px";
							this.areas[this.currentid].style.top = pos + "px";
							this.areas[this.currentid].style.width = 0;
							this.areas[this.currentid].style.height = 0;
						}
					}
				}
				this._setBorder(this.areas[this.currentid], "DRAW");
				this.memory[this.currentid].downx = intX;
				this.memory[this.currentid].downy = pos;
			}
		}
	}
};
imgmap.prototype.highlightArea = function(name, dataAndEvents) {
	if (!this.is_drawing) {
		var info = this.areas[name];
		if (info) {
			if ("undefined" != info.shape) {
				if (dataAndEvents) {
					this.fireEvent("onFocusArea", info);
				}
				this._setBorder(info, "HIGHLIGHT");
				this._setopacity(info, this.config.CL_HIGHLIGHT_BG, "-" + this.config.highlight_opacity);
				this._repaint(info, this.config.CL_HIGHLIGHT_SHAPE);
			}
		}
	}
};
imgmap.prototype.blurArea = function(name, dataAndEvents) {
	if (!this.is_drawing) {
		var info = this.areas[name];
		if (info) {
			if ("undefined" != info.shape) {
				if (dataAndEvents) {
					this.fireEvent("onBlurArea", info);
				}
				this._setBorder(info, "NORM");
				this._setopacity(info, this.config.CL_NORM_BG, "-" + this.config.norm_opacity);
				this._repaint(info, this.config.CL_NORM_SHAPE);
			}
		}
	}
};
imgmap.prototype.area_mousemove = function(evt) {
	if (this.is_drawing) {
		this.img_mousemove(evt);
	} else {
		var info = this.isMSIE ? window.event.srcElement : evt.currentTarget;
		if ("DIV" == info.tagName) {
			info = info.parentNode;
		}
		if ("image" == info.tagName || ("group" == info.tagName || ("shape" == info.tagName || "stroke" == info.tagName))) {
			info = info.parentNode.parentNode;
		}
		if (this.isOpera) {
			evt.layerX = evt.offsetX;
			evt.layerY = evt.offsetY;
		}
		var x = this.isMSIE ? window.event.offsetX : evt.layerX;
		evt = this.isMSIE ? window.event.offsetY : evt.layerY;
		if (CKEDITOR.env.webkit) {
			x -= window.scrollX;
			evt -= window.scrollY;
		}
		var i = "rect" == info.shape || "circle" == info.shape;
		info.style.cursor = i && (6 > x && 6 < evt) ? "w-resize" : i && (x > parseInt(info.style.width, 10) - 6 && 6 < evt) ? "e-resize" : i && (6 < x && 6 > evt) ? "n-resize" : i && (evt > parseInt(info.style.height, 10) - 6 && 6 < x) ? "s-resize" : "move";
		if (info.aid != this.draggedId) {
			if ("move" == info.style.cursor) {
				info.style.cursor = "default";
			}
		} else {
			info = this.areas[this.currentid];
			if (6 > x && 6 < evt) {
				if ("circle" == info.shape) {
					this.is_drawing = this.DM_SQUARE_RESIZE_LEFT;
					this.statusMessage(this.strings.SQUARE_RESIZE_LEFT);
				} else {
					if ("rect" == info.shape) {
						this.is_drawing = this.DM_RECTANGLE_RESIZE_LEFT;
						this.statusMessage(this.strings.RECTANGLE_RESIZE_LEFT);
					}
				}
			} else {
				if (x > parseInt(info.style.width, 10) - 6 && 6 < evt) {
					if ("circle" == info.shape) {
						this.is_drawing = this.DM_SQUARE_RESIZE_RIGHT;
						this.statusMessage(this.strings.SQUARE_RESIZE_RIGHT);
					} else {
						if ("rect" == info.shape) {
							this.is_drawing = this.DM_RECTANGLE_RESIZE_RIGHT;
							this.statusMessage(this.strings.RECTANGLE_RESIZE_RIGHT);
						}
					}
				} else {
					if (6 < x && 6 > evt) {
						if ("circle" == info.shape) {
							this.is_drawing = this.DM_SQUARE_RESIZE_TOP;
							this.statusMessage(this.strings.SQUARE_RESIZE_TOP);
						} else {
							if ("rect" == info.shape) {
								this.is_drawing = this.DM_RECTANGLE_RESIZE_TOP;
								this.statusMessage(this.strings.RECTANGLE_RESIZE_TOP);
							}
						}
					} else {
						if (evt > parseInt(info.style.height, 10) - 6 && 6 < x) {
							if ("circle" == info.shape) {
								this.is_drawing = this.DM_SQUARE_RESIZE_BOTTOM;
								this.statusMessage(this.strings.SQUARE_RESIZE_BOTTOM);
							} else {
								if ("rect" == info.shape) {
									this.is_drawing = this.DM_RECTANGLE_RESIZE_BOTTOM;
									this.statusMessage(this.strings.RECTANGLE_RESIZE_BOTTOM);
								}
							}
						} else {
							if ("circle" == info.shape) {
								this.is_drawing = this.DM_SQUARE_MOVE;
								this.statusMessage(this.strings.SQUARE_MOVE);
								this.memory[this.currentid].rdownx = x;
								this.memory[this.currentid].rdowny = evt;
							} else {
								if ("rect" == info.shape) {
									this.is_drawing = this.DM_RECTANGLE_MOVE;
									this.statusMessage(this.strings.RECTANGLE_MOVE);
									this.memory[this.currentid].rdownx = x;
									this.memory[this.currentid].rdowny = evt;
								} else {
									if ("poly" == info.shape) {
										if (info.xpoints) {
											i = 0;
											var valuesLen = info.xpoints.length;
											for (; i < valuesLen; i++) {
												this.memory[this.currentid].xpoints[i] = info.xpoints[i];
												this.memory[this.currentid].ypoints[i] = info.ypoints[i];
											}
										}
										if ("poly" == info.shape) {
											this.is_drawing = this.DM_POLYGON_MOVE;
											this.statusMessage(this.strings.POLYGON_MOVE);
										}
										this.memory[this.currentid].rdownx = x;
										this.memory[this.currentid].rdowny = evt;
									}
								}
							}
						}
					}
				}
			}
			this.memory[this.currentid].width = parseInt(info.style.width, 10);
			this.memory[this.currentid].height = parseInt(info.style.height, 10);
			this.memory[this.currentid].top = parseInt(info.style.top, 10);
			this.memory[this.currentid].left = parseInt(info.style.left, 10);
			this._setBorder(info, "DRAW");
			this._setopacity(info, this.config.CL_DRAW_BG, this.config.draw_opacity);
		}
	}
};
imgmap.prototype.area_mouseup = function(p) {
	if (this.is_drawing) {
		this.img_mouseup(p);
	} else {
		p = this.isMSIE ? window.event.srcElement : p.currentTarget;
		if ("DIV" == p.tagName) {
			p = p.parentNode;
		}
		if ("image" == p.tagName || ("group" == p.tagName || ("shape" == p.tagName || "stroke" == p.tagName))) {
			p = p.parentNode.parentNode;
		}
		if (this.areas[this.currentid] != p && "undefined" == typeof p.aid) {
			this.log("Cannot identify target area", 1);
		} else {
			this.draggedId = null;
		}
	}
};
imgmap.prototype.area_mouseover = function(p) {
	if (!this.is_drawing) {
		p = this.isMSIE ? window.event.srcElement : p.currentTarget;
		if ("DIV" == p.tagName) {
			p = p.parentNode;
		}
		if ("image" == p.tagName || ("group" == p.tagName || ("shape" == p.tagName || "stroke" == p.tagName))) {
			p = p.parentNode.parentNode;
		}
		this.highlightArea(p.aid, true);
	}
};
imgmap.prototype.area_mouseout = function(p) {
	if (!this.is_drawing) {
		p = this.isMSIE ? window.event.srcElement : p.currentTarget;
		if ("DIV" == p.tagName) {
			p = p.parentNode;
		}
		if ("image" == p.tagName || ("group" == p.tagName || ("shape" == p.tagName || "stroke" == p.tagName))) {
			p = p.parentNode.parentNode;
		}
		if (this.currentid != p.aid) {
			this.blurArea(p.aid, true);
		}
	}
};
imgmap.prototype.area_dblclick = function(event) {
	if (!this.is_drawing) {
		var a = this.isMSIE ? window.event.srcElement : event.currentTarget;
		if ("DIV" == a.tagName) {
			a = a.parentNode;
		}
		if ("image" == a.tagName || ("group" == a.tagName || ("shape" == a.tagName || "stroke" == a.tagName))) {
			a = a.parentNode.parentNode;
		}
		if (this.areas[this.currentid] != a) {
			if ("undefined" == typeof a.aid) {
				this.log("Cannot identify target area", 1);
				return;
			}
			this.blurArea(this.currentid);
			this.currentid = a.aid;
		}
		this.fireEvent("onDblClickArea", this.areas[this.currentid]);
		if (this.isMSIE) {
			window.event.cancelBubble = true;
		} else {
			event.stopPropagation();
		}
	}
};
imgmap.prototype.area_mousedown = function(e) {
	if (this.is_drawing) {
		this.img_mousedown(e);
	} else {
		var a = this.isMSIE ? window.event.srcElement : e.currentTarget;
		if ("DIV" == a.tagName) {
			a = a.parentNode;
		}
		if ("image" == a.tagName || ("group" == a.tagName || ("shape" == a.tagName || "stroke" == a.tagName))) {
			a = a.parentNode.parentNode;
		}
		if (this.areas[this.currentid] != a) {
			if ("undefined" == typeof a.aid) {
				this.log("Cannot identify target area", 1);
				return;
			}
			this.blurArea(this.currentid);
			this.currentid = a.aid;
		}
		this.selectedId = this.draggedId = this.currentid;
		this.fireEvent("onSelectArea", this.areas[this.currentid]);
		if (this.isMSIE) {
			window.event.cancelBubble = true;
		} else {
			e.stopPropagation();
		}
	}
};
imgmap.prototype.doc_keydown = function(e) {
	e = this.isMSIE ? event.keyCode : e.keyCode;
	if (46 == e) {
		if (null !== this.selectedId) {
			if (!this.is_drawing) {
				this.removeArea(this.selectedId);
			}
		}
	} else {
		if (16 == e) {
			if (this.is_drawing == this.DM_RECTANGLE_DRAW) {
				this.is_drawing = this.DM_SQUARE_DRAW;
				this.statusMessage(this.strings.SQUARE2_DRAW);
			}
		}
	}
};
imgmap.prototype.doc_keyup = function(e) {
	if (16 == (this.isMSIE ? event.keyCode : e.keyCode) && (this.is_drawing == this.DM_SQUARE_DRAW && "rect" == this.areas[this.currentid].shape)) {
		this.is_drawing = this.DM_RECTANGLE_DRAW;
		this.statusMessage(this.strings.RECTANGLE_DRAW);
	}
};
imgmap.prototype.doc_mousedown = function() {
	if (!this.is_drawing) {
		this.selectedId = null;
	}
};
imgmap.prototype._getPos = function(r) {
	r = r.getBoundingClientRect();
	return {
		x: r.left,
		y: r.top
	};
};
imgmap.prototype._getLastArea = function() {
	var unlock = this.areas.length - 1;
	for (; 0 <= unlock; unlock--) {
		if (this.areas[unlock]) {
			return this.areas[unlock];
		}
	}
	return null;
};
imgmap.prototype.assignCSS = function(node, pair) {
	var parameters = pair.split(";");
	var p = 0;
	for (; p < parameters.length; p++) {
		var trim = parameters[p].split(":");
		var nameParts = this.trim(trim[0]).split("-");
		var name = nameParts[0];
		var i = 1;
		for (; i < nameParts.length; i++) {
			name += nameParts[i].replace(/^\w/, nameParts[i].substring(0, 1).toUpperCase());
		}
		node.style[this.trim(name)] = this.trim(trim[1]);
	}
};
imgmap.prototype.fireEvent = function(index, data) {
	if ("function" == typeof this.config.custom_callbacks[index]) {
		return this.config.custom_callbacks[index](data);
	}
};
imgmap.prototype.setAreaSize = function(item, x, y) {
	if (null === item) {
		item = this.currentid;
	}
	item = this.areas[item];
	if (null !== x) {
		item.width = x;
		item.style.width = x + "px";
		item.setAttribute("width", x);
	}
	if (null !== y) {
		item.height = y;
		item.style.height = y + "px";
		item.setAttribute("height", y);
	}
};
imgmap.prototype.detectLanguage = function() {
	var moduleNamePlusExt;
	if (navigator.userLanguage) {
		moduleNamePlusExt = navigator.userLanguage.toLowerCase();
	} else {
		if (navigator.language) {
			moduleNamePlusExt = navigator.language.toLowerCase();
		} else {
			return this.config.defaultLang;
		}
	}
	return 2 <= moduleNamePlusExt.length ? moduleNamePlusExt = moduleNamePlusExt.substring(0, 2) : this.config.defaultLang;
};
imgmap.prototype.disableSelection = function(element) {
	if ("undefined" == typeof element || !element) {
		return false;
	}
	if ("undefined" != typeof element.onselectstart) {
		element.onselectstart = function() {
			return false;
		};
	}
	if ("undefined" != typeof element.unselectable) {
		element.unselectable = "on";
	}
	if ("undefined" != typeof element.style.MozUserSelect) {
		element.style.MozUserSelect = "none";
	}
};
Function.prototype.bind = function(selfObj) {
	var matcherFunction = this;
	return function() {
		return matcherFunction.apply(selfObj, arguments);
	};
};
imgmap.prototype.trim = function(str) {
	return str.replace(/^\s+|\s+$/g, "");
};
if (!document.createElement("canvas").getContext) {
	(function() {
		function getContext() {
			return this.context_ || (this.context_ = new CanvasRenderingContext2D_(this));
		}

		function bind(fn, scope) {
			var args = __slice.call(arguments, 2);
			return function() {
				return fn.apply(scope, args.concat(__slice.call(arguments)));
			};
		}

		function onPropertyChange(e) {
			var el = e.srcElement;
			switch (e.propertyName) {
				case "width":
					el.style.width = el.attributes.width.nodeValue + "px";
					el.getContext().clearRect();
					break;
				case "height":
					el.style.height = el.attributes.height.nodeValue + "px";
					el.getContext().clearRect();
			}
		}

		function onResize(element) {
			element = element.srcElement;
			if (element.firstChild) {
				element.firstChild.style.width = element.clientWidth + "px";
				element.firstChild.style.height = element.clientHeight + "px";
			}
		}

		function createMatrixIdentity() {
			return [
				[1, 0, 0],
				[0, 1, 0],
				[0, 0, 1]
			];
		}

		function matrixMultiply(m2, codeSegments) {
			var result = createMatrixIdentity();
			var j;
			var x;
			var i;
			var z = 0;
			for (; 3 > z; z++) {
				j = 0;
				for (; 3 > j; j++) {
					i = x = 0;
					for (; 3 > i; i++) {
						x += m2[z][i] * codeSegments[i][j];
					}
					result[z][j] = x;
				}
			}
			return result;
		}

		function copyState(o1, o2) {
			o2.fillStyle = o1.fillStyle;
			o2.lineCap = o1.lineCap;
			o2.lineJoin = o1.lineJoin;
			o2.lineWidth = o1.lineWidth;
			o2.miterLimit = o1.miterLimit;
			o2.shadowBlur = o1.shadowBlur;
			o2.shadowColor = o1.shadowColor;
			o2.shadowOffsetX = o1.shadowOffsetX;
			o2.shadowOffsetY = o1.shadowOffsetY;
			o2.strokeStyle = o1.strokeStyle;
			o2.globalAlpha = o1.globalAlpha;
			o2.arcScaleX_ = o1.arcScaleX_;
			o2.arcScaleY_ = o1.arcScaleY_;
			o2.lineScale_ = o1.lineScale_;
		}

		function processStyle(data) {
			var index;
			var alpha = 1;
			var pos;
			if (data = "" + data, "rgb" == data.substring(0, 3)) {
				index = data.indexOf("(", 3);
				pos = data.indexOf(")", index + 1);
				var values = data.substring(index + 1, pos).split(",");
				index = "#";
				pos = 0;
				for (; 3 > pos; pos++) {
					index += dec2hex[Number(values[pos])];
				}
				if (4 == values.length) {
					if ("a" == data.substr(3, 1)) {
						alpha = values[3];
					}
				}
			} else {
				index = data;
			}
			return {
				color: index,
				alpha: alpha
			};
		}

		function processLineCap(lineCap) {
			switch (lineCap) {
				case "butt":
					return "flat";
				case "round":
					return "round";
				default:
					return "square";
			}
		}

		function CanvasRenderingContext2D_(surfaceElement) {
			this.m_ = createMatrixIdentity();
			this.mStack_ = [];
			this.aStack_ = [];
			this.currentPath_ = [];
			this.fillStyle = this.strokeStyle = "#000";
			this.lineWidth = 1;
			this.lineJoin = "miter";
			this.lineCap = "butt";
			this.miterLimit = 1 * Z;
			this.globalAlpha = 1;
			this.canvas = surfaceElement;
			var el = surfaceElement.ownerDocument.createElement("div");
			el.style.width = surfaceElement.clientWidth + "px";
			el.style.height = surfaceElement.clientHeight + "px";
			el.style.overflow = "hidden";
			el.style.position = "absolute";
			surfaceElement.appendChild(el);
			this.element_ = el;
			this.lineScale_ = this.arcScaleY_ = this.arcScaleX_ = 1;
		}

		function bezierCurveTo(self, v11, x1, p) {
			self.currentPath_.push({
				type: "bezierCurveTo",
				cp1x: v11.x,
				cp1y: v11.y,
				cp2x: x1.x,
				cp2y: x1.y,
				x: p.x,
				y: p.y
			});
			self.currentX_ = p.x;
			self.currentY_ = p.y;
		}

		function setM(ctx, m, recurring) {
			var k;
			a: {
				var n = 0;
				for (; 3 > n; n++) {
					k = 0;
					for (; 2 > k; k++) {
						if (!isFinite(m[n][k]) || isNaN(m[n][k])) {
							k = false;
							break a;
						}
					}
				}
				k = true;
			}
			if (k && (ctx.m_ = m, recurring)) {
				ctx.lineScale_ = sqrt(abs(m[0][0] * m[1][1] - m[0][1] * m[1][0]));
			}
		}

		function CanvasGradient_(aType) {
			this.type_ = aType;
			this.r1_ = this.y1_ = this.x1_ = this.r0_ = this.y0_ = this.x0_ = 0;
			this.colors_ = [];
		}

		function CanvasPattern_() {}
		var m = Math;
		var mr = m.round;
		var ms = m.sin;
		var mc = m.cos;
		var abs = m.abs;
		var sqrt = m.sqrt;
		var Z = 10;
		var Z2 = Z / 2;
		var __slice = Array.prototype.slice;
		var G_vmlCanvasManager_ = {
			init: function(doc) {
				if (/MSIE/.test(navigator.userAgent)) {
					if (!window.opera) {
						doc = doc || document;
						doc.createElement("canvas");
						if ("complete" !== doc.readyState) {
							doc.attachEvent("onreadystatechange", bind(this.init_, this, doc));
						} else {
							this.init_(doc);
						}
					}
				}
			},
			init_: function(doc) {
				var ss;
				if (!doc.namespaces.g_vml_) {
					doc.namespaces.add("g_vml_", "urn:schemas-microsoft-com:vml", "#default#VML");
				}
				if (!doc.namespaces.g_o_) {
					doc.namespaces.add("g_o_", "urn:schemas-microsoft-com:office:office", "#default#VML");
				}
				if (!doc.styleSheets.ex_canvas_) {
					ss = doc.createStyleSheet();
					ss.owningElement.id = "ex_canvas_";
					ss.cssText = "canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}g_vml_\\:*{behavior:url(#default#VML)}g_o_\\:*{behavior:url(#default#VML)}";
				}
				doc = doc.getElementsByTagName("canvas");
				ss = 0;
				for (; ss < doc.length; ss++) {
					this.initElement(doc[ss]);
				}
			},
			initElement: function(el) {
				if (!el.getContext) {
					el.getContext = getContext;
					el.innerHTML = "";
					el.attachEvent("onpropertychange", onPropertyChange);
					el.attachEvent("onresize", onResize);
					var attrs = el.attributes;
					if (attrs.width && attrs.width.specified) {
						el.style.width = attrs.width.nodeValue + "px";
					} else {
						el.width = el.clientWidth;
					}
					if (attrs.height && attrs.height.specified) {
						el.style.height = attrs.height.nodeValue + "px";
					} else {
						el.height = el.clientHeight;
					}
				}
				return el;
			}
		};
		var dec2hex;
		var ctx;
		var j;
		G_vmlCanvasManager_.init();
		dec2hex = [];
		ctx = 0;
		for (; 16 > ctx; ctx++) {
			j = 0;
			for (; 16 > j; j++) {
				dec2hex[16 * ctx + j] = ctx.toString(16) + j.toString(16);
			}
		}
		ctx = CanvasRenderingContext2D_.prototype;
		ctx.clearRect = function() {
			this.element_.innerHTML = "";
		};
		ctx.beginPath = function() {
			this.currentPath_ = [];
		};
		ctx.moveTo = function(aX, aY) {
			var p = this.getCoords_(aX, aY);
			this.currentPath_.push({
				type: "moveTo",
				x: p.x,
				y: p.y
			});
			this.currentX_ = p.x;
			this.currentY_ = p.y;
		};
		ctx.lineTo = function(aX, aY) {
			var p = this.getCoords_(aX, aY);
			this.currentPath_.push({
				type: "lineTo",
				x: p.x,
				y: p.y
			});
			this.currentX_ = p.x;
			this.currentY_ = p.y;
		};
		ctx.bezierCurveTo = function(c, aCP1y, x1, aCP2y, p, aY) {
			p = this.getCoords_(p, aY);
			c = this.getCoords_(c, aCP1y);
			x1 = this.getCoords_(x1, aCP2y);
			bezierCurveTo(this, c, x1, p);
		};
		ctx.quadraticCurveTo = function(x1, aCPy, p, y) {
			x1 = this.getCoords_(x1, aCPy);
			p = this.getCoords_(p, y);
			y = {
				x: this.currentX_ + 2 / 3 * (x1.x - this.currentX_),
				y: this.currentY_ + 2 / 3 * (x1.y - this.currentY_)
			};
			bezierCurveTo(this, y, {
				x: y.x + (p.x - this.currentX_) / 3,
				y: y.y + (p.y - this.currentY_) / 3
			}, p);
		};
		ctx.arc = function(cx, aY, aRadius, aStartAngle, aEndAngle, clockwise) {
			aRadius = aRadius * Z;
			var arcType = clockwise ? "at" : "wa";
			var ll = cx + mc(aStartAngle) * aRadius - Z2;
			var yStart = aY + ms(aStartAngle) * aRadius - Z2;
			aStartAngle = cx + mc(aEndAngle) * aRadius - Z2;
			aEndAngle = aY + ms(aEndAngle) * aRadius - Z2;
			if (!(ll != aStartAngle)) {
				if (!clockwise) {
					ll += 0.125;
				}
			}
			cx = this.getCoords_(cx, aY);
			ll = this.getCoords_(ll, yStart);
			aStartAngle = this.getCoords_(aStartAngle, aEndAngle);
			this.currentPath_.push({
				type: arcType,
				x: cx.x,
				y: cx.y,
				radius: aRadius,
				xStart: ll.x,
				yStart: ll.y,
				xEnd: aStartAngle.x,
				yEnd: aStartAngle.y
			});
		};
		ctx.rect = function(aX, aY, aWidth, aHeight) {
			this.moveTo(aX, aY);
			this.lineTo(aX + aWidth, aY);
			this.lineTo(aX + aWidth, aY + aHeight);
			this.lineTo(aX, aY + aHeight);
			this.closePath();
		};
		ctx.strokeRect = function(aX, aY, aWidth, aHeight) {
			var oldPath = this.currentPath_;
			this.beginPath();
			this.moveTo(aX, aY);
			this.lineTo(aX + aWidth, aY);
			this.lineTo(aX + aWidth, aY + aHeight);
			this.lineTo(aX, aY + aHeight);
			this.closePath();
			this.stroke();
			this.currentPath_ = oldPath;
		};
		ctx.fillRect = function(aX, aY, aWidth, aHeight) {
			var oldPath = this.currentPath_;
			this.beginPath();
			this.moveTo(aX, aY);
			this.lineTo(aX + aWidth, aY);
			this.lineTo(aX + aWidth, aY + aHeight);
			this.lineTo(aX, aY + aHeight);
			this.closePath();
			this.fill();
			this.currentPath_ = oldPath;
		};
		ctx.createLinearGradient = function(aX0, aY0, aX1, aY1) {
			var gradient = new CanvasGradient_("gradient");
			return gradient.x0_ = aX0, gradient.y0_ = aY0, gradient.x1_ = aX1, gradient.y1_ = aY1, gradient;
		};
		ctx.createRadialGradient = function(aX0, aY0, aR0, aX1, aY1, aR1) {
			var gradient = new CanvasGradient_("gradientradial");
			return gradient.x0_ = aX0, gradient.y0_ = aY0, gradient.r0_ = aR0, gradient.x1_ = aX1, gradient.y1_ = aY1, gradient.r1_ = aR1, gradient;
		};
		ctx.drawImage = function(image) {
			var dx;
			var dy;
			var dw;
			var dh;
			var sx;
			var sy;
			var sw;
			var sh;
			dw = image.runtimeStyle.width;
			dh = image.runtimeStyle.height;
			var w;
			var h;
			var filter;
			if (image.runtimeStyle.width = "auto", image.runtimeStyle.height = "auto", w = image.width, h = image.height, image.runtimeStyle.width = dw, image.runtimeStyle.height = dh, 3 == arguments.length) {
				dx = arguments[1];
				dy = arguments[2];
				sx = sy = 0;
				sw = dw = w;
				sh = dh = h;
			} else {
				if (5 == arguments.length) {
					dx = arguments[1];
					dy = arguments[2];
					dw = arguments[3];
					dh = arguments[4];
					sx = sy = 0;
					sw = w;
					sh = h;
				} else {
					if (9 == arguments.length) {
						sx = arguments[1];
						sy = arguments[2];
						sw = arguments[3];
						sh = arguments[4];
						dx = arguments[5];
						dy = arguments[6];
						dw = arguments[7];
						dh = arguments[8];
					} else {
						throw Error("Invalid number of arguments");
					}
				}
			}
			var d = this.getCoords_(dx, dy);
			var vmlStr = [];
			if (vmlStr.push(" <g_vml_:group", ' coordsize="', 10 * Z, ",", 10 * Z, '"', ' coordorigin="0,0"', ' style="width:', 10, "px;height:", 10, "px;position:absolute;"), 1 != this.m_[0][0] || this.m_[0][1]) {
				filter = [];
				filter.push("M11=", this.m_[0][0], ",", "M12=", this.m_[1][0], ",", "M21=", this.m_[0][1], ",", "M22=", this.m_[1][1], ",", "Dx=", mr(d.x / Z), ",", "Dy=", mr(d.y / Z), "");
				var c2 = this.getCoords_(dx + dw, dy);
				var c3 = this.getCoords_(dx, dy + dh);
				dx = this.getCoords_(dx + dw, dy + dh);
				d.x = m.max(d.x, c2.x, c3.x, dx.x);
				d.y = m.max(d.y, c2.y, c3.y, dx.y);
				vmlStr.push("padding:0 ", mr(d.x / Z), "px ", mr(d.y / Z), "px 0;filter:progid:DXImageTransform.Microsoft.Matrix(", filter.join(""), ", sizingmethod='clip');");
			} else {
				vmlStr.push("top:", mr(d.y / Z), "px;left:", mr(d.x / Z), "px;");
			}
			vmlStr.push(' ">', '<g_vml_:image src="', image.src, '"', ' style="width:', Z * dw, "px;", " height:", Z * dh, 'px;"', ' cropleft="', sx / w, '"', ' croptop="', sy / h, '"', ' cropright="', (w - sx - sw) / w, '"', ' cropbottom="', (h - sy - sh) / h, '"', " />", "</g_vml_:group>");
			this.element_.insertAdjacentHTML("BeforeEnd", vmlStr.join(""));
		};
		ctx.stroke = function(aFill) {
			var lineStr = [];
			var a = processStyle(aFill ? this.fillStyle : this.strokeStyle);
			var fillStyle = a.color;
			a = a.alpha * this.globalAlpha;
			var p;
			var i;
			var x;
			var h;
			lineStr.push("<g_vml_:shape", ' filled="', !!aFill, '"', ' style="position:absolute;width:', 10, "px;height:", 10, 'px;"', ' coordorigin="0 0" coordsize="', 10 * Z, " ", 10 * Z, '"', ' stroked="', !aFill, '"', ' path="');
			var maxX = h = x = null;
			var height = null;
			i = 0;
			for (; i < this.currentPath_.length; i++) {
				p = this.currentPath_[i];
				switch (p.type) {
					case "moveTo":
						lineStr.push(" m ", mr(p.x), ",", mr(p.y));
						break;
					case "lineTo":
						lineStr.push(" l ", mr(p.x), ",", mr(p.y));
						break;
					case "close":
						lineStr.push(" x ");
						p = null;
						break;
					case "bezierCurveTo":
						lineStr.push(" c ", mr(p.cp1x), ",", mr(p.cp1y), ",", mr(p.cp2x), ",", mr(p.cp2y), ",", mr(p.x), ",", mr(p.y));
						break;
					case "at":
						;
					case "wa":
						lineStr.push(" ", p.type, " ", mr(p.x - this.arcScaleX_ * p.radius), ",", mr(p.y - this.arcScaleY_ * p.radius), " ", mr(p.x + this.arcScaleX_ * p.radius), ",", mr(p.y + this.arcScaleY_ * p.radius), " ", mr(p.xStart), ",", mr(p.yStart), " ", mr(p.xEnd), ",", mr(p.yEnd));
				}
				if (p) {
					if (null == x || p.x < x) {
						x = p.x;
					}
					if (null == maxX || p.x > maxX) {
						maxX = p.x;
					}
					if (null == h || p.y < h) {
						h = p.y;
					}
					if (null == height || p.y > height) {
						height = p.y;
					}
				}
			}
			if (lineStr.push(' ">'), aFill) {
				if ("object" == typeof this.fillStyle) {
					fillStyle = this.fillStyle;
					var c = 0;
					p = a = aFill = 0;
					var y = 1;
					if ("gradient" == fillStyle.type_) {
						c = fillStyle.x1_ / this.arcScaleX_;
						x = fillStyle.y1_ / this.arcScaleY_;
						i = this.getCoords_(fillStyle.x0_ / this.arcScaleX_, fillStyle.y0_ / this.arcScaleY_);
						c = this.getCoords_(c, x);
						c = 180 * Math.atan2(c.x - i.x, c.y - i.y) / Math.PI;
						if (0 > c) {
							c += 360;
						}
						if (1E-6 > c) {
							c = 0;
						}
					} else {
						i = this.getCoords_(fillStyle.x0_, fillStyle.y0_);
						p = maxX - x;
						y = height - h;
						aFill = (i.x - x) / p;
						a = (i.y - h) / y;
						p /= this.arcScaleX_ * Z;
						y /= this.arcScaleY_ * Z;
						i = m.max(p, y);
						p = 2 * fillStyle.r0_ / i;
						y = 2 * fillStyle.r1_ / i - p;
					}
					x = fillStyle.colors_;
					x.sort(function(a, b) {
						return a.offset - b.offset;
					});
					height = x.length;
					maxX = x[0].color;
					var color2 = x[height - 1].color;
					var opacity1 = x[0].alpha * this.globalAlpha;
					var opacity2 = x[height - 1].alpha * this.globalAlpha;
					var tagNameArr = [];
					i = 0;
					for (; i < height; i++) {
						h = x[i];
						tagNameArr.push(h.offset * y + p + " " + h.color);
					}
					lineStr.push('<g_vml_:fill type="', fillStyle.type_, '"', ' method="none" focus="100%"', ' color="', maxX, '"', ' color2="', color2, '"', ' colors="', tagNameArr.join(","), '"', ' opacity="', opacity2, '"', ' g_o_:opacity2="', opacity1, '"', ' angle="', c, '"', ' focusposition="', aFill, ",", a, '" />');
				} else {
					lineStr.push('<g_vml_:fill color="', fillStyle, '" opacity="', a, '" />');
				}
			} else {
				aFill = this.lineScale_ * this.lineWidth;
				if (1 > aFill) {
					a *= aFill;
				}
				lineStr.push("<g_vml_:stroke", ' opacity="', a, '"', ' joinstyle="', this.lineJoin, '"', ' miterlimit="', this.miterLimit, '"', ' endcap="', processLineCap(this.lineCap), '"', ' weight="', aFill, 'px"', ' color="', fillStyle, '" />');
			}
			lineStr.push("</g_vml_:shape>");
			this.element_.insertAdjacentHTML("beforeEnd", lineStr.join(""));
		};
		ctx.fill = function() {
			this.stroke(true);
		};
		ctx.closePath = function() {
			this.currentPath_.push({
				type: "close"
			});
		};
		ctx.getCoords_ = function(x, aY) {
			var m = this.m_;
			return {
				x: Z * (x * m[0][0] + aY * m[1][0] + m[2][0]) - Z2,
				y: Z * (x * m[0][1] + aY * m[1][1] + m[2][1]) - Z2
			};
		};
		ctx.save = function() {
			var o = {};
			copyState(this, o);
			this.aStack_.push(o);
			this.mStack_.push(this.m_);
			this.m_ = matrixMultiply(createMatrixIdentity(), this.m_);
		};
		ctx.restore = function() {
			copyState(this.aStack_.pop(), this);
			this.m_ = this.mStack_.pop();
		};
		ctx.translate = function(aX, aY) {
			setM(this, matrixMultiply([
				[1, 0, 0],
				[0, 1, 0],
				[aX, aY, 1]
			], this.m_), false);
		};
		ctx.rotate = function(aRot) {
			var c = mc(aRot);
			aRot = ms(aRot);
			setM(this, matrixMultiply([
				[c, aRot, 0],
				[-aRot, c, 0],
				[0, 0, 1]
			], this.m_), false);
		};
		ctx.scale = function(aX, aY) {
			this.arcScaleX_ *= aX;
			this.arcScaleY_ *= aY;
			setM(this, matrixMultiply([
				[aX, 0, 0],
				[0, aY, 0],
				[0, 0, 1]
			], this.m_), true);
		};
		ctx.transform = function(m21, m11, m22, dy, tx, machineEndState) {
			setM(this, matrixMultiply([
				[m21, m11, 0],
				[m22, dy, 0],
				[tx, machineEndState, 1]
			], this.m_), true);
		};
		ctx.setTransform = function(m11, dx, m12, m22, dy, m21) {
			setM(this, [
				[m11, dx, 0],
				[m12, m22, 0],
				[dy, m21, 1]
			], true);
		};
		ctx.clip = function() {};
		ctx.arcTo = function() {};
		ctx.createPattern = function() {
			return new CanvasPattern_;
		};
		CanvasGradient_.prototype.addColorStop = function(aOffset, aColor) {
			aColor = processStyle(aColor);
			this.colors_.push({
				offset: aOffset,
				color: aColor.color,
				alpha: aColor.alpha
			});
		};
		G_vmlCanvasManager = G_vmlCanvasManager_;
		CanvasRenderingContext2D = CanvasRenderingContext2D_;
		CanvasGradient = CanvasGradient_;
		CanvasPattern = CanvasPattern_;
	})();
};