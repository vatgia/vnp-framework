(function() {
    function c(a) {
        a = a.data;
        if (/\.bmp$/.test(a.name)) {
            var b = a.image;
            var c = document.createElement("canvas");
            c.width = b.width;
            c.height = b.height;
            c.getContext("2d").drawImage(b, 0, 0);
            a.file = c.toDataURL("image/png");
            a.name = a.name.replace(/\.bmp$/, ".png");
        }
    }

    function f(a) {
        var b = a.editor;
        var c = b.config.simpleuploads_maximumDimensions;
        var d = a.data.image;
        if (c.width && d.width > c.width) {
            alert(b.lang.simpleuploads.imageTooWide);
            a.cancel();
        } else {
            if (c.height && d.height > c.height) {
                alert(b.lang.simpleuploads.imageTooTall);
                a.cancel();
            }
        }
    }

    function d(a) {
        var b = "span.SimpleUploadsTmpWrapper>span { top: 50%; margin-top: -0.5em; width: 100%; text-align: center; color: #fff; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); font-size: 50px; font-family: Calibri,Arial,Sans-serif; pointer-events: none; position: absolute; display: inline-block;}";
        if (a.simpleuploads_hideImageProgress) {
            b = "span.SimpleUploadsTmpWrapper { color:#333; background-color:#fff; padding:4px; border:1px solid #EEE;}";
        }
        return ".SimpleUploadsOverEditor { " + (a.simpleuploads_editorover || "box-shadow: 0 0 10px 1px #999999 inset !important;") + " }a.SimpleUploadsTmpWrapper { color:#333; background-color:#fff; padding:4px; border:1px solid #EEE;}.SimpleUploadsTmpWrapper { display: inline-block; position: relative; pointer-events: none;}" + b + ".uploadRect {display: inline-block;height: 0.9em;vertical-align: middle;width: 20px;}.uploadRect span {background-color: #999;display: inline-block;height: 100%;vertical-align: top;}.SimpleUploadsTmpWrapper .uploadCancel { background-color: #333333;border-radius: 0.5em;color: #FFFFFF;cursor: pointer !important;display: inline-block;height: 1em;line-height: 0.8em;margin-left: 4px;padding-left: 0.18em;pointer-events: auto;position: relative; text-decoration:none; top: -2px;width: 0.7em;}.SimpleUploadsTmpWrapper span uploadCancel { width:1em; padding-left:0}";
    }

    function b(b, c, d, f) {
        if (B) {
            alert("Please, wait to finish the current upload");
        } else {
            A = !c;
            v = b;
            if (typeof FormData == "undefined") {
                var g = document.getElementById("simpleUploadsTarget");
                if (!g) {
                    g = document.createElement("iframe");
                    g.style.display = "none";
                    g.id = "simpleUploadsTarget";
                    document.body.appendChild(g);
                }
                E = d;
                F = f;
                J = c;
                d = b._.simpleuploadsFormUploadFn;
                f = b._.simpleuploadsFormInitFn;
                if (!d) {
                    b._.simpleuploadsFormUploadFn = d = CKEDITOR.tools.addFunction(e, b);
                    b._.simpleuploadsFormInitFn = f = CKEDITOR.tools.addFunction(function() {
                        window.setTimeout(function() {
                            var a = document.getElementById("simpleUploadsTarget").contentWindow.document.getElementById("upload");
                            a.onchange = function() {
                                var a = {
                                    name: this.value,
                                    url: this.form.action,
                                    context: E,
                                    id: "IEUpload",
                                    requiresImage: J
                                };
                                var b = a.name.match(/\\([^\\]*)$/);
                                if (b) {
                                    a.name = b[1];
                                }
                                if (typeof v.fire("simpleuploads.startUpload", a) != "boolean") {
                                    if (a.requiresImage && !CKEDITOR.plugins.simpleuploads.isImageExtension(v, a.name)) {
                                        alert(v.lang.simpleuploads.nonImageExtension);
                                    } else {
                                        if (F) {
                                            if (F.start) {
                                                F.start(a);
                                            }
                                        }
                                        B = this.value;
                                        this.form.action = a.url;
                                        if (a.extraFields) {
                                            a = a.extraFields;
                                            b = this.ownerDocument;
                                            var c;
                                            for (c in a) {
                                                if (a.hasOwnProperty(c)) {
                                                    var d = b.createElement("input");
                                                    d.type = "hidden";
                                                    d.name = c;
                                                    d.value = a[c];
                                                    this.form.appendChild(d);
                                                }
                                            }
                                        }
                                        this.form.submit();
                                    }
                                }
                            };
                            a.click();
                        }, 100);
                    }, b);
                    b.on("destroy", function() {
                        CKEDITOR.tools.removeFunction(this._.simpleuploadsFormUploadFn);
                        CKEDITOR.tools.removeFunction(this._.simpleuploadsFormInitFn);
                    });
                }
                b = 'document.open(); document.write("' + ("<form method='post' enctype='multipart/form-data' action='" + a(b, d, c) + "'><input type='file' name='upload' id='upload'></form>") + '");document.close();window.parent.CKEDITOR.tools.callFunction(' + f + ");";
                g.src = "javascript:void(function(){" + encodeURIComponent(b) + "}())";
                g.onreadystatechange = function() {
                    if (g.readyState == "complete") {
                        window.setTimeout(function() {
                            if (B) {
                                alert("The file upload has failed");
                                B = null;
                            }
                        }, 100);
                    }
                };
                y = null;
            } else {
                c = {
                    context: d,
                    callback: f,
                    requiresImage: c
                };
                if (!y) {
                    y = document.createElement("input");
                    y.type = "file";
                    y.style.overflow = "hidden";
                    y.style.width = "1px";
                    y.style.height = "1px";
                    y.style.opacity = 0.1;
                    y.multiple = "multiple";
                    y.position = "absolute";
                    y.zIndex = 1E3;
                    document.body.appendChild(y);
                    y.addEventListener("change", function() {
                        var a = y.files.length;
                        if (a) {
                            v.fire("saveSnapshot");
                            var b = 0;
                            for (; b < a; b++) {
                                var c = y.files[b];
                                var d = CKEDITOR.tools.extend({}, y.simpleUploadData);
                                d.file = c;
                                d.name = c.name;
                                d.id = CKEDITOR.plugins.simpleuploads.getTimeStampId();
                                d.forceLink = A;
                                d.mode = {
                                    type: "selectedFile",
                                    i: b,
                                    count: a
                                };
                                CKEDITOR.plugins.simpleuploads.insertSelectedFile(v, d);
                            }
                        }
                    });
                }
                y.value = "";
                y.simpleUploadData = c;
                if (CKEDITOR.env.webkit) {
                    var h = b.focusManager;
                    if (h && h.lock) {
                        h.lock();
                        setTimeout(function() {
                            h.unlock();
                        }, 500);
                    }
                }
                y.click();
            }
        }
    }

    function a(a, b, c) {
        c = c ? a.config.filebrowserImageUploadUrl : a.config.filebrowserUploadUrl;
        if (c == "base64") {
            return c;
        }
        var d = {};
        d.CKEditor = a.name;
        d.CKEditorFuncNum = b;
        d.langCode = a.langCode;
        return h(c, d);
    }

    function e(a, b) {
        if (typeof b == "string") {
            if (b && !a) {
                alert(b);
            }
        }
        var c = v;
        c.fire("simpleuploads.endUpload", {
            name: B,
            ok: !!a
        });
        if (F) {
            F.upload(a, b, {
                context: E
            });
            F = B = null;
        } else {
            if (a) {
                var d;
                var e;
                if (A) {
                    d = new CKEDITOR.dom.element("a", c.document);
                    d.setText(a.match(/\/([^\/]+)$/)[1]);
                    e = "href";
                } else {
                    d = new CKEDITOR.dom.element("img", c.document);
                    e = "src";
                    d.on("load", function(a) {
                        a.removeListener();
                        d.removeListener("error", i);
                        d.setAttribute("width", d.$.width);
                        d.setAttribute("height", d.$.height);
                        c.fire("simpleuploads.finishedUpload", {
                            name: B,
                            element: d
                        });
                    });
                    d.on("error", i, null, d);
                }
                d.setAttribute(e, a);
                d.data("cke-saved-" + e, a);
                c.insertElement(d);
                if (A) {
                    v.fire("simpleuploads.finishedUpload", {
                        name: B,
                        element: d
                    });
                }
            }
            B = null;
        }
        E = null;
    }

    function h(a, b) {
        var c = [];
        if (b) {
            var d;
            for (d in b) {
                c.push(d + "=" + encodeURIComponent(b[d]));
            }
        } else {
            return a;
        }
        return a + (a.indexOf("?") != -1 ? "&" : "?") + c.join("&");
    }

    function k(a) {
        a = a.data.$.dataTransfer;
        return !a || !a.types ? false : a.types.contains && (a.types.contains("Files") && !a.types.contains("text/html")) || a.types.indexOf && a.types.indexOf("Files") != -1 ? true : false;
    }

    function g(a, b, c, d, e) {
        if (d.$.nodeName.toLowerCase() == "span") {
            var f;
            if (b.originalNode) {
                f = b.originalNode.cloneNode(true);
                f.removeAttribute("width");
                f.removeAttribute("height");
                f.style.width = "";
                f.style.height = "";
                f = new CKEDITOR.dom.element(f);
            } else {
                f = new CKEDITOR.dom.element("img", c.document);
            }
            f.data("cke-saved-src", a);
            f.setAttribute("src", a);
            f.on("load", function(a) {
                a.removeListener();
                f.removeListener("error", i);
                j(f, c, d, b.name);
            });
            f.on("error", i, null, d);
            d.data("cke-real-element-type", "img");
            d.data("cke-realelement", encodeURIComponent(f.getOuterHtml()));
            d.data("cke-real-node-type", CKEDITOR.NODE_ELEMENT);
        } else {
            if (b.originalNode) {
                var g = b.originalNode.cloneNode(true);
                d.$.parentNode.replaceChild(g, d.$);
                d = new CKEDITOR.dom.element(g);
            } else {
                d.removeAttribute("id");
                d.removeAttribute("class");
                d.removeAttribute("contentEditable");
                d.setHtml(d.getFirst().getHtml());
            }
            d.data("cke-saved-" + e, a);
            d.setAttribute(e, a);
            c.fire("simpleuploads.finishedUpload", {
                name: b.name,
                element: d
            });
        }
    }

    function i(a) {
        a.removeListener();
        alert("Failed to load the image with the provided URL: '" + a.sender.data("cke-saved-src") + "'");
        a.listenerData.remove();
    }

    function j(a, b, c, d) {
        if (a.$.naturalWidth === 0) {
            window.setTimeout(function() {
                j(a, b, c, d);
            }, 50);
        } else {
            a.replace(c);
            a.setAttribute("width", a.$.width);
            a.setAttribute("height", a.$.height);
            b.fire("simpleuploads.finishedUpload", {
                name: d,
                element: a
            });
            b.fire("updateSnapshot");
        }
    }

    function n(b, c) {
        var d = CKEDITOR.plugins.simpleuploads.isImageExtension(b, c.name);
        var e = "href";
        var f = false;
        if (!c.forceLink && d) {
            e = "src";
            f = true;
        }
        if (c.callback) {
            c.callback.setup(c);
        }
        if (!c.url) {
            c.url = a(b, 2, f);
        }
        if (c.requiresImage && !d) {
            alert(b.lang.simpleuploads.nonImageExtension);
            return null;
        }
        if (typeof b.fire("simpleuploads.startUpload", c) == "boolean") {
            return null;
        }
        if (c.url == "base64") {
            if (typeof c.file == "string") {
                setTimeout(function() {
                    g(fileUrl, c, b, el, e);
                }, 100);
            } else {
                var h = new FileReader;
                h.onload = function() {
                    var a = h.result;
                    var d = b.document.getById(c.id);
                    setTimeout(function() {
                        g(a, c, b, d, e);
                    }, 100);
                };
                h.readAsDataURL(c.file);
            }
            return {};
        }
        var i = new XMLHttpRequest;
        if (d = i.upload) {
            d.onprogress = function(a) {
                q(b, c.id, a);
            };
        }
        c.xhr = i;
        i.open("POST", c.url);
        i.onload = function() {
            var a = i.responseText.match(/\((?:"|')?\d+(?:"|')?,\s*("|')(.*?[^\\]?)\1(?:,\s*(.*?))?\s*\)\s*;?/);
            var d = a && a[2];
            var f = a && a[3];
            var h = c.id;
            var j = b.document.getById(h);
            if (f) {
                var k = f.match(/function\(\)\s*\{(.*)\}/);
                if (k) {
                    f = new Function(k[1]);
                } else {
                    k = f.substring(0, 1);
                    if (k == "'" || k == '"') {
                        f = f.substring(1, f.length - 1);
                    }
                }
            }
            q(b, h, null);
            b.fire("updateSnapshot");
            b.fire("simpleuploads.endUpload", {
                name: c.name,
                ok: !!d,
                xhr: i,
                data: c
            });
            if (i.status != 200) {
                if (i.status == 413) {
                    alert(b.lang.simpleuploads.fileTooBig);
                } else {
                    alert("Error posting the file to " + c.url + "\r\nResponse status: " + i.status);
                }
                if (window.console) {
                    console.log(i);
                }
            } else {
                if (d) {
                    d = d.replace(/\\'/g, "'");
                    try {
                        var l = JSON.parse('{"url":"' + d + '"}');
                        if (l && l.url) {
                            d = l.url;
                        }
                    } catch (m) {}
                }
                if (!a) {
                    f = "Error posting the file to " + c.url + "\r\nInvalid data returned (check console)";
                    if (window.console) {
                        console.log(i.responseText);
                    }
                }
            }
            if (c.callback) {
                if (!d) {
                    if (f) {
                        alert(f);
                    }
                }
                c.callback.upload(d, f, c);
            } else {
                if (j) {
                    if (d) {
                        g(d, c, b, j, e);
                    } else {
                        if (c.originalNode) {
                            j.$.parentNode.replaceChild(c.originalNode, j.$);
                        } else {
                            j.remove();
                        }
                        if (f) {
                            alert(f);
                        }
                    }
                    b.fire("updateSnapshot");
                }
            }
        };
        i.onerror = function(a) {
            alert("Error posting the file to " + c.url);
            if (window.console) {
                console.log(a);
            }
            if (a = b.document.getById(c.id)) {
                if (c.originalNode) {
                    a.$.parentNode.replaceChild(c.originalNode, a.$);
                } else {
                    a.remove();
                }
            }
            b.fire("updateSnapshot");
        };
        i.onabort = function() {
            if (c.callback) {
                c.callback.upload(null);
            } else {
                var a = b.document.getById(c.id);
                if (a) {
                    if (c.originalNode) {
                        a.$.parentNode.replaceChild(c.originalNode, a.$);
                    } else {
                        a.remove();
                    }
                }
                b.fire("updateSnapshot");
            }
        };
        i.withCredentials = true;
        return i;
    }

    function o(a, b) {
        if (!b.callback) {
            var c = CKEDITOR.plugins.simpleuploads.isImageExtension(a, b.name);
            var d = !a.config.simpleuploads_hideImageProgress;
            if (!b.forceLink && (c && d)) {
                c = l(b.file, b.id, a);
            } else {
                c = c && !b.forceLink ? new CKEDITOR.dom.element("span", a.document) : new CKEDITOR.dom.element("a", a.document);
                c.setAttribute("id", b.id);
                c.setAttribute("class", "SimpleUploadsTmpWrapper");
                c.setHtml("<span class='uploadName'>" + b.name + "</span> <span class='uploadRect'><span id='rect" + b.id + "'></span></span> <span id='text" + b.id + "' class='uploadText'> </span><span class='uploadCancel'>x</span>");
            }
            c.setAttribute("contentEditable", false);
            b.element = c;
        }
        c = n(a, b);
        if (!c) {
            b.result = b.result || "";
            return false;
        }
        if (!c.send) {
            return true;
        }
        if (b.callback) {
            if (b.callback.start) {
                b.callback.start(b);
            }
        }
        if (typeof b.file == "string") {
            var e = "-----------------------------1966284435497298061834782736";
            var f = b.name.match(/\.(\w+)$/)[1];
            e = e + ('\r\nContent-Disposition: form-data; name="upload"; filename="' + b.name + '"');
            e = e + ("\r\nContent-type: image/" + f) + ("\r\n\r\n" + window.atob(b.file.split(",")[1]));
            e = e + "\r\n-----------------------------1966284435497298061834782736";
            if (b.extraFields) {
                f = b.extraFields;
                var g;
                for (g in f) {
                    e = e + ('\r\nContent-Disposition: form-data; name="' + unescape(encodeURIComponent(g)).replace(/=/g, "\\=") + '"');
                    e = e + ("\r\n\r\n" + unescape(encodeURIComponent(f[g])));
                    e = e + "\r\n-----------------------------1966284435497298061834782736";
                }
            }
            e = e + "--";
            c.setRequestHeader("Content-Type", "multipart/form-data; boundary=---------------------------1966284435497298061834782736");
            g = new ArrayBuffer(e.length);
            g = new Uint8Array(g, 0);
            f = 0;
            for (; f < e.length; f++) {
                g[f] = e.charCodeAt(f) & 255;
            }
        } else {
            g = new FormData;
            g.append("upload", b.file, b.name);
            if (b.extraFields) {
                d = b.extraFields;
                for (f in d) {
                    if (d.hasOwnProperty(f)) {
                        g.append(f, d[f]);
                    }
                }
            }
            if (b.extraHeaders) {
                f = b.extraHeaders;
                for (e in f) {
                    if (f.hasOwnProperty(e)) {
                        c.setRequestHeader(e, f[e]);
                    }
                }
            }
        }
        c.send(g);
        return true;
    }

    function q(a, b, c) {
        if (a.document && a.document.$) {
            var d = (CKEDITOR.dialog.getCurrent() ? CKEDITOR : a).document.$;
            var e = d.getElementById("rect" + b);
            b = d.getElementById("text" + b);
            if (c) {
                if (!c.lengthComputable) {
                    return;
                }
                d = (100 * c.loaded / c.total).toFixed(2) + "%";
                a = (100 * c.loaded / c.total).toFixed() + "%";
            } else {
                a = a.lang.simpleuploads.processing;
                d = "100%";
            }
            if (e) {
                e.setAttribute("width", d);
                e.style.width = d;
                if (!c) {
                    if (e = e.parentNode) {
                        if (e.className == "uploadRect") {
                            e.parentNode.removeChild(e);
                        }
                    }
                }
            }
            if (b) {
                b.firstChild.nodeValue = a;
                if (!c) {
                    if (c = b.nextSibling) {
                        if (c.nodeName.toLowerCase() == "a") {
                            c.parentNode.removeChild(c);
                        }
                    }
                }
            }
        }
    }

    function l(a, b, c) {
        var d = new CKEDITOR.dom.element("span", c.document);
        var e = d.$;
        var f;
        var g = c.document.$;
        c = g.createElement("span");
        d.setAttribute("id", b);
        d.setAttribute("class", "SimpleUploadsTmpWrapper");
        var h = g.createElement("span");
        h.setAttribute("id", "text" + b);
        h.appendChild(g.createTextNode("0 %"));
        e.appendChild(c);
        c.appendChild(h);
        h = g.createElement("span");
        h.appendChild(g.createTextNode("x"));
        c.appendChild(h);
        if (typeof a != "string") {
            f = window.URL || window.webkitURL;
            if (!f || !f.revokeObjectURL) {
                return d;
            }
        }
        c = g.createElementNS("http://www.w3.org/2000/svg", "svg");
        c.setAttribute("id", "svg" + b);
        h = g.createElement("img");
        if (f) {
            h.onload = function() {
                if (this.onload) {
                    f.revokeObjectURL(this.src);
                    this.onload = null;
                }
                var a = g.getElementById("svg" + b);
                if (a) {
                    a.setAttribute("width", this.width + "px");
                    a.setAttribute("height", this.height + "px");
                }
                if (a = g.getElementById(b)) {
                    a.style.width = this.width + "px";
                }
            };
            h.src = f.createObjectURL(a);
        } else {
            h.src = a;
            h.onload = function() {
                this.onload = null;
                var a = g.getElementById("svg" + b);
                if (a) {
                    a.setAttribute("width", this.width + "px");
                    a.setAttribute("height", this.height + "px");
                }
            };
            c.setAttribute("width", h.width + "px");
            c.setAttribute("height", h.height + "px");
        }
        e.appendChild(c);
        e = g.createElementNS("http://www.w3.org/2000/svg", "filter");
        e.setAttribute("id", "SVGdesaturate");
        c.appendChild(e);
        h = g.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
        h.setAttribute("type", "saturate");
        h.setAttribute("values", "0");
        e.appendChild(h);
        e = g.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        e.setAttribute("id", "SVGprogress" + b);
        c.appendChild(e);
        h = g.createElementNS("http://www.w3.org/2000/svg", "rect");
        h.setAttribute("id", "rect" + b);
        h.setAttribute("width", "0");
        h.setAttribute("height", "100%");
        e.appendChild(h);
        var i = g.createElementNS("http://www.w3.org/2000/svg", "image");
        i.setAttribute("width", "100%");
        i.setAttribute("height", "100%");
        if (f) {
            i.setAttributeNS("http://www.w3.org/1999/xlink", "href", f.createObjectURL(a));
            var j = function() {
                f.revokeObjectURL(i.getAttributeNS("http://www.w3.org/1999/xlink", "href"));
                i.removeEventListener("load", j, false);
            };
            i.addEventListener("load", j, false);
        } else {
            i.setAttributeNS("http://www.w3.org/1999/xlink", "href", a);
        }
        a = i.cloneNode(true);
        i.setAttribute("filter", "url(#SVGdesaturate)");
        i.style.opacity = "0.5";
        c.appendChild(i);
        a.setAttribute("clip-path", "url(#SVGprogress" + b + ")");
        c.appendChild(a);
        return d;
    }

    function m(a, c, d, e) {
        if (e.type != "file") {
            var f = c.substr(0, 5) == "image";
            var g = e.filebrowser.target.split(":");
            var i = {
                setup: function(b) {
                    if (d.uploadUrl) {
                        if (f) {
                            b.requiresImage = true;
                        }
                        var c = {};
                        c.CKEditor = a.name;
                        c.CKEditorFuncNum = 2;
                        c.langCode = a.langCode;
                        b.url = h(d.uploadUrl, c);
                    }
                },
                start: function(a) {
                    var b = CKEDITOR.dialog.getCurrent();
                    b.showThrobber();
                    var c = b.throbber;
                    if (a.xhr) {
                        c.throbberTitle.setHtml("<span class='uploadName'>" + a.name + "</span> <span class='uploadRect'><span id='rect" + a.id + "'></span></span> <span id='text" + a.id + "' class='uploadText'> </span><a>x</a>");
                        var d = c.throbberCover;
                        var e = a.xhr;
                        if (d.timer) {
                            clearInterval(d.timer);
                            d.timer = null;
                        }
                        c.throbberParent.setStyle("display", "none");
                        c.throbberTitle.getLast().on("click", function() {
                            e.abort();
                        });
                        b.on("hide", function() {
                            if (e.readyState == 1) {
                                e.abort();
                            }
                        });
                    }
                    c.center();
                },
                upload: function(a, b, c) {
                    var e = CKEDITOR.dialog.getCurrent();
                    e.throbber.hide();
                    if (!(typeof b == "function" && b.call(c.context.sender) === false) && (!(d.onFileSelect && d.onFileSelect.call(c.context.sender, a, b) === false) && a)) {
                        e.getContentElement(g[0], g[1]).setValue(a);
                        e.selectPage(g[0]);
                    }
                }
            };
            if (e.filebrowser.action == "QuickUpload") {
                d.hasQuickUpload = true;
                d.onFileSelect = null;
                if (!a.config.simpleuploads_respectDialogUploads) {
                    e.label = f ? a.lang.simpleuploads.addImage : a.lang.simpleuploads.addFile;
                    e.onClick = function(c) {
                        b(a, f, c, i);
                        return false;
                    };
                    d.getContents(e["for"][0]).get(e["for"][1]).hidden = true;
                }
            } else {
                if (d.hasQuickUpload) {
                    return;
                }
                if (e.filebrowser.onSelect) {
                    d.onFileSelect = e.filebrowser.onSelect;
                }
            }
            if (a.plugins.fileDropHandler) {
                if (e.filebrowser.action == "QuickUpload") {
                    d.uploadUrl = e.filebrowser.url;
                }
                d.onShow = CKEDITOR.tools.override(d.onShow || function() {}, function(a) {
                    return function() {
                        if (typeof a == "function") {
                            a.call(this);
                        }
                        if (!(e.filebrowser.action != "QuickUpload" && d.hasQuickUpload) && !this.handleFileDrop) {
                            this.handleFileDrop = true;
                            this.getParentEditor().plugins.fileDropHandler.addTarget(this.parts.contents, i);
                        }
                    };
                });
            }
        }
    }

    function r(a, b, c, d) {
        var e;
        for (e in d) {
            var f = d[e];
            if (f) {
                if (f.type == "hbox" || (f.type == "vbox" || f.type == "fieldset")) {
                    r(a, b, c, f.children);
                }
                if (f.filebrowser) {
                    if (f.filebrowser.url) {
                        m(a, b, c, f);
                    }
                }
            }
        }
    }

    function t(a, b) {
        var c = a.document.getById(b.id);
        if (c) {
            var d = c.$.getElementsByTagName("a");
            if (!d || !d.length) {
                d = c.$.getElementsByTagName("span");
                if (!d || !d.length) {
                    return;
                }
            }
            c = 0;
            for (; c < d.length; c++) {
                var e = d[c];
                if (e.innerHTML == "x") {
                    e.className = "uploadCancel";
                    e.onclick = function() {
                        if (b.xhr) {
                            b.xhr.abort();
                        }
                    };
                }
            }
        }
    }

    function p(a) {
        var b = a.listenerData.editor;
        var c = a.listenerData.dialog;
        var d;
        var e;
        if (d = a.data && a.data.$.clipboardData || b.config.forcePasteAsPlainText && window.clipboardData) {
            if (CKEDITOR.env.gecko && (b.config.forcePasteAsPlainText && d.types.length === 0)) {
                b.on("beforePaste", function(a) {
                    a.removeListener();
                    a.data.type = "html";
                });
            } else {
                var f = d.items || d.files;
                if (f && f.length) {
                    if (f[0].kind) {
                        d = 0;
                        for (; d < f.length; d++) {
                            e = f[d];
                            if (e.kind == "string" && (e.type == "text/html" || e.type == "text/plain")) {
                                return;
                            }
                        }
                    }
                    d = 0;
                    for (; d < f.length; d++) {
                        e = f[d];
                        if (!(e.kind && e.kind != "file")) {
                            a.data.preventDefault();
                            var g = e.getAsFile ? e.getAsFile() : e;
                            if (CKEDITOR.env.ie || b.config.forcePasteAsPlainText) {
                                setTimeout(function() {
                                    u(g, a);
                                }, 100);
                            } else {
                                u(g, a);
                            }
                        }
                    }
                    if (c) {
                        if (a.data.$.defaultPrevented) {
                            c.hide();
                        }
                    }
                }
            }
        }
    }

    function u(a, b) {
        var c = b.listenerData.editor;
        var d = b.listenerData.dialog;
        var e = CKEDITOR.plugins.simpleuploads.getTimeStampId();
        CKEDITOR.plugins.simpleuploads.insertPastedFile(c, {
            context: b.data.$,
            name: a.name || e + ".png",
            file: a,
            forceLink: false,
            id: e,
            mode: {
                type: "pastedFile",
                dialog: d
            }
        });
    }

    function s(a) {
        var b = a.getFrameDocument();
        var c = b.getBody();
        if (!c || (!c.$ || c.$.contentEditable != "true" && b.$.designMode != "on")) {
            setTimeout(function() {
                s(a);
            }, 100);
        } else {
            c = CKEDITOR.dialog.getCurrent();
            b.on("paste", p, null, {
                dialog: c,
                editor: c.getParentEditor()
            });
        }
    }
    var x = {
        elements: {
            $: function(a) {
                a = a.attributes;
                if ((a && a["class"]) == "SimpleUploadsTmpWrapper") {
                    return false;
                }
            }
        }
    };
    var y;
    var v;
    var A;
    var B;
    var E;
    var F;
    var J;
    CKEDITOR.plugins.add("simpleuploads", {
        lang: ["en", "ar", "cs", "de", "es", "fr", "he", "hu", "it", "ja", "ko", "nl", "pl", "pt-br", "ru", "tr", "zh-cn"],
        onLoad: function() {
            if (CKEDITOR.addCss) {
                CKEDITOR.addCss(d(CKEDITOR.config));
            }
            var a = CKEDITOR.document.getHead().append("style");
            a.setAttribute("type", "text/css");
            var b = ".SimpleUploadsOverContainer {" + (CKEDITOR.config.simpleuploads_containerover || "box-shadow: 0 0 10px 1px #99DD99 !important;") + "} .SimpleUploadsOverDialog {" + (CKEDITOR.config.simpleuploads_dialogover || "box-shadow: 0 0 10px 4px #999999 inset !important;") + "} .SimpleUploadsOverCover {" + (CKEDITOR.config.simpleuploads_coverover || "box-shadow: 0 0 10px 4px #99DD99 !important;") + "} ";
            b = b + ".cke_throbber {margin: 0 auto; width: 100px;} .cke_throbber div {float: left; width: 8px; height: 9px; margin-left: 2px; margin-right: 2px; font-size: 1px;} .cke_throbber .cke_throbber_1 {background-color: #737357;} .cke_throbber .cke_throbber_2 {background-color: #8f8f73;} .cke_throbber .cke_throbber_3 {background-color: #abab8f;} .cke_throbber .cke_throbber_4 {background-color: #c7c7ab;} .cke_throbber .cke_throbber_5 {background-color: #e3e3c7;} .uploadRect {display: inline-block;height: 11px;vertical-align: middle;width: 50px;} .uploadRect span {background-color: #999;display: inline-block;height: 100%;vertical-align: top;} .uploadName {display: inline-block;max-width: 180px;overflow: hidden;text-overflow: ellipsis;vertical-align: top;white-space: pre;} .uploadText {font-size:80%;} .cke_throbberMain a {cursor: pointer; font-size: 14px; font-weight:bold; padding: 4px 5px;position: absolute;right:0; text-decoration:none; top: -2px;} .cke_throbberMain {background-color: #FFF; border:1px solid #e5e5e5; padding:4px 14px 4px 4px; min-width:250px; position:absolute;}";
            if (CKEDITOR.env.ie && CKEDITOR.env.version < 11) {
                a.$.styleSheet.cssText = b;
            } else {
                a.$.innerHTML = b;
            }
        },
        init: function(a) {
            var e = a.config;
            if (typeof e.simpleuploads_imageExtensions == "undefined") {
                e.simpleuploads_imageExtensions = "jpe?g|gif|png";
            }
            if (a.addCss) {
                a.addCss(d(e));
            }
            if (!e.filebrowserImageUploadUrl) {
                e.filebrowserImageUploadUrl = e.filebrowserUploadUrl;
            }
            if (!e.filebrowserUploadUrl && !e.filebrowserImageUploadUrl) {
                if (window.console && console.log) {
                    console.log("The editor is missing the 'config.filebrowserUploadUrl' entry to know the url that will handle uploaded files.\r\nIt should handle the posted file as shown in Example 3: http://docs.cksource.com/CKEditor_3.x/Developers_Guide/File_Browser_%28Uploader%29/Custom_File_Browser#Example_3\r\nMore info: http://alfonsoml.blogspot.com/2009/12/using-your-own-uploader-in-ckeditor.html");
                    console[console.warn ? "warn" : "log"]("The 'SimpleUploads' plugin now is disabled.");
                }
            } else {
                if (!(e.filebrowserImageUploadUrl == "base64" && typeof FormData == "undefined")) {
                    if (a.addFeature) {
                        a.addFeature({
                            allowedContent: "img[!src,width,height];a[!href];span[id](SimpleUploadsTmpWrapper);"
                        });
                    }
                    CKEDITOR.dialog.prototype.showThrobber = function() {
                        if (!this.throbber) {
                            this.throbber = {
                                update: function() {
                                    var a = this.throbberParent.$;
                                    var b = a.childNodes;
                                    a = a.lastChild.className;
                                    var c = b.length - 1;
                                    for (; c > 0; c--) {
                                        b[c].className = b[c - 1].className;
                                    }
                                    b[0].className = a;
                                },
                                create: function(a) {
                                    if (!this.throbberCover) {
                                        var b = CKEDITOR.dom.element.createFromHtml('<div style="background-color:rgba(255,255,255,0.95);width:100%;height:100%;top:0;left:0; position:absolute; visibility:none;z-index:100;"></div>');
                                        a.parts.close.setStyle("z-index", 101);
                                        if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
                                            b.setStyle("zoom", 1);
                                            b.setStyle("filter", "progid:DXImageTransform.Microsoft.gradient(startColorstr=#EEFFFFFF,endColorstr=#EEFFFFFF)");
                                        }
                                        b.appendTo(a.parts.dialog);
                                        this.throbberCover = b;
                                        var c = new CKEDITOR.dom.element("div");
                                        this.mainThrobber = c;
                                        var d = new CKEDITOR.dom.element("div");
                                        this.throbberParent = d;
                                        var e = new CKEDITOR.dom.element("div");
                                        this.throbberTitle = e;
                                        b.append(c).addClass("cke_throbberMain");
                                        c.append(e).addClass("cke_throbberTitle");
                                        c.append(d).addClass("cke_throbber");
                                        b = [1, 2, 3, 4, 5, 4, 3, 2];
                                        for (; b.length > 0;) {
                                            d.append(new CKEDITOR.dom.element("div")).addClass("cke_throbber_" + b.shift());
                                        }
                                        this.center();
                                        a.on("hide", this.hide, this);
                                    }
                                },
                                center: function() {
                                    var a = this.mainThrobber;
                                    var b = this.throbberCover;
                                    var c = (b.$.offsetHeight - a.$.offsetHeight) / 2;
                                    a.setStyle("left", ((b.$.offsetWidth - a.$.offsetWidth) / 2).toFixed() + "px");
                                    a.setStyle("top", c.toFixed() + "px");
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
                    a.on("simpleuploads.startUpload", function(a) {
                        var b = a.editor;
                        var c = b.config;
                        var d = a.data && a.data.file;
                        if (c.simpleuploads_maxFileSize && (d && (d.size && d.size > c.simpleuploads_maxFileSize))) {
                            alert(b.lang.simpleuploads.fileTooBig);
                            a.cancel();
                        }
                        d = a.data.name;
                        if (c.simpleuploads_invalidExtensions && RegExp(".(?:" + c.simpleuploads_invalidExtensions + ")$", "i").test(d)) {
                            alert(b.lang.simpleuploads.invalidExtension);
                            a.cancel();
                        }
                        if (c.simpleuploads_acceptedExtensions && !RegExp(".(?:" + c.simpleuploads_acceptedExtensions + ")$", "i").test(d)) {
                            alert(b.lang.simpleuploads.nonAcceptedExtension.replace("%0", c.simpleuploads_acceptedExtensions));
                            a.cancel();
                        }
                    });
                    a.on("simpleuploads.startUpload", function(a) {
                        var b = a.data;
                        var c = a.editor;
                        if (!b.image && (!b.forceLink && (CKEDITOR.plugins.simpleuploads.isImageExtension(c, b.name) && (b.mode && (b.mode.type && c.hasListeners("simpleuploads.localImageReady")))))) {
                            a.cancel();
                            if (b.mode.type == "base64paste") {
                                var d = CKEDITOR.plugins.simpleuploads.getTimeStampId();
                                b.result = "<span id='" + d + "' class='SimpleUploadsTmpWrapper' style='display:none'>&nbsp;</span>";
                                b.mode.id = d;
                            }
                            var e = new Image;
                            e.onload = function() {
                                var d = CKEDITOR.tools.extend({}, b);
                                d.image = e;
                                if (typeof c.fire("simpleuploads.localImageReady", d) != "boolean") {
                                    CKEDITOR.plugins.simpleuploads.insertProcessedFile(a.editor, d);
                                }
                            };
                            e.src = typeof b.file == "string" ? b.file : URL.createObjectURL(b.file);
                        }
                    });
                    if (e.simpleuploads_convertBmp) {
                        a.on("simpleuploads.localImageReady", c);
                    }
                    if (e.simpleuploads_maximumDimensions) {
                        a.on("simpleuploads.localImageReady", f);
                    }
                    a.on("simpleuploads.finishedUpload", function(b) {
                        if (a.widgets && a.plugins.image2) {
                            b = b.data.element;
                            if (b.getName() == "img") {
                                var c = a.widgets.getByElement(b);
                                if (c) {
                                    c.data.src = b.data("cke-saved-src");
                                    c.data.width = b.$.width;
                                    c.data.height = b.$.height;
                                } else {
                                    a.widgets.initOn(b, "image2");
                                    a.widgets.initOn(b, "image");
                                }
                            }
                        }
                    });
                    a.on("paste", function(b) {
                        var c = b.data;
                        if (c = c.html || c.type && (c.type == "html" && c.dataValue)) {
                            if (CKEDITOR.env.webkit && c.indexOf("webkit-fake-url") > 0) {
                                alert("Sorry, the images pasted with Safari aren't usable");
                                window.open("https://bugs.webkit.org/show_bug.cgi?id=49141");
                                c = c.replace(/<img src="webkit-fake-url:.*?">/g, "");
                            }
                            if (e.filebrowserImageUploadUrl != "base64") {
                                c = c.replace(/<img(.*?) src="data:image\/.{3,4};base64,.*?"(.*?)>/g, function(b) {
                                    if (!a.config.filebrowserImageUploadUrl) {
                                        return "";
                                    }
                                    var c = b.match(/"(data:image\/(.{3,4});base64,.*?)"/);
                                    var d = c[1];
                                    c = c[2].toLowerCase();
                                    var e = CKEDITOR.plugins.simpleuploads.getTimeStampId();
                                    if (d.length < 128) {
                                        return b;
                                    }
                                    if (c == "jpeg") {
                                        c = "jpg";
                                    }
                                    var f = {
                                        context: "pastedimage",
                                        name: e + "." + c,
                                        id: e,
                                        forceLink: false,
                                        file: d,
                                        mode: {
                                            type: "base64paste"
                                        }
                                    };
                                    if (!o(a, f)) {
                                        return f.result;
                                    }
                                    b = f.element;
                                    var g = b.$.innerHTML;
                                    b.$.innerHTML = "&nbsp;";
                                    a.on("afterPaste", function(b) {
                                        b.removeListener();
                                        if (b = a.document.$.getElementById(e)) {
                                            b.innerHTML = g;
                                            t(a, f);
                                        }
                                    });
                                    return b.getOuterHtml();
                                });
                            }
                            if (b.data.html) {
                                b.data.html = c;
                            } else {
                                b.data.dataValue = c;
                            }
                        }
                    });
                    var g = function(b) {
                        if (a.mode == "wysiwyg") {
                            var c = a.document;
                            if (a.editable) {
                                c = a.editable();
                            }
                            if (c.$.querySelector(".SimpleUploadsTmpWrapper")) {
                                b = b.name.substr(5).toLowerCase();
                                if (b == "redo") {
                                    if (a.getCommand(b).state == CKEDITOR.TRISTATE_DISABLED) {
                                        b = "undo";
                                    }
                                }
                                a.execCommand(b);
                            }
                        }
                    };
                    var h = a.getCommand("undo");
                    if (h) {
                        h.on("afterUndo", g);
                    }
                    if (h = a.getCommand("redo")) {
                        a.getCommand("redo").on("afterRedo", g);
                    }
                    a.on("afterUndo", g);
                    a.on("afterRedo", g);
                    a.addCommand("addFile", {
                        exec: function(a) {
                            b(a, false, this);
                        }
                    });
                    a.ui.addButton("addFile", {
                        label: a.lang.simpleuploads.addFile,
                        command: "addFile",
                        toolbar: "insert",
                        allowedContent: "a[!href];span[id](SimpleUploadsTmpWrapper);",
                        requiredContent: "a[!href]"
                    });
                    a.addCommand("addImage", {
                        exec: function(a) {
                            b(a, true, this);
                        }
                    });
                    if (a.ui.addButton) {
                        a.ui.addButton("addImage", {
                            label: a.lang.simpleuploads.addImage,
                            command: "addImage",
                            toolbar: "insert",
                            allowedContent: "img[!src,width,height];span[id](SimpleUploadsTmpWrapper);",
                            requiredContent: "img[!src]"
                        });
                    }
                    if (typeof FormData != "undefined") {
                        var i;
                        var j;
                        var l;
                        var m = -1;
                        var n;
                        var q;
                        var r;
                        var s = -1;
                        var u;
                        var v;
                        var x;
                        var y = function() {
                            var b = CKEDITOR.dialog.getCurrent();
                            if (b) {
                                b.parts.title.getParent().removeClass("SimpleUploadsOverCover");
                            } else {
                                a.container.removeClass("SimpleUploadsOverContainer");
                            }
                        };
                        a.on("destroy", function() {
                            CKEDITOR.removeListener("simpleuploads.droppedFile", y);
                            CKEDITOR.document.removeListener("dragenter", B);
                            CKEDITOR.document.removeListener("dragleave", E);
                            A();
                        });
                        var A = function() {
                            if (i && i.removeListener) {
                                l.removeListener("paste", p);
                                i.removeListener("dragenter", J);
                                i.removeListener("dragleave", Y);
                                i.removeListener("dragover", V);
                                i.removeListener("drop", F);
                                j = i = l = null;
                            }
                        };
                        CKEDITOR.on("simpleuploads.droppedFile", y);
                        var B = function(b) {
                            if (s == -1 && k(b)) {
                                if (b = CKEDITOR.dialog.getCurrent()) {
                                    if (!b.handleFileDrop) {
                                        return;
                                    }
                                    b.parts.title.getParent().addClass("SimpleUploadsOverCover");
                                } else {
                                    if (!a.readOnly) {
                                        a.container.addClass("SimpleUploadsOverContainer");
                                    }
                                }
                                u = s = 0;
                                v = CKEDITOR.document.$.body.parentNode.clientWidth;
                                x = CKEDITOR.document.$.body.parentNode.clientHeight;
                            }
                        };
                        var E = function(a) {
                            if (s != -1) {
                                a = a.data.$;
                                if (a.clientX <= s || (a.clientY <= u || (a.clientX >= v || a.clientY >= x))) {
                                    y();
                                    s = -1;
                                }
                            }
                        };
                        CKEDITOR.document.on("dragenter", B);
                        CKEDITOR.document.on("dragleave", E);
                        var F = function(b) {
                            j.removeClass("SimpleUploadsOverEditor");
                            m = -1;
                            CKEDITOR.fire("simpleuploads.droppedFile");
                            s = -1;
                            if (a.readOnly) {
                                b.data.preventDefault();
                                return false;
                            }
                            var c = b.data.$;
                            var d = c.dataTransfer;
                            if (d && (d.files && d.files.length > 0)) {
                                a.fire("saveSnapshot");
                                b.data.preventDefault();
                                b = {
                                    ev: c,
                                    range: false,
                                    count: d.files.length,
                                    rangeParent: c.rangeParent,
                                    rangeOffset: c.rangeOffset
                                };
                                var e = 0;
                                for (; e < d.files.length; e++) {
                                    var f = d.files[e];
                                    var g = CKEDITOR.tools.getNextId();
                                    CKEDITOR.plugins.simpleuploads.insertDroppedFile(a, {
                                        context: c,
                                        name: f.name,
                                        file: f,
                                        forceLink: c.shiftKey,
                                        id: g,
                                        mode: {
                                            type: "droppedFile",
                                            dropLocation: b
                                        }
                                    });
                                }
                            }
                        };
                        var J = function(b) {
                            if (m == -1 && k(b)) {
                                if (!a.readOnly) {
                                    j.addClass("SimpleUploadsOverEditor");
                                }
                                b = j.$.getBoundingClientRect();
                                m = b.left;
                                n = b.top;
                                q = m + j.$.clientWidth;
                                r = n + j.$.clientHeight;
                            }
                        };
                        var Y = function(a) {
                            if (m != -1) {
                                a = a.data.$;
                                if (a.clientX <= m || (a.clientY <= n || (a.clientX >= q || a.clientY >= r))) {
                                    j.removeClass("SimpleUploadsOverEditor");
                                    m = -1;
                                }
                            }
                        };
                        var V = function(b) {
                            if (m != -1) {
                                if (a.readOnly) {
                                    b.data.$.dataTransfer.dropEffect = "none";
                                    b.data.preventDefault();
                                    return false;
                                }
                                b.data.$.dataTransfer.dropEffect = "copy";
                                if (!CKEDITOR.env.gecko) {
                                    b.data.preventDefault();
                                }
                            }
                        };
                        a.on("contentDom", function() {
                            i = a.document;
                            j = i.getBody().getParent();
                            if (a.elementMode == 3) {
                                j = i = a.element;
                            }
                            if (a.elementMode == 1 && "divarea" in a.plugins) {
                                j = i = a.editable();
                            }
                            l = a.editable ? a.editable() : i;
                            if (CKEDITOR.env.ie && (CKEDITOR.env.version >= 11 && (a.config.forcePasteAsPlainText && a.editable().isInline()))) {
                                l.attachListener(l, "beforepaste", function() {
                                    a.document.on("paste", function(a) {
                                        a.removeListener();
                                        p(a);
                                    }, null, {
                                        editor: a
                                    });
                                });
                            } else {
                                l.on("paste", p, null, {
                                    editor: a
                                }, 8);
                            }
                            i.on("dragenter", J);
                            i.on("dragleave", Y);
                            if (!CKEDITOR.env.gecko) {
                                i.on("dragover", V);
                            }
                            i.on("drop", F);
                        });
                        a.on("contentDomUnload", A);
                        a.plugins.fileDropHandler = {
                            addTarget: function(b, c) {
                                b.on("dragenter", function(a) {
                                    if (m == -1 && k(a)) {
                                        b.addClass("SimpleUploadsOverDialog");
                                        a = b.$.getBoundingClientRect();
                                        m = a.left;
                                        n = a.top;
                                        q = m + b.$.clientWidth;
                                        r = n + b.$.clientHeight;
                                    }
                                });
                                b.on("dragleave", function(a) {
                                    if (m != -1) {
                                        a = a.data.$;
                                        if (a.clientX <= m || (a.clientY <= n || (a.clientX >= q || a.clientY >= r))) {
                                            b.removeClass("SimpleUploadsOverDialog");
                                            m = -1;
                                        }
                                    }
                                });
                                b.on("dragover", function(a) {
                                    if (m != -1) {
                                        a.data.$.dataTransfer.dropEffect = "copy";
                                        a.data.preventDefault();
                                    }
                                });
                                b.on("drop", function(d) {
                                    b.removeClass("SimpleUploadsOverDialog");
                                    m = -1;
                                    CKEDITOR.fire("simpleuploads.droppedFile");
                                    s = -1;
                                    var e = d.data.$;
                                    var f = e.dataTransfer;
                                    if (f && (f.files && f.files.length > 0)) {
                                        d.data.preventDefault();
                                        d = 0;
                                        for (; d < 1; d++) {
                                            var g = f.files[d];
                                            g = {
                                                context: e,
                                                name: g.name,
                                                file: g,
                                                id: CKEDITOR.tools.getNextId(),
                                                forceLink: false,
                                                callback: c,
                                                mode: {
                                                    type: "callback"
                                                }
                                            };
                                            CKEDITOR.plugins.simpleuploads.processFileWithCallback(a, g);
                                        }
                                    }
                                });
                            }
                        };
                    }
                }
            }
        },
        afterInit: function(a) {
            if (a = (a = a.dataProcessor) && a.htmlFilter) {
                a.addRules(x, {
                    applyToAll: true
                });
            }
        }
    });
    CKEDITOR.plugins.simpleuploads = {
        getTimeStampId: function() {
            var a = 0;
            return function() {
                a++;
                return (new Date).toISOString().replace(/\..*/, "").replace(/\D/g, "_") + a;
            };
        }(),
        isImageExtension: function(a, b) {
            return !a.config.simpleuploads_imageExtensions ? false : RegExp(".(?:" + a.config.simpleuploads_imageExtensions + ")$", "i").test(b);
        },
        insertProcessedFile: function(a, b) {
            b.element = null;
            b.id = this.getTimeStampId();
            switch (b.mode.type) {
                case "selectedFile":
                    var c = this;
                    window.setTimeout(function() {
                        c.insertSelectedFile(a, b);
                    }, 50);
                    break;
                case "pastedFile":
                    this.insertPastedFile(a, b);
                    break;
                case "callback":
                    c = this;
                    window.setTimeout(function() {
                        c.processFileWithCallback(a, b);
                    }, 50);
                    break;
                case "droppedFile":
                    this.insertDroppedFile(a, b);
                    break;
                case "base64paste":
                    this.insertBase64File(a, b);
                    break;
                default:
                    alert("Error, no valid type", b.mode);
            }
        },
        insertSelectedFile: function(a, b) {
            var c = b.mode;
            var d = c.i;
            var e = c.count;
            if (o(a, b)) {
                if (c = b.element) {
                    if (e == 1) {
                        var f = a.getSelection();
                        e = f.getSelectedElement();
                        var g;
                        if (e && (e.getName() == "img" && c.getName() == "span")) {
                            g = e.$;
                        }
                        if (c.getName() == "a") {
                            var h = e;
                            var i = f.getRanges();
                            f = i && i[0];
                            if (!h && (i && i.length == 1)) {
                                h = f.startContainer.$;
                                if (h.nodeType == document.TEXT_NODE) {
                                    h = h.parentNode;
                                }
                            }
                            for (; h && (h.nodeType == document.ELEMENT_NODE && h.nodeName.toLowerCase() != "a");) {
                                h = h.parentNode;
                            }
                            if (h) {
                                if (h.nodeName && h.nodeName.toLowerCase() == "a") {
                                    g = h;
                                }
                            }
                            if (!g && (f && (e || !f.collapsed))) {
                                g = new CKEDITOR.style({
                                    element: "a",
                                    attributes: {
                                        href: "#"
                                    }
                                });
                                g.type = CKEDITOR.STYLE_INLINE;
                                g.applyToRange(f);
                                h = f.startContainer.$;
                                if (h.nodeType == document.TEXT_NODE) {
                                    h = h.parentNode;
                                }
                                g = h;
                            }
                        }
                        if (g) {
                            g.parentNode.replaceChild(c.$, g);
                            b.originalNode = g;
                            a.fire("saveSnapshot");
                            return;
                        }
                    }
                    if (d > 0) {
                        if (c.getName() == "a") {
                            a.insertHtml("&nbsp;");
                        }
                    }
                    a.insertElement(c);
                    t(a, b);
                }
            }
        },
        insertPastedFile: function(a, b) {
            if (o(a, b)) {
                var c = b.element;
                if (b.mode.dialog) {
                    a.fire("updateSnapshot");
                    a.insertElement(c);
                    a.fire("updateSnapshot");
                } else {
                    var d = function() {
                        if (a.getSelection().getRanges().length) {
                            if (a.editable().$.querySelector("#cke_pastebin")) {
                                window.setTimeout(d, 0);
                            } else {
                                a.fire("updateSnapshot");
                                a.insertElement(c);
                                a.fire("updateSnapshot");
                                t(a, b);
                            }
                        } else {
                            window.setTimeout(d, 0);
                        }
                    };
                    window.setTimeout(d, 0);
                }
            }
        },
        processFileWithCallback: function(a, b) {
            o(a, b);
        },
        insertDroppedFile: function(a, b) {
            if (o(a, b)) {
                var c = b.element;
                var d = b.mode.dropLocation;
                var e = d.range;
                var f = d.ev;
                var g = d.count;
                if (e) {
                    if (c.getName() == "a") {
                        if (e.pasteHTML) {
                            e.pasteHTML("&nbsp;");
                        } else {
                            e.insertNode(a.document.$.createTextNode(" "));
                        }
                    }
                }
                var h = f.target;
                if (!e) {
                    var i = a.document.$;
                    if (d.rangeParent) {
                        f = d.rangeParent;
                        var j = d.rangeOffset;
                        e = i.createRange();
                        e.setStart(f, j);
                        e.collapse(true);
                    } else {
                        if (document.caretRangeFromPoint) {
                            e = i.caretRangeFromPoint(f.clientX, f.clientY);
                        } else {
                            if (h.nodeName.toLowerCase() == "img") {
                                e = i.createRange();
                                e.selectNode(h);
                            } else {
                                if (document.body.createTextRange) {
                                    j = i.body.createTextRange();
                                    try {
                                        j.moveToPoint(f.clientX, f.clientY);
                                        e = j;
                                    } catch (k) {
                                        e = i.createRange();
                                        e.setStartAfter(i.body.lastChild);
                                        e.collapse(true);
                                    }
                                }
                            }
                        }
                    }
                    d.range = e;
                }
                i = c.getName();
                d = false;
                if (g == 1) {
                    if (h.nodeName.toLowerCase() == "img" && i == "span") {
                        h.parentNode.replaceChild(c.$, h);
                        b.originalNode = h;
                        d = true;
                    }
                    if (i == "a") {
                        if (e.startContainer) {
                            g = e.startContainer;
                            if (g.nodeType == document.TEXT_NODE) {
                                g = g.parentNode;
                            } else {
                                if (e.startOffset < g.childNodes.length) {
                                    g = g.childNodes[e.startOffset];
                                }
                            }
                        } else {
                            g = e.parentElement();
                        }
                        if (!g || h.nodeName.toLowerCase() == "img") {
                            g = h;
                        }
                        h = g;
                        for (; h && (h.nodeType == document.ELEMENT_NODE && h.nodeName.toLowerCase() != "a");) {
                            h = h.parentNode;
                        }
                        if (h && (h.nodeName && h.nodeName.toLowerCase() == "a")) {
                            h.parentNode.replaceChild(c.$, h);
                            b.originalNode = h;
                            d = true;
                        }
                        if (!d && g.nodeName.toLowerCase() == "img") {
                            h = g.ownerDocument.createElement("a");
                            h.href = "#";
                            g.parentNode.replaceChild(h, g);
                            h.appendChild(g);
                            h.parentNode.replaceChild(c.$, h);
                            b.originalNode = h;
                            d = true;
                        }
                    }
                }
                if (!d) {
                    if (e) {
                        if (e.pasteHTML) {
                            e.pasteHTML(c.$.outerHTML);
                        } else {
                            e.insertNode(c.$);
                        }
                    } else {
                        a.insertElement(c);
                    }
                }
                t(a, b);
                a.fire("saveSnapshot");
            }
        },
        insertBase64File: function(a, b) {
            delete b.result;
            var c = a.document.getById(b.mode.id);
            if (o(a, b)) {
                a.getSelection().selectElement(c);
                a.insertElement(b.element);
                t(a, b);
            } else {
                c.remove();
                if (b.result) {
                    a.insertHTML(b.result);
                }
            }
        }
    };
    if (CKEDITOR.skins) {
        CKEDITOR.plugins.setLang = CKEDITOR.tools.override(CKEDITOR.plugins.setLang, function(a) {
            return function(b, c, d) {
                if (b != "devtools" && typeof d[b] != "object") {
                    var e = {};
                    e[b] = d;
                    d = e;
                }
                a.call(this, b, c, d);
            };
        });
    }
    CKEDITOR.on("dialogDefinition", function(a) {
        if (a.editor.plugins.simpleuploads) {
            var b = a.data.definition;
            var c;
            for (c in b.contents) {
                var d = b.contents[c];
                if (d) {
                    r(a.editor, a.data.name, b, d.elements);
                }
            }
            if (a.data.name == "paste") {
                b.onShow = CKEDITOR.tools.override(b.onShow, function(a) {
                    return function() {
                        if (typeof a == "function") {
                            a.call(this);
                        }
                        s(this.getContentElement("general", "editing_area").getInputElement());
                    };
                });
            }
        }
    }, null, null, 30);
})();