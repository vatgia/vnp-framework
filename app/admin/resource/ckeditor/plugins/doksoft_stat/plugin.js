CKEDITOR.plugins.add("doksoft_stat", {
	lang: "en,vi,ru,fr",
	init: function(editor) {
		function update() {
			var sel = "";
			if (editor.mode == "wysiwyg") {
				var s = editor.getSelection();
				sel = s && (s.getType() == CKEDITOR.SELECTION_TEXT && s.getSelectedText() !== null) ? get(s.getSelectedText(), "nospace") : "";
			} else {
				if (!window["codemirror_" + editor.id]) {
					sel = getSelection();
				} else {
					sel = window["codemirror_" + editor.id].getSelection();
				}
			}
			if (document.getElementById("cke_doksoft_stat_select_" + editor.name)) {
				document.getElementById("cke_doksoft_stat_select_" + editor.name).innerHTML = editor.lang.doksoft_stat.sel + ":" + sel.replace(/[\s\n\r]/g, "").length;
			}
		}
		var trim = function(text) {
			return text.replace(/^[\s]+([^\s])/g, "$1").replace(/([^\s])[\s]+$/g, "$1");
		};
		var highlight = function(value) {
			value = value.replace(/(\r\n|\n|\r)/gm, " ").replace(/&nbsp;/g, " ");
			return trim(get(value)).split(/\s+/).length;
		};
		var getSelection = function() {
			var o = editor.textarea.$;
			if (document.selection) {
				var bookmark = document.selection.createRange().getBookmark();
				var range = o.createTextRange();
				range.moveToBookmark(bookmark);
				var testRange = o.createTextRange();
				testRange.collapse(true);
				testRange.setEndPoint("EndToStart", range);
				o.selectionStart = testRange.text.length;
				o.selectionEnd = testRange.text.length + range.text.length;
				o.selectedText = range.text;
			} else {
				if (o.selectionStart) {
					o.selectedText = o.value.substring(o.selectionStart, o.selectionEnd);
				}
			}
			return o.selectedText;
		};
		var init = function() {
			var offset = 0;
			var endPos = 0;
			var val = "";
			if (editor.mode != "source") {
				return "";
			}
			if (typeof editor.textarea.$.selectionStart != "undefined") {
				offset = editor.textarea.$.selectionStart;
				endPos = editor.textarea.$.selectionEnd;
			} else {
				if (window.getSelection) {
					val = window.getSelection();
				} else {
					if (document.getSelection) {
						val = document.getSelection();
					} else {
						if (document.selection) {
							val = document.selection.createRange().text;
						}
					}
				}
				if (val) {
					offset = editor.textarea.$.indexOf(val);
					if (offset != 0) {
						endPos = editor.textarea.$.indexOf(val) + val.length;
					}
				}
			}
			return editor.textarea.$.value.substring(offset, endPos);
		};
		var get = function(url, opt_default) {
			var p = "";
			var prop = [];
			url += "";
			prop = url.match(/(<\/?[\S][^>]*>|&[a-z]+;)/gi);
			for (p in prop) {
				if (isNaN(p)) {
					continue;
				}
				url = url.split(prop[p].toString()).join(" ");
			}
			if (opt_default == "nospace") {
				return trim(url.replace(/[\s]/gi, ""));
			} else {
				return url;
			}
		};
		var tref = 0;
		var render = function() {
			clearTimeout(tref);
			tref = setTimeout(function() {
				var content = editor.getData() + "";
				if (document.getElementById("cke_doksoft_stat_word_number_" + editor.name)) {
					document.getElementById("cke_doksoft_stat_word_number_" + editor.name).innerHTML = editor.lang.doksoft_stat.words + ":" + highlight(content);
				}
				if (document.getElementById("cke_doksoft_stat_" + editor.name)) {
					document.getElementById("cke_doksoft_stat_" + editor.name).innerHTML = editor.lang.doksoft_stat.strlen + ":" + get(content).length;
				}
				if (document.getElementById("cke_doksoft_stat_source_" + editor.name)) {
					document.getElementById("cke_doksoft_stat_source_" + editor.name).innerHTML = editor.lang.doksoft_stat.source + ":" + content.length;
				}
			}, 100);
		};
		editor.on("instanceReady", function(dataAndEvents) {
			var map = ["doksoft_stat", "doksoft_stat_select", "doksoft_stat_source", "doksoft_stat_without_space", "doksoft_stat_word_number"];
			var style = "float:left; line-height:23px; margin-left:10px;";
			var letter;
			for (letter in map) {
				var parent = document.createElement("div");
				parent.setAttribute("id", "cke_" + map[letter] + "_" + editor.name);
				parent.setAttribute("style", style);
				CKEDITOR.document.getById(editor.ui.spaceId("bottom")).append(new CKEDITOR.dom.node(parent));
			}
			window.onmousemove = function(e) {
				if (a) {
					hide();
				}
			};
			window.onmouseup = function(evt) {
				a = false;
			};
			render();
		});
		var debounceChange = 0;
		var hide = function() {
			clearTimeout(debounceChange);
			debounceChange = setTimeout(update, 100);
		};
		var onKeyDown = function(evt) {
			if (evt.data.$.shiftKey) {
				var code = evt.data.$.keyCode;
				if (code >= 33 && code <= 40) {
					hide();
				}
			}
		};
		var a = false;
		editor.on("mode", function(dataAndEvents) {
			if (editor.mode != "source") {
				return;
			}
			editor.textarea.on("keyup", onKeyDown);
			editor.textarea.on("mousedown", function(dataAndEvents) {
				a = true;
			});
		});
		editor.on("contentDom", function(dataAndEvents) {
			this.getCommand("cut").on("state", hide);
			editor.document.on("keyup", onKeyDown);
			editor.document.on("mousedown", function(dataAndEvents) {
				a = true;
			});
			editor.document.on("mouseup", function(dataAndEvents) {
				a = false;
			});
		});
		editor.on("selectionChange", hide);
		editor.on("key", render);
		editor.on("afterCommandExec", render);
		editor.on("dialogHide", render);
	}
});