(function() {
	if (!window.CKEDITOR || !window.CKEDITOR.dom) {
		if (!window.CKEDITOR) {
			window.CKEDITOR = function() {
				var a = {
					timestamp: "E7LK",
					version: "4.4.2 DEV",
					revision: "0",
					rnd: Math.floor(900 * Math.random()) + 100,
					_: {
						pending: []
					},
					status: "unloaded",
					basePath: function() {
						var a = window.CKEDITOR_BASEPATH || "";
						if (!a) {
							var f = document.getElementsByTagName("script");
							var c = 0;
							for (; c < f.length; c++) {
								var b = f[c].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);
								if (b) {
									a = b[1];
									break;
								}
							}
						}
						if (-1 == a.indexOf(":/")) {
							if ("//" != a.slice(0, 2)) {
								a = 0 === a.indexOf("/") ? location.href.match(/^.*?:\/\/[^\/]*/)[0] + a : location.href.match(/^[^\?]*\/(?:)/)[0] + a;
							}
						}
						if (!a) {
							throw 'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
						}
						return a;
					}(),
					getUrl: function(a) {
						if (-1 == a.indexOf(":/")) {
							if (0 !== a.indexOf("/")) {
								a = this.basePath + a;
							}
						}
						if (this.timestamp) {
							if ("/" != a.charAt(a.length - 1) && !/[&?]t=/.test(a)) {
								a += (0 <= a.indexOf("?") ? "&" : "?") + "t=" + this.timestamp;
							}
						}
						return a;
					},
					domReady: function() {
						function a$$0() {
							try {
								if (document.addEventListener) {
									document.removeEventListener("DOMContentLoaded", a$$0, false);
									f$$2();
								} else {
									if (document.attachEvent) {
										if ("complete" === document.readyState) {
											document.detachEvent("onreadystatechange", a$$0);
											f$$2();
										}
									}
								}
							} catch (c) {}
						}

						function f$$2() {
							var a;
							for (; a = c$$0.shift();) {
								a();
							}
						}
						var c$$0 = [];
						return function(f$$0) {
							c$$0.push(f$$0);
							if ("complete" === document.readyState) {
								setTimeout(a$$0, 1);
							}
							if (1 == c$$0.length) {
								if (document.addEventListener) {
									document.addEventListener("DOMContentLoaded", a$$0, false);
									window.addEventListener("load", a$$0, false);
								} else {
									if (document.attachEvent) {
										document.attachEvent("onreadystatechange", a$$0);
										window.attachEvent("onload", a$$0);
										f$$0 = false;
										try {
											f$$0 = !window.frameElement;
										} catch (b) {}
										if (document.documentElement.doScroll && f$$0) {
											var e = function() {
												try {
													document.documentElement.doScroll("left");
												} catch (f) {
													setTimeout(e, 1);
													return;
												}
												a$$0();
											};
											e();
										}
									}
								}
							}
						};
					}()
				};
				var e$$0 = window.CKEDITOR_GETURL;
				if (e$$0) {
					var b = a.getUrl;
					a.getUrl = function(d) {
						return e$$0.call(a, d) || b.call(a, d);
					};
				}
				return a;
			}();
		}
		if (!CKEDITOR.event) {
			CKEDITOR.event = function() {};
			CKEDITOR.event.implementOn = function(a) {
				var e = CKEDITOR.event.prototype;
				var b;
				for (b in e) {
					if (a[b] == void 0) {
						a[b] = e[b];
					}
				}
			};
			CKEDITOR.event.prototype = function() {
				function a$$0(a) {
					var f = e$$1(this);
					return f[a] || (f[a] = new b$$0(a));
				}
				var e$$1 = function(a) {
					a = a.getPrivate && a.getPrivate() || (a._ || (a._ = {}));
					return a.events || (a.events = {});
				};
				var b$$0 = function(a) {
					this.name = a;
					this.listeners = [];
				};
				b$$0.prototype = {
					getListenerIndex: function(a) {
						var f = 0;
						var c = this.listeners;
						for (; f < c.length; f++) {
							if (c[f].fn == a) {
								return f;
							}
						}
						return -1;
					}
				};
				return {
					define: function(d, f) {
						var c = a$$0.call(this, d);
						CKEDITOR.tools.extend(c, f, true);
					},
					on: function(d, f, c, b, e$$0) {
						function g(a, k, e, g) {
							a = {
								name: d,
								sender: this,
								editor: a,
								data: k,
								listenerData: b,
								stop: e,
								cancel: g,
								removeListener: i
							};
							return f.call(c, a) === false ? false : a.data;
						}

						function i() {
							n.removeListener(d, f);
						}
						var k = a$$0.call(this, d);
						if (k.getListenerIndex(f) < 0) {
							k = k.listeners;
							if (!c) {
								c = this;
							}
							if (isNaN(e$$0)) {
								e$$0 = 10;
							}
							var n = this;
							g.fn = f;
							g.priority = e$$0;
							var o = k.length - 1;
							for (; o >= 0; o--) {
								if (k[o].priority <= e$$0) {
									k.splice(o + 1, 0, g);
									return {
										removeListener: i
									};
								}
							}
							k.unshift(g);
						}
						return {
							removeListener: i
						};
					},
					once: function() {
						var a = arguments[1];
						arguments[1] = function(f) {
							f.removeListener();
							return a.apply(this, arguments);
						};
						return this.on.apply(this, arguments);
					},
					capture: function() {
						CKEDITOR.event.useCapture = 1;
						var a = this.on.apply(this, arguments);
						CKEDITOR.event.useCapture = 0;
						return a;
					},
					fire: function() {
						var a = 0;
						var f = function() {
							a = 1;
						};
						var c = 0;
						var b = function() {
							c = 1;
						};
						return function(j, g, i) {
							var k = e$$1(this)[j];
							j = a;
							var n = c;
							a = c = 0;
							if (k) {
								var o = k.listeners;
								if (o.length) {
									o = o.slice(0);
									var r;
									var l = 0;
									for (; l < o.length; l++) {
										if (k.errorProof) {
											try {
												r = o[l].call(this, i, g, f, b);
											} catch (m) {}
										} else {
											r = o[l].call(this, i, g, f, b);
										}
										if (r === false) {
											c = 1;
										} else {
											if (typeof r != "undefined") {
												g = r;
											}
										}
										if (a || c) {
											break;
										}
									}
								}
							}
							g = c ? false : typeof g == "undefined" ? true : g;
							a = j;
							c = n;
							return g;
						};
					}(),
					fireOnce: function(a, f, c) {
						f = this.fire(a, f, c);
						delete e$$1(this)[a];
						return f;
					},
					removeListener: function(a, f) {
						var c = e$$1(this)[a];
						if (c) {
							var b = c.getListenerIndex(f);
							if (b >= 0) {
								c.listeners.splice(b, 1);
							}
						}
					},
					removeAllListeners: function() {
						var a = e$$1(this);
						var f;
						for (f in a) {
							delete a[f];
						}
					},
					hasListeners: function(a) {
						return (a = e$$1(this)[a]) && a.listeners.length > 0;
					}
				};
			}();
		}
		if (!CKEDITOR.editor) {
			CKEDITOR.editor = function() {
				CKEDITOR._.pending.push([this, arguments]);
				CKEDITOR.event.call(this);
			};
			CKEDITOR.editor.prototype.fire = function(a, e) {
				if (a in {
					instanceReady: 1,
					loaded: 1
				}) {
					this[a] = true;
				}
				return CKEDITOR.event.prototype.fire.call(this, a, e, this);
			};
			CKEDITOR.editor.prototype.fireOnce = function(a, e) {
				if (a in {
					instanceReady: 1,
					loaded: 1
				}) {
					this[a] = true;
				}
				return CKEDITOR.event.prototype.fireOnce.call(this, a, e, this);
			};
			CKEDITOR.event.implementOn(CKEDITOR.editor.prototype);
		}
		if (!CKEDITOR.env) {
			CKEDITOR.env = function() {
				var a$$0 = navigator.userAgent.toLowerCase();
				var e = {
					ie: a$$0.indexOf("trident/") > -1,
					webkit: a$$0.indexOf(" applewebkit/") > -1,
					air: a$$0.indexOf(" adobeair/") > -1,
					mac: a$$0.indexOf("macintosh") > -1,
					quirks: document.compatMode == "BackCompat" && (!document.documentMode || document.documentMode < 10),
					mobile: a$$0.indexOf("mobile") > -1,
					iOS: /(ipad|iphone|ipod)/.test(a$$0),
					isCustomDomain: function() {
						if (!this.ie) {
							return false;
						}
						var a = document.domain;
						var c = window.location.hostname;
						return a != c && a != "[" + c + "]";
					},
					secure: location.protocol == "https:"
				};
				e.gecko = navigator.product == "Gecko" && (!e.webkit && !e.ie);
				if (e.webkit) {
					if (a$$0.indexOf("chrome") > -1) {
						e.chrome = true;
					} else {
						e.safari = true;
					}
				}
				var b = 0;
				if (e.ie) {
					b = e.quirks || !document.documentMode ? parseFloat(a$$0.match(/msie (\d+)/)[1]) : document.documentMode;
					e.ie9Compat = b == 9;
					e.ie8Compat = b == 8;
					e.ie7Compat = b == 7;
					e.ie6Compat = b < 7 || e.quirks;
				}
				if (e.gecko) {
					var d = a$$0.match(/rv:([\d\.]+)/);
					if (d) {
						d = d[1].split(".");
						b = d[0] * 1E4 + (d[1] || 0) * 100 + (d[2] || 0) * 1;
					}
				}
				if (e.air) {
					b = parseFloat(a$$0.match(/ adobeair\/(\d+)/)[1]);
				}
				if (e.webkit) {
					b = parseFloat(a$$0.match(/ applewebkit\/(\d+)/)[1]);
				}
				e.version = b;
				e.isCompatible = e.iOS && b >= 534 || !e.mobile && (e.ie && b > 6 || (e.gecko && b >= 2E4 || (e.air && b >= 1 || (e.webkit && b >= 522 || false))));
				e.hidpi = window.devicePixelRatio >= 2;
				e.needsBrFiller = e.gecko || (e.webkit || e.ie && b > 10);
				e.needsNbspFiller = e.ie && b < 11;
				e.cssClass = "cke_browser_" + (e.ie ? "ie" : e.gecko ? "gecko" : e.webkit ? "webkit" : "unknown");
				if (e.quirks) {
					e.cssClass = e.cssClass + " cke_browser_quirks";
				}
				if (e.ie) {
					e.cssClass = e.cssClass + (" cke_browser_ie" + (e.quirks ? "6 cke_browser_iequirks" : e.version));
				}
				if (e.air) {
					e.cssClass = e.cssClass + " cke_browser_air";
				}
				if (e.iOS) {
					e.cssClass = e.cssClass + " cke_browser_ios";
				}
				if (e.hidpi) {
					e.cssClass = e.cssClass + " cke_hidpi";
				}
				return e;
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
						var a = document.createElement("script");
						a.type = "text/javascript";
						a.src = CKEDITOR.basePath + "ckeditor.js";
						document.getElementsByTagName("head")[0].appendChild(a);
					}
				};
				CKEDITOR.loadFullCoreTimeout = 0;
				CKEDITOR.add = function(a) {
					(this._.pending || (this._.pending = [])).push(a);
				};
				(function() {
					CKEDITOR.domReady(function() {
						var a = CKEDITOR.loadFullCore;
						var e = CKEDITOR.loadFullCoreTimeout;
						if (a) {
							CKEDITOR.status = "basic_ready";
							if (a && a._load) {
								a();
							} else {
								if (e) {
									setTimeout(function() {
										if (CKEDITOR.loadFullCore) {
											CKEDITOR.loadFullCore();
										}
									}, e * 1E3);
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
			var a$$2 = [];
			var e$$0 = CKEDITOR.env.gecko ? "-moz-" : CKEDITOR.env.webkit ? "-webkit-" : CKEDITOR.env.ie ? "-ms-" : "";
			var b$$0 = /&/g;
			var d$$0 = />/g;
			var f$$1 = /</g;
			var c$$1 = /"/g;
			var h = /&amp;/g;
			var j = /&gt;/g;
			var g$$0 = /&lt;/g;
			var i = /&quot;/g;
			CKEDITOR.on("reset", function() {
				a$$2 = [];
			});
			CKEDITOR.tools = {
				arrayCompare: function(a, f) {
					if (!a && !f) {
						return true;
					}
					if (!a || (!f || a.length != f.length)) {
						return false;
					}
					var c = 0;
					for (; c < a.length; c++) {
						if (a[c] != f[c]) {
							return false;
						}
					}
					return true;
				},
				clone: function(a) {
					var f;
					if (a && a instanceof Array) {
						f = [];
						var c = 0;
						for (; c < a.length; c++) {
							f[c] = CKEDITOR.tools.clone(a[c]);
						}
						return f;
					}
					if (a === null || (typeof a != "object" || (a instanceof String || (a instanceof Number || (a instanceof Boolean || (a instanceof Date || a instanceof RegExp)))))) {
						return a;
					}
					f = new a.constructor;
					for (c in a) {
						f[c] = CKEDITOR.tools.clone(a[c]);
					}
					return f;
				},
				capitalize: function(a, f) {
					return a.charAt(0).toUpperCase() + (f ? a.slice(1) : a.slice(1).toLowerCase());
				},
				extend: function(a) {
					var f = arguments.length;
					var c;
					var b;
					if (typeof(c = arguments[f - 1]) == "boolean") {
						f--;
					} else {
						if (typeof(c = arguments[f - 2]) == "boolean") {
							b = arguments[f - 1];
							f = f - 2;
						}
					}
					var d = 1;
					for (; d < f; d++) {
						var e = arguments[d];
						var g;
						for (g in e) {
							if (c === true || a[g] == void 0) {
								if (!b || g in b) {
									a[g] = e[g];
								}
							}
						}
					}
					return a;
				},
				prototypedCopy: function(a) {
					var f = function() {};
					f.prototype = a;
					return new f;
				},
				copy: function(a) {
					var f = {};
					var c;
					for (c in a) {
						f[c] = a[c];
					}
					return f;
				},
				isArray: function(a) {
					return Object.prototype.toString.call(a) == "[object Array]";
				},
				isEmpty: function(a) {
					var f;
					for (f in a) {
						if (a.hasOwnProperty(f)) {
							return false;
						}
					}
					return true;
				},
				cssVendorPrefix: function(a, f, c) {
					if (c) {
						return e$$0 + a + ":" + f + ";" + a + ":" + f;
					}
					c = {};
					c[a] = f;
					c[e$$0 + a] = f;
					return c;
				},
				cssStyleToDomStyle: function() {
					var a$$1 = document.createElement("div").style;
					var f = typeof a$$1.cssFloat != "undefined" ? "cssFloat" : typeof a$$1.styleFloat != "undefined" ? "styleFloat" : "float";
					return function(a$$0) {
						return a$$0 == "float" ? f : a$$0.replace(/-./g, function(a) {
							return a.substr(1).toUpperCase();
						});
					};
				}(),
				buildStyleHtml: function(a) {
					a = [].concat(a);
					var f;
					var c = [];
					var b = 0;
					for (; b < a.length; b++) {
						if (f = a[b]) {
							if (/@import|[{}]/.test(f)) {
								c.push("<style>" + f + "</style>");
							} else {
								c.push('<link type="text/css" rel=stylesheet href="' + f + '">');
							}
						}
					}
					return c.join("");
				},
				htmlEncode: function(a) {
					return ("" + a).replace(b$$0, "&amp;").replace(d$$0, "&gt;").replace(f$$1, "&lt;");
				},
				htmlDecode: function(a) {
					return a.replace(h, "&").replace(j, ">").replace(g$$0, "<");
				},
				htmlEncodeAttr: function(a) {
					return a.replace(c$$1, "&quot;").replace(f$$1, "&lt;").replace(d$$0, "&gt;");
				},
				htmlDecodeAttr: function(a) {
					return a.replace(i, '"').replace(g$$0, "<").replace(j, ">");
				},
				getNextNumber: function() {
					var a = 0;
					return function() {
						return ++a;
					};
				}(),
				getNextId: function() {
					return "cke_" + this.getNextNumber();
				},
				override: function(a, f) {
					var c = f(a);
					c.prototype = a.prototype;
					return c;
				},
				setTimeout: function(a, f, c, b, d) {
					if (!d) {
						d = window;
					}
					if (!c) {
						c = d;
					}
					return d.setTimeout(function() {
						if (b) {
							a.apply(c, [].concat(b));
						} else {
							a.apply(c);
						}
					}, f || 0);
				},
				trim: function() {
					var a = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
					return function(f) {
						return f.replace(a, "");
					};
				}(),
				ltrim: function() {
					var a = /^[ \t\n\r]+/g;
					return function(f) {
						return f.replace(a, "");
					};
				}(),
				rtrim: function() {
					var a = /[ \t\n\r]+$/g;
					return function(f) {
						return f.replace(a, "");
					};
				}(),
				indexOf: function(a, f) {
					if (typeof f == "function") {
						var c = 0;
						var b = a.length;
						for (; c < b; c++) {
							if (f(a[c])) {
								return c;
							}
						}
					} else {
						if (a.indexOf) {
							return a.indexOf(f);
						}
						c = 0;
						b = a.length;
						for (; c < b; c++) {
							if (a[c] === f) {
								return c;
							}
						}
					}
					return -1;
				},
				search: function(a, f) {
					var c = CKEDITOR.tools.indexOf(a, f);
					return c >= 0 ? a[c] : null;
				},
				bind: function(a, f) {
					return function() {
						return a.apply(f, arguments);
					};
				},
				createClass: function(a$$0) {
					var f$$0 = a$$0.$;
					var c$$0 = a$$0.base;
					var b = a$$0.privates || a$$0._;
					var d = a$$0.proto;
					a$$0 = a$$0.statics;
					if (!f$$0) {
						f$$0 = function() {
							if (c$$0) {
								this.base.apply(this, arguments);
							}
						};
					}
					if (b) {
						var e = f$$0;
						f$$0 = function() {
							var a = this._ || (this._ = {});
							var f;
							for (f in b) {
								var c = b[f];
								a[f] = typeof c == "function" ? CKEDITOR.tools.bind(c, this) : c;
							}
							e.apply(this, arguments);
						};
					}
					if (c$$0) {
						f$$0.prototype = this.prototypedCopy(c$$0.prototype);
						f$$0.prototype.constructor = f$$0;
						f$$0.base = c$$0;
						f$$0.baseProto = c$$0.prototype;
						f$$0.prototype.base = function() {
							this.base = c$$0.prototype.base;
							c$$0.apply(this, arguments);
							this.base = arguments.callee;
						};
					}
					if (d) {
						this.extend(f$$0.prototype, d, true);
					}
					if (a$$0) {
						this.extend(f$$0, a$$0, true);
					}
					return f$$0;
				},
				addFunction: function(f, c) {
					return a$$2.push(function() {
						return f.apply(c || this, arguments);
					}) - 1;
				},
				removeFunction: function(f) {
					a$$2[f] = null;
				},
				callFunction: function(f) {
					var c = a$$2[f];
					return c && c.apply(window, Array.prototype.slice.call(arguments, 1));
				},
				cssLength: function() {
					var a = /^-?\d+\.?\d*px$/;
					var f;
					return function(c) {
						f = CKEDITOR.tools.trim(c + "") + "px";
						return a.test(f) ? f : c || "";
					};
				}(),
				convertToPx: function() {
					var a;
					return function(f) {
						if (!a) {
							a = CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>', CKEDITOR.document);
							CKEDITOR.document.getBody().append(a);
						}
						if (!/%$/.test(f)) {
							a.setStyle("width", f);
							return a.$.clientWidth;
						}
						return f;
					};
				}(),
				repeat: function(a, f) {
					return Array(f + 1).join(a);
				},
				tryThese: function() {
					var a;
					var f = 0;
					var c = arguments.length;
					for (; f < c; f++) {
						var b = arguments[f];
						try {
							a = b();
							break;
						} catch (d) {}
					}
					return a;
				},
				genKey: function() {
					return Array.prototype.slice.call(arguments).join("-");
				},
				defer: function(a) {
					return function() {
						var f = arguments;
						var c = this;
						window.setTimeout(function() {
							a.apply(c, f);
						}, 0);
					};
				},
				normalizeCssText: function(a, f) {
					var c = [];
					var b;
					var d = CKEDITOR.tools.parseCssText(a, true, f);
					for (b in d) {
						c.push(b + ":" + d[b]);
					}
					c.sort();
					return c.length ? c.join(";") + ";" : "";
				},
				convertRgbToHex: function(a$$0) {
					return a$$0.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi, function(a, f, c, b) {
						a = [f, c, b];
						f = 0;
						for (; f < 3; f++) {
							a[f] = ("0" + parseInt(a[f], 10).toString(16)).slice(-2);
						}
						return "#" + a.join("");
					});
				},
				parseCssText: function(a$$0, f, c$$0) {
					var b = {};
					if (c$$0) {
						c$$0 = new CKEDITOR.dom.element("span");
						c$$0.setAttribute("style", a$$0);
						a$$0 = CKEDITOR.tools.convertRgbToHex(c$$0.getAttribute("style") || "");
					}
					if (!a$$0 || a$$0 == ";") {
						return b;
					}
					a$$0.replace(/&quot;/g, '"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(a, c, d) {
						if (f) {
							c = c.toLowerCase();
							if (c == "font-family") {
								d = d.toLowerCase().replace(/["']/g, "").replace(/\s*,\s*/g, ",");
							}
							d = CKEDITOR.tools.trim(d);
						}
						b[c] = d;
					});
					return b;
				},
				writeCssText: function(a, f) {
					var c;
					var b = [];
					for (c in a) {
						b.push(c + ":" + a[c]);
					}
					if (f) {
						b.sort();
					}
					return b.join("; ");
				},
				objectCompare: function(a, f, c) {
					var b;
					if (!a && !f) {
						return true;
					}
					if (!a || !f) {
						return false;
					}
					for (b in a) {
						if (a[b] != f[b]) {
							return false;
						}
					}
					if (!c) {
						for (b in f) {
							if (a[b] != f[b]) {
								return false;
							}
						}
					}
					return true;
				},
				objectKeys: function(a) {
					var f = [];
					var c;
					for (c in a) {
						f.push(c);
					}
					return f;
				},
				convertArrayToObject: function(a, f) {
					var c = {};
					if (arguments.length == 1) {
						f = true;
					}
					var b = 0;
					var d = a.length;
					for (; b < d; ++b) {
						c[a[b]] = f;
					}
					return c;
				},
				fixDomain: function() {
					var a;
					for (;;) {
						try {
							a = window.parent.document.domain;
							break;
						} catch (f) {
							a = a ? a.replace(/.+?(?:\.|$)/, "") : document.domain;
							if (!a) {
								break;
							}
							document.domain = a;
						}
					}
					return !!a;
				},
				eventsBuffer: function(a, f$$0) {
					function c() {
						d = (new Date).getTime();
						b = false;
						f$$0();
					}
					var b;
					var d = 0;
					return {
						input: function() {
							if (!b) {
								var f = (new Date).getTime() - d;
								if (f < a) {
									b = setTimeout(c, a - f);
								} else {
									c();
								}
							}
						},
						reset: function() {
							if (b) {
								clearTimeout(b);
							}
							b = d = 0;
						}
					};
				},
				enableHtml5Elements: function(a, f) {
					var c = ["abbr", "article", "aside", "audio", "bdi", "canvas", "data", "datalist", "details", "figcaption", "figure", "footer", "header", "hgroup", "mark", "meter", "nav", "output", "progress", "section", "summary", "time", "video"];
					var b = c.length;
					var d;
					for (; b--;) {
						d = a.createElement(c[b]);
						if (f) {
							a.appendChild(d);
						}
					}
				},
				checkIfAnyArrayItemMatches: function(a, f) {
					var c = 0;
					var b = a.length;
					for (; c < b; ++c) {
						if (a[c].match(f)) {
							return true;
						}
					}
					return false;
				},
				checkIfAnyObjectPropertyMatches: function(a, f) {
					var c;
					for (c in a) {
						if (c.match(f)) {
							return true;
						}
					}
					return false;
				},
				transparentImageData: "data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw=="
			};
		})();
		CKEDITOR.dtd = function() {
			var a$$0 = CKEDITOR.tools.extend;
			var e = function(a, f) {
				var c = CKEDITOR.tools.clone(a);
				var b = 1;
				for (; b < arguments.length; b++) {
					f = arguments[b];
					var d;
					for (d in f) {
						delete c[d];
					}
				}
				return c;
			};
			var b$$0 = {};
			var d$$0 = {};
			var f$$0 = {
				address: 1,
				article: 1,
				aside: 1,
				blockquote: 1,
				details: 1,
				div: 1,
				dl: 1,
				fieldset: 1,
				figure: 1,
				footer: 1,
				form: 1,
				h1: 1,
				h2: 1,
				h3: 1,
				h4: 1,
				h5: 1,
				h6: 1,
				header: 1,
				hgroup: 1,
				hr: 1,
				menu: 1,
				nav: 1,
				ol: 1,
				p: 1,
				pre: 1,
				section: 1,
				table: 1,
				ul: 1
			};
			var c$$0 = {
				command: 1,
				link: 1,
				meta: 1,
				noscript: 1,
				script: 1,
				style: 1
			};
			var h = {};
			var j = {
				"#": 1
			};
			var g = {
				center: 1,
				dir: 1,
				noframes: 1
			};
			a$$0(b$$0, {
				a: 1,
				abbr: 1,
				area: 1,
				audio: 1,
				b: 1,
				bdi: 1,
				bdo: 1,
				br: 1,
				button: 1,
				canvas: 1,
				cite: 1,
				code: 1,
				command: 1,
				datalist: 1,
				del: 1,
				dfn: 1,
				em: 1,
				embed: 1,
				i: 1,
				iframe: 1,
				img: 1,
				input: 1,
				ins: 1,
				kbd: 1,
				keygen: 1,
				label: 1,
				map: 1,
				mark: 1,
				meter: 1,
				noscript: 1,
				object: 1,
				output: 1,
				progress: 1,
				q: 1,
				ruby: 1,
				s: 1,
				samp: 1,
				script: 1,
				select: 1,
				small: 1,
				span: 1,
				strong: 1,
				sub: 1,
				sup: 1,
				textarea: 1,
				time: 1,
				u: 1,
				"var": 1,
				video: 1,
				wbr: 1
			}, j, {
				acronym: 1,
				applet: 1,
				basefont: 1,
				big: 1,
				font: 1,
				isindex: 1,
				strike: 1,
				style: 1,
				tt: 1
			});
			a$$0(d$$0, f$$0, b$$0, g);
			e = {
				a: e(b$$0, {
					a: 1,
					button: 1
				}),
				abbr: b$$0,
				address: d$$0,
				area: h,
				article: a$$0({
					style: 1
				}, d$$0),
				aside: a$$0({
					style: 1
				}, d$$0),
				audio: a$$0({
					source: 1,
					track: 1
				}, d$$0),
				b: b$$0,
				base: h,
				bdi: b$$0,
				bdo: b$$0,
				blockquote: d$$0,
				body: d$$0,
				br: h,
				button: e(b$$0, {
					a: 1,
					button: 1
				}),
				canvas: b$$0,
				caption: d$$0,
				cite: b$$0,
				code: b$$0,
				col: h,
				colgroup: {
					col: 1
				},
				command: h,
				datalist: a$$0({
					option: 1
				}, b$$0),
				dd: d$$0,
				del: b$$0,
				details: a$$0({
					summary: 1
				}, d$$0),
				dfn: b$$0,
				div: a$$0({
					style: 1
				}, d$$0),
				dl: {
					dt: 1,
					dd: 1
				},
				dt: d$$0,
				em: b$$0,
				embed: h,
				fieldset: a$$0({
					legend: 1
				}, d$$0),
				figcaption: d$$0,
				figure: a$$0({
					figcaption: 1
				}, d$$0),
				footer: d$$0,
				form: d$$0,
				h1: b$$0,
				h2: b$$0,
				h3: b$$0,
				h4: b$$0,
				h5: b$$0,
				h6: b$$0,
				head: a$$0({
					title: 1,
					base: 1
				}, c$$0),
				header: d$$0,
				hgroup: {
					h1: 1,
					h2: 1,
					h3: 1,
					h4: 1,
					h5: 1,
					h6: 1
				},
				hr: h,
				html: a$$0({
					head: 1,
					body: 1
				}, d$$0, c$$0),
				i: b$$0,
				iframe: j,
				img: h,
				input: h,
				ins: b$$0,
				kbd: b$$0,
				keygen: h,
				label: b$$0,
				legend: b$$0,
				li: d$$0,
				link: h,
				map: d$$0,
				mark: b$$0,
				menu: a$$0({
					li: 1
				}, d$$0),
				meta: h,
				meter: e(b$$0, {
					meter: 1
				}),
				nav: d$$0,
				noscript: a$$0({
					link: 1,
					meta: 1,
					style: 1
				}, b$$0),
				object: a$$0({
					param: 1
				}, b$$0),
				ol: {
					li: 1
				},
				optgroup: {
					option: 1
				},
				option: j,
				output: b$$0,
				p: b$$0,
				param: h,
				pre: b$$0,
				progress: e(b$$0, {
					progress: 1
				}),
				q: b$$0,
				rp: b$$0,
				rt: b$$0,
				ruby: a$$0({
					rp: 1,
					rt: 1
				}, b$$0),
				s: b$$0,
				samp: b$$0,
				script: j,
				section: a$$0({
					style: 1
				}, d$$0),
				select: {
					optgroup: 1,
					option: 1
				},
				small: b$$0,
				source: h,
				span: b$$0,
				strong: b$$0,
				style: j,
				sub: b$$0,
				summary: b$$0,
				sup: b$$0,
				table: {
					caption: 1,
					colgroup: 1,
					thead: 1,
					tfoot: 1,
					tbody: 1,
					tr: 1
				},
				tbody: {
					tr: 1
				},
				td: d$$0,
				textarea: j,
				tfoot: {
					tr: 1
				},
				th: d$$0,
				thead: {
					tr: 1
				},
				time: e(b$$0, {
					time: 1
				}),
				title: j,
				tr: {
					th: 1,
					td: 1
				},
				track: h,
				u: b$$0,
				ul: {
					li: 1
				},
				"var": b$$0,
				video: a$$0({
					source: 1,
					track: 1
				}, d$$0),
				wbr: h,
				acronym: b$$0,
				applet: a$$0({
					param: 1
				}, d$$0),
				basefont: h,
				big: b$$0,
				center: d$$0,
				dialog: h,
				dir: {
					li: 1
				},
				font: b$$0,
				isindex: h,
				noframes: d$$0,
				strike: b$$0,
				tt: b$$0
			};
			a$$0(e, {
				$block: a$$0({
					audio: 1,
					dd: 1,
					dt: 1,
					figcaption: 1,
					li: 1,
					video: 1
				}, f$$0, g),
				$blockLimit: {
					article: 1,
					aside: 1,
					audio: 1,
					body: 1,
					caption: 1,
					details: 1,
					dir: 1,
					div: 1,
					dl: 1,
					fieldset: 1,
					figcaption: 1,
					figure: 1,
					footer: 1,
					form: 1,
					header: 1,
					hgroup: 1,
					menu: 1,
					nav: 1,
					ol: 1,
					section: 1,
					table: 1,
					td: 1,
					th: 1,
					tr: 1,
					ul: 1,
					video: 1
				},
				$cdata: {
					script: 1,
					style: 1
				},
				$editable: {
					address: 1,
					article: 1,
					aside: 1,
					blockquote: 1,
					body: 1,
					details: 1,
					div: 1,
					fieldset: 1,
					figcaption: 1,
					footer: 1,
					form: 1,
					h1: 1,
					h2: 1,
					h3: 1,
					h4: 1,
					h5: 1,
					h6: 1,
					header: 1,
					hgroup: 1,
					nav: 1,
					p: 1,
					pre: 1,
					section: 1
				},
				$empty: {
					area: 1,
					base: 1,
					basefont: 1,
					br: 1,
					col: 1,
					command: 1,
					dialog: 1,
					embed: 1,
					hr: 1,
					img: 1,
					input: 1,
					isindex: 1,
					keygen: 1,
					link: 1,
					meta: 1,
					param: 1,
					source: 1,
					track: 1,
					wbr: 1
				},
				$inline: b$$0,
				$list: {
					dl: 1,
					ol: 1,
					ul: 1
				},
				$listItem: {
					dd: 1,
					dt: 1,
					li: 1
				},
				$nonBodyContent: a$$0({
					body: 1,
					head: 1,
					html: 1
				}, e.head),
				$nonEditable: {
					applet: 1,
					audio: 1,
					button: 1,
					embed: 1,
					iframe: 1,
					map: 1,
					object: 1,
					option: 1,
					param: 1,
					script: 1,
					textarea: 1,
					video: 1
				},
				$object: {
					applet: 1,
					audio: 1,
					button: 1,
					hr: 1,
					iframe: 1,
					img: 1,
					input: 1,
					object: 1,
					select: 1,
					table: 1,
					textarea: 1,
					video: 1
				},
				$removeEmpty: {
					abbr: 1,
					acronym: 1,
					b: 1,
					bdi: 1,
					bdo: 1,
					big: 1,
					cite: 1,
					code: 1,
					del: 1,
					dfn: 1,
					em: 1,
					font: 1,
					i: 1,
					ins: 1,
					label: 1,
					kbd: 1,
					mark: 1,
					meter: 1,
					output: 1,
					q: 1,
					ruby: 1,
					s: 1,
					samp: 1,
					small: 1,
					span: 1,
					strike: 1,
					strong: 1,
					sub: 1,
					sup: 1,
					time: 1,
					tt: 1,
					u: 1,
					"var": 1
				},
				$tabIndex: {
					a: 1,
					area: 1,
					button: 1,
					input: 1,
					object: 1,
					select: 1,
					textarea: 1
				},
				$tableContent: {
					caption: 1,
					col: 1,
					colgroup: 1,
					tbody: 1,
					td: 1,
					tfoot: 1,
					th: 1,
					thead: 1,
					tr: 1
				},
				$transparent: {
					a: 1,
					audio: 1,
					canvas: 1,
					del: 1,
					ins: 1,
					map: 1,
					noscript: 1,
					object: 1,
					video: 1
				},
				$intermediate: {
					caption: 1,
					colgroup: 1,
					dd: 1,
					dt: 1,
					figcaption: 1,
					legend: 1,
					li: 1,
					optgroup: 1,
					option: 1,
					rp: 1,
					rt: 1,
					summary: 1,
					tbody: 1,
					td: 1,
					tfoot: 1,
					th: 1,
					thead: 1,
					tr: 1
				}
			});
			return e;
		}();
		CKEDITOR.dom.event = function(a) {
			this.$ = a;
		};
		CKEDITOR.dom.event.prototype = {
			getKey: function() {
				return this.$.keyCode || this.$.which;
			},
			getKeystroke: function() {
				var a = this.getKey();
				if (this.$.ctrlKey || this.$.metaKey) {
					a = a + CKEDITOR.CTRL;
				}
				if (this.$.shiftKey) {
					a = a + CKEDITOR.SHIFT;
				}
				if (this.$.altKey) {
					a = a + CKEDITOR.ALT;
				}
				return a;
			},
			preventDefault: function(a) {
				var e = this.$;
				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
				if (a) {
					this.stopPropagation();
				}
			},
			stopPropagation: function() {
				var a = this.$;
				if (a.stopPropagation) {
					a.stopPropagation();
				} else {
					a.cancelBubble = true;
				}
			},
			getTarget: function() {
				var a = this.$.target || this.$.srcElement;
				return a ? new CKEDITOR.dom.node(a) : null;
			},
			getPhase: function() {
				return this.$.eventPhase || 2;
			},
			getPageOffset: function() {
				var a = this.getTarget().getDocument().$;
				return {
					x: this.$.pageX || this.$.clientX + (a.documentElement.scrollLeft || a.body.scrollLeft),
					y: this.$.pageY || this.$.clientY + (a.documentElement.scrollTop || a.body.scrollTop)
				};
			}
		};
		CKEDITOR.CTRL = 1114112;
		CKEDITOR.SHIFT = 2228224;
		CKEDITOR.ALT = 4456448;
		CKEDITOR.EVENT_PHASE_CAPTURING = 1;
		CKEDITOR.EVENT_PHASE_AT_TARGET = 2;
		CKEDITOR.EVENT_PHASE_BUBBLING = 3;
		CKEDITOR.dom.domObject = function(a) {
			if (a) {
				this.$ = a;
			}
		};
		CKEDITOR.dom.domObject.prototype = function() {
			var a$$0 = function(a, b) {
				return function(d) {
					if (typeof CKEDITOR != "undefined") {
						a.fire(b, new CKEDITOR.dom.event(d));
					}
				};
			};
			return {
				getPrivate: function() {
					var a;
					if (!(a = this.getCustomData("_"))) {
						this.setCustomData("_", a = {});
					}
					return a;
				},
				on: function(e) {
					var b = this.getCustomData("_cke_nativeListeners");
					if (!b) {
						b = {};
						this.setCustomData("_cke_nativeListeners", b);
					}
					if (!b[e]) {
						b = b[e] = a$$0(this, e);
						if (this.$.addEventListener) {
							this.$.addEventListener(e, b, !!CKEDITOR.event.useCapture);
						} else {
							if (this.$.attachEvent) {
								this.$.attachEvent("on" + e, b);
							}
						}
					}
					return CKEDITOR.event.prototype.on.apply(this, arguments);
				},
				removeListener: function(a) {
					CKEDITOR.event.prototype.removeListener.apply(this, arguments);
					if (!this.hasListeners(a)) {
						var b = this.getCustomData("_cke_nativeListeners");
						var d = b && b[a];
						if (d) {
							if (this.$.removeEventListener) {
								this.$.removeEventListener(a, d, false);
							} else {
								if (this.$.detachEvent) {
									this.$.detachEvent("on" + a, d);
								}
							}
							delete b[a];
						}
					}
				},
				removeAllListeners: function() {
					var a = this.getCustomData("_cke_nativeListeners");
					var b;
					for (b in a) {
						var d = a[b];
						if (this.$.detachEvent) {
							this.$.detachEvent("on" + b, d);
						} else {
							if (this.$.removeEventListener) {
								this.$.removeEventListener(b, d, false);
							}
						}
						delete a[b];
					}
					CKEDITOR.event.prototype.removeAllListeners.call(this);
				}
			};
		}();
		(function(a$$0) {
			var e = {};
			CKEDITOR.on("reset", function() {
				e = {};
			});
			a$$0.equals = function(a) {
				try {
					return a && a.$ === this.$;
				} catch (d) {
					return false;
				}
			};
			a$$0.setCustomData = function(a, d) {
				var f = this.getUniqueId();
				(e[f] || (e[f] = {}))[a] = d;
				return this;
			};
			a$$0.getCustomData = function(a) {
				var d = this.$["data-cke-expando"];
				return (d = d && e[d]) && a in d ? d[a] : null;
			};
			a$$0.removeCustomData = function(a) {
				var d = this.$["data-cke-expando"];
				d = d && e[d];
				var f;
				var c;
				if (d) {
					f = d[a];
					c = a in d;
					delete d[a];
				}
				return c ? f : null;
			};
			a$$0.clearCustomData = function() {
				this.removeAllListeners();
				var a = this.$["data-cke-expando"];
				if (a) {
					delete e[a];
				}
			};
			a$$0.getUniqueId = function() {
				return this.$["data-cke-expando"] || (this.$["data-cke-expando"] = CKEDITOR.tools.getNextNumber());
			};
			CKEDITOR.event.implementOn(a$$0);
		})(CKEDITOR.dom.domObject.prototype);
		CKEDITOR.dom.node = function(a) {
			return a ? new CKEDITOR.dom[a.nodeType == CKEDITOR.NODE_DOCUMENT ? "document" : a.nodeType == CKEDITOR.NODE_ELEMENT ? "element" : a.nodeType == CKEDITOR.NODE_TEXT ? "text" : a.nodeType == CKEDITOR.NODE_COMMENT ? "comment" : a.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? "documentFragment" : "domObject"](a) : this;
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
			appendTo: function(a, e) {
				a.append(this, e);
				return a;
			},
			clone: function(a, e) {
				var b = this.$.cloneNode(a);
				var d = function(f) {
					if (f["data-cke-expando"]) {
						f["data-cke-expando"] = false;
					}
					if (f.nodeType == CKEDITOR.NODE_ELEMENT) {
						if (!e) {
							f.removeAttribute("id", false);
						}
						if (a) {
							f = f.childNodes;
							var c = 0;
							for (; c < f.length; c++) {
								d(f[c]);
							}
						}
					}
				};
				d(b);
				return new CKEDITOR.dom.node(b);
			},
			hasPrevious: function() {
				return !!this.$.previousSibling;
			},
			hasNext: function() {
				return !!this.$.nextSibling;
			},
			insertAfter: function(a) {
				a.$.parentNode.insertBefore(this.$, a.$.nextSibling);
				return a;
			},
			insertBefore: function(a) {
				a.$.parentNode.insertBefore(this.$, a.$);
				return a;
			},
			insertBeforeMe: function(a) {
				this.$.parentNode.insertBefore(a.$, this.$);
				return a;
			},
			getAddress: function(a) {
				var e = [];
				var b = this.getDocument().$.documentElement;
				var d = this.$;
				for (; d && d != b;) {
					var f = d.parentNode;
					if (f) {
						e.unshift(this.getIndex.call({
							$: d
						}, a));
					}
					d = f;
				}
				return e;
			},
			getDocument: function() {
				return new CKEDITOR.dom.document(this.$.ownerDocument || this.$.parentNode.ownerDocument);
			},
			getIndex: function(a) {
				var e = this.$;
				var b = -1;
				var d;
				if (!this.$.parentNode) {
					return b;
				}
				do {
					if (!a || !(e != this.$ && (e.nodeType == CKEDITOR.NODE_TEXT && (d || !e.nodeValue)))) {
						b++;
						d = e.nodeType == CKEDITOR.NODE_TEXT;
					}
				} while (e = e.previousSibling);
				return b;
			},
			getNextSourceNode: function(a$$0, e, b) {
				if (b && !b.call) {
					var d = b;
					b = function(a) {
						return !a.equals(d);
					};
				}
				a$$0 = !a$$0 && (this.getFirst && this.getFirst());
				var f;
				if (!a$$0) {
					if (this.type == CKEDITOR.NODE_ELEMENT && (b && b(this, true) === false)) {
						return null;
					}
					a$$0 = this.getNext();
				}
				for (; !a$$0 && (f = (f || this).getParent());) {
					if (b && b(f, true) === false) {
						return null;
					}
					a$$0 = f.getNext();
				}
				return !a$$0 || b && b(a$$0) === false ? null : e && e != a$$0.type ? a$$0.getNextSourceNode(false, e, b) : a$$0;
			},
			getPreviousSourceNode: function(a$$0, e, b) {
				if (b && !b.call) {
					var d = b;
					b = function(a) {
						return !a.equals(d);
					};
				}
				a$$0 = !a$$0 && (this.getLast && this.getLast());
				var f;
				if (!a$$0) {
					if (this.type == CKEDITOR.NODE_ELEMENT && (b && b(this, true) === false)) {
						return null;
					}
					a$$0 = this.getPrevious();
				}
				for (; !a$$0 && (f = (f || this).getParent());) {
					if (b && b(f, true) === false) {
						return null;
					}
					a$$0 = f.getPrevious();
				}
				return !a$$0 || b && b(a$$0) === false ? null : e && a$$0.type != e ? a$$0.getPreviousSourceNode(false, e, b) : a$$0;
			},
			getPrevious: function(a) {
				var e = this.$;
				var b;
				do {
					b = (e = e.previousSibling) && (e.nodeType != 10 && new CKEDITOR.dom.node(e));
				} while (b && (a && !a(b)));
				return b;
			},
			getNext: function(a) {
				var e = this.$;
				var b;
				do {
					b = (e = e.nextSibling) && new CKEDITOR.dom.node(e);
				} while (b && (a && !a(b)));
				return b;
			},
			getParent: function(a) {
				var e = this.$.parentNode;
				return e && (e.nodeType == CKEDITOR.NODE_ELEMENT || a && e.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT) ? new CKEDITOR.dom.node(e) : null;
			},
			getParents: function(a) {
				var e = this;
				var b = [];
				do {
					b[a ? "push" : "unshift"](e);
				} while (e = e.getParent());
				return b;
			},
			getCommonAncestor: function(a) {
				if (a.equals(this)) {
					return this;
				}
				if (a.contains && a.contains(this)) {
					return a;
				}
				var e = this.contains ? this : this.getParent();
				do {
					if (e.contains(a)) {
						return e;
					}
				} while (e = e.getParent());
				return null;
			},
			getPosition: function(a) {
				var e = this.$;
				var b = a.$;
				if (e.compareDocumentPosition) {
					return e.compareDocumentPosition(b);
				}
				if (e == b) {
					return CKEDITOR.POSITION_IDENTICAL;
				}
				if (this.type == CKEDITOR.NODE_ELEMENT && a.type == CKEDITOR.NODE_ELEMENT) {
					if (e.contains) {
						if (e.contains(b)) {
							return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
						}
						if (b.contains(e)) {
							return CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING;
						}
					}
					if ("sourceIndex" in e) {
						return e.sourceIndex < 0 || b.sourceIndex < 0 ? CKEDITOR.POSITION_DISCONNECTED : e.sourceIndex < b.sourceIndex ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
					}
				}
				e = this.getAddress();
				a = a.getAddress();
				b = Math.min(e.length, a.length);
				var d = 0;
				for (; d <= b - 1; d++) {
					if (e[d] != a[d]) {
						if (d < b) {
							return e[d] < a[d] ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
						}
						break;
					}
				}
				return e.length < a.length ? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING;
			},
			getAscendant: function(a, e) {
				var b = this.$;
				var d;
				if (!e) {
					b = b.parentNode;
				}
				for (; b;) {
					if (b.nodeName && (d = b.nodeName.toLowerCase(), typeof a == "string" ? d == a : d in a)) {
						return new CKEDITOR.dom.node(b);
					}
					try {
						b = b.parentNode;
					} catch (f) {
						b = null;
					}
				}
				return null;
			},
			hasAscendant: function(a, e) {
				var b = this.$;
				if (!e) {
					b = b.parentNode;
				}
				for (; b;) {
					if (b.nodeName && b.nodeName.toLowerCase() == a) {
						return true;
					}
					b = b.parentNode;
				}
				return false;
			},
			move: function(a, e) {
				a.append(this.remove(), e);
			},
			remove: function(a) {
				var e = this.$;
				var b = e.parentNode;
				if (b) {
					if (a) {
						for (; a = e.firstChild;) {
							b.insertBefore(e.removeChild(a), e);
						}
					}
					b.removeChild(e);
				}
				return this;
			},
			replace: function(a) {
				this.insertBefore(a);
				a.remove();
			},
			trim: function() {
				this.ltrim();
				this.rtrim();
			},
			ltrim: function() {
				var a;
				for (; this.getFirst && (a = this.getFirst());) {
					if (a.type == CKEDITOR.NODE_TEXT) {
						var e = CKEDITOR.tools.ltrim(a.getText());
						var b = a.getLength();
						if (e) {
							if (e.length < b) {
								a.split(b - e.length);
								this.$.removeChild(this.$.firstChild);
							}
						} else {
							a.remove();
							continue;
						}
					}
					break;
				}
			},
			rtrim: function() {
				var a;
				for (; this.getLast && (a = this.getLast());) {
					if (a.type == CKEDITOR.NODE_TEXT) {
						var e = CKEDITOR.tools.rtrim(a.getText());
						var b = a.getLength();
						if (e) {
							if (e.length < b) {
								a.split(e.length);
								this.$.lastChild.parentNode.removeChild(this.$.lastChild);
							}
						} else {
							a.remove();
							continue;
						}
					}
					break;
				}
				if (CKEDITOR.env.needsBrFiller) {
					if (a = this.$.lastChild) {
						if (a.type == 1 && a.nodeName.toLowerCase() == "br") {
							a.parentNode.removeChild(a);
						}
					}
				}
			},
			isReadOnly: function() {
				var a = this;
				if (this.type != CKEDITOR.NODE_ELEMENT) {
					a = this.getParent();
				}
				if (a && typeof a.$.isContentEditable != "undefined") {
					return !(a.$.isContentEditable || a.data("cke-editable"));
				}
				for (; a;) {
					if (a.data("cke-editable")) {
						break;
					}
					if (a.getAttribute("contentEditable") == "false") {
						return true;
					}
					if (a.getAttribute("contentEditable") == "true") {
						break;
					}
					a = a.getParent();
				}
				return !a;
			}
		});
		CKEDITOR.dom.window = function(a) {
			CKEDITOR.dom.domObject.call(this, a);
		};
		CKEDITOR.dom.window.prototype = new CKEDITOR.dom.domObject;
		CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype, {
			focus: function() {
				this.$.focus();
			},
			getViewPaneSize: function() {
				var a = this.$.document;
				var e = a.compatMode == "CSS1Compat";
				return {
					width: (e ? a.documentElement.clientWidth : a.body.clientWidth) || 0,
					height: (e ? a.documentElement.clientHeight : a.body.clientHeight) || 0
				};
			},
			getScrollPosition: function() {
				var a = this.$;
				if ("pageXOffset" in a) {
					return {
						x: a.pageXOffset || 0,
						y: a.pageYOffset || 0
					};
				}
				a = a.document;
				return {
					x: a.documentElement.scrollLeft || (a.body.scrollLeft || 0),
					y: a.documentElement.scrollTop || (a.body.scrollTop || 0)
				};
			},
			getFrame: function() {
				var a = this.$.frameElement;
				return a ? new CKEDITOR.dom.element.get(a) : null;
			}
		});
		CKEDITOR.dom.document = function(a) {
			CKEDITOR.dom.domObject.call(this, a);
		};
		CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject;
		CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype, {
			type: CKEDITOR.NODE_DOCUMENT,
			appendStyleSheet: function(a) {
				if (this.$.createStyleSheet) {
					this.$.createStyleSheet(a);
				} else {
					var e = new CKEDITOR.dom.element("link");
					e.setAttributes({
						rel: "stylesheet",
						type: "text/css",
						href: a
					});
					this.getHead().append(e);
				}
			},
			appendStyleText: function(a) {
				if (this.$.createStyleSheet) {
					var e = this.$.createStyleSheet("");
					e.cssText = a;
				} else {
					var b = new CKEDITOR.dom.element("style", this);
					b.append(new CKEDITOR.dom.text(a, this));
					this.getHead().append(b);
				}
				return e || b.$.sheet;
			},
			createElement: function(a, e) {
				var b = new CKEDITOR.dom.element(a, this);
				if (e) {
					if (e.attributes) {
						b.setAttributes(e.attributes);
					}
					if (e.styles) {
						b.setStyles(e.styles);
					}
				}
				return b;
			},
			createText: function(a) {
				return new CKEDITOR.dom.text(a, this);
			},
			focus: function() {
				this.getWindow().focus();
			},
			getActive: function() {
				return new CKEDITOR.dom.element(this.$.activeElement);
			},
			getById: function(a) {
				return (a = this.$.getElementById(a)) ? new CKEDITOR.dom.element(a) : null;
			},
			getByAddress: function(a, e) {
				var b = this.$.documentElement;
				var d = 0;
				for (; b && d < a.length; d++) {
					var f = a[d];
					if (e) {
						var c = -1;
						var h = 0;
						for (; h < b.childNodes.length; h++) {
							var j = b.childNodes[h];
							if (!(e === true && (j.nodeType == 3 && (j.previousSibling && j.previousSibling.nodeType == 3)))) {
								c++;
								if (c == f) {
									b = j;
									break;
								}
							}
						}
					} else {
						b = b.childNodes[f];
					}
				}
				return b ? new CKEDITOR.dom.node(b) : null;
			},
			getElementsByTag: function(a, e) {
				if ((!CKEDITOR.env.ie || document.documentMode > 8) && e) {
					a = e + ":" + a;
				}
				return new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(a));
			},
			getHead: function() {
				var a = this.$.getElementsByTagName("head")[0];
				return a = a ? new CKEDITOR.dom.element(a) : this.getDocumentElement().append(new CKEDITOR.dom.element("head"), true);
			},
			getBody: function() {
				return new CKEDITOR.dom.element(this.$.body);
			},
			getDocumentElement: function() {
				return new CKEDITOR.dom.element(this.$.documentElement);
			},
			getWindow: function() {
				return new CKEDITOR.dom.window(this.$.parentWindow || this.$.defaultView);
			},
			write: function(a) {
				this.$.open("text/html", "replace");
				if (CKEDITOR.env.ie) {
					a = a.replace(/(?:^\s*<!DOCTYPE[^>]*?>)|^/i, '$&\n<script data-cke-temp="1">(' + CKEDITOR.tools.fixDomain + ")();\x3c/script>");
				}
				this.$.write(a);
				this.$.close();
			},
			find: function(a) {
				return new CKEDITOR.dom.nodeList(this.$.querySelectorAll(a));
			},
			findOne: function(a) {
				return (a = this.$.querySelector(a)) ? new CKEDITOR.dom.element(a) : null;
			},
			_getHtml5ShivFrag: function() {
				var a = this.getCustomData("html5ShivFrag");
				if (!a) {
					a = this.$.createDocumentFragment();
					CKEDITOR.tools.enableHtml5Elements(a, true);
					this.setCustomData("html5ShivFrag", a);
				}
				return a;
			}
		});
		CKEDITOR.dom.nodeList = function(a) {
			this.$ = a;
		};
		CKEDITOR.dom.nodeList.prototype = {
			count: function() {
				return this.$.length;
			},
			getItem: function(a) {
				if (a < 0 || a >= this.$.length) {
					return null;
				}
				return (a = this.$[a]) ? new CKEDITOR.dom.node(a) : null;
			}
		};
		CKEDITOR.dom.element = function(a, e) {
			if (typeof a == "string") {
				a = (e ? e.$ : document).createElement(a);
			}
			CKEDITOR.dom.domObject.call(this, a);
		};
		CKEDITOR.dom.element.get = function(a) {
			return (a = typeof a == "string" ? document.getElementById(a) || document.getElementsByName(a)[0] : a) && (a.$ ? a : new CKEDITOR.dom.element(a));
		};
		CKEDITOR.dom.element.prototype = new CKEDITOR.dom.node;
		CKEDITOR.dom.element.createFromHtml = function(a, e) {
			var b = new CKEDITOR.dom.element("div", e);
			b.setHtml(a);
			return b.getFirst().remove();
		};
		CKEDITOR.dom.element.setMarker = function(a, e, b, d) {
			var f = e.getCustomData("list_marker_id") || e.setCustomData("list_marker_id", CKEDITOR.tools.getNextNumber()).getCustomData("list_marker_id");
			var c = e.getCustomData("list_marker_names") || e.setCustomData("list_marker_names", {}).getCustomData("list_marker_names");
			a[f] = e;
			c[b] = 1;
			return e.setCustomData(b, d);
		};
		CKEDITOR.dom.element.clearAllMarkers = function(a) {
			var e;
			for (e in a) {
				CKEDITOR.dom.element.clearMarkers(a, a[e], 1);
			}
		};
		CKEDITOR.dom.element.clearMarkers = function(a, e, b) {
			var d = e.getCustomData("list_marker_names");
			var f = e.getCustomData("list_marker_id");
			var c;
			for (c in d) {
				e.removeCustomData(c);
			}
			e.removeCustomData("list_marker_names");
			if (b) {
				e.removeCustomData("list_marker_id");
				delete a[f];
			}
		};
		(function() {
			function a$$1(a) {
				var c = true;
				if (!a.$.id) {
					a.$.id = "cke_tmp_" + CKEDITOR.tools.getNextNumber();
					c = false;
				}
				return function() {
					if (!c) {
						a.removeAttribute("id");
					}
				};
			}

			function e$$0(a, c) {
				return "#" + a.$.id + " " + c.split(/,\s*/).join(", #" + a.$.id + " ");
			}

			function b$$1(a) {
				var c = 0;
				var b = 0;
				var e = d$$0[a].length;
				for (; b < e; b++) {
					c = c + (parseInt(this.getComputedStyle(d$$0[a][b]) || 0, 10) || 0);
				}
				return c;
			}
			CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype, {
				type: CKEDITOR.NODE_ELEMENT,
				addClass: function(a) {
					var c = this.$.className;
					if (c) {
						if (!RegExp("(?:^|\\s)" + a + "(?:\\s|$)", "").test(c)) {
							c = c + (" " + a);
						}
					}
					this.$.className = c || a;
					return this;
				},
				removeClass: function(a) {
					var c = this.getAttribute("class");
					if (c) {
						a = RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "i");
						if (a.test(c)) {
							if (c = c.replace(a, "").replace(/^\s+/, "")) {
								this.setAttribute("class", c);
							} else {
								this.removeAttribute("class");
							}
						}
					}
					return this;
				},
				hasClass: function(a) {
					return RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "").test(this.getAttribute("class"));
				},
				append: function(a, c) {
					if (typeof a == "string") {
						a = this.getDocument().createElement(a);
					}
					if (c) {
						this.$.insertBefore(a.$, this.$.firstChild);
					} else {
						this.$.appendChild(a.$);
					}
					return a;
				},
				appendHtml: function(a) {
					if (this.$.childNodes.length) {
						var c = new CKEDITOR.dom.element("div", this.getDocument());
						c.setHtml(a);
						c.moveChildren(this);
					} else {
						this.setHtml(a);
					}
				},
				appendText: function(a) {
					if (this.$.text != void 0) {
						this.$.text = this.$.text + a;
					} else {
						this.append(new CKEDITOR.dom.text(a));
					}
				},
				appendBogus: function(a) {
					if (a || CKEDITOR.env.needsBrFiller) {
						a = this.getLast();
						for (; a && (a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.rtrim(a.getText()));) {
							a = a.getPrevious();
						}
						if (!a || (!a.is || !a.is("br"))) {
							a = this.getDocument().createElement("br");
							if (CKEDITOR.env.gecko) {
								a.setAttribute("type", "_moz");
							}
							this.append(a);
						}
					}
				},
				breakParent: function(a) {
					var c = new CKEDITOR.dom.range(this.getDocument());
					c.setStartAfter(this);
					c.setEndAfter(a);
					a = c.extractContents();
					c.insertNode(this.remove());
					a.insertAfterNode(this);
				},
				contains: CKEDITOR.env.ie || CKEDITOR.env.webkit ? function(a) {
					var c = this.$;
					return a.type != CKEDITOR.NODE_ELEMENT ? c.contains(a.getParent().$) : c != a.$ && c.contains(a.$);
				} : function(a) {
					return !!(this.$.compareDocumentPosition(a.$) & 16);
				},
				focus: function() {
					function a() {
						try {
							this.$.focus();
						} catch (f) {}
					}
					return function(c) {
						if (c) {
							CKEDITOR.tools.setTimeout(a, 100, this);
						} else {
							a.call(this);
						}
					};
				}(),
				getHtml: function() {
					var a = this.$.innerHTML;
					return CKEDITOR.env.ie ? a.replace(/<\?[^>]*>/g, "") : a;
				},
				getOuterHtml: function() {
					if (this.$.outerHTML) {
						return this.$.outerHTML.replace(/<\?[^>]*>/, "");
					}
					var a = this.$.ownerDocument.createElement("div");
					a.appendChild(this.$.cloneNode(true));
					return a.innerHTML;
				},
				getClientRect: function() {
					var a = CKEDITOR.tools.extend({}, this.$.getBoundingClientRect());
					if (!a.width) {
						a.width = a.right - a.left;
					}
					if (!a.height) {
						a.height = a.bottom - a.top;
					}
					return a;
				},
				setHtml: CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? function(a) {
					try {
						var c = this.$;
						if (this.getParent()) {
							return c.innerHTML = a;
						}
						var b = this.getDocument()._getHtml5ShivFrag();
						b.appendChild(c);
						c.innerHTML = a;
						b.removeChild(c);
						return a;
					} catch (d) {
						this.$.innerHTML = "";
						c = new CKEDITOR.dom.element("body", this.getDocument());
						c.$.innerHTML = a;
						c = c.getChildren();
						for (; c.count();) {
							this.append(c.getItem(0));
						}
						return a;
					}
				} : function(a) {
					return this.$.innerHTML = a;
				},
				setText: function(a$$0) {
					CKEDITOR.dom.element.prototype.setText = this.$.innerText != void 0 ? function(a) {
						return this.$.innerText = a;
					} : function(a) {
						return this.$.textContent = a;
					};
					return this.setText(a$$0);
				},
				getAttribute: function() {
					var a$$0 = function(a) {
						return this.$.getAttribute(a, 2);
					};
					return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(a) {
						switch (a) {
							case "class":
								a = "className";
								break;
							case "http-equiv":
								a = "httpEquiv";
								break;
							case "name":
								return this.$.name;
							case "tabindex":
								a = this.$.getAttribute(a, 2);
								if (a !== 0) {
									if (this.$.tabIndex === 0) {
										a = null;
									}
								}
								return a;
							case "checked":
								a = this.$.attributes.getNamedItem(a);
								return (a.specified ? a.nodeValue : this.$.checked) ? "checked" : null;
							case "hspace":
								;
							case "value":
								return this.$[a];
							case "style":
								return this.$.style.cssText;
							case "contenteditable":
								;
							case "contentEditable":
								return this.$.attributes.getNamedItem("contentEditable").specified ? this.$.getAttribute("contentEditable") : null;
						}
						return this.$.getAttribute(a, 2);
					} : a$$0;
				}(),
				getChildren: function() {
					return new CKEDITOR.dom.nodeList(this.$.childNodes);
				},
				getComputedStyle: CKEDITOR.env.ie ? function(a) {
					return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(a)];
				} : function(a) {
					var c = this.getWindow().$.getComputedStyle(this.$, null);
					return c ? c.getPropertyValue(a) : "";
				},
				getDtd: function() {
					var a = CKEDITOR.dtd[this.getName()];
					this.getDtd = function() {
						return a;
					};
					return a;
				},
				getElementsByTag: CKEDITOR.dom.document.prototype.getElementsByTag,
				getTabIndex: CKEDITOR.env.ie ? function() {
					var a = this.$.tabIndex;
					if (a === 0) {
						if (!CKEDITOR.dtd.$tabIndex[this.getName()] && parseInt(this.getAttribute("tabindex"), 10) !== 0) {
							a = -1;
						}
					}
					return a;
				} : CKEDITOR.env.webkit ? function() {
					var a = this.$.tabIndex;
					if (a == void 0) {
						a = parseInt(this.getAttribute("tabindex"), 10);
						if (isNaN(a)) {
							a = -1;
						}
					}
					return a;
				} : function() {
					return this.$.tabIndex;
				},
				getText: function() {
					return this.$.textContent || (this.$.innerText || "");
				},
				getWindow: function() {
					return this.getDocument().getWindow();
				},
				getId: function() {
					return this.$.id || null;
				},
				getNameAtt: function() {
					return this.$.name || null;
				},
				getName: function() {
					var a = this.$.nodeName.toLowerCase();
					if (CKEDITOR.env.ie && !(document.documentMode > 8)) {
						var c = this.$.scopeName;
						if (c != "HTML") {
							a = c.toLowerCase() + ":" + a;
						}
					}
					return (this.getName = function() {
						return a;
					})();
				},
				getValue: function() {
					return this.$.value;
				},
				getFirst: function(a) {
					var c = this.$.firstChild;
					if (c = c && new CKEDITOR.dom.node(c)) {
						if (a && !a(c)) {
							c = c.getNext(a);
						}
					}
					return c;
				},
				getLast: function(a) {
					var c = this.$.lastChild;
					if (c = c && new CKEDITOR.dom.node(c)) {
						if (a && !a(c)) {
							c = c.getPrevious(a);
						}
					}
					return c;
				},
				getStyle: function(a) {
					return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)];
				},
				is: function() {
					var a = this.getName();
					if (typeof arguments[0] == "object") {
						return !!arguments[0][a];
					}
					var c = 0;
					for (; c < arguments.length; c++) {
						if (arguments[c] == a) {
							return true;
						}
					}
					return false;
				},
				isEditable: function(a) {
					var c = this.getName();
					if (this.isReadOnly() || (this.getComputedStyle("display") == "none" || (this.getComputedStyle("visibility") == "hidden" || (CKEDITOR.dtd.$nonEditable[c] || (CKEDITOR.dtd.$empty[c] || this.is("a") && ((this.data("cke-saved-name") || this.hasAttribute("name")) && !this.getChildCount())))))) {
						return false;
					}
					if (a !== false) {
						a = CKEDITOR.dtd[c] || CKEDITOR.dtd.span;
						return !(!a || !a["#"]);
					}
					return true;
				},
				isIdentical: function(a) {
					var c = this.clone(0, 1);
					a = a.clone(0, 1);
					c.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
					a.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
					if (c.$.isEqualNode) {
						c.$.style.cssText = CKEDITOR.tools.normalizeCssText(c.$.style.cssText);
						a.$.style.cssText = CKEDITOR.tools.normalizeCssText(a.$.style.cssText);
						return c.$.isEqualNode(a.$);
					}
					c = c.getOuterHtml();
					a = a.getOuterHtml();
					if (CKEDITOR.env.ie && (CKEDITOR.env.version < 9 && this.is("a"))) {
						var b = this.getParent();
						if (b.type == CKEDITOR.NODE_ELEMENT) {
							b = b.clone();
							b.setHtml(c);
							c = b.getHtml();
							b.setHtml(a);
							a = b.getHtml();
						}
					}
					return c == a;
				},
				isVisible: function() {
					var a = (this.$.offsetHeight || this.$.offsetWidth) && this.getComputedStyle("visibility") != "hidden";
					var c;
					var b;
					if (a && CKEDITOR.env.webkit) {
						c = this.getWindow();
						if (!c.equals(CKEDITOR.document.getWindow()) && (b = c.$.frameElement)) {
							a = (new CKEDITOR.dom.element(b)).isVisible();
						}
					}
					return !!a;
				},
				isEmptyInlineRemoveable: function() {
					if (!CKEDITOR.dtd.$removeEmpty[this.getName()]) {
						return false;
					}
					var a = this.getChildren();
					var c = 0;
					var b = a.count();
					for (; c < b; c++) {
						var d = a.getItem(c);
						if (!(d.type == CKEDITOR.NODE_ELEMENT && d.data("cke-bookmark")) && (d.type == CKEDITOR.NODE_ELEMENT && !d.isEmptyInlineRemoveable() || d.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(d.getText()))) {
							return false;
						}
					}
					return true;
				},
				hasAttributes: CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function() {
					var a = this.$.attributes;
					var c = 0;
					for (; c < a.length; c++) {
						var b = a[c];
						switch (b.nodeName) {
							case "class":
								if (this.getAttribute("class")) {
									return true;
								};
							case "data-cke-expando":
								continue;
							default:
								if (b.specified) {
									return true;
								};
						}
					}
					return false;
				} : function() {
					var a = this.$.attributes;
					var c = a.length;
					var b = {
						"data-cke-expando": 1,
						_moz_dirty: 1
					};
					return c > 0 && (c > 2 || (!b[a[0].nodeName] || c == 2 && !b[a[1].nodeName]));
				},
				hasAttribute: function() {
					function a(f) {
						return (f = this.$.attributes.getNamedItem(f)) ? CKEDITOR.env.ie ? f.specified : true : false;
					}
					return CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? function(c) {
						return c == "name" ? !!this.$.name : a.call(this, c);
					} : a;
				}(),
				hide: function() {
					this.setStyle("display", "none");
				},
				moveChildren: function(a, c) {
					var b = this.$;
					a = a.$;
					if (b != a) {
						var d;
						if (c) {
							for (; d = b.lastChild;) {
								a.insertBefore(b.removeChild(d), a.firstChild);
							}
						} else {
							for (; d = b.firstChild;) {
								a.appendChild(b.removeChild(d));
							}
						}
					}
				},
				mergeSiblings: function() {
					function a(f, b, d) {
						if (b && b.type == CKEDITOR.NODE_ELEMENT) {
							var e = [];
							for (; b.data("cke-bookmark") || b.isEmptyInlineRemoveable();) {
								e.push(b);
								b = d ? b.getNext() : b.getPrevious();
								if (!b || b.type != CKEDITOR.NODE_ELEMENT) {
									return;
								}
							}
							if (f.isIdentical(b)) {
								var i = d ? f.getLast() : f.getFirst();
								for (; e.length;) {
									e.shift().move(f, !d);
								}
								b.moveChildren(f, !d);
								b.remove();
								if (i) {
									if (i.type == CKEDITOR.NODE_ELEMENT) {
										i.mergeSiblings();
									}
								}
							}
						}
					}
					return function(c) {
						if (c === false || (CKEDITOR.dtd.$removeEmpty[this.getName()] || this.is("a"))) {
							a(this, this.getNext(), true);
							a(this, this.getPrevious());
						}
					};
				}(),
				show: function() {
					this.setStyles({
						display: "",
						visibility: ""
					});
				},
				setAttribute: function() {
					var a$$0 = function(a, f) {
						this.$.setAttribute(a, f);
						return this;
					};
					return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(c, b) {
						if (c == "class") {
							this.$.className = b;
						} else {
							if (c == "style") {
								this.$.style.cssText = b;
							} else {
								if (c == "tabindex") {
									this.$.tabIndex = b;
								} else {
									if (c == "checked") {
										this.$.checked = b;
									} else {
										if (c == "contenteditable") {
											a$$0.call(this, "contentEditable", b);
										} else {
											a$$0.apply(this, arguments);
										}
									}
								}
							}
						}
						return this;
					} : CKEDITOR.env.ie8Compat && CKEDITOR.env.secure ? function(c, b) {
						if (c == "src" && b.match(/^http:\/\//)) {
							try {
								a$$0.apply(this, arguments);
							} catch (d) {}
						} else {
							a$$0.apply(this, arguments);
						}
						return this;
					} : a$$0;
				}(),
				setAttributes: function(a) {
					var c;
					for (c in a) {
						this.setAttribute(c, a[c]);
					}
					return this;
				},
				setValue: function(a) {
					this.$.value = a;
					return this;
				},
				removeAttribute: function() {
					var a$$0 = function(a) {
						this.$.removeAttribute(a);
					};
					return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(a) {
						if (a == "class") {
							a = "className";
						} else {
							if (a == "tabindex") {
								a = "tabIndex";
							} else {
								if (a == "contenteditable") {
									a = "contentEditable";
								}
							}
						}
						this.$.removeAttribute(a);
					} : a$$0;
				}(),
				removeAttributes: function(a) {
					if (CKEDITOR.tools.isArray(a)) {
						var c = 0;
						for (; c < a.length; c++) {
							this.removeAttribute(a[c]);
						}
					} else {
						for (c in a) {
							if (a.hasOwnProperty(c)) {
								this.removeAttribute(c);
							}
						}
					}
				},
				removeStyle: function(a) {
					var c = this.$.style;
					if (!c.removeProperty && (a == "border" || (a == "margin" || a == "padding"))) {
						var b = ["top", "left", "right", "bottom"];
						var d;
						if (a == "border") {
							d = ["color", "style", "width"];
						}
						c = [];
						var e = 0;
						for (; e < b.length; e++) {
							if (d) {
								var i = 0;
								for (; i < d.length; i++) {
									c.push([a, b[e], d[i]].join("-"));
								}
							} else {
								c.push([a, b[e]].join("-"));
							}
						}
						a = 0;
						for (; a < c.length; a++) {
							this.removeStyle(c[a]);
						}
					} else {
						if (c.removeProperty) {
							c.removeProperty(a);
						} else {
							c.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(a));
						}
						if (!this.$.style.cssText) {
							this.removeAttribute("style");
						}
					}
				},
				setStyle: function(a, c) {
					this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)] = c;
					return this;
				},
				setStyles: function(a) {
					var c;
					for (c in a) {
						this.setStyle(c, a[c]);
					}
					return this;
				},
				setOpacity: function(a) {
					if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
						a = Math.round(a * 100);
						this.setStyle("filter", a >= 100 ? "" : "progid:DXImageTransform.Microsoft.Alpha(opacity=" + a + ")");
					} else {
						this.setStyle("opacity", a);
					}
				},
				unselectable: function() {
					this.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select", "none"));
					if (CKEDITOR.env.ie) {
						this.setAttribute("unselectable", "on");
						var a;
						var c = this.getElementsByTag("*");
						var b = 0;
						var d = c.count();
						for (; b < d; b++) {
							a = c.getItem(b);
							a.setAttribute("unselectable", "on");
						}
					}
				},
				getPositionedAncestor: function() {
					var a = this;
					for (; a.getName() != "html";) {
						if (a.getComputedStyle("position") != "static") {
							return a;
						}
						a = a.getParent();
					}
					return null;
				},
				getDocumentPosition: function(a) {
					var c = 0;
					var b = 0;
					var d = this.getDocument();
					var e = d.getBody();
					var i = d.$.compatMode == "BackCompat";
					if (document.documentElement.getBoundingClientRect) {
						var k = this.$.getBoundingClientRect();
						var n = d.$.documentElement;
						var o = n.clientTop || (e.$.clientTop || 0);
						var r = n.clientLeft || (e.$.clientLeft || 0);
						var l = true;
						if (CKEDITOR.env.ie) {
							l = d.getDocumentElement().contains(this);
							d = d.getBody().contains(this);
							l = i && d || !i && l;
						}
						if (l) {
							c = k.left + (!i && n.scrollLeft || e.$.scrollLeft);
							c = c - r;
							b = k.top + (!i && n.scrollTop || e.$.scrollTop);
							b = b - o;
						}
					} else {
						e = this;
						d = null;
						for (; e && !(e.getName() == "body" || e.getName() == "html");) {
							c = c + (e.$.offsetLeft - e.$.scrollLeft);
							b = b + (e.$.offsetTop - e.$.scrollTop);
							if (!e.equals(this)) {
								c = c + (e.$.clientLeft || 0);
								b = b + (e.$.clientTop || 0);
							}
							for (; d && !d.equals(e);) {
								c = c - d.$.scrollLeft;
								b = b - d.$.scrollTop;
								d = d.getParent();
							}
							d = e;
							e = (k = e.$.offsetParent) ? new CKEDITOR.dom.element(k) : null;
						}
					}
					if (a) {
						e = this.getWindow();
						d = a.getWindow();
						if (!e.equals(d) && e.$.frameElement) {
							a = (new CKEDITOR.dom.element(e.$.frameElement)).getDocumentPosition(a);
							c = c + a.x;
							b = b + a.y;
						}
					}
					if (!document.documentElement.getBoundingClientRect && (CKEDITOR.env.gecko && !i)) {
						c = c + (this.$.clientLeft ? 1 : 0);
						b = b + (this.$.clientTop ? 1 : 0);
					}
					return {
						x: c,
						y: b
					};
				},
				scrollIntoView: function(a) {
					var c = this.getParent();
					if (c) {
						do {
							if (c.$.clientWidth && c.$.clientWidth < c.$.scrollWidth || c.$.clientHeight && c.$.clientHeight < c.$.scrollHeight) {
								if (!c.is("body")) {
									this.scrollIntoParent(c, a, 1);
								}
							}
							if (c.is("html")) {
								var b = c.getWindow();
								try {
									var d = b.$.frameElement;
									if (d) {
										c = new CKEDITOR.dom.element(d);
									}
								} catch (e) {}
							}
						} while (c = c.getParent());
					}
				},
				scrollIntoParent: function(a$$0, c$$0, b$$0) {
					function n(c, b) {
						if (/body|html/.test(a$$0.getName())) {
							a$$0.getWindow().$.scrollBy(c, b);
						} else {
							a$$0.$.scrollLeft = a$$0.$.scrollLeft + c;
							a$$0.$.scrollTop = a$$0.$.scrollTop + b;
						}
					}

					function o(a, c) {
						var f = {
							x: 0,
							y: 0
						};
						if (!a.is(l ? "body" : "html")) {
							var b = a.$.getBoundingClientRect();
							f.x = b.left;
							f.y = b.top;
						}
						b = a.getWindow();
						if (!b.equals(c)) {
							b = o(CKEDITOR.dom.element.get(b.$.frameElement), c);
							f.x = f.x + b.x;
							f.y = f.y + b.y;
						}
						return f;
					}

					function r(a, c) {
						return parseInt(a.getComputedStyle("margin-" + c) || 0, 10) || 0;
					}
					var d;
					var e;
					var i;
					var k;
					if (!a$$0) {
						a$$0 = this.getWindow();
					}
					i = a$$0.getDocument();
					var l = i.$.compatMode == "BackCompat";
					if (a$$0 instanceof CKEDITOR.dom.window) {
						a$$0 = l ? i.getBody() : i.getDocumentElement();
					}
					i = a$$0.getWindow();
					e = o(this, i);
					var m = o(a$$0, i);
					var s = this.$.offsetHeight;
					d = this.$.offsetWidth;
					var t = a$$0.$.clientHeight;
					var p = a$$0.$.clientWidth;
					i = e.x - r(this, "left") - m.x || 0;
					k = e.y - r(this, "top") - m.y || 0;
					d = e.x + d + r(this, "right") - (m.x + p) || 0;
					e = e.y + s + r(this, "bottom") - (m.y + t) || 0;
					if (k < 0 || e > 0) {
						n(0, c$$0 === true ? k : c$$0 === false ? e : k < 0 ? k : e);
					}
					if (b$$0 && (i < 0 || d > 0)) {
						n(i < 0 ? i : d, 0);
					}
				},
				setState: function(a, c, b) {
					c = c || "cke";
					switch (a) {
						case CKEDITOR.TRISTATE_ON:
							this.addClass(c + "_on");
							this.removeClass(c + "_off");
							this.removeClass(c + "_disabled");
							if (b) {
								this.setAttribute("aria-pressed", true);
							}
							if (b) {
								this.removeAttribute("aria-disabled");
							}
							break;
						case CKEDITOR.TRISTATE_DISABLED:
							this.addClass(c + "_disabled");
							this.removeClass(c + "_off");
							this.removeClass(c + "_on");
							if (b) {
								this.setAttribute("aria-disabled", true);
							}
							if (b) {
								this.removeAttribute("aria-pressed");
							}
							break;
						default:
							this.addClass(c + "_off");
							this.removeClass(c + "_on");
							this.removeClass(c + "_disabled");
							if (b) {
								this.removeAttribute("aria-pressed");
							}
							if (b) {
								this.removeAttribute("aria-disabled");
							};
					}
				},
				getFrameDocument: function() {
					var a = this.$;
					try {
						a.contentWindow.document;
					} catch (c) {
						a.src = a.src;
					}
					return a && new CKEDITOR.dom.document(a.contentWindow.document);
				},
				copyAttributes: function(a, c) {
					var b = this.$.attributes;
					c = c || {};
					var d = 0;
					for (; d < b.length; d++) {
						var e = b[d];
						var i = e.nodeName.toLowerCase();
						var k;
						if (!(i in c)) {
							if (i == "checked" && (k = this.getAttribute(i))) {
								a.setAttribute(i, k);
							} else {
								if (!CKEDITOR.env.ie || this.hasAttribute(i)) {
									k = this.getAttribute(i);
									if (k === null) {
										k = e.nodeValue;
									}
									a.setAttribute(i, k);
								}
							}
						}
					}
					if (this.$.style.cssText !== "") {
						a.$.style.cssText = this.$.style.cssText;
					}
				},
				renameNode: function(a) {
					if (this.getName() != a) {
						var c = this.getDocument();
						a = new CKEDITOR.dom.element(a, c);
						this.copyAttributes(a);
						this.moveChildren(a);
						if (this.getParent()) {
							this.$.parentNode.replaceChild(a.$, this.$);
						}
						a.$["data-cke-expando"] = this.$["data-cke-expando"];
						this.$ = a.$;
						delete this.getName;
					}
				},
				getChild: function() {
					function a(c, b) {
						var f = c.childNodes;
						if (b >= 0 && b < f.length) {
							return f[b];
						}
					}
					return function(c) {
						var b = this.$;
						if (c.slice) {
							for (; c.length > 0 && b;) {
								b = a(b, c.shift());
							}
						} else {
							b = a(b, c);
						}
						return b ? new CKEDITOR.dom.node(b) : null;
					};
				}(),
				getChildCount: function() {
					return this.$.childNodes.length;
				},
				disableContextMenu: function() {
					this.on("contextmenu", function(a) {
						if (!a.data.getTarget().hasClass("cke_enable_context_menu")) {
							a.data.preventDefault();
						}
					});
				},
				getDirection: function(a) {
					return a ? this.getComputedStyle("direction") || (this.getDirection() || (this.getParent() && this.getParent().getDirection(1) || (this.getDocument().$.dir || "ltr"))) : this.getStyle("direction") || this.getAttribute("dir");
				},
				data: function(a, b) {
					a = "data-" + a;
					if (b === void 0) {
						return this.getAttribute(a);
					}
					if (b === false) {
						this.removeAttribute(a);
					} else {
						this.setAttribute(a, b);
					}
					return null;
				},
				getEditor: function() {
					var a = CKEDITOR.instances;
					var b;
					var d;
					for (b in a) {
						d = a[b];
						if (d.element.equals(this) && d.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
							return d;
						}
					}
					return null;
				},
				find: function(b) {
					var c = a$$1(this);
					b = new CKEDITOR.dom.nodeList(this.$.querySelectorAll(e$$0(this, b)));
					c();
					return b;
				},
				findOne: function(b) {
					var c = a$$1(this);
					b = this.$.querySelector(e$$0(this, b));
					c();
					return b ? new CKEDITOR.dom.element(b) : null;
				},
				forEach: function(a, b, d) {
					if (!d && (!b || this.type == b)) {
						var e = a(this)
					}
					if (e !== false) {
						d = this.getChildren();
						var g = 0;
						for (; g < d.count(); g++) {
							e = d.getItem(g);
							if (e.type == CKEDITOR.NODE_ELEMENT) {
								e.forEach(a, b);
							} else {
								if (!b || e.type == b) {
									a(e);
								}
							}
						}
					}
				}
			});
			var d$$0 = {
				width: ["border-left-width", "border-right-width", "padding-left", "padding-right"],
				height: ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom"]
			};
			CKEDITOR.dom.element.prototype.setSize = function(a, c, d) {
				if (typeof c == "number") {
					if (d && (!CKEDITOR.env.ie || !CKEDITOR.env.quirks)) {
						c = c - b$$1.call(this, a);
					}
					this.setStyle(a, c + "px");
				}
			};
			CKEDITOR.dom.element.prototype.getSize = function(a, c) {
				var d = Math.max(this.$["offset" + CKEDITOR.tools.capitalize(a)], this.$["client" + CKEDITOR.tools.capitalize(a)]) || 0;
				if (c) {
					d = d - b$$1.call(this, a);
				}
				return d;
			};
		})();
		CKEDITOR.dom.documentFragment = function(a) {
			a = a || CKEDITOR.document;
			this.$ = a.type == CKEDITOR.NODE_DOCUMENT ? a.$.createDocumentFragment() : a;
		};
		CKEDITOR.tools.extend(CKEDITOR.dom.documentFragment.prototype, CKEDITOR.dom.element.prototype, {
			type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
			insertAfterNode: function(a) {
				a = a.$;
				a.parentNode.insertBefore(this.$, a.nextSibling);
			}
		}, true, {
			append: 1,
			appendBogus: 1,
			getFirst: 1,
			getLast: 1,
			getParent: 1,
			getNext: 1,
			getPrevious: 1,
			appendTo: 1,
			moveChildren: 1,
			insertBefore: 1,
			insertAfterNode: 1,
			replace: 1,
			trim: 1,
			type: 1,
			ltrim: 1,
			rtrim: 1,
			getDocument: 1,
			getChildCount: 1,
			getChild: 1,
			getChildren: 1
		});
		(function() {
			function a$$1(a$$0, b$$0) {
				var c = this.range;
				if (this._.end) {
					return null;
				}
				if (!this._.start) {
					this._.start = 1;
					if (c.collapsed) {
						this.end();
						return null;
					}
					c.optimize();
				}
				var d;
				var f = c.startContainer;
				d = c.endContainer;
				var e = c.startOffset;
				var k = c.endOffset;
				var g;
				var h = this.guard;
				var j = this.type;
				var i = a$$0 ? "getPreviousSourceNode" : "getNextSourceNode";
				if (!a$$0 && !this._.guardLTR) {
					var B = d.type == CKEDITOR.NODE_ELEMENT ? d : d.getParent();
					var v = d.type == CKEDITOR.NODE_ELEMENT ? d.getChild(k) : d.getNext();
					this._.guardLTR = function(a, b) {
						return (!b || !B.equals(a)) && ((!v || !a.equals(v)) && (a.type != CKEDITOR.NODE_ELEMENT || (!b || !a.equals(c.root))));
					};
				}
				if (a$$0 && !this._.guardRTL) {
					var z = f.type == CKEDITOR.NODE_ELEMENT ? f : f.getParent();
					var w = f.type == CKEDITOR.NODE_ELEMENT ? e ? f.getChild(e - 1) : null : f.getPrevious();
					this._.guardRTL = function(a, b) {
						return (!b || !z.equals(a)) && ((!w || !a.equals(w)) && (a.type != CKEDITOR.NODE_ELEMENT || (!b || !a.equals(c.root))));
					};
				}
				var D = a$$0 ? this._.guardRTL : this._.guardLTR;
				g = h ? function(a, b) {
					return D(a, b) === false ? false : h(a, b);
				} : D;
				if (this.current) {
					d = this.current[i](false, j, g);
				} else {
					if (a$$0) {
						if (d.type == CKEDITOR.NODE_ELEMENT) {
							d = k > 0 ? d.getChild(k - 1) : g(d, true) === false ? null : d.getPreviousSourceNode(true, j, g);
						}
					} else {
						d = f;
						if (d.type == CKEDITOR.NODE_ELEMENT && !(d = d.getChild(e))) {
							d = g(f, true) === false ? null : f.getNextSourceNode(true, j, g);
						}
					}
					if (d) {
						if (g(d) === false) {
							d = null;
						}
					}
				}
				for (; d && !this._.end;) {
					this.current = d;
					if (!this.evaluator || this.evaluator(d) !== false) {
						if (!b$$0) {
							return d;
						}
					} else {
						if (b$$0 && this.evaluator) {
							return false;
						}
					}
					d = d[i](false, j, g);
				}
				this.end();
				return this.current = null;
			}

			function e$$0(b) {
				var c;
				var d = null;
				for (; c = a$$1.call(this, b);) {
					d = c;
				}
				return d;
			}

			function b$$1(a) {
				if (i$$0(a)) {
					return false;
				}
				if (a.type == CKEDITOR.NODE_TEXT) {
					return true;
				}
				if (a.type == CKEDITOR.NODE_ELEMENT) {
					if (a.is(CKEDITOR.dtd.$inline) || (a.is("hr") || a.getAttribute("contenteditable") == "false")) {
						return true;
					}
					var b;
					if (b = !CKEDITOR.env.needsBrFiller) {
						if (b = a.is(k$$0)) {
							a: {
								b = 0;
								var c = a.getChildCount();
								for (; b < c; ++b) {
									if (!i$$0(a.getChild(b))) {
										b = false;
										break a;
									}
								}
								b = true;
							}
						}
					}
					if (b) {
						return true;
					}
				}
				return false;
			}
			CKEDITOR.dom.walker = CKEDITOR.tools.createClass({
				$: function(a) {
					this.range = a;
					this._ = {};
				},
				proto: {
					end: function() {
						this._.end = 1;
					},
					next: function() {
						return a$$1.call(this);
					},
					previous: function() {
						return a$$1.call(this, 1);
					},
					checkForward: function() {
						return a$$1.call(this, 0, 1) !== false;
					},
					checkBackward: function() {
						return a$$1.call(this, 1, 1) !== false;
					},
					lastForward: function() {
						return e$$0.call(this);
					},
					lastBackward: function() {
						return e$$0.call(this, 1);
					},
					reset: function() {
						delete this.current;
						this._ = {};
					}
				}
			});
			var d$$0 = {
				block: 1,
				"list-item": 1,
				table: 1,
				"table-row-group": 1,
				"table-header-group": 1,
				"table-footer-group": 1,
				"table-row": 1,
				"table-column-group": 1,
				"table-column": 1,
				"table-cell": 1,
				"table-caption": 1
			};
			var f$$0 = {
				absolute: 1,
				fixed: 1
			};
			CKEDITOR.dom.element.prototype.isBlockBoundary = function(a) {
				return this.getComputedStyle("float") == "none" && (!(this.getComputedStyle("position") in f$$0) && d$$0[this.getComputedStyle("display")]) ? true : !!(this.is(CKEDITOR.dtd.$block) || a && this.is(a));
			};
			CKEDITOR.dom.walker.blockBoundary = function(a) {
				return function(b) {
					return !(b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary(a));
				};
			};
			CKEDITOR.dom.walker.listItemBoundary = function() {
				return this.blockBoundary({
					br: 1
				});
			};
			CKEDITOR.dom.walker.bookmark = function(a$$0, b) {
				function c(a) {
					return a && (a.getName && (a.getName() == "span" && a.data("cke-bookmark")));
				}
				return function(d) {
					var f;
					var e;
					f = d && (d.type != CKEDITOR.NODE_ELEMENT && ((e = d.getParent()) && c(e)));
					f = a$$0 ? f : f || c(d);
					return !!(b ^ f);
				};
			};
			CKEDITOR.dom.walker.whitespaces = function(a) {
				return function(b) {
					var c;
					if (b) {
						if (b.type == CKEDITOR.NODE_TEXT) {
							c = !CKEDITOR.tools.trim(b.getText()) || CKEDITOR.env.webkit && b.getText() == "\u200b";
						}
					}
					return !!(a ^ c);
				};
			};
			CKEDITOR.dom.walker.invisible = function(a) {
				var b = CKEDITOR.dom.walker.whitespaces();
				return function(c) {
					if (b(c)) {
						c = 1;
					} else {
						if (c.type == CKEDITOR.NODE_TEXT) {
							c = c.getParent();
						}
						c = !c.$.offsetHeight;
					}
					return !!(a ^ c);
				};
			};
			CKEDITOR.dom.walker.nodeType = function(a, b) {
				return function(c) {
					return !!(b ^ c.type == a);
				};
			};
			CKEDITOR.dom.walker.bogus = function(a$$0) {
				function b(a) {
					return !h$$0(a) && !j$$0(a);
				}
				return function(d) {
					var f = CKEDITOR.env.needsBrFiller ? d.is && d.is("br") : d.getText && c$$0.test(d.getText());
					if (f) {
						f = d.getParent();
						d = d.getNext(b);
						f = f.isBlockBoundary() && (!d || d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary());
					}
					return !!(a$$0 ^ f);
				};
			};
			CKEDITOR.dom.walker.temp = function(a) {
				return function(b) {
					if (b.type != CKEDITOR.NODE_ELEMENT) {
						b = b.getParent();
					}
					b = b && b.hasAttribute("data-cke-temp");
					return !!(a ^ b);
				};
			};
			var c$$0 = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/;
			var h$$0 = CKEDITOR.dom.walker.whitespaces();
			var j$$0 = CKEDITOR.dom.walker.bookmark();
			var g$$0 = CKEDITOR.dom.walker.temp();
			CKEDITOR.dom.walker.ignored = function(a) {
				return function(b) {
					b = h$$0(b) || (j$$0(b) || g$$0(b));
					return !!(a ^ b);
				};
			};
			var i$$0 = CKEDITOR.dom.walker.ignored();
			var k$$0 = function(a) {
				var b = {};
				var c;
				for (c in a) {
					if (CKEDITOR.dtd[c]["#"]) {
						b[c] = 1;
					}
				}
				return b;
			}(CKEDITOR.dtd.$block);
			CKEDITOR.dom.walker.editable = function(a) {
				return function(c) {
					return !!(a ^ b$$1(c));
				};
			};
			CKEDITOR.dom.element.prototype.getBogus = function() {
				var a = this;
				do {
					a = a.getPreviousSourceNode();
				} while (j$$0(a) || (h$$0(a) || a.type == CKEDITOR.NODE_ELEMENT && (a.is(CKEDITOR.dtd.$inline) && !a.is(CKEDITOR.dtd.$empty))));
				return a && (CKEDITOR.env.needsBrFiller ? a.is && a.is("br") : a.getText && c$$0.test(a.getText())) ? a : false;
			};
		})();
		CKEDITOR.dom.range = function(a) {
			this.endOffset = this.endContainer = this.startOffset = this.startContainer = null;
			this.collapsed = true;
			var e = a instanceof CKEDITOR.dom.document;
			this.document = e ? a : a.getDocument();
			this.root = e ? a.getBody() : a;
		};
		(function() {
			function a$$2() {
				var a = false;
				var b = CKEDITOR.dom.walker.whitespaces();
				var d = CKEDITOR.dom.walker.bookmark(true);
				var f = CKEDITOR.dom.walker.bogus();
				return function(e) {
					if (d(e) || b(e)) {
						return true;
					}
					if (f(e) && !a) {
						return a = true;
					}
					return e.type == CKEDITOR.NODE_TEXT && (e.hasAscendant("pre") || CKEDITOR.tools.trim(e.getText()).length) || e.type == CKEDITOR.NODE_ELEMENT && !e.is(c$$1) ? false : true;
				};
			}

			function e$$0(a) {
				var b = CKEDITOR.dom.walker.whitespaces();
				var c = CKEDITOR.dom.walker.bookmark(1);
				return function(d) {
					return c(d) || b(d) ? true : !a && h$$0(d) || d.type == CKEDITOR.NODE_ELEMENT && d.is(CKEDITOR.dtd.$removeEmpty);
				};
			}

			function b$$1(a$$0) {
				return function() {
					var b;
					return this[a$$0 ? "getPreviousNode" : "getNextNode"](function(a) {
						if (!b) {
							if (i$$0(a)) {
								b = a;
							}
						}
						return g$$0(a) && !(h$$0(a) && a.equals(b));
					});
				};
			}
			var d$$1 = function(a) {
				a.collapsed = a.startContainer && (a.endContainer && (a.startContainer.equals(a.endContainer) && a.startOffset == a.endOffset));
			};
			var f$$1 = function(a, b, c, d) {
				a.optimizeBookmark();
				var f = a.startContainer;
				var e = a.endContainer;
				var g = a.startOffset;
				var h = a.endOffset;
				var j;
				var i;
				if (e.type == CKEDITOR.NODE_TEXT) {
					e = e.split(h);
				} else {
					if (e.getChildCount() > 0) {
						if (h >= e.getChildCount()) {
							e = e.append(a.document.createText(""));
							i = true;
						} else {
							e = e.getChild(h);
						}
					}
				}
				if (f.type == CKEDITOR.NODE_TEXT) {
					f.split(g);
					if (f.equals(e)) {
						e = f.getNext();
					}
				} else {
					if (g) {
						if (g >= f.getChildCount()) {
							f = f.append(a.document.createText(""));
							j = true;
						} else {
							f = f.getChild(g).getPrevious();
						}
					} else {
						f = f.append(a.document.createText(""), 1);
						j = true;
					}
				}
				g = f.getParents();
				h = e.getParents();
				var q;
				var u;
				var B;
				q = 0;
				for (; q < g.length; q++) {
					u = g[q];
					B = h[q];
					if (!u.equals(B)) {
						break;
					}
				}
				var v = c;
				var z;
				var w;
				var D;
				var A = q;
				for (; A < g.length; A++) {
					z = g[A];
					if (v) {
						if (!z.equals(f)) {
							w = v.append(z.clone());
						}
					}
					z = z.getNext();
					for (; z;) {
						if (z.equals(h[A]) || z.equals(e)) {
							break;
						}
						D = z.getNext();
						if (b == 2) {
							v.append(z.clone(true));
						} else {
							z.remove();
							if (b == 1) {
								v.append(z);
							}
						}
						z = D;
					}
					if (v) {
						v = w;
					}
				}
				v = c;
				c = q;
				for (; c < h.length; c++) {
					z = h[c];
					if (b > 0) {
						if (!z.equals(e)) {
							w = v.append(z.clone());
						}
					}
					if (!g[c] || z.$.parentNode != g[c].$.parentNode) {
						z = z.getPrevious();
						for (; z;) {
							if (z.equals(g[c]) || z.equals(f)) {
								break;
							}
							D = z.getPrevious();
							if (b == 2) {
								v.$.insertBefore(z.$.cloneNode(true), v.$.firstChild);
							} else {
								z.remove();
								if (b == 1) {
									v.$.insertBefore(z.$, v.$.firstChild);
								}
							}
							z = D;
						}
					}
					if (v) {
						v = w;
					}
				}
				if (b == 2) {
					u = a.startContainer;
					if (u.type == CKEDITOR.NODE_TEXT) {
						u.$.data = u.$.data + u.$.nextSibling.data;
						u.$.parentNode.removeChild(u.$.nextSibling);
					}
					a = a.endContainer;
					if (a.type == CKEDITOR.NODE_TEXT && a.$.nextSibling) {
						a.$.data = a.$.data + a.$.nextSibling.data;
						a.$.parentNode.removeChild(a.$.nextSibling);
					}
				} else {
					if (u && (B && (f.$.parentNode != u.$.parentNode || e.$.parentNode != B.$.parentNode))) {
						b = B.getIndex();
						if (j) {
							if (B.$.parentNode == f.$.parentNode) {
								b--;
							}
						}
						if (d && u.type == CKEDITOR.NODE_ELEMENT) {
							d = CKEDITOR.dom.element.createFromHtml('<span data-cke-bookmark="1" style="display:none">&nbsp;</span>', a.document);
							d.insertAfter(u);
							u.mergeSiblings(false);
							a.moveToBookmark({
								startNode: d
							});
						} else {
							a.setStart(B.getParent(), b);
						}
					}
					a.collapse(true);
				}
				if (j) {
					f.remove();
				}
				if (i) {
					if (e.$.parentNode) {
						e.remove();
					}
				}
			};
			var c$$1 = {
				abbr: 1,
				acronym: 1,
				b: 1,
				bdo: 1,
				big: 1,
				cite: 1,
				code: 1,
				del: 1,
				dfn: 1,
				em: 1,
				font: 1,
				i: 1,
				ins: 1,
				label: 1,
				kbd: 1,
				q: 1,
				samp: 1,
				small: 1,
				span: 1,
				strike: 1,
				strong: 1,
				sub: 1,
				sup: 1,
				tt: 1,
				u: 1,
				"var": 1
			};
			var h$$0 = CKEDITOR.dom.walker.bogus();
			var j$$0 = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/;
			var g$$0 = CKEDITOR.dom.walker.editable();
			var i$$0 = CKEDITOR.dom.walker.ignored(true);
			CKEDITOR.dom.range.prototype = {
				clone: function() {
					var a = new CKEDITOR.dom.range(this.root);
					a.startContainer = this.startContainer;
					a.startOffset = this.startOffset;
					a.endContainer = this.endContainer;
					a.endOffset = this.endOffset;
					a.collapsed = this.collapsed;
					return a;
				},
				collapse: function(a) {
					if (a) {
						this.endContainer = this.startContainer;
						this.endOffset = this.startOffset;
					} else {
						this.startContainer = this.endContainer;
						this.startOffset = this.endOffset;
					}
					this.collapsed = true;
				},
				cloneContents: function() {
					var a = new CKEDITOR.dom.documentFragment(this.document);
					if (!this.collapsed) {
						f$$1(this, 2, a);
					}
					return a;
				},
				deleteContents: function(a) {
					if (!this.collapsed) {
						f$$1(this, 0, null, a);
					}
				},
				extractContents: function(a) {
					var b = new CKEDITOR.dom.documentFragment(this.document);
					if (!this.collapsed) {
						f$$1(this, 1, b, a);
					}
					return b;
				},
				createBookmark: function(a) {
					var b;
					var c;
					var d;
					var f;
					var e = this.collapsed;
					b = this.document.createElement("span");
					b.data("cke-bookmark", 1);
					b.setStyle("display", "none");
					b.setHtml("&nbsp;");
					if (a) {
						d = "cke_bm_" + CKEDITOR.tools.getNextNumber();
						b.setAttribute("id", d + (e ? "C" : "S"));
					}
					if (!e) {
						c = b.clone();
						c.setHtml("&nbsp;");
						if (a) {
							c.setAttribute("id", d + "E");
						}
						f = this.clone();
						f.collapse();
						f.insertNode(c);
					}
					f = this.clone();
					f.collapse(true);
					f.insertNode(b);
					if (c) {
						this.setStartAfter(b);
						this.setEndBefore(c);
					} else {
						this.moveToPosition(b, CKEDITOR.POSITION_AFTER_END);
					}
					return {
						startNode: a ? d + (e ? "C" : "S") : b,
						endNode: a ? d + "E" : c,
						serializable: a,
						collapsed: e
					};
				},
				createBookmark2: function() {
					function a(b) {
						var c = b.container;
						var d = b.offset;
						var f;
						f = c;
						var e = d;
						f = f.type != CKEDITOR.NODE_ELEMENT || (e === 0 || e == f.getChildCount()) ? 0 : f.getChild(e - 1).type == CKEDITOR.NODE_TEXT && f.getChild(e).type == CKEDITOR.NODE_TEXT;
						if (f) {
							c = c.getChild(d - 1);
							d = c.getLength();
						}
						if (c.type == CKEDITOR.NODE_ELEMENT) {
							if (d > 1) {
								d = c.getChild(d - 1).getIndex(true) + 1;
							}
						}
						if (c.type == CKEDITOR.NODE_TEXT) {
							f = c;
							e = 0;
							for (;
								(f = f.getPrevious()) && f.type == CKEDITOR.NODE_TEXT;) {
								e = e + f.getLength();
							}
							d = d + e;
						}
						b.container = c;
						b.offset = d;
					}
					return function(b) {
						var c = this.collapsed;
						var d = {
							container: this.startContainer,
							offset: this.startOffset
						};
						var f = {
							container: this.endContainer,
							offset: this.endOffset
						};
						if (b) {
							a(d);
							if (!c) {
								a(f);
							}
						}
						return {
							start: d.container.getAddress(b),
							end: c ? null : f.container.getAddress(b),
							startOffset: d.offset,
							endOffset: f.offset,
							normalized: b,
							collapsed: c,
							is2: true
						};
					};
				}(),
				moveToBookmark: function(a) {
					if (a.is2) {
						var b = this.document.getByAddress(a.start, a.normalized);
						var c = a.startOffset;
						var d = a.end && this.document.getByAddress(a.end, a.normalized);
						a = a.endOffset;
						this.setStart(b, c);
						if (d) {
							this.setEnd(d, a);
						} else {
							this.collapse(true);
						}
					} else {
						b = (c = a.serializable) ? this.document.getById(a.startNode) : a.startNode;
						a = c ? this.document.getById(a.endNode) : a.endNode;
						this.setStartBefore(b);
						b.remove();
						if (a) {
							this.setEndBefore(a);
							a.remove();
						} else {
							this.collapse(true);
						}
					}
				},
				getBoundaryNodes: function() {
					var a = this.startContainer;
					var b = this.endContainer;
					var c = this.startOffset;
					var d = this.endOffset;
					var f;
					if (a.type == CKEDITOR.NODE_ELEMENT) {
						f = a.getChildCount();
						if (f > c) {
							a = a.getChild(c);
						} else {
							if (f < 1) {
								a = a.getPreviousSourceNode();
							} else {
								a = a.$;
								for (; a.lastChild;) {
									a = a.lastChild;
								}
								a = new CKEDITOR.dom.node(a);
								a = a.getNextSourceNode() || a;
							}
						}
					}
					if (b.type == CKEDITOR.NODE_ELEMENT) {
						f = b.getChildCount();
						if (f > d) {
							b = b.getChild(d).getPreviousSourceNode(true);
						} else {
							if (f < 1) {
								b = b.getPreviousSourceNode();
							} else {
								b = b.$;
								for (; b.lastChild;) {
									b = b.lastChild;
								}
								b = new CKEDITOR.dom.node(b);
							}
						}
					}
					if (a.getPosition(b) & CKEDITOR.POSITION_FOLLOWING) {
						a = b;
					}
					return {
						startNode: a,
						endNode: b
					};
				},
				getCommonAncestor: function(a, b) {
					var c = this.startContainer;
					var d = this.endContainer;
					c = c.equals(d) ? a && (c.type == CKEDITOR.NODE_ELEMENT && this.startOffset == this.endOffset - 1) ? c.getChild(this.startOffset) : c : c.getCommonAncestor(d);
					return b && !c.is ? c.getParent() : c;
				},
				optimize: function() {
					var a = this.startContainer;
					var b = this.startOffset;
					if (a.type != CKEDITOR.NODE_ELEMENT) {
						if (b) {
							if (b >= a.getLength()) {
								this.setStartAfter(a);
							}
						} else {
							this.setStartBefore(a);
						}
					}
					a = this.endContainer;
					b = this.endOffset;
					if (a.type != CKEDITOR.NODE_ELEMENT) {
						if (b) {
							if (b >= a.getLength()) {
								this.setEndAfter(a);
							}
						} else {
							this.setEndBefore(a);
						}
					}
				},
				optimizeBookmark: function() {
					var a = this.startContainer;
					var b = this.endContainer;
					if (a.is) {
						if (a.is("span") && a.data("cke-bookmark")) {
							this.setStartAt(a, CKEDITOR.POSITION_BEFORE_START);
						}
					}
					if (b) {
						if (b.is && (b.is("span") && b.data("cke-bookmark"))) {
							this.setEndAt(b, CKEDITOR.POSITION_AFTER_END);
						}
					}
				},
				trim: function(a, b) {
					var c = this.startContainer;
					var d = this.startOffset;
					var f = this.collapsed;
					if ((!a || f) && (c && c.type == CKEDITOR.NODE_TEXT)) {
						if (d) {
							if (d >= c.getLength()) {
								d = c.getIndex() + 1;
								c = c.getParent();
							} else {
								var e = c.split(d);
								d = c.getIndex() + 1;
								c = c.getParent();
								if (this.startContainer.equals(this.endContainer)) {
									this.setEnd(e, this.endOffset - this.startOffset);
								} else {
									if (c.equals(this.endContainer)) {
										this.endOffset = this.endOffset + 1;
									}
								}
							}
						} else {
							d = c.getIndex();
							c = c.getParent();
						}
						this.setStart(c, d);
						if (f) {
							this.collapse(true);
							return;
						}
					}
					c = this.endContainer;
					d = this.endOffset;
					if (!b && (!f && (c && c.type == CKEDITOR.NODE_TEXT))) {
						if (d) {
							if (!(d >= c.getLength())) {
								c.split(d);
							}
							d = c.getIndex() + 1;
						} else {
							d = c.getIndex();
						}
						c = c.getParent();
						this.setEnd(c, d);
					}
				},
				enlarge: function(a$$1, b$$0) {
					function c$$0(a) {
						return a && (a.type == CKEDITOR.NODE_ELEMENT && a.hasAttribute("contenteditable")) ? null : a;
					}
					var d = RegExp(/[^\s\ufeff]/);
					switch (a$$1) {
						case CKEDITOR.ENLARGE_INLINE:
							var f$$0 = 1;
						case CKEDITOR.ENLARGE_ELEMENT:
							if (this.collapsed) {
								break;
							}
							var e = this.getCommonAncestor();
							var g = this.root;
							var h;
							var j;
							var i;
							var q;
							var u;
							var B = false;
							var v;
							var z;
							v = this.startContainer;
							var w = this.startOffset;
							if (v.type == CKEDITOR.NODE_TEXT) {
								if (w) {
									v = !CKEDITOR.tools.trim(v.substring(0, w)).length && v;
									B = !!v;
								}
								if (v && !(q = v.getPrevious())) {
									i = v.getParent();
								}
							} else {
								if (w) {
									q = v.getChild(w - 1) || v.getLast();
								}
								if (!q) {
									i = v;
								}
							}
							i = c$$0(i);
							for (; i || q;) {
								if (i && !q) {
									if (!u) {
										if (i.equals(e)) {
											u = true;
										}
									}
									if (f$$0 ? i.isBlockBoundary() : !g.contains(i)) {
										break;
									}
									if (!B || i.getComputedStyle("display") != "inline") {
										B = false;
										if (u) {
											h = i;
										} else {
											this.setStartBefore(i);
										}
									}
									q = i.getPrevious();
								}
								for (; q;) {
									v = false;
									if (q.type == CKEDITOR.NODE_COMMENT) {
										q = q.getPrevious();
									} else {
										if (q.type == CKEDITOR.NODE_TEXT) {
											z = q.getText();
											if (d.test(z)) {
												q = null;
											}
											v = /[\s\ufeff]$/.test(z);
										} else {
											if ((q.$.offsetWidth > 0 || b$$0 && q.is("br")) && !q.data("cke-bookmark")) {
												if (B && CKEDITOR.dtd.$removeEmpty[q.getName()]) {
													z = q.getText();
													if (d.test(z)) {
														q = null;
													} else {
														w = q.$.getElementsByTagName("*");
														var D = 0;
														var A;
														for (; A = w[D++];) {
															if (!CKEDITOR.dtd.$removeEmpty[A.nodeName.toLowerCase()]) {
																q = null;
																break;
															}
														}
													}
													if (q) {
														v = !!z.length;
													}
												} else {
													q = null;
												}
											}
										}
										if (v) {
											if (B) {
												if (u) {
													h = i;
												} else {
													if (i) {
														this.setStartBefore(i);
													}
												}
											} else {
												B = true;
											}
										}
										if (q) {
											v = q.getPrevious();
											if (!i && !v) {
												i = q;
												q = null;
												break;
											}
											q = v;
										} else {
											i = null;
										}
									}
								}
								if (i) {
									i = c$$0(i.getParent());
								}
							}
							v = this.endContainer;
							w = this.endOffset;
							i = q = null;
							u = B = false;
							var I = function(a$$0, b) {
								var c = new CKEDITOR.dom.range(g);
								c.setStart(a$$0, b);
								c.setEndAt(g, CKEDITOR.POSITION_BEFORE_END);
								c = new CKEDITOR.dom.walker(c);
								var f;
								c.guard = function(a) {
									return !(a.type == CKEDITOR.NODE_ELEMENT && a.isBlockBoundary());
								};
								for (; f = c.next();) {
									if (f.type != CKEDITOR.NODE_TEXT) {
										return false;
									}
									z = f != a$$0 ? f.getText() : f.substring(b);
									if (d.test(z)) {
										return false;
									}
								}
								return true;
							};
							if (v.type == CKEDITOR.NODE_TEXT) {
								if (CKEDITOR.tools.trim(v.substring(w)).length) {
									B = true;
								} else {
									B = !v.getLength();
									if (w == v.getLength()) {
										if (!(q = v.getNext())) {
											i = v.getParent();
										}
									} else {
										if (I(v, w)) {
											i = v.getParent();
										}
									}
								}
							} else {
								if (!(q = v.getChild(w))) {
									i = v;
								}
							}
							for (; i || q;) {
								if (i && !q) {
									if (!u) {
										if (i.equals(e)) {
											u = true;
										}
									}
									if (f$$0 ? i.isBlockBoundary() : !g.contains(i)) {
										break;
									}
									if (!B || i.getComputedStyle("display") != "inline") {
										B = false;
										if (u) {
											j = i;
										} else {
											if (i) {
												this.setEndAfter(i);
											}
										}
									}
									q = i.getNext();
								}
								for (; q;) {
									v = false;
									if (q.type == CKEDITOR.NODE_TEXT) {
										z = q.getText();
										if (!I(q, 0)) {
											q = null;
										}
										v = /^[\s\ufeff]/.test(z);
									} else {
										if (q.type == CKEDITOR.NODE_ELEMENT) {
											if ((q.$.offsetWidth > 0 || b$$0 && q.is("br")) && !q.data("cke-bookmark")) {
												if (B && CKEDITOR.dtd.$removeEmpty[q.getName()]) {
													z = q.getText();
													if (d.test(z)) {
														q = null;
													} else {
														w = q.$.getElementsByTagName("*");
														D = 0;
														for (; A = w[D++];) {
															if (!CKEDITOR.dtd.$removeEmpty[A.nodeName.toLowerCase()]) {
																q = null;
																break;
															}
														}
													}
													if (q) {
														v = !!z.length;
													}
												} else {
													q = null;
												}
											}
										} else {
											v = 1;
										}
									}
									if (v) {
										if (B) {
											if (u) {
												j = i;
											} else {
												this.setEndAfter(i);
											}
										}
									}
									if (q) {
										v = q.getNext();
										if (!i && !v) {
											i = q;
											q = null;
											break;
										}
										q = v;
									} else {
										i = null;
									}
								}
								if (i) {
									i = c$$0(i.getParent());
								}
							}
							if (h && j) {
								e = h.contains(j) ? j : h;
								this.setStartBefore(e);
								this.setEndAfter(e);
							}
							break;
						case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
							;
						case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:
							i = new CKEDITOR.dom.range(this.root);
							g = this.root;
							i.setStartAt(g, CKEDITOR.POSITION_AFTER_START);
							i.setEnd(this.startContainer, this.startOffset);
							i = new CKEDITOR.dom.walker(i);
							var K;
							var C;
							var y = CKEDITOR.dom.walker.blockBoundary(a$$1 == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? {
								br: 1
							} : null);
							var E = null;
							var H = function(a) {
								if (a.type == CKEDITOR.NODE_ELEMENT && a.getAttribute("contenteditable") == "false") {
									if (E) {
										if (E.equals(a)) {
											E = null;
											return;
										}
									} else {
										E = a;
									}
								} else {
									if (E) {
										return;
									}
								}
								var b = y(a);
								if (!b) {
									K = a;
								}
								return b;
							};
							f$$0 = function(a) {
								var b = H(a);
								if (!b) {
									if (a.is && a.is("br")) {
										C = a;
									}
								}
								return b;
							};
							i.guard = H;
							i = i.lastBackward();
							K = K || g;
							this.setStartAt(K, !K.is("br") && (!i && this.checkStartOfBlock() || i && K.contains(i)) ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_AFTER_END);
							if (a$$1 == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS) {
								i = this.clone();
								i = new CKEDITOR.dom.walker(i);
								var F = CKEDITOR.dom.walker.whitespaces();
								var S = CKEDITOR.dom.walker.bookmark();
								i.evaluator = function(a) {
									return !F(a) && !S(a);
								};
								if ((i = i.previous()) && (i.type == CKEDITOR.NODE_ELEMENT && i.is("br"))) {
									break;
								}
							}
							i = this.clone();
							i.collapse();
							i.setEndAt(g, CKEDITOR.POSITION_BEFORE_END);
							i = new CKEDITOR.dom.walker(i);
							i.guard = a$$1 == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? f$$0 : H;
							K = E = C = null;
							i = i.lastForward();
							K = K || g;
							this.setEndAt(K, !i && this.checkEndOfBlock() || i && K.contains(i) ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_BEFORE_START);
							if (C) {
								this.setEndAfter(C);
							};
					}
				},
				shrink: function(a, b$$0, c) {
					if (!this.collapsed) {
						a = a || CKEDITOR.SHRINK_TEXT;
						var d$$0 = this.clone();
						var f = this.startContainer;
						var e = this.endContainer;
						var g = this.startOffset;
						var h = this.endOffset;
						var i = 1;
						var j = 1;
						if (f && f.type == CKEDITOR.NODE_TEXT) {
							if (g) {
								if (g >= f.getLength()) {
									d$$0.setStartAfter(f);
								} else {
									d$$0.setStartBefore(f);
									i = 0;
								}
							} else {
								d$$0.setStartBefore(f);
							}
						}
						if (e && e.type == CKEDITOR.NODE_TEXT) {
							if (h) {
								if (h >= e.getLength()) {
									d$$0.setEndAfter(e);
								} else {
									d$$0.setEndAfter(e);
									j = 0;
								}
							} else {
								d$$0.setEndBefore(e);
							}
						}
						d$$0 = new CKEDITOR.dom.walker(d$$0);
						var q = CKEDITOR.dom.walker.bookmark();
						d$$0.evaluator = function(b) {
							return b.type == (a == CKEDITOR.SHRINK_ELEMENT ? CKEDITOR.NODE_ELEMENT : CKEDITOR.NODE_TEXT);
						};
						var u;
						d$$0.guard = function(b, d) {
							if (q(b)) {
								return true;
							}
							if (a == CKEDITOR.SHRINK_ELEMENT && b.type == CKEDITOR.NODE_TEXT || (d && b.equals(u) || (c === false && (b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary()) || b.type == CKEDITOR.NODE_ELEMENT && b.hasAttribute("contenteditable")))) {
								return false;
							}
							if (!d) {
								if (b.type == CKEDITOR.NODE_ELEMENT) {
									u = b;
								}
							}
							return true;
						};
						if (i) {
							if (f = d$$0[a == CKEDITOR.SHRINK_ELEMENT ? "lastForward" : "next"]()) {
								this.setStartAt(f, b$$0 ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_START);
							}
						}
						if (j) {
							d$$0.reset();
							if (d$$0 = d$$0[a == CKEDITOR.SHRINK_ELEMENT ? "lastBackward" : "previous"]()) {
								this.setEndAt(d$$0, b$$0 ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END);
							}
						}
						return !(!i && !j);
					}
				},
				insertNode: function(a) {
					this.optimizeBookmark();
					this.trim(false, true);
					var b = this.startContainer;
					var c = b.getChild(this.startOffset);
					if (c) {
						a.insertBefore(c);
					} else {
						b.append(a);
					}
					if (a.getParent()) {
						if (a.getParent().equals(this.endContainer)) {
							this.endOffset++;
						}
					}
					this.setStartBefore(a);
				},
				moveToPosition: function(a, b) {
					this.setStartAt(a, b);
					this.collapse(true);
				},
				moveToRange: function(a) {
					this.setStart(a.startContainer, a.startOffset);
					this.setEnd(a.endContainer, a.endOffset);
				},
				selectNodeContents: function(a) {
					this.setStart(a, 0);
					this.setEnd(a, a.type == CKEDITOR.NODE_TEXT ? a.getLength() : a.getChildCount());
				},
				setStart: function(a, b) {
					if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
						b = a.getIndex();
						a = a.getParent();
					}
					this.startContainer = a;
					this.startOffset = b;
					if (!this.endContainer) {
						this.endContainer = a;
						this.endOffset = b;
					}
					d$$1(this);
				},
				setEnd: function(a, b) {
					if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
						b = a.getIndex() + 1;
						a = a.getParent();
					}
					this.endContainer = a;
					this.endOffset = b;
					if (!this.startContainer) {
						this.startContainer = a;
						this.startOffset = b;
					}
					d$$1(this);
				},
				setStartAfter: function(a) {
					this.setStart(a.getParent(), a.getIndex() + 1);
				},
				setStartBefore: function(a) {
					this.setStart(a.getParent(), a.getIndex());
				},
				setEndAfter: function(a) {
					this.setEnd(a.getParent(), a.getIndex() + 1);
				},
				setEndBefore: function(a) {
					this.setEnd(a.getParent(), a.getIndex());
				},
				setStartAt: function(a, b) {
					switch (b) {
						case CKEDITOR.POSITION_AFTER_START:
							this.setStart(a, 0);
							break;
						case CKEDITOR.POSITION_BEFORE_END:
							if (a.type == CKEDITOR.NODE_TEXT) {
								this.setStart(a, a.getLength());
							} else {
								this.setStart(a, a.getChildCount());
							}
							break;
						case CKEDITOR.POSITION_BEFORE_START:
							this.setStartBefore(a);
							break;
						case CKEDITOR.POSITION_AFTER_END:
							this.setStartAfter(a);
					}
					d$$1(this);
				},
				setEndAt: function(a, b) {
					switch (b) {
						case CKEDITOR.POSITION_AFTER_START:
							this.setEnd(a, 0);
							break;
						case CKEDITOR.POSITION_BEFORE_END:
							if (a.type == CKEDITOR.NODE_TEXT) {
								this.setEnd(a, a.getLength());
							} else {
								this.setEnd(a, a.getChildCount());
							}
							break;
						case CKEDITOR.POSITION_BEFORE_START:
							this.setEndBefore(a);
							break;
						case CKEDITOR.POSITION_AFTER_END:
							this.setEndAfter(a);
					}
					d$$1(this);
				},
				fixBlock: function(a, b) {
					var c = this.createBookmark();
					var d = this.document.createElement(b);
					this.collapse(a);
					this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
					this.extractContents().appendTo(d);
					d.trim();
					d.appendBogus();
					this.insertNode(d);
					this.moveToBookmark(c);
					return d;
				},
				splitBlock: function(a) {
					var b = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
					var c = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
					var d = b.block;
					var f = c.block;
					var e = null;
					if (!b.blockLimit.equals(c.blockLimit)) {
						return null;
					}
					if (a != "br") {
						if (!d) {
							d = this.fixBlock(true, a);
							f = (new CKEDITOR.dom.elementPath(this.endContainer, this.root)).block;
						}
						if (!f) {
							f = this.fixBlock(false, a);
						}
					}
					a = d && this.checkStartOfBlock();
					b = f && this.checkEndOfBlock();
					this.deleteContents();
					if (d && d.equals(f)) {
						if (b) {
							e = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
							this.moveToPosition(f, CKEDITOR.POSITION_AFTER_END);
							f = null;
						} else {
							if (a) {
								e = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
								this.moveToPosition(d, CKEDITOR.POSITION_BEFORE_START);
								d = null;
							} else {
								f = this.splitElement(d);
								if (!d.is("ul", "ol")) {
									d.appendBogus();
								}
							}
						}
					}
					return {
						previousBlock: d,
						nextBlock: f,
						wasStartOfBlock: a,
						wasEndOfBlock: b,
						elementPath: e
					};
				},
				splitElement: function(a) {
					if (!this.collapsed) {
						return null;
					}
					this.setEndAt(a, CKEDITOR.POSITION_BEFORE_END);
					var b = this.extractContents();
					var c = a.clone(false);
					b.appendTo(c);
					c.insertAfter(a);
					this.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
					return c;
				},
				removeEmptyBlocksAtEnd: function() {
					function a$$0(d) {
						return function(a) {
							return b$$0(a) || (c$$0(a) || a.type == CKEDITOR.NODE_ELEMENT && a.isEmptyInlineRemoveable() || d.is("table") && a.is("caption")) ? false : true;
						};
					}
					var b$$0 = CKEDITOR.dom.walker.whitespaces();
					var c$$0 = CKEDITOR.dom.walker.bookmark(false);
					return function(b) {
						var c = this.createBookmark();
						var d = this[b ? "endPath" : "startPath"]();
						var f = d.block || d.blockLimit;
						var e;
						for (; f && (!f.equals(d.root) && !f.getFirst(a$$0(f)));) {
							e = f.getParent();
							this[b ? "setEndAt" : "setStartAt"](f, CKEDITOR.POSITION_AFTER_END);
							f.remove(1);
							f = e;
						}
						this.moveToBookmark(c);
					};
				}(),
				startPath: function() {
					return new CKEDITOR.dom.elementPath(this.startContainer, this.root);
				},
				endPath: function() {
					return new CKEDITOR.dom.elementPath(this.endContainer, this.root);
				},
				checkBoundaryOfElement: function(a, b) {
					var c = b == CKEDITOR.START;
					var d = this.clone();
					d.collapse(c);
					d[c ? "setStartAt" : "setEndAt"](a, c ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
					d = new CKEDITOR.dom.walker(d);
					d.evaluator = e$$0(c);
					return d[c ? "checkBackward" : "checkForward"]();
				},
				checkStartOfBlock: function() {
					var b = this.startContainer;
					var c = this.startOffset;
					if (CKEDITOR.env.ie && (c && b.type == CKEDITOR.NODE_TEXT)) {
						b = CKEDITOR.tools.ltrim(b.substring(0, c));
						if (j$$0.test(b)) {
							this.trim(0, 1);
						}
					}
					this.trim();
					b = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
					c = this.clone();
					c.collapse(true);
					c.setStartAt(b.block || b.blockLimit, CKEDITOR.POSITION_AFTER_START);
					b = new CKEDITOR.dom.walker(c);
					b.evaluator = a$$2();
					return b.checkBackward();
				},
				checkEndOfBlock: function() {
					var b = this.endContainer;
					var c = this.endOffset;
					if (CKEDITOR.env.ie && b.type == CKEDITOR.NODE_TEXT) {
						b = CKEDITOR.tools.rtrim(b.substring(c));
						if (j$$0.test(b)) {
							this.trim(1, 0);
						}
					}
					this.trim();
					b = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
					c = this.clone();
					c.collapse(false);
					c.setEndAt(b.block || b.blockLimit, CKEDITOR.POSITION_BEFORE_END);
					b = new CKEDITOR.dom.walker(c);
					b.evaluator = a$$2();
					return b.checkForward();
				},
				getPreviousNode: function(a, b, c) {
					var d = this.clone();
					d.collapse(1);
					d.setStartAt(c || this.root, CKEDITOR.POSITION_AFTER_START);
					c = new CKEDITOR.dom.walker(d);
					c.evaluator = a;
					c.guard = b;
					return c.previous();
				},
				getNextNode: function(a, b, c) {
					var d = this.clone();
					d.collapse();
					d.setEndAt(c || this.root, CKEDITOR.POSITION_BEFORE_END);
					c = new CKEDITOR.dom.walker(d);
					c.evaluator = a;
					c.guard = b;
					return c.next();
				},
				checkReadOnly: function() {
					function a(b, c) {
						for (; b;) {
							if (b.type == CKEDITOR.NODE_ELEMENT) {
								if (b.getAttribute("contentEditable") == "false" && !b.data("cke-editable")) {
									return 0;
								}
								if (b.is("html") || b.getAttribute("contentEditable") == "true" && (b.contains(c) || b.equals(c))) {
									break;
								}
							}
							b = b.getParent();
						}
						return 1;
					}
					return function() {
						var b = this.startContainer;
						var c = this.endContainer;
						return !(a(b, c) && a(c, b));
					};
				}(),
				moveToElementEditablePosition: function(a, b) {
					if (a.type == CKEDITOR.NODE_ELEMENT && !a.isEditable(false)) {
						this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
						return true;
					}
					var c = 0;
					for (; a;) {
						if (a.type == CKEDITOR.NODE_TEXT) {
							if (b && (this.endContainer && (this.checkEndOfBlock() && j$$0.test(a.getText())))) {
								this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START);
							} else {
								this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
							}
							c = 1;
							break;
						}
						if (a.type == CKEDITOR.NODE_ELEMENT) {
							if (a.isEditable()) {
								this.moveToPosition(a, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START);
								c = 1;
							} else {
								if (b && (a.is("br") && (this.endContainer && this.checkEndOfBlock()))) {
									this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START);
								} else {
									if (a.getAttribute("contenteditable") == "false" && a.is(CKEDITOR.dtd.$block)) {
										this.setStartBefore(a);
										this.setEndAfter(a);
										return true;
									}
								}
							}
						}
						var d = a;
						var f = c;
						var e = void 0;
						if (d.type == CKEDITOR.NODE_ELEMENT) {
							if (d.isEditable(false)) {
								e = d[b ? "getLast" : "getFirst"](i$$0);
							}
						}
						if (!f) {
							if (!e) {
								e = d[b ? "getPrevious" : "getNext"](i$$0);
							}
						}
						a = e;
					}
					return !!c;
				},
				moveToClosestEditablePosition: function(a, b) {
					var c = new CKEDITOR.dom.range(this.root);
					var d = 0;
					var f;
					var e = [CKEDITOR.POSITION_AFTER_END, CKEDITOR.POSITION_BEFORE_START];
					c.moveToPosition(a, e[b ? 0 : 1]);
					if (a.is(CKEDITOR.dtd.$block)) {
						if (f = c[b ? "getNextEditableNode" : "getPreviousEditableNode"]()) {
							d = 1;
							if (f.type == CKEDITOR.NODE_ELEMENT && (f.is(CKEDITOR.dtd.$block) && f.getAttribute("contenteditable") == "false")) {
								c.setStartAt(f, CKEDITOR.POSITION_BEFORE_START);
								c.setEndAt(f, CKEDITOR.POSITION_AFTER_END);
							} else {
								c.moveToPosition(f, e[b ? 1 : 0]);
							}
						}
					} else {
						d = 1;
					}
					if (d) {
						this.moveToRange(c);
					}
					return !!d;
				},
				moveToElementEditStart: function(a) {
					return this.moveToElementEditablePosition(a);
				},
				moveToElementEditEnd: function(a) {
					return this.moveToElementEditablePosition(a, true);
				},
				getEnclosedNode: function() {
					var a$$0 = this.clone();
					a$$0.optimize();
					if (a$$0.startContainer.type != CKEDITOR.NODE_ELEMENT || a$$0.endContainer.type != CKEDITOR.NODE_ELEMENT) {
						return null;
					}
					a$$0 = new CKEDITOR.dom.walker(a$$0);
					var b = CKEDITOR.dom.walker.bookmark(false, true);
					var c = CKEDITOR.dom.walker.whitespaces(true);
					a$$0.evaluator = function(a) {
						return c(a) && b(a);
					};
					var d = a$$0.next();
					a$$0.reset();
					return d && d.equals(a$$0.previous()) ? d : null;
				},
				getTouchedStartNode: function() {
					var a = this.startContainer;
					return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.startOffset) || a;
				},
				getTouchedEndNode: function() {
					var a = this.endContainer;
					return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.endOffset - 1) || a;
				},
				getNextEditableNode: b$$1(),
				getPreviousEditableNode: b$$1(1),
				scrollIntoView: function() {
					var a = new CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", this.document);
					var b;
					var c;
					var d;
					var f = this.clone();
					f.optimize();
					if (d = f.startContainer.type == CKEDITOR.NODE_TEXT) {
						c = f.startContainer.getText();
						b = f.startContainer.split(f.startOffset);
						a.insertAfter(f.startContainer);
					} else {
						f.insertNode(a);
					}
					a.scrollIntoView();
					if (d) {
						f.startContainer.setText(c);
						b.remove();
					}
					a.remove();
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
			function a$$1(a) {
				if (!(arguments.length < 1)) {
					this.range = a;
					this.forceBrBreak = 0;
					this.enlargeBr = 1;
					this.enforceRealBlocks = 0;
					if (!this._) {
						this._ = {};
					}
				}
			}

			function e$$0(a, b, d) {
				a = a.getNextSourceNode(b, null, d);
				for (; !c$$0(a);) {
					a = a.getNextSourceNode(b, null, d);
				}
				return a;
			}

			function b$$0(a$$0) {
				var b = [];
				a$$0.forEach(function(a) {
					if (a.getAttribute("contenteditable") == "true") {
						b.push(a);
						return false;
					}
				}, CKEDITOR.NODE_ELEMENT, true);
				return b;
			}

			function d$$0(a, c, f, e) {
				a: {
					if (e == void 0) {
						e = b$$0(f);
					}
					var h;
					for (; h = e.shift();) {
						if (h.getDtd().p) {
							e = {
								element: h,
								remaining: e
							};
							break a;
						}
					}
					e = null;
				}
				if (!e) {
					return 0;
				}
				if ((h = CKEDITOR.filter.instances[e.element.data("cke-filter")]) && !h.check(c)) {
					return d$$0(a, c, f, e.remaining);
				}
				c = new CKEDITOR.dom.range(e.element);
				c.selectNodeContents(e.element);
				c = c.createIterator();
				c.enlargeBr = a.enlargeBr;
				c.enforceRealBlocks = a.enforceRealBlocks;
				c.activeFilter = c.filter = h;
				a._.nestedEditable = {
					element: e.element,
					container: f,
					remaining: e.remaining,
					iterator: c
				};
				return 1;
			}
			var f$$0 = /^[\r\n\t ]+$/;
			var c$$0 = CKEDITOR.dom.walker.bookmark(false, true);
			var h$$0 = CKEDITOR.dom.walker.whitespaces(true);
			var j = function(a) {
				return c$$0(a) && h$$0(a);
			};
			a$$1.prototype = {
				getNextParagraph: function(a) {
					var b;
					var h;
					var n;
					var o;
					var r;
					a = a || "p";
					if (this._.nestedEditable) {
						if (b = this._.nestedEditable.iterator.getNextParagraph(a)) {
							this.activeFilter = this._.nestedEditable.iterator.activeFilter;
							return b;
						}
						this.activeFilter = this.filter;
						if (d$$0(this, a, this._.nestedEditable.container, this._.nestedEditable.remaining)) {
							this.activeFilter = this._.nestedEditable.iterator.activeFilter;
							return this._.nestedEditable.iterator.getNextParagraph(a);
						}
						this._.nestedEditable = null;
					}
					if (!this.range.root.getDtd()[a]) {
						return null;
					}
					if (!this._.started) {
						var l = this.range.clone();
						l.shrink(CKEDITOR.SHRINK_ELEMENT, true);
						h = l.endContainer.hasAscendant("pre", true) || l.startContainer.hasAscendant("pre", true);
						l.enlarge(this.forceBrBreak && !h || !this.enlargeBr ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS);
						if (!l.collapsed) {
							h = new CKEDITOR.dom.walker(l.clone());
							var m = CKEDITOR.dom.walker.bookmark(true, true);
							h.evaluator = m;
							this._.nextNode = h.next();
							h = new CKEDITOR.dom.walker(l.clone());
							h.evaluator = m;
							h = h.previous();
							this._.lastNode = h.getNextSourceNode(true);
							if (this._.lastNode && (this._.lastNode.type == CKEDITOR.NODE_TEXT && (!CKEDITOR.tools.trim(this._.lastNode.getText()) && this._.lastNode.getParent().isBlockBoundary()))) {
								m = this.range.clone();
								m.moveToPosition(this._.lastNode, CKEDITOR.POSITION_AFTER_END);
								if (m.checkEndOfBlock()) {
									m = new CKEDITOR.dom.elementPath(m.endContainer, m.root);
									this._.lastNode = (m.block || m.blockLimit).getNextSourceNode(true);
								}
							}
							if (!this._.lastNode || !l.root.contains(this._.lastNode)) {
								this._.lastNode = this._.docEndMarker = l.document.createText("");
								this._.lastNode.insertAfter(h);
							}
							l = null;
						}
						this._.started = 1;
						h = l;
					}
					m = this._.nextNode;
					l = this._.lastNode;
					this._.nextNode = null;
					for (; m;) {
						var s = 0;
						var t = m.hasAscendant("pre");
						var p = m.type != CKEDITOR.NODE_ELEMENT;
						var x = 0;
						if (p) {
							if (m.type == CKEDITOR.NODE_TEXT) {
								if (f$$0.test(m.getText())) {
									p = 0;
								}
							}
						} else {
							var q = m.getName();
							if (CKEDITOR.dtd.$block[q] && m.getAttribute("contenteditable") == "false") {
								b = m;
								d$$0(this, a, b);
								break;
							} else {
								if (m.isBlockBoundary(this.forceBrBreak && (!t && {
									br: 1
								}))) {
									if (q == "br") {
										p = 1;
									} else {
										if (!h && (!m.getChildCount() && q != "hr")) {
											b = m;
											n = m.equals(l);
											break;
										}
									}
									if (h) {
										h.setEndAt(m, CKEDITOR.POSITION_BEFORE_START);
										if (q != "br") {
											this._.nextNode = m;
										}
									}
									s = 1;
								} else {
									if (m.getFirst()) {
										if (!h) {
											h = this.range.clone();
											h.setStartAt(m, CKEDITOR.POSITION_BEFORE_START);
										}
										m = m.getFirst();
										continue;
									}
									p = 1;
								}
							}
						}
						if (p && !h) {
							h = this.range.clone();
							h.setStartAt(m, CKEDITOR.POSITION_BEFORE_START);
						}
						n = (!s || p) && m.equals(l);
						if (h && !s) {
							for (; !m.getNext(j) && !n;) {
								q = m.getParent();
								if (q.isBlockBoundary(this.forceBrBreak && (!t && {
									br: 1
								}))) {
									s = 1;
									p = 0;
									if (!n) {
										q.equals(l);
									}
									h.setEndAt(q, CKEDITOR.POSITION_BEFORE_END);
									break;
								}
								m = q;
								p = 1;
								n = m.equals(l);
								x = 1;
							}
						}
						if (p) {
							h.setEndAt(m, CKEDITOR.POSITION_AFTER_END);
						}
						m = e$$0(m, x, l);
						if ((n = !m) || s && h) {
							break;
						}
					}
					if (!b) {
						if (!h) {
							if (this._.docEndMarker) {
								this._.docEndMarker.remove();
							}
							return this._.nextNode = null;
						}
						b = new CKEDITOR.dom.elementPath(h.startContainer, h.root);
						m = b.blockLimit;
						s = {
							div: 1,
							th: 1,
							td: 1
						};
						b = b.block;
						if (!b && (m && (!this.enforceRealBlocks && (s[m.getName()] && (h.checkStartOfBlock() && (h.checkEndOfBlock() && !m.equals(h.root))))))) {
							b = m;
						} else {
							if (!b || this.enforceRealBlocks && b.getName() == "li") {
								b = this.range.document.createElement(a);
								h.extractContents().appendTo(b);
								b.trim();
								h.insertNode(b);
								o = r = true;
							} else {
								if (b.getName() != "li") {
									if (!h.checkStartOfBlock() || !h.checkEndOfBlock()) {
										b = b.clone(false);
										h.extractContents().appendTo(b);
										b.trim();
										r = h.splitBlock();
										o = !r.wasStartOfBlock;
										r = !r.wasEndOfBlock;
										h.insertNode(b);
									}
								} else {
									if (!n) {
										this._.nextNode = b.equals(l) ? null : e$$0(h.getBoundaryNodes().endNode, 1, l);
									}
								}
							}
						}
					}
					if (o) {
						if (o = b.getPrevious()) {
							if (o.type == CKEDITOR.NODE_ELEMENT) {
								if (o.getName() == "br") {
									o.remove();
								} else {
									if (o.getLast()) {
										if (o.getLast().$.nodeName.toLowerCase() == "br") {
											o.getLast().remove();
										}
									}
								}
							}
						}
					}
					if (r) {
						if (o = b.getLast()) {
							if (o.type == CKEDITOR.NODE_ELEMENT) {
								if (o.getName() == "br") {
									if (!CKEDITOR.env.needsBrFiller || (o.getPrevious(c$$0) || o.getNext(c$$0))) {
										o.remove();
									}
								}
							}
						}
					}
					if (!this._.nextNode) {
						this._.nextNode = n || (b.equals(l) || !l) ? null : e$$0(b, 1, l);
					}
					return b;
				}
			};
			CKEDITOR.dom.range.prototype.createIterator = function() {
				return new a$$1(this);
			};
		})();
		CKEDITOR.command = function(a$$0, e) {
			this.uiItems = [];
			this.exec = function(b) {
				if (this.state == CKEDITOR.TRISTATE_DISABLED || !this.checkAllowed()) {
					return false;
				}
				if (this.editorFocus) {
					a$$0.focus();
				}
				return this.fire("exec") === false ? true : e.exec.call(this, a$$0, b) !== false;
			};
			this.refresh = function(a, b) {
				if (!this.readOnly && a.readOnly) {
					return true;
				}
				if (this.context && !b.isContextFor(this.context)) {
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
					if (!this.modes[a.mode]) {
						this.disable();
					}
				}
				return this.fire("refresh", {
					editor: a,
					path: b
				}) === false ? true : e.refresh && e.refresh.apply(this, arguments) !== false;
			};
			var b$$0;
			this.checkAllowed = function(d) {
				return !d && typeof b$$0 == "boolean" ? b$$0 : b$$0 = a$$0.activeFilter.checkFeature(this);
			};
			CKEDITOR.tools.extend(this, e, {
				modes: {
					wysiwyg: 1
				},
				editorFocus: 1,
				contextSensitive: !!e.context,
				state: CKEDITOR.TRISTATE_DISABLED
			});
			CKEDITOR.event.call(this);
		};
		CKEDITOR.command.prototype = {
			enable: function() {
				if (this.state == CKEDITOR.TRISTATE_DISABLED) {
					if (this.checkAllowed()) {
						this.setState(!this.preserveState || typeof this.previousState == "undefined" ? CKEDITOR.TRISTATE_OFF : this.previousState);
					}
				}
			},
			disable: function() {
				this.setState(CKEDITOR.TRISTATE_DISABLED);
			},
			setState: function(a) {
				if (this.state == a || a != CKEDITOR.TRISTATE_DISABLED && !this.checkAllowed()) {
					return false;
				}
				this.previousState = this.state;
				this.state = a;
				this.fire("state");
				return true;
			},
			toggleState: function() {
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
			customConfig: "config.js",
			autoUpdateElement: true,
			language: "",
			defaultLanguage: "en",
			contentsLangDirection: "",
			enterMode: CKEDITOR.ENTER_P,
			forceEnterMode: false,
			shiftEnterMode: CKEDITOR.ENTER_BR,
			docType: "<!DOCTYPE html>",
			bodyId: "",
			bodyClass: "",
			fullPage: false,
			height: 200,
			extraPlugins: "",
			removePlugins: "",
			protectedSource: [],
			tabIndex: 0,
			width: "",
			baseFloatZIndex: 1E4,
			blockedKeystrokes: [CKEDITOR.CTRL + 66, CKEDITOR.CTRL + 73, CKEDITOR.CTRL + 85]
		};
		(function() {
			function a$$1(a, b, c, d, f) {
				var e;
				var g;
				a = [];
				for (e in b) {
					g = b[e];
					g = typeof g == "boolean" ? {} : typeof g == "function" ? {
						match: g
					} : I(g);
					if (e.charAt(0) != "$") {
						g.elements = e;
					}
					if (c) {
						g.featureName = c.toLowerCase();
					}
					var l = g;
					l.elements = h$$0(l.elements, /\s+/) || null;
					l.propertiesOnly = l.propertiesOnly || l.elements === true;
					var j = /\s*,\s*/;
					var i = void 0;
					for (i in E$$0) {
						l[i] = h$$0(l[i], j) || null;
						var y = l;
						var m = H$$0[i];
						var p = h$$0(l[H$$0[i]], j);
						var k = l[i];
						var x = [];
						var s = true;
						var F = void 0;
						if (p) {
							s = false;
						} else {
							p = {};
						}
						for (F in k) {
							if (F.charAt(0) == "!") {
								F = F.slice(1);
								x.push(F);
								p[F] = true;
								s = false;
							}
						}
						for (; F = x.pop();) {
							k[F] = k["!" + F];
							delete k["!" + F];
						}
						y[m] = (s ? false : p) || null;
					}
					l.match = l.match || null;
					d.push(g);
					a.push(g);
				}
				b = f.elements;
				f = f.generic;
				var q;
				c = 0;
				d = a.length;
				for (; c < d; ++c) {
					e = I(a[c]);
					g = e.classes === true || (e.styles === true || e.attributes === true);
					l = e;
					i = m = j = void 0;
					for (j in E$$0) {
						l[j] = t(l[j]);
					}
					y = true;
					for (i in H$$0) {
						j = H$$0[i];
						m = l[j];
						p = [];
						k = void 0;
						for (k in m) {
							if (k.indexOf("*") > -1) {
								p.push(RegExp("^" + k.replace(/\*/g, ".*") + "$"));
							} else {
								p.push(k);
							}
						}
						m = p;
						if (m.length) {
							l[j] = m;
							y = false;
						}
					}
					l.nothingRequired = y;
					l.noProperties = !(l.attributes || (l.classes || l.styles));
					if (e.elements === true || e.elements === null) {
						f[g ? "unshift" : "push"](e);
					} else {
						l = e.elements;
						delete e.elements;
						for (q in l) {
							if (b[q]) {
								b[q][g ? "unshift" : "push"](e);
							} else {
								b[q] = [e];
							}
						}
					}
				}
			}

			function e$$0(a, c, d, f) {
				if (!a.match || a.match(c)) {
					if (f || j$$0(a, c)) {
						if (!a.propertiesOnly) {
							d.valid = true;
						}
						if (!d.allAttributes) {
							d.allAttributes = b$$0(a.attributes, c.attributes, d.validAttributes);
						}
						if (!d.allStyles) {
							d.allStyles = b$$0(a.styles, c.styles, d.validStyles);
						}
						if (!d.allClasses) {
							a = a.classes;
							c = c.classes;
							f = d.validClasses;
							if (a) {
								if (a === true) {
									a = true;
								} else {
									var e = 0;
									var g = c.length;
									var h;
									for (; e < g; ++e) {
										h = c[e];
										if (!f[h]) {
											f[h] = a(h);
										}
									}
									a = false;
								}
							} else {
								a = false;
							}
							d.allClasses = a;
						}
					}
				}
			}

			function b$$0(a, b, c) {
				if (!a) {
					return false;
				}
				if (a === true) {
					return true;
				}
				var d;
				for (d in b) {
					if (!c[d]) {
						c[d] = a(d);
					}
				}
				return false;
			}

			function d$$1(a, b, c) {
				if (!a.match || a.match(b)) {
					if (a.noProperties) {
						return false;
					}
					c.hadInvalidAttribute = f$$0(a.attributes, b.attributes) || c.hadInvalidAttribute;
					c.hadInvalidStyle = f$$0(a.styles, b.styles) || c.hadInvalidStyle;
					a = a.classes;
					b = b.classes;
					if (a) {
						var d = false;
						var e = a === true;
						var g = b.length;
						for (; g--;) {
							if (e || a(b[g])) {
								b.splice(g, 1);
								d = true;
							}
						}
						a = d;
					} else {
						a = false;
					}
					c.hadInvalidClass = a || c.hadInvalidClass;
				}
			}

			function f$$0(a, b) {
				if (!a) {
					return false;
				}
				var c = false;
				var d = a === true;
				var f;
				for (f in b) {
					if (d || a(f)) {
						delete b[f];
						c = true;
					}
				}
				return c;
			}

			function c$$1(a, b, c) {
				if (a.disabled || (a.customConfig && !c || !b)) {
					return false;
				}
				a._.cachedChecks = {};
				return true;
			}

			function h$$0(a, b) {
				if (!a) {
					return false;
				}
				if (a === true) {
					return a;
				}
				if (typeof a == "string") {
					a = K(a);
					return a == "*" ? true : CKEDITOR.tools.convertArrayToObject(a.split(b));
				}
				if (CKEDITOR.tools.isArray(a)) {
					return a.length ? CKEDITOR.tools.convertArrayToObject(a) : false;
				}
				var c = {};
				var d = 0;
				var f;
				for (f in a) {
					c[f] = a[f];
					d++;
				}
				return d ? c : false;
			}

			function j$$0(a, b) {
				if (a.nothingRequired) {
					return true;
				}
				var c;
				var d;
				var f;
				var e;
				if (f = a.requiredClasses) {
					e = b.classes;
					c = 0;
					for (; c < f.length; ++c) {
						d = f[c];
						if (typeof d == "string") {
							if (CKEDITOR.tools.indexOf(e, d) == -1) {
								return false;
							}
						} else {
							if (!CKEDITOR.tools.checkIfAnyArrayItemMatches(e, d)) {
								return false;
							}
						}
					}
				}
				return g$$0(b.styles, a.requiredStyles) && g$$0(b.attributes, a.requiredAttributes);
			}

			function g$$0(a, b) {
				if (!b) {
					return true;
				}
				var c = 0;
				var d;
				for (; c < b.length; ++c) {
					d = b[c];
					if (typeof d == "string") {
						if (!(d in a)) {
							return false;
						}
					} else {
						if (!CKEDITOR.tools.checkIfAnyObjectPropertyMatches(a, d)) {
							return false;
						}
					}
				}
				return true;
			}

			function i$$1(a) {
				if (!a) {
					return {};
				}
				a = a.split(/\s*,\s*/).sort();
				var b = {};
				for (; a.length;) {
					b[a.shift()] = C$$0;
				}
				return b;
			}

			function k$$0(a) {
				var b;
				var c;
				var d;
				var f;
				var e = {};
				var g = 1;
				a = K(a);
				for (; b = a.match(F$$0);) {
					if (c = b[2]) {
						d = n$$0(c, "styles");
						f = n$$0(c, "attrs");
						c = n$$0(c, "classes");
					} else {
						d = f = c = null;
					}
					e["$" + g++] = {
						elements: b[1],
						classes: c,
						styles: d,
						attributes: f
					};
					a = a.slice(b[0].length);
				}
				return e;
			}

			function n$$0(a, b) {
				var c = a.match(S[b]);
				return c ? K(c[1]) : null;
			}

			function o(a) {
				var b = a.styleBackup = a.attributes.style;
				var c = a.classBackup = a.attributes["class"];
				if (!a.styles) {
					a.styles = CKEDITOR.tools.parseCssText(b || "", 1);
				}
				if (!a.classes) {
					a.classes = c ? c.split(/\s+/) : [];
				}
			}

			function r(a, b, c, f) {
				var g = 0;
				var h;
				if (f.toHtml) {
					b.name = b.name.replace(O, "$1");
				}
				if (f.doCallbacks && a.elementCallbacks) {
					var l = a.elementCallbacks;
					var j = 0;
					var i = l.length;
					var y;
					a: for (; j < i; ++j) {
						if (y = l[j](b)) {
							h = y;
							break a;
						}
					}
					if (h) {
						return h;
					}
				}
				if (f.doTransform) {
					if (h = a._.transformations[b.name]) {
						o(b);
						l = 0;
						for (; l < h.length; ++l) {
							u(a, b, h[l]);
						}
						m$$0(b);
					}
				}
				if (f.doFilter) {
					a: {
						l = b.name;
						j = a._;
						a = j.allowedRules.elements[l];
						h = j.allowedRules.generic;
						l = j.disallowedRules.elements[l];
						j = j.disallowedRules.generic;
						i = f.skipRequired;
						y = {
							valid: false,
							validAttributes: {},
							validClasses: {},
							validStyles: {},
							allAttributes: false,
							allClasses: false,
							allStyles: false,
							hadInvalidAttribute: false,
							hadInvalidClass: false,
							hadInvalidStyle: false
						};
						var p;
						var k;
						if (!a && !h) {
							a = null;
						} else {
							o(b);
							if (l) {
								p = 0;
								k = l.length;
								for (; p < k; ++p) {
									if (d$$1(l[p], b, y) === false) {
										a = null;
										break a;
									}
								}
							}
							if (j) {
								p = 0;
								k = j.length;
								for (; p < k; ++p) {
									d$$1(j[p], b, y);
								}
							}
							if (a) {
								p = 0;
								k = a.length;
								for (; p < k; ++p) {
									e$$0(a[p], b, y, i);
								}
							}
							if (h) {
								p = 0;
								k = h.length;
								for (; p < k; ++p) {
									e$$0(h[p], b, y, i);
								}
							}
							a = y;
						}
					}
					if (!a) {
						c.push(b);
						return A;
					}
					if (!a.valid) {
						c.push(b);
						return A;
					}
					k = a.validAttributes;
					var E = a.validStyles;
					h = a.validClasses;
					l = b.attributes;
					var x = b.styles;
					j = b.classes;
					i = b.classBackup;
					var F = b.styleBackup;
					var q;
					var n;
					var H = [];
					y = [];
					var C = /^data-cke-/;
					p = false;
					delete l.style;
					delete l["class"];
					delete b.classBackup;
					delete b.styleBackup;
					if (!a.allAttributes) {
						for (q in l) {
							if (!k[q]) {
								if (C.test(q)) {
									if (q != (n = q.replace(/^data-cke-saved-/, "")) && !k[n]) {
										delete l[q];
										p = true;
									}
								} else {
									delete l[q];
									p = true;
								}
							}
						}
					}
					if (!a.allStyles || a.hadInvalidStyle) {
						for (q in x) {
							if (a.allStyles || E[q]) {
								H.push(q + ":" + x[q]);
							} else {
								p = true;
							}
						}
						if (H.length) {
							l.style = H.sort().join("; ");
						}
					} else {
						if (F) {
							l.style = F;
						}
					}
					if (!a.allClasses || a.hadInvalidClass) {
						q = 0;
						for (; q < j.length; ++q) {
							if (a.allClasses || h[j[q]]) {
								y.push(j[q]);
							}
						}
						if (y.length) {
							l["class"] = y.sort().join(" ");
						}
						if (i) {
							if (y.length < i.split(/\s+/).length) {
								p = true;
							}
						}
					} else {
						if (i) {
							l["class"] = i;
						}
					}
					if (p) {
						g = A;
					}
					if (!f.skipFinalValidation && !s$$0(b)) {
						c.push(b);
						return A;
					}
				}
				if (f.toHtml) {
					b.name = b.name.replace(J, "cke:$1");
				}
				return g;
			}

			function l$$0(a) {
				var b = [];
				var c;
				for (c in a) {
					if (c.indexOf("*") > -1) {
						b.push(c.replace(/\*/g, ".*"));
					}
				}
				return b.length ? RegExp("^(?:" + b.join("|") + ")$") : null;
			}

			function m$$0(a) {
				var b = a.attributes;
				var c;
				delete b.style;
				delete b["class"];
				if (c = CKEDITOR.tools.writeCssText(a.styles, true)) {
					b.style = c;
				}
				if (a.classes.length) {
					b["class"] = a.classes.sort().join(" ");
				}
			}

			function s$$0(a) {
				switch (a.name) {
					case "a":
						if (!a.children.length && !a.attributes.name) {
							return false;
						}
						break;
					case "img":
						if (!a.attributes.src) {
							return false;
						};
				}
				return true;
			}

			function t(a) {
				if (!a) {
					return false;
				}
				if (a === true) {
					return true;
				}
				var b = l$$0(a);
				return function(c) {
					return c in a || b && c.match(b);
				};
			}

			function p$$0() {
				return new CKEDITOR.htmlParser.element("br");
			}

			function x$$0(a) {
				return a.type == CKEDITOR.NODE_ELEMENT && (a.name == "br" || D.$block[a.name]);
			}

			function q$$0(a, b, c) {
				var d = a.name;
				if (D.$empty[d] || !a.children.length) {
					if (d == "hr" && b == "br") {
						a.replaceWith(p$$0());
					} else {
						if (a.parent) {
							c.push({
								check: "it",
								el: a.parent
							});
						}
						a.remove();
					}
				} else {
					if (D.$block[d] || d == "tr") {
						if (b == "br") {
							if (a.previous && !x$$0(a.previous)) {
								b = p$$0();
								b.insertBefore(a);
							}
							if (a.next && !x$$0(a.next)) {
								b = p$$0();
								b.insertAfter(a);
							}
							a.replaceWithChildren();
						} else {
							d = a.children;
							var f;
							b: {
								f = D[b];
								var e = 0;
								var g = d.length;
								var h;
								for (; e < g; ++e) {
									h = d[e];
									if (h.type == CKEDITOR.NODE_ELEMENT && !f[h.name]) {
										f = false;
										break b;
									}
								}
								f = true;
							}
							if (f) {
								a.name = b;
								a.attributes = {};
								c.push({
									check: "parent-down",
									el: a
								});
							} else {
								f = a.parent;
								e = f.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || f.name == "body";
								var l;
								g = d.length;
								for (; g > 0;) {
									h = d[--g];
									if (e && (h.type == CKEDITOR.NODE_TEXT || h.type == CKEDITOR.NODE_ELEMENT && D.$inline[h.name])) {
										if (!l) {
											l = new CKEDITOR.htmlParser.element(b);
											l.insertAfter(a);
											c.push({
												check: "parent-down",
												el: l
											});
										}
										l.add(h, 0);
									} else {
										l = null;
										h.insertAfter(a);
										if (f.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
											if (h.type == CKEDITOR.NODE_ELEMENT && !D[f.name][h.name]) {
												c.push({
													check: "el-up",
													el: h
												});
											}
										}
									}
								}
								a.remove();
							}
						}
					} else {
						if (d == "style") {
							a.remove();
						} else {
							if (a.parent) {
								c.push({
									check: "it",
									el: a.parent
								});
							}
							a.replaceWithChildren();
						}
					}
				}
			}

			function u(a, b, c) {
				var d;
				var f;
				d = 0;
				for (; d < c.length; ++d) {
					f = c[d];
					if ((!f.check || a.check(f.check, false)) && (!f.left || f.left(b))) {
						f.right(b, G);
						break;
					}
				}
			}

			function B(a, b) {
				var c = b.getDefinition();
				var d = c.attributes;
				var f = c.styles;
				var e;
				var g;
				var h;
				var l;
				if (a.name != c.element) {
					return false;
				}
				for (e in d) {
					if (e == "class") {
						c = d[e].split(/\s+/);
						h = a.classes.join("|");
						for (; l = c.pop();) {
							if (h.indexOf(l) == -1) {
								return false;
							}
						}
					} else {
						if (a.attributes[e] != d[e]) {
							return false;
						}
					}
				}
				for (g in f) {
					if (a.styles[g] != f[g]) {
						return false;
					}
				}
				return true;
			}

			function v(a$$0, b) {
				var c$$0;
				var d;
				if (typeof a$$0 == "string") {
					c$$0 = a$$0;
				} else {
					if (a$$0 instanceof CKEDITOR.style) {
						d = a$$0;
					} else {
						c$$0 = a$$0[0];
						d = a$$0[1];
					}
				}
				return [{
					element: c$$0,
					left: d,
					right: function(a, c) {
						c.transform(a, b);
					}
				}];
			}

			function z(a) {
				return function(b) {
					return B(b, a);
				};
			}

			function w(a) {
				return function(b, c) {
					c[a](b);
				};
			}
			var D = CKEDITOR.dtd;
			var A = 1;
			var I = CKEDITOR.tools.copy;
			var K = CKEDITOR.tools.trim;
			var C$$0 = "cke-test";
			var y$$0 = ["", "p", "br", "div"];
			CKEDITOR.FILTER_SKIP_TREE = 2;
			CKEDITOR.filter = function(a) {
				this.allowedContent = [];
				this.disallowedContent = [];
				this.elementCallbacks = null;
				this.disabled = false;
				this.editor = null;
				this.id = CKEDITOR.tools.getNextNumber();
				this._ = {
					allowedRules: {
						elements: {},
						generic: []
					},
					disallowedRules: {
						elements: {},
						generic: []
					},
					transformations: {},
					cachedTests: {}
				};
				CKEDITOR.filter.instances[this.id] = this;
				if (a instanceof CKEDITOR.editor) {
					a = this.editor = a;
					this.customConfig = true;
					var b = a.config.allowedContent;
					if (b === true) {
						this.disabled = true;
					} else {
						if (!b) {
							this.customConfig = false;
						}
						this.allow(b, "config", 1);
						this.allow(a.config.extraAllowedContent, "extra", 1);
						this.allow(y$$0[a.enterMode] + " " + y$$0[a.shiftEnterMode], "default", 1);
						this.disallow(a.config.disallowedContent);
					}
				} else {
					this.customConfig = false;
					this.allow(a, "default", 1);
				}
			};
			CKEDITOR.filter.instances = {};
			CKEDITOR.filter.prototype = {
				allow: function(b, d, f) {
					if (!c$$1(this, b, f)) {
						return false;
					}
					var e;
					var g;
					if (typeof b == "string") {
						b = k$$0(b);
					} else {
						if (b instanceof CKEDITOR.style) {
							if (b.toAllowedContentRules) {
								return this.allow(b.toAllowedContentRules(this.editor), d, f);
							}
							e = b.getDefinition();
							b = {};
							f = e.attributes;
							b[e.element] = e = {
								styles: e.styles,
								requiredStyles: e.styles && CKEDITOR.tools.objectKeys(e.styles)
							};
							if (f) {
								f = I(f);
								e.classes = f["class"] ? f["class"].split(/\s+/) : null;
								e.requiredClasses = e.classes;
								delete f["class"];
								e.attributes = f;
								e.requiredAttributes = f && CKEDITOR.tools.objectKeys(f);
							}
						} else {
							if (CKEDITOR.tools.isArray(b)) {
								e = 0;
								for (; e < b.length; ++e) {
									g = this.allow(b[e], d, f);
								}
								return g;
							}
						}
					}
					a$$1(this, b, d, this.allowedContent, this._.allowedRules);
					return true;
				},
				applyTo: function(a$$0, b, c$$0, d$$0) {
					if (this.disabled) {
						return false;
					}
					var f = this;
					var e = [];
					var g = this.editor && this.editor.config.protectedSource;
					var h;
					var l = false;
					var j = {
						doFilter: !c$$0,
						doTransform: true,
						doCallbacks: true,
						toHtml: b
					};
					a$$0.forEach(function(a) {
						if (a.type == CKEDITOR.NODE_ELEMENT) {
							if (a.attributes["data-cke-filter"] == "off") {
								return false;
							}
							if (!b || !(a.name == "span" && ~CKEDITOR.tools.objectKeys(a.attributes).join("|").indexOf("data-cke-"))) {
								h = r(f, a, e, j);
								if (h & A) {
									l = true;
								} else {
									if (h & 2) {
										return false;
									}
								}
							}
						} else {
							if (a.type == CKEDITOR.NODE_COMMENT && a.value.match(/^\{cke_protected\}(?!\{C\})/)) {
								var c;
								a: {
									var d = decodeURIComponent(a.value.replace(/^\{cke_protected\}/, ""));
									c = [];
									var i;
									var y;
									var m;
									if (g) {
										y = 0;
										for (; y < g.length; ++y) {
											if ((m = d.match(g[y])) && m[0].length == d.length) {
												c = true;
												break a;
											}
										}
									}
									d = CKEDITOR.htmlParser.fragment.fromHtml(d);
									if (d.children.length == 1) {
										if ((i = d.children[0]).type == CKEDITOR.NODE_ELEMENT) {
											r(f, i, c, j);
										}
									}
									c = !c.length;
								}
								if (!c) {
									e.push(a);
								}
							}
						}
					}, null, true);
					if (e.length) {
						l = true;
					}
					var i$$0;
					a$$0 = [];
					d$$0 = y$$0[d$$0 || (this.editor ? this.editor.enterMode : CKEDITOR.ENTER_P)];
					for (; c$$0 = e.pop();) {
						if (c$$0.type == CKEDITOR.NODE_ELEMENT) {
							q$$0(c$$0, d$$0, a$$0);
						} else {
							c$$0.remove();
						}
					}
					for (; i$$0 = a$$0.pop();) {
						c$$0 = i$$0.el;
						if (c$$0.parent) {
							switch (i$$0.check) {
								case "it":
									if (D.$removeEmpty[c$$0.name] && !c$$0.children.length) {
										q$$0(c$$0, d$$0, a$$0);
									} else {
										if (!s$$0(c$$0)) {
											q$$0(c$$0, d$$0, a$$0);
										}
									}
									break;
								case "el-up":
									if (c$$0.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
										if (!D[c$$0.parent.name][c$$0.name]) {
											q$$0(c$$0, d$$0, a$$0);
										}
									}
									break;
								case "parent-down":
									if (c$$0.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
										if (!D[c$$0.parent.name][c$$0.name]) {
											q$$0(c$$0.parent, d$$0, a$$0);
										}
									};
							}
						}
					}
					return l;
				},
				checkFeature: function(a) {
					if (this.disabled || !a) {
						return true;
					}
					if (a.toFeature) {
						a = a.toFeature(this.editor);
					}
					return !a.requiredContent || this.check(a.requiredContent);
				},
				disable: function() {
					this.disabled = true;
				},
				disallow: function(b) {
					if (!c$$1(this, b, true)) {
						return false;
					}
					if (typeof b == "string") {
						b = k$$0(b);
					}
					a$$1(this, b, null, this.disallowedContent, this._.disallowedRules);
					return true;
				},
				addContentForms: function(a) {
					if (!this.disabled && a) {
						var b;
						var c;
						var d = [];
						var f;
						b = 0;
						for (; b < a.length && !f; ++b) {
							c = a[b];
							if ((typeof c == "string" || c instanceof CKEDITOR.style) && this.check(c)) {
								f = c;
							}
						}
						if (f) {
							b = 0;
							for (; b < a.length; ++b) {
								d.push(v(a[b], f));
							}
							this.addTransformations(d);
						}
					}
				},
				addElementCallback: function(a) {
					if (!this.elementCallbacks) {
						this.elementCallbacks = [];
					}
					this.elementCallbacks.push(a);
				},
				addFeature: function(a) {
					if (this.disabled || !a) {
						return true;
					}
					if (a.toFeature) {
						a = a.toFeature(this.editor);
					}
					this.allow(a.allowedContent, a.name);
					this.addTransformations(a.contentTransformations);
					this.addContentForms(a.contentForms);
					return a.requiredContent && (this.customConfig || this.disallowedContent.length) ? this.check(a.requiredContent) : true;
				},
				addTransformations: function(a) {
					var b;
					var c;
					if (!this.disabled && a) {
						var d = this._.transformations;
						var f;
						f = 0;
						for (; f < a.length; ++f) {
							b = a[f];
							var e = void 0;
							var g = void 0;
							var h = void 0;
							var l = void 0;
							var j = void 0;
							var i = void 0;
							c = [];
							g = 0;
							for (; g < b.length; ++g) {
								h = b[g];
								if (typeof h == "string") {
									h = h.split(/\s*:\s*/);
									l = h[0];
									j = null;
									i = h[1];
								} else {
									l = h.check;
									j = h.left;
									i = h.right;
								}
								if (!e) {
									e = h;
									e = e.element ? e.element : l ? l.match(/^([a-z0-9]+)/i)[0] : e.left.getDefinition().element;
								}
								if (j instanceof CKEDITOR.style) {
									j = z(j);
								}
								c.push({
									check: l == e ? null : l,
									left: j,
									right: typeof i == "string" ? w(i) : i
								});
							}
							b = e;
							if (!d[b]) {
								d[b] = [];
							}
							d[b].push(c);
						}
					}
				},
				check: function(a, b, c) {
					if (this.disabled) {
						return true;
					}
					if (CKEDITOR.tools.isArray(a)) {
						var d = a.length;
						for (; d--;) {
							if (this.check(a[d], b, c)) {
								return true;
							}
						}
						return false;
					}
					var f;
					var e;
					if (typeof a == "string") {
						e = a + "<" + (b === false ? "0" : "1") + (c ? "1" : "0") + ">";
						if (e in this._.cachedChecks) {
							return this._.cachedChecks[e];
						}
						d = k$$0(a).$1;
						f = d.styles;
						var g = d.classes;
						d.name = d.elements;
						d.classes = g = g ? g.split(/\s*,\s*/) : [];
						d.styles = i$$1(f);
						d.attributes = i$$1(d.attributes);
						d.children = [];
						if (g.length) {
							d.attributes["class"] = g.join(" ");
						}
						if (f) {
							d.attributes.style = CKEDITOR.tools.writeCssText(d.styles);
						}
						f = d;
					} else {
						d = a.getDefinition();
						f = d.styles;
						g = d.attributes || {};
						if (f) {
							f = I(f);
							g.style = CKEDITOR.tools.writeCssText(f, true);
						} else {
							f = {};
						}
						f = {
							name: d.element,
							attributes: g,
							classes: g["class"] ? g["class"].split(/\s+/) : [],
							styles: f,
							children: []
						};
					}
					g = CKEDITOR.tools.clone(f);
					var h = [];
					var l;
					if (b !== false && (l = this._.transformations[f.name])) {
						d = 0;
						for (; d < l.length; ++d) {
							u(this, f, l[d]);
						}
						m$$0(f);
					}
					r(this, g, h, {
						doFilter: true,
						doTransform: b !== false,
						skipRequired: !c,
						skipFinalValidation: !c
					});
					b = h.length > 0 ? false : CKEDITOR.tools.objectCompare(f.attributes, g.attributes, true) ? true : false;
					if (typeof a == "string") {
						this._.cachedChecks[e] = b;
					}
					return b;
				},
				getAllowedEnterMode: function() {
					var a = ["p", "div", "br"];
					var b = {
						p: CKEDITOR.ENTER_P,
						div: CKEDITOR.ENTER_DIV,
						br: CKEDITOR.ENTER_BR
					};
					return function(c, d) {
						var f = a.slice();
						var e;
						if (this.check(y$$0[c])) {
							return c;
						}
						if (!d) {
							f = f.reverse();
						}
						for (; e = f.pop();) {
							if (this.check(e)) {
								return b[e];
							}
						}
						return CKEDITOR.ENTER_BR;
					};
				}()
			};
			var E$$0 = {
				styles: 1,
				attributes: 1,
				classes: 1
			};
			var H$$0 = {
				styles: "requiredStyles",
				attributes: "requiredAttributes",
				classes: "requiredClasses"
			};
			var F$$0 = /^([a-z0-9*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i;
			var S = {
				styles: /{([^}]+)}/,
				attrs: /\[([^\]]+)\]/,
				classes: /\(([^\)]+)\)/
			};
			var O = /^cke:(object|embed|param)$/;
			var J = /^(object|embed|param)$/;
			var G = CKEDITOR.filter.transformationsTools = {
				sizeToStyle: function(a) {
					this.lengthToStyle(a, "width");
					this.lengthToStyle(a, "height");
				},
				sizeToAttribute: function(a) {
					this.lengthToAttribute(a, "width");
					this.lengthToAttribute(a, "height");
				},
				lengthToStyle: function(a, b, c) {
					c = c || b;
					if (!(c in a.styles)) {
						var d = a.attributes[b];
						if (d) {
							if (/^\d+$/.test(d)) {
								d = d + "px";
							}
							a.styles[c] = d;
						}
					}
					delete a.attributes[b];
				},
				lengthToAttribute: function(a, b, c) {
					c = c || b;
					if (!(c in a.attributes)) {
						var d = a.styles[b];
						var f = d && d.match(/^(\d+)(?:\.\d*)?px$/);
						if (f) {
							a.attributes[c] = f[1];
						} else {
							if (d == C$$0) {
								a.attributes[c] = C$$0;
							}
						}
					}
					delete a.styles[b];
				},
				alignmentToStyle: function(a) {
					if (!("float" in a.styles)) {
						var b = a.attributes.align;
						if (b == "left" || b == "right") {
							a.styles["float"] = b;
						}
					}
					delete a.attributes.align;
				},
				alignmentToAttribute: function(a) {
					if (!("align" in a.attributes)) {
						var b = a.styles["float"];
						if (b == "left" || b == "right") {
							a.attributes.align = b;
						}
					}
					delete a.styles["float"];
				},
				matchesStyle: B,
				transform: function(a, b) {
					if (typeof b == "string") {
						a.name = b;
					} else {
						var c = b.getDefinition();
						var d = c.styles;
						var f = c.attributes;
						var e;
						var g;
						var h;
						var l;
						a.name = c.element;
						for (e in f) {
							if (e == "class") {
								c = a.classes.join("|");
								h = f[e].split(/\s+/);
								for (; l = h.pop();) {
									if (c.indexOf(l) == -1) {
										a.classes.push(l);
									}
								}
							} else {
								a.attributes[e] = f[e];
							}
						}
						for (g in d) {
							a.styles[g] = d[g];
						}
					}
				}
			};
		})();
		(function() {
			CKEDITOR.focusManager = function(a) {
				if (a.focusManager) {
					return a.focusManager;
				}
				this.hasFocus = false;
				this.currentActive = null;
				this._ = {
					editor: a
				};
				return this;
			};
			CKEDITOR.focusManager._ = {
				blurDelay: 200
			};
			CKEDITOR.focusManager.prototype = {
				focus: function(a) {
					if (this._.timer) {
						clearTimeout(this._.timer);
					}
					if (a) {
						this.currentActive = a;
					}
					if (!this.hasFocus && !this._.locked) {
						if (a = CKEDITOR.currentInstance) {
							a.focusManager.blur(1);
						}
						this.hasFocus = true;
						if (a = this._.editor.container) {
							a.addClass("cke_focus");
						}
						this._.editor.fire("focus");
					}
				},
				lock: function() {
					this._.locked = 1;
				},
				unlock: function() {
					delete this._.locked;
				},
				blur: function(a$$0) {
					function e() {
						if (this.hasFocus) {
							this.hasFocus = false;
							var a = this._.editor.container;
							if (a) {
								a.removeClass("cke_focus");
							}
							this._.editor.fire("blur");
						}
					}
					if (!this._.locked) {
						if (this._.timer) {
							clearTimeout(this._.timer);
						}
						var b = CKEDITOR.focusManager._.blurDelay;
						if (a$$0 || !b) {
							e.call(this);
						} else {
							this._.timer = CKEDITOR.tools.setTimeout(function() {
								delete this._.timer;
								e.call(this);
							}, b, this);
						}
					}
				},
				add: function(a, e) {
					var b = a.getCustomData("focusmanager");
					if (!b || b != this) {
						if (b) {
							b.remove(a);
						}
						b = "focus";
						var d = "blur";
						if (e) {
							if (CKEDITOR.env.ie) {
								b = "focusin";
								d = "focusout";
							} else {
								CKEDITOR.event.useCapture = 1;
							}
						}
						var f = {
							blur: function() {
								if (a.equals(this.currentActive)) {
									this.blur();
								}
							},
							focus: function() {
								this.focus(a);
							}
						};
						a.on(b, f.focus, this);
						a.on(d, f.blur, this);
						if (e) {
							CKEDITOR.event.useCapture = 0;
						}
						a.setCustomData("focusmanager", this);
						a.setCustomData("focusmanager_handlers", f);
					}
				},
				remove: function(a) {
					a.removeCustomData("focusmanager");
					var e = a.removeCustomData("focusmanager_handlers");
					a.removeListener("blur", e.blur);
					a.removeListener("focus", e.focus);
				}
			};
		})();
		CKEDITOR.keystrokeHandler = function(a) {
			if (a.keystrokeHandler) {
				return a.keystrokeHandler;
			}
			this.keystrokes = {};
			this.blockedKeystrokes = {};
			this._ = {
				editor: a
			};
			return this;
		};
		(function() {
			var a$$0;
			var e$$0 = function(b) {
				b = b.data;
				var f = b.getKeystroke();
				var c = this.keystrokes[f];
				var e = this._.editor;
				a$$0 = e.fire("key", {
					keyCode: f,
					domEvent: b
				}) === false;
				if (!a$$0) {
					if (c) {
						a$$0 = e.execCommand(c, {
							from: "keystrokeHandler"
						}) !== false;
					}
					if (!a$$0) {
						a$$0 = !!this.blockedKeystrokes[f];
					}
				}
				if (a$$0) {
					b.preventDefault(true);
				}
				return !a$$0;
			};
			var b$$0 = function(b) {
				if (a$$0) {
					a$$0 = false;
					b.data.preventDefault(true);
				}
			};
			CKEDITOR.keystrokeHandler.prototype = {
				attach: function(a) {
					a.on("keydown", e$$0, this);
					if (CKEDITOR.env.gecko && CKEDITOR.env.mac) {
						a.on("keypress", b$$0, this);
					}
				}
			};
		})();
		(function() {
			CKEDITOR.lang = {
				languages: {
					af: 1,
					ar: 1,
					bg: 1,
					bn: 1,
					bs: 1,
					ca: 1,
					cs: 1,
					cy: 1,
					da: 1,
					de: 1,
					el: 1,
					"en-au": 1,
					"en-ca": 1,
					"en-gb": 1,
					en: 1,
					eo: 1,
					es: 1,
					et: 1,
					eu: 1,
					fa: 1,
					fi: 1,
					fo: 1,
					"fr-ca": 1,
					fr: 1,
					gl: 1,
					gu: 1,
					he: 1,
					hi: 1,
					hr: 1,
					hu: 1,
					id: 1,
					is: 1,
					it: 1,
					ja: 1,
					ka: 1,
					km: 1,
					ko: 1,
					ku: 1,
					lt: 1,
					lv: 1,
					mk: 1,
					mn: 1,
					ms: 1,
					nb: 1,
					nl: 1,
					no: 1,
					pl: 1,
					"pt-br": 1,
					pt: 1,
					ro: 1,
					ru: 1,
					si: 1,
					sk: 1,
					sl: 1,
					sq: 1,
					"sr-latn": 1,
					sr: 1,
					sv: 1,
					th: 1,
					tr: 1,
					tt: 1,
					ug: 1,
					uk: 1,
					vi: 1,
					"zh-cn": 1,
					zh: 1
				},
				rtl: {
					ar: 1,
					fa: 1,
					he: 1,
					ku: 1,
					ug: 1
				},
				load: function(a, e, b) {
					if (!a || !CKEDITOR.lang.languages[a]) {
						a = this.detect(e, a);
					}
					var d = this;
					e = function() {
						d[a].dir = d.rtl[a] ? "rtl" : "ltr";
						b(a, d[a]);
					};
					if (this[a]) {
						e();
					} else {
						CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("lang/" + a + ".js"), e, this);
					}
				},
				detect: function(a$$0, e) {
					var b = this.languages;
					e = e || (navigator.userLanguage || (navigator.language || a$$0));
					var d = e.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/);
					var f = d[1];
					d = d[2];
					if (b[f + "-" + d]) {
						f = f + "-" + d;
					} else {
						if (!b[f]) {
							f = null;
						}
					}
					CKEDITOR.lang.detect = f ? function() {
						return f;
					} : function(a) {
						return a;
					};
					return f || a$$0;
				}
			};
		})();
		CKEDITOR.scriptLoader = function() {
			var a$$0 = {};
			var e$$0 = {};
			return {
				load: function(b$$0, d$$0, f$$0, c$$0) {
					var h = typeof b$$0 == "string";
					if (h) {
						b$$0 = [b$$0];
					}
					if (!f$$0) {
						f$$0 = CKEDITOR;
					}
					var j = b$$0.length;
					var g = [];
					var i = [];
					var k = function(a) {
						if (d$$0) {
							if (h) {
								d$$0.call(f$$0, a);
							} else {
								d$$0.call(f$$0, g, i);
							}
						}
					};
					if (j === 0) {
						k(true);
					} else {
						var n = function(a, b) {
							(b ? g : i).push(a);
							if (--j <= 0) {
								if (c$$0) {
									CKEDITOR.document.getDocumentElement().removeStyle("cursor");
								}
								k(b);
							}
						};
						var o = function(b, c) {
							a$$0[b] = 1;
							var d = e$$0[b];
							delete e$$0[b];
							var f = 0;
							for (; f < d.length; f++) {
								d[f](b, c);
							}
						};
						var r = function(b) {
							if (a$$0[b]) {
								n(b, true);
							} else {
								var c = e$$0[b] || (e$$0[b] = []);
								c.push(n);
								if (!(c.length > 1)) {
									var f = new CKEDITOR.dom.element("script");
									f.setAttributes({
										type: "text/javascript",
										src: b
									});
									if (d$$0) {
										if (CKEDITOR.env.ie && CKEDITOR.env.version < 11) {
											f.$.onreadystatechange = function() {
												if (f.$.readyState == "loaded" || f.$.readyState == "complete") {
													f.$.onreadystatechange = null;
													o(b, true);
												}
											};
										} else {
											f.$.onload = function() {
												setTimeout(function() {
													o(b, true);
												}, 0);
											};
											f.$.onerror = function() {
												o(b, false);
											};
										}
									}
									f.appendTo(CKEDITOR.document.getHead());
								}
							}
						};
						if (c$$0) {
							CKEDITOR.document.getDocumentElement().setStyle("cursor", "wait");
						}
						var l = 0;
						for (; l < j; l++) {
							r(b$$0[l]);
						}
					}
				},
				queue: function() {
					function a() {
						var b;
						if (b = d[0]) {
							this.load(b.scriptUrl, b.callback, CKEDITOR, 0);
						}
					}
					var d = [];
					return function(f, c) {
						var e = this;
						d.push({
							scriptUrl: f,
							callback: function() {
								if (c) {
									c.apply(this, arguments);
								}
								d.shift();
								a.call(e);
							}
						});
						if (d.length == 1) {
							a.call(this);
						}
					};
				}()
			};
		}();
		CKEDITOR.resourceManager = function(a, e) {
			this.basePath = a;
			this.fileName = e;
			this.registered = {};
			this.loaded = {};
			this.externals = {};
			this._ = {
				waitingList: {}
			};
		};
		CKEDITOR.resourceManager.prototype = {
			add: function(a, e) {
				if (this.registered[a]) {
					throw '[CKEDITOR.resourceManager.add] The resource name "' + a + '" is already registered.';
				}
				var b = this.registered[a] = e || {};
				b.name = a;
				b.path = this.getPath(a);
				CKEDITOR.fire(a + CKEDITOR.tools.capitalize(this.fileName) + "Ready", b);
				return this.get(a);
			},
			get: function(a) {
				return this.registered[a] || null;
			},
			getPath: function(a) {
				var e = this.externals[a];
				return CKEDITOR.getUrl(e && e.dir || this.basePath + a + "/");
			},
			getFilePath: function(a) {
				var e = this.externals[a];
				return CKEDITOR.getUrl(this.getPath(a) + (e ? e.file : this.fileName + ".js"));
			},
			addExternal: function(a$$0, e, b) {
				a$$0 = a$$0.split(",");
				var d = 0;
				for (; d < a$$0.length; d++) {
					var f = a$$0[d];
					if (!b) {
						e = e.replace(/[^\/]+$/, function(a) {
							b = a;
							return "";
						});
					}
					this.externals[f] = {
						dir: e,
						file: b || this.fileName + ".js"
					};
				}
			},
			load: function(a$$0, e, b) {
				if (!CKEDITOR.tools.isArray(a$$0)) {
					a$$0 = a$$0 ? [a$$0] : [];
				}
				var d = this.loaded;
				var f$$0 = this.registered;
				var c$$0 = [];
				var h = {};
				var j = {};
				var g$$0 = 0;
				for (; g$$0 < a$$0.length; g$$0++) {
					var i$$0 = a$$0[g$$0];
					if (i$$0) {
						if (!d[i$$0] && !f$$0[i$$0]) {
							var k$$0 = this.getFilePath(i$$0);
							c$$0.push(k$$0);
							if (!(k$$0 in h)) {
								h[k$$0] = [];
							}
							h[k$$0].push(i$$0);
						} else {
							j[i$$0] = this.get(i$$0);
						}
					}
				}
				CKEDITOR.scriptLoader.load(c$$0, function(a, c) {
					if (c.length) {
						throw '[CKEDITOR.resourceManager.load] Resource name "' + h[c[0]].join(",") + '" was not found at "' + c[0] + '".';
					}
					var f = 0;
					for (; f < a.length; f++) {
						var g = h[a[f]];
						var i = 0;
						for (; i < g.length; i++) {
							var k = g[i];
							j[k] = this.get(k);
							d[k] = 1;
						}
					}
					e.call(b, j);
				}, this);
			}
		};
		CKEDITOR.plugins = new CKEDITOR.resourceManager("plugins/", "plugin");
		CKEDITOR.plugins.load = CKEDITOR.tools.override(CKEDITOR.plugins.load, function(a$$0) {
			var e = {};
			return function(b$$1, d, f) {
				var c = {};
				var h = function(b$$0) {
					a$$0.call(this, b$$0, function(a) {
						CKEDITOR.tools.extend(c, a);
						var b = [];
						var j;
						for (j in a) {
							var n = a[j];
							var o = n && n.requires;
							if (!e[j]) {
								if (n.icons) {
									var r = n.icons.split(",");
									var l = r.length;
									for (; l--;) {
										CKEDITOR.skin.addIcon(r[l], n.path + "icons/" + (CKEDITOR.env.hidpi && n.hidpi ? "hidpi/" : "") + r[l] + ".png");
									}
								}
								e[j] = 1;
							}
							if (o) {
								if (o.split) {
									o = o.split(",");
								}
								n = 0;
								for (; n < o.length; n++) {
									if (!c[o[n]]) {
										b.push(o[n]);
									}
								}
							}
						}
						if (b.length) {
							h.call(this, b);
						} else {
							for (j in c) {
								n = c[j];
								if (n.onLoad && !n.onLoad._called) {
									if (n.onLoad() === false) {
										delete c[j];
									}
									n.onLoad._called = 1;
								}
							}
							if (d) {
								d.call(f || window, c);
							}
						}
					}, this);
				};
				h.call(this, b$$1);
			};
		});
		CKEDITOR.plugins.setLang = function(a, e, b) {
			var d = this.get(a);
			a = d.langEntries || (d.langEntries = {});
			d = d.lang || (d.lang = []);
			if (d.split) {
				d = d.split(",");
			}
			if (CKEDITOR.tools.indexOf(d, e) == -1) {
				d.push(e);
			}
			a[e] = b;
		};
		CKEDITOR.ui = function(a) {
			if (a.ui) {
				return a.ui;
			}
			this.items = {};
			this.instances = {};
			this.editor = a;
			this._ = {
				handlers: {}
			};
			return this;
		};
		CKEDITOR.ui.prototype = {
			add: function(a, e, b) {
				b.name = a.toLowerCase();
				var d = this.items[a] = {
					type: e,
					command: b.command || null,
					args: Array.prototype.slice.call(arguments, 2)
				};
				CKEDITOR.tools.extend(d, b);
			},
			get: function(a) {
				return this.instances[a];
			},
			create: function(a) {
				var e = this.items[a];
				var b = e && this._.handlers[e.type];
				var d = e && (e.command && this.editor.getCommand(e.command));
				b = b && b.create.apply(this, e.args);
				this.instances[a] = b;
				if (d) {
					d.uiItems.push(b);
				}
				if (b && !b.type) {
					b.type = e.type;
				}
				return b;
			},
			addHandler: function(a, e) {
				this._.handlers[a] = e;
			},
			space: function(a) {
				return CKEDITOR.document.getById(this.spaceId(a));
			},
			spaceId: function(a) {
				return this.editor.id + "_" + a;
			}
		};
		CKEDITOR.event.implementOn(CKEDITOR.ui);
		(function() {
			function a$$1(a$$0, c, d) {
				CKEDITOR.event.call(this);
				a$$0 = a$$0 && CKEDITOR.tools.clone(a$$0);
				if (c !== void 0) {
					if (c instanceof CKEDITOR.dom.element) {
						if (!d) {
							throw Error("One of the element modes must be specified.");
						}
					} else {
						throw Error("Expect element of type CKEDITOR.dom.element.");
					}
					if (CKEDITOR.env.ie && (CKEDITOR.env.quirks && d == CKEDITOR.ELEMENT_MODE_INLINE)) {
						throw Error("Inline element mode is not supported on IE quirks.");
					}
					if (!(d == CKEDITOR.ELEMENT_MODE_INLINE ? c.is(CKEDITOR.dtd.$editable) || c.is("textarea") : d == CKEDITOR.ELEMENT_MODE_REPLACE ? !c.is(CKEDITOR.dtd.$nonBodyContent) : 1)) {
						throw Error('The specified element mode is not supported on element: "' + c.getName() + '".');
					}
					this.element = c;
					this.elementMode = d;
					this.name = this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO && (c.getId() || c.getNameAtt());
				} else {
					this.elementMode = CKEDITOR.ELEMENT_MODE_NONE;
				}
				this._ = {};
				this.commands = {};
				this.templates = {};
				this.name = this.name || e$$2();
				this.id = CKEDITOR.tools.getNextId();
				this.status = "unloaded";
				this.config = CKEDITOR.tools.prototypedCopy(CKEDITOR.config);
				this.ui = new CKEDITOR.ui(this);
				this.focusManager = new CKEDITOR.focusManager(this);
				this.keystrokeHandler = new CKEDITOR.keystrokeHandler(this);
				this.on("readOnly", b$$1);
				this.on("selectionChange", function(a) {
					f$$1(this, a.data.path);
				});
				this.on("activeFilterChange", function() {
					f$$1(this, this.elementPath(), true);
				});
				this.on("mode", b$$1);
				this.on("instanceReady", function() {
					if (this.config.startupFocus) {
						this.focus();
					}
				});
				CKEDITOR.fire("instanceCreated", null, this);
				CKEDITOR.add(this);
				CKEDITOR.tools.setTimeout(function() {
					h$$1(this, a$$0);
				}, 0, this);
			}

			function e$$2() {
				do {
					var a = "editor" + ++o
				} while (CKEDITOR.instances[a]);
				return a;
			}

			function b$$1() {
				var a = this.commands;
				var b;
				for (b in a) {
					d$$1(this, a[b]);
				}
			}

			function d$$1(a, b) {
				b[b.startDisabled ? "disable" : a.readOnly && !b.readOnly ? "disable" : b.modes[a.mode] ? "enable" : "disable"]();
			}

			function f$$1(a, b, c) {
				if (b) {
					var d;
					var f;
					var e = a.commands;
					for (f in e) {
						d = e[f];
						if (c || d.contextSensitive) {
							d.refresh(a, b);
						}
					}
				}
			}

			function c$$2(a) {
				var b = a.config.customConfig;
				if (!b) {
					return false;
				}
				b = CKEDITOR.getUrl(b);
				var d = r[b] || (r[b] = {});
				if (d.fn) {
					d.fn.call(a, a.config);
					if (CKEDITOR.getUrl(a.config.customConfig) == b || !c$$2(a)) {
						a.fireOnce("customConfigLoaded");
					}
				} else {
					CKEDITOR.scriptLoader.queue(b, function() {
						d.fn = CKEDITOR.editorConfig ? CKEDITOR.editorConfig : function() {};
						c$$2(a);
					});
				}
				return true;
			}

			function h$$1(a, b) {
				a.on("customConfigLoaded", function() {
					if (b) {
						if (b.on) {
							var c;
							for (c in b.on) {
								a.on(c, b.on[c]);
							}
						}
						CKEDITOR.tools.extend(a.config, b, true);
						delete a.config.on;
					}
					c = a.config;
					a.readOnly = !(!c.readOnly && !(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.is("textarea") ? a.element.hasAttribute("disabled") : a.element.isReadOnly() : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && a.element.hasAttribute("disabled")));
					a.blockless = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? !(a.element.is("textarea") || CKEDITOR.dtd[a.element.getName()].p) : false;
					a.tabIndex = c.tabIndex || (a.element && a.element.getAttribute("tabindex") || 0);
					a.activeEnterMode = a.enterMode = a.blockless ? CKEDITOR.ENTER_BR : c.enterMode;
					a.activeShiftEnterMode = a.shiftEnterMode = a.blockless ? CKEDITOR.ENTER_BR : c.shiftEnterMode;
					if (c.skin) {
						CKEDITOR.skinName = c.skin;
					}
					a.fireOnce("configLoaded");
					a.dataProcessor = new CKEDITOR.htmlDataProcessor(a);
					a.filter = a.activeFilter = new CKEDITOR.filter(a);
					j$$0(a);
				});
				if (b && b.customConfig != void 0) {
					a.config.customConfig = b.customConfig;
				}
				if (!c$$2(a)) {
					a.fireOnce("customConfigLoaded");
				}
			}

			function j$$0(a) {
				CKEDITOR.skin.loadPart("editor", function() {
					g$$1(a);
				});
			}

			function g$$1(a) {
				CKEDITOR.lang.load(a.config.language, a.config.defaultLanguage, function(b, c) {
					var d = a.config.title;
					a.langCode = b;
					a.lang = CKEDITOR.tools.prototypedCopy(c);
					a.title = typeof d == "string" || d === false ? d : [a.lang.editor, a.name].join(", ");
					if (!a.config.contentsLangDirection) {
						a.config.contentsLangDirection = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.getDirection(1) : a.lang.dir;
					}
					a.fire("langLoaded");
					i$$0(a);
				});
			}

			function i$$0(a) {
				a.getStylesSet(function(b) {
					a.once("loaded", function() {
						a.fire("stylesSet", {
							styles: b
						});
					}, null, null, 1);
					k$$0(a);
				});
			}

			function k$$0(a$$0) {
				var b$$0 = a$$0.config;
				var c$$1 = b$$0.plugins;
				var d$$0 = b$$0.extraPlugins;
				var f$$0 = b$$0.removePlugins;
				if (d$$0) {
					var e$$1 = RegExp("(?:^|,)(?:" + d$$0.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g");
					c$$1 = c$$1.replace(e$$1, "");
					c$$1 = c$$1 + ("," + d$$0);
				}
				if (f$$0) {
					var g$$0 = RegExp("(?:^|,)(?:" + f$$0.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g");
					c$$1 = c$$1.replace(g$$0, "");
				}
				if (CKEDITOR.env.air) {
					c$$1 = c$$1 + ",adobeair";
				}
				CKEDITOR.plugins.load(c$$1.split(","), function(c$$0) {
					var d = [];
					var f = [];
					var e$$0 = [];
					a$$0.plugins = c$$0;
					var h$$0;
					for (h$$0 in c$$0) {
						var j = c$$0[h$$0];
						var i = j.lang;
						var p = null;
						var k = j.requires;
						var x;
						if (CKEDITOR.tools.isArray(k)) {
							k = k.join(",");
						}
						if (k && (x = k.match(g$$0))) {
							for (; k = x.pop();) {
								CKEDITOR.tools.setTimeout(function(a, b) {
									throw Error('Plugin "' + a.replace(",", "") + '" cannot be removed from the plugins list, because it\'s required by "' + b + '" plugin.');
								}, 0, null, [k, h$$0]);
							}
						}
						if (i && !a$$0.lang[h$$0]) {
							if (i.split) {
								i = i.split(",");
							}
							if (CKEDITOR.tools.indexOf(i, a$$0.langCode) >= 0) {
								p = a$$0.langCode;
							} else {
								p = a$$0.langCode.replace(/-.*/, "");
								p = p != a$$0.langCode && CKEDITOR.tools.indexOf(i, p) >= 0 ? p : CKEDITOR.tools.indexOf(i, "en") >= 0 ? "en" : i[0];
							}
							if (!j.langEntries || !j.langEntries[p]) {
								e$$0.push(CKEDITOR.getUrl(j.path + "lang/" + p + ".js"));
							} else {
								a$$0.lang[h$$0] = j.langEntries[p];
								p = null;
							}
						}
						f.push(p);
						d.push(j);
					}
					CKEDITOR.scriptLoader.load(e$$0, function() {
						var c = ["beforeInit", "init", "afterInit"];
						var e = 0;
						for (; e < c.length; e++) {
							var g = 0;
							for (; g < d.length; g++) {
								var h = d[g];
								if (e === 0) {
									if (f[g] && (h.lang && h.langEntries)) {
										a$$0.lang[h.name] = h.langEntries[f[g]];
									}
								}
								if (h[c[e]]) {
									h[c[e]](a$$0);
								}
							}
						}
						a$$0.fireOnce("pluginsLoaded");
						if (b$$0.keystrokes) {
							a$$0.setKeystroke(a$$0.config.keystrokes);
						}
						g = 0;
						for (; g < a$$0.config.blockedKeystrokes.length; g++) {
							a$$0.keystrokeHandler.blockedKeystrokes[a$$0.config.blockedKeystrokes[g]] = 1;
						}
						a$$0.status = "loaded";
						a$$0.fireOnce("loaded");
						CKEDITOR.fire("instanceLoaded", null, a$$0);
					});
				});
			}

			function n() {
				var a = this.element;
				if (a && this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
					var b = this.getData();
					if (this.config.htmlEncodeOutput) {
						b = CKEDITOR.tools.htmlEncode(b);
					}
					if (a.is("textarea")) {
						a.setValue(b);
					} else {
						a.setHtml(b);
					}
					return true;
				}
				return false;
			}
			a$$1.prototype = CKEDITOR.editor.prototype;
			CKEDITOR.editor = a$$1;
			var o = 0;
			var r = {};
			CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
				addCommand: function(a, b) {
					b.name = a.toLowerCase();
					var c = new CKEDITOR.command(this, b);
					if (this.mode) {
						d$$1(this, c);
					}
					return this.commands[a] = c;
				},
				_attachToForm: function() {
					var a$$0 = this;
					var b = a$$0.element;
					var c$$0 = new CKEDITOR.dom.element(b.$.form);
					if (b.is("textarea") && c$$0) {
						var d = function(c) {
							a$$0.updateElement();
							if (a$$0._.required) {
								if (!b.getValue() && a$$0.fire("required") === false) {
									c.data.preventDefault();
								}
							}
						};
						c$$0.on("submit", d);
						if (c$$0.$.submit && (c$$0.$.submit.call && c$$0.$.submit.apply)) {
							c$$0.$.submit = CKEDITOR.tools.override(c$$0.$.submit, function(a) {
								return function() {
									d();
									if (a.apply) {
										a.apply(this);
									} else {
										a();
									}
								};
							});
						}
						a$$0.on("destroy", function() {
							c$$0.removeListener("submit", d);
						});
					}
				},
				destroy: function(a) {
					this.fire("beforeDestroy");
					if (!a) {
						n.call(this);
					}
					this.editable(null);
					this.status = "destroyed";
					this.fire("destroy");
					this.removeAllListeners();
					CKEDITOR.remove(this);
					CKEDITOR.fire("instanceDestroyed", null, this);
				},
				elementPath: function(a) {
					if (!a) {
						a = this.getSelection();
						if (!a) {
							return null;
						}
						a = a.getStartElement();
					}
					return a ? new CKEDITOR.dom.elementPath(a, this.editable()) : null;
				},
				createRange: function() {
					var a = this.editable();
					return a ? new CKEDITOR.dom.range(a) : null;
				},
				execCommand: function(a, b) {
					var c = this.getCommand(a);
					var d = {
						name: a,
						commandData: b,
						command: c
					};
					if (c && (c.state != CKEDITOR.TRISTATE_DISABLED && this.fire("beforeCommandExec", d) !== false)) {
						d.returnValue = c.exec(d.commandData);
						if (!c.async && this.fire("afterCommandExec", d) !== false) {
							return d.returnValue;
						}
					}
					return false;
				},
				getCommand: function(a) {
					return this.commands[a];
				},
				getData: function(a) {
					if (!a) {
						this.fire("beforeGetData");
					}
					var b = this._.data;
					if (typeof b != "string") {
						b = (b = this.element) && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? b.is("textarea") ? b.getValue() : b.getHtml() : "";
					}
					b = {
						dataValue: b
					};
					if (!a) {
						this.fire("getData", b);
					}
					return b.dataValue;
				},
				getSnapshot: function() {
					var a = this.fire("getSnapshot");
					if (typeof a != "string") {
						var b = this.element;
						if (b) {
							if (this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE) {
								a = b.is("textarea") ? b.getValue() : b.getHtml();
							}
						}
					}
					return a;
				},
				loadSnapshot: function(a) {
					this.fire("loadSnapshot", a);
				},
				setData: function(a$$0, b, c) {
					if (!c) {
						this.fire("saveSnapshot");
					}
					if (b || !c) {
						this.once("dataReady", function(a) {
							if (!c) {
								this.fire("saveSnapshot");
							}
							if (b) {
								b.call(a.editor);
							}
						});
					}
					a$$0 = {
						dataValue: a$$0
					};
					if (!c) {
						this.fire("setData", a$$0);
					}
					this._.data = a$$0.dataValue;
					if (!c) {
						this.fire("afterSetData", a$$0);
					}
				},
				setReadOnly: function(a) {
					a = a == void 0 || a;
					if (this.readOnly != a) {
						this.readOnly = a;
						this.keystrokeHandler.blockedKeystrokes[8] = +a;
						this.editable().setReadOnly(a);
						this.fire("readOnly");
					}
				},
				insertHtml: function(a, b) {
					this.fire("insertHtml", {
						dataValue: a,
						mode: b
					});
				},
				insertText: function(a) {
					this.fire("insertText", a);
				},
				insertElement: function(a) {
					this.fire("insertElement", a);
				},
				focus: function() {
					this.fire("beforeFocus");
				},
				checkDirty: function() {
					return this.status == "ready" && this._.previousValue !== this.getSnapshot();
				},
				resetDirty: function() {
					this._.previousValue = this.getSnapshot();
				},
				updateElement: function() {
					return n.call(this);
				},
				setKeystroke: function() {
					var a = this.keystrokeHandler.keystrokes;
					var b = CKEDITOR.tools.isArray(arguments[0]) ? arguments[0] : [
						[].slice.call(arguments, 0)
					];
					var c;
					var d;
					var f = b.length;
					for (; f--;) {
						c = b[f];
						d = 0;
						if (CKEDITOR.tools.isArray(c)) {
							d = c[1];
							c = c[0];
						}
						if (d) {
							a[c] = d;
						} else {
							delete a[c];
						}
					}
				},
				addFeature: function(a) {
					return this.filter.addFeature(a);
				},
				setActiveFilter: function(a) {
					if (!a) {
						a = this.filter;
					}
					if (this.activeFilter !== a) {
						this.activeFilter = a;
						this.fire("activeFilterChange");
						if (a === this.filter) {
							this.setActiveEnterMode(null, null);
						} else {
							this.setActiveEnterMode(a.getAllowedEnterMode(this.enterMode), a.getAllowedEnterMode(this.shiftEnterMode, true));
						}
					}
				},
				setActiveEnterMode: function(a, b) {
					a = a ? this.blockless ? CKEDITOR.ENTER_BR : a : this.enterMode;
					b = b ? this.blockless ? CKEDITOR.ENTER_BR : b : this.shiftEnterMode;
					if (this.activeEnterMode != a || this.activeShiftEnterMode != b) {
						this.activeEnterMode = a;
						this.activeShiftEnterMode = b;
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
				htmlPartsRegex: RegExp("<(?:(?:\\/([^>]+)>)|(?:!--([\\S|\\s]*?)--\x3e)|(?:([^\\s>]+)\\s*((?:(?:\"[^\"]*\")|(?:'[^']*')|[^\"'>])*)\\/?>))", "g")
			};
		};
		(function() {
			var a = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g;
			var e = {
				checked: 1,
				compact: 1,
				declare: 1,
				defer: 1,
				disabled: 1,
				ismap: 1,
				multiple: 1,
				nohref: 1,
				noresize: 1,
				noshade: 1,
				nowrap: 1,
				readonly: 1,
				selected: 1
			};
			CKEDITOR.htmlParser.prototype = {
				onTagOpen: function() {},
				onTagClose: function() {},
				onText: function() {},
				onCDATA: function() {},
				onComment: function() {},
				parse: function(b) {
					var d;
					var f;
					var c = 0;
					var h;
					for (; d = this._.htmlPartsRegex.exec(b);) {
						f = d.index;
						if (f > c) {
							c = b.substring(c, f);
							if (h) {
								h.push(c);
							} else {
								this.onText(c);
							}
						}
						c = this._.htmlPartsRegex.lastIndex;
						if (f = d[1]) {
							f = f.toLowerCase();
							if (h && CKEDITOR.dtd.$cdata[f]) {
								this.onCDATA(h.join(""));
								h = null;
							}
							if (!h) {
								this.onTagClose(f);
								continue;
							}
						}
						if (h) {
							h.push(d[0]);
						} else {
							if (f = d[3]) {
								f = f.toLowerCase();
								if (!/="/.test(f)) {
									var j = {};
									var g;
									d = d[4];
									var i = !!(d && d.charAt(d.length - 1) == "/");
									if (d) {
										for (; g = a.exec(d);) {
											var k = g[1].toLowerCase();
											g = g[2] || (g[3] || (g[4] || ""));
											j[k] = !g && e[k] ? k : CKEDITOR.tools.htmlDecodeAttr(g);
										}
									}
									this.onTagOpen(f, j, i);
									if (!h) {
										if (CKEDITOR.dtd.$cdata[f]) {
											h = [];
										}
									}
								}
							} else {
								if (f = d[2]) {
									this.onComment(f);
								}
							}
						}
					}
					if (b.length > c) {
						this.onText(b.substring(c, b.length));
					}
				}
			};
		})();
		CKEDITOR.htmlParser.basicWriter = CKEDITOR.tools.createClass({
			$: function() {
				this._ = {
					output: []
				};
			},
			proto: {
				openTag: function(a) {
					this._.output.push("<", a);
				},
				openTagClose: function(a, e) {
					if (e) {
						this._.output.push(" />");
					} else {
						this._.output.push(">");
					}
				},
				attribute: function(a, e) {
					if (typeof e == "string") {
						e = CKEDITOR.tools.htmlEncodeAttr(e);
					}
					this._.output.push(" ", a, '="', e, '"');
				},
				closeTag: function(a) {
					this._.output.push("</", a, ">");
				},
				text: function(a) {
					this._.output.push(a);
				},
				comment: function(a) {
					this._.output.push("\x3c!--", a, "--\x3e");
				},
				write: function(a) {
					this._.output.push(a);
				},
				reset: function() {
					this._.output = [];
					this._.indent = false;
				},
				getHtml: function(a) {
					var e = this._.output.join("");
					if (a) {
						this.reset();
					}
					return e;
				}
			}
		});
		"use strict";
		(function() {
			CKEDITOR.htmlParser.node = function() {};
			CKEDITOR.htmlParser.node.prototype = {
				remove: function() {
					var a = this.parent.children;
					var e = CKEDITOR.tools.indexOf(a, this);
					var b = this.previous;
					var d = this.next;
					if (b) {
						b.next = d;
					}
					if (d) {
						d.previous = b;
					}
					a.splice(e, 1);
					this.parent = null;
				},
				replaceWith: function(a) {
					var e = this.parent.children;
					var b = CKEDITOR.tools.indexOf(e, this);
					var d = a.previous = this.previous;
					var f = a.next = this.next;
					if (d) {
						d.next = a;
					}
					if (f) {
						f.previous = a;
					}
					e[b] = a;
					a.parent = this.parent;
					this.parent = null;
				},
				insertAfter: function(a) {
					var e = a.parent.children;
					var b = CKEDITOR.tools.indexOf(e, a);
					var d = a.next;
					e.splice(b + 1, 0, this);
					this.next = a.next;
					this.previous = a;
					a.next = this;
					if (d) {
						d.previous = this;
					}
					this.parent = a.parent;
				},
				insertBefore: function(a) {
					var e = a.parent.children;
					var b = CKEDITOR.tools.indexOf(e, a);
					e.splice(b, 0, this);
					this.next = a;
					if (this.previous = a.previous) {
						a.previous.next = this;
					}
					a.previous = this;
					this.parent = a.parent;
				},
				getAscendant: function(a) {
					var e = typeof a == "function" ? a : typeof a == "string" ? function(b) {
						return b.name == a;
					} : function(b) {
						return b.name in a;
					};
					var b$$0 = this.parent;
					for (; b$$0 && b$$0.type == CKEDITOR.NODE_ELEMENT;) {
						if (e(b$$0)) {
							return b$$0;
						}
						b$$0 = b$$0.parent;
					}
					return null;
				},
				wrapWith: function(a) {
					this.replaceWith(a);
					a.add(this);
					return a;
				},
				getIndex: function() {
					return CKEDITOR.tools.indexOf(this.parent.children, this);
				},
				getFilterContext: function(a) {
					return a || {};
				}
			};
		})();
		"use strict";
		CKEDITOR.htmlParser.comment = function(a) {
			this.value = a;
			this._ = {
				isBlockLike: false
			};
		};
		CKEDITOR.htmlParser.comment.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
			type: CKEDITOR.NODE_COMMENT,
			filter: function(a, e) {
				var b = this.value;
				if (!(b = a.onComment(e, b, this))) {
					this.remove();
					return false;
				}
				if (typeof b != "string") {
					this.replaceWith(b);
					return false;
				}
				this.value = b;
				return true;
			},
			writeHtml: function(a, e) {
				if (e) {
					this.filter(e);
				}
				a.comment(this.value);
			}
		});
		"use strict";
		(function() {
			CKEDITOR.htmlParser.text = function(a) {
				this.value = a;
				this._ = {
					isBlockLike: false
				};
			};
			CKEDITOR.htmlParser.text.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
				type: CKEDITOR.NODE_TEXT,
				filter: function(a, e) {
					if (!(this.value = a.onText(e, this.value, this))) {
						this.remove();
						return false;
					}
				},
				writeHtml: function(a, e) {
					if (e) {
						this.filter(e);
					}
					a.text(this.value);
				}
			});
		})();
		"use strict";
		(function() {
			CKEDITOR.htmlParser.cdata = function(a) {
				this.value = a;
			};
			CKEDITOR.htmlParser.cdata.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
				type: CKEDITOR.NODE_TEXT,
				filter: function() {},
				writeHtml: function(a) {
					a.write(this.value);
				}
			});
		})();
		"use strict";
		CKEDITOR.htmlParser.fragment = function() {
			this.children = [];
			this.parent = null;
			this._ = {
				isBlockLike: true,
				hasInlineStarted: false
			};
		};
		(function() {
			function a$$0(a) {
				return a.attributes["data-cke-survive"] ? false : a.name == "a" && a.attributes.href || CKEDITOR.dtd.$removeEmpty[a.name];
			}
			var e$$0 = CKEDITOR.tools.extend({
				table: 1,
				ul: 1,
				ol: 1,
				dl: 1
			}, CKEDITOR.dtd.table, CKEDITOR.dtd.ul, CKEDITOR.dtd.ol, CKEDITOR.dtd.dl);
			var b$$0 = {
				ol: 1,
				ul: 1
			};
			var d$$0 = CKEDITOR.tools.extend({}, {
				html: 1
			}, CKEDITOR.dtd.html, CKEDITOR.dtd.body, CKEDITOR.dtd.head, {
				style: 1,
				script: 1
			});
			var f$$0 = {
				ul: "li",
				ol: "li",
				dl: "dd",
				table: "tbody",
				tbody: "tr",
				thead: "tr",
				tfoot: "tr",
				tr: "td"
			};
			CKEDITOR.htmlParser.fragment.fromHtml = function(c$$0, h$$0, j$$0) {
				function g$$0(a) {
					var b;
					if (s.length > 0) {
						var c = 0;
						for (; c < s.length; c++) {
							var d = s[c];
							var f = d.name;
							var e = CKEDITOR.dtd[f];
							var g = p.name && CKEDITOR.dtd[p.name];
							if ((!g || g[f]) && (!a || (!e || (e[a] || !CKEDITOR.dtd[a])))) {
								if (!b) {
									i();
									b = 1;
								}
								d = d.clone();
								d.parent = p;
								p = d;
								s.splice(c, 1);
								c--;
							} else {
								if (f == p.name) {
									n(p, p.parent, 1);
									c--;
								}
							}
						}
					}
				}

				function i() {
					for (; t.length;) {
						n(t.shift(), p);
					}
				}

				function k(a) {
					if (a._.isBlockLike && (a.name != "pre" && a.name != "textarea")) {
						var b = a.children.length;
						var c = a.children[b - 1];
						var d;
						if (c && c.type == CKEDITOR.NODE_TEXT) {
							if (d = CKEDITOR.tools.rtrim(c.value)) {
								c.value = d;
							} else {
								a.children.length = b - 1;
							}
						}
					}
				}

				function n(b, c, d) {
					c = c || (p || m);
					var f = p;
					if (b.previous === void 0) {
						if (o(c, b)) {
							p = c;
							l.onTagOpen(j$$0, {});
							b.returnPoint = c = p;
						}
						k(b);
						if (!a$$0(b) || b.children.length) {
							c.add(b);
						}
						if (b.name == "pre") {
							q = false;
						}
						if (b.name == "textarea") {
							x = false;
						}
					}
					if (b.returnPoint) {
						p = b.returnPoint;
						delete b.returnPoint;
					} else {
						p = d ? c : f;
					}
				}

				function o(a, b) {
					if ((a == m || a.name == "body") && (j$$0 && (!a.name || CKEDITOR.dtd[a.name][j$$0]))) {
						var c;
						var d;
						return (c = b.attributes && (d = b.attributes["data-cke-real-element-type"]) ? d : b.name) && (c in CKEDITOR.dtd.$inline && (!(c in CKEDITOR.dtd.head) && !b.isOrphan)) || b.type == CKEDITOR.NODE_TEXT;
					}
				}

				function r(a, b) {
					return a in CKEDITOR.dtd.$listItem || a in CKEDITOR.dtd.$tableContent ? a == b || (a == "dt" && b == "dd" || a == "dd" && b == "dt") : false;
				}
				var l = new CKEDITOR.htmlParser;
				var m = h$$0 instanceof CKEDITOR.htmlParser.element ? h$$0 : typeof h$$0 == "string" ? new CKEDITOR.htmlParser.element(h$$0) : new CKEDITOR.htmlParser.fragment;
				var s = [];
				var t = [];
				var p = m;
				var x = m.name == "textarea";
				var q = m.name == "pre";
				l.onTagOpen = function(c, f, h, j) {
					f = new CKEDITOR.htmlParser.element(c, f);
					if (f.isUnknown && h) {
						f.isEmpty = true;
					}
					f.isOptionalClose = j;
					if (a$$0(f)) {
						s.push(f);
					} else {
						if (c == "pre") {
							q = true;
						} else {
							if (c == "br" && q) {
								p.add(new CKEDITOR.htmlParser.text("\n"));
								return;
							}
							if (c == "textarea") {
								x = true;
							}
						}
						if (c == "br") {
							t.push(f);
						} else {
							for (;;) {
								j = (h = p.name) ? CKEDITOR.dtd[h] || (p._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : d$$0;
								if (!f.isUnknown && (!p.isUnknown && !j[c])) {
									if (p.isOptionalClose) {
										l.onTagClose(h);
									} else {
										if (c in b$$0 && h in b$$0) {
											h = p.children;
											if (!((h = h[h.length - 1]) && h.name == "li")) {
												n(h = new CKEDITOR.htmlParser.element("li"), p);
											}
											if (!f.returnPoint) {
												f.returnPoint = p;
											}
											p = h;
										} else {
											if (c in CKEDITOR.dtd.$listItem && !r(c, h)) {
												l.onTagOpen(c == "li" ? "ul" : "dl", {}, 0, 1);
											} else {
												if (h in e$$0 && !r(c, h)) {
													if (!f.returnPoint) {
														f.returnPoint = p;
													}
													p = p.parent;
												} else {
													if (h in CKEDITOR.dtd.$inline) {
														s.unshift(p);
													}
													if (p.parent) {
														n(p, p.parent, 1);
													} else {
														f.isOrphan = 1;
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
							g$$0(c);
							i();
							f.parent = p;
							if (f.isEmpty) {
								n(f);
							} else {
								p = f;
							}
						}
					}
				};
				l.onTagClose = function(a) {
					var b = s.length - 1;
					for (; b >= 0; b--) {
						if (a == s[b].name) {
							s.splice(b, 1);
							return;
						}
					}
					var c = [];
					var d = [];
					var f = p;
					for (; f != m && f.name != a;) {
						if (!f._.isBlockLike) {
							d.unshift(f);
						}
						c.push(f);
						f = f.returnPoint || f.parent;
					}
					if (f != m) {
						b = 0;
						for (; b < c.length; b++) {
							var e = c[b];
							n(e, e.parent);
						}
						p = f;
						if (f._.isBlockLike) {
							i();
						}
						n(f, f.parent);
						if (f == p) {
							p = p.parent;
						}
						s = s.concat(d);
					}
					if (a == "body") {
						j$$0 = false;
					}
				};
				l.onText = function(a) {
					if ((!p._.hasInlineStarted || t.length) && (!q && !x)) {
						a = CKEDITOR.tools.ltrim(a);
						if (a.length === 0) {
							return;
						}
					}
					var b = p.name;
					var c = b ? CKEDITOR.dtd[b] || (p._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : d$$0;
					if (!x && (!c["#"] && b in e$$0)) {
						l.onTagOpen(f$$0[b] || "");
						l.onText(a);
					} else {
						i();
						g$$0();
						if (!q) {
							if (!x) {
								a = a.replace(/[\t\r\n ]{2,}|[\t\r\n]/g, " ");
							}
						}
						a = new CKEDITOR.htmlParser.text(a);
						if (o(p, a)) {
							this.onTagOpen(j$$0, {}, 0, 1);
						}
						p.add(a);
					}
				};
				l.onCDATA = function(a) {
					p.add(new CKEDITOR.htmlParser.cdata(a));
				};
				l.onComment = function(a) {
					i();
					g$$0();
					p.add(new CKEDITOR.htmlParser.comment(a));
				};
				l.parse(c$$0);
				i();
				for (; p != m;) {
					n(p, p.parent, 1);
				}
				k(m);
				return m;
			};
			CKEDITOR.htmlParser.fragment.prototype = {
				type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
				add: function(a, b) {
					if (isNaN(b)) {
						b = this.children.length;
					}
					var d = b > 0 ? this.children[b - 1] : null;
					if (d) {
						if (a._.isBlockLike && d.type == CKEDITOR.NODE_TEXT) {
							d.value = CKEDITOR.tools.rtrim(d.value);
							if (d.value.length === 0) {
								this.children.pop();
								this.add(a);
								return;
							}
						}
						d.next = a;
					}
					a.previous = d;
					a.parent = this;
					this.children.splice(b, 0, a);
					if (!this._.hasInlineStarted) {
						this._.hasInlineStarted = a.type == CKEDITOR.NODE_TEXT || a.type == CKEDITOR.NODE_ELEMENT && !a._.isBlockLike;
					}
				},
				filter: function(a, b) {
					b = this.getFilterContext(b);
					a.onRoot(b, this);
					this.filterChildren(a, false, b);
				},
				filterChildren: function(a, b, d) {
					if (this.childrenFilteredBy != a.id) {
						d = this.getFilterContext(d);
						if (b && !this.parent) {
							a.onRoot(d, this);
						}
						this.childrenFilteredBy = a.id;
						b = 0;
						for (; b < this.children.length; b++) {
							if (this.children[b].filter(a, d) === false) {
								b--;
							}
						}
					}
				},
				writeHtml: function(a, b) {
					if (b) {
						this.filter(b);
					}
					this.writeChildrenHtml(a);
				},
				writeChildrenHtml: function(a, b, d) {
					var f = this.getFilterContext();
					if (d && (!this.parent && b)) {
						b.onRoot(f, this);
					}
					if (b) {
						this.filterChildren(b, false, f);
					}
					b = 0;
					d = this.children;
					f = d.length;
					for (; b < f; b++) {
						d[b].writeHtml(a);
					}
				},
				forEach: function(a, b, d) {
					if (!d && (!b || this.type == b)) {
						var f = a(this)
					}
					if (f !== false) {
						d = this.children;
						var e = 0;
						for (; e < d.length; e++) {
							f = d[e];
							if (f.type == CKEDITOR.NODE_ELEMENT) {
								f.forEach(a, b);
							} else {
								if (!b || f.type == b) {
									a(f);
								}
							}
						}
					}
				},
				getFilterContext: function(a) {
					return a || {};
				}
			};
		})();
		"use strict";
		(function() {
			function a$$0() {
				this.rules = [];
			}

			function e$$0(b, d, f, c) {
				var e;
				var j;
				for (e in d) {
					if (!(j = b[e])) {
						j = b[e] = new a$$0;
					}
					j.add(d[e], f, c);
				}
			}
			CKEDITOR.htmlParser.filter = CKEDITOR.tools.createClass({
				$: function(b) {
					this.id = CKEDITOR.tools.getNextNumber();
					this.elementNameRules = new a$$0;
					this.attributeNameRules = new a$$0;
					this.elementsRules = {};
					this.attributesRules = {};
					this.textRules = new a$$0;
					this.commentRules = new a$$0;
					this.rootRules = new a$$0;
					if (b) {
						this.addRules(b, 10);
					}
				},
				proto: {
					addRules: function(a, d) {
						var f;
						if (typeof d == "number") {
							f = d;
						} else {
							if (d && "priority" in d) {
								f = d.priority;
							}
						}
						if (typeof f != "number") {
							f = 10;
						}
						if (typeof d != "object") {
							d = {};
						}
						if (a.elementNames) {
							this.elementNameRules.addMany(a.elementNames, f, d);
						}
						if (a.attributeNames) {
							this.attributeNameRules.addMany(a.attributeNames, f, d);
						}
						if (a.elements) {
							e$$0(this.elementsRules, a.elements, f, d);
						}
						if (a.attributes) {
							e$$0(this.attributesRules, a.attributes, f, d);
						}
						if (a.text) {
							this.textRules.add(a.text, f, d);
						}
						if (a.comment) {
							this.commentRules.add(a.comment, f, d);
						}
						if (a.root) {
							this.rootRules.add(a.root, f, d);
						}
					},
					applyTo: function(a) {
						a.filter(this);
					},
					onElementName: function(a, d) {
						return this.elementNameRules.execOnName(a, d);
					},
					onAttributeName: function(a, d) {
						return this.attributeNameRules.execOnName(a, d);
					},
					onText: function(a, d, f) {
						return this.textRules.exec(a, d, f);
					},
					onComment: function(a, d, f) {
						return this.commentRules.exec(a, d, f);
					},
					onRoot: function(a, d) {
						return this.rootRules.exec(a, d);
					},
					onElement: function(a, d) {
						var f = [this.elementsRules["^"], this.elementsRules[d.name], this.elementsRules.$];
						var c;
						var e = 0;
						for (; e < 3; e++) {
							if (c = f[e]) {
								c = c.exec(a, d, this);
								if (c === false) {
									return null;
								}
								if (c && c != d) {
									return this.onNode(a, c);
								}
								if (d.parent && !d.name) {
									break;
								}
							}
						}
						return d;
					},
					onNode: function(a, d) {
						var f = d.type;
						return f == CKEDITOR.NODE_ELEMENT ? this.onElement(a, d) : f == CKEDITOR.NODE_TEXT ? new CKEDITOR.htmlParser.text(this.onText(a, d.value)) : f == CKEDITOR.NODE_COMMENT ? new CKEDITOR.htmlParser.comment(this.onComment(a, d.value)) : null;
					},
					onAttribute: function(a, d, f, c) {
						return (f = this.attributesRules[f]) ? f.exec(a, c, d, this) : c;
					}
				}
			});
			CKEDITOR.htmlParser.filterRulesGroup = a$$0;
			a$$0.prototype = {
				add: function(a, d, f) {
					this.rules.splice(this.findIndex(d), 0, {
						value: a,
						priority: d,
						options: f
					});
				},
				addMany: function(a, d, f) {
					var c = [this.findIndex(d), 0];
					var e = 0;
					var j = a.length;
					for (; e < j; e++) {
						c.push({
							value: a[e],
							priority: d,
							options: f
						});
					}
					this.rules.splice.apply(this.rules, c);
				},
				findIndex: function(a) {
					var d = this.rules;
					var f = d.length - 1;
					for (; f >= 0 && a < d[f].priority;) {
						f--;
					}
					return f + 1;
				},
				exec: function(a, d) {
					var f = d instanceof CKEDITOR.htmlParser.node || d instanceof CKEDITOR.htmlParser.fragment;
					var c = Array.prototype.slice.call(arguments, 1);
					var e = this.rules;
					var j = e.length;
					var g;
					var i;
					var k;
					var n;
					n = 0;
					for (; n < j; n++) {
						if (f) {
							g = d.type;
							i = d.name;
						}
						k = e[n];
						if (!(a.nonEditable && !k.options.applyToAll || a.nestedEditable && k.options.excludeNestedEditable)) {
							k = k.value.apply(null, c);
							if (k === false || f && (k && (k.name != i || k.type != g))) {
								return k;
							}
							if (k != void 0) {
								c[0] = d = k;
							}
						}
					}
					return d;
				},
				execOnName: function(a, d) {
					var f = 0;
					var c = this.rules;
					var e = c.length;
					var j;
					for (; d && f < e; f++) {
						j = c[f];
						if (!(a.nonEditable && !j.options.applyToAll || a.nestedEditable && j.options.excludeNestedEditable)) {
							d = d.replace(j.value[0], j.value[1]);
						}
					}
					return d;
				}
			};
		})();
		(function() {
			function a$$2(a$$0, e$$0) {
				function g(a) {
					return a || CKEDITOR.env.needsNbspFiller ? new CKEDITOR.htmlParser.text(" ") : new CKEDITOR.htmlParser.element("br", {
						"data-cke-bogus": 1
					});
				}

				function i$$0(a, f) {
					return function(e) {
						if (e.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
							var h = [];
							var i = b$$1(e);
							var y;
							var p;
							if (i) {
								if (j(i, 1)) {
									h.push(i);
								}
								for (; i;) {
									if (c$$1(i) && ((y = d$$1(i)) && j(y))) {
										if ((p = d$$1(y)) && !c$$1(p)) {
											h.push(y);
										} else {
											g(l).insertAfter(y);
											y.remove();
										}
									}
									i = i.previous;
								}
							}
							i = 0;
							for (; i < h.length; i++) {
								h[i].remove();
							}
							if (h = typeof f == "function" ? f(e) !== false : f) {
								if (!l && (!CKEDITOR.env.needsBrFiller && e.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)) {
									h = false;
								} else {
									if (!l && (!CKEDITOR.env.needsBrFiller && (document.documentMode > 7 || (e.name in CKEDITOR.dtd.tr || e.name in CKEDITOR.dtd.$listItem)))) {
										h = false;
									} else {
										h = b$$1(e);
										h = !h || e.name == "form" && h.name == "input";
									}
								}
							}
							if (h) {
								e.add(g(a));
							}
						}
					};
				}

				function j(a, b) {
					if ((!l || CKEDITOR.env.needsBrFiller) && (a.type == CKEDITOR.NODE_ELEMENT && (a.name == "br" && !a.attributes["data-cke-eol"]))) {
						return true;
					}
					var d;
					if (a.type == CKEDITOR.NODE_TEXT && (d = a.value.match(s))) {
						if (d.index) {
							(new CKEDITOR.htmlParser.text(a.value.substring(0, d.index))).insertBefore(a);
							a.value = d[0];
						}
						if (!CKEDITOR.env.needsBrFiller && (l && (!b || a.parent.name in k))) {
							return true;
						}
						if (!l) {
							if ((d = a.previous) && d.name == "br" || (!d || c$$1(d))) {
								return true;
							}
						}
					}
					return false;
				}
				var y$$0 = {
					elements: {}
				};
				var l = e$$0 == "html";
				var k = CKEDITOR.tools.extend({}, q);
				var E;
				for (E in k) {
					if (!("#" in p$$0[E])) {
						delete k[E];
					}
				}
				for (E in k) {
					y$$0.elements[E] = i$$0(l, a$$0.config.fillEmptyBlocks !== false);
				}
				y$$0.root = i$$0(l);
				y$$0.elements.br = function(a) {
					return function(b) {
						if (b.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
							var e = b.attributes;
							if ("data-cke-bogus" in e || "data-cke-eol" in e) {
								delete e["data-cke-bogus"];
							} else {
								e = b.next;
								for (; e && f$$1(e);) {
									e = e.next;
								}
								var i = d$$1(b);
								if (!e && c$$1(b.parent)) {
									h$$0(b.parent, g(a));
								} else {
									if (c$$1(e)) {
										if (i && !c$$1(i)) {
											g(a).insertBefore(e);
										}
									}
								}
							}
						}
					};
				}(l);
				return y$$0;
			}

			function e$$1(a, b) {
				return a != CKEDITOR.ENTER_BR && b !== false ? a == CKEDITOR.ENTER_DIV ? "div" : "p" : false;
			}

			function b$$1(a) {
				a = a.children[a.children.length - 1];
				for (; a && f$$1(a);) {
					a = a.previous;
				}
				return a;
			}

			function d$$1(a) {
				a = a.previous;
				for (; a && f$$1(a);) {
					a = a.previous;
				}
				return a;
			}

			function f$$1(a) {
				return a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(a.value) || a.type == CKEDITOR.NODE_ELEMENT && a.attributes["data-cke-bookmark"];
			}

			function c$$1(a) {
				return a && (a.type == CKEDITOR.NODE_ELEMENT && a.name in q || a.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT);
			}

			function h$$0(a, b) {
				var c = a.children[a.children.length - 1];
				a.children.push(b);
				b.parent = a;
				if (c) {
					c.next = b;
					b.previous = c;
				}
			}

			function j$$0(a) {
				a = a.attributes;
				if (a.contenteditable != "false") {
					a["data-cke-editable"] = a.contenteditable ? "true" : 1;
				}
				a.contenteditable = "false";
			}

			function g$$0(a) {
				a = a.attributes;
				switch (a["data-cke-editable"]) {
					case "true":
						a.contenteditable = "true";
						break;
					case "1":
						delete a.contenteditable;
				}
			}

			function i$$1(a$$1) {
				return a$$1.replace(w, function(a$$0, b$$0, c) {
					return "<" + b$$0 + c.replace(D, function(a, b) {
						return A.test(b) && c.indexOf("data-cke-saved-" + b) == -1 ? " data-cke-saved-" + a + " data-cke-" + CKEDITOR.rnd + "-" + a : a;
					}) + ">";
				});
			}

			function k$$0(a$$0, b$$0) {
				return a$$0.replace(b$$0, function(a, b, c) {
					if (a.indexOf("<textarea") === 0) {
						a = b + r(c).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</textarea>";
					}
					return "<cke:encoded>" + encodeURIComponent(a) + "</cke:encoded>";
				});
			}

			function n(a$$0) {
				return a$$0.replace(C, function(a, b) {
					return decodeURIComponent(b);
				});
			}

			function o(a$$0) {
				return a$$0.replace(/<\!--(?!{cke_protected})[\s\S]+?--\>/g, function(a) {
					return "\x3c!--" + t + "{C}" + encodeURIComponent(a).replace(/--/g, "%2D%2D") + "--\x3e";
				});
			}

			function r(a$$0) {
				return a$$0.replace(/<\!--\{cke_protected\}\{C\}([\s\S]+?)--\>/g, function(a, b) {
					return decodeURIComponent(b);
				});
			}

			function l$$0(a$$0, b$$0) {
				var c = b$$0._.dataStore;
				return a$$0.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g, function(a, b) {
					return decodeURIComponent(b);
				}).replace(/\{cke_protected_(\d+)\}/g, function(a, b) {
					return c && c[b] || "";
				});
			}

			function m(a$$1, b$$0) {
				var c$$0 = [];
				var d$$0 = b$$0.config.protectedSource;
				var f$$0 = b$$0._.dataStore || (b$$0._.dataStore = {
					id: 1
				});
				var e = /<\!--\{cke_temp(comment)?\}(\d*?)--\>/g;
				d$$0 = [/<script[\s\S]*?<\/script>/gi, /<noscript[\s\S]*?<\/noscript>/gi].concat(d$$0);
				a$$1 = a$$1.replace(/<\!--[\s\S]*?--\>/g, function(a) {
					return "\x3c!--{cke_tempcomment}" + (c$$0.push(a) - 1) + "--\x3e";
				});
				var g = 0;
				for (; g < d$$0.length; g++) {
					a$$1 = a$$1.replace(d$$0[g], function(a$$0) {
						a$$0 = a$$0.replace(e, function(a, b, d) {
							return c$$0[d];
						});
						return /cke_temp(comment)?/.test(a$$0) ? a$$0 : "\x3c!--{cke_temp}" + (c$$0.push(a$$0) - 1) + "--\x3e";
					});
				}
				a$$1 = a$$1.replace(e, function(a, b, d) {
					return "\x3c!--" + t + (b ? "{C}" : "") + encodeURIComponent(c$$0[d]).replace(/--/g, "%2D%2D") + "--\x3e";
				});
				a$$1 = a$$1.replace(/<\w+(?:\s+(?:(?:[^\s=>]+\s*=\s*(?:[^'"\s>]+|'[^']*'|"[^"]*"))|[^\s=>]+))+\s*>/g, function(a$$0) {
					return a$$0.replace(/<\!--\{cke_protected\}([^>]*)--\>/g, function(a, b) {
						f$$0[f$$0.id] = decodeURIComponent(b);
						return "{cke_protected_" + f$$0.id+++"}";
					});
				});
				return a$$1 = a$$1.replace(/<(title|iframe|textarea)([^>]*)>([\s\S]*?)<\/\1>/g, function(a, c, d, f) {
					return "<" + c + d + ">" + l$$0(r(f), b$$0) + "</" + c + ">";
				});
			}
			CKEDITOR.htmlDataProcessor = function(b$$0) {
				var c$$0;
				var d$$0;
				var f$$0 = this;
				this.editor = b$$0;
				this.dataFilter = c$$0 = new CKEDITOR.htmlParser.filter;
				this.htmlFilter = d$$0 = new CKEDITOR.htmlParser.filter;
				this.writer = new CKEDITOR.htmlParser.basicWriter;
				c$$0.addRules(u);
				c$$0.addRules(B, {
					applyToAll: true
				});
				c$$0.addRules(a$$2(b$$0, "data"), {
					applyToAll: true
				});
				d$$0.addRules(v);
				d$$0.addRules(z, {
					applyToAll: true
				});
				d$$0.addRules(a$$2(b$$0, "html"), {
					applyToAll: true
				});
				b$$0.on("toHtml", function(a) {
					a = a.data;
					var c = a.dataValue;
					c = m(c, b$$0);
					c = k$$0(c, K);
					c = i$$1(c);
					c = k$$0(c, I);
					c = c.replace(y$$1, "$1cke:$2");
					c = c.replace(H, "<cke:$1$2></cke:$1>");
					c = c.replace(/(<pre\b[^>]*>)(\r\n|\n)/g, "$1$2$2");
					c = c.replace(/([^a-z0-9<\-])(on\w{3,})(?!>)/gi, "$1data-cke-" + CKEDITOR.rnd + "-$2");
					var d = a.context || b$$0.editable().getName();
					var f;
					if (CKEDITOR.env.ie && (CKEDITOR.env.version < 9 && d == "pre")) {
						d = "div";
						c = "<pre>" + c + "</pre>";
						f = 1;
					}
					d = b$$0.document.createElement(d);
					d.setHtml("a" + c);
					c = d.getHtml().substr(1);
					c = c.replace(RegExp("data-cke-" + CKEDITOR.rnd + "-", "ig"), "");
					if (f) {
						c = c.replace(/^<pre>|<\/pre>$/gi, "");
					}
					c = c.replace(E$$0, "$1$2");
					c = n(c);
					c = r(c);
					a.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(c, a.context, a.fixForBody === false ? false : e$$1(a.enterMode, b$$0.config.autoParagraph));
				}, null, null, 5);
				b$$0.on("toHtml", function(a) {
					if (a.data.filter.applyTo(a.data.dataValue, true, a.data.dontFilter, a.data.enterMode)) {
						b$$0.fire("dataFiltered");
					}
				}, null, null, 6);
				b$$0.on("toHtml", function(a) {
					a.data.dataValue.filterChildren(f$$0.dataFilter, true);
				}, null, null, 10);
				b$$0.on("toHtml", function(a) {
					a = a.data;
					var b = a.dataValue;
					var c = new CKEDITOR.htmlParser.basicWriter;
					b.writeChildrenHtml(c);
					b = c.getHtml(true);
					a.dataValue = o(b);
				}, null, null, 15);
				b$$0.on("toDataFormat", function(a) {
					var c = a.data.dataValue;
					if (a.data.enterMode != CKEDITOR.ENTER_BR) {
						c = c.replace(/^<br *\/?>/i, "");
					}
					a.data.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(c, a.data.context, e$$1(a.data.enterMode, b$$0.config.autoParagraph));
				}, null, null, 5);
				b$$0.on("toDataFormat", function(a) {
					a.data.dataValue.filterChildren(f$$0.htmlFilter, true);
				}, null, null, 10);
				b$$0.on("toDataFormat", function(a) {
					a.data.filter.applyTo(a.data.dataValue, false, true);
				}, null, null, 11);
				b$$0.on("toDataFormat", function(a) {
					var c = a.data.dataValue;
					var d = f$$0.writer;
					d.reset();
					c.writeChildrenHtml(d);
					c = d.getHtml(true);
					c = r(c);
					c = l$$0(c, b$$0);
					a.data.dataValue = c;
				}, null, null, 15);
			};
			CKEDITOR.htmlDataProcessor.prototype = {
				toHtml: function(a, b, c, d) {
					var f = this.editor;
					var e;
					var g;
					var h;
					if (b && typeof b == "object") {
						e = b.context;
						c = b.fixForBody;
						d = b.dontFilter;
						g = b.filter;
						h = b.enterMode;
					} else {
						e = b;
					}
					if (!e) {
						if (e !== null) {
							e = f.editable().getName();
						}
					}
					return f.fire("toHtml", {
						dataValue: a,
						context: e,
						fixForBody: c,
						dontFilter: d,
						filter: g || f.filter,
						enterMode: h || f.enterMode
					}).dataValue;
				},
				toDataFormat: function(a, b) {
					var c;
					var d;
					var f;
					if (b) {
						c = b.context;
						d = b.filter;
						f = b.enterMode;
					}
					if (!c) {
						if (c !== null) {
							c = this.editor.editable().getName();
						}
					}
					return this.editor.fire("toDataFormat", {
						dataValue: a,
						filter: d || this.editor.filter,
						context: c,
						enterMode: f || this.editor.enterMode
					}).dataValue;
				}
			};
			var s = /(?:&nbsp;|\xa0)$/;
			var t = "{cke_protected}";
			var p$$0 = CKEDITOR.dtd;
			var x = ["caption", "colgroup", "col", "thead", "tfoot", "tbody"];
			var q = CKEDITOR.tools.extend({}, p$$0.$blockLimit, p$$0.$block);
			var u = {
				elements: {
					input: j$$0,
					textarea: j$$0
				}
			};
			var B = {
				attributeNames: [
					[/^on/, "data-cke-pa-on"],
					[/^data-cke-expando$/, ""]
				]
			};
			var v = {
				elements: {
					embed: function(a) {
						var b = a.parent;
						if (b && b.name == "object") {
							var c = b.attributes.width;
							b = b.attributes.height;
							if (c) {
								a.attributes.width = c;
							}
							if (b) {
								a.attributes.height = b;
							}
						}
					},
					a: function(a) {
						if (!a.children.length && (!a.attributes.name && !a.attributes["data-cke-saved-name"])) {
							return false;
						}
					}
				}
			};
			var z = {
				elementNames: [
					[/^cke:/, ""],
					[/^\?xml:namespace$/, ""]
				],
				attributeNames: [
					[/^data-cke-(saved|pa)-/, ""],
					[/^data-cke-.*/, ""],
					["hidefocus", ""]
				],
				elements: {
					$: function(a) {
						var b = a.attributes;
						if (b) {
							if (b["data-cke-temp"]) {
								return false;
							}
							var c = ["name", "href", "src"];
							var d;
							var f = 0;
							for (; f < c.length; f++) {
								d = "data-cke-saved-" + c[f];
								if (d in b) {
									delete b[c[f]];
								}
							}
						}
						return a;
					},
					table: function(a$$0) {
						a$$0.children.slice(0).sort(function(a, b) {
							var c;
							var d;
							if (a.type == CKEDITOR.NODE_ELEMENT && b.type == a.type) {
								c = CKEDITOR.tools.indexOf(x, a.name);
								d = CKEDITOR.tools.indexOf(x, b.name);
							}
							if (!(c > -1 && (d > -1 && c != d))) {
								c = a.parent ? a.getIndex() : -1;
								d = b.parent ? b.getIndex() : -1;
							}
							return c > d ? 1 : -1;
						});
					},
					param: function(a) {
						a.children = [];
						a.isEmpty = true;
						return a;
					},
					span: function(a) {
						if (a.attributes["class"] == "Apple-style-span") {
							delete a.name;
						}
					},
					html: function(a) {
						delete a.attributes.contenteditable;
						delete a.attributes["class"];
					},
					body: function(a) {
						delete a.attributes.spellcheck;
						delete a.attributes.contenteditable;
					},
					style: function(a) {
						var b = a.children[0];
						if (b && b.value) {
							b.value = CKEDITOR.tools.trim(b.value);
						}
						if (!a.attributes.type) {
							a.attributes.type = "text/css";
						}
					},
					title: function(a) {
						var b = a.children[0];
						if (!b) {
							h$$0(a, b = new CKEDITOR.htmlParser.text);
						}
						b.value = a.attributes["data-cke-title"] || "";
					},
					input: g$$0,
					textarea: g$$0
				},
				attributes: {
					"class": function(a) {
						return CKEDITOR.tools.ltrim(a.replace(/(?:^|\s+)cke_[^\s]*/g, "")) || false;
					}
				}
			};
			if (CKEDITOR.env.ie) {
				z.attributes.style = function(a$$0) {
					return a$$0.replace(/(^|;)([^\:]+)/g, function(a) {
						return a.toLowerCase();
					});
				};
			}
			var w = /<(a|area|img|input|source)\b([^>]*)>/gi;
			var D = /([\w-]+)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi;
			var A = /^(href|src|name)$/i;
			var I = /(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi;
			var K = /(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi;
			var C = /<cke:encoded>([^<]*)<\/cke:encoded>/gi;
			var y$$1 = /(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi;
			var E$$0 = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi;
			var H = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi;
		})();
		"use strict";
		CKEDITOR.htmlParser.element = function(a, e) {
			this.name = a;
			this.attributes = e || {};
			this.children = [];
			var b = a || "";
			var d = b.match(/^cke:(.*)/);
			if (d) {
				b = d[1];
			}
			b = !(!CKEDITOR.dtd.$nonBodyContent[b] && (!CKEDITOR.dtd.$block[b] && (!CKEDITOR.dtd.$listItem[b] && (!CKEDITOR.dtd.$tableContent[b] && !(CKEDITOR.dtd.$nonEditable[b] || b == "br")))));
			this.isEmpty = !!CKEDITOR.dtd.$empty[a];
			this.isUnknown = !CKEDITOR.dtd[a];
			this._ = {
				isBlockLike: b,
				hasInlineStarted: this.isEmpty || !b
			};
		};
		CKEDITOR.htmlParser.cssStyle = function(a$$0) {
			var e = {};
			((a$$0 instanceof CKEDITOR.htmlParser.element ? a$$0.attributes.style : a$$0) || "").replace(/&quot;/g, '"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(a, d, f) {
				if (d == "font-family") {
					f = f.replace(/["']/g, "");
				}
				e[d.toLowerCase()] = f;
			});
			return {
				rules: e,
				populate: function(a) {
					var d = this.toString();
					if (d) {
						if (a instanceof CKEDITOR.dom.element) {
							a.setAttribute("style", d);
						} else {
							if (a instanceof CKEDITOR.htmlParser.element) {
								a.attributes.style = d;
							} else {
								a.style = d;
							}
						}
					}
				},
				toString: function() {
					var a = [];
					var d;
					for (d in e) {
						if (e[d]) {
							a.push(d, ":", e[d], ";");
						}
					}
					return a.join("");
				}
			};
		};
		(function() {
			function a$$0(a) {
				return function(b) {
					return b.type == CKEDITOR.NODE_ELEMENT && (typeof a == "string" ? b.name == a : b.name in a);
				};
			}
			var e$$0 = function(a, b) {
				a = a[0];
				b = b[0];
				return a < b ? -1 : a > b ? 1 : 0;
			};
			var b$$0 = CKEDITOR.htmlParser.fragment.prototype;
			CKEDITOR.htmlParser.element.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
				type: CKEDITOR.NODE_ELEMENT,
				add: b$$0.add,
				clone: function() {
					return new CKEDITOR.htmlParser.element(this.name, this.attributes);
				},
				filter: function(a, b) {
					var c = this;
					var e;
					var j;
					b = c.getFilterContext(b);
					if (b.off) {
						return true;
					}
					if (!c.parent) {
						a.onRoot(b, c);
					}
					for (;;) {
						e = c.name;
						if (!(j = a.onElementName(b, e))) {
							this.remove();
							return false;
						}
						c.name = j;
						if (!(c = a.onElement(b, c))) {
							this.remove();
							return false;
						}
						if (c !== this) {
							this.replaceWith(c);
							return false;
						}
						if (c.name == e) {
							break;
						}
						if (c.type != CKEDITOR.NODE_ELEMENT) {
							this.replaceWith(c);
							return false;
						}
						if (!c.name) {
							this.replaceWithChildren();
							return false;
						}
					}
					e = c.attributes;
					var g;
					var i;
					for (g in e) {
						i = g;
						j = e[g];
						for (;;) {
							if (i = a.onAttributeName(b, g)) {
								if (i != g) {
									delete e[g];
									g = i;
								} else {
									break;
								}
							} else {
								delete e[g];
								break;
							}
						}
						if (i) {
							if ((j = a.onAttribute(b, c, i, j)) === false) {
								delete e[i];
							} else {
								e[i] = j;
							}
						}
					}
					if (!c.isEmpty) {
						this.filterChildren(a, false, b);
					}
					return true;
				},
				filterChildren: b$$0.filterChildren,
				writeHtml: function(a, b) {
					if (b) {
						this.filter(b);
					}
					var c = this.name;
					var h = [];
					var j = this.attributes;
					var g;
					var i;
					a.openTag(c, j);
					for (g in j) {
						h.push([g, j[g]]);
					}
					if (a.sortAttributes) {
						h.sort(e$$0);
					}
					g = 0;
					i = h.length;
					for (; g < i; g++) {
						j = h[g];
						a.attribute(j[0], j[1]);
					}
					a.openTagClose(c, this.isEmpty);
					this.writeChildrenHtml(a);
					if (!this.isEmpty) {
						a.closeTag(c);
					}
				},
				writeChildrenHtml: b$$0.writeChildrenHtml,
				replaceWithChildren: function() {
					var a = this.children;
					var b = a.length;
					for (; b;) {
						a[--b].insertAfter(this);
					}
					this.remove();
				},
				forEach: b$$0.forEach,
				getFirst: function(b) {
					if (!b) {
						return this.children.length ? this.children[0] : null;
					}
					if (typeof b != "function") {
						b = a$$0(b);
					}
					var f = 0;
					var c = this.children.length;
					for (; f < c; ++f) {
						if (b(this.children[f])) {
							return this.children[f];
						}
					}
					return null;
				},
				getHtml: function() {
					var a = new CKEDITOR.htmlParser.basicWriter;
					this.writeChildrenHtml(a);
					return a.getHtml();
				},
				setHtml: function(a) {
					a = this.children = CKEDITOR.htmlParser.fragment.fromHtml(a).children;
					var b = 0;
					var c = a.length;
					for (; b < c; ++b) {
						a[b].parent = this;
					}
				},
				getOuterHtml: function() {
					var a = new CKEDITOR.htmlParser.basicWriter;
					this.writeHtml(a);
					return a.getHtml();
				},
				split: function(a) {
					var b = this.children.splice(a, this.children.length - a);
					var c = this.clone();
					var e = 0;
					for (; e < b.length; ++e) {
						b[e].parent = c;
					}
					c.children = b;
					if (b[0]) {
						b[0].previous = null;
					}
					if (a > 0) {
						this.children[a - 1].next = null;
					}
					this.parent.add(c, this.getIndex() + 1);
					return c;
				},
				addClass: function(a) {
					if (!this.hasClass(a)) {
						var b = this.attributes["class"] || "";
						this.attributes["class"] = b + (b ? " " : "") + a;
					}
				},
				removeClass: function(a) {
					var b = this.attributes["class"];
					if (b) {
						if (b = CKEDITOR.tools.trim(b.replace(RegExp("(?:\\s+|^)" + a + "(?:\\s+|$)"), " "))) {
							this.attributes["class"] = b;
						} else {
							delete this.attributes["class"];
						}
					}
				},
				hasClass: function(a) {
					var b = this.attributes["class"];
					return !b ? false : RegExp("(?:^|\\s)" + a + "(?=\\s|$)").test(b);
				},
				getFilterContext: function(a) {
					var b = [];
					if (!a) {
						a = {
							off: false,
							nonEditable: false,
							nestedEditable: false
						};
					}
					if (!a.off) {
						if (this.attributes["data-cke-processor"] == "off") {
							b.push("off", true);
						}
					}
					if (!a.nonEditable && this.attributes.contenteditable == "false") {
						b.push("nonEditable", true);
					} else {
						if (a.nonEditable) {
							if (!a.nestedEditable && this.attributes.contenteditable == "true") {
								b.push("nestedEditable", true);
							}
						}
					}
					if (b.length) {
						a = CKEDITOR.tools.copy(a);
						var c = 0;
						for (; c < b.length; c = c + 2) {
							a[b[c]] = b[c + 1];
						}
					}
					return a;
				}
			}, true);
		})();
		(function() {
			var a$$0 = {};
			var e = /{([^}]+)}/g;
			var b$$0 = /([\\'])/g;
			var d = /\n/g;
			var f = /\r/g;
			CKEDITOR.template = function(c) {
				if (a$$0[c]) {
					this.output = a$$0[c];
				} else {
					var h = c.replace(b$$0, "\\$1").replace(d, "\\n").replace(f, "\\r").replace(e, function(a, b) {
						return "',data['" + b + "']==undefined?'{" + b + "}':data['" + b + "'],'";
					});
					this.output = a$$0[c] = Function("data", "buffer", "return buffer?buffer.push('" + h + "'):['" + h + "'].join('');");
				}
			};
		})();
		delete CKEDITOR.loadFullCore;
		CKEDITOR.instances = {};
		CKEDITOR.document = new CKEDITOR.dom.document(document);
		CKEDITOR.add = function(a) {
			CKEDITOR.instances[a.name] = a;
			a.on("focus", function() {
				if (CKEDITOR.currentInstance != a) {
					CKEDITOR.currentInstance = a;
					CKEDITOR.fire("currentInstance");
				}
			});
			a.on("blur", function() {
				if (CKEDITOR.currentInstance == a) {
					CKEDITOR.currentInstance = null;
					CKEDITOR.fire("currentInstance");
				}
			});
			CKEDITOR.fire("instance", null, a);
		};
		CKEDITOR.remove = function(a) {
			delete CKEDITOR.instances[a.name];
		};
		(function() {
			var a = {};
			CKEDITOR.addTemplate = function(e, b) {
				var d = a[e];
				if (d) {
					return d;
				}
				d = {
					name: e,
					source: b
				};
				CKEDITOR.fire("template", d);
				return a[e] = new CKEDITOR.template(d.source);
			};
			CKEDITOR.getTemplate = function(e) {
				return a[e];
			};
		})();
		(function() {
			var a = [];
			CKEDITOR.addCss = function(e) {
				a.push(e);
			};
			CKEDITOR.getCss = function() {
				return a.join("\n");
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
			CKEDITOR.inline = function(a, e) {
				if (!CKEDITOR.env.isCompatible) {
					return null;
				}
				a = CKEDITOR.dom.element.get(a);
				if (a.getEditor()) {
					throw 'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
				}
				var b = new CKEDITOR.editor(e, a, CKEDITOR.ELEMENT_MODE_INLINE);
				var d = a.is("textarea") ? a : null;
				if (d) {
					b.setData(d.getValue(), null, true);
					a = CKEDITOR.dom.element.createFromHtml('<div contenteditable="' + !!b.readOnly + '" class="cke_textarea_inline">' + d.getValue() + "</div>", CKEDITOR.document);
					a.insertAfter(d);
					d.hide();
					if (d.$.form) {
						b._attachToForm();
					}
				} else {
					b.setData(a.getHtml(), null, true);
				}
				b.on("loaded", function() {
					b.fire("uiReady");
					b.editable(a);
					b.container = a;
					b.setData(b.getData(1));
					b.resetDirty();
					b.fire("contentDom");
					b.mode = "wysiwyg";
					b.fire("mode");
					b.status = "ready";
					b.fireOnce("instanceReady");
					CKEDITOR.fire("instanceReady", null, b);
				}, null, null, 1E4);
				b.on("destroy", function() {
					if (d) {
						b.container.clearCustomData();
						b.container.remove();
						d.show();
					}
					b.element.clearCustomData();
					delete b.element;
				});
				return b;
			};
			CKEDITOR.inlineAll = function() {
				var a;
				var e;
				var b;
				for (b in CKEDITOR.dtd.$editable) {
					var d = CKEDITOR.document.getElementsByTag(b);
					var f = 0;
					var c = d.count();
					for (; f < c; f++) {
						a = d.getItem(f);
						if (a.getAttribute("contenteditable") == "true") {
							e = {
								element: a,
								config: {}
							};
							if (CKEDITOR.fire("inline", e) !== false) {
								CKEDITOR.inline(a, e.config);
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
			function a$$0(a, c, d, j) {
				if (!CKEDITOR.env.isCompatible) {
					return null;
				}
				a = CKEDITOR.dom.element.get(a);
				if (a.getEditor()) {
					throw 'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
				}
				var g = new CKEDITOR.editor(c, a, j);
				if (j == CKEDITOR.ELEMENT_MODE_REPLACE) {
					a.setStyle("visibility", "hidden");
					g._.required = a.hasAttribute("required");
					a.removeAttribute("required");
				}
				if (d) {
					g.setData(d, null, true);
				}
				g.on("loaded", function() {
					b$$0(g);
					if (j == CKEDITOR.ELEMENT_MODE_REPLACE) {
						if (g.config.autoUpdateElement && a.$.form) {
							g._attachToForm();
						}
					}
					g.setMode(g.config.startupMode, function() {
						g.resetDirty();
						g.status = "ready";
						g.fireOnce("instanceReady");
						CKEDITOR.fire("instanceReady", null, g);
					});
				});
				g.on("destroy", e$$0);
				return g;
			}

			function e$$0() {
				var a = this.container;
				var b = this.element;
				if (a) {
					a.clearCustomData();
					a.remove();
				}
				if (b) {
					b.clearCustomData();
					if (this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE) {
						b.show();
						if (this._.required) {
							b.setAttribute("required", "required");
						}
					}
					delete this.element;
				}
			}

			function b$$0(a) {
				var b = a.name;
				var e = a.element;
				var j = a.elementMode;
				var g = a.fire("uiSpace", {
					space: "top",
					html: ""
				}).html;
				var i = a.fire("uiSpace", {
					space: "bottom",
					html: ""
				}).html;
				if (!d$$0) {
					d$$0 = CKEDITOR.addTemplate("maincontainer", '<{outerEl} id="cke_{name}" class="{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' + CKEDITOR.env.cssClass + '"  dir="{langDir}" lang="{langCode}" role="application" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><{outerEl} class="cke_inner cke_reset" role="presentation">{topHtml}<{outerEl} id="{contentId}" class="cke_contents cke_reset" role="presentation"></{outerEl}>{bottomHtml}</{outerEl}></{outerEl}>');
				}
				b = CKEDITOR.dom.element.createFromHtml(d$$0.output({
					id: a.id,
					name: b,
					langDir: a.lang.dir,
					langCode: a.langCode,
					voiceLabel: [a.lang.editor, a.name].join(", "),
					topHtml: g ? '<span id="' + a.ui.spaceId("top") + '" class="cke_top cke_reset_all" role="presentation" style="height:auto">' + g + "</span>" : "",
					contentId: a.ui.spaceId("contents"),
					bottomHtml: i ? '<span id="' + a.ui.spaceId("bottom") + '" class="cke_bottom cke_reset_all" role="presentation">' + i + "</span>" : "",
					outerEl: CKEDITOR.env.ie ? "span" : "div"
				}));
				if (j == CKEDITOR.ELEMENT_MODE_REPLACE) {
					e.hide();
					b.insertAfter(e);
				} else {
					e.append(b);
				}
				a.container = b;
				if (g) {
					a.ui.space("top").unselectable();
				}
				if (i) {
					a.ui.space("bottom").unselectable();
				}
				e = a.config.width;
				j = a.config.height;
				if (e) {
					b.setStyle("width", CKEDITOR.tools.cssLength(e));
				}
				if (j) {
					a.ui.space("contents").setStyle("height", CKEDITOR.tools.cssLength(j));
				}
				b.disableContextMenu();
				if (CKEDITOR.env.webkit) {
					b.on("focus", function() {
						a.focus();
					});
				}
				a.fireOnce("uiReady");
			}
			CKEDITOR.replace = function(b, c) {
				return a$$0(b, c, null, CKEDITOR.ELEMENT_MODE_REPLACE);
			};
			CKEDITOR.appendTo = function(b, c, d) {
				return a$$0(b, c, d, CKEDITOR.ELEMENT_MODE_APPENDTO);
			};
			CKEDITOR.replaceAll = function() {
				var a = document.getElementsByTagName("textarea");
				var b = 0;
				for (; b < a.length; b++) {
					var d = null;
					var e = a[b];
					if (e.name || e.id) {
						if (typeof arguments[0] == "string") {
							if (!RegExp("(?:^|\\s)" + arguments[0] + "(?:$|\\s)").test(e.className)) {
								continue;
							}
						} else {
							if (typeof arguments[0] == "function") {
								d = {};
								if (arguments[0](e, d) === false) {
									continue;
								}
							}
						}
						this.replace(e, d);
					}
				}
			};
			CKEDITOR.editor.prototype.addMode = function(a, b) {
				(this._.modes || (this._.modes = {}))[a] = b;
			};
			CKEDITOR.editor.prototype.setMode = function(a, b) {
				var d = this;
				var e = this._.modes;
				if (!(a == d.mode || (!e || !e[a]))) {
					d.fire("beforeSetMode", a);
					if (d.mode) {
						var g = d.checkDirty();
						e = d._.previousModeData;
						var i;
						var k = 0;
						d.fire("beforeModeUnload");
						d.editable(0);
						d._.previousMode = d.mode;
						d._.previousModeData = i = d.getData(1);
						if (d.mode == "source" && e == i) {
							d.fire("lockSnapshot", {
								forceUpdate: true
							});
							k = 1;
						}
						d.ui.space("contents").setHtml("");
						d.mode = "";
					} else {
						d._.previousModeData = d.getData(1);
					}
					this._.modes[a](function() {
						d.mode = a;
						if (g !== void 0) {
							if (!g) {
								d.resetDirty();
							}
						}
						if (k) {
							d.fire("unlockSnapshot");
						} else {
							if (a == "wysiwyg") {
								d.fire("saveSnapshot");
							}
						}
						setTimeout(function() {
							d.fire("mode");
							if (b) {
								b.call(d);
							}
						}, 0);
					});
				}
			};
			CKEDITOR.editor.prototype.resize = function(a, b, d, e) {
				var g = this.container;
				var i = this.ui.space("contents");
				var k = CKEDITOR.env.webkit && (this.document && this.document.getWindow().$.frameElement);
				e = e ? g.getChild(1) : g;
				e.setSize("width", a, true);
				if (k) {
					k.style.width = "1%";
				}
				i.setStyle("height", Math.max(b - (d ? 0 : (e.$.offsetHeight || 0) - (i.$.clientHeight || 0)), 0) + "px");
				if (k) {
					k.style.width = "100%";
				}
				this.fire("resize");
			};
			CKEDITOR.editor.prototype.getResizable = function(a) {
				return a ? this.ui.space("contents") : this.container;
			};
			var d$$0;
			CKEDITOR.domReady(function() {
				if (CKEDITOR.replaceClass) {
					CKEDITOR.replaceAll(CKEDITOR.replaceClass);
				}
			});
		})();
		CKEDITOR.config.startupMode = "wysiwyg";
		(function() {
			function a$$1(a$$0) {
				var b = a$$0.editor;
				var c = a$$0.data.path;
				var f = c.blockLimit;
				var g = a$$0.data.selection;
				var h = g.getRanges()[0];
				var i;
				if (CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller) {
					if (g = e$$1(g, c)) {
						g.appendBogus();
						i = CKEDITOR.env.ie;
					}
				}
				if (b.config.autoParagraph !== false && (b.activeEnterMode != CKEDITOR.ENTER_BR && (b.editable().equals(f) && (!c.block && (h.collapsed && !h.getCommonAncestor().isReadOnly()))))) {
					c = h.clone();
					c.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
					f = new CKEDITOR.dom.walker(c);
					f.guard = function(a) {
						return !d$$0(a) || (a.type == CKEDITOR.NODE_COMMENT || a.isReadOnly());
					};
					if (!f.checkForward() || c.checkStartOfBlock() && c.checkEndOfBlock()) {
						b = h.fixBlock(true, b.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p");
						if (!CKEDITOR.env.needsBrFiller) {
							if (b = b.getFirst(d$$0)) {
								if (b.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(b.getText()).match(/^(?:&nbsp;|\xa0)$/)) {
									b.remove();
								}
							}
						}
						i = 1;
						a$$0.cancel();
					}
				}
				if (i) {
					h.select();
				}
			}

			function e$$1(a, b) {
				if (a.isFake) {
					return 0;
				}
				var c = b.block || b.blockLimit;
				var f = c && c.getLast(d$$0);
				if (c && (c.isBlockBoundary() && ((!f || !(f.type == CKEDITOR.NODE_ELEMENT && f.isBlockBoundary())) && (!c.is("pre") && !c.getBogus())))) {
					return c;
				}
			}

			function b$$2(a) {
				var b = a.data.getTarget();
				if (b.is("input")) {
					b = b.getAttribute("type");
					if (b == "submit" || b == "reset") {
						a.data.preventDefault();
					}
				}
			}

			function d$$0(a) {
				return k$$1(a) && n$$1(a);
			}

			function f$$1(a, b) {
				return function(c) {
					var d = CKEDITOR.dom.element.get(c.data.$.toElement || (c.data.$.fromElement || c.data.$.relatedTarget));
					if (!d || !b.equals(d) && !b.contains(d)) {
						a.call(this, c);
					}
				};
			}

			function c$$2(a$$0) {
				var b;
				var c$$0 = a$$0.getRanges()[0];
				var f$$0 = a$$0.root;
				var e = {
					table: 1,
					ul: 1,
					ol: 1,
					dl: 1
				};
				if (c$$0.startPath().contains(e)) {
					a$$0 = function(a) {
						return function(c, f) {
							if (f) {
								if (c.type == CKEDITOR.NODE_ELEMENT && c.is(e)) {
									b = c;
								}
							}
							if (!f && (d$$0(c) && (!a || !g$$1(c)))) {
								return false;
							}
						};
					};
					var h = c$$0.clone();
					h.collapse(1);
					h.setStartAt(f$$0, CKEDITOR.POSITION_AFTER_START);
					f$$0 = new CKEDITOR.dom.walker(h);
					f$$0.guard = a$$0();
					f$$0.checkBackward();
					if (b) {
						h = c$$0.clone();
						h.collapse();
						h.setEndAt(b, CKEDITOR.POSITION_AFTER_END);
						f$$0 = new CKEDITOR.dom.walker(h);
						f$$0.guard = a$$0(true);
						b = false;
						f$$0.checkForward();
						return b;
					}
				}
				return null;
			}

			function h$$1(a) {
				a.editor.focus();
				a.editor.fire("saveSnapshot");
			}

			function j$$0(a) {
				var b = a.editor;
				b.getSelection().scrollIntoView();
				setTimeout(function() {
					b.fire("saveSnapshot");
				}, 0);
			}
			CKEDITOR.editable = CKEDITOR.tools.createClass({
				base: CKEDITOR.dom.element,
				$: function(a, b) {
					this.base(b.$ || b);
					this.editor = a;
					this.status = "unloaded";
					this.hasFocus = false;
					this.setup();
				},
				proto: {
					focus: function() {
						var a;
						if (CKEDITOR.env.webkit && !this.hasFocus) {
							a = this.editor._.previousActive || this.getDocument().getActive();
							if (this.contains(a)) {
								a.focus();
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
							a = CKEDITOR.document.getActive();
							if (!a.equals(this.getWindow().getFrame())) {
								this.getWindow().focus();
							}
						}
					},
					on: function(a, b) {
						var c = Array.prototype.slice.call(arguments, 0);
						if (CKEDITOR.env.ie && /^focus|blur$/.exec(a)) {
							a = a == "focus" ? "focusin" : "focusout";
							b = f$$1(b, this);
							c[0] = a;
							c[1] = b;
						}
						return CKEDITOR.dom.element.prototype.on.apply(this, c);
					},
					attachListener: function(a, b, c, d, f, e) {
						if (!this._.listeners) {
							this._.listeners = [];
						}
						var g = Array.prototype.slice.call(arguments, 1);
						g = a.on.apply(a, g);
						this._.listeners.push(g);
						return g;
					},
					clearListeners: function() {
						var a = this._.listeners;
						try {
							for (; a.length;) {
								a.pop().removeListener();
							}
						} catch (b) {}
					},
					restoreAttrs: function() {
						var a = this._.attrChanges;
						var b;
						var c;
						for (c in a) {
							if (a.hasOwnProperty(c)) {
								b = a[c];
								if (b !== null) {
									this.setAttribute(c, b);
								} else {
									this.removeAttribute(c);
								}
							}
						}
					},
					attachClass: function(a) {
						var b = this.getCustomData("classes");
						if (!this.hasClass(a)) {
							if (!b) {
								b = [];
							}
							b.push(a);
							this.setCustomData("classes", b);
							this.addClass(a);
						}
					},
					changeAttr: function(a, b) {
						var c = this.getAttribute(a);
						if (b !== c) {
							if (!this._.attrChanges) {
								this._.attrChanges = {};
							}
							if (!(a in this._.attrChanges)) {
								this._.attrChanges[a] = c;
							}
							this.setAttribute(a, b);
						}
					},
					insertHtml: function(a, b) {
						h$$1(this);
						o$$0(this, b || "html", a);
					},
					insertText: function(a$$0) {
						h$$1(this);
						var b$$0 = this.editor;
						var c = b$$0.getSelection().getStartElement().hasAscendant("pre", true) ? CKEDITOR.ENTER_BR : b$$0.activeEnterMode;
						b$$0 = c == CKEDITOR.ENTER_BR;
						var d = CKEDITOR.tools;
						a$$0 = d.htmlEncode(a$$0.replace(/\r\n/g, "\n"));
						a$$0 = a$$0.replace(/\t/g, "&nbsp;&nbsp; &nbsp;");
						c = c == CKEDITOR.ENTER_P ? "p" : "div";
						if (!b$$0) {
							var f = /\n{2}/g;
							if (f.test(a$$0)) {
								var e = "<" + c + ">";
								var g = "</" + c + ">";
								a$$0 = e + a$$0.replace(f, function() {
									return g + e;
								}) + g;
							}
						}
						a$$0 = a$$0.replace(/\n/g, "<br>");
						if (!b$$0) {
							a$$0 = a$$0.replace(RegExp("<br>(?=</" + c + ">)"), function(a) {
								return d.repeat(a, 2);
							});
						}
						a$$0 = a$$0.replace(/^ | $/g, "&nbsp;");
						a$$0 = a$$0.replace(/(>|\s) /g, function(a, b) {
							return b + "&nbsp;";
						}).replace(/ (?=<)/g, "&nbsp;");
						o$$0(this, "text", a$$0);
					},
					insertElement: function(a, b) {
						if (b) {
							this.insertElementIntoRange(a, b);
						} else {
							this.insertElementIntoSelection(a);
						}
					},
					insertElementIntoRange: function(a, b) {
						var c = this.editor;
						var d = c.config.enterMode;
						var f = a.getName();
						var e = CKEDITOR.dtd.$block[f];
						if (b.checkReadOnly()) {
							return false;
						}
						b.deleteContents(1);
						if (b.startContainer.type == CKEDITOR.NODE_ELEMENT) {
							if (b.startContainer.is({
								tr: 1,
								table: 1,
								tbody: 1,
								thead: 1,
								tfoot: 1
							})) {
								r$$0(b);
							}
						}
						var g;
						var h;
						if (e) {
							for (;
								(g = b.getCommonAncestor(0, 1)) && ((h = CKEDITOR.dtd[g.getName()]) && (!h || !h[f]));) {
								if (g.getName() in CKEDITOR.dtd.span) {
									b.splitElement(g);
								} else {
									if (b.checkStartOfBlock() && b.checkEndOfBlock()) {
										b.setStartBefore(g);
										b.collapse(true);
										g.remove();
									} else {
										b.splitBlock(d == CKEDITOR.ENTER_DIV ? "div" : "p", c.editable());
									}
								}
							}
						}
						b.insertNode(a);
						return true;
					},
					insertElementIntoSelection: function(a$$0) {
						h$$1(this);
						var b = this.editor;
						var c = b.activeEnterMode;
						b = b.getSelection();
						var f = b.getRanges()[0];
						var e = a$$0.getName();
						e = CKEDITOR.dtd.$block[e];
						if (this.insertElementIntoRange(a$$0, f)) {
							f.moveToPosition(a$$0, CKEDITOR.POSITION_AFTER_END);
							if (e) {
								if ((e = a$$0.getNext(function(a) {
									return d$$0(a) && !g$$1(a);
								})) && (e.type == CKEDITOR.NODE_ELEMENT && e.is(CKEDITOR.dtd.$block))) {
									if (e.getDtd()["#"]) {
										f.moveToElementEditStart(e);
									} else {
										f.moveToElementEditEnd(a$$0);
									}
								} else {
									if (!e && c != CKEDITOR.ENTER_BR) {
										e = f.fixBlock(true, c == CKEDITOR.ENTER_DIV ? "div" : "p");
										f.moveToElementEditStart(e);
									}
								}
							}
						}
						b.selectRanges([f]);
						j$$0(this);
					},
					setData: function(a, b) {
						if (!b) {
							a = this.editor.dataProcessor.toHtml(a);
						}
						this.setHtml(a);
						if (this.status == "unloaded") {
							this.status = "ready";
						}
						this.editor.fire("dataReady");
					},
					getData: function(a) {
						var b = this.getHtml();
						if (!a) {
							b = this.editor.dataProcessor.toDataFormat(b);
						}
						return b;
					},
					setReadOnly: function(a) {
						this.setAttribute("contenteditable", !a);
					},
					detach: function() {
						this.removeClass("cke_editable");
						this.status = "detached";
						var a = this.editor;
						this._.detach();
						delete a.document;
						delete a.window;
					},
					isInline: function() {
						return this.getDocument().equals(CKEDITOR.document);
					},
					setup: function() {
						var a$$0 = this.editor;
						this.attachListener(a$$0, "beforeGetData", function() {
							var b$$0 = this.getData();
							if (!this.is("textarea")) {
								if (a$$0.config.ignoreEmptyParagraph !== false) {
									b$$0 = b$$0.replace(i$$1, function(a, b) {
										return b;
									});
								}
							}
							a$$0.setData(b$$0, null, 1);
						}, this);
						this.attachListener(a$$0, "getSnapshot", function(a) {
							a.data = this.getData(1);
						}, this);
						this.attachListener(a$$0, "afterSetData", function() {
							this.setData(a$$0.getData(1));
						}, this);
						this.attachListener(a$$0, "loadSnapshot", function(a) {
							this.setData(a.data, 1);
						}, this);
						this.attachListener(a$$0, "beforeFocus", function() {
							var b = a$$0.getSelection();
							if (!((b = b && b.getNative()) && b.type == "Control")) {
								this.focus();
							}
						}, this);
						this.attachListener(a$$0, "insertHtml", function(a) {
							this.insertHtml(a.data.dataValue, a.data.mode);
						}, this);
						this.attachListener(a$$0, "insertElement", function(a) {
							this.insertElement(a.data);
						}, this);
						this.attachListener(a$$0, "insertText", function(a) {
							this.insertText(a.data);
						}, this);
						this.setReadOnly(a$$0.readOnly);
						this.attachClass("cke_editable");
						this.attachClass(a$$0.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "cke_editable_inline" : a$$0.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE || a$$0.elementMode == CKEDITOR.ELEMENT_MODE_APPENDTO ? "cke_editable_themed" : "");
						this.attachClass("cke_contents_" + a$$0.config.contentsLangDirection);
						a$$0.keystrokeHandler.blockedKeystrokes[8] = +a$$0.readOnly;
						a$$0.keystrokeHandler.attach(this);
						this.on("blur", function() {
							this.hasFocus = false;
						}, null, null, -1);
						this.on("focus", function() {
							this.hasFocus = true;
						}, null, null, -1);
						a$$0.focusManager.add(this);
						if (this.equals(CKEDITOR.document.getActive())) {
							this.hasFocus = true;
							a$$0.once("contentDom", function() {
								a$$0.focusManager.focus();
							});
						}
						if (this.isInline()) {
							this.changeAttr("tabindex", a$$0.tabIndex);
						}
						if (!this.is("textarea")) {
							a$$0.document = this.getDocument();
							a$$0.window = this.getWindow();
							var f$$0 = a$$0.document;
							this.changeAttr("spellcheck", !a$$0.config.disableNativeSpellChecker);
							var e$$0 = a$$0.config.contentsLangDirection;
							if (this.getDirection(1) != e$$0) {
								this.changeAttr("dir", e$$0);
							}
							var g$$0 = CKEDITOR.getCss();
							if (g$$0) {
								e$$0 = f$$0.getHead();
								if (!e$$0.getCustomData("stylesheet")) {
									g$$0 = f$$0.appendStyleText(g$$0);
									g$$0 = new CKEDITOR.dom.element(g$$0.ownerNode || g$$0.owningElement);
									e$$0.setCustomData("stylesheet", g$$0);
									g$$0.data("cke-temp", 1);
								}
							}
							e$$0 = f$$0.getCustomData("stylesheet_ref") || 0;
							f$$0.setCustomData("stylesheet_ref", e$$0 + 1);
							this.setCustomData("cke_includeReadonly", !a$$0.config.disableReadonlyStyling);
							this.attachListener(this, "click", function(a) {
								a = a.data;
								var b = (new CKEDITOR.dom.elementPath(a.getTarget(), this)).contains("a");
								if (b) {
									if (a.$.button != 2 && b.isReadOnly()) {
										a.preventDefault();
									}
								}
							});
							var h = {
								8: 1,
								46: 1
							};
							this.attachListener(a$$0, "key", function(b) {
								if (a$$0.readOnly) {
									return true;
								}
								var d = b.data.domEvent.getKey();
								var f;
								if (d in h) {
									b = a$$0.getSelection();
									var e;
									var g = b.getRanges()[0];
									var i = g.startPath();
									var j;
									var n;
									var m;
									d = d == 8;
									if (CKEDITOR.env.ie && (CKEDITOR.env.version < 11 && (e = b.getSelectedElement())) || (e = c$$2(b))) {
										a$$0.fire("saveSnapshot");
										g.moveToPosition(e, CKEDITOR.POSITION_BEFORE_START);
										e.remove();
										g.select();
										a$$0.fire("saveSnapshot");
										f = 1;
									} else {
										if (g.collapsed) {
											if ((j = i.block) && ((m = j[d ? "getPrevious" : "getNext"](k$$1)) && (m.type == CKEDITOR.NODE_ELEMENT && (m.is("table") && g[d ? "checkStartOfBlock" : "checkEndOfBlock"]())))) {
												a$$0.fire("saveSnapshot");
												if (g[d ? "checkEndOfBlock" : "checkStartOfBlock"]()) {
													j.remove();
												}
												g["moveToElementEdit" + (d ? "End" : "Start")](m);
												g.select();
												a$$0.fire("saveSnapshot");
												f = 1;
											} else {
												if (i.blockLimit && (i.blockLimit.is("td") && ((n = i.blockLimit.getAscendant("table")) && (g.checkBoundaryOfElement(n, d ? CKEDITOR.START : CKEDITOR.END) && (m = n[d ? "getPrevious" : "getNext"](k$$1)))))) {
													a$$0.fire("saveSnapshot");
													g["moveToElementEdit" + (d ? "End" : "Start")](m);
													if (g.checkStartOfBlock() && g.checkEndOfBlock()) {
														m.remove();
													} else {
														g.select();
													}
													a$$0.fire("saveSnapshot");
													f = 1;
												} else {
													if ((n = i.contains(["td", "th", "caption"])) && g.checkBoundaryOfElement(n, d ? CKEDITOR.START : CKEDITOR.END)) {
														f = 1;
													}
												}
											}
										}
									}
								}
								return !f;
							});
							if (a$$0.blockless) {
								if (CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller) {
									this.attachListener(this, "keyup", function(b) {
										if (b.data.getKeystroke() in h && !this.getFirst(d$$0)) {
											this.appendBogus();
											b = a$$0.createRange();
											b.moveToPosition(this, CKEDITOR.POSITION_AFTER_START);
											b.select();
										}
									});
								}
							}
							this.attachListener(this, "dblclick", function(b) {
								if (a$$0.readOnly) {
									return false;
								}
								b = {
									element: b.data.getTarget()
								};
								a$$0.fire("doubleclick", b);
							});
							if (CKEDITOR.env.ie) {
								this.attachListener(this, "click", b$$2);
							}
							if (!CKEDITOR.env.ie) {
								this.attachListener(this, "mousedown", function(b) {
									var c = b.data.getTarget();
									if (c.is("img", "hr", "input", "textarea", "select") && !c.isReadOnly()) {
										a$$0.getSelection().selectElement(c);
										if (c.is("input", "textarea", "select")) {
											b.data.preventDefault();
										}
									}
								});
							}
							if (CKEDITOR.env.gecko) {
								this.attachListener(this, "mouseup", function(b) {
									if (b.data.$.button == 2) {
										b = b.data.getTarget();
										if (!b.getOuterHtml().replace(i$$1, "")) {
											var c = a$$0.createRange();
											c.moveToElementEditStart(b);
											c.select(true);
										}
									}
								});
							}
							if (CKEDITOR.env.webkit) {
								this.attachListener(this, "click", function(a) {
									if (a.data.getTarget().is("input", "select")) {
										a.data.preventDefault();
									}
								});
								this.attachListener(this, "mouseup", function(a) {
									if (a.data.getTarget().is("input", "textarea")) {
										a.data.preventDefault();
									}
								});
							}
							if (CKEDITOR.env.webkit) {
								this.attachListener(a$$0, "key", function(b) {
									b = b.data.domEvent.getKey();
									if (b in h) {
										b = b == 8;
										var c = a$$0.getSelection();
										var d = c.getRanges()[0];
										var f = d.startPath();
										var e = f.block;
										if (d.collapsed && (e && (d[b ? "checkStartOfBlock" : "checkEndOfBlock"]() && (d.moveToClosestEditablePosition(e, !b) && d.collapsed)))) {
											if (d.startContainer.type == CKEDITOR.NODE_ELEMENT) {
												var g = d.startContainer.getChild(d.startOffset - (b ? 1 : 0));
												if (g && (g.type == CKEDITOR.NODE_ELEMENT && g.is("hr"))) {
													a$$0.fire("saveSnapshot");
													g.remove();
													a$$0.fire("saveSnapshot");
													return false;
												}
											}
											if ((d = d.startPath().block) && (!d || !d.contains(e))) {
												a$$0.fire("saveSnapshot");
												var i = e.getCommonAncestor(d);
												var j = b ? e : d;
												g = j;
												for (;
													(j = j.getParent()) && (!i.equals(j) && j.getChildCount() == 1);) {
													g = j;
												}
												var k;
												if (k = (b ? d : e).getBogus()) {
													k.remove();
												}
												k = c.createBookmarks();
												(b ? e : d).moveChildren(b ? d : e, false);
												f.lastElement.mergeSiblings();
												g.remove();
												c.selectBookmarks(k);
												c.scrollIntoView();
												a$$0.fire("saveSnapshot");
												return false;
											}
										}
									}
								}, this, null, 100);
							}
						}
					}
				},
				_: {
					detach: function() {
						this.editor.setData(this.editor.getData(), 0, 1);
						this.clearListeners();
						this.restoreAttrs();
						var a;
						if (a = this.removeCustomData("classes")) {
							for (; a.length;) {
								this.removeClass(a.pop());
							}
						}
						if (!this.is("textarea")) {
							a = this.getDocument();
							var b = a.getHead();
							if (b.getCustomData("stylesheet")) {
								var c = a.getCustomData("stylesheet_ref");
								if (--c) {
									a.setCustomData("stylesheet_ref", c);
								} else {
									a.removeCustomData("stylesheet_ref");
									b.removeCustomData("stylesheet").remove();
								}
							}
						}
						this.editor.fire("contentDomUnload");
						delete this.editor;
					}
				}
			});
			CKEDITOR.editor.prototype.editable = function(a) {
				var b = this._.editable;
				if (b && a) {
					return 0;
				}
				if (arguments.length) {
					b = this._.editable = a ? a instanceof CKEDITOR.editable ? a : new CKEDITOR.editable(this, a) : (b && b.detach(), null);
				}
				return b;
			};
			var g$$1 = CKEDITOR.dom.walker.bogus();
			var i$$1 = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi;
			var k$$1 = CKEDITOR.dom.walker.whitespaces(true);
			var n$$1 = CKEDITOR.dom.walker.bookmark(false, true);
			CKEDITOR.on("instanceLoaded", function(b$$0) {
				var c = b$$0.editor;
				c.on("insertElement", function(a) {
					a = a.data;
					if (a.type == CKEDITOR.NODE_ELEMENT && (a.is("input") || a.is("textarea"))) {
						if (a.getAttribute("contentEditable") != "false") {
							a.data("cke-editable", a.hasAttribute("contenteditable") ? "true" : "1");
						}
						a.setAttribute("contentEditable", false);
					}
				});
				c.on("selectionChange", function(b) {
					if (!c.readOnly) {
						var d = c.getSelection();
						if (d && !d.isLocked) {
							d = c.checkDirty();
							c.fire("lockSnapshot");
							a$$1(b);
							c.fire("unlockSnapshot");
							if (!d) {
								c.resetDirty();
							}
						}
					}
				});
			});
			CKEDITOR.on("instanceCreated", function(a$$0) {
				var b = a$$0.editor;
				b.on("mode", function() {
					var a = b.editable();
					if (a && a.isInline()) {
						var c = b.title;
						a.changeAttr("role", "textbox");
						a.changeAttr("aria-label", c);
						if (c) {
							a.changeAttr("title", c);
						}
						if (c = this.ui.space(this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "top" : "contents")) {
							var d = CKEDITOR.tools.getNextId();
							var f = CKEDITOR.dom.element.createFromHtml('<span id="' + d + '" class="cke_voice_label">' + this.lang.common.editorHelp + "</span>");
							c.append(f);
							a.changeAttr("aria-describedby", d);
						}
					}
				});
			});
			CKEDITOR.addCss(".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}");
			var o$$0 = function() {
				function a(b) {
					return b.type == CKEDITOR.NODE_ELEMENT;
				}

				function b$$1(c, d) {
					var f;
					var e;
					var g;
					var i;
					var j = [];
					var y = d.range.startContainer;
					f = d.range.startPath();
					y = h$$0[y.getName()];
					var k = 0;
					var p = c.getChildren();
					var n = p.count();
					var x = -1;
					var o = -1;
					var s = 0;
					var v = f.contains(h$$0.$list);
					for (; k < n; ++k) {
						f = p.getItem(k);
						if (a(f)) {
							g = f.getName();
							if (v && g in CKEDITOR.dtd.$list) {
								j = j.concat(b$$1(f, d));
							} else {
								i = !!y[g];
								if (g == "br" && (f.data("cke-eol") && (!k || k == n - 1))) {
									s = (e = k ? j[k - 1].node : p.getItem(k + 1)) && (!a(e) || !e.is("br"));
									e = e && (a(e) && h$$0.$block[e.getName()]);
								}
								if (x == -1) {
									if (!i) {
										x = k;
									}
								}
								if (!i) {
									o = k;
								}
								j.push({
									isElement: 1,
									isLineBreak: s,
									isBlock: f.isBlockBoundary(),
									hasBlockSibling: e,
									node: f,
									name: g,
									allowed: i
								});
								e = s = 0;
							}
						} else {
							j.push({
								isElement: 0,
								node: f,
								allowed: 1
							});
						}
					}
					if (x > -1) {
						j[x].firstNotAllowed = 1;
					}
					if (o > -1) {
						j[o].lastNotAllowed = 1;
					}
					return j;
				}

				function c$$1(b, d) {
					var f = [];
					var e = b.getChildren();
					var g = e.count();
					var i;
					var j = 0;
					var y = h$$0[d];
					var k = !b.is(h$$0.$inline) || b.is("br");
					if (k) {
						f.push(" ");
					}
					for (; j < g; j++) {
						i = e.getItem(j);
						if (a(i) && !i.is(y)) {
							f = f.concat(c$$1(i, d));
						} else {
							f.push(i);
						}
					}
					if (k) {
						f.push(" ");
					}
					return f;
				}

				function f$$0(b) {
					return b && (a(b) && (b.is(h$$0.$removeEmpty) || b.is("a") && !b.isBlockBoundary()));
				}

				function e$$0(b, c, d, f) {
					var g = b.clone();
					var h;
					var j;
					g.setEndAt(c, CKEDITOR.POSITION_BEFORE_END);
					if ((h = (new CKEDITOR.dom.walker(g)).next()) && (a(h) && (i$$0[h.getName()] && ((j = h.getPrevious()) && (a(j) && (!j.getParent().equals(b.startContainer) && (d.contains(j) && (f.contains(h) && h.isIdentical(j))))))))) {
						h.moveChildren(j);
						h.remove();
						e$$0(b, c, d, f);
					}
				}

				function g$$0(b$$0, c$$0) {
					function d(b, c) {
						if (c.isBlock && (c.isElement && (!c.node.is("br") && (a(b) && b.is("br"))))) {
							b.remove();
							return 1;
						}
					}
					var f = c$$0.endContainer.getChild(c$$0.endOffset);
					var e = c$$0.endContainer.getChild(c$$0.endOffset - 1);
					if (f) {
						d(f, b$$0[b$$0.length - 1]);
					}
					if (e && d(e, b$$0[0])) {
						c$$0.setEnd(c$$0.endContainer, c$$0.endOffset - 1);
						c$$0.collapse();
					}
				}
				var h$$0 = CKEDITOR.dtd;
				var i$$0 = {
					p: 1,
					div: 1,
					h1: 1,
					h2: 1,
					h3: 1,
					h4: 1,
					h5: 1,
					h6: 1,
					ul: 1,
					ol: 1,
					li: 1,
					pre: 1,
					dl: 1,
					blockquote: 1
				};
				var k$$0 = {
					p: 1,
					div: 1,
					h1: 1,
					h2: 1,
					h3: 1,
					h4: 1,
					h5: 1,
					h6: 1
				};
				var n$$0 = CKEDITOR.tools.extend({}, h$$0.$inline);
				delete n$$0.br;
				return function(i, o, u) {
					var A = i.editor;
					i.getDocument();
					var I = A.getSelection().getRanges()[0];
					var r = false;
					if (o == "unfiltered_html") {
						o = "html";
						r = true;
					}
					if (!I.checkReadOnly()) {
						var C = (new CKEDITOR.dom.elementPath(I.startContainer, I.root)).blockLimit || I.root;
						o = {
							type: o,
							dontFilter: r,
							editable: i,
							editor: A,
							range: I,
							blockLimit: C,
							mergeCandidates: [],
							zombies: []
						};
						A = o.range;
						r = o.mergeCandidates;
						var y;
						var E;
						var H;
						var F;
						if (o.type == "text" && A.shrink(CKEDITOR.SHRINK_ELEMENT, true, false)) {
							y = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", A.document);
							A.insertNode(y);
							A.setStartAfter(y);
						}
						E = new CKEDITOR.dom.elementPath(A.startContainer);
						o.endPath = H = new CKEDITOR.dom.elementPath(A.endContainer);
						if (!A.collapsed) {
							C = H.block || H.blockLimit;
							var S = A.getCommonAncestor();
							if (C) {
								if (!C.equals(S) && (!C.contains(S) && A.checkEndOfBlock())) {
									o.zombies.push(C);
								}
							}
							A.deleteContents();
						}
						for (;
							(F = a(A.startContainer) && A.startContainer.getChild(A.startOffset - 1)) && (a(F) && (F.isBlockBoundary() && E.contains(F)));) {
							A.moveToPosition(F, CKEDITOR.POSITION_BEFORE_END);
						}
						e$$0(A, o.blockLimit, E, H);
						if (y) {
							A.setEndBefore(y);
							A.collapse();
							y.remove();
						}
						y = A.startPath();
						if (C = y.contains(f$$0, false, 1)) {
							A.splitElement(C);
							o.inlineStylesRoot = C;
							o.inlineStylesPeak = y.lastElement;
						}
						y = A.createBookmark();
						if (C = y.startNode.getPrevious(d$$0)) {
							if (a(C)) {
								if (f$$0(C)) {
									r.push(C);
								}
							}
						}
						if (C = y.startNode.getNext(d$$0)) {
							if (a(C)) {
								if (f$$0(C)) {
									r.push(C);
								}
							}
						}
						C = y.startNode;
						for (;
							(C = C.getParent()) && f$$0(C);) {
							r.push(C);
						}
						A.moveToBookmark(y);
						if (y = u) {
							y = o.range;
							if (o.type == "text" && o.inlineStylesRoot) {
								F = o.inlineStylesPeak;
								A = F.getDocument().createText("{cke-peak}");
								r = o.inlineStylesRoot.getParent();
								for (; !F.equals(r);) {
									A = A.appendTo(F.clone());
									F = F.getParent();
								}
								u = A.getOuterHtml().split("{cke-peak}").join(u);
							}
							F = o.blockLimit.getName();
							if (/^\s+|\s+$/.test(u) && "span" in CKEDITOR.dtd[F]) {
								var O = '<span data-cke-marker="1">&nbsp;</span>';
								u = O + u + O;
							}
							u = o.editor.dataProcessor.toHtml(u, {
								context: null,
								fixForBody: false,
								dontFilter: o.dontFilter,
								filter: o.editor.activeFilter,
								enterMode: o.editor.activeEnterMode
							});
							F = y.document.createElement("body");
							F.setHtml(u);
							if (O) {
								F.getFirst().remove();
								F.getLast().remove();
							}
							if ((O = y.startPath().block) && !(O.getChildCount() == 1 && O.getBogus())) {
								a: {
									var J;
									if (F.getChildCount() == 1 && (a(J = F.getFirst()) && J.is(k$$0))) {
										O = J.getElementsByTag("*");
										y = 0;
										r = O.count();
										for (; y < r; y++) {
											A = O.getItem(y);
											if (!A.is(n$$0)) {
												break a;
											}
										}
										J.moveChildren(J.getParent(1));
										J.remove();
									}
								}
							}
							o.dataWrapper = F;
							y = u;
						}
						if (y) {
							J = o.range;
							O = J.document;
							var G;
							u = o.blockLimit;
							y = 0;
							var M;
							F = [];
							var L;
							var Q;
							r = A = 0;
							var N;
							var T;
							E = J.startContainer;
							C = o.endPath.elements[0];
							var U;
							H = C.getPosition(E);
							S = !!C.getCommonAncestor(E) && (H != CKEDITOR.POSITION_IDENTICAL && !(H & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED));
							E = b$$1(o.dataWrapper, o);
							g$$0(E, J);
							for (; y < E.length; y++) {
								H = E[y];
								if (G = H.isLineBreak) {
									G = J;
									N = u;
									var P = void 0;
									var W = void 0;
									if (H.hasBlockSibling) {
										G = 1;
									} else {
										P = G.startContainer.getAscendant(h$$0.$block, 1);
										if (!P || !P.is({
											div: 1,
											p: 1
										})) {
											G = 0;
										} else {
											W = P.getPosition(N);
											if (W == CKEDITOR.POSITION_IDENTICAL || W == CKEDITOR.POSITION_CONTAINS) {
												G = 0;
											} else {
												N = G.splitElement(P);
												G.moveToPosition(N, CKEDITOR.POSITION_AFTER_START);
												G = 1;
											}
										}
									}
								}
								if (G) {
									r = y > 0;
								} else {
									G = J.startPath();
									if (!H.isBlock && (o.editor.config.autoParagraph !== false && (o.editor.activeEnterMode != CKEDITOR.ENTER_BR && (o.editor.editable().equals(G.blockLimit) && !G.block) && (Q = o.editor.activeEnterMode != CKEDITOR.ENTER_BR && o.editor.config.autoParagraph !== false ? o.editor.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p" : false)))) {
										Q = O.createElement(Q);
										Q.appendBogus();
										J.insertNode(Q);
										if (CKEDITOR.env.needsBrFiller) {
											if (M = Q.getBogus()) {
												M.remove();
											}
										}
										J.moveToPosition(Q, CKEDITOR.POSITION_BEFORE_END);
									}
									if ((G = J.startPath().block) && !G.equals(L)) {
										if (M = G.getBogus()) {
											M.remove();
											F.push(G);
										}
										L = G;
									}
									if (H.firstNotAllowed) {
										A = 1;
									}
									if (A && H.isElement) {
										G = J.startContainer;
										N = null;
										for (; G && !h$$0[G.getName()][H.name];) {
											if (G.equals(u)) {
												G = null;
												break;
											}
											N = G;
											G = G.getParent();
										}
										if (G) {
											if (N) {
												T = J.splitElement(N);
												o.zombies.push(T);
												o.zombies.push(N);
											}
										} else {
											N = u.getName();
											U = !y;
											G = y == E.length - 1;
											N = c$$1(H.node, N);
											P = [];
											W = N.length;
											var Z = 0;
											var aa = void 0;
											var ba = 0;
											var ca = -1;
											for (; Z < W; Z++) {
												aa = N[Z];
												if (aa == " ") {
													if (!ba && (!U || Z)) {
														P.push(new CKEDITOR.dom.text(" "));
														ca = P.length;
													}
													ba = 1;
												} else {
													P.push(aa);
													ba = 0;
												}
											}
											if (G) {
												if (ca == P.length) {
													P.pop();
												}
											}
											U = P;
										}
									}
									if (U) {
										for (; G = U.pop();) {
											J.insertNode(G);
										}
										U = 0;
									} else {
										J.insertNode(H.node);
									}
									if (H.lastNotAllowed && y < E.length - 1) {
										if (T = S ? C : T) {
											J.setEndAt(T, CKEDITOR.POSITION_AFTER_START);
										}
										A = 0;
									}
									J.collapse();
								}
							}
							o.dontMoveCaret = r;
							o.bogusNeededBlocks = F;
						}
						M = o.range;
						var X;
						T = o.bogusNeededBlocks;
						U = M.createBookmark();
						for (; L = o.zombies.pop();) {
							if (L.getParent()) {
								Q = M.clone();
								Q.moveToElementEditStart(L);
								Q.removeEmptyBlocksAtEnd();
							}
						}
						if (T) {
							for (; L = T.pop();) {
								if (CKEDITOR.env.needsBrFiller) {
									L.appendBogus();
								} else {
									L.append(M.document.createText(" "));
								}
							}
						}
						for (; L = o.mergeCandidates.pop();) {
							L.mergeSiblings();
						}
						M.moveToBookmark(U);
						if (!o.dontMoveCaret) {
							L = a(M.startContainer) && M.startContainer.getChild(M.startOffset - 1);
							for (; L && (a(L) && !L.is(h$$0.$empty));) {
								if (L.isBlockBoundary()) {
									M.moveToPosition(L, CKEDITOR.POSITION_BEFORE_END);
								} else {
									if (f$$0(L) && L.getHtml().match(/(\s|&nbsp;)$/g)) {
										X = null;
										break;
									}
									X = M.clone();
									X.moveToPosition(L, CKEDITOR.POSITION_BEFORE_END);
								}
								L = L.getLast(d$$0);
							}
							if (X) {
								M.moveToRange(X);
							}
						}
						I.select();
						j$$0(i);
					}
				};
			}();
			var r$$0 = function() {
				function a$$0(b$$0) {
					b$$0 = new CKEDITOR.dom.walker(b$$0);
					b$$0.guard = function(a, b) {
						if (b) {
							return false;
						}
						if (a.type == CKEDITOR.NODE_ELEMENT) {
							return a.is(CKEDITOR.dtd.$tableContent);
						}
					};
					b$$0.evaluator = function(a) {
						return a.type == CKEDITOR.NODE_ELEMENT;
					};
					return b$$0;
				}

				function b$$1(a, c, d) {
					c = a.getDocument().createElement(c);
					a.append(c, d);
					return c;
				}

				function c$$0(a) {
					var b = a.count();
					var d;
					b;
					for (; b-- > 0;) {
						d = a.getItem(b);
						if (!CKEDITOR.tools.trim(d.getHtml())) {
							d.appendBogus();
							if (CKEDITOR.env.ie) {
								if (CKEDITOR.env.version < 9 && d.getChildCount()) {
									d.getFirst().remove();
								}
							}
						}
					}
				}
				return function(d) {
					var f = d.startContainer;
					var e = f.getAscendant("table", 1);
					var g = false;
					c$$0(e.getElementsByTag("td"));
					c$$0(e.getElementsByTag("th"));
					e = d.clone();
					e.setStart(f, 0);
					e = a$$0(e).lastBackward();
					if (!e) {
						e = d.clone();
						e.setEndAt(f, CKEDITOR.POSITION_BEFORE_END);
						e = a$$0(e).lastForward();
						g = true;
					}
					if (!e) {
						e = f;
					}
					if (e.is("table")) {
						d.setStartAt(e, CKEDITOR.POSITION_BEFORE_START);
						d.collapse(true);
						e.remove();
					} else {
						if (e.is({
							tbody: 1,
							thead: 1,
							tfoot: 1
						})) {
							e = b$$1(e, "tr", g);
						}
						if (e.is("tr")) {
							e = b$$1(e, e.getParent().is("thead") ? "th" : "td", g);
						}
						if (f = e.getBogus()) {
							f.remove();
						}
						d.moveToPosition(e, g ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
					}
				};
			}();
		})();
		(function() {
			function a$$2() {
				var a = this._.fakeSelection;
				var b;
				if (a) {
					b = this.getSelection(1);
					if (!b || !b.isHidden()) {
						a.reset();
						a = 0;
					}
				}
				if (!a) {
					a = b || this.getSelection(1);
					if (!a || a.getType() == CKEDITOR.SELECTION_NONE) {
						return;
					}
				}
				this.fire("selectionCheck", a);
				b = this.elementPath();
				if (!b.compare(this._.selectionPreviousPath)) {
					if (CKEDITOR.env.webkit) {
						this._.previousActive = this.document.getActive();
					}
					this._.selectionPreviousPath = b;
					this.fire("selectionChange", {
						selection: a,
						path: b
					});
				}
			}

			function e$$0() {
				o$$0 = true;
				if (!n$$0) {
					b$$2.call(this);
					n$$0 = CKEDITOR.tools.setTimeout(b$$2, 200, this);
				}
			}

			function b$$2() {
				n$$0 = null;
				if (o$$0) {
					CKEDITOR.tools.setTimeout(a$$2, 0, this);
					o$$0 = false;
				}
			}

			function d$$2(a) {
				function b(c, d) {
					return !c || c.type == CKEDITOR.NODE_TEXT ? false : a.clone()["moveToElementEdit" + (d ? "End" : "Start")](c);
				}
				if (!(a.root instanceof CKEDITOR.editable)) {
					return false;
				}
				var c$$0 = a.startContainer;
				var d$$0 = a.getPreviousNode(r, null, c$$0);
				var f = a.getNextNode(r, null, c$$0);
				return b(d$$0) || (b(f, 1) || !d$$0 && (!f && !(c$$0.type == CKEDITOR.NODE_ELEMENT && (c$$0.isBlockBoundary() && c$$0.getBogus())))) ? true : false;
			}

			function f$$1(a) {
				return a.getCustomData("cke-fillingChar");
			}

			function c$$1(a, b) {
				var c = a && a.removeCustomData("cke-fillingChar");
				if (c) {
					if (b !== false) {
						var d;
						var f = a.getDocument().getSelection().getNative();
						var e = f && (f.type != "None" && f.getRangeAt(0));
						if (c.getLength() > 1 && (e && e.intersectsNode(c.$))) {
							d = [f.anchorOffset, f.focusOffset];
							e = f.focusNode == c.$ && f.focusOffset > 0;
							if (f.anchorNode == c.$) {
								if (f.anchorOffset > 0) {
									d[0] --;
								}
							}
							if (e) {
								d[1] --;
							}
							var g;
							e = f;
							if (!e.isCollapsed) {
								g = e.getRangeAt(0);
								g.setStart(e.anchorNode, e.anchorOffset);
								g.setEnd(e.focusNode, e.focusOffset);
								g = g.collapsed;
							}
							if (g) {
								d.unshift(d.pop());
							}
						}
					}
					c.setText(h$$0(c.getText()));
					if (d) {
						c = f.getRangeAt(0);
						c.setStart(c.startContainer, d[0]);
						c.setEnd(c.startContainer, d[1]);
						f.removeAllRanges();
						f.addRange(c);
					}
				}
			}

			function h$$0(a$$0) {
				return a$$0.replace(/\u200B( )?/g, function(a) {
					return a[1] ? " " : "";
				});
			}

			function j$$0(a$$0, b, c) {
				var d = a$$0.on("focus", function(a) {
					a.cancel();
				}, null, null, -100);
				if (CKEDITOR.env.ie) {
					var f = a$$0.getDocument().on("selectionchange", function(a) {
						a.cancel();
					}, null, null, -100)
				} else {
					var e = new CKEDITOR.dom.range(a$$0);
					e.moveToElementEditStart(a$$0);
					var g = a$$0.getDocument().$.createRange();
					g.setStart(e.startContainer.$, e.startOffset);
					g.collapse(1);
					b.removeAllRanges();
					b.addRange(g);
				}
				if (c) {
					a$$0.focus();
				}
				d.removeListener();
				if (f) {
					f.removeListener();
				}
			}

			function g$$1(a$$0) {
				var b = CKEDITOR.dom.element.createFromHtml('<div data-cke-hidden-sel="1" data-cke-temp="1" style="' + (CKEDITOR.env.ie ? "display:none" : "position:fixed;top:0;left:-1000px") + '">&nbsp;</div>', a$$0.document);
				a$$0.fire("lockSnapshot");
				a$$0.editable().append(b);
				var c = a$$0.getSelection(1);
				var d = a$$0.createRange();
				var f = c.root.on("selectionchange", function(a) {
					a.cancel();
				}, null, null, 0);
				d.setStartAt(b, CKEDITOR.POSITION_AFTER_START);
				d.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
				c.selectRanges([d]);
				f.removeListener();
				a$$0.fire("unlockSnapshot");
				a$$0._.hiddenSelectionContainer = b;
			}

			function i$$0(a) {
				var b = {
					37: 1,
					39: 1,
					8: 1,
					46: 1
				};
				return function(c) {
					var d = c.data.getKeystroke();
					if (b[d]) {
						var f = a.getSelection().getRanges();
						var e = f[0];
						if (f.length == 1 && e.collapsed) {
							if ((d = e[d < 38 ? "getPreviousEditableNode" : "getNextEditableNode"]()) && (d.type == CKEDITOR.NODE_ELEMENT && d.getAttribute("contenteditable") == "false")) {
								a.getSelection().fake(d);
								c.data.preventDefault();
								c.cancel();
							}
						}
					}
				};
			}

			function k$$0(a) {
				var b = 0;
				for (; b < a.length; b++) {
					var c = a[b];
					if (c.getCommonAncestor().isReadOnly()) {
						a.splice(b, 1);
					}
					if (!c.collapsed) {
						if (c.startContainer.isReadOnly()) {
							var d$$0 = c.startContainer;
							var f$$0;
							for (; d$$0;) {
								if ((f$$0 = d$$0.type == CKEDITOR.NODE_ELEMENT) && d$$0.is("body") || !d$$0.isReadOnly()) {
									break;
								}
								if (f$$0) {
									if (d$$0.getAttribute("contentEditable") == "false") {
										c.setStartAfter(d$$0);
									}
								}
								d$$0 = d$$0.getParent();
							}
						}
						d$$0 = c.startContainer;
						f$$0 = c.endContainer;
						var e = c.startOffset;
						var g = c.endOffset;
						var h = c.clone();
						if (d$$0) {
							if (d$$0.type == CKEDITOR.NODE_TEXT) {
								if (e >= d$$0.getLength()) {
									h.setStartAfter(d$$0);
								} else {
									h.setStartBefore(d$$0);
								}
							}
						}
						if (f$$0) {
							if (f$$0.type == CKEDITOR.NODE_TEXT) {
								if (g) {
									h.setEndAfter(f$$0);
								} else {
									h.setEndBefore(f$$0);
								}
							}
						}
						d$$0 = new CKEDITOR.dom.walker(h);
						d$$0.evaluator = function(d) {
							if (d.type == CKEDITOR.NODE_ELEMENT && d.isReadOnly()) {
								var f = c.clone();
								c.setEndBefore(d);
								if (c.collapsed) {
									a.splice(b--, 1);
								}
								if (!(d.getPosition(h.endContainer) & CKEDITOR.POSITION_CONTAINS)) {
									f.setStartAfter(d);
									if (!f.collapsed) {
										a.splice(b + 1, 0, f);
									}
								}
								return true;
							}
							return false;
						};
						d$$0.next();
					}
				}
				return a;
			}
			var n$$0;
			var o$$0;
			var r = CKEDITOR.dom.walker.invisible(1);
			var l$$0 = function() {
				function a$$0(b) {
					return function(a) {
						var c = a.editor.createRange();
						if (c.moveToClosestEditablePosition(a.selected, b)) {
							a.editor.getSelection().selectRanges([c]);
						}
						return false;
					};
				}

				function b$$0(a) {
					return function(b) {
						var c = b.editor;
						var d = c.createRange();
						var f;
						if (!(f = d.moveToClosestEditablePosition(b.selected, a))) {
							f = d.moveToClosestEditablePosition(b.selected, !a);
						}
						if (f) {
							c.getSelection().selectRanges([d]);
						}
						c.fire("saveSnapshot");
						b.selected.remove();
						if (!f) {
							d.moveToElementEditablePosition(c.editable());
							c.getSelection().selectRanges([d]);
						}
						c.fire("saveSnapshot");
						return false;
					};
				}
				var c$$0 = a$$0();
				var d$$0 = a$$0(1);
				return {
					37: c$$0,
					38: c$$0,
					39: d$$0,
					40: d$$0,
					8: b$$0(),
					46: b$$0(1)
				};
			}();
			CKEDITOR.on("instanceCreated", function(b$$1) {
				function d$$1() {
					var a = f$$0.getSelection();
					if (a) {
						a.removeAllRanges();
					}
				}
				var f$$0 = b$$1.editor;
				f$$0.on("contentDom", function() {
					var b$$0 = f$$0.document;
					var d$$0 = CKEDITOR.document;
					var g$$0 = f$$0.editable();
					var h = b$$0.getBody();
					var j = b$$0.getDocumentElement();
					var k = g$$0.isInline();
					var p;
					var n;
					if (CKEDITOR.env.gecko) {
						g$$0.attachListener(g$$0, "focus", function(a) {
							a.removeListener();
							if (p !== 0) {
								if ((a = f$$0.getSelection().getNative()) && (a.isCollapsed && a.anchorNode == g$$0.$)) {
									a = f$$0.createRange();
									a.moveToElementEditStart(g$$0);
									a.select();
								}
							}
						}, null, null, -2);
					}
					g$$0.attachListener(g$$0, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
						if (p) {
							if (CKEDITOR.env.webkit) {
								p = f$$0._.previousActive && f$$0._.previousActive.equals(b$$0.getActive());
							}
						}
						f$$0.unlockSelection(p);
						p = 0;
					}, null, null, -1);
					g$$0.attachListener(g$$0, "mousedown", function() {
						p = 0;
					});
					if (CKEDITOR.env.ie || k) {
						var l = function() {
							n = new CKEDITOR.dom.selection(f$$0.getSelection());
							n.lock();
						};
						if (m) {
							g$$0.attachListener(g$$0, "beforedeactivate", l, null, null, -1);
						} else {
							g$$0.attachListener(f$$0, "selectionCheck", l, null, null, -1);
						}
						g$$0.attachListener(g$$0, CKEDITOR.env.webkit ? "DOMFocusOut" : "blur", function() {
							f$$0.lockSelection(n);
							p = 1;
						}, null, null, -1);
						g$$0.attachListener(g$$0, "mousedown", function() {
							p = 0;
						});
					}
					if (CKEDITOR.env.ie && !k) {
						var C;
						g$$0.attachListener(g$$0, "mousedown", function(a) {
							if (a.data.$.button == 2) {
								a = f$$0.document.getSelection();
								if (!a || a.getType() == CKEDITOR.SELECTION_NONE) {
									C = f$$0.window.getScrollPosition();
								}
							}
						});
						g$$0.attachListener(g$$0, "mouseup", function(a) {
							if (a.data.$.button == 2 && C) {
								f$$0.document.$.documentElement.scrollLeft = C.x;
								f$$0.document.$.documentElement.scrollTop = C.y;
							}
							C = null;
						});
						if (b$$0.$.compatMode != "BackCompat") {
							if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) {
								j.on("mousedown", function(a$$0) {
									function b(a) {
										a = a.data.$;
										if (f) {
											var c = h.$.createTextRange();
											try {
												c.moveToPoint(a.x, a.y);
											} catch (d) {}
											f.setEndPoint(g.compareEndPoints("StartToStart", c) < 0 ? "EndToEnd" : "StartToStart", c);
											f.select();
										}
									}

									function c$$0() {
										j.removeListener("mousemove", b);
										d$$0.removeListener("mouseup", c$$0);
										j.removeListener("mouseup", c$$0);
										f.select();
									}
									a$$0 = a$$0.data;
									if (a$$0.getTarget().is("html") && (a$$0.$.y < j.$.clientHeight && a$$0.$.x < j.$.clientWidth)) {
										var f = h.$.createTextRange();
										try {
											f.moveToPoint(a$$0.$.x, a$$0.$.y);
										} catch (e) {}
										var g = f.duplicate();
										j.on("mousemove", b);
										d$$0.on("mouseup", c$$0);
										j.on("mouseup", c$$0);
									}
								});
							}
							if (CKEDITOR.env.version > 7 && CKEDITOR.env.version < 11) {
								j.on("mousedown", function(a) {
									if (a.data.getTarget().is("html")) {
										d$$0.on("mouseup", y);
										j.on("mouseup", y);
									}
								});
								var y = function() {
									d$$0.removeListener("mouseup", y);
									j.removeListener("mouseup", y);
									var a = CKEDITOR.document.$.selection;
									var c = a.createRange();
									if (a.type != "None") {
										if (c.parentElement().ownerDocument == b$$0.$) {
											c.select();
										}
									}
								};
							}
						}
					}
					g$$0.attachListener(g$$0, "selectionchange", a$$2, f$$0);
					g$$0.attachListener(g$$0, "keyup", e$$0, f$$0);
					g$$0.attachListener(g$$0, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
						f$$0.forceNextSelectionCheck();
						f$$0.selectionChange(1);
					});
					if (k && (CKEDITOR.env.webkit || CKEDITOR.env.gecko)) {
						var E;
						g$$0.attachListener(g$$0, "mousedown", function() {
							E = 1;
						});
						g$$0.attachListener(b$$0.getDocumentElement(), "mouseup", function() {
							if (E) {
								e$$0.call(f$$0);
							}
							E = 0;
						});
					} else {
						g$$0.attachListener(CKEDITOR.env.ie ? g$$0 : b$$0.getDocumentElement(), "mouseup", e$$0, f$$0);
					}
					if (CKEDITOR.env.webkit) {
						g$$0.attachListener(b$$0, "keydown", function(a) {
							switch (a.data.getKey()) {
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
									c$$1(g$$0);
							}
						}, null, null, -1);
					}
					g$$0.attachListener(g$$0, "keydown", i$$0(f$$0), null, null, -1);
				});
				f$$0.on("setData", function() {
					f$$0.unlockSelection();
					if (CKEDITOR.env.webkit) {
						d$$1();
					}
				});
				f$$0.on("contentDomUnload", function() {
					f$$0.unlockSelection();
				});
				if (CKEDITOR.env.ie9Compat) {
					f$$0.on("beforeDestroy", d$$1, null, null, 9);
				}
				f$$0.on("dataReady", function() {
					delete f$$0._.fakeSelection;
					delete f$$0._.hiddenSelectionContainer;
					f$$0.selectionChange(1);
				});
				f$$0.on("loadSnapshot", function() {
					var a$$0 = f$$0.editable().getLast(function(a) {
						return a.type == CKEDITOR.NODE_ELEMENT;
					});
					if (a$$0) {
						if (a$$0.hasAttribute("data-cke-hidden-sel")) {
							a$$0.remove();
						}
					}
				}, null, null, 100);
				f$$0.on("key", function(a) {
					if (f$$0.mode == "wysiwyg") {
						var b = f$$0.getSelection();
						if (b.isFake) {
							var c = l$$0[a.data.keyCode];
							if (c) {
								return c({
									editor: f$$0,
									selected: b.getSelectedElement(),
									selection: b,
									keyEvent: a
								});
							}
						}
					}
				});
			});
			CKEDITOR.on("instanceReady", function(a$$0) {
				var b = a$$0.editor;
				if (CKEDITOR.env.webkit) {
					b.on("selectionChange", function() {
						var a = b.editable();
						var d = f$$1(a);
						if (d) {
							if (d.getCustomData("ready")) {
								c$$1(a);
							} else {
								d.setCustomData("ready", 1);
							}
						}
					}, null, null, -1);
					b.on("beforeSetMode", function() {
						c$$1(b.editable());
					}, null, null, -1);
					var d$$0;
					var e;
					a$$0 = function() {
						var a = b.editable();
						if (a) {
							if (a = f$$1(a)) {
								var c = b.document.$.defaultView.getSelection();
								if (c.type == "Caret") {
									if (c.anchorNode == a.$) {
										e = 1;
									}
								}
								d$$0 = a.getText();
								a.setText(h$$0(d$$0));
							}
						}
					};
					var g = function() {
						var a = b.editable();
						if (a) {
							if (a = f$$1(a)) {
								a.setText(d$$0);
								if (e) {
									b.document.$.defaultView.getSelection().setPosition(a.$, a.getLength());
									e = 0;
								}
							}
						}
					};
					b.on("beforeUndoImage", a$$0);
					b.on("afterUndoImage", g);
					b.on("beforeGetData", a$$0, null, null, 0);
					b.on("getData", g);
				}
			});
			CKEDITOR.editor.prototype.selectionChange = function(b) {
				(b ? a$$2 : e$$0).call(this);
			};
			CKEDITOR.editor.prototype.getSelection = function(a) {
				if ((this._.savedSelection || this._.fakeSelection) && !a) {
					return this._.savedSelection || this._.fakeSelection;
				}
				return (a = this.editable()) && this.mode == "wysiwyg" ? new CKEDITOR.dom.selection(a) : null;
			};
			CKEDITOR.editor.prototype.lockSelection = function(a) {
				a = a || this.getSelection(1);
				if (a.getType() != CKEDITOR.SELECTION_NONE) {
					if (!a.isLocked) {
						a.lock();
					}
					this._.savedSelection = a;
					return true;
				}
				return false;
			};
			CKEDITOR.editor.prototype.unlockSelection = function(a) {
				var b = this._.savedSelection;
				if (b) {
					b.unlock(a);
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
				var a = this.root instanceof CKEDITOR.editable ? this.root.editor.getSelection() : new CKEDITOR.dom.selection(this.root);
				a.selectRanges([this]);
				return a;
			};
			CKEDITOR.SELECTION_NONE = 1;
			CKEDITOR.SELECTION_TEXT = 2;
			CKEDITOR.SELECTION_ELEMENT = 3;
			var m = typeof window.getSelection != "function";
			var s = 1;
			CKEDITOR.dom.selection = function(a) {
				if (a instanceof CKEDITOR.dom.selection) {
					var b = a;
					a = a.root;
				}
				var c = a instanceof CKEDITOR.dom.element;
				this.rev = b ? b.rev : s++;
				this.document = a instanceof CKEDITOR.dom.document ? a : a.getDocument();
				this.root = a = c ? a : this.document.getBody();
				this.isLocked = 0;
				this._ = {
					cache: {}
				};
				if (b) {
					CKEDITOR.tools.extend(this._.cache, b._.cache);
					this.isFake = b.isFake;
					this.isLocked = b.isLocked;
					return this;
				}
				b = m ? this.document.$.selection : this.document.getWindow().$.getSelection();
				if (CKEDITOR.env.webkit) {
					if (b.type == "None" && this.document.getActive().equals(a) || b.type == "Caret" && b.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT) {
						j$$0(a, b);
					}
				} else {
					if (CKEDITOR.env.gecko) {
						if (b) {
							if (this.document.getActive().equals(a) && (b.anchorNode && b.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT)) {
								j$$0(a, b, true);
							}
						}
					} else {
						if (CKEDITOR.env.ie) {
							var d;
							try {
								d = this.document.getActive();
							} catch (f) {}
							if (m) {
								if (b.type == "None") {
									if (d && d.equals(this.document.getDocumentElement())) {
										j$$0(a, null, true);
									}
								}
							} else {
								if (b = b && b.anchorNode) {
									b = new CKEDITOR.dom.node(b);
								}
								if (d) {
									if (d.equals(this.document.getDocumentElement()) && (b && (a.equals(b) || a.contains(b)))) {
										j$$0(a, null, true);
									}
								}
							}
						}
					}
				}
				d = this.getNative();
				var e;
				var g;
				if (d) {
					if (d.getRangeAt) {
						e = (g = d.rangeCount && d.getRangeAt(0)) && new CKEDITOR.dom.node(g.commonAncestorContainer);
					} else {
						try {
							g = d.createRange();
						} catch (h) {}
						e = g && CKEDITOR.dom.element.get(g.item && g.item(0) || g.parentElement());
					}
				}
				if (!e || (!(e.type == CKEDITOR.NODE_ELEMENT || e.type == CKEDITOR.NODE_TEXT) || !this.root.equals(e) && !this.root.contains(e))) {
					this._.cache.type = CKEDITOR.SELECTION_NONE;
					this._.cache.startElement = null;
					this._.cache.selectedElement = null;
					this._.cache.selectedText = "";
					this._.cache.ranges = new CKEDITOR.dom.rangeList;
				}
				return this;
			};
			var t = {
				img: 1,
				hr: 1,
				li: 1,
				table: 1,
				tr: 1,
				td: 1,
				th: 1,
				embed: 1,
				object: 1,
				ol: 1,
				ul: 1,
				a: 1,
				input: 1,
				form: 1,
				select: 1,
				textarea: 1,
				button: 1,
				fieldset: 1,
				thead: 1,
				tfoot: 1
			};
			CKEDITOR.dom.selection.prototype = {
				getNative: function() {
					return this._.cache.nativeSel !== void 0 ? this._.cache.nativeSel : this._.cache.nativeSel = m ? this.document.$.selection : this.document.getWindow().$.getSelection();
				},
				getType: m ? function() {
					var a = this._.cache;
					if (a.type) {
						return a.type;
					}
					var b = CKEDITOR.SELECTION_NONE;
					try {
						var c = this.getNative();
						var d = c.type;
						if (d == "Text") {
							b = CKEDITOR.SELECTION_TEXT;
						}
						if (d == "Control") {
							b = CKEDITOR.SELECTION_ELEMENT;
						}
						if (c.createRange().parentElement()) {
							b = CKEDITOR.SELECTION_TEXT;
						}
					} catch (f) {}
					return a.type = b;
				} : function() {
					var a = this._.cache;
					if (a.type) {
						return a.type;
					}
					var b = CKEDITOR.SELECTION_TEXT;
					var c = this.getNative();
					if (!c || !c.rangeCount) {
						b = CKEDITOR.SELECTION_NONE;
					} else {
						if (c.rangeCount == 1) {
							c = c.getRangeAt(0);
							var d = c.startContainer;
							if (d == c.endContainer && (d.nodeType == 1 && (c.endOffset - c.startOffset == 1 && t[d.childNodes[c.startOffset].nodeName.toLowerCase()]))) {
								b = CKEDITOR.SELECTION_ELEMENT;
							}
						}
					}
					return a.type = b;
				},
				getRanges: function() {
					var a$$1 = m ? function() {
						function a$$0(b) {
							return (new CKEDITOR.dom.node(b)).getIndex();
						}
						var b$$0 = function(b, c) {
							b = b.duplicate();
							b.collapse(c);
							var d = b.parentElement();
							if (!d.hasChildNodes()) {
								return {
									container: d,
									offset: 0
								};
							}
							var f = d.children;
							var e;
							var g;
							var h = b.duplicate();
							var i = 0;
							var j = f.length - 1;
							var k = -1;
							var y;
							var E;
							for (; i <= j;) {
								k = Math.floor((i + j) / 2);
								e = f[k];
								h.moveToElementText(e);
								y = h.compareEndPoints("StartToStart", b);
								if (y > 0) {
									j = k - 1;
								} else {
									if (y < 0) {
										i = k + 1;
									} else {
										return {
											container: d,
											offset: a$$0(e)
										};
									}
								}
							}
							if (k == -1 || k == f.length - 1 && y < 0) {
								h.moveToElementText(d);
								h.setEndPoint("StartToStart", b);
								h = h.text.replace(/(\r\n|\r)/g, "\n").length;
								f = d.childNodes;
								if (!h) {
									e = f[f.length - 1];
									return e.nodeType != CKEDITOR.NODE_TEXT ? {
										container: d,
										offset: f.length
									} : {
										container: e,
										offset: e.nodeValue.length
									};
								}
								d = f.length;
								for (; h > 0 && d > 0;) {
									g = f[--d];
									if (g.nodeType == CKEDITOR.NODE_TEXT) {
										E = g;
										h = h - g.nodeValue.length;
									}
								}
								return {
									container: E,
									offset: -h
								};
							}
							h.collapse(y > 0 ? true : false);
							h.setEndPoint(y > 0 ? "StartToStart" : "EndToStart", b);
							h = h.text.replace(/(\r\n|\r)/g, "\n").length;
							if (!h) {
								return {
									container: d,
									offset: a$$0(e) + (y > 0 ? 0 : 1)
								};
							}
							for (; h > 0;) {
								try {
									g = e[y > 0 ? "previousSibling" : "nextSibling"];
									if (g.nodeType == CKEDITOR.NODE_TEXT) {
										h = h - g.nodeValue.length;
										E = g;
									}
									e = g;
								} catch (n) {
									return {
										container: d,
										offset: a$$0(e)
									};
								}
							}
							return {
								container: E,
								offset: y > 0 ? -h : E.nodeValue.length + h
							};
						};
						return function() {
							var a = this.getNative();
							var c = a && a.createRange();
							var d = this.getType();
							if (!a) {
								return [];
							}
							if (d == CKEDITOR.SELECTION_TEXT) {
								a = new CKEDITOR.dom.range(this.root);
								d = b$$0(c, true);
								a.setStart(new CKEDITOR.dom.node(d.container), d.offset);
								d = b$$0(c);
								a.setEnd(new CKEDITOR.dom.node(d.container), d.offset);
								if (a.endContainer.getPosition(a.startContainer) & CKEDITOR.POSITION_PRECEDING) {
									if (a.endOffset <= a.startContainer.getIndex()) {
										a.collapse();
									}
								}
								return [a];
							}
							if (d == CKEDITOR.SELECTION_ELEMENT) {
								d = [];
								var f = 0;
								for (; f < c.length; f++) {
									var e = c.item(f);
									var g = e.parentNode;
									var h = 0;
									a = new CKEDITOR.dom.range(this.root);
									for (; h < g.childNodes.length && g.childNodes[h] != e; h++) {}
									a.setStart(new CKEDITOR.dom.node(g), h);
									a.setEnd(new CKEDITOR.dom.node(g), h + 1);
									d.push(a);
								}
								return d;
							}
							return [];
						};
					}() : function() {
						var a = [];
						var b;
						var c = this.getNative();
						if (!c) {
							return a;
						}
						var d = 0;
						for (; d < c.rangeCount; d++) {
							var f = c.getRangeAt(d);
							b = new CKEDITOR.dom.range(this.root);
							b.setStart(new CKEDITOR.dom.node(f.startContainer), f.startOffset);
							b.setEnd(new CKEDITOR.dom.node(f.endContainer), f.endOffset);
							a.push(b);
						}
						return a;
					};
					return function(b) {
						var c = this._.cache;
						var d = c.ranges;
						if (!d) {
							c.ranges = d = new CKEDITOR.dom.rangeList(a$$1.call(this));
						}
						return !b ? d : k$$0(new CKEDITOR.dom.rangeList(d.slice()));
					};
				}(),
				getStartElement: function() {
					var a = this._.cache;
					if (a.startElement !== void 0) {
						return a.startElement;
					}
					var b;
					switch (this.getType()) {
						case CKEDITOR.SELECTION_ELEMENT:
							return this.getSelectedElement();
						case CKEDITOR.SELECTION_TEXT:
							var c = this.getRanges()[0];
							if (c) {
								if (c.collapsed) {
									b = c.startContainer;
									if (b.type != CKEDITOR.NODE_ELEMENT) {
										b = b.getParent();
									}
								} else {
									c.optimize();
									for (;;) {
										b = c.startContainer;
										if (c.startOffset == (b.getChildCount ? b.getChildCount() : b.getLength()) && !b.isBlockBoundary()) {
											c.setStartAfter(b);
										} else {
											break;
										}
									}
									b = c.startContainer;
									if (b.type != CKEDITOR.NODE_ELEMENT) {
										return b.getParent();
									}
									b = b.getChild(c.startOffset);
									if (!b || b.type != CKEDITOR.NODE_ELEMENT) {
										b = c.startContainer;
									} else {
										c = b.getFirst();
										for (; c && c.type == CKEDITOR.NODE_ELEMENT;) {
											b = c;
											c = c.getFirst();
										}
									}
								}
								b = b.$;
							};
					}
					return a.startElement = b ? new CKEDITOR.dom.element(b) : null;
				},
				getSelectedElement: function() {
					var a$$0 = this._.cache;
					if (a$$0.selectedElement !== void 0) {
						return a$$0.selectedElement;
					}
					var b = this;
					var c$$0 = CKEDITOR.tools.tryThese(function() {
						return b.getNative().createRange().item(0);
					}, function() {
						var a = b.getRanges()[0].clone();
						var c;
						var d;
						var f = 2;
						for (; f && (!(c = a.getEnclosedNode()) || !(c.type == CKEDITOR.NODE_ELEMENT && (t[c.getName()] && (d = c)))); f--) {
							a.shrink(CKEDITOR.SHRINK_ELEMENT);
						}
						return d && d.$;
					});
					return a$$0.selectedElement = c$$0 ? new CKEDITOR.dom.element(c$$0) : null;
				},
				getSelectedText: function() {
					var a = this._.cache;
					if (a.selectedText !== void 0) {
						return a.selectedText;
					}
					var b = this.getNative();
					b = m ? b.type == "Control" ? "" : b.createRange().text : b.toString();
					return a.selectedText = b;
				},
				lock: function() {
					this.getRanges();
					this.getStartElement();
					this.getSelectedElement();
					this.getSelectedText();
					this._.cache.nativeSel = null;
					this.isLocked = 1;
				},
				unlock: function(a) {
					if (this.isLocked) {
						if (a) {
							var b = this.getSelectedElement();
							var c = !b && this.getRanges();
							var d = this.isFake;
						}
						this.isLocked = 0;
						this.reset();
						if (a) {
							if (a = b || c[0] && c[0].getCommonAncestor()) {
								if (a.getAscendant("body", 1)) {
									if (d) {
										this.fake(b);
									} else {
										if (b) {
											this.selectElement(b);
										} else {
											this.selectRanges(c);
										}
									}
								}
							}
						}
					}
				},
				reset: function() {
					this._.cache = {};
					this.isFake = 0;
					var a = this.root.editor;
					if (a && (a._.fakeSelection && this.rev == a._.fakeSelection.rev)) {
						delete a._.fakeSelection;
						var b = a._.hiddenSelectionContainer;
						if (b) {
							a.fire("lockSnapshot");
							b.remove();
							a.fire("unlockSnapshot");
						}
						delete a._.hiddenSelectionContainer;
					}
					this.rev = s++;
				},
				selectElement: function(a) {
					var b = new CKEDITOR.dom.range(this.root);
					b.setStartBefore(a);
					b.setEndAfter(a);
					this.selectRanges([b]);
				},
				selectRanges: function(a) {
					var b = this.root.editor;
					b = b && b._.hiddenSelectionContainer;
					this.reset();
					if (b) {
						b = this.root;
						var f;
						var e = 0;
						for (; e < a.length; ++e) {
							f = a[e];
							if (f.endContainer.equals(b)) {
								f.endOffset = Math.min(f.endOffset, b.getChildCount());
							}
						}
					}
					if (a.length) {
						if (this.isLocked) {
							var g = CKEDITOR.document.getActive();
							this.unlock();
							this.selectRanges(a);
							this.lock();
							if (!g.equals(this.root)) {
								g.focus();
							}
						} else {
							var h;
							a: {
								var i;
								var j;
								if (a.length == 1 && (!(j = a[0]).collapsed && ((h = j.getEnclosedNode()) && h.type == CKEDITOR.NODE_ELEMENT))) {
									j = j.clone();
									j.shrink(CKEDITOR.SHRINK_ELEMENT, true);
									if ((i = j.getEnclosedNode()) && i.type == CKEDITOR.NODE_ELEMENT) {
										h = i;
									}
									if (h.getAttribute("contenteditable") == "false") {
										break a;
									}
								}
								h = void 0;
							}
							if (h) {
								this.fake(h);
							} else {
								if (m) {
									j = CKEDITOR.dom.walker.whitespaces(true);
									i = /\ufeff|\u00a0/;
									b = {
										table: 1,
										tbody: 1,
										tr: 1
									};
									if (a.length > 1) {
										h = a[a.length - 1];
										a[0].setEnd(h.endContainer, h.endOffset);
									}
									h = a[0];
									a = h.collapsed;
									var k;
									var n;
									var l;
									if ((f = h.getEnclosedNode()) && (f.type == CKEDITOR.NODE_ELEMENT && (f.getName() in t && (!f.is("a") || !f.getText())))) {
										try {
											l = f.$.createControlRange();
											l.addElement(f.$);
											l.select();
											return;
										} catch (o) {}
									}
									if (h.startContainer.type == CKEDITOR.NODE_ELEMENT && h.startContainer.getName() in b || h.endContainer.type == CKEDITOR.NODE_ELEMENT && h.endContainer.getName() in b) {
										h.shrink(CKEDITOR.NODE_ELEMENT, true);
									}
									l = h.createBookmark();
									b = l.startNode;
									if (!a) {
										g = l.endNode;
									}
									l = h.document.$.body.createTextRange();
									l.moveToElementText(b.$);
									l.moveStart("character", 1);
									if (g) {
										i = h.document.$.body.createTextRange();
										i.moveToElementText(g.$);
										l.setEndPoint("EndToEnd", i);
										l.moveEnd("character", -1);
									} else {
										k = b.getNext(j);
										n = b.hasAscendant("pre");
										k = !(k && (k.getText && k.getText().match(i))) && (n || (!b.hasPrevious() || b.getPrevious().is && b.getPrevious().is("br")));
										n = h.document.createElement("span");
										n.setHtml("&#65279;");
										n.insertBefore(b);
										if (k) {
											h.document.createText("\ufeff").insertBefore(b);
										}
									}
									h.setStartBefore(b);
									b.remove();
									if (a) {
										if (k) {
											l.moveStart("character", -1);
											l.select();
											h.document.$.selection.clear();
										} else {
											l.select();
										}
										h.moveToPosition(n, CKEDITOR.POSITION_BEFORE_START);
										n.remove();
									} else {
										h.setEndBefore(g);
										g.remove();
										l.select();
									}
								} else {
									g = this.getNative();
									if (!g) {
										return;
									}
									this.removeAllRanges();
									l = 0;
									for (; l < a.length; l++) {
										if (l < a.length - 1) {
											k = a[l];
											n = a[l + 1];
											i = k.clone();
											i.setStart(k.endContainer, k.endOffset);
											i.setEnd(n.startContainer, n.startOffset);
											if (!i.collapsed) {
												i.shrink(CKEDITOR.NODE_ELEMENT, true);
												h = i.getCommonAncestor();
												i = i.getEnclosedNode();
												if (h.isReadOnly() || i && i.isReadOnly()) {
													n.setStart(k.startContainer, k.startOffset);
													a.splice(l--, 1);
													continue;
												}
											}
										}
										h = a[l];
										n = this.document.$.createRange();
										if (h.collapsed && (CKEDITOR.env.webkit && d$$2(h))) {
											k = this.root;
											c$$1(k, false);
											i = k.getDocument().createText("\u200b");
											k.setCustomData("cke-fillingChar", i);
											h.insertNode(i);
											if ((k = i.getNext()) && (!i.getPrevious() && (k.type == CKEDITOR.NODE_ELEMENT && k.getName() == "br"))) {
												c$$1(this.root);
												h.moveToPosition(k, CKEDITOR.POSITION_BEFORE_START);
											} else {
												h.moveToPosition(i, CKEDITOR.POSITION_AFTER_END);
											}
										}
										n.setStart(h.startContainer.$, h.startOffset);
										try {
											n.setEnd(h.endContainer.$, h.endOffset);
										} catch (C) {
											if (C.toString().indexOf("NS_ERROR_ILLEGAL_VALUE") >= 0) {
												h.collapse(1);
												n.setEnd(h.endContainer.$, h.endOffset);
											} else {
												throw C;
											}
										}
										g.addRange(n);
									}
								}
								this.reset();
								this.root.fire("selectionchange");
							}
						}
					}
				},
				fake: function(a) {
					var b = this.root.editor;
					this.reset();
					g$$1(b);
					var c = this._.cache;
					var d = new CKEDITOR.dom.range(this.root);
					d.setStartBefore(a);
					d.setEndAfter(a);
					c.ranges = new CKEDITOR.dom.rangeList(d);
					c.selectedElement = c.startElement = a;
					c.type = CKEDITOR.SELECTION_ELEMENT;
					c.selectedText = c.nativeSel = null;
					this.isFake = 1;
					this.rev = s++;
					b._.fakeSelection = this;
					this.root.fire("selectionchange");
				},
				isHidden: function() {
					var a = this.getCommonAncestor();
					if (a) {
						if (a.type == CKEDITOR.NODE_TEXT) {
							a = a.getParent();
						}
					}
					return !(!a || !a.data("cke-hidden-sel"));
				},
				createBookmarks: function(a) {
					a = this.getRanges().createBookmarks(a);
					if (this.isFake) {
						a.isFake = 1;
					}
					return a;
				},
				createBookmarks2: function(a) {
					a = this.getRanges().createBookmarks2(a);
					if (this.isFake) {
						a.isFake = 1;
					}
					return a;
				},
				selectBookmarks: function(a) {
					var b = [];
					var c = 0;
					for (; c < a.length; c++) {
						var d = new CKEDITOR.dom.range(this.root);
						d.moveToBookmark(a[c]);
						b.push(d);
					}
					if (a.isFake) {
						this.fake(b[0].getEnclosedNode());
					} else {
						this.selectRanges(b);
					}
					return this;
				},
				getCommonAncestor: function() {
					var a = this.getRanges();
					return !a.length ? null : a[0].startContainer.getCommonAncestor(a[a.length - 1].endContainer);
				},
				scrollIntoView: function() {
					if (this.type != CKEDITOR.SELECTION_NONE) {
						this.getRanges()[0].scrollIntoView();
					}
				},
				removeAllRanges: function() {
					if (this.getType() != CKEDITOR.SELECTION_NONE) {
						var a = this.getNative();
						try {
							if (a) {
								a[m ? "empty" : "removeAllRanges"]();
							}
						} catch (b) {}
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
			function a$$1(a, b) {
				var c;
				var d;
				for (; a = a.getParent();) {
					if (a.equals(b)) {
						break;
					}
					if (a.getAttribute("data-nostyle")) {
						c = a;
					} else {
						if (!d) {
							var f = a.getAttribute("contentEditable");
							if (f == "false") {
								c = a;
							} else {
								if (f == "true") {
									d = 1;
								}
							}
						}
					}
				}
				return c;
			}

			function e$$1(b) {
				var c = b.document;
				if (b.collapsed) {
					c = s(this, c);
					b.insertNode(c);
					b.moveToPosition(c, CKEDITOR.POSITION_BEFORE_END);
				} else {
					var f = this.element;
					var g = this._.definition;
					var h;
					var i = g.ignoreReadonly;
					var j = i || g.includeReadonly;
					if (j == void 0) {
						j = b.root.getCustomData("cke_includeReadonly");
					}
					var k = CKEDITOR.dtd[f];
					if (!k) {
						h = true;
						k = CKEDITOR.dtd.span;
					}
					b.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
					b.trim();
					var n = b.createBookmark();
					var l = n.startNode;
					var o = n.endNode;
					var m = l;
					var p;
					if (!i) {
						var A = b.getCommonAncestor();
						i = a$$1(l, A);
						A = a$$1(o, A);
						if (i) {
							m = i.getNextSourceNode(true);
						}
						if (A) {
							o = A;
						}
					}
					if (m.getPosition(o) == CKEDITOR.POSITION_FOLLOWING) {
						m = 0;
					}
					for (; m;) {
						i = false;
						if (m.equals(o)) {
							m = null;
							i = true;
						} else {
							var t = m.type == CKEDITOR.NODE_ELEMENT ? m.getName() : null;
							A = t && m.getAttribute("contentEditable") == "false";
							var q = t && m.getAttribute("data-nostyle");
							if (t && m.data("cke-bookmark")) {
								m = m.getNextSourceNode(true);
								continue;
							}
							if (A && (j && CKEDITOR.dtd.$block[t])) {
								var x = m;
								var w = d$$0(x);
								var u = void 0;
								var z = w.length;
								var v = 0;
								x = z && new CKEDITOR.dom.range(x.getDocument());
								for (; v < z; ++v) {
									u = w[v];
									var B = CKEDITOR.filter.instances[u.data("cke-filter")];
									if (B ? B.check(this) : 1) {
										x.selectNodeContents(u);
										e$$1.call(this, x);
									}
								}
							}
							w = t ? !k[t] || q ? 0 : A && !j ? 0 : (m.getPosition(o) | I) == I && (!g.childRule || g.childRule(m)) : 1;
							if (w) {
								if ((w = m.getParent()) && (((w.getDtd() || CKEDITOR.dtd.span)[f] || h) && (!g.parentRule || g.parentRule(w)))) {
									if (!p && (!t || (!CKEDITOR.dtd.$removeEmpty[t] || (m.getPosition(o) | I) == I))) {
										p = b.clone();
										p.setStartBefore(m);
									}
									t = m.type;
									if (t == CKEDITOR.NODE_TEXT || (A || t == CKEDITOR.NODE_ELEMENT && !m.getChildCount())) {
										t = m;
										var Y;
										for (;
											(i = !t.getNext(D)) && ((Y = t.getParent(), k[Y.getName()]) && ((Y.getPosition(l) | K) == K && (!g.childRule || g.childRule(Y))));) {
											t = Y;
										}
										p.setEndAfter(t);
									}
								} else {
									i = true;
								}
							} else {
								i = true;
							}
							m = m.getNextSourceNode(q || A);
						}
						if (i && (p && !p.collapsed)) {
							i = s(this, c);
							A = i.hasAttributes();
							q = p.getCommonAncestor();
							t = {};
							w = {};
							u = {};
							z = {};
							var V;
							var R;
							var $;
							for (; i && q;) {
								if (q.getName() == f) {
									for (V in g.attributes) {
										if (!z[V] && ($ = q.getAttribute(R))) {
											if (i.getAttribute(V) == $) {
												w[V] = 1;
											} else {
												z[V] = 1;
											}
										}
									}
									for (R in g.styles) {
										if (!u[R] && ($ = q.getStyle(R))) {
											if (i.getStyle(R) == $) {
												t[R] = 1;
											} else {
												u[R] = 1;
											}
										}
									}
								}
								q = q.getParent();
							}
							for (V in w) {
								i.removeAttribute(V);
							}
							for (R in t) {
								i.removeStyle(R);
							}
							if (A) {
								if (!i.hasAttributes()) {
									i = null;
								}
							}
							if (i) {
								p.extractContents().appendTo(i);
								p.insertNode(i);
								r.call(this, i);
								i.mergeSiblings();
								if (!CKEDITOR.env.ie) {
									i.$.normalize();
								}
							} else {
								i = new CKEDITOR.dom.element("span");
								p.extractContents().appendTo(i);
								p.insertNode(i);
								r.call(this, i);
								i.remove(true);
							}
							p = null;
						}
					}
					b.moveToBookmark(n);
					b.shrink(CKEDITOR.SHRINK_TEXT);
					b.shrink(CKEDITOR.NODE_ELEMENT, true);
				}
			}

			function b$$1(a$$0) {
				function b() {
					var a = new CKEDITOR.dom.elementPath(d.getParent());
					var c = new CKEDITOR.dom.elementPath(j.getParent());
					var f = null;
					var e = null;
					var g = 0;
					for (; g < a.elements.length; g++) {
						var h = a.elements[g];
						if (h == a.block || h == a.blockLimit) {
							break;
						}
						if (k.checkElementRemovable(h)) {
							f = h;
						}
					}
					g = 0;
					for (; g < c.elements.length; g++) {
						h = c.elements[g];
						if (h == c.block || h == c.blockLimit) {
							break;
						}
						if (k.checkElementRemovable(h)) {
							e = h;
						}
					}
					if (e) {
						j.breakParent(e);
					}
					if (f) {
						d.breakParent(f);
					}
				}
				a$$0.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
				var c$$0 = a$$0.createBookmark();
				var d = c$$0.startNode;
				if (a$$0.collapsed) {
					var f$$0 = new CKEDITOR.dom.elementPath(d.getParent(), a$$0.root);
					var e$$0;
					var g$$0 = 0;
					var h$$0;
					for (; g$$0 < f$$0.elements.length && (h$$0 = f$$0.elements[g$$0]); g$$0++) {
						if (h$$0 == f$$0.block || h$$0 == f$$0.blockLimit) {
							break;
						}
						if (this.checkElementRemovable(h$$0)) {
							var i;
							if (a$$0.collapsed && (a$$0.checkBoundaryOfElement(h$$0, CKEDITOR.END) || (i = a$$0.checkBoundaryOfElement(h$$0, CKEDITOR.START)))) {
								e$$0 = h$$0;
								e$$0.match = i ? "start" : "end";
							} else {
								h$$0.mergeSiblings();
								if (h$$0.is(this.element)) {
									o$$0.call(this, h$$0);
								} else {
									l$$0(h$$0, x$$0(this)[h$$0.getName()]);
								}
							}
						}
					}
					if (e$$0) {
						h$$0 = d;
						g$$0 = 0;
						for (;; g$$0++) {
							i = f$$0.elements[g$$0];
							if (i.equals(e$$0)) {
								break;
							} else {
								if (i.match) {
									continue;
								} else {
									i = i.clone();
								}
							}
							i.append(h$$0);
							h$$0 = i;
						}
						h$$0[e$$0.match == "start" ? "insertBefore" : "insertAfter"](e$$0);
					}
				} else {
					var j = c$$0.endNode;
					var k = this;
					b();
					f$$0 = d;
					for (; !f$$0.equals(j);) {
						e$$0 = f$$0.getNextSourceNode();
						if (f$$0.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable(f$$0)) {
							if (f$$0.getName() == this.element) {
								o$$0.call(this, f$$0);
							} else {
								l$$0(f$$0, x$$0(this)[f$$0.getName()]);
							}
							if (e$$0.type == CKEDITOR.NODE_ELEMENT && e$$0.contains(d)) {
								b();
								e$$0 = d.getNext();
							}
						}
						f$$0 = e$$0;
					}
				}
				a$$0.moveToBookmark(c$$0);
				a$$0.shrink(CKEDITOR.NODE_ELEMENT, true);
			}

			function d$$0(a$$0) {
				var b = [];
				a$$0.forEach(function(a) {
					if (a.getAttribute("contenteditable") == "true") {
						b.push(a);
						return false;
					}
				}, CKEDITOR.NODE_ELEMENT, true);
				return b;
			}

			function f$$1(a) {
				var b = a.getEnclosedNode() || a.getCommonAncestor(false, true);
				if (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) {
					if (!a.isReadOnly()) {
						t$$0(a, this);
					}
				}
			}

			function c$$1(a) {
				var b = a.getCommonAncestor(true, true);
				if (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) {
					b = this._.definition;
					var c = b.attributes;
					if (c) {
						var d;
						for (d in c) {
							a.removeAttribute(d, c[d]);
						}
					}
					if (b.styles) {
						var f;
						for (f in b.styles) {
							if (b.styles.hasOwnProperty(f)) {
								a.removeStyle(f);
							}
						}
					}
				}
			}

			function h$$1(a) {
				var b = a.createBookmark(true);
				var c = a.createIterator();
				c.enforceRealBlocks = true;
				if (this._.enterMode) {
					c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
				}
				var d;
				var f = a.document;
				var e;
				for (; d = c.getNextParagraph();) {
					if (!d.isReadOnly() && (c.activeFilter ? c.activeFilter.check(this) : 1)) {
						e = s(this, f, d);
						g$$1(d, e);
					}
				}
				a.moveToBookmark(b);
			}

			function j$$0(a) {
				var b = a.createBookmark(1);
				var c = a.createIterator();
				c.enforceRealBlocks = true;
				c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
				var d;
				var f;
				for (; d = c.getNextParagraph();) {
					if (this.checkElementRemovable(d)) {
						if (d.is("pre")) {
							if (f = this._.enterMode == CKEDITOR.ENTER_BR ? null : a.document.createElement(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div")) {
								d.copyAttributes(f);
							}
							g$$1(d, f);
						} else {
							o$$0.call(this, d);
						}
					}
				}
				a.moveToBookmark(b);
			}

			function g$$1(a, b) {
				var c = !b;
				if (c) {
					b = a.getDocument().createElement("div");
					a.copyAttributes(b);
				}
				var d = b && b.is("pre");
				var f = a.is("pre");
				var e = !d && f;
				if (d && !f) {
					f = b;
					if (e = a.getBogus()) {
						e.remove();
					}
					e = a.getHtml();
					e = k$$0(e, /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, "");
					e = e.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, "$1");
					e = e.replace(/([ \t\n\r]+|&nbsp;)/g, " ");
					e = e.replace(/<br\b[^>]*>/gi, "\n");
					if (CKEDITOR.env.ie) {
						var g = a.getDocument().createElement("div");
						g.append(f);
						f.$.outerHTML = "<pre>" + e + "</pre>";
						f.copyAttributes(g.getFirst());
						f = g.getFirst().remove();
					} else {
						f.setHtml(e);
					}
					b = f;
				} else {
					if (e) {
						b = n$$0(c ? [a.getHtml()] : i$$0(a), b);
					} else {
						a.moveChildren(b);
					}
				}
				b.replace(a);
				if (d) {
					c = b;
					var h;
					if ((h = c.getPrevious(A$$0)) && (h.type == CKEDITOR.NODE_ELEMENT && h.is("pre"))) {
						d = k$$0(h.getHtml(), /\n$/, "") + "\n\n" + k$$0(c.getHtml(), /^\n/, "");
						if (CKEDITOR.env.ie) {
							c.$.outerHTML = "<pre>" + d + "</pre>";
						} else {
							c.setHtml(d);
						}
						h.remove();
					}
				} else {
					if (c) {
						m$$0(b);
					}
				}
			}

			function i$$0(a$$0) {
				a$$0.getName();
				var b$$0 = [];
				k$$0(a$$0.getOuterHtml(), /(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi, function(a, b, c) {
					return b + "</pre>" + c + "<pre>";
				}).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi, function(a, c) {
					b$$0.push(c);
				});
				return b$$0;
			}

			function k$$0(a$$0, b$$0, c$$0) {
				var d = "";
				var f = "";
				a$$0 = a$$0.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi, function(a, b, c) {
					if (b) {
						d = b;
					}
					if (c) {
						f = c;
					}
					return "";
				});
				return d + a$$0.replace(b$$0, c$$0) + f;
			}

			function n$$0(a$$0, b$$0) {
				var c;
				if (a$$0.length > 1) {
					c = new CKEDITOR.dom.documentFragment(b$$0.getDocument());
				}
				var d = 0;
				for (; d < a$$0.length; d++) {
					var f = a$$0[d];
					f = f.replace(/(\r\n|\r)/g, "\n");
					f = k$$0(f, /^[ \t]*\n/, "");
					f = k$$0(f, /\n$/, "");
					f = k$$0(f, /^[ \t]+|[ \t]+$/g, function(a, b) {
						return a.length == 1 ? "&nbsp;" : b ? " " + CKEDITOR.tools.repeat("&nbsp;", a.length - 1) : CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " ";
					});
					f = f.replace(/\n/g, "<br>");
					f = f.replace(/[ \t]{2,}/g, function(a) {
						return CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " ";
					});
					if (c) {
						var e = b$$0.clone();
						e.setHtml(f);
						c.append(e);
					} else {
						b$$0.setHtml(f);
					}
				}
				return c || b$$0;
			}

			function o$$0(a, b) {
				var c = this._.definition;
				var d = c.attributes;
				c = c.styles;
				var f = x$$0(this)[a.getName()];
				var e = CKEDITOR.tools.isEmpty(d) && CKEDITOR.tools.isEmpty(c);
				var g;
				for (g in d) {
					if (!((g == "class" || this._.definition.fullMatch) && a.getAttribute(g) != q$$0(g, d[g])) && !(b && g.slice(0, 5) == "data-")) {
						e = a.hasAttribute(g);
						a.removeAttribute(g);
					}
				}
				var h;
				for (h in c) {
					if (!(this._.definition.fullMatch && a.getStyle(h) != q$$0(h, c[h], true))) {
						e = e || !!a.getStyle(h);
						a.removeStyle(h);
					}
				}
				l$$0(a, f, B$$0[a.getName()]);
				if (e) {
					if (this._.definition.alwaysRemoveElement) {
						m$$0(a, 1);
					} else {
						if (!CKEDITOR.dtd.$block[a.getName()] || this._.enterMode == CKEDITOR.ENTER_BR && !a.hasAttributes()) {
							m$$0(a);
						} else {
							a.renameNode(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div");
						}
					}
				}
			}

			function r(a) {
				var b = x$$0(this);
				var c = a.getElementsByTag(this.element);
				var d;
				var f = c.count();
				for (; --f >= 0;) {
					d = c.getItem(f);
					if (!d.isReadOnly()) {
						o$$0.call(this, d, true);
					}
				}
				var e;
				for (e in b) {
					if (e != this.element) {
						c = a.getElementsByTag(e);
						f = c.count() - 1;
						for (; f >= 0; f--) {
							d = c.getItem(f);
							if (!d.isReadOnly()) {
								l$$0(d, b[e]);
							}
						}
					}
				}
			}

			function l$$0(a, b, c) {
				if (b = b && b.attributes) {
					var d = 0;
					for (; d < b.length; d++) {
						var f = b[d][0];
						var e;
						if (e = a.getAttribute(f)) {
							var g = b[d][1];
							if (g === null || (g.test && g.test(e) || typeof g == "string" && e == g)) {
								a.removeAttribute(f);
							}
						}
					}
				}
				if (!c) {
					m$$0(a);
				}
			}

			function m$$0(a, b) {
				if (!a.hasAttributes() || b) {
					if (CKEDITOR.dtd.$block[a.getName()]) {
						var c = a.getPrevious(A$$0);
						var d = a.getNext(A$$0);
						if (c) {
							if (c.type == CKEDITOR.NODE_TEXT || !c.isBlockBoundary({
								br: 1
							})) {
								a.append("br", 1);
							}
						}
						if (d) {
							if (d.type == CKEDITOR.NODE_TEXT || !d.isBlockBoundary({
								br: 1
							})) {
								a.append("br");
							}
						}
						a.remove(true);
					} else {
						c = a.getFirst();
						d = a.getLast();
						a.remove(true);
						if (c) {
							if (c.type == CKEDITOR.NODE_ELEMENT) {
								c.mergeSiblings();
							}
							if (d) {
								if (!c.equals(d) && d.type == CKEDITOR.NODE_ELEMENT) {
									d.mergeSiblings();
								}
							}
						}
					}
				}
			}

			function s(a, b, c) {
				var d;
				d = a.element;
				if (d == "*") {
					d = "span";
				}
				d = new CKEDITOR.dom.element(d, b);
				if (c) {
					c.copyAttributes(d);
				}
				d = t$$0(d, a);
				if (b.getCustomData("doc_processing_style") && d.hasAttribute("id")) {
					d.removeAttribute("id");
				} else {
					b.setCustomData("doc_processing_style", 1);
				}
				return d;
			}

			function t$$0(a, b) {
				var c = b._.definition;
				var d = c.attributes;
				c = CKEDITOR.style.getStyleText(c);
				if (d) {
					var f;
					for (f in d) {
						a.setAttribute(f, d[f]);
					}
				}
				if (c) {
					a.setAttribute("style", c);
				}
				return a;
			}

			function p$$0(a$$0, b) {
				var c$$0;
				for (c$$0 in a$$0) {
					a$$0[c$$0] = a$$0[c$$0].replace(w$$0, function(a, c) {
						return b[c];
					});
				}
			}

			function x$$0(a) {
				if (a._.overrides) {
					return a._.overrides;
				}
				var b = a._.overrides = {};
				var c = a._.definition.overrides;
				if (c) {
					if (!CKEDITOR.tools.isArray(c)) {
						c = [c];
					}
					var d = 0;
					for (; d < c.length; d++) {
						var f = c[d];
						var e;
						var g;
						if (typeof f == "string") {
							e = f.toLowerCase();
						} else {
							e = f.element ? f.element.toLowerCase() : a.element;
							g = f.attributes;
						}
						f = b[e] || (b[e] = {});
						if (g) {
							f = f.attributes = f.attributes || [];
							var h;
							for (h in g) {
								f.push([h.toLowerCase(), g[h]]);
							}
						}
					}
				}
				return b;
			}

			function q$$0(a, b, c) {
				var d = new CKEDITOR.dom.element("span");
				d[c ? "setStyle" : "setAttribute"](a, b);
				return d[c ? "getStyle" : "getAttribute"](a);
			}

			function u$$0(a, b, c) {
				var d = a.document;
				var f = a.getRanges();
				b = b ? this.removeFromRange : this.applyToRange;
				var e;
				var g = f.createIterator();
				for (; e = g.getNextRange();) {
					b.call(this, e, c);
				}
				a.selectRanges(f);
				d.removeCustomData("doc_processing_style");
			}
			var B$$0 = {
				address: 1,
				div: 1,
				h1: 1,
				h2: 1,
				h3: 1,
				h4: 1,
				h5: 1,
				h6: 1,
				p: 1,
				pre: 1,
				section: 1,
				header: 1,
				footer: 1,
				nav: 1,
				article: 1,
				aside: 1,
				figure: 1,
				dialog: 1,
				hgroup: 1,
				time: 1,
				meter: 1,
				menu: 1,
				command: 1,
				keygen: 1,
				output: 1,
				progress: 1,
				details: 1,
				datagrid: 1,
				datalist: 1
			};
			var v$$0 = {
				a: 1,
				embed: 1,
				hr: 1,
				img: 1,
				li: 1,
				object: 1,
				ol: 1,
				table: 1,
				td: 1,
				tr: 1,
				th: 1,
				ul: 1,
				dl: 1,
				dt: 1,
				dd: 1,
				form: 1,
				audio: 1,
				video: 1
			};
			var z$$0 = /\s*(?:;\s*|$)/;
			var w$$0 = /#\((.+?)\)/g;
			var D = CKEDITOR.dom.walker.bookmark(0, 1);
			var A$$0 = CKEDITOR.dom.walker.whitespaces(1);
			CKEDITOR.style = function(a, b) {
				if (typeof a.type == "string") {
					return new CKEDITOR.style.customHandlers[a.type](a);
				}
				var c = a.attributes;
				if (c && c.style) {
					a.styles = CKEDITOR.tools.extend({}, a.styles, CKEDITOR.tools.parseCssText(c.style));
					delete c.style;
				}
				if (b) {
					a = CKEDITOR.tools.clone(a);
					p$$0(a.attributes, b);
					p$$0(a.styles, b);
				}
				c = this.element = a.element ? typeof a.element == "string" ? a.element.toLowerCase() : a.element : "*";
				this.type = a.type || (B$$0[c] ? CKEDITOR.STYLE_BLOCK : v$$0[c] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE);
				if (typeof this.element == "object") {
					this.type = CKEDITOR.STYLE_OBJECT;
				}
				this._ = {
					definition: a
				};
			};
			CKEDITOR.style.prototype = {
				apply: function(a) {
					if (a instanceof CKEDITOR.dom.document) {
						return u$$0.call(this, a.getSelection());
					}
					if (this.checkApplicable(a.elementPath(), a)) {
						var b = this._.enterMode;
						if (!b) {
							this._.enterMode = a.activeEnterMode;
						}
						u$$0.call(this, a.getSelection(), 0, a);
						this._.enterMode = b;
					}
				},
				remove: function(a) {
					if (a instanceof CKEDITOR.dom.document) {
						return u$$0.call(this, a.getSelection(), 1);
					}
					if (this.checkApplicable(a.elementPath(), a)) {
						var b = this._.enterMode;
						if (!b) {
							this._.enterMode = a.activeEnterMode;
						}
						u$$0.call(this, a.getSelection(), 1, a);
						this._.enterMode = b;
					}
				},
				applyToRange: function(a) {
					this.applyToRange = this.type == CKEDITOR.STYLE_INLINE ? e$$1 : this.type == CKEDITOR.STYLE_BLOCK ? h$$1 : this.type == CKEDITOR.STYLE_OBJECT ? f$$1 : null;
					return this.applyToRange(a);
				},
				removeFromRange: function(a) {
					this.removeFromRange = this.type == CKEDITOR.STYLE_INLINE ? b$$1 : this.type == CKEDITOR.STYLE_BLOCK ? j$$0 : this.type == CKEDITOR.STYLE_OBJECT ? c$$1 : null;
					return this.removeFromRange(a);
				},
				applyToObject: function(a) {
					t$$0(a, this);
				},
				checkActive: function(a, b) {
					switch (this.type) {
						case CKEDITOR.STYLE_BLOCK:
							return this.checkElementRemovable(a.block || a.blockLimit, true, b);
						case CKEDITOR.STYLE_OBJECT:
							;
						case CKEDITOR.STYLE_INLINE:
							var c = a.elements;
							var d = 0;
							var f;
							for (; d < c.length; d++) {
								f = c[d];
								if (!(this.type == CKEDITOR.STYLE_INLINE && (f == a.block || f == a.blockLimit))) {
									if (this.type == CKEDITOR.STYLE_OBJECT) {
										var e = f.getName();
										if (!(typeof this.element == "string" ? e == this.element : e in this.element)) {
											continue;
										}
									}
									if (this.checkElementRemovable(f, true, b)) {
										return true;
									}
								}
							};
					}
					return false;
				},
				checkApplicable: function(a, b, c) {
					if (b) {
						if (b instanceof CKEDITOR.filter) {
							c = b;
						}
					}
					if (c && !c.check(this)) {
						return false;
					}
					switch (this.type) {
						case CKEDITOR.STYLE_OBJECT:
							return !!a.contains(this.element);
						case CKEDITOR.STYLE_BLOCK:
							return !!a.blockLimit.getDtd()[this.element];
					}
					return true;
				},
				checkElementMatch: function(a, b) {
					var c = this._.definition;
					if (!a || !c.ignoreReadonly && a.isReadOnly()) {
						return false;
					}
					var d = a.getName();
					if (typeof this.element == "string" ? d == this.element : d in this.element) {
						if (!b && !a.hasAttributes()) {
							return true;
						}
						if (d = c._AC) {
							c = d;
						} else {
							d = {};
							var f = 0;
							var e = c.attributes;
							if (e) {
								var g;
								for (g in e) {
									f++;
									d[g] = e[g];
								}
							}
							if (g = CKEDITOR.style.getStyleText(c)) {
								if (!d.style) {
									f++;
								}
								d.style = g;
							}
							d._length = f;
							c = c._AC = d;
						}
						if (c._length) {
							var h;
							for (h in c) {
								if (h != "_length") {
									f = a.getAttribute(h) || "";
									if (h == "style") {
										a: {
											d = c[h];
											if (typeof d == "string") {
												d = CKEDITOR.tools.parseCssText(d);
											}
											if (typeof f == "string") {
												f = CKEDITOR.tools.parseCssText(f, true);
											}
											g = void 0;
											for (g in d) {
												if (!(g in f && (f[g] == d[g] || (d[g] == "inherit" || f[g] == "inherit")))) {
													d = false;
													break a;
												}
											}
											d = true;
										}
									} else {
										d = c[h] == f;
									}
									if (d) {
										if (!b) {
											return true;
										}
									} else {
										if (b) {
											return false;
										}
									}
								}
							}
							if (b) {
								return true;
							}
						} else {
							return true;
						}
					}
					return false;
				},
				checkElementRemovable: function(a, b, c) {
					if (this.checkElementMatch(a, b, c)) {
						return true;
					}
					if (b = x$$0(this)[a.getName()]) {
						var d;
						if (!(b = b.attributes)) {
							return true;
						}
						c = 0;
						for (; c < b.length; c++) {
							d = b[c][0];
							if (d = a.getAttribute(d)) {
								var f = b[c][1];
								if (f === null || (typeof f == "string" && d == f || f.test(d))) {
									return true;
								}
							}
						}
					}
					return false;
				},
				buildPreview: function(a) {
					var b = this._.definition;
					var c = [];
					var d = b.element;
					if (d == "bdo") {
						d = "span";
					}
					c = ["<", d];
					var f = b.attributes;
					if (f) {
						var e;
						for (e in f) {
							c.push(" ", e, '="', f[e], '"');
						}
					}
					if (f = CKEDITOR.style.getStyleText(b)) {
						c.push(' style="', f, '"');
					}
					c.push(">", a || b.name, "</", d, ">");
					return c.join("");
				},
				getDefinition: function() {
					return this._.definition;
				}
			};
			CKEDITOR.style.getStyleText = function(a) {
				var b = a._ST;
				if (b) {
					return b;
				}
				b = a.styles;
				var c = a.attributes && a.attributes.style || "";
				var d = "";
				if (c.length) {
					c = c.replace(z$$0, ";");
				}
				var f;
				for (f in b) {
					var e = b[f];
					var g = (f + ":" + e).replace(z$$0, ";");
					if (e == "inherit") {
						d = d + g;
					} else {
						c = c + g;
					}
				}
				if (c.length) {
					c = CKEDITOR.tools.normalizeCssText(c, true);
				}
				return a._ST = c + d;
			};
			CKEDITOR.style.customHandlers = {};
			CKEDITOR.style.addCustomHandler = function(a$$0) {
				var b = function(a) {
					this._ = {
						definition: a
					};
					if (this.setup) {
						this.setup(a);
					}
				};
				b.prototype = CKEDITOR.tools.extend(CKEDITOR.tools.prototypedCopy(CKEDITOR.style.prototype), {
					assignedTo: CKEDITOR.STYLE_OBJECT
				}, a$$0, true);
				return this.customHandlers[a$$0.type] = b;
			};
			var I = CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED;
			var K = CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED;
		})();
		CKEDITOR.styleCommand = function(a, e) {
			this.requiredContent = this.allowedContent = this.style = a;
			CKEDITOR.tools.extend(this, e, true);
		};
		CKEDITOR.styleCommand.prototype.exec = function(a) {
			a.focus();
			if (this.state == CKEDITOR.TRISTATE_OFF) {
				a.applyStyle(this.style);
			} else {
				if (this.state == CKEDITOR.TRISTATE_ON) {
					a.removeStyle(this.style);
				}
			}
		};
		CKEDITOR.stylesSet = new CKEDITOR.resourceManager("", "stylesSet");
		CKEDITOR.addStylesSet = CKEDITOR.tools.bind(CKEDITOR.stylesSet.add, CKEDITOR.stylesSet);
		CKEDITOR.loadStylesSet = function(a, e, b) {
			CKEDITOR.stylesSet.addExternal(a, e, "");
			CKEDITOR.stylesSet.load(a, b);
		};
		CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
			attachStyleStateChange: function(a$$0, e$$0) {
				var b = this._.styleStateChangeCallbacks;
				if (!b) {
					b = this._.styleStateChangeCallbacks = [];
					this.on("selectionChange", function(a) {
						var f = 0;
						for (; f < b.length; f++) {
							var c = b[f];
							var e = c.style.checkActive(a.data.path, this) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
							c.fn.call(this, e);
						}
					});
				}
				b.push({
					style: a$$0,
					fn: e$$0
				});
			},
			applyStyle: function(a) {
				a.apply(this);
			},
			removeStyle: function(a) {
				a.remove(this);
			},
			getStylesSet: function(a) {
				if (this._.stylesDefinitions) {
					a(this._.stylesDefinitions);
				} else {
					var e = this;
					var b$$0 = e.config.stylesCombo_stylesSet || e.config.stylesSet;
					if (b$$0 === false) {
						a(null);
					} else {
						if (b$$0 instanceof Array) {
							e._.stylesDefinitions = b$$0;
							a(b$$0);
						} else {
							if (!b$$0) {
								b$$0 = "default";
							}
							b$$0 = b$$0.split(":");
							var d = b$$0[0];
							CKEDITOR.stylesSet.addExternal(d, b$$0[1] ? b$$0.slice(1).join(":") : CKEDITOR.getUrl("styles.js"), "");
							CKEDITOR.stylesSet.load(d, function(b) {
								e._.stylesDefinitions = b[d];
								a(e._.stylesDefinitions);
							});
						}
					}
				}
			}
		});
		CKEDITOR.dom.comment = function(a, e) {
			if (typeof a == "string") {
				a = (e ? e.$ : document).createComment(a);
			}
			CKEDITOR.dom.domObject.call(this, a);
		};
		CKEDITOR.dom.comment.prototype = new CKEDITOR.dom.node;
		CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype, {
			type: CKEDITOR.NODE_COMMENT,
			getOuterHtml: function() {
				return "\x3c!--" + this.$.nodeValue + "--\x3e";
			}
		});
		"use strict";
		(function() {
			var a = {};
			var e = {};
			var b$$0;
			for (b$$0 in CKEDITOR.dtd.$blockLimit) {
				if (!(b$$0 in CKEDITOR.dtd.$list)) {
					a[b$$0] = 1;
				}
			}
			for (b$$0 in CKEDITOR.dtd.$block) {
				if (!(b$$0 in CKEDITOR.dtd.$blockLimit)) {
					if (!(b$$0 in CKEDITOR.dtd.$empty)) {
						e[b$$0] = 1;
					}
				}
			}
			CKEDITOR.dom.elementPath = function(b, f) {
				var c = null;
				var h = null;
				var j = [];
				var g = b;
				var i;
				f = f || b.getDocument().getBody();
				do {
					if (g.type == CKEDITOR.NODE_ELEMENT) {
						j.push(g);
						if (!this.lastElement) {
							this.lastElement = g;
							if (g.is(CKEDITOR.dtd.$object) || g.getAttribute("contenteditable") == "false") {
								continue;
							}
						}
						if (g.equals(f)) {
							break;
						}
						if (!h) {
							i = g.getName();
							if (g.getAttribute("contenteditable") == "true") {
								h = g;
							} else {
								if (!c) {
									if (e[i]) {
										c = g;
									}
								}
							}
							if (a[i]) {
								var k;
								if (k = !c) {
									if (i = i == "div") {
										a: {
											i = g.getChildren();
											k = 0;
											var n = i.count();
											for (; k < n; k++) {
												var o = i.getItem(k);
												if (o.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$block[o.getName()]) {
													i = true;
													break a;
												}
											}
											i = false;
										}
										i = !i;
									}
									k = i;
								}
								if (k) {
									c = g;
								} else {
									h = g;
								}
							}
						}
					}
				} while (g = g.getParent());
				if (!h) {
					h = f;
				}
				this.block = c;
				this.blockLimit = h;
				this.root = f;
				this.elements = j;
			};
		})();
		CKEDITOR.dom.elementPath.prototype = {
			compare: function(a) {
				var e = this.elements;
				a = a && a.elements;
				if (!a || e.length != a.length) {
					return false;
				}
				var b = 0;
				for (; b < e.length; b++) {
					if (!e[b].equals(a[b])) {
						return false;
					}
				}
				return true;
			},
			contains: function(a, e, b$$0) {
				var d;
				if (typeof a == "string") {
					d = function(b) {
						return b.getName() == a;
					};
				}
				if (a instanceof CKEDITOR.dom.element) {
					d = function(b) {
						return b.equals(a);
					};
				} else {
					if (CKEDITOR.tools.isArray(a)) {
						d = function(b) {
							return CKEDITOR.tools.indexOf(a, b.getName()) > -1;
						};
					} else {
						if (typeof a == "function") {
							d = a;
						} else {
							if (typeof a == "object") {
								d = function(b) {
									return b.getName() in a;
								};
							}
						}
					}
				}
				var f = this.elements;
				var c = f.length;
				if (e) {
					c--;
				}
				if (b$$0) {
					f = Array.prototype.slice.call(f, 0);
					f.reverse();
				}
				e = 0;
				for (; e < c; e++) {
					if (d(f[e])) {
						return f[e];
					}
				}
				return null;
			},
			isContextFor: function(a) {
				var e;
				if (a in CKEDITOR.dtd.$block) {
					e = this.contains(CKEDITOR.dtd.$intermediate) || (this.root.equals(this.block) && this.block || this.blockLimit);
					return !!e.getDtd()[a];
				}
				return true;
			},
			direction: function() {
				return (this.block || (this.blockLimit || this.root)).getDirection(1);
			}
		};
		CKEDITOR.dom.text = function(a, e) {
			if (typeof a == "string") {
				a = (e ? e.$ : document).createTextNode(a);
			}
			this.$ = a;
		};
		CKEDITOR.dom.text.prototype = new CKEDITOR.dom.node;
		CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype, {
			type: CKEDITOR.NODE_TEXT,
			getLength: function() {
				return this.$.nodeValue.length;
			},
			getText: function() {
				return this.$.nodeValue;
			},
			setText: function(a) {
				this.$.nodeValue = a;
			},
			split: function(a) {
				var e = this.$.parentNode;
				var b = e.childNodes.length;
				var d = this.getLength();
				var f = this.getDocument();
				var c = new CKEDITOR.dom.text(this.$.splitText(a), f);
				if (e.childNodes.length == b) {
					if (a >= d) {
						c = f.createText("");
						c.insertAfter(this);
					} else {
						a = f.createText("");
						a.insertAfter(c);
						a.remove();
					}
				}
				return c;
			},
			substring: function(a, e) {
				return typeof e != "number" ? this.$.nodeValue.substr(a) : this.$.nodeValue.substring(a, e);
			}
		});
		(function() {
			function a$$0(a, d, f) {
				var c = a.serializable;
				var e = d[f ? "endContainer" : "startContainer"];
				var j = f ? "endOffset" : "startOffset";
				var g = c ? d.document.getById(a.startNode) : a.startNode;
				a = c ? d.document.getById(a.endNode) : a.endNode;
				if (e.equals(g.getPrevious())) {
					d.startOffset = d.startOffset - e.getLength() - a.getPrevious().getLength();
					e = a.getNext();
				} else {
					if (e.equals(a.getPrevious())) {
						d.startOffset = d.startOffset - e.getLength();
						e = a.getNext();
					}
				}
				if (e.equals(g.getParent())) {
					d[j] ++;
				}
				if (e.equals(a.getParent())) {
					d[j] ++;
				}
				d[f ? "endContainer" : "startContainer"] = e;
				return d;
			}
			CKEDITOR.dom.rangeList = function(a) {
				if (a instanceof CKEDITOR.dom.rangeList) {
					return a;
				}
				if (a) {
					if (a instanceof CKEDITOR.dom.range) {
						a = [a];
					}
				} else {
					a = [];
				}
				return CKEDITOR.tools.extend(a, e$$0);
			};
			var e$$0 = {
				createIterator: function() {
					var a = this;
					var d = CKEDITOR.dom.walker.bookmark();
					var f = [];
					var c;
					return {
						getNextRange: function(e) {
							c = c == void 0 ? 0 : c + 1;
							var j = a[c];
							if (j && a.length > 1) {
								if (!c) {
									var g = a.length - 1;
									for (; g >= 0; g--) {
										f.unshift(a[g].createBookmark(true));
									}
								}
								if (e) {
									var i = 0;
									for (; a[c + i + 1];) {
										var k = j.document;
										e = 0;
										g = k.getById(f[i].endNode);
										k = k.getById(f[i + 1].startNode);
										for (;;) {
											g = g.getNextSourceNode(false);
											if (k.equals(g)) {
												e = 1;
											} else {
												if (d(g) || g.type == CKEDITOR.NODE_ELEMENT && g.isBlockBoundary()) {
													continue;
												}
											}
											break;
										}
										if (!e) {
											break;
										}
										i++;
									}
								}
								j.moveToBookmark(f.shift());
								for (; i--;) {
									g = a[++c];
									g.moveToBookmark(f.shift());
									j.setEnd(g.endContainer, g.endOffset);
								}
							}
							return j;
						}
					};
				},
				createBookmarks: function(b) {
					var d = [];
					var f;
					var c = 0;
					for (; c < this.length; c++) {
						d.push(f = this[c].createBookmark(b, true));
						var e = c + 1;
						for (; e < this.length; e++) {
							this[e] = a$$0(f, this[e]);
							this[e] = a$$0(f, this[e], true);
						}
					}
					return d;
				},
				createBookmarks2: function(a) {
					var d = [];
					var f = 0;
					for (; f < this.length; f++) {
						d.push(this[f].createBookmark2(a));
					}
					return d;
				},
				moveToBookmarks: function(a) {
					var d = 0;
					for (; d < this.length; d++) {
						this[d].moveToBookmark(a[d]);
					}
				}
			};
		})();
		(function() {
			function a$$1() {
				return CKEDITOR.getUrl(CKEDITOR.skinName.split(",")[1] || "skins/" + CKEDITOR.skinName.split(",")[0] + "/");
			}

			function e$$0(b$$0) {
				var c = CKEDITOR.skin["ua_" + b$$0];
				var d = CKEDITOR.env;
				if (c) {
					c = c.split(",").sort(function(a, b) {
						return a > b ? -1 : 1;
					});
					var f = 0;
					var e;
					for (; f < c.length; f++) {
						e = c[f];
						if (d.ie && (e.replace(/^ie/, "") == d.version || d.quirks && e == "iequirks")) {
							e = "ie";
						}
						if (d[e]) {
							b$$0 = b$$0 + ("_" + c[f]);
							break;
						}
					}
				}
				return CKEDITOR.getUrl(a$$1() + b$$0 + ".css");
			}

			function b$$1(a, b) {
				if (!c$$0[a]) {
					CKEDITOR.document.appendStyleSheet(e$$0(a));
					c$$0[a] = 1;
				}
				if (b) {
					b();
				}
			}

			function d$$0(a) {
				var b = a.getById(h);
				if (!b) {
					b = a.getHead().append("style");
					b.setAttribute("id", h);
					b.setAttribute("type", "text/css");
				}
				return b;
			}

			function f$$0(a, b, c) {
				var d;
				var f;
				var e;
				if (CKEDITOR.env.webkit) {
					b = b.split("}").slice(0, -1);
					f = 0;
					for (; f < b.length; f++) {
						b[f] = b[f].split("{");
					}
				}
				var g = 0;
				for (; g < a.length; g++) {
					if (CKEDITOR.env.webkit) {
						f = 0;
						for (; f < b.length; f++) {
							e = b[f][1];
							d = 0;
							for (; d < c.length; d++) {
								e = e.replace(c[d][0], c[d][1]);
							}
							a[g].$.sheet.addRule(b[f][0], e);
						}
					} else {
						e = b;
						d = 0;
						for (; d < c.length; d++) {
							e = e.replace(c[d][0], c[d][1]);
						}
						if (CKEDITOR.env.ie && CKEDITOR.env.version < 11) {
							a[g].$.styleSheet.cssText = a[g].$.styleSheet.cssText + e;
						} else {
							a[g].$.innerHTML = a[g].$.innerHTML + e;
						}
					}
				}
			}
			var c$$0 = {};
			CKEDITOR.skin = {
				path: a$$1,
				loadPart: function(c, d) {
					if (CKEDITOR.skin.name != CKEDITOR.skinName.split(",")[0]) {
						CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(a$$1() + "skin.js"), function() {
							b$$1(c, d);
						});
					} else {
						b$$1(c, d);
					}
				},
				getPath: function(a) {
					return CKEDITOR.getUrl(e$$0(a));
				},
				icons: {},
				addIcon: function(a, b, c, d) {
					a = a.toLowerCase();
					if (!this.icons[a]) {
						this.icons[a] = {
							path: b,
							offset: c || 0,
							bgsize: d || "16px"
						};
					}
				},
				getIconStyle: function(a, b, c, d, f) {
					var e;
					if (a) {
						a = a.toLowerCase();
						if (b) {
							e = this.icons[a + "-rtl"];
						}
						if (!e) {
							e = this.icons[a];
						}
					}
					a = c || (e && e.path || "");
					d = d || e && e.offset;
					f = f || (e && e.bgsize || "16px");
					return a && "background-image:url(" + CKEDITOR.getUrl(a) + ");background-position:0 " + d + "px;background-size:" + f + ";";
				}
			};
			CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
				getUiColor: function() {
					return this.uiColor;
				},
				setUiColor: function(a$$0) {
					var b = d$$0(CKEDITOR.document);
					return (this.setUiColor = function(a) {
						var c = CKEDITOR.skin.chameleon;
						var d = [
							[g$$0, a]
						];
						this.uiColor = a;
						f$$0([b], c(this, "editor"), d);
						f$$0(j, c(this, "panel"), d);
					}).call(this, a$$0);
				}
			});
			var h = "cke_ui_color";
			var j = [];
			var g$$0 = /\$color/g;
			CKEDITOR.on("instanceLoaded", function(a$$0) {
				if (!CKEDITOR.env.ie || !CKEDITOR.env.quirks) {
					var b = a$$0.editor;
					a$$0 = function(a) {
						a = (a.data[0] || a.data).element.getElementsByTag("iframe").getItem(0).getFrameDocument();
						if (!a.getById("cke_ui_color")) {
							a = d$$0(a);
							j.push(a);
							var c = b.getUiColor();
							if (c) {
								f$$0([a], CKEDITOR.skin.chameleon(b, "panel"), [
									[g$$0, c]
								]);
							}
						}
					};
					b.on("panelShow", a$$0);
					b.on("menuShow", a$$0);
					if (b.config.uiColor) {
						b.setUiColor(b.config.uiColor);
					}
				}
			});
		})();
		(function() {
			if (CKEDITOR.env.webkit) {
				CKEDITOR.env.hc = false;
			} else {
				var a = CKEDITOR.dom.element.createFromHtml('<div style="width:0;height:0;position:absolute;left:-10000px;border:1px solid;border-color:red blue"></div>', CKEDITOR.document);
				a.appendTo(CKEDITOR.document.getHead());
				try {
					var e = a.getComputedStyle("border-top-color");
					var b = a.getComputedStyle("border-right-color");
					CKEDITOR.env.hc = !!(e && e == b);
				} catch (d) {
					CKEDITOR.env.hc = false;
				}
				a.remove();
			}
			if (CKEDITOR.env.hc) {
				CKEDITOR.env.cssClass = CKEDITOR.env.cssClass + " cke_hc";
			}
			CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}");
			CKEDITOR.status = "loaded";
			CKEDITOR.fireOnce("loaded");
			if (a = CKEDITOR._.pending) {
				delete CKEDITOR._.pending;
				e = 0;
				for (; e < a.length; e++) {
					CKEDITOR.editor.prototype.constructor.apply(a[e][0], a[e][1]);
					CKEDITOR.add(a[e][0]);
				}
			}
		})();
		CKEDITOR.skin.name = "alive";
		CKEDITOR.skin.ua_editor = "ie,iequirks,ie7,ie8,gecko";
		CKEDITOR.skin.ua_dialog = "ie,iequirks,ie7,ie8";
		CKEDITOR.skin.chameleon = function() {
			var a$$0 = function() {
				return function(a, b) {
					var c = a.match(/[^#]./g);
					var e = 0;
					for (; e < 3; e++) {
						var j = c;
						var g = e;
						var i;
						i = parseInt(c[e], 16);
						i = ("0" + (b < 0 ? 0 | i * (1 + b) : 0 | i + (255 - i) * b).toString(16)).slice(-2);
						j[g] = i;
					}
					return "#" + c.join("");
				};
			}();
			var e$$0 = function() {
				var a = new CKEDITOR.template("background:#{to};background-image:-webkit-gradient(linear,lefttop,leftbottom,from({from}),to({to}));background-image:-moz-linear-gradient(top,{from},{to});background-image:-webkit-linear-gradient(top,{from},{to});background-image:-o-linear-gradient(top,{from},{to});background-image:-ms-linear-gradient(top,{from},{to});background-image:linear-gradient(top,{from},{to});filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='{from}',endColorstr='{to}');");
				return function(b, c) {
					return a.output({
						from: b,
						to: c
					});
				};
			}();
			var b$$0 = {
				editor: new CKEDITOR.template("{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ {defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_bottom [{defaultGradient}border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [{defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [{defaultGradient}outline-color:{defaultBorder};border-top-color:{defaultBorder};] {id} .cke_dialog_tab [{lightGradient}border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [{mediumGradient}] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} .cke_toolgroup [{lightGradient}border-color:{defaultBorder};] {id} a.cke_button_off:hover, {id} a.cke_button_off:focus, {id} a.cke_button_off:active [{mediumGradient}] {id} .cke_button_on [{ckeButtonOn}] {id} .cke_toolbar_separator [background-color: {ckeToolbarSeparator};] {id} .cke_combo_button [border-color:{defaultBorder};{lightGradient}] {id} a.cke_combo_button:hover, {id} a.cke_combo_button:focus, {id} .cke_combo_on a.cke_combo_button [border-color:{defaultBorder};{mediumGradient}] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover, {id} a.cke_path_item:focus, {id} a.cke_path_item:active [background-color:{elementsPathBg};] {id}.cke_panel [border-color:{defaultBorder};] "),
				panel: new CKEDITOR.template(".cke_panel_grouptitle [{lightGradient}border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:focus.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:focus.cke_colorauto, a:focus.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] ")
			};
			return function(d, f) {
				var c = d.uiColor;
				c = {
					id: "." + d.id,
					defaultBorder: a$$0(c, -0.1),
					defaultGradient: e$$0(a$$0(c, 0.9), c),
					lightGradient: e$$0(a$$0(c, 1), a$$0(c, 0.7)),
					mediumGradient: e$$0(a$$0(c, 0.8), a$$0(c, 0.5)),
					ckeButtonOn: e$$0(a$$0(c, 0.6), a$$0(c, 0.7)),
					ckeResizer: a$$0(c, -0.4),
					ckeToolbarSeparator: a$$0(c, 0.5),
					ckeColorauto: a$$0(c, 0.8),
					dialogBody: a$$0(c, 0.7),
					dialogTabSelected: e$$0("#FFFFFF", "#FFFFFF"),
					dialogTabSelectedBorder: "#FFF",
					elementsPathColor: a$$0(c, -0.6),
					elementsPathBg: c,
					menubuttonIcon: a$$0(c, 0.5),
					menubuttonIconHover: a$$0(c, 0.3)
				};
				return b$$0[f].output(c).replace(/\[/g, "{").replace(/\]/g, "}");
			};
		}();
		CKEDITOR.plugins.add("basicstyles", {
			init: function(a$$0) {
				var e = 0;
				var b$$1 = function(b$$0, c, f, i) {
					if (i) {
						i = new CKEDITOR.style(i);
						var k = d[f];
						k.unshift(i);
						a$$0.attachStyleStateChange(i, function(b) {
							if (!a$$0.readOnly) {
								a$$0.getCommand(f).setState(b);
							}
						});
						a$$0.addCommand(f, new CKEDITOR.styleCommand(i, {
							contentForms: k
						}));
						if (a$$0.ui.addButton) {
							a$$0.ui.addButton(b$$0, {
								label: c,
								command: f,
								toolbar: "basicstyles," + (e = e + 10)
							});
						}
					}
				};
				var d = {
					bold: ["strong", "b", ["span",
						function(a) {
							a = a.styles["font-weight"];
							return a == "bold" || +a >= 700;
						}
					]],
					italic: ["em", "i", ["span",
						function(a) {
							return a.styles["font-style"] == "italic";
						}
					]],
					underline: ["u", ["span",
						function(a) {
							return a.styles["text-decoration"] == "underline";
						}
					]],
					strike: ["s", "strike", ["span",
						function(a) {
							return a.styles["text-decoration"] == "line-through";
						}
					]],
					subscript: ["sub"],
					superscript: ["sup"]
				};
				var f$$0 = a$$0.config;
				var c$$0 = a$$0.lang.basicstyles;
				b$$1("Bold", c$$0.bold, "bold", f$$0.coreStyles_bold);
				b$$1("Italic", c$$0.italic, "italic", f$$0.coreStyles_italic);
				b$$1("Underline", c$$0.underline, "underline", f$$0.coreStyles_underline);
				b$$1("Strike", c$$0.strike, "strike", f$$0.coreStyles_strike);
				b$$1("Subscript", c$$0.subscript, "subscript", f$$0.coreStyles_subscript);
				b$$1("Superscript", c$$0.superscript, "superscript", f$$0.coreStyles_superscript);
				a$$0.setKeystroke([
					[CKEDITOR.CTRL + 66, "bold"],
					[CKEDITOR.CTRL + 73, "italic"],
					[CKEDITOR.CTRL + 85, "underline"]
				]);
			}
		});
		CKEDITOR.config.coreStyles_bold = {
			element: "strong",
			overrides: "b"
		};
		CKEDITOR.config.coreStyles_italic = {
			element: "em",
			overrides: "i"
		};
		CKEDITOR.config.coreStyles_underline = {
			element: "u"
		};
		CKEDITOR.config.coreStyles_strike = {
			element: "s",
			overrides: "strike"
		};
		CKEDITOR.config.coreStyles_subscript = {
			element: "sub"
		};
		CKEDITOR.config.coreStyles_superscript = {
			element: "sup"
		};
		CKEDITOR.plugins.add("dialogui", {
			onLoad: function() {
				var a$$2 = function(a) {
					if (!this._) {
						this._ = {};
					}
					this._["default"] = this._.initValue = a["default"] || "";
					this._.required = a.required || false;
					var b = [this._];
					var c = 1;
					for (; c < arguments.length; c++) {
						b.push(arguments[c]);
					}
					b.push(true);
					CKEDITOR.tools.extend.apply(CKEDITOR.tools, b);
					return this._;
				};
				var e$$0 = {
					build: function(a, b, c) {
						return new CKEDITOR.ui.dialog.textInput(a, b, c);
					}
				};
				var b$$1 = {
					build: function(a, b, c) {
						return new CKEDITOR.ui.dialog[b.type](a, b, c);
					}
				};
				var d$$1 = {
					isChanged: function() {
						return this.getValue() != this.getInitValue();
					},
					reset: function(a) {
						this.setValue(this.getInitValue(), a);
					},
					setInitValue: function() {
						this._.initValue = this.getValue();
					},
					resetInitValue: function() {
						this._.initValue = this._["default"];
					},
					getInitValue: function() {
						return this._.initValue;
					}
				};
				var f$$0 = CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
					onChange: function(a, b) {
						if (!this._.domOnChangeRegistered) {
							a.on("load", function() {
								this.getInputElement().on("change", function() {
									if (a.parts.dialog.isVisible()) {
										this.fire("change", {
											value: this.getValue()
										});
									}
								}, this);
							}, this);
							this._.domOnChangeRegistered = true;
						}
						this.on("change", b);
					}
				}, true);
				var c$$1 = /^on([A-Z]\w+)/;
				var h$$0 = function(a) {
					var b;
					for (b in a) {
						if (c$$1.test(b) || (b == "title" || b == "type")) {
							delete a[b];
						}
					}
					return a;
				};
				CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {
					labeledElement: function(b, c, d$$0, f) {
						if (!(arguments.length < 4)) {
							var e = a$$2.call(this, c);
							e.labelId = CKEDITOR.tools.getNextId() + "_label";
							this._.children = [];
							CKEDITOR.ui.dialog.uiElement.call(this, b, c, d$$0, "div", null, {
								role: "presentation"
							}, function() {
								var a = [];
								var d = c.required ? " cke_required" : "";
								if (c.labelLayout != "horizontal") {
									a.push('<label class="cke_dialog_ui_labeled_label' + d + '" ', ' id="' + e.labelId + '"', e.inputId ? ' for="' + e.inputId + '"' : "", (c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">", c.label, "</label>", '<div class="cke_dialog_ui_labeled_content"', c.controlStyle ? ' style="' + c.controlStyle + '"' : "", ' role="radiogroup" aria-labelledby="' + e.labelId + '">', f.call(this, b, c), "</div>");
								} else {
									d = {
										type: "hbox",
										widths: c.widths,
										padding: 0,
										children: [{
											type: "html",
											html: '<label class="cke_dialog_ui_labeled_label' + d + '" id="' + e.labelId + '" for="' + e.inputId + '"' + (c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">" + CKEDITOR.tools.htmlEncode(c.label) + "</span>"
										}, {
											type: "html",
											html: '<span class="cke_dialog_ui_labeled_content"' + (c.controlStyle ? ' style="' + c.controlStyle + '"' : "") + ">" + f.call(this, b, c) + "</span>"
										}]
									};
									CKEDITOR.dialog._.uiElementBuilders.hbox.build(b, d, a);
								}
								return a.join("");
							});
						}
					},
					textInput: function(b$$0, c, d) {
						if (!(arguments.length < 3)) {
							a$$2.call(this, c);
							var f = this._.inputId = CKEDITOR.tools.getNextId() + "_textInput";
							var e = {
								"class": "cke_dialog_ui_input_" + c.type,
								id: f,
								type: c.type
							};
							if (c.validate) {
								this.validate = c.validate;
							}
							if (c.maxLength) {
								e.maxlength = c.maxLength;
							}
							if (c.size) {
								e.size = c.size;
							}
							if (c.inputStyle) {
								e.style = c.inputStyle;
							}
							var h = this;
							var r = false;
							b$$0.on("load", function() {
								h.getInputElement().on("keydown", function(a) {
									if (a.data.getKeystroke() == 13) {
										r = true;
									}
								});
								h.getInputElement().on("keyup", function(a) {
									if (a.data.getKeystroke() == 13 && r) {
										if (b$$0.getButton("ok")) {
											setTimeout(function() {
												b$$0.getButton("ok").click();
											}, 0);
										}
										r = false;
									}
								}, null, null, 1E3);
							});
							CKEDITOR.ui.dialog.labeledElement.call(this, b$$0, c, d, function() {
								var a = ['<div class="cke_dialog_ui_input_', c.type, '" role="presentation"'];
								if (c.width) {
									a.push('style="width:' + c.width + '" ');
								}
								a.push("><input ");
								e["aria-labelledby"] = this._.labelId;
								if (this._.required) {
									e["aria-required"] = this._.required;
								}
								var b;
								for (b in e) {
									a.push(b + '="' + e[b] + '" ');
								}
								a.push(" /></div>");
								return a.join("");
							});
						}
					},
					textarea: function(b$$0, c, d) {
						if (!(arguments.length < 3)) {
							a$$2.call(this, c);
							var f = this;
							var e = this._.inputId = CKEDITOR.tools.getNextId() + "_textarea";
							var h = {};
							if (c.validate) {
								this.validate = c.validate;
							}
							h.rows = c.rows || 5;
							h.cols = c.cols || 20;
							h["class"] = "cke_dialog_ui_input_textarea " + (c["class"] || "");
							if (typeof c.inputStyle != "undefined") {
								h.style = c.inputStyle;
							}
							if (c.dir) {
								h.dir = c.dir;
							}
							CKEDITOR.ui.dialog.labeledElement.call(this, b$$0, c, d, function() {
								h["aria-labelledby"] = this._.labelId;
								if (this._.required) {
									h["aria-required"] = this._.required;
								}
								var a = ['<div class="cke_dialog_ui_input_textarea" role="presentation"><textarea id="', e, '" '];
								var b;
								for (b in h) {
									a.push(b + '="' + CKEDITOR.tools.htmlEncode(h[b]) + '" ');
								}
								a.push(">", CKEDITOR.tools.htmlEncode(f._["default"]), "</textarea></div>");
								return a.join("");
							});
						}
					},
					checkbox: function(b, c, d$$0) {
						if (!(arguments.length < 3)) {
							var f = a$$2.call(this, c, {
								"default": !!c["default"]
							});
							if (c.validate) {
								this.validate = c.validate;
							}
							CKEDITOR.ui.dialog.uiElement.call(this, b, c, d$$0, "span", null, null, function() {
								var a = CKEDITOR.tools.extend({}, c, {
									id: c.id ? c.id + "_checkbox" : CKEDITOR.tools.getNextId() + "_checkbox"
								}, true);
								var d = [];
								var e = CKEDITOR.tools.getNextId() + "_label";
								var i = {
									"class": "cke_dialog_ui_checkbox_input",
									type: "checkbox",
									"aria-labelledby": e
								};
								h$$0(a);
								if (c["default"]) {
									i.checked = "checked";
								}
								if (typeof a.inputStyle != "undefined") {
									a.style = a.inputStyle;
								}
								f.checkbox = new CKEDITOR.ui.dialog.uiElement(b, a, d, "input", null, i);
								d.push(' <label id="', e, '" for="', i.id, '"' + (c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">", CKEDITOR.tools.htmlEncode(c.label), "</label>");
								return d.join("");
							});
						}
					},
					radio: function(b, c, d$$0) {
						if (!(arguments.length < 3)) {
							a$$2.call(this, c);
							if (!this._["default"]) {
								this._["default"] = this._.initValue = c.items[0][1];
							}
							if (c.validate) {
								this.validate = c.valdiate;
							}
							var f = [];
							var e = this;
							CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d$$0, function() {
								var a = [];
								var d = [];
								var i = (c.id ? c.id : CKEDITOR.tools.getNextId()) + "_radio";
								var m = 0;
								for (; m < c.items.length; m++) {
									var s = c.items[m];
									var t = s[2] !== void 0 ? s[2] : s[0];
									var p = s[1] !== void 0 ? s[1] : s[0];
									var x = CKEDITOR.tools.getNextId() + "_radio_input";
									var q = x + "_label";
									x = CKEDITOR.tools.extend({}, c, {
										id: x,
										title: null,
										type: null
									}, true);
									t = CKEDITOR.tools.extend({}, x, {
										title: t
									}, true);
									var u = {
										type: "radio",
										"class": "cke_dialog_ui_radio_input",
										name: i,
										value: p,
										"aria-labelledby": q
									};
									var B = [];
									if (e._["default"] == p) {
										u.checked = "checked";
									}
									h$$0(x);
									h$$0(t);
									if (typeof x.inputStyle != "undefined") {
										x.style = x.inputStyle;
									}
									x.keyboardFocusable = true;
									f.push(new CKEDITOR.ui.dialog.uiElement(b, x, B, "input", null, u));
									B.push(" ");
									new CKEDITOR.ui.dialog.uiElement(b, t, B, "label", null, {
										id: q,
										"for": u.id
									}, s[0]);
									a.push(B.join(""));
								}
								new CKEDITOR.ui.dialog.hbox(b, f, a, d);
								return d.join("");
							});
							this._.children = f;
						}
					},
					button: function(b, c, d) {
						if (arguments.length) {
							if (typeof c == "function") {
								c = c(b.getParentEditor());
							}
							a$$2.call(this, c, {
								disabled: c.disabled || false
							});
							CKEDITOR.event.implementOn(this);
							var f = this;
							b.on("load", function() {
								var a$$0 = this.getElement();
								(function() {
									a$$0.on("click", function(a) {
										f.click();
										a.data.preventDefault();
									});
									a$$0.on("keydown", function(a) {
										if (a.data.getKeystroke() in {
											32: 1
										}) {
											f.click();
											a.data.preventDefault();
										}
									});
								})();
								a$$0.unselectable();
							}, this);
							var e = CKEDITOR.tools.extend({}, c);
							delete e.style;
							var h = CKEDITOR.tools.getNextId() + "_label";
							CKEDITOR.ui.dialog.uiElement.call(this, b, e, d, "a", null, {
								style: c.style,
								href: "javascript:void(0)",
								title: c.label,
								hidefocus: "true",
								"class": c["class"],
								role: "button",
								"aria-labelledby": h
							}, '<span id="' + h + '" class="cke_dialog_ui_button">' + CKEDITOR.tools.htmlEncode(c.label) + "</span>");
						}
					},
					select: function(b, c, d$$0) {
						if (!(arguments.length < 3)) {
							var f = a$$2.call(this, c);
							if (c.validate) {
								this.validate = c.validate;
							}
							f.inputId = CKEDITOR.tools.getNextId() + "_select";
							CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d$$0, function() {
								var a = CKEDITOR.tools.extend({}, c, {
									id: c.id ? c.id + "_select" : CKEDITOR.tools.getNextId() + "_select"
								}, true);
								var d = [];
								var e = [];
								var i = {
									id: f.inputId,
									"class": "cke_dialog_ui_input_select",
									"aria-labelledby": this._.labelId
								};
								d.push('<div class="cke_dialog_ui_input_', c.type, '" role="presentation"');
								if (c.width) {
									d.push('style="width:' + c.width + '" ');
								}
								d.push(">");
								if (c.size != void 0) {
									i.size = c.size;
								}
								if (c.multiple != void 0) {
									i.multiple = c.multiple;
								}
								h$$0(a);
								var m = 0;
								var s;
								for (; m < c.items.length && (s = c.items[m]); m++) {
									e.push('<option value="', CKEDITOR.tools.htmlEncode(s[1] !== void 0 ? s[1] : s[0]).replace(/"/g, "&quot;"), '" /> ', CKEDITOR.tools.htmlEncode(s[0]));
								}
								if (typeof a.inputStyle != "undefined") {
									a.style = a.inputStyle;
								}
								f.select = new CKEDITOR.ui.dialog.uiElement(b, a, d, "select", null, i, e.join(""));
								d.push("</div>");
								return d.join("");
							});
						}
					},
					file: function(b, c, d) {
						if (!(arguments.length < 3)) {
							if (c["default"] === void 0) {
								c["default"] = "";
							}
							var f = CKEDITOR.tools.extend(a$$2.call(this, c), {
								definition: c,
								buttons: []
							});
							if (c.validate) {
								this.validate = c.validate;
							}
							b.on("load", function() {
								CKEDITOR.document.getById(f.frameId).getParent().addClass("cke_dialog_ui_input_file");
							});
							CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function() {
								f.frameId = CKEDITOR.tools.getNextId() + "_fileInput";
								var a = ['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" role="presentation" id="', f.frameId, '" title="', c.label, '" src="javascript:void('];
								a.push(CKEDITOR.env.ie ? "(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "})()" : "0");
								a.push(')"></iframe>');
								return a.join("");
							});
						}
					},
					fileButton: function(b, c, d$$0) {
						if (!(arguments.length < 3)) {
							a$$2.call(this, c);
							var f = this;
							if (c.validate) {
								this.validate = c.validate;
							}
							var e = CKEDITOR.tools.extend({}, c);
							var h = e.onClick;
							e.className = (e.className ? e.className + " " : "") + "cke_dialog_ui_button";
							e.onClick = function(a) {
								var d = c["for"];
								if (!h || h.call(this, a) !== false) {
									b.getContentElement(d[0], d[1]).submit();
									this.disable();
								}
							};
							b.on("load", function() {
								b.getContentElement(c["for"][0], c["for"][1])._.buttons.push(f);
							});
							CKEDITOR.ui.dialog.button.call(this, b, e, d$$0);
						}
					},
					html: function() {
						var a = /^\s*<[\w:]+\s+([^>]*)?>/;
						var b = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/;
						var c = /\/$/;
						return function(d, f, e) {
							if (!(arguments.length < 3)) {
								var h = [];
								var l = f.html;
								if (l.charAt(0) != "<") {
									l = "<span>" + l + "</span>";
								}
								var m = f.focus;
								if (m) {
									var s = this.focus;
									this.focus = function() {
										(typeof m == "function" ? m : s).call(this);
										this.fire("focus");
									};
									if (f.isFocusable) {
										this.isFocusable = this.isFocusable;
									}
									this.keyboardFocusable = true;
								}
								CKEDITOR.ui.dialog.uiElement.call(this, d, f, h, "span", null, null, "");
								h = h.join("").match(a);
								l = l.match(b) || ["", "", ""];
								if (c.test(l[1])) {
									l[1] = l[1].slice(0, -1);
									l[2] = "/" + l[2];
								}
								e.push([l[1], " ", h[1] || "", l[2]].join(""));
							}
						};
					}(),
					fieldset: function(a$$0, b$$0, c, d, f) {
						var e = f.label;
						this._ = {
							children: b$$0
						};
						CKEDITOR.ui.dialog.uiElement.call(this, a$$0, f, d, "fieldset", null, null, function() {
							var a = [];
							if (e) {
								a.push("<legend" + (f.labelStyle ? ' style="' + f.labelStyle + '"' : "") + ">" + e + "</legend>");
							}
							var b = 0;
							for (; b < c.length; b++) {
								a.push(c[b]);
							}
							return a.join("");
						});
					}
				}, true);
				CKEDITOR.ui.dialog.html.prototype = new CKEDITOR.ui.dialog.uiElement;
				CKEDITOR.ui.dialog.labeledElement.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
					setLabel: function(a) {
						var b = CKEDITOR.document.getById(this._.labelId);
						if (b.getChildCount() < 1) {
							(new CKEDITOR.dom.text(a, CKEDITOR.document)).appendTo(b);
						} else {
							b.getChild(0).$.nodeValue = a;
						}
						return this;
					},
					getLabel: function() {
						var a = CKEDITOR.document.getById(this._.labelId);
						return !a || a.getChildCount() < 1 ? "" : a.getChild(0).getText();
					},
					eventProcessors: f$$0
				}, true);
				CKEDITOR.ui.dialog.button.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
					click: function() {
						return !this._.disabled ? this.fire("click", {
							dialog: this._.dialog
						}) : false;
					},
					enable: function() {
						this._.disabled = false;
						var a = this.getElement();
						if (a) {
							a.removeClass("cke_disabled");
						}
					},
					disable: function() {
						this._.disabled = true;
						this.getElement().addClass("cke_disabled");
					},
					isVisible: function() {
						return this.getElement().getFirst().isVisible();
					},
					isEnabled: function() {
						return !this._.disabled;
					},
					eventProcessors: CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
						onClick: function(a, b) {
							this.on("click", function() {
								b.apply(this, arguments);
							});
						}
					}, true),
					accessKeyUp: function() {
						this.click();
					},
					accessKeyDown: function() {
						this.focus();
					},
					keyboardFocusable: true
				}, true);
				CKEDITOR.ui.dialog.textInput.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
					getInputElement: function() {
						return CKEDITOR.document.getById(this._.inputId);
					},
					focus: function() {
						var a = this.selectParentTab();
						setTimeout(function() {
							var b = a.getInputElement();
							if (b) {
								b.$.focus();
							}
						}, 0);
					},
					select: function() {
						var a = this.selectParentTab();
						setTimeout(function() {
							var b = a.getInputElement();
							if (b) {
								b.$.focus();
								b.$.select();
							}
						}, 0);
					},
					accessKeyUp: function() {
						this.select();
					},
					setValue: function(a) {
						if (!a) {
							a = "";
						}
						return CKEDITOR.ui.dialog.uiElement.prototype.setValue.apply(this, arguments);
					},
					keyboardFocusable: true
				}, d$$1, true);
				CKEDITOR.ui.dialog.textarea.prototype = new CKEDITOR.ui.dialog.textInput;
				CKEDITOR.ui.dialog.select.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
					getInputElement: function() {
						return this._.select.getElement();
					},
					add: function(a, b, c) {
						var d = new CKEDITOR.dom.element("option", this.getDialog().getParentEditor().document);
						var f = this.getInputElement().$;
						d.$.text = a;
						d.$.value = b === void 0 || b === null ? a : b;
						if (c === void 0 || c === null) {
							if (CKEDITOR.env.ie) {
								f.add(d.$);
							} else {
								f.add(d.$, null);
							}
						} else {
							f.add(d.$, c);
						}
						return this;
					},
					remove: function(a) {
						this.getInputElement().$.remove(a);
						return this;
					},
					clear: function() {
						var a = this.getInputElement().$;
						for (; a.length > 0;) {
							a.remove(0);
						}
						return this;
					},
					keyboardFocusable: true
				}, d$$1, true);
				CKEDITOR.ui.dialog.checkbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
					getInputElement: function() {
						return this._.checkbox.getElement();
					},
					setValue: function(a, b) {
						this.getInputElement().$.checked = a;
						if (!b) {
							this.fire("change", {
								value: a
							});
						}
					},
					getValue: function() {
						return this.getInputElement().$.checked;
					},
					accessKeyUp: function() {
						this.setValue(!this.getValue());
					},
					eventProcessors: {
						onChange: function(a$$0, b$$0) {
							if (!CKEDITOR.env.ie || CKEDITOR.env.version > 8) {
								return f$$0.onChange.apply(this, arguments);
							}
							a$$0.on("load", function() {
								var a = this._.checkbox.getElement();
								a.on("propertychange", function(b) {
									b = b.data.$;
									if (b.propertyName == "checked") {
										this.fire("change", {
											value: a.$.checked
										});
									}
								}, this);
							}, this);
							this.on("change", b$$0);
							return null;
						}
					},
					keyboardFocusable: true
				}, d$$1, true);
				CKEDITOR.ui.dialog.radio.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
					setValue: function(a, b) {
						var c = this._.children;
						var d;
						var f = 0;
						for (; f < c.length && (d = c[f]); f++) {
							d.getElement().$.checked = d.getValue() == a;
						}
						if (!b) {
							this.fire("change", {
								value: a
							});
						}
					},
					getValue: function() {
						var a = this._.children;
						var b = 0;
						for (; b < a.length; b++) {
							if (a[b].getElement().$.checked) {
								return a[b].getValue();
							}
						}
						return null;
					},
					accessKeyUp: function() {
						var a = this._.children;
						var b;
						b = 0;
						for (; b < a.length; b++) {
							if (a[b].getElement().$.checked) {
								a[b].getElement().focus();
								return;
							}
						}
						a[0].getElement().focus();
					},
					eventProcessors: {
						onChange: function(a$$1, b$$0) {
							if (CKEDITOR.env.ie) {
								a$$1.on("load", function() {
									var a$$0 = this._.children;
									var b = this;
									var c = 0;
									for (; c < a$$0.length; c++) {
										a$$0[c].getElement().on("propertychange", function(a) {
											a = a.data.$;
											if (a.propertyName == "checked") {
												if (this.$.checked) {
													b.fire("change", {
														value: this.getAttribute("value")
													});
												}
											}
										});
									}
								}, this);
								this.on("change", b$$0);
							} else {
								return f$$0.onChange.apply(this, arguments);
							}
							return null;
						}
					}
				}, d$$1, true);
				CKEDITOR.ui.dialog.file.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, d$$1, {
					getInputElement: function() {
						var a = CKEDITOR.document.getById(this._.frameId).getFrameDocument();
						return a.$.forms.length > 0 ? new CKEDITOR.dom.element(a.$.forms[0].elements[0]) : this.getElement();
					},
					submit: function() {
						this.getInputElement().getParent().$.submit();
						return this;
					},
					getAction: function() {
						return this.getInputElement().getParent().$.action;
					},
					registerEvents: function(a$$0) {
						var b$$0 = /^on([A-Z]\w+)/;
						var c$$0;
						var d$$0 = function(a, b, c, d) {
							a.on("formLoaded", function() {
								a.getInputElement().on(c, d, a);
							});
						};
						var f;
						for (f in a$$0) {
							if (c$$0 = f.match(b$$0)) {
								if (this.eventProcessors[f]) {
									this.eventProcessors[f].call(this, this._.dialog, a$$0[f]);
								} else {
									d$$0(this, this._.dialog, c$$0[1].toLowerCase(), a$$0[f]);
								}
							}
						}
						return this;
					},
					reset: function() {
						function a() {
							c.$.open();
							var j = "";
							if (d.size) {
								j = d.size - (CKEDITOR.env.ie ? 7 : 0);
							}
							var t = b.frameId + "_input";
							c.$.write(['<html dir="' + l + '" lang="' + m + '"><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">', '<form enctype="multipart/form-data" method="POST" dir="' + l + '" lang="' + m + '" action="', CKEDITOR.tools.htmlEncode(d.action), '"><label id="', b.labelId, '" for="', t, '" style="display:none">', CKEDITOR.tools.htmlEncode(d.label), '</label><input style="width:100%" id="', t, '" aria-labelledby="', b.labelId, '" type="file" name="',
								CKEDITOR.tools.htmlEncode(d.id || "cke_upload"), '" size="', CKEDITOR.tools.htmlEncode(j > 0 ? j : ""), '" /></form></body></html><script>', CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "", "window.parent.CKEDITOR.tools.callFunction(" + e + ");", "window.onbeforeunload = function() {window.parent.CKEDITOR.tools.callFunction(" + h + ")}", "\x3c/script>"
							].join(""));
							c.$.close();
							j = 0;
							for (; j < f.length; j++) {
								f[j].enable();
							}
						}
						var b = this._;
						var c = CKEDITOR.document.getById(b.frameId).getFrameDocument();
						var d = b.definition;
						var f = b.buttons;
						var e = this.formLoadedNumber;
						var h = this.formUnloadNumber;
						var l = b.dialog._.editor.lang.dir;
						var m = b.dialog._.editor.langCode;
						if (!e) {
							e = this.formLoadedNumber = CKEDITOR.tools.addFunction(function() {
								this.fire("formLoaded");
							}, this);
							h = this.formUnloadNumber = CKEDITOR.tools.addFunction(function() {
								this.getInputElement().clearCustomData();
							}, this);
							this.getDialog()._.editor.on("destroy", function() {
								CKEDITOR.tools.removeFunction(e);
								CKEDITOR.tools.removeFunction(h);
							});
						}
						if (CKEDITOR.env.gecko) {
							setTimeout(a, 500);
						} else {
							a();
						}
					},
					getValue: function() {
						return this.getInputElement().$.value || "";
					},
					setInitValue: function() {
						this._.initValue = "";
					},
					eventProcessors: {
						onChange: function(a, b) {
							if (!this._.domOnChangeRegistered) {
								this.on("formLoaded", function() {
									this.getInputElement().on("change", function() {
										this.fire("change", {
											value: this.getValue()
										});
									}, this);
								}, this);
								this._.domOnChangeRegistered = true;
							}
							this.on("change", b);
						}
					},
					keyboardFocusable: true
				}, true);
				CKEDITOR.ui.dialog.fileButton.prototype = new CKEDITOR.ui.dialog.button;
				CKEDITOR.ui.dialog.fieldset.prototype = CKEDITOR.tools.clone(CKEDITOR.ui.dialog.hbox.prototype);
				CKEDITOR.dialog.addUIElement("text", e$$0);
				CKEDITOR.dialog.addUIElement("password", e$$0);
				CKEDITOR.dialog.addUIElement("textarea", b$$1);
				CKEDITOR.dialog.addUIElement("checkbox", b$$1);
				CKEDITOR.dialog.addUIElement("radio", b$$1);
				CKEDITOR.dialog.addUIElement("button", b$$1);
				CKEDITOR.dialog.addUIElement("select", b$$1);
				CKEDITOR.dialog.addUIElement("file", b$$1);
				CKEDITOR.dialog.addUIElement("fileButton", b$$1);
				CKEDITOR.dialog.addUIElement("html", b$$1);
				CKEDITOR.dialog.addUIElement("fieldset", {
					build: function(a, b, c) {
						var d = b.children;
						var f;
						var e = [];
						var h = [];
						var l = 0;
						for (; l < d.length && (f = d[l]); l++) {
							var m = [];
							e.push(m);
							h.push(CKEDITOR.dialog._.uiElementBuilders[f.type].build(a, f, m));
						}
						return new CKEDITOR.ui.dialog[b.type](a, h, e, c, b);
					}
				});
			}
		});
		CKEDITOR.DIALOG_RESIZE_NONE = 0;
		CKEDITOR.DIALOG_RESIZE_WIDTH = 1;
		CKEDITOR.DIALOG_RESIZE_HEIGHT = 2;
		CKEDITOR.DIALOG_RESIZE_BOTH = 3;
		(function() {
			function a$$2() {
				var a = this._.tabIdList.length;
				var b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId) + a;
				var c = b - 1;
				for (; c > b - a; c--) {
					if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight) {
						return this._.tabIdList[c % a];
					}
				}
				return null;
			}

			function e$$1() {
				var a = this._.tabIdList.length;
				var b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId);
				var c = b + 1;
				for (; c < b + a; c++) {
					if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight) {
						return this._.tabIdList[c % a];
					}
				}
				return null;
			}

			function b$$2(a, b) {
				var c = a.$.getElementsByTagName("input");
				var d = 0;
				var f = c.length;
				for (; d < f; d++) {
					var e = new CKEDITOR.dom.element(c[d]);
					if (e.getAttribute("type").toLowerCase() == "text") {
						if (b) {
							e.setAttribute("value", e.getCustomData("fake_value") || "");
							e.removeCustomData("fake_value");
						} else {
							e.setCustomData("fake_value", e.getAttribute("value"));
							e.setAttribute("value", "");
						}
					}
				}
			}

			function d$$1(a, b) {
				var c = this.getInputElement();
				if (c) {
					if (a) {
						c.removeAttribute("aria-invalid");
					} else {
						c.setAttribute("aria-invalid", true);
					}
				}
				if (!a) {
					if (this.select) {
						this.select();
					} else {
						this.focus();
					}
				}
				if (b) {
					alert(b);
				}
				this.fire("validated", {
					valid: a,
					msg: b
				});
			}

			function f$$1() {
				var a = this.getInputElement();
				if (a) {
					a.removeAttribute("aria-invalid");
				}
			}

			function c$$1(a) {
				a = CKEDITOR.dom.element.createFromHtml(CKEDITOR.addTemplate("dialog", m$$1).output({
					id: CKEDITOR.tools.getNextNumber(),
					editorId: a.id,
					langDir: a.lang.dir,
					langCode: a.langCode,
					editorDialogClass: "cke_editor_" + a.name.replace(/\./g, "\\.") + "_dialog",
					closeTitle: a.lang.common.close,
					hidpi: CKEDITOR.env.hidpi ? "cke_hidpi" : ""
				}));
				var b = a.getChild([0, 0, 0, 0, 0]);
				var c = b.getChild(0);
				var d = b.getChild(1);
				if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
					var f = "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())";
					CKEDITOR.dom.element.createFromHtml('<iframe frameBorder="0" class="cke_iframe_shim" src="' + f + '" tabIndex="-1"></iframe>').appendTo(b.getParent());
				}
				c.unselectable();
				d.unselectable();
				return {
					element: a,
					parts: {
						dialog: a.getChild(0),
						title: c,
						close: d,
						tabs: b.getChild(2),
						contents: b.getChild([3, 0, 0, 0]),
						footer: b.getChild([3, 0, 1, 0])
					}
				};
			}

			function h$$1(a$$0, b, c) {
				this.element = b;
				this.focusIndex = c;
				this.tabIndex = 0;
				this.isFocusable = function() {
					return !b.getAttribute("disabled") && b.isVisible();
				};
				this.focus = function() {
					a$$0._.currentFocusIndex = this.focusIndex;
					this.element.focus();
				};
				b.on("keydown", function(a) {
					if (a.data.getKeystroke() in {
						32: 1,
						13: 1
					}) {
						this.fire("click");
					}
				});
				b.on("focus", function() {
					this.fire("mouseover");
				});
				b.on("blur", function() {
					this.fire("mouseout");
				});
			}

			function j$$0(a) {
				function b() {
					a.layout();
				}
				var c = CKEDITOR.document.getWindow();
				c.on("resize", b);
				a.on("hide", function() {
					c.removeListener("resize", b);
				});
			}

			function g$$0(a, b) {
				this._ = {
					dialog: a
				};
				CKEDITOR.tools.extend(this, b);
			}

			function i$$0(a$$0) {
				function b(c) {
					var i = a$$0.getSize();
					var j = CKEDITOR.document.getWindow().getViewPaneSize();
					var k = c.data.$.screenX;
					var l = c.data.$.screenY;
					var m = k - d.x;
					var n = l - d.y;
					d = {
						x: k,
						y: l
					};
					f.x = f.x + m;
					f.y = f.y + n;
					a$$0.move(f.x + g[3] < h$$0 ? -g[3] : f.x - g[1] > j.width - i.width - h$$0 ? j.width - i.width + (e$$0.lang.dir == "rtl" ? 0 : g[1]) : f.x, f.y + g[0] < h$$0 ? -g[0] : f.y - g[2] > j.height - i.height - h$$0 ? j.height - i.height + g[2] : f.y, 1);
					c.data.preventDefault();
				}

				function c$$0() {
					CKEDITOR.document.removeListener("mousemove", b);
					CKEDITOR.document.removeListener("mouseup", c$$0);
					if (CKEDITOR.env.ie6Compat) {
						var a = v.getChild(0).getFrameDocument();
						a.removeListener("mousemove", b);
						a.removeListener("mouseup", c$$0);
					}
				}
				var d = null;
				var f = null;
				a$$0.getElement().getFirst();
				var e$$0 = a$$0.getParentEditor();
				var h$$0 = e$$0.config.dialog_magnetDistance;
				var g = CKEDITOR.skin.margins || [0, 0, 0, 0];
				if (typeof h$$0 == "undefined") {
					h$$0 = 20;
				}
				a$$0.parts.title.on("mousedown", function(e) {
					d = {
						x: e.data.$.screenX,
						y: e.data.$.screenY
					};
					CKEDITOR.document.on("mousemove", b);
					CKEDITOR.document.on("mouseup", c$$0);
					f = a$$0.getPosition();
					if (CKEDITOR.env.ie6Compat) {
						var h = v.getChild(0).getFrameDocument();
						h.on("mousemove", b);
						h.on("mouseup", c$$0);
					}
					e.data.preventDefault();
				}, a$$0);
			}

			function k$$0(a$$0) {
				function d(f) {
					var m = g.lang.dir == "rtl";
					var n = l.width;
					var p = l.height;
					var s = n + (f.data.$.screenX - b$$0) * (m ? -1 : 1) * (a$$0._.moved ? 1 : 2);
					var A = p + (f.data.$.screenY - c) * (a$$0._.moved ? 1 : 2);
					var o = a$$0._.element.getFirst();
					o = m && o.getComputedStyle("right");
					var t = a$$0.getPosition();
					if (t.y + A > k.height) {
						A = k.height - t.y;
					}
					if ((m ? o : t.x) + s > k.width) {
						s = k.width - (m ? o : t.x);
					}
					if (h$$0 == CKEDITOR.DIALOG_RESIZE_WIDTH || h$$0 == CKEDITOR.DIALOG_RESIZE_BOTH) {
						n = Math.max(e$$0.minWidth || 0, s - i);
					}
					if (h$$0 == CKEDITOR.DIALOG_RESIZE_HEIGHT || h$$0 == CKEDITOR.DIALOG_RESIZE_BOTH) {
						p = Math.max(e$$0.minHeight || 0, A - j);
					}
					a$$0.resize(n, p);
					if (!a$$0._.moved) {
						a$$0.layout();
					}
					f.data.preventDefault();
				}

				function f$$0() {
					CKEDITOR.document.removeListener("mouseup", f$$0);
					CKEDITOR.document.removeListener("mousemove", d);
					if (m$$0) {
						m$$0.remove();
						m$$0 = null;
					}
					if (CKEDITOR.env.ie6Compat) {
						var a = v.getChild(0).getFrameDocument();
						a.removeListener("mouseup", f$$0);
						a.removeListener("mousemove", d);
					}
				}
				var b$$0;
				var c;
				var e$$0 = a$$0.definition;
				var h$$0 = e$$0.resizable;
				if (h$$0 != CKEDITOR.DIALOG_RESIZE_NONE) {
					var g = a$$0.getParentEditor();
					var i;
					var j;
					var k;
					var l;
					var m$$0;
					var n$$0 = CKEDITOR.tools.addFunction(function(e) {
						l = a$$0.getSize();
						var h = a$$0.parts.contents;
						if (h.$.getElementsByTagName("iframe").length) {
							m$$0 = CKEDITOR.dom.element.createFromHtml('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>');
							h.append(m$$0);
						}
						j = l.height - a$$0.parts.contents.getSize("height", !(CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.quirks));
						i = l.width - a$$0.parts.contents.getSize("width", 1);
						b$$0 = e.screenX;
						c = e.screenY;
						k = CKEDITOR.document.getWindow().getViewPaneSize();
						CKEDITOR.document.on("mousemove", d);
						CKEDITOR.document.on("mouseup", f$$0);
						if (CKEDITOR.env.ie6Compat) {
							h = v.getChild(0).getFrameDocument();
							h.on("mousemove", d);
							h.on("mouseup", f$$0);
						}
						if (e.preventDefault) {
							e.preventDefault();
						}
					});
					a$$0.on("load", function() {
						var b = "";
						if (h$$0 == CKEDITOR.DIALOG_RESIZE_WIDTH) {
							b = " cke_resizer_horizontal";
						} else {
							if (h$$0 == CKEDITOR.DIALOG_RESIZE_HEIGHT) {
								b = " cke_resizer_vertical";
							}
						}
						b = CKEDITOR.dom.element.createFromHtml('<div class="cke_resizer' + b + " cke_resizer_" + g.lang.dir + '" title="' + CKEDITOR.tools.htmlEncode(g.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + n$$0 + ', event )">' + (g.lang.dir == "ltr" ? "\u25e2" : "\u25e3") + "</div>");
						a$$0.parts.footer.append(b, 1);
					});
					g.on("destroy", function() {
						CKEDITOR.tools.removeFunction(n$$0);
					});
				}
			}

			function n$$1(a) {
				a.data.preventDefault(1);
			}

			function o$$0(a$$0) {
				var b = CKEDITOR.document.getWindow();
				var c$$0 = a$$0.config;
				var d = c$$0.dialog_backgroundCoverColor || "white";
				var f = c$$0.dialog_backgroundCoverOpacity;
				var e = c$$0.baseFloatZIndex;
				c$$0 = CKEDITOR.tools.genKey(d, f, e);
				var h = B[c$$0];
				if (h) {
					h.show();
				} else {
					e = ['<div tabIndex="-1" style="position: ', CKEDITOR.env.ie6Compat ? "absolute" : "fixed", "; z-index: ", e, "; top: 0px; left: 0px; ", !CKEDITOR.env.ie6Compat ? "background-color: " + d : "", '" class="cke_dialog_background_cover">'];
					if (CKEDITOR.env.ie6Compat) {
						d = "<html><body style=\\'background-color:" + d + ";\\'></body></html>";
						e.push('<iframe hidefocus="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:');
						e.push("void((function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.write( '" + d + "' );document.close();") + "})())");
						e.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>');
					}
					e.push("</div>");
					h = CKEDITOR.dom.element.createFromHtml(e.join(""));
					h.setOpacity(f != void 0 ? f : 0.5);
					h.on("keydown", n$$1);
					h.on("keypress", n$$1);
					h.on("keyup", n$$1);
					h.appendTo(CKEDITOR.document.getBody());
					B[c$$0] = h;
				}
				a$$0.focusManager.add(h);
				v = h;
				a$$0 = function() {
					var a = b.getViewPaneSize();
					h.setStyles({
						width: a.width + "px",
						height: a.height + "px"
					});
				};
				var g = function() {
					var a = b.getScrollPosition();
					var c = CKEDITOR.dialog._.currentTop;
					h.setStyles({
						left: a.x + "px",
						top: a.y + "px"
					});
					if (c) {
						do {
							a = c.getPosition();
							c.move(a.x, a.y);
						} while (c = c._.parentDialog);
					}
				};
				u$$0 = a$$0;
				b.on("resize", a$$0);
				a$$0();
				if (!CKEDITOR.env.mac || !CKEDITOR.env.webkit) {
					h.focus();
				}
				if (CKEDITOR.env.ie6Compat) {
					var i = function() {
						g();
						arguments.callee.prevScrollHandler.apply(this, arguments);
					};
					b.$.setTimeout(function() {
						i.prevScrollHandler = window.onscroll || function() {};
						window.onscroll = i;
					}, 0);
					g();
				}
			}

			function r$$0(a) {
				if (v) {
					a.focusManager.remove(v);
					a = CKEDITOR.document.getWindow();
					v.hide();
					a.removeListener("resize", u$$0);
					if (CKEDITOR.env.ie6Compat) {
						a.$.setTimeout(function() {
							window.onscroll = window.onscroll && window.onscroll.prevScrollHandler || null;
						}, 0);
					}
					u$$0 = null;
				}
			}
			var l$$0 = CKEDITOR.tools.cssLength;
			var m$$1 = '<div class="cke_reset_all {editorId} {editorDialogClass} {hidpi}" dir="{langDir}" lang="{langCode}" role="dialog" aria-labelledby="cke_dialog_title_{id}"><table class="cke_dialog ' + CKEDITOR.env.cssClass + ' cke_{langDir}" style="position:absolute" role="presentation"><tr><td role="presentation"><div class="cke_dialog_body" role="presentation"><div id="cke_dialog_title_{id}" class="cke_dialog_title" role="presentation"></div><a id="cke_dialog_close_button_{id}" class="cke_dialog_close_button" href="javascript:void(0)" title="{closeTitle}" role="button"><span class="cke_label">X</span></a><div id="cke_dialog_tabs_{id}" class="cke_dialog_tabs" role="tablist"></div><table class="cke_dialog_contents" role="presentation"><tr><td id="cke_dialog_contents_{id}" class="cke_dialog_contents_body" role="presentation"></td></tr><tr><td id="cke_dialog_footer_{id}" class="cke_dialog_footer" role="presentation"></td></tr></table></div></td></tr></table></div>';
			CKEDITOR.dialog = function(b$$1, h) {
				function g() {
					var a$$0 = w._.focusList;
					a$$0.sort(function(a, b) {
						return a.tabIndex != b.tabIndex ? b.tabIndex - a.tabIndex : a.focusIndex - b.focusIndex;
					});
					var b$$0 = a$$0.length;
					var c = 0;
					for (; c < b$$0; c++) {
						a$$0[c].focusIndex = c;
					}
				}

				function j(a) {
					var b = w._.focusList;
					a = a || 0;
					if (!(b.length < 1)) {
						var c = w._.currentFocusIndex;
						try {
							b[c].getInputElement().$.blur();
						} catch (d) {}
						var f = c = (c + a + b.length) % b.length;
						for (; a && !b[f].isFocusable();) {
							f = (f + a + b.length) % b.length;
							if (f == c) {
								break;
							}
						}
						b[f].focus();
						if (b[f].type == "text") {
							b[f].select();
						}
					}
				}

				function l(c) {
					if (w == CKEDITOR.dialog._.currentTop) {
						var d = c.data.getKeystroke();
						var f = b$$1.lang.dir == "rtl";
						I = r = 0;
						if (d == 9 || d == CKEDITOR.SHIFT + 9) {
							d = d == CKEDITOR.SHIFT + 9;
							if (w._.tabBarMode) {
								d = d ? a$$2.call(w) : e$$1.call(w);
								w.selectPage(d);
								w._.tabs[d][0].focus();
							} else {
								j(d ? -1 : 1);
							}
							I = 1;
						} else {
							if (d == CKEDITOR.ALT + 121 && (!w._.tabBarMode && w.getPageCount() > 1)) {
								w._.tabBarMode = true;
								w._.tabs[w._.currentTabId][0].focus();
								I = 1;
							} else {
								if ((d == 37 || d == 39) && w._.tabBarMode) {
									d = d == (f ? 39 : 37) ? a$$2.call(w) : e$$1.call(w);
									w.selectPage(d);
									w._.tabs[d][0].focus();
									I = 1;
								} else {
									if ((d == 13 || d == 32) && w._.tabBarMode) {
										this.selectPage(this._.currentTabId);
										this._.tabBarMode = false;
										this._.currentFocusIndex = -1;
										j(1);
										I = 1;
									} else {
										if (d == 13) {
											d = c.data.getTarget();
											if (!d.is("a", "button", "select", "textarea") && (!d.is("input") || d.$.type != "button")) {
												if (d = this.getButton("ok")) {
													CKEDITOR.tools.setTimeout(d.click, 0, d);
												}
												I = 1;
											}
											r = 1;
										} else {
											if (d == 27) {
												if (d = this.getButton("cancel")) {
													CKEDITOR.tools.setTimeout(d.click, 0, d);
												} else {
													if (this.fire("cancel", {
														hide: true
													}).hide !== false) {
														this.hide();
													}
												}
												r = 1;
											} else {
												return;
											}
										}
									}
								}
							}
						}
						m(c);
					}
				}

				function m(a) {
					if (I) {
						a.data.preventDefault(1);
					} else {
						if (r) {
							a.data.stopPropagation();
						}
					}
				}
				var n = CKEDITOR.dialog._.dialogDefinitions[h];
				var p = CKEDITOR.tools.clone(s$$0);
				var A = b$$1.config.dialog_buttonsOrder || "OS";
				var o = b$$1.lang.dir;
				var t = {};
				var I;
				var r;
				if (A == "OS" && CKEDITOR.env.mac || (A == "rtl" && o == "ltr" || A == "ltr" && o == "rtl")) {
					p.buttons.reverse();
				}
				n = CKEDITOR.tools.extend(n(b$$1), p);
				n = CKEDITOR.tools.clone(n);
				n = new q(this, n);
				p = c$$1(b$$1);
				this._ = {
					editor: b$$1,
					element: p.element,
					name: h,
					contentSize: {
						width: 0,
						height: 0
					},
					size: {
						width: 0,
						height: 0
					},
					contents: {},
					buttons: {},
					accessKeyMap: {},
					tabs: {},
					tabIdList: [],
					currentTabId: null,
					currentTabIndex: null,
					pageCount: 0,
					lastTab: null,
					tabBarMode: false,
					focusList: [],
					currentFocusIndex: 0,
					hasFocus: false
				};
				this.parts = p.parts;
				CKEDITOR.tools.setTimeout(function() {
					b$$1.fire("ariaWidget", this.parts.contents);
				}, 0, this);
				p = {
					position: CKEDITOR.env.ie6Compat ? "absolute" : "fixed",
					top: 0,
					visibility: "hidden"
				};
				p[o == "rtl" ? "right" : "left"] = 0;
				this.parts.dialog.setStyles(p);
				CKEDITOR.event.call(this);
				this.definition = n = CKEDITOR.fire("dialogDefinition", {
					name: h,
					definition: n
				}, b$$1).definition;
				if (!("removeDialogTabs" in b$$1._) && b$$1.config.removeDialogTabs) {
					p = b$$1.config.removeDialogTabs.split(";");
					o = 0;
					for (; o < p.length; o++) {
						A = p[o].split(":");
						if (A.length == 2) {
							var x = A[0];
							if (!t[x]) {
								t[x] = [];
							}
							t[x].push(A[1]);
						}
					}
					b$$1._.removeDialogTabs = t;
				}
				if (b$$1._.removeDialogTabs && (t = b$$1._.removeDialogTabs[h])) {
					o = 0;
					for (; o < t.length; o++) {
						n.removeContents(t[o]);
					}
				}
				if (n.onLoad) {
					this.on("load", n.onLoad);
				}
				if (n.onShow) {
					this.on("show", n.onShow);
				}
				if (n.onHide) {
					this.on("hide", n.onHide);
				}
				if (n.onOk) {
					this.on("ok", function(a) {
						b$$1.fire("saveSnapshot");
						setTimeout(function() {
							b$$1.fire("saveSnapshot");
						}, 0);
						if (n.onOk.call(this, a) === false) {
							a.data.hide = false;
						}
					});
				}
				if (n.onCancel) {
					this.on("cancel", function(a) {
						if (n.onCancel.call(this, a) === false) {
							a.data.hide = false;
						}
					});
				}
				var w = this;
				var C = function(a) {
					var b = w._.contents;
					var c = false;
					var d;
					for (d in b) {
						var f;
						for (f in b[d]) {
							if (c = a.call(this, b[d][f])) {
								return;
							}
						}
					}
				};
				this.on("ok", function(a) {
					C(function(b) {
						if (b.validate) {
							var c = b.validate(this);
							var f = typeof c == "string" || c === false;
							if (f) {
								a.data.hide = false;
								a.stop();
							}
							d$$1.call(b, !f, typeof c == "string" ? c : void 0);
							return f;
						}
					});
				}, this, null, 0);
				this.on("cancel", function(a) {
					C(function(c) {
						if (c.isChanged()) {
							if (!b$$1.config.dialog_noConfirmCancel && !confirm(b$$1.lang.common.confirmCancel)) {
								a.data.hide = false;
							}
							return true;
						}
					});
				}, this, null, 0);
				this.parts.close.on("click", function(a) {
					if (this.fire("cancel", {
						hide: true
					}).hide !== false) {
						this.hide();
					}
					a.data.preventDefault();
				}, this);
				this.changeFocus = j;
				var u = this._.element;
				b$$1.focusManager.add(u, 1);
				this.on("show", function() {
					u.on("keydown", l, this);
					if (CKEDITOR.env.gecko) {
						u.on("keypress", m, this);
					}
				});
				this.on("hide", function() {
					u.removeListener("keydown", l);
					if (CKEDITOR.env.gecko) {
						u.removeListener("keypress", m);
					}
					C(function(a) {
						f$$1.apply(a);
					});
				});
				this.on("iframeAdded", function(a) {
					(new CKEDITOR.dom.document(a.data.iframe.$.contentWindow.document)).on("keydown", l, this, null, 0);
				});
				this.on("show", function() {
					g();
					if (b$$1.config.dialog_startupFocusTab && w._.pageCount > 1) {
						w._.tabBarMode = true;
						w._.tabs[w._.currentTabId][0].focus();
					} else {
						if (!this._.hasFocus) {
							this._.currentFocusIndex = -1;
							if (n.onFocus) {
								var a = n.onFocus.call(this);
								if (a) {
									a.focus();
								}
							} else {
								j(1);
							}
						}
					}
				}, this, null, 4294967295);
				if (CKEDITOR.env.ie6Compat) {
					this.on("load", function() {
						var a = this.getElement();
						var b = a.getFirst();
						b.remove();
						b.appendTo(a);
					}, this);
				}
				i$$0(this);
				k$$0(this);
				(new CKEDITOR.dom.text(n.title, CKEDITOR.document)).appendTo(this.parts.title);
				o = 0;
				for (; o < n.contents.length; o++) {
					if (t = n.contents[o]) {
						this.addPage(t);
					}
				}
				this.parts.tabs.on("click", function(a) {
					var b = a.data.getTarget();
					if (b.hasClass("cke_dialog_tab")) {
						b = b.$.id;
						this.selectPage(b.substring(4, b.lastIndexOf("_")));
						if (this._.tabBarMode) {
							this._.tabBarMode = false;
							this._.currentFocusIndex = -1;
							j(1);
						}
						a.data.preventDefault();
					}
				}, this);
				o = [];
				t = CKEDITOR.dialog._.uiElementBuilders.hbox.build(this, {
					type: "hbox",
					className: "cke_dialog_footer_buttons",
					widths: [],
					children: n.buttons
				}, o).getChild();
				this.parts.footer.setHtml(o.join(""));
				o = 0;
				for (; o < t.length; o++) {
					this._.buttons[t[o].id] = t[o];
				}
			};
			CKEDITOR.dialog.prototype = {
				destroy: function() {
					this.hide();
					this._.element.remove();
				},
				resize: function() {
					return function(a, b) {
						if (!this._.contentSize || !(this._.contentSize.width == a && this._.contentSize.height == b)) {
							CKEDITOR.dialog.fire("resize", {
								dialog: this,
								width: a,
								height: b
							}, this._.editor);
							this.fire("resize", {
								width: a,
								height: b
							}, this._.editor);
							this.parts.contents.setStyles({
								width: a + "px",
								height: b + "px"
							});
							if (this._.editor.lang.dir == "rtl" && this._.position) {
								this._.position.x = CKEDITOR.document.getWindow().getViewPaneSize().width - this._.contentSize.width - parseInt(this._.element.getFirst().getStyle("right"), 10);
							}
							this._.contentSize = {
								width: a,
								height: b
							};
						}
					};
				}(),
				getSize: function() {
					var a = this._.element.getFirst();
					return {
						width: a.$.offsetWidth || 0,
						height: a.$.offsetHeight || 0
					};
				},
				move: function(a, b, c) {
					var d = this._.element.getFirst();
					var f = this._.editor.lang.dir == "rtl";
					var e = d.getComputedStyle("position") == "fixed";
					if (CKEDITOR.env.ie) {
						d.setStyle("zoom", "100%");
					}
					if (!e || (!this._.position || !(this._.position.x == a && this._.position.y == b))) {
						this._.position = {
							x: a,
							y: b
						};
						if (!e) {
							e = CKEDITOR.document.getWindow().getScrollPosition();
							a = a + e.x;
							b = b + e.y;
						}
						if (f) {
							e = this.getSize();
							a = CKEDITOR.document.getWindow().getViewPaneSize().width - e.width - a;
						}
						b = {
							top: (b > 0 ? b : 0) + "px"
						};
						b[f ? "right" : "left"] = (a > 0 ? a : 0) + "px";
						d.setStyles(b);
						if (c) {
							this._.moved = 1;
						}
					}
				},
				getPosition: function() {
					return CKEDITOR.tools.extend({}, this._.position);
				},
				show: function() {
					var a$$0 = this._.element;
					var b = this.definition;
					if (!a$$0.getParent() || !a$$0.getParent().equals(CKEDITOR.document.getBody())) {
						a$$0.appendTo(CKEDITOR.document.getBody());
					} else {
						a$$0.setStyle("display", "block");
					}
					this.resize(this._.contentSize && this._.contentSize.width || (b.width || b.minWidth), this._.contentSize && this._.contentSize.height || (b.height || b.minHeight));
					this.reset();
					this.selectPage(this.definition.contents[0].id);
					if (CKEDITOR.dialog._.currentZIndex === null) {
						CKEDITOR.dialog._.currentZIndex = this._.editor.config.baseFloatZIndex;
					}
					this._.element.getFirst().setStyle("z-index", CKEDITOR.dialog._.currentZIndex = CKEDITOR.dialog._.currentZIndex + 10);
					if (CKEDITOR.dialog._.currentTop === null) {
						CKEDITOR.dialog._.currentTop = this;
						this._.parentDialog = null;
						o$$0(this._.editor);
					} else {
						this._.parentDialog = CKEDITOR.dialog._.currentTop;
						this._.parentDialog.getElement().getFirst().$.style.zIndex -= Math.floor(this._.editor.config.baseFloatZIndex / 2);
						CKEDITOR.dialog._.currentTop = this;
					}
					a$$0.on("keydown", w$$0);
					a$$0.on("keyup", D);
					this._.hasFocus = false;
					var c;
					for (c in b.contents) {
						if (b.contents[c]) {
							a$$0 = b.contents[c];
							var d = this._.tabs[a$$0.id];
							var f = a$$0.requiredContent;
							var e = 0;
							if (d) {
								var h;
								for (h in this._.contents[a$$0.id]) {
									var g = this._.contents[a$$0.id][h];
									if (!(g.type == "hbox" || (g.type == "vbox" || !g.getInputElement()))) {
										if (g.requiredContent && !this._.editor.activeFilter.check(g.requiredContent)) {
											g.disable();
										} else {
											g.enable();
											e++;
										}
									}
								}
								if (!e || f && !this._.editor.activeFilter.check(f)) {
									d[0].addClass("cke_dialog_tab_disabled");
								} else {
									d[0].removeClass("cke_dialog_tab_disabled");
								}
							}
						}
					}
					CKEDITOR.tools.setTimeout(function() {
						this.layout();
						j$$0(this);
						this.parts.dialog.setStyle("visibility", "");
						this.fireOnce("load", {});
						CKEDITOR.ui.fire("ready", this);
						this.fire("show", {});
						this._.editor.fire("dialogShow", this);
						if (!this._.parentDialog) {
							this._.editor.focusManager.lock();
						}
						this.foreach(function(a) {
							if (a.setInitValue) {
								a.setInitValue();
							}
						});
					}, 100, this);
				},
				layout: function() {
					var a = this.parts.dialog;
					var b = this.getSize();
					var c = CKEDITOR.document.getWindow().getViewPaneSize();
					var d = (c.width - b.width) / 2;
					var f = (c.height - b.height) / 2;
					if (!CKEDITOR.env.ie6Compat) {
						if (b.height + (f > 0 ? f : 0) > c.height || b.width + (d > 0 ? d : 0) > c.width) {
							a.setStyle("position", "absolute");
						} else {
							a.setStyle("position", "fixed");
						}
					}
					this.move(this._.moved ? this._.position.x : d, this._.moved ? this._.position.y : f);
				},
				foreach: function(a) {
					var b;
					for (b in this._.contents) {
						var c;
						for (c in this._.contents[b]) {
							a.call(this, this._.contents[b][c]);
						}
					}
					return this;
				},
				reset: function() {
					var a$$0 = function(a) {
						if (a.reset) {
							a.reset(1);
						}
					};
					return function() {
						this.foreach(a$$0);
						return this;
					};
				}(),
				setupContent: function() {
					var a = arguments;
					this.foreach(function(b) {
						if (b.setup) {
							b.setup.apply(b, a);
						}
					});
				},
				commitContent: function() {
					var a = arguments;
					this.foreach(function(b) {
						if (CKEDITOR.env.ie) {
							if (this._.currentFocusIndex == b.focusIndex) {
								b.getInputElement().$.blur();
							}
						}
						if (b.commit) {
							b.commit.apply(b, a);
						}
					});
				},
				hide: function() {
					if (this.parts.dialog.isVisible()) {
						this.fire("hide", {});
						this._.editor.fire("dialogHide", this);
						this.selectPage(this._.tabIdList[0]);
						var a$$0 = this._.element;
						a$$0.setStyle("display", "none");
						this.parts.dialog.setStyle("visibility", "hidden");
						I$$0(this);
						for (; CKEDITOR.dialog._.currentTop != this;) {
							CKEDITOR.dialog._.currentTop.hide();
						}
						if (this._.parentDialog) {
							var b = this._.parentDialog.getElement().getFirst();
							b.setStyle("z-index", parseInt(b.$.style.zIndex, 10) + Math.floor(this._.editor.config.baseFloatZIndex / 2));
						} else {
							r$$0(this._.editor);
						}
						if (CKEDITOR.dialog._.currentTop = this._.parentDialog) {
							CKEDITOR.dialog._.currentZIndex = CKEDITOR.dialog._.currentZIndex - 10;
						} else {
							CKEDITOR.dialog._.currentZIndex = null;
							a$$0.removeListener("keydown", w$$0);
							a$$0.removeListener("keyup", D);
							var c = this._.editor;
							c.focus();
							setTimeout(function() {
								c.focusManager.unlock();
							}, 0);
						}
						delete this._.parentDialog;
						this.foreach(function(a) {
							if (a.resetInitValue) {
								a.resetInitValue();
							}
						});
					}
				},
				addPage: function(a) {
					if (!a.requiredContent || this._.editor.filter.check(a.requiredContent)) {
						var b = [];
						var c = a.label ? ' title="' + CKEDITOR.tools.htmlEncode(a.label) + '"' : "";
						var d = CKEDITOR.dialog._.uiElementBuilders.vbox.build(this, {
							type: "vbox",
							className: "cke_dialog_page_contents",
							children: a.elements,
							expand: !!a.expand,
							padding: a.padding,
							style: a.style || "width: 100%;"
						}, b);
						var f = this._.contents[a.id] = {};
						var e = d.getChild();
						var h = 0;
						for (; d = e.shift();) {
							if (!d.notAllowed) {
								if (d.type != "hbox" && d.type != "vbox") {
									h++;
								}
							}
							f[d.id] = d;
							if (typeof d.getChild == "function") {
								e.push.apply(e, d.getChild());
							}
						}
						if (!h) {
							a.hidden = true;
						}
						b = CKEDITOR.dom.element.createFromHtml(b.join(""));
						b.setAttribute("role", "tabpanel");
						d = CKEDITOR.env;
						f = "cke_" + a.id + "_" + CKEDITOR.tools.getNextNumber();
						c = CKEDITOR.dom.element.createFromHtml(['<a class="cke_dialog_tab"', this._.pageCount > 0 ? " cke_last" : "cke_first", c, a.hidden ? ' style="display:none"' : "", ' id="', f, '"', d.gecko && !d.hc ? "" : ' href="javascript:void(0)"', ' tabIndex="-1" hidefocus="true" role="tab">', a.label, "</a>"].join(""));
						b.setAttribute("aria-labelledby", f);
						this._.tabs[a.id] = [c, b];
						this._.tabIdList.push(a.id);
						if (!a.hidden) {
							this._.pageCount++;
						}
						this._.lastTab = c;
						this.updateStyle();
						b.setAttribute("name", a.id);
						b.appendTo(this.parts.contents);
						c.unselectable();
						this.parts.tabs.append(c);
						if (a.accessKey) {
							A$$0(this, this, "CTRL+" + a.accessKey, C$$0, K);
							this._.accessKeyMap["CTRL+" + a.accessKey] = a.id;
						}
					}
				},
				selectPage: function(a) {
					if (this._.currentTabId != a && (!this._.tabs[a][0].hasClass("cke_dialog_tab_disabled") && this.fire("selectPage", {
						page: a,
						currentPage: this._.currentTabId
					}) !== false)) {
						var c;
						for (c in this._.tabs) {
							var d = this._.tabs[c][0];
							var f = this._.tabs[c][1];
							if (c != a) {
								d.removeClass("cke_dialog_tab_selected");
								f.hide();
							}
							f.setAttribute("aria-hidden", c != a);
						}
						var e = this._.tabs[a];
						e[0].addClass("cke_dialog_tab_selected");
						if (CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat) {
							b$$2(e[1]);
							e[1].show();
							setTimeout(function() {
								b$$2(e[1], 1);
							}, 0);
						} else {
							e[1].show();
						}
						this._.currentTabId = a;
						this._.currentTabIndex = CKEDITOR.tools.indexOf(this._.tabIdList, a);
					}
				},
				updateStyle: function() {
					this.parts.dialog[(this._.pageCount === 1 ? "add" : "remove") + "Class"]("cke_single_page");
				},
				hidePage: function(b) {
					var c = this._.tabs[b] && this._.tabs[b][0];
					if (c && (this._.pageCount != 1 && c.isVisible())) {
						if (b == this._.currentTabId) {
							this.selectPage(a$$2.call(this));
						}
						c.hide();
						this._.pageCount--;
						this.updateStyle();
					}
				},
				showPage: function(a) {
					if (a = this._.tabs[a] && this._.tabs[a][0]) {
						a.show();
						this._.pageCount++;
						this.updateStyle();
					}
				},
				getElement: function() {
					return this._.element;
				},
				getName: function() {
					return this._.name;
				},
				getContentElement: function(a, b) {
					var c = this._.contents[a];
					return c && c[b];
				},
				getValueOf: function(a, b) {
					return this.getContentElement(a, b).getValue();
				},
				setValueOf: function(a, b, c) {
					return this.getContentElement(a, b).setValue(c);
				},
				getButton: function(a) {
					return this._.buttons[a];
				},
				click: function(a) {
					return this._.buttons[a].click();
				},
				disableButton: function(a) {
					return this._.buttons[a].disable();
				},
				enableButton: function(a) {
					return this._.buttons[a].enable();
				},
				getPageCount: function() {
					return this._.pageCount;
				},
				getParentEditor: function() {
					return this._.editor;
				},
				getSelectedElement: function() {
					return this.getParentEditor().getSelection().getSelectedElement();
				},
				addFocusable: function(a, b) {
					if (typeof b == "undefined") {
						b = this._.focusList.length;
						this._.focusList.push(new h$$1(this, a, b));
					} else {
						this._.focusList.splice(b, 0, new h$$1(this, a, b));
						var c = b + 1;
						for (; c < this._.focusList.length; c++) {
							this._.focusList[c].focusIndex++;
						}
					}
				}
			};
			CKEDITOR.tools.extend(CKEDITOR.dialog, {
				add: function(a, b) {
					if (!this._.dialogDefinitions[a] || typeof b == "function") {
						this._.dialogDefinitions[a] = b;
					}
				},
				exists: function(a) {
					return !!this._.dialogDefinitions[a];
				},
				getCurrent: function() {
					return CKEDITOR.dialog._.currentTop;
				},
				isTabEnabled: function(a, b, c) {
					a = a.config.removeDialogTabs;
					return !(a && a.match(RegExp("(?:^|;)" + b + ":" + c + "(?:$|;)", "i")));
				},
				okButton: function() {
					var a$$1 = function(a$$0, b) {
						b = b || {};
						return CKEDITOR.tools.extend({
							id: "ok",
							type: "button",
							label: a$$0.lang.common.ok,
							"class": "cke_dialog_ui_button_ok",
							onClick: function(a) {
								a = a.data.dialog;
								if (a.fire("ok", {
									hide: true
								}).hide !== false) {
									a.hide();
								}
							}
						}, b, true);
					};
					a$$1.type = "button";
					a$$1.override = function(b) {
						return CKEDITOR.tools.extend(function(c) {
							return a$$1(c, b);
						}, {
							type: "button"
						}, true);
					};
					return a$$1;
				}(),
				cancelButton: function() {
					var a$$1 = function(a$$0, b) {
						b = b || {};
						return CKEDITOR.tools.extend({
							id: "cancel",
							type: "button",
							label: a$$0.lang.common.cancel,
							"class": "cke_dialog_ui_button_cancel",
							onClick: function(a) {
								a = a.data.dialog;
								if (a.fire("cancel", {
									hide: true
								}).hide !== false) {
									a.hide();
								}
							}
						}, b, true);
					};
					a$$1.type = "button";
					a$$1.override = function(b) {
						return CKEDITOR.tools.extend(function(c) {
							return a$$1(c, b);
						}, {
							type: "button"
						}, true);
					};
					return a$$1;
				}(),
				addUIElement: function(a, b) {
					this._.uiElementBuilders[a] = b;
				}
			});
			CKEDITOR.dialog._ = {
				uiElementBuilders: {},
				dialogDefinitions: {},
				currentTop: null,
				currentZIndex: null
			};
			CKEDITOR.event.implementOn(CKEDITOR.dialog);
			CKEDITOR.event.implementOn(CKEDITOR.dialog.prototype);
			var s$$0 = {
				resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
				minWidth: 600,
				minHeight: 400,
				buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton]
			};
			var t$$0 = function(a, b, c) {
				var d = 0;
				var f;
				for (; f = a[d]; d++) {
					if (f.id == b) {
						return f;
					}
					if (c && f[c]) {
						if (f = t$$0(f[c], b, c)) {
							return f;
						}
					}
				}
				return null;
			};
			var p$$0 = function(a, b, c, d, f) {
				if (c) {
					var e = 0;
					var h;
					for (; h = a[e]; e++) {
						if (h.id == c) {
							a.splice(e, 0, b);
							return b;
						}
						if (d && h[d]) {
							if (h = p$$0(h[d], b, c, d, true)) {
								return h;
							}
						}
					}
					if (f) {
						return null;
					}
				}
				a.push(b);
				return b;
			};
			var x$$0 = function(a, b, c) {
				var d = 0;
				var f;
				for (; f = a[d]; d++) {
					if (f.id == b) {
						return a.splice(d, 1);
					}
					if (c && f[c]) {
						if (f = x$$0(f[c], b, c)) {
							return f;
						}
					}
				}
				return null;
			};
			var q = function(a, b) {
				this.dialog = a;
				var c = b.contents;
				var d = 0;
				var f;
				for (; f = c[d]; d++) {
					c[d] = f && new g$$0(a, f);
				}
				CKEDITOR.tools.extend(this, b);
			};
			q.prototype = {
				getContents: function(a) {
					return t$$0(this.contents, a);
				},
				getButton: function(a) {
					return t$$0(this.buttons, a);
				},
				addContents: function(a, b) {
					return p$$0(this.contents, a, b);
				},
				addButton: function(a, b) {
					return p$$0(this.buttons, a, b);
				},
				removeContents: function(a) {
					x$$0(this.contents, a);
				},
				removeButton: function(a) {
					x$$0(this.buttons, a);
				}
			};
			g$$0.prototype = {
				get: function(a) {
					return t$$0(this.elements, a, "children");
				},
				add: function(a, b) {
					return p$$0(this.elements, a, b, "children");
				},
				remove: function(a) {
					x$$0(this.elements, a, "children");
				}
			};
			var u$$0;
			var B = {};
			var v;
			var z = {};
			var w$$0 = function(a) {
				var b = a.data.$.ctrlKey || a.data.$.metaKey;
				var c = a.data.$.altKey;
				var d = a.data.$.shiftKey;
				var f = String.fromCharCode(a.data.$.keyCode);
				if ((b = z[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (d ? "SHIFT+" : "") + f]) && b.length) {
					b = b[b.length - 1];
					if (b.keydown) {
						b.keydown.call(b.uiElement, b.dialog, b.key);
					}
					a.data.preventDefault();
				}
			};
			var D = function(a) {
				var b = a.data.$.ctrlKey || a.data.$.metaKey;
				var c = a.data.$.altKey;
				var d = a.data.$.shiftKey;
				var f = String.fromCharCode(a.data.$.keyCode);
				if ((b = z[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (d ? "SHIFT+" : "") + f]) && b.length) {
					b = b[b.length - 1];
					if (b.keyup) {
						b.keyup.call(b.uiElement, b.dialog, b.key);
						a.data.preventDefault();
					}
				}
			};
			var A$$0 = function(a, b, c, d, f) {
				(z[c] || (z[c] = [])).push({
					uiElement: a,
					dialog: b,
					key: c,
					keyup: f || a.accessKeyUp,
					keydown: d || a.accessKeyDown
				});
			};
			var I$$0 = function(a) {
				var b;
				for (b in z) {
					var c = z[b];
					var d = c.length - 1;
					for (; d >= 0; d--) {
						if (c[d].dialog == a || c[d].uiElement == a) {
							c.splice(d, 1);
						}
					}
					if (c.length === 0) {
						delete z[b];
					}
				}
			};
			var K = function(a, b) {
				if (a._.accessKeyMap[b]) {
					a.selectPage(a._.accessKeyMap[b]);
				}
			};
			var C$$0 = function() {};
			(function() {
				CKEDITOR.ui.dialog = {
					uiElement: function(a$$0, b$$0, c$$0, d, f, e, h) {
						if (!(arguments.length < 4)) {
							var g = (d.call ? d(b$$0) : d) || "div";
							var i = ["<", g, " "];
							var j = (f && f.call ? f(b$$0) : f) || {};
							var k = (e && e.call ? e(b$$0) : e) || {};
							var n = (h && h.call ? h.call(this, a$$0, b$$0) : h) || "";
							var l = this.domId = k.id || CKEDITOR.tools.getNextId() + "_uiElement";
							this.id = b$$0.id;
							if (b$$0.requiredContent && !a$$0.getParentEditor().filter.check(b$$0.requiredContent)) {
								j.display = "none";
								this.notAllowed = true;
							}
							k.id = l;
							var m = {};
							if (b$$0.type) {
								m["cke_dialog_ui_" + b$$0.type] = 1;
							}
							if (b$$0.className) {
								m[b$$0.className] = 1;
							}
							if (b$$0.disabled) {
								m.cke_disabled = 1;
							}
							var p = k["class"] && k["class"].split ? k["class"].split(" ") : [];
							l = 0;
							for (; l < p.length; l++) {
								if (p[l]) {
									m[p[l]] = 1;
								}
							}
							p = [];
							for (l in m) {
								p.push(l);
							}
							k["class"] = p.join(" ");
							if (b$$0.title) {
								k.title = b$$0.title;
							}
							m = (b$$0.style || "").split(";");
							if (b$$0.align) {
								p = b$$0.align;
								j["margin-left"] = p == "left" ? 0 : "auto";
								j["margin-right"] = p == "right" ? 0 : "auto";
							}
							for (l in j) {
								m.push(l + ":" + j[l]);
							}
							if (b$$0.hidden) {
								m.push("display:none");
							}
							l = m.length - 1;
							for (; l >= 0; l--) {
								if (m[l] === "") {
									m.splice(l, 1);
								}
							}
							if (m.length > 0) {
								k.style = (k.style ? k.style + "; " : "") + m.join("; ");
							}
							for (l in k) {
								i.push(l + '="' + CKEDITOR.tools.htmlEncode(k[l]) + '" ');
							}
							i.push(">", n, "</", g, ">");
							c$$0.push(i.join(""));
							(this._ || (this._ = {})).dialog = a$$0;
							if (typeof b$$0.isChanged == "boolean") {
								this.isChanged = function() {
									return b$$0.isChanged;
								};
							}
							if (typeof b$$0.isChanged == "function") {
								this.isChanged = b$$0.isChanged;
							}
							if (typeof b$$0.setValue == "function") {
								this.setValue = CKEDITOR.tools.override(this.setValue, function(a) {
									return function(c) {
										a.call(this, b$$0.setValue.call(this, c));
									};
								});
							}
							if (typeof b$$0.getValue == "function") {
								this.getValue = CKEDITOR.tools.override(this.getValue, function(a) {
									return function() {
										return b$$0.getValue.call(this, a.call(this));
									};
								});
							}
							CKEDITOR.event.implementOn(this);
							this.registerEvents(b$$0);
							if (this.accessKeyUp) {
								if (this.accessKeyDown && b$$0.accessKey) {
									A$$0(this, a$$0, "CTRL+" + b$$0.accessKey);
								}
							}
							var o = this;
							a$$0.on("load", function() {
								var b = o.getInputElement();
								if (b) {
									var c = o.type in {
										checkbox: 1,
										ratio: 1
									} && (CKEDITOR.env.ie && CKEDITOR.env.version < 8) ? "cke_dialog_ui_focused" : "";
									b.on("focus", function() {
										a$$0._.tabBarMode = false;
										a$$0._.hasFocus = true;
										o.fire("focus");
										if (c) {
											this.addClass(c);
										}
									});
									b.on("blur", function() {
										o.fire("blur");
										if (c) {
											this.removeClass(c);
										}
									});
								}
							});
							CKEDITOR.tools.extend(this, b$$0);
							if (this.keyboardFocusable) {
								this.tabIndex = b$$0.tabIndex || 0;
								this.focusIndex = a$$0._.focusList.push(this) - 1;
								this.on("focus", function() {
									a$$0._.currentFocusIndex = o.focusIndex;
								});
							}
						}
					},
					hbox: function(a$$0, b$$0, c, d$$0, f) {
						if (!(arguments.length < 4)) {
							if (!this._) {
								this._ = {};
							}
							var e = this._.children = b$$0;
							var h = f && f.widths || null;
							var g = f && f.height || null;
							var i;
							var j = {
								role: "presentation"
							};
							if (f) {
								if (f.align) {
									j.align = f.align;
								}
							}
							CKEDITOR.ui.dialog.uiElement.call(this, a$$0, f || {
								type: "hbox"
							}, d$$0, "table", {}, j, function() {
								var a = ['<tbody><tr class="cke_dialog_ui_hbox">'];
								i = 0;
								for (; i < c.length; i++) {
									var b = "cke_dialog_ui_hbox_child";
									var d = [];
									if (i === 0) {
										b = "cke_dialog_ui_hbox_first";
									}
									if (i == c.length - 1) {
										b = "cke_dialog_ui_hbox_last";
									}
									a.push('<td class="', b, '" role="presentation" ');
									if (h) {
										if (h[i]) {
											d.push("width:" + l$$0(h[i]));
										}
									} else {
										d.push("width:" + Math.floor(100 / c.length) + "%");
									}
									if (g) {
										d.push("height:" + l$$0(g));
									}
									if (f) {
										if (f.padding != void 0) {
											d.push("padding:" + l$$0(f.padding));
										}
									}
									if (CKEDITOR.env.ie) {
										if (CKEDITOR.env.quirks && e[i].align) {
											d.push("text-align:" + e[i].align);
										}
									}
									if (d.length > 0) {
										a.push('style="' + d.join("; ") + '" ');
									}
									a.push(">", c[i], "</td>");
								}
								a.push("</tr></tbody>");
								return a.join("");
							});
						}
					},
					vbox: function(a, b$$0, c, d$$0, f) {
						if (!(arguments.length < 3)) {
							if (!this._) {
								this._ = {};
							}
							var e = this._.children = b$$0;
							var h = f && f.width || null;
							var g = f && f.heights || null;
							CKEDITOR.ui.dialog.uiElement.call(this, a, f || {
								type: "vbox"
							}, d$$0, "div", null, {
								role: "presentation"
							}, function() {
								var b = ['<table role="presentation" cellspacing="0" border="0" '];
								b.push('style="');
								if (f) {
									if (f.expand) {
										b.push("height:100%;");
									}
								}
								b.push("width:" + l$$0(h || "100%"), ";");
								if (CKEDITOR.env.webkit) {
									b.push("float:none;");
								}
								b.push('"');
								b.push('align="', CKEDITOR.tools.htmlEncode(f && f.align || (a.getParentEditor().lang.dir == "ltr" ? "left" : "right")), '" ');
								b.push("><tbody>");
								var d = 0;
								for (; d < c.length; d++) {
									var i = [];
									b.push('<tr><td role="presentation" ');
									if (h) {
										i.push("width:" + l$$0(h || "100%"));
									}
									if (g) {
										i.push("height:" + l$$0(g[d]));
									} else {
										if (f) {
											if (f.expand) {
												i.push("height:" + Math.floor(100 / c.length) + "%");
											}
										}
									}
									if (f) {
										if (f.padding != void 0) {
											i.push("padding:" + l$$0(f.padding));
										}
									}
									if (CKEDITOR.env.ie) {
										if (CKEDITOR.env.quirks && e[d].align) {
											i.push("text-align:" + e[d].align);
										}
									}
									if (i.length > 0) {
										b.push('style="', i.join("; "), '" ');
									}
									b.push(' class="cke_dialog_ui_vbox_child">', c[d], "</td></tr>");
								}
								b.push("</tbody></table>");
								return b.join("");
							});
						}
					}
				};
			})();
			CKEDITOR.ui.dialog.uiElement.prototype = {
				getElement: function() {
					return CKEDITOR.document.getById(this.domId);
				},
				getInputElement: function() {
					return this.getElement();
				},
				getDialog: function() {
					return this._.dialog;
				},
				setValue: function(a, b) {
					this.getInputElement().setValue(a);
					if (!b) {
						this.fire("change", {
							value: a
						});
					}
					return this;
				},
				getValue: function() {
					return this.getInputElement().getValue();
				},
				isChanged: function() {
					return false;
				},
				selectParentTab: function() {
					var a = this.getInputElement();
					for (;
						(a = a.getParent()) && a.$.className.search("cke_dialog_page_contents") == -1;) {}
					if (!a) {
						return this;
					}
					a = a.getAttribute("name");
					if (this._.dialog._.currentTabId != a) {
						this._.dialog.selectPage(a);
					}
					return this;
				},
				focus: function() {
					this.selectParentTab().getInputElement().focus();
					return this;
				},
				registerEvents: function(a$$0) {
					var b$$0 = /^on([A-Z]\w+)/;
					var c$$0;
					var d$$0 = function(a, b, c, d) {
						b.on("load", function() {
							a.getInputElement().on(c, d, a);
						});
					};
					var f;
					for (f in a$$0) {
						if (c$$0 = f.match(b$$0)) {
							if (this.eventProcessors[f]) {
								this.eventProcessors[f].call(this, this._.dialog, a$$0[f]);
							} else {
								d$$0(this, this._.dialog, c$$0[1].toLowerCase(), a$$0[f]);
							}
						}
					}
					return this;
				},
				eventProcessors: {
					onLoad: function(a, b) {
						a.on("load", b, this);
					},
					onShow: function(a, b) {
						a.on("show", b, this);
					},
					onHide: function(a, b) {
						a.on("hide", b, this);
					}
				},
				accessKeyDown: function() {
					this.focus();
				},
				accessKeyUp: function() {},
				disable: function() {
					var a = this.getElement();
					this.getInputElement().setAttribute("disabled", "true");
					a.addClass("cke_disabled");
				},
				enable: function() {
					var a = this.getElement();
					this.getInputElement().removeAttribute("disabled");
					a.removeClass("cke_disabled");
				},
				isEnabled: function() {
					return !this.getElement().hasClass("cke_disabled");
				},
				isVisible: function() {
					return this.getInputElement().isVisible();
				},
				isFocusable: function() {
					return !this.isEnabled() || !this.isVisible() ? false : true;
				}
			};
			CKEDITOR.ui.dialog.hbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
				getChild: function(a) {
					if (arguments.length < 1) {
						return this._.children.concat();
					}
					if (!a.splice) {
						a = [a];
					}
					return a.length < 2 ? this._.children[a[0]] : this._.children[a[0]] && this._.children[a[0]].getChild ? this._.children[a[0]].getChild(a.slice(1, a.length)) : null;
				}
			}, true);
			CKEDITOR.ui.dialog.vbox.prototype = new CKEDITOR.ui.dialog.hbox;
			(function() {
				var a$$0 = {
					build: function(a, b, c) {
						var d = b.children;
						var f;
						var e = [];
						var h = [];
						var g = 0;
						for (; g < d.length && (f = d[g]); g++) {
							var i = [];
							e.push(i);
							h.push(CKEDITOR.dialog._.uiElementBuilders[f.type].build(a, f, i));
						}
						return new CKEDITOR.ui.dialog[b.type](a, h, e, c, b);
					}
				};
				CKEDITOR.dialog.addUIElement("hbox", a$$0);
				CKEDITOR.dialog.addUIElement("vbox", a$$0);
			})();
			CKEDITOR.dialogCommand = function(a, b) {
				this.dialogName = a;
				CKEDITOR.tools.extend(this, b, true);
			};
			CKEDITOR.dialogCommand.prototype = {
				exec: function(a) {
					a.openDialog(this.dialogName);
				},
				canUndo: false,
				editorFocus: 1
			};
			(function() {
				var a$$1 = /^([a]|[^a])+$/;
				var b$$1 = /^\d*$/;
				var c$$0 = /^\d*(?:\.\d+)?$/;
				var d$$0 = /^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/;
				var f$$0 = /^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i;
				var e$$0 = /^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;
				CKEDITOR.VALIDATE_OR = 1;
				CKEDITOR.VALIDATE_AND = 2;
				CKEDITOR.dialog.validate = {
					functions: function() {
						var a = arguments;
						return function() {
							var b = this && this.getValue ? this.getValue() : a[0];
							var c = void 0;
							var d = CKEDITOR.VALIDATE_AND;
							var f = [];
							var e;
							e = 0;
							for (; e < a.length; e++) {
								if (typeof a[e] == "function") {
									f.push(a[e]);
								} else {
									break;
								}
							}
							if (e < a.length && typeof a[e] == "string") {
								c = a[e];
								e++;
							}
							if (e < a.length) {
								if (typeof a[e] == "number") {
									d = a[e];
								}
							}
							var h = d == CKEDITOR.VALIDATE_AND ? true : false;
							e = 0;
							for (; e < f.length; e++) {
								h = d == CKEDITOR.VALIDATE_AND ? h && f[e](b) : h || f[e](b);
							}
							return !h ? c : true;
						};
					},
					regex: function(a, b) {
						return function(c) {
							c = this && this.getValue ? this.getValue() : c;
							return !a.test(c) ? b : true;
						};
					},
					notEmpty: function(b) {
						return this.regex(a$$1, b);
					},
					integer: function(a) {
						return this.regex(b$$1, a);
					},
					number: function(a) {
						return this.regex(c$$0, a);
					},
					cssLength: function(a$$0) {
						return this.functions(function(a) {
							return f$$0.test(CKEDITOR.tools.trim(a));
						}, a$$0);
					},
					htmlLength: function(a$$0) {
						return this.functions(function(a) {
							return d$$0.test(CKEDITOR.tools.trim(a));
						}, a$$0);
					},
					inlineStyle: function(a$$0) {
						return this.functions(function(a) {
							return e$$0.test(CKEDITOR.tools.trim(a));
						}, a$$0);
					},
					equals: function(a, b$$0) {
						return this.functions(function(b) {
							return b == a;
						}, b$$0);
					},
					notEqual: function(a, b$$0) {
						return this.functions(function(b) {
							return b != a;
						}, b$$0);
					}
				};
				CKEDITOR.on("instanceDestroyed", function(a) {
					if (CKEDITOR.tools.isEmpty(CKEDITOR.instances)) {
						var b;
						for (; b = CKEDITOR.dialog._.currentTop;) {
							b.hide();
						}
						var c;
						for (c in B) {
							B[c].remove();
						}
						B = {};
					}
					a = a.editor._.storedDialogs;
					var d;
					for (d in a) {
						a[d].destroy();
					}
				});
			})();
			CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
				openDialog: function(a, b) {
					var c = null;
					var d = CKEDITOR.dialog._.dialogDefinitions[a];
					if (CKEDITOR.dialog._.currentTop === null) {
						o$$0(this);
					}
					if (typeof d == "function") {
						c = this._.storedDialogs || (this._.storedDialogs = {});
						c = c[a] || (c[a] = new CKEDITOR.dialog(this, a));
						if (b) {
							b.call(c, c);
						}
						c.show();
					} else {
						if (d == "failed") {
							r$$0(this);
							throw Error('[CKEDITOR.dialog.openDialog] Dialog "' + a + '" failed when loading definition.');
						}
						if (typeof d == "string") {
							CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(d), function() {
								if (typeof CKEDITOR.dialog._.dialogDefinitions[a] != "function") {
									CKEDITOR.dialog._.dialogDefinitions[a] = "failed";
								}
								this.openDialog(a, b);
							}, this, 0, 1);
						}
					}
					CKEDITOR.skin.loadPart("dialog");
					return c;
				}
			});
		})();
		CKEDITOR.plugins.add("dialog", {
			requires: "dialogui",
			init: function(a) {
				a.on("doubleclick", function(e) {
					if (e.data.dialog) {
						a.openDialog(e.data.dialog);
					}
				}, null, null, 999);
			}
		});
		CKEDITOR.plugins.colordialog = {
			requires: "dialog",
			init: function(a$$1) {
				var e = new CKEDITOR.dialogCommand("colordialog");
				e.editorFocus = false;
				a$$1.addCommand("colordialog", e);
				CKEDITOR.dialog.add("colordialog", this.path + "dialogs/colordialog.js");
				a$$1.getColorFromDialog = function(b$$0, d) {
					var f = function(a) {
						this.removeListener("ok", f);
						this.removeListener("cancel", f);
						a = a.name == "ok" ? this.getValueOf("picker", "selectedColor") : null;
						b$$0.call(d, a);
					};
					var c = function(a) {
						a.on("ok", f);
						a.on("cancel", f);
					};
					a$$1.execCommand("colordialog");
					if (a$$1._.storedDialogs && a$$1._.storedDialogs.colordialog) {
						c(a$$1._.storedDialogs.colordialog);
					} else {
						CKEDITOR.on("dialogDefinition", function(a$$0) {
							if (a$$0.data.name == "colordialog") {
								var b = a$$0.data.definition;
								a$$0.removeListener();
								b.onLoad = CKEDITOR.tools.override(b.onLoad, function(a) {
									return function() {
										c(this);
										b.onLoad = a;
										if (typeof a == "function") {
											a.call(this);
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
			function a$$1(a$$0) {
				function b$$1() {
					var c = a$$0.editable();
					c.on(z, function(a) {
						if (!CKEDITOR.env.ie || !u) {
							p(a);
						}
					});
					if (CKEDITOR.env.ie) {
						c.on("paste", function(b) {
							if (!B) {
								f$$0();
								b.data.preventDefault();
								p(b);
								if (!o("paste")) {
									a$$0.openDialog("paste");
								}
							}
						});
					}
					if (CKEDITOR.env.ie) {
						c.on("contextmenu", e$$0, null, null, 0);
						c.on("beforepaste", function(a) {
							if (a.data) {
								if (!a.data.$.ctrlKey) {
									e$$0();
								}
							}
						}, null, null, 0);
					}
					c.on("beforecut", function() {
						if (!u) {
							l$$0(a$$0);
						}
					});
					var d;
					c.attachListener(CKEDITOR.env.ie ? c : a$$0.document.getDocumentElement(), "mouseup", function() {
						d = setTimeout(function() {
							x();
						}, 0);
					});
					a$$0.on("destroy", function() {
						clearTimeout(d);
					});
					c.on("keyup", x);
				}

				function c$$1(b$$0) {
					return {
						type: b$$0,
						canUndo: b$$0 == "cut",
						startDisabled: true,
						exec: function() {
							if (this.type == "cut") {
								l$$0();
							}
							var b;
							var c = this.type;
							if (CKEDITOR.env.ie) {
								b = o(c);
							} else {
								try {
									b = a$$0.document.$.execCommand(c, false, null);
								} catch (d) {
									b = false;
								}
							}
							if (!b) {
								alert(a$$0.lang.clipboard[this.type + "Error"]);
							}
							return b;
						}
					};
				}

				function d$$0() {
					return {
						canUndo: false,
						async: true,
						exec: function(a, b$$0) {
							var c$$0 = function(b, c) {
								if (b) {
									r(b.type, b.dataValue, !!c);
								}
								a.fire("afterCommandExec", {
									name: "paste",
									command: d,
									returnValue: !!b
								});
							};
							var d = this;
							if (typeof b$$0 == "string") {
								c$$0({
									type: "auto",
									dataValue: b$$0
								}, 1);
							} else {
								a.getClipboardData(c$$0);
							}
						}
					};
				}

				function f$$0() {
					B = 1;
					setTimeout(function() {
						B = 0;
					}, 100);
				}

				function e$$0() {
					u = 1;
					setTimeout(function() {
						u = 0;
					}, 10);
				}

				function o(b) {
					var c = a$$0.document;
					var d = c.getBody();
					var f = false;
					var e = function() {
						f = true;
					};
					d.on(b, e);
					(CKEDITOR.env.version > 7 ? c.$ : c.$.selection.createRange()).execCommand(b);
					d.removeListener(b, e);
					return f;
				}

				function r(b, c, d) {
					b = {
						type: b
					};
					if (d && a$$0.fire("beforePaste", b) === false || !c) {
						return false;
					}
					b.dataValue = c;
					return a$$0.fire("paste", b);
				}

				function l$$0() {
					if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
						var b = a$$0.getSelection();
						var c;
						var d;
						var f;
						if (b.getType() == CKEDITOR.SELECTION_ELEMENT && (c = b.getSelectedElement())) {
							d = b.getRanges()[0];
							f = a$$0.document.createText("");
							f.insertBefore(c);
							d.setStartBefore(f);
							d.setEndAfter(c);
							b.selectRanges([d]);
							setTimeout(function() {
								if (c.getParent()) {
									f.remove();
									b.selectElement(c);
								}
							}, 0);
						}
					}
				}

				function m$$0(b$$0, c) {
					var d = a$$0.document;
					var f = a$$0.editable();
					var e = function(a) {
						a.cancel();
					};
					var g;
					if (!d.getById("cke_pastebin")) {
						var i = a$$0.getSelection();
						var j = i.createBookmarks();
						var k = new CKEDITOR.dom.element((CKEDITOR.env.webkit || f.is("body")) && !CKEDITOR.env.ie ? "body" : "div", d);
						k.setAttributes({
							id: "cke_pastebin",
							"data-cke-temp": "1"
						});
						var l = 0;
						d = d.getWindow();
						if (CKEDITOR.env.webkit) {
							f.append(k);
							k.addClass("cke_editable");
							if (!f.is("body")) {
								l = f.getComputedStyle("position") != "static" ? f : CKEDITOR.dom.element.get(f.$.offsetParent);
								l = l.getDocumentPosition().y;
							}
						} else {
							f.getAscendant(CKEDITOR.env.ie ? "body" : "html", 1).append(k);
						}
						k.setStyles({
							position: "absolute",
							top: d.getScrollPosition().y - l + 10 + "px",
							width: "1px",
							height: Math.max(1, d.getViewPaneSize().height - 20) + "px",
							overflow: "hidden",
							margin: 0,
							padding: 0
						});
						if (l = k.getParent().isReadOnly()) {
							k.setOpacity(0);
							k.setAttribute("contenteditable", true);
						} else {
							k.setStyle(a$$0.config.contentsLangDirection == "ltr" ? "left" : "right", "-1000px");
						}
						a$$0.on("selectionChange", e, null, null, 0);
						if (CKEDITOR.env.webkit || CKEDITOR.env.gecko) {
							g = f.once("blur", e, null, null, -100);
						}
						if (l) {
							k.focus();
						}
						l = new CKEDITOR.dom.range(k);
						l.selectNodeContents(k);
						var m = l.select();
						if (CKEDITOR.env.ie) {
							g = f.once("blur", function() {
								a$$0.lockSelection(m);
							});
						}
						var n = CKEDITOR.document.getWindow().getScrollPosition().y;
						setTimeout(function() {
							if (CKEDITOR.env.webkit) {
								CKEDITOR.document.getBody().$.scrollTop = n;
							}
							if (g) {
								g.removeListener();
							}
							if (CKEDITOR.env.ie) {
								f.focus();
							}
							i.selectBookmarks(j);
							k.remove();
							var b;
							if (CKEDITOR.env.webkit && ((b = k.getFirst()) && (b.is && b.hasClass("Apple-style-span")))) {
								k = b;
							}
							a$$0.removeListener("selectionChange", e);
							c(k.getHtml());
						}, 0);
					}
				}

				function s() {
					if (CKEDITOR.env.ie) {
						a$$0.focus();
						f$$0();
						var b = a$$0.focusManager;
						b.lock();
						if (a$$0.editable().fire(z) && !o("paste")) {
							b.unlock();
							return false;
						}
						b.unlock();
					} else {
						try {
							if (a$$0.editable().fire(z) && !a$$0.document.$.execCommand("Paste", false, null)) {
								throw 0;
							}
						} catch (c) {
							return false;
						}
					}
					return true;
				}

				function t(b) {
					if (a$$0.mode == "wysiwyg") {
						switch (b.data.keyCode) {
							case CKEDITOR.CTRL + 86:
								;
							case CKEDITOR.SHIFT + 45:
								b = a$$0.editable();
								f$$0();
								if (!CKEDITOR.env.ie) {
									b.fire("beforepaste");
								}
								break;
							case CKEDITOR.CTRL + 88:
								;
							case CKEDITOR.SHIFT + 46:
								a$$0.fire("saveSnapshot");
								setTimeout(function() {
									a$$0.fire("saveSnapshot");
								}, 50);
						}
					}
				}

				function p(b) {
					var c = {
						type: "auto"
					};
					var d = a$$0.fire("beforePaste", c);
					m$$0(b, function(a) {
						a = a.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, "");
						if (d) {
							r(c.type, a, 0, 1);
						}
					});
				}

				function x() {
					if (a$$0.mode == "wysiwyg") {
						var b = q("paste");
						a$$0.getCommand("cut").setState(q("cut"));
						a$$0.getCommand("copy").setState(q("copy"));
						a$$0.getCommand("paste").setState(b);
						a$$0.fire("pasteState", b);
					}
				}

				function q(b) {
					if (v && b in {
						paste: 1,
						cut: 1
					}) {
						return CKEDITOR.TRISTATE_DISABLED;
					}
					if (b == "paste") {
						return CKEDITOR.TRISTATE_OFF;
					}
					b = a$$0.getSelection();
					var c = b.getRanges();
					return b.getType() == CKEDITOR.SELECTION_NONE || c.length == 1 && c[0].collapsed ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF;
				}
				var u = 0;
				var B = 0;
				var v = 0;
				var z = CKEDITOR.env.ie ? "beforepaste" : "paste";
				(function() {
					a$$0.on("key", t);
					a$$0.on("contentDom", b$$1);
					a$$0.on("selectionChange", function(a) {
						v = a.data.selection.getRanges()[0].checkReadOnly();
						x();
					});
					if (a$$0.contextMenu) {
						a$$0.contextMenu.addListener(function(a, b) {
							v = b.getRanges()[0].checkReadOnly();
							return {
								cut: q("cut"),
								copy: q("copy"),
								paste: q("paste")
							};
						});
					}
				})();
				(function() {
					function b(c, d, f, e, g) {
						var i = a$$0.lang.clipboard[d];
						a$$0.addCommand(d, f);
						if (a$$0.ui.addButton) {
							a$$0.ui.addButton(c, {
								label: i,
								command: d,
								toolbar: "clipboard," + e
							});
						}
						if (a$$0.addMenuItems) {
							a$$0.addMenuItem(d, {
								label: i,
								command: d,
								group: "clipboard",
								order: g
							});
						}
					}
					b("Cut", "cut", c$$1("cut"), 10, 1);
					b("Copy", "copy", c$$1("copy"), 20, 4);
					b("Paste", "paste", d$$0(), 30, 8);
				})();
				a$$0.getClipboardData = function(b, c) {
					function d(a) {
						a.removeListener();
						a.cancel();
						c(a.data);
					}

					function f(a) {
						a.removeListener();
						a.cancel();
						j = true;
						c({
							type: i,
							dataValue: a.data
						});
					}

					function e() {
						this.customTitle = b && b.title;
					}
					var g = false;
					var i = "auto";
					var j = false;
					if (!c) {
						c = b;
						b = null;
					}
					a$$0.on("paste", d, null, null, 0);
					a$$0.on("beforePaste", function(a) {
						a.removeListener();
						g = true;
						i = a.data.type;
					}, null, null, 1E3);
					if (s() === false) {
						a$$0.removeListener("paste", d);
						if (g && a$$0.fire("pasteDialog", e)) {
							a$$0.on("pasteDialogCommit", f);
							a$$0.on("dialogHide", function(a) {
								a.removeListener();
								a.data.removeListener("pasteDialogCommit", f);
								setTimeout(function() {
									if (!j) {
										c(null);
									}
								}, 10);
							});
						} else {
							c(null);
						}
					}
				};
			}

			function e$$1(a) {
				if (CKEDITOR.env.webkit) {
					if (!a.match(/^[^<]*$/g) && !a.match(/^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi)) {
						return "html";
					}
				} else {
					if (CKEDITOR.env.ie) {
						if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi) && !a.match(/^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi)) {
							return "html";
						}
					} else {
						if (CKEDITOR.env.gecko) {
							if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi)) {
								return "html";
							}
						} else {
							return "html";
						}
					}
				}
				return "htmlifiedtext";
			}

			function b$$2(a$$0, b) {
				function d(a) {
					return CKEDITOR.tools.repeat("</p><p>", ~~(a / 2)) + (a % 2 == 1 ? "<br>" : "");
				}
				b = b.replace(/\s+/g, " ").replace(/> +</g, "><").replace(/<br ?\/>/gi, "<br>");
				b = b.replace(/<\/?[A-Z]+>/g, function(a) {
					return a.toLowerCase();
				});
				if (b.match(/^[^<]$/)) {
					return b;
				}
				if (CKEDITOR.env.webkit && b.indexOf("<div>") > -1) {
					b = b.replace(/^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g, "<br>").replace(/^(<div>(<br>|)<\/div>){2}(?!$)/g, "<div></div>");
					if (b.match(/<div>(<br>|)<\/div>/)) {
						b = "<p>" + b.replace(/(<div>(<br>|)<\/div>)+/g, function(a) {
							return d(a.split("</div><div>").length + 1);
						}) + "</p>";
					}
					b = b.replace(/<\/div><div>/g, "<br>");
					b = b.replace(/<\/?div>/g, "");
				}
				if (CKEDITOR.env.gecko && a$$0.enterMode != CKEDITOR.ENTER_BR) {
					if (CKEDITOR.env.gecko) {
						b = b.replace(/^<br><br>$/, "<br>");
					}
					if (b.indexOf("<br><br>") > -1) {
						b = "<p>" + b.replace(/(<br>){2,}/g, function(a) {
							return d(a.length / 4);
						}) + "</p>";
					}
				}
				return c$$2(a$$0, b);
			}

			function d$$1() {
				var a$$0 = new CKEDITOR.htmlParser.filter;
				var b$$0 = {
					blockquote: 1,
					dl: 1,
					fieldset: 1,
					h1: 1,
					h2: 1,
					h3: 1,
					h4: 1,
					h5: 1,
					h6: 1,
					ol: 1,
					p: 1,
					table: 1,
					ul: 1
				};
				var c$$0 = CKEDITOR.tools.extend({
					br: 0
				}, CKEDITOR.dtd.$inline);
				var d = {
					p: 1,
					br: 1,
					"cke:br": 1
				};
				var f = CKEDITOR.dtd;
				var e = CKEDITOR.tools.extend({
					area: 1,
					basefont: 1,
					embed: 1,
					iframe: 1,
					map: 1,
					object: 1,
					param: 1
				}, CKEDITOR.dtd.$nonBodyContent, CKEDITOR.dtd.$cdata);
				var o$$0 = function(a) {
					delete a.name;
					a.add(new CKEDITOR.htmlParser.text(" "));
				};
				var r = function(a) {
					var b = a;
					var c;
					for (;
						(b = b.next) && (b.name && b.name.match(/^h\d$/));) {
						c = new CKEDITOR.htmlParser.element("cke:br");
						c.isEmpty = true;
						a.add(c);
						for (; c = b.children.shift();) {
							a.add(c);
						}
					}
				};
				a$$0.addRules({
					elements: {
						h1: r,
						h2: r,
						h3: r,
						h4: r,
						h5: r,
						h6: r,
						img: function(a) {
							a = CKEDITOR.tools.trim(a.attributes.alt || "");
							var b = " ";
							if (a) {
								if (!a.match(/(^http|\.(jpe?g|gif|png))/i)) {
									b = " [" + a + "] ";
								}
							}
							return new CKEDITOR.htmlParser.text(b);
						},
						td: o$$0,
						th: o$$0,
						$: function(a) {
							var h = a.name;
							var o;
							if (e[h]) {
								return false;
							}
							a.attributes = {};
							if (h == "br") {
								return a;
							}
							if (b$$0[h]) {
								a.name = "p";
							} else {
								if (c$$0[h]) {
									delete a.name;
								} else {
									if (f[h]) {
										o = new CKEDITOR.htmlParser.element("cke:br");
										o.isEmpty = true;
										if (CKEDITOR.dtd.$empty[h]) {
											return o;
										}
										a.add(o, 0);
										o = o.clone();
										o.isEmpty = true;
										a.add(o);
										delete a.name;
									}
								}
							}
							if (!d[a.name]) {
								delete a.name;
							}
							return a;
						}
					}
				}, {
					applyToAll: true
				});
				return a$$0;
			}

			function f$$1(a$$0, b, d) {
				b = new CKEDITOR.htmlParser.fragment.fromHtml(b);
				var f = new CKEDITOR.htmlParser.basicWriter;
				b.writeHtml(f, d);
				b = f.getHtml();
				b = b.replace(/\s*(<\/?[a-z:]+ ?\/?>)\s*/g, "$1").replace(/(<cke:br \/>){2,}/g, "<cke:br />").replace(/(<cke:br \/>)(<\/?p>|<br \/>)/g, "$2").replace(/(<\/?p>|<br \/>)(<cke:br \/>)/g, "$1").replace(/<(cke:)?br( \/)?>/g, "<br>").replace(/<p><\/p>/g, "");
				var e = 0;
				b = b.replace(/<\/?p>/g, function(a) {
					if (a == "<p>") {
						if (++e > 1) {
							return "</p><p>";
						}
					} else {
						if (--e > 0) {
							return "</p><p>";
						}
					}
					return a;
				}).replace(/<p><\/p>/g, "");
				return c$$2(a$$0, b);
			}

			function c$$2(a$$0, b) {
				if (a$$0.enterMode == CKEDITOR.ENTER_BR) {
					b = b.replace(/(<\/p><p>)+/g, function(a) {
						return CKEDITOR.tools.repeat("<br>", a.length / 7 * 2);
					}).replace(/<\/?p>/g, "");
				} else {
					if (a$$0.enterMode == CKEDITOR.ENTER_DIV) {
						b = b.replace(/<(\/)?p>/g, "<$1div>");
					}
				}
				return b;
			}
			CKEDITOR.plugins.add("clipboard", {
				requires: "dialog",
				init: function(c$$0) {
					var j;
					a$$1(c$$0);
					CKEDITOR.dialog.add("paste", CKEDITOR.getUrl(this.path + "dialogs/paste.js"));
					c$$0.on("paste", function(a$$0) {
						var b$$0 = a$$0.data.dataValue;
						var c = CKEDITOR.dtd.$block;
						if (b$$0.indexOf("Apple-") > -1) {
							b$$0 = b$$0.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi, " ");
							if (a$$0.data.type != "html") {
								b$$0 = b$$0.replace(/<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi, function(a, b) {
									return b.replace(/\t/g, "&nbsp;&nbsp; &nbsp;");
								});
							}
							if (b$$0.indexOf('<br class="Apple-interchange-newline">') > -1) {
								a$$0.data.startsWithEOL = 1;
								a$$0.data.preSniffing = "html";
								b$$0 = b$$0.replace(/<br class="Apple-interchange-newline">/, "");
							}
							b$$0 = b$$0.replace(/(<[^>]+) class="Apple-[^"]*"/gi, "$1");
						}
						if (b$$0.match(/^<[^<]+cke_(editable|contents)/i)) {
							var d$$0;
							var f;
							var e = new CKEDITOR.dom.element("div");
							e.setHtml(b$$0);
							for (; e.getChildCount() == 1 && ((d$$0 = e.getFirst()) && (d$$0.type == CKEDITOR.NODE_ELEMENT && (d$$0.hasClass("cke_editable") || d$$0.hasClass("cke_contents"))));) {
								e = f = d$$0;
							}
							if (f) {
								b$$0 = f.getHtml().replace(/<br>$/i, "");
							}
						}
						if (CKEDITOR.env.ie) {
							b$$0 = b$$0.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g, function(b, d) {
								if (d.toLowerCase() in c) {
									a$$0.data.preSniffing = "html";
									return "<" + d;
								}
								return b;
							});
						} else {
							if (CKEDITOR.env.webkit) {
								b$$0 = b$$0.replace(/<\/(\w+)><div><br><\/div>$/, function(b, d) {
									if (d in c) {
										a$$0.data.endsWithEOL = 1;
										return "</" + d + ">";
									}
									return b;
								});
							} else {
								if (CKEDITOR.env.gecko) {
									b$$0 = b$$0.replace(/(\s)<br>$/, "$1");
								}
							}
						}
						a$$0.data.dataValue = b$$0;
					}, null, null, 3);
					c$$0.on("paste", function(a) {
						a = a.data;
						var i = a.type;
						var k = a.dataValue;
						var n;
						var o = c$$0.config.clipboard_defaultContentType || "html";
						n = i == "html" || a.preSniffing == "html" ? "html" : e$$1(k);
						if (n == "htmlifiedtext") {
							k = b$$2(c$$0.config, k);
						} else {
							if (i == "text") {
								if (n == "html") {
									k = f$$1(c$$0.config, k, j || (j = d$$1(c$$0)));
								}
							}
						}
						if (a.startsWithEOL) {
							k = '<br data-cke-eol="1">' + k;
						}
						if (a.endsWithEOL) {
							k = k + '<br data-cke-eol="1">';
						}
						if (i == "auto") {
							i = n == "html" || o == "html" ? "html" : "text";
						}
						a.type = i;
						a.dataValue = k;
						delete a.preSniffing;
						delete a.startsWithEOL;
						delete a.endsWithEOL;
					}, null, null, 6);
					c$$0.on("paste", function(a) {
						a = a.data;
						c$$0.insertHtml(a.dataValue, a.type);
						setTimeout(function() {
							c$$0.fire("afterPaste");
						}, 0);
					}, null, null, 1E3);
					c$$0.on("pasteDialog", function(a) {
						setTimeout(function() {
							c$$0.openDialog("paste", a.data);
						}, 0);
					});
				}
			});
		})();
		(function() {
			CKEDITOR.plugins.add("panel", {
				beforeInit: function(a) {
					a.ui.addHandler(CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler);
				}
			});
			CKEDITOR.UI_PANEL = "panel";
			CKEDITOR.ui.panel = function(a, b) {
				if (b) {
					CKEDITOR.tools.extend(this, b);
				}
				CKEDITOR.tools.extend(this, {
					className: "",
					css: []
				});
				this.id = CKEDITOR.tools.getNextId();
				this.document = a;
				this.isFramed = this.forceIFrame || this.css.length;
				this._ = {
					blocks: {}
				};
			};
			CKEDITOR.ui.panel.handler = {
				create: function(a) {
					return new CKEDITOR.ui.panel(a);
				}
			};
			var a$$1 = CKEDITOR.addTemplate("panel", '<div lang="{langCode}" id="{id}" dir={dir} class="cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style="z-index:{z-index}" role="presentation">{frame}</div>');
			var e$$0 = CKEDITOR.addTemplate("panel-frame", '<iframe id="{id}" class="cke_panel_frame" role="presentation" frameborder="0" src="{src}"></iframe>');
			var b$$0 = CKEDITOR.addTemplate("panel-frame-inner", '<!DOCTYPE html><html class="cke_panel_container {env}" dir="{dir}" lang="{langCode}"><head>{css}</head><body class="cke_{dir}" style="margin:0;padding:0" onload="{onload}"></body></html>');
			CKEDITOR.ui.panel.prototype = {
				render: function(d$$0, f) {
					this.getHolderElement = function() {
						var a$$0 = this._.holder;
						if (!a$$0) {
							if (this.isFramed) {
								a$$0 = this.document.getById(this.id + "_frame");
								var d = a$$0.getParent();
								a$$0 = a$$0.getFrameDocument();
								if (CKEDITOR.env.iOS) {
									d.setStyles({
										overflow: "scroll",
										"-webkit-overflow-scrolling": "touch"
									});
								}
								d = CKEDITOR.tools.addFunction(CKEDITOR.tools.bind(function() {
									this.isLoaded = true;
									if (this.onLoad) {
										this.onLoad();
									}
								}, this));
								a$$0.write(b$$0.output(CKEDITOR.tools.extend({
									css: CKEDITOR.tools.buildStyleHtml(this.css),
									onload: "window.parent.CKEDITOR.tools.callFunction(" + d + ");"
								}, c$$0)));
								a$$0.getWindow().$.CKEDITOR = CKEDITOR;
								a$$0.on("keydown", function(a) {
									var b = a.data.getKeystroke();
									var c = this.document.getById(this.id).getAttribute("dir");
									if (this._.onKeyDown && this._.onKeyDown(b) === false) {
										a.data.preventDefault();
									} else {
										if (b == 27 || b == (c == "rtl" ? 39 : 37)) {
											if (this.onEscape) {
												if (this.onEscape(b) === false) {
													a.data.preventDefault();
												}
											}
										}
									}
								}, this);
								a$$0 = a$$0.getBody();
								a$$0.unselectable();
								if (CKEDITOR.env.air) {
									CKEDITOR.tools.callFunction(d);
								}
							} else {
								a$$0 = this.document.getById(this.id);
							}
							this._.holder = a$$0;
						}
						return a$$0;
					};
					var c$$0 = {
						editorId: d$$0.id,
						id: this.id,
						langCode: d$$0.langCode,
						dir: d$$0.lang.dir,
						cls: this.className,
						frame: "",
						env: CKEDITOR.env.cssClass,
						"z-index": d$$0.config.baseFloatZIndex + 1
					};
					if (this.isFramed) {
						var h = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())" : "";
						c$$0.frame = e$$0.output({
							id: this.id + "_frame",
							src: h
						});
					}
					h = a$$1.output(c$$0);
					if (f) {
						f.push(h);
					}
					return h;
				},
				addBlock: function(a, b) {
					b = this._.blocks[a] = b instanceof CKEDITOR.ui.panel.block ? b : new CKEDITOR.ui.panel.block(this.getHolderElement(), b);
					if (!this._.currentBlock) {
						this.showBlock(a);
					}
					return b;
				},
				getBlock: function(a) {
					return this._.blocks[a];
				},
				showBlock: function(a) {
					a = this._.blocks[a];
					var b = this._.currentBlock;
					var c = !this.forceIFrame || CKEDITOR.env.ie ? this._.holder : this.document.getById(this.id + "_frame");
					if (b) {
						b.hide();
					}
					this._.currentBlock = a;
					CKEDITOR.fire("ariaWidget", c);
					a._.focusIndex = -1;
					this._.onKeyDown = a.onKeyDown && CKEDITOR.tools.bind(a.onKeyDown, a);
					a.show();
					return a;
				},
				destroy: function() {
					if (this.element) {
						this.element.remove();
					}
				}
			};
			CKEDITOR.ui.panel.block = CKEDITOR.tools.createClass({
				$: function(a, b) {
					this.element = a.append(a.getDocument().createElement("div", {
						attributes: {
							tabindex: -1,
							"class": "cke_panel_block"
						},
						styles: {
							display: "none"
						}
					}));
					if (b) {
						CKEDITOR.tools.extend(this, b);
					}
					this.element.setAttributes({
						role: this.attributes.role || "presentation",
						"aria-label": this.attributes["aria-label"],
						title: this.attributes.title || this.attributes["aria-label"]
					});
					this.keys = {};
					this._.focusIndex = -1;
					this.element.disableContextMenu();
				},
				_: {
					markItem: function(a) {
						if (a != -1) {
							a = this.element.getElementsByTag("a").getItem(this._.focusIndex = a);
							if (CKEDITOR.env.webkit) {
								a.getDocument().getWindow().focus();
							}
							a.focus();
							if (this.onMark) {
								this.onMark(a);
							}
						}
					}
				},
				proto: {
					show: function() {
						this.element.setStyle("display", "");
					},
					hide: function() {
						if (!this.onHide || this.onHide.call(this) !== true) {
							this.element.setStyle("display", "none");
						}
					},
					onKeyDown: function(a, b) {
						var c = this.keys[a];
						switch (c) {
							case "next":
								var e = this._.focusIndex;
								c = this.element.getElementsByTag("a");
								var j;
								for (; j = c.getItem(++e);) {
									if (j.getAttribute("_cke_focus") && j.$.offsetWidth) {
										this._.focusIndex = e;
										j.focus();
										break;
									}
								}
								if (!j && !b) {
									this._.focusIndex = -1;
									return this.onKeyDown(a, 1);
								}
								return false;
							case "prev":
								e = this._.focusIndex;
								c = this.element.getElementsByTag("a");
								for (; e > 0 && (j = c.getItem(--e));) {
									if (j.getAttribute("_cke_focus") && j.$.offsetWidth) {
										this._.focusIndex = e;
										j.focus();
										break;
									}
									j = null;
								}
								if (!j && !b) {
									this._.focusIndex = c.count();
									return this.onKeyDown(a, 1);
								}
								return false;
							case "click":
								;
							case "mouseup":
								e = this._.focusIndex;
								if (j = e >= 0 && this.element.getElementsByTag("a").getItem(e)) {
									if (j.$[c]) {
										j.$[c]();
									} else {
										j.$["on" + c]();
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
			requires: "panel"
		});
		(function() {
			function a$$2(a, d, f, c, h) {
				h = CKEDITOR.tools.genKey(d.getUniqueId(), f.getUniqueId(), a.lang.dir, a.uiColor || "", c.css || "", h || "");
				var j = e$$1[h];
				if (!j) {
					j = e$$1[h] = new CKEDITOR.ui.panel(d, c);
					j.element = f.append(CKEDITOR.dom.element.createFromHtml(j.render(a), d));
					j.element.setStyles({
						display: "none",
						position: "absolute"
					});
				}
				return j;
			}
			var e$$1 = {};
			CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({
				$: function(b, d, f, c) {
					function e() {
						k.hide();
					}
					f.forceIFrame = 1;
					if (f.toolbarRelated) {
						if (b.elementMode == CKEDITOR.ELEMENT_MODE_INLINE) {
							d = CKEDITOR.document.getById("cke_" + b.name);
						}
					}
					var j = d.getDocument();
					c = a$$2(b, j, d, f, c || 0);
					var g = c.element;
					var i = g.getFirst();
					var k = this;
					g.disableContextMenu();
					this.element = g;
					this._ = {
						editor: b,
						panel: c,
						parentElement: d,
						definition: f,
						document: j,
						iframe: i,
						children: [],
						dir: b.lang.dir
					};
					b.on("mode", e);
					b.on("resize", e);
					if (!CKEDITOR.env.iOS) {
						j.getWindow().on("resize", e);
					}
				},
				proto: {
					addBlock: function(a, d) {
						return this._.panel.addBlock(a, d);
					},
					addListBlock: function(a, d) {
						return this._.panel.addListBlock(a, d);
					},
					getBlock: function(a) {
						return this._.panel.getBlock(a);
					},
					showBlock: function(a$$1, d$$0, f$$0, c$$0, e$$0, j) {
						var g = this._.panel;
						var i = g.showBlock(a$$1);
						this.allowBlur(false);
						a$$1 = this._.editor.editable();
						this._.returnFocus = a$$1.hasFocus ? a$$1 : new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);
						this._.hideTimeout = 0;
						var k = this.element;
						a$$1 = this._.iframe;
						a$$1 = CKEDITOR.env.ie ? a$$1 : new CKEDITOR.dom.window(a$$1.$.contentWindow);
						var n = k.getDocument();
						var o = this._.parentElement.getPositionedAncestor();
						var r = d$$0.getDocumentPosition(n);
						n = o ? o.getDocumentPosition(n) : {
							x: 0,
							y: 0
						};
						var l = this._.dir == "rtl";
						var m = r.x + (c$$0 || 0) - n.x;
						var s = r.y + (e$$0 || 0) - n.y;
						if (l && (f$$0 == 1 || f$$0 == 4)) {
							m = m + d$$0.$.offsetWidth;
						} else {
							if (!l && (f$$0 == 2 || f$$0 == 3)) {
								m = m + (d$$0.$.offsetWidth - 1);
							}
						}
						if (f$$0 == 3 || f$$0 == 4) {
							s = s + (d$$0.$.offsetHeight - 1);
						}
						this._.panel._.offsetParentId = d$$0.getId();
						k.setStyles({
							top: s + "px",
							left: 0,
							display: ""
						});
						k.setOpacity(0);
						k.getFirst().removeStyle("width");
						this._.editor.focusManager.add(a$$1);
						if (!this._.blurSet) {
							CKEDITOR.event.useCapture = true;
							a$$1.on("blur", function(a) {
								function b() {
									delete this._.returnFocus;
									this.hide();
								}
								if (this.allowBlur() && (a.data.getPhase() == CKEDITOR.EVENT_PHASE_AT_TARGET && (this.visible && !this._.activeChild))) {
									if (CKEDITOR.env.iOS) {
										if (!this._.hideTimeout) {
											this._.hideTimeout = CKEDITOR.tools.setTimeout(b, 0, this);
										}
									} else {
										b.call(this);
									}
								}
							}, this);
							a$$1.on("focus", function() {
								this._.focused = true;
								this.hideChild();
								this.allowBlur(true);
							}, this);
							if (CKEDITOR.env.iOS) {
								a$$1.on("touchstart", function() {
									clearTimeout(this._.hideTimeout);
								}, this);
								a$$1.on("touchend", function() {
									this._.hideTimeout = 0;
									this.focus();
								}, this);
							}
							CKEDITOR.event.useCapture = false;
							this._.blurSet = 1;
						}
						g.onEscape = CKEDITOR.tools.bind(function(a) {
							if (this.onEscape && this.onEscape(a) === false) {
								return false;
							}
						}, this);
						CKEDITOR.tools.setTimeout(function() {
							var a$$0 = CKEDITOR.tools.bind(function() {
								k.removeStyle("width");
								if (i.autoSize) {
									var a = i.element.getDocument();
									a = (CKEDITOR.env.webkit ? i.element : a.getBody()).$.scrollWidth;
									if (CKEDITOR.env.ie) {
										if (CKEDITOR.env.quirks && a > 0) {
											a = a + ((k.$.offsetWidth || 0) - (k.$.clientWidth || 0) + 3);
										}
									}
									k.setStyle("width", a + 10 + "px");
									a = i.element.$.scrollHeight;
									if (CKEDITOR.env.ie) {
										if (CKEDITOR.env.quirks && a > 0) {
											a = a + ((k.$.offsetHeight || 0) - (k.$.clientHeight || 0) + 3);
										}
									}
									k.setStyle("height", a + "px");
									g._.currentBlock.element.setStyle("display", "none").removeStyle("display");
								} else {
									k.removeStyle("height");
								}
								if (l) {
									m = m - k.$.offsetWidth;
								}
								k.setStyle("left", m + "px");
								var b = g.element.getWindow();
								a = k.$.getBoundingClientRect();
								b = b.getViewPaneSize();
								var c = a.width || a.right - a.left;
								var d = a.height || a.bottom - a.top;
								var f = l ? a.right : b.width - a.left;
								var e = l ? b.width - a.right : a.left;
								if (l) {
									if (f < c) {
										m = e > c ? m + c : b.width > c ? m - a.left : m - a.right + b.width;
									}
								} else {
									if (f < c) {
										m = e > c ? m - c : b.width > c ? m - a.right + b.width : m - a.left;
									}
								}
								c = a.top;
								if (b.height - a.top < d) {
									s = c > d ? s - d : b.height > d ? s - a.bottom + b.height : s - a.top;
								}
								if (CKEDITOR.env.ie) {
									b = a = new CKEDITOR.dom.element(k.$.offsetParent);
									if (b.getName() == "html") {
										b = b.getDocument().getBody();
									}
									if (b.getComputedStyle("direction") == "rtl") {
										m = CKEDITOR.env.ie8Compat ? m - k.getDocument().getDocumentElement().$.scrollLeft * 2 : m - (a.$.scrollWidth - a.$.clientWidth);
									}
								}
								a = k.getFirst();
								var h;
								if (h = a.getCustomData("activePanel")) {
									if (h.onHide) {
										h.onHide.call(this, 1);
									}
								}
								a.setCustomData("activePanel", this);
								k.setStyles({
									top: s + "px",
									left: m + "px"
								});
								k.setOpacity(1);
								if (j) {
									j();
								}
							}, this);
							if (g.isLoaded) {
								a$$0();
							} else {
								g.onLoad = a$$0;
							}
							CKEDITOR.tools.setTimeout(function() {
								var a = CKEDITOR.env.webkit && CKEDITOR.document.getWindow().getScrollPosition().y;
								this.focus();
								i.element.focus();
								if (CKEDITOR.env.webkit) {
									CKEDITOR.document.getBody().$.scrollTop = a;
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
					focus: function() {
						if (CKEDITOR.env.webkit) {
							var a = CKEDITOR.document.getActive();
							if (!a.equals(this._.iframe)) {
								a.$.blur();
							}
						}
						(this._.lastFocused || this._.iframe.getFrameDocument().getWindow()).focus();
					},
					blur: function() {
						var a = this._.iframe.getFrameDocument().getActive();
						if (a.is("a")) {
							this._.lastFocused = a;
						}
					},
					hide: function(a) {
						if (this.visible && (!this.onHide || this.onHide.call(this) !== true)) {
							this.hideChild();
							if (CKEDITOR.env.gecko) {
								this._.iframe.getFrameDocument().$.activeElement.blur();
							}
							this.element.setStyle("display", "none");
							this.visible = 0;
							this.element.getFirst().removeCustomData("activePanel");
							if (a = a && this._.returnFocus) {
								if (CKEDITOR.env.webkit) {
									if (a.type) {
										a.getWindow().$.focus();
									}
								}
								a.focus();
							}
							delete this._.lastFocused;
							this._.editor.fire("panelHide", this);
						}
					},
					allowBlur: function(a) {
						var d = this._.panel;
						if (a != void 0) {
							d.allowBlur = a;
						}
						return d.allowBlur;
					},
					showAsChild: function(a, d, f, c, e, j) {
						if (!(this._.activeChild == a && a._.panel._.offsetParentId == f.getId())) {
							this.hideChild();
							a.onHide = CKEDITOR.tools.bind(function() {
								CKEDITOR.tools.setTimeout(function() {
									if (!this._.focused) {
										this.hide();
									}
								}, 0, this);
							}, this);
							this._.activeChild = a;
							this._.focused = false;
							a.showBlock(d, f, c, e, j);
							this.blur();
							if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) {
								setTimeout(function() {
									a.element.getChild(0).$.style.cssText += "";
								}, 100);
							}
						}
					},
					hideChild: function(a) {
						var d = this._.activeChild;
						if (d) {
							delete d.onHide;
							delete this._.activeChild;
							d.hide();
							if (a) {
								this.focus();
							}
						}
					}
				}
			});
			CKEDITOR.on("instanceDestroyed", function() {
				var a = CKEDITOR.tools.isEmpty(CKEDITOR.instances);
				var d;
				for (d in e$$1) {
					var f = e$$1[d];
					if (a) {
						f.destroy();
					} else {
						f.element.hide();
					}
				}
				if (a) {
					e$$1 = {};
				}
			});
		})();
		CKEDITOR.plugins.add("menu", {
			requires: "floatpanel",
			beforeInit: function(a$$0) {
				var e = a$$0.config.menu_groups.split(",");
				var b$$0 = a$$0._.menuGroups = {};
				var d$$0 = a$$0._.menuItems = {};
				var f$$0 = 0;
				for (; f$$0 < e.length; f$$0++) {
					b$$0[e[f$$0]] = f$$0 + 1;
				}
				a$$0.addMenuGroup = function(a, d) {
					b$$0[a] = d || 100;
				};
				a$$0.addMenuItem = function(a, f) {
					if (b$$0[f.group]) {
						d$$0[a] = new CKEDITOR.menuItem(this, a, f);
					}
				};
				a$$0.addMenuItems = function(a) {
					var b;
					for (b in a) {
						this.addMenuItem(b, a[b]);
					}
				};
				a$$0.getMenuItem = function(a) {
					return d$$0[a];
				};
				a$$0.removeMenuItem = function(a) {
					delete d$$0[a];
				};
			}
		});
		(function() {
			function a$$1(a$$0) {
				a$$0.sort(function(a, b) {
					return a.group < b.group ? -1 : a.group > b.group ? 1 : a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
				});
			}
			var e$$0 = '<span class="cke_menuitem"><a id="{id}" class="cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href="{href}" title="{title}" tabindex="-1"_cke_focus=1 hidefocus="true" role="{role}" aria-haspopup="{hasPopup}" aria-disabled="{disabled}" {ariaChecked}';
			if (CKEDITOR.env.gecko) {
				if (CKEDITOR.env.mac) {
					e$$0 = e$$0 + ' onkeypress="return false;"';
				}
			}
			if (CKEDITOR.env.gecko) {
				e$$0 = e$$0 + ' onblur="this.style.cssText = this.style.cssText;"';
			}
			e$$0 = e$$0 + (' onmouseover="CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout="CKEDITOR.tools.callFunction({moveOutFn},{index});" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},{index}); return false;">');
			var b$$1 = CKEDITOR.addTemplate("menuItem", e$$0 + '<span class="cke_menubutton_inner"><span class="cke_menubutton_icon"><span class="cke_button_icon cke_button__{iconName}_icon" style="{iconStyle}"></span></span><span class="cke_menubutton_label">{label}</span>{arrowHtml}</span></a></span>');
			var d$$0 = CKEDITOR.addTemplate("menuArrow", '<span class="cke_menuarrow"><span>{label}</span></span>');
			CKEDITOR.menu = CKEDITOR.tools.createClass({
				$: function(a, b) {
					b = this._.definition = b || {};
					this.id = CKEDITOR.tools.getNextId();
					this.editor = a;
					this.items = [];
					this._.listeners = [];
					this._.level = b.level || 1;
					var d = CKEDITOR.tools.extend({}, b.panel, {
						css: [CKEDITOR.skin.getPath("editor")],
						level: this._.level - 1,
						block: {}
					});
					var e = d.block.attributes = d.attributes || {};
					if (!e.role) {
						e.role = "menu";
					}
					this._.panelDefinition = d;
				},
				_: {
					onShow: function() {
						var a = this.editor.getSelection();
						var b = a && a.getStartElement();
						var d = this.editor.elementPath();
						var e = this._.listeners;
						this.removeAll();
						var g = 0;
						for (; g < e.length; g++) {
							var i = e[g](b, a, d);
							if (i) {
								var k;
								for (k in i) {
									var n = this.editor.getMenuItem(k);
									if (n && (!n.command || this.editor.getCommand(n.command).state)) {
										n.state = i[k];
										this.add(n);
									}
								}
							}
						}
					},
					onClick: function(a) {
						this.hide();
						if (a.onClick) {
							a.onClick();
						} else {
							if (a.command) {
								this.editor.execCommand(a.command);
							}
						}
					},
					onEscape: function(a) {
						var b = this.parent;
						if (b) {
							b._.panel.hideChild(1);
						} else {
							if (a == 27) {
								this.hide(1);
							}
						}
						return false;
					},
					onHide: function() {
						if (this.onHide) {
							this.onHide();
						}
					},
					showSubMenu: function(a) {
						var b = this._.subMenu;
						var d = this.items[a];
						if (d = d.getItems && d.getItems()) {
							if (b) {
								b.removeAll();
							} else {
								b = this._.subMenu = new CKEDITOR.menu(this.editor, CKEDITOR.tools.extend({}, this._.definition, {
									level: this._.level + 1
								}, true));
								b.parent = this;
								b._.onClick = CKEDITOR.tools.bind(this._.onClick, this);
							}
							var e;
							for (e in d) {
								var g = this.editor.getMenuItem(e);
								if (g) {
									g.state = d[e];
									b.add(g);
								}
							}
							var i = this._.panel.getBlock(this.id).element.getDocument().getById(this.id + ("" + a));
							setTimeout(function() {
								b.show(i, 2);
							}, 0);
						} else {
							this._.panel.hideChild(1);
						}
					}
				},
				proto: {
					add: function(a) {
						if (!a.order) {
							a.order = this.items.length;
						}
						this.items.push(a);
					},
					removeAll: function() {
						this.items = [];
					},
					show: function(b$$0, c, d, e) {
						if (!this.parent) {
							this._.onShow();
							if (!this.items.length) {
								return;
							}
						}
						c = c || (this.editor.lang.dir == "rtl" ? 2 : 1);
						var g = this.items;
						var i = this.editor;
						var k = this._.panel;
						var n = this._.element;
						if (!k) {
							k = this._.panel = new CKEDITOR.ui.floatPanel(this.editor, CKEDITOR.document.getBody(), this._.panelDefinition, this._.level);
							k.onEscape = CKEDITOR.tools.bind(function(a) {
								if (this._.onEscape(a) === false) {
									return false;
								}
							}, this);
							k.onShow = function() {
								k._.panel.getHolderElement().getParent().addClass("cke cke_reset_all");
							};
							k.onHide = CKEDITOR.tools.bind(function() {
								if (this._.onHide) {
									this._.onHide();
								}
							}, this);
							n = k.addBlock(this.id, this._.panelDefinition.block);
							n.autoSize = true;
							var o = n.keys;
							o[40] = "next";
							o[9] = "next";
							o[38] = "prev";
							o[CKEDITOR.SHIFT + 9] = "prev";
							o[i.lang.dir == "rtl" ? 37 : 39] = CKEDITOR.env.ie ? "mouseup" : "click";
							o[32] = CKEDITOR.env.ie ? "mouseup" : "click";
							if (CKEDITOR.env.ie) {
								o[13] = "mouseup";
							}
							n = this._.element = n.element;
							o = n.getDocument();
							o.getBody().setStyle("overflow", "hidden");
							o.getElementsByTag("html").getItem(0).setStyle("overflow", "hidden");
							this._.itemOverFn = CKEDITOR.tools.addFunction(function(a) {
								clearTimeout(this._.showSubTimeout);
								this._.showSubTimeout = CKEDITOR.tools.setTimeout(this._.showSubMenu, i.config.menu_subMenuDelay || 400, this, [a]);
							}, this);
							this._.itemOutFn = CKEDITOR.tools.addFunction(function() {
								clearTimeout(this._.showSubTimeout);
							}, this);
							this._.itemClickFn = CKEDITOR.tools.addFunction(function(a) {
								var b = this.items[a];
								if (b.state == CKEDITOR.TRISTATE_DISABLED) {
									this.hide(1);
								} else {
									if (b.getItems) {
										this._.showSubMenu(a);
									} else {
										this._.onClick(b);
									}
								}
							}, this);
						}
						a$$1(g);
						o = i.elementPath();
						o = ['<div class="cke_menu' + (o && o.direction() != i.lang.dir ? " cke_mixed_dir_content" : "") + '" role="presentation">'];
						var r = g.length;
						var l = r && g[0].group;
						var m = 0;
						for (; m < r; m++) {
							var s = g[m];
							if (l != s.group) {
								o.push('<div class="cke_menuseparator" role="separator"></div>');
								l = s.group;
							}
							s.render(this, m, o);
						}
						o.push("</div>");
						n.setHtml(o.join(""));
						CKEDITOR.ui.fire("ready", this);
						if (this.parent) {
							this.parent._.panel.showAsChild(k, this.id, b$$0, c, d, e);
						} else {
							k.showBlock(this.id, b$$0, c, d, e);
						}
						i.fire("menuShow", [k]);
					},
					addListener: function(a) {
						this._.listeners.push(a);
					},
					hide: function(a) {
						if (this._.onHide) {
							this._.onHide();
						}
						if (this._.panel) {
							this._.panel.hide(a);
						}
					}
				}
			});
			CKEDITOR.menuItem = CKEDITOR.tools.createClass({
				$: function(a, b, d) {
					CKEDITOR.tools.extend(this, d, {
						order: 0,
						className: "cke_menubutton__" + b
					});
					this.group = a._.menuGroups[this.group];
					this.editor = a;
					this.name = b;
				},
				proto: {
					render: function(a, c, e) {
						var j = a.id + ("" + c);
						var g = typeof this.state == "undefined" ? CKEDITOR.TRISTATE_OFF : this.state;
						var i = "";
						var k = g == CKEDITOR.TRISTATE_ON ? "on" : g == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off";
						if (this.role in {
							menuitemcheckbox: 1,
							menuitemradio: 1
						}) {
							i = ' aria-checked="' + (g == CKEDITOR.TRISTATE_ON ? "true" : "false") + '"';
						}
						var n = this.getItems;
						var o = "&#" + (this.editor.lang.dir == "rtl" ? "9668" : "9658") + ";";
						var r = this.name;
						if (this.icon && !/\./.test(this.icon)) {
							r = this.icon;
						}
						a = {
							id: j,
							name: this.name,
							iconName: r,
							label: this.label,
							cls: this.className || "",
							state: k,
							hasPopup: n ? "true" : "false",
							disabled: g == CKEDITOR.TRISTATE_DISABLED,
							title: this.label,
							href: "javascript:void('" + (this.label || "").replace("'") + "')",
							hoverFn: a._.itemOverFn,
							moveOutFn: a._.itemOutFn,
							clickFn: a._.itemClickFn,
							index: c,
							iconStyle: CKEDITOR.skin.getIconStyle(r, this.editor.lang.dir == "rtl", r == this.icon ? null : this.icon, this.iconOffset),
							arrowHtml: n ? d$$0.output({
								label: o
							}) : "",
							role: this.role ? this.role : "menuitem",
							ariaChecked: i
						};
						b$$1.output(a, e);
					}
				}
			});
		})();
		CKEDITOR.config.menu_groups = "clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div";
		CKEDITOR.plugins.add("contextmenu", {
			requires: "menu",
			onLoad: function() {
				CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass({
					base: CKEDITOR.menu,
					$: function(a) {
						this.base.call(this, a, {
							panel: {
								className: "cke_menu_panel",
								attributes: {
									"aria-label": a.lang.contextmenu.options
								}
							}
						});
					},
					proto: {
						addTarget: function(a$$1, e) {
							a$$1.on("contextmenu", function(a$$0) {
								a$$0 = a$$0.data;
								var c = CKEDITOR.env.webkit ? b : CKEDITOR.env.mac ? a$$0.$.metaKey : a$$0.$.ctrlKey;
								if (!e || !c) {
									a$$0.preventDefault();
									if (CKEDITOR.env.mac && CKEDITOR.env.webkit) {
										c = this.editor;
										var d = (new CKEDITOR.dom.elementPath(a$$0.getTarget(), c.editable())).contains(function(a) {
											return a.hasAttribute("contenteditable");
										}, true);
										if (d) {
											if (d.getAttribute("contenteditable") == "false") {
												c.getSelection().fake(d);
											}
										}
									}
									d = a$$0.getTarget().getDocument();
									var j = a$$0.getTarget().getDocument().getDocumentElement();
									c = !d.equals(CKEDITOR.document);
									d = d.getWindow().getScrollPosition();
									var g = c ? a$$0.$.clientX : a$$0.$.pageX || d.x + a$$0.$.clientX;
									var i = c ? a$$0.$.clientY : a$$0.$.pageY || d.y + a$$0.$.clientY;
									CKEDITOR.tools.setTimeout(function() {
										this.open(j, null, g, i);
									}, CKEDITOR.env.ie ? 200 : 0, this);
								}
							}, this);
							if (CKEDITOR.env.webkit) {
								var b;
								var d$$0 = function() {
									b = 0;
								};
								a$$1.on("keydown", function(a) {
									b = CKEDITOR.env.mac ? a.data.$.metaKey : a.data.$.ctrlKey;
								});
								a$$1.on("keyup", d$$0);
								a$$1.on("contextmenu", d$$0);
							}
						},
						open: function(a, e, b, d) {
							this.editor.focus();
							a = a || CKEDITOR.document.getDocumentElement();
							this.editor.selectionChange(1);
							this.show(a, e, b, d);
						}
					}
				});
			},
			beforeInit: function(a) {
				var e = a.contextMenu = new CKEDITOR.plugins.contextMenu(a);
				a.on("contentDom", function() {
					e.addTarget(a.editable(), a.config.browserContextMenuOnCtrl !== false);
				});
				a.addCommand("contextMenu", {
					exec: function() {
						a.contextMenu.open(a.document.getBody());
					}
				});
				a.setKeystroke(CKEDITOR.SHIFT + 121, "contextMenu");
				a.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 121, "contextMenu");
			}
		});
		(function() {
			function e$$1(c, d$$0) {
				function e$$0(a) {
					a = n.list[a];
					if (a.equals(c.editable()) || a.getAttribute("contenteditable") == "true") {
						var b = c.createRange();
						b.selectNodeContents(a);
						b.select();
					} else {
						c.getSelection().selectElement(a);
					}
					c.focus();
				}

				function g$$0() {
					if (k) {
						k.setHtml(b$$0);
					}
					delete n.list;
				}
				var i = c.ui.spaceId("path");
				var k;
				var n = c._.elementsPath;
				var o = n.idBase;
				d$$0.html = d$$0.html + ('<span id="' + i + '_label" class="cke_voice_label">' + c.lang.elementspath.eleLabel + '</span><span id="' + i + '" class="cke_path" role="group" aria-labelledby="' + i + '_label">' + b$$0 + "</span>");
				c.on("uiReady", function() {
					var a = c.ui.space("path");
					if (a) {
						c.focusManager.add(a, 1);
					}
				});
				n.onClick = e$$0;
				var r = CKEDITOR.tools.addFunction(e$$0);
				var l = CKEDITOR.tools.addFunction(function(a, b) {
					var d = n.idBase;
					var f;
					b = new CKEDITOR.dom.event(b);
					f = c.lang.dir == "rtl";
					switch (b.getKeystroke()) {
						case f ? 39:
							37: ;
						case 9:
							if (!(f = CKEDITOR.document.getById(d + (a + 1)))) {
								f = CKEDITOR.document.getById(d + "0");
							}
							f.focus();
							return false;
						case f ? 37:
							39: ;
						case CKEDITOR.SHIFT + 9:
							if (!(f = CKEDITOR.document.getById(d + (a - 1)))) {
								f = CKEDITOR.document.getById(d + (n.list.length - 1));
							}
							f.focus();
							return false;
						case 27:
							c.focus();
							return false;
						case 13:
							;
						case 32:
							e$$0(a);
							return false;
					}
					return true;
				});
				c.on("selectionChange", function() {
					c.editable();
					var a = [];
					var d = n.list = [];
					var e = [];
					var g = n.filters;
					var h = true;
					var j = c.elementPath().elements;
					var u;
					var B = j.length;
					for (; B--;) {
						var v = j[B];
						var z = 0;
						u = v.data("cke-display-name") ? v.data("cke-display-name") : v.data("cke-real-element-type") ? v.data("cke-real-element-type") : v.getName();
						h = v.hasAttribute("contenteditable") ? v.getAttribute("contenteditable") == "true" : h;
						if (!h) {
							if (!v.hasAttribute("contenteditable")) {
								z = 1;
							}
						}
						var w = 0;
						for (; w < g.length; w++) {
							var D = g[w](v, u);
							if (D === false) {
								z = 1;
								break;
							}
							u = D || u;
						}
						if (!z) {
							d.unshift(v);
							e.unshift(u);
						}
					}
					d = d.length;
					g = 0;
					for (; g < d; g++) {
						u = e[g];
						h = c.lang.elementspath.eleTitle.replace(/%1/, u);
						u = f$$0.output({
							id: o + g,
							label: h,
							text: u,
							jsTitle: "javascript:void('" + u + "')",
							index: g,
							keyDownFn: l,
							clickFn: r
						});
						a.unshift(u);
					}
					if (!k) {
						k = CKEDITOR.document.getById(i);
					}
					e = k;
					e.setHtml(a.join("") + b$$0);
					c.fire("elementsPathUpdate", {
						space: e
					});
				});
				c.on("readOnly", g$$0);
				c.on("contentDomUnload", g$$0);
				c.addCommand("elementsPathFocus", a$$0);
				c.setKeystroke(CKEDITOR.ALT + 122, "elementsPathFocus");
			}
			var a$$0;
			a$$0 = {
				editorFocus: false,
				readOnly: 1,
				exec: function(a) {
					if (a = CKEDITOR.document.getById(a._.elementsPath.idBase + "0")) {
						a.focus(CKEDITOR.env.ie || CKEDITOR.env.air);
					}
				}
			};
			var b$$0 = '<span class="cke_path_empty">&nbsp;</span>';
			var d$$1 = "";
			if (CKEDITOR.env.gecko) {
				if (CKEDITOR.env.mac) {
					d$$1 = d$$1 + ' onkeypress="return false;"';
				}
			}
			if (CKEDITOR.env.gecko) {
				d$$1 = d$$1 + ' onblur="this.style.cssText = this.style.cssText;"';
			}
			var f$$0 = CKEDITOR.addTemplate("pathItem", '<a id="{id}" href="{jsTitle}" tabindex="-1" class="cke_path_item" title="{label}"' + d$$1 + ' hidefocus="true"  onkeydown="return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick="CKEDITOR.tools.callFunction({clickFn},{index}); return false;" role="button" aria-label="{label}">{text}</a>');
			CKEDITOR.plugins.add("elementspath", {
				init: function(a) {
					a._.elementsPath = {
						idBase: "cke_elementspath_" + CKEDITOR.tools.getNextNumber() + "_",
						filters: []
					};
					a.on("uiSpace", function(b) {
						if (b.data.space == "bottom") {
							e$$1(a, b.data);
						}
					});
				}
			});
		})();
		(function() {
			function a$$1(a, b, d) {
				d = a.config.forceEnterMode || d;
				if (a.mode == "wysiwyg") {
					if (!b) {
						b = a.activeEnterMode;
					}
					if (!a.elementPath().isContextFor("p")) {
						b = CKEDITOR.ENTER_BR;
						d = 1;
					}
					a.fire("saveSnapshot");
					if (b == CKEDITOR.ENTER_BR) {
						c$$0(a, b, null, d);
					} else {
						h$$0(a, b, null, d);
					}
					a.fire("saveSnapshot");
				}
			}

			function e(a) {
				a = a.getSelection().getRanges(true);
				var b = a.length - 1;
				for (; b > 0; b--) {
					a[b].deleteContents();
				}
				return a[0];
			}
			CKEDITOR.plugins.add("enterkey", {
				init: function(b$$0) {
					b$$0.addCommand("enter", {
						modes: {
							wysiwyg: 1
						},
						editorFocus: false,
						exec: function(b) {
							a$$1(b);
						}
					});
					b$$0.addCommand("shiftEnter", {
						modes: {
							wysiwyg: 1
						},
						editorFocus: false,
						exec: function(b) {
							a$$1(b, b.activeShiftEnterMode, 1);
						}
					});
					b$$0.setKeystroke([
						[13, "enter"],
						[CKEDITOR.SHIFT + 13, "shiftEnter"]
					]);
				}
			});
			var b$$1 = CKEDITOR.dom.walker.whitespaces();
			var d$$0 = CKEDITOR.dom.walker.bookmark();
			CKEDITOR.plugins.enterkey = {
				enterBlock: function(a$$0, f, h, n) {
					if (h = h || e(a$$0)) {
						var o = h.document;
						var r = h.checkStartOfBlock();
						var l = h.checkEndOfBlock();
						var m = a$$0.elementPath(h.startContainer).block;
						var s = f == CKEDITOR.ENTER_DIV ? "div" : "p";
						var t;
						if (r && l) {
							if (m && (m.is("li") || m.getParent().is("li"))) {
								h = m.getParent();
								t = h.getParent();
								n = !m.hasPrevious();
								var p = !m.hasNext();
								s = a$$0.getSelection();
								var x = s.createBookmarks();
								r = m.getDirection(1);
								l = m.getAttribute("class");
								var q = m.getAttribute("style");
								var u = t.getDirection(1) != r;
								a$$0 = a$$0.enterMode != CKEDITOR.ENTER_BR || (u || (q || l));
								if (t.is("li")) {
									if (n || p) {
										m[n ? "insertBefore" : "insertAfter"](t);
									} else {
										m.breakParent(t);
									}
								} else {
									if (a$$0) {
										t = o.createElement(f == CKEDITOR.ENTER_P ? "p" : "div");
										if (u) {
											t.setAttribute("dir", r);
										}
										if (q) {
											t.setAttribute("style", q);
										}
										if (l) {
											t.setAttribute("class", l);
										}
										m.moveChildren(t);
										if (n || p) {
											t[n ? "insertBefore" : "insertAfter"](h);
										} else {
											m.breakParent(h);
											t.insertAfter(h);
										}
									} else {
										m.appendBogus(true);
										if (n || p) {
											for (; o = m[n ? "getFirst" : "getLast"]();) {
												o[n ? "insertBefore" : "insertAfter"](h);
											}
										} else {
											m.breakParent(h);
											for (; o = m.getLast();) {
												o.insertAfter(h);
											}
										}
									}
									m.remove();
								}
								s.selectBookmarks(x);
								return;
							}
							if (m && m.getParent().is("blockquote")) {
								m.breakParent(m.getParent());
								if (!m.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1))) {
									m.getPrevious().remove();
								}
								if (!m.getNext().getFirst(CKEDITOR.dom.walker.invisible(1))) {
									m.getNext().remove();
								}
								h.moveToElementEditStart(m);
								h.select();
								return;
							}
						} else {
							if (m && (m.is("pre") && !l)) {
								c$$0(a$$0, f, h, n);
								return;
							}
						}
						if (l = h.splitBlock(s)) {
							f = l.previousBlock;
							m = l.nextBlock;
							a$$0 = l.wasStartOfBlock;
							r = l.wasEndOfBlock;
							if (m) {
								x = m.getParent();
								if (x.is("li")) {
									m.breakParent(x);
									m.move(m.getNext(), 1);
								}
							} else {
								if (f && ((x = f.getParent()) && x.is("li"))) {
									f.breakParent(x);
									x = f.getNext();
									h.moveToElementEditStart(x);
									f.move(f.getPrevious());
								}
							}
							if (!a$$0 && !r) {
								if (m.is("li")) {
									t = h.clone();
									t.selectNodeContents(m);
									t = new CKEDITOR.dom.walker(t);
									t.evaluator = function(a) {
										return !(d$$0(a) || (b$$1(a) || a.type == CKEDITOR.NODE_ELEMENT && (a.getName() in CKEDITOR.dtd.$inline && !(a.getName() in CKEDITOR.dtd.$empty))));
									};
									if (x = t.next()) {
										if (x.type == CKEDITOR.NODE_ELEMENT && x.is("ul", "ol")) {
											(CKEDITOR.env.needsBrFiller ? o.createElement("br") : o.createText(" ")).insertBefore(x);
										}
									}
								}
								if (m) {
									h.moveToElementEditStart(m);
								}
							} else {
								if (f) {
									if (f.is("li") || !j.test(f.getName()) && !f.is("pre")) {
										t = f.clone();
									}
								} else {
									if (m) {
										t = m.clone();
									}
								}
								if (t) {
									if (n) {
										if (!t.is("li")) {
											t.renameNode(s);
										}
									}
								} else {
									if (x && x.is("li")) {
										t = x;
									} else {
										t = o.createElement(s);
										if (f) {
											if (p = f.getDirection()) {
												t.setAttribute("dir", p);
											}
										}
									}
								}
								if (o = l.elementPath) {
									n = 0;
									s = o.elements.length;
									for (; n < s; n++) {
										x = o.elements[n];
										if (x.equals(o.block) || x.equals(o.blockLimit)) {
											break;
										}
										if (CKEDITOR.dtd.$removeEmpty[x.getName()]) {
											x = x.clone();
											t.moveChildren(x);
											t.append(x);
										}
									}
								}
								t.appendBogus();
								if (!t.getParent()) {
									h.insertNode(t);
								}
								if (t.is("li")) {
									t.removeAttribute("value");
								}
								if (CKEDITOR.env.ie && (a$$0 && (!r || !f.getChildCount()))) {
									h.moveToElementEditStart(r ? f : t);
									h.select();
								}
								h.moveToElementEditStart(a$$0 && !r ? m : t);
							}
							h.select();
							h.scrollIntoView();
						}
					}
				},
				enterBr: function(a, b, c, d) {
					if (c = c || e(a)) {
						var f = c.document;
						var r = c.checkEndOfBlock();
						var l = new CKEDITOR.dom.elementPath(a.getSelection().getStartElement());
						var m = l.block;
						l = m && l.block.getName();
						if (!d && l == "li") {
							h$$0(a, b, c, d);
						} else {
							if (!d && (r && j.test(l))) {
								if (r = m.getDirection()) {
									f = f.createElement("div");
									f.setAttribute("dir", r);
									f.insertAfter(m);
									c.setStart(f, 0);
								} else {
									f.createElement("br").insertAfter(m);
									if (CKEDITOR.env.gecko) {
										f.createText("").insertAfter(m);
									}
									c.setStartAt(m.getNext(), CKEDITOR.env.ie ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_START);
								}
							} else {
								m = l == "pre" && (CKEDITOR.env.ie && CKEDITOR.env.version < 8) ? f.createText("\r") : f.createElement("br");
								c.deleteContents();
								c.insertNode(m);
								if (CKEDITOR.env.needsBrFiller) {
									f.createText("\ufeff").insertAfter(m);
									if (r) {
										m.getParent().appendBogus();
									}
									m.getNext().$.nodeValue = "";
									c.setStartAt(m.getNext(), CKEDITOR.POSITION_AFTER_START);
								} else {
									c.setStartAt(m, CKEDITOR.POSITION_AFTER_END);
								}
							}
							c.collapse(true);
							c.select();
							c.scrollIntoView();
						}
					}
				}
			};
			var f$$0 = CKEDITOR.plugins.enterkey;
			var c$$0 = f$$0.enterBr;
			var h$$0 = f$$0.enterBlock;
			var j = /^h[1-6]$/;
		})();
		(function() {
			function a$$1(a$$0, b) {
				var d = {};
				var f = [];
				var c = {
					nbsp: " ",
					shy: "\u00ad",
					gt: ">",
					lt: "<",
					amp: "&",
					apos: "'",
					quot: '"'
				};
				a$$0 = a$$0.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g, function(a, e) {
					var g = b ? "&" + e + ";" : c[e];
					d[g] = b ? c[e] : "&" + e + ";";
					f.push(g);
					return "";
				});
				if (!b && a$$0) {
					a$$0 = a$$0.split(",");
					var h = document.createElement("div");
					var j;
					h.innerHTML = "&" + a$$0.join(";&") + ";";
					j = h.innerHTML;
					h = null;
					h = 0;
					for (; h < j.length; h++) {
						var g$$0 = j.charAt(h);
						d[g$$0] = "&" + a$$0[h] + ";";
						f.push(g$$0);
					}
				}
				d.regex = f.join(b ? "|" : "");
				return d;
			}
			CKEDITOR.plugins.add("entities", {
				afterInit: function(e) {
					var b = e.config;
					if (e = (e = e.dataProcessor) && e.htmlFilter) {
						var d = [];
						if (b.basicEntities !== false) {
							d.push("nbsp,gt,lt,amp");
						}
						if (b.entities) {
							if (d.length) {
								d.push("quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro");
							}
							if (b.entities_latin) {
								d.push("Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml");
							}
							if (b.entities_greek) {
								d.push("Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv");
							}
							if (b.entities_additional) {
								d.push(b.entities_additional);
							}
						}
						var f = a$$1(d.join(","));
						var c = f.regex ? "[" + f.regex + "]" : "a^";
						delete f.regex;
						if (b.entities) {
							if (b.entities_processNumerical) {
								c = "[^ -~]|" + c;
							}
						}
						c = RegExp(c, "g");
						var h = function(a) {
							return b.entities_processNumerical == "force" || !f[a] ? "&#" + a.charCodeAt(0) + ";" : f[a];
						};
						var j = a$$1("nbsp,gt,lt,amp,shy", true);
						var g = RegExp(j.regex, "g");
						var i = function(a) {
							return j[a];
						};
						e.addRules({
							text: function(a) {
								return a.replace(g, i).replace(c, h);
							}
						}, {
							applyToAll: true,
							excludeNestedEditable: true
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
			popup: function(a, e, b, d) {
				e = e || "80%";
				b = b || "70%";
				if (typeof e == "string") {
					if (e.length > 1 && e.substr(e.length - 1, 1) == "%") {
						e = parseInt(window.screen.width * parseInt(e, 10) / 100, 10);
					}
				}
				if (typeof b == "string") {
					if (b.length > 1 && b.substr(b.length - 1, 1) == "%") {
						b = parseInt(window.screen.height * parseInt(b, 10) / 100, 10);
					}
				}
				if (e < 640) {
					e = 640;
				}
				if (b < 420) {
					b = 420;
				}
				var f = parseInt((window.screen.height - b) / 2, 10);
				var c = parseInt((window.screen.width - e) / 2, 10);
				d = (d || "location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes") + ",width=" + e + ",height=" + b + ",top=" + f + ",left=" + c;
				var h = window.open("", null, d, true);
				if (!h) {
					return false;
				}
				try {
					if (navigator.userAgent.toLowerCase().indexOf(" chrome/") == -1) {
						h.moveTo(c, f);
						h.resizeTo(e, b);
					}
					h.focus();
					h.location.href = a;
				} catch (j) {
					window.open(a, null, d, true);
				}
				return true;
			}
		});
		(function() {
			function a$$1(a, b) {
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

			function e(a) {
				a = a + "";
				return a.charAt(0).toUpperCase() + a.substr(1);
			}

			function b$$0() {
				var b = this.getDialog();
				var c = b.getParentEditor();
				c._.filebrowserSe = this;
				var d = c.config["filebrowser" + e(b.getName()) + "WindowWidth"] || (c.config.filebrowserWindowWidth || "80%");
				b = c.config["filebrowser" + e(b.getName()) + "WindowHeight"] || (c.config.filebrowserWindowHeight || "70%");
				var f = this.filebrowser.params || {};
				f.CKEditor = c.name;
				f.CKEditorFuncNum = c._.filebrowserFn;
				if (!f.langCode) {
					f.langCode = c.langCode;
				}
				f = a$$1(this.filebrowser.url, f);
				c.popup(f, d, b, c.config.filebrowserWindowFeatures || c.config.fileBrowserWindowFeatures);
			}

			function d$$0() {
				var a = this.getDialog();
				a.getParentEditor()._.filebrowserSe = this;
				return !a.getContentElement(this["for"][0], this["for"][1]).getInputElement().$.value || !a.getContentElement(this["for"][0], this["for"][1]).getAction() ? false : true;
			}

			function f$$0(b, c, d) {
				var f = d.params || {};
				f.CKEditor = b.name;
				f.CKEditorFuncNum = b._.filebrowserFn;
				if (!f.langCode) {
					f.langCode = b.langCode;
				}
				c.action = a$$1(d.url, f);
				c.filebrowser = d;
			}

			function c$$0(a$$0, h, j, n) {
				if (n && n.length) {
					var o;
					var r = n.length;
					for (; r--;) {
						o = n[r];
						if (o.type == "hbox" || (o.type == "vbox" || o.type == "fieldset")) {
							c$$0(a$$0, h, j, o.children);
						}
						if (o.filebrowser) {
							if (typeof o.filebrowser == "string") {
								o.filebrowser = {
									action: o.type == "fileButton" ? "QuickUpload" : "Browse",
									target: o.filebrowser
								};
							}
							if (o.filebrowser.action == "Browse") {
								var l = o.filebrowser.url;
								if (l === void 0) {
									l = a$$0.config["filebrowser" + e(h) + "BrowseUrl"];
									if (l === void 0) {
										l = a$$0.config.filebrowserBrowseUrl;
									}
								}
								if (l) {
									o.onClick = b$$0;
									o.filebrowser.url = l;
									o.hidden = false;
								}
							} else {
								if (o.filebrowser.action == "QuickUpload" && o["for"]) {
									l = o.filebrowser.url;
									if (l === void 0) {
										l = a$$0.config["filebrowser" + e(h) + "UploadUrl"];
										if (l === void 0) {
											l = a$$0.config.filebrowserUploadUrl;
										}
									}
									if (l) {
										var m = o.onClick;
										o.onClick = function(a) {
											var b = a.sender;
											return m && m.call(b, a) === false ? false : d$$0.call(b, a);
										};
										o.filebrowser.url = l;
										o.hidden = false;
										f$$0(a$$0, j.getContents(o["for"][0]).get(o["for"][1]), o.filebrowser);
									}
								}
							}
						}
					}
				}
			}

			function h$$0(a, b, c) {
				if (c.indexOf(";") !== -1) {
					c = c.split(";");
					var d = 0;
					for (; d < c.length; d++) {
						if (h$$0(a, b, c[d])) {
							return true;
						}
					}
					return false;
				}
				return (a = a.getContents(b).get(c).filebrowser) && a.url;
			}

			function j$$0(a, b) {
				var c = this._.filebrowserSe.getDialog();
				var d = this._.filebrowserSe["for"];
				var f = this._.filebrowserSe.filebrowser.onSelect;
				if (d) {
					c.getContentElement(d[0], d[1]).reset();
				}
				if (!(typeof b == "function" && b.call(this._.filebrowserSe) === false) && !(f && f.call(this._.filebrowserSe, a, b) === false)) {
					if (typeof b == "string") {
						if (b) {
							alert(b);
						}
					}
					if (a) {
						d = this._.filebrowserSe;
						c = d.getDialog();
						if (d = d.filebrowser.target || null) {
							d = d.split(":");
							if (f = c.getContentElement(d[0], d[1])) {
								f.setValue(a);
								c.selectPage(d[0]);
							}
						}
					}
				}
			}
			CKEDITOR.plugins.add("filebrowser", {
				requires: "popup",
				init: function(a) {
					a._.filebrowserFn = CKEDITOR.tools.addFunction(j$$0, a);
					a.on("destroy", function() {
						CKEDITOR.tools.removeFunction(this._.filebrowserFn);
					});
				}
			});
			CKEDITOR.on("dialogDefinition", function(a) {
				if (a.editor.plugins.filebrowser) {
					var b = a.data.definition;
					var d;
					var f = 0;
					for (; f < b.contents.length; ++f) {
						if (d = b.contents[f]) {
							c$$0(a.editor, a.data.name, b, d.elements);
							if (d.hidden && d.filebrowser) {
								d.hidden = !h$$0(b, d.id, d.filebrowser);
							}
						}
					}
				}
			});
		})();
		(function() {
			function a$$1(a$$0) {
				var c$$0 = a$$0.config;
				var h$$0 = a$$0.fire("uiSpace", {
					space: "top",
					html: ""
				}).html;
				var j = function() {
					function e$$0(a, b, c) {
						g.setStyle(b, d(c));
						g.setStyle("position", a);
					}

					function h(a) {
						var b = k.getDocumentPosition();
						switch (a) {
							case "top":
								e$$0("absolute", "top", b.y - p - u);
								break;
							case "pin":
								e$$0("fixed", "top", v);
								break;
							case "bottom":
								e$$0("absolute", "top", b.y + (s.height || s.bottom - s.top) + u);
						}
						i = a;
					}
					var i;
					var k;
					var m;
					var s;
					var t;
					var p;
					var x;
					var q = c$$0.floatSpaceDockedOffsetX || 0;
					var u = c$$0.floatSpaceDockedOffsetY || 0;
					var B = c$$0.floatSpacePinnedOffsetX || 0;
					var v = c$$0.floatSpacePinnedOffsetY || 0;
					return function(c) {
						if (k = a$$0.editable()) {
							if (c) {
								if (c.name == "focus") {
									g.show();
								}
							}
							g.removeStyle("left");
							g.removeStyle("right");
							m = g.getClientRect();
							s = k.getClientRect();
							t = b$$0.getViewPaneSize();
							p = m.height;
							x = "pageXOffset" in b$$0.$ ? b$$0.$.pageXOffset : CKEDITOR.document.$.documentElement.scrollLeft;
							if (i) {
								if (p + u <= s.top) {
									h("top");
								} else {
									if (p + u > t.height - s.bottom) {
										h("pin");
									} else {
										h("bottom");
									}
								}
								c = t.width / 2;
								c = s.left > 0 && (s.right < t.width && s.width > m.width) ? a$$0.config.contentsLangDirection == "rtl" ? "right" : "left" : c - s.left > s.right - c ? "left" : "right";
								var e;
								if (m.width > t.width) {
									c = "left";
									e = 0;
								} else {
									e = c == "left" ? s.left > 0 ? s.left : 0 : s.right < t.width ? t.width - s.right : 0;
									if (e + m.width > t.width) {
										c = c == "left" ? "right" : "left";
										e = 0;
									}
								}
								g.setStyle(c, d((i == "pin" ? B : q) + e + (i == "pin" ? 0 : c == "left" ? x : -x)));
							} else {
								i = "pin";
								h("pin");
								j(c);
							}
						}
					};
				}();
				if (h$$0) {
					var g = CKEDITOR.document.getBody().append(CKEDITOR.dom.element.createFromHtml(e$$1.output({
						content: h$$0,
						id: a$$0.id,
						langDir: a$$0.lang.dir,
						langCode: a$$0.langCode,
						name: a$$0.name,
						style: "display:none;z-index:" + (c$$0.baseFloatZIndex - 1),
						topId: a$$0.ui.spaceId("top"),
						voiceLabel: a$$0.lang.editorPanel + ", " + a$$0.name
					})));
					var i$$0 = CKEDITOR.tools.eventsBuffer(500, j);
					var k$$0 = CKEDITOR.tools.eventsBuffer(100, j);
					g.unselectable();
					g.on("mousedown", function(a) {
						a = a.data;
						if (!a.getTarget().hasAscendant("a", 1)) {
							a.preventDefault();
						}
					});
					a$$0.on("focus", function(c) {
						j(c);
						a$$0.on("change", i$$0.input);
						b$$0.on("scroll", k$$0.input);
						b$$0.on("resize", k$$0.input);
					});
					a$$0.on("blur", function() {
						g.hide();
						a$$0.removeListener("change", i$$0.input);
						b$$0.removeListener("scroll", k$$0.input);
						b$$0.removeListener("resize", k$$0.input);
					});
					a$$0.on("destroy", function() {
						b$$0.removeListener("scroll", k$$0.input);
						b$$0.removeListener("resize", k$$0.input);
						g.clearCustomData();
						g.remove();
					});
					if (a$$0.focusManager.hasFocus) {
						g.show();
					}
					a$$0.focusManager.add(g, 1);
				}
			}
			var e$$1 = CKEDITOR.addTemplate("floatcontainer", '<div id="cke_{name}" class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '" dir="{langDir}" title="' + (CKEDITOR.env.gecko ? " " : "") + '" lang="{langCode}" role="application" style="{style}" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><div class="cke_inner"><div id="{topId}" class="cke_top" role="presentation">{content}</div></div></div>');
			var b$$0 = CKEDITOR.document.getWindow();
			var d = CKEDITOR.tools.cssLength;
			CKEDITOR.plugins.add("floatingspace", {
				init: function(b) {
					b.on("loaded", function() {
						a$$1(this);
					}, null, null, 20);
				}
			});
		})();
		CKEDITOR.plugins.add("htmlwriter", {
			init: function(a) {
				var e = new CKEDITOR.htmlWriter;
				e.forceSimpleAmpersand = a.config.forceSimpleAmpersand;
				e.indentationChars = a.config.dataIndentationChars || "\t";
				a.dataProcessor.writer = e;
			}
		});
		CKEDITOR.htmlWriter = CKEDITOR.tools.createClass({
			base: CKEDITOR.htmlParser.basicWriter,
			$: function() {
				this.base();
				this.indentationChars = "\t";
				this.selfClosingEnd = " />";
				this.lineBreakChars = "\n";
				this.sortAttributes = 1;
				this._.indent = 0;
				this._.indentation = "";
				this._.inPre = 0;
				this._.rules = {};
				var a = CKEDITOR.dtd;
				var e;
				for (e in CKEDITOR.tools.extend({}, a.$nonBodyContent, a.$block, a.$listItem, a.$tableContent)) {
					this.setRules(e, {
						indent: !a[e]["#"],
						breakBeforeOpen: 1,
						breakBeforeClose: !a[e]["#"],
						breakAfterClose: 1,
						needsSpace: e in a.$block && !(e in {
							li: 1,
							dt: 1,
							dd: 1
						})
					});
				}
				this.setRules("br", {
					breakAfterOpen: 1
				});
				this.setRules("title", {
					indent: 0,
					breakAfterOpen: 0
				});
				this.setRules("style", {
					indent: 0,
					breakBeforeClose: 1
				});
				this.setRules("pre", {
					breakAfterOpen: 1,
					indent: 0
				});
			},
			proto: {
				openTag: function(a) {
					var e = this._.rules[a];
					if (this._.afterCloser) {
						if (e && (e.needsSpace && this._.needsSpace)) {
							this._.output.push("\n");
						}
					}
					if (this._.indent) {
						this.indentation();
					} else {
						if (e && e.breakBeforeOpen) {
							this.lineBreak();
							this.indentation();
						}
					}
					this._.output.push("<", a);
					this._.afterCloser = 0;
				},
				openTagClose: function(a, e) {
					var b = this._.rules[a];
					if (e) {
						this._.output.push(this.selfClosingEnd);
						if (b && b.breakAfterClose) {
							this._.needsSpace = b.needsSpace;
						}
					} else {
						this._.output.push(">");
						if (b && b.indent) {
							this._.indentation = this._.indentation + this.indentationChars;
						}
					}
					if (b) {
						if (b.breakAfterOpen) {
							this.lineBreak();
						}
					}
					if (a == "pre") {
						this._.inPre = 1;
					}
				},
				attribute: function(a, e) {
					if (typeof e == "string") {
						if (this.forceSimpleAmpersand) {
							e = e.replace(/&amp;/g, "&");
						}
						e = CKEDITOR.tools.htmlEncodeAttr(e);
					}
					this._.output.push(" ", a, '="', e, '"');
				},
				closeTag: function(a) {
					var e = this._.rules[a];
					if (e && e.indent) {
						this._.indentation = this._.indentation.substr(this.indentationChars.length);
					}
					if (this._.indent) {
						this.indentation();
					} else {
						if (e && e.breakBeforeClose) {
							this.lineBreak();
							this.indentation();
						}
					}
					this._.output.push("</", a, ">");
					if (a == "pre") {
						this._.inPre = 0;
					}
					if (e && e.breakAfterClose) {
						this.lineBreak();
						this._.needsSpace = e.needsSpace;
					}
					this._.afterCloser = 1;
				},
				text: function(a) {
					if (this._.indent) {
						this.indentation();
						if (!this._.inPre) {
							a = CKEDITOR.tools.ltrim(a);
						}
					}
					this._.output.push(a);
				},
				comment: function(a) {
					if (this._.indent) {
						this.indentation();
					}
					this._.output.push("\x3c!--", a, "--\x3e");
				},
				lineBreak: function() {
					if (!this._.inPre) {
						if (this._.output.length > 0) {
							this._.output.push(this.lineBreakChars);
						}
					}
					this._.indent = 1;
				},
				indentation: function() {
					if (!this._.inPre) {
						if (this._.indentation) {
							this._.output.push(this._.indentation);
						}
					}
					this._.indent = 0;
				},
				reset: function() {
					this._.output = [];
					this._.indent = 0;
					this._.indentation = "";
					this._.afterCloser = 0;
					this._.inPre = 0;
				},
				setRules: function(a, e) {
					var b = this._.rules[a];
					if (b) {
						CKEDITOR.tools.extend(b, e, true);
					} else {
						this._.rules[a] = e;
					}
				}
			}
		});
		(function() {
			function a$$0(a, d) {
				if (!d) {
					d = a.getSelection().getSelectedElement();
				}
				if (d && (d.is("img") && (!d.data("cke-realelement") && !d.isReadOnly()))) {
					return d;
				}
			}

			function e(a) {
				var d = a.getStyle("float");
				if (d == "inherit" || d == "none") {
					d = 0;
				}
				if (!d) {
					d = a.getAttribute("align");
				}
				return d;
			}
			CKEDITOR.plugins.add("image", {
				requires: "dialog",
				init: function(b$$0) {
					if (!b$$0.plugins.image2) {
						CKEDITOR.dialog.add("image", this.path + "dialogs/image.js");
						var d$$0 = "img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}";
						if (CKEDITOR.dialog.isTabEnabled(b$$0, "image", "advanced")) {
							d$$0 = "img[alt,dir,id,lang,longdesc,!src,title]{*}(*)";
						}
						b$$0.addCommand("image", new CKEDITOR.dialogCommand("image", {
							allowedContent: d$$0,
							requiredContent: "img[alt,src]",
							contentTransformations: [
								["img{width}: sizeToStyle", "img[width]: sizeToAttribute"],
								["img{float}: alignmentToStyle", "img[align]: alignmentToAttribute"]
							]
						}));
						if (b$$0.ui.addButton) {
							b$$0.ui.addButton("Image", {
								label: b$$0.lang.common.image,
								command: "image",
								toolbar: "insert,10"
							});
						}
						b$$0.on("doubleclick", function(a) {
							var b = a.data.element;
							if (b.is("img") && (!b.data("cke-realelement") && !b.isReadOnly())) {
								a.data.dialog = "image";
							}
						});
						if (b$$0.addMenuItems) {
							b$$0.addMenuItems({
								image: {
									label: b$$0.lang.image.menu,
									command: "image",
									group: "image"
								}
							});
						}
						if (b$$0.contextMenu) {
							b$$0.contextMenu.addListener(function(d) {
								if (a$$0(b$$0, d)) {
									return {
										image: CKEDITOR.TRISTATE_OFF
									};
								}
							});
						}
					}
				},
				afterInit: function(b) {
					function d$$0(d) {
						var c$$0 = b.getCommand("justify" + d);
						if (c$$0) {
							if (d == "left" || d == "right") {
								c$$0.on("exec", function(c) {
									var j = a$$0(b);
									var g;
									if (j) {
										g = e(j);
										if (g == d) {
											j.removeStyle("float");
											if (d == e(j)) {
												j.removeAttribute("align");
											}
										} else {
											j.setStyle("float", d);
										}
										c.cancel();
									}
								});
							}
							c$$0.on("refresh", function(c) {
								var j = a$$0(b);
								if (j) {
									j = e(j);
									this.setState(j == d ? CKEDITOR.TRISTATE_ON : d == "right" || d == "left" ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
									c.cancel();
								}
							});
						}
					}
					if (!b.plugins.image2) {
						d$$0("left");
						d$$0("right");
						d$$0("center");
						d$$0("block");
					}
				}
			});
		})();
		CKEDITOR.config.image_removeLinkByEmptyURL = true;
		(function() {
			function a$$0(a, b) {
				b = b === void 0 || b;
				var c;
				if (b) {
					c = a.getComputedStyle("text-align");
				} else {
					for (; !a.hasAttribute || !a.hasAttribute("align") && !a.getStyle("text-align");) {
						c = a.getParent();
						if (!c) {
							break;
						}
						a = c;
					}
					c = a.getStyle("text-align") || (a.getAttribute("align") || "");
				}
				if (c) {
					c = c.replace(/(?:-(?:moz|webkit)-)?(?:start|auto)/i, "");
				}
				if (!c) {
					if (b) {
						c = a.getComputedStyle("direction") == "rtl" ? "right" : "left";
					}
				}
				return c;
			}

			function e$$0(a, b, c) {
				this.editor = a;
				this.name = b;
				this.value = c;
				this.context = "p";
				b = a.config.justifyClasses;
				var e = a.config.enterMode == CKEDITOR.ENTER_P ? "p" : "div";
				if (b) {
					switch (c) {
						case "left":
							this.cssClassName = b[0];
							break;
						case "center":
							this.cssClassName = b[1];
							break;
						case "right":
							this.cssClassName = b[2];
							break;
						case "justify":
							this.cssClassName = b[3];
					}
					this.cssClassRegex = RegExp("(?:^|\\s+)(?:" + b.join("|") + ")(?=$|\\s)");
					this.requiredContent = e + "(" + this.cssClassName + ")";
				} else {
					this.requiredContent = e + "{text-align}";
				}
				this.allowedContent = {
					"caption div h1 h2 h3 h4 h5 h6 p pre td th li": {
						propertiesOnly: true,
						styles: this.cssClassName ? null : "text-align",
						classes: this.cssClassName || null
					}
				};
				if (a.config.enterMode == CKEDITOR.ENTER_BR) {
					this.allowedContent.div = true;
				}
			}

			function b$$0(a) {
				var b = a.editor;
				var c = b.createRange();
				c.setStartBefore(a.data.node);
				c.setEndAfter(a.data.node);
				var e = new CKEDITOR.dom.walker(c);
				var j;
				for (; j = e.next();) {
					if (j.type == CKEDITOR.NODE_ELEMENT) {
						if (!j.equals(a.data.node) && j.getDirection()) {
							c.setStartAfter(j);
							e = new CKEDITOR.dom.walker(c);
						} else {
							var g = b.config.justifyClasses;
							if (g) {
								if (j.hasClass(g[0])) {
									j.removeClass(g[0]);
									j.addClass(g[2]);
								} else {
									if (j.hasClass(g[2])) {
										j.removeClass(g[2]);
										j.addClass(g[0]);
									}
								}
							}
							g = j.getStyle("text-align");
							if (g == "left") {
								j.setStyle("text-align", "right");
							} else {
								if (g == "right") {
									j.setStyle("text-align", "left");
								}
							}
						}
					}
				}
			}
			e$$0.prototype = {
				exec: function(b) {
					var f = b.getSelection();
					var c = b.config.enterMode;
					if (f) {
						var e = f.createBookmarks();
						var j = f.getRanges();
						var g = this.cssClassName;
						var i;
						var k;
						var n = b.config.useComputedState;
						n = n === void 0 || n;
						var o = j.length - 1;
						for (; o >= 0; o--) {
							i = j[o].createIterator();
							i.enlargeBr = c != CKEDITOR.ENTER_BR;
							for (; k = i.getNextParagraph(c == CKEDITOR.ENTER_P ? "p" : "div");) {
								if (!k.isReadOnly()) {
									k.removeAttribute("align");
									k.removeStyle("text-align");
									var r = g && (k.$.className = CKEDITOR.tools.ltrim(k.$.className.replace(this.cssClassRegex, "")));
									var l = this.state == CKEDITOR.TRISTATE_OFF && (!n || a$$0(k, true) != this.value);
									if (g) {
										if (l) {
											k.addClass(g);
										} else {
											if (!r) {
												k.removeAttribute("class");
											}
										}
									} else {
										if (l) {
											k.setStyle("text-align", this.value);
										}
									}
								}
							}
						}
						b.focus();
						b.forceNextSelectionCheck();
						f.selectBookmarks(e);
					}
				},
				refresh: function(b, f) {
					var c = f.block || f.blockLimit;
					this.setState(c.getName() != "body" && a$$0(c, this.editor.config.useComputedState) == this.value ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
				}
			};
			CKEDITOR.plugins.add("justify", {
				init: function(a) {
					if (!a.blockless) {
						var f = new e$$0(a, "justifyleft", "left");
						var c = new e$$0(a, "justifycenter", "center");
						var h = new e$$0(a, "justifyright", "right");
						var j = new e$$0(a, "justifyblock", "justify");
						a.addCommand("justifyleft", f);
						a.addCommand("justifycenter", c);
						a.addCommand("justifyright", h);
						a.addCommand("justifyblock", j);
						if (a.ui.addButton) {
							a.ui.addButton("JustifyLeft", {
								label: a.lang.justify.left,
								command: "justifyleft",
								toolbar: "align,10"
							});
							a.ui.addButton("JustifyCenter", {
								label: a.lang.justify.center,
								command: "justifycenter",
								toolbar: "align,20"
							});
							a.ui.addButton("JustifyRight", {
								label: a.lang.justify.right,
								command: "justifyright",
								toolbar: "align,30"
							});
							a.ui.addButton("JustifyBlock", {
								label: a.lang.justify.block,
								command: "justifyblock",
								toolbar: "align,40"
							});
						}
						a.on("dirChanged", b$$0);
					}
				}
			});
		})();
		(function() {
			function a$$0(a, b) {
				var f = d$$0.exec(a);
				var e = d$$0.exec(b);
				if (f) {
					if (!f[2] && e[2] == "px") {
						return e[1];
					}
					if (f[2] == "px" && !e[2]) {
						return e[1] + "px";
					}
				}
				return b;
			}
			var e$$0 = CKEDITOR.htmlParser.cssStyle;
			var b$$0 = CKEDITOR.tools.cssLength;
			var d$$0 = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i;
			var f$$0 = {
				elements: {
					$: function(b) {
						var d = b.attributes;
						if ((d = (d = (d = d && d["data-cke-realelement"]) && new CKEDITOR.htmlParser.fragment.fromHtml(decodeURIComponent(d))) && d.children[0]) && b.attributes["data-cke-resizable"]) {
							var f = (new e$$0(b)).rules;
							b = d.attributes;
							var g = f.width;
							f = f.height;
							if (g) {
								b.width = a$$0(b.width, g);
							}
							if (f) {
								b.height = a$$0(b.height, f);
							}
						}
						return d;
					}
				}
			};
			CKEDITOR.plugins.add("fakeobjects", {
				init: function(a) {
					a.filter.allow("img[!data-cke-realelement,src,alt,title](*){*}", "fakeobjects");
				},
				afterInit: function(a) {
					if (a = (a = a.dataProcessor) && a.htmlFilter) {
						a.addRules(f$$0, {
							applyToAll: true
						});
					}
				}
			});
			CKEDITOR.editor.prototype.createFakeElement = function(a, d, f, g) {
				var i = this.lang.fakeobjects;
				i = i[f] || i.unknown;
				d = {
					"class": d,
					"data-cke-realelement": encodeURIComponent(a.getOuterHtml()),
					"data-cke-real-node-type": a.type,
					alt: i,
					title: i,
					align: a.getAttribute("align") || ""
				};
				if (!CKEDITOR.env.hc) {
					d.src = CKEDITOR.tools.transparentImageData;
				}
				if (f) {
					d["data-cke-real-element-type"] = f;
				}
				if (g) {
					d["data-cke-resizable"] = g;
					f = new e$$0;
					g = a.getAttribute("width");
					a = a.getAttribute("height");
					if (g) {
						f.rules.width = b$$0(g);
					}
					if (a) {
						f.rules.height = b$$0(a);
					}
					f.populate(d);
				}
				return this.document.createElement("img", {
					attributes: d
				});
			};
			CKEDITOR.editor.prototype.createFakeParserElement = function(a, d, f, g) {
				var i = this.lang.fakeobjects;
				i = i[f] || i.unknown;
				var k;
				k = new CKEDITOR.htmlParser.basicWriter;
				a.writeHtml(k);
				k = k.getHtml();
				d = {
					"class": d,
					"data-cke-realelement": encodeURIComponent(k),
					"data-cke-real-node-type": a.type,
					alt: i,
					title: i,
					align: a.attributes.align || ""
				};
				if (!CKEDITOR.env.hc) {
					d.src = CKEDITOR.tools.transparentImageData;
				}
				if (f) {
					d["data-cke-real-element-type"] = f;
				}
				if (g) {
					d["data-cke-resizable"] = g;
					g = a.attributes;
					a = new e$$0;
					f = g.width;
					g = g.height;
					if (f != void 0) {
						a.rules.width = b$$0(f);
					}
					if (g != void 0) {
						a.rules.height = b$$0(g);
					}
					a.populate(d);
				}
				return new CKEDITOR.htmlParser.element("img", d);
			};
			CKEDITOR.editor.prototype.restoreRealElement = function(b) {
				if (b.data("cke-real-node-type") != CKEDITOR.NODE_ELEMENT) {
					return null;
				}
				var d = CKEDITOR.dom.element.createFromHtml(decodeURIComponent(b.data("cke-realelement")), this.document);
				if (b.data("cke-resizable")) {
					var f = b.getStyle("width");
					b = b.getStyle("height");
					if (f) {
						d.setAttribute("width", a$$0(d.getAttribute("width"), f));
					}
					if (b) {
						d.setAttribute("height", a$$0(d.getAttribute("height"), b));
					}
				}
				return d;
			};
		})();
		"use strict";
		(function() {
			function a$$2(a) {
				return a.replace(/'/g, "\\$&");
			}

			function e$$0(a) {
				var b;
				var c = a.length;
				var d = [];
				var f = 0;
				for (; f < c; f++) {
					b = a.charCodeAt(f);
					d.push(b);
				}
				return "String.fromCharCode(" + d.join(",") + ")";
			}

			function b$$1(b, c) {
				var d = b.plugins.link;
				var f = d.compiledProtectionFunction.params;
				var e;
				var h;
				h = [d.compiledProtectionFunction.name, "("];
				var g = 0;
				for (; g < f.length; g++) {
					d = f[g].toLowerCase();
					e = c[d];
					if (g > 0) {
						h.push(",");
					}
					h.push("'", e ? a$$2(encodeURIComponent(c[d])) : "", "'");
				}
				h.push(")");
				return h.join("");
			}

			function d$$1(a$$1) {
				a$$1 = a$$1.config.emailProtection || "";
				var b;
				if (a$$1 && a$$1 != "encode") {
					b = {};
					a$$1.replace(/^([^(]+)\(([^)]+)\)$/, function(a$$0, c, d) {
						b.name = c;
						b.params = [];
						d.replace(/[^,\s]+/g, function(a) {
							b.params.push(a);
						});
					});
				}
				return b;
			}
			CKEDITOR.plugins.add("link", {
				requires: "dialog,fakeobjects",
				onLoad: function() {
					function a(b) {
						return c.replace(/%1/g, b == "rtl" ? "right" : "left").replace(/%2/g, "cke_contents_" + b);
					}
					var b$$0 = "background:url(" + CKEDITOR.getUrl(this.path + "images" + (CKEDITOR.env.hidpi ? "/hidpi" : "") + "/anchor.png") + ") no-repeat %1 center;border:1px dotted #00f;background-size:16px;";
					var c = ".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{" + b$$0 + "padding-%1:18px;cursor:auto;}.%2 img.cke_anchor{" + b$$0 + "width:16px;min-height:15px;height:1.15em;vertical-align:text-bottom;}";
					CKEDITOR.addCss(a("ltr") + a("rtl"));
				},
				init: function(a) {
					var b$$0 = "a[!href]";
					if (CKEDITOR.dialog.isTabEnabled(a, "link", "advanced")) {
						b$$0 = b$$0.replace("]", ",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)");
					}
					if (CKEDITOR.dialog.isTabEnabled(a, "link", "target")) {
						b$$0 = b$$0.replace("]", ",target,onclick]");
					}
					a.addCommand("link", new CKEDITOR.dialogCommand("link", {
						allowedContent: b$$0,
						requiredContent: "a[href]"
					}));
					a.addCommand("anchor", new CKEDITOR.dialogCommand("anchor", {
						allowedContent: "a[!name,id]",
						requiredContent: "a[name]"
					}));
					a.addCommand("unlink", new CKEDITOR.unlinkCommand);
					a.addCommand("removeAnchor", new CKEDITOR.removeAnchorCommand);
					a.setKeystroke(CKEDITOR.CTRL + 76, "link");
					if (a.ui.addButton) {
						a.ui.addButton("Link", {
							label: a.lang.link.toolbar,
							command: "link",
							toolbar: "links,10"
						});
						a.ui.addButton("Unlink", {
							label: a.lang.link.unlink,
							command: "unlink",
							toolbar: "links,20"
						});
						a.ui.addButton("Anchor", {
							label: a.lang.link.anchor.toolbar,
							command: "anchor",
							toolbar: "links,30"
						});
					}
					CKEDITOR.dialog.add("link", this.path + "dialogs/link.js");
					CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js");
					a.on("doubleclick", function(b) {
						var c = CKEDITOR.plugins.link.getSelectedLink(a) || b.data.element;
						if (!c.isReadOnly()) {
							if (c.is("a")) {
								b.data.dialog = c.getAttribute("name") && (!c.getAttribute("href") || !c.getChildCount()) ? "anchor" : "link";
								b.data.link = c;
							} else {
								if (CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, c)) {
									b.data.dialog = "anchor";
								}
							}
						}
					}, null, null, 0);
					a.on("doubleclick", function(b) {
						if (b.data.link) {
							a.getSelection().selectElement(b.data.link);
						}
					}, null, null, 20);
					if (a.addMenuItems) {
						a.addMenuItems({
							anchor: {
								label: a.lang.link.anchor.menu,
								command: "anchor",
								group: "anchor",
								order: 1
							},
							removeAnchor: {
								label: a.lang.link.anchor.remove,
								command: "removeAnchor",
								group: "anchor",
								order: 5
							},
							link: {
								label: a.lang.link.menu,
								command: "link",
								group: "link",
								order: 1
							},
							unlink: {
								label: a.lang.link.unlink,
								command: "unlink",
								group: "link",
								order: 5
							}
						});
					}
					if (a.contextMenu) {
						a.contextMenu.addListener(function(b) {
							if (!b || b.isReadOnly()) {
								return null;
							}
							b = CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b);
							if (!b && !(b = CKEDITOR.plugins.link.getSelectedLink(a))) {
								return null;
							}
							var c = {};
							if (b.getAttribute("href")) {
								if (b.getChildCount()) {
									c = {
										link: CKEDITOR.TRISTATE_OFF,
										unlink: CKEDITOR.TRISTATE_OFF
									};
								}
							}
							if (b && b.hasAttribute("name")) {
								c.anchor = c.removeAnchor = CKEDITOR.TRISTATE_OFF;
							}
							return c;
						});
					}
					this.compiledProtectionFunction = d$$1(a);
				},
				afterInit: function(a) {
					a.dataProcessor.dataFilter.addRules({
						elements: {
							a: function(b) {
								return !b.attributes.name ? null : !b.children.length ? a.createFakeParserElement(b, "cke_anchor", "anchor") : null;
							}
						}
					});
					var b$$0 = a._.elementsPath && a._.elementsPath.filters;
					if (b$$0) {
						b$$0.push(function(b, c) {
							if (c == "a" && (CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b) || b.getAttribute("name") && (!b.getAttribute("href") || !b.getChildCount()))) {
								return "anchor";
							}
						});
					}
				}
			});
			var f$$0 = /^javascript:/;
			var c$$0 = /^mailto:([^?]+)(?:\?(.+))?$/;
			var h$$0 = /subject=([^;?:@&=$,\/]*)/;
			var j$$0 = /body=([^;?:@&=$,\/]*)/;
			var g$$0 = /^#(.*)$/;
			var i$$0 = /^((?:http|https|ftp|news):\/\/)?(.*)$/;
			var k$$0 = /^(_(?:self|top|parent|blank))$/;
			var n$$0 = /^javascript:void\(location\.href='mailto:'\+String\.fromCharCode\(([^)]+)\)(?:\+'(.*)')?\)$/;
			var o$$0 = /^javascript:([^(]+)\(([^)]+)\)$/;
			var r = /\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/;
			var l$$0 = /(?:^|,)([^=]+)=(\d+|yes|no)/gi;
			var m = {
				id: "advId",
				dir: "advLangDir",
				accessKey: "advAccessKey",
				name: "advName",
				lang: "advLangCode",
				tabindex: "advTabIndex",
				title: "advTitle",
				type: "advContentType",
				"class": "advCSSClasses",
				charset: "advCharset",
				style: "advStyles",
				rel: "advRel"
			};
			CKEDITOR.plugins.link = {
				getSelectedLink: function(a) {
					var b = a.getSelection();
					var c = b.getSelectedElement();
					if (c && c.is("a")) {
						return c;
					}
					if (b = b.getRanges()[0]) {
						b.shrink(CKEDITOR.SHRINK_TEXT);
						return a.elementPath(b.getCommonAncestor()).contains("a", 1);
					}
					return null;
				},
				getEditorAnchors: function(a) {
					var b = a.editable();
					var c = b.isInline() && !a.plugins.divarea ? a.document : b;
					b = c.getElementsByTag("a");
					c = c.getElementsByTag("img");
					var d = [];
					var f = 0;
					var e;
					for (; e = b.getItem(f++);) {
						if (e.data("cke-saved-name") || e.hasAttribute("name")) {
							d.push({
								name: e.data("cke-saved-name") || e.getAttribute("name"),
								id: e.getAttribute("id")
							});
						}
					}
					f = 0;
					for (; e = c.getItem(f++);) {
						if (e = this.tryRestoreFakeAnchor(a, e)) {
							d.push({
								name: e.getAttribute("name"),
								id: e.getAttribute("id")
							});
						}
					}
					return d;
				},
				fakeAnchor: true,
				tryRestoreFakeAnchor: function(a, b) {
					if (b && (b.data("cke-real-element-type") && b.data("cke-real-element-type") == "anchor")) {
						var c = a.restoreRealElement(b);
						if (c.data("cke-saved-name")) {
							return c;
						}
					}
				},
				parseLinkAttributes: function(a$$0, b$$0) {
					var d$$0 = b$$0 && (b$$0.data("cke-saved-href") || b$$0.getAttribute("href")) || "";
					var e = a$$0.plugins.link.compiledProtectionFunction;
					var q = a$$0.config.emailProtection;
					var u;
					var B = {};
					if (d$$0.match(f$$0)) {
						if (q == "encode") {
							d$$0 = d$$0.replace(n$$0, function(a, b, c) {
								return "mailto:" + String.fromCharCode.apply(String, b.split(",")) + (c && c.replace(/\\'/g, "'"));
							});
						} else {
							if (q) {
								d$$0.replace(o$$0, function(a, b, c) {
									if (b == e.name) {
										B.type = "email";
										a = B.email = {};
										b = /(^')|('$)/g;
										c = c.match(/[^,\s]+/g);
										var d = c.length;
										var f;
										var h;
										var g = 0;
										for (; g < d; g++) {
											f = decodeURIComponent;
											h = c[g].replace(b, "").replace(/\\'/g, "'");
											h = f(h);
											f = e.params[g].toLowerCase();
											a[f] = h;
										}
										a.address = [a.name, a.domain].join("@");
									}
								});
							}
						}
					}
					if (!B.type) {
						if (q = d$$0.match(g$$0)) {
							B.type = "anchor";
							B.anchor = {};
							B.anchor.name = B.anchor.id = q[1];
						} else {
							if (q = d$$0.match(c$$0)) {
								u = d$$0.match(h$$0);
								d$$0 = d$$0.match(j$$0);
								B.type = "email";
								var v = B.email = {};
								v.address = q[1];
								if (u) {
									v.subject = decodeURIComponent(u[1]);
								}
								if (d$$0) {
									v.body = decodeURIComponent(d$$0[1]);
								}
							} else {
								if (d$$0 && (u = d$$0.match(i$$0))) {
									B.type = "url";
									B.url = {};
									B.url.protocol = u[1];
									B.url.url = u[2];
								}
							}
						}
					}
					if (b$$0) {
						if (d$$0 = b$$0.getAttribute("target")) {
							B.target = {
								type: d$$0.match(k$$0) ? d$$0 : "frame",
								name: d$$0
							};
						} else {
							if (d$$0 = (d$$0 = b$$0.data("cke-pa-onclick") || b$$0.getAttribute("onclick")) && d$$0.match(r)) {
								B.target = {
									type: "popup",
									name: d$$0[1]
								};
								for (; q = l$$0.exec(d$$0[2]);) {
									if ((q[2] == "yes" || q[2] == "1") && !(q[1] in {
										height: 1,
										width: 1,
										top: 1,
										left: 1
									})) {
										B.target[q[1]] = true;
									} else {
										if (isFinite(q[2])) {
											B.target[q[1]] = q[2];
										}
									}
								}
							}
						}
						d$$0 = {};
						var z;
						for (z in m) {
							if (q = b$$0.getAttribute(z)) {
								d$$0[m[z]] = q;
							}
						}
						if (z = b$$0.data("cke-saved-name") || d$$0.advName) {
							d$$0.advName = z;
						}
						if (!CKEDITOR.tools.isEmpty(d$$0)) {
							B.advanced = d$$0;
						}
					}
					return B;
				},
				getLinkAttributes: function(c, d) {
					var f = c.config.emailProtection || "";
					var h = {};
					switch (d.type) {
						case "url":
							f = d.url && d.url.protocol != void 0 ? d.url.protocol : "http://";
							var g = d.url && CKEDITOR.tools.trim(d.url.url) || "";
							h["data-cke-saved-href"] = g.indexOf("/") === 0 ? g : f + g;
							break;
						case "anchor":
							f = d.anchor && d.anchor.id;
							h["data-cke-saved-href"] = "#" + (d.anchor && d.anchor.name || (f || ""));
							break;
						case "email":
							var i = d.email;
							g = i.address;
							switch (f) {
								case "":
									;
								case "encode":
									var j = encodeURIComponent(i.subject || "");
									var k = encodeURIComponent(i.body || "");
									i = [];
									if (j) {
										i.push("subject=" + j);
									}
									if (k) {
										i.push("body=" + k);
									}
									i = i.length ? "?" + i.join("&") : "";
									if (f == "encode") {
										f = ["javascript:void(location.href='mailto:'+", e$$0(g)];
										if (i) {
											f.push("+'", a$$2(i), "'");
										}
										f.push(")");
									} else {
										f = ["mailto:", g, i];
									}
									break;
								default:
									f = g.split("@", 2);
									i.name = f[0];
									i.domain = f[1];
									f = ["javascript:", b$$1(c, i)];
							}
							h["data-cke-saved-href"] = f.join("");
					}
					if (d.target) {
						if (d.target.type == "popup") {
							f = ["window.open(this.href, '", d.target.name || "", "', '"];
							var l = ["resizable", "status", "location", "toolbar", "menubar", "fullscreen", "scrollbars", "dependent"];
							g = l.length;
							j = function(a) {
								if (d.target[a]) {
									l.push(a + "=" + d.target[a]);
								}
							};
							i = 0;
							for (; i < g; i++) {
								l[i] = l[i] + (d.target[l[i]] ? "=yes" : "=no");
							}
							j("width");
							j("left");
							j("height");
							j("top");
							f.push(l.join(","), "'); return false;");
							h["data-cke-pa-onclick"] = f.join("");
						} else {
							if (d.target.type != "notSet" && d.target.name) {
								h.target = d.target.name;
							}
						}
					}
					if (d.advanced) {
						var n;
						for (n in m) {
							if (f = d.advanced[m[n]]) {
								h[n] = f;
							}
						}
						if (h.name) {
							h["data-cke-saved-name"] = h.name;
						}
					}
					if (h["data-cke-saved-href"]) {
						h.href = h["data-cke-saved-href"];
					}
					n = CKEDITOR.tools.extend({
						target: 1,
						onclick: 1,
						"data-cke-pa-onclick": 1,
						"data-cke-saved-name": 1
					}, m);
					var o;
					for (o in h) {
						delete n[o];
					}
					return {
						set: h,
						removed: CKEDITOR.tools.objectKeys(n)
					};
				}
			};
			CKEDITOR.unlinkCommand = function() {};
			CKEDITOR.unlinkCommand.prototype = {
				exec: function(a) {
					var b = new CKEDITOR.style({
						element: "a",
						type: CKEDITOR.STYLE_INLINE,
						alwaysRemoveElement: 1
					});
					a.removeStyle(b);
				},
				refresh: function(a, b) {
					var c = b.lastElement && b.lastElement.getAscendant("a", true);
					if (c && (c.getName() == "a" && (c.getAttribute("href") && c.getChildCount()))) {
						this.setState(CKEDITOR.TRISTATE_OFF);
					} else {
						this.setState(CKEDITOR.TRISTATE_DISABLED);
					}
				},
				contextSensitive: 1,
				startDisabled: 1,
				requiredContent: "a[href]"
			};
			CKEDITOR.removeAnchorCommand = function() {};
			CKEDITOR.removeAnchorCommand.prototype = {
				exec: function(a) {
					var b = a.getSelection();
					var c = b.createBookmarks();
					var d;
					if (b && ((d = b.getSelectedElement()) && (!d.getChildCount() ? CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, d) : d.is("a")))) {
						d.remove(1);
					} else {
						if (d = CKEDITOR.plugins.link.getSelectedLink(a)) {
							if (d.hasAttribute("href")) {
								d.removeAttributes({
									name: 1,
									"data-cke-saved-name": 1
								});
								d.removeClass("cke_anchor");
							} else {
								d.remove(1);
							}
						}
					}
					b.selectBookmarks(c);
				},
				requiredContent: "a[name]"
			};
			CKEDITOR.tools.extend(CKEDITOR.config, {
				linkShowAdvancedTab: true,
				linkShowTargetTab: true
			});
		})();
		(function() {
			function a$$0(a) {
				if (!a || (a.type != CKEDITOR.NODE_ELEMENT || a.getName() != "form")) {
					return [];
				}
				var b = [];
				var d = ["style", "className"];
				var f = 0;
				for (; f < d.length; f++) {
					var e = a.$.elements.namedItem(d[f]);
					if (e) {
						e = new CKEDITOR.dom.element(e);
						b.push([e, e.nextSibling]);
						e.remove();
					}
				}
				return b;
			}

			function e$$0(a, b) {
				if (a && (!(a.type != CKEDITOR.NODE_ELEMENT || a.getName() != "form") && b.length > 0)) {
					var d = b.length - 1;
					for (; d >= 0; d--) {
						var f = b[d][0];
						var e = b[d][1];
						if (e) {
							f.insertBefore(e);
						} else {
							f.appendTo(a);
						}
					}
				}
			}

			function b$$0(b, d) {
				var f = a$$0(b);
				var g = {};
				var i = b.$;
				if (!d) {
					g["class"] = i.className || "";
					i.className = "";
				}
				g.inline = i.style.cssText || "";
				if (!d) {
					i.style.cssText = "position: static; overflow: visible";
				}
				e$$0(f);
				return g;
			}

			function d$$0(b, d) {
				var f = a$$0(b);
				var g = b.$;
				if ("class" in d) {
					g.className = d["class"];
				}
				if ("inline" in d) {
					g.style.cssText = d.inline;
				}
				e$$0(f);
			}

			function f$$0(a) {
				if (!a.editable().isInline()) {
					var b = CKEDITOR.instances;
					var d;
					for (d in b) {
						var f = b[d];
						if (f.mode == "wysiwyg" && !f.readOnly) {
							f = f.document.getBody();
							f.setAttribute("contentEditable", false);
							f.setAttribute("contentEditable", true);
						}
					}
					if (a.editable().hasFocus) {
						a.toolbox.focus();
						a.focus();
					}
				}
			}
			CKEDITOR.plugins.add("maximize", {
				init: function(a) {
					function e() {
						var b = i.getViewPaneSize();
						a.resize(b.width, b.height, null, true);
					}
					if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
						var j = a.lang;
						var g = CKEDITOR.document;
						var i = g.getWindow();
						var k;
						var n;
						var o;
						var r = CKEDITOR.TRISTATE_OFF;
						a.addCommand("maximize", {
							modes: {
								wysiwyg: !CKEDITOR.env.iOS,
								source: !CKEDITOR.env.iOS
							},
							readOnly: 1,
							editorFocus: false,
							exec: function() {
								var l = a.container.getChild(1);
								var m = a.ui.space("contents");
								if (a.mode == "wysiwyg") {
									var s = a.getSelection();
									k = s && s.getRanges();
									n = i.getScrollPosition();
								} else {
									var t = a.editable().$;
									k = !CKEDITOR.env.ie && [t.selectionStart, t.selectionEnd];
									n = [t.scrollLeft, t.scrollTop];
								}
								if (this.state == CKEDITOR.TRISTATE_OFF) {
									i.on("resize", e);
									o = i.getScrollPosition();
									s = a.container;
									for (; s = s.getParent();) {
										s.setCustomData("maximize_saved_styles", b$$0(s));
										s.setStyle("z-index", a.config.baseFloatZIndex - 5);
									}
									m.setCustomData("maximize_saved_styles", b$$0(m, true));
									l.setCustomData("maximize_saved_styles", b$$0(l, true));
									m = {
										overflow: CKEDITOR.env.webkit ? "" : "hidden",
										width: 0,
										height: 0
									};
									g.getDocumentElement().setStyles(m);
									if (!CKEDITOR.env.gecko) {
										g.getDocumentElement().setStyle("position", "fixed");
									}
									if (!CKEDITOR.env.gecko || !CKEDITOR.env.quirks) {
										g.getBody().setStyles(m);
									}
									if (CKEDITOR.env.ie) {
										setTimeout(function() {
											i.$.scrollTo(0, 0);
										}, 0);
									} else {
										i.$.scrollTo(0, 0);
									}
									l.setStyle("position", CKEDITOR.env.gecko && CKEDITOR.env.quirks ? "fixed" : "absolute");
									l.$.offsetLeft;
									l.setStyles({
										"z-index": a.config.baseFloatZIndex - 5,
										left: "0px",
										top: "0px"
									});
									l.addClass("cke_maximized");
									e();
									m = l.getDocumentPosition();
									l.setStyles({
										left: -1 * m.x + "px",
										top: -1 * m.y + "px"
									});
									if (CKEDITOR.env.gecko) {
										f$$0(a);
									}
								} else {
									if (this.state == CKEDITOR.TRISTATE_ON) {
										i.removeListener("resize", e);
										m = [m, l];
										s = 0;
										for (; s < m.length; s++) {
											d$$0(m[s], m[s].getCustomData("maximize_saved_styles"));
											m[s].removeCustomData("maximize_saved_styles");
										}
										s = a.container;
										for (; s = s.getParent();) {
											d$$0(s, s.getCustomData("maximize_saved_styles"));
											s.removeCustomData("maximize_saved_styles");
										}
										if (CKEDITOR.env.ie) {
											setTimeout(function() {
												i.$.scrollTo(o.x, o.y);
											}, 0);
										} else {
											i.$.scrollTo(o.x, o.y);
										}
										l.removeClass("cke_maximized");
										if (CKEDITOR.env.webkit) {
											l.setStyle("display", "inline");
											setTimeout(function() {
												l.setStyle("display", "block");
											}, 0);
										}
										a.fire("resize");
									}
								}
								this.toggleState();
								if (s = this.uiItems[0]) {
									m = this.state == CKEDITOR.TRISTATE_OFF ? j.maximize.maximize : j.maximize.minimize;
									s = CKEDITOR.document.getById(s._.id);
									s.getChild(1).setHtml(m);
									s.setAttribute("title", m);
									s.setAttribute("href", 'javascript:void("' + m + '");');
								}
								if (a.mode == "wysiwyg") {
									if (k) {
										if (CKEDITOR.env.gecko) {
											f$$0(a);
										}
										a.getSelection().selectRanges(k);
										if (t = a.getSelection().getStartElement()) {
											t.scrollIntoView(true);
										}
									} else {
										i.$.scrollTo(n.x, n.y);
									}
								} else {
									if (k) {
										t.selectionStart = k[0];
										t.selectionEnd = k[1];
									}
									t.scrollLeft = n[0];
									t.scrollTop = n[1];
								}
								k = n = null;
								r = this.state;
								a.fire("maximize", this.state);
							},
							canUndo: false
						});
						if (a.ui.addButton) {
							a.ui.addButton("Maximize", {
								label: j.maximize.maximize,
								command: "maximize",
								toolbar: "tools,10"
							});
						}
						a.on("mode", function() {
							var b = a.getCommand("maximize");
							b.setState(b.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : r);
						}, null, null, 100);
					}
				}
			});
		})();
		(function() {
			var a;
			var e$$0 = {
				modes: {
					wysiwyg: 1,
					source: 1
				},
				canUndo: false,
				readOnly: 1,
				exec: function(b) {
					var d;
					var f = b.config;
					var c = f.baseHref ? '<base href="' + f.baseHref + '"/>' : "";
					if (f.fullPage) {
						d = b.getData().replace(/<head>/, "$&" + c).replace(/[^>]*(?=<\/title>)/, "$& &mdash; " + b.lang.preview.preview);
					} else {
						f = "<body ";
						var e = b.document && b.document.getBody();
						if (e) {
							if (e.getAttribute("id")) {
								f = f + ('id="' + e.getAttribute("id") + '" ');
							}
							if (e.getAttribute("class")) {
								f = f + ('class="' + e.getAttribute("class") + '" ');
							}
						}
						d = b.config.docType + '<html dir="' + b.config.contentsLangDirection + '"><head>' + c + "<title>" + b.lang.preview.preview + "</title>" + CKEDITOR.tools.buildStyleHtml(b.config.contentsCss) + "</head>" + (f + ">") + b.getData() + "</body></html>";
					}
					c = 640;
					f = 420;
					e = 80;
					try {
						var j = window.screen;
						c = Math.round(j.width * 0.8);
						f = Math.round(j.height * 0.7);
						e = Math.round(j.width * 0.1);
					} catch (g) {}
					if (b.fire("contentPreview", b = {
						dataValue: d
					}) === false) {
						return false;
					}
					j = "";
					var i;
					if (CKEDITOR.env.ie) {
						window._cke_htmlToLoad = b.dataValue;
						i = "javascript:void( (function(){document.open();" + ("(" + CKEDITOR.tools.fixDomain + ")();").replace(/\/\/.*?\n/g, "").replace(/parent\./g, "window.opener.") + "document.write( window.opener._cke_htmlToLoad );document.close();window.opener._cke_htmlToLoad = null;})() )";
						j = "";
					}
					if (CKEDITOR.env.gecko) {
						window._cke_htmlToLoad = b.dataValue;
						j = a + "preview.html";
					}
					j = window.open(j, null, "toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=" + c + ",height=" + f + ",left=" + e);
					if (CKEDITOR.env.ie && j) {
						j.location = i;
					}
					if (!CKEDITOR.env.ie && !CKEDITOR.env.gecko) {
						i = j.document;
						i.open();
						i.write(b.dataValue);
						i.close();
					}
					return true;
				}
			};
			CKEDITOR.plugins.add("preview", {
				init: function(b) {
					if (b.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
						a = this.path;
						b.addCommand("preview", e$$0);
						if (b.ui.addButton) {
							b.ui.addButton("Preview", {
								label: b.lang.preview.preview,
								command: "preview",
								toolbar: "document,40"
							});
						}
					}
				}
			});
		})();
		CKEDITOR.plugins.add("resize", {
			init: function(a) {
				var e;
				var b$$0;
				var d$$0;
				var f;
				var c$$0 = a.config;
				var h$$0 = a.ui.spaceId("resizer");
				var j = a.element ? a.element.getDirection(1) : "ltr";
				if (!c$$0.resize_dir) {
					c$$0.resize_dir = "vertical";
				}
				if (c$$0.resize_maxWidth == void 0) {
					c$$0.resize_maxWidth = 3E3;
				}
				if (c$$0.resize_maxHeight == void 0) {
					c$$0.resize_maxHeight = 3E3;
				}
				if (c$$0.resize_minWidth == void 0) {
					c$$0.resize_minWidth = 750;
				}
				if (c$$0.resize_minHeight == void 0) {
					c$$0.resize_minHeight = 250;
				}
				if (c$$0.resize_enabled !== false) {
					var g$$0 = null;
					var i = (c$$0.resize_dir == "both" || c$$0.resize_dir == "horizontal") && c$$0.resize_minWidth != c$$0.resize_maxWidth;
					var k = (c$$0.resize_dir == "both" || c$$0.resize_dir == "vertical") && c$$0.resize_minHeight != c$$0.resize_maxHeight;
					var n$$0 = function(g) {
						var h = e;
						var n = b$$0;
						var o = h + (g.data.$.screenX - d$$0) * (j == "rtl" ? -1 : 1);
						g = n + (g.data.$.screenY - f);
						if (i) {
							h = Math.max(c$$0.resize_minWidth, Math.min(o, c$$0.resize_maxWidth));
						}
						if (k) {
							n = Math.max(c$$0.resize_minHeight, Math.min(g, c$$0.resize_maxHeight));
						}
						a.resize(i ? h : null, n);
					};
					var o$$0 = function() {
						CKEDITOR.document.removeListener("mousemove", n$$0);
						CKEDITOR.document.removeListener("mouseup", o$$0);
						if (a.document) {
							a.document.removeListener("mousemove", n$$0);
							a.document.removeListener("mouseup", o$$0);
						}
					};
					var r = CKEDITOR.tools.addFunction(function(h) {
						if (!g$$0) {
							g$$0 = a.getResizable();
						}
						e = g$$0.$.offsetWidth || 0;
						b$$0 = g$$0.$.offsetHeight || 0;
						d$$0 = h.screenX;
						f = h.screenY;
						if (c$$0.resize_minWidth > e) {
							c$$0.resize_minWidth = e;
						}
						if (c$$0.resize_minHeight > b$$0) {
							c$$0.resize_minHeight = b$$0;
						}
						CKEDITOR.document.on("mousemove", n$$0);
						CKEDITOR.document.on("mouseup", o$$0);
						if (a.document) {
							a.document.on("mousemove", n$$0);
							a.document.on("mouseup", o$$0);
						}
						if (h.preventDefault) {
							h.preventDefault();
						}
					});
					a.on("destroy", function() {
						CKEDITOR.tools.removeFunction(r);
					});
					a.on("uiSpace", function(b) {
						if (b.data.space == "bottom") {
							var c = "";
							if (i) {
								if (!k) {
									c = " cke_resizer_horizontal";
								}
							}
							if (!i) {
								if (k) {
									c = " cke_resizer_vertical";
								}
							}
							var d = '<span id="' + h$$0 + '" class="cke_resizer' + c + " cke_resizer_" + j + '" title="' + CKEDITOR.tools.htmlEncode(a.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + r + ', event)">' + (j == "ltr" ? "\u25e2" : "\u25e3") + "</span>";
							if (j == "ltr" && c == "ltr") {
								b.data.html = b.data.html + d;
							} else {
								b.data.html = d + b.data.html;
							}
						}
					}, a, null, 100);
					a.on("maximize", function(b) {
						a.ui.space("resizer")[b.data == CKEDITOR.TRISTATE_ON ? "hide" : "show"]();
					});
				}
			}
		});
		(function() {
			CKEDITOR.plugins.add("selectall", {
				init: function(a$$0) {
					a$$0.addCommand("selectAll", {
						modes: {
							wysiwyg: 1,
							source: 1
						},
						exec: function(a) {
							var b = a.editable();
							if (b.is("textarea")) {
								a = b.$;
								if (CKEDITOR.env.ie) {
									a.createTextRange().execCommand("SelectAll");
								} else {
									a.selectionStart = 0;
									a.selectionEnd = a.value.length;
								}
								a.focus();
							} else {
								if (b.is("body")) {
									a.document.$.execCommand("SelectAll", false, null);
								} else {
									var d = a.createRange();
									d.selectNodeContents(b);
									d.select();
								}
								a.forceNextSelectionCheck();
								a.selectionChange();
							}
						},
						canUndo: false
					});
					if (a$$0.ui.addButton) {
						a$$0.ui.addButton("SelectAll", {
							label: a$$0.lang.selectall.toolbar,
							command: "selectAll",
							toolbar: "selection,10"
						});
					}
				}
			});
		})();
		(function() {
			CKEDITOR.plugins.add("sourcearea", {
				init: function(e) {
					function b() {
						var a = f && this.equals(CKEDITOR.document.getActive());
						this.hide();
						this.setStyle("height", this.getParent().$.clientHeight + "px");
						this.setStyle("width", this.getParent().$.clientWidth + "px");
						this.show();
						if (a) {
							this.focus();
						}
					}
					if (e.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
						var d$$0 = CKEDITOR.plugins.sourcearea;
						e.addMode("source", function(c) {
							var d = e.ui.space("contents").getDocument().createElement("textarea");
							d.setStyles(CKEDITOR.tools.extend({
								width: CKEDITOR.env.ie7Compat ? "99%" : "100%",
								height: "100%",
								resize: "none",
								outline: "none",
								"text-align": "left"
							}, CKEDITOR.tools.cssVendorPrefix("tab-size", e.config.sourceAreaTabSize || 4)));
							d.setAttribute("dir", "ltr");
							d.addClass("cke_source cke_reset cke_enable_context_menu");
							e.ui.space("contents").append(d);
							d = e.editable(new a$$0(e, d));
							d.setData(e.getData(1));
							if (CKEDITOR.env.ie) {
								d.attachListener(e, "resize", b, d);
								d.attachListener(CKEDITOR.document.getWindow(), "resize", b, d);
								CKEDITOR.tools.setTimeout(b, 0, d);
							}
							e.fire("ariaWidget", this);
							c();
						});
						e.addCommand("source", d$$0.commands.source);
						if (e.ui.addButton) {
							e.ui.addButton("Source", {
								label: e.lang.sourcearea.toolbar,
								command: "source",
								toolbar: "mode,10"
							});
						}
						e.on("mode", function() {
							e.getCommand("source").setState(e.mode == "source" ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
						});
						var f = CKEDITOR.env.ie && CKEDITOR.env.version == 9;
					}
				}
			});
			var a$$0 = CKEDITOR.tools.createClass({
				base: CKEDITOR.editable,
				proto: {
					setData: function(a) {
						this.setValue(a);
						this.status = "ready";
						this.editor.fire("dataReady");
					},
					getData: function() {
						return this.getValue();
					},
					insertHtml: function() {},
					insertElement: function() {},
					insertText: function() {},
					setReadOnly: function(a) {
						this[(a ? "set" : "remove") + "Attribute"]("readOnly", "readonly");
					},
					detach: function() {
						a$$0.baseProto.detach.call(this);
						this.clearCustomData();
						this.remove();
					}
				}
			});
		})();
		CKEDITOR.plugins.sourcearea = {
			commands: {
				source: {
					modes: {
						wysiwyg: 1,
						source: 1
					},
					editorFocus: false,
					readOnly: 1,
					exec: function(a) {
						if (a.mode == "wysiwyg") {
							a.fire("saveSnapshot");
						}
						a.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);
						a.setMode(a.mode == "source" ? "wysiwyg" : "source");
					},
					canUndo: false
				}
			}
		};
		(function() {
			var a$$1 = '<a id="{id}" class="cke_button cke_button__{name} cke_button_{state} {cls}"' + (CKEDITOR.env.gecko && !CKEDITOR.env.hc ? "" : " href=\"javascript:void('{titleJs}')\"") + ' title="{title}" tabindex="-1" hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="{hasArrow}" aria-disabled="{ariaDisabled}"';
			if (CKEDITOR.env.gecko) {
				if (CKEDITOR.env.mac) {
					a$$1 = a$$1 + ' onkeypress="return false;"';
				}
			}
			if (CKEDITOR.env.gecko) {
				a$$1 = a$$1 + ' onblur="this.style.cssText = this.style.cssText;"';
			}
			a$$1 = a$$1 + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"');
			a$$1 = a$$1 + '>&nbsp;</span><span id="{id}_label" class="cke_button_label cke_button__{name}_label" aria-hidden="false">{label}</span>{arrowHtml}</a>';
			var e = CKEDITOR.addTemplate("buttonArrow", '<span class="cke_button_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : "") + "</span>");
			var b$$0 = CKEDITOR.addTemplate("button", a$$1);
			CKEDITOR.plugins.add("button", {
				beforeInit: function(a) {
					a.ui.addHandler(CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler);
				}
			});
			CKEDITOR.UI_BUTTON = "button";
			CKEDITOR.ui.button = function(a) {
				CKEDITOR.tools.extend(this, a, {
					title: a.label,
					click: a.click || function(b) {
						b.execCommand(a.command);
					}
				});
				this._ = {};
			};
			CKEDITOR.ui.button.handler = {
				create: function(a) {
					return new CKEDITOR.ui.button(a);
				}
			};
			CKEDITOR.ui.button.prototype = {
				render: function(a$$0, f$$0) {
					var c$$0 = CKEDITOR.env;
					var h = this._.id = CKEDITOR.tools.getNextId();
					var j = "";
					var g = this.command;
					var i;
					this._.editor = a$$0;
					var k = {
						id: h,
						button: this,
						editor: a$$0,
						focus: function() {
							CKEDITOR.document.getById(h).focus();
						},
						execute: function() {
							this.button.click(a$$0);
						},
						attach: function(a) {
							this.button.attach(a);
						}
					};
					var n = CKEDITOR.tools.addFunction(function(a) {
						if (k.onkey) {
							a = new CKEDITOR.dom.event(a);
							return k.onkey(k, a.getKeystroke()) !== false;
						}
					});
					var o = CKEDITOR.tools.addFunction(function(a) {
						var b;
						if (k.onfocus) {
							b = k.onfocus(k, new CKEDITOR.dom.event(a)) !== false;
						}
						return b;
					});
					var r = 0;
					k.clickFn = i = CKEDITOR.tools.addFunction(function() {
						if (r) {
							a$$0.unlockSelection(1);
							r = 0;
						}
						k.execute();
					});
					if (this.modes) {
						var l = {};
						var m = function() {
							var b = a$$0.mode;
							if (b) {
								b = this.modes[b] ? l[b] != void 0 ? l[b] : CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
								b = a$$0.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : b;
								this.setState(b);
								if (this.refresh) {
									this.refresh();
								}
							}
						};
						a$$0.on("beforeModeUnload", function() {
							if (a$$0.mode && this._.state != CKEDITOR.TRISTATE_DISABLED) {
								l[a$$0.mode] = this._.state;
							}
						}, this);
						a$$0.on("activeFilterChange", m, this);
						a$$0.on("mode", m, this);
						if (!this.readOnly) {
							a$$0.on("readOnly", m, this);
						}
					} else {
						if (g) {
							if (g = a$$0.getCommand(g)) {
								g.on("state", function() {
									this.setState(g.state);
								}, this);
								j = j + (g.state == CKEDITOR.TRISTATE_ON ? "on" : g.state == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off");
							}
						}
					}
					if (this.directional) {
						a$$0.on("contentDirChanged", function(b) {
							var c = CKEDITOR.document.getById(this._.id);
							var f = c.getFirst();
							b = b.data;
							if (b != a$$0.lang.dir) {
								c.addClass("cke_" + b);
							} else {
								c.removeClass("cke_ltr").removeClass("cke_rtl");
							}
							f.setAttribute("style", CKEDITOR.skin.getIconStyle(s, b == "rtl", this.icon, this.iconOffset));
						}, this);
					}
					if (!g) {
						j = j + "off";
					}
					var s = m = this.name || this.command;
					if (this.icon && !/\./.test(this.icon)) {
						s = this.icon;
						this.icon = null;
					}
					c$$0 = {
						id: h,
						name: m,
						iconName: s,
						label: this.label,
						cls: this.className || "",
						state: j,
						ariaDisabled: j == "disabled" ? "true" : "false",
						title: this.title,
						titleJs: c$$0.gecko && !c$$0.hc ? "" : (this.title || "").replace("'", ""),
						hasArrow: this.hasArrow ? "true" : "false",
						keydownFn: n,
						focusFn: o,
						clickFn: i,
						style: CKEDITOR.skin.getIconStyle(s, a$$0.lang.dir == "rtl", this.icon, this.iconOffset),
						arrowHtml: this.hasArrow ? e.output() : ""
					};
					b$$0.output(c$$0, f$$0);
					if (this.onRender) {
						this.onRender();
					}
					return k;
				},
				setState: function(a) {
					if (this._.state == a) {
						return false;
					}
					this._.state = a;
					var b = CKEDITOR.document.getById(this._.id);
					if (b) {
						b.setState(a, "cke_button");
						if (a == CKEDITOR.TRISTATE_DISABLED) {
							b.setAttribute("aria-disabled", true);
						} else {
							b.removeAttribute("aria-disabled");
						}
						if (this.hasArrow) {
							a = a == CKEDITOR.TRISTATE_ON ? this._.editor.lang.button.selectedLabel.replace(/%1/g, this.label) : this.label;
							CKEDITOR.document.getById(this._.id + "_label").setText(a);
						} else {
							if (a == CKEDITOR.TRISTATE_ON) {
								b.setAttribute("aria-pressed", true);
							} else {
								b.removeAttribute("aria-pressed");
							}
						}
						return true;
					}
					return false;
				},
				getState: function() {
					return this._.state;
				},
				toFeature: function(a) {
					if (this._.feature) {
						return this._.feature;
					}
					var b = this;
					if (!this.allowedContent) {
						if (!this.requiredContent && this.command) {
							b = a.getCommand(this.command) || b;
						}
					}
					return this._.feature = b;
				}
			};
			CKEDITOR.ui.prototype.addButton = function(a, b) {
				this.add(a, CKEDITOR.UI_BUTTON, b);
			};
		})();
		(function() {
			function a$$1(a$$0) {
				function b$$1() {
					var c = d$$0();
					var g = CKEDITOR.tools.clone(a$$0.config.toolbarGroups) || e$$1(a$$0);
					var i = 0;
					for (; i < g.length; i++) {
						var k = g[i];
						if (k != "/") {
							if (typeof k == "string") {
								k = g[i] = {
									name: k
								};
							}
							var m;
							var s = k.groups;
							if (s) {
								var t = 0;
								for (; t < s.length; t++) {
									m = s[t];
									if (m = c[m]) {
										j(k, m);
									}
								}
							}
							if (m = c[k.name]) {
								j(k, m);
							}
						}
					}
					return g;
				}

				function d$$0() {
					var b$$0 = {};
					var c;
					var e;
					var g;
					for (c in a$$0.ui.items) {
						e = a$$0.ui.items[c];
						g = e.toolbar || "others";
						g = g.split(",");
						e = g[0];
						g = parseInt(g[1] || -1, 10);
						if (!b$$0[e]) {
							b$$0[e] = [];
						}
						b$$0[e].push({
							name: c,
							order: g
						});
					}
					for (e in b$$0) {
						b$$0[e] = b$$0[e].sort(function(a, b) {
							return a.order == b.order ? 0 : b.order < 0 ? -1 : a.order < 0 ? 1 : a.order < b.order ? -1 : 1;
						});
					}
					return b$$0;
				}

				function j(b, c) {
					if (c.length) {
						if (b.items) {
							b.items.push(a$$0.ui.create("-"));
						} else {
							b.items = [];
						}
						var d;
						for (; d = c.shift();) {
							d = typeof d == "string" ? d : d.name;
							if (!i$$0 || CKEDITOR.tools.indexOf(i$$0, d) == -1) {
								if (d = a$$0.ui.create(d)) {
									if (a$$0.addFeature(d)) {
										b.items.push(d);
									}
								}
							}
						}
					}
				}

				function g$$0(a) {
					var b = [];
					var c;
					var d;
					var f;
					c = 0;
					for (; c < a.length; ++c) {
						d = a[c];
						f = {};
						if (d == "/") {
							b.push(d);
						} else {
							if (CKEDITOR.tools.isArray(d)) {
								j(f, CKEDITOR.tools.clone(d));
								b.push(f);
							} else {
								if (d.items) {
									j(f, CKEDITOR.tools.clone(d.items));
									f.name = d.name;
									b.push(f);
								}
							}
						}
					}
					return b;
				}
				var i$$0 = a$$0.config.removeButtons;
				i$$0 = i$$0 && i$$0.split(",");
				var k$$0 = a$$0.config.toolbar;
				if (typeof k$$0 == "string") {
					k$$0 = a$$0.config["toolbar_" + k$$0];
				}
				return a$$0.toolbar = k$$0 ? g$$0(k$$0) : b$$1();
			}

			function e$$1(a) {
				return a._.toolbarGroups || (a._.toolbarGroups = [{
					name: "document",
					groups: ["mode", "document", "doctools"]
				}, {
					name: "clipboard",
					groups: ["clipboard", "undo"]
				}, {
					name: "editing",
					groups: ["find", "selection", "spellchecker"]
				}, {
					name: "forms"
				}, "/", {
					name: "basicstyles",
					groups: ["basicstyles", "cleanup"]
				}, {
					name: "paragraph",
					groups: ["list", "indent", "blocks", "align", "bidi"]
				}, {
					name: "links"
				}, {
					name: "insert"
				}, "/", {
					name: "styles"
				}, {
					name: "colors"
				}, {
					name: "tools"
				}, {
					name: "others"
				}, {
					name: "about"
				}]);
			}
			var b$$2 = function() {
				this.toolbars = [];
				this.focusCommandExecuted = false;
			};
			b$$2.prototype.focus = function() {
				var a = 0;
				var b;
				for (; b = this.toolbars[a++];) {
					var d = 0;
					var e;
					for (; e = b.items[d++];) {
						if (e.focus) {
							e.focus();
							return;
						}
					}
				}
			};
			var d$$1 = {
				modes: {
					wysiwyg: 1,
					source: 1
				},
				readOnly: 1,
				exec: function(a) {
					if (a.toolbox) {
						a.toolbox.focusCommandExecuted = true;
						if (CKEDITOR.env.ie || CKEDITOR.env.air) {
							setTimeout(function() {
								a.toolbox.focus();
							}, 100);
						} else {
							a.toolbox.focus();
						}
					}
				}
			};
			CKEDITOR.plugins.add("toolbar", {
				requires: "button",
				init: function(f$$0) {
					var c$$1;
					var e$$0 = function(a$$0, b) {
						var d;
						var k = f$$0.lang.dir == "rtl";
						var n = f$$0.config.toolbarGroupCycling;
						var o = k ? 37 : 39;
						k = k ? 39 : 37;
						n = n === void 0 || n;
						switch (b) {
							case 9:
								;
							case CKEDITOR.SHIFT + 9:
								for (; !d || !d.items.length;) {
									d = b == 9 ? (d ? d.next : a$$0.toolbar.next) || f$$0.toolbox.toolbars[0] : (d ? d.previous : a$$0.toolbar.previous) || f$$0.toolbox.toolbars[f$$0.toolbox.toolbars.length - 1];
									if (d.items.length) {
										a$$0 = d.items[c$$1 ? d.items.length - 1 : 0];
										for (; a$$0 && !a$$0.focus;) {
											if (!(a$$0 = c$$1 ? a$$0.previous : a$$0.next)) {
												d = 0;
											}
										}
									}
								}
								if (a$$0) {
									a$$0.focus();
								}
								return false;
							case o:
								d = a$$0;
								do {
									d = d.next;
									if (!d) {
										if (n) {
											d = a$$0.toolbar.items[0];
										}
									}
								} while (d && !d.focus);
								if (d) {
									d.focus();
								} else {
									e$$0(a$$0, 9);
								}
								return false;
							case 40:
								if (a$$0.button && a$$0.button.hasArrow) {
									f$$0.once("panelShow", function(a) {
										a.data._.panel._.currentBlock.onKeyDown(40);
									});
									a$$0.execute();
								} else {
									e$$0(a$$0, b == 40 ? o : k);
								}
								return false;
							case k:
								;
							case 38:
								d = a$$0;
								do {
									d = d.previous;
									if (!d) {
										if (n) {
											d = a$$0.toolbar.items[a$$0.toolbar.items.length - 1];
										}
									}
								} while (d && !d.focus);
								if (d) {
									d.focus();
								} else {
									c$$1 = 1;
									e$$0(a$$0, CKEDITOR.SHIFT + 9);
									c$$1 = 0;
								}
								return false;
							case 27:
								f$$0.focus();
								return false;
							case 13:
								;
							case 32:
								a$$0.execute();
								return false;
						}
						return true;
					};
					f$$0.on("uiSpace", function(c$$0) {
						if (c$$0.data.space == f$$0.config.toolbarLocation) {
							c$$0.removeListener();
							f$$0.toolbox = new b$$2;
							var d$$0 = CKEDITOR.tools.getNextId();
							var i = ['<span id="', d$$0, '" class="cke_voice_label">', f$$0.lang.toolbar.toolbars, "</span>", '<span id="' + f$$0.ui.spaceId("toolbox") + '" class="cke_toolbox" role="group" aria-labelledby="', d$$0, '" onmousedown="return false;">'];
							d$$0 = f$$0.config.toolbarStartupExpanded !== false;
							var k;
							var n;
							if (f$$0.config.toolbarCanCollapse) {
								if (f$$0.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
									i.push('<span class="cke_toolbox_main"' + (d$$0 ? ">" : ' style="display:none">'));
								}
							}
							var o = f$$0.toolbox.toolbars;
							var r = a$$1(f$$0);
							var l = 0;
							for (; l < r.length; l++) {
								var m;
								var s = 0;
								var t;
								var p = r[l];
								var x;
								if (p) {
									if (k) {
										i.push("</span>");
										n = k = 0;
									}
									if (p === "/") {
										i.push('<span class="cke_toolbar_break"></span>');
									} else {
										x = p.items || p;
										var q = 0;
										for (; q < x.length; q++) {
											var u = x[q];
											var B;
											if (u) {
												if (u.type == CKEDITOR.UI_SEPARATOR) {
													n = k && u;
												} else {
													B = u.canGroup !== false;
													if (!s) {
														m = CKEDITOR.tools.getNextId();
														s = {
															id: m,
															items: []
														};
														t = p.name && (f$$0.lang.toolbar.toolbarGroups[p.name] || p.name);
														i.push('<span id="', m, '" class="cke_toolbar"', t ? ' aria-labelledby="' + m + '_label"' : "", ' role="toolbar">');
														if (t) {
															i.push('<span id="', m, '_label" class="cke_voice_label">', t, "</span>");
														}
														i.push('<span class="cke_toolbar_start"></span>');
														var v = o.push(s) - 1;
														if (v > 0) {
															s.previous = o[v - 1];
															s.previous.next = s;
														}
													}
													if (B) {
														if (!k) {
															i.push('<span class="cke_toolgroup" role="presentation">');
															k = 1;
														}
													} else {
														if (k) {
															i.push("</span>");
															k = 0;
														}
													}
													m = function(a) {
														a = a.render(f$$0, i);
														v = s.items.push(a) - 1;
														if (v > 0) {
															a.previous = s.items[v - 1];
															a.previous.next = a;
														}
														a.toolbar = s;
														a.onkey = e$$0;
														a.onfocus = function() {
															if (!f$$0.toolbox.focusCommandExecuted) {
																f$$0.focus();
															}
														};
													};
													if (n) {
														m(n);
														n = 0;
													}
													m(u);
												}
											}
										}
										if (k) {
											i.push("</span>");
											n = k = 0;
										}
										if (s) {
											i.push('<span class="cke_toolbar_end"></span></span>');
										}
									}
								}
							}
							if (f$$0.config.toolbarCanCollapse) {
								i.push("</span>");
							}
							if (f$$0.config.toolbarCanCollapse && f$$0.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
								var z = CKEDITOR.tools.addFunction(function() {
									f$$0.execCommand("toolbarCollapse");
								});
								f$$0.on("destroy", function() {
									CKEDITOR.tools.removeFunction(z);
								});
								f$$0.addCommand("toolbarCollapse", {
									readOnly: 1,
									exec: function(a) {
										var b = a.ui.space("toolbar_collapser");
										var c = b.getPrevious();
										var d = a.ui.space("contents");
										var f = c.getParent();
										var e = parseInt(d.$.style.height, 10);
										var g = f.$.offsetHeight;
										var h = b.hasClass("cke_toolbox_collapser_min");
										if (h) {
											c.show();
											b.removeClass("cke_toolbox_collapser_min");
											b.setAttribute("title", a.lang.toolbar.toolbarCollapse);
										} else {
											c.hide();
											b.addClass("cke_toolbox_collapser_min");
											b.setAttribute("title", a.lang.toolbar.toolbarExpand);
										}
										b.getFirst().setText(h ? "\u25b2" : "\u25c0");
										d.setStyle("height", e - (f.$.offsetHeight - g) + "px");
										a.fire("resize");
									},
									modes: {
										wysiwyg: 1,
										source: 1
									}
								});
								f$$0.setKeystroke(CKEDITOR.ALT + (CKEDITOR.env.ie || CKEDITOR.env.webkit ? 189 : 109), "toolbarCollapse");
								i.push('<a title="' + (d$$0 ? f$$0.lang.toolbar.toolbarCollapse : f$$0.lang.toolbar.toolbarExpand) + '" id="' + f$$0.ui.spaceId("toolbar_collapser") + '" tabIndex="-1" class="cke_toolbox_collapser');
								if (!d$$0) {
									i.push(" cke_toolbox_collapser_min");
								}
								i.push('" onclick="CKEDITOR.tools.callFunction(' + z + ')">', '<span class="cke_arrow">&#9650;</span>', "</a>");
							}
							i.push("</span>");
							c$$0.data.html = c$$0.data.html + i.join("");
						}
					});
					f$$0.on("destroy", function() {
						if (this.toolbox) {
							var a;
							var b = 0;
							var c;
							var d;
							var f;
							a = this.toolbox.toolbars;
							for (; b < a.length; b++) {
								d = a[b].items;
								c = 0;
								for (; c < d.length; c++) {
									f = d[c];
									if (f.clickFn) {
										CKEDITOR.tools.removeFunction(f.clickFn);
									}
									if (f.keyDownFn) {
										CKEDITOR.tools.removeFunction(f.keyDownFn);
									}
								}
							}
						}
					});
					f$$0.on("uiReady", function() {
						var a = f$$0.ui.space("toolbox");
						if (a) {
							f$$0.focusManager.add(a, 1);
						}
					});
					f$$0.addCommand("toolbarFocus", d$$1);
					f$$0.setKeystroke(CKEDITOR.ALT + 121, "toolbarFocus");
					f$$0.ui.add("-", CKEDITOR.UI_SEPARATOR, {});
					f$$0.ui.addHandler(CKEDITOR.UI_SEPARATOR, {
						create: function() {
							return {
								render: function(a, b) {
									b.push('<span class="cke_toolbar_separator" role="separator"></span>');
									return {};
								}
							};
						}
					});
				}
			});
			CKEDITOR.ui.prototype.addToolbarGroup = function(a$$0, b, d) {
				var j = e$$1(this.editor);
				var g = b === 0;
				var i = {
					name: a$$0
				};
				if (d) {
					if (d = CKEDITOR.tools.search(j, function(a) {
						return a.name == d;
					})) {
						if (!d.groups) {
							d.groups = [];
						}
						if (b) {
							b = CKEDITOR.tools.indexOf(d.groups, b);
							if (b >= 0) {
								d.groups.splice(b + 1, 0, a$$0);
								return;
							}
						}
						if (g) {
							d.groups.splice(0, 0, a$$0);
						} else {
							d.groups.push(a$$0);
						}
						return;
					}
					b = null;
				}
				if (b) {
					b = CKEDITOR.tools.indexOf(j, function(a) {
						return a.name == b;
					});
				}
				if (g) {
					j.splice(0, 0, a$$0);
				} else {
					if (typeof b == "number") {
						j.splice(b + 1, 0, i);
					} else {
						j.push(a$$0);
					}
				}
			};
		})();
		CKEDITOR.UI_SEPARATOR = "separator";
		CKEDITOR.config.toolbarLocation = "top";
		(function() {
			function a$$1(a) {
				this.editor = a;
				this.reset();
			}
			CKEDITOR.plugins.add("undo", {
				init: function(b) {
					function f(a) {
						if (e.enabled) {
							if (a.data.command.canUndo !== false) {
								e.save();
							}
						}
					}

					function c() {
						e.enabled = b.readOnly ? false : b.mode == "wysiwyg";
						e.onChange();
					}
					var e = b.undoManager = new a$$1(b);
					var j = b.addCommand("undo", {
						exec: function() {
							if (e.undo()) {
								b.selectionChange();
								this.fire("afterUndo");
							}
						},
						startDisabled: true,
						canUndo: false
					});
					var g = b.addCommand("redo", {
						exec: function() {
							if (e.redo()) {
								b.selectionChange();
								this.fire("afterRedo");
							}
						},
						startDisabled: true,
						canUndo: false
					});
					var i = [CKEDITOR.CTRL + 90, CKEDITOR.CTRL + 89, CKEDITOR.CTRL + CKEDITOR.SHIFT + 90];
					b.setKeystroke([
						[i[0], "undo"],
						[i[1], "redo"],
						[i[2], "redo"]
					]);
					b.on("contentDom", function() {
						var a$$0 = b.editable();
						a$$0.attachListener(a$$0, "keydown", function(a) {
							if (CKEDITOR.tools.indexOf(i, a.data.getKeystroke()) > -1) {
								a.data.preventDefault();
							}
						});
					});
					e.onChange = function() {
						j.setState(e.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
						g.setState(e.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
					};
					b.on("beforeCommandExec", f);
					b.on("afterCommandExec", f);
					b.on("saveSnapshot", function(a) {
						e.save(a.data && a.data.contentOnly);
					});
					b.on("contentDom", function() {
						b.editable().on("keydown", function(a) {
							a = a.data.getKey();
							if (a == 8 || a == 46) {
								e.type(a, 0);
							}
						});
						b.editable().on("keypress", function(a) {
							e.type(a.data.getKey(), 1);
						});
					});
					b.on("beforeModeUnload", function() {
						if (b.mode == "wysiwyg") {
							e.save(true);
						}
					});
					b.on("mode", c);
					b.on("readOnly", c);
					if (b.ui.addButton) {
						b.ui.addButton("Undo", {
							label: b.lang.undo.undo,
							command: "undo",
							toolbar: "undo,10"
						});
						b.ui.addButton("Redo", {
							label: b.lang.undo.redo,
							command: "redo",
							toolbar: "undo,20"
						});
					}
					b.resetUndo = function() {
						e.reset();
						b.fire("saveSnapshot");
					};
					b.on("updateSnapshot", function() {
						if (e.currentImage) {
							e.update();
						}
					});
					b.on("lockSnapshot", function(a) {
						a = a.data;
						e.lock(a && a.dontUpdate, a && a.forceUpdate);
					});
					b.on("unlockSnapshot", e.unlock, e);
				}
			});
			CKEDITOR.plugins.undo = {};
			var e$$0 = CKEDITOR.plugins.undo.Image = function(a, b) {
				this.editor = a;
				a.fire("beforeUndoImage");
				var c = a.getSnapshot();
				if (CKEDITOR.env.ie) {
					if (c) {
						c = c.replace(/\s+data-cke-expando=".*?"/g, "");
					}
				}
				this.contents = c;
				if (!b) {
					this.bookmarks = (c = c && a.getSelection()) && c.createBookmarks2(true);
				}
				a.fire("afterUndoImage");
			};
			var b$$0 = /\b(?:href|src|name)="[^"]*?"/gi;
			e$$0.prototype = {
				equalsContent: function(a) {
					var f = this.contents;
					a = a.contents;
					if (CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks)) {
						f = f.replace(b$$0, "");
						a = a.replace(b$$0, "");
					}
					return f != a ? false : true;
				},
				equalsSelection: function(a) {
					var b = this.bookmarks;
					a = a.bookmarks;
					if (b || a) {
						if (!b || (!a || b.length != a.length)) {
							return false;
						}
						var c = 0;
						for (; c < b.length; c++) {
							var e = b[c];
							var j = a[c];
							if (e.startOffset != j.startOffset || (e.endOffset != j.endOffset || (!CKEDITOR.tools.arrayCompare(e.start, j.start) || !CKEDITOR.tools.arrayCompare(e.end, j.end)))) {
								return false;
							}
						}
					}
					return true;
				}
			};
			a$$1.prototype = {
				type: function(a$$0, b) {
					var c = !b && a$$0 != this.lastKeystroke;
					var h = this.editor;
					if (!this.typing || (b && !this.wasCharacter || c)) {
						var j = new e$$0(h);
						var g = this.snapshots.length;
						CKEDITOR.tools.setTimeout(function() {
							var a = h.getSnapshot();
							if (CKEDITOR.env.ie) {
								a = a.replace(/\s+data-cke-expando=".*?"/g, "");
							}
							if (j.contents != a && g == this.snapshots.length) {
								this.typing = true;
								if (!this.save(false, j, false)) {
									this.snapshots.splice(this.index + 1, this.snapshots.length - this.index - 1);
								}
								this.hasUndo = true;
								this.hasRedo = false;
								this.modifiersCount = this.typesCount = 1;
								this.onChange();
							}
						}, 0, this);
					}
					this.lastKeystroke = a$$0;
					if (this.wasCharacter = b) {
						this.modifiersCount = 0;
						this.typesCount++;
						if (this.typesCount > 25) {
							this.save(false, null, false);
							this.typesCount = 1;
						} else {
							setTimeout(function() {
								h.fire("change");
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
								h.fire("change");
							}, 0);
						}
					}
				},
				reset: function() {
					this.lastKeystroke = 0;
					this.snapshots = [];
					this.index = -1;
					this.limit = this.editor.config.undoStackSize || 20;
					this.currentImage = null;
					this.hasRedo = this.hasUndo = false;
					this.locked = null;
					this.resetType();
				},
				resetType: function() {
					this.typing = false;
					delete this.lastKeystroke;
					this.modifiersCount = this.typesCount = 0;
				},
				fireChange: function() {
					this.hasUndo = !!this.getNextImage(true);
					this.hasRedo = !!this.getNextImage(false);
					this.resetType();
					this.onChange();
				},
				save: function(a, b, c) {
					var h = this.editor;
					if (this.locked || (h.status != "ready" || h.mode != "wysiwyg")) {
						return false;
					}
					var j = h.editable();
					if (!j || j.status != "ready") {
						return false;
					}
					j = this.snapshots;
					if (!b) {
						b = new e$$0(h);
					}
					if (b.contents === false) {
						return false;
					}
					if (this.currentImage) {
						if (b.equalsContent(this.currentImage)) {
							if (a || b.equalsSelection(this.currentImage)) {
								return false;
							}
						} else {
							h.fire("change");
						}
					}
					j.splice(this.index + 1, j.length - this.index - 1);
					if (j.length == this.limit) {
						j.shift();
					}
					this.index = j.push(b) - 1;
					this.currentImage = b;
					if (c !== false) {
						this.fireChange();
					}
					return true;
				},
				restoreImage: function(a) {
					var b = this.editor;
					var c;
					if (a.bookmarks) {
						b.focus();
						c = b.getSelection();
					}
					this.locked = 1;
					this.editor.loadSnapshot(a.contents);
					if (a.bookmarks) {
						c.selectBookmarks(a.bookmarks);
					} else {
						if (CKEDITOR.env.ie) {
							c = this.editor.document.getBody().$.createTextRange();
							c.collapse(true);
							c.select();
						}
					}
					this.locked = 0;
					this.index = a.index;
					this.currentImage = this.snapshots[this.index];
					this.update();
					this.fireChange();
					b.fire("change");
				},
				getNextImage: function(a) {
					var b = this.snapshots;
					var c = this.currentImage;
					var e;
					if (c) {
						if (a) {
							e = this.index - 1;
							for (; e >= 0; e--) {
								a = b[e];
								if (!c.equalsContent(a)) {
									a.index = e;
									return a;
								}
							}
						} else {
							e = this.index + 1;
							for (; e < b.length; e++) {
								a = b[e];
								if (!c.equalsContent(a)) {
									a.index = e;
									return a;
								}
							}
						}
					}
					return null;
				},
				redoable: function() {
					return this.enabled && this.hasRedo;
				},
				undoable: function() {
					return this.enabled && this.hasUndo;
				},
				undo: function() {
					if (this.undoable()) {
						this.save(true);
						var a = this.getNextImage(true);
						if (a) {
							return this.restoreImage(a), true;
						}
					}
					return false;
				},
				redo: function() {
					if (this.redoable()) {
						this.save(true);
						if (this.redoable()) {
							var a = this.getNextImage(false);
							if (a) {
								return this.restoreImage(a), true;
							}
						}
					}
					return false;
				},
				update: function(a) {
					if (!this.locked) {
						if (!a) {
							a = new e$$0(this.editor);
						}
						var b = this.index;
						var c = this.snapshots;
						for (; b > 0 && this.currentImage.equalsContent(c[b - 1]);) {
							b = b - 1;
						}
						c.splice(b, this.index - b + 1, a);
						this.index = b;
						this.currentImage = a;
					}
				},
				lock: function(a, b) {
					if (this.locked) {
						this.locked.level++;
					} else {
						if (a) {
							this.locked = {
								level: 1
							};
						} else {
							var c = null;
							if (b) {
								c = true;
							} else {
								var h = new e$$0(this.editor, true);
								if (this.currentImage) {
									if (this.currentImage.equalsContent(h)) {
										c = h;
									}
								}
							}
							this.locked = {
								update: c,
								level: 1
							};
						}
					}
				},
				unlock: function() {
					if (this.locked && !--this.locked.level) {
						var a = this.locked.update;
						this.locked = null;
						if (a === true) {
							this.update();
						} else {
							if (a) {
								var b = new e$$0(this.editor, true);
								if (!a.equalsContent(b)) {
									this.update();
								}
							}
						}
					}
				}
			};
		})();
		(function() {
			function a$$1(a$$0) {
				var b = this.editor;
				var c$$0 = a$$0.document;
				var e$$0 = c$$0.body;
				var j = c$$0.getElementById("cke_actscrpt");
				if (j) {
					j.parentNode.removeChild(j);
				}
				if (j = c$$0.getElementById("cke_shimscrpt")) {
					j.parentNode.removeChild(j);
				}
				if (CKEDITOR.env.gecko) {
					e$$0.contentEditable = false;
					if (CKEDITOR.env.version < 2E4) {
						e$$0.innerHTML = e$$0.innerHTML.replace(/^.*<\!-- cke-content-start --\>/, "");
						setTimeout(function() {
							var a = new CKEDITOR.dom.range(new CKEDITOR.dom.document(c$$0));
							a.setStart(new CKEDITOR.dom.node(e$$0), 0);
							b.getSelection().selectRanges([a]);
						}, 0);
					}
				}
				e$$0.contentEditable = true;
				if (CKEDITOR.env.ie) {
					e$$0.hideFocus = true;
					e$$0.disabled = true;
					e$$0.removeAttribute("disabled");
				}
				delete this._.isLoadingData;
				this.$ = e$$0;
				c$$0 = new CKEDITOR.dom.document(c$$0);
				this.setup();
				if (CKEDITOR.env.ie) {
					c$$0.getDocumentElement().addClass(c$$0.$.compatMode);
					if (b.config.enterMode != CKEDITOR.ENTER_P) {
						this.attachListener(c$$0, "selectionchange", function() {
							var a = c$$0.getBody();
							var d = b.getSelection();
							var e = d && d.getRanges()[0];
							if (e) {
								if (a.getHtml().match(/^<p>(?:&nbsp;|<br>)<\/p>$/i) && e.startContainer.equals(a)) {
									setTimeout(function() {
										e = b.getSelection().getRanges()[0];
										if (!e.startContainer.equals("body")) {
											a.getFirst().remove(1);
											e.moveToElementEditEnd(a);
											e.select();
										}
									}, 0);
								}
							}
						});
					}
				}
				if (CKEDITOR.env.webkit || CKEDITOR.env.ie && CKEDITOR.env.version > 10) {
					c$$0.getDocumentElement().on("mousedown", function(a) {
						if (a.data.getTarget().is("html")) {
							setTimeout(function() {
								b.editable().focus();
							});
						}
					});
				}
				try {
					b.document.$.execCommand("2D-position", false, true);
				} catch (g) {}
				try {
					b.document.$.execCommand("enableInlineTableEditing", false, !b.config.disableNativeTableHandles);
				} catch (i) {}
				if (b.config.disableObjectResizing) {
					try {
						this.getDocument().$.execCommand("enableObjectResizing", false, false);
					} catch (k) {
						this.attachListener(this, CKEDITOR.env.ie ? "resizestart" : "resize", function(a) {
							a.data.preventDefault();
						});
					}
				}
				if (CKEDITOR.env.gecko || CKEDITOR.env.ie && b.document.$.compatMode == "CSS1Compat") {
					this.attachListener(this, "keydown", function(a) {
						var c = a.data.getKeystroke();
						if (c == 33 || c == 34) {
							if (CKEDITOR.env.ie) {
								setTimeout(function() {
									b.getSelection().scrollIntoView();
								}, 0);
							} else {
								if (b.window.$.innerHeight > this.$.offsetHeight) {
									var d = b.createRange();
									d[c == 33 ? "moveToElementEditStart" : "moveToElementEditEnd"](this);
									d.select();
									a.data.preventDefault();
								}
							}
						}
					});
				}
				if (CKEDITOR.env.ie) {
					this.attachListener(c$$0, "blur", function() {
						try {
							c$$0.$.selection.empty();
						} catch (a) {}
					});
				}
				if (CKEDITOR.env.iOS) {
					this.attachListener(c$$0, "touchend", function() {
						a$$0.focus();
					});
				}
				b.document.getElementsByTag("title").getItem(0).data("cke-title", b.document.$.title);
				if (CKEDITOR.env.ie) {
					b.document.$.title = this._.docTitle;
				}
				CKEDITOR.tools.setTimeout(function() {
					if (this.status == "unloaded") {
						this.status = "ready";
					}
					b.fire("contentDom");
					if (this._.isPendingFocus) {
						b.focus();
						this._.isPendingFocus = false;
					}
					setTimeout(function() {
						b.fire("dataReady");
					}, 0);
					if (CKEDITOR.env.ie) {
						setTimeout(function() {
							if (b.document) {
								var a = b.document.$.body;
								a.runtimeStyle.marginBottom = "0px";
								a.runtimeStyle.marginBottom = "";
							}
						}, 1E3);
					}
				}, 0, this);
			}

			function e$$1() {
				var a = [];
				if (CKEDITOR.document.$.documentMode >= 8) {
					a.push("html.CSS1Compat [contenteditable=false]{min-height:0 !important}");
					var b = [];
					var c;
					for (c in CKEDITOR.dtd.$removeEmpty) {
						b.push("html.CSS1Compat " + c + "[contenteditable=false]");
					}
					a.push(b.join(",") + "{display:inline-block}");
				} else {
					if (CKEDITOR.env.gecko) {
						a.push("html{height:100% !important}");
						a.push("img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}");
					}
				}
				a.push("html{cursor:text;*cursor:auto}");
				a.push("img,input,textarea{cursor:default}");
				return a.join("\n");
			}
			CKEDITOR.plugins.add("wysiwygarea", {
				init: function(a$$0) {
					if (a$$0.config.fullPage) {
						a$$0.addFeature({
							allowedContent: "html head title; style [media,type]; body (*)[id]; meta link [*]",
							requiredContent: "body"
						});
					}
					a$$0.addMode("wysiwyg", function(e) {
						function c$$0(c) {
							if (c) {
								c.removeListener();
							}
							a$$0.editable(new b$$1(a$$0, j.$.contentWindow.document.body));
							a$$0.setData(a$$0.getData(1), e);
						}
						var h = "document.open();" + (CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "") + "document.close();";
						h = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent(h) + "}())" : "";
						var j = CKEDITOR.dom.element.createFromHtml('<iframe src="' + h + '" frameBorder="0"></iframe>');
						j.setStyles({
							width: "100%",
							height: "100%"
						});
						j.addClass("cke_wysiwyg_frame cke_reset");
						var g = a$$0.ui.space("contents");
						g.append(j);
						if (h = CKEDITOR.env.ie || CKEDITOR.env.gecko) {
							j.on("load", c$$0);
						}
						var i = a$$0.title;
						var k = a$$0.lang.common.editorHelp;
						if (i) {
							if (CKEDITOR.env.ie) {
								i = i + (", " + k);
							}
							j.setAttribute("title", i);
						}
						i = CKEDITOR.tools.getNextId();
						var n = CKEDITOR.dom.element.createFromHtml('<span id="' + i + '" class="cke_voice_label">' + k + "</span>");
						g.append(n, 1);
						a$$0.on("beforeModeUnload", function(a) {
							a.removeListener();
							n.remove();
						});
						j.setAttributes({
							"aria-describedby": i,
							tabIndex: a$$0.tabIndex,
							allowTransparency: "true"
						});
						if (!h) {
							c$$0();
						}
						if (CKEDITOR.env.webkit) {
							h = function() {
								g.setStyle("width", "100%");
								j.hide();
								j.setSize("width", g.getSize("width"));
								g.removeStyle("width");
								j.show();
							};
							j.setCustomData("onResize", h);
							CKEDITOR.document.getWindow().on("resize", h);
						}
						a$$0.fire("ariaWidget", j);
					});
				}
			});
			CKEDITOR.editor.prototype.addContentsCss = function(a) {
				var b = this.config;
				var c = b.contentsCss;
				if (!CKEDITOR.tools.isArray(c)) {
					b.contentsCss = c ? [c] : [];
				}
				b.contentsCss.push(a);
			};
			var b$$1 = CKEDITOR.tools.createClass({
				$: function(b$$0) {
					this.base.apply(this, arguments);
					this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function(b) {
						CKEDITOR.tools.setTimeout(a$$1, 0, this, b);
					}, this);
					this._.docTitle = this.getWindow().getFrame().getAttribute("title");
				},
				base: CKEDITOR.editable,
				proto: {
					setData: function(a$$0, b) {
						var c = this.editor;
						if (b) {
							this.setHtml(a$$0);
							c.fire("dataReady");
						} else {
							this._.isLoadingData = true;
							c._.dataStore = {
								id: 1
							};
							var h = c.config;
							var j = h.fullPage;
							var g = h.docType;
							var i = CKEDITOR.tools.buildStyleHtml(e$$1()).replace(/<style>/, '<style data-cke-temp="1">');
							if (!j) {
								i = i + CKEDITOR.tools.buildStyleHtml(c.config.contentsCss);
							}
							var k = h.baseHref ? '<base href="' + h.baseHref + '" data-cke-temp="1" />' : "";
							if (j) {
								a$$0 = a$$0.replace(/<!DOCTYPE[^>]*>/i, function(a) {
									c.docType = g = a;
									return "";
								}).replace(/<\?xml\s[^\?]*\?>/i, function(a) {
									c.xmlDeclaration = a;
									return "";
								});
							}
							a$$0 = c.dataProcessor.toHtml(a$$0);
							if (j) {
								if (!/<body[\s|>]/.test(a$$0)) {
									a$$0 = "<body>" + a$$0;
								}
								if (!/<html[\s|>]/.test(a$$0)) {
									a$$0 = "<html>" + a$$0 + "</html>";
								}
								if (/<head[\s|>]/.test(a$$0)) {
									if (!/<title[\s|>]/.test(a$$0)) {
										a$$0 = a$$0.replace(/<head[^>]*>/, "$&<title></title>");
									}
								} else {
									a$$0 = a$$0.replace(/<html[^>]*>/, "$&<head><title></title></head>");
								}
								if (k) {
									a$$0 = a$$0.replace(/<head>/, "$&" + k);
								}
								a$$0 = a$$0.replace(/<\/head\s*>/, i + "$&");
								a$$0 = g + a$$0;
							} else {
								a$$0 = h.docType + '<html dir="' + h.contentsLangDirection + '" lang="' + (h.contentsLanguage || c.langCode) + '"><head><title>' + this._.docTitle + "</title>" + k + i + "</head><body" + (h.bodyId ? ' id="' + h.bodyId + '"' : "") + (h.bodyClass ? ' class="' + h.bodyClass + '"' : "") + ">" + a$$0 + "</body></html>";
							}
							if (CKEDITOR.env.gecko) {
								a$$0 = a$$0.replace(/<body/, '<body contenteditable="true" ');
								if (CKEDITOR.env.version < 2E4) {
									a$$0 = a$$0.replace(/<body[^>]*>/, "$&\x3c!-- cke-content-start --\x3e");
								}
							}
							h = '<script id="cke_actscrpt" type="text/javascript"' + (CKEDITOR.env.ie ? ' defer="defer" ' : "") + ">var wasLoaded=0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" + this._.frameLoadedHandler + ",window);wasLoaded=1;}" + (CKEDITOR.env.ie ? "onload();" : 'document.addEventListener("DOMContentLoaded", onload, false );') + "\x3c/script>";
							if (CKEDITOR.env.ie) {
								if (CKEDITOR.env.version < 9) {
									h = h + '<script id="cke_shimscrpt">window.parent.CKEDITOR.tools.enableHtml5Elements(document)\x3c/script>';
								}
							}
							a$$0 = a$$0.replace(/(?=\s*<\/(:?head)>)/, h);
							this.clearCustomData();
							this.clearListeners();
							c.fire("contentDomUnload");
							var n = this.getDocument();
							try {
								n.write(a$$0);
							} catch (o) {
								setTimeout(function() {
									n.write(a$$0);
								}, 0);
							}
						}
					},
					getData: function(a) {
						if (a) {
							return this.getHtml();
						}
						a = this.editor;
						var b = a.config;
						var c = b.fullPage;
						var e = c && a.docType;
						var j = c && a.xmlDeclaration;
						var g = this.getDocument();
						c = c ? g.getDocumentElement().getOuterHtml() : g.getBody().getHtml();
						if (CKEDITOR.env.gecko) {
							if (b.enterMode != CKEDITOR.ENTER_BR) {
								c = c.replace(/<br>(?=\s*(:?$|<\/body>))/, "");
							}
						}
						c = a.dataProcessor.toDataFormat(c);
						if (j) {
							c = j + "\n" + c;
						}
						if (e) {
							c = e + "\n" + c;
						}
						return c;
					},
					focus: function() {
						if (this._.isLoadingData) {
							this._.isPendingFocus = true;
						} else {
							b$$1.baseProto.focus.call(this);
						}
					},
					detach: function() {
						var a = this.editor;
						var e = a.document;
						a = a.window.getFrame();
						b$$1.baseProto.detach.call(this);
						this.clearCustomData();
						e.getDocumentElement().clearCustomData();
						a.clearCustomData();
						CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);
						if (e = a.removeCustomData("onResize")) {
							e.removeListener();
						}
						a.remove();
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
				requires: ["dialog"],
				lang: ["en", "de", "el", "es", "it", "nl", "sv", "tr"],
				init: function(a$$0) {
					var e$$0 = a$$0.lang.imagemaps;
					window.imgmapStrings = e$$0.imgmapStrings;
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
					CKEDITOR.dialog.add("ImageMaps", this.path + "dialog/imagemaps.js");
					var b$$1 = a$$0.addCommand("imagemaps", new CKEDITOR.dialogCommand("ImageMaps", {
						allowedContent: "img[usemap];map[id,name];area[alt,coords,href,shape,target,title]",
						requiredContent: "img[src]"
					}));
					b$$1.startDisabled = true;
					a$$0.ui.addButton("ImageMaps", {
						label: e$$0.toolbar,
						command: "imagemaps",
						toolbar: "insert,10"
					});
					if (a$$0.addMenuItems) {
						a$$0.addMenuItems({
							imagemaps: {
								label: e$$0.menu,
								command: "imagemaps",
								group: "image",
								order: 1
							}
						});
					}
					if (a$$0.contextMenu) {
						a$$0.contextMenu.addListener(function(a) {
							a = d$$0(a);
							return !a ? null : {
								imagemaps: a.hasAttribute("usemap") ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF
							};
						});
					}
					a$$0.on("doubleclick", function(a) {
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
						if ((j = d$$0(b)) && j.hasAttribute("usemap")) {
							e.getSelection().selectElement(j);
							a.data.dialog = "ImageMaps";
						}
					}, null, null, 20);
					if (a$$0.widgets) {
						a$$0.on("contentDom", function() {
							var b = a$$0.editable();
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
											if (d = a$$0.widgets.getByElement(new CKEDITOR.dom.node(d))) {
												d.focus();
												c.data.preventDefault();
											}
										}
									}
								}
							});
						});
					}
					var d$$0 = function(b) {
						if (a$$0.widgets) {
							var c = a$$0.widgets.focused;
							if (!c) {
								if (c = a$$0.widgets.getByElement(b)) {
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
					a$$0.on("selectionChange", CKEDITOR.tools.bind(function(a) {
						if (a = d$$0(a.data.path.lastElement)) {
							this.setState(a.hasAttribute("usemap") ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
						} else {
							this.setState(CKEDITOR.TRISTATE_DISABLED);
						}
					}, b$$1));
					if (!CKEDITOR.env.ie || (a$$0.plugins.image2 || !(CKEDITOR.env.version < 9))) {
						CKEDITOR.on("dialogDefinition", function(b$$0) {
							if (b$$0.data.name == "image") {
								var c$$0 = b$$0.data.definition;
								b$$0.removeListener();
								c$$0.onOk = CKEDITOR.tools.override(c$$0.onOk, function(b) {
									return function() {
										b.call(this);
										var c = this.imageElement;
										var d = c.getAttribute("usemap");
										if (d) {
											if (d = (a$$0.editable ? a$$0.editable().$ : a$$0.document.$).querySelector(d)) {
												CKEDITOR.plugins.imagemaps.drawMap(c.$, d);
											}
										}
									};
								});
							}
						});
						e$$0 = "dataReady";
						if (CKEDITOR.skins) {
							e$$0 = "contentDom";
						}
						a$$0.on(e$$0, function(a) {
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
		CKEDITOR.config.plugins = "basicstyles,dialogui,dialog,colordialog,clipboard,panel,floatpanel,menu,contextmenu,elementspath,enterkey,entities,popup,filebrowser,floatingspace,htmlwriter,image,justify,fakeobjects,link,maximize,preview,resize,selectall,sourcearea,button,toolbar,undo,wysiwygarea,imagemaps";
		CKEDITOR.config.skin = "alive";
		(function() {
			var a$$0 = function(a, b) {
				var d = CKEDITOR.getUrl("plugins/" + b);
				a = a.split(",");
				var f = 0;
				for (; f < a.length; f++) {
					CKEDITOR.skin.icons[a[f]] = {
						path: d,
						offset: -a[++f],
						bgsize: a[++f]
					};
				}
			};
			if (CKEDITOR.env.hidpi) {
				a$$0("bold,0,,italic,24,,strike,48,,subscript,72,,superscript,96,,underline,120,,copy-rtl,144,,copy,168,,cut-rtl,192,,cut,216,,paste-rtl,240,,paste,264,,image,288,,imagemaps,624,auto,justifyblock,336,,justifycenter,360,,justifyleft,384,,justifyright,408,,anchor-rtl,432,,anchor,456,,link,480,,unlink,504,,maximize,528,,preview-rtl,552,,preview,576,,selectall,600,,source-rtl,624,,source,648,,redo-rtl,672,,redo,696,,undo-rtl,720,,undo,744,", "icons_hidpi.png");
			} else {
				a$$0("bold,0,auto,italic,24,auto,strike,48,auto,subscript,72,auto,superscript,96,auto,underline,120,auto,copy-rtl,144,auto,copy,168,auto,cut-rtl,192,auto,cut,216,auto,paste-rtl,240,auto,paste,264,auto,image,288,auto,imagemaps,312,auto,justifyblock,336,auto,justifycenter,360,auto,justifyleft,384,auto,justifyright,408,auto,anchor-rtl,432,auto,anchor,456,auto,link,480,auto,unlink,504,auto,maximize,528,auto,preview-rtl,552,auto,preview,576,auto,selectall,600,auto,source-rtl,624,auto,source,648,auto,redo-rtl,672,auto,redo,696,auto,undo-rtl,720,auto,undo,744,auto",
					"icons.png");
			}
		})();
		CKEDITOR.lang.languages = {
			en: 1,
			de: 1,
			el: 1,
			es: 1,
			it: 1,
			nl: 1,
			sv: 1,
			tr: 1
		};
	}
})();
(function() {
	function a$$1(a) {
		d$$0(true);
		f$$0();
		m = a.aid;
		r.setValueOf("info", "href", a.ahref);
		r.setValueOf("info", "target", a.atarget || "notSet");
		r.setValueOf("info", "alt", a.aalt);
		r.setValueOf("info", "title", a.atitle);
	}

	function e$$0(a) {
		d$$0(true);
		f$$0();
		m = a;
		r.getContentElement("info", "href").setValue("", true);
		r.getContentElement("info", "target").setValue("notSet", true);
		r.getContentElement("info", "alt").setValue("", true);
		r.getContentElement("info", "title").setValue("", true);
	}

	function b$$0() {
		m = null;
		d$$0(false);
	}

	function d$$0(a) {
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

	function f$$0() {
		if (null !== m) {
			i.areas[m].ahref = r.getValueOf("info", "href");
			i.areas[m].aalt = r.getValueOf("info", "alt");
			i.areas[m].atitle = r.getValueOf("info", "title");
		}
	}

	function c$$0(a) {
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

	function j$$0(a) {
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

	function g$$0() {
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
							onSelectArea: a$$1,
							onRemoveArea: b$$0,
							onStatusMessage: function(a) {
								document.getElementById(v).innerHTML = a;
							},
							onLoadImage: function(a$$0) {
								var b = a$$0.getAttribute("width");
								var c = a$$0.getAttribute("height");
								if (b) {
									a$$0.style.width = b + "px";
								}
								if (c) {
									a$$0.style.height = c + "px";
								}
								l = new CKEDITOR.dom.element(a$$0);
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
					i.config.custom_callbacks.onAddArea = e$$0;
					if (n) {
						i.blurArea(i.currentid);
						i.currentid = 0;
						i.selectedId = 0;
						a$$1(i.areas[0]);
						i.highlightArea(0);
						c$$0("pointer");
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
								c$$0("pointer");
							},
							html: '<span style="background-position: 0 -64px;" class="imgmapButton" title="' + q.imgmapPointer + '"></span>'
						}, {
							type: "html",
							id: "btn_rect",
							onClick: function() {
								c$$0("rect");
							},
							html: '<span style="background-position: 0 -128px;" class="imgmapButton" title="' + q.imgmapRectangle + '"></span>'
						}, {
							type: "html",
							id: "btn_circle",
							onClick: function() {
								c$$0("circle");
							},
							html: '<span style="background-position: 0 0;" class="imgmapButton" title="' + q.imgmapCircle + '"></span>'
						}, {
							type: "html",
							id: "btn_poly",
							onClick: function() {
								c$$0("poly");
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
							onChange: g$$0
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
							onChange: g$$0,
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
							onChange: g$$0
						}, {
							type: "text",
							id: "alt",
							hidden: true,
							label: q.altText,
							onChange: g$$0
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
				f$$0();
				if (k && "IMG" == k.nodeName) {
					var a = j$$0(i);
					if (a) {
						i.mapid = i.mapname = r.getValueOf("info", "MapName");
						if ("boolean" == typeof d.fire("imagemaps.validate", i)) {
							return false;
						}
						d.fire("saveSnapshot");
						a = j$$0(i);
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
		function a$$1() {
			return this.context_ || (this.context_ = new i$$0(this));
		}

		function e$$0(a, b) {
			var c = B.call(arguments, 2);
			return function() {
				return a.apply(b, c.concat(B.call(arguments)));
			};
		}

		function b$$1(a) {
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

		function d$$0(a) {
			a = a.srcElement;
			if (a.firstChild) {
				a.firstChild.style.width = a.clientWidth + "px";
				a.firstChild.style.height = a.clientHeight + "px";
			}
		}

		function f$$0() {
			return [
				[1, 0, 0],
				[0, 1, 0],
				[0, 0, 1]
			];
		}

		function c$$0(a, b) {
			var c = f$$0();
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

		function h$$0(a, b) {
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

		function j$$0(a) {
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

		function g$$0(a) {
			switch (a) {
				case "butt":
					return "flat";
				case "round":
					return "round";
				default:
					return "square";
			}
		}

		function i$$0(a) {
			this.m_ = f$$0();
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

		function k$$0(a, b, c, d) {
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

		function n$$0(a, b, c) {
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
				a.lineScale_ = x(p$$0(b[0][0] * b[1][1] - b[0][1] * b[1][0]));
			}
		}

		function o$$0(a) {
			this.type_ = a;
			this.r1_ = this.y1_ = this.x1_ = this.r0_ = this.y0_ = this.x0_ = 0;
			this.colors_ = [];
		}

		function r$$0() {}
		var l = Math;
		var m = l.round;
		var s$$0 = l.sin;
		var t$$0 = l.cos;
		var p$$0 = l.abs;
		var x = l.sqrt;
		var q = 10;
		var u$$0 = q / 2;
		var B = Array.prototype.slice;
		var v = {
			init: function(a) {
				if (/MSIE/.test(navigator.userAgent)) {
					if (!window.opera) {
						a = a || document;
						a.createElement("canvas");
						if ("complete" !== a.readyState) {
							a.attachEvent("onreadystatechange", e$$0(this.init_, this, a));
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
					c.getContext = a$$1;
					c.innerHTML = "";
					c.attachEvent("onpropertychange", b$$1);
					c.attachEvent("onresize", d$$0);
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
		w = i$$0.prototype;
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
			k$$0(this, a, c, e);
		};
		w.quadraticCurveTo = function(a, b, c, d) {
			a = this.getCoords_(a, b);
			c = this.getCoords_(c, d);
			d = {
				x: this.currentX_ + 2 / 3 * (a.x - this.currentX_),
				y: this.currentY_ + 2 / 3 * (a.y - this.currentY_)
			};
			k$$0(this, d, {
				x: d.x + (c.x - this.currentX_) / 3,
				y: d.y + (c.y - this.currentY_) / 3
			}, c);
		};
		w.arc = function(a, b, c, d, e, f) {
			c = c * q;
			var g = f ? "at" : "wa";
			var h = a + t$$0(d) * c - u$$0;
			var i = b + s$$0(d) * c - u$$0;
			d = a + t$$0(e) * c - u$$0;
			e = b + s$$0(e) * c - u$$0;
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
			var e = new o$$0("gradient");
			return e.x0_ = a, e.y0_ = b, e.x1_ = c, e.y1_ = d, e;
		};
		w.createRadialGradient = function(a, b, c, d, e, f) {
			var g = new o$$0("gradientradial");
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
		w.stroke = function(a$$0) {
			var b$$0 = [];
			var c = j$$0(a$$0 ? this.fillStyle : this.strokeStyle);
			var d = c.color;
			c = c.alpha * this.globalAlpha;
			var e;
			var f;
			var h;
			var i;
			b$$0.push("<g_vml_:shape", ' filled="', !!a$$0, '"', ' style="position:absolute;width:', 10, "px;height:", 10, 'px;"', ' coordorigin="0 0" coordsize="', 10 * q, " ", 10 * q, '"', ' stroked="', !a$$0, '"', ' path="');
			var k = i = h = null;
			var n = null;
			f = 0;
			for (; f < this.currentPath_.length; f++) {
				e = this.currentPath_[f];
				switch (e.type) {
					case "moveTo":
						b$$0.push(" m ", m(e.x), ",", m(e.y));
						break;
					case "lineTo":
						b$$0.push(" l ", m(e.x), ",", m(e.y));
						break;
					case "close":
						b$$0.push(" x ");
						e = null;
						break;
					case "bezierCurveTo":
						b$$0.push(" c ", m(e.cp1x), ",", m(e.cp1y), ",", m(e.cp2x), ",", m(e.cp2y), ",", m(e.x), ",", m(e.y));
						break;
					case "at":
						;
					case "wa":
						b$$0.push(" ", e.type, " ", m(e.x - this.arcScaleX_ * e.radius), ",", m(e.y - this.arcScaleY_ * e.radius), " ", m(e.x + this.arcScaleX_ * e.radius), ",", m(e.y + this.arcScaleY_ * e.radius), " ", m(e.xStart), ",", m(e.yStart), " ", m(e.xEnd), ",", m(e.yEnd));
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
			if (b$$0.push(' ">'), a$$0) {
				if ("object" == typeof this.fillStyle) {
					d = this.fillStyle;
					var o = 0;
					e = c = a$$0 = 0;
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
						a$$0 = (f.x - h) / e;
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
					b$$0.push('<g_vml_:fill type="', d.type_, '"', ' method="none" focus="100%"', ' color="', k, '"', ' color2="', r, '"', ' colors="', u.join(","), '"', ' opacity="', t, '"', ' g_o_:opacity2="', s, '"', ' angle="', o, '"', ' focusposition="', a$$0, ",", c, '" />');
				} else {
					b$$0.push('<g_vml_:fill color="', d, '" opacity="', c, '" />');
				}
			} else {
				a$$0 = this.lineScale_ * this.lineWidth;
				if (1 > a$$0) {
					c *= a$$0;
				}
				b$$0.push("<g_vml_:stroke", ' opacity="', c, '"', ' joinstyle="', this.lineJoin, '"', ' miterlimit="', this.miterLimit, '"', ' endcap="', g$$0(this.lineCap), '"', ' weight="', a$$0, 'px"', ' color="', d, '" />');
			}
			b$$0.push("</g_vml_:shape>");
			this.element_.insertAdjacentHTML("beforeEnd", b$$0.join(""));
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
				x: q * (a * c[0][0] + b * c[1][0] + c[2][0]) - u$$0,
				y: q * (a * c[0][1] + b * c[1][1] + c[2][1]) - u$$0
			};
		};
		w.save = function() {
			var a = {};
			h$$0(this, a);
			this.aStack_.push(a);
			this.mStack_.push(this.m_);
			this.m_ = c$$0(f$$0(), this.m_);
		};
		w.restore = function() {
			h$$0(this.aStack_.pop(), this);
			this.m_ = this.mStack_.pop();
		};
		w.translate = function(a, b) {
			n$$0(this, c$$0([
				[1, 0, 0],
				[0, 1, 0],
				[a, b, 1]
			], this.m_), false);
		};
		w.rotate = function(a) {
			var b = t$$0(a);
			a = s$$0(a);
			n$$0(this, c$$0([
				[b, a, 0],
				[-a, b, 0],
				[0, 0, 1]
			], this.m_), false);
		};
		w.scale = function(a, b) {
			this.arcScaleX_ *= a;
			this.arcScaleY_ *= b;
			n$$0(this, c$$0([
				[a, 0, 0],
				[0, b, 0],
				[0, 0, 1]
			], this.m_), true);
		};
		w.transform = function(a, b, d, e, f, g) {
			n$$0(this, c$$0([
				[a, b, 0],
				[d, e, 0],
				[f, g, 1]
			], this.m_), true);
		};
		w.setTransform = function(a, b, c, d, e, f) {
			n$$0(this, [
				[a, b, 0],
				[c, d, 0],
				[e, f, 1]
			], true);
		};
		w.clip = function() {};
		w.arcTo = function() {};
		w.createPattern = function() {
			return new r$$0;
		};
		o$$0.prototype.addColorStop = function(a, b) {
			b = j$$0(b);
			this.colors_.push({
				offset: a,
				color: b.color,
				alpha: b.alpha
			});
		};
		G_vmlCanvasManager = v;
		CanvasRenderingContext2D = i$$0;
		CanvasGradient = o$$0;
		CanvasPattern = r$$0;
	})();
}
CKEDITOR.editorConfig = function(a) {
	a.customConfig = "";
	a.toolbarGroups = [{
		name: "document",
		groups: ["mode", "document", "doctools"]
	}, {
		name: "clipboard",
		groups: ["clipboard", "undo"]
	}, {
		name: "basicstyles",
		groups: ["basicstyles", "cleanup"]
	}, {
		name: "links"
	}, {
		name: "insert"
	}, {
		name: "tools"
	}, {
		name: "others"
	}, {
		name: "about"
	}];
};