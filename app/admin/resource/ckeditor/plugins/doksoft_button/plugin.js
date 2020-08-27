CKEDITOR.plugins.add("doksoft_button", {
	icons: "doksoft_button",
	init: function(editor) {
		currentData = {};
		var init = function() {
			var selection = editor.getSelection();
			var ranges = selection.getRanges();
			var g;
			var element = selection.getSelectedElement();
			if (element && element.is("a")) {
				return element;
			} else {
				if (ranges.length > 0) {
					if (CKEDITOR.env.webkit) {
						ranges[0].shrink(CKEDITOR.NODE_ELEMENT);
					}
					if (CKEDITOR.version.charAt(0) == "4") {
						element = editor.elementPath(ranges[0].getCommonAncestor(true)).contains("a", 1);
					} else {
						element = CKEDITOR.plugins.link.getSelectedLink(editor);
					}
				}
			}
			if (element && element.is("a")) {
				return element;
			}
			return false;
		};
		var next = function(el) {
			var data = {
				style: "",
				text: "Download",
				"link": "http://"
			};
			data.style = el.getAttribute("style");
			data.link = el.getAttribute("href");
			data.text = el.getHtml();
			return data;
		};
		CKEDITOR.dialog.add("doksoft_button", function(editor) {
			var minContentHeight = 450;
			return {
				title: "doksoft_button",
				minWidth: 500,
				minHeight: minContentHeight,
				resizable: false,
				contents: [{
					id: "tab1",
					label: "Options",
					expand: true,
					padding: 0,
					elements: [{
						type: "html",
						id: "previewHtml",
						html: '<iframe src="' + editor.plugins.doksoft_button.path + "dialog/doksoft_button.html" + '" style="width: 100%; height: ' + minContentHeight + 'px" hidefocus="true" frameborder="0" ' + 'id="doksoft_button_options"></iframe>'
					}]
				}, {
					id: "tab2",
					label: "Gallery",
					elements: [{
						id: "elementId1",
						type: "html",
						html: '<iframe src="' + editor.plugins.doksoft_button.path + "dialog/doksoft_button_gallery.html" + '" style="width: 100%; height: ' + minContentHeight + 'px" hidefocus="true" frameborder="0" ' + 'id="doksoft_button_gallery"></iframe>'
					}]
				}],
				buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton],
				onShow: function() {
					window.currentDialog = this;
					var failuresLink = init();
					if (failuresLink) {
						this.parts.title.$.innerHTML = "Edit Button";
						currentData = next(failuresLink);
					} else {
						this.parts.title.$.innerHTML = "Insert Button";
						currentData = {
							style: editor.config.doksoft_default_style ? editor.config.doksoft_default_style : "-moz-box-shadow: 0px 1px 0px 0px #ffe0b5;-webkit-box-shadow: 0px 1px 0px 0px #ffe0b5;box-shadow: 0px 1px 0px 0px #ffe0b5;background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #fbb450), color-stop(1, #f89306));background:-moz-linear-gradient(top, #fbb450 5%, #f89306 100%);background:-webkit-linear-gradient(top, #fbb450 5%, #f89306 100%);background:-o-linear-gradient(top, #fbb450 5%, #f89306 100%);background:-ms-linear-gradient(top, #fbb450 5%, #f89306 100%);background:linear-gradient(to bottom, #fbb450 5%, #f89306 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#fbb450', endColorstr='#f89306',GradientType=0);background-color:#fbb450;-moz-border-radius:7px;-webkit-border-radius:7px;border-radius:7px;border:1px solid #c97e1c;display:inline-block;color:#ffffff;font-family:trebuchet ms;font-size:17px;font-weight:normal;padding:6px 11px;text-decoration:none;text-shadow:0px 1px 0px #8f7f24;",
							link: editor.config.doksoft_default_link ? editor.config.doksoft_default_link : "http://",
							text: editor.config.doksoft_default_text ? editor.config.doksoft_default_text : "Download"
						};
					}
					if (window["doksoft_restore"]) {
						window["doksoft_restore"](currentData);
					}
					var resultItems = document.getElementsByClassName("cke_dialog_tab_disabled");
					var i = resultItems.length - 1;
					for (; i >= 0; i--) {
						var result = resultItems[i];
						var regexp = new RegExp("(\\s|^)cke_dialog_tab_disabled(\\s|$)");
						result.className = result.className.replace(regexp, " ");
					}
				},
				onOk: function() {
					var rreturn = init();
					if (!rreturn) {
						editor.insertHtml(getResultButton());
					} else {
						var ret = CKEDITOR.dom.element.createFromHtml(getResultButton());
						ret.replace(rreturn);
					}
				}
			};
		});
		editor.addCommand("doksoft_button", new CKEDITOR.dialogCommand("doksoft_button"));
		editor.ui.addButton("doksoft_button", {
			title: "doksoft_button",
			command: "doksoft_button"
		});
		editor.on("contentDom", function() {});
		if (editor.addMenuItems) {
			editor.addMenuItems({
				doksoft_button: {
					label: "Edit Button",
					command: "doksoft_button",
					group: "table",
					order: 5
				}
			});
		}
		if (editor.contextMenu) {
			editor.contextMenu.addListener(function(link) {
				if (link && link.is("a")) {
					return {
						doksoft_button: CKEDITOR.TRISTATE_ON
					};
				}
			});
		}
	}
});