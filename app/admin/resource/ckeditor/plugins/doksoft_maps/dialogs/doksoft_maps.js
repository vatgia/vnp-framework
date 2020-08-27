CKEDITOR.dialog.add("doksoft_maps", function(a) {
	return {
		title: "DOKSoft Maps",
		resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
		minHeight: 550,
		contents: [{
			id: "preview",
			label: "1111",
			elements: [{
				type: "html",
				id: "previewHtml",
				html: '<iframe src="' + a.path + "dialogs/doksoft_maps.html" + '" style="width: 100%; height: ' + 540 + 'px" hidefocus="true" frameborder="0" ' + 'id="cke_docProps_preview_iframe"></iframe>',
			}]
		}],
		onShow: function() {
			var b = this.getSelectedElement();
			var d = this;
			if (b && b.is("img") && b.$.className == "doksoft_maps_img") {
				this.parts.title.$.innerHTML = "Edit map";
				try {
					CKEDITOR.config.doksoft_maps_current = JSON.parse(decodeURIComponent(b.$.getAttribute("data_script")));
				} catch (c) {
					CKEDITOR.config.doksoft_maps_current = null;
				}
				CKEDITOR.config.doksoft_maps_current && loadMapFromJSON(CKEDITOR.config.doksoft_maps_current);
			} else {
				this.parts.title.$.innerHTML = "Insert new map";
				try {
					loadMapFromJSON({
						lat: CKEDITOR.config.doksoft_maps_default_x,
						lng: CKEDITOR.config.doksoft_maps_default_y,
						zoom: CKEDITOR.config.doksoft_maps_default_zoom,
						type: "roadmap",
						width: CKEDITOR.config.doksoft_maps_width,
						height: CKEDITOR.config.doksoft_maps_height,
						"settings": {
							"disableDefaultUI": 0,
							"disableDoubleClickZoom": 0,
							"draggable": 1,
							"mapTypeControl": 1,
							"zoomControl": 1,
							"rotateControl": 0,
							"scaleControl": 0,
							"streetViewControl": 0,
							"panControl": 0,
							"overviewMapControl": 0
						}
					});
				} catch (c) {}
			}
		},
		onLoad: function() {
			this.on("resize", function(b) {
				document.getElementById("cke_docProps_preview_iframe").style.height = b.data.height + "px";
				triggerResize && triggerResize.call && triggerResize(b.data.height - 60);
			});
		},
		onOk: function() {
			var b = '<img class="doksoft_maps_img" contenteditable="false" data_script="' + encodeURIComponent(JSON.stringify(generateCodeMap())) + '" src="' + generateStatMap(generateCodeMap()) + '"/>';
			var c = CKEDITOR.dom.element.createFromHtml(b);
			a.insertElement(c);
		}
	};
});