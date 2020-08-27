(function() {
	if (!window.CKEDITOR || !window.CKEDITOR.dom) {
		if (!window.CKEDITOR) {
			window.CKEDITOR = function() {
				var b = {
					timestamp: "E31J",
					version: "4.3.4 DEV",
					revision: "0",
					rnd: Math.floor(900 * Math.random()) + 100,
					_: {
						pending: []
					},
					status: "unloaded",
					basePath: function() {
						var a = window.CKEDITOR_BASEPATH || "";
						if (!a) {
							var d = document.getElementsByTagName("script");
							var e = 0;
							for (; e < d.length; e++) {
								var b = d[e].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);
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
						function a() {
							try {
								if (document.addEventListener) {
									document.removeEventListener("DOMContentLoaded", a, false);
									d$$2();
								} else {
									if (document.attachEvent) {
										if ("complete" === document.readyState) {
											document.detachEvent("onreadystatechange", a);
											d$$2();
										}
									}
								}
							} catch (e) {}
						}

						function d$$2() {
							var d;
							for (; d = e$$0.shift();) {
								d();
							}
						}
						var e$$0 = [];
						return function(d$$0) {
							e$$0.push(d$$0);
							if ("complete" === document.readyState) {
								setTimeout(a, 1);
							}
							if (1 == e$$0.length) {
								if (document.addEventListener) {
									document.addEventListener("DOMContentLoaded", a, false);
									window.addEventListener("load", a, false);
								} else {
									if (document.attachEvent) {
										document.attachEvent("onreadystatechange", a);
										window.attachEvent("onload", a);
										d$$0 = false;
										try {
											d$$0 = !window.frameElement;
										} catch (b) {}
										if (document.documentElement.doScroll && d$$0) {
											var c = function() {
												try {
													document.documentElement.doScroll("left");
												} catch (d) {
													setTimeout(c, 1);
													return;
												}
												a();
											};
											c();
										}
									}
								}
							}
						};
					}()
				};
				var f = window.CKEDITOR_GETURL;
				if (f) {
					var c = b.getUrl;
					b.getUrl = function(a) {
						return f.call(b, a) || c.call(b, a);
					};
				}
				return b;
			}();
		}
		if (!CKEDITOR.event) {
			CKEDITOR.event = function() {};
			CKEDITOR.event.implementOn = function(b) {
				var f = CKEDITOR.event.prototype;
				var c;
				for (c in f) {
					if (b[c] == void 0) {
						b[c] = f[c];
					}
				}
			};
			CKEDITOR.event.prototype = function() {
				function b$$0(a) {
					var d = f$$0(this);
					return d[a] || (d[a] = new c$$0(a));
				}
				var f$$0 = function(a) {
					a = a.getPrivate && a.getPrivate() || (a._ || (a._ = {}));
					return a.events || (a.events = {});
				};
				var c$$0 = function(a) {
					this.name = a;
					this.listeners = [];
				};
				c$$0.prototype = {
					getListenerIndex: function(a) {
						var d = 0;
						var e = this.listeners;
						for (; d < e.length; d++) {
							if (e[d].fn == a) {
								return d;
							}
						}
						return -1;
					}
				};
				return {
					define: function(a, d) {
						var e = b$$0.call(this, a);
						CKEDITOR.tools.extend(e, d, true);
					},
					on: function(a, d, e, c, i$$0) {
						function h$$0(b, k, h, i) {
							b = {
								name: a,
								sender: this,
								editor: b,
								data: k,
								listenerData: c,
								stop: h,
								cancel: i,
								removeListener: j
							};
							return d.call(e, b) === false ? false : b.data;
						}

						function j() {
							n.removeListener(a, d);
						}
						var k = b$$0.call(this, a);
						if (k.getListenerIndex(d) < 0) {
							k = k.listeners;
							if (!e) {
								e = this;
							}
							if (isNaN(i$$0)) {
								i$$0 = 10;
							}
							var n = this;
							h$$0.fn = d;
							h$$0.priority = i$$0;
							var f = k.length - 1;
							for (; f >= 0; f--) {
								if (k[f].priority <= i$$0) {
									k.splice(f + 1, 0, h$$0);
									return {
										removeListener: j
									};
								}
							}
							k.unshift(h$$0);
						}
						return {
							removeListener: j
						};
					},
					once: function() {
						var a = arguments[1];
						arguments[1] = function(d) {
							d.removeListener();
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
						var d = function() {
							a = 1;
						};
						var e = 0;
						var b = function() {
							e = 1;
						};
						return function(c, h, j) {
							var k = f$$0(this)[c];
							c = a;
							var n = e;
							a = e = 0;
							if (k) {
								var m = k.listeners;
								if (m.length) {
									m = m.slice(0);
									var q;
									var o = 0;
									for (; o < m.length; o++) {
										if (k.errorProof) {
											try {
												q = m[o].call(this, j, h, d, b);
											} catch (l) {}
										} else {
											q = m[o].call(this, j, h, d, b);
										}
										if (q === false) {
											e = 1;
										} else {
											if (typeof q != "undefined") {
												h = q;
											}
										}
										if (a || e) {
											break;
										}
									}
								}
							}
							h = e ? false : typeof h == "undefined" ? true : h;
							a = c;
							e = n;
							return h;
						};
					}(),
					fireOnce: function(a, d, e) {
						d = this.fire(a, d, e);
						delete f$$0(this)[a];
						return d;
					},
					removeListener: function(a, d) {
						var e = f$$0(this)[a];
						if (e) {
							var b = e.getListenerIndex(d);
							if (b >= 0) {
								e.listeners.splice(b, 1);
							}
						}
					},
					removeAllListeners: function() {
						var a = f$$0(this);
						var d;
						for (d in a) {
							delete a[d];
						}
					},
					hasListeners: function(a) {
						return (a = f$$0(this)[a]) && a.listeners.length > 0;
					}
				};
			}();
		}
		if (!CKEDITOR.editor) {
			CKEDITOR.editor = function() {
				CKEDITOR._.pending.push([this, arguments]);
				CKEDITOR.event.call(this);
			};
			CKEDITOR.editor.prototype.fire = function(b, f) {
				if (b in {
					instanceReady: 1,
					loaded: 1
				}) {
					this[b] = true;
				}
				return CKEDITOR.event.prototype.fire.call(this, b, f, this);
			};
			CKEDITOR.editor.prototype.fireOnce = function(b, f) {
				if (b in {
					instanceReady: 1,
					loaded: 1
				}) {
					this[b] = true;
				}
				return CKEDITOR.event.prototype.fireOnce.call(this, b, f, this);
			};
			CKEDITOR.event.implementOn(CKEDITOR.editor.prototype);
		}
		if (!CKEDITOR.env) {
			CKEDITOR.env = function() {
				var b = navigator.userAgent.toLowerCase();
				var f = window.opera;
				var c = {
					ie: b.indexOf("trident/") > -1,
					opera: !!f && f.version,
					webkit: b.indexOf(" applewebkit/") > -1,
					air: b.indexOf(" adobeair/") > -1,
					mac: b.indexOf("macintosh") > -1,
					quirks: document.compatMode == "BackCompat" && (!document.documentMode || document.documentMode < 10),
					mobile: b.indexOf("mobile") > -1,
					iOS: /(ipad|iphone|ipod)/.test(b),
					isCustomDomain: function() {
						if (!this.ie) {
							return false;
						}
						var d = document.domain;
						var a = window.location.hostname;
						return d != a && d != "[" + a + "]";
					},
					secure: location.protocol == "https:"
				};
				c.gecko = navigator.product == "Gecko" && (!c.webkit && (!c.opera && !c.ie));
				if (c.webkit) {
					if (b.indexOf("chrome") > -1) {
						c.chrome = true;
					} else {
						c.safari = true;
					}
				}
				var a$$0 = 0;
				if (c.ie) {
					a$$0 = c.quirks || !document.documentMode ? parseFloat(b.match(/msie (\d+)/)[1]) : document.documentMode;
					c.ie9Compat = a$$0 == 9;
					c.ie8Compat = a$$0 == 8;
					c.ie7Compat = a$$0 == 7;
					c.ie6Compat = a$$0 < 7 || c.quirks;
				}
				if (c.gecko) {
					var d$$0 = b.match(/rv:([\d\.]+)/);
					if (d$$0) {
						d$$0 = d$$0[1].split(".");
						a$$0 = d$$0[0] * 1E4 + (d$$0[1] || 0) * 100 + (d$$0[2] || 0) * 1;
					}
				}
				if (c.opera) {
					a$$0 = parseFloat(f.version());
				}
				if (c.air) {
					a$$0 = parseFloat(b.match(/ adobeair\/(\d+)/)[1]);
				}
				if (c.webkit) {
					a$$0 = parseFloat(b.match(/ applewebkit\/(\d+)/)[1]);
				}
				c.version = a$$0;
				c.isCompatible = c.iOS && a$$0 >= 534 || !c.mobile && (c.ie && a$$0 > 6 || (c.gecko && a$$0 >= 10801 || (c.opera && a$$0 >= 9.5 || (c.air && a$$0 >= 1 || (c.webkit && a$$0 >= 522 || false)))));
				c.hidpi = window.devicePixelRatio >= 2;
				c.needsBrFiller = c.gecko || (c.webkit || c.ie && a$$0 > 10);
				c.needsNbspFiller = c.ie && a$$0 < 11;
				c.cssClass = "cke_browser_" + (c.ie ? "ie" : c.gecko ? "gecko" : c.opera ? "opera" : c.webkit ? "webkit" : "unknown");
				if (c.quirks) {
					c.cssClass = c.cssClass + " cke_browser_quirks";
				}
				if (c.ie) {
					c.cssClass = c.cssClass + (" cke_browser_ie" + (c.quirks || c.version < 7 ? "6" : c.version));
					if (c.quirks) {
						c.cssClass = c.cssClass + " cke_browser_iequirks";
					}
				}
				if (c.gecko) {
					if (a$$0 < 10900) {
						c.cssClass = c.cssClass + " cke_browser_gecko18";
					} else {
						if (a$$0 <= 11E3) {
							c.cssClass = c.cssClass + " cke_browser_gecko19";
						}
					}
				}
				if (c.air) {
					c.cssClass = c.cssClass + " cke_browser_air";
				}
				if (c.iOS) {
					c.cssClass = c.cssClass + " cke_browser_ios";
				}
				if (c.hidpi) {
					c.cssClass = c.cssClass + " cke_hidpi";
				}
				return c;
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
						var b = document.createElement("script");
						b.type = "text/javascript";
						b.src = CKEDITOR.basePath + "ckeditor.js";
						document.getElementsByTagName("head")[0].appendChild(b);
					}
				};
				CKEDITOR.loadFullCoreTimeout = 0;
				CKEDITOR.add = function(b) {
					(this._.pending || (this._.pending = [])).push(b);
				};
				(function() {
					CKEDITOR.domReady(function() {
						var b = CKEDITOR.loadFullCore;
						var f = CKEDITOR.loadFullCoreTimeout;
						if (b) {
							CKEDITOR.status = "basic_ready";
							if (b && b._load) {
								b();
							} else {
								if (f) {
									setTimeout(function() {
										if (CKEDITOR.loadFullCore) {
											CKEDITOR.loadFullCore();
										}
									}, f * 1E3);
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
			var b$$1 = [];
			var f = CKEDITOR.env.gecko ? "-moz-" : CKEDITOR.env.webkit ? "-webkit-" : CKEDITOR.env.opera ? "-o-" : CKEDITOR.env.ie ? "-ms-" : "";
			CKEDITOR.on("reset", function() {
				b$$1 = [];
			});
			CKEDITOR.tools = {
				arrayCompare: function(b, a) {
					if (!b && !a) {
						return true;
					}
					if (!b || (!a || b.length != a.length)) {
						return false;
					}
					var d = 0;
					for (; d < b.length; d++) {
						if (b[d] != a[d]) {
							return false;
						}
					}
					return true;
				},
				clone: function(b) {
					var a;
					if (b && b instanceof Array) {
						a = [];
						var d = 0;
						for (; d < b.length; d++) {
							a[d] = CKEDITOR.tools.clone(b[d]);
						}
						return a;
					}
					if (b === null || (typeof b != "object" || (b instanceof String || (b instanceof Number || (b instanceof Boolean || (b instanceof Date || b instanceof RegExp)))))) {
						return b;
					}
					a = new b.constructor;
					for (d in b) {
						a[d] = CKEDITOR.tools.clone(b[d]);
					}
					return a;
				},
				capitalize: function(b, a) {
					return b.charAt(0).toUpperCase() + (a ? b.slice(1) : b.slice(1).toLowerCase());
				},
				extend: function(b) {
					var a = arguments.length;
					var d;
					var e;
					if (typeof(d = arguments[a - 1]) == "boolean") {
						a--;
					} else {
						if (typeof(d = arguments[a - 2]) == "boolean") {
							e = arguments[a - 1];
							a = a - 2;
						}
					}
					var g = 1;
					for (; g < a; g++) {
						var i = arguments[g];
						var h;
						for (h in i) {
							if (d === true || b[h] == void 0) {
								if (!e || h in e) {
									b[h] = i[h];
								}
							}
						}
					}
					return b;
				},
				prototypedCopy: function(b) {
					var a = function() {};
					a.prototype = b;
					return new a;
				},
				copy: function(b) {
					var a = {};
					var d;
					for (d in b) {
						a[d] = b[d];
					}
					return a;
				},
				isArray: function(b) {
					return Object.prototype.toString.call(b) == "[object Array]";
				},
				isEmpty: function(b) {
					var a;
					for (a in b) {
						if (b.hasOwnProperty(a)) {
							return false;
						}
					}
					return true;
				},
				cssVendorPrefix: function(b, a, d) {
					if (d) {
						return f + b + ":" + a + ";" + b + ":" + a;
					}
					d = {};
					d[b] = a;
					d[f + b] = a;
					return d;
				},
				cssStyleToDomStyle: function() {
					var b = document.createElement("div").style;
					var a = typeof b.cssFloat != "undefined" ? "cssFloat" : typeof b.styleFloat != "undefined" ? "styleFloat" : "float";
					return function(d$$0) {
						return d$$0 == "float" ? a : d$$0.replace(/-./g, function(d) {
							return d.substr(1).toUpperCase();
						});
					};
				}(),
				buildStyleHtml: function(b) {
					b = [].concat(b);
					var a;
					var d = [];
					var e = 0;
					for (; e < b.length; e++) {
						if (a = b[e]) {
							if (/@import|[{}]/.test(a)) {
								d.push("<style>" + a + "</style>");
							} else {
								d.push('<link type="text/css" rel=stylesheet href="' + a + '">');
							}
						}
					}
					return d.join("");
				},
				htmlEncode: function(b) {
					return ("" + b).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
				},
				htmlEncodeAttr: function(b) {
					return b.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
				},
				htmlDecodeAttr: function(b) {
					return b.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
				},
				getNextNumber: function() {
					var b = 0;
					return function() {
						return ++b;
					};
				}(),
				getNextId: function() {
					return "cke_" + this.getNextNumber();
				},
				override: function(b, a) {
					var d = a(b);
					d.prototype = b.prototype;
					return d;
				},
				setTimeout: function(b, a, d, e, g) {
					if (!g) {
						g = window;
					}
					if (!d) {
						d = g;
					}
					return g.setTimeout(function() {
						if (e) {
							b.apply(d, [].concat(e));
						} else {
							b.apply(d);
						}
					}, a || 0);
				},
				trim: function() {
					var b = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
					return function(a) {
						return a.replace(b, "");
					};
				}(),
				ltrim: function() {
					var b = /^[ \t\n\r]+/g;
					return function(a) {
						return a.replace(b, "");
					};
				}(),
				rtrim: function() {
					var b = /[ \t\n\r]+$/g;
					return function(a) {
						return a.replace(b, "");
					};
				}(),
				indexOf: function(b, a) {
					if (typeof a == "function") {
						var d = 0;
						var e = b.length;
						for (; d < e; d++) {
							if (a(b[d])) {
								return d;
							}
						}
					} else {
						if (b.indexOf) {
							return b.indexOf(a);
						}
						d = 0;
						e = b.length;
						for (; d < e; d++) {
							if (b[d] === a) {
								return d;
							}
						}
					}
					return -1;
				},
				search: function(b, a) {
					var d = CKEDITOR.tools.indexOf(b, a);
					return d >= 0 ? b[d] : null;
				},
				bind: function(b, a) {
					return function() {
						return b.apply(a, arguments);
					};
				},
				createClass: function(b$$0) {
					var a$$0 = b$$0.$;
					var d$$0 = b$$0.base;
					var e = b$$0.privates || b$$0._;
					var g = b$$0.proto;
					b$$0 = b$$0.statics;
					if (!a$$0) {
						a$$0 = function() {
							if (d$$0) {
								this.base.apply(this, arguments);
							}
						};
					}
					if (e) {
						var i = a$$0;
						a$$0 = function() {
							var d = this._ || (this._ = {});
							var a;
							for (a in e) {
								var b = e[a];
								d[a] = typeof b == "function" ? CKEDITOR.tools.bind(b, this) : b;
							}
							i.apply(this, arguments);
						};
					}
					if (d$$0) {
						a$$0.prototype = this.prototypedCopy(d$$0.prototype);
						a$$0.prototype.constructor = a$$0;
						a$$0.base = d$$0;
						a$$0.baseProto = d$$0.prototype;
						a$$0.prototype.base = function() {
							this.base = d$$0.prototype.base;
							d$$0.apply(this, arguments);
							this.base = arguments.callee;
						};
					}
					if (g) {
						this.extend(a$$0.prototype, g, true);
					}
					if (b$$0) {
						this.extend(a$$0, b$$0, true);
					}
					return a$$0;
				},
				addFunction: function(c, a) {
					return b$$1.push(function() {
						return c.apply(a || this, arguments);
					}) - 1;
				},
				removeFunction: function(c) {
					b$$1[c] = null;
				},
				callFunction: function(c) {
					var a = b$$1[c];
					return a && a.apply(window, Array.prototype.slice.call(arguments, 1));
				},
				cssLength: function() {
					var b = /^-?\d+\.?\d*px$/;
					var a;
					return function(d) {
						a = CKEDITOR.tools.trim(d + "") + "px";
						return b.test(a) ? a : d || "";
					};
				}(),
				convertToPx: function() {
					var b;
					return function(a) {
						if (!b) {
							b = CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>', CKEDITOR.document);
							CKEDITOR.document.getBody().append(b);
						}
						if (!/%$/.test(a)) {
							b.setStyle("width", a);
							return b.$.clientWidth;
						}
						return a;
					};
				}(),
				repeat: function(b, a) {
					return Array(a + 1).join(b);
				},
				tryThese: function() {
					var b;
					var a = 0;
					var d = arguments.length;
					for (; a < d; a++) {
						var e = arguments[a];
						try {
							b = e();
							break;
						} catch (g) {}
					}
					return b;
				},
				genKey: function() {
					return Array.prototype.slice.call(arguments).join("-");
				},
				defer: function(b) {
					return function() {
						var a = arguments;
						var d = this;
						window.setTimeout(function() {
							b.apply(d, a);
						}, 0);
					};
				},
				normalizeCssText: function(b, a) {
					var d = [];
					var e;
					var g = CKEDITOR.tools.parseCssText(b, true, a);
					for (e in g) {
						d.push(e + ":" + g[e]);
					}
					d.sort();
					return d.length ? d.join(";") + ";" : "";
				},
				convertRgbToHex: function(b$$0) {
					return b$$0.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi, function(a, d, e, b) {
						a = [d, e, b];
						d = 0;
						for (; d < 3; d++) {
							a[d] = ("0" + parseInt(a[d], 10).toString(16)).slice(-2);
						}
						return "#" + a.join("");
					});
				},
				parseCssText: function(b$$0, a, d$$0) {
					var e = {};
					if (d$$0) {
						d$$0 = new CKEDITOR.dom.element("span");
						d$$0.setAttribute("style", b$$0);
						b$$0 = CKEDITOR.tools.convertRgbToHex(d$$0.getAttribute("style") || "");
					}
					if (!b$$0 || b$$0 == ";") {
						return e;
					}
					b$$0.replace(/&quot;/g, '"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(d, b, c) {
						if (a) {
							b = b.toLowerCase();
							if (b == "font-family") {
								c = c.toLowerCase().replace(/["']/g, "").replace(/\s*,\s*/g, ",");
							}
							c = CKEDITOR.tools.trim(c);
						}
						e[b] = c;
					});
					return e;
				},
				writeCssText: function(b, a) {
					var d;
					var e = [];
					for (d in b) {
						e.push(d + ":" + b[d]);
					}
					if (a) {
						e.sort();
					}
					return e.join("; ");
				},
				objectCompare: function(b, a, d) {
					var e;
					if (!b && !a) {
						return true;
					}
					if (!b || !a) {
						return false;
					}
					for (e in b) {
						if (b[e] != a[e]) {
							return false;
						}
					}
					if (!d) {
						for (e in a) {
							if (b[e] != a[e]) {
								return false;
							}
						}
					}
					return true;
				},
				objectKeys: function(b) {
					var a = [];
					var d;
					for (d in b) {
						a.push(d);
					}
					return a;
				},
				convertArrayToObject: function(b, a) {
					var d = {};
					if (arguments.length == 1) {
						a = true;
					}
					var e = 0;
					var g = b.length;
					for (; e < g; ++e) {
						d[b[e]] = a;
					}
					return d;
				},
				fixDomain: function() {
					var b;
					for (;;) {
						try {
							b = window.parent.document.domain;
							break;
						} catch (a) {
							b = b ? b.replace(/.+?(?:\.|$)/, "") : document.domain;
							if (!b) {
								break;
							}
							document.domain = b;
						}
					}
					return !!b;
				},
				eventsBuffer: function(b, a$$0) {
					function d() {
						g = (new Date).getTime();
						e = false;
						a$$0();
					}
					var e;
					var g = 0;
					return {
						input: function() {
							if (!e) {
								var a = (new Date).getTime() - g;
								if (a < b) {
									e = setTimeout(d, b - a);
								} else {
									d();
								}
							}
						},
						reset: function() {
							if (e) {
								clearTimeout(e);
							}
							e = g = 0;
						}
					};
				},
				enableHtml5Elements: function(b, a) {
					var d = ["abbr", "article", "aside", "audio", "bdi", "canvas", "data", "datalist", "details", "figcaption", "figure", "footer", "header", "hgroup", "mark", "meter", "nav", "output", "progress", "section", "summary", "time", "video"];
					var e = d.length;
					var g;
					for (; e--;) {
						g = b.createElement(d[e]);
						if (a) {
							b.appendChild(g);
						}
					}
				}
			};
		})();
		CKEDITOR.dtd = function() {
			var b$$0 = CKEDITOR.tools.extend;
			var f = function(d, a) {
				var b = CKEDITOR.tools.clone(d);
				var e = 1;
				for (; e < arguments.length; e++) {
					a = arguments[e];
					var c;
					for (c in a) {
						delete b[c];
					}
				}
				return b;
			};
			var c$$0 = {};
			var a$$0 = {};
			var d$$0 = {
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
			var e$$0 = {
				command: 1,
				link: 1,
				meta: 1,
				noscript: 1,
				script: 1,
				style: 1
			};
			var g = {};
			var i = {
				"#": 1
			};
			var h = {
				center: 1,
				dir: 1,
				noframes: 1
			};
			b$$0(c$$0, {
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
			}, i, {
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
			b$$0(a$$0, d$$0, c$$0, h);
			f = {
				a: f(c$$0, {
					a: 1,
					button: 1
				}),
				abbr: c$$0,
				address: a$$0,
				area: g,
				article: b$$0({
					style: 1
				}, a$$0),
				aside: b$$0({
					style: 1
				}, a$$0),
				audio: b$$0({
					source: 1,
					track: 1
				}, a$$0),
				b: c$$0,
				base: g,
				bdi: c$$0,
				bdo: c$$0,
				blockquote: a$$0,
				body: a$$0,
				br: g,
				button: f(c$$0, {
					a: 1,
					button: 1
				}),
				canvas: c$$0,
				caption: a$$0,
				cite: c$$0,
				code: c$$0,
				col: g,
				colgroup: {
					col: 1
				},
				command: g,
				datalist: b$$0({
					option: 1
				}, c$$0),
				dd: a$$0,
				del: c$$0,
				details: b$$0({
					summary: 1
				}, a$$0),
				dfn: c$$0,
				div: b$$0({
					style: 1
				}, a$$0),
				dl: {
					dt: 1,
					dd: 1
				},
				dt: a$$0,
				em: c$$0,
				embed: g,
				fieldset: b$$0({
					legend: 1
				}, a$$0),
				figcaption: a$$0,
				figure: b$$0({
					figcaption: 1
				}, a$$0),
				footer: a$$0,
				form: a$$0,
				h1: c$$0,
				h2: c$$0,
				h3: c$$0,
				h4: c$$0,
				h5: c$$0,
				h6: c$$0,
				head: b$$0({
					title: 1,
					base: 1
				}, e$$0),
				header: a$$0,
				hgroup: {
					h1: 1,
					h2: 1,
					h3: 1,
					h4: 1,
					h5: 1,
					h6: 1
				},
				hr: g,
				html: b$$0({
					head: 1,
					body: 1
				}, a$$0, e$$0),
				i: c$$0,
				iframe: i,
				img: g,
				input: g,
				ins: c$$0,
				kbd: c$$0,
				keygen: g,
				label: c$$0,
				legend: c$$0,
				li: a$$0,
				link: g,
				map: a$$0,
				mark: c$$0,
				menu: b$$0({
					li: 1
				}, a$$0),
				meta: g,
				meter: f(c$$0, {
					meter: 1
				}),
				nav: a$$0,
				noscript: b$$0({
					link: 1,
					meta: 1,
					style: 1
				}, c$$0),
				object: b$$0({
					param: 1
				}, c$$0),
				ol: {
					li: 1
				},
				optgroup: {
					option: 1
				},
				option: i,
				output: c$$0,
				p: c$$0,
				param: g,
				pre: c$$0,
				progress: f(c$$0, {
					progress: 1
				}),
				q: c$$0,
				rp: c$$0,
				rt: c$$0,
				ruby: b$$0({
					rp: 1,
					rt: 1
				}, c$$0),
				s: c$$0,
				samp: c$$0,
				script: i,
				section: b$$0({
					style: 1
				}, a$$0),
				select: {
					optgroup: 1,
					option: 1
				},
				small: c$$0,
				source: g,
				span: c$$0,
				strong: c$$0,
				style: i,
				sub: c$$0,
				summary: c$$0,
				sup: c$$0,
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
				td: a$$0,
				textarea: i,
				tfoot: {
					tr: 1
				},
				th: a$$0,
				thead: {
					tr: 1
				},
				time: f(c$$0, {
					time: 1
				}),
				title: i,
				tr: {
					th: 1,
					td: 1
				},
				track: g,
				u: c$$0,
				ul: {
					li: 1
				},
				"var": c$$0,
				video: b$$0({
					source: 1,
					track: 1
				}, a$$0),
				wbr: g,
				acronym: c$$0,
				applet: b$$0({
					param: 1
				}, a$$0),
				basefont: g,
				big: c$$0,
				center: a$$0,
				dialog: g,
				dir: {
					li: 1
				},
				font: c$$0,
				isindex: g,
				noframes: a$$0,
				strike: c$$0,
				tt: c$$0
			};
			b$$0(f, {
				$block: b$$0({
					audio: 1,
					dd: 1,
					dt: 1,
					figcaption: 1,
					li: 1,
					video: 1
				}, d$$0, h),
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
				$inline: c$$0,
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
				$nonBodyContent: b$$0({
					body: 1,
					head: 1,
					html: 1
				}, f.head),
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
			return f;
		}();
		CKEDITOR.dom.event = function(b) {
			this.$ = b;
		};
		CKEDITOR.dom.event.prototype = {
			getKey: function() {
				return this.$.keyCode || this.$.which;
			},
			getKeystroke: function() {
				var b = this.getKey();
				if (this.$.ctrlKey || this.$.metaKey) {
					b = b + CKEDITOR.CTRL;
				}
				if (this.$.shiftKey) {
					b = b + CKEDITOR.SHIFT;
				}
				if (this.$.altKey) {
					b = b + CKEDITOR.ALT;
				}
				return b;
			},
			preventDefault: function(b) {
				var f = this.$;
				if (f.preventDefault) {
					f.preventDefault();
				} else {
					f.returnValue = false;
				}
				if (b) {
					this.stopPropagation();
				}
			},
			stopPropagation: function() {
				var b = this.$;
				if (b.stopPropagation) {
					b.stopPropagation();
				} else {
					b.cancelBubble = true;
				}
			},
			getTarget: function() {
				var b = this.$.target || this.$.srcElement;
				return b ? new CKEDITOR.dom.node(b) : null;
			},
			getPhase: function() {
				return this.$.eventPhase || 2;
			},
			getPageOffset: function() {
				var b = this.getTarget().getDocument().$;
				return {
					x: this.$.pageX || this.$.clientX + (b.documentElement.scrollLeft || b.body.scrollLeft),
					y: this.$.pageY || this.$.clientY + (b.documentElement.scrollTop || b.body.scrollTop)
				};
			}
		};
		CKEDITOR.CTRL = 1114112;
		CKEDITOR.SHIFT = 2228224;
		CKEDITOR.ALT = 4456448;
		CKEDITOR.EVENT_PHASE_CAPTURING = 1;
		CKEDITOR.EVENT_PHASE_AT_TARGET = 2;
		CKEDITOR.EVENT_PHASE_BUBBLING = 3;
		CKEDITOR.dom.domObject = function(b) {
			if (b) {
				this.$ = b;
			}
		};
		CKEDITOR.dom.domObject.prototype = function() {
			var b$$0 = function(b, c) {
				return function(a) {
					if (typeof CKEDITOR != "undefined") {
						b.fire(c, new CKEDITOR.dom.event(a));
					}
				};
			};
			return {
				getPrivate: function() {
					var b;
					if (!(b = this.getCustomData("_"))) {
						this.setCustomData("_", b = {});
					}
					return b;
				},
				on: function(f) {
					var c = this.getCustomData("_cke_nativeListeners");
					if (!c) {
						c = {};
						this.setCustomData("_cke_nativeListeners", c);
					}
					if (!c[f]) {
						c = c[f] = b$$0(this, f);
						if (this.$.addEventListener) {
							this.$.addEventListener(f, c, !!CKEDITOR.event.useCapture);
						} else {
							if (this.$.attachEvent) {
								this.$.attachEvent("on" + f, c);
							}
						}
					}
					return CKEDITOR.event.prototype.on.apply(this, arguments);
				},
				removeListener: function(b) {
					CKEDITOR.event.prototype.removeListener.apply(this, arguments);
					if (!this.hasListeners(b)) {
						var c = this.getCustomData("_cke_nativeListeners");
						var a = c && c[b];
						if (a) {
							if (this.$.removeEventListener) {
								this.$.removeEventListener(b, a, false);
							} else {
								if (this.$.detachEvent) {
									this.$.detachEvent("on" + b, a);
								}
							}
							delete c[b];
						}
					}
				},
				removeAllListeners: function() {
					var b = this.getCustomData("_cke_nativeListeners");
					var c;
					for (c in b) {
						var a = b[c];
						if (this.$.detachEvent) {
							this.$.detachEvent("on" + c, a);
						} else {
							if (this.$.removeEventListener) {
								this.$.removeEventListener(c, a, false);
							}
						}
						delete b[c];
					}
					CKEDITOR.event.prototype.removeAllListeners.call(this);
				}
			};
		}();
		(function(b$$0) {
			var f = {};
			CKEDITOR.on("reset", function() {
				f = {};
			});
			b$$0.equals = function(b) {
				try {
					return b && b.$ === this.$;
				} catch (a) {
					return false;
				}
			};
			b$$0.setCustomData = function(b, a) {
				var d = this.getUniqueId();
				(f[d] || (f[d] = {}))[b] = a;
				return this;
			};
			b$$0.getCustomData = function(b) {
				var a = this.$["data-cke-expando"];
				return (a = a && f[a]) && b in a ? a[b] : null;
			};
			b$$0.removeCustomData = function(b) {
				var a = this.$["data-cke-expando"];
				a = a && f[a];
				var d;
				var e;
				if (a) {
					d = a[b];
					e = b in a;
					delete a[b];
				}
				return e ? d : null;
			};
			b$$0.clearCustomData = function() {
				this.removeAllListeners();
				var b = this.$["data-cke-expando"];
				if (b) {
					delete f[b];
				}
			};
			b$$0.getUniqueId = function() {
				return this.$["data-cke-expando"] || (this.$["data-cke-expando"] = CKEDITOR.tools.getNextNumber());
			};
			CKEDITOR.event.implementOn(b$$0);
		})(CKEDITOR.dom.domObject.prototype);
		CKEDITOR.dom.node = function(b) {
			return b ? new CKEDITOR.dom[b.nodeType == CKEDITOR.NODE_DOCUMENT ? "document" : b.nodeType == CKEDITOR.NODE_ELEMENT ? "element" : b.nodeType == CKEDITOR.NODE_TEXT ? "text" : b.nodeType == CKEDITOR.NODE_COMMENT ? "comment" : b.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? "documentFragment" : "domObject"](b) : this;
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
			appendTo: function(b, f) {
				b.append(this, f);
				return b;
			},
			clone: function(b, f) {
				var c = this.$.cloneNode(b);
				var a = function(d) {
					if (d["data-cke-expando"]) {
						d["data-cke-expando"] = false;
					}
					if (d.nodeType == CKEDITOR.NODE_ELEMENT) {
						if (!f) {
							d.removeAttribute("id", false);
						}
						if (b) {
							d = d.childNodes;
							var e = 0;
							for (; e < d.length; e++) {
								a(d[e]);
							}
						}
					}
				};
				a(c);
				return new CKEDITOR.dom.node(c);
			},
			hasPrevious: function() {
				return !!this.$.previousSibling;
			},
			hasNext: function() {
				return !!this.$.nextSibling;
			},
			insertAfter: function(b) {
				b.$.parentNode.insertBefore(this.$, b.$.nextSibling);
				return b;
			},
			insertBefore: function(b) {
				b.$.parentNode.insertBefore(this.$, b.$);
				return b;
			},
			insertBeforeMe: function(b) {
				this.$.parentNode.insertBefore(b.$, this.$);
				return b;
			},
			getAddress: function(b) {
				var f = [];
				var c = this.getDocument().$.documentElement;
				var a = this.$;
				for (; a && a != c;) {
					var d = a.parentNode;
					if (d) {
						f.unshift(this.getIndex.call({
							$: a
						}, b));
					}
					a = d;
				}
				return f;
			},
			getDocument: function() {
				return new CKEDITOR.dom.document(this.$.ownerDocument || this.$.parentNode.ownerDocument);
			},
			getIndex: function(b) {
				var f = this.$;
				var c = -1;
				var a;
				if (!this.$.parentNode) {
					return c;
				}
				do {
					if (!b || !(f != this.$ && (f.nodeType == CKEDITOR.NODE_TEXT && (a || !f.nodeValue)))) {
						c++;
						a = f.nodeType == CKEDITOR.NODE_TEXT;
					}
				} while (f = f.previousSibling);
				return c;
			},
			getNextSourceNode: function(b, f, c) {
				if (c && !c.call) {
					var a = c;
					c = function(d) {
						return !d.equals(a);
					};
				}
				b = !b && (this.getFirst && this.getFirst());
				var d$$0;
				if (!b) {
					if (this.type == CKEDITOR.NODE_ELEMENT && (c && c(this, true) === false)) {
						return null;
					}
					b = this.getNext();
				}
				for (; !b && (d$$0 = (d$$0 || this).getParent());) {
					if (c && c(d$$0, true) === false) {
						return null;
					}
					b = d$$0.getNext();
				}
				return !b || c && c(b) === false ? null : f && f != b.type ? b.getNextSourceNode(false, f, c) : b;
			},
			getPreviousSourceNode: function(b, f, c) {
				if (c && !c.call) {
					var a = c;
					c = function(d) {
						return !d.equals(a);
					};
				}
				b = !b && (this.getLast && this.getLast());
				var d$$0;
				if (!b) {
					if (this.type == CKEDITOR.NODE_ELEMENT && (c && c(this, true) === false)) {
						return null;
					}
					b = this.getPrevious();
				}
				for (; !b && (d$$0 = (d$$0 || this).getParent());) {
					if (c && c(d$$0, true) === false) {
						return null;
					}
					b = d$$0.getPrevious();
				}
				return !b || c && c(b) === false ? null : f && b.type != f ? b.getPreviousSourceNode(false, f, c) : b;
			},
			getPrevious: function(b) {
				var f = this.$;
				var c;
				do {
					c = (f = f.previousSibling) && (f.nodeType != 10 && new CKEDITOR.dom.node(f));
				} while (c && (b && !b(c)));
				return c;
			},
			getNext: function(b) {
				var f = this.$;
				var c;
				do {
					c = (f = f.nextSibling) && new CKEDITOR.dom.node(f);
				} while (c && (b && !b(c)));
				return c;
			},
			getParent: function(b) {
				var f = this.$.parentNode;
				return f && (f.nodeType == CKEDITOR.NODE_ELEMENT || b && f.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT) ? new CKEDITOR.dom.node(f) : null;
			},
			getParents: function(b) {
				var f = this;
				var c = [];
				do {
					c[b ? "push" : "unshift"](f);
				} while (f = f.getParent());
				return c;
			},
			getCommonAncestor: function(b) {
				if (b.equals(this)) {
					return this;
				}
				if (b.contains && b.contains(this)) {
					return b;
				}
				var f = this.contains ? this : this.getParent();
				do {
					if (f.contains(b)) {
						return f;
					}
				} while (f = f.getParent());
				return null;
			},
			getPosition: function(b) {
				var f = this.$;
				var c = b.$;
				if (f.compareDocumentPosition) {
					return f.compareDocumentPosition(c);
				}
				if (f == c) {
					return CKEDITOR.POSITION_IDENTICAL;
				}
				if (this.type == CKEDITOR.NODE_ELEMENT && b.type == CKEDITOR.NODE_ELEMENT) {
					if (f.contains) {
						if (f.contains(c)) {
							return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
						}
						if (c.contains(f)) {
							return CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING;
						}
					}
					if ("sourceIndex" in f) {
						return f.sourceIndex < 0 || c.sourceIndex < 0 ? CKEDITOR.POSITION_DISCONNECTED : f.sourceIndex < c.sourceIndex ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
					}
				}
				f = this.getAddress();
				b = b.getAddress();
				c = Math.min(f.length, b.length);
				var a = 0;
				for (; a <= c - 1; a++) {
					if (f[a] != b[a]) {
						if (a < c) {
							return f[a] < b[a] ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
						}
						break;
					}
				}
				return f.length < b.length ? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING;
			},
			getAscendant: function(b, f) {
				var c = this.$;
				var a;
				if (!f) {
					c = c.parentNode;
				}
				for (; c;) {
					if (c.nodeName && (a = c.nodeName.toLowerCase(), typeof b == "string" ? a == b : a in b)) {
						return new CKEDITOR.dom.node(c);
					}
					try {
						c = c.parentNode;
					} catch (d) {
						c = null;
					}
				}
				return null;
			},
			hasAscendant: function(b, f) {
				var c = this.$;
				if (!f) {
					c = c.parentNode;
				}
				for (; c;) {
					if (c.nodeName && c.nodeName.toLowerCase() == b) {
						return true;
					}
					c = c.parentNode;
				}
				return false;
			},
			move: function(b, f) {
				b.append(this.remove(), f);
			},
			remove: function(b) {
				var f = this.$;
				var c = f.parentNode;
				if (c) {
					if (b) {
						for (; b = f.firstChild;) {
							c.insertBefore(f.removeChild(b), f);
						}
					}
					c.removeChild(f);
				}
				return this;
			},
			replace: function(b) {
				this.insertBefore(b);
				b.remove();
			},
			trim: function() {
				this.ltrim();
				this.rtrim();
			},
			ltrim: function() {
				var b;
				for (; this.getFirst && (b = this.getFirst());) {
					if (b.type == CKEDITOR.NODE_TEXT) {
						var f = CKEDITOR.tools.ltrim(b.getText());
						var c = b.getLength();
						if (f) {
							if (f.length < c) {
								b.split(c - f.length);
								this.$.removeChild(this.$.firstChild);
							}
						} else {
							b.remove();
							continue;
						}
					}
					break;
				}
			},
			rtrim: function() {
				var b;
				for (; this.getLast && (b = this.getLast());) {
					if (b.type == CKEDITOR.NODE_TEXT) {
						var f = CKEDITOR.tools.rtrim(b.getText());
						var c = b.getLength();
						if (f) {
							if (f.length < c) {
								b.split(f.length);
								this.$.lastChild.parentNode.removeChild(this.$.lastChild);
							}
						} else {
							b.remove();
							continue;
						}
					}
					break;
				}
				if (CKEDITOR.env.needsBrFiller) {
					if (b = this.$.lastChild) {
						if (b.type == 1 && b.nodeName.toLowerCase() == "br") {
							b.parentNode.removeChild(b);
						}
					}
				}
			},
			isReadOnly: function() {
				var b = this;
				if (this.type != CKEDITOR.NODE_ELEMENT) {
					b = this.getParent();
				}
				if (b && typeof b.$.isContentEditable != "undefined") {
					return !(b.$.isContentEditable || b.data("cke-editable"));
				}
				for (; b;) {
					if (b.data("cke-editable")) {
						break;
					}
					if (b.getAttribute("contentEditable") == "false") {
						return true;
					}
					if (b.getAttribute("contentEditable") == "true") {
						break;
					}
					b = b.getParent();
				}
				return !b;
			}
		});
		CKEDITOR.dom.window = function(b) {
			CKEDITOR.dom.domObject.call(this, b);
		};
		CKEDITOR.dom.window.prototype = new CKEDITOR.dom.domObject;
		CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype, {
			focus: function() {
				this.$.focus();
			},
			getViewPaneSize: function() {
				var b = this.$.document;
				var f = b.compatMode == "CSS1Compat";
				return {
					width: (f ? b.documentElement.clientWidth : b.body.clientWidth) || 0,
					height: (f ? b.documentElement.clientHeight : b.body.clientHeight) || 0
				};
			},
			getScrollPosition: function() {
				var b = this.$;
				if ("pageXOffset" in b) {
					return {
						x: b.pageXOffset || 0,
						y: b.pageYOffset || 0
					};
				}
				b = b.document;
				return {
					x: b.documentElement.scrollLeft || (b.body.scrollLeft || 0),
					y: b.documentElement.scrollTop || (b.body.scrollTop || 0)
				};
			},
			getFrame: function() {
				var b = this.$.frameElement;
				return b ? new CKEDITOR.dom.element.get(b) : null;
			}
		});
		CKEDITOR.dom.document = function(b) {
			CKEDITOR.dom.domObject.call(this, b);
		};
		CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject;
		CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype, {
			type: CKEDITOR.NODE_DOCUMENT,
			appendStyleSheet: function(b) {
				if (this.$.createStyleSheet) {
					this.$.createStyleSheet(b);
				} else {
					var f = new CKEDITOR.dom.element("link");
					f.setAttributes({
						rel: "stylesheet",
						type: "text/css",
						href: b
					});
					this.getHead().append(f);
				}
			},
			appendStyleText: function(b) {
				if (this.$.createStyleSheet) {
					var f = this.$.createStyleSheet("");
					f.cssText = b;
				} else {
					var c = new CKEDITOR.dom.element("style", this);
					c.append(new CKEDITOR.dom.text(b, this));
					this.getHead().append(c);
				}
				return f || c.$.sheet;
			},
			createElement: function(b, f) {
				var c = new CKEDITOR.dom.element(b, this);
				if (f) {
					if (f.attributes) {
						c.setAttributes(f.attributes);
					}
					if (f.styles) {
						c.setStyles(f.styles);
					}
				}
				return c;
			},
			createText: function(b) {
				return new CKEDITOR.dom.text(b, this);
			},
			focus: function() {
				this.getWindow().focus();
			},
			getActive: function() {
				return new CKEDITOR.dom.element(this.$.activeElement);
			},
			getById: function(b) {
				return (b = this.$.getElementById(b)) ? new CKEDITOR.dom.element(b) : null;
			},
			getByAddress: function(b, f) {
				var c = this.$.documentElement;
				var a = 0;
				for (; c && a < b.length; a++) {
					var d = b[a];
					if (f) {
						var e = -1;
						var g = 0;
						for (; g < c.childNodes.length; g++) {
							var i = c.childNodes[g];
							if (!(f === true && (i.nodeType == 3 && (i.previousSibling && i.previousSibling.nodeType == 3)))) {
								e++;
								if (e == d) {
									c = i;
									break;
								}
							}
						}
					} else {
						c = c.childNodes[d];
					}
				}
				return c ? new CKEDITOR.dom.node(c) : null;
			},
			getElementsByTag: function(b, f) {
				if ((!CKEDITOR.env.ie || document.documentMode > 8) && f) {
					b = f + ":" + b;
				}
				return new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(b));
			},
			getHead: function() {
				var b = this.$.getElementsByTagName("head")[0];
				return b = b ? new CKEDITOR.dom.element(b) : this.getDocumentElement().append(new CKEDITOR.dom.element("head"), true);
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
			write: function(b) {
				this.$.open("text/html", "replace");
				if (CKEDITOR.env.ie) {
					b = b.replace(/(?:^\s*<!DOCTYPE[^>]*?>)|^/i, '$&\n<script data-cke-temp="1">(' + CKEDITOR.tools.fixDomain + ")();\x3c/script>");
				}
				this.$.write(b);
				this.$.close();
			},
			find: function(b) {
				return new CKEDITOR.dom.nodeList(this.$.querySelectorAll(b));
			},
			findOne: function(b) {
				return (b = this.$.querySelector(b)) ? new CKEDITOR.dom.element(b) : null;
			},
			_getHtml5ShivFrag: function() {
				var b = this.getCustomData("html5ShivFrag");
				if (!b) {
					b = this.$.createDocumentFragment();
					CKEDITOR.tools.enableHtml5Elements(b, true);
					this.setCustomData("html5ShivFrag", b);
				}
				return b;
			}
		});
		CKEDITOR.dom.nodeList = function(b) {
			this.$ = b;
		};
		CKEDITOR.dom.nodeList.prototype = {
			count: function() {
				return this.$.length;
			},
			getItem: function(b) {
				if (b < 0 || b >= this.$.length) {
					return null;
				}
				return (b = this.$[b]) ? new CKEDITOR.dom.node(b) : null;
			}
		};
		CKEDITOR.dom.element = function(b, f) {
			if (typeof b == "string") {
				b = (f ? f.$ : document).createElement(b);
			}
			CKEDITOR.dom.domObject.call(this, b);
		};
		CKEDITOR.dom.element.get = function(b) {
			return (b = typeof b == "string" ? document.getElementById(b) || document.getElementsByName(b)[0] : b) && (b.$ ? b : new CKEDITOR.dom.element(b));
		};
		CKEDITOR.dom.element.prototype = new CKEDITOR.dom.node;
		CKEDITOR.dom.element.createFromHtml = function(b, f) {
			var c = new CKEDITOR.dom.element("div", f);
			c.setHtml(b);
			return c.getFirst().remove();
		};
		CKEDITOR.dom.element.setMarker = function(b, f, c, a) {
			var d = f.getCustomData("list_marker_id") || f.setCustomData("list_marker_id", CKEDITOR.tools.getNextNumber()).getCustomData("list_marker_id");
			var e = f.getCustomData("list_marker_names") || f.setCustomData("list_marker_names", {}).getCustomData("list_marker_names");
			b[d] = f;
			e[c] = 1;
			return f.setCustomData(c, a);
		};
		CKEDITOR.dom.element.clearAllMarkers = function(b) {
			var f;
			for (f in b) {
				CKEDITOR.dom.element.clearMarkers(b, b[f], 1);
			}
		};
		CKEDITOR.dom.element.clearMarkers = function(b, f, c) {
			var a = f.getCustomData("list_marker_names");
			var d = f.getCustomData("list_marker_id");
			var e;
			for (e in a) {
				f.removeCustomData(e);
			}
			f.removeCustomData("list_marker_names");
			if (c) {
				f.removeCustomData("list_marker_id");
				delete b[d];
			}
		};
		(function() {
			function b$$1(d) {
				var a = true;
				if (!d.$.id) {
					d.$.id = "cke_tmp_" + CKEDITOR.tools.getNextNumber();
					a = false;
				}
				return function() {
					if (!a) {
						d.removeAttribute("id");
					}
				};
			}

			function f$$0(d, a) {
				return "#" + d.$.id + " " + a.split(/,\s*/).join(", #" + d.$.id + " ");
			}

			function c$$0(d) {
				var b = 0;
				var c = 0;
				var i = a$$1[d].length;
				for (; c < i; c++) {
					b = b + (parseInt(this.getComputedStyle(a$$1[d][c]) || 0, 10) || 0);
				}
				return b;
			}
			CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype, {
				type: CKEDITOR.NODE_ELEMENT,
				addClass: function(d) {
					var a = this.$.className;
					if (a) {
						if (!RegExp("(?:^|\\s)" + d + "(?:\\s|$)", "").test(a)) {
							a = a + (" " + d);
						}
					}
					this.$.className = a || d;
				},
				removeClass: function(d) {
					var a = this.getAttribute("class");
					if (a) {
						d = RegExp("(?:^|\\s+)" + d + "(?=\\s|$)", "i");
						if (d.test(a)) {
							if (a = a.replace(d, "").replace(/^\s+/, "")) {
								this.setAttribute("class", a);
							} else {
								this.removeAttribute("class");
							}
						}
					}
					return this;
				},
				hasClass: function(d) {
					return RegExp("(?:^|\\s+)" + d + "(?=\\s|$)", "").test(this.getAttribute("class"));
				},
				append: function(d, a) {
					if (typeof d == "string") {
						d = this.getDocument().createElement(d);
					}
					if (a) {
						this.$.insertBefore(d.$, this.$.firstChild);
					} else {
						this.$.appendChild(d.$);
					}
					return d;
				},
				appendHtml: function(d) {
					if (this.$.childNodes.length) {
						var a = new CKEDITOR.dom.element("div", this.getDocument());
						a.setHtml(d);
						a.moveChildren(this);
					} else {
						this.setHtml(d);
					}
				},
				appendText: function(d) {
					if (this.$.text != void 0) {
						this.$.text = this.$.text + d;
					} else {
						this.append(new CKEDITOR.dom.text(d));
					}
				},
				appendBogus: function(d) {
					if (d || (CKEDITOR.env.needsBrFiller || CKEDITOR.env.opera)) {
						d = this.getLast();
						for (; d && (d.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.rtrim(d.getText()));) {
							d = d.getPrevious();
						}
						if (!d || (!d.is || !d.is("br"))) {
							d = CKEDITOR.env.opera ? this.getDocument().createText("") : this.getDocument().createElement("br");
							if (CKEDITOR.env.gecko) {
								d.setAttribute("type", "_moz");
							}
							this.append(d);
						}
					}
				},
				breakParent: function(d) {
					var a = new CKEDITOR.dom.range(this.getDocument());
					a.setStartAfter(this);
					a.setEndAfter(d);
					d = a.extractContents();
					a.insertNode(this.remove());
					d.insertAfterNode(this);
				},
				contains: CKEDITOR.env.ie || CKEDITOR.env.webkit ? function(d) {
					var a = this.$;
					return d.type != CKEDITOR.NODE_ELEMENT ? a.contains(d.getParent().$) : a != d.$ && a.contains(d.$);
				} : function(d) {
					return !!(this.$.compareDocumentPosition(d.$) & 16);
				},
				focus: function() {
					function d$$0() {
						try {
							this.$.focus();
						} catch (d) {}
					}
					return function(a) {
						if (a) {
							CKEDITOR.tools.setTimeout(d$$0, 100, this);
						} else {
							d$$0.call(this);
						}
					};
				}(),
				getHtml: function() {
					var d = this.$.innerHTML;
					return CKEDITOR.env.ie ? d.replace(/<\?[^>]*>/g, "") : d;
				},
				getOuterHtml: function() {
					if (this.$.outerHTML) {
						return this.$.outerHTML.replace(/<\?[^>]*>/, "");
					}
					var d = this.$.ownerDocument.createElement("div");
					d.appendChild(this.$.cloneNode(true));
					return d.innerHTML;
				},
				getClientRect: function() {
					var d = CKEDITOR.tools.extend({}, this.$.getBoundingClientRect());
					if (!d.width) {
						d.width = d.right - d.left;
					}
					if (!d.height) {
						d.height = d.bottom - d.top;
					}
					return d;
				},
				setHtml: CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? function(d) {
					try {
						var a = this.$;
						if (this.getParent()) {
							return a.innerHTML = d;
						}
						var b = this.getDocument()._getHtml5ShivFrag();
						b.appendChild(a);
						a.innerHTML = d;
						b.removeChild(a);
						return d;
					} catch (c) {
						this.$.innerHTML = "";
						a = new CKEDITOR.dom.element("body", this.getDocument());
						a.$.innerHTML = d;
						a = a.getChildren();
						for (; a.count();) {
							this.append(a.getItem(0));
						}
						return d;
					}
				} : function(d) {
					return this.$.innerHTML = d;
				},
				setText: function(d$$0) {
					CKEDITOR.dom.element.prototype.setText = this.$.innerText != void 0 ? function(d) {
						return this.$.innerText = d;
					} : function(d) {
						return this.$.textContent = d;
					};
					return this.setText(d$$0);
				},
				getAttribute: function() {
					var d$$0 = function(d) {
						return this.$.getAttribute(d, 2);
					};
					return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ? function(d) {
						switch (d) {
							case "class":
								d = "className";
								break;
							case "http-equiv":
								d = "httpEquiv";
								break;
							case "name":
								return this.$.name;
							case "tabindex":
								d = this.$.getAttribute(d, 2);
								if (d !== 0) {
									if (this.$.tabIndex === 0) {
										d = null;
									}
								}
								return d;
							case "checked":
								d = this.$.attributes.getNamedItem(d);
								return (d.specified ? d.nodeValue : this.$.checked) ? "checked" : null;
							case "hspace":
								;
							case "value":
								return this.$[d];
							case "style":
								return this.$.style.cssText;
							case "contenteditable":
								;
							case "contentEditable":
								return this.$.attributes.getNamedItem("contentEditable").specified ? this.$.getAttribute("contentEditable") : null;
						}
						return this.$.getAttribute(d, 2);
					} : d$$0;
				}(),
				getChildren: function() {
					return new CKEDITOR.dom.nodeList(this.$.childNodes);
				},
				getComputedStyle: CKEDITOR.env.ie ? function(d) {
					return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(d)];
				} : function(d) {
					var a = this.getWindow().$.getComputedStyle(this.$, null);
					return a ? a.getPropertyValue(d) : "";
				},
				getDtd: function() {
					var d = CKEDITOR.dtd[this.getName()];
					this.getDtd = function() {
						return d;
					};
					return d;
				},
				getElementsByTag: CKEDITOR.dom.document.prototype.getElementsByTag,
				getTabIndex: CKEDITOR.env.ie ? function() {
					var d = this.$.tabIndex;
					if (d === 0) {
						if (!CKEDITOR.dtd.$tabIndex[this.getName()] && parseInt(this.getAttribute("tabindex"), 10) !== 0) {
							d = -1;
						}
					}
					return d;
				} : CKEDITOR.env.webkit ? function() {
					var d = this.$.tabIndex;
					if (d == void 0) {
						d = parseInt(this.getAttribute("tabindex"), 10);
						if (isNaN(d)) {
							d = -1;
						}
					}
					return d;
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
					var d = this.$.nodeName.toLowerCase();
					if (CKEDITOR.env.ie && !(document.documentMode > 8)) {
						var a = this.$.scopeName;
						if (a != "HTML") {
							d = a.toLowerCase() + ":" + d;
						}
					}
					return (this.getName = function() {
						return d;
					})();
				},
				getValue: function() {
					return this.$.value;
				},
				getFirst: function(d) {
					var a = this.$.firstChild;
					if (a = a && new CKEDITOR.dom.node(a)) {
						if (d && !d(a)) {
							a = a.getNext(d);
						}
					}
					return a;
				},
				getLast: function(d) {
					var a = this.$.lastChild;
					if (a = a && new CKEDITOR.dom.node(a)) {
						if (d && !d(a)) {
							a = a.getPrevious(d);
						}
					}
					return a;
				},
				getStyle: function(d) {
					return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(d)];
				},
				is: function() {
					var d = this.getName();
					if (typeof arguments[0] == "object") {
						return !!arguments[0][d];
					}
					var a = 0;
					for (; a < arguments.length; a++) {
						if (arguments[a] == d) {
							return true;
						}
					}
					return false;
				},
				isEditable: function(d) {
					var a = this.getName();
					if (this.isReadOnly() || (this.getComputedStyle("display") == "none" || (this.getComputedStyle("visibility") == "hidden" || (CKEDITOR.dtd.$nonEditable[a] || (CKEDITOR.dtd.$empty[a] || this.is("a") && ((this.data("cke-saved-name") || this.hasAttribute("name")) && !this.getChildCount())))))) {
						return false;
					}
					if (d !== false) {
						d = CKEDITOR.dtd[a] || CKEDITOR.dtd.span;
						return !(!d || !d["#"]);
					}
					return true;
				},
				isIdentical: function(d) {
					var a = this.clone(0, 1);
					d = d.clone(0, 1);
					a.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
					d.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
					if (a.$.isEqualNode) {
						a.$.style.cssText = CKEDITOR.tools.normalizeCssText(a.$.style.cssText);
						d.$.style.cssText = CKEDITOR.tools.normalizeCssText(d.$.style.cssText);
						return a.$.isEqualNode(d.$);
					}
					a = a.getOuterHtml();
					d = d.getOuterHtml();
					if (CKEDITOR.env.ie && (CKEDITOR.env.version < 9 && this.is("a"))) {
						var b = this.getParent();
						if (b.type == CKEDITOR.NODE_ELEMENT) {
							b = b.clone();
							b.setHtml(a);
							a = b.getHtml();
							b.setHtml(d);
							d = b.getHtml();
						}
					}
					return a == d;
				},
				isVisible: function() {
					var d = (this.$.offsetHeight || this.$.offsetWidth) && this.getComputedStyle("visibility") != "hidden";
					var a;
					var b;
					if (d && (CKEDITOR.env.webkit || CKEDITOR.env.opera)) {
						a = this.getWindow();
						if (!a.equals(CKEDITOR.document.getWindow()) && (b = a.$.frameElement)) {
							d = (new CKEDITOR.dom.element(b)).isVisible();
						}
					}
					return !!d;
				},
				isEmptyInlineRemoveable: function() {
					if (!CKEDITOR.dtd.$removeEmpty[this.getName()]) {
						return false;
					}
					var d = this.getChildren();
					var a = 0;
					var b = d.count();
					for (; a < b; a++) {
						var c = d.getItem(a);
						if (!(c.type == CKEDITOR.NODE_ELEMENT && c.data("cke-bookmark")) && (c.type == CKEDITOR.NODE_ELEMENT && !c.isEmptyInlineRemoveable() || c.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(c.getText()))) {
							return false;
						}
					}
					return true;
				},
				hasAttributes: CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ? function() {
					var d = this.$.attributes;
					var a = 0;
					for (; a < d.length; a++) {
						var b = d[a];
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
					var d = this.$.attributes;
					var a = d.length;
					var b = {
						"data-cke-expando": 1,
						_moz_dirty: 1
					};
					return a > 0 && (a > 2 || (!b[d[0].nodeName] || a == 2 && !b[d[1].nodeName]));
				},
				hasAttribute: function() {
					function d$$0(d) {
						d = this.$.attributes.getNamedItem(d);
						return !(!d || !d.specified);
					}
					return CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? function(a) {
						return a == "name" ? !!this.$.name : d$$0.call(this, a);
					} : d$$0;
				}(),
				hide: function() {
					this.setStyle("display", "none");
				},
				moveChildren: function(d, a) {
					var b = this.$;
					d = d.$;
					if (b != d) {
						var c;
						if (a) {
							for (; c = b.lastChild;) {
								d.insertBefore(b.removeChild(c), d.firstChild);
							}
						} else {
							for (; c = b.firstChild;) {
								d.appendChild(b.removeChild(c));
							}
						}
					}
				},
				mergeSiblings: function() {
					function d$$0(d, a, b) {
						if (a && a.type == CKEDITOR.NODE_ELEMENT) {
							var c = [];
							for (; a.data("cke-bookmark") || a.isEmptyInlineRemoveable();) {
								c.push(a);
								a = b ? a.getNext() : a.getPrevious();
								if (!a || a.type != CKEDITOR.NODE_ELEMENT) {
									return;
								}
							}
							if (d.isIdentical(a)) {
								var j = b ? d.getLast() : d.getFirst();
								for (; c.length;) {
									c.shift().move(d, !b);
								}
								a.moveChildren(d, !b);
								a.remove();
								if (j) {
									if (j.type == CKEDITOR.NODE_ELEMENT) {
										j.mergeSiblings();
									}
								}
							}
						}
					}
					return function(a) {
						if (a === false || (CKEDITOR.dtd.$removeEmpty[this.getName()] || this.is("a"))) {
							d$$0(this, this.getNext(), true);
							d$$0(this, this.getPrevious());
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
					var a$$0 = function(a, d) {
						this.$.setAttribute(a, d);
						return this;
					};
					return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ? function(b, c) {
						if (b == "class") {
							this.$.className = c;
						} else {
							if (b == "style") {
								this.$.style.cssText = c;
							} else {
								if (b == "tabindex") {
									this.$.tabIndex = c;
								} else {
									if (b == "checked") {
										this.$.checked = c;
									} else {
										if (b == "contenteditable") {
											a$$0.call(this, "contentEditable", c);
										} else {
											a$$0.apply(this, arguments);
										}
									}
								}
							}
						}
						return this;
					} : CKEDITOR.env.ie8Compat && CKEDITOR.env.secure ? function(b, c) {
						if (b == "src" && c.match(/^http:\/\//)) {
							try {
								a$$0.apply(this, arguments);
							} catch (i) {}
						} else {
							a$$0.apply(this, arguments);
						}
						return this;
					} : a$$0;
				}(),
				setAttributes: function(a) {
					var b;
					for (b in a) {
						this.setAttribute(b, a[b]);
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
					return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ? function(a) {
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
						var b = 0;
						for (; b < a.length; b++) {
							this.removeAttribute(a[b]);
						}
					} else {
						for (b in a) {
							if (a.hasOwnProperty(b)) {
								this.removeAttribute(b);
							}
						}
					}
				},
				removeStyle: function(a) {
					var b = this.$.style;
					if (!b.removeProperty && (a == "border" || (a == "margin" || a == "padding"))) {
						var c = ["top", "left", "right", "bottom"];
						var i;
						if (a == "border") {
							i = ["color", "style", "width"];
						}
						b = [];
						var h = 0;
						for (; h < c.length; h++) {
							if (i) {
								var j = 0;
								for (; j < i.length; j++) {
									b.push([a, c[h], i[j]].join("-"));
								}
							} else {
								b.push([a, c[h]].join("-"));
							}
						}
						a = 0;
						for (; a < b.length; a++) {
							this.removeStyle(b[a]);
						}
					} else {
						if (b.removeProperty) {
							b.removeProperty(a);
						} else {
							b.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(a));
						}
						if (!this.$.style.cssText) {
							this.removeAttribute("style");
						}
					}
				},
				setStyle: function(a, b) {
					this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)] = b;
					return this;
				},
				setStyles: function(a) {
					var b;
					for (b in a) {
						this.setStyle(b, a[b]);
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
					if (CKEDITOR.env.ie || CKEDITOR.env.opera) {
						this.setAttribute("unselectable", "on");
						var a;
						var b = this.getElementsByTag("*");
						var c = 0;
						var i = b.count();
						for (; c < i; c++) {
							a = b.getItem(c);
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
					var b = 0;
					var c = 0;
					var i = this.getDocument();
					var h = i.getBody();
					var j = i.$.compatMode == "BackCompat";
					if (document.documentElement.getBoundingClientRect) {
						var k = this.$.getBoundingClientRect();
						var n = i.$.documentElement;
						var f = n.clientTop || (h.$.clientTop || 0);
						var q = n.clientLeft || (h.$.clientLeft || 0);
						var o = true;
						if (CKEDITOR.env.ie) {
							o = i.getDocumentElement().contains(this);
							i = i.getBody().contains(this);
							o = j && i || !j && o;
						}
						if (o) {
							b = k.left + (!j && n.scrollLeft || h.$.scrollLeft);
							b = b - q;
							c = k.top + (!j && n.scrollTop || h.$.scrollTop);
							c = c - f;
						}
					} else {
						h = this;
						i = null;
						for (; h && !(h.getName() == "body" || h.getName() == "html");) {
							b = b + (h.$.offsetLeft - h.$.scrollLeft);
							c = c + (h.$.offsetTop - h.$.scrollTop);
							if (!h.equals(this)) {
								b = b + (h.$.clientLeft || 0);
								c = c + (h.$.clientTop || 0);
							}
							for (; i && !i.equals(h);) {
								b = b - i.$.scrollLeft;
								c = c - i.$.scrollTop;
								i = i.getParent();
							}
							i = h;
							h = (k = h.$.offsetParent) ? new CKEDITOR.dom.element(k) : null;
						}
					}
					if (a) {
						h = this.getWindow();
						i = a.getWindow();
						if (!h.equals(i) && h.$.frameElement) {
							a = (new CKEDITOR.dom.element(h.$.frameElement)).getDocumentPosition(a);
							b = b + a.x;
							c = c + a.y;
						}
					}
					if (!document.documentElement.getBoundingClientRect && (CKEDITOR.env.gecko && !j)) {
						b = b + (this.$.clientLeft ? 1 : 0);
						c = c + (this.$.clientTop ? 1 : 0);
					}
					return {
						x: b,
						y: c
					};
				},
				scrollIntoView: function(a) {
					var b = this.getParent();
					if (b) {
						do {
							if (b.$.clientWidth && b.$.clientWidth < b.$.scrollWidth || b.$.clientHeight && b.$.clientHeight < b.$.scrollHeight) {
								if (!b.is("body")) {
									this.scrollIntoParent(b, a, 1);
								}
							}
							if (b.is("html")) {
								var c = b.getWindow();
								try {
									var i = c.$.frameElement;
									if (i) {
										b = new CKEDITOR.dom.element(i);
									}
								} catch (h) {}
							}
						} while (b = b.getParent());
					}
				},
				scrollIntoParent: function(a$$0, b$$0, c) {
					function n(b, e) {
						if (/body|html/.test(a$$0.getName())) {
							a$$0.getWindow().$.scrollBy(b, e);
						} else {
							a$$0.$.scrollLeft = a$$0.$.scrollLeft + b;
							a$$0.$.scrollTop = a$$0.$.scrollTop + e;
						}
					}

					function f(a, d) {
						var b = {
							x: 0,
							y: 0
						};
						if (!a.is(o ? "body" : "html")) {
							var e = a.$.getBoundingClientRect();
							b.x = e.left;
							b.y = e.top;
						}
						e = a.getWindow();
						if (!e.equals(d)) {
							e = f(CKEDITOR.dom.element.get(e.$.frameElement), d);
							b.x = b.x + e.x;
							b.y = b.y + e.y;
						}
						return b;
					}

					function q(a, d) {
						return parseInt(a.getComputedStyle("margin-" + d) || 0, 10) || 0;
					}
					var i;
					var h;
					var j;
					var k;
					if (!a$$0) {
						a$$0 = this.getWindow();
					}
					j = a$$0.getDocument();
					var o = j.$.compatMode == "BackCompat";
					if (a$$0 instanceof CKEDITOR.dom.window) {
						a$$0 = o ? j.getBody() : j.getDocumentElement();
					}
					j = a$$0.getWindow();
					h = f(this, j);
					var l = f(a$$0, j);
					var r = this.$.offsetHeight;
					i = this.$.offsetWidth;
					var p = a$$0.$.clientHeight;
					var t = a$$0.$.clientWidth;
					j = h.x - q(this, "left") - l.x || 0;
					k = h.y - q(this, "top") - l.y || 0;
					i = h.x + i + q(this, "right") - (l.x + t) || 0;
					h = h.y + r + q(this, "bottom") - (l.y + p) || 0;
					if (k < 0 || h > 0) {
						n(0, b$$0 === true ? k : b$$0 === false ? h : k < 0 ? k : h);
					}
					if (c && (j < 0 || i > 0)) {
						n(j < 0 ? j : i, 0);
					}
				},
				setState: function(a, b, c) {
					b = b || "cke";
					switch (a) {
						case CKEDITOR.TRISTATE_ON:
							this.addClass(b + "_on");
							this.removeClass(b + "_off");
							this.removeClass(b + "_disabled");
							if (c) {
								this.setAttribute("aria-pressed", true);
							}
							if (c) {
								this.removeAttribute("aria-disabled");
							}
							break;
						case CKEDITOR.TRISTATE_DISABLED:
							this.addClass(b + "_disabled");
							this.removeClass(b + "_off");
							this.removeClass(b + "_on");
							if (c) {
								this.setAttribute("aria-disabled", true);
							}
							if (c) {
								this.removeAttribute("aria-pressed");
							}
							break;
						default:
							this.addClass(b + "_off");
							this.removeClass(b + "_on");
							this.removeClass(b + "_disabled");
							if (c) {
								this.removeAttribute("aria-pressed");
							}
							if (c) {
								this.removeAttribute("aria-disabled");
							};
					}
				},
				getFrameDocument: function() {
					var a = this.$;
					try {
						a.contentWindow.document;
					} catch (b) {
						a.src = a.src;
					}
					return a && new CKEDITOR.dom.document(a.contentWindow.document);
				},
				copyAttributes: function(a, b) {
					var c = this.$.attributes;
					b = b || {};
					var i = 0;
					for (; i < c.length; i++) {
						var h = c[i];
						var j = h.nodeName.toLowerCase();
						var k;
						if (!(j in b)) {
							if (j == "checked" && (k = this.getAttribute(j))) {
								a.setAttribute(j, k);
							} else {
								if (h.specified || CKEDITOR.env.ie && (h.nodeValue && j == "value")) {
									k = this.getAttribute(j);
									if (k === null) {
										k = h.nodeValue;
									}
									a.setAttribute(j, k);
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
						var b = this.getDocument();
						a = new CKEDITOR.dom.element(a, b);
						this.copyAttributes(a);
						this.moveChildren(a);
						if (this.getParent()) {
							this.$.parentNode.replaceChild(a.$, this.$);
						}
						a.$["data-cke-expando"] = this.$["data-cke-expando"];
						this.$ = a.$;
					}
				},
				getChild: function() {
					function a(d, b) {
						var c = d.childNodes;
						if (b >= 0 && b < c.length) {
							return c[b];
						}
					}
					return function(b) {
						var c = this.$;
						if (b.slice) {
							for (; b.length > 0 && c;) {
								c = a(c, b.shift());
							}
						} else {
							c = a(c, b);
						}
						return c ? new CKEDITOR.dom.node(c) : null;
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
					var c;
					for (b in a) {
						c = a[b];
						if (c.element.equals(this) && c.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
							return c;
						}
					}
					return null;
				},
				find: function(a) {
					var c = b$$1(this);
					a = new CKEDITOR.dom.nodeList(this.$.querySelectorAll(f$$0(this, a)));
					c();
					return a;
				},
				findOne: function(a) {
					var c = b$$1(this);
					a = this.$.querySelector(f$$0(this, a));
					c();
					return a ? new CKEDITOR.dom.element(a) : null;
				},
				forEach: function(a, b, c) {
					if (!c && (!b || this.type == b)) {
						var i = a(this)
					}
					if (i !== false) {
						c = this.getChildren();
						var h = 0;
						for (; h < c.count(); h++) {
							i = c.getItem(h);
							if (i.type == CKEDITOR.NODE_ELEMENT) {
								i.forEach(a, b);
							} else {
								if (!b || i.type == b) {
									a(i);
								}
							}
						}
					}
				}
			});
			var a$$1 = {
				width: ["border-left-width", "border-right-width", "padding-left", "padding-right"],
				height: ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom"]
			};
			CKEDITOR.dom.element.prototype.setSize = function(a, b, g) {
				if (typeof b == "number") {
					if (g && (!CKEDITOR.env.ie || !CKEDITOR.env.quirks)) {
						b = b - c$$0.call(this, a);
					}
					this.setStyle(a, b + "px");
				}
			};
			CKEDITOR.dom.element.prototype.getSize = function(a, b) {
				var g = Math.max(this.$["offset" + CKEDITOR.tools.capitalize(a)], this.$["client" + CKEDITOR.tools.capitalize(a)]) || 0;
				if (b) {
					g = g - c$$0.call(this, a);
				}
				return g;
			};
		})();
		CKEDITOR.dom.documentFragment = function(b) {
			b = b || CKEDITOR.document;
			this.$ = b.type == CKEDITOR.NODE_DOCUMENT ? b.$.createDocumentFragment() : b;
		};
		CKEDITOR.tools.extend(CKEDITOR.dom.documentFragment.prototype, CKEDITOR.dom.element.prototype, {
			type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
			insertAfterNode: function(b) {
				b = b.$;
				b.parentNode.insertBefore(this.$, b.nextSibling);
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
			function b$$1(a$$0, b$$0) {
				var d = this.range;
				if (this._.end) {
					return null;
				}
				if (!this._.start) {
					this._.start = 1;
					if (d.collapsed) {
						this.end();
						return null;
					}
					d.optimize();
				}
				var c;
				var e = d.startContainer;
				c = d.endContainer;
				var k = d.startOffset;
				var h = d.endOffset;
				var i;
				var g = this.guard;
				var j = this.type;
				var f = a$$0 ? "getPreviousSourceNode" : "getNextSourceNode";
				if (!a$$0 && !this._.guardLTR) {
					var z = c.type == CKEDITOR.NODE_ELEMENT ? c : c.getParent();
					var u = c.type == CKEDITOR.NODE_ELEMENT ? c.getChild(h) : c.getNext();
					this._.guardLTR = function(a, b) {
						return (!b || !z.equals(a)) && ((!u || !a.equals(u)) && (a.type != CKEDITOR.NODE_ELEMENT || (!b || !a.equals(d.root))));
					};
				}
				if (a$$0 && !this._.guardRTL) {
					var x = e.type == CKEDITOR.NODE_ELEMENT ? e : e.getParent();
					var B = e.type == CKEDITOR.NODE_ELEMENT ? k ? e.getChild(k - 1) : null : e.getPrevious();
					this._.guardRTL = function(a, b) {
						return (!b || !x.equals(a)) && ((!B || !a.equals(B)) && (a.type != CKEDITOR.NODE_ELEMENT || (!b || !a.equals(d.root))));
					};
				}
				var H = a$$0 ? this._.guardRTL : this._.guardLTR;
				i = g ? function(a, b) {
					return H(a, b) === false ? false : g(a, b);
				} : H;
				if (this.current) {
					c = this.current[f](false, j, i);
				} else {
					if (a$$0) {
						if (c.type == CKEDITOR.NODE_ELEMENT) {
							c = h > 0 ? c.getChild(h - 1) : i(c, true) === false ? null : c.getPreviousSourceNode(true, j, i);
						}
					} else {
						c = e;
						if (c.type == CKEDITOR.NODE_ELEMENT && !(c = c.getChild(k))) {
							c = i(e, true) === false ? null : e.getNextSourceNode(true, j, i);
						}
					}
					if (c) {
						if (i(c) === false) {
							c = null;
						}
					}
				}
				for (; c && !this._.end;) {
					this.current = c;
					if (!this.evaluator || this.evaluator(c) !== false) {
						if (!b$$0) {
							return c;
						}
					} else {
						if (b$$0 && this.evaluator) {
							return false;
						}
					}
					c = c[f](false, j, i);
				}
				this.end();
				return this.current = null;
			}

			function f$$0(a) {
				var d;
				var c = null;
				for (; d = b$$1.call(this, a);) {
					c = d;
				}
				return c;
			}

			function c$$0(a) {
				if (j$$0(a)) {
					return false;
				}
				if (a.type == CKEDITOR.NODE_TEXT) {
					return true;
				}
				if (a.type == CKEDITOR.NODE_ELEMENT) {
					if (a.is(CKEDITOR.dtd.$inline) || a.getAttribute("contenteditable") == "false") {
						return true;
					}
					var b;
					if (b = !CKEDITOR.env.needsBrFiller) {
						if (b = a.is(k$$0)) {
							a: {
								b = 0;
								var d = a.getChildCount();
								for (; b < d; ++b) {
									if (!j$$0(a.getChild(b))) {
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
						return b$$1.call(this);
					},
					previous: function() {
						return b$$1.call(this, 1);
					},
					checkForward: function() {
						return b$$1.call(this, 0, 1) !== false;
					},
					checkBackward: function() {
						return b$$1.call(this, 1, 1) !== false;
					},
					lastForward: function() {
						return f$$0.call(this);
					},
					lastBackward: function() {
						return f$$0.call(this, 1);
					},
					reset: function() {
						delete this.current;
						this._ = {};
					}
				}
			});
			var a$$1 = {
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
			var d$$0 = {
				absolute: 1,
				fixed: 1
			};
			CKEDITOR.dom.element.prototype.isBlockBoundary = function(b) {
				return this.getComputedStyle("float") == "none" && (!(this.getComputedStyle("position") in d$$0) && a$$1[this.getComputedStyle("display")]) ? true : !!(this.is(CKEDITOR.dtd.$block) || b && this.is(b));
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
				function d(a) {
					return a && (a.getName && (a.getName() == "span" && a.data("cke-bookmark")));
				}
				return function(c) {
					var e;
					var k;
					e = c && (c.type != CKEDITOR.NODE_ELEMENT && ((k = c.getParent()) && d(k)));
					e = a$$0 ? e : e || d(c);
					return !!(b ^ e);
				};
			};
			CKEDITOR.dom.walker.whitespaces = function(a) {
				return function(b) {
					var d;
					if (b) {
						if (b.type == CKEDITOR.NODE_TEXT) {
							d = !CKEDITOR.tools.trim(b.getText()) || CKEDITOR.env.webkit && b.getText() == "\u200b";
						}
					}
					return !!(a ^ d);
				};
			};
			CKEDITOR.dom.walker.invisible = function(a) {
				var b = CKEDITOR.dom.walker.whitespaces();
				return function(d) {
					if (b(d)) {
						d = 1;
					} else {
						if (d.type == CKEDITOR.NODE_TEXT) {
							d = d.getParent();
						}
						d = !d.$.offsetHeight;
					}
					return !!(a ^ d);
				};
			};
			CKEDITOR.dom.walker.nodeType = function(a, b) {
				return function(d) {
					return !!(b ^ d.type == a);
				};
			};
			CKEDITOR.dom.walker.bogus = function(a$$0) {
				function b(a) {
					return !g$$0(a) && !i$$0(a);
				}
				return function(d) {
					var c = CKEDITOR.env.needsBrFiller ? d.is && d.is("br") : d.getText && e$$0.test(d.getText());
					if (c) {
						c = d.getParent();
						d = d.getNext(b);
						c = c.isBlockBoundary() && (!d || d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary());
					}
					return !!(a$$0 ^ c);
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
			var e$$0 = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/;
			var g$$0 = CKEDITOR.dom.walker.whitespaces();
			var i$$0 = CKEDITOR.dom.walker.bookmark();
			var h$$0 = CKEDITOR.dom.walker.temp();
			CKEDITOR.dom.walker.ignored = function(a) {
				return function(b) {
					b = g$$0(b) || (i$$0(b) || h$$0(b));
					return !!(a ^ b);
				};
			};
			var j$$0 = CKEDITOR.dom.walker.ignored();
			var k$$0 = function(a) {
				var b = {};
				var d;
				for (d in a) {
					if (CKEDITOR.dtd[d]["#"]) {
						b[d] = 1;
					}
				}
				return b;
			}(CKEDITOR.dtd.$block);
			CKEDITOR.dom.walker.editable = function(a) {
				return function(b) {
					return !!(a ^ c$$0(b));
				};
			};
			CKEDITOR.dom.element.prototype.getBogus = function() {
				var a = this;
				do {
					a = a.getPreviousSourceNode();
				} while (i$$0(a) || (g$$0(a) || a.type == CKEDITOR.NODE_ELEMENT && (a.is(CKEDITOR.dtd.$inline) && !a.is(CKEDITOR.dtd.$empty))));
				return a && (CKEDITOR.env.needsBrFiller ? a.is && a.is("br") : a.getText && e$$0.test(a.getText())) ? a : false;
			};
		})();
		CKEDITOR.dom.range = function(b) {
			this.endOffset = this.endContainer = this.startOffset = this.startContainer = null;
			this.collapsed = true;
			var f = b instanceof CKEDITOR.dom.document;
			this.document = f ? b : b.getDocument();
			this.root = f ? b.getBody() : b;
		};
		(function() {
			function b$$1() {
				var a = false;
				var b = CKEDITOR.dom.walker.whitespaces();
				var d = CKEDITOR.dom.walker.bookmark(true);
				var c = CKEDITOR.dom.walker.bogus();
				return function(h) {
					if (d(h) || b(h)) {
						return true;
					}
					if (c(h) && !a) {
						return a = true;
					}
					return h.type == CKEDITOR.NODE_TEXT && (h.hasAscendant("pre") || CKEDITOR.tools.trim(h.getText()).length) || h.type == CKEDITOR.NODE_ELEMENT && !h.is(e$$1) ? false : true;
				};
			}

			function f$$0(a) {
				var b = CKEDITOR.dom.walker.whitespaces();
				var d = CKEDITOR.dom.walker.bookmark(1);
				return function(c) {
					return d(c) || b(c) ? true : !a && g$$0(c) || c.type == CKEDITOR.NODE_ELEMENT && c.is(CKEDITOR.dtd.$removeEmpty);
				};
			}

			function c$$1(a$$0) {
				return function() {
					var b;
					return this[a$$0 ? "getPreviousNode" : "getNextNode"](function(a) {
						if (!b) {
							if (j$$0(a)) {
								b = a;
							}
						}
						return h$$0(a) && !(g$$0(a) && a.equals(b));
					});
				};
			}
			var a$$2 = function(a) {
				a.collapsed = a.startContainer && (a.endContainer && (a.startContainer.equals(a.endContainer) && a.startOffset == a.endOffset));
			};
			var d$$1 = function(a, b, d, c) {
				a.optimizeBookmark();
				var e = a.startContainer;
				var h = a.endContainer;
				var i = a.startOffset;
				var g = a.endOffset;
				var j;
				var f;
				if (h.type == CKEDITOR.NODE_TEXT) {
					h = h.split(g);
				} else {
					if (h.getChildCount() > 0) {
						if (g >= h.getChildCount()) {
							h = h.append(a.document.createText(""));
							f = true;
						} else {
							h = h.getChild(g);
						}
					}
				}
				if (e.type == CKEDITOR.NODE_TEXT) {
					e.split(i);
					if (e.equals(h)) {
						h = e.getNext();
					}
				} else {
					if (i) {
						if (i >= e.getChildCount()) {
							e = e.append(a.document.createText(""));
							j = true;
						} else {
							e = e.getChild(i).getPrevious();
						}
					} else {
						e = e.append(a.document.createText(""), 1);
						j = true;
					}
				}
				i = e.getParents();
				g = h.getParents();
				var s;
				var v;
				var z;
				s = 0;
				for (; s < i.length; s++) {
					v = i[s];
					z = g[s];
					if (!v.equals(z)) {
						break;
					}
				}
				var u = d;
				var x;
				var B;
				var H;
				var F = s;
				for (; F < i.length; F++) {
					x = i[F];
					if (u) {
						if (!x.equals(e)) {
							B = u.append(x.clone());
						}
					}
					x = x.getNext();
					for (; x;) {
						if (x.equals(g[F]) || x.equals(h)) {
							break;
						}
						H = x.getNext();
						if (b == 2) {
							u.append(x.clone(true));
						} else {
							x.remove();
							if (b == 1) {
								u.append(x);
							}
						}
						x = H;
					}
					if (u) {
						u = B;
					}
				}
				u = d;
				d = s;
				for (; d < g.length; d++) {
					x = g[d];
					if (b > 0) {
						if (!x.equals(h)) {
							B = u.append(x.clone());
						}
					}
					if (!i[d] || x.$.parentNode != i[d].$.parentNode) {
						x = x.getPrevious();
						for (; x;) {
							if (x.equals(i[d]) || x.equals(e)) {
								break;
							}
							H = x.getPrevious();
							if (b == 2) {
								u.$.insertBefore(x.$.cloneNode(true), u.$.firstChild);
							} else {
								x.remove();
								if (b == 1) {
									u.$.insertBefore(x.$, u.$.firstChild);
								}
							}
							x = H;
						}
					}
					if (u) {
						u = B;
					}
				}
				if (b == 2) {
					v = a.startContainer;
					if (v.type == CKEDITOR.NODE_TEXT) {
						v.$.data = v.$.data + v.$.nextSibling.data;
						v.$.parentNode.removeChild(v.$.nextSibling);
					}
					a = a.endContainer;
					if (a.type == CKEDITOR.NODE_TEXT && a.$.nextSibling) {
						a.$.data = a.$.data + a.$.nextSibling.data;
						a.$.parentNode.removeChild(a.$.nextSibling);
					}
				} else {
					if (v && (z && (e.$.parentNode != v.$.parentNode || h.$.parentNode != z.$.parentNode))) {
						b = z.getIndex();
						if (j) {
							if (z.$.parentNode == e.$.parentNode) {
								b--;
							}
						}
						if (c && v.type == CKEDITOR.NODE_ELEMENT) {
							c = CKEDITOR.dom.element.createFromHtml('<span data-cke-bookmark="1" style="display:none">&nbsp;</span>', a.document);
							c.insertAfter(v);
							v.mergeSiblings(false);
							a.moveToBookmark({
								startNode: c
							});
						} else {
							a.setStart(z.getParent(), b);
						}
					}
					a.collapse(true);
				}
				if (j) {
					e.remove();
				}
				if (f) {
					if (h.$.parentNode) {
						h.remove();
					}
				}
			};
			var e$$1 = {
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
			var g$$0 = CKEDITOR.dom.walker.bogus();
			var i$$0 = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/;
			var h$$0 = CKEDITOR.dom.walker.editable();
			var j$$0 = CKEDITOR.dom.walker.ignored(true);
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
						d$$1(this, 2, a);
					}
					return a;
				},
				deleteContents: function(a) {
					if (!this.collapsed) {
						d$$1(this, 0, null, a);
					}
				},
				extractContents: function(a) {
					var b = new CKEDITOR.dom.documentFragment(this.document);
					if (!this.collapsed) {
						d$$1(this, 1, b, a);
					}
					return b;
				},
				createBookmark: function(a) {
					var b;
					var d;
					var c;
					var e;
					var h = this.collapsed;
					b = this.document.createElement("span");
					b.data("cke-bookmark", 1);
					b.setStyle("display", "none");
					b.setHtml("&nbsp;");
					if (a) {
						c = "cke_bm_" + CKEDITOR.tools.getNextNumber();
						b.setAttribute("id", c + (h ? "C" : "S"));
					}
					if (!h) {
						d = b.clone();
						d.setHtml("&nbsp;");
						if (a) {
							d.setAttribute("id", c + "E");
						}
						e = this.clone();
						e.collapse();
						e.insertNode(d);
					}
					e = this.clone();
					e.collapse(true);
					e.insertNode(b);
					if (d) {
						this.setStartAfter(b);
						this.setEndBefore(d);
					} else {
						this.moveToPosition(b, CKEDITOR.POSITION_AFTER_END);
					}
					return {
						startNode: a ? c + (h ? "C" : "S") : b,
						endNode: a ? c + "E" : d,
						serializable: a,
						collapsed: h
					};
				},
				createBookmark2: function() {
					function a(b) {
						var d = b.container;
						var c = b.offset;
						var e;
						e = d;
						var h = c;
						e = e.type != CKEDITOR.NODE_ELEMENT || (h === 0 || h == e.getChildCount()) ? 0 : e.getChild(h - 1).type == CKEDITOR.NODE_TEXT && e.getChild(h).type == CKEDITOR.NODE_TEXT;
						if (e) {
							d = d.getChild(c - 1);
							c = d.getLength();
						}
						if (d.type == CKEDITOR.NODE_ELEMENT) {
							if (c > 1) {
								c = d.getChild(c - 1).getIndex(true) + 1;
							}
						}
						if (d.type == CKEDITOR.NODE_TEXT) {
							e = d;
							h = 0;
							for (;
								(e = e.getPrevious()) && e.type == CKEDITOR.NODE_TEXT;) {
								h = h + e.getLength();
							}
							c = c + h;
						}
						b.container = d;
						b.offset = c;
					}
					return function(b) {
						var d = this.collapsed;
						var c = {
							container: this.startContainer,
							offset: this.startOffset
						};
						var e = {
							container: this.endContainer,
							offset: this.endOffset
						};
						if (b) {
							a(c);
							if (!d) {
								a(e);
							}
						}
						return {
							start: c.container.getAddress(b),
							end: d ? null : e.container.getAddress(b),
							startOffset: c.offset,
							endOffset: e.offset,
							normalized: b,
							collapsed: d,
							is2: true
						};
					};
				}(),
				moveToBookmark: function(a) {
					if (a.is2) {
						var b = this.document.getByAddress(a.start, a.normalized);
						var d = a.startOffset;
						var c = a.end && this.document.getByAddress(a.end, a.normalized);
						a = a.endOffset;
						this.setStart(b, d);
						if (c) {
							this.setEnd(c, a);
						} else {
							this.collapse(true);
						}
					} else {
						b = (d = a.serializable) ? this.document.getById(a.startNode) : a.startNode;
						a = d ? this.document.getById(a.endNode) : a.endNode;
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
					var d = this.startOffset;
					var c = this.endOffset;
					var e;
					if (a.type == CKEDITOR.NODE_ELEMENT) {
						e = a.getChildCount();
						if (e > d) {
							a = a.getChild(d);
						} else {
							if (e < 1) {
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
						e = b.getChildCount();
						if (e > c) {
							b = b.getChild(c).getPreviousSourceNode(true);
						} else {
							if (e < 1) {
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
					var d = this.startContainer;
					var c = this.endContainer;
					d = d.equals(c) ? a && (d.type == CKEDITOR.NODE_ELEMENT && this.startOffset == this.endOffset - 1) ? d.getChild(this.startOffset) : d : d.getCommonAncestor(c);
					return b && !d.is ? d.getParent() : d;
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
					var d = this.startContainer;
					var c = this.startOffset;
					var e = this.collapsed;
					if ((!a || e) && (d && d.type == CKEDITOR.NODE_TEXT)) {
						if (c) {
							if (c >= d.getLength()) {
								c = d.getIndex() + 1;
								d = d.getParent();
							} else {
								var h = d.split(c);
								c = d.getIndex() + 1;
								d = d.getParent();
								if (this.startContainer.equals(this.endContainer)) {
									this.setEnd(h, this.endOffset - this.startOffset);
								} else {
									if (d.equals(this.endContainer)) {
										this.endOffset = this.endOffset + 1;
									}
								}
							}
						} else {
							c = d.getIndex();
							d = d.getParent();
						}
						this.setStart(d, c);
						if (e) {
							this.collapse(true);
							return;
						}
					}
					d = this.endContainer;
					c = this.endOffset;
					if (!b && (!e && (d && d.type == CKEDITOR.NODE_TEXT))) {
						if (c) {
							if (!(c >= d.getLength())) {
								d.split(c);
							}
							c = d.getIndex() + 1;
						} else {
							c = d.getIndex();
						}
						d = d.getParent();
						this.setEnd(d, c);
					}
				},
				enlarge: function(a$$1, b$$0) {
					function d$$0(a) {
						return a && (a.type == CKEDITOR.NODE_ELEMENT && a.hasAttribute("contenteditable")) ? null : a;
					}
					var c = RegExp(/[^\s\ufeff]/);
					switch (a$$1) {
						case CKEDITOR.ENLARGE_INLINE:
							var e$$0 = 1;
						case CKEDITOR.ENLARGE_ELEMENT:
							if (this.collapsed) {
								break;
							}
							var h = this.getCommonAncestor();
							var i = this.root;
							var g;
							var j;
							var f;
							var s;
							var v;
							var z = false;
							var u;
							var x;
							u = this.startContainer;
							var B = this.startOffset;
							if (u.type == CKEDITOR.NODE_TEXT) {
								if (B) {
									u = !CKEDITOR.tools.trim(u.substring(0, B)).length && u;
									z = !!u;
								}
								if (u && !(s = u.getPrevious())) {
									f = u.getParent();
								}
							} else {
								if (B) {
									s = u.getChild(B - 1) || u.getLast();
								}
								if (!s) {
									f = u;
								}
							}
							f = d$$0(f);
							for (; f || s;) {
								if (f && !s) {
									if (!v) {
										if (f.equals(h)) {
											v = true;
										}
									}
									if (e$$0 ? f.isBlockBoundary() : !i.contains(f)) {
										break;
									}
									if (!z || f.getComputedStyle("display") != "inline") {
										z = false;
										if (v) {
											g = f;
										} else {
											this.setStartBefore(f);
										}
									}
									s = f.getPrevious();
								}
								for (; s;) {
									u = false;
									if (s.type == CKEDITOR.NODE_COMMENT) {
										s = s.getPrevious();
									} else {
										if (s.type == CKEDITOR.NODE_TEXT) {
											x = s.getText();
											if (c.test(x)) {
												s = null;
											}
											u = /[\s\ufeff]$/.test(x);
										} else {
											if ((s.$.offsetWidth > 0 || b$$0 && s.is("br")) && !s.data("cke-bookmark")) {
												if (z && CKEDITOR.dtd.$removeEmpty[s.getName()]) {
													x = s.getText();
													if (c.test(x)) {
														s = null;
													} else {
														B = s.$.getElementsByTagName("*");
														var H = 0;
														var F;
														for (; F = B[H++];) {
															if (!CKEDITOR.dtd.$removeEmpty[F.nodeName.toLowerCase()]) {
																s = null;
																break;
															}
														}
													}
													if (s) {
														u = !!x.length;
													}
												} else {
													s = null;
												}
											}
										}
										if (u) {
											if (z) {
												if (v) {
													g = f;
												} else {
													if (f) {
														this.setStartBefore(f);
													}
												}
											} else {
												z = true;
											}
										}
										if (s) {
											u = s.getPrevious();
											if (!f && !u) {
												f = s;
												s = null;
												break;
											}
											s = u;
										} else {
											f = null;
										}
									}
								}
								if (f) {
									f = d$$0(f.getParent());
								}
							}
							u = this.endContainer;
							B = this.endOffset;
							f = s = null;
							v = z = false;
							var O = function(a$$0, b) {
								var d = new CKEDITOR.dom.range(i);
								d.setStart(a$$0, b);
								d.setEndAt(i, CKEDITOR.POSITION_BEFORE_END);
								d = new CKEDITOR.dom.walker(d);
								var e;
								d.guard = function(a) {
									return !(a.type == CKEDITOR.NODE_ELEMENT && a.isBlockBoundary());
								};
								for (; e = d.next();) {
									if (e.type != CKEDITOR.NODE_TEXT) {
										return false;
									}
									x = e != a$$0 ? e.getText() : e.substring(b);
									if (c.test(x)) {
										return false;
									}
								}
								return true;
							};
							if (u.type == CKEDITOR.NODE_TEXT) {
								if (CKEDITOR.tools.trim(u.substring(B)).length) {
									z = true;
								} else {
									z = !u.getLength();
									if (B == u.getLength()) {
										if (!(s = u.getNext())) {
											f = u.getParent();
										}
									} else {
										if (O(u, B)) {
											f = u.getParent();
										}
									}
								}
							} else {
								if (!(s = u.getChild(B))) {
									f = u;
								}
							}
							for (; f || s;) {
								if (f && !s) {
									if (!v) {
										if (f.equals(h)) {
											v = true;
										}
									}
									if (e$$0 ? f.isBlockBoundary() : !i.contains(f)) {
										break;
									}
									if (!z || f.getComputedStyle("display") != "inline") {
										z = false;
										if (v) {
											j = f;
										} else {
											if (f) {
												this.setEndAfter(f);
											}
										}
									}
									s = f.getNext();
								}
								for (; s;) {
									u = false;
									if (s.type == CKEDITOR.NODE_TEXT) {
										x = s.getText();
										if (!O(s, 0)) {
											s = null;
										}
										u = /^[\s\ufeff]/.test(x);
									} else {
										if (s.type == CKEDITOR.NODE_ELEMENT) {
											if ((s.$.offsetWidth > 0 || b$$0 && s.is("br")) && !s.data("cke-bookmark")) {
												if (z && CKEDITOR.dtd.$removeEmpty[s.getName()]) {
													x = s.getText();
													if (c.test(x)) {
														s = null;
													} else {
														B = s.$.getElementsByTagName("*");
														H = 0;
														for (; F = B[H++];) {
															if (!CKEDITOR.dtd.$removeEmpty[F.nodeName.toLowerCase()]) {
																s = null;
																break;
															}
														}
													}
													if (s) {
														u = !!x.length;
													}
												} else {
													s = null;
												}
											}
										} else {
											u = 1;
										}
									}
									if (u) {
										if (z) {
											if (v) {
												j = f;
											} else {
												this.setEndAfter(f);
											}
										}
									}
									if (s) {
										u = s.getNext();
										if (!f && !u) {
											f = s;
											s = null;
											break;
										}
										s = u;
									} else {
										f = null;
									}
								}
								if (f) {
									f = d$$0(f.getParent());
								}
							}
							if (g && j) {
								h = g.contains(j) ? j : g;
								this.setStartBefore(h);
								this.setEndAfter(h);
							}
							break;
						case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
							;
						case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:
							f = new CKEDITOR.dom.range(this.root);
							i = this.root;
							f.setStartAt(i, CKEDITOR.POSITION_AFTER_START);
							f.setEnd(this.startContainer, this.startOffset);
							f = new CKEDITOR.dom.walker(f);
							var G;
							var J;
							var A = CKEDITOR.dom.walker.blockBoundary(a$$1 == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? {
								br: 1
							} : null);
							var S = null;
							var K = function(a) {
								if (a.type == CKEDITOR.NODE_ELEMENT && a.getAttribute("contenteditable") == "false") {
									if (S) {
										if (S.equals(a)) {
											S = null;
											return;
										}
									} else {
										S = a;
									}
								} else {
									if (S) {
										return;
									}
								}
								var b = A(a);
								if (!b) {
									G = a;
								}
								return b;
							};
							e$$0 = function(a) {
								var b = K(a);
								if (!b) {
									if (a.is && a.is("br")) {
										J = a;
									}
								}
								return b;
							};
							f.guard = K;
							f = f.lastBackward();
							G = G || i;
							this.setStartAt(G, !G.is("br") && (!f && this.checkStartOfBlock() || f && G.contains(f)) ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_AFTER_END);
							if (a$$1 == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS) {
								f = this.clone();
								f = new CKEDITOR.dom.walker(f);
								var M = CKEDITOR.dom.walker.whitespaces();
								var ha = CKEDITOR.dom.walker.bookmark();
								f.evaluator = function(a) {
									return !M(a) && !ha(a);
								};
								if ((f = f.previous()) && (f.type == CKEDITOR.NODE_ELEMENT && f.is("br"))) {
									break;
								}
							}
							f = this.clone();
							f.collapse();
							f.setEndAt(i, CKEDITOR.POSITION_BEFORE_END);
							f = new CKEDITOR.dom.walker(f);
							f.guard = a$$1 == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? e$$0 : K;
							G = null;
							f = f.lastForward();
							G = G || i;
							this.setEndAt(G, !f && this.checkEndOfBlock() || f && G.contains(f) ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_BEFORE_START);
							if (J) {
								this.setEndAfter(J);
							};
					}
				},
				shrink: function(a, b$$0, d) {
					if (!this.collapsed) {
						a = a || CKEDITOR.SHRINK_TEXT;
						var c$$0 = this.clone();
						var e = this.startContainer;
						var h = this.endContainer;
						var i = this.startOffset;
						var g = this.endOffset;
						var f = 1;
						var j = 1;
						if (e && e.type == CKEDITOR.NODE_TEXT) {
							if (i) {
								if (i >= e.getLength()) {
									c$$0.setStartAfter(e);
								} else {
									c$$0.setStartBefore(e);
									f = 0;
								}
							} else {
								c$$0.setStartBefore(e);
							}
						}
						if (h && h.type == CKEDITOR.NODE_TEXT) {
							if (g) {
								if (g >= h.getLength()) {
									c$$0.setEndAfter(h);
								} else {
									c$$0.setEndAfter(h);
									j = 0;
								}
							} else {
								c$$0.setEndBefore(h);
							}
						}
						c$$0 = new CKEDITOR.dom.walker(c$$0);
						var s = CKEDITOR.dom.walker.bookmark();
						c$$0.evaluator = function(b) {
							return b.type == (a == CKEDITOR.SHRINK_ELEMENT ? CKEDITOR.NODE_ELEMENT : CKEDITOR.NODE_TEXT);
						};
						var v;
						c$$0.guard = function(b, c) {
							if (s(b)) {
								return true;
							}
							if (a == CKEDITOR.SHRINK_ELEMENT && b.type == CKEDITOR.NODE_TEXT || (c && b.equals(v) || (d === false && (b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary()) || b.type == CKEDITOR.NODE_ELEMENT && b.hasAttribute("contenteditable")))) {
								return false;
							}
							if (!c) {
								if (b.type == CKEDITOR.NODE_ELEMENT) {
									v = b;
								}
							}
							return true;
						};
						if (f) {
							if (e = c$$0[a == CKEDITOR.SHRINK_ELEMENT ? "lastForward" : "next"]()) {
								this.setStartAt(e, b$$0 ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_START);
							}
						}
						if (j) {
							c$$0.reset();
							if (c$$0 = c$$0[a == CKEDITOR.SHRINK_ELEMENT ? "lastBackward" : "previous"]()) {
								this.setEndAt(c$$0, b$$0 ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END);
							}
						}
						return !(!f && !j);
					}
				},
				insertNode: function(a) {
					this.optimizeBookmark();
					this.trim(false, true);
					var b = this.startContainer;
					var d = b.getChild(this.startOffset);
					if (d) {
						a.insertBefore(d);
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
				setStart: function(b, d) {
					if (b.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[b.getName()]) {
						d = b.getIndex();
						b = b.getParent();
					}
					this.startContainer = b;
					this.startOffset = d;
					if (!this.endContainer) {
						this.endContainer = b;
						this.endOffset = d;
					}
					a$$2(this);
				},
				setEnd: function(b, d) {
					if (b.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[b.getName()]) {
						d = b.getIndex() + 1;
						b = b.getParent();
					}
					this.endContainer = b;
					this.endOffset = d;
					if (!this.startContainer) {
						this.startContainer = b;
						this.startOffset = d;
					}
					a$$2(this);
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
				setStartAt: function(b, d) {
					switch (d) {
						case CKEDITOR.POSITION_AFTER_START:
							this.setStart(b, 0);
							break;
						case CKEDITOR.POSITION_BEFORE_END:
							if (b.type == CKEDITOR.NODE_TEXT) {
								this.setStart(b, b.getLength());
							} else {
								this.setStart(b, b.getChildCount());
							}
							break;
						case CKEDITOR.POSITION_BEFORE_START:
							this.setStartBefore(b);
							break;
						case CKEDITOR.POSITION_AFTER_END:
							this.setStartAfter(b);
					}
					a$$2(this);
				},
				setEndAt: function(b, d) {
					switch (d) {
						case CKEDITOR.POSITION_AFTER_START:
							this.setEnd(b, 0);
							break;
						case CKEDITOR.POSITION_BEFORE_END:
							if (b.type == CKEDITOR.NODE_TEXT) {
								this.setEnd(b, b.getLength());
							} else {
								this.setEnd(b, b.getChildCount());
							}
							break;
						case CKEDITOR.POSITION_BEFORE_START:
							this.setEndBefore(b);
							break;
						case CKEDITOR.POSITION_AFTER_END:
							this.setEndAfter(b);
					}
					a$$2(this);
				},
				fixBlock: function(a, b) {
					var d = this.createBookmark();
					var c = this.document.createElement(b);
					this.collapse(a);
					this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
					this.extractContents().appendTo(c);
					c.trim();
					c.appendBogus();
					this.insertNode(c);
					this.moveToBookmark(d);
					return c;
				},
				splitBlock: function(a) {
					var b = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
					var d = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
					var c = b.block;
					var e = d.block;
					var h = null;
					if (!b.blockLimit.equals(d.blockLimit)) {
						return null;
					}
					if (a != "br") {
						if (!c) {
							c = this.fixBlock(true, a);
							e = (new CKEDITOR.dom.elementPath(this.endContainer, this.root)).block;
						}
						if (!e) {
							e = this.fixBlock(false, a);
						}
					}
					a = c && this.checkStartOfBlock();
					b = e && this.checkEndOfBlock();
					this.deleteContents();
					if (c && c.equals(e)) {
						if (b) {
							h = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
							this.moveToPosition(e, CKEDITOR.POSITION_AFTER_END);
							e = null;
						} else {
							if (a) {
								h = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
								this.moveToPosition(c, CKEDITOR.POSITION_BEFORE_START);
								c = null;
							} else {
								e = this.splitElement(c);
								if (!c.is("ul", "ol")) {
									c.appendBogus();
								}
							}
						}
					}
					return {
						previousBlock: c,
						nextBlock: e,
						wasStartOfBlock: a,
						wasEndOfBlock: b,
						elementPath: h
					};
				},
				splitElement: function(a) {
					if (!this.collapsed) {
						return null;
					}
					this.setEndAt(a, CKEDITOR.POSITION_BEFORE_END);
					var b = this.extractContents();
					var d = a.clone(false);
					b.appendTo(d);
					d.insertAfter(a);
					this.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
					return d;
				},
				removeEmptyBlocksAtEnd: function() {
					function a$$0(c) {
						return function(a) {
							return b$$0(a) || (d$$0(a) || a.type == CKEDITOR.NODE_ELEMENT && a.isEmptyInlineRemoveable() || c.is("table") && a.is("caption")) ? false : true;
						};
					}
					var b$$0 = CKEDITOR.dom.walker.whitespaces();
					var d$$0 = CKEDITOR.dom.walker.bookmark(false);
					return function(b) {
						var d = this.createBookmark();
						var c = this[b ? "endPath" : "startPath"]();
						var e = c.block || c.blockLimit;
						var h;
						for (; e && (!e.equals(c.root) && !e.getFirst(a$$0(e)));) {
							h = e.getParent();
							this[b ? "setEndAt" : "setStartAt"](e, CKEDITOR.POSITION_AFTER_END);
							e.remove(1);
							e = h;
						}
						this.moveToBookmark(d);
					};
				}(),
				startPath: function() {
					return new CKEDITOR.dom.elementPath(this.startContainer, this.root);
				},
				endPath: function() {
					return new CKEDITOR.dom.elementPath(this.endContainer, this.root);
				},
				checkBoundaryOfElement: function(a, b) {
					var d = b == CKEDITOR.START;
					var c = this.clone();
					c.collapse(d);
					c[d ? "setStartAt" : "setEndAt"](a, d ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
					c = new CKEDITOR.dom.walker(c);
					c.evaluator = f$$0(d);
					return c[d ? "checkBackward" : "checkForward"]();
				},
				checkStartOfBlock: function() {
					var a = this.startContainer;
					var d = this.startOffset;
					if (CKEDITOR.env.ie && (d && a.type == CKEDITOR.NODE_TEXT)) {
						a = CKEDITOR.tools.ltrim(a.substring(0, d));
						if (i$$0.test(a)) {
							this.trim(0, 1);
						}
					}
					this.trim();
					a = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
					d = this.clone();
					d.collapse(true);
					d.setStartAt(a.block || a.blockLimit, CKEDITOR.POSITION_AFTER_START);
					a = new CKEDITOR.dom.walker(d);
					a.evaluator = b$$1();
					return a.checkBackward();
				},
				checkEndOfBlock: function() {
					var a = this.endContainer;
					var d = this.endOffset;
					if (CKEDITOR.env.ie && a.type == CKEDITOR.NODE_TEXT) {
						a = CKEDITOR.tools.rtrim(a.substring(d));
						if (i$$0.test(a)) {
							this.trim(1, 0);
						}
					}
					this.trim();
					a = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
					d = this.clone();
					d.collapse(false);
					d.setEndAt(a.block || a.blockLimit, CKEDITOR.POSITION_BEFORE_END);
					a = new CKEDITOR.dom.walker(d);
					a.evaluator = b$$1();
					return a.checkForward();
				},
				getPreviousNode: function(a, b, d) {
					var c = this.clone();
					c.collapse(1);
					c.setStartAt(d || this.root, CKEDITOR.POSITION_AFTER_START);
					d = new CKEDITOR.dom.walker(c);
					d.evaluator = a;
					d.guard = b;
					return d.previous();
				},
				getNextNode: function(a, b, d) {
					var c = this.clone();
					c.collapse();
					c.setEndAt(d || this.root, CKEDITOR.POSITION_BEFORE_END);
					d = new CKEDITOR.dom.walker(c);
					d.evaluator = a;
					d.guard = b;
					return d.next();
				},
				checkReadOnly: function() {
					function a(b, d) {
						for (; b;) {
							if (b.type == CKEDITOR.NODE_ELEMENT) {
								if (b.getAttribute("contentEditable") == "false" && !b.data("cke-editable")) {
									return 0;
								}
								if (b.is("html") || b.getAttribute("contentEditable") == "true" && (b.contains(d) || b.equals(d))) {
									break;
								}
							}
							b = b.getParent();
						}
						return 1;
					}
					return function() {
						var b = this.startContainer;
						var d = this.endContainer;
						return !(a(b, d) && a(d, b));
					};
				}(),
				moveToElementEditablePosition: function(a, b) {
					if (a.type == CKEDITOR.NODE_ELEMENT && !a.isEditable(false)) {
						this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
						return true;
					}
					var d = 0;
					for (; a;) {
						if (a.type == CKEDITOR.NODE_TEXT) {
							if (b && (this.endContainer && (this.checkEndOfBlock() && i$$0.test(a.getText())))) {
								this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START);
							} else {
								this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
							}
							d = 1;
							break;
						}
						if (a.type == CKEDITOR.NODE_ELEMENT) {
							if (a.isEditable()) {
								this.moveToPosition(a, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START);
								d = 1;
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
						var c = a;
						var e = d;
						var h = void 0;
						if (c.type == CKEDITOR.NODE_ELEMENT) {
							if (c.isEditable(false)) {
								h = c[b ? "getLast" : "getFirst"](j$$0);
							}
						}
						if (!e) {
							if (!h) {
								h = c[b ? "getPrevious" : "getNext"](j$$0);
							}
						}
						a = h;
					}
					return !!d;
				},
				moveToClosestEditablePosition: function(a, b) {
					var d = new CKEDITOR.dom.range(this.root);
					var c = 0;
					var e;
					var h = [CKEDITOR.POSITION_AFTER_END, CKEDITOR.POSITION_BEFORE_START];
					d.moveToPosition(a, h[b ? 0 : 1]);
					if (a.is(CKEDITOR.dtd.$block)) {
						if (e = d[b ? "getNextEditableNode" : "getPreviousEditableNode"]()) {
							c = 1;
							if (e.type == CKEDITOR.NODE_ELEMENT && (e.is(CKEDITOR.dtd.$block) && e.getAttribute("contenteditable") == "false")) {
								d.setStartAt(e, CKEDITOR.POSITION_BEFORE_START);
								d.setEndAt(e, CKEDITOR.POSITION_AFTER_END);
							} else {
								d.moveToPosition(e, h[b ? 1 : 0]);
							}
						}
					} else {
						c = 1;
					}
					if (c) {
						this.moveToRange(d);
					}
					return !!c;
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
					var d = CKEDITOR.dom.walker.whitespaces(true);
					a$$0.evaluator = function(a) {
						return d(a) && b(a);
					};
					var c = a$$0.next();
					a$$0.reset();
					return c && c.equals(a$$0.previous()) ? c : null;
				},
				getTouchedStartNode: function() {
					var a = this.startContainer;
					return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.startOffset) || a;
				},
				getTouchedEndNode: function() {
					var a = this.endContainer;
					return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.endOffset - 1) || a;
				},
				getNextEditableNode: c$$1(),
				getPreviousEditableNode: c$$1(1),
				scrollIntoView: function() {
					var a = new CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", this.document);
					var b;
					var d;
					var c;
					var e = this.clone();
					e.optimize();
					if (c = e.startContainer.type == CKEDITOR.NODE_TEXT) {
						d = e.startContainer.getText();
						b = e.startContainer.split(e.startOffset);
						a.insertAfter(e.startContainer);
					} else {
						e.insertNode(a);
					}
					a.scrollIntoView();
					if (c) {
						e.startContainer.setText(d);
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
			function b$$0(a) {
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

			function f(a, b, d) {
				a = a.getNextSourceNode(b, null, d);
				for (; !e$$0(a);) {
					a = a.getNextSourceNode(b, null, d);
				}
				return a;
			}

			function c$$0(a$$0) {
				var b = [];
				a$$0.forEach(function(a) {
					if (a.getAttribute("contenteditable") == "true") {
						b.push(a);
						return false;
					}
				}, CKEDITOR.NODE_ELEMENT, true);
				return b;
			}

			function a$$1(b, d, e, i) {
				a: {
					if (i == void 0) {
						i = c$$0(e);
					}
					var g;
					for (; g = i.shift();) {
						if (g.getDtd().p) {
							i = {
								element: g,
								remaining: i
							};
							break a;
						}
					}
					i = null;
				}
				if (!i) {
					return 0;
				}
				if ((g = CKEDITOR.filter.instances[i.element.data("cke-filter")]) && !g.check(d)) {
					return a$$1(b, d, e, i.remaining);
				}
				d = new CKEDITOR.dom.range(i.element);
				d.selectNodeContents(i.element);
				d = d.createIterator();
				d.enlargeBr = b.enlargeBr;
				d.enforceRealBlocks = b.enforceRealBlocks;
				d.activeFilter = d.filter = g;
				b._.nestedEditable = {
					element: i.element,
					container: e,
					remaining: i.remaining,
					iterator: d
				};
				return 1;
			}
			var d$$0 = /^[\r\n\t ]+$/;
			var e$$0 = CKEDITOR.dom.walker.bookmark(false, true);
			var g$$0 = CKEDITOR.dom.walker.whitespaces(true);
			var i$$0 = function(a) {
				return e$$0(a) && g$$0(a);
			};
			b$$0.prototype = {
				getNextParagraph: function(b) {
					var c;
					var g;
					var n;
					var m;
					var q;
					b = b || "p";
					if (this._.nestedEditable) {
						if (c = this._.nestedEditable.iterator.getNextParagraph(b)) {
							this.activeFilter = this._.nestedEditable.iterator.activeFilter;
							return c;
						}
						this.activeFilter = this.filter;
						if (a$$1(this, b, this._.nestedEditable.container, this._.nestedEditable.remaining)) {
							this.activeFilter = this._.nestedEditable.iterator.activeFilter;
							return this._.nestedEditable.iterator.getNextParagraph(b);
						}
						this._.nestedEditable = null;
					}
					if (!this.range.root.getDtd()[b]) {
						return null;
					}
					if (!this._.started) {
						var o = this.range.clone();
						o.shrink(CKEDITOR.SHRINK_ELEMENT, true);
						g = o.endContainer.hasAscendant("pre", true) || o.startContainer.hasAscendant("pre", true);
						o.enlarge(this.forceBrBreak && !g || !this.enlargeBr ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS);
						if (!o.collapsed) {
							g = new CKEDITOR.dom.walker(o.clone());
							var l = CKEDITOR.dom.walker.bookmark(true, true);
							g.evaluator = l;
							this._.nextNode = g.next();
							g = new CKEDITOR.dom.walker(o.clone());
							g.evaluator = l;
							g = g.previous();
							this._.lastNode = g.getNextSourceNode(true);
							if (this._.lastNode && (this._.lastNode.type == CKEDITOR.NODE_TEXT && (!CKEDITOR.tools.trim(this._.lastNode.getText()) && this._.lastNode.getParent().isBlockBoundary()))) {
								l = this.range.clone();
								l.moveToPosition(this._.lastNode, CKEDITOR.POSITION_AFTER_END);
								if (l.checkEndOfBlock()) {
									l = new CKEDITOR.dom.elementPath(l.endContainer, l.root);
									this._.lastNode = (l.block || l.blockLimit).getNextSourceNode(true);
								}
							}
							if (!this._.lastNode || !o.root.contains(this._.lastNode)) {
								this._.lastNode = this._.docEndMarker = o.document.createText("");
								this._.lastNode.insertAfter(g);
							}
							o = null;
						}
						this._.started = 1;
						g = o;
					}
					l = this._.nextNode;
					o = this._.lastNode;
					this._.nextNode = null;
					for (; l;) {
						var r = 0;
						var p = l.hasAscendant("pre");
						var t = l.type != CKEDITOR.NODE_ELEMENT;
						var w = 0;
						if (t) {
							if (l.type == CKEDITOR.NODE_TEXT) {
								if (d$$0.test(l.getText())) {
									t = 0;
								}
							}
						} else {
							var s = l.getName();
							if (CKEDITOR.dtd.$block[s] && l.getAttribute("contenteditable") == "false") {
								c = l;
								a$$1(this, b, c);
								break;
							} else {
								if (l.isBlockBoundary(this.forceBrBreak && (!p && {
									br: 1
								}))) {
									if (s == "br") {
										t = 1;
									} else {
										if (!g && (!l.getChildCount() && s != "hr")) {
											c = l;
											n = l.equals(o);
											break;
										}
									}
									if (g) {
										g.setEndAt(l, CKEDITOR.POSITION_BEFORE_START);
										if (s != "br") {
											this._.nextNode = l;
										}
									}
									r = 1;
								} else {
									if (l.getFirst()) {
										if (!g) {
											g = this.range.clone();
											g.setStartAt(l, CKEDITOR.POSITION_BEFORE_START);
										}
										l = l.getFirst();
										continue;
									}
									t = 1;
								}
							}
						}
						if (t && !g) {
							g = this.range.clone();
							g.setStartAt(l, CKEDITOR.POSITION_BEFORE_START);
						}
						n = (!r || t) && l.equals(o);
						if (g && !r) {
							for (; !l.getNext(i$$0) && !n;) {
								s = l.getParent();
								if (s.isBlockBoundary(this.forceBrBreak && (!p && {
									br: 1
								}))) {
									r = 1;
									t = 0;
									if (!n) {
										s.equals(o);
									}
									g.setEndAt(s, CKEDITOR.POSITION_BEFORE_END);
									break;
								}
								l = s;
								t = 1;
								n = l.equals(o);
								w = 1;
							}
						}
						if (t) {
							g.setEndAt(l, CKEDITOR.POSITION_AFTER_END);
						}
						l = f(l, w, o);
						if ((n = !l) || r && g) {
							break;
						}
					}
					if (!c) {
						if (!g) {
							if (this._.docEndMarker) {
								this._.docEndMarker.remove();
							}
							return this._.nextNode = null;
						}
						c = new CKEDITOR.dom.elementPath(g.startContainer, g.root);
						l = c.blockLimit;
						r = {
							div: 1,
							th: 1,
							td: 1
						};
						c = c.block;
						if (!c && (l && (!this.enforceRealBlocks && (r[l.getName()] && (g.checkStartOfBlock() && (g.checkEndOfBlock() && !l.equals(g.root))))))) {
							c = l;
						} else {
							if (!c || this.enforceRealBlocks && c.getName() == "li") {
								c = this.range.document.createElement(b);
								g.extractContents().appendTo(c);
								c.trim();
								g.insertNode(c);
								m = q = true;
							} else {
								if (c.getName() != "li") {
									if (!g.checkStartOfBlock() || !g.checkEndOfBlock()) {
										c = c.clone(false);
										g.extractContents().appendTo(c);
										c.trim();
										q = g.splitBlock();
										m = !q.wasStartOfBlock;
										q = !q.wasEndOfBlock;
										g.insertNode(c);
									}
								} else {
									if (!n) {
										this._.nextNode = c.equals(o) ? null : f(g.getBoundaryNodes().endNode, 1, o);
									}
								}
							}
						}
					}
					if (m) {
						if (m = c.getPrevious()) {
							if (m.type == CKEDITOR.NODE_ELEMENT) {
								if (m.getName() == "br") {
									m.remove();
								} else {
									if (m.getLast()) {
										if (m.getLast().$.nodeName.toLowerCase() == "br") {
											m.getLast().remove();
										}
									}
								}
							}
						}
					}
					if (q) {
						if (m = c.getLast()) {
							if (m.type == CKEDITOR.NODE_ELEMENT) {
								if (m.getName() == "br") {
									if (!CKEDITOR.env.needsBrFiller || (m.getPrevious(e$$0) || m.getNext(e$$0))) {
										m.remove();
									}
								}
							}
						}
					}
					if (!this._.nextNode) {
						this._.nextNode = n || (c.equals(o) || !o) ? null : f(c, 1, o);
					}
					return c;
				}
			};
			CKEDITOR.dom.range.prototype.createIterator = function() {
				return new b$$0(this);
			};
		})();
		CKEDITOR.command = function(b$$0, f) {
			this.uiItems = [];
			this.exec = function(a) {
				if (this.state == CKEDITOR.TRISTATE_DISABLED || !this.checkAllowed()) {
					return false;
				}
				if (this.editorFocus) {
					b$$0.focus();
				}
				return this.fire("exec") === false ? true : f.exec.call(this, b$$0, a) !== false;
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
				}) === false ? true : f.refresh && f.refresh.apply(this, arguments) !== false;
			};
			var c;
			this.checkAllowed = function(a) {
				return !a && typeof c == "boolean" ? c : c = b$$0.activeFilter.checkFeature(this);
			};
			CKEDITOR.tools.extend(this, f, {
				modes: {
					wysiwyg: 1
				},
				editorFocus: 1,
				contextSensitive: !!f.context,
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
			setState: function(b) {
				if (this.state == b || b != CKEDITOR.TRISTATE_DISABLED && !this.checkAllowed()) {
					return false;
				}
				this.previousState = this.state;
				this.state = b;
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
			blockedKeystrokes: [CKEDITOR.CTRL + 66, CKEDITOR.CTRL + 73, CKEDITOR.CTRL + 85, CKEDITOR.CTRL + 89, CKEDITOR.CTRL + 90, CKEDITOR.CTRL + CKEDITOR.SHIFT + 90]
		};
		(function() {
			function b$$1(a, b, c, e, h) {
				var g = b.name;
				if ((e || (typeof a.elements != "function" || a.elements(g))) && (!a.match || a.match(b))) {
					if (e = !h) {
						a: {
							if (a.nothingRequired) {
								e = true;
							} else {
								if (h = a.requiredClasses) {
									g = b.classes;
									e = 0;
									for (; e < h.length; ++e) {
										if (CKEDITOR.tools.indexOf(g, h[e]) == -1) {
											e = false;
											break a;
										}
									}
								}
								e = d$$1(b.styles, a.requiredStyles) && d$$1(b.attributes, a.requiredAttributes);
							}
						}
						e = !e;
					}
					if (!e) {
						if (!a.propertiesOnly) {
							c.valid = true;
						}
						if (!c.allAttributes) {
							c.allAttributes = f$$0(a.attributes, b.attributes, c.validAttributes);
						}
						if (!c.allStyles) {
							c.allStyles = f$$0(a.styles, b.styles, c.validStyles);
						}
						if (!c.allClasses) {
							a = a.classes;
							b = b.classes;
							e = c.validClasses;
							if (a) {
								if (a === true) {
									b = true;
								} else {
									h = 0;
									g = b.length;
									var i;
									for (; h < g; ++h) {
										i = b[h];
										if (!e[i]) {
											e[i] = a(i);
										}
									}
									b = false;
								}
							} else {
								b = false;
							}
							c.allClasses = b;
						}
					}
				}
			}

			function f$$0(a, b, d) {
				if (!a) {
					return false;
				}
				if (a === true) {
					return true;
				}
				var c;
				for (c in b) {
					if (!d[c]) {
						d[c] = a(c, b[c]);
					}
				}
				return false;
			}

			function c$$1(a, b) {
				if (!a) {
					return false;
				}
				if (a === true) {
					return a;
				}
				if (typeof a == "string") {
					a = z$$0(a);
					return a == "*" ? true : CKEDITOR.tools.convertArrayToObject(a.split(b));
				}
				if (CKEDITOR.tools.isArray(a)) {
					return a.length ? CKEDITOR.tools.convertArrayToObject(a) : false;
				}
				var d = {};
				var c = 0;
				var e;
				for (e in a) {
					d[e] = a[e];
					c++;
				}
				return c ? d : false;
			}

			function a$$1(a) {
				if (a._.filterFunction) {
					return a._.filterFunction;
				}
				var d = /^cke:(object|embed|param)$/;
				var c = /^(object|embed|param)$/;
				return a._.filterFunction = function(e, g, i, f, o, n, s) {
					var t = e.name;
					var w;
					var m = false;
					if (o) {
						e.name = t = t.replace(d, "$1");
					}
					if (i = i && i[t]) {
						h$$0(e);
						t = 0;
						for (; t < i.length; ++t) {
							l$$0(a, e, i[t]);
						}
						j$$0(e);
					}
					if (g) {
						t = e.name;
						i = g.elements[t];
						var r = g.generic;
						g = {
							valid: false,
							validAttributes: {},
							validClasses: {},
							validStyles: {},
							allAttributes: false,
							allClasses: false,
							allStyles: false
						};
						if (!i && !r) {
							f.push(e);
							return true;
						}
						h$$0(e);
						if (i) {
							t = 0;
							w = i.length;
							for (; t < w; ++t) {
								b$$1(i[t], e, g, true, n);
							}
						}
						if (r) {
							t = 0;
							w = r.length;
							for (; t < w; ++t) {
								b$$1(r[t], e, g, false, n);
							}
						}
						if (!g.valid) {
							f.push(e);
							return true;
						}
						n = g.validAttributes;
						t = g.validStyles;
						i = g.validClasses;
						w = e.attributes;
						r = e.styles;
						var u = w["class"];
						var v = w.style;
						var p;
						var q;
						var B = [];
						var x = [];
						var z = /^data-cke-/;
						var F = false;
						delete w.style;
						delete w["class"];
						if (!g.allAttributes) {
							for (p in w) {
								if (!n[p]) {
									if (z.test(p)) {
										if (p != (q = p.replace(/^data-cke-saved-/, "")) && !n[q]) {
											delete w[p];
											F = true;
										}
									} else {
										delete w[p];
										F = true;
									}
								}
							}
						}
						if (g.allStyles) {
							if (v) {
								w.style = v;
							}
						} else {
							for (p in r) {
								if (t[p]) {
									B.push(p + ":" + r[p]);
								} else {
									F = true;
								}
							}
							if (B.length) {
								w.style = B.sort().join("; ");
							}
						}
						if (g.allClasses) {
							if (u) {
								w["class"] = u;
							}
						} else {
							for (p in i) {
								if (i[p]) {
									x.push(p);
								}
							}
							if (x.length) {
								w["class"] = x.sort().join(" ");
							}
							if (u) {
								if (x.length < u.split(/\s+/).length) {
									F = true;
								}
							}
						}
						if (F) {
							m = true;
						}
						if (!s && !k$$0(e)) {
							f.push(e);
							return true;
						}
					}
					if (o) {
						e.name = e.name.replace(c, "cke:$1");
					}
					return m;
				};
			}

			function d$$1(a, b) {
				if (!b) {
					return true;
				}
				var d = 0;
				for (; d < b.length; ++d) {
					if (!(b[d] in a)) {
						return false;
					}
				}
				return true;
			}

			function e$$1(a) {
				if (!a) {
					return {};
				}
				a = a.split(/\s*,\s*/).sort();
				var b = {};
				for (; a.length;) {
					b[a.shift()] = u$$0;
				}
				return b;
			}

			function g$$0(a) {
				var b;
				var d;
				var c;
				var e;
				var h = {};
				var g = 1;
				a = z$$0(a);
				for (; b = a.match(F$$0);) {
					if (d = b[2]) {
						c = i$$0(d, "styles");
						e = i$$0(d, "attrs");
						d = i$$0(d, "classes");
					} else {
						c = e = d = null;
					}
					h["$" + g++] = {
						elements: b[1],
						classes: d,
						styles: c,
						attributes: e
					};
					a = a.slice(b[0].length);
				}
				return h;
			}

			function i$$0(a, b) {
				var d = a.match(O[b]);
				return d ? z$$0(d[1]) : null;
			}

			function h$$0(a) {
				if (!a.styles) {
					a.styles = CKEDITOR.tools.parseCssText(a.attributes.style || "", 1);
				}
				if (!a.classes) {
					a.classes = a.attributes["class"] ? a.attributes["class"].split(/\s+/) : [];
				}
			}

			function j$$0(a) {
				var b = a.attributes;
				var d;
				delete b.style;
				delete b["class"];
				if (d = CKEDITOR.tools.writeCssText(a.styles, true)) {
					b.style = d;
				}
				if (a.classes.length) {
					b["class"] = a.classes.sort().join(" ");
				}
			}

			function k$$0(a) {
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

			function n$$0(a) {
				return !a ? false : a === true ? true : function(b) {
					return b in a;
				};
			}

			function m$$0() {
				return new CKEDITOR.htmlParser.element("br");
			}

			function q$$0(a) {
				return a.type == CKEDITOR.NODE_ELEMENT && (a.name == "br" || s$$0.$block[a.name]);
			}

			function o$$0(a, b, d) {
				var c = a.name;
				if (s$$0.$empty[c] || !a.children.length) {
					if (c == "hr" && b == "br") {
						a.replaceWith(m$$0());
					} else {
						if (a.parent) {
							d.push({
								check: "it",
								el: a.parent
							});
						}
						a.remove();
					}
				} else {
					if (s$$0.$block[c] || c == "tr") {
						if (b == "br") {
							if (a.previous && !q$$0(a.previous)) {
								b = m$$0();
								b.insertBefore(a);
							}
							if (a.next && !q$$0(a.next)) {
								b = m$$0();
								b.insertAfter(a);
							}
							a.replaceWithChildren();
						} else {
							c = a.children;
							var e;
							b: {
								e = s$$0[b];
								var h = 0;
								var g = c.length;
								var i;
								for (; h < g; ++h) {
									i = c[h];
									if (i.type == CKEDITOR.NODE_ELEMENT && !e[i.name]) {
										e = false;
										break b;
									}
								}
								e = true;
							}
							if (e) {
								a.name = b;
								a.attributes = {};
								d.push({
									check: "parent-down",
									el: a
								});
							} else {
								e = a.parent;
								h = e.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || e.name == "body";
								var f;
								g = c.length;
								for (; g > 0;) {
									i = c[--g];
									if (h && (i.type == CKEDITOR.NODE_TEXT || i.type == CKEDITOR.NODE_ELEMENT && s$$0.$inline[i.name])) {
										if (!f) {
											f = new CKEDITOR.htmlParser.element(b);
											f.insertAfter(a);
											d.push({
												check: "parent-down",
												el: f
											});
										}
										f.add(i, 0);
									} else {
										f = null;
										i.insertAfter(a);
										if (e.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
											if (i.type == CKEDITOR.NODE_ELEMENT && !s$$0[e.name][i.name]) {
												d.push({
													check: "el-up",
													el: i
												});
											}
										}
									}
								}
								a.remove();
							}
						}
					} else {
						if (c == "style") {
							a.remove();
						} else {
							if (a.parent) {
								d.push({
									check: "it",
									el: a.parent
								});
							}
							a.replaceWithChildren();
						}
					}
				}
			}

			function l$$0(a, b, d) {
				var c;
				var e;
				c = 0;
				for (; c < d.length; ++c) {
					e = d[c];
					if ((!e.check || a.check(e.check, false)) && (!e.left || e.left(b))) {
						e.right(b, G);
						break;
					}
				}
			}

			function r$$0(a, b) {
				var d = b.getDefinition();
				var c = d.attributes;
				var e = d.styles;
				var h;
				var g;
				var i;
				var f;
				if (a.name != d.element) {
					return false;
				}
				for (h in c) {
					if (h == "class") {
						d = c[h].split(/\s+/);
						i = a.classes.join("|");
						for (; f = d.pop();) {
							if (i.indexOf(f) == -1) {
								return false;
							}
						}
					} else {
						if (a.attributes[h] != c[h]) {
							return false;
						}
					}
				}
				for (g in e) {
					if (a.styles[g] != e[g]) {
						return false;
					}
				}
				return true;
			}

			function p$$0(a$$0, b) {
				var d$$0;
				var c;
				if (typeof a$$0 == "string") {
					d$$0 = a$$0;
				} else {
					if (a$$0 instanceof CKEDITOR.style) {
						c = a$$0;
					} else {
						d$$0 = a$$0[0];
						c = a$$0[1];
					}
				}
				return [{
					element: d$$0,
					left: c,
					right: function(a, d) {
						d.transform(a, b);
					}
				}];
			}

			function t$$0(a) {
				return function(b) {
					return r$$0(b, a);
				};
			}

			function w$$0(a) {
				return function(b, d) {
					d[a](b);
				};
			}
			var s$$0 = CKEDITOR.dtd;
			var v$$0 = CKEDITOR.tools.copy;
			var z$$0 = CKEDITOR.tools.trim;
			var u$$0 = "cke-test";
			var x$$0 = ["", "p", "br", "div"];
			CKEDITOR.filter = function(a) {
				this.allowedContent = [];
				this.disabled = false;
				this.editor = null;
				this.id = CKEDITOR.tools.getNextNumber();
				this._ = {
					rules: {},
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
						this.allow(x$$0[a.enterMode] + " " + x$$0[a.shiftEnterMode], "default", 1);
					}
				} else {
					this.customConfig = false;
					this.allow(a, "default", 1);
				}
			};
			CKEDITOR.filter.instances = {};
			CKEDITOR.filter.prototype = {
				allow: function(a, b, d) {
					if (this.disabled || (this.customConfig && !d || !a)) {
						return false;
					}
					this._.cachedChecks = {};
					var e;
					var h;
					if (typeof a == "string") {
						a = g$$0(a);
					} else {
						if (a instanceof CKEDITOR.style) {
							h = a.getDefinition();
							d = {};
							a = h.attributes;
							d[h.element] = h = {
								styles: h.styles,
								requiredStyles: h.styles && CKEDITOR.tools.objectKeys(h.styles)
							};
							if (a) {
								a = v$$0(a);
								h.classes = a["class"] ? a["class"].split(/\s+/) : null;
								h.requiredClasses = h.classes;
								delete a["class"];
								h.attributes = a;
								h.requiredAttributes = a && CKEDITOR.tools.objectKeys(a);
							}
							a = d;
						} else {
							if (CKEDITOR.tools.isArray(a)) {
								e = 0;
								for (; e < a.length; ++e) {
									h = this.allow(a[e], b, d);
								}
								return h;
							}
						}
					}
					var i;
					d = [];
					for (i in a) {
						h = a[i];
						h = typeof h == "boolean" ? {} : typeof h == "function" ? {
							match: h
						} : v$$0(h);
						if (i.charAt(0) != "$") {
							h.elements = i;
						}
						if (b) {
							h.featureName = b.toLowerCase();
						}
						var f = h;
						f.elements = c$$1(f.elements, /\s+/) || null;
						f.propertiesOnly = f.propertiesOnly || f.elements === true;
						var o = /\s*,\s*/;
						var j = void 0;
						for (j in B$$0) {
							f[j] = c$$1(f[j], o) || null;
							var l = f;
							var k = H[j];
							var t = c$$1(f[H[j]], o);
							var s = f[j];
							var w = [];
							var m = true;
							var r = void 0;
							if (t) {
								m = false;
							} else {
								t = {};
							}
							for (r in s) {
								if (r.charAt(0) == "!") {
									r = r.slice(1);
									w.push(r);
									t[r] = true;
									m = false;
								}
							}
							for (; r = w.pop();) {
								s[r] = s["!" + r];
								delete s["!" + r];
							}
							l[k] = (m ? false : t) || null;
						}
						f.match = f.match || null;
						this.allowedContent.push(h);
						d.push(h);
					}
					b = this._.rules;
					i = b.elements || {};
					a = b.generic || [];
					h = 0;
					f = d.length;
					for (; h < f; ++h) {
						o = v$$0(d[h]);
						j = o.classes === true || (o.styles === true || o.attributes === true);
						l = o;
						k = void 0;
						for (k in B$$0) {
							l[k] = n$$0(l[k]);
						}
						t = true;
						for (k in H) {
							k = H[k];
							l[k] = CKEDITOR.tools.objectKeys(l[k]);
							if (l[k]) {
								t = false;
							}
						}
						l.nothingRequired = t;
						if (o.elements === true || o.elements === null) {
							o.elements = n$$0(o.elements);
							a[j ? "unshift" : "push"](o);
						} else {
							l = o.elements;
							delete o.elements;
							for (e in l) {
								if (i[e]) {
									i[e][j ? "unshift" : "push"](o);
								} else {
									i[e] = [o];
								}
							}
						}
					}
					b.elements = i;
					b.generic = a.length ? a : null;
					return true;
				},
				applyTo: function(b$$0, d, c$$0, e$$0) {
					if (this.disabled) {
						return false;
					}
					var h = [];
					var i = !c$$0 && this._.rules;
					var g = this._.transformations;
					var f = a$$1(this);
					var j = this.editor && this.editor.config.protectedSource;
					var l = false;
					b$$0.forEach(function(a) {
						if (a.type == CKEDITOR.NODE_ELEMENT) {
							if (a.attributes["data-cke-filter"] == "off") {
								return false;
							}
							if (!d || !(a.name == "span" && ~CKEDITOR.tools.objectKeys(a.attributes).join("|").indexOf("data-cke-"))) {
								if (f(a, i, g, h, d)) {
									l = true;
								}
							}
						} else {
							if (a.type == CKEDITOR.NODE_COMMENT && a.value.match(/^\{cke_protected\}(?!\{C\})/)) {
								var b;
								a: {
									var c = decodeURIComponent(a.value.replace(/^\{cke_protected\}/, ""));
									b = [];
									var e;
									var o;
									var k;
									if (j) {
										o = 0;
										for (; o < j.length; ++o) {
											if ((k = c.match(j[o])) && k[0].length == c.length) {
												b = true;
												break a;
											}
										}
									}
									c = CKEDITOR.htmlParser.fragment.fromHtml(c);
									if (c.children.length == 1) {
										if ((e = c.children[0]).type == CKEDITOR.NODE_ELEMENT) {
											f(e, i, g, b, d);
										}
									}
									b = !b.length;
								}
								if (!b) {
									h.push(a);
								}
							}
						}
					}, null, true);
					if (h.length) {
						l = true;
					}
					var n;
					b$$0 = [];
					e$$0 = x$$0[e$$0 || (this.editor ? this.editor.enterMode : CKEDITOR.ENTER_P)];
					for (; c$$0 = h.pop();) {
						if (c$$0.type == CKEDITOR.NODE_ELEMENT) {
							o$$0(c$$0, e$$0, b$$0);
						} else {
							c$$0.remove();
						}
					}
					for (; n = b$$0.pop();) {
						c$$0 = n.el;
						if (c$$0.parent) {
							switch (n.check) {
								case "it":
									if (s$$0.$removeEmpty[c$$0.name] && !c$$0.children.length) {
										o$$0(c$$0, e$$0, b$$0);
									} else {
										if (!k$$0(c$$0)) {
											o$$0(c$$0, e$$0, b$$0);
										}
									}
									break;
								case "el-up":
									if (c$$0.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
										if (!s$$0[c$$0.parent.name][c$$0.name]) {
											o$$0(c$$0, e$$0, b$$0);
										}
									}
									break;
								case "parent-down":
									if (c$$0.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
										if (!s$$0[c$$0.parent.name][c$$0.name]) {
											o$$0(c$$0.parent, e$$0, b$$0);
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
				addContentForms: function(a) {
					if (!this.disabled && a) {
						var b;
						var d;
						var c = [];
						var e;
						b = 0;
						for (; b < a.length && !e; ++b) {
							d = a[b];
							if ((typeof d == "string" || d instanceof CKEDITOR.style) && this.check(d)) {
								e = d;
							}
						}
						if (e) {
							b = 0;
							for (; b < a.length; ++b) {
								c.push(p$$0(a[b], e));
							}
							this.addTransformations(c);
						}
					}
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
					return this.customConfig && a.requiredContent ? this.check(a.requiredContent) : true;
				},
				addTransformations: function(a) {
					var b;
					var d;
					if (!this.disabled && a) {
						var c = this._.transformations;
						var e;
						e = 0;
						for (; e < a.length; ++e) {
							b = a[e];
							var h = void 0;
							var i = void 0;
							var g = void 0;
							var f = void 0;
							var o = void 0;
							var j = void 0;
							d = [];
							i = 0;
							for (; i < b.length; ++i) {
								g = b[i];
								if (typeof g == "string") {
									g = g.split(/\s*:\s*/);
									f = g[0];
									o = null;
									j = g[1];
								} else {
									f = g.check;
									o = g.left;
									j = g.right;
								}
								if (!h) {
									h = g;
									h = h.element ? h.element : f ? f.match(/^([a-z0-9]+)/i)[0] : h.left.getDefinition().element;
								}
								if (o instanceof CKEDITOR.style) {
									o = t$$0(o);
								}
								d.push({
									check: f == h ? null : f,
									left: o,
									right: typeof j == "string" ? w$$0(j) : j
								});
							}
							b = h;
							if (!c[b]) {
								c[b] = [];
							}
							c[b].push(d);
						}
					}
				},
				check: function(b, d, c) {
					if (this.disabled) {
						return true;
					}
					if (CKEDITOR.tools.isArray(b)) {
						var h = b.length;
						for (; h--;) {
							if (this.check(b[h], d, c)) {
								return true;
							}
						}
						return false;
					}
					var i;
					var f;
					if (typeof b == "string") {
						f = b + "<" + (d === false ? "0" : "1") + (c ? "1" : "0") + ">";
						if (f in this._.cachedChecks) {
							return this._.cachedChecks[f];
						}
						h = g$$0(b).$1;
						i = h.styles;
						var o = h.classes;
						h.name = h.elements;
						h.classes = o = o ? o.split(/\s*,\s*/) : [];
						h.styles = e$$1(i);
						h.attributes = e$$1(h.attributes);
						h.children = [];
						if (o.length) {
							h.attributes["class"] = o.join(" ");
						}
						if (i) {
							h.attributes.style = CKEDITOR.tools.writeCssText(h.styles);
						}
						i = h;
					} else {
						h = b.getDefinition();
						i = h.styles;
						o = h.attributes || {};
						if (i) {
							i = v$$0(i);
							o.style = CKEDITOR.tools.writeCssText(i, true);
						} else {
							i = {};
						}
						i = {
							name: h.element,
							attributes: o,
							classes: o["class"] ? o["class"].split(/\s+/) : [],
							styles: i,
							children: []
						};
					}
					o = CKEDITOR.tools.clone(i);
					var k = [];
					var n;
					if (d !== false && (n = this._.transformations[i.name])) {
						h = 0;
						for (; h < n.length; ++h) {
							l$$0(this, i, n[h]);
						}
						j$$0(i);
					}
					a$$1(this)(o, this._.rules, d === false ? false : this._.transformations, k, false, !c, !c);
					d = k.length > 0 ? false : CKEDITOR.tools.objectCompare(i.attributes, o.attributes, true) ? true : false;
					if (typeof b == "string") {
						this._.cachedChecks[f] = d;
					}
					return d;
				},
				getAllowedEnterMode: function() {
					var a = ["p", "div", "br"];
					var b = {
						p: CKEDITOR.ENTER_P,
						div: CKEDITOR.ENTER_DIV,
						br: CKEDITOR.ENTER_BR
					};
					return function(d, c) {
						var e = a.slice();
						var h;
						if (this.check(x$$0[d])) {
							return d;
						}
						if (!c) {
							e = e.reverse();
						}
						for (; h = e.pop();) {
							if (this.check(h)) {
								return b[h];
							}
						}
						return CKEDITOR.ENTER_BR;
					};
				}()
			};
			var B$$0 = {
				styles: 1,
				attributes: 1,
				classes: 1
			};
			var H = {
				styles: "requiredStyles",
				attributes: "requiredAttributes",
				classes: "requiredClasses"
			};
			var F$$0 = /^([a-z0-9*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i;
			var O = {
				styles: /{([^}]+)}/,
				attrs: /\[([^\]]+)\]/,
				classes: /\(([^\)]+)\)/
			};
			var G = CKEDITOR.filter.transformationsTools = {
				sizeToStyle: function(a) {
					this.lengthToStyle(a, "width");
					this.lengthToStyle(a, "height");
				},
				sizeToAttribute: function(a) {
					this.lengthToAttribute(a, "width");
					this.lengthToAttribute(a, "height");
				},
				lengthToStyle: function(a, b, d) {
					d = d || b;
					if (!(d in a.styles)) {
						var c = a.attributes[b];
						if (c) {
							if (/^\d+$/.test(c)) {
								c = c + "px";
							}
							a.styles[d] = c;
						}
					}
					delete a.attributes[b];
				},
				lengthToAttribute: function(a, b, d) {
					d = d || b;
					if (!(d in a.attributes)) {
						var c = a.styles[b];
						var e = c && c.match(/^(\d+)(?:\.\d*)?px$/);
						if (e) {
							a.attributes[d] = e[1];
						} else {
							if (c == u$$0) {
								a.attributes[d] = u$$0;
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
				matchesStyle: r$$0,
				transform: function(a, b) {
					if (typeof b == "string") {
						a.name = b;
					} else {
						var d = b.getDefinition();
						var c = d.styles;
						var e = d.attributes;
						var h;
						var i;
						var g;
						var f;
						a.name = d.element;
						for (h in e) {
							if (h == "class") {
								d = a.classes.join("|");
								g = e[h].split(/\s+/);
								for (; f = g.pop();) {
									if (d.indexOf(f) == -1) {
										a.classes.push(f);
									}
								}
							} else {
								a.attributes[h] = e[h];
							}
						}
						for (i in c) {
							a.styles[i] = c[i];
						}
					}
				}
			};
		})();
		(function() {
			CKEDITOR.focusManager = function(b) {
				if (b.focusManager) {
					return b.focusManager;
				}
				this.hasFocus = false;
				this.currentActive = null;
				this._ = {
					editor: b
				};
				return this;
			};
			CKEDITOR.focusManager._ = {
				blurDelay: 200
			};
			CKEDITOR.focusManager.prototype = {
				focus: function(b) {
					if (this._.timer) {
						clearTimeout(this._.timer);
					}
					if (b) {
						this.currentActive = b;
					}
					if (!this.hasFocus && !this._.locked) {
						if (b = CKEDITOR.currentInstance) {
							b.focusManager.blur(1);
						}
						this.hasFocus = true;
						if (b = this._.editor.container) {
							b.addClass("cke_focus");
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
				blur: function(b) {
					function f() {
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
						var c = CKEDITOR.focusManager._.blurDelay;
						if (b || !c) {
							f.call(this);
						} else {
							this._.timer = CKEDITOR.tools.setTimeout(function() {
								delete this._.timer;
								f.call(this);
							}, c, this);
						}
					}
				},
				add: function(b, f) {
					var c = b.getCustomData("focusmanager");
					if (!c || c != this) {
						if (c) {
							c.remove(b);
						}
						c = "focus";
						var a = "blur";
						if (f) {
							if (CKEDITOR.env.ie) {
								c = "focusin";
								a = "focusout";
							} else {
								CKEDITOR.event.useCapture = 1;
							}
						}
						var d = {
							blur: function() {
								if (b.equals(this.currentActive)) {
									this.blur();
								}
							},
							focus: function() {
								this.focus(b);
							}
						};
						b.on(c, d.focus, this);
						b.on(a, d.blur, this);
						if (f) {
							CKEDITOR.event.useCapture = 0;
						}
						b.setCustomData("focusmanager", this);
						b.setCustomData("focusmanager_handlers", d);
					}
				},
				remove: function(b) {
					b.removeCustomData("focusmanager");
					var f = b.removeCustomData("focusmanager_handlers");
					b.removeListener("blur", f.blur);
					b.removeListener("focus", f.focus);
				}
			};
		})();
		CKEDITOR.keystrokeHandler = function(b) {
			if (b.keystrokeHandler) {
				return b.keystrokeHandler;
			}
			this.keystrokes = {};
			this.blockedKeystrokes = {};
			this._ = {
				editor: b
			};
			return this;
		};
		(function() {
			var b;
			var f = function(a) {
				a = a.data;
				var d = a.getKeystroke();
				var c = this.keystrokes[d];
				var g = this._.editor;
				b = g.fire("key", {
					keyCode: d
				}) === false;
				if (!b) {
					if (c) {
						b = g.execCommand(c, {
							from: "keystrokeHandler"
						}) !== false;
					}
					if (!b) {
						b = !!this.blockedKeystrokes[d];
					}
				}
				if (b) {
					a.preventDefault(true);
				}
				return !b;
			};
			var c$$0 = function(a) {
				if (b) {
					b = false;
					a.data.preventDefault(true);
				}
			};
			CKEDITOR.keystrokeHandler.prototype = {
				attach: function(a) {
					a.on("keydown", f, this);
					if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac) {
						a.on("keypress", c$$0, this);
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
				load: function(b, f, c) {
					if (!b || !CKEDITOR.lang.languages[b]) {
						b = this.detect(f, b);
					}
					if (this[b]) {
						c(b, this[b]);
					} else {
						CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("lang/" + b + ".js"), function() {
							this[b].dir = this.rtl[b] ? "rtl" : "ltr";
							c(b, this[b]);
						}, this);
					}
				},
				detect: function(b, f) {
					var c = this.languages;
					f = f || (navigator.userLanguage || (navigator.language || b));
					var a$$0 = f.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/);
					var d = a$$0[1];
					a$$0 = a$$0[2];
					if (c[d + "-" + a$$0]) {
						d = d + "-" + a$$0;
					} else {
						if (!c[d]) {
							d = null;
						}
					}
					CKEDITOR.lang.detect = d ? function() {
						return d;
					} : function(a) {
						return a;
					};
					return d || b;
				}
			};
		})();
		CKEDITOR.scriptLoader = function() {
			var b$$0 = {};
			var f = {};
			return {
				load: function(c$$0, a$$0, d$$0, e$$0) {
					var g = typeof c$$0 == "string";
					if (g) {
						c$$0 = [c$$0];
					}
					if (!d$$0) {
						d$$0 = CKEDITOR;
					}
					var i = c$$0.length;
					var h = [];
					var j = [];
					var k = function(b) {
						if (a$$0) {
							if (g) {
								a$$0.call(d$$0, b);
							} else {
								a$$0.call(d$$0, h, j);
							}
						}
					};
					if (i === 0) {
						k(true);
					} else {
						var n = function(a, b) {
							(b ? h : j).push(a);
							if (--i <= 0) {
								if (e$$0) {
									CKEDITOR.document.getDocumentElement().removeStyle("cursor");
								}
								k(b);
							}
						};
						var m = function(a, d) {
							b$$0[a] = 1;
							var c = f[a];
							delete f[a];
							var e = 0;
							for (; e < c.length; e++) {
								c[e](a, d);
							}
						};
						var q = function(d) {
							if (b$$0[d]) {
								n(d, true);
							} else {
								var c = f[d] || (f[d] = []);
								c.push(n);
								if (!(c.length > 1)) {
									var e = new CKEDITOR.dom.element("script");
									e.setAttributes({
										type: "text/javascript",
										src: d
									});
									if (a$$0) {
										if (CKEDITOR.env.ie && CKEDITOR.env.version < 11) {
											e.$.onreadystatechange = function() {
												if (e.$.readyState == "loaded" || e.$.readyState == "complete") {
													e.$.onreadystatechange = null;
													m(d, true);
												}
											};
										} else {
											e.$.onload = function() {
												setTimeout(function() {
													m(d, true);
												}, 0);
											};
											e.$.onerror = function() {
												m(d, false);
											};
										}
									}
									e.appendTo(CKEDITOR.document.getHead());
								}
							}
						};
						if (e$$0) {
							CKEDITOR.document.getDocumentElement().setStyle("cursor", "wait");
						}
						var o = 0;
						for (; o < i; o++) {
							q(c$$0[o]);
						}
					}
				},
				queue: function() {
					function b() {
						var d;
						if (d = a[0]) {
							this.load(d.scriptUrl, d.callback, CKEDITOR, 0);
						}
					}
					var a = [];
					return function(d, e) {
						var g = this;
						a.push({
							scriptUrl: d,
							callback: function() {
								if (e) {
									e.apply(this, arguments);
								}
								a.shift();
								b.call(g);
							}
						});
						if (a.length == 1) {
							b.call(this);
						}
					};
				}()
			};
		}();
		CKEDITOR.resourceManager = function(b, f) {
			this.basePath = b;
			this.fileName = f;
			this.registered = {};
			this.loaded = {};
			this.externals = {};
			this._ = {
				waitingList: {}
			};
		};
		CKEDITOR.resourceManager.prototype = {
			add: function(b, f) {
				if (this.registered[b]) {
					throw '[CKEDITOR.resourceManager.add] The resource name "' + b + '" is already registered.';
				}
				var c = this.registered[b] = f || {};
				c.name = b;
				c.path = this.getPath(b);
				CKEDITOR.fire(b + CKEDITOR.tools.capitalize(this.fileName) + "Ready", c);
				return this.get(b);
			},
			get: function(b) {
				return this.registered[b] || null;
			},
			getPath: function(b) {
				var f = this.externals[b];
				return CKEDITOR.getUrl(f && f.dir || this.basePath + b + "/");
			},
			getFilePath: function(b) {
				var f = this.externals[b];
				return CKEDITOR.getUrl(this.getPath(b) + (f ? f.file : this.fileName + ".js"));
			},
			addExternal: function(b, f, c) {
				b = b.split(",");
				var a$$0 = 0;
				for (; a$$0 < b.length; a$$0++) {
					var d = b[a$$0];
					if (!c) {
						f = f.replace(/[^\/]+$/, function(a) {
							c = a;
							return "";
						});
					}
					this.externals[d] = {
						dir: f,
						file: c || this.fileName + ".js"
					};
				}
			},
			load: function(b$$0, f, c) {
				if (!CKEDITOR.tools.isArray(b$$0)) {
					b$$0 = b$$0 ? [b$$0] : [];
				}
				var a = this.loaded;
				var d$$0 = this.registered;
				var e$$0 = [];
				var g = {};
				var i = {};
				var h$$0 = 0;
				for (; h$$0 < b$$0.length; h$$0++) {
					var j$$0 = b$$0[h$$0];
					if (j$$0) {
						if (!a[j$$0] && !d$$0[j$$0]) {
							var k$$0 = this.getFilePath(j$$0);
							e$$0.push(k$$0);
							if (!(k$$0 in g)) {
								g[k$$0] = [];
							}
							g[k$$0].push(j$$0);
						} else {
							i[j$$0] = this.get(j$$0);
						}
					}
				}
				CKEDITOR.scriptLoader.load(e$$0, function(b, d) {
					if (d.length) {
						throw '[CKEDITOR.resourceManager.load] Resource name "' + g[d[0]].join(",") + '" was not found at "' + d[0] + '".';
					}
					var e = 0;
					for (; e < b.length; e++) {
						var h = g[b[e]];
						var j = 0;
						for (; j < h.length; j++) {
							var k = h[j];
							i[k] = this.get(k);
							a[k] = 1;
						}
					}
					f.call(c, i);
				}, this);
			}
		};
		CKEDITOR.plugins = new CKEDITOR.resourceManager("plugins/", "plugin");
		CKEDITOR.plugins.load = CKEDITOR.tools.override(CKEDITOR.plugins.load, function(b$$0) {
			var f = {};
			return function(c$$1, a, d) {
				var e = {};
				var g = function(c$$0) {
					b$$0.call(this, c$$0, function(b) {
						CKEDITOR.tools.extend(e, b);
						var c = [];
						var i;
						for (i in b) {
							var n = b[i];
							var m = n && n.requires;
							if (!f[i]) {
								if (n.icons) {
									var q = n.icons.split(",");
									var o = q.length;
									for (; o--;) {
										CKEDITOR.skin.addIcon(q[o], n.path + "icons/" + (CKEDITOR.env.hidpi && n.hidpi ? "hidpi/" : "") + q[o] + ".png");
									}
								}
								f[i] = 1;
							}
							if (m) {
								if (m.split) {
									m = m.split(",");
								}
								n = 0;
								for (; n < m.length; n++) {
									if (!e[m[n]]) {
										c.push(m[n]);
									}
								}
							}
						}
						if (c.length) {
							g.call(this, c);
						} else {
							for (i in e) {
								n = e[i];
								if (n.onLoad && !n.onLoad._called) {
									if (n.onLoad() === false) {
										delete e[i];
									}
									n.onLoad._called = 1;
								}
							}
							if (a) {
								a.call(d || window, e);
							}
						}
					}, this);
				};
				g.call(this, c$$1);
			};
		});
		CKEDITOR.plugins.setLang = function(b, f, c) {
			var a = this.get(b);
			b = a.langEntries || (a.langEntries = {});
			a = a.lang || (a.lang = []);
			if (a.split) {
				a = a.split(",");
			}
			if (CKEDITOR.tools.indexOf(a, f) == -1) {
				a.push(f);
			}
			b[f] = c;
		};
		CKEDITOR.ui = function(b) {
			if (b.ui) {
				return b.ui;
			}
			this.items = {};
			this.instances = {};
			this.editor = b;
			this._ = {
				handlers: {}
			};
			return this;
		};
		CKEDITOR.ui.prototype = {
			add: function(b, f, c) {
				c.name = b.toLowerCase();
				var a = this.items[b] = {
					type: f,
					command: c.command || null,
					args: Array.prototype.slice.call(arguments, 2)
				};
				CKEDITOR.tools.extend(a, c);
			},
			get: function(b) {
				return this.instances[b];
			},
			create: function(b) {
				var f = this.items[b];
				var c = f && this._.handlers[f.type];
				var a = f && (f.command && this.editor.getCommand(f.command));
				c = c && c.create.apply(this, f.args);
				this.instances[b] = c;
				if (a) {
					a.uiItems.push(c);
				}
				if (c && !c.type) {
					c.type = f.type;
				}
				return c;
			},
			addHandler: function(b, f) {
				this._.handlers[b] = f;
			},
			space: function(b) {
				return CKEDITOR.document.getById(this.spaceId(b));
			},
			spaceId: function(b) {
				return this.editor.id + "_" + b;
			}
		};
		CKEDITOR.event.implementOn(CKEDITOR.ui);
		(function() {
			function b$$1(a$$0, b, e) {
				CKEDITOR.event.call(this);
				a$$0 = a$$0 && CKEDITOR.tools.clone(a$$0);
				if (b !== void 0) {
					if (b instanceof CKEDITOR.dom.element) {
						if (!e) {
							throw Error("One of the element modes must be specified.");
						}
					} else {
						throw Error("Expect element of type CKEDITOR.dom.element.");
					}
					if (CKEDITOR.env.ie && (CKEDITOR.env.quirks && e == CKEDITOR.ELEMENT_MODE_INLINE)) {
						throw Error("Inline element mode is not supported on IE quirks.");
					}
					if (!(e == CKEDITOR.ELEMENT_MODE_INLINE ? b.is(CKEDITOR.dtd.$editable) || b.is("textarea") : e == CKEDITOR.ELEMENT_MODE_REPLACE ? !b.is(CKEDITOR.dtd.$nonBodyContent) : 1)) {
						throw Error('The specified element mode is not supported on element: "' + b.getName() + '".');
					}
					this.element = b;
					this.elementMode = e;
					this.name = this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO && (b.getId() || b.getNameAtt());
				} else {
					this.elementMode = CKEDITOR.ELEMENT_MODE_NONE;
				}
				this._ = {};
				this.commands = {};
				this.templates = {};
				this.name = this.name || f$$0();
				this.id = CKEDITOR.tools.getNextId();
				this.status = "unloaded";
				this.config = CKEDITOR.tools.prototypedCopy(CKEDITOR.config);
				this.ui = new CKEDITOR.ui(this);
				this.focusManager = new CKEDITOR.focusManager(this);
				this.keystrokeHandler = new CKEDITOR.keystrokeHandler(this);
				this.on("readOnly", c$$1);
				this.on("selectionChange", function(a) {
					d$$2(this, a.data.path);
				});
				this.on("activeFilterChange", function() {
					d$$2(this, this.elementPath(), true);
				});
				this.on("mode", c$$1);
				this.on("instanceReady", function() {
					if (this.config.startupFocus) {
						this.focus();
					}
				});
				CKEDITOR.fire("instanceCreated", null, this);
				CKEDITOR.add(this);
				CKEDITOR.tools.setTimeout(function() {
					g$$1(this, a$$0);
				}, 0, this);
			}

			function f$$0() {
				do {
					var a = "editor" + ++m
				} while (CKEDITOR.instances[a]);
				return a;
			}

			function c$$1() {
				var b = this.commands;
				var d;
				for (d in b) {
					a$$1(this, b[d]);
				}
			}

			function a$$1(a, b) {
				b[b.startDisabled ? "disable" : a.readOnly && !b.readOnly ? "disable" : b.modes[a.mode] ? "enable" : "disable"]();
			}

			function d$$2(a, b, d) {
				if (b) {
					var c;
					var e;
					var h = a.commands;
					for (e in h) {
						c = h[e];
						if (d || c.contextSensitive) {
							c.refresh(a, b);
						}
					}
				}
			}

			function e$$1(a) {
				var b = a.config.customConfig;
				if (!b) {
					return false;
				}
				b = CKEDITOR.getUrl(b);
				var d = q[b] || (q[b] = {});
				if (d.fn) {
					d.fn.call(a, a.config);
					if (CKEDITOR.getUrl(a.config.customConfig) == b || !e$$1(a)) {
						a.fireOnce("customConfigLoaded");
					}
				} else {
					CKEDITOR.scriptLoader.queue(b, function() {
						d.fn = CKEDITOR.editorConfig ? CKEDITOR.editorConfig : function() {};
						e$$1(a);
					});
				}
				return true;
			}

			function g$$1(a, b) {
				a.on("customConfigLoaded", function() {
					if (b) {
						if (b.on) {
							var d;
							for (d in b.on) {
								a.on(d, b.on[d]);
							}
						}
						CKEDITOR.tools.extend(a.config, b, true);
						delete a.config.on;
					}
					d = a.config;
					a.readOnly = !(!d.readOnly && !(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.is("textarea") ? a.element.hasAttribute("disabled") : a.element.isReadOnly() : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && a.element.hasAttribute("disabled")));
					a.blockless = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? !(a.element.is("textarea") || CKEDITOR.dtd[a.element.getName()].p) : false;
					a.tabIndex = d.tabIndex || (a.element && a.element.getAttribute("tabindex") || 0);
					a.activeEnterMode = a.enterMode = a.blockless ? CKEDITOR.ENTER_BR : d.enterMode;
					a.activeShiftEnterMode = a.shiftEnterMode = a.blockless ? CKEDITOR.ENTER_BR : d.shiftEnterMode;
					if (d.skin) {
						CKEDITOR.skinName = d.skin;
					}
					a.fireOnce("configLoaded");
					a.dataProcessor = new CKEDITOR.htmlDataProcessor(a);
					a.filter = a.activeFilter = new CKEDITOR.filter(a);
					i$$1(a);
				});
				if (b && b.customConfig != void 0) {
					a.config.customConfig = b.customConfig;
				}
				if (!e$$1(a)) {
					a.fireOnce("customConfigLoaded");
				}
			}

			function i$$1(a) {
				CKEDITOR.skin.loadPart("editor", function() {
					h$$2(a);
				});
			}

			function h$$2(a) {
				CKEDITOR.lang.load(a.config.language, a.config.defaultLanguage, function(b, d) {
					var c = a.config.title;
					a.langCode = b;
					a.lang = CKEDITOR.tools.prototypedCopy(d);
					a.title = typeof c == "string" || c === false ? c : [a.lang.editor, a.name].join(", ");
					if (CKEDITOR.env.gecko && (CKEDITOR.env.version < 10900 && a.lang.dir == "rtl")) {
						a.lang.dir = "ltr";
					}
					if (!a.config.contentsLangDirection) {
						a.config.contentsLangDirection = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.getDirection(1) : a.lang.dir;
					}
					a.fire("langLoaded");
					j$$0(a);
				});
			}

			function j$$0(a) {
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
				var d$$1 = b$$0.plugins;
				var c$$0 = b$$0.extraPlugins;
				var e$$0 = b$$0.removePlugins;
				if (c$$0) {
					var h$$1 = RegExp("(?:^|,)(?:" + c$$0.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g");
					d$$1 = d$$1.replace(h$$1, "");
					d$$1 = d$$1 + ("," + c$$0);
				}
				if (e$$0) {
					var i$$0 = RegExp("(?:^|,)(?:" + e$$0.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g");
					d$$1 = d$$1.replace(i$$0, "");
				}
				if (CKEDITOR.env.air) {
					d$$1 = d$$1 + ",adobeair";
				}
				CKEDITOR.plugins.load(d$$1.split(","), function(d$$0) {
					var c = [];
					var e = [];
					var h$$0 = [];
					a$$0.plugins = d$$0;
					var g$$0;
					for (g$$0 in d$$0) {
						var f = d$$0[g$$0];
						var j = f.lang;
						var k = null;
						var n = f.requires;
						var t;
						if (CKEDITOR.tools.isArray(n)) {
							n = n.join(",");
						}
						if (n && (t = n.match(i$$0))) {
							for (; n = t.pop();) {
								CKEDITOR.tools.setTimeout(function(a, b) {
									throw Error('Plugin "' + a.replace(",", "") + '" cannot be removed from the plugins list, because it\'s required by "' + b + '" plugin.');
								}, 0, null, [n, g$$0]);
							}
						}
						if (j && !a$$0.lang[g$$0]) {
							if (j.split) {
								j = j.split(",");
							}
							if (CKEDITOR.tools.indexOf(j, a$$0.langCode) >= 0) {
								k = a$$0.langCode;
							} else {
								k = a$$0.langCode.replace(/-.*/, "");
								k = k != a$$0.langCode && CKEDITOR.tools.indexOf(j, k) >= 0 ? k : CKEDITOR.tools.indexOf(j, "en") >= 0 ? "en" : j[0];
							}
							if (!f.langEntries || !f.langEntries[k]) {
								h$$0.push(CKEDITOR.getUrl(f.path + "lang/" + k + ".js"));
							} else {
								a$$0.lang[g$$0] = f.langEntries[k];
								k = null;
							}
						}
						e.push(k);
						c.push(f);
					}
					CKEDITOR.scriptLoader.load(h$$0, function() {
						var d = ["beforeInit", "init", "afterInit"];
						var h = 0;
						for (; h < d.length; h++) {
							var i = 0;
							for (; i < c.length; i++) {
								var g = c[i];
								if (h === 0) {
									if (e[i] && (g.lang && g.langEntries)) {
										a$$0.lang[g.name] = g.langEntries[e[i]];
									}
								}
								if (g[d[h]]) {
									g[d[h]](a$$0);
								}
							}
						}
						a$$0.fireOnce("pluginsLoaded");
						if (b$$0.keystrokes) {
							a$$0.setKeystroke(a$$0.config.keystrokes);
						}
						i = 0;
						for (; i < a$$0.config.blockedKeystrokes.length; i++) {
							a$$0.keystrokeHandler.blockedKeystrokes[a$$0.config.blockedKeystrokes[i]] = 1;
						}
						a$$0.status = "loaded";
						a$$0.fireOnce("loaded");
						CKEDITOR.fire("instanceLoaded", null, a$$0);
					});
				});
			}

			function n$$0() {
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
			b$$1.prototype = CKEDITOR.editor.prototype;
			CKEDITOR.editor = b$$1;
			var m = 0;
			var q = {};
			CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
				addCommand: function(b, d) {
					d.name = b.toLowerCase();
					var c = new CKEDITOR.command(this, d);
					if (this.mode) {
						a$$1(this, c);
					}
					return this.commands[b] = c;
				},
				_attachToForm: function() {
					var a$$0 = this;
					var b = a$$0.element;
					var d$$0 = new CKEDITOR.dom.element(b.$.form);
					if (b.is("textarea") && d$$0) {
						var c = function(d) {
							a$$0.updateElement();
							if (a$$0._.required) {
								if (!b.getValue() && a$$0.fire("required") === false) {
									d.data.preventDefault();
								}
							}
						};
						d$$0.on("submit", c);
						if (d$$0.$.submit && (d$$0.$.submit.call && d$$0.$.submit.apply)) {
							d$$0.$.submit = CKEDITOR.tools.override(d$$0.$.submit, function(a) {
								return function() {
									c();
									if (a.apply) {
										a.apply(this);
									} else {
										a();
									}
								};
							});
						}
						a$$0.on("destroy", function() {
							d$$0.removeListener("submit", c);
						});
					}
				},
				destroy: function(a) {
					this.fire("beforeDestroy");
					if (!a) {
						n$$0.call(this);
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
					var d = this.getCommand(a);
					var c = {
						name: a,
						commandData: b,
						command: d
					};
					if (d && (d.state != CKEDITOR.TRISTATE_DISABLED && this.fire("beforeCommandExec", c) !== false)) {
						c.returnValue = d.exec(c.commandData);
						if (!d.async && this.fire("afterCommandExec", c) !== false) {
							return c.returnValue;
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
				setData: function(a$$0, b, d) {
					if (b) {
						this.on("dataReady", function(a) {
							a.removeListener();
							b.call(a.editor);
						});
					}
					a$$0 = {
						dataValue: a$$0
					};
					if (!d) {
						this.fire("setData", a$$0);
					}
					this._.data = a$$0.dataValue;
					if (!d) {
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
					return n$$0.call(this);
				},
				setKeystroke: function() {
					var a = this.keystrokeHandler.keystrokes;
					var b = CKEDITOR.tools.isArray(arguments[0]) ? arguments[0] : [
						[].slice.call(arguments, 0)
					];
					var d;
					var c;
					var e = b.length;
					for (; e--;) {
						d = b[e];
						c = 0;
						if (CKEDITOR.tools.isArray(d)) {
							c = d[1];
							d = d[0];
						}
						if (c) {
							a[d] = c;
						} else {
							delete a[d];
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
			var b = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g;
			var f = {
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
				parse: function(c) {
					var a;
					var d;
					var e = 0;
					var g;
					for (; a = this._.htmlPartsRegex.exec(c);) {
						d = a.index;
						if (d > e) {
							e = c.substring(e, d);
							if (g) {
								g.push(e);
							} else {
								this.onText(e);
							}
						}
						e = this._.htmlPartsRegex.lastIndex;
						if (d = a[1]) {
							d = d.toLowerCase();
							if (g && CKEDITOR.dtd.$cdata[d]) {
								this.onCDATA(g.join(""));
								g = null;
							}
							if (!g) {
								this.onTagClose(d);
								continue;
							}
						}
						if (g) {
							g.push(a[0]);
						} else {
							if (d = a[3]) {
								d = d.toLowerCase();
								if (!/="/.test(d)) {
									var i = {};
									var h;
									a = a[4];
									var j = !!(a && a.charAt(a.length - 1) == "/");
									if (a) {
										for (; h = b.exec(a);) {
											var k = h[1].toLowerCase();
											h = h[2] || (h[3] || (h[4] || ""));
											i[k] = !h && f[k] ? k : CKEDITOR.tools.htmlDecodeAttr(h);
										}
									}
									this.onTagOpen(d, i, j);
									if (!g) {
										if (CKEDITOR.dtd.$cdata[d]) {
											g = [];
										}
									}
								}
							} else {
								if (d = a[2]) {
									this.onComment(d);
								}
							}
						}
					}
					if (c.length > e) {
						this.onText(c.substring(e, c.length));
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
				openTag: function(b) {
					this._.output.push("<", b);
				},
				openTagClose: function(b, f) {
					if (f) {
						this._.output.push(" />");
					} else {
						this._.output.push(">");
					}
				},
				attribute: function(b, f) {
					if (typeof f == "string") {
						f = CKEDITOR.tools.htmlEncodeAttr(f);
					}
					this._.output.push(" ", b, '="', f, '"');
				},
				closeTag: function(b) {
					this._.output.push("</", b, ">");
				},
				text: function(b) {
					this._.output.push(b);
				},
				comment: function(b) {
					this._.output.push("\x3c!--", b, "--\x3e");
				},
				write: function(b) {
					this._.output.push(b);
				},
				reset: function() {
					this._.output = [];
					this._.indent = false;
				},
				getHtml: function(b) {
					var f = this._.output.join("");
					if (b) {
						this.reset();
					}
					return f;
				}
			}
		});
		"use strict";
		(function() {
			CKEDITOR.htmlParser.node = function() {};
			CKEDITOR.htmlParser.node.prototype = {
				remove: function() {
					var b = this.parent.children;
					var f = CKEDITOR.tools.indexOf(b, this);
					var c = this.previous;
					var a = this.next;
					if (c) {
						c.next = a;
					}
					if (a) {
						a.previous = c;
					}
					b.splice(f, 1);
					this.parent = null;
				},
				replaceWith: function(b) {
					var f = this.parent.children;
					var c = CKEDITOR.tools.indexOf(f, this);
					var a = b.previous = this.previous;
					var d = b.next = this.next;
					if (a) {
						a.next = b;
					}
					if (d) {
						d.previous = b;
					}
					f[c] = b;
					b.parent = this.parent;
					this.parent = null;
				},
				insertAfter: function(b) {
					var f = b.parent.children;
					var c = CKEDITOR.tools.indexOf(f, b);
					var a = b.next;
					f.splice(c + 1, 0, this);
					this.next = b.next;
					this.previous = b;
					b.next = this;
					if (a) {
						a.previous = this;
					}
					this.parent = b.parent;
				},
				insertBefore: function(b) {
					var f = b.parent.children;
					var c = CKEDITOR.tools.indexOf(f, b);
					f.splice(c, 0, this);
					this.next = b;
					if (this.previous = b.previous) {
						b.previous.next = this;
					}
					b.previous = this;
					this.parent = b.parent;
				},
				getAscendant: function(b) {
					var f = typeof b == "function" ? b : typeof b == "string" ? function(a) {
						return a.name == b;
					} : function(a) {
						return a.name in b;
					};
					var c = this.parent;
					for (; c && c.type == CKEDITOR.NODE_ELEMENT;) {
						if (f(c)) {
							return c;
						}
						c = c.parent;
					}
					return null;
				},
				wrapWith: function(b) {
					this.replaceWith(b);
					b.add(this);
					return b;
				},
				getIndex: function() {
					return CKEDITOR.tools.indexOf(this.parent.children, this);
				},
				getFilterContext: function(b) {
					return b || {};
				}
			};
		})();
		"use strict";
		CKEDITOR.htmlParser.comment = function(b) {
			this.value = b;
			this._ = {
				isBlockLike: false
			};
		};
		CKEDITOR.htmlParser.comment.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
			type: CKEDITOR.NODE_COMMENT,
			filter: function(b, f) {
				var c = this.value;
				if (!(c = b.onComment(f, c, this))) {
					this.remove();
					return false;
				}
				if (typeof c != "string") {
					this.replaceWith(c);
					return false;
				}
				this.value = c;
				return true;
			},
			writeHtml: function(b, f) {
				if (f) {
					this.filter(f);
				}
				b.comment(this.value);
			}
		});
		"use strict";
		(function() {
			CKEDITOR.htmlParser.text = function(b) {
				this.value = b;
				this._ = {
					isBlockLike: false
				};
			};
			CKEDITOR.htmlParser.text.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
				type: CKEDITOR.NODE_TEXT,
				filter: function(b, f) {
					if (!(this.value = b.onText(f, this.value, this))) {
						this.remove();
						return false;
					}
				},
				writeHtml: function(b, f) {
					if (f) {
						this.filter(f);
					}
					b.text(this.value);
				}
			});
		})();
		"use strict";
		(function() {
			CKEDITOR.htmlParser.cdata = function(b) {
				this.value = b;
			};
			CKEDITOR.htmlParser.cdata.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
				type: CKEDITOR.NODE_TEXT,
				filter: function() {},
				writeHtml: function(b) {
					b.write(this.value);
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
			function b$$0(a) {
				return a.attributes["data-cke-survive"] ? false : a.name == "a" && a.attributes.href || CKEDITOR.dtd.$removeEmpty[a.name];
			}
			var f = CKEDITOR.tools.extend({
				table: 1,
				ul: 1,
				ol: 1,
				dl: 1
			}, CKEDITOR.dtd.table, CKEDITOR.dtd.ul, CKEDITOR.dtd.ol, CKEDITOR.dtd.dl);
			var c$$0 = {
				ol: 1,
				ul: 1
			};
			var a$$0 = CKEDITOR.tools.extend({}, {
				html: 1
			}, CKEDITOR.dtd.html, CKEDITOR.dtd.body, CKEDITOR.dtd.head, {
				style: 1,
				script: 1
			});
			CKEDITOR.htmlParser.fragment.fromHtml = function(d$$0, e$$0, g$$0) {
				function i$$0(a) {
					var b;
					if (l.length > 0) {
						var d = 0;
						for (; d < l.length; d++) {
							var c = l[d];
							var e = c.name;
							var i = CKEDITOR.dtd[e];
							var g = p.name && CKEDITOR.dtd[p.name];
							if ((!g || g[e]) && (!a || (!i || (i[a] || !CKEDITOR.dtd[a])))) {
								if (!b) {
									h();
									b = 1;
								}
								c = c.clone();
								c.parent = p;
								p = c;
								l.splice(d, 1);
								d--;
							} else {
								if (e == p.name) {
									k(p, p.parent, 1);
									d--;
								}
							}
						}
					}
				}

				function h() {
					for (; r.length;) {
						k(r.shift(), p);
					}
				}

				function j$$0(a) {
					if (a._.isBlockLike && (a.name != "pre" && a.name != "textarea")) {
						var b = a.children.length;
						var d = a.children[b - 1];
						var c;
						if (d && d.type == CKEDITOR.NODE_TEXT) {
							if (c = CKEDITOR.tools.rtrim(d.value)) {
								d.value = c;
							} else {
								a.children.length = b - 1;
							}
						}
					}
				}

				function k(a, d, c) {
					d = d || (p || o);
					var e = p;
					if (a.previous === void 0) {
						if (n(d, a)) {
							p = d;
							q.onTagOpen(g$$0, {});
							a.returnPoint = d = p;
						}
						j$$0(a);
						if (!b$$0(a) || a.children.length) {
							d.add(a);
						}
						if (a.name == "pre") {
							w = false;
						}
						if (a.name == "textarea") {
							t = false;
						}
					}
					if (a.returnPoint) {
						p = a.returnPoint;
						delete a.returnPoint;
					} else {
						p = c ? d : e;
					}
				}

				function n(a, b) {
					if ((a == o || a.name == "body") && (g$$0 && (!a.name || CKEDITOR.dtd[a.name][g$$0]))) {
						var d;
						var c;
						return (d = b.attributes && (c = b.attributes["data-cke-real-element-type"]) ? c : b.name) && (d in CKEDITOR.dtd.$inline && (!(d in CKEDITOR.dtd.head) && !b.isOrphan)) || b.type == CKEDITOR.NODE_TEXT;
					}
				}

				function m(a, b) {
					return a in CKEDITOR.dtd.$listItem || a in CKEDITOR.dtd.$tableContent ? a == b || (a == "dt" && b == "dd" || a == "dd" && b == "dt") : false;
				}
				var q = new CKEDITOR.htmlParser;
				var o = e$$0 instanceof CKEDITOR.htmlParser.element ? e$$0 : typeof e$$0 == "string" ? new CKEDITOR.htmlParser.element(e$$0) : new CKEDITOR.htmlParser.fragment;
				var l = [];
				var r = [];
				var p = o;
				var t = o.name == "textarea";
				var w = o.name == "pre";
				q.onTagOpen = function(d, e, g, j) {
					e = new CKEDITOR.htmlParser.element(d, e);
					if (e.isUnknown && g) {
						e.isEmpty = true;
					}
					e.isOptionalClose = j;
					if (b$$0(e)) {
						l.push(e);
					} else {
						if (d == "pre") {
							w = true;
						} else {
							if (d == "br" && w) {
								p.add(new CKEDITOR.htmlParser.text("\n"));
								return;
							}
							if (d == "textarea") {
								t = true;
							}
						}
						if (d == "br") {
							r.push(e);
						} else {
							for (;;) {
								j = (g = p.name) ? CKEDITOR.dtd[g] || (p._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : a$$0;
								if (!e.isUnknown && (!p.isUnknown && !j[d])) {
									if (p.isOptionalClose) {
										q.onTagClose(g);
									} else {
										if (d in c$$0 && g in c$$0) {
											g = p.children;
											if (!((g = g[g.length - 1]) && g.name == "li")) {
												k(g = new CKEDITOR.htmlParser.element("li"), p);
											}
											if (!e.returnPoint) {
												e.returnPoint = p;
											}
											p = g;
										} else {
											if (d in CKEDITOR.dtd.$listItem && !m(d, g)) {
												q.onTagOpen(d == "li" ? "ul" : "dl", {}, 0, 1);
											} else {
												if (g in f && !m(d, g)) {
													if (!e.returnPoint) {
														e.returnPoint = p;
													}
													p = p.parent;
												} else {
													if (g in CKEDITOR.dtd.$inline) {
														l.unshift(p);
													}
													if (p.parent) {
														k(p, p.parent, 1);
													} else {
														e.isOrphan = 1;
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
							i$$0(d);
							h();
							e.parent = p;
							if (e.isEmpty) {
								k(e);
							} else {
								p = e;
							}
						}
					}
				};
				q.onTagClose = function(a) {
					var b = l.length - 1;
					for (; b >= 0; b--) {
						if (a == l[b].name) {
							l.splice(b, 1);
							return;
						}
					}
					var d = [];
					var c = [];
					var e = p;
					for (; e != o && e.name != a;) {
						if (!e._.isBlockLike) {
							c.unshift(e);
						}
						d.push(e);
						e = e.returnPoint || e.parent;
					}
					if (e != o) {
						b = 0;
						for (; b < d.length; b++) {
							var i = d[b];
							k(i, i.parent);
						}
						p = e;
						if (e._.isBlockLike) {
							h();
						}
						k(e, e.parent);
						if (e == p) {
							p = p.parent;
						}
						l = l.concat(c);
					}
					if (a == "body") {
						g$$0 = false;
					}
				};
				q.onText = function(b) {
					if ((!p._.hasInlineStarted || r.length) && (!w && !t)) {
						b = CKEDITOR.tools.ltrim(b);
						if (b.length === 0) {
							return;
						}
					}
					var d = p.name;
					var e = d ? CKEDITOR.dtd[d] || (p._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : a$$0;
					if (!t && (!e["#"] && d in f)) {
						q.onTagOpen(d in c$$0 ? "li" : d == "dl" ? "dd" : d == "table" ? "tr" : d == "tr" ? "td" : "");
						q.onText(b);
					} else {
						h();
						i$$0();
						if (!w) {
							if (!t) {
								b = b.replace(/[\t\r\n ]{2,}|[\t\r\n]/g, " ");
							}
						}
						b = new CKEDITOR.htmlParser.text(b);
						if (n(p, b)) {
							this.onTagOpen(g$$0, {}, 0, 1);
						}
						p.add(b);
					}
				};
				q.onCDATA = function(a) {
					p.add(new CKEDITOR.htmlParser.cdata(a));
				};
				q.onComment = function(a) {
					h();
					i$$0();
					p.add(new CKEDITOR.htmlParser.comment(a));
				};
				q.parse(d$$0);
				h();
				for (; p != o;) {
					k(p, p.parent, 1);
				}
				j$$0(o);
				return o;
			};
			CKEDITOR.htmlParser.fragment.prototype = {
				type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
				add: function(a, b) {
					if (isNaN(b)) {
						b = this.children.length;
					}
					var c = b > 0 ? this.children[b - 1] : null;
					if (c) {
						if (a._.isBlockLike && c.type == CKEDITOR.NODE_TEXT) {
							c.value = CKEDITOR.tools.rtrim(c.value);
							if (c.value.length === 0) {
								this.children.pop();
								this.add(a);
								return;
							}
						}
						c.next = a;
					}
					a.previous = c;
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
				filterChildren: function(a, b, c) {
					if (this.childrenFilteredBy != a.id) {
						c = this.getFilterContext(c);
						if (b && !this.parent) {
							a.onRoot(c, this);
						}
						this.childrenFilteredBy = a.id;
						b = 0;
						for (; b < this.children.length; b++) {
							if (this.children[b].filter(a, c) === false) {
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
				writeChildrenHtml: function(a, b, c) {
					var i = this.getFilterContext();
					if (c && (!this.parent && b)) {
						b.onRoot(i, this);
					}
					if (b) {
						this.filterChildren(b, false, i);
					}
					b = 0;
					c = this.children;
					i = c.length;
					for (; b < i; b++) {
						c[b].writeHtml(a);
					}
				},
				forEach: function(a, b, c) {
					if (!c && (!b || this.type == b)) {
						var i = a(this)
					}
					if (i !== false) {
						c = this.children;
						var h = 0;
						for (; h < c.length; h++) {
							i = c[h];
							if (i.type == CKEDITOR.NODE_ELEMENT) {
								i.forEach(a, b);
							} else {
								if (!b || i.type == b) {
									a(i);
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
			function b$$0() {
				this.rules = [];
			}

			function f$$0(c, a, d, e) {
				var g;
				var i;
				for (g in a) {
					if (!(i = c[g])) {
						i = c[g] = new b$$0;
					}
					i.add(a[g], d, e);
				}
			}
			CKEDITOR.htmlParser.filter = CKEDITOR.tools.createClass({
				$: function(c) {
					this.id = CKEDITOR.tools.getNextNumber();
					this.elementNameRules = new b$$0;
					this.attributeNameRules = new b$$0;
					this.elementsRules = {};
					this.attributesRules = {};
					this.textRules = new b$$0;
					this.commentRules = new b$$0;
					this.rootRules = new b$$0;
					if (c) {
						this.addRules(c, 10);
					}
				},
				proto: {
					addRules: function(b, a) {
						var d;
						if (typeof a == "number") {
							d = a;
						} else {
							if (a && "priority" in a) {
								d = a.priority;
							}
						}
						if (typeof d != "number") {
							d = 10;
						}
						if (typeof a != "object") {
							a = {};
						}
						if (b.elementNames) {
							this.elementNameRules.addMany(b.elementNames, d, a);
						}
						if (b.attributeNames) {
							this.attributeNameRules.addMany(b.attributeNames, d, a);
						}
						if (b.elements) {
							f$$0(this.elementsRules, b.elements, d, a);
						}
						if (b.attributes) {
							f$$0(this.attributesRules, b.attributes, d, a);
						}
						if (b.text) {
							this.textRules.add(b.text, d, a);
						}
						if (b.comment) {
							this.commentRules.add(b.comment, d, a);
						}
						if (b.root) {
							this.rootRules.add(b.root, d, a);
						}
					},
					applyTo: function(b) {
						b.filter(this);
					},
					onElementName: function(b, a) {
						return this.elementNameRules.execOnName(b, a);
					},
					onAttributeName: function(b, a) {
						return this.attributeNameRules.execOnName(b, a);
					},
					onText: function(b, a) {
						return this.textRules.exec(b, a);
					},
					onComment: function(b, a, d) {
						return this.commentRules.exec(b, a, d);
					},
					onRoot: function(b, a) {
						return this.rootRules.exec(b, a);
					},
					onElement: function(b, a) {
						var d = [this.elementsRules["^"], this.elementsRules[a.name], this.elementsRules.$];
						var e;
						var g = 0;
						for (; g < 3; g++) {
							if (e = d[g]) {
								e = e.exec(b, a, this);
								if (e === false) {
									return null;
								}
								if (e && e != a) {
									return this.onNode(b, e);
								}
								if (a.parent && !a.name) {
									break;
								}
							}
						}
						return a;
					},
					onNode: function(b, a) {
						var d = a.type;
						return d == CKEDITOR.NODE_ELEMENT ? this.onElement(b, a) : d == CKEDITOR.NODE_TEXT ? new CKEDITOR.htmlParser.text(this.onText(b, a.value)) : d == CKEDITOR.NODE_COMMENT ? new CKEDITOR.htmlParser.comment(this.onComment(b, a.value)) : null;
					},
					onAttribute: function(b, a, d, e) {
						return (d = this.attributesRules[d]) ? d.exec(b, e, a, this) : e;
					}
				}
			});
			CKEDITOR.htmlParser.filterRulesGroup = b$$0;
			b$$0.prototype = {
				add: function(b, a, d) {
					this.rules.splice(this.findIndex(a), 0, {
						value: b,
						priority: a,
						options: d
					});
				},
				addMany: function(b, a, d) {
					var e = [this.findIndex(a), 0];
					var g = 0;
					var i = b.length;
					for (; g < i; g++) {
						e.push({
							value: b[g],
							priority: a,
							options: d
						});
					}
					this.rules.splice.apply(this.rules, e);
				},
				findIndex: function(b) {
					var a = this.rules;
					var d = a.length - 1;
					for (; d >= 0 && b < a[d].priority;) {
						d--;
					}
					return d + 1;
				},
				exec: function(b, a) {
					var d = a instanceof CKEDITOR.htmlParser.node || a instanceof CKEDITOR.htmlParser.fragment;
					var e = Array.prototype.slice.call(arguments, 1);
					var g = this.rules;
					var i = g.length;
					var h;
					var f;
					var k;
					var n;
					n = 0;
					for (; n < i; n++) {
						if (d) {
							h = a.type;
							f = a.name;
						}
						k = g[n];
						if (!(b.nonEditable && !k.options.applyToAll || b.nestedEditable && k.options.excludeNestedEditable)) {
							k = k.value.apply(null, e);
							if (k === false || d && (k && (k.name != f || k.type != h))) {
								return k;
							}
							if (k != void 0) {
								e[0] = a = k;
							}
						}
					}
					return a;
				},
				execOnName: function(b, a) {
					var d = 0;
					var e = this.rules;
					var g = e.length;
					var i;
					for (; a && d < g; d++) {
						i = e[d];
						if (!(b.nonEditable && !i.options.applyToAll || b.nestedEditable && i.options.excludeNestedEditable)) {
							a = a.replace(i.value[0], i.value[1]);
						}
					}
					return a;
				}
			};
		})();
		(function() {
			function b$$1(b$$0, h$$0) {
				function i(a) {
					return a || CKEDITOR.env.needsNbspFiller ? new CKEDITOR.htmlParser.text(" ") : new CKEDITOR.htmlParser.element("br", {
						"data-cke-bogus": 1
					});
				}

				function f$$0(b, d) {
					return function(h) {
						if (h.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
							var g = [];
							var f = c$$1(h);
							var k;
							var A;
							if (f) {
								if (j(f, 1)) {
									g.push(f);
								}
								for (; f;) {
									if (e$$1(f) && ((k = a$$2(f)) && j(k))) {
										if ((A = a$$2(k)) && !e$$1(A)) {
											g.push(k);
										} else {
											i(o).insertAfter(k);
											k.remove();
										}
									}
									f = f.previous;
								}
							}
							f = 0;
							for (; f < g.length; f++) {
								g[f].remove();
							}
							if (g = CKEDITOR.env.opera && !b || (typeof d == "function" ? d(h) !== false : d)) {
								if (!o && (!CKEDITOR.env.needsBrFiller && h.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)) {
									g = false;
								} else {
									if (!o && (!CKEDITOR.env.needsBrFiller && (document.documentMode > 7 || (h.name in CKEDITOR.dtd.tr || h.name in CKEDITOR.dtd.$listItem)))) {
										g = false;
									} else {
										g = c$$1(h);
										g = !g || h.name == "form" && g.name == "input";
									}
								}
							}
							if (g) {
								h.add(i(b));
							}
						}
					};
				}

				function j(a, b) {
					if ((!o || CKEDITOR.env.needsBrFiller) && (a.type == CKEDITOR.NODE_ELEMENT && (a.name == "br" && !a.attributes["data-cke-eol"]))) {
						return true;
					}
					var d;
					if (a.type == CKEDITOR.NODE_TEXT && (d = a.value.match(r))) {
						if (d.index) {
							(new CKEDITOR.htmlParser.text(a.value.substring(0, d.index))).insertBefore(a);
							a.value = d[0];
						}
						if (!CKEDITOR.env.needsBrFiller && (o && (!b || a.parent.name in A$$0))) {
							return true;
						}
						if (!o) {
							if ((d = a.previous) && d.name == "br" || (!d || e$$1(d))) {
								return true;
							}
						}
					}
					return false;
				}
				var k$$0 = {
					elements: {}
				};
				var o = h$$0 == "html";
				var A$$0 = CKEDITOR.tools.extend({}, s);
				var n;
				for (n in A$$0) {
					if (!("#" in t[n])) {
						delete A$$0[n];
					}
				}
				for (n in A$$0) {
					k$$0.elements[n] = f$$0(o, b$$0.config.fillEmptyBlocks !== false);
				}
				k$$0.root = f$$0(o);
				k$$0.elements.br = function(b) {
					return function(c) {
						if (c.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
							var h = c.attributes;
							if ("data-cke-bogus" in h || "data-cke-eol" in h) {
								delete h["data-cke-bogus"];
							} else {
								h = c.next;
								for (; h && d$$1(h);) {
									h = h.next;
								}
								var f = a$$2(c);
								if (!h && e$$1(c.parent)) {
									g$$0(c.parent, i(b));
								} else {
									if (e$$1(h)) {
										if (f && !e$$1(f)) {
											i(b).insertBefore(h);
										}
									}
								}
							}
						}
					};
				}(o);
				return k$$0;
			}

			function f$$1(a, b) {
				return a != CKEDITOR.ENTER_BR && b !== false ? a == CKEDITOR.ENTER_DIV ? "div" : "p" : false;
			}

			function c$$1(a) {
				a = a.children[a.children.length - 1];
				for (; a && d$$1(a);) {
					a = a.previous;
				}
				return a;
			}

			function a$$2(a) {
				a = a.previous;
				for (; a && d$$1(a);) {
					a = a.previous;
				}
				return a;
			}

			function d$$1(a) {
				return a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(a.value) || a.type == CKEDITOR.NODE_ELEMENT && a.attributes["data-cke-bookmark"];
			}

			function e$$1(a) {
				return a && (a.type == CKEDITOR.NODE_ELEMENT && a.name in s || a.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT);
			}

			function g$$0(a, b) {
				var d = a.children[a.children.length - 1];
				a.children.push(b);
				b.parent = a;
				if (d) {
					d.next = b;
					b.previous = d;
				}
			}

			function i$$0(a) {
				a = a.attributes;
				if (a.contenteditable != "false") {
					a["data-cke-editable"] = a.contenteditable ? "true" : 1;
				}
				a.contenteditable = "false";
			}

			function h$$1(a) {
				a = a.attributes;
				switch (a["data-cke-editable"]) {
					case "true":
						a.contenteditable = "true";
						break;
					case "1":
						delete a.contenteditable;
				}
			}

			function j$$0(a$$1) {
				return a$$1.replace(B, function(a$$0, b$$0, d) {
					return "<" + b$$0 + d.replace(H, function(a, b) {
						return F.test(b) && d.indexOf("data-cke-saved-" + b) == -1 ? " data-cke-saved-" + a + " data-cke-" + CKEDITOR.rnd + "-" + a : a;
					}) + ">";
				});
			}

			function k$$1(a$$0, b$$0) {
				return a$$0.replace(b$$0, function(a, b, d) {
					if (a.indexOf("<textarea") === 0) {
						a = b + q(d).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</textarea>";
					}
					return "<cke:encoded>" + encodeURIComponent(a) + "</cke:encoded>";
				});
			}

			function n$$0(a$$0) {
				return a$$0.replace(J, function(a, b) {
					return decodeURIComponent(b);
				});
			}

			function m(a$$0) {
				return a$$0.replace(/<\!--(?!{cke_protected})[\s\S]+?--\>/g, function(a) {
					return "\x3c!--" + p + "{C}" + encodeURIComponent(a).replace(/--/g, "%2D%2D") + "--\x3e";
				});
			}

			function q(a$$0) {
				return a$$0.replace(/<\!--\{cke_protected\}\{C\}([\s\S]+?)--\>/g, function(a, b) {
					return decodeURIComponent(b);
				});
			}

			function o$$0(a$$0, b$$0) {
				var d = b$$0._.dataStore;
				return a$$0.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g, function(a, b) {
					return decodeURIComponent(b);
				}).replace(/\{cke_protected_(\d+)\}/g, function(a, b) {
					return d && d[b] || "";
				});
			}

			function l(a$$1, b$$0) {
				var d = [];
				var c$$0 = b$$0.config.protectedSource;
				var e = b$$0._.dataStore || (b$$0._.dataStore = {
					id: 1
				});
				var h = /<\!--\{cke_temp(comment)?\}(\d*?)--\>/g;
				c$$0 = [/<script[\s\S]*?<\/script>/gi, /<noscript[\s\S]*?<\/noscript>/gi].concat(c$$0);
				a$$1 = a$$1.replace(/<\!--[\s\S]*?--\>/g, function(a) {
					return "\x3c!--{cke_tempcomment}" + (d.push(a) - 1) + "--\x3e";
				});
				var i = 0;
				for (; i < c$$0.length; i++) {
					a$$1 = a$$1.replace(c$$0[i], function(a$$0) {
						a$$0 = a$$0.replace(h, function(a, b, c) {
							return d[c];
						});
						return /cke_temp(comment)?/.test(a$$0) ? a$$0 : "\x3c!--{cke_temp}" + (d.push(a$$0) - 1) + "--\x3e";
					});
				}
				a$$1 = a$$1.replace(h, function(a, b, c) {
					return "\x3c!--" + p + (b ? "{C}" : "") + encodeURIComponent(d[c]).replace(/--/g, "%2D%2D") + "--\x3e";
				});
				return a$$1.replace(/(['"]).*?\1/g, function(a$$0) {
					return a$$0.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g, function(a, b) {
						e[e.id] = decodeURIComponent(b);
						return "{cke_protected_" + e.id+++"}";
					});
				});
			}
			CKEDITOR.htmlDataProcessor = function(a$$0) {
				var d$$0;
				var c$$0;
				var e$$0 = this;
				this.editor = a$$0;
				this.dataFilter = d$$0 = new CKEDITOR.htmlParser.filter;
				this.htmlFilter = c$$0 = new CKEDITOR.htmlParser.filter;
				this.writer = new CKEDITOR.htmlParser.basicWriter;
				d$$0.addRules(v);
				d$$0.addRules(z, {
					applyToAll: true
				});
				d$$0.addRules(b$$1(a$$0, "data"), {
					applyToAll: true
				});
				c$$0.addRules(u);
				c$$0.addRules(x, {
					applyToAll: true
				});
				c$$0.addRules(b$$1(a$$0, "html"), {
					applyToAll: true
				});
				a$$0.on("toHtml", function(b) {
					b = b.data;
					var d = b.dataValue;
					d = l(d, a$$0);
					d = k$$1(d, G);
					d = j$$0(d);
					d = k$$1(d, O);
					d = d.replace(A$$2, "$1cke:$2");
					d = d.replace(K, "<cke:$1$2></cke:$1>");
					d = CKEDITOR.env.opera ? d : d.replace(/(<pre\b[^>]*>)(\r\n|\n)/g, "$1$2$2");
					var c = b.context || a$$0.editable().getName();
					var e;
					if (CKEDITOR.env.ie && (CKEDITOR.env.version < 9 && c == "pre")) {
						c = "div";
						d = "<pre>" + d + "</pre>";
						e = 1;
					}
					c = a$$0.document.createElement(c);
					c.setHtml("a" + d);
					d = c.getHtml().substr(1);
					d = d.replace(RegExp(" data-cke-" + CKEDITOR.rnd + "-", "ig"), " ");
					if (e) {
						d = d.replace(/^<pre>|<\/pre>$/gi, "");
					}
					d = d.replace(S, "$1$2");
					d = n$$0(d);
					d = q(d);
					b.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(d, b.context, b.fixForBody === false ? false : f$$1(b.enterMode, a$$0.config.autoParagraph));
				}, null, null, 5);
				a$$0.on("toHtml", function(b) {
					if (b.data.filter.applyTo(b.data.dataValue, true, b.data.dontFilter, b.data.enterMode)) {
						a$$0.fire("dataFiltered");
					}
				}, null, null, 6);
				a$$0.on("toHtml", function(a) {
					a.data.dataValue.filterChildren(e$$0.dataFilter, true);
				}, null, null, 10);
				a$$0.on("toHtml", function(a) {
					a = a.data;
					var b = a.dataValue;
					var d = new CKEDITOR.htmlParser.basicWriter;
					b.writeChildrenHtml(d);
					b = d.getHtml(true);
					a.dataValue = m(b);
				}, null, null, 15);
				a$$0.on("toDataFormat", function(b) {
					var d = b.data.dataValue;
					if (b.data.enterMode != CKEDITOR.ENTER_BR) {
						d = d.replace(/^<br *\/?>/i, "");
					}
					b.data.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(d, b.data.context, f$$1(b.data.enterMode, a$$0.config.autoParagraph));
				}, null, null, 5);
				a$$0.on("toDataFormat", function(a) {
					a.data.dataValue.filterChildren(e$$0.htmlFilter, true);
				}, null, null, 10);
				a$$0.on("toDataFormat", function(a) {
					a.data.filter.applyTo(a.data.dataValue, false, true);
				}, null, null, 11);
				a$$0.on("toDataFormat", function(b) {
					var d = b.data.dataValue;
					var c = e$$0.writer;
					c.reset();
					d.writeChildrenHtml(c);
					d = c.getHtml(true);
					d = q(d);
					d = o$$0(d, a$$0);
					b.data.dataValue = d;
				}, null, null, 15);
			};
			CKEDITOR.htmlDataProcessor.prototype = {
				toHtml: function(a, b, d, c) {
					var e = this.editor;
					var h;
					var i;
					var g;
					if (b && typeof b == "object") {
						h = b.context;
						d = b.fixForBody;
						c = b.dontFilter;
						i = b.filter;
						g = b.enterMode;
					} else {
						h = b;
					}
					if (!h) {
						if (h !== null) {
							h = e.editable().getName();
						}
					}
					return e.fire("toHtml", {
						dataValue: a,
						context: h,
						fixForBody: d,
						dontFilter: c,
						filter: i || e.filter,
						enterMode: g || e.enterMode
					}).dataValue;
				},
				toDataFormat: function(a, b) {
					var d;
					var c;
					var e;
					if (b) {
						d = b.context;
						c = b.filter;
						e = b.enterMode;
					}
					if (!d) {
						if (d !== null) {
							d = this.editor.editable().getName();
						}
					}
					return this.editor.fire("toDataFormat", {
						dataValue: a,
						filter: c || this.editor.filter,
						context: d,
						enterMode: e || this.editor.enterMode
					}).dataValue;
				}
			};
			var r = /(?:&nbsp;|\xa0)$/;
			var p = "{cke_protected}";
			var t = CKEDITOR.dtd;
			var w = ["caption", "colgroup", "col", "thead", "tfoot", "tbody"];
			var s = CKEDITOR.tools.extend({}, t.$blockLimit, t.$block);
			var v = {
				elements: {
					input: i$$0,
					textarea: i$$0
				}
			};
			var z = {
				attributeNames: [
					[/^on/, "data-cke-pa-on"],
					[/^data-cke-expando$/, ""]
				]
			};
			var u = {
				elements: {
					embed: function(a) {
						var b = a.parent;
						if (b && b.name == "object") {
							var d = b.attributes.width;
							b = b.attributes.height;
							if (d) {
								a.attributes.width = d;
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
			var x = {
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
							var d = ["name", "href", "src"];
							var c;
							var e = 0;
							for (; e < d.length; e++) {
								c = "data-cke-saved-" + d[e];
								if (c in b) {
									delete b[d[e]];
								}
							}
						}
						return a;
					},
					table: function(a$$0) {
						a$$0.children.slice(0).sort(function(a, b) {
							var d;
							var c;
							if (a.type == CKEDITOR.NODE_ELEMENT && b.type == a.type) {
								d = CKEDITOR.tools.indexOf(w, a.name);
								c = CKEDITOR.tools.indexOf(w, b.name);
							}
							if (!(d > -1 && (c > -1 && d != c))) {
								d = a.parent ? a.getIndex() : -1;
								c = b.parent ? b.getIndex() : -1;
							}
							return d > c ? 1 : -1;
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
							g$$0(a, b = new CKEDITOR.htmlParser.text);
						}
						b.value = a.attributes["data-cke-title"] || "";
					},
					input: h$$1,
					textarea: h$$1
				},
				attributes: {
					"class": function(a) {
						return CKEDITOR.tools.ltrim(a.replace(/(?:^|\s+)cke_[^\s]*/g, "")) || false;
					}
				}
			};
			if (CKEDITOR.env.ie) {
				x.attributes.style = function(a$$0) {
					return a$$0.replace(/(^|;)([^\:]+)/g, function(a) {
						return a.toLowerCase();
					});
				};
			}
			var B = /<(a|area|img|input|source)\b([^>]*)>/gi;
			var H = /([\w-]+)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi;
			var F = /^(href|src|name)$/i;
			var O = /(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi;
			var G = /(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi;
			var J = /<cke:encoded>([^<]*)<\/cke:encoded>/gi;
			var A$$2 = /(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi;
			var S = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi;
			var K = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi;
		})();
		"use strict";
		CKEDITOR.htmlParser.element = function(b, f) {
			this.name = b;
			this.attributes = f || {};
			this.children = [];
			var c = b || "";
			var a = c.match(/^cke:(.*)/);
			if (a) {
				c = a[1];
			}
			c = !(!CKEDITOR.dtd.$nonBodyContent[c] && (!CKEDITOR.dtd.$block[c] && (!CKEDITOR.dtd.$listItem[c] && (!CKEDITOR.dtd.$tableContent[c] && !(CKEDITOR.dtd.$nonEditable[c] || c == "br")))));
			this.isEmpty = !!CKEDITOR.dtd.$empty[b];
			this.isUnknown = !CKEDITOR.dtd[b];
			this._ = {
				isBlockLike: c,
				hasInlineStarted: this.isEmpty || !c
			};
		};
		CKEDITOR.htmlParser.cssStyle = function(b$$0) {
			var f = {};
			((b$$0 instanceof CKEDITOR.htmlParser.element ? b$$0.attributes.style : b$$0) || "").replace(/&quot;/g, '"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(b, a, d) {
				if (a == "font-family") {
					d = d.replace(/["']/g, "");
				}
				f[a.toLowerCase()] = d;
			});
			return {
				rules: f,
				populate: function(b) {
					var a = this.toString();
					if (a) {
						if (b instanceof CKEDITOR.dom.element) {
							b.setAttribute("style", a);
						} else {
							if (b instanceof CKEDITOR.htmlParser.element) {
								b.attributes.style = a;
							} else {
								b.style = a;
							}
						}
					}
				},
				toString: function() {
					var b = [];
					var a;
					for (a in f) {
						if (f[a]) {
							b.push(a, ":", f[a], ";");
						}
					}
					return b.join("");
				}
			};
		};
		(function() {
			function b$$0(a) {
				return function(b) {
					return b.type == CKEDITOR.NODE_ELEMENT && (typeof a == "string" ? b.name == a : b.name in a);
				};
			}
			var f$$0 = function(a, b) {
				a = a[0];
				b = b[0];
				return a < b ? -1 : a > b ? 1 : 0;
			};
			var c$$0 = CKEDITOR.htmlParser.fragment.prototype;
			CKEDITOR.htmlParser.element.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
				type: CKEDITOR.NODE_ELEMENT,
				add: c$$0.add,
				clone: function() {
					return new CKEDITOR.htmlParser.element(this.name, this.attributes);
				},
				filter: function(a, b) {
					var c = this;
					var g;
					var i;
					b = c.getFilterContext(b);
					if (b.off) {
						return true;
					}
					if (!c.parent) {
						a.onRoot(b, c);
					}
					for (;;) {
						g = c.name;
						if (!(i = a.onElementName(b, g))) {
							this.remove();
							return false;
						}
						c.name = i;
						if (!(c = a.onElement(b, c))) {
							this.remove();
							return false;
						}
						if (c !== this) {
							this.replaceWith(c);
							return false;
						}
						if (c.name == g) {
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
					g = c.attributes;
					var h;
					var f;
					for (h in g) {
						f = h;
						i = g[h];
						for (;;) {
							if (f = a.onAttributeName(b, h)) {
								if (f != h) {
									delete g[h];
									h = f;
								} else {
									break;
								}
							} else {
								delete g[h];
								break;
							}
						}
						if (f) {
							if ((i = a.onAttribute(b, c, f, i)) === false) {
								delete g[f];
							} else {
								g[f] = i;
							}
						}
					}
					if (!c.isEmpty) {
						this.filterChildren(a, false, b);
					}
					return true;
				},
				filterChildren: c$$0.filterChildren,
				writeHtml: function(a, b) {
					if (b) {
						this.filter(b);
					}
					var c = this.name;
					var g = [];
					var i = this.attributes;
					var h;
					var j;
					a.openTag(c, i);
					for (h in i) {
						g.push([h, i[h]]);
					}
					if (a.sortAttributes) {
						g.sort(f$$0);
					}
					h = 0;
					j = g.length;
					for (; h < j; h++) {
						i = g[h];
						a.attribute(i[0], i[1]);
					}
					a.openTagClose(c, this.isEmpty);
					this.writeChildrenHtml(a);
					if (!this.isEmpty) {
						a.closeTag(c);
					}
				},
				writeChildrenHtml: c$$0.writeChildrenHtml,
				replaceWithChildren: function() {
					var a = this.children;
					var b = a.length;
					for (; b;) {
						a[--b].insertAfter(this);
					}
					this.remove();
				},
				forEach: c$$0.forEach,
				getFirst: function(a) {
					if (!a) {
						return this.children.length ? this.children[0] : null;
					}
					if (typeof a != "function") {
						a = b$$0(a);
					}
					var d = 0;
					var c = this.children.length;
					for (; d < c; ++d) {
						if (a(this.children[d])) {
							return this.children[d];
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
					var g = 0;
					for (; g < b.length; ++g) {
						b[g].parent = c;
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
						if (this.name != "body") {
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
			var b$$0 = {};
			var f = /{([^}]+)}/g;
			var c = /([\\'])/g;
			var a$$0 = /\n/g;
			var d = /\r/g;
			CKEDITOR.template = function(e) {
				if (b$$0[e]) {
					this.output = b$$0[e];
				} else {
					var g = e.replace(c, "\\$1").replace(a$$0, "\\n").replace(d, "\\r").replace(f, function(a, b) {
						return "',data['" + b + "']==undefined?'{" + b + "}':data['" + b + "'],'";
					});
					this.output = b$$0[e] = Function("data", "buffer", "return buffer?buffer.push('" + g + "'):['" + g + "'].join('');");
				}
			};
		})();
		delete CKEDITOR.loadFullCore;
		CKEDITOR.instances = {};
		CKEDITOR.document = new CKEDITOR.dom.document(document);
		CKEDITOR.add = function(b) {
			CKEDITOR.instances[b.name] = b;
			b.on("focus", function() {
				if (CKEDITOR.currentInstance != b) {
					CKEDITOR.currentInstance = b;
					CKEDITOR.fire("currentInstance");
				}
			});
			b.on("blur", function() {
				if (CKEDITOR.currentInstance == b) {
					CKEDITOR.currentInstance = null;
					CKEDITOR.fire("currentInstance");
				}
			});
			CKEDITOR.fire("instance", null, b);
		};
		CKEDITOR.remove = function(b) {
			delete CKEDITOR.instances[b.name];
		};
		(function() {
			var b = {};
			CKEDITOR.addTemplate = function(f, c) {
				var a = b[f];
				if (a) {
					return a;
				}
				a = {
					name: f,
					source: c
				};
				CKEDITOR.fire("template", a);
				return b[f] = new CKEDITOR.template(a.source);
			};
			CKEDITOR.getTemplate = function(f) {
				return b[f];
			};
		})();
		(function() {
			var b = [];
			CKEDITOR.addCss = function(f) {
				b.push(f);
			};
			CKEDITOR.getCss = function() {
				return b.join("\n");
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
			CKEDITOR.inline = function(b, f) {
				if (!CKEDITOR.env.isCompatible) {
					return null;
				}
				b = CKEDITOR.dom.element.get(b);
				if (b.getEditor()) {
					throw 'The editor instance "' + b.getEditor().name + '" is already attached to the provided element.';
				}
				var c = new CKEDITOR.editor(f, b, CKEDITOR.ELEMENT_MODE_INLINE);
				var a = b.is("textarea") ? b : null;
				if (a) {
					c.setData(a.getValue(), null, true);
					b = CKEDITOR.dom.element.createFromHtml('<div contenteditable="' + !!c.readOnly + '" class="cke_textarea_inline">' + a.getValue() + "</div>", CKEDITOR.document);
					b.insertAfter(a);
					a.hide();
					if (a.$.form) {
						c._attachToForm();
					}
				} else {
					c.setData(b.getHtml(), null, true);
				}
				c.on("loaded", function() {
					c.fire("uiReady");
					c.editable(b);
					c.container = b;
					c.setData(c.getData(1));
					c.resetDirty();
					c.fire("contentDom");
					c.mode = "wysiwyg";
					c.fire("mode");
					c.status = "ready";
					c.fireOnce("instanceReady");
					CKEDITOR.fire("instanceReady", null, c);
				}, null, null, 1E4);
				c.on("destroy", function() {
					if (a) {
						c.container.clearCustomData();
						c.container.remove();
						a.show();
					}
					c.element.clearCustomData();
					delete c.element;
				});
				return c;
			};
			CKEDITOR.inlineAll = function() {
				var b;
				var f;
				var c;
				for (c in CKEDITOR.dtd.$editable) {
					var a = CKEDITOR.document.getElementsByTag(c);
					var d = 0;
					var e = a.count();
					for (; d < e; d++) {
						b = a.getItem(d);
						if (b.getAttribute("contenteditable") == "true") {
							f = {
								element: b,
								config: {}
							};
							if (CKEDITOR.fire("inline", f) !== false) {
								CKEDITOR.inline(b, f.config);
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
			function b$$0(a, b, g, i) {
				if (!CKEDITOR.env.isCompatible) {
					return null;
				}
				a = CKEDITOR.dom.element.get(a);
				if (a.getEditor()) {
					throw 'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
				}
				var h = new CKEDITOR.editor(b, a, i);
				if (i == CKEDITOR.ELEMENT_MODE_REPLACE) {
					a.setStyle("visibility", "hidden");
					h._.required = a.hasAttribute("required");
					a.removeAttribute("required");
				}
				if (g) {
					h.setData(g, null, true);
				}
				h.on("loaded", function() {
					c$$0(h);
					if (i == CKEDITOR.ELEMENT_MODE_REPLACE) {
						if (h.config.autoUpdateElement && a.$.form) {
							h._attachToForm();
						}
					}
					h.setMode(h.config.startupMode, function() {
						h.resetDirty();
						h.status = "ready";
						h.fireOnce("instanceReady");
						CKEDITOR.fire("instanceReady", null, h);
					});
				});
				h.on("destroy", f$$0);
				return h;
			}

			function f$$0() {
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

			function c$$0(b) {
				var c = b.name;
				var g = b.element;
				var i = b.elementMode;
				var h = b.fire("uiSpace", {
					space: "top",
					html: ""
				}).html;
				var f = b.fire("uiSpace", {
					space: "bottom",
					html: ""
				}).html;
				if (!a$$0) {
					a$$0 = CKEDITOR.addTemplate("maincontainer", '<{outerEl} id="cke_{name}" class="{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' + CKEDITOR.env.cssClass + '"  dir="{langDir}" lang="{langCode}" role="application" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><{outerEl} class="cke_inner cke_reset" role="presentation">{topHtml}<{outerEl} id="{contentId}" class="cke_contents cke_reset" role="presentation"></{outerEl}>{bottomHtml}</{outerEl}></{outerEl}>');
				}
				c = CKEDITOR.dom.element.createFromHtml(a$$0.output({
					id: b.id,
					name: c,
					langDir: b.lang.dir,
					langCode: b.langCode,
					voiceLabel: [b.lang.editor, b.name].join(", "),
					topHtml: h ? '<span id="' + b.ui.spaceId("top") + '" class="cke_top cke_reset_all" role="presentation" style="height:auto">' + h + "</span>" : "",
					contentId: b.ui.spaceId("contents"),
					bottomHtml: f ? '<span id="' + b.ui.spaceId("bottom") + '" class="cke_bottom cke_reset_all" role="presentation">' + f + "</span>" : "",
					outerEl: CKEDITOR.env.ie ? "span" : "div"
				}));
				if (i == CKEDITOR.ELEMENT_MODE_REPLACE) {
					g.hide();
					c.insertAfter(g);
				} else {
					g.append(c);
				}
				b.container = c;
				if (h) {
					b.ui.space("top").unselectable();
				}
				if (f) {
					b.ui.space("bottom").unselectable();
				}
				g = b.config.width;
				i = b.config.height;
				if (g) {
					c.setStyle("width", CKEDITOR.tools.cssLength(g));
				}
				if (i) {
					b.ui.space("contents").setStyle("height", CKEDITOR.tools.cssLength(i));
				}
				c.disableContextMenu();
				if (CKEDITOR.env.webkit) {
					c.on("focus", function() {
						b.focus();
					});
				}
				b.fireOnce("uiReady");
			}
			CKEDITOR.replace = function(a, c) {
				return b$$0(a, c, null, CKEDITOR.ELEMENT_MODE_REPLACE);
			};
			CKEDITOR.appendTo = function(a, c, g) {
				return b$$0(a, c, g, CKEDITOR.ELEMENT_MODE_APPENDTO);
			};
			CKEDITOR.replaceAll = function() {
				var a = document.getElementsByTagName("textarea");
				var b = 0;
				for (; b < a.length; b++) {
					var c = null;
					var i = a[b];
					if (i.name || i.id) {
						if (typeof arguments[0] == "string") {
							if (!RegExp("(?:^|\\s)" + arguments[0] + "(?:$|\\s)").test(i.className)) {
								continue;
							}
						} else {
							if (typeof arguments[0] == "function") {
								c = {};
								if (arguments[0](i, c) === false) {
									continue;
								}
							}
						}
						this.replace(i, c);
					}
				}
			};
			CKEDITOR.editor.prototype.addMode = function(a, b) {
				(this._.modes || (this._.modes = {}))[a] = b;
			};
			CKEDITOR.editor.prototype.setMode = function(a, b) {
				var c = this;
				var i = this._.modes;
				if (!(a == c.mode || (!i || !i[a]))) {
					c.fire("beforeSetMode", a);
					if (c.mode) {
						var h = c.checkDirty();
						c._.previousMode = c.mode;
						c.fire("beforeModeUnload");
						c.editable(0);
						c.ui.space("contents").setHtml("");
						c.mode = "";
					}
					this._.modes[a](function() {
						c.mode = a;
						if (h !== void 0) {
							if (!h) {
								c.resetDirty();
							}
						}
						setTimeout(function() {
							c.fire("mode");
							if (b) {
								b.call(c);
							}
						}, 0);
					});
				}
			};
			CKEDITOR.editor.prototype.resize = function(a, b, c, i) {
				var h = this.container;
				var f = this.ui.space("contents");
				var k = CKEDITOR.env.webkit && (this.document && this.document.getWindow().$.frameElement);
				i = i ? h.getChild(1) : h;
				i.setSize("width", a, true);
				if (k) {
					k.style.width = "1%";
				}
				f.setStyle("height", Math.max(b - (c ? 0 : (i.$.offsetHeight || 0) - (f.$.clientHeight || 0)), 0) + "px");
				if (k) {
					k.style.width = "100%";
				}
				this.fire("resize");
			};
			CKEDITOR.editor.prototype.getResizable = function(a) {
				return a ? this.ui.space("contents") : this.container;
			};
			var a$$0;
			CKEDITOR.domReady(function() {
				if (CKEDITOR.replaceClass) {
					CKEDITOR.replaceAll(CKEDITOR.replaceClass);
				}
			});
		})();
		CKEDITOR.config.startupMode = "wysiwyg";
		(function() {
			function b$$2(b$$0) {
				var d = b$$0.editor;
				var c = b$$0.data.path;
				var e = c.blockLimit;
				var h = b$$0.data.selection;
				var i = h.getRanges()[0];
				var g;
				if (CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller) {
					if (h = f$$1(h, c)) {
						h.appendBogus();
						g = CKEDITOR.env.ie;
					}
				}
				if (d.config.autoParagraph !== false && (d.activeEnterMode != CKEDITOR.ENTER_BR && (d.editable().equals(e) && (!c.block && (i.collapsed && !i.getCommonAncestor().isReadOnly()))))) {
					c = i.clone();
					c.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
					e = new CKEDITOR.dom.walker(c);
					e.guard = function(b) {
						return !a$$1(b) || (b.type == CKEDITOR.NODE_COMMENT || b.isReadOnly());
					};
					if (!e.checkForward() || c.checkStartOfBlock() && c.checkEndOfBlock()) {
						d = i.fixBlock(true, d.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p");
						if (!CKEDITOR.env.needsBrFiller) {
							if (d = d.getFirst(a$$1)) {
								if (d.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(d.getText()).match(/^(?:&nbsp;|\xa0)$/)) {
									d.remove();
								}
							}
						}
						g = 1;
						b$$0.cancel();
					}
				}
				if (g) {
					i.select();
				}
			}

			function f$$1(b, d) {
				if (b.isFake) {
					return 0;
				}
				var c = d.block || d.blockLimit;
				var e = c && c.getLast(a$$1);
				if (c && (c.isBlockBoundary() && ((!e || !(e.type == CKEDITOR.NODE_ELEMENT && e.isBlockBoundary())) && (!c.is("pre") && !c.getBogus())))) {
					return c;
				}
			}

			function c$$1(a) {
				var b = a.data.getTarget();
				if (b.is("input")) {
					b = b.getAttribute("type");
					if (b == "submit" || b == "reset") {
						a.data.preventDefault();
					}
				}
			}

			function a$$1(a) {
				return k$$1(a) && n$$1(a);
			}

			function d$$2(a, b) {
				return function(d) {
					var c = CKEDITOR.dom.element.get(d.data.$.toElement || (d.data.$.fromElement || d.data.$.relatedTarget));
					if (!c || !b.equals(c) && !b.contains(c)) {
						a.call(this, d);
					}
				};
			}

			function e$$1(b$$0) {
				var d;
				var c$$0 = b$$0.getRanges()[0];
				var e$$0 = b$$0.root;
				var i = {
					table: 1,
					ul: 1,
					ol: 1,
					dl: 1
				};
				if (c$$0.startPath().contains(i)) {
					b$$0 = function(b) {
						return function(c, e) {
							if (e) {
								if (c.type == CKEDITOR.NODE_ELEMENT && c.is(i)) {
									d = c;
								}
							}
							if (!e && (a$$1(c) && (!b || !h$$1(c)))) {
								return false;
							}
						};
					};
					var g = c$$0.clone();
					g.collapse(1);
					g.setStartAt(e$$0, CKEDITOR.POSITION_AFTER_START);
					e$$0 = new CKEDITOR.dom.walker(g);
					e$$0.guard = b$$0();
					e$$0.checkBackward();
					if (d) {
						g = c$$0.clone();
						g.collapse();
						g.setEndAt(d, CKEDITOR.POSITION_AFTER_END);
						e$$0 = new CKEDITOR.dom.walker(g);
						e$$0.guard = b$$0(true);
						d = false;
						e$$0.checkForward();
						return d;
					}
				}
				return null;
			}

			function g$$1(a) {
				a.editor.focus();
				a.editor.fire("saveSnapshot");
			}

			function i$$1(a, b) {
				var d = a.editor;
				if (!b) {
					d.getSelection().scrollIntoView();
				}
				setTimeout(function() {
					d.fire("saveSnapshot");
				}, 0);
			}
			CKEDITOR.editable = CKEDITOR.tools.createClass({
				base: CKEDITOR.dom.element,
				$: function(a, b) {
					this.base(b.$ || b);
					this.editor = a;
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
							b = d$$2(b, this);
							c[0] = a;
							c[1] = b;
						}
						return CKEDITOR.dom.element.prototype.on.apply(this, c);
					},
					attachListener: function(a, b, d, c, e, h) {
						if (!this._.listeners) {
							this._.listeners = [];
						}
						var i = Array.prototype.slice.call(arguments, 1);
						i = a.on.apply(a, i);
						this._.listeners.push(i);
						return i;
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
						var d;
						for (d in a) {
							if (a.hasOwnProperty(d)) {
								b = a[d];
								if (b !== null) {
									this.setAttribute(d, b);
								} else {
									this.removeAttribute(d);
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
						var d = this.getAttribute(a);
						if (b !== d) {
							if (!this._.attrChanges) {
								this._.attrChanges = {};
							}
							if (!(a in this._.attrChanges)) {
								this._.attrChanges[a] = d;
							}
							this.setAttribute(a, b);
						}
					},
					insertHtml: function(a, b) {
						g$$1(this);
						m$$0(this, b || "html", a);
					},
					insertText: function(a$$0) {
						g$$1(this);
						var b$$0 = this.editor;
						var d = b$$0.getSelection().getStartElement().hasAscendant("pre", true) ? CKEDITOR.ENTER_BR : b$$0.activeEnterMode;
						b$$0 = d == CKEDITOR.ENTER_BR;
						var c = CKEDITOR.tools;
						a$$0 = c.htmlEncode(a$$0.replace(/\r\n/g, "\n"));
						a$$0 = a$$0.replace(/\t/g, "&nbsp;&nbsp; &nbsp;");
						d = d == CKEDITOR.ENTER_P ? "p" : "div";
						if (!b$$0) {
							var e = /\n{2}/g;
							if (e.test(a$$0)) {
								var h = "<" + d + ">";
								var i = "</" + d + ">";
								a$$0 = h + a$$0.replace(e, function() {
									return i + h;
								}) + i;
							}
						}
						a$$0 = a$$0.replace(/\n/g, "<br>");
						if (!b$$0) {
							a$$0 = a$$0.replace(RegExp("<br>(?=</" + d + ">)"), function(a) {
								return c.repeat(a, 2);
							});
						}
						a$$0 = a$$0.replace(/^ | $/g, "&nbsp;");
						a$$0 = a$$0.replace(/(>|\s) /g, function(a, b) {
							return b + "&nbsp;";
						}).replace(/ (?=<)/g, "&nbsp;");
						m$$0(this, "text", a$$0);
					},
					insertElement: function(a, b) {
						if (b) {
							this.insertElementIntoRange(a, b);
						} else {
							this.insertElementIntoSelection(a);
						}
					},
					insertElementIntoRange: function(a, b) {
						var d = this.editor;
						var c = d.config.enterMode;
						var e = a.getName();
						var h = CKEDITOR.dtd.$block[e];
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
								q$$0(b);
							}
						}
						var i;
						var g;
						if (h) {
							for (;
								(i = b.getCommonAncestor(0, 1)) && ((g = CKEDITOR.dtd[i.getName()]) && (!g || !g[e]));) {
								if (i.getName() in CKEDITOR.dtd.span) {
									b.splitElement(i);
								} else {
									if (b.checkStartOfBlock() && b.checkEndOfBlock()) {
										b.setStartBefore(i);
										b.collapse(true);
										i.remove();
									} else {
										b.splitBlock(c == CKEDITOR.ENTER_DIV ? "div" : "p", d.editable());
									}
								}
							}
						}
						b.insertNode(a);
						return true;
					},
					insertElementIntoSelection: function(b$$0) {
						var d = this.editor;
						var c = d.activeEnterMode;
						d = d.getSelection();
						var e = d.getRanges()[0];
						var f = b$$0.getName();
						f = CKEDITOR.dtd.$block[f];
						g$$1(this);
						if (this.insertElementIntoRange(b$$0, e)) {
							e.moveToPosition(b$$0, CKEDITOR.POSITION_AFTER_END);
							if (f) {
								if ((f = b$$0.getNext(function(b) {
									return a$$1(b) && !h$$1(b);
								})) && (f.type == CKEDITOR.NODE_ELEMENT && f.is(CKEDITOR.dtd.$block))) {
									if (f.getDtd()["#"]) {
										e.moveToElementEditStart(f);
									} else {
										e.moveToElementEditEnd(b$$0);
									}
								} else {
									if (!f && c != CKEDITOR.ENTER_BR) {
										f = e.fixBlock(true, c == CKEDITOR.ENTER_DIV ? "div" : "p");
										e.moveToElementEditStart(f);
									}
								}
							}
						}
						d.selectRanges([e]);
						i$$1(this, CKEDITOR.env.opera);
					},
					setData: function(a, b) {
						if (!b) {
							a = this.editor.dataProcessor.toHtml(a);
						}
						this.setHtml(a);
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
						var a = this.editor;
						this._.detach();
						delete a.document;
						delete a.window;
					},
					isInline: function() {
						return this.getDocument().equals(CKEDITOR.document);
					},
					setup: function() {
						var b$$0 = this.editor;
						this.attachListener(b$$0, "beforeGetData", function() {
							var a$$0 = this.getData();
							if (!this.is("textarea")) {
								if (b$$0.config.ignoreEmptyParagraph !== false) {
									a$$0 = a$$0.replace(j$$1, function(a, b) {
										return b;
									});
								}
							}
							b$$0.setData(a$$0, null, 1);
						}, this);
						this.attachListener(b$$0, "getSnapshot", function(a) {
							a.data = this.getData(1);
						}, this);
						this.attachListener(b$$0, "afterSetData", function() {
							this.setData(b$$0.getData(1));
						}, this);
						this.attachListener(b$$0, "loadSnapshot", function(a) {
							this.setData(a.data, 1);
						}, this);
						this.attachListener(b$$0, "beforeFocus", function() {
							var a = b$$0.getSelection();
							if (!((a = a && a.getNative()) && a.type == "Control")) {
								this.focus();
							}
						}, this);
						this.attachListener(b$$0, "insertHtml", function(a) {
							this.insertHtml(a.data.dataValue, a.data.mode);
						}, this);
						this.attachListener(b$$0, "insertElement", function(a) {
							this.insertElement(a.data);
						}, this);
						this.attachListener(b$$0, "insertText", function(a) {
							this.insertText(a.data);
						}, this);
						this.setReadOnly(b$$0.readOnly);
						this.attachClass("cke_editable");
						this.attachClass(b$$0.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "cke_editable_inline" : b$$0.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE || b$$0.elementMode == CKEDITOR.ELEMENT_MODE_APPENDTO ? "cke_editable_themed" : "");
						this.attachClass("cke_contents_" + b$$0.config.contentsLangDirection);
						b$$0.keystrokeHandler.blockedKeystrokes[8] = +b$$0.readOnly;
						b$$0.keystrokeHandler.attach(this);
						this.on("blur", function(a) {
							if (CKEDITOR.env.opera && CKEDITOR.document.getActive().equals(this.isInline() ? this : this.getWindow().getFrame())) {
								a.cancel();
							} else {
								this.hasFocus = false;
							}
						}, null, null, -1);
						this.on("focus", function() {
							this.hasFocus = true;
						}, null, null, -1);
						b$$0.focusManager.add(this);
						if (this.equals(CKEDITOR.document.getActive())) {
							this.hasFocus = true;
							b$$0.once("contentDom", function() {
								b$$0.focusManager.focus();
							});
						}
						if (this.isInline()) {
							this.changeAttr("tabindex", b$$0.tabIndex);
						}
						if (!this.is("textarea")) {
							b$$0.document = this.getDocument();
							b$$0.window = this.getWindow();
							var d$$0 = b$$0.document;
							this.changeAttr("spellcheck", !b$$0.config.disableNativeSpellChecker);
							var h$$0 = b$$0.config.contentsLangDirection;
							if (this.getDirection(1) != h$$0) {
								this.changeAttr("dir", h$$0);
							}
							var i$$0 = CKEDITOR.getCss();
							if (i$$0) {
								h$$0 = d$$0.getHead();
								if (!h$$0.getCustomData("stylesheet")) {
									i$$0 = d$$0.appendStyleText(i$$0);
									i$$0 = new CKEDITOR.dom.element(i$$0.ownerNode || i$$0.owningElement);
									h$$0.setCustomData("stylesheet", i$$0);
									i$$0.data("cke-temp", 1);
								}
							}
							h$$0 = d$$0.getCustomData("stylesheet_ref") || 0;
							d$$0.setCustomData("stylesheet_ref", h$$0 + 1);
							this.setCustomData("cke_includeReadonly", !b$$0.config.disableReadonlyStyling);
							this.attachListener(this, "click", function(a) {
								a = a.data;
								var b = (new CKEDITOR.dom.elementPath(a.getTarget(), this)).contains("a");
								if (b) {
									if (a.$.button != 2 && b.isReadOnly()) {
										a.preventDefault();
									}
								}
							});
							var g = {
								8: 1,
								46: 1
							};
							this.attachListener(b$$0, "key", function(a) {
								if (b$$0.readOnly) {
									return true;
								}
								var d = a.data.keyCode;
								var c;
								if (d in g) {
									a = b$$0.getSelection();
									var h;
									var i = a.getRanges()[0];
									var f = i.startPath();
									var j;
									var n;
									var m;
									d = d == 8;
									if (CKEDITOR.env.ie && (CKEDITOR.env.version < 11 && (h = a.getSelectedElement())) || (h = e$$1(a))) {
										b$$0.fire("saveSnapshot");
										i.moveToPosition(h, CKEDITOR.POSITION_BEFORE_START);
										h.remove();
										i.select();
										b$$0.fire("saveSnapshot");
										c = 1;
									} else {
										if (i.collapsed) {
											if ((j = f.block) && ((m = j[d ? "getPrevious" : "getNext"](k$$1)) && (m.type == CKEDITOR.NODE_ELEMENT && (m.is("table") && i[d ? "checkStartOfBlock" : "checkEndOfBlock"]())))) {
												b$$0.fire("saveSnapshot");
												if (i[d ? "checkEndOfBlock" : "checkStartOfBlock"]()) {
													j.remove();
												}
												i["moveToElementEdit" + (d ? "End" : "Start")](m);
												i.select();
												b$$0.fire("saveSnapshot");
												c = 1;
											} else {
												if (f.blockLimit && (f.blockLimit.is("td") && ((n = f.blockLimit.getAscendant("table")) && (i.checkBoundaryOfElement(n, d ? CKEDITOR.START : CKEDITOR.END) && (m = n[d ? "getPrevious" : "getNext"](k$$1)))))) {
													b$$0.fire("saveSnapshot");
													i["moveToElementEdit" + (d ? "End" : "Start")](m);
													if (i.checkStartOfBlock() && i.checkEndOfBlock()) {
														m.remove();
													} else {
														i.select();
													}
													b$$0.fire("saveSnapshot");
													c = 1;
												} else {
													if ((n = f.contains(["td", "th", "caption"])) && i.checkBoundaryOfElement(n, d ? CKEDITOR.START : CKEDITOR.END)) {
														c = 1;
													}
												}
											}
										}
									}
								}
								return !c;
							});
							if (b$$0.blockless) {
								if (CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller) {
									this.attachListener(this, "keyup", function(d) {
										if (d.data.getKeystroke() in g && !this.getFirst(a$$1)) {
											this.appendBogus();
											d = b$$0.createRange();
											d.moveToPosition(this, CKEDITOR.POSITION_AFTER_START);
											d.select();
										}
									});
								}
							}
							this.attachListener(this, "dblclick", function(a) {
								if (b$$0.readOnly) {
									return false;
								}
								a = {
									element: a.data.getTarget()
								};
								b$$0.fire("doubleclick", a);
							});
							if (CKEDITOR.env.ie) {
								this.attachListener(this, "click", c$$1);
							}
							if (!CKEDITOR.env.ie) {
								if (!CKEDITOR.env.opera) {
									this.attachListener(this, "mousedown", function(a) {
										var d = a.data.getTarget();
										if (d.is("img", "hr", "input", "textarea", "select")) {
											b$$0.getSelection().selectElement(d);
											if (d.is("input", "textarea", "select")) {
												a.data.preventDefault();
											}
										}
									});
								}
							}
							if (CKEDITOR.env.gecko) {
								this.attachListener(this, "mouseup", function(a) {
									if (a.data.$.button == 2) {
										a = a.data.getTarget();
										if (!a.getOuterHtml().replace(j$$1, "")) {
											var d = b$$0.createRange();
											d.moveToElementEditStart(a);
											d.select(true);
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
						a = this.getDocument();
						var b = a.getHead();
						if (b.getCustomData("stylesheet")) {
							var d = a.getCustomData("stylesheet_ref");
							if (--d) {
								a.setCustomData("stylesheet_ref", d);
							} else {
								a.removeCustomData("stylesheet_ref");
								b.removeCustomData("stylesheet").remove();
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
			var h$$1 = CKEDITOR.dom.walker.bogus();
			var j$$1 = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi;
			var k$$1 = CKEDITOR.dom.walker.whitespaces(true);
			var n$$1 = CKEDITOR.dom.walker.bookmark(false, true);
			CKEDITOR.on("instanceLoaded", function(a$$0) {
				var d = a$$0.editor;
				d.on("insertElement", function(a) {
					a = a.data;
					if (a.type == CKEDITOR.NODE_ELEMENT && (a.is("input") || a.is("textarea"))) {
						if (a.getAttribute("contentEditable") != "false") {
							a.data("cke-editable", a.hasAttribute("contenteditable") ? "true" : "1");
						}
						a.setAttribute("contentEditable", false);
					}
				});
				d.on("selectionChange", function(a) {
					if (!d.readOnly) {
						var c = d.getSelection();
						if (c && !c.isLocked) {
							c = d.checkDirty();
							d.fire("lockSnapshot");
							b$$2(a);
							d.fire("unlockSnapshot");
							if (!c) {
								d.resetDirty();
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
						var d = b.title;
						a.changeAttr("role", "textbox");
						a.changeAttr("aria-label", d);
						if (d) {
							a.changeAttr("title", d);
						}
						if (d = this.ui.space(this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "top" : "contents")) {
							var c = CKEDITOR.tools.getNextId();
							var e = CKEDITOR.dom.element.createFromHtml('<span id="' + c + '" class="cke_voice_label">' + this.lang.common.editorHelp + "</span>");
							d.append(e);
							a.changeAttr("aria-describedby", c);
						}
					}
				});
			});
			CKEDITOR.addCss(".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}");
			var m$$0 = function() {
				function b(a) {
					return a.type == CKEDITOR.NODE_ELEMENT;
				}

				function d$$1(a, c) {
					var e;
					var h;
					var i;
					var g;
					var j = [];
					var k = c.range.startContainer;
					e = c.range.startPath();
					k = f$$0[k.getName()];
					var n = 0;
					var t = a.getChildren();
					var m = t.count();
					var w = -1;
					var u = -1;
					var q = 0;
					var v = e.contains(f$$0.$list);
					for (; n < m; ++n) {
						e = t.getItem(n);
						if (b(e)) {
							i = e.getName();
							if (v && i in CKEDITOR.dtd.$list) {
								j = j.concat(d$$1(e, c));
							} else {
								g = !!k[i];
								if (i == "br" && (e.data("cke-eol") && (!n || n == m - 1))) {
									q = (h = n ? j[n - 1].node : t.getItem(n + 1)) && (!b(h) || !h.is("br"));
									h = h && (b(h) && f$$0.$block[h.getName()]);
								}
								if (w == -1) {
									if (!g) {
										w = n;
									}
								}
								if (!g) {
									u = n;
								}
								j.push({
									isElement: 1,
									isLineBreak: q,
									isBlock: e.isBlockBoundary(),
									hasBlockSibling: h,
									node: e,
									name: i,
									allowed: g
								});
								h = q = 0;
							}
						} else {
							j.push({
								isElement: 0,
								node: e,
								allowed: 1
							});
						}
					}
					if (w > -1) {
						j[w].firstNotAllowed = 1;
					}
					if (u > -1) {
						j[u].lastNotAllowed = 1;
					}
					return j;
				}

				function c$$0(a, d) {
					var e = [];
					var h = a.getChildren();
					var i = h.count();
					var g;
					var j = 0;
					var k = f$$0[d];
					var n = !a.is(f$$0.$inline) || a.is("br");
					if (n) {
						e.push(" ");
					}
					for (; j < i; j++) {
						g = h.getItem(j);
						if (b(g) && !g.is(k)) {
							e = e.concat(c$$0(g, d));
						} else {
							e.push(g);
						}
					}
					if (n) {
						e.push(" ");
					}
					return e;
				}

				function e$$0(a) {
					return a && (b(a) && (a.is(f$$0.$removeEmpty) || a.is("a") && !a.isBlockBoundary()));
				}

				function h$$0(a, d, c, e) {
					var i = a.clone();
					var g;
					var f;
					i.setEndAt(d, CKEDITOR.POSITION_BEFORE_END);
					if ((g = (new CKEDITOR.dom.walker(i)).next()) && (b(g) && (j$$0[g.getName()] && ((f = g.getPrevious()) && (b(f) && (!f.getParent().equals(a.startContainer) && (c.contains(f) && (e.contains(g) && g.isIdentical(f))))))))) {
						g.moveChildren(f);
						g.remove();
						h$$0(a, d, c, e);
					}
				}

				function g$$0(a$$0, d$$0) {
					function c(a, d) {
						if (d.isBlock && (d.isElement && (!d.node.is("br") && (b(a) && a.is("br"))))) {
							a.remove();
							return 1;
						}
					}
					var e = d$$0.endContainer.getChild(d$$0.endOffset);
					var h = d$$0.endContainer.getChild(d$$0.endOffset - 1);
					if (e) {
						c(e, a$$0[a$$0.length - 1]);
					}
					if (h && c(h, a$$0[0])) {
						d$$0.setEnd(d$$0.endContainer, d$$0.endOffset - 1);
						d$$0.collapse();
					}
				}
				var f$$0 = CKEDITOR.dtd;
				var j$$0 = {
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
				var n$$0 = CKEDITOR.tools.extend({}, f$$0.$inline);
				delete n$$0.br;
				return function(j, m, q) {
					var v = j.editor;
					j.getDocument();
					var O = v.getSelection().getRanges()[0];
					var G = false;
					if (m == "unfiltered_html") {
						m = "html";
						G = true;
					}
					if (!O.checkReadOnly()) {
						var J = (new CKEDITOR.dom.elementPath(O.startContainer, O.root)).blockLimit || O.root;
						m = {
							type: m,
							dontFilter: G,
							editable: j,
							editor: v,
							range: O,
							blockLimit: J,
							mergeCandidates: [],
							zombies: []
						};
						v = m.range;
						G = m.mergeCandidates;
						var A;
						var S;
						var K;
						var M;
						if (m.type == "text" && v.shrink(CKEDITOR.SHRINK_ELEMENT, true, false)) {
							A = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", v.document);
							v.insertNode(A);
							v.setStartAfter(A);
						}
						S = new CKEDITOR.dom.elementPath(v.startContainer);
						m.endPath = K = new CKEDITOR.dom.elementPath(v.endContainer);
						if (!v.collapsed) {
							J = K.block || K.blockLimit;
							var ha = v.getCommonAncestor();
							if (J) {
								if (!J.equals(ha) && (!J.contains(ha) && v.checkEndOfBlock())) {
									m.zombies.push(J);
								}
							}
							v.deleteContents();
						}
						for (;
							(M = b(v.startContainer) && v.startContainer.getChild(v.startOffset - 1)) && (b(M) && (M.isBlockBoundary() && S.contains(M)));) {
							v.moveToPosition(M, CKEDITOR.POSITION_BEFORE_END);
						}
						h$$0(v, m.blockLimit, S, K);
						if (A) {
							v.setEndBefore(A);
							v.collapse();
							A.remove();
						}
						A = v.startPath();
						if (J = A.contains(e$$0, false, 1)) {
							v.splitElement(J);
							m.inlineStylesRoot = J;
							m.inlineStylesPeak = A.lastElement;
						}
						A = v.createBookmark();
						if (J = A.startNode.getPrevious(a$$1)) {
							if (b(J)) {
								if (e$$0(J)) {
									G.push(J);
								}
							}
						}
						if (J = A.startNode.getNext(a$$1)) {
							if (b(J)) {
								if (e$$0(J)) {
									G.push(J);
								}
							}
						}
						J = A.startNode;
						for (;
							(J = J.getParent()) && e$$0(J);) {
							G.push(J);
						}
						v.moveToBookmark(A);
						if (A = q) {
							A = m.range;
							if (m.type == "text" && m.inlineStylesRoot) {
								M = m.inlineStylesPeak;
								v = M.getDocument().createText("{cke-peak}");
								G = m.inlineStylesRoot.getParent();
								for (; !M.equals(G);) {
									v = v.appendTo(M.clone());
									M = M.getParent();
								}
								q = v.getOuterHtml().split("{cke-peak}").join(q);
							}
							M = m.blockLimit.getName();
							if (/^\s+|\s+$/.test(q) && "span" in CKEDITOR.dtd[M]) {
								var da = '<span data-cke-marker="1">&nbsp;</span>';
								q = da + q + da;
							}
							q = m.editor.dataProcessor.toHtml(q, {
								context: null,
								fixForBody: false,
								dontFilter: m.dontFilter,
								filter: m.editor.activeFilter,
								enterMode: m.editor.activeEnterMode
							});
							M = A.document.createElement("body");
							M.setHtml(q);
							if (da) {
								M.getFirst().remove();
								M.getLast().remove();
							}
							if ((da = A.startPath().block) && !(da.getChildCount() == 1 && da.getBogus())) {
								a: {
									var Q;
									if (M.getChildCount() == 1 && (b(Q = M.getFirst()) && Q.is(k$$0))) {
										da = Q.getElementsByTag("*");
										A = 0;
										G = da.count();
										for (; A < G; A++) {
											v = da.getItem(A);
											if (!v.is(n$$0)) {
												break a;
											}
										}
										Q.moveChildren(Q.getParent(1));
										Q.remove();
									}
								}
							}
							m.dataWrapper = M;
							A = q;
						}
						if (A) {
							Q = m.range;
							da = Q.document;
							var L;
							q = m.blockLimit;
							A = 0;
							var N;
							M = [];
							var R;
							var ea;
							G = v = 0;
							var Y;
							var ga;
							S = Q.startContainer;
							J = m.endPath.elements[0];
							var fa;
							K = J.getPosition(S);
							ha = !!J.getCommonAncestor(S) && (K != CKEDITOR.POSITION_IDENTICAL && !(K & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED));
							S = d$$1(m.dataWrapper, m);
							g$$0(S, Q);
							for (; A < S.length; A++) {
								K = S[A];
								if (L = K.isLineBreak) {
									L = Q;
									Y = q;
									var Z = void 0;
									var V = void 0;
									if (K.hasBlockSibling) {
										L = 1;
									} else {
										Z = L.startContainer.getAscendant(f$$0.$block, 1);
										if (!Z || !Z.is({
											div: 1,
											p: 1
										})) {
											L = 0;
										} else {
											V = Z.getPosition(Y);
											if (V == CKEDITOR.POSITION_IDENTICAL || V == CKEDITOR.POSITION_CONTAINS) {
												L = 0;
											} else {
												Y = L.splitElement(Z);
												L.moveToPosition(Y, CKEDITOR.POSITION_AFTER_START);
												L = 1;
											}
										}
									}
								}
								if (L) {
									G = A > 0;
								} else {
									L = Q.startPath();
									if (!K.isBlock && (m.editor.config.autoParagraph !== false && (m.editor.activeEnterMode != CKEDITOR.ENTER_BR && (m.editor.editable().equals(L.blockLimit) && !L.block) && (ea = m.editor.activeEnterMode != CKEDITOR.ENTER_BR && m.editor.config.autoParagraph !== false ? m.editor.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p" : false)))) {
										ea = da.createElement(ea);
										ea.appendBogus();
										Q.insertNode(ea);
										if (CKEDITOR.env.needsBrFiller) {
											if (N = ea.getBogus()) {
												N.remove();
											}
										}
										Q.moveToPosition(ea, CKEDITOR.POSITION_BEFORE_END);
									}
									if ((L = Q.startPath().block) && !L.equals(R)) {
										if (N = L.getBogus()) {
											N.remove();
											M.push(L);
										}
										R = L;
									}
									if (K.firstNotAllowed) {
										v = 1;
									}
									if (v && K.isElement) {
										L = Q.startContainer;
										Y = null;
										for (; L && !f$$0[L.getName()][K.name];) {
											if (L.equals(q)) {
												L = null;
												break;
											}
											Y = L;
											L = L.getParent();
										}
										if (L) {
											if (Y) {
												ga = Q.splitElement(Y);
												m.zombies.push(ga);
												m.zombies.push(Y);
											}
										} else {
											Y = q.getName();
											fa = !A;
											L = A == S.length - 1;
											Y = c$$0(K.node, Y);
											Z = [];
											V = Y.length;
											var W = 0;
											var T = void 0;
											var X = 0;
											var ba = -1;
											for (; W < V; W++) {
												T = Y[W];
												if (T == " ") {
													if (!X && (!fa || W)) {
														Z.push(new CKEDITOR.dom.text(" "));
														ba = Z.length;
													}
													X = 1;
												} else {
													Z.push(T);
													X = 0;
												}
											}
											if (L) {
												if (ba == Z.length) {
													Z.pop();
												}
											}
											fa = Z;
										}
									}
									if (fa) {
										for (; L = fa.pop();) {
											Q.insertNode(L);
										}
										fa = 0;
									} else {
										Q.insertNode(K.node);
									}
									if (K.lastNotAllowed && A < S.length - 1) {
										if (ga = ha ? J : ga) {
											Q.setEndAt(ga, CKEDITOR.POSITION_AFTER_START);
										}
										v = 0;
									}
									Q.collapse();
								}
							}
							m.dontMoveCaret = G;
							m.bogusNeededBlocks = M;
						}
						N = m.range;
						var D;
						ga = m.bogusNeededBlocks;
						fa = N.createBookmark();
						for (; R = m.zombies.pop();) {
							if (R.getParent()) {
								ea = N.clone();
								ea.moveToElementEditStart(R);
								ea.removeEmptyBlocksAtEnd();
							}
						}
						if (ga) {
							for (; R = ga.pop();) {
								if (CKEDITOR.env.needsBrFiller) {
									R.appendBogus();
								} else {
									R.append(N.document.createText(" "));
								}
							}
						}
						for (; R = m.mergeCandidates.pop();) {
							R.mergeSiblings();
						}
						N.moveToBookmark(fa);
						if (!m.dontMoveCaret) {
							R = b(N.startContainer) && N.startContainer.getChild(N.startOffset - 1);
							for (; R && (b(R) && !R.is(f$$0.$empty));) {
								if (R.isBlockBoundary()) {
									N.moveToPosition(R, CKEDITOR.POSITION_BEFORE_END);
								} else {
									if (e$$0(R) && R.getHtml().match(/(\s|&nbsp;)$/g)) {
										D = null;
										break;
									}
									D = N.clone();
									D.moveToPosition(R, CKEDITOR.POSITION_BEFORE_END);
								}
								R = R.getLast(a$$1);
							}
							if (D) {
								N.moveToRange(D);
							}
						}
						O.select();
						i$$1(j);
					}
				};
			}();
			var q$$0 = function() {
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

				function b$$1(a, d, c) {
					d = a.getDocument().createElement(d);
					a.append(d, c);
					return d;
				}

				function d$$0(a) {
					var b = a.count();
					var c;
					b;
					for (; b-- > 0;) {
						c = a.getItem(b);
						if (!CKEDITOR.tools.trim(c.getHtml())) {
							c.appendBogus();
							if (CKEDITOR.env.ie) {
								if (CKEDITOR.env.version < 9 && c.getChildCount()) {
									c.getFirst().remove();
								}
							}
						}
					}
				}
				return function(c) {
					var e = c.startContainer;
					var h = e.getAscendant("table", 1);
					var i = false;
					d$$0(h.getElementsByTag("td"));
					d$$0(h.getElementsByTag("th"));
					h = c.clone();
					h.setStart(e, 0);
					h = a$$0(h).lastBackward();
					if (!h) {
						h = c.clone();
						h.setEndAt(e, CKEDITOR.POSITION_BEFORE_END);
						h = a$$0(h).lastForward();
						i = true;
					}
					if (!h) {
						h = e;
					}
					if (h.is("table")) {
						c.setStartAt(h, CKEDITOR.POSITION_BEFORE_START);
						c.collapse(true);
						h.remove();
					} else {
						if (h.is({
							tbody: 1,
							thead: 1,
							tfoot: 1
						})) {
							h = b$$1(h, "tr", i);
						}
						if (h.is("tr")) {
							h = b$$1(h, h.getParent().is("thead") ? "th" : "td", i);
						}
						if (e = h.getBogus()) {
							e.remove();
						}
						c.moveToPosition(h, i ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
					}
				};
			}();
		})();
		(function() {
			function b$$1() {
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

			function f$$0() {
				m$$0 = true;
				if (!n$$0) {
					c$$2.call(this);
					n$$0 = CKEDITOR.tools.setTimeout(c$$2, 200, this);
				}
			}

			function c$$2() {
				n$$0 = null;
				if (m$$0) {
					CKEDITOR.tools.setTimeout(b$$1, 0, this);
					m$$0 = false;
				}
			}

			function a$$3(a) {
				function b(d, c) {
					return !d || d.type == CKEDITOR.NODE_TEXT ? false : a.clone()["moveToElementEdit" + (c ? "End" : "Start")](d);
				}
				if (!(a.root instanceof CKEDITOR.editable)) {
					return false;
				}
				var d$$0 = a.startContainer;
				var c$$0 = a.getPreviousNode(q$$0, null, d$$0);
				var e = a.getNextNode(q$$0, null, d$$0);
				return b(c$$0) || (b(e, 1) || !c$$0 && (!e && !(d$$0.type == CKEDITOR.NODE_ELEMENT && (d$$0.isBlockBoundary() && d$$0.getBogus())))) ? true : false;
			}

			function d$$2(a) {
				return a.getCustomData("cke-fillingChar");
			}

			function e$$1(a, b) {
				var d = a && a.removeCustomData("cke-fillingChar");
				if (d) {
					if (b !== false) {
						var c;
						var e = a.getDocument().getSelection().getNative();
						var h = e && (e.type != "None" && e.getRangeAt(0));
						if (d.getLength() > 1 && (h && h.intersectsNode(d.$))) {
							c = [e.anchorOffset, e.focusOffset];
							h = e.focusNode == d.$ && e.focusOffset > 0;
							if (e.anchorNode == d.$) {
								if (e.anchorOffset > 0) {
									c[0] --;
								}
							}
							if (h) {
								c[1] --;
							}
							var i;
							h = e;
							if (!h.isCollapsed) {
								i = h.getRangeAt(0);
								i.setStart(h.anchorNode, h.anchorOffset);
								i.setEnd(h.focusNode, h.focusOffset);
								i = i.collapsed;
							}
							if (i) {
								c.unshift(c.pop());
							}
						}
					}
					d.setText(g$$0(d.getText()));
					if (c) {
						d = e.getRangeAt(0);
						d.setStart(d.startContainer, c[0]);
						d.setEnd(d.startContainer, c[1]);
						e.removeAllRanges();
						e.addRange(d);
					}
				}
			}

			function g$$0(a$$0) {
				return a$$0.replace(/\u200B( )?/g, function(a) {
					return a[1] ? " " : "";
				});
			}

			function i$$0(a$$0, b, d) {
				var c = a$$0.on("focus", function(a) {
					a.cancel();
				}, null, null, -100);
				if (CKEDITOR.env.ie) {
					var e = a$$0.getDocument().on("selectionchange", function(a) {
						a.cancel();
					}, null, null, -100)
				} else {
					var h = new CKEDITOR.dom.range(a$$0);
					h.moveToElementEditStart(a$$0);
					var i = a$$0.getDocument().$.createRange();
					i.setStart(h.startContainer.$, h.startOffset);
					i.collapse(1);
					b.removeAllRanges();
					b.addRange(i);
				}
				if (d) {
					a$$0.focus();
				}
				c.removeListener();
				if (e) {
					e.removeListener();
				}
			}

			function h$$1(a$$0) {
				var b = CKEDITOR.dom.element.createFromHtml('<div data-cke-hidden-sel="1" data-cke-temp="1" style="' + (CKEDITOR.env.ie ? "display:none" : "position:fixed;top:0;left:-1000px") + '">&nbsp;</div>', a$$0.document);
				a$$0.fire("lockSnapshot");
				a$$0.editable().append(b);
				var d = a$$0.getSelection(1);
				var c = a$$0.createRange();
				var e = d.root.on("selectionchange", function(a) {
					a.cancel();
				}, null, null, 0);
				c.setStartAt(b, CKEDITOR.POSITION_AFTER_START);
				c.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
				d.selectRanges([c]);
				e.removeListener();
				a$$0.fire("unlockSnapshot");
				a$$0._.hiddenSelectionContainer = b;
			}

			function j$$0(a) {
				var b = {
					37: 1,
					39: 1,
					8: 1,
					46: 1
				};
				return function(d) {
					var c = d.data.getKeystroke();
					if (b[c]) {
						var e = a.getSelection().getRanges();
						var h = e[0];
						if (e.length == 1 && h.collapsed) {
							if ((c = h[c < 38 ? "getPreviousEditableNode" : "getNextEditableNode"]()) && (c.type == CKEDITOR.NODE_ELEMENT && c.getAttribute("contenteditable") == "false")) {
								a.getSelection().fake(c);
								d.data.preventDefault();
								d.cancel();
							}
						}
					}
				};
			}

			function k$$0(a) {
				var b = 0;
				for (; b < a.length; b++) {
					var d = a[b];
					if (d.getCommonAncestor().isReadOnly()) {
						a.splice(b, 1);
					}
					if (!d.collapsed) {
						if (d.startContainer.isReadOnly()) {
							var c$$0 = d.startContainer;
							var e$$0;
							for (; c$$0;) {
								if ((e$$0 = c$$0.type == CKEDITOR.NODE_ELEMENT) && c$$0.is("body") || !c$$0.isReadOnly()) {
									break;
								}
								if (e$$0) {
									if (c$$0.getAttribute("contentEditable") == "false") {
										d.setStartAfter(c$$0);
									}
								}
								c$$0 = c$$0.getParent();
							}
						}
						c$$0 = d.startContainer;
						e$$0 = d.endContainer;
						var h = d.startOffset;
						var i = d.endOffset;
						var g = d.clone();
						if (c$$0) {
							if (c$$0.type == CKEDITOR.NODE_TEXT) {
								if (h >= c$$0.getLength()) {
									g.setStartAfter(c$$0);
								} else {
									g.setStartBefore(c$$0);
								}
							}
						}
						if (e$$0) {
							if (e$$0.type == CKEDITOR.NODE_TEXT) {
								if (i) {
									g.setEndAfter(e$$0);
								} else {
									g.setEndBefore(e$$0);
								}
							}
						}
						c$$0 = new CKEDITOR.dom.walker(g);
						c$$0.evaluator = function(c) {
							if (c.type == CKEDITOR.NODE_ELEMENT && c.isReadOnly()) {
								var e = d.clone();
								d.setEndBefore(c);
								if (d.collapsed) {
									a.splice(b--, 1);
								}
								if (!(c.getPosition(g.endContainer) & CKEDITOR.POSITION_CONTAINS)) {
									e.setStartAfter(c);
									if (!e.collapsed) {
										a.splice(b + 1, 0, e);
									}
								}
								return true;
							}
							return false;
						};
						c$$0.next();
					}
				}
				return a;
			}
			var n$$0;
			var m$$0;
			var q$$0 = CKEDITOR.dom.walker.invisible(1);
			var o$$0 = function() {
				function a$$0(b) {
					return function(a) {
						var d = a.editor.createRange();
						if (d.moveToClosestEditablePosition(a.selected, b)) {
							a.editor.getSelection().selectRanges([d]);
						}
						return false;
					};
				}

				function b$$0(a) {
					return function(b) {
						var d = b.editor;
						var c = d.createRange();
						var e;
						if (!(e = c.moveToClosestEditablePosition(b.selected, a))) {
							e = c.moveToClosestEditablePosition(b.selected, !a);
						}
						if (e) {
							d.getSelection().selectRanges([c]);
						}
						d.fire("saveSnapshot");
						b.selected.remove();
						if (!e) {
							c.moveToElementEditablePosition(d.editable());
							d.getSelection().selectRanges([c]);
						}
						d.fire("saveSnapshot");
						return false;
					};
				}
				var d$$0 = a$$0();
				var c$$0 = a$$0(1);
				return {
					37: d$$0,
					38: d$$0,
					39: c$$0,
					40: c$$0,
					8: b$$0(),
					46: b$$0(1)
				};
			}();
			CKEDITOR.on("instanceCreated", function(a$$2) {
				function d$$1() {
					var a = c$$1.getSelection();
					if (a) {
						a.removeAllRanges();
					}
				}
				var c$$1 = a$$2.editor;
				c$$1.on("contentDom", function() {
					var a$$1 = c$$1.document;
					var d$$0 = CKEDITOR.document;
					var h$$0 = c$$1.editable();
					var i = a$$1.getBody();
					var g = a$$1.getDocumentElement();
					var k = h$$0.isInline();
					var n;
					var m;
					if (CKEDITOR.env.gecko) {
						h$$0.attachListener(h$$0, "focus", function(a) {
							a.removeListener();
							if (n !== 0) {
								if ((a = c$$1.getSelection().getNative()) && (a.isCollapsed && a.anchorNode == h$$0.$)) {
									a = c$$1.createRange();
									a.moveToElementEditStart(h$$0);
									a.select();
								}
							}
						}, null, null, -2);
					}
					h$$0.attachListener(h$$0, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
						if (n) {
							if (CKEDITOR.env.webkit) {
								n = c$$1._.previousActive && c$$1._.previousActive.equals(a$$1.getActive());
							}
						}
						c$$1.unlockSelection(n);
						n = 0;
					}, null, null, -1);
					h$$0.attachListener(h$$0, "mousedown", function() {
						n = 0;
					});
					if (CKEDITOR.env.ie || (CKEDITOR.env.opera || k)) {
						var o = function() {
							m = new CKEDITOR.dom.selection(c$$1.getSelection());
							m.lock();
						};
						if (l) {
							h$$0.attachListener(h$$0, "beforedeactivate", o, null, null, -1);
						} else {
							h$$0.attachListener(c$$1, "selectionCheck", o, null, null, -1);
						}
						h$$0.attachListener(h$$0, CKEDITOR.env.webkit ? "DOMFocusOut" : "blur", function() {
							c$$1.lockSelection(m);
							n = 1;
						}, null, null, -1);
						h$$0.attachListener(h$$0, "mousedown", function() {
							n = 0;
						});
					}
					if (CKEDITOR.env.ie && !k) {
						var t;
						h$$0.attachListener(h$$0, "mousedown", function(a) {
							if (a.data.$.button == 2) {
								a = c$$1.document.getSelection();
								if (!a || a.getType() == CKEDITOR.SELECTION_NONE) {
									t = c$$1.window.getScrollPosition();
								}
							}
						});
						h$$0.attachListener(h$$0, "mouseup", function(a) {
							if (a.data.$.button == 2 && t) {
								c$$1.document.$.documentElement.scrollLeft = t.x;
								c$$1.document.$.documentElement.scrollTop = t.y;
							}
							t = null;
						});
						if (a$$1.$.compatMode != "BackCompat") {
							if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) {
								g.on("mousedown", function(a$$0) {
									function b(a) {
										a = a.data.$;
										if (e) {
											var d = i.$.createTextRange();
											try {
												d.moveToPoint(a.x, a.y);
											} catch (c) {}
											e.setEndPoint(f.compareEndPoints("StartToStart", d) < 0 ? "EndToEnd" : "StartToStart", d);
											e.select();
										}
									}

									function c$$0() {
										g.removeListener("mousemove", b);
										d$$0.removeListener("mouseup", c$$0);
										g.removeListener("mouseup", c$$0);
										e.select();
									}
									a$$0 = a$$0.data;
									if (a$$0.getTarget().is("html") && (a$$0.$.y < g.$.clientHeight && a$$0.$.x < g.$.clientWidth)) {
										var e = i.$.createTextRange();
										try {
											e.moveToPoint(a$$0.$.x, a$$0.$.y);
										} catch (h) {}
										var f = e.duplicate();
										g.on("mousemove", b);
										d$$0.on("mouseup", c$$0);
										g.on("mouseup", c$$0);
									}
								});
							}
							if (CKEDITOR.env.version > 7 && CKEDITOR.env.version < 11) {
								g.on("mousedown", function(a) {
									if (a.data.getTarget().is("html")) {
										d$$0.on("mouseup", A);
										g.on("mouseup", A);
									}
								});
								var A = function() {
									d$$0.removeListener("mouseup", A);
									g.removeListener("mouseup", A);
									var b = CKEDITOR.document.$.selection;
									var c = b.createRange();
									if (b.type != "None") {
										if (c.parentElement().ownerDocument == a$$1.$) {
											c.select();
										}
									}
								};
							}
						}
					}
					h$$0.attachListener(h$$0, "selectionchange", b$$1, c$$1);
					h$$0.attachListener(h$$0, "keyup", f$$0, c$$1);
					h$$0.attachListener(h$$0, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
						c$$1.forceNextSelectionCheck();
						c$$1.selectionChange(1);
					});
					if (k ? CKEDITOR.env.webkit || CKEDITOR.env.gecko : CKEDITOR.env.opera) {
						var S;
						h$$0.attachListener(h$$0, "mousedown", function() {
							S = 1;
						});
						h$$0.attachListener(a$$1.getDocumentElement(), "mouseup", function() {
							if (S) {
								f$$0.call(c$$1);
							}
							S = 0;
						});
					} else {
						h$$0.attachListener(CKEDITOR.env.ie ? h$$0 : a$$1.getDocumentElement(), "mouseup", f$$0, c$$1);
					}
					if (CKEDITOR.env.webkit) {
						h$$0.attachListener(a$$1, "keydown", function(a) {
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
									e$$1(h$$0);
							}
						}, null, null, -1);
					}
					h$$0.attachListener(h$$0, "keydown", j$$0(c$$1), null, null, -1);
				});
				c$$1.on("contentDomUnload", c$$1.forceNextSelectionCheck, c$$1);
				c$$1.on("dataReady", function() {
					delete c$$1._.fakeSelection;
					delete c$$1._.hiddenSelectionContainer;
					c$$1.selectionChange(1);
				});
				c$$1.on("loadSnapshot", function() {
					var a$$0 = c$$1.editable().getLast(function(a) {
						return a.type == CKEDITOR.NODE_ELEMENT;
					});
					if (a$$0) {
						if (a$$0.hasAttribute("data-cke-hidden-sel")) {
							a$$0.remove();
						}
					}
				}, null, null, 100);
				if (CKEDITOR.env.ie9Compat) {
					c$$1.on("beforeDestroy", d$$1, null, null, 9);
				}
				if (CKEDITOR.env.webkit) {
					c$$1.on("setData", d$$1);
				}
				c$$1.on("contentDomUnload", function() {
					c$$1.unlockSelection();
				});
				c$$1.on("key", function(a) {
					if (c$$1.mode == "wysiwyg") {
						var b = c$$1.getSelection();
						if (b.isFake) {
							var d = o$$0[a.data.keyCode];
							if (d) {
								return d({
									editor: c$$1,
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
						var c = d$$2(a);
						if (c) {
							if (c.getCustomData("ready")) {
								e$$1(a);
							} else {
								c.setCustomData("ready", 1);
							}
						}
					}, null, null, -1);
					b.on("beforeSetMode", function() {
						e$$1(b.editable());
					}, null, null, -1);
					var c$$0;
					var h;
					a$$0 = function() {
						var a = b.editable();
						if (a) {
							if (a = d$$2(a)) {
								var e = b.document.$.defaultView.getSelection();
								if (e.type == "Caret") {
									if (e.anchorNode == a.$) {
										h = 1;
									}
								}
								c$$0 = a.getText();
								a.setText(g$$0(c$$0));
							}
						}
					};
					var i = function() {
						var a = b.editable();
						if (a) {
							if (a = d$$2(a)) {
								a.setText(c$$0);
								if (h) {
									b.document.$.defaultView.getSelection().setPosition(a.$, a.getLength());
									h = 0;
								}
							}
						}
					};
					b.on("beforeUndoImage", a$$0);
					b.on("afterUndoImage", i);
					b.on("beforeGetData", a$$0, null, null, 0);
					b.on("getData", i);
				}
			});
			CKEDITOR.editor.prototype.selectionChange = function(a) {
				(a ? b$$1 : f$$0).call(this);
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
			var l = typeof window.getSelection != "function";
			var r = 1;
			CKEDITOR.dom.selection = function(a) {
				if (a instanceof CKEDITOR.dom.selection) {
					var b = a;
					a = a.root;
				}
				var d = a instanceof CKEDITOR.dom.element;
				this.rev = b ? b.rev : r++;
				this.document = a instanceof CKEDITOR.dom.document ? a : a.getDocument();
				this.root = a = d ? a : this.document.getBody();
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
				b = l ? this.document.$.selection : this.document.getWindow().$.getSelection();
				if (CKEDITOR.env.webkit) {
					if (b.type == "None" && this.document.getActive().equals(a) || b.type == "Caret" && b.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT) {
						i$$0(a, b);
					}
				} else {
					if (CKEDITOR.env.gecko) {
						if (b) {
							if (this.document.getActive().equals(a) && (b.anchorNode && b.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT)) {
								i$$0(a, b, true);
							}
						}
					} else {
						if (CKEDITOR.env.ie) {
							var c;
							try {
								c = this.document.getActive();
							} catch (e) {}
							if (l) {
								if (b.type == "None") {
									if (c && c.equals(this.document.getDocumentElement())) {
										i$$0(a, null, true);
									}
								}
							} else {
								if (b = b && b.anchorNode) {
									b = new CKEDITOR.dom.node(b);
								}
								if (c) {
									if (c.equals(this.document.getDocumentElement()) && (b && (a.equals(b) || a.contains(b)))) {
										i$$0(a, null, true);
									}
								}
							}
						}
					}
				}
				c = this.getNative();
				var h;
				var g;
				if (c) {
					if (c.getRangeAt) {
						h = (g = c.rangeCount && c.getRangeAt(0)) && new CKEDITOR.dom.node(g.commonAncestorContainer);
					} else {
						try {
							g = c.createRange();
						} catch (f) {}
						h = g && CKEDITOR.dom.element.get(g.item && g.item(0) || g.parentElement());
					}
				}
				if (!h || (!(h.type == CKEDITOR.NODE_ELEMENT || h.type == CKEDITOR.NODE_TEXT) || !this.root.equals(h) && !this.root.contains(h))) {
					this._.cache.type = CKEDITOR.SELECTION_NONE;
					this._.cache.startElement = null;
					this._.cache.selectedElement = null;
					this._.cache.selectedText = "";
					this._.cache.ranges = new CKEDITOR.dom.rangeList;
				}
				return this;
			};
			var p = {
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
					return this._.cache.nativeSel !== void 0 ? this._.cache.nativeSel : this._.cache.nativeSel = l ? this.document.$.selection : this.document.getWindow().$.getSelection();
				},
				getType: l ? function() {
					var a = this._.cache;
					if (a.type) {
						return a.type;
					}
					var b = CKEDITOR.SELECTION_NONE;
					try {
						var d = this.getNative();
						var c = d.type;
						if (c == "Text") {
							b = CKEDITOR.SELECTION_TEXT;
						}
						if (c == "Control") {
							b = CKEDITOR.SELECTION_ELEMENT;
						}
						if (d.createRange().parentElement()) {
							b = CKEDITOR.SELECTION_TEXT;
						}
					} catch (e) {}
					return a.type = b;
				} : function() {
					var a = this._.cache;
					if (a.type) {
						return a.type;
					}
					var b = CKEDITOR.SELECTION_TEXT;
					var d = this.getNative();
					if (!d || !d.rangeCount) {
						b = CKEDITOR.SELECTION_NONE;
					} else {
						if (d.rangeCount == 1) {
							d = d.getRangeAt(0);
							var c = d.startContainer;
							if (c == d.endContainer && (c.nodeType == 1 && (d.endOffset - d.startOffset == 1 && p[c.childNodes[d.startOffset].nodeName.toLowerCase()]))) {
								b = CKEDITOR.SELECTION_ELEMENT;
							}
						}
					}
					return a.type = b;
				},
				getRanges: function() {
					var a$$1 = l ? function() {
						function a$$0(b) {
							return (new CKEDITOR.dom.node(b)).getIndex();
						}
						var b$$0 = function(b, d) {
							b = b.duplicate();
							b.collapse(d);
							var c = b.parentElement();
							if (!c.hasChildNodes()) {
								return {
									container: c,
									offset: 0
								};
							}
							var e = c.children;
							var h;
							var i;
							var g = b.duplicate();
							var f = 0;
							var j = e.length - 1;
							var k = -1;
							var A;
							var n;
							for (; f <= j;) {
								k = Math.floor((f + j) / 2);
								h = e[k];
								g.moveToElementText(h);
								A = g.compareEndPoints("StartToStart", b);
								if (A > 0) {
									j = k - 1;
								} else {
									if (A < 0) {
										f = k + 1;
									} else {
										return {
											container: c,
											offset: a$$0(h)
										};
									}
								}
							}
							if (k == -1 || k == e.length - 1 && A < 0) {
								g.moveToElementText(c);
								g.setEndPoint("StartToStart", b);
								g = g.text.replace(/(\r\n|\r)/g, "\n").length;
								e = c.childNodes;
								if (!g) {
									h = e[e.length - 1];
									return h.nodeType != CKEDITOR.NODE_TEXT ? {
										container: c,
										offset: e.length
									} : {
										container: h,
										offset: h.nodeValue.length
									};
								}
								c = e.length;
								for (; g > 0 && c > 0;) {
									i = e[--c];
									if (i.nodeType == CKEDITOR.NODE_TEXT) {
										n = i;
										g = g - i.nodeValue.length;
									}
								}
								return {
									container: n,
									offset: -g
								};
							}
							g.collapse(A > 0 ? true : false);
							g.setEndPoint(A > 0 ? "StartToStart" : "EndToStart", b);
							g = g.text.replace(/(\r\n|\r)/g, "\n").length;
							if (!g) {
								return {
									container: c,
									offset: a$$0(h) + (A > 0 ? 0 : 1)
								};
							}
							for (; g > 0;) {
								try {
									i = h[A > 0 ? "previousSibling" : "nextSibling"];
									if (i.nodeType == CKEDITOR.NODE_TEXT) {
										g = g - i.nodeValue.length;
										n = i;
									}
									h = i;
								} catch (m) {
									return {
										container: c,
										offset: a$$0(h)
									};
								}
							}
							return {
								container: n,
								offset: A > 0 ? -g : n.nodeValue.length + g
							};
						};
						return function() {
							var a = this.getNative();
							var d = a && a.createRange();
							var c = this.getType();
							if (!a) {
								return [];
							}
							if (c == CKEDITOR.SELECTION_TEXT) {
								a = new CKEDITOR.dom.range(this.root);
								c = b$$0(d, true);
								a.setStart(new CKEDITOR.dom.node(c.container), c.offset);
								c = b$$0(d);
								a.setEnd(new CKEDITOR.dom.node(c.container), c.offset);
								if (a.endContainer.getPosition(a.startContainer) & CKEDITOR.POSITION_PRECEDING) {
									if (a.endOffset <= a.startContainer.getIndex()) {
										a.collapse();
									}
								}
								return [a];
							}
							if (c == CKEDITOR.SELECTION_ELEMENT) {
								c = [];
								var e = 0;
								for (; e < d.length; e++) {
									var h = d.item(e);
									var i = h.parentNode;
									var g = 0;
									a = new CKEDITOR.dom.range(this.root);
									for (; g < i.childNodes.length && i.childNodes[g] != h; g++) {}
									a.setStart(new CKEDITOR.dom.node(i), g);
									a.setEnd(new CKEDITOR.dom.node(i), g + 1);
									c.push(a);
								}
								return c;
							}
							return [];
						};
					}() : function() {
						var a = [];
						var b;
						var d = this.getNative();
						if (!d) {
							return a;
						}
						var c = 0;
						for (; c < d.rangeCount; c++) {
							var e = d.getRangeAt(c);
							b = new CKEDITOR.dom.range(this.root);
							b.setStart(new CKEDITOR.dom.node(e.startContainer), e.startOffset);
							b.setEnd(new CKEDITOR.dom.node(e.endContainer), e.endOffset);
							a.push(b);
						}
						return a;
					};
					return function(b) {
						var d = this._.cache;
						var c = d.ranges;
						if (!c) {
							d.ranges = c = new CKEDITOR.dom.rangeList(a$$1.call(this));
						}
						return !b ? c : k$$0(new CKEDITOR.dom.rangeList(c.slice()));
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
							var d = this.getRanges()[0];
							if (d) {
								if (d.collapsed) {
									b = d.startContainer;
									if (b.type != CKEDITOR.NODE_ELEMENT) {
										b = b.getParent();
									}
								} else {
									d.optimize();
									for (;;) {
										b = d.startContainer;
										if (d.startOffset == (b.getChildCount ? b.getChildCount() : b.getLength()) && !b.isBlockBoundary()) {
											d.setStartAfter(b);
										} else {
											break;
										}
									}
									b = d.startContainer;
									if (b.type != CKEDITOR.NODE_ELEMENT) {
										return b.getParent();
									}
									b = b.getChild(d.startOffset);
									if (!b || b.type != CKEDITOR.NODE_ELEMENT) {
										b = d.startContainer;
									} else {
										d = b.getFirst();
										for (; d && d.type == CKEDITOR.NODE_ELEMENT;) {
											b = d;
											d = d.getFirst();
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
					var d$$0 = CKEDITOR.tools.tryThese(function() {
						return b.getNative().createRange().item(0);
					}, function() {
						var a = b.getRanges()[0].clone();
						var d;
						var c;
						var e = 2;
						for (; e && (!(d = a.getEnclosedNode()) || !(d.type == CKEDITOR.NODE_ELEMENT && (p[d.getName()] && (c = d)))); e--) {
							a.shrink(CKEDITOR.SHRINK_ELEMENT);
						}
						return c && c.$;
					});
					return a$$0.selectedElement = d$$0 ? new CKEDITOR.dom.element(d$$0) : null;
				},
				getSelectedText: function() {
					var a = this._.cache;
					if (a.selectedText !== void 0) {
						return a.selectedText;
					}
					var b = this.getNative();
					b = l ? b.type == "Control" ? "" : b.createRange().text : b.toString();
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
							var d = !b && this.getRanges();
							var c = this.isFake;
						}
						this.isLocked = 0;
						this.reset();
						if (a) {
							if (a = b || d[0] && d[0].getCommonAncestor()) {
								if (a.getAscendant("body", 1)) {
									if (c) {
										this.fake(b);
									} else {
										if (b) {
											this.selectElement(b);
										} else {
											this.selectRanges(d);
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
					this.rev = r++;
				},
				selectElement: function(a) {
					var b = new CKEDITOR.dom.range(this.root);
					b.setStartBefore(a);
					b.setEndAfter(a);
					this.selectRanges([b]);
				},
				selectRanges: function(b) {
					var d = this.root.editor;
					d = d && d._.hiddenSelectionContainer;
					this.reset();
					if (d) {
						d = this.root;
						var c;
						var h = 0;
						for (; h < b.length; ++h) {
							c = b[h];
							if (c.endContainer.equals(d)) {
								c.endOffset = Math.min(c.endOffset, d.getChildCount());
							}
						}
					}
					if (b.length) {
						if (this.isLocked) {
							var i = CKEDITOR.document.getActive();
							this.unlock();
							this.selectRanges(b);
							this.lock();
							if (!i.equals(this.root)) {
								i.focus();
							}
						} else {
							var g;
							a: {
								var f;
								var j;
								if (b.length == 1 && (!(j = b[0]).collapsed && ((g = j.getEnclosedNode()) && g.type == CKEDITOR.NODE_ELEMENT))) {
									j = j.clone();
									j.shrink(CKEDITOR.SHRINK_ELEMENT, true);
									if ((f = j.getEnclosedNode()) && f.type == CKEDITOR.NODE_ELEMENT) {
										g = f;
									}
									if (g.getAttribute("contenteditable") == "false") {
										break a;
									}
								}
								g = void 0;
							}
							if (g) {
								this.fake(g);
							} else {
								if (l) {
									j = CKEDITOR.dom.walker.whitespaces(true);
									f = /\ufeff|\u00a0/;
									d = {
										table: 1,
										tbody: 1,
										tr: 1
									};
									if (b.length > 1) {
										g = b[b.length - 1];
										b[0].setEnd(g.endContainer, g.endOffset);
									}
									g = b[0];
									b = g.collapsed;
									var k;
									var n;
									var m;
									if ((c = g.getEnclosedNode()) && (c.type == CKEDITOR.NODE_ELEMENT && (c.getName() in p && (!c.is("a") || !c.getText())))) {
										try {
											m = c.$.createControlRange();
											m.addElement(c.$);
											m.select();
											return;
										} catch (o) {}
									}
									if (g.startContainer.type == CKEDITOR.NODE_ELEMENT && g.startContainer.getName() in d || g.endContainer.type == CKEDITOR.NODE_ELEMENT && g.endContainer.getName() in d) {
										g.shrink(CKEDITOR.NODE_ELEMENT, true);
									}
									m = g.createBookmark();
									d = m.startNode;
									if (!b) {
										i = m.endNode;
									}
									m = g.document.$.body.createTextRange();
									m.moveToElementText(d.$);
									m.moveStart("character", 1);
									if (i) {
										f = g.document.$.body.createTextRange();
										f.moveToElementText(i.$);
										m.setEndPoint("EndToEnd", f);
										m.moveEnd("character", -1);
									} else {
										k = d.getNext(j);
										n = d.hasAscendant("pre");
										k = !(k && (k.getText && k.getText().match(f))) && (n || (!d.hasPrevious() || d.getPrevious().is && d.getPrevious().is("br")));
										n = g.document.createElement("span");
										n.setHtml("&#65279;");
										n.insertBefore(d);
										if (k) {
											g.document.createText("\ufeff").insertBefore(d);
										}
									}
									g.setStartBefore(d);
									d.remove();
									if (b) {
										if (k) {
											m.moveStart("character", -1);
											m.select();
											g.document.$.selection.clear();
										} else {
											m.select();
										}
										g.moveToPosition(n, CKEDITOR.POSITION_BEFORE_START);
										n.remove();
									} else {
										g.setEndBefore(i);
										i.remove();
										m.select();
									}
								} else {
									i = this.getNative();
									if (!i) {
										return;
									}
									if (CKEDITOR.env.opera) {
										m = this.document.$.createRange();
										m.selectNodeContents(this.root.$);
										i.addRange(m);
									}
									this.removeAllRanges();
									m = 0;
									for (; m < b.length; m++) {
										if (m < b.length - 1) {
											g = b[m];
											k = b[m + 1];
											f = g.clone();
											f.setStart(g.endContainer, g.endOffset);
											f.setEnd(k.startContainer, k.startOffset);
											if (!f.collapsed) {
												f.shrink(CKEDITOR.NODE_ELEMENT, true);
												n = f.getCommonAncestor();
												f = f.getEnclosedNode();
												if (n.isReadOnly() || f && f.isReadOnly()) {
													k.setStart(g.startContainer, g.startOffset);
													b.splice(m--, 1);
													continue;
												}
											}
										}
										g = b[m];
										n = this.document.$.createRange();
										k = g.startContainer;
										if (CKEDITOR.env.opera && (g.collapsed && k.type == CKEDITOR.NODE_ELEMENT)) {
											f = k.getChild(g.startOffset - 1);
											j = k.getChild(g.startOffset);
											if (!f && (!j && k.is(CKEDITOR.dtd.$removeEmpty)) || (f && f.type == CKEDITOR.NODE_ELEMENT || j && j.type == CKEDITOR.NODE_ELEMENT)) {
												g.insertNode(this.document.createText(""));
												g.collapse(1);
											}
										}
										if (g.collapsed && (CKEDITOR.env.webkit && a$$3(g))) {
											k = this.root;
											e$$1(k, false);
											f = k.getDocument().createText("\u200b");
											k.setCustomData("cke-fillingChar", f);
											g.insertNode(f);
											if ((k = f.getNext()) && (!f.getPrevious() && (k.type == CKEDITOR.NODE_ELEMENT && k.getName() == "br"))) {
												e$$1(this.root);
												g.moveToPosition(k, CKEDITOR.POSITION_BEFORE_START);
											} else {
												g.moveToPosition(f, CKEDITOR.POSITION_AFTER_END);
											}
										}
										n.setStart(g.startContainer.$, g.startOffset);
										try {
											n.setEnd(g.endContainer.$, g.endOffset);
										} catch (q) {
											if (q.toString().indexOf("NS_ERROR_ILLEGAL_VALUE") >= 0) {
												g.collapse(1);
												n.setEnd(g.endContainer.$, g.endOffset);
											} else {
												throw q;
											}
										}
										i.addRange(n);
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
					h$$1(b);
					var d = this._.cache;
					var c = new CKEDITOR.dom.range(this.root);
					c.setStartBefore(a);
					c.setEndAfter(a);
					d.ranges = new CKEDITOR.dom.rangeList(c);
					d.selectedElement = d.startElement = a;
					d.type = CKEDITOR.SELECTION_ELEMENT;
					d.selectedText = d.nativeSel = null;
					this.isFake = 1;
					this.rev = r++;
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
					var d = 0;
					for (; d < a.length; d++) {
						var c = new CKEDITOR.dom.range(this.root);
						c.moveToBookmark(a[d]);
						b.push(c);
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
								a[l ? "empty" : "removeAllRanges"]();
							}
						} catch (b) {}
						this.reset();
					}
				}
			};
		})();
		"use strict";
		CKEDITOR.editor.prototype.attachStyleStateChange = function(b$$0, f) {
			var c = this._.styleStateChangeCallbacks;
			if (!c) {
				c = this._.styleStateChangeCallbacks = [];
				this.on("selectionChange", function(a) {
					var b = 0;
					for (; b < c.length; b++) {
						var e = c[b];
						var g = e.style.checkActive(a.data.path) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
						e.fn.call(this, g);
					}
				});
			}
			c.push({
				style: b$$0,
				fn: f
			});
		};
		CKEDITOR.STYLE_BLOCK = 1;
		CKEDITOR.STYLE_INLINE = 2;
		CKEDITOR.STYLE_OBJECT = 3;
		(function() {
			function b$$1(a, b) {
				var d;
				var c;
				for (; a = a.getParent();) {
					if (a.equals(b)) {
						break;
					}
					if (a.getAttribute("data-nostyle")) {
						d = a;
					} else {
						if (!c) {
							var e = a.getAttribute("contentEditable");
							if (e == "false") {
								d = a;
							} else {
								if (e == "true") {
									c = 1;
								}
							}
						}
					}
				}
				return d;
			}

			function f$$0(d) {
				var c = d.document;
				if (d.collapsed) {
					c = r(this, c);
					d.insertNode(c);
					d.moveToPosition(c, CKEDITOR.POSITION_BEFORE_END);
				} else {
					var e = this.element;
					var h = this._.definition;
					var i;
					var g = h.ignoreReadonly;
					var j = g || h.includeReadonly;
					if (j == void 0) {
						j = d.root.getCustomData("cke_includeReadonly");
					}
					var k = CKEDITOR.dtd[e];
					if (!k) {
						i = true;
						k = CKEDITOR.dtd.span;
					}
					d.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
					d.trim();
					var n = d.createBookmark();
					var m = n.startNode;
					var o = n.endNode;
					var l = m;
					var t;
					if (!g) {
						var p = d.getCommonAncestor();
						g = b$$1(m, p);
						p = b$$1(o, p);
						if (g) {
							l = g.getNextSourceNode(true);
						}
						if (p) {
							o = p;
						}
					}
					if (l.getPosition(o) == CKEDITOR.POSITION_FOLLOWING) {
						l = 0;
					}
					for (; l;) {
						g = false;
						if (l.equals(o)) {
							l = null;
							g = true;
						} else {
							var s = l.type == CKEDITOR.NODE_ELEMENT ? l.getName() : null;
							p = s && l.getAttribute("contentEditable") == "false";
							var w = s && l.getAttribute("data-nostyle");
							if (s && l.data("cke-bookmark")) {
								l = l.getNextSourceNode(true);
								continue;
							}
							if (p && (j && CKEDITOR.dtd.$block[s])) {
								var B = l;
								var v = a$$1(B);
								var u = void 0;
								var x = v.length;
								var F = 0;
								B = x && new CKEDITOR.dom.range(B.getDocument());
								for (; F < x; ++F) {
									u = v[F];
									var z = CKEDITOR.filter.instances[u.data("cke-filter")];
									if (z ? z.check(this) : 1) {
										B.selectNodeContents(u);
										f$$0.call(this, B);
									}
								}
							}
							v = s ? !k[s] || w ? 0 : p && !j ? 0 : (l.getPosition(o) | O) == O && (!h.childRule || h.childRule(l)) : 1;
							if (v) {
								if ((v = l.getParent()) && (((v.getDtd() || CKEDITOR.dtd.span)[e] || i) && (!h.parentRule || h.parentRule(v)))) {
									if (!t && (!s || (!CKEDITOR.dtd.$removeEmpty[s] || (l.getPosition(o) | O) == O))) {
										t = d.clone();
										t.setStartBefore(l);
									}
									s = l.type;
									if (s == CKEDITOR.NODE_TEXT || (p || s == CKEDITOR.NODE_ELEMENT && !l.getChildCount())) {
										s = l;
										var ca;
										for (;
											(g = !s.getNext(H)) && ((ca = s.getParent(), k[ca.getName()]) && ((ca.getPosition(m) | G) == G && (!h.childRule || h.childRule(ca))));) {
											s = ca;
										}
										t.setEndAfter(s);
									}
								} else {
									g = true;
								}
							} else {
								g = true;
							}
							l = l.getNextSourceNode(w || p);
						}
						if (g && (t && !t.collapsed)) {
							g = r(this, c);
							p = g.hasAttributes();
							w = t.getCommonAncestor();
							s = {};
							v = {};
							u = {};
							x = {};
							var P;
							var C;
							var $;
							for (; g && w;) {
								if (w.getName() == e) {
									for (P in h.attributes) {
										if (!x[P] && ($ = w.getAttribute(C))) {
											if (g.getAttribute(P) == $) {
												v[P] = 1;
											} else {
												x[P] = 1;
											}
										}
									}
									for (C in h.styles) {
										if (!u[C] && ($ = w.getStyle(C))) {
											if (g.getStyle(C) == $) {
												s[C] = 1;
											} else {
												u[C] = 1;
											}
										}
									}
								}
								w = w.getParent();
							}
							for (P in v) {
								g.removeAttribute(P);
							}
							for (C in s) {
								g.removeStyle(C);
							}
							if (p) {
								if (!g.hasAttributes()) {
									g = null;
								}
							}
							if (g) {
								t.extractContents().appendTo(g);
								t.insertNode(g);
								q.call(this, g);
								g.mergeSiblings();
								if (!CKEDITOR.env.ie) {
									g.$.normalize();
								}
							} else {
								g = new CKEDITOR.dom.element("span");
								t.extractContents().appendTo(g);
								t.insertNode(g);
								q.call(this, g);
								g.remove(true);
							}
							t = null;
						}
					}
					d.moveToBookmark(n);
					d.shrink(CKEDITOR.SHRINK_TEXT);
					d.shrink(CKEDITOR.NODE_ELEMENT, true);
				}
			}

			function c$$0(a$$0) {
				function b() {
					var a = new CKEDITOR.dom.elementPath(c.getParent());
					var d = new CKEDITOR.dom.elementPath(j.getParent());
					var e = null;
					var h = null;
					var g = 0;
					for (; g < a.elements.length; g++) {
						var i = a.elements[g];
						if (i == a.block || i == a.blockLimit) {
							break;
						}
						if (k.checkElementRemovable(i)) {
							e = i;
						}
					}
					g = 0;
					for (; g < d.elements.length; g++) {
						i = d.elements[g];
						if (i == d.block || i == d.blockLimit) {
							break;
						}
						if (k.checkElementRemovable(i)) {
							h = i;
						}
					}
					if (h) {
						j.breakParent(h);
					}
					if (e) {
						c.breakParent(e);
					}
				}
				a$$0.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
				var d$$0 = a$$0.createBookmark();
				var c = d$$0.startNode;
				if (a$$0.collapsed) {
					var e$$0 = new CKEDITOR.dom.elementPath(c.getParent(), a$$0.root);
					var h$$0;
					var g$$0 = 0;
					var i$$0;
					for (; g$$0 < e$$0.elements.length && (i$$0 = e$$0.elements[g$$0]); g$$0++) {
						if (i$$0 == e$$0.block || i$$0 == e$$0.blockLimit) {
							break;
						}
						if (this.checkElementRemovable(i$$0)) {
							var f;
							if (a$$0.collapsed && (a$$0.checkBoundaryOfElement(i$$0, CKEDITOR.END) || (f = a$$0.checkBoundaryOfElement(i$$0, CKEDITOR.START)))) {
								h$$0 = i$$0;
								h$$0.match = f ? "start" : "end";
							} else {
								i$$0.mergeSiblings();
								if (i$$0.is(this.element)) {
									m$$0.call(this, i$$0);
								} else {
									o$$0(i$$0, w$$0(this)[i$$0.getName()]);
								}
							}
						}
					}
					if (h$$0) {
						i$$0 = c;
						g$$0 = 0;
						for (;; g$$0++) {
							f = e$$0.elements[g$$0];
							if (f.equals(h$$0)) {
								break;
							} else {
								if (f.match) {
									continue;
								} else {
									f = f.clone();
								}
							}
							f.append(i$$0);
							i$$0 = f;
						}
						i$$0[h$$0.match == "start" ? "insertBefore" : "insertAfter"](h$$0);
					}
				} else {
					var j = d$$0.endNode;
					var k = this;
					b();
					e$$0 = c;
					for (; !e$$0.equals(j);) {
						h$$0 = e$$0.getNextSourceNode();
						if (e$$0.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable(e$$0)) {
							if (e$$0.getName() == this.element) {
								m$$0.call(this, e$$0);
							} else {
								o$$0(e$$0, w$$0(this)[e$$0.getName()]);
							}
							if (h$$0.type == CKEDITOR.NODE_ELEMENT && h$$0.contains(c)) {
								b();
								h$$0 = c.getNext();
							}
						}
						e$$0 = h$$0;
					}
				}
				a$$0.moveToBookmark(d$$0);
				a$$0.shrink(CKEDITOR.NODE_ELEMENT, true);
			}

			function a$$1(a$$0) {
				var b = [];
				a$$0.forEach(function(a) {
					if (a.getAttribute("contenteditable") == "true") {
						b.push(a);
						return false;
					}
				}, CKEDITOR.NODE_ELEMENT, true);
				return b;
			}

			function d$$1(a) {
				var b = a.getEnclosedNode() || a.getCommonAncestor(false, true);
				if (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) {
					if (!a.isReadOnly()) {
						p$$0(a, this);
					}
				}
			}

			function e$$1(a) {
				var b = a.getCommonAncestor(true, true);
				if (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) {
					b = this._.definition;
					var d = b.attributes;
					if (d) {
						var c;
						for (c in d) {
							a.removeAttribute(c, d[c]);
						}
					}
					if (b.styles) {
						var e;
						for (e in b.styles) {
							if (b.styles.hasOwnProperty(e)) {
								a.removeStyle(e);
							}
						}
					}
				}
			}

			function g$$1(a) {
				var b = a.createBookmark(true);
				var d = a.createIterator();
				d.enforceRealBlocks = true;
				if (this._.enterMode) {
					d.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
				}
				var c;
				var e = a.document;
				var g;
				for (; c = d.getNextParagraph();) {
					if (!c.isReadOnly() && (d.activeFilter ? d.activeFilter.check(this) : 1)) {
						g = r(this, e, c);
						h$$1(c, g);
					}
				}
				a.moveToBookmark(b);
			}

			function i$$1(a) {
				var b = a.createBookmark(1);
				var d = a.createIterator();
				d.enforceRealBlocks = true;
				d.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
				var c;
				var e;
				for (; c = d.getNextParagraph();) {
					if (this.checkElementRemovable(c)) {
						if (c.is("pre")) {
							if (e = this._.enterMode == CKEDITOR.ENTER_BR ? null : a.document.createElement(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div")) {
								c.copyAttributes(e);
							}
							h$$1(c, e);
						} else {
							m$$0.call(this, c);
						}
					}
				}
				a.moveToBookmark(b);
			}

			function h$$1(a, b) {
				var d = !b;
				if (d) {
					b = a.getDocument().createElement("div");
					a.copyAttributes(b);
				}
				var c = b && b.is("pre");
				var e = a.is("pre");
				var h = !c && e;
				if (c && !e) {
					e = b;
					if (h = a.getBogus()) {
						h.remove();
					}
					h = a.getHtml();
					h = k$$0(h, /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, "");
					h = h.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, "$1");
					h = h.replace(/([ \t\n\r]+|&nbsp;)/g, " ");
					h = h.replace(/<br\b[^>]*>/gi, "\n");
					if (CKEDITOR.env.ie) {
						var g = a.getDocument().createElement("div");
						g.append(e);
						e.$.outerHTML = "<pre>" + h + "</pre>";
						e.copyAttributes(g.getFirst());
						e = g.getFirst().remove();
					} else {
						e.setHtml(h);
					}
					b = e;
				} else {
					if (h) {
						b = n$$0(d ? [a.getHtml()] : j$$0(a), b);
					} else {
						a.moveChildren(b);
					}
				}
				b.replace(a);
				if (c) {
					d = b;
					var i;
					if ((i = d.getPrevious(F$$0)) && (i.type == CKEDITOR.NODE_ELEMENT && i.is("pre"))) {
						c = k$$0(i.getHtml(), /\n$/, "") + "\n\n" + k$$0(d.getHtml(), /^\n/, "");
						if (CKEDITOR.env.ie) {
							d.$.outerHTML = "<pre>" + c + "</pre>";
						} else {
							d.setHtml(c);
						}
						i.remove();
					}
				} else {
					if (d) {
						l$$0(b);
					}
				}
			}

			function j$$0(a$$0) {
				a$$0.getName();
				var b$$0 = [];
				k$$0(a$$0.getOuterHtml(), /(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi, function(a, b, d) {
					return b + "</pre>" + d + "<pre>";
				}).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi, function(a, d) {
					b$$0.push(d);
				});
				return b$$0;
			}

			function k$$0(a$$0, b$$0, d$$0) {
				var c = "";
				var e = "";
				a$$0 = a$$0.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi, function(a, b, d) {
					if (b) {
						c = b;
					}
					if (d) {
						e = d;
					}
					return "";
				});
				return c + a$$0.replace(b$$0, d$$0) + e;
			}

			function n$$0(a$$0, b$$0) {
				var d;
				if (a$$0.length > 1) {
					d = new CKEDITOR.dom.documentFragment(b$$0.getDocument());
				}
				var c = 0;
				for (; c < a$$0.length; c++) {
					var e = a$$0[c];
					e = e.replace(/(\r\n|\r)/g, "\n");
					e = k$$0(e, /^[ \t]*\n/, "");
					e = k$$0(e, /\n$/, "");
					e = k$$0(e, /^[ \t]+|[ \t]+$/g, function(a, b) {
						return a.length == 1 ? "&nbsp;" : b ? " " + CKEDITOR.tools.repeat("&nbsp;", a.length - 1) : CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " ";
					});
					e = e.replace(/\n/g, "<br>");
					e = e.replace(/[ \t]{2,}/g, function(a) {
						return CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " ";
					});
					if (d) {
						var h = b$$0.clone();
						h.setHtml(e);
						d.append(h);
					} else {
						b$$0.setHtml(e);
					}
				}
				return d || b$$0;
			}

			function m$$0(a, b) {
				var d = this._.definition;
				var c = d.attributes;
				d = d.styles;
				var e = w$$0(this)[a.getName()];
				var h = CKEDITOR.tools.isEmpty(c) && CKEDITOR.tools.isEmpty(d);
				var g;
				for (g in c) {
					if (!((g == "class" || this._.definition.fullMatch) && a.getAttribute(g) != s$$0(g, c[g])) && !(b && g.slice(0, 5) == "data-")) {
						h = a.hasAttribute(g);
						a.removeAttribute(g);
					}
				}
				var i;
				for (i in d) {
					if (!(this._.definition.fullMatch && a.getStyle(i) != s$$0(i, d[i], true))) {
						h = h || !!a.getStyle(i);
						a.removeStyle(i);
					}
				}
				o$$0(a, e, z$$0[a.getName()]);
				if (h) {
					if (this._.definition.alwaysRemoveElement) {
						l$$0(a, 1);
					} else {
						if (!CKEDITOR.dtd.$block[a.getName()] || this._.enterMode == CKEDITOR.ENTER_BR && !a.hasAttributes()) {
							l$$0(a);
						} else {
							a.renameNode(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div");
						}
					}
				}
			}

			function q(a) {
				var b = w$$0(this);
				var d = a.getElementsByTag(this.element);
				var c;
				var e = d.count();
				for (; --e >= 0;) {
					c = d.getItem(e);
					if (!c.isReadOnly()) {
						m$$0.call(this, c, true);
					}
				}
				var h;
				for (h in b) {
					if (h != this.element) {
						d = a.getElementsByTag(h);
						e = d.count() - 1;
						for (; e >= 0; e--) {
							c = d.getItem(e);
							if (!c.isReadOnly()) {
								o$$0(c, b[h]);
							}
						}
					}
				}
			}

			function o$$0(a, b, d) {
				if (b = b && b.attributes) {
					var c = 0;
					for (; c < b.length; c++) {
						var e = b[c][0];
						var h;
						if (h = a.getAttribute(e)) {
							var g = b[c][1];
							if (g === null || (g.test && g.test(h) || typeof g == "string" && h == g)) {
								a.removeAttribute(e);
							}
						}
					}
				}
				if (!d) {
					l$$0(a);
				}
			}

			function l$$0(a, b) {
				if (!a.hasAttributes() || b) {
					if (CKEDITOR.dtd.$block[a.getName()]) {
						var d = a.getPrevious(F$$0);
						var c = a.getNext(F$$0);
						if (d) {
							if (d.type == CKEDITOR.NODE_TEXT || !d.isBlockBoundary({
								br: 1
							})) {
								a.append("br", 1);
							}
						}
						if (c) {
							if (c.type == CKEDITOR.NODE_TEXT || !c.isBlockBoundary({
								br: 1
							})) {
								a.append("br");
							}
						}
						a.remove(true);
					} else {
						d = a.getFirst();
						c = a.getLast();
						a.remove(true);
						if (d) {
							if (d.type == CKEDITOR.NODE_ELEMENT) {
								d.mergeSiblings();
							}
							if (c) {
								if (!d.equals(c) && c.type == CKEDITOR.NODE_ELEMENT) {
									c.mergeSiblings();
								}
							}
						}
					}
				}
			}

			function r(a, b, d) {
				var c;
				c = a.element;
				if (c == "*") {
					c = "span";
				}
				c = new CKEDITOR.dom.element(c, b);
				if (d) {
					d.copyAttributes(c);
				}
				c = p$$0(c, a);
				if (b.getCustomData("doc_processing_style") && c.hasAttribute("id")) {
					c.removeAttribute("id");
				} else {
					b.setCustomData("doc_processing_style", 1);
				}
				return c;
			}

			function p$$0(a, b) {
				var d = b._.definition;
				var c = d.attributes;
				d = CKEDITOR.style.getStyleText(d);
				if (c) {
					var e;
					for (e in c) {
						a.setAttribute(e, c[e]);
					}
				}
				if (d) {
					a.setAttribute("style", d);
				}
				return a;
			}

			function t$$0(a$$0, b) {
				var d$$0;
				for (d$$0 in a$$0) {
					a$$0[d$$0] = a$$0[d$$0].replace(B$$0, function(a, d) {
						return b[d];
					});
				}
			}

			function w$$0(a) {
				if (a._.overrides) {
					return a._.overrides;
				}
				var b = a._.overrides = {};
				var d = a._.definition.overrides;
				if (d) {
					if (!CKEDITOR.tools.isArray(d)) {
						d = [d];
					}
					var c = 0;
					for (; c < d.length; c++) {
						var e = d[c];
						var h;
						var g;
						if (typeof e == "string") {
							h = e.toLowerCase();
						} else {
							h = e.element ? e.element.toLowerCase() : a.element;
							g = e.attributes;
						}
						e = b[h] || (b[h] = {});
						if (g) {
							e = e.attributes = e.attributes || [];
							var i;
							for (i in g) {
								e.push([i.toLowerCase(), g[i]]);
							}
						}
					}
				}
				return b;
			}

			function s$$0(a, b, d) {
				var c = new CKEDITOR.dom.element("span");
				c[d ? "setStyle" : "setAttribute"](a, b);
				return c[d ? "getStyle" : "getAttribute"](a);
			}

			function v$$0(a, b) {
				var d = a.document;
				var c = a.getRanges();
				var e = b ? this.removeFromRange : this.applyToRange;
				var h;
				var g = c.createIterator();
				for (; h = g.getNextRange();) {
					e.call(this, h);
				}
				a.selectRanges(c);
				d.removeCustomData("doc_processing_style");
			}
			var z$$0 = {
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
			var u$$0 = {
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
			var x$$0 = /\s*(?:;\s*|$)/;
			var B$$0 = /#\((.+?)\)/g;
			var H = CKEDITOR.dom.walker.bookmark(0, 1);
			var F$$0 = CKEDITOR.dom.walker.whitespaces(1);
			CKEDITOR.style = function(a, b) {
				var d = a.attributes;
				if (d && d.style) {
					a.styles = CKEDITOR.tools.extend({}, a.styles, CKEDITOR.tools.parseCssText(d.style));
					delete d.style;
				}
				if (b) {
					a = CKEDITOR.tools.clone(a);
					t$$0(a.attributes, b);
					t$$0(a.styles, b);
				}
				d = this.element = a.element ? typeof a.element == "string" ? a.element.toLowerCase() : a.element : "*";
				this.type = a.type || (z$$0[d] ? CKEDITOR.STYLE_BLOCK : u$$0[d] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE);
				if (typeof this.element == "object") {
					this.type = CKEDITOR.STYLE_OBJECT;
				}
				this._ = {
					definition: a
				};
			};
			CKEDITOR.editor.prototype.applyStyle = function(a) {
				if (a.checkApplicable(this.elementPath())) {
					v$$0.call(a, this.getSelection());
				}
			};
			CKEDITOR.editor.prototype.removeStyle = function(a) {
				if (a.checkApplicable(this.elementPath())) {
					v$$0.call(a, this.getSelection(), 1);
				}
			};
			CKEDITOR.style.prototype = {
				apply: function(a) {
					v$$0.call(this, a.getSelection());
				},
				remove: function(a) {
					v$$0.call(this, a.getSelection(), 1);
				},
				applyToRange: function(a) {
					return (this.applyToRange = this.type == CKEDITOR.STYLE_INLINE ? f$$0 : this.type == CKEDITOR.STYLE_BLOCK ? g$$1 : this.type == CKEDITOR.STYLE_OBJECT ? d$$1 : null).call(this, a);
				},
				removeFromRange: function(a) {
					return (this.removeFromRange = this.type == CKEDITOR.STYLE_INLINE ? c$$0 : this.type == CKEDITOR.STYLE_BLOCK ? i$$1 : this.type == CKEDITOR.STYLE_OBJECT ? e$$1 : null).call(this, a);
				},
				applyToObject: function(a) {
					p$$0(a, this);
				},
				checkActive: function(a) {
					switch (this.type) {
						case CKEDITOR.STYLE_BLOCK:
							return this.checkElementRemovable(a.block || a.blockLimit, true);
						case CKEDITOR.STYLE_OBJECT:
							;
						case CKEDITOR.STYLE_INLINE:
							var b = a.elements;
							var d = 0;
							var c;
							for (; d < b.length; d++) {
								c = b[d];
								if (!(this.type == CKEDITOR.STYLE_INLINE && (c == a.block || c == a.blockLimit))) {
									if (this.type == CKEDITOR.STYLE_OBJECT) {
										var e = c.getName();
										if (!(typeof this.element == "string" ? e == this.element : e in this.element)) {
											continue;
										}
									}
									if (this.checkElementRemovable(c, true)) {
										return true;
									}
								}
							};
					}
					return false;
				},
				checkApplicable: function(a, b) {
					if (b && !b.check(this)) {
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
					var d = this._.definition;
					if (!a || !d.ignoreReadonly && a.isReadOnly()) {
						return false;
					}
					var c = a.getName();
					if (typeof this.element == "string" ? c == this.element : c in this.element) {
						if (!b && !a.hasAttributes()) {
							return true;
						}
						if (c = d._AC) {
							d = c;
						} else {
							c = {};
							var e = 0;
							var h = d.attributes;
							if (h) {
								var g;
								for (g in h) {
									e++;
									c[g] = h[g];
								}
							}
							if (g = CKEDITOR.style.getStyleText(d)) {
								if (!c.style) {
									e++;
								}
								c.style = g;
							}
							c._length = e;
							d = d._AC = c;
						}
						if (d._length) {
							var i;
							for (i in d) {
								if (i != "_length") {
									e = a.getAttribute(i) || "";
									if (i == "style") {
										a: {
											c = d[i];
											if (typeof c == "string") {
												c = CKEDITOR.tools.parseCssText(c);
											}
											if (typeof e == "string") {
												e = CKEDITOR.tools.parseCssText(e, true);
											}
											g = void 0;
											for (g in c) {
												if (!(g in e && (e[g] == c[g] || (c[g] == "inherit" || e[g] == "inherit")))) {
													c = false;
													break a;
												}
											}
											c = true;
										}
									} else {
										c = d[i] == e;
									}
									if (c) {
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
				checkElementRemovable: function(a, b) {
					if (this.checkElementMatch(a, b)) {
						return true;
					}
					var d = w$$0(this)[a.getName()];
					if (d) {
						var c;
						if (!(d = d.attributes)) {
							return true;
						}
						var e = 0;
						for (; e < d.length; e++) {
							c = d[e][0];
							if (c = a.getAttribute(c)) {
								var h = d[e][1];
								if (h === null || (typeof h == "string" && c == h || h.test(c))) {
									return true;
								}
							}
						}
					}
					return false;
				},
				buildPreview: function(a) {
					var b = this._.definition;
					var d = [];
					var c = b.element;
					if (c == "bdo") {
						c = "span";
					}
					d = ["<", c];
					var e = b.attributes;
					if (e) {
						var h;
						for (h in e) {
							d.push(" ", h, '="', e[h], '"');
						}
					}
					if (e = CKEDITOR.style.getStyleText(b)) {
						d.push(' style="', e, '"');
					}
					d.push(">", a || b.name, "</", c, ">");
					return d.join("");
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
				var d = a.attributes && a.attributes.style || "";
				var c = "";
				if (d.length) {
					d = d.replace(x$$0, ";");
				}
				var e;
				for (e in b) {
					var h = b[e];
					var g = (e + ":" + h).replace(x$$0, ";");
					if (h == "inherit") {
						c = c + g;
					} else {
						d = d + g;
					}
				}
				if (d.length) {
					d = CKEDITOR.tools.normalizeCssText(d, true);
				}
				return a._ST = d + c;
			};
			var O = CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED;
			var G = CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED;
		})();
		CKEDITOR.styleCommand = function(b, f) {
			this.requiredContent = this.allowedContent = this.style = b;
			CKEDITOR.tools.extend(this, f, true);
		};
		CKEDITOR.styleCommand.prototype.exec = function(b) {
			b.focus();
			if (this.state == CKEDITOR.TRISTATE_OFF) {
				b.applyStyle(this.style);
			} else {
				if (this.state == CKEDITOR.TRISTATE_ON) {
					b.removeStyle(this.style);
				}
			}
		};
		CKEDITOR.stylesSet = new CKEDITOR.resourceManager("", "stylesSet");
		CKEDITOR.addStylesSet = CKEDITOR.tools.bind(CKEDITOR.stylesSet.add, CKEDITOR.stylesSet);
		CKEDITOR.loadStylesSet = function(b, f, c) {
			CKEDITOR.stylesSet.addExternal(b, f, "");
			CKEDITOR.stylesSet.load(b, c);
		};
		CKEDITOR.editor.prototype.getStylesSet = function(b) {
			if (this._.stylesDefinitions) {
				b(this._.stylesDefinitions);
			} else {
				var f = this;
				var c = f.config.stylesCombo_stylesSet || f.config.stylesSet;
				if (c === false) {
					b(null);
				} else {
					if (c instanceof Array) {
						f._.stylesDefinitions = c;
						b(c);
					} else {
						if (!c) {
							c = "default";
						}
						c = c.split(":");
						var a = c[0];
						CKEDITOR.stylesSet.addExternal(a, c[1] ? c.slice(1).join(":") : CKEDITOR.getUrl("styles.js"), "");
						CKEDITOR.stylesSet.load(a, function(d) {
							f._.stylesDefinitions = d[a];
							b(f._.stylesDefinitions);
						});
					}
				}
			}
		};
		CKEDITOR.dom.comment = function(b, f) {
			if (typeof b == "string") {
				b = (f ? f.$ : document).createComment(b);
			}
			CKEDITOR.dom.domObject.call(this, b);
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
			var b = {};
			var f = {};
			var c$$0;
			for (c$$0 in CKEDITOR.dtd.$blockLimit) {
				if (!(c$$0 in CKEDITOR.dtd.$list)) {
					b[c$$0] = 1;
				}
			}
			for (c$$0 in CKEDITOR.dtd.$block) {
				if (!(c$$0 in CKEDITOR.dtd.$blockLimit)) {
					if (!(c$$0 in CKEDITOR.dtd.$empty)) {
						f[c$$0] = 1;
					}
				}
			}
			CKEDITOR.dom.elementPath = function(a, d) {
				var c = null;
				var g = null;
				var i = [];
				var h = a;
				var j;
				d = d || a.getDocument().getBody();
				do {
					if (h.type == CKEDITOR.NODE_ELEMENT) {
						i.push(h);
						if (!this.lastElement) {
							this.lastElement = h;
							if (h.is(CKEDITOR.dtd.$object) || h.getAttribute("contenteditable") == "false") {
								continue;
							}
						}
						if (h.equals(d)) {
							break;
						}
						if (!g) {
							j = h.getName();
							if (h.getAttribute("contenteditable") == "true") {
								g = h;
							} else {
								if (!c) {
									if (f[j]) {
										c = h;
									}
								}
							}
							if (b[j]) {
								var k;
								if (k = !c) {
									if (j = j == "div") {
										a: {
											j = h.getChildren();
											k = 0;
											var n = j.count();
											for (; k < n; k++) {
												var m = j.getItem(k);
												if (m.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$block[m.getName()]) {
													j = true;
													break a;
												}
											}
											j = false;
										}
										j = !j;
									}
									k = j;
								}
								if (k) {
									c = h;
								} else {
									g = h;
								}
							}
						}
					}
				} while (h = h.getParent());
				if (!g) {
					g = d;
				}
				this.block = c;
				this.blockLimit = g;
				this.root = d;
				this.elements = i;
			};
		})();
		CKEDITOR.dom.elementPath.prototype = {
			compare: function(b) {
				var f = this.elements;
				b = b && b.elements;
				if (!b || f.length != b.length) {
					return false;
				}
				var c = 0;
				for (; c < f.length; c++) {
					if (!f[c].equals(b[c])) {
						return false;
					}
				}
				return true;
			},
			contains: function(b, f, c) {
				var a$$0;
				if (typeof b == "string") {
					a$$0 = function(a) {
						return a.getName() == b;
					};
				}
				if (b instanceof CKEDITOR.dom.element) {
					a$$0 = function(a) {
						return a.equals(b);
					};
				} else {
					if (CKEDITOR.tools.isArray(b)) {
						a$$0 = function(a) {
							return CKEDITOR.tools.indexOf(b, a.getName()) > -1;
						};
					} else {
						if (typeof b == "function") {
							a$$0 = b;
						} else {
							if (typeof b == "object") {
								a$$0 = function(a) {
									return a.getName() in b;
								};
							}
						}
					}
				}
				var d = this.elements;
				var e = d.length;
				if (f) {
					e--;
				}
				if (c) {
					d = Array.prototype.slice.call(d, 0);
					d.reverse();
				}
				f = 0;
				for (; f < e; f++) {
					if (a$$0(d[f])) {
						return d[f];
					}
				}
				return null;
			},
			isContextFor: function(b) {
				var f;
				if (b in CKEDITOR.dtd.$block) {
					f = this.contains(CKEDITOR.dtd.$intermediate) || (this.root.equals(this.block) && this.block || this.blockLimit);
					return !!f.getDtd()[b];
				}
				return true;
			},
			direction: function() {
				return (this.block || (this.blockLimit || this.root)).getDirection(1);
			}
		};
		CKEDITOR.dom.text = function(b, f) {
			if (typeof b == "string") {
				b = (f ? f.$ : document).createTextNode(b);
			}
			this.$ = b;
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
			setText: function(b) {
				this.$.nodeValue = b;
			},
			split: function(b) {
				var f = this.$.parentNode;
				var c = f.childNodes.length;
				var a = this.getLength();
				var d = this.getDocument();
				var e = new CKEDITOR.dom.text(this.$.splitText(b), d);
				if (f.childNodes.length == c) {
					if (b >= a) {
						e = d.createText("");
						e.insertAfter(this);
					} else {
						b = d.createText("");
						b.insertAfter(e);
						b.remove();
					}
				}
				return e;
			},
			substring: function(b, f) {
				return typeof f != "number" ? this.$.nodeValue.substr(b) : this.$.nodeValue.substring(b, f);
			}
		});
		(function() {
			function b$$0(b, a, d) {
				var e = b.serializable;
				var g = a[d ? "endContainer" : "startContainer"];
				var i = d ? "endOffset" : "startOffset";
				var h = e ? a.document.getById(b.startNode) : b.startNode;
				b = e ? a.document.getById(b.endNode) : b.endNode;
				if (g.equals(h.getPrevious())) {
					a.startOffset = a.startOffset - g.getLength() - b.getPrevious().getLength();
					g = b.getNext();
				} else {
					if (g.equals(b.getPrevious())) {
						a.startOffset = a.startOffset - g.getLength();
						g = b.getNext();
					}
				}
				if (g.equals(h.getParent())) {
					a[i] ++;
				}
				if (g.equals(b.getParent())) {
					a[i] ++;
				}
				a[d ? "endContainer" : "startContainer"] = g;
				return a;
			}
			CKEDITOR.dom.rangeList = function(b) {
				if (b instanceof CKEDITOR.dom.rangeList) {
					return b;
				}
				if (b) {
					if (b instanceof CKEDITOR.dom.range) {
						b = [b];
					}
				} else {
					b = [];
				}
				return CKEDITOR.tools.extend(b, f$$0);
			};
			var f$$0 = {
				createIterator: function() {
					var b = this;
					var a = CKEDITOR.dom.walker.bookmark();
					var d = [];
					var e;
					return {
						getNextRange: function(g) {
							e = e == void 0 ? 0 : e + 1;
							var i = b[e];
							if (i && b.length > 1) {
								if (!e) {
									var h = b.length - 1;
									for (; h >= 0; h--) {
										d.unshift(b[h].createBookmark(true));
									}
								}
								if (g) {
									var f = 0;
									for (; b[e + f + 1];) {
										var k = i.document;
										g = 0;
										h = k.getById(d[f].endNode);
										k = k.getById(d[f + 1].startNode);
										for (;;) {
											h = h.getNextSourceNode(false);
											if (k.equals(h)) {
												g = 1;
											} else {
												if (a(h) || h.type == CKEDITOR.NODE_ELEMENT && h.isBlockBoundary()) {
													continue;
												}
											}
											break;
										}
										if (!g) {
											break;
										}
										f++;
									}
								}
								i.moveToBookmark(d.shift());
								for (; f--;) {
									h = b[++e];
									h.moveToBookmark(d.shift());
									i.setEnd(h.endContainer, h.endOffset);
								}
							}
							return i;
						}
					};
				},
				createBookmarks: function(c) {
					var a = [];
					var d;
					var e = 0;
					for (; e < this.length; e++) {
						a.push(d = this[e].createBookmark(c, true));
						var g = e + 1;
						for (; g < this.length; g++) {
							this[g] = b$$0(d, this[g]);
							this[g] = b$$0(d, this[g], true);
						}
					}
					return a;
				},
				createBookmarks2: function(b) {
					var a = [];
					var d = 0;
					for (; d < this.length; d++) {
						a.push(this[d].createBookmark2(b));
					}
					return a;
				},
				moveToBookmarks: function(b) {
					var a = 0;
					for (; a < this.length; a++) {
						this[a].moveToBookmark(b[a]);
					}
				}
			};
		})();
		(function() {
			function b$$1() {
				return CKEDITOR.getUrl(CKEDITOR.skinName.split(",")[1] || "skins/" + CKEDITOR.skinName.split(",")[0] + "/");
			}

			function f(a$$0) {
				var d = CKEDITOR.skin["ua_" + a$$0];
				var c = CKEDITOR.env;
				if (d) {
					d = d.split(",").sort(function(a, b) {
						return a > b ? -1 : 1;
					});
					var e = 0;
					var h;
					for (; e < d.length; e++) {
						h = d[e];
						if (c.ie && (h.replace(/^ie/, "") == c.version || c.quirks && h == "iequirks")) {
							h = "ie";
						}
						if (c[h]) {
							a$$0 = a$$0 + ("_" + d[e]);
							break;
						}
					}
				}
				return CKEDITOR.getUrl(b$$1() + a$$0 + ".css");
			}

			function c$$0(a, b) {
				if (!e$$0[a]) {
					CKEDITOR.document.appendStyleSheet(f(a));
					e$$0[a] = 1;
				}
				if (b) {
					b();
				}
			}

			function a$$1(a) {
				var b = a.getById(g$$0);
				if (!b) {
					b = a.getHead().append("style");
					b.setAttribute("id", g$$0);
					b.setAttribute("type", "text/css");
				}
				return b;
			}

			function d$$0(a, b, d) {
				var c;
				var e;
				var h;
				if (CKEDITOR.env.webkit) {
					b = b.split("}").slice(0, -1);
					e = 0;
					for (; e < b.length; e++) {
						b[e] = b[e].split("{");
					}
				}
				var g = 0;
				for (; g < a.length; g++) {
					if (CKEDITOR.env.webkit) {
						e = 0;
						for (; e < b.length; e++) {
							h = b[e][1];
							c = 0;
							for (; c < d.length; c++) {
								h = h.replace(d[c][0], d[c][1]);
							}
							a[g].$.sheet.addRule(b[e][0], h);
						}
					} else {
						h = b;
						c = 0;
						for (; c < d.length; c++) {
							h = h.replace(d[c][0], d[c][1]);
						}
						if (CKEDITOR.env.ie && CKEDITOR.env.version < 11) {
							a[g].$.styleSheet.cssText = a[g].$.styleSheet.cssText + h;
						} else {
							a[g].$.innerHTML = a[g].$.innerHTML + h;
						}
					}
				}
			}
			var e$$0 = {};
			CKEDITOR.skin = {
				path: b$$1,
				loadPart: function(a, d) {
					if (CKEDITOR.skin.name != CKEDITOR.skinName.split(",")[0]) {
						CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(b$$1() + "skin.js"), function() {
							c$$0(a, d);
						});
					} else {
						c$$0(a, d);
					}
				},
				getPath: function(a) {
					return CKEDITOR.getUrl(f(a));
				},
				icons: {},
				addIcon: function(a, b, d, c) {
					a = a.toLowerCase();
					if (!this.icons[a]) {
						this.icons[a] = {
							path: b,
							offset: d || 0,
							bgsize: c || "16px"
						};
					}
				},
				getIconStyle: function(a, b, d, c, e) {
					var h;
					if (a) {
						a = a.toLowerCase();
						if (b) {
							h = this.icons[a + "-rtl"];
						}
						if (!h) {
							h = this.icons[a];
						}
					}
					a = d || (h && h.path || "");
					c = c || h && h.offset;
					e = e || (h && h.bgsize || "16px");
					return a && "background-image:url(" + CKEDITOR.getUrl(a) + ");background-position:0 " + c + "px;background-size:" + e + ";";
				}
			};
			CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
				getUiColor: function() {
					return this.uiColor;
				},
				setUiColor: function(b$$0) {
					var c = a$$1(CKEDITOR.document);
					return (this.setUiColor = function(a) {
						var b = CKEDITOR.skin.chameleon;
						var e = [
							[h$$0, a]
						];
						this.uiColor = a;
						d$$0([c], b(this, "editor"), e);
						d$$0(i, b(this, "panel"), e);
					}).call(this, b$$0);
				}
			});
			var g$$0 = "cke_ui_color";
			var i = [];
			var h$$0 = /\$color/g;
			CKEDITOR.on("instanceLoaded", function(b$$0) {
				if (!CKEDITOR.env.ie || !CKEDITOR.env.quirks) {
					var c = b$$0.editor;
					b$$0 = function(b) {
						b = (b.data[0] || b.data).element.getElementsByTag("iframe").getItem(0).getFrameDocument();
						if (!b.getById("cke_ui_color")) {
							b = a$$1(b);
							i.push(b);
							var e = c.getUiColor();
							if (e) {
								d$$0([b], CKEDITOR.skin.chameleon(c, "panel"), [
									[h$$0, e]
								]);
							}
						}
					};
					c.on("panelShow", b$$0);
					c.on("menuShow", b$$0);
					if (c.config.uiColor) {
						c.setUiColor(c.config.uiColor);
					}
				}
			});
		})();
		(function() {
			if (CKEDITOR.env.webkit) {
				CKEDITOR.env.hc = false;
			} else {
				var b = CKEDITOR.dom.element.createFromHtml('<div style="width:0;height:0;position:absolute;left:-10000px;border:1px solid;border-color:red blue"></div>', CKEDITOR.document);
				b.appendTo(CKEDITOR.document.getHead());
				try {
					var f = b.getComputedStyle("border-top-color");
					var c = b.getComputedStyle("border-right-color");
					CKEDITOR.env.hc = !!(f && f == c);
				} catch (a) {
					CKEDITOR.env.hc = false;
				}
				b.remove();
			}
			if (CKEDITOR.env.hc) {
				CKEDITOR.env.cssClass = CKEDITOR.env.cssClass + " cke_hc";
			}
			CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}");
			CKEDITOR.status = "loaded";
			CKEDITOR.fireOnce("loaded");
			if (b = CKEDITOR._.pending) {
				delete CKEDITOR._.pending;
				f = 0;
				for (; f < b.length; f++) {
					CKEDITOR.editor.prototype.constructor.apply(b[f][0], b[f][1]);
					CKEDITOR.add(b[f][0]);
				}
			}
		})();
		CKEDITOR.skin.name = "alive";
		CKEDITOR.skin.ua_editor = "ie,iequirks,ie7,ie8,gecko";
		CKEDITOR.skin.ua_dialog = "ie,iequirks,ie7,ie8,opera";
		CKEDITOR.skin.chameleon = function() {
			var b$$0 = function() {
				return function(a, b) {
					var c = a.match(/[^#]./g);
					var g = 0;
					for (; g < 3; g++) {
						var i = c;
						var h = g;
						var f;
						f = parseInt(c[g], 16);
						f = ("0" + (b < 0 ? 0 | f * (1 + b) : 0 | f + (255 - f) * b).toString(16)).slice(-2);
						i[h] = f;
					}
					return "#" + c.join("");
				};
			}();
			var f$$0 = function() {
				var a = new CKEDITOR.template("background:#{to};background-image:-webkit-gradient(linear,lefttop,leftbottom,from({from}),to({to}));background-image:-moz-linear-gradient(top,{from},{to});background-image:-webkit-linear-gradient(top,{from},{to});background-image:-o-linear-gradient(top,{from},{to});background-image:-ms-linear-gradient(top,{from},{to});background-image:linear-gradient(top,{from},{to});filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='{from}',endColorstr='{to}');");
				return function(b, c) {
					return a.output({
						from: b,
						to: c
					});
				};
			}();
			var c$$0 = {
				editor: new CKEDITOR.template("{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ {defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_bottom [{defaultGradient}border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [{defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [{defaultGradient}outline-color:{defaultBorder};border-top-color:{defaultBorder};] {id} .cke_dialog_tab [{lightGradient}border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [{mediumGradient}] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} .cke_toolgroup [{lightGradient}border-color:{defaultBorder};] {id} a.cke_button_off:hover, {id} a.cke_button_off:focus, {id} a.cke_button_off:active [{mediumGradient}] {id} .cke_button_on [{ckeButtonOn}] {id} .cke_toolbar_separator [background-color: {ckeToolbarSeparator};] {id} .cke_combo_button [border-color:{defaultBorder};{lightGradient}] {id} a.cke_combo_button:hover, {id} a.cke_combo_button:focus, {id} .cke_combo_on a.cke_combo_button [border-color:{defaultBorder};{mediumGradient}] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover, {id} a.cke_path_item:focus, {id} a.cke_path_item:active [background-color:{elementsPathBg};] {id}.cke_panel [border-color:{defaultBorder};] "),
				panel: new CKEDITOR.template(".cke_panel_grouptitle [{lightGradient}border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:focus.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:focus.cke_colorauto, a:focus.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] ")
			};
			return function(a, d) {
				var e = a.uiColor;
				e = {
					id: "." + a.id,
					defaultBorder: b$$0(e, -0.1),
					defaultGradient: f$$0(b$$0(e, 0.9), e),
					lightGradient: f$$0(b$$0(e, 1), b$$0(e, 0.7)),
					mediumGradient: f$$0(b$$0(e, 0.8), b$$0(e, 0.5)),
					ckeButtonOn: f$$0(b$$0(e, 0.6), b$$0(e, 0.7)),
					ckeResizer: b$$0(e, -0.4),
					ckeToolbarSeparator: b$$0(e, 0.5),
					ckeColorauto: b$$0(e, 0.8),
					dialogBody: b$$0(e, 0.7),
					dialogTabSelected: f$$0("#FFFFFF", "#FFFFFF"),
					dialogTabSelectedBorder: "#FFF",
					elementsPathColor: b$$0(e, -0.6),
					elementsPathBg: e,
					menubuttonIcon: b$$0(e, 0.5),
					menubuttonIconHover: b$$0(e, 0.3)
				};
				return c$$0[d].output(e).replace(/\[/g, "{").replace(/\]/g, "}");
			};
		}();
		CKEDITOR.plugins.add("basicstyles", {
			init: function(b) {
				var f = 0;
				var c$$0 = function(d, c, e, j) {
					if (j) {
						j = new CKEDITOR.style(j);
						var k = a$$0[e];
						k.unshift(j);
						b.attachStyleStateChange(j, function(a) {
							if (!b.readOnly) {
								b.getCommand(e).setState(a);
							}
						});
						b.addCommand(e, new CKEDITOR.styleCommand(j, {
							contentForms: k
						}));
						if (b.ui.addButton) {
							b.ui.addButton(d, {
								label: c,
								command: e,
								toolbar: "basicstyles," + (f = f + 10)
							});
						}
					}
				};
				var a$$0 = {
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
				var d$$0 = b.config;
				var e$$0 = b.lang.basicstyles;
				c$$0("Bold", e$$0.bold, "bold", d$$0.coreStyles_bold);
				c$$0("Italic", e$$0.italic, "italic", d$$0.coreStyles_italic);
				c$$0("Underline", e$$0.underline, "underline", d$$0.coreStyles_underline);
				c$$0("Strike", e$$0.strike, "strike", d$$0.coreStyles_strike);
				c$$0("Subscript", e$$0.subscript, "subscript", d$$0.coreStyles_subscript);
				c$$0("Superscript", e$$0.superscript, "superscript", d$$0.coreStyles_superscript);
				b.setKeystroke([
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
				var b$$1 = function(a) {
					if (!this._) {
						this._ = {};
					}
					this._["default"] = this._.initValue = a["default"] || "";
					this._.required = a.required || false;
					var b = [this._];
					var d = 1;
					for (; d < arguments.length; d++) {
						b.push(arguments[d]);
					}
					b.push(true);
					CKEDITOR.tools.extend.apply(CKEDITOR.tools, b);
					return this._;
				};
				var f$$0 = {
					build: function(a, b, d) {
						return new CKEDITOR.ui.dialog.textInput(a, b, d);
					}
				};
				var c$$1 = {
					build: function(a, b, d) {
						return new CKEDITOR.ui.dialog[b.type](a, b, d);
					}
				};
				var a$$2 = {
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
				var d$$1 = CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
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
				var e$$0 = /^on([A-Z]\w+)/;
				var g$$0 = function(a) {
					var b;
					for (b in a) {
						if (e$$0.test(b) || (b == "title" || b == "type")) {
							delete a[b];
						}
					}
					return a;
				};
				CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {
					labeledElement: function(a, d, c$$0, e) {
						if (!(arguments.length < 4)) {
							var g = b$$1.call(this, d);
							g.labelId = CKEDITOR.tools.getNextId() + "_label";
							this._.children = [];
							CKEDITOR.ui.dialog.uiElement.call(this, a, d, c$$0, "div", null, {
								role: "presentation"
							}, function() {
								var b = [];
								var c = d.required ? " cke_required" : "";
								if (d.labelLayout != "horizontal") {
									b.push('<label class="cke_dialog_ui_labeled_label' + c + '" ', ' id="' + g.labelId + '"', g.inputId ? ' for="' + g.inputId + '"' : "", (d.labelStyle ? ' style="' + d.labelStyle + '"' : "") + ">", d.label, "</label>", '<div class="cke_dialog_ui_labeled_content"', d.controlStyle ? ' style="' + d.controlStyle + '"' : "", ' role="radiogroup" aria-labelledby="' + g.labelId + '">', e.call(this, a, d), "</div>");
								} else {
									c = {
										type: "hbox",
										widths: d.widths,
										padding: 0,
										children: [{
											type: "html",
											html: '<label class="cke_dialog_ui_labeled_label' + c + '" id="' + g.labelId + '" for="' + g.inputId + '"' + (d.labelStyle ? ' style="' + d.labelStyle + '"' : "") + ">" + CKEDITOR.tools.htmlEncode(d.label) + "</span>"
										}, {
											type: "html",
											html: '<span class="cke_dialog_ui_labeled_content"' + (d.controlStyle ? ' style="' + d.controlStyle + '"' : "") + ">" + e.call(this, a, d) + "</span>"
										}]
									};
									CKEDITOR.dialog._.uiElementBuilders.hbox.build(a, c, b);
								}
								return b.join("");
							});
						}
					},
					textInput: function(a$$0, d, c) {
						if (!(arguments.length < 3)) {
							b$$1.call(this, d);
							var e = this._.inputId = CKEDITOR.tools.getNextId() + "_textInput";
							var g = {
								"class": "cke_dialog_ui_input_" + d.type,
								id: e,
								type: d.type
							};
							if (d.validate) {
								this.validate = d.validate;
							}
							if (d.maxLength) {
								g.maxlength = d.maxLength;
							}
							if (d.size) {
								g.size = d.size;
							}
							if (d.inputStyle) {
								g.style = d.inputStyle;
							}
							var f = this;
							var q = false;
							a$$0.on("load", function() {
								f.getInputElement().on("keydown", function(a) {
									if (a.data.getKeystroke() == 13) {
										q = true;
									}
								});
								f.getInputElement().on("keyup", function(b) {
									if (b.data.getKeystroke() == 13 && q) {
										if (a$$0.getButton("ok")) {
											setTimeout(function() {
												a$$0.getButton("ok").click();
											}, 0);
										}
										q = false;
									}
								}, null, null, 1E3);
							});
							CKEDITOR.ui.dialog.labeledElement.call(this, a$$0, d, c, function() {
								var a = ['<div class="cke_dialog_ui_input_', d.type, '" role="presentation"'];
								if (d.width) {
									a.push('style="width:' + d.width + '" ');
								}
								a.push("><input ");
								g["aria-labelledby"] = this._.labelId;
								if (this._.required) {
									g["aria-required"] = this._.required;
								}
								var b;
								for (b in g) {
									a.push(b + '="' + g[b] + '" ');
								}
								a.push(" /></div>");
								return a.join("");
							});
						}
					},
					textarea: function(a$$0, d, c) {
						if (!(arguments.length < 3)) {
							b$$1.call(this, d);
							var e = this;
							var g = this._.inputId = CKEDITOR.tools.getNextId() + "_textarea";
							var f = {};
							if (d.validate) {
								this.validate = d.validate;
							}
							f.rows = d.rows || 5;
							f.cols = d.cols || 20;
							f["class"] = "cke_dialog_ui_input_textarea " + (d["class"] || "");
							if (typeof d.inputStyle != "undefined") {
								f.style = d.inputStyle;
							}
							if (d.dir) {
								f.dir = d.dir;
							}
							CKEDITOR.ui.dialog.labeledElement.call(this, a$$0, d, c, function() {
								f["aria-labelledby"] = this._.labelId;
								if (this._.required) {
									f["aria-required"] = this._.required;
								}
								var a = ['<div class="cke_dialog_ui_input_textarea" role="presentation"><textarea id="', g, '" '];
								var b;
								for (b in f) {
									a.push(b + '="' + CKEDITOR.tools.htmlEncode(f[b]) + '" ');
								}
								a.push(">", CKEDITOR.tools.htmlEncode(e._["default"]), "</textarea></div>");
								return a.join("");
							});
						}
					},
					checkbox: function(a, d, c$$0) {
						if (!(arguments.length < 3)) {
							var e = b$$1.call(this, d, {
								"default": !!d["default"]
							});
							if (d.validate) {
								this.validate = d.validate;
							}
							CKEDITOR.ui.dialog.uiElement.call(this, a, d, c$$0, "span", null, null, function() {
								var b = CKEDITOR.tools.extend({}, d, {
									id: d.id ? d.id + "_checkbox" : CKEDITOR.tools.getNextId() + "_checkbox"
								}, true);
								var c = [];
								var f = CKEDITOR.tools.getNextId() + "_label";
								var j = {
									"class": "cke_dialog_ui_checkbox_input",
									type: "checkbox",
									"aria-labelledby": f
								};
								g$$0(b);
								if (d["default"]) {
									j.checked = "checked";
								}
								if (typeof b.inputStyle != "undefined") {
									b.style = b.inputStyle;
								}
								e.checkbox = new CKEDITOR.ui.dialog.uiElement(a, b, c, "input", null, j);
								c.push(' <label id="', f, '" for="', j.id, '"' + (d.labelStyle ? ' style="' + d.labelStyle + '"' : "") + ">", CKEDITOR.tools.htmlEncode(d.label), "</label>");
								return c.join("");
							});
						}
					},
					radio: function(a, d, c$$0) {
						if (!(arguments.length < 3)) {
							b$$1.call(this, d);
							if (!this._["default"]) {
								this._["default"] = this._.initValue = d.items[0][1];
							}
							if (d.validate) {
								this.validate = d.valdiate;
							}
							var e = [];
							var f = this;
							CKEDITOR.ui.dialog.labeledElement.call(this, a, d, c$$0, function() {
								var b = [];
								var c = [];
								var j = (d.id ? d.id : CKEDITOR.tools.getNextId()) + "_radio";
								var l = 0;
								for (; l < d.items.length; l++) {
									var r = d.items[l];
									var p = r[2] !== void 0 ? r[2] : r[0];
									var t = r[1] !== void 0 ? r[1] : r[0];
									var w = CKEDITOR.tools.getNextId() + "_radio_input";
									var s = w + "_label";
									w = CKEDITOR.tools.extend({}, d, {
										id: w,
										title: null,
										type: null
									}, true);
									p = CKEDITOR.tools.extend({}, w, {
										title: p
									}, true);
									var v = {
										type: "radio",
										"class": "cke_dialog_ui_radio_input",
										name: j,
										value: t,
										"aria-labelledby": s
									};
									var z = [];
									if (f._["default"] == t) {
										v.checked = "checked";
									}
									g$$0(w);
									g$$0(p);
									if (typeof w.inputStyle != "undefined") {
										w.style = w.inputStyle;
									}
									w.keyboardFocusable = true;
									e.push(new CKEDITOR.ui.dialog.uiElement(a, w, z, "input", null, v));
									z.push(" ");
									new CKEDITOR.ui.dialog.uiElement(a, p, z, "label", null, {
										id: s,
										"for": v.id
									}, r[0]);
									b.push(z.join(""));
								}
								new CKEDITOR.ui.dialog.hbox(a, e, b, c);
								return c.join("");
							});
							this._.children = e;
						}
					},
					button: function(a$$1, d, c) {
						if (arguments.length) {
							if (typeof d == "function") {
								d = d(a$$1.getParentEditor());
							}
							b$$1.call(this, d, {
								disabled: d.disabled || false
							});
							CKEDITOR.event.implementOn(this);
							var e = this;
							a$$1.on("load", function() {
								var a$$0 = this.getElement();
								(function() {
									a$$0.on("click", function(a) {
										e.click();
										a.data.preventDefault();
									});
									a$$0.on("keydown", function(a) {
										if (a.data.getKeystroke() in {
											32: 1
										}) {
											e.click();
											a.data.preventDefault();
										}
									});
								})();
								a$$0.unselectable();
							}, this);
							var g = CKEDITOR.tools.extend({}, d);
							delete g.style;
							var f = CKEDITOR.tools.getNextId() + "_label";
							CKEDITOR.ui.dialog.uiElement.call(this, a$$1, g, c, "a", null, {
								style: d.style,
								href: "javascript:void(0)",
								title: d.label,
								hidefocus: "true",
								"class": d["class"],
								role: "button",
								"aria-labelledby": f
							}, '<span id="' + f + '" class="cke_dialog_ui_button">' + CKEDITOR.tools.htmlEncode(d.label) + "</span>");
						}
					},
					select: function(a, d, c$$0) {
						if (!(arguments.length < 3)) {
							var e = b$$1.call(this, d);
							if (d.validate) {
								this.validate = d.validate;
							}
							e.inputId = CKEDITOR.tools.getNextId() + "_select";
							CKEDITOR.ui.dialog.labeledElement.call(this, a, d, c$$0, function() {
								var b = CKEDITOR.tools.extend({}, d, {
									id: d.id ? d.id + "_select" : CKEDITOR.tools.getNextId() + "_select"
								}, true);
								var c = [];
								var f = [];
								var j = {
									id: e.inputId,
									"class": "cke_dialog_ui_input_select",
									"aria-labelledby": this._.labelId
								};
								c.push('<div class="cke_dialog_ui_input_', d.type, '" role="presentation"');
								if (d.width) {
									c.push('style="width:' + d.width + '" ');
								}
								c.push(">");
								if (d.size != void 0) {
									j.size = d.size;
								}
								if (d.multiple != void 0) {
									j.multiple = d.multiple;
								}
								g$$0(b);
								var l = 0;
								var r;
								for (; l < d.items.length && (r = d.items[l]); l++) {
									f.push('<option value="', CKEDITOR.tools.htmlEncode(r[1] !== void 0 ? r[1] : r[0]).replace(/"/g, "&quot;"), '" /> ', CKEDITOR.tools.htmlEncode(r[0]));
								}
								if (typeof b.inputStyle != "undefined") {
									b.style = b.inputStyle;
								}
								e.select = new CKEDITOR.ui.dialog.uiElement(a, b, c, "select", null, j, f.join(""));
								c.push("</div>");
								return c.join("");
							});
						}
					},
					file: function(a$$0, d, c) {
						if (!(arguments.length < 3)) {
							if (d["default"] === void 0) {
								d["default"] = "";
							}
							var e = CKEDITOR.tools.extend(b$$1.call(this, d), {
								definition: d,
								buttons: []
							});
							if (d.validate) {
								this.validate = d.validate;
							}
							a$$0.on("load", function() {
								CKEDITOR.document.getById(e.frameId).getParent().addClass("cke_dialog_ui_input_file");
							});
							CKEDITOR.ui.dialog.labeledElement.call(this, a$$0, d, c, function() {
								e.frameId = CKEDITOR.tools.getNextId() + "_fileInput";
								var a = ['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" role="presentation" id="', e.frameId, '" title="', d.label, '" src="javascript:void('];
								a.push(CKEDITOR.env.ie ? "(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "})()" : "0");
								a.push(')"></iframe>');
								return a.join("");
							});
						}
					},
					fileButton: function(a, d, c$$0) {
						if (!(arguments.length < 3)) {
							b$$1.call(this, d);
							var e = this;
							if (d.validate) {
								this.validate = d.validate;
							}
							var g = CKEDITOR.tools.extend({}, d);
							var f = g.onClick;
							g.className = (g.className ? g.className + " " : "") + "cke_dialog_ui_button";
							g.onClick = function(b) {
								var c = d["for"];
								if (!f || f.call(this, b) !== false) {
									a.getContentElement(c[0], c[1]).submit();
									this.disable();
								}
							};
							a.on("load", function() {
								a.getContentElement(d["for"][0], d["for"][1])._.buttons.push(e);
							});
							CKEDITOR.ui.dialog.button.call(this, a, g, c$$0);
						}
					},
					html: function() {
						var a = /^\s*<[\w:]+\s+([^>]*)?>/;
						var b = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/;
						var d = /\/$/;
						return function(c, e, g) {
							if (!(arguments.length < 3)) {
								var f = [];
								var o = e.html;
								if (o.charAt(0) != "<") {
									o = "<span>" + o + "</span>";
								}
								var l = e.focus;
								if (l) {
									var r = this.focus;
									this.focus = function() {
										(typeof l == "function" ? l : r).call(this);
										this.fire("focus");
									};
									if (e.isFocusable) {
										this.isFocusable = this.isFocusable;
									}
									this.keyboardFocusable = true;
								}
								CKEDITOR.ui.dialog.uiElement.call(this, c, e, f, "span", null, null, "");
								f = f.join("").match(a);
								o = o.match(b) || ["", "", ""];
								if (d.test(o[1])) {
									o[1] = o[1].slice(0, -1);
									o[2] = "/" + o[2];
								}
								g.push([o[1], " ", f[1] || "", o[2]].join(""));
							}
						};
					}(),
					fieldset: function(a$$0, b$$0, d, c, e) {
						var g = e.label;
						this._ = {
							children: b$$0
						};
						CKEDITOR.ui.dialog.uiElement.call(this, a$$0, e, c, "fieldset", null, null, function() {
							var a = [];
							if (g) {
								a.push("<legend" + (e.labelStyle ? ' style="' + e.labelStyle + '"' : "") + ">" + g + "</legend>");
							}
							var b = 0;
							for (; b < d.length; b++) {
								a.push(d[b]);
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
					eventProcessors: d$$1
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
				}, a$$2, true);
				CKEDITOR.ui.dialog.textarea.prototype = new CKEDITOR.ui.dialog.textInput;
				CKEDITOR.ui.dialog.select.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
					getInputElement: function() {
						return this._.select.getElement();
					},
					add: function(a, b, d) {
						var c = new CKEDITOR.dom.element("option", this.getDialog().getParentEditor().document);
						var e = this.getInputElement().$;
						c.$.text = a;
						c.$.value = b === void 0 || b === null ? a : b;
						if (d === void 0 || d === null) {
							if (CKEDITOR.env.ie) {
								e.add(c.$);
							} else {
								e.add(c.$, null);
							}
						} else {
							e.add(c.$, d);
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
				}, a$$2, true);
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
								return d$$1.onChange.apply(this, arguments);
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
				}, a$$2, true);
				CKEDITOR.ui.dialog.radio.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
					setValue: function(a, b) {
						var d = this._.children;
						var c;
						var e = 0;
						for (; e < d.length && (c = d[e]); e++) {
							c.getElement().$.checked = c.getValue() == a;
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
									var d = 0;
									for (; d < a$$0.length; d++) {
										a$$0[d].getElement().on("propertychange", function(a) {
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
								return d$$1.onChange.apply(this, arguments);
							}
							return null;
						}
					}
				}, a$$2, true);
				CKEDITOR.ui.dialog.file.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, a$$2, {
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
						var d$$0;
						var c$$0 = function(a, b, d, c) {
							a.on("formLoaded", function() {
								a.getInputElement().on(d, c, a);
							});
						};
						var e;
						for (e in a$$0) {
							if (d$$0 = e.match(b$$0)) {
								if (this.eventProcessors[e]) {
									this.eventProcessors[e].call(this, this._.dialog, a$$0[e]);
								} else {
									c$$0(this, this._.dialog, d$$0[1].toLowerCase(), a$$0[e]);
								}
							}
						}
						return this;
					},
					reset: function() {
						function a() {
							d.$.open();
							var i = "";
							if (c.size) {
								i = c.size - (CKEDITOR.env.ie ? 7 : 0);
							}
							var p = b.frameId + "_input";
							d.$.write(['<html dir="' + o + '" lang="' + l + '"><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">', '<form enctype="multipart/form-data" method="POST" dir="' + o + '" lang="' + l + '" action="', CKEDITOR.tools.htmlEncode(c.action), '"><label id="', b.labelId, '" for="', p, '" style="display:none">', CKEDITOR.tools.htmlEncode(c.label), '</label><input style="width:100%" id="', p, '" aria-labelledby="', b.labelId, '" type="file" name="',
								CKEDITOR.tools.htmlEncode(c.id || "cke_upload"), '" size="', CKEDITOR.tools.htmlEncode(i > 0 ? i : ""), '" /></form></body></html><script>', CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "", "window.parent.CKEDITOR.tools.callFunction(" + g + ");", "window.onbeforeunload = function() {window.parent.CKEDITOR.tools.callFunction(" + f + ")}", "\x3c/script>"
							].join(""));
							d.$.close();
							i = 0;
							for (; i < e.length; i++) {
								e[i].enable();
							}
						}
						var b = this._;
						var d = CKEDITOR.document.getById(b.frameId).getFrameDocument();
						var c = b.definition;
						var e = b.buttons;
						var g = this.formLoadedNumber;
						var f = this.formUnloadNumber;
						var o = b.dialog._.editor.lang.dir;
						var l = b.dialog._.editor.langCode;
						if (!g) {
							g = this.formLoadedNumber = CKEDITOR.tools.addFunction(function() {
								this.fire("formLoaded");
							}, this);
							f = this.formUnloadNumber = CKEDITOR.tools.addFunction(function() {
								this.getInputElement().clearCustomData();
							}, this);
							this.getDialog()._.editor.on("destroy", function() {
								CKEDITOR.tools.removeFunction(g);
								CKEDITOR.tools.removeFunction(f);
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
				CKEDITOR.dialog.addUIElement("text", f$$0);
				CKEDITOR.dialog.addUIElement("password", f$$0);
				CKEDITOR.dialog.addUIElement("textarea", c$$1);
				CKEDITOR.dialog.addUIElement("checkbox", c$$1);
				CKEDITOR.dialog.addUIElement("radio", c$$1);
				CKEDITOR.dialog.addUIElement("button", c$$1);
				CKEDITOR.dialog.addUIElement("select", c$$1);
				CKEDITOR.dialog.addUIElement("file", c$$1);
				CKEDITOR.dialog.addUIElement("fileButton", c$$1);
				CKEDITOR.dialog.addUIElement("html", c$$1);
				CKEDITOR.dialog.addUIElement("fieldset", {
					build: function(a, b, d) {
						var c = b.children;
						var e;
						var g = [];
						var f = [];
						var o = 0;
						for (; o < c.length && (e = c[o]); o++) {
							var l = [];
							g.push(l);
							f.push(CKEDITOR.dialog._.uiElementBuilders[e.type].build(a, e, l));
						}
						return new CKEDITOR.ui.dialog[b.type](a, f, g, d, b);
					}
				});
			}
		});
		CKEDITOR.DIALOG_RESIZE_NONE = 0;
		CKEDITOR.DIALOG_RESIZE_WIDTH = 1;
		CKEDITOR.DIALOG_RESIZE_HEIGHT = 2;
		CKEDITOR.DIALOG_RESIZE_BOTH = 3;
		(function() {
			function b$$2() {
				var a = this._.tabIdList.length;
				var b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId) + a;
				var d = b - 1;
				for (; d > b - a; d--) {
					if (this._.tabs[this._.tabIdList[d % a]][0].$.offsetHeight) {
						return this._.tabIdList[d % a];
					}
				}
				return null;
			}

			function f$$0() {
				var a = this._.tabIdList.length;
				var b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId);
				var d = b + 1;
				for (; d < b + a; d++) {
					if (this._.tabs[this._.tabIdList[d % a]][0].$.offsetHeight) {
						return this._.tabIdList[d % a];
					}
				}
				return null;
			}

			function c$$1(a, b) {
				var d = a.$.getElementsByTagName("input");
				var c = 0;
				var e = d.length;
				for (; c < e; c++) {
					var g = new CKEDITOR.dom.element(d[c]);
					if (g.getAttribute("type").toLowerCase() == "text") {
						if (b) {
							g.setAttribute("value", g.getCustomData("fake_value") || "");
							g.removeCustomData("fake_value");
						} else {
							g.setCustomData("fake_value", g.getAttribute("value"));
							g.setAttribute("value", "");
						}
					}
				}
			}

			function a$$2(a, b) {
				var d = this.getInputElement();
				if (d) {
					if (a) {
						d.removeAttribute("aria-invalid");
					} else {
						d.setAttribute("aria-invalid", true);
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

			function d$$1() {
				var a = this.getInputElement();
				if (a) {
					a.removeAttribute("aria-invalid");
				}
			}

			function e$$1(a) {
				a = CKEDITOR.dom.element.createFromHtml(CKEDITOR.addTemplate("dialog", l$$1).output({
					id: CKEDITOR.tools.getNextNumber(),
					editorId: a.id,
					langDir: a.lang.dir,
					langCode: a.langCode,
					editorDialogClass: "cke_editor_" + a.name.replace(/\./g, "\\.") + "_dialog",
					closeTitle: a.lang.common.close,
					hidpi: CKEDITOR.env.hidpi ? "cke_hidpi" : ""
				}));
				var b = a.getChild([0, 0, 0, 0, 0]);
				var d = b.getChild(0);
				var c = b.getChild(1);
				if (CKEDITOR.env.ie && !CKEDITOR.env.ie6Compat) {
					var e = "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())";
					CKEDITOR.dom.element.createFromHtml('<iframe frameBorder="0" class="cke_iframe_shim" src="' + e + '" tabIndex="-1"></iframe>').appendTo(b.getParent());
				}
				d.unselectable();
				c.unselectable();
				return {
					element: a,
					parts: {
						dialog: a.getChild(0),
						title: d,
						close: c,
						tabs: b.getChild(2),
						contents: b.getChild([3, 0, 0, 0]),
						footer: b.getChild([3, 0, 1, 0])
					}
				};
			}

			function g$$1(a$$0, b, d) {
				this.element = b;
				this.focusIndex = d;
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

			function i$$0(a) {
				function b() {
					a.layout();
				}
				var d = CKEDITOR.document.getWindow();
				d.on("resize", b);
				a.on("hide", function() {
					d.removeListener("resize", b);
				});
			}

			function h$$1(a, b) {
				this._ = {
					dialog: a
				};
				CKEDITOR.tools.extend(this, b);
			}

			function j$$0(a$$0) {
				function b(d) {
					var i = a$$0.getSize();
					var j = CKEDITOR.document.getWindow().getViewPaneSize();
					var k = d.data.$.screenX;
					var n = d.data.$.screenY;
					var m = k - c.x;
					var l = n - c.y;
					c = {
						x: k,
						y: n
					};
					e.x = e.x + m;
					e.y = e.y + l;
					a$$0.move(e.x + f[3] < h$$0 ? -f[3] : e.x - f[1] > j.width - i.width - h$$0 ? j.width - i.width + (g$$0.lang.dir == "rtl" ? 0 : f[1]) : e.x, e.y + f[0] < h$$0 ? -f[0] : e.y - f[2] > j.height - i.height - h$$0 ? j.height - i.height + f[2] : e.y, 1);
					d.data.preventDefault();
				}

				function d$$0() {
					CKEDITOR.document.removeListener("mousemove", b);
					CKEDITOR.document.removeListener("mouseup", d$$0);
					if (CKEDITOR.env.ie6Compat) {
						var a = u$$0.getChild(0).getFrameDocument();
						a.removeListener("mousemove", b);
						a.removeListener("mouseup", d$$0);
					}
				}
				var c = null;
				var e = null;
				a$$0.getElement().getFirst();
				var g$$0 = a$$0.getParentEditor();
				var h$$0 = g$$0.config.dialog_magnetDistance;
				var f = CKEDITOR.skin.margins || [0, 0, 0, 0];
				if (typeof h$$0 == "undefined") {
					h$$0 = 20;
				}
				a$$0.parts.title.on("mousedown", function(g) {
					c = {
						x: g.data.$.screenX,
						y: g.data.$.screenY
					};
					CKEDITOR.document.on("mousemove", b);
					CKEDITOR.document.on("mouseup", d$$0);
					e = a$$0.getPosition();
					if (CKEDITOR.env.ie6Compat) {
						var h = u$$0.getChild(0).getFrameDocument();
						h.on("mousemove", b);
						h.on("mouseup", d$$0);
					}
					g.data.preventDefault();
				}, a$$0);
			}

			function k$$0(a$$0) {
				function c(e) {
					var m = f.lang.dir == "rtl";
					var l = n.width;
					var o = n.height;
					var q = l + (e.data.$.screenX - b$$0) * (m ? -1 : 1) * (a$$0._.moved ? 1 : 2);
					var t = o + (e.data.$.screenY - d) * (a$$0._.moved ? 1 : 2);
					var p = a$$0._.element.getFirst();
					p = m && p.getComputedStyle("right");
					var r = a$$0.getPosition();
					if (r.y + t > k.height) {
						t = k.height - r.y;
					}
					if ((m ? p : r.x) + q > k.width) {
						q = k.width - (m ? p : r.x);
					}
					if (h$$0 == CKEDITOR.DIALOG_RESIZE_WIDTH || h$$0 == CKEDITOR.DIALOG_RESIZE_BOTH) {
						l = Math.max(g$$0.minWidth || 0, q - i);
					}
					if (h$$0 == CKEDITOR.DIALOG_RESIZE_HEIGHT || h$$0 == CKEDITOR.DIALOG_RESIZE_BOTH) {
						o = Math.max(g$$0.minHeight || 0, t - j);
					}
					a$$0.resize(l, o);
					if (!a$$0._.moved) {
						a$$0.layout();
					}
					e.data.preventDefault();
				}

				function e$$0() {
					CKEDITOR.document.removeListener("mouseup", e$$0);
					CKEDITOR.document.removeListener("mousemove", c);
					if (m$$0) {
						m$$0.remove();
						m$$0 = null;
					}
					if (CKEDITOR.env.ie6Compat) {
						var a = u$$0.getChild(0).getFrameDocument();
						a.removeListener("mouseup", e$$0);
						a.removeListener("mousemove", c);
					}
				}
				var b$$0;
				var d;
				var g$$0 = a$$0.definition;
				var h$$0 = g$$0.resizable;
				if (h$$0 != CKEDITOR.DIALOG_RESIZE_NONE) {
					var f = a$$0.getParentEditor();
					var i;
					var j;
					var k;
					var n;
					var m$$0;
					var l$$0 = CKEDITOR.tools.addFunction(function(g) {
						n = a$$0.getSize();
						var h = a$$0.parts.contents;
						if (h.$.getElementsByTagName("iframe").length) {
							m$$0 = CKEDITOR.dom.element.createFromHtml('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>');
							h.append(m$$0);
						}
						j = n.height - a$$0.parts.contents.getSize("height", !(CKEDITOR.env.gecko || (CKEDITOR.env.opera || CKEDITOR.env.ie && CKEDITOR.env.quirks)));
						i = n.width - a$$0.parts.contents.getSize("width", 1);
						b$$0 = g.screenX;
						d = g.screenY;
						k = CKEDITOR.document.getWindow().getViewPaneSize();
						CKEDITOR.document.on("mousemove", c);
						CKEDITOR.document.on("mouseup", e$$0);
						if (CKEDITOR.env.ie6Compat) {
							h = u$$0.getChild(0).getFrameDocument();
							h.on("mousemove", c);
							h.on("mouseup", e$$0);
						}
						if (g.preventDefault) {
							g.preventDefault();
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
						b = CKEDITOR.dom.element.createFromHtml('<div class="cke_resizer' + b + " cke_resizer_" + f.lang.dir + '" title="' + CKEDITOR.tools.htmlEncode(f.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + l$$0 + ', event )">' + (f.lang.dir == "ltr" ? "\u25e2" : "\u25e3") + "</div>");
						a$$0.parts.footer.append(b, 1);
					});
					f.on("destroy", function() {
						CKEDITOR.tools.removeFunction(l$$0);
					});
				}
			}

			function n$$0(a) {
				a.data.preventDefault(1);
			}

			function m$$1(a$$0) {
				var b = CKEDITOR.document.getWindow();
				var d$$0 = a$$0.config;
				var c = d$$0.dialog_backgroundCoverColor || "white";
				var e = d$$0.dialog_backgroundCoverOpacity;
				var g = d$$0.baseFloatZIndex;
				d$$0 = CKEDITOR.tools.genKey(c, e, g);
				var h = z[d$$0];
				if (h) {
					h.show();
				} else {
					g = ['<div tabIndex="-1" style="position: ', CKEDITOR.env.ie6Compat ? "absolute" : "fixed", "; z-index: ", g, "; top: 0px; left: 0px; ", !CKEDITOR.env.ie6Compat ? "background-color: " + c : "", '" class="cke_dialog_background_cover">'];
					if (CKEDITOR.env.ie6Compat) {
						c = "<html><body style=\\'background-color:" + c + ";\\'></body></html>";
						g.push('<iframe hidefocus="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:');
						g.push("void((function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.write( '" + c + "' );document.close();") + "})())");
						g.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>');
					}
					g.push("</div>");
					h = CKEDITOR.dom.element.createFromHtml(g.join(""));
					h.setOpacity(e != void 0 ? e : 0.5);
					h.on("keydown", n$$0);
					h.on("keypress", n$$0);
					h.on("keyup", n$$0);
					h.appendTo(CKEDITOR.document.getBody());
					z[d$$0] = h;
				}
				a$$0.focusManager.add(h);
				u$$0 = h;
				a$$0 = function() {
					var a = b.getViewPaneSize();
					h.setStyles({
						width: a.width + "px",
						height: a.height + "px"
					});
				};
				var f = function() {
					var a = b.getScrollPosition();
					var d = CKEDITOR.dialog._.currentTop;
					h.setStyles({
						left: a.x + "px",
						top: a.y + "px"
					});
					if (d) {
						do {
							a = d.getPosition();
							d.move(a.x, a.y);
						} while (d = d._.parentDialog);
					}
				};
				v$$0 = a$$0;
				b.on("resize", a$$0);
				a$$0();
				if (!CKEDITOR.env.mac || !CKEDITOR.env.webkit) {
					h.focus();
				}
				if (CKEDITOR.env.ie6Compat) {
					var i = function() {
						f();
						arguments.callee.prevScrollHandler.apply(this, arguments);
					};
					b.$.setTimeout(function() {
						i.prevScrollHandler = window.onscroll || function() {};
						window.onscroll = i;
					}, 0);
					f();
				}
			}

			function q$$0(a) {
				if (u$$0) {
					a.focusManager.remove(u$$0);
					a = CKEDITOR.document.getWindow();
					u$$0.hide();
					a.removeListener("resize", v$$0);
					if (CKEDITOR.env.ie6Compat) {
						a.$.setTimeout(function() {
							window.onscroll = window.onscroll && window.onscroll.prevScrollHandler || null;
						}, 0);
					}
					v$$0 = null;
				}
			}
			var o$$0 = CKEDITOR.tools.cssLength;
			var l$$1 = '<div class="cke_reset_all {editorId} {editorDialogClass} {hidpi}" dir="{langDir}" lang="{langCode}" role="dialog" aria-labelledby="cke_dialog_title_{id}"><table class="cke_dialog ' + CKEDITOR.env.cssClass + ' cke_{langDir}" style="position:absolute" role="presentation"><tr><td role="presentation"><div class="cke_dialog_body" role="presentation"><div id="cke_dialog_title_{id}" class="cke_dialog_title" role="presentation"></div><a id="cke_dialog_close_button_{id}" class="cke_dialog_close_button" href="javascript:void(0)" title="{closeTitle}" role="button"><span class="cke_label">X</span></a><div id="cke_dialog_tabs_{id}" class="cke_dialog_tabs" role="tablist"></div><table class="cke_dialog_contents" role="presentation"><tr><td id="cke_dialog_contents_{id}" class="cke_dialog_contents_body" role="presentation"></td></tr><tr><td id="cke_dialog_footer_{id}" class="cke_dialog_footer" role="presentation"></td></tr></table></div></td></tr></table></div>';
			CKEDITOR.dialog = function(c$$0, g) {
				function h() {
					var a$$0 = u._.focusList;
					a$$0.sort(function(a, b) {
						return a.tabIndex != b.tabIndex ? b.tabIndex - a.tabIndex : a.focusIndex - b.focusIndex;
					});
					var b$$0 = a$$0.length;
					var d = 0;
					for (; d < b$$0; d++) {
						a$$0[d].focusIndex = d;
					}
				}

				function i(a) {
					var b = u._.focusList;
					a = a || 0;
					if (!(b.length < 1)) {
						var d = u._.currentFocusIndex;
						try {
							b[d].getInputElement().$.blur();
						} catch (c) {}
						var e = d = (d + a + b.length) % b.length;
						for (; a && !b[e].isFocusable();) {
							e = (e + a + b.length) % b.length;
							if (e == d) {
								break;
							}
						}
						b[e].focus();
						if (b[e].type == "text") {
							b[e].select();
						}
					}
				}

				function n(a) {
					if (u == CKEDITOR.dialog._.currentTop) {
						var d = a.data.getKeystroke();
						var e = c$$0.lang.dir == "rtl";
						w = B = 0;
						if (d == 9 || d == CKEDITOR.SHIFT + 9) {
							d = d == CKEDITOR.SHIFT + 9;
							if (u._.tabBarMode) {
								d = d ? b$$2.call(u) : f$$0.call(u);
								u.selectPage(d);
								u._.tabs[d][0].focus();
							} else {
								i(d ? -1 : 1);
							}
							w = 1;
						} else {
							if (d == CKEDITOR.ALT + 121 && (!u._.tabBarMode && u.getPageCount() > 1)) {
								u._.tabBarMode = true;
								u._.tabs[u._.currentTabId][0].focus();
								w = 1;
							} else {
								if ((d == 37 || d == 39) && u._.tabBarMode) {
									d = d == (e ? 39 : 37) ? b$$2.call(u) : f$$0.call(u);
									u.selectPage(d);
									u._.tabs[d][0].focus();
									w = 1;
								} else {
									if ((d == 13 || d == 32) && u._.tabBarMode) {
										this.selectPage(this._.currentTabId);
										this._.tabBarMode = false;
										this._.currentFocusIndex = -1;
										i(1);
										w = 1;
									} else {
										if (d == 13) {
											d = a.data.getTarget();
											if (!d.is("a", "button", "select", "textarea") && (!d.is("input") || d.$.type != "button")) {
												if (d = this.getButton("ok")) {
													CKEDITOR.tools.setTimeout(d.click, 0, d);
												}
												w = 1;
											}
											B = 1;
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
												B = 1;
											} else {
												return;
											}
										}
									}
								}
							}
						}
						m(a);
					}
				}

				function m(a) {
					if (w) {
						a.data.preventDefault(1);
					} else {
						if (B) {
							a.data.stopPropagation();
						}
					}
				}
				var l = CKEDITOR.dialog._.dialogDefinitions[g];
				var o = CKEDITOR.tools.clone(r$$0);
				var q = c$$0.config.dialog_buttonsOrder || "OS";
				var p = c$$0.lang.dir;
				var t = {};
				var w;
				var B;
				if (q == "OS" && CKEDITOR.env.mac || (q == "rtl" && p == "ltr" || q == "ltr" && p == "rtl")) {
					o.buttons.reverse();
				}
				l = CKEDITOR.tools.extend(l(c$$0), o);
				l = CKEDITOR.tools.clone(l);
				l = new s(this, l);
				o = e$$1(c$$0);
				this._ = {
					editor: c$$0,
					element: o.element,
					name: g,
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
				this.parts = o.parts;
				CKEDITOR.tools.setTimeout(function() {
					c$$0.fire("ariaWidget", this.parts.contents);
				}, 0, this);
				o = {
					position: CKEDITOR.env.ie6Compat ? "absolute" : "fixed",
					top: 0,
					visibility: "hidden"
				};
				o[p == "rtl" ? "right" : "left"] = 0;
				this.parts.dialog.setStyles(o);
				CKEDITOR.event.call(this);
				this.definition = l = CKEDITOR.fire("dialogDefinition", {
					name: g,
					definition: l
				}, c$$0).definition;
				if (!("removeDialogTabs" in c$$0._) && c$$0.config.removeDialogTabs) {
					o = c$$0.config.removeDialogTabs.split(";");
					p = 0;
					for (; p < o.length; p++) {
						q = o[p].split(":");
						if (q.length == 2) {
							var v = q[0];
							if (!t[v]) {
								t[v] = [];
							}
							t[v].push(q[1]);
						}
					}
					c$$0._.removeDialogTabs = t;
				}
				if (c$$0._.removeDialogTabs && (t = c$$0._.removeDialogTabs[g])) {
					p = 0;
					for (; p < t.length; p++) {
						l.removeContents(t[p]);
					}
				}
				if (l.onLoad) {
					this.on("load", l.onLoad);
				}
				if (l.onShow) {
					this.on("show", l.onShow);
				}
				if (l.onHide) {
					this.on("hide", l.onHide);
				}
				if (l.onOk) {
					this.on("ok", function(a) {
						c$$0.fire("saveSnapshot");
						setTimeout(function() {
							c$$0.fire("saveSnapshot");
						}, 0);
						if (l.onOk.call(this, a) === false) {
							a.data.hide = false;
						}
					});
				}
				if (l.onCancel) {
					this.on("cancel", function(a) {
						if (l.onCancel.call(this, a) === false) {
							a.data.hide = false;
						}
					});
				}
				var u = this;
				var x = function(a) {
					var b = u._.contents;
					var d = false;
					var c;
					for (c in b) {
						var e;
						for (e in b[c]) {
							if (d = a.call(this, b[c][e])) {
								return;
							}
						}
					}
				};
				this.on("ok", function(b) {
					x(function(d) {
						if (d.validate) {
							var c = d.validate(this);
							var e = typeof c == "string" || c === false;
							if (e) {
								b.data.hide = false;
								b.stop();
							}
							a$$2.call(d, !e, typeof c == "string" ? c : void 0);
							return e;
						}
					});
				}, this, null, 0);
				this.on("cancel", function(a) {
					x(function(b) {
						if (b.isChanged()) {
							if (!c$$0.config.dialog_noConfirmCancel && !confirm(c$$0.lang.common.confirmCancel)) {
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
				this.changeFocus = i;
				var H = this._.element;
				c$$0.focusManager.add(H, 1);
				this.on("show", function() {
					H.on("keydown", n, this);
					if (CKEDITOR.env.opera || CKEDITOR.env.gecko) {
						H.on("keypress", m, this);
					}
				});
				this.on("hide", function() {
					H.removeListener("keydown", n);
					if (CKEDITOR.env.opera || CKEDITOR.env.gecko) {
						H.removeListener("keypress", m);
					}
					x(function(a) {
						d$$1.apply(a);
					});
				});
				this.on("iframeAdded", function(a) {
					(new CKEDITOR.dom.document(a.data.iframe.$.contentWindow.document)).on("keydown", n, this, null, 0);
				});
				this.on("show", function() {
					h();
					if (c$$0.config.dialog_startupFocusTab && u._.pageCount > 1) {
						u._.tabBarMode = true;
						u._.tabs[u._.currentTabId][0].focus();
					} else {
						if (!this._.hasFocus) {
							this._.currentFocusIndex = -1;
							if (l.onFocus) {
								var a = l.onFocus.call(this);
								if (a) {
									a.focus();
								}
							} else {
								i(1);
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
				j$$0(this);
				k$$0(this);
				(new CKEDITOR.dom.text(l.title, CKEDITOR.document)).appendTo(this.parts.title);
				p = 0;
				for (; p < l.contents.length; p++) {
					if (t = l.contents[p]) {
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
							i(1);
						}
						a.data.preventDefault();
					}
				}, this);
				p = [];
				t = CKEDITOR.dialog._.uiElementBuilders.hbox.build(this, {
					type: "hbox",
					className: "cke_dialog_footer_buttons",
					widths: [],
					children: l.buttons
				}, p).getChild();
				this.parts.footer.setHtml(p.join(""));
				p = 0;
				for (; p < t.length; p++) {
					this._.buttons[t[p].id] = t[p];
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
				move: function(a, b, d) {
					var c = this._.element.getFirst();
					var e = this._.editor.lang.dir == "rtl";
					var g = c.getComputedStyle("position") == "fixed";
					if (CKEDITOR.env.ie) {
						c.setStyle("zoom", "100%");
					}
					if (!g || (!this._.position || !(this._.position.x == a && this._.position.y == b))) {
						this._.position = {
							x: a,
							y: b
						};
						if (!g) {
							g = CKEDITOR.document.getWindow().getScrollPosition();
							a = a + g.x;
							b = b + g.y;
						}
						if (e) {
							g = this.getSize();
							a = CKEDITOR.document.getWindow().getViewPaneSize().width - g.width - a;
						}
						b = {
							top: (b > 0 ? b : 0) + "px"
						};
						b[e ? "right" : "left"] = (a > 0 ? a : 0) + "px";
						c.setStyles(b);
						if (d) {
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
					if (CKEDITOR.env.gecko && CKEDITOR.env.version < 10900) {
						var d = this.parts.dialog;
						d.setStyle("position", "absolute");
						setTimeout(function() {
							d.setStyle("position", "fixed");
						}, 0);
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
						m$$1(this._.editor);
					} else {
						this._.parentDialog = CKEDITOR.dialog._.currentTop;
						this._.parentDialog.getElement().getFirst().$.style.zIndex -= Math.floor(this._.editor.config.baseFloatZIndex / 2);
						CKEDITOR.dialog._.currentTop = this;
					}
					a$$0.on("keydown", B$$0);
					a$$0.on(CKEDITOR.env.opera ? "keypress" : "keyup", H$$0);
					this._.hasFocus = false;
					var c;
					for (c in b.contents) {
						if (b.contents[c]) {
							a$$0 = b.contents[c];
							var e = this._.tabs[a$$0.id];
							var g = a$$0.requiredContent;
							var h = 0;
							if (e) {
								var f;
								for (f in this._.contents[a$$0.id]) {
									var j = this._.contents[a$$0.id][f];
									if (!(j.type == "hbox" || (j.type == "vbox" || !j.getInputElement()))) {
										if (j.requiredContent && !this._.editor.activeFilter.check(j.requiredContent)) {
											j.disable();
										} else {
											j.enable();
											h++;
										}
									}
								}
								if (!h || g && !this._.editor.activeFilter.check(g)) {
									e[0].addClass("cke_dialog_tab_disabled");
								} else {
									e[0].removeClass("cke_dialog_tab_disabled");
								}
							}
						}
					}
					CKEDITOR.tools.setTimeout(function() {
						this.layout();
						i$$0(this);
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
					var d = CKEDITOR.document.getWindow().getViewPaneSize();
					var c = (d.width - b.width) / 2;
					var e = (d.height - b.height) / 2;
					if (!CKEDITOR.env.ie6Compat) {
						if (b.height + (e > 0 ? e : 0) > d.height || b.width + (c > 0 ? c : 0) > d.width) {
							a.setStyle("position", "absolute");
						} else {
							a.setStyle("position", "fixed");
						}
					}
					this.move(this._.moved ? this._.position.x : c, this._.moved ? this._.position.y : e);
				},
				foreach: function(a) {
					var b;
					for (b in this._.contents) {
						var d;
						for (d in this._.contents[b]) {
							a.call(this, this._.contents[b][d]);
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
						O(this);
						for (; CKEDITOR.dialog._.currentTop != this;) {
							CKEDITOR.dialog._.currentTop.hide();
						}
						if (this._.parentDialog) {
							var b = this._.parentDialog.getElement().getFirst();
							b.setStyle("z-index", parseInt(b.$.style.zIndex, 10) + Math.floor(this._.editor.config.baseFloatZIndex / 2));
						} else {
							q$$0(this._.editor);
						}
						if (CKEDITOR.dialog._.currentTop = this._.parentDialog) {
							CKEDITOR.dialog._.currentZIndex = CKEDITOR.dialog._.currentZIndex - 10;
						} else {
							CKEDITOR.dialog._.currentZIndex = null;
							a$$0.removeListener("keydown", B$$0);
							a$$0.removeListener(CKEDITOR.env.opera ? "keypress" : "keyup", H$$0);
							var d = this._.editor;
							d.focus();
							setTimeout(function() {
								d.focusManager.unlock();
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
						var d = a.label ? ' title="' + CKEDITOR.tools.htmlEncode(a.label) + '"' : "";
						var c = CKEDITOR.dialog._.uiElementBuilders.vbox.build(this, {
							type: "vbox",
							className: "cke_dialog_page_contents",
							children: a.elements,
							expand: !!a.expand,
							padding: a.padding,
							style: a.style || "width: 100%;"
						}, b);
						var e = this._.contents[a.id] = {};
						var g = c.getChild();
						var h = 0;
						for (; c = g.shift();) {
							if (!c.notAllowed) {
								if (c.type != "hbox" && c.type != "vbox") {
									h++;
								}
							}
							e[c.id] = c;
							if (typeof c.getChild == "function") {
								g.push.apply(g, c.getChild());
							}
						}
						if (!h) {
							a.hidden = true;
						}
						b = CKEDITOR.dom.element.createFromHtml(b.join(""));
						b.setAttribute("role", "tabpanel");
						c = CKEDITOR.env;
						e = "cke_" + a.id + "_" + CKEDITOR.tools.getNextNumber();
						d = CKEDITOR.dom.element.createFromHtml(['<a class="cke_dialog_tab"', this._.pageCount > 0 ? " cke_last" : "cke_first", d, a.hidden ? ' style="display:none"' : "", ' id="', e, '"', c.gecko && (c.version >= 10900 && !c.hc) ? "" : ' href="javascript:void(0)"', ' tabIndex="-1" hidefocus="true" role="tab">', a.label, "</a>"].join(""));
						b.setAttribute("aria-labelledby", e);
						this._.tabs[a.id] = [d, b];
						this._.tabIdList.push(a.id);
						if (!a.hidden) {
							this._.pageCount++;
						}
						this._.lastTab = d;
						this.updateStyle();
						b.setAttribute("name", a.id);
						b.appendTo(this.parts.contents);
						d.unselectable();
						this.parts.tabs.append(d);
						if (a.accessKey) {
							F(this, this, "CTRL+" + a.accessKey, J, G);
							this._.accessKeyMap["CTRL+" + a.accessKey] = a.id;
						}
					}
				},
				selectPage: function(a) {
					if (this._.currentTabId != a && (!this._.tabs[a][0].hasClass("cke_dialog_tab_disabled") && this.fire("selectPage", {
						page: a,
						currentPage: this._.currentTabId
					}) !== false)) {
						var b;
						for (b in this._.tabs) {
							var d = this._.tabs[b][0];
							var e = this._.tabs[b][1];
							if (b != a) {
								d.removeClass("cke_dialog_tab_selected");
								e.hide();
							}
							e.setAttribute("aria-hidden", b != a);
						}
						var g = this._.tabs[a];
						g[0].addClass("cke_dialog_tab_selected");
						if (CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat) {
							c$$1(g[1]);
							g[1].show();
							setTimeout(function() {
								c$$1(g[1], 1);
							}, 0);
						} else {
							g[1].show();
						}
						this._.currentTabId = a;
						this._.currentTabIndex = CKEDITOR.tools.indexOf(this._.tabIdList, a);
					}
				},
				updateStyle: function() {
					this.parts.dialog[(this._.pageCount === 1 ? "add" : "remove") + "Class"]("cke_single_page");
				},
				hidePage: function(a) {
					var d = this._.tabs[a] && this._.tabs[a][0];
					if (d && (this._.pageCount != 1 && d.isVisible())) {
						if (a == this._.currentTabId) {
							this.selectPage(b$$2.call(this));
						}
						d.hide();
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
					var d = this._.contents[a];
					return d && d[b];
				},
				getValueOf: function(a, b) {
					return this.getContentElement(a, b).getValue();
				},
				setValueOf: function(a, b, d) {
					return this.getContentElement(a, b).setValue(d);
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
						this._.focusList.push(new g$$1(this, a, b));
					} else {
						this._.focusList.splice(b, 0, new g$$1(this, a, b));
						var d = b + 1;
						for (; d < this._.focusList.length; d++) {
							this._.focusList[d].focusIndex++;
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
				isTabEnabled: function(a, b, d) {
					a = a.config.removeDialogTabs;
					return !(a && a.match(RegExp("(?:^|;)" + b + ":" + d + "(?:$|;)", "i")));
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
						return CKEDITOR.tools.extend(function(d) {
							return a$$1(d, b);
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
						return CKEDITOR.tools.extend(function(d) {
							return a$$1(d, b);
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
			var r$$0 = {
				resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
				minWidth: 600,
				minHeight: 400,
				buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton]
			};
			var p$$0 = function(a, b, d) {
				var c = 0;
				var e;
				for (; e = a[c]; c++) {
					if (e.id == b) {
						return e;
					}
					if (d && e[d]) {
						if (e = p$$0(e[d], b, d)) {
							return e;
						}
					}
				}
				return null;
			};
			var t$$0 = function(a, b, d, c, e) {
				if (d) {
					var g = 0;
					var h;
					for (; h = a[g]; g++) {
						if (h.id == d) {
							a.splice(g, 0, b);
							return b;
						}
						if (c && h[c]) {
							if (h = t$$0(h[c], b, d, c, true)) {
								return h;
							}
						}
					}
					if (e) {
						return null;
					}
				}
				a.push(b);
				return b;
			};
			var w$$0 = function(a, b, d) {
				var c = 0;
				var e;
				for (; e = a[c]; c++) {
					if (e.id == b) {
						return a.splice(c, 1);
					}
					if (d && e[d]) {
						if (e = w$$0(e[d], b, d)) {
							return e;
						}
					}
				}
				return null;
			};
			var s = function(a, b) {
				this.dialog = a;
				var d = b.contents;
				var c = 0;
				var e;
				for (; e = d[c]; c++) {
					d[c] = e && new h$$1(a, e);
				}
				CKEDITOR.tools.extend(this, b);
			};
			s.prototype = {
				getContents: function(a) {
					return p$$0(this.contents, a);
				},
				getButton: function(a) {
					return p$$0(this.buttons, a);
				},
				addContents: function(a, b) {
					return t$$0(this.contents, a, b);
				},
				addButton: function(a, b) {
					return t$$0(this.buttons, a, b);
				},
				removeContents: function(a) {
					w$$0(this.contents, a);
				},
				removeButton: function(a) {
					w$$0(this.buttons, a);
				}
			};
			h$$1.prototype = {
				get: function(a) {
					return p$$0(this.elements, a, "children");
				},
				add: function(a, b) {
					return t$$0(this.elements, a, b, "children");
				},
				remove: function(a) {
					w$$0(this.elements, a, "children");
				}
			};
			var v$$0;
			var z = {};
			var u$$0;
			var x$$0 = {};
			var B$$0 = function(a) {
				var b = a.data.$.ctrlKey || a.data.$.metaKey;
				var d = a.data.$.altKey;
				var c = a.data.$.shiftKey;
				var e = String.fromCharCode(a.data.$.keyCode);
				if ((b = x$$0[(b ? "CTRL+" : "") + (d ? "ALT+" : "") + (c ? "SHIFT+" : "") + e]) && b.length) {
					b = b[b.length - 1];
					if (b.keydown) {
						b.keydown.call(b.uiElement, b.dialog, b.key);
					}
					a.data.preventDefault();
				}
			};
			var H$$0 = function(a) {
				var b = a.data.$.ctrlKey || a.data.$.metaKey;
				var d = a.data.$.altKey;
				var c = a.data.$.shiftKey;
				var e = String.fromCharCode(a.data.$.keyCode);
				if ((b = x$$0[(b ? "CTRL+" : "") + (d ? "ALT+" : "") + (c ? "SHIFT+" : "") + e]) && b.length) {
					b = b[b.length - 1];
					if (b.keyup) {
						b.keyup.call(b.uiElement, b.dialog, b.key);
						a.data.preventDefault();
					}
				}
			};
			var F = function(a, b, d, c, e) {
				(x$$0[d] || (x$$0[d] = [])).push({
					uiElement: a,
					dialog: b,
					key: d,
					keyup: e || a.accessKeyUp,
					keydown: c || a.accessKeyDown
				});
			};
			var O = function(a) {
				var b;
				for (b in x$$0) {
					var d = x$$0[b];
					var c = d.length - 1;
					for (; c >= 0; c--) {
						if (d[c].dialog == a || d[c].uiElement == a) {
							d.splice(c, 1);
						}
					}
					if (d.length === 0) {
						delete x$$0[b];
					}
				}
			};
			var G = function(a, b) {
				if (a._.accessKeyMap[b]) {
					a.selectPage(a._.accessKeyMap[b]);
				}
			};
			var J = function() {};
			(function() {
				CKEDITOR.ui.dialog = {
					uiElement: function(a$$0, b$$0, d$$0, c, e, g, h) {
						if (!(arguments.length < 4)) {
							var f = (c.call ? c(b$$0) : c) || "div";
							var i = ["<", f, " "];
							var j = (e && e.call ? e(b$$0) : e) || {};
							var k = (g && g.call ? g(b$$0) : g) || {};
							var n = (h && h.call ? h.call(this, a$$0, b$$0) : h) || "";
							var m = this.domId = k.id || CKEDITOR.tools.getNextId() + "_uiElement";
							this.id = b$$0.id;
							if (b$$0.requiredContent && !a$$0.getParentEditor().filter.check(b$$0.requiredContent)) {
								j.display = "none";
								this.notAllowed = true;
							}
							k.id = m;
							var l = {};
							if (b$$0.type) {
								l["cke_dialog_ui_" + b$$0.type] = 1;
							}
							if (b$$0.className) {
								l[b$$0.className] = 1;
							}
							if (b$$0.disabled) {
								l.cke_disabled = 1;
							}
							var o = k["class"] && k["class"].split ? k["class"].split(" ") : [];
							m = 0;
							for (; m < o.length; m++) {
								if (o[m]) {
									l[o[m]] = 1;
								}
							}
							o = [];
							for (m in l) {
								o.push(m);
							}
							k["class"] = o.join(" ");
							if (b$$0.title) {
								k.title = b$$0.title;
							}
							l = (b$$0.style || "").split(";");
							if (b$$0.align) {
								o = b$$0.align;
								j["margin-left"] = o == "left" ? 0 : "auto";
								j["margin-right"] = o == "right" ? 0 : "auto";
							}
							for (m in j) {
								l.push(m + ":" + j[m]);
							}
							if (b$$0.hidden) {
								l.push("display:none");
							}
							m = l.length - 1;
							for (; m >= 0; m--) {
								if (l[m] === "") {
									l.splice(m, 1);
								}
							}
							if (l.length > 0) {
								k.style = (k.style ? k.style + "; " : "") + l.join("; ");
							}
							for (m in k) {
								i.push(m + '="' + CKEDITOR.tools.htmlEncode(k[m]) + '" ');
							}
							i.push(">", n, "</", f, ">");
							d$$0.push(i.join(""));
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
									return function(d) {
										a.call(this, b$$0.setValue.call(this, d));
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
									F(this, a$$0, "CTRL+" + b$$0.accessKey);
								}
							}
							var q = this;
							a$$0.on("load", function() {
								var b = q.getInputElement();
								if (b) {
									var d = q.type in {
										checkbox: 1,
										ratio: 1
									} && (CKEDITOR.env.ie && CKEDITOR.env.version < 8) ? "cke_dialog_ui_focused" : "";
									b.on("focus", function() {
										a$$0._.tabBarMode = false;
										a$$0._.hasFocus = true;
										q.fire("focus");
										if (d) {
											this.addClass(d);
										}
									});
									b.on("blur", function() {
										q.fire("blur");
										if (d) {
											this.removeClass(d);
										}
									});
								}
							});
							CKEDITOR.tools.extend(this, b$$0);
							if (this.keyboardFocusable) {
								this.tabIndex = b$$0.tabIndex || 0;
								this.focusIndex = a$$0._.focusList.push(this) - 1;
								this.on("focus", function() {
									a$$0._.currentFocusIndex = q.focusIndex;
								});
							}
						}
					},
					hbox: function(a$$0, b$$0, d, c$$0, e) {
						if (!(arguments.length < 4)) {
							if (!this._) {
								this._ = {};
							}
							var g = this._.children = b$$0;
							var h = e && e.widths || null;
							var f = e && e.height || null;
							var i;
							var j = {
								role: "presentation"
							};
							if (e) {
								if (e.align) {
									j.align = e.align;
								}
							}
							CKEDITOR.ui.dialog.uiElement.call(this, a$$0, e || {
								type: "hbox"
							}, c$$0, "table", {}, j, function() {
								var a = ['<tbody><tr class="cke_dialog_ui_hbox">'];
								i = 0;
								for (; i < d.length; i++) {
									var b = "cke_dialog_ui_hbox_child";
									var c = [];
									if (i === 0) {
										b = "cke_dialog_ui_hbox_first";
									}
									if (i == d.length - 1) {
										b = "cke_dialog_ui_hbox_last";
									}
									a.push('<td class="', b, '" role="presentation" ');
									if (h) {
										if (h[i]) {
											c.push("width:" + o$$0(h[i]));
										}
									} else {
										c.push("width:" + Math.floor(100 / d.length) + "%");
									}
									if (f) {
										c.push("height:" + o$$0(f));
									}
									if (e) {
										if (e.padding != void 0) {
											c.push("padding:" + o$$0(e.padding));
										}
									}
									if (CKEDITOR.env.ie) {
										if (CKEDITOR.env.quirks && g[i].align) {
											c.push("text-align:" + g[i].align);
										}
									}
									if (c.length > 0) {
										a.push('style="' + c.join("; ") + '" ');
									}
									a.push(">", d[i], "</td>");
								}
								a.push("</tr></tbody>");
								return a.join("");
							});
						}
					},
					vbox: function(a, b$$0, d, c$$0, e) {
						if (!(arguments.length < 3)) {
							if (!this._) {
								this._ = {};
							}
							var g = this._.children = b$$0;
							var h = e && e.width || null;
							var f = e && e.heights || null;
							CKEDITOR.ui.dialog.uiElement.call(this, a, e || {
								type: "vbox"
							}, c$$0, "div", null, {
								role: "presentation"
							}, function() {
								var b = ['<table role="presentation" cellspacing="0" border="0" '];
								b.push('style="');
								if (e) {
									if (e.expand) {
										b.push("height:100%;");
									}
								}
								b.push("width:" + o$$0(h || "100%"), ";");
								if (CKEDITOR.env.webkit) {
									b.push("float:none;");
								}
								b.push('"');
								b.push('align="', CKEDITOR.tools.htmlEncode(e && e.align || (a.getParentEditor().lang.dir == "ltr" ? "left" : "right")), '" ');
								b.push("><tbody>");
								var c = 0;
								for (; c < d.length; c++) {
									var i = [];
									b.push('<tr><td role="presentation" ');
									if (h) {
										i.push("width:" + o$$0(h || "100%"));
									}
									if (f) {
										i.push("height:" + o$$0(f[c]));
									} else {
										if (e) {
											if (e.expand) {
												i.push("height:" + Math.floor(100 / d.length) + "%");
											}
										}
									}
									if (e) {
										if (e.padding != void 0) {
											i.push("padding:" + o$$0(e.padding));
										}
									}
									if (CKEDITOR.env.ie) {
										if (CKEDITOR.env.quirks && g[c].align) {
											i.push("text-align:" + g[c].align);
										}
									}
									if (i.length > 0) {
										b.push('style="', i.join("; "), '" ');
									}
									b.push(' class="cke_dialog_ui_vbox_child">', d[c], "</td></tr>");
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
					var d$$0;
					var c$$0 = function(a, b, d, c) {
						b.on("load", function() {
							a.getInputElement().on(d, c, a);
						});
					};
					var e;
					for (e in a$$0) {
						if (d$$0 = e.match(b$$0)) {
							if (this.eventProcessors[e]) {
								this.eventProcessors[e].call(this, this._.dialog, a$$0[e]);
							} else {
								c$$0(this, this._.dialog, d$$0[1].toLowerCase(), a$$0[e]);
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
					build: function(a, b, d) {
						var c = b.children;
						var e;
						var g = [];
						var h = [];
						var i = 0;
						for (; i < c.length && (e = c[i]); i++) {
							var f = [];
							g.push(f);
							h.push(CKEDITOR.dialog._.uiElementBuilders[e.type].build(a, e, f));
						}
						return new CKEDITOR.ui.dialog[b.type](a, h, g, d, b);
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
					if (CKEDITOR.env.opera) {
						CKEDITOR.tools.setTimeout(function() {
							a.openDialog(this.dialogName);
						}, 0, this);
					} else {
						a.openDialog(this.dialogName);
					}
				},
				canUndo: false,
				editorFocus: 1
			};
			(function() {
				var a$$1 = /^([a]|[^a])+$/;
				var b$$1 = /^\d*$/;
				var d$$0 = /^\d*(?:\.\d+)?$/;
				var c$$0 = /^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/;
				var e$$0 = /^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i;
				var g$$0 = /^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;
				CKEDITOR.VALIDATE_OR = 1;
				CKEDITOR.VALIDATE_AND = 2;
				CKEDITOR.dialog.validate = {
					functions: function() {
						var a = arguments;
						return function() {
							var b = this && this.getValue ? this.getValue() : a[0];
							var d = void 0;
							var c = CKEDITOR.VALIDATE_AND;
							var e = [];
							var g;
							g = 0;
							for (; g < a.length; g++) {
								if (typeof a[g] == "function") {
									e.push(a[g]);
								} else {
									break;
								}
							}
							if (g < a.length && typeof a[g] == "string") {
								d = a[g];
								g++;
							}
							if (g < a.length) {
								if (typeof a[g] == "number") {
									c = a[g];
								}
							}
							var h = c == CKEDITOR.VALIDATE_AND ? true : false;
							g = 0;
							for (; g < e.length; g++) {
								h = c == CKEDITOR.VALIDATE_AND ? h && e[g](b) : h || e[g](b);
							}
							return !h ? d : true;
						};
					},
					regex: function(a, b) {
						return function(d) {
							d = this && this.getValue ? this.getValue() : d;
							return !a.test(d) ? b : true;
						};
					},
					notEmpty: function(b) {
						return this.regex(a$$1, b);
					},
					integer: function(a) {
						return this.regex(b$$1, a);
					},
					number: function(a) {
						return this.regex(d$$0, a);
					},
					cssLength: function(a$$0) {
						return this.functions(function(a) {
							return e$$0.test(CKEDITOR.tools.trim(a));
						}, a$$0);
					},
					htmlLength: function(a$$0) {
						return this.functions(function(a) {
							return c$$0.test(CKEDITOR.tools.trim(a));
						}, a$$0);
					},
					inlineStyle: function(a$$0) {
						return this.functions(function(a) {
							return g$$0.test(CKEDITOR.tools.trim(a));
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
						var d;
						for (d in z) {
							z[d].remove();
						}
						z = {};
					}
					a = a.editor._.storedDialogs;
					var c;
					for (c in a) {
						a[c].destroy();
					}
				});
			})();
			CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
				openDialog: function(a, b) {
					var d = null;
					var c = CKEDITOR.dialog._.dialogDefinitions[a];
					if (CKEDITOR.dialog._.currentTop === null) {
						m$$1(this);
					}
					if (typeof c == "function") {
						d = this._.storedDialogs || (this._.storedDialogs = {});
						d = d[a] || (d[a] = new CKEDITOR.dialog(this, a));
						if (b) {
							b.call(d, d);
						}
						d.show();
					} else {
						if (c == "failed") {
							q$$0(this);
							throw Error('[CKEDITOR.dialog.openDialog] Dialog "' + a + '" failed when loading definition.');
						}
						if (typeof c == "string") {
							CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c), function() {
								if (typeof CKEDITOR.dialog._.dialogDefinitions[a] != "function") {
									CKEDITOR.dialog._.dialogDefinitions[a] = "failed";
								}
								this.openDialog(a, b);
							}, this, 0, 1);
						}
					}
					CKEDITOR.skin.loadPart("dialog");
					return d;
				}
			});
		})();
		CKEDITOR.plugins.add("dialog", {
			requires: "dialogui",
			init: function(b) {
				b.on("doubleclick", function(f) {
					if (f.data.dialog) {
						b.openDialog(f.data.dialog);
					}
				}, null, null, 999);
			}
		});
		CKEDITOR.plugins.colordialog = {
			requires: "dialog",
			init: function(b$$0) {
				var f = new CKEDITOR.dialogCommand("colordialog");
				f.editorFocus = false;
				b$$0.addCommand("colordialog", f);
				CKEDITOR.dialog.add("colordialog", this.path + "dialogs/colordialog.js");
				b$$0.getColorFromDialog = function(c, a$$1) {
					var d = function(b) {
						this.removeListener("ok", d);
						this.removeListener("cancel", d);
						b = b.name == "ok" ? this.getValueOf("picker", "selectedColor") : null;
						c.call(a$$1, b);
					};
					var e = function(a) {
						a.on("ok", d);
						a.on("cancel", d);
					};
					b$$0.execCommand("colordialog");
					if (b$$0._.storedDialogs && b$$0._.storedDialogs.colordialog) {
						e(b$$0._.storedDialogs.colordialog);
					} else {
						CKEDITOR.on("dialogDefinition", function(a$$0) {
							if (a$$0.data.name == "colordialog") {
								var b = a$$0.data.definition;
								a$$0.removeListener();
								b.onLoad = CKEDITOR.tools.override(b.onLoad, function(a) {
									return function() {
										e(this);
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
			function b$$2(a$$0) {
				function b$$1() {
					var d = a$$0.editable();
					d.on(x, function(a) {
						if (!CKEDITOR.env.ie || !v) {
							t(a);
						}
					});
					if (CKEDITOR.env.ie) {
						d.on("paste", function(b) {
							if (!z) {
								e$$0();
								b.data.preventDefault();
								t(b);
								if (!m$$0("paste")) {
									a$$0.openDialog("paste");
								}
							}
						});
					}
					if (CKEDITOR.env.ie) {
						d.on("contextmenu", f$$0, null, null, 0);
						d.on("beforepaste", function(a) {
							if (a.data) {
								if (!a.data.$.ctrlKey) {
									f$$0();
								}
							}
						}, null, null, 0);
					}
					d.on("beforecut", function() {
						if (!v) {
							o$$0(a$$0);
						}
					});
					var c;
					d.attachListener(CKEDITOR.env.ie ? d : a$$0.document.getDocumentElement(), "mouseup", function() {
						c = setTimeout(function() {
							w();
						}, 0);
					});
					a$$0.on("destroy", function() {
						clearTimeout(c);
					});
					d.on("keyup", w);
				}

				function d$$1(b$$0) {
					return {
						type: b$$0,
						canUndo: b$$0 == "cut",
						startDisabled: true,
						exec: function() {
							if (this.type == "cut") {
								o$$0();
							}
							var b;
							var d = this.type;
							if (CKEDITOR.env.ie) {
								b = m$$0(d);
							} else {
								try {
									b = a$$0.document.$.execCommand(d, false, null);
								} catch (c) {
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

				function c$$0() {
					return {
						canUndo: false,
						async: true,
						exec: function(a, b$$0) {
							var d$$0 = function(b, d) {
								if (b) {
									q(b.type, b.dataValue, !!d);
								}
								a.fire("afterCommandExec", {
									name: "paste",
									command: c,
									returnValue: !!b
								});
							};
							var c = this;
							if (typeof b$$0 == "string") {
								d$$0({
									type: "auto",
									dataValue: b$$0
								}, 1);
							} else {
								a.getClipboardData(d$$0);
							}
						}
					};
				}

				function e$$0() {
					z = 1;
					setTimeout(function() {
						z = 0;
					}, 100);
				}

				function f$$0() {
					v = 1;
					setTimeout(function() {
						v = 0;
					}, 10);
				}

				function m$$0(b) {
					var d = a$$0.document;
					var c = d.getBody();
					var e = false;
					var h = function() {
						e = true;
					};
					c.on(b, h);
					(CKEDITOR.env.version > 7 ? d.$ : d.$.selection.createRange()).execCommand(b);
					c.removeListener(b, h);
					return e;
				}

				function q(b, d, c) {
					b = {
						type: b
					};
					if (c && a$$0.fire("beforePaste", b) === false || !d) {
						return false;
					}
					b.dataValue = d;
					return a$$0.fire("paste", b);
				}

				function o$$0() {
					if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
						var b = a$$0.getSelection();
						var d;
						var c;
						var e;
						if (b.getType() == CKEDITOR.SELECTION_ELEMENT && (d = b.getSelectedElement())) {
							c = b.getRanges()[0];
							e = a$$0.document.createText("");
							e.insertBefore(d);
							c.setStartBefore(e);
							c.setEndAfter(d);
							b.selectRanges([c]);
							setTimeout(function() {
								if (d.getParent()) {
									e.remove();
									b.selectElement(d);
								}
							}, 0);
						}
					}
				}

				function l$$0(b$$0, d) {
					var c = a$$0.document;
					var e = a$$0.editable();
					var h = function(a) {
						a.cancel();
					};
					var f = CKEDITOR.env.gecko && CKEDITOR.env.version <= 10902;
					var i;
					if (!c.getById("cke_pastebin")) {
						var j = a$$0.getSelection();
						var k = j.createBookmarks();
						var n = new CKEDITOR.dom.element((CKEDITOR.env.webkit || e.is("body")) && (!CKEDITOR.env.ie && !CKEDITOR.env.opera) ? "body" : "div", c);
						n.setAttributes({
							id: "cke_pastebin",
							"data-cke-temp": "1"
						});
						if (CKEDITOR.env.opera) {
							n.appendBogus();
						}
						var m = 0;
						c = c.getWindow();
						if (f) {
							n.insertAfter(k[0].startNode);
							n.setStyle("display", "inline");
						} else {
							if (CKEDITOR.env.webkit) {
								e.append(n);
								n.addClass("cke_editable");
								if (!e.is("body")) {
									f = e.getComputedStyle("position") != "static" ? e : CKEDITOR.dom.element.get(e.$.offsetParent);
									m = f.getDocumentPosition().y;
								}
							} else {
								e.getAscendant(CKEDITOR.env.ie || CKEDITOR.env.opera ? "body" : "html", 1).append(n);
							}
							n.setStyles({
								position: "absolute",
								top: c.getScrollPosition().y - m + 10 + "px",
								width: "1px",
								height: Math.max(1, c.getViewPaneSize().height - 20) + "px",
								overflow: "hidden",
								margin: 0,
								padding: 0
							});
						}
						if (f = n.getParent().isReadOnly()) {
							n.setOpacity(0);
							n.setAttribute("contenteditable", true);
						} else {
							n.setStyle(a$$0.config.contentsLangDirection == "ltr" ? "left" : "right", "-1000px");
						}
						a$$0.on("selectionChange", h, null, null, 0);
						if (CKEDITOR.env.webkit || CKEDITOR.env.gecko) {
							i = e.once("blur", h, null, null, -100);
						}
						if (f) {
							n.focus();
						}
						f = new CKEDITOR.dom.range(n);
						f.selectNodeContents(n);
						var l = f.select();
						if (CKEDITOR.env.ie) {
							i = e.once("blur", function() {
								a$$0.lockSelection(l);
							});
						}
						var o = CKEDITOR.document.getWindow().getScrollPosition().y;
						setTimeout(function() {
							if (CKEDITOR.env.webkit || CKEDITOR.env.opera) {
								CKEDITOR.document[CKEDITOR.env.webkit ? "getBody" : "getDocumentElement"]().$.scrollTop = o;
							}
							if (i) {
								i.removeListener();
							}
							if (CKEDITOR.env.ie) {
								e.focus();
							}
							j.selectBookmarks(k);
							n.remove();
							var b;
							if (CKEDITOR.env.webkit && ((b = n.getFirst()) && (b.is && b.hasClass("Apple-style-span")))) {
								n = b;
							}
							a$$0.removeListener("selectionChange", h);
							d(n.getHtml());
						}, 0);
					}
				}

				function r() {
					if (CKEDITOR.env.ie) {
						a$$0.focus();
						e$$0();
						var b = a$$0.focusManager;
						b.lock();
						if (a$$0.editable().fire(x) && !m$$0("paste")) {
							b.unlock();
							return false;
						}
						b.unlock();
					} else {
						try {
							if (a$$0.editable().fire(x) && !a$$0.document.$.execCommand("Paste", false, null)) {
								throw 0;
							}
						} catch (d) {
							return false;
						}
					}
					return true;
				}

				function p(b) {
					if (a$$0.mode == "wysiwyg") {
						switch (b.data.keyCode) {
							case CKEDITOR.CTRL + 86:
								;
							case CKEDITOR.SHIFT + 45:
								b = a$$0.editable();
								e$$0();
								if (!CKEDITOR.env.ie) {
									b.fire("beforepaste");
								}
								if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.version < 10900) {
									b.fire("paste");
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

				function t(b) {
					var d = {
						type: "auto"
					};
					var c = a$$0.fire("beforePaste", d);
					l$$0(b, function(a) {
						a = a.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, "");
						if (c) {
							q(d.type, a, 0, 1);
						}
					});
				}

				function w() {
					if (a$$0.mode == "wysiwyg") {
						var b = s("paste");
						a$$0.getCommand("cut").setState(s("cut"));
						a$$0.getCommand("copy").setState(s("copy"));
						a$$0.getCommand("paste").setState(b);
						a$$0.fire("pasteState", b);
					}
				}

				function s(b) {
					if (u && b in {
						paste: 1,
						cut: 1
					}) {
						return CKEDITOR.TRISTATE_DISABLED;
					}
					if (b == "paste") {
						return CKEDITOR.TRISTATE_OFF;
					}
					b = a$$0.getSelection();
					var d = b.getRanges();
					return b.getType() == CKEDITOR.SELECTION_NONE || d.length == 1 && d[0].collapsed ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF;
				}
				var v = 0;
				var z = 0;
				var u = 0;
				var x = CKEDITOR.env.ie ? "beforepaste" : "paste";
				(function() {
					a$$0.on("key", p);
					a$$0.on("contentDom", b$$1);
					a$$0.on("selectionChange", function(a) {
						u = a.data.selection.getRanges()[0].checkReadOnly();
						w();
					});
					if (a$$0.contextMenu) {
						a$$0.contextMenu.addListener(function(a, b) {
							u = b.getRanges()[0].checkReadOnly();
							return {
								cut: s("cut"),
								copy: s("copy"),
								paste: s("paste")
							};
						});
					}
				})();
				(function() {
					function b(d, c, e, h, f) {
						var i = a$$0.lang.clipboard[c];
						a$$0.addCommand(c, e);
						if (a$$0.ui.addButton) {
							a$$0.ui.addButton(d, {
								label: i,
								command: c,
								toolbar: "clipboard," + h
							});
						}
						if (a$$0.addMenuItems) {
							a$$0.addMenuItem(c, {
								label: i,
								command: c,
								group: "clipboard",
								order: f
							});
						}
					}
					b("Cut", "cut", d$$1("cut"), 10, 1);
					b("Copy", "copy", d$$1("copy"), 20, 4);
					b("Paste", "paste", c$$0(), 30, 8);
				})();
				a$$0.getClipboardData = function(b, d) {
					function c(a) {
						a.removeListener();
						a.cancel();
						d(a.data);
					}

					function e(a) {
						a.removeListener();
						a.cancel();
						j = true;
						d({
							type: i,
							dataValue: a.data
						});
					}

					function h() {
						this.customTitle = b && b.title;
					}
					var f = false;
					var i = "auto";
					var j = false;
					if (!d) {
						d = b;
						b = null;
					}
					a$$0.on("paste", c, null, null, 0);
					a$$0.on("beforePaste", function(a) {
						a.removeListener();
						f = true;
						i = a.data.type;
					}, null, null, 1E3);
					if (r() === false) {
						a$$0.removeListener("paste", c);
						if (f && a$$0.fire("pasteDialog", h)) {
							a$$0.on("pasteDialogCommit", e);
							a$$0.on("dialogHide", function(a) {
								a.removeListener();
								a.data.removeListener("pasteDialogCommit", e);
								setTimeout(function() {
									if (!j) {
										d(null);
									}
								}, 10);
							});
						} else {
							d(null);
						}
					}
				};
			}

			function f$$1(a) {
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
						if (CKEDITOR.env.gecko || CKEDITOR.env.opera) {
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

			function c$$1(a$$0, b) {
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
				if ((CKEDITOR.env.gecko || CKEDITOR.env.opera) && a$$0.enterMode != CKEDITOR.ENTER_BR) {
					if (CKEDITOR.env.gecko) {
						b = b.replace(/^<br><br>$/, "<br>");
					}
					if (b.indexOf("<br><br>") > -1) {
						b = "<p>" + b.replace(/(<br>){2,}/g, function(a) {
							return d(a.length / 4);
						}) + "</p>";
					}
				}
				return e$$1(a$$0, b);
			}

			function a$$1() {
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
				var d$$0 = CKEDITOR.tools.extend({
					br: 0
				}, CKEDITOR.dtd.$inline);
				var c = {
					p: 1,
					br: 1,
					"cke:br": 1
				};
				var e = CKEDITOR.dtd;
				var f = CKEDITOR.tools.extend({
					area: 1,
					basefont: 1,
					embed: 1,
					iframe: 1,
					map: 1,
					object: 1,
					param: 1
				}, CKEDITOR.dtd.$nonBodyContent, CKEDITOR.dtd.$cdata);
				var m$$0 = function(a) {
					delete a.name;
					a.add(new CKEDITOR.htmlParser.text(" "));
				};
				var q = function(a) {
					var b = a;
					var d;
					for (;
						(b = b.next) && (b.name && b.name.match(/^h\d$/));) {
						d = new CKEDITOR.htmlParser.element("cke:br");
						d.isEmpty = true;
						a.add(d);
						for (; d = b.children.shift();) {
							a.add(d);
						}
					}
				};
				a$$0.addRules({
					elements: {
						h1: q,
						h2: q,
						h3: q,
						h4: q,
						h5: q,
						h6: q,
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
						td: m$$0,
						th: m$$0,
						$: function(a) {
							var g = a.name;
							var m;
							if (f[g]) {
								return false;
							}
							a.attributes = {};
							if (g == "br") {
								return a;
							}
							if (b$$0[g]) {
								a.name = "p";
							} else {
								if (d$$0[g]) {
									delete a.name;
								} else {
									if (e[g]) {
										m = new CKEDITOR.htmlParser.element("cke:br");
										m.isEmpty = true;
										if (CKEDITOR.dtd.$empty[g]) {
											return m;
										}
										a.add(m, 0);
										m = m.clone();
										m.isEmpty = true;
										a.add(m);
										delete a.name;
									}
								}
							}
							if (!c[a.name]) {
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

			function d$$2(a$$0, b, d) {
				b = new CKEDITOR.htmlParser.fragment.fromHtml(b);
				var c = new CKEDITOR.htmlParser.basicWriter;
				b.writeHtml(c, d);
				b = c.getHtml();
				b = b.replace(/\s*(<\/?[a-z:]+ ?\/?>)\s*/g, "$1").replace(/(<cke:br \/>){2,}/g, "<cke:br />").replace(/(<cke:br \/>)(<\/?p>|<br \/>)/g, "$2").replace(/(<\/?p>|<br \/>)(<cke:br \/>)/g, "$1").replace(/<(cke:)?br( \/)?>/g, "<br>").replace(/<p><\/p>/g, "");
				var f = 0;
				b = b.replace(/<\/?p>/g, function(a) {
					if (a == "<p>") {
						if (++f > 1) {
							return "</p><p>";
						}
					} else {
						if (--f > 0) {
							return "</p><p>";
						}
					}
					return a;
				}).replace(/<p><\/p>/g, "");
				return e$$1(a$$0, b);
			}

			function e$$1(a$$0, b) {
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
				init: function(e$$0) {
					var i;
					b$$2(e$$0);
					CKEDITOR.dialog.add("paste", CKEDITOR.getUrl(this.path + "dialogs/paste.js"));
					e$$0.on("paste", function(a$$0) {
						var b$$0 = a$$0.data.dataValue;
						var d = CKEDITOR.dtd.$block;
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
							var c$$0;
							var e;
							var g = new CKEDITOR.dom.element("div");
							g.setHtml(b$$0);
							for (; g.getChildCount() == 1 && ((c$$0 = g.getFirst()) && (c$$0.type == CKEDITOR.NODE_ELEMENT && (c$$0.hasClass("cke_editable") || c$$0.hasClass("cke_contents"))));) {
								g = e = c$$0;
							}
							if (e) {
								b$$0 = e.getHtml().replace(/<br>$/i, "");
							}
						}
						if (CKEDITOR.env.ie) {
							b$$0 = b$$0.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g, function(b, c) {
								if (c.toLowerCase() in d) {
									a$$0.data.preSniffing = "html";
									return "<" + c;
								}
								return b;
							});
						} else {
							if (CKEDITOR.env.webkit) {
								b$$0 = b$$0.replace(/<\/(\w+)><div><br><\/div>$/, function(b, c) {
									if (c in d) {
										a$$0.data.endsWithEOL = 1;
										return "</" + c + ">";
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
					e$$0.on("paste", function(b) {
						b = b.data;
						var j = b.type;
						var k = b.dataValue;
						var n;
						var m = e$$0.config.clipboard_defaultContentType || "html";
						n = j == "html" || b.preSniffing == "html" ? "html" : f$$1(k);
						if (n == "htmlifiedtext") {
							k = c$$1(e$$0.config, k);
						} else {
							if (j == "text") {
								if (n == "html") {
									k = d$$2(e$$0.config, k, i || (i = a$$1(e$$0)));
								}
							}
						}
						if (b.startsWithEOL) {
							k = '<br data-cke-eol="1">' + k;
						}
						if (b.endsWithEOL) {
							k = k + '<br data-cke-eol="1">';
						}
						if (j == "auto") {
							j = n == "html" || m == "html" ? "html" : "text";
						}
						b.type = j;
						b.dataValue = k;
						delete b.preSniffing;
						delete b.startsWithEOL;
						delete b.endsWithEOL;
					}, null, null, 6);
					e$$0.on("paste", function(a) {
						a = a.data;
						e$$0.insertHtml(a.dataValue, a.type);
						setTimeout(function() {
							e$$0.fire("afterPaste");
						}, 0);
					}, null, null, 1E3);
					e$$0.on("pasteDialog", function(a) {
						setTimeout(function() {
							e$$0.openDialog("paste", a.data);
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
			var b$$1 = CKEDITOR.addTemplate("panel", '<div lang="{langCode}" id="{id}" dir={dir} class="cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style="z-index:{z-index}" role="presentation">{frame}</div>');
			var f$$0 = CKEDITOR.addTemplate("panel-frame", '<iframe id="{id}" class="cke_panel_frame" role="presentation" frameborder="0" src="{src}"></iframe>');
			var c$$0 = CKEDITOR.addTemplate("panel-frame-inner", '<!DOCTYPE html><html class="cke_panel_container {env}" dir="{dir}" lang="{langCode}"><head>{css}</head><body class="cke_{dir}" style="margin:0;padding:0" onload="{onload}"></body></html>');
			CKEDITOR.ui.panel.prototype = {
				render: function(a$$1, d$$0) {
					this.getHolderElement = function() {
						var a$$0 = this._.holder;
						if (!a$$0) {
							if (this.isFramed) {
								a$$0 = this.document.getById(this.id + "_frame");
								var b$$0 = a$$0.getParent();
								a$$0 = a$$0.getFrameDocument();
								if (CKEDITOR.env.iOS) {
									b$$0.setStyles({
										overflow: "scroll",
										"-webkit-overflow-scrolling": "touch"
									});
								}
								b$$0 = CKEDITOR.tools.addFunction(CKEDITOR.tools.bind(function() {
									this.isLoaded = true;
									if (this.onLoad) {
										this.onLoad();
									}
								}, this));
								a$$0.write(c$$0.output(CKEDITOR.tools.extend({
									css: CKEDITOR.tools.buildStyleHtml(this.css),
									onload: "window.parent.CKEDITOR.tools.callFunction(" + b$$0 + ");"
								}, e)));
								a$$0.getWindow().$.CKEDITOR = CKEDITOR;
								a$$0.on("key" + (CKEDITOR.env.opera ? "press" : "down"), function(a) {
									var b = a.data.getKeystroke();
									var d = this.document.getById(this.id).getAttribute("dir");
									if (this._.onKeyDown && this._.onKeyDown(b) === false) {
										a.data.preventDefault();
									} else {
										if (b == 27 || b == (d == "rtl" ? 39 : 37)) {
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
									CKEDITOR.tools.callFunction(b$$0);
								}
							} else {
								a$$0 = this.document.getById(this.id);
							}
							this._.holder = a$$0;
						}
						return a$$0;
					};
					var e = {
						editorId: a$$1.id,
						id: this.id,
						langCode: a$$1.langCode,
						dir: a$$1.lang.dir,
						cls: this.className,
						frame: "",
						env: CKEDITOR.env.cssClass,
						"z-index": a$$1.config.baseFloatZIndex + 1
					};
					if (this.isFramed) {
						var g = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())" : "";
						e.frame = f$$0.output({
							id: this.id + "_frame",
							src: g
						});
					}
					g = b$$1.output(e);
					if (d$$0) {
						d$$0.push(g);
					}
					return g;
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
							if (CKEDITOR.env.webkit || CKEDITOR.env.opera) {
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
								var g = this._.focusIndex;
								c = this.element.getElementsByTag("a");
								var f;
								for (; f = c.getItem(++g);) {
									if (f.getAttribute("_cke_focus") && f.$.offsetWidth) {
										this._.focusIndex = g;
										f.focus();
										break;
									}
								}
								if (!f && !b) {
									this._.focusIndex = -1;
									return this.onKeyDown(a, 1);
								}
								return false;
							case "prev":
								g = this._.focusIndex;
								c = this.element.getElementsByTag("a");
								for (; g > 0 && (f = c.getItem(--g));) {
									if (f.getAttribute("_cke_focus") && f.$.offsetWidth) {
										this._.focusIndex = g;
										f.focus();
										break;
									}
									f = null;
								}
								if (!f && !b) {
									this._.focusIndex = c.count();
									return this.onKeyDown(a, 1);
								}
								return false;
							case "click":
								;
							case "mouseup":
								g = this._.focusIndex;
								if (f = g >= 0 && this.element.getElementsByTag("a").getItem(g)) {
									if (f.$[c]) {
										f.$[c]();
									} else {
										f.$["on" + c]();
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
			function b$$1(b, a, d, e, g) {
				g = CKEDITOR.tools.genKey(a.getUniqueId(), d.getUniqueId(), b.lang.dir, b.uiColor || "", e.css || "", g || "");
				var i = f$$0[g];
				if (!i) {
					i = f$$0[g] = new CKEDITOR.ui.panel(a, e);
					i.element = d.append(CKEDITOR.dom.element.createFromHtml(i.render(b), a));
					i.element.setStyles({
						display: "none",
						position: "absolute"
					});
				}
				return i;
			}
			var f$$0 = {};
			CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({
				$: function(c, a, d, e) {
					function g() {
						k.hide();
					}
					d.forceIFrame = 1;
					if (d.toolbarRelated) {
						if (c.elementMode == CKEDITOR.ELEMENT_MODE_INLINE) {
							a = CKEDITOR.document.getById("cke_" + c.name);
						}
					}
					var f = a.getDocument();
					e = b$$1(c, f, a, d, e || 0);
					var h = e.element;
					var j = h.getFirst();
					var k = this;
					h.disableContextMenu();
					this.element = h;
					this._ = {
						editor: c,
						panel: e,
						parentElement: a,
						definition: d,
						document: f,
						iframe: j,
						children: [],
						dir: c.lang.dir
					};
					c.on("mode", g);
					c.on("resize", g);
					f.getWindow().on("resize", g);
				},
				proto: {
					addBlock: function(b, a) {
						return this._.panel.addBlock(b, a);
					},
					addListBlock: function(b, a) {
						return this._.panel.addListBlock(b, a);
					},
					getBlock: function(b) {
						return this._.panel.getBlock(b);
					},
					showBlock: function(b$$0, a$$1, d$$0, e$$0, g$$0, f) {
						var h = this._.panel;
						var j = h.showBlock(b$$0);
						this.allowBlur(false);
						b$$0 = this._.editor.editable();
						this._.returnFocus = b$$0.hasFocus ? b$$0 : new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);
						var k = this.element;
						b$$0 = this._.iframe;
						b$$0 = CKEDITOR.env.ie ? b$$0 : new CKEDITOR.dom.window(b$$0.$.contentWindow);
						var n$$0 = k.getDocument();
						var m = this._.parentElement.getPositionedAncestor();
						var q = a$$1.getDocumentPosition(n$$0);
						n$$0 = m ? m.getDocumentPosition(n$$0) : {
							x: 0,
							y: 0
						};
						var o = this._.dir == "rtl";
						var l = q.x + (e$$0 || 0) - n$$0.x;
						var r = q.y + (g$$0 || 0) - n$$0.y;
						if (o && (d$$0 == 1 || d$$0 == 4)) {
							l = l + a$$1.$.offsetWidth;
						} else {
							if (!o && (d$$0 == 2 || d$$0 == 3)) {
								l = l + (a$$1.$.offsetWidth - 1);
							}
						}
						if (d$$0 == 3 || d$$0 == 4) {
							r = r + (a$$1.$.offsetHeight - 1);
						}
						this._.panel._.offsetParentId = a$$1.getId();
						k.setStyles({
							top: r + "px",
							left: 0,
							display: ""
						});
						k.setOpacity(0);
						k.getFirst().removeStyle("width");
						this._.editor.focusManager.add(b$$0);
						if (!this._.blurSet) {
							CKEDITOR.event.useCapture = true;
							b$$0.on("blur", function(a) {
								if (this.allowBlur() && (a.data.getPhase() == CKEDITOR.EVENT_PHASE_AT_TARGET && (this.visible && !this._.activeChild))) {
									delete this._.returnFocus;
									this.hide();
								}
							}, this);
							b$$0.on("focus", function() {
								this._.focused = true;
								this.hideChild();
								this.allowBlur(true);
							}, this);
							CKEDITOR.event.useCapture = false;
							this._.blurSet = 1;
						}
						h.onEscape = CKEDITOR.tools.bind(function(a) {
							if (this.onEscape && this.onEscape(a) === false) {
								return false;
							}
						}, this);
						CKEDITOR.tools.setTimeout(function() {
							var a$$0 = CKEDITOR.tools.bind(function() {
								k.removeStyle("width");
								if (j.autoSize) {
									var a = j.element.getDocument();
									a = (CKEDITOR.env.webkit ? j.element : a.getBody()).$.scrollWidth;
									if (CKEDITOR.env.ie) {
										if (CKEDITOR.env.quirks && a > 0) {
											a = a + ((k.$.offsetWidth || 0) - (k.$.clientWidth || 0) + 3);
										}
									}
									k.setStyle("width", a + 10 + "px");
									a = j.element.$.scrollHeight;
									if (CKEDITOR.env.ie) {
										if (CKEDITOR.env.quirks && a > 0) {
											a = a + ((k.$.offsetHeight || 0) - (k.$.clientHeight || 0) + 3);
										}
									}
									k.setStyle("height", a + "px");
									h._.currentBlock.element.setStyle("display", "none").removeStyle("display");
								} else {
									k.removeStyle("height");
								}
								if (o) {
									l = l - k.$.offsetWidth;
								}
								k.setStyle("left", l + "px");
								var b = h.element.getWindow();
								a = k.$.getBoundingClientRect();
								b = b.getViewPaneSize();
								var d = a.width || a.right - a.left;
								var c = a.height || a.bottom - a.top;
								var e = o ? a.right : b.width - a.left;
								var g = o ? b.width - a.right : a.left;
								if (o) {
									if (e < d) {
										l = g > d ? l + d : b.width > d ? l - a.left : l - a.right + b.width;
									}
								} else {
									if (e < d) {
										l = g > d ? l - d : b.width > d ? l - a.right + b.width : l - a.left;
									}
								}
								d = a.top;
								if (b.height - a.top < c) {
									r = d > c ? r - c : b.height > c ? r - a.bottom + b.height : r - a.top;
								}
								if (CKEDITOR.env.ie) {
									b = a = new CKEDITOR.dom.element(k.$.offsetParent);
									if (b.getName() == "html") {
										b = b.getDocument().getBody();
									}
									if (b.getComputedStyle("direction") == "rtl") {
										l = CKEDITOR.env.ie8Compat ? l - k.getDocument().getDocumentElement().$.scrollLeft * 2 : l - (a.$.scrollWidth - a.$.clientWidth);
									}
								}
								a = k.getFirst();
								var n;
								if (n = a.getCustomData("activePanel")) {
									if (n.onHide) {
										n.onHide.call(this, 1);
									}
								}
								a.setCustomData("activePanel", this);
								k.setStyles({
									top: r + "px",
									left: l + "px"
								});
								k.setOpacity(1);
								if (f) {
									f();
								}
							}, this);
							if (h.isLoaded) {
								a$$0();
							} else {
								h.onLoad = a$$0;
							}
							CKEDITOR.tools.setTimeout(function() {
								var a = CKEDITOR.env.webkit && CKEDITOR.document.getWindow().getScrollPosition().y;
								this.focus();
								j.element.focus();
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
							var b = CKEDITOR.document.getActive();
							if (!b.equals(this._.iframe)) {
								b.$.blur();
							}
						}
						(this._.lastFocused || this._.iframe.getFrameDocument().getWindow()).focus();
					},
					blur: function() {
						var b = this._.iframe.getFrameDocument().getActive();
						if (b.is("a")) {
							this._.lastFocused = b;
						}
					},
					hide: function(b) {
						if (this.visible && (!this.onHide || this.onHide.call(this) !== true)) {
							this.hideChild();
							if (CKEDITOR.env.gecko) {
								this._.iframe.getFrameDocument().$.activeElement.blur();
							}
							this.element.setStyle("display", "none");
							this.visible = 0;
							this.element.getFirst().removeCustomData("activePanel");
							if (b = b && this._.returnFocus) {
								if (CKEDITOR.env.webkit) {
									if (b.type) {
										b.getWindow().$.focus();
									}
								}
								b.focus();
							}
							delete this._.lastFocused;
							this._.editor.fire("panelHide", this);
						}
					},
					allowBlur: function(b) {
						var a = this._.panel;
						if (b != void 0) {
							a.allowBlur = b;
						}
						return a.allowBlur;
					},
					showAsChild: function(b, a, d, e, g, f) {
						if (!(this._.activeChild == b && b._.panel._.offsetParentId == d.getId())) {
							this.hideChild();
							b.onHide = CKEDITOR.tools.bind(function() {
								CKEDITOR.tools.setTimeout(function() {
									if (!this._.focused) {
										this.hide();
									}
								}, 0, this);
							}, this);
							this._.activeChild = b;
							this._.focused = false;
							b.showBlock(a, d, e, g, f);
							this.blur();
							if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) {
								setTimeout(function() {
									b.element.getChild(0).$.style.cssText += "";
								}, 100);
							}
						}
					},
					hideChild: function(b) {
						var a = this._.activeChild;
						if (a) {
							delete a.onHide;
							delete this._.activeChild;
							a.hide();
							if (b) {
								this.focus();
							}
						}
					}
				}
			});
			CKEDITOR.on("instanceDestroyed", function() {
				var b = CKEDITOR.tools.isEmpty(CKEDITOR.instances);
				var a;
				for (a in f$$0) {
					var d = f$$0[a];
					if (b) {
						d.destroy();
					} else {
						d.element.hide();
					}
				}
				if (b) {
					f$$0 = {};
				}
			});
		})();
		CKEDITOR.plugins.add("menu", {
			requires: "floatpanel",
			beforeInit: function(b$$0) {
				var f = b$$0.config.menu_groups.split(",");
				var c = b$$0._.menuGroups = {};
				var a$$0 = b$$0._.menuItems = {};
				var d$$0 = 0;
				for (; d$$0 < f.length; d$$0++) {
					c[f[d$$0]] = d$$0 + 1;
				}
				b$$0.addMenuGroup = function(a, b) {
					c[a] = b || 100;
				};
				b$$0.addMenuItem = function(b, d) {
					if (c[d.group]) {
						a$$0[b] = new CKEDITOR.menuItem(this, b, d);
					}
				};
				b$$0.addMenuItems = function(a) {
					var b;
					for (b in a) {
						this.addMenuItem(b, a[b]);
					}
				};
				b$$0.getMenuItem = function(b) {
					return a$$0[b];
				};
				b$$0.removeMenuItem = function(b) {
					delete a$$0[b];
				};
			}
		});
		(function() {
			function b$$0(a$$0) {
				a$$0.sort(function(a, b) {
					return a.group < b.group ? -1 : a.group > b.group ? 1 : a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
				});
			}
			var f$$0 = '<span class="cke_menuitem"><a id="{id}" class="cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href="{href}" title="{title}" tabindex="-1"_cke_focus=1 hidefocus="true" role="{role}" aria-haspopup="{hasPopup}" aria-disabled="{disabled}" {ariaChecked}';
			if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac) {
				f$$0 = f$$0 + ' onkeypress="return false;"';
			}
			if (CKEDITOR.env.gecko) {
				f$$0 = f$$0 + ' onblur="this.style.cssText = this.style.cssText;"';
			}
			f$$0 = f$$0 + (' onmouseover="CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout="CKEDITOR.tools.callFunction({moveOutFn},{index});" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},{index}); return false;">');
			var c$$0 = CKEDITOR.addTemplate("menuItem", f$$0 + '<span class="cke_menubutton_inner"><span class="cke_menubutton_icon"><span class="cke_button_icon cke_button__{iconName}_icon" style="{iconStyle}"></span></span><span class="cke_menubutton_label">{label}</span>{arrowHtml}</span></a></span>');
			var a$$1 = CKEDITOR.addTemplate("menuArrow", '<span class="cke_menuarrow"><span>{label}</span></span>');
			CKEDITOR.menu = CKEDITOR.tools.createClass({
				$: function(a, b) {
					b = this._.definition = b || {};
					this.id = CKEDITOR.tools.getNextId();
					this.editor = a;
					this.items = [];
					this._.listeners = [];
					this._.level = b.level || 1;
					var c = CKEDITOR.tools.extend({}, b.panel, {
						css: [CKEDITOR.skin.getPath("editor")],
						level: this._.level - 1,
						block: {}
					});
					var f = c.block.attributes = c.attributes || {};
					if (!f.role) {
						f.role = "menu";
					}
					this._.panelDefinition = c;
				},
				_: {
					onShow: function() {
						var a = this.editor.getSelection();
						var b = a && a.getStartElement();
						var c = this.editor.elementPath();
						var f = this._.listeners;
						this.removeAll();
						var h = 0;
						for (; h < f.length; h++) {
							var j = f[h](b, a, c);
							if (j) {
								var k;
								for (k in j) {
									var n = this.editor.getMenuItem(k);
									if (n && (!n.command || this.editor.getCommand(n.command).state)) {
										n.state = j[k];
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
						var c = this.items[a];
						if (c = c.getItems && c.getItems()) {
							if (b) {
								b.removeAll();
							} else {
								b = this._.subMenu = new CKEDITOR.menu(this.editor, CKEDITOR.tools.extend({}, this._.definition, {
									level: this._.level + 1
								}, true));
								b.parent = this;
								b._.onClick = CKEDITOR.tools.bind(this._.onClick, this);
							}
							var f;
							for (f in c) {
								var h = this.editor.getMenuItem(f);
								if (h) {
									h.state = c[f];
									b.add(h);
								}
							}
							var j = this._.panel.getBlock(this.id).element.getDocument().getById(this.id + ("" + a));
							setTimeout(function() {
								b.show(j, 2);
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
					show: function(a$$0, c, g, f) {
						if (!this.parent) {
							this._.onShow();
							if (!this.items.length) {
								return;
							}
						}
						c = c || (this.editor.lang.dir == "rtl" ? 2 : 1);
						var h = this.items;
						var j = this.editor;
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
							var m = n.keys;
							m[40] = "next";
							m[9] = "next";
							m[38] = "prev";
							m[CKEDITOR.SHIFT + 9] = "prev";
							m[j.lang.dir == "rtl" ? 37 : 39] = CKEDITOR.env.ie ? "mouseup" : "click";
							m[32] = CKEDITOR.env.ie ? "mouseup" : "click";
							if (CKEDITOR.env.ie) {
								m[13] = "mouseup";
							}
							n = this._.element = n.element;
							m = n.getDocument();
							m.getBody().setStyle("overflow", "hidden");
							m.getElementsByTag("html").getItem(0).setStyle("overflow", "hidden");
							this._.itemOverFn = CKEDITOR.tools.addFunction(function(a) {
								clearTimeout(this._.showSubTimeout);
								this._.showSubTimeout = CKEDITOR.tools.setTimeout(this._.showSubMenu, j.config.menu_subMenuDelay || 400, this, [a]);
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
						b$$0(h);
						m = j.elementPath();
						m = ['<div class="cke_menu' + (m && m.direction() != j.lang.dir ? " cke_mixed_dir_content" : "") + '" role="presentation">'];
						var q = h.length;
						var o = q && h[0].group;
						var l = 0;
						for (; l < q; l++) {
							var r = h[l];
							if (o != r.group) {
								m.push('<div class="cke_menuseparator" role="separator"></div>');
								o = r.group;
							}
							r.render(this, l, m);
						}
						m.push("</div>");
						n.setHtml(m.join(""));
						CKEDITOR.ui.fire("ready", this);
						if (this.parent) {
							this.parent._.panel.showAsChild(k, this.id, a$$0, c, g, f);
						} else {
							k.showBlock(this.id, a$$0, c, g, f);
						}
						j.fire("menuShow", [k]);
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
				$: function(a, b, c) {
					CKEDITOR.tools.extend(this, c, {
						order: 0,
						className: "cke_menubutton__" + b
					});
					this.group = a._.menuGroups[this.group];
					this.editor = a;
					this.name = b;
				},
				proto: {
					render: function(b, e, g) {
						var f = b.id + ("" + e);
						var h = typeof this.state == "undefined" ? CKEDITOR.TRISTATE_OFF : this.state;
						var j = "";
						var k = h == CKEDITOR.TRISTATE_ON ? "on" : h == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off";
						if (this.role in {
							menuitemcheckbox: 1,
							menuitemradio: 1
						}) {
							j = ' aria-checked="' + (h == CKEDITOR.TRISTATE_ON ? "true" : "false") + '"';
						}
						var n = this.getItems;
						var m = "&#" + (this.editor.lang.dir == "rtl" ? "9668" : "9658") + ";";
						var q = this.name;
						if (this.icon && !/\./.test(this.icon)) {
							q = this.icon;
						}
						b = {
							id: f,
							name: this.name,
							iconName: q,
							label: this.label,
							cls: this.className || "",
							state: k,
							hasPopup: n ? "true" : "false",
							disabled: h == CKEDITOR.TRISTATE_DISABLED,
							title: this.label,
							href: "javascript:void('" + (this.label || "").replace("'") + "')",
							hoverFn: b._.itemOverFn,
							moveOutFn: b._.itemOutFn,
							clickFn: b._.itemClickFn,
							index: e,
							iconStyle: CKEDITOR.skin.getIconStyle(q, this.editor.lang.dir == "rtl", q == this.icon ? null : this.icon, this.iconOffset),
							arrowHtml: n ? a$$1.output({
								label: m
							}) : "",
							role: this.role ? this.role : "menuitem",
							ariaChecked: j
						};
						c$$0.output(b, g);
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
					$: function(b) {
						this.base.call(this, b, {
							panel: {
								className: "cke_menu_panel",
								attributes: {
									"aria-label": b.lang.contextmenu.options
								}
							}
						});
					},
					proto: {
						addTarget: function(b$$0, f) {
							b$$0.on("contextmenu", function(a) {
								a = a.data;
								var b = CKEDITOR.env.webkit ? c : CKEDITOR.env.mac ? a.$.metaKey : a.$.ctrlKey;
								if (!f || !b) {
									a.preventDefault();
									var g = a.getTarget().getDocument();
									var i = a.getTarget().getDocument().getDocumentElement();
									b = !g.equals(CKEDITOR.document);
									g = g.getWindow().getScrollPosition();
									var h = b ? a.$.clientX : a.$.pageX || g.x + a.$.clientX;
									var j = b ? a.$.clientY : a.$.pageY || g.y + a.$.clientY;
									CKEDITOR.tools.setTimeout(function() {
										this.open(i, null, h, j);
									}, CKEDITOR.env.ie ? 200 : 0, this);
								}
							}, this);
							if (CKEDITOR.env.webkit) {
								var c;
								var a$$0 = function() {
									c = 0;
								};
								b$$0.on("keydown", function(a) {
									c = CKEDITOR.env.mac ? a.data.$.metaKey : a.data.$.ctrlKey;
								});
								b$$0.on("keyup", a$$0);
								b$$0.on("contextmenu", a$$0);
							}
						},
						open: function(b, f, c, a) {
							this.editor.focus();
							b = b || CKEDITOR.document.getDocumentElement();
							this.editor.selectionChange(1);
							this.show(b, f, c, a);
						}
					}
				});
			},
			beforeInit: function(b) {
				var f = b.contextMenu = new CKEDITOR.plugins.contextMenu(b);
				b.on("contentDom", function() {
					f.addTarget(b.editable(), b.config.browserContextMenuOnCtrl !== false);
				});
				b.addCommand("contextMenu", {
					exec: function() {
						b.contextMenu.open(b.document.getBody());
					}
				});
				b.setKeystroke(CKEDITOR.SHIFT + 121, "contextMenu");
				b.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 121, "contextMenu");
			}
		});
		(function() {
			function f$$1(a, g$$0) {
				function f$$0(b) {
					b = n.list[b];
					if (b.equals(a.editable()) || b.getAttribute("contenteditable") == "true") {
						var d = a.createRange();
						d.selectNodeContents(b);
						d.select();
					} else {
						a.getSelection().selectElement(b);
					}
					a.focus();
				}

				function h$$0() {
					if (k) {
						k.setHtml(c$$0);
					}
					delete n.list;
				}
				var j = a.ui.spaceId("path");
				var k;
				var n = a._.elementsPath;
				var m = n.idBase;
				g$$0.html = g$$0.html + ('<span id="' + j + '_label" class="cke_voice_label">' + a.lang.elementspath.eleLabel + '</span><span id="' + j + '" class="cke_path" role="group" aria-labelledby="' + j + '_label">' + c$$0 + "</span>");
				a.on("uiReady", function() {
					var b = a.ui.space("path");
					if (b) {
						a.focusManager.add(b, 1);
					}
				});
				n.onClick = f$$0;
				var q = CKEDITOR.tools.addFunction(f$$0);
				var o = CKEDITOR.tools.addFunction(function(b, d) {
					var c = n.idBase;
					var g;
					d = new CKEDITOR.dom.event(d);
					g = a.lang.dir == "rtl";
					switch (d.getKeystroke()) {
						case g ? 39:
							37: ;
						case 9:
							if (!(g = CKEDITOR.document.getById(c + (b + 1)))) {
								g = CKEDITOR.document.getById(c + "0");
							}
							g.focus();
							return false;
						case g ? 37:
							39: ;
						case CKEDITOR.SHIFT + 9:
							if (!(g = CKEDITOR.document.getById(c + (b - 1)))) {
								g = CKEDITOR.document.getById(c + (n.list.length - 1));
							}
							g.focus();
							return false;
						case 27:
							a.focus();
							return false;
						case 13:
							;
						case 32:
							f$$0(b);
							return false;
					}
					return true;
				});
				a.on("selectionChange", function() {
					a.editable();
					var b = [];
					var g = n.list = [];
					var h = [];
					var f = n.filters;
					var i = true;
					var s = a.elementPath().elements;
					var v;
					var z = s.length;
					for (; z--;) {
						var u = s[z];
						var x = 0;
						v = u.data("cke-display-name") ? u.data("cke-display-name") : u.data("cke-real-element-type") ? u.data("cke-real-element-type") : u.getName();
						i = u.hasAttribute("contenteditable") ? u.getAttribute("contenteditable") == "true" : i;
						if (!i) {
							if (!u.hasAttribute("contenteditable")) {
								x = 1;
							}
						}
						var B = 0;
						for (; B < f.length; B++) {
							var H = f[B](u, v);
							if (H === false) {
								x = 1;
								break;
							}
							v = H || v;
						}
						if (!x) {
							g.unshift(u);
							h.unshift(v);
						}
					}
					g = g.length;
					f = 0;
					for (; f < g; f++) {
						v = h[f];
						i = a.lang.elementspath.eleTitle.replace(/%1/, v);
						v = d$$0.output({
							id: m + f,
							label: i,
							text: v,
							jsTitle: "javascript:void('" + v + "')",
							index: f,
							keyDownFn: o,
							clickFn: q
						});
						b.unshift(v);
					}
					if (!k) {
						k = CKEDITOR.document.getById(j);
					}
					h = k;
					h.setHtml(b.join("") + c$$0);
					a.fire("elementsPathUpdate", {
						space: h
					});
				});
				a.on("readOnly", h$$0);
				a.on("contentDomUnload", h$$0);
				a.addCommand("elementsPathFocus", b$$0);
				a.setKeystroke(CKEDITOR.ALT + 122, "elementsPathFocus");
			}
			var b$$0;
			b$$0 = {
				editorFocus: false,
				readOnly: 1,
				exec: function(a) {
					if (a = CKEDITOR.document.getById(a._.elementsPath.idBase + "0")) {
						a.focus(CKEDITOR.env.ie || CKEDITOR.env.air);
					}
				}
			};
			var c$$0 = '<span class="cke_path_empty">&nbsp;</span>';
			var a$$0 = "";
			if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac) {
				a$$0 = a$$0 + ' onkeypress="return false;"';
			}
			if (CKEDITOR.env.gecko) {
				a$$0 = a$$0 + ' onblur="this.style.cssText = this.style.cssText;"';
			}
			var d$$0 = CKEDITOR.addTemplate("pathItem", '<a id="{id}" href="{jsTitle}" tabindex="-1" class="cke_path_item" title="{label}"' + (CKEDITOR.env.gecko && CKEDITOR.env.version < 10900 ? ' onfocus="event.preventBubble();"' : "") + a$$0 + ' hidefocus="true"  onkeydown="return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick="CKEDITOR.tools.callFunction({clickFn},{index}); return false;" role="button" aria-label="{label}">{text}</a>');
			CKEDITOR.plugins.add("elementspath", {
				init: function(a) {
					a._.elementsPath = {
						idBase: "cke_elementspath_" + CKEDITOR.tools.getNextNumber() + "_",
						filters: []
					};
					a.on("uiSpace", function(b) {
						if (b.data.space == "bottom") {
							f$$1(a, b.data);
						}
					});
				}
			});
		})();
		(function() {
			function b$$1(a, b, d) {
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
						e$$0(a, b, null, d);
					} else {
						g$$0(a, b, null, d);
					}
					a.fire("saveSnapshot");
				}
			}

			function f(a) {
				a = a.getSelection().getRanges(true);
				var b = a.length - 1;
				for (; b > 0; b--) {
					a[b].deleteContents();
				}
				return a[0];
			}
			CKEDITOR.plugins.add("enterkey", {
				init: function(a$$0) {
					a$$0.addCommand("enter", {
						modes: {
							wysiwyg: 1
						},
						editorFocus: false,
						exec: function(a) {
							b$$1(a);
						}
					});
					a$$0.addCommand("shiftEnter", {
						modes: {
							wysiwyg: 1
						},
						editorFocus: false,
						exec: function(a) {
							b$$1(a, a.activeShiftEnterMode, 1);
						}
					});
					a$$0.setKeystroke([
						[13, "enter"],
						[CKEDITOR.SHIFT + 13, "shiftEnter"]
					]);
				}
			});
			var c$$0 = CKEDITOR.dom.walker.whitespaces();
			var a$$1 = CKEDITOR.dom.walker.bookmark();
			CKEDITOR.plugins.enterkey = {
				enterBlock: function(b$$0, d, g, n) {
					if (g = g || f(b$$0)) {
						var m = g.document;
						var q = g.checkStartOfBlock();
						var o = g.checkEndOfBlock();
						var l = b$$0.elementPath(g.startContainer).block;
						var r = d == CKEDITOR.ENTER_DIV ? "div" : "p";
						var p;
						if (q && o) {
							if (l && (l.is("li") || l.getParent().is("li"))) {
								g = l.getParent();
								p = g.getParent();
								n = !l.hasPrevious();
								var t = !l.hasNext();
								r = b$$0.getSelection();
								var w = r.createBookmarks();
								q = l.getDirection(1);
								o = l.getAttribute("class");
								var s = l.getAttribute("style");
								var v = p.getDirection(1) != q;
								b$$0 = b$$0.enterMode != CKEDITOR.ENTER_BR || (v || (s || o));
								if (p.is("li")) {
									if (n || t) {
										l[n ? "insertBefore" : "insertAfter"](p);
									} else {
										l.breakParent(p);
									}
								} else {
									if (b$$0) {
										p = m.createElement(d == CKEDITOR.ENTER_P ? "p" : "div");
										if (v) {
											p.setAttribute("dir", q);
										}
										if (s) {
											p.setAttribute("style", s);
										}
										if (o) {
											p.setAttribute("class", o);
										}
										l.moveChildren(p);
										if (n || t) {
											p[n ? "insertBefore" : "insertAfter"](g);
										} else {
											l.breakParent(g);
											p.insertAfter(g);
										}
									} else {
										l.appendBogus(true);
										if (n || t) {
											for (; m = l[n ? "getFirst" : "getLast"]();) {
												m[n ? "insertBefore" : "insertAfter"](g);
											}
										} else {
											l.breakParent(g);
											for (; m = l.getLast();) {
												m.insertAfter(g);
											}
										}
									}
									l.remove();
								}
								r.selectBookmarks(w);
								return;
							}
							if (l && l.getParent().is("blockquote")) {
								l.breakParent(l.getParent());
								if (!l.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1))) {
									l.getPrevious().remove();
								}
								if (!l.getNext().getFirst(CKEDITOR.dom.walker.invisible(1))) {
									l.getNext().remove();
								}
								g.moveToElementEditStart(l);
								g.select();
								return;
							}
						} else {
							if (l && (l.is("pre") && !o)) {
								e$$0(b$$0, d, g, n);
								return;
							}
						}
						if (o = g.splitBlock(r)) {
							d = o.previousBlock;
							l = o.nextBlock;
							b$$0 = o.wasStartOfBlock;
							q = o.wasEndOfBlock;
							if (l) {
								w = l.getParent();
								if (w.is("li")) {
									l.breakParent(w);
									l.move(l.getNext(), 1);
								}
							} else {
								if (d && ((w = d.getParent()) && w.is("li"))) {
									d.breakParent(w);
									w = d.getNext();
									g.moveToElementEditStart(w);
									d.move(d.getPrevious());
								}
							}
							if (!b$$0 && !q) {
								if (l.is("li")) {
									p = g.clone();
									p.selectNodeContents(l);
									p = new CKEDITOR.dom.walker(p);
									p.evaluator = function(b) {
										return !(a$$1(b) || (c$$0(b) || b.type == CKEDITOR.NODE_ELEMENT && (b.getName() in CKEDITOR.dtd.$inline && !(b.getName() in CKEDITOR.dtd.$empty))));
									};
									if (w = p.next()) {
										if (w.type == CKEDITOR.NODE_ELEMENT && w.is("ul", "ol")) {
											(CKEDITOR.env.needsBrFiller ? m.createElement("br") : m.createText(" ")).insertBefore(w);
										}
									}
								}
								if (l) {
									g.moveToElementEditStart(l);
								}
							} else {
								if (d) {
									if (d.is("li") || !i.test(d.getName()) && !d.is("pre")) {
										p = d.clone();
									}
								} else {
									if (l) {
										p = l.clone();
									}
								}
								if (p) {
									if (n) {
										if (!p.is("li")) {
											p.renameNode(r);
										}
									}
								} else {
									if (w && w.is("li")) {
										p = w;
									} else {
										p = m.createElement(r);
										if (d) {
											if (t = d.getDirection()) {
												p.setAttribute("dir", t);
											}
										}
									}
								}
								if (m = o.elementPath) {
									n = 0;
									r = m.elements.length;
									for (; n < r; n++) {
										w = m.elements[n];
										if (w.equals(m.block) || w.equals(m.blockLimit)) {
											break;
										}
										if (CKEDITOR.dtd.$removeEmpty[w.getName()]) {
											w = w.clone();
											p.moveChildren(w);
											p.append(w);
										}
									}
								}
								p.appendBogus();
								if (!p.getParent()) {
									g.insertNode(p);
								}
								if (p.is("li")) {
									p.removeAttribute("value");
								}
								if (CKEDITOR.env.ie && (b$$0 && (!q || !d.getChildCount()))) {
									g.moveToElementEditStart(q ? d : p);
									g.select();
								}
								g.moveToElementEditStart(b$$0 && !q ? l : p);
							}
							g.select();
							g.scrollIntoView();
						}
					}
				},
				enterBr: function(a, b, d, c) {
					if (d = d || f(a)) {
						var e = d.document;
						var q = d.checkEndOfBlock();
						var o = new CKEDITOR.dom.elementPath(a.getSelection().getStartElement());
						var l = o.block;
						o = l && o.block.getName();
						if (!c && o == "li") {
							g$$0(a, b, d, c);
						} else {
							if (!c && (q && i.test(o))) {
								if (q = l.getDirection()) {
									e = e.createElement("div");
									e.setAttribute("dir", q);
									e.insertAfter(l);
									d.setStart(e, 0);
								} else {
									e.createElement("br").insertAfter(l);
									if (CKEDITOR.env.gecko) {
										e.createText("").insertAfter(l);
									}
									d.setStartAt(l.getNext(), CKEDITOR.env.ie ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_START);
								}
							} else {
								l = o == "pre" && (CKEDITOR.env.ie && CKEDITOR.env.version < 8) ? e.createText("\r") : e.createElement("br");
								d.deleteContents();
								d.insertNode(l);
								if (CKEDITOR.env.needsBrFiller) {
									e.createText("\ufeff").insertAfter(l);
									if (q) {
										l.getParent().appendBogus();
									}
									l.getNext().$.nodeValue = "";
									d.setStartAt(l.getNext(), CKEDITOR.POSITION_AFTER_START);
								} else {
									d.setStartAt(l, CKEDITOR.POSITION_AFTER_END);
								}
							}
							d.collapse(true);
							d.select();
							d.scrollIntoView();
						}
					}
				}
			};
			var d$$0 = CKEDITOR.plugins.enterkey;
			var e$$0 = d$$0.enterBr;
			var g$$0 = d$$0.enterBlock;
			var i = /^h[1-6]$/;
		})();
		(function() {
			function b$$1(b$$0, c) {
				var a = {};
				var d = [];
				var e = {
					nbsp: " ",
					shy: "\u00ad",
					gt: ">",
					lt: "<",
					amp: "&",
					apos: "'",
					quot: '"'
				};
				b$$0 = b$$0.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g, function(b, g) {
					var h = c ? "&" + g + ";" : e[g];
					a[h] = c ? e[g] : "&" + g + ";";
					d.push(h);
					return "";
				});
				if (!c && b$$0) {
					b$$0 = b$$0.split(",");
					var g$$0 = document.createElement("div");
					var i;
					g$$0.innerHTML = "&" + b$$0.join(";&") + ";";
					i = g$$0.innerHTML;
					g$$0 = null;
					g$$0 = 0;
					for (; g$$0 < i.length; g$$0++) {
						var h$$0 = i.charAt(g$$0);
						a[h$$0] = "&" + b$$0[g$$0] + ";";
						d.push(h$$0);
					}
				}
				a.regex = d.join(c ? "|" : "");
				return a;
			}
			CKEDITOR.plugins.add("entities", {
				afterInit: function(f) {
					var c = f.config;
					if (f = (f = f.dataProcessor) && f.htmlFilter) {
						var a$$0 = [];
						if (c.basicEntities !== false) {
							a$$0.push("nbsp,gt,lt,amp");
						}
						if (c.entities) {
							if (a$$0.length) {
								a$$0.push("quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro");
							}
							if (c.entities_latin) {
								a$$0.push("Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml");
							}
							if (c.entities_greek) {
								a$$0.push("Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv");
							}
							if (c.entities_additional) {
								a$$0.push(c.entities_additional);
							}
						}
						var d = b$$1(a$$0.join(","));
						var e = d.regex ? "[" + d.regex + "]" : "a^";
						delete d.regex;
						if (c.entities) {
							if (c.entities_processNumerical) {
								e = "[^ -~]|" + e;
							}
						}
						e = RegExp(e, "g");
						var g = function(a) {
							return c.entities_processNumerical == "force" || !d[a] ? "&#" + a.charCodeAt(0) + ";" : d[a];
						};
						var i = b$$1("nbsp,gt,lt,amp,shy", true);
						var h = RegExp(i.regex, "g");
						var j = function(a) {
							return i[a];
						};
						f.addRules({
							text: function(a) {
								return a.replace(h, j).replace(e, g);
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
			popup: function(b, f, c, a) {
				f = f || "80%";
				c = c || "70%";
				if (typeof f == "string") {
					if (f.length > 1 && f.substr(f.length - 1, 1) == "%") {
						f = parseInt(window.screen.width * parseInt(f, 10) / 100, 10);
					}
				}
				if (typeof c == "string") {
					if (c.length > 1 && c.substr(c.length - 1, 1) == "%") {
						c = parseInt(window.screen.height * parseInt(c, 10) / 100, 10);
					}
				}
				if (f < 640) {
					f = 640;
				}
				if (c < 420) {
					c = 420;
				}
				var d = parseInt((window.screen.height - c) / 2, 10);
				var e = parseInt((window.screen.width - f) / 2, 10);
				a = (a || "location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes") + ",width=" + f + ",height=" + c + ",top=" + d + ",left=" + e;
				var g = window.open("", null, a, true);
				if (!g) {
					return false;
				}
				try {
					if (navigator.userAgent.toLowerCase().indexOf(" chrome/") == -1) {
						g.moveTo(e, d);
						g.resizeTo(f, c);
					}
					g.focus();
					g.location.href = b;
				} catch (i) {
					window.open(b, null, a, true);
				}
				return true;
			}
		});
		(function() {
			function b$$1(a, b) {
				var d = [];
				if (b) {
					var c;
					for (c in b) {
						d.push(c + "=" + encodeURIComponent(b[c]));
					}
				} else {
					return a;
				}
				return a + (a.indexOf("?") != -1 ? "&" : "?") + d.join("&");
			}

			function f(a) {
				a = a + "";
				return a.charAt(0).toUpperCase() + a.substr(1);
			}

			function c$$0() {
				var a = this.getDialog();
				var d = a.getParentEditor();
				d._.filebrowserSe = this;
				var c = d.config["filebrowser" + f(a.getName()) + "WindowWidth"] || (d.config.filebrowserWindowWidth || "80%");
				a = d.config["filebrowser" + f(a.getName()) + "WindowHeight"] || (d.config.filebrowserWindowHeight || "70%");
				var e = this.filebrowser.params || {};
				e.CKEditor = d.name;
				e.CKEditorFuncNum = d._.filebrowserFn;
				if (!e.langCode) {
					e.langCode = d.langCode;
				}
				e = b$$1(this.filebrowser.url, e);
				d.popup(e, c, a, d.config.filebrowserWindowFeatures || d.config.fileBrowserWindowFeatures);
			}

			function a$$0() {
				var a = this.getDialog();
				a.getParentEditor()._.filebrowserSe = this;
				return !a.getContentElement(this["for"][0], this["for"][1]).getInputElement().$.value || !a.getContentElement(this["for"][0], this["for"][1]).getAction() ? false : true;
			}

			function d$$0(a, d, c) {
				var e = c.params || {};
				e.CKEditor = a.name;
				e.CKEditorFuncNum = a._.filebrowserFn;
				if (!e.langCode) {
					e.langCode = a.langCode;
				}
				d.action = b$$1(c.url, e);
				d.filebrowser = c;
			}

			function e$$0(b$$0, g, i, n) {
				if (n && n.length) {
					var m;
					var q = n.length;
					for (; q--;) {
						m = n[q];
						if (m.type == "hbox" || (m.type == "vbox" || m.type == "fieldset")) {
							e$$0(b$$0, g, i, m.children);
						}
						if (m.filebrowser) {
							if (typeof m.filebrowser == "string") {
								m.filebrowser = {
									action: m.type == "fileButton" ? "QuickUpload" : "Browse",
									target: m.filebrowser
								};
							}
							if (m.filebrowser.action == "Browse") {
								var o = m.filebrowser.url;
								if (o === void 0) {
									o = b$$0.config["filebrowser" + f(g) + "BrowseUrl"];
									if (o === void 0) {
										o = b$$0.config.filebrowserBrowseUrl;
									}
								}
								if (o) {
									m.onClick = c$$0;
									m.filebrowser.url = o;
									m.hidden = false;
								}
							} else {
								if (m.filebrowser.action == "QuickUpload" && m["for"]) {
									o = m.filebrowser.url;
									if (o === void 0) {
										o = b$$0.config["filebrowser" + f(g) + "UploadUrl"];
										if (o === void 0) {
											o = b$$0.config.filebrowserUploadUrl;
										}
									}
									if (o) {
										var l = m.onClick;
										m.onClick = function(b) {
											var d = b.sender;
											return l && l.call(d, b) === false ? false : a$$0.call(d, b);
										};
										m.filebrowser.url = o;
										m.hidden = false;
										d$$0(b$$0, i.getContents(m["for"][0]).get(m["for"][1]), m.filebrowser);
									}
								}
							}
						}
					}
				}
			}

			function g$$0(a, b, d) {
				if (d.indexOf(";") !== -1) {
					d = d.split(";");
					var c = 0;
					for (; c < d.length; c++) {
						if (g$$0(a, b, d[c])) {
							return true;
						}
					}
					return false;
				}
				return (a = a.getContents(b).get(d).filebrowser) && a.url;
			}

			function i$$0(a, b) {
				var d = this._.filebrowserSe.getDialog();
				var c = this._.filebrowserSe["for"];
				var e = this._.filebrowserSe.filebrowser.onSelect;
				if (c) {
					d.getContentElement(c[0], c[1]).reset();
				}
				if (!(typeof b == "function" && b.call(this._.filebrowserSe) === false) && !(e && e.call(this._.filebrowserSe, a, b) === false)) {
					if (typeof b == "string") {
						if (b) {
							alert(b);
						}
					}
					if (a) {
						c = this._.filebrowserSe;
						d = c.getDialog();
						if (c = c.filebrowser.target || null) {
							c = c.split(":");
							if (e = d.getContentElement(c[0], c[1])) {
								e.setValue(a);
								d.selectPage(c[0]);
							}
						}
					}
				}
			}
			CKEDITOR.plugins.add("filebrowser", {
				requires: "popup",
				init: function(a) {
					a._.filebrowserFn = CKEDITOR.tools.addFunction(i$$0, a);
					a.on("destroy", function() {
						CKEDITOR.tools.removeFunction(this._.filebrowserFn);
					});
				}
			});
			CKEDITOR.on("dialogDefinition", function(a) {
				if (a.editor.plugins.filebrowser) {
					var b = a.data.definition;
					var d;
					var c = 0;
					for (; c < b.contents.length; ++c) {
						if (d = b.contents[c]) {
							e$$0(a.editor, a.data.name, b, d.elements);
							if (d.hidden && d.filebrowser) {
								d.hidden = !g$$0(b, d.id, d.filebrowser);
							}
						}
					}
				}
			});
		})();
		(function() {
			function b$$1(b$$0) {
				var e$$0 = b$$0.config;
				var g$$1 = b$$0.fire("uiSpace", {
					space: "top",
					html: ""
				}).html;
				var i = function() {
					function g$$0(b, d, c) {
						h.setStyle(d, a$$0(c));
						h.setStyle("position", b);
					}

					function f(a) {
						var b = k.getDocumentPosition();
						switch (a) {
							case "top":
								g$$0("absolute", "top", b.y - t - v);
								break;
							case "pin":
								g$$0("fixed", "top", u);
								break;
							case "bottom":
								g$$0("absolute", "top", b.y + (r.height || r.bottom - r.top) + v);
						}
						j = a;
					}
					var j;
					var k;
					var l;
					var r;
					var p;
					var t;
					var w;
					var s = e$$0.floatSpaceDockedOffsetX || 0;
					var v = e$$0.floatSpaceDockedOffsetY || 0;
					var z = e$$0.floatSpacePinnedOffsetX || 0;
					var u = e$$0.floatSpacePinnedOffsetY || 0;
					return function(e) {
						if (k = b$$0.editable()) {
							if (e) {
								if (e.name == "focus") {
									h.show();
								}
							}
							h.removeStyle("left");
							h.removeStyle("right");
							l = h.getClientRect();
							r = k.getClientRect();
							p = c$$0.getViewPaneSize();
							t = l.height;
							w = "pageXOffset" in c$$0.$ ? c$$0.$.pageXOffset : CKEDITOR.document.$.documentElement.scrollLeft;
							if (j) {
								if (t + v <= r.top) {
									f("top");
								} else {
									if (t + v > p.height - r.bottom) {
										f("pin");
									} else {
										f("bottom");
									}
								}
								e = p.width / 2;
								e = r.left > 0 && (r.right < p.width && r.width > l.width) ? b$$0.config.contentsLangDirection == "rtl" ? "right" : "left" : e - r.left > r.right - e ? "left" : "right";
								var g;
								if (l.width > p.width) {
									e = "left";
									g = 0;
								} else {
									g = e == "left" ? r.left > 0 ? r.left : 0 : r.right < p.width ? p.width - r.right : 0;
									if (g + l.width > p.width) {
										e = e == "left" ? "right" : "left";
										g = 0;
									}
								}
								h.setStyle(e, a$$0((j == "pin" ? z : s) + g + (j == "pin" ? 0 : e == "left" ? w : -w)));
							} else {
								j = "pin";
								f("pin");
								i(e);
							}
						}
					};
				}();
				if (g$$1) {
					var h = CKEDITOR.document.getBody().append(CKEDITOR.dom.element.createFromHtml(f$$0.output({
						content: g$$1,
						id: b$$0.id,
						langDir: b$$0.lang.dir,
						langCode: b$$0.langCode,
						name: b$$0.name,
						style: "display:none;z-index:" + (e$$0.baseFloatZIndex - 1),
						topId: b$$0.ui.spaceId("top"),
						voiceLabel: b$$0.lang.editorPanel + ", " + b$$0.name
					})));
					var j$$0 = CKEDITOR.tools.eventsBuffer(500, i);
					var k$$0 = CKEDITOR.tools.eventsBuffer(100, i);
					h.unselectable();
					h.on("mousedown", function(a) {
						a = a.data;
						if (!a.getTarget().hasAscendant("a", 1)) {
							a.preventDefault();
						}
					});
					b$$0.on("focus", function(a) {
						i(a);
						b$$0.on("change", j$$0.input);
						c$$0.on("scroll", k$$0.input);
						c$$0.on("resize", k$$0.input);
					});
					b$$0.on("blur", function() {
						h.hide();
						b$$0.removeListener("change", j$$0.input);
						c$$0.removeListener("scroll", k$$0.input);
						c$$0.removeListener("resize", k$$0.input);
					});
					b$$0.on("destroy", function() {
						c$$0.removeListener("scroll", k$$0.input);
						c$$0.removeListener("resize", k$$0.input);
						h.clearCustomData();
						h.remove();
					});
					if (b$$0.focusManager.hasFocus) {
						h.show();
					}
					b$$0.focusManager.add(h, 1);
				}
			}
			var f$$0 = CKEDITOR.addTemplate("floatcontainer", '<div id="cke_{name}" class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '" dir="{langDir}" title="' + (CKEDITOR.env.gecko ? " " : "") + '" lang="{langCode}" role="application" style="{style}" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><div class="cke_inner"><div id="{topId}" class="cke_top" role="presentation">{content}</div></div></div>');
			var c$$0 = CKEDITOR.document.getWindow();
			var a$$0 = CKEDITOR.tools.cssLength;
			CKEDITOR.plugins.add("floatingspace", {
				init: function(a) {
					a.on("loaded", function() {
						b$$1(this);
					}, null, null, 20);
				}
			});
		})();
		CKEDITOR.plugins.add("htmlwriter", {
			init: function(b) {
				var f = new CKEDITOR.htmlWriter;
				f.forceSimpleAmpersand = b.config.forceSimpleAmpersand;
				f.indentationChars = b.config.dataIndentationChars || "\t";
				b.dataProcessor.writer = f;
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
				var b = CKEDITOR.dtd;
				var f;
				for (f in CKEDITOR.tools.extend({}, b.$nonBodyContent, b.$block, b.$listItem, b.$tableContent)) {
					this.setRules(f, {
						indent: !b[f]["#"],
						breakBeforeOpen: 1,
						breakBeforeClose: !b[f]["#"],
						breakAfterClose: 1,
						needsSpace: f in b.$block && !(f in {
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
				openTag: function(b) {
					var f = this._.rules[b];
					if (this._.afterCloser) {
						if (f && (f.needsSpace && this._.needsSpace)) {
							this._.output.push("\n");
						}
					}
					if (this._.indent) {
						this.indentation();
					} else {
						if (f && f.breakBeforeOpen) {
							this.lineBreak();
							this.indentation();
						}
					}
					this._.output.push("<", b);
					this._.afterCloser = 0;
				},
				openTagClose: function(b, f) {
					var c = this._.rules[b];
					if (f) {
						this._.output.push(this.selfClosingEnd);
						if (c && c.breakAfterClose) {
							this._.needsSpace = c.needsSpace;
						}
					} else {
						this._.output.push(">");
						if (c && c.indent) {
							this._.indentation = this._.indentation + this.indentationChars;
						}
					}
					if (c) {
						if (c.breakAfterOpen) {
							this.lineBreak();
						}
					}
					if (b == "pre") {
						this._.inPre = 1;
					}
				},
				attribute: function(b, f) {
					if (typeof f == "string") {
						if (this.forceSimpleAmpersand) {
							f = f.replace(/&amp;/g, "&");
						}
						f = CKEDITOR.tools.htmlEncodeAttr(f);
					}
					this._.output.push(" ", b, '="', f, '"');
				},
				closeTag: function(b) {
					var f = this._.rules[b];
					if (f && f.indent) {
						this._.indentation = this._.indentation.substr(this.indentationChars.length);
					}
					if (this._.indent) {
						this.indentation();
					} else {
						if (f && f.breakBeforeClose) {
							this.lineBreak();
							this.indentation();
						}
					}
					this._.output.push("</", b, ">");
					if (b == "pre") {
						this._.inPre = 0;
					}
					if (f && f.breakAfterClose) {
						this.lineBreak();
						this._.needsSpace = f.needsSpace;
					}
					this._.afterCloser = 1;
				},
				text: function(b) {
					if (this._.indent) {
						this.indentation();
						if (!this._.inPre) {
							b = CKEDITOR.tools.ltrim(b);
						}
					}
					this._.output.push(b);
				},
				comment: function(b) {
					if (this._.indent) {
						this.indentation();
					}
					this._.output.push("\x3c!--", b, "--\x3e");
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
				setRules: function(b, f) {
					var c = this._.rules[b];
					if (c) {
						CKEDITOR.tools.extend(c, f, true);
					} else {
						this._.rules[b] = f;
					}
				}
			}
		});
		(function() {
			function b$$0(b, a) {
				if (!a) {
					a = b.getSelection().getSelectedElement();
				}
				if (a && (a.is("img") && (!a.data("cke-realelement") && !a.isReadOnly()))) {
					return a;
				}
			}

			function f(b) {
				var a = b.getStyle("float");
				if (a == "inherit" || a == "none") {
					a = 0;
				}
				if (!a) {
					a = b.getAttribute("align");
				}
				return a;
			}
			CKEDITOR.plugins.add("image", {
				requires: "dialog",
				init: function(c) {
					if (!c.plugins.image2) {
						CKEDITOR.dialog.add("image", this.path + "dialogs/image.js");
						var a$$0 = "img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}";
						if (CKEDITOR.dialog.isTabEnabled(c, "image", "advanced")) {
							a$$0 = "img[alt,dir,id,lang,longdesc,!src,title]{*}(*)";
						}
						c.addCommand("image", new CKEDITOR.dialogCommand("image", {
							allowedContent: a$$0,
							requiredContent: "img[alt,src]",
							contentTransformations: [
								["img{width}: sizeToStyle", "img[width]: sizeToAttribute"],
								["img{float}: alignmentToStyle", "img[align]: alignmentToAttribute"]
							]
						}));
						if (c.ui.addButton) {
							c.ui.addButton("Image", {
								label: c.lang.common.image,
								command: "image",
								toolbar: "insert,10"
							});
						}
						c.on("doubleclick", function(a) {
							var b = a.data.element;
							if (b.is("img") && (!b.data("cke-realelement") && !b.isReadOnly())) {
								a.data.dialog = "image";
							}
						});
						if (c.addMenuItems) {
							c.addMenuItems({
								image: {
									label: c.lang.image.menu,
									command: "image",
									group: "image"
								}
							});
						}
						if (c.contextMenu) {
							c.contextMenu.addListener(function(a) {
								if (b$$0(c, a)) {
									return {
										image: CKEDITOR.TRISTATE_OFF
									};
								}
							});
						}
					}
				},
				afterInit: function(c) {
					function a$$0(a) {
						var e$$0 = c.getCommand("justify" + a);
						if (e$$0) {
							if (a == "left" || a == "right") {
								e$$0.on("exec", function(e) {
									var i = b$$0(c);
									var h;
									if (i) {
										h = f(i);
										if (h == a) {
											i.removeStyle("float");
											if (a == f(i)) {
												i.removeAttribute("align");
											}
										} else {
											i.setStyle("float", a);
										}
										e.cancel();
									}
								});
							}
							e$$0.on("refresh", function(e) {
								var i = b$$0(c);
								if (i) {
									i = f(i);
									this.setState(i == a ? CKEDITOR.TRISTATE_ON : a == "right" || a == "left" ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
									e.cancel();
								}
							});
						}
					}
					if (!c.plugins.image2) {
						a$$0("left");
						a$$0("right");
						a$$0("center");
						a$$0("block");
					}
				}
			});
		})();
		CKEDITOR.config.image_removeLinkByEmptyURL = true;
		(function() {
			function b$$0(a, b) {
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

			function f$$0(a, b, c) {
				this.editor = a;
				this.name = b;
				this.value = c;
				this.context = "p";
				b = a.config.justifyClasses;
				var g = a.config.enterMode == CKEDITOR.ENTER_P ? "p" : "div";
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
					this.requiredContent = g + "(" + this.cssClassName + ")";
				} else {
					this.requiredContent = g + "{text-align}";
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

			function c$$0(a) {
				var b = a.editor;
				var c = b.createRange();
				c.setStartBefore(a.data.node);
				c.setEndAfter(a.data.node);
				var g = new CKEDITOR.dom.walker(c);
				var f;
				for (; f = g.next();) {
					if (f.type == CKEDITOR.NODE_ELEMENT) {
						if (!f.equals(a.data.node) && f.getDirection()) {
							c.setStartAfter(f);
							g = new CKEDITOR.dom.walker(c);
						} else {
							var h = b.config.justifyClasses;
							if (h) {
								if (f.hasClass(h[0])) {
									f.removeClass(h[0]);
									f.addClass(h[2]);
								} else {
									if (f.hasClass(h[2])) {
										f.removeClass(h[2]);
										f.addClass(h[0]);
									}
								}
							}
							h = f.getStyle("text-align");
							if (h == "left") {
								f.setStyle("text-align", "right");
							} else {
								if (h == "right") {
									f.setStyle("text-align", "left");
								}
							}
						}
					}
				}
			}
			f$$0.prototype = {
				exec: function(a) {
					var d = a.getSelection();
					var c = a.config.enterMode;
					if (d) {
						var g = d.createBookmarks();
						var f = d.getRanges();
						var h = this.cssClassName;
						var j;
						var k;
						var n = a.config.useComputedState;
						n = n === void 0 || n;
						var m = f.length - 1;
						for (; m >= 0; m--) {
							j = f[m].createIterator();
							j.enlargeBr = c != CKEDITOR.ENTER_BR;
							for (; k = j.getNextParagraph(c == CKEDITOR.ENTER_P ? "p" : "div");) {
								if (!k.isReadOnly()) {
									k.removeAttribute("align");
									k.removeStyle("text-align");
									var q = h && (k.$.className = CKEDITOR.tools.ltrim(k.$.className.replace(this.cssClassRegex, "")));
									var o = this.state == CKEDITOR.TRISTATE_OFF && (!n || b$$0(k, true) != this.value);
									if (h) {
										if (o) {
											k.addClass(h);
										} else {
											if (!q) {
												k.removeAttribute("class");
											}
										}
									} else {
										if (o) {
											k.setStyle("text-align", this.value);
										}
									}
								}
							}
						}
						a.focus();
						a.forceNextSelectionCheck();
						d.selectBookmarks(g);
					}
				},
				refresh: function(a, d) {
					var c = d.block || d.blockLimit;
					this.setState(c.getName() != "body" && b$$0(c, this.editor.config.useComputedState) == this.value ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
				}
			};
			CKEDITOR.plugins.add("justify", {
				init: function(a) {
					if (!a.blockless) {
						var b = new f$$0(a, "justifyleft", "left");
						var e = new f$$0(a, "justifycenter", "center");
						var g = new f$$0(a, "justifyright", "right");
						var i = new f$$0(a, "justifyblock", "justify");
						a.addCommand("justifyleft", b);
						a.addCommand("justifycenter", e);
						a.addCommand("justifyright", g);
						a.addCommand("justifyblock", i);
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
						a.on("dirChanged", c$$0);
					}
				}
			});
		})();
		(function() {
			function b$$0(b, d) {
				var c = a$$0.exec(b);
				var e = a$$0.exec(d);
				if (c) {
					if (!c[2] && e[2] == "px") {
						return e[1];
					}
					if (c[2] == "px" && !e[2]) {
						return e[1] + "px";
					}
				}
				return d;
			}
			var f = CKEDITOR.htmlParser.cssStyle;
			var c$$0 = CKEDITOR.tools.cssLength;
			var a$$0 = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i;
			var d$$0 = {
				elements: {
					$: function(a) {
						var d = a.attributes;
						if ((d = (d = (d = d && d["data-cke-realelement"]) && new CKEDITOR.htmlParser.fragment.fromHtml(decodeURIComponent(d))) && d.children[0]) && a.attributes["data-cke-resizable"]) {
							var c = (new f(a)).rules;
							a = d.attributes;
							var e = c.width;
							c = c.height;
							if (e) {
								a.width = b$$0(a.width, e);
							}
							if (c) {
								a.height = b$$0(a.height, c);
							}
						}
						return d;
					}
				}
			};
			var e$$0 = CKEDITOR.plugins.add("fakeobjects", {
				init: function(a) {
					a.filter.allow("img[!data-cke-realelement,src,alt,title](*){*}", "fakeobjects");
				},
				afterInit: function(a) {
					if (a = (a = a.dataProcessor) && a.htmlFilter) {
						a.addRules(d$$0);
					}
				}
			});
			CKEDITOR.editor.prototype.createFakeElement = function(a, b, d, j) {
				var k = this.lang.fakeobjects;
				k = k[d] || k.unknown;
				b = {
					"class": b,
					"data-cke-realelement": encodeURIComponent(a.getOuterHtml()),
					"data-cke-real-node-type": a.type,
					alt: k,
					title: k,
					align: a.getAttribute("align") || ""
				};
				if (!CKEDITOR.env.hc) {
					b.src = CKEDITOR.getUrl(e$$0.path + "images/spacer.gif");
				}
				if (d) {
					b["data-cke-real-element-type"] = d;
				}
				if (j) {
					b["data-cke-resizable"] = j;
					d = new f;
					j = a.getAttribute("width");
					a = a.getAttribute("height");
					if (j) {
						d.rules.width = c$$0(j);
					}
					if (a) {
						d.rules.height = c$$0(a);
					}
					d.populate(b);
				}
				return this.document.createElement("img", {
					attributes: b
				});
			};
			CKEDITOR.editor.prototype.createFakeParserElement = function(a, b, d, j) {
				var k = this.lang.fakeobjects;
				k = k[d] || k.unknown;
				var n;
				n = new CKEDITOR.htmlParser.basicWriter;
				a.writeHtml(n);
				n = n.getHtml();
				b = {
					"class": b,
					"data-cke-realelement": encodeURIComponent(n),
					"data-cke-real-node-type": a.type,
					alt: k,
					title: k,
					align: a.attributes.align || ""
				};
				if (!CKEDITOR.env.hc) {
					b.src = CKEDITOR.getUrl(e$$0.path + "images/spacer.gif");
				}
				if (d) {
					b["data-cke-real-element-type"] = d;
				}
				if (j) {
					b["data-cke-resizable"] = j;
					j = a.attributes;
					a = new f;
					d = j.width;
					j = j.height;
					if (d != void 0) {
						a.rules.width = c$$0(d);
					}
					if (j != void 0) {
						a.rules.height = c$$0(j);
					}
					a.populate(b);
				}
				return new CKEDITOR.htmlParser.element("img", b);
			};
			CKEDITOR.editor.prototype.restoreRealElement = function(a) {
				if (a.data("cke-real-node-type") != CKEDITOR.NODE_ELEMENT) {
					return null;
				}
				var d = CKEDITOR.dom.element.createFromHtml(decodeURIComponent(a.data("cke-realelement")), this.document);
				if (a.data("cke-resizable")) {
					var c = a.getStyle("width");
					a = a.getStyle("height");
					if (c) {
						d.setAttribute("width", b$$0(d.getAttribute("width"), c));
					}
					if (a) {
						d.setAttribute("height", b$$0(d.getAttribute("height"), a));
					}
				}
				return d;
			};
		})();
		CKEDITOR.plugins.add("link", {
			requires: "dialog,fakeobjects",
			onLoad: function() {
				function b(a) {
					return c.replace(/%1/g, a == "rtl" ? "right" : "left").replace(/%2/g, "cke_contents_" + a);
				}
				var f = "background:url(" + CKEDITOR.getUrl(this.path + "images" + (CKEDITOR.env.hidpi ? "/hidpi" : "") + "/anchor.png") + ") no-repeat %1 center;border:1px dotted #00f;background-size:16px;";
				var c = ".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{" + f + "padding-%1:18px;cursor:auto;}" + (CKEDITOR.plugins.link.synAnchorSelector ? "a.cke_anchor_empty{display:inline-block;" + (CKEDITOR.env.ie && CKEDITOR.env.version > 10 ? "min-height:16px;vertical-align:middle" : "") + "}" : "") + ".%2 img.cke_anchor{" + f + "width:16px;min-height:15px;height:1.15em;vertical-align:" + (CKEDITOR.env.opera ? "middle" : "text-bottom") + ";}";
				CKEDITOR.addCss(b("ltr") + b("rtl"));
			},
			init: function(b) {
				var f = "a[!href]";
				if (CKEDITOR.dialog.isTabEnabled(b, "link", "advanced")) {
					f = f.replace("]", ",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)");
				}
				if (CKEDITOR.dialog.isTabEnabled(b, "link", "target")) {
					f = f.replace("]", ",target,onclick]");
				}
				b.addCommand("link", new CKEDITOR.dialogCommand("link", {
					allowedContent: f,
					requiredContent: "a[href]"
				}));
				b.addCommand("anchor", new CKEDITOR.dialogCommand("anchor", {
					allowedContent: "a[!name,id]",
					requiredContent: "a[name]"
				}));
				b.addCommand("unlink", new CKEDITOR.unlinkCommand);
				b.addCommand("removeAnchor", new CKEDITOR.removeAnchorCommand);
				b.setKeystroke(CKEDITOR.CTRL + 76, "link");
				if (b.ui.addButton) {
					b.ui.addButton("Link", {
						label: b.lang.link.toolbar,
						command: "link",
						toolbar: "links,10"
					});
					b.ui.addButton("Unlink", {
						label: b.lang.link.unlink,
						command: "unlink",
						toolbar: "links,20"
					});
					b.ui.addButton("Anchor", {
						label: b.lang.link.anchor.toolbar,
						command: "anchor",
						toolbar: "links,30"
					});
				}
				CKEDITOR.dialog.add("link", this.path + "dialogs/link.js");
				CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js");
				b.on("doubleclick", function(c) {
					var a = CKEDITOR.plugins.link.getSelectedLink(b) || c.data.element;
					if (!a.isReadOnly()) {
						if (a.is("a")) {
							c.data.dialog = a.getAttribute("name") && (!a.getAttribute("href") || !a.getChildCount()) ? "anchor" : "link";
							b.getSelection().selectElement(a);
						} else {
							if (CKEDITOR.plugins.link.tryRestoreFakeAnchor(b, a)) {
								c.data.dialog = "anchor";
							}
						}
					}
				});
				if (b.addMenuItems) {
					b.addMenuItems({
						anchor: {
							label: b.lang.link.anchor.menu,
							command: "anchor",
							group: "anchor",
							order: 1
						},
						removeAnchor: {
							label: b.lang.link.anchor.remove,
							command: "removeAnchor",
							group: "anchor",
							order: 5
						},
						link: {
							label: b.lang.link.menu,
							command: "link",
							group: "link",
							order: 1
						},
						unlink: {
							label: b.lang.link.unlink,
							command: "unlink",
							group: "link",
							order: 5
						}
					});
				}
				if (b.contextMenu) {
					b.contextMenu.addListener(function(c) {
						if (!c || c.isReadOnly()) {
							return null;
						}
						c = CKEDITOR.plugins.link.tryRestoreFakeAnchor(b, c);
						if (!c && !(c = CKEDITOR.plugins.link.getSelectedLink(b))) {
							return null;
						}
						var a = {};
						if (c.getAttribute("href")) {
							if (c.getChildCount()) {
								a = {
									link: CKEDITOR.TRISTATE_OFF,
									unlink: CKEDITOR.TRISTATE_OFF
								};
							}
						}
						if (c && c.hasAttribute("name")) {
							a.anchor = a.removeAnchor = CKEDITOR.TRISTATE_OFF;
						}
						return a;
					});
				}
			},
			afterInit: function(b) {
				var f$$0 = b.dataProcessor;
				var c$$0 = f$$0 && f$$0.dataFilter;
				f$$0 = f$$0 && f$$0.htmlFilter;
				var a$$0 = b._.elementsPath && b._.elementsPath.filters;
				if (c$$0) {
					c$$0.addRules({
						elements: {
							a: function(a) {
								var c = a.attributes;
								if (!c.name) {
									return null;
								}
								var g = !a.children.length;
								if (CKEDITOR.plugins.link.synAnchorSelector) {
									a = g ? "cke_anchor_empty" : "cke_anchor";
									var f = c["class"];
									if (c.name && (!f || f.indexOf(a) < 0)) {
										c["class"] = (f || "") + " " + a;
									}
									if (g && CKEDITOR.plugins.link.emptyAnchorFix) {
										c.contenteditable = "false";
										c["data-cke-editable"] = 1;
									}
								} else {
									if (CKEDITOR.plugins.link.fakeAnchor && g) {
										return b.createFakeParserElement(a, "cke_anchor", "anchor");
									}
								}
								return null;
							}
						}
					});
				}
				if (CKEDITOR.plugins.link.emptyAnchorFix) {
					if (f$$0) {
						f$$0.addRules({
							elements: {
								a: function(a) {
									delete a.attributes.contenteditable;
								}
							}
						});
					}
				}
				if (a$$0) {
					a$$0.push(function(a, c) {
						if (c == "a" && (CKEDITOR.plugins.link.tryRestoreFakeAnchor(b, a) || a.getAttribute("name") && (!a.getAttribute("href") || !a.getChildCount()))) {
							return "anchor";
						}
					});
				}
			}
		});
		CKEDITOR.plugins.link = {
			getSelectedLink: function(b) {
				var f = b.getSelection();
				var c = f.getSelectedElement();
				if (c && c.is("a")) {
					return c;
				}
				if (f = f.getRanges()[0]) {
					f.shrink(CKEDITOR.SHRINK_TEXT);
					return b.elementPath(f.getCommonAncestor()).contains("a", 1);
				}
				return null;
			},
			getEditorAnchors: function(b) {
				var f = b.editable();
				var c = f.isInline() && !b.plugins.divarea ? b.document : f;
				var a = c.getElementsByTag("a");
				f = [];
				var d = 0;
				var e;
				for (; e = a.getItem(d++);) {
					if (e.data("cke-saved-name") || e.hasAttribute("name")) {
						f.push({
							name: e.data("cke-saved-name") || e.getAttribute("name"),
							id: e.getAttribute("id")
						});
					}
				}
				if (this.fakeAnchor) {
					c = c.getElementsByTag("img");
					d = 0;
					for (; e = c.getItem(d++);) {
						if (e = this.tryRestoreFakeAnchor(b, e)) {
							f.push({
								name: e.getAttribute("name"),
								id: e.getAttribute("id")
							});
						}
					}
				}
				return f;
			},
			fakeAnchor: CKEDITOR.env.opera || CKEDITOR.env.webkit,
			synAnchorSelector: CKEDITOR.env.ie,
			emptyAnchorFix: CKEDITOR.env.ie && 8 > CKEDITOR.env.version,
			tryRestoreFakeAnchor: function(b, f) {
				if (f && (f.data("cke-real-element-type") && f.data("cke-real-element-type") == "anchor")) {
					var c = b.restoreRealElement(f);
					if (c.data("cke-saved-name")) {
						return c;
					}
				}
			}
		};
		CKEDITOR.unlinkCommand = function() {};
		CKEDITOR.unlinkCommand.prototype = {
			exec: function(b) {
				var f = new CKEDITOR.style({
					element: "a",
					type: CKEDITOR.STYLE_INLINE,
					alwaysRemoveElement: 1
				});
				b.removeStyle(f);
			},
			refresh: function(b, f) {
				var c = f.lastElement && f.lastElement.getAscendant("a", true);
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
			exec: function(b) {
				var f = b.getSelection();
				var c = f.createBookmarks();
				var a;
				if (f && ((a = f.getSelectedElement()) && (CKEDITOR.plugins.link.fakeAnchor && !a.getChildCount() ? CKEDITOR.plugins.link.tryRestoreFakeAnchor(b, a) : a.is("a")))) {
					a.remove(1);
				} else {
					if (a = CKEDITOR.plugins.link.getSelectedLink(b)) {
						if (a.hasAttribute("href")) {
							a.removeAttributes({
								name: 1,
								"data-cke-saved-name": 1
							});
							a.removeClass("cke_anchor");
						} else {
							a.remove(1);
						}
					}
				}
				f.selectBookmarks(c);
			},
			requiredContent: "a[name]"
		};
		CKEDITOR.tools.extend(CKEDITOR.config, {
			linkShowAdvancedTab: true,
			linkShowTargetTab: true
		});
		(function() {
			function b$$0(a) {
				if (!a || (a.type != CKEDITOR.NODE_ELEMENT || a.getName() != "form")) {
					return [];
				}
				var b = [];
				var d = ["style", "className"];
				var c = 0;
				for (; c < d.length; c++) {
					var f = a.$.elements.namedItem(d[c]);
					if (f) {
						f = new CKEDITOR.dom.element(f);
						b.push([f, f.nextSibling]);
						f.remove();
					}
				}
				return b;
			}

			function f$$0(a, b) {
				if (a && (!(a.type != CKEDITOR.NODE_ELEMENT || a.getName() != "form") && b.length > 0)) {
					var d = b.length - 1;
					for (; d >= 0; d--) {
						var c = b[d][0];
						var f = b[d][1];
						if (f) {
							c.insertBefore(f);
						} else {
							c.appendTo(a);
						}
					}
				}
			}

			function c$$0(a, d) {
				var c = b$$0(a);
				var h = {};
				var j = a.$;
				if (!d) {
					h["class"] = j.className || "";
					j.className = "";
				}
				h.inline = j.style.cssText || "";
				if (!d) {
					j.style.cssText = "position: static; overflow: visible";
				}
				f$$0(c);
				return h;
			}

			function a$$0(a, d) {
				var c = b$$0(a);
				var h = a.$;
				if ("class" in d) {
					h.className = d["class"];
				}
				if ("inline" in d) {
					h.style.cssText = d.inline;
				}
				f$$0(c);
			}

			function d$$0(a) {
				if (!a.editable().isInline()) {
					var b = CKEDITOR.instances;
					var d;
					for (d in b) {
						var c = b[d];
						if (c.mode == "wysiwyg" && !c.readOnly) {
							c = c.document.getBody();
							c.setAttribute("contentEditable", false);
							c.setAttribute("contentEditable", true);
						}
					}
					if (a.editable().hasFocus) {
						a.toolbox.focus();
						a.focus();
					}
				}
			}
			CKEDITOR.plugins.add("maximize", {
				init: function(b) {
					function g() {
						var a = j.getViewPaneSize();
						b.resize(a.width, a.height, null, true);
					}
					if (b.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
						var f = b.lang;
						var h = CKEDITOR.document;
						var j = h.getWindow();
						var k;
						var n;
						var m;
						var q = CKEDITOR.TRISTATE_OFF;
						b.addCommand("maximize", {
							modes: {
								wysiwyg: !CKEDITOR.env.iOS,
								source: !CKEDITOR.env.iOS
							},
							readOnly: 1,
							editorFocus: false,
							exec: function() {
								var o = b.container.getChild(1);
								var l = b.ui.space("contents");
								if (b.mode == "wysiwyg") {
									var r = b.getSelection();
									k = r && r.getRanges();
									n = j.getScrollPosition();
								} else {
									var p = b.editable().$;
									k = !CKEDITOR.env.ie && [p.selectionStart, p.selectionEnd];
									n = [p.scrollLeft, p.scrollTop];
								}
								if (this.state == CKEDITOR.TRISTATE_OFF) {
									j.on("resize", g);
									m = j.getScrollPosition();
									r = b.container;
									for (; r = r.getParent();) {
										r.setCustomData("maximize_saved_styles", c$$0(r));
										r.setStyle("z-index", b.config.baseFloatZIndex - 5);
									}
									l.setCustomData("maximize_saved_styles", c$$0(l, true));
									o.setCustomData("maximize_saved_styles", c$$0(o, true));
									l = {
										overflow: CKEDITOR.env.webkit ? "" : "hidden",
										width: 0,
										height: 0
									};
									h.getDocumentElement().setStyles(l);
									if (!CKEDITOR.env.gecko) {
										h.getDocumentElement().setStyle("position", "fixed");
									}
									if (!CKEDITOR.env.gecko || !CKEDITOR.env.quirks) {
										h.getBody().setStyles(l);
									}
									if (CKEDITOR.env.ie) {
										setTimeout(function() {
											j.$.scrollTo(0, 0);
										}, 0);
									} else {
										j.$.scrollTo(0, 0);
									}
									o.setStyle("position", CKEDITOR.env.gecko && CKEDITOR.env.quirks ? "fixed" : "absolute");
									o.$.offsetLeft;
									o.setStyles({
										"z-index": b.config.baseFloatZIndex - 5,
										left: "0px",
										top: "0px"
									});
									o.addClass("cke_maximized");
									g();
									l = o.getDocumentPosition();
									o.setStyles({
										left: -1 * l.x + "px",
										top: -1 * l.y + "px"
									});
									if (CKEDITOR.env.gecko) {
										d$$0(b);
									}
								} else {
									if (this.state == CKEDITOR.TRISTATE_ON) {
										j.removeListener("resize", g);
										l = [l, o];
										r = 0;
										for (; r < l.length; r++) {
											a$$0(l[r], l[r].getCustomData("maximize_saved_styles"));
											l[r].removeCustomData("maximize_saved_styles");
										}
										r = b.container;
										for (; r = r.getParent();) {
											a$$0(r, r.getCustomData("maximize_saved_styles"));
											r.removeCustomData("maximize_saved_styles");
										}
										if (CKEDITOR.env.ie) {
											setTimeout(function() {
												j.$.scrollTo(m.x, m.y);
											}, 0);
										} else {
											j.$.scrollTo(m.x, m.y);
										}
										o.removeClass("cke_maximized");
										if (CKEDITOR.env.webkit) {
											o.setStyle("display", "inline");
											setTimeout(function() {
												o.setStyle("display", "block");
											}, 0);
										}
										b.fire("resize");
									}
								}
								this.toggleState();
								if (r = this.uiItems[0]) {
									l = this.state == CKEDITOR.TRISTATE_OFF ? f.maximize.maximize : f.maximize.minimize;
									r = CKEDITOR.document.getById(r._.id);
									r.getChild(1).setHtml(l);
									r.setAttribute("title", l);
									r.setAttribute("href", 'javascript:void("' + l + '");');
								}
								if (b.mode == "wysiwyg") {
									if (k) {
										if (CKEDITOR.env.gecko) {
											d$$0(b);
										}
										b.getSelection().selectRanges(k);
										if (p = b.getSelection().getStartElement()) {
											p.scrollIntoView(true);
										}
									} else {
										j.$.scrollTo(n.x, n.y);
									}
								} else {
									if (k) {
										p.selectionStart = k[0];
										p.selectionEnd = k[1];
									}
									p.scrollLeft = n[0];
									p.scrollTop = n[1];
								}
								k = n = null;
								q = this.state;
								b.fire("maximize", this.state);
							},
							canUndo: false
						});
						if (b.ui.addButton) {
							b.ui.addButton("Maximize", {
								label: f.maximize.maximize,
								command: "maximize",
								toolbar: "tools,10"
							});
						}
						b.on("mode", function() {
							var a = b.getCommand("maximize");
							a.setState(a.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : q);
						}, null, null, 100);
					}
				}
			});
		})();
		(function() {
			var b;
			var f$$0 = {
				modes: {
					wysiwyg: 1,
					source: 1
				},
				canUndo: false,
				readOnly: 1,
				exec: function(c) {
					var a;
					var d = c.config;
					var e = d.baseHref ? '<base href="' + d.baseHref + '"/>' : "";
					if (d.fullPage) {
						a = c.getData().replace(/<head>/, "$&" + e).replace(/[^>]*(?=<\/title>)/, "$& &mdash; " + c.lang.preview.preview);
					} else {
						d = "<body ";
						var f = c.document && c.document.getBody();
						if (f) {
							if (f.getAttribute("id")) {
								d = d + ('id="' + f.getAttribute("id") + '" ');
							}
							if (f.getAttribute("class")) {
								d = d + ('class="' + f.getAttribute("class") + '" ');
							}
						}
						a = c.config.docType + '<html dir="' + c.config.contentsLangDirection + '"><head>' + e + "<title>" + c.lang.preview.preview + "</title>" + CKEDITOR.tools.buildStyleHtml(c.config.contentsCss) + "</head>" + (d + ">") + c.getData() + "</body></html>";
					}
					e = 640;
					d = 420;
					f = 80;
					try {
						var i = window.screen;
						e = Math.round(i.width * 0.8);
						d = Math.round(i.height * 0.7);
						f = Math.round(i.width * 0.1);
					} catch (h) {}
					if (c.fire("contentPreview", c = {
						dataValue: a
					}) === false) {
						return false;
					}
					i = "";
					var j;
					if (CKEDITOR.env.ie) {
						window._cke_htmlToLoad = c.dataValue;
						j = "javascript:void( (function(){document.open();" + ("(" + CKEDITOR.tools.fixDomain + ")();").replace(/\/\/.*?\n/g, "").replace(/parent\./g, "window.opener.") + "document.write( window.opener._cke_htmlToLoad );document.close();window.opener._cke_htmlToLoad = null;})() )";
						i = "";
					}
					if (CKEDITOR.env.gecko) {
						window._cke_htmlToLoad = c.dataValue;
						i = b + "preview.html";
					}
					i = window.open(i, null, "toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=" + e + ",height=" + d + ",left=" + f);
					if (CKEDITOR.env.ie) {
						i.location = j;
					}
					if (!CKEDITOR.env.ie && !CKEDITOR.env.gecko) {
						j = i.document;
						j.open();
						j.write(c.dataValue);
						j.close();
					}
					return true;
				}
			};
			CKEDITOR.plugins.add("preview", {
				init: function(c) {
					if (c.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
						b = this.path;
						c.addCommand("preview", f$$0);
						if (c.ui.addButton) {
							c.ui.addButton("Preview", {
								label: c.lang.preview.preview,
								command: "preview",
								toolbar: "document,40"
							});
						}
					}
				}
			});
		})();
		CKEDITOR.plugins.add("resize", {
			init: function(b) {
				var f;
				var c$$0;
				var a$$0;
				var d$$0;
				var e = b.config;
				var g$$0 = b.ui.spaceId("resizer");
				var i = b.element ? b.element.getDirection(1) : "ltr";
				if (!e.resize_dir) {
					e.resize_dir = "vertical";
				}
				if (e.resize_maxWidth == void 0) {
					e.resize_maxWidth = 3E3;
				}
				if (e.resize_maxHeight == void 0) {
					e.resize_maxHeight = 3E3;
				}
				if (e.resize_minWidth == void 0) {
					e.resize_minWidth = 750;
				}
				if (e.resize_minHeight == void 0) {
					e.resize_minHeight = 250;
				}
				if (e.resize_enabled !== false) {
					var h$$0 = null;
					var j = (e.resize_dir == "both" || e.resize_dir == "horizontal") && e.resize_minWidth != e.resize_maxWidth;
					var k = (e.resize_dir == "both" || e.resize_dir == "vertical") && e.resize_minHeight != e.resize_maxHeight;
					var n$$0 = function(g) {
						var h = f;
						var m = c$$0;
						var n = h + (g.data.$.screenX - a$$0) * (i == "rtl" ? -1 : 1);
						g = m + (g.data.$.screenY - d$$0);
						if (j) {
							h = Math.max(e.resize_minWidth, Math.min(n, e.resize_maxWidth));
						}
						if (k) {
							m = Math.max(e.resize_minHeight, Math.min(g, e.resize_maxHeight));
						}
						b.resize(j ? h : null, m);
					};
					var m$$0 = function() {
						CKEDITOR.document.removeListener("mousemove", n$$0);
						CKEDITOR.document.removeListener("mouseup", m$$0);
						if (b.document) {
							b.document.removeListener("mousemove", n$$0);
							b.document.removeListener("mouseup", m$$0);
						}
					};
					var q = CKEDITOR.tools.addFunction(function(g) {
						if (!h$$0) {
							h$$0 = b.getResizable();
						}
						f = h$$0.$.offsetWidth || 0;
						c$$0 = h$$0.$.offsetHeight || 0;
						a$$0 = g.screenX;
						d$$0 = g.screenY;
						if (e.resize_minWidth > f) {
							e.resize_minWidth = f;
						}
						if (e.resize_minHeight > c$$0) {
							e.resize_minHeight = c$$0;
						}
						CKEDITOR.document.on("mousemove", n$$0);
						CKEDITOR.document.on("mouseup", m$$0);
						if (b.document) {
							b.document.on("mousemove", n$$0);
							b.document.on("mouseup", m$$0);
						}
						if (g.preventDefault) {
							g.preventDefault();
						}
					});
					b.on("destroy", function() {
						CKEDITOR.tools.removeFunction(q);
					});
					b.on("uiSpace", function(a) {
						if (a.data.space == "bottom") {
							var d = "";
							if (j) {
								if (!k) {
									d = " cke_resizer_horizontal";
								}
							}
							if (!j) {
								if (k) {
									d = " cke_resizer_vertical";
								}
							}
							var c = '<span id="' + g$$0 + '" class="cke_resizer' + d + " cke_resizer_" + i + '" title="' + CKEDITOR.tools.htmlEncode(b.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + q + ', event)">' + (i == "ltr" ? "\u25e2" : "\u25e3") + "</span>";
							if (i == "ltr" && d == "ltr") {
								a.data.html = a.data.html + c;
							} else {
								a.data.html = c + a.data.html;
							}
						}
					}, b, null, 100);
					b.on("maximize", function(a) {
						b.ui.space("resizer")[a.data == CKEDITOR.TRISTATE_ON ? "hide" : "show"]();
					});
				}
			}
		});
		(function() {
			CKEDITOR.plugins.add("selectall", {
				init: function(b$$0) {
					b$$0.addCommand("selectAll", {
						modes: {
							wysiwyg: 1,
							source: 1
						},
						exec: function(b) {
							var c = b.editable();
							if (c.is("textarea")) {
								b = c.$;
								if (CKEDITOR.env.ie) {
									b.createTextRange().execCommand("SelectAll");
								} else {
									b.selectionStart = 0;
									b.selectionEnd = b.value.length;
								}
								b.focus();
							} else {
								if (c.is("body")) {
									b.document.$.execCommand("SelectAll", false, null);
								} else {
									var a = b.createRange();
									a.selectNodeContents(c);
									a.select();
								}
								b.forceNextSelectionCheck();
								b.selectionChange();
							}
						},
						canUndo: false
					});
					if (b$$0.ui.addButton) {
						b$$0.ui.addButton("SelectAll", {
							label: b$$0.lang.selectall.toolbar,
							command: "selectAll",
							toolbar: "selection,10"
						});
					}
				}
			});
		})();
		(function() {
			CKEDITOR.plugins.add("sourcearea", {
				init: function(f) {
					function c() {
						this.hide();
						this.setStyle("height", this.getParent().$.clientHeight + "px");
						this.setStyle("width", this.getParent().$.clientWidth + "px");
						this.show();
					}
					if (f.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
						var a$$0 = CKEDITOR.plugins.sourcearea;
						f.addMode("source", function(a) {
							var e = f.ui.space("contents").getDocument().createElement("textarea");
							e.setStyles(CKEDITOR.tools.extend({
								width: CKEDITOR.env.ie7Compat ? "99%" : "100%",
								height: "100%",
								resize: "none",
								outline: "none",
								"text-align": "left"
							}, CKEDITOR.tools.cssVendorPrefix("tab-size", f.config.sourceAreaTabSize || 4)));
							e.setAttribute("dir", "ltr");
							e.addClass("cke_source cke_reset cke_enable_context_menu");
							f.ui.space("contents").append(e);
							e = f.editable(new b$$0(f, e));
							e.setData(f.getData(1));
							if (CKEDITOR.env.ie) {
								e.attachListener(f, "resize", c, e);
								e.attachListener(CKEDITOR.document.getWindow(), "resize", c, e);
								CKEDITOR.tools.setTimeout(c, 0, e);
							}
							f.fire("ariaWidget", this);
							a();
						});
						f.addCommand("source", a$$0.commands.source);
						if (f.ui.addButton) {
							f.ui.addButton("Source", {
								label: f.lang.sourcearea.toolbar,
								command: "source",
								toolbar: "mode,10"
							});
						}
						f.on("mode", function() {
							f.getCommand("source").setState(f.mode == "source" ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
						});
					}
				}
			});
			var b$$0 = CKEDITOR.tools.createClass({
				base: CKEDITOR.editable,
				proto: {
					setData: function(b) {
						this.setValue(b);
						this.editor.fire("dataReady");
					},
					getData: function() {
						return this.getValue();
					},
					insertHtml: function() {},
					insertElement: function() {},
					insertText: function() {},
					setReadOnly: function(b) {
						this[(b ? "set" : "remove") + "Attribute"]("readOnly", "readonly");
					},
					detach: function() {
						b$$0.baseProto.detach.call(this);
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
					exec: function(b) {
						if (b.mode == "wysiwyg") {
							b.fire("saveSnapshot");
						}
						b.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);
						b.setMode(b.mode == "source" ? "wysiwyg" : "source");
					},
					canUndo: false
				}
			}
		};
		(function() {
			var b$$1 = '<a id="{id}" class="cke_button cke_button__{name} cke_button_{state} {cls}"' + (CKEDITOR.env.gecko && (CKEDITOR.env.version >= 10900 && !CKEDITOR.env.hc) ? "" : " href=\"javascript:void('{titleJs}')\"") + ' title="{title}" tabindex="-1" hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="{hasArrow}" aria-disabled="{ariaDisabled}"';
			if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac) {
				b$$1 = b$$1 + ' onkeypress="return false;"';
			}
			if (CKEDITOR.env.gecko) {
				b$$1 = b$$1 + ' onblur="this.style.cssText = this.style.cssText;"';
			}
			b$$1 = b$$1 + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);"  onmousedown="return CKEDITOR.tools.callFunction({mousedownFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"');
			b$$1 = b$$1 + '>&nbsp;</span><span id="{id}_label" class="cke_button_label cke_button__{name}_label" aria-hidden="false">{label}</span>{arrowHtml}</a>';
			var f = CKEDITOR.addTemplate("buttonArrow", '<span class="cke_button_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : "") + "</span>");
			var c$$0 = CKEDITOR.addTemplate("button", b$$1);
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
				render: function(a$$0, b$$0) {
					var e = CKEDITOR.env;
					var g = this._.id = CKEDITOR.tools.getNextId();
					var i = "";
					var h = this.command;
					var j;
					this._.editor = a$$0;
					var k = {
						id: g,
						button: this,
						editor: a$$0,
						focus: function() {
							CKEDITOR.document.getById(g).focus();
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
					var m = CKEDITOR.tools.addFunction(function(a) {
						var b;
						if (k.onfocus) {
							b = k.onfocus(k, new CKEDITOR.dom.event(a)) !== false;
						}
						if (CKEDITOR.env.gecko) {
							if (CKEDITOR.env.version < 10900) {
								a.preventBubble();
							}
						}
						return b;
					});
					var q = 0;
					var o = CKEDITOR.tools.addFunction(function() {
						if (CKEDITOR.env.opera) {
							var b = a$$0.editable();
							if (b.isInline() && b.hasFocus) {
								a$$0.lockSelection();
								q = 1;
							}
						}
					});
					k.clickFn = j = CKEDITOR.tools.addFunction(function() {
						if (q) {
							a$$0.unlockSelection(1);
							q = 0;
						}
						k.execute();
					});
					if (this.modes) {
						var l = {};
						var r = function() {
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
						a$$0.on("activeFilterChange", r, this);
						a$$0.on("mode", r, this);
						if (!this.readOnly) {
							a$$0.on("readOnly", r, this);
						}
					} else {
						if (h) {
							if (h = a$$0.getCommand(h)) {
								h.on("state", function() {
									this.setState(h.state);
								}, this);
								i = i + (h.state == CKEDITOR.TRISTATE_ON ? "on" : h.state == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off");
							}
						}
					}
					if (this.directional) {
						a$$0.on("contentDirChanged", function(b) {
							var d = CKEDITOR.document.getById(this._.id);
							var c = d.getFirst();
							b = b.data;
							if (b != a$$0.lang.dir) {
								d.addClass("cke_" + b);
							} else {
								d.removeClass("cke_ltr").removeClass("cke_rtl");
							}
							c.setAttribute("style", CKEDITOR.skin.getIconStyle(p, b == "rtl", this.icon, this.iconOffset));
						}, this);
					}
					if (!h) {
						i = i + "off";
					}
					var p = r = this.name || this.command;
					if (this.icon && !/\./.test(this.icon)) {
						p = this.icon;
						this.icon = null;
					}
					e = {
						id: g,
						name: r,
						iconName: p,
						label: this.label,
						cls: this.className || "",
						state: i,
						ariaDisabled: i == "disabled" ? "true" : "false",
						title: this.title,
						titleJs: e.gecko && (e.version >= 10900 && !e.hc) ? "" : (this.title || "").replace("'", ""),
						hasArrow: this.hasArrow ? "true" : "false",
						keydownFn: n,
						mousedownFn: o,
						focusFn: m,
						clickFn: j,
						style: CKEDITOR.skin.getIconStyle(p, a$$0.lang.dir == "rtl", this.icon, this.iconOffset),
						arrowHtml: this.hasArrow ? f.output() : ""
					};
					c$$0.output(e, b$$0);
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
			function b$$2(a$$0) {
				function b$$1() {
					var e = c$$0();
					var h = CKEDITOR.tools.clone(a$$0.config.toolbarGroups) || f$$1(a$$0);
					var j = 0;
					for (; j < h.length; j++) {
						var k = h[j];
						if (k != "/") {
							if (typeof k == "string") {
								k = h[j] = {
									name: k
								};
							}
							var l;
							var r = k.groups;
							if (r) {
								var p = 0;
								for (; p < r.length; p++) {
									l = r[p];
									if (l = e[l]) {
										i(k, l);
									}
								}
							}
							if (l = e[k.name]) {
								i(k, l);
							}
						}
					}
					return h;
				}

				function c$$0() {
					var b$$0 = {};
					var e;
					var g;
					var f;
					for (e in a$$0.ui.items) {
						g = a$$0.ui.items[e];
						f = g.toolbar || "others";
						f = f.split(",");
						g = f[0];
						f = parseInt(f[1] || -1, 10);
						if (!b$$0[g]) {
							b$$0[g] = [];
						}
						b$$0[g].push({
							name: e,
							order: f
						});
					}
					for (g in b$$0) {
						b$$0[g] = b$$0[g].sort(function(a, b) {
							return a.order == b.order ? 0 : b.order < 0 ? -1 : a.order < 0 ? 1 : a.order < b.order ? -1 : 1;
						});
					}
					return b$$0;
				}

				function i(b, c) {
					if (c.length) {
						if (b.items) {
							b.items.push(a$$0.ui.create("-"));
						} else {
							b.items = [];
						}
						var e;
						for (; e = c.shift();) {
							e = typeof e == "string" ? e : e.name;
							if (!j$$0 || CKEDITOR.tools.indexOf(j$$0, e) == -1) {
								if (e = a$$0.ui.create(e)) {
									if (a$$0.addFeature(e)) {
										b.items.push(e);
									}
								}
							}
						}
					}
				}

				function h$$0(a) {
					var b = [];
					var d;
					var c;
					var e;
					d = 0;
					for (; d < a.length; ++d) {
						c = a[d];
						e = {};
						if (c == "/") {
							b.push(c);
						} else {
							if (CKEDITOR.tools.isArray(c)) {
								i(e, CKEDITOR.tools.clone(c));
								b.push(e);
							} else {
								if (c.items) {
									i(e, CKEDITOR.tools.clone(c.items));
									e.name = c.name;
									b.push(e);
								}
							}
						}
					}
					return b;
				}
				var j$$0 = a$$0.config.removeButtons;
				j$$0 = j$$0 && j$$0.split(",");
				var k$$0 = a$$0.config.toolbar;
				if (typeof k$$0 == "string") {
					k$$0 = a$$0.config["toolbar_" + k$$0];
				}
				return a$$0.toolbar = k$$0 ? h$$0(k$$0) : b$$1();
			}

			function f$$1(a) {
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
			var c$$1 = function() {
				this.toolbars = [];
				this.focusCommandExecuted = false;
			};
			c$$1.prototype.focus = function() {
				var a = 0;
				var b;
				for (; b = this.toolbars[a++];) {
					var c = 0;
					var f;
					for (; f = b.items[c++];) {
						if (f.focus) {
							f.focus();
							return;
						}
					}
				}
			};
			var a$$1 = {
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
				init: function(d$$0) {
					var e$$1;
					var f$$0 = function(a$$0, b) {
						var c;
						var k = d$$0.lang.dir == "rtl";
						var n = d$$0.config.toolbarGroupCycling;
						var m = k ? 37 : 39;
						k = k ? 39 : 37;
						n = n === void 0 || n;
						switch (b) {
							case 9:
								;
							case CKEDITOR.SHIFT + 9:
								for (; !c || !c.items.length;) {
									c = b == 9 ? (c ? c.next : a$$0.toolbar.next) || d$$0.toolbox.toolbars[0] : (c ? c.previous : a$$0.toolbar.previous) || d$$0.toolbox.toolbars[d$$0.toolbox.toolbars.length - 1];
									if (c.items.length) {
										a$$0 = c.items[e$$1 ? c.items.length - 1 : 0];
										for (; a$$0 && !a$$0.focus;) {
											if (!(a$$0 = e$$1 ? a$$0.previous : a$$0.next)) {
												c = 0;
											}
										}
									}
								}
								if (a$$0) {
									a$$0.focus();
								}
								return false;
							case m:
								c = a$$0;
								do {
									c = c.next;
									if (!c) {
										if (n) {
											c = a$$0.toolbar.items[0];
										}
									}
								} while (c && !c.focus);
								if (c) {
									c.focus();
								} else {
									f$$0(a$$0, 9);
								}
								return false;
							case 40:
								if (a$$0.button && a$$0.button.hasArrow) {
									d$$0.once("panelShow", function(a) {
										a.data._.panel._.currentBlock.onKeyDown(40);
									});
									a$$0.execute();
								} else {
									f$$0(a$$0, b == 40 ? m : k);
								}
								return false;
							case k:
								;
							case 38:
								c = a$$0;
								do {
									c = c.previous;
									if (!c) {
										if (n) {
											c = a$$0.toolbar.items[a$$0.toolbar.items.length - 1];
										}
									}
								} while (c && !c.focus);
								if (c) {
									c.focus();
								} else {
									e$$1 = 1;
									f$$0(a$$0, CKEDITOR.SHIFT + 9);
									e$$1 = 0;
								}
								return false;
							case 27:
								d$$0.focus();
								return false;
							case 13:
								;
							case 32:
								a$$0.execute();
								return false;
						}
						return true;
					};
					d$$0.on("uiSpace", function(a$$0) {
						if (a$$0.data.space == d$$0.config.toolbarLocation) {
							a$$0.removeListener();
							d$$0.toolbox = new c$$1;
							var e$$0 = CKEDITOR.tools.getNextId();
							var j = ['<span id="', e$$0, '" class="cke_voice_label">', d$$0.lang.toolbar.toolbars, "</span>", '<span id="' + d$$0.ui.spaceId("toolbox") + '" class="cke_toolbox" role="group" aria-labelledby="', e$$0, '" onmousedown="return false;">'];
							e$$0 = d$$0.config.toolbarStartupExpanded !== false;
							var k;
							var n;
							if (d$$0.config.toolbarCanCollapse) {
								if (d$$0.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
									j.push('<span class="cke_toolbox_main"' + (e$$0 ? ">" : ' style="display:none">'));
								}
							}
							var m = d$$0.toolbox.toolbars;
							var q = b$$2(d$$0);
							var o = 0;
							for (; o < q.length; o++) {
								var l;
								var r = 0;
								var p;
								var t = q[o];
								var w;
								if (t) {
									if (k) {
										j.push("</span>");
										n = k = 0;
									}
									if (t === "/") {
										j.push('<span class="cke_toolbar_break"></span>');
									} else {
										w = t.items || t;
										var s = 0;
										for (; s < w.length; s++) {
											var v = w[s];
											var z;
											if (v) {
												if (v.type == CKEDITOR.UI_SEPARATOR) {
													n = k && v;
												} else {
													z = v.canGroup !== false;
													if (!r) {
														l = CKEDITOR.tools.getNextId();
														r = {
															id: l,
															items: []
														};
														p = t.name && (d$$0.lang.toolbar.toolbarGroups[t.name] || t.name);
														j.push('<span id="', l, '" class="cke_toolbar"', p ? ' aria-labelledby="' + l + '_label"' : "", ' role="toolbar">');
														if (p) {
															j.push('<span id="', l, '_label" class="cke_voice_label">', p, "</span>");
														}
														j.push('<span class="cke_toolbar_start"></span>');
														var u = m.push(r) - 1;
														if (u > 0) {
															r.previous = m[u - 1];
															r.previous.next = r;
														}
													}
													if (z) {
														if (!k) {
															j.push('<span class="cke_toolgroup" role="presentation">');
															k = 1;
														}
													} else {
														if (k) {
															j.push("</span>");
															k = 0;
														}
													}
													l = function(a) {
														a = a.render(d$$0, j);
														u = r.items.push(a) - 1;
														if (u > 0) {
															a.previous = r.items[u - 1];
															a.previous.next = a;
														}
														a.toolbar = r;
														a.onkey = f$$0;
														a.onfocus = function() {
															if (!d$$0.toolbox.focusCommandExecuted) {
																d$$0.focus();
															}
														};
													};
													if (n) {
														l(n);
														n = 0;
													}
													l(v);
												}
											}
										}
										if (k) {
											j.push("</span>");
											n = k = 0;
										}
										if (r) {
											j.push('<span class="cke_toolbar_end"></span></span>');
										}
									}
								}
							}
							if (d$$0.config.toolbarCanCollapse) {
								j.push("</span>");
							}
							if (d$$0.config.toolbarCanCollapse && d$$0.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
								var x = CKEDITOR.tools.addFunction(function() {
									d$$0.execCommand("toolbarCollapse");
								});
								d$$0.on("destroy", function() {
									CKEDITOR.tools.removeFunction(x);
								});
								d$$0.addCommand("toolbarCollapse", {
									readOnly: 1,
									exec: function(a) {
										var b = a.ui.space("toolbar_collapser");
										var d = b.getPrevious();
										var c = a.ui.space("contents");
										var e = d.getParent();
										var f = parseInt(c.$.style.height, 10);
										var g = e.$.offsetHeight;
										var h = b.hasClass("cke_toolbox_collapser_min");
										if (h) {
											d.show();
											b.removeClass("cke_toolbox_collapser_min");
											b.setAttribute("title", a.lang.toolbar.toolbarCollapse);
										} else {
											d.hide();
											b.addClass("cke_toolbox_collapser_min");
											b.setAttribute("title", a.lang.toolbar.toolbarExpand);
										}
										b.getFirst().setText(h ? "\u25b2" : "\u25c0");
										c.setStyle("height", f - (e.$.offsetHeight - g) + "px");
										a.fire("resize");
									},
									modes: {
										wysiwyg: 1,
										source: 1
									}
								});
								d$$0.setKeystroke(CKEDITOR.ALT + (CKEDITOR.env.ie || CKEDITOR.env.webkit ? 189 : 109), "toolbarCollapse");
								j.push('<a title="' + (e$$0 ? d$$0.lang.toolbar.toolbarCollapse : d$$0.lang.toolbar.toolbarExpand) + '" id="' + d$$0.ui.spaceId("toolbar_collapser") + '" tabIndex="-1" class="cke_toolbox_collapser');
								if (!e$$0) {
									j.push(" cke_toolbox_collapser_min");
								}
								j.push('" onclick="CKEDITOR.tools.callFunction(' + x + ')">', '<span class="cke_arrow">&#9650;</span>', "</a>");
							}
							j.push("</span>");
							a$$0.data.html = a$$0.data.html + j.join("");
						}
					});
					d$$0.on("destroy", function() {
						if (this.toolbox) {
							var a;
							var b = 0;
							var d;
							var c;
							var e;
							a = this.toolbox.toolbars;
							for (; b < a.length; b++) {
								c = a[b].items;
								d = 0;
								for (; d < c.length; d++) {
									e = c[d];
									if (e.clickFn) {
										CKEDITOR.tools.removeFunction(e.clickFn);
									}
									if (e.keyDownFn) {
										CKEDITOR.tools.removeFunction(e.keyDownFn);
									}
								}
							}
						}
					});
					d$$0.on("uiReady", function() {
						var a = d$$0.ui.space("toolbox");
						if (a) {
							d$$0.focusManager.add(a, 1);
						}
					});
					d$$0.addCommand("toolbarFocus", a$$1);
					d$$0.setKeystroke(CKEDITOR.ALT + 121, "toolbarFocus");
					d$$0.ui.add("-", CKEDITOR.UI_SEPARATOR, {});
					d$$0.ui.addHandler(CKEDITOR.UI_SEPARATOR, {
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
			CKEDITOR.ui.prototype.addToolbarGroup = function(a$$0, b, c) {
				var i = f$$1(this.editor);
				var h = b === 0;
				var j = {
					name: a$$0
				};
				if (c) {
					if (c = CKEDITOR.tools.search(i, function(a) {
						return a.name == c;
					})) {
						if (!c.groups) {
							c.groups = [];
						}
						if (b) {
							b = CKEDITOR.tools.indexOf(c.groups, b);
							if (b >= 0) {
								c.groups.splice(b + 1, 0, a$$0);
								return;
							}
						}
						if (h) {
							c.groups.splice(0, 0, a$$0);
						} else {
							c.groups.push(a$$0);
						}
						return;
					}
					b = null;
				}
				if (b) {
					b = CKEDITOR.tools.indexOf(i, function(a) {
						return a.name == b;
					});
				}
				if (h) {
					i.splice(0, 0, a$$0);
				} else {
					if (typeof b == "number") {
						i.splice(b + 1, 0, j);
					} else {
						i.push(a$$0);
					}
				}
			};
		})();
		CKEDITOR.UI_SEPARATOR = "separator";
		CKEDITOR.config.toolbarLocation = "top";
		(function() {
			function b$$0(a) {
				this.editor = a;
				this.reset();
			}
			CKEDITOR.plugins.add("undo", {
				init: function(a$$0) {
					function d(a) {
						if (f.enabled) {
							if (a.data.command.canUndo !== false) {
								f.save();
							}
						}
					}

					function c() {
						f.enabled = a$$0.readOnly ? false : a$$0.mode == "wysiwyg";
						f.onChange();
					}
					var f = a$$0.undoManager = new b$$0(a$$0);
					var i = a$$0.addCommand("undo", {
						exec: function() {
							if (f.undo()) {
								a$$0.selectionChange();
								this.fire("afterUndo");
							}
						},
						startDisabled: true,
						canUndo: false
					});
					var h = a$$0.addCommand("redo", {
						exec: function() {
							if (f.redo()) {
								a$$0.selectionChange();
								this.fire("afterRedo");
							}
						},
						startDisabled: true,
						canUndo: false
					});
					a$$0.setKeystroke([
						[CKEDITOR.CTRL + 90, "undo"],
						[CKEDITOR.CTRL + 89, "redo"],
						[CKEDITOR.CTRL + CKEDITOR.SHIFT + 90, "redo"]
					]);
					f.onChange = function() {
						i.setState(f.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
						h.setState(f.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
					};
					a$$0.on("beforeCommandExec", d);
					a$$0.on("afterCommandExec", d);
					a$$0.on("saveSnapshot", function(a) {
						f.save(a.data && a.data.contentOnly);
					});
					a$$0.on("contentDom", function() {
						a$$0.editable().on("keydown", function(a) {
							a = a.data.getKey();
							if (a == 8 || a == 46) {
								f.type(a, 0);
							}
						});
						a$$0.editable().on("keypress", function(a) {
							f.type(a.data.getKey(), 1);
						});
					});
					a$$0.on("beforeModeUnload", function() {
						if (a$$0.mode == "wysiwyg") {
							f.save(true);
						}
					});
					a$$0.on("mode", c);
					a$$0.on("readOnly", c);
					if (a$$0.ui.addButton) {
						a$$0.ui.addButton("Undo", {
							label: a$$0.lang.undo.undo,
							command: "undo",
							toolbar: "undo,10"
						});
						a$$0.ui.addButton("Redo", {
							label: a$$0.lang.undo.redo,
							command: "redo",
							toolbar: "undo,20"
						});
					}
					a$$0.resetUndo = function() {
						f.reset();
						a$$0.fire("saveSnapshot");
					};
					a$$0.on("updateSnapshot", function() {
						if (f.currentImage) {
							f.update();
						}
					});
					a$$0.on("lockSnapshot", function(a) {
						f.lock(a.data && a.data.dontUpdate);
					});
					a$$0.on("unlockSnapshot", f.unlock, f);
				}
			});
			CKEDITOR.plugins.undo = {};
			var f$$0 = CKEDITOR.plugins.undo.Image = function(a, b) {
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
			var c$$0 = /\b(?:href|src|name)="[^"]*?"/gi;
			f$$0.prototype = {
				equalsContent: function(a) {
					var b = this.contents;
					a = a.contents;
					if (CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat)) {
						b = b.replace(c$$0, "");
						a = a.replace(c$$0, "");
					}
					return b != a ? false : true;
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
							var f = b[c];
							var i = a[c];
							if (f.startOffset != i.startOffset || (f.endOffset != i.endOffset || (!CKEDITOR.tools.arrayCompare(f.start, i.start) || !CKEDITOR.tools.arrayCompare(f.end, i.end)))) {
								return false;
							}
						}
					}
					return true;
				}
			};
			b$$0.prototype = {
				type: function(a$$0, b) {
					var c = !b && a$$0 != this.lastKeystroke;
					var g = this.editor;
					if (!this.typing || (b && !this.wasCharacter || c)) {
						var i = new f$$0(g);
						var h = this.snapshots.length;
						CKEDITOR.tools.setTimeout(function() {
							var a = g.getSnapshot();
							if (CKEDITOR.env.ie) {
								a = a.replace(/\s+data-cke-expando=".*?"/g, "");
							}
							if (i.contents != a && h == this.snapshots.length) {
								this.typing = true;
								if (!this.save(false, i, false)) {
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
								g.fire("change");
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
								g.fire("change");
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
					if (this.locked) {
						return false;
					}
					var g = this.snapshots;
					if (!b) {
						b = new f$$0(this.editor);
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
							this.editor.fire("change");
						}
					}
					g.splice(this.index + 1, g.length - this.index - 1);
					if (g.length == this.limit) {
						g.shift();
					}
					this.index = g.push(b) - 1;
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
					var f;
					if (c) {
						if (a) {
							f = this.index - 1;
							for (; f >= 0; f--) {
								a = b[f];
								if (!c.equalsContent(a)) {
									a.index = f;
									return a;
								}
							}
						} else {
							f = this.index + 1;
							for (; f < b.length; f++) {
								a = b[f];
								if (!c.equalsContent(a)) {
									a.index = f;
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
							a = new f$$0(this.editor);
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
				lock: function(a) {
					if (this.locked) {
						this.locked.level++;
					} else {
						if (a) {
							this.locked = {
								level: 1
							};
						} else {
							a = new f$$0(this.editor, true);
							this.locked = {
								update: this.currentImage && this.currentImage.equalsContent(a) ? a : null,
								level: 1
							};
						}
					}
				},
				unlock: function() {
					if (this.locked && !--this.locked.level) {
						var a = this.locked.update;
						var b = a && new f$$0(this.editor, true);
						this.locked = null;
						if (a) {
							if (!a.equalsContent(b)) {
								this.update();
							}
						}
					}
				}
			};
		})();
		(function() {
			function b$$0(a$$0) {
				var b = this.editor;
				var c$$0 = a$$0.document;
				var f$$0 = c$$0.body;
				if (a$$0 = c$$0.getElementById("cke_actscrpt")) {
					a$$0.parentNode.removeChild(a$$0);
				}
				if (a$$0 = c$$0.getElementById("cke_shimscrpt")) {
					a$$0.parentNode.removeChild(a$$0);
				}
				if (CKEDITOR.env.gecko) {
					f$$0.contentEditable = false;
					if (CKEDITOR.env.version < 2E4) {
						f$$0.innerHTML = f$$0.innerHTML.replace(/^.*<\!-- cke-content-start --\>/, "");
						setTimeout(function() {
							var a = new CKEDITOR.dom.range(new CKEDITOR.dom.document(c$$0));
							a.setStart(new CKEDITOR.dom.node(f$$0), 0);
							b.getSelection().selectRanges([a]);
						}, 0);
					}
				}
				f$$0.contentEditable = true;
				if (CKEDITOR.env.ie) {
					f$$0.hideFocus = true;
					f$$0.disabled = true;
					f$$0.removeAttribute("disabled");
				}
				delete this._.isLoadingData;
				this.$ = f$$0;
				c$$0 = new CKEDITOR.dom.document(c$$0);
				this.setup();
				if (CKEDITOR.env.ie) {
					c$$0.getDocumentElement().addClass(c$$0.$.compatMode);
					if (b.config.enterMode != CKEDITOR.ENTER_P) {
						this.attachListener(c$$0, "selectionchange", function() {
							var a = c$$0.getBody();
							var f = b.getSelection();
							var g = f && f.getRanges()[0];
							if (g) {
								if (a.getHtml().match(/^<p>(?:&nbsp;|<br>)<\/p>$/i) && g.startContainer.equals(a)) {
									setTimeout(function() {
										g = b.getSelection().getRanges()[0];
										if (!g.startContainer.equals("body")) {
											a.getFirst().remove(1);
											g.moveToElementEditEnd(a);
											g.select();
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
				} catch (i) {}
				try {
					b.document.$.execCommand("enableInlineTableEditing", false, !b.config.disableNativeTableHandles);
				} catch (h) {}
				if (b.config.disableObjectResizing) {
					try {
						this.getDocument().$.execCommand("enableObjectResizing", false, false);
					} catch (j) {
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
									var e = b.createRange();
									e[c == 33 ? "moveToElementEditStart" : "moveToElementEditEnd"](this);
									e.select();
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
				b.document.getElementsByTag("title").getItem(0).data("cke-title", b.document.$.title);
				if (CKEDITOR.env.ie) {
					b.document.$.title = this._.docTitle;
				}
				CKEDITOR.tools.setTimeout(function() {
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

			function f$$1() {
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
					a$$0.addMode("wysiwyg", function(b) {
						function e$$0(e) {
							if (e) {
								e.removeListener();
							}
							a$$0.editable(new c$$1(a$$0, i.$.contentWindow.document.body));
							a$$0.setData(a$$0.getData(1), b);
						}
						var f = "document.open();" + (CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "") + "document.close();";
						f = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent(f) + "}())" : "";
						var i = CKEDITOR.dom.element.createFromHtml('<iframe src="' + f + '" frameBorder="0"></iframe>');
						i.setStyles({
							width: "100%",
							height: "100%"
						});
						i.addClass("cke_wysiwyg_frame cke_reset");
						var h = a$$0.ui.space("contents");
						h.append(i);
						if (f = CKEDITOR.env.ie || CKEDITOR.env.gecko) {
							i.on("load", e$$0);
						}
						var j = a$$0.title;
						var k = a$$0.lang.common.editorHelp;
						if (j) {
							if (CKEDITOR.env.ie) {
								j = j + (", " + k);
							}
							i.setAttribute("title", j);
						}
						j = CKEDITOR.tools.getNextId();
						var n = CKEDITOR.dom.element.createFromHtml('<span id="' + j + '" class="cke_voice_label">' + k + "</span>");
						h.append(n, 1);
						a$$0.on("beforeModeUnload", function(a) {
							a.removeListener();
							n.remove();
						});
						i.setAttributes({
							"aria-describedby": j,
							tabIndex: a$$0.tabIndex,
							allowTransparency: "true"
						});
						if (!f) {
							e$$0();
						}
						if (CKEDITOR.env.webkit) {
							f = function() {
								h.setStyle("width", "100%");
								i.hide();
								i.setSize("width", h.getSize("width"));
								h.removeStyle("width");
								i.show();
							};
							i.setCustomData("onResize", f);
							CKEDITOR.document.getWindow().on("resize", f);
						}
						a$$0.fire("ariaWidget", i);
					});
				}
			});
			var c$$1 = CKEDITOR.tools.createClass({
				$: function(a$$0) {
					this.base.apply(this, arguments);
					this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function(a) {
						CKEDITOR.tools.setTimeout(b$$0, 0, this, a);
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
							var g = c.config;
							var i = g.fullPage;
							var h = g.docType;
							var j = CKEDITOR.tools.buildStyleHtml(f$$1()).replace(/<style>/, '<style data-cke-temp="1">');
							if (!i) {
								j = j + CKEDITOR.tools.buildStyleHtml(c.config.contentsCss);
							}
							var k = g.baseHref ? '<base href="' + g.baseHref + '" data-cke-temp="1" />' : "";
							if (i) {
								a$$0 = a$$0.replace(/<!DOCTYPE[^>]*>/i, function(a) {
									c.docType = h = a;
									return "";
								}).replace(/<\?xml\s[^\?]*\?>/i, function(a) {
									c.xmlDeclaration = a;
									return "";
								});
							}
							a$$0 = c.dataProcessor.toHtml(a$$0);
							if (i) {
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
								a$$0 = a$$0.replace(/<\/head\s*>/, j + "$&");
								a$$0 = h + a$$0;
							} else {
								a$$0 = g.docType + '<html dir="' + g.contentsLangDirection + '" lang="' + (g.contentsLanguage || c.langCode) + '"><head><title>' + this._.docTitle + "</title>" + k + j + "</head><body" + (g.bodyId ? ' id="' + g.bodyId + '"' : "") + (g.bodyClass ? ' class="' + g.bodyClass + '"' : "") + ">" + a$$0 + "</body></html>";
							}
							if (CKEDITOR.env.gecko) {
								a$$0 = a$$0.replace(/<body/, '<body contenteditable="true" ');
								if (CKEDITOR.env.version < 2E4) {
									a$$0 = a$$0.replace(/<body[^>]*>/, "$&\x3c!-- cke-content-start --\x3e");
								}
							}
							g = '<script id="cke_actscrpt" type="text/javascript"' + (CKEDITOR.env.ie ? ' defer="defer" ' : "") + ">var wasLoaded=0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" + this._.frameLoadedHandler + ",window);wasLoaded=1;}" + (CKEDITOR.env.ie ? "onload();" : 'document.addEventListener("DOMContentLoaded", onload, false );') + "\x3c/script>";
							if (CKEDITOR.env.ie) {
								if (CKEDITOR.env.version < 9) {
									g = g + '<script id="cke_shimscrpt">window.parent.CKEDITOR.tools.enableHtml5Elements(document)\x3c/script>';
								}
							}
							a$$0 = a$$0.replace(/(?=\s*<\/(:?head)>)/, g);
							this.clearCustomData();
							this.clearListeners();
							c.fire("contentDomUnload");
							var n = this.getDocument();
							try {
								n.write(a$$0);
							} catch (m) {
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
						var f = c && a.docType;
						var i = c && a.xmlDeclaration;
						var h = this.getDocument();
						c = c ? h.getDocumentElement().getOuterHtml() : h.getBody().getHtml();
						if (CKEDITOR.env.gecko) {
							if (b.enterMode != CKEDITOR.ENTER_BR) {
								c = c.replace(/<br>(?=\s*(:?$|<\/body>))/, "");
							}
						}
						c = a.dataProcessor.toDataFormat(c);
						if (i) {
							c = i + "\n" + c;
						}
						if (f) {
							c = f + "\n" + c;
						}
						return c;
					},
					focus: function() {
						if (this._.isLoadingData) {
							this._.isPendingFocus = true;
						} else {
							c$$1.baseProto.focus.call(this);
						}
					},
					detach: function() {
						var a = this.editor;
						var b = a.document;
						a = a.window.getFrame();
						c$$1.baseProto.detach.call(this);
						this.clearCustomData();
						b.getDocumentElement().clearCustomData();
						a.clearCustomData();
						CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);
						if (b = a.removeCustomData("onResize")) {
							b.removeListener();
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
			function b$$1(a) {
				this.editor = a;
				a.on("destroy", function() {
					this.maps = {};
					this.editor = null;
				});
				this.maps = {};
				this.CreatedMapsNames = [];
				return this;
			}

			function f$$1(a) {
				this.editor = a;
				var b = new Date;
				this.number = "gmap" + b.getFullYear() + b.getMonth() + b.getDate() + b.getHours() + b.getMinutes() + b.getSeconds();
				this.width = a.config.googleMaps_Width || 500;
				this.height = a.config.googleMaps_Height || 370;
				this.centerLat = a.config.googleMaps_CenterLat || 37.4419;
				this.centerLon = a.config.googleMaps_CenterLon || -122.1419;
				this.zoom = a.config.googleMaps_Zoom || 11;
				this.heading = this.tilt = 0;
				this.markerPoints = [];
				this.textsData = [];
				this.linesData = [];
				this.areasData = [];
				this.circlesData = [];
				this.mapType = 0;
				this.generatedType = 3;
				this.kmlOverlay = "";
				this.mapTypeControl = this.zoomControl = "Default";
				this.overviewMapControl = this.scaleControl = false;
				this.overviewMapControlOpened = true;
				this.weather = this.googleBar = false;
				this.weatherUsaUnits = a.config.googleMaps_weatherUsaUnits || false;
				this.pathType = "Default";
				this.WrapperClass = a.config.googleMaps_WrapperClass || "";
				this.key = a.config.googleMaps_ApiKey || "";
			}

			function c$$1(a$$1) {
				var b$$0 = a$$1.dataProcessor;
				var c$$0 = b$$0 && b$$0.htmlFilter;
				var f$$0 = b$$0 && b$$0.dataFilter;
				var i = a$$1.plugins.googleMapsHandler;
				a$$1.on("toHtml", function(a$$0) {
					a$$0.data.dataValue.forEach(function(a) {
						if (a.name == "img") {
							var b = a.attributes.id;
							if (b && /^gmap\d+$/.test(b)) {
								a.attributes["data-cke-realelement"] = "googlemap";
							} else {
								if ((b = a.parent) && b.name == "div") {
									if (b = b.attributes.id) {
										if (/^dgmap\d+$/.test(b)) {
											a.attributes["data-cke-realelement"] = "googlemap";
										}
									}
								}
							}
						}
					});
				}, null, null, 5);
				f$$0.addRules({
					comment: function(a) {
						if (a.substr(0, 15) == "{cke_protected}") {
							var b = a.substr(15);
							b = decodeURIComponent(b);
							if (i.detectMapScript(b)) {
								var d = i.createNew();
								if (d.parse(b)) {
									return d.requiresImage ? new CKEDITOR.htmlParser.element("img", {
										id: d.number,
										mapnumber: d.number,
										src: d.generateStaticMap(),
										width: d.width,
										height: d.height
									}) : false;
								}
							} else {
								if (i.detectGoogleScript(b)) {
									return false;
								}
							}
						}
						return a;
					},
					elements: {
						img: function(a) {
							var b = a.attributes.id;
							if (b && /^gmap\d+$/.test(b)) {
								a.attributes.mapnumber = b;
							} else {
								if ((b = a.parent) && b.name == "div") {
									if (b = b.attributes.id) {
										if (/^dgmap\d+$/.test(b)) {
											a.attributes.id = a.attributes.mapnumber = b.substr(1);
										}
									}
								}
							}
							if (a.attributes["data-cke-realelement"]) {
								if (a.attributes["data-cke-realelement"] == "googlemap") {
									delete a.attributes["data-cke-realelement"];
								}
							}
						},
						div: function(a) {
							var b = a.attributes.id;
							if (b) {
								if (/^gmap\d+$/.test(b)) {
									a.attributes.id = "d" + b;
								}
							}
						}
					}
				});
				c$$0.addRules({
					elements: {
						img: function(b) {
							var d = b.attributes.mapnumber;
							if (d) {
								var c;
								c = a$$1.plugins.googleMapsHandler;
								if ((d = c.getMap(d)) && d.generatedType > 1) {
									c.CreatedMapsNames.push(d.number);
									c = new CKEDITOR.htmlParser.cdata(d.BuildScript());
									b.parent.children.push(c);
								}
								delete b.attributes.mapnumber;
							}
							return b;
						}
					}
				}, {
					applyToAll: true
				});
				b$$0.toDataFormat = CKEDITOR.tools.override(b$$0.toDataFormat, function(b) {
					return function(d, c) {
						var e = a$$1.plugins.googleMapsHandler;
						e.CreatedMapsNames = [];
						if (!e.validateDOM()) {
							var f = a$$1.document;
							d = a$$1.config.fullPage ? f.getDocumentElement().getOuterHtml() : f.getBody().getHtml();
						}
						f = b.call(this, d, c);
						if (e.CreatedMapsNames.length > 0) {
							f = f + e.BuildEndingScript();
						}
						return f;
					};
				});
			}
			b$$1.prototype = {
				majorVersion: 3,
				minorVersion: 6,
				isStaticImage: function(a) {
					return a.getAttribute("mapnumber") || /^(https?\:)?\/\/maps\.google(apis)?\.com\/(maps\/api\/)?staticmap/.test(a.src);
				},
				getMap: function(a) {
					return this.maps[a];
				},
				detectMapScript: function(a) {
					if (!/CK googlemaps v(\d)\.(\d+)/.test(a)) {
						return false;
					}
					a = parseInt(RegExp.$1, 10);
					var b = parseInt(RegExp.$2, 10);
					return a > this.majorVersion || a == this.majorVersion && b > this.minorVersion ? false : true;
				},
				detectGoogleScript: function(a) {
					if (/CK googlemapsEnd v(\d)\.(\d+)/.test(a)) {
						var b = parseInt(RegExp.$1, 10);
						var c = parseInt(RegExp.$2, 10);
						return b > this.majorVersion || (b == this.majorVersion && c > this.minorVersion || b == 2 && !/script.src\s*=\s*"http:\/\/www\.google\.com\/.*key=(.*?)("|&)/.test(a)) ? false : true;
					}
					return !/^<script src="http:\/\/maps\.google\.com\/.*key=(.*?)("|&)/.test(a) ? false : true;
				},
				createNew: function() {
					var a = new f$$1(this.editor);
					return this.maps[a.number] = a;
				},
				BuildEndingScript: function() {
					var a = [];
					var b = this.editor.config.googleMaps_endScriptPath;
					if (b === "") {
						return "";
					}
					if (typeof b == "undefined") {
						b = this.editor.plugins.googlemaps.path + "scripts/cke_gmaps_end.js";
					}
					a.push('\r\n<script type="text/javascript" src="' + b + '">');
					a.push("/* CK googlemapsEnd v" + this.majorVersion + "." + this.minorVersion + " */");
					a.push("\x3c/script>");
					return a.join("");
				},
				validateDOM: function() {
					var a;
					var b = [];
					var c;
					var f;
					var i;
					var h;
					var j;
					var k;
					k = false;
					c = this.maps;
					for (a in c) {
						b.push(a);
					}
					if (b.length === 0) {
						return true;
					}
					var n = this.editor.document.$;
					a = 0;
					for (; a < b.length; a++) {
						i = b[a];
						h = c[i];
						if (j = n.getElementById(i)) {
							if (j.parentNode.nodeName != "DIV" || j.parentNode.id != "d" + h.number) {
								k = true;
								h.createDivs(j);
							}
							h.updateDimensions(j);
						} else {
							if (h = n.getElementById("d" + i)) {
								k = new CKEDITOR.dom.element(h);
								k.remove(true);
								k = true;
							}
							delete c[i];
						}
					}
					if (document.querySelectorAll) {
						a = 0;
						for (; a < b.length; a++) {
							i = b[a];
							j = n.querySelectorAll("div#d" + i);
							if (!(j.length <= 1)) {
								c = j.length - 1;
								for (; c >= 0; c--) {
									h = j[c];
									f = h.getElementsByTagName("IMG");
									if (!f || (!f[0] || f[0].id != i)) {
										k = new CKEDITOR.dom.element(h);
										k.remove(true);
										k = true;
									}
								}
							}
						}
					}
					return !k;
				}
			};
			f$$1.prototype.createHtmlElement = function() {
				this.editor.plugins.googleMapsHandler.maps[this.number] = this;
				var a = this.editor.document.createElement("IMG");
				a.setAttribute("mapnumber", this.number);
				a.setAttribute("id", this.number);
				var b = this.editor.document.createElement("DIV");
				b.setAttribute("id", "d" + this.number);
				if (this.WrapperClass !== "") {
					var c = this.editor.document.createElement("DIV");
					c.setAttribute("class", this.WrapperClass);
					this.editor.insertElement(c);
					c.append(b);
				} else {
					this.editor.insertElement(b);
				}
				b.append(a);
				return a.$;
			};
			f$$1.prototype.createDivs = function(a) {
				var b;
				var c = this.editor.document.$.createElement("DIV");
				c.setAttribute("id", "d" + this.number);
				a.parentNode.insertBefore(c, a);
				if (this.WrapperClass !== "") {
					b = this.editor.document.$.createElement("DIV");
					b.className = this.WrapperClass;
					c.parentNode.insertBefore(b, c);
					b.appendChild(c);
				}
				c.appendChild(a);
			};
			f$$1.prototype.updateHTMLElement = function(a) {
				this.editor.plugins.googleMapsHandler.maps[this.number] = this;
				a.setAttribute("width", this.width);
				a.setAttribute("height", this.height);
				var b = this.generateStaticMap();
				a.setAttribute("src", b);
				a.setAttribute("data-cke-saved-src", b);
				a.setAttribute("alt", "");
			};
			f$$1.prototype.getMapTypeIndex = function(a) {
				return CKEDITOR.tools.indexOf(["roadmap", "satellite", "hybrid", "terrain"], a);
			};
			f$$1.prototype.parseStaticMap = function(a) {
				var b;
				var c;
				var f = /(-?\d+\.\d*),(-?\d+\.\d*),(\w+)\|?/g;
				var i = /rgba:0x(\w{6})(\w\w),weight:(\d)(.*?)(&|$)/g;
				if (/center=(-?\d+\.\d*),(-?\d+\.\d*)&zoom=(\d+)&size=(\d+)x(\d+)&maptype=(.*?)(?:&markers=(.*?))?(&path=(?:.*?))?/.test(a.src)) {
					this.generatedType = 1;
					this.centerLat = RegExp.$1;
					this.centerLon = RegExp.$2;
					this.zoom = RegExp.$3;
					this.width = a.width;
					this.height = a.height;
					this.mapType = this.getMapTypeIndex(RegExp.$6);
					a = RegExp.$7;
					b = RegExp.$8;
					for (; c = f.exec(a);) {
						this.markerPoints.push({
							lat: c[1],
							lon: c[2],
							text: "",
							color: c[3],
							title: "",
							maxWidth: 200
						});
					}
					for (; c = i.exec(b);) {
						this.linesData.push({
							color: "#" + c[1],
							opacity: parseInt(c[2], 16) / 255,
							weight: parseInt(c[3], 10),
							PointsData: c[4],
							points: null,
							text: "",
							maxWidth: 200
						});
					}
				}
			};
			f$$1.prototype.parseStaticMap2 = function(a) {
				var b;
				var c;
				var f;
				f = /markers=color:(\w*)\|(-?\d+\.\d*),(-?\d+\.\d*)(&|$)/g;
				var i = /path=color:0x(\w{6})(\w\w)\|weight:(\d)\|(fillcolor:0x(\w{6})(\w\w)\|)?enc:(.*?)&pathData=zf:(\d*)\|nl:(\d*)\|lvl:(.*?)(&|$)/g;
				if (/center=(-?\d+\.\d*),(-?\d+\.\d*)&zoom=(\d+)&size=(\d+)x(\d+)&maptype=(\w*?)(&markers=.*?)?(&path=.*?)?&sensor=false/.test(a.src)) {
					this.generatedType = 1;
					this.centerLat = RegExp.$1;
					this.centerLon = RegExp.$2;
					this.zoom = RegExp.$3;
					this.width = a.width;
					this.height = a.height;
					this.mapType = this.getMapTypeIndex(RegExp.$6);
					b = RegExp.$7;
					a = RegExp.$8;
					for (; c = f.exec(b);) {
						this.markerPoints.push({
							lat: c[2],
							lon: c[3],
							text: "",
							color: c[1],
							title: "",
							maxWidth: 200
						});
					}
					for (; c = i.exec(a);) {
						f = {
							color: "#" + c[1],
							opacity: parseInt(c[2], 16) / 255,
							weight: parseInt(c[3], 10),
							points: unescape(c[7])
						};
						if (c[4]) {
							this.areasData.push({
								polylines: [f],
								fill: f.color,
								color: "#" + c[5],
								opacity: parseInt(c[6], 16) / 255,
								text: "",
								maxWidth: 200
							});
						} else {
							f.text = "";
							f.maxWidth = 200;
							this.linesData.push(f);
						}
					}
				} else {
					this.parseStaticMap(a);
				}
			};
			f$$1.prototype.generateStaticMap = function() {
				var a = Math.min(this.width, 640);
				var b = Math.min(this.height, 640);
				if (this.panorama) {
					var c = 180 / Math.pow(2, this.panorama.zoom);
					return "//maps.googleapis.com/maps/api/streetview?location=" + this.panorama.lat + "," + this.panorama.lng + "&size=" + a + "x" + b + "&heading=" + this.panorama.heading + "&pitch=" + this.panorama.pitch + "&fov=" + c + "&sensor=false";
				}
				a = "//maps.googleapis.com/maps/api/staticmap?center=" + this.centerLat + "," + this.centerLon + "&zoom=" + this.zoom + "&size=" + a + "x" + b + "&maptype=" + ["roadmap", "satellite", "hybrid", "terrain"][this.mapType];
				b = this.generateStaticMarkers();
				c = this.generateStaticPaths() + "&sensor=false";
				if ((a + b + c).length >= 1950) {
					b = this.generateStaticMarkers(true);
				}
				return a + b + c;
			};
			f$$1.prototype.generateStaticMarkers = function(a) {
				if (this.markerPoints.length === 0) {
					return "";
				}
				var b = 0;
				var c;
				var f = [];
				var i = this.editor.config.googleMaps_Icons;
				for (; b < this.markerPoints.length; b++) {
					c = this.markerPoints[b];
					f.push("&markers=");
					if (!a) {
						if (i && i[c.color]) {
							var h = i[c.color].marker.image;
							if (/:\/\/.*\..*\//.test(h)) {
								f.push("icon:" + h);
							} else {
								f.push("icon:" + c.color);
							}
						} else {
							f.push("color:" + c.color);
						}
					}
					f.push("|" + c.lat + "," + c.lon);
				}
				return f.join("");
			};
			f$$1.prototype.generateStaticPaths = function() {
				function a$$0(a) {
					a = Math.round(255 * a).toString(16);
					if (a.length == 1) {
						a = "0" + a;
					}
					return a;
				}
				var b = "";
				var c = 0;
				var f;
				var i;
				for (; c < this.linesData.length; c++) {
					f = this.linesData[c];
					b = b + ("&path=color:0x" + f.color.replace("#", "") + a$$0(f.opacity) + "|weight:" + f.weight + "|enc:" + f.points);
				}
				c = 0;
				for (; c < this.areasData.length; c++) {
					i = this.areasData[c];
					f = i.polylines[0];
					b = b + ("&path=color:0x" + f.color.replace("#", "") + a$$0(f.opacity) + "|weight:" + f.weight + "|fillcolor:0x" + i.color.replace("#", "") + a$$0(i.opacity) + "|enc:" + f.points);
				}
				return b;
			};
			f$$1.prototype.updateDimensions = function(a) {
				var b;
				var c;
				var f = /^\s*(\d+)px\s*$/i;
				var i;
				if (a.style.width) {
					if (i = a.style.width.match(f)) {
						b = i[1];
						a.style.width = "";
						a.width = b;
					}
				}
				if (a.style.height) {
					if (f = a.style.height.match(f)) {
						c = f[1];
						a.style.height = "";
						a.height = c;
					}
				}
				this.width = b ? b : a.width;
				this.height = c ? c : a.height;
			};
			f$$1.prototype.decodeText = function(a) {
				return a.replace(/<\\\//g, "</").replace(/\\n/g, "\n").replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
			};
			f$$1.prototype.encodeText = function(a) {
				return a.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/<\//g, "<\\/");
			};
			f$$1.prototype.parse = function(a) {
				if (!/CK googlemaps v(\d+)\.(\d+)/.test(a)) {
					return false;
				}
				var b = /google\.maps\.GeoXml\("([^"]*?)"\)/;
				var c = parseInt(RegExp.$1, 10);
				var f = parseInt(RegExp.$2, 10);
				var i = /dMap\s=\sdocument\.getElementById\("(.*?)"\)/;
				var h = /dMap\.style\.width\s=\s"(.*?)"/;
				var j = /dMap\.style\.height\s=\s"(.*?)"/;
				var k = /\/(?:\/|\*)generatedType = (\d)/;
				var n = /map\.setCenter\(new google\.maps\.LatLng\((-?\d{1,3}\.\d{1,6}),(-?\d{1,3}\.\d{1,6})\), (\d{1,2})\);/;
				var m;
				var q = 0;
				var o = 0;
				var l = /var text\s*=\s*("|')(.*)\1;\s*\n/;
				var r = /<div id="(.*)" style="width\:\s*(\d+)px; height\:\s*(\d+)px;/;
				var p = /var point\s*=\s*new GLatLng\((-?\d{1,3}\.\d{1,6}),(-?\d{1,3}\.\d{1,6})\)/;
				var t = /\{lat\:(-?\d{1,3}\.\d{1,6}),\s*lon\:(-?\d{1,3}\.\d{1,6}),\s*text\:("|')(.*?)\3(?:,\s*color:"(.*?)"(?:,\s*title:"(.*?)"(?:,\s*maxWidth:(\d+))?)?)?}(?:,|])/g;
				var w = "";
				var s = "";
				var v = /var encodedPoints\s*=\s*("|')(.*)\1;\s*\n/;
				var z = /var encodedLevels\s*=\s*("|')(.*)\1;\s*\n/;
				var u = "red";
				var x = "";
				var B = /\{color\:'(.*)',\s*weight:(\d+),\s*opacity:(-?\d\.\d{1,2}),\s*points\:'(.*?)',\s*levels\:'(.*?)',\s*zoomFactor:(\d+),\s*numLevels:(\d+),\s*text\:'(.*?)'(?:,\s*maxWidth:(\d+))?}(?:,|])/g;
				var H = /\{polylines:\s*\[\{color\:'(.*)',\s*opacity:(-?\d\.\d{1,2}),\s*weight:(\d+),\s*points\:'(.*)',\s*levels\:'(.*)',\s*zoomFactor:(\d+),\s*numLevels:(\d+)\}\],\s*fill:(.*),\s*color:'(.*)',\s*opacity:(-?\d\.\d{1,2}),\s*outline:(.*?),\s*text\:'(.*?)'(?:,\s*maxWidth:(\d+))?\}(?:,|])/g;
				var F = [];
				F = /\{lat\:(-?\d{1,3}\.\d{1,6}),\s*lon\:(-?\d{1,3}\.\d{1,6}),\s*title\:"(.*?)",\s*className:"(.*?)"}(?:,|])/g;
				var O = this.editor.plugins.googleMapsHandler;
				if (c > 3) {
					return false;
				}
				if (c > 2) {
					b = /AddKml\("([^"]*)"\)/;
				}
				if (c >= 3) {
					if (f >= 3) {
						t = /\{lat\:(-?\d{1,3}\.\d{1,6}),\s*lon\:(-?\d{1,3}\.\d{1,6}),\s*text\:("|')(.*?)\3,\s*color:"(.*?)",\s*title:"(.*?)",\s*maxWidth:(\d+),\s*open:(\d)}(?:,|])/g;
					}
				}
				if (c < 2) {
					if (r.test(a)) {
						delete O.maps[this.number];
						this.number = RegExp.$1;
						O.maps[this.number] = this;
						this.width = RegExp.$2;
						this.height = RegExp.$3;
					}
				} else {
					if (i.test(a)) {
						delete O.maps[this.number];
						this.number = RegExp.$1;
						O.maps[this.number] = this;
					}
					if (h.test(a)) {
						this.width = RegExp.$1.replace(/px$/, "");
					}
					if (j.test(a)) {
						this.height = RegExp.$1.replace(/px$/, "");
					}
					if (k.test(a)) {
						this.generatedType = RegExp.$1;
					}
				}
				if (c == 1) {
					n = /map\.setCenter\(new GLatLng\((-?\d{1,3}\.\d{1,6}),(-?\d{1,3}\.\d{1,6})\), (\d{1,2})\);/;
				}
				if (n.test(a)) {
					this.centerLat = RegExp.$1;
					this.centerLon = RegExp.$2;
					this.zoom = RegExp.$3;
				}
				if (c == 1 && f <= 5) {
					if (l.test(a)) {
						m = RegExp.$2;
					}
					if (p.test(a)) {
						q = RegExp.$1;
						o = RegExp.$2;
					}
					if (q !== 0) {
						if (o !== 0) {
							this.markerPoints.push({
								lat: q,
								lon: o,
								text: this.decodeText(m),
								color: "red",
								title: ""
							});
						}
					}
				} else {
					for (; i = t.exec(a);) {
						h = 200;
						j = false;
						if (i[5]) {
							u = i[5];
						}
						if (i[6]) {
							x = i[6];
						}
						if (i[7]) {
							h = i[7];
						}
						if (i[8]) {
							j = i[8] == "1";
						}
						this.markerPoints.push({
							lat: i[1],
							lon: i[2],
							text: this.decodeText(i[4]),
							color: u,
							title: this.decodeText(x),
							maxWidth: h,
							open: j
						});
					}
					for (; i = F.exec(a);) {
						this.textsData.push({
							lat: i[1],
							lon: i[2],
							title: this.decodeText(i[3]),
							className: this.decodeText(i[4])
						});
					}
				}
				if (c == 1) {
					this.requiresImage = true;
					if (v.test(a)) {
						w = RegExp.$2;
					}
					if (z.test(a)) {
						s = RegExp.$2;
					}
					if (w !== "") {
						if (s !== "") {
							this.linesData.push({
								color: "#3333cc",
								weight: 5,
								opacity: 0.45,
								points: w,
								text: "",
								maxWidth: 200
							});
						}
					}
				} else {
					if (c < 3 || c == 3 && f === 0) {
						for (; i = B.exec(a);) {
							this.linesData.push({
								color: i[1],
								weight: i[2],
								opacity: i[3],
								points: this.decodeText(i[4])
							});
						}
						for (; i = H.exec(a);) {
							F = [{
								color: i[1],
								weight: parseInt(i[3], 10),
								opacity: parseFloat(i[2]),
								points: this.decodeText(i[4])
							}];
							if (i[13]) {
								parseInt(i[13], 10);
							}
							this.areasData.push({
								polylines: F,
								fill: true,
								color: i[9],
								opacity: parseFloat(i[10])
							});
						}
					} else {
						if (c == 3 && f < 6) {
							B = /\{color\:("|')(.*)\1,\s*weight:(\d+),\s*opacity:(-?\d\.\d{1,2}),\s*points\:("|')(.*?)\5,\s*text\:("|')(.*?)\7,\s*maxWidth:(\d+)}(?:,|])/g;
							H = /\{polylines:\s*\[\{color\:("|')(.*)\1,\s*opacity:(-?\d\.\d{1,2}),\s*weight:(\d+),\s*points\:("|')(.*)\5}\],\s*fill:(.*),\s*color:("|')(.*)\8,\s*opacity:(-?\d\.\d{1,2}),\s*text\:("|')(.*?)\11,\s*maxWidth:(\d+)\}(?:,|])/g;
							for (; i = B.exec(a);) {
								this.linesData.push({
									color: i[2],
									weight: parseInt(i[3], 10),
									opacity: parseFloat(i[4]),
									points: this.decodeText(i[6])
								});
							}
							for (; i = H.exec(a);) {
								F = [{
									color: i[2],
									opacity: parseFloat(i[3]),
									weight: parseInt(i[4], 10),
									points: this.decodeText(i[6])
								}];
								this.areasData.push({
									polylines: F,
									color: i[9],
									opacity: parseFloat(i[10])
								});
							}
						} else {
							B = /\{color\:"(.*)",\s*weight:(\d+),\s*opacity:(-?\d\.\d{1,2}),\s*points\:"(.*?)"}(?:,|])/g;
							for (; i = B.exec(a);) {
								this.linesData.push({
									color: i[1],
									weight: parseInt(i[2], 10),
									opacity: parseFloat(i[3]),
									points: this.decodeText(i[4])
								});
							}
							H = /\{polylines:\s*\[\{color\:"(.*)",\s*opacity:(-?\d\.\d{1,2}),\s*weight:(\d+),\s*points\:"(.*)"}\],\s*color:"(.*)",\s*opacity:(-?\d\.\d{1,2})\}(?:,|])/g;
							for (; i = H.exec(a);) {
								F = [{
									color: i[1],
									opacity: parseFloat(i[2]),
									weight: parseInt(i[3], 10),
									points: this.decodeText(i[4])
								}];
								this.areasData.push({
									polylines: F,
									color: i[5],
									opacity: parseFloat(i[6])
								});
							}
							t = /\{lat\:(-?\d{1,3}\.\d{1,6}),\s*lon\:(-?\d{1,3}\.\d{1,6}),radius:(\d+),color\:"(.*)",\s*weight:(\d+),\s*opacity:(-?\d\.\d{1,2}),\s*fillColor:"(.*)",\s*fillOpacity:(-?\d\.\d{1,2})\}(?:,|])/g;
							for (; i = t.exec(a);) {
								this.circlesData.push({
									lat: i[1],
									lon: i[2],
									radius: parseInt(i[3], 10),
									color: i[4],
									weight: parseInt(i[5], 10),
									opacity: parseFloat(i[6]),
									fillColor: i[7],
									fillOpacity: parseFloat(i[8])
								});
							}
							if (/panorama:\{lat:(-?\d{1,3}\.\d+),lng:(-?\d{1,3}\.\d+),pov1:(\d+\.?\d*),pov2:(\d+\.?\d*),pov3:(\d+\.?\d*)\}/.test(a)) {
								t = {};
								t.lat = parseFloat(RegExp.$1);
								t.lng = parseFloat(RegExp.$2);
								t.heading = parseFloat(RegExp.$3);
								t.pitch = parseFloat(RegExp.$4);
								t.zoom = parseFloat(RegExp.$5);
								this.panorama = t;
							}
						}
					}
				}
				if (/setMapType\([^\[]*\[\s*(\d+)\s*\]\s*\)/.test(a)) {
					this.mapType = RegExp.$1;
				}
				if (c == 1 && f >= 9) {
					this.WrapperClass = /<div class=("|')(.*)\1.*\/\/wrapper/.test(a) ? RegExp.$2 : "";
				}
				if (b.test(a)) {
					this.kmlOverlay = RegExp.$1;
				}
				if (c == 2) {
					this.zoomControl = /google\.maps\.(.*)\(\)\);\/\*zoom\*\//.test(a) ? RegExp.$1 : "";
					this.mapTypeControl = /google\.maps\.(.*)\(\)\);\/\*type\*\//.test(a) ? RegExp.$1 : "";
					this.overviewMapControl = a.indexOf("OverviewMapControl") >= 0;
					this.scaleControl = a.indexOf("ScaleControl") >= 0;
					this.googleBar = a.indexOf("enableGoogleBar") >= 0;
					switch (this.zoomControl) {
						case "SmallZoomControl":
							this.zoomControl = "Small";
							break;
						case "SmallMapControl":
							this.zoomControl = "Small";
							break;
						case "LargeMapControl":
							this.zoomControl = "Full";
							break;
						default:
							this.zoomControl = "None";
					}
					switch (this.mapTypeControl) {
						case "MapTypeControl":
							this.mapTypeControl = "Full";
							break;
						case "HierarchicalMapTypeControl":
							this.mapTypeControl = "Menu";
							break;
						default:
							this.mapTypeControl = "None";
					}
				}
				if (c == 3) {
					if (/center:\s*\[(-?\d{1,3}\.\d{1,6}),(-?\d{1,3}\.\d{1,6})\],/.test(a)) {
						this.centerLat = RegExp.$1;
						this.centerLon = RegExp.$2;
					}
					if (/zoom: (\d{1,2}),/.test(a)) {
						this.zoom = parseInt(RegExp.$1, 10);
					}
					if (/mapType: (\d{1,2}),/.test(a)) {
						this.mapType = parseInt(RegExp.$1, 10);
					}
					if (/navigationControl: "(.*?)",/.test(a)) {
						this.zoomControl = RegExp.$1;
					}
					if (/zoomControl: "(.*?)",/.test(a)) {
						this.zoomControl = RegExp.$1;
					}
					if (/mapsControl: "(.*?)",/.test(a)) {
						this.mapTypeControl = RegExp.$1;
					}
					if (/overviewMapControl: (.*?),/.test(a)) {
						this.overviewMapControl = RegExp.$1 == "true";
					}
					if (/overviewMapControlOptions: \{opened:(.*?)\},/.test(a)) {
						this.overviewMapControlOpened = RegExp.$1 == "true";
					}
					if (/scaleControl: (.*?),/.test(a)) {
						this.scaleControl = RegExp.$1 == "true";
					}
					if (/traffic: (.*?),/.test(a) && RegExp.$1 == "true") {
						this.pathType = "Traffic";
					}
					if (/transit: (.*?),/.test(a) && RegExp.$1 == "true") {
						this.pathType = "Transit";
					}
					if (/pathType: "(.*?)",/.test(a)) {
						this.pathType = RegExp.$1;
					}
					if (/weather: (.*?),/.test(a)) {
						this.weather = RegExp.$1 == "true";
					}
					if (/weatherUsaUnits: (.*?),/.test(a)) {
						this.weatherUsaUnits = RegExp.$1 == "true";
					}
					if (/googleBar: (.*?)\n/.test(a)) {
						this.googleBar = RegExp.$1 == "true";
					}
					if (/heading: (\d{1,3}),/.test(a)) {
						this.heading = parseInt(RegExp.$1, 10);
					}
					if (/tilt: (\d{1,2}),/.test(a)) {
						this.tilt = parseInt(RegExp.$1, 10);
					}
					if (f >= 3) {
						if (!this.editor.config.googleMaps_Icons) {
							this.editor.config.googleMaps_Icons = {};
						}
						b = /googleMaps_Icons\["(.*?)"\] = ({.*?});/g;
						for (; i = b.exec(a);) {
							this.editor.config.googleMaps_Icons[i[1]] = JSON.parse(i[2]);
						}
					}
				}
				return true;
			};
			f$$1.prototype.cssWidth = function() {
				return /\d+\D+/.test(this.width) ? this.width : this.width + "px";
			};
			f$$1.prototype.cssHeight = function() {
				return /\d+\D+/.test(this.height) ? this.height : this.height + "px";
			};
			f$$1.prototype.BuildScript = function() {
				var a = this.editor.plugins.googleMapsHandler;
				var b = [];
				var c = [];
				var f;
				var i = [];
				var h = [];
				var j = [];
				var k = [];
				b.push('\r\n<script type="text/javascript">');
				b.push("/*<![CDATA[*/");
				b.push("/* CK googlemaps v" + a.majorVersion + "." + a.minorVersion + " */");
				b.push('var imgMap = document.getElementById("' + this.number + '"),');
				b.push('\tdMap = document.createElement("div");');
				b.push('dMap.id="w' + this.number + '";');
				b.push("imgMap.parentNode.insertBefore( dMap, imgMap);");
				b.push("dMap.appendChild(imgMap);");
				b.push('dMap.style.width = "' + this.cssWidth() + '";');
				b.push('dMap.style.height = "' + this.cssHeight() + '";');
				b.push("/*generatedType = " + this.generatedType + ";*/");
				if (this.generatedType == 2) {
					b.push('dMap.style.position = "relative";');
					b.push('dMap.style.cursor = "pointer";');
					b.push("dMap.onclick = function(e) {initGmapsLoader(e||event)};");
					b.push('var t = document.createTextNode("' + this.editor.lang.googlemaps.clickToLoad + '");');
					b.push('var d = document.createElement("div");');
					b.push("d.appendChild(t);");
					b.push('d.style.cssText="background-color:#e5e5e5; filter:alpha(opacity=80); opacity:0.8; padding:1em; font-weight:bold; text-align:center; position:absolute; left:0; width:' + this.width + 'px; top:0";');
					b.push("dMap.appendChild(d);");
				}
				b.push("function CreateGMap" + this.number + "() {");
				b.push('\tvar dMap = document.getElementById("' + this.number + '");');
				b.push("\tif (dMap) ");
				b.push("\t\tdMap = dMap.parentNode;");
				b.push("\telse ");
				b.push('\t\tdMap = document.getElementById("w' + this.number + '");');
				b.push("\tif (!dMap) return;");
				b.push("\tif (dMap.ckemap) {");
				b.push("\t\tvar map = dMap.ckemap.map, center = map.getCenter();");
				b.push('\t\tgoogle.maps.event.trigger(map, "resize");');
				b.push("\t\tmap.setCenter(center);");
				b.push("\t\treturn; ");
				b.push("\t} ");
				b.push("\tdMap.onclick = null;");
				b.push("\tvar mapOptions = {");
				b.push("\t\tzoom: " + this.zoom + ",");
				b.push("\t\tcenter: [" + this.centerLat + "," + this.centerLon + "],");
				b.push("\t\tmapType: " + this.mapType + ",");
				b.push('\t\tzoomControl: "' + this.zoomControl + '",');
				b.push('\t\tmapsControl: "' + this.mapTypeControl + '",');
				b.push("\t\theading: " + this.heading + ",");
				b.push("\t\ttilt: " + this.tilt + ",");
				if (this.overviewMapControl) {
					b.push("\t\toverviewMapControl: " + this.overviewMapControl + ",");
				}
				if (this.overviewMapControlOpened) {
					b.push("\t\toverviewMapControlOptions: {opened:" + this.overviewMapControlOpened + "},");
				}
				if (this.scaleControl) {
					b.push("\t\tscaleControl: " + this.scaleControl + ",");
				}
				if (this.weather) {
					b.push("\t\tweather: " + this.weather + ",");
				}
				if (this.weatherUsaUnits) {
					b.push("\t\tweatherUsaUnits: " + this.weatherUsaUnits + ",");
				}
				b.push('\t\tpathType: "' + this.pathType + '",');
				b.push("\t\tgoogleBar: " + this.googleBar);
				if (this.panorama) {
					a = this.panorama;
					b.push(", panorama:{lat:" + a.lat + ",lng:" + a.lng + ",pov1:" + a.heading + ",pov2:" + a.pitch + ",pov3:" + a.zoom + "}");
				}
				b.push("\t};");
				b.push("\tvar myMap = new CKEMap(dMap, mapOptions);");
				b.push("\tdMap.ckemap=myMap;");
				var n = this.editor.config.googleMaps_Icons;
				var m = {};
				if (this.markerPoints.length) {
					a = 0;
					for (; a < this.markerPoints.length; a++) {
						f = this.markerPoints[a];
						c.push("{lat:" + f.lat + ", lon:" + f.lon + ', text:"' + this.encodeText(f.text) + '",color:"' + f.color + '", title:"' + this.encodeText(f.title) + '", maxWidth:' + f.maxWidth + ", open:" + (f.open ? 1 : 0) + "}");
						if (n) {
							if (n[f.color]) {
								m[f.color] = n[f.color];
							}
						}
					}
					b.push("\tmyMap.AddMarkers( [" + c.join(",\r\n") + "] );");
				}
				if (this.textsData.length) {
					a = 0;
					for (; a < this.textsData.length; a++) {
						f = this.textsData[a];
						i.push("{lat:" + f.lat + ", lon:" + f.lon + ', title:"' + this.encodeText(f.title) + '", className:"' + this.encodeText(f.className) + '"}');
					}
					b.push("\tmyMap.AddTexts( [" + i.join(",\r\n") + "] );");
				}
				if (this.linesData.length) {
					a = 0;
					for (; a < this.linesData.length; a++) {
						c = this.linesData[a];
						h.push('{color:"' + c.color + '", weight:' + c.weight + ", opacity:" + c.opacity + ', points:"' + this.encodeText(c.points) + '"}');
					}
					b.push("\tmyMap.AddLines( [" + h.join(",\r\n") + "] );");
				}
				if (this.areasData.length) {
					a = 0;
					for (; a < this.areasData.length; a++) {
						h = this.areasData[a];
						c = h.polylines[0];
						j.push('{polylines: [{color:"' + c.color + '", opacity:' + c.opacity + ", weight:" + c.weight + ', points:"' + this.encodeText(c.points) + '"}], color:"' + h.color + '", opacity:' + h.opacity + "}");
					}
					b.push("\tmyMap.AddAreas( [" + j.join(",\r\n") + "] );");
				}
				if (this.circlesData.length) {
					a = 0;
					for (; a < this.circlesData.length; a++) {
						j = this.circlesData[a];
						k.push("{lat:" + j.lat + ",lon:" + j.lon + ",radius:" + j.radius + ',color:"' + j.color + '",weight:' + j.weight + ",opacity:" + j.opacity + ',fillColor:"' + j.fillColor + '",fillOpacity:' + j.fillOpacity + "}");
					}
					b.push("\tmyMap.AddCircles( [" + k.join(",\r\n") + "] );");
				}
				if (this.kmlOverlay) {
					b.push('\tmyMap.AddKml("' + this.kmlOverlay + '");');
				}
				b.push("}");
				b.push("");
				if (!CKEDITOR.tools.isEmpty(m)) {
					b.push("if (!window.googleMaps_Icons) window.googleMaps_Icons = {};");
					var q;
					for (q in m) {
						if (m.hasOwnProperty(q)) {
							b.push('window.googleMaps_Icons["' + q + '"] = ' + JSON.stringify(m[q]) + ";");
						}
					}
				}
				b.push("if (!window.gmapsLoaders) window.gmapsLoaders = [];");
				b.push("window.gmapsLoaders.push(CreateGMap" + this.number + ");");
				if (this.generatedType == 3) {
					b.push("window.gmapsAutoload=true;");
				}
				if (this.linesData.length || this.areasData.length) {
					b.push("window.gmapsGeometry=true;");
				}
				if (this.weather) {
					b.push("window.gmapsWeather=true;");
				}
				if (this.key) {
					b.push('window.gmapsKey="' + this.key + '";');
				}
				b.push("/*]]\x3e*/");
				b.push("\x3c/script>");
				return b.join("\r\n");
			};
			CKEDITOR.plugins.add("googlemaps", {
				requires: ["dialog"],
				lang: ["en", "ar", "cs", "de", "el", "es", "fi", "fr", "it", "nl", "pl", "ru", "sk", "tr"],
				beforeInit: function() {},
				init: function(a) {
					a.plugins.googleMapsHandler = new b$$1(a);
					var c$$0 = "div[id];img[id,src,style];script";
					if (a.config.googleMaps_WrapperClass) {
						c$$0 = c$$0 + (";div(" + a.config.googleMaps_WrapperClass + ")");
					}
					a.addCommand("googlemaps", new CKEDITOR.dialogCommand("googlemaps", {
						allowedContent: c$$0,
						requiredContent: "script"
					}));
					a.ui.addButton("GoogleMaps", {
						label: a.lang.googlemaps.toolbar,
						command: "googlemaps",
						toolbar: "insert"
					});
					CKEDITOR.dialog.add("googlemaps", this.path + "dialogs/googlemaps.js");
					CKEDITOR.dialog.add("googlemapsMarker", this.path + "dialogs/marker.js");
					CKEDITOR.dialog.add("googlemapsIcons", this.path + "dialogs/icons.js");
					CKEDITOR.dialog.add("googlemapsText", this.path + "dialogs/text.js");
					CKEDITOR.dialog.add("googlemapsLine", this.path + "dialogs/line.js");
					CKEDITOR.dialog.add("googlemapsArea", this.path + "dialogs/area.js");
					if (a.addMenuItems) {
						a.addMenuItems({
							googlemaps: {
								label: a.lang.googlemaps.menu,
								command: "googlemaps",
								group: "image",
								order: 1
							}
						});
					}
					if (a.contextMenu) {
						a.contextMenu._.listeners.unshift(function(b) {
							if (!b || (!b.is("img") || !a.plugins.googleMapsHandler.isStaticImage(b.$))) {
								return null;
							}
							b.data("cke-realelement", "1");
							return null;
						});
						a.contextMenu.addListener(function(b) {
							if (!b || (!b.is("img") || !a.plugins.googleMapsHandler.isStaticImage(b.$))) {
								return null;
							}
							b.data("cke-realelement", false);
							return {
								googlemaps: CKEDITOR.TRISTATE_ON
							};
						});
					}
					a.on("doubleclick", function(b) {
						var c = b.data.element;
						if (c.is("img") && a.plugins.googleMapsHandler.isStaticImage(c.$)) {
							b.data.dialog = "googlemaps";
						}
					});
				},
				afterInit: function(a$$1) {
					c$$1(a$$1);
					a$$1.openNestedDialog = function(b, c$$0, f) {
						var i = function() {
							j(this);
							if (f) {
								f(this);
							}
						};
						var h = function() {
							j(this);
						};
						var j = function(a) {
							a.removeListener("ok", i);
							a.removeListener("cancel", h);
						};
						var k = function(a) {
							a.on("ok", i);
							a.on("cancel", h);
							if (c$$0) {
								c$$0(a);
							}
						};
						if (a$$1._.storedDialogs[b]) {
							k(a$$1._.storedDialogs[b]);
						} else {
							CKEDITOR.on("dialogDefinition", function(a$$0) {
								if (a$$0.data.name == b) {
									var c = a$$0.data.definition;
									a$$0.removeListener();
									c.onLoad = typeof c.onLoad == "function" ? CKEDITOR.tools.override(c.onLoad, function(a) {
										return function() {
											c.onLoad = a;
											if (typeof a == "function") {
												a.call(this);
											}
											k(this);
										};
									}) : function() {
										k(this);
									};
								}
							});
						}
						a$$1.openDialog(b);
					};
					if (CKEDITOR.env.ie) {
						CKEDITOR.dialog.prototype.hide = CKEDITOR.tools.override(CKEDITOR.dialog.prototype.hide, function(a) {
							return function() {
								var b = this._.parentDialog;
								a.call(this);
								if (b && (this._.editor != b._.editor && this._.editor.mode == "wysiwyg")) {
									if (b = this._.editor.getSelection()) {
										b.unlock(true);
									}
								}
							};
						});
					}
				}
			});
			if (CKEDITOR.skins) {
				CKEDITOR.plugins.setLang = CKEDITOR.tools.override(CKEDITOR.plugins.setLang, function(a) {
					return function(b, c, f) {
						if (b != "devtools" && typeof f[b] != "object") {
							var i = {};
							i[b] = f;
							f = i;
						}
						a.call(this, b, c, f);
					};
				});
			}
		})();
		CKEDITOR.config.plugins = "basicstyles,dialogui,dialog,colordialog,clipboard,panel,floatpanel,menu,contextmenu,elementspath,enterkey,entities,popup,filebrowser,floatingspace,htmlwriter,image,justify,fakeobjects,link,maximize,preview,resize,selectall,sourcearea,button,toolbar,undo,wysiwygarea,googlemaps";
		CKEDITOR.config.skin = "alive";
		(function() {
			var b$$0 = function(b, c) {
				var a = CKEDITOR.getUrl("plugins/" + c);
				b = b.split(",");
				var d = 0;
				for (; d < b.length; d++) {
					CKEDITOR.skin.icons[b[d]] = {
						path: a,
						offset: -b[++d],
						bgsize: b[++d]
					};
				}
			};
			if (CKEDITOR.env.hidpi) {
				b$$0("bold,0,,italic,24,,strike,48,,subscript,72,,superscript,96,,underline,120,,copy-rtl,144,,copy,168,,cut-rtl,192,,cut,216,,paste-rtl,240,,paste,264,,gmapsinsertdirections,576,auto,googlemaps,624,auto,image,336,,justifyblock,360,,justifycenter,384,,justifyleft,408,,justifyright,432,,anchor-rtl,456,,anchor,480,,link,504,,unlink,528,,maximize,552,,preview-rtl,576,,preview,600,,selectall,624,,source-rtl,648,,source,672,,redo-rtl,696,,redo,720,,undo-rtl,744,,undo,768,", "icons_hidpi.png");
			} else {
				b$$0("bold,0,auto,italic,24,auto,strike,48,auto,subscript,72,auto,superscript,96,auto,underline,120,auto,copy-rtl,144,auto,copy,168,auto,cut-rtl,192,auto,cut,216,auto,paste-rtl,240,auto,paste,264,auto,gmapsinsertdirections,288,auto,googlemaps,312,auto,image,336,auto,justifyblock,360,auto,justifycenter,384,auto,justifyleft,408,auto,justifyright,432,auto,anchor-rtl,456,auto,anchor,480,auto,link,504,auto,unlink,528,auto,maximize,552,auto,preview-rtl,576,auto,preview,600,auto,selectall,624,auto,source-rtl,648,auto,source,672,auto,redo-rtl,696,auto,redo,720,auto,undo-rtl,744,auto,undo,768,auto",
					"icons.png");
			}
		})();
		CKEDITOR.lang.languages = {
			en: 1,
			ar: 1,
			cs: 1,
			de: 1,
			el: 1,
			es: 1,
			fi: 1,
			fr: 1,
			it: 1,
			nl: 1,
			pl: 1,
			ru: 1,
			sk: 1,
			tr: 1
		};
	}
})();
CKEDITOR.dialog.add("googlemaps", function(b$$0) {
	function f$$0(a) {
		this.setValues(a);
		var b = a.marker;
		if (b) {
			this.setValues({
				map: b.getMap()
			});
			this.bindTo("position", b);
			this.bindTo("title", b);
		}
		b = this.span_ = document.createElement("span");
		b.style.cssText = "white-space:nowrap; border:1px solid #999; padding:2px; background-color:white";
		if (a.className) {
			b.className = a.className;
		}
		a = this.div_ = document.createElement("div");
		a.appendChild(b);
		a.style.cssText = "position: absolute; display: none";
	}

	function c$$1() {
		f$$0.prototype = new google.maps.OverlayView;
		f$$0.prototype.onAdd = function() {
			this.getPanes().overlayLayer.appendChild(this.div_);
			var a = this;
			this.listeners_ = [google.maps.event.addListener(this, "position_changed", function() {
				a.draw();
			}), google.maps.event.addListener(this, "title_changed", function() {
				a.draw();
			})];
		};
		f$$0.prototype.onRemove = function() {
			this.div_.parentNode.removeChild(this.div_);
			var a = 0;
			var b = this.listeners_.length;
			for (; a < b; ++a) {
				google.maps.event.removeListener(this.listeners_[a]);
			}
		};
		f$$0.prototype.draw = function() {
			var a = this.getProjection().fromLatLngToDivPixel(this.get("position"));
			var b = this.div_;
			var c = this.get("title");
			b.style.left = a.x + "px";
			b.style.top = a.y + "px";
			b.style.display = "block";
			if (c) {
				this.span_.innerHTML = c.toString();
			}
		};
	}

	function a$$1() {
		if (window.google) {
			if (window.google.maps && (google.maps.drawing && (google.maps.geometry && google.maps.weather))) {
				e$$0();
				return;
			}
			if (window.google.load) {
				d$$1();
				return;
			}
		}
		window.CKE_googleMaps_callback = function() {
			e$$0();
		};
		var a = document.createElement("script");
		var b = "";
		if ("file:" == location.protocol) {
			b = "http:";
		}
		a.src = b + "//maps.googleapis.com/maps/api/js?sensor=false&libraries=drawing,geometry,places,weather&callback=CKE_googleMaps_callback";
		if (y.key) {
			a.src += "&key=" + y.key;
		}
		a.type = "text/javascript";
		document.getElementsByTagName("head")[0].appendChild(a);
	}

	function d$$1() {
		var a = "";
		if (y.key) {
			a = "&key=" + y.key;
		}
		window.google.load("maps", "3", {
			callback: e$$0,
			other_params: "sensor=false&libraries=drawing,geometry,places,weather" + a
		});
	}

	function e$$0() {
		window.CKE_googleMaps_callback = null;
		c$$1();
		R = document.getElementById(N);
		h$$0();
		na = [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.TERRAIN];
		aa = true;
		var a$$0 = new google.maps.LatLng(y.centerLat, y.centerLon);
		a$$0 = {
			zoom: parseInt(y.zoom, 10),
			center: a$$0,
			mapTypeId: na[y.mapType],
			heading: y.heading,
			tilt: y.tilt
		};
		C = new google.maps.Map(R, a$$0);
		if (y.panorama) {
			a$$0 = y.panorama;
			var d$$0 = C.getStreetView();
			d$$0.setVisible(true);
			d$$0.setPov({
				heading: a$$0.heading,
				pitch: a$$0.pitch,
				zoom: a$$0.zoom
			});
			d$$0.setPosition(new google.maps.LatLng(a$$0.lat, a$$0.lng));
		}
		a$$0 = {
			editable: true
		};
		$ = new google.maps.drawing.DrawingManager({
			drawingControl: false,
			polylineOptions: a$$0,
			rectangleOptions: a$$0,
			circleOptions: a$$0,
			polygonOptions: a$$0,
			map: C
		});
		google.maps.event.addListener($, "overlaycomplete", function(a) {
			if (a.type == google.maps.drawing.OverlayType.POLYLINE) {
				var b = a.overlay;
				b.OverlayType = "polyline";
				W.push(b);
			}
			if (a.type == google.maps.drawing.OverlayType.POLYGON) {
				a = a.overlay;
				a.OverlayType = "polygon";
				T.push(a);
			}
			M();
		});
		j(I.getContentElement("Options", "cmbMapTypes"));
		k(I.getContentElement("Options", "cmbZoomControl"));
		q(I.getContentElement("Options", "chkScale"));
		o(I.getContentElement("Options", "chkOverviewMap"));
		C.setOptions({
			overviewMapControlOptions: {
				opened: y.overviewMapControlOpened
			}
		});
		n(I.getContentElement("Options", "chkWeather"));
		m(I.getContentElement("Options", "cmbPathType"));
		var e;
		var f;
		var s;
		var t;
		var v;
		V = [];
		W = [];
		T = [];
		X = [];
		ba = [];
		ca = D = null;
		P = "";
		e = y.markerPoints;
		a$$0 = 0;
		for (; a$$0 < e.length; a$$0++) {
			f = e[a$$0];
			d$$0 = new google.maps.LatLng(parseFloat(f.lat), parseFloat(f.lon));
			u(d$$0, f.text, f.color, f.title, f.maxWidth, false, f.open);
		}
		e = y.textsData;
		a$$0 = 0;
		for (; a$$0 < e.length; a$$0++) {
			d$$0 = new google.maps.LatLng(parseFloat(e[a$$0].lat), parseFloat(e[a$$0].lon));
			J(d$$0, e[a$$0].title, e[a$$0].className, false);
		}
		e = y.linesData;
		a$$0 = 0;
		for (; a$$0 < e.length; a$$0++) {
			d$$0 = e[a$$0];
			if (d$$0.points) {
				s = google.maps.geometry.encoding.decodePath(d$$0.points);
			} else {
				f = d$$0.PointsData.split("|");
				s = [];
				t = 1;
				for (; t < f.length; t++) {
					v = f[t].split(",");
					s.push(new google.maps.LatLng(parseFloat(v[0]), parseFloat(v[1])));
				}
			}
			d$$0 = new google.maps.Polyline({
				map: C,
				path: s,
				strokeColor: d$$0.color,
				strokeOpacity: d$$0.opacity,
				strokeWeight: d$$0.weight,
				clickable: false
			});
			d$$0.OverlayType = "polyline";
			W.push(d$$0);
		}
		e = y.areasData;
		a$$0 = 0;
		for (; a$$0 < e.length; a$$0++) {
			f = e[a$$0];
			d$$0 = f.polylines[0];
			d$$0 = new google.maps.Polygon({
				map: C,
				paths: google.maps.geometry.encoding.decodePath(d$$0.points),
				strokeColor: d$$0.color,
				strokeOpacity: d$$0.opacity,
				strokeWeight: d$$0.weight,
				fillColor: f.color,
				fillOpacity: f.opacity,
				clickable: false
			});
			d$$0.OverlayType = "polygon";
			T.push(d$$0);
		}
		e = y.circlesData;
		a$$0 = 0;
		for (; a$$0 < e.length; a$$0++) {
			f = e[a$$0];
			d$$0 = new google.maps.LatLng(parseFloat(f.lat), parseFloat(f.lon));
			d$$0 = new google.maps.Circle({
				map: C,
				center: d$$0,
				radius: parseInt(f.radius, 10),
				strokeColor: f.color,
				strokeOpacity: f.opacity,
				strokeWeight: f.weight,
				fillColor: f.fillColor,
				fillOpacity: f.fillOpacity,
				clickable: false
			});
			d$$0.OverlayType = "circle";
			ba.push(d$$0);
		}
		Q();
		google.maps.event.addListener(C, "click", function(a) {
			if ("EditLine" == P) {
				M();
			} else {
				if ("AddMarker" == P && u(a.latLng, b$$0.config.googleMaps_MarkerText || E.defaultMarkerText, p(), E.defaultTitle, 200, true), "AddText" == P && J(a.latLng, E.defaultTitle, "MarkerTitle", true), "AddCircle" == P) {
					var c = 250 * Math.pow(2, 15) / Math.pow(2, C.getZoom());
					var d = $.get("circleOptions");
					d.strokeColor = r(google.maps.drawing.OverlayType.CIRCLE);
					d.strokeOpacity = 0.7;
					d.strokeWeight = 2;
					d.fillColor = d.strokeColor;
					d.fillOpacity = 0.2;
					d.center = a.latLng;
					d.radius = c;
					d.map = C;
					a = new google.maps.Circle(d);
					a.OverlayType = "circle";
					ba.push(a);
					M();
				}
			}
		});
		google.maps.event.addListener(C, "projection_changed", function() {
			oa = new google.maps.OverlayView;
			oa.draw = function() {};
			oa.setMap(C);
		});
		a$$0 = I.getContentElement("Info", "searchDirection").getInputElement().$;
		a$$0 = new google.maps.places.Autocomplete(a$$0);
		a$$0.bindTo("bounds", C);
		google.maps.event.addListener(a$$0, "place_changed", function() {
			l();
		});
		aa = false;
		if (CKEDITOR.env.ie7Compat) {
			i();
		}
		if (CKEDITOR.env.ie6Compat) {
			g$$0();
		}
	}

	function g$$0() {
		var a = document.getElementById(N);
		a.style.position = "relative";
		a.style.top = "80px";
	}

	function i() {
		var a = document.getElementById(N);
		a.style.position = "";
		a.parentNode.style.position = "relative";
		window.setTimeout(function() {
			a.style.position = "relative";
			a.parentNode.style.position = "";
		}, 0);
	}

	function h$$0() {
		R.style.width = I.getValueOf("Info", "txtWidth") + "px";
		R.style.height = I.getValueOf("Info", "txtHeight") + "px";
		if (C) {
			google.maps.event.trigger(C, "resize");
		}
	}

	function j(a) {
		var b;
		switch (a.getValue()) {
			case "None":
				b = "None";
				break;
			case "Default":
				b = google.maps.MapTypeControlStyle.DEFAULT;
				break;
			case "Full":
				b = google.maps.MapTypeControlStyle.HORIZONTAL_BAR;
				break;
			case "Menu":
				b = google.maps.MapTypeControlStyle.DROPDOWN_MENU;
		}
		if ("None" == b) {
			C.setOptions({
				mapTypeControl: false
			});
		} else {
			C.setOptions({
				mapTypeControl: true,
				mapTypeControlOptions: {
					style: b
				}
			});
		}
	}

	function k(a) {
		var b;
		switch (a.getValue()) {
			case "None":
				b = "None";
				break;
			case "Default":
				b = google.maps.ZoomControlStyle.DEFAULT;
				break;
			case "Full":
				b = google.maps.ZoomControlStyle.ZOOM_PAN;
				break;
			case "Small":
				b = google.maps.ZoomControlStyle.SMALL;
		}
		if ("None" == b) {
			C.setOptions({
				zoomControl: false,
				panControl: false,
				streetViewControl: false,
				rotateControl: false
			});
		} else {
			C.setOptions({
				zoomControl: true,
				panControl: true,
				streetViewControl: true,
				rotateControl: true,
				zoomControlOptions: {
					style: b
				}
			});
		}
	}

	function n(a) {
		if (!pa) {
			var b = {};
			if (y.weatherUsaUnits) {
				b = {
					temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT,
					windSpeedUnits: google.maps.weather.WindSpeedUnit.MILES_PER_HOUR
				};
			}
			pa = new google.maps.weather.WeatherLayer(b);
		}
		pa.setMap(a.getValue() ? C : null);
	}

	function m(a) {
		switch (qa) {
			case "Traffic":
				ka.setMap(null);
				break;
			case "Transit":
				la.setMap(null);
				break;
			case "Bicycle":
				ma.setMap(null);
		}
		qa = a.getValue();
		switch (qa) {
			case "Traffic":
				if (!ka) {
					ka = new google.maps.TrafficLayer;
				}
				ka.setMap(C);
				break;
			case "Transit":
				if (!la) {
					la = new google.maps.TransitLayer;
				}
				la.setMap(C);
				break;
			case "Bicycle":
				if (!ma) {
					ma = new google.maps.BicyclingLayer;
				}
				ma.setMap(C);
		}
	}

	function q(a) {
		C.setOptions({
			scaleControl: a.getValue()
		});
	}

	function o(a) {
		C.setOptions({
			overviewMapControl: a.getValue()
		});
	}

	function l() {
		var a = I.getValueOf("Info", "searchDirection");
		if (!ra) {
			ra = new google.maps.Geocoder;
		}
		ra.geocode({
			address: a
		}, function(b, c) {
			if (c == google.maps.GeocoderStatus.OK) {
				C.setCenter(b[0].geometry.location);
				u(b[0].geometry.location, a, p(), E.defaultTitle, 200, false);
			} else {
				alert("Geocode was not successful for the following reason: " + c);
			}
		});
	}

	function r(a) {
		if (b$$0.config.googleMaps_newOverlayColor) {
			return "String" == typeof b$$0.config.googleMaps_newOverlayColor ? b$$0.config.googleMaps_newOverlayColor : b$$0.config.googleMaps_newOverlayColor(a);
		}
		Y += 1;
		return ea[Y % ea.length];
	}

	function p() {
		if (b$$0.config.googleMaps_newMarkerColor) {
			return "String" == typeof b$$0.config.googleMaps_newMarkerColor ? b$$0.config.googleMaps_newMarkerColor : b$$0.config.googleMaps_newMarkerColor();
		}
		fa += 1;
		return ga[fa % ga.length];
	}

	function t$$0(a) {
		var b = Z && Z[a];
		return !b ? "//maps.gstatic.com/mapfiles/ms/micons/" + a + "-dot.png" : b.marker.image;
	}

	function w(a) {
		var b = P;
		M();
		if (b == a) {
			P = "";
		} else {
			switch (P = a, P) {
				case "AddMarker":
					K("btnAddNewMarker", true);
					z("crosshair");
					break;
				case "AddLine":
					K("btnAddNewLine", true);
					a = $.get("polylineOptions");
					a.strokeColor = r(google.maps.drawing.OverlayType.POLYLINE);
					a.strokeOpacity = 0.8;
					a.strokeWeight = 4;
					$.set("polylineOptions", a);
					$.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
					break;
				case "AddArea":
					K("btnAddNewArea", true);
					a = $.get("polygonOptions");
					a.strokeColor = r(google.maps.drawing.OverlayType.POLYGON);
					a.strokeOpacity = 0.7;
					a.strokeWeight = 2;
					a.fillColor = a.strokeColor;
					a.fillOpacity = 0.2;
					$.set("polygonOptions", a);
					$.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
					break;
				case "AddCircle":
					K("btnAddNewCircle", true);
					z("crosshair");
					break;
				case "AddText":
					K("btnAddNewText", true);
					z("crosshair");
			}
		}
	}

	function s$$0(a$$0) {
		a$$0.setOptions({
			clickable: true
		});
		google.maps.event.addListener(a$$0, "mouseover", function() {
			if ("" === P) {
				if (a$$0 != ja) {
					w("EditLine");
					ja = a$$0;
					a$$0.setEditable(true);
				}
			}
		});
		google.maps.event.addListener(a$$0, "click", function(c$$0) {
			if ("Add" == P.substr(0, 3)) {
				google.maps.event.trigger(C, "click", c$$0);
			} else {
				D = a$$0;
				b$$0.openNestedDialog("googlemapsLine", function(a) {
					var b = D;
					var c = {
						strokeColor: b.strokeColor,
						strokeOpacity: b.strokeOpacity.toFixed(1),
						strokeWeight: b.strokeWeight
					};
					if ("polygon" == D.OverlayType || "circle" == D.OverlayType) {
						c.fillColor = b.fillColor;
						c.fillOpacity = b.fillOpacity.toFixed(1);
					}
					a.setValues(c);
					a.onRemoveOverlay = O;
				}, function(a) {
					a = a.getValues();
					D.setOptions(a);
				});
			}
		});
		if ("polygon" == a$$0.OverlayType || "polyline" == a$$0.OverlayType) {
			google.maps.event.addListener(a$$0, "rightclick", function(b) {
				if (null != b.vertex) {
					var c = "polyline" == a$$0.OverlayType ? 2 : 3;
					if (a$$0.getPath().getLength() == c) {
						D = a$$0;
						O();
					} else {
						a$$0.getPath().removeAt(b.vertex);
					}
				}
			});
		}
	}

	function v$$0(a) {
		a.setOptions({
			clickable: false
		});
		google.maps.event.clearListeners(a, "click");
		google.maps.event.clearListeners(a, "rightclick");
		google.maps.event.clearListeners(a, "mouseover");
	}

	function z(a) {
		C.setOptions({
			draggableCursor: a
		});
	}

	function u(a, b, c, d, e, g, h) {
		a = new google.maps.Marker({
			position: a,
			map: C,
			title: d,
			icon: t$$0(c),
			draggable: true
		});
		a.text = b;
		a.color = c;
		a.maxWidth = e;
		if ("" !== d) {
			b = new f$$0({
				marker: a,
				className: "MarkerTitle"
			});
			a.label = b;
		}
		google.maps.event.addListener(a, "click", function() {
			x(this);
		});
		V.push(a);
		M();
		if (g) {
			x(a);
		} else {
			a.setOptions({
				draggable: false
			});
			if (h) {
				x(a);
			}
		}
	}

	function x(a) {
		if (a.getDraggable()) {
			D = a;
			P = "EditMarker";
			b$$0.openNestedDialog("googlemapsMarker", B, H);
		} else {
			if (a.text) {
				var c = '<div class="InfoContent">' + a.text + "</div>";
				if (!a._infoWindow) {
					a._infoWindow = new google.maps.InfoWindow({
						maxWidth: a.maxWidth
					});
				}
				a._infoWindow.setContent(c);
				a._infoWindow.open(C, a);
			}
		}
	}

	function B(a) {
		a.setValues(D);
		a.onRemoveMarker = F;
	}

	function H(a) {
		a = a.getValues();
		D.text = a.text;
		D.maxWidth = a.maxWidth;
		var b = a.title;
		var c = D.label;
		D.setTitle(b);
		D.color = a.color;
		D.setIcon(t$$0(a.color));
		if ("" !== b) {
			if (!c) {
				c = new f$$0({
					marker: D,
					className: "MarkerTitle"
				});
				D.label = c;
			}
		} else {
			if (c) {
				c.setMap(null);
				D.label = null;
			}
		}
	}

	function F() {
		var a = 0;
		for (; a < V.length; a++) {
			if (V[a] == D) {
				V.splice(a, 1);
				break;
			}
		}
		if (D.label) {
			D.label.setMap(null);
			D.label = null;
		}
		D.setMap(null);
		G();
	}

	function O() {
		var a;
		switch (D.OverlayType) {
			case "polyline":
				a = W;
				break;
			case "polygon":
				a = T;
				break;
			case "circle":
				a = ba;
		}
		var b = 0;
		for (; b < a.length; b++) {
			if (a[b] == D) {
				a.splice(b, 1);
				break;
			}
		}
		v$$0(D);
		D.setMap(null);
		G();
	}

	function G() {
		P = "";
		D = null;
	}

	function J(a, c, d, e) {
		a = new google.maps.Marker({
			position: a,
			map: C,
			title: c,
			icon: b$$0.plugins.googlemaps.path + "images/TextIcon.png",
			draggable: true
		});
		a.className = d;
		if ("" !== c) {
			c = new f$$0({
				marker: a,
				className: d
			});
			a.label = c;
		}
		google.maps.event.addListener(a, "click", function() {
			A(this);
		});
		X.push(a);
		M();
		if (e) {
			A(a);
		} else {
			a.setVisible(false);
		}
	}

	function A(a) {
		if (a.getDraggable()) {
			D = a;
			P = "EditText";
			b$$0.openNestedDialog("googlemapsText", function(b) {
				b.setValues({
					title: a.get("title")
				});
			}, S);
		}
	}

	function S(a) {
		a = a.getValues().title;
		var b = D.label;
		D.setTitle(a);
		if ("" !== a) {
			if (!b) {
				b = new f$$0({
					marker: D,
					className: "MarkerTitle"
				});
				D.label = b;
			}
		} else {
			a = 0;
			for (; a < X.length; a++) {
				if (X[a] == D) {
					X.splice(a, 1);
					break;
				}
			}
			if (D.label) {
				D.label.setMap(null);
				D.label = null;
			}
			D.setMap(null);
		}
		G();
	}

	function K(a, b) {
		I.getContentElement("Elements", a).getElement()[b ? "addClass" : "removeClass"]("GMapsButtonActive");
	}

	function M() {
		if ($) {
			$.setDrawingMode(null);
		}
		if (ja) {
			ja.setEditable(false);
			ja = null;
		}
		if ("" !== P) {
			var a;
			switch (P) {
				case "AddLine":
					K("btnAddNewLine", false);
					if (a = W[W.length - 1]) {
						a.setEditable(false);
						s$$0(a);
					}
					P = "";
					break;
				case "AddArea":
					K("btnAddNewArea", false);
					if (a = T[T.length - 1]) {
						a.setEditable(false);
						s$$0(a);
					}
					P = "";
					break;
				case "AddMarker":
					K("btnAddNewMarker", false);
					z("");
					break;
				case "AddCircle":
					K("btnAddNewCircle", false);
					if (a = ba[ba.length - 1]) {
						a.setEditable(false);
						s$$0(a);
					}
					P = "";
					z("");
					break;
				case "AddText":
					K("btnAddNewText", false);
					z("");
					break;
				case "EditMarker":
					G();
					break;
				case "EditText":
					G();
					break;
				case "EditLine":
					G();
			}
		}
	}

	function ha(a, b) {
		var c = {
			color: a.strokeColor,
			opacity: a.strokeOpacity,
			weight: a.strokeWeight
		};
		var d = a.getPath();
		var e = d.getLength();
		if (2 > e) {
			return null;
		}
		if (b) {
			var f = d.getAt(0);
			e = d.getAt(e - 1);
			if (!f.equals(e)) {
				d.push(f);
			}
		}
		c.points = google.maps.geometry.encoding.encodePath(d);
		return c;
	}

	function da(a) {
		var b = document.createElement("IMG");
		b.src = a;
		return a = b.src;
	}

	function Q(a) {
		var b = I.getContentElement("Elements", "txtKMLUrl");
		if (b && (a = a && "string" == typeof a ? a : b.getValue(), b.lastUrl != a)) {
			b.lastUrl = a;
			if (ca) {
				if (ca.url == a) {
					return;
				}
				ca.setMap(null);
				ca = null;
			}
			if (a) {
				var c = /:\/\/(.*?)\//.exec(a);
				var d;
				if (!c) {
					a = da(a);
					d = true;
					c = /:\/\/(.*?)\//.exec(a);
				}
				if (-1 == c[1].indexOf(".")) {
					return window.setTimeout(function() {
						alert("Error: You must provide a public server in the url of KML files.");
					}, 500), b.lastUrl = "", false;
				}
				ca = new google.maps.KmlLayer(a, {
					map: C
				});
				if (d) {
					b.lastUrl = a;
					b.setValue(a);
					I.showPage("Elements");
					I.getContentElement("Elements", "KMLContainer").getElement().show();
				}
			}
		}
	}

	function L() {
		var a = I.parts.contents;
		var b = document.getElementById("Wrapper" + N);
		b.style.width = a.$.style.width;
		b.style.height = parseInt(a.$.style.height, 10) - 90 + "px";
	}
	var N = "GMapPreview" + CKEDITOR.tools.getNextNumber();
	var R;
	var ea = b$$0.config.googleMaps_overlayColors || "#880000 #008800 #000088 #888800 #880088 #008888 #000000 #888888".split(" ");
	var Y = -1;
	var ga = b$$0.config.googleMaps_markerColors || "green purple yellow blue orange red".split(" ");
	var fa = -1;
	var Z = b$$0.config.googleMaps_Icons;
	var V = [];
	var W = [];
	var T = [];
	var X = [];
	var ba = [];
	var D = null;
	var ca = null;
	var P = "";
	var C = null;
	var $;
	var ra;
	var oa;
	var na;
	var y;
	var U;
	var I;
	var pa;
	var qa = "Default";
	var ka;
	var la;
	var ma;
	var E = b$$0.lang.googlemaps;
	var aa = true;
	if ("undefined" == typeof Z) {
		b$$0.config.googleMaps_Icons = {};
		Z = b$$0.config.googleMaps_Icons;
	}
	var sa = CKEDITOR.document.getHead().append("style");
	sa.setAttribute("type", "text/css");
	var ia;
	ia = "" + ("#" + N + " * {white-space:normal; cursor:inherit; text-align:inherit;}") + ("#" + N + " .Input_Text {cursor:text; border-style:inset; border-width:2px; margin-left:1em;}") + ("#" + N + " .Input_Button {border-style:outset; border-width:2px; margin:0 1em;}") + ("#" + N + " .Gmaps_Buttons {clear:both; text-align:center; margin-top:4px;}") + ("#" + N + " .Gmaps_Options td {clear:both}") + ("#" + N + " a {cursor:pointer}") + ("#" + N + " img {max-width: none;}") + ('.GMapsButton {cursor:pointer; background:url("' +
		b$$0.plugins.googlemaps.path + 'images/sprite.png") no-repeat top left; width: 24px; height: 24px;}');
	ia += ".GMapsButtonActive {outline:1px solid #316AC5; background-color:#C1D2EE;}.GMapsButton:hover {outline:1px solid #316AC5;}.pac-container {z-index:12000;}";
	if (CKEDITOR.env.ie) {
		if (9 <= CKEDITOR.env.version) {
			ia += "#" + N + " canvas { width:256px; height:256px; }";
		}
	}
	if (CKEDITOR.env.ie && 11 > CKEDITOR.env.version) {
		sa.$.styleSheet.cssText = ia;
	} else {
		sa.$.innerHTML = ia;
	}
	var ja;
	return {
		title: E.title,
		minWidth: 500,
		minHeight: 460,
		onLoad: function() {
			I = this;
			I.on("selectPage", function(a) {
				if (CKEDITOR.env.ie7Compat) {
					i();
				}
				if (a.data.page == "Elements") {
					a = 0;
					for (; a < V.length; a++) {
						V[a].setOptions({
							draggable: true
						});
					}
					a = 0;
					for (; a < X.length; a++) {
						X[a].setVisible(true);
					}
					a = 0;
					for (; a < W.length; a++) {
						s$$0(W[a]);
					}
					a = 0;
					for (; a < T.length; a++) {
						s$$0(T[a]);
					}
					a = 0;
					for (; a < ba.length; a++) {
						s$$0(ba[a]);
					}
				} else {
					M();
					a = 0;
					for (; a < V.length; a++) {
						V[a].setOptions({
							draggable: false
						});
					}
					a = 0;
					for (; a < X.length; a++) {
						X[a].setVisible(false);
					}
					a = 0;
					for (; a < W.length; a++) {
						v$$0(W[a]);
					}
					a = 0;
					for (; a < T.length; a++) {
						v$$0(T[a]);
					}
					a = 0;
					for (; a < ba.length; a++) {
						v$$0(ba[a]);
					}
				}
			});
			I.on("resize", L);
			var a$$0 = this.parts.contents;
			var b = a$$0.getChildren();
			var c = b.count() - 1;
			for (; c >= 0; c--) {
				b.getItem(c).$.style.height = "64px";
			}
			a$$0.appendHtml('<div id="Wrapper' + N + '" style="width:500px; height:370px; overflow:auto;"><div id="' + N + '" style="outline:0;"></div></div>');
			if (CKEDITOR.env.ie7Compat) {
				this.parts.footer.on("mousemove", i);
				this.parts.footer.on("mouseleave", function() {
					window.setTimeout(i, 0);
				});
			}
		},
		onShow: function() {
			P = "";
			aa = true;
			y = U = null;
			var c = b$$0.plugins.googleMapsHandler;
			var d = this.getSelectedElement();
			if (d) {
				U = d.$;
				if (d = U.getAttribute("mapnumber")) {
					if (y = c.getMap(d)) {
						y.updateDimensions(U);
					}
				}
				if (!y) {
					if (c.isStaticImage(U)) {
						y = c.createNew();
						y.parseStaticMap2(U);
						if (U.parentNode.nodeName == "DIV" && (!U.previousSibling && !U.nextSibling)) {
							U = U.parentNode;
							if (b$$0.config.googleMaps_WrapperClass && (U.parentNode.nodeName == "DIV" && U.parentNode.className == b$$0.config.googleMaps_WrapperClass)) {
								U = U.parentNode;
							}
							b$$0.getSelection().selectElement(new CKEDITOR.dom.element(U));
						}
					}
					U = null;
				}
			}
			if (!y) {
				y = c.createNew();
				if (navigator.geolocation && !b$$0.config.googleMaps_CenterLat) {
					if (localStorage.mapsCenter) {
						c = JSON.parse(localStorage.mapsCenter);
						y.centerLat = c.lat;
						y.centerLon = c.lng;
					} else {
						navigator.geolocation.getCurrentPosition(function(a) {
							y.centerLat = a.coords.latitude.toFixed(5);
							y.centerLon = a.coords.longitude.toFixed(5);
							localStorage.mapsCenter = JSON.stringify({
								lat: y.centerLat,
								lng: y.centerLon
							});
							if (C) {
								C.setCenter(new google.maps.LatLng(y.centerLat, y.centerLon));
							}
						});
					}
				}
			}
			I.setValueOf("Info", "txtWidth", y.width);
			I.setValueOf("Info", "txtHeight", y.height);
			I.setValueOf("Options", "cmbGeneratedType", y.generatedType);
			I.setValueOf("Options", "cmbZoomControl", y.zoomControl);
			I.setValueOf("Options", "cmbMapTypes", y.mapTypeControl);
			I.setValueOf("Options", "chkScale", y.scaleControl);
			I.setValueOf("Options", "chkOverviewMap", y.overviewMapControl);
			I.setValueOf("Options", "chkWeather", y.weather);
			I.setValueOf("Options", "cmbPathType", y.pathType);
			if (c = I.getContentElement("Elements", "txtKMLUrl")) {
				c.setValue(y.kmlOverlay);
			}
			a$$1();
		},
		onOk: function() {
			y.width = I.getValueOf("Info", "txtWidth");
			y.height = I.getValueOf("Info", "txtHeight");
			y.zoom = C.getZoom();
			var a = C.getCenter();
			y.centerLat = a.lat().toFixed(5);
			y.centerLon = a.lng().toFixed(5);
			y.tilt = C.getTilt();
			y.heading = C.getHeading();
			y.mapType = CKEDITOR.tools.indexOf(na, C.getMapTypeId());
			y.generatedType = parseInt(I.getValueOf("Options", "cmbGeneratedType"), 10);
			y.zoomControl = I.getValueOf("Options", "cmbZoomControl");
			y.mapTypeControl = I.getValueOf("Options", "cmbMapTypes");
			y.scaleControl = I.getValueOf("Options", "chkScale");
			y.overviewMapControl = I.getValueOf("Options", "chkOverviewMap");
			y.overviewMapControlOpened = C.overviewMapControlOptions.opened;
			y.weather = I.getValueOf("Options", "chkWeather");
			y.pathType = I.getValueOf("Options", "cmbPathType");
			var b = C.getStreetView();
			if (b.getVisible()) {
				var c = {};
				a = b.getPosition();
				c.lat = a.lat().toFixed(7);
				c.lng = a.lng().toFixed(7);
				b = b.getPov();
				c.heading = b.heading;
				c.pitch = b.pitch;
				c.zoom = b.zoom;
				y.panorama = c;
			} else {
				y.panorama = null;
			}
			var d = [];
			var e = [];
			var f = [];
			var g = [];
			c = [];
			b = 0;
			for (; b < V.length; b++) {
				var h = V[b];
				a = h.getPosition();
				d.push({
					lat: a.lat().toFixed(5),
					lon: a.lng().toFixed(5),
					text: h.text,
					color: h.color,
					title: h.get("title"),
					maxWidth: h.maxWidth,
					open: h._infoWindow && h._infoWindow.map
				});
			}
			y.markerPoints = d;
			b = 0;
			for (; b < X.length; b++) {
				a = X[b].getPosition();
				e.push({
					lat: a.lat().toFixed(5),
					lon: a.lng().toFixed(5),
					title: X[b].get("title"),
					className: X[b].className
				});
			}
			y.textsData = e;
			b = 0;
			for (; b < W.length; b++) {
				if (a = ha(W[b], false)) {
					f.push(a);
				}
			}
			y.linesData = f;
			b = 0;
			for (; b < T.length; b++) {
				a = {
					polylines: []
				};
				a.polylines.push(ha(T[b], true));
				if (a.polylines[0]) {
					a.color = T[b].fillColor;
					a.opacity = T[b].fillOpacity;
					g.push(a);
				}
			}
			y.areasData = g;
			b = 0;
			for (; b < ba.length; b++) {
				a = ba[b];
				c.push({
					color: a.strokeColor,
					opacity: a.strokeOpacity,
					weight: a.strokeWeight,
					fillColor: a.fillColor,
					fillOpacity: a.fillOpacity,
					radius: a.radius.toFixed(0),
					lat: a.center.lat().toFixed(5),
					lon: a.center.lng().toFixed(5)
				});
			}
			y.circlesData = c;
			if (c = I.getContentElement("Elements", "txtKMLUrl")) {
				y.kmlOverlay = c.getValue();
			}
			if (!U) {
				U = y.createHtmlElement();
			}
			y.updateHTMLElement(U);
		},
		onHide: function() {
			var a;
			var b;
			a = 0;
			for (; a < V.length; a++) {
				b = V[a];
				b.setMap(null);
				if (b.label) {
					b.label.setMap(null);
					b.label = null;
				}
			}
			a = 0;
			for (; a < X.length; a++) {
				b = X[a];
				b.setMap(null);
				if (b.label) {
					b.label.setMap(null);
					b.label = null;
				}
			}
			a = 0;
			for (; a < W.length; a++) {
				W[a].setMap(null);
			}
			a = 0;
			for (; a < T.length; a++) {
				T[a].setMap(null);
			}
			if (ca) {
				ca.setMap(null);
				ca = null;
			}
			google.maps.event.clearInstanceListeners(C);
			C = null;
			aa = true;
		},
		contents: [{
			id: "Info",
			label: E.map,
			elements: [{
				type: "hbox",
				widths: ["115px", "115px", "240px"],
				children: [{
					id: "txtWidth",
					type: "text",
					widths: ["55px", "60px"],
					width: "40px",
					labelLayout: "horizontal",
					label: E.width,
					onBlur: h$$0,
					required: true
				}, {
					id: "txtHeight",
					type: "text",
					widths: ["55px", "60px"],
					width: "40px",
					labelLayout: "horizontal",
					label: E.height,
					onBlur: h$$0,
					required: true
				}, {
					type: "html",
					html: "<div> </div>"
				}]
			}, {
				type: "hbox",
				widths: ["340px", "100px", ""],
				children: [{
					id: "searchDirection",
					type: "text",
					label: E.searchDirection,
					labelLayout: "horizontal",
					onKeyup: function(a) {
						if (a.data.getKeystroke() == 13) {
							l();
							a.stop();
							return false;
						}
					},
					onKeydown: function(a) {
						if (a.data.getKeystroke() == 13) {
							a.stop();
							a.data.preventDefault(true);
							a.data.stopPropagation();
							return false;
						}
					}
				}, {
					id: "btnSearch",
					type: "button",
					align: "center",
					label: E.search,
					onClick: l
				}]
			}]
		}, {
			id: "Options",
			label: E.options,
			elements: [{
				type: "hbox",
				widths: ["180px", "100px", "100px", "0"],
				children: [{
					id: "cmbGeneratedType",
					type: "select",
					labelLayout: "horizontal",
					label: E.loadMap,
					items: [
						[E.onlyStatic, "1"],
						[E.onClick, "2"],
						[E.onLoad, "3"],
						[E.byScript, "4"]
					]
				}, {
					id: "chkScale",
					type: "checkbox",
					labelLayout: "horizontal",
					label: E.scale,
					onChange: function() {
						if (!aa) {
							q(this);
						}
					}
				}, {
					id: "chkOverviewMap",
					type: "checkbox",
					labelLayout: "horizontal",
					label: E.overview,
					onChange: function() {
						if (!aa) {
							o(this);
						}
					}
				}, {
					id: "cmbMapTypes",
					hidden: true,
					type: "select",
					labelLayout: "horizontal",
					label: E.mapTypes,
					onChange: function() {
						if (!aa) {
							aa = true;
							j(this);
							aa = false;
						}
					},
					items: [
						[E.none, "None"],
						[E.Default, "Default"],
						[E.mapTypesFull, "Full"],
						[E.mapTypesMenu, "Menu"]
					]
				}]
			}, {
				type: "hbox",
				widths: ["180px", "100px", "100px", "0"],
				children: [{
					id: "cmbPathType",
					type: "select",
					labelLayout: "horizontal",
					label: E.paths,
					onChange: function() {
						if (!aa) {
							aa = true;
							m(this);
							aa = false;
						}
					},
					items: [
						[E.Default, "Default"],
						[E.traffic, "Traffic"],
						[E.transit, "Transit"],
						[E.bicycle, "Bicycle"]
					]
				}, {
					id: "chkWeather",
					type: "checkbox",
					labelLayout: "horizontal",
					label: E.weather,
					onChange: function() {
						if (!aa) {
							n(this);
						}
					}
				}, {
					id: "cmbZoomControl",
					hidden: true,
					type: "select",
					labelLayout: "horizontal",
					label: E.zoomControl + " ",
					items: [
						[E.none, "None"],
						[E.Default, "Default"],
						[E.smallZoom, "Small"],
						[E.fullZoom, "Full"]
					],
					onChange: function() {
						if (!aa) {
							aa = true;
							k(this);
							aa = false;
						}
					}
				}, {
					type: "html",
					html: "<div> </div>"
				}]
			}]
		}, {
			id: "Elements",
			label: E.elements,
			elements: [{
				type: "hbox",
				widths: "26px 26px 26px 26px 26px 338px".split(" "),
				children: [{
					type: "html",
					id: "btnAddNewMarker",
					onClick: function() {
						w("AddMarker");
					},
					html: '<div tabindex="-1" title="' + E.addMarker + '" class="GMapsButton" style="background-position: 0 -50px;"></div>'
				}, {
					type: "html",
					id: "btnAddNewLine",
					onClick: function() {
						w("AddLine");
					},
					html: '<div tabindex="-1" title="' + E.addLine + '" class="GMapsButton" style="background-position: 0 -25px;"></div>'
				}, {
					type: "html",
					id: "btnAddNewArea",
					onClick: function() {
						w("AddArea");
					},
					html: '<div tabindex="-1" title="' + E.addArea + '" class="GMapsButton" style="background-position: 0 0;"></div>'
				}, {
					type: "html",
					id: "btnAddNewCircle",
					onClick: function() {
						w("AddCircle");
					},
					html: '<div tabindex="-1" title="' + E.addCircle + '" class="GMapsButton" style="background-position: 0 -125px;"></div>'
				}, {
					type: "html",
					id: "btnAddNewText",
					onClick: function() {
						w("AddText");
					},
					html: '<div tabindex="-1" title="' + E.addText + '" class="GMapsButton" style="background-position: 0 -75px;"></div>'
				}, {
					type: "html",
					id: "btnKmlToggle",
					onClick: function() {
						var a = I.getContentElement("Elements", "KMLContainer").getElement();
						if (a.$.style.display == "none") {
							a.show();
						} else {
							a.hide();
						}
					},
					html: '<div tabindex="-1" title="' + E.addKML + '" class="GMapsButton" style="background-position: 0 -100px;"></div>'
				}, {
					type: "html",
					html: "<div>&nbsp;</div>"
				}]
			}, {
				id: "KMLContainer",
				type: "hbox",
				widths: ["370px"],
				hidden: true,
				children: [{
					id: "txtKMLUrl",
					type: "text",
					labelLayout: "horizontal",
					label: E.kmlUrl,
					onBlur: Q,
					onKeyup: function(a) {
						if (a.data.getKeystroke() == 13) {
							Q();
							a.stop();
							return false;
						}
					},
					onKeydown: function(a) {
						if (a.data.getKeystroke() == 13) {
							a.stop();
							a.data.preventDefault(true);
							a.data.stopPropagation();
							return false;
						}
					},
					validate: function() {
						var a = this.getValue();
						if (!a) {
							return true;
						}
						a = /:\/\/(.*?)\//.exec(a);
						if (!a || a[1].indexOf(".") == -1) {
							alert("Error: You must provide a public server in the url of KML files.");
							return false;
						}
					}
				}, {
					type: "button",
					id: "browse",
					hidden: true,
					filebrowser: {
						action: "Browse",
						target: "Elements:txtKMLUrl",
						url: b$$0.config.filebrowserKmlBrowseUrl || b$$0.config.filebrowserBrowseUrl,
						onSelect: Q
					},
					label: b$$0.lang.common.browseServer
				}]
			}]
		}]
	};
});
CKEDITOR.dialog.add("googlemapsIcons", function(b$$0) {
	function f(a) {
		var b = document.createElement("IMG");
		b.src = a;
		return a = b.src;
	}
	var c$$0 = b$$0.config.googleMaps_markerColors || "green purple yellow blue orange red".split(" ");
	var a$$0 = c$$0.length;
	var d$$0 = [];
	var e$$0;
	var g$$0 = 0;
	for (; g$$0 < a$$0; g$$0++) {
		var i$$0 = c$$0[g$$0];
		d$$0.push({
			name: i$$0,
			src: "//maps.gstatic.com/mapfiles/ms/micons/" + i$$0 + "-dot.png"
		});
	}
	if (c$$0 = b$$0.config.googleMaps_Icons) {
		for (i$$0 in c$$0) {
			d$$0.push({
				name: i$$0,
				src: c$$0[i$$0].marker.image
			});
		}
		a$$0 = Math.min(10, d$$0.length);
	}
	var h$$0 = function(a) {
		var b = a.data.getTarget();
		var c = b.getName();
		if ("a" == c) {
			b = b.getChild(0);
		} else {
			if ("img" != c) {
				return;
			}
		}
		b = b.getAttribute("data-name");
		e$$0.onSelect(b);
		e$$0.hide();
		a.data.preventDefault();
	};
	var j = CKEDITOR.tools.addFunction(function(a, c) {
		a = new CKEDITOR.dom.event(a);
		c = new CKEDITOR.dom.element(c);
		var d;
		d = a.getKeystroke();
		var e = "rtl" == b$$0.lang.dir;
		switch (d) {
			case 38:
				if (d = c.getParent().getParent().getPrevious()) {
					d = d.getChild([c.getParent().getIndex(), 0]);
					d.focus();
				}
				a.preventDefault();
				break;
			case 40:
				if (d = c.getParent().getParent().getNext()) {
					if (d = d.getChild([c.getParent().getIndex(), 0])) {
						d.focus();
					}
				}
				a.preventDefault();
				break;
			case 32:
				h$$0({
					data: a
				});
				a.preventDefault();
				break;
			case e ? 37:
				39: ;
			case 9:
				if (d = c.getParent().getNext()) {
					d = d.getChild(0);
					d.focus();
					a.preventDefault(true);
				} else {
					if (d = c.getParent().getParent().getNext()) {
						if (d = d.getChild([0, 0])) {
							d.focus();
						}
						a.preventDefault(true);
					}
				}
				break;
			case e ? 39:
				37: ;
			case CKEDITOR.SHIFT + 9:
				if (d = c.getParent().getPrevious()) {
					d = d.getChild(0);
					d.focus();
					a.preventDefault(true);
				} else {
					if (d = c.getParent().getParent().getPrevious()) {
						d = d.getLast().getChild(0);
						d.focus();
						a.preventDefault(true);
					}
				};
		}
	});
	var k = function() {
		var b = ['<table style="width:100%;height:100%" cellspacing="2" cellpadding="2"', CKEDITOR.env.ie && CKEDITOR.env.quirks ? ' style="position:absolute;"' : "", "><tbody>"];
		g$$0 = 0;
		for (; g$$0 < d$$0.length; g$$0++) {
			if (0 === g$$0 % a$$0) {
				b.push("<tr>");
			}
			var c = d$$0[g$$0];
			b.push('<td class="cke_centered" style="vertical-align: middle;"><a href="javascript:void(0)"', ' class="cke_hand" tabindex="-1" onkeydown="CKEDITOR.tools.callFunction( ', j, ', event, this );">', '<img class="cke_hand"  src="', c.src, '"', ' data-name="', c.name, '"', CKEDITOR.env.ie ? " onload=\"this.setAttribute('width', 2); this.removeAttribute('width');\" " : "", "></a>", "</td>");
			if (g$$0 % a$$0 == a$$0 - 1) {
				b.push("</tr>");
			}
		}
		if (g$$0 < a$$0 - 1) {
			for (; g$$0 < a$$0 - 1; g$$0++) {
				b.push("<td></td>");
			}
			b.push("</tr>");
		}
		b.push("</tbody></table>");
		return b.join("");
	};
	i$$0 = {
		type: "html",
		html: "<div>" + k() + "</div>",
		id: "imagesSelector",
		onLoad: function(a) {
			e$$0 = a.sender;
		},
		focus: function() {
			var a = d$$0.length;
			var b;
			b = 0;
			for (; b < a && d$$0[b].name != e$$0.initialName; b++) {}
			this.getElement().getElementsByTag("a").getItem(b).focus();
		},
		onClick: h$$0,
		style: "width: 100%; border-collapse: separate;"
	};
	return {
		title: b$$0.lang.googlemaps.selectIcon,
		minWidth: 270,
		minHeight: 80,
		contents: [{
			id: "Info",
			label: "",
			title: "",
			padding: 0,
			elements: [i$$0, {
				type: "hbox",
				children: [{
					type: "button",
					id: "browse",
					style: "margin-top:4px;margin-bottom:2px; display:inline-block;",
					label: b$$0.lang.common.browseServer,
					filebrowser: {
						action: "Browse",
						target: "Info:txtUrl",
						url: b$$0.config.filebrowserIconBrowseUrl || (b$$0.config.filebrowserImageBrowseUrl || b$$0.config.filebrowserBrowseUrl)
					}
				}, {
					type: "text",
					hidden: true,
					id: "txtUrl",
					onChange: function() {
						var a = f(this.getValue());
						var c = a.match(/([^\/]+)\.[^\/]*$/) || a.match(/([^\/]+)[^\/]*$/);
						c = c && c[1] || a;
						var e = this.getDialog();
						var g = false;
						c = c.replace(/[^\w]/g, "");
						if (!b$$0.config.googleMaps_Icons) {
							b$$0.config.googleMaps_Icons = {};
						}
						if (!b$$0.config.googleMaps_Icons[c]) {
							var h = {
								marker: {
									image: a
								}
							};
							var i = b$$0.config.googleMaps_shadowMarker;
							if (i) {
								if ("String" != typeof i) {
									i = i(a);
								}
								h.shadow = {
									image: i
								};
							}
							b$$0.config.googleMaps_Icons[c] = h;
							d$$0.push({
								name: c,
								src: a
							});
							a = e.parts.contents.getFirst().getFirst().$;
							h = a.offsetWidth;
							i = a.offsetHeight;
							e.getContentElement("Info", "imagesSelector").getElement().setHtml(k());
							if (a.offsetWidth > h || a.offsetHeight > i) {
								g = true;
								e.resize(a.offsetWidth, a.offsetHeight);
							}
						}
						e.onSelect(c);
						if (!g || (!CKEDITOR.env.ie || CKEDITOR.env.ie9Compat)) {
							e.hide();
						} else {
							setTimeout(function() {
								e.hide();
							}, "rtl" == b$$0.lang.dir ? 1001 : 101);
						}
					}
				}]
			}]
		}],
		buttons: [CKEDITOR.dialog.cancelButton]
	};
});
CKEDITOR.dialog.add("googlemapsLine", function(b$$0) {
	function f$$0(a$$0, c) {
		var f = a$$0.getDialog();
		b$$0.openNestedDialog("colordialog", function(a) {
			var b = f.getValueOf("Info", c);
			a = a.getContentElement("picker", "selectedColor");
			a.setValue(b);
			a.setInitValue();
		}, function(a) {
			a = a.getContentElement("picker", "selectedColor");
			f.getContentElement("Info", c).setValue(a.getValue());
			a.setValue("");
			a.setInitValue();
		});
	}
	var c$$0;
	var a$$1;
	return {
		title: b$$0.lang.googlemaps.properties,
		minWidth: 230,
		minHeight: 140,
		resizable: false,
		buttons: [{
				type: "button",
				id: "deleteOverlay",
				label: b$$0.lang.googlemaps.deleteMarker,
				onClick: function(a) {
					a = a.sender.getDialog();
					a.onRemoveOverlay();
					a.hide();
				}
			},
			CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton
		],
		onLoad: function() {
			c$$0 = this.getContentElement("Info", "fldAreaProperties").getElement();
			this.setValues = function(a) {
				this.definition.setValues.call(this, a);
			};
			this.getValues = function() {
				return this.definition.getValues.call(this);
			};
		},
		setValues: function(b) {
			var e = this.getContentElement("Info", "cmbStrokeWeight");
			e.setValue(b.strokeWeight);
			e.setInitValue();
			e = this.getContentElement("Info", "cmbStrokeOpacity");
			e.setValue(b.strokeOpacity);
			e.setInitValue();
			e = this.getContentElement("Info", "txtStrokeColor");
			e.setValue(b.strokeColor);
			e.setInitValue();
			if (b.fillOpacity) {
				a$$1 = "polygon";
				c$$0.show();
				e = this.getContentElement("Info", "cmbFillOpacity");
				e.setValue(b.fillOpacity);
				e.setInitValue();
				e = this.getContentElement("Info", "txtFillColor");
				e.setValue(b.fillColor);
				e.setInitValue();
				this.resize(230, 240);
			} else {
				a$$1 = "polyline";
				c$$0.hide();
				this.resize(230, 140);
			}
		},
		getValues: function() {
			var b = {
				strokeWeight: parseInt(this.getValueOf("Info", "cmbStrokeWeight"), 10),
				strokeOpacity: parseFloat(this.getValueOf("Info", "cmbStrokeOpacity")),
				strokeColor: this.getValueOf("Info", "txtStrokeColor")
			};
			if ("polygon" == a$$1) {
				b.fillOpacity = parseFloat(this.getValueOf("Info", "cmbFillOpacity"));
				b.fillColor = this.getValueOf("Info", "txtFillColor");
			}
			return b;
		},
		contents: [{
			id: "Info",
			elements: [{
				type: "fieldset",
				id: "fldLineProperties",
				label: b$$0.lang.googlemaps.lineProperties,
				children: [{
					id: "cmbStrokeWeight",
					label: b$$0.lang.googlemaps.strokeWeight + " ",
					labelLayout: "horizontal",
					widths: ["55px", "65px"],
					style: "width:130px; margin-bottom:1em;",
					inputStyle: "width:45px; padding-left:0; padding-right:0;",
					type: "select",
					items: [
						["1", "1"],
						["2", "2"],
						["3", "3"],
						["4", "4"],
						["5", "5"],
						["6", "6"],
						["7", "7"],
						["8", "8"],
						["9", "9"],
						["10", "10"]
					]
				}, {
					id: "cmbStrokeOpacity",
					label: b$$0.lang.googlemaps.strokeOpacity + " ",
					labelLayout: "horizontal",
					widths: ["55px", "65px"],
					style: "width:130px; margin-bottom:1em;",
					inputStyle: "width:45px; padding-left:0; padding-right:0;",
					type: "select",
					items: [
						["0.1", "0.1"],
						["0.2", "0.2"],
						["0.3", "0.3"],
						["0.4", "0.4"],
						["0.5", "0.5"],
						["0.6", "0.6"],
						["0.7", "0.7"],
						["0.8", "0.8"],
						["0.9", "0.9"],
						["1", "1"]
					]
				}, {
					type: "hbox",
					widths: ["130px", "80px"],
					children: [{
						id: "txtStrokeColor",
						type: "text",
						label: b$$0.lang.googlemaps.strokeColor,
						labelLayout: "horizontal",
						widths: ["55px", "65px"],
						width: "65px"
					}, {
						id: "btnColor",
						type: "button",
						label: b$$0.lang.googlemaps.chooseColor,
						onClick: function() {
							f$$0(this, "txtStrokeColor");
						}
					}]
				}]
			}, {
				type: "fieldset",
				id: "fldAreaProperties",
				label: b$$0.lang.googlemaps.areaProperties,
				children: [{
					id: "cmbFillOpacity",
					label: b$$0.lang.googlemaps.fillOpacity + " ",
					labelLayout: "horizontal",
					widths: ["55px", "65px"],
					style: "width:130px; margin-bottom:1em;",
					inputStyle: "width:45px; padding-left:0; padding-right:0;",
					type: "select",
					items: [
						["0.1", "0.1"],
						["0.2", "0.2"],
						["0.3", "0.3"],
						["0.4", "0.4"],
						["0.5", "0.5"],
						["0.6", "0.6"],
						["0.7", "0.7"],
						["0.8", "0.8"],
						["0.9", "0.9"],
						["1", "1"]
					]
				}, {
					type: "hbox",
					widths: ["130px", "80px"],
					children: [{
						id: "txtFillColor",
						type: "text",
						label: b$$0.lang.googlemaps.fillColor,
						labelLayout: "horizontal",
						widths: ["55px", "65px"],
						style: "width:130px; ",
						width: "65px"
					}, {
						id: "btnFillColor",
						type: "button",
						label: b$$0.lang.googlemaps.chooseColor,
						onClick: function() {
							f$$0(this, "txtFillColor");
						}
					}]
				}]
			}]
		}]
	};
});
CKEDITOR.dialog.add("googlemapsMarker", function(b$$0) {
	function f(a) {
		var b = d$$0 && d$$0[a];
		return !b ? "//maps.gstatic.com/mapfiles/ms/micons/" + a + "-dot.png" : b.marker.image;
	}
	var c$$1 = "markerIcon" + CKEDITOR.tools.getNextNumber();
	var a$$2 = "GMapTexts" + CKEDITOR.tools.getNextNumber();
	var d$$0 = b$$0.config.googleMaps_Icons;
	var e;
	var g;
	var i;
	return {
		title: b$$0.lang.googlemaps.markerProperties,
		minWidth: 310,
		minHeight: 240,
		buttons: [{
				type: "button",
				id: "deleteMarker",
				label: b$$0.lang.googlemaps.deleteMarker,
				onClick: function(a) {
					a = a.sender.getDialog();
					a.onRemoveMarker();
					a.hide();
				}
			},
			CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton
		],
		onLoad: function() {
			i = this;
			this.setValues = function(a) {
				this.definition.setValues.call(this, a);
			};
			this.getValues = function() {
				return this.definition.getValues.call(this);
			};
			this.destroy = CKEDITOR.tools.override(this.destroy, function(b) {
				return function() {
					CKEDITOR.instances[a$$2].destroy();
					b.call(this);
				};
			});
		},
		setValues: function(b) {
			g = b;
			var d = this.getContentElement("Info", "txtTooltip");
			d.setValue(b.title);
			d.setInitValue();
			d = this.getContentElement("Info", "txtWidth");
			d.setValue(b.maxWidth);
			d.setInitValue();
			if (d = CKEDITOR.instances[a$$2]) {
				d.setData(b.text);
			} else {
				document.getElementById(a$$2).value = b.text;
			}
			e = b.color;
			document.getElementById(c$$1).src = f(e);
		},
		getValues: function() {
			return {
				title: this.getValueOf("Info", "txtTooltip"),
				maxWidth: this.getValueOf("Info", "txtWidth"),
				text: CKEDITOR.instances[a$$2].getData(),
				color: e
			};
		},
		contents: [{
			id: "Info",
			elements: [{
				type: "hbox",
				widths: ["150px", "80px; padding-right:2px", "10px", "60px"],
				children: [{
					id: "txtTooltip",
					type: "text",
					widths: ["70px", "90px"],
					width: "80px",
					labelLayout: "horizontal",
					label: b$$0.lang.googlemaps.tooltip
				}, {
					id: "txtWidth",
					type: "text",
					widths: ["40px", "36px"],
					width: "36px",
					labelLayout: "horizontal",
					label: b$$0.lang.googlemaps.width
				}, {
					type: "html",
					html: "<div>px</div>"
				}, {
					type: "html",
					onClick: function(a$$1) {
						if ("img" == a$$1.data.getTarget().getName()) {
							b$$0.openNestedDialog("googlemapsIcons", function(a$$0) {
								a$$0.initialName = e;
								a$$0.onSelect = function(a) {
									e = a;
									document.getElementById(c$$1).src = f(e);
								};
							}, null);
						}
					},
					html: '<div style="width:60px"><label style="float:left">' + b$$0.lang.googlemaps.markerIcon + '</label><img id="' + c$$1 + '" class="cke_hand"></div>'
				}]
			}, {
				type: "html",
				onLoad: function() {
					var c$$0 = "elementspath,resize,googlemaps";
					var d = b$$0.config.removePlugins;
					if (d) {
						c$$0 += "," + d;
					}
					if (b$$0.config.wsc_stack) {
						delete b$$0.config.wsc_stack;
					}
					if (CKEDITOR.config.wsc_stack) {
						CKEDITOR.config.wsc_stack = [];
					}
					d = CKEDITOR.tools.clone(b$$0.config);
					d.customConfig = "";
					d.width = "300px";
					d.height = 140;
					d.toolbar = b$$0.config.googleMaps_toolbar || [
						["Bold", "Italic", "Link", "Image"],
						["Undo", "Redo"],
						["GMapsInsertDirections"]
					];
					d.removePlugins = c$$0;
					d.toolbarCanCollapse = false;
					d.on = {
						pluginsLoaded: function(a$$0) {
							a$$0.editor.addCommand("gmapsinsertdirections", {
								exec: function(a) {
									var c = "http://maps.google.com/maps?daddr=" + encodeURIComponent(i.getValueOf("Info", "txtTooltip")) + " @" + g.getPosition().toUrlValue();
									a.insertHtml("<a href='" + c + "' target='_blank'>" + b$$0.lang.googlemaps.directionsTitle + "</a>");
								}
							});
							a$$0.editor.ui.addButton("GMapsInsertDirections", {
								label: b$$0.lang.googlemaps.directions,
								icon: b$$0.plugins.googlemaps.path + "/icons/gmapsinsertdirections.png",
								command: "gmapsinsertdirections"
							});
						}
					};
					CKEDITOR.replace(a$$2, d);
				},
				html: '<textarea id="' + a$$2 + '"></textarea>'
			}]
		}]
	};
});
CKEDITOR.dialog.add("googlemapsText", function(b$$0) {
	return {
		title: b$$0.lang.googlemaps.textProperties,
		minWidth: 200,
		minHeight: 35,
		onLoad: function() {
			this.setValues = function(b) {
				this.definition.setValues.call(this, b);
			};
			this.getValues = function() {
				return this.definition.getValues.call(this);
			};
		},
		setValues: function(b) {
			var c = this.getContentElement("Info", "txtTooltip");
			c.setValue(b.title);
			c.setInitValue();
		},
		getValues: function() {
			return {
				title: this.getValueOf("Info", "txtTooltip")
			};
		},
		contents: [{
			id: "Info",
			elements: [{
				id: "txtTooltip",
				type: "text"
			}]
		}]
	};
});
CKEDITOR.editorConfig = function(b) {
	b.customConfig = "";
	b.toolbarGroups = [{
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