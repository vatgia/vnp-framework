/* aaaaaaaaaaaaaaa */
(function() {
	CKEDITOR.plugins.add("imagemaps", {
		requires: ["dialog"],
		lang: ["en", "de", "el", "es", "it", "nl", "sv", "tr"],
		init: function(a) {
			var e = a.lang.imagemaps;
			window.imgmapStrings = e.imgmapStrings;
			/*
			CKEDITOR.tools.extend(window.imgmapStrings, {
				READY: "",
				RECTANGLE_MOVE: "",
				RECTANGLE_RESIZE_TOP: "",
				RECTANGLE_RESIZE_RIGHT: "",
				RECTANGLE_RESIZE_BOTTOM: "",
				RECTANGLE_RESIZE_LEFT: "",
				SQUARE_DRAW: "",
				SQUARE_MOVE: "",
				SQUARE_RESIZE_TOP: "",
				SQUARE_RESIZE_RIGHT: "",
				SQUARE_RESIZE_BOTTOM: "",
				SQUARE_RESIZE_LEFT: "",
				POLYGON_MOVE: ""
			});
			*/
			CKEDITOR.dialog.add("ImageMaps", this.path + "dialog/imagemaps.js");
			var b = a.addCommand("imagemaps", new CKEDITOR.dialogCommand("ImageMaps", {
				allowedContent: "img[usemap];map[id,name];area[alt,coords,href,shape,target,title]",
				requiredContent: "img[src]"
			}));
			b.startDisabled = true;
			a.ui.addButton("ImageMaps", {
				label: e.toolbar,
				command: "imagemaps",
				toolbar: "insert,10"
			});
			if (a.addMenuItems) {
				a.addMenuItems({
					imagemaps: {
						label: e.menu,
						command: "imagemaps",
						group: "image",
						order: 1
					}
				});
			}
			if (a.contextMenu) {
				a.contextMenu.addListener(function(a) {
					a = d(a);
					return !a ? null : {
						imagemaps: a.hasAttribute("usemap") ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF
					};
				});
			}
			a.on("doubleclick", function(a) {
				var b = a.data.element;
				var e = a.editor;
				var j;
				if (b.is("area")) {
					var g = b.getParent().$.getAttribute("id");
					var i = e.editable ? e.editable().$ : e.document.$;
					if (i.querySelector) {
						j = i.querySelector('img[usemap="#' + g + '"]');
					}
					if (j) {
						e.getSelection().selectElement(new CKEDITOR.dom.element(j));
						a.data.dialog = "ImageMaps";
						return;
					}
				}
				if ((j = d(b)) && j.hasAttribute("usemap")) {
					e.getSelection().selectElement(j);
					a.data.dialog = "ImageMaps";
				}
			}, null, null, 20);
			if (a.widgets) {
				a.on("contentDom", function() {
					var b = a.editable();
					b.attachListener(b, "click", function(c) {
						var d = c.data.$;
						d = new CKEDITOR.dom.node(d.target || d.srcElement);
						if (d.is && d.is("area")) {
							if (CKEDITOR.env.ie) {
								c.data.preventDefault();
							}
							d = d.getParent().$.getAttribute("id");
							var e = b.$;
							if (e.querySelector) {
								if (d = e.querySelector('img[usemap="#' + d + '"]')) {
									if (d = a.widgets.getByElement(new CKEDITOR.dom.node(d))) {
										d.focus();
										c.data.preventDefault();
									}
								}
							}
						}
					});
				});
			}
			var d = function(b) {
				if (a.widgets) {
					var c = a.widgets.focused;
					if (!c) {
						if (c = a.widgets.getByElement(b)) {
							c.focus();
						}
					}
					if (c && (c.name == "image2" || c.name == "image")) {
						b = c.element;
						if (!b) {
							return null;
						}
						if (b.getName() == "img") {
							return b;
						}
						b = b.getElementsByTag("img");
						return b.count() == 1 ? b.getItem(0) : null;
					}
				}
				return !b || (!b.is("img") || (b.data && b.data("cke-realelement") || b.isReadOnly())) ? null : b;
			};
			a.on("selectionChange", CKEDITOR.tools.bind(function(a) {
				if (a = d(a.data.path.lastElement)) {
					this.setState(a.hasAttribute("usemap") ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
				} else {
					this.setState(CKEDITOR.TRISTATE_DISABLED);
				}
			}, b));
			if (!CKEDITOR.env.ie || (a.plugins.image2 || !(CKEDITOR.env.version < 9))) {
				CKEDITOR.on("dialogDefinition", function(b) {
					if (b.data.name == "image") {
						var c = b.data.definition;
						b.removeListener();
						c.onOk = CKEDITOR.tools.override(c.onOk, function(b) {
							return function() {
								b.call(this);
								var c = this.imageElement;
								var d = c.getAttribute("usemap");
								if (d) {
									if (d = (a.editable ? a.editable().$ : a.document.$).querySelector(d)) {
										CKEDITOR.plugins.imagemaps.drawMap(c.$, d);
									}
								}
							};
						});
					}
				});
				e = "dataReady";
				if (CKEDITOR.skins) {
					e = "contentDom";
				}
				a.on(e, function(a) {
					a = a.editor;
					a = a.editable ? a.editable().$ : a.document.$;
					var b = a.getElementsByTagName("map");
					var d = 0;
					for (; d < b.length; d++) {
						var e = b[d];
						var g = a.querySelector('img[usemap="#' + e.name + '"]');
						if (g) {
							CKEDITOR.plugins.imagemaps.drawMap(g, e);
						}
					}
				}, null, null, 50);
				if (!CKEDITOR.plugins.imagemaps) {
					CKEDITOR.plugins.imagemaps = {};
				}
				CKEDITOR.plugins.imagemaps.drawMap = function(a, b, d) {
					if (a.width) {
						if (!d) {
							if (a.attributes["data-cke-saved-src"]) {
								var e = new Image;
								e.width = a.width;
								e.height = a.height;
								e.onload = function() {
									CKEDITOR.plugins.imagemaps.drawMap(a, b, e);
								};
								e.src = a.attributes["data-cke-saved-src"].value;
								return;
							}
							d = a;
						}
						var g = a.ownerDocument.createElement("canvas");
						var i = g.getContext("2d");
						g.setAttribute("width", a.width);
						g.setAttribute("height", a.height);
						i.drawImage(d, 0, 0, a.width, a.height);
						i.strokeStyle = "#DDDDDD";
						i.lineWidth = 1;
						i.shadowOffsetX = 0;
						i.shadowOffsetY = 0;
						i.shadowBlur = 3;
						i.shadowColor = "#333333";
						d = 0;
						for (; d < b.areas.length; d++) {
							var k = b.areas[d];
							var n = k.coords.split(",");
							switch (k.shape) {
								case "circle":
									i.beginPath();
									i.arc(n[0], n[1], n[2], 0, Math.PI * 2, true);
									i.closePath();
									i.stroke();
									break;
								case "poly":
									i.beginPath();
									i.moveTo(n[0], n[1]);
									k = 2;
									for (; k < n.length; k = k + 2) {
										i.lineTo(n[k], n[k + 1]);
									}
									i.closePath();
									i.stroke();
									break;
								default:
									i.strokeRect(n[0], n[1], n[2] - n[0], n[3] - n[1]);
							}
						}
						try {
							a.src = g.toDataURL();
						} catch (o) {}
					} else {
						var r = function() {
							a.removeEventListener("load", r);
							CKEDITOR.plugins.imagemaps.drawMap(a, b);
						};
						a.addEventListener("load", r, false);
					}
				};
			}
		},
		afterInit: function(a) {
			var e = a.dataProcessor;
			(e && e.htmlFilter).addRules({
				elements: {
					map: function(b) {
						if (b.attributes.id && !b.attributes.name) {
							b.attributes.name = b.attributes.id;
						}
						var d = a.editable ? a.editable().$ : a.document.$;
						return d.querySelector && !d.querySelector('img[usemap="#' + b.attributes.name + '"]') ? false : b;
					}
				}
			}, {
				applyToAll: true
			});
		}
	});
	if (CKEDITOR.skins) {
		CKEDITOR.plugins.setLang = CKEDITOR.tools.override(CKEDITOR.plugins.setLang, function(a) {
			return function(e, b, d) {
				if (e != "devtools" && typeof d[e] != "object") {
					var f = {};
					f[e] = d;
					d = f;
				}
				a.call(this, e, b, d);
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




/* aaaaaaaaaaaaaaa */
(function() {
	function a(a) {
		d(true);
		f();
		m = a.aid;
		r.setValueOf("info", "href", a.ahref);
		r.setValueOf("info", "target", a.atarget || "notSet");
		r.setValueOf("info", "alt", a.aalt);
		r.setValueOf("info", "title", a.atitle);
	}

	function e(a) {
		d(true);
		f();
		m = a;
		r.getContentElement("info", "href").setValue("", true);
		r.getContentElement("info", "target").setValue("notSet", true);
		r.getContentElement("info", "alt").setValue("", true);
		r.getContentElement("info", "title").setValue("", true);
	}

	function b() {
		m = null;
		d(false);
	}

	function d(a) {
		var b = 1;
		for (; 2 >= b; b++) {
			var c = r.getContentElement("info", "properties" + b).getElement();
			if (a) {
				c.setStyle("visibility", "");
			} else {
				c.setStyle("visibility", "hidden");
			}
		}
	}

	function f() {
		if (null !== m) {
			i.areas[m].ahref = r.getValueOf("info", "href");
			i.areas[m].aalt = r.getValueOf("info", "alt");
			i.areas[m].atitle = r.getValueOf("info", "title");
		}
	}

	function c(a) {
		if ("pointer" == a) {
			i.is_drawing = 0;
			i.nextShape = "";
			l.$.style.cursor = "default";
		} else {
			i.nextShape = a;
			l.$.style.cursor = "crosshair";
		}
		h(a);
	}

	function h(a) {
		if (o) {
			o.removeClass("imgmapButtonActive");
		}
		o = r.getContentElement("info", "btn_" + a).getElement();
		o.addClass("imgmapButtonActive");
	}

	function j(a) {
		var b = "";
		var c = 0;
		for (; c < a.areas.length; c++) {
			var d;
			d = a.areas[c];
			if (!d || "" === d.shape) {
				d = "";
			} else {
				var e = '<area shape="' + d.shape + '" coords="' + d.lastInput + '"';
				if (d.aalt) {
					e += ' alt="' + d.aalt + '"';
				}
				if (d.atitle) {
					e += ' title="' + d.atitle + '"';
				}
				if (d.ahref) {
					e += ' href="' + d.ahref + '" data-cke-saved-href="' + d.ahref + '"';
				}
				if (d.atarget) {
					if ("notSet" != d.atarget) {
						e += ' target="' + d.atarget + '"';
					}
				}
				d = e += "/>";
			}
			b += d;
		}
		return b;
	}

	function g() {
		var a = m;
		if (null !== a) {
			i.areas[a]["a" + this.id] = this.getValue();
			i._recalculate(a);
		}
	}
	var i;
	var k;
	var n;
	var o;
	var r;
	var l;
	var m = null;
	CKEDITOR.dialog.add("ImageMaps", function(d) {
		function t() {
			if (w && ("undefined" != typeof imgmap && !(CKEDITOR.env.ie && "undefined" == typeof window.CanvasRenderingContext2D))) {
				n = m = null;
				k = d.getSelection().getSelectedElement();
				if ((!k || !k.is("img")) && d.widgets) {
					var f = d.widgets.focused;
					if (f && ("image2" == f.name || "image" == f.name)) {
						if (f = f.element) {
							if ("img" == f.getName()) {
								k = f;
							} else {
								f = f.getElementsByTag("img");
								if (1 == f.count()) {
									k = f.getItem(0);
								}
							}
						}
					}
				}
				if (!k || !k.is("img")) {
					alert(q.msgImageNotSelected);
					r.hide();
				} else {
					f = k.data ? k.data("cke-saved-src") : k.getAttribute("_cke_saved_src");
					var g = document.getElementById(B);
					var j = CKEDITOR.document.getWindow().getViewPaneSize().height - 290;
					j = Math.max(j, 315);
					g.style.maxHeight = j + "px";
					i = new imgmap({
						mode: "editor2",
						custom_callbacks: {
							onSelectArea: a,
							onRemoveArea: b,
							onStatusMessage: function(a) {
								document.getElementById(v).innerHTML = a;
							},
							onLoadImage: function(a) {
								var b = a.getAttribute("width");
								var c = a.getAttribute("height");
								if (b) {
									a.style.width = b + "px";
								}
								if (c) {
									a.style.height = c + "px";
								}
								l = new CKEDITOR.dom.element(a);
								l.on("dragstart", function(a) {
									a.data.preventDefault();
								});
							}
						},
						pic_container: g,
						bounding_box: false,
						lang: "",
						CL_DRAW_SHAPE: "#F00",
						CL_NORM_SHAPE: "#AAA",
						CL_HIGHLIGHT_SHAPE: "#F00"
					});
					i.loadStrings(imgmapStrings);
					k = k.$;
					i.loadImage(f, parseInt(k.style.width || (k.width || 0), 10), parseInt(k.style.height || (k.height || 0), 10));
					f = k.getAttribute("usemap", 2) || k.usemap;
					if ("string" == typeof f && "" !== f) {
						f = f.substr(1);
						g = (d.editable ? d.editable().$ : d.document.$).getElementsByTagName("MAP");
						j = 0;
						for (; j < g.length; j++) {
							if (g[j].name == f || g[j].id == f) {
								n = g[j];
								i.setMapHTML(n);
								r.setValueOf("info", "MapName", f);
								break;
							}
						}
					}
					i.config.custom_callbacks.onAddArea = e;
					if (n) {
						i.blurArea(i.currentid);
						i.currentid = 0;
						i.selectedId = 0;
						a(i.areas[0]);
						i.highlightArea(0);
						c("pointer");
					} else {
						h("rect");
					}
					x();
					window.setTimeout(x, 1E3);
				}
			}
		}

		function p() {
			d.fire("saveSnapshot");
			if (k) {
				if ("IMG" == k.nodeName) {
					k.removeAttribute("usemap", 0);
					k.src = k.attributes["data-cke-saved-src"].value;
				}
			}
			if (n) {
				n.parentNode.removeChild(n);
			}
			r.hide();
		}

		function x() {
			var a = parseInt(CKEDITOR.revision, 10);
			if (isNaN(a) || !(7296 > a && (CKEDITOR.skins && d.config.filebrowserBrowseUrl))) {
				a = r.parts.contents;
				var b = a.getFirst().getFirst();
				var c = document.getElementById(B);
				c.style.width = parseInt(a.$.style.width, 10) + "px";
				c.style.height = parseInt(c.style.height, 10) + (parseInt(a.$.style.height, 10) - b.$.offsetHeight) + "px";
			}
		}
		var q = d.lang.imagemaps;
		var u = d.lang.common.generalTab;
		var B = "pic_container" + CKEDITOR.tools.getNextNumber();
		var v = "StatusContainer" + CKEDITOR.tools.getNextNumber();
		var z = d.plugins.imagemaps;
		var w = false;
		if (CKEDITOR.env.ie) {
			if ("undefined" == typeof window.CanvasRenderingContext2D) {
				CKEDITOR.scriptLoader.load(z.path + "dialog/excanvas.js", t);
			}
		}
		if ("undefined" == typeof imgmap) {
			CKEDITOR.scriptLoader.load(z.path + "dialog/imgmap.js", t);
		}
		var D = "";
		var A = CKEDITOR.document.getHead().append("style");
		A.setAttribute("type", "text/css");
		D += '.imgmapButton {cursor:pointer; background: url("' + z.path + 'images/sprite.png") no-repeat top left; width: 16px; height: 16px; display:inline-block;}';
		D = D + ".imgmapButtonActive {outline:1px solid #666; background-color:#ddd;}.imgmap_label {cursor:default;}" + ("#" + B + " img {max-width:none; max-height:none;}");
		if (CKEDITOR.env.ie && 11 > CKEDITOR.env.version) {
			A.$.styleSheet.cssText = D;
		} else {
			A.$.innerHTML = D;
		}
		z = "fieldset";
		D = parseInt(CKEDITOR.revision, 10);
		if (!isNaN(D)) {
			if (7296 > D && (CKEDITOR.skins && d.config.filebrowserBrowseUrl)) {
				z = "vbox";
			}
		}
		return {
			title: q.title,
			minWidth: 500,
			minHeight: 510,
			buttons: [{
					type: "button",
					label: q.imgmapBtnRemove,
					onClick: p
				},
				CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton
			],
			contents: [{
				id: "info",
				label: u,
				title: u,
				elements: [{
					type: z,
					label: q.imgmapMap,
					id: "ContainerMapName",
					hidden: true,
					children: [{
						id: "MapName",
						type: "text",
						label: q.imgmapMapName,
						labelLayout: "horizontal",
						onChange: function() {
							i.mapname = this.getValue();
						}
					}]
				}, {
					type: z,
					label: q.imgmapMapAreas,
					children: [{
						type: "hbox",
						id: "button_container",
						style: "margin-bottom:10px",
						widths: "20px 18px 18px 18px 26px 230px 100px".split(" "),
						children: [{
							type: "html",
							id: "btn_pointer",
							onClick: function() {
								c("pointer");
							},
							html: '<span style="background-position: 0 -64px;" class="imgmapButton" title="' + q.imgmapPointer + '"></span>'
						}, {
							type: "html",
							id: "btn_rect",
							onClick: function() {
								c("rect");
							},
							html: '<span style="background-position: 0 -128px;" class="imgmapButton" title="' + q.imgmapRectangle + '"></span>'
						}, {
							type: "html",
							id: "btn_circle",
							onClick: function() {
								c("circle");
							},
							html: '<span style="background-position: 0 0;" class="imgmapButton" title="' + q.imgmapCircle + '"></span>'
						}, {
							type: "html",
							id: "btn_poly",
							onClick: function() {
								c("poly");
							},
							html: '<span style="background-position: 0 -96px;" class="imgmapButton" title="' + q.imgmapPolygon + '"></span>'
						}, {
							type: "html",
							onClick: function() {
								i.removeArea(i.currentid);
							},
							html: '<span style="background-position: 0 -32px;" class="imgmapButton" title="' + q.imgmapDeleteArea + '"></span>'
						}, {
							type: "html",
							html: '<div id="' + v + '">&nbsp;</div>'
						}, {
							type: "select",
							id: "zoom",
							labelLayout: "horizontal",
							label: q.imgmapLabelZoom,
							onChange: function() {
								var a = this.getValue();
								var b = document.getElementById(B).getElementsByTagName("img")[0];
								if (b) {
									if (!b.oldwidth) {
										b.oldwidth = b.width;
									}
									if (!b.oldheight) {
										b.oldheight = b.height;
									}
									b.style.width = b.oldwidth * a + "px";
									b.style.height = b.oldheight * a + "px";
									i.scaleAllAreas(a);
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
							label: q.linkURL,
							onChange: g
						}, {
							type: "button",
							id: "browse",
							label: d.lang.common.browseServer,
							style: "display:inline-block;margin-top:10px;",
							align: "center",
							hidden: "true",
							filebrowser: "info:href"
						}, {
							id: "target",
							type: "select",
							label: q.linkTarget,
							onChange: g,
							items: [
								[q.notSet, "notSet"],
								[q.linkTargetSelf, "_self"],
								[q.linkTargetBlank, "_blank"],
								[q.linkTargetTop, "_top"]
							]
						}]
					}, {
						type: "hbox",
						id: "properties2",
						style: "visibility:hidden",
						children: [{
							type: "text",
							id: "title",
							label: q.advisoryTitle,
							onChange: g
						}, {
							type: "text",
							id: "alt",
							hidden: true,
							label: q.altText,
							onChange: g
						}]
					}]
				}, {
					type: "fieldset",
					style: "border:0; padding:0",
					label: "&nbsp;",
					children: [{
						type: "html",
						html: '<div id="' + B + '" style="overflow:auto;width:500px;height:390px;position:relative;"></div>'
					}]
				}]
			}],
			onLoad: function() {
				r = this;
				r.on("resize", x);
			},
			onShow: function() {
				w = true;
				t();
			},
			onHide: function() {
				if (o) {
					o.removeClass("imgmapButtonActive");
					o = null;
				}
				document.getElementById(B).innerHTML = "";
			},
			onOk: function() {
				f();
				if (k && "IMG" == k.nodeName) {
					var a = j(i);
					if (a) {
						i.mapid = i.mapname = r.getValueOf("info", "MapName");
						if ("boolean" == typeof d.fire("imagemaps.validate", i)) {
							return false;
						}
						d.fire("saveSnapshot");
						a = j(i);
						if (!n) {
							n = d.document.$.createElement("map");
							var b = k;
							if (d.widgets) {
								var c = d.widgets.focused;
								if (c) {
									b = c.wrapper.$;
								}
							}
							b.parentNode.insertBefore(n, b.nextSibling);
						}
						n.innerHTML = a;
						if (n.name) {
							n.removeAttribute("name");
						}
						n.name = i.getMapName();
						n.id = i.getMapId();
						k.setAttribute("usemap", "#" + n.name, 0);
						if (CKEDITOR.plugins.imagemaps) {
							if (CKEDITOR.plugins.imagemaps.drawMap) {
								CKEDITOR.plugins.imagemaps.drawMap(k, n);
							}
						}
					} else {
						p();
					}
				}
			}
		};
	});
})();

function imgmap(a) {
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
	var e = navigator.userAgent;
	this.isMSIE = "Microsoft Internet Explorer" == navigator.appName;
	this.isSafari = -1 != e.indexOf("Safari");
	this.isOpera = "undefined" != typeof window.opera;
	this.setup(a);
}
imgmap.prototype.assignOID = function(a) {
	try {
		if ("undefined" == typeof a) {
			this.log("Undefined object passed to assignOID.");
		} else {
			if ("object" == typeof a) {
				return a;
			}
			if ("string" == typeof a) {
				return document.getElementById(a);
			}
		}
	} catch (e) {
		this.log("Error in assignOID", 1);
	}
	return null;
};
imgmap.prototype.setup = function(a) {
	var e;
	for (e in a) {
		if (a.hasOwnProperty(e)) {
			this.config[e] = a[e];
		}
	}
	this.addEvent(document, "keydown", this.eventHandlers.doc_keydown = this.doc_keydown.bind(this));
	this.addEvent(document, "keyup", this.eventHandlers.doc_keyup = this.doc_keyup.bind(this));
	this.addEvent(document, "mousedown", this.eventHandlers.doc_mousedown = this.doc_mousedown.bind(this));
	if (a) {
		if (a.pic_container) {
			this.pic_container = this.assignOID(a.pic_container);
			this.disableSelection(this.pic_container);
		}
	}
	if (!this.config.lang) {
		this.config.lang = this.detectLanguage();
	}
	var b;
	var d;
	for (e in this.config.custom_callbacks) {
		if (this.config.custom_callbacks.hasOwnProperty(e)) {
			a = false;
			b = 0;
			d = this.event_types.length;
			for (; b < d; b++) {
				if (e == this.event_types[b]) {
					a = true;
					break;
				}
			}
			if (!a) {
				this.log("Unknown custom callback: " + e, 1);
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
imgmap.prototype.addEvent = function(a, e, b) {
	if (a.attachEvent) {
		return a.attachEvent("on" + e, b);
	}
	if (a.addEventListener) {
		return a.addEventListener(e, b, false), true;
	}
};
imgmap.prototype.removeEvent = function(a, e, b) {
	if (a.detachEvent) {
		return a.detachEvent("on" + e, b);
	}
	if (a.removeEventListener) {
		return a.removeEventListener(e, b, false), true;
	}
};
imgmap.prototype.loadStrings = function(a) {
	var e;
	for (e in a) {
		if (a.hasOwnProperty(e)) {
			this.strings[e] = a[e];
		}
	}
};
imgmap.prototype.loadImage = function(a, e, b) {
	if ("undefined" == typeof this.pic_container) {
		return this.log("You must have pic_container defined to use loadImage!", 2), false;
	}
	this.removeAllAreas();
	this.globalscale = 1;
	if ("string" == typeof a) {
		return "undefined" == typeof this.pic && (this.pic = document.createElement("IMG"), this.pic_container.appendChild(this.pic), this.addEvent(this.pic, "mousedown", this.eventHandlers.img_mousedown = this.img_mousedown.bind(this)), this.addEvent(this.pic, "mouseup", this.eventHandlers.img_mouseup = this.img_mouseup.bind(this)), this.addEvent(this.pic, "mousemove", this.eventHandlers.img_mousemove = this.img_mousemove.bind(this)), this.pic.style.cursor = this.config.cursor_default), this.pic.src =
			a, e && (0 < e && this.pic.setAttribute("width", e)), b && (0 < b && this.pic.setAttribute("height", b)), this.fireEvent("onLoadImage", this.pic), true;
	}
	if ("object" == typeof a) {
		var d = a.src;
		if (!e) {
			e = a.clientWidth;
		}
		if (!b) {
			b = a.clientHeight;
		}
		return this.loadImage(d, e, b);
	}
};
imgmap.prototype.statusMessage = function(a) {
	this.fireEvent("onStatusMessage", a);
};
imgmap.prototype.log = function() {};
imgmap.prototype.getMapName = function() {
	if ("" === this.mapname) {
		if ("" !== this.mapid) {
			return this.mapid;
		}
		var a = new Date;
		this.mapname = "imgmap" + a.getFullYear() + (a.getMonth() + 1) + a.getDate() + a.getHours() + a.getMinutes() + a.getSeconds();
	}
	return this.mapname;
};
imgmap.prototype.getMapId = function() {
	if ("" === this.mapid) {
		this.mapid = this.getMapName();
	}
	return this.mapid;
};
imgmap.prototype._normShape = function(a) {
	if (!a) {
		return "rect";
	}
	a = this.trim(a).toLowerCase();
	return "rect" == a.substring(0, 4) ? "rect" : "circ" == a.substring(0, 4) ? "circle" : "poly" == a.substring(0, 4) ? "poly" : "rect";
};
imgmap.prototype._normCoords = function(a, e, b) {
	var d;
	var f;
	var c;
	var h;
	a = this.trim(a);
	if ("" === a) {
		return "";
	}
	var j = a;
	a = a.replace(/(\d)([^\d\.])+(\d)/g, "$1,$3");
	a = a.replace(/,\D+(\d)/g, ",$1");
	a = a.replace(/,0+(\d)/g, ",$1");
	a = a.replace(/(\d)(\D)+,/g, "$1,");
	a = a.replace(/^\D+(\d)/g, "$1");
	a = a.replace(/^0+(\d)/g, "$1");
	a = a.replace(/(\d)(\D)+$/g, "$1");
	var g = a.split(",");
	if ("rect" == e) {
		if ("fromcircle" == b) {
			a = g[2];
			g[0] -= a;
			g[1] -= a;
			g[2] = parseInt(g[0], 10) + 2 * a;
			g[3] = parseInt(g[1], 10) + 2 * a;
		} else {
			if ("frompoly" == b) {
				e = parseInt(g[0], 10);
				f = parseInt(g[0], 10);
				d = parseInt(g[1], 10);
				c = parseInt(g[1], 10);
				a = 0;
				h = g.length;
				for (; a < h; a++) {
					if (0 === a % 2) {
						if (parseInt(g[a], 10) < e) {
							e = parseInt(g[a], 10);
						}
					}
					if (1 === a % 2) {
						if (parseInt(g[a], 10) < d) {
							d = parseInt(g[a], 10);
						}
					}
					if (0 === a % 2) {
						if (parseInt(g[a], 10) > f) {
							f = parseInt(g[a], 10);
						}
					}
					if (1 === a % 2) {
						if (parseInt(g[a], 10) > c) {
							c = parseInt(g[a], 10);
						}
					}
				}
				g[0] = e;
				g[1] = d;
				g[2] = f;
				g[3] = c;
			}
		}
		if (!(0 <= parseInt(g[1], 10))) {
			g[1] = g[0];
		}
		if (!(0 <= parseInt(g[2], 10))) {
			g[2] = parseInt(g[0], 10) + 10;
		}
		if (!(0 <= parseInt(g[3], 10))) {
			g[3] = parseInt(g[1], 10) + 10;
		}
		if (parseInt(g[0], 10) > parseInt(g[2], 10)) {
			a = g[0];
			g[0] = g[2];
			g[2] = a;
		}
		if (parseInt(g[1], 10) > parseInt(g[3], 10)) {
			a = g[1];
			g[1] = g[3];
			g[3] = a;
		}
		a = g[0] + "," + g[1] + "," + g[2] + "," + g[3];
	} else {
		if ("circle" == e) {
			if ("fromrect" == b) {
				e = parseInt(g[0], 10);
				f = parseInt(g[2], 10);
				d = parseInt(g[1], 10);
				c = parseInt(g[3], 10);
				g[2] = f - e < c - d ? f - e : c - d;
				g[2] = Math.floor(g[2] / 2);
				g[0] = e + g[2];
				g[1] = d + g[2];
			} else {
				if ("frompoly" == b) {
					e = parseInt(g[0], 10);
					f = parseInt(g[0], 10);
					d = parseInt(g[1], 10);
					c = parseInt(g[1], 10);
					a = 0;
					h = g.length;
					for (; a < h; a++) {
						if (0 === a % 2) {
							if (parseInt(g[a], 10) < e) {
								e = parseInt(g[a], 10);
							}
						}
						if (1 === a % 2) {
							if (parseInt(g[a], 10) < d) {
								d = parseInt(g[a], 10);
							}
						}
						if (0 === a % 2) {
							if (parseInt(g[a], 10) > f) {
								f = parseInt(g[a], 10);
							}
						}
						if (1 === a % 2) {
							if (parseInt(g[a], 10) > c) {
								c = parseInt(g[a], 10);
							}
						}
					}
					g[2] = f - e < c - d ? f - e : c - d;
					g[2] = Math.floor(g[2] / 2);
					g[0] = e + g[2];
					g[1] = d + g[2];
				}
			}
			if (!(0 < parseInt(g[1], 10))) {
				g[1] = g[0];
			}
			if (!(0 < parseInt(g[2], 10))) {
				g[2] = 10;
			}
			a = g[0] + "," + g[1] + "," + g[2];
		} else {
			if ("poly" == e) {
				if ("fromrect" == b) {
					g[4] = g[2];
					g[5] = g[3];
					g[2] = g[0];
					g[6] = g[4];
					g[7] = g[1];
				} else {
					if ("fromcircle" == b) {
						e = parseInt(g[0], 10);
						d = parseInt(g[1], 10);
						f = parseInt(g[2], 10);
						c = 0;
						g[c++] = e + f;
						g[c++] = d;
						a = 0;
						for (; 60 >= a; a++) {
							var i = a / 60;
							h = Math.cos(2 * i * Math.PI);
							i = Math.sin(2 * i * Math.PI);
							h = e + h * f;
							i = d + i * f;
							g[c++] = Math.round(h);
							g[c++] = Math.round(i);
						}
					}
				}
				a = g.join(",");
			}
		}
	}
	return "preserve" == b && j != a ? j : a;
};
imgmap.prototype.setMapHTML = function(a) {
	this.fireEvent("onSetMap", a);
	this.removeAllAreas();
	var e;
	if ("string" == typeof a) {
		e = document.createElement("DIV");
		e.innerHTML = a;
		e = e.firstChild;
	} else {
		if ("object" == typeof a) {
			e = a;
		}
	}
	if (!e || "map" !== e.nodeName.toLowerCase()) {
		return false;
	}
	this.mapname = e.name;
	this.mapid = e.id;
	a = e.getElementsByTagName("area");
	var b;
	var d;
	var f;
	var c = 0;
	var h = a.length;
	for (; c < h; c++) {
		e = "";
		f = this.addNewArea();
		b = this._normShape(a[c].getAttribute("shape", 2));
		this.initArea(f, b);
		if (a[c].getAttribute("coords", 2)) {
			e = this._normCoords(a[c].getAttribute("coords", 2), b);
			this.areas[f].lastInput = e;
		}
		b = a[c].getAttribute("href", 2);
		if (d = a[c].getAttribute("data-cke-saved-href")) {
			b = d;
		}
		if (b) {
			this.areas[f].ahref = b;
		}
		if (b = a[c].getAttribute("alt")) {
			this.areas[f].aalt = b;
		}
		if (!(d = a[c].getAttribute("title"))) {
			d = b;
		}
		if (d) {
			this.areas[f].atitle = d;
		}
		if (b = a[c].getAttribute("target")) {
			b = b.toLowerCase();
		}
		this.areas[f].atarget = b;
		this._recalculate(f, e);
		this.relaxArea(f);
		this.fireEvent("onAreaChanged", this.areas[f]);
	}
	return true;
};
imgmap.prototype.addNewArea = function() {
	var a = this._getLastArea();
	a = a ? a.aid + 1 : 0;
	var e = this.areas[a] = document.createElement("DIV");
	e.id = this.mapname + "area" + a;
	e.aid = a;
	e.shape = "undefined";
	this.blurArea(this.currentid);
	this.currentid = a;
	this.fireEvent("onAddArea", a);
	return a;
};
imgmap.prototype.initArea = function(a, e) {
	var b = this.areas[a];
	if (b) {
		if (b.parentNode) {
			b.parentNode.removeChild(b);
		}
		if (b.label) {
			b.label.parentNode.removeChild(b.label);
		}
		b = this.areas[a] = document.createElement("CANVAS");
		this.pic_container.appendChild(b);
		this.pic_container.style.position = "relative";
		if ("undefined" != typeof G_vmlCanvasManager) {
			b = this.areas[a] = G_vmlCanvasManager.initElement(b);
		}
		b.id = this.mapname + "area" + a;
		b.aid = a;
		b.shape = e;
		b.ahref = "";
		b.atitle = "";
		b.aalt = "";
		b.atarget = "";
		b.style.position = "absolute";
		b.style.top = this.pic.offsetTop + "px";
		b.style.left = this.pic.offsetLeft + "px";
		this._setopacity(b, this.config.CL_DRAW_BG, this.config.draw_opacity);
		b.ondblclick = this.area_dblclick.bind(this);
		b.onmousedown = this.area_mousedown.bind(this);
		b.onmouseup = this.area_mouseup.bind(this);
		b.onmousemove = this.area_mousemove.bind(this);
		b.onmouseover = this.area_mouseover.bind(this);
		b.onmouseout = this.area_mouseout.bind(this);
		this.memory[a] = {};
		this.memory[a].downx = 0;
		this.memory[a].downy = 0;
		this.memory[a].left = 0;
		this.memory[a].top = 0;
		this.memory[a].width = 0;
		this.memory[a].height = 0;
		this.memory[a].xpoints = [];
		this.memory[a].ypoints = [];
		b.label = document.createElement("DIV");
		this.pic_container.appendChild(b.label);
		b.label.className = this.config.label_class;
		this.assignCSS(b.label, this.config.label_style);
		b.label.style.position = "absolute";
	}
};
imgmap.prototype.relaxArea = function(a) {
	var e = this.areas[a];
	if (e) {
		this.fireEvent("onRelaxArea", a);
		if (a != this.currentid) {
			this._setBorder(e, "NORM");
			this._setopacity(e, this.config.CL_NORM_BG, this.config.norm_opacity);
		} else {
			this.highlightArea(a);
		}
	}
};
imgmap.prototype.relaxAllAreas = function() {
	var a = 0;
	var e = this.areas.length;
	for (; a < e; a++) {
		if (this.areas[a]) {
			this.relaxArea(a);
		}
	}
};
imgmap.prototype._setBorder = function(a, e) {
	if ("rect" == a.shape || this.config.bounding_box) {
		a.style.borderWidth = "1px";
		a.style.borderStyle = "DRAW" == e ? "dotted" : "solid";
		a.style.borderColor = this.config["CL_" + e + "_" + ("rect" == a.shape ? "SHAPE" : "BOX")];
	} else {
		a.style.border = "";
	}
};
imgmap.prototype._setopacity = function(a, e, b) {
	if (e) {
		a.style.backgroundColor = e;
	}
	if (b && ("string" == typeof b && b.match(/^\d*\-\d+$/))) {
		var d = b.split("-");
		if ("undefined" != typeof d[0]) {
			d[0] = parseInt(d[0], 10);
			this._setopacity(a, e, d[0]);
		}
		if ("undefined" != typeof d[1]) {
			d[1] = parseInt(d[1], 10);
			e = this._getopacity(a);
			var f = this;
			b = Math.round(d[1] - e);
			if (5 < b) {
				window.setTimeout(function() {
					f._setopacity(a, null, "-" + d[1]);
				}, 20);
				b = 1 * e + 5;
			} else {
				if (-3 > b) {
					window.setTimeout(function() {
						f._setopacity(a, null, "-" + d[1]);
					}, 20);
					b = 1 * e - 3;
				} else {
					b = d[1];
				}
			}
		}
	}
	if (!isNaN(b)) {
		b = Math.round(parseInt(b, 10));
		a.style.opacity = b / 100;
		a.style.filter = "alpha(opacity=" + b + ")";
	}
};
imgmap.prototype._getopacity = function(a) {
	return 1 >= a.style.opacity ? 100 * a.style.opacity : a.style.filter ? parseInt(a.style.filter.replace(/alpha\(opacity\=([^\)]*)\)/ig, "$1"), 10) : 100;
};
imgmap.prototype.removeArea = function(a) {
	if (!(null === a || "undefined" == typeof a)) {
		try {
			this.areas[a].label.parentNode.removeChild(this.areas[a].label);
			this.areas[a].parentNode.removeChild(this.areas[a]);
			this.areas[a].label.className = null;
			this.areas[a].label = null;
			this.areas[a].onmouseover = null;
			this.areas[a].onmouseout = null;
			this.areas[a].onmouseup = null;
			this.areas[a].onmousedown = null;
			this.areas[a].onmousemove = null;
		} catch (e) {}
		this.areas[a] = null;
		this.fireEvent("onRemoveArea", a);
	}
};
imgmap.prototype.removeAllAreas = function() {
	var a = 0;
	var e = this.areas.length;
	for (; a < e; a++) {
		if (this.areas[a]) {
			this.removeArea(a);
		}
	}
};
imgmap.prototype.scaleAllAreas = function(a) {
	var e = 1;
	try {
		e = a / this.globalscale;
	} catch (b) {
		this.log("Invalid (global)scale", 1);
	}
	this.globalscale = a;
	a = 0;
	var d = this.areas.length;
	for (; a < d; a++) {
		if (this.areas[a]) {
			if ("undefined" != this.areas[a].shape) {
				this.scaleArea(a, e);
			}
		}
	}
};
imgmap.prototype.scaleArea = function(a, e) {
	var b = this.areas[a];
	b.style.top = parseInt(b.style.top, 10) * e + "px";
	b.style.left = parseInt(b.style.left, 10) * e + "px";
	this.setAreaSize(a, b.width * e, b.height * e);
	if ("poly" == b.shape) {
		var d = 0;
		var f = b.xpoints.length;
		for (; d < f; d++) {
			b.xpoints[d] *= e;
			b.ypoints[d] *= e;
		}
	}
	this._repaint(b, this.config.CL_NORM_SHAPE);
	this._updatecoords(a);
};
imgmap.prototype._putlabel = function(a) {
	var e = this.areas[a];
	if (e.label) {
		try {
			if (this.config.label) {
				e.label.style.display = "";
				var b = this.config.label;
				b = b.replace(/%n/g, "" + a);
				b = b.replace(/%c/g, "" + e.lastInput);
				b = b.replace(/%h/g, "" + e.ahref);
				b = b.replace(/%a/g, "" + e.aalt);
				b = b.replace(/%t/g, "" + e.atitle);
				e.label.innerHTML = b;
			} else {
				e.label.innerHTML = "";
				e.label.style.display = "none";
			}
			e.label.style.top = e.style.top;
			e.label.style.left = e.style.left;
		} catch (d) {
			this.log("Error putting label", 1);
		}
	}
};
imgmap.prototype._puthint = function(a) {
	try {
		if (this.config.hint) {
			var e = this.config.hint;
			e = e.replace(/%n/g, "" + a);
			e = e.replace(/%c/g, "" + this.areas[a].lastInput);
			e = e.replace(/%h/g, "" + this.areas[a].ahref);
			e = e.replace(/%a/g, "" + this.areas[a].aalt);
			e = e.replace(/%t/g, "" + this.areas[a].atitle);
			this.areas[a].title = e;
			this.areas[a].alt = e;
		} else {
			this.areas[a].title = "";
			this.areas[a].alt = "";
		}
	} catch (b) {
		this.log("Error putting hint", 1);
	}
};
imgmap.prototype._repaintAll = function() {
	var a = 0;
	var e = this.areas.length;
	for (; a < e; a++) {
		if (this.areas[a]) {
			this._repaint(this.areas[a], this.config.CL_NORM_SHAPE);
		}
	}
};
imgmap.prototype._repaint = function(a, e, b, d) {
	var f;
	var c;
	var h;
	var j;
	var g;
	if ("circle" == a.shape) {
		c = parseInt(a.style.width, 10);
		b = Math.floor(c / 2) - 1;
		if (0 > b) {
			b = 0;
		}
		f = a.getContext("2d");
		f.clearRect(0, 0, c, c);
		f.beginPath();
		f.strokeStyle = e;
		f.arc(b, b, b, 0, 2 * Math.PI, 0);
		f.stroke();
		f.closePath();
		f.strokeStyle = this.config.CL_KNOB;
		f.strokeRect(b, b, 1, 1);
		this._putlabel(a.aid);
		this._puthint(a.aid);
	} else {
		if ("rect" == a.shape) {
			this._putlabel(a.aid);
			this._puthint(a.aid);
		} else {
			if ("poly" == a.shape) {
				c = parseInt(a.style.width, 10);
				h = parseInt(a.style.height, 10);
				j = parseInt(a.style.left, 10);
				g = parseInt(a.style.top, 10);
				if (a.xpoints) {
					f = a.getContext("2d");
					f.clearRect(0, 0, c, h);
					f.beginPath();
					f.strokeStyle = e;
					f.moveTo(a.xpoints[0] - j, a.ypoints[0] - g);
					e = 1;
					c = a.xpoints.length;
					for (; e < c; e++) {
						f.lineTo(a.xpoints[e] - j, a.ypoints[e] - g);
					}
					if (this.is_drawing == this.DM_POLYGON_DRAW || this.is_drawing == this.DM_POLYGON_LASTDRAW) {
						f.lineTo(b - j - 5, d - g - 5);
					}
					f.lineTo(a.xpoints[0] - j, a.ypoints[0] - g);
					f.stroke();
					f.closePath();
				}
				this._putlabel(a.aid);
				this._puthint(a.aid);
			}
		}
	}
};
imgmap.prototype._updatecoords = function(a) {
	a = this.areas[a];
	var e = Math.round(parseInt(a.style.left, 10) / this.globalscale);
	var b = Math.round(parseInt(a.style.top, 10) / this.globalscale);
	var d = Math.round(parseInt(a.style.height, 10) / this.globalscale);
	var f = Math.round(parseInt(a.style.width, 10) / this.globalscale);
	var c = "";
	if ("rect" == a.shape) {
		a.lastInput = e + "," + b + "," + (e + f) + "," + (b + d);
	} else {
		if ("circle" == a.shape) {
			c = Math.floor(f / 2) - 1;
			a.lastInput = e + c + "," + (b + c) + "," + c;
		} else {
			if ("poly" == a.shape) {
				if (a.xpoints) {
					e = 0;
					b = a.xpoints.length;
					for (; e < b; e++) {
						c += Math.round(a.xpoints[e] / this.globalscale) + "," + Math.round(a.ypoints[e] / this.globalscale) + ",";
					}
					c = c.substring(0, c.length - 1);
				}
				a.lastInput = c;
			}
		}
	}
	this.fireEvent("onAreaChanged", a);
};
imgmap.prototype._recalculate = function(a, e) {
	var b = this.areas[a];
	try {
		e = e ? this._normCoords(e, b.shape, "preserve") : b.lastInput || "";
		var d = e.split(",");
		if ("rect" == b.shape) {
			if (4 != d.length || (parseInt(d[0], 10) > parseInt(d[2], 10) || parseInt(d[1], 10) > parseInt(d[3], 10))) {
				throw "invalid coords";
			}
			b.style.left = this.globalscale * (this.pic.offsetLeft + parseInt(d[0], 10)) + "px";
			b.style.top = this.globalscale * (this.pic.offsetTop + parseInt(d[1], 10)) + "px";
			this.setAreaSize(a, this.globalscale * (d[2] - d[0]), this.globalscale * (d[3] - d[1]));
			this._repaint(b, this.config.CL_NORM_SHAPE);
		} else {
			if ("circle" == b.shape) {
				if (3 != d.length || 0 > parseInt(d[2], 10)) {
					throw "invalid coords";
				}
				var f = 2 * d[2];
				this.setAreaSize(a, this.globalscale * f, this.globalscale * f);
				b.style.left = this.globalscale * (this.pic.offsetLeft + parseInt(d[0], 10) - f / 2) + "px";
				b.style.top = this.globalscale * (this.pic.offsetTop + parseInt(d[1], 10) - f / 2) + "px";
				this._repaint(b, this.config.CL_NORM_SHAPE);
			} else {
				if ("poly" == b.shape) {
					if (2 > d.length) {
						throw "invalid coords";
					}
					b.xpoints = [];
					b.ypoints = [];
					f = 0;
					var c = d.length;
					for (; f < c; f += 2) {
						b.xpoints[b.xpoints.length] = this.globalscale * (this.pic.offsetLeft + parseInt(d[f], 10));
						b.ypoints[b.ypoints.length] = this.globalscale * (this.pic.offsetTop + parseInt(d[f + 1], 10));
						this._polygongrow(b, this.globalscale * d[f], this.globalscale * d[f + 1]);
					}
					this._polygonshrink(b);
				}
			}
		}
	} catch (h) {
		this.log(h.message ? h.message : "error calculating coordinates", 1);
		this.statusMessage(this.strings.ERR_INVALID_COORDS);
		if (b.lastInput) {
			this.fireEvent("onAreaChanged", b);
		}
		this._repaint(b, this.config.CL_NORM_SHAPE);
		return;
	}
	b.lastInput = e;
};
imgmap.prototype._polygongrow = function(a, e, b) {
	var d = e - parseInt(a.style.left, 10);
	var f = b - parseInt(a.style.top, 10);
	if (e < parseInt(a.style.left, 10)) {
		a.style.left = e - 0 + "px";
		this.setAreaSize(a.aid, parseInt(a.style.width, 10) + Math.abs(d) + 0, null);
	} else {
		if (e > parseInt(a.style.left, 10) + parseInt(a.style.width, 10)) {
			this.setAreaSize(a.aid, e - parseInt(a.style.left, 10) + 0, null);
		}
	}
	if (b < parseInt(a.style.top, 10)) {
		a.style.top = b - 0 + "px";
		this.setAreaSize(a.aid, null, parseInt(a.style.height, 10) + Math.abs(f) + 0);
	} else {
		if (b > parseInt(a.style.top, 10) + parseInt(a.style.height, 10)) {
			this.setAreaSize(a.aid, null, b - parseInt(a.style.top, 10) + 0);
		}
	}
};
imgmap.prototype._polygonshrink = function(a) {
	a.style.left = a.xpoints[0] + "px";
	a.style.top = a.ypoints[0] + "px";
	this.setAreaSize(a.aid, 0, 0);
	var e = 0;
	var b = a.xpoints.length;
	for (; e < b; e++) {
		this._polygongrow(a, a.xpoints[e], a.ypoints[e]);
	}
	this._repaint(a, this.config.CL_NORM_SHAPE);
};
imgmap.prototype.img_mousemove = function(a) {
	var e;
	var b;
	var d;
	var f;
	b = this._getPos(this.pic);
	e = this.isMSIE ? window.event.x + this.pic_container.scrollLeft - this.pic.offsetLeft : a.clientX - b.x;
	b = this.isMSIE ? window.event.y + this.pic_container.scrollTop - this.pic.offsetTop : a.clientY - b.y;
	if (!(0 > e || (0 > b || (e > this.pic.width || b > this.pic.height)))) {
		if (this.memory[this.currentid]) {
			f = this.memory[this.currentid].top;
			var c = this.memory[this.currentid].left;
			d = this.memory[this.currentid].height;
			var h = this.memory[this.currentid].width;
		}
		var j = this.areas[this.currentid];
		if (this.isSafari) {
			if (a.shiftKey) {
				if (this.is_drawing == this.DM_RECTANGLE_DRAW) {
					this.is_drawing = this.DM_SQUARE_DRAW;
					this.statusMessage(this.strings.SQUARE2_DRAW);
				}
			} else {
				if (this.is_drawing == this.DM_SQUARE_DRAW) {
					if ("rect" == j.shape) {
						this.is_drawing = this.DM_RECTANGLE_DRAW;
						this.statusMessage(this.strings.RECTANGLE_DRAW);
					}
				}
			}
		}
		if (this.is_drawing == this.DM_RECTANGLE_DRAW) {
			if (this.fireEvent("onDrawArea", this.currentid), d = e - this.memory[this.currentid].downx, f = b - this.memory[this.currentid].downy, this.setAreaSize(this.currentid, Math.abs(d), Math.abs(f)), 0 > d && (j.style.left = e + 1 + "px"), 0 > f) {
				j.style.top = b + 1 + "px";
			}
		} else {
			if (this.is_drawing == this.DM_SQUARE_DRAW) {
				if (this.fireEvent("onDrawArea", this.currentid), d = e - this.memory[this.currentid].downx, f = b - this.memory[this.currentid].downy, a = Math.abs(d) < Math.abs(f) ? Math.abs(parseInt(d, 10)) : Math.abs(parseInt(f, 10)), this.setAreaSize(this.currentid, a, a), 0 > d && (j.style.left = this.memory[this.currentid].downx + -1 * a + "px"), 0 > f) {
					j.style.top = this.memory[this.currentid].downy + -1 * a + 1 + "px";
				}
			} else {
				if (this.is_drawing == this.DM_POLYGON_DRAW) {
					this.fireEvent("onDrawArea", this.currentid);
					this._polygongrow(j, e, b);
				} else {
					if (this.is_drawing == this.DM_RECTANGLE_MOVE || this.is_drawing == this.DM_SQUARE_MOVE) {
						this.fireEvent("onMoveArea", this.currentid);
						e -= this.memory[this.currentid].rdownx;
						b -= this.memory[this.currentid].rdowny;
						if (e + h > this.pic.width || (b + d > this.pic.height || (0 > e || 0 > b))) {
							return;
						}
						j.style.left = e + 1 + "px";
						j.style.top = b + 1 + "px";
					} else {
						if (this.is_drawing == this.DM_POLYGON_MOVE) {
							this.fireEvent("onMoveArea", this.currentid);
							e -= this.memory[this.currentid].rdownx;
							b -= this.memory[this.currentid].rdowny;
							if (e + h > this.pic.width || (b + d > this.pic.height || (0 > e || 0 > b))) {
								return;
							}
							d = e - c;
							f = b - f;
							if (j.xpoints) {
								h = 0;
								a = j.xpoints.length;
								for (; h < a; h++) {
									j.xpoints[h] = this.memory[this.currentid].xpoints[h] + d;
									j.ypoints[h] = this.memory[this.currentid].ypoints[h] + f;
								}
							}
							j.style.left = e + "px";
							j.style.top = b + "px";
						} else {
							if (this.is_drawing == this.DM_SQUARE_RESIZE_LEFT) {
								this.fireEvent("onResizeArea", this.currentid);
								a = e - c;
								if (0 < h + -1 * a) {
									j.style.left = e + 1 + "px";
									j.style.top = f + a / 2 + "px";
									this.setAreaSize(this.currentid, parseInt(h + -1 * a, 10), parseInt(d + -1 * a, 10));
								} else {
									this.memory[this.currentid].width = 0;
									this.memory[this.currentid].height = 0;
									this.memory[this.currentid].left = e;
									this.memory[this.currentid].top = b;
									this.is_drawing = this.DM_SQUARE_RESIZE_RIGHT;
								}
							} else {
								if (this.is_drawing == this.DM_SQUARE_RESIZE_RIGHT) {
									this.fireEvent("onResizeArea", this.currentid);
									a = e - c - h;
									if (0 < h + a - 1) {
										j.style.top = f + -1 * a / 2 + "px";
										this.setAreaSize(this.currentid, h + a - 1, d + a);
									} else {
										this.memory[this.currentid].width = 0;
										this.memory[this.currentid].height = 0;
										this.memory[this.currentid].left = e;
										this.memory[this.currentid].top = b;
										this.is_drawing = this.DM_SQUARE_RESIZE_LEFT;
									}
								} else {
									if (this.is_drawing == this.DM_SQUARE_RESIZE_TOP) {
										this.fireEvent("onResizeArea", this.currentid);
										a = b - f;
										if (0 < h + -1 * a) {
											j.style.top = b + 1 + "px";
											j.style.left = c + a / 2 + "px";
											this.setAreaSize(this.currentid, h + -1 * a, d + -1 * a);
										} else {
											this.memory[this.currentid].width = 0;
											this.memory[this.currentid].height = 0;
											this.memory[this.currentid].left = e;
											this.memory[this.currentid].top = b;
											this.is_drawing = this.DM_SQUARE_RESIZE_BOTTOM;
										}
									} else {
										if (this.is_drawing == this.DM_SQUARE_RESIZE_BOTTOM) {
											this.fireEvent("onResizeArea", this.currentid);
											a = b - f - d;
											if (0 < h + a - 1) {
												j.style.left = c + -1 * a / 2 + "px";
												this.setAreaSize(this.currentid, h + a - 1, d + a - 1);
											} else {
												this.memory[this.currentid].width = 0;
												this.memory[this.currentid].height = 0;
												this.memory[this.currentid].left = e;
												this.memory[this.currentid].top = b;
												this.is_drawing = this.DM_SQUARE_RESIZE_TOP;
											}
										} else {
											if (this.is_drawing == this.DM_RECTANGLE_RESIZE_LEFT) {
												this.fireEvent("onResizeArea", this.currentid);
												d = e - c;
												if (0 < h + -1 * d) {
													j.style.left = e + 1 + "px";
													this.setAreaSize(this.currentid, h + -1 * d, null);
												} else {
													this.memory[this.currentid].width = 0;
													this.memory[this.currentid].left = e;
													this.is_drawing = this.DM_RECTANGLE_RESIZE_RIGHT;
												}
											} else {
												if (this.is_drawing == this.DM_RECTANGLE_RESIZE_RIGHT) {
													this.fireEvent("onResizeArea", this.currentid);
													d = e - c - h;
													if (0 < h + d - 1) {
														this.setAreaSize(this.currentid, h + d - 1, null);
													} else {
														this.memory[this.currentid].width = 0;
														this.memory[this.currentid].left = e;
														this.is_drawing = this.DM_RECTANGLE_RESIZE_LEFT;
													}
												} else {
													if (this.is_drawing == this.DM_RECTANGLE_RESIZE_TOP) {
														this.fireEvent("onResizeArea", this.currentid);
														f = b - f;
														if (0 < d + -1 * f) {
															j.style.top = b + 1 + "px";
															this.setAreaSize(this.currentid, null, d + -1 * f);
														} else {
															this.memory[this.currentid].height = 0;
															this.memory[this.currentid].top = b;
															this.is_drawing = this.DM_RECTANGLE_RESIZE_BOTTOM;
														}
													} else {
														if (this.is_drawing == this.DM_RECTANGLE_RESIZE_BOTTOM) {
															this.fireEvent("onResizeArea", this.currentid);
															f = b - f - d;
															if (0 < d + f - 1) {
																this.setAreaSize(this.currentid, null, d + f - 1);
															} else {
																this.memory[this.currentid].height = 0;
																this.memory[this.currentid].top = b;
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
			this._repaint(j, this.config.CL_DRAW_SHAPE, e, b);
			this._updatecoords(this.currentid);
		}
	}
};
imgmap.prototype.img_mouseup = function(a) {
	var e = this._getPos(this.pic);
	var b = this.isMSIE ? window.event.x + this.pic_container.scrollLeft - this.pic.offsetLeft : a.clientX - e.x;
	a = this.isMSIE ? window.event.y + this.pic_container.scrollTop - this.pic.offsetTop : a.clientY - e.y;
	if (this.is_drawing != this.DM_RECTANGLE_DRAW) {
		if (this.is_drawing != this.DM_SQUARE_DRAW && (this.is_drawing != this.DM_POLYGON_DRAW && this.is_drawing != this.DM_POLYGON_LASTDRAW)) {
			this.draggedId = null;
			this.is_drawing = 0;
			this.statusMessage(this.strings.READY);
			this.relaxArea(this.currentid);
			if (this.areas[this.currentid] != this._getLastArea()) {
				this.memory[this.currentid].downx = b;
				this.memory[this.currentid].downy = a;
			}
		}
	}
};
imgmap.prototype.img_mousedown = function(a) {
	var e = this._getPos(this.pic);
	var b = this.isMSIE ? window.event.x + this.pic_container.scrollLeft - this.pic.offsetLeft : a.clientX - e.x;
	e = this.isMSIE ? window.event.y + this.pic_container.scrollTop - this.pic.offsetTop : a.clientY - e.y;
	if (!a) {
		a = window.event;
	}
	if (a.shiftKey) {
		if (this.is_drawing == this.DM_POLYGON_DRAW) {
			this.is_drawing = this.DM_POLYGON_LASTDRAW;
		}
	}
	a = this.areas[this.currentid];
	if (this.is_drawing == this.DM_POLYGON_DRAW) {
		a.xpoints[a.xpoints.length] = b - 5;
		a.ypoints[a.ypoints.length] = e - 5;
		this.memory[this.currentid].downx = b;
		this.memory[this.currentid].downy = e;
	} else {
		if (this.is_drawing && this.is_drawing != this.DM_POLYGON_DRAW) {
			if (this.is_drawing == this.DM_POLYGON_LASTDRAW) {
				a.xpoints[a.xpoints.length] = b - 5;
				a.ypoints[a.ypoints.length] = e - 5;
				this._updatecoords(this.currentid);
				this.is_drawing = 0;
				this._polygonshrink(a);
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
					this.areas[this.currentid].style.left = b + "px";
					this.areas[this.currentid].style.top = e + "px";
					this.areas[this.currentid].style.width = 0;
					this.areas[this.currentid].style.height = 0;
					this.areas[this.currentid].xpoints = [];
					this.areas[this.currentid].ypoints = [];
					this.areas[this.currentid].xpoints[0] = b;
					this.areas[this.currentid].ypoints[0] = e;
				} else {
					if ("rect" == this.areas[this.currentid].shape) {
						this.is_drawing = this.DM_RECTANGLE_DRAW;
						this.statusMessage(this.strings.RECTANGLE_DRAW);
						this.areas[this.currentid].style.left = b + "px";
						this.areas[this.currentid].style.top = e + "px";
						this.areas[this.currentid].style.width = 0;
						this.areas[this.currentid].style.height = 0;
					} else {
						if ("circle" == this.areas[this.currentid].shape) {
							this.is_drawing = this.DM_SQUARE_DRAW;
							this.statusMessage(this.strings.SQUARE_DRAW);
							this.areas[this.currentid].style.left = b + "px";
							this.areas[this.currentid].style.top = e + "px";
							this.areas[this.currentid].style.width = 0;
							this.areas[this.currentid].style.height = 0;
						}
					}
				}
				this._setBorder(this.areas[this.currentid], "DRAW");
				this.memory[this.currentid].downx = b;
				this.memory[this.currentid].downy = e;
			}
		}
	}
};
imgmap.prototype.highlightArea = function(a, e) {
	if (!this.is_drawing) {
		var b = this.areas[a];
		if (b) {
			if ("undefined" != b.shape) {
				if (e) {
					this.fireEvent("onFocusArea", b);
				}
				this._setBorder(b, "HIGHLIGHT");
				this._setopacity(b, this.config.CL_HIGHLIGHT_BG, "-" + this.config.highlight_opacity);
				this._repaint(b, this.config.CL_HIGHLIGHT_SHAPE);
			}
		}
	}
};
imgmap.prototype.blurArea = function(a, e) {
	if (!this.is_drawing) {
		var b = this.areas[a];
		if (b) {
			if ("undefined" != b.shape) {
				if (e) {
					this.fireEvent("onBlurArea", b);
				}
				this._setBorder(b, "NORM");
				this._setopacity(b, this.config.CL_NORM_BG, "-" + this.config.norm_opacity);
				this._repaint(b, this.config.CL_NORM_SHAPE);
			}
		}
	}
};
imgmap.prototype.area_mousemove = function(a) {
	if (this.is_drawing) {
		this.img_mousemove(a);
	} else {
		var e = this.isMSIE ? window.event.srcElement : a.currentTarget;
		if ("DIV" == e.tagName) {
			e = e.parentNode;
		}
		if ("image" == e.tagName || ("group" == e.tagName || ("shape" == e.tagName || "stroke" == e.tagName))) {
			e = e.parentNode.parentNode;
		}
		if (this.isOpera) {
			a.layerX = a.offsetX;
			a.layerY = a.offsetY;
		}
		var b = this.isMSIE ? window.event.offsetX : a.layerX;
		a = this.isMSIE ? window.event.offsetY : a.layerY;
		if (CKEDITOR.env.webkit) {
			b -= window.scrollX;
			a -= window.scrollY;
		}
		var d = "rect" == e.shape || "circle" == e.shape;
		e.style.cursor = d && (6 > b && 6 < a) ? "w-resize" : d && (b > parseInt(e.style.width, 10) - 6 && 6 < a) ? "e-resize" : d && (6 < b && 6 > a) ? "n-resize" : d && (a > parseInt(e.style.height, 10) - 6 && 6 < b) ? "s-resize" : "move";
		if (e.aid != this.draggedId) {
			if ("move" == e.style.cursor) {
				e.style.cursor = "default";
			}
		} else {
			e = this.areas[this.currentid];
			if (6 > b && 6 < a) {
				if ("circle" == e.shape) {
					this.is_drawing = this.DM_SQUARE_RESIZE_LEFT;
					this.statusMessage(this.strings.SQUARE_RESIZE_LEFT);
				} else {
					if ("rect" == e.shape) {
						this.is_drawing = this.DM_RECTANGLE_RESIZE_LEFT;
						this.statusMessage(this.strings.RECTANGLE_RESIZE_LEFT);
					}
				}
			} else {
				if (b > parseInt(e.style.width, 10) - 6 && 6 < a) {
					if ("circle" == e.shape) {
						this.is_drawing = this.DM_SQUARE_RESIZE_RIGHT;
						this.statusMessage(this.strings.SQUARE_RESIZE_RIGHT);
					} else {
						if ("rect" == e.shape) {
							this.is_drawing = this.DM_RECTANGLE_RESIZE_RIGHT;
							this.statusMessage(this.strings.RECTANGLE_RESIZE_RIGHT);
						}
					}
				} else {
					if (6 < b && 6 > a) {
						if ("circle" == e.shape) {
							this.is_drawing = this.DM_SQUARE_RESIZE_TOP;
							this.statusMessage(this.strings.SQUARE_RESIZE_TOP);
						} else {
							if ("rect" == e.shape) {
								this.is_drawing = this.DM_RECTANGLE_RESIZE_TOP;
								this.statusMessage(this.strings.RECTANGLE_RESIZE_TOP);
							}
						}
					} else {
						if (a > parseInt(e.style.height, 10) - 6 && 6 < b) {
							if ("circle" == e.shape) {
								this.is_drawing = this.DM_SQUARE_RESIZE_BOTTOM;
								this.statusMessage(this.strings.SQUARE_RESIZE_BOTTOM);
							} else {
								if ("rect" == e.shape) {
									this.is_drawing = this.DM_RECTANGLE_RESIZE_BOTTOM;
									this.statusMessage(this.strings.RECTANGLE_RESIZE_BOTTOM);
								}
							}
						} else {
							if ("circle" == e.shape) {
								this.is_drawing = this.DM_SQUARE_MOVE;
								this.statusMessage(this.strings.SQUARE_MOVE);
								this.memory[this.currentid].rdownx = b;
								this.memory[this.currentid].rdowny = a;
							} else {
								if ("rect" == e.shape) {
									this.is_drawing = this.DM_RECTANGLE_MOVE;
									this.statusMessage(this.strings.RECTANGLE_MOVE);
									this.memory[this.currentid].rdownx = b;
									this.memory[this.currentid].rdowny = a;
								} else {
									if ("poly" == e.shape) {
										if (e.xpoints) {
											d = 0;
											var f = e.xpoints.length;
											for (; d < f; d++) {
												this.memory[this.currentid].xpoints[d] = e.xpoints[d];
												this.memory[this.currentid].ypoints[d] = e.ypoints[d];
											}
										}
										if ("poly" == e.shape) {
											this.is_drawing = this.DM_POLYGON_MOVE;
											this.statusMessage(this.strings.POLYGON_MOVE);
										}
										this.memory[this.currentid].rdownx = b;
										this.memory[this.currentid].rdowny = a;
									}
								}
							}
						}
					}
				}
			}
			this.memory[this.currentid].width = parseInt(e.style.width, 10);
			this.memory[this.currentid].height = parseInt(e.style.height, 10);
			this.memory[this.currentid].top = parseInt(e.style.top, 10);
			this.memory[this.currentid].left = parseInt(e.style.left, 10);
			this._setBorder(e, "DRAW");
			this._setopacity(e, this.config.CL_DRAW_BG, this.config.draw_opacity);
		}
	}
};
imgmap.prototype.area_mouseup = function(a) {
	if (this.is_drawing) {
		this.img_mouseup(a);
	} else {
		a = this.isMSIE ? window.event.srcElement : a.currentTarget;
		if ("DIV" == a.tagName) {
			a = a.parentNode;
		}
		if ("image" == a.tagName || ("group" == a.tagName || ("shape" == a.tagName || "stroke" == a.tagName))) {
			a = a.parentNode.parentNode;
		}
		if (this.areas[this.currentid] != a && "undefined" == typeof a.aid) {
			this.log("Cannot identify target area", 1);
		} else {
			this.draggedId = null;
		}
	}
};
imgmap.prototype.area_mouseover = function(a) {
	if (!this.is_drawing) {
		a = this.isMSIE ? window.event.srcElement : a.currentTarget;
		if ("DIV" == a.tagName) {
			a = a.parentNode;
		}
		if ("image" == a.tagName || ("group" == a.tagName || ("shape" == a.tagName || "stroke" == a.tagName))) {
			a = a.parentNode.parentNode;
		}
		this.highlightArea(a.aid, true);
	}
};
imgmap.prototype.area_mouseout = function(a) {
	if (!this.is_drawing) {
		a = this.isMSIE ? window.event.srcElement : a.currentTarget;
		if ("DIV" == a.tagName) {
			a = a.parentNode;
		}
		if ("image" == a.tagName || ("group" == a.tagName || ("shape" == a.tagName || "stroke" == a.tagName))) {
			a = a.parentNode.parentNode;
		}
		if (this.currentid != a.aid) {
			this.blurArea(a.aid, true);
		}
	}
};
imgmap.prototype.area_dblclick = function(a) {
	if (!this.is_drawing) {
		var e = this.isMSIE ? window.event.srcElement : a.currentTarget;
		if ("DIV" == e.tagName) {
			e = e.parentNode;
		}
		if ("image" == e.tagName || ("group" == e.tagName || ("shape" == e.tagName || "stroke" == e.tagName))) {
			e = e.parentNode.parentNode;
		}
		if (this.areas[this.currentid] != e) {
			if ("undefined" == typeof e.aid) {
				this.log("Cannot identify target area", 1);
				return;
			}
			this.blurArea(this.currentid);
			this.currentid = e.aid;
		}
		this.fireEvent("onDblClickArea", this.areas[this.currentid]);
		if (this.isMSIE) {
			window.event.cancelBubble = true;
		} else {
			a.stopPropagation();
		}
	}
};
imgmap.prototype.area_mousedown = function(a) {
	if (this.is_drawing) {
		this.img_mousedown(a);
	} else {
		var e = this.isMSIE ? window.event.srcElement : a.currentTarget;
		if ("DIV" == e.tagName) {
			e = e.parentNode;
		}
		if ("image" == e.tagName || ("group" == e.tagName || ("shape" == e.tagName || "stroke" == e.tagName))) {
			e = e.parentNode.parentNode;
		}
		if (this.areas[this.currentid] != e) {
			if ("undefined" == typeof e.aid) {
				this.log("Cannot identify target area", 1);
				return;
			}
			this.blurArea(this.currentid);
			this.currentid = e.aid;
		}
		this.selectedId = this.draggedId = this.currentid;
		this.fireEvent("onSelectArea", this.areas[this.currentid]);
		if (this.isMSIE) {
			window.event.cancelBubble = true;
		} else {
			a.stopPropagation();
		}
	}
};
imgmap.prototype.doc_keydown = function(a) {
	a = this.isMSIE ? event.keyCode : a.keyCode;
	if (46 == a) {
		if (null !== this.selectedId) {
			if (!this.is_drawing) {
				this.removeArea(this.selectedId);
			}
		}
	} else {
		if (16 == a) {
			if (this.is_drawing == this.DM_RECTANGLE_DRAW) {
				this.is_drawing = this.DM_SQUARE_DRAW;
				this.statusMessage(this.strings.SQUARE2_DRAW);
			}
		}
	}
};
imgmap.prototype.doc_keyup = function(a) {
	if (16 == (this.isMSIE ? event.keyCode : a.keyCode) && (this.is_drawing == this.DM_SQUARE_DRAW && "rect" == this.areas[this.currentid].shape)) {
		this.is_drawing = this.DM_RECTANGLE_DRAW;
		this.statusMessage(this.strings.RECTANGLE_DRAW);
	}
};
imgmap.prototype.doc_mousedown = function() {
	if (!this.is_drawing) {
		this.selectedId = null;
	}
};
imgmap.prototype._getPos = function(a) {
	a = a.getBoundingClientRect();
	return {
		x: a.left,
		y: a.top
	};
};
imgmap.prototype._getLastArea = function() {
	var a = this.areas.length - 1;
	for (; 0 <= a; a--) {
		if (this.areas[a]) {
			return this.areas[a];
		}
	}
	return null;
};
imgmap.prototype.assignCSS = function(a, e) {
	var b = e.split(";");
	var d = 0;
	for (; d < b.length; d++) {
		var f = b[d].split(":");
		var c = this.trim(f[0]).split("-");
		var h = c[0];
		var j = 1;
		for (; j < c.length; j++) {
			h += c[j].replace(/^\w/, c[j].substring(0, 1).toUpperCase());
		}
		a.style[this.trim(h)] = this.trim(f[1]);
	}
};
imgmap.prototype.fireEvent = function(a, e) {
	if ("function" == typeof this.config.custom_callbacks[a]) {
		return this.config.custom_callbacks[a](e);
	}
};
imgmap.prototype.setAreaSize = function(a, e, b) {
	if (null === a) {
		a = this.currentid;
	}
	a = this.areas[a];
	if (null !== e) {
		a.width = e;
		a.style.width = e + "px";
		a.setAttribute("width", e);
	}
	if (null !== b) {
		a.height = b;
		a.style.height = b + "px";
		a.setAttribute("height", b);
	}
};
imgmap.prototype.detectLanguage = function() {
	var a;
	if (navigator.userLanguage) {
		a = navigator.userLanguage.toLowerCase();
	} else {
		if (navigator.language) {
			a = navigator.language.toLowerCase();
		} else {
			return this.config.defaultLang;
		}
	}
	return 2 <= a.length ? a = a.substring(0, 2) : this.config.defaultLang;
};
imgmap.prototype.disableSelection = function(a) {
	if ("undefined" == typeof a || !a) {
		return false;
	}
	if ("undefined" != typeof a.onselectstart) {
		a.onselectstart = function() {
			return false;
		};
	}
	if ("undefined" != typeof a.unselectable) {
		a.unselectable = "on";
	}
	if ("undefined" != typeof a.style.MozUserSelect) {
		a.style.MozUserSelect = "none";
	}
};
Function.prototype.bind = function(a) {
	var e = this;
	return function() {
		return e.apply(a, arguments);
	};
};
imgmap.prototype.trim = function(a) {
	return a.replace(/^\s+|\s+$/g, "");
};
if (!document.createElement("canvas").getContext) {
	(function() {
		function a() {
			return this.context_ || (this.context_ = new i(this));
		}

		function e(a, b) {
			var c = B.call(arguments, 2);
			return function() {
				return a.apply(b, c.concat(B.call(arguments)));
			};
		}

		function b(a) {
			var b = a.srcElement;
			switch (a.propertyName) {
				case "width":
					b.style.width = b.attributes.width.nodeValue + "px";
					b.getContext().clearRect();
					break;
				case "height":
					b.style.height = b.attributes.height.nodeValue + "px";
					b.getContext().clearRect();
			}
		}

		function d(a) {
			a = a.srcElement;
			if (a.firstChild) {
				a.firstChild.style.width = a.clientWidth + "px";
				a.firstChild.style.height = a.clientHeight + "px";
			}
		}

		function f() {
			return [
				[1, 0, 0],
				[0, 1, 0],
				[0, 0, 1]
			];
		}

		function c(a, b) {
			var c = f();
			var d;
			var e;
			var g;
			var h = 0;
			for (; 3 > h; h++) {
				d = 0;
				for (; 3 > d; d++) {
					g = e = 0;
					for (; 3 > g; g++) {
						e += a[h][g] * b[g][d];
					}
					c[h][d] = e;
				}
			}
			return c;
		}

		function h(a, b) {
			b.fillStyle = a.fillStyle;
			b.lineCap = a.lineCap;
			b.lineJoin = a.lineJoin;
			b.lineWidth = a.lineWidth;
			b.miterLimit = a.miterLimit;
			b.shadowBlur = a.shadowBlur;
			b.shadowColor = a.shadowColor;
			b.shadowOffsetX = a.shadowOffsetX;
			b.shadowOffsetY = a.shadowOffsetY;
			b.strokeStyle = a.strokeStyle;
			b.globalAlpha = a.globalAlpha;
			b.arcScaleX_ = a.arcScaleX_;
			b.arcScaleY_ = a.arcScaleY_;
			b.lineScale_ = a.lineScale_;
		}

		function j(a) {
			var b;
			var c = 1;
			var d;
			if (a = "" + a, "rgb" == a.substring(0, 3)) {
				b = a.indexOf("(", 3);
				d = a.indexOf(")", b + 1);
				var e = a.substring(b + 1, d).split(",");
				b = "#";
				d = 0;
				for (; 3 > d; d++) {
					b += z[Number(e[d])];
				}
				if (4 == e.length) {
					if ("a" == a.substr(3, 1)) {
						c = e[3];
					}
				}
			} else {
				b = a;
			}
			return {
				color: b,
				alpha: c
			};
		}

		function g(a) {
			switch (a) {
				case "butt":
					return "flat";
				case "round":
					return "round";
				default:
					return "square";
			}
		}

		function i(a) {
			this.m_ = f();
			this.mStack_ = [];
			this.aStack_ = [];
			this.currentPath_ = [];
			this.fillStyle = this.strokeStyle = "#000";
			this.lineWidth = 1;
			this.lineJoin = "miter";
			this.lineCap = "butt";
			this.miterLimit = 1 * q;
			this.globalAlpha = 1;
			this.canvas = a;
			var b = a.ownerDocument.createElement("div");
			b.style.width = a.clientWidth + "px";
			b.style.height = a.clientHeight + "px";
			b.style.overflow = "hidden";
			b.style.position = "absolute";
			a.appendChild(b);
			this.element_ = b;
			this.lineScale_ = this.arcScaleY_ = this.arcScaleX_ = 1;
		}

		function k(a, b, c, d) {
			a.currentPath_.push({
				type: "bezierCurveTo",
				cp1x: b.x,
				cp1y: b.y,
				cp2x: c.x,
				cp2y: c.y,
				x: d.x,
				y: d.y
			});
			a.currentX_ = d.x;
			a.currentY_ = d.y;
		}

		function n(a, b, c) {
			var d;
			a: {
				var e = 0;
				for (; 3 > e; e++) {
					d = 0;
					for (; 2 > d; d++) {
						if (!isFinite(b[e][d]) || isNaN(b[e][d])) {
							d = false;
							break a;
						}
					}
				}
				d = true;
			}
			if (d && (a.m_ = b, c)) {
				a.lineScale_ = x(p(b[0][0] * b[1][1] - b[0][1] * b[1][0]));
			}
		}

		function o(a) {
			this.type_ = a;
			this.r1_ = this.y1_ = this.x1_ = this.r0_ = this.y0_ = this.x0_ = 0;
			this.colors_ = [];
		}

		function r() {}
		var l = Math;
		var m = l.round;
		var s = l.sin;
		var t = l.cos;
		var p = l.abs;
		var x = l.sqrt;
		var q = 10;
		var u = q / 2;
		var B = Array.prototype.slice;
		var v = {
			init: function(a) {
				if (/MSIE/.test(navigator.userAgent)) {
					if (!window.opera) {
						a = a || document;
						a.createElement("canvas");
						if ("complete" !== a.readyState) {
							a.attachEvent("onreadystatechange", e(this.init_, this, a));
						} else {
							this.init_(a);
						}
					}
				}
			},
			init_: function(a) {
				var b;
				if (!a.namespaces.g_vml_) {
					a.namespaces.add("g_vml_", "urn:schemas-microsoft-com:vml", "#default#VML");
				}
				if (!a.namespaces.g_o_) {
					a.namespaces.add("g_o_", "urn:schemas-microsoft-com:office:office", "#default#VML");
				}
				if (!a.styleSheets.ex_canvas_) {
					b = a.createStyleSheet();
					b.owningElement.id = "ex_canvas_";
					b.cssText = "canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}g_vml_\\:*{behavior:url(#default#VML)}g_o_\\:*{behavior:url(#default#VML)}";
				}
				a = a.getElementsByTagName("canvas");
				b = 0;
				for (; b < a.length; b++) {
					this.initElement(a[b]);
				}
			},
			initElement: function(c) {
				if (!c.getContext) {
					c.getContext = a;
					c.innerHTML = "";
					c.attachEvent("onpropertychange", b);
					c.attachEvent("onresize", d);
					var e = c.attributes;
					if (e.width && e.width.specified) {
						c.style.width = e.width.nodeValue + "px";
					} else {
						c.width = c.clientWidth;
					}
					if (e.height && e.height.specified) {
						c.style.height = e.height.nodeValue + "px";
					} else {
						c.height = c.clientHeight;
					}
				}
				return c;
			}
		};
		var z;
		var w;
		var D;
		v.init();
		z = [];
		w = 0;
		for (; 16 > w; w++) {
			D = 0;
			for (; 16 > D; D++) {
				z[16 * w + D] = w.toString(16) + D.toString(16);
			}
		}
		w = i.prototype;
		w.clearRect = function() {
			this.element_.innerHTML = "";
		};
		w.beginPath = function() {
			this.currentPath_ = [];
		};
		w.moveTo = function(a, b) {
			var c = this.getCoords_(a, b);
			this.currentPath_.push({
				type: "moveTo",
				x: c.x,
				y: c.y
			});
			this.currentX_ = c.x;
			this.currentY_ = c.y;
		};
		w.lineTo = function(a, b) {
			var c = this.getCoords_(a, b);
			this.currentPath_.push({
				type: "lineTo",
				x: c.x,
				y: c.y
			});
			this.currentX_ = c.x;
			this.currentY_ = c.y;
		};
		w.bezierCurveTo = function(a, b, c, d, e, f) {
			e = this.getCoords_(e, f);
			a = this.getCoords_(a, b);
			c = this.getCoords_(c, d);
			k(this, a, c, e);
		};
		w.quadraticCurveTo = function(a, b, c, d) {
			a = this.getCoords_(a, b);
			c = this.getCoords_(c, d);
			d = {
				x: this.currentX_ + 2 / 3 * (a.x - this.currentX_),
				y: this.currentY_ + 2 / 3 * (a.y - this.currentY_)
			};
			k(this, d, {
				x: d.x + (c.x - this.currentX_) / 3,
				y: d.y + (c.y - this.currentY_) / 3
			}, c);
		};
		w.arc = function(a, b, c, d, e, f) {
			c = c * q;
			var g = f ? "at" : "wa";
			var h = a + t(d) * c - u;
			var i = b + s(d) * c - u;
			d = a + t(e) * c - u;
			e = b + s(e) * c - u;
			if (!(h != d)) {
				if (!f) {
					h += 0.125;
				}
			}
			a = this.getCoords_(a, b);
			h = this.getCoords_(h, i);
			d = this.getCoords_(d, e);
			this.currentPath_.push({
				type: g,
				x: a.x,
				y: a.y,
				radius: c,
				xStart: h.x,
				yStart: h.y,
				xEnd: d.x,
				yEnd: d.y
			});
		};
		w.rect = function(a, b, c, d) {
			this.moveTo(a, b);
			this.lineTo(a + c, b);
			this.lineTo(a + c, b + d);
			this.lineTo(a, b + d);
			this.closePath();
		};
		w.strokeRect = function(a, b, c, d) {
			var e = this.currentPath_;
			this.beginPath();
			this.moveTo(a, b);
			this.lineTo(a + c, b);
			this.lineTo(a + c, b + d);
			this.lineTo(a, b + d);
			this.closePath();
			this.stroke();
			this.currentPath_ = e;
		};
		w.fillRect = function(a, b, c, d) {
			var e = this.currentPath_;
			this.beginPath();
			this.moveTo(a, b);
			this.lineTo(a + c, b);
			this.lineTo(a + c, b + d);
			this.lineTo(a, b + d);
			this.closePath();
			this.fill();
			this.currentPath_ = e;
		};
		w.createLinearGradient = function(a, b, c, d) {
			var e = new o("gradient");
			return e.x0_ = a, e.y0_ = b, e.x1_ = c, e.y1_ = d, e;
		};
		w.createRadialGradient = function(a, b, c, d, e, f) {
			var g = new o("gradientradial");
			return g.x0_ = a, g.y0_ = b, g.r0_ = c, g.x1_ = d, g.y1_ = e, g.r1_ = f, g;
		};
		w.drawImage = function(a) {
			var b;
			var c;
			var d;
			var e;
			var f;
			var g;
			var h;
			var i;
			d = a.runtimeStyle.width;
			e = a.runtimeStyle.height;
			var j;
			var k;
			var n;
			if (a.runtimeStyle.width = "auto", a.runtimeStyle.height = "auto", j = a.width, k = a.height, a.runtimeStyle.width = d, a.runtimeStyle.height = e, 3 == arguments.length) {
				b = arguments[1];
				c = arguments[2];
				f = g = 0;
				h = d = j;
				i = e = k;
			} else {
				if (5 == arguments.length) {
					b = arguments[1];
					c = arguments[2];
					d = arguments[3];
					e = arguments[4];
					f = g = 0;
					h = j;
					i = k;
				} else {
					if (9 == arguments.length) {
						f = arguments[1];
						g = arguments[2];
						h = arguments[3];
						i = arguments[4];
						b = arguments[5];
						c = arguments[6];
						d = arguments[7];
						e = arguments[8];
					} else {
						throw Error("Invalid number of arguments");
					}
				}
			}
			var o = this.getCoords_(b, c);
			var p = [];
			if (p.push(" <g_vml_:group", ' coordsize="', 10 * q, ",", 10 * q, '"', ' coordorigin="0,0"', ' style="width:', 10, "px;height:", 10, "px;position:absolute;"), 1 != this.m_[0][0] || this.m_[0][1]) {
				n = [];
				n.push("M11=", this.m_[0][0], ",", "M12=", this.m_[1][0], ",", "M21=", this.m_[0][1], ",", "M22=", this.m_[1][1], ",", "Dx=", m(o.x / q), ",", "Dy=", m(o.y / q), "");
				var r = this.getCoords_(b + d, c);
				var s = this.getCoords_(b, c + e);
				b = this.getCoords_(b + d, c + e);
				o.x = l.max(o.x, r.x, s.x, b.x);
				o.y = l.max(o.y, r.y, s.y, b.y);
				p.push("padding:0 ", m(o.x / q), "px ", m(o.y / q), "px 0;filter:progid:DXImageTransform.Microsoft.Matrix(", n.join(""), ", sizingmethod='clip');");
			} else {
				p.push("top:", m(o.y / q), "px;left:", m(o.x / q), "px;");
			}
			p.push(' ">', '<g_vml_:image src="', a.src, '"', ' style="width:', q * d, "px;", " height:", q * e, 'px;"', ' cropleft="', f / j, '"', ' croptop="', g / k, '"', ' cropright="', (j - f - h) / j, '"', ' cropbottom="', (k - g - i) / k, '"', " />", "</g_vml_:group>");
			this.element_.insertAdjacentHTML("BeforeEnd", p.join(""));
		};
		w.stroke = function(a) {
			var b = [];
			var c = j(a ? this.fillStyle : this.strokeStyle);
			var d = c.color;
			c = c.alpha * this.globalAlpha;
			var e;
			var f;
			var h;
			var i;
			b.push("<g_vml_:shape", ' filled="', !!a, '"', ' style="position:absolute;width:', 10, "px;height:", 10, 'px;"', ' coordorigin="0 0" coordsize="', 10 * q, " ", 10 * q, '"', ' stroked="', !a, '"', ' path="');
			var k = i = h = null;
			var n = null;
			f = 0;
			for (; f < this.currentPath_.length; f++) {
				e = this.currentPath_[f];
				switch (e.type) {
					case "moveTo":
						b.push(" m ", m(e.x), ",", m(e.y));
						break;
					case "lineTo":
						b.push(" l ", m(e.x), ",", m(e.y));
						break;
					case "close":
						b.push(" x ");
						e = null;
						break;
					case "bezierCurveTo":
						b.push(" c ", m(e.cp1x), ",", m(e.cp1y), ",", m(e.cp2x), ",", m(e.cp2y), ",", m(e.x), ",", m(e.y));
						break;
					case "at":
						;
					case "wa":
						b.push(" ", e.type, " ", m(e.x - this.arcScaleX_ * e.radius), ",", m(e.y - this.arcScaleY_ * e.radius), " ", m(e.x + this.arcScaleX_ * e.radius), ",", m(e.y + this.arcScaleY_ * e.radius), " ", m(e.xStart), ",", m(e.yStart), " ", m(e.xEnd), ",", m(e.yEnd));
				}
				if (e) {
					if (null == h || e.x < h) {
						h = e.x;
					}
					if (null == k || e.x > k) {
						k = e.x;
					}
					if (null == i || e.y < i) {
						i = e.y;
					}
					if (null == n || e.y > n) {
						n = e.y;
					}
				}
			}
			if (b.push(' ">'), a) {
				if ("object" == typeof this.fillStyle) {
					d = this.fillStyle;
					var o = 0;
					e = c = a = 0;
					var p = 1;
					if ("gradient" == d.type_) {
						o = d.x1_ / this.arcScaleX_;
						h = d.y1_ / this.arcScaleY_;
						f = this.getCoords_(d.x0_ / this.arcScaleX_, d.y0_ / this.arcScaleY_);
						o = this.getCoords_(o, h);
						o = 180 * Math.atan2(o.x - f.x, o.y - f.y) / Math.PI;
						if (0 > o) {
							o += 360;
						}
						if (1E-6 > o) {
							o = 0;
						}
					} else {
						f = this.getCoords_(d.x0_, d.y0_);
						e = k - h;
						p = n - i;
						a = (f.x - h) / e;
						c = (f.y - i) / p;
						e /= this.arcScaleX_ * q;
						p /= this.arcScaleY_ * q;
						f = l.max(e, p);
						e = 2 * d.r0_ / f;
						p = 2 * d.r1_ / f - e;
					}
					h = d.colors_;
					h.sort(function(a, b) {
						return a.offset - b.offset;
					});
					n = h.length;
					k = h[0].color;
					var r = h[n - 1].color;
					var s = h[0].alpha * this.globalAlpha;
					var t = h[n - 1].alpha * this.globalAlpha;
					var u = [];
					f = 0;
					for (; f < n; f++) {
						i = h[f];
						u.push(i.offset * p + e + " " + i.color);
					}
					b.push('<g_vml_:fill type="', d.type_, '"', ' method="none" focus="100%"', ' color="', k, '"', ' color2="', r, '"', ' colors="', u.join(","), '"', ' opacity="', t, '"', ' g_o_:opacity2="', s, '"', ' angle="', o, '"', ' focusposition="', a, ",", c, '" />');
				} else {
					b.push('<g_vml_:fill color="', d, '" opacity="', c, '" />');
				}
			} else {
				a = this.lineScale_ * this.lineWidth;
				if (1 > a) {
					c *= a;
				}
				b.push("<g_vml_:stroke", ' opacity="', c, '"', ' joinstyle="', this.lineJoin, '"', ' miterlimit="', this.miterLimit, '"', ' endcap="', g(this.lineCap), '"', ' weight="', a, 'px"', ' color="', d, '" />');
			}
			b.push("</g_vml_:shape>");
			this.element_.insertAdjacentHTML("beforeEnd", b.join(""));
		};
		w.fill = function() {
			this.stroke(true);
		};
		w.closePath = function() {
			this.currentPath_.push({
				type: "close"
			});
		};
		w.getCoords_ = function(a, b) {
			var c = this.m_;
			return {
				x: q * (a * c[0][0] + b * c[1][0] + c[2][0]) - u,
				y: q * (a * c[0][1] + b * c[1][1] + c[2][1]) - u
			};
		};
		w.save = function() {
			var a = {};
			h(this, a);
			this.aStack_.push(a);
			this.mStack_.push(this.m_);
			this.m_ = c(f(), this.m_);
		};
		w.restore = function() {
			h(this.aStack_.pop(), this);
			this.m_ = this.mStack_.pop();
		};
		w.translate = function(a, b) {
			n(this, c([
				[1, 0, 0],
				[0, 1, 0],
				[a, b, 1]
			], this.m_), false);
		};
		w.rotate = function(a) {
			var b = t(a);
			a = s(a);
			n(this, c([
				[b, a, 0],
				[-a, b, 0],
				[0, 0, 1]
			], this.m_), false);
		};
		w.scale = function(a, b) {
			this.arcScaleX_ *= a;
			this.arcScaleY_ *= b;
			n(this, c([
				[a, 0, 0],
				[0, b, 0],
				[0, 0, 1]
			], this.m_), true);
		};
		w.transform = function(a, b, d, e, f, g) {
			n(this, c([
				[a, b, 0],
				[d, e, 0],
				[f, g, 1]
			], this.m_), true);
		};
		w.setTransform = function(a, b, c, d, e, f) {
			n(this, [
				[a, b, 0],
				[c, d, 0],
				[e, f, 1]
			], true);
		};
		w.clip = function() {};
		w.arcTo = function() {};
		w.createPattern = function() {
			return new r;
		};
		o.prototype.addColorStop = function(a, b) {
			b = j(b);
			this.colors_.push({
				offset: a,
				color: b.color,
				alpha: b.alpha
			});
		};
		G_vmlCanvasManager = v;
		CanvasRenderingContext2D = i;
		CanvasGradient = o;
		CanvasPattern = r;
	})();
}