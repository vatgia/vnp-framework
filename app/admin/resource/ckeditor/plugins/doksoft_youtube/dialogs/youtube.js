(function() {
	function cleanup(element) {
		var value = callback(element);
		return value && value.getAttribute("src") || "";
	}

	function attachFill(object) {
		var item = callback(object);
		var style = {};
		if (item) {
			style.width = item.getAttribute("width");
			style.height = item.getAttribute("height");
		}
		return style;
	}

	function callback(node) {
		var ret = null;
		if (node && node.is) {
			if (node.is("iframe")) {
				ret = node;
			} else {
				if (node.is("cke:object")) {
					var trs = node.getChildren();
					var padLength = trs.count();
					var i;
					var d;
					i = 0;
					for (; i < padLength; i++) {
						d = trs.getItem(i);
						if (d.is("cke:embed")) {
							ret = d;
							break;
						}
					}
				}
			}
		}
		return ret;
	}
	var core_rnotwhite = /^PT(?:(\d+)M)*(\d+)S$/;
	durationToTime = function(value) {
		var octalLiteral = value.match(core_rnotwhite);
		if (!octalLiteral) {
			return "-";
		}
		var upper = parseInt(octalLiteral[1], 10);
		var lower = parseInt(octalLiteral[2], 10);
		upper = upper || 0;
		lower = lower || 0;
		value = upper * 60 + lower;
		var a = Math.floor(value / 3600);
		var x = Math.floor((value - a * 3600) / 60);
		var y = value - a * 3600 - x * 60;
		if (a < 10 && a > 0) {
			a = "0" + a;
		}
		if (x < 10) {
			x = "0" + x;
		}
		if (y < 10) {
			y = "0" + y;
		}
		var b = x + ":" + y;
		if (a) {
			b = a + ":" + b;
		}
		return b;
	};
	var c = function() {
		var el = document.createElement("input");
		var isSupported = "oninput" in el;
		if (!isSupported) {
			el.setAttribute("oninput", "return;");
			isSupported = typeof el.oninput === "function";
		}
		return isSupported;
	}();
	var render = function(editor, _) {
		this.editor = editor;
		this.dialog = _;
		this.lang = editor.lang.doksoft_youtube;
		this.path = CKEDITOR.plugins.get("doksoft_youtube").path;
		this.apiKey = this.editor.config.doksoft_youtube_apiKey || "";
		var doc = CKEDITOR.document;
		this.videos = doc.getById(editor.name + "_doksoft_youtube_videos");
		this.preview = doc.getById(editor.name + "_doksoft_youtube_preview");
		var childNodes = this.videos.getChildren();
		this.videosHint = childNodes.getItem(0);
		this.videosList = childNodes.getItem(1);
		this.preloader = childNodes.getItem(2);
		childNodes = this.preview.getChildren();
		this.previewHint = childNodes.getItem(0);
		this.previewVideo = childNodes.getItem(1);
		this.query = _.getContentElement("info", "query");
		this.searchButton = _.getContentElement("info", "btnSearch");
		this.url = _.getContentElement("info", "url");
		this.size = _.getContentElement("info", "size");
		this.width = _.getContentElement("info", "width");
		this.height = _.getContentElement("info", "height");
		this.showSuggested = _.getContentElement("info", "showSuggested");
		this.privacyMode = _.getContentElement("info", "privacyMode");
		this.useOldCode = _.getContentElement("info", "useOldCode");
		this.videos.unselectable();
		this.preview.unselectable();
		_.on("show", this._onDialogShow, this);
		_.on("hide", this._onDialogHide, this);
		this.searchButton.on("click", function() {
			this.reset();
			this.search(this.query.getValue());
		}, this);
		this.dialog.on("resize", function(child) {
			var parentHeight = child.data.height;
			this.videos.setStyle("height", parentHeight - 100 + "px");
			this.preview.setStyle("height", parentHeight - 250 + "px");
			this.videosHint.setStyle("line-height", parentHeight - 100 + "px");
			this.previewHint.setStyle("line-height", parentHeight - 250 + "px");
		}, this);
		this.maxResults = Math.min(50, Math.max(1, editor.config.doksoft_youtube_maxResults));
		this._init();
	};
	render.prototype = {
		sizes: {
			"sd": ["420x315", "480x360", "640x480", "960x720"],
			"hd": ["560x315", "640x360", "853x480", "1280x720"]
		},
		_onSelectVideo: function(evt) {
			var node = evt.data.getTarget();
			var args = node && node.getAscendant("li", true);
			if (args) {
				this.selectVideo(args);
				evt.data.preventDefault(true);
			}
		},
		_onScrollResults: function(dataAndEvents) {
			var textarea = this.videos.$;
			if (textarea.scrollTop + textarea.clientHeight * 2 > textarea.scrollHeight) {
				this.search(this._lastQuery);
			}
		},
		_onKey: function(evt) {
			var h = evt.data.getKeystroke();
			cancel = false;
			if (h == 13) {
				if (jQuery && jQuery.fn.autocomplete) {
					jQuery(this.query.getInputElement().$).autocomplete("close");
				}
				this.searchButton.click();
				cancel = true;
			}
			if (h == 27) {
				if (jQuery && (jQuery.fn.autocomplete && jQuery(this.query.getInputElement().$).autocomplete("widget").is(":visible"))) {
					cancel = true;
				}
			}
			if (cancel) {
				evt.cancel();
				evt.data.preventDefault(1);
			}
		},
		_onUrlChange: function() {
			this.reset();
			var segment = this.url.getValue();
			var elem = this.url.getInputElement();
			var b = segment.match(/^(?:(?:https?:\/\/)*(?:www\.|))*youtube.com\/watch\?.*?v=([a-zA-Z0-9_]*)(?:$|&)/i);
			var bup = b && b[1];
			elem.removeAttribute("title");
			elem.removeClass("error");
			if (bup) {
				this.search([bup]);
			} else {
				if (segment.length) {
					elem.addClass("error");
					elem.setAttribute("title", this.lang.invalidUrl);
				}
			}
		},
		_onDialogShow: function() {
			this.reset();
			this.videos.on("click", this._onSelectVideo, this);
			this.videos.on("scroll", this._onScrollResults, this);
			this.query.getInputElement().on("keydown", this._onKey, this, null, 1);
			var _this = this;
			if (c) {
				this.url.getInputElement().on("input", this._onUrlChange, this, null, 1);
			} else {
				var skip;
				this._urlInterval = window.setInterval(function() {
					var val = _this.url.getValue();
					if (val !== skip) {
						skip = val;
						_this._onUrlChange.call(_this);
					}
				}, 400);
			}
			var s = this.dialog.videoNode;
			if (s) {
				var value = cleanup(s);
				if (value) {
					var elem = document.createElement("a");
					elem.href = value;
					var segs = elem.pathname.split("/");
					if (segs.length > 2) {
						this.editor.once("doksoftYoutubeSearchCompleted", function() {
							var o = attachFill(s);
							if (o.width && (o.height && this.getSelectedVideo())) {
								var newValue = o.width + "x" + o.height;
								var element = this.size.getInputElement();
								var trs = element.getChildren();
								var padLength = trs.count();
								var i;
								var isFunction;
								i = 0;
								for (; i < padLength; i++) {
									isFunction = trs.getItem(i).getAttribute("value");
									if (isFunction == newValue) {
										element.setValue(newValue);
										return;
									} else {
										if (isFunction == "custom") {
											element.setValue("custom");
											this.width.setValue(o.width);
											this.width.getElement().show();
											this.height.setValue(o.height);
											this.height.getElement().show();
										}
									}
								}
							}
						}, this);
						this.search([segs[2]]);
					}
				}
			}
		},
		_onDialogHide: function() {
			this.videos.removeListener("click", this._onSelectVideo);
			this.videos.removeListener("scroll", this._onScrollResults);
			this.query.getInputElement().removeListener("keydown", this._onKey);
			this.url.getInputElement().removeListener("input", this._onUrlChange);
			var elem = this.url.getInputElement();
			elem.removeAttribute("title");
			elem.removeClass("error");
			window.clearInterval(this._urlInterval);
			window.clearTimeout(this._searchTimeout);
			this._searching = false;
			this.reset();
		},
		_init: function() {
			var $scope = this;
			var load = function() {
				jQuery.noConflict();
				if (!window.jQuery.fn.autocomplete) {
					CKEDITOR.document.appendStyleSheet($scope.path + "css/jquery-ui-1.10.4.autocomplete.min.css");
					CKEDITOR.document.appendStyleText(".ui-autocomplete { z-index: " + $scope.editor.config.baseFloatZIndex + 100 + " }");
					CKEDITOR.scriptLoader.load(CKEDITOR.getUrl($scope.path + "js/jquery-ui-1.10.4.autocomplete.min.js"), function(dataAndEvents) {
						if (dataAndEvents) {
							$scope._initAutocomplete();
						}
					});
				} else {
					$scope._initAutocomplete();
				}
			};
			if (!window.jQuery) {
				CKEDITOR.scriptLoader.load("//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js", function(dataAndEvents) {
					if (!dataAndEvents) {
						CKEDITOR.scriptLoader.load(CKEDITOR.getUrl($scope.path + "js/jquery-1.11.0.min.js"), function(dataAndEvents) {
							if (dataAndEvents) {
								load();
							} else {
								$scope.showMessage($scope.lang.unableLoad);
							}
						});
					} else {
						load();
					}
				});
			} else {
				load();
			}
		},
		_initAutocomplete: function() {
			var scripts = this.query.getInputElement().$;
			var c = this;
			jQuery(scripts).autocomplete({
				select: function() {
					c.searchButton.click();
				},
				source: function(search, request) {
					var appFrontendUrl = "https://suggestqueries.google.com/complete/search";
					var query = {
						client: "youtube",
						ds: "yt",
						q: search.term,
						hl: "en"
					};
					var i = this;
					jQuery.ajax({
						url: appFrontendUrl,
						dataType: "jsonp",
						data: query,
						jsonp: "jsonp",
						success: function(a) {
							var params = [];
							if (a && (a[1] && CKEDITOR.tools.isArray(a[1]))) {
								jQuery.each(a[1], function(dataAndEvents, valueHash) {
									params.push({
										"value": valueHash[0]
									});
								});
							}
							request(params);
						}
					});
				}
			});
		},
		search: function(query) {
			if (!query || this._searching) {
				return;
			}
			this.videosHint.hide();
			this.preloader.show();
			if (!window.jQuery) {
				this._searchTimeout = CKEDITOR.tools.setTimeout(this.search, 50, arguments);
				return;
			}
			var self = this;
			this._searching = true;
			var build = function() {
				self.preloader.hide();
				self._searching = false;
				var b = self.videosList.getFirst();
				var bup = b && b.getChildren().count();
				if (bup) {
					if (bup == 1) {
						var curr = self._getVideo(function() {
							return true;
						});
						if (curr) {
							self.selectVideo(curr);
						}
					}
					self.videosList.show();
				} else {
					self.videosList.hide();
					self.videosHint.show();
				}
			};
			if (typeof query == "string") {
				var params = {
					"part": "id",
					"q": query,
					"maxResults": this.maxResults,
					"key": this.apiKey
				};
				if (this._nextPageToken) {
					params.pageToken = this._nextPageToken;
				}
				this._lastQuery = query;
				jQuery.ajax({
					url: "https://www.googleapis.com/youtube/v3/search",
					dataType: "jsonp",
					data: params,
					success: function(resp) {
						if (!self._checkData(resp)) {
							build.call(self);
							return;
						}
						self._nextPageToken = resp.nextPageToken;
						var extra = [];
						var i = 0;
						for (; i < resp.items.length; i++) {
							extra.push(resp.items[i].id.videoId);
						}
						self._searching = false;
						self.search(extra);
					},
					error: function() {
						self.showMessage(self.lang.searchFailed);
						build.call(self);
					}
				});
			} else {
				if (CKEDITOR.tools.isArray(query)) {
					jQuery.ajax({
						url: "https://www.googleapis.com/youtube/v3/videos",
						dataType: "jsonp",
						data: {
							"part": "snippet,contentDetails",
							"id": query.join(","),
							"key": this.apiKey
						},
						success: function(doc) {
							self._addData(doc);
						},
						error: function() {
							self.showMessage(self.lang.searchFailed);
						},
						complete: function() {
							build.call(self);
							self.editor.fire("doksoftYoutubeSearchCompleted");
						}
					});
				}
			}
		},
		_checkData: function(info) {
			if (!info) {
				this.showMessage(this.lang.searchFailed);
				return false;
			}
			if (info.error) {
				this.showMessage(this.lang.searchFailed + ": " + (info.error.message || ""));
				return false;
			}
			if (info.pageInfo && info.pageInfo.totalResults === 0) {
				this.showMessage(this.lang.notFound);
				return false;
			}
			return true;
		},
		_addData: function(docs) {
			if (!this._checkData(docs)) {
				return;
			}
			var handles = [];
			var i;
			i = 0;
			for (; i < docs.items.length; i++) {
				var message = docs.items[i];
				var requestUrl = message.snippet.thumbnails["default"].url;
				var def = message.contentDetails.definition;
				handles.push('<li class="cke_doksoft_youtube_item" data-video-id="' + message.id + '" data-video-definition="' + def + '">');
				handles.push('<div class="cke_doksoft_youtube_thumb"><img src="' + requestUrl + '" style="width:120px; height:90px;" alt=""></div>');
				handles.push('<div class="cke_doksoft_youtube_info">');
				handles.push('<div class="cke_doksoft_youtube_title">' + CKEDITOR.tools.htmlEncode(message.snippet.title) + "</div>");
				handles.push('<div class="cke_doksoft_youtube_duration">' + durationToTime(message.contentDetails.duration) + "</div>");
				handles.push("</div>");
				handles.push("</li>");
			}
			if (handles.length) {
				var li = this.videosList.getFirst();
				if (!li) {
					li = CKEDITOR.document.createElement("ul");
					this.videosList.append(li);
				}
				li.appendHtml(handles.join(""));
			}
		},
		getSelectedVideo: function() {
			var _getVideo = this._getVideo(function(c) {
				return c.hasClass("selected");
			});
			return _getVideo;
		},
		_getVideo: function(value) {
			if (value && typeof value == "function") {
				var link = this.videosList.getFirst();
				if (link && link.is("ul")) {
					var trs = link.getChildren();
					var padLength = trs.count();
					var i;
					var j;
					i = 0;
					for (; i < padLength; i++) {
						j = trs.getItem(i);
						if (value.call(this, j)) {
							return j;
						}
					}
				}
			}
			return null;
		},
		selectVideo: function(item) {
			var node = this.getSelectedVideo();
			if (!item || node && node.equals(item)) {
				return;
			}
			if (node) {
				node.removeClass("selected");
			}
			item.addClass("selected");
			this.previewHint.hide();
			this.previewVideo.setHtml('<iframe src="//www.youtube.com/embed/' + item.data("video-id") + '?rel=0" frameborder="0"></iframe>');
			this.previewVideo.show();
			this.size.clear();
			var codeSegments = item.data("video-definition") == "hd" ? this.sizes.hd : this.sizes.sd;
			var i = 0;
			for (; i < codeSegments.length; i++) {
				this.size.add(codeSegments[i], codeSegments[i]);
			}
			this.size.add(this.lang.custom, "custom");
			this.size.enable();
			this.showSuggested.enable();
			this.privacyMode.enable();
			this.useOldCode.enable();
		},
		reset: function() {
			this.size.clear().disable();
			this.width.getElement().hide();
			this.height.getElement().hide();
			this.showSuggested.disable();
			this.privacyMode.disable();
			this.useOldCode.disable();
			this.videosList.hide();
			this.videosList.setHtml("");
			this.preloader.hide();
			this.videosHint.show();
			this.previewVideo.hide();
			this.previewVideo.setHtml("");
			this.previewHint.show();
			this._nextPageToken = null;
			this._lastQuery = null;
		},
		showMessage: function(message) {
			alert(message);
		}
	};
	CKEDITOR.dialog.add("doksoft_youtube", function(editor) {
		var $scope = editor.lang.doksoft_youtube;
		var langCommon = editor.lang.common;
		var p = CKEDITOR.plugins.get("doksoft_youtube").path;
		var currentPaste = null;
		return {
			title: $scope.title,
			minWidth: 650,
			minHeight: 450,
			onLoad: function() {
				currentPaste = new render(editor, this);
			},
			onShow: function() {
				this.fakeImage = this.videoNode = null;
				var fakeImage = this.getSelectedElement();
				if (fakeImage && (fakeImage.data("cke-real-element-type") && fakeImage.data("cke-real-element-type") == "doksoft_youtube")) {
					this.fakeImage = fakeImage;
					var iframeNode = editor.restoreRealElement(fakeImage);
					this.videoNode = iframeNode;
					this.setupContent(iframeNode);
				}
			},
			onOk: function() {
				var browserEvent = currentPaste.getSelectedVideo();
				if (!browserEvent) {
					return;
				}
				var invert = this.getContentElement("info", "useOldCode").getValue();
				var element = new CKEDITOR.dom.element(invert ? "cke:object" : "iframe", editor.document);
				var m = this.getContentElement("info", "showSuggested").getValue();
				var charset = this.getContentElement("info", "privacyMode").getValue();
				var y = browserEvent.data("video-id");
				var pos = "//www.youtube" + (charset ? "-nocookie" : "") + ".com/" + (invert ? "v" : "embed") + "/" + y;
				if (invert) {
					pos += "?hl=en_US&version=3";
				}
				if (!m) {
					pos += (invert ? "&" : "?") + "rel=0";
				}
				var extraStyles = {};
				var extraAttributes = {};
				if (!invert) {
					element.setAttribute("frameborder", "0");
					element.setAttribute("allowfullscreen", "allowfullscreen");
					element.setAttribute("src", pos);
				} else {
					var frame = new CKEDITOR.dom.element("cke:param", editor.document);
					frame.setAttribute("name", "movie");
					frame.setAttribute("value", pos);
					element.append(frame);
					frame = new CKEDITOR.dom.element("cke:param", editor.document);
					frame.setAttribute("name", "allowFullScreen");
					frame.setAttribute("value", "true");
					element.append(frame);
					frame = new CKEDITOR.dom.element("cke:param", editor.document);
					frame.setAttribute("name", "allowscriptaccess");
					frame.setAttribute("value", "always");
					element.append(frame);
					frame = new CKEDITOR.dom.element("cke:embed", editor.document);
					frame.setAttribute("src", pos);
					frame.setAttribute("type", "application/x-shockwave-flash");
					frame.setAttribute("allowscriptaccess", "always");
					frame.setAttribute("allowfullscreen", "true");
					element.append(frame);
				}
				this.commitContent(element, extraStyles, extraAttributes);
				var newFakeImage = editor.createFakeElement(element, "cke_doksoft_youtube", "doksoft_youtube", element.is("iframe"));
				newFakeImage.setAttributes(extraAttributes);
				newFakeImage.setStyles(extraStyles);
				if (this.fakeImage) {
					newFakeImage.replace(this.fakeImage);
					editor.getSelection().selectElement(newFakeImage);
				} else {
					editor.insertElement(newFakeImage);
				}
			},
			contents: [{
				id: "info",
				label: langCommon.generalTab,
				padding: 0,
				accessKey: "I",
				elements: [{
					type: "hbox",
					widths: ["99%", "1%"],
					children: [{
						id: "query",
						type: "text",
						inputStyle: "padding: 3px 6px;margin-bottom:15px",
						isChanged: false
					}, {
						id: "btnSearch",
						type: "button",
						label: $scope.search,
						isChanged: false
					}]
				}, {
					id: "url",
					type: "text",
					label: $scope.typeUrl,
					inputStyle: "padding: 3px 6px;margin-top:5px;margin-bottom:10px",
					isChanged: false
				}, {
					type: "hbox",
					widths: ["50%", "50%"],
					style: "table-layout: fixed",
					children: [{
						id: "videos",
						type: "html",
						html: '<div class="cke_doksoft_youtube_videos" id="' + editor.name + '_doksoft_youtube_videos">' + '<div class="cke_doksoft_youtube_videos__hint">' + $scope.catalogHint + "</div>" + '<div class="cke_doksoft_youtube_videos__list"></div>' + '<div class="cke_doksoft_youtube_videos__preloader"></div>' + "</div>"
					}, {
						type: "vbox",
						children: [{
							id: "preview",
							type: "html",
							html: '<div class="cke_doksoft_youtube_preview" id="' + editor.name + '_doksoft_youtube_preview">' + '<div class="cke_doksoft_youtube_preview__hint">' + $scope.previewHint + "</div>" + '<div class="cke_doksoft_youtube_preview__video"></div>' + "</div>"
						}, {
							type: "vbox",
							className: editor.name + "_doksoft_youtube_video_options",
							children: [{
								id: "size",
								type: "select",
								"default": "",
								items: [],
								labelLayout: "horizontal",
								widths: ["1%", "99%"],
								inputStyle: "min-width: 100px;",
								labelStyle: "margin-right: 5px;",
								label: $scope.size,
								isChanged: false,
								commit: function(doc, os, html) {
									var value = this.getValue();
									var _ref1 = [];
									var w;
									var h;
									if (value == "custom") {
										_ref1 = [this.getDialog().getContentElement("info", "width").getValue(), this.getDialog().getContentElement("info", "height").getValue()];
										if (!_ref1[0] || !_ref1[1]) {
											_ref1 = this.getInputElement().getFirst().getAttribute("value").split("x");
										}
									} else {
										_ref1 = this.getValue().split("x");
									}
									if (_ref1.length == 2) {
										w = _ref1[0];
										h = _ref1[1];
										os.width = w + "px";
										os.height = h + "px";
										var cn = callback(doc);
										if (cn) {
											cn.setAttribute("width", w);
											cn.setAttribute("height", h);
										}
									}
								},
								onChange: function() {
									var element = this.getDialog().getContentElement("info", "width");
									var container = this.getDialog().getContentElement("info", "height");
									var state = this.getValue() == "custom";
									element.setValue("");
									container.setValue("");
									element.getElement()[state ? "show" : "hide"]();
									container.getElement()[state ? "show" : "hide"]();
									if (state) {
										element.focus();
									}
								}
							}, {
								type: "hbox",
								widths: ["50%", "50%"],
								children: [{
									id: "width",
									type: "text",
									label: $scope.width,
									labelLayout: "horizontal",
									labelStyle: "margin-right: 5px;",
									widths: ["1%", "99%"],
									hidden: true,
									isChanged: false,
									onKeyup: function() {
										var value = this.getValue();
										var pkgfile = this.getDialog().getContentElement("info", "size").getInputElement().getFirst().getAttribute("value").split("x");
										var precision = pkgfile[1] / pkgfile[0];
										this.getDialog().getContentElement("info", "height").setValue(Math.round(value * precision));
									}
								}, {
									id: "height",
									type: "text",
									label: $scope.height,
									labelLayout: "horizontal",
									labelStyle: "margin-right: 5px;",
									widths: ["1%", "99%"],
									hidden: true,
									isChanged: false,
									onKeyup: function() {
										var value = this.getValue();
										var pkgfile = this.getDialog().getContentElement("info", "size").getInputElement().getFirst().getAttribute("value").split("x");
										var precision = pkgfile[0] / pkgfile[1];
										this.getDialog().getContentElement("info", "width").setValue(Math.round(value * precision));
									}
								}]
							}, {
								id: "showSuggested",
								type: "checkbox",
								"default": editor.config.doksoft_youtube_showSuggested,
								labelLayout: "horizontal",
								label: $scope.showSuggested,
								labelStyle: "vertical-align: bottom;",
								inputStyle: "vertical-align: bottom;",
								isChanged: false,
								setup: function(element, opt_attributes) {
									var classes = cleanup(element);
									if (classes.indexOf("rel=0") > 0) {
										this.setValue(false);
									}
								}
							}, {
								id: "privacyMode",
								type: "checkbox",
								"default": editor.config.doksoft_youtube_enablePrivacyMode,
								labelLayout: "horizontal",
								label: $scope.privacyMode,
								labelStyle: "vertical-align: bottom;",
								inputStyle: "vertical-align: bottom;",
								isChanged: false,
								setup: function(element, opt_attributes) {
									var classes = cleanup(element);
									if (classes.indexOf("-nocookie") > 0) {
										this.setValue(true);
									}
								}
							}, {
								id: "useOldCode",
								type: "checkbox",
								"default": editor.config.doksoft_youtube_useOldCode,
								labelLayout: "horizontal",
								label: $scope.oldEmbedCode,
								labelStyle: "vertical-align: bottom;",
								inputStyle: "vertical-align: bottom;",
								isChanged: false,
								setup: function(element, opt_attributes) {
									if (element.is("cke:object")) {
										this.setValue(true);
									}
								}
							}]
						}]
					}]
				}, {
					type: "html",
					html: '<style type="text/css">' + ".cke_doksoft_youtube_video_options td {" + "\tvertical-align: middle;" + "}" + ".cke_doksoft_youtube_videos {" + "\twidth: 100%;" + "\theight: 350px;" + "\tmargin-top: 10px;" + "\tborder: 1px solid #aeb3b9;" + "\toverflow-x: hidden;" + "\toverflow-y: auto;" + "}" + ".cke_doksoft_youtube_videos__hint {" + "\tline-height: 350px;" + "}" + ".cke_doksoft_youtube_videos__list ul {" + "\tmargin: 0;" + "\tpadding: 0;" + "\tlist-style: none;" + "}" + ".cke_doksoft_youtube_preview {" + "\twidth: 100%;" + "\theight: 200px;" + "\tmargin-top: 5px;" + "\tborder: 1px solid #aeb3b9;" + "}" + ".cke_doksoft_youtube_preview__video," + ".cke_doksoft_youtube_preview__video iframe {" + "\twidth: 100%;" + "\theight: 100%;" + "}" + ".cke_doksoft_youtube_preview__hint {" + "\tline-height: 200px;" + "}" + ".cke_doksoft_youtube_videos__hint," + ".cke_doksoft_youtube_preview__hint {" + "\ttext-align: center;" + "\tcursor: default;" + "}" + ".cke_doksoft_youtube_videos__preloader {" + "\twidth: 100%;" + "\theight: 32px;" + "\tmargin: 10px 0;" + "\tbackground: transparent url(" + p + "images/preloader.gif) scroll no-repeat center 0;" + "}" + ".cke_doksoft_youtube_item {" + "\tmargin: 2px;" + "\tpadding: 2px;" + "\theight: 90px;" + "\tclear: both;" + "\toverflow: hidden;" + "\tborder: 1px solid #c9cccf;" + "}" + ".cke_doksoft_youtube_item.selected," + ".cke_doksoft_youtube_item:hover {" + "\tborder: 1px solid #139ff7;" + "\tbackground-color: #cce7f3;" + "}" + ".cke_doksoft_youtube_item, .cke_doksoft_youtube_item * {" + "\tcursor: pointer;" + "}" + ".cke_doksoft_youtube_thumb {" + "\tfloat: left;" + "\tmargin-right: 2px;" + "\twidth: 120px;" + "\theight: 90px;" + "}" + ".cke_doksoft_youtube_info {" + "}" + ".cke_doksoft_youtube_title {" + "\tfont-size: 120%;" + "\tfont-weight: bold;" + "\twhite-space: normal;" + "}" + ".cke_dialog_ui_input_text.error," + ".cke_dialog_ui_input_text.error:focus," + ".cke_dialog_ui_input_text.error:hover {" + "\tborder: 1px solid #f00;" + "}" + "</style>"
				}]
			}]
		};
	});
})();
CKEDITOR.config.doksoft_youtube_maxResults = 25;
CKEDITOR.config.doksoft_youtube_showSuggested = true;
CKEDITOR.config.doksoft_youtube_enablePrivacyMode = false;
CKEDITOR.config.doksoft_youtube_useOldCode = false;