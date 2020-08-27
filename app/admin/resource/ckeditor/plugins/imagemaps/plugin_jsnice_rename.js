(function() {
  if (!window.CKEDITOR || !window.CKEDITOR.dom) {
    if (!window.CKEDITOR) {
      window.CKEDITOR = function() {
        var optgroup = {
          timestamp : "E7LK",
          version : "4.4.2 DEV",
          revision : "0",
          rnd : Math.floor(900 * Math.random()) + 100,
          _ : {
            pending : []
          },
          status : "unloaded",
          basePath : function() {
            var path = window.CKEDITOR_BASEPATH || "";
            if (!path) {
              var codeSegments = document.getElementsByTagName("script");
              var i = 0;
              for (;i < codeSegments.length;i++) {
                var styleSheets = codeSegments[i].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);
                if (styleSheets) {
                  path = styleSheets[1];
                  break;
                }
              }
            }
            if (-1 == path.indexOf(":/")) {
              if ("//" != path.slice(0, 2)) {
                path = 0 === path.indexOf("/") ? location.href.match(/^.*?:\/\/[^\/]*/)[0] + path : location.href.match(/^[^\?]*\/(?:)/)[0] + path;
              }
            }
            if (!path) {
              throw'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
            }
            return path;
          }(),
          getUrl : function(resource) {
            if (-1 == resource.indexOf(":/")) {
              if (0 !== resource.indexOf("/")) {
                resource = this.basePath + resource;
              }
            }
            if (this.timestamp) {
              if ("/" != resource.charAt(resource.length - 1) && !/[&?]t=/.test(resource)) {
                resource += (0 <= resource.indexOf("?") ? "&" : "?") + "t=" + this.timestamp;
              }
            }
            return resource;
          },
          domReady : function() {
            function onReady() {
              try {
                if (document.addEventListener) {
                  document.removeEventListener("DOMContentLoaded", onReady, false);
                  executeCallbacks();
                } else {
                  if (document.attachEvent) {
                    if ("complete" === document.readyState) {
                      document.detachEvent("onreadystatechange", onReady);
                      executeCallbacks();
                    }
                  }
                }
              } catch (c) {
              }
            }
            function executeCallbacks() {
              var throttledUpdate;
              for (;throttledUpdate = arr.shift();) {
                throttledUpdate();
              }
            }
            var arr = [];
            return function(chunk) {
              arr.push(chunk);
              if ("complete" === document.readyState) {
                setTimeout(onReady, 1);
              }
              if (1 == arr.length) {
                if (document.addEventListener) {
                  document.addEventListener("DOMContentLoaded", onReady, false);
                  window.addEventListener("load", onReady, false);
                } else {
                  if (document.attachEvent) {
                    document.attachEvent("onreadystatechange", onReady);
                    window.attachEvent("onload", onReady);
                    chunk = false;
                    try {
                      chunk = !window.frameElement;
                    } catch (b) {
                    }
                    if (document.documentElement.doScroll && chunk) {
                      var scrollCheck = function() {
                        try {
                          document.documentElement.doScroll("left");
                        } catch (f) {
                          setTimeout(scrollCheck, 1);
                          return;
                        }
                        onReady();
                      };
                      scrollCheck();
                    }
                  }
                }
              }
            };
          }()
        };
        var Class = window.CKEDITOR_GETURL;
        if (Class) {
          var select = optgroup.getUrl;
          optgroup.getUrl = function(key) {
            return Class.call(optgroup, key) || select.call(optgroup, key);
          };
        }
        return optgroup;
      }();
    }
    if (!CKEDITOR.event) {
      CKEDITOR.event = function() {
      };
      CKEDITOR.event.implementOn = function(cache) {
        var data = CKEDITOR.event.prototype;
        var prop;
        for (prop in data) {
          if (cache[prop] == void 0) {
            cache[prop] = data[prop];
          }
        }
      };
      CKEDITOR.event.prototype = function() {
        function __indexOf(eventName) {
          var events = getPrivate(this);
          return events[eventName] || (events[eventName] = new eventEntry(eventName));
        }
        var getPrivate = function(obj) {
          obj = obj.getPrivate && obj.getPrivate() || (obj._ || (obj._ = {}));
          return obj.events || (obj.events = {});
        };
        var eventEntry = function(eventName) {
          this.name = eventName;
          this.listeners = [];
        };
        eventEntry.prototype = {
          getListenerIndex : function(fn) {
            var i = 0;
            var codeSegments = this.listeners;
            for (;i < codeSegments.length;i++) {
              if (codeSegments[i].fn == fn) {
                return i;
              }
            }
            return-1;
          }
        };
        return{
          define : function(key, descriptor) {
            var attributes = __indexOf.call(this, key);
            CKEDITOR.tools.extend(attributes, descriptor, true);
          },
          on : function(name, fn, optgroup, mayParseLabeledStatementInstead, expectedHashCode) {
            function listenerFirer(key, publisherData, stopFn, cancelFn) {
              key = {
                name : name,
                sender : this,
                editor : key,
                data : publisherData,
                listenerData : mayParseLabeledStatementInstead,
                stop : stopFn,
                cancel : cancelFn,
                removeListener : removeListener
              };
              return fn.call(optgroup, key) === false ? false : key.data;
            }
            function removeListener() {
              self.removeListener(name, fn);
            }
            var listeners = __indexOf.call(this, name);
            if (listeners.getListenerIndex(fn) < 0) {
              listeners = listeners.listeners;
              if (!optgroup) {
                optgroup = this;
              }
              if (isNaN(expectedHashCode)) {
                expectedHashCode = 10;
              }
              var self = this;
              listenerFirer.fn = fn;
              listenerFirer.priority = expectedHashCode;
              var i = listeners.length - 1;
              for (;i >= 0;i--) {
                if (listeners[i].priority <= expectedHashCode) {
                  listeners.splice(i + 1, 0, listenerFirer);
                  return{
                    removeListener : removeListener
                  };
                }
              }
              listeners.unshift(listenerFirer);
            }
            return{
              removeListener : removeListener
            };
          },
          once : function() {
            var matcherFunction = arguments[1];
            arguments[1] = function(e) {
              e.removeListener();
              return matcherFunction.apply(this, arguments);
            };
            return this.on.apply(this, arguments);
          },
          capture : function() {
            CKEDITOR.event.useCapture = 1;
            var retval = this.on.apply(this, arguments);
            CKEDITOR.event.useCapture = 0;
            return retval;
          },
          fire : function() {
            var n = 0;
            var duration = function() {
              n = 1;
            };
            var queuedFn = 0;
            var attachmentsmap = function() {
              queuedFn = 1;
            };
            return function(name, f, key) {
              var event = getPrivate(this)[name];
              name = n;
              var fn = queuedFn;
              n = queuedFn = 0;
              if (event) {
                var listeners = event.listeners;
                if (listeners.length) {
                  listeners = listeners.slice(0);
                  var data;
                  var i = 0;
                  for (;i < listeners.length;i++) {
                    if (event.errorProof) {
                      try {
                        data = listeners[i].call(this, key, f, duration, attachmentsmap);
                      } catch (m) {
                      }
                    } else {
                      data = listeners[i].call(this, key, f, duration, attachmentsmap);
                    }
                    if (data === false) {
                      queuedFn = 1;
                    } else {
                      if (typeof data != "undefined") {
                        f = data;
                      }
                    }
                    if (n || queuedFn) {
                      break;
                    }
                  }
                }
              }
              f = queuedFn ? false : typeof f == "undefined" ? true : f;
              n = name;
              queuedFn = fn;
              return f;
            };
          }(),
          fireOnce : function(eventName, ret, linerNr) {
            ret = this.fire(eventName, ret, linerNr);
            delete getPrivate(this)[eventName];
            return ret;
          },
          removeListener : function(name, listener) {
            var event = getPrivate(this)[name];
            if (event) {
              var i = event.getListenerIndex(listener);
              if (i >= 0) {
                event.listeners.splice(i, 1);
              }
            }
          },
          removeAllListeners : function() {
            var map = getPrivate(this);
            var letter;
            for (letter in map) {
              delete map[letter];
            }
          },
          hasListeners : function(event) {
            return(event = getPrivate(this)[event]) && event.listeners.length > 0;
          }
        };
      }();
    }
    if (!CKEDITOR.editor) {
      CKEDITOR.editor = function() {
        CKEDITOR._.pending.push([this, arguments]);
        CKEDITOR.event.call(this);
      };
      CKEDITOR.editor.prototype.fire = function(name, expectedHashCode) {
        if (name in {
          instanceReady : 1,
          loaded : 1
        }) {
          this[name] = true;
        }
        return CKEDITOR.event.prototype.fire.call(this, name, expectedHashCode, this);
      };
      CKEDITOR.editor.prototype.fireOnce = function(name, hash) {
        if (name in {
          instanceReady : 1,
          loaded : 1
        }) {
          this[name] = true;
        }
        return CKEDITOR.event.prototype.fireOnce.call(this, name, hash, this);
      };
      CKEDITOR.event.implementOn(CKEDITOR.editor.prototype);
    }
    if (!CKEDITOR.env) {
      CKEDITOR.env = function() {
        var agent = navigator.userAgent.toLowerCase();
        var env = {
          ie : agent.indexOf("trident/") > -1,
          webkit : agent.indexOf(" applewebkit/") > -1,
          air : agent.indexOf(" adobeair/") > -1,
          mac : agent.indexOf("macintosh") > -1,
          quirks : document.compatMode == "BackCompat" && (!document.documentMode || document.documentMode < 10),
          mobile : agent.indexOf("mobile") > -1,
          iOS : /(ipad|iphone|ipod)/.test(agent),
          isCustomDomain : function() {
            if (!this.ie) {
              return false;
            }
            var domain = document.domain;
            var hostname = window.location.hostname;
            return domain != hostname && domain != "[" + hostname + "]";
          },
          secure : location.protocol == "https:"
        };
        env.gecko = navigator.product == "Gecko" && (!env.webkit && !env.ie);
        if (env.webkit) {
          if (agent.indexOf("chrome") > -1) {
            env.chrome = true;
          } else {
            env.safari = true;
          }
        }
        var version = 0;
        if (env.ie) {
          version = env.quirks || !document.documentMode ? parseFloat(agent.match(/msie (\d+)/)[1]) : document.documentMode;
          env.ie9Compat = version == 9;
          env.ie8Compat = version == 8;
          env.ie7Compat = version == 7;
          env.ie6Compat = version < 7 || env.quirks;
        }
        if (env.gecko) {
          var directives = agent.match(/rv:([\d\.]+)/);
          if (directives) {
            directives = directives[1].split(".");
            version = directives[0] * 1E4 + (directives[1] || 0) * 100 + (directives[2] || 0) * 1;
          }
        }
        if (env.air) {
          version = parseFloat(agent.match(/ adobeair\/(\d+)/)[1]);
        }
        if (env.webkit) {
          version = parseFloat(agent.match(/ applewebkit\/(\d+)/)[1]);
        }
        env.version = version;
        env.isCompatible = env.iOS && version >= 534 || !env.mobile && (env.ie && version > 6 || (env.gecko && version >= 2E4 || (env.air && version >= 1 || (env.webkit && version >= 522 || false))));
        env.hidpi = window.devicePixelRatio >= 2;
        env.needsBrFiller = env.gecko || (env.webkit || env.ie && version > 10);
        env.needsNbspFiller = env.ie && version < 11;
        env.cssClass = "cke_browser_" + (env.ie ? "ie" : env.gecko ? "gecko" : env.webkit ? "webkit" : "unknown");
        if (env.quirks) {
          env.cssClass = env.cssClass + " cke_browser_quirks";
        }
        if (env.ie) {
          env.cssClass = env.cssClass + (" cke_browser_ie" + (env.quirks ? "6 cke_browser_iequirks" : env.version));
        }
        if (env.air) {
          env.cssClass = env.cssClass + " cke_browser_air";
        }
        if (env.iOS) {
          env.cssClass = env.cssClass + " cke_browser_ios";
        }
        if (env.hidpi) {
          env.cssClass = env.cssClass + " cke_hidpi";
        }
        return env;
      }();
    }
    if ("unloaded" == CKEDITOR.status) {
      (function() {
        CKEDITOR.event.implementOn(CKEDITOR);
        CKEDITOR.loadFullCore = function() {
          if (CKEDITOR.status != "basic_ready") {
            CKEDITOR.loadFullCore._load = 1;
          } else {
            delete CKEDITOR.loadFullCore;
            var requireScript = document.createElement("script");
            requireScript.type = "text/javascript";
            requireScript.src = CKEDITOR.basePath + "ckeditor.js";
            document.getElementsByTagName("head")[0].appendChild(requireScript);
          }
        };
        CKEDITOR.loadFullCoreTimeout = 0;
        CKEDITOR.add = function(name) {
          (this._.pending || (this._.pending = [])).push(name);
        };
        (function() {
          CKEDITOR.domReady(function() {
            var loadFullCore = CKEDITOR.loadFullCore;
            var loadFullCoreTimeout = CKEDITOR.loadFullCoreTimeout;
            if (loadFullCore) {
              CKEDITOR.status = "basic_ready";
              if (loadFullCore && loadFullCore._load) {
                loadFullCore();
              } else {
                if (loadFullCoreTimeout) {
                  setTimeout(function() {
                    if (CKEDITOR.loadFullCore) {
                      CKEDITOR.loadFullCore();
                    }
                  }, loadFullCoreTimeout * 1E3);
                }
              }
            }
          });
        })();
        CKEDITOR.status = "basic_loaded";
      })();
    }
    CKEDITOR.dom = {};
    (function() {
      var functions = [];
      var cssVendorPrefix = CKEDITOR.env.gecko ? "-moz-" : CKEDITOR.env.webkit ? "-webkit-" : CKEDITOR.env.ie ? "-ms-" : "";
      var r20 = /&/g;
      var rreturn = />/g;
      var rclass = /</g;
      var AMP = /"/g;
      var rLt = /&amp;/g;
      var rApos = /&gt;/g;
      var rGt = /&lt;/g;
      var cx = /&quot;/g;
      CKEDITOR.on("reset", function() {
        functions = [];
      });
      CKEDITOR.tools = {
        arrayCompare : function(arrayA, arrayB) {
          if (!arrayA && !arrayB) {
            return true;
          }
          if (!arrayA || (!arrayB || arrayA.length != arrayB.length)) {
            return false;
          }
          var i = 0;
          for (;i < arrayA.length;i++) {
            if (arrayA[i] != arrayB[i]) {
              return false;
            }
          }
          return true;
        },
        clone : function(obj) {
          var copy;
          if (obj && obj instanceof Array) {
            copy = [];
            var i = 0;
            for (;i < obj.length;i++) {
              copy[i] = CKEDITOR.tools.clone(obj[i]);
            }
            return copy;
          }
          if (obj === null || (typeof obj != "object" || (obj instanceof String || (obj instanceof Number || (obj instanceof Boolean || (obj instanceof Date || obj instanceof RegExp)))))) {
            return obj;
          }
          copy = new obj.constructor;
          for (i in obj) {
            copy[i] = CKEDITOR.tools.clone(obj[i]);
          }
          return copy;
        },
        capitalize : function(str, string) {
          return str.charAt(0).toUpperCase() + (string ? str.slice(1) : str.slice(1).toLowerCase());
        },
        extend : function(opt_attributes) {
          var len = arguments.length;
          var actionArgs;
          var obj;
          if (typeof(actionArgs = arguments[len - 1]) == "boolean") {
            len--;
          } else {
            if (typeof(actionArgs = arguments[len - 2]) == "boolean") {
              obj = arguments[len - 1];
              len = len - 2;
            }
          }
          var argsIndex = 1;
          for (;argsIndex < len;argsIndex++) {
            var iterable = arguments[argsIndex];
            var key;
            for (key in iterable) {
              if (actionArgs === true || opt_attributes[key] == void 0) {
                if (!obj || key in obj) {
                  opt_attributes[key] = iterable[key];
                }
              }
            }
          }
          return opt_attributes;
        },
        prototypedCopy : function(source) {
          var copy = function() {
          };
          copy.prototype = source;
          return new copy;
        },
        copy : function(obj) {
          var o = {};
          var i;
          for (i in obj) {
            o[i] = obj[i];
          }
          return o;
        },
        isArray : function(optgroup) {
          return Object.prototype.toString.call(optgroup) == "[object Array]";
        },
        isEmpty : function(obj) {
          var member;
          for (member in obj) {
            if (obj.hasOwnProperty(member)) {
              return false;
            }
          }
          return true;
        },
        cssVendorPrefix : function(property, value, ret) {
          if (ret) {
            return cssVendorPrefix + property + ":" + value + ";" + property + ":" + value;
          }
          ret = {};
          ret[property] = value;
          ret[cssVendorPrefix + property] = value;
          return ret;
        },
        cssStyleToDomStyle : function() {
          var test = document.createElement("div").style;
          var cssFloat = typeof test.cssFloat != "undefined" ? "cssFloat" : typeof test.styleFloat != "undefined" ? "styleFloat" : "float";
          return function(style) {
            return style == "float" ? cssFloat : style.replace(/-./g, function(rgb) {
              return rgb.substr(1).toUpperCase();
            });
          };
        }(),
        buildStyleHtml : function(parts) {
          parts = [].concat(parts);
          var part;
          var tagNameArr = [];
          var i = 0;
          for (;i < parts.length;i++) {
            if (part = parts[i]) {
              if (/@import|[{}]/.test(part)) {
                tagNameArr.push("<style>" + part + "</style>");
              } else {
                tagNameArr.push('<link type="text/css" rel=stylesheet href="' + part + '">');
              }
            }
          }
          return tagNameArr.join("");
        },
        htmlEncode : function(str) {
          return("" + str).replace(r20, "&amp;").replace(rreturn, "&gt;").replace(rclass, "&lt;");
        },
        htmlDecode : function(value) {
          return value.replace(rLt, "&").replace(rApos, ">").replace(rGt, "<");
        },
        htmlEncodeAttr : function(code) {
          return code.replace(AMP, "&quot;").replace(rclass, "&lt;").replace(rreturn, "&gt;");
        },
        htmlDecodeAttr : function(text) {
          return text.replace(cx, '"').replace(rGt, "<").replace(rApos, ">");
        },
        getNextNumber : function() {
          var a = 0;
          return function() {
            return++a;
          };
        }(),
        getNextId : function() {
          return "cke_" + this.getNextNumber();
        },
        override : function(originalFunction, functionBuilder) {
          var newFn = functionBuilder(originalFunction);
          newFn.prototype = originalFunction.prototype;
          return newFn;
        },
        setTimeout : function(callback, lab, optgroup, args, ownerWindow) {
          if (!ownerWindow) {
            ownerWindow = window;
          }
          if (!optgroup) {
            optgroup = ownerWindow;
          }
          return ownerWindow.setTimeout(function() {
            if (args) {
              callback.apply(optgroup, [].concat(args));
            } else {
              callback.apply(optgroup);
            }
          }, lab || 0);
        },
        trim : function() {
          var rreturn = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
          return function(ret) {
            return ret.replace(rreturn, "");
          };
        }(),
        ltrim : function() {
          var rreturn = /^[ \t\n\r]+/g;
          return function(ret) {
            return ret.replace(rreturn, "");
          };
        }(),
        rtrim : function() {
          var rreturn = /[ \t\n\r]+$/g;
          return function(ret) {
            return ret.replace(rreturn, "");
          };
        }(),
        indexOf : function(key, value) {
          if (typeof value == "function") {
            var i = 0;
            var keylen = key.length;
            for (;i < keylen;i++) {
              if (value(key[i])) {
                return i;
              }
            }
          } else {
            if (key.indexOf) {
              return key.indexOf(value);
            }
            i = 0;
            keylen = key.length;
            for (;i < keylen;i++) {
              if (key[i] === value) {
                return i;
              }
            }
          }
          return-1;
        },
        search : function(arr, item) {
          var idx = CKEDITOR.tools.indexOf(arr, item);
          return idx >= 0 ? arr[idx] : null;
        },
        bind : function(fun, optgroup) {
          return function() {
            return fun.apply(optgroup, arguments);
          };
        },
        createClass : function(definition) {
          var $ = definition.$;
          var baseClass = definition.base;
          var _ships = definition.privates || definition._;
          var proto = definition.proto;
          definition = definition.statics;
          if (!$) {
            $ = function() {
              if (baseClass) {
                this.base.apply(this, arguments);
              }
            };
          }
          if (_ships) {
            var matcherFunction = $;
            $ = function() {
              var entityMap = this._ || (this._ = {});
              var s;
              for (s in _ships) {
                var self = _ships[s];
                entityMap[s] = typeof self == "function" ? CKEDITOR.tools.bind(self, this) : self;
              }
              matcherFunction.apply(this, arguments);
            };
          }
          if (baseClass) {
            $.prototype = this.prototypedCopy(baseClass.prototype);
            $.prototype.constructor = $;
            $.base = baseClass;
            $.baseProto = baseClass.prototype;
            $.prototype.base = function() {
              this.base = baseClass.prototype.base;
              baseClass.apply(this, arguments);
              this.base = arguments.callee;
            };
          }
          if (proto) {
            this.extend($.prototype, proto, true);
          }
          if (definition) {
            this.extend($, definition, true);
          }
          return $;
        },
        addFunction : function(fn, scope) {
          return functions.push(function() {
            return fn.apply(scope || this, arguments);
          }) - 1;
        },
        removeFunction : function(ref) {
          functions[ref] = null;
        },
        callFunction : function(ref) {
          var fn = functions[ref];
          return fn && fn.apply(window, Array.prototype.slice.call(arguments, 1));
        },
        cssLength : function() {
          var rchecked = /^-?\d+\.?\d*px$/;
          var value;
          return function(line) {
            value = CKEDITOR.tools.trim(line + "") + "px";
            return rchecked.test(value) ? value : line || "";
          };
        }(),
        convertToPx : function() {
          var b;
          return function(value) {
            if (!b) {
              b = CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>', CKEDITOR.document);
              CKEDITOR.document.getBody().append(b);
            }
            if (!/%$/.test(value)) {
              b.setStyle("width", value);
              return b.$.clientWidth;
            }
            return value;
          };
        }(),
        repeat : function(str, times) {
          return Array(times + 1).join(str);
        },
        tryThese : function() {
          var returnValue;
          var i = 0;
          var argLength = arguments.length;
          for (;i < argLength;i++) {
            var lambda = arguments[i];
            try {
              returnValue = lambda();
              break;
            } catch (d) {
            }
          }
          return returnValue;
        },
        genKey : function() {
          return Array.prototype.slice.call(arguments).join("-");
        },
        defer : function(func) {
          return function() {
            var key = arguments;
            var optgroup = this;
            window.setTimeout(function() {
              func.apply(optgroup, key);
            }, 0);
          };
        },
        normalizeCssText : function(name, condition) {
          var buf = [];
          var part;
          var query = CKEDITOR.tools.parseCssText(name, true, condition);
          for (part in query) {
            buf.push(part + ":" + query[part]);
          }
          buf.sort();
          return buf.length ? buf.join(";") + ";" : "";
        },
        convertRgbToHex : function(styleText) {
          return styleText.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi, function(p, i, uint8, green) {
            p = [i, uint8, green];
            i = 0;
            for (;i < 3;i++) {
              p[i] = ("0" + parseInt(p[i], 10).toString(16)).slice(-2);
            }
            return "#" + p.join("");
          });
        },
        parseCssText : function(value, dataAndEvents, node) {
          var cache = {};
          if (node) {
            node = new CKEDITOR.dom.element("span");
            node.setAttribute("style", value);
            value = CKEDITOR.tools.convertRgbToHex(node.getAttribute("style") || "");
          }
          if (!value || value == ";") {
            return cache;
          }
          value.replace(/&quot;/g, '"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(deepDataAndEvents, name, v) {
            if (dataAndEvents) {
              name = name.toLowerCase();
              if (name == "font-family") {
                v = v.toLowerCase().replace(/["']/g, "").replace(/\s*,\s*/g, ",");
              }
              v = CKEDITOR.tools.trim(v);
            }
            cache[name] = v;
          });
          return cache;
        },
        writeCssText : function(query, dataAndEvents) {
          var part;
          var namespaces = [];
          for (part in query) {
            namespaces.push(part + ":" + query[part]);
          }
          if (dataAndEvents) {
            namespaces.sort();
          }
          return namespaces.join("; ");
        },
        objectCompare : function(left, right, dataAndEvents) {
          var name;
          if (!left && !right) {
            return true;
          }
          if (!left || !right) {
            return false;
          }
          for (name in left) {
            if (left[name] != right[name]) {
              return false;
            }
          }
          if (!dataAndEvents) {
            for (name in right) {
              if (left[name] != right[name]) {
                return false;
              }
            }
          }
          return true;
        },
        objectKeys : function(object) {
          var assigns = [];
          var vvar;
          for (vvar in object) {
            assigns.push(vvar);
          }
          return assigns;
        },
        convertArrayToObject : function(arr, fillWith) {
          var obj = {};
          if (arguments.length == 1) {
            fillWith = true;
          }
          var i = 0;
          var e = arr.length;
          for (;i < e;++i) {
            obj[arr[i]] = fillWith;
          }
          return obj;
        },
        fixDomain : function() {
          var domain;
          for (;;) {
            try {
              domain = window.parent.document.domain;
              break;
            } catch (f) {
              domain = domain ? domain.replace(/.+?(?:\.|$)/, "") : document.domain;
              if (!domain) {
                break;
              }
              document.domain = domain;
            }
          }
          return!!domain;
        },
        eventsBuffer : function(right, output) {
          function triggerOutput() {
            clientLeft = (new Date).getTime();
            tref = false;
            output();
          }
          var tref;
          var clientLeft = 0;
          return{
            input : function() {
              if (!tref) {
                var left = (new Date).getTime() - clientLeft;
                if (left < right) {
                  tref = setTimeout(triggerOutput, right - left);
                } else {
                  triggerOutput();
                }
              }
            },
            reset : function() {
              if (tref) {
                clearTimeout(tref);
              }
              tref = clientLeft = 0;
            }
          };
        },
        enableHtml5Elements : function(doc, dataAndEvents) {
          var nodeNames = ["abbr", "article", "aside", "audio", "bdi", "canvas", "data", "datalist", "details", "figcaption", "figure", "footer", "header", "hgroup", "mark", "meter", "nav", "output", "progress", "section", "summary", "time", "video"];
          var i = nodeNames.length;
          var comments;
          for (;i--;) {
            comments = doc.createElement(nodeNames[i]);
            if (dataAndEvents) {
              doc.appendChild(comments);
            }
          }
        },
        checkIfAnyArrayItemMatches : function(values, optgroup) {
          var i = 0;
          var valuesLen = values.length;
          for (;i < valuesLen;++i) {
            if (values[i].match(optgroup)) {
              return true;
            }
          }
          return false;
        },
        checkIfAnyObjectPropertyMatches : function(deepDataAndEvents, optgroup) {
          var $;
          for ($ in deepDataAndEvents) {
            if ($.match(optgroup)) {
              return true;
            }
          }
          return false;
        },
        transparentImageData : "data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw=="
      };
    })();
    CKEDITOR.dtd = function() {
      var merge = CKEDITOR.tools.extend;
      var a = function(node, opt_attributes) {
        var b = CKEDITOR.tools.clone(node);
        var i = 1;
        for (;i < arguments.length;i++) {
          opt_attributes = arguments[i];
          var bi;
          for (bi in opt_attributes) {
            delete b[bi];
          }
        }
        return b;
      };
      var s = {};
      var P = {};
      var data = {
        address : 1,
        article : 1,
        aside : 1,
        blockquote : 1,
        details : 1,
        div : 1,
        dl : 1,
        fieldset : 1,
        figure : 1,
        footer : 1,
        form : 1,
        h1 : 1,
        h2 : 1,
        h3 : 1,
        h4 : 1,
        h5 : 1,
        h6 : 1,
        header : 1,
        hgroup : 1,
        hr : 1,
        menu : 1,
        nav : 1,
        ol : 1,
        p : 1,
        pre : 1,
        section : 1,
        table : 1,
        ul : 1
      };
      var headTags = {
        command : 1,
        link : 1,
        meta : 1,
        noscript : 1,
        script : 1,
        style : 1
      };
      var img = {};
      var N = {
        "#" : 1
      };
      var E = {
        center : 1,
        dir : 1,
        noframes : 1
      };
      merge(s, {
        a : 1,
        abbr : 1,
        area : 1,
        audio : 1,
        b : 1,
        bdi : 1,
        bdo : 1,
        br : 1,
        button : 1,
        canvas : 1,
        cite : 1,
        code : 1,
        command : 1,
        datalist : 1,
        del : 1,
        dfn : 1,
        em : 1,
        embed : 1,
        i : 1,
        iframe : 1,
        img : 1,
        input : 1,
        ins : 1,
        kbd : 1,
        keygen : 1,
        label : 1,
        map : 1,
        mark : 1,
        meter : 1,
        noscript : 1,
        object : 1,
        output : 1,
        progress : 1,
        q : 1,
        ruby : 1,
        s : 1,
        samp : 1,
        script : 1,
        select : 1,
        small : 1,
        span : 1,
        strong : 1,
        sub : 1,
        sup : 1,
        textarea : 1,
        time : 1,
        u : 1,
        "var" : 1,
        video : 1,
        wbr : 1
      }, N, {
        acronym : 1,
        applet : 1,
        basefont : 1,
        big : 1,
        font : 1,
        isindex : 1,
        strike : 1,
        style : 1,
        tt : 1
      });
      merge(P, data, s, E);
      a = {
        a : a(s, {
          a : 1,
          button : 1
        }),
        abbr : s,
        address : P,
        area : img,
        article : merge({
          style : 1
        }, P),
        aside : merge({
          style : 1
        }, P),
        audio : merge({
          source : 1,
          track : 1
        }, P),
        b : s,
        base : img,
        bdi : s,
        bdo : s,
        blockquote : P,
        body : P,
        br : img,
        button : a(s, {
          a : 1,
          button : 1
        }),
        canvas : s,
        caption : P,
        cite : s,
        code : s,
        col : img,
        colgroup : {
          col : 1
        },
        command : img,
        datalist : merge({
          option : 1
        }, s),
        dd : P,
        del : s,
        details : merge({
          summary : 1
        }, P),
        dfn : s,
        div : merge({
          style : 1
        }, P),
        dl : {
          dt : 1,
          dd : 1
        },
        dt : P,
        em : s,
        embed : img,
        fieldset : merge({
          legend : 1
        }, P),
        figcaption : P,
        figure : merge({
          figcaption : 1
        }, P),
        footer : P,
        form : P,
        h1 : s,
        h2 : s,
        h3 : s,
        h4 : s,
        h5 : s,
        h6 : s,
        head : merge({
          title : 1,
          base : 1
        }, headTags),
        header : P,
        hgroup : {
          h1 : 1,
          h2 : 1,
          h3 : 1,
          h4 : 1,
          h5 : 1,
          h6 : 1
        },
        hr : img,
        html : merge({
          head : 1,
          body : 1
        }, P, headTags),
        i : s,
        iframe : N,
        img : img,
        input : img,
        ins : s,
        kbd : s,
        keygen : img,
        label : s,
        legend : s,
        li : P,
        link : img,
        map : P,
        mark : s,
        menu : merge({
          li : 1
        }, P),
        meta : img,
        meter : a(s, {
          meter : 1
        }),
        nav : P,
        noscript : merge({
          link : 1,
          meta : 1,
          style : 1
        }, s),
        object : merge({
          param : 1
        }, s),
        ol : {
          li : 1
        },
        optgroup : {
          option : 1
        },
        option : N,
        output : s,
        p : s,
        param : img,
        pre : s,
        progress : a(s, {
          progress : 1
        }),
        q : s,
        rp : s,
        rt : s,
        ruby : merge({
          rp : 1,
          rt : 1
        }, s),
        s : s,
        samp : s,
        script : N,
        section : merge({
          style : 1
        }, P),
        select : {
          optgroup : 1,
          option : 1
        },
        small : s,
        source : img,
        span : s,
        strong : s,
        style : N,
        sub : s,
        summary : s,
        sup : s,
        table : {
          caption : 1,
          colgroup : 1,
          thead : 1,
          tfoot : 1,
          tbody : 1,
          tr : 1
        },
        tbody : {
          tr : 1
        },
        td : P,
        textarea : N,
        tfoot : {
          tr : 1
        },
        th : P,
        thead : {
          tr : 1
        },
        time : a(s, {
          time : 1
        }),
        title : N,
        tr : {
          th : 1,
          td : 1
        },
        track : img,
        u : s,
        ul : {
          li : 1
        },
        "var" : s,
        video : merge({
          source : 1,
          track : 1
        }, P),
        wbr : img,
        acronym : s,
        applet : merge({
          param : 1
        }, P),
        basefont : img,
        big : s,
        center : P,
        dialog : img,
        dir : {
          li : 1
        },
        font : s,
        isindex : img,
        noframes : P,
        strike : s,
        tt : s
      };
      merge(a, {
        $block : merge({
          audio : 1,
          dd : 1,
          dt : 1,
          figcaption : 1,
          li : 1,
          video : 1
        }, data, E),
        $blockLimit : {
          article : 1,
          aside : 1,
          audio : 1,
          body : 1,
          caption : 1,
          details : 1,
          dir : 1,
          div : 1,
          dl : 1,
          fieldset : 1,
          figcaption : 1,
          figure : 1,
          footer : 1,
          form : 1,
          header : 1,
          hgroup : 1,
          menu : 1,
          nav : 1,
          ol : 1,
          section : 1,
          table : 1,
          td : 1,
          th : 1,
          tr : 1,
          ul : 1,
          video : 1
        },
        $cdata : {
          script : 1,
          style : 1
        },
        $editable : {
          address : 1,
          article : 1,
          aside : 1,
          blockquote : 1,
          body : 1,
          details : 1,
          div : 1,
          fieldset : 1,
          figcaption : 1,
          footer : 1,
          form : 1,
          h1 : 1,
          h2 : 1,
          h3 : 1,
          h4 : 1,
          h5 : 1,
          h6 : 1,
          header : 1,
          hgroup : 1,
          nav : 1,
          p : 1,
          pre : 1,
          section : 1
        },
        $empty : {
          area : 1,
          base : 1,
          basefont : 1,
          br : 1,
          col : 1,
          command : 1,
          dialog : 1,
          embed : 1,
          hr : 1,
          img : 1,
          input : 1,
          isindex : 1,
          keygen : 1,
          link : 1,
          meta : 1,
          param : 1,
          source : 1,
          track : 1,
          wbr : 1
        },
        $inline : s,
        $list : {
          dl : 1,
          ol : 1,
          ul : 1
        },
        $listItem : {
          dd : 1,
          dt : 1,
          li : 1
        },
        $nonBodyContent : merge({
          body : 1,
          head : 1,
          html : 1
        }, a.head),
        $nonEditable : {
          applet : 1,
          audio : 1,
          button : 1,
          embed : 1,
          iframe : 1,
          map : 1,
          object : 1,
          option : 1,
          param : 1,
          script : 1,
          textarea : 1,
          video : 1
        },
        $object : {
          applet : 1,
          audio : 1,
          button : 1,
          hr : 1,
          iframe : 1,
          img : 1,
          input : 1,
          object : 1,
          select : 1,
          table : 1,
          textarea : 1,
          video : 1
        },
        $removeEmpty : {
          abbr : 1,
          acronym : 1,
          b : 1,
          bdi : 1,
          bdo : 1,
          big : 1,
          cite : 1,
          code : 1,
          del : 1,
          dfn : 1,
          em : 1,
          font : 1,
          i : 1,
          ins : 1,
          label : 1,
          kbd : 1,
          mark : 1,
          meter : 1,
          output : 1,
          q : 1,
          ruby : 1,
          s : 1,
          samp : 1,
          small : 1,
          span : 1,
          strike : 1,
          strong : 1,
          sub : 1,
          sup : 1,
          time : 1,
          tt : 1,
          u : 1,
          "var" : 1
        },
        $tabIndex : {
          a : 1,
          area : 1,
          button : 1,
          input : 1,
          object : 1,
          select : 1,
          textarea : 1
        },
        $tableContent : {
          caption : 1,
          col : 1,
          colgroup : 1,
          tbody : 1,
          td : 1,
          tfoot : 1,
          th : 1,
          thead : 1,
          tr : 1
        },
        $transparent : {
          a : 1,
          audio : 1,
          canvas : 1,
          del : 1,
          ins : 1,
          map : 1,
          noscript : 1,
          object : 1,
          video : 1
        },
        $intermediate : {
          caption : 1,
          colgroup : 1,
          dd : 1,
          dt : 1,
          figcaption : 1,
          legend : 1,
          li : 1,
          optgroup : 1,
          option : 1,
          rp : 1,
          rt : 1,
          summary : 1,
          tbody : 1,
          td : 1,
          tfoot : 1,
          th : 1,
          thead : 1,
          tr : 1
        }
      });
      return a;
    }();
    CKEDITOR.dom.event = function(options) {
      this.$ = options;
    };
    CKEDITOR.dom.event.prototype = {
      getKey : function() {
        return this.$.keyCode || this.$.which;
      },
      getKeystroke : function() {
        var keystroke = this.getKey();
        if (this.$.ctrlKey || this.$.metaKey) {
          keystroke = keystroke + CKEDITOR.CTRL;
        }
        if (this.$.shiftKey) {
          keystroke = keystroke + CKEDITOR.SHIFT;
        }
        if (this.$.altKey) {
          keystroke = keystroke + CKEDITOR.ALT;
        }
        return keystroke;
      },
      preventDefault : function(dataAndEvents) {
        var $ = this.$;
        if ($.preventDefault) {
          $.preventDefault();
        } else {
          $.returnValue = false;
        }
        if (dataAndEvents) {
          this.stopPropagation();
        }
      },
      stopPropagation : function() {
        var $ = this.$;
        if ($.stopPropagation) {
          $.stopPropagation();
        } else {
          $.cancelBubble = true;
        }
      },
      getTarget : function() {
        var rawNode = this.$.target || this.$.srcElement;
        return rawNode ? new CKEDITOR.dom.node(rawNode) : null;
      },
      getPhase : function() {
        return this.$.eventPhase || 2;
      },
      getPageOffset : function() {
        var doc = this.getTarget().getDocument().$;
        return{
          x : this.$.pageX || this.$.clientX + (doc.documentElement.scrollLeft || doc.body.scrollLeft),
          y : this.$.pageY || this.$.clientY + (doc.documentElement.scrollTop || doc.body.scrollTop)
        };
      }
    };
    CKEDITOR.CTRL = 1114112;
    CKEDITOR.SHIFT = 2228224;
    CKEDITOR.ALT = 4456448;
    CKEDITOR.EVENT_PHASE_CAPTURING = 1;
    CKEDITOR.EVENT_PHASE_AT_TARGET = 2;
    CKEDITOR.EVENT_PHASE_BUBBLING = 3;
    CKEDITOR.dom.domObject = function(nativeDomObject) {
      if (nativeDomObject) {
        this.$ = nativeDomObject;
      }
    };
    CKEDITOR.dom.domObject.prototype = function() {
      var getNativeListener = function(domObject, eventName) {
        return function(domEvent) {
          if (typeof CKEDITOR != "undefined") {
            domObject.fire(eventName, new CKEDITOR.dom.event(domEvent));
          }
        };
      };
      return{
        getPrivate : function() {
          var priv;
          if (!(priv = this.getCustomData("_"))) {
            this.setCustomData("_", priv = {});
          }
          return priv;
        },
        on : function(name) {
          var nativeListeners = this.getCustomData("_cke_nativeListeners");
          if (!nativeListeners) {
            nativeListeners = {};
            this.setCustomData("_cke_nativeListeners", nativeListeners);
          }
          if (!nativeListeners[name]) {
            nativeListeners = nativeListeners[name] = getNativeListener(this, name);
            if (this.$.addEventListener) {
              this.$.addEventListener(name, nativeListeners, !!CKEDITOR.event.useCapture);
            } else {
              if (this.$.attachEvent) {
                this.$.attachEvent("on" + name, nativeListeners);
              }
            }
          }
          return CKEDITOR.event.prototype.on.apply(this, arguments);
        },
        removeListener : function(eventName) {
          CKEDITOR.event.prototype.removeListener.apply(this, arguments);
          if (!this.hasListeners(eventName)) {
            var nativeListeners = this.getCustomData("_cke_nativeListeners");
            var listener = nativeListeners && nativeListeners[eventName];
            if (listener) {
              if (this.$.removeEventListener) {
                this.$.removeEventListener(eventName, listener, false);
              } else {
                if (this.$.detachEvent) {
                  this.$.detachEvent("on" + eventName, listener);
                }
              }
              delete nativeListeners[eventName];
            }
          }
        },
        removeAllListeners : function() {
          var nativeListeners = this.getCustomData("_cke_nativeListeners");
          var eventName;
          for (eventName in nativeListeners) {
            var listener = nativeListeners[eventName];
            if (this.$.detachEvent) {
              this.$.detachEvent("on" + eventName, listener);
            } else {
              if (this.$.removeEventListener) {
                this.$.removeEventListener(eventName, listener, false);
              }
            }
            delete nativeListeners[eventName];
          }
          CKEDITOR.event.prototype.removeAllListeners.call(this);
        }
      };
    }();
    (function(domObjectProto) {
      var cur = {};
      CKEDITOR.on("reset", function() {
        cur = {};
      });
      domObjectProto.equals = function(node) {
        try {
          return node && node.$ === this.$;
        } catch (d) {
          return false;
        }
      };
      domObjectProto.setCustomData = function(name, value) {
        var ontype = this.getUniqueId();
        (cur[ontype] || (cur[ontype] = {}))[name] = value;
        return this;
      };
      domObjectProto.getCustomData = function(type) {
        var ontype = this.$["data-cke-expando"];
        return(ontype = ontype && cur[ontype]) && type in ontype ? ontype[type] : null;
      };
      domObjectProto.removeCustomData = function(name) {
        var ontype = this.$["data-cke-expando"];
        ontype = ontype && cur[ontype];
        var match;
        var found;
        if (ontype) {
          match = ontype[name];
          found = name in ontype;
          delete ontype[name];
        }
        return found ? match : null;
      };
      domObjectProto.clearCustomData = function() {
        this.removeAllListeners();
        var expandoNumber = this.$["data-cke-expando"];
        if (expandoNumber) {
          delete cur[expandoNumber];
        }
      };
      domObjectProto.getUniqueId = function() {
        return this.$["data-cke-expando"] || (this.$["data-cke-expando"] = CKEDITOR.tools.getNextNumber());
      };
      CKEDITOR.event.implementOn(domObjectProto);
    })(CKEDITOR.dom.domObject.prototype);
    CKEDITOR.dom.node = function(node) {
      return node ? new CKEDITOR.dom[node.nodeType == CKEDITOR.NODE_DOCUMENT ? "document" : node.nodeType == CKEDITOR.NODE_ELEMENT ? "element" : node.nodeType == CKEDITOR.NODE_TEXT ? "text" : node.nodeType == CKEDITOR.NODE_COMMENT ? "comment" : node.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? "documentFragment" : "domObject"](node) : this;
    };
    CKEDITOR.dom.node.prototype = new CKEDITOR.dom.domObject;
    CKEDITOR.NODE_ELEMENT = 1;
    CKEDITOR.NODE_DOCUMENT = 9;
    CKEDITOR.NODE_TEXT = 3;
    CKEDITOR.NODE_COMMENT = 8;
    CKEDITOR.NODE_DOCUMENT_FRAGMENT = 11;
    CKEDITOR.POSITION_IDENTICAL = 0;
    CKEDITOR.POSITION_DISCONNECTED = 1;
    CKEDITOR.POSITION_FOLLOWING = 2;
    CKEDITOR.POSITION_PRECEDING = 4;
    CKEDITOR.POSITION_IS_CONTAINED = 8;
    CKEDITOR.POSITION_CONTAINS = 16;
    CKEDITOR.tools.extend(CKEDITOR.dom.node.prototype, {
      appendTo : function(element, node) {
        element.append(this, node);
        return element;
      },
      clone : function(name, dataAndEvents) {
        var $node = this.$.cloneNode(name);
        var removeIds = function(node) {
          if (node["data-cke-expando"]) {
            node["data-cke-expando"] = false;
          }
          if (node.nodeType == CKEDITOR.NODE_ELEMENT) {
            if (!dataAndEvents) {
              node.removeAttribute("id", false);
            }
            if (name) {
              node = node.childNodes;
              var i = 0;
              for (;i < node.length;i++) {
                removeIds(node[i]);
              }
            }
          }
        };
        removeIds($node);
        return new CKEDITOR.dom.node($node);
      },
      hasPrevious : function() {
        return!!this.$.previousSibling;
      },
      hasNext : function() {
        return!!this.$.nextSibling;
      },
      insertAfter : function(node) {
        node.$.parentNode.insertBefore(this.$, node.$.nextSibling);
        return node;
      },
      insertBefore : function(node) {
        node.$.parentNode.insertBefore(this.$, node.$);
        return node;
      },
      insertBeforeMe : function(node) {
        this.$.parentNode.insertBefore(node.$, this.$);
        return node;
      },
      getAddress : function(key) {
        var address = [];
        var $documentElement = this.getDocument().$.documentElement;
        var node = this.$;
        for (;node && node != $documentElement;) {
          var parentNode = node.parentNode;
          if (parentNode) {
            address.unshift(this.getIndex.call({
              $ : node
            }, key));
          }
          node = parentNode;
        }
        return address;
      },
      getDocument : function() {
        return new CKEDITOR.dom.document(this.$.ownerDocument || this.$.parentNode.ownerDocument);
      },
      getIndex : function(dataAndEvents) {
        var current = this.$;
        var index = -1;
        var d;
        if (!this.$.parentNode) {
          return index;
        }
        do {
          if (!dataAndEvents || !(current != this.$ && (current.nodeType == CKEDITOR.NODE_TEXT && (d || !current.nodeValue)))) {
            index++;
            d = current.nodeType == CKEDITOR.NODE_TEXT;
          }
        } while (current = current.previousSibling);
        return index;
      },
      getNextSourceNode : function(recurring, type, guard) {
        if (guard && !guard.call) {
          var attribute = guard;
          guard = function(node) {
            return!node.equals(attribute);
          };
        }
        recurring = !recurring && (this.getFirst && this.getFirst());
        var parent;
        if (!recurring) {
          if (this.type == CKEDITOR.NODE_ELEMENT && (guard && guard(this, true) === false)) {
            return null;
          }
          recurring = this.getNext();
        }
        for (;!recurring && (parent = (parent || this).getParent());) {
          if (guard && guard(parent, true) === false) {
            return null;
          }
          recurring = parent.getNext();
        }
        return!recurring || guard && guard(recurring) === false ? null : type && type != recurring.type ? recurring.getNextSourceNode(false, type, guard) : recurring;
      },
      getPreviousSourceNode : function(node, nodeType, guard) {
        if (guard && !guard.call) {
          var attribute = guard;
          guard = function(node) {
            return!node.equals(attribute);
          };
        }
        node = !node && (this.getLast && this.getLast());
        var parent;
        if (!node) {
          if (this.type == CKEDITOR.NODE_ELEMENT && (guard && guard(this, true) === false)) {
            return null;
          }
          node = this.getPrevious();
        }
        for (;!node && (parent = (parent || this).getParent());) {
          if (guard && guard(parent, true) === false) {
            return null;
          }
          node = parent.getPrevious();
        }
        return!node || guard && guard(node) === false ? null : nodeType && node.type != nodeType ? node.getPreviousSourceNode(false, nodeType, guard) : node;
      },
      getPrevious : function(evaluator) {
        var previous = this.$;
        var retval;
        do {
          retval = (previous = previous.previousSibling) && (previous.nodeType != 10 && new CKEDITOR.dom.node(previous));
        } while (retval && (evaluator && !evaluator(retval)));
        return retval;
      },
      getNext : function(evaluator) {
        var next = this.$;
        var retval;
        do {
          retval = (next = next.nextSibling) && new CKEDITOR.dom.node(next);
        } while (retval && (evaluator && !evaluator(retval)));
        return retval;
      },
      getParent : function(dataAndEvents) {
        var parent = this.$.parentNode;
        return parent && (parent.nodeType == CKEDITOR.NODE_ELEMENT || dataAndEvents && parent.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT) ? new CKEDITOR.dom.node(parent) : null;
      },
      getParents : function(closerFirst) {
        var node = this;
        var parents = [];
        do {
          parents[closerFirst ? "push" : "unshift"](node);
        } while (node = node.getParent());
        return parents;
      },
      getCommonAncestor : function(node) {
        if (node.equals(this)) {
          return this;
        }
        if (node.contains && node.contains(this)) {
          return node;
        }
        var start = this.contains ? this : this.getParent();
        do {
          if (start.contains(node)) {
            return start;
          }
        } while (start = start.getParent());
        return null;
      },
      getPosition : function(node) {
        var a = this.$;
        var b = node.$;
        if (a.compareDocumentPosition) {
          return a.compareDocumentPosition(b);
        }
        if (a == b) {
          return CKEDITOR.POSITION_IDENTICAL;
        }
        if (this.type == CKEDITOR.NODE_ELEMENT && node.type == CKEDITOR.NODE_ELEMENT) {
          if (a.contains) {
            if (a.contains(b)) {
              return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
            }
            if (b.contains(a)) {
              return CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING;
            }
          }
          if ("sourceIndex" in a) {
            return a.sourceIndex < 0 || b.sourceIndex < 0 ? CKEDITOR.POSITION_DISCONNECTED : a.sourceIndex < b.sourceIndex ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
          }
        }
        a = this.getAddress();
        node = node.getAddress();
        b = Math.min(a.length, node.length);
        var i = 0;
        for (;i <= b - 1;i++) {
          if (a[i] != node[i]) {
            if (i < b) {
              return a[i] < node[i] ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
            }
            break;
          }
        }
        return a.length < node.length ? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING;
      },
      getAscendant : function(data, dataAndEvents) {
        var $ = this.$;
        var name;
        if (!dataAndEvents) {
          $ = $.parentNode;
        }
        for (;$;) {
          if ($.nodeName && (name = $.nodeName.toLowerCase(), typeof data == "string" ? name == data : name in data)) {
            return new CKEDITOR.dom.node($);
          }
          try {
            $ = $.parentNode;
          } catch (f) {
            $ = null;
          }
        }
        return null;
      },
      hasAscendant : function(name, dataAndEvents) {
        var $ = this.$;
        if (!dataAndEvents) {
          $ = $.parentNode;
        }
        for (;$;) {
          if ($.nodeName && $.nodeName.toLowerCase() == name) {
            return true;
          }
          $ = $.parentNode;
        }
        return false;
      },
      move : function(target, dataAndEvents) {
        target.append(this.remove(), dataAndEvents);
      },
      remove : function(name) {
        var element = this.$;
        var parent = element.parentNode;
        if (parent) {
          if (name) {
            for (;name = element.firstChild;) {
              parent.insertBefore(element.removeChild(name), element);
            }
          }
          parent.removeChild(element);
        }
        return this;
      },
      replace : function(regex) {
        this.insertBefore(regex);
        regex.remove();
      },
      trim : function() {
        this.ltrim();
        this.rtrim();
      },
      ltrim : function() {
        var child;
        for (;this.getFirst && (child = this.getFirst());) {
          if (child.type == CKEDITOR.NODE_TEXT) {
            var trimmed = CKEDITOR.tools.ltrim(child.getText());
            var originalLength = child.getLength();
            if (trimmed) {
              if (trimmed.length < originalLength) {
                child.split(originalLength - trimmed.length);
                this.$.removeChild(this.$.firstChild);
              }
            } else {
              child.remove();
              continue;
            }
          }
          break;
        }
      },
      rtrim : function() {
        var child;
        for (;this.getLast && (child = this.getLast());) {
          if (child.type == CKEDITOR.NODE_TEXT) {
            var trimmed = CKEDITOR.tools.rtrim(child.getText());
            var originalLength = child.getLength();
            if (trimmed) {
              if (trimmed.length < originalLength) {
                child.split(trimmed.length);
                this.$.lastChild.parentNode.removeChild(this.$.lastChild);
              }
            } else {
              child.remove();
              continue;
            }
          }
          break;
        }
        if (CKEDITOR.env.needsBrFiller) {
          if (child = this.$.lastChild) {
            if (child.type == 1 && child.nodeName.toLowerCase() == "br") {
              child.parentNode.removeChild(child);
            }
          }
        }
      },
      isReadOnly : function() {
        var element = this;
        if (this.type != CKEDITOR.NODE_ELEMENT) {
          element = this.getParent();
        }
        if (element && typeof element.$.isContentEditable != "undefined") {
          return!(element.$.isContentEditable || element.data("cke-editable"));
        }
        for (;element;) {
          if (element.data("cke-editable")) {
            break;
          }
          if (element.getAttribute("contentEditable") == "false") {
            return true;
          }
          if (element.getAttribute("contentEditable") == "true") {
            break;
          }
          element = element.getParent();
        }
        return!element;
      }
    });
    CKEDITOR.dom.window = function(key) {
      CKEDITOR.dom.domObject.call(this, key);
    };
    CKEDITOR.dom.window.prototype = new CKEDITOR.dom.domObject;
    CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype, {
      focus : function() {
        this.$.focus();
      },
      getViewPaneSize : function() {
        var doc = this.$.document;
        var stdMode = doc.compatMode == "CSS1Compat";
        return{
          width : (stdMode ? doc.documentElement.clientWidth : doc.body.clientWidth) || 0,
          height : (stdMode ? doc.documentElement.clientHeight : doc.body.clientHeight) || 0
        };
      },
      getScrollPosition : function() {
        var $ = this.$;
        if ("pageXOffset" in $) {
          return{
            x : $.pageXOffset || 0,
            y : $.pageYOffset || 0
          };
        }
        $ = $.document;
        return{
          x : $.documentElement.scrollLeft || ($.body.scrollLeft || 0),
          y : $.documentElement.scrollTop || ($.body.scrollTop || 0)
        };
      },
      getFrame : function() {
        var iframe = this.$.frameElement;
        return iframe ? new CKEDITOR.dom.element.get(iframe) : null;
      }
    });
    CKEDITOR.dom.document = function(name) {
      CKEDITOR.dom.domObject.call(this, name);
    };
    CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject;
    CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype, {
      type : CKEDITOR.NODE_DOCUMENT,
      appendStyleSheet : function(cssFileUrl) {
        if (this.$.createStyleSheet) {
          this.$.createStyleSheet(cssFileUrl);
        } else {
          var link = new CKEDITOR.dom.element("link");
          link.setAttributes({
            rel : "stylesheet",
            type : "text/css",
            href : cssFileUrl
          });
          this.getHead().append(link);
        }
      },
      appendStyleText : function(cssStyleText) {
        if (this.$.createStyleSheet) {
          var styleSheet = this.$.createStyleSheet("");
          styleSheet.cssText = cssStyleText;
        } else {
          var style = new CKEDITOR.dom.element("style", this);
          style.append(new CKEDITOR.dom.text(cssStyleText, this));
          this.getHead().append(style);
        }
        return styleSheet || style.$.sheet;
      },
      createElement : function(name, attrs) {
        var element = new CKEDITOR.dom.element(name, this);
        if (attrs) {
          if (attrs.attributes) {
            element.setAttributes(attrs.attributes);
          }
          if (attrs.styles) {
            element.setStyles(attrs.styles);
          }
        }
        return element;
      },
      createText : function(text) {
        return new CKEDITOR.dom.text(text, this);
      },
      focus : function() {
        this.getWindow().focus();
      },
      getActive : function() {
        return new CKEDITOR.dom.element(this.$.activeElement);
      },
      getById : function(id) {
        return(id = this.$.getElementById(id)) ? new CKEDITOR.dom.element(id) : null;
      },
      getByAddress : function(codeSegments, normalized) {
        var $ = this.$.documentElement;
        var i = 0;
        for (;$ && i < codeSegments.length;i++) {
          var target = codeSegments[i];
          if (normalized) {
            var currentIndex = -1;
            var j = 0;
            for (;j < $.childNodes.length;j++) {
              var candidate = $.childNodes[j];
              if (!(normalized === true && (candidate.nodeType == 3 && (candidate.previousSibling && candidate.previousSibling.nodeType == 3)))) {
                currentIndex++;
                if (currentIndex == target) {
                  $ = candidate;
                  break;
                }
              }
            }
          } else {
            $ = $.childNodes[target];
          }
        }
        return $ ? new CKEDITOR.dom.node($) : null;
      },
      getElementsByTag : function(tagName, namespace) {
        if ((!CKEDITOR.env.ie || document.documentMode > 8) && namespace) {
          tagName = namespace + ":" + tagName;
        }
        return new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(tagName));
      },
      getHead : function() {
        var node = this.$.getElementsByTagName("head")[0];
        return node = node ? new CKEDITOR.dom.element(node) : this.getDocumentElement().append(new CKEDITOR.dom.element("head"), true);
      },
      getBody : function() {
        return new CKEDITOR.dom.element(this.$.body);
      },
      getDocumentElement : function() {
        return new CKEDITOR.dom.element(this.$.documentElement);
      },
      getWindow : function() {
        return new CKEDITOR.dom.window(this.$.parentWindow || this.$.defaultView);
      },
      write : function(html) {
        this.$.open("text/html", "replace");
        if (CKEDITOR.env.ie) {
          html = html.replace(/(?:^\s*<!DOCTYPE[^>]*?>)|^/i, '$&\n<script data-cke-temp="1">(' + CKEDITOR.tools.fixDomain + ")();\x3c/script>");
        }
        this.$.write(html);
        this.$.close();
      },
      find : function(selector) {
        return new CKEDITOR.dom.nodeList(this.$.querySelectorAll(selector));
      },
      findOne : function(name) {
        return(name = this.$.querySelector(name)) ? new CKEDITOR.dom.element(name) : null;
      },
      _getHtml5ShivFrag : function() {
        var $frag = this.getCustomData("html5ShivFrag");
        if (!$frag) {
          $frag = this.$.createDocumentFragment();
          CKEDITOR.tools.enableHtml5Elements($frag, true);
          this.setCustomData("html5ShivFrag", $frag);
        }
        return $frag;
      }
    });
    CKEDITOR.dom.nodeList = function(nativeList) {
      this.$ = nativeList;
    };
    CKEDITOR.dom.nodeList.prototype = {
      count : function() {
        return this.$.length;
      },
      getItem : function(index) {
        if (index < 0 || index >= this.$.length) {
          return null;
        }
        return(index = this.$[index]) ? new CKEDITOR.dom.node(index) : null;
      }
    };
    CKEDITOR.dom.element = function(name, keepData) {
      if (typeof name == "string") {
        name = (keepData ? keepData.$ : document).createElement(name);
      }
      CKEDITOR.dom.domObject.call(this, name);
    };
    CKEDITOR.dom.element.get = function(element) {
      return(element = typeof element == "string" ? document.getElementById(element) || document.getElementsByName(element)[0] : element) && (element.$ ? element : new CKEDITOR.dom.element(element));
    };
    CKEDITOR.dom.element.prototype = new CKEDITOR.dom.node;
    CKEDITOR.dom.element.createFromHtml = function(html, ownerDocument) {
      var temp = new CKEDITOR.dom.element("div", ownerDocument);
      temp.setHtml(html);
      return temp.getFirst().remove();
    };
    CKEDITOR.dom.element.setMarker = function(database, element, name, value) {
      var id = element.getCustomData("list_marker_id") || element.setCustomData("list_marker_id", CKEDITOR.tools.getNextNumber()).getCustomData("list_marker_id");
      var old = element.getCustomData("list_marker_names") || element.setCustomData("list_marker_names", {}).getCustomData("list_marker_names");
      database[id] = element;
      old[name] = 1;
      return element.setCustomData(name, value);
    };
    CKEDITOR.dom.element.clearAllMarkers = function(database) {
      var i;
      for (i in database) {
        CKEDITOR.dom.element.clearMarkers(database, database[i], 1);
      }
    };
    CKEDITOR.dom.element.clearMarkers = function(database, element, dataAndEvents) {
      var names = element.getCustomData("list_marker_names");
      var id = element.getCustomData("list_marker_id");
      var i;
      for (i in names) {
        element.removeCustomData(i);
      }
      element.removeCustomData("list_marker_names");
      if (dataAndEvents) {
        element.removeCustomData("list_marker_id");
        delete database[id];
      }
    };
    (function() {
      function createTmpId(element) {
        var c = true;
        if (!element.$.id) {
          element.$.id = "cke_tmp_" + CKEDITOR.tools.getNextNumber();
          c = false;
        }
        return function() {
          if (!c) {
            element.removeAttribute("id");
          }
        };
      }
      function getContextualizedSelector(element, selector) {
        return "#" + element.$.id + " " + selector.split(/,\s*/).join(", #" + element.$.id + " ");
      }
      function replacer(key) {
        var replacement = 0;
        var i = 0;
        var valuesLen = expected[key].length;
        for (;i < valuesLen;i++) {
          replacement = replacement + (parseInt(this.getComputedStyle(expected[key][i]) || 0, 10) || 0);
        }
        return replacement;
      }
      CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype, {
        type : CKEDITOR.NODE_ELEMENT,
        addClass : function(className) {
          var c = this.$.className;
          if (c) {
            if (!RegExp("(?:^|\\s)" + className + "(?:\\s|$)", "").test(c)) {
              c = c + (" " + className);
            }
          }
          this.$.className = c || className;
          return this;
        },
        removeClass : function(className) {
          var c = this.getAttribute("class");
          if (c) {
            className = RegExp("(?:^|\\s+)" + className + "(?=\\s|$)", "i");
            if (className.test(c)) {
              if (c = c.replace(className, "").replace(/^\s+/, "")) {
                this.setAttribute("class", c);
              } else {
                this.removeAttribute("class");
              }
            }
          }
          return this;
        },
        hasClass : function(cls) {
          return RegExp("(?:^|\\s+)" + cls + "(?=\\s|$)", "").test(this.getAttribute("class"));
        },
        append : function(obj, dataAndEvents) {
          if (typeof obj == "string") {
            obj = this.getDocument().createElement(obj);
          }
          if (dataAndEvents) {
            this.$.insertBefore(obj.$, this.$.firstChild);
          } else {
            this.$.appendChild(obj.$);
          }
          return obj;
        },
        appendHtml : function(html) {
          if (this.$.childNodes.length) {
            var temp = new CKEDITOR.dom.element("div", this.getDocument());
            temp.setHtml(html);
            temp.moveChildren(this);
          } else {
            this.setHtml(html);
          }
        },
        appendText : function(text) {
          if (this.$.text != void 0) {
            this.$.text = this.$.text + text;
          } else {
            this.append(new CKEDITOR.dom.text(text));
          }
        },
        appendBogus : function(node) {
          if (node || CKEDITOR.env.needsBrFiller) {
            node = this.getLast();
            for (;node && (node.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.rtrim(node.getText()));) {
              node = node.getPrevious();
            }
            if (!node || (!node.is || !node.is("br"))) {
              node = this.getDocument().createElement("br");
              if (CKEDITOR.env.gecko) {
                node.setAttribute("type", "_moz");
              }
              this.append(node);
            }
          }
        },
        breakParent : function(node) {
          var range = new CKEDITOR.dom.range(this.getDocument());
          range.setStartAfter(this);
          range.setEndAfter(node);
          node = range.extractContents();
          range.insertNode(this.remove());
          node.insertAfterNode(this);
        },
        contains : CKEDITOR.env.ie || CKEDITOR.env.webkit ? function(node) {
          var $ = this.$;
          return node.type != CKEDITOR.NODE_ELEMENT ? $.contains(node.getParent().$) : $ != node.$ && $.contains(node.$);
        } : function(name) {
          return!!(this.$.compareDocumentPosition(name.$) & 16);
        },
        focus : function() {
          function exec() {
            try {
              this.$.focus();
            } catch (f) {
            }
          }
          return function(dataAndEvents) {
            if (dataAndEvents) {
              CKEDITOR.tools.setTimeout(exec, 100, this);
            } else {
              exec.call(this);
            }
          };
        }(),
        getHtml : function() {
          var retval = this.$.innerHTML;
          return CKEDITOR.env.ie ? retval.replace(/<\?[^>]*>/g, "") : retval;
        },
        getOuterHtml : function() {
          if (this.$.outerHTML) {
            return this.$.outerHTML.replace(/<\?[^>]*>/, "");
          }
          var tmpDiv = this.$.ownerDocument.createElement("div");
          tmpDiv.appendChild(this.$.cloneNode(true));
          return tmpDiv.innerHTML;
        },
        getClientRect : function() {
          var rect = CKEDITOR.tools.extend({}, this.$.getBoundingClientRect());
          if (!rect.width) {
            rect.width = rect.right - rect.left;
          }
          if (!rect.height) {
            rect.height = rect.bottom - rect.top;
          }
          return rect;
        },
        setHtml : CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? function(html) {
          try {
            var node = this.$;
            if (this.getParent()) {
              return node.innerHTML = html;
            }
            var block = this.getDocument()._getHtml5ShivFrag();
            block.appendChild(node);
            node.innerHTML = html;
            block.removeChild(node);
            return html;
          } catch (d) {
            this.$.innerHTML = "";
            node = new CKEDITOR.dom.element("body", this.getDocument());
            node.$.innerHTML = html;
            node = node.getChildren();
            for (;node.count();) {
              this.append(node.getItem(0));
            }
            return html;
          }
        } : function(html) {
          return this.$.innerHTML = html;
        },
        setText : function(text) {
          CKEDITOR.dom.element.prototype.setText = this.$.innerText != void 0 ? function(text) {
            return this.$.innerText = text;
          } : function(text) {
            return this.$.textContent = text;
          };
          return this.setText(text);
        },
        getAttribute : function() {
          var standard = function(name) {
            return this.$.getAttribute(name, 2);
          };
          return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(name) {
            switch(name) {
              case "class":
                name = "className";
                break;
              case "http-equiv":
                name = "httpEquiv";
                break;
              case "name":
                return this.$.name;
              case "tabindex":
                name = this.$.getAttribute(name, 2);
                if (name !== 0) {
                  if (this.$.tabIndex === 0) {
                    name = null;
                  }
                }
                return name;
              case "checked":
                name = this.$.attributes.getNamedItem(name);
                return(name.specified ? name.nodeValue : this.$.checked) ? "checked" : null;
              case "hspace":
              ;
              case "value":
                return this.$[name];
              case "style":
                return this.$.style.cssText;
              case "contenteditable":
              ;
              case "contentEditable":
                return this.$.attributes.getNamedItem("contentEditable").specified ? this.$.getAttribute("contentEditable") : null;
            }
            return this.$.getAttribute(name, 2);
          } : standard;
        }(),
        getChildren : function() {
          return new CKEDITOR.dom.nodeList(this.$.childNodes);
        },
        getComputedStyle : CKEDITOR.env.ie ? function(property) {
          return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(property)];
        } : function(property) {
          var style = this.getWindow().$.getComputedStyle(this.$, null);
          return style ? style.getPropertyValue(property) : "";
        },
        getDtd : function() {
          var dtd = CKEDITOR.dtd[this.getName()];
          this.getDtd = function() {
            return dtd;
          };
          return dtd;
        },
        getElementsByTag : CKEDITOR.dom.document.prototype.getElementsByTag,
        getTabIndex : CKEDITOR.env.ie ? function() {
          var tabIndex = this.$.tabIndex;
          if (tabIndex === 0) {
            if (!CKEDITOR.dtd.$tabIndex[this.getName()] && parseInt(this.getAttribute("tabindex"), 10) !== 0) {
              tabIndex = -1;
            }
          }
          return tabIndex;
        } : CKEDITOR.env.webkit ? function() {
          var tabIndex = this.$.tabIndex;
          if (tabIndex == void 0) {
            tabIndex = parseInt(this.getAttribute("tabindex"), 10);
            if (isNaN(tabIndex)) {
              tabIndex = -1;
            }
          }
          return tabIndex;
        } : function() {
          return this.$.tabIndex;
        },
        getText : function() {
          return this.$.textContent || (this.$.innerText || "");
        },
        getWindow : function() {
          return this.getDocument().getWindow();
        },
        getId : function() {
          return this.$.id || null;
        },
        getNameAtt : function() {
          return this.$.name || null;
        },
        getName : function() {
          var nodeName = this.$.nodeName.toLowerCase();
          if (CKEDITOR.env.ie && !(document.documentMode > 8)) {
            var scopeName = this.$.scopeName;
            if (scopeName != "HTML") {
              nodeName = scopeName.toLowerCase() + ":" + nodeName;
            }
          }
          return(this.getName = function() {
            return nodeName;
          })();
        },
        getValue : function() {
          return this.$.value;
        },
        getFirst : function(evaluator) {
          var retval = this.$.firstChild;
          if (retval = retval && new CKEDITOR.dom.node(retval)) {
            if (evaluator && !evaluator(retval)) {
              retval = retval.getNext(evaluator);
            }
          }
          return retval;
        },
        getLast : function(evaluator) {
          var retval = this.$.lastChild;
          if (retval = retval && new CKEDITOR.dom.node(retval)) {
            if (evaluator && !evaluator(retval)) {
              retval = retval.getPrevious(evaluator);
            }
          }
          return retval;
        },
        getStyle : function(name) {
          return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(name)];
        },
        is : function() {
          var name = this.getName();
          if (typeof arguments[0] == "object") {
            return!!arguments[0][name];
          }
          var i = 0;
          for (;i < arguments.length;i++) {
            if (arguments[i] == name) {
              return true;
            }
          }
          return false;
        },
        isEditable : function(recurring) {
          var name = this.getName();
          if (this.isReadOnly() || (this.getComputedStyle("display") == "none" || (this.getComputedStyle("visibility") == "hidden" || (CKEDITOR.dtd.$nonEditable[name] || (CKEDITOR.dtd.$empty[name] || this.is("a") && ((this.data("cke-saved-name") || this.hasAttribute("name")) && !this.getChildCount())))))) {
            return false;
          }
          if (recurring !== false) {
            recurring = CKEDITOR.dtd[name] || CKEDITOR.dtd.span;
            return!(!recurring || !recurring["#"]);
          }
          return true;
        },
        isIdentical : function(otherEl) {
          var thisEl = this.clone(0, 1);
          otherEl = otherEl.clone(0, 1);
          thisEl.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
          otherEl.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
          if (thisEl.$.isEqualNode) {
            thisEl.$.style.cssText = CKEDITOR.tools.normalizeCssText(thisEl.$.style.cssText);
            otherEl.$.style.cssText = CKEDITOR.tools.normalizeCssText(otherEl.$.style.cssText);
            return thisEl.$.isEqualNode(otherEl.$);
          }
          thisEl = thisEl.getOuterHtml();
          otherEl = otherEl.getOuterHtml();
          if (CKEDITOR.env.ie && (CKEDITOR.env.version < 9 && this.is("a"))) {
            var el = this.getParent();
            if (el.type == CKEDITOR.NODE_ELEMENT) {
              el = el.clone();
              el.setHtml(thisEl);
              thisEl = el.getHtml();
              el.setHtml(otherEl);
              otherEl = el.getHtml();
            }
          }
          return thisEl == otherEl;
        },
        isVisible : function() {
          var isRtl = (this.$.offsetHeight || this.$.offsetWidth) && this.getComputedStyle("visibility") != "hidden";
          var elementWindow;
          var elementWindowFrame;
          if (isRtl && CKEDITOR.env.webkit) {
            elementWindow = this.getWindow();
            if (!elementWindow.equals(CKEDITOR.document.getWindow()) && (elementWindowFrame = elementWindow.$.frameElement)) {
              isRtl = (new CKEDITOR.dom.element(elementWindowFrame)).isVisible();
            }
          }
          return!!isRtl;
        },
        isEmptyInlineRemoveable : function() {
          if (!CKEDITOR.dtd.$removeEmpty[this.getName()]) {
            return false;
          }
          var children = this.getChildren();
          var i = 0;
          var padLength = children.count();
          for (;i < padLength;i++) {
            var child = children.getItem(i);
            if (!(child.type == CKEDITOR.NODE_ELEMENT && child.data("cke-bookmark")) && (child.type == CKEDITOR.NODE_ELEMENT && !child.isEmptyInlineRemoveable() || child.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(child.getText()))) {
              return false;
            }
          }
          return true;
        },
        hasAttributes : CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function() {
          var attributes = this.$.attributes;
          var i = 0;
          for (;i < attributes.length;i++) {
            var attribute = attributes[i];
            switch(attribute.nodeName) {
              case "class":
                if (this.getAttribute("class")) {
                  return true;
                }
              ;
              case "data-cke-expando":
                continue;
              default:
                if (attribute.specified) {
                  return true;
                }
              ;
            }
          }
          return false;
        } : function() {
          var attrs = this.$.attributes;
          var al = attrs.length;
          var execludeAttrs = {
            "data-cke-expando" : 1,
            _moz_dirty : 1
          };
          return al > 0 && (al > 2 || (!execludeAttrs[attrs[0].nodeName] || al == 2 && !execludeAttrs[attrs[1].nodeName]));
        },
        hasAttribute : function() {
          function init(attr) {
            return(attr = this.$.attributes.getNamedItem(attr)) ? CKEDITOR.env.ie ? attr.specified : true : false;
          }
          return CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? function(key) {
            return key == "name" ? !!this.$.name : init.call(this, key);
          } : init;
        }(),
        hide : function() {
          this.setStyle("display", "none");
        },
        moveChildren : function(node, toStart) {
          var $ = this.$;
          node = node.$;
          if ($ != node) {
            var child;
            if (toStart) {
              for (;child = $.lastChild;) {
                node.insertBefore($.removeChild(child), node.firstChild);
              }
            } else {
              for (;child = $.firstChild;) {
                node.appendChild($.removeChild(child));
              }
            }
          }
        },
        mergeSiblings : function() {
          function mergeElements(element, sibling, isNext) {
            if (sibling && sibling.type == CKEDITOR.NODE_ELEMENT) {
              var pendingNodes = [];
              for (;sibling.data("cke-bookmark") || sibling.isEmptyInlineRemoveable();) {
                pendingNodes.push(sibling);
                sibling = isNext ? sibling.getNext() : sibling.getPrevious();
                if (!sibling || sibling.type != CKEDITOR.NODE_ELEMENT) {
                  return;
                }
              }
              if (element.isIdentical(sibling)) {
                var innerSibling = isNext ? element.getLast() : element.getFirst();
                for (;pendingNodes.length;) {
                  pendingNodes.shift().move(element, !isNext);
                }
                sibling.moveChildren(element, !isNext);
                sibling.remove();
                if (innerSibling) {
                  if (innerSibling.type == CKEDITOR.NODE_ELEMENT) {
                    innerSibling.mergeSiblings();
                  }
                }
              }
            }
          }
          return function(dataAndEvents) {
            if (dataAndEvents === false || (CKEDITOR.dtd.$removeEmpty[this.getName()] || this.is("a"))) {
              mergeElements(this, this.getNext(), true);
              mergeElements(this, this.getPrevious());
            }
          };
        }(),
        show : function() {
          this.setStyles({
            display : "",
            visibility : ""
          });
        },
        setAttribute : function() {
          var fn = function(name, value) {
            this.$.setAttribute(name, value);
            return this;
          };
          return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(name, key) {
            if (name == "class") {
              this.$.className = key;
            } else {
              if (name == "style") {
                this.$.style.cssText = key;
              } else {
                if (name == "tabindex") {
                  this.$.tabIndex = key;
                } else {
                  if (name == "checked") {
                    this.$.checked = key;
                  } else {
                    if (name == "contenteditable") {
                      fn.call(this, "contentEditable", key);
                    } else {
                      fn.apply(this, arguments);
                    }
                  }
                }
              }
            }
            return this;
          } : CKEDITOR.env.ie8Compat && CKEDITOR.env.secure ? function(attributeName, optionsString) {
            if (attributeName == "src" && optionsString.match(/^http:\/\//)) {
              try {
                fn.apply(this, arguments);
              } catch (d) {
              }
            } else {
              fn.apply(this, arguments);
            }
            return this;
          } : fn;
        }(),
        setAttributes : function(opt_attributes) {
          var i;
          for (i in opt_attributes) {
            this.setAttribute(i, opt_attributes[i]);
          }
          return this;
        },
        setValue : function(value) {
          this.$.value = value;
          return this;
        },
        removeAttribute : function() {
          var listener = function(eventName) {
            this.$.removeAttribute(eventName);
          };
          return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(name) {
            if (name == "class") {
              name = "className";
            } else {
              if (name == "tabindex") {
                name = "tabIndex";
              } else {
                if (name == "contenteditable") {
                  name = "contentEditable";
                }
              }
            }
            this.$.removeAttribute(name);
          } : listener;
        }(),
        removeAttributes : function(attributes) {
          if (CKEDITOR.tools.isArray(attributes)) {
            var i = 0;
            for (;i < attributes.length;i++) {
              this.removeAttribute(attributes[i]);
            }
          } else {
            for (i in attributes) {
              if (attributes.hasOwnProperty(i)) {
                this.removeAttribute(i);
              }
            }
          }
        },
        removeStyle : function(name) {
          var $ = this.$.style;
          if (!$.removeProperty && (name == "border" || (name == "margin" || name == "padding"))) {
            var sides = ["top", "left", "right", "bottom"];
            var components;
            if (name == "border") {
              components = ["color", "style", "width"];
            }
            $ = [];
            var i = 0;
            for (;i < sides.length;i++) {
              if (components) {
                var j = 0;
                for (;j < components.length;j++) {
                  $.push([name, sides[i], components[j]].join("-"));
                }
              } else {
                $.push([name, sides[i]].join("-"));
              }
            }
            name = 0;
            for (;name < $.length;name++) {
              this.removeStyle($[name]);
            }
          } else {
            if ($.removeProperty) {
              $.removeProperty(name);
            } else {
              $.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(name));
            }
            if (!this.$.style.cssText) {
              this.removeAttribute("style");
            }
          }
        },
        setStyle : function(name, value) {
          this.$.style[CKEDITOR.tools.cssStyleToDomStyle(name)] = value;
          return this;
        },
        setStyles : function(opt_attributes) {
          var prop;
          for (prop in opt_attributes) {
            this.setStyle(prop, opt_attributes[prop]);
          }
          return this;
        },
        setOpacity : function(opacity) {
          if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
            opacity = Math.round(opacity * 100);
            this.setStyle("filter", opacity >= 100 ? "" : "progid:DXImageTransform.Microsoft.Alpha(opacity=" + opacity + ")");
          } else {
            this.setStyle("opacity", opacity);
          }
        },
        unselectable : function() {
          this.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select", "none"));
          if (CKEDITOR.env.ie) {
            this.setAttribute("unselectable", "on");
            var e;
            var elements = this.getElementsByTag("*");
            var i = 0;
            var padLength = elements.count();
            for (;i < padLength;i++) {
              e = elements.getItem(i);
              e.setAttribute("unselectable", "on");
            }
          }
        },
        getPositionedAncestor : function() {
          var current = this;
          for (;current.getName() != "html";) {
            if (current.getComputedStyle("position") != "static") {
              return current;
            }
            current = current.getParent();
          }
          return null;
        },
        getDocumentPosition : function(el) {
          var left = 0;
          var top = 0;
          var doc = this.getDocument();
          var node = doc.getBody();
          var quirks = doc.$.compatMode == "BackCompat";
          if (document.documentElement.getBoundingClientRect) {
            var parent = this.$.getBoundingClientRect();
            var $docElem = doc.$.documentElement;
            var m = $docElem.clientTop || (node.$.clientTop || 0);
            var pLeft = $docElem.clientLeft || (node.$.clientLeft || 0);
            var inDocElem = true;
            if (CKEDITOR.env.ie) {
              inDocElem = doc.getDocumentElement().contains(this);
              doc = doc.getBody().contains(this);
              inDocElem = quirks && doc || !quirks && inDocElem;
            }
            if (inDocElem) {
              left = parent.left + (!quirks && $docElem.scrollLeft || node.$.scrollLeft);
              left = left - pLeft;
              top = parent.top + (!quirks && $docElem.scrollTop || node.$.scrollTop);
              top = top - m;
            }
          } else {
            node = this;
            doc = null;
            for (;node && !(node.getName() == "body" || node.getName() == "html");) {
              left = left + (node.$.offsetLeft - node.$.scrollLeft);
              top = top + (node.$.offsetTop - node.$.scrollTop);
              if (!node.equals(this)) {
                left = left + (node.$.clientLeft || 0);
                top = top + (node.$.clientTop || 0);
              }
              for (;doc && !doc.equals(node);) {
                left = left - doc.$.scrollLeft;
                top = top - doc.$.scrollTop;
                doc = doc.getParent();
              }
              doc = node;
              node = (parent = node.$.offsetParent) ? new CKEDITOR.dom.element(parent) : null;
            }
          }
          if (el) {
            node = this.getWindow();
            doc = el.getWindow();
            if (!node.equals(doc) && node.$.frameElement) {
              el = (new CKEDITOR.dom.element(node.$.frameElement)).getDocumentPosition(el);
              left = left + el.x;
              top = top + el.y;
            }
          }
          if (!document.documentElement.getBoundingClientRect && (CKEDITOR.env.gecko && !quirks)) {
            left = left + (this.$.clientLeft ? 1 : 0);
            top = top + (this.$.clientTop ? 1 : 0);
          }
          return{
            x : left,
            y : top
          };
        },
        scrollIntoView : function(deepDataAndEvents) {
          var parent = this.getParent();
          if (parent) {
            do {
              if (parent.$.clientWidth && parent.$.clientWidth < parent.$.scrollWidth || parent.$.clientHeight && parent.$.clientHeight < parent.$.scrollHeight) {
                if (!parent.is("body")) {
                  this.scrollIntoParent(parent, deepDataAndEvents, 1);
                }
              }
              if (parent.is("html")) {
                var win = parent.getWindow();
                try {
                  var iframe = win.$.frameElement;
                  if (iframe) {
                    parent = new CKEDITOR.dom.element(iframe);
                  }
                } catch (e) {
                }
              }
            } while (parent = parent.getParent());
          }
        },
        scrollIntoParent : function(parent, deepDataAndEvents, dataAndEvents) {
          function scrollBy(x, y) {
            if (/body|html/.test(parent.getName())) {
              parent.getWindow().$.scrollBy(x, y);
            } else {
              parent.$.scrollLeft = parent.$.scrollLeft + x;
              parent.$.scrollTop = parent.$.scrollTop + y;
            }
          }
          function screenPos(element, val) {
            var pos = {
              x : 0,
              y : 0
            };
            if (!element.is(isQuirks ? "body" : "html")) {
              var el = element.$.getBoundingClientRect();
              pos.x = el.left;
              pos.y = el.top;
            }
            el = element.getWindow();
            if (!el.equals(val)) {
              el = screenPos(CKEDITOR.dom.element.get(el.$.frameElement), val);
              pos.x = pos.x + el.x;
              pos.y = pos.y + el.y;
            }
            return pos;
          }
          function margin(el, side) {
            return parseInt(el.getComputedStyle("margin-" + side) || 0, 10) || 0;
          }
          var ew;
          var thisPos;
          var doc;
          var n;
          if (!parent) {
            parent = this.getWindow();
          }
          doc = parent.getDocument();
          var isQuirks = doc.$.compatMode == "BackCompat";
          if (parent instanceof CKEDITOR.dom.window) {
            parent = isQuirks ? doc.getBody() : doc.getDocumentElement();
          }
          doc = parent.getWindow();
          thisPos = screenPos(this, doc);
          var parentPos = screenPos(parent, doc);
          var eh = this.$.offsetHeight;
          ew = this.$.offsetWidth;
          var ch = parent.$.clientHeight;
          var cw = parent.$.clientWidth;
          doc = thisPos.x - margin(this, "left") - parentPos.x || 0;
          n = thisPos.y - margin(this, "top") - parentPos.y || 0;
          ew = thisPos.x + ew + margin(this, "right") - (parentPos.x + cw) || 0;
          thisPos = thisPos.y + eh + margin(this, "bottom") - (parentPos.y + ch) || 0;
          if (n < 0 || thisPos > 0) {
            scrollBy(0, deepDataAndEvents === true ? n : deepDataAndEvents === false ? thisPos : n < 0 ? n : thisPos);
          }
          if (dataAndEvents && (doc < 0 || ew > 0)) {
            scrollBy(doc < 0 ? doc : ew, 0);
          }
        },
        setState : function(state, base, control) {
          base = base || "cke";
          switch(state) {
            case CKEDITOR.TRISTATE_ON:
              this.addClass(base + "_on");
              this.removeClass(base + "_off");
              this.removeClass(base + "_disabled");
              if (control) {
                this.setAttribute("aria-pressed", true);
              }
              if (control) {
                this.removeAttribute("aria-disabled");
              }
              break;
            case CKEDITOR.TRISTATE_DISABLED:
              this.addClass(base + "_disabled");
              this.removeClass(base + "_off");
              this.removeClass(base + "_on");
              if (control) {
                this.setAttribute("aria-disabled", true);
              }
              if (control) {
                this.removeAttribute("aria-pressed");
              }
              break;
            default:
              this.addClass(base + "_off");
              this.removeClass(base + "_on");
              this.removeClass(base + "_disabled");
              if (control) {
                this.removeAttribute("aria-pressed");
              }
              if (control) {
                this.removeAttribute("aria-disabled");
              }
            ;
          }
        },
        getFrameDocument : function() {
          var $ = this.$;
          try {
            $.contentWindow.document;
          } catch (c) {
            $.src = $.src;
          }
          return $ && new CKEDITOR.dom.document($.contentWindow.document);
        },
        copyAttributes : function(node, skipAttributes) {
          var attributes = this.$.attributes;
          skipAttributes = skipAttributes || {};
          var i = 0;
          for (;i < attributes.length;i++) {
            var attribute = attributes[i];
            var attrName = attribute.nodeName.toLowerCase();
            var attrValue;
            if (!(attrName in skipAttributes)) {
              if (attrName == "checked" && (attrValue = this.getAttribute(attrName))) {
                node.setAttribute(attrName, attrValue);
              } else {
                if (!CKEDITOR.env.ie || this.hasAttribute(attrName)) {
                  attrValue = this.getAttribute(attrName);
                  if (attrValue === null) {
                    attrValue = attribute.nodeValue;
                  }
                  node.setAttribute(attrName, attrValue);
                }
              }
            }
          }
          if (this.$.style.cssText !== "") {
            node.$.style.cssText = this.$.style.cssText;
          }
        },
        renameNode : function(newNode) {
          if (this.getName() != newNode) {
            var doc = this.getDocument();
            newNode = new CKEDITOR.dom.element(newNode, doc);
            this.copyAttributes(newNode);
            this.moveChildren(newNode);
            if (this.getParent()) {
              this.$.parentNode.replaceChild(newNode.$, this.$);
            }
            newNode.$["data-cke-expando"] = this.$["data-cke-expando"];
            this.$ = newNode.$;
            delete this.getName;
          }
        },
        getChild : function() {
          function traverseNode(node, i) {
            var codeSegments = node.childNodes;
            if (i >= 0 && i < codeSegments.length) {
              return codeSegments[i];
            }
          }
          return function(segments) {
            var node = this.$;
            if (segments.slice) {
              for (;segments.length > 0 && node;) {
                node = traverseNode(node, segments.shift());
              }
            } else {
              node = traverseNode(node, segments);
            }
            return node ? new CKEDITOR.dom.node(node) : null;
          };
        }(),
        getChildCount : function() {
          return this.$.childNodes.length;
        },
        disableContextMenu : function() {
          this.on("contextmenu", function(evt) {
            if (!evt.data.getTarget().hasClass("cke_enable_context_menu")) {
              evt.data.preventDefault();
            }
          });
        },
        getDirection : function(dataAndEvents) {
          return dataAndEvents ? this.getComputedStyle("direction") || (this.getDirection() || (this.getParent() && this.getParent().getDirection(1) || (this.getDocument().$.dir || "ltr"))) : this.getStyle("direction") || this.getAttribute("dir");
        },
        data : function(name, keepData) {
          name = "data-" + name;
          if (keepData === void 0) {
            return this.getAttribute(name);
          }
          if (keepData === false) {
            this.removeAttribute(name);
          } else {
            this.setAttribute(name, keepData);
          }
          return null;
        },
        getEditor : function() {
          var instances = CKEDITOR.instances;
          var id;
          var instance;
          for (id in instances) {
            instance = instances[id];
            if (instance.element.equals(this) && instance.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
              return instance;
            }
          }
          return null;
        },
        find : function(selector) {
          var removeTmpId = createTmpId(this);
          selector = new CKEDITOR.dom.nodeList(this.$.querySelectorAll(getContextualizedSelector(this, selector)));
          removeTmpId();
          return selector;
        },
        findOne : function(selector) {
          var removeTmpId = createTmpId(this);
          selector = this.$.querySelector(getContextualizedSelector(this, selector));
          removeTmpId();
          return selector ? new CKEDITOR.dom.element(selector) : null;
        },
        forEach : function(fn, type, dataAndEvents) {
          if (!dataAndEvents && (!type || this.type == type)) {
            var child = fn(this)
          }
          if (child !== false) {
            dataAndEvents = this.getChildren();
            var i = 0;
            for (;i < dataAndEvents.count();i++) {
              child = dataAndEvents.getItem(i);
              if (child.type == CKEDITOR.NODE_ELEMENT) {
                child.forEach(fn, type);
              } else {
                if (!type || child.type == type) {
                  fn(child);
                }
              }
            }
          }
        }
      });
      var expected = {
        width : ["border-left-width", "border-right-width", "padding-left", "padding-right"],
        height : ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom"]
      };
      CKEDITOR.dom.element.prototype.setSize = function(key, size, dataAndEvents) {
        if (typeof size == "number") {
          if (dataAndEvents && (!CKEDITOR.env.ie || !CKEDITOR.env.quirks)) {
            size = size - replacer.call(this, key);
          }
          this.setStyle(key, size + "px");
        }
      };
      CKEDITOR.dom.element.prototype.getSize = function(key, dataAndEvents) {
        var size = Math.max(this.$["offset" + CKEDITOR.tools.capitalize(key)], this.$["client" + CKEDITOR.tools.capitalize(key)]) || 0;
        if (dataAndEvents) {
          size = size - replacer.call(this, key);
        }
        return size;
      };
    })();
    CKEDITOR.dom.documentFragment = function(nodeOrDoc) {
      nodeOrDoc = nodeOrDoc || CKEDITOR.document;
      this.$ = nodeOrDoc.type == CKEDITOR.NODE_DOCUMENT ? nodeOrDoc.$.createDocumentFragment() : nodeOrDoc;
    };
    CKEDITOR.tools.extend(CKEDITOR.dom.documentFragment.prototype, CKEDITOR.dom.element.prototype, {
      type : CKEDITOR.NODE_DOCUMENT_FRAGMENT,
      insertAfterNode : function(node) {
        node = node.$;
        node.parentNode.insertBefore(this.$, node.nextSibling);
      }
    }, true, {
      append : 1,
      appendBogus : 1,
      getFirst : 1,
      getLast : 1,
      getParent : 1,
      getNext : 1,
      getPrevious : 1,
      appendTo : 1,
      moveChildren : 1,
      insertBefore : 1,
      insertAfterNode : 1,
      replace : 1,
      trim : 1,
      type : 1,
      ltrim : 1,
      rtrim : 1,
      getDocument : 1,
      getChildCount : 1,
      getChild : 1,
      getChildren : 1
    });
    (function() {
      function iterate(rtl, breakOnFalse) {
        var range = this.range;
        if (this._.end) {
          return null;
        }
        if (!this._.start) {
          this._.start = 1;
          if (range.collapsed) {
            this.end();
            return null;
          }
          range.optimize();
        }
        var optgroup;
        var startCt = range.startContainer;
        optgroup = range.endContainer;
        var startOffset = range.startOffset;
        var endOffset = range.endOffset;
        var guard;
        var getter = this.guard;
        var type = this.type;
        var getSourceNodeFn = rtl ? "getPreviousSourceNode" : "getNextSourceNode";
        if (!rtl && !this._.guardLTR) {
          var block = optgroup.type == CKEDITOR.NODE_ELEMENT ? optgroup : optgroup.getParent();
          var attribute = optgroup.type == CKEDITOR.NODE_ELEMENT ? optgroup.getChild(endOffset) : optgroup.getNext();
          this._.guardLTR = function(node, deepDataAndEvents) {
            return(!deepDataAndEvents || !block.equals(node)) && ((!attribute || !node.equals(attribute)) && (node.type != CKEDITOR.NODE_ELEMENT || (!deepDataAndEvents || !node.equals(range.root))));
          };
        }
        if (rtl && !this._.guardRTL) {
          var limitRTL = startCt.type == CKEDITOR.NODE_ELEMENT ? startCt : startCt.getParent();
          var child = startCt.type == CKEDITOR.NODE_ELEMENT ? startOffset ? startCt.getChild(startOffset - 1) : null : startCt.getPrevious();
          this._.guardRTL = function(node, deepDataAndEvents) {
            return(!deepDataAndEvents || !limitRTL.equals(node)) && ((!child || !node.equals(child)) && (node.type != CKEDITOR.NODE_ELEMENT || (!deepDataAndEvents || !node.equals(range.root))));
          };
        }
        var done = rtl ? this._.guardRTL : this._.guardLTR;
        guard = getter ? function(vvar, deepDataAndEvents) {
          return done(vvar, deepDataAndEvents) === false ? false : getter(vvar, deepDataAndEvents);
        } : done;
        if (this.current) {
          optgroup = this.current[getSourceNodeFn](false, type, guard);
        } else {
          if (rtl) {
            if (optgroup.type == CKEDITOR.NODE_ELEMENT) {
              optgroup = endOffset > 0 ? optgroup.getChild(endOffset - 1) : guard(optgroup, true) === false ? null : optgroup.getPreviousSourceNode(true, type, guard);
            }
          } else {
            optgroup = startCt;
            if (optgroup.type == CKEDITOR.NODE_ELEMENT && !(optgroup = optgroup.getChild(startOffset))) {
              optgroup = guard(startCt, true) === false ? null : startCt.getNextSourceNode(true, type, guard);
            }
          }
          if (optgroup) {
            if (guard(optgroup) === false) {
              optgroup = null;
            }
          }
        }
        for (;optgroup && !this._.end;) {
          this.current = optgroup;
          if (!this.evaluator || this.evaluator(optgroup) !== false) {
            if (!breakOnFalse) {
              return optgroup;
            }
          } else {
            if (breakOnFalse && this.evaluator) {
              return false;
            }
          }
          optgroup = optgroup[getSourceNodeFn](false, type, guard);
        }
        this.end();
        return this.current = null;
      }
      function set(key) {
        var data;
        var values = null;
        for (;data = iterate.call(this, key);) {
          values = data;
        }
        return values;
      }
      function isEditable(node) {
        if (isIgnored(node)) {
          return false;
        }
        if (node.type == CKEDITOR.NODE_TEXT) {
          return true;
        }
        if (node.type == CKEDITOR.NODE_ELEMENT) {
          if (node.is(CKEDITOR.dtd.$inline) || (node.is("hr") || node.getAttribute("contenteditable") == "false")) {
            return true;
          }
          var i;
          if (i = !CKEDITOR.env.needsBrFiller) {
            if (i = node.is(optgroup)) {
              a: {
                i = 0;
                var padLength = node.getChildCount();
                for (;i < padLength;++i) {
                  if (!isIgnored(node.getChild(i))) {
                    i = false;
                    break a;
                  }
                }
                i = true;
              }
            }
          }
          if (i) {
            return true;
          }
        }
        return false;
      }
      CKEDITOR.dom.walker = CKEDITOR.tools.createClass({
        $ : function(name) {
          this.range = name;
          this._ = {};
        },
        proto : {
          end : function() {
            this._.end = 1;
          },
          next : function() {
            return iterate.call(this);
          },
          previous : function() {
            return iterate.call(this, 1);
          },
          checkForward : function() {
            return iterate.call(this, 0, 1) !== false;
          },
          checkBackward : function() {
            return iterate.call(this, 1, 1) !== false;
          },
          lastForward : function() {
            return set.call(this);
          },
          lastBackward : function() {
            return set.call(this, 1);
          },
          reset : function() {
            delete this.current;
            this._ = {};
          }
        }
      });
      var blockBoundaryDisplayMatch = {
        block : 1,
        "list-item" : 1,
        table : 1,
        "table-row-group" : 1,
        "table-header-group" : 1,
        "table-footer-group" : 1,
        "table-row" : 1,
        "table-column-group" : 1,
        "table-column" : 1,
        "table-cell" : 1,
        "table-caption" : 1
      };
      var outOfFlowPositions = {
        absolute : 1,
        fixed : 1
      };
      CKEDITOR.dom.element.prototype.isBlockBoundary = function(optgroup) {
        return this.getComputedStyle("float") == "none" && (!(this.getComputedStyle("position") in outOfFlowPositions) && blockBoundaryDisplayMatch[this.getComputedStyle("display")]) ? true : !!(this.is(CKEDITOR.dtd.$block) || optgroup && this.is(optgroup));
      };
      CKEDITOR.dom.walker.blockBoundary = function(customNodeNames) {
        return function(node) {
          return!(node.type == CKEDITOR.NODE_ELEMENT && node.isBlockBoundary(customNodeNames));
        };
      };
      CKEDITOR.dom.walker.listItemBoundary = function() {
        return this.blockBoundary({
          br : 1
        });
      };
      CKEDITOR.dom.walker.bookmark = function(recurring, dataAndEvents) {
        function isBookmarkNode(node) {
          return node && (node.getName && (node.getName() == "span" && node.data("cke-bookmark")));
        }
        return function(node) {
          var isBookmark;
          var parent;
          isBookmark = node && (node.type != CKEDITOR.NODE_ELEMENT && ((parent = node.getParent()) && isBookmarkNode(parent)));
          isBookmark = recurring ? isBookmark : isBookmark || isBookmarkNode(node);
          return!!(dataAndEvents ^ isBookmark);
        };
      };
      CKEDITOR.dom.walker.whitespaces = function(dataAndEvents) {
        return function(node) {
          var c;
          if (node) {
            if (node.type == CKEDITOR.NODE_TEXT) {
              c = !CKEDITOR.tools.trim(node.getText()) || CKEDITOR.env.webkit && node.getText() == "\u200b";
            }
          }
          return!!(dataAndEvents ^ c);
        };
      };
      CKEDITOR.dom.walker.invisible = function(dataAndEvents) {
        var traverseNode = CKEDITOR.dom.walker.whitespaces();
        return function(node) {
          if (traverseNode(node)) {
            node = 1;
          } else {
            if (node.type == CKEDITOR.NODE_TEXT) {
              node = node.getParent();
            }
            node = !node.$.offsetHeight;
          }
          return!!(dataAndEvents ^ node);
        };
      };
      CKEDITOR.dom.walker.nodeType = function(type, isReject) {
        return function(panel) {
          return!!(isReject ^ panel.type == type);
        };
      };
      CKEDITOR.dom.walker.bogus = function(isReject) {
        function nonEmpty(node) {
          return!traverseNode(node) && !isBookmark(node);
        }
        return function(node) {
          var parent = CKEDITOR.env.needsBrFiller ? node.is && node.is("br") : node.getText && rhtml.test(node.getText());
          if (parent) {
            parent = node.getParent();
            node = node.getNext(nonEmpty);
            parent = parent.isBlockBoundary() && (!node || node.type == CKEDITOR.NODE_ELEMENT && node.isBlockBoundary());
          }
          return!!(isReject ^ parent);
        };
      };
      CKEDITOR.dom.walker.temp = function(isReject) {
        return function(node) {
          if (node.type != CKEDITOR.NODE_ELEMENT) {
            node = node.getParent();
          }
          node = node && node.hasAttribute("data-cke-temp");
          return!!(isReject ^ node);
        };
      };
      var rhtml = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/;
      var traverseNode = CKEDITOR.dom.walker.whitespaces();
      var isBookmark = CKEDITOR.dom.walker.bookmark();
      var isTemp = CKEDITOR.dom.walker.temp();
      CKEDITOR.dom.walker.ignored = function(dataAndEvents) {
        return function(node) {
          node = traverseNode(node) || (isBookmark(node) || isTemp(node));
          return!!(dataAndEvents ^ node);
        };
      };
      var isIgnored = CKEDITOR.dom.walker.ignored();
      var optgroup = function(prop) {
        var old = {};
        var name;
        for (name in prop) {
          if (CKEDITOR.dtd[name]["#"]) {
            old[name] = 1;
          }
        }
        return old;
      }(CKEDITOR.dtd.$block);
      CKEDITOR.dom.walker.editable = function(name) {
        return function(node) {
          return!!(name ^ isEditable(node));
        };
      };
      CKEDITOR.dom.element.prototype.getBogus = function() {
        var node = this;
        do {
          node = node.getPreviousSourceNode();
        } while (isBookmark(node) || (traverseNode(node) || node.type == CKEDITOR.NODE_ELEMENT && (node.is(CKEDITOR.dtd.$inline) && !node.is(CKEDITOR.dtd.$empty))));
        return node && (CKEDITOR.env.needsBrFiller ? node.is && node.is("br") : node.getText && rhtml.test(node.getText())) ? node : false;
      };
    })();
    CKEDITOR.dom.range = function(name) {
      this.endOffset = this.endContainer = this.startOffset = this.startContainer = null;
      this.collapsed = true;
      var isDocRoot = name instanceof CKEDITOR.dom.document;
      this.document = isDocRoot ? name : name.getDocument();
      this.root = isDocRoot ? name.getBody() : name;
    };
    (function() {
      function getCheckStartEndBlockEvalFunction() {
        var skipBogus = false;
        var whitespaces = CKEDITOR.dom.walker.whitespaces();
        var bookmarkEvaluator = CKEDITOR.dom.walker.bookmark(true);
        var isBogus = CKEDITOR.dom.walker.bogus();
        return function(node) {
          if (bookmarkEvaluator(node) || whitespaces(node)) {
            return true;
          }
          if (isBogus(node) && !skipBogus) {
            return skipBogus = true;
          }
          return node.type == CKEDITOR.NODE_TEXT && (node.hasAscendant("pre") || CKEDITOR.tools.trim(node.getText()).length) || node.type == CKEDITOR.NODE_ELEMENT && !node.is(optgroup) ? false : true;
        };
      }
      function elementBoundaryEval(checkStart) {
        var whitespaces = CKEDITOR.dom.walker.whitespaces();
        var bookmark = CKEDITOR.dom.walker.bookmark(1);
        return function(node) {
          return bookmark(node) || whitespaces(node) ? true : !checkStart && isBogus(node) || node.type == CKEDITOR.NODE_ELEMENT && node.is(CKEDITOR.dtd.$removeEmpty);
        };
      }
      function getNextEditableNode(isPrevious) {
        return function() {
          var first;
          return this[isPrevious ? "getPreviousNode" : "getNextNode"](function(node) {
            if (!first) {
              if (notIgnoredEval(node)) {
                first = node;
              }
            }
            return traverseNode(node) && !(isBogus(node) && node.equals(first));
          });
        };
      }
      var updateCollapsed = function(range) {
        range.collapsed = range.startContainer && (range.endContainer && (range.startContainer.equals(range.endContainer) && range.startOffset == range.endOffset));
      };
      var execContentsAction = function(range, startOffset, id, deepDataAndEvents) {
        range.optimizeBookmark();
        var startNode = range.startContainer;
        var endNode = range.endContainer;
        var a = range.startOffset;
        var c = range.endOffset;
        var j;
        var i;
        if (endNode.type == CKEDITOR.NODE_TEXT) {
          endNode = endNode.split(c);
        } else {
          if (endNode.getChildCount() > 0) {
            if (c >= endNode.getChildCount()) {
              endNode = endNode.append(range.document.createText(""));
              i = true;
            } else {
              endNode = endNode.getChild(c);
            }
          }
        }
        if (startNode.type == CKEDITOR.NODE_TEXT) {
          startNode.split(a);
          if (startNode.equals(endNode)) {
            endNode = startNode.getNext();
          }
        } else {
          if (a) {
            if (a >= startNode.getChildCount()) {
              startNode = startNode.append(range.document.createText(""));
              j = true;
            } else {
              startNode = startNode.getChild(a).getPrevious();
            }
          } else {
            startNode = startNode.append(range.document.createText(""), 1);
            j = true;
          }
        }
        a = startNode.getParents();
        c = endNode.getParents();
        var key;
        var node;
        var child;
        key = 0;
        for (;key < a.length;key++) {
          node = a[key];
          child = c[key];
          if (!node.equals(child)) {
            break;
          }
        }
        var target = id;
        var self;
        var temp;
        var fn;
        var k = key;
        for (;k < a.length;k++) {
          self = a[k];
          if (target) {
            if (!self.equals(startNode)) {
              temp = target.append(self.clone());
            }
          }
          self = self.getNext();
          for (;self;) {
            if (self.equals(c[k]) || self.equals(endNode)) {
              break;
            }
            fn = self.getNext();
            if (startOffset == 2) {
              target.append(self.clone(true));
            } else {
              self.remove();
              if (startOffset == 1) {
                target.append(self);
              }
            }
            self = fn;
          }
          if (target) {
            target = temp;
          }
        }
        target = id;
        id = key;
        for (;id < c.length;id++) {
          self = c[id];
          if (startOffset > 0) {
            if (!self.equals(endNode)) {
              temp = target.append(self.clone());
            }
          }
          if (!a[id] || self.$.parentNode != a[id].$.parentNode) {
            self = self.getPrevious();
            for (;self;) {
              if (self.equals(a[id]) || self.equals(startNode)) {
                break;
              }
              fn = self.getPrevious();
              if (startOffset == 2) {
                target.$.insertBefore(self.$.cloneNode(true), target.$.firstChild);
              } else {
                self.remove();
                if (startOffset == 1) {
                  target.$.insertBefore(self.$, target.$.firstChild);
                }
              }
              self = fn;
            }
          }
          if (target) {
            target = temp;
          }
        }
        if (startOffset == 2) {
          node = range.startContainer;
          if (node.type == CKEDITOR.NODE_TEXT) {
            node.$.data = node.$.data + node.$.nextSibling.data;
            node.$.parentNode.removeChild(node.$.nextSibling);
          }
          range = range.endContainer;
          if (range.type == CKEDITOR.NODE_TEXT && range.$.nextSibling) {
            range.$.data = range.$.data + range.$.nextSibling.data;
            range.$.parentNode.removeChild(range.$.nextSibling);
          }
        } else {
          if (node && (child && (startNode.$.parentNode != node.$.parentNode || endNode.$.parentNode != child.$.parentNode))) {
            startOffset = child.getIndex();
            if (j) {
              if (child.$.parentNode == startNode.$.parentNode) {
                startOffset--;
              }
            }
            if (deepDataAndEvents && node.type == CKEDITOR.NODE_ELEMENT) {
              deepDataAndEvents = CKEDITOR.dom.element.createFromHtml('<span data-cke-bookmark="1" style="display:none">&nbsp;</span>', range.document);
              deepDataAndEvents.insertAfter(node);
              node.mergeSiblings(false);
              range.moveToBookmark({
                startNode : deepDataAndEvents
              });
            } else {
              range.setStart(child.getParent(), startOffset);
            }
          }
          range.collapse(true);
        }
        if (j) {
          startNode.remove();
        }
        if (i) {
          if (endNode.$.parentNode) {
            endNode.remove();
          }
        }
      };
      var optgroup = {
        abbr : 1,
        acronym : 1,
        b : 1,
        bdo : 1,
        big : 1,
        cite : 1,
        code : 1,
        del : 1,
        dfn : 1,
        em : 1,
        font : 1,
        i : 1,
        ins : 1,
        label : 1,
        kbd : 1,
        q : 1,
        samp : 1,
        small : 1,
        span : 1,
        strike : 1,
        strong : 1,
        sub : 1,
        sup : 1,
        tt : 1,
        u : 1,
        "var" : 1
      };
      var isBogus = CKEDITOR.dom.walker.bogus();
      var ignore = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/;
      var traverseNode = CKEDITOR.dom.walker.editable();
      var notIgnoredEval = CKEDITOR.dom.walker.ignored(true);
      CKEDITOR.dom.range.prototype = {
        clone : function() {
          var clone = new CKEDITOR.dom.range(this.root);
          clone.startContainer = this.startContainer;
          clone.startOffset = this.startOffset;
          clone.endContainer = this.endContainer;
          clone.endOffset = this.endOffset;
          clone.collapsed = this.collapsed;
          return clone;
        },
        collapse : function(recurring) {
          if (recurring) {
            this.endContainer = this.startContainer;
            this.endOffset = this.startOffset;
          } else {
            this.startContainer = this.endContainer;
            this.startOffset = this.endOffset;
          }
          this.collapsed = true;
        },
        cloneContents : function() {
          var docFrag = new CKEDITOR.dom.documentFragment(this.document);
          if (!this.collapsed) {
            execContentsAction(this, 2, docFrag);
          }
          return docFrag;
        },
        deleteContents : function(deepDataAndEvents) {
          if (!this.collapsed) {
            execContentsAction(this, 0, null, deepDataAndEvents);
          }
        },
        extractContents : function(deepDataAndEvents) {
          var docFrag = new CKEDITOR.dom.documentFragment(this.document);
          if (!this.collapsed) {
            execContentsAction(this, 1, docFrag, deepDataAndEvents);
          }
          return docFrag;
        },
        createBookmark : function(dataAndEvents) {
          var startNode;
          var endNode;
          var baseId;
          var clone;
          var collapsed = this.collapsed;
          startNode = this.document.createElement("span");
          startNode.data("cke-bookmark", 1);
          startNode.setStyle("display", "none");
          startNode.setHtml("&nbsp;");
          if (dataAndEvents) {
            baseId = "cke_bm_" + CKEDITOR.tools.getNextNumber();
            startNode.setAttribute("id", baseId + (collapsed ? "C" : "S"));
          }
          if (!collapsed) {
            endNode = startNode.clone();
            endNode.setHtml("&nbsp;");
            if (dataAndEvents) {
              endNode.setAttribute("id", baseId + "E");
            }
            clone = this.clone();
            clone.collapse();
            clone.insertNode(endNode);
          }
          clone = this.clone();
          clone.collapse(true);
          clone.insertNode(startNode);
          if (endNode) {
            this.setStartAfter(startNode);
            this.setEndBefore(endNode);
          } else {
            this.moveToPosition(startNode, CKEDITOR.POSITION_AFTER_END);
          }
          return{
            startNode : dataAndEvents ? baseId + (collapsed ? "C" : "S") : startNode,
            endNode : dataAndEvents ? baseId + "E" : endNode,
            serializable : dataAndEvents,
            collapsed : collapsed
          };
        },
        createBookmark2 : function() {
          function normalize(limit) {
            var container = limit.container;
            var pos = limit.offset;
            var node;
            node = container;
            var offset = pos;
            node = node.type != CKEDITOR.NODE_ELEMENT || (offset === 0 || offset == node.getChildCount()) ? 0 : node.getChild(offset - 1).type == CKEDITOR.NODE_TEXT && node.getChild(offset).type == CKEDITOR.NODE_TEXT;
            if (node) {
              container = container.getChild(pos - 1);
              pos = container.getLength();
            }
            if (container.type == CKEDITOR.NODE_ELEMENT) {
              if (pos > 1) {
                pos = container.getChild(pos - 1).getIndex(true) + 1;
              }
            }
            if (container.type == CKEDITOR.NODE_TEXT) {
              node = container;
              offset = 0;
              for (;(node = node.getPrevious()) && node.type == CKEDITOR.NODE_TEXT;) {
                offset = offset + node.getLength();
              }
              pos = pos + offset;
            }
            limit.container = container;
            limit.offset = pos;
          }
          return function(normalized) {
            var collapsed = this.collapsed;
            var bmStart = {
              container : this.startContainer,
              offset : this.startOffset
            };
            var bmEnd = {
              container : this.endContainer,
              offset : this.endOffset
            };
            if (normalized) {
              normalize(bmStart);
              if (!collapsed) {
                normalize(bmEnd);
              }
            }
            return{
              start : bmStart.container.getAddress(normalized),
              end : collapsed ? null : bmEnd.container.getAddress(normalized),
              startOffset : bmStart.offset,
              endOffset : bmEnd.offset,
              normalized : normalized,
              collapsed : collapsed,
              is2 : true
            };
          };
        }(),
        moveToBookmark : function(bookmark) {
          if (bookmark.is2) {
            var container = this.document.getByAddress(bookmark.start, bookmark.normalized);
            var serializable = bookmark.startOffset;
            var endContainer = bookmark.end && this.document.getByAddress(bookmark.end, bookmark.normalized);
            bookmark = bookmark.endOffset;
            this.setStart(container, serializable);
            if (endContainer) {
              this.setEnd(endContainer, bookmark);
            } else {
              this.collapse(true);
            }
          } else {
            container = (serializable = bookmark.serializable) ? this.document.getById(bookmark.startNode) : bookmark.startNode;
            bookmark = serializable ? this.document.getById(bookmark.endNode) : bookmark.endNode;
            this.setStartBefore(container);
            container.remove();
            if (bookmark) {
              this.setEndBefore(bookmark);
              bookmark.remove();
            } else {
              this.collapse(true);
            }
          }
        },
        getBoundaryNodes : function() {
          var startNode = this.startContainer;
          var endNode = this.endContainer;
          var startOffset = this.startOffset;
          var endOffset = this.endOffset;
          var childCount;
          if (startNode.type == CKEDITOR.NODE_ELEMENT) {
            childCount = startNode.getChildCount();
            if (childCount > startOffset) {
              startNode = startNode.getChild(startOffset);
            } else {
              if (childCount < 1) {
                startNode = startNode.getPreviousSourceNode();
              } else {
                startNode = startNode.$;
                for (;startNode.lastChild;) {
                  startNode = startNode.lastChild;
                }
                startNode = new CKEDITOR.dom.node(startNode);
                startNode = startNode.getNextSourceNode() || startNode;
              }
            }
          }
          if (endNode.type == CKEDITOR.NODE_ELEMENT) {
            childCount = endNode.getChildCount();
            if (childCount > endOffset) {
              endNode = endNode.getChild(endOffset).getPreviousSourceNode(true);
            } else {
              if (childCount < 1) {
                endNode = endNode.getPreviousSourceNode();
              } else {
                endNode = endNode.$;
                for (;endNode.lastChild;) {
                  endNode = endNode.lastChild;
                }
                endNode = new CKEDITOR.dom.node(endNode);
              }
            }
          }
          if (startNode.getPosition(endNode) & CKEDITOR.POSITION_FOLLOWING) {
            startNode = endNode;
          }
          return{
            startNode : startNode,
            endNode : endNode
          };
        },
        getCommonAncestor : function(node, dataAndEvents) {
          var startNode = this.startContainer;
          var endNode = this.endContainer;
          startNode = startNode.equals(endNode) ? node && (startNode.type == CKEDITOR.NODE_ELEMENT && this.startOffset == this.endOffset - 1) ? startNode.getChild(this.startOffset) : startNode : startNode.getCommonAncestor(endNode);
          return dataAndEvents && !startNode.is ? startNode.getParent() : startNode;
        },
        optimize : function() {
          var container = this.startContainer;
          var offset = this.startOffset;
          if (container.type != CKEDITOR.NODE_ELEMENT) {
            if (offset) {
              if (offset >= container.getLength()) {
                this.setStartAfter(container);
              }
            } else {
              this.setStartBefore(container);
            }
          }
          container = this.endContainer;
          offset = this.endOffset;
          if (container.type != CKEDITOR.NODE_ELEMENT) {
            if (offset) {
              if (offset >= container.getLength()) {
                this.setEndAfter(container);
              }
            } else {
              this.setEndBefore(container);
            }
          }
        },
        optimizeBookmark : function() {
          var startNode = this.startContainer;
          var endNode = this.endContainer;
          if (startNode.is) {
            if (startNode.is("span") && startNode.data("cke-bookmark")) {
              this.setStartAt(startNode, CKEDITOR.POSITION_BEFORE_START);
            }
          }
          if (endNode) {
            if (endNode.is && (endNode.is("span") && endNode.data("cke-bookmark"))) {
              this.setEndAt(endNode, CKEDITOR.POSITION_AFTER_END);
            }
          }
        },
        trim : function(s, recurring) {
          var startContainer = this.startContainer;
          var offset = this.startOffset;
          var collapsed = this.collapsed;
          if ((!s || collapsed) && (startContainer && startContainer.type == CKEDITOR.NODE_TEXT)) {
            if (offset) {
              if (offset >= startContainer.getLength()) {
                offset = startContainer.getIndex() + 1;
                startContainer = startContainer.getParent();
              } else {
                var endContainer = startContainer.split(offset);
                offset = startContainer.getIndex() + 1;
                startContainer = startContainer.getParent();
                if (this.startContainer.equals(this.endContainer)) {
                  this.setEnd(endContainer, this.endOffset - this.startOffset);
                } else {
                  if (startContainer.equals(this.endContainer)) {
                    this.endOffset = this.endOffset + 1;
                  }
                }
              }
            } else {
              offset = startContainer.getIndex();
              startContainer = startContainer.getParent();
            }
            this.setStart(startContainer, offset);
            if (collapsed) {
              this.collapse(true);
              return;
            }
          }
          startContainer = this.endContainer;
          offset = this.endOffset;
          if (!recurring && (!collapsed && (startContainer && startContainer.type == CKEDITOR.NODE_TEXT))) {
            if (offset) {
              if (!(offset >= startContainer.getLength())) {
                startContainer.split(offset);
              }
              offset = startContainer.getIndex() + 1;
            } else {
              offset = startContainer.getIndex();
            }
            startContainer = startContainer.getParent();
            this.setEnd(startContainer, offset);
          }
        },
        enlarge : function(unit, dataAndEvents) {
          function getValidEnlargeable(node) {
            return node && (node.type == CKEDITOR.NODE_ELEMENT && node.hasAttribute("contenteditable")) ? null : node;
          }
          var rbrace = RegExp(/[^\s\ufeff]/);
          switch(unit) {
            case CKEDITOR.ENLARGE_INLINE:
              var tailBrGuard = 1;
            case CKEDITOR.ENLARGE_ELEMENT:
              if (this.collapsed) {
                break;
              }
              var s = this.getCommonAncestor();
              var root = this.root;
              var a;
              var b;
              var node;
              var sibling;
              var stack;
              var memory = false;
              var container;
              var data;
              container = this.startContainer;
              var offset = this.startOffset;
              if (container.type == CKEDITOR.NODE_TEXT) {
                if (offset) {
                  container = !CKEDITOR.tools.trim(container.substring(0, offset)).length && container;
                  memory = !!container;
                }
                if (container && !(sibling = container.getPrevious())) {
                  node = container.getParent();
                }
              } else {
                if (offset) {
                  sibling = container.getChild(offset - 1) || container.getLast();
                }
                if (!sibling) {
                  node = container;
                }
              }
              node = getValidEnlargeable(node);
              for (;node || sibling;) {
                if (node && !sibling) {
                  if (!stack) {
                    if (node.equals(s)) {
                      stack = true;
                    }
                  }
                  if (tailBrGuard ? node.isBlockBoundary() : !root.contains(node)) {
                    break;
                  }
                  if (!memory || node.getComputedStyle("display") != "inline") {
                    memory = false;
                    if (stack) {
                      a = node;
                    } else {
                      this.setStartBefore(node);
                    }
                  }
                  sibling = node.getPrevious();
                }
                for (;sibling;) {
                  container = false;
                  if (sibling.type == CKEDITOR.NODE_COMMENT) {
                    sibling = sibling.getPrevious();
                  } else {
                    if (sibling.type == CKEDITOR.NODE_TEXT) {
                      data = sibling.getText();
                      if (rbrace.test(data)) {
                        sibling = null;
                      }
                      container = /[\s\ufeff]$/.test(data);
                    } else {
                      if ((sibling.$.offsetWidth > 0 || dataAndEvents && sibling.is("br")) && !sibling.data("cke-bookmark")) {
                        if (memory && CKEDITOR.dtd.$removeEmpty[sibling.getName()]) {
                          data = sibling.getText();
                          if (rbrace.test(data)) {
                            sibling = null;
                          } else {
                            offset = sibling.$.getElementsByTagName("*");
                            var D = 0;
                            var o;
                            for (;o = offset[D++];) {
                              if (!CKEDITOR.dtd.$removeEmpty[o.nodeName.toLowerCase()]) {
                                sibling = null;
                                break;
                              }
                            }
                          }
                          if (sibling) {
                            container = !!data.length;
                          }
                        } else {
                          sibling = null;
                        }
                      }
                    }
                    if (container) {
                      if (memory) {
                        if (stack) {
                          a = node;
                        } else {
                          if (node) {
                            this.setStartBefore(node);
                          }
                        }
                      } else {
                        memory = true;
                      }
                    }
                    if (sibling) {
                      container = sibling.getPrevious();
                      if (!node && !container) {
                        node = sibling;
                        sibling = null;
                        break;
                      }
                      sibling = container;
                    } else {
                      node = null;
                    }
                  }
                }
                if (node) {
                  node = getValidEnlargeable(node.getParent());
                }
              }
              container = this.endContainer;
              offset = this.endOffset;
              node = sibling = null;
              stack = memory = false;
              var init = function(node, index) {
                var range = new CKEDITOR.dom.range(root);
                range.setStart(node, index);
                range.setEndAt(root, CKEDITOR.POSITION_BEFORE_END);
                range = new CKEDITOR.dom.walker(range);
                var parent;
                range.guard = function(node) {
                  return!(node.type == CKEDITOR.NODE_ELEMENT && node.isBlockBoundary());
                };
                for (;parent = range.next();) {
                  if (parent.type != CKEDITOR.NODE_TEXT) {
                    return false;
                  }
                  data = parent != node ? parent.getText() : parent.substring(index);
                  if (rbrace.test(data)) {
                    return false;
                  }
                }
                return true;
              };
              if (container.type == CKEDITOR.NODE_TEXT) {
                if (CKEDITOR.tools.trim(container.substring(offset)).length) {
                  memory = true;
                } else {
                  memory = !container.getLength();
                  if (offset == container.getLength()) {
                    if (!(sibling = container.getNext())) {
                      node = container.getParent();
                    }
                  } else {
                    if (init(container, offset)) {
                      node = container.getParent();
                    }
                  }
                }
              } else {
                if (!(sibling = container.getChild(offset))) {
                  node = container;
                }
              }
              for (;node || sibling;) {
                if (node && !sibling) {
                  if (!stack) {
                    if (node.equals(s)) {
                      stack = true;
                    }
                  }
                  if (tailBrGuard ? node.isBlockBoundary() : !root.contains(node)) {
                    break;
                  }
                  if (!memory || node.getComputedStyle("display") != "inline") {
                    memory = false;
                    if (stack) {
                      b = node;
                    } else {
                      if (node) {
                        this.setEndAfter(node);
                      }
                    }
                  }
                  sibling = node.getNext();
                }
                for (;sibling;) {
                  container = false;
                  if (sibling.type == CKEDITOR.NODE_TEXT) {
                    data = sibling.getText();
                    if (!init(sibling, 0)) {
                      sibling = null;
                    }
                    container = /^[\s\ufeff]/.test(data);
                  } else {
                    if (sibling.type == CKEDITOR.NODE_ELEMENT) {
                      if ((sibling.$.offsetWidth > 0 || dataAndEvents && sibling.is("br")) && !sibling.data("cke-bookmark")) {
                        if (memory && CKEDITOR.dtd.$removeEmpty[sibling.getName()]) {
                          data = sibling.getText();
                          if (rbrace.test(data)) {
                            sibling = null;
                          } else {
                            offset = sibling.$.getElementsByTagName("*");
                            D = 0;
                            for (;o = offset[D++];) {
                              if (!CKEDITOR.dtd.$removeEmpty[o.nodeName.toLowerCase()]) {
                                sibling = null;
                                break;
                              }
                            }
                          }
                          if (sibling) {
                            container = !!data.length;
                          }
                        } else {
                          sibling = null;
                        }
                      }
                    } else {
                      container = 1;
                    }
                  }
                  if (container) {
                    if (memory) {
                      if (stack) {
                        b = node;
                      } else {
                        this.setEndAfter(node);
                      }
                    }
                  }
                  if (sibling) {
                    container = sibling.getNext();
                    if (!node && !container) {
                      node = sibling;
                      sibling = null;
                      break;
                    }
                    sibling = container;
                  } else {
                    node = null;
                  }
                }
                if (node) {
                  node = getValidEnlargeable(node.getParent());
                }
              }
              if (a && b) {
                s = a.contains(b) ? b : a;
                this.setStartBefore(s);
                this.setEndAfter(s);
              }
              break;
            case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
            ;
            case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:
              node = new CKEDITOR.dom.range(this.root);
              root = this.root;
              node.setStartAt(root, CKEDITOR.POSITION_AFTER_START);
              node.setEnd(this.startContainer, this.startOffset);
              node = new CKEDITOR.dom.walker(node);
              var blockBoundary;
              var tailBr;
              var notBlockBoundary = CKEDITOR.dom.walker.blockBoundary(unit == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? {
                br : 1
              } : null);
              var block = null;
              var boundaryGuard = function(node) {
                if (node.type == CKEDITOR.NODE_ELEMENT && node.getAttribute("contenteditable") == "false") {
                  if (block) {
                    if (block.equals(node)) {
                      block = null;
                      return;
                    }
                  } else {
                    block = node;
                  }
                } else {
                  if (block) {
                    return;
                  }
                }
                var retval = notBlockBoundary(node);
                if (!retval) {
                  blockBoundary = node;
                }
                return retval;
              };
              tailBrGuard = function(node) {
                var retval = boundaryGuard(node);
                if (!retval) {
                  if (node.is && node.is("br")) {
                    tailBr = node;
                  }
                }
                return retval;
              };
              node.guard = boundaryGuard;
              node = node.lastBackward();
              blockBoundary = blockBoundary || root;
              this.setStartAt(blockBoundary, !blockBoundary.is("br") && (!node && this.checkStartOfBlock() || node && blockBoundary.contains(node)) ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_AFTER_END);
              if (unit == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS) {
                node = this.clone();
                node = new CKEDITOR.dom.walker(node);
                var ondata = CKEDITOR.dom.walker.whitespaces();
                var trimDots = CKEDITOR.dom.walker.bookmark();
                node.evaluator = function(name) {
                  return!ondata(name) && !trimDots(name);
                };
                if ((node = node.previous()) && (node.type == CKEDITOR.NODE_ELEMENT && node.is("br"))) {
                  break;
                }
              }
              node = this.clone();
              node.collapse();
              node.setEndAt(root, CKEDITOR.POSITION_BEFORE_END);
              node = new CKEDITOR.dom.walker(node);
              node.guard = unit == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? tailBrGuard : boundaryGuard;
              blockBoundary = block = tailBr = null;
              node = node.lastForward();
              blockBoundary = blockBoundary || root;
              this.setEndAt(blockBoundary, !node && this.checkEndOfBlock() || node && blockBoundary.contains(node) ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_BEFORE_START);
              if (tailBr) {
                this.setEndAfter(tailBr);
              }
            ;
          }
        },
        shrink : function(mode, dataAndEvents, recurring) {
          if (!this.collapsed) {
            mode = mode || CKEDITOR.SHRINK_TEXT;
            var self = this.clone();
            var startNode = this.startContainer;
            var endContainer = this.endContainer;
            var startOffset = this.startOffset;
            var endOffset = this.endOffset;
            var object = 1;
            var property = 1;
            if (startNode && startNode.type == CKEDITOR.NODE_TEXT) {
              if (startOffset) {
                if (startOffset >= startNode.getLength()) {
                  self.setStartAfter(startNode);
                } else {
                  self.setStartBefore(startNode);
                  object = 0;
                }
              } else {
                self.setStartBefore(startNode);
              }
            }
            if (endContainer && endContainer.type == CKEDITOR.NODE_TEXT) {
              if (endOffset) {
                if (endOffset >= endContainer.getLength()) {
                  self.setEndAfter(endContainer);
                } else {
                  self.setEndAfter(endContainer);
                  property = 0;
                }
              } else {
                self.setEndBefore(endContainer);
              }
            }
            self = new CKEDITOR.dom.walker(self);
            var traverseNode = CKEDITOR.dom.walker.bookmark();
            self.evaluator = function(name) {
              return name.type == (mode == CKEDITOR.SHRINK_ELEMENT ? CKEDITOR.NODE_ELEMENT : CKEDITOR.NODE_TEXT);
            };
            var child;
            self.guard = function(node, deepDataAndEvents) {
              if (traverseNode(node)) {
                return true;
              }
              if (mode == CKEDITOR.SHRINK_ELEMENT && node.type == CKEDITOR.NODE_TEXT || (deepDataAndEvents && node.equals(child) || (recurring === false && (node.type == CKEDITOR.NODE_ELEMENT && node.isBlockBoundary()) || node.type == CKEDITOR.NODE_ELEMENT && node.hasAttribute("contenteditable")))) {
                return false;
              }
              if (!deepDataAndEvents) {
                if (node.type == CKEDITOR.NODE_ELEMENT) {
                  child = node;
                }
              }
              return true;
            };
            if (object) {
              if (startNode = self[mode == CKEDITOR.SHRINK_ELEMENT ? "lastForward" : "next"]()) {
                this.setStartAt(startNode, dataAndEvents ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_START);
              }
            }
            if (property) {
              self.reset();
              if (self = self[mode == CKEDITOR.SHRINK_ELEMENT ? "lastBackward" : "previous"]()) {
                this.setEndAt(self, dataAndEvents ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END);
              }
            }
            return!(!object && !property);
          }
        },
        insertNode : function(node) {
          this.optimizeBookmark();
          this.trim(false, true);
          var container = this.startContainer;
          var child = container.getChild(this.startOffset);
          if (child) {
            node.insertBefore(child);
          } else {
            container.append(node);
          }
          if (node.getParent()) {
            if (node.getParent().equals(this.endContainer)) {
              this.endOffset++;
            }
          }
          this.setStartBefore(node);
        },
        moveToPosition : function(node, position) {
          this.setStartAt(node, position);
          this.collapse(true);
        },
        moveToRange : function(range) {
          this.setStart(range.startContainer, range.startOffset);
          this.setEnd(range.endContainer, range.endOffset);
        },
        selectNodeContents : function(node) {
          this.setStart(node, 0);
          this.setEnd(node, node.type == CKEDITOR.NODE_TEXT ? node.getLength() : node.getChildCount());
        },
        setStart : function(node, offset) {
          if (node.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[node.getName()]) {
            offset = node.getIndex();
            node = node.getParent();
          }
          this.startContainer = node;
          this.startOffset = offset;
          if (!this.endContainer) {
            this.endContainer = node;
            this.endOffset = offset;
          }
          updateCollapsed(this);
        },
        setEnd : function(node, offset) {
          if (node.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[node.getName()]) {
            offset = node.getIndex() + 1;
            node = node.getParent();
          }
          this.endContainer = node;
          this.endOffset = offset;
          if (!this.startContainer) {
            this.startContainer = node;
            this.startOffset = offset;
          }
          updateCollapsed(this);
        },
        setStartAfter : function(node) {
          this.setStart(node.getParent(), node.getIndex() + 1);
        },
        setStartBefore : function(node) {
          this.setStart(node.getParent(), node.getIndex());
        },
        setEndAfter : function(node) {
          this.setEnd(node.getParent(), node.getIndex() + 1);
        },
        setEndBefore : function(node) {
          this.setEnd(node.getParent(), node.getIndex());
        },
        setStartAt : function(node, position) {
          switch(position) {
            case CKEDITOR.POSITION_AFTER_START:
              this.setStart(node, 0);
              break;
            case CKEDITOR.POSITION_BEFORE_END:
              if (node.type == CKEDITOR.NODE_TEXT) {
                this.setStart(node, node.getLength());
              } else {
                this.setStart(node, node.getChildCount());
              }
              break;
            case CKEDITOR.POSITION_BEFORE_START:
              this.setStartBefore(node);
              break;
            case CKEDITOR.POSITION_AFTER_END:
              this.setStartAfter(node);
          }
          updateCollapsed(this);
        },
        setEndAt : function(node, position) {
          switch(position) {
            case CKEDITOR.POSITION_AFTER_START:
              this.setEnd(node, 0);
              break;
            case CKEDITOR.POSITION_BEFORE_END:
              if (node.type == CKEDITOR.NODE_TEXT) {
                this.setEnd(node, node.getLength());
              } else {
                this.setEnd(node, node.getChildCount());
              }
              break;
            case CKEDITOR.POSITION_BEFORE_START:
              this.setEndBefore(node);
              break;
            case CKEDITOR.POSITION_AFTER_END:
              this.setEndAfter(node);
          }
          updateCollapsed(this);
        },
        fixBlock : function(recurring, blockTag) {
          var bookmark = this.createBookmark();
          var fixedBlock = this.document.createElement(blockTag);
          this.collapse(recurring);
          this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
          this.extractContents().appendTo(fixedBlock);
          fixedBlock.trim();
          fixedBlock.appendBogus();
          this.insertNode(fixedBlock);
          this.moveToBookmark(bookmark);
          return fixedBlock;
        },
        splitBlock : function(blockTag) {
          var path = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
          var endPath = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
          var startBlock = path.block;
          var endBlock = endPath.block;
          var elementPath = null;
          if (!path.blockLimit.equals(endPath.blockLimit)) {
            return null;
          }
          if (blockTag != "br") {
            if (!startBlock) {
              startBlock = this.fixBlock(true, blockTag);
              endBlock = (new CKEDITOR.dom.elementPath(this.endContainer, this.root)).block;
            }
            if (!endBlock) {
              endBlock = this.fixBlock(false, blockTag);
            }
          }
          blockTag = startBlock && this.checkStartOfBlock();
          path = endBlock && this.checkEndOfBlock();
          this.deleteContents();
          if (startBlock && startBlock.equals(endBlock)) {
            if (path) {
              elementPath = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
              this.moveToPosition(endBlock, CKEDITOR.POSITION_AFTER_END);
              endBlock = null;
            } else {
              if (blockTag) {
                elementPath = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
                this.moveToPosition(startBlock, CKEDITOR.POSITION_BEFORE_START);
                startBlock = null;
              } else {
                endBlock = this.splitElement(startBlock);
                if (!startBlock.is("ul", "ol")) {
                  startBlock.appendBogus();
                }
              }
            }
          }
          return{
            previousBlock : startBlock,
            nextBlock : endBlock,
            wasStartOfBlock : blockTag,
            wasEndOfBlock : path,
            elementPath : elementPath
          };
        },
        splitElement : function(node) {
          if (!this.collapsed) {
            return null;
          }
          this.setEndAt(node, CKEDITOR.POSITION_BEFORE_END);
          var documentFragment = this.extractContents();
          var clone = node.clone(false);
          documentFragment.appendTo(clone);
          clone.insertAfter(node);
          this.moveToPosition(node, CKEDITOR.POSITION_AFTER_END);
          return clone;
        },
        removeEmptyBlocksAtEnd : function() {
          function childEval(parent) {
            return function(node) {
              return traverseNode(node) || (whitespace(node) || node.type == CKEDITOR.NODE_ELEMENT && node.isEmptyInlineRemoveable() || parent.is("table") && node.is("caption")) ? false : true;
            };
          }
          var traverseNode = CKEDITOR.dom.walker.whitespaces();
          var whitespace = CKEDITOR.dom.walker.bookmark(false);
          return function(atEnd) {
            var bookmark = this.createBookmark();
            var path = this[atEnd ? "endPath" : "startPath"]();
            var block = path.block || path.blockLimit;
            var TRUE;
            for (;block && (!block.equals(path.root) && !block.getFirst(childEval(block)));) {
              TRUE = block.getParent();
              this[atEnd ? "setEndAt" : "setStartAt"](block, CKEDITOR.POSITION_AFTER_END);
              block.remove(1);
              block = TRUE;
            }
            this.moveToBookmark(bookmark);
          };
        }(),
        startPath : function() {
          return new CKEDITOR.dom.elementPath(this.startContainer, this.root);
        },
        endPath : function() {
          return new CKEDITOR.dom.elementPath(this.endContainer, this.root);
        },
        checkBoundaryOfElement : function(element, checkType) {
          var checkStart = checkType == CKEDITOR.START;
          var walkerRange = this.clone();
          walkerRange.collapse(checkStart);
          walkerRange[checkStart ? "setStartAt" : "setEndAt"](element, checkStart ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
          walkerRange = new CKEDITOR.dom.walker(walkerRange);
          walkerRange.evaluator = elementBoundaryEval(checkStart);
          return walkerRange[checkStart ? "checkBackward" : "checkForward"]();
        },
        checkStartOfBlock : function() {
          var path = this.startContainer;
          var walkerRange = this.startOffset;
          if (CKEDITOR.env.ie && (walkerRange && path.type == CKEDITOR.NODE_TEXT)) {
            path = CKEDITOR.tools.ltrim(path.substring(0, walkerRange));
            if (ignore.test(path)) {
              this.trim(0, 1);
            }
          }
          this.trim();
          path = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
          walkerRange = this.clone();
          walkerRange.collapse(true);
          walkerRange.setStartAt(path.block || path.blockLimit, CKEDITOR.POSITION_AFTER_START);
          path = new CKEDITOR.dom.walker(walkerRange);
          path.evaluator = getCheckStartEndBlockEvalFunction();
          return path.checkBackward();
        },
        checkEndOfBlock : function() {
          var path = this.endContainer;
          var testRange = this.endOffset;
          if (CKEDITOR.env.ie && path.type == CKEDITOR.NODE_TEXT) {
            path = CKEDITOR.tools.rtrim(path.substring(testRange));
            if (ignore.test(path)) {
              this.trim(1, 0);
            }
          }
          this.trim();
          path = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
          testRange = this.clone();
          testRange.collapse(false);
          testRange.setEndAt(path.block || path.blockLimit, CKEDITOR.POSITION_BEFORE_END);
          path = new CKEDITOR.dom.walker(testRange);
          path.evaluator = getCheckStartEndBlockEvalFunction();
          return path.checkForward();
        },
        getPreviousNode : function(dataAndEvents, guard, walker) {
          var walkerRange = this.clone();
          walkerRange.collapse(1);
          walkerRange.setStartAt(walker || this.root, CKEDITOR.POSITION_AFTER_START);
          walker = new CKEDITOR.dom.walker(walkerRange);
          walker.evaluator = dataAndEvents;
          walker.guard = guard;
          return walker.previous();
        },
        getNextNode : function(dataAndEvents, guard, walker) {
          var walkerRange = this.clone();
          walkerRange.collapse();
          walkerRange.setEndAt(walker || this.root, CKEDITOR.POSITION_BEFORE_END);
          walker = new CKEDITOR.dom.walker(walkerRange);
          walker.evaluator = dataAndEvents;
          walker.guard = guard;
          return walker.next();
        },
        checkReadOnly : function() {
          function checkNodesEditable(node, name) {
            for (;node;) {
              if (node.type == CKEDITOR.NODE_ELEMENT) {
                if (node.getAttribute("contentEditable") == "false" && !node.data("cke-editable")) {
                  return 0;
                }
                if (node.is("html") || node.getAttribute("contentEditable") == "true" && (node.contains(name) || node.equals(name))) {
                  break;
                }
              }
              node = node.getParent();
            }
            return 1;
          }
          return function() {
            var startNode = this.startContainer;
            var endNode = this.endContainer;
            return!(checkNodesEditable(startNode, endNode) && checkNodesEditable(endNode, startNode));
          };
        }(),
        moveToElementEditablePosition : function(el, isMoveToEnd) {
          if (el.type == CKEDITOR.NODE_ELEMENT && !el.isEditable(false)) {
            this.moveToPosition(el, isMoveToEnd ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
            return true;
          }
          var YY_START = 0;
          for (;el;) {
            if (el.type == CKEDITOR.NODE_TEXT) {
              if (isMoveToEnd && (this.endContainer && (this.checkEndOfBlock() && ignore.test(el.getText())))) {
                this.moveToPosition(el, CKEDITOR.POSITION_BEFORE_START);
              } else {
                this.moveToPosition(el, isMoveToEnd ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
              }
              YY_START = 1;
              break;
            }
            if (el.type == CKEDITOR.NODE_ELEMENT) {
              if (el.isEditable()) {
                this.moveToPosition(el, isMoveToEnd ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START);
                YY_START = 1;
              } else {
                if (isMoveToEnd && (el.is("br") && (this.endContainer && this.checkEndOfBlock()))) {
                  this.moveToPosition(el, CKEDITOR.POSITION_BEFORE_START);
                } else {
                  if (el.getAttribute("contenteditable") == "false" && el.is(CKEDITOR.dtd.$block)) {
                    this.setStartBefore(el);
                    this.setEndAfter(el);
                    return true;
                  }
                }
              }
            }
            var node = el;
            var YYSTATE = YY_START;
            var next = void 0;
            if (node.type == CKEDITOR.NODE_ELEMENT) {
              if (node.isEditable(false)) {
                next = node[isMoveToEnd ? "getLast" : "getFirst"](notIgnoredEval);
              }
            }
            if (!YYSTATE) {
              if (!next) {
                next = node[isMoveToEnd ? "getPrevious" : "getNext"](notIgnoredEval);
              }
            }
            el = next;
          }
          return!!YY_START;
        },
        moveToClosestEditablePosition : function(element, isMoveToEnd) {
          var range = new CKEDITOR.dom.range(this.root);
          var d = 0;
          var sibling;
          var positions = [CKEDITOR.POSITION_AFTER_END, CKEDITOR.POSITION_BEFORE_START];
          range.moveToPosition(element, positions[isMoveToEnd ? 0 : 1]);
          if (element.is(CKEDITOR.dtd.$block)) {
            if (sibling = range[isMoveToEnd ? "getNextEditableNode" : "getPreviousEditableNode"]()) {
              d = 1;
              if (sibling.type == CKEDITOR.NODE_ELEMENT && (sibling.is(CKEDITOR.dtd.$block) && sibling.getAttribute("contenteditable") == "false")) {
                range.setStartAt(sibling, CKEDITOR.POSITION_BEFORE_START);
                range.setEndAt(sibling, CKEDITOR.POSITION_AFTER_END);
              } else {
                range.moveToPosition(sibling, positions[isMoveToEnd ? 1 : 0]);
              }
            }
          } else {
            d = 1;
          }
          if (d) {
            this.moveToRange(range);
          }
          return!!d;
        },
        moveToElementEditStart : function(element) {
          return this.moveToElementEditablePosition(element);
        },
        moveToElementEditEnd : function(target) {
          return this.moveToElementEditablePosition(target, true);
        },
        getEnclosedNode : function() {
          var self = this.clone();
          self.optimize();
          if (self.startContainer.type != CKEDITOR.NODE_ELEMENT || self.endContainer.type != CKEDITOR.NODE_ELEMENT) {
            return null;
          }
          self = new CKEDITOR.dom.walker(self);
          var ondata = CKEDITOR.dom.walker.bookmark(false, true);
          var _is_blank = CKEDITOR.dom.walker.whitespaces(true);
          self.evaluator = function(name) {
            return _is_blank(name) && ondata(name);
          };
          var parent = self.next();
          self.reset();
          return parent && parent.equals(self.previous()) ? parent : null;
        },
        getTouchedStartNode : function() {
          var container = this.startContainer;
          return this.collapsed || container.type != CKEDITOR.NODE_ELEMENT ? container : container.getChild(this.startOffset) || container;
        },
        getTouchedEndNode : function() {
          var container = this.endContainer;
          return this.collapsed || container.type != CKEDITOR.NODE_ELEMENT ? container : container.getChild(this.endOffset - 1) || container;
        },
        getNextEditableNode : getNextEditableNode(),
        getPreviousEditableNode : getNextEditableNode(1),
        scrollIntoView : function() {
          var reference = new CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", this.document);
          var selfObj;
          var mypulldata;
          var d;
          var range = this.clone();
          range.optimize();
          if (d = range.startContainer.type == CKEDITOR.NODE_TEXT) {
            mypulldata = range.startContainer.getText();
            selfObj = range.startContainer.split(range.startOffset);
            reference.insertAfter(range.startContainer);
          } else {
            range.insertNode(reference);
          }
          reference.scrollIntoView();
          if (d) {
            range.startContainer.setText(mypulldata);
            selfObj.remove();
          }
          reference.remove();
        }
      };
    })();
    CKEDITOR.POSITION_AFTER_START = 1;
    CKEDITOR.POSITION_BEFORE_END = 2;
    CKEDITOR.POSITION_BEFORE_START = 3;
    CKEDITOR.POSITION_AFTER_END = 4;
    CKEDITOR.ENLARGE_ELEMENT = 1;
    CKEDITOR.ENLARGE_BLOCK_CONTENTS = 2;
    CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS = 3;
    CKEDITOR.ENLARGE_INLINE = 4;
    CKEDITOR.START = 1;
    CKEDITOR.END = 2;
    CKEDITOR.SHRINK_ELEMENT = 1;
    CKEDITOR.SHRINK_TEXT = 2;
    "use strict";
    (function() {
      function iterator(range) {
        if (!(arguments.length < 1)) {
          this.range = range;
          this.forceBrBreak = 0;
          this.enlargeBr = 1;
          this.enforceRealBlocks = 0;
          if (!this._) {
            this._ = {};
          }
        }
      }
      function getNextSourceNode(node, recurring, guard) {
        node = node.getNextSourceNode(recurring, null, guard);
        for (;!bookmarkGuard(node);) {
          node = node.getNextSourceNode(recurring, null, guard);
        }
        return node;
      }
      function findNestedEditables(container) {
        var excludes = [];
        container.forEach(function(el) {
          if (el.getAttribute("contenteditable") == "true") {
            excludes.push(el);
            return false;
          }
        }, CKEDITOR.NODE_ELEMENT, true);
        return excludes;
      }
      function startNestedEditableIterator(parentIterator, iterator, editablesContainer, editable) {
        a: {
          if (editable == void 0) {
            editable = findNestedEditables(editablesContainer);
          }
          var filter;
          for (;filter = editable.shift();) {
            if (filter.getDtd().p) {
              editable = {
                element : filter,
                remaining : editable
              };
              break a;
            }
          }
          editable = null;
        }
        if (!editable) {
          return 0;
        }
        if ((filter = CKEDITOR.filter.instances[editable.element.data("cke-filter")]) && !filter.check(iterator)) {
          return startNestedEditableIterator(parentIterator, iterator, editablesContainer, editable.remaining);
        }
        iterator = new CKEDITOR.dom.range(editable.element);
        iterator.selectNodeContents(editable.element);
        iterator = iterator.createIterator();
        iterator.enlargeBr = parentIterator.enlargeBr;
        iterator.enforceRealBlocks = parentIterator.enforceRealBlocks;
        iterator.activeFilter = iterator.filter = filter;
        parentIterator._.nestedEditable = {
          element : editable.element,
          container : editablesContainer,
          remaining : editable.remaining,
          iterator : iterator
        };
        return 1;
      }
      var rhtml = /^[\r\n\t ]+$/;
      var bookmarkGuard = CKEDITOR.dom.walker.bookmark(false, true);
      var whitespacesGuard = CKEDITOR.dom.walker.whitespaces(true);
      var skipGuard = function(node) {
        return bookmarkGuard(node) && whitespacesGuard(node);
      };
      iterator.prototype = {
        getNextParagraph : function(blockTag) {
          var block;
          var range;
          var isLast;
          var lastChild;
          var splitInfo;
          blockTag = blockTag || "p";
          if (this._.nestedEditable) {
            if (block = this._.nestedEditable.iterator.getNextParagraph(blockTag)) {
              this.activeFilter = this._.nestedEditable.iterator.activeFilter;
              return block;
            }
            this.activeFilter = this.filter;
            if (startNestedEditableIterator(this, blockTag, this._.nestedEditable.container, this._.nestedEditable.remaining)) {
              this.activeFilter = this._.nestedEditable.iterator.activeFilter;
              return this._.nestedEditable.iterator.getNextParagraph(blockTag);
            }
            this._.nestedEditable = null;
          }
          if (!this.range.root.getDtd()[blockTag]) {
            return null;
          }
          if (!this._.started) {
            var lastNode = this.range.clone();
            lastNode.shrink(CKEDITOR.SHRINK_ELEMENT, true);
            range = lastNode.endContainer.hasAscendant("pre", true) || lastNode.startContainer.hasAscendant("pre", true);
            lastNode.enlarge(this.forceBrBreak && !range || !this.enlargeBr ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS);
            if (!lastNode.collapsed) {
              range = new CKEDITOR.dom.walker(lastNode.clone());
              var currentNode = CKEDITOR.dom.walker.bookmark(true, true);
              range.evaluator = currentNode;
              this._.nextNode = range.next();
              range = new CKEDITOR.dom.walker(lastNode.clone());
              range.evaluator = currentNode;
              range = range.previous();
              this._.lastNode = range.getNextSourceNode(true);
              if (this._.lastNode && (this._.lastNode.type == CKEDITOR.NODE_TEXT && (!CKEDITOR.tools.trim(this._.lastNode.getText()) && this._.lastNode.getParent().isBlockBoundary()))) {
                currentNode = this.range.clone();
                currentNode.moveToPosition(this._.lastNode, CKEDITOR.POSITION_AFTER_END);
                if (currentNode.checkEndOfBlock()) {
                  currentNode = new CKEDITOR.dom.elementPath(currentNode.endContainer, currentNode.root);
                  this._.lastNode = (currentNode.block || currentNode.blockLimit).getNextSourceNode(true);
                }
              }
              if (!this._.lastNode || !lastNode.root.contains(this._.lastNode)) {
                this._.lastNode = this._.docEndMarker = lastNode.document.createText("");
                this._.lastNode.insertAfter(range);
              }
              lastNode = null;
            }
            this._.started = 1;
            range = lastNode;
          }
          currentNode = this._.nextNode;
          lastNode = this._.lastNode;
          this._.nextNode = null;
          for (;currentNode;) {
            var closeRange = 0;
            var parentPre = currentNode.hasAscendant("pre");
            var includeNode = currentNode.type != CKEDITOR.NODE_ELEMENT;
            var recurring = 0;
            if (includeNode) {
              if (currentNode.type == CKEDITOR.NODE_TEXT) {
                if (rhtml.test(currentNode.getText())) {
                  includeNode = 0;
                }
              }
            } else {
              var parentNode = currentNode.getName();
              if (CKEDITOR.dtd.$block[parentNode] && currentNode.getAttribute("contenteditable") == "false") {
                block = currentNode;
                startNestedEditableIterator(this, blockTag, block);
                break;
              } else {
                if (currentNode.isBlockBoundary(this.forceBrBreak && (!parentPre && {
                  br : 1
                }))) {
                  if (parentNode == "br") {
                    includeNode = 1;
                  } else {
                    if (!range && (!currentNode.getChildCount() && parentNode != "hr")) {
                      block = currentNode;
                      isLast = currentNode.equals(lastNode);
                      break;
                    }
                  }
                  if (range) {
                    range.setEndAt(currentNode, CKEDITOR.POSITION_BEFORE_START);
                    if (parentNode != "br") {
                      this._.nextNode = currentNode;
                    }
                  }
                  closeRange = 1;
                } else {
                  if (currentNode.getFirst()) {
                    if (!range) {
                      range = this.range.clone();
                      range.setStartAt(currentNode, CKEDITOR.POSITION_BEFORE_START);
                    }
                    currentNode = currentNode.getFirst();
                    continue;
                  }
                  includeNode = 1;
                }
              }
            }
            if (includeNode && !range) {
              range = this.range.clone();
              range.setStartAt(currentNode, CKEDITOR.POSITION_BEFORE_START);
            }
            isLast = (!closeRange || includeNode) && currentNode.equals(lastNode);
            if (range && !closeRange) {
              for (;!currentNode.getNext(skipGuard) && !isLast;) {
                parentNode = currentNode.getParent();
                if (parentNode.isBlockBoundary(this.forceBrBreak && (!parentPre && {
                  br : 1
                }))) {
                  closeRange = 1;
                  includeNode = 0;
                  if (!isLast) {
                    parentNode.equals(lastNode);
                  }
                  range.setEndAt(parentNode, CKEDITOR.POSITION_BEFORE_END);
                  break;
                }
                currentNode = parentNode;
                includeNode = 1;
                isLast = currentNode.equals(lastNode);
                recurring = 1;
              }
            }
            if (includeNode) {
              range.setEndAt(currentNode, CKEDITOR.POSITION_AFTER_END);
            }
            currentNode = getNextSourceNode(currentNode, recurring, lastNode);
            if ((isLast = !currentNode) || closeRange && range) {
              break;
            }
          }
          if (!block) {
            if (!range) {
              if (this._.docEndMarker) {
                this._.docEndMarker.remove();
              }
              return this._.nextNode = null;
            }
            block = new CKEDITOR.dom.elementPath(range.startContainer, range.root);
            currentNode = block.blockLimit;
            closeRange = {
              div : 1,
              th : 1,
              td : 1
            };
            block = block.block;
            if (!block && (currentNode && (!this.enforceRealBlocks && (closeRange[currentNode.getName()] && (range.checkStartOfBlock() && (range.checkEndOfBlock() && !currentNode.equals(range.root))))))) {
              block = currentNode;
            } else {
              if (!block || this.enforceRealBlocks && block.getName() == "li") {
                block = this.range.document.createElement(blockTag);
                range.extractContents().appendTo(block);
                block.trim();
                range.insertNode(block);
                lastChild = splitInfo = true;
              } else {
                if (block.getName() != "li") {
                  if (!range.checkStartOfBlock() || !range.checkEndOfBlock()) {
                    block = block.clone(false);
                    range.extractContents().appendTo(block);
                    block.trim();
                    splitInfo = range.splitBlock();
                    lastChild = !splitInfo.wasStartOfBlock;
                    splitInfo = !splitInfo.wasEndOfBlock;
                    range.insertNode(block);
                  }
                } else {
                  if (!isLast) {
                    this._.nextNode = block.equals(lastNode) ? null : getNextSourceNode(range.getBoundaryNodes().endNode, 1, lastNode);
                  }
                }
              }
            }
          }
          if (lastChild) {
            if (lastChild = block.getPrevious()) {
              if (lastChild.type == CKEDITOR.NODE_ELEMENT) {
                if (lastChild.getName() == "br") {
                  lastChild.remove();
                } else {
                  if (lastChild.getLast()) {
                    if (lastChild.getLast().$.nodeName.toLowerCase() == "br") {
                      lastChild.getLast().remove();
                    }
                  }
                }
              }
            }
          }
          if (splitInfo) {
            if (lastChild = block.getLast()) {
              if (lastChild.type == CKEDITOR.NODE_ELEMENT) {
                if (lastChild.getName() == "br") {
                  if (!CKEDITOR.env.needsBrFiller || (lastChild.getPrevious(bookmarkGuard) || lastChild.getNext(bookmarkGuard))) {
                    lastChild.remove();
                  }
                }
              }
            }
          }
          if (!this._.nextNode) {
            this._.nextNode = isLast || (block.equals(lastNode) || !lastNode) ? null : getNextSourceNode(block, 1, lastNode);
          }
          return block;
        }
      };
      CKEDITOR.dom.range.prototype.createIterator = function() {
        return new iterator(this);
      };
    })();
    CKEDITOR.command = function(name, keepData) {
      this.uiItems = [];
      this.exec = function(key) {
        if (this.state == CKEDITOR.TRISTATE_DISABLED || !this.checkAllowed()) {
          return false;
        }
        if (this.editorFocus) {
          name.focus();
        }
        return this.fire("exec") === false ? true : keepData.exec.call(this, name, key) !== false;
      };
      this.refresh = function(editor, path) {
        if (!this.readOnly && editor.readOnly) {
          return true;
        }
        if (this.context && !path.isContextFor(this.context)) {
          this.disable();
          return true;
        }
        if (!this.checkAllowed(true)) {
          this.disable();
          return true;
        }
        if (!this.startDisabled) {
          this.enable();
        }
        if (this.modes) {
          if (!this.modes[editor.mode]) {
            this.disable();
          }
        }
        return this.fire("refresh", {
          editor : editor,
          path : path
        }) === false ? true : keepData.refresh && keepData.refresh.apply(this, arguments) !== false;
      };
      var val;
      this.checkAllowed = function(noCache) {
        return!noCache && typeof val == "boolean" ? val : val = name.activeFilter.checkFeature(this);
      };
      CKEDITOR.tools.extend(this, keepData, {
        modes : {
          wysiwyg : 1
        },
        editorFocus : 1,
        contextSensitive : !!keepData.context,
        state : CKEDITOR.TRISTATE_DISABLED
      });
      CKEDITOR.event.call(this);
    };
    CKEDITOR.command.prototype = {
      enable : function() {
        if (this.state == CKEDITOR.TRISTATE_DISABLED) {
          if (this.checkAllowed()) {
            this.setState(!this.preserveState || typeof this.previousState == "undefined" ? CKEDITOR.TRISTATE_OFF : this.previousState);
          }
        }
      },
      disable : function() {
        this.setState(CKEDITOR.TRISTATE_DISABLED);
      },
      setState : function(state) {
        if (this.state == state || state != CKEDITOR.TRISTATE_DISABLED && !this.checkAllowed()) {
          return false;
        }
        this.previousState = this.state;
        this.state = state;
        this.fire("state");
        return true;
      },
      toggleState : function() {
        if (this.state == CKEDITOR.TRISTATE_OFF) {
          this.setState(CKEDITOR.TRISTATE_ON);
        } else {
          if (this.state == CKEDITOR.TRISTATE_ON) {
            this.setState(CKEDITOR.TRISTATE_OFF);
          }
        }
      }
    };
    CKEDITOR.event.implementOn(CKEDITOR.command.prototype);
    CKEDITOR.ENTER_P = 1;
    CKEDITOR.ENTER_BR = 2;
    CKEDITOR.ENTER_DIV = 3;
    CKEDITOR.config = {
      customConfig : "config.js",
      autoUpdateElement : true,
      language : "",
      defaultLanguage : "en",
      contentsLangDirection : "",
      enterMode : CKEDITOR.ENTER_P,
      forceEnterMode : false,
      shiftEnterMode : CKEDITOR.ENTER_BR,
      docType : "<!DOCTYPE html>",
      bodyId : "",
      bodyClass : "",
      fullPage : false,
      height : 200,
      extraPlugins : "",
      removePlugins : "",
      protectedSource : [],
      tabIndex : 0,
      width : "",
      baseFloatZIndex : 1E4,
      blockedKeystrokes : [CKEDITOR.CTRL + 66, CKEDITOR.CTRL + 73, CKEDITOR.CTRL + 85]
    };
    (function() {
      function parse(buffer, obj, key, offset, els) {
        var item;
        var data;
        buffer = [];
        for (item in obj) {
          data = obj[item];
          data = typeof data == "boolean" ? {} : typeof data == "function" ? {
            match : data
          } : copy(data);
          if (item.charAt(0) != "$") {
            data.elements = item;
          }
          if (key) {
            data.featureName = key.toLowerCase();
          }
          var rule = data;
          rule.elements = compile(rule.elements, /\s+/) || null;
          rule.propertiesOnly = rule.propertiesOnly || rule.elements === true;
          var name = /\s*,\s*/;
          var i = void 0;
          for (i in options) {
            rule[i] = compile(rule[i], name) || null;
            var nothingRequired = rule;
            var func = validatorsRequired[i];
            var result = compile(rule[validatorsRequired[i]], name);
            var attrs = rule[i];
            var eventPath = [];
            var isSetter = true;
            var attr = void 0;
            if (result) {
              isSetter = false;
            } else {
              result = {};
            }
            for (attr in attrs) {
              if (attr.charAt(0) == "!") {
                attr = attr.slice(1);
                eventPath.push(attr);
                result[attr] = true;
                isSetter = false;
              }
            }
            for (;attr = eventPath.pop();) {
              attrs[attr] = attrs["!" + attr];
              delete attrs["!" + attr];
            }
            nothingRequired[func] = (isSetter ? false : result) || null;
          }
          rule.match = rule.match || null;
          offset.push(data);
          buffer.push(data);
        }
        obj = els.elements;
        els = els.generic;
        var val;
        key = 0;
        offset = buffer.length;
        for (;key < offset;++key) {
          item = copy(buffer[key]);
          data = item.classes === true || (item.styles === true || item.attributes === true);
          rule = item;
          i = func = name = void 0;
          for (name in options) {
            rule[name] = f(rule[name]);
          }
          nothingRequired = true;
          for (i in validatorsRequired) {
            name = validatorsRequired[i];
            func = rule[name];
            result = [];
            attrs = void 0;
            for (attrs in func) {
              if (attrs.indexOf("*") > -1) {
                result.push(RegExp("^" + attrs.replace(/\*/g, ".*") + "$"));
              } else {
                result.push(attrs);
              }
            }
            func = result;
            if (func.length) {
              rule[name] = func;
              nothingRequired = false;
            }
          }
          rule.nothingRequired = nothingRequired;
          rule.noProperties = !(rule.attributes || (rule.classes || rule.styles));
          if (item.elements === true || item.elements === null) {
            els[data ? "unshift" : "push"](item);
          } else {
            rule = item.elements;
            delete item.elements;
            for (val in rule) {
              if (obj[val]) {
                obj[val][data ? "unshift" : "push"](item);
              } else {
                obj[val] = [item];
              }
            }
          }
        }
      }
      function applyRule(rule, optgroup, status, element) {
        if (!rule.match || rule.match(optgroup)) {
          if (element || hasAllRequired(rule, optgroup)) {
            if (!rule.propertiesOnly) {
              status.valid = true;
            }
            if (!status.allAttributes) {
              status.allAttributes = applyRuleToHash(rule.attributes, optgroup.attributes, status.validAttributes);
            }
            if (!status.allStyles) {
              status.allStyles = applyRuleToHash(rule.styles, optgroup.styles, status.validStyles);
            }
            if (!status.allClasses) {
              rule = rule.classes;
              optgroup = optgroup.classes;
              element = status.validClasses;
              if (rule) {
                if (rule === true) {
                  rule = true;
                } else {
                  var ti = 0;
                  var nTokens = optgroup.length;
                  var rvar;
                  for (;ti < nTokens;++ti) {
                    rvar = optgroup[ti];
                    if (!element[rvar]) {
                      element[rvar] = rule(rvar);
                    }
                  }
                  rule = false;
                }
              } else {
                rule = false;
              }
              status.allClasses = rule;
            }
          }
        }
      }
      function applyRuleToHash(itemsRule, items, validItems) {
        if (!itemsRule) {
          return false;
        }
        if (itemsRule === true) {
          return true;
        }
        var item;
        for (item in items) {
          if (!validItems[item]) {
            validItems[item] = itemsRule(item);
          }
        }
        return false;
      }
      function find(f, optgroup, results) {
        if (!f.match || f.match(optgroup)) {
          if (f.noProperties) {
            return false;
          }
          results.hadInvalidAttribute = each(f.attributes, optgroup.attributes) || results.hadInvalidAttribute;
          results.hadInvalidStyle = each(f.styles, optgroup.styles) || results.hadInvalidStyle;
          f = f.classes;
          optgroup = optgroup.classes;
          if (f) {
            var objectReader = false;
            var flag = f === true;
            var i = optgroup.length;
            for (;i--;) {
              if (flag || f(optgroup[i])) {
                optgroup.splice(i, 1);
                objectReader = true;
              }
            }
            f = objectReader;
          } else {
            f = false;
          }
          results.hadInvalidClass = f || results.hadInvalidClass;
        }
      }
      function each(callback, a) {
        if (!callback) {
          return false;
        }
        var obj = false;
        var traditional = callback === true;
        var prefix;
        for (prefix in a) {
          if (traditional || callback(prefix)) {
            delete a[prefix];
            obj = true;
          }
        }
        return obj;
      }
      function onClick(button, data, dataAndEvents) {
        if (button.disabled || (button.customConfig && !dataAndEvents || !data)) {
          return false;
        }
        button._.cachedChecks = {};
        return true;
      }
      function compile(source, o) {
        if (!source) {
          return false;
        }
        if (source === true) {
          return source;
        }
        if (typeof source == "string") {
          source = trim(source);
          return source == "*" ? true : CKEDITOR.tools.convertArrayToObject(source.split(o));
        }
        if (CKEDITOR.tools.isArray(source)) {
          return source.length ? CKEDITOR.tools.convertArrayToObject(source) : false;
        }
        var target = {};
        var selfListener = 0;
        var key;
        for (key in source) {
          target[key] = source[key];
          selfListener++;
        }
        return selfListener ? target : false;
      }
      function hasAllRequired(rule, element) {
        if (rule.nothingRequired) {
          return true;
        }
        var i;
        var header;
        var codeSegments;
        var value;
        if (codeSegments = rule.requiredClasses) {
          value = element.classes;
          i = 0;
          for (;i < codeSegments.length;++i) {
            header = codeSegments[i];
            if (typeof header == "string") {
              if (CKEDITOR.tools.indexOf(value, header) == -1) {
                return false;
              }
            } else {
              if (!CKEDITOR.tools.checkIfAnyArrayItemMatches(value, header)) {
                return false;
              }
            }
          }
        }
        return hasAllRequiredInHash(element.styles, rule.requiredStyles) && hasAllRequiredInHash(element.attributes, rule.requiredAttributes);
      }
      function hasAllRequiredInHash(deepDataAndEvents, codeSegments) {
        if (!codeSegments) {
          return true;
        }
        var i = 0;
        var option;
        for (;i < codeSegments.length;++i) {
          option = codeSegments[i];
          if (typeof option == "string") {
            if (!(option in deepDataAndEvents)) {
              return false;
            }
          } else {
            if (!CKEDITOR.tools.checkIfAnyObjectPropertyMatches(deepDataAndEvents, option)) {
              return false;
            }
          }
        }
        return true;
      }
      function mockHash(str) {
        if (!str) {
          return{};
        }
        str = str.split(/\s*,\s*/).sort();
        var obj = {};
        for (;str.length;) {
          obj[str.shift()] = TEST_VALUE;
        }
        return obj;
      }
      function parseRulesString(input) {
        var match;
        var props;
        var styles;
        var attrs;
        var rules = {};
        var groupNum = 1;
        input = trim(input);
        for (;match = input.match(optgroup);) {
          if (props = match[2]) {
            styles = parseProperties(props, "styles");
            attrs = parseProperties(props, "attrs");
            props = parseProperties(props, "classes");
          } else {
            styles = attrs = props = null;
          }
          rules["$" + groupNum++] = {
            elements : match[1],
            classes : props,
            styles : styles,
            attributes : attrs
          };
          input = input.slice(match[0].length);
        }
        return rules;
      }
      function parseProperties(properties, groupName) {
        var group = properties.match(groupsPatterns[groupName]);
        return group ? trim(group[1]) : null;
      }
      function populateProperties(element) {
        var classNames = element.styleBackup = element.attributes.style;
        var value = element.classBackup = element.attributes["class"];
        if (!element.styles) {
          element.styles = CKEDITOR.tools.parseCssText(classNames || "", 1);
        }
        if (!element.classes) {
          element.classes = value ? value.split(/\s+/) : [];
        }
      }
      function updateElement(status, element, data, el) {
        var b0 = 0;
        var list;
        if (el.toHtml) {
          element.name = element.name.replace(r20, "$1");
        }
        if (el.doCallbacks && status.elementCallbacks) {
          var a = status.elementCallbacks;
          var map = 0;
          var value = a.length;
          var result;
          a: for (;map < value;++map) {
            if (result = a[map](element)) {
              list = result;
              break a;
            }
          }
          if (list) {
            return list;
          }
        }
        if (el.doTransform) {
          if (list = status._.transformations[element.name]) {
            populateProperties(element);
            a = 0;
            for (;a < list.length;++a) {
              applyTransformationsGroup(status, element, list[a]);
            }
            updateAttributes(element);
          }
        }
        if (el.doFilter) {
          a: {
            a = element.name;
            map = status._;
            status = map.allowedRules.elements[a];
            list = map.allowedRules.generic;
            a = map.disallowedRules.elements[a];
            map = map.disallowedRules.generic;
            value = el.skipRequired;
            result = {
              valid : false,
              validAttributes : {},
              validClasses : {},
              validStyles : {},
              allAttributes : false,
              allClasses : false,
              allStyles : false,
              hadInvalidAttribute : false,
              hadInvalidClass : false,
              hadInvalidStyle : false
            };
            var i;
            var l;
            if (!status && !list) {
              status = null;
            } else {
              populateProperties(element);
              if (a) {
                i = 0;
                l = a.length;
                for (;i < l;++i) {
                  if (find(a[i], element, result) === false) {
                    status = null;
                    break a;
                  }
                }
              }
              if (map) {
                i = 0;
                l = map.length;
                for (;i < l;++i) {
                  find(map[i], element, result);
                }
              }
              if (status) {
                i = 0;
                l = status.length;
                for (;i < l;++i) {
                  applyRule(status[i], element, result, value);
                }
              }
              if (list) {
                i = 0;
                l = list.length;
                for (;i < l;++i) {
                  applyRule(list[i], element, result, value);
                }
              }
              status = result;
            }
          }
          if (!status) {
            data.push(element);
            return b;
          }
          if (!status.valid) {
            data.push(element);
            return b;
          }
          l = status.validAttributes;
          var validStyles = status.validStyles;
          list = status.validClasses;
          a = element.attributes;
          var attrs = element.styles;
          map = element.classes;
          value = element.classBackup;
          var e = element.styleBackup;
          var key;
          var n;
          var aProperties = [];
          result = [];
          var isint = /^data-cke-/;
          i = false;
          delete a.style;
          delete a["class"];
          delete element.classBackup;
          delete element.styleBackup;
          if (!status.allAttributes) {
            for (key in a) {
              if (!l[key]) {
                if (isint.test(key)) {
                  if (key != (n = key.replace(/^data-cke-saved-/, "")) && !l[n]) {
                    delete a[key];
                    i = true;
                  }
                } else {
                  delete a[key];
                  i = true;
                }
              }
            }
          }
          if (!status.allStyles || status.hadInvalidStyle) {
            for (key in attrs) {
              if (status.allStyles || validStyles[key]) {
                aProperties.push(key + ":" + attrs[key]);
              } else {
                i = true;
              }
            }
            if (aProperties.length) {
              a.style = aProperties.sort().join("; ");
            }
          } else {
            if (e) {
              a.style = e;
            }
          }
          if (!status.allClasses || status.hadInvalidClass) {
            key = 0;
            for (;key < map.length;++key) {
              if (status.allClasses || list[map[key]]) {
                result.push(map[key]);
              }
            }
            if (result.length) {
              a["class"] = result.sort().join(" ");
            }
            if (value) {
              if (result.length < value.split(/\s+/).length) {
                i = true;
              }
            }
          } else {
            if (value) {
              a["class"] = value;
            }
          }
          if (i) {
            b0 = b;
          }
          if (!el.skipFinalValidation && !validateElement(element)) {
            data.push(element);
            return b;
          }
        }
        if (el.toHtml) {
          element.name = element.name.replace(rreturn, "cke:$1");
        }
        return b0;
      }
      function removeClass(name) {
        var leaks = [];
        var key;
        for (key in name) {
          if (key.indexOf("*") > -1) {
            leaks.push(key.replace(/\*/g, ".*"));
          }
        }
        return leaks.length ? RegExp("^(?:" + leaks.join("|") + ")$") : null;
      }
      function updateAttributes(element) {
        var attrs = element.attributes;
        var origStyles;
        delete attrs.style;
        delete attrs["class"];
        if (origStyles = CKEDITOR.tools.writeCssText(element.styles, true)) {
          attrs.style = origStyles;
        }
        if (element.classes.length) {
          attrs["class"] = element.classes.sort().join(" ");
        }
      }
      function validateElement(element) {
        switch(element.name) {
          case "a":
            if (!element.children.length && !element.attributes.name) {
              return false;
            }
            break;
          case "img":
            if (!element.attributes.src) {
              return false;
            }
          ;
        }
        return true;
      }
      function f(el) {
        if (!el) {
          return false;
        }
        if (el === true) {
          return true;
        }
        var optgroup = removeClass(el);
        return function($) {
          return $ in el || optgroup && $.match(optgroup);
        };
      }
      function createBr() {
        return new CKEDITOR.htmlParser.element("br");
      }
      function isBrOrBlock(node) {
        return node.type == CKEDITOR.NODE_ELEMENT && (node.name == "br" || DTD.$block[node.name]);
      }
      function removeElement(element, enterTag, toBeChecked) {
        var name = element.name;
        if (DTD.$empty[name] || !element.children.length) {
          if (name == "hr" && enterTag == "br") {
            element.replaceWith(createBr());
          } else {
            if (element.parent) {
              toBeChecked.push({
                check : "it",
                el : element.parent
              });
            }
            element.remove();
          }
        } else {
          if (DTD.$block[name] || name == "tr") {
            if (enterTag == "br") {
              if (element.previous && !isBrOrBlock(element.previous)) {
                enterTag = createBr();
                enterTag.insertBefore(element);
              }
              if (element.next && !isBrOrBlock(element.next)) {
                enterTag = createBr();
                enterTag.insertAfter(element);
              }
              element.replaceWithChildren();
            } else {
              name = element.children;
              var parent;
              b: {
                parent = DTD[enterTag];
                var _i = 0;
                var _len = name.length;
                var node;
                for (;_i < _len;++_i) {
                  node = name[_i];
                  if (node.type == CKEDITOR.NODE_ELEMENT && !parent[node.name]) {
                    parent = false;
                    break b;
                  }
                }
                parent = true;
              }
              if (parent) {
                element.name = enterTag;
                element.attributes = {};
                toBeChecked.push({
                  check : "parent-down",
                  el : element
                });
              } else {
                parent = element.parent;
                _i = parent.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || parent.name == "body";
                var p;
                _len = name.length;
                for (;_len > 0;) {
                  node = name[--_len];
                  if (_i && (node.type == CKEDITOR.NODE_TEXT || node.type == CKEDITOR.NODE_ELEMENT && DTD.$inline[node.name])) {
                    if (!p) {
                      p = new CKEDITOR.htmlParser.element(enterTag);
                      p.insertAfter(element);
                      toBeChecked.push({
                        check : "parent-down",
                        el : p
                      });
                    }
                    p.add(node, 0);
                  } else {
                    p = null;
                    node.insertAfter(element);
                    if (parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                      if (node.type == CKEDITOR.NODE_ELEMENT && !DTD[parent.name][node.name]) {
                        toBeChecked.push({
                          check : "el-up",
                          el : node
                        });
                      }
                    }
                  }
                }
                element.remove();
              }
            }
          } else {
            if (name == "style") {
              element.remove();
            } else {
              if (element.parent) {
                toBeChecked.push({
                  check : "it",
                  el : element.parent
                });
              }
              element.replaceWithChildren();
            }
          }
        }
      }
      function applyTransformationsGroup(filter, optgroup, codeSegments) {
        var i;
        var rule;
        i = 0;
        for (;i < codeSegments.length;++i) {
          rule = codeSegments[i];
          if ((!rule.check || filter.check(rule.check, false)) && (!rule.left || rule.left(optgroup))) {
            rule.right(optgroup, key);
            break;
          }
        }
      }
      function elementMatchesStyle(element, style) {
        var def = style.getDefinition();
        var defAttrs = def.attributes;
        var defStyles = def.styles;
        var attrName;
        var styleName;
        var reserved;
        var i;
        if (element.name != def.element) {
          return false;
        }
        for (attrName in defAttrs) {
          if (attrName == "class") {
            def = defAttrs[attrName].split(/\s+/);
            reserved = element.classes.join("|");
            for (;i = def.pop();) {
              if (reserved.indexOf(i) == -1) {
                return false;
              }
            }
          } else {
            if (element.attributes[attrName] != defAttrs[attrName]) {
              return false;
            }
          }
        }
        for (styleName in defStyles) {
          if (element.styles[styleName] != defStyles[styleName]) {
            return false;
          }
        }
        return true;
      }
      function getContentFormTransformationGroup(form, preferredForm) {
        var element;
        var left;
        if (typeof form == "string") {
          element = form;
        } else {
          if (form instanceof CKEDITOR.style) {
            left = form;
          } else {
            element = form[0];
            left = form[1];
          }
        }
        return[{
          element : element,
          left : left,
          right : function(name, keepData) {
            keepData.transform(name, preferredForm);
          }
        }];
      }
      function getMatchStyleFn(style) {
        return function(classesToRemove) {
          return elementMatchesStyle(classesToRemove, style);
        };
      }
      function getTransformationFn(toolName) {
        return function(el, tools) {
          tools[toolName](el);
        };
      }
      var DTD = CKEDITOR.dtd;
      var b = 1;
      var copy = CKEDITOR.tools.copy;
      var trim = CKEDITOR.tools.trim;
      var TEST_VALUE = "cke-test";
      var enterModeTags = ["", "p", "br", "div"];
      CKEDITOR.FILTER_SKIP_TREE = 2;
      CKEDITOR.filter = function(name) {
        this.allowedContent = [];
        this.disallowedContent = [];
        this.elementCallbacks = null;
        this.disabled = false;
        this.editor = null;
        this.id = CKEDITOR.tools.getNextNumber();
        this._ = {
          allowedRules : {
            elements : {},
            generic : []
          },
          disallowedRules : {
            elements : {},
            generic : []
          },
          transformations : {},
          cachedTests : {}
        };
        CKEDITOR.filter.instances[this.id] = this;
        if (name instanceof CKEDITOR.editor) {
          name = this.editor = name;
          this.customConfig = true;
          var allowedContent = name.config.allowedContent;
          if (allowedContent === true) {
            this.disabled = true;
          } else {
            if (!allowedContent) {
              this.customConfig = false;
            }
            this.allow(allowedContent, "config", 1);
            this.allow(name.config.extraAllowedContent, "extra", 1);
            this.allow(enterModeTags[name.enterMode] + " " + enterModeTags[name.shiftEnterMode], "default", 1);
            this.disallow(name.config.disallowedContent);
          }
        } else {
          this.customConfig = false;
          this.allow(name, "default", 1);
        }
      };
      CKEDITOR.filter.instances = {};
      CKEDITOR.filter.prototype = {
        allow : function(newRules, featureName, attrs) {
          if (!onClick(this, newRules, attrs)) {
            return false;
          }
          var rule;
          var ret;
          if (typeof newRules == "string") {
            newRules = parseRulesString(newRules);
          } else {
            if (newRules instanceof CKEDITOR.style) {
              if (newRules.toAllowedContentRules) {
                return this.allow(newRules.toAllowedContentRules(this.editor), featureName, attrs);
              }
              rule = newRules.getDefinition();
              newRules = {};
              attrs = rule.attributes;
              newRules[rule.element] = rule = {
                styles : rule.styles,
                requiredStyles : rule.styles && CKEDITOR.tools.objectKeys(rule.styles)
              };
              if (attrs) {
                attrs = copy(attrs);
                rule.classes = attrs["class"] ? attrs["class"].split(/\s+/) : null;
                rule.requiredClasses = rule.classes;
                delete attrs["class"];
                rule.attributes = attrs;
                rule.requiredAttributes = attrs && CKEDITOR.tools.objectKeys(attrs);
              }
            } else {
              if (CKEDITOR.tools.isArray(newRules)) {
                rule = 0;
                for (;rule < newRules.length;++rule) {
                  ret = this.allow(newRules[rule], featureName, attrs);
                }
                return ret;
              }
            }
          }
          parse(this, newRules, featureName, this.allowedContent, this._.allowedRules);
          return true;
        },
        applyTo : function(toBeChecked, recurring, element, enterMode) {
          if (this.disabled) {
            return false;
          }
          var body = this;
          var msgs = [];
          var protectedRegexs = this.editor && this.editor.config.protectedSource;
          var a;
          var isModified = false;
          var failuresLink = {
            doFilter : !element,
            doTransform : true,
            doCallbacks : true,
            toHtml : recurring
          };
          toBeChecked.forEach(function(el) {
            if (el.type == CKEDITOR.NODE_ELEMENT) {
              if (el.attributes["data-cke-filter"] == "off") {
                return false;
              }
              if (!recurring || !(el.name == "span" && ~CKEDITOR.tools.objectKeys(el.attributes).join("|").indexOf("data-cke-"))) {
                a = updateElement(body, el, msgs, failuresLink);
                if (a & b) {
                  isModified = true;
                } else {
                  if (a & 2) {
                    return false;
                  }
                }
              }
            } else {
              if (el.type == CKEDITOR.NODE_COMMENT && el.value.match(/^\{cke_protected\}(?!\{C\})/)) {
                var memory;
                a: {
                  var source = decodeURIComponent(el.value.replace(/^\{cke_protected\}/, ""));
                  memory = [];
                  var activeClassName;
                  var i;
                  var codeSegments;
                  if (protectedRegexs) {
                    i = 0;
                    for (;i < protectedRegexs.length;++i) {
                      if ((codeSegments = source.match(protectedRegexs[i])) && codeSegments[0].length == source.length) {
                        memory = true;
                        break a;
                      }
                    }
                  }
                  source = CKEDITOR.htmlParser.fragment.fromHtml(source);
                  if (source.children.length == 1) {
                    if ((activeClassName = source.children[0]).type == CKEDITOR.NODE_ELEMENT) {
                      updateElement(body, activeClassName, memory, failuresLink);
                    }
                  }
                  memory = !memory.length;
                }
                if (!memory) {
                  msgs.push(el);
                }
              }
            }
          }, null, true);
          if (msgs.length) {
            isModified = true;
          }
          var check;
          toBeChecked = [];
          enterMode = enterModeTags[enterMode || (this.editor ? this.editor.enterMode : CKEDITOR.ENTER_P)];
          for (;element = msgs.pop();) {
            if (element.type == CKEDITOR.NODE_ELEMENT) {
              removeElement(element, enterMode, toBeChecked);
            } else {
              element.remove();
            }
          }
          for (;check = toBeChecked.pop();) {
            element = check.el;
            if (element.parent) {
              switch(check.check) {
                case "it":
                  if (DTD.$removeEmpty[element.name] && !element.children.length) {
                    removeElement(element, enterMode, toBeChecked);
                  } else {
                    if (!validateElement(element)) {
                      removeElement(element, enterMode, toBeChecked);
                    }
                  }
                  break;
                case "el-up":
                  if (element.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                    if (!DTD[element.parent.name][element.name]) {
                      removeElement(element, enterMode, toBeChecked);
                    }
                  }
                  break;
                case "parent-down":
                  if (element.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                    if (!DTD[element.parent.name][element.name]) {
                      removeElement(element.parent, enterMode, toBeChecked);
                    }
                  }
                ;
              }
            }
          }
          return isModified;
        },
        checkFeature : function(feature) {
          if (this.disabled || !feature) {
            return true;
          }
          if (feature.toFeature) {
            feature = feature.toFeature(this.editor);
          }
          return!feature.requiredContent || this.check(feature.requiredContent);
        },
        disable : function() {
          this.disabled = true;
        },
        disallow : function(k) {
          if (!onClick(this, k, true)) {
            return false;
          }
          if (typeof k == "string") {
            k = parseRulesString(k);
          }
          parse(this, k, null, this.disallowedContent, this._.disallowedRules);
          return true;
        },
        addContentForms : function(forms) {
          if (!this.disabled && forms) {
            var i;
            var form;
            var transfGroups = [];
            var preferredForm;
            i = 0;
            for (;i < forms.length && !preferredForm;++i) {
              form = forms[i];
              if ((typeof form == "string" || form instanceof CKEDITOR.style) && this.check(form)) {
                preferredForm = form;
              }
            }
            if (preferredForm) {
              i = 0;
              for (;i < forms.length;++i) {
                transfGroups.push(getContentFormTransformationGroup(forms[i], preferredForm));
              }
              this.addTransformations(transfGroups);
            }
          }
        },
        addElementCallback : function(spaceName) {
          if (!this.elementCallbacks) {
            this.elementCallbacks = [];
          }
          this.elementCallbacks.push(spaceName);
        },
        addFeature : function(feature) {
          if (this.disabled || !feature) {
            return true;
          }
          if (feature.toFeature) {
            feature = feature.toFeature(this.editor);
          }
          this.allow(feature.allowedContent, feature.name);
          this.addTransformations(feature.contentTransformations);
          this.addContentForms(feature.contentForms);
          return feature.requiredContent && (this.customConfig || this.disallowedContent.length) ? this.check(feature.requiredContent) : true;
        },
        addTransformations : function(transformations) {
          var b;
          var content;
          if (!this.disabled && transformations) {
            var items = this._.transformations;
            var i;
            i = 0;
            for (;i < transformations.length;++i) {
              b = transformations[i];
              var o = void 0;
              var j = void 0;
              var rule = void 0;
              var check = void 0;
              var left = void 0;
              var right = void 0;
              content = [];
              j = 0;
              for (;j < b.length;++j) {
                rule = b[j];
                if (typeof rule == "string") {
                  rule = rule.split(/\s*:\s*/);
                  check = rule[0];
                  left = null;
                  right = rule[1];
                } else {
                  check = rule.check;
                  left = rule.left;
                  right = rule.right;
                }
                if (!o) {
                  o = rule;
                  o = o.element ? o.element : check ? check.match(/^([a-z0-9]+)/i)[0] : o.left.getDefinition().element;
                }
                if (left instanceof CKEDITOR.style) {
                  left = getMatchStyleFn(left);
                }
                content.push({
                  check : check == o ? null : check,
                  left : left,
                  right : typeof right == "string" ? getTransformationFn(right) : right
                });
              }
              b = o;
              if (!items[b]) {
                items[b] = [];
              }
              items[b].push(content);
            }
          }
        },
        check : function(item, obj, immediate) {
          if (this.disabled) {
            return true;
          }
          if (CKEDITOR.tools.isArray(item)) {
            var element = item.length;
            for (;element--;) {
              if (this.check(item[element], obj, immediate)) {
                return true;
              }
            }
            return false;
          }
          var options;
          var cacheKey;
          if (typeof item == "string") {
            cacheKey = item + "<" + (obj === false ? "0" : "1") + (immediate ? "1" : "0") + ">";
            if (cacheKey in this._.cachedChecks) {
              return this._.cachedChecks[cacheKey];
            }
            element = parseRulesString(item).$1;
            options = element.styles;
            var classes = element.classes;
            element.name = element.elements;
            element.classes = classes = classes ? classes.split(/\s*,\s*/) : [];
            element.styles = mockHash(options);
            element.attributes = mockHash(element.attributes);
            element.children = [];
            if (classes.length) {
              element.attributes["class"] = classes.join(" ");
            }
            if (options) {
              element.attributes.style = CKEDITOR.tools.writeCssText(element.styles);
            }
            options = element;
          } else {
            element = item.getDefinition();
            options = element.styles;
            classes = element.attributes || {};
            if (options) {
              options = copy(options);
              classes.style = CKEDITOR.tools.writeCssText(options, true);
            } else {
              options = {};
            }
            options = {
              name : element.element,
              attributes : classes,
              classes : classes["class"] ? classes["class"].split(/\s+/) : [],
              styles : options,
              children : []
            };
          }
          classes = CKEDITOR.tools.clone(options);
          var memory = [];
          var formElements;
          if (obj !== false && (formElements = this._.transformations[options.name])) {
            element = 0;
            for (;element < formElements.length;++element) {
              applyTransformationsGroup(this, options, formElements[element]);
            }
            updateAttributes(options);
          }
          updateElement(this, classes, memory, {
            doFilter : true,
            doTransform : obj !== false,
            skipRequired : !immediate,
            skipFinalValidation : !immediate
          });
          obj = memory.length > 0 ? false : CKEDITOR.tools.objectCompare(options.attributes, classes.attributes, true) ? true : false;
          if (typeof item == "string") {
            this._.cachedChecks[cacheKey] = obj;
          }
          return obj;
        },
        getAllowedEnterMode : function() {
          var tagsToCheck = ["p", "div", "br"];
          var enterModes = {
            p : CKEDITOR.ENTER_P,
            div : CKEDITOR.ENTER_DIV,
            br : CKEDITOR.ENTER_BR
          };
          return function(defaultMode, dataAndEvents) {
            var eventPath = tagsToCheck.slice();
            var tag;
            if (this.check(enterModeTags[defaultMode])) {
              return defaultMode;
            }
            if (!dataAndEvents) {
              eventPath = eventPath.reverse();
            }
            for (;tag = eventPath.pop();) {
              if (this.check(tag)) {
                return enterModes[tag];
              }
            }
            return CKEDITOR.ENTER_BR;
          };
        }()
      };
      var options = {
        styles : 1,
        attributes : 1,
        classes : 1
      };
      var validatorsRequired = {
        styles : "requiredStyles",
        attributes : "requiredAttributes",
        classes : "requiredClasses"
      };
      var optgroup = /^([a-z0-9*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i;
      var groupsPatterns = {
        styles : /{([^}]+)}/,
        attrs : /\[([^\]]+)\]/,
        classes : /\(([^\)]+)\)/
      };
      var r20 = /^cke:(object|embed|param)$/;
      var rreturn = /^(object|embed|param)$/;
      var key = CKEDITOR.filter.transformationsTools = {
        sizeToStyle : function(element) {
          this.lengthToStyle(element, "width");
          this.lengthToStyle(element, "height");
        },
        sizeToAttribute : function(element) {
          this.lengthToAttribute(element, "width");
          this.lengthToAttribute(element, "height");
        },
        lengthToStyle : function(element, attrName, styleName) {
          styleName = styleName || attrName;
          if (!(styleName in element.styles)) {
            var value = element.attributes[attrName];
            if (value) {
              if (/^\d+$/.test(value)) {
                value = value + "px";
              }
              element.styles[styleName] = value;
            }
          }
          delete element.attributes[attrName];
        },
        lengthToAttribute : function(element, styleName, attrName) {
          attrName = attrName || styleName;
          if (!(attrName in element.attributes)) {
            var value = element.styles[styleName];
            var attrNames = value && value.match(/^(\d+)(?:\.\d*)?px$/);
            if (attrNames) {
              element.attributes[attrName] = attrNames[1];
            } else {
              if (value == TEST_VALUE) {
                element.attributes[attrName] = TEST_VALUE;
              }
            }
          }
          delete element.styles[styleName];
        },
        alignmentToStyle : function(element) {
          if (!("float" in element.styles)) {
            var value = element.attributes.align;
            if (value == "left" || value == "right") {
              element.styles["float"] = value;
            }
          }
          delete element.attributes.align;
        },
        alignmentToAttribute : function(element) {
          if (!("align" in element.attributes)) {
            var value = element.styles["float"];
            if (value == "left" || value == "right") {
              element.attributes.align = value;
            }
          }
          delete element.styles["float"];
        },
        matchesStyle : elementMatchesStyle,
        transform : function(el, form) {
          if (typeof form == "string") {
            el.name = form;
          } else {
            var result = form.getDefinition();
            var iterable = result.styles;
            var attrs = result.attributes;
            var attr;
            var key;
            var eventPath;
            var elem;
            el.name = result.element;
            for (attr in attrs) {
              if (attr == "class") {
                result = el.classes.join("|");
                eventPath = attrs[attr].split(/\s+/);
                for (;elem = eventPath.pop();) {
                  if (result.indexOf(elem) == -1) {
                    el.classes.push(elem);
                  }
                }
              } else {
                el.attributes[attr] = attrs[attr];
              }
            }
            for (key in iterable) {
              el.styles[key] = iterable[key];
            }
          }
        }
      };
    })();
    (function() {
      CKEDITOR.focusManager = function(editor) {
        if (editor.focusManager) {
          return editor.focusManager;
        }
        this.hasFocus = false;
        this.currentActive = null;
        this._ = {
          editor : editor
        };
        return this;
      };
      CKEDITOR.focusManager._ = {
        blurDelay : 200
      };
      CKEDITOR.focusManager.prototype = {
        focus : function(object) {
          if (this._.timer) {
            clearTimeout(this._.timer);
          }
          if (object) {
            this.currentActive = object;
          }
          if (!this.hasFocus && !this._.locked) {
            if (object = CKEDITOR.currentInstance) {
              object.focusManager.blur(1);
            }
            this.hasFocus = true;
            if (object = this._.editor.container) {
              object.addClass("cke_focus");
            }
            this._.editor.fire("focus");
          }
        },
        lock : function() {
          this._.locked = 1;
        },
        unlock : function() {
          delete this._.locked;
        },
        blur : function(noDelay) {
          function doBlur() {
            if (this.hasFocus) {
              this.hasFocus = false;
              var ct = this._.editor.container;
              if (ct) {
                ct.removeClass("cke_focus");
              }
              this._.editor.fire("blur");
            }
          }
          if (!this._.locked) {
            if (this._.timer) {
              clearTimeout(this._.timer);
            }
            var delay = CKEDITOR.focusManager._.blurDelay;
            if (noDelay || !delay) {
              doBlur.call(this);
            } else {
              this._.timer = CKEDITOR.tools.setTimeout(function() {
                delete this._.timer;
                doBlur.call(this);
              }, delay, this);
            }
          }
        },
        add : function(name, expectedNumberOfNonCommentArgs) {
          var b = name.getCustomData("focusmanager");
          if (!b || b != this) {
            if (b) {
              b.remove(name);
            }
            b = "focus";
            var rvar = "blur";
            if (expectedNumberOfNonCommentArgs) {
              if (CKEDITOR.env.ie) {
                b = "focusin";
                rvar = "focusout";
              } else {
                CKEDITOR.event.useCapture = 1;
              }
            }
            var listeners = {
              blur : function() {
                if (name.equals(this.currentActive)) {
                  this.blur();
                }
              },
              focus : function() {
                this.focus(name);
              }
            };
            name.on(b, listeners.focus, this);
            name.on(rvar, listeners.blur, this);
            if (expectedNumberOfNonCommentArgs) {
              CKEDITOR.event.useCapture = 0;
            }
            name.setCustomData("focusmanager", this);
            name.setCustomData("focusmanager_handlers", listeners);
          }
        },
        remove : function(name) {
          name.removeCustomData("focusmanager");
          var options = name.removeCustomData("focusmanager_handlers");
          name.removeListener("blur", options.blur);
          name.removeListener("focus", options.focus);
        }
      };
    })();
    CKEDITOR.keystrokeHandler = function(editor) {
      if (editor.keystrokeHandler) {
        return editor.keystrokeHandler;
      }
      this.keystrokes = {};
      this.blockedKeystrokes = {};
      this._ = {
        editor : editor
      };
      return this;
    };
    (function() {
      var a;
      var onKeyDown = function(ev) {
        ev = ev.data;
        var keyCombination = ev.getKeystroke();
        var command = this.keystrokes[keyCombination];
        var editor = this._.editor;
        a = editor.fire("key", {
          keyCode : keyCombination,
          domEvent : ev
        }) === false;
        if (!a) {
          if (command) {
            a = editor.execCommand(command, {
              from : "keystrokeHandler"
            }) !== false;
          }
          if (!a) {
            a = !!this.blockedKeystrokes[keyCombination];
          }
        }
        if (a) {
          ev.preventDefault(true);
        }
        return!a;
      };
      var onKeyPress = function(evt) {
        if (a) {
          a = false;
          evt.data.preventDefault(true);
        }
      };
      CKEDITOR.keystrokeHandler.prototype = {
        attach : function(domObject) {
          domObject.on("keydown", onKeyDown, this);
          if (CKEDITOR.env.gecko && CKEDITOR.env.mac) {
            domObject.on("keypress", onKeyPress, this);
          }
        }
      };
    })();
    (function() {
      CKEDITOR.lang = {
        languages : {
          af : 1,
          ar : 1,
          bg : 1,
          bn : 1,
          bs : 1,
          ca : 1,
          cs : 1,
          cy : 1,
          da : 1,
          de : 1,
          el : 1,
          "en-au" : 1,
          "en-ca" : 1,
          "en-gb" : 1,
          en : 1,
          eo : 1,
          es : 1,
          et : 1,
          eu : 1,
          fa : 1,
          fi : 1,
          fo : 1,
          "fr-ca" : 1,
          fr : 1,
          gl : 1,
          gu : 1,
          he : 1,
          hi : 1,
          hr : 1,
          hu : 1,
          id : 1,
          is : 1,
          it : 1,
          ja : 1,
          ka : 1,
          km : 1,
          ko : 1,
          ku : 1,
          lt : 1,
          lv : 1,
          mk : 1,
          mn : 1,
          ms : 1,
          nb : 1,
          nl : 1,
          no : 1,
          pl : 1,
          "pt-br" : 1,
          pt : 1,
          ro : 1,
          ru : 1,
          si : 1,
          sk : 1,
          sl : 1,
          sq : 1,
          "sr-latn" : 1,
          sr : 1,
          sv : 1,
          th : 1,
          tr : 1,
          tt : 1,
          ug : 1,
          uk : 1,
          vi : 1,
          "zh-cn" : 1,
          zh : 1
        },
        rtl : {
          ar : 1,
          fa : 1,
          he : 1,
          ku : 1,
          ug : 1
        },
        load : function(id, callback, cb) {
          if (!id || !CKEDITOR.lang.languages[id]) {
            id = this.detect(callback, id);
          }
          var files = this;
          callback = function() {
            files[id].dir = files.rtl[id] ? "rtl" : "ltr";
            cb(id, files[id]);
          };
          if (this[id]) {
            callback();
          } else {
            CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("lang/" + id + ".js"), callback, this);
          }
        },
        detect : function(defaultLanguage, evt) {
          var languages = this.languages;
          evt = evt || (navigator.userLanguage || (navigator.language || defaultLanguage));
          var locale = evt.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/);
          var lang = locale[1];
          locale = locale[2];
          if (languages[lang + "-" + locale]) {
            lang = lang + "-" + locale;
          } else {
            if (!languages[lang]) {
              lang = null;
            }
          }
          CKEDITOR.lang.detect = lang ? function() {
            return lang;
          } : function(opt_capt) {
            return opt_capt;
          };
          return lang || defaultLanguage;
        }
      };
    })();
    CKEDITOR.scriptLoader = function() {
      var urlFetched = {};
      var waitingList = {};
      return{
        load : function(names, callback, optgroup, recurring) {
          var methodInvoked = typeof names == "string";
          if (methodInvoked) {
            names = [names];
          }
          if (!optgroup) {
            optgroup = CKEDITOR;
          }
          var len = names.length;
          var key = [];
          var hash = [];
          var doCallback = function(name) {
            if (callback) {
              if (methodInvoked) {
                callback.call(optgroup, name);
              } else {
                callback.call(optgroup, key, hash);
              }
            }
          };
          if (len === 0) {
            doCallback(true);
          } else {
            var checkLoaded = function(url, success) {
              (success ? key : hash).push(url);
              if (--len <= 0) {
                if (recurring) {
                  CKEDITOR.document.getDocumentElement().removeStyle("cursor");
                }
                doCallback(success);
              }
            };
            var onLoad = function(url, success) {
              urlFetched[url] = 1;
              var waitingInfo = waitingList[url];
              delete waitingList[url];
              var i = 0;
              for (;i < waitingInfo.length;i++) {
                waitingInfo[i](url, success);
              }
            };
            var loadScript = function(url) {
              if (urlFetched[url]) {
                checkLoaded(url, true);
              } else {
                var configList = waitingList[url] || (waitingList[url] = []);
                configList.push(checkLoaded);
                if (!(configList.length > 1)) {
                  var script = new CKEDITOR.dom.element("script");
                  script.setAttributes({
                    type : "text/javascript",
                    src : url
                  });
                  if (callback) {
                    if (CKEDITOR.env.ie && CKEDITOR.env.version < 11) {
                      script.$.onreadystatechange = function() {
                        if (script.$.readyState == "loaded" || script.$.readyState == "complete") {
                          script.$.onreadystatechange = null;
                          onLoad(url, true);
                        }
                      };
                    } else {
                      script.$.onload = function() {
                        setTimeout(function() {
                          onLoad(url, true);
                        }, 0);
                      };
                      script.$.onerror = function() {
                        onLoad(url, false);
                      };
                    }
                  }
                  script.appendTo(CKEDITOR.document.getHead());
                }
              }
            };
            if (recurring) {
              CKEDITOR.document.getDocumentElement().setStyle("cursor", "wait");
            }
            var i = 0;
            for (;i < len;i++) {
              loadScript(names[i]);
            }
          }
        },
        queue : function() {
          function onLoad() {
            var script;
            if (script = pending[0]) {
              this.load(script.scriptUrl, script.callback, CKEDITOR, 0);
            }
          }
          var pending = [];
          return function(scriptUrl, matcherFunction) {
            var optgroup = this;
            pending.push({
              scriptUrl : scriptUrl,
              callback : function() {
                if (matcherFunction) {
                  matcherFunction.apply(this, arguments);
                }
                pending.shift();
                onLoad.call(optgroup);
              }
            });
            if (pending.length == 1) {
              onLoad.call(this);
            }
          };
        }()
      };
    }();
    CKEDITOR.resourceManager = function(basePath, file) {
      this.basePath = basePath;
      this.fileName = file;
      this.registered = {};
      this.loaded = {};
      this.externals = {};
      this._ = {
        waitingList : {}
      };
    };
    CKEDITOR.resourceManager.prototype = {
      add : function(name, expectedNumberOfNonCommentArgs) {
        if (this.registered[name]) {
          throw'[CKEDITOR.resourceManager.add] The resource name "' + name + '" is already registered.';
        }
        var resource = this.registered[name] = expectedNumberOfNonCommentArgs || {};
        resource.name = name;
        resource.path = this.getPath(name);
        CKEDITOR.fire(name + CKEDITOR.tools.capitalize(this.fileName) + "Ready", resource);
        return this.get(name);
      },
      get : function(name) {
        return this.registered[name] || null;
      },
      getPath : function(name) {
        var external = this.externals[name];
        return CKEDITOR.getUrl(external && external.dir || this.basePath + name + "/");
      },
      getFilePath : function(name) {
        var external = this.externals[name];
        return CKEDITOR.getUrl(this.getPath(name) + (external ? external.file : this.fileName + ".js"));
      },
      addExternal : function(names, deepDataAndEvents, fileName) {
        names = names.split(",");
        var i = 0;
        for (;i < names.length;i++) {
          var name = names[i];
          if (!fileName) {
            deepDataAndEvents = deepDataAndEvents.replace(/[^\/]+$/, function(item) {
              fileName = item;
              return "";
            });
          }
          this.externals[name] = {
            dir : deepDataAndEvents,
            file : fileName || this.fileName + ".js"
          };
        }
      },
      load : function(names, callback, optgroup) {
        if (!CKEDITOR.tools.isArray(names)) {
          names = names ? [names] : [];
        }
        var old = this.loaded;
        var registered = this.registered;
        var url = [];
        var data = {};
        var key = {};
        var i = 0;
        for (;i < names.length;i++) {
          var name = names[i];
          if (name) {
            if (!old[name] && !registered[name]) {
              var action = this.getFilePath(name);
              url.push(action);
              if (!(action in data)) {
                data[action] = [];
              }
              data[action].push(name);
            } else {
              key[name] = this.get(name);
            }
          }
        }
        CKEDITOR.scriptLoader.load(url, function(chunks, no) {
          if (no.length) {
            throw'[CKEDITOR.resourceManager.load] Resource name "' + data[no[0]].join(",") + '" was not found at "' + no[0] + '".';
          }
          var index = 0;
          for (;index < chunks.length;index++) {
            var codeSegments = data[chunks[index]];
            var i = 0;
            for (;i < codeSegments.length;i++) {
              var name = codeSegments[i];
              key[name] = this.get(name);
              old[name] = 1;
            }
          }
          callback.call(optgroup, key);
        }, this);
      }
    };
    CKEDITOR.plugins = new CKEDITOR.resourceManager("plugins/", "plugin");
    CKEDITOR.plugins.load = CKEDITOR.tools.override(CKEDITOR.plugins.load, function(opt_reviver) {
      var prevSources = {};
      return function(name, method, scope) {
        var key = {};
        var loadPlugins = function(key) {
          opt_reviver.call(this, key, function(plugins) {
            CKEDITOR.tools.extend(key, plugins);
            var name = [];
            var i;
            for (i in plugins) {
              var plugin = plugins[i];
              var lookup = plugin && plugin.requires;
              if (!prevSources[i]) {
                if (plugin.icons) {
                  var tokenized = plugin.icons.split(",");
                  var index = tokenized.length;
                  for (;index--;) {
                    CKEDITOR.skin.addIcon(tokenized[index], plugin.path + "icons/" + (CKEDITOR.env.hidpi && plugin.hidpi ? "hidpi/" : "") + tokenized[index] + ".png");
                  }
                }
                prevSources[i] = 1;
              }
              if (lookup) {
                if (lookup.split) {
                  lookup = lookup.split(",");
                }
                plugin = 0;
                for (;plugin < lookup.length;plugin++) {
                  if (!key[lookup[plugin]]) {
                    name.push(lookup[plugin]);
                  }
                }
              }
            }
            if (name.length) {
              loadPlugins.call(this, name);
            } else {
              for (i in key) {
                plugin = key[i];
                if (plugin.onLoad && !plugin.onLoad._called) {
                  if (plugin.onLoad() === false) {
                    delete key[i];
                  }
                  plugin.onLoad._called = 1;
                }
              }
              if (method) {
                method.call(scope || window, key);
              }
            }
          }, this);
        };
        loadPlugins.call(this, name);
      };
    });
    CKEDITOR.plugins.setLang = function(name, key, newValue) {
      var query = this.get(name);
      name = query.langEntries || (query.langEntries = {});
      query = query.lang || (query.lang = []);
      if (query.split) {
        query = query.split(",");
      }
      if (CKEDITOR.tools.indexOf(query, key) == -1) {
        query.push(key);
      }
      name[key] = newValue;
    };
    CKEDITOR.ui = function(editor) {
      if (editor.ui) {
        return editor.ui;
      }
      this.items = {};
      this.instances = {};
      this.editor = editor;
      this._ = {
        handlers : {}
      };
      return this;
    };
    CKEDITOR.ui.prototype = {
      add : function(name, expectedNumberOfNonCommentArgs, definition) {
        definition.name = name.toLowerCase();
        var attributes = this.items[name] = {
          type : expectedNumberOfNonCommentArgs,
          command : definition.command || null,
          args : Array.prototype.slice.call(arguments, 2)
        };
        CKEDITOR.tools.extend(attributes, definition);
      },
      get : function(name) {
        return this.instances[name];
      },
      create : function(name) {
        var item = this.items[name];
        var o = item && this._.handlers[item.type];
        var command = item && (item.command && this.editor.getCommand(item.command));
        o = o && o.create.apply(this, item.args);
        this.instances[name] = o;
        if (command) {
          command.uiItems.push(o);
        }
        if (o && !o.type) {
          o.type = item.type;
        }
        return o;
      },
      addHandler : function(type, handler) {
        this._.handlers[type] = handler;
      },
      space : function(name) {
        return CKEDITOR.document.getById(this.spaceId(name));
      },
      spaceId : function(key) {
        return this.editor.id + "_" + key;
      }
    };
    CKEDITOR.event.implementOn(CKEDITOR.ui);
    (function() {
      function Editor(name, keepData, ref) {
        CKEDITOR.event.call(this);
        name = name && CKEDITOR.tools.clone(name);
        if (keepData !== void 0) {
          if (keepData instanceof CKEDITOR.dom.element) {
            if (!ref) {
              throw Error("One of the element modes must be specified.");
            }
          } else {
            throw Error("Expect element of type CKEDITOR.dom.element.");
          }
          if (CKEDITOR.env.ie && (CKEDITOR.env.quirks && ref == CKEDITOR.ELEMENT_MODE_INLINE)) {
            throw Error("Inline element mode is not supported on IE quirks.");
          }
          if (!(ref == CKEDITOR.ELEMENT_MODE_INLINE ? keepData.is(CKEDITOR.dtd.$editable) || keepData.is("textarea") : ref == CKEDITOR.ELEMENT_MODE_REPLACE ? !keepData.is(CKEDITOR.dtd.$nonBodyContent) : 1)) {
            throw Error('The specified element mode is not supported on element: "' + keepData.getName() + '".');
          }
          this.element = keepData;
          this.elementMode = ref;
          this.name = this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO && (keepData.getId() || keepData.getNameAtt());
        } else {
          this.elementMode = CKEDITOR.ELEMENT_MODE_NONE;
        }
        this._ = {};
        this.commands = {};
        this.templates = {};
        this.name = this.name || genEditorName();
        this.id = CKEDITOR.tools.getNextId();
        this.status = "unloaded";
        this.config = CKEDITOR.tools.prototypedCopy(CKEDITOR.config);
        this.ui = new CKEDITOR.ui(this);
        this.focusManager = new CKEDITOR.focusManager(this);
        this.keystrokeHandler = new CKEDITOR.keystrokeHandler(this);
        this.on("readOnly", on);
        this.on("selectionChange", function(evt) {
          updateCommandsContext(this, evt.data.path);
        });
        this.on("activeFilterChange", function() {
          updateCommandsContext(this, this.elementPath(), true);
        });
        this.on("mode", on);
        this.on("instanceReady", function() {
          if (this.config.startupFocus) {
            this.focus();
          }
        });
        CKEDITOR.fire("instanceCreated", null, this);
        CKEDITOR.add(this);
        CKEDITOR.tools.setTimeout(function() {
          initConfig(this, name);
        }, 0, this);
      }
      function genEditorName() {
        do {
          var name = "editor" + ++nameCounter
        } while (CKEDITOR.instances[name]);
        return name;
      }
      function on() {
        var commands = this.commands;
        var name;
        for (name in commands) {
          updateCommand(this, commands[name]);
        }
      }
      function updateCommand(editor, cmd) {
        cmd[cmd.startDisabled ? "disable" : editor.readOnly && !cmd.readOnly ? "disable" : cmd.modes[editor.mode] ? "enable" : "disable"]();
      }
      function updateCommandsContext(editor, path, forceRefresh) {
        if (path) {
          var command;
          var name;
          var commands = editor.commands;
          for (name in commands) {
            command = commands[name];
            if (forceRefresh || command.contextSensitive) {
              command.refresh(editor, path);
            }
          }
        }
      }
      function loadConfig(optgroup) {
        var customConfig = optgroup.config.customConfig;
        if (!customConfig) {
          return false;
        }
        customConfig = CKEDITOR.getUrl(customConfig);
        var options = loadConfigLoaded[customConfig] || (loadConfigLoaded[customConfig] = {});
        if (options.fn) {
          options.fn.call(optgroup, optgroup.config);
          if (CKEDITOR.getUrl(optgroup.config.customConfig) == customConfig || !loadConfig(optgroup)) {
            optgroup.fireOnce("customConfigLoaded");
          }
        } else {
          CKEDITOR.scriptLoader.queue(customConfig, function() {
            options.fn = CKEDITOR.editorConfig ? CKEDITOR.editorConfig : function() {
            };
            loadConfig(optgroup);
          });
        }
        return true;
      }
      function initConfig(editor, instanceConfig) {
        editor.on("customConfigLoaded", function() {
          if (instanceConfig) {
            if (instanceConfig.on) {
              var eventName;
              for (eventName in instanceConfig.on) {
                editor.on(eventName, instanceConfig.on[eventName]);
              }
            }
            CKEDITOR.tools.extend(editor.config, instanceConfig, true);
            delete editor.config.on;
          }
          eventName = editor.config;
          editor.readOnly = !(!eventName.readOnly && !(editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? editor.element.is("textarea") ? editor.element.hasAttribute("disabled") : editor.element.isReadOnly() : editor.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && editor.element.hasAttribute("disabled")));
          editor.blockless = editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? !(editor.element.is("textarea") || CKEDITOR.dtd[editor.element.getName()].p) : false;
          editor.tabIndex = eventName.tabIndex || (editor.element && editor.element.getAttribute("tabindex") || 0);
          editor.activeEnterMode = editor.enterMode = editor.blockless ? CKEDITOR.ENTER_BR : eventName.enterMode;
          editor.activeShiftEnterMode = editor.shiftEnterMode = editor.blockless ? CKEDITOR.ENTER_BR : eventName.shiftEnterMode;
          if (eventName.skin) {
            CKEDITOR.skinName = eventName.skin;
          }
          editor.fireOnce("configLoaded");
          editor.dataProcessor = new CKEDITOR.htmlDataProcessor(editor);
          editor.filter = editor.activeFilter = new CKEDITOR.filter(editor);
          loadSkin(editor);
        });
        if (instanceConfig && instanceConfig.customConfig != void 0) {
          editor.config.customConfig = instanceConfig.customConfig;
        }
        if (!loadConfig(editor)) {
          editor.fireOnce("customConfigLoaded");
        }
      }
      function loadSkin(editor) {
        CKEDITOR.skin.loadPart("editor", function() {
          loadLang(editor);
        });
      }
      function loadLang(editor) {
        CKEDITOR.lang.load(editor.config.language, editor.config.defaultLanguage, function(languageCode, lang) {
          var configTitle = editor.config.title;
          editor.langCode = languageCode;
          editor.lang = CKEDITOR.tools.prototypedCopy(lang);
          editor.title = typeof configTitle == "string" || configTitle === false ? configTitle : [editor.lang.editor, editor.name].join(", ");
          if (!editor.config.contentsLangDirection) {
            editor.config.contentsLangDirection = editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? editor.element.getDirection(1) : editor.lang.dir;
          }
          editor.fire("langLoaded");
          preloadStylesSet(editor);
        });
      }
      function preloadStylesSet(editor) {
        editor.getStylesSet(function(cssFiles) {
          editor.once("loaded", function() {
            editor.fire("stylesSet", {
              styles : cssFiles
            });
          }, null, null, 1);
          loadPlugins(editor);
        });
      }
      function loadPlugins(editor) {
        var config = editor.config;
        var text = config.plugins;
        var extraPlugins = config.extraPlugins;
        var removePlugins = config.removePlugins;
        if (extraPlugins) {
          var cx = RegExp("(?:^|,)(?:" + extraPlugins.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g");
          text = text.replace(cx, "");
          text = text + ("," + extraPlugins);
        }
        if (removePlugins) {
          var optgroup = RegExp("(?:^|,)(?:" + removePlugins.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g");
          text = text.replace(optgroup, "");
        }
        if (CKEDITOR.env.air) {
          text = text + ",adobeair";
        }
        CKEDITOR.plugins.load(text.split(","), function(plugins) {
          var pluginsArray = [];
          var languageCodes = [];
          var pkg = [];
          editor.plugins = plugins;
          var pluginName;
          for (pluginName in plugins) {
            var plugin = plugins[pluginName];
            var path = plugin.lang;
            var lang = null;
            var requires = plugin.requires;
            var match;
            if (CKEDITOR.tools.isArray(requires)) {
              requires = requires.join(",");
            }
            if (requires && (match = requires.match(optgroup))) {
              for (;requires = match.pop();) {
                CKEDITOR.tools.setTimeout(function(requestUrl, dataAndEvents) {
                  throw Error('Plugin "' + requestUrl.replace(",", "") + '" cannot be removed from the plugins list, because it\'s required by "' + dataAndEvents + '" plugin.');
                }, 0, null, [requires, pluginName]);
              }
            }
            if (path && !editor.lang[pluginName]) {
              if (path.split) {
                path = path.split(",");
              }
              if (CKEDITOR.tools.indexOf(path, editor.langCode) >= 0) {
                lang = editor.langCode;
              } else {
                lang = editor.langCode.replace(/-.*/, "");
                lang = lang != editor.langCode && CKEDITOR.tools.indexOf(path, lang) >= 0 ? lang : CKEDITOR.tools.indexOf(path, "en") >= 0 ? "en" : path[0];
              }
              if (!plugin.langEntries || !plugin.langEntries[lang]) {
                pkg.push(CKEDITOR.getUrl(plugin.path + "lang/" + lang + ".js"));
              } else {
                editor.lang[pluginName] = plugin.langEntries[lang];
                lang = null;
              }
            }
            languageCodes.push(lang);
            pluginsArray.push(plugin);
          }
          CKEDITOR.scriptLoader.load(pkg, function() {
            var methods = ["beforeInit", "init", "afterInit"];
            var m = 0;
            for (;m < methods.length;m++) {
              var i = 0;
              for (;i < pluginsArray.length;i++) {
                var plugin = pluginsArray[i];
                if (m === 0) {
                  if (languageCodes[i] && (plugin.lang && plugin.langEntries)) {
                    editor.lang[plugin.name] = plugin.langEntries[languageCodes[i]];
                  }
                }
                if (plugin[methods[m]]) {
                  plugin[methods[m]](editor);
                }
              }
            }
            editor.fireOnce("pluginsLoaded");
            if (config.keystrokes) {
              editor.setKeystroke(editor.config.keystrokes);
            }
            i = 0;
            for (;i < editor.config.blockedKeystrokes.length;i++) {
              editor.keystrokeHandler.blockedKeystrokes[editor.config.blockedKeystrokes[i]] = 1;
            }
            editor.status = "loaded";
            editor.fireOnce("loaded");
            CKEDITOR.fire("instanceLoaded", null, editor);
          });
        });
      }
      function updateEditorElement() {
        var element = this.element;
        if (element && this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
          var data = this.getData();
          if (this.config.htmlEncodeOutput) {
            data = CKEDITOR.tools.htmlEncode(data);
          }
          if (element.is("textarea")) {
            element.setValue(data);
          } else {
            element.setHtml(data);
          }
          return true;
        }
        return false;
      }
      Editor.prototype = CKEDITOR.editor.prototype;
      CKEDITOR.editor = Editor;
      var nameCounter = 0;
      var loadConfigLoaded = {};
      CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
        addCommand : function(name, opt_attributes) {
          opt_attributes.name = name.toLowerCase();
          var cmd = new CKEDITOR.command(this, opt_attributes);
          if (this.mode) {
            updateCommand(this, cmd);
          }
          return this.commands[name] = cmd;
        },
        _attachToForm : function() {
          var editor = this;
          var element = editor.element;
          var form = new CKEDITOR.dom.element(element.$.form);
          if (element.is("textarea") && form) {
            var onSubmit = function(evt) {
              editor.updateElement();
              if (editor._.required) {
                if (!element.getValue() && editor.fire("required") === false) {
                  evt.data.preventDefault();
                }
              }
            };
            form.on("submit", onSubmit);
            if (form.$.submit && (form.$.submit.call && form.$.submit.apply)) {
              form.$.submit = CKEDITOR.tools.override(form.$.submit, function(proceed) {
                return function() {
                  onSubmit();
                  if (proceed.apply) {
                    proceed.apply(this);
                  } else {
                    proceed();
                  }
                };
              });
            }
            editor.on("destroy", function() {
              form.removeListener("submit", onSubmit);
            });
          }
        },
        destroy : function(removeResizeFix) {
          this.fire("beforeDestroy");
          if (!removeResizeFix) {
            updateEditorElement.call(this);
          }
          this.editable(null);
          this.status = "destroyed";
          this.fire("destroy");
          this.removeAllListeners();
          CKEDITOR.remove(this);
          CKEDITOR.fire("instanceDestroyed", null, this);
        },
        elementPath : function(name) {
          if (!name) {
            name = this.getSelection();
            if (!name) {
              return null;
            }
            name = name.getStartElement();
          }
          return name ? new CKEDITOR.dom.elementPath(name, this.editable()) : null;
        },
        createRange : function() {
          var editable = this.editable();
          return editable ? new CKEDITOR.dom.range(editable) : null;
        },
        execCommand : function(name, lab) {
          var command = this.getCommand(name);
          var eventData = {
            name : name,
            commandData : lab,
            command : command
          };
          if (command && (command.state != CKEDITOR.TRISTATE_DISABLED && this.fire("beforeCommandExec", eventData) !== false)) {
            eventData.returnValue = command.exec(eventData.commandData);
            if (!command.async && this.fire("afterCommandExec", eventData) !== false) {
              return eventData.returnValue;
            }
          }
          return false;
        },
        getCommand : function(name) {
          return this.commands[name];
        },
        getData : function(dataAndEvents) {
          if (!dataAndEvents) {
            this.fire("beforeGetData");
          }
          var element = this._.data;
          if (typeof element != "string") {
            element = (element = this.element) && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? element.is("textarea") ? element.getValue() : element.getHtml() : "";
          }
          element = {
            dataValue : element
          };
          if (!dataAndEvents) {
            this.fire("getData", element);
          }
          return element.dataValue;
        },
        getSnapshot : function() {
          var data = this.fire("getSnapshot");
          if (typeof data != "string") {
            var element = this.element;
            if (element) {
              if (this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE) {
                data = element.is("textarea") ? element.getValue() : element.getHtml();
              }
            }
          }
          return data;
        },
        loadSnapshot : function(snapshot) {
          this.fire("loadSnapshot", snapshot);
        },
        setData : function(data, recurring, dataAndEvents) {
          if (!dataAndEvents) {
            this.fire("saveSnapshot");
          }
          if (recurring || !dataAndEvents) {
            this.once("dataReady", function(dojox) {
              if (!dataAndEvents) {
                this.fire("saveSnapshot");
              }
              if (recurring) {
                recurring.call(dojox.editor);
              }
            });
          }
          data = {
            dataValue : data
          };
          if (!dataAndEvents) {
            this.fire("setData", data);
          }
          this._.data = data.dataValue;
          if (!dataAndEvents) {
            this.fire("afterSetData", data);
          }
        },
        setReadOnly : function(isReadOnly) {
          isReadOnly = isReadOnly == void 0 || isReadOnly;
          if (this.readOnly != isReadOnly) {
            this.readOnly = isReadOnly;
            this.keystrokeHandler.blockedKeystrokes[8] = +isReadOnly;
            this.editable().setReadOnly(isReadOnly);
            this.fire("readOnly");
          }
        },
        insertHtml : function(data, mode) {
          this.fire("insertHtml", {
            dataValue : data,
            mode : mode
          });
        },
        insertText : function(text) {
          this.fire("insertText", text);
        },
        insertElement : function(element) {
          this.fire("insertElement", element);
        },
        focus : function() {
          this.fire("beforeFocus");
        },
        checkDirty : function() {
          return this.status == "ready" && this._.previousValue !== this.getSnapshot();
        },
        resetDirty : function() {
          this._.previousValue = this.getSnapshot();
        },
        updateElement : function() {
          return updateEditorElement.call(this);
        },
        setKeystroke : function() {
          var keystrokes = this.keystrokeHandler.keystrokes;
          var tokenized = CKEDITOR.tools.isArray(arguments[0]) ? arguments[0] : [[].slice.call(arguments, 0)];
          var keystroke;
          var behavior;
          var index = tokenized.length;
          for (;index--;) {
            keystroke = tokenized[index];
            behavior = 0;
            if (CKEDITOR.tools.isArray(keystroke)) {
              behavior = keystroke[1];
              keystroke = keystroke[0];
            }
            if (behavior) {
              keystrokes[keystroke] = behavior;
            } else {
              delete keystrokes[keystroke];
            }
          }
        },
        addFeature : function(feature) {
          return this.filter.addFeature(feature);
        },
        setActiveFilter : function(filter) {
          if (!filter) {
            filter = this.filter;
          }
          if (this.activeFilter !== filter) {
            this.activeFilter = filter;
            this.fire("activeFilterChange");
            if (filter === this.filter) {
              this.setActiveEnterMode(null, null);
            } else {
              this.setActiveEnterMode(filter.getAllowedEnterMode(this.enterMode), filter.getAllowedEnterMode(this.shiftEnterMode, true));
            }
          }
        },
        setActiveEnterMode : function(enterMode, shiftEnterMode) {
          enterMode = enterMode ? this.blockless ? CKEDITOR.ENTER_BR : enterMode : this.enterMode;
          shiftEnterMode = shiftEnterMode ? this.blockless ? CKEDITOR.ENTER_BR : shiftEnterMode : this.shiftEnterMode;
          if (this.activeEnterMode != enterMode || this.activeShiftEnterMode != shiftEnterMode) {
            this.activeEnterMode = enterMode;
            this.activeShiftEnterMode = shiftEnterMode;
            this.fire("activeEnterModeChange");
          }
        }
      });
    })();
    CKEDITOR.ELEMENT_MODE_NONE = 0;
    CKEDITOR.ELEMENT_MODE_REPLACE = 1;
    CKEDITOR.ELEMENT_MODE_APPENDTO = 2;
    CKEDITOR.ELEMENT_MODE_INLINE = 3;
    CKEDITOR.htmlParser = function() {
      this._ = {
        htmlPartsRegex : RegExp("<(?:(?:\\/([^>]+)>)|(?:!--([\\S|\\s]*?)--\x3e)|(?:([^\\s>]+)\\s*((?:(?:\"[^\"]*\")|(?:'[^']*')|[^\"'>])*)\\/?>))", "g")
      };
    };
    (function() {
      var braces = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g;
      var booleanAttrs = {
        checked : 1,
        compact : 1,
        declare : 1,
        defer : 1,
        disabled : 1,
        ismap : 1,
        multiple : 1,
        nohref : 1,
        noresize : 1,
        noshade : 1,
        nowrap : 1,
        readonly : 1,
        selected : 1
      };
      CKEDITOR.htmlParser.prototype = {
        onTagOpen : function() {
        },
        onTagClose : function() {
        },
        onText : function() {
        },
        onCDATA : function() {
        },
        onComment : function() {
        },
        parse : function(url) {
          var x;
          var i;
          var p = 0;
          var b;
          for (;x = this._.htmlPartsRegex.exec(url);) {
            i = x.index;
            if (i > p) {
              p = url.substring(p, i);
              if (b) {
                b.push(p);
              } else {
                this.onText(p);
              }
            }
            p = this._.htmlPartsRegex.lastIndex;
            if (i = x[1]) {
              i = i.toLowerCase();
              if (b && CKEDITOR.dtd.$cdata[i]) {
                this.onCDATA(b.join(""));
                b = null;
              }
              if (!b) {
                this.onTagClose(i);
                continue;
              }
            }
            if (b) {
              b.push(x[0]);
            } else {
              if (i = x[3]) {
                i = i.toLowerCase();
                if (!/="/.test(i)) {
                  var obj = {};
                  var text;
                  x = x[4];
                  var rvar = !!(x && x.charAt(x.length - 1) == "/");
                  if (x) {
                    for (;text = braces.exec(x);) {
                      var val = text[1].toLowerCase();
                      text = text[2] || (text[3] || (text[4] || ""));
                      obj[val] = !text && booleanAttrs[val] ? val : CKEDITOR.tools.htmlDecodeAttr(text);
                    }
                  }
                  this.onTagOpen(i, obj, rvar);
                  if (!b) {
                    if (CKEDITOR.dtd.$cdata[i]) {
                      b = [];
                    }
                  }
                }
              } else {
                if (i = x[2]) {
                  this.onComment(i);
                }
              }
            }
          }
          if (url.length > p) {
            this.onText(url.substring(p, url.length));
          }
        }
      };
    })();
    CKEDITOR.htmlParser.basicWriter = CKEDITOR.tools.createClass({
      $ : function() {
        this._ = {
          output : []
        };
      },
      proto : {
        openTag : function(attributes) {
          this._.output.push("<", attributes);
        },
        openTagClose : function(keepData, isSelfClose) {
          if (isSelfClose) {
            this._.output.push(" />");
          } else {
            this._.output.push(">");
          }
        },
        attribute : function(attName, attValue) {
          if (typeof attValue == "string") {
            attValue = CKEDITOR.tools.htmlEncodeAttr(attValue);
          }
          this._.output.push(" ", attName, '="', attValue, '"');
        },
        closeTag : function(tagName) {
          this._.output.push("</", tagName, ">");
        },
        text : function(name) {
          this._.output.push(name);
        },
        comment : function(comment) {
          this._.output.push("\x3c!--", comment, "--\x3e");
        },
        write : function(chunk) {
          this._.output.push(chunk);
        },
        reset : function() {
          this._.output = [];
          this._.indent = false;
        },
        getHtml : function(dataAndEvents) {
          var html = this._.output.join("");
          if (dataAndEvents) {
            this.reset();
          }
          return html;
        }
      }
    });
    "use strict";
    (function() {
      CKEDITOR.htmlParser.node = function() {
      };
      CKEDITOR.htmlParser.node.prototype = {
        remove : function() {
          var children = this.parent.children;
          var index = CKEDITOR.tools.indexOf(children, this);
          var previous = this.previous;
          var next = this.next;
          if (previous) {
            previous.next = next;
          }
          if (next) {
            next.previous = previous;
          }
          children.splice(index, 1);
          this.parent = null;
        },
        replaceWith : function(node) {
          var children = this.parent.children;
          var index = CKEDITOR.tools.indexOf(children, this);
          var previous = node.previous = this.previous;
          var next = node.next = this.next;
          if (previous) {
            previous.next = node;
          }
          if (next) {
            next.previous = node;
          }
          children[index] = node;
          node.parent = this.parent;
          this.parent = null;
        },
        insertAfter : function(node) {
          var children = node.parent.children;
          var index = CKEDITOR.tools.indexOf(children, node);
          var next = node.next;
          children.splice(index + 1, 0, this);
          this.next = node.next;
          this.previous = node;
          node.next = this;
          if (next) {
            next.previous = this;
          }
          this.parent = node.parent;
        },
        insertBefore : function(node) {
          var children = node.parent.children;
          var index = CKEDITOR.tools.indexOf(children, node);
          children.splice(index, 0, this);
          this.next = node;
          if (this.previous = node.previous) {
            node.previous.next = this;
          }
          node.previous = this;
          this.parent = node.parent;
        },
        getAscendant : function(name) {
          var promote = typeof name == "function" ? name : typeof name == "string" ? function(e) {
            return e.name == name;
          } : function(prop) {
            return prop.name in name;
          };
          var parent = this.parent;
          for (;parent && parent.type == CKEDITOR.NODE_ELEMENT;) {
            if (promote(parent)) {
              return parent;
            }
            parent = parent.parent;
          }
          return null;
        },
        wrapWith : function(wrapper) {
          this.replaceWith(wrapper);
          wrapper.add(this);
          return wrapper;
        },
        getIndex : function() {
          return CKEDITOR.tools.indexOf(this.parent.children, this);
        },
        getFilterContext : function(keepData) {
          return keepData || {};
        }
      };
    })();
    "use strict";
    CKEDITOR.htmlParser.comment = function(val) {
      this.value = val;
      this._ = {
        isBlockLike : false
      };
    };
    CKEDITOR.htmlParser.comment.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
      type : CKEDITOR.NODE_COMMENT,
      filter : function(name, keepData) {
        var comment = this.value;
        if (!(comment = name.onComment(keepData, comment, this))) {
          this.remove();
          return false;
        }
        if (typeof comment != "string") {
          this.replaceWith(comment);
          return false;
        }
        this.value = comment;
        return true;
      },
      writeHtml : function(writer, optgroup) {
        if (optgroup) {
          this.filter(optgroup);
        }
        writer.comment(this.value);
      }
    });
    "use strict";
    (function() {
      CKEDITOR.htmlParser.text = function(name) {
        this.value = name;
        this._ = {
          isBlockLike : false
        };
      };
      CKEDITOR.htmlParser.text.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
        type : CKEDITOR.NODE_TEXT,
        filter : function(name, keepData) {
          if (!(this.value = name.onText(keepData, this.value, this))) {
            this.remove();
            return false;
          }
        },
        writeHtml : function(writer, optgroup) {
          if (optgroup) {
            this.filter(optgroup);
          }
          writer.text(this.value);
        }
      });
    })();
    "use strict";
    (function() {
      CKEDITOR.htmlParser.cdata = function(value) {
        this.value = value;
      };
      CKEDITOR.htmlParser.cdata.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
        type : CKEDITOR.NODE_TEXT,
        filter : function() {
        },
        writeHtml : function(writer) {
          writer.write(this.value);
        }
      });
    })();
    "use strict";
    CKEDITOR.htmlParser.fragment = function() {
      this.children = [];
      this.parent = null;
      this._ = {
        isBlockLike : true,
        hasInlineStarted : false
      };
    };
    (function() {
      function isRemoveEmpty(node) {
        return node.attributes["data-cke-survive"] ? false : node.name == "a" && node.attributes.href || CKEDITOR.dtd.$removeEmpty[node.name];
      }
      var fn = CKEDITOR.tools.extend({
        table : 1,
        ul : 1,
        ol : 1,
        dl : 1
      }, CKEDITOR.dtd.table, CKEDITOR.dtd.ul, CKEDITOR.dtd.ol, CKEDITOR.dtd.dl);
      var listBlocks = {
        ol : 1,
        ul : 1
      };
      var event = CKEDITOR.tools.extend({}, {
        html : 1
      }, CKEDITOR.dtd.html, CKEDITOR.dtd.body, CKEDITOR.dtd.head, {
        style : 1,
        script : 1
      });
      var list = {
        ul : "li",
        ol : "li",
        dl : "dd",
        table : "tbody",
        tbody : "tr",
        thead : "tr",
        tfoot : "tr",
        tr : "td"
      };
      CKEDITOR.htmlParser.fragment.fromHtml = function(data, parent, fixingBlock) {
        function checkPending(newTagName) {
          var b;
          if (pendingInline.length > 0) {
            var i = 0;
            for (;i < pendingInline.length;i++) {
              var pendingElement = pendingInline[i];
              var pendingName = pendingElement.name;
              var pendingDtd = CKEDITOR.dtd[pendingName];
              var currentDtd = currentNode.name && CKEDITOR.dtd[currentNode.name];
              if ((!currentDtd || currentDtd[pendingName]) && (!newTagName || (!pendingDtd || (pendingDtd[newTagName] || !CKEDITOR.dtd[newTagName])))) {
                if (!b) {
                  sendPendingBRs();
                  b = 1;
                }
                pendingElement = pendingElement.clone();
                pendingElement.parent = currentNode;
                currentNode = pendingElement;
                pendingInline.splice(i, 1);
                i--;
              } else {
                if (pendingName == currentNode.name) {
                  addElement(currentNode, currentNode.parent, 1);
                  i--;
                }
              }
            }
          }
        }
        function sendPendingBRs() {
          for (;movedNodes.length;) {
            addElement(movedNodes.shift(), currentNode);
          }
        }
        function removeTailWhitespace(element) {
          if (element._.isBlockLike && (element.name != "pre" && element.name != "textarea")) {
            var length = element.children.length;
            var lastChild = element.children[length - 1];
            var text;
            if (lastChild && lastChild.type == CKEDITOR.NODE_TEXT) {
              if (text = CKEDITOR.tools.rtrim(lastChild.value)) {
                lastChild.value = text;
              } else {
                element.children.length = length - 1;
              }
            }
          }
        }
        function addElement(node, target, moveCurrent) {
          target = target || (currentNode || root);
          var savedCurrent = currentNode;
          if (node.previous === void 0) {
            if (checkAutoParagraphing(target, node)) {
              currentNode = target;
              parser.onTagOpen(fixingBlock, {});
              node.returnPoint = target = currentNode;
            }
            removeTailWhitespace(node);
            if (!isRemoveEmpty(node) || node.children.length) {
              target.add(node);
            }
            if (node.name == "pre") {
              inPre = false;
            }
            if (node.name == "textarea") {
              inTextarea = false;
            }
          }
          if (node.returnPoint) {
            currentNode = node.returnPoint;
            delete node.returnPoint;
          } else {
            currentNode = moveCurrent ? target : savedCurrent;
          }
        }
        function checkAutoParagraphing(parent, node) {
          if ((parent == root || parent.name == "body") && (fixingBlock && (!parent.name || CKEDITOR.dtd[parent.name][fixingBlock]))) {
            var name;
            var realName;
            return(name = node.attributes && (realName = node.attributes["data-cke-real-element-type"]) ? realName : node.name) && (name in CKEDITOR.dtd.$inline && (!(name in CKEDITOR.dtd.head) && !node.isOrphan)) || node.type == CKEDITOR.NODE_TEXT;
          }
        }
        function possiblySibling(tag1, tag2) {
          return tag1 in CKEDITOR.dtd.$listItem || tag1 in CKEDITOR.dtd.$tableContent ? tag1 == tag2 || (tag1 == "dt" && tag2 == "dd" || tag1 == "dd" && tag2 == "dt") : false;
        }
        var parser = new CKEDITOR.htmlParser;
        var root = parent instanceof CKEDITOR.htmlParser.element ? parent : typeof parent == "string" ? new CKEDITOR.htmlParser.element(parent) : new CKEDITOR.htmlParser.fragment;
        var pendingInline = [];
        var movedNodes = [];
        var currentNode = root;
        var inTextarea = root.name == "textarea";
        var inPre = root.name == "pre";
        parser.onTagOpen = function(tagName, element, name, optionalClose) {
          element = new CKEDITOR.htmlParser.element(tagName, element);
          if (element.isUnknown && name) {
            element.isEmpty = true;
          }
          element.isOptionalClose = optionalClose;
          if (isRemoveEmpty(element)) {
            pendingInline.push(element);
          } else {
            if (tagName == "pre") {
              inPre = true;
            } else {
              if (tagName == "br" && inPre) {
                currentNode.add(new CKEDITOR.htmlParser.text("\n"));
                return;
              }
              if (tagName == "textarea") {
                inTextarea = true;
              }
            }
            if (tagName == "br") {
              movedNodes.push(element);
            } else {
              for (;;) {
                optionalClose = (name = currentNode.name) ? CKEDITOR.dtd[name] || (currentNode._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : event;
                if (!element.isUnknown && (!currentNode.isUnknown && !optionalClose[tagName])) {
                  if (currentNode.isOptionalClose) {
                    parser.onTagClose(name);
                  } else {
                    if (tagName in listBlocks && name in listBlocks) {
                      name = currentNode.children;
                      if (!((name = name[name.length - 1]) && name.name == "li")) {
                        addElement(name = new CKEDITOR.htmlParser.element("li"), currentNode);
                      }
                      if (!element.returnPoint) {
                        element.returnPoint = currentNode;
                      }
                      currentNode = name;
                    } else {
                      if (tagName in CKEDITOR.dtd.$listItem && !possiblySibling(tagName, name)) {
                        parser.onTagOpen(tagName == "li" ? "ul" : "dl", {}, 0, 1);
                      } else {
                        if (name in fn && !possiblySibling(tagName, name)) {
                          if (!element.returnPoint) {
                            element.returnPoint = currentNode;
                          }
                          currentNode = currentNode.parent;
                        } else {
                          if (name in CKEDITOR.dtd.$inline) {
                            pendingInline.unshift(currentNode);
                          }
                          if (currentNode.parent) {
                            addElement(currentNode, currentNode.parent, 1);
                          } else {
                            element.isOrphan = 1;
                            break;
                          }
                        }
                      }
                    }
                  }
                } else {
                  break;
                }
              }
              checkPending(tagName);
              sendPendingBRs();
              element.parent = currentNode;
              if (element.isEmpty) {
                addElement(element);
              } else {
                currentNode = element;
              }
            }
          }
        };
        parser.onTagClose = function(tagName) {
          var i = pendingInline.length - 1;
          for (;i >= 0;i--) {
            if (tagName == pendingInline[i].name) {
              pendingInline.splice(i, 1);
              return;
            }
          }
          var pendingAdd = [];
          var newPendingInline = [];
          var candidate = currentNode;
          for (;candidate != root && candidate.name != tagName;) {
            if (!candidate._.isBlockLike) {
              newPendingInline.unshift(candidate);
            }
            pendingAdd.push(candidate);
            candidate = candidate.returnPoint || candidate.parent;
          }
          if (candidate != root) {
            i = 0;
            for (;i < pendingAdd.length;i++) {
              var node = pendingAdd[i];
              addElement(node, node.parent);
            }
            currentNode = candidate;
            if (candidate._.isBlockLike) {
              sendPendingBRs();
            }
            addElement(candidate, candidate.parent);
            if (candidate == currentNode) {
              currentNode = currentNode.parent;
            }
            pendingInline = pendingInline.concat(newPendingInline);
          }
          if (tagName == "body") {
            fixingBlock = false;
          }
        };
        parser.onText = function(text) {
          if ((!currentNode._.hasInlineStarted || movedNodes.length) && (!inPre && !inTextarea)) {
            text = CKEDITOR.tools.ltrim(text);
            if (text.length === 0) {
              return;
            }
          }
          var name = currentNode.name;
          var data = name ? CKEDITOR.dtd[name] || (currentNode._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : event;
          if (!inTextarea && (!data["#"] && name in fn)) {
            parser.onTagOpen(list[name] || "");
            parser.onText(text);
          } else {
            sendPendingBRs();
            checkPending();
            if (!inPre) {
              if (!inTextarea) {
                text = text.replace(/[\t\r\n ]{2,}|[\t\r\n]/g, " ");
              }
            }
            text = new CKEDITOR.htmlParser.text(text);
            if (checkAutoParagraphing(currentNode, text)) {
              this.onTagOpen(fixingBlock, {}, 0, 1);
            }
            currentNode.add(text);
          }
        };
        parser.onCDATA = function(cdata) {
          currentNode.add(new CKEDITOR.htmlParser.cdata(cdata));
        };
        parser.onComment = function(comment) {
          sendPendingBRs();
          checkPending();
          currentNode.add(new CKEDITOR.htmlParser.comment(comment));
        };
        parser.parse(data);
        sendPendingBRs();
        for (;currentNode != root;) {
          addElement(currentNode, currentNode.parent, 1);
        }
        removeTailWhitespace(root);
        return root;
      };
      CKEDITOR.htmlParser.fragment.prototype = {
        type : CKEDITOR.NODE_DOCUMENT_FRAGMENT,
        add : function(name, expectedNumberOfNonCommentArgs) {
          if (isNaN(expectedNumberOfNonCommentArgs)) {
            expectedNumberOfNonCommentArgs = this.children.length;
          }
          var current = expectedNumberOfNonCommentArgs > 0 ? this.children[expectedNumberOfNonCommentArgs - 1] : null;
          if (current) {
            if (name._.isBlockLike && current.type == CKEDITOR.NODE_TEXT) {
              current.value = CKEDITOR.tools.rtrim(current.value);
              if (current.value.length === 0) {
                this.children.pop();
                this.add(name);
                return;
              }
            }
            current.next = name;
          }
          name.previous = current;
          name.parent = this;
          this.children.splice(expectedNumberOfNonCommentArgs, 0, name);
          if (!this._.hasInlineStarted) {
            this._.hasInlineStarted = name.type == CKEDITOR.NODE_TEXT || name.type == CKEDITOR.NODE_ELEMENT && !name._.isBlockLike;
          }
        },
        filter : function(name, keepData) {
          keepData = this.getFilterContext(keepData);
          name.onRoot(keepData, this);
          this.filterChildren(name, false, keepData);
        },
        filterChildren : function(optgroup, i, key) {
          if (this.childrenFilteredBy != optgroup.id) {
            key = this.getFilterContext(key);
            if (i && !this.parent) {
              optgroup.onRoot(key, this);
            }
            this.childrenFilteredBy = optgroup.id;
            i = 0;
            for (;i < this.children.length;i++) {
              if (this.children[i].filter(optgroup, key) === false) {
                i--;
              }
            }
          }
        },
        writeHtml : function(writer, optgroup) {
          if (optgroup) {
            this.filter(optgroup);
          }
          this.writeChildrenHtml(writer);
        },
        writeChildrenHtml : function(writer, filter, result) {
          var context = this.getFilterContext();
          if (result && (!this.parent && filter)) {
            filter.onRoot(context, this);
          }
          if (filter) {
            this.filterChildren(filter, false, context);
          }
          filter = 0;
          result = this.children;
          context = result.length;
          for (;filter < context;filter++) {
            result[filter].writeHtml(writer);
          }
        },
        forEach : function(fn, type, children) {
          if (!children && (!type || this.type == type)) {
            var child = fn(this)
          }
          if (child !== false) {
            children = this.children;
            var i = 0;
            for (;i < children.length;i++) {
              child = children[i];
              if (child.type == CKEDITOR.NODE_ELEMENT) {
                child.forEach(fn, type);
              } else {
                if (!type || child.type == type) {
                  fn(child);
                }
              }
            }
          }
        },
        getFilterContext : function(keepData) {
          return keepData || {};
        }
      };
    })();
    "use strict";
    (function() {
      function filterRulesGroup() {
        this.rules = [];
      }
      function addNamedRules(rulesGroups, newRules, expectedNumberOfNonCommentArgs, options) {
        var ruleName;
        var rulesGroup;
        for (ruleName in newRules) {
          if (!(rulesGroup = rulesGroups[ruleName])) {
            rulesGroup = rulesGroups[ruleName] = new filterRulesGroup;
          }
          rulesGroup.add(newRules[ruleName], expectedNumberOfNonCommentArgs, options);
        }
      }
      CKEDITOR.htmlParser.filter = CKEDITOR.tools.createClass({
        $ : function(name) {
          this.id = CKEDITOR.tools.getNextNumber();
          this.elementNameRules = new filterRulesGroup;
          this.attributeNameRules = new filterRulesGroup;
          this.elementsRules = {};
          this.attributesRules = {};
          this.textRules = new filterRulesGroup;
          this.commentRules = new filterRulesGroup;
          this.rootRules = new filterRulesGroup;
          if (name) {
            this.addRules(name, 10);
          }
        },
        proto : {
          addRules : function(rules, options) {
            var expectedNumberOfNonCommentArgs;
            if (typeof options == "number") {
              expectedNumberOfNonCommentArgs = options;
            } else {
              if (options && "priority" in options) {
                expectedNumberOfNonCommentArgs = options.priority;
              }
            }
            if (typeof expectedNumberOfNonCommentArgs != "number") {
              expectedNumberOfNonCommentArgs = 10;
            }
            if (typeof options != "object") {
              options = {};
            }
            if (rules.elementNames) {
              this.elementNameRules.addMany(rules.elementNames, expectedNumberOfNonCommentArgs, options);
            }
            if (rules.attributeNames) {
              this.attributeNameRules.addMany(rules.attributeNames, expectedNumberOfNonCommentArgs, options);
            }
            if (rules.elements) {
              addNamedRules(this.elementsRules, rules.elements, expectedNumberOfNonCommentArgs, options);
            }
            if (rules.attributes) {
              addNamedRules(this.attributesRules, rules.attributes, expectedNumberOfNonCommentArgs, options);
            }
            if (rules.text) {
              this.textRules.add(rules.text, expectedNumberOfNonCommentArgs, options);
            }
            if (rules.comment) {
              this.commentRules.add(rules.comment, expectedNumberOfNonCommentArgs, options);
            }
            if (rules.root) {
              this.rootRules.add(rules.root, expectedNumberOfNonCommentArgs, options);
            }
          },
          applyTo : function(contextElem) {
            contextElem.filter(this);
          },
          onElementName : function(context, name) {
            return this.elementNameRules.execOnName(context, name);
          },
          onAttributeName : function(context, name) {
            return this.attributeNameRules.execOnName(context, name);
          },
          onText : function(x, text, label) {
            return this.textRules.exec(x, text, label);
          },
          onComment : function(x, commentText, comment) {
            return this.commentRules.exec(x, commentText, comment);
          },
          onRoot : function(x, element) {
            return this.rootRules.exec(x, element);
          },
          onElement : function(x, element) {
            var regionMap = [this.elementsRules["^"], this.elementsRules[element.name], this.elementsRules.$];
            var ret;
            var reg = 0;
            for (;reg < 3;reg++) {
              if (ret = regionMap[reg]) {
                ret = ret.exec(x, element, this);
                if (ret === false) {
                  return null;
                }
                if (ret && ret != element) {
                  return this.onNode(x, ret);
                }
                if (element.parent && !element.name) {
                  break;
                }
              }
            }
            return element;
          },
          onNode : function(context, node) {
            var type = node.type;
            return type == CKEDITOR.NODE_ELEMENT ? this.onElement(context, node) : type == CKEDITOR.NODE_TEXT ? new CKEDITOR.htmlParser.text(this.onText(context, node.value)) : type == CKEDITOR.NODE_COMMENT ? new CKEDITOR.htmlParser.comment(this.onComment(context, node.value)) : null;
          },
          onAttribute : function(x, element, name, value) {
            return(name = this.attributesRules[name]) ? name.exec(x, value, element, this) : value;
          }
        }
      });
      CKEDITOR.htmlParser.filterRulesGroup = filterRulesGroup;
      filterRulesGroup.prototype = {
        add : function(name, expectedNumberOfNonCommentArgs, args) {
          this.rules.splice(this.findIndex(expectedNumberOfNonCommentArgs), 0, {
            value : name,
            priority : expectedNumberOfNonCommentArgs,
            options : args
          });
        },
        addMany : function(values, priority, options) {
          var key = [this.findIndex(priority), 0];
          var i = 0;
          var valuesLen = values.length;
          for (;i < valuesLen;i++) {
            key.push({
              value : values[i],
              priority : priority,
              options : options
            });
          }
          this.rules.splice.apply(this.rules, key);
        },
        findIndex : function(priority) {
          var rules = this.rules;
          var i = rules.length - 1;
          for (;i >= 0 && priority < rules[i].priority;) {
            i--;
          }
          return i + 1;
        },
        exec : function(editor, currentValue) {
          var isDomLoaded = currentValue instanceof CKEDITOR.htmlParser.node || currentValue instanceof CKEDITOR.htmlParser.fragment;
          var key = Array.prototype.slice.call(arguments, 1);
          var unmatched = this.rules;
          var len = unmatched.length;
          var orgType;
          var orgName;
          var elem;
          var i;
          i = 0;
          for (;i < len;i++) {
            if (isDomLoaded) {
              orgType = currentValue.type;
              orgName = currentValue.name;
            }
            elem = unmatched[i];
            if (!(editor.nonEditable && !elem.options.applyToAll || editor.nestedEditable && elem.options.excludeNestedEditable)) {
              elem = elem.value.apply(null, key);
              if (elem === false || isDomLoaded && (elem && (elem.name != orgName || elem.type != orgType))) {
                return elem;
              }
              if (elem != void 0) {
                key[0] = currentValue = elem;
              }
            }
          }
          return currentValue;
        },
        execOnName : function(context, currentName) {
          var i = 0;
          var rules = this.rules;
          var len = rules.length;
          var rule;
          for (;currentName && i < len;i++) {
            rule = rules[i];
            if (!(context.nonEditable && !rule.options.applyToAll || context.nestedEditable && rule.options.excludeNestedEditable)) {
              currentName = currentName.replace(rule.value[0], rule.value[1]);
            }
          }
          return currentName;
        }
      };
    })();
    (function() {
      function createBogusAndFillerRules(editor, type) {
        function createFiller(isOutput) {
          return isOutput || CKEDITOR.env.needsNbspFiller ? new CKEDITOR.htmlParser.text(" ") : new CKEDITOR.htmlParser.element("br", {
            "data-cke-bogus" : 1
          });
        }
        function blockFilter(timestep, fillEmptyBlock) {
          return function(block) {
            if (block.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
              var data = [];
              var last = getLast(block);
              var node;
              var previous;
              if (last) {
                if (maybeBogus(last, 1)) {
                  data.push(last);
                }
                for (;last;) {
                  if (isBlockBoundary(last) && ((node = getPrevious(last)) && maybeBogus(node))) {
                    if ((previous = getPrevious(node)) && !isBlockBoundary(previous)) {
                      data.push(node);
                    } else {
                      createFiller(isOutput).insertAfter(node);
                      node.remove();
                    }
                  }
                  last = last.previous;
                }
              }
              last = 0;
              for (;last < data.length;last++) {
                data[last].remove();
              }
              if (data = typeof fillEmptyBlock == "function" ? fillEmptyBlock(block) !== false : fillEmptyBlock) {
                if (!isOutput && (!CKEDITOR.env.needsBrFiller && block.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)) {
                  data = false;
                } else {
                  if (!isOutput && (!CKEDITOR.env.needsBrFiller && (document.documentMode > 7 || (block.name in CKEDITOR.dtd.tr || block.name in CKEDITOR.dtd.$listItem)))) {
                    data = false;
                  } else {
                    data = getLast(block);
                    data = !data || block.name == "form" && data.name == "input";
                  }
                }
              }
              if (data) {
                block.add(createFiller(timestep));
              }
            }
          };
        }
        function maybeBogus(node, atBlockEnd) {
          if ((!isOutput || CKEDITOR.env.needsBrFiller) && (node.type == CKEDITOR.NODE_ELEMENT && (node.name == "br" && !node.attributes["data-cke-eol"]))) {
            return true;
          }
          var previous;
          if (node.type == CKEDITOR.NODE_TEXT && (previous = node.value.match(optgroup))) {
            if (previous.index) {
              (new CKEDITOR.htmlParser.text(node.value.substring(0, previous.index))).insertBefore(node);
              node.value = previous[0];
            }
            if (!CKEDITOR.env.needsBrFiller && (isOutput && (!atBlockEnd || node.parent.name in textBlockTags))) {
              return true;
            }
            if (!isOutput) {
              if ((previous = node.previous) && previous.name == "br" || (!previous || isBlockBoundary(previous))) {
                return true;
              }
            }
          }
          return false;
        }
        var rules = {
          elements : {}
        };
        var isOutput = type == "html";
        var textBlockTags = CKEDITOR.tools.extend({}, blockLikeTags);
        var i;
        for (i in textBlockTags) {
          if (!("#" in dtd[i])) {
            delete textBlockTags[i];
          }
        }
        for (i in textBlockTags) {
          rules.elements[i] = blockFilter(isOutput, editor.config.fillEmptyBlocks !== false);
        }
        rules.root = blockFilter(isOutput);
        rules.elements.br = function(isOutput) {
          return function(element) {
            if (element.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
              var next = element.attributes;
              if ("data-cke-bogus" in next || "data-cke-eol" in next) {
                delete next["data-cke-bogus"];
              } else {
                next = element.next;
                for (;next && isEmpty(next);) {
                  next = next.next;
                }
                var previous = getPrevious(element);
                if (!next && isBlockBoundary(element.parent)) {
                  append(element.parent, createFiller(isOutput));
                } else {
                  if (isBlockBoundary(next)) {
                    if (previous && !isBlockBoundary(previous)) {
                      createFiller(isOutput).insertBefore(next);
                    }
                  }
                }
              }
            }
          };
        }(isOutput);
        return rules;
      }
      function getFixBodyTag(enterMode, autoParagraph) {
        return enterMode != CKEDITOR.ENTER_BR && autoParagraph !== false ? enterMode == CKEDITOR.ENTER_DIV ? "div" : "p" : false;
      }
      function getLast(node) {
        node = node.children[node.children.length - 1];
        for (;node && isEmpty(node);) {
          node = node.previous;
        }
        return node;
      }
      function getPrevious(node) {
        node = node.previous;
        for (;node && isEmpty(node);) {
          node = node.previous;
        }
        return node;
      }
      function isEmpty(node) {
        return node.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(node.value) || node.type == CKEDITOR.NODE_ELEMENT && node.attributes["data-cke-bookmark"];
      }
      function isBlockBoundary(node) {
        return node && (node.type == CKEDITOR.NODE_ELEMENT && node.name in blockLikeTags || node.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT);
      }
      function append(group, node) {
        var previous = group.children[group.children.length - 1];
        group.children.push(node);
        node.parent = group;
        if (previous) {
          previous.next = node;
          node.previous = previous;
        }
      }
      function protectReadOnly(name) {
        name = name.attributes;
        if (name.contenteditable != "false") {
          name["data-cke-editable"] = name.contenteditable ? "true" : 1;
        }
        name.contenteditable = "false";
      }
      function unprotectReadyOnly(name) {
        name = name.attributes;
        switch(name["data-cke-editable"]) {
          case "true":
            name.contenteditable = "true";
            break;
          case "1":
            delete name.contenteditable;
        }
      }
      function protectAttributes(html) {
        return html.replace(rreturn, function(deepDataAndEvents, dataAndEvents, headers) {
          return "<" + dataAndEvents + headers.replace(r20, function(oid, value) {
            return rchecked.test(value) && headers.indexOf("data-cke-saved-" + value) == -1 ? " data-cke-saved-" + oid + " data-cke-" + CKEDITOR.rnd + "-" + oid : oid;
          }) + ">";
        });
      }
      function protectElements(html, regex) {
        return html.replace(regex, function(key, dataAndEvents, data) {
          if (key.indexOf("<textarea") === 0) {
            key = dataAndEvents + unprotectRealComments(data).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</textarea>";
          }
          return "<cke:encoded>" + encodeURIComponent(key) + "</cke:encoded>";
        });
      }
      function unprotectElements(html) {
        return html.replace(rclass, function(dataAndEvents, part) {
          return decodeURIComponent(part);
        });
      }
      function protectRealComments(fmt) {
        return fmt.replace(/<\!--(?!{cke_protected})[\s\S]+?--\>/g, function(sKey) {
          return "\x3c!--" + op + "{C}" + encodeURIComponent(sKey).replace(/--/g, "%2D%2D") + "--\x3e";
        });
      }
      function unprotectRealComments(fmt) {
        return fmt.replace(/<\!--\{cke_protected\}\{C\}([\s\S]+?)--\>/g, function(dataAndEvents, part) {
          return decodeURIComponent(part);
        });
      }
      function unprotectSource(fmt, editor) {
        var store = editor._.dataStore;
        return fmt.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g, function(dataAndEvents, part) {
          return decodeURIComponent(part);
        }).replace(/\{cke_protected_(\d+)\}/g, function(dataAndEvents, id) {
          return store && store[id] || "";
        });
      }
      function protectSource(text, editor) {
        var params = [];
        var links = editor.config.protectedSource;
        var store = editor._.dataStore || (editor._.dataStore = {
          id : 1
        });
        var cx = /<\!--\{cke_temp(comment)?\}(\d*?)--\>/g;
        links = [/<script[\s\S]*?<\/script>/gi, /<noscript[\s\S]*?<\/noscript>/gi].concat(links);
        text = text.replace(/<\!--[\s\S]*?--\>/g, function(param) {
          return "\x3c!--{cke_tempcomment}" + (params.push(param) - 1) + "--\x3e";
        });
        var i = 0;
        for (;i < links.length;i++) {
          text = text.replace(links[i], function(text) {
            text = text.replace(cx, function(dataAndEvents, deepDataAndEvents, urlParam) {
              return params[urlParam];
            });
            return/cke_temp(comment)?/.test(text) ? text : "\x3c!--{cke_temp}" + (params.push(text) - 1) + "--\x3e";
          });
        }
        text = text.replace(cx, function(dataAndEvents, state, parameter) {
          return "\x3c!--" + op + (state ? "{C}" : "") + encodeURIComponent(params[parameter]).replace(/--/g, "%2D%2D") + "--\x3e";
        });
        text = text.replace(/<\w+(?:\s+(?:(?:[^\s=>]+\s*=\s*(?:[^'"\s>]+|'[^']*'|"[^"]*"))|[^\s=>]+))+\s*>/g, function(messageFormat) {
          return messageFormat.replace(/<\!--\{cke_protected\}([^>]*)--\>/g, function(dataAndEvents, data) {
            store[store.id] = decodeURIComponent(data);
            return "{cke_protected_" + store.id++ + "}";
          });
        });
        return text = text.replace(/<(title|iframe|textarea)([^>]*)>([\s\S]*?)<\/\1>/g, function(dataAndEvents, g, b, data) {
          return "<" + g + b + ">" + unprotectSource(unprotectRealComments(data), editor) + "</" + g + ">";
        });
      }
      CKEDITOR.htmlDataProcessor = function(editor) {
        var dataFilter;
        var htmlFilter;
        var that = this;
        this.editor = editor;
        this.dataFilter = dataFilter = new CKEDITOR.htmlParser.filter;
        this.htmlFilter = htmlFilter = new CKEDITOR.htmlParser.filter;
        this.writer = new CKEDITOR.htmlParser.basicWriter;
        dataFilter.addRules(rules);
        dataFilter.addRules(defaultDataFilterRulesForAll, {
          applyToAll : true
        });
        dataFilter.addRules(createBogusAndFillerRules(editor, "data"), {
          applyToAll : true
        });
        htmlFilter.addRules(htmlFilterRules);
        htmlFilter.addRules(defaultHtmlFilterRulesForAll, {
          applyToAll : true
        });
        htmlFilter.addRules(createBogusAndFillerRules(editor, "html"), {
          applyToAll : true
        });
        editor.on("toHtml", function(evtData) {
          evtData = evtData.data;
          var data = evtData.dataValue;
          data = protectSource(data, editor);
          data = protectElements(data, protectElementsRegex);
          data = protectAttributes(data);
          data = protectElements(data, protectTextareaRegex);
          data = data.replace(rxhtmlTag, "$1cke:$2");
          data = data.replace(bites, "<cke:$1$2></cke:$1>");
          data = data.replace(/(<pre\b[^>]*>)(\r\n|\n)/g, "$1$2$2");
          data = data.replace(/([^a-z0-9<\-])(on\w{3,})(?!>)/gi, "$1data-cke-" + CKEDITOR.rnd + "-$2");
          var el = evtData.context || editor.editable().getName();
          var f;
          if (CKEDITOR.env.ie && (CKEDITOR.env.version < 9 && el == "pre")) {
            el = "div";
            data = "<pre>" + data + "</pre>";
            f = 1;
          }
          el = editor.document.createElement(el);
          el.setHtml("a" + data);
          data = el.getHtml().substr(1);
          data = data.replace(RegExp("data-cke-" + CKEDITOR.rnd + "-", "ig"), "");
          if (f) {
            data = data.replace(/^<pre>|<\/pre>$/gi, "");
          }
          data = data.replace(regexp, "$1$2");
          data = unprotectElements(data);
          data = unprotectRealComments(data);
          evtData.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(data, evtData.context, evtData.fixForBody === false ? false : getFixBodyTag(evtData.enterMode, editor.config.autoParagraph));
        }, null, null, 5);
        editor.on("toHtml", function(evt) {
          if (evt.data.filter.applyTo(evt.data.dataValue, true, evt.data.dontFilter, evt.data.enterMode)) {
            editor.fire("dataFiltered");
          }
        }, null, null, 6);
        editor.on("toHtml", function(evt) {
          evt.data.dataValue.filterChildren(that.dataFilter, true);
        }, null, null, 10);
        editor.on("toHtml", function(item) {
          item = item.data;
          var data = item.dataValue;
          var writer = new CKEDITOR.htmlParser.basicWriter;
          data.writeChildrenHtml(writer);
          data = writer.getHtml(true);
          item.dataValue = protectRealComments(data);
        }, null, null, 15);
        editor.on("toDataFormat", function(evt) {
          var data = evt.data.dataValue;
          if (evt.data.enterMode != CKEDITOR.ENTER_BR) {
            data = data.replace(/^<br *\/?>/i, "");
          }
          evt.data.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(data, evt.data.context, getFixBodyTag(evt.data.enterMode, editor.config.autoParagraph));
        }, null, null, 5);
        editor.on("toDataFormat", function(evt) {
          evt.data.dataValue.filterChildren(that.htmlFilter, true);
        }, null, null, 10);
        editor.on("toDataFormat", function(evt) {
          evt.data.filter.applyTo(evt.data.dataValue, false, true);
        }, null, null, 11);
        editor.on("toDataFormat", function(evt) {
          var data = evt.data.dataValue;
          var writer = that.writer;
          writer.reset();
          data.writeChildrenHtml(writer);
          data = writer.getHtml(true);
          data = unprotectRealComments(data);
          data = unprotectSource(data, editor);
          evt.data.dataValue = data;
        }, null, null, 15);
      };
      CKEDITOR.htmlDataProcessor.prototype = {
        toHtml : function(data, options, fixForBody, dontFilter) {
          var editor = this.editor;
          var context;
          var filter;
          var enterMode;
          if (options && typeof options == "object") {
            context = options.context;
            fixForBody = options.fixForBody;
            dontFilter = options.dontFilter;
            filter = options.filter;
            enterMode = options.enterMode;
          } else {
            context = options;
          }
          if (!context) {
            if (context !== null) {
              context = editor.editable().getName();
            }
          }
          return editor.fire("toHtml", {
            dataValue : data,
            context : context,
            fixForBody : fixForBody,
            dontFilter : dontFilter,
            filter : filter || editor.filter,
            enterMode : enterMode || editor.enterMode
          }).dataValue;
        },
        toDataFormat : function(html, options) {
          var context;
          var filter;
          var enterMode;
          if (options) {
            context = options.context;
            filter = options.filter;
            enterMode = options.enterMode;
          }
          if (!context) {
            if (context !== null) {
              context = this.editor.editable().getName();
            }
          }
          return this.editor.fire("toDataFormat", {
            dataValue : html,
            filter : filter || this.editor.filter,
            context : context,
            enterMode : enterMode || this.editor.enterMode
          }).dataValue;
        }
      };
      var optgroup = /(?:&nbsp;|\xa0)$/;
      var op = "{cke_protected}";
      var dtd = CKEDITOR.dtd;
      var tableOrder = ["caption", "colgroup", "col", "thead", "tfoot", "tbody"];
      var blockLikeTags = CKEDITOR.tools.extend({}, dtd.$blockLimit, dtd.$block);
      var rules = {
        elements : {
          input : protectReadOnly,
          textarea : protectReadOnly
        }
      };
      var defaultDataFilterRulesForAll = {
        attributeNames : [[/^on/, "data-cke-pa-on"], [/^data-cke-expando$/, ""]]
      };
      var htmlFilterRules = {
        elements : {
          embed : function(name) {
            var parent = name.parent;
            if (parent && parent.name == "object") {
              var originalWidth = parent.attributes.width;
              parent = parent.attributes.height;
              if (originalWidth) {
                name.attributes.width = originalWidth;
              }
              if (parent) {
                name.attributes.height = parent;
              }
            }
          },
          a : function(element) {
            if (!element.children.length && (!element.attributes.name && !element.attributes["data-cke-saved-name"])) {
              return false;
            }
          }
        }
      };
      var defaultHtmlFilterRulesForAll = {
        elementNames : [[/^cke:/, ""], [/^\?xml:namespace$/, ""]],
        attributeNames : [[/^data-cke-(saved|pa)-/, ""], [/^data-cke-.*/, ""], ["hidefocus", ""]],
        elements : {
          $ : function(name) {
            var attribs = name.attributes;
            if (attribs) {
              if (attribs["data-cke-temp"]) {
                return false;
              }
              var attributeNames = ["name", "href", "src"];
              var savedAttributeName;
              var i = 0;
              for (;i < attributeNames.length;i++) {
                savedAttributeName = "data-cke-saved-" + attributeNames[i];
                if (savedAttributeName in attribs) {
                  delete attribs[attributeNames[i]];
                }
              }
            }
            return name;
          },
          table : function(block) {
            block.children.slice(0).sort(function(node1, node2) {
              var index1;
              var index2;
              if (node1.type == CKEDITOR.NODE_ELEMENT && node2.type == node1.type) {
                index1 = CKEDITOR.tools.indexOf(tableOrder, node1.name);
                index2 = CKEDITOR.tools.indexOf(tableOrder, node2.name);
              }
              if (!(index1 > -1 && (index2 > -1 && index1 != index2))) {
                index1 = node1.parent ? node1.getIndex() : -1;
                index2 = node2.parent ? node2.getIndex() : -1;
              }
              return index1 > index2 ? 1 : -1;
            });
          },
          param : function(name) {
            name.children = [];
            name.isEmpty = true;
            return name;
          },
          span : function(name) {
            if (name.attributes["class"] == "Apple-style-span") {
              delete name.name;
            }
          },
          html : function(name) {
            delete name.attributes.contenteditable;
            delete name.attributes["class"];
          },
          body : function(name) {
            delete name.attributes.spellcheck;
            delete name.attributes.contenteditable;
          },
          style : function(name) {
            var child = name.children[0];
            if (child && child.value) {
              child.value = CKEDITOR.tools.trim(child.value);
            }
            if (!name.attributes.type) {
              name.attributes.type = "text/css";
            }
          },
          title : function(name) {
            var titleText = name.children[0];
            if (!titleText) {
              append(name, titleText = new CKEDITOR.htmlParser.text);
            }
            titleText.value = name.attributes["data-cke-title"] || "";
          },
          input : unprotectReadyOnly,
          textarea : unprotectReadyOnly
        },
        attributes : {
          "class" : function(name) {
            return CKEDITOR.tools.ltrim(name.replace(/(?:^|\s+)cke_[^\s]*/g, "")) || false;
          }
        }
      };
      if (CKEDITOR.env.ie) {
        defaultHtmlFilterRulesForAll.attributes.style = function(name) {
          return name.replace(/(^|;)([^\:]+)/g, function(m3) {
            return m3.toLowerCase();
          });
        };
      }
      var rreturn = /<(a|area|img|input|source)\b([^>]*)>/gi;
      var r20 = /([\w-]+)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi;
      var rchecked = /^(href|src|name)$/i;
      var protectTextareaRegex = /(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi;
      var protectElementsRegex = /(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi;
      var rclass = /<cke:encoded>([^<]*)<\/cke:encoded>/gi;
      var rxhtmlTag = /(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi;
      var regexp = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi;
      var bites = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi;
    })();
    "use strict";
    CKEDITOR.htmlParser.element = function(name, keepData) {
      this.name = name;
      this.attributes = keepData || {};
      this.children = [];
      var realName = name || "";
      var prefixed = realName.match(/^cke:(.*)/);
      if (prefixed) {
        realName = prefixed[1];
      }
      realName = !(!CKEDITOR.dtd.$nonBodyContent[realName] && (!CKEDITOR.dtd.$block[realName] && (!CKEDITOR.dtd.$listItem[realName] && (!CKEDITOR.dtd.$tableContent[realName] && !(CKEDITOR.dtd.$nonEditable[realName] || realName == "br")))));
      this.isEmpty = !!CKEDITOR.dtd.$empty[name];
      this.isUnknown = !CKEDITOR.dtd[name];
      this._ = {
        isBlockLike : realName,
        hasInlineStarted : this.isEmpty || !realName
      };
    };
    CKEDITOR.htmlParser.cssStyle = function(arg) {
      var rules = {};
      ((arg instanceof CKEDITOR.htmlParser.element ? arg.attributes.style : arg) || "").replace(/&quot;/g, '"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(dataAndEvents, name, value) {
        if (name == "font-family") {
          value = value.replace(/["']/g, "");
        }
        rules[name.toLowerCase()] = value;
      });
      return{
        rules : rules,
        populate : function(obj) {
          var style = this.toString();
          if (style) {
            if (obj instanceof CKEDITOR.dom.element) {
              obj.setAttribute("style", style);
            } else {
              if (obj instanceof CKEDITOR.htmlParser.element) {
                obj.attributes.style = style;
              } else {
                obj.style = style;
              }
            }
          }
        },
        toString : function() {
          var output = [];
          var i;
          for (i in rules) {
            if (rules[i]) {
              output.push(i, ":", rules[i], ";");
            }
          }
          return output.join("");
        }
      };
    };
    (function() {
      function nameCondition(condition) {
        return function(el) {
          return el.type == CKEDITOR.NODE_ELEMENT && (typeof condition == "string" ? el.name == condition : el.name in condition);
        };
      }
      var selector_sortOrder = function(a, b) {
        a = a[0];
        b = b[0];
        return a < b ? -1 : a > b ? 1 : 0;
      };
      var fragProto = CKEDITOR.htmlParser.fragment.prototype;
      CKEDITOR.htmlParser.element.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
        type : CKEDITOR.NODE_ELEMENT,
        add : fragProto.add,
        clone : function() {
          return new CKEDITOR.htmlParser.element(this.name, this.attributes);
        },
        filter : function(name, keepData) {
          var element = this;
          var attr;
          var value;
          keepData = element.getFilterContext(keepData);
          if (keepData.off) {
            return true;
          }
          if (!element.parent) {
            name.onRoot(keepData, element);
          }
          for (;;) {
            attr = element.name;
            if (!(value = name.onElementName(keepData, attr))) {
              this.remove();
              return false;
            }
            element.name = value;
            if (!(element = name.onElement(keepData, element))) {
              this.remove();
              return false;
            }
            if (element !== this) {
              this.replaceWith(element);
              return false;
            }
            if (element.name == attr) {
              break;
            }
            if (element.type != CKEDITOR.NODE_ELEMENT) {
              this.replaceWith(element);
              return false;
            }
            if (!element.name) {
              this.replaceWithChildren();
              return false;
            }
          }
          attr = element.attributes;
          var a;
          var newAttrName;
          for (a in attr) {
            newAttrName = a;
            value = attr[a];
            for (;;) {
              if (newAttrName = name.onAttributeName(keepData, a)) {
                if (newAttrName != a) {
                  delete attr[a];
                  a = newAttrName;
                } else {
                  break;
                }
              } else {
                delete attr[a];
                break;
              }
            }
            if (newAttrName) {
              if ((value = name.onAttribute(keepData, element, newAttrName, value)) === false) {
                delete attr[newAttrName];
              } else {
                attr[newAttrName] = value;
              }
            }
          }
          if (!element.isEmpty) {
            this.filterChildren(name, false, keepData);
          }
          return true;
        },
        filterChildren : fragProto.filterChildren,
        writeHtml : function(writer, optgroup) {
          if (optgroup) {
            this.filter(optgroup);
          }
          var name = this.name;
          var results = [];
          var attr = this.attributes;
          var i;
          var resultsLn;
          writer.openTag(name, attr);
          for (i in attr) {
            results.push([i, attr[i]]);
          }
          if (writer.sortAttributes) {
            results.sort(selector_sortOrder);
          }
          i = 0;
          resultsLn = results.length;
          for (;i < resultsLn;i++) {
            attr = results[i];
            writer.attribute(attr[0], attr[1]);
          }
          writer.openTagClose(name, this.isEmpty);
          this.writeChildrenHtml(writer);
          if (!this.isEmpty) {
            writer.closeTag(name);
          }
        },
        writeChildrenHtml : fragProto.writeChildrenHtml,
        replaceWithChildren : function() {
          var children = this.children;
          var i = children.length;
          for (;i;) {
            children[--i].insertAfter(this);
          }
          this.remove();
        },
        forEach : fragProto.forEach,
        getFirst : function(condition) {
          if (!condition) {
            return this.children.length ? this.children[0] : null;
          }
          if (typeof condition != "function") {
            condition = nameCondition(condition);
          }
          var i = 0;
          var e = this.children.length;
          for (;i < e;++i) {
            if (condition(this.children[i])) {
              return this.children[i];
            }
          }
          return null;
        },
        getHtml : function() {
          var writer = new CKEDITOR.htmlParser.basicWriter;
          this.writeChildrenHtml(writer);
          return writer.getHtml();
        },
        setHtml : function(html) {
          html = this.children = CKEDITOR.htmlParser.fragment.fromHtml(html).children;
          var i = 0;
          var valuesLen = html.length;
          for (;i < valuesLen;++i) {
            html[i].parent = this;
          }
        },
        getOuterHtml : function() {
          var writer = new CKEDITOR.htmlParser.basicWriter;
          this.writeHtml(writer);
          return writer.getHtml();
        },
        split : function(index) {
          var cloneChildren = this.children.splice(index, this.children.length - index);
          var optgroup = this.clone();
          var i = 0;
          for (;i < cloneChildren.length;++i) {
            cloneChildren[i].parent = optgroup;
          }
          optgroup.children = cloneChildren;
          if (cloneChildren[0]) {
            cloneChildren[0].previous = null;
          }
          if (index > 0) {
            this.children[index - 1].next = null;
          }
          this.parent.add(optgroup, this.getIndex() + 1);
          return optgroup;
        },
        addClass : function(cls) {
          if (!this.hasClass(cls)) {
            var moduleName = this.attributes["class"] || "";
            this.attributes["class"] = moduleName + (moduleName ? " " : "") + cls;
          }
        },
        removeClass : function(className) {
          var value = this.attributes["class"];
          if (value) {
            if (value = CKEDITOR.tools.trim(value.replace(RegExp("(?:\\s+|^)" + className + "(?:\\s+|$)"), " "))) {
              this.attributes["class"] = value;
            } else {
              delete this.attributes["class"];
            }
          }
        },
        hasClass : function(cls) {
          var value = this.attributes["class"];
          return!value ? false : RegExp("(?:^|\\s)" + cls + "(?=\\s|$)").test(value);
        },
        getFilterContext : function(ctx) {
          var changes = [];
          if (!ctx) {
            ctx = {
              off : false,
              nonEditable : false,
              nestedEditable : false
            };
          }
          if (!ctx.off) {
            if (this.attributes["data-cke-processor"] == "off") {
              changes.push("off", true);
            }
          }
          if (!ctx.nonEditable && this.attributes.contenteditable == "false") {
            changes.push("nonEditable", true);
          } else {
            if (ctx.nonEditable) {
              if (!ctx.nestedEditable && this.attributes.contenteditable == "true") {
                changes.push("nestedEditable", true);
              }
            }
          }
          if (changes.length) {
            ctx = CKEDITOR.tools.copy(ctx);
            var i = 0;
            for (;i < changes.length;i = i + 2) {
              ctx[changes[i]] = changes[i + 1];
            }
          }
          return ctx;
        }
      }, true);
    })();
    (function() {
      var cache = {};
      var badChars = /{([^}]+)}/g;
      var rclass = /([\\'])/g;
      var r20 = /\n/g;
      var rreturn = /\r/g;
      CKEDITOR.template = function(source) {
        if (cache[source]) {
          this.output = cache[source];
        } else {
          var h = source.replace(rclass, "\\$1").replace(r20, "\\n").replace(rreturn, "\\r").replace(badChars, function(deepDataAndEvents, dataAndEvents) {
            return "',data['" + dataAndEvents + "']==undefined?'{" + dataAndEvents + "}':data['" + dataAndEvents + "'],'";
          });
          this.output = cache[source] = Function("data", "buffer", "return buffer?buffer.push('" + h + "'):['" + h + "'].join('');");
        }
      };
    })();
    delete CKEDITOR.loadFullCore;
    CKEDITOR.instances = {};
    CKEDITOR.document = new CKEDITOR.dom.document(document);
    CKEDITOR.add = function(name) {
      CKEDITOR.instances[name.name] = name;
      name.on("focus", function() {
        if (CKEDITOR.currentInstance != name) {
          CKEDITOR.currentInstance = name;
          CKEDITOR.fire("currentInstance");
        }
      });
      name.on("blur", function() {
        if (CKEDITOR.currentInstance == name) {
          CKEDITOR.currentInstance = null;
          CKEDITOR.fire("currentInstance");
        }
      });
      CKEDITOR.fire("instance", null, name);
    };
    CKEDITOR.remove = function(name) {
      delete CKEDITOR.instances[name.name];
    };
    (function() {
      var old = {};
      CKEDITOR.addTemplate = function(name, key) {
        var params = old[name];
        if (params) {
          return params;
        }
        params = {
          name : name,
          source : key
        };
        CKEDITOR.fire("template", params);
        return old[name] = new CKEDITOR.template(params.source);
      };
      CKEDITOR.getTemplate = function(name) {
        return old[name];
      };
    })();
    (function() {
      var assigns = [];
      CKEDITOR.addCss = function(vvar) {
        assigns.push(vvar);
      };
      CKEDITOR.getCss = function() {
        return assigns.join("\n");
      };
    })();
    CKEDITOR.on("instanceDestroyed", function() {
      if (CKEDITOR.tools.isEmpty(this.instances)) {
        CKEDITOR.fire("reset");
      }
    });
    CKEDITOR.TRISTATE_ON = 1;
    CKEDITOR.TRISTATE_OFF = 2;
    CKEDITOR.TRISTATE_DISABLED = 0;
    (function() {
      CKEDITOR.inline = function(name, keepData) {
        if (!CKEDITOR.env.isCompatible) {
          return null;
        }
        name = CKEDITOR.dom.element.get(name);
        if (name.getEditor()) {
          throw'The editor instance "' + name.getEditor().name + '" is already attached to the provided element.';
        }
        var editor = new CKEDITOR.editor(keepData, name, CKEDITOR.ELEMENT_MODE_INLINE);
        var element = name.is("textarea") ? name : null;
        if (element) {
          editor.setData(element.getValue(), null, true);
          name = CKEDITOR.dom.element.createFromHtml('<div contenteditable="' + !!editor.readOnly + '" class="cke_textarea_inline">' + element.getValue() + "</div>", CKEDITOR.document);
          name.insertAfter(element);
          element.hide();
          if (element.$.form) {
            editor._attachToForm();
          }
        } else {
          editor.setData(name.getHtml(), null, true);
        }
        editor.on("loaded", function() {
          editor.fire("uiReady");
          editor.editable(name);
          editor.container = name;
          editor.setData(editor.getData(1));
          editor.resetDirty();
          editor.fire("contentDom");
          editor.mode = "wysiwyg";
          editor.fire("mode");
          editor.status = "ready";
          editor.fireOnce("instanceReady");
          CKEDITOR.fire("instanceReady", null, editor);
        }, null, null, 1E4);
        editor.on("destroy", function() {
          if (element) {
            editor.container.clearCustomData();
            editor.container.remove();
            element.show();
          }
          editor.element.clearCustomData();
          delete editor.element;
        });
        return editor;
      };
      CKEDITOR.inlineAll = function() {
        var optgroup;
        var data;
        var name;
        for (name in CKEDITOR.dtd.$editable) {
          var elements = CKEDITOR.document.getElementsByTag(name);
          var i = 0;
          var padLength = elements.count();
          for (;i < padLength;i++) {
            optgroup = elements.getItem(i);
            if (optgroup.getAttribute("contenteditable") == "true") {
              data = {
                element : optgroup,
                config : {}
              };
              if (CKEDITOR.fire("inline", data) !== false) {
                CKEDITOR.inline(optgroup, data.config);
              }
            }
          }
        }
      };
      CKEDITOR.domReady(function() {
        if (!CKEDITOR.disableAutoInline) {
          CKEDITOR.inlineAll();
        }
      });
    })();
    CKEDITOR.replaceClass = "ckeditor";
    (function() {
      function createInstance(element, config, data, mode) {
        if (!CKEDITOR.env.isCompatible) {
          return null;
        }
        element = CKEDITOR.dom.element.get(element);
        if (element.getEditor()) {
          throw'The editor instance "' + element.getEditor().name + '" is already attached to the provided element.';
        }
        var editor = new CKEDITOR.editor(config, element, mode);
        if (mode == CKEDITOR.ELEMENT_MODE_REPLACE) {
          element.setStyle("visibility", "hidden");
          editor._.required = element.hasAttribute("required");
          element.removeAttribute("required");
        }
        if (data) {
          editor.setData(data, null, true);
        }
        editor.on("loaded", function() {
          loadTheme(editor);
          if (mode == CKEDITOR.ELEMENT_MODE_REPLACE) {
            if (editor.config.autoUpdateElement && element.$.form) {
              editor._attachToForm();
            }
          }
          editor.setMode(editor.config.startupMode, function() {
            editor.resetDirty();
            editor.status = "ready";
            editor.fireOnce("instanceReady");
            CKEDITOR.fire("instanceReady", null, editor);
          });
        });
        editor.on("destroy", destroy);
        return editor;
      }
      function destroy() {
        var container = this.container;
        var element = this.element;
        if (container) {
          container.clearCustomData();
          container.remove();
        }
        if (element) {
          element.clearCustomData();
          if (this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE) {
            element.show();
            if (this._.required) {
              element.setAttribute("required", "required");
            }
          }
          delete this.element;
        }
      }
      function loadTheme(editor) {
        var container = editor.name;
        var node = editor.element;
        var value = editor.elementMode;
        var topHtml = editor.fire("uiSpace", {
          space : "top",
          html : ""
        }).html;
        var bottomHtml = editor.fire("uiSpace", {
          space : "bottom",
          html : ""
        }).html;
        if (!themedTpl) {
          themedTpl = CKEDITOR.addTemplate("maincontainer", '<{outerEl} id="cke_{name}" class="{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' + CKEDITOR.env.cssClass + '"  dir="{langDir}" lang="{langCode}" role="application" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><{outerEl} class="cke_inner cke_reset" role="presentation">{topHtml}<{outerEl} id="{contentId}" class="cke_contents cke_reset" role="presentation"></{outerEl}>{bottomHtml}</{outerEl}></{outerEl}>')
          ;
        }
        container = CKEDITOR.dom.element.createFromHtml(themedTpl.output({
          id : editor.id,
          name : container,
          langDir : editor.lang.dir,
          langCode : editor.langCode,
          voiceLabel : [editor.lang.editor, editor.name].join(", "),
          topHtml : topHtml ? '<span id="' + editor.ui.spaceId("top") + '" class="cke_top cke_reset_all" role="presentation" style="height:auto">' + topHtml + "</span>" : "",
          contentId : editor.ui.spaceId("contents"),
          bottomHtml : bottomHtml ? '<span id="' + editor.ui.spaceId("bottom") + '" class="cke_bottom cke_reset_all" role="presentation">' + bottomHtml + "</span>" : "",
          outerEl : CKEDITOR.env.ie ? "span" : "div"
        }));
        if (value == CKEDITOR.ELEMENT_MODE_REPLACE) {
          node.hide();
          container.insertAfter(node);
        } else {
          node.append(container);
        }
        editor.container = container;
        if (topHtml) {
          editor.ui.space("top").unselectable();
        }
        if (bottomHtml) {
          editor.ui.space("bottom").unselectable();
        }
        node = editor.config.width;
        value = editor.config.height;
        if (node) {
          container.setStyle("width", CKEDITOR.tools.cssLength(node));
        }
        if (value) {
          editor.ui.space("contents").setStyle("height", CKEDITOR.tools.cssLength(value));
        }
        container.disableContextMenu();
        if (CKEDITOR.env.webkit) {
          container.on("focus", function() {
            editor.focus();
          });
        }
        editor.fireOnce("uiReady");
      }
      CKEDITOR.replace = function(regex, str) {
        return createInstance(regex, str, null, CKEDITOR.ELEMENT_MODE_REPLACE);
      };
      CKEDITOR.appendTo = function(element, config, data) {
        return createInstance(element, config, data, CKEDITOR.ELEMENT_MODE_APPENDTO);
      };
      CKEDITOR.replaceAll = function() {
        var codeSegments = document.getElementsByTagName("textarea");
        var i = 0;
        for (;i < codeSegments.length;i++) {
          var config = null;
          var p = codeSegments[i];
          if (p.name || p.id) {
            if (typeof arguments[0] == "string") {
              if (!RegExp("(?:^|\\s)" + arguments[0] + "(?:$|\\s)").test(p.className)) {
                continue;
              }
            } else {
              if (typeof arguments[0] == "function") {
                config = {};
                if (arguments[0](p, config) === false) {
                  continue;
                }
              }
            }
            this.replace(p, config);
          }
        }
      };
      CKEDITOR.editor.prototype.addMode = function(path, root) {
        (this._.modes || (this._.modes = {}))[path] = root;
      };
      CKEDITOR.editor.prototype.setMode = function(newMode, callback) {
        var optgroup = this;
        var modes = this._.modes;
        if (!(newMode == optgroup.mode || (!modes || !modes[newMode]))) {
          optgroup.fire("beforeSetMode", newMode);
          if (optgroup.mode) {
            var g = optgroup.checkDirty();
            modes = optgroup._.previousModeData;
            var target;
            var k = 0;
            optgroup.fire("beforeModeUnload");
            optgroup.editable(0);
            optgroup._.previousMode = optgroup.mode;
            optgroup._.previousModeData = target = optgroup.getData(1);
            if (optgroup.mode == "source" && modes == target) {
              optgroup.fire("lockSnapshot", {
                forceUpdate : true
              });
              k = 1;
            }
            optgroup.ui.space("contents").setHtml("");
            optgroup.mode = "";
          } else {
            optgroup._.previousModeData = optgroup.getData(1);
          }
          this._.modes[newMode](function() {
            optgroup.mode = newMode;
            if (g !== void 0) {
              if (!g) {
                optgroup.resetDirty();
              }
            }
            if (k) {
              optgroup.fire("unlockSnapshot");
            } else {
              if (newMode == "wysiwyg") {
                optgroup.fire("saveSnapshot");
              }
            }
            setTimeout(function() {
              optgroup.fire("mode");
              if (callback) {
                callback.call(optgroup);
              }
            }, 0);
          });
        }
      };
      CKEDITOR.editor.prototype.resize = function(name, keepData, ref, el) {
        var container = this.container;
        var contents = this.ui.space("contents");
        var marginDiv = CKEDITOR.env.webkit && (this.document && this.document.getWindow().$.frameElement);
        el = el ? container.getChild(1) : container;
        el.setSize("width", name, true);
        if (marginDiv) {
          marginDiv.style.width = "1%";
        }
        contents.setStyle("height", Math.max(keepData - (ref ? 0 : (el.$.offsetHeight || 0) - (contents.$.clientHeight || 0)), 0) + "px");
        if (marginDiv) {
          marginDiv.style.width = "100%";
        }
        this.fire("resize");
      };
      CKEDITOR.editor.prototype.getResizable = function(forContents) {
        return forContents ? this.ui.space("contents") : this.container;
      };
      var themedTpl;
      CKEDITOR.domReady(function() {
        if (CKEDITOR.replaceClass) {
          CKEDITOR.replaceAll(CKEDITOR.replaceClass);
        }
      });
    })();
    CKEDITOR.config.startupMode = "wysiwyg";
    (function() {
      function fixDom(evt) {
        var editor = evt.editor;
        var self = evt.data.path;
        var node = self.blockLimit;
        var selection = evt.data.selection;
        var range = selection.getRanges()[0];
        var ie;
        if (CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller) {
          if (selection = needsBrFiller(selection, self)) {
            selection.appendBogus();
            ie = CKEDITOR.env.ie;
          }
        }
        if (editor.config.autoParagraph !== false && (editor.activeEnterMode != CKEDITOR.ENTER_BR && (editor.editable().equals(node) && (!self.block && (range.collapsed && !range.getCommonAncestor().isReadOnly()))))) {
          self = range.clone();
          self.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
          node = new CKEDITOR.dom.walker(self);
          node.guard = function(node) {
            return!isNotEmpty(node) || (node.type == CKEDITOR.NODE_COMMENT || node.isReadOnly());
          };
          if (!node.checkForward() || self.checkStartOfBlock() && self.checkEndOfBlock()) {
            editor = range.fixBlock(true, editor.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p");
            if (!CKEDITOR.env.needsBrFiller) {
              if (editor = editor.getFirst(isNotEmpty)) {
                if (editor.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(editor.getText()).match(/^(?:&nbsp;|\xa0)$/)) {
                  editor.remove();
                }
              }
            }
            ie = 1;
            evt.cancel();
          }
        }
        if (ie) {
          range.select();
        }
      }
      function needsBrFiller(selection, path) {
        if (selection.isFake) {
          return 0;
        }
        var pathBlock = path.block || path.blockLimit;
        var lastNode = pathBlock && pathBlock.getLast(isNotEmpty);
        if (pathBlock && (pathBlock.isBlockBoundary() && ((!lastNode || !(lastNode.type == CKEDITOR.NODE_ELEMENT && lastNode.isBlockBoundary())) && (!pathBlock.is("pre") && !pathBlock.getBogus())))) {
          return pathBlock;
        }
      }
      function blockInputClick(evt) {
        var t = evt.data.getTarget();
        if (t.is("input")) {
          t = t.getAttribute("type");
          if (t == "submit" || t == "reset") {
            evt.data.preventDefault();
          }
        }
      }
      function isNotEmpty(node) {
        return isNotWhitespace(node) && isNotBookmark(node);
      }
      function isNotBubbling(fn, src) {
        return function(name) {
          var from = CKEDITOR.dom.element.get(name.data.$.toElement || (name.data.$.fromElement || name.data.$.relatedTarget));
          if (!from || !src.equals(from) && !src.contains(from)) {
            fn.call(this, name);
          }
        };
      }
      function getSelectedTableList(guard) {
        var selected;
        var range = guard.getRanges()[0];
        var walker = guard.root;
        var optgroup = {
          table : 1,
          ul : 1,
          ol : 1,
          dl : 1
        };
        if (range.startPath().contains(optgroup)) {
          guard = function(dataAndEvents) {
            return function(node, deepDataAndEvents) {
              if (deepDataAndEvents) {
                if (node.type == CKEDITOR.NODE_ELEMENT && node.is(optgroup)) {
                  selected = node;
                }
              }
              if (!deepDataAndEvents && (isNotEmpty(node) && (!dataAndEvents || !traverseNode(node)))) {
                return false;
              }
            };
          };
          var walkerRng = range.clone();
          walkerRng.collapse(1);
          walkerRng.setStartAt(walker, CKEDITOR.POSITION_AFTER_START);
          walker = new CKEDITOR.dom.walker(walkerRng);
          walker.guard = guard();
          walker.checkBackward();
          if (selected) {
            walkerRng = range.clone();
            walkerRng.collapse();
            walkerRng.setEndAt(selected, CKEDITOR.POSITION_AFTER_END);
            walker = new CKEDITOR.dom.walker(walkerRng);
            walker.guard = guard(true);
            selected = false;
            walker.checkForward();
            return selected;
          }
        }
        return null;
      }
      function beforeInsert(editable) {
        editable.editor.focus();
        editable.editor.fire("saveSnapshot");
      }
      function afterInsert(editable) {
        var editor = editable.editor;
        editor.getSelection().scrollIntoView();
        setTimeout(function() {
          editor.fire("saveSnapshot");
        }, 0);
      }
      CKEDITOR.editable = CKEDITOR.tools.createClass({
        base : CKEDITOR.dom.element,
        $ : function(name, keepData) {
          this.base(keepData.$ || keepData);
          this.editor = name;
          this.status = "unloaded";
          this.hasFocus = false;
          this.setup();
        },
        proto : {
          focus : function() {
            var active;
            if (CKEDITOR.env.webkit && !this.hasFocus) {
              active = this.editor._.previousActive || this.getDocument().getActive();
              if (this.contains(active)) {
                active.focus();
                return;
              }
            }
            try {
              this.$[CKEDITOR.env.ie && this.getDocument().equals(CKEDITOR.document) ? "setActive" : "focus"]();
            } catch (b) {
              if (!CKEDITOR.env.ie) {
                throw b;
              }
            }
            if (CKEDITOR.env.safari && !this.isInline()) {
              active = CKEDITOR.document.getActive();
              if (!active.equals(this.getWindow().getFrame())) {
                this.getWindow().focus();
              }
            }
          },
          on : function(name, fn) {
            var key = Array.prototype.slice.call(arguments, 0);
            if (CKEDITOR.env.ie && /^focus|blur$/.exec(name)) {
              name = name == "focus" ? "focusin" : "focusout";
              fn = isNotBubbling(fn, this);
              key[0] = name;
              key[1] = fn;
            }
            return CKEDITOR.dom.element.prototype.on.apply(this, key);
          },
          attachListener : function(optgroup, event, fn, mayParseLabeledStatementInstead, recurring, opt_attributes) {
            if (!this._.listeners) {
              this._.listeners = [];
            }
            var key = Array.prototype.slice.call(arguments, 1);
            key = optgroup.on.apply(optgroup, key);
            this._.listeners.push(key);
            return key;
          },
          clearListeners : function() {
            var listeners = this._.listeners;
            try {
              for (;listeners.length;) {
                listeners.pop().removeListener();
              }
            } catch (b) {
            }
          },
          restoreAttrs : function() {
            var changes = this._.attrChanges;
            var val;
            var key;
            for (key in changes) {
              if (changes.hasOwnProperty(key)) {
                val = changes[key];
                if (val !== null) {
                  this.setAttribute(key, val);
                } else {
                  this.removeAttribute(key);
                }
              }
            }
          },
          attachClass : function(cls) {
            var classes = this.getCustomData("classes");
            if (!this.hasClass(cls)) {
              if (!classes) {
                classes = [];
              }
              classes.push(cls);
              this.setCustomData("classes", classes);
              this.addClass(cls);
            }
          },
          changeAttr : function(attr, val) {
            var orgVal = this.getAttribute(attr);
            if (val !== orgVal) {
              if (!this._.attrChanges) {
                this._.attrChanges = {};
              }
              if (!(attr in this._.attrChanges)) {
                this._.attrChanges[attr] = orgVal;
              }
              this.setAttribute(attr, val);
            }
          },
          insertHtml : function(data, mode) {
            beforeInsert(this);
            insert(this, mode || "html", data);
          },
          insertText : function(text) {
            beforeInsert(this);
            var editor = this.editor;
            var mode = editor.getSelection().getStartElement().hasAscendant("pre", true) ? CKEDITOR.ENTER_BR : editor.activeEnterMode;
            editor = mode == CKEDITOR.ENTER_BR;
            var tools = CKEDITOR.tools;
            text = tools.htmlEncode(text.replace(/\r\n/g, "\n"));
            text = text.replace(/\t/g, "&nbsp;&nbsp; &nbsp;");
            mode = mode == CKEDITOR.ENTER_P ? "p" : "div";
            if (!editor) {
              var cx = /\n{2}/g;
              if (cx.test(text)) {
                var start = "<" + mode + ">";
                var end = "</" + mode + ">";
                text = start + text.replace(cx, function() {
                  return end + start;
                }) + end;
              }
            }
            text = text.replace(/\n/g, "<br>");
            if (!editor) {
              text = text.replace(RegExp("<br>(?=</" + mode + ">)"), function(match) {
                return tools.repeat(match, 2);
              });
            }
            text = text.replace(/^ | $/g, "&nbsp;");
            text = text.replace(/(>|\s) /g, function(deepDataAndEvents, dataAndEvents) {
              return dataAndEvents + "&nbsp;";
            }).replace(/ (?=<)/g, "&nbsp;");
            insert(this, "text", text);
          },
          insertElement : function(element, range) {
            if (range) {
              this.insertElementIntoRange(element, range);
            } else {
              this.insertElementIntoSelection(element);
            }
          },
          insertElementIntoRange : function(element, range) {
            var editor = this.editor;
            var enterMode = editor.config.enterMode;
            var name = element.getName();
            var existingNode = CKEDITOR.dtd.$block[name];
            if (range.checkReadOnly()) {
              return false;
            }
            range.deleteContents(1);
            if (range.startContainer.type == CKEDITOR.NODE_ELEMENT) {
              if (range.startContainer.is({
                tr : 1,
                table : 1,
                tbody : 1,
                thead : 1,
                tfoot : 1
              })) {
                $filter(range);
              }
            }
            var node;
            var old;
            if (existingNode) {
              for (;(node = range.getCommonAncestor(0, 1)) && ((old = CKEDITOR.dtd[node.getName()]) && (!old || !old[name]));) {
                if (node.getName() in CKEDITOR.dtd.span) {
                  range.splitElement(node);
                } else {
                  if (range.checkStartOfBlock() && range.checkEndOfBlock()) {
                    range.setStartBefore(node);
                    range.collapse(true);
                    node.remove();
                  } else {
                    range.splitBlock(enterMode == CKEDITOR.ENTER_DIV ? "div" : "p", editor.editable());
                  }
                }
              }
            }
            range.insertNode(element);
            return true;
          },
          insertElementIntoSelection : function(element) {
            beforeInsert(this);
            var editor = this.editor;
            var enterMode = editor.activeEnterMode;
            editor = editor.getSelection();
            var range = editor.getRanges()[0];
            var next = element.getName();
            next = CKEDITOR.dtd.$block[next];
            if (this.insertElementIntoRange(element, range)) {
              range.moveToPosition(element, CKEDITOR.POSITION_AFTER_END);
              if (next) {
                if ((next = element.getNext(function(node) {
                  return isNotEmpty(node) && !traverseNode(node);
                })) && (next.type == CKEDITOR.NODE_ELEMENT && next.is(CKEDITOR.dtd.$block))) {
                  if (next.getDtd()["#"]) {
                    range.moveToElementEditStart(next);
                  } else {
                    range.moveToElementEditEnd(element);
                  }
                } else {
                  if (!next && enterMode != CKEDITOR.ENTER_BR) {
                    next = range.fixBlock(true, enterMode == CKEDITOR.ENTER_DIV ? "div" : "p");
                    range.moveToElementEditStart(next);
                  }
                }
              }
            }
            editor.selectRanges([range]);
            afterInsert(this);
          },
          setData : function(data, recurring) {
            if (!recurring) {
              data = this.editor.dataProcessor.toHtml(data);
            }
            this.setHtml(data);
            if (this.status == "unloaded") {
              this.status = "ready";
            }
            this.editor.fire("dataReady");
          },
          getData : function(dataAndEvents) {
            var data = this.getHtml();
            if (!dataAndEvents) {
              data = this.editor.dataProcessor.toDataFormat(data);
            }
            return data;
          },
          setReadOnly : function(isReadOnly) {
            this.setAttribute("contenteditable", !isReadOnly);
          },
          detach : function() {
            this.removeClass("cke_editable");
            this.status = "detached";
            var editor = this.editor;
            this._.detach();
            delete editor.document;
            delete editor.window;
          },
          isInline : function() {
            return this.getDocument().equals(CKEDITOR.document);
          },
          setup : function() {
            var editor = this.editor;
            this.attachListener(editor, "beforeGetData", function() {
              var value = this.getData();
              if (!this.is("textarea")) {
                if (editor.config.ignoreEmptyParagraph !== false) {
                  value = value.replace(rxhtmlTag, function(dataAndEvents, deepDataAndEvents) {
                    return deepDataAndEvents;
                  });
                }
              }
              editor.setData(value, null, 1);
            }, this);
            this.attachListener(editor, "getSnapshot", function(evt) {
              evt.data = this.getData(1);
            }, this);
            this.attachListener(editor, "afterSetData", function() {
              this.setData(editor.getData(1));
            }, this);
            this.attachListener(editor, "loadSnapshot", function(evt) {
              this.setData(evt.data, 1);
            }, this);
            this.attachListener(editor, "beforeFocus", function() {
              var selection = editor.getSelection();
              if (!((selection = selection && selection.getNative()) && selection.type == "Control")) {
                this.focus();
              }
            }, this);
            this.attachListener(editor, "insertHtml", function(evt) {
              this.insertHtml(evt.data.dataValue, evt.data.mode);
            }, this);
            this.attachListener(editor, "insertElement", function(evt) {
              this.insertElement(evt.data);
            }, this);
            this.attachListener(editor, "insertText", function(evt) {
              this.insertText(evt.data);
            }, this);
            this.setReadOnly(editor.readOnly);
            this.attachClass("cke_editable");
            this.attachClass(editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "cke_editable_inline" : editor.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE || editor.elementMode == CKEDITOR.ELEMENT_MODE_APPENDTO ? "cke_editable_themed" : "");
            this.attachClass("cke_contents_" + editor.config.contentsLangDirection);
            editor.keystrokeHandler.blockedKeystrokes[8] = +editor.readOnly;
            editor.keystrokeHandler.attach(this);
            this.on("blur", function() {
              this.hasFocus = false;
            }, null, null, -1);
            this.on("focus", function() {
              this.hasFocus = true;
            }, null, null, -1);
            editor.focusManager.add(this);
            if (this.equals(CKEDITOR.document.getActive())) {
              this.hasFocus = true;
              editor.once("contentDom", function() {
                editor.focusManager.focus();
              });
            }
            if (this.isInline()) {
              this.changeAttr("tabindex", editor.tabIndex);
            }
            if (!this.is("textarea")) {
              editor.document = this.getDocument();
              editor.window = this.getWindow();
              var doc = editor.document;
              this.changeAttr("spellcheck", !editor.config.disableNativeSpellChecker);
              var head = editor.config.contentsLangDirection;
              if (this.getDirection(1) != head) {
                this.changeAttr("dir", head);
              }
              var sheet = CKEDITOR.getCss();
              if (sheet) {
                head = doc.getHead();
                if (!head.getCustomData("stylesheet")) {
                  sheet = doc.appendStyleText(sheet);
                  sheet = new CKEDITOR.dom.element(sheet.ownerNode || sheet.owningElement);
                  head.setCustomData("stylesheet", sheet);
                  sheet.data("cke-temp", 1);
                }
              }
              head = doc.getCustomData("stylesheet_ref") || 0;
              doc.setCustomData("stylesheet_ref", head + 1);
              this.setCustomData("cke_includeReadonly", !editor.config.disableReadonlyStyling);
              this.attachListener(this, "click", function(evt) {
                evt = evt.data;
                var link = (new CKEDITOR.dom.elementPath(evt.getTarget(), this)).contains("a");
                if (link) {
                  if (evt.$.button != 2 && link.isReadOnly()) {
                    evt.preventDefault();
                  }
                }
              });
              var map = {
                8 : 1,
                46 : 1
              };
              this.attachListener(editor, "key", function(sel) {
                if (editor.readOnly) {
                  return true;
                }
                var rtl = sel.data.domEvent.getKey();
                var f;
                if (rtl in map) {
                  sel = editor.getSelection();
                  var selected;
                  var range = sel.getRanges()[0];
                  var path = range.startPath();
                  var block;
                  var parent;
                  var next;
                  rtl = rtl == 8;
                  if (CKEDITOR.env.ie && (CKEDITOR.env.version < 11 && (selected = sel.getSelectedElement())) || (selected = getSelectedTableList(sel))) {
                    editor.fire("saveSnapshot");
                    range.moveToPosition(selected, CKEDITOR.POSITION_BEFORE_START);
                    selected.remove();
                    range.select();
                    editor.fire("saveSnapshot");
                    f = 1;
                  } else {
                    if (range.collapsed) {
                      if ((block = path.block) && ((next = block[rtl ? "getPrevious" : "getNext"](isNotWhitespace)) && (next.type == CKEDITOR.NODE_ELEMENT && (next.is("table") && range[rtl ? "checkStartOfBlock" : "checkEndOfBlock"]())))) {
                        editor.fire("saveSnapshot");
                        if (range[rtl ? "checkEndOfBlock" : "checkStartOfBlock"]()) {
                          block.remove();
                        }
                        range["moveToElementEdit" + (rtl ? "End" : "Start")](next);
                        range.select();
                        editor.fire("saveSnapshot");
                        f = 1;
                      } else {
                        if (path.blockLimit && (path.blockLimit.is("td") && ((parent = path.blockLimit.getAscendant("table")) && (range.checkBoundaryOfElement(parent, rtl ? CKEDITOR.START : CKEDITOR.END) && (next = parent[rtl ? "getPrevious" : "getNext"](isNotWhitespace)))))) {
                          editor.fire("saveSnapshot");
                          range["moveToElementEdit" + (rtl ? "End" : "Start")](next);
                          if (range.checkStartOfBlock() && range.checkEndOfBlock()) {
                            next.remove();
                          } else {
                            range.select();
                          }
                          editor.fire("saveSnapshot");
                          f = 1;
                        } else {
                          if ((parent = path.contains(["td", "th", "caption"])) && range.checkBoundaryOfElement(parent, rtl ? CKEDITOR.START : CKEDITOR.END)) {
                            f = 1;
                          }
                        }
                      }
                    }
                  }
                }
                return!f;
              });
              if (editor.blockless) {
                if (CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller) {
                  this.attachListener(this, "keyup", function(range) {
                    if (range.data.getKeystroke() in map && !this.getFirst(isNotEmpty)) {
                      this.appendBogus();
                      range = editor.createRange();
                      range.moveToPosition(this, CKEDITOR.POSITION_AFTER_START);
                      range.select();
                    }
                  });
                }
              }
              this.attachListener(this, "dblclick", function(data) {
                if (editor.readOnly) {
                  return false;
                }
                data = {
                  element : data.data.getTarget()
                };
                editor.fire("doubleclick", data);
              });
              if (CKEDITOR.env.ie) {
                this.attachListener(this, "click", blockInputClick);
              }
              if (!CKEDITOR.env.ie) {
                this.attachListener(this, "mousedown", function(evt) {
                  var control = evt.data.getTarget();
                  if (control.is("img", "hr", "input", "textarea", "select") && !control.isReadOnly()) {
                    editor.getSelection().selectElement(control);
                    if (control.is("input", "textarea", "select")) {
                      evt.data.preventDefault();
                    }
                  }
                });
              }
              if (CKEDITOR.env.gecko) {
                this.attachListener(this, "mouseup", function(block) {
                  if (block.data.$.button == 2) {
                    block = block.data.getTarget();
                    if (!block.getOuterHtml().replace(rxhtmlTag, "")) {
                      var range = editor.createRange();
                      range.moveToElementEditStart(block);
                      range.select(true);
                    }
                  }
                });
              }
              if (CKEDITOR.env.webkit) {
                this.attachListener(this, "click", function(evt) {
                  if (evt.data.getTarget().is("input", "select")) {
                    evt.data.preventDefault();
                  }
                });
                this.attachListener(this, "mouseup", function(evt) {
                  if (evt.data.getTarget().is("input", "textarea")) {
                    evt.data.preventDefault();
                  }
                });
              }
              if (CKEDITOR.env.webkit) {
                this.attachListener(editor, "key", function(c) {
                  c = c.data.domEvent.getKey();
                  if (c in map) {
                    c = c == 8;
                    var selection = editor.getSelection();
                    var range = selection.getRanges()[0];
                    var o = range.startPath();
                    var p = o.block;
                    if (range.collapsed && (p && (range[c ? "checkStartOfBlock" : "checkEndOfBlock"]() && (range.moveToClosestEditablePosition(p, !c) && range.collapsed)))) {
                      if (range.startContainer.type == CKEDITOR.NODE_ELEMENT) {
                        var node = range.startContainer.getChild(range.startOffset - (c ? 1 : 0));
                        if (node && (node.type == CKEDITOR.NODE_ELEMENT && node.is("hr"))) {
                          editor.fire("saveSnapshot");
                          node.remove();
                          editor.fire("saveSnapshot");
                          return false;
                        }
                      }
                      if ((range = range.startPath().block) && (!range || !range.contains(p))) {
                        editor.fire("saveSnapshot");
                        var el = p.getCommonAncestor(range);
                        var startNode = c ? p : range;
                        node = startNode;
                        for (;(startNode = startNode.getParent()) && (!el.equals(startNode) && startNode.getChildCount() == 1);) {
                          node = startNode;
                        }
                        var bookmarks;
                        if (bookmarks = (c ? range : p).getBogus()) {
                          bookmarks.remove();
                        }
                        bookmarks = selection.createBookmarks();
                        (c ? p : range).moveChildren(c ? range : p, false);
                        o.lastElement.mergeSiblings();
                        node.remove();
                        selection.selectBookmarks(bookmarks);
                        selection.scrollIntoView();
                        editor.fire("saveSnapshot");
                        return false;
                      }
                    }
                  }
                }, this, null, 100);
              }
            }
          }
        },
        _ : {
          detach : function() {
            this.editor.setData(this.editor.getData(), 0, 1);
            this.clearListeners();
            this.restoreAttrs();
            var doc;
            if (doc = this.removeCustomData("classes")) {
              for (;doc.length;) {
                this.removeClass(doc.pop());
              }
            }
            if (!this.is("textarea")) {
              doc = this.getDocument();
              var head = doc.getHead();
              if (head.getCustomData("stylesheet")) {
                var udataCur = doc.getCustomData("stylesheet_ref");
                if (--udataCur) {
                  doc.setCustomData("stylesheet_ref", udataCur);
                } else {
                  doc.removeCustomData("stylesheet_ref");
                  head.removeCustomData("stylesheet").remove();
                }
              }
            }
            this.editor.fire("contentDomUnload");
            delete this.editor;
          }
        }
      });
      CKEDITOR.editor.prototype.editable = function(name) {
        var editable = this._.editable;
        if (editable && name) {
          return 0;
        }
        if (arguments.length) {
          editable = this._.editable = name ? name instanceof CKEDITOR.editable ? name : new CKEDITOR.editable(this, name) : (editable && editable.detach(), null);
        }
        return editable;
      };
      var traverseNode = CKEDITOR.dom.walker.bogus();
      var rxhtmlTag = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi;
      var isNotWhitespace = CKEDITOR.dom.walker.whitespaces(true);
      var isNotBookmark = CKEDITOR.dom.walker.bookmark(false, true);
      CKEDITOR.on("instanceLoaded", function(ev) {
        var editor = ev.editor;
        editor.on("insertElement", function(node) {
          node = node.data;
          if (node.type == CKEDITOR.NODE_ELEMENT && (node.is("input") || node.is("textarea"))) {
            if (node.getAttribute("contentEditable") != "false") {
              node.data("cke-editable", node.hasAttribute("contenteditable") ? "true" : "1");
            }
            node.setAttribute("contentEditable", false);
          }
        });
        editor.on("selectionChange", function(evt) {
          if (!editor.readOnly) {
            var sel = editor.getSelection();
            if (sel && !sel.isLocked) {
              sel = editor.checkDirty();
              editor.fire("lockSnapshot");
              fixDom(evt);
              editor.fire("unlockSnapshot");
              if (!sel) {
                editor.resetDirty();
              }
            }
          }
        });
      });
      CKEDITOR.on("instanceCreated", function(ev) {
        var editor = ev.editor;
        editor.on("mode", function() {
          var editable = editor.editable();
          if (editable && editable.isInline()) {
            var ariaLabel = editor.title;
            editable.changeAttr("role", "textbox");
            editable.changeAttr("aria-label", ariaLabel);
            if (ariaLabel) {
              editable.changeAttr("title", ariaLabel);
            }
            if (ariaLabel = this.ui.space(this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "top" : "contents")) {
              var ariaDescId = CKEDITOR.tools.getNextId();
              var suiteView = CKEDITOR.dom.element.createFromHtml('<span id="' + ariaDescId + '" class="cke_voice_label">' + this.lang.common.editorHelp + "</span>");
              ariaLabel.append(suiteView);
              editable.changeAttr("aria-describedby", ariaDescId);
            }
          }
        });
      });
      CKEDITOR.addCss(".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}");
      var insert = function() {
        function checkIfElement(node) {
          return node.type == CKEDITOR.NODE_ELEMENT;
        }
        function extractNodesData(dataWrapper, that) {
          var node;
          var sibling;
          var nodeName;
          var allowed;
          var nodesData = [];
          var el = that.range.startContainer;
          node = that.range.startPath();
          el = DTD[el.getName()];
          var nodeIndex = 0;
          var nodesList = dataWrapper.getChildren();
          var nodesCount = nodesList.count();
          var firstNotAllowed = -1;
          var lastNotAllowed = -1;
          var lineBreak = 0;
          var insideOfList = node.contains(DTD.$list);
          for (;nodeIndex < nodesCount;++nodeIndex) {
            node = nodesList.getItem(nodeIndex);
            if (checkIfElement(node)) {
              nodeName = node.getName();
              if (insideOfList && nodeName in CKEDITOR.dtd.$list) {
                nodesData = nodesData.concat(extractNodesData(node, that));
              } else {
                allowed = !!el[nodeName];
                if (nodeName == "br" && (node.data("cke-eol") && (!nodeIndex || nodeIndex == nodesCount - 1))) {
                  lineBreak = (sibling = nodeIndex ? nodesData[nodeIndex - 1].node : nodesList.getItem(nodeIndex + 1)) && (!checkIfElement(sibling) || !sibling.is("br"));
                  sibling = sibling && (checkIfElement(sibling) && DTD.$block[sibling.getName()]);
                }
                if (firstNotAllowed == -1) {
                  if (!allowed) {
                    firstNotAllowed = nodeIndex;
                  }
                }
                if (!allowed) {
                  lastNotAllowed = nodeIndex;
                }
                nodesData.push({
                  isElement : 1,
                  isLineBreak : lineBreak,
                  isBlock : node.isBlockBoundary(),
                  hasBlockSibling : sibling,
                  node : node,
                  name : nodeName,
                  allowed : allowed
                });
                sibling = lineBreak = 0;
              }
            } else {
              nodesData.push({
                isElement : 0,
                node : node,
                allowed : 1
              });
            }
          }
          if (firstNotAllowed > -1) {
            nodesData[firstNotAllowed].firstNotAllowed = 1;
          }
          if (lastNotAllowed > -1) {
            nodesData[lastNotAllowed].lastNotAllowed = 1;
          }
          return nodesData;
        }
        function filterElementInner(element, parentName) {
          var nodes = [];
          var trs = element.getChildren();
          var padLength = trs.count();
          var child;
          var i = 0;
          var optgroup = DTD[parentName];
          var k = !element.is(DTD.$inline) || element.is("br");
          if (k) {
            nodes.push(" ");
          }
          for (;i < padLength;i++) {
            child = trs.getItem(i);
            if (checkIfElement(child) && !child.is(optgroup)) {
              nodes = nodes.concat(filterElementInner(child, parentName));
            } else {
              nodes.push(child);
            }
          }
          if (k) {
            nodes.push(" ");
          }
          return nodes;
        }
        function attr(node) {
          return node && (checkIfElement(node) && (node.is(DTD.$removeEmpty) || node.is("a") && !node.isBlockBoundary()));
        }
        function mergeAncestorElementsOfSelectionEnds(range, blockLimit, parent, endPath) {
          var walkerRange = range.clone();
          var node;
          var child;
          walkerRange.setEndAt(blockLimit, CKEDITOR.POSITION_BEFORE_END);
          if ((node = (new CKEDITOR.dom.walker(walkerRange)).next()) && (checkIfElement(node) && (blockMergedTags[node.getName()] && ((child = node.getPrevious()) && (checkIfElement(child) && (!child.getParent().equals(range.startContainer) && (parent.contains(child) && (endPath.contains(node) && node.isIdentical(child))))))))) {
            node.moveChildren(child);
            node.remove();
            mergeAncestorElementsOfSelectionEnds(range, blockLimit, parent, endPath);
          }
        }
        function removeBrsAdjacentToPastedBlocks(arr, range) {
          function remove(maybeBr, maybeBlockData) {
            if (maybeBlockData.isBlock && (maybeBlockData.isElement && (!maybeBlockData.node.is("br") && (checkIfElement(maybeBr) && maybeBr.is("br"))))) {
              maybeBr.remove();
              return 1;
            }
          }
          var succeedingNode = range.endContainer.getChild(range.endOffset);
          var precedingNode = range.endContainer.getChild(range.endOffset - 1);
          if (succeedingNode) {
            remove(succeedingNode, arr[arr.length - 1]);
          }
          if (precedingNode && remove(precedingNode, arr[0])) {
            range.setEnd(range.endContainer, range.endOffset - 1);
            range.collapse();
          }
        }
        var DTD = CKEDITOR.dtd;
        var blockMergedTags = {
          p : 1,
          div : 1,
          h1 : 1,
          h2 : 1,
          h3 : 1,
          h4 : 1,
          h5 : 1,
          h6 : 1,
          ul : 1,
          ol : 1,
          li : 1,
          pre : 1,
          dl : 1,
          blockquote : 1
        };
        var optgroup = {
          p : 1,
          div : 1,
          h1 : 1,
          h2 : 1,
          h3 : 1,
          h4 : 1,
          h5 : 1,
          h6 : 1
        };
        var rvar = CKEDITOR.tools.extend({}, DTD.$inline);
        delete rvar.br;
        return function(editable, that, data) {
          var range = editable.editor;
          editable.getDocument();
          var testRange = range.getSelection().getRanges()[0];
          var content = false;
          if (that == "unfiltered_html") {
            that = "html";
            content = true;
          }
          if (!testRange.checkReadOnly()) {
            var start = (new CKEDITOR.dom.elementPath(testRange.startContainer, testRange.root)).blockLimit || testRange.root;
            that = {
              type : that,
              dontFilter : content,
              editable : editable,
              editor : range,
              range : testRange,
              blockLimit : start,
              mergeCandidates : [],
              zombies : []
            };
            range = that.range;
            content = that.mergeCandidates;
            var node;
            var container;
            var nodeData;
            var parent;
            if (that.type == "text" && range.shrink(CKEDITOR.SHRINK_ELEMENT, true, false)) {
              node = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", range.document);
              range.insertNode(node);
              range.setStartAfter(node);
            }
            container = new CKEDITOR.dom.elementPath(range.startContainer);
            that.endPath = nodeData = new CKEDITOR.dom.elementPath(range.endContainer);
            if (!range.collapsed) {
              start = nodeData.block || nodeData.blockLimit;
              var name = range.getCommonAncestor();
              if (start) {
                if (!start.equals(name) && (!start.contains(name) && range.checkEndOfBlock())) {
                  that.zombies.push(start);
                }
              }
              range.deleteContents();
            }
            for (;(parent = checkIfElement(range.startContainer) && range.startContainer.getChild(range.startOffset - 1)) && (checkIfElement(parent) && (parent.isBlockBoundary() && container.contains(parent)));) {
              range.moveToPosition(parent, CKEDITOR.POSITION_BEFORE_END);
            }
            mergeAncestorElementsOfSelectionEnds(range, that.blockLimit, container, nodeData);
            if (node) {
              range.setEndBefore(node);
              range.collapse();
              node.remove();
            }
            node = range.startPath();
            if (start = node.contains(attr, false, 1)) {
              range.splitElement(start);
              that.inlineStylesRoot = start;
              that.inlineStylesPeak = node.lastElement;
            }
            node = range.createBookmark();
            if (start = node.startNode.getPrevious(isNotEmpty)) {
              if (checkIfElement(start)) {
                if (attr(start)) {
                  content.push(start);
                }
              }
            }
            if (start = node.startNode.getNext(isNotEmpty)) {
              if (checkIfElement(start)) {
                if (attr(start)) {
                  content.push(start);
                }
              }
            }
            start = node.startNode;
            for (;(start = start.getParent()) && attr(start);) {
              content.push(start);
            }
            range.moveToBookmark(node);
            if (node = data) {
              node = that.range;
              if (that.type == "text" && that.inlineStylesRoot) {
                parent = that.inlineStylesPeak;
                range = parent.getDocument().createText("{cke-peak}");
                content = that.inlineStylesRoot.getParent();
                for (;!parent.equals(content);) {
                  range = range.appendTo(parent.clone());
                  parent = parent.getParent();
                }
                data = range.getOuterHtml().split("{cke-peak}").join(data);
              }
              parent = that.blockLimit.getName();
              if (/^\s+|\s+$/.test(data) && "span" in CKEDITOR.dtd[parent]) {
                var d = '<span data-cke-marker="1">&nbsp;</span>';
                data = d + data + d;
              }
              data = that.editor.dataProcessor.toHtml(data, {
                context : null,
                fixForBody : false,
                dontFilter : that.dontFilter,
                filter : that.editor.activeFilter,
                enterMode : that.editor.activeEnterMode
              });
              parent = node.document.createElement("body");
              parent.setHtml(data);
              if (d) {
                parent.getFirst().remove();
                parent.getLast().remove();
              }
              if ((d = node.startPath().block) && !(d.getChildCount() == 1 && d.getBogus())) {
                a: {
                  var self;
                  if (parent.getChildCount() == 1 && (checkIfElement(self = parent.getFirst()) && self.is(optgroup))) {
                    d = self.getElementsByTag("*");
                    node = 0;
                    content = d.count();
                    for (;node < content;node++) {
                      range = d.getItem(node);
                      if (!range.is(rvar)) {
                        break a;
                      }
                    }
                    self.moveChildren(self.getParent(1));
                    self.remove();
                  }
                }
              }
              that.dataWrapper = parent;
              node = data;
            }
            if (node) {
              self = that.range;
              d = self.document;
              var c;
              data = that.blockLimit;
              node = 0;
              var cursor;
              parent = [];
              var element;
              var block;
              content = range = 0;
              var el;
              var id;
              container = self.startContainer;
              start = that.endPath.elements[0];
              var bm;
              nodeData = start.getPosition(container);
              name = !!start.getCommonAncestor(container) && (nodeData != CKEDITOR.POSITION_IDENTICAL && !(nodeData & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED));
              container = extractNodesData(that.dataWrapper, that);
              removeBrsAdjacentToPastedBlocks(container, self);
              for (;node < container.length;node++) {
                nodeData = container[node];
                if (c = nodeData.isLineBreak) {
                  c = self;
                  el = data;
                  var body = void 0;
                  var pos = void 0;
                  if (nodeData.hasBlockSibling) {
                    c = 1;
                  } else {
                    body = c.startContainer.getAscendant(DTD.$block, 1);
                    if (!body || !body.is({
                      div : 1,
                      p : 1
                    })) {
                      c = 0;
                    } else {
                      pos = body.getPosition(el);
                      if (pos == CKEDITOR.POSITION_IDENTICAL || pos == CKEDITOR.POSITION_CONTAINS) {
                        c = 0;
                      } else {
                        el = c.splitElement(body);
                        c.moveToPosition(el, CKEDITOR.POSITION_AFTER_START);
                        c = 1;
                      }
                    }
                  }
                }
                if (c) {
                  content = node > 0;
                } else {
                  c = self.startPath();
                  if (!nodeData.isBlock && (that.editor.config.autoParagraph !== false && (that.editor.activeEnterMode != CKEDITOR.ENTER_BR && (that.editor.editable().equals(c.blockLimit) && !c.block) && (block = that.editor.activeEnterMode != CKEDITOR.ENTER_BR && that.editor.config.autoParagraph !== false ? that.editor.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p" : false)))) {
                    block = d.createElement(block);
                    block.appendBogus();
                    self.insertNode(block);
                    if (CKEDITOR.env.needsBrFiller) {
                      if (cursor = block.getBogus()) {
                        cursor.remove();
                      }
                    }
                    self.moveToPosition(block, CKEDITOR.POSITION_BEFORE_END);
                  }
                  if ((c = self.startPath().block) && !c.equals(element)) {
                    if (cursor = c.getBogus()) {
                      cursor.remove();
                      parent.push(c);
                    }
                    element = c;
                  }
                  if (nodeData.firstNotAllowed) {
                    range = 1;
                  }
                  if (range && nodeData.isElement) {
                    c = self.startContainer;
                    el = null;
                    for (;c && !DTD[c.getName()][nodeData.name];) {
                      if (c.equals(data)) {
                        c = null;
                        break;
                      }
                      el = c;
                      c = c.getParent();
                    }
                    if (c) {
                      if (el) {
                        id = self.splitElement(el);
                        that.zombies.push(id);
                        that.zombies.push(el);
                      }
                    } else {
                      el = data.getName();
                      bm = !node;
                      c = node == container.length - 1;
                      el = filterElementInner(nodeData.node, el);
                      body = [];
                      pos = el.length;
                      var i = 0;
                      var t = void 0;
                      var ba = 0;
                      var len = -1;
                      for (;i < pos;i++) {
                        t = el[i];
                        if (t == " ") {
                          if (!ba && (!bm || i)) {
                            body.push(new CKEDITOR.dom.text(" "));
                            len = body.length;
                          }
                          ba = 1;
                        } else {
                          body.push(t);
                          ba = 0;
                        }
                      }
                      if (c) {
                        if (len == body.length) {
                          body.pop();
                        }
                      }
                      bm = body;
                    }
                  }
                  if (bm) {
                    for (;c = bm.pop();) {
                      self.insertNode(c);
                    }
                    bm = 0;
                  } else {
                    self.insertNode(nodeData.node);
                  }
                  if (nodeData.lastNotAllowed && node < container.length - 1) {
                    if (id = name ? start : id) {
                      self.setEndAt(id, CKEDITOR.POSITION_AFTER_START);
                    }
                    range = 0;
                  }
                  self.collapse();
                }
              }
              that.dontMoveCaret = content;
              that.bogusNeededBlocks = parent;
            }
            cursor = that.range;
            var movedIntoInline;
            id = that.bogusNeededBlocks;
            bm = cursor.createBookmark();
            for (;element = that.zombies.pop();) {
              if (element.getParent()) {
                block = cursor.clone();
                block.moveToElementEditStart(element);
                block.removeEmptyBlocksAtEnd();
              }
            }
            if (id) {
              for (;element = id.pop();) {
                if (CKEDITOR.env.needsBrFiller) {
                  element.appendBogus();
                } else {
                  element.append(cursor.document.createText(" "));
                }
              }
            }
            for (;element = that.mergeCandidates.pop();) {
              element.mergeSiblings();
            }
            cursor.moveToBookmark(bm);
            if (!that.dontMoveCaret) {
              element = checkIfElement(cursor.startContainer) && cursor.startContainer.getChild(cursor.startOffset - 1);
              for (;element && (checkIfElement(element) && !element.is(DTD.$empty));) {
                if (element.isBlockBoundary()) {
                  cursor.moveToPosition(element, CKEDITOR.POSITION_BEFORE_END);
                } else {
                  if (attr(element) && element.getHtml().match(/(\s|&nbsp;)$/g)) {
                    movedIntoInline = null;
                    break;
                  }
                  movedIntoInline = cursor.clone();
                  movedIntoInline.moveToPosition(element, CKEDITOR.POSITION_BEFORE_END);
                }
                element = element.getLast(isNotEmpty);
              }
              if (movedIntoInline) {
                cursor.moveToRange(movedIntoInline);
              }
            }
            testRange.select();
            afterInsert(editable);
          }
        };
      }();
      var $filter = function() {
        function onSelectionChangeFixBody(s) {
          s = new CKEDITOR.dom.walker(s);
          s.guard = function(node, deepDataAndEvents) {
            if (deepDataAndEvents) {
              return false;
            }
            if (node.type == CKEDITOR.NODE_ELEMENT) {
              return node.is(CKEDITOR.dtd.$tableContent);
            }
          };
          s.evaluator = function(name) {
            return name.type == CKEDITOR.NODE_ELEMENT;
          };
          return s;
        }
        function put(context, name, node) {
          name = context.getDocument().createElement(name);
          context.append(name, node);
          return name;
        }
        function mergeCells(trs) {
          var i = trs.count();
          var node;
          i;
          for (;i-- > 0;) {
            node = trs.getItem(i);
            if (!CKEDITOR.tools.trim(node.getHtml())) {
              node.appendBogus();
              if (CKEDITOR.env.ie) {
                if (CKEDITOR.env.version < 9 && node.getChildCount()) {
                  node.getFirst().remove();
                }
              }
            }
          }
        }
        return function(range) {
          var root = range.startContainer;
          var node = root.getAscendant("table", 1);
          var checkStart = false;
          mergeCells(node.getElementsByTag("td"));
          mergeCells(node.getElementsByTag("th"));
          node = range.clone();
          node.setStart(root, 0);
          node = onSelectionChangeFixBody(node).lastBackward();
          if (!node) {
            node = range.clone();
            node.setEndAt(root, CKEDITOR.POSITION_BEFORE_END);
            node = onSelectionChangeFixBody(node).lastForward();
            checkStart = true;
          }
          if (!node) {
            node = root;
          }
          if (node.is("table")) {
            range.setStartAt(node, CKEDITOR.POSITION_BEFORE_START);
            range.collapse(true);
            node.remove();
          } else {
            if (node.is({
              tbody : 1,
              thead : 1,
              tfoot : 1
            })) {
              node = put(node, "tr", checkStart);
            }
            if (node.is("tr")) {
              node = put(node, node.getParent().is("thead") ? "th" : "td", checkStart);
            }
            if (root = node.getBogus()) {
              root.remove();
            }
            range.moveToPosition(node, checkStart ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
          }
        };
      }();
    })();
    (function() {
      function checkSelectionChange() {
        var sel = this._.fakeSelection;
        var currentPath;
        if (sel) {
          currentPath = this.getSelection(1);
          if (!currentPath || !currentPath.isHidden()) {
            sel.reset();
            sel = 0;
          }
        }
        if (!sel) {
          sel = currentPath || this.getSelection(1);
          if (!sel || sel.getType() == CKEDITOR.SELECTION_NONE) {
            return;
          }
        }
        this.fire("selectionCheck", sel);
        currentPath = this.elementPath();
        if (!currentPath.compare(this._.selectionPreviousPath)) {
          if (CKEDITOR.env.webkit) {
            this._.previousActive = this.document.getActive();
          }
          this._.selectionPreviousPath = currentPath;
          this.fire("selectionChange", {
            selection : sel,
            path : currentPath
          });
        }
      }
      function checkSelectionChangeTimeout() {
        o = true;
        if (!pos) {
          handler.call(this);
          pos = CKEDITOR.tools.setTimeout(handler, 200, this);
        }
      }
      function handler() {
        pos = null;
        if (o) {
          CKEDITOR.tools.setTimeout(checkSelectionChange, 0, this);
          o = false;
        }
      }
      function rangeRequiresFix(range) {
        function isTextCt(node, isAtEnd) {
          return!node || node.type == CKEDITOR.NODE_TEXT ? false : range.clone()["moveToElementEdit" + (isAtEnd ? "End" : "Start")](node);
        }
        if (!(range.root instanceof CKEDITOR.editable)) {
          return false;
        }
        var ct = range.startContainer;
        var next = range.getPreviousNode(node, null, ct);
        var previous = range.getNextNode(node, null, ct);
        return isTextCt(next) || (isTextCt(previous, 1) || !next && (!previous && !(ct.type == CKEDITOR.NODE_ELEMENT && (ct.isBlockBoundary() && ct.getBogus())))) ? true : false;
      }
      function getFillingChar(doc) {
        return doc.getCustomData("cke-fillingChar");
      }
      function removeFillingChar(element, recurring) {
        var range = element && element.removeCustomData("cke-fillingChar");
        if (range) {
          if (recurring !== false) {
            var bm;
            var sel = element.getDocument().getSelection().getNative();
            var selection = sel && (sel.type != "None" && sel.getRangeAt(0));
            if (range.getLength() > 1 && (selection && selection.intersectsNode(range.$))) {
              bm = [sel.anchorOffset, sel.focusOffset];
              selection = sel.focusNode == range.$ && sel.focusOffset > 0;
              if (sel.anchorNode == range.$) {
                if (sel.anchorOffset > 0) {
                  bm[0]--;
                }
              }
              if (selection) {
                bm[1]--;
              }
              var self;
              selection = sel;
              if (!selection.isCollapsed) {
                self = selection.getRangeAt(0);
                self.setStart(selection.anchorNode, selection.anchorOffset);
                self.setEnd(selection.focusNode, selection.focusOffset);
                self = self.collapsed;
              }
              if (self) {
                bm.unshift(bm.pop());
              }
            }
          }
          range.setText(replaceFillingChar(range.getText()));
          if (bm) {
            range = sel.getRangeAt(0);
            range.setStart(range.startContainer, bm[0]);
            range.setEnd(range.startContainer, bm[1]);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }
      function replaceFillingChar(html) {
        return html.replace(/\u200B( )?/g, function(match) {
          return match[1] ? " " : "";
        });
      }
      function fixInitialSelection(root, selection, dataAndEvents) {
        var self = root.on("focus", function(item) {
          item.cancel();
        }, null, null, -100);
        if (CKEDITOR.env.ie) {
          var listener = root.getDocument().on("selectionchange", function(item) {
            item.cancel();
          }, null, null, -100)
        } else {
          var range = new CKEDITOR.dom.range(root);
          range.moveToElementEditStart(root);
          var nativeRange = root.getDocument().$.createRange();
          nativeRange.setStart(range.startContainer.$, range.startOffset);
          nativeRange.collapse(1);
          selection.removeAllRanges();
          selection.addRange(nativeRange);
        }
        if (dataAndEvents) {
          root.focus();
        }
        self.removeListener();
        if (listener) {
          listener.removeListener();
        }
      }
      function hideSelection(editor) {
        var body = CKEDITOR.dom.element.createFromHtml('<div data-cke-hidden-sel="1" data-cke-temp="1" style="' + (CKEDITOR.env.ie ? "display:none" : "position:fixed;top:0;left:-1000px") + '">&nbsp;</div>', editor.document);
        editor.fire("lockSnapshot");
        editor.editable().append(body);
        var sel = editor.getSelection(1);
        var range = editor.createRange();
        var listener = sel.root.on("selectionchange", function(item) {
          item.cancel();
        }, null, null, 0);
        range.setStartAt(body, CKEDITOR.POSITION_AFTER_START);
        range.setEndAt(body, CKEDITOR.POSITION_BEFORE_END);
        sel.selectRanges([range]);
        listener.removeListener();
        editor.fire("unlockSnapshot");
        editor._.hiddenSelectionContainer = body;
      }
      function getOnKeyDownListener(editor) {
        var computed = {
          37 : 1,
          39 : 1,
          8 : 1,
          46 : 1
        };
        return function(evt) {
          var next = evt.data.getKeystroke();
          if (computed[next]) {
            var rangesArr = editor.getSelection().getRanges();
            var range = rangesArr[0];
            if (rangesArr.length == 1 && range.collapsed) {
              if ((next = range[next < 38 ? "getPreviousEditableNode" : "getNextEditableNode"]()) && (next.type == CKEDITOR.NODE_ELEMENT && next.getAttribute("contenteditable") == "false")) {
                editor.getSelection().fake(next);
                evt.data.preventDefault();
                evt.cancel();
              }
            }
          }
        };
      }
      function applyInlineStyle(tokens) {
        var i = 0;
        for (;i < tokens.length;i++) {
          var self = tokens[i];
          if (self.getCommonAncestor().isReadOnly()) {
            tokens.splice(i, 1);
          }
          if (!self.collapsed) {
            if (self.startContainer.isReadOnly()) {
              var node = self.startContainer;
              var container;
              for (;node;) {
                if ((container = node.type == CKEDITOR.NODE_ELEMENT) && node.is("body") || !node.isReadOnly()) {
                  break;
                }
                if (container) {
                  if (node.getAttribute("contentEditable") == "false") {
                    self.setStartAfter(node);
                  }
                }
                node = node.getParent();
              }
            }
            node = self.startContainer;
            container = self.endContainer;
            var startOffset = self.startOffset;
            var endOffset = self.endOffset;
            var range = self.clone();
            if (node) {
              if (node.type == CKEDITOR.NODE_TEXT) {
                if (startOffset >= node.getLength()) {
                  range.setStartAfter(node);
                } else {
                  range.setStartBefore(node);
                }
              }
            }
            if (container) {
              if (container.type == CKEDITOR.NODE_TEXT) {
                if (endOffset) {
                  range.setEndAfter(container);
                } else {
                  range.setEndBefore(container);
                }
              }
            }
            node = new CKEDITOR.dom.walker(range);
            node.evaluator = function(name) {
              if (name.type == CKEDITOR.NODE_ELEMENT && name.isReadOnly()) {
                var t = self.clone();
                self.setEndBefore(name);
                if (self.collapsed) {
                  tokens.splice(i--, 1);
                }
                if (!(name.getPosition(range.endContainer) & CKEDITOR.POSITION_CONTAINS)) {
                  t.setStartAfter(name);
                  if (!t.collapsed) {
                    tokens.splice(i + 1, 0, t);
                  }
                }
                return true;
              }
              return false;
            };
            node.next();
          }
        }
        return tokens;
      }
      var pos;
      var o;
      var node = CKEDITOR.dom.walker.invisible(1);
      var fakeSelectionDefaultKeystrokeHandlers = function() {
        function leave(right) {
          return function(evt) {
            var range = evt.editor.createRange();
            if (range.moveToClosestEditablePosition(evt.selected, right)) {
              evt.editor.getSelection().selectRanges([range]);
            }
            return false;
          };
        }
        function del(right) {
          return function(evt) {
            var editor = evt.editor;
            var range = editor.createRange();
            var result;
            if (!(result = range.moveToClosestEditablePosition(evt.selected, right))) {
              result = range.moveToClosestEditablePosition(evt.selected, !right);
            }
            if (result) {
              editor.getSelection().selectRanges([range]);
            }
            editor.fire("saveSnapshot");
            evt.selected.remove();
            if (!result) {
              range.moveToElementEditablePosition(editor.editable());
              editor.getSelection().selectRanges([range]);
            }
            editor.fire("saveSnapshot");
            return false;
          };
        }
        var c = leave();
        var d = leave(1);
        return{
          37 : c,
          38 : c,
          39 : d,
          40 : d,
          8 : del(),
          46 : del(1)
        };
      }();
      CKEDITOR.on("instanceCreated", function(dojox) {
        function init() {
          var sel = optgroup.getSelection();
          if (sel) {
            sel.removeAllRanges();
          }
        }
        var optgroup = dojox.editor;
        optgroup.on("contentDom", function() {
          var doc = optgroup.document;
          var outerDoc = CKEDITOR.document;
          var editable = optgroup.editable();
          var body = doc.getBody();
          var html = doc.getDocumentElement();
          var ie = editable.isInline();
          var udataCur;
          var lastSel;
          if (CKEDITOR.env.gecko) {
            editable.attachListener(editable, "focus", function(range) {
              range.removeListener();
              if (udataCur !== 0) {
                if ((range = optgroup.getSelection().getNative()) && (range.isCollapsed && range.anchorNode == editable.$)) {
                  range = optgroup.createRange();
                  range.moveToElementEditStart(editable);
                  range.select();
                }
              }
            }, null, null, -2);
          }
          editable.attachListener(editable, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
            if (udataCur) {
              if (CKEDITOR.env.webkit) {
                udataCur = optgroup._.previousActive && optgroup._.previousActive.equals(doc.getActive());
              }
            }
            optgroup.unlockSelection(udataCur);
            udataCur = 0;
          }, null, null, -1);
          editable.attachListener(editable, "mousedown", function() {
            udataCur = 0;
          });
          if (CKEDITOR.env.ie || ie) {
            var saveSel = function() {
              lastSel = new CKEDITOR.dom.selection(optgroup.getSelection());
              lastSel.lock();
            };
            if (isMSSelection) {
              editable.attachListener(editable, "beforedeactivate", saveSel, null, null, -1);
            } else {
              editable.attachListener(optgroup, "selectionCheck", saveSel, null, null, -1);
            }
            editable.attachListener(editable, CKEDITOR.env.webkit ? "DOMFocusOut" : "blur", function() {
              optgroup.lockSelection(lastSel);
              udataCur = 1;
            }, null, null, -1);
            editable.attachListener(editable, "mousedown", function() {
              udataCur = 0;
            });
          }
          if (CKEDITOR.env.ie && !ie) {
            var scroll;
            editable.attachListener(editable, "mousedown", function(event) {
              if (event.data.$.button == 2) {
                event = optgroup.document.getSelection();
                if (!event || event.getType() == CKEDITOR.SELECTION_NONE) {
                  scroll = optgroup.window.getScrollPosition();
                }
              }
            });
            editable.attachListener(editable, "mouseup", function(evt) {
              if (evt.data.$.button == 2 && scroll) {
                optgroup.document.$.documentElement.scrollLeft = scroll.x;
                optgroup.document.$.documentElement.scrollTop = scroll.y;
              }
              scroll = null;
            });
            if (doc.$.compatMode != "BackCompat") {
              if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) {
                html.on("mousedown", function(evt) {
                  function onHover(evt) {
                    evt = evt.data.$;
                    if (range) {
                      var self = body.$.createTextRange();
                      try {
                        self.moveToPoint(evt.x, evt.y);
                      } catch (d) {
                      }
                      range.setEndPoint(bodyRange.compareEndPoints("StartToStart", self) < 0 ? "EndToEnd" : "StartToStart", self);
                      range.select();
                    }
                  }
                  function onMouseUp() {
                    html.removeListener("mousemove", onHover);
                    outerDoc.removeListener("mouseup", onMouseUp);
                    html.removeListener("mouseup", onMouseUp);
                    range.select();
                  }
                  evt = evt.data;
                  if (evt.getTarget().is("html") && (evt.$.y < html.$.clientHeight && evt.$.x < html.$.clientWidth)) {
                    var range = body.$.createTextRange();
                    try {
                      range.moveToPoint(evt.$.x, evt.$.y);
                    } catch (e) {
                    }
                    var bodyRange = range.duplicate();
                    html.on("mousemove", onHover);
                    outerDoc.on("mouseup", onMouseUp);
                    html.on("mouseup", onMouseUp);
                  }
                });
              }
              if (CKEDITOR.env.version > 7 && CKEDITOR.env.version < 11) {
                html.on("mousedown", function(ev) {
                  if (ev.data.getTarget().is("html")) {
                    outerDoc.on("mouseup", onSelectEnd);
                    html.on("mouseup", onSelectEnd);
                  }
                });
                var onSelectEnd = function() {
                  outerDoc.removeListener("mouseup", onSelectEnd);
                  html.removeListener("mouseup", onSelectEnd);
                  var sel = CKEDITOR.document.$.selection;
                  var range = sel.createRange();
                  if (sel.type != "None") {
                    if (range.parentElement().ownerDocument == doc.$) {
                      range.select();
                    }
                  }
                };
              }
            }
          }
          editable.attachListener(editable, "selectionchange", checkSelectionChange, optgroup);
          editable.attachListener(editable, "keyup", checkSelectionChangeTimeout, optgroup);
          editable.attachListener(editable, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
            optgroup.forceNextSelectionCheck();
            optgroup.selectionChange(1);
          });
          if (ie && (CKEDITOR.env.webkit || CKEDITOR.env.gecko)) {
            var E;
            editable.attachListener(editable, "mousedown", function() {
              E = 1;
            });
            editable.attachListener(doc.getDocumentElement(), "mouseup", function() {
              if (E) {
                checkSelectionChangeTimeout.call(optgroup);
              }
              E = 0;
            });
          } else {
            editable.attachListener(CKEDITOR.env.ie ? editable : doc.getDocumentElement(), "mouseup", checkSelectionChangeTimeout, optgroup);
          }
          if (CKEDITOR.env.webkit) {
            editable.attachListener(doc, "keydown", function(evt) {
              switch(evt.data.getKey()) {
                case 13:
                ;
                case 33:
                ;
                case 34:
                ;
                case 35:
                ;
                case 36:
                ;
                case 37:
                ;
                case 39:
                ;
                case 8:
                ;
                case 45:
                ;
                case 46:
                  removeFillingChar(editable);
              }
            }, null, null, -1);
          }
          editable.attachListener(editable, "keydown", getOnKeyDownListener(optgroup), null, null, -1);
        });
        optgroup.on("setData", function() {
          optgroup.unlockSelection();
          if (CKEDITOR.env.webkit) {
            init();
          }
        });
        optgroup.on("contentDomUnload", function() {
          optgroup.unlockSelection();
        });
        if (CKEDITOR.env.ie9Compat) {
          optgroup.on("beforeDestroy", init, null, null, 9);
        }
        optgroup.on("dataReady", function() {
          delete optgroup._.fakeSelection;
          delete optgroup._.hiddenSelectionContainer;
          optgroup.selectionChange(1);
        });
        optgroup.on("loadSnapshot", function() {
          var el = optgroup.editable().getLast(function(selectedElement) {
            return selectedElement.type == CKEDITOR.NODE_ELEMENT;
          });
          if (el) {
            if (el.hasAttribute("data-cke-hidden-sel")) {
              el.remove();
            }
          }
        }, null, null, 100);
        optgroup.on("key", function(evt) {
          if (optgroup.mode == "wysiwyg") {
            var sel = optgroup.getSelection();
            if (sel.isFake) {
              var handler = fakeSelectionDefaultKeystrokeHandlers[evt.data.keyCode];
              if (handler) {
                return handler({
                  editor : optgroup,
                  selected : sel.getSelectedElement(),
                  selection : sel,
                  keyEvent : evt
                });
              }
            }
          }
        });
      });
      CKEDITOR.on("instanceReady", function(beforeData) {
        var editor = beforeData.editor;
        if (CKEDITOR.env.webkit) {
          editor.on("selectionChange", function() {
            var element = editor.editable();
            var fillingChar = getFillingChar(element);
            if (fillingChar) {
              if (fillingChar.getCustomData("ready")) {
                removeFillingChar(element);
              } else {
                fillingChar.setCustomData("ready", 1);
              }
            }
          }, null, null, -1);
          editor.on("beforeSetMode", function() {
            removeFillingChar(editor.editable());
          }, null, null, -1);
          var text;
          var e;
          beforeData = function() {
            var doc = editor.editable();
            if (doc) {
              if (doc = getFillingChar(doc)) {
                var sel = editor.document.$.defaultView.getSelection();
                if (sel.type == "Caret") {
                  if (sel.anchorNode == doc.$) {
                    e = 1;
                  }
                }
                text = doc.getText();
                doc.setText(replaceFillingChar(text));
              }
            }
          };
          var afterData = function() {
            var doc = editor.editable();
            if (doc) {
              if (doc = getFillingChar(doc)) {
                doc.setText(text);
                if (e) {
                  editor.document.$.defaultView.getSelection().setPosition(doc.$, doc.getLength());
                  e = 0;
                }
              }
            }
          };
          editor.on("beforeUndoImage", beforeData);
          editor.on("afterUndoImage", afterData);
          editor.on("beforeGetData", beforeData, null, null, 0);
          editor.on("getData", afterData);
        }
      });
      CKEDITOR.editor.prototype.selectionChange = function(checkNow) {
        (checkNow ? checkSelectionChange : checkSelectionChangeTimeout).call(this);
      };
      CKEDITOR.editor.prototype.getSelection = function(dataAndEvents) {
        if ((this._.savedSelection || this._.fakeSelection) && !dataAndEvents) {
          return this._.savedSelection || this._.fakeSelection;
        }
        return(dataAndEvents = this.editable()) && this.mode == "wysiwyg" ? new CKEDITOR.dom.selection(dataAndEvents) : null;
      };
      CKEDITOR.editor.prototype.lockSelection = function(sel) {
        sel = sel || this.getSelection(1);
        if (sel.getType() != CKEDITOR.SELECTION_NONE) {
          if (!sel.isLocked) {
            sel.lock();
          }
          this._.savedSelection = sel;
          return true;
        }
        return false;
      };
      CKEDITOR.editor.prototype.unlockSelection = function(value) {
        var sel = this._.savedSelection;
        if (sel) {
          sel.unlock(value);
          delete this._.savedSelection;
          return true;
        }
        return false;
      };
      CKEDITOR.editor.prototype.forceNextSelectionCheck = function() {
        delete this._.selectionPreviousPath;
      };
      CKEDITOR.dom.document.prototype.getSelection = function() {
        return new CKEDITOR.dom.selection(this);
      };
      CKEDITOR.dom.range.prototype.select = function() {
        var sel = this.root instanceof CKEDITOR.editable ? this.root.editor.getSelection() : new CKEDITOR.dom.selection(this.root);
        sel.selectRanges([this]);
        return sel;
      };
      CKEDITOR.SELECTION_NONE = 1;
      CKEDITOR.SELECTION_TEXT = 2;
      CKEDITOR.SELECTION_ELEMENT = 3;
      var isMSSelection = typeof window.getSelection != "function";
      var nextRev = 1;
      CKEDITOR.dom.selection = function(name) {
        if (name instanceof CKEDITOR.dom.selection) {
          var selection = name;
          name = name.root;
        }
        var is_array = name instanceof CKEDITOR.dom.element;
        this.rev = selection ? selection.rev : nextRev++;
        this.document = name instanceof CKEDITOR.dom.document ? name : name.getDocument();
        this.root = name = is_array ? name : this.document.getBody();
        this.isLocked = 0;
        this._ = {
          cache : {}
        };
        if (selection) {
          CKEDITOR.tools.extend(this._.cache, selection._.cache);
          this.isFake = selection.isFake;
          this.isLocked = selection.isLocked;
          return this;
        }
        selection = isMSSelection ? this.document.$.selection : this.document.getWindow().$.getSelection();
        if (CKEDITOR.env.webkit) {
          if (selection.type == "None" && this.document.getActive().equals(name) || selection.type == "Caret" && selection.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT) {
            fixInitialSelection(name, selection);
          }
        } else {
          if (CKEDITOR.env.gecko) {
            if (selection) {
              if (this.document.getActive().equals(name) && (selection.anchorNode && selection.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT)) {
                fixInitialSelection(name, selection, true);
              }
            }
          } else {
            if (CKEDITOR.env.ie) {
              var sel;
              try {
                sel = this.document.getActive();
              } catch (f) {
              }
              if (isMSSelection) {
                if (selection.type == "None") {
                  if (sel && sel.equals(this.document.getDocumentElement())) {
                    fixInitialSelection(name, null, true);
                  }
                }
              } else {
                if (selection = selection && selection.anchorNode) {
                  selection = new CKEDITOR.dom.node(selection);
                }
                if (sel) {
                  if (sel.equals(this.document.getDocumentElement()) && (selection && (name.equals(selection) || name.contains(selection)))) {
                    fixInitialSelection(name, null, true);
                  }
                }
              }
            }
          }
        }
        sel = this.getNative();
        var node;
        var range;
        if (sel) {
          if (sel.getRangeAt) {
            node = (range = sel.rangeCount && sel.getRangeAt(0)) && new CKEDITOR.dom.node(range.commonAncestorContainer);
          } else {
            try {
              range = sel.createRange();
            } catch (h) {
            }
            node = range && CKEDITOR.dom.element.get(range.item && range.item(0) || range.parentElement());
          }
        }
        if (!node || (!(node.type == CKEDITOR.NODE_ELEMENT || node.type == CKEDITOR.NODE_TEXT) || !this.root.equals(node) && !this.root.contains(node))) {
          this._.cache.type = CKEDITOR.SELECTION_NONE;
          this._.cache.startElement = null;
          this._.cache.selectedElement = null;
          this._.cache.selectedText = "";
          this._.cache.ranges = new CKEDITOR.dom.rangeList;
        }
        return this;
      };
      var styleObjectElements = {
        img : 1,
        hr : 1,
        li : 1,
        table : 1,
        tr : 1,
        td : 1,
        th : 1,
        embed : 1,
        object : 1,
        ol : 1,
        ul : 1,
        a : 1,
        input : 1,
        form : 1,
        select : 1,
        textarea : 1,
        button : 1,
        fieldset : 1,
        thead : 1,
        tfoot : 1
      };
      CKEDITOR.dom.selection.prototype = {
        getNative : function() {
          return this._.cache.nativeSel !== void 0 ? this._.cache.nativeSel : this._.cache.nativeSel = isMSSelection ? this.document.$.selection : this.document.getWindow().$.getSelection();
        },
        getType : isMSSelection ? function() {
          var cache = this._.cache;
          if (cache.type) {
            return cache.type;
          }
          var type = CKEDITOR.SELECTION_NONE;
          try {
            var sel = this.getNative();
            var ieType = sel.type;
            if (ieType == "Text") {
              type = CKEDITOR.SELECTION_TEXT;
            }
            if (ieType == "Control") {
              type = CKEDITOR.SELECTION_ELEMENT;
            }
            if (sel.createRange().parentElement()) {
              type = CKEDITOR.SELECTION_TEXT;
            }
          } catch (f) {
          }
          return cache.type = type;
        } : function() {
          var cache = this._.cache;
          if (cache.type) {
            return cache.type;
          }
          var type = CKEDITOR.SELECTION_TEXT;
          var range = this.getNative();
          if (!range || !range.rangeCount) {
            type = CKEDITOR.SELECTION_NONE;
          } else {
            if (range.rangeCount == 1) {
              range = range.getRangeAt(0);
              var startContainer = range.startContainer;
              if (startContainer == range.endContainer && (startContainer.nodeType == 1 && (range.endOffset - range.startOffset == 1 && styleObjectElements[startContainer.childNodes[range.startOffset].nodeName.toLowerCase()]))) {
                type = CKEDITOR.SELECTION_ELEMENT;
              }
            }
          }
          return cache.type = type;
        },
        getRanges : function() {
          var func = isMSSelection ? function() {
            function getNodeIndex(node) {
              return(new CKEDITOR.dom.node(node)).getIndex();
            }
            var getBoundaryInformation = function(range, recurring) {
              range = range.duplicate();
              range.collapse(recurring);
              var parent = range.parentElement();
              if (!parent.hasChildNodes()) {
                return{
                  container : parent,
                  offset : 0
                };
              }
              var siblings = parent.children;
              var child;
              var sibling;
              var testRange = range.duplicate();
              var low = 0;
              var high = siblings.length - 1;
              var index = -1;
              var position;
              var container;
              for (;low <= high;) {
                index = Math.floor((low + high) / 2);
                child = siblings[index];
                testRange.moveToElementText(child);
                position = testRange.compareEndPoints("StartToStart", range);
                if (position > 0) {
                  high = index - 1;
                } else {
                  if (position < 0) {
                    low = index + 1;
                  } else {
                    return{
                      container : parent,
                      offset : getNodeIndex(child)
                    };
                  }
                }
              }
              if (index == -1 || index == siblings.length - 1 && position < 0) {
                testRange.moveToElementText(parent);
                testRange.setEndPoint("StartToStart", range);
                testRange = testRange.text.replace(/(\r\n|\r)/g, "\n").length;
                siblings = parent.childNodes;
                if (!testRange) {
                  child = siblings[siblings.length - 1];
                  return child.nodeType != CKEDITOR.NODE_TEXT ? {
                    container : parent,
                    offset : siblings.length
                  } : {
                    container : child,
                    offset : child.nodeValue.length
                  };
                }
                parent = siblings.length;
                for (;testRange > 0 && parent > 0;) {
                  sibling = siblings[--parent];
                  if (sibling.nodeType == CKEDITOR.NODE_TEXT) {
                    container = sibling;
                    testRange = testRange - sibling.nodeValue.length;
                  }
                }
                return{
                  container : container,
                  offset : -testRange
                };
              }
              testRange.collapse(position > 0 ? true : false);
              testRange.setEndPoint(position > 0 ? "StartToStart" : "EndToStart", range);
              testRange = testRange.text.replace(/(\r\n|\r)/g, "\n").length;
              if (!testRange) {
                return{
                  container : parent,
                  offset : getNodeIndex(child) + (position > 0 ? 0 : 1)
                };
              }
              for (;testRange > 0;) {
                try {
                  sibling = child[position > 0 ? "previousSibling" : "nextSibling"];
                  if (sibling.nodeType == CKEDITOR.NODE_TEXT) {
                    testRange = testRange - sibling.nodeValue.length;
                    container = sibling;
                  }
                  child = sibling;
                } catch (n) {
                  return{
                    container : parent,
                    offset : getNodeIndex(child)
                  };
                }
              }
              return{
                container : container,
                offset : position > 0 ? -testRange : container.nodeValue.length + testRange
              };
            };
            return function() {
              var range = this.getNative();
              var nativeRange = range && range.createRange();
              var boundaryInfo = this.getType();
              if (!range) {
                return[];
              }
              if (boundaryInfo == CKEDITOR.SELECTION_TEXT) {
                range = new CKEDITOR.dom.range(this.root);
                boundaryInfo = getBoundaryInformation(nativeRange, true);
                range.setStart(new CKEDITOR.dom.node(boundaryInfo.container), boundaryInfo.offset);
                boundaryInfo = getBoundaryInformation(nativeRange);
                range.setEnd(new CKEDITOR.dom.node(boundaryInfo.container), boundaryInfo.offset);
                if (range.endContainer.getPosition(range.startContainer) & CKEDITOR.POSITION_PRECEDING) {
                  if (range.endOffset <= range.startContainer.getIndex()) {
                    range.collapse();
                  }
                }
                return[range];
              }
              if (boundaryInfo == CKEDITOR.SELECTION_ELEMENT) {
                boundaryInfo = [];
                var i = 0;
                for (;i < nativeRange.length;i++) {
                  var element = nativeRange.item(i);
                  var parentElement = element.parentNode;
                  var j = 0;
                  range = new CKEDITOR.dom.range(this.root);
                  for (;j < parentElement.childNodes.length && parentElement.childNodes[j] != element;j++) {
                  }
                  range.setStart(new CKEDITOR.dom.node(parentElement), j);
                  range.setEnd(new CKEDITOR.dom.node(parentElement), j + 1);
                  boundaryInfo.push(range);
                }
                return boundaryInfo;
              }
              return[];
            };
          }() : function() {
            var retval = [];
            var range;
            var sel = this.getNative();
            if (!sel) {
              return retval;
            }
            var i = 0;
            for (;i < sel.rangeCount;i++) {
              var nativeRange = sel.getRangeAt(i);
              range = new CKEDITOR.dom.range(this.root);
              range.setStart(new CKEDITOR.dom.node(nativeRange.startContainer), nativeRange.startOffset);
              range.setEnd(new CKEDITOR.dom.node(nativeRange.endContainer), nativeRange.endOffset);
              retval.push(range);
            }
            return retval;
          };
          return function(dataAndEvents) {
            var cache = this._.cache;
            var ranges = cache.ranges;
            if (!ranges) {
              cache.ranges = ranges = new CKEDITOR.dom.rangeList(func.call(this));
            }
            return!dataAndEvents ? ranges : applyInlineStyle(new CKEDITOR.dom.rangeList(ranges.slice()));
          };
        }(),
        getStartElement : function() {
          var cache = this._.cache;
          if (cache.startElement !== void 0) {
            return cache.startElement;
          }
          var node;
          switch(this.getType()) {
            case CKEDITOR.SELECTION_ELEMENT:
              return this.getSelectedElement();
            case CKEDITOR.SELECTION_TEXT:
              var range = this.getRanges()[0];
              if (range) {
                if (range.collapsed) {
                  node = range.startContainer;
                  if (node.type != CKEDITOR.NODE_ELEMENT) {
                    node = node.getParent();
                  }
                } else {
                  range.optimize();
                  for (;;) {
                    node = range.startContainer;
                    if (range.startOffset == (node.getChildCount ? node.getChildCount() : node.getLength()) && !node.isBlockBoundary()) {
                      range.setStartAfter(node);
                    } else {
                      break;
                    }
                  }
                  node = range.startContainer;
                  if (node.type != CKEDITOR.NODE_ELEMENT) {
                    return node.getParent();
                  }
                  node = node.getChild(range.startOffset);
                  if (!node || node.type != CKEDITOR.NODE_ELEMENT) {
                    node = range.startContainer;
                  } else {
                    range = node.getFirst();
                    for (;range && range.type == CKEDITOR.NODE_ELEMENT;) {
                      node = range;
                      range = range.getFirst();
                    }
                  }
                }
                node = node.$;
              }
            ;
          }
          return cache.startElement = node ? new CKEDITOR.dom.element(node) : null;
        },
        getSelectedElement : function() {
          var cache = this._.cache;
          if (cache.selectedElement !== void 0) {
            return cache.selectedElement;
          }
          var self = this;
          var node = CKEDITOR.tools.tryThese(function() {
            return self.getNative().createRange().item(0);
          }, function() {
            var range = self.getRanges()[0].clone();
            var enclosed;
            var selected;
            var f = 2;
            for (;f && (!(enclosed = range.getEnclosedNode()) || !(enclosed.type == CKEDITOR.NODE_ELEMENT && (styleObjectElements[enclosed.getName()] && (selected = enclosed))));f--) {
              range.shrink(CKEDITOR.SHRINK_ELEMENT);
            }
            return selected && selected.$;
          });
          return cache.selectedElement = node ? new CKEDITOR.dom.element(node) : null;
        },
        getSelectedText : function() {
          var cache = this._.cache;
          if (cache.selectedText !== void 0) {
            return cache.selectedText;
          }
          var nativeSel = this.getNative();
          nativeSel = isMSSelection ? nativeSel.type == "Control" ? "" : nativeSel.createRange().text : nativeSel.toString();
          return cache.selectedText = nativeSel;
        },
        lock : function() {
          this.getRanges();
          this.getStartElement();
          this.getSelectedElement();
          this.getSelectedText();
          this._.cache.nativeSel = null;
          this.isLocked = 1;
        },
        unlock : function(element) {
          if (this.isLocked) {
            if (element) {
              var selectedElement = this.getSelectedElement();
              var ranges = !selectedElement && this.getRanges();
              var faked = this.isFake;
            }
            this.isLocked = 0;
            this.reset();
            if (element) {
              if (element = selectedElement || ranges[0] && ranges[0].getCommonAncestor()) {
                if (element.getAscendant("body", 1)) {
                  if (faked) {
                    this.fake(selectedElement);
                  } else {
                    if (selectedElement) {
                      this.selectElement(selectedElement);
                    } else {
                      this.selectRanges(ranges);
                    }
                  }
                }
              }
            }
          }
        },
        reset : function() {
          this._.cache = {};
          this.isFake = 0;
          var editor = this.root.editor;
          if (editor && (editor._.fakeSelection && this.rev == editor._.fakeSelection.rev)) {
            delete editor._.fakeSelection;
            var hiddenEl = editor._.hiddenSelectionContainer;
            if (hiddenEl) {
              editor.fire("lockSnapshot");
              hiddenEl.remove();
              editor.fire("unlockSnapshot");
            }
            delete editor._.hiddenSelectionContainer;
          }
          this.rev = nextRev++;
        },
        selectElement : function(element) {
          var range = new CKEDITOR.dom.range(this.root);
          range.setStartBefore(element);
          range.setEndAfter(element);
          this.selectRanges([range]);
        },
        selectRanges : function(ranges) {
          var node = this.root.editor;
          node = node && node._.hiddenSelectionContainer;
          this.reset();
          if (node) {
            node = this.root;
            var el;
            var rangeIndex = 0;
            for (;rangeIndex < ranges.length;++rangeIndex) {
              el = ranges[rangeIndex];
              if (el.endContainer.equals(node)) {
                el.endOffset = Math.min(el.endOffset, node.getChildCount());
              }
            }
          }
          if (ranges.length) {
            if (this.isLocked) {
              var n = CKEDITOR.document.getActive();
              this.unlock();
              this.selectRanges(ranges);
              this.lock();
              if (!n.equals(this.root)) {
                n.focus();
              }
            } else {
              var range;
              a: {
                var optgroup;
                var between;
                if (ranges.length == 1 && (!(between = ranges[0]).collapsed && ((range = between.getEnclosedNode()) && range.type == CKEDITOR.NODE_ELEMENT))) {
                  between = between.clone();
                  between.shrink(CKEDITOR.SHRINK_ELEMENT, true);
                  if ((optgroup = between.getEnclosedNode()) && optgroup.type == CKEDITOR.NODE_ELEMENT) {
                    range = optgroup;
                  }
                  if (range.getAttribute("contenteditable") == "false") {
                    break a;
                  }
                }
                range = void 0;
              }
              if (range) {
                this.fake(range);
              } else {
                if (isMSSelection) {
                  between = CKEDITOR.dom.walker.whitespaces(true);
                  optgroup = /\ufeff|\u00a0/;
                  node = {
                    table : 1,
                    tbody : 1,
                    tr : 1
                  };
                  if (ranges.length > 1) {
                    range = ranges[ranges.length - 1];
                    ranges[0].setEnd(range.endContainer, range.endOffset);
                  }
                  range = ranges[0];
                  ranges = range.collapsed;
                  var element;
                  var r;
                  var i;
                  if ((el = range.getEnclosedNode()) && (el.type == CKEDITOR.NODE_ELEMENT && (el.getName() in styleObjectElements && (!el.is("a") || !el.getText())))) {
                    try {
                      i = el.$.createControlRange();
                      i.addElement(el.$);
                      i.select();
                      return;
                    } catch (o) {
                    }
                  }
                  if (range.startContainer.type == CKEDITOR.NODE_ELEMENT && range.startContainer.getName() in node || range.endContainer.type == CKEDITOR.NODE_ELEMENT && range.endContainer.getName() in node) {
                    range.shrink(CKEDITOR.NODE_ELEMENT, true);
                  }
                  i = range.createBookmark();
                  node = i.startNode;
                  if (!ranges) {
                    n = i.endNode;
                  }
                  i = range.document.$.body.createTextRange();
                  i.moveToElementText(node.$);
                  i.moveStart("character", 1);
                  if (n) {
                    optgroup = range.document.$.body.createTextRange();
                    optgroup.moveToElementText(n.$);
                    i.setEndPoint("EndToEnd", optgroup);
                    i.moveEnd("character", -1);
                  } else {
                    element = node.getNext(between);
                    r = node.hasAscendant("pre");
                    element = !(element && (element.getText && element.getText().match(optgroup))) && (r || (!node.hasPrevious() || node.getPrevious().is && node.getPrevious().is("br")));
                    r = range.document.createElement("span");
                    r.setHtml("&#65279;");
                    r.insertBefore(node);
                    if (element) {
                      range.document.createText("\ufeff").insertBefore(node);
                    }
                  }
                  range.setStartBefore(node);
                  node.remove();
                  if (ranges) {
                    if (element) {
                      i.moveStart("character", -1);
                      i.select();
                      range.document.$.selection.clear();
                    } else {
                      i.select();
                    }
                    range.moveToPosition(r, CKEDITOR.POSITION_BEFORE_START);
                    r.remove();
                  } else {
                    range.setEndBefore(n);
                    n.remove();
                    i.select();
                  }
                } else {
                  n = this.getNative();
                  if (!n) {
                    return;
                  }
                  this.removeAllRanges();
                  i = 0;
                  for (;i < ranges.length;i++) {
                    if (i < ranges.length - 1) {
                      element = ranges[i];
                      r = ranges[i + 1];
                      optgroup = element.clone();
                      optgroup.setStart(element.endContainer, element.endOffset);
                      optgroup.setEnd(r.startContainer, r.startOffset);
                      if (!optgroup.collapsed) {
                        optgroup.shrink(CKEDITOR.NODE_ELEMENT, true);
                        range = optgroup.getCommonAncestor();
                        optgroup = optgroup.getEnclosedNode();
                        if (range.isReadOnly() || optgroup && optgroup.isReadOnly()) {
                          r.setStart(element.startContainer, element.startOffset);
                          ranges.splice(i--, 1);
                          continue;
                        }
                      }
                    }
                    range = ranges[i];
                    r = this.document.$.createRange();
                    if (range.collapsed && (CKEDITOR.env.webkit && rangeRequiresFix(range))) {
                      element = this.root;
                      removeFillingChar(element, false);
                      optgroup = element.getDocument().createText("\u200b");
                      element.setCustomData("cke-fillingChar", optgroup);
                      range.insertNode(optgroup);
                      if ((element = optgroup.getNext()) && (!optgroup.getPrevious() && (element.type == CKEDITOR.NODE_ELEMENT && element.getName() == "br"))) {
                        removeFillingChar(this.root);
                        range.moveToPosition(element, CKEDITOR.POSITION_BEFORE_START);
                      } else {
                        range.moveToPosition(optgroup, CKEDITOR.POSITION_AFTER_END);
                      }
                    }
                    r.setStart(range.startContainer.$, range.startOffset);
                    try {
                      r.setEnd(range.endContainer.$, range.endOffset);
                    } catch (dstUri) {
                      if (dstUri.toString().indexOf("NS_ERROR_ILLEGAL_VALUE") >= 0) {
                        range.collapse(1);
                        r.setEnd(range.endContainer.$, range.endOffset);
                      } else {
                        throw dstUri;
                      }
                    }
                    n.addRange(r);
                  }
                }
                this.reset();
                this.root.fire("selectionchange");
              }
            }
          }
        },
        fake : function(element) {
          var editor = this.root.editor;
          this.reset();
          hideSelection(editor);
          var cache = this._.cache;
          var range = new CKEDITOR.dom.range(this.root);
          range.setStartBefore(element);
          range.setEndAfter(element);
          cache.ranges = new CKEDITOR.dom.rangeList(range);
          cache.selectedElement = cache.startElement = element;
          cache.type = CKEDITOR.SELECTION_ELEMENT;
          cache.selectedText = cache.nativeSel = null;
          this.isFake = 1;
          this.rev = nextRev++;
          editor._.fakeSelection = this;
          this.root.fire("selectionchange");
        },
        isHidden : function() {
          var el = this.getCommonAncestor();
          if (el) {
            if (el.type == CKEDITOR.NODE_TEXT) {
              el = el.getParent();
            }
          }
          return!(!el || !el.data("cke-hidden-sel"));
        },
        createBookmarks : function(dataAndEvents) {
          dataAndEvents = this.getRanges().createBookmarks(dataAndEvents);
          if (this.isFake) {
            dataAndEvents.isFake = 1;
          }
          return dataAndEvents;
        },
        createBookmarks2 : function(deepDataAndEvents) {
          deepDataAndEvents = this.getRanges().createBookmarks2(deepDataAndEvents);
          if (this.isFake) {
            deepDataAndEvents.isFake = 1;
          }
          return deepDataAndEvents;
        },
        selectBookmarks : function(bookmarks) {
          var ranges = [];
          var i = 0;
          for (;i < bookmarks.length;i++) {
            var range = new CKEDITOR.dom.range(this.root);
            range.moveToBookmark(bookmarks[i]);
            ranges.push(range);
          }
          if (bookmarks.isFake) {
            this.fake(ranges[0].getEnclosedNode());
          } else {
            this.selectRanges(ranges);
          }
          return this;
        },
        getCommonAncestor : function() {
          var ranges = this.getRanges();
          return!ranges.length ? null : ranges[0].startContainer.getCommonAncestor(ranges[ranges.length - 1].endContainer);
        },
        scrollIntoView : function() {
          if (this.type != CKEDITOR.SELECTION_NONE) {
            this.getRanges()[0].scrollIntoView();
          }
        },
        removeAllRanges : function() {
          if (this.getType() != CKEDITOR.SELECTION_NONE) {
            var nativ = this.getNative();
            try {
              if (nativ) {
                nativ[isMSSelection ? "empty" : "removeAllRanges"]();
              }
            } catch (b) {
            }
            this.reset();
          }
        }
      };
    })();
    "use strict";
    CKEDITOR.STYLE_BLOCK = 1;
    CKEDITOR.STYLE_INLINE = 2;
    CKEDITOR.STYLE_OBJECT = 3;
    (function() {
      function getUnstylableParent(element, root) {
        var unstylable;
        var d;
        for (;element = element.getParent();) {
          if (element.equals(root)) {
            break;
          }
          if (element.getAttribute("data-nostyle")) {
            unstylable = element;
          } else {
            if (!d) {
              var contentEditable = element.getAttribute("contentEditable");
              if (contentEditable == "false") {
                unstylable = element;
              } else {
                if (contentEditable == "true") {
                  d = 1;
                }
              }
            }
          }
        }
        return unstylable;
      }
      function applyInlineStyle(range) {
        var doc = range.document;
        if (range.collapsed) {
          doc = getElement(this, doc);
          range.insertNode(doc);
          range.moveToPosition(doc, CKEDITOR.POSITION_BEFORE_END);
        } else {
          var elementName = this.element;
          var def = this._.definition;
          var div;
          var name = def.ignoreReadonly;
          var settings = name || def.includeReadonly;
          if (settings == void 0) {
            settings = range.root.getCustomData("cke_includeReadonly");
          }
          var dtd = CKEDITOR.dtd[elementName];
          if (!dtd) {
            div = true;
            dtd = CKEDITOR.dtd.span;
          }
          range.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
          range.trim();
          var boundaryNodes = range.createBookmark();
          var firstNode = boundaryNodes.startNode;
          var lastNode = boundaryNodes.endNode;
          var currentNode = firstNode;
          var self;
          if (!name) {
            var root = range.getCommonAncestor();
            name = getUnstylableParent(firstNode, root);
            root = getUnstylableParent(lastNode, root);
            if (name) {
              currentNode = name.getNextSourceNode(true);
            }
            if (root) {
              lastNode = root;
            }
          }
          if (currentNode.getPosition(lastNode) == CKEDITOR.POSITION_FOLLOWING) {
            currentNode = 0;
          }
          for (;currentNode;) {
            name = false;
            if (currentNode.equals(lastNode)) {
              currentNode = null;
              name = true;
            } else {
              var parent = currentNode.type == CKEDITOR.NODE_ELEMENT ? currentNode.getName() : null;
              root = parent && currentNode.getAttribute("contentEditable") == "false";
              var node = parent && currentNode.getAttribute("data-nostyle");
              if (parent && currentNode.data("cke-bookmark")) {
                currentNode = currentNode.getNextSourceNode(true);
                continue;
              }
              if (root && (settings && CKEDITOR.dtd.$block[parent])) {
                var key = currentNode;
                var meta = findNestedEditables(key);
                var body = void 0;
                var cache = meta.length;
                var index = 0;
                key = cache && new CKEDITOR.dom.range(key.getDocument());
                for (;index < cache;++index) {
                  body = meta[index];
                  var engineTools = CKEDITOR.filter.instances[body.data("cke-filter")];
                  if (engineTools ? engineTools.check(this) : 1) {
                    key.selectNodeContents(body);
                    applyInlineStyle.call(this, key);
                  }
                }
              }
              meta = parent ? !dtd[parent] || node ? 0 : root && !settings ? 0 : (currentNode.getPosition(lastNode) | posPrecedingIdenticalContained) == posPrecedingIdenticalContained && (!def.childRule || def.childRule(currentNode)) : 1;
              if (meta) {
                if ((meta = currentNode.getParent()) && (((meta.getDtd() || CKEDITOR.dtd.span)[elementName] || div) && (!def.parentRule || def.parentRule(meta)))) {
                  if (!self && (!parent || (!CKEDITOR.dtd.$removeEmpty[parent] || (currentNode.getPosition(lastNode) | posPrecedingIdenticalContained) == posPrecedingIdenticalContained))) {
                    self = range.clone();
                    self.setStartBefore(currentNode);
                  }
                  parent = currentNode.type;
                  if (parent == CKEDITOR.NODE_TEXT || (root || parent == CKEDITOR.NODE_ELEMENT && !currentNode.getChildCount())) {
                    parent = currentNode;
                    var parentNode;
                    for (;(name = !parent.getNext(evaluator)) && ((parentNode = parent.getParent(), dtd[parentNode.getName()]) && ((parentNode.getPosition(firstNode) | posBitFlags) == posBitFlags && (!def.childRule || def.childRule(parentNode))));) {
                      parent = parentNode;
                    }
                    self.setEndAfter(parent);
                  }
                } else {
                  name = true;
                }
              } else {
                name = true;
              }
              currentNode = currentNode.getNextSourceNode(node || root);
            }
            if (name && (self && !self.collapsed)) {
              name = getElement(this, doc);
              root = name.hasAttributes();
              node = self.getCommonAncestor();
              parent = {};
              meta = {};
              body = {};
              cache = {};
              var k;
              var i;
              var child;
              for (;name && node;) {
                if (node.getName() == elementName) {
                  for (k in def.attributes) {
                    if (!cache[k] && (child = node.getAttribute(i))) {
                      if (name.getAttribute(k) == child) {
                        meta[k] = 1;
                      } else {
                        cache[k] = 1;
                      }
                    }
                  }
                  for (i in def.styles) {
                    if (!body[i] && (child = node.getStyle(i))) {
                      if (name.getStyle(i) == child) {
                        parent[i] = 1;
                      } else {
                        body[i] = 1;
                      }
                    }
                  }
                }
                node = node.getParent();
              }
              for (k in meta) {
                name.removeAttribute(k);
              }
              for (i in parent) {
                name.removeStyle(i);
              }
              if (root) {
                if (!name.hasAttributes()) {
                  name = null;
                }
              }
              if (name) {
                self.extractContents().appendTo(name);
                self.insertNode(name);
                removeFromInsideElement.call(this, name);
                name.mergeSiblings();
                if (!CKEDITOR.env.ie) {
                  name.$.normalize();
                }
              } else {
                name = new CKEDITOR.dom.element("span");
                self.extractContents().appendTo(name);
                self.insertNode(name);
                removeFromInsideElement.call(this, name);
                name.remove(true);
              }
              self = null;
            }
          }
          range.moveToBookmark(boundaryNodes);
          range.shrink(CKEDITOR.SHRINK_TEXT);
          range.shrink(CKEDITOR.NODE_ELEMENT, true);
        }
      }
      function removeInlineStyle(range) {
        function breakNodes() {
          var startPath = new CKEDITOR.dom.elementPath(node.getParent());
          var endPath = new CKEDITOR.dom.elementPath(endNode.getParent());
          var child = null;
          var breakEnd = null;
          var i = 0;
          for (;i < startPath.elements.length;i++) {
            var element = startPath.elements[i];
            if (element == startPath.block || element == startPath.blockLimit) {
              break;
            }
            if (matchesSelector.checkElementRemovable(element)) {
              child = element;
            }
          }
          i = 0;
          for (;i < endPath.elements.length;i++) {
            element = endPath.elements[i];
            if (element == endPath.block || element == endPath.blockLimit) {
              break;
            }
            if (matchesSelector.checkElementRemovable(element)) {
              breakEnd = element;
            }
          }
          if (breakEnd) {
            endNode.breakParent(breakEnd);
          }
          if (child) {
            node.breakParent(child);
          }
        }
        range.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
        var bookmark = range.createBookmark();
        var node = bookmark.startNode;
        if (range.collapsed) {
          var type = new CKEDITOR.dom.elementPath(node.getParent(), range.root);
          var current;
          var i = 0;
          var key;
          for (;i < type.elements.length && (key = type.elements[i]);i++) {
            if (key == type.block || key == type.blockLimit) {
              break;
            }
            if (this.checkElementRemovable(key)) {
              var start;
              if (range.collapsed && (range.checkBoundaryOfElement(key, CKEDITOR.END) || (start = range.checkBoundaryOfElement(key, CKEDITOR.START)))) {
                current = key;
                current.match = start ? "start" : "end";
              } else {
                key.mergeSiblings();
                if (key.is(this.element)) {
                  removeFromElement.call(this, key);
                } else {
                  removeOverrides(key, getOverrides(this)[key.getName()]);
                }
              }
            }
          }
          if (current) {
            key = node;
            i = 0;
            for (;;i++) {
              start = type.elements[i];
              if (start.equals(current)) {
                break;
              } else {
                if (start.match) {
                  continue;
                } else {
                  start = start.clone();
                }
              }
              start.append(key);
              key = start;
            }
            key[current.match == "start" ? "insertBefore" : "insertAfter"](current);
          }
        } else {
          var endNode = bookmark.endNode;
          var matchesSelector = this;
          breakNodes();
          type = node;
          for (;!type.equals(endNode);) {
            current = type.getNextSourceNode();
            if (type.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable(type)) {
              if (type.getName() == this.element) {
                removeFromElement.call(this, type);
              } else {
                removeOverrides(type, getOverrides(this)[type.getName()]);
              }
              if (current.type == CKEDITOR.NODE_ELEMENT && current.contains(node)) {
                breakNodes();
                current = node.getNext();
              }
            }
            type = current;
          }
        }
        range.moveToBookmark(bookmark);
        range.shrink(CKEDITOR.NODE_ELEMENT, true);
      }
      function findNestedEditables(container) {
        var excludes = [];
        container.forEach(function(el) {
          if (el.getAttribute("contenteditable") == "true") {
            excludes.push(el);
            return false;
          }
        }, CKEDITOR.NODE_ELEMENT, true);
        return excludes;
      }
      function applyObjectStyle(range) {
        var parent = range.getEnclosedNode() || range.getCommonAncestor(false, true);
        if (range = (new CKEDITOR.dom.elementPath(parent, range.root)).contains(this.element, 1)) {
          if (!range.isReadOnly()) {
            setupElement(range, this);
          }
        }
      }
      function removeObjectStyle(range) {
        var def = range.getCommonAncestor(true, true);
        if (range = (new CKEDITOR.dom.elementPath(def, range.root)).contains(this.element, 1)) {
          def = this._.definition;
          var attributes = def.attributes;
          if (attributes) {
            var att;
            for (att in attributes) {
              range.removeAttribute(att, attributes[att]);
            }
          }
          if (def.styles) {
            var i;
            for (i in def.styles) {
              if (def.styles.hasOwnProperty(i)) {
                range.removeStyle(i);
              }
            }
          }
        }
      }
      function applyBlockStyle(range) {
        var bookmark = range.createBookmark(true);
        var iterator = range.createIterator();
        iterator.enforceRealBlocks = true;
        if (this._.enterMode) {
          iterator.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
        }
        var block;
        var doc = range.document;
        var newBlock;
        for (;block = iterator.getNextParagraph();) {
          if (!block.isReadOnly() && (iterator.activeFilter ? iterator.activeFilter.check(this) : 1)) {
            newBlock = getElement(this, doc, block);
            toPre(block, newBlock);
          }
        }
        range.moveToBookmark(bookmark);
      }
      function removeBlockStyle(range) {
        var bookmark = range.createBookmark(1);
        var iterator = range.createIterator();
        iterator.enforceRealBlocks = true;
        iterator.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
        var key;
        var newBlock;
        for (;key = iterator.getNextParagraph();) {
          if (this.checkElementRemovable(key)) {
            if (key.is("pre")) {
              if (newBlock = this._.enterMode == CKEDITOR.ENTER_BR ? null : range.document.createElement(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div")) {
                key.copyAttributes(newBlock);
              }
              toPre(key, newBlock);
            } else {
              removeFromElement.call(this, key);
            }
          }
        }
        range.moveToBookmark(bookmark);
      }
      function toPre(block, newBlock) {
        var preBlock = !newBlock;
        if (preBlock) {
          newBlock = block.getDocument().createElement("div");
          block.copyAttributes(newBlock);
        }
        var statsTemplate = newBlock && newBlock.is("pre");
        var dom = block.is("pre");
        var html = !statsTemplate && dom;
        if (statsTemplate && !dom) {
          dom = newBlock;
          if (html = block.getBogus()) {
            html.remove();
          }
          html = block.getHtml();
          html = replace(html, /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, "");
          html = html.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, "$1");
          html = html.replace(/([ \t\n\r]+|&nbsp;)/g, " ");
          html = html.replace(/<br\b[^>]*>/gi, "\n");
          if (CKEDITOR.env.ie) {
            var div = block.getDocument().createElement("div");
            div.append(dom);
            dom.$.outerHTML = "<pre>" + html + "</pre>";
            dom.copyAttributes(div.getFirst());
            dom = div.getFirst().remove();
          } else {
            dom.setHtml(html);
          }
          newBlock = dom;
        } else {
          if (html) {
            newBlock = fromPres(preBlock ? [block.getHtml()] : splitIntoPres(block), newBlock);
          } else {
            block.moveChildren(newBlock);
          }
        }
        newBlock.replace(block);
        if (statsTemplate) {
          preBlock = newBlock;
          var previousBlock;
          if ((previousBlock = preBlock.getPrevious(nonWhitespaces)) && (previousBlock.type == CKEDITOR.NODE_ELEMENT && previousBlock.is("pre"))) {
            statsTemplate = replace(previousBlock.getHtml(), /\n$/, "") + "\n\n" + replace(preBlock.getHtml(), /^\n/, "");
            if (CKEDITOR.env.ie) {
              preBlock.$.outerHTML = "<pre>" + statsTemplate + "</pre>";
            } else {
              preBlock.setHtml(statsTemplate);
            }
            previousBlock.remove();
          }
        } else {
          if (preBlock) {
            removeNoAttribsElement(newBlock);
          }
        }
      }
      function splitIntoPres(preBlock) {
        preBlock.getName();
        var assigns = [];
        replace(preBlock.getOuterHtml(), /(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi, function(dataAndEvents, otag, ctag) {
          return otag + "</pre>" + ctag + "<pre>";
        }).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi, function(dataAndEvents, vvar) {
          assigns.push(vvar);
        });
        return assigns;
      }
      function replace(text, regexp, replacement) {
        var headBookmark = "";
        var tailBookmark = "";
        text = text.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi, function(dataAndEvents, m1, m2) {
          if (m1) {
            headBookmark = m1;
          }
          if (m2) {
            tailBookmark = m2;
          }
          return "";
        });
        return headBookmark + text.replace(regexp, replacement) + tailBookmark;
      }
      function fromPres(resultItems, newBlock) {
        var h;
        if (resultItems.length > 1) {
          h = new CKEDITOR.dom.documentFragment(newBlock.getDocument());
        }
        var i = 0;
        for (;i < resultItems.length;i++) {
          var result = resultItems[i];
          result = result.replace(/(\r\n|\r)/g, "\n");
          result = replace(result, /^[ \t]*\n/, "");
          result = replace(result, /\n$/, "");
          result = replace(result, /^[ \t]+|[ \t]+$/g, function(newlines, dataAndEvents) {
            return newlines.length == 1 ? "&nbsp;" : dataAndEvents ? " " + CKEDITOR.tools.repeat("&nbsp;", newlines.length - 1) : CKEDITOR.tools.repeat("&nbsp;", newlines.length - 1) + " ";
          });
          result = result.replace(/\n/g, "<br>");
          result = result.replace(/[ \t]{2,}/g, function(newlines) {
            return CKEDITOR.tools.repeat("&nbsp;", newlines.length - 1) + " ";
          });
          if (h) {
            var results = newBlock.clone();
            results.setHtml(result);
            h.append(results);
          } else {
            newBlock.setHtml(result);
          }
        }
        return h || newBlock;
      }
      function removeFromElement(element, style) {
        var styles = this._.definition;
        var attributes = styles.attributes;
        styles = styles.styles;
        var overrides = getOverrides(this)[element.getName()];
        var removeEmpty = CKEDITOR.tools.isEmpty(attributes) && CKEDITOR.tools.isEmpty(styles);
        var attName;
        for (attName in attributes) {
          if (!((attName == "class" || this._.definition.fullMatch) && element.getAttribute(attName) != normalizeProperty(attName, attributes[attName])) && !(style && attName.slice(0, 5) == "data-")) {
            removeEmpty = element.hasAttribute(attName);
            element.removeAttribute(attName);
          }
        }
        var styleName;
        for (styleName in styles) {
          if (!(this._.definition.fullMatch && element.getStyle(styleName) != normalizeProperty(styleName, styles[styleName], true))) {
            removeEmpty = removeEmpty || !!element.getStyle(styleName);
            element.removeStyle(styleName);
          }
        }
        removeOverrides(element, overrides, blockElements[element.getName()]);
        if (removeEmpty) {
          if (this._.definition.alwaysRemoveElement) {
            removeNoAttribsElement(element, 1);
          } else {
            if (!CKEDITOR.dtd.$block[element.getName()] || this._.enterMode == CKEDITOR.ENTER_BR && !element.hasAttributes()) {
              removeNoAttribsElement(element);
            } else {
              element.renameNode(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div");
            }
          }
        }
      }
      function removeFromInsideElement(element) {
        var overrides = getOverrides(this);
        var innerElements = element.getElementsByTag(this.element);
        var key;
        var i = innerElements.count();
        for (;--i >= 0;) {
          key = innerElements.getItem(i);
          if (!key.isReadOnly()) {
            removeFromElement.call(this, key, true);
          }
        }
        var overrideElement;
        for (overrideElement in overrides) {
          if (overrideElement != this.element) {
            innerElements = element.getElementsByTag(overrideElement);
            i = innerElements.count() - 1;
            for (;i >= 0;i--) {
              key = innerElements.getItem(i);
              if (!key.isReadOnly()) {
                removeOverrides(key, overrides[overrideElement]);
              }
            }
          }
        }
      }
      function removeOverrides(element, overrides, dontRemove) {
        if (overrides = overrides && overrides.attributes) {
          var i = 0;
          for (;i < overrides.length;i++) {
            var attName = overrides[i][0];
            var actualAttrValue;
            if (actualAttrValue = element.getAttribute(attName)) {
              var attValue = overrides[i][1];
              if (attValue === null || (attValue.test && attValue.test(actualAttrValue) || typeof attValue == "string" && actualAttrValue == attValue)) {
                element.removeAttribute(attName);
              }
            }
          }
        }
        if (!dontRemove) {
          removeNoAttribsElement(element);
        }
      }
      function removeNoAttribsElement(element, dataAndEvents) {
        if (!element.hasAttributes() || dataAndEvents) {
          if (CKEDITOR.dtd.$block[element.getName()]) {
            var next = element.getPrevious(nonWhitespaces);
            var node = element.getNext(nonWhitespaces);
            if (next) {
              if (next.type == CKEDITOR.NODE_TEXT || !next.isBlockBoundary({
                br : 1
              })) {
                element.append("br", 1);
              }
            }
            if (node) {
              if (node.type == CKEDITOR.NODE_TEXT || !node.isBlockBoundary({
                br : 1
              })) {
                element.append("br");
              }
            }
            element.remove(true);
          } else {
            next = element.getFirst();
            node = element.getLast();
            element.remove(true);
            if (next) {
              if (next.type == CKEDITOR.NODE_ELEMENT) {
                next.mergeSiblings();
              }
              if (node) {
                if (!next.equals(node) && node.type == CKEDITOR.NODE_ELEMENT) {
                  node.mergeSiblings();
                }
              }
            }
          }
        }
      }
      function getElement(style, targetDocument, element) {
        var el;
        el = style.element;
        if (el == "*") {
          el = "span";
        }
        el = new CKEDITOR.dom.element(el, targetDocument);
        if (element) {
          element.copyAttributes(el);
        }
        el = setupElement(el, style);
        if (targetDocument.getCustomData("doc_processing_style") && el.hasAttribute("id")) {
          el.removeAttribute("id");
        } else {
          targetDocument.setCustomData("doc_processing_style", 1);
        }
        return el;
      }
      function setupElement(el, style) {
        var styleDefinition = style._.definition;
        var attrs = styleDefinition.attributes;
        styleDefinition = CKEDITOR.style.getStyleText(styleDefinition);
        if (attrs) {
          var attr;
          for (attr in attrs) {
            el.setAttribute(attr, attrs[attr]);
          }
        }
        if (styleDefinition) {
          el.setAttribute("style", styleDefinition);
        }
        return el;
      }
      function replaceVariables(map, buf) {
        var letter;
        for (letter in map) {
          map[letter] = map[letter].replace(rreturn, function(dataAndEvents, off) {
            return buf[off];
          });
        }
      }
      function getOverrides(style) {
        if (style._.overrides) {
          return style._.overrides;
        }
        var overrides = style._.overrides = {};
        var definition = style._.definition.overrides;
        if (definition) {
          if (!CKEDITOR.tools.isArray(definition)) {
            definition = [definition];
          }
          var i = 0;
          for (;i < definition.length;i++) {
            var override = definition[i];
            var elementName;
            var attrs;
            if (typeof override == "string") {
              elementName = override.toLowerCase();
            } else {
              elementName = override.element ? override.element.toLowerCase() : style.element;
              attrs = override.attributes;
            }
            override = overrides[elementName] || (overrides[elementName] = {});
            if (attrs) {
              override = override.attributes = override.attributes || [];
              var attr;
              for (attr in attrs) {
                override.push([attr.toLowerCase(), attrs[attr]]);
              }
            }
          }
        }
        return overrides;
      }
      function normalizeProperty(name, value, isStyle) {
        var temp = new CKEDITOR.dom.element("span");
        temp[isStyle ? "setStyle" : "setAttribute"](name, value);
        return temp[isStyle ? "getStyle" : "getAttribute"](name);
      }
      function applyStyleOnSelection(selection, remove, hash) {
        var doc = selection.document;
        var ranges = selection.getRanges();
        remove = remove ? this.removeFromRange : this.applyToRange;
        var key;
        var iterator = ranges.createIterator();
        for (;key = iterator.getNextRange();) {
          remove.call(this, key, hash);
        }
        selection.selectRanges(ranges);
        doc.removeCustomData("doc_processing_style");
      }
      var blockElements = {
        address : 1,
        div : 1,
        h1 : 1,
        h2 : 1,
        h3 : 1,
        h4 : 1,
        h5 : 1,
        h6 : 1,
        p : 1,
        pre : 1,
        section : 1,
        header : 1,
        footer : 1,
        nav : 1,
        article : 1,
        aside : 1,
        figure : 1,
        dialog : 1,
        hgroup : 1,
        time : 1,
        meter : 1,
        menu : 1,
        command : 1,
        keygen : 1,
        output : 1,
        progress : 1,
        details : 1,
        datagrid : 1,
        datalist : 1
      };
      var objectElements = {
        a : 1,
        embed : 1,
        hr : 1,
        img : 1,
        li : 1,
        object : 1,
        ol : 1,
        table : 1,
        td : 1,
        tr : 1,
        th : 1,
        ul : 1,
        dl : 1,
        dt : 1,
        dd : 1,
        form : 1,
        audio : 1,
        video : 1
      };
      var r20 = /\s*(?:;\s*|$)/;
      var rreturn = /#\((.+?)\)/g;
      var evaluator = CKEDITOR.dom.walker.bookmark(0, 1);
      var nonWhitespaces = CKEDITOR.dom.walker.whitespaces(1);
      CKEDITOR.style = function(name, keepData) {
        if (typeof name.type == "string") {
          return new CKEDITOR.style.customHandlers[name.type](name);
        }
        var element = name.attributes;
        if (element && element.style) {
          name.styles = CKEDITOR.tools.extend({}, name.styles, CKEDITOR.tools.parseCssText(element.style));
          delete element.style;
        }
        if (keepData) {
          name = CKEDITOR.tools.clone(name);
          replaceVariables(name.attributes, keepData);
          replaceVariables(name.styles, keepData);
        }
        element = this.element = name.element ? typeof name.element == "string" ? name.element.toLowerCase() : name.element : "*";
        this.type = name.type || (blockElements[element] ? CKEDITOR.STYLE_BLOCK : objectElements[element] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE);
        if (typeof this.element == "object") {
          this.type = CKEDITOR.STYLE_OBJECT;
        }
        this._ = {
          definition : name
        };
      };
      CKEDITOR.style.prototype = {
        apply : function(name) {
          if (name instanceof CKEDITOR.dom.document) {
            return applyStyleOnSelection.call(this, name.getSelection());
          }
          if (this.checkApplicable(name.elementPath(), name)) {
            var editor = this._.enterMode;
            if (!editor) {
              this._.enterMode = name.activeEnterMode;
            }
            applyStyleOnSelection.call(this, name.getSelection(), 0, name);
            this._.enterMode = editor;
          }
        },
        remove : function(name) {
          if (name instanceof CKEDITOR.dom.document) {
            return applyStyleOnSelection.call(this, name.getSelection(), 1);
          }
          if (this.checkApplicable(name.elementPath(), name)) {
            var editor = this._.enterMode;
            if (!editor) {
              this._.enterMode = name.activeEnterMode;
            }
            applyStyleOnSelection.call(this, name.getSelection(), 1, name);
            this._.enterMode = editor;
          }
        },
        applyToRange : function(ieRange) {
          this.applyToRange = this.type == CKEDITOR.STYLE_INLINE ? applyInlineStyle : this.type == CKEDITOR.STYLE_BLOCK ? applyBlockStyle : this.type == CKEDITOR.STYLE_OBJECT ? applyObjectStyle : null;
          return this.applyToRange(ieRange);
        },
        removeFromRange : function(ieRange) {
          this.removeFromRange = this.type == CKEDITOR.STYLE_INLINE ? removeInlineStyle : this.type == CKEDITOR.STYLE_BLOCK ? removeBlockStyle : this.type == CKEDITOR.STYLE_OBJECT ? removeObjectStyle : null;
          return this.removeFromRange(ieRange);
        },
        applyToObject : function(element) {
          setupElement(element, this);
        },
        checkActive : function(elementPath, protoProps) {
          switch(this.type) {
            case CKEDITOR.STYLE_BLOCK:
              return this.checkElementRemovable(elementPath.block || elementPath.blockLimit, true, protoProps);
            case CKEDITOR.STYLE_OBJECT:
            ;
            case CKEDITOR.STYLE_INLINE:
              var elements = elementPath.elements;
              var i = 0;
              var element;
              for (;i < elements.length;i++) {
                element = elements[i];
                if (!(this.type == CKEDITOR.STYLE_INLINE && (element == elementPath.block || element == elementPath.blockLimit))) {
                  if (this.type == CKEDITOR.STYLE_OBJECT) {
                    var name = element.getName();
                    if (!(typeof this.element == "string" ? name == this.element : name in this.element)) {
                      continue;
                    }
                  }
                  if (this.checkElementRemovable(element, true, protoProps)) {
                    return true;
                  }
                }
              }
            ;
          }
          return false;
        },
        checkApplicable : function(elementPath, keepData, filter) {
          if (keepData) {
            if (keepData instanceof CKEDITOR.filter) {
              filter = keepData;
            }
          }
          if (filter && !filter.check(this)) {
            return false;
          }
          switch(this.type) {
            case CKEDITOR.STYLE_OBJECT:
              return!!elementPath.contains(this.element);
            case CKEDITOR.STYLE_BLOCK:
              return!!elementPath.blockLimit.getDtd()[this.element];
          }
          return true;
        },
        checkElementMatch : function(element, deepDataAndEvents) {
          var def = this._.definition;
          if (!element || !def.ignoreReadonly && element.isReadOnly()) {
            return false;
          }
          var name = element.getName();
          if (typeof this.element == "string" ? name == this.element : name in this.element) {
            if (!deepDataAndEvents && !element.hasAttributes()) {
              return true;
            }
            if (name = def._AC) {
              def = name;
            } else {
              name = {};
              var target = 0;
              var iterable = def.attributes;
              if (iterable) {
                var key;
                for (key in iterable) {
                  target++;
                  name[key] = iterable[key];
                }
              }
              if (key = CKEDITOR.style.getStyleText(def)) {
                if (!name.style) {
                  target++;
                }
                name.style = key;
              }
              name._length = target;
              def = def._AC = name;
            }
            if (def._length) {
              var i;
              for (i in def) {
                if (i != "_length") {
                  target = element.getAttribute(i) || "";
                  if (i == "style") {
                    a: {
                      name = def[i];
                      if (typeof name == "string") {
                        name = CKEDITOR.tools.parseCssText(name);
                      }
                      if (typeof target == "string") {
                        target = CKEDITOR.tools.parseCssText(target, true);
                      }
                      key = void 0;
                      for (key in name) {
                        if (!(key in target && (target[key] == name[key] || (name[key] == "inherit" || target[key] == "inherit")))) {
                          name = false;
                          break a;
                        }
                      }
                      name = true;
                    }
                  } else {
                    name = def[i] == target;
                  }
                  if (name) {
                    if (!deepDataAndEvents) {
                      return true;
                    }
                  } else {
                    if (deepDataAndEvents) {
                      return false;
                    }
                  }
                }
              }
              if (deepDataAndEvents) {
                return true;
              }
            } else {
              return true;
            }
          }
          return false;
        },
        checkElementRemovable : function(element, deepDataAndEvents, attr) {
          if (this.checkElementMatch(element, deepDataAndEvents, attr)) {
            return true;
          }
          if (deepDataAndEvents = getOverrides(this)[element.getName()]) {
            var type;
            if (!(deepDataAndEvents = deepDataAndEvents.attributes)) {
              return true;
            }
            attr = 0;
            for (;attr < deepDataAndEvents.length;attr++) {
              type = deepDataAndEvents[attr][0];
              if (type = element.getAttribute(type)) {
                var exclude = deepDataAndEvents[attr][1];
                if (exclude === null || (typeof exclude == "string" && type == exclude || exclude.test(type))) {
                  return true;
                }
              }
            }
          }
          return false;
        },
        buildPreview : function(label) {
          var styleDefinition = this._.definition;
          var html = [];
          var elementName = styleDefinition.element;
          if (elementName == "bdo") {
            elementName = "span";
          }
          html = ["<", elementName];
          var attribs = styleDefinition.attributes;
          if (attribs) {
            var att;
            for (att in attribs) {
              html.push(" ", att, '="', attribs[att], '"');
            }
          }
          if (attribs = CKEDITOR.style.getStyleText(styleDefinition)) {
            html.push(' style="', attribs, '"');
          }
          html.push(">", label || styleDefinition.name, "</", elementName, ">");
          return html.join("");
        },
        getDefinition : function() {
          return this._.definition;
        }
      };
      CKEDITOR.style.getStyleText = function(styleDefinition) {
        var stylesDef = styleDefinition._ST;
        if (stylesDef) {
          return stylesDef;
        }
        stylesDef = styleDefinition.styles;
        var prefix = styleDefinition.attributes && styleDefinition.attributes.style || "";
        var f = "";
        if (prefix.length) {
          prefix = prefix.replace(r20, ";");
        }
        var style;
        for (style in stylesDef) {
          var styleVal = stylesDef[style];
          var s = (style + ":" + styleVal).replace(r20, ";");
          if (styleVal == "inherit") {
            f = f + s;
          } else {
            prefix = prefix + s;
          }
        }
        if (prefix.length) {
          prefix = CKEDITOR.tools.normalizeCssText(prefix, true);
        }
        return styleDefinition._ST = prefix + f;
      };
      CKEDITOR.style.customHandlers = {};
      CKEDITOR.style.addCustomHandler = function(prototype) {
        var expand = function(name) {
          this._ = {
            definition : name
          };
          if (this.setup) {
            this.setup(name);
          }
        };
        expand.prototype = CKEDITOR.tools.extend(CKEDITOR.tools.prototypedCopy(CKEDITOR.style.prototype), {
          assignedTo : CKEDITOR.STYLE_OBJECT
        }, prototype, true);
        return this.customHandlers[prototype.type] = expand;
      };
      var posPrecedingIdenticalContained = CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED;
      var posBitFlags = CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED;
    })();
    CKEDITOR.styleCommand = function(style, ext) {
      this.requiredContent = this.allowedContent = this.style = style;
      CKEDITOR.tools.extend(this, ext, true);
    };
    CKEDITOR.styleCommand.prototype.exec = function(editor) {
      editor.focus();
      if (this.state == CKEDITOR.TRISTATE_OFF) {
        editor.applyStyle(this.style);
      } else {
        if (this.state == CKEDITOR.TRISTATE_ON) {
          editor.removeStyle(this.style);
        }
      }
    };
    CKEDITOR.stylesSet = new CKEDITOR.resourceManager("", "stylesSet");
    CKEDITOR.addStylesSet = CKEDITOR.tools.bind(CKEDITOR.stylesSet.add, CKEDITOR.stylesSet);
    CKEDITOR.loadStylesSet = function(name, deepDataAndEvents, callback) {
      CKEDITOR.stylesSet.addExternal(name, deepDataAndEvents, "");
      CKEDITOR.stylesSet.load(name, callback);
    };
    CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
      attachStyleStateChange : function(style, callback) {
        var styleStateChangeCallbacks = this._.styleStateChangeCallbacks;
        if (!styleStateChangeCallbacks) {
          styleStateChangeCallbacks = this._.styleStateChangeCallbacks = [];
          this.on("selectionChange", function(evt) {
            var i = 0;
            for (;i < styleStateChangeCallbacks.length;i++) {
              var callback = styleStateChangeCallbacks[i];
              var key = callback.style.checkActive(evt.data.path, this) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
              callback.fn.call(this, key);
            }
          });
        }
        styleStateChangeCallbacks.push({
          style : style,
          fn : callback
        });
      },
      applyStyle : function(matcherFunction) {
        matcherFunction.apply(this);
      },
      removeStyle : function(name) {
        name.remove(this);
      },
      getStylesSet : function(callback) {
        if (this._.stylesDefinitions) {
          callback(this._.stylesDefinitions);
        } else {
          var editor = this;
          var val = editor.config.stylesCombo_stylesSet || editor.config.stylesSet;
          if (val === false) {
            callback(null);
          } else {
            if (val instanceof Array) {
              editor._.stylesDefinitions = val;
              callback(val);
            } else {
              if (!val) {
                val = "default";
              }
              val = val.split(":");
              var name = val[0];
              CKEDITOR.stylesSet.addExternal(name, val[1] ? val.slice(1).join(":") : CKEDITOR.getUrl("styles.js"), "");
              CKEDITOR.stylesSet.load(name, function(old) {
                editor._.stylesDefinitions = old[name];
                callback(editor._.stylesDefinitions);
              });
            }
          }
        }
      }
    });
    CKEDITOR.dom.comment = function(key, ownerDocument) {
      if (typeof key == "string") {
        key = (ownerDocument ? ownerDocument.$ : document).createComment(key);
      }
      CKEDITOR.dom.domObject.call(this, key);
    };
    CKEDITOR.dom.comment.prototype = new CKEDITOR.dom.node;
    CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype, {
      type : CKEDITOR.NODE_COMMENT,
      getOuterHtml : function() {
        return "\x3c!--" + this.$.nodeValue + "--\x3e";
      }
    });
    "use strict";
    (function() {
      var result = {};
      var tagMap = {};
      var tag;
      for (tag in CKEDITOR.dtd.$blockLimit) {
        if (!(tag in CKEDITOR.dtd.$list)) {
          result[tag] = 1;
        }
      }
      for (tag in CKEDITOR.dtd.$block) {
        if (!(tag in CKEDITOR.dtd.$blockLimit)) {
          if (!(tag in CKEDITOR.dtd.$empty)) {
            tagMap[tag] = 1;
          }
        }
      }
      CKEDITOR.dom.elementPath = function(name, keepData) {
        var openElement = null;
        var handlers = null;
        var elements = [];
        var element = name;
        var value;
        keepData = keepData || name.getDocument().getBody();
        do {
          if (element.type == CKEDITOR.NODE_ELEMENT) {
            elements.push(element);
            if (!this.lastElement) {
              this.lastElement = element;
              if (element.is(CKEDITOR.dtd.$object) || element.getAttribute("contenteditable") == "false") {
                continue;
              }
            }
            if (element.equals(keepData)) {
              break;
            }
            if (!handlers) {
              value = element.getName();
              if (element.getAttribute("contenteditable") == "true") {
                handlers = element;
              } else {
                if (!openElement) {
                  if (tagMap[value]) {
                    openElement = element;
                  }
                }
              }
              if (result[value]) {
                var i;
                if (i = !openElement) {
                  if (value = value == "div") {
                    a: {
                      value = element.getChildren();
                      i = 0;
                      var padLength = value.count();
                      for (;i < padLength;i++) {
                        var child = value.getItem(i);
                        if (child.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$block[child.getName()]) {
                          value = true;
                          break a;
                        }
                      }
                      value = false;
                    }
                    value = !value;
                  }
                  i = value;
                }
                if (i) {
                  openElement = element;
                } else {
                  handlers = element;
                }
              }
            }
          }
        } while (element = element.getParent());
        if (!handlers) {
          handlers = keepData;
        }
        this.block = openElement;
        this.blockLimit = handlers;
        this.root = keepData;
        this.elements = elements;
      };
    })();
    CKEDITOR.dom.elementPath.prototype = {
      compare : function(data) {
        var thisElements = this.elements;
        data = data && data.elements;
        if (!data || thisElements.length != data.length) {
          return false;
        }
        var i = 0;
        for (;i < thisElements.length;i++) {
          if (!thisElements[i].equals(data[i])) {
            return false;
          }
        }
        return true;
      },
      contains : function(name, recurring, dataAndEvents) {
        var evaluator;
        if (typeof name == "string") {
          evaluator = function(node) {
            return node.getName() == name;
          };
        }
        if (name instanceof CKEDITOR.dom.element) {
          evaluator = function(node) {
            return node.equals(name);
          };
        } else {
          if (CKEDITOR.tools.isArray(name)) {
            evaluator = function(node) {
              return CKEDITOR.tools.indexOf(name, node.getName()) > -1;
            };
          } else {
            if (typeof name == "function") {
              evaluator = name;
            } else {
              if (typeof name == "object") {
                evaluator = function(node) {
                  return node.getName() in name;
                };
              }
            }
          }
        }
        var optgroup = this.elements;
        var cnl = optgroup.length;
        if (recurring) {
          cnl--;
        }
        if (dataAndEvents) {
          optgroup = Array.prototype.slice.call(optgroup, 0);
          optgroup.reverse();
        }
        recurring = 0;
        for (;recurring < cnl;recurring++) {
          if (evaluator(optgroup[recurring])) {
            return optgroup[recurring];
          }
        }
        return null;
      },
      isContextFor : function(tag) {
        var context;
        if (tag in CKEDITOR.dtd.$block) {
          context = this.contains(CKEDITOR.dtd.$intermediate) || (this.root.equals(this.block) && this.block || this.blockLimit);
          return!!context.getDtd()[tag];
        }
        return true;
      },
      direction : function() {
        return(this.block || (this.blockLimit || this.root)).getDirection(1);
      }
    };
    CKEDITOR.dom.text = function(name, keepData) {
      if (typeof name == "string") {
        name = (keepData ? keepData.$ : document).createTextNode(name);
      }
      this.$ = name;
    };
    CKEDITOR.dom.text.prototype = new CKEDITOR.dom.node;
    CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype, {
      type : CKEDITOR.NODE_TEXT,
      getLength : function() {
        return this.$.nodeValue.length;
      },
      getText : function() {
        return this.$.nodeValue;
      },
      setText : function(text) {
        this.$.nodeValue = text;
      },
      split : function(a) {
        var parent = this.$.parentNode;
        var numberOfChannels = parent.childNodes.length;
        var b = this.getLength();
        var doc = this.getDocument();
        var node = new CKEDITOR.dom.text(this.$.splitText(a), doc);
        if (parent.childNodes.length == numberOfChannels) {
          if (a >= b) {
            node = doc.createText("");
            node.insertAfter(this);
          } else {
            a = doc.createText("");
            a.insertAfter(node);
            a.remove();
          }
        }
        return node;
      },
      substring : function(recurring, end) {
        return typeof end != "number" ? this.$.nodeValue.substr(recurring) : this.$.nodeValue.substring(recurring, end);
      }
    });
    (function() {
      function updateDirtyRange(bookmark, dirtyRange, checkEnd) {
        var serializable = bookmark.serializable;
        var container = dirtyRange[checkEnd ? "endContainer" : "startContainer"];
        var offset = checkEnd ? "endOffset" : "startOffset";
        var bookmarkStart = serializable ? dirtyRange.document.getById(bookmark.startNode) : bookmark.startNode;
        bookmark = serializable ? dirtyRange.document.getById(bookmark.endNode) : bookmark.endNode;
        if (container.equals(bookmarkStart.getPrevious())) {
          dirtyRange.startOffset = dirtyRange.startOffset - container.getLength() - bookmark.getPrevious().getLength();
          container = bookmark.getNext();
        } else {
          if (container.equals(bookmark.getPrevious())) {
            dirtyRange.startOffset = dirtyRange.startOffset - container.getLength();
            container = bookmark.getNext();
          }
        }
        if (container.equals(bookmarkStart.getParent())) {
          dirtyRange[offset]++;
        }
        if (container.equals(bookmark.getParent())) {
          dirtyRange[offset]++;
        }
        dirtyRange[checkEnd ? "endContainer" : "startContainer"] = container;
        return dirtyRange;
      }
      CKEDITOR.dom.rangeList = function(ranges) {
        if (ranges instanceof CKEDITOR.dom.rangeList) {
          return ranges;
        }
        if (ranges) {
          if (ranges instanceof CKEDITOR.dom.range) {
            ranges = [ranges];
          }
        } else {
          ranges = [];
        }
        return CKEDITOR.tools.extend(ranges, mixins);
      };
      var mixins = {
        createIterator : function() {
          var rangeList = this;
          var bookmark = CKEDITOR.dom.walker.bookmark();
          var bookmarks = [];
          var current;
          return{
            getNextRange : function(mergeConsequent) {
              current = current == void 0 ? 0 : current + 1;
              var range = rangeList[current];
              if (range && rangeList.length > 1) {
                if (!current) {
                  var next = rangeList.length - 1;
                  for (;next >= 0;next--) {
                    bookmarks.unshift(rangeList[next].createBookmark(true));
                  }
                }
                if (mergeConsequent) {
                  var mergeCount = 0;
                  for (;rangeList[current + mergeCount + 1];) {
                    var doc = range.document;
                    mergeConsequent = 0;
                    next = doc.getById(bookmarks[mergeCount].endNode);
                    doc = doc.getById(bookmarks[mergeCount + 1].startNode);
                    for (;;) {
                      next = next.getNextSourceNode(false);
                      if (doc.equals(next)) {
                        mergeConsequent = 1;
                      } else {
                        if (bookmark(next) || next.type == CKEDITOR.NODE_ELEMENT && next.isBlockBoundary()) {
                          continue;
                        }
                      }
                      break;
                    }
                    if (!mergeConsequent) {
                      break;
                    }
                    mergeCount++;
                  }
                }
                range.moveToBookmark(bookmarks.shift());
                for (;mergeCount--;) {
                  next = rangeList[++current];
                  next.moveToBookmark(bookmarks.shift());
                  range.setEnd(next.endContainer, next.endOffset);
                }
              }
              return range;
            }
          };
        },
        createBookmarks : function(dataAndEvents) {
          var retval = [];
          var bookmark;
          var i = 0;
          for (;i < this.length;i++) {
            retval.push(bookmark = this[i].createBookmark(dataAndEvents, true));
            var j = i + 1;
            for (;j < this.length;j++) {
              this[j] = updateDirtyRange(bookmark, this[j]);
              this[j] = updateDirtyRange(bookmark, this[j], true);
            }
          }
          return retval;
        },
        createBookmarks2 : function(deepDataAndEvents) {
          var bookmarks = [];
          var i = 0;
          for (;i < this.length;i++) {
            bookmarks.push(this[i].createBookmark2(deepDataAndEvents));
          }
          return bookmarks;
        },
        moveToBookmarks : function(bookmarks) {
          var i = 0;
          for (;i < this.length;i++) {
            this[i].moveToBookmark(bookmarks[i]);
          }
        }
      };
    })();
    (function() {
      function getConfigPath() {
        return CKEDITOR.getUrl(CKEDITOR.skinName.split(",")[1] || "skins/" + CKEDITOR.skinName.split(",")[0] + "/");
      }
      function getCssPath(part) {
        var uas = CKEDITOR.skin["ua_" + part];
        var env = CKEDITOR.env;
        if (uas) {
          uas = uas.split(",").sort(function(a, b) {
            return a > b ? -1 : 1;
          });
          var i = 0;
          var ua;
          for (;i < uas.length;i++) {
            ua = uas[i];
            if (env.ie && (ua.replace(/^ie/, "") == env.version || env.quirks && ua == "iequirks")) {
              ua = "ie";
            }
            if (env[ua]) {
              part = part + ("_" + uas[i]);
              break;
            }
          }
        }
        return CKEDITOR.getUrl(getConfigPath() + part + ".css");
      }
      function loadCss(part, callback) {
        if (!cur[part]) {
          CKEDITOR.document.appendStyleSheet(getCssPath(part));
          cur[part] = 1;
        }
        if (callback) {
          callback();
        }
      }
      function getStylesheet(name) {
        var node = name.getById(label);
        if (!node) {
          node = name.getHead().append("style");
          node.setAttribute("id", label);
          node.setAttribute("type", "text/css");
        }
        return node;
      }
      function updateStylesheets(styleNodes, a, replace) {
        var r;
        var i;
        var value;
        if (CKEDITOR.env.webkit) {
          a = a.split("}").slice(0, -1);
          i = 0;
          for (;i < a.length;i++) {
            a[i] = a[i].split("{");
          }
        }
        var id = 0;
        for (;id < styleNodes.length;id++) {
          if (CKEDITOR.env.webkit) {
            i = 0;
            for (;i < a.length;i++) {
              value = a[i][1];
              r = 0;
              for (;r < replace.length;r++) {
                value = value.replace(replace[r][0], replace[r][1]);
              }
              styleNodes[id].$.sheet.addRule(a[i][0], value);
            }
          } else {
            value = a;
            r = 0;
            for (;r < replace.length;r++) {
              value = value.replace(replace[r][0], replace[r][1]);
            }
            if (CKEDITOR.env.ie && CKEDITOR.env.version < 11) {
              styleNodes[id].$.styleSheet.cssText = styleNodes[id].$.styleSheet.cssText + value;
            } else {
              styleNodes[id].$.innerHTML = styleNodes[id].$.innerHTML + value;
            }
          }
        }
      }
      var cur = {};
      CKEDITOR.skin = {
        path : getConfigPath,
        loadPart : function(part, fn) {
          if (CKEDITOR.skin.name != CKEDITOR.skinName.split(",")[0]) {
            CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(getConfigPath() + "skin.js"), function() {
              loadCss(part, fn);
            });
          } else {
            loadCss(part, fn);
          }
        },
        getPath : function(part) {
          return CKEDITOR.getUrl(getCssPath(part));
        },
        icons : {},
        addIcon : function(name, path, offset, bgsize) {
          name = name.toLowerCase();
          if (!this.icons[name]) {
            this.icons[name] = {
              path : path,
              offset : offset || 0,
              bgsize : bgsize || "16px"
            };
          }
        },
        getIconStyle : function(name, item, overridePath, overrideOffset, opened) {
          var icon;
          if (name) {
            name = name.toLowerCase();
            if (item) {
              icon = this.icons[name + "-rtl"];
            }
            if (!icon) {
              icon = this.icons[name];
            }
          }
          name = overridePath || (icon && icon.path || "");
          overrideOffset = overrideOffset || icon && icon.offset;
          opened = opened || (icon && icon.bgsize || "16px");
          return name && "background-image:url(" + CKEDITOR.getUrl(name) + ");background-position:0 " + overrideOffset + "px;background-size:" + opened + ";";
        }
      };
      CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
        getUiColor : function() {
          return this.uiColor;
        },
        setUiColor : function(key) {
          var uiStyle = getStylesheet(CKEDITOR.document);
          return(this.setUiColor = function(color) {
            var chameleon = CKEDITOR.skin.chameleon;
            var replace = [[r20, color]];
            this.uiColor = color;
            updateStylesheets([uiStyle], chameleon(this, "editor"), replace);
            updateStylesheets(uiColorMenus, chameleon(this, "panel"), replace);
          }).call(this, key);
        }
      });
      var label = "cke_ui_color";
      var uiColorMenus = [];
      var r20 = /\$color/g;
      CKEDITOR.on("instanceLoaded", function(showCallback) {
        if (!CKEDITOR.env.ie || !CKEDITOR.env.quirks) {
          var editor = showCallback.editor;
          showCallback = function(iframe) {
            iframe = (iframe.data[0] || iframe.data).element.getElementsByTag("iframe").getItem(0).getFrameDocument();
            if (!iframe.getById("cke_ui_color")) {
              iframe = getStylesheet(iframe);
              uiColorMenus.push(iframe);
              var c = editor.getUiColor();
              if (c) {
                updateStylesheets([iframe], CKEDITOR.skin.chameleon(editor, "panel"), [[r20, c]]);
              }
            }
          };
          editor.on("panelShow", showCallback);
          editor.on("menuShow", showCallback);
          if (editor.config.uiColor) {
            editor.setUiColor(editor.config.uiColor);
          }
        }
      });
    })();
    (function() {
      if (CKEDITOR.env.webkit) {
        CKEDITOR.env.hc = false;
      } else {
        var codeSegments = CKEDITOR.dom.element.createFromHtml('<div style="width:0;height:0;position:absolute;left:-10000px;border:1px solid;border-color:red blue"></div>', CKEDITOR.document);
        codeSegments.appendTo(CKEDITOR.document.getHead());
        try {
          var i = codeSegments.getComputedStyle("border-top-color");
          var last = codeSegments.getComputedStyle("border-right-color");
          CKEDITOR.env.hc = !!(i && i == last);
        } catch (d) {
          CKEDITOR.env.hc = false;
        }
        codeSegments.remove();
      }
      if (CKEDITOR.env.hc) {
        CKEDITOR.env.cssClass = CKEDITOR.env.cssClass + " cke_hc";
      }
      CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}");
      CKEDITOR.status = "loaded";
      CKEDITOR.fireOnce("loaded");
      if (codeSegments = CKEDITOR._.pending) {
        delete CKEDITOR._.pending;
        i = 0;
        for (;i < codeSegments.length;i++) {
          CKEDITOR.editor.prototype.constructor.apply(codeSegments[i][0], codeSegments[i][1]);
          CKEDITOR.add(codeSegments[i][0]);
        }
      }
    })();
    CKEDITOR.skin.name = "alive";
    CKEDITOR.skin.ua_editor = "ie,iequirks,ie7,ie8,gecko";
    CKEDITOR.skin.ua_dialog = "ie,iequirks,ie7,ie8";
    CKEDITOR.skin.chameleon = function() {
      var colorBrightness = function() {
        return function($2, r) {
          var rgbcolors = $2.match(/[^#]./g);
          var i = 0;
          for (;i < 3;i++) {
            var cache = rgbcolors;
            var k = i;
            var v;
            v = parseInt(rgbcolors[i], 16);
            v = ("0" + (r < 0 ? 0 | v * (1 + r) : 0 | v + (255 - v) * r).toString(16)).slice(-2);
            cache[k] = v;
          }
          return "#" + rgbcolors.join("");
        };
      }();
      var verticalGradient = function() {
        var template = new CKEDITOR.template("background:#{to};background-image:-webkit-gradient(linear,lefttop,leftbottom,from({from}),to({to}));background-image:-moz-linear-gradient(top,{from},{to});background-image:-webkit-linear-gradient(top,{from},{to});background-image:-o-linear-gradient(top,{from},{to});background-image:-ms-linear-gradient(top,{from},{to});background-image:linear-gradient(top,{from},{to});filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='{from}',endColorstr='{to}');");
        return function(oldValue, newValue) {
          return template.output({
            from : oldValue,
            to : newValue
          });
        };
      }();
      var templates = {
        editor : new CKEDITOR.template("{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ {defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_bottom [{defaultGradient}border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [{defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [{defaultGradient}outline-color:{defaultBorder};border-top-color:{defaultBorder};] {id} .cke_dialog_tab [{lightGradient}border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [{mediumGradient}] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} .cke_toolgroup [{lightGradient}border-color:{defaultBorder};] {id} a.cke_button_off:hover, {id} a.cke_button_off:focus, {id} a.cke_button_off:active [{mediumGradient}] {id} .cke_button_on [{ckeButtonOn}] {id} .cke_toolbar_separator [background-color: {ckeToolbarSeparator};] {id} .cke_combo_button [border-color:{defaultBorder};{lightGradient}] {id} a.cke_combo_button:hover, {id} a.cke_combo_button:focus, {id} .cke_combo_on a.cke_combo_button [border-color:{defaultBorder};{mediumGradient}] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover, {id} a.cke_path_item:focus, {id} a.cke_path_item:active [background-color:{elementsPathBg};] {id}.cke_panel [border-color:{defaultBorder};] "),
        panel : new CKEDITOR.template(".cke_panel_grouptitle [{lightGradient}border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:focus.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:focus.cke_colorauto, a:focus.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] ")
      };
      return function(editor, part) {
        var optgroup = editor.uiColor;
        optgroup = {
          id : "." + editor.id,
          defaultBorder : colorBrightness(optgroup, -0.1),
          defaultGradient : verticalGradient(colorBrightness(optgroup, 0.9), optgroup),
          lightGradient : verticalGradient(colorBrightness(optgroup, 1), colorBrightness(optgroup, 0.7)),
          mediumGradient : verticalGradient(colorBrightness(optgroup, 0.8), colorBrightness(optgroup, 0.5)),
          ckeButtonOn : verticalGradient(colorBrightness(optgroup, 0.6), colorBrightness(optgroup, 0.7)),
          ckeResizer : colorBrightness(optgroup, -0.4),
          ckeToolbarSeparator : colorBrightness(optgroup, 0.5),
          ckeColorauto : colorBrightness(optgroup, 0.8),
          dialogBody : colorBrightness(optgroup, 0.7),
          dialogTabSelected : verticalGradient("#FFFFFF", "#FFFFFF"),
          dialogTabSelectedBorder : "#FFF",
          elementsPathColor : colorBrightness(optgroup, -0.6),
          elementsPathBg : optgroup,
          menubuttonIcon : colorBrightness(optgroup, 0.5),
          menubuttonIconHover : colorBrightness(optgroup, 0.3)
        };
        return templates[part].output(optgroup).replace(/\[/g, "{").replace(/\]/g, "}");
      };
    }();
    CKEDITOR.plugins.add("basicstyles", {
      init : function(editor) {
        var copies = 0;
        var addButtonCommand = function(buttonName, buttonLabel, commandName, style) {
          if (style) {
            style = new CKEDITOR.style(style);
            var forms = contentForms[commandName];
            forms.unshift(style);
            editor.attachStyleStateChange(style, function(doc) {
              if (!editor.readOnly) {
                editor.getCommand(commandName).setState(doc);
              }
            });
            editor.addCommand(commandName, new CKEDITOR.styleCommand(style, {
              contentForms : forms
            }));
            if (editor.ui.addButton) {
              editor.ui.addButton(buttonName, {
                label : buttonLabel,
                command : commandName,
                toolbar : "basicstyles," + (copies = copies + 10)
              });
            }
          }
        };
        var contentForms = {
          bold : ["strong", "b", ["span", function(el) {
            el = el.styles["font-weight"];
            return el == "bold" || +el >= 700;
          }]],
          italic : ["em", "i", ["span", function(el) {
            return el.styles["font-style"] == "italic";
          }]],
          underline : ["u", ["span", function(el) {
            return el.styles["text-decoration"] == "underline";
          }]],
          strike : ["s", "strike", ["span", function(el) {
            return el.styles["text-decoration"] == "line-through";
          }]],
          subscript : ["sub"],
          superscript : ["sup"]
        };
        var config = editor.config;
        var lang = editor.lang.basicstyles;
        addButtonCommand("Bold", lang.bold, "bold", config.coreStyles_bold);
        addButtonCommand("Italic", lang.italic, "italic", config.coreStyles_italic);
        addButtonCommand("Underline", lang.underline, "underline", config.coreStyles_underline);
        addButtonCommand("Strike", lang.strike, "strike", config.coreStyles_strike);
        addButtonCommand("Subscript", lang.subscript, "subscript", config.coreStyles_subscript);
        addButtonCommand("Superscript", lang.superscript, "superscript", config.coreStyles_superscript);
        editor.setKeystroke([[CKEDITOR.CTRL + 66, "bold"], [CKEDITOR.CTRL + 73, "italic"], [CKEDITOR.CTRL + 85, "underline"]]);
      }
    });
    CKEDITOR.config.coreStyles_bold = {
      element : "strong",
      overrides : "b"
    };
    CKEDITOR.config.coreStyles_italic = {
      element : "em",
      overrides : "i"
    };
    CKEDITOR.config.coreStyles_underline = {
      element : "u"
    };
    CKEDITOR.config.coreStyles_strike = {
      element : "s",
      overrides : "strike"
    };
    CKEDITOR.config.coreStyles_subscript = {
      element : "sub"
    };
    CKEDITOR.config.coreStyles_superscript = {
      element : "sup"
    };
    CKEDITOR.plugins.add("dialogui", {
      onLoad : function() {
        var Class = function(obj) {
          if (!this._) {
            this._ = {};
          }
          this._["default"] = this._.initValue = obj["default"] || "";
          this._.required = obj.required || false;
          var types = [this._];
          var i = 1;
          for (;i < arguments.length;i++) {
            types.push(arguments[i]);
          }
          types.push(true);
          CKEDITOR.tools.extend.apply(CKEDITOR.tools, types);
          return this._;
        };
        var pdataOld = {
          build : function(name, elementDefinition, data) {
            return new CKEDITOR.ui.dialog.textInput(name, elementDefinition, data);
          }
        };
        var udataCur = {
          build : function(name, elementDefinition, data) {
            return new CKEDITOR.ui.dialog[elementDefinition.type](name, elementDefinition, data);
          }
        };
        var commonPrototype = {
          isChanged : function() {
            return this.getValue() != this.getInitValue();
          },
          reset : function(dataAndEvents) {
            this.setValue(this.getInitValue(), dataAndEvents);
          },
          setInitValue : function() {
            this._.initValue = this.getValue();
          },
          resetInitValue : function() {
            this._.initValue = this._["default"];
          },
          getInitValue : function() {
            return this._.initValue;
          }
        };
        var commonEventProcessors = CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
          onChange : function(dialog, task) {
            if (!this._.domOnChangeRegistered) {
              dialog.on("load", function() {
                this.getInputElement().on("change", function() {
                  if (dialog.parts.dialog.isVisible()) {
                    this.fire("change", {
                      value : this.getValue()
                    });
                  }
                }, this);
              }, this);
              this._.domOnChangeRegistered = true;
            }
            this.on("change", task);
          }
        }, true);
        var numbers = /^on([A-Z]\w+)/;
        var cleanInnerDefinition = function(def) {
          var i;
          for (i in def) {
            if (numbers.test(i) || (i == "title" || i == "type")) {
              delete def[i];
            }
          }
          return def;
        };
        CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {
          labeledElement : function(name, key, duration, fn) {
            if (!(arguments.length < 4)) {
              var _ = Class.call(this, key);
              _.labelId = CKEDITOR.tools.getNextId() + "_label";
              this._.children = [];
              CKEDITOR.ui.dialog.uiElement.call(this, name, key, duration, "div", null, {
                role : "presentation"
              }, function() {
                var html = [];
                var hboxDefinition = key.required ? " cke_required" : "";
                if (key.labelLayout != "horizontal") {
                  html.push('<label class="cke_dialog_ui_labeled_label' + hboxDefinition + '" ', ' id="' + _.labelId + '"', _.inputId ? ' for="' + _.inputId + '"' : "", (key.labelStyle ? ' style="' + key.labelStyle + '"' : "") + ">", key.label, "</label>", '<div class="cke_dialog_ui_labeled_content"', key.controlStyle ? ' style="' + key.controlStyle + '"' : "", ' role="radiogroup" aria-labelledby="' + _.labelId + '">', fn.call(this, name, key), "</div>");
                } else {
                  hboxDefinition = {
                    type : "hbox",
                    widths : key.widths,
                    padding : 0,
                    children : [{
                      type : "html",
                      html : '<label class="cke_dialog_ui_labeled_label' + hboxDefinition + '" id="' + _.labelId + '" for="' + _.inputId + '"' + (key.labelStyle ? ' style="' + key.labelStyle + '"' : "") + ">" + CKEDITOR.tools.htmlEncode(key.label) + "</span>"
                    }, {
                      type : "html",
                      html : '<span class="cke_dialog_ui_labeled_content"' + (key.controlStyle ? ' style="' + key.controlStyle + '"' : "") + ">" + fn.call(this, name, key) + "</span>"
                    }]
                  };
                  CKEDITOR.dialog._.uiElementBuilders.hbox.build(name, hboxDefinition, html);
                }
                return html.join("");
              });
            }
          },
          textInput : function(name, key, duration) {
            if (!(arguments.length < 3)) {
              Class.call(this, key);
              var pageId = this._.inputId = CKEDITOR.tools.getNextId() + "_textInput";
              var attributes = {
                "class" : "cke_dialog_ui_input_" + key.type,
                id : pageId,
                type : key.type
              };
              if (key.validate) {
                this.validate = key.validate;
              }
              if (key.maxLength) {
                attributes.maxlength = key.maxLength;
              }
              if (key.size) {
                attributes.size = key.size;
              }
              if (key.inputStyle) {
                attributes.style = key.inputStyle;
              }
              var me = this;
              var r = false;
              name.on("load", function() {
                me.getInputElement().on("keydown", function(evt) {
                  if (evt.data.getKeystroke() == 13) {
                    r = true;
                  }
                });
                me.getInputElement().on("keyup", function(evt) {
                  if (evt.data.getKeystroke() == 13 && r) {
                    if (name.getButton("ok")) {
                      setTimeout(function() {
                        name.getButton("ok").click();
                      }, 0);
                    }
                    r = false;
                  }
                }, null, null, 1E3);
              });
              CKEDITOR.ui.dialog.labeledElement.call(this, name, key, duration, function() {
                var tagNameArr = ['<div class="cke_dialog_ui_input_', key.type, '" role="presentation"'];
                if (key.width) {
                  tagNameArr.push('style="width:' + key.width + '" ');
                }
                tagNameArr.push("><input ");
                attributes["aria-labelledby"] = this._.labelId;
                if (this._.required) {
                  attributes["aria-required"] = this._.required;
                }
                var attr;
                for (attr in attributes) {
                  tagNameArr.push(attr + '="' + attributes[attr] + '" ');
                }
                tagNameArr.push(" /></div>");
                return tagNameArr.join("");
              });
            }
          },
          textarea : function(name, keepData, ref) {
            if (!(arguments.length < 3)) {
              Class.call(this, keepData);
              var me = this;
              var tagName = this._.inputId = CKEDITOR.tools.getNextId() + "_textarea";
              var attributes = {};
              if (keepData.validate) {
                this.validate = keepData.validate;
              }
              attributes.rows = keepData.rows || 5;
              attributes.cols = keepData.cols || 20;
              attributes["class"] = "cke_dialog_ui_input_textarea " + (keepData["class"] || "");
              if (typeof keepData.inputStyle != "undefined") {
                attributes.style = keepData.inputStyle;
              }
              if (keepData.dir) {
                attributes.dir = keepData.dir;
              }
              CKEDITOR.ui.dialog.labeledElement.call(this, name, keepData, ref, function() {
                attributes["aria-labelledby"] = this._.labelId;
                if (this._.required) {
                  attributes["aria-required"] = this._.required;
                }
                var tagNameArr = ['<div class="cke_dialog_ui_input_textarea" role="presentation"><textarea id="', tagName, '" '];
                var i;
                for (i in attributes) {
                  tagNameArr.push(i + '="' + CKEDITOR.tools.htmlEncode(attributes[i]) + '" ');
                }
                tagNameArr.push(">", CKEDITOR.tools.htmlEncode(me._["default"]), "</textarea></div>");
                return tagNameArr.join("");
              });
            }
          },
          checkbox : function(name, key, duration) {
            if (!(arguments.length < 3)) {
              var _ = Class.call(this, key, {
                "default" : !!key["default"]
              });
              if (key.validate) {
                this.validate = key.validate;
              }
              CKEDITOR.ui.dialog.uiElement.call(this, name, key, duration, "span", null, null, function() {
                var myDefinition = CKEDITOR.tools.extend({}, key, {
                  id : key.id ? key.id + "_checkbox" : CKEDITOR.tools.getNextId() + "_checkbox"
                }, true);
                var html = [];
                var labelId = CKEDITOR.tools.getNextId() + "_label";
                var attributes = {
                  "class" : "cke_dialog_ui_checkbox_input",
                  type : "checkbox",
                  "aria-labelledby" : labelId
                };
                cleanInnerDefinition(myDefinition);
                if (key["default"]) {
                  attributes.checked = "checked";
                }
                if (typeof myDefinition.inputStyle != "undefined") {
                  myDefinition.style = myDefinition.inputStyle;
                }
                _.checkbox = new CKEDITOR.ui.dialog.uiElement(name, myDefinition, html, "input", null, attributes);
                html.push(' <label id="', labelId, '" for="', attributes.id, '"' + (key.labelStyle ? ' style="' + key.labelStyle + '"' : "") + ">", CKEDITOR.tools.htmlEncode(key.label), "</label>");
                return html.join("");
              });
            }
          },
          radio : function(name, key, duration) {
            if (!(arguments.length < 3)) {
              Class.call(this, key);
              if (!this._["default"]) {
                this._["default"] = this._.initValue = key.items[0][1];
              }
              if (key.validate) {
                this.validate = key.valdiate;
              }
              var children = [];
              var me = this;
              CKEDITOR.ui.dialog.labeledElement.call(this, name, key, duration, function() {
                var inputHtmlList = [];
                var html = [];
                var commonName = (key.id ? key.id : CKEDITOR.tools.getNextId()) + "_radio";
                var j = 0;
                for (;j < key.items.length;j++) {
                  var item = key.items[j];
                  var labelDefinition = item[2] !== void 0 ? item[2] : item[0];
                  var value = item[1] !== void 0 ? item[1] : item[0];
                  var inputDefinition = CKEDITOR.tools.getNextId() + "_radio_input";
                  var labelId = inputDefinition + "_label";
                  inputDefinition = CKEDITOR.tools.extend({}, key, {
                    id : inputDefinition,
                    title : null,
                    type : null
                  }, true);
                  labelDefinition = CKEDITOR.tools.extend({}, inputDefinition, {
                    title : labelDefinition
                  }, true);
                  var inputAttributes = {
                    type : "radio",
                    "class" : "cke_dialog_ui_radio_input",
                    name : commonName,
                    value : value,
                    "aria-labelledby" : labelId
                  };
                  var inputHtml = [];
                  if (me._["default"] == value) {
                    inputAttributes.checked = "checked";
                  }
                  cleanInnerDefinition(inputDefinition);
                  cleanInnerDefinition(labelDefinition);
                  if (typeof inputDefinition.inputStyle != "undefined") {
                    inputDefinition.style = inputDefinition.inputStyle;
                  }
                  inputDefinition.keyboardFocusable = true;
                  children.push(new CKEDITOR.ui.dialog.uiElement(name, inputDefinition, inputHtml, "input", null, inputAttributes));
                  inputHtml.push(" ");
                  new CKEDITOR.ui.dialog.uiElement(name, labelDefinition, inputHtml, "label", null, {
                    id : labelId,
                    "for" : inputAttributes.id
                  }, item[0]);
                  inputHtmlList.push(inputHtml.join(""));
                }
                new CKEDITOR.ui.dialog.hbox(name, children, inputHtmlList, html);
                return html.join("");
              });
              this._.children = children;
            }
          },
          button : function(name, keepData, ref) {
            if (arguments.length) {
              if (typeof keepData == "function") {
                keepData = keepData(name.getParentEditor());
              }
              Class.call(this, keepData, {
                disabled : keepData.disabled || false
              });
              CKEDITOR.event.implementOn(this);
              var $button = this;
              name.on("load", function() {
                var element = this.getElement();
                (function() {
                  element.on("click", function(evt) {
                    $button.click();
                    evt.data.preventDefault();
                  });
                  element.on("keydown", function(evt) {
                    if (evt.data.getKeystroke() in {
                      32 : 1
                    }) {
                      $button.click();
                      evt.data.preventDefault();
                    }
                  });
                })();
                element.unselectable();
              }, this);
              var hash = CKEDITOR.tools.extend({}, keepData);
              delete hash.style;
              var labelId = CKEDITOR.tools.getNextId() + "_label";
              CKEDITOR.ui.dialog.uiElement.call(this, name, hash, ref, "a", null, {
                style : keepData.style,
                href : "javascript:void(0)",
                title : keepData.label,
                hidefocus : "true",
                "class" : keepData["class"],
                role : "button",
                "aria-labelledby" : labelId
              }, '<span id="' + labelId + '" class="cke_dialog_ui_button">' + CKEDITOR.tools.htmlEncode(keepData.label) + "</span>");
            }
          },
          select : function(type, key, date) {
            if (!(arguments.length < 3)) {
              var _ = Class.call(this, key);
              if (key.validate) {
                this.validate = key.validate;
              }
              _.inputId = CKEDITOR.tools.getNextId() + "_select";
              CKEDITOR.ui.dialog.labeledElement.call(this, type, key, date, function() {
                var myDefinition = CKEDITOR.tools.extend({}, key, {
                  id : key.id ? key.id + "_select" : CKEDITOR.tools.getNextId() + "_select"
                }, true);
                var html = [];
                var tagNameArr = [];
                var attributes = {
                  id : _.inputId,
                  "class" : "cke_dialog_ui_input_select",
                  "aria-labelledby" : this._.labelId
                };
                html.push('<div class="cke_dialog_ui_input_', key.type, '" role="presentation"');
                if (key.width) {
                  html.push('style="width:' + key.width + '" ');
                }
                html.push(">");
                if (key.size != void 0) {
                  attributes.size = key.size;
                }
                if (key.multiple != void 0) {
                  attributes.multiple = key.multiple;
                }
                cleanInnerDefinition(myDefinition);
                var i = 0;
                var item;
                for (;i < key.items.length && (item = key.items[i]);i++) {
                  tagNameArr.push('<option value="', CKEDITOR.tools.htmlEncode(item[1] !== void 0 ? item[1] : item[0]).replace(/"/g, "&quot;"), '" /> ', CKEDITOR.tools.htmlEncode(item[0]));
                }
                if (typeof myDefinition.inputStyle != "undefined") {
                  myDefinition.style = myDefinition.inputStyle;
                }
                _.select = new CKEDITOR.ui.dialog.uiElement(type, myDefinition, html, "select", null, attributes, tagNameArr.join(""));
                html.push("</div>");
                return html.join("");
              });
            }
          },
          file : function(name, key, duration) {
            if (!(arguments.length < 3)) {
              if (key["default"] === void 0) {
                key["default"] = "";
              }
              var _ = CKEDITOR.tools.extend(Class.call(this, key), {
                definition : key,
                buttons : []
              });
              if (key.validate) {
                this.validate = key.validate;
              }
              name.on("load", function() {
                CKEDITOR.document.getById(_.frameId).getParent().addClass("cke_dialog_ui_input_file");
              });
              CKEDITOR.ui.dialog.labeledElement.call(this, name, key, duration, function() {
                _.frameId = CKEDITOR.tools.getNextId() + "_fileInput";
                var tagNameArr = ['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" role="presentation" id="', _.frameId, '" title="', key.label, '" src="javascript:void('];
                tagNameArr.push(CKEDITOR.env.ie ? "(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "})()" : "0");
                tagNameArr.push(')"></iframe>');
                return tagNameArr.join("");
              });
            }
          },
          fileButton : function(name, key, duration) {
            if (!(arguments.length < 3)) {
              Class.call(this, key);
              var copies = this;
              if (key.validate) {
                this.validate = key.validate;
              }
              var hash = CKEDITOR.tools.extend({}, key);
              var handler = hash.onClick;
              hash.className = (hash.className ? hash.className + " " : "") + "cke_dialog_ui_button";
              hash.onClick = function(type) {
                var targetInput = key["for"];
                if (!handler || handler.call(this, type) !== false) {
                  name.getContentElement(targetInput[0], targetInput[1]).submit();
                  this.disable();
                }
              };
              name.on("load", function() {
                name.getContentElement(key["for"][0], key["for"][1])._.buttons.push(copies);
              });
              CKEDITOR.ui.dialog.button.call(this, name, hash, duration);
            }
          },
          html : function() {
            var rvar = /^\s*<[\w:]+\s+([^>]*)?>/;
            var optgroup = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/;
            var rsingleTag = /\/$/;
            return function(key, f, htmlList) {
              if (!(arguments.length < 3)) {
                var m = [];
                var match = f.html;
                if (match.charAt(0) != "<") {
                  match = "<span>" + match + "</span>";
                }
                var focus = f.focus;
                if (focus) {
                  var oldFocus = this.focus;
                  this.focus = function() {
                    (typeof focus == "function" ? focus : oldFocus).call(this);
                    this.fire("focus");
                  };
                  if (f.isFocusable) {
                    this.isFocusable = this.isFocusable;
                  }
                  this.keyboardFocusable = true;
                }
                CKEDITOR.ui.dialog.uiElement.call(this, key, f, m, "span", null, null, "");
                m = m.join("").match(rvar);
                match = match.match(optgroup) || ["", "", ""];
                if (rsingleTag.test(match[1])) {
                  match[1] = match[1].slice(0, -1);
                  match[2] = "/" + match[2];
                }
                htmlList.push([match[1], " ", m[1] || "", match[2]].join(""));
              }
            };
          }(),
          fieldset : function(key, childObjList, childHtmlList, duration, hash) {
            var l = hash.label;
            this._ = {
              children : childObjList
            };
            CKEDITOR.ui.dialog.uiElement.call(this, key, hash, duration, "fieldset", null, null, function() {
              var html = [];
              if (l) {
                html.push("<legend" + (hash.labelStyle ? ' style="' + hash.labelStyle + '"' : "") + ">" + l + "</legend>");
              }
              var i = 0;
              for (;i < childHtmlList.length;i++) {
                html.push(childHtmlList[i]);
              }
              return html.join("");
            });
          }
        }, true);
        CKEDITOR.ui.dialog.html.prototype = new CKEDITOR.ui.dialog.uiElement;
        CKEDITOR.ui.dialog.labeledElement.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
          setLabel : function(label) {
            var container = CKEDITOR.document.getById(this._.labelId);
            if (container.getChildCount() < 1) {
              (new CKEDITOR.dom.text(label, CKEDITOR.document)).appendTo(container);
            } else {
              container.getChild(0).$.nodeValue = label;
            }
            return this;
          },
          getLabel : function() {
            var node = CKEDITOR.document.getById(this._.labelId);
            return!node || node.getChildCount() < 1 ? "" : node.getChild(0).getText();
          },
          eventProcessors : commonEventProcessors
        }, true);
        CKEDITOR.ui.dialog.button.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
          click : function() {
            return!this._.disabled ? this.fire("click", {
              dialog : this._.dialog
            }) : false;
          },
          enable : function() {
            this._.disabled = false;
            var element = this.getElement();
            if (element) {
              element.removeClass("cke_disabled");
            }
          },
          disable : function() {
            this._.disabled = true;
            this.getElement().addClass("cke_disabled");
          },
          isVisible : function() {
            return this.getElement().getFirst().isVisible();
          },
          isEnabled : function() {
            return!this._.disabled;
          },
          eventProcessors : CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
            onClick : function(item, matcherFunction) {
              this.on("click", function() {
                matcherFunction.apply(this, arguments);
              });
            }
          }, true),
          accessKeyUp : function() {
            this.click();
          },
          accessKeyDown : function() {
            this.focus();
          },
          keyboardFocusable : true
        }, true);
        CKEDITOR.ui.dialog.textInput.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
          getInputElement : function() {
            return CKEDITOR.document.getById(this._.inputId);
          },
          focus : function() {
            var me = this.selectParentTab();
            setTimeout(function() {
              var el = me.getInputElement();
              if (el) {
                el.$.focus();
              }
            }, 0);
          },
          select : function() {
            var me = this.selectParentTab();
            setTimeout(function() {
              var element = me.getInputElement();
              if (element) {
                element.$.focus();
                element.$.select();
              }
            }, 0);
          },
          accessKeyUp : function() {
            this.select();
          },
          setValue : function(value) {
            if (!value) {
              value = "";
            }
            return CKEDITOR.ui.dialog.uiElement.prototype.setValue.apply(this, arguments);
          },
          keyboardFocusable : true
        }, commonPrototype, true);
        CKEDITOR.ui.dialog.textarea.prototype = new CKEDITOR.ui.dialog.textInput;
        CKEDITOR.ui.dialog.select.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
          getInputElement : function() {
            return this._.select.getElement();
          },
          add : function(name, expectedNumberOfNonCommentArgs, index) {
            var option = new CKEDITOR.dom.element("option", this.getDialog().getParentEditor().document);
            var selectElement = this.getInputElement().$;
            option.$.text = name;
            option.$.value = expectedNumberOfNonCommentArgs === void 0 || expectedNumberOfNonCommentArgs === null ? name : expectedNumberOfNonCommentArgs;
            if (index === void 0 || index === null) {
              if (CKEDITOR.env.ie) {
                selectElement.add(option.$);
              } else {
                selectElement.add(option.$, null);
              }
            } else {
              selectElement.add(option.$, index);
            }
            return this;
          },
          remove : function(name) {
            this.getInputElement().$.remove(name);
            return this;
          },
          clear : function() {
            var selectElement = this.getInputElement().$;
            for (;selectElement.length > 0;) {
              selectElement.remove(0);
            }
            return this;
          },
          keyboardFocusable : true
        }, commonPrototype, true);
        CKEDITOR.ui.dialog.checkbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
          getInputElement : function() {
            return this._.checkbox.getElement();
          },
          setValue : function(value, dataAndEvents) {
            this.getInputElement().$.checked = value;
            if (!dataAndEvents) {
              this.fire("change", {
                value : value
              });
            }
          },
          getValue : function() {
            return this.getInputElement().$.checked;
          },
          accessKeyUp : function() {
            this.setValue(!this.getValue());
          },
          eventProcessors : {
            onChange : function(dialog, task) {
              if (!CKEDITOR.env.ie || CKEDITOR.env.version > 8) {
                return commonEventProcessors.onChange.apply(this, arguments);
              }
              dialog.on("load", function() {
                var element = this._.checkbox.getElement();
                element.on("propertychange", function(evt) {
                  evt = evt.data.$;
                  if (evt.propertyName == "checked") {
                    this.fire("change", {
                      value : element.$.checked
                    });
                  }
                }, this);
              }, this);
              this.on("change", task);
              return null;
            }
          },
          keyboardFocusable : true
        }, commonPrototype, true);
        CKEDITOR.ui.dialog.radio.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
          setValue : function(value, dataAndEvents) {
            var items = this._.children;
            var item;
            var i = 0;
            for (;i < items.length && (item = items[i]);i++) {
              item.getElement().$.checked = item.getValue() == value;
            }
            if (!dataAndEvents) {
              this.fire("change", {
                value : value
              });
            }
          },
          getValue : function() {
            var children = this._.children;
            var i = 0;
            for (;i < children.length;i++) {
              if (children[i].getElement().$.checked) {
                return children[i].getValue();
              }
            }
            return null;
          },
          accessKeyUp : function() {
            var children = this._.children;
            var i;
            i = 0;
            for (;i < children.length;i++) {
              if (children[i].getElement().$.checked) {
                children[i].getElement().focus();
                return;
              }
            }
            children[0].getElement().focus();
          },
          eventProcessors : {
            onChange : function(dialog, task) {
              if (CKEDITOR.env.ie) {
                dialog.on("load", function() {
                  var children = this._.children;
                  var me = this;
                  var i = 0;
                  for (;i < children.length;i++) {
                    children[i].getElement().on("propertychange", function(evt) {
                      evt = evt.data.$;
                      if (evt.propertyName == "checked") {
                        if (this.$.checked) {
                          me.fire("change", {
                            value : this.getAttribute("value")
                          });
                        }
                      }
                    });
                  }
                }, this);
                this.on("change", task);
              } else {
                return commonEventProcessors.onChange.apply(this, arguments);
              }
              return null;
            }
          }
        }, commonPrototype, true);
        CKEDITOR.ui.dialog.file.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, commonPrototype, {
          getInputElement : function() {
            var frameDocument = CKEDITOR.document.getById(this._.frameId).getFrameDocument();
            return frameDocument.$.forms.length > 0 ? new CKEDITOR.dom.element(frameDocument.$.forms[0].elements[0]) : this.getElement();
          },
          submit : function() {
            this.getInputElement().getParent().$.submit();
            return this;
          },
          getAction : function() {
            return this.getInputElement().getParent().$.action;
          },
          registerEvents : function(definition) {
            var optgroup = /^on([A-Z]\w+)/;
            var options;
            var registerDomEvent = function(uiElement, dialog, eventName, one) {
              uiElement.on("formLoaded", function() {
                uiElement.getInputElement().on(eventName, one, uiElement);
              });
            };
            var i;
            for (i in definition) {
              if (options = i.match(optgroup)) {
                if (this.eventProcessors[i]) {
                  this.eventProcessors[i].call(this, this._.dialog, definition[i]);
                } else {
                  registerDomEvent(this, this._.dialog, options[1].toLowerCase(), definition[i]);
                }
              }
            }
            return this;
          },
          reset : function() {
            function generateFormField() {
              frameDocument.$.open();
              var i = "";
              if (elementDefinition.size) {
                i = elementDefinition.size - (CKEDITOR.env.ie ? 7 : 0);
              }
              var secure = _.frameId + "_input";
              frameDocument.$.write(['<html dir="' + langDir + '" lang="' + langCode + '"><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">', '<form enctype="multipart/form-data" method="POST" dir="' + langDir + '" lang="' + langCode + '" action="', CKEDITOR.tools.htmlEncode(elementDefinition.action), '"><label id="', _.labelId, '" for="', secure, '" style="display:none">', CKEDITOR.tools.htmlEncode(elementDefinition.label), '</label><input style="width:100%" id="', 
              secure, '" aria-labelledby="', _.labelId, '" type="file" name="', CKEDITOR.tools.htmlEncode(elementDefinition.id || "cke_upload"), '" size="', CKEDITOR.tools.htmlEncode(i > 0 ? i : ""), '" /></form></body></html><script>', CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "", "window.parent.CKEDITOR.tools.callFunction(" + callNumber + ");", "window.onbeforeunload = function() {window.parent.CKEDITOR.tools.callFunction(" + unloadNumber + ")}", "\x3c/script>"].join(""));
              frameDocument.$.close();
              i = 0;
              for (;i < buttons.length;i++) {
                buttons[i].enable();
              }
            }
            var _ = this._;
            var frameDocument = CKEDITOR.document.getById(_.frameId).getFrameDocument();
            var elementDefinition = _.definition;
            var buttons = _.buttons;
            var callNumber = this.formLoadedNumber;
            var unloadNumber = this.formUnloadNumber;
            var langDir = _.dialog._.editor.lang.dir;
            var langCode = _.dialog._.editor.langCode;
            if (!callNumber) {
              callNumber = this.formLoadedNumber = CKEDITOR.tools.addFunction(function() {
                this.fire("formLoaded");
              }, this);
              unloadNumber = this.formUnloadNumber = CKEDITOR.tools.addFunction(function() {
                this.getInputElement().clearCustomData();
              }, this);
              this.getDialog()._.editor.on("destroy", function() {
                CKEDITOR.tools.removeFunction(callNumber);
                CKEDITOR.tools.removeFunction(unloadNumber);
              });
            }
            if (CKEDITOR.env.gecko) {
              setTimeout(generateFormField, 500);
            } else {
              generateFormField();
            }
          },
          getValue : function() {
            return this.getInputElement().$.value || "";
          },
          setInitValue : function() {
            this._.initValue = "";
          },
          eventProcessors : {
            onChange : function(thumb, task) {
              if (!this._.domOnChangeRegistered) {
                this.on("formLoaded", function() {
                  this.getInputElement().on("change", function() {
                    this.fire("change", {
                      value : this.getValue()
                    });
                  }, this);
                }, this);
                this._.domOnChangeRegistered = true;
              }
              this.on("change", task);
            }
          },
          keyboardFocusable : true
        }, true);
        CKEDITOR.ui.dialog.fileButton.prototype = new CKEDITOR.ui.dialog.button;
        CKEDITOR.ui.dialog.fieldset.prototype = CKEDITOR.tools.clone(CKEDITOR.ui.dialog.hbox.prototype);
        CKEDITOR.dialog.addUIElement("text", pdataOld);
        CKEDITOR.dialog.addUIElement("password", pdataOld);
        CKEDITOR.dialog.addUIElement("textarea", udataCur);
        CKEDITOR.dialog.addUIElement("checkbox", udataCur);
        CKEDITOR.dialog.addUIElement("radio", udataCur);
        CKEDITOR.dialog.addUIElement("button", udataCur);
        CKEDITOR.dialog.addUIElement("select", udataCur);
        CKEDITOR.dialog.addUIElement("file", udataCur);
        CKEDITOR.dialog.addUIElement("fileButton", udataCur);
        CKEDITOR.dialog.addUIElement("html", udataCur);
        CKEDITOR.dialog.addUIElement("fieldset", {
          build : function(name, elementDefinition, data) {
            var children = elementDefinition.children;
            var child;
            var loopedValues = [];
            var arr = [];
            var i = 0;
            for (;i < children.length && (child = children[i]);i++) {
              var k = [];
              loopedValues.push(k);
              arr.push(CKEDITOR.dialog._.uiElementBuilders[child.type].build(name, child, k));
            }
            return new CKEDITOR.ui.dialog[elementDefinition.type](name, arr, loopedValues, data, elementDefinition);
          }
        });
      }
    });
    CKEDITOR.DIALOG_RESIZE_NONE = 0;
    CKEDITOR.DIALOG_RESIZE_WIDTH = 1;
    CKEDITOR.DIALOG_RESIZE_HEIGHT = 2;
    CKEDITOR.DIALOG_RESIZE_BOTH = 3;
    (function() {
      function initialize() {
        var length = this._.tabIdList.length;
        var end = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId) + length;
        var i = end - 1;
        for (;i > end - length;i--) {
          if (this._.tabs[this._.tabIdList[i % length]][0].$.offsetHeight) {
            return this._.tabIdList[i % length];
          }
        }
        return null;
      }
      function listener() {
        var length = this._.tabIdList.length;
        var offset = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId);
        var i = offset + 1;
        for (;i < offset + length;i++) {
          if (this._.tabs[this._.tabIdList[i % length]][0].$.offsetHeight) {
            return this._.tabIdList[i % length];
          }
        }
        return null;
      }
      function clearOrRecoverTextInputValue(container, dataAndEvents) {
        var inputs = container.$.getElementsByTagName("input");
        var i = 0;
        var len = inputs.length;
        for (;i < len;i++) {
          var item = new CKEDITOR.dom.element(inputs[i]);
          if (item.getAttribute("type").toLowerCase() == "text") {
            if (dataAndEvents) {
              item.setAttribute("value", item.getCustomData("fake_value") || "");
              item.removeCustomData("fake_value");
            } else {
              item.setCustomData("fake_value", item.getAttribute("value"));
              item.setAttribute("value", "");
            }
          }
        }
      }
      function handleFieldValidated(isValid, msg) {
        var input = this.getInputElement();
        if (input) {
          if (isValid) {
            input.removeAttribute("aria-invalid");
          } else {
            input.setAttribute("aria-invalid", true);
          }
        }
        if (!isValid) {
          if (this.select) {
            this.select();
          } else {
            this.focus();
          }
        }
        if (msg) {
          alert(msg);
        }
        this.fire("validated", {
          valid : isValid,
          msg : msg
        });
      }
      function resetField() {
        var input = this.getInputElement();
        if (input) {
          input.removeAttribute("aria-invalid");
        }
      }
      function buildDialog(editor) {
        editor = CKEDITOR.dom.element.createFromHtml(CKEDITOR.addTemplate("dialog", templateSource).output({
          id : CKEDITOR.tools.getNextNumber(),
          editorId : editor.id,
          langDir : editor.lang.dir,
          langCode : editor.langCode,
          editorDialogClass : "cke_editor_" + editor.name.replace(/\./g, "\\.") + "_dialog",
          closeTitle : editor.lang.common.close,
          hidpi : CKEDITOR.env.hidpi ? "cke_hidpi" : ""
        }));
        var body = editor.getChild([0, 0, 0, 0, 0]);
        var title = body.getChild(0);
        var close = body.getChild(1);
        if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
          var f = "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())";
          CKEDITOR.dom.element.createFromHtml('<iframe frameBorder="0" class="cke_iframe_shim" src="' + f + '" tabIndex="-1"></iframe>').appendTo(body.getParent());
        }
        title.unselectable();
        close.unselectable();
        return{
          element : editor,
          parts : {
            dialog : editor.getChild(0),
            title : title,
            close : close,
            tabs : body.getChild(2),
            contents : body.getChild([3, 0, 0, 0]),
            footer : body.getChild([3, 0, 1, 0])
          }
        };
      }
      function Focusable(dialog, element, index) {
        this.element = element;
        this.focusIndex = index;
        this.tabIndex = 0;
        this.isFocusable = function() {
          return!element.getAttribute("disabled") && element.isVisible();
        };
        this.focus = function() {
          dialog._.currentFocusIndex = this.focusIndex;
          this.element.focus();
        };
        element.on("keydown", function(evt) {
          if (evt.data.getKeystroke() in {
            32 : 1,
            13 : 1
          }) {
            this.fire("click");
          }
        });
        element.on("focus", function() {
          this.fire("mouseover");
        });
        element.on("blur", function() {
          this.fire("mouseout");
        });
      }
      function resizeWithWindow(dialog) {
        function resizeHandler() {
          dialog.layout();
        }
        var win = CKEDITOR.document.getWindow();
        win.on("resize", resizeHandler);
        dialog.on("hide", function() {
          win.removeListener("resize", resizeHandler);
        });
      }
      function contentObject(dialog, contentDefinition) {
        this._ = {
          dialog : dialog
        };
        CKEDITOR.tools.extend(this, contentDefinition);
      }
      function initDragAndDrop(dialog) {
        function mouseMoveHandler(evt) {
          var innerSize = dialog.getSize();
          var parentSize = CKEDITOR.document.getWindow().getViewPaneSize();
          var x = evt.data.$.screenX;
          var y = evt.data.$.screenY;
          var dx = x - lastCoords.x;
          var ry = y - lastCoords.y;
          lastCoords = {
            x : x,
            y : y
          };
          abstractDialogCoords.x = abstractDialogCoords.x + dx;
          abstractDialogCoords.y = abstractDialogCoords.y + ry;
          dialog.move(abstractDialogCoords.x + margins[3] < magnetDistance ? -margins[3] : abstractDialogCoords.x - margins[1] > parentSize.width - innerSize.width - magnetDistance ? parentSize.width - innerSize.width + (editor.lang.dir == "rtl" ? 0 : margins[1]) : abstractDialogCoords.x, abstractDialogCoords.y + margins[0] < magnetDistance ? -margins[0] : abstractDialogCoords.y - margins[2] > parentSize.height - innerSize.height - magnetDistance ? parentSize.height - innerSize.height + margins[2] : 
          abstractDialogCoords.y, 1);
          evt.data.preventDefault();
        }
        function mouseUpHandler() {
          CKEDITOR.document.removeListener("mousemove", mouseMoveHandler);
          CKEDITOR.document.removeListener("mouseup", mouseUpHandler);
          if (CKEDITOR.env.ie6Compat) {
            var coverDoc = optgroup.getChild(0).getFrameDocument();
            coverDoc.removeListener("mousemove", mouseMoveHandler);
            coverDoc.removeListener("mouseup", mouseUpHandler);
          }
        }
        var lastCoords = null;
        var abstractDialogCoords = null;
        dialog.getElement().getFirst();
        var editor = dialog.getParentEditor();
        var magnetDistance = editor.config.dialog_magnetDistance;
        var margins = CKEDITOR.skin.margins || [0, 0, 0, 0];
        if (typeof magnetDistance == "undefined") {
          magnetDistance = 20;
        }
        dialog.parts.title.on("mousedown", function(evt) {
          lastCoords = {
            x : evt.data.$.screenX,
            y : evt.data.$.screenY
          };
          CKEDITOR.document.on("mousemove", mouseMoveHandler);
          CKEDITOR.document.on("mouseup", mouseUpHandler);
          abstractDialogCoords = dialog.getPosition();
          if (CKEDITOR.env.ie6Compat) {
            var coverDoc = optgroup.getChild(0).getFrameDocument();
            coverDoc.on("mousemove", mouseMoveHandler);
            coverDoc.on("mouseup", mouseUpHandler);
          }
          evt.data.preventDefault();
        }, dialog);
      }
      function initResizeHandles(dialog) {
        function mouseMoveHandler(evt) {
          var rtl = editor.lang.dir == "rtl";
          var optgroup = startSize.width;
          var key = startSize.height;
          var internalWidth = optgroup + (evt.data.$.screenX - mouse_drag_x) * (rtl ? -1 : 1) * (dialog._.moved ? 1 : 2);
          var height = key + (evt.data.$.screenY - mouse_drag_y) * (dialog._.moved ? 1 : 2);
          var right = dialog._.element.getFirst();
          right = rtl && right.getComputedStyle("right");
          var position = dialog.getPosition();
          if (position.y + height > viewSize.height) {
            height = viewSize.height - position.y;
          }
          if ((rtl ? right : position.x) + internalWidth > viewSize.width) {
            internalWidth = viewSize.width - (rtl ? right : position.x);
          }
          if (resizable == CKEDITOR.DIALOG_RESIZE_WIDTH || resizable == CKEDITOR.DIALOG_RESIZE_BOTH) {
            optgroup = Math.max(def.minWidth || 0, internalWidth - wrapperWidth);
          }
          if (resizable == CKEDITOR.DIALOG_RESIZE_HEIGHT || resizable == CKEDITOR.DIALOG_RESIZE_BOTH) {
            key = Math.max(def.minHeight || 0, height - delta);
          }
          dialog.resize(optgroup, key);
          if (!dialog._.moved) {
            dialog.layout();
          }
          evt.data.preventDefault();
        }
        function mouseUpHandler() {
          CKEDITOR.document.removeListener("mouseup", mouseUpHandler);
          CKEDITOR.document.removeListener("mousemove", mouseMoveHandler);
          if (copy) {
            copy.remove();
            copy = null;
          }
          if (CKEDITOR.env.ie6Compat) {
            var coverDoc = optgroup.getChild(0).getFrameDocument();
            coverDoc.removeListener("mouseup", mouseUpHandler);
            coverDoc.removeListener("mousemove", mouseMoveHandler);
          }
        }
        var mouse_drag_x;
        var mouse_drag_y;
        var def = dialog.definition;
        var resizable = def.resizable;
        if (resizable != CKEDITOR.DIALOG_RESIZE_NONE) {
          var editor = dialog.getParentEditor();
          var wrapperWidth;
          var delta;
          var viewSize;
          var startSize;
          var copy;
          var hash = CKEDITOR.tools.addFunction(function(evt) {
            startSize = dialog.getSize();
            var el = dialog.parts.contents;
            if (el.$.getElementsByTagName("iframe").length) {
              copy = CKEDITOR.dom.element.createFromHtml('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>');
              el.append(copy);
            }
            delta = startSize.height - dialog.parts.contents.getSize("height", !(CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.quirks));
            wrapperWidth = startSize.width - dialog.parts.contents.getSize("width", 1);
            mouse_drag_x = evt.screenX;
            mouse_drag_y = evt.screenY;
            viewSize = CKEDITOR.document.getWindow().getViewPaneSize();
            CKEDITOR.document.on("mousemove", mouseMoveHandler);
            CKEDITOR.document.on("mouseup", mouseUpHandler);
            if (CKEDITOR.env.ie6Compat) {
              el = optgroup.getChild(0).getFrameDocument();
              el.on("mousemove", mouseMoveHandler);
              el.on("mouseup", mouseUpHandler);
            }
            if (evt.preventDefault) {
              evt.preventDefault();
            }
          });
          dialog.on("load", function() {
            var rest = "";
            if (resizable == CKEDITOR.DIALOG_RESIZE_WIDTH) {
              rest = " cke_resizer_horizontal";
            } else {
              if (resizable == CKEDITOR.DIALOG_RESIZE_HEIGHT) {
                rest = " cke_resizer_vertical";
              }
            }
            rest = CKEDITOR.dom.element.createFromHtml('<div class="cke_resizer' + rest + " cke_resizer_" + editor.lang.dir + '" title="' + CKEDITOR.tools.htmlEncode(editor.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + hash + ', event )">' + (editor.lang.dir == "ltr" ? "\u25e2" : "\u25e3") + "</div>");
            dialog.parts.footer.append(rest, 1);
          });
          editor.on("destroy", function() {
            CKEDITOR.tools.removeFunction(hash);
          });
        }
      }
      function handle(ev) {
        ev.data.preventDefault(1);
      }
      function showCover(fn) {
        var win = CKEDITOR.document.getWindow();
        var config = fn.config;
        var backgroundColorStyle = config.dialog_backgroundCoverColor || "white";
        var backgroundCoverOpacity = config.dialog_backgroundCoverOpacity;
        var UNICODE_SPACES = config.baseFloatZIndex;
        config = CKEDITOR.tools.genKey(backgroundColorStyle, backgroundCoverOpacity, UNICODE_SPACES);
        var node = map[config];
        if (node) {
          node.show();
        } else {
          UNICODE_SPACES = ['<div tabIndex="-1" style="position: ', CKEDITOR.env.ie6Compat ? "absolute" : "fixed", "; z-index: ", UNICODE_SPACES, "; top: 0px; left: 0px; ", !CKEDITOR.env.ie6Compat ? "background-color: " + backgroundColorStyle : "", '" class="cke_dialog_background_cover">'];
          if (CKEDITOR.env.ie6Compat) {
            backgroundColorStyle = "<html><body style=\\'background-color:" + backgroundColorStyle + ";\\'></body></html>";
            UNICODE_SPACES.push('<iframe hidefocus="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:');
            UNICODE_SPACES.push("void((function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.write( '" + backgroundColorStyle + "' );document.close();") + "})())");
            UNICODE_SPACES.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>');
          }
          UNICODE_SPACES.push("</div>");
          node = CKEDITOR.dom.element.createFromHtml(UNICODE_SPACES.join(""));
          node.setOpacity(backgroundCoverOpacity != void 0 ? backgroundCoverOpacity : 0.5);
          node.on("keydown", handle);
          node.on("keypress", handle);
          node.on("keyup", handle);
          node.appendTo(CKEDITOR.document.getBody());
          map[config] = node;
        }
        fn.focusManager.add(node);
        optgroup = node;
        fn = function() {
          var size = win.getViewPaneSize();
          node.setStyles({
            width : size.width + "px",
            height : size.height + "px"
          });
        };
        var scrollFunc = function() {
          var dialogPos = win.getScrollPosition();
          var cursor = CKEDITOR.dialog._.currentTop;
          node.setStyles({
            left : dialogPos.x + "px",
            top : dialogPos.y + "px"
          });
          if (cursor) {
            do {
              dialogPos = cursor.getPosition();
              cursor.move(dialogPos.x, dialogPos.y);
            } while (cursor = cursor._.parentDialog);
          }
        };
        g = fn;
        win.on("resize", fn);
        fn();
        if (!CKEDITOR.env.mac || !CKEDITOR.env.webkit) {
          node.focus();
        }
        if (CKEDITOR.env.ie6Compat) {
          var myScrollHandler = function() {
            scrollFunc();
            arguments.callee.prevScrollHandler.apply(this, arguments);
          };
          win.$.setTimeout(function() {
            myScrollHandler.prevScrollHandler = window.onscroll || function() {
            };
            window.onscroll = myScrollHandler;
          }, 0);
          scrollFunc();
        }
      }
      function hideCover(self) {
        if (optgroup) {
          self.focusManager.remove(optgroup);
          self = CKEDITOR.document.getWindow();
          optgroup.hide();
          self.removeListener("resize", g);
          if (CKEDITOR.env.ie6Compat) {
            self.$.setTimeout(function() {
              window.onscroll = window.onscroll && window.onscroll.prevScrollHandler || null;
            }, 0);
          }
          g = null;
        }
      }
      var cssLength = CKEDITOR.tools.cssLength;
      var templateSource = '<div class="cke_reset_all {editorId} {editorDialogClass} {hidpi}" dir="{langDir}" lang="{langCode}" role="dialog" aria-labelledby="cke_dialog_title_{id}"><table class="cke_dialog ' + CKEDITOR.env.cssClass + ' cke_{langDir}" style="position:absolute" role="presentation"><tr><td role="presentation"><div class="cke_dialog_body" role="presentation"><div id="cke_dialog_title_{id}" class="cke_dialog_title" role="presentation"></div><a id="cke_dialog_close_button_{id}" class="cke_dialog_close_button" href="javascript:void(0)" title="{closeTitle}" role="button"><span class="cke_label">X</span></a><div id="cke_dialog_tabs_{id}" class="cke_dialog_tabs" role="tablist"></div><table class="cke_dialog_contents" role="presentation"><tr><td id="cke_dialog_contents_{id}" class="cke_dialog_contents_body" role="presentation"></td></tr><tr><td id="cke_dialog_footer_{id}" class="cke_dialog_footer" role="presentation"></td></tr></table></div></td></tr></table></div>';
      CKEDITOR.dialog = function(name, keepData) {
        function setupFocus() {
          var focusList = optgroup._.focusList;
          focusList.sort(function(a, b) {
            return a.tabIndex != b.tabIndex ? b.tabIndex - a.tabIndex : a.focusIndex - b.focusIndex;
          });
          var valuesLen = focusList.length;
          var i = 0;
          for (;i < valuesLen;i++) {
            focusList[i].focusIndex = i;
          }
        }
        function changeFocus(offset) {
          var focusList = optgroup._.focusList;
          offset = offset || 0;
          if (!(focusList.length < 1)) {
            var current = optgroup._.currentFocusIndex;
            try {
              focusList[current].getInputElement().$.blur();
            } catch (d) {
            }
            var currentIndex = current = (current + offset + focusList.length) % focusList.length;
            for (;offset && !focusList[currentIndex].isFocusable();) {
              currentIndex = (currentIndex + offset + focusList.length) % focusList.length;
              if (currentIndex == current) {
                break;
              }
            }
            focusList[currentIndex].focus();
            if (focusList[currentIndex].type == "text") {
              focusList[currentIndex].select();
            }
          }
        }
        function keydownHandler(evt) {
          if (optgroup == CKEDITOR.dialog._.currentTop) {
            var button = evt.data.getKeystroke();
            var rtl = name.lang.dir == "rtl";
            stack = memory = 0;
            if (button == 9 || button == CKEDITOR.SHIFT + 9) {
              button = button == CKEDITOR.SHIFT + 9;
              if (optgroup._.tabBarMode) {
                button = button ? initialize.call(optgroup) : listener.call(optgroup);
                optgroup.selectPage(button);
                optgroup._.tabs[button][0].focus();
              } else {
                changeFocus(button ? -1 : 1);
              }
              stack = 1;
            } else {
              if (button == CKEDITOR.ALT + 121 && (!optgroup._.tabBarMode && optgroup.getPageCount() > 1)) {
                optgroup._.tabBarMode = true;
                optgroup._.tabs[optgroup._.currentTabId][0].focus();
                stack = 1;
              } else {
                if ((button == 37 || button == 39) && optgroup._.tabBarMode) {
                  button = button == (rtl ? 39 : 37) ? initialize.call(optgroup) : listener.call(optgroup);
                  optgroup.selectPage(button);
                  optgroup._.tabs[button][0].focus();
                  stack = 1;
                } else {
                  if ((button == 13 || button == 32) && optgroup._.tabBarMode) {
                    this.selectPage(this._.currentTabId);
                    this._.tabBarMode = false;
                    this._.currentFocusIndex = -1;
                    changeFocus(1);
                    stack = 1;
                  } else {
                    if (button == 13) {
                      button = evt.data.getTarget();
                      if (!button.is("a", "button", "select", "textarea") && (!button.is("input") || button.$.type != "button")) {
                        if (button = this.getButton("ok")) {
                          CKEDITOR.tools.setTimeout(button.click, 0, button);
                        }
                        stack = 1;
                      }
                      memory = 1;
                    } else {
                      if (button == 27) {
                        if (button = this.getButton("cancel")) {
                          CKEDITOR.tools.setTimeout(button.click, 0, button);
                        } else {
                          if (this.fire("cancel", {
                            hide : true
                          }).hide !== false) {
                            this.hide();
                          }
                        }
                        memory = 1;
                      } else {
                        return;
                      }
                    }
                  }
                }
              }
            }
            cancel(evt);
          }
        }
        function cancel(evt) {
          if (stack) {
            evt.data.preventDefault(1);
          } else {
            if (memory) {
              evt.data.stopPropagation();
            }
          }
        }
        var definition = CKEDITOR.dialog._.dialogDefinitions[keepData];
        var data = CKEDITOR.tools.clone(options);
        var buttonsOrder = name.config.dialog_buttonsOrder || "OS";
        var i = name.lang.dir;
        var tabsToRemove = {};
        var stack;
        var memory;
        if (buttonsOrder == "OS" && CKEDITOR.env.mac || (buttonsOrder == "rtl" && i == "ltr" || buttonsOrder == "ltr" && i == "rtl")) {
          data.buttons.reverse();
        }
        definition = CKEDITOR.tools.extend(definition(name), data);
        definition = CKEDITOR.tools.clone(definition);
        definition = new definitionObject(this, definition);
        data = buildDialog(name);
        this._ = {
          editor : name,
          element : data.element,
          name : keepData,
          contentSize : {
            width : 0,
            height : 0
          },
          size : {
            width : 0,
            height : 0
          },
          contents : {},
          buttons : {},
          accessKeyMap : {},
          tabs : {},
          tabIdList : [],
          currentTabId : null,
          currentTabIndex : null,
          pageCount : 0,
          lastTab : null,
          tabBarMode : false,
          focusList : [],
          currentFocusIndex : 0,
          hasFocus : false
        };
        this.parts = data.parts;
        CKEDITOR.tools.setTimeout(function() {
          name.fire("ariaWidget", this.parts.contents);
        }, 0, this);
        data = {
          position : CKEDITOR.env.ie6Compat ? "absolute" : "fixed",
          top : 0,
          visibility : "hidden"
        };
        data[i == "rtl" ? "right" : "left"] = 0;
        this.parts.dialog.setStyles(data);
        CKEDITOR.event.call(this);
        this.definition = definition = CKEDITOR.fire("dialogDefinition", {
          name : keepData,
          definition : definition
        }, name).definition;
        if (!("removeDialogTabs" in name._) && name.config.removeDialogTabs) {
          data = name.config.removeDialogTabs.split(";");
          i = 0;
          for (;i < data.length;i++) {
            buttonsOrder = data[i].split(":");
            if (buttonsOrder.length == 2) {
              var removeDialogName = buttonsOrder[0];
              if (!tabsToRemove[removeDialogName]) {
                tabsToRemove[removeDialogName] = [];
              }
              tabsToRemove[removeDialogName].push(buttonsOrder[1]);
            }
          }
          name._.removeDialogTabs = tabsToRemove;
        }
        if (name._.removeDialogTabs && (tabsToRemove = name._.removeDialogTabs[keepData])) {
          i = 0;
          for (;i < tabsToRemove.length;i++) {
            definition.removeContents(tabsToRemove[i]);
          }
        }
        if (definition.onLoad) {
          this.on("load", definition.onLoad);
        }
        if (definition.onShow) {
          this.on("show", definition.onShow);
        }
        if (definition.onHide) {
          this.on("hide", definition.onHide);
        }
        if (definition.onOk) {
          this.on("ok", function(key) {
            name.fire("saveSnapshot");
            setTimeout(function() {
              name.fire("saveSnapshot");
            }, 0);
            if (definition.onOk.call(this, key) === false) {
              key.data.hide = false;
            }
          });
        }
        if (definition.onCancel) {
          this.on("cancel", function(key) {
            if (definition.onCancel.call(this, key) === false) {
              key.data.hide = false;
            }
          });
        }
        var optgroup = this;
        var iterContents = function(func) {
          var contents = optgroup._.contents;
          var c = false;
          var i;
          for (i in contents) {
            var j;
            for (j in contents[i]) {
              if (c = func.call(this, contents[i][j])) {
                return;
              }
            }
          }
        };
        this.on("ok", function(evt) {
          iterContents(function(optgroup) {
            if (optgroup.validate) {
              var retval = optgroup.validate(this);
              var invalid = typeof retval == "string" || retval === false;
              if (invalid) {
                evt.data.hide = false;
                evt.stop();
              }
              handleFieldValidated.call(optgroup, !invalid, typeof retval == "string" ? retval : void 0);
              return invalid;
            }
          });
        }, this, null, 0);
        this.on("cancel", function(evt) {
          iterContents(function(item) {
            if (item.isChanged()) {
              if (!name.config.dialog_noConfirmCancel && !confirm(name.lang.common.confirmCancel)) {
                evt.data.hide = false;
              }
              return true;
            }
          });
        }, this, null, 0);
        this.parts.close.on("click", function(evt) {
          if (this.fire("cancel", {
            hide : true
          }).hide !== false) {
            this.hide();
          }
          evt.data.preventDefault();
        }, this);
        this.changeFocus = changeFocus;
        var rvar = this._.element;
        name.focusManager.add(rvar, 1);
        this.on("show", function() {
          rvar.on("keydown", keydownHandler, this);
          if (CKEDITOR.env.gecko) {
            rvar.on("keypress", cancel, this);
          }
        });
        this.on("hide", function() {
          rvar.removeListener("keydown", keydownHandler);
          if (CKEDITOR.env.gecko) {
            rvar.removeListener("keypress", cancel);
          }
          iterContents(function(optgroup) {
            resetField.apply(optgroup);
          });
        });
        this.on("iframeAdded", function(evt) {
          (new CKEDITOR.dom.document(evt.data.iframe.$.contentWindow.document)).on("keydown", keydownHandler, this, null, 0);
        });
        this.on("show", function() {
          setupFocus();
          if (name.config.dialog_startupFocusTab && optgroup._.pageCount > 1) {
            optgroup._.tabBarMode = true;
            optgroup._.tabs[optgroup._.currentTabId][0].focus();
          } else {
            if (!this._.hasFocus) {
              this._.currentFocusIndex = -1;
              if (definition.onFocus) {
                var submenu = definition.onFocus.call(this);
                if (submenu) {
                  submenu.focus();
                }
              } else {
                changeFocus(1);
              }
            }
          }
        }, this, null, 4294967295);
        if (CKEDITOR.env.ie6Compat) {
          this.on("load", function() {
            var element = this.getElement();
            var dummy = element.getFirst();
            dummy.remove();
            dummy.appendTo(element);
          }, this);
        }
        initDragAndDrop(this);
        initResizeHandles(this);
        (new CKEDITOR.dom.text(definition.title, CKEDITOR.document)).appendTo(this.parts.title);
        i = 0;
        for (;i < definition.contents.length;i++) {
          if (tabsToRemove = definition.contents[i]) {
            this.addPage(tabsToRemove);
          }
        }
        this.parts.tabs.on("click", function(evt) {
          var target = evt.data.getTarget();
          if (target.hasClass("cke_dialog_tab")) {
            target = target.$.id;
            this.selectPage(target.substring(4, target.lastIndexOf("_")));
            if (this._.tabBarMode) {
              this._.tabBarMode = false;
              this._.currentFocusIndex = -1;
              changeFocus(1);
            }
            evt.data.preventDefault();
          }
        }, this);
        i = [];
        tabsToRemove = CKEDITOR.dialog._.uiElementBuilders.hbox.build(this, {
          type : "hbox",
          className : "cke_dialog_footer_buttons",
          widths : [],
          children : definition.buttons
        }, i).getChild();
        this.parts.footer.setHtml(i.join(""));
        i = 0;
        for (;i < tabsToRemove.length;i++) {
          this._.buttons[tabsToRemove[i].id] = tabsToRemove[i];
        }
      };
      CKEDITOR.dialog.prototype = {
        destroy : function() {
          this.hide();
          this._.element.remove();
        },
        resize : function() {
          return function(width, height) {
            if (!this._.contentSize || !(this._.contentSize.width == width && this._.contentSize.height == height)) {
              CKEDITOR.dialog.fire("resize", {
                dialog : this,
                width : width,
                height : height
              }, this._.editor);
              this.fire("resize", {
                width : width,
                height : height
              }, this._.editor);
              this.parts.contents.setStyles({
                width : width + "px",
                height : height + "px"
              });
              if (this._.editor.lang.dir == "rtl" && this._.position) {
                this._.position.x = CKEDITOR.document.getWindow().getViewPaneSize().width - this._.contentSize.width - parseInt(this._.element.getFirst().getStyle("right"), 10);
              }
              this._.contentSize = {
                width : width,
                height : height
              };
            }
          };
        }(),
        getSize : function() {
          var container = this._.element.getFirst();
          return{
            width : container.$.offsetWidth || 0,
            height : container.$.offsetHeight || 0
          };
        },
        move : function(x, y, dataAndEvents) {
          var element = this._.element.getFirst();
          var rtl = this._.editor.lang.dir == "rtl";
          var size = element.getComputedStyle("position") == "fixed";
          if (CKEDITOR.env.ie) {
            element.setStyle("zoom", "100%");
          }
          if (!size || (!this._.position || !(this._.position.x == x && this._.position.y == y))) {
            this._.position = {
              x : x,
              y : y
            };
            if (!size) {
              size = CKEDITOR.document.getWindow().getScrollPosition();
              x = x + size.x;
              y = y + size.y;
            }
            if (rtl) {
              size = this.getSize();
              x = CKEDITOR.document.getWindow().getViewPaneSize().width - size.width - x;
            }
            y = {
              top : (y > 0 ? y : 0) + "px"
            };
            y[rtl ? "right" : "left"] = (x > 0 ? x : 0) + "px";
            element.setStyles(y);
            if (dataAndEvents) {
              this._.moved = 1;
            }
          }
        },
        getPosition : function() {
          return CKEDITOR.tools.extend({}, this._.position);
        },
        show : function() {
          var element = this._.element;
          var definition = this.definition;
          if (!element.getParent() || !element.getParent().equals(CKEDITOR.document.getBody())) {
            element.appendTo(CKEDITOR.document.getBody());
          } else {
            element.setStyle("display", "block");
          }
          this.resize(this._.contentSize && this._.contentSize.width || (definition.width || definition.minWidth), this._.contentSize && this._.contentSize.height || (definition.height || definition.minHeight));
          this.reset();
          this.selectPage(this.definition.contents[0].id);
          if (CKEDITOR.dialog._.currentZIndex === null) {
            CKEDITOR.dialog._.currentZIndex = this._.editor.config.baseFloatZIndex;
          }
          this._.element.getFirst().setStyle("z-index", CKEDITOR.dialog._.currentZIndex = CKEDITOR.dialog._.currentZIndex + 10);
          if (CKEDITOR.dialog._.currentTop === null) {
            CKEDITOR.dialog._.currentTop = this;
            this._.parentDialog = null;
            showCover(this._.editor);
          } else {
            this._.parentDialog = CKEDITOR.dialog._.currentTop;
            this._.parentDialog.getElement().getFirst().$.style.zIndex -= Math.floor(this._.editor.config.baseFloatZIndex / 2);
            CKEDITOR.dialog._.currentTop = this;
          }
          element.on("keydown", onKeyDown);
          element.on("keyup", accessKeyUpHandler);
          this._.hasFocus = false;
          var i;
          for (i in definition.contents) {
            if (definition.contents[i]) {
              element = definition.contents[i];
              var tab = this._.tabs[element.id];
              var url = element.requiredContent;
              var seen = 0;
              if (tab) {
                var last;
                for (last in this._.contents[element.id]) {
                  var elem = this._.contents[element.id][last];
                  if (!(elem.type == "hbox" || (elem.type == "vbox" || !elem.getInputElement()))) {
                    if (elem.requiredContent && !this._.editor.activeFilter.check(elem.requiredContent)) {
                      elem.disable();
                    } else {
                      elem.enable();
                      seen++;
                    }
                  }
                }
                if (!seen || url && !this._.editor.activeFilter.check(url)) {
                  tab[0].addClass("cke_dialog_tab_disabled");
                } else {
                  tab[0].removeClass("cke_dialog_tab_disabled");
                }
              }
            }
          }
          CKEDITOR.tools.setTimeout(function() {
            this.layout();
            resizeWithWindow(this);
            this.parts.dialog.setStyle("visibility", "");
            this.fireOnce("load", {});
            CKEDITOR.ui.fire("ready", this);
            this.fire("show", {});
            this._.editor.fire("dialogShow", this);
            if (!this._.parentDialog) {
              this._.editor.focusManager.lock();
            }
            this.foreach(function(contentObj) {
              if (contentObj.setInitValue) {
                contentObj.setInitValue();
              }
            });
          }, 100, this);
        },
        layout : function() {
          var dialogElement = this.parts.dialog;
          var dialogSize = this.getSize();
          var viewPaneSize = CKEDITOR.document.getWindow().getViewPaneSize();
          var posX = (viewPaneSize.width - dialogSize.width) / 2;
          var posY = (viewPaneSize.height - dialogSize.height) / 2;
          if (!CKEDITOR.env.ie6Compat) {
            if (dialogSize.height + (posY > 0 ? posY : 0) > viewPaneSize.height || dialogSize.width + (posX > 0 ? posX : 0) > viewPaneSize.width) {
              dialogElement.setStyle("position", "absolute");
            } else {
              dialogElement.setStyle("position", "fixed");
            }
          }
          this.move(this._.moved ? this._.position.x : posX, this._.moved ? this._.position.y : posY);
        },
        foreach : function(fn) {
          var i;
          for (i in this._.contents) {
            var key;
            for (key in this._.contents[i]) {
              fn.call(this, this._.contents[i][key]);
            }
          }
          return this;
        },
        reset : function() {
          var fn = function(record) {
            if (record.reset) {
              record.reset(1);
            }
          };
          return function() {
            this.foreach(fn);
            return this;
          };
        }(),
        setupContent : function() {
          var key = arguments;
          this.foreach(function(optgroup) {
            if (optgroup.setup) {
              optgroup.setup.apply(optgroup, key);
            }
          });
        },
        commitContent : function() {
          var key = arguments;
          this.foreach(function(optgroup) {
            if (CKEDITOR.env.ie) {
              if (this._.currentFocusIndex == optgroup.focusIndex) {
                optgroup.getInputElement().$.blur();
              }
            }
            if (optgroup.commit) {
              optgroup.commit.apply(optgroup, key);
            }
          });
        },
        hide : function() {
          if (this.parts.dialog.isVisible()) {
            this.fire("hide", {});
            this._.editor.fire("dialogHide", this);
            this.selectPage(this._.tabIdList[0]);
            var element = this._.element;
            element.setStyle("display", "none");
            this.parts.dialog.setStyle("visibility", "hidden");
            unregisterAccessKey(this);
            for (;CKEDITOR.dialog._.currentTop != this;) {
              CKEDITOR.dialog._.currentTop.hide();
            }
            if (this._.parentDialog) {
              var el = this._.parentDialog.getElement().getFirst();
              el.setStyle("z-index", parseInt(el.$.style.zIndex, 10) + Math.floor(this._.editor.config.baseFloatZIndex / 2));
            } else {
              hideCover(this._.editor);
            }
            if (CKEDITOR.dialog._.currentTop = this._.parentDialog) {
              CKEDITOR.dialog._.currentZIndex = CKEDITOR.dialog._.currentZIndex - 10;
            } else {
              CKEDITOR.dialog._.currentZIndex = null;
              element.removeListener("keydown", onKeyDown);
              element.removeListener("keyup", accessKeyUpHandler);
              var editor = this._.editor;
              editor.focus();
              setTimeout(function() {
                editor.focusManager.unlock();
              }, 0);
            }
            delete this._.parentDialog;
            this.foreach(function(contentObj) {
              if (contentObj.resetInitValue) {
                contentObj.resetInitValue();
              }
            });
          }
        },
        addPage : function(contents) {
          if (!contents.requiredContent || this._.editor.filter.check(contents.requiredContent)) {
            var page = [];
            var tab = contents.label ? ' title="' + CKEDITOR.tools.htmlEncode(contents.label) + '"' : "";
            var cursor = CKEDITOR.dialog._.uiElementBuilders.vbox.build(this, {
              type : "vbox",
              className : "cke_dialog_page_contents",
              children : contents.elements,
              expand : !!contents.expand,
              padding : contents.padding,
              style : contents.style || "width: 100%;"
            }, page);
            var tabId = this._.contents[contents.id] = {};
            var optgroup = cursor.getChild();
            var h = 0;
            for (;cursor = optgroup.shift();) {
              if (!cursor.notAllowed) {
                if (cursor.type != "hbox" && cursor.type != "vbox") {
                  h++;
                }
              }
              tabId[cursor.id] = cursor;
              if (typeof cursor.getChild == "function") {
                optgroup.push.apply(optgroup, cursor.getChild());
              }
            }
            if (!h) {
              contents.hidden = true;
            }
            page = CKEDITOR.dom.element.createFromHtml(page.join(""));
            page.setAttribute("role", "tabpanel");
            cursor = CKEDITOR.env;
            tabId = "cke_" + contents.id + "_" + CKEDITOR.tools.getNextNumber();
            tab = CKEDITOR.dom.element.createFromHtml(['<a class="cke_dialog_tab"', this._.pageCount > 0 ? " cke_last" : "cke_first", tab, contents.hidden ? ' style="display:none"' : "", ' id="', tabId, '"', cursor.gecko && !cursor.hc ? "" : ' href="javascript:void(0)"', ' tabIndex="-1" hidefocus="true" role="tab">', contents.label, "</a>"].join(""));
            page.setAttribute("aria-labelledby", tabId);
            this._.tabs[contents.id] = [tab, page];
            this._.tabIdList.push(contents.id);
            if (!contents.hidden) {
              this._.pageCount++;
            }
            this._.lastTab = tab;
            this.updateStyle();
            page.setAttribute("name", contents.id);
            page.appendTo(this.parts.contents);
            tab.unselectable();
            this.parts.tabs.append(tab);
            if (contents.accessKey) {
              registerAccessKey(this, this, "CTRL+" + contents.accessKey, tabAccessKeyDown, tabAccessKeyUp);
              this._.accessKeyMap["CTRL+" + contents.accessKey] = contents.id;
            }
          }
        },
        selectPage : function(id) {
          if (this._.currentTabId != id && (!this._.tabs[id][0].hasClass("cke_dialog_tab_disabled") && this.fire("selectPage", {
            page : id,
            currentPage : this._.currentTabId
          }) !== false)) {
            var i;
            for (i in this._.tabs) {
              var tab = this._.tabs[i][0];
              var page = this._.tabs[i][1];
              if (i != id) {
                tab.removeClass("cke_dialog_tab_selected");
                page.hide();
              }
              page.setAttribute("aria-hidden", i != id);
            }
            var selected = this._.tabs[id];
            selected[0].addClass("cke_dialog_tab_selected");
            if (CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat) {
              clearOrRecoverTextInputValue(selected[1]);
              selected[1].show();
              setTimeout(function() {
                clearOrRecoverTextInputValue(selected[1], 1);
              }, 0);
            } else {
              selected[1].show();
            }
            this._.currentTabId = id;
            this._.currentTabIndex = CKEDITOR.tools.indexOf(this._.tabIdList, id);
          }
        },
        updateStyle : function() {
          this.parts.dialog[(this._.pageCount === 1 ? "add" : "remove") + "Class"]("cke_single_page");
        },
        hidePage : function(id) {
          var me = this._.tabs[id] && this._.tabs[id][0];
          if (me && (this._.pageCount != 1 && me.isVisible())) {
            if (id == this._.currentTabId) {
              this.selectPage(initialize.call(this));
            }
            me.hide();
            this._.pageCount--;
            this.updateStyle();
          }
        },
        showPage : function(index) {
          if (index = this._.tabs[index] && this._.tabs[index][0]) {
            index.show();
            this._.pageCount++;
            this.updateStyle();
          }
        },
        getElement : function() {
          return this._.element;
        },
        getName : function() {
          return this._.name;
        },
        getContentElement : function(type, element) {
          var map = this._.contents[type];
          return map && map[element];
        },
        getValueOf : function(element, el) {
          return this.getContentElement(element, el).getValue();
        },
        setValueOf : function(value, id, isXML) {
          return this.getContentElement(value, id).setValue(isXML);
        },
        getButton : function(id) {
          return this._.buttons[id];
        },
        click : function(id) {
          return this._.buttons[id].click();
        },
        disableButton : function(id) {
          return this._.buttons[id].disable();
        },
        enableButton : function(id) {
          return this._.buttons[id].enable();
        },
        getPageCount : function() {
          return this._.pageCount;
        },
        getParentEditor : function() {
          return this._.editor;
        },
        getSelectedElement : function() {
          return this.getParentEditor().getSelection().getSelectedElement();
        },
        addFocusable : function(element, index) {
          if (typeof index == "undefined") {
            index = this._.focusList.length;
            this._.focusList.push(new Focusable(this, element, index));
          } else {
            this._.focusList.splice(index, 0, new Focusable(this, element, index));
            var i = index + 1;
            for (;i < this._.focusList.length;i++) {
              this._.focusList[i].focusIndex++;
            }
          }
        }
      };
      CKEDITOR.tools.extend(CKEDITOR.dialog, {
        add : function(name, expectedNumberOfNonCommentArgs) {
          if (!this._.dialogDefinitions[name] || typeof expectedNumberOfNonCommentArgs == "function") {
            this._.dialogDefinitions[name] = expectedNumberOfNonCommentArgs;
          }
        },
        exists : function(name) {
          return!!this._.dialogDefinitions[name];
        },
        getCurrent : function() {
          return CKEDITOR.dialog._.currentTop;
        },
        isTabEnabled : function(editor, var_args, key) {
          editor = editor.config.removeDialogTabs;
          return!(editor && editor.match(RegExp("(?:^|;)" + var_args + ":" + key + "(?:$|;)", "i")));
        },
        okButton : function() {
          var retval = function(editor, override) {
            override = override || {};
            return CKEDITOR.tools.extend({
              id : "ok",
              type : "button",
              label : editor.lang.common.ok,
              "class" : "cke_dialog_ui_button_ok",
              onClick : function(dialog) {
                dialog = dialog.data.dialog;
                if (dialog.fire("ok", {
                  hide : true
                }).hide !== false) {
                  dialog.hide();
                }
              }
            }, override, true);
          };
          retval.type = "button";
          retval.override = function(override) {
            return CKEDITOR.tools.extend(function(editor) {
              return retval(editor, override);
            }, {
              type : "button"
            }, true);
          };
          return retval;
        }(),
        cancelButton : function() {
          var retval = function(editor, override) {
            override = override || {};
            return CKEDITOR.tools.extend({
              id : "cancel",
              type : "button",
              label : editor.lang.common.cancel,
              "class" : "cke_dialog_ui_button_cancel",
              onClick : function(dialog) {
                dialog = dialog.data.dialog;
                if (dialog.fire("cancel", {
                  hide : true
                }).hide !== false) {
                  dialog.hide();
                }
              }
            }, override, true);
          };
          retval.type = "button";
          retval.override = function(override) {
            return CKEDITOR.tools.extend(function(editor) {
              return retval(editor, override);
            }, {
              type : "button"
            }, true);
          };
          return retval;
        }(),
        addUIElement : function(name, value) {
          this._.uiElementBuilders[name] = value;
        }
      });
      CKEDITOR.dialog._ = {
        uiElementBuilders : {},
        dialogDefinitions : {},
        currentTop : null,
        currentZIndex : null
      };
      CKEDITOR.event.implementOn(CKEDITOR.dialog);
      CKEDITOR.event.implementOn(CKEDITOR.dialog.prototype);
      var options = {
        resizable : CKEDITOR.DIALOG_RESIZE_BOTH,
        minWidth : 600,
        minHeight : 400,
        buttons : [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton]
      };
      var getById = function(array, id, recurse) {
        var _i = 0;
        var item;
        for (;item = array[_i];_i++) {
          if (item.id == id) {
            return item;
          }
          if (recurse && item[recurse]) {
            if (item = getById(item[recurse], id, recurse)) {
              return item;
            }
          }
        }
        return null;
      };
      var addById = function(array, newItem, nextSiblingId, recurse, dataAndEvents) {
        if (nextSiblingId) {
          var i = 0;
          var item;
          for (;item = array[i];i++) {
            if (item.id == nextSiblingId) {
              array.splice(i, 0, newItem);
              return newItem;
            }
            if (recurse && item[recurse]) {
              if (item = addById(item[recurse], newItem, nextSiblingId, recurse, true)) {
                return item;
              }
            }
          }
          if (dataAndEvents) {
            return null;
          }
        }
        array.push(newItem);
        return newItem;
      };
      var removeById = function(array, id, recurse) {
        var i = 0;
        var item;
        for (;item = array[i];i++) {
          if (item.id == id) {
            return array.splice(i, 1);
          }
          if (recurse && item[recurse]) {
            if (item = removeById(item[recurse], id, recurse)) {
              return item;
            }
          }
        }
        return null;
      };
      var definitionObject = function(dialog, dialogDefinition) {
        this.dialog = dialog;
        var contents = dialogDefinition.contents;
        var i = 0;
        var content;
        for (;content = contents[i];i++) {
          contents[i] = content && new contentObject(dialog, content);
        }
        CKEDITOR.tools.extend(this, dialogDefinition);
      };
      definitionObject.prototype = {
        getContents : function(id) {
          return getById(this.contents, id);
        },
        getButton : function(id) {
          return getById(this.buttons, id);
        },
        addContents : function(contentDefinition, nextSiblingId) {
          return addById(this.contents, contentDefinition, nextSiblingId);
        },
        addButton : function(cmd, opt_attributes) {
          return addById(this.buttons, cmd, opt_attributes);
        },
        removeContents : function(id) {
          removeById(this.contents, id);
        },
        removeButton : function(id) {
          removeById(this.buttons, id);
        }
      };
      contentObject.prototype = {
        get : function(name) {
          return getById(this.elements, name, "children");
        },
        add : function(name, expectedNumberOfNonCommentArgs) {
          return addById(this.elements, name, expectedNumberOfNonCommentArgs, "children");
        },
        remove : function(name) {
          removeById(this.elements, name, "children");
        }
      };
      var g;
      var map = {};
      var optgroup;
      var events = {};
      var onKeyDown = function(evt) {
        var keyProcessor = evt.data.$.ctrlKey || evt.data.$.metaKey;
        var alt = evt.data.$.altKey;
        var shift = evt.data.$.shiftKey;
        var pad = String.fromCharCode(evt.data.$.keyCode);
        if ((keyProcessor = events[(keyProcessor ? "CTRL+" : "") + (alt ? "ALT+" : "") + (shift ? "SHIFT+" : "") + pad]) && keyProcessor.length) {
          keyProcessor = keyProcessor[keyProcessor.length - 1];
          if (keyProcessor.keydown) {
            keyProcessor.keydown.call(keyProcessor.uiElement, keyProcessor.dialog, keyProcessor.key);
          }
          evt.data.preventDefault();
        }
      };
      var accessKeyUpHandler = function(evt) {
        var keyProcessor = evt.data.$.ctrlKey || evt.data.$.metaKey;
        var alt = evt.data.$.altKey;
        var shift = evt.data.$.shiftKey;
        var pad = String.fromCharCode(evt.data.$.keyCode);
        if ((keyProcessor = events[(keyProcessor ? "CTRL+" : "") + (alt ? "ALT+" : "") + (shift ? "SHIFT+" : "") + pad]) && keyProcessor.length) {
          keyProcessor = keyProcessor[keyProcessor.length - 1];
          if (keyProcessor.keyup) {
            keyProcessor.keyup.call(keyProcessor.uiElement, keyProcessor.dialog, keyProcessor.key);
            evt.data.preventDefault();
          }
        }
      };
      var registerAccessKey = function(uiElement, key, name, downFunc, upFunc) {
        (events[name] || (events[name] = [])).push({
          uiElement : uiElement,
          dialog : key,
          key : name,
          keyup : upFunc || uiElement.accessKeyUp,
          keydown : downFunc || uiElement.accessKeyDown
        });
      };
      var unregisterAccessKey = function(obj) {
        var type;
        for (type in events) {
          var list = events[type];
          var j = list.length - 1;
          for (;j >= 0;j--) {
            if (list[j].dialog == obj || list[j].uiElement == obj) {
              list.splice(j, 1);
            }
          }
          if (list.length === 0) {
            delete events[type];
          }
        }
      };
      var tabAccessKeyUp = function(dialog, key) {
        if (dialog._.accessKeyMap[key]) {
          dialog.selectPage(dialog._.accessKeyMap[key]);
        }
      };
      var tabAccessKeyDown = function() {
      };
      (function() {
        CKEDITOR.ui.dialog = {
          uiElement : function(key, optgroup, htmlList, nodeNameArg, attributesArg, stylesArg, contentsArg) {
            if (!(arguments.length < 4)) {
              var tagName = (nodeNameArg.call ? nodeNameArg(optgroup) : nodeNameArg) || "div";
              var tagNameArr = ["<", tagName, " "];
              var styles = (attributesArg && attributesArg.call ? attributesArg(optgroup) : attributesArg) || {};
              var attributes = (stylesArg && stylesArg.call ? stylesArg(optgroup) : stylesArg) || {};
              var sign = (contentsArg && contentsArg.call ? contentsArg.call(this, key, optgroup) : contentsArg) || "";
              var i = this.domId = attributes.id || CKEDITOR.tools.getNextId() + "_uiElement";
              this.id = optgroup.id;
              if (optgroup.requiredContent && !key.getParentEditor().filter.check(optgroup.requiredContent)) {
                styles.display = "none";
                this.notAllowed = true;
              }
              attributes.id = i;
              var classes = {};
              if (optgroup.type) {
                classes["cke_dialog_ui_" + optgroup.type] = 1;
              }
              if (optgroup.className) {
                classes[optgroup.className] = 1;
              }
              if (optgroup.disabled) {
                classes.cke_disabled = 1;
              }
              var a = attributes["class"] && attributes["class"].split ? attributes["class"].split(" ") : [];
              i = 0;
              for (;i < a.length;i++) {
                if (a[i]) {
                  classes[a[i]] = 1;
                }
              }
              a = [];
              for (i in classes) {
                a.push(i);
              }
              attributes["class"] = a.join(" ");
              if (optgroup.title) {
                attributes.title = optgroup.title;
              }
              classes = (optgroup.style || "").split(";");
              if (optgroup.align) {
                a = optgroup.align;
                styles["margin-left"] = a == "left" ? 0 : "auto";
                styles["margin-right"] = a == "right" ? 0 : "auto";
              }
              for (i in styles) {
                classes.push(i + ":" + styles[i]);
              }
              if (optgroup.hidden) {
                classes.push("display:none");
              }
              i = classes.length - 1;
              for (;i >= 0;i--) {
                if (classes[i] === "") {
                  classes.splice(i, 1);
                }
              }
              if (classes.length > 0) {
                attributes.style = (attributes.style ? attributes.style + "; " : "") + classes.join("; ");
              }
              for (i in attributes) {
                tagNameArr.push(i + '="' + CKEDITOR.tools.htmlEncode(attributes[i]) + '" ');
              }
              tagNameArr.push(">", sign, "</", tagName, ">");
              htmlList.push(tagNameArr.join(""));
              (this._ || (this._ = {})).dialog = key;
              if (typeof optgroup.isChanged == "boolean") {
                this.isChanged = function() {
                  return optgroup.isChanged;
                };
              }
              if (typeof optgroup.isChanged == "function") {
                this.isChanged = optgroup.isChanged;
              }
              if (typeof optgroup.setValue == "function") {
                this.setValue = CKEDITOR.tools.override(this.setValue, function(next_callback) {
                  return function(key) {
                    next_callback.call(this, optgroup.setValue.call(this, key));
                  };
                });
              }
              if (typeof optgroup.getValue == "function") {
                this.getValue = CKEDITOR.tools.override(this.getValue, function(next_callback) {
                  return function() {
                    return optgroup.getValue.call(this, next_callback.call(this));
                  };
                });
              }
              CKEDITOR.event.implementOn(this);
              this.registerEvents(optgroup);
              if (this.accessKeyUp) {
                if (this.accessKeyDown && optgroup.accessKey) {
                  registerAccessKey(this, key, "CTRL+" + optgroup.accessKey);
                }
              }
              var me = this;
              key.on("load", function() {
                var input = me.getInputElement();
                if (input) {
                  var className = me.type in {
                    checkbox : 1,
                    ratio : 1
                  } && (CKEDITOR.env.ie && CKEDITOR.env.version < 8) ? "cke_dialog_ui_focused" : "";
                  input.on("focus", function() {
                    key._.tabBarMode = false;
                    key._.hasFocus = true;
                    me.fire("focus");
                    if (className) {
                      this.addClass(className);
                    }
                  });
                  input.on("blur", function() {
                    me.fire("blur");
                    if (className) {
                      this.removeClass(className);
                    }
                  });
                }
              });
              CKEDITOR.tools.extend(this, optgroup);
              if (this.keyboardFocusable) {
                this.tabIndex = optgroup.tabIndex || 0;
                this.focusIndex = key._.focusList.push(this) - 1;
                this.on("focus", function() {
                  key._.currentFocusIndex = me.focusIndex;
                });
              }
            }
          },
          hbox : function(key, childObjList, childHtmlList, duration, elementDefinition) {
            if (!(arguments.length < 4)) {
              if (!this._) {
                this._ = {};
              }
              var children = this._.children = childObjList;
              var widths = elementDefinition && elementDefinition.widths || null;
              var udataCur = elementDefinition && elementDefinition.height || null;
              var i;
              var attribs = {
                role : "presentation"
              };
              if (elementDefinition) {
                if (elementDefinition.align) {
                  attribs.align = elementDefinition.align;
                }
              }
              CKEDITOR.ui.dialog.uiElement.call(this, key, elementDefinition || {
                type : "hbox"
              }, duration, "table", {}, attribs, function() {
                var html = ['<tbody><tr class="cke_dialog_ui_hbox">'];
                i = 0;
                for (;i < childHtmlList.length;i++) {
                  var className = "cke_dialog_ui_hbox_child";
                  var leaks = [];
                  if (i === 0) {
                    className = "cke_dialog_ui_hbox_first";
                  }
                  if (i == childHtmlList.length - 1) {
                    className = "cke_dialog_ui_hbox_last";
                  }
                  html.push('<td class="', className, '" role="presentation" ');
                  if (widths) {
                    if (widths[i]) {
                      leaks.push("width:" + cssLength(widths[i]));
                    }
                  } else {
                    leaks.push("width:" + Math.floor(100 / childHtmlList.length) + "%");
                  }
                  if (udataCur) {
                    leaks.push("height:" + cssLength(udataCur));
                  }
                  if (elementDefinition) {
                    if (elementDefinition.padding != void 0) {
                      leaks.push("padding:" + cssLength(elementDefinition.padding));
                    }
                  }
                  if (CKEDITOR.env.ie) {
                    if (CKEDITOR.env.quirks && children[i].align) {
                      leaks.push("text-align:" + children[i].align);
                    }
                  }
                  if (leaks.length > 0) {
                    html.push('style="' + leaks.join("; ") + '" ');
                  }
                  html.push(">", childHtmlList[i], "</td>");
                }
                html.push("</tr></tbody>");
                return html.join("");
              });
            }
          },
          vbox : function(key, childObjList, childHtmlList, duration, elementDefinition) {
            if (!(arguments.length < 3)) {
              if (!this._) {
                this._ = {};
              }
              var children = this._.children = childObjList;
              var width = elementDefinition && elementDefinition.width || null;
              var widths = elementDefinition && elementDefinition.heights || null;
              CKEDITOR.ui.dialog.uiElement.call(this, key, elementDefinition || {
                type : "vbox"
              }, duration, "div", null, {
                role : "presentation"
              }, function() {
                var html = ['<table role="presentation" cellspacing="0" border="0" '];
                html.push('style="');
                if (elementDefinition) {
                  if (elementDefinition.expand) {
                    html.push("height:100%;");
                  }
                }
                html.push("width:" + cssLength(width || "100%"), ";");
                if (CKEDITOR.env.webkit) {
                  html.push("float:none;");
                }
                html.push('"');
                html.push('align="', CKEDITOR.tools.htmlEncode(elementDefinition && elementDefinition.align || (key.getParentEditor().lang.dir == "ltr" ? "left" : "right")), '" ');
                html.push("><tbody>");
                var i = 0;
                for (;i < childHtmlList.length;i++) {
                  var leaks = [];
                  html.push('<tr><td role="presentation" ');
                  if (width) {
                    leaks.push("width:" + cssLength(width || "100%"));
                  }
                  if (widths) {
                    leaks.push("height:" + cssLength(widths[i]));
                  } else {
                    if (elementDefinition) {
                      if (elementDefinition.expand) {
                        leaks.push("height:" + Math.floor(100 / childHtmlList.length) + "%");
                      }
                    }
                  }
                  if (elementDefinition) {
                    if (elementDefinition.padding != void 0) {
                      leaks.push("padding:" + cssLength(elementDefinition.padding));
                    }
                  }
                  if (CKEDITOR.env.ie) {
                    if (CKEDITOR.env.quirks && children[i].align) {
                      leaks.push("text-align:" + children[i].align);
                    }
                  }
                  if (leaks.length > 0) {
                    html.push('style="', leaks.join("; "), '" ');
                  }
                  html.push(' class="cke_dialog_ui_vbox_child">', childHtmlList[i], "</td></tr>");
                }
                html.push("</tbody></table>");
                return html.join("");
              });
            }
          }
        };
      })();
      CKEDITOR.ui.dialog.uiElement.prototype = {
        getElement : function() {
          return CKEDITOR.document.getById(this.domId);
        },
        getInputElement : function() {
          return this.getElement();
        },
        getDialog : function() {
          return this._.dialog;
        },
        setValue : function(value, dataAndEvents) {
          this.getInputElement().setValue(value);
          if (!dataAndEvents) {
            this.fire("change", {
              value : value
            });
          }
          return this;
        },
        getValue : function() {
          return this.getInputElement().getValue();
        },
        isChanged : function() {
          return false;
        },
        selectParentTab : function() {
          var el = this.getInputElement();
          for (;(el = el.getParent()) && el.$.className.search("cke_dialog_page_contents") == -1;) {
          }
          if (!el) {
            return this;
          }
          el = el.getAttribute("name");
          if (this._.dialog._.currentTabId != el) {
            this._.dialog.selectPage(el);
          }
          return this;
        },
        focus : function() {
          this.selectParentTab().getInputElement().focus();
          return this;
        },
        registerEvents : function(definition) {
          var optgroup = /^on([A-Z]\w+)/;
          var options;
          var registerDomEvent = function(uiElement, dialog, eventName, one) {
            dialog.on("load", function() {
              uiElement.getInputElement().on(eventName, one, uiElement);
            });
          };
          var i;
          for (i in definition) {
            if (options = i.match(optgroup)) {
              if (this.eventProcessors[i]) {
                this.eventProcessors[i].call(this, this._.dialog, definition[i]);
              } else {
                registerDomEvent(this, this._.dialog, options[1].toLowerCase(), definition[i]);
              }
            }
          }
          return this;
        },
        eventProcessors : {
          onLoad : function(dialog, fn) {
            dialog.on("load", fn, this);
          },
          onShow : function(dialog, fn) {
            dialog.on("show", fn, this);
          },
          onHide : function(e, handler) {
            e.on("hide", handler, this);
          }
        },
        accessKeyDown : function() {
          this.focus();
        },
        accessKeyUp : function() {
        },
        disable : function() {
          var element = this.getElement();
          this.getInputElement().setAttribute("disabled", "true");
          element.addClass("cke_disabled");
        },
        enable : function() {
          var element = this.getElement();
          this.getInputElement().removeAttribute("disabled");
          element.removeClass("cke_disabled");
        },
        isEnabled : function() {
          return!this.getElement().hasClass("cke_disabled");
        },
        isVisible : function() {
          return this.getInputElement().isVisible();
        },
        isFocusable : function() {
          return!this.isEnabled() || !this.isVisible() ? false : true;
        }
      };
      CKEDITOR.ui.dialog.hbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
        getChild : function(indices) {
          if (arguments.length < 1) {
            return this._.children.concat();
          }
          if (!indices.splice) {
            indices = [indices];
          }
          return indices.length < 2 ? this._.children[indices[0]] : this._.children[indices[0]] && this._.children[indices[0]].getChild ? this._.children[indices[0]].getChild(indices.slice(1, indices.length)) : null;
        }
      }, true);
      CKEDITOR.ui.dialog.vbox.prototype = new CKEDITOR.ui.dialog.hbox;
      (function() {
        var udataCur = {
          build : function(name, elementDefinition, data) {
            var children = elementDefinition.children;
            var child;
            var eventPath = [];
            var call_order = [];
            var i = 0;
            for (;i < children.length && (child = children[i]);i++) {
              var pdataCur = [];
              eventPath.push(pdataCur);
              call_order.push(CKEDITOR.dialog._.uiElementBuilders[child.type].build(name, child, pdataCur));
            }
            return new CKEDITOR.ui.dialog[elementDefinition.type](name, call_order, eventPath, data, elementDefinition);
          }
        };
        CKEDITOR.dialog.addUIElement("hbox", udataCur);
        CKEDITOR.dialog.addUIElement("vbox", udataCur);
      })();
      CKEDITOR.dialogCommand = function(dialogName, ext) {
        this.dialogName = dialogName;
        CKEDITOR.tools.extend(this, ext, true);
      };
      CKEDITOR.dialogCommand.prototype = {
        exec : function(editor) {
          editor.openDialog(this.dialogName);
        },
        canUndo : false,
        editorFocus : 1
      };
      (function() {
        var rclass = /^([a]|[^a])+$/;
        var r20 = /^\d*$/;
        var rreturn = /^\d*(?:\.\d+)?$/;
        var QUnit = /^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/;
        var rchecked = /^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i;
        var infore = /^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;
        CKEDITOR.VALIDATE_OR = 1;
        CKEDITOR.VALIDATE_AND = 2;
        CKEDITOR.dialog.validate = {
          functions : function() {
            var args = arguments;
            return function() {
              var value = this && this.getValue ? this.getValue() : args[0];
              var msg = void 0;
              var relation = CKEDITOR.VALIDATE_AND;
              var functions = [];
              var i;
              i = 0;
              for (;i < args.length;i++) {
                if (typeof args[i] == "function") {
                  functions.push(args[i]);
                } else {
                  break;
                }
              }
              if (i < args.length && typeof args[i] == "string") {
                msg = args[i];
                i++;
              }
              if (i < args.length) {
                if (typeof args[i] == "number") {
                  relation = args[i];
                }
              }
              var passed = relation == CKEDITOR.VALIDATE_AND ? true : false;
              i = 0;
              for (;i < functions.length;i++) {
                passed = relation == CKEDITOR.VALIDATE_AND ? passed && functions[i](value) : passed || functions[i](value);
              }
              return!passed ? msg : true;
            };
          },
          regex : function(regex, msgString) {
            return function(part) {
              part = this && this.getValue ? this.getValue() : part;
              return!regex.test(part) ? msgString : true;
            };
          },
          notEmpty : function(msg) {
            return this.regex(rclass, msg);
          },
          integer : function(msg) {
            return this.regex(r20, msg);
          },
          number : function(msg) {
            return this.regex(rreturn, msg);
          },
          cssLength : function(value) {
            return this.functions(function(msg) {
              return rchecked.test(CKEDITOR.tools.trim(msg));
            }, value);
          },
          htmlLength : function(msg) {
            return this.functions(function(actual) {
              return QUnit.test(CKEDITOR.tools.trim(actual));
            }, msg);
          },
          inlineStyle : function(msg) {
            return this.functions(function(msg) {
              return infore.test(CKEDITOR.tools.trim(msg));
            }, msg);
          },
          equals : function(node, msg) {
            return this.functions(function(p) {
              return p == node;
            }, msg);
          },
          notEqual : function(expected, msg) {
            return this.functions(function(actual) {
              return actual != expected;
            }, msg);
          }
        };
        CKEDITOR.on("instanceDestroyed", function(obj) {
          if (CKEDITOR.tools.isEmpty(CKEDITOR.instances)) {
            var currentTopDialog;
            for (;currentTopDialog = CKEDITOR.dialog._.currentTop;) {
              currentTopDialog.hide();
            }
            var letter;
            for (letter in map) {
              map[letter].remove();
            }
            map = {};
          }
          obj = obj.editor._.storedDialogs;
          var key;
          for (key in obj) {
            obj[key].destroy();
          }
        });
      })();
      CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
        openDialog : function(dialogName, callback) {
          var name = null;
          var dialogDefinitions = CKEDITOR.dialog._.dialogDefinitions[dialogName];
          if (CKEDITOR.dialog._.currentTop === null) {
            showCover(this);
          }
          if (typeof dialogDefinitions == "function") {
            name = this._.storedDialogs || (this._.storedDialogs = {});
            name = name[dialogName] || (name[dialogName] = new CKEDITOR.dialog(this, dialogName));
            if (callback) {
              callback.call(name, name);
            }
            name.show();
          } else {
            if (dialogDefinitions == "failed") {
              hideCover(this);
              throw Error('[CKEDITOR.dialog.openDialog] Dialog "' + dialogName + '" failed when loading definition.');
            }
            if (typeof dialogDefinitions == "string") {
              CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(dialogDefinitions), function() {
                if (typeof CKEDITOR.dialog._.dialogDefinitions[dialogName] != "function") {
                  CKEDITOR.dialog._.dialogDefinitions[dialogName] = "failed";
                }
                this.openDialog(dialogName, callback);
              }, this, 0, 1);
            }
          }
          CKEDITOR.skin.loadPart("dialog");
          return name;
        }
      });
    })();
    CKEDITOR.plugins.add("dialog", {
      requires : "dialogui",
      init : function(editor) {
        editor.on("doubleclick", function(evt) {
          if (evt.data.dialog) {
            editor.openDialog(evt.data.dialog);
          }
        }, null, null, 999);
      }
    });
    CKEDITOR.plugins.colordialog = {
      requires : "dialog",
      init : function(editor) {
        var cmd = new CKEDITOR.dialogCommand("colordialog");
        cmd.editorFocus = false;
        editor.addCommand("colordialog", cmd);
        CKEDITOR.dialog.add("colordialog", this.path + "dialogs/colordialog.js");
        editor.getColorFromDialog = function(select, optgroup) {
          var listener = function(key) {
            this.removeListener("ok", listener);
            this.removeListener("cancel", listener);
            key = key.name == "ok" ? this.getValueOf("picker", "selectedColor") : null;
            select.call(optgroup, key);
          };
          var bindToDialog = function(socket) {
            socket.on("ok", listener);
            socket.on("cancel", listener);
          };
          editor.execCommand("colordialog");
          if (editor._.storedDialogs && editor._.storedDialogs.colordialog) {
            bindToDialog(editor._.storedDialogs.colordialog);
          } else {
            CKEDITOR.on("dialogDefinition", function(e) {
              if (e.data.name == "colordialog") {
                var definition = e.data.definition;
                e.removeListener();
                definition.onLoad = CKEDITOR.tools.override(definition.onLoad, function(orginal) {
                  return function() {
                    bindToDialog(this);
                    definition.onLoad = orginal;
                    if (typeof orginal == "function") {
                      orginal.call(this);
                    }
                  };
                });
              }
            });
          }
        };
      }
    };
    CKEDITOR.plugins.add("colordialog", CKEDITOR.plugins.colordialog);
    "use strict";
    (function() {
      function initClipboard(editor) {
        function addListenersToEditable() {
          var editable = editor.editable();
          editable.on(rvar, function(evt) {
            if (!CKEDITOR.env.ie || !u) {
              pasteDataFromClipboard(evt);
            }
          });
          if (CKEDITOR.env.ie) {
            editable.on("paste", function(evt) {
              if (!B) {
                preventPasteEventNow();
                evt.data.preventDefault();
                pasteDataFromClipboard(evt);
                if (!execIECommand("paste")) {
                  editor.openDialog("paste");
                }
              }
            });
          }
          if (CKEDITOR.env.ie) {
            editable.on("contextmenu", one, null, null, 0);
            editable.on("beforepaste", function(evt) {
              if (evt.data) {
                if (!evt.data.$.ctrlKey) {
                  one();
                }
              }
            }, null, null, 0);
          }
          editable.on("beforecut", function() {
            if (!u) {
              fixCut(editor);
            }
          });
          var tref;
          editable.attachListener(CKEDITOR.env.ie ? editable : editor.document.getDocumentElement(), "mouseup", function() {
            tref = setTimeout(function() {
              setToolbarStates();
            }, 0);
          });
          editor.on("destroy", function() {
            clearTimeout(tref);
          });
          editable.on("keyup", setToolbarStates);
        }
        function createCutCopyCmd(type) {
          return{
            type : type,
            canUndo : type == "cut",
            startDisabled : true,
            exec : function() {
              if (this.type == "cut") {
                fixCut();
              }
              var match;
              var type = this.type;
              if (CKEDITOR.env.ie) {
                match = execIECommand(type);
              } else {
                try {
                  match = editor.document.$.execCommand(type, false, null);
                } catch (d) {
                  match = false;
                }
              }
              if (!match) {
                alert(editor.lang.clipboard[this.type + "Error"]);
              }
              return match;
            }
          };
        }
        function createPasteCmd() {
          return{
            canUndo : false,
            async : true,
            exec : function(editor, text) {
              var fire = function(data, dataAndEvents) {
                if (data) {
                  firePasteEvents(data.type, data.dataValue, !!dataAndEvents);
                }
                editor.fire("afterCommandExec", {
                  name : "paste",
                  command : cmd,
                  returnValue : !!data
                });
              };
              var cmd = this;
              if (typeof text == "string") {
                fire({
                  type : "auto",
                  dataValue : text
                }, 1);
              } else {
                editor.getClipboardData(fire);
              }
            }
          };
        }
        function preventPasteEventNow() {
          B = 1;
          setTimeout(function() {
            B = 0;
          }, 100);
        }
        function one() {
          u = 1;
          setTimeout(function() {
            u = 0;
          }, 10);
        }
        function execIECommand(name) {
          var doc = editor.document;
          var object = doc.getBody();
          var enabled = false;
          var fn = function() {
            enabled = true;
          };
          object.on(name, fn);
          (CKEDITOR.env.version > 7 ? doc.$ : doc.$.selection.createRange()).execCommand(name);
          object.removeListener(name, fn);
          return enabled;
        }
        function firePasteEvents(data, type, recurring) {
          data = {
            type : data
          };
          if (recurring && editor.fire("beforePaste", data) === false || !type) {
            return false;
          }
          data.dataValue = type;
          return editor.fire("paste", data);
        }
        function fixCut() {
          if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
            var sel = editor.getSelection();
            var control;
            var range;
            var dummy;
            if (sel.getType() == CKEDITOR.SELECTION_ELEMENT && (control = sel.getSelectedElement())) {
              range = sel.getRanges()[0];
              dummy = editor.document.createText("");
              dummy.insertBefore(control);
              range.setStartBefore(dummy);
              range.setEndAfter(control);
              sel.selectRanges([range]);
              setTimeout(function() {
                if (control.getParent()) {
                  dummy.remove();
                  sel.selectElement(control);
                }
              }, 0);
            }
          }
        }
        function getClipboardDataByPastebin(evt, callback) {
          var doc = editor.document;
          var editable = editor.editable();
          var cancel = function(val) {
            val.cancel();
          };
          var blurListener;
          if (!doc.getById("cke_pastebin")) {
            var selection = editor.getSelection();
            var bookmarks = selection.createBookmarks();
            var pastebin = new CKEDITOR.dom.element((CKEDITOR.env.webkit || editable.is("body")) && !CKEDITOR.env.ie ? "body" : "div", doc);
            pastebin.setAttributes({
              id : "cke_pastebin",
              "data-cke-temp" : "1"
            });
            var range = 0;
            doc = doc.getWindow();
            if (CKEDITOR.env.webkit) {
              editable.append(pastebin);
              pastebin.addClass("cke_editable");
              if (!editable.is("body")) {
                range = editable.getComputedStyle("position") != "static" ? editable : CKEDITOR.dom.element.get(editable.$.offsetParent);
                range = range.getDocumentPosition().y;
              }
            } else {
              editable.getAscendant(CKEDITOR.env.ie ? "body" : "html", 1).append(pastebin);
            }
            pastebin.setStyles({
              position : "absolute",
              top : doc.getScrollPosition().y - range + 10 + "px",
              width : "1px",
              height : Math.max(1, doc.getViewPaneSize().height - 20) + "px",
              overflow : "hidden",
              margin : 0,
              padding : 0
            });
            if (range = pastebin.getParent().isReadOnly()) {
              pastebin.setOpacity(0);
              pastebin.setAttribute("contenteditable", true);
            } else {
              pastebin.setStyle(editor.config.contentsLangDirection == "ltr" ? "left" : "right", "-1000px");
            }
            editor.on("selectionChange", cancel, null, null, 0);
            if (CKEDITOR.env.webkit || CKEDITOR.env.gecko) {
              blurListener = editable.once("blur", cancel, null, null, -100);
            }
            if (range) {
              pastebin.focus();
            }
            range = new CKEDITOR.dom.range(pastebin);
            range.selectNodeContents(pastebin);
            var lastSel = range.select();
            if (CKEDITOR.env.ie) {
              blurListener = editable.once("blur", function() {
                editor.lockSelection(lastSel);
              });
            }
            var cy = CKEDITOR.document.getWindow().getScrollPosition().y;
            setTimeout(function() {
              if (CKEDITOR.env.webkit) {
                CKEDITOR.document.getBody().$.scrollTop = cy;
              }
              if (blurListener) {
                blurListener.removeListener();
              }
              if (CKEDITOR.env.ie) {
                editable.focus();
              }
              selection.selectBookmarks(bookmarks);
              pastebin.remove();
              var bogusSpan;
              if (CKEDITOR.env.webkit && ((bogusSpan = pastebin.getFirst()) && (bogusSpan.is && bogusSpan.hasClass("Apple-style-span")))) {
                pastebin = bogusSpan;
              }
              editor.removeListener("selectionChange", cancel);
              callback(pastebin.getHtml());
            }, 0);
          }
        }
        function getClipboardDataDirectly() {
          if (CKEDITOR.env.ie) {
            editor.focus();
            preventPasteEventNow();
            var focusManager = editor.focusManager;
            focusManager.lock();
            if (editor.editable().fire(rvar) && !execIECommand("paste")) {
              focusManager.unlock();
              return false;
            }
            focusManager.unlock();
          } else {
            try {
              if (editor.editable().fire(rvar) && !editor.document.$.execCommand("Paste", false, null)) {
                throw 0;
              }
            } catch (c) {
              return false;
            }
          }
          return true;
        }
        function onKey(evt) {
          if (editor.mode == "wysiwyg") {
            switch(evt.data.keyCode) {
              case CKEDITOR.CTRL + 86:
              ;
              case CKEDITOR.SHIFT + 45:
                evt = editor.editable();
                preventPasteEventNow();
                if (!CKEDITOR.env.ie) {
                  evt.fire("beforepaste");
                }
                break;
              case CKEDITOR.CTRL + 88:
              ;
              case CKEDITOR.SHIFT + 46:
                editor.fire("saveSnapshot");
                setTimeout(function() {
                  editor.fire("saveSnapshot");
                }, 50);
            }
          }
        }
        function pasteDataFromClipboard(evt) {
          var eventData = {
            type : "auto"
          };
          var beforePasteNotCanceled = editor.fire("beforePaste", eventData);
          getClipboardDataByPastebin(evt, function(data) {
            data = data.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, "");
            if (beforePasteNotCanceled) {
              firePasteEvents(eventData.type, data, 0, 1);
            }
          });
        }
        function setToolbarStates() {
          if (editor.mode == "wysiwyg") {
            var value = stateFromNamedCommand("paste");
            editor.getCommand("cut").setState(stateFromNamedCommand("cut"));
            editor.getCommand("copy").setState(stateFromNamedCommand("copy"));
            editor.getCommand("paste").setState(value);
            editor.fire("pasteState", value);
          }
        }
        function stateFromNamedCommand(command) {
          if (inReadOnly && command in {
            paste : 1,
            cut : 1
          }) {
            return CKEDITOR.TRISTATE_DISABLED;
          }
          if (command == "paste") {
            return CKEDITOR.TRISTATE_OFF;
          }
          command = editor.getSelection();
          var codeSegments = command.getRanges();
          return command.getType() == CKEDITOR.SELECTION_NONE || codeSegments.length == 1 && codeSegments[0].collapsed ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF;
        }
        var u = 0;
        var B = 0;
        var inReadOnly = 0;
        var rvar = CKEDITOR.env.ie ? "beforepaste" : "paste";
        (function() {
          editor.on("key", onKey);
          editor.on("contentDom", addListenersToEditable);
          editor.on("selectionChange", function(ev) {
            inReadOnly = ev.data.selection.getRanges()[0].checkReadOnly();
            setToolbarStates();
          });
          if (editor.contextMenu) {
            editor.contextMenu.addListener(function(dataAndEvents, selection) {
              inReadOnly = selection.getRanges()[0].checkReadOnly();
              return{
                cut : stateFromNamedCommand("cut"),
                copy : stateFromNamedCommand("copy"),
                paste : stateFromNamedCommand("paste")
              };
            });
          }
        })();
        (function() {
          function addButtonCommand(command, commandName, opt_attributes, expectedNumberOfNonCommentArgs, ctxMenuOrder) {
            var lang = editor.lang.clipboard[commandName];
            editor.addCommand(commandName, opt_attributes);
            if (editor.ui.addButton) {
              editor.ui.addButton(command, {
                label : lang,
                command : commandName,
                toolbar : "clipboard," + expectedNumberOfNonCommentArgs
              });
            }
            if (editor.addMenuItems) {
              editor.addMenuItem(commandName, {
                label : lang,
                command : commandName,
                group : "clipboard",
                order : ctxMenuOrder
              });
            }
          }
          addButtonCommand("Cut", "cut", createCutCopyCmd("cut"), 10, 1);
          addButtonCommand("Copy", "copy", createCutCopyCmd("copy"), 20, 4);
          addButtonCommand("Paste", "paste", createPasteCmd(), 30, 8);
        })();
        editor.getClipboardData = function(options, callback) {
          function cancel(evt) {
            evt.removeListener();
            evt.cancel();
            callback(evt.data);
          }
          function handler(e) {
            e.removeListener();
            e.cancel();
            j = true;
            callback({
              type : dataType,
              dataValue : e.data
            });
          }
          function onDialogOpen() {
            this.customTitle = options && options.title;
          }
          var beforePasteNotCanceled = false;
          var dataType = "auto";
          var j = false;
          if (!callback) {
            callback = options;
            options = null;
          }
          editor.on("paste", cancel, null, null, 0);
          editor.on("beforePaste", function(e) {
            e.removeListener();
            beforePasteNotCanceled = true;
            dataType = e.data.type;
          }, null, null, 1E3);
          if (getClipboardDataDirectly() === false) {
            editor.removeListener("paste", cancel);
            if (beforePasteNotCanceled && editor.fire("pasteDialog", onDialogOpen)) {
              editor.on("pasteDialogCommit", handler);
              editor.on("dialogHide", function(evt) {
                evt.removeListener();
                evt.data.removeListener("pasteDialogCommit", handler);
                setTimeout(function() {
                  if (!j) {
                    callback(null);
                  }
                }, 10);
              });
            } else {
              callback(null);
            }
          }
        };
      }
      function recogniseContentType(data) {
        if (CKEDITOR.env.webkit) {
          if (!data.match(/^[^<]*$/g) && !data.match(/^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi)) {
            return "html";
          }
        } else {
          if (CKEDITOR.env.ie) {
            if (!data.match(/^([^<]|<br( ?\/)?>)*$/gi) && !data.match(/^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi)) {
              return "html";
            }
          } else {
            if (CKEDITOR.env.gecko) {
              if (!data.match(/^([^<]|<br( ?\/)?>)*$/gi)) {
                return "html";
              }
            } else {
              return "html";
            }
          }
        }
        return "htmlifiedtext";
      }
      function htmlifiedTextHtmlification(config, data) {
        function repeatParagraphs(repeats) {
          return CKEDITOR.tools.repeat("</p><p>", ~~(repeats / 2)) + (repeats % 2 == 1 ? "<br>" : "");
        }
        data = data.replace(/\s+/g, " ").replace(/> +</g, "><").replace(/<br ?\/>/gi, "<br>");
        data = data.replace(/<\/?[A-Z]+>/g, function(m3) {
          return m3.toLowerCase();
        });
        if (data.match(/^[^<]$/)) {
          return data;
        }
        if (CKEDITOR.env.webkit && data.indexOf("<div>") > -1) {
          data = data.replace(/^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g, "<br>").replace(/^(<div>(<br>|)<\/div>){2}(?!$)/g, "<div></div>");
          if (data.match(/<div>(<br>|)<\/div>/)) {
            data = "<p>" + data.replace(/(<div>(<br>|)<\/div>)+/g, function(pair) {
              return repeatParagraphs(pair.split("</div><div>").length + 1);
            }) + "</p>";
          }
          data = data.replace(/<\/div><div>/g, "<br>");
          data = data.replace(/<\/?div>/g, "");
        }
        if (CKEDITOR.env.gecko && config.enterMode != CKEDITOR.ENTER_BR) {
          if (CKEDITOR.env.gecko) {
            data = data.replace(/^<br><br>$/, "<br>");
          }
          if (data.indexOf("<br><br>") > -1) {
            data = "<p>" + data.replace(/(<br>){2,}/g, function(newlines) {
              return repeatParagraphs(newlines.length / 4);
            }) + "</p>";
          }
        }
        return switchEnterMode(config, data);
      }
      function getTextificationFilter() {
        var filter = new CKEDITOR.htmlParser.filter;
        var replaceWithParaIf = {
          blockquote : 1,
          dl : 1,
          fieldset : 1,
          h1 : 1,
          h2 : 1,
          h3 : 1,
          h4 : 1,
          h5 : 1,
          h6 : 1,
          ol : 1,
          p : 1,
          table : 1,
          ul : 1
        };
        var stripInlineIf = CKEDITOR.tools.extend({
          br : 0
        }, CKEDITOR.dtd.$inline);
        var allowedIf = {
          p : 1,
          br : 1,
          "cke:br" : 1
        };
        var knownIf = CKEDITOR.dtd;
        var removeIf = CKEDITOR.tools.extend({
          area : 1,
          basefont : 1,
          embed : 1,
          iframe : 1,
          map : 1,
          object : 1,
          param : 1
        }, CKEDITOR.dtd.$nonBodyContent, CKEDITOR.dtd.$cdata);
        var flattenTableCell = function(name) {
          delete name.name;
          name.add(new CKEDITOR.htmlParser.text(" "));
        };
        var squashHeader = function(name) {
          var info = name;
          var optgroup;
          for (;(info = info.next) && (info.name && info.name.match(/^h\d$/));) {
            optgroup = new CKEDITOR.htmlParser.element("cke:br");
            optgroup.isEmpty = true;
            name.add(optgroup);
            for (;optgroup = info.children.shift();) {
              name.add(optgroup);
            }
          }
        };
        filter.addRules({
          elements : {
            h1 : squashHeader,
            h2 : squashHeader,
            h3 : squashHeader,
            h4 : squashHeader,
            h5 : squashHeader,
            h6 : squashHeader,
            img : function(name) {
              name = CKEDITOR.tools.trim(name.attributes.alt || "");
              var text = " ";
              if (name) {
                if (!name.match(/(^http|\.(jpe?g|gif|png))/i)) {
                  text = " [" + name + "] ";
                }
              }
              return new CKEDITOR.htmlParser.text(text);
            },
            td : flattenTableCell,
            th : flattenTableCell,
            $ : function(name) {
              var initialName = name.name;
              var optgroup;
              if (removeIf[initialName]) {
                return false;
              }
              name.attributes = {};
              if (initialName == "br") {
                return name;
              }
              if (replaceWithParaIf[initialName]) {
                name.name = "p";
              } else {
                if (stripInlineIf[initialName]) {
                  delete name.name;
                } else {
                  if (knownIf[initialName]) {
                    optgroup = new CKEDITOR.htmlParser.element("cke:br");
                    optgroup.isEmpty = true;
                    if (CKEDITOR.dtd.$empty[initialName]) {
                      return optgroup;
                    }
                    name.add(optgroup, 0);
                    optgroup = optgroup.clone();
                    optgroup.isEmpty = true;
                    name.add(optgroup);
                    delete name.name;
                  }
                }
              }
              if (!allowedIf[name.name]) {
                delete name.name;
              }
              return name;
            }
          }
        }, {
          applyToAll : true
        });
        return filter;
      }
      function htmlTextification(config, data, optgroup) {
        data = new CKEDITOR.htmlParser.fragment.fromHtml(data);
        var writer = new CKEDITOR.htmlParser.basicWriter;
        data.writeHtml(writer, optgroup);
        data = writer.getHtml();
        data = data.replace(/\s*(<\/?[a-z:]+ ?\/?>)\s*/g, "$1").replace(/(<cke:br \/>){2,}/g, "<cke:br />").replace(/(<cke:br \/>)(<\/?p>|<br \/>)/g, "$2").replace(/(<\/?p>|<br \/>)(<cke:br \/>)/g, "$1").replace(/<(cke:)?br( \/)?>/g, "<br>").replace(/<p><\/p>/g, "");
        var e = 0;
        data = data.replace(/<\/?p>/g, function(match) {
          if (match == "<p>") {
            if (++e > 1) {
              return "</p><p>";
            }
          } else {
            if (--e > 0) {
              return "</p><p>";
            }
          }
          return match;
        }).replace(/<p><\/p>/g, "");
        return switchEnterMode(config, data);
      }
      function switchEnterMode(config, data) {
        if (config.enterMode == CKEDITOR.ENTER_BR) {
          data = data.replace(/(<\/p><p>)+/g, function(newlines) {
            return CKEDITOR.tools.repeat("<br>", newlines.length / 7 * 2);
          }).replace(/<\/?p>/g, "");
        } else {
          if (config.enterMode == CKEDITOR.ENTER_DIV) {
            data = data.replace(/<(\/)?p>/g, "<$1div>");
          }
        }
        return data;
      }
      CKEDITOR.plugins.add("clipboard", {
        requires : "dialog",
        init : function(editor) {
          var textificationFilter;
          initClipboard(editor);
          CKEDITOR.dialog.add("paste", CKEDITOR.getUrl(this.path + "dialogs/paste.js"));
          editor.on("paste", function(evt) {
            var data = evt.data.dataValue;
            var blockElements = CKEDITOR.dtd.$block;
            if (data.indexOf("Apple-") > -1) {
              data = data.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi, " ");
              if (evt.data.type != "html") {
                data = data.replace(/<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi, function(dataAndEvents, messageFormat) {
                  return messageFormat.replace(/\t/g, "&nbsp;&nbsp; &nbsp;");
                });
              }
              if (data.indexOf('<br class="Apple-interchange-newline">') > -1) {
                evt.data.startsWithEOL = 1;
                evt.data.preSniffing = "html";
                data = data.replace(/<br class="Apple-interchange-newline">/, "");
              }
              data = data.replace(/(<[^>]+) class="Apple-[^"]*"/gi, "$1");
            }
            if (data.match(/^<[^<]+cke_(editable|contents)/i)) {
              var tmp;
              var editable_wrapper;
              var wrapper = new CKEDITOR.dom.element("div");
              wrapper.setHtml(data);
              for (;wrapper.getChildCount() == 1 && ((tmp = wrapper.getFirst()) && (tmp.type == CKEDITOR.NODE_ELEMENT && (tmp.hasClass("cke_editable") || tmp.hasClass("cke_contents"))));) {
                wrapper = editable_wrapper = tmp;
              }
              if (editable_wrapper) {
                data = editable_wrapper.getHtml().replace(/<br>$/i, "");
              }
            }
            if (CKEDITOR.env.ie) {
              data = data.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g, function(dataAndEvents, m3) {
                if (m3.toLowerCase() in blockElements) {
                  evt.data.preSniffing = "html";
                  return "<" + m3;
                }
                return dataAndEvents;
              });
            } else {
              if (CKEDITOR.env.webkit) {
                data = data.replace(/<\/(\w+)><div><br><\/div>$/, function(dataAndEvents, elementName) {
                  if (elementName in blockElements) {
                    evt.data.endsWithEOL = 1;
                    return "</" + elementName + ">";
                  }
                  return dataAndEvents;
                });
              } else {
                if (CKEDITOR.env.gecko) {
                  data = data.replace(/(\s)<br>$/, "$1");
                }
              }
            }
            evt.data.dataValue = data;
          }, null, null, 3);
          editor.on("paste", function(dataObj) {
            dataObj = dataObj.data;
            var type = dataObj.type;
            var data = dataObj.dataValue;
            var trueType;
            var defaultType = editor.config.clipboard_defaultContentType || "html";
            trueType = type == "html" || dataObj.preSniffing == "html" ? "html" : recogniseContentType(data);
            if (trueType == "htmlifiedtext") {
              data = htmlifiedTextHtmlification(editor.config, data);
            } else {
              if (type == "text") {
                if (trueType == "html") {
                  data = htmlTextification(editor.config, data, textificationFilter || (textificationFilter = getTextificationFilter(editor)));
                }
              }
            }
            if (dataObj.startsWithEOL) {
              data = '<br data-cke-eol="1">' + data;
            }
            if (dataObj.endsWithEOL) {
              data = data + '<br data-cke-eol="1">';
            }
            if (type == "auto") {
              type = trueType == "html" || defaultType == "html" ? "html" : "text";
            }
            dataObj.type = type;
            dataObj.dataValue = data;
            delete dataObj.preSniffing;
            delete dataObj.startsWithEOL;
            delete dataObj.endsWithEOL;
          }, null, null, 6);
          editor.on("paste", function(data) {
            data = data.data;
            editor.insertHtml(data.dataValue, data.type);
            setTimeout(function() {
              editor.fire("afterPaste");
            }, 0);
          }, null, null, 1E3);
          editor.on("pasteDialog", function(evt) {
            setTimeout(function() {
              editor.openDialog("paste", evt.data);
            }, 0);
          });
        }
      });
    })();
    (function() {
      CKEDITOR.plugins.add("panel", {
        beforeInit : function(editor) {
          editor.ui.addHandler(CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler);
        }
      });
      CKEDITOR.UI_PANEL = "panel";
      CKEDITOR.ui.panel = function(doc, definition) {
        if (definition) {
          CKEDITOR.tools.extend(this, definition);
        }
        CKEDITOR.tools.extend(this, {
          className : "",
          css : []
        });
        this.id = CKEDITOR.tools.getNextId();
        this.document = doc;
        this.isFramed = this.forceIFrame || this.css.length;
        this._ = {
          blocks : {}
        };
      };
      CKEDITOR.ui.panel.handler = {
        create : function(var_args) {
          return new CKEDITOR.ui.panel(var_args);
        }
      };
      var parent = CKEDITOR.addTemplate("panel", '<div lang="{langCode}" id="{id}" dir={dir} class="cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style="z-index:{z-index}" role="presentation">{frame}</div>');
      var frameTpl = CKEDITOR.addTemplate("panel-frame", '<iframe id="{id}" class="cke_panel_frame" role="presentation" frameborder="0" src="{src}"></iframe>');
      var frameDocTpl = CKEDITOR.addTemplate("panel-frame-inner", '<!DOCTYPE html><html class="cke_panel_container {env}" dir="{dir}" lang="{langCode}"><head>{css}</head><body class="cke_{dir}" style="margin:0;padding:0" onload="{onload}"></body></html>');
      CKEDITOR.ui.panel.prototype = {
        render : function(editor, params) {
          this.getHolderElement = function() {
            var holder = this._.holder;
            if (!holder) {
              if (this.isFramed) {
                holder = this.document.getById(this.id + "_frame");
                var parentDiv = holder.getParent();
                holder = holder.getFrameDocument();
                if (CKEDITOR.env.iOS) {
                  parentDiv.setStyles({
                    overflow : "scroll",
                    "-webkit-overflow-scrolling" : "touch"
                  });
                }
                parentDiv = CKEDITOR.tools.addFunction(CKEDITOR.tools.bind(function() {
                  this.isLoaded = true;
                  if (this.onLoad) {
                    this.onLoad();
                  }
                }, this));
                holder.write(frameDocTpl.output(CKEDITOR.tools.extend({
                  css : CKEDITOR.tools.buildStyleHtml(this.css),
                  onload : "window.parent.CKEDITOR.tools.callFunction(" + parentDiv + ");"
                }, optgroup)));
                holder.getWindow().$.CKEDITOR = CKEDITOR;
                holder.on("keydown", function(evt) {
                  var keystroke = evt.data.getKeystroke();
                  var dir = this.document.getById(this.id).getAttribute("dir");
                  if (this._.onKeyDown && this._.onKeyDown(keystroke) === false) {
                    evt.data.preventDefault();
                  } else {
                    if (keystroke == 27 || keystroke == (dir == "rtl" ? 39 : 37)) {
                      if (this.onEscape) {
                        if (this.onEscape(keystroke) === false) {
                          evt.data.preventDefault();
                        }
                      }
                    }
                  }
                }, this);
                holder = holder.getBody();
                holder.unselectable();
                if (CKEDITOR.env.air) {
                  CKEDITOR.tools.callFunction(parentDiv);
                }
              } else {
                holder = this.document.getById(this.id);
              }
              this._.holder = holder;
            }
            return holder;
          };
          var optgroup = {
            editorId : editor.id,
            id : this.id,
            langCode : editor.langCode,
            dir : editor.lang.dir,
            cls : this.className,
            frame : "",
            env : CKEDITOR.env.cssClass,
            "z-index" : editor.config.baseFloatZIndex + 1
          };
          if (this.isFramed) {
            var source = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())" : "";
            optgroup.frame = frameTpl.output({
              id : this.id + "_frame",
              src : source
            });
          }
          source = parent.output(optgroup);
          if (params) {
            params.push(source);
          }
          return source;
        },
        addBlock : function(name, block) {
          block = this._.blocks[name] = block instanceof CKEDITOR.ui.panel.block ? block : new CKEDITOR.ui.panel.block(this.getHolderElement(), block);
          if (!this._.currentBlock) {
            this.showBlock(name);
          }
          return block;
        },
        getBlock : function(name) {
          return this._.blocks[name];
        },
        showBlock : function(block) {
          block = this._.blocks[block];
          var current = this._.currentBlock;
          var holder = !this.forceIFrame || CKEDITOR.env.ie ? this._.holder : this.document.getById(this.id + "_frame");
          if (current) {
            current.hide();
          }
          this._.currentBlock = block;
          CKEDITOR.fire("ariaWidget", holder);
          block._.focusIndex = -1;
          this._.onKeyDown = block.onKeyDown && CKEDITOR.tools.bind(block.onKeyDown, block);
          block.show();
          return block;
        },
        destroy : function() {
          if (this.element) {
            this.element.remove();
          }
        }
      };
      CKEDITOR.ui.panel.block = CKEDITOR.tools.createClass({
        $ : function(name, keepData) {
          this.element = name.append(name.getDocument().createElement("div", {
            attributes : {
              tabindex : -1,
              "class" : "cke_panel_block"
            },
            styles : {
              display : "none"
            }
          }));
          if (keepData) {
            CKEDITOR.tools.extend(this, keepData);
          }
          this.element.setAttributes({
            role : this.attributes.role || "presentation",
            "aria-label" : this.attributes["aria-label"],
            title : this.attributes.title || this.attributes["aria-label"]
          });
          this.keys = {};
          this._.focusIndex = -1;
          this.element.disableContextMenu();
        },
        _ : {
          markItem : function(index) {
            if (index != -1) {
              index = this.element.getElementsByTag("a").getItem(this._.focusIndex = index);
              if (CKEDITOR.env.webkit) {
                index.getDocument().getWindow().focus();
              }
              index.focus();
              if (this.onMark) {
                this.onMark(index);
              }
            }
          }
        },
        proto : {
          show : function() {
            this.element.setStyle("display", "");
          },
          hide : function() {
            if (!this.onHide || this.onHide.call(this) !== true) {
              this.element.setStyle("display", "none");
            }
          },
          onKeyDown : function(keystroke, dataAndEvents) {
            var keyAction = this.keys[keystroke];
            switch(keyAction) {
              case "next":
                var index = this._.focusIndex;
                keyAction = this.element.getElementsByTag("a");
                var link;
                for (;link = keyAction.getItem(++index);) {
                  if (link.getAttribute("_cke_focus") && link.$.offsetWidth) {
                    this._.focusIndex = index;
                    link.focus();
                    break;
                  }
                }
                if (!link && !dataAndEvents) {
                  this._.focusIndex = -1;
                  return this.onKeyDown(keystroke, 1);
                }
                return false;
              case "prev":
                index = this._.focusIndex;
                keyAction = this.element.getElementsByTag("a");
                for (;index > 0 && (link = keyAction.getItem(--index));) {
                  if (link.getAttribute("_cke_focus") && link.$.offsetWidth) {
                    this._.focusIndex = index;
                    link.focus();
                    break;
                  }
                  link = null;
                }
                if (!link && !dataAndEvents) {
                  this._.focusIndex = keyAction.count();
                  return this.onKeyDown(keystroke, 1);
                }
                return false;
              case "click":
              ;
              case "mouseup":
                index = this._.focusIndex;
                if (link = index >= 0 && this.element.getElementsByTag("a").getItem(index)) {
                  if (link.$[keyAction]) {
                    link.$[keyAction]();
                  } else {
                    link.$["on" + keyAction]();
                  }
                }
                return false;
            }
            return true;
          }
        }
      });
    })();
    CKEDITOR.plugins.add("floatpanel", {
      requires : "panel"
    });
    (function() {
      function getPanel(editor, doc, parentElement, definition, key) {
        key = CKEDITOR.tools.genKey(doc.getUniqueId(), parentElement.getUniqueId(), editor.lang.dir, editor.uiColor || "", definition.css || "", key || "");
        var panel = panels[key];
        if (!panel) {
          panel = panels[key] = new CKEDITOR.ui.panel(doc, definition);
          panel.element = parentElement.append(CKEDITOR.dom.element.createFromHtml(panel.render(editor), doc));
          panel.element.setStyles({
            display : "none",
            position : "absolute"
          });
        }
        return panel;
      }
      var panels = {};
      CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({
        $ : function(name, keepData, ref, value) {
          function handler() {
            poster.hide();
          }
          ref.forceIFrame = 1;
          if (ref.toolbarRelated) {
            if (name.elementMode == CKEDITOR.ELEMENT_MODE_INLINE) {
              keepData = CKEDITOR.document.getById("cke_" + name.name);
            }
          }
          var doc = keepData.getDocument();
          value = getPanel(name, doc, keepData, ref, value || 0);
          var element = value.element;
          var iframe = element.getFirst();
          var poster = this;
          element.disableContextMenu();
          this.element = element;
          this._ = {
            editor : name,
            panel : value,
            parentElement : keepData,
            definition : ref,
            document : doc,
            iframe : iframe,
            children : [],
            dir : name.lang.dir
          };
          name.on("mode", handler);
          name.on("resize", handler);
          if (!CKEDITOR.env.iOS) {
            doc.getWindow().on("resize", handler);
          }
        },
        proto : {
          addBlock : function(name, block) {
            return this._.panel.addBlock(name, block);
          },
          addListBlock : function(deepDataAndEvents, multiSelect) {
            return this._.panel.addListBlock(deepDataAndEvents, multiSelect);
          },
          getBlock : function(name) {
            return this._.panel.getBlock(name);
          },
          showBlock : function(name, offsetParent, corner, offsetX, offsetY, callback) {
            var panel = this._.panel;
            var block = panel.showBlock(name);
            this.allowBlur(false);
            name = this._.editor.editable();
            this._.returnFocus = name.hasFocus ? name : new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);
            this._.hideTimeout = 0;
            var element = this.element;
            name = this._.iframe;
            name = CKEDITOR.env.ie ? name : new CKEDITOR.dom.window(name.$.contentWindow);
            var doc = element.getDocument();
            var positionedAncestor = this._.parentElement.getPositionedAncestor();
            var position = offsetParent.getDocumentPosition(doc);
            doc = positionedAncestor ? positionedAncestor.getDocumentPosition(doc) : {
              x : 0,
              y : 0
            };
            var rtl = this._.dir == "rtl";
            var x = position.x + (offsetX || 0) - doc.x;
            var height = position.y + (offsetY || 0) - doc.y;
            if (rtl && (corner == 1 || corner == 4)) {
              x = x + offsetParent.$.offsetWidth;
            } else {
              if (!rtl && (corner == 2 || corner == 3)) {
                x = x + (offsetParent.$.offsetWidth - 1);
              }
            }
            if (corner == 3 || corner == 4) {
              height = height + (offsetParent.$.offsetHeight - 1);
            }
            this._.panel._.offsetParentId = offsetParent.getId();
            element.setStyles({
              top : height + "px",
              left : 0,
              display : ""
            });
            element.setOpacity(0);
            element.getFirst().removeStyle("width");
            this._.editor.focusManager.add(name);
            if (!this._.blurSet) {
              CKEDITOR.event.useCapture = true;
              name.on("blur", function(ev) {
                function callback() {
                  delete this._.returnFocus;
                  this.hide();
                }
                if (this.allowBlur() && (ev.data.getPhase() == CKEDITOR.EVENT_PHASE_AT_TARGET && (this.visible && !this._.activeChild))) {
                  if (CKEDITOR.env.iOS) {
                    if (!this._.hideTimeout) {
                      this._.hideTimeout = CKEDITOR.tools.setTimeout(callback, 0, this);
                    }
                  } else {
                    callback.call(this);
                  }
                }
              }, this);
              name.on("focus", function() {
                this._.focused = true;
                this.hideChild();
                this.allowBlur(true);
              }, this);
              if (CKEDITOR.env.iOS) {
                name.on("touchstart", function() {
                  clearTimeout(this._.hideTimeout);
                }, this);
                name.on("touchend", function() {
                  this._.hideTimeout = 0;
                  this.focus();
                }, this);
              }
              CKEDITOR.event.useCapture = false;
              this._.blurSet = 1;
            }
            panel.onEscape = CKEDITOR.tools.bind(function(keystroke) {
              if (this.onEscape && this.onEscape(keystroke) === false) {
                return false;
              }
            }, this);
            CKEDITOR.tools.setTimeout(function() {
              var panelLoad = CKEDITOR.tools.bind(function() {
                element.removeStyle("width");
                if (block.autoSize) {
                  var p = block.element.getDocument();
                  p = (CKEDITOR.env.webkit ? block.element : p.getBody()).$.scrollWidth;
                  if (CKEDITOR.env.ie) {
                    if (CKEDITOR.env.quirks && p > 0) {
                      p = p + ((element.$.offsetWidth || 0) - (element.$.clientWidth || 0) + 3);
                    }
                  }
                  element.setStyle("width", p + 10 + "px");
                  p = block.element.$.scrollHeight;
                  if (CKEDITOR.env.ie) {
                    if (CKEDITOR.env.quirks && p > 0) {
                      p = p + ((element.$.offsetHeight || 0) - (element.$.clientHeight || 0) + 3);
                    }
                  }
                  element.setStyle("height", p + "px");
                  panel._.currentBlock.element.setStyle("display", "none").removeStyle("display");
                } else {
                  element.removeStyle("height");
                }
                if (rtl) {
                  x = x - element.$.offsetWidth;
                }
                element.setStyle("left", x + "px");
                var node = panel.element.getWindow();
                p = element.$.getBoundingClientRect();
                node = node.getViewPaneSize();
                var b = p.width || p.right - p.left;
                var h = p.height || p.bottom - p.top;
                var g = rtl ? p.right : node.width - p.left;
                var a = rtl ? node.width - p.right : p.left;
                if (rtl) {
                  if (g < b) {
                    x = a > b ? x + b : node.width > b ? x - p.left : x - p.right + node.width;
                  }
                } else {
                  if (g < b) {
                    x = a > b ? x - b : node.width > b ? x - p.right + node.width : x - p.left;
                  }
                }
                b = p.top;
                if (node.height - p.top < h) {
                  height = b > h ? height - h : node.height > h ? height - p.bottom + node.height : height - p.top;
                }
                if (CKEDITOR.env.ie) {
                  node = p = new CKEDITOR.dom.element(element.$.offsetParent);
                  if (node.getName() == "html") {
                    node = node.getDocument().getBody();
                  }
                  if (node.getComputedStyle("direction") == "rtl") {
                    x = CKEDITOR.env.ie8Compat ? x - element.getDocument().getDocumentElement().$.scrollLeft * 2 : x - (p.$.scrollWidth - p.$.clientWidth);
                  }
                }
                p = element.getFirst();
                var activePanel;
                if (activePanel = p.getCustomData("activePanel")) {
                  if (activePanel.onHide) {
                    activePanel.onHide.call(this, 1);
                  }
                }
                p.setCustomData("activePanel", this);
                element.setStyles({
                  top : height + "px",
                  left : x + "px"
                });
                element.setOpacity(1);
                if (callback) {
                  callback();
                }
              }, this);
              if (panel.isLoaded) {
                panelLoad();
              } else {
                panel.onLoad = panelLoad;
              }
              CKEDITOR.tools.setTimeout(function() {
                var verticalScrollPos = CKEDITOR.env.webkit && CKEDITOR.document.getWindow().getScrollPosition().y;
                this.focus();
                block.element.focus();
                if (CKEDITOR.env.webkit) {
                  CKEDITOR.document.getBody().$.scrollTop = verticalScrollPos;
                }
                this.allowBlur(true);
                this._.editor.fire("panelShow", this);
              }, 0, this);
            }, CKEDITOR.env.air ? 200 : 0, this);
            this.visible = 1;
            if (this.onShow) {
              this.onShow.call(this);
            }
          },
          focus : function() {
            if (CKEDITOR.env.webkit) {
              var active = CKEDITOR.document.getActive();
              if (!active.equals(this._.iframe)) {
                active.$.blur();
              }
            }
            (this._.lastFocused || this._.iframe.getFrameDocument().getWindow()).focus();
          },
          blur : function() {
            var active = this._.iframe.getFrameDocument().getActive();
            if (active.is("a")) {
              this._.lastFocused = active;
            }
          },
          hide : function(deepDataAndEvents) {
            if (this.visible && (!this.onHide || this.onHide.call(this) !== true)) {
              this.hideChild();
              if (CKEDITOR.env.gecko) {
                this._.iframe.getFrameDocument().$.activeElement.blur();
              }
              this.element.setStyle("display", "none");
              this.visible = 0;
              this.element.getFirst().removeCustomData("activePanel");
              if (deepDataAndEvents = deepDataAndEvents && this._.returnFocus) {
                if (CKEDITOR.env.webkit) {
                  if (deepDataAndEvents.type) {
                    deepDataAndEvents.getWindow().$.focus();
                  }
                }
                deepDataAndEvents.focus();
              }
              delete this._.lastFocused;
              this._.editor.fire("panelHide", this);
            }
          },
          allowBlur : function(allow) {
            var panel = this._.panel;
            if (allow != void 0) {
              panel.allowBlur = allow;
            }
            return panel.allowBlur;
          },
          showAsChild : function(panel, blockName, offsetParent, corner, offsetX, offsetY) {
            if (!(this._.activeChild == panel && panel._.panel._.offsetParentId == offsetParent.getId())) {
              this.hideChild();
              panel.onHide = CKEDITOR.tools.bind(function() {
                CKEDITOR.tools.setTimeout(function() {
                  if (!this._.focused) {
                    this.hide();
                  }
                }, 0, this);
              }, this);
              this._.activeChild = panel;
              this._.focused = false;
              panel.showBlock(blockName, offsetParent, corner, offsetX, offsetY);
              this.blur();
              if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) {
                setTimeout(function() {
                  panel.element.getChild(0).$.style.cssText += "";
                }, 100);
              }
            }
          },
          hideChild : function(dataAndEvents) {
            var activeChild = this._.activeChild;
            if (activeChild) {
              delete activeChild.onHide;
              delete this._.activeChild;
              activeChild.hide();
              if (dataAndEvents) {
                this.focus();
              }
            }
          }
        }
      });
      CKEDITOR.on("instanceDestroyed", function() {
        var a = CKEDITOR.tools.isEmpty(CKEDITOR.instances);
        var i;
        for (i in panels) {
          var panel = panels[i];
          if (a) {
            panel.destroy();
          } else {
            panel.element.hide();
          }
        }
        if (a) {
          panels = {};
        }
      });
    })();
    CKEDITOR.plugins.add("menu", {
      requires : "floatpanel",
      beforeInit : function(editor) {
        var codeSegments = editor.config.menu_groups.split(",");
        var groupsOrder = editor._.menuGroups = {};
        var old = editor._.menuItems = {};
        var i = 0;
        for (;i < codeSegments.length;i++) {
          groupsOrder[codeSegments[i]] = i + 1;
        }
        editor.addMenuGroup = function(name, order) {
          groupsOrder[name] = order || 100;
        };
        editor.addMenuItem = function(name, definition) {
          if (groupsOrder[definition.group]) {
            old[name] = new CKEDITOR.menuItem(this, name, definition);
          }
        };
        editor.addMenuItems = function(definitions) {
          var itemName;
          for (itemName in definitions) {
            this.addMenuItem(itemName, definitions[itemName]);
          }
        };
        editor.getMenuItem = function(name) {
          return old[name];
        };
        editor.removeMenuItem = function(name) {
          delete old[name];
        };
      }
    });
    (function() {
      function sortItems(items) {
        items.sort(function(itemA, itemB) {
          return itemA.group < itemB.group ? -1 : itemA.group > itemB.group ? 1 : itemA.order < itemB.order ? -1 : itemA.order > itemB.order ? 1 : 0;
        });
      }
      var copies = '<span class="cke_menuitem"><a id="{id}" class="cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href="{href}" title="{title}" tabindex="-1"_cke_focus=1 hidefocus="true" role="{role}" aria-haspopup="{hasPopup}" aria-disabled="{disabled}" {ariaChecked}';
      if (CKEDITOR.env.gecko) {
        if (CKEDITOR.env.mac) {
          copies = copies + ' onkeypress="return false;"';
        }
      }
      if (CKEDITOR.env.gecko) {
        copies = copies + ' onblur="this.style.cssText = this.style.cssText;"';
      }
      copies = copies + (' onmouseover="CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout="CKEDITOR.tools.callFunction({moveOutFn},{index});" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},{index}); return false;">');
      var self = CKEDITOR.addTemplate("menuItem", copies + '<span class="cke_menubutton_inner"><span class="cke_menubutton_icon"><span class="cke_button_icon cke_button__{iconName}_icon" style="{iconStyle}"></span></span><span class="cke_menubutton_label">{label}</span>{arrowHtml}</span></a></span>');
      var menuArrowTpl = CKEDITOR.addTemplate("menuArrow", '<span class="cke_menuarrow"><span>{label}</span></span>');
      CKEDITOR.menu = CKEDITOR.tools.createClass({
        $ : function(name, keepData) {
          keepData = this._.definition = keepData || {};
          this.id = CKEDITOR.tools.getNextId();
          this.editor = name;
          this.items = [];
          this._.listeners = [];
          this._.level = keepData.level || 1;
          var panelDefinition = CKEDITOR.tools.extend({}, keepData.panel, {
            css : [CKEDITOR.skin.getPath("editor")],
            level : this._.level - 1,
            block : {}
          });
          var attrs = panelDefinition.block.attributes = panelDefinition.attributes || {};
          if (!attrs.role) {
            attrs.role = "menu";
          }
          this._.panelDefinition = panelDefinition;
        },
        _ : {
          onShow : function() {
            var selection = this.editor.getSelection();
            var e = selection && selection.getStartElement();
            var eventArgs = this.editor.elementPath();
            var listeners = this._.listeners;
            this.removeAll();
            var i = 0;
            for (;i < listeners.length;i++) {
              var subItemDefs = listeners[i](e, selection, eventArgs);
              if (subItemDefs) {
                var subItemName;
                for (subItemName in subItemDefs) {
                  var optgroup = this.editor.getMenuItem(subItemName);
                  if (optgroup && (!optgroup.command || this.editor.getCommand(optgroup.command).state)) {
                    optgroup.state = subItemDefs[subItemName];
                    this.add(optgroup);
                  }
                }
              }
            }
          },
          onClick : function(item) {
            this.hide();
            if (item.onClick) {
              item.onClick();
            } else {
              if (item.command) {
                this.editor.execCommand(item.command);
              }
            }
          },
          onEscape : function(keystroke) {
            var parent = this.parent;
            if (parent) {
              parent._.panel.hideChild(1);
            } else {
              if (keystroke == 27) {
                this.hide(1);
              }
            }
            return false;
          },
          onHide : function() {
            if (this.onHide) {
              this.onHide();
            }
          },
          showSubMenu : function(index) {
            var menu = this._.subMenu;
            var item = this.items[index];
            if (item = item.getItems && item.getItems()) {
              if (menu) {
                menu.removeAll();
              } else {
                menu = this._.subMenu = new CKEDITOR.menu(this.editor, CKEDITOR.tools.extend({}, this._.definition, {
                  level : this._.level + 1
                }, true));
                menu.parent = this;
                menu._.onClick = CKEDITOR.tools.bind(this._.onClick, this);
              }
              var label;
              for (label in item) {
                var optgroup = this.editor.getMenuItem(label);
                if (optgroup) {
                  optgroup.state = item[label];
                  menu.add(optgroup);
                }
              }
              var offsetParent = this._.panel.getBlock(this.id).element.getDocument().getById(this.id + ("" + index));
              setTimeout(function() {
                menu.show(offsetParent, 2);
              }, 0);
            } else {
              this._.panel.hideChild(1);
            }
          }
        },
        proto : {
          add : function(name) {
            if (!name.order) {
              name.order = this.items.length;
            }
            this.items.push(name);
          },
          removeAll : function() {
            this.items = [];
          },
          show : function(offsetParent, corner, offsetX, offsetY) {
            if (!this.parent) {
              this._.onShow();
              if (!this.items.length) {
                return;
              }
            }
            corner = corner || (this.editor.lang.dir == "rtl" ? 2 : 1);
            var items = this.items;
            var editor = this.editor;
            var panel = this._.panel;
            var block = this._.element;
            if (!panel) {
              panel = this._.panel = new CKEDITOR.ui.floatPanel(this.editor, CKEDITOR.document.getBody(), this._.panelDefinition, this._.level);
              panel.onEscape = CKEDITOR.tools.bind(function(keystroke) {
                if (this._.onEscape(keystroke) === false) {
                  return false;
                }
              }, this);
              panel.onShow = function() {
                panel._.panel.getHolderElement().getParent().addClass("cke cke_reset_all");
              };
              panel.onHide = CKEDITOR.tools.bind(function() {
                if (this._.onHide) {
                  this._.onHide();
                }
              }, this);
              block = panel.addBlock(this.id, this._.panelDefinition.block);
              block.autoSize = true;
              var keys = block.keys;
              keys[40] = "next";
              keys[9] = "next";
              keys[38] = "prev";
              keys[CKEDITOR.SHIFT + 9] = "prev";
              keys[editor.lang.dir == "rtl" ? 37 : 39] = CKEDITOR.env.ie ? "mouseup" : "click";
              keys[32] = CKEDITOR.env.ie ? "mouseup" : "click";
              if (CKEDITOR.env.ie) {
                keys[13] = "mouseup";
              }
              block = this._.element = block.element;
              keys = block.getDocument();
              keys.getBody().setStyle("overflow", "hidden");
              keys.getElementsByTag("html").getItem(0).setStyle("overflow", "hidden");
              this._.itemOverFn = CKEDITOR.tools.addFunction(function(index) {
                clearTimeout(this._.showSubTimeout);
                this._.showSubTimeout = CKEDITOR.tools.setTimeout(this._.showSubMenu, editor.config.menu_subMenuDelay || 400, this, [index]);
              }, this);
              this._.itemOutFn = CKEDITOR.tools.addFunction(function() {
                clearTimeout(this._.showSubTimeout);
              }, this);
              this._.itemClickFn = CKEDITOR.tools.addFunction(function(index) {
                var item = this.items[index];
                if (item.state == CKEDITOR.TRISTATE_DISABLED) {
                  this.hide(1);
                } else {
                  if (item.getItems) {
                    this._.showSubMenu(index);
                  } else {
                    this._.onClick(item);
                  }
                }
              }, this);
            }
            sortItems(items);
            keys = editor.elementPath();
            keys = ['<div class="cke_menu' + (keys && keys.direction() != editor.lang.dir ? " cke_mixed_dir_content" : "") + '" role="presentation">'];
            var length = items.length;
            var lastGroup = length && items[0].group;
            var pos = 0;
            for (;pos < length;pos++) {
              var item = items[pos];
              if (lastGroup != item.group) {
                keys.push('<div class="cke_menuseparator" role="separator"></div>');
                lastGroup = item.group;
              }
              item.render(this, pos, keys);
            }
            keys.push("</div>");
            block.setHtml(keys.join(""));
            CKEDITOR.ui.fire("ready", this);
            if (this.parent) {
              this.parent._.panel.showAsChild(panel, this.id, offsetParent, corner, offsetX, offsetY);
            } else {
              panel.showBlock(this.id, offsetParent, corner, offsetX, offsetY);
            }
            editor.fire("menuShow", [panel]);
          },
          addListener : function(listener) {
            this._.listeners.push(listener);
          },
          hide : function(deepDataAndEvents) {
            if (this._.onHide) {
              this._.onHide();
            }
            if (this._.panel) {
              this._.panel.hide(deepDataAndEvents);
            }
          }
        }
      });
      CKEDITOR.menuItem = CKEDITOR.tools.createClass({
        $ : function(name, keepData, ref) {
          CKEDITOR.tools.extend(this, ref, {
            order : 0,
            className : "cke_menubutton__" + keepData
          });
          this.group = name._.menuGroups[this.group];
          this.editor = name;
          this.name = keepData;
        },
        proto : {
          render : function(optgroup, pos, key) {
            var pageId = optgroup.id + ("" + pos);
            var state = typeof this.state == "undefined" ? CKEDITOR.TRISTATE_OFF : this.state;
            var optsData = "";
            var stateName = state == CKEDITOR.TRISTATE_ON ? "on" : state == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off";
            if (this.role in {
              menuitemcheckbox : 1,
              menuitemradio : 1
            }) {
              optsData = ' aria-checked="' + (state == CKEDITOR.TRISTATE_ON ? "true" : "false") + '"';
            }
            var hasSubMenu = this.getItems;
            var lab = "&#" + (this.editor.lang.dir == "rtl" ? "9668" : "9658") + ";";
            var iconName = this.name;
            if (this.icon && !/\./.test(this.icon)) {
              iconName = this.icon;
            }
            optgroup = {
              id : pageId,
              name : this.name,
              iconName : iconName,
              label : this.label,
              cls : this.className || "",
              state : stateName,
              hasPopup : hasSubMenu ? "true" : "false",
              disabled : state == CKEDITOR.TRISTATE_DISABLED,
              title : this.label,
              href : "javascript:void('" + (this.label || "").replace("'") + "')",
              hoverFn : optgroup._.itemOverFn,
              moveOutFn : optgroup._.itemOutFn,
              clickFn : optgroup._.itemClickFn,
              index : pos,
              iconStyle : CKEDITOR.skin.getIconStyle(iconName, this.editor.lang.dir == "rtl", iconName == this.icon ? null : this.icon, this.iconOffset),
              arrowHtml : hasSubMenu ? menuArrowTpl.output({
                label : lab
              }) : "",
              role : this.role ? this.role : "menuitem",
              ariaChecked : optsData
            };
            self.output(optgroup, key);
          }
        }
      });
    })();
    CKEDITOR.config.menu_groups = "clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div";
    CKEDITOR.plugins.add("contextmenu", {
      requires : "menu",
      onLoad : function() {
        CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass({
          base : CKEDITOR.menu,
          $ : function(name) {
            this.base.call(this, name, {
              panel : {
                className : "cke_menu_panel",
                attributes : {
                  "aria-label" : name.lang.contextmenu.options
                }
              }
            });
          },
          proto : {
            addTarget : function(element, nativeContextMenuOnCtrl) {
              element.on("contextmenu", function(evt) {
                evt = evt.data;
                var fromFrame = CKEDITOR.env.webkit ? holdCtrlKey : CKEDITOR.env.mac ? evt.$.metaKey : evt.$.ctrlKey;
                if (!nativeContextMenuOnCtrl || !fromFrame) {
                  evt.preventDefault();
                  if (CKEDITOR.env.mac && CKEDITOR.env.webkit) {
                    fromFrame = this.editor;
                    var next = (new CKEDITOR.dom.elementPath(evt.getTarget(), fromFrame.editable())).contains(function(elem) {
                      return elem.hasAttribute("contenteditable");
                    }, true);
                    if (next) {
                      if (next.getAttribute("contenteditable") == "false") {
                        fromFrame.getSelection().fake(next);
                      }
                    }
                  }
                  next = evt.getTarget().getDocument();
                  var typePattern = evt.getTarget().getDocument().getDocumentElement();
                  fromFrame = !next.equals(CKEDITOR.document);
                  next = next.getWindow().getScrollPosition();
                  var offsetX = fromFrame ? evt.$.clientX : evt.$.pageX || next.x + evt.$.clientX;
                  var offsetY = fromFrame ? evt.$.clientY : evt.$.pageY || next.y + evt.$.clientY;
                  CKEDITOR.tools.setTimeout(function() {
                    this.open(typePattern, null, offsetX, offsetY);
                  }, CKEDITOR.env.ie ? 200 : 0, this);
                }
              }, this);
              if (CKEDITOR.env.webkit) {
                var holdCtrlKey;
                var uncaught = function() {
                  holdCtrlKey = 0;
                };
                element.on("keydown", function(evt) {
                  holdCtrlKey = CKEDITOR.env.mac ? evt.data.$.metaKey : evt.data.$.ctrlKey;
                });
                element.on("keyup", uncaught);
                element.on("contextmenu", uncaught);
              }
            },
            open : function(args, recurring, offsetX, offsetY) {
              this.editor.focus();
              args = args || CKEDITOR.document.getDocumentElement();
              this.editor.selectionChange(1);
              this.show(args, recurring, offsetX, offsetY);
            }
          }
        });
      },
      beforeInit : function(editor) {
        var loop = editor.contextMenu = new CKEDITOR.plugins.contextMenu(editor);
        editor.on("contentDom", function() {
          loop.addTarget(editor.editable(), editor.config.browserContextMenuOnCtrl !== false);
        });
        editor.addCommand("contextMenu", {
          exec : function() {
            editor.contextMenu.open(editor.document.getBody());
          }
        });
        editor.setKeystroke(CKEDITOR.SHIFT + 121, "contextMenu");
        editor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 121, "contextMenu");
      }
    });
    (function() {
      function initElementsPath(editor, bottomSpaceData) {
        function onClick(target) {
          target = elementsPath.list[target];
          if (target.equals(editor.editable()) || target.getAttribute("contenteditable") == "true") {
            var range = editor.createRange();
            range.selectNodeContents(target);
            range.select();
          } else {
            editor.getSelection().selectElement(target);
          }
          editor.focus();
        }
        function empty() {
          if (item) {
            item.setHtml(html);
          }
          delete elementsPath.list;
        }
        var id = editor.ui.spaceId("path");
        var item;
        var elementsPath = editor._.elementsPath;
        var idBase = elementsPath.idBase;
        bottomSpaceData.html = bottomSpaceData.html + ('<span id="' + id + '_label" class="cke_voice_label">' + editor.lang.elementspath.eleLabel + '</span><span id="' + id + '" class="cke_path" role="group" aria-labelledby="' + id + '_label">' + html + "</span>");
        editor.on("uiReady", function() {
          var optgroup = editor.ui.space("path");
          if (optgroup) {
            editor.focusManager.add(optgroup, 1);
          }
        });
        elementsPath.onClick = onClick;
        var onClickHanlder = CKEDITOR.tools.addFunction(onClick);
        var onKeyDownHandler = CKEDITOR.tools.addFunction(function(pattern, ev) {
          var idBase = elementsPath.idBase;
          var submenu;
          ev = new CKEDITOR.dom.event(ev);
          submenu = editor.lang.dir == "rtl";
          switch(ev.getKeystroke()) {
            case submenu ? 39 : 37:
            ;
            case 9:
              if (!(submenu = CKEDITOR.document.getById(idBase + (pattern + 1)))) {
                submenu = CKEDITOR.document.getById(idBase + "0");
              }
              submenu.focus();
              return false;
            case submenu ? 37 : 39:
            ;
            case CKEDITOR.SHIFT + 9:
              if (!(submenu = CKEDITOR.document.getById(idBase + (pattern - 1)))) {
                submenu = CKEDITOR.document.getById(idBase + (elementsPath.list.length - 1));
              }
              submenu.focus();
              return false;
            case 27:
              editor.focus();
              return false;
            case 13:
            ;
            case 32:
              onClick(pattern);
              return false;
          }
          return true;
        });
        editor.on("selectionChange", function() {
          editor.editable();
          var buf = [];
          var pending = elementsPath.list = [];
          var keys = [];
          var j = elementsPath.filters;
          var data = true;
          var elements = editor.elementPath().elements;
          var key;
          var elIdx = elements.length;
          for (;elIdx--;) {
            var element = elements[elIdx];
            var z = 0;
            key = element.data("cke-display-name") ? element.data("cke-display-name") : element.data("cke-real-element-type") ? element.data("cke-real-element-type") : element.getName();
            data = element.hasAttribute("contenteditable") ? element.getAttribute("contenteditable") == "true" : data;
            if (!data) {
              if (!element.hasAttribute("contenteditable")) {
                z = 1;
              }
            }
            var i = 0;
            for (;i < j.length;i++) {
              var prop = j[i](element, key);
              if (prop === false) {
                z = 1;
                break;
              }
              key = prop || key;
            }
            if (!z) {
              pending.unshift(element);
              keys.unshift(key);
            }
          }
          pending = pending.length;
          j = 0;
          for (;j < pending;j++) {
            key = keys[j];
            data = editor.lang.elementspath.eleTitle.replace(/%1/, key);
            key = pathItemTpl.output({
              id : idBase + j,
              label : data,
              text : key,
              jsTitle : "javascript:void('" + key + "')",
              index : j,
              keyDownFn : onKeyDownHandler,
              clickFn : onClickHanlder
            });
            buf.unshift(key);
          }
          if (!item) {
            item = CKEDITOR.document.getById(id);
          }
          keys = item;
          keys.setHtml(buf.join("") + html);
          editor.fire("elementsPathUpdate", {
            space : keys
          });
        });
        editor.on("readOnly", empty);
        editor.on("contentDomUnload", empty);
        editor.addCommand("elementsPathFocus", outdent);
        editor.setKeystroke(CKEDITOR.ALT + 122, "elementsPathFocus");
      }
      var outdent;
      outdent = {
        editorFocus : false,
        readOnly : 1,
        exec : function(editor) {
          if (editor = CKEDITOR.document.getById(editor._.elementsPath.idBase + "0")) {
            editor.focus(CKEDITOR.env.ie || CKEDITOR.env.air);
          }
        }
      };
      var html = '<span class="cke_path_empty">&nbsp;</span>';
      var buffer = "";
      if (CKEDITOR.env.gecko) {
        if (CKEDITOR.env.mac) {
          buffer = buffer + ' onkeypress="return false;"';
        }
      }
      if (CKEDITOR.env.gecko) {
        buffer = buffer + ' onblur="this.style.cssText = this.style.cssText;"';
      }
      var pathItemTpl = CKEDITOR.addTemplate("pathItem", '<a id="{id}" href="{jsTitle}" tabindex="-1" class="cke_path_item" title="{label}"' + buffer + ' hidefocus="true"  onkeydown="return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick="CKEDITOR.tools.callFunction({clickFn},{index}); return false;" role="button" aria-label="{label}">{text}</a>');
      CKEDITOR.plugins.add("elementspath", {
        init : function(editor) {
          editor._.elementsPath = {
            idBase : "cke_elementspath_" + CKEDITOR.tools.getNextNumber() + "_",
            filters : []
          };
          editor.on("uiSpace", function(event) {
            if (event.data.space == "bottom") {
              initElementsPath(editor, event.data);
            }
          });
        }
      });
    })();
    (function() {
      function enter(editor, mode, forceMode) {
        forceMode = editor.config.forceEnterMode || forceMode;
        if (editor.mode == "wysiwyg") {
          if (!mode) {
            mode = editor.activeEnterMode;
          }
          if (!editor.elementPath().isContextFor("p")) {
            mode = CKEDITOR.ENTER_BR;
            forceMode = 1;
          }
          editor.fire("saveSnapshot");
          if (mode == CKEDITOR.ENTER_BR) {
            enterBr(editor, mode, null, forceMode);
          } else {
            enterBlock(editor, mode, null, forceMode);
          }
          editor.fire("saveSnapshot");
        }
      }
      function getRange(editor) {
        editor = editor.getSelection().getRanges(true);
        var i = editor.length - 1;
        for (;i > 0;i--) {
          editor[i].deleteContents();
        }
        return editor[0];
      }
      CKEDITOR.plugins.add("enterkey", {
        init : function(editor) {
          editor.addCommand("enter", {
            modes : {
              wysiwyg : 1
            },
            editorFocus : false,
            exec : function(editor) {
              enter(editor);
            }
          });
          editor.addCommand("shiftEnter", {
            modes : {
              wysiwyg : 1
            },
            editorFocus : false,
            exec : function(editor) {
              enter(editor, editor.activeShiftEnterMode, 1);
            }
          });
          editor.setKeystroke([[13, "enter"], [CKEDITOR.SHIFT + 13, "shiftEnter"]]);
        }
      });
      var ondata = CKEDITOR.dom.walker.whitespaces();
      var trimDots = CKEDITOR.dom.walker.bookmark();
      CKEDITOR.plugins.enterkey = {
        enterBlock : function(editor, element, range, forceMode) {
          if (range = range || getRange(editor)) {
            var doc = range.document;
            var end = range.checkStartOfBlock();
            var e = range.checkEndOfBlock();
            var block = editor.elementPath(range.startContainer).block;
            var blockTag = element == CKEDITOR.ENTER_DIV ? "div" : "p";
            var newBlock;
            if (end && e) {
              if (block && (block.is("li") || block.getParent().is("li"))) {
                range = block.getParent();
                newBlock = range.getParent();
                forceMode = !block.hasPrevious();
                var newBlockDir = !block.hasNext();
                blockTag = editor.getSelection();
                var node = blockTag.createBookmarks();
                end = block.getDirection(1);
                e = block.getAttribute("class");
                var style = block.getAttribute("style");
                var minus = newBlock.getDirection(1) != end;
                editor = editor.enterMode != CKEDITOR.ENTER_BR || (minus || (style || e));
                if (newBlock.is("li")) {
                  if (forceMode || newBlockDir) {
                    block[forceMode ? "insertBefore" : "insertAfter"](newBlock);
                  } else {
                    block.breakParent(newBlock);
                  }
                } else {
                  if (editor) {
                    newBlock = doc.createElement(element == CKEDITOR.ENTER_P ? "p" : "div");
                    if (minus) {
                      newBlock.setAttribute("dir", end);
                    }
                    if (style) {
                      newBlock.setAttribute("style", style);
                    }
                    if (e) {
                      newBlock.setAttribute("class", e);
                    }
                    block.moveChildren(newBlock);
                    if (forceMode || newBlockDir) {
                      newBlock[forceMode ? "insertBefore" : "insertAfter"](range);
                    } else {
                      block.breakParent(range);
                      newBlock.insertAfter(range);
                    }
                  } else {
                    block.appendBogus(true);
                    if (forceMode || newBlockDir) {
                      for (;doc = block[forceMode ? "getFirst" : "getLast"]();) {
                        doc[forceMode ? "insertBefore" : "insertAfter"](range);
                      }
                    } else {
                      block.breakParent(range);
                      for (;doc = block.getLast();) {
                        doc.insertAfter(range);
                      }
                    }
                  }
                  block.remove();
                }
                blockTag.selectBookmarks(node);
                return;
              }
              if (block && block.getParent().is("blockquote")) {
                block.breakParent(block.getParent());
                if (!block.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1))) {
                  block.getPrevious().remove();
                }
                if (!block.getNext().getFirst(CKEDITOR.dom.walker.invisible(1))) {
                  block.getNext().remove();
                }
                range.moveToElementEditStart(block);
                range.select();
                return;
              }
            } else {
              if (block && (block.is("pre") && !e)) {
                enterBr(editor, element, range, forceMode);
                return;
              }
            }
            if (e = range.splitBlock(blockTag)) {
              element = e.previousBlock;
              block = e.nextBlock;
              editor = e.wasStartOfBlock;
              end = e.wasEndOfBlock;
              if (block) {
                node = block.getParent();
                if (node.is("li")) {
                  block.breakParent(node);
                  block.move(block.getNext(), 1);
                }
              } else {
                if (element && ((node = element.getParent()) && node.is("li"))) {
                  element.breakParent(node);
                  node = element.getNext();
                  range.moveToElementEditStart(node);
                  element.move(element.getPrevious());
                }
              }
              if (!editor && !end) {
                if (block.is("li")) {
                  newBlock = range.clone();
                  newBlock.selectNodeContents(block);
                  newBlock = new CKEDITOR.dom.walker(newBlock);
                  newBlock.evaluator = function(name) {
                    return!(trimDots(name) || (ondata(name) || name.type == CKEDITOR.NODE_ELEMENT && (name.getName() in CKEDITOR.dtd.$inline && !(name.getName() in CKEDITOR.dtd.$empty))));
                  };
                  if (node = newBlock.next()) {
                    if (node.type == CKEDITOR.NODE_ELEMENT && node.is("ul", "ol")) {
                      (CKEDITOR.env.needsBrFiller ? doc.createElement("br") : doc.createText(" ")).insertBefore(node);
                    }
                  }
                }
                if (block) {
                  range.moveToElementEditStart(block);
                }
              } else {
                if (element) {
                  if (element.is("li") || !rbrace.test(element.getName()) && !element.is("pre")) {
                    newBlock = element.clone();
                  }
                } else {
                  if (block) {
                    newBlock = block.clone();
                  }
                }
                if (newBlock) {
                  if (forceMode) {
                    if (!newBlock.is("li")) {
                      newBlock.renameNode(blockTag);
                    }
                  }
                } else {
                  if (node && node.is("li")) {
                    newBlock = node;
                  } else {
                    newBlock = doc.createElement(blockTag);
                    if (element) {
                      if (newBlockDir = element.getDirection()) {
                        newBlock.setAttribute("dir", newBlockDir);
                      }
                    }
                  }
                }
                if (doc = e.elementPath) {
                  forceMode = 0;
                  blockTag = doc.elements.length;
                  for (;forceMode < blockTag;forceMode++) {
                    node = doc.elements[forceMode];
                    if (node.equals(doc.block) || node.equals(doc.blockLimit)) {
                      break;
                    }
                    if (CKEDITOR.dtd.$removeEmpty[node.getName()]) {
                      node = node.clone();
                      newBlock.moveChildren(node);
                      newBlock.append(node);
                    }
                  }
                }
                newBlock.appendBogus();
                if (!newBlock.getParent()) {
                  range.insertNode(newBlock);
                }
                if (newBlock.is("li")) {
                  newBlock.removeAttribute("value");
                }
                if (CKEDITOR.env.ie && (editor && (!end || !element.getChildCount()))) {
                  range.moveToElementEditStart(end ? element : newBlock);
                  range.select();
                }
                range.moveToElementEditStart(editor && !end ? block : newBlock);
              }
              range.select();
              range.scrollIntoView();
            }
          }
        },
        enterBr : function(editor, mode, range, forceMode) {
          if (range = range || getRange(editor)) {
            var doc = range.document;
            var src = range.checkEndOfBlock();
            var data = new CKEDITOR.dom.elementPath(editor.getSelection().getStartElement());
            var node = data.block;
            data = node && data.block.getName();
            if (!forceMode && data == "li") {
              enterBlock(editor, mode, range, forceMode);
            } else {
              if (!forceMode && (src && rbrace.test(data))) {
                if (src = node.getDirection()) {
                  doc = doc.createElement("div");
                  doc.setAttribute("dir", src);
                  doc.insertAfter(node);
                  range.setStart(doc, 0);
                } else {
                  doc.createElement("br").insertAfter(node);
                  if (CKEDITOR.env.gecko) {
                    doc.createText("").insertAfter(node);
                  }
                  range.setStartAt(node.getNext(), CKEDITOR.env.ie ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_START);
                }
              } else {
                node = data == "pre" && (CKEDITOR.env.ie && CKEDITOR.env.version < 8) ? doc.createText("\r") : doc.createElement("br");
                range.deleteContents();
                range.insertNode(node);
                if (CKEDITOR.env.needsBrFiller) {
                  doc.createText("\ufeff").insertAfter(node);
                  if (src) {
                    node.getParent().appendBogus();
                  }
                  node.getNext().$.nodeValue = "";
                  range.setStartAt(node.getNext(), CKEDITOR.POSITION_AFTER_START);
                } else {
                  range.setStartAt(node, CKEDITOR.POSITION_AFTER_END);
                }
              }
              range.collapse(true);
              range.select();
              range.scrollIntoView();
            }
          }
        }
      };
      var plugin = CKEDITOR.plugins.enterkey;
      var enterBr = plugin.enterBr;
      var enterBlock = plugin.enterBlock;
      var rbrace = /^h[1-6]$/;
    })();
    (function() {
      function buildTable(entities, reverse) {
        var table = {};
        var arr = [];
        var specialTable = {
          nbsp : " ",
          shy : "\u00ad",
          gt : ">",
          lt : "<",
          amp : "&",
          apos : "'",
          quot : '"'
        };
        entities = entities.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g, function(dataAndEvents, entity) {
          var idx = reverse ? "&" + entity + ";" : specialTable[entity];
          table[idx] = reverse ? specialTable[entity] : "&" + entity + ";";
          arr.push(idx);
          return "";
        });
        if (!reverse && entities) {
          entities = entities.split(",");
          var i = document.createElement("div");
          var chars;
          i.innerHTML = "&" + entities.join(";&") + ";";
          chars = i.innerHTML;
          i = null;
          i = 0;
          for (;i < chars.length;i++) {
            var m = chars.charAt(i);
            table[m] = "&" + entities[i] + ";";
            arr.push(m);
          }
        }
        table.regex = arr.join(reverse ? "|" : "");
        return table;
      }
      CKEDITOR.plugins.add("entities", {
        afterInit : function(filter) {
          var config = filter.config;
          if (filter = (filter = filter.dataProcessor) && filter.htmlFilter) {
            var selectedEntities = [];
            if (config.basicEntities !== false) {
              selectedEntities.push("nbsp,gt,lt,amp");
            }
            if (config.entities) {
              if (selectedEntities.length) {
                selectedEntities.push("quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro")
                ;
              }
              if (config.entities_latin) {
                selectedEntities.push("Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml");
              }
              if (config.entities_greek) {
                selectedEntities.push("Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv");
              }
              if (config.entities_additional) {
                selectedEntities.push(config.entities_additional);
              }
            }
            var entitiesTable = buildTable(selectedEntities.join(","));
            var r20 = entitiesTable.regex ? "[" + entitiesTable.regex + "]" : "a^";
            delete entitiesTable.regex;
            if (config.entities) {
              if (config.entities_processNumerical) {
                r20 = "[^ -~]|" + r20;
              }
            }
            r20 = RegExp(r20, "g");
            var getEntity = function(character) {
              return config.entities_processNumerical == "force" || !entitiesTable[character] ? "&#" + character.charCodeAt(0) + ";" : entitiesTable[character];
            };
            var baseEntitiesTable = buildTable("nbsp,gt,lt,amp,shy", true);
            var rreturn = RegExp(baseEntitiesTable.regex, "g");
            var guess = function(num) {
              return baseEntitiesTable[num];
            };
            filter.addRules({
              text : function(name) {
                return name.replace(rreturn, guess).replace(r20, getEntity);
              }
            }, {
              applyToAll : true,
              excludeNestedEditable : true
            });
          }
        }
      });
    })();
    CKEDITOR.config.basicEntities = true;
    CKEDITOR.config.entities = true;
    CKEDITOR.config.entities_latin = true;
    CKEDITOR.config.entities_greek = true;
    CKEDITOR.config.entities_additional = "#39";
    CKEDITOR.plugins.add("popup");
    CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
      popup : function(url, width, height, options) {
        width = width || "80%";
        height = height || "70%";
        if (typeof width == "string") {
          if (width.length > 1 && width.substr(width.length - 1, 1) == "%") {
            width = parseInt(window.screen.width * parseInt(width, 10) / 100, 10);
          }
        }
        if (typeof height == "string") {
          if (height.length > 1 && height.substr(height.length - 1, 1) == "%") {
            height = parseInt(window.screen.height * parseInt(height, 10) / 100, 10);
          }
        }
        if (width < 640) {
          width = 640;
        }
        if (height < 420) {
          height = 420;
        }
        var top = parseInt((window.screen.height - height) / 2, 10);
        var left = parseInt((window.screen.width - width) / 2, 10);
        options = (options || "location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes") + ",width=" + width + ",height=" + height + ",top=" + top + ",left=" + left;
        var popupWindow = window.open("", null, options, true);
        if (!popupWindow) {
          return false;
        }
        try {
          if (navigator.userAgent.toLowerCase().indexOf(" chrome/") == -1) {
            popupWindow.moveTo(left, top);
            popupWindow.resizeTo(width, height);
          }
          popupWindow.focus();
          popupWindow.location.href = url;
        } catch (j) {
          window.open(url, null, options, true);
        }
        return true;
      }
    });
    (function() {
      function addQueryString(url, params) {
        var tagNameArr = [];
        if (params) {
          var key;
          for (key in params) {
            tagNameArr.push(key + "=" + encodeURIComponent(params[key]));
          }
        } else {
          return url;
        }
        return url + (url.indexOf("?") != -1 ? "&" : "?") + tagNameArr.join("&");
      }
      function ucFirst(str) {
        str = str + "";
        return str.charAt(0).toUpperCase() + str.substr(1);
      }
      function browseServer() {
        var height = this.getDialog();
        var editor = height.getParentEditor();
        editor._.filebrowserSe = this;
        var width = editor.config["filebrowser" + ucFirst(height.getName()) + "WindowWidth"] || (editor.config.filebrowserWindowWidth || "80%");
        height = editor.config["filebrowser" + ucFirst(height.getName()) + "WindowHeight"] || (editor.config.filebrowserWindowHeight || "70%");
        var params = this.filebrowser.params || {};
        params.CKEditor = editor.name;
        params.CKEditorFuncNum = editor._.filebrowserFn;
        if (!params.langCode) {
          params.langCode = editor.langCode;
        }
        params = addQueryString(this.filebrowser.url, params);
        editor.popup(params, width, height, editor.config.filebrowserWindowFeatures || editor.config.fileBrowserWindowFeatures);
      }
      function uploadFile() {
        var dialog = this.getDialog();
        dialog.getParentEditor()._.filebrowserSe = this;
        return!dialog.getContentElement(this["for"][0], this["for"][1]).getInputElement().$.value || !dialog.getContentElement(this["for"][0], this["for"][1]).getAction() ? false : true;
      }
      function setupFileElement(editor, fileInput, filebrowser) {
        var params = filebrowser.params || {};
        params.CKEditor = editor.name;
        params.CKEditorFuncNum = editor._.filebrowserFn;
        if (!params.langCode) {
          params.langCode = editor.langCode;
        }
        fileInput.action = addQueryString(filebrowser.url, params);
        fileInput.filebrowser = filebrowser;
      }
      function attachFileBrowser(editor, dialogName, definition, elements) {
        if (elements && elements.length) {
          var element;
          var i = elements.length;
          for (;i--;) {
            element = elements[i];
            if (element.type == "hbox" || (element.type == "vbox" || element.type == "fieldset")) {
              attachFileBrowser(editor, dialogName, definition, element.children);
            }
            if (element.filebrowser) {
              if (typeof element.filebrowser == "string") {
                element.filebrowser = {
                  action : element.type == "fileButton" ? "QuickUpload" : "Browse",
                  target : element.filebrowser
                };
              }
              if (element.filebrowser.action == "Browse") {
                var url = element.filebrowser.url;
                if (url === void 0) {
                  url = editor.config["filebrowser" + ucFirst(dialogName) + "BrowseUrl"];
                  if (url === void 0) {
                    url = editor.config.filebrowserBrowseUrl;
                  }
                }
                if (url) {
                  element.onClick = browseServer;
                  element.filebrowser.url = url;
                  element.hidden = false;
                }
              } else {
                if (element.filebrowser.action == "QuickUpload" && element["for"]) {
                  url = element.filebrowser.url;
                  if (url === void 0) {
                    url = editor.config["filebrowser" + ucFirst(dialogName) + "UploadUrl"];
                    if (url === void 0) {
                      url = editor.config.filebrowserUploadUrl;
                    }
                  }
                  if (url) {
                    var onClick = element.onClick;
                    element.onClick = function(key) {
                      var optgroup = key.sender;
                      return onClick && onClick.call(optgroup, key) === false ? false : uploadFile.call(optgroup, key);
                    };
                    element.filebrowser.url = url;
                    element.hidden = false;
                    setupFileElement(editor, definition.getContents(element["for"][0]).get(element["for"][1]), element.filebrowser);
                  }
                }
              }
            }
          }
        }
      }
      function isConfigured(definition, tabId, from) {
        if (from.indexOf(";") !== -1) {
          from = from.split(";");
          var i = 0;
          for (;i < from.length;i++) {
            if (isConfigured(definition, tabId, from[i])) {
              return true;
            }
          }
          return false;
        }
        return(definition = definition.getContents(tabId).get(from).filebrowser) && definition.url;
      }
      function setUrl(key, data) {
        var dialog = this._.filebrowserSe.getDialog();
        var target = this._.filebrowserSe["for"];
        var onSelect = this._.filebrowserSe.filebrowser.onSelect;
        if (target) {
          dialog.getContentElement(target[0], target[1]).reset();
        }
        if (!(typeof data == "function" && data.call(this._.filebrowserSe) === false) && !(onSelect && onSelect.call(this._.filebrowserSe, key, data) === false)) {
          if (typeof data == "string") {
            if (data) {
              alert(data);
            }
          }
          if (key) {
            target = this._.filebrowserSe;
            dialog = target.getDialog();
            if (target = target.filebrowser.target || null) {
              target = target.split(":");
              if (onSelect = dialog.getContentElement(target[0], target[1])) {
                onSelect.setValue(key);
                dialog.selectPage(target[0]);
              }
            }
          }
        }
      }
      CKEDITOR.plugins.add("filebrowser", {
        requires : "popup",
        init : function(editor) {
          editor._.filebrowserFn = CKEDITOR.tools.addFunction(setUrl, editor);
          editor.on("destroy", function() {
            CKEDITOR.tools.removeFunction(this._.filebrowserFn);
          });
        }
      });
      CKEDITOR.on("dialogDefinition", function(evt) {
        if (evt.editor.plugins.filebrowser) {
          var definition = evt.data.definition;
          var element;
          var i = 0;
          for (;i < definition.contents.length;++i) {
            if (element = definition.contents[i]) {
              attachFileBrowser(evt.editor, evt.data.name, definition, element.elements);
              if (element.hidden && element.filebrowser) {
                element.hidden = !isConfigured(definition, element.id, element.filebrowser);
              }
            }
          }
        }
      });
    })();
    (function() {
      function attach(editor) {
        var config = editor.config;
        var html = editor.fire("uiSpace", {
          space : "top",
          html : ""
        }).html;
        var layout = function() {
          function updatePos(pos, name, val) {
            label.setStyle(name, pixelate(val));
            label.setStyle("position", pos);
          }
          function changeMode(newMode) {
            var editorPos = editable.getDocumentPosition();
            switch(newMode) {
              case "top":
                updatePos("absolute", "top", editorPos.y - spaceHeight - dockedOffsetY);
                break;
              case "pin":
                updatePos("fixed", "top", indents);
                break;
              case "bottom":
                updatePos("absolute", "top", editorPos.y + (editorRect.height || editorRect.bottom - editorRect.top) + dockedOffsetY);
            }
            mode = newMode;
          }
          var mode;
          var editable;
          var spaceRect;
          var editorRect;
          var viewRect;
          var spaceHeight;
          var pageScrollX;
          var dockedOffsetX = config.floatSpaceDockedOffsetX || 0;
          var dockedOffsetY = config.floatSpaceDockedOffsetY || 0;
          var pinnedOffsetX = config.floatSpacePinnedOffsetX || 0;
          var indents = config.floatSpacePinnedOffsetY || 0;
          return function(x) {
            if (editable = editor.editable()) {
              if (x) {
                if (x.name == "focus") {
                  label.show();
                }
              }
              label.removeStyle("left");
              label.removeStyle("right");
              spaceRect = label.getClientRect();
              editorRect = editable.getClientRect();
              viewRect = win.getViewPaneSize();
              spaceHeight = spaceRect.height;
              pageScrollX = "pageXOffset" in win.$ ? win.$.pageXOffset : CKEDITOR.document.$.documentElement.scrollLeft;
              if (mode) {
                if (spaceHeight + dockedOffsetY <= editorRect.top) {
                  changeMode("top");
                } else {
                  if (spaceHeight + dockedOffsetY > viewRect.height - editorRect.bottom) {
                    changeMode("pin");
                  } else {
                    changeMode("bottom");
                  }
                }
                x = viewRect.width / 2;
                x = editorRect.left > 0 && (editorRect.right < viewRect.width && editorRect.width > spaceRect.width) ? editor.config.contentsLangDirection == "rtl" ? "right" : "left" : x - editorRect.left > editorRect.right - x ? "left" : "right";
                var offset;
                if (spaceRect.width > viewRect.width) {
                  x = "left";
                  offset = 0;
                } else {
                  offset = x == "left" ? editorRect.left > 0 ? editorRect.left : 0 : editorRect.right < viewRect.width ? viewRect.width - editorRect.right : 0;
                  if (offset + spaceRect.width > viewRect.width) {
                    x = x == "left" ? "right" : "left";
                    offset = 0;
                  }
                }
                label.setStyle(x, pixelate((mode == "pin" ? pinnedOffsetX : dockedOffsetX) + offset + (mode == "pin" ? 0 : x == "left" ? pageScrollX : -pageScrollX)));
              } else {
                mode = "pin";
                changeMode("pin");
                layout(x);
              }
            }
          };
        }();
        if (html) {
          var label = CKEDITOR.document.getBody().append(CKEDITOR.dom.element.createFromHtml(floatSpaceTpl.output({
            content : html,
            id : editor.id,
            langDir : editor.lang.dir,
            langCode : editor.langCode,
            name : editor.name,
            style : "display:none;z-index:" + (config.baseFloatZIndex - 1),
            topId : editor.ui.spaceId("top"),
            voiceLabel : editor.lang.editorPanel + ", " + editor.name
          })));
          var changeBuffer = CKEDITOR.tools.eventsBuffer(500, layout);
          var uiBuffer = CKEDITOR.tools.eventsBuffer(100, layout);
          label.unselectable();
          label.on("mousedown", function(evt) {
            evt = evt.data;
            if (!evt.getTarget().hasAscendant("a", 1)) {
              evt.preventDefault();
            }
          });
          editor.on("focus", function(logEvent) {
            layout(logEvent);
            editor.on("change", changeBuffer.input);
            win.on("scroll", uiBuffer.input);
            win.on("resize", uiBuffer.input);
          });
          editor.on("blur", function() {
            label.hide();
            editor.removeListener("change", changeBuffer.input);
            win.removeListener("scroll", uiBuffer.input);
            win.removeListener("resize", uiBuffer.input);
          });
          editor.on("destroy", function() {
            win.removeListener("scroll", uiBuffer.input);
            win.removeListener("resize", uiBuffer.input);
            label.clearCustomData();
            label.remove();
          });
          if (editor.focusManager.hasFocus) {
            label.show();
          }
          editor.focusManager.add(label, 1);
        }
      }
      var floatSpaceTpl = CKEDITOR.addTemplate("floatcontainer", '<div id="cke_{name}" class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '" dir="{langDir}" title="' + (CKEDITOR.env.gecko ? " " : "") + '" lang="{langCode}" role="application" style="{style}" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><div class="cke_inner"><div id="{topId}" class="cke_top" role="presentation">{content}</div></div></div>');
      var win = CKEDITOR.document.getWindow();
      var pixelate = CKEDITOR.tools.cssLength;
      CKEDITOR.plugins.add("floatingspace", {
        init : function(editor) {
          editor.on("loaded", function() {
            attach(this);
          }, null, null, 20);
        }
      });
    })();
    CKEDITOR.plugins.add("htmlwriter", {
      init : function(editor) {
        var writer = new CKEDITOR.htmlWriter;
        writer.forceSimpleAmpersand = editor.config.forceSimpleAmpersand;
        writer.indentationChars = editor.config.dataIndentationChars || "\t";
        editor.dataProcessor.writer = writer;
      }
    });
    CKEDITOR.htmlWriter = CKEDITOR.tools.createClass({
      base : CKEDITOR.htmlParser.basicWriter,
      $ : function() {
        this.base();
        this.indentationChars = "\t";
        this.selfClosingEnd = " />";
        this.lineBreakChars = "\n";
        this.sortAttributes = 1;
        this._.indent = 0;
        this._.indentation = "";
        this._.inPre = 0;
        this._.rules = {};
        var dtd = CKEDITOR.dtd;
        var e;
        for (e in CKEDITOR.tools.extend({}, dtd.$nonBodyContent, dtd.$block, dtd.$listItem, dtd.$tableContent)) {
          this.setRules(e, {
            indent : !dtd[e]["#"],
            breakBeforeOpen : 1,
            breakBeforeClose : !dtd[e]["#"],
            breakAfterClose : 1,
            needsSpace : e in dtd.$block && !(e in {
              li : 1,
              dt : 1,
              dd : 1
            })
          });
        }
        this.setRules("br", {
          breakAfterOpen : 1
        });
        this.setRules("title", {
          indent : 0,
          breakAfterOpen : 0
        });
        this.setRules("style", {
          indent : 0,
          breakBeforeClose : 1
        });
        this.setRules("pre", {
          breakAfterOpen : 1,
          indent : 0
        });
      },
      proto : {
        openTag : function(tagName) {
          var rules = this._.rules[tagName];
          if (this._.afterCloser) {
            if (rules && (rules.needsSpace && this._.needsSpace)) {
              this._.output.push("\n");
            }
          }
          if (this._.indent) {
            this.indentation();
          } else {
            if (rules && rules.breakBeforeOpen) {
              this.lineBreak();
              this.indentation();
            }
          }
          this._.output.push("<", tagName);
          this._.afterCloser = 0;
        },
        openTagClose : function(tagName, isSelfClose) {
          var rules = this._.rules[tagName];
          if (isSelfClose) {
            this._.output.push(this.selfClosingEnd);
            if (rules && rules.breakAfterClose) {
              this._.needsSpace = rules.needsSpace;
            }
          } else {
            this._.output.push(">");
            if (rules && rules.indent) {
              this._.indentation = this._.indentation + this.indentationChars;
            }
          }
          if (rules) {
            if (rules.breakAfterOpen) {
              this.lineBreak();
            }
          }
          if (tagName == "pre") {
            this._.inPre = 1;
          }
        },
        attribute : function(attName, attValue) {
          if (typeof attValue == "string") {
            if (this.forceSimpleAmpersand) {
              attValue = attValue.replace(/&amp;/g, "&");
            }
            attValue = CKEDITOR.tools.htmlEncodeAttr(attValue);
          }
          this._.output.push(" ", attName, '="', attValue, '"');
        },
        closeTag : function(tagName) {
          var rules = this._.rules[tagName];
          if (rules && rules.indent) {
            this._.indentation = this._.indentation.substr(this.indentationChars.length);
          }
          if (this._.indent) {
            this.indentation();
          } else {
            if (rules && rules.breakBeforeClose) {
              this.lineBreak();
              this.indentation();
            }
          }
          this._.output.push("</", tagName, ">");
          if (tagName == "pre") {
            this._.inPre = 0;
          }
          if (rules && rules.breakAfterClose) {
            this.lineBreak();
            this._.needsSpace = rules.needsSpace;
          }
          this._.afterCloser = 1;
        },
        text : function(name) {
          if (this._.indent) {
            this.indentation();
            if (!this._.inPre) {
              name = CKEDITOR.tools.ltrim(name);
            }
          }
          this._.output.push(name);
        },
        comment : function(comment) {
          if (this._.indent) {
            this.indentation();
          }
          this._.output.push("\x3c!--", comment, "--\x3e");
        },
        lineBreak : function() {
          if (!this._.inPre) {
            if (this._.output.length > 0) {
              this._.output.push(this.lineBreakChars);
            }
          }
          this._.indent = 1;
        },
        indentation : function() {
          if (!this._.inPre) {
            if (this._.indentation) {
              this._.output.push(this._.indentation);
            }
          }
          this._.indent = 0;
        },
        reset : function() {
          this._.output = [];
          this._.indent = 0;
          this._.indentation = "";
          this._.afterCloser = 0;
          this._.inPre = 0;
        },
        setRules : function(tagName, opt_attributes) {
          var attributes = this._.rules[tagName];
          if (attributes) {
            CKEDITOR.tools.extend(attributes, opt_attributes, true);
          } else {
            this._.rules[tagName] = opt_attributes;
          }
        }
      }
    });
    (function() {
      function getSelectedImage(editor, element) {
        if (!element) {
          element = editor.getSelection().getSelectedElement();
        }
        if (element && (element.is("img") && (!element.data("cke-realelement") && !element.isReadOnly()))) {
          return element;
        }
      }
      function getImageAlignment(element) {
        var align = element.getStyle("float");
        if (align == "inherit" || align == "none") {
          align = 0;
        }
        if (!align) {
          align = element.getAttribute("align");
        }
        return align;
      }
      CKEDITOR.plugins.add("image", {
        requires : "dialog",
        init : function(editor) {
          if (!editor.plugins.image2) {
            CKEDITOR.dialog.add("image", this.path + "dialogs/image.js");
            var allowed = "img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}";
            if (CKEDITOR.dialog.isTabEnabled(editor, "image", "advanced")) {
              allowed = "img[alt,dir,id,lang,longdesc,!src,title]{*}(*)";
            }
            editor.addCommand("image", new CKEDITOR.dialogCommand("image", {
              allowedContent : allowed,
              requiredContent : "img[alt,src]",
              contentTransformations : [["img{width}: sizeToStyle", "img[width]: sizeToAttribute"], ["img{float}: alignmentToStyle", "img[align]: alignmentToAttribute"]]
            }));
            if (editor.ui.addButton) {
              editor.ui.addButton("Image", {
                label : editor.lang.common.image,
                command : "image",
                toolbar : "insert,10"
              });
            }
            editor.on("doubleclick", function(evt) {
              var element = evt.data.element;
              if (element.is("img") && (!element.data("cke-realelement") && !element.isReadOnly())) {
                evt.data.dialog = "image";
              }
            });
            if (editor.addMenuItems) {
              editor.addMenuItems({
                image : {
                  label : editor.lang.image.menu,
                  command : "image",
                  group : "image"
                }
              });
            }
            if (editor.contextMenu) {
              editor.contextMenu.addListener(function(element) {
                if (getSelectedImage(editor, element)) {
                  return{
                    image : CKEDITOR.TRISTATE_OFF
                  };
                }
              });
            }
          }
        },
        afterInit : function(editor) {
          function setupAlignCommand(value) {
            var command = editor.getCommand("justify" + value);
            if (command) {
              if (value == "left" || value == "right") {
                command.on("exec", function(item) {
                  var img = getSelectedImage(editor);
                  var align;
                  if (img) {
                    align = getImageAlignment(img);
                    if (align == value) {
                      img.removeStyle("float");
                      if (value == getImageAlignment(img)) {
                        img.removeAttribute("align");
                      }
                    } else {
                      img.setStyle("float", value);
                    }
                    item.cancel();
                  }
                });
              }
              command.on("refresh", function(item) {
                var img = getSelectedImage(editor);
                if (img) {
                  img = getImageAlignment(img);
                  this.setState(img == value ? CKEDITOR.TRISTATE_ON : value == "right" || value == "left" ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                  item.cancel();
                }
              });
            }
          }
          if (!editor.plugins.image2) {
            setupAlignCommand("left");
            setupAlignCommand("right");
            setupAlignCommand("center");
            setupAlignCommand("block");
          }
        }
      });
    })();
    CKEDITOR.config.image_removeLinkByEmptyURL = true;
    (function() {
      function getAlignment(element, useComputedState) {
        useComputedState = useComputedState === void 0 || useComputedState;
        var align;
        if (useComputedState) {
          align = element.getComputedStyle("text-align");
        } else {
          for (;!element.hasAttribute || !element.hasAttribute("align") && !element.getStyle("text-align");) {
            align = element.getParent();
            if (!align) {
              break;
            }
            element = align;
          }
          align = element.getStyle("text-align") || (element.getAttribute("align") || "");
        }
        if (align) {
          align = align.replace(/(?:-(?:moz|webkit)-)?(?:start|auto)/i, "");
        }
        if (!align) {
          if (useComputedState) {
            align = element.getComputedStyle("direction") == "rtl" ? "right" : "left";
          }
        }
        return align;
      }
      function justifyCommand(editor, name, value) {
        this.editor = editor;
        this.name = name;
        this.value = value;
        this.context = "p";
        name = editor.config.justifyClasses;
        var blockTag = editor.config.enterMode == CKEDITOR.ENTER_P ? "p" : "div";
        if (name) {
          switch(value) {
            case "left":
              this.cssClassName = name[0];
              break;
            case "center":
              this.cssClassName = name[1];
              break;
            case "right":
              this.cssClassName = name[2];
              break;
            case "justify":
              this.cssClassName = name[3];
          }
          this.cssClassRegex = RegExp("(?:^|\\s+)(?:" + name.join("|") + ")(?=$|\\s)");
          this.requiredContent = blockTag + "(" + this.cssClassName + ")";
        } else {
          this.requiredContent = blockTag + "{text-align}";
        }
        this.allowedContent = {
          "caption div h1 h2 h3 h4 h5 h6 p pre td th li" : {
            propertiesOnly : true,
            styles : this.cssClassName ? null : "text-align",
            classes : this.cssClassName || null
          }
        };
        if (editor.config.enterMode == CKEDITOR.ENTER_BR) {
          this.allowedContent.div = true;
        }
      }
      function onDirChanged(e) {
        var editor = e.editor;
        var range = editor.createRange();
        range.setStartBefore(e.data.node);
        range.setEndAfter(e.data.node);
        var walker = new CKEDITOR.dom.walker(range);
        var node;
        for (;node = walker.next();) {
          if (node.type == CKEDITOR.NODE_ELEMENT) {
            if (!node.equals(e.data.node) && node.getDirection()) {
              range.setStartAfter(node);
              walker = new CKEDITOR.dom.walker(range);
            } else {
              var classes = editor.config.justifyClasses;
              if (classes) {
                if (node.hasClass(classes[0])) {
                  node.removeClass(classes[0]);
                  node.addClass(classes[2]);
                } else {
                  if (node.hasClass(classes[2])) {
                    node.removeClass(classes[2]);
                    node.addClass(classes[0]);
                  }
                }
              }
              classes = node.getStyle("text-align");
              if (classes == "left") {
                node.setStyle("text-align", "right");
              } else {
                if (classes == "right") {
                  node.setStyle("text-align", "left");
                }
              }
            }
          }
        }
      }
      justifyCommand.prototype = {
        exec : function(editor) {
          var selection = editor.getSelection();
          var enterMode = editor.config.enterMode;
          if (selection) {
            var bookmarks = selection.createBookmarks();
            var codeSegments = selection.getRanges();
            var node = this.cssClassName;
            var iterator;
            var block;
            var useComputedState = editor.config.useComputedState;
            useComputedState = useComputedState === void 0 || useComputedState;
            var i = codeSegments.length - 1;
            for (;i >= 0;i--) {
              iterator = codeSegments[i].createIterator();
              iterator.enlargeBr = enterMode != CKEDITOR.ENTER_BR;
              for (;block = iterator.getNextParagraph(enterMode == CKEDITOR.ENTER_P ? "p" : "div");) {
                if (!block.isReadOnly()) {
                  block.removeAttribute("align");
                  block.removeStyle("text-align");
                  var p = node && (block.$.className = CKEDITOR.tools.ltrim(block.$.className.replace(this.cssClassRegex, "")));
                  var l = this.state == CKEDITOR.TRISTATE_OFF && (!useComputedState || getAlignment(block, true) != this.value);
                  if (node) {
                    if (l) {
                      block.addClass(node);
                    } else {
                      if (!p) {
                        block.removeAttribute("class");
                      }
                    }
                  } else {
                    if (l) {
                      block.setStyle("text-align", this.value);
                    }
                  }
                }
              }
            }
            editor.focus();
            editor.forceNextSelectionCheck();
            selection.selectBookmarks(bookmarks);
          }
        },
        refresh : function(editor, path) {
          var firstBlock = path.block || path.blockLimit;
          this.setState(firstBlock.getName() != "body" && getAlignment(firstBlock, this.editor.config.useComputedState) == this.value ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
        }
      };
      CKEDITOR.plugins.add("justify", {
        init : function(editor) {
          if (!editor.blockless) {
            var left = new justifyCommand(editor, "justifyleft", "left");
            var center = new justifyCommand(editor, "justifycenter", "center");
            var right = new justifyCommand(editor, "justifyright", "right");
            var justify = new justifyCommand(editor, "justifyblock", "justify");
            editor.addCommand("justifyleft", left);
            editor.addCommand("justifycenter", center);
            editor.addCommand("justifyright", right);
            editor.addCommand("justifyblock", justify);
            if (editor.ui.addButton) {
              editor.ui.addButton("JustifyLeft", {
                label : editor.lang.justify.left,
                command : "justifyleft",
                toolbar : "align,10"
              });
              editor.ui.addButton("JustifyCenter", {
                label : editor.lang.justify.center,
                command : "justifycenter",
                toolbar : "align,20"
              });
              editor.ui.addButton("JustifyRight", {
                label : editor.lang.justify.right,
                command : "justifyright",
                toolbar : "align,30"
              });
              editor.ui.addButton("JustifyBlock", {
                label : editor.lang.justify.block,
                command : "justifyblock",
                toolbar : "align,40"
              });
            }
            editor.on("dirChanged", onDirChanged);
          }
        }
      });
    })();
    (function() {
      function replaceCssLength(x, nextLine) {
        var pkgfile = multi.exec(x);
        var parts2 = multi.exec(nextLine);
        if (pkgfile) {
          if (!pkgfile[2] && parts2[2] == "px") {
            return parts2[1];
          }
          if (pkgfile[2] == "px" && !parts2[2]) {
            return parts2[1] + "px";
          }
        }
        return nextLine;
      }
      var cssStyle = CKEDITOR.htmlParser.cssStyle;
      var cssLength = CKEDITOR.tools.cssLength;
      var multi = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i;
      var rules = {
        elements : {
          $ : function(name) {
            var ret = name.attributes;
            if ((ret = (ret = (ret = ret && ret["data-cke-realelement"]) && new CKEDITOR.htmlParser.fragment.fromHtml(decodeURIComponent(ret))) && ret.children[0]) && name.attributes["data-cke-resizable"]) {
              var y = (new cssStyle(name)).rules;
              name = ret.attributes;
              var width = y.width;
              y = y.height;
              if (width) {
                name.width = replaceCssLength(name.width, width);
              }
              if (y) {
                name.height = replaceCssLength(name.height, y);
              }
            }
            return ret;
          }
        }
      };
      CKEDITOR.plugins.add("fakeobjects", {
        init : function(options) {
          options.filter.allow("img[!data-cke-realelement,src,alt,title](*){*}", "fakeobjects");
        },
        afterInit : function(filter) {
          if (filter = (filter = filter.dataProcessor) && filter.htmlFilter) {
            filter.addRules(rules, {
              applyToAll : true
            });
          }
        }
      });
      CKEDITOR.editor.prototype.createFakeElement = function(realElement, attributes, realElementType, width) {
        var lang = this.lang.fakeobjects;
        lang = lang[realElementType] || lang.unknown;
        attributes = {
          "class" : attributes,
          "data-cke-realelement" : encodeURIComponent(realElement.getOuterHtml()),
          "data-cke-real-node-type" : realElement.type,
          alt : lang,
          title : lang,
          align : realElement.getAttribute("align") || ""
        };
        if (!CKEDITOR.env.hc) {
          attributes.src = CKEDITOR.tools.transparentImageData;
        }
        if (realElementType) {
          attributes["data-cke-real-element-type"] = realElementType;
        }
        if (width) {
          attributes["data-cke-resizable"] = width;
          realElementType = new cssStyle;
          width = realElement.getAttribute("width");
          realElement = realElement.getAttribute("height");
          if (width) {
            realElementType.rules.width = cssLength(width);
          }
          if (realElement) {
            realElementType.rules.height = cssLength(realElement);
          }
          realElementType.populate(attributes);
        }
        return this.document.createElement("img", {
          attributes : attributes
        });
      };
      CKEDITOR.editor.prototype.createFakeParserElement = function(realElement, attributes, value, data) {
        var lang = this.lang.fakeobjects;
        lang = lang[value] || lang.unknown;
        var writer;
        writer = new CKEDITOR.htmlParser.basicWriter;
        realElement.writeHtml(writer);
        writer = writer.getHtml();
        attributes = {
          "class" : attributes,
          "data-cke-realelement" : encodeURIComponent(writer),
          "data-cke-real-node-type" : realElement.type,
          alt : lang,
          title : lang,
          align : realElement.attributes.align || ""
        };
        if (!CKEDITOR.env.hc) {
          attributes.src = CKEDITOR.tools.transparentImageData;
        }
        if (value) {
          attributes["data-cke-real-element-type"] = value;
        }
        if (data) {
          attributes["data-cke-resizable"] = data;
          data = realElement.attributes;
          realElement = new cssStyle;
          value = data.width;
          data = data.height;
          if (value != void 0) {
            realElement.rules.width = cssLength(value);
          }
          if (data != void 0) {
            realElement.rules.height = cssLength(data);
          }
          realElement.populate(attributes);
        }
        return new CKEDITOR.htmlParser.element("img", attributes);
      };
      CKEDITOR.editor.prototype.restoreRealElement = function(fakeElement) {
        if (fakeElement.data("cke-real-node-type") != CKEDITOR.NODE_ELEMENT) {
          return null;
        }
        var element = CKEDITOR.dom.element.createFromHtml(decodeURIComponent(fakeElement.data("cke-realelement")), this.document);
        if (fakeElement.data("cke-resizable")) {
          var width = fakeElement.getStyle("width");
          fakeElement = fakeElement.getStyle("height");
          if (width) {
            element.setAttribute("width", replaceCssLength(element.getAttribute("width"), width));
          }
          if (fakeElement) {
            element.setAttribute("height", replaceCssLength(element.getAttribute("height"), fakeElement));
          }
        }
        return element;
      };
    })();
    "use strict";
    (function() {
      function escapeText(messageFormat) {
        return messageFormat.replace(/'/g, "\\$&");
      }
      function put(a) {
        var vvar;
        var aLength = a.length;
        var assigns = [];
        var i = 0;
        for (;i < aLength;i++) {
          vvar = a.charCodeAt(i);
          assigns.push(vvar);
        }
        return "String.fromCharCode(" + assigns.join(",") + ")";
      }
      function next(data, params) {
        var n = data.plugins.link;
        var codeSegments = n.compiledProtectionFunction.params;
        var m;
        var html;
        html = [n.compiledProtectionFunction.name, "("];
        var i = 0;
        for (;i < codeSegments.length;i++) {
          n = codeSegments[i].toLowerCase();
          m = params[n];
          if (i > 0) {
            html.push(",");
          }
          html.push("'", m ? escapeText(encodeURIComponent(params[n])) : "", "'");
        }
        html.push(")");
        return html.join("");
      }
      function create(message) {
        message = message.config.emailProtection || "";
        var that;
        if (message && message != "encode") {
          that = {};
          message.replace(/^([^(]+)\(([^)]+)\)$/, function(dataAndEvents, e, messageFormat) {
            that.name = e;
            that.params = [];
            messageFormat.replace(/[^,\s]+/g, function(spaceName) {
              that.params.push(spaceName);
            });
          });
        }
        return that;
      }
      CKEDITOR.plugins.add("link", {
        requires : "dialog,fakeobjects",
        onLoad : function() {
          function cssWithDir(dir) {
            return template.replace(/%1/g, dir == "rtl" ? "right" : "left").replace(/%2/g, "cke_contents_" + dir);
          }
          var b = "background:url(" + CKEDITOR.getUrl(this.path + "images" + (CKEDITOR.env.hidpi ? "/hidpi" : "") + "/anchor.png") + ") no-repeat %1 center;border:1px dotted #00f;background-size:16px;";
          var template = ".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{" + b + "padding-%1:18px;cursor:auto;}.%2 img.cke_anchor{" + b + "width:16px;min-height:15px;height:1.15em;vertical-align:text-bottom;}";
          CKEDITOR.addCss(cssWithDir("ltr") + cssWithDir("rtl"));
        },
        init : function(editor) {
          var allowed = "a[!href]";
          if (CKEDITOR.dialog.isTabEnabled(editor, "link", "advanced")) {
            allowed = allowed.replace("]", ",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)");
          }
          if (CKEDITOR.dialog.isTabEnabled(editor, "link", "target")) {
            allowed = allowed.replace("]", ",target,onclick]");
          }
          editor.addCommand("link", new CKEDITOR.dialogCommand("link", {
            allowedContent : allowed,
            requiredContent : "a[href]"
          }));
          editor.addCommand("anchor", new CKEDITOR.dialogCommand("anchor", {
            allowedContent : "a[!name,id]",
            requiredContent : "a[name]"
          }));
          editor.addCommand("unlink", new CKEDITOR.unlinkCommand);
          editor.addCommand("removeAnchor", new CKEDITOR.removeAnchorCommand);
          editor.setKeystroke(CKEDITOR.CTRL + 76, "link");
          if (editor.ui.addButton) {
            editor.ui.addButton("Link", {
              label : editor.lang.link.toolbar,
              command : "link",
              toolbar : "links,10"
            });
            editor.ui.addButton("Unlink", {
              label : editor.lang.link.unlink,
              command : "unlink",
              toolbar : "links,20"
            });
            editor.ui.addButton("Anchor", {
              label : editor.lang.link.anchor.toolbar,
              command : "anchor",
              toolbar : "links,30"
            });
          }
          CKEDITOR.dialog.add("link", this.path + "dialogs/link.js");
          CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js");
          editor.on("doubleclick", function(me) {
            var element = CKEDITOR.plugins.link.getSelectedLink(editor) || me.data.element;
            if (!element.isReadOnly()) {
              if (element.is("a")) {
                me.data.dialog = element.getAttribute("name") && (!element.getAttribute("href") || !element.getChildCount()) ? "anchor" : "link";
                me.data.link = element;
              } else {
                if (CKEDITOR.plugins.link.tryRestoreFakeAnchor(editor, element)) {
                  me.data.dialog = "anchor";
                }
              }
            }
          }, null, null, 0);
          editor.on("doubleclick", function(aRecord) {
            if (aRecord.data.link) {
              editor.getSelection().selectElement(aRecord.data.link);
            }
          }, null, null, 20);
          if (editor.addMenuItems) {
            editor.addMenuItems({
              anchor : {
                label : editor.lang.link.anchor.menu,
                command : "anchor",
                group : "anchor",
                order : 1
              },
              removeAnchor : {
                label : editor.lang.link.anchor.remove,
                command : "removeAnchor",
                group : "anchor",
                order : 5
              },
              link : {
                label : editor.lang.link.menu,
                command : "link",
                group : "link",
                order : 1
              },
              unlink : {
                label : editor.lang.link.unlink,
                command : "unlink",
                group : "link",
                order : 5
              }
            });
          }
          if (editor.contextMenu) {
            editor.contextMenu.addListener(function(anchor) {
              if (!anchor || anchor.isReadOnly()) {
                return null;
              }
              anchor = CKEDITOR.plugins.link.tryRestoreFakeAnchor(editor, anchor);
              if (!anchor && !(anchor = CKEDITOR.plugins.link.getSelectedLink(editor))) {
                return null;
              }
              var menu = {};
              if (anchor.getAttribute("href")) {
                if (anchor.getChildCount()) {
                  menu = {
                    link : CKEDITOR.TRISTATE_OFF,
                    unlink : CKEDITOR.TRISTATE_OFF
                  };
                }
              }
              if (anchor && anchor.hasAttribute("name")) {
                menu.anchor = menu.removeAnchor = CKEDITOR.TRISTATE_OFF;
              }
              return menu;
            });
          }
          this.compiledProtectionFunction = create(editor);
        },
        afterInit : function(editor) {
          editor.dataProcessor.dataFilter.addRules({
            elements : {
              a : function(element) {
                return!element.attributes.name ? null : !element.children.length ? editor.createFakeParserElement(element, "cke_anchor", "anchor") : null;
              }
            }
          });
          var eventPath = editor._.elementsPath && editor._.elementsPath.filters;
          if (eventPath) {
            eventPath.push(function(element, el) {
              if (el == "a" && (CKEDITOR.plugins.link.tryRestoreFakeAnchor(editor, element) || element.getAttribute("name") && (!element.getAttribute("href") || !element.getChildCount()))) {
                return "anchor";
              }
            });
          }
        }
      });
      var rvar = /^javascript:/;
      var vvarText = /^mailto:([^?]+)(?:\?(.+))?$/;
      var vvar = /subject=([^;?:@&=$,\/]*)/;
      var match = /body=([^;?:@&=$,\/]*)/;
      var name = /^#(.*)$/;
      var elem = /^((?:http|https|ftp|news):\/\/)?(.*)$/;
      var optgroup = /^(_(?:self|top|parent|blank))$/;
      var r20 = /^javascript:void\(location\.href='mailto:'\+String\.fromCharCode\(([^)]+)\)(?:\+'(.*)')?\)$/;
      var rreturn = /^javascript:([^(]+)\(([^)]+)\)$/;
      var key = /\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/;
      var re = /(?:^|,)([^=]+)=(\d+|yes|no)/gi;
      var params = {
        id : "advId",
        dir : "advLangDir",
        accessKey : "advAccessKey",
        name : "advName",
        lang : "advLangCode",
        tabindex : "advTabIndex",
        title : "advTitle",
        type : "advContentType",
        "class" : "advCSSClasses",
        charset : "advCharset",
        style : "advStyles",
        rel : "advRel"
      };
      CKEDITOR.plugins.link = {
        getSelectedLink : function(editor) {
          var range = editor.getSelection();
          var selectedElement = range.getSelectedElement();
          if (selectedElement && selectedElement.is("a")) {
            return selectedElement;
          }
          if (range = range.getRanges()[0]) {
            range.shrink(CKEDITOR.SHRINK_TEXT);
            return editor.elementPath(range.getCommonAncestor()).contains("a", 1);
          }
          return null;
        },
        getEditorAnchors : function(editor) {
          var nodeList = editor.editable();
          var res = nodeList.isInline() && !editor.plugins.divarea ? editor.document : nodeList;
          nodeList = res.getElementsByTag("a");
          res = res.getElementsByTag("img");
          var anchors = [];
          var i = 0;
          var item;
          for (;item = nodeList.getItem(i++);) {
            if (item.data("cke-saved-name") || item.hasAttribute("name")) {
              anchors.push({
                name : item.data("cke-saved-name") || item.getAttribute("name"),
                id : item.getAttribute("id")
              });
            }
          }
          i = 0;
          for (;item = res.getItem(i++);) {
            if (item = this.tryRestoreFakeAnchor(editor, item)) {
              anchors.push({
                name : item.getAttribute("name"),
                id : item.getAttribute("id")
              });
            }
          }
          return anchors;
        },
        fakeAnchor : true,
        tryRestoreFakeAnchor : function(editor, element) {
          if (element && (element.data("cke-real-element-type") && element.data("cke-real-element-type") == "anchor")) {
            var link = editor.restoreRealElement(element);
            if (link.data("cke-saved-name")) {
              return link;
            }
          }
        },
        parseLinkAttributes : function(editor, element) {
          var ret = element && (element.data("cke-saved-href") || element.getAttribute("href")) || "";
          var compiledProtectionFunction = editor.plugins.link.compiledProtectionFunction;
          var featureMatch = editor.config.emailProtection;
          var data;
          var self = {};
          if (ret.match(rvar)) {
            if (featureMatch == "encode") {
              ret = ret.replace(r20, function(dataAndEvents, pair, messageFormat) {
                return "mailto:" + String.fromCharCode.apply(String, pair.split(",")) + (messageFormat && messageFormat.replace(/\\'/g, "'"));
              });
            } else {
              if (featureMatch) {
                ret.replace(rreturn, function(object, cx, serialized) {
                  if (cx == compiledProtectionFunction.name) {
                    self.type = "email";
                    object = self.email = {};
                    cx = /(^')|('$)/g;
                    serialized = serialized.match(/[^,\s]+/g);
                    var len = serialized.length;
                    var func;
                    var value;
                    var i = 0;
                    for (;i < len;i++) {
                      func = decodeURIComponent;
                      value = serialized[i].replace(cx, "").replace(/\\'/g, "'");
                      value = func(value);
                      func = compiledProtectionFunction.params[i].toLowerCase();
                      object[func] = value;
                    }
                    object.address = [object.name, object.domain].join("@");
                  }
                });
              }
            }
          }
          if (!self.type) {
            if (featureMatch = ret.match(name)) {
              self.type = "anchor";
              self.anchor = {};
              self.anchor.name = self.anchor.id = featureMatch[1];
            } else {
              if (featureMatch = ret.match(vvarText)) {
                data = ret.match(vvar);
                ret = ret.match(match);
                self.type = "email";
                var email = self.email = {};
                email.address = featureMatch[1];
                if (data) {
                  email.subject = decodeURIComponent(data[1]);
                }
                if (ret) {
                  email.body = decodeURIComponent(ret[1]);
                }
              } else {
                if (ret && (data = ret.match(elem))) {
                  self.type = "url";
                  self.url = {};
                  self.url.protocol = data[1];
                  self.url.url = data[2];
                }
              }
            }
          }
          if (element) {
            if (ret = element.getAttribute("target")) {
              self.target = {
                type : ret.match(optgroup) ? ret : "frame",
                name : ret
              };
            } else {
              if (ret = (ret = element.data("cke-pa-onclick") || element.getAttribute("onclick")) && ret.match(key)) {
                self.target = {
                  type : "popup",
                  name : ret[1]
                };
                for (;featureMatch = re.exec(ret[2]);) {
                  if ((featureMatch[2] == "yes" || featureMatch[2] == "1") && !(featureMatch[1] in {
                    height : 1,
                    width : 1,
                    top : 1,
                    left : 1
                  })) {
                    self.target[featureMatch[1]] = true;
                  } else {
                    if (isFinite(featureMatch[2])) {
                      self.target[featureMatch[1]] = featureMatch[2];
                    }
                  }
                }
              }
            }
            ret = {};
            var a;
            for (a in params) {
              if (featureMatch = element.getAttribute(a)) {
                ret[params[a]] = featureMatch;
              }
            }
            if (a = element.data("cke-saved-name") || ret.advName) {
              ret.advName = a;
            }
            if (!CKEDITOR.tools.isEmpty(ret)) {
              self.advanced = ret;
            }
          }
          return self;
        },
        getLinkAttributes : function(responseObject, data) {
          var value = responseObject.config.emailProtection || "";
          var attributes = {};
          switch(data.type) {
            case "url":
              value = data.url && data.url.protocol != void 0 ? data.url.protocol : "http://";
              var url = data.url && CKEDITOR.tools.trim(data.url.url) || "";
              attributes["data-cke-saved-href"] = url.indexOf("/") === 0 ? url : value + url;
              break;
            case "anchor":
              value = data.anchor && data.anchor.id;
              attributes["data-cke-saved-href"] = "#" + (data.anchor && data.anchor.name || (value || ""));
              break;
            case "email":
              var message = data.email;
              url = message.address;
              switch(value) {
                case "":
                ;
                case "encode":
                  var addFeature = encodeURIComponent(message.subject || "");
                  var encodedValue = encodeURIComponent(message.body || "");
                  message = [];
                  if (addFeature) {
                    message.push("subject=" + addFeature);
                  }
                  if (encodedValue) {
                    message.push("body=" + encodedValue);
                  }
                  message = message.length ? "?" + message.join("&") : "";
                  if (value == "encode") {
                    value = ["javascript:void(location.href='mailto:'+", put(url)];
                    if (message) {
                      value.push("+'", escapeText(message), "'");
                    }
                    value.push(")");
                  } else {
                    value = ["mailto:", url, message];
                  }
                  break;
                default:
                  value = url.split("@", 2);
                  message.name = value[0];
                  message.domain = value[1];
                  value = ["javascript:", next(responseObject, message)];
              }
              attributes["data-cke-saved-href"] = value.join("");
          }
          if (data.target) {
            if (data.target.type == "popup") {
              value = ["window.open(this.href, '", data.target.name || "", "', '"];
              var featureList = ["resizable", "status", "location", "toolbar", "menubar", "fullscreen", "scrollbars", "dependent"];
              url = featureList.length;
              addFeature = function(featureName) {
                if (data.target[featureName]) {
                  featureList.push(featureName + "=" + data.target[featureName]);
                }
              };
              message = 0;
              for (;message < url;message++) {
                featureList[message] = featureList[message] + (data.target[featureList[message]] ? "=yes" : "=no");
              }
              addFeature("width");
              addFeature("left");
              addFeature("height");
              addFeature("top");
              value.push(featureList.join(","), "'); return false;");
              attributes["data-cke-pa-onclick"] = value.join("");
            } else {
              if (data.target.type != "notSet" && data.target.name) {
                attributes.target = data.target.name;
              }
            }
          }
          if (data.advanced) {
            var key;
            for (key in params) {
              if (value = data.advanced[params[key]]) {
                attributes[key] = value;
              }
            }
            if (attributes.name) {
              attributes["data-cke-saved-name"] = attributes.name;
            }
          }
          if (attributes["data-cke-saved-href"]) {
            attributes.href = attributes["data-cke-saved-href"];
          }
          key = CKEDITOR.tools.extend({
            target : 1,
            onclick : 1,
            "data-cke-pa-onclick" : 1,
            "data-cke-saved-name" : 1
          }, params);
          var p;
          for (p in attributes) {
            delete key[p];
          }
          return{
            set : attributes,
            removed : CKEDITOR.tools.objectKeys(key)
          };
        }
      };
      CKEDITOR.unlinkCommand = function() {
      };
      CKEDITOR.unlinkCommand.prototype = {
        exec : function(editor) {
          var rvar = new CKEDITOR.style({
            element : "a",
            type : CKEDITOR.STYLE_INLINE,
            alwaysRemoveElement : 1
          });
          editor.removeStyle(rvar);
        },
        refresh : function(editor, path) {
          var element = path.lastElement && path.lastElement.getAscendant("a", true);
          if (element && (element.getName() == "a" && (element.getAttribute("href") && element.getChildCount()))) {
            this.setState(CKEDITOR.TRISTATE_OFF);
          } else {
            this.setState(CKEDITOR.TRISTATE_DISABLED);
          }
        },
        contextSensitive : 1,
        startDisabled : 1,
        requiredContent : "a[href]"
      };
      CKEDITOR.removeAnchorCommand = function() {
      };
      CKEDITOR.removeAnchorCommand.prototype = {
        exec : function(editor) {
          var selection = editor.getSelection();
          var bookmarks = selection.createBookmarks();
          var anchor;
          if (selection && ((anchor = selection.getSelectedElement()) && (!anchor.getChildCount() ? CKEDITOR.plugins.link.tryRestoreFakeAnchor(editor, anchor) : anchor.is("a")))) {
            anchor.remove(1);
          } else {
            if (anchor = CKEDITOR.plugins.link.getSelectedLink(editor)) {
              if (anchor.hasAttribute("href")) {
                anchor.removeAttributes({
                  name : 1,
                  "data-cke-saved-name" : 1
                });
                anchor.removeClass("cke_anchor");
              } else {
                anchor.remove(1);
              }
            }
          }
          selection.selectBookmarks(bookmarks);
        },
        requiredContent : "a[name]"
      };
      CKEDITOR.tools.extend(CKEDITOR.config, {
        linkShowAdvancedTab : true,
        linkShowTargetTab : true
      });
    })();
    (function() {
      function protectFormStyles(formElement) {
        if (!formElement || (formElement.type != CKEDITOR.NODE_ELEMENT || formElement.getName() != "form")) {
          return[];
        }
        var hijackRecord = [];
        var codeSegments = ["style", "className"];
        var i = 0;
        for (;i < codeSegments.length;i++) {
          var element = formElement.$.elements.namedItem(codeSegments[i]);
          if (element) {
            element = new CKEDITOR.dom.element(element);
            hijackRecord.push([element, element.nextSibling]);
            element.remove();
          }
        }
        return hijackRecord;
      }
      function restoreFormStyles(formElement, worlds) {
        if (formElement && (!(formElement.type != CKEDITOR.NODE_ELEMENT || formElement.getName() != "form") && worlds.length > 0)) {
          var i = worlds.length - 1;
          for (;i >= 0;i--) {
            var node = worlds[i][0];
            var child = worlds[i][1];
            if (child) {
              node.insertBefore(child);
            } else {
              node.appendTo(formElement);
            }
          }
        }
      }
      function saveStyles(element, dataAndEvents) {
        var data = protectFormStyles(element);
        var retval = {};
        var $element = element.$;
        if (!dataAndEvents) {
          retval["class"] = $element.className || "";
          $element.className = "";
        }
        retval.inline = $element.style.cssText || "";
        if (!dataAndEvents) {
          $element.style.cssText = "position: static; overflow: visible";
        }
        restoreFormStyles(data);
        return retval;
      }
      function restoreStyles(element, savedStyles) {
        var data = protectFormStyles(element);
        var $element = element.$;
        if ("class" in savedStyles) {
          $element.className = savedStyles["class"];
        }
        if ("inline" in savedStyles) {
          $element.style.cssText = savedStyles.inline;
        }
        restoreFormStyles(data);
      }
      function refreshCursor(editor) {
        if (!editor.editable().isInline()) {
          var all = CKEDITOR.instances;
          var i;
          for (i in all) {
            var one = all[i];
            if (one.mode == "wysiwyg" && !one.readOnly) {
              one = one.document.getBody();
              one.setAttribute("contentEditable", false);
              one.setAttribute("contentEditable", true);
            }
          }
          if (editor.editable().hasFocus) {
            editor.toolbox.focus();
            editor.focus();
          }
        }
      }
      CKEDITOR.plugins.add("maximize", {
        init : function(editor) {
          function resizeHandler() {
            var viewPaneSize = mainWindow.getViewPaneSize();
            editor.resize(viewPaneSize.width, viewPaneSize.height, null, true);
          }
          if (editor.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
            var lang = editor.lang;
            var mainDocument = CKEDITOR.document;
            var mainWindow = mainDocument.getWindow();
            var savedSelection;
            var savedScroll;
            var outerScroll;
            var savedState = CKEDITOR.TRISTATE_OFF;
            editor.addCommand("maximize", {
              modes : {
                wysiwyg : !CKEDITOR.env.iOS,
                source : !CKEDITOR.env.iOS
              },
              readOnly : 1,
              editorFocus : false,
              exec : function() {
                var container = editor.container.getChild(1);
                var contents = editor.ui.space("contents");
                if (editor.mode == "wysiwyg") {
                  var currentNode = editor.getSelection();
                  savedSelection = currentNode && currentNode.getRanges();
                  savedScroll = mainWindow.getScrollPosition();
                } else {
                  var $textarea = editor.editable().$;
                  savedSelection = !CKEDITOR.env.ie && [$textarea.selectionStart, $textarea.selectionEnd];
                  savedScroll = [$textarea.scrollLeft, $textarea.scrollTop];
                }
                if (this.state == CKEDITOR.TRISTATE_OFF) {
                  mainWindow.on("resize", resizeHandler);
                  outerScroll = mainWindow.getScrollPosition();
                  currentNode = editor.container;
                  for (;currentNode = currentNode.getParent();) {
                    currentNode.setCustomData("maximize_saved_styles", saveStyles(currentNode));
                    currentNode.setStyle("z-index", editor.config.baseFloatZIndex - 5);
                  }
                  contents.setCustomData("maximize_saved_styles", saveStyles(contents, true));
                  container.setCustomData("maximize_saved_styles", saveStyles(container, true));
                  contents = {
                    overflow : CKEDITOR.env.webkit ? "" : "hidden",
                    width : 0,
                    height : 0
                  };
                  mainDocument.getDocumentElement().setStyles(contents);
                  if (!CKEDITOR.env.gecko) {
                    mainDocument.getDocumentElement().setStyle("position", "fixed");
                  }
                  if (!CKEDITOR.env.gecko || !CKEDITOR.env.quirks) {
                    mainDocument.getBody().setStyles(contents);
                  }
                  if (CKEDITOR.env.ie) {
                    setTimeout(function() {
                      mainWindow.$.scrollTo(0, 0);
                    }, 0);
                  } else {
                    mainWindow.$.scrollTo(0, 0);
                  }
                  container.setStyle("position", CKEDITOR.env.gecko && CKEDITOR.env.quirks ? "fixed" : "absolute");
                  container.$.offsetLeft;
                  container.setStyles({
                    "z-index" : editor.config.baseFloatZIndex - 5,
                    left : "0px",
                    top : "0px"
                  });
                  container.addClass("cke_maximized");
                  resizeHandler();
                  contents = container.getDocumentPosition();
                  container.setStyles({
                    left : -1 * contents.x + "px",
                    top : -1 * contents.y + "px"
                  });
                  if (CKEDITOR.env.gecko) {
                    refreshCursor(editor);
                  }
                } else {
                  if (this.state == CKEDITOR.TRISTATE_ON) {
                    mainWindow.removeListener("resize", resizeHandler);
                    contents = [contents, container];
                    currentNode = 0;
                    for (;currentNode < contents.length;currentNode++) {
                      restoreStyles(contents[currentNode], contents[currentNode].getCustomData("maximize_saved_styles"));
                      contents[currentNode].removeCustomData("maximize_saved_styles");
                    }
                    currentNode = editor.container;
                    for (;currentNode = currentNode.getParent();) {
                      restoreStyles(currentNode, currentNode.getCustomData("maximize_saved_styles"));
                      currentNode.removeCustomData("maximize_saved_styles");
                    }
                    if (CKEDITOR.env.ie) {
                      setTimeout(function() {
                        mainWindow.$.scrollTo(outerScroll.x, outerScroll.y);
                      }, 0);
                    } else {
                      mainWindow.$.scrollTo(outerScroll.x, outerScroll.y);
                    }
                    container.removeClass("cke_maximized");
                    if (CKEDITOR.env.webkit) {
                      container.setStyle("display", "inline");
                      setTimeout(function() {
                        container.setStyle("display", "block");
                      }, 0);
                    }
                    editor.fire("resize");
                  }
                }
                this.toggleState();
                if (currentNode = this.uiItems[0]) {
                  contents = this.state == CKEDITOR.TRISTATE_OFF ? lang.maximize.maximize : lang.maximize.minimize;
                  currentNode = CKEDITOR.document.getById(currentNode._.id);
                  currentNode.getChild(1).setHtml(contents);
                  currentNode.setAttribute("title", contents);
                  currentNode.setAttribute("href", 'javascript:void("' + contents + '");');
                }
                if (editor.mode == "wysiwyg") {
                  if (savedSelection) {
                    if (CKEDITOR.env.gecko) {
                      refreshCursor(editor);
                    }
                    editor.getSelection().selectRanges(savedSelection);
                    if ($textarea = editor.getSelection().getStartElement()) {
                      $textarea.scrollIntoView(true);
                    }
                  } else {
                    mainWindow.$.scrollTo(savedScroll.x, savedScroll.y);
                  }
                } else {
                  if (savedSelection) {
                    $textarea.selectionStart = savedSelection[0];
                    $textarea.selectionEnd = savedSelection[1];
                  }
                  $textarea.scrollLeft = savedScroll[0];
                  $textarea.scrollTop = savedScroll[1];
                }
                savedSelection = savedScroll = null;
                savedState = this.state;
                editor.fire("maximize", this.state);
              },
              canUndo : false
            });
            if (editor.ui.addButton) {
              editor.ui.addButton("Maximize", {
                label : lang.maximize.maximize,
                command : "maximize",
                toolbar : "tools,10"
              });
            }
            editor.on("mode", function() {
              var command = editor.getCommand("maximize");
              command.setState(command.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : savedState);
            }, null, null, 100);
          }
        }
      });
    })();
    (function() {
      var pluginPath;
      var previewCmd = {
        modes : {
          wysiwyg : 1,
          source : 1
        },
        canUndo : false,
        readOnly : 1,
        exec : function(editor) {
          var data;
          var config = editor.config;
          var baseTag = config.baseHref ? '<base href="' + config.baseHref + '"/>' : "";
          if (config.fullPage) {
            data = editor.getData().replace(/<head>/, "$&" + baseTag).replace(/[^>]*(?=<\/title>)/, "$& &mdash; " + editor.lang.preview.preview);
          } else {
            config = "<body ";
            var left = editor.document && editor.document.getBody();
            if (left) {
              if (left.getAttribute("id")) {
                config = config + ('id="' + left.getAttribute("id") + '" ');
              }
              if (left.getAttribute("class")) {
                config = config + ('class="' + left.getAttribute("class") + '" ');
              }
            }
            data = editor.config.docType + '<html dir="' + editor.config.contentsLangDirection + '"><head>' + baseTag + "<title>" + editor.lang.preview.preview + "</title>" + CKEDITOR.tools.buildStyleHtml(editor.config.contentsCss) + "</head>" + (config + ">") + editor.getData() + "</body></html>";
          }
          baseTag = 640;
          config = 420;
          left = 80;
          try {
            var target = window.screen;
            baseTag = Math.round(target.width * 0.8);
            config = Math.round(target.height * 0.7);
            left = Math.round(target.width * 0.1);
          } catch (g) {
          }
          if (editor.fire("contentPreview", editor = {
            dataValue : data
          }) === false) {
            return false;
          }
          target = "";
          var doc;
          if (CKEDITOR.env.ie) {
            window._cke_htmlToLoad = editor.dataValue;
            doc = "javascript:void( (function(){document.open();" + ("(" + CKEDITOR.tools.fixDomain + ")();").replace(/\/\/.*?\n/g, "").replace(/parent\./g, "window.opener.") + "document.write( window.opener._cke_htmlToLoad );document.close();window.opener._cke_htmlToLoad = null;})() )";
            target = "";
          }
          if (CKEDITOR.env.gecko) {
            window._cke_htmlToLoad = editor.dataValue;
            target = pluginPath + "preview.html";
          }
          target = window.open(target, null, "toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=" + baseTag + ",height=" + config + ",left=" + left);
          if (CKEDITOR.env.ie && target) {
            target.location = doc;
          }
          if (!CKEDITOR.env.ie && !CKEDITOR.env.gecko) {
            doc = target.document;
            doc.open();
            doc.write(editor.dataValue);
            doc.close();
          }
          return true;
        }
      };
      CKEDITOR.plugins.add("preview", {
        init : function(editor) {
          if (editor.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
            pluginPath = this.path;
            editor.addCommand("preview", previewCmd);
            if (editor.ui.addButton) {
              editor.ui.addButton("Preview", {
                label : editor.lang.preview.preview,
                command : "preview",
                toolbar : "document,40"
              });
            }
          }
        }
      });
    })();
    CKEDITOR.plugins.add("resize", {
      init : function(editor) {
        var duration;
        var method;
        var mouse_drag_x;
        var mouse_drag_y;
        var config = editor.config;
        var resizer = editor.ui.spaceId("resizer");
        var resizeDir = editor.element ? editor.element.getDirection(1) : "ltr";
        if (!config.resize_dir) {
          config.resize_dir = "vertical";
        }
        if (config.resize_maxWidth == void 0) {
          config.resize_maxWidth = 3E3;
        }
        if (config.resize_maxHeight == void 0) {
          config.resize_maxHeight = 3E3;
        }
        if (config.resize_minWidth == void 0) {
          config.resize_minWidth = 750;
        }
        if (config.resize_minHeight == void 0) {
          config.resize_minHeight = 250;
        }
        if (config.resize_enabled !== false) {
          var container = null;
          var resizeHorizontal = (config.resize_dir == "both" || config.resize_dir == "horizontal") && config.resize_minWidth != config.resize_maxWidth;
          var k = (config.resize_dir == "both" || config.resize_dir == "vertical") && config.resize_minHeight != config.resize_maxHeight;
          var dragHandler = function(val) {
            var width = duration;
            var key = method;
            var internalWidth = width + (val.data.$.screenX - mouse_drag_x) * (resizeDir == "rtl" ? -1 : 1);
            val = key + (val.data.$.screenY - mouse_drag_y);
            if (resizeHorizontal) {
              width = Math.max(config.resize_minWidth, Math.min(internalWidth, config.resize_maxWidth));
            }
            if (k) {
              key = Math.max(config.resize_minHeight, Math.min(val, config.resize_maxHeight));
            }
            editor.resize(resizeHorizontal ? width : null, key);
          };
          var onMouseUp = function() {
            CKEDITOR.document.removeListener("mousemove", dragHandler);
            CKEDITOR.document.removeListener("mouseup", onMouseUp);
            if (editor.document) {
              editor.document.removeListener("mousemove", dragHandler);
              editor.document.removeListener("mouseup", onMouseUp);
            }
          };
          var hash = CKEDITOR.tools.addFunction(function(evt) {
            if (!container) {
              container = editor.getResizable();
            }
            duration = container.$.offsetWidth || 0;
            method = container.$.offsetHeight || 0;
            mouse_drag_x = evt.screenX;
            mouse_drag_y = evt.screenY;
            if (config.resize_minWidth > duration) {
              config.resize_minWidth = duration;
            }
            if (config.resize_minHeight > method) {
              config.resize_minHeight = method;
            }
            CKEDITOR.document.on("mousemove", dragHandler);
            CKEDITOR.document.on("mouseup", onMouseUp);
            if (editor.document) {
              editor.document.on("mousemove", dragHandler);
              editor.document.on("mouseup", onMouseUp);
            }
            if (evt.preventDefault) {
              evt.preventDefault();
            }
          });
          editor.on("destroy", function() {
            CKEDITOR.tools.removeFunction(hash);
          });
          editor.on("uiSpace", function(event) {
            if (event.data.space == "bottom") {
              var direction = "";
              if (resizeHorizontal) {
                if (!k) {
                  direction = " cke_resizer_horizontal";
                }
              }
              if (!resizeHorizontal) {
                if (k) {
                  direction = " cke_resizer_vertical";
                }
              }
              var resizerHtml = '<span id="' + resizer + '" class="cke_resizer' + direction + " cke_resizer_" + resizeDir + '" title="' + CKEDITOR.tools.htmlEncode(editor.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + hash + ', event)">' + (resizeDir == "ltr" ? "\u25e2" : "\u25e3") + "</span>";
              if (resizeDir == "ltr" && direction == "ltr") {
                event.data.html = event.data.html + resizerHtml;
              } else {
                event.data.html = resizerHtml + event.data.html;
              }
            }
          }, editor, null, 100);
          editor.on("maximize", function(event) {
            editor.ui.space("resizer")[event.data == CKEDITOR.TRISTATE_ON ? "hide" : "show"]();
          });
        }
      }
    });
    (function() {
      CKEDITOR.plugins.add("selectall", {
        init : function(editor) {
          editor.addCommand("selectAll", {
            modes : {
              wysiwyg : 1,
              source : 1
            },
            exec : function(editor) {
              var container = editor.editable();
              if (container.is("textarea")) {
                editor = container.$;
                if (CKEDITOR.env.ie) {
                  editor.createTextRange().execCommand("SelectAll");
                } else {
                  editor.selectionStart = 0;
                  editor.selectionEnd = editor.value.length;
                }
                editor.focus();
              } else {
                if (container.is("body")) {
                  editor.document.$.execCommand("SelectAll", false, null);
                } else {
                  var range = editor.createRange();
                  range.selectNodeContents(container);
                  range.select();
                }
                editor.forceNextSelectionCheck();
                editor.selectionChange();
              }
            },
            canUndo : false
          });
          if (editor.ui.addButton) {
            editor.ui.addButton("SelectAll", {
              label : editor.lang.selectall.toolbar,
              command : "selectAll",
              toolbar : "selection,10"
            });
          }
        }
      });
    })();
    (function() {
      CKEDITOR.plugins.add("sourcearea", {
        init : function(editor) {
          function update() {
            var clone = src && this.equals(CKEDITOR.document.getActive());
            this.hide();
            this.setStyle("height", this.getParent().$.clientHeight + "px");
            this.setStyle("width", this.getParent().$.clientWidth + "px");
            this.show();
            if (clone) {
              this.focus();
            }
          }
          if (editor.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
            var sourcearea = CKEDITOR.plugins.sourcearea;
            editor.addMode("source", function(done) {
              var textarea = editor.ui.space("contents").getDocument().createElement("textarea");
              textarea.setStyles(CKEDITOR.tools.extend({
                width : CKEDITOR.env.ie7Compat ? "99%" : "100%",
                height : "100%",
                resize : "none",
                outline : "none",
                "text-align" : "left"
              }, CKEDITOR.tools.cssVendorPrefix("tab-size", editor.config.sourceAreaTabSize || 4)));
              textarea.setAttribute("dir", "ltr");
              textarea.addClass("cke_source cke_reset cke_enable_context_menu");
              editor.ui.space("contents").append(textarea);
              textarea = editor.editable(new sourceEditable(editor, textarea));
              textarea.setData(editor.getData(1));
              if (CKEDITOR.env.ie) {
                textarea.attachListener(editor, "resize", update, textarea);
                textarea.attachListener(CKEDITOR.document.getWindow(), "resize", update, textarea);
                CKEDITOR.tools.setTimeout(update, 0, textarea);
              }
              editor.fire("ariaWidget", this);
              done();
            });
            editor.addCommand("source", sourcearea.commands.source);
            if (editor.ui.addButton) {
              editor.ui.addButton("Source", {
                label : editor.lang.sourcearea.toolbar,
                command : "source",
                toolbar : "mode,10"
              });
            }
            editor.on("mode", function() {
              editor.getCommand("source").setState(editor.mode == "source" ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
            });
            var src = CKEDITOR.env.ie && CKEDITOR.env.version == 9;
          }
        }
      });
      var sourceEditable = CKEDITOR.tools.createClass({
        base : CKEDITOR.editable,
        proto : {
          setData : function(value) {
            this.setValue(value);
            this.status = "ready";
            this.editor.fire("dataReady");
          },
          getData : function() {
            return this.getValue();
          },
          insertHtml : function() {
          },
          insertElement : function() {
          },
          insertText : function() {
          },
          setReadOnly : function(isReadOnly) {
            this[(isReadOnly ? "set" : "remove") + "Attribute"]("readOnly", "readonly");
          },
          detach : function() {
            sourceEditable.baseProto.detach.call(this);
            this.clearCustomData();
            this.remove();
          }
        }
      });
    })();
    CKEDITOR.plugins.sourcearea = {
      commands : {
        source : {
          modes : {
            wysiwyg : 1,
            source : 1
          },
          editorFocus : false,
          readOnly : 1,
          exec : function(editor) {
            if (editor.mode == "wysiwyg") {
              editor.fire("saveSnapshot");
            }
            editor.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);
            editor.setMode(editor.mode == "source" ? "wysiwyg" : "source");
          },
          canUndo : false
        }
      }
    };
    (function() {
      var camelKey = '<a id="{id}" class="cke_button cke_button__{name} cke_button_{state} {cls}"' + (CKEDITOR.env.gecko && !CKEDITOR.env.hc ? "" : " href=\"javascript:void('{titleJs}')\"") + ' title="{title}" tabindex="-1" hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="{hasArrow}" aria-disabled="{ariaDisabled}"';
      if (CKEDITOR.env.gecko) {
        if (CKEDITOR.env.mac) {
          camelKey = camelKey + ' onkeypress="return false;"';
        }
      }
      if (CKEDITOR.env.gecko) {
        camelKey = camelKey + ' onblur="this.style.cssText = this.style.cssText;"';
      }
      camelKey = camelKey + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"');
      camelKey = camelKey + '>&nbsp;</span><span id="{id}_label" class="cke_button_label cke_button__{name}_label" aria-hidden="false">{label}</span>{arrowHtml}</a>';
      var btnArrowTpl = CKEDITOR.addTemplate("buttonArrow", '<span class="cke_button_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : "") + "</span>");
      var data = CKEDITOR.addTemplate("button", camelKey);
      CKEDITOR.plugins.add("button", {
        beforeInit : function(editor) {
          editor.ui.addHandler(CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler);
        }
      });
      CKEDITOR.UI_BUTTON = "button";
      CKEDITOR.ui.button = function(name) {
        CKEDITOR.tools.extend(this, name, {
          title : name.label,
          click : name.click || function(editor) {
            editor.execCommand(name.command);
          }
        });
        this._ = {};
      };
      CKEDITOR.ui.button.handler = {
        create : function(var_args) {
          return new CKEDITOR.ui.button(var_args);
        }
      };
      CKEDITOR.ui.button.prototype = {
        render : function(editor, name) {
          var optgroup = CKEDITOR.env;
          var hash = this._.id = CKEDITOR.tools.getNextId();
          var value = "";
          var command = this.command;
          var clickFn;
          this._.editor = editor;
          var instance = {
            id : hash,
            button : this,
            editor : editor,
            focus : function() {
              CKEDITOR.document.getById(hash).focus();
            },
            execute : function() {
              this.button.click(editor);
            },
            attach : function(editor) {
              this.button.attach(editor);
            }
          };
          var keydownFn = CKEDITOR.tools.addFunction(function(ev) {
            if (instance.onkey) {
              ev = new CKEDITOR.dom.event(ev);
              return instance.onkey(instance, ev.getKeystroke()) !== false;
            }
          });
          var focusFn = CKEDITOR.tools.addFunction(function(ev) {
            var retVal;
            if (instance.onfocus) {
              retVal = instance.onfocus(instance, new CKEDITOR.dom.event(ev)) !== false;
            }
            return retVal;
          });
          var r = 0;
          instance.clickFn = clickFn = CKEDITOR.tools.addFunction(function() {
            if (r) {
              editor.unlockSelection(1);
              r = 0;
            }
            instance.execute();
          });
          if (this.modes) {
            var modeStates = {};
            var updateState = function() {
              var mode = editor.mode;
              if (mode) {
                mode = this.modes[mode] ? modeStates[mode] != void 0 ? modeStates[mode] : CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
                mode = editor.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : mode;
                this.setState(mode);
                if (this.refresh) {
                  this.refresh();
                }
              }
            };
            editor.on("beforeModeUnload", function() {
              if (editor.mode && this._.state != CKEDITOR.TRISTATE_DISABLED) {
                modeStates[editor.mode] = this._.state;
              }
            }, this);
            editor.on("activeFilterChange", updateState, this);
            editor.on("mode", updateState, this);
            if (!this.readOnly) {
              editor.on("readOnly", updateState, this);
            }
          } else {
            if (command) {
              if (command = editor.getCommand(command)) {
                command.on("state", function() {
                  this.setState(command.state);
                }, this);
                value = value + (command.state == CKEDITOR.TRISTATE_ON ? "on" : command.state == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off");
              }
            }
          }
          if (this.directional) {
            editor.on("contentDirChanged", function(state) {
              var el = CKEDITOR.document.getById(this._.id);
              var icon = el.getFirst();
              state = state.data;
              if (state != editor.lang.dir) {
                el.addClass("cke_" + state);
              } else {
                el.removeClass("cke_ltr").removeClass("cke_rtl");
              }
              icon.setAttribute("style", CKEDITOR.skin.getIconStyle(iconName, state == "rtl", this.icon, this.iconOffset));
            }, this);
          }
          if (!command) {
            value = value + "off";
          }
          var iconName = updateState = this.name || this.command;
          if (this.icon && !/\./.test(this.icon)) {
            iconName = this.icon;
            this.icon = null;
          }
          optgroup = {
            id : hash,
            name : updateState,
            iconName : iconName,
            label : this.label,
            cls : this.className || "",
            state : value,
            ariaDisabled : value == "disabled" ? "true" : "false",
            title : this.title,
            titleJs : optgroup.gecko && !optgroup.hc ? "" : (this.title || "").replace("'", ""),
            hasArrow : this.hasArrow ? "true" : "false",
            keydownFn : keydownFn,
            focusFn : focusFn,
            clickFn : clickFn,
            style : CKEDITOR.skin.getIconStyle(iconName, editor.lang.dir == "rtl", this.icon, this.iconOffset),
            arrowHtml : this.hasArrow ? btnArrowTpl.output() : ""
          };
          data.output(optgroup, name);
          if (this.onRender) {
            this.onRender();
          }
          return instance;
        },
        setState : function(state) {
          if (this._.state == state) {
            return false;
          }
          this._.state = state;
          var element = CKEDITOR.document.getById(this._.id);
          if (element) {
            element.setState(state, "cke_button");
            if (state == CKEDITOR.TRISTATE_DISABLED) {
              element.setAttribute("aria-disabled", true);
            } else {
              element.removeAttribute("aria-disabled");
            }
            if (this.hasArrow) {
              state = state == CKEDITOR.TRISTATE_ON ? this._.editor.lang.button.selectedLabel.replace(/%1/g, this.label) : this.label;
              CKEDITOR.document.getById(this._.id + "_label").setText(state);
            } else {
              if (state == CKEDITOR.TRISTATE_ON) {
                element.setAttribute("aria-pressed", true);
              } else {
                element.removeAttribute("aria-pressed");
              }
            }
            return true;
          }
          return false;
        },
        getState : function() {
          return this._.state;
        },
        toFeature : function(editor) {
          if (this._.feature) {
            return this._.feature;
          }
          var feature = this;
          if (!this.allowedContent) {
            if (!this.requiredContent && this.command) {
              feature = editor.getCommand(this.command) || feature;
            }
          }
          return this._.feature = feature;
        }
      };
      CKEDITOR.ui.prototype.addButton = function(name, opt_attributes) {
        this.add(name, CKEDITOR.UI_BUTTON, opt_attributes);
      };
    })();
    (function() {
      function getToolbarConfig(editor) {
        function buildToolbarConfig() {
          var lookup = getItemDefinedGroups();
          var codeSegments = CKEDITOR.tools.clone(editor.config.toolbarGroups) || getPrivateToolbarGroups(editor);
          var i = 0;
          for (;i < codeSegments.length;i++) {
            var toolbarGroup = codeSegments[i];
            if (toolbarGroup != "/") {
              if (typeof toolbarGroup == "string") {
                toolbarGroup = codeSegments[i] = {
                  name : toolbarGroup
                };
              }
              var type;
              var subGroups = toolbarGroup.groups;
              if (subGroups) {
                var j = 0;
                for (;j < subGroups.length;j++) {
                  type = subGroups[j];
                  if (type = lookup[type]) {
                    fillGroup(toolbarGroup, type);
                  }
                }
              }
              if (type = lookup[toolbarGroup.name]) {
                fillGroup(toolbarGroup, type);
              }
            }
          }
          return codeSegments;
        }
        function getItemDefinedGroups() {
          var map = {};
          var itemName;
          var item;
          var order;
          for (itemName in editor.ui.items) {
            item = editor.ui.items[itemName];
            order = item.toolbar || "others";
            order = order.split(",");
            item = order[0];
            order = parseInt(order[1] || -1, 10);
            if (!map[item]) {
              map[item] = [];
            }
            map[item].push({
              name : itemName,
              order : order
            });
          }
          for (item in map) {
            map[item] = map[item].sort(function(a, b) {
              return a.order == b.order ? 0 : b.order < 0 ? -1 : a.order < 0 ? 1 : a.order < b.order ? -1 : 1;
            });
          }
          return map;
        }
        function fillGroup(toolbarGroup, tests) {
          if (tests.length) {
            if (toolbarGroup.items) {
              toolbarGroup.items.push(editor.ui.create("-"));
            } else {
              toolbarGroup.items = [];
            }
            var f;
            for (;f = tests.shift();) {
              f = typeof f == "string" ? f : f.name;
              if (!removeButtons || CKEDITOR.tools.indexOf(removeButtons, f) == -1) {
                if (f = editor.ui.create(f)) {
                  if (editor.addFeature(f)) {
                    toolbarGroup.items.push(f);
                  }
                }
              }
            }
          }
        }
        function populateToolbarConfig(config) {
          var toolbar = [];
          var i;
          var group;
          var newGroup;
          i = 0;
          for (;i < config.length;++i) {
            group = config[i];
            newGroup = {};
            if (group == "/") {
              toolbar.push(group);
            } else {
              if (CKEDITOR.tools.isArray(group)) {
                fillGroup(newGroup, CKEDITOR.tools.clone(group));
                toolbar.push(newGroup);
              } else {
                if (group.items) {
                  fillGroup(newGroup, CKEDITOR.tools.clone(group.items));
                  newGroup.name = group.name;
                  toolbar.push(newGroup);
                }
              }
            }
          }
          return toolbar;
        }
        var removeButtons = editor.config.removeButtons;
        removeButtons = removeButtons && removeButtons.split(",");
        var toolbar = editor.config.toolbar;
        if (typeof toolbar == "string") {
          toolbar = editor.config["toolbar_" + toolbar];
        }
        return editor.toolbar = toolbar ? populateToolbarConfig(toolbar) : buildToolbarConfig();
      }
      function getPrivateToolbarGroups(editor) {
        return editor._.toolbarGroups || (editor._.toolbarGroups = [{
          name : "document",
          groups : ["mode", "document", "doctools"]
        }, {
          name : "clipboard",
          groups : ["clipboard", "undo"]
        }, {
          name : "editing",
          groups : ["find", "selection", "spellchecker"]
        }, {
          name : "forms"
        }, "/", {
          name : "basicstyles",
          groups : ["basicstyles", "cleanup"]
        }, {
          name : "paragraph",
          groups : ["list", "indent", "blocks", "align", "bidi"]
        }, {
          name : "links"
        }, {
          name : "insert"
        }, "/", {
          name : "styles"
        }, {
          name : "colors"
        }, {
          name : "tools"
        }, {
          name : "others"
        }, {
          name : "about"
        }]);
      }
      var toolbox = function() {
        this.toolbars = [];
        this.focusCommandExecuted = false;
      };
      toolbox.prototype.focus = function() {
        var t = 0;
        var toolbar;
        for (;toolbar = this.toolbars[t++];) {
          var i = 0;
          var submenu;
          for (;submenu = toolbar.items[i++];) {
            if (submenu.focus) {
              submenu.focus();
              return;
            }
          }
        }
      };
      var saveCmd = {
        modes : {
          wysiwyg : 1,
          source : 1
        },
        readOnly : 1,
        exec : function(editor) {
          if (editor.toolbox) {
            editor.toolbox.focusCommandExecuted = true;
            if (CKEDITOR.env.ie || CKEDITOR.env.air) {
              setTimeout(function() {
                editor.toolbox.focus();
              }, 100);
            } else {
              editor.toolbox.focus();
            }
          }
        }
      };
      CKEDITOR.plugins.add("toolbar", {
        requires : "button",
        init : function(editor) {
          var endFlag;
          var itemKeystroke = function(item, eventName) {
            var toolbar;
            var errorMessage = editor.lang.dir == "rtl";
            var toolbarGroupCycling = editor.config.toolbarGroupCycling;
            var mouseover = errorMessage ? 37 : 39;
            errorMessage = errorMessage ? 39 : 37;
            toolbarGroupCycling = toolbarGroupCycling === void 0 || toolbarGroupCycling;
            switch(eventName) {
              case 9:
              ;
              case CKEDITOR.SHIFT + 9:
                for (;!toolbar || !toolbar.items.length;) {
                  toolbar = eventName == 9 ? (toolbar ? toolbar.next : item.toolbar.next) || editor.toolbox.toolbars[0] : (toolbar ? toolbar.previous : item.toolbar.previous) || editor.toolbox.toolbars[editor.toolbox.toolbars.length - 1];
                  if (toolbar.items.length) {
                    item = toolbar.items[endFlag ? toolbar.items.length - 1 : 0];
                    for (;item && !item.focus;) {
                      if (!(item = endFlag ? item.previous : item.next)) {
                        toolbar = 0;
                      }
                    }
                  }
                }
                if (item) {
                  item.focus();
                }
                return false;
              case mouseover:
                toolbar = item;
                do {
                  toolbar = toolbar.next;
                  if (!toolbar) {
                    if (toolbarGroupCycling) {
                      toolbar = item.toolbar.items[0];
                    }
                  }
                } while (toolbar && !toolbar.focus);
                if (toolbar) {
                  toolbar.focus();
                } else {
                  itemKeystroke(item, 9);
                }
                return false;
              case 40:
                if (item.button && item.button.hasArrow) {
                  editor.once("panelShow", function(evt) {
                    evt.data._.panel._.currentBlock.onKeyDown(40);
                  });
                  item.execute();
                } else {
                  itemKeystroke(item, eventName == 40 ? mouseover : errorMessage);
                }
                return false;
              case errorMessage:
              ;
              case 38:
                toolbar = item;
                do {
                  toolbar = toolbar.previous;
                  if (!toolbar) {
                    if (toolbarGroupCycling) {
                      toolbar = item.toolbar.items[item.toolbar.items.length - 1];
                    }
                  }
                } while (toolbar && !toolbar.focus);
                if (toolbar) {
                  toolbar.focus();
                } else {
                  endFlag = 1;
                  itemKeystroke(item, CKEDITOR.SHIFT + 9);
                  endFlag = 0;
                }
                return false;
              case 27:
                editor.focus();
                return false;
              case 13:
              ;
              case 32:
                item.execute();
                return false;
            }
            return true;
          };
          editor.on("uiSpace", function(event) {
            if (event.data.space == editor.config.toolbarLocation) {
              event.removeListener();
              editor.toolbox = new toolbox;
              var expanded = CKEDITOR.tools.getNextId();
              var pos = ['<span id="', expanded, '" class="cke_voice_label">', editor.lang.toolbar.toolbars, "</span>", '<span id="' + editor.ui.spaceId("toolbox") + '" class="cke_toolbox" role="group" aria-labelledby="', expanded, '" onmousedown="return false;">'];
              expanded = editor.config.toolbarStartupExpanded !== false;
              var k;
              var rvar;
              if (editor.config.toolbarCanCollapse) {
                if (editor.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                  pos.push('<span class="cke_toolbox_main"' + (expanded ? ">" : ' style="display:none">'));
                }
              }
              var toolbars = editor.toolbox.toolbars;
              var toolbar = getToolbarConfig(editor);
              var r = 0;
              for (;r < toolbar.length;r++) {
                var addItem;
                var toolbarObj = 0;
                var toolbarName;
                var row = toolbar[r];
                var codeSegments;
                if (row) {
                  if (k) {
                    pos.push("</span>");
                    rvar = k = 0;
                  }
                  if (row === "/") {
                    pos.push('<span class="cke_toolbar_break"></span>');
                  } else {
                    codeSegments = row.items || row;
                    var i = 0;
                    for (;i < codeSegments.length;i++) {
                      var optgroup = codeSegments[i];
                      var B;
                      if (optgroup) {
                        if (optgroup.type == CKEDITOR.UI_SEPARATOR) {
                          rvar = k && optgroup;
                        } else {
                          B = optgroup.canGroup !== false;
                          if (!toolbarObj) {
                            addItem = CKEDITOR.tools.getNextId();
                            toolbarObj = {
                              id : addItem,
                              items : []
                            };
                            toolbarName = row.name && (editor.lang.toolbar.toolbarGroups[row.name] || row.name);
                            pos.push('<span id="', addItem, '" class="cke_toolbar"', toolbarName ? ' aria-labelledby="' + addItem + '_label"' : "", ' role="toolbar">');
                            if (toolbarName) {
                              pos.push('<span id="', addItem, '_label" class="cke_voice_label">', toolbarName, "</span>");
                            }
                            pos.push('<span class="cke_toolbar_start"></span>');
                            var index = toolbars.push(toolbarObj) - 1;
                            if (index > 0) {
                              toolbarObj.previous = toolbars[index - 1];
                              toolbarObj.previous.next = toolbarObj;
                            }
                          }
                          if (B) {
                            if (!k) {
                              pos.push('<span class="cke_toolgroup" role="presentation">');
                              k = 1;
                            }
                          } else {
                            if (k) {
                              pos.push("</span>");
                              k = 0;
                            }
                          }
                          addItem = function(name) {
                            name = name.render(editor, pos);
                            index = toolbarObj.items.push(name) - 1;
                            if (index > 0) {
                              name.previous = toolbarObj.items[index - 1];
                              name.previous.next = name;
                            }
                            name.toolbar = toolbarObj;
                            name.onkey = itemKeystroke;
                            name.onfocus = function() {
                              if (!editor.toolbox.focusCommandExecuted) {
                                editor.focus();
                              }
                            };
                          };
                          if (rvar) {
                            addItem(rvar);
                            rvar = 0;
                          }
                          addItem(optgroup);
                        }
                      }
                    }
                    if (k) {
                      pos.push("</span>");
                      rvar = k = 0;
                    }
                    if (toolbarObj) {
                      pos.push('<span class="cke_toolbar_end"></span></span>');
                    }
                  }
                }
              }
              if (editor.config.toolbarCanCollapse) {
                pos.push("</span>");
              }
              if (editor.config.toolbarCanCollapse && editor.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                var hash = CKEDITOR.tools.addFunction(function() {
                  editor.execCommand("toolbarCollapse");
                });
                editor.on("destroy", function() {
                  CKEDITOR.tools.removeFunction(hash);
                });
                editor.addCommand("toolbarCollapse", {
                  readOnly : 1,
                  exec : function(editor) {
                    var collapser = editor.ui.space("toolbar_collapser");
                    var overlay = collapser.getPrevious();
                    var contents = editor.ui.space("contents");
                    var toolboxContainer = overlay.getParent();
                    var rooneyPosition = parseInt(contents.$.style.height, 10);
                    var previousHeight = toolboxContainer.$.offsetHeight;
                    var collapsed = collapser.hasClass("cke_toolbox_collapser_min");
                    if (collapsed) {
                      overlay.show();
                      collapser.removeClass("cke_toolbox_collapser_min");
                      collapser.setAttribute("title", editor.lang.toolbar.toolbarCollapse);
                    } else {
                      overlay.hide();
                      collapser.addClass("cke_toolbox_collapser_min");
                      collapser.setAttribute("title", editor.lang.toolbar.toolbarExpand);
                    }
                    collapser.getFirst().setText(collapsed ? "\u25b2" : "\u25c0");
                    contents.setStyle("height", rooneyPosition - (toolboxContainer.$.offsetHeight - previousHeight) + "px");
                    editor.fire("resize");
                  },
                  modes : {
                    wysiwyg : 1,
                    source : 1
                  }
                });
                editor.setKeystroke(CKEDITOR.ALT + (CKEDITOR.env.ie || CKEDITOR.env.webkit ? 189 : 109), "toolbarCollapse");
                pos.push('<a title="' + (expanded ? editor.lang.toolbar.toolbarCollapse : editor.lang.toolbar.toolbarExpand) + '" id="' + editor.ui.spaceId("toolbar_collapser") + '" tabIndex="-1" class="cke_toolbox_collapser');
                if (!expanded) {
                  pos.push(" cke_toolbox_collapser_min");
                }
                pos.push('" onclick="CKEDITOR.tools.callFunction(' + hash + ')">', '<span class="cke_arrow">&#9650;</span>', "</a>");
              }
              pos.push("</span>");
              event.data.html = event.data.html + pos.join("");
            }
          });
          editor.on("destroy", function() {
            if (this.toolbox) {
              var toolbars;
              var index = 0;
              var i;
              var codeSegments;
              var instance;
              toolbars = this.toolbox.toolbars;
              for (;index < toolbars.length;index++) {
                codeSegments = toolbars[index].items;
                i = 0;
                for (;i < codeSegments.length;i++) {
                  instance = codeSegments[i];
                  if (instance.clickFn) {
                    CKEDITOR.tools.removeFunction(instance.clickFn);
                  }
                  if (instance.keyDownFn) {
                    CKEDITOR.tools.removeFunction(instance.keyDownFn);
                  }
                }
              }
            }
          });
          editor.on("uiReady", function() {
            var optgroup = editor.ui.space("toolbox");
            if (optgroup) {
              editor.focusManager.add(optgroup, 1);
            }
          });
          editor.addCommand("toolbarFocus", saveCmd);
          editor.setKeystroke(CKEDITOR.ALT + 121, "toolbarFocus");
          editor.ui.add("-", CKEDITOR.UI_SEPARATOR, {});
          editor.ui.addHandler(CKEDITOR.UI_SEPARATOR, {
            create : function() {
              return{
                render : function(editor, canvas) {
                  canvas.push('<span class="cke_toolbar_separator" role="separator"></span>');
                  return{};
                }
              };
            }
          });
        }
      });
      CKEDITOR.ui.prototype.addToolbarGroup = function(name, previous, subgroupOf) {
        var toolbarGroups = getPrivateToolbarGroups(this.editor);
        var atStart = previous === 0;
        var newGroup = {
          name : name
        };
        if (subgroupOf) {
          if (subgroupOf = CKEDITOR.tools.search(toolbarGroups, function(group) {
            return group.name == subgroupOf;
          })) {
            if (!subgroupOf.groups) {
              subgroupOf.groups = [];
            }
            if (previous) {
              previous = CKEDITOR.tools.indexOf(subgroupOf.groups, previous);
              if (previous >= 0) {
                subgroupOf.groups.splice(previous + 1, 0, name);
                return;
              }
            }
            if (atStart) {
              subgroupOf.groups.splice(0, 0, name);
            } else {
              subgroupOf.groups.push(name);
            }
            return;
          }
          previous = null;
        }
        if (previous) {
          previous = CKEDITOR.tools.indexOf(toolbarGroups, function(group) {
            return group.name == previous;
          });
        }
        if (atStart) {
          toolbarGroups.splice(0, 0, name);
        } else {
          if (typeof previous == "number") {
            toolbarGroups.splice(previous + 1, 0, newGroup);
          } else {
            toolbarGroups.push(name);
          }
        }
      };
    })();
    CKEDITOR.UI_SEPARATOR = "separator";
    CKEDITOR.config.toolbarLocation = "top";
    (function() {
      function UndoManager(editor) {
        this.editor = editor;
        this.reset();
      }
      CKEDITOR.plugins.add("undo", {
        init : function(editor) {
          function update(event) {
            if (undoManager.enabled) {
              if (event.data.command.canUndo !== false) {
                undoManager.save();
              }
            }
          }
          function toggleUndoManager() {
            undoManager.enabled = editor.readOnly ? false : editor.mode == "wysiwyg";
            undoManager.onChange();
          }
          var undoManager = editor.undoManager = new UndoManager(editor);
          var undoCommand = editor.addCommand("undo", {
            exec : function() {
              if (undoManager.undo()) {
                editor.selectionChange();
                this.fire("afterUndo");
              }
            },
            startDisabled : true,
            canUndo : false
          });
          var redoCommand = editor.addCommand("redo", {
            exec : function() {
              if (undoManager.redo()) {
                editor.selectionChange();
                this.fire("afterRedo");
              }
            },
            startDisabled : true,
            canUndo : false
          });
          var camelKey = [CKEDITOR.CTRL + 90, CKEDITOR.CTRL + 89, CKEDITOR.CTRL + CKEDITOR.SHIFT + 90];
          editor.setKeystroke([[camelKey[0], "undo"], [camelKey[1], "redo"], [camelKey[2], "redo"]]);
          editor.on("contentDom", function() {
            var editable = editor.editable();
            editable.attachListener(editable, "keydown", function(evt) {
              if (CKEDITOR.tools.indexOf(camelKey, evt.data.getKeystroke()) > -1) {
                evt.data.preventDefault();
              }
            });
          });
          undoManager.onChange = function() {
            undoCommand.setState(undoManager.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
            redoCommand.setState(undoManager.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
          };
          editor.on("beforeCommandExec", update);
          editor.on("afterCommandExec", update);
          editor.on("saveSnapshot", function(evt) {
            undoManager.save(evt.data && evt.data.contentOnly);
          });
          editor.on("contentDom", function() {
            editor.editable().on("keydown", function(optgroup) {
              optgroup = optgroup.data.getKey();
              if (optgroup == 8 || optgroup == 46) {
                undoManager.type(optgroup, 0);
              }
            });
            editor.editable().on("keypress", function(evt) {
              undoManager.type(evt.data.getKey(), 1);
            });
          });
          editor.on("beforeModeUnload", function() {
            if (editor.mode == "wysiwyg") {
              undoManager.save(true);
            }
          });
          editor.on("mode", toggleUndoManager);
          editor.on("readOnly", toggleUndoManager);
          if (editor.ui.addButton) {
            editor.ui.addButton("Undo", {
              label : editor.lang.undo.undo,
              command : "undo",
              toolbar : "undo,10"
            });
            editor.ui.addButton("Redo", {
              label : editor.lang.undo.redo,
              command : "redo",
              toolbar : "undo,20"
            });
          }
          editor.resetUndo = function() {
            undoManager.reset();
            editor.fire("saveSnapshot");
          };
          editor.on("updateSnapshot", function() {
            if (undoManager.currentImage) {
              undoManager.update();
            }
          });
          editor.on("lockSnapshot", function(map) {
            map = map.data;
            undoManager.lock(map && map.dontUpdate, map && map.forceUpdate);
          });
          editor.on("unlockSnapshot", undoManager.unlock, undoManager);
        }
      });
      CKEDITOR.plugins.undo = {};
      var Image = CKEDITOR.plugins.undo.Image = function(editor, src) {
        this.editor = editor;
        editor.fire("beforeUndoImage");
        var data = editor.getSnapshot();
        if (CKEDITOR.env.ie) {
          if (data) {
            data = data.replace(/\s+data-cke-expando=".*?"/g, "");
          }
        }
        this.contents = data;
        if (!src) {
          this.bookmarks = (data = data && editor.getSelection()) && data.createBookmarks2(true);
        }
        editor.fire("afterUndoImage");
      };
      var rxhtmlTag = /\b(?:href|src|name)="[^"]*?"/gi;
      Image.prototype = {
        equalsContent : function(value) {
          var requestUrl = this.contents;
          value = value.contents;
          if (CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks)) {
            requestUrl = requestUrl.replace(rxhtmlTag, "");
            value = value.replace(rxhtmlTag, "");
          }
          return requestUrl != value ? false : true;
        },
        equalsSelection : function(b) {
          var a = this.bookmarks;
          b = b.bookmarks;
          if (a || b) {
            if (!a || (!b || a.length != b.length)) {
              return false;
            }
            var i = 0;
            for (;i < a.length;i++) {
              var bookmarkA = a[i];
              var bookmarkB = b[i];
              if (bookmarkA.startOffset != bookmarkB.startOffset || (bookmarkA.endOffset != bookmarkB.endOffset || (!CKEDITOR.tools.arrayCompare(bookmarkA.start, bookmarkB.start) || !CKEDITOR.tools.arrayCompare(bookmarkA.end, bookmarkB.end)))) {
                return false;
              }
            }
          }
          return true;
        }
      };
      UndoManager.prototype = {
        type : function(name, keepData) {
          var c = !keepData && name != this.lastKeystroke;
          var editor = this.editor;
          if (!this.typing || (keepData && !this.wasCharacter || c)) {
            var beforeTypeImage = new Image(editor);
            var beforeTypeCount = this.snapshots.length;
            CKEDITOR.tools.setTimeout(function() {
              var currentSnapshot = editor.getSnapshot();
              if (CKEDITOR.env.ie) {
                currentSnapshot = currentSnapshot.replace(/\s+data-cke-expando=".*?"/g, "");
              }
              if (beforeTypeImage.contents != currentSnapshot && beforeTypeCount == this.snapshots.length) {
                this.typing = true;
                if (!this.save(false, beforeTypeImage, false)) {
                  this.snapshots.splice(this.index + 1, this.snapshots.length - this.index - 1);
                }
                this.hasUndo = true;
                this.hasRedo = false;
                this.modifiersCount = this.typesCount = 1;
                this.onChange();
              }
            }, 0, this);
          }
          this.lastKeystroke = name;
          if (this.wasCharacter = keepData) {
            this.modifiersCount = 0;
            this.typesCount++;
            if (this.typesCount > 25) {
              this.save(false, null, false);
              this.typesCount = 1;
            } else {
              setTimeout(function() {
                editor.fire("change");
              }, 0);
            }
          } else {
            this.typesCount = 0;
            this.modifiersCount++;
            if (this.modifiersCount > 25) {
              this.save(false, null, false);
              this.modifiersCount = 1;
            } else {
              setTimeout(function() {
                editor.fire("change");
              }, 0);
            }
          }
        },
        reset : function() {
          this.lastKeystroke = 0;
          this.snapshots = [];
          this.index = -1;
          this.limit = this.editor.config.undoStackSize || 20;
          this.currentImage = null;
          this.hasRedo = this.hasUndo = false;
          this.locked = null;
          this.resetType();
        },
        resetType : function() {
          this.typing = false;
          delete this.lastKeystroke;
          this.modifiersCount = this.typesCount = 0;
        },
        fireChange : function() {
          this.hasUndo = !!this.getNextImage(true);
          this.hasRedo = !!this.getNextImage(false);
          this.resetType();
          this.onChange();
        },
        save : function(recurring, image, mayParseLabeledStatementInstead) {
          var editor = this.editor;
          if (this.locked || (editor.status != "ready" || editor.mode != "wysiwyg")) {
            return false;
          }
          var snapshots = editor.editable();
          if (!snapshots || snapshots.status != "ready") {
            return false;
          }
          snapshots = this.snapshots;
          if (!image) {
            image = new Image(editor);
          }
          if (image.contents === false) {
            return false;
          }
          if (this.currentImage) {
            if (image.equalsContent(this.currentImage)) {
              if (recurring || image.equalsSelection(this.currentImage)) {
                return false;
              }
            } else {
              editor.fire("change");
            }
          }
          snapshots.splice(this.index + 1, snapshots.length - this.index - 1);
          if (snapshots.length == this.limit) {
            snapshots.shift();
          }
          this.index = snapshots.push(image) - 1;
          this.currentImage = image;
          if (mayParseLabeledStatementInstead !== false) {
            this.fireChange();
          }
          return true;
        },
        restoreImage : function(image) {
          var editor = this.editor;
          var sel;
          if (image.bookmarks) {
            editor.focus();
            sel = editor.getSelection();
          }
          this.locked = 1;
          this.editor.loadSnapshot(image.contents);
          if (image.bookmarks) {
            sel.selectBookmarks(image.bookmarks);
          } else {
            if (CKEDITOR.env.ie) {
              sel = this.editor.document.getBody().$.createTextRange();
              sel.collapse(true);
              sel.select();
            }
          }
          this.locked = 0;
          this.index = image.index;
          this.currentImage = this.snapshots[this.index];
          this.update();
          this.fireChange();
          editor.fire("change");
        },
        getNextImage : function(image) {
          var codeSegments = this.snapshots;
          var currentImage = this.currentImage;
          var i;
          if (currentImage) {
            if (image) {
              i = this.index - 1;
              for (;i >= 0;i--) {
                image = codeSegments[i];
                if (!currentImage.equalsContent(image)) {
                  image.index = i;
                  return image;
                }
              }
            } else {
              i = this.index + 1;
              for (;i < codeSegments.length;i++) {
                image = codeSegments[i];
                if (!currentImage.equalsContent(image)) {
                  image.index = i;
                  return image;
                }
              }
            }
          }
          return null;
        },
        redoable : function() {
          return this.enabled && this.hasRedo;
        },
        undoable : function() {
          return this.enabled && this.hasUndo;
        },
        undo : function() {
          if (this.undoable()) {
            this.save(true);
            var image = this.getNextImage(true);
            if (image) {
              return this.restoreImage(image), true;
            }
          }
          return false;
        },
        redo : function() {
          if (this.redoable()) {
            this.save(true);
            if (this.redoable()) {
              var image = this.getNextImage(false);
              if (image) {
                return this.restoreImage(image), true;
              }
            }
          }
          return false;
        },
        update : function(newImage) {
          if (!this.locked) {
            if (!newImage) {
              newImage = new Image(this.editor);
            }
            var i = this.index;
            var snapshots = this.snapshots;
            for (;i > 0 && this.currentImage.equalsContent(snapshots[i - 1]);) {
              i = i - 1;
            }
            snapshots.splice(i, this.index - i + 1, newImage);
            this.index = i;
            this.currentImage = newImage;
          }
        },
        lock : function(f, theLock) {
          if (this.locked) {
            this.locked.level++;
          } else {
            if (f) {
              this.locked = {
                level : 1
              };
            } else {
              var update = null;
              if (theLock) {
                update = true;
              } else {
                var imageBefore = new Image(this.editor, true);
                if (this.currentImage) {
                  if (this.currentImage.equalsContent(imageBefore)) {
                    update = imageBefore;
                  }
                }
              }
              this.locked = {
                update : update,
                level : 1
              };
            }
          }
        },
        unlock : function() {
          if (this.locked && !--this.locked.level) {
            var updateImage = this.locked.update;
            this.locked = null;
            if (updateImage === true) {
              this.update();
            } else {
              if (updateImage) {
                var imageBefore = new Image(this.editor, true);
                if (!updateImage.equalsContent(imageBefore)) {
                  this.update();
                }
              }
            }
          }
        }
      };
    })();
    (function() {
      function onDomReady(win) {
        var editor = this.editor;
        var doc = win.document;
        var body = doc.body;
        var script = doc.getElementById("cke_actscrpt");
        if (script) {
          script.parentNode.removeChild(script);
        }
        if (script = doc.getElementById("cke_shimscrpt")) {
          script.parentNode.removeChild(script);
        }
        if (CKEDITOR.env.gecko) {
          body.contentEditable = false;
          if (CKEDITOR.env.version < 2E4) {
            body.innerHTML = body.innerHTML.replace(/^.*<\!-- cke-content-start --\>/, "");
            setTimeout(function() {
              var range = new CKEDITOR.dom.range(new CKEDITOR.dom.document(doc));
              range.setStart(new CKEDITOR.dom.node(body), 0);
              editor.getSelection().selectRanges([range]);
            }, 0);
          }
        }
        body.contentEditable = true;
        if (CKEDITOR.env.ie) {
          body.hideFocus = true;
          body.disabled = true;
          body.removeAttribute("disabled");
        }
        delete this._.isLoadingData;
        this.$ = body;
        doc = new CKEDITOR.dom.document(doc);
        this.setup();
        if (CKEDITOR.env.ie) {
          doc.getDocumentElement().addClass(doc.$.compatMode);
          if (editor.config.enterMode != CKEDITOR.ENTER_P) {
            this.attachListener(doc, "selectionchange", function() {
              var body = doc.getBody();
              var sel = editor.getSelection();
              var range = sel && sel.getRanges()[0];
              if (range) {
                if (body.getHtml().match(/^<p>(?:&nbsp;|<br>)<\/p>$/i) && range.startContainer.equals(body)) {
                  setTimeout(function() {
                    range = editor.getSelection().getRanges()[0];
                    if (!range.startContainer.equals("body")) {
                      body.getFirst().remove(1);
                      range.moveToElementEditEnd(body);
                      range.select();
                    }
                  }, 0);
                }
              }
            });
          }
        }
        if (CKEDITOR.env.webkit || CKEDITOR.env.ie && CKEDITOR.env.version > 10) {
          doc.getDocumentElement().on("mousedown", function(ev) {
            if (ev.data.getTarget().is("html")) {
              setTimeout(function() {
                editor.editable().focus();
              });
            }
          });
        }
        try {
          editor.document.$.execCommand("2D-position", false, true);
        } catch (g) {
        }
        try {
          editor.document.$.execCommand("enableInlineTableEditing", false, !editor.config.disableNativeTableHandles);
        } catch (i) {
        }
        if (editor.config.disableObjectResizing) {
          try {
            this.getDocument().$.execCommand("enableObjectResizing", false, false);
          } catch (k) {
            this.attachListener(this, CKEDITOR.env.ie ? "resizestart" : "resize", function(evt) {
              evt.data.preventDefault();
            });
          }
        }
        if (CKEDITOR.env.gecko || CKEDITOR.env.ie && editor.document.$.compatMode == "CSS1Compat") {
          this.attachListener(this, "keydown", function(evt) {
            var keyCode = evt.data.getKeystroke();
            if (keyCode == 33 || keyCode == 34) {
              if (CKEDITOR.env.ie) {
                setTimeout(function() {
                  editor.getSelection().scrollIntoView();
                }, 0);
              } else {
                if (editor.window.$.innerHeight > this.$.offsetHeight) {
                  var range = editor.createRange();
                  range[keyCode == 33 ? "moveToElementEditStart" : "moveToElementEditEnd"](this);
                  range.select();
                  evt.data.preventDefault();
                }
              }
            }
          });
        }
        if (CKEDITOR.env.ie) {
          this.attachListener(doc, "blur", function() {
            try {
              doc.$.selection.empty();
            } catch (a) {
            }
          });
        }
        if (CKEDITOR.env.iOS) {
          this.attachListener(doc, "touchend", function() {
            win.focus();
          });
        }
        editor.document.getElementsByTag("title").getItem(0).data("cke-title", editor.document.$.title);
        if (CKEDITOR.env.ie) {
          editor.document.$.title = this._.docTitle;
        }
        CKEDITOR.tools.setTimeout(function() {
          if (this.status == "unloaded") {
            this.status = "ready";
          }
          editor.fire("contentDom");
          if (this._.isPendingFocus) {
            editor.focus();
            this._.isPendingFocus = false;
          }
          setTimeout(function() {
            editor.fire("dataReady");
          }, 0);
          if (CKEDITOR.env.ie) {
            setTimeout(function() {
              if (editor.document) {
                var $body = editor.document.$.body;
                $body.runtimeStyle.marginBottom = "0px";
                $body.runtimeStyle.marginBottom = "";
              }
            }, 1E3);
          }
        }, 0, this);
      }
      function iframeCssFixes() {
        var tagNameArr = [];
        if (CKEDITOR.document.$.documentMode >= 8) {
          tagNameArr.push("html.CSS1Compat [contenteditable=false]{min-height:0 !important}");
          var UNICODE_SPACES = [];
          var tag;
          for (tag in CKEDITOR.dtd.$removeEmpty) {
            UNICODE_SPACES.push("html.CSS1Compat " + tag + "[contenteditable=false]");
          }
          tagNameArr.push(UNICODE_SPACES.join(",") + "{display:inline-block}");
        } else {
          if (CKEDITOR.env.gecko) {
            tagNameArr.push("html{height:100% !important}");
            tagNameArr.push("img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}");
          }
        }
        tagNameArr.push("html{cursor:text;*cursor:auto}");
        tagNameArr.push("img,input,textarea{cursor:default}");
        return tagNameArr.join("\n");
      }
      CKEDITOR.plugins.add("wysiwygarea", {
        init : function(editor) {
          if (editor.config.fullPage) {
            editor.addFeature({
              allowedContent : "html head title; style [media,type]; body (*)[id]; meta link [*]",
              requiredContent : "body"
            });
          }
          editor.addMode("wysiwyg", function(recurring) {
            function onLoad(e) {
              if (e) {
                e.removeListener();
              }
              editor.editable(new framedWysiwyg(editor, iframe.$.contentWindow.document.body));
              editor.setData(editor.getData(1), recurring);
            }
            var onResize = "document.open();" + (CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "") + "document.close();";
            onResize = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent(onResize) + "}())" : "";
            var iframe = CKEDITOR.dom.element.createFromHtml('<iframe src="' + onResize + '" frameBorder="0"></iframe>');
            iframe.setStyles({
              width : "100%",
              height : "100%"
            });
            iframe.addClass("cke_wysiwyg_frame cke_reset");
            var contentSpace = editor.ui.space("contents");
            contentSpace.append(iframe);
            if (onResize = CKEDITOR.env.ie || CKEDITOR.env.gecko) {
              iframe.on("load", onLoad);
            }
            var url = editor.title;
            var frameDesc = editor.lang.common.editorHelp;
            if (url) {
              if (CKEDITOR.env.ie) {
                url = url + (", " + frameDesc);
              }
              iframe.setAttribute("title", url);
            }
            url = CKEDITOR.tools.getNextId();
            var copy = CKEDITOR.dom.element.createFromHtml('<span id="' + url + '" class="cke_voice_label">' + frameDesc + "</span>");
            contentSpace.append(copy, 1);
            editor.on("beforeModeUnload", function(e) {
              e.removeListener();
              copy.remove();
            });
            iframe.setAttributes({
              "aria-describedby" : url,
              tabIndex : editor.tabIndex,
              allowTransparency : "true"
            });
            if (!onResize) {
              onLoad();
            }
            if (CKEDITOR.env.webkit) {
              onResize = function() {
                contentSpace.setStyle("width", "100%");
                iframe.hide();
                iframe.setSize("width", contentSpace.getSize("width"));
                contentSpace.removeStyle("width");
                iframe.show();
              };
              iframe.setCustomData("onResize", onResize);
              CKEDITOR.document.getWindow().on("resize", onResize);
            }
            editor.fire("ariaWidget", iframe);
          });
        }
      });
      CKEDITOR.editor.prototype.addContentsCss = function(spaceName) {
        var config = this.config;
        var filters = config.contentsCss;
        if (!CKEDITOR.tools.isArray(filters)) {
          config.contentsCss = filters ? [filters] : [];
        }
        config.contentsCss.push(spaceName);
      };
      var framedWysiwyg = CKEDITOR.tools.createClass({
        $ : function(name) {
          this.base.apply(this, arguments);
          this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function(options) {
            CKEDITOR.tools.setTimeout(onDomReady, 0, this, options);
          }, this);
          this._.docTitle = this.getWindow().getFrame().getAttribute("title");
        },
        base : CKEDITOR.editable,
        proto : {
          setData : function(html, recurring) {
            var editor = this.editor;
            if (recurring) {
              this.setHtml(html);
              editor.fire("dataReady");
            } else {
              this._.isLoadingData = true;
              editor._.dataStore = {
                id : 1
              };
              var config = editor.config;
              var fullPage = config.fullPage;
              var docType = config.docType;
              var i = CKEDITOR.tools.buildStyleHtml(iframeCssFixes()).replace(/<style>/, '<style data-cke-temp="1">');
              if (!fullPage) {
                i = i + CKEDITOR.tools.buildStyleHtml(editor.config.contentsCss);
              }
              var result = config.baseHref ? '<base href="' + config.baseHref + '" data-cke-temp="1" />' : "";
              if (fullPage) {
                html = html.replace(/<!DOCTYPE[^>]*>/i, function(match) {
                  editor.docType = docType = match;
                  return "";
                }).replace(/<\?xml\s[^\?]*\?>/i, function(match) {
                  editor.xmlDeclaration = match;
                  return "";
                });
              }
              html = editor.dataProcessor.toHtml(html);
              if (fullPage) {
                if (!/<body[\s|>]/.test(html)) {
                  html = "<body>" + html;
                }
                if (!/<html[\s|>]/.test(html)) {
                  html = "<html>" + html + "</html>";
                }
                if (/<head[\s|>]/.test(html)) {
                  if (!/<title[\s|>]/.test(html)) {
                    html = html.replace(/<head[^>]*>/, "$&<title></title>");
                  }
                } else {
                  html = html.replace(/<html[^>]*>/, "$&<head><title></title></head>");
                }
                if (result) {
                  html = html.replace(/<head>/, "$&" + result);
                }
                html = html.replace(/<\/head\s*>/, i + "$&");
                html = docType + html;
              } else {
                html = config.docType + '<html dir="' + config.contentsLangDirection + '" lang="' + (config.contentsLanguage || editor.langCode) + '"><head><title>' + this._.docTitle + "</title>" + result + i + "</head><body" + (config.bodyId ? ' id="' + config.bodyId + '"' : "") + (config.bodyClass ? ' class="' + config.bodyClass + '"' : "") + ">" + html + "</body></html>";
              }
              if (CKEDITOR.env.gecko) {
                html = html.replace(/<body/, '<body contenteditable="true" ');
                if (CKEDITOR.env.version < 2E4) {
                  html = html.replace(/<body[^>]*>/, "$&\x3c!-- cke-content-start --\x3e");
                }
              }
              config = '<script id="cke_actscrpt" type="text/javascript"' + (CKEDITOR.env.ie ? ' defer="defer" ' : "") + ">var wasLoaded=0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" + this._.frameLoadedHandler + ",window);wasLoaded=1;}" + (CKEDITOR.env.ie ? "onload();" : 'document.addEventListener("DOMContentLoaded", onload, false );') + "\x3c/script>";
              if (CKEDITOR.env.ie) {
                if (CKEDITOR.env.version < 9) {
                  config = config + '<script id="cke_shimscrpt">window.parent.CKEDITOR.tools.enableHtml5Elements(document)\x3c/script>';
                }
              }
              html = html.replace(/(?=\s*<\/(:?head)>)/, config);
              this.clearCustomData();
              this.clearListeners();
              editor.fire("contentDomUnload");
              var doc = this.getDocument();
              try {
                doc.write(html);
              } catch (o) {
                setTimeout(function() {
                  doc.write(html);
                }, 0);
              }
            }
          },
          getData : function(dataAndEvents) {
            if (dataAndEvents) {
              return this.getHtml();
            }
            dataAndEvents = this.editor;
            var config = dataAndEvents.config;
            var data = config.fullPage;
            var hasDisclosureProperty = data && dataAndEvents.docType;
            var handle = data && dataAndEvents.xmlDeclaration;
            var doc = this.getDocument();
            data = data ? doc.getDocumentElement().getOuterHtml() : doc.getBody().getHtml();
            if (CKEDITOR.env.gecko) {
              if (config.enterMode != CKEDITOR.ENTER_BR) {
                data = data.replace(/<br>(?=\s*(:?$|<\/body>))/, "");
              }
            }
            data = dataAndEvents.dataProcessor.toDataFormat(data);
            if (handle) {
              data = handle + "\n" + data;
            }
            if (hasDisclosureProperty) {
              data = hasDisclosureProperty + "\n" + data;
            }
            return data;
          },
          focus : function() {
            if (this._.isLoadingData) {
              this._.isPendingFocus = true;
            } else {
              framedWysiwyg.baseProto.focus.call(this);
            }
          },
          detach : function() {
            var iframe = this.editor;
            var outerDoc = iframe.document;
            iframe = iframe.window.getFrame();
            framedWysiwyg.baseProto.detach.call(this);
            this.clearCustomData();
            outerDoc.getDocumentElement().clearCustomData();
            iframe.clearCustomData();
            CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);
            if (outerDoc = iframe.removeCustomData("onResize")) {
              outerDoc.removeListener();
            }
            iframe.remove();
          }
        }
      });
    })();
    CKEDITOR.config.disableObjectResizing = false;
    CKEDITOR.config.disableNativeTableHandles = true;
    CKEDITOR.config.disableNativeSpellChecker = true;
    CKEDITOR.config.contentsCss = CKEDITOR.getUrl("contents.css");
    (function() {
      CKEDITOR.plugins.add("imagemaps", {
        requires : ["dialog"],
        lang : ["en", "de", "el", "es", "it", "nl", "sv", "tr"],
        init : function(editor) {
          var data = editor.lang.imagemaps;
          window.imgmapStrings = data.imgmapStrings;
          CKEDITOR.tools.extend(window.imgmapStrings, {
            READY : "",
            RECTANGLE_MOVE : "",
            RECTANGLE_RESIZE_TOP : "",
            RECTANGLE_RESIZE_RIGHT : "",
            RECTANGLE_RESIZE_BOTTOM : "",
            RECTANGLE_RESIZE_LEFT : "",
            SQUARE_DRAW : "",
            SQUARE_MOVE : "",
            SQUARE_RESIZE_TOP : "",
            SQUARE_RESIZE_RIGHT : "",
            SQUARE_RESIZE_BOTTOM : "",
            SQUARE_RESIZE_LEFT : "",
            POLYGON_MOVE : ""
          });
          CKEDITOR.dialog.add("ImageMaps", this.path + "dialog/imagemaps.js");
          var outdent = editor.addCommand("imagemaps", new CKEDITOR.dialogCommand("ImageMaps", {
            allowedContent : "img[usemap];map[id,name];area[alt,coords,href,shape,target,title]",
            requiredContent : "img[src]"
          }));
          outdent.startDisabled = true;
          editor.ui.addButton("ImageMaps", {
            label : data.toolbar,
            command : "imagemaps",
            toolbar : "insert,10"
          });
          if (editor.addMenuItems) {
            editor.addMenuItems({
              imagemaps : {
                label : data.menu,
                command : "imagemaps",
                group : "image",
                order : 1
              }
            });
          }
          if (editor.contextMenu) {
            editor.contextMenu.addListener(function(el) {
              el = init(el);
              return!el ? null : {
                imagemaps : el.hasAttribute("usemap") ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF
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
            return!element || (!element.is("img") || (element.data && element.data("cke-realelement") || element.isReadOnly())) ? null : element;
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
              for (;i < resultItems.length;i++) {
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
                for (;i < e.areas.length;i++) {
                  var a = e.areas[i];
                  var c = a.coords.split(",");
                  switch(a.shape) {
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
                      for (;a < c.length;a = a + 2) {
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
                } catch (o) {
                }
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
        afterInit : function(editor) {
          var dataProcessor = editor.dataProcessor;
          (dataProcessor && dataProcessor.htmlFilter).addRules({
            elements : {
              map : function(name) {
                if (name.attributes.id && !name.attributes.name) {
                  name.attributes.name = name.attributes.id;
                }
                var parentElement = editor.editable ? editor.editable().$ : editor.document.$;
                return parentElement.querySelector && !parentElement.querySelector('img[usemap="#' + name.attributes.name + '"]') ? false : name;
              }
            }
          }, {
            applyToAll : true
          });
        }
      });
      if (CKEDITOR.skins) {
        CKEDITOR.plugins.setLang = CKEDITOR.tools.override(CKEDITOR.plugins.setLang, function(self) {
          return function(key, hash, fn) {
            if (key != "devtools" && typeof fn[key] != "object") {
              var params = {};
              params[key] = fn;
              fn = params;
            }
            self.call(this, key, hash, fn);
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
    CKEDITOR.config.plugins = "basicstyles,dialogui,dialog,colordialog,clipboard,panel,floatpanel,menu,contextmenu,elementspath,enterkey,entities,popup,filebrowser,floatingspace,htmlwriter,image,justify,fakeobjects,link,maximize,preview,resize,selectall,sourcearea,button,toolbar,undo,wysiwygarea,imagemaps";
    CKEDITOR.config.skin = "alive";
    (function() {
      var link = function(b, name) {
        var ps = CKEDITOR.getUrl("plugins/" + name);
        b = b.split(",");
        var bi = 0;
        for (;bi < b.length;bi++) {
          CKEDITOR.skin.icons[b[bi]] = {
            path : ps,
            offset : -b[++bi],
            bgsize : b[++bi]
          };
        }
      };
      if (CKEDITOR.env.hidpi) {
        link("bold,0,,italic,24,,strike,48,,subscript,72,,superscript,96,,underline,120,,copy-rtl,144,,copy,168,,cut-rtl,192,,cut,216,,paste-rtl,240,,paste,264,,image,288,,imagemaps,624,auto,justifyblock,336,,justifycenter,360,,justifyleft,384,,justifyright,408,,anchor-rtl,432,,anchor,456,,link,480,,unlink,504,,maximize,528,,preview-rtl,552,,preview,576,,selectall,600,,source-rtl,624,,source,648,,redo-rtl,672,,redo,696,,undo-rtl,720,,undo,744,", "icons_hidpi.png");
      } else {
        link("bold,0,auto,italic,24,auto,strike,48,auto,subscript,72,auto,superscript,96,auto,underline,120,auto,copy-rtl,144,auto,copy,168,auto,cut-rtl,192,auto,cut,216,auto,paste-rtl,240,auto,paste,264,auto,image,288,auto,imagemaps,312,auto,justifyblock,336,auto,justifycenter,360,auto,justifyleft,384,auto,justifyright,408,auto,anchor-rtl,432,auto,anchor,456,auto,link,480,auto,unlink,504,auto,maximize,528,auto,preview-rtl,552,auto,preview,576,auto,selectall,600,auto,source-rtl,624,auto,source,648,auto,redo-rtl,672,auto,redo,696,auto,undo-rtl,720,auto,undo,744,auto", 
        "icons.png");
      }
    })();
    CKEDITOR.lang.languages = {
      en : 1,
      de : 1,
      el : 1,
      es : 1,
      it : 1,
      nl : 1,
      sv : 1,
      tr : 1
    };
  }
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
    for (;2 >= err;err++) {
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
    onFocus(o);
  }
  function onFocus(e) {
    if ($delegate) {
      $delegate.removeClass("imgmapButtonActive");
    }
    $delegate = self.getContentElement("info", "btn_" + e).getElement();
    $delegate.addClass("imgmapButtonActive");
  }
  function partial(data) {
    var buf = "";
    var i = 0;
    for (;i < data.areas.length;i++) {
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
            mode : "editor2",
            custom_callbacks : {
              onSelectArea : render,
              onRemoveArea : showCenteredOverlay,
              onStatusMessage : function(xhtml) {
                document.getElementById(nodeName).innerHTML = xhtml;
              },
              onLoadImage : function(el) {
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
            pic_container : list,
            bounding_box : false,
            lang : "",
            CL_DRAW_SHAPE : "#F00",
            CL_NORM_SHAPE : "#AAA",
            CL_HIGHLIGHT_SHAPE : "#F00"
          });
          context.loadStrings(imgmapStrings);
          el = el.$;
          context.loadImage(target, parseInt(el.style.width || (el.width || 0), 10), parseInt(el.style.height || (el.height || 0), 10));
          target = el.getAttribute("usemap", 2) || el.usemap;
          if ("string" == typeof target && "" !== target) {
            target = target.substr(1);
            list = (editor.editable ? editor.editable().$ : editor.document.$).getElementsByTagName("MAP");
            a = 0;
            for (;a < list.length;a++) {
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
            onFocus("rect");
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
    return{
      title : lang.title,
      minWidth : 500,
      minHeight : 510,
      buttons : [{
        type : "button",
        label : lang.imgmapBtnRemove,
        onClick : init
      }, CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton],
      contents : [{
        id : "info",
        label : generalLabel,
        title : generalLabel,
        elements : [{
          type : mime,
          label : lang.imgmapMap,
          id : "ContainerMapName",
          hidden : true,
          children : [{
            id : "MapName",
            type : "text",
            label : lang.imgmapMapName,
            labelLayout : "horizontal",
            onChange : function() {
              context.mapname = this.getValue();
            }
          }]
        }, {
          type : mime,
          label : lang.imgmapMapAreas,
          children : [{
            type : "hbox",
            id : "button_container",
            style : "margin-bottom:10px",
            widths : "20px 18px 18px 18px 26px 230px 100px".split(" "),
            children : [{
              type : "html",
              id : "btn_pointer",
              onClick : function() {
                $("pointer");
              },
              html : '<span style="background-position: 0 -64px;" class="imgmapButton" title="' + lang.imgmapPointer + '"></span>'
            }, {
              type : "html",
              id : "btn_rect",
              onClick : function() {
                $("rect");
              },
              html : '<span style="background-position: 0 -128px;" class="imgmapButton" title="' + lang.imgmapRectangle + '"></span>'
            }, {
              type : "html",
              id : "btn_circle",
              onClick : function() {
                $("circle");
              },
              html : '<span style="background-position: 0 0;" class="imgmapButton" title="' + lang.imgmapCircle + '"></span>'
            }, {
              type : "html",
              id : "btn_poly",
              onClick : function() {
                $("poly");
              },
              html : '<span style="background-position: 0 -96px;" class="imgmapButton" title="' + lang.imgmapPolygon + '"></span>'
            }, {
              type : "html",
              onClick : function() {
                context.removeArea(context.currentid);
              },
              html : '<span style="background-position: 0 -32px;" class="imgmapButton" title="' + lang.imgmapDeleteArea + '"></span>'
            }, {
              type : "html",
              html : '<div id="' + nodeName + '">&nbsp;</div>'
            }, {
              type : "select",
              id : "zoom",
              labelLayout : "horizontal",
              label : lang.imgmapLabelZoom,
              onChange : function() {
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
              "default" : "1",
              items : [["25%", "0.25"], ["50%", "0.5"], ["100%", "1"], ["200%", "2"], ["300%", "3"]]
            }]
          }, {
            type : "hbox",
            id : "properties1",
            style : "visibility:hidden",
            children : [{
              type : "text",
              id : "href",
              label : lang.linkURL,
              onChange : compile
            }, {
              type : "button",
              id : "browse",
              label : editor.lang.common.browseServer,
              style : "display:inline-block;margin-top:10px;",
              align : "center",
              hidden : "true",
              filebrowser : "info:href"
            }, {
              id : "target",
              type : "select",
              label : lang.linkTarget,
              onChange : compile,
              items : [[lang.notSet, "notSet"], [lang.linkTargetSelf, "_self"], [lang.linkTargetBlank, "_blank"], [lang.linkTargetTop, "_top"]]
            }]
          }, {
            type : "hbox",
            id : "properties2",
            style : "visibility:hidden",
            children : [{
              type : "text",
              id : "title",
              label : lang.advisoryTitle,
              onChange : compile
            }, {
              type : "text",
              id : "alt",
              hidden : true,
              label : lang.altText,
              onChange : compile
            }]
          }]
        }, {
          type : "fieldset",
          style : "border:0; padding:0",
          label : "&nbsp;",
          children : [{
            type : "html",
            html : '<div id="' + element + '" style="overflow:auto;width:500px;height:390px;position:relative;"></div>'
          }]
        }]
      }],
      onLoad : function() {
        self = this;
        self.on("resize", update);
      },
      onShow : function() {
        w = true;
        load();
      },
      onHide : function() {
        if ($delegate) {
          $delegate.removeClass("imgmapButtonActive");
          $delegate = null;
        }
        document.getElementById(element).innerHTML = "";
      },
      onOk : function() {
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
      for (;j < subLn;j++) {
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
imgmap.prototype.log = function() {
};
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
imgmap.prototype._normShape = function(name) {
  if (!name) {
    return "rect";
  }
  name = this.trim(name).toLowerCase();
  return "rect" == name.substring(0, 4) ? "rect" : "circ" == name.substring(0, 4) ? "circle" : "poly" == name.substring(0, 4) ? "poly" : "rect";
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
        for (;data < i;data++) {
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
          for (;data < i;data++) {
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
            for (;60 >= data;data++) {
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
  for (;j < l2;j++) {
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
  for (;i < valuesLen;i++) {
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
    } catch (e) {
    }
    this.areas[k] = null;
    this.fireEvent("onRemoveArea", k);
  }
};
imgmap.prototype.removeAllAreas = function() {
  var i = 0;
  var valuesLen = this.areas.length;
  for (;i < valuesLen;i++) {
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
  for (;name < yCompLen;name++) {
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
    for (;i < valuesLen;i++) {
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
  for (;ti < nTokens;ti++) {
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
          for (;i < d;i++) {
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
          for (;s < e;s++) {
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
          for (;i < valuesLen;i += 2) {
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
  for (;i < valuesLen;i++) {
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
                for (;w < x;w++) {
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
                      for (;i < valuesLen;i++) {
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
  return{
    x : r.left,
    y : r.top
  };
};
imgmap.prototype._getLastArea = function() {
  var unlock = this.areas.length - 1;
  for (;0 <= unlock;unlock--) {
    if (this.areas[unlock]) {
      return this.areas[unlock];
    }
  }
  return null;
};
imgmap.prototype.assignCSS = function(node, pair) {
  var parameters = pair.split(";");
  var p = 0;
  for (;p < parameters.length;p++) {
    var trim = parameters[p].split(":");
    var nameParts = this.trim(trim[0]).split("-");
    var name = nameParts[0];
    var i = 1;
    for (;i < nameParts.length;i++) {
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
Function.prototype.bind = function(optgroup) {
  var matcherFunction = this;
  return function() {
    return matcherFunction.apply(optgroup, arguments);
  };
};
imgmap.prototype.trim = function(s) {
  return s.replace(/^\s+|\s+$/g, "");
};
if (!document.createElement("canvas").getContext) {
  (function() {
    function getContext() {
      return this.context_ || (this.context_ = new CanvasRenderingContext2D_(this));
    }
    function bind(fn, optgroup) {
      var args = __slice.call(arguments, 2);
      return function() {
        return fn.apply(optgroup, args.concat(__slice.call(arguments)));
      };
    }
    function onPropertyChange(e) {
      var el = e.srcElement;
      switch(e.propertyName) {
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
      return[[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }
    function matrixMultiply(m2, codeSegments) {
      var result = createMatrixIdentity();
      var j;
      var x;
      var i;
      var z = 0;
      for (;3 > z;z++) {
        j = 0;
        for (;3 > j;j++) {
          i = x = 0;
          for (;3 > i;i++) {
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
        for (;3 > pos;pos++) {
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
      return{
        color : index,
        alpha : alpha
      };
    }
    function processLineCap(lineCap) {
      switch(lineCap) {
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
        type : "bezierCurveTo",
        cp1x : v11.x,
        cp1y : v11.y,
        cp2x : x1.x,
        cp2y : x1.y,
        x : p.x,
        y : p.y
      });
      self.currentX_ = p.x;
      self.currentY_ = p.y;
    }
    function setM(ctx, m, recurring) {
      var k;
      a: {
        var n = 0;
        for (;3 > n;n++) {
          k = 0;
          for (;2 > k;k++) {
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
    function CanvasPattern_() {
    }
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
      init : function(doc) {
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
      init_ : function(doc) {
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
        for (;ss < doc.length;ss++) {
          this.initElement(doc[ss]);
        }
      },
      initElement : function(el) {
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
    for (;16 > ctx;ctx++) {
      j = 0;
      for (;16 > j;j++) {
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
        type : "moveTo",
        x : p.x,
        y : p.y
      });
      this.currentX_ = p.x;
      this.currentY_ = p.y;
    };
    ctx.lineTo = function(aX, aY) {
      var p = this.getCoords_(aX, aY);
      this.currentPath_.push({
        type : "lineTo",
        x : p.x,
        y : p.y
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
        x : this.currentX_ + 2 / 3 * (x1.x - this.currentX_),
        y : this.currentY_ + 2 / 3 * (x1.y - this.currentY_)
      };
      bezierCurveTo(this, y, {
        x : y.x + (p.x - this.currentX_) / 3,
        y : y.y + (p.y - this.currentY_) / 3
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
        type : arcType,
        x : cx.x,
        y : cx.y,
        radius : aRadius,
        xStart : ll.x,
        yStart : ll.y,
        xEnd : aStartAngle.x,
        yEnd : aStartAngle.y
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
      for (;i < this.currentPath_.length;i++) {
        p = this.currentPath_[i];
        switch(p.type) {
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
          for (;i < height;i++) {
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
        type : "close"
      });
    };
    ctx.getCoords_ = function(x, aY) {
      var m = this.m_;
      return{
        x : Z * (x * m[0][0] + aY * m[1][0] + m[2][0]) - Z2,
        y : Z * (x * m[0][1] + aY * m[1][1] + m[2][1]) - Z2
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
      setM(this, matrixMultiply([[1, 0, 0], [0, 1, 0], [aX, aY, 1]], this.m_), false);
    };
    ctx.rotate = function(aRot) {
      var c = mc(aRot);
      aRot = ms(aRot);
      setM(this, matrixMultiply([[c, aRot, 0], [-aRot, c, 0], [0, 0, 1]], this.m_), false);
    };
    ctx.scale = function(aX, aY) {
      this.arcScaleX_ *= aX;
      this.arcScaleY_ *= aY;
      setM(this, matrixMultiply([[aX, 0, 0], [0, aY, 0], [0, 0, 1]], this.m_), true);
    };
    ctx.transform = function(keepData, form, m21, m11, m22, dy) {
      setM(this, matrixMultiply([[keepData, form, 0], [m21, m11, 0], [m22, dy, 1]], this.m_), true);
    };
    ctx.setTransform = function(m11, dx, m12, m22, dy, m21) {
      setM(this, [[m11, dx, 0], [m12, m22, 0], [dy, m21, 1]], true);
    };
    ctx.clip = function() {
    };
    ctx.arcTo = function() {
    };
    ctx.createPattern = function() {
      return new CanvasPattern_;
    };
    CanvasGradient_.prototype.addColorStop = function(aOffset, aColor) {
      aColor = processStyle(aColor);
      this.colors_.push({
        offset : aOffset,
        color : aColor.color,
        alpha : aColor.alpha
      });
    };
    G_vmlCanvasManager = G_vmlCanvasManager_;
    CanvasRenderingContext2D = CanvasRenderingContext2D_;
    CanvasGradient = CanvasGradient_;
    CanvasPattern = CanvasPattern_;
  })();
}
CKEDITOR.editorConfig = function(config) {
  config.customConfig = "";
  config.toolbarGroups = [{
    name : "document",
    groups : ["mode", "document", "doctools"]
  }, {
    name : "clipboard",
    groups : ["clipboard", "undo"]
  }, {
    name : "basicstyles",
    groups : ["basicstyles", "cleanup"]
  }, {
    name : "links"
  }, {
    name : "insert"
  }, {
    name : "tools"
  }, {
    name : "others"
  }, {
    name : "about"
  }];
};
