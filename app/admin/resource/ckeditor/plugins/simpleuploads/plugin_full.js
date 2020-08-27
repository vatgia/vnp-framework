(function() {
    function ready(result) {
        result = result.data;
        if (/\.bmp$/.test(result.name)) {
            var data = result.image;
            var canvas = document.createElement("canvas");
            canvas.width = data.width;
            canvas.height = data.height;
            canvas.getContext("2d").drawImage(data, 0, 0);
            result.file = canvas.toDataURL("image/png");
            result.name = result.name.replace(/\.bmp$/, ".png");
        }
    }

    function handler(item) {
        var inst = item.editor;
        var dimensions = inst.config.simpleuploads_maximumDimensions;
        var image = item.data.image;
        if (dimensions.width && image.width > dimensions.width) {
            alert(inst.lang.simpleuploads.imageTooWide);
            item.cancel();
        } else {
            if (dimensions.height && image.height > dimensions.height) {
                alert(inst.lang.simpleuploads.imageTooTall);
                item.cancel();
            }
        }
    }

    function extend(a) {
        var b = "span.SimpleUploadsTmpWrapper>span { top: 50%; margin-top: -0.5em; width: 100%; text-align: center; color: #fff; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); font-size: 50px; font-family: Calibri,Arial,Sans-serif; pointer-events: none; position: absolute; display: inline-block;}";
        if (a.simpleuploads_hideImageProgress) {
            b = "span.SimpleUploadsTmpWrapper { color:#333; background-color:#fff; padding:4px; border:1px solid #EEE;}";
        }
        return ".SimpleUploadsOverEditor { " + (a.simpleuploads_editorover || "box-shadow: 0 0 10px 1px #999999 inset !important;") + " }a.SimpleUploadsTmpWrapper { color:#333; background-color:#fff; padding:4px; border:1px solid #EEE;}.SimpleUploadsTmpWrapper { display: inline-block; position: relative; pointer-events: none;}" + b + ".uploadRect {display: inline-block;height: 0.9em;vertical-align: middle;width: 20px;}.uploadRect span {background-color: #999;display: inline-block;height: 100%;vertical-align: top;}.SimpleUploadsTmpWrapper .uploadCancel { background-color: #333333;border-radius: 0.5em;color: #FFFFFF;cursor: pointer !important;display: inline-block;height: 1em;line-height: 0.8em;margin-left: 4px;padding-left: 0.18em;pointer-events: auto;position: relative; text-decoration:none; top: -2px;width: 0.7em;}.SimpleUploadsTmpWrapper span uploadCancel { width:1em; padding-left:0}";
    }

    function update(val, callback, context, value) {
        if (last) {
            alert("Please, wait to finish the current upload");
        } else {
            e$$0 = !callback;
            editor = val;
            if (typeof FormData == "undefined") {
                var iframe = document.getElementById("simpleUploadsTarget");
                if (!iframe) {
                    iframe = document.createElement("iframe");
                    iframe.style.display = "none";
                    iframe.id = "simpleUploadsTarget";
                    document.body.appendChild(iframe);
                }
                newContext = context;
                options$$0 = value;
                triggerCallback = callback;
                context = val._.simpleuploadsFormUploadFn;
                value = val._.simpleuploadsFormInitFn;
                if (!context) {
                    val._.simpleuploadsFormUploadFn = context = CKEDITOR.tools.addFunction(load, val);
                    val._.simpleuploadsFormInitFn = value = CKEDITOR.tools.addFunction(function() {
                        window.setTimeout(function() {
                            var f = document.getElementById("simpleUploadsTarget").contentWindow.document.getElementById("upload");
                            f.onchange = function() {
                                var data = {
                                    name: this.value,
                                    url: this.form.action,
                                    context: newContext,
                                    id: "IEUpload",
                                    requiresImage: triggerCallback
                                };
                                var d = data.name.match(/\\([^\\]*)$/);
                                if (d) {
                                    data.name = d[1];
                                }
                                if (typeof editor.fire("simpleuploads.startUpload", data) != "boolean") {
                                    if (data.requiresImage && !CKEDITOR.plugins.simpleuploads.isImageExtension(editor, data.name)) {
                                        alert(editor.lang.simpleuploads.nonImageExtension);
                                    } else {
                                        if (options$$0) {
                                            if (options$$0.start) {
                                                options$$0.start(data);
                                            }
                                        }
                                        last = this.value;
                                        this.form.action = data.url;
                                        if (data.extraFields) {
                                            data = data.extraFields;
                                            d = this.ownerDocument;
                                            var name;
                                            for (name in data) {
                                                if (data.hasOwnProperty(name)) {
                                                    var input = d.createElement("input");
                                                    input.type = "hidden";
                                                    input.name = name;
                                                    input.value = data[name];
                                                    this.form.appendChild(input);
                                                }
                                            }
                                        }
                                        this.form.submit();
                                    }
                                }
                            };
                            f.click();
                        }, 100);
                    }, val);
                    val.on("destroy", function() {
                        CKEDITOR.tools.removeFunction(this._.simpleuploadsFormUploadFn);
                        CKEDITOR.tools.removeFunction(this._.simpleuploadsFormInitFn);
                    });
                }
                val = 'document.open(); document.write("' + ("<form method='post' enctype='multipart/form-data' action='" + fn(val, context, callback) + "'><input type='file' name='upload' id='upload'></form>") + '");document.close();window.parent.CKEDITOR.tools.callFunction(' + value + ");";
                iframe.src = "javascript:void(function(){" + encodeURIComponent(val) + "}())";
                iframe.onreadystatechange = function() {
                    if (iframe.readyState == "complete") {
                        window.setTimeout(function() {
                            if (last) {
                                alert("The file upload has failed");
                                last = null;
                            }
                        }, 100);
                    }
                };
                el$$0 = null;
            } else {
                callback = {
                    context: context,
                    callback: value,
                    requiresImage: callback
                };
                if (!el$$0) {
                    el$$0 = document.createElement("input");
                    el$$0.type = "file";
                    el$$0.style.overflow = "hidden";
                    el$$0.style.width = "1px";
                    el$$0.style.height = "1px";
                    el$$0.style.opacity = 0.1;
                    el$$0.multiple = "multiple";
                    el$$0.position = "absolute";
                    el$$0.zIndex = 1E3;
                    document.body.appendChild(el$$0);
                    el$$0.addEventListener("change", function() {
                        var j = el$$0.files.length;
                        if (j) {
                            editor.fire("saveSnapshot");
                            var i = 0;
                            for (; i < j; i++) {
                                var response = el$$0.files[i];
                                var that = CKEDITOR.tools.extend({}, el$$0.simpleUploadData);
                                that.file = response;
                                that.name = response.name;
                                that.id = CKEDITOR.plugins.simpleuploads.getTimeStampId();
                                that.forceLink = e$$0;
                                that.mode = {
                                    type: "selectedFile",
                                    i: i,
                                    count: j
                                };
                                CKEDITOR.plugins.simpleuploads.insertSelectedFile(editor, that);
                            }
                        }
                    });
                }
                el$$0.value = "";
                el$$0.simpleUploadData = callback;
                if (CKEDITOR.env.webkit) {
                    var focusManager = val.focusManager;
                    if (focusManager && focusManager.lock) {
                        focusManager.lock();
                        setTimeout(function() {
                            focusManager.unlock();
                        }, 500);
                    }
                }
                el$$0.click();
            }
        }
    }

    function fn(editor, level, b) {
        b = b ? editor.config.filebrowserImageUploadUrl : editor.config.filebrowserUploadUrl;
        if (b == "base64") {
            return b;
        }
        var params = {};
        params.CKEditor = editor.name;
        params.CKEditorFuncNum = level;
        params.langCode = editor.langCode;
        return require(b, params);
    }

    function load(key, file) {
        if (typeof file == "string") {
            if (file && !key) {
                alert(file);
            }
        }
        var element = editor;
        element.fire("simpleuploads.endUpload", {
            name: last,
            ok: !!key
        });
        if (options$$0) {
            options$$0.upload(key, file, {
                context: newContext
            });
            options$$0 = last = null;
        } else {
            if (key) {
                var self;
                var p;
                if (e$$0) {
                    self = new CKEDITOR.dom.element("a", element.document);
                    self.setText(key.match(/\/([^\/]+)$/)[1]);
                    p = "href";
                } else {
                    self = new CKEDITOR.dom.element("img", element.document);
                    p = "src";
                    self.on("load", function(e) {
                        e.removeListener();
                        self.removeListener("error", name$$0);
                        self.setAttribute("width", self.$.width);
                        self.setAttribute("height", self.$.height);
                        element.fire("simpleuploads.finishedUpload", {
                            name: last,
                            element: self
                        });
                    });
                    self.on("error", name$$0, null, self);
                }
                self.setAttribute(p, key);
                self.data("cke-saved-" + p, key);
                element.insertElement(self);
                if (e$$0) {
                    editor.fire("simpleuploads.finishedUpload", {
                        name: last,
                        element: self
                    });
                }
            }
            last = null;
        }
        newContext = null;
    }

    function require(parent, arg) {
        var tagNameArr = [];
        if (arg) {
            var p;
            for (p in arg) {
                tagNameArr.push(p + "=" + encodeURIComponent(arg[p]));
            }
        } else {
            return parent;
        }
        return parent + (parent.indexOf("?") != -1 ? "&" : "?") + tagNameArr.join("&");
    }

    function next(event) {
        event = event.data.$.dataTransfer;
        return !event || !event.types ? false : event.types.contains && (event.types.contains("Files") && !event.types.contains("text/html")) || event.types.indexOf && event.types.indexOf("Files") != -1 ? true : false;
    }

    function init(key, config, editor, element, property) {
        if (element.$.nodeName.toLowerCase() == "span") {
            var node;
            if (config.originalNode) {
                node = config.originalNode.cloneNode(true);
                node.removeAttribute("width");
                node.removeAttribute("height");
                node.style.width = "";
                node.style.height = "";
                node = new CKEDITOR.dom.element(node);
            } else {
                node = new CKEDITOR.dom.element("img", editor.document);
            }
            node.data("cke-saved-src", key);
            node.setAttribute("src", key);
            node.on("load", function(e) {
                e.removeListener();
                node.removeListener("error", name$$0);
                initialize(node, editor, element, config.name);
            });
            node.on("error", name$$0, null, element);
            element.data("cke-real-element-type", "img");
            element.data("cke-realelement", encodeURIComponent(node.getOuterHtml()));
            element.data("cke-real-node-type", CKEDITOR.NODE_ELEMENT);
        } else {
            if (config.originalNode) {
                var newTag = config.originalNode.cloneNode(true);
                element.$.parentNode.replaceChild(newTag, element.$);
                element = new CKEDITOR.dom.element(newTag);
            } else {
                element.removeAttribute("id");
                element.removeAttribute("class");
                element.removeAttribute("contentEditable");
                element.setHtml(element.getFirst().getHtml());
            }
            element.data("cke-saved-" + property, key);
            element.setAttribute(property, key);
            editor.fire("simpleuploads.finishedUpload", {
                name: config.name,
                element: element
            });
        }
    }

    function name$$0(e) {
        e.removeListener();
        alert("Failed to load the image with the provided URL: '" + e.sender.data("cke-saved-src") + "'");
        e.listenerData.remove();
    }

    function initialize(context, editor, expression, description) {
        if (context.$.naturalWidth === 0) {
            window.setTimeout(function() {
                initialize(context, editor, expression, description);
            }, 50);
        } else {
            context.replace(expression);
            context.setAttribute("width", context.$.width);
            context.setAttribute("height", context.$.height);
            editor.fire("simpleuploads.finishedUpload", {
                name: description,
                element: context
            });
            editor.fire("updateSnapshot");
        }
    }

    function send(editor, data) {
        var _ref = CKEDITOR.plugins.simpleuploads.isImageExtension(editor, data.name);
        var node = "href";
        var oldconfig = false;
        if (!data.forceLink && _ref) {
            node = "src";
            oldconfig = true;
        }
        if (data.callback) {
            data.callback.setup(data);
        }
        if (!data.url) {
            data.url = fn(editor, 2, oldconfig);
        }
        if (data.requiresImage && !_ref) {
            alert(editor.lang.simpleuploads.nonImageExtension);
            return null;
        }
        if (typeof editor.fire("simpleuploads.startUpload", data) == "boolean") {
            return null;
        }
        if (data.url == "base64") {
            if (typeof data.file == "string") {
                setTimeout(function() {
                    init(fileUrl, data, editor, el$$0, node);
                }, 100);
            } else {
                var reader = new FileReader;
                reader.onload = function() {
                    var camelKey = reader.result;
                    var activeClassName = editor.document.getById(data.id);
                    setTimeout(function() {
                        init(camelKey, data, editor, activeClassName, node);
                    }, 100);
                };
                reader.readAsDataURL(data.file);
            }
            return {};
        }
        var xhr = new XMLHttpRequest;
        if (_ref = xhr.upload) {
            _ref.onprogress = function(e) {
                f(editor, data.id, e);
            };
        }
        data.xhr = xhr;
        xhr.open("POST", data.url);
        xhr.onload = function() {
            var arr = xhr.responseText.match(/\((?:"|')?\d+(?:"|')?,\s*("|')(.*?[^\\]?)\1(?:,\s*(.*?))?\s*\)\s*;?/);
            var length = arr && arr[2];
            var content = arr && arr[3];
            var i = data.id;
            var d = editor.document.getById(i);
            if (content) {
                var expr = content.match(/function\(\)\s*\{(.*)\}/);
                if (expr) {
                    content = new Function(expr[1]);
                } else {
                    expr = content.substring(0, 1);
                    if (expr == "'" || expr == '"') {
                        content = content.substring(1, content.length - 1);
                    }
                }
            }
            f(editor, i, null);
            editor.fire("updateSnapshot");
            editor.fire("simpleuploads.endUpload", {
                name: data.name,
                ok: !!length,
                xhr: xhr,
                data: data
            });
            if (xhr.status != 200) {
                if (xhr.status == 413) {
                    alert(editor.lang.simpleuploads.fileTooBig);
                } else {
                    alert("Error posting the file to " + data.url + "\r\nResponse status: " + xhr.status);
                }
                if (window.console) {
                    console.log(xhr);
                }
            } else {
                if (length) {
                    length = length.replace(/\\'/g, "'");
                    try {
                        var object = JSON.parse('{"url":"' + length + '"}');
                        if (object && object.url) {
                            length = object.url;
                        }
                    } catch (m) {}
                }
                if (!arr) {
                    content = "Error posting the file to " + data.url + "\r\nInvalid data returned (check console)";
                    if (window.console) {
                        console.log(xhr.responseText);
                    }
                }
            }
            if (data.callback) {
                if (!length) {
                    if (content) {
                        alert(content);
                    }
                }
                data.callback.upload(length, content, data);
            } else {
                if (d) {
                    if (length) {
                        init(length, data, editor, d, node);
                    } else {
                        if (data.originalNode) {
                            d.$.parentNode.replaceChild(data.originalNode, d.$);
                        } else {
                            d.remove();
                        }
                        if (content) {
                            alert(content);
                        }
                    }
                    editor.fire("updateSnapshot");
                }
            }
        };
        xhr.onerror = function(e) {
            alert("Error posting the file to " + data.url);
            if (window.console) {
                console.log(e);
            }
            if (e = editor.document.getById(data.id)) {
                if (data.originalNode) {
                    e.$.parentNode.replaceChild(data.originalNode, e.$);
                } else {
                    e.remove();
                }
            }
            editor.fire("updateSnapshot");
        };
        xhr.onabort = function() {
            if (data.callback) {
                data.callback.upload(null);
            } else {
                var d = editor.document.getById(data.id);
                if (d) {
                    if (data.originalNode) {
                        d.$.parentNode.replaceChild(data.originalNode, d.$);
                    } else {
                        d.remove();
                    }
                }
                editor.fire("updateSnapshot");
            }
        };
        xhr.withCredentials = true;
        return xhr;
    }

    function callback$$0(editor, options) {
        if (!options.callback) {
            var el = CKEDITOR.plugins.simpleuploads.isImageExtension(editor, options.name);
            var files = !editor.config.simpleuploads_hideImageProgress;
            if (!options.forceLink && (el && files)) {
                el = render(options.file, options.id, editor);
            } else {
                el = el && !options.forceLink ? new CKEDITOR.dom.element("span", editor.document) : new CKEDITOR.dom.element("a", editor.document);
                el.setAttribute("id", options.id);
                el.setAttribute("class", "SimpleUploadsTmpWrapper");
                el.setHtml("<span class='uploadName'>" + options.name + "</span> <span class='uploadRect'><span id='rect" + options.id + "'></span></span> <span id='text" + options.id + "' class='uploadText'> </span><span class='uploadCancel'>x</span>");
            }
            el.setAttribute("contentEditable", false);
            options.element = el;
        }
        el = send(editor, options);
        if (!el) {
            options.result = options.result || "";
            return false;
        }
        if (!el.send) {
            return true;
        }
        if (options.callback) {
            if (options.callback.start) {
                options.callback.start(options);
            }
        }
        if (typeof options.file == "string") {
            var i = "-----------------------------1966284435497298061834782736";
            var j = options.name.match(/\.(\w+)$/)[1];
            i = i + ('\r\nContent-Disposition: form-data; name="upload"; filename="' + options.name + '"');
            i = i + ("\r\nContent-type: image/" + j) + ("\r\n\r\n" + window.atob(options.file.split(",")[1]));
            i = i + "\r\n-----------------------------1966284435497298061834782736";
            if (options.extraFields) {
                j = options.extraFields;
                var data;
                for (data in j) {
                    i = i + ('\r\nContent-Disposition: form-data; name="' + unescape(encodeURIComponent(data)).replace(/=/g, "\\=") + '"');
                    i = i + ("\r\n\r\n" + unescape(encodeURIComponent(j[data])));
                    i = i + "\r\n-----------------------------1966284435497298061834782736";
                }
            }
            i = i + "--";
            el.setRequestHeader("Content-Type", "multipart/form-data; boundary=---------------------------1966284435497298061834782736");
            data = new ArrayBuffer(i.length);
            data = new Uint8Array(data, 0);
            j = 0;
            for (; j < i.length; j++) {
                data[j] = i.charCodeAt(j) & 255;
            }
        } else {
            data = new FormData;
            data.append("upload", options.file, options.name);
            if (options.extraFields) {
                files = options.extraFields;
                for (j in files) {
                    if (files.hasOwnProperty(j)) {
                        data.append(j, files[j]);
                    }
                }
            }
            if (options.extraHeaders) {
                j = options.extraHeaders;
                for (i in j) {
                    if (j.hasOwnProperty(i)) {
                        el.setRequestHeader(i, j[i]);
                    }
                }
            }
        }
        el.send(data);
        return true;
    }

    function f(editor, i, t) {
        if (editor.document && editor.document.$) {
            var d = (CKEDITOR.dialog.getCurrent() ? CKEDITOR : editor).document.$;
            var n = d.getElementById("rect" + i);
            i = d.getElementById("text" + i);
            if (t) {
                if (!t.lengthComputable) {
                    return;
                }
                d = (100 * t.loaded / t.total).toFixed(2) + "%";
                editor = (100 * t.loaded / t.total).toFixed() + "%";
            } else {
                editor = editor.lang.simpleuploads.processing;
                d = "100%";
            }
            if (n) {
                n.setAttribute("width", d);
                n.style.width = d;
                if (!t) {
                    if (n = n.parentNode) {
                        if (n.className == "uploadRect") {
                            n.parentNode.removeChild(n);
                        }
                    }
                }
            }
            if (i) {
                i.firstChild.nodeValue = editor;
                if (!t) {
                    if (t = i.nextSibling) {
                        if (t.nodeName.toLowerCase() == "a") {
                            t.parentNode.removeChild(t);
                        }
                    }
                }
            }
        }
    }

    function render(value, i, editor) {
        var self = new CKEDITOR.dom.element("span", editor.document);
        var list = self.$;
        var URL;
        var doc = editor.document.$;
        editor = doc.createElement("span");
        self.setAttribute("id", i);
        self.setAttribute("class", "SimpleUploadsTmpWrapper");
        var element = doc.createElement("span");
        element.setAttribute("id", "text" + i);
        element.appendChild(doc.createTextNode("0 %"));
        list.appendChild(editor);
        editor.appendChild(element);
        element = doc.createElement("span");
        element.appendChild(doc.createTextNode("x"));
        editor.appendChild(element);
        if (typeof value != "string") {
            URL = window.URL || window.webkitURL;
            if (!URL || !URL.revokeObjectURL) {
                return self;
            }
        }
        editor = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
        editor.setAttribute("id", "svg" + i);
        element = doc.createElement("img");
        if (URL) {
            element.onload = function() {
                if (this.onload) {
                    URL.revokeObjectURL(this.src);
                    this.onload = null;
                }
                var svg = doc.getElementById("svg" + i);
                if (svg) {
                    svg.setAttribute("width", this.width + "px");
                    svg.setAttribute("height", this.height + "px");
                }
                if (svg = doc.getElementById(i)) {
                    svg.style.width = this.width + "px";
                }
            };
            element.src = URL.createObjectURL(value);
        } else {
            element.src = value;
            element.onload = function() {
                this.onload = null;
                var svg = doc.getElementById("svg" + i);
                if (svg) {
                    svg.setAttribute("width", this.width + "px");
                    svg.setAttribute("height", this.height + "px");
                }
            };
            editor.setAttribute("width", element.width + "px");
            editor.setAttribute("height", element.height + "px");
        }
        list.appendChild(editor);
        list = doc.createElementNS("http://www.w3.org/2000/svg", "filter");
        list.setAttribute("id", "SVGdesaturate");
        editor.appendChild(list);
        element = doc.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
        element.setAttribute("type", "saturate");
        element.setAttribute("values", "0");
        list.appendChild(element);
        list = doc.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        list.setAttribute("id", "SVGprogress" + i);
        editor.appendChild(list);
        element = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
        element.setAttribute("id", "rect" + i);
        element.setAttribute("width", "0");
        element.setAttribute("height", "100%");
        list.appendChild(element);
        var node = doc.createElementNS("http://www.w3.org/2000/svg", "image");
        node.setAttribute("width", "100%");
        node.setAttribute("height", "100%");
        if (URL) {
            node.setAttributeNS("http://www.w3.org/1999/xlink", "href", URL.createObjectURL(value));
            var completed = function() {
                URL.revokeObjectURL(node.getAttributeNS("http://www.w3.org/1999/xlink", "href"));
                node.removeEventListener("load", completed, false);
            };
            node.addEventListener("load", completed, false);
        } else {
            node.setAttributeNS("http://www.w3.org/1999/xlink", "href", value);
        }
        value = node.cloneNode(true);
        node.setAttribute("filter", "url(#SVGdesaturate)");
        node.style.opacity = "0.5";
        editor.appendChild(node);
        value.setAttribute("clip-path", "url(#SVGprogress" + i + ")");
        editor.appendChild(value);
        return self;
    }

    function attachFileBrowser(editor, deepDataAndEvents, options, element) {
        if (element.type != "file") {
            var restoreScript = deepDataAndEvents.substr(0, 5) == "image";
            var target = element.filebrowser.target.split(":");
            var filter = {
                setup: function(config) {
                    if (options.uploadUrl) {
                        if (restoreScript) {
                            config.requiresImage = true;
                        }
                        var params = {};
                        params.CKEditor = editor.name;
                        params.CKEditorFuncNum = 2;
                        params.langCode = editor.langCode;
                        config.url = require(options.uploadUrl, params);
                    }
                },
                start: function(e) {
                    var self = CKEDITOR.dialog.getCurrent();
                    self.showThrobber();
                    var o = self.throbber;
                    if (e.xhr) {
                        o.throbberTitle.setHtml("<span class='uploadName'>" + e.name + "</span> <span class='uploadRect'><span id='rect" + e.id + "'></span></span> <span id='text" + e.id + "' class='uploadText'> </span><a>x</a>");
                        var config = o.throbberCover;
                        var xhr = e.xhr;
                        if (config.timer) {
                            clearInterval(config.timer);
                            config.timer = null;
                        }
                        o.throbberParent.setStyle("display", "none");
                        o.throbberTitle.getLast().on("click", function() {
                            xhr.abort();
                        });
                        self.on("hide", function() {
                            if (xhr.readyState == 1) {
                                xhr.abort();
                            }
                        });
                    }
                    o.center();
                },
                upload: function(key, context, data) {
                    var dialog = CKEDITOR.dialog.getCurrent();
                    dialog.throbber.hide();
                    if (!(typeof context == "function" && context.call(data.context.sender) === false) && (!(options.onFileSelect && options.onFileSelect.call(data.context.sender, key, context) === false) && key)) {
                        dialog.getContentElement(target[0], target[1]).setValue(key);
                        dialog.selectPage(target[0]);
                    }
                }
            };
            if (element.filebrowser.action == "QuickUpload") {
                options.hasQuickUpload = true;
                options.onFileSelect = null;
                if (!editor.config.simpleuploads_respectDialogUploads) {
                    element.label = restoreScript ? editor.lang.simpleuploads.addImage : editor.lang.simpleuploads.addFile;
                    element.onClick = function(callback) {
                        update(editor, restoreScript, callback, filter);
                        return false;
                    };
                    options.getContents(element["for"][0]).get(element["for"][1]).hidden = true;
                }
            } else {
                if (options.hasQuickUpload) {
                    return;
                }
                if (element.filebrowser.onSelect) {
                    options.onFileSelect = element.filebrowser.onSelect;
                }
            }
            if (editor.plugins.fileDropHandler) {
                if (element.filebrowser.action == "QuickUpload") {
                    options.uploadUrl = element.filebrowser.url;
                }
                options.onShow = CKEDITOR.tools.override(options.onShow || function() {}, function(successCb) {
                    return function() {
                        if (typeof successCb == "function") {
                            successCb.call(this);
                        }
                        if (!(element.filebrowser.action != "QuickUpload" && options.hasQuickUpload) && !this.handleFileDrop) {
                            this.handleFileDrop = true;
                            this.getParentEditor().plugins.fileDropHandler.addTarget(this.parts.contents, filter);
                        }
                    };
                });
            }
        }
    }

    function register(editor, deepDataAndEvents, definition, map) {
        var letter;
        for (letter in map) {
            var element = map[letter];
            if (element) {
                if (element.type == "hbox" || (element.type == "vbox" || element.type == "fieldset")) {
                    register(editor, deepDataAndEvents, definition, element.children);
                }
                if (element.filebrowser) {
                    if (element.filebrowser.url) {
                        attachFileBrowser(editor, deepDataAndEvents, definition, element);
                    }
                }
            }
        }
    }

    function create(editor, options) {
        var i = editor.document.getById(options.id);
        if (i) {
            var codeSegments = i.$.getElementsByTagName("a");
            if (!codeSegments || !codeSegments.length) {
                codeSegments = i.$.getElementsByTagName("span");
                if (!codeSegments || !codeSegments.length) {
                    return;
                }
            }
            i = 0;
            for (; i < codeSegments.length; i++) {
                var cell = codeSegments[i];
                if (cell.innerHTML == "x") {
                    cell.className = "uploadCancel";
                    cell.onclick = function() {
                        if (options.xhr) {
                            options.xhr.abort();
                        }
                    };
                }
            }
        }
    }

    function type$$0(evt) {
        var editor = evt.listenerData.editor;
        var d = evt.listenerData.dialog;
        var i;
        var item;
        if (i = evt.data && evt.data.$.clipboardData || editor.config.forcePasteAsPlainText && window.clipboardData) {
            if (CKEDITOR.env.gecko && (editor.config.forcePasteAsPlainText && i.types.length === 0)) {
                editor.on("beforePaste", function(e) {
                    e.removeListener();
                    e.data.type = "html";
                });
            } else {
                var items = i.items || i.files;
                if (items && items.length) {
                    if (items[0].kind) {
                        i = 0;
                        for (; i < items.length; i++) {
                            item = items[i];
                            if (item.kind == "string" && (item.type == "text/html" || item.type == "text/plain")) {
                                return;
                            }
                        }
                    }
                    i = 0;
                    for (; i < items.length; i++) {
                        item = items[i];
                        if (!(item.kind && item.kind != "file")) {
                            evt.data.preventDefault();
                            var camelKey = item.getAsFile ? item.getAsFile() : item;
                            if (CKEDITOR.env.ie || editor.config.forcePasteAsPlainText) {
                                setTimeout(function() {
                                    onKeyDown(camelKey, evt);
                                }, 100);
                            } else {
                                onKeyDown(camelKey, evt);
                            }
                        }
                    }
                    if (d) {
                        if (evt.data.$.defaultPrevented) {
                            d.hide();
                        }
                    }
                }
            }
        }
    }

    function onKeyDown(key, evt) {
        var editor = evt.listenerData.editor;
        var dialog = evt.listenerData.dialog;
        var name = CKEDITOR.plugins.simpleuploads.getTimeStampId();
        CKEDITOR.plugins.simpleuploads.insertPastedFile(editor, {
            context: evt.data.$,
            name: key.name || name + ".png",
            file: key,
            forceLink: false,
            id: name,
            mode: {
                type: "pastedFile",
                dialog: dialog
            }
        });
    }

    function onPasteFrameLoad(deepDataAndEvents) {
        var self = deepDataAndEvents.getFrameDocument();
        var dialog = self.getBody();
        if (!dialog || (!dialog.$ || dialog.$.contentEditable != "true" && self.$.designMode != "on")) {
            setTimeout(function() {
                onPasteFrameLoad(deepDataAndEvents);
            }, 100);
        } else {
            dialog = CKEDITOR.dialog.getCurrent();
            self.on("paste", type$$0, null, {
                dialog: dialog,
                editor: dialog.getParentEditor()
            });
        }
    }
    var rules = {
        elements: {
            $: function(name) {
                name = name.attributes;
                if ((name && name["class"]) == "SimpleUploadsTmpWrapper") {
                    return false;
                }
            }
        }
    };
    var el$$0;
    var editor;
    var e$$0;
    var last;
    var newContext;
    var options$$0;
    var triggerCallback;
    CKEDITOR.plugins.add("simpleuploads", {
        lang: ["en", "ar", "cs", "de", "es", "fr", "he", "hu", "it", "ja", "ko", "nl", "pl", "pt-br", "ru", "tr", "zh-cn"],
        onLoad: function() {
            if (CKEDITOR.addCss) {
                CKEDITOR.addCss(extend(CKEDITOR.config));
            }
            var style = CKEDITOR.document.getHead().append("style");
            style.setAttribute("type", "text/css");
            var code = ".SimpleUploadsOverContainer {" + (CKEDITOR.config.simpleuploads_containerover || "box-shadow: 0 0 10px 1px #99DD99 !important;") + "} .SimpleUploadsOverDialog {" + (CKEDITOR.config.simpleuploads_dialogover || "box-shadow: 0 0 10px 4px #999999 inset !important;") + "} .SimpleUploadsOverCover {" + (CKEDITOR.config.simpleuploads_coverover || "box-shadow: 0 0 10px 4px #99DD99 !important;") + "} ";
            code = code + ".cke_throbber {margin: 0 auto; width: 100px;} .cke_throbber div {float: left; width: 8px; height: 9px; margin-left: 2px; margin-right: 2px; font-size: 1px;} .cke_throbber .cke_throbber_1 {background-color: #737357;} .cke_throbber .cke_throbber_2 {background-color: #8f8f73;} .cke_throbber .cke_throbber_3 {background-color: #abab8f;} .cke_throbber .cke_throbber_4 {background-color: #c7c7ab;} .cke_throbber .cke_throbber_5 {background-color: #e3e3c7;} .uploadRect {display: inline-block;height: 11px;vertical-align: middle;width: 50px;} .uploadRect span {background-color: #999;display: inline-block;height: 100%;vertical-align: top;} .uploadName {display: inline-block;max-width: 180px;overflow: hidden;text-overflow: ellipsis;vertical-align: top;white-space: pre;} .uploadText {font-size:80%;} .cke_throbberMain a {cursor: pointer; font-size: 14px; font-weight:bold; padding: 4px 5px;position: absolute;right:0; text-decoration:none; top: -2px;} .cke_throbberMain {background-color: #FFF; border:1px solid #e5e5e5; padding:4px 14px 4px 4px; min-width:250px; position:absolute;}";
            if (CKEDITOR.env.ie && CKEDITOR.env.version < 11) {
                style.$.styleSheet.cssText = code;
            } else {
                style.$.innerHTML = code;
            }
        },
        init: function(editor$$0) {
            var config$$0 = editor$$0.config;
            if (typeof config$$0.simpleuploads_imageExtensions == "undefined") {
                config$$0.simpleuploads_imageExtensions = "jpe?g|gif|png";
            }
            if (editor$$0.addCss) {
                editor$$0.addCss(extend(config$$0));
            }
            if (!config$$0.filebrowserImageUploadUrl) {
                config$$0.filebrowserImageUploadUrl = config$$0.filebrowserUploadUrl;
            }
            if (!config$$0.filebrowserUploadUrl && !config$$0.filebrowserImageUploadUrl) {
                if (window.console && console.log) {
                    console.log("The editor is missing the 'config.filebrowserUploadUrl' entry to know the url that will handle uploaded files.\r\nIt should handle the posted file as shown in Example 3: http://docs.cksource.com/CKEditor_3.x/Developers_Guide/File_Browser_%28Uploader%29/Custom_File_Browser#Example_3\r\nMore info: http://alfonsoml.blogspot.com/2009/12/using-your-own-uploader-in-ckeditor.html");
                    console[console.warn ? "warn" : "log"]("The 'SimpleUploads' plugin now is disabled.");
                }
            } else {
                if (!(config$$0.filebrowserImageUploadUrl == "base64" && typeof FormData == "undefined")) {
                    if (editor$$0.addFeature) {
                        editor$$0.addFeature({
                            allowedContent: "img[!src,width,height];a[!href];span[id](SimpleUploadsTmpWrapper);"
                        });
                    }
                    CKEDITOR.dialog.prototype.showThrobber = function() {
                        if (!this.throbber) {
                            this.throbber = {
                                update: function() {
                                    var $ = this.throbberParent.$;
                                    var c = $.childNodes;
                                    $ = $.lastChild.className;
                                    var i = c.length - 1;
                                    for (; i > 0; i--) {
                                        c[i].className = c[i - 1].className;
                                    }
                                    c[0].className = $;
                                },
                                create: function(obj) {
                                    if (!this.throbberCover) {
                                        var header = CKEDITOR.dom.element.createFromHtml('<div style="background-color:rgba(255,255,255,0.95);width:100%;height:100%;top:0;left:0; position:absolute; visibility:none;z-index:100;"></div>');
                                        obj.parts.close.setStyle("z-index", 101);
                                        if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
                                            header.setStyle("zoom", 1);
                                            header.setStyle("filter", "progid:DXImageTransform.Microsoft.gradient(startColorstr=#EEFFFFFF,endColorstr=#EEFFFFFF)");
                                        }
                                        header.appendTo(obj.parts.dialog);
                                        this.throbberCover = header;
                                        var div = new CKEDITOR.dom.element("div");
                                        this.mainThrobber = div;
                                        var element = new CKEDITOR.dom.element("div");
                                        this.throbberParent = element;
                                        var p = new CKEDITOR.dom.element("div");
                                        this.throbberTitle = p;
                                        header.append(div).addClass("cke_throbberMain");
                                        div.append(p).addClass("cke_throbberTitle");
                                        div.append(element).addClass("cke_throbber");
                                        header = [1, 2, 3, 4, 5, 4, 3, 2];
                                        for (; header.length > 0;) {
                                            element.append(new CKEDITOR.dom.element("div")).addClass("cke_throbber_" + header.shift());
                                        }
                                        this.center();
                                        obj.on("hide", this.hide, this);
                                    }
                                },
                                center: function() {
                                    var container = this.mainThrobber;
                                    var outer = this.throbberCover;
                                    var sec = (outer.$.offsetHeight - container.$.offsetHeight) / 2;
                                    container.setStyle("left", ((outer.$.offsetWidth - container.$.offsetWidth) / 2).toFixed() + "px");
                                    container.setStyle("top", sec.toFixed() + "px");
                                },
                                show: function() {
                                    this.create(CKEDITOR.dialog.getCurrent());
                                    this.throbberCover.setStyle("visibility", "");
                                    this.timer = setInterval(CKEDITOR.tools.bind(this.update, this), 100);
                                },
                                hide: function() {
                                    if (this.timer) {
                                        clearInterval(this.timer);
                                        this.timer = null;
                                    }
                                    if (this.throbberCover) {
                                        this.throbberCover.setStyle("visibility", "hidden");
                                    }
                                }
                            };
                        }
                        this.throbber.show();
                    };
                    editor$$0.on("simpleuploads.startUpload", function(event) {
                        var editor = event.editor;
                        var config = editor.config;
                        var file = event.data && event.data.file;
                        if (config.simpleuploads_maxFileSize && (file && (file.size && file.size > config.simpleuploads_maxFileSize))) {
                            alert(editor.lang.simpleuploads.fileTooBig);
                            event.cancel();
                        }
                        file = event.data.name;
                        if (config.simpleuploads_invalidExtensions && RegExp(".(?:" + config.simpleuploads_invalidExtensions + ")$", "i").test(file)) {
                            alert(editor.lang.simpleuploads.invalidExtension);
                            event.cancel();
                        }
                        if (config.simpleuploads_acceptedExtensions && !RegExp(".(?:" + config.simpleuploads_acceptedExtensions + ")$", "i").test(file)) {
                            alert(editor.lang.simpleuploads.nonAcceptedExtension.replace("%0", config.simpleuploads_acceptedExtensions));
                            event.cancel();
                        }
                    });
                    editor$$0.on("simpleuploads.startUpload", function(e) {
                        var info = e.data;
                        var editor = e.editor;
                        if (!info.image && (!info.forceLink && (CKEDITOR.plugins.simpleuploads.isImageExtension(editor, info.name) && (info.mode && (info.mode.type && editor.hasListeners("simpleuploads.localImageReady")))))) {
                            e.cancel();
                            if (info.mode.type == "base64paste") {
                                var originalId = CKEDITOR.plugins.simpleuploads.getTimeStampId();
                                info.result = "<span id='" + originalId + "' class='SimpleUploadsTmpWrapper' style='display:none'>&nbsp;</span>";
                                info.mode.id = originalId;
                            }
                            var texture = new Image;
                            texture.onload = function() {
                                var args = CKEDITOR.tools.extend({}, info);
                                args.image = texture;
                                if (typeof editor.fire("simpleuploads.localImageReady", args) != "boolean") {
                                    CKEDITOR.plugins.simpleuploads.insertProcessedFile(e.editor, args);
                                }
                            };
                            texture.src = typeof info.file == "string" ? info.file : URL.createObjectURL(info.file);
                        }
                    });
                    if (config$$0.simpleuploads_convertBmp) {
                        editor$$0.on("simpleuploads.localImageReady", ready);
                    }
                    if (config$$0.simpleuploads_maximumDimensions) {
                        editor$$0.on("simpleuploads.localImageReady", handler);
                    }
                    editor$$0.on("simpleuploads.finishedUpload", function(element) {
                        if (editor$$0.widgets && editor$$0.plugins.image2) {
                            element = element.data.element;
                            if (element.getName() == "img") {
                                var widget = editor$$0.widgets.getByElement(element);
                                if (widget) {
                                    widget.data.src = element.data("cke-saved-src");
                                    widget.data.width = element.$.width;
                                    widget.data.height = element.$.height;
                                } else {
                                    editor$$0.widgets.initOn(element, "image2");
                                    editor$$0.widgets.initOn(element, "image");
                                }
                            }
                        }
                    });
                    editor$$0.on("paste", function(evt) {
                        var data = evt.data;
                        if (data = data.html || data.type && (data.type == "html" && data.dataValue)) {
                            if (CKEDITOR.env.webkit && data.indexOf("webkit-fake-url") > 0) {
                                alert("Sorry, the images pasted with Safari aren't usable");
                                window.open("https://bugs.webkit.org/show_bug.cgi?id=49141");
                                data = data.replace(/<img src="webkit-fake-url:.*?">/g, "");
                            }
                            if (config$$0.filebrowserImageUploadUrl != "base64") {
                                data = data.replace(/<img(.*?) src="data:image\/.{3,4};base64,.*?"(.*?)>/g, function(element) {
                                    if (!editor$$0.config.filebrowserImageUploadUrl) {
                                        return "";
                                    }
                                    var i = element.match(/"(data:image\/(.{3,4});base64,.*?)"/);
                                    var v = i[1];
                                    i = i[2].toLowerCase();
                                    var d = CKEDITOR.plugins.simpleuploads.getTimeStampId();
                                    if (v.length < 128) {
                                        return element;
                                    }
                                    if (i == "jpeg") {
                                        i = "jpg";
                                    }
                                    var options = {
                                        context: "pastedimage",
                                        name: d + "." + i,
                                        id: d,
                                        forceLink: false,
                                        file: v,
                                        mode: {
                                            type: "base64paste"
                                        }
                                    };
                                    if (!callback$$0(editor$$0, options)) {
                                        return options.result;
                                    }
                                    element = options.element;
                                    var h = element.$.innerHTML;
                                    element.$.innerHTML = "&nbsp;";
                                    editor$$0.on("afterPaste", function(e) {
                                        e.removeListener();
                                        if (e = editor$$0.document.$.getElementById(d)) {
                                            e.innerHTML = h;
                                            create(editor$$0, options);
                                        }
                                    });
                                    return element.getOuterHtml();
                                });
                            }
                            if (evt.data.html) {
                                evt.data.html = data;
                            } else {
                                evt.data.dataValue = data;
                            }
                        }
                    });
                    var load = function(from) {
                        if (editor$$0.mode == "wysiwyg") {
                            var dom = editor$$0.document;
                            if (editor$$0.editable) {
                                dom = editor$$0.editable();
                            }
                            if (dom.$.querySelector(".SimpleUploadsTmpWrapper")) {
                                from = from.name.substr(5).toLowerCase();
                                if (from == "redo") {
                                    if (editor$$0.getCommand(from).state == CKEDITOR.TRISTATE_DISABLED) {
                                        from = "undo";
                                    }
                                }
                                editor$$0.execCommand(from);
                            }
                        }
                    };
                    var undoCmd = editor$$0.getCommand("undo");
                    if (undoCmd) {
                        undoCmd.on("afterUndo", load);
                    }
                    if (undoCmd = editor$$0.getCommand("redo")) {
                        editor$$0.getCommand("redo").on("afterRedo", load);
                    }
                    editor$$0.on("afterUndo", load);
                    editor$$0.on("afterRedo", load);
                    editor$$0.addCommand("addFile", {
                        exec: function(editor) {
                            update(editor, false, this);
                        }
                    });
                    editor$$0.ui.addButton("addFile", {
                        label: editor$$0.lang.simpleuploads.addFile,
                        command: "addFile",
                        toolbar: "insert",
                        allowedContent: "a[!href];span[id](SimpleUploadsTmpWrapper);",
                        requiredContent: "a[!href]"
                    });
                    editor$$0.addCommand("addImage", {
                        exec: function(editor) {
                            update(editor, true, this);
                        }
                    });
                    if (editor$$0.ui.addButton) {
                        editor$$0.ui.addButton("addImage", {
                            label: editor$$0.lang.simpleuploads.addImage,
                            command: "addImage",
                            toolbar: "insert",
                            allowedContent: "img[!src,width,height];span[id](SimpleUploadsTmpWrapper);",
                            requiredContent: "img[!src]"
                        });
                    }
                    if (typeof FormData != "undefined") {
                        var element$$0;
                        var node;
                        var editable;
                        var offset = -1;
                        var n;
                        var start;
                        var ALPHABETS_START;
                        var code = -1;
                        var docs;
                        var sw;
                        var sh;
                        var types = function() {
                            var e = CKEDITOR.dialog.getCurrent();
                            if (e) {
                                e.parts.title.getParent().removeClass("SimpleUploadsOverCover");
                            } else {
                                editor$$0.container.removeClass("SimpleUploadsOverContainer");
                            }
                        };
                        editor$$0.on("destroy", function() {
                            CKEDITOR.removeListener("simpleuploads.droppedFile", types);
                            CKEDITOR.document.removeListener("dragenter", type);
                            CKEDITOR.document.removeListener("dragleave", onMouseDown);
                            init();
                        });
                        var init = function() {
                            if (element$$0 && element$$0.removeListener) {
                                editable.removeListener("paste", type);
                                element$$0.removeListener("dragenter", keepData);
                                element$$0.removeListener("dragleave", update);
                                element$$0.removeListener("dragover", name);
                                element$$0.removeListener("drop", key);
                                node = element$$0 = editable = null;
                            }
                        };
                        CKEDITOR.on("simpleuploads.droppedFile", types);
                        var type = function(e) {
                            if (code == -1 && next(e)) {
                                if (e = CKEDITOR.dialog.getCurrent()) {
                                    if (!e.handleFileDrop) {
                                        return;
                                    }
                                    e.parts.title.getParent().addClass("SimpleUploadsOverCover");
                                } else {
                                    if (!editor$$0.readOnly) {
                                        editor$$0.container.addClass("SimpleUploadsOverContainer");
                                    }
                                }
                                docs = code = 0;
                                sw = CKEDITOR.document.$.body.parentNode.clientWidth;
                                sh = CKEDITOR.document.$.body.parentNode.clientHeight;
                            }
                        };
                        var onMouseDown = function(evt) {
                            if (code != -1) {
                                evt = evt.data.$;
                                if (evt.clientX <= code || (evt.clientY <= docs || (evt.clientX >= sw || evt.clientY >= sh))) {
                                    types();
                                    code = -1;
                                }
                            }
                        };
                        CKEDITOR.document.on("dragenter", type);
                        CKEDITOR.document.on("dragleave", onMouseDown);
                        var key = function(data) {
                            node.removeClass("SimpleUploadsOverEditor");
                            offset = -1;
                            CKEDITOR.fire("simpleuploads.droppedFile");
                            code = -1;
                            if (editor$$0.readOnly) {
                                data.data.preventDefault();
                                return false;
                            }
                            var e = data.data.$;
                            var dt = e.dataTransfer;
                            if (dt && (dt.files && dt.files.length > 0)) {
                                editor$$0.fire("saveSnapshot");
                                data.data.preventDefault();
                                data = {
                                    ev: e,
                                    range: false,
                                    count: dt.files.length,
                                    rangeParent: e.rangeParent,
                                    rangeOffset: e.rangeOffset
                                };
                                var index = 0;
                                for (; index < dt.files.length; index++) {
                                    var file = dt.files[index];
                                    var pageId = CKEDITOR.tools.getNextId();
                                    CKEDITOR.plugins.simpleuploads.insertDroppedFile(editor$$0, {
                                        context: e,
                                        name: file.name,
                                        file: file,
                                        forceLink: e.shiftKey,
                                        id: pageId,
                                        mode: {
                                            type: "droppedFile",
                                            dropLocation: data
                                        }
                                    });
                                }
                            }
                        };
                        var keepData = function(data) {
                            if (offset == -1 && next(data)) {
                                if (!editor$$0.readOnly) {
                                    node.addClass("SimpleUploadsOverEditor");
                                }
                                data = node.$.getBoundingClientRect();
                                offset = data.left;
                                n = data.top;
                                start = offset + node.$.clientWidth;
                                ALPHABETS_START = n + node.$.clientHeight;
                            }
                        };
                        var update = function(evt) {
                            if (offset != -1) {
                                evt = evt.data.$;
                                if (evt.clientX <= offset || (evt.clientY <= n || (evt.clientX >= start || evt.clientY >= ALPHABETS_START))) {
                                    node.removeClass("SimpleUploadsOverEditor");
                                    offset = -1;
                                }
                            }
                        };
                        var name = function(evt) {
                            if (offset != -1) {
                                if (editor$$0.readOnly) {
                                    evt.data.$.dataTransfer.dropEffect = "none";
                                    evt.data.preventDefault();
                                    return false;
                                }
                                evt.data.$.dataTransfer.dropEffect = "copy";
                                if (!CKEDITOR.env.gecko) {
                                    evt.data.preventDefault();
                                }
                            }
                        };
                        editor$$0.on("contentDom", function() {
                            element$$0 = editor$$0.document;
                            node = element$$0.getBody().getParent();
                            if (editor$$0.elementMode == 3) {
                                node = element$$0 = editor$$0.element;
                            }
                            if (editor$$0.elementMode == 1 && "divarea" in editor$$0.plugins) {
                                node = element$$0 = editor$$0.editable();
                            }
                            editable = editor$$0.editable ? editor$$0.editable() : element$$0;
                            if (CKEDITOR.env.ie && (CKEDITOR.env.version >= 11 && (editor$$0.config.forcePasteAsPlainText && editor$$0.editable().isInline()))) {
                                editable.attachListener(editable, "beforepaste", function() {
                                    editor$$0.document.on("paste", function(tab) {
                                        tab.removeListener();
                                        type(tab);
                                    }, null, {
                                        editor: editor$$0
                                    });
                                });
                            } else {
                                editable.on("paste", type, null, {
                                    editor: editor$$0
                                }, 8);
                            }
                            element$$0.on("dragenter", keepData);
                            element$$0.on("dragleave", update);
                            if (!CKEDITOR.env.gecko) {
                                element$$0.on("dragover", name);
                            }
                            element$$0.on("drop", key);
                        });
                        editor$$0.on("contentDomUnload", init);
                        editor$$0.plugins.fileDropHandler = {
                            addTarget: function(element, o) {
                                element.on("dragenter", function(e) {
                                    if (offset == -1 && next(e)) {
                                        element.addClass("SimpleUploadsOverDialog");
                                        e = element.$.getBoundingClientRect();
                                        offset = e.left;
                                        n = e.top;
                                        start = offset + element.$.clientWidth;
                                        ALPHABETS_START = n + element.$.clientHeight;
                                    }
                                });
                                element.on("dragleave", function(evt) {
                                    if (offset != -1) {
                                        evt = evt.data.$;
                                        if (evt.clientX <= offset || (evt.clientY <= n || (evt.clientX >= start || evt.clientY >= ALPHABETS_START))) {
                                            element.removeClass("SimpleUploadsOverDialog");
                                            offset = -1;
                                        }
                                    }
                                });
                                element.on("dragover", function(evt) {
                                    if (offset != -1) {
                                        evt.data.$.dataTransfer.dropEffect = "copy";
                                        evt.data.preventDefault();
                                    }
                                });
                                element.on("drop", function(index) {
                                    element.removeClass("SimpleUploadsOverDialog");
                                    offset = -1;
                                    CKEDITOR.fire("simpleuploads.droppedFile");
                                    code = -1;
                                    var e = index.data.$;
                                    var dt = e.dataTransfer;
                                    if (dt && (dt.files && dt.files.length > 0)) {
                                        index.data.preventDefault();
                                        index = 0;
                                        for (; index < 1; index++) {
                                            var file = dt.files[index];
                                            file = {
                                                context: e,
                                                name: file.name,
                                                file: file,
                                                id: CKEDITOR.tools.getNextId(),
                                                forceLink: false,
                                                callback: o,
                                                mode: {
                                                    type: "callback"
                                                }
                                            };
                                            CKEDITOR.plugins.simpleuploads.processFileWithCallback(editor$$0, file);
                                        }
                                    }
                                });
                            }
                        };
                    }
                }
            }
        },
        afterInit: function(filter) {
            if (filter = (filter = filter.dataProcessor) && filter.htmlFilter) {
                filter.addRules(rules, {
                    applyToAll: true
                });
            }
        }
    });
    CKEDITOR.plugins.simpleuploads = {
        getTimeStampId: function() {
            var _ = 0;
            return function() {
                _++;
                return (new Date).toISOString().replace(/\..*/, "").replace(/\D/g, "_") + _;
            };
        }(),
        isImageExtension: function(editor, qualifier) {
            return !editor.config.simpleuploads_imageExtensions ? false : RegExp(".(?:" + editor.config.simpleuploads_imageExtensions + ")$", "i").test(qualifier);
        },
        insertProcessedFile: function(x, data) {
            data.element = null;
            data.id = this.getTimeStampId();
            switch (data.mode.type) {
                case "selectedFile":
                    var render = this;
                    window.setTimeout(function() {
                        render.insertSelectedFile(x, data);
                    }, 50);
                    break;
                case "pastedFile":
                    this.insertPastedFile(x, data);
                    break;
                case "callback":
                    render = this;
                    window.setTimeout(function() {
                        render.processFileWithCallback(x, data);
                    }, 50);
                    break;
                case "droppedFile":
                    this.insertDroppedFile(x, data);
                    break;
                case "base64paste":
                    this.insertBase64File(x, data);
                    break;
                default:
                    alert("Error, no valid type", data.mode);
            }
        },
        insertSelectedFile: function(editor, opts) {
            var element = opts.mode;
            var index = element.i;
            var result = element.count;
            if (callback$$0(editor, opts)) {
                if (element = opts.element) {
                    if (result == 1) {
                        var ieRange = editor.getSelection();
                        result = ieRange.getSelectedElement();
                        var target;
                        if (result && (result.getName() == "img" && element.getName() == "span")) {
                            target = result.$;
                        }
                        if (element.getName() == "a") {
                            var node = result;
                            var codeSegments = ieRange.getRanges();
                            ieRange = codeSegments && codeSegments[0];
                            if (!node && (codeSegments && codeSegments.length == 1)) {
                                node = ieRange.startContainer.$;
                                if (node.nodeType == document.TEXT_NODE) {
                                    node = node.parentNode;
                                }
                            }
                            for (; node && (node.nodeType == document.ELEMENT_NODE && node.nodeName.toLowerCase() != "a");) {
                                node = node.parentNode;
                            }
                            if (node) {
                                if (node.nodeName && node.nodeName.toLowerCase() == "a") {
                                    target = node;
                                }
                            }
                            if (!target && (ieRange && (result || !ieRange.collapsed))) {
                                target = new CKEDITOR.style({
                                    element: "a",
                                    attributes: {
                                        href: "#"
                                    }
                                });
                                target.type = CKEDITOR.STYLE_INLINE;
                                target.applyToRange(ieRange);
                                node = ieRange.startContainer.$;
                                if (node.nodeType == document.TEXT_NODE) {
                                    node = node.parentNode;
                                }
                                target = node;
                            }
                        }
                        if (target) {
                            target.parentNode.replaceChild(element.$, target);
                            opts.originalNode = target;
                            editor.fire("saveSnapshot");
                            return;
                        }
                    }
                    if (index > 0) {
                        if (element.getName() == "a") {
                            editor.insertHtml("&nbsp;");
                        }
                    }
                    editor.insertElement(element);
                    create(editor, opts);
                }
            }
        },
        insertPastedFile: function(editor, options) {
            if (callback$$0(editor, options)) {
                var wrapper = options.element;
                if (options.mode.dialog) {
                    editor.fire("updateSnapshot");
                    editor.insertElement(wrapper);
                    editor.fire("updateSnapshot");
                } else {
                    var onLoad = function() {
                        if (editor.getSelection().getRanges().length) {
                            if (editor.editable().$.querySelector("#cke_pastebin")) {
                                window.setTimeout(onLoad, 0);
                            } else {
                                editor.fire("updateSnapshot");
                                editor.insertElement(wrapper);
                                editor.fire("updateSnapshot");
                                create(editor, options);
                            }
                        } else {
                            window.setTimeout(onLoad, 0);
                        }
                    };
                    window.setTimeout(onLoad, 0);
                }
            }
        },
        processFileWithCallback: function(editor, dir) {
            callback$$0(editor, dir);
        },
        insertDroppedFile: function(editor, entry) {
            if (callback$$0(editor, entry)) {
                var parent = entry.element;
                var that = entry.mode.dropLocation;
                var range = that.range;
                var node = that.ev;
                var element = that.count;
                if (range) {
                    if (parent.getName() == "a") {
                        if (range.pasteHTML) {
                            range.pasteHTML("&nbsp;");
                        } else {
                            range.insertNode(editor.document.$.createTextNode(" "));
                        }
                    }
                }
                var el = node.target;
                if (!range) {
                    var $ = editor.document.$;
                    if (that.rangeParent) {
                        node = that.rangeParent;
                        var i = that.rangeOffset;
                        range = $.createRange();
                        range.setStart(node, i);
                        range.collapse(true);
                    } else {
                        if (document.caretRangeFromPoint) {
                            range = $.caretRangeFromPoint(node.clientX, node.clientY);
                        } else {
                            if (el.nodeName.toLowerCase() == "img") {
                                range = $.createRange();
                                range.selectNode(el);
                            } else {
                                if (document.body.createTextRange) {
                                    i = $.body.createTextRange();
                                    try {
                                        i.moveToPoint(node.clientX, node.clientY);
                                        range = i;
                                    } catch (k) {
                                        range = $.createRange();
                                        range.setStartAfter($.body.lastChild);
                                        range.collapse(true);
                                    }
                                }
                            }
                        }
                    }
                    that.range = range;
                }
                $ = parent.getName();
                that = false;
                if (element == 1) {
                    if (el.nodeName.toLowerCase() == "img" && $ == "span") {
                        el.parentNode.replaceChild(parent.$, el);
                        entry.originalNode = el;
                        that = true;
                    }
                    if ($ == "a") {
                        if (range.startContainer) {
                            element = range.startContainer;
                            if (element.nodeType == document.TEXT_NODE) {
                                element = element.parentNode;
                            } else {
                                if (range.startOffset < element.childNodes.length) {
                                    element = element.childNodes[range.startOffset];
                                }
                            }
                        } else {
                            element = range.parentElement();
                        }
                        if (!element || el.nodeName.toLowerCase() == "img") {
                            element = el;
                        }
                        el = element;
                        for (; el && (el.nodeType == document.ELEMENT_NODE && el.nodeName.toLowerCase() != "a");) {
                            el = el.parentNode;
                        }
                        if (el && (el.nodeName && el.nodeName.toLowerCase() == "a")) {
                            el.parentNode.replaceChild(parent.$, el);
                            entry.originalNode = el;
                            that = true;
                        }
                        if (!that && element.nodeName.toLowerCase() == "img") {
                            el = element.ownerDocument.createElement("a");
                            el.href = "#";
                            element.parentNode.replaceChild(el, element);
                            el.appendChild(element);
                            el.parentNode.replaceChild(parent.$, el);
                            entry.originalNode = el;
                            that = true;
                        }
                    }
                }
                if (!that) {
                    if (range) {
                        if (range.pasteHTML) {
                            range.pasteHTML(parent.$.outerHTML);
                        } else {
                            range.insertNode(parent.$);
                        }
                    } else {
                        editor.insertElement(parent);
                    }
                }
                create(editor, entry);
                editor.fire("saveSnapshot");
            }
        },
        insertBase64File: function(editor, data) {
            delete data.result;
            var control = editor.document.getById(data.mode.id);
            if (callback$$0(editor, data)) {
                editor.getSelection().selectElement(control);
                editor.insertElement(data.element);
                create(editor, data);
            } else {
                control.remove();
                if (data.result) {
                    editor.insertHTML(data.result);
                }
            }
        }
    };
    if (CKEDITOR.skins) {
        CKEDITOR.plugins.setLang = CKEDITOR.tools.override(CKEDITOR.plugins.setLang, function(opt_reviver) {
            return function(key, pdataCur, fn) {
                if (key != "devtools" && typeof fn[key] != "object") {
                    var params = {};
                    params[key] = fn;
                    fn = params;
                }
                opt_reviver.call(this, key, pdataCur, fn);
            };
        });
    }
    CKEDITOR.on("dialogDefinition", function(e) {
        if (e.editor.plugins.simpleuploads) {
            var definition = e.data.definition;
            var i;
            for (i in definition.contents) {
                var selector = definition.contents[i];
                if (selector) {
                    register(e.editor, e.data.name, definition, selector.elements);
                }
            }
            if (e.data.name == "paste") {
                definition.onShow = CKEDITOR.tools.override(definition.onShow, function(successCb) {
                    return function() {
                        if (typeof successCb == "function") {
                            successCb.call(this);
                        }
                        onPasteFrameLoad(this.getContentElement("general", "editing_area").getInputElement());
                    };
                });
            }
        }
    }, null, null, 30);
})();