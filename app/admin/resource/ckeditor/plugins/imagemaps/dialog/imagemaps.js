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