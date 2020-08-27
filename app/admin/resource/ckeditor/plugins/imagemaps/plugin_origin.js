/*
Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
(function() {
	if (!window.CKEDITOR || !window.CKEDITOR.dom) window.CKEDITOR || (window.CKEDITOR = function() {
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
						if (!a)
							for (var f = document.getElementsByTagName("script"), c = 0; c < f.length; c++) {
								var b = f[c].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);
								if (b) {
									a = b[1];
									break
								}
							} - 1 == a.indexOf(":/") && "//" != a.slice(0, 2) &&
							(a = 0 === a.indexOf("/") ? location.href.match(/^.*?:\/\/[^\/]*/)[0] + a : location.href.match(/^[^\?]*\/(?:)/)[0] + a);
						if (!a) throw 'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
						return a
					}(),
					getUrl: function(a) {
						-1 == a.indexOf(":/") && 0 !== a.indexOf("/") && (a = this.basePath + a);
						this.timestamp && ("/" != a.charAt(a.length - 1) && !/[&?]t=/.test(a)) && (a += (0 <= a.indexOf("?") ? "&" : "?") + "t=" + this.timestamp);
						return a
					},
					domReady: function() {
						function a() {
							try {
								document.addEventListener ?
									(document.removeEventListener("DOMContentLoaded", a, !1), f()) : document.attachEvent && "complete" === document.readyState && (document.detachEvent("onreadystatechange", a), f())
							} catch (c) {}
						}

						function f() {
							for (var a; a = c.shift();) a()
						}
						var c = [];
						return function(f) {
							c.push(f);
							"complete" === document.readyState && setTimeout(a, 1);
							if (1 == c.length)
								if (document.addEventListener) document.addEventListener("DOMContentLoaded", a, !1), window.addEventListener("load", a, !1);
								else if (document.attachEvent) {
								document.attachEvent("onreadystatechange",
									a);
								window.attachEvent("onload", a);
								f = !1;
								try {
									f = !window.frameElement
								} catch (b) {}
								if (document.documentElement.doScroll && f) {
									var e = function() {
										try {
											document.documentElement.doScroll("left")
										} catch (f) {
											setTimeout(e, 1);
											return
										}
										a()
									};
									e()
								}
							}
						}
					}()
				},
				e = window.CKEDITOR_GETURL;
			if (e) {
				var b = a.getUrl;
				a.getUrl = function(d) {
					return e.call(a, d) || b.call(a, d)
				}
			}
			return a
		}()), CKEDITOR.event || (CKEDITOR.event = function() {}, CKEDITOR.event.implementOn = function(a) {
				var e = CKEDITOR.event.prototype,
					b;
				for (b in e) a[b] == void 0 && (a[b] = e[b])
			}, CKEDITOR.event.prototype =
			function() {
				function a(a) {
					var f = e(this);
					return f[a] || (f[a] = new b(a))
				}
				var e = function(a) {
						a = a.getPrivate && a.getPrivate() || a._ || (a._ = {});
						return a.events || (a.events = {})
					},
					b = function(a) {
						this.name = a;
						this.listeners = []
					};
				b.prototype = {
					getListenerIndex: function(a) {
						for (var f = 0, c = this.listeners; f < c.length; f++)
							if (c[f].fn == a) return f;
						return -1
					}
				};
				return {
					define: function(d, f) {
						var c = a.call(this, d);
						CKEDITOR.tools.extend(c, f, true)
					},
					on: function(d, f, c, b, e) {
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
							return f.call(c, a) === false ? false : a.data
						}

						function i() {
							n.removeListener(d, f)
						}
						var k = a.call(this, d);
						if (k.getListenerIndex(f) < 0) {
							k = k.listeners;
							c || (c = this);
							isNaN(e) && (e = 10);
							var n = this;
							g.fn = f;
							g.priority = e;
							for (var o = k.length - 1; o >= 0; o--)
								if (k[o].priority <= e) {
									k.splice(o + 1, 0, g);
									return {
										removeListener: i
									}
								}
							k.unshift(g)
						}
						return {
							removeListener: i
						}
					},
					once: function() {
						var a = arguments[1];
						arguments[1] = function(f) {
							f.removeListener();
							return a.apply(this, arguments)
						};
						return this.on.apply(this,
							arguments)
					},
					capture: function() {
						CKEDITOR.event.useCapture = 1;
						var a = this.on.apply(this, arguments);
						CKEDITOR.event.useCapture = 0;
						return a
					},
					fire: function() {
						var a = 0,
							f = function() {
								a = 1
							},
							c = 0,
							b = function() {
								c = 1
							};
						return function(j, g, i) {
							var k = e(this)[j],
								j = a,
								n = c;
							a = c = 0;
							if (k) {
								var o = k.listeners;
								if (o.length)
									for (var o = o.slice(0), r, l = 0; l < o.length; l++) {
										if (k.errorProof) try {
											r = o[l].call(this, i, g, f, b)
										} catch (m) {} else r = o[l].call(this, i, g, f, b);
										r === false ? c = 1 : typeof r != "undefined" && (g = r);
										if (a || c) break
									}
							}
							g = c ? false : typeof g == "undefined" ?
								true : g;
							a = j;
							c = n;
							return g
						}
					}(),
					fireOnce: function(a, f, c) {
						f = this.fire(a, f, c);
						delete e(this)[a];
						return f
					},
					removeListener: function(a, f) {
						var c = e(this)[a];
						if (c) {
							var b = c.getListenerIndex(f);
							b >= 0 && c.listeners.splice(b, 1)
						}
					},
					removeAllListeners: function() {
						var a = e(this),
							f;
						for (f in a) delete a[f]
					},
					hasListeners: function(a) {
						return (a = e(this)[a]) && a.listeners.length > 0
					}
				}
			}()), CKEDITOR.editor || (CKEDITOR.editor = function() {
				CKEDITOR._.pending.push([this, arguments]);
				CKEDITOR.event.call(this)
			}, CKEDITOR.editor.prototype.fire =
			function(a, e) {
				a in {
					instanceReady: 1,
					loaded: 1
				} && (this[a] = true);
				return CKEDITOR.event.prototype.fire.call(this, a, e, this)
			}, CKEDITOR.editor.prototype.fireOnce = function(a, e) {
				a in {
					instanceReady: 1,
					loaded: 1
				} && (this[a] = true);
				return CKEDITOR.event.prototype.fireOnce.call(this, a, e, this)
			}, CKEDITOR.event.implementOn(CKEDITOR.editor.prototype)), CKEDITOR.env || (CKEDITOR.env = function() {
			var a = navigator.userAgent.toLowerCase(),
				e = {
					ie: a.indexOf("trident/") > -1,
					webkit: a.indexOf(" applewebkit/") > -1,
					air: a.indexOf(" adobeair/") >
						-1,
					mac: a.indexOf("macintosh") > -1,
					quirks: document.compatMode == "BackCompat" && (!document.documentMode || document.documentMode < 10),
					mobile: a.indexOf("mobile") > -1,
					iOS: /(ipad|iphone|ipod)/.test(a),
					isCustomDomain: function() {
						if (!this.ie) return false;
						var a = document.domain,
							c = window.location.hostname;
						return a != c && a != "[" + c + "]"
					},
					secure: location.protocol == "https:"
				};
			e.gecko = navigator.product == "Gecko" && !e.webkit && !e.ie;
			if (e.webkit) a.indexOf("chrome") > -1 ? e.chrome = true : e.safari = true;
			var b = 0;
			if (e.ie) {
				b = e.quirks || !document.documentMode ?
					parseFloat(a.match(/msie (\d+)/)[1]) : document.documentMode;
				e.ie9Compat = b == 9;
				e.ie8Compat = b == 8;
				e.ie7Compat = b == 7;
				e.ie6Compat = b < 7 || e.quirks
			}
			if (e.gecko) {
				var d = a.match(/rv:([\d\.]+)/);
				if (d) {
					d = d[1].split(".");
					b = d[0] * 1E4 + (d[1] || 0) * 100 + (d[2] || 0) * 1
				}
			}
			e.air && (b = parseFloat(a.match(/ adobeair\/(\d+)/)[1]));
			e.webkit && (b = parseFloat(a.match(/ applewebkit\/(\d+)/)[1]));
			e.version = b;
			e.isCompatible = e.iOS && b >= 534 || !e.mobile && (e.ie && b > 6 || e.gecko && b >= 2E4 || e.air && b >= 1 || e.webkit && b >= 522 || false);
			e.hidpi = window.devicePixelRatio >=
				2;
			e.needsBrFiller = e.gecko || e.webkit || e.ie && b > 10;
			e.needsNbspFiller = e.ie && b < 11;
			e.cssClass = "cke_browser_" + (e.ie ? "ie" : e.gecko ? "gecko" : e.webkit ? "webkit" : "unknown");
			if (e.quirks) e.cssClass = e.cssClass + " cke_browser_quirks";
			if (e.ie) e.cssClass = e.cssClass + (" cke_browser_ie" + (e.quirks ? "6 cke_browser_iequirks" : e.version));
			if (e.air) e.cssClass = e.cssClass + " cke_browser_air";
			if (e.iOS) e.cssClass = e.cssClass + " cke_browser_ios";
			if (e.hidpi) e.cssClass = e.cssClass + " cke_hidpi";
			return e
		}()), "unloaded" == CKEDITOR.status && function() {
			CKEDITOR.event.implementOn(CKEDITOR);
			CKEDITOR.loadFullCore = function() {
				if (CKEDITOR.status != "basic_ready") CKEDITOR.loadFullCore._load = 1;
				else {
					delete CKEDITOR.loadFullCore;
					var a = document.createElement("script");
					a.type = "text/javascript";
					a.src = CKEDITOR.basePath + "ckeditor.js";
					document.getElementsByTagName("head")[0].appendChild(a)
				}
			};
			CKEDITOR.loadFullCoreTimeout = 0;
			CKEDITOR.add = function(a) {
				(this._.pending || (this._.pending = [])).push(a)
			};
			(function() {
				CKEDITOR.domReady(function() {
					var a = CKEDITOR.loadFullCore,
						e = CKEDITOR.loadFullCoreTimeout;
					if (a) {
						CKEDITOR.status =
							"basic_ready";
						a && a._load ? a() : e && setTimeout(function() {
							CKEDITOR.loadFullCore && CKEDITOR.loadFullCore()
						}, e * 1E3)
					}
				})
			})();
			CKEDITOR.status = "basic_loaded"
		}(), CKEDITOR.dom = {},
		function() {
			var a = [],
				e = CKEDITOR.env.gecko ? "-moz-" : CKEDITOR.env.webkit ? "-webkit-" : CKEDITOR.env.ie ? "-ms-" : "",
				b = /&/g,
				d = />/g,
				f = /</g,
				c = /"/g,
				h = /&amp;/g,
				j = /&gt;/g,
				g = /&lt;/g,
				i = /&quot;/g;
			CKEDITOR.on("reset", function() {
				a = []
			});
			CKEDITOR.tools = {
				arrayCompare: function(a, f) {
					if (!a && !f) return true;
					if (!a || !f || a.length != f.length) return false;
					for (var c = 0; c <
						a.length; c++)
						if (a[c] != f[c]) return false;
					return true
				},
				clone: function(a) {
					var f;
					if (a && a instanceof Array) {
						f = [];
						for (var c = 0; c < a.length; c++) f[c] = CKEDITOR.tools.clone(a[c]);
						return f
					}
					if (a === null || typeof a != "object" || a instanceof String || a instanceof Number || a instanceof Boolean || a instanceof Date || a instanceof RegExp) return a;
					f = new a.constructor;
					for (c in a) f[c] = CKEDITOR.tools.clone(a[c]);
					return f
				},
				capitalize: function(a, f) {
					return a.charAt(0).toUpperCase() + (f ? a.slice(1) : a.slice(1).toLowerCase())
				},
				extend: function(a) {
					var f =
						arguments.length,
						c, b;
					if (typeof(c = arguments[f - 1]) == "boolean") f--;
					else if (typeof(c = arguments[f - 2]) == "boolean") {
						b = arguments[f - 1];
						f = f - 2
					}
					for (var d = 1; d < f; d++) {
						var e = arguments[d],
							g;
						for (g in e)
							if (c === true || a[g] == void 0)
								if (!b || g in b) a[g] = e[g]
					}
					return a
				},
				prototypedCopy: function(a) {
					var f = function() {};
					f.prototype = a;
					return new f
				},
				copy: function(a) {
					var f = {},
						c;
					for (c in a) f[c] = a[c];
					return f
				},
				isArray: function(a) {
					return Object.prototype.toString.call(a) == "[object Array]"
				},
				isEmpty: function(a) {
					for (var f in a)
						if (a.hasOwnProperty(f)) return false;
					return true
				},
				cssVendorPrefix: function(a, f, c) {
					if (c) return e + a + ":" + f + ";" + a + ":" + f;
					c = {};
					c[a] = f;
					c[e + a] = f;
					return c
				},
				cssStyleToDomStyle: function() {
					var a = document.createElement("div").style,
						f = typeof a.cssFloat != "undefined" ? "cssFloat" : typeof a.styleFloat != "undefined" ? "styleFloat" : "float";
					return function(a) {
						return a == "float" ? f : a.replace(/-./g, function(a) {
							return a.substr(1).toUpperCase()
						})
					}
				}(),
				buildStyleHtml: function(a) {
					for (var a = [].concat(a), f, c = [], b = 0; b < a.length; b++)
						if (f = a[b]) /@import|[{}]/.test(f) ? c.push("<style>" +
							f + "</style>") : c.push('<link type="text/css" rel=stylesheet href="' + f + '">');
					return c.join("")
				},
				htmlEncode: function(a) {
					return ("" + a).replace(b, "&amp;").replace(d, "&gt;").replace(f, "&lt;")
				},
				htmlDecode: function(a) {
					return a.replace(h, "&").replace(j, ">").replace(g, "<")
				},
				htmlEncodeAttr: function(a) {
					return a.replace(c, "&quot;").replace(f, "&lt;").replace(d, "&gt;")
				},
				htmlDecodeAttr: function(a) {
					return a.replace(i, '"').replace(g, "<").replace(j, ">")
				},
				getNextNumber: function() {
					var a = 0;
					return function() {
						return ++a
					}
				}(),
				getNextId: function() {
					return "cke_" + this.getNextNumber()
				},
				override: function(a, f) {
					var c = f(a);
					c.prototype = a.prototype;
					return c
				},
				setTimeout: function(a, f, c, b, d) {
					d || (d = window);
					c || (c = d);
					return d.setTimeout(function() {
						b ? a.apply(c, [].concat(b)) : a.apply(c)
					}, f || 0)
				},
				trim: function() {
					var a = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
					return function(f) {
						return f.replace(a, "")
					}
				}(),
				ltrim: function() {
					var a = /^[ \t\n\r]+/g;
					return function(f) {
						return f.replace(a, "")
					}
				}(),
				rtrim: function() {
					var a = /[ \t\n\r]+$/g;
					return function(f) {
						return f.replace(a,
							"")
					}
				}(),
				indexOf: function(a, f) {
					if (typeof f == "function")
						for (var c = 0, b = a.length; c < b; c++) {
							if (f(a[c])) return c
						} else {
							if (a.indexOf) return a.indexOf(f);
							c = 0;
							for (b = a.length; c < b; c++)
								if (a[c] === f) return c
						}
					return -1
				},
				search: function(a, f) {
					var c = CKEDITOR.tools.indexOf(a, f);
					return c >= 0 ? a[c] : null
				},
				bind: function(a, f) {
					return function() {
						return a.apply(f, arguments)
					}
				},
				createClass: function(a) {
					var f = a.$,
						c = a.base,
						b = a.privates || a._,
						d = a.proto,
						a = a.statics;
					!f && (f = function() {
						c && this.base.apply(this, arguments)
					});
					if (b) var e = f,
						f = function() {
							var a =
								this._ || (this._ = {}),
								f;
							for (f in b) {
								var c = b[f];
								a[f] = typeof c == "function" ? CKEDITOR.tools.bind(c, this) : c
							}
							e.apply(this, arguments)
						};
					if (c) {
						f.prototype = this.prototypedCopy(c.prototype);
						f.prototype.constructor = f;
						f.base = c;
						f.baseProto = c.prototype;
						f.prototype.base = function() {
							this.base = c.prototype.base;
							c.apply(this, arguments);
							this.base = arguments.callee
						}
					}
					d && this.extend(f.prototype, d, true);
					a && this.extend(f, a, true);
					return f
				},
				addFunction: function(f, c) {
					return a.push(function() {
						return f.apply(c || this, arguments)
					}) - 1
				},
				removeFunction: function(f) {
					a[f] = null
				},
				callFunction: function(f) {
					var c = a[f];
					return c && c.apply(window, Array.prototype.slice.call(arguments, 1))
				},
				cssLength: function() {
					var a = /^-?\d+\.?\d*px$/,
						f;
					return function(c) {
						f = CKEDITOR.tools.trim(c + "") + "px";
						return a.test(f) ? f : c || ""
					}
				}(),
				convertToPx: function() {
					var a;
					return function(f) {
						if (!a) {
							a = CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>', CKEDITOR.document);
							CKEDITOR.document.getBody().append(a)
						}
						if (!/%$/.test(f)) {
							a.setStyle("width",
								f);
							return a.$.clientWidth
						}
						return f
					}
				}(),
				repeat: function(a, f) {
					return Array(f + 1).join(a)
				},
				tryThese: function() {
					for (var a, f = 0, c = arguments.length; f < c; f++) {
						var b = arguments[f];
						try {
							a = b();
							break
						} catch (d) {}
					}
					return a
				},
				genKey: function() {
					return Array.prototype.slice.call(arguments).join("-")
				},
				defer: function(a) {
					return function() {
						var f = arguments,
							c = this;
						window.setTimeout(function() {
							a.apply(c, f)
						}, 0)
					}
				},
				normalizeCssText: function(a, f) {
					var c = [],
						b, d = CKEDITOR.tools.parseCssText(a, true, f);
					for (b in d) c.push(b + ":" + d[b]);
					c.sort();
					return c.length ? c.join(";") + ";" : ""
				},
				convertRgbToHex: function(a) {
					return a.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi, function(a, f, c, b) {
						a = [f, c, b];
						for (f = 0; f < 3; f++) a[f] = ("0" + parseInt(a[f], 10).toString(16)).slice(-2);
						return "#" + a.join("")
					})
				},
				parseCssText: function(a, f, c) {
					var b = {};
					if (c) {
						c = new CKEDITOR.dom.element("span");
						c.setAttribute("style", a);
						a = CKEDITOR.tools.convertRgbToHex(c.getAttribute("style") || "")
					}
					if (!a || a == ";") return b;
					a.replace(/&quot;/g, '"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g,
						function(a, c, d) {
							if (f) {
								c = c.toLowerCase();
								c == "font-family" && (d = d.toLowerCase().replace(/["']/g, "").replace(/\s*,\s*/g, ","));
								d = CKEDITOR.tools.trim(d)
							}
							b[c] = d
						});
					return b
				},
				writeCssText: function(a, f) {
					var c, b = [];
					for (c in a) b.push(c + ":" + a[c]);
					f && b.sort();
					return b.join("; ")
				},
				objectCompare: function(a, f, c) {
					var b;
					if (!a && !f) return true;
					if (!a || !f) return false;
					for (b in a)
						if (a[b] != f[b]) return false;
					if (!c)
						for (b in f)
							if (a[b] != f[b]) return false;
					return true
				},
				objectKeys: function(a) {
					var f = [],
						c;
					for (c in a) f.push(c);
					return f
				},
				convertArrayToObject: function(a, f) {
					var c = {};
					arguments.length == 1 && (f = true);
					for (var b = 0, d = a.length; b < d; ++b) c[a[b]] = f;
					return c
				},
				fixDomain: function() {
					for (var a;;) try {
						a = window.parent.document.domain;
						break
					} catch (f) {
						a = a ? a.replace(/.+?(?:\.|$)/, "") : document.domain;
						if (!a) break;
						document.domain = a
					}
					return !!a
				},
				eventsBuffer: function(a, f) {
					function c() {
						d = (new Date).getTime();
						b = false;
						f()
					}
					var b, d = 0;
					return {
						input: function() {
							if (!b) {
								var f = (new Date).getTime() - d;
								f < a ? b = setTimeout(c, a - f) : c()
							}
						},
						reset: function() {
							b && clearTimeout(b);
							b = d = 0
						}
					}
				},
				enableHtml5Elements: function(a, f) {
					for (var c = ["abbr", "article", "aside", "audio", "bdi", "canvas", "data", "datalist", "details", "figcaption", "figure", "footer", "header", "hgroup", "mark", "meter", "nav", "output", "progress", "section", "summary", "time", "video"], b = c.length, d; b--;) {
						d = a.createElement(c[b]);
						f && a.appendChild(d)
					}
				},
				checkIfAnyArrayItemMatches: function(a, f) {
					for (var c = 0, b = a.length; c < b; ++c)
						if (a[c].match(f)) return true;
					return false
				},
				checkIfAnyObjectPropertyMatches: function(a, f) {
					for (var c in a)
						if (c.match(f)) return true;
					return false
				},
				transparentImageData: "data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw=="
			}
		}(), CKEDITOR.dtd = function() {
			var a = CKEDITOR.tools.extend,
				e = function(a, f) {
					for (var c = CKEDITOR.tools.clone(a), b = 1; b < arguments.length; b++) {
						var f = arguments[b],
							d;
						for (d in f) delete c[d]
					}
					return c
				},
				b = {},
				d = {},
				f = {
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
				},
				c = {
					command: 1,
					link: 1,
					meta: 1,
					noscript: 1,
					script: 1,
					style: 1
				},
				h = {},
				j = {
					"#": 1
				},
				g = {
					center: 1,
					dir: 1,
					noframes: 1
				};
			a(b, {
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
			a(d, f, b, g);
			e = {
				a: e(b, {
					a: 1,
					button: 1
				}),
				abbr: b,
				address: d,
				area: h,
				article: a({
					style: 1
				}, d),
				aside: a({
					style: 1
				}, d),
				audio: a({
					source: 1,
					track: 1
				}, d),
				b: b,
				base: h,
				bdi: b,
				bdo: b,
				blockquote: d,
				body: d,
				br: h,
				button: e(b, {
					a: 1,
					button: 1
				}),
				canvas: b,
				caption: d,
				cite: b,
				code: b,
				col: h,
				colgroup: {
					col: 1
				},
				command: h,
				datalist: a({
					option: 1
				}, b),
				dd: d,
				del: b,
				details: a({
					summary: 1
				}, d),
				dfn: b,
				div: a({
					style: 1
				}, d),
				dl: {
					dt: 1,
					dd: 1
				},
				dt: d,
				em: b,
				embed: h,
				fieldset: a({
					legend: 1
				}, d),
				figcaption: d,
				figure: a({
						figcaption: 1
					},
					d),
				footer: d,
				form: d,
				h1: b,
				h2: b,
				h3: b,
				h4: b,
				h5: b,
				h6: b,
				head: a({
					title: 1,
					base: 1
				}, c),
				header: d,
				hgroup: {
					h1: 1,
					h2: 1,
					h3: 1,
					h4: 1,
					h5: 1,
					h6: 1
				},
				hr: h,
				html: a({
					head: 1,
					body: 1
				}, d, c),
				i: b,
				iframe: j,
				img: h,
				input: h,
				ins: b,
				kbd: b,
				keygen: h,
				label: b,
				legend: b,
				li: d,
				link: h,
				map: d,
				mark: b,
				menu: a({
					li: 1
				}, d),
				meta: h,
				meter: e(b, {
					meter: 1
				}),
				nav: d,
				noscript: a({
					link: 1,
					meta: 1,
					style: 1
				}, b),
				object: a({
					param: 1
				}, b),
				ol: {
					li: 1
				},
				optgroup: {
					option: 1
				},
				option: j,
				output: b,
				p: b,
				param: h,
				pre: b,
				progress: e(b, {
					progress: 1
				}),
				q: b,
				rp: b,
				rt: b,
				ruby: a({
					rp: 1,
					rt: 1
				}, b),
				s: b,
				samp: b,
				script: j,
				section: a({
					style: 1
				}, d),
				select: {
					optgroup: 1,
					option: 1
				},
				small: b,
				source: h,
				span: b,
				strong: b,
				style: j,
				sub: b,
				summary: b,
				sup: b,
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
				td: d,
				textarea: j,
				tfoot: {
					tr: 1
				},
				th: d,
				thead: {
					tr: 1
				},
				time: e(b, {
					time: 1
				}),
				title: j,
				tr: {
					th: 1,
					td: 1
				},
				track: h,
				u: b,
				ul: {
					li: 1
				},
				"var": b,
				video: a({
					source: 1,
					track: 1
				}, d),
				wbr: h,
				acronym: b,
				applet: a({
					param: 1
				}, d),
				basefont: h,
				big: b,
				center: d,
				dialog: h,
				dir: {
					li: 1
				},
				font: b,
				isindex: h,
				noframes: d,
				strike: b,
				tt: b
			};
			a(e, {
				$block: a({
					audio: 1,
					dd: 1,
					dt: 1,
					figcaption: 1,
					li: 1,
					video: 1
				}, f, g),
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
				$inline: b,
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
				$nonBodyContent: a({
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
			return e
		}(), CKEDITOR.dom.event = function(a) {
			this.$ = a
		}, CKEDITOR.dom.event.prototype = {
			getKey: function() {
				return this.$.keyCode || this.$.which
			},
			getKeystroke: function() {
				var a = this.getKey();
				if (this.$.ctrlKey || this.$.metaKey) a = a + CKEDITOR.CTRL;
				this.$.shiftKey && (a = a + CKEDITOR.SHIFT);
				this.$.altKey && (a = a + CKEDITOR.ALT);
				return a
			},
			preventDefault: function(a) {
				var e = this.$;
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				a && this.stopPropagation()
			},
			stopPropagation: function() {
				var a =
					this.$;
				a.stopPropagation ? a.stopPropagation() : a.cancelBubble = true
			},
			getTarget: function() {
				var a = this.$.target || this.$.srcElement;
				return a ? new CKEDITOR.dom.node(a) : null
			},
			getPhase: function() {
				return this.$.eventPhase || 2
			},
			getPageOffset: function() {
				var a = this.getTarget().getDocument().$;
				return {
					x: this.$.pageX || this.$.clientX + (a.documentElement.scrollLeft || a.body.scrollLeft),
					y: this.$.pageY || this.$.clientY + (a.documentElement.scrollTop || a.body.scrollTop)
				}
			}
		}, CKEDITOR.CTRL = 1114112, CKEDITOR.SHIFT = 2228224, CKEDITOR.ALT =
		4456448, CKEDITOR.EVENT_PHASE_CAPTURING = 1, CKEDITOR.EVENT_PHASE_AT_TARGET = 2, CKEDITOR.EVENT_PHASE_BUBBLING = 3, CKEDITOR.dom.domObject = function(a) {
			if (a) this.$ = a
		}, CKEDITOR.dom.domObject.prototype = function() {
			var a = function(a, b) {
				return function(d) {
					typeof CKEDITOR != "undefined" && a.fire(b, new CKEDITOR.dom.event(d))
				}
			};
			return {
				getPrivate: function() {
					var a;
					if (!(a = this.getCustomData("_"))) this.setCustomData("_", a = {});
					return a
				},
				on: function(e) {
					var b = this.getCustomData("_cke_nativeListeners");
					if (!b) {
						b = {};
						this.setCustomData("_cke_nativeListeners",
							b)
					}
					if (!b[e]) {
						b = b[e] = a(this, e);
						this.$.addEventListener ? this.$.addEventListener(e, b, !!CKEDITOR.event.useCapture) : this.$.attachEvent && this.$.attachEvent("on" + e, b)
					}
					return CKEDITOR.event.prototype.on.apply(this, arguments)
				},
				removeListener: function(a) {
					CKEDITOR.event.prototype.removeListener.apply(this, arguments);
					if (!this.hasListeners(a)) {
						var b = this.getCustomData("_cke_nativeListeners"),
							d = b && b[a];
						if (d) {
							this.$.removeEventListener ? this.$.removeEventListener(a, d, false) : this.$.detachEvent && this.$.detachEvent("on" +
								a, d);
							delete b[a]
						}
					}
				},
				removeAllListeners: function() {
					var a = this.getCustomData("_cke_nativeListeners"),
						b;
					for (b in a) {
						var d = a[b];
						this.$.detachEvent ? this.$.detachEvent("on" + b, d) : this.$.removeEventListener && this.$.removeEventListener(b, d, false);
						delete a[b]
					}
					CKEDITOR.event.prototype.removeAllListeners.call(this)
				}
			}
		}(),
		function(a) {
			var e = {};
			CKEDITOR.on("reset", function() {
				e = {}
			});
			a.equals = function(a) {
				try {
					return a && a.$ === this.$
				} catch (d) {
					return false
				}
			};
			a.setCustomData = function(a, d) {
				var f = this.getUniqueId();
				(e[f] ||
					(e[f] = {}))[a] = d;
				return this
			};
			a.getCustomData = function(a) {
				var d = this.$["data-cke-expando"];
				return (d = d && e[d]) && a in d ? d[a] : null
			};
			a.removeCustomData = function(a) {
				var d = this.$["data-cke-expando"],
					d = d && e[d],
					f, c;
				if (d) {
					f = d[a];
					c = a in d;
					delete d[a]
				}
				return c ? f : null
			};
			a.clearCustomData = function() {
				this.removeAllListeners();
				var a = this.$["data-cke-expando"];
				a && delete e[a]
			};
			a.getUniqueId = function() {
				return this.$["data-cke-expando"] || (this.$["data-cke-expando"] = CKEDITOR.tools.getNextNumber())
			};
			CKEDITOR.event.implementOn(a)
		}(CKEDITOR.dom.domObject.prototype),
		CKEDITOR.dom.node = function(a) {
			return a ? new CKEDITOR.dom[a.nodeType == CKEDITOR.NODE_DOCUMENT ? "document" : a.nodeType == CKEDITOR.NODE_ELEMENT ? "element" : a.nodeType == CKEDITOR.NODE_TEXT ? "text" : a.nodeType == CKEDITOR.NODE_COMMENT ? "comment" : a.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? "documentFragment" : "domObject"](a) : this
		}, CKEDITOR.dom.node.prototype = new CKEDITOR.dom.domObject, CKEDITOR.NODE_ELEMENT = 1, CKEDITOR.NODE_DOCUMENT = 9, CKEDITOR.NODE_TEXT = 3, CKEDITOR.NODE_COMMENT = 8, CKEDITOR.NODE_DOCUMENT_FRAGMENT = 11, CKEDITOR.POSITION_IDENTICAL =
		0, CKEDITOR.POSITION_DISCONNECTED = 1, CKEDITOR.POSITION_FOLLOWING = 2, CKEDITOR.POSITION_PRECEDING = 4, CKEDITOR.POSITION_IS_CONTAINED = 8, CKEDITOR.POSITION_CONTAINS = 16, CKEDITOR.tools.extend(CKEDITOR.dom.node.prototype, {
			appendTo: function(a, e) {
				a.append(this, e);
				return a
			},
			clone: function(a, e) {
				var b = this.$.cloneNode(a),
					d = function(f) {
						f["data-cke-expando"] && (f["data-cke-expando"] = false);
						if (f.nodeType == CKEDITOR.NODE_ELEMENT) {
							e || f.removeAttribute("id", false);
							if (a)
								for (var f = f.childNodes, c = 0; c < f.length; c++) d(f[c])
						}
					};
				d(b);
				return new CKEDITOR.dom.node(b)
			},
			hasPrevious: function() {
				return !!this.$.previousSibling
			},
			hasNext: function() {
				return !!this.$.nextSibling
			},
			insertAfter: function(a) {
				a.$.parentNode.insertBefore(this.$, a.$.nextSibling);
				return a
			},
			insertBefore: function(a) {
				a.$.parentNode.insertBefore(this.$, a.$);
				return a
			},
			insertBeforeMe: function(a) {
				this.$.parentNode.insertBefore(a.$, this.$);
				return a
			},
			getAddress: function(a) {
				for (var e = [], b = this.getDocument().$.documentElement, d = this.$; d && d != b;) {
					var f = d.parentNode;
					f && e.unshift(this.getIndex.call({
							$: d
						},
						a));
					d = f
				}
				return e
			},
			getDocument: function() {
				return new CKEDITOR.dom.document(this.$.ownerDocument || this.$.parentNode.ownerDocument)
			},
			getIndex: function(a) {
				var e = this.$,
					b = -1,
					d;
				if (!this.$.parentNode) return b;
				do
					if (!a || !(e != this.$ && e.nodeType == CKEDITOR.NODE_TEXT && (d || !e.nodeValue))) {
						b++;
						d = e.nodeType == CKEDITOR.NODE_TEXT
					}
				while (e = e.previousSibling);
				return b
			},
			getNextSourceNode: function(a, e, b) {
				if (b && !b.call) var d = b,
					b = function(a) {
						return !a.equals(d)
					};
				var a = !a && this.getFirst && this.getFirst(),
					f;
				if (!a) {
					if (this.type ==
						CKEDITOR.NODE_ELEMENT && b && b(this, true) === false) return null;
					a = this.getNext()
				}
				for (; !a && (f = (f || this).getParent());) {
					if (b && b(f, true) === false) return null;
					a = f.getNext()
				}
				return !a || b && b(a) === false ? null : e && e != a.type ? a.getNextSourceNode(false, e, b) : a
			},
			getPreviousSourceNode: function(a, e, b) {
				if (b && !b.call) var d = b,
					b = function(a) {
						return !a.equals(d)
					};
				var a = !a && this.getLast && this.getLast(),
					f;
				if (!a) {
					if (this.type == CKEDITOR.NODE_ELEMENT && b && b(this, true) === false) return null;
					a = this.getPrevious()
				}
				for (; !a && (f = (f || this).getParent());) {
					if (b &&
						b(f, true) === false) return null;
					a = f.getPrevious()
				}
				return !a || b && b(a) === false ? null : e && a.type != e ? a.getPreviousSourceNode(false, e, b) : a
			},
			getPrevious: function(a) {
				var e = this.$,
					b;
				do b = (e = e.previousSibling) && e.nodeType != 10 && new CKEDITOR.dom.node(e); while (b && a && !a(b));
				return b
			},
			getNext: function(a) {
				var e = this.$,
					b;
				do b = (e = e.nextSibling) && new CKEDITOR.dom.node(e); while (b && a && !a(b));
				return b
			},
			getParent: function(a) {
				var e = this.$.parentNode;
				return e && (e.nodeType == CKEDITOR.NODE_ELEMENT || a && e.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT) ?
					new CKEDITOR.dom.node(e) : null
			},
			getParents: function(a) {
				var e = this,
					b = [];
				do b[a ? "push" : "unshift"](e); while (e = e.getParent());
				return b
			},
			getCommonAncestor: function(a) {
				if (a.equals(this)) return this;
				if (a.contains && a.contains(this)) return a;
				var e = this.contains ? this : this.getParent();
				do
					if (e.contains(a)) return e;
				while (e = e.getParent());
				return null
			},
			getPosition: function(a) {
				var e = this.$,
					b = a.$;
				if (e.compareDocumentPosition) return e.compareDocumentPosition(b);
				if (e == b) return CKEDITOR.POSITION_IDENTICAL;
				if (this.type ==
					CKEDITOR.NODE_ELEMENT && a.type == CKEDITOR.NODE_ELEMENT) {
					if (e.contains) {
						if (e.contains(b)) return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
						if (b.contains(e)) return CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING
					}
					if ("sourceIndex" in e) return e.sourceIndex < 0 || b.sourceIndex < 0 ? CKEDITOR.POSITION_DISCONNECTED : e.sourceIndex < b.sourceIndex ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING
				}
				for (var e = this.getAddress(), a = a.getAddress(), b = Math.min(e.length, a.length), d = 0; d <= b - 1; d++)
					if (e[d] !=
						a[d]) {
						if (d < b) return e[d] < a[d] ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
						break
					}
				return e.length < a.length ? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING
			},
			getAscendant: function(a, e) {
				var b = this.$,
					d;
				if (!e) b = b.parentNode;
				for (; b;) {
					if (b.nodeName && (d = b.nodeName.toLowerCase(), typeof a == "string" ? d == a : d in a)) return new CKEDITOR.dom.node(b);
					try {
						b = b.parentNode
					} catch (f) {
						b = null
					}
				}
				return null
			},
			hasAscendant: function(a, e) {
				var b = this.$;
				if (!e) b =
					b.parentNode;
				for (; b;) {
					if (b.nodeName && b.nodeName.toLowerCase() == a) return true;
					b = b.parentNode
				}
				return false
			},
			move: function(a, e) {
				a.append(this.remove(), e)
			},
			remove: function(a) {
				var e = this.$,
					b = e.parentNode;
				if (b) {
					if (a)
						for (; a = e.firstChild;) b.insertBefore(e.removeChild(a), e);
					b.removeChild(e)
				}
				return this
			},
			replace: function(a) {
				this.insertBefore(a);
				a.remove()
			},
			trim: function() {
				this.ltrim();
				this.rtrim()
			},
			ltrim: function() {
				for (var a; this.getFirst && (a = this.getFirst());) {
					if (a.type == CKEDITOR.NODE_TEXT) {
						var e = CKEDITOR.tools.ltrim(a.getText()),
							b = a.getLength();
						if (e) {
							if (e.length < b) {
								a.split(b - e.length);
								this.$.removeChild(this.$.firstChild)
							}
						} else {
							a.remove();
							continue
						}
					}
					break
				}
			},
			rtrim: function() {
				for (var a; this.getLast && (a = this.getLast());) {
					if (a.type == CKEDITOR.NODE_TEXT) {
						var e = CKEDITOR.tools.rtrim(a.getText()),
							b = a.getLength();
						if (e) {
							if (e.length < b) {
								a.split(e.length);
								this.$.lastChild.parentNode.removeChild(this.$.lastChild)
							}
						} else {
							a.remove();
							continue
						}
					}
					break
				}
				if (CKEDITOR.env.needsBrFiller)(a = this.$.lastChild) && (a.type == 1 && a.nodeName.toLowerCase() == "br") &&
					a.parentNode.removeChild(a)
			},
			isReadOnly: function() {
				var a = this;
				this.type != CKEDITOR.NODE_ELEMENT && (a = this.getParent());
				if (a && typeof a.$.isContentEditable != "undefined") return !(a.$.isContentEditable || a.data("cke-editable"));
				for (; a;) {
					if (a.data("cke-editable")) break;
					if (a.getAttribute("contentEditable") == "false") return true;
					if (a.getAttribute("contentEditable") == "true") break;
					a = a.getParent()
				}
				return !a
			}
		}), CKEDITOR.dom.window = function(a) {
			CKEDITOR.dom.domObject.call(this, a)
		}, CKEDITOR.dom.window.prototype = new CKEDITOR.dom.domObject,
		CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype, {
			focus: function() {
				this.$.focus()
			},
			getViewPaneSize: function() {
				var a = this.$.document,
					e = a.compatMode == "CSS1Compat";
				return {
					width: (e ? a.documentElement.clientWidth : a.body.clientWidth) || 0,
					height: (e ? a.documentElement.clientHeight : a.body.clientHeight) || 0
				}
			},
			getScrollPosition: function() {
				var a = this.$;
				if ("pageXOffset" in a) return {
					x: a.pageXOffset || 0,
					y: a.pageYOffset || 0
				};
				a = a.document;
				return {
					x: a.documentElement.scrollLeft || a.body.scrollLeft || 0,
					y: a.documentElement.scrollTop ||
						a.body.scrollTop || 0
				}
			},
			getFrame: function() {
				var a = this.$.frameElement;
				return a ? new CKEDITOR.dom.element.get(a) : null
			}
		}), CKEDITOR.dom.document = function(a) {
			CKEDITOR.dom.domObject.call(this, a)
		}, CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject, CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype, {
			type: CKEDITOR.NODE_DOCUMENT,
			appendStyleSheet: function(a) {
				if (this.$.createStyleSheet) this.$.createStyleSheet(a);
				else {
					var e = new CKEDITOR.dom.element("link");
					e.setAttributes({
						rel: "stylesheet",
						type: "text/css",
						href: a
					});
					this.getHead().append(e)
				}
			},
			appendStyleText: function(a) {
				if (this.$.createStyleSheet) {
					var e = this.$.createStyleSheet("");
					e.cssText = a
				} else {
					var b = new CKEDITOR.dom.element("style", this);
					b.append(new CKEDITOR.dom.text(a, this));
					this.getHead().append(b)
				}
				return e || b.$.sheet
			},
			createElement: function(a, e) {
				var b = new CKEDITOR.dom.element(a, this);
				if (e) {
					e.attributes && b.setAttributes(e.attributes);
					e.styles && b.setStyles(e.styles)
				}
				return b
			},
			createText: function(a) {
				return new CKEDITOR.dom.text(a, this)
			},
			focus: function() {
				this.getWindow().focus()
			},
			getActive: function() {
				return new CKEDITOR.dom.element(this.$.activeElement)
			},
			getById: function(a) {
				return (a = this.$.getElementById(a)) ? new CKEDITOR.dom.element(a) : null
			},
			getByAddress: function(a, e) {
				for (var b = this.$.documentElement, d = 0; b && d < a.length; d++) {
					var f = a[d];
					if (e)
						for (var c = -1, h = 0; h < b.childNodes.length; h++) {
							var j = b.childNodes[h];
							if (!(e === true && j.nodeType == 3 && j.previousSibling && j.previousSibling.nodeType == 3)) {
								c++;
								if (c == f) {
									b = j;
									break
								}
							}
						} else b = b.childNodes[f]
				}
				return b ? new CKEDITOR.dom.node(b) : null
			},
			getElementsByTag: function(a,
				e) {
				if ((!CKEDITOR.env.ie || document.documentMode > 8) && e) a = e + ":" + a;
				return new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(a))
			},
			getHead: function() {
				var a = this.$.getElementsByTagName("head")[0];
				return a = a ? new CKEDITOR.dom.element(a) : this.getDocumentElement().append(new CKEDITOR.dom.element("head"), true)
			},
			getBody: function() {
				return new CKEDITOR.dom.element(this.$.body)
			},
			getDocumentElement: function() {
				return new CKEDITOR.dom.element(this.$.documentElement)
			},
			getWindow: function() {
				return new CKEDITOR.dom.window(this.$.parentWindow ||
					this.$.defaultView)
			},
			write: function(a) {
				this.$.open("text/html", "replace");
				CKEDITOR.env.ie && (a = a.replace(/(?:^\s*<!DOCTYPE[^>]*?>)|^/i, '$&\n<script data-cke-temp="1">(' + CKEDITOR.tools.fixDomain + ")();<\/script>"));
				this.$.write(a);
				this.$.close()
			},
			find: function(a) {
				return new CKEDITOR.dom.nodeList(this.$.querySelectorAll(a))
			},
			findOne: function(a) {
				return (a = this.$.querySelector(a)) ? new CKEDITOR.dom.element(a) : null
			},
			_getHtml5ShivFrag: function() {
				var a = this.getCustomData("html5ShivFrag");
				if (!a) {
					a = this.$.createDocumentFragment();
					CKEDITOR.tools.enableHtml5Elements(a, true);
					this.setCustomData("html5ShivFrag", a)
				}
				return a
			}
		}), CKEDITOR.dom.nodeList = function(a) {
			this.$ = a
		}, CKEDITOR.dom.nodeList.prototype = {
			count: function() {
				return this.$.length
			},
			getItem: function(a) {
				if (a < 0 || a >= this.$.length) return null;
				return (a = this.$[a]) ? new CKEDITOR.dom.node(a) : null
			}
		}, CKEDITOR.dom.element = function(a, e) {
			typeof a == "string" && (a = (e ? e.$ : document).createElement(a));
			CKEDITOR.dom.domObject.call(this, a)
		}, CKEDITOR.dom.element.get = function(a) {
			return (a = typeof a ==
				"string" ? document.getElementById(a) || document.getElementsByName(a)[0] : a) && (a.$ ? a : new CKEDITOR.dom.element(a))
		}, CKEDITOR.dom.element.prototype = new CKEDITOR.dom.node, CKEDITOR.dom.element.createFromHtml = function(a, e) {
			var b = new CKEDITOR.dom.element("div", e);
			b.setHtml(a);
			return b.getFirst().remove()
		}, CKEDITOR.dom.element.setMarker = function(a, e, b, d) {
			var f = e.getCustomData("list_marker_id") || e.setCustomData("list_marker_id", CKEDITOR.tools.getNextNumber()).getCustomData("list_marker_id"),
				c = e.getCustomData("list_marker_names") ||
				e.setCustomData("list_marker_names", {}).getCustomData("list_marker_names");
			a[f] = e;
			c[b] = 1;
			return e.setCustomData(b, d)
		}, CKEDITOR.dom.element.clearAllMarkers = function(a) {
			for (var e in a) CKEDITOR.dom.element.clearMarkers(a, a[e], 1)
		}, CKEDITOR.dom.element.clearMarkers = function(a, e, b) {
			var d = e.getCustomData("list_marker_names"),
				f = e.getCustomData("list_marker_id"),
				c;
			for (c in d) e.removeCustomData(c);
			e.removeCustomData("list_marker_names");
			if (b) {
				e.removeCustomData("list_marker_id");
				delete a[f]
			}
		},
		function() {
			function a(a) {
				var c =
					true;
				if (!a.$.id) {
					a.$.id = "cke_tmp_" + CKEDITOR.tools.getNextNumber();
					c = false
				}
				return function() {
					c || a.removeAttribute("id")
				}
			}

			function e(a, c) {
				return "#" + a.$.id + " " + c.split(/,\s*/).join(", #" + a.$.id + " ")
			}

			function b(a) {
				for (var c = 0, b = 0, e = d[a].length; b < e; b++) c = c + (parseInt(this.getComputedStyle(d[a][b]) || 0, 10) || 0);
				return c
			}
			CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype, {
				type: CKEDITOR.NODE_ELEMENT,
				addClass: function(a) {
					var c = this.$.className;
					c && (RegExp("(?:^|\\s)" + a + "(?:\\s|$)", "").test(c) || (c = c + (" " + a)));
					this.$.className = c || a;
					return this
				},
				removeClass: function(a) {
					var c = this.getAttribute("class");
					if (c) {
						a = RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "i");
						if (a.test(c))(c = c.replace(a, "").replace(/^\s+/, "")) ? this.setAttribute("class", c) : this.removeAttribute("class")
					}
					return this
				},
				hasClass: function(a) {
					return RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "").test(this.getAttribute("class"))
				},
				append: function(a, c) {
					typeof a == "string" && (a = this.getDocument().createElement(a));
					c ? this.$.insertBefore(a.$, this.$.firstChild) : this.$.appendChild(a.$);
					return a
				},
				appendHtml: function(a) {
					if (this.$.childNodes.length) {
						var c = new CKEDITOR.dom.element("div", this.getDocument());
						c.setHtml(a);
						c.moveChildren(this)
					} else this.setHtml(a)
				},
				appendText: function(a) {
					this.$.text != void 0 ? this.$.text = this.$.text + a : this.append(new CKEDITOR.dom.text(a))
				},
				appendBogus: function(a) {
					if (a || CKEDITOR.env.needsBrFiller) {
						for (a = this.getLast(); a && a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.rtrim(a.getText());) a = a.getPrevious();
						if (!a || !a.is || !a.is("br")) {
							a = this.getDocument().createElement("br");
							CKEDITOR.env.gecko && a.setAttribute("type", "_moz");
							this.append(a)
						}
					}
				},
				breakParent: function(a) {
					var c = new CKEDITOR.dom.range(this.getDocument());
					c.setStartAfter(this);
					c.setEndAfter(a);
					a = c.extractContents();
					c.insertNode(this.remove());
					a.insertAfterNode(this)
				},
				contains: CKEDITOR.env.ie || CKEDITOR.env.webkit ? function(a) {
					var c = this.$;
					return a.type != CKEDITOR.NODE_ELEMENT ? c.contains(a.getParent().$) : c != a.$ && c.contains(a.$)
				} : function(a) {
					return !!(this.$.compareDocumentPosition(a.$) & 16)
				},
				focus: function() {
					function a() {
						try {
							this.$.focus()
						} catch (f) {}
					}
					return function(c) {
						c ? CKEDITOR.tools.setTimeout(a, 100, this) : a.call(this)
					}
				}(),
				getHtml: function() {
					var a = this.$.innerHTML;
					return CKEDITOR.env.ie ? a.replace(/<\?[^>]*>/g, "") : a
				},
				getOuterHtml: function() {
					if (this.$.outerHTML) return this.$.outerHTML.replace(/<\?[^>]*>/, "");
					var a = this.$.ownerDocument.createElement("div");
					a.appendChild(this.$.cloneNode(true));
					return a.innerHTML
				},
				getClientRect: function() {
					var a = CKEDITOR.tools.extend({}, this.$.getBoundingClientRect());
					!a.width && (a.width = a.right - a.left);
					!a.height &&
						(a.height = a.bottom - a.top);
					return a
				},
				setHtml: CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? function(a) {
					try {
						var c = this.$;
						if (this.getParent()) return c.innerHTML = a;
						var b = this.getDocument()._getHtml5ShivFrag();
						b.appendChild(c);
						c.innerHTML = a;
						b.removeChild(c);
						return a
					} catch (d) {
						this.$.innerHTML = "";
						c = new CKEDITOR.dom.element("body", this.getDocument());
						c.$.innerHTML = a;
						for (c = c.getChildren(); c.count();) this.append(c.getItem(0));
						return a
					}
				} : function(a) {
					return this.$.innerHTML = a
				},
				setText: function(a) {
					CKEDITOR.dom.element.prototype.setText =
						this.$.innerText != void 0 ? function(a) {
							return this.$.innerText = a
						} : function(a) {
							return this.$.textContent = a
						};
					return this.setText(a)
				},
				getAttribute: function() {
					var a = function(a) {
						return this.$.getAttribute(a, 2)
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
								a !== 0 && this.$.tabIndex === 0 && (a = null);
								return a;
							case "checked":
								a =
									this.$.attributes.getNamedItem(a);
								return (a.specified ? a.nodeValue : this.$.checked) ? "checked" : null;
							case "hspace":
							case "value":
								return this.$[a];
							case "style":
								return this.$.style.cssText;
							case "contenteditable":
							case "contentEditable":
								return this.$.attributes.getNamedItem("contentEditable").specified ? this.$.getAttribute("contentEditable") : null
						}
						return this.$.getAttribute(a, 2)
					} : a
				}(),
				getChildren: function() {
					return new CKEDITOR.dom.nodeList(this.$.childNodes)
				},
				getComputedStyle: CKEDITOR.env.ie ? function(a) {
					return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(a)]
				} : function(a) {
					var c = this.getWindow().$.getComputedStyle(this.$, null);
					return c ? c.getPropertyValue(a) : ""
				},
				getDtd: function() {
					var a = CKEDITOR.dtd[this.getName()];
					this.getDtd = function() {
						return a
					};
					return a
				},
				getElementsByTag: CKEDITOR.dom.document.prototype.getElementsByTag,
				getTabIndex: CKEDITOR.env.ie ? function() {
					var a = this.$.tabIndex;
					a === 0 && (!CKEDITOR.dtd.$tabIndex[this.getName()] && parseInt(this.getAttribute("tabindex"), 10) !== 0) && (a = -1);
					return a
				} : CKEDITOR.env.webkit ? function() {
					var a = this.$.tabIndex;
					if (a == void 0) {
						a =
							parseInt(this.getAttribute("tabindex"), 10);
						isNaN(a) && (a = -1)
					}
					return a
				} : function() {
					return this.$.tabIndex
				},
				getText: function() {
					return this.$.textContent || this.$.innerText || ""
				},
				getWindow: function() {
					return this.getDocument().getWindow()
				},
				getId: function() {
					return this.$.id || null
				},
				getNameAtt: function() {
					return this.$.name || null
				},
				getName: function() {
					var a = this.$.nodeName.toLowerCase();
					if (CKEDITOR.env.ie && !(document.documentMode > 8)) {
						var c = this.$.scopeName;
						c != "HTML" && (a = c.toLowerCase() + ":" + a)
					}
					return (this.getName =
						function() {
							return a
						})()
				},
				getValue: function() {
					return this.$.value
				},
				getFirst: function(a) {
					var c = this.$.firstChild;
					(c = c && new CKEDITOR.dom.node(c)) && (a && !a(c)) && (c = c.getNext(a));
					return c
				},
				getLast: function(a) {
					var c = this.$.lastChild;
					(c = c && new CKEDITOR.dom.node(c)) && (a && !a(c)) && (c = c.getPrevious(a));
					return c
				},
				getStyle: function(a) {
					return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)]
				},
				is: function() {
					var a = this.getName();
					if (typeof arguments[0] == "object") return !!arguments[0][a];
					for (var c = 0; c < arguments.length; c++)
						if (arguments[c] ==
							a) return true;
					return false
				},
				isEditable: function(a) {
					var c = this.getName();
					if (this.isReadOnly() || this.getComputedStyle("display") == "none" || this.getComputedStyle("visibility") == "hidden" || CKEDITOR.dtd.$nonEditable[c] || CKEDITOR.dtd.$empty[c] || this.is("a") && (this.data("cke-saved-name") || this.hasAttribute("name")) && !this.getChildCount()) return false;
					if (a !== false) {
						a = CKEDITOR.dtd[c] || CKEDITOR.dtd.span;
						return !(!a || !a["#"])
					}
					return true
				},
				isIdentical: function(a) {
					var c = this.clone(0, 1),
						a = a.clone(0, 1);
					c.removeAttributes(["_moz_dirty",
						"data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"
					]);
					a.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
					if (c.$.isEqualNode) {
						c.$.style.cssText = CKEDITOR.tools.normalizeCssText(c.$.style.cssText);
						a.$.style.cssText = CKEDITOR.tools.normalizeCssText(a.$.style.cssText);
						return c.$.isEqualNode(a.$)
					}
					c = c.getOuterHtml();
					a = a.getOuterHtml();
					if (CKEDITOR.env.ie && CKEDITOR.env.version < 9 && this.is("a")) {
						var b = this.getParent();
						if (b.type == CKEDITOR.NODE_ELEMENT) {
							b =
								b.clone();
							b.setHtml(c);
							c = b.getHtml();
							b.setHtml(a);
							a = b.getHtml()
						}
					}
					return c == a
				},
				isVisible: function() {
					var a = (this.$.offsetHeight || this.$.offsetWidth) && this.getComputedStyle("visibility") != "hidden",
						c, b;
					if (a && CKEDITOR.env.webkit) {
						c = this.getWindow();
						if (!c.equals(CKEDITOR.document.getWindow()) && (b = c.$.frameElement)) a = (new CKEDITOR.dom.element(b)).isVisible()
					}
					return !!a
				},
				isEmptyInlineRemoveable: function() {
					if (!CKEDITOR.dtd.$removeEmpty[this.getName()]) return false;
					for (var a = this.getChildren(), c = 0, b = a.count(); c <
						b; c++) {
						var d = a.getItem(c);
						if (!(d.type == CKEDITOR.NODE_ELEMENT && d.data("cke-bookmark")) && (d.type == CKEDITOR.NODE_ELEMENT && !d.isEmptyInlineRemoveable() || d.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(d.getText()))) return false
					}
					return true
				},
				hasAttributes: CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function() {
					for (var a = this.$.attributes, c = 0; c < a.length; c++) {
						var b = a[c];
						switch (b.nodeName) {
							case "class":
								if (this.getAttribute("class")) return true;
							case "data-cke-expando":
								continue;
							default:
								if (b.specified) return true
						}
					}
					return false
				} : function() {
					var a = this.$.attributes,
						c = a.length,
						b = {
							"data-cke-expando": 1,
							_moz_dirty: 1
						};
					return c > 0 && (c > 2 || !b[a[0].nodeName] || c == 2 && !b[a[1].nodeName])
				},
				hasAttribute: function() {
					function a(f) {
						return (f = this.$.attributes.getNamedItem(f)) ? CKEDITOR.env.ie ? f.specified : true : false
					}
					return CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? function(c) {
						return c == "name" ? !!this.$.name : a.call(this, c)
					} : a
				}(),
				hide: function() {
					this.setStyle("display", "none")
				},
				moveChildren: function(a, c) {
					var b = this.$,
						a = a.$;
					if (b != a) {
						var d;
						if (c)
							for (; d =
								b.lastChild;) a.insertBefore(b.removeChild(d), a.firstChild);
						else
							for (; d = b.firstChild;) a.appendChild(b.removeChild(d))
					}
				},
				mergeSiblings: function() {
					function a(f, b, d) {
						if (b && b.type == CKEDITOR.NODE_ELEMENT) {
							for (var e = []; b.data("cke-bookmark") || b.isEmptyInlineRemoveable();) {
								e.push(b);
								b = d ? b.getNext() : b.getPrevious();
								if (!b || b.type != CKEDITOR.NODE_ELEMENT) return
							}
							if (f.isIdentical(b)) {
								for (var i = d ? f.getLast() : f.getFirst(); e.length;) e.shift().move(f, !d);
								b.moveChildren(f, !d);
								b.remove();
								i && i.type == CKEDITOR.NODE_ELEMENT &&
									i.mergeSiblings()
							}
						}
					}
					return function(c) {
						if (c === false || CKEDITOR.dtd.$removeEmpty[this.getName()] || this.is("a")) {
							a(this, this.getNext(), true);
							a(this, this.getPrevious())
						}
					}
				}(),
				show: function() {
					this.setStyles({
						display: "",
						visibility: ""
					})
				},
				setAttribute: function() {
					var a = function(a, f) {
						this.$.setAttribute(a, f);
						return this
					};
					return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(c, b) {
						c == "class" ? this.$.className = b : c == "style" ? this.$.style.cssText = b : c == "tabindex" ? this.$.tabIndex = b : c == "checked" ?
							this.$.checked = b : c == "contenteditable" ? a.call(this, "contentEditable", b) : a.apply(this, arguments);
						return this
					} : CKEDITOR.env.ie8Compat && CKEDITOR.env.secure ? function(c, b) {
						if (c == "src" && b.match(/^http:\/\//)) try {
							a.apply(this, arguments)
						} catch (d) {} else a.apply(this, arguments);
						return this
					} : a
				}(),
				setAttributes: function(a) {
					for (var c in a) this.setAttribute(c, a[c]);
					return this
				},
				setValue: function(a) {
					this.$.value = a;
					return this
				},
				removeAttribute: function() {
					var a = function(a) {
						this.$.removeAttribute(a)
					};
					return CKEDITOR.env.ie &&
						(CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(a) {
							a == "class" ? a = "className" : a == "tabindex" ? a = "tabIndex" : a == "contenteditable" && (a = "contentEditable");
							this.$.removeAttribute(a)
						} : a
				}(),
				removeAttributes: function(a) {
					if (CKEDITOR.tools.isArray(a))
						for (var c = 0; c < a.length; c++) this.removeAttribute(a[c]);
					else
						for (c in a) a.hasOwnProperty(c) && this.removeAttribute(c)
				},
				removeStyle: function(a) {
					var c = this.$.style;
					if (!c.removeProperty && (a == "border" || a == "margin" || a == "padding")) {
						var b = ["top", "left", "right", "bottom"],
							d;
						a == "border" && (d = ["color", "style", "width"]);
						for (var c = [], e = 0; e < b.length; e++)
							if (d)
								for (var i = 0; i < d.length; i++) c.push([a, b[e], d[i]].join("-"));
							else c.push([a, b[e]].join("-"));
						for (a = 0; a < c.length; a++) this.removeStyle(c[a])
					} else {
						c.removeProperty ? c.removeProperty(a) : c.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(a));
						this.$.style.cssText || this.removeAttribute("style")
					}
				},
				setStyle: function(a, c) {
					this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)] = c;
					return this
				},
				setStyles: function(a) {
					for (var c in a) this.setStyle(c,
						a[c]);
					return this
				},
				setOpacity: function(a) {
					if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
						a = Math.round(a * 100);
						this.setStyle("filter", a >= 100 ? "" : "progid:DXImageTransform.Microsoft.Alpha(opacity=" + a + ")")
					} else this.setStyle("opacity", a)
				},
				unselectable: function() {
					this.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select", "none"));
					if (CKEDITOR.env.ie) {
						this.setAttribute("unselectable", "on");
						for (var a, c = this.getElementsByTag("*"), b = 0, d = c.count(); b < d; b++) {
							a = c.getItem(b);
							a.setAttribute("unselectable", "on")
						}
					}
				},
				getPositionedAncestor: function() {
					for (var a =
						this; a.getName() != "html";) {
						if (a.getComputedStyle("position") != "static") return a;
						a = a.getParent()
					}
					return null
				},
				getDocumentPosition: function(a) {
					var c = 0,
						b = 0,
						d = this.getDocument(),
						e = d.getBody(),
						i = d.$.compatMode == "BackCompat";
					if (document.documentElement.getBoundingClientRect) {
						var k = this.$.getBoundingClientRect(),
							n = d.$.documentElement,
							o = n.clientTop || e.$.clientTop || 0,
							r = n.clientLeft || e.$.clientLeft || 0,
							l = true;
						if (CKEDITOR.env.ie) {
							l = d.getDocumentElement().contains(this);
							d = d.getBody().contains(this);
							l = i && d || !i &&
								l
						}
						if (l) {
							c = k.left + (!i && n.scrollLeft || e.$.scrollLeft);
							c = c - r;
							b = k.top + (!i && n.scrollTop || e.$.scrollTop);
							b = b - o
						}
					} else {
						e = this;
						for (d = null; e && !(e.getName() == "body" || e.getName() == "html");) {
							c = c + (e.$.offsetLeft - e.$.scrollLeft);
							b = b + (e.$.offsetTop - e.$.scrollTop);
							if (!e.equals(this)) {
								c = c + (e.$.clientLeft || 0);
								b = b + (e.$.clientTop || 0)
							}
							for (; d && !d.equals(e);) {
								c = c - d.$.scrollLeft;
								b = b - d.$.scrollTop;
								d = d.getParent()
							}
							d = e;
							e = (k = e.$.offsetParent) ? new CKEDITOR.dom.element(k) : null
						}
					} if (a) {
						e = this.getWindow();
						d = a.getWindow();
						if (!e.equals(d) &&
							e.$.frameElement) {
							a = (new CKEDITOR.dom.element(e.$.frameElement)).getDocumentPosition(a);
							c = c + a.x;
							b = b + a.y
						}
					}
					if (!document.documentElement.getBoundingClientRect && CKEDITOR.env.gecko && !i) {
						c = c + (this.$.clientLeft ? 1 : 0);
						b = b + (this.$.clientTop ? 1 : 0)
					}
					return {
						x: c,
						y: b
					}
				},
				scrollIntoView: function(a) {
					var c = this.getParent();
					if (c) {
						do {
							(c.$.clientWidth && c.$.clientWidth < c.$.scrollWidth || c.$.clientHeight && c.$.clientHeight < c.$.scrollHeight) && !c.is("body") && this.scrollIntoParent(c, a, 1);
							if (c.is("html")) {
								var b = c.getWindow();
								try {
									var d =
										b.$.frameElement;
									d && (c = new CKEDITOR.dom.element(d))
								} catch (e) {}
							}
						} while (c = c.getParent())
					}
				},
				scrollIntoParent: function(a, c, b) {
					var d, e, i, k;

					function n(c, b) {
						if (/body|html/.test(a.getName())) a.getWindow().$.scrollBy(c, b);
						else {
							a.$.scrollLeft = a.$.scrollLeft + c;
							a.$.scrollTop = a.$.scrollTop + b
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
							f.y = b.top
						}
						b = a.getWindow();
						if (!b.equals(c)) {
							b = o(CKEDITOR.dom.element.get(b.$.frameElement), c);
							f.x = f.x + b.x;
							f.y = f.y + b.y
						}
						return f
					}

					function r(a, c) {
						return parseInt(a.getComputedStyle("margin-" + c) || 0, 10) || 0
					}!a && (a = this.getWindow());
					i = a.getDocument();
					var l = i.$.compatMode == "BackCompat";
					a instanceof CKEDITOR.dom.window && (a = l ? i.getBody() : i.getDocumentElement());
					i = a.getWindow();
					e = o(this, i);
					var m = o(a, i),
						s = this.$.offsetHeight;
					d = this.$.offsetWidth;
					var t = a.$.clientHeight,
						p = a.$.clientWidth;
					i = e.x - r(this, "left") - m.x || 0;
					k = e.y - r(this, "top") - m.y || 0;
					d = e.x + d + r(this, "right") - (m.x + p) || 0;
					e = e.y + s + r(this, "bottom") - (m.y + t) || 0;
					if (k < 0 || e > 0) n(0, c === true ?
						k : c === false ? e : k < 0 ? k : e);
					if (b && (i < 0 || d > 0)) n(i < 0 ? i : d, 0)
				},
				setState: function(a, c, b) {
					c = c || "cke";
					switch (a) {
						case CKEDITOR.TRISTATE_ON:
							this.addClass(c + "_on");
							this.removeClass(c + "_off");
							this.removeClass(c + "_disabled");
							b && this.setAttribute("aria-pressed", true);
							b && this.removeAttribute("aria-disabled");
							break;
						case CKEDITOR.TRISTATE_DISABLED:
							this.addClass(c + "_disabled");
							this.removeClass(c + "_off");
							this.removeClass(c + "_on");
							b && this.setAttribute("aria-disabled", true);
							b && this.removeAttribute("aria-pressed");
							break;
						default:
							this.addClass(c +
								"_off");
							this.removeClass(c + "_on");
							this.removeClass(c + "_disabled");
							b && this.removeAttribute("aria-pressed");
							b && this.removeAttribute("aria-disabled")
					}
				},
				getFrameDocument: function() {
					var a = this.$;
					try {
						a.contentWindow.document
					} catch (c) {
						a.src = a.src
					}
					return a && new CKEDITOR.dom.document(a.contentWindow.document)
				},
				copyAttributes: function(a, c) {
					for (var b = this.$.attributes, c = c || {}, d = 0; d < b.length; d++) {
						var e = b[d],
							i = e.nodeName.toLowerCase(),
							k;
						if (!(i in c))
							if (i == "checked" && (k = this.getAttribute(i))) a.setAttribute(i, k);
							else if (!CKEDITOR.env.ie || this.hasAttribute(i)) {
							k = this.getAttribute(i);
							if (k === null) k = e.nodeValue;
							a.setAttribute(i, k)
						}
					}
					if (this.$.style.cssText !== "") a.$.style.cssText = this.$.style.cssText
				},
				renameNode: function(a) {
					if (this.getName() != a) {
						var c = this.getDocument(),
							a = new CKEDITOR.dom.element(a, c);
						this.copyAttributes(a);
						this.moveChildren(a);
						this.getParent() && this.$.parentNode.replaceChild(a.$, this.$);
						a.$["data-cke-expando"] = this.$["data-cke-expando"];
						this.$ = a.$;
						delete this.getName
					}
				},
				getChild: function() {
					function a(c,
						b) {
						var f = c.childNodes;
						if (b >= 0 && b < f.length) return f[b]
					}
					return function(c) {
						var b = this.$;
						if (c.slice)
							for (; c.length > 0 && b;) b = a(b, c.shift());
						else b = a(b, c);
						return b ? new CKEDITOR.dom.node(b) : null
					}
				}(),
				getChildCount: function() {
					return this.$.childNodes.length
				},
				disableContextMenu: function() {
					this.on("contextmenu", function(a) {
						a.data.getTarget().hasClass("cke_enable_context_menu") || a.data.preventDefault()
					})
				},
				getDirection: function(a) {
					return a ? this.getComputedStyle("direction") || this.getDirection() || this.getParent() &&
						this.getParent().getDirection(1) || this.getDocument().$.dir || "ltr" : this.getStyle("direction") || this.getAttribute("dir")
				},
				data: function(a, b) {
					a = "data-" + a;
					if (b === void 0) return this.getAttribute(a);
					b === false ? this.removeAttribute(a) : this.setAttribute(a, b);
					return null
				},
				getEditor: function() {
					var a = CKEDITOR.instances,
						b, d;
					for (b in a) {
						d = a[b];
						if (d.element.equals(this) && d.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) return d
					}
					return null
				},
				find: function(b) {
					var c = a(this),
						b = new CKEDITOR.dom.nodeList(this.$.querySelectorAll(e(this,
							b)));
					c();
					return b
				},
				findOne: function(b) {
					var c = a(this),
						b = this.$.querySelector(e(this, b));
					c();
					return b ? new CKEDITOR.dom.element(b) : null
				},
				forEach: function(a, b, d) {
					if (!d && (!b || this.type == b)) var e = a(this);
					if (e !== false)
						for (var d = this.getChildren(), g = 0; g < d.count(); g++) {
							e = d.getItem(g);
							e.type == CKEDITOR.NODE_ELEMENT ? e.forEach(a, b) : (!b || e.type == b) && a(e)
						}
				}
			});
			var d = {
				width: ["border-left-width", "border-right-width", "padding-left", "padding-right"],
				height: ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom"]
			};
			CKEDITOR.dom.element.prototype.setSize = function(a, c, d) {
				if (typeof c == "number") {
					if (d && (!CKEDITOR.env.ie || !CKEDITOR.env.quirks)) c = c - b.call(this, a);
					this.setStyle(a, c + "px")
				}
			};
			CKEDITOR.dom.element.prototype.getSize = function(a, c) {
				var d = Math.max(this.$["offset" + CKEDITOR.tools.capitalize(a)], this.$["client" + CKEDITOR.tools.capitalize(a)]) || 0;
				c && (d = d - b.call(this, a));
				return d
			}
		}(), CKEDITOR.dom.documentFragment = function(a) {
			a = a || CKEDITOR.document;
			this.$ = a.type == CKEDITOR.NODE_DOCUMENT ? a.$.createDocumentFragment() :
				a
		}, CKEDITOR.tools.extend(CKEDITOR.dom.documentFragment.prototype, CKEDITOR.dom.element.prototype, {
			type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
			insertAfterNode: function(a) {
				a = a.$;
				a.parentNode.insertBefore(this.$, a.nextSibling)
			}
		}, !0, {
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
		}),
		function() {
			function a(a, b) {
				var c = this.range;
				if (this._.end) return null;
				if (!this._.start) {
					this._.start = 1;
					if (c.collapsed) {
						this.end();
						return null
					}
					c.optimize()
				}
				var d, f = c.startContainer;
				d = c.endContainer;
				var e = c.startOffset,
					k = c.endOffset,
					g, h = this.guard,
					j = this.type,
					i = a ? "getPreviousSourceNode" : "getNextSourceNode";
				if (!a && !this._.guardLTR) {
					var B = d.type == CKEDITOR.NODE_ELEMENT ? d : d.getParent(),
						v = d.type == CKEDITOR.NODE_ELEMENT ? d.getChild(k) : d.getNext();
					this._.guardLTR = function(a, b) {
						return (!b || !B.equals(a)) && (!v || !a.equals(v)) && (a.type != CKEDITOR.NODE_ELEMENT ||
							!b || !a.equals(c.root))
					}
				}
				if (a && !this._.guardRTL) {
					var z = f.type == CKEDITOR.NODE_ELEMENT ? f : f.getParent(),
						w = f.type == CKEDITOR.NODE_ELEMENT ? e ? f.getChild(e - 1) : null : f.getPrevious();
					this._.guardRTL = function(a, b) {
						return (!b || !z.equals(a)) && (!w || !a.equals(w)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(c.root))
					}
				}
				var D = a ? this._.guardRTL : this._.guardLTR;
				g = h ? function(a, b) {
					return D(a, b) === false ? false : h(a, b)
				} : D;
				if (this.current) d = this.current[i](false, j, g);
				else {
					if (a) d.type == CKEDITOR.NODE_ELEMENT && (d = k > 0 ? d.getChild(k -
						1) : g(d, true) === false ? null : d.getPreviousSourceNode(true, j, g));
					else {
						d = f;
						if (d.type == CKEDITOR.NODE_ELEMENT && !(d = d.getChild(e))) d = g(f, true) === false ? null : f.getNextSourceNode(true, j, g)
					}
					d && g(d) === false && (d = null)
				}
				for (; d && !this._.end;) {
					this.current = d;
					if (!this.evaluator || this.evaluator(d) !== false) {
						if (!b) return d
					} else if (b && this.evaluator) return false;
					d = d[i](false, j, g)
				}
				this.end();
				return this.current = null
			}

			function e(b) {
				for (var c, d = null; c = a.call(this, b);) d = c;
				return d
			}

			function b(a) {
				if (i(a)) return false;
				if (a.type ==
					CKEDITOR.NODE_TEXT) return true;
				if (a.type == CKEDITOR.NODE_ELEMENT) {
					if (a.is(CKEDITOR.dtd.$inline) || a.is("hr") || a.getAttribute("contenteditable") == "false") return true;
					var b;
					if (b = !CKEDITOR.env.needsBrFiller)
						if (b = a.is(k)) a: {
							b = 0;
							for (var c = a.getChildCount(); b < c; ++b)
								if (!i(a.getChild(b))) {
									b = false;
									break a
								}
							b = true
						}
					if (b) return true
				}
				return false
			}
			CKEDITOR.dom.walker = CKEDITOR.tools.createClass({
				$: function(a) {
					this.range = a;
					this._ = {}
				},
				proto: {
					end: function() {
						this._.end = 1
					},
					next: function() {
						return a.call(this)
					},
					previous: function() {
						return a.call(this,
							1)
					},
					checkForward: function() {
						return a.call(this, 0, 1) !== false
					},
					checkBackward: function() {
						return a.call(this, 1, 1) !== false
					},
					lastForward: function() {
						return e.call(this)
					},
					lastBackward: function() {
						return e.call(this, 1)
					},
					reset: function() {
						delete this.current;
						this._ = {}
					}
				}
			});
			var d = {
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
				},
				f = {
					absolute: 1,
					fixed: 1
				};
			CKEDITOR.dom.element.prototype.isBlockBoundary =
				function(a) {
					return this.getComputedStyle("float") == "none" && !(this.getComputedStyle("position") in f) && d[this.getComputedStyle("display")] ? true : !!(this.is(CKEDITOR.dtd.$block) || a && this.is(a))
				};
			CKEDITOR.dom.walker.blockBoundary = function(a) {
				return function(b) {
					return !(b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary(a))
				}
			};
			CKEDITOR.dom.walker.listItemBoundary = function() {
				return this.blockBoundary({
					br: 1
				})
			};
			CKEDITOR.dom.walker.bookmark = function(a, b) {
				function c(a) {
					return a && a.getName && a.getName() == "span" &&
						a.data("cke-bookmark")
				}
				return function(d) {
					var f, e;
					f = d && d.type != CKEDITOR.NODE_ELEMENT && (e = d.getParent()) && c(e);
					f = a ? f : f || c(d);
					return !!(b ^ f)
				}
			};
			CKEDITOR.dom.walker.whitespaces = function(a) {
				return function(b) {
					var c;
					b && b.type == CKEDITOR.NODE_TEXT && (c = !CKEDITOR.tools.trim(b.getText()) || CKEDITOR.env.webkit && b.getText() == "​");
					return !!(a ^ c)
				}
			};
			CKEDITOR.dom.walker.invisible = function(a) {
				var b = CKEDITOR.dom.walker.whitespaces();
				return function(c) {
					if (b(c)) c = 1;
					else {
						c.type == CKEDITOR.NODE_TEXT && (c = c.getParent());
						c = !c.$.offsetHeight
					}
					return !!(a ^
						c)
				}
			};
			CKEDITOR.dom.walker.nodeType = function(a, b) {
				return function(c) {
					return !!(b ^ c.type == a)
				}
			};
			CKEDITOR.dom.walker.bogus = function(a) {
				function b(a) {
					return !h(a) && !j(a)
				}
				return function(d) {
					var f = CKEDITOR.env.needsBrFiller ? d.is && d.is("br") : d.getText && c.test(d.getText());
					if (f) {
						f = d.getParent();
						d = d.getNext(b);
						f = f.isBlockBoundary() && (!d || d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary())
					}
					return !!(a ^ f)
				}
			};
			CKEDITOR.dom.walker.temp = function(a) {
				return function(b) {
					b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent());
					b =
						b && b.hasAttribute("data-cke-temp");
					return !!(a ^ b)
				}
			};
			var c = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/,
				h = CKEDITOR.dom.walker.whitespaces(),
				j = CKEDITOR.dom.walker.bookmark(),
				g = CKEDITOR.dom.walker.temp();
			CKEDITOR.dom.walker.ignored = function(a) {
				return function(b) {
					b = h(b) || j(b) || g(b);
					return !!(a ^ b)
				}
			};
			var i = CKEDITOR.dom.walker.ignored(),
				k = function(a) {
					var b = {},
						c;
					for (c in a) CKEDITOR.dtd[c]["#"] && (b[c] = 1);
					return b
				}(CKEDITOR.dtd.$block);
			CKEDITOR.dom.walker.editable = function(a) {
				return function(c) {
					return !!(a ^ b(c))
				}
			};
			CKEDITOR.dom.element.prototype.getBogus =
				function() {
					var a = this;
					do a = a.getPreviousSourceNode(); while (j(a) || h(a) || a.type == CKEDITOR.NODE_ELEMENT && a.is(CKEDITOR.dtd.$inline) && !a.is(CKEDITOR.dtd.$empty));
					return a && (CKEDITOR.env.needsBrFiller ? a.is && a.is("br") : a.getText && c.test(a.getText())) ? a : false
				}
		}(), CKEDITOR.dom.range = function(a) {
			this.endOffset = this.endContainer = this.startOffset = this.startContainer = null;
			this.collapsed = true;
			var e = a instanceof CKEDITOR.dom.document;
			this.document = e ? a : a.getDocument();
			this.root = e ? a.getBody() : a
		},
		function() {
			function a() {
				var a =
					false,
					b = CKEDITOR.dom.walker.whitespaces(),
					d = CKEDITOR.dom.walker.bookmark(true),
					f = CKEDITOR.dom.walker.bogus();
				return function(e) {
					if (d(e) || b(e)) return true;
					if (f(e) && !a) return a = true;
					return e.type == CKEDITOR.NODE_TEXT && (e.hasAscendant("pre") || CKEDITOR.tools.trim(e.getText()).length) || e.type == CKEDITOR.NODE_ELEMENT && !e.is(c) ? false : true
				}
			}

			function e(a) {
				var b = CKEDITOR.dom.walker.whitespaces(),
					c = CKEDITOR.dom.walker.bookmark(1);
				return function(d) {
					return c(d) || b(d) ? true : !a && h(d) || d.type == CKEDITOR.NODE_ELEMENT &&
						d.is(CKEDITOR.dtd.$removeEmpty)
				}
			}

			function b(a) {
				return function() {
					var b;
					return this[a ? "getPreviousNode" : "getNextNode"](function(a) {
						!b && i(a) && (b = a);
						return g(a) && !(h(a) && a.equals(b))
					})
				}
			}
			var d = function(a) {
					a.collapsed = a.startContainer && a.endContainer && a.startContainer.equals(a.endContainer) && a.startOffset == a.endOffset
				},
				f = function(a, b, c, d) {
					a.optimizeBookmark();
					var f = a.startContainer,
						e = a.endContainer,
						g = a.startOffset,
						h = a.endOffset,
						j, i;
					if (e.type == CKEDITOR.NODE_TEXT) e = e.split(h);
					else if (e.getChildCount() > 0)
						if (h >=
							e.getChildCount()) {
							e = e.append(a.document.createText(""));
							i = true
						} else e = e.getChild(h);
					if (f.type == CKEDITOR.NODE_TEXT) {
						f.split(g);
						f.equals(e) && (e = f.getNext())
					} else if (g)
						if (g >= f.getChildCount()) {
							f = f.append(a.document.createText(""));
							j = true
						} else f = f.getChild(g).getPrevious();
					else {
						f = f.append(a.document.createText(""), 1);
						j = true
					}
					var g = f.getParents(),
						h = e.getParents(),
						q, u, B;
					for (q = 0; q < g.length; q++) {
						u = g[q];
						B = h[q];
						if (!u.equals(B)) break
					}
					for (var v = c, z, w, D, A = q; A < g.length; A++) {
						z = g[A];
						v && !z.equals(f) && (w = v.append(z.clone()));
						for (z = z.getNext(); z;) {
							if (z.equals(h[A]) || z.equals(e)) break;
							D = z.getNext();
							if (b == 2) v.append(z.clone(true));
							else {
								z.remove();
								b == 1 && v.append(z)
							}
							z = D
						}
						v && (v = w)
					}
					v = c;
					for (c = q; c < h.length; c++) {
						z = h[c];
						b > 0 && !z.equals(e) && (w = v.append(z.clone()));
						if (!g[c] || z.$.parentNode != g[c].$.parentNode)
							for (z = z.getPrevious(); z;) {
								if (z.equals(g[c]) || z.equals(f)) break;
								D = z.getPrevious();
								if (b == 2) v.$.insertBefore(z.$.cloneNode(true), v.$.firstChild);
								else {
									z.remove();
									b == 1 && v.$.insertBefore(z.$, v.$.firstChild)
								}
								z = D
							}
						v && (v = w)
					}
					if (b == 2) {
						u = a.startContainer;
						if (u.type == CKEDITOR.NODE_TEXT) {
							u.$.data = u.$.data + u.$.nextSibling.data;
							u.$.parentNode.removeChild(u.$.nextSibling)
						}
						a = a.endContainer;
						if (a.type == CKEDITOR.NODE_TEXT && a.$.nextSibling) {
							a.$.data = a.$.data + a.$.nextSibling.data;
							a.$.parentNode.removeChild(a.$.nextSibling)
						}
					} else {
						if (u && B && (f.$.parentNode != u.$.parentNode || e.$.parentNode != B.$.parentNode)) {
							b = B.getIndex();
							j && B.$.parentNode == f.$.parentNode && b--;
							if (d && u.type == CKEDITOR.NODE_ELEMENT) {
								d = CKEDITOR.dom.element.createFromHtml('<span data-cke-bookmark="1" style="display:none">&nbsp;</span>',
									a.document);
								d.insertAfter(u);
								u.mergeSiblings(false);
								a.moveToBookmark({
									startNode: d
								})
							} else a.setStart(B.getParent(), b)
						}
						a.collapse(true)
					}
					j && f.remove();
					i && e.$.parentNode && e.remove()
				},
				c = {
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
				},
				h = CKEDITOR.dom.walker.bogus(),
				j = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/,
				g = CKEDITOR.dom.walker.editable(),
				i = CKEDITOR.dom.walker.ignored(true);
			CKEDITOR.dom.range.prototype = {
				clone: function() {
					var a = new CKEDITOR.dom.range(this.root);
					a.startContainer = this.startContainer;
					a.startOffset = this.startOffset;
					a.endContainer = this.endContainer;
					a.endOffset = this.endOffset;
					a.collapsed = this.collapsed;
					return a
				},
				collapse: function(a) {
					if (a) {
						this.endContainer = this.startContainer;
						this.endOffset = this.startOffset
					} else {
						this.startContainer = this.endContainer;
						this.startOffset = this.endOffset
					}
					this.collapsed = true
				},
				cloneContents: function() {
					var a = new CKEDITOR.dom.documentFragment(this.document);
					this.collapsed ||
						f(this, 2, a);
					return a
				},
				deleteContents: function(a) {
					this.collapsed || f(this, 0, null, a)
				},
				extractContents: function(a) {
					var b = new CKEDITOR.dom.documentFragment(this.document);
					this.collapsed || f(this, 1, b, a);
					return b
				},
				createBookmark: function(a) {
					var b, c, d, f, e = this.collapsed;
					b = this.document.createElement("span");
					b.data("cke-bookmark", 1);
					b.setStyle("display", "none");
					b.setHtml("&nbsp;");
					if (a) {
						d = "cke_bm_" + CKEDITOR.tools.getNextNumber();
						b.setAttribute("id", d + (e ? "C" : "S"))
					}
					if (!e) {
						c = b.clone();
						c.setHtml("&nbsp;");
						a && c.setAttribute("id",
							d + "E");
						f = this.clone();
						f.collapse();
						f.insertNode(c)
					}
					f = this.clone();
					f.collapse(true);
					f.insertNode(b);
					if (c) {
						this.setStartAfter(b);
						this.setEndBefore(c)
					} else this.moveToPosition(b, CKEDITOR.POSITION_AFTER_END);
					return {
						startNode: a ? d + (e ? "C" : "S") : b,
						endNode: a ? d + "E" : c,
						serializable: a,
						collapsed: e
					}
				},
				createBookmark2: function() {
					function a(b) {
						var c = b.container,
							d = b.offset,
							f;
						f = c;
						var e = d;
						f = f.type != CKEDITOR.NODE_ELEMENT || e === 0 || e == f.getChildCount() ? 0 : f.getChild(e - 1).type == CKEDITOR.NODE_TEXT && f.getChild(e).type == CKEDITOR.NODE_TEXT;
						if (f) {
							c = c.getChild(d - 1);
							d = c.getLength()
						}
						c.type == CKEDITOR.NODE_ELEMENT && d > 1 && (d = c.getChild(d - 1).getIndex(true) + 1);
						if (c.type == CKEDITOR.NODE_TEXT) {
							f = c;
							for (e = 0;
								(f = f.getPrevious()) && f.type == CKEDITOR.NODE_TEXT;) e = e + f.getLength();
							d = d + e
						}
						b.container = c;
						b.offset = d
					}
					return function(b) {
						var c = this.collapsed,
							d = {
								container: this.startContainer,
								offset: this.startOffset
							},
							f = {
								container: this.endContainer,
								offset: this.endOffset
							};
						if (b) {
							a(d);
							c || a(f)
						}
						return {
							start: d.container.getAddress(b),
							end: c ? null : f.container.getAddress(b),
							startOffset: d.offset,
							endOffset: f.offset,
							normalized: b,
							collapsed: c,
							is2: true
						}
					}
				}(),
				moveToBookmark: function(a) {
					if (a.is2) {
						var b = this.document.getByAddress(a.start, a.normalized),
							c = a.startOffset,
							d = a.end && this.document.getByAddress(a.end, a.normalized),
							a = a.endOffset;
						this.setStart(b, c);
						d ? this.setEnd(d, a) : this.collapse(true)
					} else {
						b = (c = a.serializable) ? this.document.getById(a.startNode) : a.startNode;
						a = c ? this.document.getById(a.endNode) : a.endNode;
						this.setStartBefore(b);
						b.remove();
						if (a) {
							this.setEndBefore(a);
							a.remove()
						} else this.collapse(true)
					}
				},
				getBoundaryNodes: function() {
					var a = this.startContainer,
						b = this.endContainer,
						c = this.startOffset,
						d = this.endOffset,
						f;
					if (a.type == CKEDITOR.NODE_ELEMENT) {
						f = a.getChildCount();
						if (f > c) a = a.getChild(c);
						else if (f < 1) a = a.getPreviousSourceNode();
						else {
							for (a = a.$; a.lastChild;) a = a.lastChild;
							a = new CKEDITOR.dom.node(a);
							a = a.getNextSourceNode() || a
						}
					}
					if (b.type == CKEDITOR.NODE_ELEMENT) {
						f = b.getChildCount();
						if (f > d) b = b.getChild(d).getPreviousSourceNode(true);
						else if (f < 1) b = b.getPreviousSourceNode();
						else {
							for (b = b.$; b.lastChild;) b =
								b.lastChild;
							b = new CKEDITOR.dom.node(b)
						}
					}
					a.getPosition(b) & CKEDITOR.POSITION_FOLLOWING && (a = b);
					return {
						startNode: a,
						endNode: b
					}
				},
				getCommonAncestor: function(a, b) {
					var c = this.startContainer,
						d = this.endContainer,
						c = c.equals(d) ? a && c.type == CKEDITOR.NODE_ELEMENT && this.startOffset == this.endOffset - 1 ? c.getChild(this.startOffset) : c : c.getCommonAncestor(d);
					return b && !c.is ? c.getParent() : c
				},
				optimize: function() {
					var a = this.startContainer,
						b = this.startOffset;
					a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setStartAfter(a) :
						this.setStartBefore(a));
					a = this.endContainer;
					b = this.endOffset;
					a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setEndAfter(a) : this.setEndBefore(a))
				},
				optimizeBookmark: function() {
					var a = this.startContainer,
						b = this.endContainer;
					a.is && (a.is("span") && a.data("cke-bookmark")) && this.setStartAt(a, CKEDITOR.POSITION_BEFORE_START);
					b && (b.is && b.is("span") && b.data("cke-bookmark")) && this.setEndAt(b, CKEDITOR.POSITION_AFTER_END)
				},
				trim: function(a, b) {
					var c = this.startContainer,
						d = this.startOffset,
						f = this.collapsed;
					if ((!a || f) && c && c.type == CKEDITOR.NODE_TEXT) {
						if (d)
							if (d >= c.getLength()) {
								d = c.getIndex() + 1;
								c = c.getParent()
							} else {
								var e = c.split(d),
									d = c.getIndex() + 1,
									c = c.getParent();
								if (this.startContainer.equals(this.endContainer)) this.setEnd(e, this.endOffset - this.startOffset);
								else if (c.equals(this.endContainer)) this.endOffset = this.endOffset + 1
							} else {
							d = c.getIndex();
							c = c.getParent()
						}
						this.setStart(c, d);
						if (f) {
							this.collapse(true);
							return
						}
					}
					c = this.endContainer;
					d = this.endOffset;
					if (!b && !f && c && c.type == CKEDITOR.NODE_TEXT) {
						if (d) {
							d >= c.getLength() ||
								c.split(d);
							d = c.getIndex() + 1
						} else d = c.getIndex();
						c = c.getParent();
						this.setEnd(c, d)
					}
				},
				enlarge: function(a, b) {
					function c(a) {
						return a && a.type == CKEDITOR.NODE_ELEMENT && a.hasAttribute("contenteditable") ? null : a
					}
					var d = RegExp(/[^\s\ufeff]/);
					switch (a) {
						case CKEDITOR.ENLARGE_INLINE:
							var f = 1;
						case CKEDITOR.ENLARGE_ELEMENT:
							if (this.collapsed) break;
							var e = this.getCommonAncestor(),
								g = this.root,
								h, j, i, q, u, B = false,
								v, z;
							v = this.startContainer;
							var w = this.startOffset;
							if (v.type == CKEDITOR.NODE_TEXT) {
								if (w) {
									v = !CKEDITOR.tools.trim(v.substring(0,
										w)).length && v;
									B = !!v
								}
								if (v && !(q = v.getPrevious())) i = v.getParent()
							} else {
								w && (q = v.getChild(w - 1) || v.getLast());
								q || (i = v)
							}
							for (i = c(i); i || q;) {
								if (i && !q) {
									!u && i.equals(e) && (u = true);
									if (f ? i.isBlockBoundary() : !g.contains(i)) break;
									if (!B || i.getComputedStyle("display") != "inline") {
										B = false;
										u ? h = i : this.setStartBefore(i)
									}
									q = i.getPrevious()
								}
								for (; q;) {
									v = false;
									if (q.type == CKEDITOR.NODE_COMMENT) q = q.getPrevious();
									else {
										if (q.type == CKEDITOR.NODE_TEXT) {
											z = q.getText();
											d.test(z) && (q = null);
											v = /[\s\ufeff]$/.test(z)
										} else if ((q.$.offsetWidth >
											0 || b && q.is("br")) && !q.data("cke-bookmark"))
											if (B && CKEDITOR.dtd.$removeEmpty[q.getName()]) {
												z = q.getText();
												if (d.test(z)) q = null;
												else
													for (var w = q.$.getElementsByTagName("*"), D = 0, A; A = w[D++];)
														if (!CKEDITOR.dtd.$removeEmpty[A.nodeName.toLowerCase()]) {
															q = null;
															break
														}
												q && (v = !!z.length)
											} else q = null;
										v && (B ? u ? h = i : i && this.setStartBefore(i) : B = true);
										if (q) {
											v = q.getPrevious();
											if (!i && !v) {
												i = q;
												q = null;
												break
											}
											q = v
										} else i = null
									}
								}
								i && (i = c(i.getParent()))
							}
							v = this.endContainer;
							w = this.endOffset;
							i = q = null;
							u = B = false;
							var I = function(a, b) {
								var c =
									new CKEDITOR.dom.range(g);
								c.setStart(a, b);
								c.setEndAt(g, CKEDITOR.POSITION_BEFORE_END);
								var c = new CKEDITOR.dom.walker(c),
									f;
								for (c.guard = function(a) {
									return !(a.type == CKEDITOR.NODE_ELEMENT && a.isBlockBoundary())
								}; f = c.next();) {
									if (f.type != CKEDITOR.NODE_TEXT) return false;
									z = f != a ? f.getText() : f.substring(b);
									if (d.test(z)) return false
								}
								return true
							};
							if (v.type == CKEDITOR.NODE_TEXT)
								if (CKEDITOR.tools.trim(v.substring(w)).length) B = true;
								else {
									B = !v.getLength();
									if (w == v.getLength()) {
										if (!(q = v.getNext())) i = v.getParent()
									} else I(v,
										w) && (i = v.getParent())
								} else(q = v.getChild(w)) || (i = v);
							for (; i || q;) {
								if (i && !q) {
									!u && i.equals(e) && (u = true);
									if (f ? i.isBlockBoundary() : !g.contains(i)) break;
									if (!B || i.getComputedStyle("display") != "inline") {
										B = false;
										u ? j = i : i && this.setEndAfter(i)
									}
									q = i.getNext()
								}
								for (; q;) {
									v = false;
									if (q.type == CKEDITOR.NODE_TEXT) {
										z = q.getText();
										I(q, 0) || (q = null);
										v = /^[\s\ufeff]/.test(z)
									} else if (q.type == CKEDITOR.NODE_ELEMENT) {
										if ((q.$.offsetWidth > 0 || b && q.is("br")) && !q.data("cke-bookmark"))
											if (B && CKEDITOR.dtd.$removeEmpty[q.getName()]) {
												z = q.getText();
												if (d.test(z)) q = null;
												else {
													w = q.$.getElementsByTagName("*");
													for (D = 0; A = w[D++];)
														if (!CKEDITOR.dtd.$removeEmpty[A.nodeName.toLowerCase()]) {
															q = null;
															break
														}
												}
												q && (v = !!z.length)
											} else q = null
									} else v = 1;
									v && B && (u ? j = i : this.setEndAfter(i));
									if (q) {
										v = q.getNext();
										if (!i && !v) {
											i = q;
											q = null;
											break
										}
										q = v
									} else i = null
								}
								i && (i = c(i.getParent()))
							}
							if (h && j) {
								e = h.contains(j) ? j : h;
								this.setStartBefore(e);
								this.setEndAfter(e)
							}
							break;
						case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
						case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:
							i = new CKEDITOR.dom.range(this.root);
							g =
								this.root;
							i.setStartAt(g, CKEDITOR.POSITION_AFTER_START);
							i.setEnd(this.startContainer, this.startOffset);
							i = new CKEDITOR.dom.walker(i);
							var K, C, y = CKEDITOR.dom.walker.blockBoundary(a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? {
									br: 1
								} : null),
								E = null,
								H = function(a) {
									if (a.type == CKEDITOR.NODE_ELEMENT && a.getAttribute("contenteditable") == "false")
										if (E) {
											if (E.equals(a)) {
												E = null;
												return
											}
										} else E = a;
									else if (E) return;
									var b = y(a);
									b || (K = a);
									return b
								},
								f = function(a) {
									var b = H(a);
									!b && (a.is && a.is("br")) && (C = a);
									return b
								};
							i.guard = H;
							i = i.lastBackward();
							K = K || g;
							this.setStartAt(K, !K.is("br") && (!i && this.checkStartOfBlock() || i && K.contains(i)) ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_AFTER_END);
							if (a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS) {
								i = this.clone();
								i = new CKEDITOR.dom.walker(i);
								var F = CKEDITOR.dom.walker.whitespaces(),
									S = CKEDITOR.dom.walker.bookmark();
								i.evaluator = function(a) {
									return !F(a) && !S(a)
								};
								if ((i = i.previous()) && i.type == CKEDITOR.NODE_ELEMENT && i.is("br")) break
							}
							i = this.clone();
							i.collapse();
							i.setEndAt(g, CKEDITOR.POSITION_BEFORE_END);
							i = new CKEDITOR.dom.walker(i);
							i.guard = a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? f : H;
							K = E = C = null;
							i = i.lastForward();
							K = K || g;
							this.setEndAt(K, !i && this.checkEndOfBlock() || i && K.contains(i) ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_BEFORE_START);
							C && this.setEndAfter(C)
					}
				},
				shrink: function(a, b, c) {
					if (!this.collapsed) {
						var a = a || CKEDITOR.SHRINK_TEXT,
							d = this.clone(),
							f = this.startContainer,
							e = this.endContainer,
							g = this.startOffset,
							h = this.endOffset,
							i = 1,
							j = 1;
						if (f && f.type == CKEDITOR.NODE_TEXT)
							if (g)
								if (g >= f.getLength()) d.setStartAfter(f);
								else {
									d.setStartBefore(f);
									i = 0
								} else d.setStartBefore(f); if (e && e.type == CKEDITOR.NODE_TEXT)
							if (h)
								if (h >= e.getLength()) d.setEndAfter(e);
								else {
									d.setEndAfter(e);
									j = 0
								} else d.setEndBefore(e);
						var d = new CKEDITOR.dom.walker(d),
							q = CKEDITOR.dom.walker.bookmark();
						d.evaluator = function(b) {
							return b.type == (a == CKEDITOR.SHRINK_ELEMENT ? CKEDITOR.NODE_ELEMENT : CKEDITOR.NODE_TEXT)
						};
						var u;
						d.guard = function(b, d) {
							if (q(b)) return true;
							if (a == CKEDITOR.SHRINK_ELEMENT && b.type == CKEDITOR.NODE_TEXT || d && b.equals(u) || c === false && b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary() ||
								b.type == CKEDITOR.NODE_ELEMENT && b.hasAttribute("contenteditable")) return false;
							!d && b.type == CKEDITOR.NODE_ELEMENT && (u = b);
							return true
						};
						if (i)(f = d[a == CKEDITOR.SHRINK_ELEMENT ? "lastForward" : "next"]()) && this.setStartAt(f, b ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_START);
						if (j) {
							d.reset();
							(d = d[a == CKEDITOR.SHRINK_ELEMENT ? "lastBackward" : "previous"]()) && this.setEndAt(d, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END)
						}
						return !(!i && !j)
					}
				},
				insertNode: function(a) {
					this.optimizeBookmark();
					this.trim(false,
						true);
					var b = this.startContainer,
						c = b.getChild(this.startOffset);
					c ? a.insertBefore(c) : b.append(a);
					a.getParent() && a.getParent().equals(this.endContainer) && this.endOffset++;
					this.setStartBefore(a)
				},
				moveToPosition: function(a, b) {
					this.setStartAt(a, b);
					this.collapse(true)
				},
				moveToRange: function(a) {
					this.setStart(a.startContainer, a.startOffset);
					this.setEnd(a.endContainer, a.endOffset)
				},
				selectNodeContents: function(a) {
					this.setStart(a, 0);
					this.setEnd(a, a.type == CKEDITOR.NODE_TEXT ? a.getLength() : a.getChildCount())
				},
				setStart: function(a,
					b) {
					if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
						b = a.getIndex();
						a = a.getParent()
					}
					this.startContainer = a;
					this.startOffset = b;
					if (!this.endContainer) {
						this.endContainer = a;
						this.endOffset = b
					}
					d(this)
				},
				setEnd: function(a, b) {
					if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
						b = a.getIndex() + 1;
						a = a.getParent()
					}
					this.endContainer = a;
					this.endOffset = b;
					if (!this.startContainer) {
						this.startContainer = a;
						this.startOffset = b
					}
					d(this)
				},
				setStartAfter: function(a) {
					this.setStart(a.getParent(), a.getIndex() +
						1)
				},
				setStartBefore: function(a) {
					this.setStart(a.getParent(), a.getIndex())
				},
				setEndAfter: function(a) {
					this.setEnd(a.getParent(), a.getIndex() + 1)
				},
				setEndBefore: function(a) {
					this.setEnd(a.getParent(), a.getIndex())
				},
				setStartAt: function(a, b) {
					switch (b) {
						case CKEDITOR.POSITION_AFTER_START:
							this.setStart(a, 0);
							break;
						case CKEDITOR.POSITION_BEFORE_END:
							a.type == CKEDITOR.NODE_TEXT ? this.setStart(a, a.getLength()) : this.setStart(a, a.getChildCount());
							break;
						case CKEDITOR.POSITION_BEFORE_START:
							this.setStartBefore(a);
							break;
						case CKEDITOR.POSITION_AFTER_END:
							this.setStartAfter(a)
					}
					d(this)
				},
				setEndAt: function(a, b) {
					switch (b) {
						case CKEDITOR.POSITION_AFTER_START:
							this.setEnd(a, 0);
							break;
						case CKEDITOR.POSITION_BEFORE_END:
							a.type == CKEDITOR.NODE_TEXT ? this.setEnd(a, a.getLength()) : this.setEnd(a, a.getChildCount());
							break;
						case CKEDITOR.POSITION_BEFORE_START:
							this.setEndBefore(a);
							break;
						case CKEDITOR.POSITION_AFTER_END:
							this.setEndAfter(a)
					}
					d(this)
				},
				fixBlock: function(a, b) {
					var c = this.createBookmark(),
						d = this.document.createElement(b);
					this.collapse(a);
					this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
					this.extractContents().appendTo(d);
					d.trim();
					d.appendBogus();
					this.insertNode(d);
					this.moveToBookmark(c);
					return d
				},
				splitBlock: function(a) {
					var b = new CKEDITOR.dom.elementPath(this.startContainer, this.root),
						c = new CKEDITOR.dom.elementPath(this.endContainer, this.root),
						d = b.block,
						f = c.block,
						e = null;
					if (!b.blockLimit.equals(c.blockLimit)) return null;
					if (a != "br") {
						if (!d) {
							d = this.fixBlock(true, a);
							f = (new CKEDITOR.dom.elementPath(this.endContainer, this.root)).block
						}
						f || (f = this.fixBlock(false, a))
					}
					a = d && this.checkStartOfBlock();
					b = f && this.checkEndOfBlock();
					this.deleteContents();
					if (d && d.equals(f))
						if (b) {
							e = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
							this.moveToPosition(f, CKEDITOR.POSITION_AFTER_END);
							f = null
						} else if (a) {
						e = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
						this.moveToPosition(d, CKEDITOR.POSITION_BEFORE_START);
						d = null
					} else {
						f = this.splitElement(d);
						d.is("ul", "ol") || d.appendBogus()
					}
					return {
						previousBlock: d,
						nextBlock: f,
						wasStartOfBlock: a,
						wasEndOfBlock: b,
						elementPath: e
					}
				},
				splitElement: function(a) {
					if (!this.collapsed) return null;
					this.setEndAt(a, CKEDITOR.POSITION_BEFORE_END);
					var b = this.extractContents(),
						c = a.clone(false);
					b.appendTo(c);
					c.insertAfter(a);
					this.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
					return c
				},
				removeEmptyBlocksAtEnd: function() {
					function a(d) {
						return function(a) {
							return b(a) || (c(a) || a.type == CKEDITOR.NODE_ELEMENT && a.isEmptyInlineRemoveable()) || d.is("table") && a.is("caption") ? false : true
						}
					}
					var b = CKEDITOR.dom.walker.whitespaces(),
						c = CKEDITOR.dom.walker.bookmark(false);
					return function(b) {
						for (var c = this.createBookmark(),
							d = this[b ? "endPath" : "startPath"](), f = d.block || d.blockLimit, e; f && !f.equals(d.root) && !f.getFirst(a(f));) {
							e = f.getParent();
							this[b ? "setEndAt" : "setStartAt"](f, CKEDITOR.POSITION_AFTER_END);
							f.remove(1);
							f = e
						}
						this.moveToBookmark(c)
					}
				}(),
				startPath: function() {
					return new CKEDITOR.dom.elementPath(this.startContainer, this.root)
				},
				endPath: function() {
					return new CKEDITOR.dom.elementPath(this.endContainer, this.root)
				},
				checkBoundaryOfElement: function(a, b) {
					var c = b == CKEDITOR.START,
						d = this.clone();
					d.collapse(c);
					d[c ? "setStartAt" :
						"setEndAt"](a, c ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
					d = new CKEDITOR.dom.walker(d);
					d.evaluator = e(c);
					return d[c ? "checkBackward" : "checkForward"]()
				},
				checkStartOfBlock: function() {
					var b = this.startContainer,
						c = this.startOffset;
					if (CKEDITOR.env.ie && c && b.type == CKEDITOR.NODE_TEXT) {
						b = CKEDITOR.tools.ltrim(b.substring(0, c));
						j.test(b) && this.trim(0, 1)
					}
					this.trim();
					b = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
					c = this.clone();
					c.collapse(true);
					c.setStartAt(b.block || b.blockLimit,
						CKEDITOR.POSITION_AFTER_START);
					b = new CKEDITOR.dom.walker(c);
					b.evaluator = a();
					return b.checkBackward()
				},
				checkEndOfBlock: function() {
					var b = this.endContainer,
						c = this.endOffset;
					if (CKEDITOR.env.ie && b.type == CKEDITOR.NODE_TEXT) {
						b = CKEDITOR.tools.rtrim(b.substring(c));
						j.test(b) && this.trim(1, 0)
					}
					this.trim();
					b = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
					c = this.clone();
					c.collapse(false);
					c.setEndAt(b.block || b.blockLimit, CKEDITOR.POSITION_BEFORE_END);
					b = new CKEDITOR.dom.walker(c);
					b.evaluator = a();
					return b.checkForward()
				},
				getPreviousNode: function(a, b, c) {
					var d = this.clone();
					d.collapse(1);
					d.setStartAt(c || this.root, CKEDITOR.POSITION_AFTER_START);
					c = new CKEDITOR.dom.walker(d);
					c.evaluator = a;
					c.guard = b;
					return c.previous()
				},
				getNextNode: function(a, b, c) {
					var d = this.clone();
					d.collapse();
					d.setEndAt(c || this.root, CKEDITOR.POSITION_BEFORE_END);
					c = new CKEDITOR.dom.walker(d);
					c.evaluator = a;
					c.guard = b;
					return c.next()
				},
				checkReadOnly: function() {
					function a(b, c) {
						for (; b;) {
							if (b.type == CKEDITOR.NODE_ELEMENT) {
								if (b.getAttribute("contentEditable") ==
									"false" && !b.data("cke-editable")) return 0;
								if (b.is("html") || b.getAttribute("contentEditable") == "true" && (b.contains(c) || b.equals(c))) break
							}
							b = b.getParent()
						}
						return 1
					}
					return function() {
						var b = this.startContainer,
							c = this.endContainer;
						return !(a(b, c) && a(c, b))
					}
				}(),
				moveToElementEditablePosition: function(a, b) {
					if (a.type == CKEDITOR.NODE_ELEMENT && !a.isEditable(false)) {
						this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
						return true
					}
					for (var c = 0; a;) {
						if (a.type == CKEDITOR.NODE_TEXT) {
							b && this.endContainer &&
								this.checkEndOfBlock() && j.test(a.getText()) ? this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START) : this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
							c = 1;
							break
						}
						if (a.type == CKEDITOR.NODE_ELEMENT)
							if (a.isEditable()) {
								this.moveToPosition(a, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START);
								c = 1
							} else if (b && a.is("br") && this.endContainer && this.checkEndOfBlock()) this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START);
						else if (a.getAttribute("contenteditable") == "false" &&
							a.is(CKEDITOR.dtd.$block)) {
							this.setStartBefore(a);
							this.setEndAfter(a);
							return true
						}
						var d = a,
							f = c,
							e = void 0;
						d.type == CKEDITOR.NODE_ELEMENT && d.isEditable(false) && (e = d[b ? "getLast" : "getFirst"](i));
						!f && !e && (e = d[b ? "getPrevious" : "getNext"](i));
						a = e
					}
					return !!c
				},
				moveToClosestEditablePosition: function(a, b) {
					var c = new CKEDITOR.dom.range(this.root),
						d = 0,
						f, e = [CKEDITOR.POSITION_AFTER_END, CKEDITOR.POSITION_BEFORE_START];
					c.moveToPosition(a, e[b ? 0 : 1]);
					if (a.is(CKEDITOR.dtd.$block)) {
						if (f = c[b ? "getNextEditableNode" : "getPreviousEditableNode"]()) {
							d =
								1;
							if (f.type == CKEDITOR.NODE_ELEMENT && f.is(CKEDITOR.dtd.$block) && f.getAttribute("contenteditable") == "false") {
								c.setStartAt(f, CKEDITOR.POSITION_BEFORE_START);
								c.setEndAt(f, CKEDITOR.POSITION_AFTER_END)
							} else c.moveToPosition(f, e[b ? 1 : 0])
						}
					} else d = 1;
					d && this.moveToRange(c);
					return !!d
				},
				moveToElementEditStart: function(a) {
					return this.moveToElementEditablePosition(a)
				},
				moveToElementEditEnd: function(a) {
					return this.moveToElementEditablePosition(a, true)
				},
				getEnclosedNode: function() {
					var a = this.clone();
					a.optimize();
					if (a.startContainer.type !=
						CKEDITOR.NODE_ELEMENT || a.endContainer.type != CKEDITOR.NODE_ELEMENT) return null;
					var a = new CKEDITOR.dom.walker(a),
						b = CKEDITOR.dom.walker.bookmark(false, true),
						c = CKEDITOR.dom.walker.whitespaces(true);
					a.evaluator = function(a) {
						return c(a) && b(a)
					};
					var d = a.next();
					a.reset();
					return d && d.equals(a.previous()) ? d : null
				},
				getTouchedStartNode: function() {
					var a = this.startContainer;
					return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.startOffset) || a
				},
				getTouchedEndNode: function() {
					var a = this.endContainer;
					return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.endOffset - 1) || a
				},
				getNextEditableNode: b(),
				getPreviousEditableNode: b(1),
				scrollIntoView: function() {
					var a = new CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", this.document),
						b, c, d, f = this.clone();
					f.optimize();
					if (d = f.startContainer.type == CKEDITOR.NODE_TEXT) {
						c = f.startContainer.getText();
						b = f.startContainer.split(f.startOffset);
						a.insertAfter(f.startContainer)
					} else f.insertNode(a);
					a.scrollIntoView();
					if (d) {
						f.startContainer.setText(c);
						b.remove()
					}
					a.remove()
				}
			}
		}(), CKEDITOR.POSITION_AFTER_START = 1, CKEDITOR.POSITION_BEFORE_END = 2, CKEDITOR.POSITION_BEFORE_START = 3, CKEDITOR.POSITION_AFTER_END = 4, CKEDITOR.ENLARGE_ELEMENT = 1, CKEDITOR.ENLARGE_BLOCK_CONTENTS = 2, CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS = 3, CKEDITOR.ENLARGE_INLINE = 4, CKEDITOR.START = 1, CKEDITOR.END = 2, CKEDITOR.SHRINK_ELEMENT = 1, CKEDITOR.SHRINK_TEXT = 2, "use strict",
		function() {
			function a(a) {
				if (!(arguments.length < 1)) {
					this.range = a;
					this.forceBrBreak = 0;
					this.enlargeBr = 1;
					this.enforceRealBlocks = 0;
					this._ ||
						(this._ = {})
				}
			}

			function e(a, b, d) {
				for (a = a.getNextSourceNode(b, null, d); !c(a);) a = a.getNextSourceNode(b, null, d);
				return a
			}

			function b(a) {
				var b = [];
				a.forEach(function(a) {
					if (a.getAttribute("contenteditable") == "true") {
						b.push(a);
						return false
					}
				}, CKEDITOR.NODE_ELEMENT, true);
				return b
			}

			function d(a, c, f, e) {
				a: {
					e == void 0 && (e = b(f));
					for (var h; h = e.shift();)
						if (h.getDtd().p) {
							e = {
								element: h,
								remaining: e
							};
							break a
						}
					e = null
				}
				if (!e) return 0;
				if ((h = CKEDITOR.filter.instances[e.element.data("cke-filter")]) && !h.check(c)) return d(a, c, f, e.remaining);
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
				return 1
			}
			var f = /^[\r\n\t ]+$/,
				c = CKEDITOR.dom.walker.bookmark(false, true),
				h = CKEDITOR.dom.walker.whitespaces(true),
				j = function(a) {
					return c(a) && h(a)
				};
			a.prototype = {
				getNextParagraph: function(a) {
					var b, h, n, o, r, a = a || "p";
					if (this._.nestedEditable) {
						if (b =
							this._.nestedEditable.iterator.getNextParagraph(a)) {
							this.activeFilter = this._.nestedEditable.iterator.activeFilter;
							return b
						}
						this.activeFilter = this.filter;
						if (d(this, a, this._.nestedEditable.container, this._.nestedEditable.remaining)) {
							this.activeFilter = this._.nestedEditable.iterator.activeFilter;
							return this._.nestedEditable.iterator.getNextParagraph(a)
						}
						this._.nestedEditable = null
					}
					if (!this.range.root.getDtd()[a]) return null;
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
							if (this._.lastNode && this._.lastNode.type == CKEDITOR.NODE_TEXT &&
								!CKEDITOR.tools.trim(this._.lastNode.getText()) && this._.lastNode.getParent().isBlockBoundary()) {
								m = this.range.clone();
								m.moveToPosition(this._.lastNode, CKEDITOR.POSITION_AFTER_END);
								if (m.checkEndOfBlock()) {
									m = new CKEDITOR.dom.elementPath(m.endContainer, m.root);
									this._.lastNode = (m.block || m.blockLimit).getNextSourceNode(true)
								}
							}
							if (!this._.lastNode || !l.root.contains(this._.lastNode)) {
								this._.lastNode = this._.docEndMarker = l.document.createText("");
								this._.lastNode.insertAfter(h)
							}
							l = null
						}
						this._.started = 1;
						h = l
					}
					m =
						this._.nextNode;
					l = this._.lastNode;
					for (this._.nextNode = null; m;) {
						var s = 0,
							t = m.hasAscendant("pre"),
							p = m.type != CKEDITOR.NODE_ELEMENT,
							x = 0;
						if (p) m.type == CKEDITOR.NODE_TEXT && f.test(m.getText()) && (p = 0);
						else {
							var q = m.getName();
							if (CKEDITOR.dtd.$block[q] && m.getAttribute("contenteditable") == "false") {
								b = m;
								d(this, a, b);
								break
							} else if (m.isBlockBoundary(this.forceBrBreak && !t && {
								br: 1
							})) {
								if (q == "br") p = 1;
								else if (!h && !m.getChildCount() && q != "hr") {
									b = m;
									n = m.equals(l);
									break
								}
								if (h) {
									h.setEndAt(m, CKEDITOR.POSITION_BEFORE_START);
									if (q !=
										"br") this._.nextNode = m
								}
								s = 1
							} else {
								if (m.getFirst()) {
									if (!h) {
										h = this.range.clone();
										h.setStartAt(m, CKEDITOR.POSITION_BEFORE_START)
									}
									m = m.getFirst();
									continue
								}
								p = 1
							}
						} if (p && !h) {
							h = this.range.clone();
							h.setStartAt(m, CKEDITOR.POSITION_BEFORE_START)
						}
						n = (!s || p) && m.equals(l);
						if (h && !s)
							for (; !m.getNext(j) && !n;) {
								q = m.getParent();
								if (q.isBlockBoundary(this.forceBrBreak && !t && {
									br: 1
								})) {
									s = 1;
									p = 0;
									n || q.equals(l);
									h.setEndAt(q, CKEDITOR.POSITION_BEFORE_END);
									break
								}
								m = q;
								p = 1;
								n = m.equals(l);
								x = 1
							}
						p && h.setEndAt(m, CKEDITOR.POSITION_AFTER_END);
						m =
							e(m, x, l);
						if ((n = !m) || s && h) break
					}
					if (!b) {
						if (!h) {
							this._.docEndMarker && this._.docEndMarker.remove();
							return this._.nextNode = null
						}
						b = new CKEDITOR.dom.elementPath(h.startContainer, h.root);
						m = b.blockLimit;
						s = {
							div: 1,
							th: 1,
							td: 1
						};
						b = b.block;
						if (!b && m && !this.enforceRealBlocks && s[m.getName()] && h.checkStartOfBlock() && h.checkEndOfBlock() && !m.equals(h.root)) b = m;
						else if (!b || this.enforceRealBlocks && b.getName() == "li") {
							b = this.range.document.createElement(a);
							h.extractContents().appendTo(b);
							b.trim();
							h.insertNode(b);
							o = r = true
						} else if (b.getName() !=
							"li") {
							if (!h.checkStartOfBlock() || !h.checkEndOfBlock()) {
								b = b.clone(false);
								h.extractContents().appendTo(b);
								b.trim();
								r = h.splitBlock();
								o = !r.wasStartOfBlock;
								r = !r.wasEndOfBlock;
								h.insertNode(b)
							}
						} else if (!n) this._.nextNode = b.equals(l) ? null : e(h.getBoundaryNodes().endNode, 1, l)
					}
					if (o)(o = b.getPrevious()) && o.type == CKEDITOR.NODE_ELEMENT && (o.getName() == "br" ? o.remove() : o.getLast() && o.getLast().$.nodeName.toLowerCase() == "br" && o.getLast().remove());
					if (r)(o = b.getLast()) && o.type == CKEDITOR.NODE_ELEMENT && o.getName() == "br" &&
						(!CKEDITOR.env.needsBrFiller || o.getPrevious(c) || o.getNext(c)) && o.remove();
					if (!this._.nextNode) this._.nextNode = n || b.equals(l) || !l ? null : e(b, 1, l);
					return b
				}
			};
			CKEDITOR.dom.range.prototype.createIterator = function() {
				return new a(this)
			}
		}(), CKEDITOR.command = function(a, e) {
			this.uiItems = [];
			this.exec = function(b) {
				if (this.state == CKEDITOR.TRISTATE_DISABLED || !this.checkAllowed()) return false;
				this.editorFocus && a.focus();
				return this.fire("exec") === false ? true : e.exec.call(this, a, b) !== false
			};
			this.refresh = function(a, b) {
				if (!this.readOnly &&
					a.readOnly) return true;
				if (this.context && !b.isContextFor(this.context)) {
					this.disable();
					return true
				}
				if (!this.checkAllowed(true)) {
					this.disable();
					return true
				}
				this.startDisabled || this.enable();
				this.modes && !this.modes[a.mode] && this.disable();
				return this.fire("refresh", {
					editor: a,
					path: b
				}) === false ? true : e.refresh && e.refresh.apply(this, arguments) !== false
			};
			var b;
			this.checkAllowed = function(d) {
				return !d && typeof b == "boolean" ? b : b = a.activeFilter.checkFeature(this)
			};
			CKEDITOR.tools.extend(this, e, {
				modes: {
					wysiwyg: 1
				},
				editorFocus: 1,
				contextSensitive: !!e.context,
				state: CKEDITOR.TRISTATE_DISABLED
			});
			CKEDITOR.event.call(this)
		}, CKEDITOR.command.prototype = {
			enable: function() {
				this.state == CKEDITOR.TRISTATE_DISABLED && this.checkAllowed() && this.setState(!this.preserveState || typeof this.previousState == "undefined" ? CKEDITOR.TRISTATE_OFF : this.previousState)
			},
			disable: function() {
				this.setState(CKEDITOR.TRISTATE_DISABLED)
			},
			setState: function(a) {
				if (this.state == a || a != CKEDITOR.TRISTATE_DISABLED && !this.checkAllowed()) return false;
				this.previousState = this.state;
				this.state = a;
				this.fire("state");
				return true
			},
			toggleState: function() {
				this.state == CKEDITOR.TRISTATE_OFF ? this.setState(CKEDITOR.TRISTATE_ON) : this.state == CKEDITOR.TRISTATE_ON && this.setState(CKEDITOR.TRISTATE_OFF)
			}
		}, CKEDITOR.event.implementOn(CKEDITOR.command.prototype), CKEDITOR.ENTER_P = 1, CKEDITOR.ENTER_BR = 2, CKEDITOR.ENTER_DIV = 3, CKEDITOR.config = {
			customConfig: "config.js",
			autoUpdateElement: !0,
			language: "",
			defaultLanguage: "en",
			contentsLangDirection: "",
			enterMode: CKEDITOR.ENTER_P,
			forceEnterMode: !1,
			shiftEnterMode: CKEDITOR.ENTER_BR,
			docType: "<!DOCTYPE html>",
			bodyId: "",
			bodyClass: "",
			fullPage: !1,
			height: 200,
			extraPlugins: "",
			removePlugins: "",
			protectedSource: [],
			tabIndex: 0,
			width: "",
			baseFloatZIndex: 1E4,
			blockedKeystrokes: [CKEDITOR.CTRL + 66, CKEDITOR.CTRL + 73, CKEDITOR.CTRL + 85]
		},
		function() {
			function a(a, b, c, d, f) {
				var e, g, a = [];
				for (e in b) {
					g = b[e];
					g = typeof g == "boolean" ? {} : typeof g == "function" ? {
						match: g
					} : I(g);
					if (e.charAt(0) != "$") g.elements = e;
					if (c) g.featureName = c.toLowerCase();
					var l = g;
					l.elements = h(l.elements, /\s+/) || null;
					l.propertiesOnly = l.propertiesOnly ||
						l.elements === true;
					var j = /\s*,\s*/,
						i = void 0;
					for (i in E) {
						l[i] = h(l[i], j) || null;
						var y = l,
							m = H[i],
							p = h(l[H[i]], j),
							k = l[i],
							x = [],
							s = true,
							F = void 0;
						p ? s = false : p = {};
						for (F in k)
							if (F.charAt(0) == "!") {
								F = F.slice(1);
								x.push(F);
								p[F] = true;
								s = false
							}
						for (; F = x.pop();) {
							k[F] = k["!" + F];
							delete k["!" + F]
						}
						y[m] = (s ? false : p) || null
					}
					l.match = l.match || null;
					d.push(g);
					a.push(g)
				}
				for (var b = f.elements, f = f.generic, q, c = 0, d = a.length; c < d; ++c) {
					e = I(a[c]);
					g = e.classes === true || e.styles === true || e.attributes === true;
					l = e;
					i = m = j = void 0;
					for (j in E) l[j] = t(l[j]);
					y = true;
					for (i in H) {
						j = H[i];
						m = l[j];
						p = [];
						k = void 0;
						for (k in m) k.indexOf("*") > -1 ? p.push(RegExp("^" + k.replace(/\*/g, ".*") + "$")) : p.push(k);
						m = p;
						if (m.length) {
							l[j] = m;
							y = false
						}
					}
					l.nothingRequired = y;
					l.noProperties = !(l.attributes || l.classes || l.styles);
					if (e.elements === true || e.elements === null) f[g ? "unshift" : "push"](e);
					else {
						l = e.elements;
						delete e.elements;
						for (q in l)
							if (b[q]) b[q][g ? "unshift" : "push"](e);
							else b[q] = [e]
					}
				}
			}

			function e(a, c, d, f) {
				if (!a.match || a.match(c))
					if (f || j(a, c)) {
						if (!a.propertiesOnly) d.valid = true;
						if (!d.allAttributes) d.allAttributes =
							b(a.attributes, c.attributes, d.validAttributes);
						if (!d.allStyles) d.allStyles = b(a.styles, c.styles, d.validStyles);
						if (!d.allClasses) {
							a = a.classes;
							c = c.classes;
							f = d.validClasses;
							if (a)
								if (a === true) a = true;
								else {
									for (var e = 0, g = c.length, h; e < g; ++e) {
										h = c[e];
										f[h] || (f[h] = a(h))
									}
									a = false
								} else a = false;
							d.allClasses = a
						}
					}
			}

			function b(a, b, c) {
				if (!a) return false;
				if (a === true) return true;
				for (var d in b) c[d] || (c[d] = a(d));
				return false
			}

			function d(a, b, c) {
				if (!a.match || a.match(b)) {
					if (a.noProperties) return false;
					c.hadInvalidAttribute = f(a.attributes,
						b.attributes) || c.hadInvalidAttribute;
					c.hadInvalidStyle = f(a.styles, b.styles) || c.hadInvalidStyle;
					a = a.classes;
					b = b.classes;
					if (a) {
						for (var d = false, e = a === true, g = b.length; g--;)
							if (e || a(b[g])) {
								b.splice(g, 1);
								d = true
							}
						a = d
					} else a = false;
					c.hadInvalidClass = a || c.hadInvalidClass
				}
			}

			function f(a, b) {
				if (!a) return false;
				var c = false,
					d = a === true,
					f;
				for (f in b)
					if (d || a(f)) {
						delete b[f];
						c = true
					}
				return c
			}

			function c(a, b, c) {
				if (a.disabled || a.customConfig && !c || !b) return false;
				a._.cachedChecks = {};
				return true
			}

			function h(a, b) {
				if (!a) return false;
				if (a === true) return a;
				if (typeof a == "string") {
					a = K(a);
					return a == "*" ? true : CKEDITOR.tools.convertArrayToObject(a.split(b))
				}
				if (CKEDITOR.tools.isArray(a)) return a.length ? CKEDITOR.tools.convertArrayToObject(a) : false;
				var c = {},
					d = 0,
					f;
				for (f in a) {
					c[f] = a[f];
					d++
				}
				return d ? c : false
			}

			function j(a, b) {
				if (a.nothingRequired) return true;
				var c, d, f, e;
				if (f = a.requiredClasses) {
					e = b.classes;
					for (c = 0; c < f.length; ++c) {
						d = f[c];
						if (typeof d == "string") {
							if (CKEDITOR.tools.indexOf(e, d) == -1) return false
						} else if (!CKEDITOR.tools.checkIfAnyArrayItemMatches(e,
							d)) return false
					}
				}
				return g(b.styles, a.requiredStyles) && g(b.attributes, a.requiredAttributes)
			}

			function g(a, b) {
				if (!b) return true;
				for (var c = 0, d; c < b.length; ++c) {
					d = b[c];
					if (typeof d == "string") {
						if (!(d in a)) return false
					} else if (!CKEDITOR.tools.checkIfAnyObjectPropertyMatches(a, d)) return false
				}
				return true
			}

			function i(a) {
				if (!a) return {};
				for (var a = a.split(/\s*,\s*/).sort(), b = {}; a.length;) b[a.shift()] = C;
				return b
			}

			function k(a) {
				for (var b, c, d, f, e = {}, g = 1, a = K(a); b = a.match(F);) {
					if (c = b[2]) {
						d = n(c, "styles");
						f = n(c, "attrs");
						c = n(c, "classes")
					} else d = f = c = null;
					e["$" + g++] = {
						elements: b[1],
						classes: c,
						styles: d,
						attributes: f
					};
					a = a.slice(b[0].length)
				}
				return e
			}

			function n(a, b) {
				var c = a.match(S[b]);
				return c ? K(c[1]) : null
			}

			function o(a) {
				var b = a.styleBackup = a.attributes.style,
					c = a.classBackup = a.attributes["class"];
				if (!a.styles) a.styles = CKEDITOR.tools.parseCssText(b || "", 1);
				if (!a.classes) a.classes = c ? c.split(/\s+/) : []
			}

			function r(a, b, c, f) {
				var g = 0,
					h;
				if (f.toHtml) b.name = b.name.replace(O, "$1");
				if (f.doCallbacks && a.elementCallbacks) {
					a: for (var l = a.elementCallbacks,
						j = 0, i = l.length, y; j < i; ++j)
						if (y = l[j](b)) {
							h = y;
							break a
						}if (h) return h
				}
				if (f.doTransform)
					if (h = a._.transformations[b.name]) {
						o(b);
						for (l = 0; l < h.length; ++l) u(a, b, h[l]);
						m(b)
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
						var p, k;
						if (!a && !h) a = null;
						else {
							o(b);
							if (l) {
								p = 0;
								for (k = l.length; p < k; ++p)
									if (d(l[p], b, y) === false) {
										a = null;
										break a
									}
							}
							if (j) {
								p = 0;
								for (k = j.length; p < k; ++p) d(j[p], b, y)
							}
							if (a) {
								p = 0;
								for (k = a.length; p < k; ++p) e(a[p], b, y, i)
							}
							if (h) {
								p = 0;
								for (k = h.length; p < k; ++p) e(h[p], b, y, i)
							}
							a = y
						}
					}
					if (!a) {
						c.push(b);
						return A
					}
					if (!a.valid) {
						c.push(b);
						return A
					}
					k = a.validAttributes;
					var E = a.validStyles;
					h = a.validClasses;
					var l = b.attributes,
						x = b.styles,
						j = b.classes,
						i = b.classBackup,
						F = b.styleBackup,
						q, n, H = [];
					y = [];
					var C = /^data-cke-/;
					p = false;
					delete l.style;
					delete l["class"];
					delete b.classBackup;
					delete b.styleBackup;
					if (!a.allAttributes)
						for (q in l)
							if (!k[q])
								if (C.test(q)) {
									if (q != (n = q.replace(/^data-cke-saved-/, "")) && !k[n]) {
										delete l[q];
										p = true
									}
								} else {
									delete l[q];
									p = true
								}
					if (!a.allStyles || a.hadInvalidStyle) {
						for (q in x) a.allStyles || E[q] ? H.push(q + ":" + x[q]) : p = true;
						if (H.length) l.style = H.sort().join("; ")
					} else if (F) l.style = F;
					if (!a.allClasses || a.hadInvalidClass) {
						for (q = 0; q < j.length; ++q)(a.allClasses || h[j[q]]) && y.push(j[q]);
						y.length && (l["class"] = y.sort().join(" "));
						i && y.length < i.split(/\s+/).length &&
							(p = true)
					} else i && (l["class"] = i);
					p && (g = A);
					if (!f.skipFinalValidation && !s(b)) {
						c.push(b);
						return A
					}
				}
				if (f.toHtml) b.name = b.name.replace(J, "cke:$1");
				return g
			}

			function l(a) {
				var b = [],
					c;
				for (c in a) c.indexOf("*") > -1 && b.push(c.replace(/\*/g, ".*"));
				return b.length ? RegExp("^(?:" + b.join("|") + ")$") : null
			}

			function m(a) {
				var b = a.attributes,
					c;
				delete b.style;
				delete b["class"];
				if (c = CKEDITOR.tools.writeCssText(a.styles, true)) b.style = c;
				a.classes.length && (b["class"] = a.classes.sort().join(" "))
			}

			function s(a) {
				switch (a.name) {
					case "a":
						if (!a.children.length &&
							!a.attributes.name) return false;
						break;
					case "img":
						if (!a.attributes.src) return false
				}
				return true
			}

			function t(a) {
				if (!a) return false;
				if (a === true) return true;
				var b = l(a);
				return function(c) {
					return c in a || b && c.match(b)
				}
			}

			function p() {
				return new CKEDITOR.htmlParser.element("br")
			}

			function x(a) {
				return a.type == CKEDITOR.NODE_ELEMENT && (a.name == "br" || D.$block[a.name])
			}

			function q(a, b, c) {
				var d = a.name;
				if (D.$empty[d] || !a.children.length)
					if (d == "hr" && b == "br") a.replaceWith(p());
					else {
						a.parent && c.push({
							check: "it",
							el: a.parent
						});
						a.remove()
					} else if (D.$block[d] || d == "tr")
					if (b == "br") {
						if (a.previous && !x(a.previous)) {
							b = p();
							b.insertBefore(a)
						}
						if (a.next && !x(a.next)) {
							b = p();
							b.insertAfter(a)
						}
						a.replaceWithChildren()
					} else {
						var d = a.children,
							f;
						b: {
							f = D[b];
							for (var e = 0, g = d.length, h; e < g; ++e) {
								h = d[e];
								if (h.type == CKEDITOR.NODE_ELEMENT && !f[h.name]) {
									f = false;
									break b
								}
							}
							f = true
						}
						if (f) {
							a.name = b;
							a.attributes = {};
							c.push({
								check: "parent-down",
								el: a
							})
						} else {
							f = a.parent;
							for (var e = f.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || f.name == "body", l, g = d.length; g > 0;) {
								h = d[--g];
								if (e &&
									(h.type == CKEDITOR.NODE_TEXT || h.type == CKEDITOR.NODE_ELEMENT && D.$inline[h.name])) {
									if (!l) {
										l = new CKEDITOR.htmlParser.element(b);
										l.insertAfter(a);
										c.push({
											check: "parent-down",
											el: l
										})
									}
									l.add(h, 0)
								} else {
									l = null;
									h.insertAfter(a);
									f.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && (h.type == CKEDITOR.NODE_ELEMENT && !D[f.name][h.name]) && c.push({
										check: "el-up",
										el: h
									})
								}
							}
							a.remove()
						}
					} else if (d == "style") a.remove();
				else {
					a.parent && c.push({
						check: "it",
						el: a.parent
					});
					a.replaceWithChildren()
				}
			}

			function u(a, b, c) {
				var d, f;
				for (d = 0; d < c.length; ++d) {
					f =
						c[d];
					if ((!f.check || a.check(f.check, false)) && (!f.left || f.left(b))) {
						f.right(b, G);
						break
					}
				}
			}

			function B(a, b) {
				var c = b.getDefinition(),
					d = c.attributes,
					f = c.styles,
					e, g, h, l;
				if (a.name != c.element) return false;
				for (e in d)
					if (e == "class") {
						c = d[e].split(/\s+/);
						for (h = a.classes.join("|"); l = c.pop();)
							if (h.indexOf(l) == -1) return false
					} else if (a.attributes[e] != d[e]) return false;
				for (g in f)
					if (a.styles[g] != f[g]) return false;
				return true
			}

			function v(a, b) {
				var c, d;
				if (typeof a == "string") c = a;
				else if (a instanceof CKEDITOR.style) d = a;
				else {
					c = a[0];
					d = a[1]
				}
				return [{
					element: c,
					left: d,
					right: function(a, c) {
						c.transform(a, b)
					}
				}]
			}

			function z(a) {
				return function(b) {
					return B(b, a)
				}
			}

			function w(a) {
				return function(b, c) {
					c[a](b)
				}
			}
			var D = CKEDITOR.dtd,
				A = 1,
				I = CKEDITOR.tools.copy,
				K = CKEDITOR.tools.trim,
				C = "cke-test",
				y = ["", "p", "br", "div"];
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
					if (b === true) this.disabled = true;
					else {
						if (!b) this.customConfig = false;
						this.allow(b, "config", 1);
						this.allow(a.config.extraAllowedContent, "extra", 1);
						this.allow(y[a.enterMode] + " " + y[a.shiftEnterMode], "default", 1);
						this.disallow(a.config.disallowedContent)
					}
				} else {
					this.customConfig =
						false;
					this.allow(a, "default", 1)
				}
			};
			CKEDITOR.filter.instances = {};
			CKEDITOR.filter.prototype = {
				allow: function(b, d, f) {
					if (!c(this, b, f)) return false;
					var e, g;
					if (typeof b == "string") b = k(b);
					else if (b instanceof CKEDITOR.style) {
						if (b.toAllowedContentRules) return this.allow(b.toAllowedContentRules(this.editor), d, f);
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
							e.requiredClasses =
								e.classes;
							delete f["class"];
							e.attributes = f;
							e.requiredAttributes = f && CKEDITOR.tools.objectKeys(f)
						}
					} else if (CKEDITOR.tools.isArray(b)) {
						for (e = 0; e < b.length; ++e) g = this.allow(b[e], d, f);
						return g
					}
					a(this, b, d, this.allowedContent, this._.allowedRules);
					return true
				},
				applyTo: function(a, b, c, d) {
					if (this.disabled) return false;
					var f = this,
						e = [],
						g = this.editor && this.editor.config.protectedSource,
						h, l = false,
						j = {
							doFilter: !c,
							doTransform: true,
							doCallbacks: true,
							toHtml: b
						};
					a.forEach(function(a) {
						if (a.type == CKEDITOR.NODE_ELEMENT) {
							if (a.attributes["data-cke-filter"] ==
								"off") return false;
							if (!b || !(a.name == "span" && ~CKEDITOR.tools.objectKeys(a.attributes).join("|").indexOf("data-cke-"))) {
								h = r(f, a, e, j);
								if (h & A) l = true;
								else if (h & 2) return false
							}
						} else if (a.type == CKEDITOR.NODE_COMMENT && a.value.match(/^\{cke_protected\}(?!\{C\})/)) {
							var c;
							a: {
								var d = decodeURIComponent(a.value.replace(/^\{cke_protected\}/, ""));
								c = [];
								var i, y, m;
								if (g)
									for (y = 0; y < g.length; ++y)
										if ((m = d.match(g[y])) && m[0].length == d.length) {
											c = true;
											break a
										}
								d = CKEDITOR.htmlParser.fragment.fromHtml(d);
								d.children.length == 1 && (i =
									d.children[0]).type == CKEDITOR.NODE_ELEMENT && r(f, i, c, j);
								c = !c.length
							}
							c || e.push(a)
						}
					}, null, true);
					e.length && (l = true);
					for (var i, a = [], d = y[d || (this.editor ? this.editor.enterMode : CKEDITOR.ENTER_P)]; c = e.pop();) c.type == CKEDITOR.NODE_ELEMENT ? q(c, d, a) : c.remove();
					for (; i = a.pop();) {
						c = i.el;
						if (c.parent) switch (i.check) {
							case "it":
								D.$removeEmpty[c.name] && !c.children.length ? q(c, d, a) : s(c) || q(c, d, a);
								break;
							case "el-up":
								c.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && !D[c.parent.name][c.name] && q(c, d, a);
								break;
							case "parent-down":
								c.parent.type !=
									CKEDITOR.NODE_DOCUMENT_FRAGMENT && !D[c.parent.name][c.name] && q(c.parent, d, a)
						}
					}
					return l
				},
				checkFeature: function(a) {
					if (this.disabled || !a) return true;
					a.toFeature && (a = a.toFeature(this.editor));
					return !a.requiredContent || this.check(a.requiredContent)
				},
				disable: function() {
					this.disabled = true
				},
				disallow: function(b) {
					if (!c(this, b, true)) return false;
					typeof b == "string" && (b = k(b));
					a(this, b, null, this.disallowedContent, this._.disallowedRules);
					return true
				},
				addContentForms: function(a) {
					if (!this.disabled && a) {
						var b, c, d = [],
							f;
						for (b = 0; b < a.length && !f; ++b) {
							c = a[b];
							if ((typeof c == "string" || c instanceof CKEDITOR.style) && this.check(c)) f = c
						}
						if (f) {
							for (b = 0; b < a.length; ++b) d.push(v(a[b], f));
							this.addTransformations(d)
						}
					}
				},
				addElementCallback: function(a) {
					if (!this.elementCallbacks) this.elementCallbacks = [];
					this.elementCallbacks.push(a)
				},
				addFeature: function(a) {
					if (this.disabled || !a) return true;
					a.toFeature && (a = a.toFeature(this.editor));
					this.allow(a.allowedContent, a.name);
					this.addTransformations(a.contentTransformations);
					this.addContentForms(a.contentForms);
					return a.requiredContent && (this.customConfig || this.disallowedContent.length) ? this.check(a.requiredContent) : true
				},
				addTransformations: function(a) {
					var b, c;
					if (!this.disabled && a) {
						var d = this._.transformations,
							f;
						for (f = 0; f < a.length; ++f) {
							b = a[f];
							var e = void 0,
								g = void 0,
								h = void 0,
								l = void 0,
								j = void 0,
								i = void 0;
							c = [];
							for (g = 0; g < b.length; ++g) {
								h = b[g];
								if (typeof h == "string") {
									h = h.split(/\s*:\s*/);
									l = h[0];
									j = null;
									i = h[1]
								} else {
									l = h.check;
									j = h.left;
									i = h.right
								} if (!e) {
									e = h;
									e = e.element ? e.element : l ? l.match(/^([a-z0-9]+)/i)[0] : e.left.getDefinition().element
								}
								j instanceof
								CKEDITOR.style && (j = z(j));
								c.push({
									check: l == e ? null : l,
									left: j,
									right: typeof i == "string" ? w(i) : i
								})
							}
							b = e;
							d[b] || (d[b] = []);
							d[b].push(c)
						}
					}
				},
				check: function(a, b, c) {
					if (this.disabled) return true;
					if (CKEDITOR.tools.isArray(a)) {
						for (var d = a.length; d--;)
							if (this.check(a[d], b, c)) return true;
						return false
					}
					var f, e;
					if (typeof a == "string") {
						e = a + "<" + (b === false ? "0" : "1") + (c ? "1" : "0") + ">";
						if (e in this._.cachedChecks) return this._.cachedChecks[e];
						d = k(a).$1;
						f = d.styles;
						var g = d.classes;
						d.name = d.elements;
						d.classes = g = g ? g.split(/\s*,\s*/) : [];
						d.styles = i(f);
						d.attributes = i(d.attributes);
						d.children = [];
						g.length && (d.attributes["class"] = g.join(" "));
						if (f) d.attributes.style = CKEDITOR.tools.writeCssText(d.styles);
						f = d
					} else {
						d = a.getDefinition();
						f = d.styles;
						g = d.attributes || {};
						if (f) {
							f = I(f);
							g.style = CKEDITOR.tools.writeCssText(f, true)
						} else f = {};
						f = {
							name: d.element,
							attributes: g,
							classes: g["class"] ? g["class"].split(/\s+/) : [],
							styles: f,
							children: []
						}
					}
					var g = CKEDITOR.tools.clone(f),
						h = [],
						l;
					if (b !== false && (l = this._.transformations[f.name])) {
						for (d = 0; d < l.length; ++d) u(this,
							f, l[d]);
						m(f)
					}
					r(this, g, h, {
						doFilter: true,
						doTransform: b !== false,
						skipRequired: !c,
						skipFinalValidation: !c
					});
					b = h.length > 0 ? false : CKEDITOR.tools.objectCompare(f.attributes, g.attributes, true) ? true : false;
					typeof a == "string" && (this._.cachedChecks[e] = b);
					return b
				},
				getAllowedEnterMode: function() {
					var a = ["p", "div", "br"],
						b = {
							p: CKEDITOR.ENTER_P,
							div: CKEDITOR.ENTER_DIV,
							br: CKEDITOR.ENTER_BR
						};
					return function(c, d) {
						var f = a.slice(),
							e;
						if (this.check(y[c])) return c;
						for (d || (f = f.reverse()); e = f.pop();)
							if (this.check(e)) return b[e];
						return CKEDITOR.ENTER_BR
					}
				}()
			};
			var E = {
					styles: 1,
					attributes: 1,
					classes: 1
				},
				H = {
					styles: "requiredStyles",
					attributes: "requiredAttributes",
					classes: "requiredClasses"
				},
				F = /^([a-z0-9*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i,
				S = {
					styles: /{([^}]+)}/,
					attrs: /\[([^\]]+)\]/,
					classes: /\(([^\)]+)\)/
				},
				O = /^cke:(object|embed|param)$/,
				J = /^(object|embed|param)$/,
				G = CKEDITOR.filter.transformationsTools = {
					sizeToStyle: function(a) {
						this.lengthToStyle(a, "width");
						this.lengthToStyle(a,
							"height")
					},
					sizeToAttribute: function(a) {
						this.lengthToAttribute(a, "width");
						this.lengthToAttribute(a, "height")
					},
					lengthToStyle: function(a, b, c) {
						c = c || b;
						if (!(c in a.styles)) {
							var d = a.attributes[b];
							if (d) {
								/^\d+$/.test(d) && (d = d + "px");
								a.styles[c] = d
							}
						}
						delete a.attributes[b]
					},
					lengthToAttribute: function(a, b, c) {
						c = c || b;
						if (!(c in a.attributes)) {
							var d = a.styles[b],
								f = d && d.match(/^(\d+)(?:\.\d*)?px$/);
							f ? a.attributes[c] = f[1] : d == C && (a.attributes[c] = C)
						}
						delete a.styles[b]
					},
					alignmentToStyle: function(a) {
						if (!("float" in a.styles)) {
							var b =
								a.attributes.align;
							if (b == "left" || b == "right") a.styles["float"] = b
						}
						delete a.attributes.align
					},
					alignmentToAttribute: function(a) {
						if (!("align" in a.attributes)) {
							var b = a.styles["float"];
							if (b == "left" || b == "right") a.attributes.align = b
						}
						delete a.styles["float"]
					},
					matchesStyle: B,
					transform: function(a, b) {
						if (typeof b == "string") a.name = b;
						else {
							var c = b.getDefinition(),
								d = c.styles,
								f = c.attributes,
								e, g, h, l;
							a.name = c.element;
							for (e in f)
								if (e == "class") {
									c = a.classes.join("|");
									for (h = f[e].split(/\s+/); l = h.pop();) c.indexOf(l) == -1 &&
										a.classes.push(l)
								} else a.attributes[e] = f[e];
							for (g in d) a.styles[g] = d[g]
						}
					}
				}
		}(),
		function() {
			CKEDITOR.focusManager = function(a) {
				if (a.focusManager) return a.focusManager;
				this.hasFocus = false;
				this.currentActive = null;
				this._ = {
					editor: a
				};
				return this
			};
			CKEDITOR.focusManager._ = {
				blurDelay: 200
			};
			CKEDITOR.focusManager.prototype = {
				focus: function(a) {
					this._.timer && clearTimeout(this._.timer);
					if (a) this.currentActive = a;
					if (!this.hasFocus && !this._.locked) {
						(a = CKEDITOR.currentInstance) && a.focusManager.blur(1);
						this.hasFocus = true;
						(a = this._.editor.container) && a.addClass("cke_focus");
						this._.editor.fire("focus")
					}
				},
				lock: function() {
					this._.locked = 1
				},
				unlock: function() {
					delete this._.locked
				},
				blur: function(a) {
					function e() {
						if (this.hasFocus) {
							this.hasFocus = false;
							var a = this._.editor.container;
							a && a.removeClass("cke_focus");
							this._.editor.fire("blur")
						}
					}
					if (!this._.locked) {
						this._.timer && clearTimeout(this._.timer);
						var b = CKEDITOR.focusManager._.blurDelay;
						a || !b ? e.call(this) : this._.timer = CKEDITOR.tools.setTimeout(function() {
							delete this._.timer;
							e.call(this)
						}, b, this)
					}
				},
				add: function(a, e) {
					var b = a.getCustomData("focusmanager");
					if (!b || b != this) {
						b && b.remove(a);
						var b = "focus",
							d = "blur";
						if (e)
							if (CKEDITOR.env.ie) {
								b = "focusin";
								d = "focusout"
							} else CKEDITOR.event.useCapture = 1;
						var f = {
							blur: function() {
								a.equals(this.currentActive) && this.blur()
							},
							focus: function() {
								this.focus(a)
							}
						};
						a.on(b, f.focus, this);
						a.on(d, f.blur, this);
						if (e) CKEDITOR.event.useCapture = 0;
						a.setCustomData("focusmanager", this);
						a.setCustomData("focusmanager_handlers", f)
					}
				},
				remove: function(a) {
					a.removeCustomData("focusmanager");
					var e = a.removeCustomData("focusmanager_handlers");
					a.removeListener("blur", e.blur);
					a.removeListener("focus", e.focus)
				}
			}
		}(), CKEDITOR.keystrokeHandler = function(a) {
			if (a.keystrokeHandler) return a.keystrokeHandler;
			this.keystrokes = {};
			this.blockedKeystrokes = {};
			this._ = {
				editor: a
			};
			return this
		},
		function() {
			var a, e = function(b) {
					var b = b.data,
						f = b.getKeystroke(),
						c = this.keystrokes[f],
						e = this._.editor;
					a = e.fire("key", {
						keyCode: f,
						domEvent: b
					}) === false;
					if (!a) {
						c && (a = e.execCommand(c, {
							from: "keystrokeHandler"
						}) !== false);
						a || (a = !!this.blockedKeystrokes[f])
					}
					a && b.preventDefault(true);
					return !a
				},
				b = function(b) {
					if (a) {
						a = false;
						b.data.preventDefault(true)
					}
				};
			CKEDITOR.keystrokeHandler.prototype = {
				attach: function(a) {
					a.on("keydown", e, this);
					if (CKEDITOR.env.gecko && CKEDITOR.env.mac) a.on("keypress", b, this)
				}
			}
		}(),
		function() {
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
					if (!a || !CKEDITOR.lang.languages[a]) a = this.detect(e, a);
					var d = this,
						e = function() {
							d[a].dir = d.rtl[a] ? "rtl" : "ltr";
							b(a, d[a])
						};
					this[a] ? e() : CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("lang/" + a + ".js"), e, this)
				},
				detect: function(a, e) {
					var b = this.languages,
						e = e || navigator.userLanguage || navigator.language ||
						a,
						d = e.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/),
						f = d[1],
						d = d[2];
					b[f + "-" + d] ? f = f + "-" + d : b[f] || (f = null);
					CKEDITOR.lang.detect = f ? function() {
						return f
					} : function(a) {
						return a
					};
					return f || a
				}
			}
		}(), CKEDITOR.scriptLoader = function() {
			var a = {},
				e = {};
			return {
				load: function(b, d, f, c) {
					var h = typeof b == "string";
					h && (b = [b]);
					f || (f = CKEDITOR);
					var j = b.length,
						g = [],
						i = [],
						k = function(a) {
							d && (h ? d.call(f, a) : d.call(f, g, i))
						};
					if (j === 0) k(true);
					else {
						var n = function(a, b) {
								(b ? g : i).push(a);
								if (--j <= 0) {
									c && CKEDITOR.document.getDocumentElement().removeStyle("cursor");
									k(b)
								}
							},
							o = function(b, c) {
								a[b] = 1;
								var d = e[b];
								delete e[b];
								for (var f = 0; f < d.length; f++) d[f](b, c)
							},
							r = function(b) {
								if (a[b]) n(b, true);
								else {
									var c = e[b] || (e[b] = []);
									c.push(n);
									if (!(c.length > 1)) {
										var f = new CKEDITOR.dom.element("script");
										f.setAttributes({
											type: "text/javascript",
											src: b
										});
										if (d)
											if (CKEDITOR.env.ie && CKEDITOR.env.version < 11) f.$.onreadystatechange = function() {
												if (f.$.readyState == "loaded" || f.$.readyState == "complete") {
													f.$.onreadystatechange = null;
													o(b, true)
												}
											};
											else {
												f.$.onload = function() {
													setTimeout(function() {
															o(b, true)
														},
														0)
												};
												f.$.onerror = function() {
													o(b, false)
												}
											}
										f.appendTo(CKEDITOR.document.getHead())
									}
								}
							};
						c && CKEDITOR.document.getDocumentElement().setStyle("cursor", "wait");
						for (var l = 0; l < j; l++) r(b[l])
					}
				},
				queue: function() {
					function a() {
						var b;
						(b = d[0]) && this.load(b.scriptUrl, b.callback, CKEDITOR, 0)
					}
					var d = [];
					return function(f, c) {
						var e = this;
						d.push({
							scriptUrl: f,
							callback: function() {
								c && c.apply(this, arguments);
								d.shift();
								a.call(e)
							}
						});
						d.length == 1 && a.call(this)
					}
				}()
			}
		}(), CKEDITOR.resourceManager = function(a, e) {
			this.basePath = a;
			this.fileName =
				e;
			this.registered = {};
			this.loaded = {};
			this.externals = {};
			this._ = {
				waitingList: {}
			}
		}, CKEDITOR.resourceManager.prototype = {
			add: function(a, e) {
				if (this.registered[a]) throw '[CKEDITOR.resourceManager.add] The resource name "' + a + '" is already registered.';
				var b = this.registered[a] = e || {};
				b.name = a;
				b.path = this.getPath(a);
				CKEDITOR.fire(a + CKEDITOR.tools.capitalize(this.fileName) + "Ready", b);
				return this.get(a)
			},
			get: function(a) {
				return this.registered[a] || null
			},
			getPath: function(a) {
				var e = this.externals[a];
				return CKEDITOR.getUrl(e &&
					e.dir || this.basePath + a + "/")
			},
			getFilePath: function(a) {
				var e = this.externals[a];
				return CKEDITOR.getUrl(this.getPath(a) + (e ? e.file : this.fileName + ".js"))
			},
			addExternal: function(a, e, b) {
				for (var a = a.split(","), d = 0; d < a.length; d++) {
					var f = a[d];
					b || (e = e.replace(/[^\/]+$/, function(a) {
						b = a;
						return ""
					}));
					this.externals[f] = {
						dir: e,
						file: b || this.fileName + ".js"
					}
				}
			},
			load: function(a, e, b) {
				CKEDITOR.tools.isArray(a) || (a = a ? [a] : []);
				for (var d = this.loaded, f = this.registered, c = [], h = {}, j = {}, g = 0; g < a.length; g++) {
					var i = a[g];
					if (i)
						if (!d[i] &&
							!f[i]) {
							var k = this.getFilePath(i);
							c.push(k);
							k in h || (h[k] = []);
							h[k].push(i)
						} else j[i] = this.get(i)
				}
				CKEDITOR.scriptLoader.load(c, function(a, c) {
					if (c.length) throw '[CKEDITOR.resourceManager.load] Resource name "' + h[c[0]].join(",") + '" was not found at "' + c[0] + '".';
					for (var f = 0; f < a.length; f++)
						for (var g = h[a[f]], i = 0; i < g.length; i++) {
							var k = g[i];
							j[k] = this.get(k);
							d[k] = 1
						}
					e.call(b, j)
				}, this)
			}
		}, CKEDITOR.plugins = new CKEDITOR.resourceManager("plugins/", "plugin"), CKEDITOR.plugins.load = CKEDITOR.tools.override(CKEDITOR.plugins.load,
			function(a) {
				var e = {};
				return function(b, d, f) {
					var c = {},
						h = function(b) {
							a.call(this, b, function(a) {
								CKEDITOR.tools.extend(c, a);
								var b = [],
									j;
								for (j in a) {
									var n = a[j],
										o = n && n.requires;
									if (!e[j]) {
										if (n.icons)
											for (var r = n.icons.split(","), l = r.length; l--;) CKEDITOR.skin.addIcon(r[l], n.path + "icons/" + (CKEDITOR.env.hidpi && n.hidpi ? "hidpi/" : "") + r[l] + ".png");
										e[j] = 1
									}
									if (o) {
										o.split && (o = o.split(","));
										for (n = 0; n < o.length; n++) c[o[n]] || b.push(o[n])
									}
								}
								if (b.length) h.call(this, b);
								else {
									for (j in c) {
										n = c[j];
										if (n.onLoad && !n.onLoad._called) {
											n.onLoad() ===
												false && delete c[j];
											n.onLoad._called = 1
										}
									}
									d && d.call(f || window, c)
								}
							}, this)
						};
					h.call(this, b)
				}
			}), CKEDITOR.plugins.setLang = function(a, e, b) {
			var d = this.get(a),
				a = d.langEntries || (d.langEntries = {}),
				d = d.lang || (d.lang = []);
			d.split && (d = d.split(","));
			CKEDITOR.tools.indexOf(d, e) == -1 && d.push(e);
			a[e] = b
		}, CKEDITOR.ui = function(a) {
			if (a.ui) return a.ui;
			this.items = {};
			this.instances = {};
			this.editor = a;
			this._ = {
				handlers: {}
			};
			return this
		}, CKEDITOR.ui.prototype = {
			add: function(a, e, b) {
				b.name = a.toLowerCase();
				var d = this.items[a] = {
					type: e,
					command: b.command || null,
					args: Array.prototype.slice.call(arguments, 2)
				};
				CKEDITOR.tools.extend(d, b)
			},
			get: function(a) {
				return this.instances[a]
			},
			create: function(a) {
				var e = this.items[a],
					b = e && this._.handlers[e.type],
					d = e && e.command && this.editor.getCommand(e.command),
					b = b && b.create.apply(this, e.args);
				this.instances[a] = b;
				d && d.uiItems.push(b);
				if (b && !b.type) b.type = e.type;
				return b
			},
			addHandler: function(a, e) {
				this._.handlers[a] = e
			},
			space: function(a) {
				return CKEDITOR.document.getById(this.spaceId(a))
			},
			spaceId: function(a) {
				return this.editor.id +
					"_" + a
			}
		}, CKEDITOR.event.implementOn(CKEDITOR.ui),
		function() {
			function a(a, c, d) {
				CKEDITOR.event.call(this);
				a = a && CKEDITOR.tools.clone(a);
				if (c !== void 0) {
					if (c instanceof CKEDITOR.dom.element) {
						if (!d) throw Error("One of the element modes must be specified.");
					} else throw Error("Expect element of type CKEDITOR.dom.element."); if (CKEDITOR.env.ie && CKEDITOR.env.quirks && d == CKEDITOR.ELEMENT_MODE_INLINE) throw Error("Inline element mode is not supported on IE quirks.");
					if (!(d == CKEDITOR.ELEMENT_MODE_INLINE ? c.is(CKEDITOR.dtd.$editable) ||
						c.is("textarea") : d == CKEDITOR.ELEMENT_MODE_REPLACE ? !c.is(CKEDITOR.dtd.$nonBodyContent) : 1)) throw Error('The specified element mode is not supported on element: "' + c.getName() + '".');
					this.element = c;
					this.elementMode = d;
					this.name = this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO && (c.getId() || c.getNameAtt())
				} else this.elementMode = CKEDITOR.ELEMENT_MODE_NONE;
				this._ = {};
				this.commands = {};
				this.templates = {};
				this.name = this.name || e();
				this.id = CKEDITOR.tools.getNextId();
				this.status = "unloaded";
				this.config = CKEDITOR.tools.prototypedCopy(CKEDITOR.config);
				this.ui = new CKEDITOR.ui(this);
				this.focusManager = new CKEDITOR.focusManager(this);
				this.keystrokeHandler = new CKEDITOR.keystrokeHandler(this);
				this.on("readOnly", b);
				this.on("selectionChange", function(a) {
					f(this, a.data.path)
				});
				this.on("activeFilterChange", function() {
					f(this, this.elementPath(), true)
				});
				this.on("mode", b);
				this.on("instanceReady", function() {
					this.config.startupFocus && this.focus()
				});
				CKEDITOR.fire("instanceCreated", null, this);
				CKEDITOR.add(this);
				CKEDITOR.tools.setTimeout(function() {
					h(this, a)
				}, 0, this)
			}

			function e() {
				do var a = "editor" + ++o; while (CKEDITOR.instances[a]);
				return a
			}

			function b() {
				var a = this.commands,
					b;
				for (b in a) d(this, a[b])
			}

			function d(a, b) {
				b[b.startDisabled ? "disable" : a.readOnly && !b.readOnly ? "disable" : b.modes[a.mode] ? "enable" : "disable"]()
			}

			function f(a, b, c) {
				if (b) {
					var d, f, e = a.commands;
					for (f in e) {
						d = e[f];
						(c || d.contextSensitive) && d.refresh(a, b)
					}
				}
			}

			function c(a) {
				var b = a.config.customConfig;
				if (!b) return false;
				var b = CKEDITOR.getUrl(b),
					d = r[b] || (r[b] = {});
				if (d.fn) {
					d.fn.call(a, a.config);
					(CKEDITOR.getUrl(a.config.customConfig) ==
						b || !c(a)) && a.fireOnce("customConfigLoaded")
				} else CKEDITOR.scriptLoader.queue(b, function() {
					d.fn = CKEDITOR.editorConfig ? CKEDITOR.editorConfig : function() {};
					c(a)
				});
				return true
			}

			function h(a, b) {
				a.on("customConfigLoaded", function() {
					if (b) {
						if (b.on)
							for (var c in b.on) a.on(c, b.on[c]);
						CKEDITOR.tools.extend(a.config, b, true);
						delete a.config.on
					}
					c = a.config;
					a.readOnly = !(!c.readOnly && !(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.is("textarea") ? a.element.hasAttribute("disabled") : a.element.isReadOnly() : a.elementMode ==
						CKEDITOR.ELEMENT_MODE_REPLACE && a.element.hasAttribute("disabled")));
					a.blockless = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? !(a.element.is("textarea") || CKEDITOR.dtd[a.element.getName()].p) : false;
					a.tabIndex = c.tabIndex || a.element && a.element.getAttribute("tabindex") || 0;
					a.activeEnterMode = a.enterMode = a.blockless ? CKEDITOR.ENTER_BR : c.enterMode;
					a.activeShiftEnterMode = a.shiftEnterMode = a.blockless ? CKEDITOR.ENTER_BR : c.shiftEnterMode;
					if (c.skin) CKEDITOR.skinName = c.skin;
					a.fireOnce("configLoaded");
					a.dataProcessor =
						new CKEDITOR.htmlDataProcessor(a);
					a.filter = a.activeFilter = new CKEDITOR.filter(a);
					j(a)
				});
				if (b && b.customConfig != void 0) a.config.customConfig = b.customConfig;
				c(a) || a.fireOnce("customConfigLoaded")
			}

			function j(a) {
				CKEDITOR.skin.loadPart("editor", function() {
					g(a)
				})
			}

			function g(a) {
				CKEDITOR.lang.load(a.config.language, a.config.defaultLanguage, function(b, c) {
					var d = a.config.title;
					a.langCode = b;
					a.lang = CKEDITOR.tools.prototypedCopy(c);
					a.title = typeof d == "string" || d === false ? d : [a.lang.editor, a.name].join(", ");
					if (!a.config.contentsLangDirection) a.config.contentsLangDirection =
						a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.getDirection(1) : a.lang.dir;
					a.fire("langLoaded");
					i(a)
				})
			}

			function i(a) {
				a.getStylesSet(function(b) {
					a.once("loaded", function() {
						a.fire("stylesSet", {
							styles: b
						})
					}, null, null, 1);
					k(a)
				})
			}

			function k(a) {
				var b = a.config,
					c = b.plugins,
					d = b.extraPlugins,
					f = b.removePlugins;
				if (d) var e = RegExp("(?:^|,)(?:" + d.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"),
					c = c.replace(e, ""),
					c = c + ("," + d);
				if (f) var g = RegExp("(?:^|,)(?:" + f.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"),
					c = c.replace(g, "");
				CKEDITOR.env.air &&
					(c = c + ",adobeair");
				CKEDITOR.plugins.load(c.split(","), function(c) {
					var d = [],
						f = [],
						e = [];
					a.plugins = c;
					for (var h in c) {
						var j = c[h],
							i = j.lang,
							p = null,
							k = j.requires,
							x;
						CKEDITOR.tools.isArray(k) && (k = k.join(","));
						if (k && (x = k.match(g)))
							for (; k = x.pop();) CKEDITOR.tools.setTimeout(function(a, b) {
								throw Error('Plugin "' + a.replace(",", "") + '" cannot be removed from the plugins list, because it\'s required by "' + b + '" plugin.');
							}, 0, null, [k, h]);
						if (i && !a.lang[h]) {
							i.split && (i = i.split(","));
							if (CKEDITOR.tools.indexOf(i, a.langCode) >=
								0) p = a.langCode;
							else {
								p = a.langCode.replace(/-.*/, "");
								p = p != a.langCode && CKEDITOR.tools.indexOf(i, p) >= 0 ? p : CKEDITOR.tools.indexOf(i, "en") >= 0 ? "en" : i[0]
							} if (!j.langEntries || !j.langEntries[p]) e.push(CKEDITOR.getUrl(j.path + "lang/" + p + ".js"));
							else {
								a.lang[h] = j.langEntries[p];
								p = null
							}
						}
						f.push(p);
						d.push(j)
					}
					CKEDITOR.scriptLoader.load(e, function() {
						for (var c = ["beforeInit", "init", "afterInit"], e = 0; e < c.length; e++)
							for (var g = 0; g < d.length; g++) {
								var h = d[g];
								e === 0 && (f[g] && h.lang && h.langEntries) && (a.lang[h.name] = h.langEntries[f[g]]);
								if (h[c[e]]) h[c[e]](a)
							}
						a.fireOnce("pluginsLoaded");
						b.keystrokes && a.setKeystroke(a.config.keystrokes);
						for (g = 0; g < a.config.blockedKeystrokes.length; g++) a.keystrokeHandler.blockedKeystrokes[a.config.blockedKeystrokes[g]] = 1;
						a.status = "loaded";
						a.fireOnce("loaded");
						CKEDITOR.fire("instanceLoaded", null, a)
					})
				})
			}

			function n() {
				var a = this.element;
				if (a && this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
					var b = this.getData();
					this.config.htmlEncodeOutput && (b = CKEDITOR.tools.htmlEncode(b));
					a.is("textarea") ? a.setValue(b) :
						a.setHtml(b);
					return true
				}
				return false
			}
			a.prototype = CKEDITOR.editor.prototype;
			CKEDITOR.editor = a;
			var o = 0,
				r = {};
			CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
				addCommand: function(a, b) {
					b.name = a.toLowerCase();
					var c = new CKEDITOR.command(this, b);
					this.mode && d(this, c);
					return this.commands[a] = c
				},
				_attachToForm: function() {
					var a = this,
						b = a.element,
						c = new CKEDITOR.dom.element(b.$.form);
					if (b.is("textarea") && c) {
						var d = function(c) {
							a.updateElement();
							a._.required && (!b.getValue() && a.fire("required") === false) && c.data.preventDefault()
						};
						c.on("submit", d);
						if (c.$.submit && c.$.submit.call && c.$.submit.apply) c.$.submit = CKEDITOR.tools.override(c.$.submit, function(a) {
							return function() {
								d();
								a.apply ? a.apply(this) : a()
							}
						});
						a.on("destroy", function() {
							c.removeListener("submit", d)
						})
					}
				},
				destroy: function(a) {
					this.fire("beforeDestroy");
					!a && n.call(this);
					this.editable(null);
					this.status = "destroyed";
					this.fire("destroy");
					this.removeAllListeners();
					CKEDITOR.remove(this);
					CKEDITOR.fire("instanceDestroyed", null, this)
				},
				elementPath: function(a) {
					if (!a) {
						a = this.getSelection();
						if (!a) return null;
						a = a.getStartElement()
					}
					return a ? new CKEDITOR.dom.elementPath(a, this.editable()) : null
				},
				createRange: function() {
					var a = this.editable();
					return a ? new CKEDITOR.dom.range(a) : null
				},
				execCommand: function(a, b) {
					var c = this.getCommand(a),
						d = {
							name: a,
							commandData: b,
							command: c
						};
					if (c && c.state != CKEDITOR.TRISTATE_DISABLED && this.fire("beforeCommandExec", d) !== false) {
						d.returnValue = c.exec(d.commandData);
						if (!c.async && this.fire("afterCommandExec", d) !== false) return d.returnValue
					}
					return false
				},
				getCommand: function(a) {
					return this.commands[a]
				},
				getData: function(a) {
					!a && this.fire("beforeGetData");
					var b = this._.data;
					if (typeof b != "string") b = (b = this.element) && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? b.is("textarea") ? b.getValue() : b.getHtml() : "";
					b = {
						dataValue: b
					};
					!a && this.fire("getData", b);
					return b.dataValue
				},
				getSnapshot: function() {
					var a = this.fire("getSnapshot");
					if (typeof a != "string") {
						var b = this.element;
						b && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && (a = b.is("textarea") ? b.getValue() : b.getHtml())
					}
					return a
				},
				loadSnapshot: function(a) {
					this.fire("loadSnapshot",
						a)
				},
				setData: function(a, b, c) {
					!c && this.fire("saveSnapshot");
					if (b || !c) this.once("dataReady", function(a) {
						c || this.fire("saveSnapshot");
						b && b.call(a.editor)
					});
					a = {
						dataValue: a
					};
					!c && this.fire("setData", a);
					this._.data = a.dataValue;
					!c && this.fire("afterSetData", a)
				},
				setReadOnly: function(a) {
					a = a == void 0 || a;
					if (this.readOnly != a) {
						this.readOnly = a;
						this.keystrokeHandler.blockedKeystrokes[8] = +a;
						this.editable().setReadOnly(a);
						this.fire("readOnly")
					}
				},
				insertHtml: function(a, b) {
					this.fire("insertHtml", {
						dataValue: a,
						mode: b
					})
				},
				insertText: function(a) {
					this.fire("insertText",
						a)
				},
				insertElement: function(a) {
					this.fire("insertElement", a)
				},
				focus: function() {
					this.fire("beforeFocus")
				},
				checkDirty: function() {
					return this.status == "ready" && this._.previousValue !== this.getSnapshot()
				},
				resetDirty: function() {
					this._.previousValue = this.getSnapshot()
				},
				updateElement: function() {
					return n.call(this)
				},
				setKeystroke: function() {
					for (var a = this.keystrokeHandler.keystrokes, b = CKEDITOR.tools.isArray(arguments[0]) ? arguments[0] : [
						[].slice.call(arguments, 0)
					], c, d, f = b.length; f--;) {
						c = b[f];
						d = 0;
						if (CKEDITOR.tools.isArray(c)) {
							d =
								c[1];
							c = c[0]
						}
						d ? a[c] = d : delete a[c]
					}
				},
				addFeature: function(a) {
					return this.filter.addFeature(a)
				},
				setActiveFilter: function(a) {
					if (!a) a = this.filter;
					if (this.activeFilter !== a) {
						this.activeFilter = a;
						this.fire("activeFilterChange");
						a === this.filter ? this.setActiveEnterMode(null, null) : this.setActiveEnterMode(a.getAllowedEnterMode(this.enterMode), a.getAllowedEnterMode(this.shiftEnterMode, true))
					}
				},
				setActiveEnterMode: function(a, b) {
					a = a ? this.blockless ? CKEDITOR.ENTER_BR : a : this.enterMode;
					b = b ? this.blockless ? CKEDITOR.ENTER_BR :
						b : this.shiftEnterMode;
					if (this.activeEnterMode != a || this.activeShiftEnterMode != b) {
						this.activeEnterMode = a;
						this.activeShiftEnterMode = b;
						this.fire("activeEnterModeChange")
					}
				}
			})
		}(), CKEDITOR.ELEMENT_MODE_NONE = 0, CKEDITOR.ELEMENT_MODE_REPLACE = 1, CKEDITOR.ELEMENT_MODE_APPENDTO = 2, CKEDITOR.ELEMENT_MODE_INLINE = 3, CKEDITOR.htmlParser = function() {
			this._ = {
				htmlPartsRegex: RegExp("<(?:(?:\\/([^>]+)>)|(?:!--([\\S|\\s]*?)--\>)|(?:([^\\s>]+)\\s*((?:(?:\"[^\"]*\")|(?:'[^']*')|[^\"'>])*)\\/?>))", "g")
			}
		},
		function() {
			var a = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g,
				e = {
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
					for (var d, f, c = 0, h; d = this._.htmlPartsRegex.exec(b);) {
						f = d.index;
						if (f > c) {
							c = b.substring(c, f);
							if (h) h.push(c);
							else this.onText(c)
						}
						c = this._.htmlPartsRegex.lastIndex;
						if (f = d[1]) {
							f = f.toLowerCase();
							if (h && CKEDITOR.dtd.$cdata[f]) {
								this.onCDATA(h.join(""));
								h = null
							}
							if (!h) {
								this.onTagClose(f);
								continue
							}
						}
						if (h) h.push(d[0]);
						else if (f = d[3]) {
							f = f.toLowerCase();
							if (!/="/.test(f)) {
								var j = {},
									g;
								d = d[4];
								var i = !!(d && d.charAt(d.length - 1) == "/");
								if (d)
									for (; g = a.exec(d);) {
										var k = g[1].toLowerCase();
										g = g[2] || g[3] || g[4] || "";
										j[k] = !g && e[k] ? k : CKEDITOR.tools.htmlDecodeAttr(g)
									}
								this.onTagOpen(f, j, i);
								!h && CKEDITOR.dtd.$cdata[f] && (h = [])
							}
						} else if (f = d[2]) this.onComment(f)
					}
					if (b.length > c) this.onText(b.substring(c, b.length))
				}
			}
		}(), CKEDITOR.htmlParser.basicWriter = CKEDITOR.tools.createClass({
			$: function() {
				this._ = {
					output: []
				}
			},
			proto: {
				openTag: function(a) {
					this._.output.push("<", a)
				},
				openTagClose: function(a, e) {
					e ? this._.output.push(" />") : this._.output.push(">")
				},
				attribute: function(a, e) {
					typeof e == "string" && (e = CKEDITOR.tools.htmlEncodeAttr(e));
					this._.output.push(" ", a, '="', e, '"')
				},
				closeTag: function(a) {
					this._.output.push("</", a, ">")
				},
				text: function(a) {
					this._.output.push(a)
				},
				comment: function(a) {
					this._.output.push("<\!--", a, "--\>")
				},
				write: function(a) {
					this._.output.push(a)
				},
				reset: function() {
					this._.output = [];
					this._.indent =
						false
				},
				getHtml: function(a) {
					var e = this._.output.join("");
					a && this.reset();
					return e
				}
			}
		}), "use strict",
		function() {
			CKEDITOR.htmlParser.node = function() {};
			CKEDITOR.htmlParser.node.prototype = {
				remove: function() {
					var a = this.parent.children,
						e = CKEDITOR.tools.indexOf(a, this),
						b = this.previous,
						d = this.next;
					b && (b.next = d);
					d && (d.previous = b);
					a.splice(e, 1);
					this.parent = null
				},
				replaceWith: function(a) {
					var e = this.parent.children,
						b = CKEDITOR.tools.indexOf(e, this),
						d = a.previous = this.previous,
						f = a.next = this.next;
					d && (d.next = a);
					f && (f.previous =
						a);
					e[b] = a;
					a.parent = this.parent;
					this.parent = null
				},
				insertAfter: function(a) {
					var e = a.parent.children,
						b = CKEDITOR.tools.indexOf(e, a),
						d = a.next;
					e.splice(b + 1, 0, this);
					this.next = a.next;
					this.previous = a;
					a.next = this;
					d && (d.previous = this);
					this.parent = a.parent
				},
				insertBefore: function(a) {
					var e = a.parent.children,
						b = CKEDITOR.tools.indexOf(e, a);
					e.splice(b, 0, this);
					this.next = a;
					(this.previous = a.previous) && (a.previous.next = this);
					a.previous = this;
					this.parent = a.parent
				},
				getAscendant: function(a) {
					var e = typeof a == "function" ? a : typeof a ==
						"string" ? function(b) {
							return b.name == a
						} : function(b) {
							return b.name in a
						},
						b = this.parent;
					for (; b && b.type == CKEDITOR.NODE_ELEMENT;) {
						if (e(b)) return b;
						b = b.parent
					}
					return null
				},
				wrapWith: function(a) {
					this.replaceWith(a);
					a.add(this);
					return a
				},
				getIndex: function() {
					return CKEDITOR.tools.indexOf(this.parent.children, this)
				},
				getFilterContext: function(a) {
					return a || {}
				}
			}
		}(), "use strict", CKEDITOR.htmlParser.comment = function(a) {
			this.value = a;
			this._ = {
				isBlockLike: false
			}
		}, CKEDITOR.htmlParser.comment.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
			type: CKEDITOR.NODE_COMMENT,
			filter: function(a, e) {
				var b = this.value;
				if (!(b = a.onComment(e, b, this))) {
					this.remove();
					return false
				}
				if (typeof b != "string") {
					this.replaceWith(b);
					return false
				}
				this.value = b;
				return true
			},
			writeHtml: function(a, e) {
				e && this.filter(e);
				a.comment(this.value)
			}
		}), "use strict",
		function() {
			CKEDITOR.htmlParser.text = function(a) {
				this.value = a;
				this._ = {
					isBlockLike: false
				}
			};
			CKEDITOR.htmlParser.text.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
				type: CKEDITOR.NODE_TEXT,
				filter: function(a,
					e) {
					if (!(this.value = a.onText(e, this.value, this))) {
						this.remove();
						return false
					}
				},
				writeHtml: function(a, e) {
					e && this.filter(e);
					a.text(this.value)
				}
			})
		}(), "use strict",
		function() {
			CKEDITOR.htmlParser.cdata = function(a) {
				this.value = a
			};
			CKEDITOR.htmlParser.cdata.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
				type: CKEDITOR.NODE_TEXT,
				filter: function() {},
				writeHtml: function(a) {
					a.write(this.value)
				}
			})
		}(), "use strict", CKEDITOR.htmlParser.fragment = function() {
			this.children = [];
			this.parent = null;
			this._ = {
				isBlockLike: true,
				hasInlineStarted: false
			}
		},
		function() {
			function a(a) {
				return a.attributes["data-cke-survive"] ? false : a.name == "a" && a.attributes.href || CKEDITOR.dtd.$removeEmpty[a.name]
			}
			var e = CKEDITOR.tools.extend({
					table: 1,
					ul: 1,
					ol: 1,
					dl: 1
				}, CKEDITOR.dtd.table, CKEDITOR.dtd.ul, CKEDITOR.dtd.ol, CKEDITOR.dtd.dl),
				b = {
					ol: 1,
					ul: 1
				},
				d = CKEDITOR.tools.extend({}, {
					html: 1
				}, CKEDITOR.dtd.html, CKEDITOR.dtd.body, CKEDITOR.dtd.head, {
					style: 1,
					script: 1
				}),
				f = {
					ul: "li",
					ol: "li",
					dl: "dd",
					table: "tbody",
					tbody: "tr",
					thead: "tr",
					tfoot: "tr",
					tr: "td"
				};
			CKEDITOR.htmlParser.fragment.fromHtml =
				function(c, h, j) {
					function g(a) {
						var b;
						if (s.length > 0)
							for (var c = 0; c < s.length; c++) {
								var d = s[c],
									f = d.name,
									e = CKEDITOR.dtd[f],
									g = p.name && CKEDITOR.dtd[p.name];
								if ((!g || g[f]) && (!a || !e || e[a] || !CKEDITOR.dtd[a])) {
									if (!b) {
										i();
										b = 1
									}
									d = d.clone();
									d.parent = p;
									p = d;
									s.splice(c, 1);
									c--
								} else if (f == p.name) {
									n(p, p.parent, 1);
									c--
								}
							}
					}

					function i() {
						for (; t.length;) n(t.shift(), p)
					}

					function k(a) {
						if (a._.isBlockLike && a.name != "pre" && a.name != "textarea") {
							var b = a.children.length,
								c = a.children[b - 1],
								d;
							if (c && c.type == CKEDITOR.NODE_TEXT)(d = CKEDITOR.tools.rtrim(c.value)) ?
								c.value = d : a.children.length = b - 1
						}
					}

					function n(b, c, d) {
						var c = c || p || m,
							f = p;
						if (b.previous === void 0) {
							if (o(c, b)) {
								p = c;
								l.onTagOpen(j, {});
								b.returnPoint = c = p
							}
							k(b);
							(!a(b) || b.children.length) && c.add(b);
							b.name == "pre" && (q = false);
							b.name == "textarea" && (x = false)
						}
						if (b.returnPoint) {
							p = b.returnPoint;
							delete b.returnPoint
						} else p = d ? c : f
					}

					function o(a, b) {
						if ((a == m || a.name == "body") && j && (!a.name || CKEDITOR.dtd[a.name][j])) {
							var c, d;
							return (c = b.attributes && (d = b.attributes["data-cke-real-element-type"]) ? d : b.name) && c in CKEDITOR.dtd.$inline &&
								!(c in CKEDITOR.dtd.head) && !b.isOrphan || b.type == CKEDITOR.NODE_TEXT
						}
					}

					function r(a, b) {
						return a in CKEDITOR.dtd.$listItem || a in CKEDITOR.dtd.$tableContent ? a == b || a == "dt" && b == "dd" || a == "dd" && b == "dt" : false
					}
					var l = new CKEDITOR.htmlParser,
						m = h instanceof CKEDITOR.htmlParser.element ? h : typeof h == "string" ? new CKEDITOR.htmlParser.element(h) : new CKEDITOR.htmlParser.fragment,
						s = [],
						t = [],
						p = m,
						x = m.name == "textarea",
						q = m.name == "pre";
					l.onTagOpen = function(c, f, h, j) {
						f = new CKEDITOR.htmlParser.element(c, f);
						if (f.isUnknown && h) f.isEmpty =
							true;
						f.isOptionalClose = j;
						if (a(f)) s.push(f);
						else {
							if (c == "pre") q = true;
							else {
								if (c == "br" && q) {
									p.add(new CKEDITOR.htmlParser.text("\n"));
									return
								}
								c == "textarea" && (x = true)
							} if (c == "br") t.push(f);
							else {
								for (;;) {
									j = (h = p.name) ? CKEDITOR.dtd[h] || (p._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : d;
									if (!f.isUnknown && !p.isUnknown && !j[c])
										if (p.isOptionalClose) l.onTagClose(h);
										else if (c in b && h in b) {
										h = p.children;
										(h = h[h.length - 1]) && h.name == "li" || n(h = new CKEDITOR.htmlParser.element("li"), p);
										!f.returnPoint && (f.returnPoint = p);
										p = h
									} else if (c in CKEDITOR.dtd.$listItem && !r(c, h)) l.onTagOpen(c == "li" ? "ul" : "dl", {}, 0, 1);
									else if (h in e && !r(c, h)) {
										!f.returnPoint && (f.returnPoint = p);
										p = p.parent
									} else {
										h in CKEDITOR.dtd.$inline && s.unshift(p);
										if (p.parent) n(p, p.parent, 1);
										else {
											f.isOrphan = 1;
											break
										}
									} else break
								}
								g(c);
								i();
								f.parent = p;
								f.isEmpty ? n(f) : p = f
							}
						}
					};
					l.onTagClose = function(a) {
						for (var b = s.length - 1; b >= 0; b--)
							if (a == s[b].name) {
								s.splice(b, 1);
								return
							}
						for (var c = [], d = [], f = p; f != m && f.name != a;) {
							f._.isBlockLike || d.unshift(f);
							c.push(f);
							f = f.returnPoint || f.parent
						}
						if (f !=
							m) {
							for (b = 0; b < c.length; b++) {
								var e = c[b];
								n(e, e.parent)
							}
							p = f;
							f._.isBlockLike && i();
							n(f, f.parent);
							if (f == p) p = p.parent;
							s = s.concat(d)
						}
						a == "body" && (j = false)
					};
					l.onText = function(a) {
						if ((!p._.hasInlineStarted || t.length) && !q && !x) {
							a = CKEDITOR.tools.ltrim(a);
							if (a.length === 0) return
						}
						var b = p.name,
							c = b ? CKEDITOR.dtd[b] || (p._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : d;
						if (!x && !c["#"] && b in e) {
							l.onTagOpen(f[b] || "");
							l.onText(a)
						} else {
							i();
							g();
							!q && !x && (a = a.replace(/[\t\r\n ]{2,}|[\t\r\n]/g, " "));
							a = new CKEDITOR.htmlParser.text(a);
							if (o(p, a)) this.onTagOpen(j, {}, 0, 1);
							p.add(a)
						}
					};
					l.onCDATA = function(a) {
						p.add(new CKEDITOR.htmlParser.cdata(a))
					};
					l.onComment = function(a) {
						i();
						g();
						p.add(new CKEDITOR.htmlParser.comment(a))
					};
					l.parse(c);
					for (i(); p != m;) n(p, p.parent, 1);
					k(m);
					return m
				};
			CKEDITOR.htmlParser.fragment.prototype = {
				type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
				add: function(a, b) {
					isNaN(b) && (b = this.children.length);
					var d = b > 0 ? this.children[b - 1] : null;
					if (d) {
						if (a._.isBlockLike && d.type == CKEDITOR.NODE_TEXT) {
							d.value = CKEDITOR.tools.rtrim(d.value);
							if (d.value.length ===
								0) {
								this.children.pop();
								this.add(a);
								return
							}
						}
						d.next = a
					}
					a.previous = d;
					a.parent = this;
					this.children.splice(b, 0, a);
					if (!this._.hasInlineStarted) this._.hasInlineStarted = a.type == CKEDITOR.NODE_TEXT || a.type == CKEDITOR.NODE_ELEMENT && !a._.isBlockLike
				},
				filter: function(a, b) {
					b = this.getFilterContext(b);
					a.onRoot(b, this);
					this.filterChildren(a, false, b)
				},
				filterChildren: function(a, b, d) {
					if (this.childrenFilteredBy != a.id) {
						d = this.getFilterContext(d);
						if (b && !this.parent) a.onRoot(d, this);
						this.childrenFilteredBy = a.id;
						for (b = 0; b < this.children.length; b++) this.children[b].filter(a,
							d) === false && b--
					}
				},
				writeHtml: function(a, b) {
					b && this.filter(b);
					this.writeChildrenHtml(a)
				},
				writeChildrenHtml: function(a, b, d) {
					var f = this.getFilterContext();
					if (d && !this.parent && b) b.onRoot(f, this);
					b && this.filterChildren(b, false, f);
					b = 0;
					d = this.children;
					for (f = d.length; b < f; b++) d[b].writeHtml(a)
				},
				forEach: function(a, b, d) {
					if (!d && (!b || this.type == b)) var f = a(this);
					if (f !== false)
						for (var d = this.children, e = 0; e < d.length; e++) {
							f = d[e];
							f.type == CKEDITOR.NODE_ELEMENT ? f.forEach(a, b) : (!b || f.type == b) && a(f)
						}
				},
				getFilterContext: function(a) {
					return a || {}
				}
			}
		}(), "use strict",
		function() {
			function a() {
				this.rules = []
			}

			function e(b, d, f, c) {
				var e, j;
				for (e in d) {
					(j = b[e]) || (j = b[e] = new a);
					j.add(d[e], f, c)
				}
			}
			CKEDITOR.htmlParser.filter = CKEDITOR.tools.createClass({
				$: function(b) {
					this.id = CKEDITOR.tools.getNextNumber();
					this.elementNameRules = new a;
					this.attributeNameRules = new a;
					this.elementsRules = {};
					this.attributesRules = {};
					this.textRules = new a;
					this.commentRules = new a;
					this.rootRules = new a;
					b && this.addRules(b, 10)
				},
				proto: {
					addRules: function(a, d) {
						var f;
						if (typeof d == "number") f =
							d;
						else if (d && "priority" in d) f = d.priority;
						typeof f != "number" && (f = 10);
						typeof d != "object" && (d = {});
						a.elementNames && this.elementNameRules.addMany(a.elementNames, f, d);
						a.attributeNames && this.attributeNameRules.addMany(a.attributeNames, f, d);
						a.elements && e(this.elementsRules, a.elements, f, d);
						a.attributes && e(this.attributesRules, a.attributes, f, d);
						a.text && this.textRules.add(a.text, f, d);
						a.comment && this.commentRules.add(a.comment, f, d);
						a.root && this.rootRules.add(a.root, f, d)
					},
					applyTo: function(a) {
						a.filter(this)
					},
					onElementName: function(a,
						d) {
						return this.elementNameRules.execOnName(a, d)
					},
					onAttributeName: function(a, d) {
						return this.attributeNameRules.execOnName(a, d)
					},
					onText: function(a, d, f) {
						return this.textRules.exec(a, d, f)
					},
					onComment: function(a, d, f) {
						return this.commentRules.exec(a, d, f)
					},
					onRoot: function(a, d) {
						return this.rootRules.exec(a, d)
					},
					onElement: function(a, d) {
						for (var f = [this.elementsRules["^"], this.elementsRules[d.name], this.elementsRules.$], c, e = 0; e < 3; e++)
							if (c = f[e]) {
								c = c.exec(a, d, this);
								if (c === false) return null;
								if (c && c != d) return this.onNode(a,
									c);
								if (d.parent && !d.name) break
							}
						return d
					},
					onNode: function(a, d) {
						var f = d.type;
						return f == CKEDITOR.NODE_ELEMENT ? this.onElement(a, d) : f == CKEDITOR.NODE_TEXT ? new CKEDITOR.htmlParser.text(this.onText(a, d.value)) : f == CKEDITOR.NODE_COMMENT ? new CKEDITOR.htmlParser.comment(this.onComment(a, d.value)) : null
					},
					onAttribute: function(a, d, f, c) {
						return (f = this.attributesRules[f]) ? f.exec(a, c, d, this) : c
					}
				}
			});
			CKEDITOR.htmlParser.filterRulesGroup = a;
			a.prototype = {
				add: function(a, d, f) {
					this.rules.splice(this.findIndex(d), 0, {
						value: a,
						priority: d,
						options: f
					})
				},
				addMany: function(a, d, f) {
					for (var c = [this.findIndex(d), 0], e = 0, j = a.length; e < j; e++) c.push({
						value: a[e],
						priority: d,
						options: f
					});
					this.rules.splice.apply(this.rules, c)
				},
				findIndex: function(a) {
					for (var d = this.rules, f = d.length - 1; f >= 0 && a < d[f].priority;) f--;
					return f + 1
				},
				exec: function(a, d) {
					var f = d instanceof CKEDITOR.htmlParser.node || d instanceof CKEDITOR.htmlParser.fragment,
						c = Array.prototype.slice.call(arguments, 1),
						e = this.rules,
						j = e.length,
						g, i, k, n;
					for (n = 0; n < j; n++) {
						if (f) {
							g = d.type;
							i = d.name
						}
						k = e[n];
						if (!(a.nonEditable &&
							!k.options.applyToAll || a.nestedEditable && k.options.excludeNestedEditable)) {
							k = k.value.apply(null, c);
							if (k === false || f && k && (k.name != i || k.type != g)) return k;
							k != void 0 && (c[0] = d = k)
						}
					}
					return d
				},
				execOnName: function(a, d) {
					for (var f = 0, c = this.rules, e = c.length, j; d && f < e; f++) {
						j = c[f];
						!(a.nonEditable && !j.options.applyToAll || a.nestedEditable && j.options.excludeNestedEditable) && (d = d.replace(j.value[0], j.value[1]))
					}
					return d
				}
			}
		}(),
		function() {
			function a(a, e) {
				function g(a) {
					return a || CKEDITOR.env.needsNbspFiller ? new CKEDITOR.htmlParser.text(" ") :
						new CKEDITOR.htmlParser.element("br", {
							"data-cke-bogus": 1
						})
				}

				function i(a, f) {
					return function(e) {
						if (e.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
							var h = [],
								i = b(e),
								y, p;
							if (i)
								for (j(i, 1) && h.push(i); i;) {
									if (c(i) && (y = d(i)) && j(y))
										if ((p = d(y)) && !c(p)) h.push(y);
										else {
											g(l).insertAfter(y);
											y.remove()
										}
									i = i.previous
								}
							for (i = 0; i < h.length; i++) h[i].remove();
							if (h = typeof f == "function" ? f(e) !== false : f)
								if (!l && !CKEDITOR.env.needsBrFiller && e.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT) h = false;
								else if (!l && !CKEDITOR.env.needsBrFiller && (document.documentMode >
								7 || e.name in CKEDITOR.dtd.tr || e.name in CKEDITOR.dtd.$listItem)) h = false;
							else {
								h = b(e);
								h = !h || e.name == "form" && h.name == "input"
							}
							h && e.add(g(a))
						}
					}
				}

				function j(a, b) {
					if ((!l || CKEDITOR.env.needsBrFiller) && a.type == CKEDITOR.NODE_ELEMENT && a.name == "br" && !a.attributes["data-cke-eol"]) return true;
					var d;
					if (a.type == CKEDITOR.NODE_TEXT && (d = a.value.match(s))) {
						if (d.index) {
							(new CKEDITOR.htmlParser.text(a.value.substring(0, d.index))).insertBefore(a);
							a.value = d[0]
						}
						if (!CKEDITOR.env.needsBrFiller && l && (!b || a.parent.name in k)) return true;
						if (!l)
							if ((d = a.previous) && d.name == "br" || !d || c(d)) return true
					}
					return false
				}
				var y = {
						elements: {}
					},
					l = e == "html",
					k = CKEDITOR.tools.extend({}, q),
					E;
				for (E in k) "#" in p[E] || delete k[E];
				for (E in k) y.elements[E] = i(l, a.config.fillEmptyBlocks !== false);
				y.root = i(l);
				y.elements.br = function(a) {
					return function(b) {
						if (b.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
							var e = b.attributes;
							if ("data-cke-bogus" in e || "data-cke-eol" in e) delete e["data-cke-bogus"];
							else {
								for (e = b.next; e && f(e);) e = e.next;
								var i = d(b);
								!e && c(b.parent) ? h(b.parent,
									g(a)) : c(e) && (i && !c(i)) && g(a).insertBefore(e)
							}
						}
					}
				}(l);
				return y
			}

			function e(a, b) {
				return a != CKEDITOR.ENTER_BR && b !== false ? a == CKEDITOR.ENTER_DIV ? "div" : "p" : false
			}

			function b(a) {
				for (a = a.children[a.children.length - 1]; a && f(a);) a = a.previous;
				return a
			}

			function d(a) {
				for (a = a.previous; a && f(a);) a = a.previous;
				return a
			}

			function f(a) {
				return a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(a.value) || a.type == CKEDITOR.NODE_ELEMENT && a.attributes["data-cke-bookmark"]
			}

			function c(a) {
				return a && (a.type == CKEDITOR.NODE_ELEMENT && a.name in
					q || a.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)
			}

			function h(a, b) {
				var c = a.children[a.children.length - 1];
				a.children.push(b);
				b.parent = a;
				if (c) {
					c.next = b;
					b.previous = c
				}
			}

			function j(a) {
				a = a.attributes;
				a.contenteditable != "false" && (a["data-cke-editable"] = a.contenteditable ? "true" : 1);
				a.contenteditable = "false"
			}

			function g(a) {
				a = a.attributes;
				switch (a["data-cke-editable"]) {
					case "true":
						a.contenteditable = "true";
						break;
					case "1":
						delete a.contenteditable
				}
			}

			function i(a) {
				return a.replace(w, function(a, b, c) {
					return "<" + b + c.replace(D,
						function(a, b) {
							return A.test(b) && c.indexOf("data-cke-saved-" + b) == -1 ? " data-cke-saved-" + a + " data-cke-" + CKEDITOR.rnd + "-" + a : a
						}) + ">"
				})
			}

			function k(a, b) {
				return a.replace(b, function(a, b, c) {
					a.indexOf("<textarea") === 0 && (a = b + r(c).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</textarea>");
					return "<cke:encoded>" + encodeURIComponent(a) + "</cke:encoded>"
				})
			}

			function n(a) {
				return a.replace(C, function(a, b) {
					return decodeURIComponent(b)
				})
			}

			function o(a) {
				return a.replace(/<\!--(?!{cke_protected})[\s\S]+?--\>/g, function(a) {
					return "<\!--" +
						t + "{C}" + encodeURIComponent(a).replace(/--/g, "%2D%2D") + "--\>"
				})
			}

			function r(a) {
				return a.replace(/<\!--\{cke_protected\}\{C\}([\s\S]+?)--\>/g, function(a, b) {
					return decodeURIComponent(b)
				})
			}

			function l(a, b) {
				var c = b._.dataStore;
				return a.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g, function(a, b) {
					return decodeURIComponent(b)
				}).replace(/\{cke_protected_(\d+)\}/g, function(a, b) {
					return c && c[b] || ""
				})
			}

			function m(a, b) {
				for (var c = [], d = b.config.protectedSource, f = b._.dataStore || (b._.dataStore = {
						id: 1
					}), e = /<\!--\{cke_temp(comment)?\}(\d*?)--\>/g,
					d = [/<script[\s\S]*?<\/script>/gi, /<noscript[\s\S]*?<\/noscript>/gi].concat(d), a = a.replace(/<\!--[\s\S]*?--\>/g, function(a) {
						return "<\!--{cke_tempcomment}" + (c.push(a) - 1) + "--\>"
					}), g = 0; g < d.length; g++) a = a.replace(d[g], function(a) {
					a = a.replace(e, function(a, b, d) {
						return c[d]
					});
					return /cke_temp(comment)?/.test(a) ? a : "<\!--{cke_temp}" + (c.push(a) - 1) + "--\>"
				});
				a = a.replace(e, function(a, b, d) {
					return "<\!--" + t + (b ? "{C}" : "") + encodeURIComponent(c[d]).replace(/--/g, "%2D%2D") + "--\>"
				});
				a = a.replace(/<\w+(?:\s+(?:(?:[^\s=>]+\s*=\s*(?:[^'"\s>]+|'[^']*'|"[^"]*"))|[^\s=>]+))+\s*>/g,
					function(a) {
						return a.replace(/<\!--\{cke_protected\}([^>]*)--\>/g, function(a, b) {
							f[f.id] = decodeURIComponent(b);
							return "{cke_protected_" + f.id+++"}"
						})
					});
				return a = a.replace(/<(title|iframe|textarea)([^>]*)>([\s\S]*?)<\/\1>/g, function(a, c, d, f) {
					return "<" + c + d + ">" + l(r(f), b) + "</" + c + ">"
				})
			}
			CKEDITOR.htmlDataProcessor = function(b) {
				var c, d, f = this;
				this.editor = b;
				this.dataFilter = c = new CKEDITOR.htmlParser.filter;
				this.htmlFilter = d = new CKEDITOR.htmlParser.filter;
				this.writer = new CKEDITOR.htmlParser.basicWriter;
				c.addRules(u);
				c.addRules(B, {
					applyToAll: true
				});
				c.addRules(a(b, "data"), {
					applyToAll: true
				});
				d.addRules(v);
				d.addRules(z, {
					applyToAll: true
				});
				d.addRules(a(b, "html"), {
					applyToAll: true
				});
				b.on("toHtml", function(a) {
					var a = a.data,
						c = a.dataValue,
						c = m(c, b),
						c = k(c, K),
						c = i(c),
						c = k(c, I),
						c = c.replace(y, "$1cke:$2"),
						c = c.replace(H, "<cke:$1$2></cke:$1>"),
						c = c.replace(/(<pre\b[^>]*>)(\r\n|\n)/g, "$1$2$2"),
						c = c.replace(/([^a-z0-9<\-])(on\w{3,})(?!>)/gi, "$1data-cke-" + CKEDITOR.rnd + "-$2"),
						d = a.context || b.editable().getName(),
						f;
					if (CKEDITOR.env.ie && CKEDITOR.env.version <
						9 && d == "pre") {
						d = "div";
						c = "<pre>" + c + "</pre>";
						f = 1
					}
					d = b.document.createElement(d);
					d.setHtml("a" + c);
					c = d.getHtml().substr(1);
					c = c.replace(RegExp("data-cke-" + CKEDITOR.rnd + "-", "ig"), "");
					f && (c = c.replace(/^<pre>|<\/pre>$/gi, ""));
					c = c.replace(E, "$1$2");
					c = n(c);
					c = r(c);
					a.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(c, a.context, a.fixForBody === false ? false : e(a.enterMode, b.config.autoParagraph))
				}, null, null, 5);
				b.on("toHtml", function(a) {
					a.data.filter.applyTo(a.data.dataValue, true, a.data.dontFilter, a.data.enterMode) &&
						b.fire("dataFiltered")
				}, null, null, 6);
				b.on("toHtml", function(a) {
					a.data.dataValue.filterChildren(f.dataFilter, true)
				}, null, null, 10);
				b.on("toHtml", function(a) {
					var a = a.data,
						b = a.dataValue,
						c = new CKEDITOR.htmlParser.basicWriter;
					b.writeChildrenHtml(c);
					b = c.getHtml(true);
					a.dataValue = o(b)
				}, null, null, 15);
				b.on("toDataFormat", function(a) {
					var c = a.data.dataValue;
					a.data.enterMode != CKEDITOR.ENTER_BR && (c = c.replace(/^<br *\/?>/i, ""));
					a.data.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(c, a.data.context, e(a.data.enterMode,
						b.config.autoParagraph))
				}, null, null, 5);
				b.on("toDataFormat", function(a) {
					a.data.dataValue.filterChildren(f.htmlFilter, true)
				}, null, null, 10);
				b.on("toDataFormat", function(a) {
					a.data.filter.applyTo(a.data.dataValue, false, true)
				}, null, null, 11);
				b.on("toDataFormat", function(a) {
					var c = a.data.dataValue,
						d = f.writer;
					d.reset();
					c.writeChildrenHtml(d);
					c = d.getHtml(true);
					c = r(c);
					c = l(c, b);
					a.data.dataValue = c
				}, null, null, 15)
			};
			CKEDITOR.htmlDataProcessor.prototype = {
				toHtml: function(a, b, c, d) {
					var f = this.editor,
						e, g, h;
					if (b && typeof b ==
						"object") {
						e = b.context;
						c = b.fixForBody;
						d = b.dontFilter;
						g = b.filter;
						h = b.enterMode
					} else e = b;
					!e && e !== null && (e = f.editable().getName());
					return f.fire("toHtml", {
						dataValue: a,
						context: e,
						fixForBody: c,
						dontFilter: d,
						filter: g || f.filter,
						enterMode: h || f.enterMode
					}).dataValue
				},
				toDataFormat: function(a, b) {
					var c, d, f;
					if (b) {
						c = b.context;
						d = b.filter;
						f = b.enterMode
					}!c && c !== null && (c = this.editor.editable().getName());
					return this.editor.fire("toDataFormat", {
						dataValue: a,
						filter: d || this.editor.filter,
						context: c,
						enterMode: f || this.editor.enterMode
					}).dataValue
				}
			};
			var s = /(?:&nbsp;|\xa0)$/,
				t = "{cke_protected}",
				p = CKEDITOR.dtd,
				x = ["caption", "colgroup", "col", "thead", "tfoot", "tbody"],
				q = CKEDITOR.tools.extend({}, p.$blockLimit, p.$block),
				u = {
					elements: {
						input: j,
						textarea: j
					}
				},
				B = {
					attributeNames: [
						[/^on/, "data-cke-pa-on"],
						[/^data-cke-expando$/, ""]
					]
				},
				v = {
					elements: {
						embed: function(a) {
							var b = a.parent;
							if (b && b.name == "object") {
								var c = b.attributes.width,
									b = b.attributes.height;
								if (c) a.attributes.width = c;
								if (b) a.attributes.height = b
							}
						},
						a: function(a) {
							if (!a.children.length && !a.attributes.name &&
								!a.attributes["data-cke-saved-name"]) return false
						}
					}
				},
				z = {
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
								if (b["data-cke-temp"]) return false;
								for (var c = ["name", "href", "src"], d, f = 0; f < c.length; f++) {
									d = "data-cke-saved-" + c[f];
									d in b && delete b[c[f]]
								}
							}
							return a
						},
						table: function(a) {
							a.children.slice(0).sort(function(a, b) {
								var c, d;
								if (a.type == CKEDITOR.NODE_ELEMENT && b.type == a.type) {
									c =
										CKEDITOR.tools.indexOf(x, a.name);
									d = CKEDITOR.tools.indexOf(x, b.name)
								}
								if (!(c > -1 && d > -1 && c != d)) {
									c = a.parent ? a.getIndex() : -1;
									d = b.parent ? b.getIndex() : -1
								}
								return c > d ? 1 : -1
							})
						},
						param: function(a) {
							a.children = [];
							a.isEmpty = true;
							return a
						},
						span: function(a) {
							a.attributes["class"] == "Apple-style-span" && delete a.name
						},
						html: function(a) {
							delete a.attributes.contenteditable;
							delete a.attributes["class"]
						},
						body: function(a) {
							delete a.attributes.spellcheck;
							delete a.attributes.contenteditable
						},
						style: function(a) {
							var b = a.children[0];
							if (b && b.value) b.value = CKEDITOR.tools.trim(b.value);
							if (!a.attributes.type) a.attributes.type = "text/css"
						},
						title: function(a) {
							var b = a.children[0];
							!b && h(a, b = new CKEDITOR.htmlParser.text);
							b.value = a.attributes["data-cke-title"] || ""
						},
						input: g,
						textarea: g
					},
					attributes: {
						"class": function(a) {
							return CKEDITOR.tools.ltrim(a.replace(/(?:^|\s+)cke_[^\s]*/g, "")) || false
						}
					}
				};
			if (CKEDITOR.env.ie) z.attributes.style = function(a) {
				return a.replace(/(^|;)([^\:]+)/g, function(a) {
					return a.toLowerCase()
				})
			};
			var w = /<(a|area|img|input|source)\b([^>]*)>/gi,
				D = /([\w-]+)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi,
				A = /^(href|src|name)$/i,
				I = /(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi,
				K = /(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi,
				C = /<cke:encoded>([^<]*)<\/cke:encoded>/gi,
				y = /(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi,
				E = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi,
				H = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi
		}(), "use strict", CKEDITOR.htmlParser.element = function(a, e) {
			this.name = a;
			this.attributes =
				e || {};
			this.children = [];
			var b = a || "",
				d = b.match(/^cke:(.*)/);
			d && (b = d[1]);
			b = !(!CKEDITOR.dtd.$nonBodyContent[b] && !CKEDITOR.dtd.$block[b] && !CKEDITOR.dtd.$listItem[b] && !CKEDITOR.dtd.$tableContent[b] && !(CKEDITOR.dtd.$nonEditable[b] || b == "br"));
			this.isEmpty = !!CKEDITOR.dtd.$empty[a];
			this.isUnknown = !CKEDITOR.dtd[a];
			this._ = {
				isBlockLike: b,
				hasInlineStarted: this.isEmpty || !b
			}
		}, CKEDITOR.htmlParser.cssStyle = function(a) {
			var e = {};
			((a instanceof CKEDITOR.htmlParser.element ? a.attributes.style : a) || "").replace(/&quot;/g,
				'"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(a, d, f) {
				d == "font-family" && (f = f.replace(/["']/g, ""));
				e[d.toLowerCase()] = f
			});
			return {
				rules: e,
				populate: function(a) {
					var d = this.toString();
					if (d) a instanceof CKEDITOR.dom.element ? a.setAttribute("style", d) : a instanceof CKEDITOR.htmlParser.element ? a.attributes.style = d : a.style = d
				},
				toString: function() {
					var a = [],
						d;
					for (d in e) e[d] && a.push(d, ":", e[d], ";");
					return a.join("")
				}
			}
		},
		function() {
			function a(a) {
				return function(b) {
					return b.type == CKEDITOR.NODE_ELEMENT &&
						(typeof a == "string" ? b.name == a : b.name in a)
				}
			}
			var e = function(a, b) {
					a = a[0];
					b = b[0];
					return a < b ? -1 : a > b ? 1 : 0
				},
				b = CKEDITOR.htmlParser.fragment.prototype;
			CKEDITOR.htmlParser.element.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
				type: CKEDITOR.NODE_ELEMENT,
				add: b.add,
				clone: function() {
					return new CKEDITOR.htmlParser.element(this.name, this.attributes)
				},
				filter: function(a, b) {
					var c = this,
						e, j, b = c.getFilterContext(b);
					if (b.off) return true;
					if (!c.parent) a.onRoot(b, c);
					for (;;) {
						e = c.name;
						if (!(j = a.onElementName(b,
							e))) {
							this.remove();
							return false
						}
						c.name = j;
						if (!(c = a.onElement(b, c))) {
							this.remove();
							return false
						}
						if (c !== this) {
							this.replaceWith(c);
							return false
						}
						if (c.name == e) break;
						if (c.type != CKEDITOR.NODE_ELEMENT) {
							this.replaceWith(c);
							return false
						}
						if (!c.name) {
							this.replaceWithChildren();
							return false
						}
					}
					e = c.attributes;
					var g, i;
					for (g in e) {
						i = g;
						for (j = e[g];;)
							if (i = a.onAttributeName(b, g))
								if (i != g) {
									delete e[g];
									g = i
								} else break;
						else {
							delete e[g];
							break
						}
						i && ((j = a.onAttribute(b, c, i, j)) === false ? delete e[i] : e[i] = j)
					}
					c.isEmpty || this.filterChildren(a,
						false, b);
					return true
				},
				filterChildren: b.filterChildren,
				writeHtml: function(a, b) {
					b && this.filter(b);
					var c = this.name,
						h = [],
						j = this.attributes,
						g, i;
					a.openTag(c, j);
					for (g in j) h.push([g, j[g]]);
					a.sortAttributes && h.sort(e);
					g = 0;
					for (i = h.length; g < i; g++) {
						j = h[g];
						a.attribute(j[0], j[1])
					}
					a.openTagClose(c, this.isEmpty);
					this.writeChildrenHtml(a);
					this.isEmpty || a.closeTag(c)
				},
				writeChildrenHtml: b.writeChildrenHtml,
				replaceWithChildren: function() {
					for (var a = this.children, b = a.length; b;) a[--b].insertAfter(this);
					this.remove()
				},
				forEach: b.forEach,
				getFirst: function(b) {
					if (!b) return this.children.length ? this.children[0] : null;
					typeof b != "function" && (b = a(b));
					for (var f = 0, c = this.children.length; f < c; ++f)
						if (b(this.children[f])) return this.children[f];
					return null
				},
				getHtml: function() {
					var a = new CKEDITOR.htmlParser.basicWriter;
					this.writeChildrenHtml(a);
					return a.getHtml()
				},
				setHtml: function(a) {
					for (var a = this.children = CKEDITOR.htmlParser.fragment.fromHtml(a).children, b = 0, c = a.length; b < c; ++b) a[b].parent = this
				},
				getOuterHtml: function() {
					var a =
						new CKEDITOR.htmlParser.basicWriter;
					this.writeHtml(a);
					return a.getHtml()
				},
				split: function(a) {
					for (var b = this.children.splice(a, this.children.length - a), c = this.clone(), e = 0; e < b.length; ++e) b[e].parent = c;
					c.children = b;
					if (b[0]) b[0].previous = null;
					if (a > 0) this.children[a - 1].next = null;
					this.parent.add(c, this.getIndex() + 1);
					return c
				},
				addClass: function(a) {
					if (!this.hasClass(a)) {
						var b = this.attributes["class"] || "";
						this.attributes["class"] = b + (b ? " " : "") + a
					}
				},
				removeClass: function(a) {
					var b = this.attributes["class"];
					if (b)(b =
						CKEDITOR.tools.trim(b.replace(RegExp("(?:\\s+|^)" + a + "(?:\\s+|$)"), " "))) ? this.attributes["class"] = b : delete this.attributes["class"]
				},
				hasClass: function(a) {
					var b = this.attributes["class"];
					return !b ? false : RegExp("(?:^|\\s)" + a + "(?=\\s|$)").test(b)
				},
				getFilterContext: function(a) {
					var b = [];
					a || (a = {
						off: false,
						nonEditable: false,
						nestedEditable: false
					});
					!a.off && this.attributes["data-cke-processor"] == "off" && b.push("off", true);
					!a.nonEditable && this.attributes.contenteditable == "false" ? b.push("nonEditable", true) : a.nonEditable &&
						(!a.nestedEditable && this.attributes.contenteditable == "true") && b.push("nestedEditable", true);
					if (b.length)
						for (var a = CKEDITOR.tools.copy(a), c = 0; c < b.length; c = c + 2) a[b[c]] = b[c + 1];
					return a
				}
			}, true)
		}(),
		function() {
			var a = {},
				e = /{([^}]+)}/g,
				b = /([\\'])/g,
				d = /\n/g,
				f = /\r/g;
			CKEDITOR.template = function(c) {
				if (a[c]) this.output = a[c];
				else {
					var h = c.replace(b, "\\$1").replace(d, "\\n").replace(f, "\\r").replace(e, function(a, b) {
						return "',data['" + b + "']==undefined?'{" + b + "}':data['" + b + "'],'"
					});
					this.output = a[c] = Function("data", "buffer",
						"return buffer?buffer.push('" + h + "'):['" + h + "'].join('');")
				}
			}
		}(), delete CKEDITOR.loadFullCore, CKEDITOR.instances = {}, CKEDITOR.document = new CKEDITOR.dom.document(document), CKEDITOR.add = function(a) {
			CKEDITOR.instances[a.name] = a;
			a.on("focus", function() {
				if (CKEDITOR.currentInstance != a) {
					CKEDITOR.currentInstance = a;
					CKEDITOR.fire("currentInstance")
				}
			});
			a.on("blur", function() {
				if (CKEDITOR.currentInstance == a) {
					CKEDITOR.currentInstance = null;
					CKEDITOR.fire("currentInstance")
				}
			});
			CKEDITOR.fire("instance", null, a)
		}, CKEDITOR.remove =
		function(a) {
			delete CKEDITOR.instances[a.name]
		},
		function() {
			var a = {};
			CKEDITOR.addTemplate = function(e, b) {
				var d = a[e];
				if (d) return d;
				d = {
					name: e,
					source: b
				};
				CKEDITOR.fire("template", d);
				return a[e] = new CKEDITOR.template(d.source)
			};
			CKEDITOR.getTemplate = function(e) {
				return a[e]
			}
		}(),
		function() {
			var a = [];
			CKEDITOR.addCss = function(e) {
				a.push(e)
			};
			CKEDITOR.getCss = function() {
				return a.join("\n")
			}
		}(), CKEDITOR.on("instanceDestroyed", function() {
			CKEDITOR.tools.isEmpty(this.instances) && CKEDITOR.fire("reset")
		}), CKEDITOR.TRISTATE_ON =
		1, CKEDITOR.TRISTATE_OFF = 2, CKEDITOR.TRISTATE_DISABLED = 0,
		function() {
			CKEDITOR.inline = function(a, e) {
				if (!CKEDITOR.env.isCompatible) return null;
				a = CKEDITOR.dom.element.get(a);
				if (a.getEditor()) throw 'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
				var b = new CKEDITOR.editor(e, a, CKEDITOR.ELEMENT_MODE_INLINE),
					d = a.is("textarea") ? a : null;
				if (d) {
					b.setData(d.getValue(), null, true);
					a = CKEDITOR.dom.element.createFromHtml('<div contenteditable="' + !!b.readOnly + '" class="cke_textarea_inline">' +
						d.getValue() + "</div>", CKEDITOR.document);
					a.insertAfter(d);
					d.hide();
					d.$.form && b._attachToForm()
				} else b.setData(a.getHtml(), null, true);
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
					CKEDITOR.fire("instanceReady", null, b)
				}, null, null, 1E4);
				b.on("destroy", function() {
					if (d) {
						b.container.clearCustomData();
						b.container.remove();
						d.show()
					}
					b.element.clearCustomData();
					delete b.element
				});
				return b
			};
			CKEDITOR.inlineAll = function() {
				var a, e, b;
				for (b in CKEDITOR.dtd.$editable)
					for (var d = CKEDITOR.document.getElementsByTag(b), f = 0, c = d.count(); f < c; f++) {
						a = d.getItem(f);
						if (a.getAttribute("contenteditable") == "true") {
							e = {
								element: a,
								config: {}
							};
							CKEDITOR.fire("inline", e) !== false && CKEDITOR.inline(a, e.config)
						}
					}
			};
			CKEDITOR.domReady(function() {
				!CKEDITOR.disableAutoInline && CKEDITOR.inlineAll()
			})
		}(), CKEDITOR.replaceClass = "ckeditor",
		function() {
			function a(a, c, d, j) {
				if (!CKEDITOR.env.isCompatible) return null;
				a = CKEDITOR.dom.element.get(a);
				if (a.getEditor()) throw 'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
				var g = new CKEDITOR.editor(c, a, j);
				if (j == CKEDITOR.ELEMENT_MODE_REPLACE) {
					a.setStyle("visibility", "hidden");
					g._.required = a.hasAttribute("required");
					a.removeAttribute("required")
				}
				d && g.setData(d, null, true);
				g.on("loaded", function() {
					b(g);
					j == CKEDITOR.ELEMENT_MODE_REPLACE && (g.config.autoUpdateElement && a.$.form) && g._attachToForm();
					g.setMode(g.config.startupMode, function() {
						g.resetDirty();
						g.status = "ready";
						g.fireOnce("instanceReady");
						CKEDITOR.fire("instanceReady", null, g)
					})
				});
				g.on("destroy", e);
				return g
			}

			function e() {
				var a = this.container,
					b = this.element;
				if (a) {
					a.clearCustomData();
					a.remove()
				}
				if (b) {
					b.clearCustomData();
					if (this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE) {
						b.show();
						this._.required && b.setAttribute("required", "required")
					}
					delete this.element
				}
			}

			function b(a) {
				var b = a.name,
					e = a.element,
					j = a.elementMode,
					g = a.fire("uiSpace", {
						space: "top",
						html: ""
					}).html,
					i = a.fire("uiSpace", {
						space: "bottom",
						html: ""
					}).html;
				d || (d = CKEDITOR.addTemplate("maincontainer", '<{outerEl} id="cke_{name}" class="{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' + CKEDITOR.env.cssClass + '"  dir="{langDir}" lang="{langCode}" role="application" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><{outerEl} class="cke_inner cke_reset" role="presentation">{topHtml}<{outerEl} id="{contentId}" class="cke_contents cke_reset" role="presentation"></{outerEl}>{bottomHtml}</{outerEl}></{outerEl}>'));
				b = CKEDITOR.dom.element.createFromHtml(d.output({
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
					b.insertAfter(e)
				} else e.append(b);
				a.container = b;
				g && a.ui.space("top").unselectable();
				i && a.ui.space("bottom").unselectable();
				e = a.config.width;
				j = a.config.height;
				e && b.setStyle("width", CKEDITOR.tools.cssLength(e));
				j && a.ui.space("contents").setStyle("height", CKEDITOR.tools.cssLength(j));
				b.disableContextMenu();
				CKEDITOR.env.webkit && b.on("focus", function() {
					a.focus()
				});
				a.fireOnce("uiReady")
			}
			CKEDITOR.replace = function(b, c) {
				return a(b, c, null, CKEDITOR.ELEMENT_MODE_REPLACE)
			};
			CKEDITOR.appendTo = function(b, c, d) {
				return a(b,
					c, d, CKEDITOR.ELEMENT_MODE_APPENDTO)
			};
			CKEDITOR.replaceAll = function() {
				for (var a = document.getElementsByTagName("textarea"), b = 0; b < a.length; b++) {
					var d = null,
						e = a[b];
					if (e.name || e.id) {
						if (typeof arguments[0] == "string") {
							if (!RegExp("(?:^|\\s)" + arguments[0] + "(?:$|\\s)").test(e.className)) continue
						} else if (typeof arguments[0] == "function") {
							d = {};
							if (arguments[0](e, d) === false) continue
						}
						this.replace(e, d)
					}
				}
			};
			CKEDITOR.editor.prototype.addMode = function(a, b) {
				(this._.modes || (this._.modes = {}))[a] = b
			};
			CKEDITOR.editor.prototype.setMode =
				function(a, b) {
					var d = this,
						e = this._.modes;
					if (!(a == d.mode || !e || !e[a])) {
						d.fire("beforeSetMode", a);
						if (d.mode) {
							var g = d.checkDirty(),
								e = d._.previousModeData,
								i, k = 0;
							d.fire("beforeModeUnload");
							d.editable(0);
							d._.previousMode = d.mode;
							d._.previousModeData = i = d.getData(1);
							if (d.mode == "source" && e == i) {
								d.fire("lockSnapshot", {
									forceUpdate: true
								});
								k = 1
							}
							d.ui.space("contents").setHtml("");
							d.mode = ""
						} else d._.previousModeData = d.getData(1);
						this._.modes[a](function() {
							d.mode = a;
							g !== void 0 && !g && d.resetDirty();
							k ? d.fire("unlockSnapshot") :
								a == "wysiwyg" && d.fire("saveSnapshot");
							setTimeout(function() {
								d.fire("mode");
								b && b.call(d)
							}, 0)
						})
					}
				};
			CKEDITOR.editor.prototype.resize = function(a, b, d, e) {
				var g = this.container,
					i = this.ui.space("contents"),
					k = CKEDITOR.env.webkit && this.document && this.document.getWindow().$.frameElement,
					e = e ? g.getChild(1) : g;
				e.setSize("width", a, true);
				k && (k.style.width = "1%");
				i.setStyle("height", Math.max(b - (d ? 0 : (e.$.offsetHeight || 0) - (i.$.clientHeight || 0)), 0) + "px");
				k && (k.style.width = "100%");
				this.fire("resize")
			};
			CKEDITOR.editor.prototype.getResizable =
				function(a) {
					return a ? this.ui.space("contents") : this.container
				};
			var d;
			CKEDITOR.domReady(function() {
				CKEDITOR.replaceClass && CKEDITOR.replaceAll(CKEDITOR.replaceClass)
			})
		}(), CKEDITOR.config.startupMode = "wysiwyg",
		function() {
			function a(a) {
				var b = a.editor,
					c = a.data.path,
					f = c.blockLimit,
					g = a.data.selection,
					h = g.getRanges()[0],
					i;
				if (CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller)
					if (g = e(g, c)) {
						g.appendBogus();
						i = CKEDITOR.env.ie
					}
				if (b.config.autoParagraph !== false && b.activeEnterMode != CKEDITOR.ENTER_BR &&
					b.editable().equals(f) && !c.block && h.collapsed && !h.getCommonAncestor().isReadOnly()) {
					c = h.clone();
					c.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
					f = new CKEDITOR.dom.walker(c);
					f.guard = function(a) {
						return !d(a) || a.type == CKEDITOR.NODE_COMMENT || a.isReadOnly()
					};
					if (!f.checkForward() || c.checkStartOfBlock() && c.checkEndOfBlock()) {
						b = h.fixBlock(true, b.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p");
						if (!CKEDITOR.env.needsBrFiller)(b = b.getFirst(d)) && (b.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(b.getText()).match(/^(?:&nbsp;|\xa0)$/)) &&
							b.remove();
						i = 1;
						a.cancel()
					}
				}
				i && h.select()
			}

			function e(a, b) {
				if (a.isFake) return 0;
				var c = b.block || b.blockLimit,
					f = c && c.getLast(d);
				if (c && c.isBlockBoundary() && (!f || !(f.type == CKEDITOR.NODE_ELEMENT && f.isBlockBoundary())) && !c.is("pre") && !c.getBogus()) return c
			}

			function b(a) {
				var b = a.data.getTarget();
				if (b.is("input")) {
					b = b.getAttribute("type");
					(b == "submit" || b == "reset") && a.data.preventDefault()
				}
			}

			function d(a) {
				return k(a) && n(a)
			}

			function f(a, b) {
				return function(c) {
					var d = CKEDITOR.dom.element.get(c.data.$.toElement ||
						c.data.$.fromElement || c.data.$.relatedTarget);
					(!d || !b.equals(d) && !b.contains(d)) && a.call(this, c)
				}
			}

			function c(a) {
				var b, c = a.getRanges()[0],
					f = a.root,
					e = {
						table: 1,
						ul: 1,
						ol: 1,
						dl: 1
					};
				if (c.startPath().contains(e)) {
					var a = function(a) {
							return function(c, f) {
								f && (c.type == CKEDITOR.NODE_ELEMENT && c.is(e)) && (b = c);
								if (!f && d(c) && (!a || !g(c))) return false
							}
						},
						h = c.clone();
					h.collapse(1);
					h.setStartAt(f, CKEDITOR.POSITION_AFTER_START);
					f = new CKEDITOR.dom.walker(h);
					f.guard = a();
					f.checkBackward();
					if (b) {
						h = c.clone();
						h.collapse();
						h.setEndAt(b,
							CKEDITOR.POSITION_AFTER_END);
						f = new CKEDITOR.dom.walker(h);
						f.guard = a(true);
						b = false;
						f.checkForward();
						return b
					}
				}
				return null
			}

			function h(a) {
				a.editor.focus();
				a.editor.fire("saveSnapshot")
			}

			function j(a) {
				var b = a.editor;
				b.getSelection().scrollIntoView();
				setTimeout(function() {
					b.fire("saveSnapshot")
				}, 0)
			}
			CKEDITOR.editable = CKEDITOR.tools.createClass({
				base: CKEDITOR.dom.element,
				$: function(a, b) {
					this.base(b.$ || b);
					this.editor = a;
					this.status = "unloaded";
					this.hasFocus = false;
					this.setup()
				},
				proto: {
					focus: function() {
						var a;
						if (CKEDITOR.env.webkit && !this.hasFocus) {
							a = this.editor._.previousActive || this.getDocument().getActive();
							if (this.contains(a)) {
								a.focus();
								return
							}
						}
						try {
							this.$[CKEDITOR.env.ie && this.getDocument().equals(CKEDITOR.document) ? "setActive" : "focus"]()
						} catch (b) {
							if (!CKEDITOR.env.ie) throw b;
						}
						if (CKEDITOR.env.safari && !this.isInline()) {
							a = CKEDITOR.document.getActive();
							a.equals(this.getWindow().getFrame()) || this.getWindow().focus()
						}
					},
					on: function(a, b) {
						var c = Array.prototype.slice.call(arguments, 0);
						if (CKEDITOR.env.ie && /^focus|blur$/.exec(a)) {
							a =
								a == "focus" ? "focusin" : "focusout";
							b = f(b, this);
							c[0] = a;
							c[1] = b
						}
						return CKEDITOR.dom.element.prototype.on.apply(this, c)
					},
					attachListener: function(a, b, c, d, f, e) {
						!this._.listeners && (this._.listeners = []);
						var g = Array.prototype.slice.call(arguments, 1),
							g = a.on.apply(a, g);
						this._.listeners.push(g);
						return g
					},
					clearListeners: function() {
						var a = this._.listeners;
						try {
							for (; a.length;) a.pop().removeListener()
						} catch (b) {}
					},
					restoreAttrs: function() {
						var a = this._.attrChanges,
							b, c;
						for (c in a)
							if (a.hasOwnProperty(c)) {
								b = a[c];
								b !== null ? this.setAttribute(c,
									b) : this.removeAttribute(c)
							}
					},
					attachClass: function(a) {
						var b = this.getCustomData("classes");
						if (!this.hasClass(a)) {
							!b && (b = []);
							b.push(a);
							this.setCustomData("classes", b);
							this.addClass(a)
						}
					},
					changeAttr: function(a, b) {
						var c = this.getAttribute(a);
						if (b !== c) {
							!this._.attrChanges && (this._.attrChanges = {});
							a in this._.attrChanges || (this._.attrChanges[a] = c);
							this.setAttribute(a, b)
						}
					},
					insertHtml: function(a, b) {
						h(this);
						o(this, b || "html", a)
					},
					insertText: function(a) {
						h(this);
						var b = this.editor,
							c = b.getSelection().getStartElement().hasAscendant("pre",
								true) ? CKEDITOR.ENTER_BR : b.activeEnterMode,
							b = c == CKEDITOR.ENTER_BR,
							d = CKEDITOR.tools,
							a = d.htmlEncode(a.replace(/\r\n/g, "\n")),
							a = a.replace(/\t/g, "&nbsp;&nbsp; &nbsp;"),
							c = c == CKEDITOR.ENTER_P ? "p" : "div";
						if (!b) {
							var f = /\n{2}/g;
							if (f.test(a)) var e = "<" + c + ">",
								g = "</" + c + ">",
								a = e + a.replace(f, function() {
									return g + e
								}) + g
						}
						a = a.replace(/\n/g, "<br>");
						b || (a = a.replace(RegExp("<br>(?=</" + c + ">)"), function(a) {
							return d.repeat(a, 2)
						}));
						a = a.replace(/^ | $/g, "&nbsp;");
						a = a.replace(/(>|\s) /g, function(a, b) {
							return b + "&nbsp;"
						}).replace(/ (?=<)/g,
							"&nbsp;");
						o(this, "text", a)
					},
					insertElement: function(a, b) {
						b ? this.insertElementIntoRange(a, b) : this.insertElementIntoSelection(a)
					},
					insertElementIntoRange: function(a, b) {
						var c = this.editor,
							d = c.config.enterMode,
							f = a.getName(),
							e = CKEDITOR.dtd.$block[f];
						if (b.checkReadOnly()) return false;
						b.deleteContents(1);
						b.startContainer.type == CKEDITOR.NODE_ELEMENT && b.startContainer.is({
							tr: 1,
							table: 1,
							tbody: 1,
							thead: 1,
							tfoot: 1
						}) && r(b);
						var g, h;
						if (e)
							for (;
								(g = b.getCommonAncestor(0, 1)) && (h = CKEDITOR.dtd[g.getName()]) && (!h || !h[f]);)
								if (g.getName() in
									CKEDITOR.dtd.span) b.splitElement(g);
								else if (b.checkStartOfBlock() && b.checkEndOfBlock()) {
							b.setStartBefore(g);
							b.collapse(true);
							g.remove()
						} else b.splitBlock(d == CKEDITOR.ENTER_DIV ? "div" : "p", c.editable());
						b.insertNode(a);
						return true
					},
					insertElementIntoSelection: function(a) {
						h(this);
						var b = this.editor,
							c = b.activeEnterMode,
							b = b.getSelection(),
							f = b.getRanges()[0],
							e = a.getName(),
							e = CKEDITOR.dtd.$block[e];
						if (this.insertElementIntoRange(a, f)) {
							f.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
							if (e)
								if ((e = a.getNext(function(a) {
									return d(a) &&
										!g(a)
								})) && e.type == CKEDITOR.NODE_ELEMENT && e.is(CKEDITOR.dtd.$block)) e.getDtd()["#"] ? f.moveToElementEditStart(e) : f.moveToElementEditEnd(a);
								else if (!e && c != CKEDITOR.ENTER_BR) {
								e = f.fixBlock(true, c == CKEDITOR.ENTER_DIV ? "div" : "p");
								f.moveToElementEditStart(e)
							}
						}
						b.selectRanges([f]);
						j(this)
					},
					setData: function(a, b) {
						b || (a = this.editor.dataProcessor.toHtml(a));
						this.setHtml(a);
						if (this.status == "unloaded") this.status = "ready";
						this.editor.fire("dataReady")
					},
					getData: function(a) {
						var b = this.getHtml();
						a || (b = this.editor.dataProcessor.toDataFormat(b));
						return b
					},
					setReadOnly: function(a) {
						this.setAttribute("contenteditable", !a)
					},
					detach: function() {
						this.removeClass("cke_editable");
						this.status = "detached";
						var a = this.editor;
						this._.detach();
						delete a.document;
						delete a.window
					},
					isInline: function() {
						return this.getDocument().equals(CKEDITOR.document)
					},
					setup: function() {
						var a = this.editor;
						this.attachListener(a, "beforeGetData", function() {
							var b = this.getData();
							this.is("textarea") || a.config.ignoreEmptyParagraph !== false && (b = b.replace(i, function(a, b) {
								return b
							}));
							a.setData(b,
								null, 1)
						}, this);
						this.attachListener(a, "getSnapshot", function(a) {
							a.data = this.getData(1)
						}, this);
						this.attachListener(a, "afterSetData", function() {
							this.setData(a.getData(1))
						}, this);
						this.attachListener(a, "loadSnapshot", function(a) {
							this.setData(a.data, 1)
						}, this);
						this.attachListener(a, "beforeFocus", function() {
							var b = a.getSelection();
							(b = b && b.getNative()) && b.type == "Control" || this.focus()
						}, this);
						this.attachListener(a, "insertHtml", function(a) {
							this.insertHtml(a.data.dataValue, a.data.mode)
						}, this);
						this.attachListener(a,
							"insertElement", function(a) {
								this.insertElement(a.data)
							}, this);
						this.attachListener(a, "insertText", function(a) {
							this.insertText(a.data)
						}, this);
						this.setReadOnly(a.readOnly);
						this.attachClass("cke_editable");
						this.attachClass(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "cke_editable_inline" : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE || a.elementMode == CKEDITOR.ELEMENT_MODE_APPENDTO ? "cke_editable_themed" : "");
						this.attachClass("cke_contents_" + a.config.contentsLangDirection);
						a.keystrokeHandler.blockedKeystrokes[8] = +a.readOnly;
						a.keystrokeHandler.attach(this);
						this.on("blur", function() {
							this.hasFocus = false
						}, null, null, -1);
						this.on("focus", function() {
							this.hasFocus = true
						}, null, null, -1);
						a.focusManager.add(this);
						if (this.equals(CKEDITOR.document.getActive())) {
							this.hasFocus = true;
							a.once("contentDom", function() {
								a.focusManager.focus()
							})
						}
						this.isInline() && this.changeAttr("tabindex", a.tabIndex);
						if (!this.is("textarea")) {
							a.document = this.getDocument();
							a.window = this.getWindow();
							var f = a.document;
							this.changeAttr("spellcheck", !a.config.disableNativeSpellChecker);
							var e = a.config.contentsLangDirection;
							this.getDirection(1) != e && this.changeAttr("dir", e);
							var g = CKEDITOR.getCss();
							if (g) {
								e = f.getHead();
								if (!e.getCustomData("stylesheet")) {
									g = f.appendStyleText(g);
									g = new CKEDITOR.dom.element(g.ownerNode || g.owningElement);
									e.setCustomData("stylesheet", g);
									g.data("cke-temp", 1)
								}
							}
							e = f.getCustomData("stylesheet_ref") || 0;
							f.setCustomData("stylesheet_ref", e + 1);
							this.setCustomData("cke_includeReadonly", !a.config.disableReadonlyStyling);
							this.attachListener(this, "click", function(a) {
								var a =
									a.data,
									b = (new CKEDITOR.dom.elementPath(a.getTarget(), this)).contains("a");
								b && (a.$.button != 2 && b.isReadOnly()) && a.preventDefault()
							});
							var h = {
								8: 1,
								46: 1
							};
							this.attachListener(a, "key", function(b) {
								if (a.readOnly) return true;
								var d = b.data.domEvent.getKey(),
									f;
								if (d in h) {
									var b = a.getSelection(),
										e, g = b.getRanges()[0],
										i = g.startPath(),
										j, n, m, d = d == 8;
									if (CKEDITOR.env.ie && CKEDITOR.env.version < 11 && (e = b.getSelectedElement()) || (e = c(b))) {
										a.fire("saveSnapshot");
										g.moveToPosition(e, CKEDITOR.POSITION_BEFORE_START);
										e.remove();
										g.select();
										a.fire("saveSnapshot");
										f = 1
									} else if (g.collapsed)
										if ((j = i.block) && (m = j[d ? "getPrevious" : "getNext"](k)) && m.type == CKEDITOR.NODE_ELEMENT && m.is("table") && g[d ? "checkStartOfBlock" : "checkEndOfBlock"]()) {
											a.fire("saveSnapshot");
											g[d ? "checkEndOfBlock" : "checkStartOfBlock"]() && j.remove();
											g["moveToElementEdit" + (d ? "End" : "Start")](m);
											g.select();
											a.fire("saveSnapshot");
											f = 1
										} else if (i.blockLimit && i.blockLimit.is("td") && (n = i.blockLimit.getAscendant("table")) && g.checkBoundaryOfElement(n, d ? CKEDITOR.START : CKEDITOR.END) && (m =
										n[d ? "getPrevious" : "getNext"](k))) {
										a.fire("saveSnapshot");
										g["moveToElementEdit" + (d ? "End" : "Start")](m);
										g.checkStartOfBlock() && g.checkEndOfBlock() ? m.remove() : g.select();
										a.fire("saveSnapshot");
										f = 1
									} else if ((n = i.contains(["td", "th", "caption"])) && g.checkBoundaryOfElement(n, d ? CKEDITOR.START : CKEDITOR.END)) f = 1
								}
								return !f
							});
							a.blockless && (CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller) && this.attachListener(this, "keyup", function(b) {
								if (b.data.getKeystroke() in h && !this.getFirst(d)) {
									this.appendBogus();
									b = a.createRange();
									b.moveToPosition(this, CKEDITOR.POSITION_AFTER_START);
									b.select()
								}
							});
							this.attachListener(this, "dblclick", function(b) {
								if (a.readOnly) return false;
								b = {
									element: b.data.getTarget()
								};
								a.fire("doubleclick", b)
							});
							CKEDITOR.env.ie && this.attachListener(this, "click", b);
							CKEDITOR.env.ie || this.attachListener(this, "mousedown", function(b) {
								var c = b.data.getTarget();
								if (c.is("img", "hr", "input", "textarea", "select") && !c.isReadOnly()) {
									a.getSelection().selectElement(c);
									c.is("input", "textarea", "select") && b.data.preventDefault()
								}
							});
							CKEDITOR.env.gecko && this.attachListener(this, "mouseup", function(b) {
								if (b.data.$.button == 2) {
									b = b.data.getTarget();
									if (!b.getOuterHtml().replace(i, "")) {
										var c = a.createRange();
										c.moveToElementEditStart(b);
										c.select(true)
									}
								}
							});
							if (CKEDITOR.env.webkit) {
								this.attachListener(this, "click", function(a) {
									a.data.getTarget().is("input", "select") && a.data.preventDefault()
								});
								this.attachListener(this, "mouseup", function(a) {
									a.data.getTarget().is("input", "textarea") && a.data.preventDefault()
								})
							}
							CKEDITOR.env.webkit && this.attachListener(a,
								"key", function(b) {
									b = b.data.domEvent.getKey();
									if (b in h) {
										var b = b == 8,
											c = a.getSelection(),
											d = c.getRanges()[0],
											f = d.startPath(),
											e = f.block;
										if (d.collapsed && e && d[b ? "checkStartOfBlock" : "checkEndOfBlock"]() && d.moveToClosestEditablePosition(e, !b) && d.collapsed) {
											if (d.startContainer.type == CKEDITOR.NODE_ELEMENT) {
												var g = d.startContainer.getChild(d.startOffset - (b ? 1 : 0));
												if (g && g.type == CKEDITOR.NODE_ELEMENT && g.is("hr")) {
													a.fire("saveSnapshot");
													g.remove();
													a.fire("saveSnapshot");
													return false
												}
											}
											if ((d = d.startPath().block) && (!d ||
												!d.contains(e))) {
												a.fire("saveSnapshot");
												for (var i = e.getCommonAncestor(d), j = b ? e : d, g = j;
													(j = j.getParent()) && !i.equals(j) && j.getChildCount() == 1;) g = j;
												var k;
												(k = (b ? d : e).getBogus()) && k.remove();
												k = c.createBookmarks();
												(b ? e : d).moveChildren(b ? d : e, false);
												f.lastElement.mergeSiblings();
												g.remove();
												c.selectBookmarks(k);
												c.scrollIntoView();
												a.fire("saveSnapshot");
												return false
											}
										}
									}
								}, this, null, 100)
						}
					}
				},
				_: {
					detach: function() {
						this.editor.setData(this.editor.getData(), 0, 1);
						this.clearListeners();
						this.restoreAttrs();
						var a;
						if (a =
							this.removeCustomData("classes"))
							for (; a.length;) this.removeClass(a.pop());
						if (!this.is("textarea")) {
							a = this.getDocument();
							var b = a.getHead();
							if (b.getCustomData("stylesheet")) {
								var c = a.getCustomData("stylesheet_ref");
								if (--c) a.setCustomData("stylesheet_ref", c);
								else {
									a.removeCustomData("stylesheet_ref");
									b.removeCustomData("stylesheet").remove()
								}
							}
						}
						this.editor.fire("contentDomUnload");
						delete this.editor
					}
				}
			});
			CKEDITOR.editor.prototype.editable = function(a) {
				var b = this._.editable;
				if (b && a) return 0;
				if (arguments.length) b =
					this._.editable = a ? a instanceof CKEDITOR.editable ? a : new CKEDITOR.editable(this, a) : (b && b.detach(), null);
				return b
			};
			var g = CKEDITOR.dom.walker.bogus(),
				i = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi,
				k = CKEDITOR.dom.walker.whitespaces(true),
				n = CKEDITOR.dom.walker.bookmark(false, true);
			CKEDITOR.on("instanceLoaded", function(b) {
				var c = b.editor;
				c.on("insertElement", function(a) {
					a = a.data;
					if (a.type == CKEDITOR.NODE_ELEMENT && (a.is("input") ||
						a.is("textarea"))) {
						a.getAttribute("contentEditable") != "false" && a.data("cke-editable", a.hasAttribute("contenteditable") ? "true" : "1");
						a.setAttribute("contentEditable", false)
					}
				});
				c.on("selectionChange", function(b) {
					if (!c.readOnly) {
						var d = c.getSelection();
						if (d && !d.isLocked) {
							d = c.checkDirty();
							c.fire("lockSnapshot");
							a(b);
							c.fire("unlockSnapshot");
							!d && c.resetDirty()
						}
					}
				})
			});
			CKEDITOR.on("instanceCreated", function(a) {
				var b = a.editor;
				b.on("mode", function() {
					var a = b.editable();
					if (a && a.isInline()) {
						var c = b.title;
						a.changeAttr("role",
							"textbox");
						a.changeAttr("aria-label", c);
						c && a.changeAttr("title", c);
						if (c = this.ui.space(this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "top" : "contents")) {
							var d = CKEDITOR.tools.getNextId(),
								f = CKEDITOR.dom.element.createFromHtml('<span id="' + d + '" class="cke_voice_label">' + this.lang.common.editorHelp + "</span>");
							c.append(f);
							a.changeAttr("aria-describedby", d)
						}
					}
				})
			});
			CKEDITOR.addCss(".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}");
			var o = function() {
					function a(b) {
						return b.type ==
							CKEDITOR.NODE_ELEMENT
					}

					function b(c, d) {
						var f, e, g, i, j = [],
							y = d.range.startContainer;
						f = d.range.startPath();
						for (var y = h[y.getName()], k = 0, p = c.getChildren(), n = p.count(), x = -1, o = -1, s = 0, v = f.contains(h.$list); k < n; ++k) {
							f = p.getItem(k);
							if (a(f)) {
								g = f.getName();
								if (v && g in CKEDITOR.dtd.$list) j = j.concat(b(f, d));
								else {
									i = !!y[g];
									if (g == "br" && f.data("cke-eol") && (!k || k == n - 1)) {
										s = (e = k ? j[k - 1].node : p.getItem(k + 1)) && (!a(e) || !e.is("br"));
										e = e && a(e) && h.$block[e.getName()]
									}
									x == -1 && !i && (x = k);
									i || (o = k);
									j.push({
										isElement: 1,
										isLineBreak: s,
										isBlock: f.isBlockBoundary(),
										hasBlockSibling: e,
										node: f,
										name: g,
										allowed: i
									});
									e = s = 0
								}
							} else j.push({
								isElement: 0,
								node: f,
								allowed: 1
							})
						}
						if (x > -1) j[x].firstNotAllowed = 1;
						if (o > -1) j[o].lastNotAllowed = 1;
						return j
					}

					function c(b, d) {
						var f = [],
							e = b.getChildren(),
							g = e.count(),
							i, j = 0,
							y = h[d],
							k = !b.is(h.$inline) || b.is("br");
						for (k && f.push(" "); j < g; j++) {
							i = e.getItem(j);
							a(i) && !i.is(y) ? f = f.concat(c(i, d)) : f.push(i)
						}
						k && f.push(" ");
						return f
					}

					function f(b) {
						return b && a(b) && (b.is(h.$removeEmpty) || b.is("a") && !b.isBlockBoundary())
					}

					function e(b,
						c, d, f) {
						var g = b.clone(),
							h, j;
						g.setEndAt(c, CKEDITOR.POSITION_BEFORE_END);
						if ((h = (new CKEDITOR.dom.walker(g)).next()) && a(h) && i[h.getName()] && (j = h.getPrevious()) && a(j) && !j.getParent().equals(b.startContainer) && d.contains(j) && f.contains(h) && h.isIdentical(j)) {
							h.moveChildren(j);
							h.remove();
							e(b, c, d, f)
						}
					}

					function g(b, c) {
						function d(b, c) {
							if (c.isBlock && c.isElement && !c.node.is("br") && a(b) && b.is("br")) {
								b.remove();
								return 1
							}
						}
						var f = c.endContainer.getChild(c.endOffset),
							e = c.endContainer.getChild(c.endOffset - 1);
						f && d(f, b[b.length -
							1]);
						if (e && d(e, b[0])) {
							c.setEnd(c.endContainer, c.endOffset - 1);
							c.collapse()
						}
					}
					var h = CKEDITOR.dtd,
						i = {
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
						},
						k = {
							p: 1,
							div: 1,
							h1: 1,
							h2: 1,
							h3: 1,
							h4: 1,
							h5: 1,
							h6: 1
						},
						n = CKEDITOR.tools.extend({}, h.$inline);
					delete n.br;
					return function(i, o, u) {
						var A = i.editor;
						i.getDocument();
						var I = A.getSelection().getRanges()[0],
							r = false;
						if (o == "unfiltered_html") {
							o = "html";
							r = true
						}
						if (!I.checkReadOnly()) {
							var C = (new CKEDITOR.dom.elementPath(I.startContainer, I.root)).blockLimit ||
								I.root,
								o = {
									type: o,
									dontFilter: r,
									editable: i,
									editor: A,
									range: I,
									blockLimit: C,
									mergeCandidates: [],
									zombies: []
								},
								A = o.range,
								r = o.mergeCandidates,
								y, E, H, F;
							if (o.type == "text" && A.shrink(CKEDITOR.SHRINK_ELEMENT, true, false)) {
								y = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", A.document);
								A.insertNode(y);
								A.setStartAfter(y)
							}
							E = new CKEDITOR.dom.elementPath(A.startContainer);
							o.endPath = H = new CKEDITOR.dom.elementPath(A.endContainer);
							if (!A.collapsed) {
								var C = H.block || H.blockLimit,
									S = A.getCommonAncestor();
								C && (!C.equals(S) &&
									!C.contains(S) && A.checkEndOfBlock()) && o.zombies.push(C);
								A.deleteContents()
							}
							for (;
								(F = a(A.startContainer) && A.startContainer.getChild(A.startOffset - 1)) && a(F) && F.isBlockBoundary() && E.contains(F);) A.moveToPosition(F, CKEDITOR.POSITION_BEFORE_END);
							e(A, o.blockLimit, E, H);
							if (y) {
								A.setEndBefore(y);
								A.collapse();
								y.remove()
							}
							y = A.startPath();
							if (C = y.contains(f, false, 1)) {
								A.splitElement(C);
								o.inlineStylesRoot = C;
								o.inlineStylesPeak = y.lastElement
							}
							y = A.createBookmark();
							(C = y.startNode.getPrevious(d)) && a(C) && f(C) && r.push(C);
							(C = y.startNode.getNext(d)) && a(C) && f(C) && r.push(C);
							for (C = y.startNode;
								(C = C.getParent()) && f(C);) r.push(C);
							A.moveToBookmark(y);
							if (y = u) {
								y = o.range;
								if (o.type == "text" && o.inlineStylesRoot) {
									F = o.inlineStylesPeak;
									A = F.getDocument().createText("{cke-peak}");
									for (r = o.inlineStylesRoot.getParent(); !F.equals(r);) {
										A = A.appendTo(F.clone());
										F = F.getParent()
									}
									u = A.getOuterHtml().split("{cke-peak}").join(u)
								}
								F = o.blockLimit.getName();
								if (/^\s+|\s+$/.test(u) && "span" in CKEDITOR.dtd[F]) var O = '<span data-cke-marker="1">&nbsp;</span>',
									u = O + u + O;
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
									F.getLast().remove()
								}
								if ((O = y.startPath().block) && !(O.getChildCount() == 1 && O.getBogus())) a: {
									var J;
									if (F.getChildCount() == 1 && a(J = F.getFirst()) && J.is(k)) {
										O = J.getElementsByTag("*");
										y = 0;
										for (r = O.count(); y < r; y++) {
											A = O.getItem(y);
											if (!A.is(n)) break a
										}
										J.moveChildren(J.getParent(1));
										J.remove()
									}
								}
								o.dataWrapper = F;
								y = u
							}
							if (y) {
								J = o.range;
								var O = J.document,
									G, u = o.blockLimit;
								y = 0;
								var M;
								F = [];
								var L, Q, r = A = 0,
									N, T;
								E = J.startContainer;
								var C = o.endPath.elements[0],
									U;
								H = C.getPosition(E);
								S = !!C.getCommonAncestor(E) && H != CKEDITOR.POSITION_IDENTICAL && !(H & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED);
								E = b(o.dataWrapper, o);
								for (g(E, J); y < E.length; y++) {
									H = E[y];
									if (G = H.isLineBreak) {
										G = J;
										N = u;
										var P = void 0,
											W = void 0;
										if (H.hasBlockSibling) G = 1;
										else {
											P = G.startContainer.getAscendant(h.$block, 1);
											if (!P || !P.is({
												div: 1,
												p: 1
											})) G = 0;
											else {
												W = P.getPosition(N);
												if (W == CKEDITOR.POSITION_IDENTICAL || W == CKEDITOR.POSITION_CONTAINS) G = 0;
												else {
													N = G.splitElement(P);
													G.moveToPosition(N, CKEDITOR.POSITION_AFTER_START);
													G = 1
												}
											}
										}
									}
									if (G) r = y > 0;
									else {
										G = J.startPath();
										if (!H.isBlock && o.editor.config.autoParagraph !== false && (o.editor.activeEnterMode != CKEDITOR.ENTER_BR && o.editor.editable().equals(G.blockLimit) && !G.block) && (Q = o.editor.activeEnterMode != CKEDITOR.ENTER_BR && o.editor.config.autoParagraph !== false ? o.editor.activeEnterMode == CKEDITOR.ENTER_DIV ?
											"div" : "p" : false)) {
											Q = O.createElement(Q);
											Q.appendBogus();
											J.insertNode(Q);
											CKEDITOR.env.needsBrFiller && (M = Q.getBogus()) && M.remove();
											J.moveToPosition(Q, CKEDITOR.POSITION_BEFORE_END)
										}
										if ((G = J.startPath().block) && !G.equals(L)) {
											if (M = G.getBogus()) {
												M.remove();
												F.push(G)
											}
											L = G
										}
										H.firstNotAllowed && (A = 1);
										if (A && H.isElement) {
											G = J.startContainer;
											for (N = null; G && !h[G.getName()][H.name];) {
												if (G.equals(u)) {
													G = null;
													break
												}
												N = G;
												G = G.getParent()
											}
											if (G) {
												if (N) {
													T = J.splitElement(N);
													o.zombies.push(T);
													o.zombies.push(N)
												}
											} else {
												N = u.getName();
												U = !y;
												G = y == E.length - 1;
												N = c(H.node, N);
												for (var P = [], W = N.length, Z = 0, aa = void 0, ba = 0, ca = -1; Z < W; Z++) {
													aa = N[Z];
													if (aa == " ") {
														if (!ba && (!U || Z)) {
															P.push(new CKEDITOR.dom.text(" "));
															ca = P.length
														}
														ba = 1
													} else {
														P.push(aa);
														ba = 0
													}
												}
												G && ca == P.length && P.pop();
												U = P
											}
										}
										if (U) {
											for (; G = U.pop();) J.insertNode(G);
											U = 0
										} else J.insertNode(H.node); if (H.lastNotAllowed && y < E.length - 1) {
											(T = S ? C : T) && J.setEndAt(T, CKEDITOR.POSITION_AFTER_START);
											A = 0
										}
										J.collapse()
									}
								}
								o.dontMoveCaret = r;
								o.bogusNeededBlocks = F
							}
							M = o.range;
							var X;
							T = o.bogusNeededBlocks;
							for (U = M.createBookmark(); L =
								o.zombies.pop();)
								if (L.getParent()) {
									Q = M.clone();
									Q.moveToElementEditStart(L);
									Q.removeEmptyBlocksAtEnd()
								}
							if (T)
								for (; L = T.pop();) CKEDITOR.env.needsBrFiller ? L.appendBogus() : L.append(M.document.createText(" "));
							for (; L = o.mergeCandidates.pop();) L.mergeSiblings();
							M.moveToBookmark(U);
							if (!o.dontMoveCaret) {
								for (L = a(M.startContainer) && M.startContainer.getChild(M.startOffset - 1); L && a(L) && !L.is(h.$empty);) {
									if (L.isBlockBoundary()) M.moveToPosition(L, CKEDITOR.POSITION_BEFORE_END);
									else {
										if (f(L) && L.getHtml().match(/(\s|&nbsp;)$/g)) {
											X =
												null;
											break
										}
										X = M.clone();
										X.moveToPosition(L, CKEDITOR.POSITION_BEFORE_END)
									}
									L = L.getLast(d)
								}
								X && M.moveToRange(X)
							}
							I.select();
							j(i)
						}
					}
				}(),
				r = function() {
					function a(b) {
						b = new CKEDITOR.dom.walker(b);
						b.guard = function(a, b) {
							if (b) return false;
							if (a.type == CKEDITOR.NODE_ELEMENT) return a.is(CKEDITOR.dtd.$tableContent)
						};
						b.evaluator = function(a) {
							return a.type == CKEDITOR.NODE_ELEMENT
						};
						return b
					}

					function b(a, c, d) {
						c = a.getDocument().createElement(c);
						a.append(c, d);
						return c
					}

					function c(a) {
						var b = a.count(),
							d;
						for (b; b-- > 0;) {
							d = a.getItem(b);
							if (!CKEDITOR.tools.trim(d.getHtml())) {
								d.appendBogus();
								CKEDITOR.env.ie && (CKEDITOR.env.version < 9 && d.getChildCount()) && d.getFirst().remove()
							}
						}
					}
					return function(d) {
						var f = d.startContainer,
							e = f.getAscendant("table", 1),
							g = false;
						c(e.getElementsByTag("td"));
						c(e.getElementsByTag("th"));
						e = d.clone();
						e.setStart(f, 0);
						e = a(e).lastBackward();
						if (!e) {
							e = d.clone();
							e.setEndAt(f, CKEDITOR.POSITION_BEFORE_END);
							e = a(e).lastForward();
							g = true
						}
						e || (e = f);
						if (e.is("table")) {
							d.setStartAt(e, CKEDITOR.POSITION_BEFORE_START);
							d.collapse(true);
							e.remove()
						} else {
							e.is({
								tbody: 1,
								thead: 1,
								tfoot: 1
							}) && (e = b(e, "tr", g));
							e.is("tr") && (e = b(e, e.getParent().is("thead") ? "th" : "td", g));
							(f = e.getBogus()) && f.remove();
							d.moveToPosition(e, g ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END)
						}
					}
				}()
		}(),
		function() {
			function a() {
				var a = this._.fakeSelection,
					b;
				if (a) {
					b = this.getSelection(1);
					if (!b || !b.isHidden()) {
						a.reset();
						a = 0
					}
				}
				if (!a) {
					a = b || this.getSelection(1);
					if (!a || a.getType() == CKEDITOR.SELECTION_NONE) return
				}
				this.fire("selectionCheck", a);
				b = this.elementPath();
				if (!b.compare(this._.selectionPreviousPath)) {
					if (CKEDITOR.env.webkit) this._.previousActive =
						this.document.getActive();
					this._.selectionPreviousPath = b;
					this.fire("selectionChange", {
						selection: a,
						path: b
					})
				}
			}

			function e() {
				o = true;
				if (!n) {
					b.call(this);
					n = CKEDITOR.tools.setTimeout(b, 200, this)
				}
			}

			function b() {
				n = null;
				if (o) {
					CKEDITOR.tools.setTimeout(a, 0, this);
					o = false
				}
			}

			function d(a) {
				function b(c, d) {
					return !c || c.type == CKEDITOR.NODE_TEXT ? false : a.clone()["moveToElementEdit" + (d ? "End" : "Start")](c)
				}
				if (!(a.root instanceof CKEDITOR.editable)) return false;
				var c = a.startContainer,
					d = a.getPreviousNode(r, null, c),
					f = a.getNextNode(r,
						null, c);
				return b(d) || b(f, 1) || !d && !f && !(c.type == CKEDITOR.NODE_ELEMENT && c.isBlockBoundary() && c.getBogus()) ? true : false
			}

			function f(a) {
				return a.getCustomData("cke-fillingChar")
			}

			function c(a, b) {
				var c = a && a.removeCustomData("cke-fillingChar");
				if (c) {
					if (b !== false) {
						var d, f = a.getDocument().getSelection().getNative(),
							e = f && f.type != "None" && f.getRangeAt(0);
						if (c.getLength() > 1 && e && e.intersectsNode(c.$)) {
							d = [f.anchorOffset, f.focusOffset];
							e = f.focusNode == c.$ && f.focusOffset > 0;
							f.anchorNode == c.$ && f.anchorOffset > 0 && d[0] --;
							e && d[1] --;
							var g;
							e = f;
							if (!e.isCollapsed) {
								g = e.getRangeAt(0);
								g.setStart(e.anchorNode, e.anchorOffset);
								g.setEnd(e.focusNode, e.focusOffset);
								g = g.collapsed
							}
							g && d.unshift(d.pop())
						}
					}
					c.setText(h(c.getText()));
					if (d) {
						c = f.getRangeAt(0);
						c.setStart(c.startContainer, d[0]);
						c.setEnd(c.startContainer, d[1]);
						f.removeAllRanges();
						f.addRange(c)
					}
				}
			}

			function h(a) {
				return a.replace(/\u200B( )?/g, function(a) {
					return a[1] ? " " : ""
				})
			}

			function j(a, b, c) {
				var d = a.on("focus", function(a) {
					a.cancel()
				}, null, null, -100);
				if (CKEDITOR.env.ie) var f =
					a.getDocument().on("selectionchange", function(a) {
						a.cancel()
					}, null, null, -100);
				else {
					var e = new CKEDITOR.dom.range(a);
					e.moveToElementEditStart(a);
					var g = a.getDocument().$.createRange();
					g.setStart(e.startContainer.$, e.startOffset);
					g.collapse(1);
					b.removeAllRanges();
					b.addRange(g)
				}
				c && a.focus();
				d.removeListener();
				f && f.removeListener()
			}

			function g(a) {
				var b = CKEDITOR.dom.element.createFromHtml('<div data-cke-hidden-sel="1" data-cke-temp="1" style="' + (CKEDITOR.env.ie ? "display:none" : "position:fixed;top:0;left:-1000px") +
					'">&nbsp;</div>', a.document);
				a.fire("lockSnapshot");
				a.editable().append(b);
				var c = a.getSelection(1),
					d = a.createRange(),
					f = c.root.on("selectionchange", function(a) {
						a.cancel()
					}, null, null, 0);
				d.setStartAt(b, CKEDITOR.POSITION_AFTER_START);
				d.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
				c.selectRanges([d]);
				f.removeListener();
				a.fire("unlockSnapshot");
				a._.hiddenSelectionContainer = b
			}

			function i(a) {
				var b = {
					37: 1,
					39: 1,
					8: 1,
					46: 1
				};
				return function(c) {
					var d = c.data.getKeystroke();
					if (b[d]) {
						var f = a.getSelection().getRanges(),
							e =
							f[0];
						if (f.length == 1 && e.collapsed)
							if ((d = e[d < 38 ? "getPreviousEditableNode" : "getNextEditableNode"]()) && d.type == CKEDITOR.NODE_ELEMENT && d.getAttribute("contenteditable") == "false") {
								a.getSelection().fake(d);
								c.data.preventDefault();
								c.cancel()
							}
					}
				}
			}

			function k(a) {
				for (var b = 0; b < a.length; b++) {
					var c = a[b];
					c.getCommonAncestor().isReadOnly() && a.splice(b, 1);
					if (!c.collapsed) {
						if (c.startContainer.isReadOnly())
							for (var d = c.startContainer, f; d;) {
								if ((f = d.type == CKEDITOR.NODE_ELEMENT) && d.is("body") || !d.isReadOnly()) break;
								f && d.getAttribute("contentEditable") ==
									"false" && c.setStartAfter(d);
								d = d.getParent()
							}
						d = c.startContainer;
						f = c.endContainer;
						var e = c.startOffset,
							g = c.endOffset,
							h = c.clone();
						d && d.type == CKEDITOR.NODE_TEXT && (e >= d.getLength() ? h.setStartAfter(d) : h.setStartBefore(d));
						f && f.type == CKEDITOR.NODE_TEXT && (g ? h.setEndAfter(f) : h.setEndBefore(f));
						d = new CKEDITOR.dom.walker(h);
						d.evaluator = function(d) {
							if (d.type == CKEDITOR.NODE_ELEMENT && d.isReadOnly()) {
								var f = c.clone();
								c.setEndBefore(d);
								c.collapsed && a.splice(b--, 1);
								if (!(d.getPosition(h.endContainer) & CKEDITOR.POSITION_CONTAINS)) {
									f.setStartAfter(d);
									f.collapsed || a.splice(b + 1, 0, f)
								}
								return true
							}
							return false
						};
						d.next()
					}
				}
				return a
			}
			var n, o, r = CKEDITOR.dom.walker.invisible(1),
				l = function() {
					function a(b) {
						return function(a) {
							var c = a.editor.createRange();
							c.moveToClosestEditablePosition(a.selected, b) && a.editor.getSelection().selectRanges([c]);
							return false
						}
					}

					function b(a) {
						return function(b) {
							var c = b.editor,
								d = c.createRange(),
								f;
							if (!(f = d.moveToClosestEditablePosition(b.selected, a))) f = d.moveToClosestEditablePosition(b.selected, !a);
							f && c.getSelection().selectRanges([d]);
							c.fire("saveSnapshot");
							b.selected.remove();
							if (!f) {
								d.moveToElementEditablePosition(c.editable());
								c.getSelection().selectRanges([d])
							}
							c.fire("saveSnapshot");
							return false
						}
					}
					var c = a(),
						d = a(1);
					return {
						37: c,
						38: c,
						39: d,
						40: d,
						8: b(),
						46: b(1)
					}
				}();
			CKEDITOR.on("instanceCreated", function(b) {
				function d() {
					var a = f.getSelection();
					a && a.removeAllRanges()
				}
				var f = b.editor;
				f.on("contentDom", function() {
					var b = f.document,
						d = CKEDITOR.document,
						g = f.editable(),
						h = b.getBody(),
						j = b.getDocumentElement(),
						k = g.isInline(),
						p, n;
					CKEDITOR.env.gecko &&
						g.attachListener(g, "focus", function(a) {
							a.removeListener();
							if (p !== 0)
								if ((a = f.getSelection().getNative()) && a.isCollapsed && a.anchorNode == g.$) {
									a = f.createRange();
									a.moveToElementEditStart(g);
									a.select()
								}
						}, null, null, -2);
					g.attachListener(g, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
						p && CKEDITOR.env.webkit && (p = f._.previousActive && f._.previousActive.equals(b.getActive()));
						f.unlockSelection(p);
						p = 0
					}, null, null, -1);
					g.attachListener(g, "mousedown", function() {
						p = 0
					});
					if (CKEDITOR.env.ie || k) {
						var l = function() {
							n =
								new CKEDITOR.dom.selection(f.getSelection());
							n.lock()
						};
						m ? g.attachListener(g, "beforedeactivate", l, null, null, -1) : g.attachListener(f, "selectionCheck", l, null, null, -1);
						g.attachListener(g, CKEDITOR.env.webkit ? "DOMFocusOut" : "blur", function() {
							f.lockSelection(n);
							p = 1
						}, null, null, -1);
						g.attachListener(g, "mousedown", function() {
							p = 0
						})
					}
					if (CKEDITOR.env.ie && !k) {
						var C;
						g.attachListener(g, "mousedown", function(a) {
							if (a.data.$.button == 2) {
								a = f.document.getSelection();
								if (!a || a.getType() == CKEDITOR.SELECTION_NONE) C = f.window.getScrollPosition()
							}
						});
						g.attachListener(g, "mouseup", function(a) {
							if (a.data.$.button == 2 && C) {
								f.document.$.documentElement.scrollLeft = C.x;
								f.document.$.documentElement.scrollTop = C.y
							}
							C = null
						});
						if (b.$.compatMode != "BackCompat") {
							if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) j.on("mousedown", function(a) {
								function b(a) {
									a = a.data.$;
									if (f) {
										var c = h.$.createTextRange();
										try {
											c.moveToPoint(a.x, a.y)
										} catch (d) {}
										f.setEndPoint(g.compareEndPoints("StartToStart", c) < 0 ? "EndToEnd" : "StartToStart", c);
										f.select()
									}
								}

								function c() {
									j.removeListener("mousemove",
										b);
									d.removeListener("mouseup", c);
									j.removeListener("mouseup", c);
									f.select()
								}
								a = a.data;
								if (a.getTarget().is("html") && a.$.y < j.$.clientHeight && a.$.x < j.$.clientWidth) {
									var f = h.$.createTextRange();
									try {
										f.moveToPoint(a.$.x, a.$.y)
									} catch (e) {}
									var g = f.duplicate();
									j.on("mousemove", b);
									d.on("mouseup", c);
									j.on("mouseup", c)
								}
							});
							if (CKEDITOR.env.version > 7 && CKEDITOR.env.version < 11) {
								j.on("mousedown", function(a) {
									if (a.data.getTarget().is("html")) {
										d.on("mouseup", y);
										j.on("mouseup", y)
									}
								});
								var y = function() {
									d.removeListener("mouseup",
										y);
									j.removeListener("mouseup", y);
									var a = CKEDITOR.document.$.selection,
										c = a.createRange();
									a.type != "None" && c.parentElement().ownerDocument == b.$ && c.select()
								}
							}
						}
					}
					g.attachListener(g, "selectionchange", a, f);
					g.attachListener(g, "keyup", e, f);
					g.attachListener(g, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
						f.forceNextSelectionCheck();
						f.selectionChange(1)
					});
					if (k && (CKEDITOR.env.webkit || CKEDITOR.env.gecko)) {
						var E;
						g.attachListener(g, "mousedown", function() {
							E = 1
						});
						g.attachListener(b.getDocumentElement(), "mouseup",
							function() {
								E && e.call(f);
								E = 0
							})
					} else g.attachListener(CKEDITOR.env.ie ? g : b.getDocumentElement(), "mouseup", e, f);
					CKEDITOR.env.webkit && g.attachListener(b, "keydown", function(a) {
						switch (a.data.getKey()) {
							case 13:
							case 33:
							case 34:
							case 35:
							case 36:
							case 37:
							case 39:
							case 8:
							case 45:
							case 46:
								c(g)
						}
					}, null, null, -1);
					g.attachListener(g, "keydown", i(f), null, null, -1)
				});
				f.on("setData", function() {
					f.unlockSelection();
					CKEDITOR.env.webkit && d()
				});
				f.on("contentDomUnload", function() {
					f.unlockSelection()
				});
				if (CKEDITOR.env.ie9Compat) f.on("beforeDestroy",
					d, null, null, 9);
				f.on("dataReady", function() {
					delete f._.fakeSelection;
					delete f._.hiddenSelectionContainer;
					f.selectionChange(1)
				});
				f.on("loadSnapshot", function() {
					var a = f.editable().getLast(function(a) {
						return a.type == CKEDITOR.NODE_ELEMENT
					});
					a && a.hasAttribute("data-cke-hidden-sel") && a.remove()
				}, null, null, 100);
				f.on("key", function(a) {
					if (f.mode == "wysiwyg") {
						var b = f.getSelection();
						if (b.isFake) {
							var c = l[a.data.keyCode];
							if (c) return c({
								editor: f,
								selected: b.getSelectedElement(),
								selection: b,
								keyEvent: a
							})
						}
					}
				})
			});
			CKEDITOR.on("instanceReady",
				function(a) {
					var b = a.editor;
					if (CKEDITOR.env.webkit) {
						b.on("selectionChange", function() {
							var a = b.editable(),
								d = f(a);
							d && (d.getCustomData("ready") ? c(a) : d.setCustomData("ready", 1))
						}, null, null, -1);
						b.on("beforeSetMode", function() {
							c(b.editable())
						}, null, null, -1);
						var d, e, a = function() {
								var a = b.editable();
								if (a)
									if (a = f(a)) {
										var c = b.document.$.defaultView.getSelection();
										c.type == "Caret" && c.anchorNode == a.$ && (e = 1);
										d = a.getText();
										a.setText(h(d))
									}
							},
							g = function() {
								var a = b.editable();
								if (a)
									if (a = f(a)) {
										a.setText(d);
										if (e) {
											b.document.$.defaultView.getSelection().setPosition(a.$,
												a.getLength());
											e = 0
										}
									}
							};
						b.on("beforeUndoImage", a);
						b.on("afterUndoImage", g);
						b.on("beforeGetData", a, null, null, 0);
						b.on("getData", g)
					}
				});
			CKEDITOR.editor.prototype.selectionChange = function(b) {
				(b ? a : e).call(this)
			};
			CKEDITOR.editor.prototype.getSelection = function(a) {
				if ((this._.savedSelection || this._.fakeSelection) && !a) return this._.savedSelection || this._.fakeSelection;
				return (a = this.editable()) && this.mode == "wysiwyg" ? new CKEDITOR.dom.selection(a) : null
			};
			CKEDITOR.editor.prototype.lockSelection = function(a) {
				a = a || this.getSelection(1);
				if (a.getType() != CKEDITOR.SELECTION_NONE) {
					!a.isLocked && a.lock();
					this._.savedSelection = a;
					return true
				}
				return false
			};
			CKEDITOR.editor.prototype.unlockSelection = function(a) {
				var b = this._.savedSelection;
				if (b) {
					b.unlock(a);
					delete this._.savedSelection;
					return true
				}
				return false
			};
			CKEDITOR.editor.prototype.forceNextSelectionCheck = function() {
				delete this._.selectionPreviousPath
			};
			CKEDITOR.dom.document.prototype.getSelection = function() {
				return new CKEDITOR.dom.selection(this)
			};
			CKEDITOR.dom.range.prototype.select = function() {
				var a =
					this.root instanceof CKEDITOR.editable ? this.root.editor.getSelection() : new CKEDITOR.dom.selection(this.root);
				a.selectRanges([this]);
				return a
			};
			CKEDITOR.SELECTION_NONE = 1;
			CKEDITOR.SELECTION_TEXT = 2;
			CKEDITOR.SELECTION_ELEMENT = 3;
			var m = typeof window.getSelection != "function",
				s = 1;
			CKEDITOR.dom.selection = function(a) {
				if (a instanceof CKEDITOR.dom.selection) var b = a,
					a = a.root;
				var c = a instanceof CKEDITOR.dom.element;
				this.rev = b ? b.rev : s++;
				this.document = a instanceof CKEDITOR.dom.document ? a : a.getDocument();
				this.root =
					a = c ? a : this.document.getBody();
				this.isLocked = 0;
				this._ = {
					cache: {}
				};
				if (b) {
					CKEDITOR.tools.extend(this._.cache, b._.cache);
					this.isFake = b.isFake;
					this.isLocked = b.isLocked;
					return this
				}
				b = m ? this.document.$.selection : this.document.getWindow().$.getSelection();
				if (CKEDITOR.env.webkit)(b.type == "None" && this.document.getActive().equals(a) || b.type == "Caret" && b.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT) && j(a, b);
				else if (CKEDITOR.env.gecko) b && (this.document.getActive().equals(a) && b.anchorNode && b.anchorNode.nodeType ==
					CKEDITOR.NODE_DOCUMENT) && j(a, b, true);
				else if (CKEDITOR.env.ie) {
					var d;
					try {
						d = this.document.getActive()
					} catch (f) {}
					if (m) b.type == "None" && (d && d.equals(this.document.getDocumentElement())) && j(a, null, true);
					else {
						(b = b && b.anchorNode) && (b = new CKEDITOR.dom.node(b));
						d && (d.equals(this.document.getDocumentElement()) && b && (a.equals(b) || a.contains(b))) && j(a, null, true)
					}
				}
				d = this.getNative();
				var e, g;
				if (d)
					if (d.getRangeAt) e = (g = d.rangeCount && d.getRangeAt(0)) && new CKEDITOR.dom.node(g.commonAncestorContainer);
					else {
						try {
							g = d.createRange()
						} catch (h) {}
						e =
							g && CKEDITOR.dom.element.get(g.item && g.item(0) || g.parentElement())
					}
				if (!e || !(e.type == CKEDITOR.NODE_ELEMENT || e.type == CKEDITOR.NODE_TEXT) || !this.root.equals(e) && !this.root.contains(e)) {
					this._.cache.type = CKEDITOR.SELECTION_NONE;
					this._.cache.startElement = null;
					this._.cache.selectedElement = null;
					this._.cache.selectedText = "";
					this._.cache.ranges = new CKEDITOR.dom.rangeList
				}
				return this
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
					return this._.cache.nativeSel !== void 0 ? this._.cache.nativeSel : this._.cache.nativeSel = m ? this.document.$.selection : this.document.getWindow().$.getSelection()
				},
				getType: m ? function() {
					var a = this._.cache;
					if (a.type) return a.type;
					var b = CKEDITOR.SELECTION_NONE;
					try {
						var c = this.getNative(),
							d = c.type;
						if (d == "Text") b = CKEDITOR.SELECTION_TEXT;
						if (d == "Control") b = CKEDITOR.SELECTION_ELEMENT;
						if (c.createRange().parentElement()) b = CKEDITOR.SELECTION_TEXT
					} catch (f) {}
					return a.type =
						b
				} : function() {
					var a = this._.cache;
					if (a.type) return a.type;
					var b = CKEDITOR.SELECTION_TEXT,
						c = this.getNative();
					if (!c || !c.rangeCount) b = CKEDITOR.SELECTION_NONE;
					else if (c.rangeCount == 1) {
						var c = c.getRangeAt(0),
							d = c.startContainer;
						if (d == c.endContainer && d.nodeType == 1 && c.endOffset - c.startOffset == 1 && t[d.childNodes[c.startOffset].nodeName.toLowerCase()]) b = CKEDITOR.SELECTION_ELEMENT
					}
					return a.type = b
				},
				getRanges: function() {
					var a = m ? function() {
						function a(b) {
							return (new CKEDITOR.dom.node(b)).getIndex()
						}
						var b = function(b,
							c) {
							b = b.duplicate();
							b.collapse(c);
							var d = b.parentElement();
							if (!d.hasChildNodes()) return {
								container: d,
								offset: 0
							};
							for (var f = d.children, e, g, h = b.duplicate(), i = 0, j = f.length - 1, k = -1, y, E; i <= j;) {
								k = Math.floor((i + j) / 2);
								e = f[k];
								h.moveToElementText(e);
								y = h.compareEndPoints("StartToStart", b);
								if (y > 0) j = k - 1;
								else if (y < 0) i = k + 1;
								else return {
									container: d,
									offset: a(e)
								}
							}
							if (k == -1 || k == f.length - 1 && y < 0) {
								h.moveToElementText(d);
								h.setEndPoint("StartToStart", b);
								h = h.text.replace(/(\r\n|\r)/g, "\n").length;
								f = d.childNodes;
								if (!h) {
									e = f[f.length -
										1];
									return e.nodeType != CKEDITOR.NODE_TEXT ? {
										container: d,
										offset: f.length
									} : {
										container: e,
										offset: e.nodeValue.length
									}
								}
								for (d = f.length; h > 0 && d > 0;) {
									g = f[--d];
									if (g.nodeType == CKEDITOR.NODE_TEXT) {
										E = g;
										h = h - g.nodeValue.length
									}
								}
								return {
									container: E,
									offset: -h
								}
							}
							h.collapse(y > 0 ? true : false);
							h.setEndPoint(y > 0 ? "StartToStart" : "EndToStart", b);
							h = h.text.replace(/(\r\n|\r)/g, "\n").length;
							if (!h) return {
								container: d,
								offset: a(e) + (y > 0 ? 0 : 1)
							};
							for (; h > 0;) try {
								g = e[y > 0 ? "previousSibling" : "nextSibling"];
								if (g.nodeType == CKEDITOR.NODE_TEXT) {
									h = h - g.nodeValue.length;
									E = g
								}
								e = g
							} catch (n) {
								return {
									container: d,
									offset: a(e)
								}
							}
							return {
								container: E,
								offset: y > 0 ? -h : E.nodeValue.length + h
							}
						};
						return function() {
							var a = this.getNative(),
								c = a && a.createRange(),
								d = this.getType();
							if (!a) return [];
							if (d == CKEDITOR.SELECTION_TEXT) {
								a = new CKEDITOR.dom.range(this.root);
								d = b(c, true);
								a.setStart(new CKEDITOR.dom.node(d.container), d.offset);
								d = b(c);
								a.setEnd(new CKEDITOR.dom.node(d.container), d.offset);
								a.endContainer.getPosition(a.startContainer) & CKEDITOR.POSITION_PRECEDING && a.endOffset <= a.startContainer.getIndex() &&
									a.collapse();
								return [a]
							}
							if (d == CKEDITOR.SELECTION_ELEMENT) {
								for (var d = [], f = 0; f < c.length; f++) {
									for (var e = c.item(f), g = e.parentNode, h = 0, a = new CKEDITOR.dom.range(this.root); h < g.childNodes.length && g.childNodes[h] != e; h++);
									a.setStart(new CKEDITOR.dom.node(g), h);
									a.setEnd(new CKEDITOR.dom.node(g), h + 1);
									d.push(a)
								}
								return d
							}
							return []
						}
					}() : function() {
						var a = [],
							b, c = this.getNative();
						if (!c) return a;
						for (var d = 0; d < c.rangeCount; d++) {
							var f = c.getRangeAt(d);
							b = new CKEDITOR.dom.range(this.root);
							b.setStart(new CKEDITOR.dom.node(f.startContainer),
								f.startOffset);
							b.setEnd(new CKEDITOR.dom.node(f.endContainer), f.endOffset);
							a.push(b)
						}
						return a
					};
					return function(b) {
						var c = this._.cache,
							d = c.ranges;
						if (!d) c.ranges = d = new CKEDITOR.dom.rangeList(a.call(this));
						return !b ? d : k(new CKEDITOR.dom.rangeList(d.slice()))
					}
				}(),
				getStartElement: function() {
					var a = this._.cache;
					if (a.startElement !== void 0) return a.startElement;
					var b;
					switch (this.getType()) {
						case CKEDITOR.SELECTION_ELEMENT:
							return this.getSelectedElement();
						case CKEDITOR.SELECTION_TEXT:
							var c = this.getRanges()[0];
							if (c) {
								if (c.collapsed) {
									b = c.startContainer;
									b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent())
								} else {
									for (c.optimize();;) {
										b = c.startContainer;
										if (c.startOffset == (b.getChildCount ? b.getChildCount() : b.getLength()) && !b.isBlockBoundary()) c.setStartAfter(b);
										else break
									}
									b = c.startContainer;
									if (b.type != CKEDITOR.NODE_ELEMENT) return b.getParent();
									b = b.getChild(c.startOffset);
									if (!b || b.type != CKEDITOR.NODE_ELEMENT) b = c.startContainer;
									else
										for (c = b.getFirst(); c && c.type == CKEDITOR.NODE_ELEMENT;) {
											b = c;
											c = c.getFirst()
										}
								}
								b = b.$
							}
					}
					return a.startElement =
						b ? new CKEDITOR.dom.element(b) : null
				},
				getSelectedElement: function() {
					var a = this._.cache;
					if (a.selectedElement !== void 0) return a.selectedElement;
					var b = this,
						c = CKEDITOR.tools.tryThese(function() {
							return b.getNative().createRange().item(0)
						}, function() {
							for (var a = b.getRanges()[0].clone(), c, d, f = 2; f && (!(c = a.getEnclosedNode()) || !(c.type == CKEDITOR.NODE_ELEMENT && t[c.getName()] && (d = c))); f--) a.shrink(CKEDITOR.SHRINK_ELEMENT);
							return d && d.$
						});
					return a.selectedElement = c ? new CKEDITOR.dom.element(c) : null
				},
				getSelectedText: function() {
					var a =
						this._.cache;
					if (a.selectedText !== void 0) return a.selectedText;
					var b = this.getNative(),
						b = m ? b.type == "Control" ? "" : b.createRange().text : b.toString();
					return a.selectedText = b
				},
				lock: function() {
					this.getRanges();
					this.getStartElement();
					this.getSelectedElement();
					this.getSelectedText();
					this._.cache.nativeSel = null;
					this.isLocked = 1
				},
				unlock: function(a) {
					if (this.isLocked) {
						if (a) var b = this.getSelectedElement(),
							c = !b && this.getRanges(),
							d = this.isFake;
						this.isLocked = 0;
						this.reset();
						if (a)(a = b || c[0] && c[0].getCommonAncestor()) &&
							a.getAscendant("body", 1) && (d ? this.fake(b) : b ? this.selectElement(b) : this.selectRanges(c))
					}
				},
				reset: function() {
					this._.cache = {};
					this.isFake = 0;
					var a = this.root.editor;
					if (a && a._.fakeSelection && this.rev == a._.fakeSelection.rev) {
						delete a._.fakeSelection;
						var b = a._.hiddenSelectionContainer;
						if (b) {
							a.fire("lockSnapshot");
							b.remove();
							a.fire("unlockSnapshot")
						}
						delete a._.hiddenSelectionContainer
					}
					this.rev = s++
				},
				selectElement: function(a) {
					var b = new CKEDITOR.dom.range(this.root);
					b.setStartBefore(a);
					b.setEndAfter(a);
					this.selectRanges([b])
				},
				selectRanges: function(a) {
					var b = this.root.editor,
						b = b && b._.hiddenSelectionContainer;
					this.reset();
					if (b)
						for (var b = this.root, f, e = 0; e < a.length; ++e) {
							f = a[e];
							if (f.endContainer.equals(b)) f.endOffset = Math.min(f.endOffset, b.getChildCount())
						}
					if (a.length)
						if (this.isLocked) {
							var g = CKEDITOR.document.getActive();
							this.unlock();
							this.selectRanges(a);
							this.lock();
							!g.equals(this.root) && g.focus()
						} else {
							var h;
							a: {
								var i, j;
								if (a.length == 1 && !(j = a[0]).collapsed && (h = j.getEnclosedNode()) && h.type == CKEDITOR.NODE_ELEMENT) {
									j = j.clone();
									j.shrink(CKEDITOR.SHRINK_ELEMENT, true);
									if ((i = j.getEnclosedNode()) && i.type == CKEDITOR.NODE_ELEMENT) h = i;
									if (h.getAttribute("contenteditable") == "false") break a
								}
								h = void 0
							}
							if (h) this.fake(h);
							else {
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
										a[0].setEnd(h.endContainer, h.endOffset)
									}
									h = a[0];
									var a = h.collapsed,
										k, n, l;
									if ((f = h.getEnclosedNode()) && f.type == CKEDITOR.NODE_ELEMENT && f.getName() in t && (!f.is("a") || !f.getText())) try {
										l = f.$.createControlRange();
										l.addElement(f.$);
										l.select();
										return
									} catch (o) {}(h.startContainer.type == CKEDITOR.NODE_ELEMENT && h.startContainer.getName() in b || h.endContainer.type == CKEDITOR.NODE_ELEMENT && h.endContainer.getName() in b) && h.shrink(CKEDITOR.NODE_ELEMENT, true);
									l = h.createBookmark();
									b = l.startNode;
									if (!a) g = l.endNode;
									l = h.document.$.body.createTextRange();
									l.moveToElementText(b.$);
									l.moveStart("character", 1);
									if (g) {
										i = h.document.$.body.createTextRange();
										i.moveToElementText(g.$);
										l.setEndPoint("EndToEnd", i);
										l.moveEnd("character", -1)
									} else {
										k =
											b.getNext(j);
										n = b.hasAscendant("pre");
										k = !(k && k.getText && k.getText().match(i)) && (n || !b.hasPrevious() || b.getPrevious().is && b.getPrevious().is("br"));
										n = h.document.createElement("span");
										n.setHtml("&#65279;");
										n.insertBefore(b);
										k && h.document.createText("﻿").insertBefore(b)
									}
									h.setStartBefore(b);
									b.remove();
									if (a) {
										if (k) {
											l.moveStart("character", -1);
											l.select();
											h.document.$.selection.clear()
										} else l.select();
										h.moveToPosition(n, CKEDITOR.POSITION_BEFORE_START);
										n.remove()
									} else {
										h.setEndBefore(g);
										g.remove();
										l.select()
									}
								} else {
									g =
										this.getNative();
									if (!g) return;
									this.removeAllRanges();
									for (l = 0; l < a.length; l++) {
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
													continue
												}
											}
										}
										h = a[l];
										n = this.document.$.createRange();
										if (h.collapsed && CKEDITOR.env.webkit && d(h)) {
											k = this.root;
											c(k, false);
											i = k.getDocument().createText("​");
											k.setCustomData("cke-fillingChar", i);
											h.insertNode(i);
											if ((k = i.getNext()) && !i.getPrevious() && k.type == CKEDITOR.NODE_ELEMENT && k.getName() == "br") {
												c(this.root);
												h.moveToPosition(k, CKEDITOR.POSITION_BEFORE_START)
											} else h.moveToPosition(i, CKEDITOR.POSITION_AFTER_END)
										}
										n.setStart(h.startContainer.$, h.startOffset);
										try {
											n.setEnd(h.endContainer.$, h.endOffset)
										} catch (C) {
											if (C.toString().indexOf("NS_ERROR_ILLEGAL_VALUE") >= 0) {
												h.collapse(1);
												n.setEnd(h.endContainer.$, h.endOffset)
											} else throw C;
										}
										g.addRange(n)
									}
								}
								this.reset();
								this.root.fire("selectionchange")
							}
						}
				},
				fake: function(a) {
					var b = this.root.editor;
					this.reset();
					g(b);
					var c = this._.cache,
						d = new CKEDITOR.dom.range(this.root);
					d.setStartBefore(a);
					d.setEndAfter(a);
					c.ranges = new CKEDITOR.dom.rangeList(d);
					c.selectedElement = c.startElement = a;
					c.type = CKEDITOR.SELECTION_ELEMENT;
					c.selectedText = c.nativeSel = null;
					this.isFake = 1;
					this.rev = s++;
					b._.fakeSelection = this;
					this.root.fire("selectionchange")
				},
				isHidden: function() {
					var a = this.getCommonAncestor();
					a && a.type ==
						CKEDITOR.NODE_TEXT && (a = a.getParent());
					return !(!a || !a.data("cke-hidden-sel"))
				},
				createBookmarks: function(a) {
					a = this.getRanges().createBookmarks(a);
					this.isFake && (a.isFake = 1);
					return a
				},
				createBookmarks2: function(a) {
					a = this.getRanges().createBookmarks2(a);
					this.isFake && (a.isFake = 1);
					return a
				},
				selectBookmarks: function(a) {
					for (var b = [], c = 0; c < a.length; c++) {
						var d = new CKEDITOR.dom.range(this.root);
						d.moveToBookmark(a[c]);
						b.push(d)
					}
					a.isFake ? this.fake(b[0].getEnclosedNode()) : this.selectRanges(b);
					return this
				},
				getCommonAncestor: function() {
					var a =
						this.getRanges();
					return !a.length ? null : a[0].startContainer.getCommonAncestor(a[a.length - 1].endContainer)
				},
				scrollIntoView: function() {
					this.type != CKEDITOR.SELECTION_NONE && this.getRanges()[0].scrollIntoView()
				},
				removeAllRanges: function() {
					if (this.getType() != CKEDITOR.SELECTION_NONE) {
						var a = this.getNative();
						try {
							a && a[m ? "empty" : "removeAllRanges"]()
						} catch (b) {}
						this.reset()
					}
				}
			}
		}(), "use strict", CKEDITOR.STYLE_BLOCK = 1, CKEDITOR.STYLE_INLINE = 2, CKEDITOR.STYLE_OBJECT = 3,
		function() {
			function a(a, b) {
				for (var c, d; a = a.getParent();) {
					if (a.equals(b)) break;
					if (a.getAttribute("data-nostyle")) c = a;
					else if (!d) {
						var f = a.getAttribute("contentEditable");
						f == "false" ? c = a : f == "true" && (d = 1)
					}
				}
				return c
			}

			function e(b) {
				var c = b.document;
				if (b.collapsed) {
					c = s(this, c);
					b.insertNode(c);
					b.moveToPosition(c, CKEDITOR.POSITION_BEFORE_END)
				} else {
					var f = this.element,
						g = this._.definition,
						h, i = g.ignoreReadonly,
						j = i || g.includeReadonly;
					j == void 0 && (j = b.root.getCustomData("cke_includeReadonly"));
					var k = CKEDITOR.dtd[f];
					if (!k) {
						h = true;
						k = CKEDITOR.dtd.span
					}
					b.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
					b.trim();
					var n = b.createBookmark(),
						l = n.startNode,
						o = n.endNode,
						m = l,
						p;
					if (!i) {
						var A = b.getCommonAncestor(),
							i = a(l, A),
							A = a(o, A);
						i && (m = i.getNextSourceNode(true));
						A && (o = A)
					}
					for (m.getPosition(o) == CKEDITOR.POSITION_FOLLOWING && (m = 0); m;) {
						i = false;
						if (m.equals(o)) {
							m = null;
							i = true
						} else {
							var t = m.type == CKEDITOR.NODE_ELEMENT ? m.getName() : null,
								A = t && m.getAttribute("contentEditable") == "false",
								q = t && m.getAttribute("data-nostyle");
							if (t && m.data("cke-bookmark")) {
								m = m.getNextSourceNode(true);
								continue
							}
							if (A && j && CKEDITOR.dtd.$block[t])
								for (var x =
									m, w = d(x), u = void 0, z = w.length, v = 0, x = z && new CKEDITOR.dom.range(x.getDocument()); v < z; ++v) {
									var u = w[v],
										B = CKEDITOR.filter.instances[u.data("cke-filter")];
									if (B ? B.check(this) : 1) {
										x.selectNodeContents(u);
										e.call(this, x)
									}
								}
							w = t ? !k[t] || q ? 0 : A && !j ? 0 : (m.getPosition(o) | I) == I && (!g.childRule || g.childRule(m)) : 1;
							if (w)
								if ((w = m.getParent()) && ((w.getDtd() || CKEDITOR.dtd.span)[f] || h) && (!g.parentRule || g.parentRule(w))) {
									if (!p && (!t || !CKEDITOR.dtd.$removeEmpty[t] || (m.getPosition(o) | I) == I)) {
										p = b.clone();
										p.setStartBefore(m)
									}
									t = m.type;
									if (t == CKEDITOR.NODE_TEXT || A || t == CKEDITOR.NODE_ELEMENT && !m.getChildCount()) {
										for (var t = m, Y;
											(i = !t.getNext(D)) && (Y = t.getParent(), k[Y.getName()]) && (Y.getPosition(l) | K) == K && (!g.childRule || g.childRule(Y));) t = Y;
										p.setEndAfter(t)
									}
								} else i = true;
							else i = true;
							m = m.getNextSourceNode(q || A)
						} if (i && p && !p.collapsed) {
							for (var i = s(this, c), A = i.hasAttributes(), q = p.getCommonAncestor(), t = {}, w = {}, u = {}, z = {}, V, R, $; i && q;) {
								if (q.getName() == f) {
									for (V in g.attributes)
										if (!z[V] && ($ = q.getAttribute(R))) i.getAttribute(V) == $ ? w[V] = 1 : z[V] = 1;
									for (R in g.styles)
										if (!u[R] && ($ = q.getStyle(R))) i.getStyle(R) == $ ? t[R] = 1 : u[R] = 1
								}
								q = q.getParent()
							}
							for (V in w) i.removeAttribute(V);
							for (R in t) i.removeStyle(R);
							A && !i.hasAttributes() && (i = null);
							if (i) {
								p.extractContents().appendTo(i);
								p.insertNode(i);
								r.call(this, i);
								i.mergeSiblings();
								CKEDITOR.env.ie || i.$.normalize()
							} else {
								i = new CKEDITOR.dom.element("span");
								p.extractContents().appendTo(i);
								p.insertNode(i);
								r.call(this, i);
								i.remove(true)
							}
							p = null
						}
					}
					b.moveToBookmark(n);
					b.shrink(CKEDITOR.SHRINK_TEXT);
					b.shrink(CKEDITOR.NODE_ELEMENT,
						true)
				}
			}

			function b(a) {
				function b() {
					for (var a = new CKEDITOR.dom.elementPath(d.getParent()), c = new CKEDITOR.dom.elementPath(j.getParent()), f = null, e = null, g = 0; g < a.elements.length; g++) {
						var h = a.elements[g];
						if (h == a.block || h == a.blockLimit) break;
						k.checkElementRemovable(h) && (f = h)
					}
					for (g = 0; g < c.elements.length; g++) {
						h = c.elements[g];
						if (h == c.block || h == c.blockLimit) break;
						k.checkElementRemovable(h) && (e = h)
					}
					e && j.breakParent(e);
					f && d.breakParent(f)
				}
				a.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
				var c = a.createBookmark(),
					d = c.startNode;
				if (a.collapsed) {
					for (var f = new CKEDITOR.dom.elementPath(d.getParent(), a.root), e, g = 0, h; g < f.elements.length && (h = f.elements[g]); g++) {
						if (h == f.block || h == f.blockLimit) break;
						if (this.checkElementRemovable(h)) {
							var i;
							if (a.collapsed && (a.checkBoundaryOfElement(h, CKEDITOR.END) || (i = a.checkBoundaryOfElement(h, CKEDITOR.START)))) {
								e = h;
								e.match = i ? "start" : "end"
							} else {
								h.mergeSiblings();
								h.is(this.element) ? o.call(this, h) : l(h, x(this)[h.getName()])
							}
						}
					}
					if (e) {
						h = d;
						for (g = 0;; g++) {
							i = f.elements[g];
							if (i.equals(e)) break;
							else if (i.match) continue;
							else i = i.clone();
							i.append(h);
							h = i
						}
						h[e.match == "start" ? "insertBefore" : "insertAfter"](e)
					}
				} else {
					var j = c.endNode,
						k = this;
					b();
					for (f = d; !f.equals(j);) {
						e = f.getNextSourceNode();
						if (f.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable(f)) {
							f.getName() == this.element ? o.call(this, f) : l(f, x(this)[f.getName()]);
							if (e.type == CKEDITOR.NODE_ELEMENT && e.contains(d)) {
								b();
								e = d.getNext()
							}
						}
						f = e
					}
				}
				a.moveToBookmark(c);
				a.shrink(CKEDITOR.NODE_ELEMENT, true)
			}

			function d(a) {
				var b = [];
				a.forEach(function(a) {
					if (a.getAttribute("contenteditable") ==
						"true") {
						b.push(a);
						return false
					}
				}, CKEDITOR.NODE_ELEMENT, true);
				return b
			}

			function f(a) {
				var b = a.getEnclosedNode() || a.getCommonAncestor(false, true);
				(a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) && !a.isReadOnly() && t(a, this)
			}

			function c(a) {
				var b = a.getCommonAncestor(true, true);
				if (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) {
					var b = this._.definition,
						c = b.attributes;
					if (c)
						for (var d in c) a.removeAttribute(d, c[d]);
					if (b.styles)
						for (var f in b.styles) b.styles.hasOwnProperty(f) &&
							a.removeStyle(f)
				}
			}

			function h(a) {
				var b = a.createBookmark(true),
					c = a.createIterator();
				c.enforceRealBlocks = true;
				if (this._.enterMode) c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
				for (var d, f = a.document, e; d = c.getNextParagraph();)
					if (!d.isReadOnly() && (c.activeFilter ? c.activeFilter.check(this) : 1)) {
						e = s(this, f, d);
						g(d, e)
					}
				a.moveToBookmark(b)
			}

			function j(a) {
				var b = a.createBookmark(1),
					c = a.createIterator();
				c.enforceRealBlocks = true;
				c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
				for (var d, f; d = c.getNextParagraph();)
					if (this.checkElementRemovable(d))
						if (d.is("pre")) {
							(f =
								this._.enterMode == CKEDITOR.ENTER_BR ? null : a.document.createElement(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div")) && d.copyAttributes(f);
							g(d, f)
						} else o.call(this, d);
				a.moveToBookmark(b)
			}

			function g(a, b) {
				var c = !b;
				if (c) {
					b = a.getDocument().createElement("div");
					a.copyAttributes(b)
				}
				var d = b && b.is("pre"),
					f = a.is("pre"),
					e = !d && f;
				if (d && !f) {
					f = b;
					(e = a.getBogus()) && e.remove();
					e = a.getHtml();
					e = k(e, /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, "");
					e = e.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, "$1");
					e = e.replace(/([ \t\n\r]+|&nbsp;)/g,
						" ");
					e = e.replace(/<br\b[^>]*>/gi, "\n");
					if (CKEDITOR.env.ie) {
						var g = a.getDocument().createElement("div");
						g.append(f);
						f.$.outerHTML = "<pre>" + e + "</pre>";
						f.copyAttributes(g.getFirst());
						f = g.getFirst().remove()
					} else f.setHtml(e);
					b = f
				} else e ? b = n(c ? [a.getHtml()] : i(a), b) : a.moveChildren(b);
				b.replace(a);
				if (d) {
					var c = b,
						h;
					if ((h = c.getPrevious(A)) && h.type == CKEDITOR.NODE_ELEMENT && h.is("pre")) {
						d = k(h.getHtml(), /\n$/, "") + "\n\n" + k(c.getHtml(), /^\n/, "");
						CKEDITOR.env.ie ? c.$.outerHTML = "<pre>" + d + "</pre>" : c.setHtml(d);
						h.remove()
					}
				} else c &&
					m(b)
			}

			function i(a) {
				a.getName();
				var b = [];
				k(a.getOuterHtml(), /(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi, function(a, b, c) {
					return b + "</pre>" + c + "<pre>"
				}).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi, function(a, c) {
					b.push(c)
				});
				return b
			}

			function k(a, b, c) {
				var d = "",
					f = "",
					a = a.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi, function(a, b, c) {
						b && (d = b);
						c && (f = c);
						return ""
					});
				return d + a.replace(b, c) + f
			}

			function n(a, b) {
				var c;
				a.length > 1 && (c = new CKEDITOR.dom.documentFragment(b.getDocument()));
				for (var d = 0; d < a.length; d++) {
					var f = a[d],
						f = f.replace(/(\r\n|\r)/g, "\n"),
						f = k(f, /^[ \t]*\n/, ""),
						f = k(f, /\n$/, ""),
						f = k(f, /^[ \t]+|[ \t]+$/g, function(a, b) {
							return a.length == 1 ? "&nbsp;" : b ? " " + CKEDITOR.tools.repeat("&nbsp;", a.length - 1) : CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
						}),
						f = f.replace(/\n/g, "<br>"),
						f = f.replace(/[ \t]{2,}/g, function(a) {
							return CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
						});
					if (c) {
						var e = b.clone();
						e.setHtml(f);
						c.append(e)
					} else b.setHtml(f)
				}
				return c || b
			}

			function o(a, b) {
				var c = this._.definition,
					d = c.attributes,
					c = c.styles,
					f = x(this)[a.getName()],
					e = CKEDITOR.tools.isEmpty(d) && CKEDITOR.tools.isEmpty(c),
					g;
				for (g in d)
					if (!((g == "class" || this._.definition.fullMatch) && a.getAttribute(g) != q(g, d[g])) && !(b && g.slice(0, 5) == "data-")) {
						e = a.hasAttribute(g);
						a.removeAttribute(g)
					}
				for (var h in c)
					if (!(this._.definition.fullMatch && a.getStyle(h) != q(h, c[h], true))) {
						e = e || !!a.getStyle(h);
						a.removeStyle(h)
					}
				l(a, f, B[a.getName()]);
				e && (this._.definition.alwaysRemoveElement ? m(a, 1) : !CKEDITOR.dtd.$block[a.getName()] || this._.enterMode ==
					CKEDITOR.ENTER_BR && !a.hasAttributes() ? m(a) : a.renameNode(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div"))
			}

			function r(a) {
				for (var b = x(this), c = a.getElementsByTag(this.element), d, f = c.count(); --f >= 0;) {
					d = c.getItem(f);
					d.isReadOnly() || o.call(this, d, true)
				}
				for (var e in b)
					if (e != this.element) {
						c = a.getElementsByTag(e);
						for (f = c.count() - 1; f >= 0; f--) {
							d = c.getItem(f);
							d.isReadOnly() || l(d, b[e])
						}
					}
			}

			function l(a, b, c) {
				if (b = b && b.attributes)
					for (var d = 0; d < b.length; d++) {
						var f = b[d][0],
							e;
						if (e = a.getAttribute(f)) {
							var g = b[d][1];
							(g === null ||
								g.test && g.test(e) || typeof g == "string" && e == g) && a.removeAttribute(f)
						}
					}
				c || m(a)
			}

			function m(a, b) {
				if (!a.hasAttributes() || b)
					if (CKEDITOR.dtd.$block[a.getName()]) {
						var c = a.getPrevious(A),
							d = a.getNext(A);
						c && (c.type == CKEDITOR.NODE_TEXT || !c.isBlockBoundary({
							br: 1
						})) && a.append("br", 1);
						d && (d.type == CKEDITOR.NODE_TEXT || !d.isBlockBoundary({
							br: 1
						})) && a.append("br");
						a.remove(true)
					} else {
						c = a.getFirst();
						d = a.getLast();
						a.remove(true);
						if (c) {
							c.type == CKEDITOR.NODE_ELEMENT && c.mergeSiblings();
							d && (!c.equals(d) && d.type == CKEDITOR.NODE_ELEMENT) &&
								d.mergeSiblings()
						}
					}
			}

			function s(a, b, c) {
				var d;
				d = a.element;
				d == "*" && (d = "span");
				d = new CKEDITOR.dom.element(d, b);
				c && c.copyAttributes(d);
				d = t(d, a);
				b.getCustomData("doc_processing_style") && d.hasAttribute("id") ? d.removeAttribute("id") : b.setCustomData("doc_processing_style", 1);
				return d
			}

			function t(a, b) {
				var c = b._.definition,
					d = c.attributes,
					c = CKEDITOR.style.getStyleText(c);
				if (d)
					for (var f in d) a.setAttribute(f, d[f]);
				c && a.setAttribute("style", c);
				return a
			}

			function p(a, b) {
				for (var c in a) a[c] = a[c].replace(w, function(a,
					c) {
					return b[c]
				})
			}

			function x(a) {
				if (a._.overrides) return a._.overrides;
				var b = a._.overrides = {},
					c = a._.definition.overrides;
				if (c) {
					CKEDITOR.tools.isArray(c) || (c = [c]);
					for (var d = 0; d < c.length; d++) {
						var f = c[d],
							e, g;
						if (typeof f == "string") e = f.toLowerCase();
						else {
							e = f.element ? f.element.toLowerCase() : a.element;
							g = f.attributes
						}
						f = b[e] || (b[e] = {});
						if (g) {
							var f = f.attributes = f.attributes || [],
								h;
							for (h in g) f.push([h.toLowerCase(), g[h]])
						}
					}
				}
				return b
			}

			function q(a, b, c) {
				var d = new CKEDITOR.dom.element("span");
				d[c ? "setStyle" : "setAttribute"](a,
					b);
				return d[c ? "getStyle" : "getAttribute"](a)
			}

			function u(a, b, c) {
				for (var d = a.document, f = a.getRanges(), b = b ? this.removeFromRange : this.applyToRange, e, g = f.createIterator(); e = g.getNextRange();) b.call(this, e, c);
				a.selectRanges(f);
				d.removeCustomData("doc_processing_style")
			}
			var B = {
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
				},
				v = {
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
				},
				z = /\s*(?:;\s*|$)/,
				w = /#\((.+?)\)/g,
				D = CKEDITOR.dom.walker.bookmark(0, 1),
				A = CKEDITOR.dom.walker.whitespaces(1);
			CKEDITOR.style = function(a, b) {
				if (typeof a.type == "string") return new CKEDITOR.style.customHandlers[a.type](a);
				var c = a.attributes;
				if (c && c.style) {
					a.styles = CKEDITOR.tools.extend({}, a.styles, CKEDITOR.tools.parseCssText(c.style));
					delete c.style
				}
				if (b) {
					a = CKEDITOR.tools.clone(a);
					p(a.attributes,
						b);
					p(a.styles, b)
				}
				c = this.element = a.element ? typeof a.element == "string" ? a.element.toLowerCase() : a.element : "*";
				this.type = a.type || (B[c] ? CKEDITOR.STYLE_BLOCK : v[c] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE);
				if (typeof this.element == "object") this.type = CKEDITOR.STYLE_OBJECT;
				this._ = {
					definition: a
				}
			};
			CKEDITOR.style.prototype = {
				apply: function(a) {
					if (a instanceof CKEDITOR.dom.document) return u.call(this, a.getSelection());
					if (this.checkApplicable(a.elementPath(), a)) {
						var b = this._.enterMode;
						if (!b) this._.enterMode = a.activeEnterMode;
						u.call(this, a.getSelection(), 0, a);
						this._.enterMode = b
					}
				},
				remove: function(a) {
					if (a instanceof CKEDITOR.dom.document) return u.call(this, a.getSelection(), 1);
					if (this.checkApplicable(a.elementPath(), a)) {
						var b = this._.enterMode;
						if (!b) this._.enterMode = a.activeEnterMode;
						u.call(this, a.getSelection(), 1, a);
						this._.enterMode = b
					}
				},
				applyToRange: function(a) {
					this.applyToRange = this.type == CKEDITOR.STYLE_INLINE ? e : this.type == CKEDITOR.STYLE_BLOCK ? h : this.type == CKEDITOR.STYLE_OBJECT ? f : null;
					return this.applyToRange(a)
				},
				removeFromRange: function(a) {
					this.removeFromRange =
						this.type == CKEDITOR.STYLE_INLINE ? b : this.type == CKEDITOR.STYLE_BLOCK ? j : this.type == CKEDITOR.STYLE_OBJECT ? c : null;
					return this.removeFromRange(a)
				},
				applyToObject: function(a) {
					t(a, this)
				},
				checkActive: function(a, b) {
					switch (this.type) {
						case CKEDITOR.STYLE_BLOCK:
							return this.checkElementRemovable(a.block || a.blockLimit, true, b);
						case CKEDITOR.STYLE_OBJECT:
						case CKEDITOR.STYLE_INLINE:
							for (var c = a.elements, d = 0, f; d < c.length; d++) {
								f = c[d];
								if (!(this.type == CKEDITOR.STYLE_INLINE && (f == a.block || f == a.blockLimit))) {
									if (this.type ==
										CKEDITOR.STYLE_OBJECT) {
										var e = f.getName();
										if (!(typeof this.element == "string" ? e == this.element : e in this.element)) continue
									}
									if (this.checkElementRemovable(f, true, b)) return true
								}
							}
					}
					return false
				},
				checkApplicable: function(a, b, c) {
					b && b instanceof CKEDITOR.filter && (c = b);
					if (c && !c.check(this)) return false;
					switch (this.type) {
						case CKEDITOR.STYLE_OBJECT:
							return !!a.contains(this.element);
						case CKEDITOR.STYLE_BLOCK:
							return !!a.blockLimit.getDtd()[this.element]
					}
					return true
				},
				checkElementMatch: function(a, b) {
					var c = this._.definition;
					if (!a || !c.ignoreReadonly && a.isReadOnly()) return false;
					var d = a.getName();
					if (typeof this.element == "string" ? d == this.element : d in this.element) {
						if (!b && !a.hasAttributes()) return true;
						if (d = c._AC) c = d;
						else {
							var d = {},
								f = 0,
								e = c.attributes;
							if (e)
								for (var g in e) {
									f++;
									d[g] = e[g]
								}
							if (g = CKEDITOR.style.getStyleText(c)) {
								d.style || f++;
								d.style = g
							}
							d._length = f;
							c = c._AC = d
						} if (c._length) {
							for (var h in c)
								if (h != "_length") {
									f = a.getAttribute(h) || "";
									if (h == "style") a: {
										d = c[h];
										typeof d == "string" && (d = CKEDITOR.tools.parseCssText(d));
										typeof f ==
											"string" && (f = CKEDITOR.tools.parseCssText(f, true));
										g = void 0;
										for (g in d)
											if (!(g in f && (f[g] == d[g] || d[g] == "inherit" || f[g] == "inherit"))) {
												d = false;
												break a
											}
										d = true
									} else d = c[h] == f;
									if (d) {
										if (!b) return true
									} else if (b) return false
								}
							if (b) return true
						} else return true
					}
					return false
				},
				checkElementRemovable: function(a, b, c) {
					if (this.checkElementMatch(a, b, c)) return true;
					if (b = x(this)[a.getName()]) {
						var d;
						if (!(b = b.attributes)) return true;
						for (c = 0; c < b.length; c++) {
							d = b[c][0];
							if (d = a.getAttribute(d)) {
								var f = b[c][1];
								if (f === null || typeof f ==
									"string" && d == f || f.test(d)) return true
							}
						}
					}
					return false
				},
				buildPreview: function(a) {
					var b = this._.definition,
						c = [],
						d = b.element;
					d == "bdo" && (d = "span");
					var c = ["<", d],
						f = b.attributes;
					if (f)
						for (var e in f) c.push(" ", e, '="', f[e], '"');
					(f = CKEDITOR.style.getStyleText(b)) && c.push(' style="', f, '"');
					c.push(">", a || b.name, "</", d, ">");
					return c.join("")
				},
				getDefinition: function() {
					return this._.definition
				}
			};
			CKEDITOR.style.getStyleText = function(a) {
				var b = a._ST;
				if (b) return b;
				var b = a.styles,
					c = a.attributes && a.attributes.style || "",
					d = "";
				c.length && (c = c.replace(z, ";"));
				for (var f in b) {
					var e = b[f],
						g = (f + ":" + e).replace(z, ";");
					e == "inherit" ? d = d + g : c = c + g
				}
				c.length && (c = CKEDITOR.tools.normalizeCssText(c, true));
				return a._ST = c + d
			};
			CKEDITOR.style.customHandlers = {};
			CKEDITOR.style.addCustomHandler = function(a) {
				var b = function(a) {
					this._ = {
						definition: a
					};
					this.setup && this.setup(a)
				};
				b.prototype = CKEDITOR.tools.extend(CKEDITOR.tools.prototypedCopy(CKEDITOR.style.prototype), {
					assignedTo: CKEDITOR.STYLE_OBJECT
				}, a, true);
				return this.customHandlers[a.type] = b
			};
			var I = CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED,
				K = CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED
		}(), CKEDITOR.styleCommand = function(a, e) {
			this.requiredContent = this.allowedContent = this.style = a;
			CKEDITOR.tools.extend(this, e, true)
		}, CKEDITOR.styleCommand.prototype.exec = function(a) {
			a.focus();
			this.state == CKEDITOR.TRISTATE_OFF ? a.applyStyle(this.style) : this.state == CKEDITOR.TRISTATE_ON && a.removeStyle(this.style)
		}, CKEDITOR.stylesSet =
		new CKEDITOR.resourceManager("", "stylesSet"), CKEDITOR.addStylesSet = CKEDITOR.tools.bind(CKEDITOR.stylesSet.add, CKEDITOR.stylesSet), CKEDITOR.loadStylesSet = function(a, e, b) {
			CKEDITOR.stylesSet.addExternal(a, e, "");
			CKEDITOR.stylesSet.load(a, b)
		}, CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
			attachStyleStateChange: function(a, e) {
				var b = this._.styleStateChangeCallbacks;
				if (!b) {
					b = this._.styleStateChangeCallbacks = [];
					this.on("selectionChange", function(a) {
						for (var f = 0; f < b.length; f++) {
							var c = b[f],
								e = c.style.checkActive(a.data.path,
									this) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
							c.fn.call(this, e)
						}
					})
				}
				b.push({
					style: a,
					fn: e
				})
			},
			applyStyle: function(a) {
				a.apply(this)
			},
			removeStyle: function(a) {
				a.remove(this)
			},
			getStylesSet: function(a) {
				if (this._.stylesDefinitions) a(this._.stylesDefinitions);
				else {
					var e = this,
						b = e.config.stylesCombo_stylesSet || e.config.stylesSet;
					if (b === false) a(null);
					else if (b instanceof Array) {
						e._.stylesDefinitions = b;
						a(b)
					} else {
						b || (b = "default");
						var b = b.split(":"),
							d = b[0];
						CKEDITOR.stylesSet.addExternal(d, b[1] ? b.slice(1).join(":") :
							CKEDITOR.getUrl("styles.js"), "");
						CKEDITOR.stylesSet.load(d, function(b) {
							e._.stylesDefinitions = b[d];
							a(e._.stylesDefinitions)
						})
					}
				}
			}
		}), CKEDITOR.dom.comment = function(a, e) {
			typeof a == "string" && (a = (e ? e.$ : document).createComment(a));
			CKEDITOR.dom.domObject.call(this, a)
		}, CKEDITOR.dom.comment.prototype = new CKEDITOR.dom.node, CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype, {
			type: CKEDITOR.NODE_COMMENT,
			getOuterHtml: function() {
				return "<\!--" + this.$.nodeValue + "--\>"
			}
		}), "use strict",
		function() {
			var a = {},
				e = {},
				b;
			for (b in CKEDITOR.dtd.$blockLimit) b in
				CKEDITOR.dtd.$list || (a[b] = 1);
			for (b in CKEDITOR.dtd.$block) b in CKEDITOR.dtd.$blockLimit || b in CKEDITOR.dtd.$empty || (e[b] = 1);
			CKEDITOR.dom.elementPath = function(b, f) {
				var c = null,
					h = null,
					j = [],
					g = b,
					i, f = f || b.getDocument().getBody();
				do
					if (g.type == CKEDITOR.NODE_ELEMENT) {
						j.push(g);
						if (!this.lastElement) {
							this.lastElement = g;
							if (g.is(CKEDITOR.dtd.$object) || g.getAttribute("contenteditable") == "false") continue
						}
						if (g.equals(f)) break;
						if (!h) {
							i = g.getName();
							g.getAttribute("contenteditable") == "true" ? h = g : !c && e[i] && (c = g);
							if (a[i]) {
								var k;
								if (k = !c) {
									if (i = i == "div") {
										a: {
											i = g.getChildren();
											k = 0;
											for (var n = i.count(); k < n; k++) {
												var o = i.getItem(k);
												if (o.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$block[o.getName()]) {
													i = true;
													break a
												}
											}
											i = false
										}
										i = !i
									}
									k = i
								}
								k ? c = g : h = g
							}
						}
					}
				while (g = g.getParent());
				h || (h = f);
				this.block = c;
				this.blockLimit = h;
				this.root = f;
				this.elements = j
			}
		}(), CKEDITOR.dom.elementPath.prototype = {
			compare: function(a) {
				var e = this.elements,
					a = a && a.elements;
				if (!a || e.length != a.length) return false;
				for (var b = 0; b < e.length; b++)
					if (!e[b].equals(a[b])) return false;
				return true
			},
			contains: function(a, e, b) {
				var d;
				typeof a == "string" && (d = function(b) {
					return b.getName() == a
				});
				a instanceof CKEDITOR.dom.element ? d = function(b) {
					return b.equals(a)
				} : CKEDITOR.tools.isArray(a) ? d = function(b) {
					return CKEDITOR.tools.indexOf(a, b.getName()) > -1
				} : typeof a == "function" ? d = a : typeof a == "object" && (d = function(b) {
					return b.getName() in a
				});
				var f = this.elements,
					c = f.length;
				e && c--;
				if (b) {
					f = Array.prototype.slice.call(f, 0);
					f.reverse()
				}
				for (e = 0; e < c; e++)
					if (d(f[e])) return f[e];
				return null
			},
			isContextFor: function(a) {
				var e;
				if (a in CKEDITOR.dtd.$block) {
					e = this.contains(CKEDITOR.dtd.$intermediate) || this.root.equals(this.block) && this.block || this.blockLimit;
					return !!e.getDtd()[a]
				}
				return true
			},
			direction: function() {
				return (this.block || this.blockLimit || this.root).getDirection(1)
			}
		}, CKEDITOR.dom.text = function(a, e) {
			typeof a == "string" && (a = (e ? e.$ : document).createTextNode(a));
			this.$ = a
		}, CKEDITOR.dom.text.prototype = new CKEDITOR.dom.node, CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype, {
			type: CKEDITOR.NODE_TEXT,
			getLength: function() {
				return this.$.nodeValue.length
			},
			getText: function() {
				return this.$.nodeValue
			},
			setText: function(a) {
				this.$.nodeValue = a
			},
			split: function(a) {
				var e = this.$.parentNode,
					b = e.childNodes.length,
					d = this.getLength(),
					f = this.getDocument(),
					c = new CKEDITOR.dom.text(this.$.splitText(a), f);
				if (e.childNodes.length == b)
					if (a >= d) {
						c = f.createText("");
						c.insertAfter(this)
					} else {
						a = f.createText("");
						a.insertAfter(c);
						a.remove()
					}
				return c
			},
			substring: function(a, e) {
				return typeof e != "number" ? this.$.nodeValue.substr(a) : this.$.nodeValue.substring(a, e)
			}
		}),
		function() {
			function a(a,
				d, f) {
				var c = a.serializable,
					e = d[f ? "endContainer" : "startContainer"],
					j = f ? "endOffset" : "startOffset",
					g = c ? d.document.getById(a.startNode) : a.startNode,
					a = c ? d.document.getById(a.endNode) : a.endNode;
				if (e.equals(g.getPrevious())) {
					d.startOffset = d.startOffset - e.getLength() - a.getPrevious().getLength();
					e = a.getNext()
				} else if (e.equals(a.getPrevious())) {
					d.startOffset = d.startOffset - e.getLength();
					e = a.getNext()
				}
				e.equals(g.getParent()) && d[j] ++;
				e.equals(a.getParent()) && d[j] ++;
				d[f ? "endContainer" : "startContainer"] = e;
				return d
			}
			CKEDITOR.dom.rangeList = function(a) {
				if (a instanceof CKEDITOR.dom.rangeList) return a;
				a ? a instanceof CKEDITOR.dom.range && (a = [a]) : a = [];
				return CKEDITOR.tools.extend(a, e)
			};
			var e = {
				createIterator: function() {
					var a = this,
						d = CKEDITOR.dom.walker.bookmark(),
						f = [],
						c;
					return {
						getNextRange: function(e) {
							c = c == void 0 ? 0 : c + 1;
							var j = a[c];
							if (j && a.length > 1) {
								if (!c)
									for (var g = a.length - 1; g >= 0; g--) f.unshift(a[g].createBookmark(true));
								if (e)
									for (var i = 0; a[c + i + 1];) {
										for (var k = j.document, e = 0, g = k.getById(f[i].endNode), k = k.getById(f[i + 1].startNode);;) {
											g =
												g.getNextSourceNode(false);
											if (k.equals(g)) e = 1;
											else if (d(g) || g.type == CKEDITOR.NODE_ELEMENT && g.isBlockBoundary()) continue;
											break
										}
										if (!e) break;
										i++
									}
								for (j.moveToBookmark(f.shift()); i--;) {
									g = a[++c];
									g.moveToBookmark(f.shift());
									j.setEnd(g.endContainer, g.endOffset)
								}
							}
							return j
						}
					}
				},
				createBookmarks: function(b) {
					for (var d = [], f, c = 0; c < this.length; c++) {
						d.push(f = this[c].createBookmark(b, true));
						for (var e = c + 1; e < this.length; e++) {
							this[e] = a(f, this[e]);
							this[e] = a(f, this[e], true)
						}
					}
					return d
				},
				createBookmarks2: function(a) {
					for (var d = [], f = 0; f < this.length; f++) d.push(this[f].createBookmark2(a));
					return d
				},
				moveToBookmarks: function(a) {
					for (var d = 0; d < this.length; d++) this[d].moveToBookmark(a[d])
				}
			}
		}(),
		function() {
			function a() {
				return CKEDITOR.getUrl(CKEDITOR.skinName.split(",")[1] || "skins/" + CKEDITOR.skinName.split(",")[0] + "/")
			}

			function e(b) {
				var c = CKEDITOR.skin["ua_" + b],
					d = CKEDITOR.env;
				if (c)
					for (var c = c.split(",").sort(function(a, b) {
						return a > b ? -1 : 1
					}), f = 0, e; f < c.length; f++) {
						e = c[f];
						if (d.ie && (e.replace(/^ie/, "") == d.version || d.quirks && e == "iequirks")) e =
							"ie";
						if (d[e]) {
							b = b + ("_" + c[f]);
							break
						}
					}
				return CKEDITOR.getUrl(a() + b + ".css")
			}

			function b(a, b) {
				if (!c[a]) {
					CKEDITOR.document.appendStyleSheet(e(a));
					c[a] = 1
				}
				b && b()
			}

			function d(a) {
				var b = a.getById(h);
				if (!b) {
					b = a.getHead().append("style");
					b.setAttribute("id", h);
					b.setAttribute("type", "text/css")
				}
				return b
			}

			function f(a, b, c) {
				var d, f, e;
				if (CKEDITOR.env.webkit) {
					b = b.split("}").slice(0, -1);
					for (f = 0; f < b.length; f++) b[f] = b[f].split("{")
				}
				for (var g = 0; g < a.length; g++)
					if (CKEDITOR.env.webkit)
						for (f = 0; f < b.length; f++) {
							e = b[f][1];
							for (d =
								0; d < c.length; d++) e = e.replace(c[d][0], c[d][1]);
							a[g].$.sheet.addRule(b[f][0], e)
						} else {
							e = b;
							for (d = 0; d < c.length; d++) e = e.replace(c[d][0], c[d][1]);
							CKEDITOR.env.ie && CKEDITOR.env.version < 11 ? a[g].$.styleSheet.cssText = a[g].$.styleSheet.cssText + e : a[g].$.innerHTML = a[g].$.innerHTML + e
						}
			}
			var c = {};
			CKEDITOR.skin = {
				path: a,
				loadPart: function(c, d) {
					CKEDITOR.skin.name != CKEDITOR.skinName.split(",")[0] ? CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(a() + "skin.js"), function() {
						b(c, d)
					}) : b(c, d)
				},
				getPath: function(a) {
					return CKEDITOR.getUrl(e(a))
				},
				icons: {},
				addIcon: function(a, b, c, d) {
					a = a.toLowerCase();
					this.icons[a] || (this.icons[a] = {
						path: b,
						offset: c || 0,
						bgsize: d || "16px"
					})
				},
				getIconStyle: function(a, b, c, d, f) {
					var e;
					if (a) {
						a = a.toLowerCase();
						b && (e = this.icons[a + "-rtl"]);
						e || (e = this.icons[a])
					}
					a = c || e && e.path || "";
					d = d || e && e.offset;
					f = f || e && e.bgsize || "16px";
					return a && "background-image:url(" + CKEDITOR.getUrl(a) + ");background-position:0 " + d + "px;background-size:" + f + ";"
				}
			};
			CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
				getUiColor: function() {
					return this.uiColor
				},
				setUiColor: function(a) {
					var b =
						d(CKEDITOR.document);
					return (this.setUiColor = function(a) {
						var c = CKEDITOR.skin.chameleon,
							d = [
								[g, a]
							];
						this.uiColor = a;
						f([b], c(this, "editor"), d);
						f(j, c(this, "panel"), d)
					}).call(this, a)
				}
			});
			var h = "cke_ui_color",
				j = [],
				g = /\$color/g;
			CKEDITOR.on("instanceLoaded", function(a) {
				if (!CKEDITOR.env.ie || !CKEDITOR.env.quirks) {
					var b = a.editor,
						a = function(a) {
							a = (a.data[0] || a.data).element.getElementsByTag("iframe").getItem(0).getFrameDocument();
							if (!a.getById("cke_ui_color")) {
								a = d(a);
								j.push(a);
								var c = b.getUiColor();
								c && f([a], CKEDITOR.skin.chameleon(b,
									"panel"), [
									[g, c]
								])
							}
						};
					b.on("panelShow", a);
					b.on("menuShow", a);
					b.config.uiColor && b.setUiColor(b.config.uiColor)
				}
			})
		}(),
		function() {
			if (CKEDITOR.env.webkit) CKEDITOR.env.hc = false;
			else {
				var a = CKEDITOR.dom.element.createFromHtml('<div style="width:0;height:0;position:absolute;left:-10000px;border:1px solid;border-color:red blue"></div>', CKEDITOR.document);
				a.appendTo(CKEDITOR.document.getHead());
				try {
					var e = a.getComputedStyle("border-top-color"),
						b = a.getComputedStyle("border-right-color");
					CKEDITOR.env.hc = !!(e && e ==
						b)
				} catch (d) {
					CKEDITOR.env.hc = false
				}
				a.remove()
			} if (CKEDITOR.env.hc) CKEDITOR.env.cssClass = CKEDITOR.env.cssClass + " cke_hc";
			CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}");
			CKEDITOR.status = "loaded";
			CKEDITOR.fireOnce("loaded");
			if (a = CKEDITOR._.pending) {
				delete CKEDITOR._.pending;
				for (e = 0; e < a.length; e++) {
					CKEDITOR.editor.prototype.constructor.apply(a[e][0], a[e][1]);
					CKEDITOR.add(a[e][0])
				}
			}
		}(), CKEDITOR.skin.name = "alive", CKEDITOR.skin.ua_editor = "ie,iequirks,ie7,ie8,gecko", CKEDITOR.skin.ua_dialog = "ie,iequirks,ie7,ie8",
		CKEDITOR.skin.chameleon = function() {
			var a = function() {
					return function(a, b) {
						for (var c = a.match(/[^#]./g), e = 0; e < 3; e++) {
							var j = c,
								g = e,
								i;
							i = parseInt(c[e], 16);
							i = ("0" + (b < 0 ? 0 | i * (1 + b) : 0 | i + (255 - i) * b).toString(16)).slice(-2);
							j[g] = i
						}
						return "#" + c.join("")
					}
				}(),
				e = function() {
					var a = new CKEDITOR.template("background:#{to};background-image:-webkit-gradient(linear,lefttop,leftbottom,from({from}),to({to}));background-image:-moz-linear-gradient(top,{from},{to});background-image:-webkit-linear-gradient(top,{from},{to});background-image:-o-linear-gradient(top,{from},{to});background-image:-ms-linear-gradient(top,{from},{to});background-image:linear-gradient(top,{from},{to});filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='{from}',endColorstr='{to}');");
					return function(b, c) {
						return a.output({
							from: b,
							to: c
						})
					}
				}(),
				b = {
					editor: new CKEDITOR.template("{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ {defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_bottom [{defaultGradient}border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [{defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [{defaultGradient}outline-color:{defaultBorder};border-top-color:{defaultBorder};] {id} .cke_dialog_tab [{lightGradient}border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [{mediumGradient}] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} .cke_toolgroup [{lightGradient}border-color:{defaultBorder};] {id} a.cke_button_off:hover, {id} a.cke_button_off:focus, {id} a.cke_button_off:active [{mediumGradient}] {id} .cke_button_on [{ckeButtonOn}] {id} .cke_toolbar_separator [background-color: {ckeToolbarSeparator};] {id} .cke_combo_button [border-color:{defaultBorder};{lightGradient}] {id} a.cke_combo_button:hover, {id} a.cke_combo_button:focus, {id} .cke_combo_on a.cke_combo_button [border-color:{defaultBorder};{mediumGradient}] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover, {id} a.cke_path_item:focus, {id} a.cke_path_item:active [background-color:{elementsPathBg};] {id}.cke_panel [border-color:{defaultBorder};] "),
					panel: new CKEDITOR.template(".cke_panel_grouptitle [{lightGradient}border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:focus.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:focus.cke_colorauto, a:focus.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] ")
				};
			return function(d, f) {
				var c = d.uiColor,
					c = {
						id: "." + d.id,
						defaultBorder: a(c, -0.1),
						defaultGradient: e(a(c, 0.9), c),
						lightGradient: e(a(c, 1), a(c, 0.7)),
						mediumGradient: e(a(c, 0.8), a(c, 0.5)),
						ckeButtonOn: e(a(c, 0.6), a(c, 0.7)),
						ckeResizer: a(c, -0.4),
						ckeToolbarSeparator: a(c, 0.5),
						ckeColorauto: a(c, 0.8),
						dialogBody: a(c, 0.7),
						dialogTabSelected: e("#FFFFFF", "#FFFFFF"),
						dialogTabSelectedBorder: "#FFF",
						elementsPathColor: a(c, -0.6),
						elementsPathBg: c,
						menubuttonIcon: a(c, 0.5),
						menubuttonIconHover: a(c, 0.3)
					};
				return b[f].output(c).replace(/\[/g,
					"{").replace(/\]/g, "}")
			}
		}(), CKEDITOR.plugins.add("basicstyles", {
			init: function(a) {
				var e = 0,
					b = function(b, c, f, i) {
						if (i) {
							var i = new CKEDITOR.style(i),
								k = d[f];
							k.unshift(i);
							a.attachStyleStateChange(i, function(b) {
								!a.readOnly && a.getCommand(f).setState(b)
							});
							a.addCommand(f, new CKEDITOR.styleCommand(i, {
								contentForms: k
							}));
							a.ui.addButton && a.ui.addButton(b, {
								label: c,
								command: f,
								toolbar: "basicstyles," + (e = e + 10)
							})
						}
					},
					d = {
						bold: ["strong", "b", ["span",
							function(a) {
								a = a.styles["font-weight"];
								return a == "bold" || +a >= 700
							}
						]],
						italic: ["em",
							"i", ["span",
								function(a) {
									return a.styles["font-style"] == "italic"
								}
							]
						],
						underline: ["u", ["span",
							function(a) {
								return a.styles["text-decoration"] == "underline"
							}
						]],
						strike: ["s", "strike", ["span",
							function(a) {
								return a.styles["text-decoration"] == "line-through"
							}
						]],
						subscript: ["sub"],
						superscript: ["sup"]
					},
					f = a.config,
					c = a.lang.basicstyles;
				b("Bold", c.bold, "bold", f.coreStyles_bold);
				b("Italic", c.italic, "italic", f.coreStyles_italic);
				b("Underline", c.underline, "underline", f.coreStyles_underline);
				b("Strike", c.strike, "strike",
					f.coreStyles_strike);
				b("Subscript", c.subscript, "subscript", f.coreStyles_subscript);
				b("Superscript", c.superscript, "superscript", f.coreStyles_superscript);
				a.setKeystroke([
					[CKEDITOR.CTRL + 66, "bold"],
					[CKEDITOR.CTRL + 73, "italic"],
					[CKEDITOR.CTRL + 85, "underline"]
				])
			}
		}), CKEDITOR.config.coreStyles_bold = {
			element: "strong",
			overrides: "b"
		}, CKEDITOR.config.coreStyles_italic = {
			element: "em",
			overrides: "i"
		}, CKEDITOR.config.coreStyles_underline = {
			element: "u"
		}, CKEDITOR.config.coreStyles_strike = {
			element: "s",
			overrides: "strike"
		},
		CKEDITOR.config.coreStyles_subscript = {
			element: "sub"
		}, CKEDITOR.config.coreStyles_superscript = {
			element: "sup"
		}, CKEDITOR.plugins.add("dialogui", {
			onLoad: function() {
				var a = function(a) {
						this._ || (this._ = {});
						this._["default"] = this._.initValue = a["default"] || "";
						this._.required = a.required || false;
						for (var b = [this._], c = 1; c < arguments.length; c++) b.push(arguments[c]);
						b.push(true);
						CKEDITOR.tools.extend.apply(CKEDITOR.tools, b);
						return this._
					},
					e = {
						build: function(a, b, c) {
							return new CKEDITOR.ui.dialog.textInput(a, b, c)
						}
					},
					b = {
						build: function(a,
							b, c) {
							return new CKEDITOR.ui.dialog[b.type](a, b, c)
						}
					},
					d = {
						isChanged: function() {
							return this.getValue() != this.getInitValue()
						},
						reset: function(a) {
							this.setValue(this.getInitValue(), a)
						},
						setInitValue: function() {
							this._.initValue = this.getValue()
						},
						resetInitValue: function() {
							this._.initValue = this._["default"]
						},
						getInitValue: function() {
							return this._.initValue
						}
					},
					f = CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
						onChange: function(a, b) {
							if (!this._.domOnChangeRegistered) {
								a.on("load", function() {
									this.getInputElement().on("change",
										function() {
											a.parts.dialog.isVisible() && this.fire("change", {
												value: this.getValue()
											})
										}, this)
								}, this);
								this._.domOnChangeRegistered = true
							}
							this.on("change", b)
						}
					}, true),
					c = /^on([A-Z]\w+)/,
					h = function(a) {
						for (var b in a)(c.test(b) || b == "title" || b == "type") && delete a[b];
						return a
					};
				CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {
					labeledElement: function(b, c, d, f) {
						if (!(arguments.length < 4)) {
							var e = a.call(this, c);
							e.labelId = CKEDITOR.tools.getNextId() + "_label";
							this._.children = [];
							CKEDITOR.ui.dialog.uiElement.call(this, b, c, d, "div",
								null, {
									role: "presentation"
								}, function() {
									var a = [],
										d = c.required ? " cke_required" : "";
									if (c.labelLayout != "horizontal") a.push('<label class="cke_dialog_ui_labeled_label' + d + '" ', ' id="' + e.labelId + '"', e.inputId ? ' for="' + e.inputId + '"' : "", (c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">", c.label, "</label>", '<div class="cke_dialog_ui_labeled_content"', c.controlStyle ? ' style="' + c.controlStyle + '"' : "", ' role="radiogroup" aria-labelledby="' + e.labelId + '">', f.call(this, b, c), "</div>");
									else {
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
										CKEDITOR.dialog._.uiElementBuilders.hbox.build(b, d, a)
									}
									return a.join("")
								})
						}
					},
					textInput: function(b, c, d) {
						if (!(arguments.length < 3)) {
							a.call(this,
								c);
							var f = this._.inputId = CKEDITOR.tools.getNextId() + "_textInput",
								e = {
									"class": "cke_dialog_ui_input_" + c.type,
									id: f,
									type: c.type
								};
							if (c.validate) this.validate = c.validate;
							if (c.maxLength) e.maxlength = c.maxLength;
							if (c.size) e.size = c.size;
							if (c.inputStyle) e.style = c.inputStyle;
							var h = this,
								r = false;
							b.on("load", function() {
								h.getInputElement().on("keydown", function(a) {
									a.data.getKeystroke() == 13 && (r = true)
								});
								h.getInputElement().on("keyup", function(a) {
									if (a.data.getKeystroke() == 13 && r) {
										b.getButton("ok") && setTimeout(function() {
												b.getButton("ok").click()
											},
											0);
										r = false
									}
								}, null, null, 1E3)
							});
							CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function() {
								var a = ['<div class="cke_dialog_ui_input_', c.type, '" role="presentation"'];
								c.width && a.push('style="width:' + c.width + '" ');
								a.push("><input ");
								e["aria-labelledby"] = this._.labelId;
								this._.required && (e["aria-required"] = this._.required);
								for (var b in e) a.push(b + '="' + e[b] + '" ');
								a.push(" /></div>");
								return a.join("")
							})
						}
					},
					textarea: function(b, c, d) {
						if (!(arguments.length < 3)) {
							a.call(this, c);
							var f = this,
								e = this._.inputId = CKEDITOR.tools.getNextId() +
								"_textarea",
								h = {};
							if (c.validate) this.validate = c.validate;
							h.rows = c.rows || 5;
							h.cols = c.cols || 20;
							h["class"] = "cke_dialog_ui_input_textarea " + (c["class"] || "");
							if (typeof c.inputStyle != "undefined") h.style = c.inputStyle;
							if (c.dir) h.dir = c.dir;
							CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function() {
								h["aria-labelledby"] = this._.labelId;
								this._.required && (h["aria-required"] = this._.required);
								var a = ['<div class="cke_dialog_ui_input_textarea" role="presentation"><textarea id="', e, '" '],
									b;
								for (b in h) a.push(b + '="' +
									CKEDITOR.tools.htmlEncode(h[b]) + '" ');
								a.push(">", CKEDITOR.tools.htmlEncode(f._["default"]), "</textarea></div>");
								return a.join("")
							})
						}
					},
					checkbox: function(b, c, d) {
						if (!(arguments.length < 3)) {
							var f = a.call(this, c, {
								"default": !!c["default"]
							});
							if (c.validate) this.validate = c.validate;
							CKEDITOR.ui.dialog.uiElement.call(this, b, c, d, "span", null, null, function() {
								var a = CKEDITOR.tools.extend({}, c, {
										id: c.id ? c.id + "_checkbox" : CKEDITOR.tools.getNextId() + "_checkbox"
									}, true),
									d = [],
									e = CKEDITOR.tools.getNextId() + "_label",
									i = {
										"class": "cke_dialog_ui_checkbox_input",
										type: "checkbox",
										"aria-labelledby": e
									};
								h(a);
								if (c["default"]) i.checked = "checked";
								if (typeof a.inputStyle != "undefined") a.style = a.inputStyle;
								f.checkbox = new CKEDITOR.ui.dialog.uiElement(b, a, d, "input", null, i);
								d.push(' <label id="', e, '" for="', i.id, '"' + (c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">", CKEDITOR.tools.htmlEncode(c.label), "</label>");
								return d.join("")
							})
						}
					},
					radio: function(b, c, d) {
						if (!(arguments.length < 3)) {
							a.call(this, c);
							if (!this._["default"]) this._["default"] = this._.initValue = c.items[0][1];
							if (c.validate) this.validate =
								c.valdiate;
							var f = [],
								e = this;
							CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function() {
								for (var a = [], d = [], i = (c.id ? c.id : CKEDITOR.tools.getNextId()) + "_radio", m = 0; m < c.items.length; m++) {
									var s = c.items[m],
										t = s[2] !== void 0 ? s[2] : s[0],
										p = s[1] !== void 0 ? s[1] : s[0],
										x = CKEDITOR.tools.getNextId() + "_radio_input",
										q = x + "_label",
										x = CKEDITOR.tools.extend({}, c, {
											id: x,
											title: null,
											type: null
										}, true),
										t = CKEDITOR.tools.extend({}, x, {
											title: t
										}, true),
										u = {
											type: "radio",
											"class": "cke_dialog_ui_radio_input",
											name: i,
											value: p,
											"aria-labelledby": q
										},
										B = [];
									if (e._["default"] == p) u.checked = "checked";
									h(x);
									h(t);
									if (typeof x.inputStyle != "undefined") x.style = x.inputStyle;
									x.keyboardFocusable = true;
									f.push(new CKEDITOR.ui.dialog.uiElement(b, x, B, "input", null, u));
									B.push(" ");
									new CKEDITOR.ui.dialog.uiElement(b, t, B, "label", null, {
										id: q,
										"for": u.id
									}, s[0]);
									a.push(B.join(""))
								}
								new CKEDITOR.ui.dialog.hbox(b, f, a, d);
								return d.join("")
							});
							this._.children = f
						}
					},
					button: function(b, c, d) {
						if (arguments.length) {
							typeof c == "function" && (c = c(b.getParentEditor()));
							a.call(this, c, {
								disabled: c.disabled ||
									false
							});
							CKEDITOR.event.implementOn(this);
							var f = this;
							b.on("load", function() {
								var a = this.getElement();
								(function() {
									a.on("click", function(a) {
										f.click();
										a.data.preventDefault()
									});
									a.on("keydown", function(a) {
										if (a.data.getKeystroke() in {
											32: 1
										}) {
											f.click();
											a.data.preventDefault()
										}
									})
								})();
								a.unselectable()
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
							}, '<span id="' + h + '" class="cke_dialog_ui_button">' + CKEDITOR.tools.htmlEncode(c.label) + "</span>")
						}
					},
					select: function(b, c, d) {
						if (!(arguments.length < 3)) {
							var f = a.call(this, c);
							if (c.validate) this.validate = c.validate;
							f.inputId = CKEDITOR.tools.getNextId() + "_select";
							CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function() {
								var a = CKEDITOR.tools.extend({}, c, {
										id: c.id ? c.id + "_select" : CKEDITOR.tools.getNextId() + "_select"
									}, true),
									d = [],
									e = [],
									i = {
										id: f.inputId,
										"class": "cke_dialog_ui_input_select",
										"aria-labelledby": this._.labelId
									};
								d.push('<div class="cke_dialog_ui_input_', c.type, '" role="presentation"');
								c.width && d.push('style="width:' + c.width + '" ');
								d.push(">");
								if (c.size != void 0) i.size = c.size;
								if (c.multiple != void 0) i.multiple = c.multiple;
								h(a);
								for (var m = 0, s; m < c.items.length && (s = c.items[m]); m++) e.push('<option value="', CKEDITOR.tools.htmlEncode(s[1] !== void 0 ? s[1] : s[0]).replace(/"/g, "&quot;"), '" /> ', CKEDITOR.tools.htmlEncode(s[0]));
								if (typeof a.inputStyle != "undefined") a.style = a.inputStyle;
								f.select =
									new CKEDITOR.ui.dialog.uiElement(b, a, d, "select", null, i, e.join(""));
								d.push("</div>");
								return d.join("")
							})
						}
					},
					file: function(b, c, d) {
						if (!(arguments.length < 3)) {
							c["default"] === void 0 && (c["default"] = "");
							var f = CKEDITOR.tools.extend(a.call(this, c), {
								definition: c,
								buttons: []
							});
							if (c.validate) this.validate = c.validate;
							b.on("load", function() {
								CKEDITOR.document.getById(f.frameId).getParent().addClass("cke_dialog_ui_input_file")
							});
							CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function() {
								f.frameId = CKEDITOR.tools.getNextId() +
									"_fileInput";
								var a = ['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" role="presentation" id="', f.frameId, '" title="', c.label, '" src="javascript:void('];
								a.push(CKEDITOR.env.ie ? "(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "})()" : "0");
								a.push(')"></iframe>');
								return a.join("")
							})
						}
					},
					fileButton: function(b, c, d) {
						if (!(arguments.length < 3)) {
							a.call(this, c);
							var f = this;
							if (c.validate) this.validate = c.validate;
							var e = CKEDITOR.tools.extend({},
									c),
								h = e.onClick;
							e.className = (e.className ? e.className + " " : "") + "cke_dialog_ui_button";
							e.onClick = function(a) {
								var d = c["for"];
								if (!h || h.call(this, a) !== false) {
									b.getContentElement(d[0], d[1]).submit();
									this.disable()
								}
							};
							b.on("load", function() {
								b.getContentElement(c["for"][0], c["for"][1])._.buttons.push(f)
							});
							CKEDITOR.ui.dialog.button.call(this, b, e, d)
						}
					},
					html: function() {
						var a = /^\s*<[\w:]+\s+([^>]*)?>/,
							b = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/,
							c = /\/$/;
						return function(d, f, e) {
							if (!(arguments.length < 3)) {
								var h = [],
									l = f.html;
								l.charAt(0) != "<" && (l = "<span>" + l + "</span>");
								var m = f.focus;
								if (m) {
									var s = this.focus;
									this.focus = function() {
										(typeof m == "function" ? m : s).call(this);
										this.fire("focus")
									};
									if (f.isFocusable) this.isFocusable = this.isFocusable;
									this.keyboardFocusable = true
								}
								CKEDITOR.ui.dialog.uiElement.call(this, d, f, h, "span", null, null, "");
								h = h.join("").match(a);
								l = l.match(b) || ["", "", ""];
								if (c.test(l[1])) {
									l[1] = l[1].slice(0, -1);
									l[2] = "/" + l[2]
								}
								e.push([l[1], " ", h[1] || "", l[2]].join(""))
							}
						}
					}(),
					fieldset: function(a, b, c, d, f) {
						var e = f.label;
						this._ = {
							children: b
						};
						CKEDITOR.ui.dialog.uiElement.call(this, a, f, d, "fieldset", null, null, function() {
							var a = [];
							e && a.push("<legend" + (f.labelStyle ? ' style="' + f.labelStyle + '"' : "") + ">" + e + "</legend>");
							for (var b = 0; b < c.length; b++) a.push(c[b]);
							return a.join("")
						})
					}
				}, true);
				CKEDITOR.ui.dialog.html.prototype = new CKEDITOR.ui.dialog.uiElement;
				CKEDITOR.ui.dialog.labeledElement.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
					setLabel: function(a) {
						var b = CKEDITOR.document.getById(this._.labelId);
						b.getChildCount() <
							1 ? (new CKEDITOR.dom.text(a, CKEDITOR.document)).appendTo(b) : b.getChild(0).$.nodeValue = a;
						return this
					},
					getLabel: function() {
						var a = CKEDITOR.document.getById(this._.labelId);
						return !a || a.getChildCount() < 1 ? "" : a.getChild(0).getText()
					},
					eventProcessors: f
				}, true);
				CKEDITOR.ui.dialog.button.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
					click: function() {
						return !this._.disabled ? this.fire("click", {
							dialog: this._.dialog
						}) : false
					},
					enable: function() {
						this._.disabled = false;
						var a = this.getElement();
						a && a.removeClass("cke_disabled")
					},
					disable: function() {
						this._.disabled = true;
						this.getElement().addClass("cke_disabled")
					},
					isVisible: function() {
						return this.getElement().getFirst().isVisible()
					},
					isEnabled: function() {
						return !this._.disabled
					},
					eventProcessors: CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
						onClick: function(a, b) {
							this.on("click", function() {
								b.apply(this, arguments)
							})
						}
					}, true),
					accessKeyUp: function() {
						this.click()
					},
					accessKeyDown: function() {
						this.focus()
					},
					keyboardFocusable: true
				}, true);
				CKEDITOR.ui.dialog.textInput.prototype =
					CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
						getInputElement: function() {
							return CKEDITOR.document.getById(this._.inputId)
						},
						focus: function() {
							var a = this.selectParentTab();
							setTimeout(function() {
								var b = a.getInputElement();
								b && b.$.focus()
							}, 0)
						},
						select: function() {
							var a = this.selectParentTab();
							setTimeout(function() {
								var b = a.getInputElement();
								if (b) {
									b.$.focus();
									b.$.select()
								}
							}, 0)
						},
						accessKeyUp: function() {
							this.select()
						},
						setValue: function(a) {
							!a && (a = "");
							return CKEDITOR.ui.dialog.uiElement.prototype.setValue.apply(this,
								arguments)
						},
						keyboardFocusable: true
					}, d, true);
				CKEDITOR.ui.dialog.textarea.prototype = new CKEDITOR.ui.dialog.textInput;
				CKEDITOR.ui.dialog.select.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
					getInputElement: function() {
						return this._.select.getElement()
					},
					add: function(a, b, c) {
						var d = new CKEDITOR.dom.element("option", this.getDialog().getParentEditor().document),
							f = this.getInputElement().$;
						d.$.text = a;
						d.$.value = b === void 0 || b === null ? a : b;
						c === void 0 || c === null ? CKEDITOR.env.ie ? f.add(d.$) : f.add(d.$,
							null) : f.add(d.$, c);
						return this
					},
					remove: function(a) {
						this.getInputElement().$.remove(a);
						return this
					},
					clear: function() {
						for (var a = this.getInputElement().$; a.length > 0;) a.remove(0);
						return this
					},
					keyboardFocusable: true
				}, d, true);
				CKEDITOR.ui.dialog.checkbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
					getInputElement: function() {
						return this._.checkbox.getElement()
					},
					setValue: function(a, b) {
						this.getInputElement().$.checked = a;
						!b && this.fire("change", {
							value: a
						})
					},
					getValue: function() {
						return this.getInputElement().$.checked
					},
					accessKeyUp: function() {
						this.setValue(!this.getValue())
					},
					eventProcessors: {
						onChange: function(a, b) {
							if (!CKEDITOR.env.ie || CKEDITOR.env.version > 8) return f.onChange.apply(this, arguments);
							a.on("load", function() {
								var a = this._.checkbox.getElement();
								a.on("propertychange", function(b) {
									b = b.data.$;
									b.propertyName == "checked" && this.fire("change", {
										value: a.$.checked
									})
								}, this)
							}, this);
							this.on("change", b);
							return null
						}
					},
					keyboardFocusable: true
				}, d, true);
				CKEDITOR.ui.dialog.radio.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
					setValue: function(a, b) {
						for (var c = this._.children, d, f = 0; f < c.length && (d = c[f]); f++) d.getElement().$.checked = d.getValue() == a;
						!b && this.fire("change", {
							value: a
						})
					},
					getValue: function() {
						for (var a = this._.children, b = 0; b < a.length; b++)
							if (a[b].getElement().$.checked) return a[b].getValue();
						return null
					},
					accessKeyUp: function() {
						var a = this._.children,
							b;
						for (b = 0; b < a.length; b++)
							if (a[b].getElement().$.checked) {
								a[b].getElement().focus();
								return
							}
						a[0].getElement().focus()
					},
					eventProcessors: {
						onChange: function(a, b) {
							if (CKEDITOR.env.ie) {
								a.on("load",
									function() {
										for (var a = this._.children, b = this, c = 0; c < a.length; c++) a[c].getElement().on("propertychange", function(a) {
											a = a.data.$;
											a.propertyName == "checked" && this.$.checked && b.fire("change", {
												value: this.getAttribute("value")
											})
										})
									}, this);
								this.on("change", b)
							} else return f.onChange.apply(this, arguments);
							return null
						}
					}
				}, d, true);
				CKEDITOR.ui.dialog.file.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, d, {
					getInputElement: function() {
						var a = CKEDITOR.document.getById(this._.frameId).getFrameDocument();
						return a.$.forms.length > 0 ? new CKEDITOR.dom.element(a.$.forms[0].elements[0]) : this.getElement()
					},
					submit: function() {
						this.getInputElement().getParent().$.submit();
						return this
					},
					getAction: function() {
						return this.getInputElement().getParent().$.action
					},
					registerEvents: function(a) {
						var b = /^on([A-Z]\w+)/,
							c, d = function(a, b, c, d) {
								a.on("formLoaded", function() {
									a.getInputElement().on(c, d, a)
								})
							},
							f;
						for (f in a)
							if (c = f.match(b)) this.eventProcessors[f] ? this.eventProcessors[f].call(this, this._.dialog, a[f]) : d(this, this._.dialog,
								c[1].toLowerCase(), a[f]);
						return this
					},
					reset: function() {
						function a() {
							c.$.open();
							var j = "";
							d.size && (j = d.size - (CKEDITOR.env.ie ? 7 : 0));
							var t = b.frameId + "_input";
							c.$.write(['<html dir="' + l + '" lang="' + m + '"><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">', '<form enctype="multipart/form-data" method="POST" dir="' + l + '" lang="' + m + '" action="', CKEDITOR.tools.htmlEncode(d.action), '"><label id="', b.labelId, '" for="', t, '" style="display:none">', CKEDITOR.tools.htmlEncode(d.label),
								'</label><input style="width:100%" id="', t, '" aria-labelledby="', b.labelId, '" type="file" name="', CKEDITOR.tools.htmlEncode(d.id || "cke_upload"), '" size="', CKEDITOR.tools.htmlEncode(j > 0 ? j : ""), '" /></form></body></html><script>', CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "", "window.parent.CKEDITOR.tools.callFunction(" + e + ");", "window.onbeforeunload = function() {window.parent.CKEDITOR.tools.callFunction(" + h + ")}", "<\/script>"
							].join(""));
							c.$.close();
							for (j = 0; j < f.length; j++) f[j].enable()
						}
						var b =
							this._,
							c = CKEDITOR.document.getById(b.frameId).getFrameDocument(),
							d = b.definition,
							f = b.buttons,
							e = this.formLoadedNumber,
							h = this.formUnloadNumber,
							l = b.dialog._.editor.lang.dir,
							m = b.dialog._.editor.langCode;
						if (!e) {
							e = this.formLoadedNumber = CKEDITOR.tools.addFunction(function() {
								this.fire("formLoaded")
							}, this);
							h = this.formUnloadNumber = CKEDITOR.tools.addFunction(function() {
								this.getInputElement().clearCustomData()
							}, this);
							this.getDialog()._.editor.on("destroy", function() {
								CKEDITOR.tools.removeFunction(e);
								CKEDITOR.tools.removeFunction(h)
							})
						}
						CKEDITOR.env.gecko ?
							setTimeout(a, 500) : a()
					},
					getValue: function() {
						return this.getInputElement().$.value || ""
					},
					setInitValue: function() {
						this._.initValue = ""
					},
					eventProcessors: {
						onChange: function(a, b) {
							if (!this._.domOnChangeRegistered) {
								this.on("formLoaded", function() {
									this.getInputElement().on("change", function() {
										this.fire("change", {
											value: this.getValue()
										})
									}, this)
								}, this);
								this._.domOnChangeRegistered = true
							}
							this.on("change", b)
						}
					},
					keyboardFocusable: true
				}, true);
				CKEDITOR.ui.dialog.fileButton.prototype = new CKEDITOR.ui.dialog.button;
				CKEDITOR.ui.dialog.fieldset.prototype =
					CKEDITOR.tools.clone(CKEDITOR.ui.dialog.hbox.prototype);
				CKEDITOR.dialog.addUIElement("text", e);
				CKEDITOR.dialog.addUIElement("password", e);
				CKEDITOR.dialog.addUIElement("textarea", b);
				CKEDITOR.dialog.addUIElement("checkbox", b);
				CKEDITOR.dialog.addUIElement("radio", b);
				CKEDITOR.dialog.addUIElement("button", b);
				CKEDITOR.dialog.addUIElement("select", b);
				CKEDITOR.dialog.addUIElement("file", b);
				CKEDITOR.dialog.addUIElement("fileButton", b);
				CKEDITOR.dialog.addUIElement("html", b);
				CKEDITOR.dialog.addUIElement("fieldset", {
					build: function(a, b, c) {
						for (var d = b.children, f, e = [], h = [], l = 0; l < d.length && (f = d[l]); l++) {
							var m = [];
							e.push(m);
							h.push(CKEDITOR.dialog._.uiElementBuilders[f.type].build(a, f, m))
						}
						return new CKEDITOR.ui.dialog[b.type](a, h, e, c, b)
					}
				})
			}
		}), CKEDITOR.DIALOG_RESIZE_NONE = 0, CKEDITOR.DIALOG_RESIZE_WIDTH = 1, CKEDITOR.DIALOG_RESIZE_HEIGHT = 2, CKEDITOR.DIALOG_RESIZE_BOTH = 3,
		function() {
			function a() {
				for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId) + a, c = b - 1; c > b - a; c--)
					if (this._.tabs[this._.tabIdList[c %
						a]][0].$.offsetHeight) return this._.tabIdList[c % a];
				return null
			}

			function e() {
				for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId), c = b + 1; c < b + a; c++)
					if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight) return this._.tabIdList[c % a];
				return null
			}

			function b(a, b) {
				for (var c = a.$.getElementsByTagName("input"), d = 0, f = c.length; d < f; d++) {
					var e = new CKEDITOR.dom.element(c[d]);
					if (e.getAttribute("type").toLowerCase() == "text")
						if (b) {
							e.setAttribute("value", e.getCustomData("fake_value") ||
								"");
							e.removeCustomData("fake_value")
						} else {
							e.setCustomData("fake_value", e.getAttribute("value"));
							e.setAttribute("value", "")
						}
				}
			}

			function d(a, b) {
				var c = this.getInputElement();
				c && (a ? c.removeAttribute("aria-invalid") : c.setAttribute("aria-invalid", true));
				a || (this.select ? this.select() : this.focus());
				b && alert(b);
				this.fire("validated", {
					valid: a,
					msg: b
				})
			}

			function f() {
				var a = this.getInputElement();
				a && a.removeAttribute("aria-invalid")
			}

			function c(a) {
				var a = CKEDITOR.dom.element.createFromHtml(CKEDITOR.addTemplate("dialog",
						m).output({
						id: CKEDITOR.tools.getNextNumber(),
						editorId: a.id,
						langDir: a.lang.dir,
						langCode: a.langCode,
						editorDialogClass: "cke_editor_" + a.name.replace(/\./g, "\\.") + "_dialog",
						closeTitle: a.lang.common.close,
						hidpi: CKEDITOR.env.hidpi ? "cke_hidpi" : ""
					})),
					b = a.getChild([0, 0, 0, 0, 0]),
					c = b.getChild(0),
					d = b.getChild(1);
				if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
					var f = "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())";
					CKEDITOR.dom.element.createFromHtml('<iframe frameBorder="0" class="cke_iframe_shim" src="' +
						f + '" tabIndex="-1"></iframe>').appendTo(b.getParent())
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
				}
			}

			function h(a, b, c) {
				this.element = b;
				this.focusIndex = c;
				this.tabIndex = 0;
				this.isFocusable = function() {
					return !b.getAttribute("disabled") && b.isVisible()
				};
				this.focus = function() {
					a._.currentFocusIndex = this.focusIndex;
					this.element.focus()
				};
				b.on("keydown", function(a) {
					a.data.getKeystroke() in {
						32: 1,
						13: 1
					} && this.fire("click")
				});
				b.on("focus", function() {
					this.fire("mouseover")
				});
				b.on("blur", function() {
					this.fire("mouseout")
				})
			}

			function j(a) {
				function b() {
					a.layout()
				}
				var c = CKEDITOR.document.getWindow();
				c.on("resize", b);
				a.on("hide", function() {
					c.removeListener("resize", b)
				})
			}

			function g(a, b) {
				this._ = {
					dialog: a
				};
				CKEDITOR.tools.extend(this, b)
			}

			function i(a) {
				function b(c) {
					var i = a.getSize(),
						j = CKEDITOR.document.getWindow().getViewPaneSize(),
						k = c.data.$.screenX,
						l = c.data.$.screenY,
						m = k - d.x,
						n = l - d.y;
					d = {
						x: k,
						y: l
					};
					f.x = f.x + m;
					f.y = f.y + n;
					a.move(f.x + g[3] < h ? -g[3] : f.x - g[1] > j.width - i.width - h ? j.width - i.width + (e.lang.dir == "rtl" ? 0 : g[1]) : f.x, f.y + g[0] < h ? -g[0] : f.y - g[2] > j.height - i.height - h ? j.height - i.height + g[2] : f.y, 1);
					c.data.preventDefault()
				}

				function c() {
					CKEDITOR.document.removeListener("mousemove", b);
					CKEDITOR.document.removeListener("mouseup", c);
					if (CKEDITOR.env.ie6Compat) {
						var a = v.getChild(0).getFrameDocument();
						a.removeListener("mousemove", b);
						a.removeListener("mouseup", c)
					}
				}
				var d = null,
					f = null;
				a.getElement().getFirst();
				var e =
					a.getParentEditor(),
					h = e.config.dialog_magnetDistance,
					g = CKEDITOR.skin.margins || [0, 0, 0, 0];
				typeof h == "undefined" && (h = 20);
				a.parts.title.on("mousedown", function(e) {
					d = {
						x: e.data.$.screenX,
						y: e.data.$.screenY
					};
					CKEDITOR.document.on("mousemove", b);
					CKEDITOR.document.on("mouseup", c);
					f = a.getPosition();
					if (CKEDITOR.env.ie6Compat) {
						var h = v.getChild(0).getFrameDocument();
						h.on("mousemove", b);
						h.on("mouseup", c)
					}
					e.data.preventDefault()
				}, a)
			}

			function k(a) {
				var b, c;

				function d(f) {
					var m = g.lang.dir == "rtl",
						n = l.width,
						p = l.height,
						s = n + (f.data.$.screenX - b) * (m ? -1 : 1) * (a._.moved ? 1 : 2),
						A = p + (f.data.$.screenY - c) * (a._.moved ? 1 : 2),
						o = a._.element.getFirst(),
						o = m && o.getComputedStyle("right"),
						t = a.getPosition();
					t.y + A > k.height && (A = k.height - t.y);
					if ((m ? o : t.x) + s > k.width) s = k.width - (m ? o : t.x);
					if (h == CKEDITOR.DIALOG_RESIZE_WIDTH || h == CKEDITOR.DIALOG_RESIZE_BOTH) n = Math.max(e.minWidth || 0, s - i);
					if (h == CKEDITOR.DIALOG_RESIZE_HEIGHT || h == CKEDITOR.DIALOG_RESIZE_BOTH) p = Math.max(e.minHeight || 0, A - j);
					a.resize(n, p);
					a._.moved || a.layout();
					f.data.preventDefault()
				}

				function f() {
					CKEDITOR.document.removeListener("mouseup",
						f);
					CKEDITOR.document.removeListener("mousemove", d);
					if (m) {
						m.remove();
						m = null
					}
					if (CKEDITOR.env.ie6Compat) {
						var a = v.getChild(0).getFrameDocument();
						a.removeListener("mouseup", f);
						a.removeListener("mousemove", d)
					}
				}
				var e = a.definition,
					h = e.resizable;
				if (h != CKEDITOR.DIALOG_RESIZE_NONE) {
					var g = a.getParentEditor(),
						i, j, k, l, m, n = CKEDITOR.tools.addFunction(function(e) {
							l = a.getSize();
							var h = a.parts.contents;
							if (h.$.getElementsByTagName("iframe").length) {
								m = CKEDITOR.dom.element.createFromHtml('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>');
								h.append(m)
							}
							j = l.height - a.parts.contents.getSize("height", !(CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.quirks));
							i = l.width - a.parts.contents.getSize("width", 1);
							b = e.screenX;
							c = e.screenY;
							k = CKEDITOR.document.getWindow().getViewPaneSize();
							CKEDITOR.document.on("mousemove", d);
							CKEDITOR.document.on("mouseup", f);
							if (CKEDITOR.env.ie6Compat) {
								h = v.getChild(0).getFrameDocument();
								h.on("mousemove", d);
								h.on("mouseup", f)
							}
							e.preventDefault && e.preventDefault()
						});
					a.on("load", function() {
						var b = "";
						h == CKEDITOR.DIALOG_RESIZE_WIDTH ?
							b = " cke_resizer_horizontal" : h == CKEDITOR.DIALOG_RESIZE_HEIGHT && (b = " cke_resizer_vertical");
						b = CKEDITOR.dom.element.createFromHtml('<div class="cke_resizer' + b + " cke_resizer_" + g.lang.dir + '" title="' + CKEDITOR.tools.htmlEncode(g.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + n + ', event )">' + (g.lang.dir == "ltr" ? "◢" : "◣") + "</div>");
						a.parts.footer.append(b, 1)
					});
					g.on("destroy", function() {
						CKEDITOR.tools.removeFunction(n)
					})
				}
			}

			function n(a) {
				a.data.preventDefault(1)
			}

			function o(a) {
				var b = CKEDITOR.document.getWindow(),
					c = a.config,
					d = c.dialog_backgroundCoverColor || "white",
					f = c.dialog_backgroundCoverOpacity,
					e = c.baseFloatZIndex,
					c = CKEDITOR.tools.genKey(d, f, e),
					h = B[c];
				if (h) h.show();
				else {
					e = ['<div tabIndex="-1" style="position: ', CKEDITOR.env.ie6Compat ? "absolute" : "fixed", "; z-index: ", e, "; top: 0px; left: 0px; ", !CKEDITOR.env.ie6Compat ? "background-color: " + d : "", '" class="cke_dialog_background_cover">'];
					if (CKEDITOR.env.ie6Compat) {
						d = "<html><body style=\\'background-color:" + d + ";\\'></body></html>";
						e.push('<iframe hidefocus="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:');
						e.push("void((function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.write( '" + d + "' );document.close();") + "})())");
						e.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>')
					}
					e.push("</div>");
					h = CKEDITOR.dom.element.createFromHtml(e.join(""));
					h.setOpacity(f != void 0 ? f : 0.5);
					h.on("keydown", n);
					h.on("keypress", n);
					h.on("keyup", n);
					h.appendTo(CKEDITOR.document.getBody());
					B[c] = h
				}
				a.focusManager.add(h);
				v = h;
				var a = function() {
						var a = b.getViewPaneSize();
						h.setStyles({
							width: a.width + "px",
							height: a.height + "px"
						})
					},
					g = function() {
						var a = b.getScrollPosition(),
							c = CKEDITOR.dialog._.currentTop;
						h.setStyles({
							left: a.x + "px",
							top: a.y + "px"
						});
						if (c) {
							do {
								a = c.getPosition();
								c.move(a.x, a.y)
							} while (c = c._.parentDialog)
						}
					};
				u = a;
				b.on("resize", a);
				a();
				(!CKEDITOR.env.mac || !CKEDITOR.env.webkit) && h.focus();
				if (CKEDITOR.env.ie6Compat) {
					var i = function() {
						g();
						arguments.callee.prevScrollHandler.apply(this, arguments)
					};
					b.$.setTimeout(function() {
						i.prevScrollHandler =
							window.onscroll || function() {};
						window.onscroll = i
					}, 0);
					g()
				}
			}

			function r(a) {
				if (v) {
					a.focusManager.remove(v);
					a = CKEDITOR.document.getWindow();
					v.hide();
					a.removeListener("resize", u);
					CKEDITOR.env.ie6Compat && a.$.setTimeout(function() {
						window.onscroll = window.onscroll && window.onscroll.prevScrollHandler || null
					}, 0);
					u = null
				}
			}
			var l = CKEDITOR.tools.cssLength,
				m = '<div class="cke_reset_all {editorId} {editorDialogClass} {hidpi}" dir="{langDir}" lang="{langCode}" role="dialog" aria-labelledby="cke_dialog_title_{id}"><table class="cke_dialog ' +
				CKEDITOR.env.cssClass + ' cke_{langDir}" style="position:absolute" role="presentation"><tr><td role="presentation"><div class="cke_dialog_body" role="presentation"><div id="cke_dialog_title_{id}" class="cke_dialog_title" role="presentation"></div><a id="cke_dialog_close_button_{id}" class="cke_dialog_close_button" href="javascript:void(0)" title="{closeTitle}" role="button"><span class="cke_label">X</span></a><div id="cke_dialog_tabs_{id}" class="cke_dialog_tabs" role="tablist"></div><table class="cke_dialog_contents" role="presentation"><tr><td id="cke_dialog_contents_{id}" class="cke_dialog_contents_body" role="presentation"></td></tr><tr><td id="cke_dialog_footer_{id}" class="cke_dialog_footer" role="presentation"></td></tr></table></div></td></tr></table></div>';
			CKEDITOR.dialog = function(b, h) {
				function g() {
					var a = w._.focusList;
					a.sort(function(a, b) {
						return a.tabIndex != b.tabIndex ? b.tabIndex - a.tabIndex : a.focusIndex - b.focusIndex
					});
					for (var b = a.length, c = 0; c < b; c++) a[c].focusIndex = c
				}

				function j(a) {
					var b = w._.focusList,
						a = a || 0;
					if (!(b.length < 1)) {
						var c = w._.currentFocusIndex;
						try {
							b[c].getInputElement().$.blur()
						} catch (d) {}
						for (var f = c = (c + a + b.length) % b.length; a && !b[f].isFocusable();) {
							f = (f + a + b.length) % b.length;
							if (f == c) break
						}
						b[f].focus();
						b[f].type == "text" && b[f].select()
					}
				}

				function l(c) {
					if (w ==
						CKEDITOR.dialog._.currentTop) {
						var d = c.data.getKeystroke(),
							f = b.lang.dir == "rtl";
						I = r = 0;
						if (d == 9 || d == CKEDITOR.SHIFT + 9) {
							d = d == CKEDITOR.SHIFT + 9;
							if (w._.tabBarMode) {
								d = d ? a.call(w) : e.call(w);
								w.selectPage(d);
								w._.tabs[d][0].focus()
							} else j(d ? -1 : 1);
							I = 1
						} else if (d == CKEDITOR.ALT + 121 && !w._.tabBarMode && w.getPageCount() > 1) {
							w._.tabBarMode = true;
							w._.tabs[w._.currentTabId][0].focus();
							I = 1
						} else if ((d == 37 || d == 39) && w._.tabBarMode) {
							d = d == (f ? 39 : 37) ? a.call(w) : e.call(w);
							w.selectPage(d);
							w._.tabs[d][0].focus();
							I = 1
						} else if ((d == 13 || d ==
							32) && w._.tabBarMode) {
							this.selectPage(this._.currentTabId);
							this._.tabBarMode = false;
							this._.currentFocusIndex = -1;
							j(1);
							I = 1
						} else if (d == 13) {
							d = c.data.getTarget();
							if (!d.is("a", "button", "select", "textarea") && (!d.is("input") || d.$.type != "button")) {
								(d = this.getButton("ok")) && CKEDITOR.tools.setTimeout(d.click, 0, d);
								I = 1
							}
							r = 1
						} else if (d == 27) {
							(d = this.getButton("cancel")) ? CKEDITOR.tools.setTimeout(d.click, 0, d): this.fire("cancel", {
								hide: true
							}).hide !== false && this.hide();
							r = 1
						} else return;
						m(c)
					}
				}

				function m(a) {
					I ? a.data.preventDefault(1) :
						r && a.data.stopPropagation()
				}
				var n = CKEDITOR.dialog._.dialogDefinitions[h],
					p = CKEDITOR.tools.clone(s),
					A = b.config.dialog_buttonsOrder || "OS",
					o = b.lang.dir,
					t = {},
					I, r;
				(A == "OS" && CKEDITOR.env.mac || A == "rtl" && o == "ltr" || A == "ltr" && o == "rtl") && p.buttons.reverse();
				n = CKEDITOR.tools.extend(n(b), p);
				n = CKEDITOR.tools.clone(n);
				n = new q(this, n);
				p = c(b);
				this._ = {
					editor: b,
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
					b.fire("ariaWidget", this.parts.contents)
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
				}, b).definition;
				if (!("removeDialogTabs" in b._) &&
					b.config.removeDialogTabs) {
					p = b.config.removeDialogTabs.split(";");
					for (o = 0; o < p.length; o++) {
						A = p[o].split(":");
						if (A.length == 2) {
							var x = A[0];
							t[x] || (t[x] = []);
							t[x].push(A[1])
						}
					}
					b._.removeDialogTabs = t
				}
				if (b._.removeDialogTabs && (t = b._.removeDialogTabs[h]))
					for (o = 0; o < t.length; o++) n.removeContents(t[o]);
				if (n.onLoad) this.on("load", n.onLoad);
				if (n.onShow) this.on("show", n.onShow);
				if (n.onHide) this.on("hide", n.onHide);
				if (n.onOk) this.on("ok", function(a) {
					b.fire("saveSnapshot");
					setTimeout(function() {
							b.fire("saveSnapshot")
						},
						0);
					if (n.onOk.call(this, a) === false) a.data.hide = false
				});
				if (n.onCancel) this.on("cancel", function(a) {
					if (n.onCancel.call(this, a) === false) a.data.hide = false
				});
				var w = this,
					C = function(a) {
						var b = w._.contents,
							c = false,
							d;
						for (d in b)
							for (var f in b[d])
								if (c = a.call(this, b[d][f])) return
					};
				this.on("ok", function(a) {
					C(function(b) {
						if (b.validate) {
							var c = b.validate(this),
								f = typeof c == "string" || c === false;
							if (f) {
								a.data.hide = false;
								a.stop()
							}
							d.call(b, !f, typeof c == "string" ? c : void 0);
							return f
						}
					})
				}, this, null, 0);
				this.on("cancel", function(a) {
					C(function(c) {
						if (c.isChanged()) {
							if (!b.config.dialog_noConfirmCancel &&
								!confirm(b.lang.common.confirmCancel)) a.data.hide = false;
							return true
						}
					})
				}, this, null, 0);
				this.parts.close.on("click", function(a) {
					this.fire("cancel", {
						hide: true
					}).hide !== false && this.hide();
					a.data.preventDefault()
				}, this);
				this.changeFocus = j;
				var u = this._.element;
				b.focusManager.add(u, 1);
				this.on("show", function() {
					u.on("keydown", l, this);
					if (CKEDITOR.env.gecko) u.on("keypress", m, this)
				});
				this.on("hide", function() {
					u.removeListener("keydown", l);
					CKEDITOR.env.gecko && u.removeListener("keypress", m);
					C(function(a) {
						f.apply(a)
					})
				});
				this.on("iframeAdded", function(a) {
					(new CKEDITOR.dom.document(a.data.iframe.$.contentWindow.document)).on("keydown", l, this, null, 0)
				});
				this.on("show", function() {
					g();
					if (b.config.dialog_startupFocusTab && w._.pageCount > 1) {
						w._.tabBarMode = true;
						w._.tabs[w._.currentTabId][0].focus()
					} else if (!this._.hasFocus) {
						this._.currentFocusIndex = -1;
						if (n.onFocus) {
							var a = n.onFocus.call(this);
							a && a.focus()
						} else j(1)
					}
				}, this, null, 4294967295);
				if (CKEDITOR.env.ie6Compat) this.on("load", function() {
					var a = this.getElement(),
						b = a.getFirst();
					b.remove();
					b.appendTo(a)
				}, this);
				i(this);
				k(this);
				(new CKEDITOR.dom.text(n.title, CKEDITOR.document)).appendTo(this.parts.title);
				for (o = 0; o < n.contents.length; o++)(t = n.contents[o]) && this.addPage(t);
				this.parts.tabs.on("click", function(a) {
					var b = a.data.getTarget();
					if (b.hasClass("cke_dialog_tab")) {
						b = b.$.id;
						this.selectPage(b.substring(4, b.lastIndexOf("_")));
						if (this._.tabBarMode) {
							this._.tabBarMode = false;
							this._.currentFocusIndex = -1;
							j(1)
						}
						a.data.preventDefault()
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
				for (o = 0; o < t.length; o++) this._.buttons[t[o].id] = t[o]
			};
			CKEDITOR.dialog.prototype = {
				destroy: function() {
					this.hide();
					this._.element.remove()
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
								},
								this._.editor);
							this.parts.contents.setStyles({
								width: a + "px",
								height: b + "px"
							});
							if (this._.editor.lang.dir == "rtl" && this._.position) this._.position.x = CKEDITOR.document.getWindow().getViewPaneSize().width - this._.contentSize.width - parseInt(this._.element.getFirst().getStyle("right"), 10);
							this._.contentSize = {
								width: a,
								height: b
							}
						}
					}
				}(),
				getSize: function() {
					var a = this._.element.getFirst();
					return {
						width: a.$.offsetWidth || 0,
						height: a.$.offsetHeight || 0
					}
				},
				move: function(a, b, c) {
					var d = this._.element.getFirst(),
						f = this._.editor.lang.dir ==
						"rtl",
						e = d.getComputedStyle("position") == "fixed";
					CKEDITOR.env.ie && d.setStyle("zoom", "100%");
					if (!e || !this._.position || !(this._.position.x == a && this._.position.y == b)) {
						this._.position = {
							x: a,
							y: b
						};
						if (!e) {
							e = CKEDITOR.document.getWindow().getScrollPosition();
							a = a + e.x;
							b = b + e.y
						}
						if (f) {
							e = this.getSize();
							a = CKEDITOR.document.getWindow().getViewPaneSize().width - e.width - a
						}
						b = {
							top: (b > 0 ? b : 0) + "px"
						};
						b[f ? "right" : "left"] = (a > 0 ? a : 0) + "px";
						d.setStyles(b);
						c && (this._.moved = 1)
					}
				},
				getPosition: function() {
					return CKEDITOR.tools.extend({},
						this._.position)
				},
				show: function() {
					var a = this._.element,
						b = this.definition;
					!a.getParent() || !a.getParent().equals(CKEDITOR.document.getBody()) ? a.appendTo(CKEDITOR.document.getBody()) : a.setStyle("display", "block");
					this.resize(this._.contentSize && this._.contentSize.width || b.width || b.minWidth, this._.contentSize && this._.contentSize.height || b.height || b.minHeight);
					this.reset();
					this.selectPage(this.definition.contents[0].id);
					if (CKEDITOR.dialog._.currentZIndex === null) CKEDITOR.dialog._.currentZIndex = this._.editor.config.baseFloatZIndex;
					this._.element.getFirst().setStyle("z-index", CKEDITOR.dialog._.currentZIndex = CKEDITOR.dialog._.currentZIndex + 10);
					if (CKEDITOR.dialog._.currentTop === null) {
						CKEDITOR.dialog._.currentTop = this;
						this._.parentDialog = null;
						o(this._.editor)
					} else {
						this._.parentDialog = CKEDITOR.dialog._.currentTop;
						this._.parentDialog.getElement().getFirst().$.style.zIndex -= Math.floor(this._.editor.config.baseFloatZIndex / 2);
						CKEDITOR.dialog._.currentTop = this
					}
					a.on("keydown", w);
					a.on("keyup", D);
					this._.hasFocus = false;
					for (var c in b.contents)
						if (b.contents[c]) {
							var a =
								b.contents[c],
								d = this._.tabs[a.id],
								f = a.requiredContent,
								e = 0;
							if (d) {
								for (var h in this._.contents[a.id]) {
									var g = this._.contents[a.id][h];
									if (!(g.type == "hbox" || g.type == "vbox" || !g.getInputElement()))
										if (g.requiredContent && !this._.editor.activeFilter.check(g.requiredContent)) g.disable();
										else {
											g.enable();
											e++
										}
								}!e || f && !this._.editor.activeFilter.check(f) ? d[0].addClass("cke_dialog_tab_disabled") : d[0].removeClass("cke_dialog_tab_disabled")
							}
						}
					CKEDITOR.tools.setTimeout(function() {
						this.layout();
						j(this);
						this.parts.dialog.setStyle("visibility",
							"");
						this.fireOnce("load", {});
						CKEDITOR.ui.fire("ready", this);
						this.fire("show", {});
						this._.editor.fire("dialogShow", this);
						this._.parentDialog || this._.editor.focusManager.lock();
						this.foreach(function(a) {
							a.setInitValue && a.setInitValue()
						})
					}, 100, this)
				},
				layout: function() {
					var a = this.parts.dialog,
						b = this.getSize(),
						c = CKEDITOR.document.getWindow().getViewPaneSize(),
						d = (c.width - b.width) / 2,
						f = (c.height - b.height) / 2;
					CKEDITOR.env.ie6Compat || (b.height + (f > 0 ? f : 0) > c.height || b.width + (d > 0 ? d : 0) > c.width ? a.setStyle("position",
						"absolute") : a.setStyle("position", "fixed"));
					this.move(this._.moved ? this._.position.x : d, this._.moved ? this._.position.y : f)
				},
				foreach: function(a) {
					for (var b in this._.contents)
						for (var c in this._.contents[b]) a.call(this, this._.contents[b][c]);
					return this
				},
				reset: function() {
					var a = function(a) {
						a.reset && a.reset(1)
					};
					return function() {
						this.foreach(a);
						return this
					}
				}(),
				setupContent: function() {
					var a = arguments;
					this.foreach(function(b) {
						b.setup && b.setup.apply(b, a)
					})
				},
				commitContent: function() {
					var a = arguments;
					this.foreach(function(b) {
						CKEDITOR.env.ie &&
							this._.currentFocusIndex == b.focusIndex && b.getInputElement().$.blur();
						b.commit && b.commit.apply(b, a)
					})
				},
				hide: function() {
					if (this.parts.dialog.isVisible()) {
						this.fire("hide", {});
						this._.editor.fire("dialogHide", this);
						this.selectPage(this._.tabIdList[0]);
						var a = this._.element;
						a.setStyle("display", "none");
						this.parts.dialog.setStyle("visibility", "hidden");
						for (I(this); CKEDITOR.dialog._.currentTop != this;) CKEDITOR.dialog._.currentTop.hide();
						if (this._.parentDialog) {
							var b = this._.parentDialog.getElement().getFirst();
							b.setStyle("z-index", parseInt(b.$.style.zIndex, 10) + Math.floor(this._.editor.config.baseFloatZIndex / 2))
						} else r(this._.editor); if (CKEDITOR.dialog._.currentTop = this._.parentDialog) CKEDITOR.dialog._.currentZIndex = CKEDITOR.dialog._.currentZIndex - 10;
						else {
							CKEDITOR.dialog._.currentZIndex = null;
							a.removeListener("keydown", w);
							a.removeListener("keyup", D);
							var c = this._.editor;
							c.focus();
							setTimeout(function() {
								c.focusManager.unlock()
							}, 0)
						}
						delete this._.parentDialog;
						this.foreach(function(a) {
							a.resetInitValue && a.resetInitValue()
						})
					}
				},
				addPage: function(a) {
					if (!a.requiredContent || this._.editor.filter.check(a.requiredContent)) {
						for (var b = [], c = a.label ? ' title="' + CKEDITOR.tools.htmlEncode(a.label) + '"' : "", d = CKEDITOR.dialog._.uiElementBuilders.vbox.build(this, {
							type: "vbox",
							className: "cke_dialog_page_contents",
							children: a.elements,
							expand: !!a.expand,
							padding: a.padding,
							style: a.style || "width: 100%;"
						}, b), f = this._.contents[a.id] = {}, e = d.getChild(), h = 0; d = e.shift();) {
							!d.notAllowed && (d.type != "hbox" && d.type != "vbox") && h++;
							f[d.id] = d;
							typeof d.getChild ==
								"function" && e.push.apply(e, d.getChild())
						}
						if (!h) a.hidden = true;
						b = CKEDITOR.dom.element.createFromHtml(b.join(""));
						b.setAttribute("role", "tabpanel");
						d = CKEDITOR.env;
						f = "cke_" + a.id + "_" + CKEDITOR.tools.getNextNumber();
						c = CKEDITOR.dom.element.createFromHtml(['<a class="cke_dialog_tab"', this._.pageCount > 0 ? " cke_last" : "cke_first", c, a.hidden ? ' style="display:none"' : "", ' id="', f, '"', d.gecko && !d.hc ? "" : ' href="javascript:void(0)"', ' tabIndex="-1" hidefocus="true" role="tab">', a.label, "</a>"].join(""));
						b.setAttribute("aria-labelledby",
							f);
						this._.tabs[a.id] = [c, b];
						this._.tabIdList.push(a.id);
						!a.hidden && this._.pageCount++;
						this._.lastTab = c;
						this.updateStyle();
						b.setAttribute("name", a.id);
						b.appendTo(this.parts.contents);
						c.unselectable();
						this.parts.tabs.append(c);
						if (a.accessKey) {
							A(this, this, "CTRL+" + a.accessKey, C, K);
							this._.accessKeyMap["CTRL+" + a.accessKey] = a.id
						}
					}
				},
				selectPage: function(a) {
					if (this._.currentTabId != a && !this._.tabs[a][0].hasClass("cke_dialog_tab_disabled") && this.fire("selectPage", {
						page: a,
						currentPage: this._.currentTabId
					}) !== false) {
						for (var c in this._.tabs) {
							var d =
								this._.tabs[c][0],
								f = this._.tabs[c][1];
							if (c != a) {
								d.removeClass("cke_dialog_tab_selected");
								f.hide()
							}
							f.setAttribute("aria-hidden", c != a)
						}
						var e = this._.tabs[a];
						e[0].addClass("cke_dialog_tab_selected");
						if (CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat) {
							b(e[1]);
							e[1].show();
							setTimeout(function() {
								b(e[1], 1)
							}, 0)
						} else e[1].show();
						this._.currentTabId = a;
						this._.currentTabIndex = CKEDITOR.tools.indexOf(this._.tabIdList, a)
					}
				},
				updateStyle: function() {
					this.parts.dialog[(this._.pageCount === 1 ? "add" : "remove") + "Class"]("cke_single_page")
				},
				hidePage: function(b) {
					var c = this._.tabs[b] && this._.tabs[b][0];
					if (c && this._.pageCount != 1 && c.isVisible()) {
						b == this._.currentTabId && this.selectPage(a.call(this));
						c.hide();
						this._.pageCount--;
						this.updateStyle()
					}
				},
				showPage: function(a) {
					if (a = this._.tabs[a] && this._.tabs[a][0]) {
						a.show();
						this._.pageCount++;
						this.updateStyle()
					}
				},
				getElement: function() {
					return this._.element
				},
				getName: function() {
					return this._.name
				},
				getContentElement: function(a, b) {
					var c = this._.contents[a];
					return c && c[b]
				},
				getValueOf: function(a, b) {
					return this.getContentElement(a,
						b).getValue()
				},
				setValueOf: function(a, b, c) {
					return this.getContentElement(a, b).setValue(c)
				},
				getButton: function(a) {
					return this._.buttons[a]
				},
				click: function(a) {
					return this._.buttons[a].click()
				},
				disableButton: function(a) {
					return this._.buttons[a].disable()
				},
				enableButton: function(a) {
					return this._.buttons[a].enable()
				},
				getPageCount: function() {
					return this._.pageCount
				},
				getParentEditor: function() {
					return this._.editor
				},
				getSelectedElement: function() {
					return this.getParentEditor().getSelection().getSelectedElement()
				},
				addFocusable: function(a, b) {
					if (typeof b == "undefined") {
						b = this._.focusList.length;
						this._.focusList.push(new h(this, a, b))
					} else {
						this._.focusList.splice(b, 0, new h(this, a, b));
						for (var c = b + 1; c < this._.focusList.length; c++) this._.focusList[c].focusIndex++
					}
				}
			};
			CKEDITOR.tools.extend(CKEDITOR.dialog, {
				add: function(a, b) {
					if (!this._.dialogDefinitions[a] || typeof b == "function") this._.dialogDefinitions[a] = b
				},
				exists: function(a) {
					return !!this._.dialogDefinitions[a]
				},
				getCurrent: function() {
					return CKEDITOR.dialog._.currentTop
				},
				isTabEnabled: function(a, b, c) {
					a = a.config.removeDialogTabs;
					return !(a && a.match(RegExp("(?:^|;)" + b + ":" + c + "(?:$|;)", "i")))
				},
				okButton: function() {
					var a = function(a, b) {
						b = b || {};
						return CKEDITOR.tools.extend({
							id: "ok",
							type: "button",
							label: a.lang.common.ok,
							"class": "cke_dialog_ui_button_ok",
							onClick: function(a) {
								a = a.data.dialog;
								a.fire("ok", {
									hide: true
								}).hide !== false && a.hide()
							}
						}, b, true)
					};
					a.type = "button";
					a.override = function(b) {
						return CKEDITOR.tools.extend(function(c) {
							return a(c, b)
						}, {
							type: "button"
						}, true)
					};
					return a
				}(),
				cancelButton: function() {
					var a = function(a, b) {
						b = b || {};
						return CKEDITOR.tools.extend({
							id: "cancel",
							type: "button",
							label: a.lang.common.cancel,
							"class": "cke_dialog_ui_button_cancel",
							onClick: function(a) {
								a = a.data.dialog;
								a.fire("cancel", {
									hide: true
								}).hide !== false && a.hide()
							}
						}, b, true)
					};
					a.type = "button";
					a.override = function(b) {
						return CKEDITOR.tools.extend(function(c) {
							return a(c, b)
						}, {
							type: "button"
						}, true)
					};
					return a
				}(),
				addUIElement: function(a, b) {
					this._.uiElementBuilders[a] = b
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
			var s = {
					resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
					minWidth: 600,
					minHeight: 400,
					buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton]
				},
				t = function(a, b, c) {
					for (var d = 0, f; f = a[d]; d++) {
						if (f.id == b) return f;
						if (c && f[c])
							if (f = t(f[c], b, c)) return f
					}
					return null
				},
				p = function(a, b, c, d, f) {
					if (c) {
						for (var e = 0, h; h = a[e]; e++) {
							if (h.id == c) {
								a.splice(e, 0, b);
								return b
							}
							if (d &&
								h[d])
								if (h = p(h[d], b, c, d, true)) return h
						}
						if (f) return null
					}
					a.push(b);
					return b
				},
				x = function(a, b, c) {
					for (var d = 0, f; f = a[d]; d++) {
						if (f.id == b) return a.splice(d, 1);
						if (c && f[c])
							if (f = x(f[c], b, c)) return f
					}
					return null
				},
				q = function(a, b) {
					this.dialog = a;
					for (var c = b.contents, d = 0, f; f = c[d]; d++) c[d] = f && new g(a, f);
					CKEDITOR.tools.extend(this, b)
				};
			q.prototype = {
				getContents: function(a) {
					return t(this.contents, a)
				},
				getButton: function(a) {
					return t(this.buttons, a)
				},
				addContents: function(a, b) {
					return p(this.contents, a, b)
				},
				addButton: function(a,
					b) {
					return p(this.buttons, a, b)
				},
				removeContents: function(a) {
					x(this.contents, a)
				},
				removeButton: function(a) {
					x(this.buttons, a)
				}
			};
			g.prototype = {
				get: function(a) {
					return t(this.elements, a, "children")
				},
				add: function(a, b) {
					return p(this.elements, a, b, "children")
				},
				remove: function(a) {
					x(this.elements, a, "children")
				}
			};
			var u, B = {},
				v, z = {},
				w = function(a) {
					var b = a.data.$.ctrlKey || a.data.$.metaKey,
						c = a.data.$.altKey,
						d = a.data.$.shiftKey,
						f = String.fromCharCode(a.data.$.keyCode);
					if ((b = z[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (d ? "SHIFT+" : "") +
						f]) && b.length) {
						b = b[b.length - 1];
						b.keydown && b.keydown.call(b.uiElement, b.dialog, b.key);
						a.data.preventDefault()
					}
				},
				D = function(a) {
					var b = a.data.$.ctrlKey || a.data.$.metaKey,
						c = a.data.$.altKey,
						d = a.data.$.shiftKey,
						f = String.fromCharCode(a.data.$.keyCode);
					if ((b = z[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (d ? "SHIFT+" : "") + f]) && b.length) {
						b = b[b.length - 1];
						if (b.keyup) {
							b.keyup.call(b.uiElement, b.dialog, b.key);
							a.data.preventDefault()
						}
					}
				},
				A = function(a, b, c, d, f) {
					(z[c] || (z[c] = [])).push({
						uiElement: a,
						dialog: b,
						key: c,
						keyup: f || a.accessKeyUp,
						keydown: d || a.accessKeyDown
					})
				},
				I = function(a) {
					for (var b in z) {
						for (var c = z[b], d = c.length - 1; d >= 0; d--)(c[d].dialog == a || c[d].uiElement == a) && c.splice(d, 1);
						c.length === 0 && delete z[b]
					}
				},
				K = function(a, b) {
					a._.accessKeyMap[b] && a.selectPage(a._.accessKeyMap[b])
				},
				C = function() {};
			(function() {
				CKEDITOR.ui.dialog = {
					uiElement: function(a, b, c, d, f, e, h) {
						if (!(arguments.length < 4)) {
							var g = (d.call ? d(b) : d) || "div",
								i = ["<", g, " "],
								j = (f && f.call ? f(b) : f) || {},
								k = (e && e.call ? e(b) : e) || {},
								n = (h && h.call ? h.call(this, a, b) : h) || "",
								l = this.domId = k.id ||
								CKEDITOR.tools.getNextId() + "_uiElement";
							this.id = b.id;
							if (b.requiredContent && !a.getParentEditor().filter.check(b.requiredContent)) {
								j.display = "none";
								this.notAllowed = true
							}
							k.id = l;
							var m = {};
							b.type && (m["cke_dialog_ui_" + b.type] = 1);
							b.className && (m[b.className] = 1);
							b.disabled && (m.cke_disabled = 1);
							for (var p = k["class"] && k["class"].split ? k["class"].split(" ") : [], l = 0; l < p.length; l++) p[l] && (m[p[l]] = 1);
							p = [];
							for (l in m) p.push(l);
							k["class"] = p.join(" ");
							if (b.title) k.title = b.title;
							m = (b.style || "").split(";");
							if (b.align) {
								p =
									b.align;
								j["margin-left"] = p == "left" ? 0 : "auto";
								j["margin-right"] = p == "right" ? 0 : "auto"
							}
							for (l in j) m.push(l + ":" + j[l]);
							b.hidden && m.push("display:none");
							for (l = m.length - 1; l >= 0; l--) m[l] === "" && m.splice(l, 1);
							if (m.length > 0) k.style = (k.style ? k.style + "; " : "") + m.join("; ");
							for (l in k) i.push(l + '="' + CKEDITOR.tools.htmlEncode(k[l]) + '" ');
							i.push(">", n, "</", g, ">");
							c.push(i.join(""));
							(this._ || (this._ = {})).dialog = a;
							if (typeof b.isChanged == "boolean") this.isChanged = function() {
								return b.isChanged
							};
							if (typeof b.isChanged == "function") this.isChanged =
								b.isChanged;
							if (typeof b.setValue == "function") this.setValue = CKEDITOR.tools.override(this.setValue, function(a) {
								return function(c) {
									a.call(this, b.setValue.call(this, c))
								}
							});
							if (typeof b.getValue == "function") this.getValue = CKEDITOR.tools.override(this.getValue, function(a) {
								return function() {
									return b.getValue.call(this, a.call(this))
								}
							});
							CKEDITOR.event.implementOn(this);
							this.registerEvents(b);
							this.accessKeyUp && (this.accessKeyDown && b.accessKey) && A(this, a, "CTRL+" + b.accessKey);
							var o = this;
							a.on("load", function() {
								var b =
									o.getInputElement();
								if (b) {
									var c = o.type in {
										checkbox: 1,
										ratio: 1
									} && CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? "cke_dialog_ui_focused" : "";
									b.on("focus", function() {
										a._.tabBarMode = false;
										a._.hasFocus = true;
										o.fire("focus");
										c && this.addClass(c)
									});
									b.on("blur", function() {
										o.fire("blur");
										c && this.removeClass(c)
									})
								}
							});
							CKEDITOR.tools.extend(this, b);
							if (this.keyboardFocusable) {
								this.tabIndex = b.tabIndex || 0;
								this.focusIndex = a._.focusList.push(this) - 1;
								this.on("focus", function() {
									a._.currentFocusIndex = o.focusIndex
								})
							}
						}
					},
					hbox: function(a,
						b, c, d, f) {
						if (!(arguments.length < 4)) {
							this._ || (this._ = {});
							var e = this._.children = b,
								h = f && f.widths || null,
								g = f && f.height || null,
								i, j = {
									role: "presentation"
								};
							f && f.align && (j.align = f.align);
							CKEDITOR.ui.dialog.uiElement.call(this, a, f || {
								type: "hbox"
							}, d, "table", {}, j, function() {
								var a = ['<tbody><tr class="cke_dialog_ui_hbox">'];
								for (i = 0; i < c.length; i++) {
									var b = "cke_dialog_ui_hbox_child",
										d = [];
									i === 0 && (b = "cke_dialog_ui_hbox_first");
									i == c.length - 1 && (b = "cke_dialog_ui_hbox_last");
									a.push('<td class="', b, '" role="presentation" ');
									h ? h[i] && d.push("width:" + l(h[i])) : d.push("width:" + Math.floor(100 / c.length) + "%");
									g && d.push("height:" + l(g));
									f && f.padding != void 0 && d.push("padding:" + l(f.padding));
									CKEDITOR.env.ie && (CKEDITOR.env.quirks && e[i].align) && d.push("text-align:" + e[i].align);
									d.length > 0 && a.push('style="' + d.join("; ") + '" ');
									a.push(">", c[i], "</td>")
								}
								a.push("</tr></tbody>");
								return a.join("")
							})
						}
					},
					vbox: function(a, b, c, d, f) {
						if (!(arguments.length < 3)) {
							this._ || (this._ = {});
							var e = this._.children = b,
								h = f && f.width || null,
								g = f && f.heights || null;
							CKEDITOR.ui.dialog.uiElement.call(this,
								a, f || {
									type: "vbox"
								}, d, "div", null, {
									role: "presentation"
								}, function() {
									var b = ['<table role="presentation" cellspacing="0" border="0" '];
									b.push('style="');
									f && f.expand && b.push("height:100%;");
									b.push("width:" + l(h || "100%"), ";");
									CKEDITOR.env.webkit && b.push("float:none;");
									b.push('"');
									b.push('align="', CKEDITOR.tools.htmlEncode(f && f.align || (a.getParentEditor().lang.dir == "ltr" ? "left" : "right")), '" ');
									b.push("><tbody>");
									for (var d = 0; d < c.length; d++) {
										var i = [];
										b.push('<tr><td role="presentation" ');
										h && i.push("width:" +
											l(h || "100%"));
										g ? i.push("height:" + l(g[d])) : f && f.expand && i.push("height:" + Math.floor(100 / c.length) + "%");
										f && f.padding != void 0 && i.push("padding:" + l(f.padding));
										CKEDITOR.env.ie && (CKEDITOR.env.quirks && e[d].align) && i.push("text-align:" + e[d].align);
										i.length > 0 && b.push('style="', i.join("; "), '" ');
										b.push(' class="cke_dialog_ui_vbox_child">', c[d], "</td></tr>")
									}
									b.push("</tbody></table>");
									return b.join("")
								})
						}
					}
				}
			})();
			CKEDITOR.ui.dialog.uiElement.prototype = {
				getElement: function() {
					return CKEDITOR.document.getById(this.domId)
				},
				getInputElement: function() {
					return this.getElement()
				},
				getDialog: function() {
					return this._.dialog
				},
				setValue: function(a, b) {
					this.getInputElement().setValue(a);
					!b && this.fire("change", {
						value: a
					});
					return this
				},
				getValue: function() {
					return this.getInputElement().getValue()
				},
				isChanged: function() {
					return false
				},
				selectParentTab: function() {
					for (var a = this.getInputElement();
						(a = a.getParent()) && a.$.className.search("cke_dialog_page_contents") == -1;);
					if (!a) return this;
					a = a.getAttribute("name");
					this._.dialog._.currentTabId !=
						a && this._.dialog.selectPage(a);
					return this
				},
				focus: function() {
					this.selectParentTab().getInputElement().focus();
					return this
				},
				registerEvents: function(a) {
					var b = /^on([A-Z]\w+)/,
						c, d = function(a, b, c, d) {
							b.on("load", function() {
								a.getInputElement().on(c, d, a)
							})
						},
						f;
					for (f in a)
						if (c = f.match(b)) this.eventProcessors[f] ? this.eventProcessors[f].call(this, this._.dialog, a[f]) : d(this, this._.dialog, c[1].toLowerCase(), a[f]);
					return this
				},
				eventProcessors: {
					onLoad: function(a, b) {
						a.on("load", b, this)
					},
					onShow: function(a, b) {
						a.on("show",
							b, this)
					},
					onHide: function(a, b) {
						a.on("hide", b, this)
					}
				},
				accessKeyDown: function() {
					this.focus()
				},
				accessKeyUp: function() {},
				disable: function() {
					var a = this.getElement();
					this.getInputElement().setAttribute("disabled", "true");
					a.addClass("cke_disabled")
				},
				enable: function() {
					var a = this.getElement();
					this.getInputElement().removeAttribute("disabled");
					a.removeClass("cke_disabled")
				},
				isEnabled: function() {
					return !this.getElement().hasClass("cke_disabled")
				},
				isVisible: function() {
					return this.getInputElement().isVisible()
				},
				isFocusable: function() {
					return !this.isEnabled() || !this.isVisible() ? false : true
				}
			};
			CKEDITOR.ui.dialog.hbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
				getChild: function(a) {
					if (arguments.length < 1) return this._.children.concat();
					a.splice || (a = [a]);
					return a.length < 2 ? this._.children[a[0]] : this._.children[a[0]] && this._.children[a[0]].getChild ? this._.children[a[0]].getChild(a.slice(1, a.length)) : null
				}
			}, true);
			CKEDITOR.ui.dialog.vbox.prototype = new CKEDITOR.ui.dialog.hbox;
			(function() {
				var a = {
					build: function(a, b, c) {
						for (var d = b.children, f, e = [], h = [], g = 0; g < d.length && (f = d[g]); g++) {
							var i = [];
							e.push(i);
							h.push(CKEDITOR.dialog._.uiElementBuilders[f.type].build(a, f, i))
						}
						return new CKEDITOR.ui.dialog[b.type](a, h, e, c, b)
					}
				};
				CKEDITOR.dialog.addUIElement("hbox", a);
				CKEDITOR.dialog.addUIElement("vbox", a)
			})();
			CKEDITOR.dialogCommand = function(a, b) {
				this.dialogName = a;
				CKEDITOR.tools.extend(this, b, true)
			};
			CKEDITOR.dialogCommand.prototype = {
				exec: function(a) {
					a.openDialog(this.dialogName)
				},
				canUndo: false,
				editorFocus: 1
			};
			(function() {
				var a = /^([a]|[^a])+$/,
					b = /^\d*$/,
					c = /^\d*(?:\.\d+)?$/,
					d = /^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/,
					f = /^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i,
					e = /^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;
				CKEDITOR.VALIDATE_OR = 1;
				CKEDITOR.VALIDATE_AND = 2;
				CKEDITOR.dialog.validate = {
					functions: function() {
						var a = arguments;
						return function() {
							var b = this && this.getValue ? this.getValue() : a[0],
								c = void 0,
								d = CKEDITOR.VALIDATE_AND,
								f = [],
								e;
							for (e = 0; e < a.length; e++)
								if (typeof a[e] == "function") f.push(a[e]);
								else break;
							if (e < a.length &&
								typeof a[e] == "string") {
								c = a[e];
								e++
							}
							e < a.length && typeof a[e] == "number" && (d = a[e]);
							var h = d == CKEDITOR.VALIDATE_AND ? true : false;
							for (e = 0; e < f.length; e++) h = d == CKEDITOR.VALIDATE_AND ? h && f[e](b) : h || f[e](b);
							return !h ? c : true
						}
					},
					regex: function(a, b) {
						return function(c) {
							c = this && this.getValue ? this.getValue() : c;
							return !a.test(c) ? b : true
						}
					},
					notEmpty: function(b) {
						return this.regex(a, b)
					},
					integer: function(a) {
						return this.regex(b, a)
					},
					number: function(a) {
						return this.regex(c, a)
					},
					cssLength: function(a) {
						return this.functions(function(a) {
								return f.test(CKEDITOR.tools.trim(a))
							},
							a)
					},
					htmlLength: function(a) {
						return this.functions(function(a) {
							return d.test(CKEDITOR.tools.trim(a))
						}, a)
					},
					inlineStyle: function(a) {
						return this.functions(function(a) {
							return e.test(CKEDITOR.tools.trim(a))
						}, a)
					},
					equals: function(a, b) {
						return this.functions(function(b) {
							return b == a
						}, b)
					},
					notEqual: function(a, b) {
						return this.functions(function(b) {
							return b != a
						}, b)
					}
				};
				CKEDITOR.on("instanceDestroyed", function(a) {
					if (CKEDITOR.tools.isEmpty(CKEDITOR.instances)) {
						for (var b; b = CKEDITOR.dialog._.currentTop;) b.hide();
						for (var c in B) B[c].remove();
						B = {}
					}
					var a = a.editor._.storedDialogs,
						d;
					for (d in a) a[d].destroy()
				})
			})();
			CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
				openDialog: function(a, b) {
					var c = null,
						d = CKEDITOR.dialog._.dialogDefinitions[a];
					CKEDITOR.dialog._.currentTop === null && o(this);
					if (typeof d == "function") {
						c = this._.storedDialogs || (this._.storedDialogs = {});
						c = c[a] || (c[a] = new CKEDITOR.dialog(this, a));
						b && b.call(c, c);
						c.show()
					} else {
						if (d == "failed") {
							r(this);
							throw Error('[CKEDITOR.dialog.openDialog] Dialog "' + a + '" failed when loading definition.');
						}
						typeof d == "string" && CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(d), function() {
							typeof CKEDITOR.dialog._.dialogDefinitions[a] != "function" && (CKEDITOR.dialog._.dialogDefinitions[a] = "failed");
							this.openDialog(a, b)
						}, this, 0, 1)
					}
					CKEDITOR.skin.loadPart("dialog");
					return c
				}
			})
		}(), CKEDITOR.plugins.add("dialog", {
			requires: "dialogui",
			init: function(a) {
				a.on("doubleclick", function(e) {
					e.data.dialog && a.openDialog(e.data.dialog)
				}, null, null, 999)
			}
		}), CKEDITOR.plugins.colordialog = {
			requires: "dialog",
			init: function(a) {
				var e = new CKEDITOR.dialogCommand("colordialog");
				e.editorFocus = false;
				a.addCommand("colordialog", e);
				CKEDITOR.dialog.add("colordialog", this.path + "dialogs/colordialog.js");
				a.getColorFromDialog = function(b, d) {
					var f = function(a) {
							this.removeListener("ok", f);
							this.removeListener("cancel", f);
							a = a.name == "ok" ? this.getValueOf("picker", "selectedColor") : null;
							b.call(d, a)
						},
						c = function(a) {
							a.on("ok", f);
							a.on("cancel", f)
						};
					a.execCommand("colordialog");
					if (a._.storedDialogs && a._.storedDialogs.colordialog) c(a._.storedDialogs.colordialog);
					else CKEDITOR.on("dialogDefinition",
						function(a) {
							if (a.data.name == "colordialog") {
								var b = a.data.definition;
								a.removeListener();
								b.onLoad = CKEDITOR.tools.override(b.onLoad, function(a) {
									return function() {
										c(this);
										b.onLoad = a;
										typeof a == "function" && a.call(this)
									}
								})
							}
						})
				}
			}
		}, CKEDITOR.plugins.add("colordialog", CKEDITOR.plugins.colordialog), "use strict",
		function() {
			function a(a) {
				function b() {
					var c = a.editable();
					c.on(z, function(a) {
						(!CKEDITOR.env.ie || !u) && p(a)
					});
					CKEDITOR.env.ie && c.on("paste", function(b) {
						if (!B) {
							f();
							b.data.preventDefault();
							p(b);
							o("paste") || a.openDialog("paste")
						}
					});
					if (CKEDITOR.env.ie) {
						c.on("contextmenu", e, null, null, 0);
						c.on("beforepaste", function(a) {
							a.data && !a.data.$.ctrlKey && e()
						}, null, null, 0)
					}
					c.on("beforecut", function() {
						!u && l(a)
					});
					var d;
					c.attachListener(CKEDITOR.env.ie ? c : a.document.getDocumentElement(), "mouseup", function() {
						d = setTimeout(function() {
							x()
						}, 0)
					});
					a.on("destroy", function() {
						clearTimeout(d)
					});
					c.on("keyup", x)
				}

				function c(b) {
					return {
						type: b,
						canUndo: b == "cut",
						startDisabled: true,
						exec: function() {
							this.type == "cut" && l();
							var b;
							var c = this.type;
							if (CKEDITOR.env.ie) b =
								o(c);
							else try {
								b = a.document.$.execCommand(c, false, null)
							} catch (d) {
								b = false
							}
							b || alert(a.lang.clipboard[this.type + "Error"]);
							return b
						}
					}
				}

				function d() {
					return {
						canUndo: false,
						async: true,
						exec: function(a, b) {
							var c = function(b, c) {
									b && r(b.type, b.dataValue, !!c);
									a.fire("afterCommandExec", {
										name: "paste",
										command: d,
										returnValue: !!b
									})
								},
								d = this;
							typeof b == "string" ? c({
								type: "auto",
								dataValue: b
							}, 1) : a.getClipboardData(c)
						}
					}
				}

				function f() {
					B = 1;
					setTimeout(function() {
						B = 0
					}, 100)
				}

				function e() {
					u = 1;
					setTimeout(function() {
						u = 0
					}, 10)
				}

				function o(b) {
					var c =
						a.document,
						d = c.getBody(),
						f = false,
						e = function() {
							f = true
						};
					d.on(b, e);
					(CKEDITOR.env.version > 7 ? c.$ : c.$.selection.createRange()).execCommand(b);
					d.removeListener(b, e);
					return f
				}

				function r(b, c, d) {
					b = {
						type: b
					};
					if (d && a.fire("beforePaste", b) === false || !c) return false;
					b.dataValue = c;
					return a.fire("paste", b)
				}

				function l() {
					if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
						var b = a.getSelection(),
							c, d, f;
						if (b.getType() == CKEDITOR.SELECTION_ELEMENT && (c = b.getSelectedElement())) {
							d = b.getRanges()[0];
							f = a.document.createText("");
							f.insertBefore(c);
							d.setStartBefore(f);
							d.setEndAfter(c);
							b.selectRanges([d]);
							setTimeout(function() {
								if (c.getParent()) {
									f.remove();
									b.selectElement(c)
								}
							}, 0)
						}
					}
				}

				function m(b, c) {
					var d = a.document,
						f = a.editable(),
						e = function(a) {
							a.cancel()
						},
						g;
					if (!d.getById("cke_pastebin")) {
						var i = a.getSelection(),
							j = i.createBookmarks(),
							k = new CKEDITOR.dom.element((CKEDITOR.env.webkit || f.is("body")) && !CKEDITOR.env.ie ? "body" : "div", d);
						k.setAttributes({
							id: "cke_pastebin",
							"data-cke-temp": "1"
						});
						var l = 0,
							d = d.getWindow();
						if (CKEDITOR.env.webkit) {
							f.append(k);
							k.addClass("cke_editable");
							if (!f.is("body")) {
								l = f.getComputedStyle("position") != "static" ? f : CKEDITOR.dom.element.get(f.$.offsetParent);
								l = l.getDocumentPosition().y
							}
						} else f.getAscendant(CKEDITOR.env.ie ? "body" : "html", 1).append(k);
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
							k.setAttribute("contenteditable", true)
						} else k.setStyle(a.config.contentsLangDirection ==
							"ltr" ? "left" : "right", "-1000px");
						a.on("selectionChange", e, null, null, 0);
						if (CKEDITOR.env.webkit || CKEDITOR.env.gecko) g = f.once("blur", e, null, null, -100);
						l && k.focus();
						l = new CKEDITOR.dom.range(k);
						l.selectNodeContents(k);
						var m = l.select();
						CKEDITOR.env.ie && (g = f.once("blur", function() {
							a.lockSelection(m)
						}));
						var n = CKEDITOR.document.getWindow().getScrollPosition().y;
						setTimeout(function() {
							if (CKEDITOR.env.webkit) CKEDITOR.document.getBody().$.scrollTop = n;
							g && g.removeListener();
							CKEDITOR.env.ie && f.focus();
							i.selectBookmarks(j);
							k.remove();
							var b;
							if (CKEDITOR.env.webkit && (b = k.getFirst()) && b.is && b.hasClass("Apple-style-span")) k = b;
							a.removeListener("selectionChange", e);
							c(k.getHtml())
						}, 0)
					}
				}

				function s() {
					if (CKEDITOR.env.ie) {
						a.focus();
						f();
						var b = a.focusManager;
						b.lock();
						if (a.editable().fire(z) && !o("paste")) {
							b.unlock();
							return false
						}
						b.unlock()
					} else try {
						if (a.editable().fire(z) && !a.document.$.execCommand("Paste", false, null)) throw 0;
					} catch (c) {
						return false
					}
					return true
				}

				function t(b) {
					if (a.mode == "wysiwyg") switch (b.data.keyCode) {
						case CKEDITOR.CTRL +
						86:
						case CKEDITOR.SHIFT + 45:
							b = a.editable();
							f();
							!CKEDITOR.env.ie && b.fire("beforepaste");
							break;
						case CKEDITOR.CTRL + 88:
						case CKEDITOR.SHIFT + 46:
							a.fire("saveSnapshot");
							setTimeout(function() {
								a.fire("saveSnapshot")
							}, 50)
					}
				}

				function p(b) {
					var c = {
							type: "auto"
						},
						d = a.fire("beforePaste", c);
					m(b, function(a) {
						a = a.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, "");
						d && r(c.type, a, 0, 1)
					})
				}

				function x() {
					if (a.mode == "wysiwyg") {
						var b = q("paste");
						a.getCommand("cut").setState(q("cut"));
						a.getCommand("copy").setState(q("copy"));
						a.getCommand("paste").setState(b);
						a.fire("pasteState", b)
					}
				}

				function q(b) {
					if (v && b in {
						paste: 1,
						cut: 1
					}) return CKEDITOR.TRISTATE_DISABLED;
					if (b == "paste") return CKEDITOR.TRISTATE_OFF;
					var b = a.getSelection(),
						c = b.getRanges();
					return b.getType() == CKEDITOR.SELECTION_NONE || c.length == 1 && c[0].collapsed ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF
				}
				var u = 0,
					B = 0,
					v = 0,
					z = CKEDITOR.env.ie ? "beforepaste" : "paste";
				(function() {
					a.on("key", t);
					a.on("contentDom", b);
					a.on("selectionChange", function(a) {
						v = a.data.selection.getRanges()[0].checkReadOnly();
						x()
					});
					a.contextMenu && a.contextMenu.addListener(function(a, b) {
						v = b.getRanges()[0].checkReadOnly();
						return {
							cut: q("cut"),
							copy: q("copy"),
							paste: q("paste")
						}
					})
				})();
				(function() {
					function b(c, d, f, e, g) {
						var i = a.lang.clipboard[d];
						a.addCommand(d, f);
						a.ui.addButton && a.ui.addButton(c, {
							label: i,
							command: d,
							toolbar: "clipboard," + e
						});
						a.addMenuItems && a.addMenuItem(d, {
							label: i,
							command: d,
							group: "clipboard",
							order: g
						})
					}
					b("Cut", "cut", c("cut"), 10, 1);
					b("Copy", "copy", c("copy"), 20, 4);
					b("Paste", "paste", d(), 30, 8)
				})();
				a.getClipboardData =
					function(b, c) {
						function d(a) {
							a.removeListener();
							a.cancel();
							c(a.data)
						}

						function f(a) {
							a.removeListener();
							a.cancel();
							j = true;
							c({
								type: i,
								dataValue: a.data
							})
						}

						function e() {
							this.customTitle = b && b.title
						}
						var g = false,
							i = "auto",
							j = false;
						if (!c) {
							c = b;
							b = null
						}
						a.on("paste", d, null, null, 0);
						a.on("beforePaste", function(a) {
							a.removeListener();
							g = true;
							i = a.data.type
						}, null, null, 1E3);
						if (s() === false) {
							a.removeListener("paste", d);
							if (g && a.fire("pasteDialog", e)) {
								a.on("pasteDialogCommit", f);
								a.on("dialogHide", function(a) {
									a.removeListener();
									a.data.removeListener("pasteDialogCommit", f);
									setTimeout(function() {
										j || c(null)
									}, 10)
								})
							} else c(null)
						}
					}
			}

			function e(a) {
				if (CKEDITOR.env.webkit) {
					if (!a.match(/^[^<]*$/g) && !a.match(/^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi)) return "html"
				} else if (CKEDITOR.env.ie) {
					if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi) && !a.match(/^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi)) return "html"
				} else if (CKEDITOR.env.gecko) {
					if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi)) return "html"
				} else return "html";
				return "htmlifiedtext"
			}

			function b(a,
				b) {
				function d(a) {
					return CKEDITOR.tools.repeat("</p><p>", ~~(a / 2)) + (a % 2 == 1 ? "<br>" : "")
				}
				b = b.replace(/\s+/g, " ").replace(/> +</g, "><").replace(/<br ?\/>/gi, "<br>");
				b = b.replace(/<\/?[A-Z]+>/g, function(a) {
					return a.toLowerCase()
				});
				if (b.match(/^[^<]$/)) return b;
				if (CKEDITOR.env.webkit && b.indexOf("<div>") > -1) {
					b = b.replace(/^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g, "<br>").replace(/^(<div>(<br>|)<\/div>){2}(?!$)/g, "<div></div>");
					b.match(/<div>(<br>|)<\/div>/) && (b = "<p>" + b.replace(/(<div>(<br>|)<\/div>)+/g,
						function(a) {
							return d(a.split("</div><div>").length + 1)
						}) + "</p>");
					b = b.replace(/<\/div><div>/g, "<br>");
					b = b.replace(/<\/?div>/g, "")
				}
				if (CKEDITOR.env.gecko && a.enterMode != CKEDITOR.ENTER_BR) {
					CKEDITOR.env.gecko && (b = b.replace(/^<br><br>$/, "<br>"));
					b.indexOf("<br><br>") > -1 && (b = "<p>" + b.replace(/(<br>){2,}/g, function(a) {
						return d(a.length / 4)
					}) + "</p>")
				}
				return c(a, b)
			}

			function d() {
				var a = new CKEDITOR.htmlParser.filter,
					b = {
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
					},
					c = CKEDITOR.tools.extend({
							br: 0
						},
						CKEDITOR.dtd.$inline),
					d = {
						p: 1,
						br: 1,
						"cke:br": 1
					},
					f = CKEDITOR.dtd,
					e = CKEDITOR.tools.extend({
						area: 1,
						basefont: 1,
						embed: 1,
						iframe: 1,
						map: 1,
						object: 1,
						param: 1
					}, CKEDITOR.dtd.$nonBodyContent, CKEDITOR.dtd.$cdata),
					o = function(a) {
						delete a.name;
						a.add(new CKEDITOR.htmlParser.text(" "))
					},
					r = function(a) {
						for (var b = a, c;
							(b = b.next) && b.name && b.name.match(/^h\d$/);) {
							c = new CKEDITOR.htmlParser.element("cke:br");
							c.isEmpty = true;
							for (a.add(c); c = b.children.shift();) a.add(c)
						}
					};
				a.addRules({
					elements: {
						h1: r,
						h2: r,
						h3: r,
						h4: r,
						h5: r,
						h6: r,
						img: function(a) {
							var a =
								CKEDITOR.tools.trim(a.attributes.alt || ""),
								b = " ";
							a && !a.match(/(^http|\.(jpe?g|gif|png))/i) && (b = " [" + a + "] ");
							return new CKEDITOR.htmlParser.text(b)
						},
						td: o,
						th: o,
						$: function(a) {
							var h = a.name,
								o;
							if (e[h]) return false;
							a.attributes = {};
							if (h == "br") return a;
							if (b[h]) a.name = "p";
							else if (c[h]) delete a.name;
							else if (f[h]) {
								o = new CKEDITOR.htmlParser.element("cke:br");
								o.isEmpty = true;
								if (CKEDITOR.dtd.$empty[h]) return o;
								a.add(o, 0);
								o = o.clone();
								o.isEmpty = true;
								a.add(o);
								delete a.name
							}
							d[a.name] || delete a.name;
							return a
						}
					}
				}, {
					applyToAll: true
				});
				return a
			}

			function f(a, b, d) {
				var b = new CKEDITOR.htmlParser.fragment.fromHtml(b),
					f = new CKEDITOR.htmlParser.basicWriter;
				b.writeHtml(f, d);
				var b = f.getHtml(),
					b = b.replace(/\s*(<\/?[a-z:]+ ?\/?>)\s*/g, "$1").replace(/(<cke:br \/>){2,}/g, "<cke:br />").replace(/(<cke:br \/>)(<\/?p>|<br \/>)/g, "$2").replace(/(<\/?p>|<br \/>)(<cke:br \/>)/g, "$1").replace(/<(cke:)?br( \/)?>/g, "<br>").replace(/<p><\/p>/g, ""),
					e = 0,
					b = b.replace(/<\/?p>/g, function(a) {
						if (a == "<p>") {
							if (++e > 1) return "</p><p>"
						} else if (--e > 0) return "</p><p>";
						return a
					}).replace(/<p><\/p>/g, "");
				return c(a, b)
			}

			function c(a, b) {
				a.enterMode == CKEDITOR.ENTER_BR ? b = b.replace(/(<\/p><p>)+/g, function(a) {
					return CKEDITOR.tools.repeat("<br>", a.length / 7 * 2)
				}).replace(/<\/?p>/g, "") : a.enterMode == CKEDITOR.ENTER_DIV && (b = b.replace(/<(\/)?p>/g, "<$1div>"));
				return b
			}
			CKEDITOR.plugins.add("clipboard", {
				requires: "dialog",
				init: function(c) {
					var j;
					a(c);
					CKEDITOR.dialog.add("paste", CKEDITOR.getUrl(this.path + "dialogs/paste.js"));
					c.on("paste", function(a) {
						var b = a.data.dataValue,
							c = CKEDITOR.dtd.$block;
						if (b.indexOf("Apple-") > -1) {
							b = b.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi, " ");
							a.data.type != "html" && (b = b.replace(/<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi, function(a, b) {
								return b.replace(/\t/g, "&nbsp;&nbsp; &nbsp;")
							}));
							if (b.indexOf('<br class="Apple-interchange-newline">') > -1) {
								a.data.startsWithEOL = 1;
								a.data.preSniffing = "html";
								b = b.replace(/<br class="Apple-interchange-newline">/, "")
							}
							b = b.replace(/(<[^>]+) class="Apple-[^"]*"/gi, "$1")
						}
						if (b.match(/^<[^<]+cke_(editable|contents)/i)) {
							var d,
								f, e = new CKEDITOR.dom.element("div");
							for (e.setHtml(b); e.getChildCount() == 1 && (d = e.getFirst()) && d.type == CKEDITOR.NODE_ELEMENT && (d.hasClass("cke_editable") || d.hasClass("cke_contents"));) e = f = d;
							f && (b = f.getHtml().replace(/<br>$/i, ""))
						}
						CKEDITOR.env.ie ? b = b.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g, function(b, d) {
								if (d.toLowerCase() in c) {
									a.data.preSniffing = "html";
									return "<" + d
								}
								return b
							}) : CKEDITOR.env.webkit ? b = b.replace(/<\/(\w+)><div><br><\/div>$/, function(b, d) {
								if (d in c) {
									a.data.endsWithEOL = 1;
									return "</" + d + ">"
								}
								return b
							}) :
							CKEDITOR.env.gecko && (b = b.replace(/(\s)<br>$/, "$1"));
						a.data.dataValue = b
					}, null, null, 3);
					c.on("paste", function(a) {
						var a = a.data,
							i = a.type,
							k = a.dataValue,
							n, o = c.config.clipboard_defaultContentType || "html";
						n = i == "html" || a.preSniffing == "html" ? "html" : e(k);
						n == "htmlifiedtext" ? k = b(c.config, k) : i == "text" && n == "html" && (k = f(c.config, k, j || (j = d(c))));
						a.startsWithEOL && (k = '<br data-cke-eol="1">' + k);
						a.endsWithEOL && (k = k + '<br data-cke-eol="1">');
						i == "auto" && (i = n == "html" || o == "html" ? "html" : "text");
						a.type = i;
						a.dataValue = k;
						delete a.preSniffing;
						delete a.startsWithEOL;
						delete a.endsWithEOL
					}, null, null, 6);
					c.on("paste", function(a) {
						a = a.data;
						c.insertHtml(a.dataValue, a.type);
						setTimeout(function() {
							c.fire("afterPaste")
						}, 0)
					}, null, null, 1E3);
					c.on("pasteDialog", function(a) {
						setTimeout(function() {
							c.openDialog("paste", a.data)
						}, 0)
					})
				}
			})
		}(),
		function() {
			CKEDITOR.plugins.add("panel", {
				beforeInit: function(a) {
					a.ui.addHandler(CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler)
				}
			});
			CKEDITOR.UI_PANEL = "panel";
			CKEDITOR.ui.panel = function(a, b) {
				b && CKEDITOR.tools.extend(this, b);
				CKEDITOR.tools.extend(this, {
					className: "",
					css: []
				});
				this.id = CKEDITOR.tools.getNextId();
				this.document = a;
				this.isFramed = this.forceIFrame || this.css.length;
				this._ = {
					blocks: {}
				}
			};
			CKEDITOR.ui.panel.handler = {
				create: function(a) {
					return new CKEDITOR.ui.panel(a)
				}
			};
			var a = CKEDITOR.addTemplate("panel", '<div lang="{langCode}" id="{id}" dir={dir} class="cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style="z-index:{z-index}" role="presentation">{frame}</div>'),
				e = CKEDITOR.addTemplate("panel-frame", '<iframe id="{id}" class="cke_panel_frame" role="presentation" frameborder="0" src="{src}"></iframe>'),
				b = CKEDITOR.addTemplate("panel-frame-inner", '<!DOCTYPE html><html class="cke_panel_container {env}" dir="{dir}" lang="{langCode}"><head>{css}</head><body class="cke_{dir}" style="margin:0;padding:0" onload="{onload}"></body></html>');
			CKEDITOR.ui.panel.prototype = {
				render: function(d, f) {
					this.getHolderElement = function() {
						var a = this._.holder;
						if (!a) {
							if (this.isFramed) {
								var a = this.document.getById(this.id + "_frame"),
									d = a.getParent(),
									a = a.getFrameDocument();
								CKEDITOR.env.iOS && d.setStyles({
									overflow: "scroll",
									"-webkit-overflow-scrolling": "touch"
								});
								d = CKEDITOR.tools.addFunction(CKEDITOR.tools.bind(function() {
									this.isLoaded = true;
									if (this.onLoad) this.onLoad()
								}, this));
								a.write(b.output(CKEDITOR.tools.extend({
									css: CKEDITOR.tools.buildStyleHtml(this.css),
									onload: "window.parent.CKEDITOR.tools.callFunction(" + d + ");"
								}, c)));
								a.getWindow().$.CKEDITOR = CKEDITOR;
								a.on("keydown", function(a) {
									var b = a.data.getKeystroke(),
										c = this.document.getById(this.id).getAttribute("dir");
									this._.onKeyDown && this._.onKeyDown(b) === false ? a.data.preventDefault() : (b == 27 || b == (c == "rtl" ? 39 :
										37)) && this.onEscape && this.onEscape(b) === false && a.data.preventDefault()
								}, this);
								a = a.getBody();
								a.unselectable();
								CKEDITOR.env.air && CKEDITOR.tools.callFunction(d)
							} else a = this.document.getById(this.id);
							this._.holder = a
						}
						return a
					};
					var c = {
						editorId: d.id,
						id: this.id,
						langCode: d.langCode,
						dir: d.lang.dir,
						cls: this.className,
						frame: "",
						env: CKEDITOR.env.cssClass,
						"z-index": d.config.baseFloatZIndex + 1
					};
					if (this.isFramed) {
						var h = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent("document.open();(" +
							CKEDITOR.tools.fixDomain + ")();document.close();") + "}())" : "";
						c.frame = e.output({
							id: this.id + "_frame",
							src: h
						})
					}
					h = a.output(c);
					f && f.push(h);
					return h
				},
				addBlock: function(a, b) {
					b = this._.blocks[a] = b instanceof CKEDITOR.ui.panel.block ? b : new CKEDITOR.ui.panel.block(this.getHolderElement(), b);
					this._.currentBlock || this.showBlock(a);
					return b
				},
				getBlock: function(a) {
					return this._.blocks[a]
				},
				showBlock: function(a) {
					var a = this._.blocks[a],
						b = this._.currentBlock,
						c = !this.forceIFrame || CKEDITOR.env.ie ? this._.holder : this.document.getById(this.id +
							"_frame");
					b && b.hide();
					this._.currentBlock = a;
					CKEDITOR.fire("ariaWidget", c);
					a._.focusIndex = -1;
					this._.onKeyDown = a.onKeyDown && CKEDITOR.tools.bind(a.onKeyDown, a);
					a.show();
					return a
				},
				destroy: function() {
					this.element && this.element.remove()
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
					b && CKEDITOR.tools.extend(this, b);
					this.element.setAttributes({
						role: this.attributes.role ||
							"presentation",
						"aria-label": this.attributes["aria-label"],
						title: this.attributes.title || this.attributes["aria-label"]
					});
					this.keys = {};
					this._.focusIndex = -1;
					this.element.disableContextMenu()
				},
				_: {
					markItem: function(a) {
						if (a != -1) {
							a = this.element.getElementsByTag("a").getItem(this._.focusIndex = a);
							CKEDITOR.env.webkit && a.getDocument().getWindow().focus();
							a.focus();
							this.onMark && this.onMark(a)
						}
					}
				},
				proto: {
					show: function() {
						this.element.setStyle("display", "")
					},
					hide: function() {
						(!this.onHide || this.onHide.call(this) !==
							true) && this.element.setStyle("display", "none")
					},
					onKeyDown: function(a, b) {
						var c = this.keys[a];
						switch (c) {
							case "next":
								for (var e = this._.focusIndex, c = this.element.getElementsByTag("a"), j; j = c.getItem(++e);)
									if (j.getAttribute("_cke_focus") && j.$.offsetWidth) {
										this._.focusIndex = e;
										j.focus();
										break
									}
								if (!j && !b) {
									this._.focusIndex = -1;
									return this.onKeyDown(a, 1)
								}
								return false;
							case "prev":
								e = this._.focusIndex;
								for (c = this.element.getElementsByTag("a"); e > 0 && (j = c.getItem(--e));) {
									if (j.getAttribute("_cke_focus") && j.$.offsetWidth) {
										this._.focusIndex =
											e;
										j.focus();
										break
									}
									j = null
								}
								if (!j && !b) {
									this._.focusIndex = c.count();
									return this.onKeyDown(a, 1)
								}
								return false;
							case "click":
							case "mouseup":
								e = this._.focusIndex;
								(j = e >= 0 && this.element.getElementsByTag("a").getItem(e)) && (j.$[c] ? j.$[c]() : j.$["on" + c]());
								return false
						}
						return true
					}
				}
			})
		}(), CKEDITOR.plugins.add("floatpanel", {
			requires: "panel"
		}),
		function() {
			function a(a, d, f, c, h) {
				var h = CKEDITOR.tools.genKey(d.getUniqueId(), f.getUniqueId(), a.lang.dir, a.uiColor || "", c.css || "", h || ""),
					j = e[h];
				if (!j) {
					j = e[h] = new CKEDITOR.ui.panel(d,
						c);
					j.element = f.append(CKEDITOR.dom.element.createFromHtml(j.render(a), d));
					j.element.setStyles({
						display: "none",
						position: "absolute"
					})
				}
				return j
			}
			var e = {};
			CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({
				$: function(b, d, f, c) {
					function e() {
						k.hide()
					}
					f.forceIFrame = 1;
					f.toolbarRelated && b.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && (d = CKEDITOR.document.getById("cke_" + b.name));
					var j = d.getDocument(),
						c = a(b, j, d, f, c || 0),
						g = c.element,
						i = g.getFirst(),
						k = this;
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
					if (!CKEDITOR.env.iOS) j.getWindow().on("resize", e)
				},
				proto: {
					addBlock: function(a, d) {
						return this._.panel.addBlock(a, d)
					},
					addListBlock: function(a, d) {
						return this._.panel.addListBlock(a, d)
					},
					getBlock: function(a) {
						return this._.panel.getBlock(a)
					},
					showBlock: function(a, d, f, c, e, j) {
						var g = this._.panel,
							i = g.showBlock(a);
						this.allowBlur(false);
						a = this._.editor.editable();
						this._.returnFocus = a.hasFocus ? a : new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);
						this._.hideTimeout = 0;
						var k = this.element,
							a = this._.iframe,
							a = CKEDITOR.env.ie ? a : new CKEDITOR.dom.window(a.$.contentWindow),
							n = k.getDocument(),
							o = this._.parentElement.getPositionedAncestor(),
							r = d.getDocumentPosition(n),
							n = o ? o.getDocumentPosition(n) : {
								x: 0,
								y: 0
							},
							l = this._.dir == "rtl",
							m = r.x + (c || 0) - n.x,
							s = r.y + (e || 0) - n.y;
						if (l && (f == 1 || f == 4)) m = m + d.$.offsetWidth;
						else if (!l && (f == 2 || f == 3)) m = m + (d.$.offsetWidth - 1);
						if (f == 3 || f == 4) s = s + (d.$.offsetHeight - 1);
						this._.panel._.offsetParentId = d.getId();
						k.setStyles({
							top: s + "px",
							left: 0,
							display: ""
						});
						k.setOpacity(0);
						k.getFirst().removeStyle("width");
						this._.editor.focusManager.add(a);
						if (!this._.blurSet) {
							CKEDITOR.event.useCapture = true;
							a.on("blur", function(a) {
								function b() {
									delete this._.returnFocus;
									this.hide()
								}
								if (this.allowBlur() && a.data.getPhase() == CKEDITOR.EVENT_PHASE_AT_TARGET && this.visible && !this._.activeChild)
									if (CKEDITOR.env.iOS) {
										if (!this._.hideTimeout) this._.hideTimeout = CKEDITOR.tools.setTimeout(b, 0, this)
									} else b.call(this)
							}, this);
							a.on("focus", function() {
								this._.focused = true;
								this.hideChild();
								this.allowBlur(true)
							}, this);
							if (CKEDITOR.env.iOS) {
								a.on("touchstart", function() {
									clearTimeout(this._.hideTimeout)
								}, this);
								a.on("touchend", function() {
									this._.hideTimeout = 0;
									this.focus()
								}, this)
							}
							CKEDITOR.event.useCapture = false;
							this._.blurSet = 1
						}
						g.onEscape = CKEDITOR.tools.bind(function(a) {
							if (this.onEscape && this.onEscape(a) === false) return false
						}, this);
						CKEDITOR.tools.setTimeout(function() {
							var a = CKEDITOR.tools.bind(function() {
								k.removeStyle("width");
								if (i.autoSize) {
									var a = i.element.getDocument(),
										a = (CKEDITOR.env.webkit ?
											i.element : a.getBody()).$.scrollWidth;
									CKEDITOR.env.ie && (CKEDITOR.env.quirks && a > 0) && (a = a + ((k.$.offsetWidth || 0) - (k.$.clientWidth || 0) + 3));
									k.setStyle("width", a + 10 + "px");
									a = i.element.$.scrollHeight;
									CKEDITOR.env.ie && (CKEDITOR.env.quirks && a > 0) && (a = a + ((k.$.offsetHeight || 0) - (k.$.clientHeight || 0) + 3));
									k.setStyle("height", a + "px");
									g._.currentBlock.element.setStyle("display", "none").removeStyle("display")
								} else k.removeStyle("height");
								l && (m = m - k.$.offsetWidth);
								k.setStyle("left", m + "px");
								var b = g.element.getWindow(),
									a = k.$.getBoundingClientRect(),
									b = b.getViewPaneSize(),
									c = a.width || a.right - a.left,
									d = a.height || a.bottom - a.top,
									f = l ? a.right : b.width - a.left,
									e = l ? b.width - a.right : a.left;
								l ? f < c && (m = e > c ? m + c : b.width > c ? m - a.left : m - a.right + b.width) : f < c && (m = e > c ? m - c : b.width > c ? m - a.right + b.width : m - a.left);
								c = a.top;
								b.height - a.top < d && (s = c > d ? s - d : b.height > d ? s - a.bottom + b.height : s - a.top);
								if (CKEDITOR.env.ie) {
									b = a = new CKEDITOR.dom.element(k.$.offsetParent);
									b.getName() == "html" && (b = b.getDocument().getBody());
									b.getComputedStyle("direction") == "rtl" &&
										(m = CKEDITOR.env.ie8Compat ? m - k.getDocument().getDocumentElement().$.scrollLeft * 2 : m - (a.$.scrollWidth - a.$.clientWidth))
								}
								var a = k.getFirst(),
									h;
								(h = a.getCustomData("activePanel")) && h.onHide && h.onHide.call(this, 1);
								a.setCustomData("activePanel", this);
								k.setStyles({
									top: s + "px",
									left: m + "px"
								});
								k.setOpacity(1);
								j && j()
							}, this);
							g.isLoaded ? a() : g.onLoad = a;
							CKEDITOR.tools.setTimeout(function() {
								var a = CKEDITOR.env.webkit && CKEDITOR.document.getWindow().getScrollPosition().y;
								this.focus();
								i.element.focus();
								if (CKEDITOR.env.webkit) CKEDITOR.document.getBody().$.scrollTop =
									a;
								this.allowBlur(true);
								this._.editor.fire("panelShow", this)
							}, 0, this)
						}, CKEDITOR.env.air ? 200 : 0, this);
						this.visible = 1;
						this.onShow && this.onShow.call(this)
					},
					focus: function() {
						if (CKEDITOR.env.webkit) {
							var a = CKEDITOR.document.getActive();
							!a.equals(this._.iframe) && a.$.blur()
						}(this._.lastFocused || this._.iframe.getFrameDocument().getWindow()).focus()
					},
					blur: function() {
						var a = this._.iframe.getFrameDocument().getActive();
						a.is("a") && (this._.lastFocused = a)
					},
					hide: function(a) {
						if (this.visible && (!this.onHide || this.onHide.call(this) !==
							true)) {
							this.hideChild();
							CKEDITOR.env.gecko && this._.iframe.getFrameDocument().$.activeElement.blur();
							this.element.setStyle("display", "none");
							this.visible = 0;
							this.element.getFirst().removeCustomData("activePanel");
							if (a = a && this._.returnFocus) {
								CKEDITOR.env.webkit && a.type && a.getWindow().$.focus();
								a.focus()
							}
							delete this._.lastFocused;
							this._.editor.fire("panelHide", this)
						}
					},
					allowBlur: function(a) {
						var d = this._.panel;
						if (a != void 0) d.allowBlur = a;
						return d.allowBlur
					},
					showAsChild: function(a, d, f, c, e, j) {
						if (!(this._.activeChild ==
							a && a._.panel._.offsetParentId == f.getId())) {
							this.hideChild();
							a.onHide = CKEDITOR.tools.bind(function() {
								CKEDITOR.tools.setTimeout(function() {
									this._.focused || this.hide()
								}, 0, this)
							}, this);
							this._.activeChild = a;
							this._.focused = false;
							a.showBlock(d, f, c, e, j);
							this.blur();
							(CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) && setTimeout(function() {
								a.element.getChild(0).$.style.cssText += ""
							}, 100)
						}
					},
					hideChild: function(a) {
						var d = this._.activeChild;
						if (d) {
							delete d.onHide;
							delete this._.activeChild;
							d.hide();
							a && this.focus()
						}
					}
				}
			});
			CKEDITOR.on("instanceDestroyed", function() {
				var a = CKEDITOR.tools.isEmpty(CKEDITOR.instances),
					d;
				for (d in e) {
					var f = e[d];
					a ? f.destroy() : f.element.hide()
				}
				a && (e = {})
			})
		}(), CKEDITOR.plugins.add("menu", {
			requires: "floatpanel",
			beforeInit: function(a) {
				for (var e = a.config.menu_groups.split(","), b = a._.menuGroups = {}, d = a._.menuItems = {}, f = 0; f < e.length; f++) b[e[f]] = f + 1;
				a.addMenuGroup = function(a, d) {
					b[a] = d || 100
				};
				a.addMenuItem = function(a, f) {
					b[f.group] && (d[a] = new CKEDITOR.menuItem(this, a, f))
				};
				a.addMenuItems = function(a) {
					for (var b in a) this.addMenuItem(b,
						a[b])
				};
				a.getMenuItem = function(a) {
					return d[a]
				};
				a.removeMenuItem = function(a) {
					delete d[a]
				}
			}
		}),
		function() {
			function a(a) {
				a.sort(function(a, b) {
					return a.group < b.group ? -1 : a.group > b.group ? 1 : a.order < b.order ? -1 : a.order > b.order ? 1 : 0
				})
			}
			var e = '<span class="cke_menuitem"><a id="{id}" class="cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href="{href}" title="{title}" tabindex="-1"_cke_focus=1 hidefocus="true" role="{role}" aria-haspopup="{hasPopup}" aria-disabled="{disabled}" {ariaChecked}';
			CKEDITOR.env.gecko &&
				CKEDITOR.env.mac && (e = e + ' onkeypress="return false;"');
			CKEDITOR.env.gecko && (e = e + ' onblur="this.style.cssText = this.style.cssText;"');
			var e = e + (' onmouseover="CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout="CKEDITOR.tools.callFunction({moveOutFn},{index});" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},{index}); return false;">'),
				b = CKEDITOR.addTemplate("menuItem", e + '<span class="cke_menubutton_inner"><span class="cke_menubutton_icon"><span class="cke_button_icon cke_button__{iconName}_icon" style="{iconStyle}"></span></span><span class="cke_menubutton_label">{label}</span>{arrowHtml}</span></a></span>'),
				d = CKEDITOR.addTemplate("menuArrow", '<span class="cke_menuarrow"><span>{label}</span></span>');
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
						}),
						e = d.block.attributes = d.attributes || {};
					!e.role && (e.role = "menu");
					this._.panelDefinition = d
				},
				_: {
					onShow: function() {
						var a =
							this.editor.getSelection(),
							b = a && a.getStartElement(),
							d = this.editor.elementPath(),
							e = this._.listeners;
						this.removeAll();
						for (var g = 0; g < e.length; g++) {
							var i = e[g](b, a, d);
							if (i)
								for (var k in i) {
									var n = this.editor.getMenuItem(k);
									if (n && (!n.command || this.editor.getCommand(n.command).state)) {
										n.state = i[k];
										this.add(n)
									}
								}
						}
					},
					onClick: function(a) {
						this.hide();
						if (a.onClick) a.onClick();
						else a.command && this.editor.execCommand(a.command)
					},
					onEscape: function(a) {
						var b = this.parent;
						b ? b._.panel.hideChild(1) : a == 27 && this.hide(1);
						return false
					},
					onHide: function() {
						this.onHide && this.onHide()
					},
					showSubMenu: function(a) {
						var b = this._.subMenu,
							d = this.items[a];
						if (d = d.getItems && d.getItems()) {
							if (b) b.removeAll();
							else {
								b = this._.subMenu = new CKEDITOR.menu(this.editor, CKEDITOR.tools.extend({}, this._.definition, {
									level: this._.level + 1
								}, true));
								b.parent = this;
								b._.onClick = CKEDITOR.tools.bind(this._.onClick, this)
							}
							for (var e in d) {
								var g = this.editor.getMenuItem(e);
								if (g) {
									g.state = d[e];
									b.add(g)
								}
							}
							var i = this._.panel.getBlock(this.id).element.getDocument().getById(this.id +
								("" + a));
							setTimeout(function() {
								b.show(i, 2)
							}, 0)
						} else this._.panel.hideChild(1)
					}
				},
				proto: {
					add: function(a) {
						if (!a.order) a.order = this.items.length;
						this.items.push(a)
					},
					removeAll: function() {
						this.items = []
					},
					show: function(b, c, d, e) {
						if (!this.parent) {
							this._.onShow();
							if (!this.items.length) return
						}
						var c = c || (this.editor.lang.dir == "rtl" ? 2 : 1),
							g = this.items,
							i = this.editor,
							k = this._.panel,
							n = this._.element;
						if (!k) {
							k = this._.panel = new CKEDITOR.ui.floatPanel(this.editor, CKEDITOR.document.getBody(), this._.panelDefinition, this._.level);
							k.onEscape = CKEDITOR.tools.bind(function(a) {
								if (this._.onEscape(a) === false) return false
							}, this);
							k.onShow = function() {
								k._.panel.getHolderElement().getParent().addClass("cke cke_reset_all")
							};
							k.onHide = CKEDITOR.tools.bind(function() {
								this._.onHide && this._.onHide()
							}, this);
							n = k.addBlock(this.id, this._.panelDefinition.block);
							n.autoSize = true;
							var o = n.keys;
							o[40] = "next";
							o[9] = "next";
							o[38] = "prev";
							o[CKEDITOR.SHIFT + 9] = "prev";
							o[i.lang.dir == "rtl" ? 37 : 39] = CKEDITOR.env.ie ? "mouseup" : "click";
							o[32] = CKEDITOR.env.ie ? "mouseup" :
								"click";
							CKEDITOR.env.ie && (o[13] = "mouseup");
							n = this._.element = n.element;
							o = n.getDocument();
							o.getBody().setStyle("overflow", "hidden");
							o.getElementsByTag("html").getItem(0).setStyle("overflow", "hidden");
							this._.itemOverFn = CKEDITOR.tools.addFunction(function(a) {
								clearTimeout(this._.showSubTimeout);
								this._.showSubTimeout = CKEDITOR.tools.setTimeout(this._.showSubMenu, i.config.menu_subMenuDelay || 400, this, [a])
							}, this);
							this._.itemOutFn = CKEDITOR.tools.addFunction(function() {
								clearTimeout(this._.showSubTimeout)
							}, this);
							this._.itemClickFn = CKEDITOR.tools.addFunction(function(a) {
								var b = this.items[a];
								if (b.state == CKEDITOR.TRISTATE_DISABLED) this.hide(1);
								else if (b.getItems) this._.showSubMenu(a);
								else this._.onClick(b)
							}, this)
						}
						a(g);
						for (var o = i.elementPath(), o = ['<div class="cke_menu' + (o && o.direction() != i.lang.dir ? " cke_mixed_dir_content" : "") + '" role="presentation">'], r = g.length, l = r && g[0].group, m = 0; m < r; m++) {
							var s = g[m];
							if (l != s.group) {
								o.push('<div class="cke_menuseparator" role="separator"></div>');
								l = s.group
							}
							s.render(this, m, o)
						}
						o.push("</div>");
						n.setHtml(o.join(""));
						CKEDITOR.ui.fire("ready", this);
						this.parent ? this.parent._.panel.showAsChild(k, this.id, b, c, d, e) : k.showBlock(this.id, b, c, d, e);
						i.fire("menuShow", [k])
					},
					addListener: function(a) {
						this._.listeners.push(a)
					},
					hide: function(a) {
						this._.onHide && this._.onHide();
						this._.panel && this._.panel.hide(a)
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
					this.name =
						b
				},
				proto: {
					render: function(a, c, e) {
						var j = a.id + ("" + c),
							g = typeof this.state == "undefined" ? CKEDITOR.TRISTATE_OFF : this.state,
							i = "",
							k = g == CKEDITOR.TRISTATE_ON ? "on" : g == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off";
						this.role in {
							menuitemcheckbox: 1,
							menuitemradio: 1
						} && (i = ' aria-checked="' + (g == CKEDITOR.TRISTATE_ON ? "true" : "false") + '"');
						var n = this.getItems,
							o = "&#" + (this.editor.lang.dir == "rtl" ? "9668" : "9658") + ";",
							r = this.name;
						if (this.icon && !/\./.test(this.icon)) r = this.icon;
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
							arrowHtml: n ? d.output({
								label: o
							}) : "",
							role: this.role ? this.role : "menuitem",
							ariaChecked: i
						};
						b.output(a, e)
					}
				}
			})
		}(), CKEDITOR.config.menu_groups = "clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div",
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
						})
					},
					proto: {
						addTarget: function(a, e) {
							a.on("contextmenu", function(a) {
								var a = a.data,
									c = CKEDITOR.env.webkit ? b : CKEDITOR.env.mac ? a.$.metaKey : a.$.ctrlKey;
								if (!e || !c) {
									a.preventDefault();
									if (CKEDITOR.env.mac && CKEDITOR.env.webkit) {
										var c = this.editor,
											d = (new CKEDITOR.dom.elementPath(a.getTarget(), c.editable())).contains(function(a) {
												return a.hasAttribute("contenteditable")
											}, true);
										d && d.getAttribute("contenteditable") == "false" && c.getSelection().fake(d)
									}
									var d = a.getTarget().getDocument(),
										j = a.getTarget().getDocument().getDocumentElement(),
										c = !d.equals(CKEDITOR.document),
										d = d.getWindow().getScrollPosition(),
										g = c ? a.$.clientX : a.$.pageX || d.x + a.$.clientX,
										i = c ? a.$.clientY : a.$.pageY || d.y + a.$.clientY;
									CKEDITOR.tools.setTimeout(function() {
											this.open(j, null, g, i)
										}, CKEDITOR.env.ie ?
										200 : 0, this)
								}
							}, this);
							if (CKEDITOR.env.webkit) {
								var b, d = function() {
									b = 0
								};
								a.on("keydown", function(a) {
									b = CKEDITOR.env.mac ? a.data.$.metaKey : a.data.$.ctrlKey
								});
								a.on("keyup", d);
								a.on("contextmenu", d)
							}
						},
						open: function(a, e, b, d) {
							this.editor.focus();
							a = a || CKEDITOR.document.getDocumentElement();
							this.editor.selectionChange(1);
							this.show(a, e, b, d)
						}
					}
				})
			},
			beforeInit: function(a) {
				var e = a.contextMenu = new CKEDITOR.plugins.contextMenu(a);
				a.on("contentDom", function() {
					e.addTarget(a.editable(), a.config.browserContextMenuOnCtrl !==
						false)
				});
				a.addCommand("contextMenu", {
					exec: function() {
						a.contextMenu.open(a.document.getBody())
					}
				});
				a.setKeystroke(CKEDITOR.SHIFT + 121, "contextMenu");
				a.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 121, "contextMenu")
			}
		}),
		function() {
			var a;

			function e(c, d) {
				function e(a) {
					a = n.list[a];
					if (a.equals(c.editable()) || a.getAttribute("contenteditable") == "true") {
						var b = c.createRange();
						b.selectNodeContents(a);
						b.select()
					} else c.getSelection().selectElement(a);
					c.focus()
				}

				function g() {
					k && k.setHtml(b);
					delete n.list
				}
				var i = c.ui.spaceId("path"),
					k, n = c._.elementsPath,
					o = n.idBase;
				d.html = d.html + ('<span id="' + i + '_label" class="cke_voice_label">' + c.lang.elementspath.eleLabel + '</span><span id="' + i + '" class="cke_path" role="group" aria-labelledby="' + i + '_label">' + b + "</span>");
				c.on("uiReady", function() {
					var a = c.ui.space("path");
					a && c.focusManager.add(a, 1)
				});
				n.onClick = e;
				var r = CKEDITOR.tools.addFunction(e),
					l = CKEDITOR.tools.addFunction(function(a, b) {
						var d = n.idBase,
							f, b = new CKEDITOR.dom.event(b);
						f = c.lang.dir == "rtl";
						switch (b.getKeystroke()) {
							case f ? 39:
								37:
									case 9:
								(f =
									CKEDITOR.document.getById(d + (a + 1))) || (f = CKEDITOR.document.getById(d + "0"));
								f.focus();
								return false;
							case f ? 37:
								39:
									case CKEDITOR.SHIFT + 9:
								(f = CKEDITOR.document.getById(d + (a - 1))) || (f = CKEDITOR.document.getById(d + (n.list.length - 1)));
								f.focus();
								return false;
							case 27:
								c.focus();
								return false;
							case 13:
							case 32:
								e(a);
								return false
						}
						return true
					});
				c.on("selectionChange", function() {
					c.editable();
					for (var a = [], d = n.list = [], e = [], g = n.filters, h = true, j = c.elementPath().elements, u, B = j.length; B--;) {
						var v = j[B],
							z = 0;
						u = v.data("cke-display-name") ?
							v.data("cke-display-name") : v.data("cke-real-element-type") ? v.data("cke-real-element-type") : v.getName();
						h = v.hasAttribute("contenteditable") ? v.getAttribute("contenteditable") == "true" : h;
						!h && !v.hasAttribute("contenteditable") && (z = 1);
						for (var w = 0; w < g.length; w++) {
							var D = g[w](v, u);
							if (D === false) {
								z = 1;
								break
							}
							u = D || u
						}
						if (!z) {
							d.unshift(v);
							e.unshift(u)
						}
					}
					d = d.length;
					for (g = 0; g < d; g++) {
						u = e[g];
						h = c.lang.elementspath.eleTitle.replace(/%1/, u);
						u = f.output({
							id: o + g,
							label: h,
							text: u,
							jsTitle: "javascript:void('" + u + "')",
							index: g,
							keyDownFn: l,
							clickFn: r
						});
						a.unshift(u)
					}
					k || (k = CKEDITOR.document.getById(i));
					e = k;
					e.setHtml(a.join("") + b);
					c.fire("elementsPathUpdate", {
						space: e
					})
				});
				c.on("readOnly", g);
				c.on("contentDomUnload", g);
				c.addCommand("elementsPathFocus", a);
				c.setKeystroke(CKEDITOR.ALT + 122, "elementsPathFocus")
			}
			a = {
				editorFocus: false,
				readOnly: 1,
				exec: function(a) {
					(a = CKEDITOR.document.getById(a._.elementsPath.idBase + "0")) && a.focus(CKEDITOR.env.ie || CKEDITOR.env.air)
				}
			};
			var b = '<span class="cke_path_empty">&nbsp;</span>',
				d = "";
			CKEDITOR.env.gecko && CKEDITOR.env.mac &&
				(d = d + ' onkeypress="return false;"');
			CKEDITOR.env.gecko && (d = d + ' onblur="this.style.cssText = this.style.cssText;"');
			var f = CKEDITOR.addTemplate("pathItem", '<a id="{id}" href="{jsTitle}" tabindex="-1" class="cke_path_item" title="{label}"' + d + ' hidefocus="true"  onkeydown="return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick="CKEDITOR.tools.callFunction({clickFn},{index}); return false;" role="button" aria-label="{label}">{text}</a>');
			CKEDITOR.plugins.add("elementspath", {
				init: function(a) {
					a._.elementsPath = {
						idBase: "cke_elementspath_" + CKEDITOR.tools.getNextNumber() + "_",
						filters: []
					};
					a.on("uiSpace", function(b) {
						b.data.space == "bottom" && e(a, b.data)
					})
				}
			})
		}(),
		function() {
			function a(a, b, d) {
				d = a.config.forceEnterMode || d;
				if (a.mode == "wysiwyg") {
					if (!b) b = a.activeEnterMode;
					if (!a.elementPath().isContextFor("p")) {
						b = CKEDITOR.ENTER_BR;
						d = 1
					}
					a.fire("saveSnapshot");
					b == CKEDITOR.ENTER_BR ? c(a, b, null, d) : h(a, b, null, d);
					a.fire("saveSnapshot")
				}
			}

			function e(a) {
				for (var a = a.getSelection().getRanges(true), b = a.length - 1; b > 0; b--) a[b].deleteContents();
				return a[0]
			}
			CKEDITOR.plugins.add("enterkey", {
				init: function(b) {
					b.addCommand("enter", {
						modes: {
							wysiwyg: 1
						},
						editorFocus: false,
						exec: function(b) {
							a(b)
						}
					});
					b.addCommand("shiftEnter", {
						modes: {
							wysiwyg: 1
						},
						editorFocus: false,
						exec: function(b) {
							a(b, b.activeShiftEnterMode, 1)
						}
					});
					b.setKeystroke([
						[13, "enter"],
						[CKEDITOR.SHIFT + 13, "shiftEnter"]
					])
				}
			});
			var b = CKEDITOR.dom.walker.whitespaces(),
				d = CKEDITOR.dom.walker.bookmark();
			CKEDITOR.plugins.enterkey = {
				enterBlock: function(a, f, h, n) {
					if (h = h || e(a)) {
						var o = h.document,
							r = h.checkStartOfBlock(),
							l = h.checkEndOfBlock(),
							m = a.elementPath(h.startContainer).block,
							s = f == CKEDITOR.ENTER_DIV ? "div" : "p",
							t;
						if (r && l) {
							if (m && (m.is("li") || m.getParent().is("li"))) {
								h = m.getParent();
								t = h.getParent();
								var n = !m.hasPrevious(),
									p = !m.hasNext(),
									s = a.getSelection(),
									x = s.createBookmarks(),
									r = m.getDirection(1),
									l = m.getAttribute("class"),
									q = m.getAttribute("style"),
									u = t.getDirection(1) != r,
									a = a.enterMode != CKEDITOR.ENTER_BR || u || q || l;
								if (t.is("li"))
									if (n || p) m[n ? "insertBefore" : "insertAfter"](t);
									else m.breakParent(t);
								else {
									if (a) {
										t = o.createElement(f ==
											CKEDITOR.ENTER_P ? "p" : "div");
										u && t.setAttribute("dir", r);
										q && t.setAttribute("style", q);
										l && t.setAttribute("class", l);
										m.moveChildren(t);
										if (n || p) t[n ? "insertBefore" : "insertAfter"](h);
										else {
											m.breakParent(h);
											t.insertAfter(h)
										}
									} else {
										m.appendBogus(true);
										if (n || p)
											for (; o = m[n ? "getFirst" : "getLast"]();) o[n ? "insertBefore" : "insertAfter"](h);
										else
											for (m.breakParent(h); o = m.getLast();) o.insertAfter(h)
									}
									m.remove()
								}
								s.selectBookmarks(x);
								return
							}
							if (m && m.getParent().is("blockquote")) {
								m.breakParent(m.getParent());
								m.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1)) ||
									m.getPrevious().remove();
								m.getNext().getFirst(CKEDITOR.dom.walker.invisible(1)) || m.getNext().remove();
								h.moveToElementEditStart(m);
								h.select();
								return
							}
						} else if (m && m.is("pre") && !l) {
							c(a, f, h, n);
							return
						}
						if (l = h.splitBlock(s)) {
							f = l.previousBlock;
							m = l.nextBlock;
							a = l.wasStartOfBlock;
							r = l.wasEndOfBlock;
							if (m) {
								x = m.getParent();
								if (x.is("li")) {
									m.breakParent(x);
									m.move(m.getNext(), 1)
								}
							} else if (f && (x = f.getParent()) && x.is("li")) {
								f.breakParent(x);
								x = f.getNext();
								h.moveToElementEditStart(x);
								f.move(f.getPrevious())
							}
							if (!a && !r) {
								if (m.is("li")) {
									t =
										h.clone();
									t.selectNodeContents(m);
									t = new CKEDITOR.dom.walker(t);
									t.evaluator = function(a) {
										return !(d(a) || b(a) || a.type == CKEDITOR.NODE_ELEMENT && a.getName() in CKEDITOR.dtd.$inline && !(a.getName() in CKEDITOR.dtd.$empty))
									};
									(x = t.next()) && (x.type == CKEDITOR.NODE_ELEMENT && x.is("ul", "ol")) && (CKEDITOR.env.needsBrFiller ? o.createElement("br") : o.createText(" ")).insertBefore(x)
								}
								m && h.moveToElementEditStart(m)
							} else {
								if (f) {
									if (f.is("li") || !j.test(f.getName()) && !f.is("pre")) t = f.clone()
								} else m && (t = m.clone()); if (t) n && !t.is("li") &&
									t.renameNode(s);
								else if (x && x.is("li")) t = x;
								else {
									t = o.createElement(s);
									f && (p = f.getDirection()) && t.setAttribute("dir", p)
								} if (o = l.elementPath) {
									n = 0;
									for (s = o.elements.length; n < s; n++) {
										x = o.elements[n];
										if (x.equals(o.block) || x.equals(o.blockLimit)) break;
										if (CKEDITOR.dtd.$removeEmpty[x.getName()]) {
											x = x.clone();
											t.moveChildren(x);
											t.append(x)
										}
									}
								}
								t.appendBogus();
								t.getParent() || h.insertNode(t);
								t.is("li") && t.removeAttribute("value");
								if (CKEDITOR.env.ie && a && (!r || !f.getChildCount())) {
									h.moveToElementEditStart(r ? f : t);
									h.select()
								}
								h.moveToElementEditStart(a &&
									!r ? m : t)
							}
							h.select();
							h.scrollIntoView()
						}
					}
				},
				enterBr: function(a, b, c, d) {
					if (c = c || e(a)) {
						var f = c.document,
							r = c.checkEndOfBlock(),
							l = new CKEDITOR.dom.elementPath(a.getSelection().getStartElement()),
							m = l.block,
							l = m && l.block.getName();
						if (!d && l == "li") h(a, b, c, d);
						else {
							if (!d && r && j.test(l))
								if (r = m.getDirection()) {
									f = f.createElement("div");
									f.setAttribute("dir", r);
									f.insertAfter(m);
									c.setStart(f, 0)
								} else {
									f.createElement("br").insertAfter(m);
									CKEDITOR.env.gecko && f.createText("").insertAfter(m);
									c.setStartAt(m.getNext(), CKEDITOR.env.ie ?
										CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_START)
								} else {
								m = l == "pre" && CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? f.createText("\r") : f.createElement("br");
								c.deleteContents();
								c.insertNode(m);
								if (CKEDITOR.env.needsBrFiller) {
									f.createText("﻿").insertAfter(m);
									r && m.getParent().appendBogus();
									m.getNext().$.nodeValue = "";
									c.setStartAt(m.getNext(), CKEDITOR.POSITION_AFTER_START)
								} else c.setStartAt(m, CKEDITOR.POSITION_AFTER_END)
							}
							c.collapse(true);
							c.select();
							c.scrollIntoView()
						}
					}
				}
			};
			var f = CKEDITOR.plugins.enterkey,
				c = f.enterBr,
				h = f.enterBlock,
				j = /^h[1-6]$/
		}(),
		function() {
			function a(a, b) {
				var d = {},
					f = [],
					c = {
						nbsp: " ",
						shy: "­",
						gt: ">",
						lt: "<",
						amp: "&",
						apos: "'",
						quot: '"'
					},
					a = a.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g, function(a, e) {
						var g = b ? "&" + e + ";" : c[e];
						d[g] = b ? c[e] : "&" + e + ";";
						f.push(g);
						return ""
					});
				if (!b && a) {
					var a = a.split(","),
						h = document.createElement("div"),
						j;
					h.innerHTML = "&" + a.join(";&") + ";";
					j = h.innerHTML;
					h = null;
					for (h = 0; h < j.length; h++) {
						var g = j.charAt(h);
						d[g] = "&" + a[h] + ";";
						f.push(g)
					}
				}
				d.regex = f.join(b ? "|" : "");
				return d
			}
			CKEDITOR.plugins.add("entities", {
				afterInit: function(e) {
					var b = e.config;
					if (e = (e = e.dataProcessor) && e.htmlFilter) {
						var d = [];
						b.basicEntities !== false && d.push("nbsp,gt,lt,amp");
						if (b.entities) {
							d.length && d.push("quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro");
							b.entities_latin && d.push("Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml");
							b.entities_greek && d.push("Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv");
							b.entities_additional && d.push(b.entities_additional)
						}
						var f = a(d.join(",")),
							c = f.regex ? "[" + f.regex + "]" : "a^";
						delete f.regex;
						b.entities && b.entities_processNumerical && (c = "[^ -~]|" + c);
						var c = RegExp(c, "g"),
							h = function(a) {
								return b.entities_processNumerical == "force" || !f[a] ? "&#" + a.charCodeAt(0) + ";" : f[a]
							},
							j = a("nbsp,gt,lt,amp,shy", true),
							g = RegExp(j.regex, "g"),
							i = function(a) {
								return j[a]
							};
						e.addRules({
							text: function(a) {
								return a.replace(g, i).replace(c, h)
							}
						}, {
							applyToAll: true,
							excludeNestedEditable: true
						})
					}
				}
			})
		}(), CKEDITOR.config.basicEntities = !0, CKEDITOR.config.entities = !0, CKEDITOR.config.entities_latin = !0, CKEDITOR.config.entities_greek = !0, CKEDITOR.config.entities_additional = "#39", CKEDITOR.plugins.add("popup"), CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
			popup: function(a, e, b, d) {
				e = e || "80%";
				b = b || "70%";
				typeof e == "string" && (e.length > 1 && e.substr(e.length - 1, 1) == "%") && (e = parseInt(window.screen.width * parseInt(e, 10) / 100, 10));
				typeof b == "string" && (b.length > 1 && b.substr(b.length - 1, 1) == "%") && (b = parseInt(window.screen.height * parseInt(b, 10) / 100, 10));
				e < 640 && (e = 640);
				b < 420 && (b = 420);
				var f = parseInt((window.screen.height - b) / 2, 10),
					c = parseInt((window.screen.width - e) / 2, 10),
					d = (d || "location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes") + ",width=" + e + ",height=" + b + ",top=" + f + ",left=" + c,
					h = window.open("", null, d, true);
				if (!h) return false;
				try {
					if (navigator.userAgent.toLowerCase().indexOf(" chrome/") == -1) {
						h.moveTo(c, f);
						h.resizeTo(e, b)
					}
					h.focus();
					h.location.href = a
				} catch (j) {
					window.open(a, null, d, true)
				}
				return true
			}
		}),
		function() {
			function a(a, b) {
				var c = [];
				if (b)
					for (var d in b) c.push(d + "=" + encodeURIComponent(b[d]));
				else return a;
				return a + (a.indexOf("?") != -1 ? "&" : "?") + c.join("&")
			}

			function e(a) {
				a = a + "";
				return a.charAt(0).toUpperCase() + a.substr(1)
			}

			function b() {
				var b = this.getDialog(),
					c = b.getParentEditor();
				c._.filebrowserSe = this;
				var d = c.config["filebrowser" + e(b.getName()) + "WindowWidth"] || c.config.filebrowserWindowWidth || "80%",
					b = c.config["filebrowser" + e(b.getName()) + "WindowHeight"] || c.config.filebrowserWindowHeight || "70%",
					f = this.filebrowser.params || {};
				f.CKEditor = c.name;
				f.CKEditorFuncNum = c._.filebrowserFn;
				if (!f.langCode) f.langCode = c.langCode;
				f = a(this.filebrowser.url, f);
				c.popup(f, d, b, c.config.filebrowserWindowFeatures || c.config.fileBrowserWindowFeatures)
			}

			function d() {
				var a = this.getDialog();
				a.getParentEditor()._.filebrowserSe = this;
				return !a.getContentElement(this["for"][0], this["for"][1]).getInputElement().$.value || !a.getContentElement(this["for"][0], this["for"][1]).getAction() ? false : true
			}

			function f(b, c, d) {
				var f = d.params || {};
				f.CKEditor = b.name;
				f.CKEditorFuncNum = b._.filebrowserFn;
				if (!f.langCode) f.langCode = b.langCode;
				c.action = a(d.url, f);
				c.filebrowser = d
			}

			function c(a, h, j, n) {
				if (n && n.length)
					for (var o, r = n.length; r--;) {
						o = n[r];
						(o.type == "hbox" || o.type == "vbox" || o.type == "fieldset") && c(a, h, j, o.children);
						if (o.filebrowser) {
							if (typeof o.filebrowser == "string") o.filebrowser = {
								action: o.type == "fileButton" ? "QuickUpload" : "Browse",
								target: o.filebrowser
							};
							if (o.filebrowser.action == "Browse") {
								var l = o.filebrowser.url;
								if (l === void 0) {
									l = a.config["filebrowser" +
										e(h) + "BrowseUrl"];
									if (l === void 0) l = a.config.filebrowserBrowseUrl
								}
								if (l) {
									o.onClick = b;
									o.filebrowser.url = l;
									o.hidden = false
								}
							} else if (o.filebrowser.action == "QuickUpload" && o["for"]) {
								l = o.filebrowser.url;
								if (l === void 0) {
									l = a.config["filebrowser" + e(h) + "UploadUrl"];
									if (l === void 0) l = a.config.filebrowserUploadUrl
								}
								if (l) {
									var m = o.onClick;
									o.onClick = function(a) {
										var b = a.sender;
										return m && m.call(b, a) === false ? false : d.call(b, a)
									};
									o.filebrowser.url = l;
									o.hidden = false;
									f(a, j.getContents(o["for"][0]).get(o["for"][1]), o.filebrowser)
								}
							}
						}
					}
			}

			function h(a, b, c) {
				if (c.indexOf(";") !== -1) {
					for (var c = c.split(";"), d = 0; d < c.length; d++)
						if (h(a, b, c[d])) return true;
					return false
				}
				return (a = a.getContents(b).get(c).filebrowser) && a.url
			}

			function j(a, b) {
				var c = this._.filebrowserSe.getDialog(),
					d = this._.filebrowserSe["for"],
					f = this._.filebrowserSe.filebrowser.onSelect;
				d && c.getContentElement(d[0], d[1]).reset();
				if (!(typeof b == "function" && b.call(this._.filebrowserSe) === false) && !(f && f.call(this._.filebrowserSe, a, b) === false)) {
					typeof b == "string" && b && alert(b);
					if (a) {
						d =
							this._.filebrowserSe;
						c = d.getDialog();
						if (d = d.filebrowser.target || null) {
							d = d.split(":");
							if (f = c.getContentElement(d[0], d[1])) {
								f.setValue(a);
								c.selectPage(d[0])
							}
						}
					}
				}
			}
			CKEDITOR.plugins.add("filebrowser", {
				requires: "popup",
				init: function(a) {
					a._.filebrowserFn = CKEDITOR.tools.addFunction(j, a);
					a.on("destroy", function() {
						CKEDITOR.tools.removeFunction(this._.filebrowserFn)
					})
				}
			});
			CKEDITOR.on("dialogDefinition", function(a) {
				if (a.editor.plugins.filebrowser)
					for (var b = a.data.definition, d, f = 0; f < b.contents.length; ++f)
						if (d = b.contents[f]) {
							c(a.editor,
								a.data.name, b, d.elements);
							if (d.hidden && d.filebrowser) d.hidden = !h(b, d.id, d.filebrowser)
						}
			})
		}(),
		function() {
			function a(a) {
				var c = a.config,
					h = a.fire("uiSpace", {
						space: "top",
						html: ""
					}).html,
					j = function() {
						function e(a, b, c) {
							g.setStyle(b, d(c));
							g.setStyle("position", a)
						}

						function h(a) {
							var b = k.getDocumentPosition();
							switch (a) {
								case "top":
									e("absolute", "top", b.y - p - u);
									break;
								case "pin":
									e("fixed", "top", v);
									break;
								case "bottom":
									e("absolute", "top", b.y + (s.height || s.bottom - s.top) + u)
							}
							i = a
						}
						var i, k, m, s, t, p, x, q = c.floatSpaceDockedOffsetX ||
							0,
							u = c.floatSpaceDockedOffsetY || 0,
							B = c.floatSpacePinnedOffsetX || 0,
							v = c.floatSpacePinnedOffsetY || 0;
						return function(c) {
							if (k = a.editable()) {
								c && c.name == "focus" && g.show();
								g.removeStyle("left");
								g.removeStyle("right");
								m = g.getClientRect();
								s = k.getClientRect();
								t = b.getViewPaneSize();
								p = m.height;
								x = "pageXOffset" in b.$ ? b.$.pageXOffset : CKEDITOR.document.$.documentElement.scrollLeft;
								if (i) {
									p + u <= s.top ? h("top") : p + u > t.height - s.bottom ? h("pin") : h("bottom");
									var c = t.width / 2,
										c = s.left > 0 && s.right < t.width && s.width > m.width ? a.config.contentsLangDirection ==
										"rtl" ? "right" : "left" : c - s.left > s.right - c ? "left" : "right",
										e;
									if (m.width > t.width) {
										c = "left";
										e = 0
									} else {
										e = c == "left" ? s.left > 0 ? s.left : 0 : s.right < t.width ? t.width - s.right : 0;
										if (e + m.width > t.width) {
											c = c == "left" ? "right" : "left";
											e = 0
										}
									}
									g.setStyle(c, d((i == "pin" ? B : q) + e + (i == "pin" ? 0 : c == "left" ? x : -x)))
								} else {
									i = "pin";
									h("pin");
									j(c)
								}
							}
						}
					}();
				if (h) {
					var g = CKEDITOR.document.getBody().append(CKEDITOR.dom.element.createFromHtml(e.output({
							content: h,
							id: a.id,
							langDir: a.lang.dir,
							langCode: a.langCode,
							name: a.name,
							style: "display:none;z-index:" + (c.baseFloatZIndex -
								1),
							topId: a.ui.spaceId("top"),
							voiceLabel: a.lang.editorPanel + ", " + a.name
						}))),
						i = CKEDITOR.tools.eventsBuffer(500, j),
						k = CKEDITOR.tools.eventsBuffer(100, j);
					g.unselectable();
					g.on("mousedown", function(a) {
						a = a.data;
						a.getTarget().hasAscendant("a", 1) || a.preventDefault()
					});
					a.on("focus", function(c) {
						j(c);
						a.on("change", i.input);
						b.on("scroll", k.input);
						b.on("resize", k.input)
					});
					a.on("blur", function() {
						g.hide();
						a.removeListener("change", i.input);
						b.removeListener("scroll", k.input);
						b.removeListener("resize", k.input)
					});
					a.on("destroy",
						function() {
							b.removeListener("scroll", k.input);
							b.removeListener("resize", k.input);
							g.clearCustomData();
							g.remove()
						});
					a.focusManager.hasFocus && g.show();
					a.focusManager.add(g, 1)
				}
			}
			var e = CKEDITOR.addTemplate("floatcontainer", '<div id="cke_{name}" class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '" dir="{langDir}" title="' + (CKEDITOR.env.gecko ? " " : "") + '" lang="{langCode}" role="application" style="{style}" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><div class="cke_inner"><div id="{topId}" class="cke_top" role="presentation">{content}</div></div></div>'),
				b = CKEDITOR.document.getWindow(),
				d = CKEDITOR.tools.cssLength;
			CKEDITOR.plugins.add("floatingspace", {
				init: function(b) {
					b.on("loaded", function() {
						a(this)
					}, null, null, 20)
				}
			})
		}(), CKEDITOR.plugins.add("htmlwriter", {
			init: function(a) {
				var e = new CKEDITOR.htmlWriter;
				e.forceSimpleAmpersand = a.config.forceSimpleAmpersand;
				e.indentationChars = a.config.dataIndentationChars || "\t";
				a.dataProcessor.writer = e
			}
		}), CKEDITOR.htmlWriter = CKEDITOR.tools.createClass({
			base: CKEDITOR.htmlParser.basicWriter,
			$: function() {
				this.base();
				this.indentationChars =
					"\t";
				this.selfClosingEnd = " />";
				this.lineBreakChars = "\n";
				this.sortAttributes = 1;
				this._.indent = 0;
				this._.indentation = "";
				this._.inPre = 0;
				this._.rules = {};
				var a = CKEDITOR.dtd,
					e;
				for (e in CKEDITOR.tools.extend({}, a.$nonBodyContent, a.$block, a.$listItem, a.$tableContent)) this.setRules(e, {
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
				})
			},
			proto: {
				openTag: function(a) {
					var e = this._.rules[a];
					this._.afterCloser && (e && e.needsSpace && this._.needsSpace) && this._.output.push("\n");
					if (this._.indent) this.indentation();
					else if (e && e.breakBeforeOpen) {
						this.lineBreak();
						this.indentation()
					}
					this._.output.push("<", a);
					this._.afterCloser = 0
				},
				openTagClose: function(a, e) {
					var b = this._.rules[a];
					if (e) {
						this._.output.push(this.selfClosingEnd);
						if (b && b.breakAfterClose) this._.needsSpace = b.needsSpace
					} else {
						this._.output.push(">");
						if (b && b.indent) this._.indentation = this._.indentation + this.indentationChars
					}
					b && b.breakAfterOpen && this.lineBreak();
					a == "pre" && (this._.inPre = 1)
				},
				attribute: function(a, e) {
					if (typeof e == "string") {
						this.forceSimpleAmpersand && (e = e.replace(/&amp;/g, "&"));
						e = CKEDITOR.tools.htmlEncodeAttr(e)
					}
					this._.output.push(" ", a, '="', e, '"')
				},
				closeTag: function(a) {
					var e = this._.rules[a];
					if (e && e.indent) this._.indentation = this._.indentation.substr(this.indentationChars.length);
					if (this._.indent) this.indentation();
					else if (e && e.breakBeforeClose) {
						this.lineBreak();
						this.indentation()
					}
					this._.output.push("</", a, ">");
					a == "pre" && (this._.inPre = 0);
					if (e && e.breakAfterClose) {
						this.lineBreak();
						this._.needsSpace = e.needsSpace
					}
					this._.afterCloser = 1
				},
				text: function(a) {
					if (this._.indent) {
						this.indentation();
						!this._.inPre && (a = CKEDITOR.tools.ltrim(a))
					}
					this._.output.push(a)
				},
				comment: function(a) {
					this._.indent && this.indentation();
					this._.output.push("<\!--", a, "--\>")
				},
				lineBreak: function() {
					!this._.inPre && this._.output.length > 0 && this._.output.push(this.lineBreakChars);
					this._.indent = 1
				},
				indentation: function() {
					!this._.inPre && this._.indentation && this._.output.push(this._.indentation);
					this._.indent = 0
				},
				reset: function() {
					this._.output = [];
					this._.indent = 0;
					this._.indentation = "";
					this._.afterCloser = 0;
					this._.inPre = 0
				},
				setRules: function(a, e) {
					var b = this._.rules[a];
					b ? CKEDITOR.tools.extend(b, e, true) : this._.rules[a] = e
				}
			}
		}),
		function() {
			function a(a, d) {
				d || (d = a.getSelection().getSelectedElement());
				if (d && d.is("img") && !d.data("cke-realelement") && !d.isReadOnly()) return d
			}

			function e(a) {
				var d = a.getStyle("float");
				if (d == "inherit" || d == "none") d = 0;
				d || (d = a.getAttribute("align"));
				return d
			}
			CKEDITOR.plugins.add("image", {
				requires: "dialog",
				init: function(b) {
					if (!b.plugins.image2) {
						CKEDITOR.dialog.add("image", this.path + "dialogs/image.js");
						var d = "img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}";
						CKEDITOR.dialog.isTabEnabled(b, "image", "advanced") && (d = "img[alt,dir,id,lang,longdesc,!src,title]{*}(*)");
						b.addCommand("image", new CKEDITOR.dialogCommand("image", {
							allowedContent: d,
							requiredContent: "img[alt,src]",
							contentTransformations: [
								["img{width}: sizeToStyle", "img[width]: sizeToAttribute"],
								["img{float}: alignmentToStyle", "img[align]: alignmentToAttribute"]
							]
						}));
						b.ui.addButton && b.ui.addButton("Image", {
							label: b.lang.common.image,
							command: "image",
							toolbar: "insert,10"
						});
						b.on("doubleclick", function(a) {
							var b = a.data.element;
							if (b.is("img") && !b.data("cke-realelement") && !b.isReadOnly()) a.data.dialog = "image"
						});
						b.addMenuItems && b.addMenuItems({
							image: {
								label: b.lang.image.menu,
								command: "image",
								group: "image"
							}
						});
						b.contextMenu && b.contextMenu.addListener(function(d) {
							if (a(b, d)) return {
								image: CKEDITOR.TRISTATE_OFF
							}
						})
					}
				},
				afterInit: function(b) {
					function d(d) {
						var c = b.getCommand("justify" + d);
						if (c) {
							if (d == "left" || d == "right") c.on("exec", function(c) {
								var j = a(b),
									g;
								if (j) {
									g = e(j);
									if (g == d) {
										j.removeStyle("float");
										d == e(j) && j.removeAttribute("align")
									} else j.setStyle("float", d);
									c.cancel()
								}
							});
							c.on("refresh", function(c) {
								var j = a(b);
								if (j) {
									j = e(j);
									this.setState(j == d ? CKEDITOR.TRISTATE_ON : d == "right" || d == "left" ?
										CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
									c.cancel()
								}
							})
						}
					}
					if (!b.plugins.image2) {
						d("left");
						d("right");
						d("center");
						d("block")
					}
				}
			})
		}(), CKEDITOR.config.image_removeLinkByEmptyURL = !0,
		function() {
			function a(a, b) {
				var b = b === void 0 || b,
					c;
				if (b) c = a.getComputedStyle("text-align");
				else {
					for (; !a.hasAttribute || !a.hasAttribute("align") && !a.getStyle("text-align");) {
						c = a.getParent();
						if (!c) break;
						a = c
					}
					c = a.getStyle("text-align") || a.getAttribute("align") || ""
				}
				c && (c = c.replace(/(?:-(?:moz|webkit)-)?(?:start|auto)/i, ""));
				!c && b && (c = a.getComputedStyle("direction") == "rtl" ? "right" : "left");
				return c
			}

			function e(a, b, c) {
				this.editor = a;
				this.name = b;
				this.value = c;
				this.context = "p";
				var b = a.config.justifyClasses,
					e = a.config.enterMode == CKEDITOR.ENTER_P ? "p" : "div";
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
							this.cssClassName = b[3]
					}
					this.cssClassRegex = RegExp("(?:^|\\s+)(?:" + b.join("|") + ")(?=$|\\s)");
					this.requiredContent = e + "(" +
						this.cssClassName + ")"
				} else this.requiredContent = e + "{text-align}";
				this.allowedContent = {
					"caption div h1 h2 h3 h4 h5 h6 p pre td th li": {
						propertiesOnly: true,
						styles: this.cssClassName ? null : "text-align",
						classes: this.cssClassName || null
					}
				};
				if (a.config.enterMode == CKEDITOR.ENTER_BR) this.allowedContent.div = true
			}

			function b(a) {
				var b = a.editor,
					c = b.createRange();
				c.setStartBefore(a.data.node);
				c.setEndAfter(a.data.node);
				for (var e = new CKEDITOR.dom.walker(c), j; j = e.next();)
					if (j.type == CKEDITOR.NODE_ELEMENT)
						if (!j.equals(a.data.node) &&
							j.getDirection()) {
							c.setStartAfter(j);
							e = new CKEDITOR.dom.walker(c)
						} else {
							var g = b.config.justifyClasses;
							if (g)
								if (j.hasClass(g[0])) {
									j.removeClass(g[0]);
									j.addClass(g[2])
								} else if (j.hasClass(g[2])) {
								j.removeClass(g[2]);
								j.addClass(g[0])
							}
							g = j.getStyle("text-align");
							g == "left" ? j.setStyle("text-align", "right") : g == "right" && j.setStyle("text-align", "left")
						}
			}
			e.prototype = {
				exec: function(b) {
					var f = b.getSelection(),
						c = b.config.enterMode;
					if (f) {
						for (var e = f.createBookmarks(), j = f.getRanges(), g = this.cssClassName, i, k, n = b.config.useComputedState,
							n = n === void 0 || n, o = j.length - 1; o >= 0; o--) {
							i = j[o].createIterator();
							for (i.enlargeBr = c != CKEDITOR.ENTER_BR; k = i.getNextParagraph(c == CKEDITOR.ENTER_P ? "p" : "div");)
								if (!k.isReadOnly()) {
									k.removeAttribute("align");
									k.removeStyle("text-align");
									var r = g && (k.$.className = CKEDITOR.tools.ltrim(k.$.className.replace(this.cssClassRegex, ""))),
										l = this.state == CKEDITOR.TRISTATE_OFF && (!n || a(k, true) != this.value);
									g ? l ? k.addClass(g) : r || k.removeAttribute("class") : l && k.setStyle("text-align", this.value)
								}
						}
						b.focus();
						b.forceNextSelectionCheck();
						f.selectBookmarks(e)
					}
				},
				refresh: function(b, f) {
					var c = f.block || f.blockLimit;
					this.setState(c.getName() != "body" && a(c, this.editor.config.useComputedState) == this.value ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
				}
			};
			CKEDITOR.plugins.add("justify", {
				init: function(a) {
					if (!a.blockless) {
						var f = new e(a, "justifyleft", "left"),
							c = new e(a, "justifycenter", "center"),
							h = new e(a, "justifyright", "right"),
							j = new e(a, "justifyblock", "justify");
						a.addCommand("justifyleft", f);
						a.addCommand("justifycenter", c);
						a.addCommand("justifyright",
							h);
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
							})
						}
						a.on("dirChanged", b)
					}
				}
			})
		}(),
		function() {
			function a(a,
				b) {
				var f = d.exec(a),
					e = d.exec(b);
				if (f) {
					if (!f[2] && e[2] == "px") return e[1];
					if (f[2] == "px" && !e[2]) return e[1] + "px"
				}
				return b
			}
			var e = CKEDITOR.htmlParser.cssStyle,
				b = CKEDITOR.tools.cssLength,
				d = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i,
				f = {
					elements: {
						$: function(b) {
							var d = b.attributes;
							if ((d = (d = (d = d && d["data-cke-realelement"]) && new CKEDITOR.htmlParser.fragment.fromHtml(decodeURIComponent(d))) && d.children[0]) && b.attributes["data-cke-resizable"]) {
								var f = (new e(b)).rules,
									b = d.attributes,
									g = f.width,
									f = f.height;
								g && (b.width = a(b.width,
									g));
								f && (b.height = a(b.height, f))
							}
							return d
						}
					}
				};
			CKEDITOR.plugins.add("fakeobjects", {
				init: function(a) {
					a.filter.allow("img[!data-cke-realelement,src,alt,title](*){*}", "fakeobjects")
				},
				afterInit: function(a) {
					(a = (a = a.dataProcessor) && a.htmlFilter) && a.addRules(f, {
						applyToAll: true
					})
				}
			});
			CKEDITOR.editor.prototype.createFakeElement = function(a, d, f, g) {
				var i = this.lang.fakeobjects,
					i = i[f] || i.unknown,
					d = {
						"class": d,
						"data-cke-realelement": encodeURIComponent(a.getOuterHtml()),
						"data-cke-real-node-type": a.type,
						alt: i,
						title: i,
						align: a.getAttribute("align") || ""
					};
				if (!CKEDITOR.env.hc) d.src = CKEDITOR.tools.transparentImageData;
				f && (d["data-cke-real-element-type"] = f);
				if (g) {
					d["data-cke-resizable"] = g;
					f = new e;
					g = a.getAttribute("width");
					a = a.getAttribute("height");
					g && (f.rules.width = b(g));
					a && (f.rules.height = b(a));
					f.populate(d)
				}
				return this.document.createElement("img", {
					attributes: d
				})
			};
			CKEDITOR.editor.prototype.createFakeParserElement = function(a, d, f, g) {
				var i = this.lang.fakeobjects,
					i = i[f] || i.unknown,
					k;
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
				if (!CKEDITOR.env.hc) d.src = CKEDITOR.tools.transparentImageData;
				f && (d["data-cke-real-element-type"] = f);
				if (g) {
					d["data-cke-resizable"] = g;
					g = a.attributes;
					a = new e;
					f = g.width;
					g = g.height;
					f != void 0 && (a.rules.width = b(f));
					g != void 0 && (a.rules.height = b(g));
					a.populate(d)
				}
				return new CKEDITOR.htmlParser.element("img", d)
			};
			CKEDITOR.editor.prototype.restoreRealElement =
				function(b) {
					if (b.data("cke-real-node-type") != CKEDITOR.NODE_ELEMENT) return null;
					var d = CKEDITOR.dom.element.createFromHtml(decodeURIComponent(b.data("cke-realelement")), this.document);
					if (b.data("cke-resizable")) {
						var f = b.getStyle("width"),
							b = b.getStyle("height");
						f && d.setAttribute("width", a(d.getAttribute("width"), f));
						b && d.setAttribute("height", a(d.getAttribute("height"), b))
					}
					return d
				}
		}(), "use strict",
		function() {
			function a(a) {
				return a.replace(/'/g, "\\$&")
			}

			function e(a) {
				for (var b, c = a.length, d = [], f = 0; f < c; f++) {
					b =
						a.charCodeAt(f);
					d.push(b)
				}
				return "String.fromCharCode(" + d.join(",") + ")"
			}

			function b(b, c) {
				var d = b.plugins.link,
					f = d.compiledProtectionFunction.params,
					e, h;
				h = [d.compiledProtectionFunction.name, "("];
				for (var g = 0; g < f.length; g++) {
					d = f[g].toLowerCase();
					e = c[d];
					g > 0 && h.push(",");
					h.push("'", e ? a(encodeURIComponent(c[d])) : "", "'")
				}
				h.push(")");
				return h.join("")
			}

			function d(a) {
				var a = a.config.emailProtection || "",
					b;
				if (a && a != "encode") {
					b = {};
					a.replace(/^([^(]+)\(([^)]+)\)$/, function(a, c, d) {
						b.name = c;
						b.params = [];
						d.replace(/[^,\s]+/g,
							function(a) {
								b.params.push(a)
							})
					})
				}
				return b
			}
			CKEDITOR.plugins.add("link", {
				requires: "dialog,fakeobjects",
				onLoad: function() {
					function a(b) {
						return c.replace(/%1/g, b == "rtl" ? "right" : "left").replace(/%2/g, "cke_contents_" + b)
					}
					var b = "background:url(" + CKEDITOR.getUrl(this.path + "images" + (CKEDITOR.env.hidpi ? "/hidpi" : "") + "/anchor.png") + ") no-repeat %1 center;border:1px dotted #00f;background-size:16px;",
						c = ".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{" + b +
						"padding-%1:18px;cursor:auto;}.%2 img.cke_anchor{" + b + "width:16px;min-height:15px;height:1.15em;vertical-align:text-bottom;}";
					CKEDITOR.addCss(a("ltr") + a("rtl"))
				},
				init: function(a) {
					var b = "a[!href]";
					CKEDITOR.dialog.isTabEnabled(a, "link", "advanced") && (b = b.replace("]", ",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)"));
					CKEDITOR.dialog.isTabEnabled(a, "link", "target") && (b = b.replace("]", ",target,onclick]"));
					a.addCommand("link", new CKEDITOR.dialogCommand("link", {
						allowedContent: b,
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
						})
					}
					CKEDITOR.dialog.add("link", this.path + "dialogs/link.js");
					CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js");
					a.on("doubleclick", function(b) {
						var c = CKEDITOR.plugins.link.getSelectedLink(a) || b.data.element;
						if (!c.isReadOnly())
							if (c.is("a")) {
								b.data.dialog = c.getAttribute("name") && (!c.getAttribute("href") || !c.getChildCount()) ? "anchor" : "link";
								b.data.link = c
							} else if (CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, c)) b.data.dialog = "anchor"
					}, null, null, 0);
					a.on("doubleclick",
						function(b) {
							b.data.link && a.getSelection().selectElement(b.data.link)
						}, null, null, 20);
					a.addMenuItems && a.addMenuItems({
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
					a.contextMenu && a.contextMenu.addListener(function(b) {
						if (!b || b.isReadOnly()) return null;
						b = CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b);
						if (!b && !(b = CKEDITOR.plugins.link.getSelectedLink(a))) return null;
						var c = {};
						b.getAttribute("href") && b.getChildCount() && (c = {
							link: CKEDITOR.TRISTATE_OFF,
							unlink: CKEDITOR.TRISTATE_OFF
						});
						if (b && b.hasAttribute("name")) c.anchor = c.removeAnchor = CKEDITOR.TRISTATE_OFF;
						return c
					});
					this.compiledProtectionFunction = d(a)
				},
				afterInit: function(a) {
					a.dataProcessor.dataFilter.addRules({
						elements: {
							a: function(b) {
								return !b.attributes.name ? null : !b.children.length ? a.createFakeParserElement(b,
									"cke_anchor", "anchor") : null
							}
						}
					});
					var b = a._.elementsPath && a._.elementsPath.filters;
					b && b.push(function(b, c) {
						if (c == "a" && (CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b) || b.getAttribute("name") && (!b.getAttribute("href") || !b.getChildCount()))) return "anchor"
					})
				}
			});
			var f = /^javascript:/,
				c = /^mailto:([^?]+)(?:\?(.+))?$/,
				h = /subject=([^;?:@&=$,\/]*)/,
				j = /body=([^;?:@&=$,\/]*)/,
				g = /^#(.*)$/,
				i = /^((?:http|https|ftp|news):\/\/)?(.*)$/,
				k = /^(_(?:self|top|parent|blank))$/,
				n = /^javascript:void\(location\.href='mailto:'\+String\.fromCharCode\(([^)]+)\)(?:\+'(.*)')?\)$/,
				o = /^javascript:([^(]+)\(([^)]+)\)$/,
				r = /\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/,
				l = /(?:^|,)([^=]+)=(\d+|yes|no)/gi,
				m = {
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
					var b = a.getSelection(),
						c = b.getSelectedElement();
					if (c && c.is("a")) return c;
					if (b = b.getRanges()[0]) {
						b.shrink(CKEDITOR.SHRINK_TEXT);
						return a.elementPath(b.getCommonAncestor()).contains("a", 1)
					}
					return null
				},
				getEditorAnchors: function(a) {
					for (var b = a.editable(), c = b.isInline() && !a.plugins.divarea ? a.document : b, b = c.getElementsByTag("a"), c = c.getElementsByTag("img"), d = [], f = 0, e; e = b.getItem(f++);)
						if (e.data("cke-saved-name") || e.hasAttribute("name")) d.push({
							name: e.data("cke-saved-name") || e.getAttribute("name"),
							id: e.getAttribute("id")
						});
					for (f = 0; e = c.getItem(f++);)(e =
						this.tryRestoreFakeAnchor(a, e)) && d.push({
						name: e.getAttribute("name"),
						id: e.getAttribute("id")
					});
					return d
				},
				fakeAnchor: true,
				tryRestoreFakeAnchor: function(a, b) {
					if (b && b.data("cke-real-element-type") && b.data("cke-real-element-type") == "anchor") {
						var c = a.restoreRealElement(b);
						if (c.data("cke-saved-name")) return c
					}
				},
				parseLinkAttributes: function(a, b) {
					var d = b && (b.data("cke-saved-href") || b.getAttribute("href")) || "",
						e = a.plugins.link.compiledProtectionFunction,
						q = a.config.emailProtection,
						u, B = {};
					d.match(f) && (q == "encode" ?
						d = d.replace(n, function(a, b, c) {
							return "mailto:" + String.fromCharCode.apply(String, b.split(",")) + (c && c.replace(/\\'/g, "'"))
						}) : q && d.replace(o, function(a, b, c) {
							if (b == e.name) {
								B.type = "email";
								for (var a = B.email = {}, b = /(^')|('$)/g, c = c.match(/[^,\s]+/g), d = c.length, f, h, g = 0; g < d; g++) {
									f = decodeURIComponent;
									h = c[g].replace(b, "").replace(/\\'/g, "'");
									h = f(h);
									f = e.params[g].toLowerCase();
									a[f] = h
								}
								a.address = [a.name, a.domain].join("@")
							}
						}));
					if (!B.type)
						if (q = d.match(g)) {
							B.type = "anchor";
							B.anchor = {};
							B.anchor.name = B.anchor.id = q[1]
						} else if (q =
						d.match(c)) {
						u = d.match(h);
						d = d.match(j);
						B.type = "email";
						var v = B.email = {};
						v.address = q[1];
						u && (v.subject = decodeURIComponent(u[1]));
						d && (v.body = decodeURIComponent(d[1]))
					} else if (d && (u = d.match(i))) {
						B.type = "url";
						B.url = {};
						B.url.protocol = u[1];
						B.url.url = u[2]
					}
					if (b) {
						if (d = b.getAttribute("target")) B.target = {
							type: d.match(k) ? d : "frame",
							name: d
						};
						else if (d = (d = b.data("cke-pa-onclick") || b.getAttribute("onclick")) && d.match(r))
							for (B.target = {
								type: "popup",
								name: d[1]
							}; q = l.exec(d[2]);)(q[2] == "yes" || q[2] == "1") && !(q[1] in {
								height: 1,
								width: 1,
								top: 1,
								left: 1
							}) ? B.target[q[1]] = true : isFinite(q[2]) && (B.target[q[1]] = q[2]);
						var d = {},
							z;
						for (z in m)(q = b.getAttribute(z)) && (d[m[z]] = q);
						if (z = b.data("cke-saved-name") || d.advName) d.advName = z;
						if (!CKEDITOR.tools.isEmpty(d)) B.advanced = d
					}
					return B
				},
				getLinkAttributes: function(c, d) {
					var f = c.config.emailProtection || "",
						h = {};
					switch (d.type) {
						case "url":
							var f = d.url && d.url.protocol != void 0 ? d.url.protocol : "http://",
								g = d.url && CKEDITOR.tools.trim(d.url.url) || "";
							h["data-cke-saved-href"] = g.indexOf("/") === 0 ? g : f + g;
							break;
						case "anchor":
							f = d.anchor && d.anchor.id;
							h["data-cke-saved-href"] = "#" + (d.anchor && d.anchor.name || f || "");
							break;
						case "email":
							var i = d.email,
								g = i.address;
							switch (f) {
								case "":
								case "encode":
									var j = encodeURIComponent(i.subject || ""),
										k = encodeURIComponent(i.body || ""),
										i = [];
									j && i.push("subject=" + j);
									k && i.push("body=" + k);
									i = i.length ? "?" + i.join("&") : "";
									if (f == "encode") {
										f = ["javascript:void(location.href='mailto:'+", e(g)];
										i && f.push("+'", a(i), "'");
										f.push(")")
									} else f = ["mailto:", g, i];
									break;
								default:
									f = g.split("@", 2);
									i.name = f[0];
									i.domain = f[1];
									f = ["javascript:", b(c, i)]
							}
							h["data-cke-saved-href"] = f.join("")
					}
					if (d.target)
						if (d.target.type == "popup") {
							for (var f = ["window.open(this.href, '", d.target.name || "", "', '"], l = ["resizable", "status", "location", "toolbar", "menubar", "fullscreen", "scrollbars", "dependent"], g = l.length, j = function(a) {
								d.target[a] && l.push(a + "=" + d.target[a])
							}, i = 0; i < g; i++) l[i] = l[i] + (d.target[l[i]] ? "=yes" : "=no");
							j("width");
							j("left");
							j("height");
							j("top");
							f.push(l.join(","), "'); return false;");
							h["data-cke-pa-onclick"] = f.join("")
						} else if (d.target.type !=
						"notSet" && d.target.name) h.target = d.target.name;
					if (d.advanced) {
						for (var n in m)(f = d.advanced[m[n]]) && (h[n] = f);
						if (h.name) h["data-cke-saved-name"] = h.name
					}
					if (h["data-cke-saved-href"]) h.href = h["data-cke-saved-href"];
					n = CKEDITOR.tools.extend({
						target: 1,
						onclick: 1,
						"data-cke-pa-onclick": 1,
						"data-cke-saved-name": 1
					}, m);
					for (var o in h) delete n[o];
					return {
						set: h,
						removed: CKEDITOR.tools.objectKeys(n)
					}
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
					a.removeStyle(b)
				},
				refresh: function(a, b) {
					var c = b.lastElement && b.lastElement.getAscendant("a", true);
					c && c.getName() == "a" && c.getAttribute("href") && c.getChildCount() ? this.setState(CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_DISABLED)
				},
				contextSensitive: 1,
				startDisabled: 1,
				requiredContent: "a[href]"
			};
			CKEDITOR.removeAnchorCommand = function() {};
			CKEDITOR.removeAnchorCommand.prototype = {
				exec: function(a) {
					var b = a.getSelection(),
						c = b.createBookmarks(),
						d;
					if (b &&
						(d = b.getSelectedElement()) && (!d.getChildCount() ? CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, d) : d.is("a"))) d.remove(1);
					else if (d = CKEDITOR.plugins.link.getSelectedLink(a))
						if (d.hasAttribute("href")) {
							d.removeAttributes({
								name: 1,
								"data-cke-saved-name": 1
							});
							d.removeClass("cke_anchor")
						} else d.remove(1);
					b.selectBookmarks(c)
				},
				requiredContent: "a[name]"
			};
			CKEDITOR.tools.extend(CKEDITOR.config, {
				linkShowAdvancedTab: true,
				linkShowTargetTab: true
			})
		}(),
		function() {
			function a(a) {
				if (!a || a.type != CKEDITOR.NODE_ELEMENT || a.getName() !=
					"form") return [];
				for (var b = [], d = ["style", "className"], f = 0; f < d.length; f++) {
					var e = a.$.elements.namedItem(d[f]);
					if (e) {
						e = new CKEDITOR.dom.element(e);
						b.push([e, e.nextSibling]);
						e.remove()
					}
				}
				return b
			}

			function e(a, b) {
				if (a && !(a.type != CKEDITOR.NODE_ELEMENT || a.getName() != "form") && b.length > 0)
					for (var d = b.length - 1; d >= 0; d--) {
						var f = b[d][0],
							e = b[d][1];
						e ? f.insertBefore(e) : f.appendTo(a)
					}
			}

			function b(b, d) {
				var f = a(b),
					g = {},
					i = b.$;
				if (!d) {
					g["class"] = i.className || "";
					i.className = ""
				}
				g.inline = i.style.cssText || "";
				if (!d) i.style.cssText =
					"position: static; overflow: visible";
				e(f);
				return g
			}

			function d(b, d) {
				var f = a(b),
					g = b.$;
				if ("class" in d) g.className = d["class"];
				if ("inline" in d) g.style.cssText = d.inline;
				e(f)
			}

			function f(a) {
				if (!a.editable().isInline()) {
					var b = CKEDITOR.instances,
						d;
					for (d in b) {
						var f = b[d];
						if (f.mode == "wysiwyg" && !f.readOnly) {
							f = f.document.getBody();
							f.setAttribute("contentEditable", false);
							f.setAttribute("contentEditable", true)
						}
					}
					if (a.editable().hasFocus) {
						a.toolbox.focus();
						a.focus()
					}
				}
			}
			CKEDITOR.plugins.add("maximize", {
				init: function(a) {
					function e() {
						var b =
							i.getViewPaneSize();
						a.resize(b.width, b.height, null, true)
					}
					if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
						var j = a.lang,
							g = CKEDITOR.document,
							i = g.getWindow(),
							k, n, o, r = CKEDITOR.TRISTATE_OFF;
						a.addCommand("maximize", {
							modes: {
								wysiwyg: !CKEDITOR.env.iOS,
								source: !CKEDITOR.env.iOS
							},
							readOnly: 1,
							editorFocus: false,
							exec: function() {
								var l = a.container.getChild(1),
									m = a.ui.space("contents");
								if (a.mode == "wysiwyg") {
									var s = a.getSelection();
									k = s && s.getRanges();
									n = i.getScrollPosition()
								} else {
									var t = a.editable().$;
									k = !CKEDITOR.env.ie && [t.selectionStart, t.selectionEnd];
									n = [t.scrollLeft, t.scrollTop]
								} if (this.state == CKEDITOR.TRISTATE_OFF) {
									i.on("resize", e);
									o = i.getScrollPosition();
									for (s = a.container; s = s.getParent();) {
										s.setCustomData("maximize_saved_styles", b(s));
										s.setStyle("z-index", a.config.baseFloatZIndex - 5)
									}
									m.setCustomData("maximize_saved_styles", b(m, true));
									l.setCustomData("maximize_saved_styles", b(l, true));
									m = {
										overflow: CKEDITOR.env.webkit ? "" : "hidden",
										width: 0,
										height: 0
									};
									g.getDocumentElement().setStyles(m);
									!CKEDITOR.env.gecko && g.getDocumentElement().setStyle("position",
										"fixed");
									(!CKEDITOR.env.gecko || !CKEDITOR.env.quirks) && g.getBody().setStyles(m);
									CKEDITOR.env.ie ? setTimeout(function() {
										i.$.scrollTo(0, 0)
									}, 0) : i.$.scrollTo(0, 0);
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
									CKEDITOR.env.gecko && f(a)
								} else if (this.state == CKEDITOR.TRISTATE_ON) {
									i.removeListener("resize",
										e);
									m = [m, l];
									for (s = 0; s < m.length; s++) {
										d(m[s], m[s].getCustomData("maximize_saved_styles"));
										m[s].removeCustomData("maximize_saved_styles")
									}
									for (s = a.container; s = s.getParent();) {
										d(s, s.getCustomData("maximize_saved_styles"));
										s.removeCustomData("maximize_saved_styles")
									}
									CKEDITOR.env.ie ? setTimeout(function() {
										i.$.scrollTo(o.x, o.y)
									}, 0) : i.$.scrollTo(o.x, o.y);
									l.removeClass("cke_maximized");
									if (CKEDITOR.env.webkit) {
										l.setStyle("display", "inline");
										setTimeout(function() {
											l.setStyle("display", "block")
										}, 0)
									}
									a.fire("resize")
								}
								this.toggleState();
								if (s = this.uiItems[0]) {
									m = this.state == CKEDITOR.TRISTATE_OFF ? j.maximize.maximize : j.maximize.minimize;
									s = CKEDITOR.document.getById(s._.id);
									s.getChild(1).setHtml(m);
									s.setAttribute("title", m);
									s.setAttribute("href", 'javascript:void("' + m + '");')
								}
								if (a.mode == "wysiwyg")
									if (k) {
										CKEDITOR.env.gecko && f(a);
										a.getSelection().selectRanges(k);
										(t = a.getSelection().getStartElement()) && t.scrollIntoView(true)
									} else i.$.scrollTo(n.x, n.y);
								else {
									if (k) {
										t.selectionStart = k[0];
										t.selectionEnd = k[1]
									}
									t.scrollLeft = n[0];
									t.scrollTop = n[1]
								}
								k =
									n = null;
								r = this.state;
								a.fire("maximize", this.state)
							},
							canUndo: false
						});
						a.ui.addButton && a.ui.addButton("Maximize", {
							label: j.maximize.maximize,
							command: "maximize",
							toolbar: "tools,10"
						});
						a.on("mode", function() {
							var b = a.getCommand("maximize");
							b.setState(b.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : r)
						}, null, null, 100)
					}
				}
			})
		}(),
		function() {
			var a, e = {
				modes: {
					wysiwyg: 1,
					source: 1
				},
				canUndo: false,
				readOnly: 1,
				exec: function(b) {
					var d, f = b.config,
						c = f.baseHref ? '<base href="' + f.baseHref + '"/>' : "";
					if (f.fullPage) d = b.getData().replace(/<head>/,
						"$&" + c).replace(/[^>]*(?=<\/title>)/, "$& &mdash; " + b.lang.preview.preview);
					else {
						var f = "<body ",
							e = b.document && b.document.getBody();
						if (e) {
							e.getAttribute("id") && (f = f + ('id="' + e.getAttribute("id") + '" '));
							e.getAttribute("class") && (f = f + ('class="' + e.getAttribute("class") + '" '))
						}
						d = b.config.docType + '<html dir="' + b.config.contentsLangDirection + '"><head>' + c + "<title>" + b.lang.preview.preview + "</title>" + CKEDITOR.tools.buildStyleHtml(b.config.contentsCss) + "</head>" + (f + ">") + b.getData() + "</body></html>"
					}
					c = 640;
					f = 420;
					e = 80;
					try {
						var j = window.screen,
							c = Math.round(j.width * 0.8),
							f = Math.round(j.height * 0.7),
							e = Math.round(j.width * 0.1)
					} catch (g) {}
					if (b.fire("contentPreview", b = {
						dataValue: d
					}) === false) return false;
					var j = "",
						i;
					if (CKEDITOR.env.ie) {
						window._cke_htmlToLoad = b.dataValue;
						i = "javascript:void( (function(){document.open();" + ("(" + CKEDITOR.tools.fixDomain + ")();").replace(/\/\/.*?\n/g, "").replace(/parent\./g, "window.opener.") + "document.write( window.opener._cke_htmlToLoad );document.close();window.opener._cke_htmlToLoad = null;})() )";
						j = ""
					}
					if (CKEDITOR.env.gecko) {
						window._cke_htmlToLoad = b.dataValue;
						j = a + "preview.html"
					}
					j = window.open(j, null, "toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=" + c + ",height=" + f + ",left=" + e);
					if (CKEDITOR.env.ie && j) j.location = i;
					if (!CKEDITOR.env.ie && !CKEDITOR.env.gecko) {
						i = j.document;
						i.open();
						i.write(b.dataValue);
						i.close()
					}
					return true
				}
			};
			CKEDITOR.plugins.add("preview", {
				init: function(b) {
					if (b.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
						a = this.path;
						b.addCommand("preview", e);
						b.ui.addButton &&
							b.ui.addButton("Preview", {
								label: b.lang.preview.preview,
								command: "preview",
								toolbar: "document,40"
							})
					}
				}
			})
		}(), CKEDITOR.plugins.add("resize", {
			init: function(a) {
				var e, b, d, f, c = a.config,
					h = a.ui.spaceId("resizer"),
					j = a.element ? a.element.getDirection(1) : "ltr";
				!c.resize_dir && (c.resize_dir = "vertical");
				c.resize_maxWidth == void 0 && (c.resize_maxWidth = 3E3);
				c.resize_maxHeight == void 0 && (c.resize_maxHeight = 3E3);
				c.resize_minWidth == void 0 && (c.resize_minWidth = 750);
				c.resize_minHeight == void 0 && (c.resize_minHeight = 250);
				if (c.resize_enabled !==
					false) {
					var g = null,
						i = (c.resize_dir == "both" || c.resize_dir == "horizontal") && c.resize_minWidth != c.resize_maxWidth,
						k = (c.resize_dir == "both" || c.resize_dir == "vertical") && c.resize_minHeight != c.resize_maxHeight,
						n = function(g) {
							var h = e,
								n = b,
								o = h + (g.data.$.screenX - d) * (j == "rtl" ? -1 : 1),
								g = n + (g.data.$.screenY - f);
							i && (h = Math.max(c.resize_minWidth, Math.min(o, c.resize_maxWidth)));
							k && (n = Math.max(c.resize_minHeight, Math.min(g, c.resize_maxHeight)));
							a.resize(i ? h : null, n)
						},
						o = function() {
							CKEDITOR.document.removeListener("mousemove",
								n);
							CKEDITOR.document.removeListener("mouseup", o);
							if (a.document) {
								a.document.removeListener("mousemove", n);
								a.document.removeListener("mouseup", o)
							}
						},
						r = CKEDITOR.tools.addFunction(function(h) {
							g || (g = a.getResizable());
							e = g.$.offsetWidth || 0;
							b = g.$.offsetHeight || 0;
							d = h.screenX;
							f = h.screenY;
							c.resize_minWidth > e && (c.resize_minWidth = e);
							c.resize_minHeight > b && (c.resize_minHeight = b);
							CKEDITOR.document.on("mousemove", n);
							CKEDITOR.document.on("mouseup", o);
							if (a.document) {
								a.document.on("mousemove", n);
								a.document.on("mouseup",
									o)
							}
							h.preventDefault && h.preventDefault()
						});
					a.on("destroy", function() {
						CKEDITOR.tools.removeFunction(r)
					});
					a.on("uiSpace", function(b) {
						if (b.data.space == "bottom") {
							var c = "";
							i && !k && (c = " cke_resizer_horizontal");
							!i && k && (c = " cke_resizer_vertical");
							var d = '<span id="' + h + '" class="cke_resizer' + c + " cke_resizer_" + j + '" title="' + CKEDITOR.tools.htmlEncode(a.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + r + ', event)">' + (j == "ltr" ? "◢" : "◣") + "</span>";
							j == "ltr" && c == "ltr" ? b.data.html = b.data.html + d : b.data.html =
								d + b.data.html
						}
					}, a, null, 100);
					a.on("maximize", function(b) {
						a.ui.space("resizer")[b.data == CKEDITOR.TRISTATE_ON ? "hide" : "show"]()
					})
				}
			}
		}),
		function() {
			CKEDITOR.plugins.add("selectall", {
				init: function(a) {
					a.addCommand("selectAll", {
						modes: {
							wysiwyg: 1,
							source: 1
						},
						exec: function(a) {
							var b = a.editable();
							if (b.is("textarea")) {
								a = b.$;
								if (CKEDITOR.env.ie) a.createTextRange().execCommand("SelectAll");
								else {
									a.selectionStart = 0;
									a.selectionEnd = a.value.length
								}
								a.focus()
							} else {
								if (b.is("body")) a.document.$.execCommand("SelectAll", false, null);
								else {
									var d = a.createRange();
									d.selectNodeContents(b);
									d.select()
								}
								a.forceNextSelectionCheck();
								a.selectionChange()
							}
						},
						canUndo: false
					});
					a.ui.addButton && a.ui.addButton("SelectAll", {
						label: a.lang.selectall.toolbar,
						command: "selectAll",
						toolbar: "selection,10"
					})
				}
			})
		}(),
		function() {
			CKEDITOR.plugins.add("sourcearea", {
				init: function(e) {
					function b() {
						var a = f && this.equals(CKEDITOR.document.getActive());
						this.hide();
						this.setStyle("height", this.getParent().$.clientHeight + "px");
						this.setStyle("width", this.getParent().$.clientWidth +
							"px");
						this.show();
						a && this.focus()
					}
					if (e.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
						var d = CKEDITOR.plugins.sourcearea;
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
							d = e.editable(new a(e, d));
							d.setData(e.getData(1));
							if (CKEDITOR.env.ie) {
								d.attachListener(e, "resize", b, d);
								d.attachListener(CKEDITOR.document.getWindow(), "resize", b, d);
								CKEDITOR.tools.setTimeout(b, 0, d)
							}
							e.fire("ariaWidget", this);
							c()
						});
						e.addCommand("source", d.commands.source);
						e.ui.addButton && e.ui.addButton("Source", {
							label: e.lang.sourcearea.toolbar,
							command: "source",
							toolbar: "mode,10"
						});
						e.on("mode", function() {
							e.getCommand("source").setState(e.mode == "source" ? CKEDITOR.TRISTATE_ON :
								CKEDITOR.TRISTATE_OFF)
						});
						var f = CKEDITOR.env.ie && CKEDITOR.env.version == 9
					}
				}
			});
			var a = CKEDITOR.tools.createClass({
				base: CKEDITOR.editable,
				proto: {
					setData: function(a) {
						this.setValue(a);
						this.status = "ready";
						this.editor.fire("dataReady")
					},
					getData: function() {
						return this.getValue()
					},
					insertHtml: function() {},
					insertElement: function() {},
					insertText: function() {},
					setReadOnly: function(a) {
						this[(a ? "set" : "remove") + "Attribute"]("readOnly", "readonly")
					},
					detach: function() {
						a.baseProto.detach.call(this);
						this.clearCustomData();
						this.remove()
					}
				}
			})
		}(), CKEDITOR.plugins.sourcearea = {
			commands: {
				source: {
					modes: {
						wysiwyg: 1,
						source: 1
					},
					editorFocus: !1,
					readOnly: 1,
					exec: function(a) {
						a.mode == "wysiwyg" && a.fire("saveSnapshot");
						a.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);
						a.setMode(a.mode == "source" ? "wysiwyg" : "source")
					},
					canUndo: !1
				}
			}
		},
		function() {
			var a = '<a id="{id}" class="cke_button cke_button__{name} cke_button_{state} {cls}"' + (CKEDITOR.env.gecko && !CKEDITOR.env.hc ? "" : " href=\"javascript:void('{titleJs}')\"") + ' title="{title}" tabindex="-1" hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="{hasArrow}" aria-disabled="{ariaDisabled}"';
			CKEDITOR.env.gecko && CKEDITOR.env.mac && (a = a + ' onkeypress="return false;"');
			CKEDITOR.env.gecko && (a = a + ' onblur="this.style.cssText = this.style.cssText;"');
			var a = a + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"'),
				a = a +
				'>&nbsp;</span><span id="{id}_label" class="cke_button_label cke_button__{name}_label" aria-hidden="false">{label}</span>{arrowHtml}</a>',
				e = CKEDITOR.addTemplate("buttonArrow", '<span class="cke_button_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : "") + "</span>"),
				b = CKEDITOR.addTemplate("button", a);
			CKEDITOR.plugins.add("button", {
				beforeInit: function(a) {
					a.ui.addHandler(CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler)
				}
			});
			CKEDITOR.UI_BUTTON = "button";
			CKEDITOR.ui.button = function(a) {
				CKEDITOR.tools.extend(this, a, {
					title: a.label,
					click: a.click || function(b) {
						b.execCommand(a.command)
					}
				});
				this._ = {}
			};
			CKEDITOR.ui.button.handler = {
				create: function(a) {
					return new CKEDITOR.ui.button(a)
				}
			};
			CKEDITOR.ui.button.prototype = {
				render: function(a, f) {
					var c = CKEDITOR.env,
						h = this._.id = CKEDITOR.tools.getNextId(),
						j = "",
						g = this.command,
						i;
					this._.editor = a;
					var k = {
							id: h,
							button: this,
							editor: a,
							focus: function() {
								CKEDITOR.document.getById(h).focus()
							},
							execute: function() {
								this.button.click(a)
							},
							attach: function(a) {
								this.button.attach(a)
							}
						},
						n = CKEDITOR.tools.addFunction(function(a) {
							if (k.onkey) {
								a =
									new CKEDITOR.dom.event(a);
								return k.onkey(k, a.getKeystroke()) !== false
							}
						}),
						o = CKEDITOR.tools.addFunction(function(a) {
							var b;
							k.onfocus && (b = k.onfocus(k, new CKEDITOR.dom.event(a)) !== false);
							return b
						}),
						r = 0;
					k.clickFn = i = CKEDITOR.tools.addFunction(function() {
						if (r) {
							a.unlockSelection(1);
							r = 0
						}
						k.execute()
					});
					if (this.modes) {
						var l = {},
							m = function() {
								var b = a.mode;
								if (b) {
									b = this.modes[b] ? l[b] != void 0 ? l[b] : CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
									b = a.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : b;
									this.setState(b);
									this.refresh && this.refresh()
								}
							};
						a.on("beforeModeUnload", function() {
							if (a.mode && this._.state != CKEDITOR.TRISTATE_DISABLED) l[a.mode] = this._.state
						}, this);
						a.on("activeFilterChange", m, this);
						a.on("mode", m, this);
						!this.readOnly && a.on("readOnly", m, this)
					} else if (g)
						if (g = a.getCommand(g)) {
							g.on("state", function() {
								this.setState(g.state)
							}, this);
							j = j + (g.state == CKEDITOR.TRISTATE_ON ? "on" : g.state == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off")
						}
					if (this.directional) a.on("contentDirChanged", function(b) {
						var c = CKEDITOR.document.getById(this._.id),
							f = c.getFirst(),
							b = b.data;
						b != a.lang.dir ? c.addClass("cke_" + b) : c.removeClass("cke_ltr").removeClass("cke_rtl");
						f.setAttribute("style", CKEDITOR.skin.getIconStyle(s, b == "rtl", this.icon, this.iconOffset))
					}, this);
					g || (j = j + "off");
					var s = m = this.name || this.command;
					if (this.icon && !/\./.test(this.icon)) {
						s = this.icon;
						this.icon = null
					}
					c = {
						id: h,
						name: m,
						iconName: s,
						label: this.label,
						cls: this.className || "",
						state: j,
						ariaDisabled: j == "disabled" ? "true" : "false",
						title: this.title,
						titleJs: c.gecko && !c.hc ? "" : (this.title || "").replace("'",
							""),
						hasArrow: this.hasArrow ? "true" : "false",
						keydownFn: n,
						focusFn: o,
						clickFn: i,
						style: CKEDITOR.skin.getIconStyle(s, a.lang.dir == "rtl", this.icon, this.iconOffset),
						arrowHtml: this.hasArrow ? e.output() : ""
					};
					b.output(c, f);
					if (this.onRender) this.onRender();
					return k
				},
				setState: function(a) {
					if (this._.state == a) return false;
					this._.state = a;
					var b = CKEDITOR.document.getById(this._.id);
					if (b) {
						b.setState(a, "cke_button");
						a == CKEDITOR.TRISTATE_DISABLED ? b.setAttribute("aria-disabled", true) : b.removeAttribute("aria-disabled");
						if (this.hasArrow) {
							a =
								a == CKEDITOR.TRISTATE_ON ? this._.editor.lang.button.selectedLabel.replace(/%1/g, this.label) : this.label;
							CKEDITOR.document.getById(this._.id + "_label").setText(a)
						} else a == CKEDITOR.TRISTATE_ON ? b.setAttribute("aria-pressed", true) : b.removeAttribute("aria-pressed");
						return true
					}
					return false
				},
				getState: function() {
					return this._.state
				},
				toFeature: function(a) {
					if (this._.feature) return this._.feature;
					var b = this;
					!this.allowedContent && (!this.requiredContent && this.command) && (b = a.getCommand(this.command) || b);
					return this._.feature =
						b
				}
			};
			CKEDITOR.ui.prototype.addButton = function(a, b) {
				this.add(a, CKEDITOR.UI_BUTTON, b)
			}
		}(),
		function() {
			function a(a) {
				function b() {
					for (var c = d(), g = CKEDITOR.tools.clone(a.config.toolbarGroups) || e(a), i = 0; i < g.length; i++) {
						var k = g[i];
						if (k != "/") {
							typeof k == "string" && (k = g[i] = {
								name: k
							});
							var m, s = k.groups;
							if (s)
								for (var t = 0; t < s.length; t++) {
									m = s[t];
									(m = c[m]) && j(k, m)
								}(m = c[k.name]) && j(k, m)
						}
					}
					return g
				}

				function d() {
					var b = {},
						c, e, g;
					for (c in a.ui.items) {
						e = a.ui.items[c];
						g = e.toolbar || "others";
						g = g.split(",");
						e = g[0];
						g = parseInt(g[1] ||
							-1, 10);
						b[e] || (b[e] = []);
						b[e].push({
							name: c,
							order: g
						})
					}
					for (e in b) b[e] = b[e].sort(function(a, b) {
						return a.order == b.order ? 0 : b.order < 0 ? -1 : a.order < 0 ? 1 : a.order < b.order ? -1 : 1
					});
					return b
				}

				function j(b, c) {
					if (c.length) {
						b.items ? b.items.push(a.ui.create("-")) : b.items = [];
						for (var d; d = c.shift();) {
							d = typeof d == "string" ? d : d.name;
							if (!i || CKEDITOR.tools.indexOf(i, d) == -1)(d = a.ui.create(d)) && a.addFeature(d) && b.items.push(d)
						}
					}
				}

				function g(a) {
					var b = [],
						c, d, f;
					for (c = 0; c < a.length; ++c) {
						d = a[c];
						f = {};
						if (d == "/") b.push(d);
						else if (CKEDITOR.tools.isArray(d)) {
							j(f,
								CKEDITOR.tools.clone(d));
							b.push(f)
						} else if (d.items) {
							j(f, CKEDITOR.tools.clone(d.items));
							f.name = d.name;
							b.push(f)
						}
					}
					return b
				}
				var i = a.config.removeButtons,
					i = i && i.split(","),
					k = a.config.toolbar;
				typeof k == "string" && (k = a.config["toolbar_" + k]);
				return a.toolbar = k ? g(k) : b()
			}

			function e(a) {
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
				}])
			}
			var b = function() {
				this.toolbars = [];
				this.focusCommandExecuted = false
			};
			b.prototype.focus = function() {
				for (var a = 0, b; b = this.toolbars[a++];)
					for (var d = 0, e; e = b.items[d++];)
						if (e.focus) {
							e.focus();
							return
						}
			};
			var d = {
				modes: {
					wysiwyg: 1,
					source: 1
				},
				readOnly: 1,
				exec: function(a) {
					if (a.toolbox) {
						a.toolbox.focusCommandExecuted =
							true;
						CKEDITOR.env.ie || CKEDITOR.env.air ? setTimeout(function() {
							a.toolbox.focus()
						}, 100) : a.toolbox.focus()
					}
				}
			};
			CKEDITOR.plugins.add("toolbar", {
				requires: "button",
				init: function(f) {
					var c, e = function(a, b) {
						var d, k = f.lang.dir == "rtl",
							n = f.config.toolbarGroupCycling,
							o = k ? 37 : 39,
							k = k ? 39 : 37,
							n = n === void 0 || n;
						switch (b) {
							case 9:
							case CKEDITOR.SHIFT + 9:
								for (; !d || !d.items.length;) {
									d = b == 9 ? (d ? d.next : a.toolbar.next) || f.toolbox.toolbars[0] : (d ? d.previous : a.toolbar.previous) || f.toolbox.toolbars[f.toolbox.toolbars.length - 1];
									if (d.items.length)
										for (a =
											d.items[c ? d.items.length - 1 : 0]; a && !a.focus;)(a = c ? a.previous : a.next) || (d = 0)
								}
								a && a.focus();
								return false;
							case o:
								d = a;
								do {
									d = d.next;
									!d && n && (d = a.toolbar.items[0])
								} while (d && !d.focus);
								d ? d.focus() : e(a, 9);
								return false;
							case 40:
								if (a.button && a.button.hasArrow) {
									f.once("panelShow", function(a) {
										a.data._.panel._.currentBlock.onKeyDown(40)
									});
									a.execute()
								} else e(a, b == 40 ? o : k);
								return false;
							case k:
							case 38:
								d = a;
								do {
									d = d.previous;
									!d && n && (d = a.toolbar.items[a.toolbar.items.length - 1])
								} while (d && !d.focus);
								if (d) d.focus();
								else {
									c = 1;
									e(a,
										CKEDITOR.SHIFT + 9);
									c = 0
								}
								return false;
							case 27:
								f.focus();
								return false;
							case 13:
							case 32:
								a.execute();
								return false
						}
						return true
					};
					f.on("uiSpace", function(c) {
						if (c.data.space == f.config.toolbarLocation) {
							c.removeListener();
							f.toolbox = new b;
							var d = CKEDITOR.tools.getNextId(),
								i = ['<span id="', d, '" class="cke_voice_label">', f.lang.toolbar.toolbars, "</span>", '<span id="' + f.ui.spaceId("toolbox") + '" class="cke_toolbox" role="group" aria-labelledby="', d, '" onmousedown="return false;">'],
								d = f.config.toolbarStartupExpanded !==
								false,
								k, n;
							f.config.toolbarCanCollapse && f.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && i.push('<span class="cke_toolbox_main"' + (d ? ">" : ' style="display:none">'));
							for (var o = f.toolbox.toolbars, r = a(f), l = 0; l < r.length; l++) {
								var m, s = 0,
									t, p = r[l],
									x;
								if (p) {
									if (k) {
										i.push("</span>");
										n = k = 0
									}
									if (p === "/") i.push('<span class="cke_toolbar_break"></span>');
									else {
										x = p.items || p;
										for (var q = 0; q < x.length; q++) {
											var u = x[q],
												B;
											if (u)
												if (u.type == CKEDITOR.UI_SEPARATOR) n = k && u;
												else {
													B = u.canGroup !== false;
													if (!s) {
														m = CKEDITOR.tools.getNextId();
														s = {
															id: m,
															items: []
														};
														t = p.name && (f.lang.toolbar.toolbarGroups[p.name] || p.name);
														i.push('<span id="', m, '" class="cke_toolbar"', t ? ' aria-labelledby="' + m + '_label"' : "", ' role="toolbar">');
														t && i.push('<span id="', m, '_label" class="cke_voice_label">', t, "</span>");
														i.push('<span class="cke_toolbar_start"></span>');
														var v = o.push(s) - 1;
														if (v > 0) {
															s.previous = o[v - 1];
															s.previous.next = s
														}
													}
													if (B) {
														if (!k) {
															i.push('<span class="cke_toolgroup" role="presentation">');
															k = 1
														}
													} else if (k) {
														i.push("</span>");
														k = 0
													}
													m = function(a) {
														a = a.render(f, i);
														v = s.items.push(a) -
															1;
														if (v > 0) {
															a.previous = s.items[v - 1];
															a.previous.next = a
														}
														a.toolbar = s;
														a.onkey = e;
														a.onfocus = function() {
															f.toolbox.focusCommandExecuted || f.focus()
														}
													};
													if (n) {
														m(n);
														n = 0
													}
													m(u)
												}
										}
										if (k) {
											i.push("</span>");
											n = k = 0
										}
										s && i.push('<span class="cke_toolbar_end"></span></span>')
									}
								}
							}
							f.config.toolbarCanCollapse && i.push("</span>");
							if (f.config.toolbarCanCollapse && f.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
								var z = CKEDITOR.tools.addFunction(function() {
									f.execCommand("toolbarCollapse")
								});
								f.on("destroy", function() {
									CKEDITOR.tools.removeFunction(z)
								});
								f.addCommand("toolbarCollapse", {
									readOnly: 1,
									exec: function(a) {
										var b = a.ui.space("toolbar_collapser"),
											c = b.getPrevious(),
											d = a.ui.space("contents"),
											f = c.getParent(),
											e = parseInt(d.$.style.height, 10),
											g = f.$.offsetHeight,
											h = b.hasClass("cke_toolbox_collapser_min");
										if (h) {
											c.show();
											b.removeClass("cke_toolbox_collapser_min");
											b.setAttribute("title", a.lang.toolbar.toolbarCollapse)
										} else {
											c.hide();
											b.addClass("cke_toolbox_collapser_min");
											b.setAttribute("title", a.lang.toolbar.toolbarExpand)
										}
										b.getFirst().setText(h ? "▲" : "◀");
										d.setStyle("height", e - (f.$.offsetHeight - g) + "px");
										a.fire("resize")
									},
									modes: {
										wysiwyg: 1,
										source: 1
									}
								});
								f.setKeystroke(CKEDITOR.ALT + (CKEDITOR.env.ie || CKEDITOR.env.webkit ? 189 : 109), "toolbarCollapse");
								i.push('<a title="' + (d ? f.lang.toolbar.toolbarCollapse : f.lang.toolbar.toolbarExpand) + '" id="' + f.ui.spaceId("toolbar_collapser") + '" tabIndex="-1" class="cke_toolbox_collapser');
								d || i.push(" cke_toolbox_collapser_min");
								i.push('" onclick="CKEDITOR.tools.callFunction(' + z + ')">', '<span class="cke_arrow">&#9650;</span>',
									"</a>")
							}
							i.push("</span>");
							c.data.html = c.data.html + i.join("")
						}
					});
					f.on("destroy", function() {
						if (this.toolbox) {
							var a, b = 0,
								c, d, f;
							for (a = this.toolbox.toolbars; b < a.length; b++) {
								d = a[b].items;
								for (c = 0; c < d.length; c++) {
									f = d[c];
									f.clickFn && CKEDITOR.tools.removeFunction(f.clickFn);
									f.keyDownFn && CKEDITOR.tools.removeFunction(f.keyDownFn)
								}
							}
						}
					});
					f.on("uiReady", function() {
						var a = f.ui.space("toolbox");
						a && f.focusManager.add(a, 1)
					});
					f.addCommand("toolbarFocus", d);
					f.setKeystroke(CKEDITOR.ALT + 121, "toolbarFocus");
					f.ui.add("-", CKEDITOR.UI_SEPARATOR, {});
					f.ui.addHandler(CKEDITOR.UI_SEPARATOR, {
						create: function() {
							return {
								render: function(a, b) {
									b.push('<span class="cke_toolbar_separator" role="separator"></span>');
									return {}
								}
							}
						}
					})
				}
			});
			CKEDITOR.ui.prototype.addToolbarGroup = function(a, b, d) {
				var j = e(this.editor),
					g = b === 0,
					i = {
						name: a
					};
				if (d) {
					if (d = CKEDITOR.tools.search(j, function(a) {
						return a.name == d
					})) {
						!d.groups && (d.groups = []);
						if (b) {
							b = CKEDITOR.tools.indexOf(d.groups, b);
							if (b >= 0) {
								d.groups.splice(b + 1, 0, a);
								return
							}
						}
						g ? d.groups.splice(0, 0, a) : d.groups.push(a);
						return
					}
					b = null
				}
				b &&
					(b = CKEDITOR.tools.indexOf(j, function(a) {
						return a.name == b
					}));
				g ? j.splice(0, 0, a) : typeof b == "number" ? j.splice(b + 1, 0, i) : j.push(a)
			}
		}(), CKEDITOR.UI_SEPARATOR = "separator", CKEDITOR.config.toolbarLocation = "top",
		function() {
			function a(a) {
				this.editor = a;
				this.reset()
			}
			CKEDITOR.plugins.add("undo", {
				init: function(b) {
					function f(a) {
						e.enabled && a.data.command.canUndo !== false && e.save()
					}

					function c() {
						e.enabled = b.readOnly ? false : b.mode == "wysiwyg";
						e.onChange()
					}
					var e = b.undoManager = new a(b),
						j = b.addCommand("undo", {
							exec: function() {
								if (e.undo()) {
									b.selectionChange();
									this.fire("afterUndo")
								}
							},
							startDisabled: true,
							canUndo: false
						}),
						g = b.addCommand("redo", {
							exec: function() {
								if (e.redo()) {
									b.selectionChange();
									this.fire("afterRedo")
								}
							},
							startDisabled: true,
							canUndo: false
						}),
						i = [CKEDITOR.CTRL + 90, CKEDITOR.CTRL + 89, CKEDITOR.CTRL + CKEDITOR.SHIFT + 90];
					b.setKeystroke([
						[i[0], "undo"],
						[i[1], "redo"],
						[i[2], "redo"]
					]);
					b.on("contentDom", function() {
						var a = b.editable();
						a.attachListener(a, "keydown", function(a) {
							CKEDITOR.tools.indexOf(i, a.data.getKeystroke()) > -1 && a.data.preventDefault()
						})
					});
					e.onChange =
						function() {
							j.setState(e.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
							g.setState(e.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
						};
					b.on("beforeCommandExec", f);
					b.on("afterCommandExec", f);
					b.on("saveSnapshot", function(a) {
						e.save(a.data && a.data.contentOnly)
					});
					b.on("contentDom", function() {
						b.editable().on("keydown", function(a) {
							a = a.data.getKey();
							(a == 8 || a == 46) && e.type(a, 0)
						});
						b.editable().on("keypress", function(a) {
							e.type(a.data.getKey(), 1)
						})
					});
					b.on("beforeModeUnload", function() {
						b.mode ==
							"wysiwyg" && e.save(true)
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
						})
					}
					b.resetUndo = function() {
						e.reset();
						b.fire("saveSnapshot")
					};
					b.on("updateSnapshot", function() {
						e.currentImage && e.update()
					});
					b.on("lockSnapshot", function(a) {
						a = a.data;
						e.lock(a && a.dontUpdate, a && a.forceUpdate)
					});
					b.on("unlockSnapshot", e.unlock, e)
				}
			});
			CKEDITOR.plugins.undo = {};
			var e = CKEDITOR.plugins.undo.Image = function(a, b) {
					this.editor = a;
					a.fire("beforeUndoImage");
					var c = a.getSnapshot();
					CKEDITOR.env.ie && c && (c = c.replace(/\s+data-cke-expando=".*?"/g, ""));
					this.contents = c;
					if (!b) this.bookmarks = (c = c && a.getSelection()) && c.createBookmarks2(true);
					a.fire("afterUndoImage")
				},
				b = /\b(?:href|src|name)="[^"]*?"/gi;
			e.prototype = {
				equalsContent: function(a) {
					var f = this.contents,
						a = a.contents;
					if (CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks)) {
						f = f.replace(b, "");
						a = a.replace(b, "")
					}
					return f !=
						a ? false : true
				},
				equalsSelection: function(a) {
					var b = this.bookmarks,
						a = a.bookmarks;
					if (b || a) {
						if (!b || !a || b.length != a.length) return false;
						for (var c = 0; c < b.length; c++) {
							var e = b[c],
								j = a[c];
							if (e.startOffset != j.startOffset || e.endOffset != j.endOffset || !CKEDITOR.tools.arrayCompare(e.start, j.start) || !CKEDITOR.tools.arrayCompare(e.end, j.end)) return false
						}
					}
					return true
				}
			};
			a.prototype = {
				type: function(a, b) {
					var c = !b && a != this.lastKeystroke,
						h = this.editor;
					if (!this.typing || b && !this.wasCharacter || c) {
						var j = new e(h),
							g = this.snapshots.length;
						CKEDITOR.tools.setTimeout(function() {
							var a = h.getSnapshot();
							CKEDITOR.env.ie && (a = a.replace(/\s+data-cke-expando=".*?"/g, ""));
							if (j.contents != a && g == this.snapshots.length) {
								this.typing = true;
								this.save(false, j, false) || this.snapshots.splice(this.index + 1, this.snapshots.length - this.index - 1);
								this.hasUndo = true;
								this.hasRedo = false;
								this.modifiersCount = this.typesCount = 1;
								this.onChange()
							}
						}, 0, this)
					}
					this.lastKeystroke = a;
					if (this.wasCharacter = b) {
						this.modifiersCount = 0;
						this.typesCount++;
						if (this.typesCount > 25) {
							this.save(false,
								null, false);
							this.typesCount = 1
						} else setTimeout(function() {
							h.fire("change")
						}, 0)
					} else {
						this.typesCount = 0;
						this.modifiersCount++;
						if (this.modifiersCount > 25) {
							this.save(false, null, false);
							this.modifiersCount = 1
						} else setTimeout(function() {
							h.fire("change")
						}, 0)
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
					this.resetType()
				},
				resetType: function() {
					this.typing = false;
					delete this.lastKeystroke;
					this.modifiersCount = this.typesCount = 0
				},
				fireChange: function() {
					this.hasUndo = !!this.getNextImage(true);
					this.hasRedo = !!this.getNextImage(false);
					this.resetType();
					this.onChange()
				},
				save: function(a, b, c) {
					var h = this.editor;
					if (this.locked || h.status != "ready" || h.mode != "wysiwyg") return false;
					var j = h.editable();
					if (!j || j.status != "ready") return false;
					j = this.snapshots;
					b || (b = new e(h));
					if (b.contents === false) return false;
					if (this.currentImage)
						if (b.equalsContent(this.currentImage)) {
							if (a || b.equalsSelection(this.currentImage)) return false
						} else h.fire("change");
					j.splice(this.index + 1, j.length - this.index - 1);
					j.length == this.limit && j.shift();
					this.index = j.push(b) - 1;
					this.currentImage = b;
					c !== false && this.fireChange();
					return true
				},
				restoreImage: function(a) {
					var b = this.editor,
						c;
					if (a.bookmarks) {
						b.focus();
						c = b.getSelection()
					}
					this.locked = 1;
					this.editor.loadSnapshot(a.contents);
					if (a.bookmarks) c.selectBookmarks(a.bookmarks);
					else if (CKEDITOR.env.ie) {
						c = this.editor.document.getBody().$.createTextRange();
						c.collapse(true);
						c.select()
					}
					this.locked = 0;
					this.index = a.index;
					this.currentImage =
						this.snapshots[this.index];
					this.update();
					this.fireChange();
					b.fire("change")
				},
				getNextImage: function(a) {
					var b = this.snapshots,
						c = this.currentImage,
						e;
					if (c)
						if (a)
							for (e = this.index - 1; e >= 0; e--) {
								a = b[e];
								if (!c.equalsContent(a)) {
									a.index = e;
									return a
								}
							} else
								for (e = this.index + 1; e < b.length; e++) {
									a = b[e];
									if (!c.equalsContent(a)) {
										a.index = e;
										return a
									}
								}
					return null
				},
				redoable: function() {
					return this.enabled && this.hasRedo
				},
				undoable: function() {
					return this.enabled && this.hasUndo
				},
				undo: function() {
					if (this.undoable()) {
						this.save(true);
						var a = this.getNextImage(true);
						if (a) return this.restoreImage(a), true
					}
					return false
				},
				redo: function() {
					if (this.redoable()) {
						this.save(true);
						if (this.redoable()) {
							var a = this.getNextImage(false);
							if (a) return this.restoreImage(a), true
						}
					}
					return false
				},
				update: function(a) {
					if (!this.locked) {
						a || (a = new e(this.editor));
						for (var b = this.index, c = this.snapshots; b > 0 && this.currentImage.equalsContent(c[b - 1]);) b = b - 1;
						c.splice(b, this.index - b + 1, a);
						this.index = b;
						this.currentImage = a
					}
				},
				lock: function(a, b) {
					if (this.locked) this.locked.level++;
					else if (a) this.locked = {
						level: 1
					};
					else {
						var c = null;
						if (b) c = true;
						else {
							var h = new e(this.editor, true);
							this.currentImage && this.currentImage.equalsContent(h) && (c = h)
						}
						this.locked = {
							update: c,
							level: 1
						}
					}
				},
				unlock: function() {
					if (this.locked && !--this.locked.level) {
						var a = this.locked.update;
						this.locked = null;
						if (a === true) this.update();
						else if (a) {
							var b = new e(this.editor, true);
							a.equalsContent(b) || this.update()
						}
					}
				}
			}
		}(),
		function() {
			function a(a) {
				var b = this.editor,
					c = a.document,
					e = c.body,
					j = c.getElementById("cke_actscrpt");
				j && j.parentNode.removeChild(j);
				(j = c.getElementById("cke_shimscrpt")) && j.parentNode.removeChild(j);
				if (CKEDITOR.env.gecko) {
					e.contentEditable = false;
					if (CKEDITOR.env.version < 2E4) {
						e.innerHTML = e.innerHTML.replace(/^.*<\!-- cke-content-start --\>/, "");
						setTimeout(function() {
							var a = new CKEDITOR.dom.range(new CKEDITOR.dom.document(c));
							a.setStart(new CKEDITOR.dom.node(e), 0);
							b.getSelection().selectRanges([a])
						}, 0)
					}
				}
				e.contentEditable = true;
				if (CKEDITOR.env.ie) {
					e.hideFocus = true;
					e.disabled = true;
					e.removeAttribute("disabled")
				}
				delete this._.isLoadingData;
				this.$ = e;
				c = new CKEDITOR.dom.document(c);
				this.setup();
				if (CKEDITOR.env.ie) {
					c.getDocumentElement().addClass(c.$.compatMode);
					b.config.enterMode != CKEDITOR.ENTER_P && this.attachListener(c, "selectionchange", function() {
						var a = c.getBody(),
							d = b.getSelection(),
							e = d && d.getRanges()[0];
						e && (a.getHtml().match(/^<p>(?:&nbsp;|<br>)<\/p>$/i) && e.startContainer.equals(a)) && setTimeout(function() {
								e = b.getSelection().getRanges()[0];
								if (!e.startContainer.equals("body")) {
									a.getFirst().remove(1);
									e.moveToElementEditEnd(a);
									e.select()
								}
							},
							0)
					})
				}
				if (CKEDITOR.env.webkit || CKEDITOR.env.ie && CKEDITOR.env.version > 10) c.getDocumentElement().on("mousedown", function(a) {
					a.data.getTarget().is("html") && setTimeout(function() {
						b.editable().focus()
					})
				});
				try {
					b.document.$.execCommand("2D-position", false, true)
				} catch (g) {}
				try {
					b.document.$.execCommand("enableInlineTableEditing", false, !b.config.disableNativeTableHandles)
				} catch (i) {}
				if (b.config.disableObjectResizing) try {
					this.getDocument().$.execCommand("enableObjectResizing", false, false)
				} catch (k) {
					this.attachListener(this,
						CKEDITOR.env.ie ? "resizestart" : "resize", function(a) {
							a.data.preventDefault()
						})
				}(CKEDITOR.env.gecko || CKEDITOR.env.ie && b.document.$.compatMode == "CSS1Compat") && this.attachListener(this, "keydown", function(a) {
					var c = a.data.getKeystroke();
					if (c == 33 || c == 34)
						if (CKEDITOR.env.ie) setTimeout(function() {
							b.getSelection().scrollIntoView()
						}, 0);
						else if (b.window.$.innerHeight > this.$.offsetHeight) {
						var d = b.createRange();
						d[c == 33 ? "moveToElementEditStart" : "moveToElementEditEnd"](this);
						d.select();
						a.data.preventDefault()
					}
				});
				CKEDITOR.env.ie &&
					this.attachListener(c, "blur", function() {
						try {
							c.$.selection.empty()
						} catch (a) {}
					});
				CKEDITOR.env.iOS && this.attachListener(c, "touchend", function() {
					a.focus()
				});
				b.document.getElementsByTag("title").getItem(0).data("cke-title", b.document.$.title);
				if (CKEDITOR.env.ie) b.document.$.title = this._.docTitle;
				CKEDITOR.tools.setTimeout(function() {
					if (this.status == "unloaded") this.status = "ready";
					b.fire("contentDom");
					if (this._.isPendingFocus) {
						b.focus();
						this._.isPendingFocus = false
					}
					setTimeout(function() {
							b.fire("dataReady")
						},
						0);
					CKEDITOR.env.ie && setTimeout(function() {
						if (b.document) {
							var a = b.document.$.body;
							a.runtimeStyle.marginBottom = "0px";
							a.runtimeStyle.marginBottom = ""
						}
					}, 1E3)
				}, 0, this)
			}

			function e() {
				var a = [];
				if (CKEDITOR.document.$.documentMode >= 8) {
					a.push("html.CSS1Compat [contenteditable=false]{min-height:0 !important}");
					var b = [],
						c;
					for (c in CKEDITOR.dtd.$removeEmpty) b.push("html.CSS1Compat " + c + "[contenteditable=false]");
					a.push(b.join(",") + "{display:inline-block}")
				} else if (CKEDITOR.env.gecko) {
					a.push("html{height:100% !important}");
					a.push("img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}")
				}
				a.push("html{cursor:text;*cursor:auto}");
				a.push("img,input,textarea{cursor:default}");
				return a.join("\n")
			}
			CKEDITOR.plugins.add("wysiwygarea", {
				init: function(a) {
					a.config.fullPage && a.addFeature({
						allowedContent: "html head title; style [media,type]; body (*)[id]; meta link [*]",
						requiredContent: "body"
					});
					a.addMode("wysiwyg", function(e) {
						function c(c) {
							c && c.removeListener();
							a.editable(new b(a, j.$.contentWindow.document.body));
							a.setData(a.getData(1), e)
						}
						var h = "document.open();" + (CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "") + "document.close();",
							h = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent(h) + "}())" : "",
							j = CKEDITOR.dom.element.createFromHtml('<iframe src="' + h + '" frameBorder="0"></iframe>');
						j.setStyles({
							width: "100%",
							height: "100%"
						});
						j.addClass("cke_wysiwyg_frame cke_reset");
						var g = a.ui.space("contents");
						g.append(j);
						if (h = CKEDITOR.env.ie || CKEDITOR.env.gecko) j.on("load",
							c);
						var i = a.title,
							k = a.lang.common.editorHelp;
						if (i) {
							CKEDITOR.env.ie && (i = i + (", " + k));
							j.setAttribute("title", i)
						}
						var i = CKEDITOR.tools.getNextId(),
							n = CKEDITOR.dom.element.createFromHtml('<span id="' + i + '" class="cke_voice_label">' + k + "</span>");
						g.append(n, 1);
						a.on("beforeModeUnload", function(a) {
							a.removeListener();
							n.remove()
						});
						j.setAttributes({
							"aria-describedby": i,
							tabIndex: a.tabIndex,
							allowTransparency: "true"
						});
						!h && c();
						if (CKEDITOR.env.webkit) {
							h = function() {
								g.setStyle("width", "100%");
								j.hide();
								j.setSize("width",
									g.getSize("width"));
								g.removeStyle("width");
								j.show()
							};
							j.setCustomData("onResize", h);
							CKEDITOR.document.getWindow().on("resize", h)
						}
						a.fire("ariaWidget", j)
					})
				}
			});
			CKEDITOR.editor.prototype.addContentsCss = function(a) {
				var b = this.config,
					c = b.contentsCss;
				if (!CKEDITOR.tools.isArray(c)) b.contentsCss = c ? [c] : [];
				b.contentsCss.push(a)
			};
			var b = CKEDITOR.tools.createClass({
				$: function(b) {
					this.base.apply(this, arguments);
					this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function(b) {
							CKEDITOR.tools.setTimeout(a, 0, this, b)
						},
						this);
					this._.docTitle = this.getWindow().getFrame().getAttribute("title")
				},
				base: CKEDITOR.editable,
				proto: {
					setData: function(a, b) {
						var c = this.editor;
						if (b) {
							this.setHtml(a);
							c.fire("dataReady")
						} else {
							this._.isLoadingData = true;
							c._.dataStore = {
								id: 1
							};
							var h = c.config,
								j = h.fullPage,
								g = h.docType,
								i = CKEDITOR.tools.buildStyleHtml(e()).replace(/<style>/, '<style data-cke-temp="1">');
							j || (i = i + CKEDITOR.tools.buildStyleHtml(c.config.contentsCss));
							var k = h.baseHref ? '<base href="' + h.baseHref + '" data-cke-temp="1" />' : "";
							j && (a = a.replace(/<!DOCTYPE[^>]*>/i,
								function(a) {
									c.docType = g = a;
									return ""
								}).replace(/<\?xml\s[^\?]*\?>/i, function(a) {
								c.xmlDeclaration = a;
								return ""
							}));
							a = c.dataProcessor.toHtml(a);
							if (j) {
								/<body[\s|>]/.test(a) || (a = "<body>" + a);
								/<html[\s|>]/.test(a) || (a = "<html>" + a + "</html>");
								/<head[\s|>]/.test(a) ? /<title[\s|>]/.test(a) || (a = a.replace(/<head[^>]*>/, "$&<title></title>")) : a = a.replace(/<html[^>]*>/, "$&<head><title></title></head>");
								k && (a = a.replace(/<head>/, "$&" + k));
								a = a.replace(/<\/head\s*>/, i + "$&");
								a = g + a
							} else a = h.docType + '<html dir="' + h.contentsLangDirection +
								'" lang="' + (h.contentsLanguage || c.langCode) + '"><head><title>' + this._.docTitle + "</title>" + k + i + "</head><body" + (h.bodyId ? ' id="' + h.bodyId + '"' : "") + (h.bodyClass ? ' class="' + h.bodyClass + '"' : "") + ">" + a + "</body></html>"; if (CKEDITOR.env.gecko) {
								a = a.replace(/<body/, '<body contenteditable="true" ');
								CKEDITOR.env.version < 2E4 && (a = a.replace(/<body[^>]*>/, "$&<\!-- cke-content-start --\>"))
							}
							h = '<script id="cke_actscrpt" type="text/javascript"' + (CKEDITOR.env.ie ? ' defer="defer" ' : "") + ">var wasLoaded=0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" +
								this._.frameLoadedHandler + ",window);wasLoaded=1;}" + (CKEDITOR.env.ie ? "onload();" : 'document.addEventListener("DOMContentLoaded", onload, false );') + "<\/script>";
							CKEDITOR.env.ie && CKEDITOR.env.version < 9 && (h = h + '<script id="cke_shimscrpt">window.parent.CKEDITOR.tools.enableHtml5Elements(document)<\/script>');
							a = a.replace(/(?=\s*<\/(:?head)>)/, h);
							this.clearCustomData();
							this.clearListeners();
							c.fire("contentDomUnload");
							var n = this.getDocument();
							try {
								n.write(a)
							} catch (o) {
								setTimeout(function() {
									n.write(a)
								}, 0)
							}
						}
					},
					getData: function(a) {
						if (a) return this.getHtml();
						var a = this.editor,
							b = a.config,
							c = b.fullPage,
							e = c && a.docType,
							j = c && a.xmlDeclaration,
							g = this.getDocument(),
							c = c ? g.getDocumentElement().getOuterHtml() : g.getBody().getHtml();
						CKEDITOR.env.gecko && b.enterMode != CKEDITOR.ENTER_BR && (c = c.replace(/<br>(?=\s*(:?$|<\/body>))/, ""));
						c = a.dataProcessor.toDataFormat(c);
						j && (c = j + "\n" + c);
						e && (c = e + "\n" + c);
						return c
					},
					focus: function() {
						this._.isLoadingData ? this._.isPendingFocus = true : b.baseProto.focus.call(this)
					},
					detach: function() {
						var a =
							this.editor,
							e = a.document,
							a = a.window.getFrame();
						b.baseProto.detach.call(this);
						this.clearCustomData();
						e.getDocumentElement().clearCustomData();
						a.clearCustomData();
						CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);
						(e = a.removeCustomData("onResize")) && e.removeListener();
						a.remove()
					}
				}
			})
		}(), CKEDITOR.config.disableObjectResizing = !1, CKEDITOR.config.disableNativeTableHandles = !0, CKEDITOR.config.disableNativeSpellChecker = !0, CKEDITOR.config.contentsCss = CKEDITOR.getUrl("contents.css"),
		function() {
			CKEDITOR.plugins.add("imagemaps", {
				requires: ["dialog"],
				lang: ["en", "de", "el", "es", "it", "nl", "sv", "tr"],
				init: function(a) {
					var e = a.lang.imagemaps;
					window.imgmapStrings = e.imgmapStrings;
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
					var b = a.addCommand("imagemaps", new CKEDITOR.dialogCommand("ImageMaps", {
						allowedContent: "img[usemap];map[id,name];area[alt,coords,href,shape,target,title]",
						requiredContent: "img[src]"
					}));
					b.startDisabled = true;
					a.ui.addButton("ImageMaps", {
						label: e.toolbar,
						command: "imagemaps",
						toolbar: "insert,10"
					});
					a.addMenuItems && a.addMenuItems({
						imagemaps: {
							label: e.menu,
							command: "imagemaps",
							group: "image",
							order: 1
						}
					});
					a.contextMenu && a.contextMenu.addListener(function(a) {
						a = d(a);
						return !a ? null : {
							imagemaps: a.hasAttribute("usemap") ?
								CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF
						}
					});
					a.on("doubleclick", function(a) {
						var b = a.data.element,
							e = a.editor,
							j;
						if (b.is("area")) {
							var g = b.getParent().$.getAttribute("id"),
								i = e.editable ? e.editable().$ : e.document.$;
							i.querySelector && (j = i.querySelector('img[usemap="#' + g + '"]'));
							if (j) {
								e.getSelection().selectElement(new CKEDITOR.dom.element(j));
								a.data.dialog = "ImageMaps";
								return
							}
						}
						if ((j = d(b)) && j.hasAttribute("usemap")) {
							e.getSelection().selectElement(j);
							a.data.dialog = "ImageMaps"
						}
					}, null, null, 20);
					if (a.widgets) a.on("contentDom",
						function() {
							var b = a.editable();
							b.attachListener(b, "click", function(c) {
								var d = c.data.$,
									d = new CKEDITOR.dom.node(d.target || d.srcElement);
								if (d.is && d.is("area")) {
									CKEDITOR.env.ie && c.data.preventDefault();
									var d = d.getParent().$.getAttribute("id"),
										e = b.$;
									if (e.querySelector)
										if (d = e.querySelector('img[usemap="#' + d + '"]'))
											if (d = a.widgets.getByElement(new CKEDITOR.dom.node(d))) {
												d.focus();
												c.data.preventDefault()
											}
								}
							})
						});
					var d = function(b) {
						if (a.widgets) {
							var c = a.widgets.focused;
							if (!c)(c = a.widgets.getByElement(b)) && c.focus();
							if (c && (c.name == "image2" || c.name == "image")) {
								b = c.element;
								if (!b) return null;
								if (b.getName() == "img") return b;
								b = b.getElementsByTag("img");
								return b.count() == 1 ? b.getItem(0) : null
							}
						}
						return !b || !b.is("img") || b.data && b.data("cke-realelement") || b.isReadOnly() ? null : b
					};
					a.on("selectionChange", CKEDITOR.tools.bind(function(a) {
						(a = d(a.data.path.lastElement)) ? this.setState(a.hasAttribute("usemap") ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF): this.setState(CKEDITOR.TRISTATE_DISABLED)
					}, b));
					if (!CKEDITOR.env.ie || a.plugins.image2 ||
						!(CKEDITOR.env.version < 9)) {
						CKEDITOR.on("dialogDefinition", function(b) {
							if (b.data.name == "image") {
								var c = b.data.definition;
								b.removeListener();
								c.onOk = CKEDITOR.tools.override(c.onOk, function(b) {
									return function() {
										b.call(this);
										var c = this.imageElement,
											d = c.getAttribute("usemap");
										if (d)(d = (a.editable ? a.editable().$ : a.document.$).querySelector(d)) && CKEDITOR.plugins.imagemaps.drawMap(c.$, d)
									}
								})
							}
						});
						e = "dataReady";
						CKEDITOR.skins && (e = "contentDom");
						a.on(e, function(a) {
							for (var a = a.editor, a = a.editable ? a.editable().$ : a.document.$,
								b = a.getElementsByTagName("map"), d = 0; d < b.length; d++) {
								var e = b[d],
									g = a.querySelector('img[usemap="#' + e.name + '"]');
								g && CKEDITOR.plugins.imagemaps.drawMap(g, e)
							}
						}, null, null, 50);
						if (!CKEDITOR.plugins.imagemaps) CKEDITOR.plugins.imagemaps = {};
						CKEDITOR.plugins.imagemaps.drawMap = function(a, b, d) {
							if (a.width) {
								if (!d) {
									if (a.attributes["data-cke-saved-src"]) {
										var e = new Image;
										e.width = a.width;
										e.height = a.height;
										e.onload = function() {
											CKEDITOR.plugins.imagemaps.drawMap(a, b, e)
										};
										e.src = a.attributes["data-cke-saved-src"].value;
										return
									}
									d =
										a
								}
								var g = a.ownerDocument.createElement("canvas"),
									i = g.getContext("2d");
								g.setAttribute("width", a.width);
								g.setAttribute("height", a.height);
								i.drawImage(d, 0, 0, a.width, a.height);
								i.strokeStyle = "#DDDDDD";
								i.lineWidth = 1;
								i.shadowOffsetX = 0;
								i.shadowOffsetY = 0;
								i.shadowBlur = 3;
								i.shadowColor = "#333333";
								for (d = 0; d < b.areas.length; d++) {
									var k = b.areas[d],
										n = k.coords.split(",");
									switch (k.shape) {
										case "circle":
											i.beginPath();
											i.arc(n[0], n[1], n[2], 0, Math.PI * 2, true);
											i.closePath();
											i.stroke();
											break;
										case "poly":
											i.beginPath();
											i.moveTo(n[0],
												n[1]);
											for (k = 2; k < n.length; k = k + 2) i.lineTo(n[k], n[k + 1]);
											i.closePath();
											i.stroke();
											break;
										default:
											i.strokeRect(n[0], n[1], n[2] - n[0], n[3] - n[1])
									}
								}
								try {
									a.src = g.toDataURL()
								} catch (o) {}
							} else {
								var r = function() {
									a.removeEventListener("load", r);
									CKEDITOR.plugins.imagemaps.drawMap(a, b)
								};
								a.addEventListener("load", r, false)
							}
						}
					}
				},
				afterInit: function(a) {
					var e = a.dataProcessor;
					(e && e.htmlFilter).addRules({
						elements: {
							map: function(b) {
								if (b.attributes.id && !b.attributes.name) b.attributes.name = b.attributes.id;
								var d = a.editable ? a.editable().$ :
									a.document.$;
								return d.querySelector && !d.querySelector('img[usemap="#' + b.attributes.name + '"]') ? false : b
							}
						}
					}, {
						applyToAll: true
					})
				}
			});
			if (CKEDITOR.skins) CKEDITOR.plugins.setLang = CKEDITOR.tools.override(CKEDITOR.plugins.setLang, function(a) {
				return function(e, b, d) {
					if (e != "devtools" && typeof d[e] != "object") {
						var f = {};
						f[e] = d;
						d = f
					}
					a.call(this, e, b, d)
				}
			});
			delete CKEDITOR.dtd.$nonBodyContent.map;
			CKEDITOR.dtd.$body ? CKEDITOR.dtd.$body.map = 1 : CKEDITOR.dtd.head.map = 1;
			CKEDITOR.dtd.body.map = 1
		}(), CKEDITOR.config.plugins = "basicstyles,dialogui,dialog,colordialog,clipboard,panel,floatpanel,menu,contextmenu,elementspath,enterkey,entities,popup,filebrowser,floatingspace,htmlwriter,image,justify,fakeobjects,link,maximize,preview,resize,selectall,sourcearea,button,toolbar,undo,wysiwygarea,imagemaps",
		CKEDITOR.config.skin = "alive",
		function() {
			var a = function(a, b) {
				for (var d = CKEDITOR.getUrl("plugins/" + b), a = a.split(","), f = 0; f < a.length; f++) CKEDITOR.skin.icons[a[f]] = {
					path: d,
					offset: -a[++f],
					bgsize: a[++f]
				}
			};
			CKEDITOR.env.hidpi ? a("bold,0,,italic,24,,strike,48,,subscript,72,,superscript,96,,underline,120,,copy-rtl,144,,copy,168,,cut-rtl,192,,cut,216,,paste-rtl,240,,paste,264,,image,288,,imagemaps,624,auto,justifyblock,336,,justifycenter,360,,justifyleft,384,,justifyright,408,,anchor-rtl,432,,anchor,456,,link,480,,unlink,504,,maximize,528,,preview-rtl,552,,preview,576,,selectall,600,,source-rtl,624,,source,648,,redo-rtl,672,,redo,696,,undo-rtl,720,,undo,744,",
				"icons_hidpi.png") : a("bold,0,auto,italic,24,auto,strike,48,auto,subscript,72,auto,superscript,96,auto,underline,120,auto,copy-rtl,144,auto,copy,168,auto,cut-rtl,192,auto,cut,216,auto,paste-rtl,240,auto,paste,264,auto,image,288,auto,imagemaps,312,auto,justifyblock,336,auto,justifycenter,360,auto,justifyleft,384,auto,justifyright,408,auto,anchor-rtl,432,auto,anchor,456,auto,link,480,auto,unlink,504,auto,maximize,528,auto,preview-rtl,552,auto,preview,576,auto,selectall,600,auto,source-rtl,624,auto,source,648,auto,redo-rtl,672,auto,redo,696,auto,undo-rtl,720,auto,undo,744,auto",
				"icons.png")
		}(), CKEDITOR.lang.languages = {
			en: 1,
			de: 1,
			el: 1,
			es: 1,
			it: 1,
			nl: 1,
			sv: 1,
			tr: 1
		}
})();
(function() {
	function a(a) {
		d(!0);
		f();
		m = a.aid;
		r.setValueOf("info", "href", a.ahref);
		r.setValueOf("info", "target", a.atarget || "notSet");
		r.setValueOf("info", "alt", a.aalt);
		r.setValueOf("info", "title", a.atitle)
	}

	function e(a) {
		d(!0);
		f();
		m = a;
		r.getContentElement("info", "href").setValue("", !0);
		r.getContentElement("info", "target").setValue("notSet", !0);
		r.getContentElement("info", "alt").setValue("", !0);
		r.getContentElement("info", "title").setValue("", !0)
	}

	function b() {
		m = null;
		d(!1)
	}

	function d(a) {
		for (var b = 1; 2 >= b; b++) {
			var c =
				r.getContentElement("info", "properties" + b).getElement();
			a ? c.setStyle("visibility", "") : c.setStyle("visibility", "hidden")
		}
	}

	function f() {
		null !== m && (i.areas[m].ahref = r.getValueOf("info", "href"), i.areas[m].aalt = r.getValueOf("info", "alt"), i.areas[m].atitle = r.getValueOf("info", "title"))
	}

	function c(a) {
		"pointer" == a ? (i.is_drawing = 0, i.nextShape = "", l.$.style.cursor = "default") : (i.nextShape = a, l.$.style.cursor = "crosshair");
		h(a)
	}

	function h(a) {
		o && o.removeClass("imgmapButtonActive");
		o = r.getContentElement("info", "btn_" +
			a).getElement();
		o.addClass("imgmapButtonActive")
	}

	function j(a) {
		for (var b = "", c = 0; c < a.areas.length; c++) {
			var d;
			d = a.areas[c];
			if (!d || "" === d.shape) d = "";
			else {
				var e = '<area shape="' + d.shape + '" coords="' + d.lastInput + '"';
				d.aalt && (e += ' alt="' + d.aalt + '"');
				d.atitle && (e += ' title="' + d.atitle + '"');
				d.ahref && (e += ' href="' + d.ahref + '" data-cke-saved-href="' + d.ahref + '"');
				d.atarget && "notSet" != d.atarget && (e += ' target="' + d.atarget + '"');
				d = e += "/>"
			}
			b += d
		}
		return b
	}

	function g() {
		var a = m;
		null !== a && (i.areas[a]["a" + this.id] = this.getValue(),
			i._recalculate(a))
	}
	var i, k, n, o, r, l, m = null;
	CKEDITOR.dialog.add("ImageMaps", function(d) {
		function t() {
			if (w && "undefined" != typeof imgmap && !(CKEDITOR.env.ie && "undefined" == typeof window.CanvasRenderingContext2D)) {
				n = m = null;
				k = d.getSelection().getSelectedElement();
				if ((!k || !k.is("img")) && d.widgets) {
					var f = d.widgets.focused;
					if (f && ("image2" == f.name || "image" == f.name))
						if (f = f.element) "img" == f.getName() ? k = f : (f = f.getElementsByTag("img"), 1 == f.count() && (k = f.getItem(0)))
				}
				if (!k || !k.is("img")) alert(q.msgImageNotSelected),
					r.hide();
				else {
					var f = k.data ? k.data("cke-saved-src") : k.getAttribute("_cke_saved_src"),
						g = document.getElementById(B),
						j = CKEDITOR.document.getWindow().getViewPaneSize().height - 290,
						j = Math.max(j, 315);
					g.style.maxHeight = j + "px";
					i = new imgmap({
						mode: "editor2",
						custom_callbacks: {
							onSelectArea: a,
							onRemoveArea: b,
							onStatusMessage: function(a) {
								document.getElementById(v).innerHTML = a
							},
							onLoadImage: function(a) {
								var b = a.getAttribute("width"),
									c = a.getAttribute("height");
								b && (a.style.width = b + "px");
								c && (a.style.height = c + "px");
								l = new CKEDITOR.dom.element(a);
								l.on("dragstart", function(a) {
									a.data.preventDefault()
								})
							}
						},
						pic_container: g,
						bounding_box: !1,
						lang: "",
						CL_DRAW_SHAPE: "#F00",
						CL_NORM_SHAPE: "#AAA",
						CL_HIGHLIGHT_SHAPE: "#F00"
					});
					i.loadStrings(imgmapStrings);
					k = k.$;
					i.loadImage(f, parseInt(k.style.width || k.width || 0, 10), parseInt(k.style.height || k.height || 0, 10));
					f = k.getAttribute("usemap", 2) || k.usemap;
					if ("string" == typeof f && "" !== f) {
						f = f.substr(1);
						g = (d.editable ? d.editable().$ : d.document.$).getElementsByTagName("MAP");
						for (j = 0; j < g.length; j++)
							if (g[j].name == f || g[j].id ==
								f) {
								n = g[j];
								i.setMapHTML(n);
								r.setValueOf("info", "MapName", f);
								break
							}
					}
					i.config.custom_callbacks.onAddArea = e;
					n ? (i.blurArea(i.currentid), i.currentid = 0, i.selectedId = 0, a(i.areas[0]), i.highlightArea(0), c("pointer")) : h("rect");
					x();
					window.setTimeout(x, 1E3)
				}
			}
		}

		function p() {
			d.fire("saveSnapshot");
			k && "IMG" == k.nodeName && (k.removeAttribute("usemap", 0), k.src = k.attributes["data-cke-saved-src"].value);
			n && n.parentNode.removeChild(n);
			r.hide()
		}

		function x() {
			var a = parseInt(CKEDITOR.revision, 10);
			if (isNaN(a) || !(7296 > a && CKEDITOR.skins &&
				d.config.filebrowserBrowseUrl)) {
				var a = r.parts.contents,
					b = a.getFirst().getFirst(),
					c = document.getElementById(B);
				c.style.width = parseInt(a.$.style.width, 10) + "px";
				c.style.height = parseInt(c.style.height, 10) + (parseInt(a.$.style.height, 10) - b.$.offsetHeight) + "px"
			}
		}
		var q = d.lang.imagemaps,
			u = d.lang.common.generalTab,
			B = "pic_container" + CKEDITOR.tools.getNextNumber(),
			v = "StatusContainer" + CKEDITOR.tools.getNextNumber(),
			z = d.plugins.imagemaps,
			w = !1;
		CKEDITOR.env.ie && "undefined" == typeof window.CanvasRenderingContext2D &&
			CKEDITOR.scriptLoader.load(z.path + "dialog/excanvas.js", t);
		"undefined" == typeof imgmap && CKEDITOR.scriptLoader.load(z.path + "dialog/imgmap.js", t);
		var D = "",
			A = CKEDITOR.document.getHead().append("style");
		A.setAttribute("type", "text/css");
		D += '.imgmapButton {cursor:pointer; background: url("' + z.path + 'images/sprite.png") no-repeat top left; width: 16px; height: 16px; display:inline-block;}';
		D = D + ".imgmapButtonActive {outline:1px solid #666; background-color:#ddd;}.imgmap_label {cursor:default;}" + ("#" + B + " img {max-width:none; max-height:none;}");
		CKEDITOR.env.ie && 11 > CKEDITOR.env.version ? A.$.styleSheet.cssText = D : A.$.innerHTML = D;
		z = "fieldset";
		D = parseInt(CKEDITOR.revision, 10);
		!isNaN(D) && (7296 > D && CKEDITOR.skins && d.config.filebrowserBrowseUrl) && (z = "vbox");
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
					hidden: !0,
					children: [{
						id: "MapName",
						type: "text",
						label: q.imgmapMapName,
						labelLayout: "horizontal",
						onChange: function() {
							i.mapname = this.getValue()
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
								c("pointer")
							},
							html: '<span style="background-position: 0 -64px;" class="imgmapButton" title="' + q.imgmapPointer + '"></span>'
						}, {
							type: "html",
							id: "btn_rect",
							onClick: function() {
								c("rect")
							},
							html: '<span style="background-position: 0 -128px;" class="imgmapButton" title="' +
								q.imgmapRectangle + '"></span>'
						}, {
							type: "html",
							id: "btn_circle",
							onClick: function() {
								c("circle")
							},
							html: '<span style="background-position: 0 0;" class="imgmapButton" title="' + q.imgmapCircle + '"></span>'
						}, {
							type: "html",
							id: "btn_poly",
							onClick: function() {
								c("poly")
							},
							html: '<span style="background-position: 0 -96px;" class="imgmapButton" title="' + q.imgmapPolygon + '"></span>'
						}, {
							type: "html",
							onClick: function() {
								i.removeArea(i.currentid)
							},
							html: '<span style="background-position: 0 -32px;" class="imgmapButton" title="' +
								q.imgmapDeleteArea + '"></span>'
						}, {
							type: "html",
							html: '<div id="' + v + '">&nbsp;</div>'
						}, {
							type: "select",
							id: "zoom",
							labelLayout: "horizontal",
							label: q.imgmapLabelZoom,
							onChange: function() {
								var a = this.getValue(),
									b = document.getElementById(B).getElementsByTagName("img")[0];
								b && (b.oldwidth || (b.oldwidth = b.width), b.oldheight || (b.oldheight = b.height), b.style.width = b.oldwidth * a + "px", b.style.height = b.oldheight * a + "px", i.scaleAllAreas(a))
							},
							"default": "1",
							items: [
								["25%", "0.25"],
								["50%", "0.5"],
								["100%", "1"],
								["200%", "2"],
								["300%",
									"3"
								]
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
							hidden: !0,
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
				r.on("resize", x)
			},
			onShow: function() {
				w = !0;
				t()
			},
			onHide: function() {
				o && (o.removeClass("imgmapButtonActive"), o = null);
				document.getElementById(B).innerHTML = ""
			},
			onOk: function() {
				f();
				if (k && "IMG" == k.nodeName) {
					var a = j(i);
					if (a) {
						i.mapid = i.mapname = r.getValueOf("info", "MapName");
						if ("boolean" == typeof d.fire("imagemaps.validate", i)) return !1;
						d.fire("saveSnapshot");
						a = j(i);
						if (!n) {
							n = d.document.$.createElement("map");
							var b = k;
							if (d.widgets) {
								var c = d.widgets.focused;
								c && (b = c.wrapper.$)
							}
							b.parentNode.insertBefore(n, b.nextSibling)
						}
						n.innerHTML = a;
						n.name && n.removeAttribute("name");
						n.name = i.getMapName();
						n.id = i.getMapId();
						k.setAttribute("usemap", "#" + n.name, 0);
						CKEDITOR.plugins.imagemaps && CKEDITOR.plugins.imagemaps.drawMap &&
							CKEDITOR.plugins.imagemaps.drawMap(k, n)
					} else p()
				}
			}
		}
	})
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
	this.isLoaded = !1;
	this.mapid = this.mapname = "";
	this.DM_RECTANGLE_DRAW = this.globalscale = 1;
	this.DM_RECTANGLE_MOVE = 11;
	this.DM_RECTANGLE_RESIZE_TOP = 12;
	this.DM_RECTANGLE_RESIZE_RIGHT = 13;
	this.DM_RECTANGLE_RESIZE_BOTTOM = 14;
	this.DM_RECTANGLE_RESIZE_LEFT =
		15;
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
	this.config.bounding_box = !0;
	this.config.label = "%n";
	this.config.label_class = "imgmap_label";
	this.config.label_style = "font: bold 10px Arial";
	this.config.hint = "#%n %h";
	this.config.draw_opacity = "35";
	this.config.norm_opacity = "50";
	this.config.highlight_opacity = "70";
	this.config.cursor_default =
		"crosshair";
	var e = navigator.userAgent;
	this.isMSIE = "Microsoft Internet Explorer" == navigator.appName;
	this.isSafari = -1 != e.indexOf("Safari");
	this.isOpera = "undefined" != typeof window.opera;
	this.setup(a)
}
imgmap.prototype.assignOID = function(a) {
	try {
		if ("undefined" == typeof a) this.log("Undefined object passed to assignOID.");
		else {
			if ("object" == typeof a) return a;
			if ("string" == typeof a) return document.getElementById(a)
		}
	} catch (e) {
		this.log("Error in assignOID", 1)
	}
	return null
};
imgmap.prototype.setup = function(a) {
	for (var e in a) a.hasOwnProperty(e) && (this.config[e] = a[e]);
	this.addEvent(document, "keydown", this.eventHandlers.doc_keydown = this.doc_keydown.bind(this));
	this.addEvent(document, "keyup", this.eventHandlers.doc_keyup = this.doc_keyup.bind(this));
	this.addEvent(document, "mousedown", this.eventHandlers.doc_mousedown = this.doc_mousedown.bind(this));
	a && a.pic_container && (this.pic_container = this.assignOID(a.pic_container), this.disableSelection(this.pic_container));
	this.config.lang ||
		(this.config.lang = this.detectLanguage());
	var b, d;
	for (e in this.config.custom_callbacks)
		if (this.config.custom_callbacks.hasOwnProperty(e)) {
			a = !1;
			b = 0;
			for (d = this.event_types.length; b < d; b++)
				if (e == this.event_types[b]) {
					a = !0;
					break
				}
			a || this.log("Unknown custom callback: " + e, 1)
		}
	this.addEvent(window, "load", this.onLoad.bind(this));
	return !0
};
imgmap.prototype.onLoad = function() {
	if (this.isLoaded) return !0;
	try {
		this.loadStrings(imgmapStrings)
	} catch (a) {
		this.log("Unable to load language strings", 1)
	}
	return this.isLoaded = !0
};
imgmap.prototype.addEvent = function(a, e, b) {
	if (a.attachEvent) return a.attachEvent("on" + e, b);
	if (a.addEventListener) return a.addEventListener(e, b, !1), !0
};
imgmap.prototype.removeEvent = function(a, e, b) {
	if (a.detachEvent) return a.detachEvent("on" + e, b);
	if (a.removeEventListener) return a.removeEventListener(e, b, !1), !0
};
imgmap.prototype.loadStrings = function(a) {
	for (var e in a) a.hasOwnProperty(e) && (this.strings[e] = a[e])
};
imgmap.prototype.loadImage = function(a, e, b) {
	if ("undefined" == typeof this.pic_container) return this.log("You must have pic_container defined to use loadImage!", 2), !1;
	this.removeAllAreas();
	this.globalscale = 1;
	if ("string" == typeof a) return "undefined" == typeof this.pic && (this.pic = document.createElement("IMG"), this.pic_container.appendChild(this.pic), this.addEvent(this.pic, "mousedown", this.eventHandlers.img_mousedown = this.img_mousedown.bind(this)), this.addEvent(this.pic, "mouseup", this.eventHandlers.img_mouseup =
		this.img_mouseup.bind(this)), this.addEvent(this.pic, "mousemove", this.eventHandlers.img_mousemove = this.img_mousemove.bind(this)), this.pic.style.cursor = this.config.cursor_default), this.pic.src = a, e && 0 < e && this.pic.setAttribute("width", e), b && 0 < b && this.pic.setAttribute("height", b), this.fireEvent("onLoadImage", this.pic), !0;
	if ("object" == typeof a) {
		var d = a.src;
		e || (e = a.clientWidth);
		b || (b = a.clientHeight);
		return this.loadImage(d, e, b)
	}
};
imgmap.prototype.statusMessage = function(a) {
	this.fireEvent("onStatusMessage", a)
};
imgmap.prototype.log = function() {};
imgmap.prototype.getMapName = function() {
	if ("" === this.mapname) {
		if ("" !== this.mapid) return this.mapid;
		var a = new Date;
		this.mapname = "imgmap" + a.getFullYear() + (a.getMonth() + 1) + a.getDate() + a.getHours() + a.getMinutes() + a.getSeconds()
	}
	return this.mapname
};
imgmap.prototype.getMapId = function() {
	"" === this.mapid && (this.mapid = this.getMapName());
	return this.mapid
};
imgmap.prototype._normShape = function(a) {
	if (!a) return "rect";
	a = this.trim(a).toLowerCase();
	return "rect" == a.substring(0, 4) ? "rect" : "circ" == a.substring(0, 4) ? "circle" : "poly" == a.substring(0, 4) ? "poly" : "rect"
};
imgmap.prototype._normCoords = function(a, e, b) {
	var d, f, c, h, a = this.trim(a);
	if ("" === a) return "";
	var j = a,
		a = a.replace(/(\d)([^\d\.])+(\d)/g, "$1,$3"),
		a = a.replace(/,\D+(\d)/g, ",$1"),
		a = a.replace(/,0+(\d)/g, ",$1"),
		a = a.replace(/(\d)(\D)+,/g, "$1,"),
		a = a.replace(/^\D+(\d)/g, "$1"),
		a = a.replace(/^0+(\d)/g, "$1"),
		a = a.replace(/(\d)(\D)+$/g, "$1"),
		g = a.split(",");
	if ("rect" == e) {
		if ("fromcircle" == b) a = g[2], g[0] -= a, g[1] -= a, g[2] = parseInt(g[0], 10) + 2 * a, g[3] = parseInt(g[1], 10) + 2 * a;
		else if ("frompoly" == b) {
			e = parseInt(g[0], 10);
			f = parseInt(g[0],
				10);
			d = parseInt(g[1], 10);
			c = parseInt(g[1], 10);
			a = 0;
			for (h = g.length; a < h; a++) 0 === a % 2 && parseInt(g[a], 10) < e && (e = parseInt(g[a], 10)), 1 === a % 2 && parseInt(g[a], 10) < d && (d = parseInt(g[a], 10)), 0 === a % 2 && parseInt(g[a], 10) > f && (f = parseInt(g[a], 10)), 1 === a % 2 && parseInt(g[a], 10) > c && (c = parseInt(g[a], 10));
			g[0] = e;
			g[1] = d;
			g[2] = f;
			g[3] = c
		}
		0 <= parseInt(g[1], 10) || (g[1] = g[0]);
		0 <= parseInt(g[2], 10) || (g[2] = parseInt(g[0], 10) + 10);
		0 <= parseInt(g[3], 10) || (g[3] = parseInt(g[1], 10) + 10);
		parseInt(g[0], 10) > parseInt(g[2], 10) && (a = g[0], g[0] = g[2], g[2] =
			a);
		parseInt(g[1], 10) > parseInt(g[3], 10) && (a = g[1], g[1] = g[3], g[3] = a);
		a = g[0] + "," + g[1] + "," + g[2] + "," + g[3]
	} else if ("circle" == e) {
		if ("fromrect" == b) e = parseInt(g[0], 10), f = parseInt(g[2], 10), d = parseInt(g[1], 10), c = parseInt(g[3], 10), g[2] = f - e < c - d ? f - e : c - d, g[2] = Math.floor(g[2] / 2), g[0] = e + g[2], g[1] = d + g[2];
		else if ("frompoly" == b) {
			e = parseInt(g[0], 10);
			f = parseInt(g[0], 10);
			d = parseInt(g[1], 10);
			c = parseInt(g[1], 10);
			a = 0;
			for (h = g.length; a < h; a++) 0 === a % 2 && parseInt(g[a], 10) < e && (e = parseInt(g[a], 10)), 1 === a % 2 && parseInt(g[a], 10) < d && (d =
				parseInt(g[a], 10)), 0 === a % 2 && parseInt(g[a], 10) > f && (f = parseInt(g[a], 10)), 1 === a % 2 && parseInt(g[a], 10) > c && (c = parseInt(g[a], 10));
			g[2] = f - e < c - d ? f - e : c - d;
			g[2] = Math.floor(g[2] / 2);
			g[0] = e + g[2];
			g[1] = d + g[2]
		}
		0 < parseInt(g[1], 10) || (g[1] = g[0]);
		0 < parseInt(g[2], 10) || (g[2] = 10);
		a = g[0] + "," + g[1] + "," + g[2]
	} else if ("poly" == e) {
		if ("fromrect" == b) g[4] = g[2], g[5] = g[3], g[2] = g[0], g[6] = g[4], g[7] = g[1];
		else if ("fromcircle" == b) {
			e = parseInt(g[0], 10);
			d = parseInt(g[1], 10);
			f = parseInt(g[2], 10);
			c = 0;
			g[c++] = e + f;
			g[c++] = d;
			for (a = 0; 60 >= a; a++) {
				var i =
					a / 60;
				h = Math.cos(2 * i * Math.PI);
				i = Math.sin(2 * i * Math.PI);
				h = e + h * f;
				i = d + i * f;
				g[c++] = Math.round(h);
				g[c++] = Math.round(i)
			}
		}
		a = g.join(",")
	}
	return "preserve" == b && j != a ? j : a
};
imgmap.prototype.setMapHTML = function(a) {
	this.fireEvent("onSetMap", a);
	this.removeAllAreas();
	var e;
	"string" == typeof a ? (e = document.createElement("DIV"), e.innerHTML = a, e = e.firstChild) : "object" == typeof a && (e = a);
	if (!e || "map" !== e.nodeName.toLowerCase()) return !1;
	this.mapname = e.name;
	this.mapid = e.id;
	for (var a = e.getElementsByTagName("area"), b, d, f, c = 0, h = a.length; c < h; c++) {
		e = "";
		f = this.addNewArea();
		b = this._normShape(a[c].getAttribute("shape", 2));
		this.initArea(f, b);
		a[c].getAttribute("coords", 2) && (e = this._normCoords(a[c].getAttribute("coords",
			2), b), this.areas[f].lastInput = e);
		b = a[c].getAttribute("href", 2);
		(d = a[c].getAttribute("data-cke-saved-href")) && (b = d);
		b && (this.areas[f].ahref = b);
		if (b = a[c].getAttribute("alt")) this.areas[f].aalt = b;
		(d = a[c].getAttribute("title")) || (d = b);
		d && (this.areas[f].atitle = d);
		(b = a[c].getAttribute("target")) && (b = b.toLowerCase());
		this.areas[f].atarget = b;
		this._recalculate(f, e);
		this.relaxArea(f);
		this.fireEvent("onAreaChanged", this.areas[f])
	}
	return !0
};
imgmap.prototype.addNewArea = function() {
	var a = this._getLastArea(),
		a = a ? a.aid + 1 : 0,
		e = this.areas[a] = document.createElement("DIV");
	e.id = this.mapname + "area" + a;
	e.aid = a;
	e.shape = "undefined";
	this.blurArea(this.currentid);
	this.currentid = a;
	this.fireEvent("onAddArea", a);
	return a
};
imgmap.prototype.initArea = function(a, e) {
	var b = this.areas[a];
	b && (b.parentNode && b.parentNode.removeChild(b), b.label && b.label.parentNode.removeChild(b.label), b = this.areas[a] = document.createElement("CANVAS"), this.pic_container.appendChild(b), this.pic_container.style.position = "relative", "undefined" != typeof G_vmlCanvasManager && (b = this.areas[a] = G_vmlCanvasManager.initElement(b)), b.id = this.mapname + "area" + a, b.aid = a, b.shape = e, b.ahref = "", b.atitle = "", b.aalt = "", b.atarget = "", b.style.position = "absolute", b.style.top =
		this.pic.offsetTop + "px", b.style.left = this.pic.offsetLeft + "px", this._setopacity(b, this.config.CL_DRAW_BG, this.config.draw_opacity), b.ondblclick = this.area_dblclick.bind(this), b.onmousedown = this.area_mousedown.bind(this), b.onmouseup = this.area_mouseup.bind(this), b.onmousemove = this.area_mousemove.bind(this), b.onmouseover = this.area_mouseover.bind(this), b.onmouseout = this.area_mouseout.bind(this), this.memory[a] = {}, this.memory[a].downx = 0, this.memory[a].downy = 0, this.memory[a].left = 0, this.memory[a].top = 0, this.memory[a].width =
		0, this.memory[a].height = 0, this.memory[a].xpoints = [], this.memory[a].ypoints = [], b.label = document.createElement("DIV"), this.pic_container.appendChild(b.label), b.label.className = this.config.label_class, this.assignCSS(b.label, this.config.label_style), b.label.style.position = "absolute")
};
imgmap.prototype.relaxArea = function(a) {
	var e = this.areas[a];
	e && (this.fireEvent("onRelaxArea", a), a != this.currentid ? (this._setBorder(e, "NORM"), this._setopacity(e, this.config.CL_NORM_BG, this.config.norm_opacity)) : this.highlightArea(a))
};
imgmap.prototype.relaxAllAreas = function() {
	for (var a = 0, e = this.areas.length; a < e; a++) this.areas[a] && this.relaxArea(a)
};
imgmap.prototype._setBorder = function(a, e) {
	"rect" == a.shape || this.config.bounding_box ? (a.style.borderWidth = "1px", a.style.borderStyle = "DRAW" == e ? "dotted" : "solid", a.style.borderColor = this.config["CL_" + e + "_" + ("rect" == a.shape ? "SHAPE" : "BOX")]) : a.style.border = ""
};
imgmap.prototype._setopacity = function(a, e, b) {
	e && (a.style.backgroundColor = e);
	if (b && "string" == typeof b && b.match(/^\d*\-\d+$/)) {
		var d = b.split("-");
		"undefined" != typeof d[0] && (d[0] = parseInt(d[0], 10), this._setopacity(a, e, d[0]));
		if ("undefined" != typeof d[1]) {
			d[1] = parseInt(d[1], 10);
			var e = this._getopacity(a),
				f = this,
				b = Math.round(d[1] - e);
			5 < b ? (window.setTimeout(function() {
				f._setopacity(a, null, "-" + d[1])
			}, 20), b = 1 * e + 5) : -3 > b ? (window.setTimeout(function() {
				f._setopacity(a, null, "-" + d[1])
			}, 20), b = 1 * e - 3) : b = d[1]
		}
	}
	isNaN(b) ||
		(b = Math.round(parseInt(b, 10)), a.style.opacity = b / 100, a.style.filter = "alpha(opacity=" + b + ")")
};
imgmap.prototype._getopacity = function(a) {
	return 1 >= a.style.opacity ? 100 * a.style.opacity : a.style.filter ? parseInt(a.style.filter.replace(/alpha\(opacity\=([^\)]*)\)/ig, "$1"), 10) : 100
};
imgmap.prototype.removeArea = function(a) {
	if (!(null === a || "undefined" == typeof a)) {
		try {
			this.areas[a].label.parentNode.removeChild(this.areas[a].label), this.areas[a].parentNode.removeChild(this.areas[a]), this.areas[a].label.className = null, this.areas[a].label = null, this.areas[a].onmouseover = null, this.areas[a].onmouseout = null, this.areas[a].onmouseup = null, this.areas[a].onmousedown = null, this.areas[a].onmousemove = null
		} catch (e) {}
		this.areas[a] = null;
		this.fireEvent("onRemoveArea", a)
	}
};
imgmap.prototype.removeAllAreas = function() {
	for (var a = 0, e = this.areas.length; a < e; a++) this.areas[a] && this.removeArea(a)
};
imgmap.prototype.scaleAllAreas = function(a) {
	var e = 1;
	try {
		e = a / this.globalscale
	} catch (b) {
		this.log("Invalid (global)scale", 1)
	}
	this.globalscale = a;
	for (var a = 0, d = this.areas.length; a < d; a++) this.areas[a] && "undefined" != this.areas[a].shape && this.scaleArea(a, e)
};
imgmap.prototype.scaleArea = function(a, e) {
	var b = this.areas[a];
	b.style.top = parseInt(b.style.top, 10) * e + "px";
	b.style.left = parseInt(b.style.left, 10) * e + "px";
	this.setAreaSize(a, b.width * e, b.height * e);
	if ("poly" == b.shape)
		for (var d = 0, f = b.xpoints.length; d < f; d++) b.xpoints[d] *= e, b.ypoints[d] *= e;
	this._repaint(b, this.config.CL_NORM_SHAPE);
	this._updatecoords(a)
};
imgmap.prototype._putlabel = function(a) {
	var e = this.areas[a];
	if (e.label) try {
		if (this.config.label) {
			e.label.style.display = "";
			var b = this.config.label,
				b = b.replace(/%n/g, "" + a),
				b = b.replace(/%c/g, "" + e.lastInput),
				b = b.replace(/%h/g, "" + e.ahref),
				b = b.replace(/%a/g, "" + e.aalt),
				b = b.replace(/%t/g, "" + e.atitle);
			e.label.innerHTML = b
		} else e.label.innerHTML = "", e.label.style.display = "none";
		e.label.style.top = e.style.top;
		e.label.style.left = e.style.left
	} catch (d) {
		this.log("Error putting label", 1)
	}
};
imgmap.prototype._puthint = function(a) {
	try {
		if (this.config.hint) {
			var e = this.config.hint,
				e = e.replace(/%n/g, "" + a),
				e = e.replace(/%c/g, "" + this.areas[a].lastInput),
				e = e.replace(/%h/g, "" + this.areas[a].ahref),
				e = e.replace(/%a/g, "" + this.areas[a].aalt),
				e = e.replace(/%t/g, "" + this.areas[a].atitle);
			this.areas[a].title = e;
			this.areas[a].alt = e
		} else this.areas[a].title = "", this.areas[a].alt = ""
	} catch (b) {
		this.log("Error putting hint", 1)
	}
};
imgmap.prototype._repaintAll = function() {
	for (var a = 0, e = this.areas.length; a < e; a++) this.areas[a] && this._repaint(this.areas[a], this.config.CL_NORM_SHAPE)
};
imgmap.prototype._repaint = function(a, e, b, d) {
	var f, c, h, j, g;
	if ("circle" == a.shape) c = parseInt(a.style.width, 10), b = Math.floor(c / 2) - 1, 0 > b && (b = 0), f = a.getContext("2d"), f.clearRect(0, 0, c, c), f.beginPath(), f.strokeStyle = e, f.arc(b, b, b, 0, 2 * Math.PI, 0), f.stroke(), f.closePath(), f.strokeStyle = this.config.CL_KNOB, f.strokeRect(b, b, 1, 1), this._putlabel(a.aid), this._puthint(a.aid);
	else if ("rect" == a.shape) this._putlabel(a.aid), this._puthint(a.aid);
	else if ("poly" == a.shape) {
		c = parseInt(a.style.width, 10);
		h = parseInt(a.style.height,
			10);
		j = parseInt(a.style.left, 10);
		g = parseInt(a.style.top, 10);
		if (a.xpoints) {
			f = a.getContext("2d");
			f.clearRect(0, 0, c, h);
			f.beginPath();
			f.strokeStyle = e;
			f.moveTo(a.xpoints[0] - j, a.ypoints[0] - g);
			e = 1;
			for (c = a.xpoints.length; e < c; e++) f.lineTo(a.xpoints[e] - j, a.ypoints[e] - g);
			(this.is_drawing == this.DM_POLYGON_DRAW || this.is_drawing == this.DM_POLYGON_LASTDRAW) && f.lineTo(b - j - 5, d - g - 5);
			f.lineTo(a.xpoints[0] - j, a.ypoints[0] - g);
			f.stroke();
			f.closePath()
		}
		this._putlabel(a.aid);
		this._puthint(a.aid)
	}
};
imgmap.prototype._updatecoords = function(a) {
	var a = this.areas[a],
		e = Math.round(parseInt(a.style.left, 10) / this.globalscale),
		b = Math.round(parseInt(a.style.top, 10) / this.globalscale),
		d = Math.round(parseInt(a.style.height, 10) / this.globalscale),
		f = Math.round(parseInt(a.style.width, 10) / this.globalscale),
		c = "";
	if ("rect" == a.shape) a.lastInput = e + "," + b + "," + (e + f) + "," + (b + d);
	else if ("circle" == a.shape) c = Math.floor(f / 2) - 1, a.lastInput = e + c + "," + (b + c) + "," + c;
	else if ("poly" == a.shape) {
		if (a.xpoints) {
			e = 0;
			for (b = a.xpoints.length; e <
				b; e++) c += Math.round(a.xpoints[e] / this.globalscale) + "," + Math.round(a.ypoints[e] / this.globalscale) + ",";
			c = c.substring(0, c.length - 1)
		}
		a.lastInput = c
	}
	this.fireEvent("onAreaChanged", a)
};
imgmap.prototype._recalculate = function(a, e) {
	var b = this.areas[a];
	try {
		var e = e ? this._normCoords(e, b.shape, "preserve") : b.lastInput || "",
			d = e.split(",");
		if ("rect" == b.shape) {
			if (4 != d.length || parseInt(d[0], 10) > parseInt(d[2], 10) || parseInt(d[1], 10) > parseInt(d[3], 10)) throw "invalid coords";
			b.style.left = this.globalscale * (this.pic.offsetLeft + parseInt(d[0], 10)) + "px";
			b.style.top = this.globalscale * (this.pic.offsetTop + parseInt(d[1], 10)) + "px";
			this.setAreaSize(a, this.globalscale * (d[2] - d[0]), this.globalscale * (d[3] - d[1]));
			this._repaint(b, this.config.CL_NORM_SHAPE)
		} else if ("circle" == b.shape) {
			if (3 != d.length || 0 > parseInt(d[2], 10)) throw "invalid coords";
			var f = 2 * d[2];
			this.setAreaSize(a, this.globalscale * f, this.globalscale * f);
			b.style.left = this.globalscale * (this.pic.offsetLeft + parseInt(d[0], 10) - f / 2) + "px";
			b.style.top = this.globalscale * (this.pic.offsetTop + parseInt(d[1], 10) - f / 2) + "px";
			this._repaint(b, this.config.CL_NORM_SHAPE)
		} else if ("poly" == b.shape) {
			if (2 > d.length) throw "invalid coords";
			b.xpoints = [];
			b.ypoints = [];
			for (var f = 0, c = d.length; f <
				c; f += 2) b.xpoints[b.xpoints.length] = this.globalscale * (this.pic.offsetLeft + parseInt(d[f], 10)), b.ypoints[b.ypoints.length] = this.globalscale * (this.pic.offsetTop + parseInt(d[f + 1], 10)), this._polygongrow(b, this.globalscale * d[f], this.globalscale * d[f + 1]);
			this._polygonshrink(b)
		}
	} catch (h) {
		this.log(h.message ? h.message : "error calculating coordinates", 1);
		this.statusMessage(this.strings.ERR_INVALID_COORDS);
		b.lastInput && this.fireEvent("onAreaChanged", b);
		this._repaint(b, this.config.CL_NORM_SHAPE);
		return
	}
	b.lastInput =
		e
};
imgmap.prototype._polygongrow = function(a, e, b) {
	var d = e - parseInt(a.style.left, 10),
		f = b - parseInt(a.style.top, 10);
	e < parseInt(a.style.left, 10) ? (a.style.left = e - 0 + "px", this.setAreaSize(a.aid, parseInt(a.style.width, 10) + Math.abs(d) + 0, null)) : e > parseInt(a.style.left, 10) + parseInt(a.style.width, 10) && this.setAreaSize(a.aid, e - parseInt(a.style.left, 10) + 0, null);
	b < parseInt(a.style.top, 10) ? (a.style.top = b - 0 + "px", this.setAreaSize(a.aid, null, parseInt(a.style.height, 10) + Math.abs(f) + 0)) : b > parseInt(a.style.top, 10) + parseInt(a.style.height, 10) &&
		this.setAreaSize(a.aid, null, b - parseInt(a.style.top, 10) + 0)
};
imgmap.prototype._polygonshrink = function(a) {
	a.style.left = a.xpoints[0] + "px";
	a.style.top = a.ypoints[0] + "px";
	this.setAreaSize(a.aid, 0, 0);
	for (var e = 0, b = a.xpoints.length; e < b; e++) this._polygongrow(a, a.xpoints[e], a.ypoints[e]);
	this._repaint(a, this.config.CL_NORM_SHAPE)
};
imgmap.prototype.img_mousemove = function(a) {
	var e, b, d, f;
	b = this._getPos(this.pic);
	e = this.isMSIE ? window.event.x + this.pic_container.scrollLeft - this.pic.offsetLeft : a.clientX - b.x;
	b = this.isMSIE ? window.event.y + this.pic_container.scrollTop - this.pic.offsetTop : a.clientY - b.y;
	if (!(0 > e || 0 > b || e > this.pic.width || b > this.pic.height)) {
		if (this.memory[this.currentid]) {
			f = this.memory[this.currentid].top;
			var c = this.memory[this.currentid].left;
			d = this.memory[this.currentid].height;
			var h = this.memory[this.currentid].width
		}
		var j =
			this.areas[this.currentid];
		this.isSafari && (a.shiftKey ? this.is_drawing == this.DM_RECTANGLE_DRAW && (this.is_drawing = this.DM_SQUARE_DRAW, this.statusMessage(this.strings.SQUARE2_DRAW)) : this.is_drawing == this.DM_SQUARE_DRAW && "rect" == j.shape && (this.is_drawing = this.DM_RECTANGLE_DRAW, this.statusMessage(this.strings.RECTANGLE_DRAW)));
		if (this.is_drawing == this.DM_RECTANGLE_DRAW) {
			if (this.fireEvent("onDrawArea", this.currentid), d = e - this.memory[this.currentid].downx, f = b - this.memory[this.currentid].downy, this.setAreaSize(this.currentid,
				Math.abs(d), Math.abs(f)), 0 > d && (j.style.left = e + 1 + "px"), 0 > f) j.style.top = b + 1 + "px"
		} else if (this.is_drawing == this.DM_SQUARE_DRAW) {
			if (this.fireEvent("onDrawArea", this.currentid), d = e - this.memory[this.currentid].downx, f = b - this.memory[this.currentid].downy, a = Math.abs(d) < Math.abs(f) ? Math.abs(parseInt(d, 10)) : Math.abs(parseInt(f, 10)), this.setAreaSize(this.currentid, a, a), 0 > d && (j.style.left = this.memory[this.currentid].downx + -1 * a + "px"), 0 > f) j.style.top = this.memory[this.currentid].downy + -1 * a + 1 + "px"
		} else if (this.is_drawing ==
			this.DM_POLYGON_DRAW) this.fireEvent("onDrawArea", this.currentid), this._polygongrow(j, e, b);
		else if (this.is_drawing == this.DM_RECTANGLE_MOVE || this.is_drawing == this.DM_SQUARE_MOVE) {
			this.fireEvent("onMoveArea", this.currentid);
			e -= this.memory[this.currentid].rdownx;
			b -= this.memory[this.currentid].rdowny;
			if (e + h > this.pic.width || b + d > this.pic.height || 0 > e || 0 > b) return;
			j.style.left = e + 1 + "px";
			j.style.top = b + 1 + "px"
		} else if (this.is_drawing == this.DM_POLYGON_MOVE) {
			this.fireEvent("onMoveArea", this.currentid);
			e -= this.memory[this.currentid].rdownx;
			b -= this.memory[this.currentid].rdowny;
			if (e + h > this.pic.width || b + d > this.pic.height || 0 > e || 0 > b) return;
			d = e - c;
			f = b - f;
			if (j.xpoints) {
				h = 0;
				for (a = j.xpoints.length; h < a; h++) j.xpoints[h] = this.memory[this.currentid].xpoints[h] + d, j.ypoints[h] = this.memory[this.currentid].ypoints[h] + f
			}
			j.style.left = e + "px";
			j.style.top = b + "px"
		} else this.is_drawing == this.DM_SQUARE_RESIZE_LEFT ? (this.fireEvent("onResizeArea", this.currentid), a = e - c, 0 < h + -1 * a ? (j.style.left = e + 1 + "px", j.style.top = f + a / 2 + "px", this.setAreaSize(this.currentid, parseInt(h +
				-1 * a, 10), parseInt(d + -1 * a, 10))) : (this.memory[this.currentid].width = 0, this.memory[this.currentid].height = 0, this.memory[this.currentid].left = e, this.memory[this.currentid].top = b, this.is_drawing = this.DM_SQUARE_RESIZE_RIGHT)) : this.is_drawing == this.DM_SQUARE_RESIZE_RIGHT ? (this.fireEvent("onResizeArea", this.currentid), a = e - c - h, 0 < h + a - 1 ? (j.style.top = f + -1 * a / 2 + "px", this.setAreaSize(this.currentid, h + a - 1, d + a)) : (this.memory[this.currentid].width = 0, this.memory[this.currentid].height = 0, this.memory[this.currentid].left =
				e, this.memory[this.currentid].top = b, this.is_drawing = this.DM_SQUARE_RESIZE_LEFT)) : this.is_drawing == this.DM_SQUARE_RESIZE_TOP ? (this.fireEvent("onResizeArea", this.currentid), a = b - f, 0 < h + -1 * a ? (j.style.top = b + 1 + "px", j.style.left = c + a / 2 + "px", this.setAreaSize(this.currentid, h + -1 * a, d + -1 * a)) : (this.memory[this.currentid].width = 0, this.memory[this.currentid].height = 0, this.memory[this.currentid].left = e, this.memory[this.currentid].top = b, this.is_drawing = this.DM_SQUARE_RESIZE_BOTTOM)) : this.is_drawing == this.DM_SQUARE_RESIZE_BOTTOM ?
			(this.fireEvent("onResizeArea", this.currentid), a = b - f - d, 0 < h + a - 1 ? (j.style.left = c + -1 * a / 2 + "px", this.setAreaSize(this.currentid, h + a - 1, d + a - 1)) : (this.memory[this.currentid].width = 0, this.memory[this.currentid].height = 0, this.memory[this.currentid].left = e, this.memory[this.currentid].top = b, this.is_drawing = this.DM_SQUARE_RESIZE_TOP)) : this.is_drawing == this.DM_RECTANGLE_RESIZE_LEFT ? (this.fireEvent("onResizeArea", this.currentid), d = e - c, 0 < h + -1 * d ? (j.style.left = e + 1 + "px", this.setAreaSize(this.currentid, h + -1 * d, null)) :
				(this.memory[this.currentid].width = 0, this.memory[this.currentid].left = e, this.is_drawing = this.DM_RECTANGLE_RESIZE_RIGHT)) : this.is_drawing == this.DM_RECTANGLE_RESIZE_RIGHT ? (this.fireEvent("onResizeArea", this.currentid), d = e - c - h, 0 < h + d - 1 ? this.setAreaSize(this.currentid, h + d - 1, null) : (this.memory[this.currentid].width = 0, this.memory[this.currentid].left = e, this.is_drawing = this.DM_RECTANGLE_RESIZE_LEFT)) : this.is_drawing == this.DM_RECTANGLE_RESIZE_TOP ? (this.fireEvent("onResizeArea", this.currentid), f = b - f, 0 < d + -1 *
				f ? (j.style.top = b + 1 + "px", this.setAreaSize(this.currentid, null, d + -1 * f)) : (this.memory[this.currentid].height = 0, this.memory[this.currentid].top = b, this.is_drawing = this.DM_RECTANGLE_RESIZE_BOTTOM)) : this.is_drawing == this.DM_RECTANGLE_RESIZE_BOTTOM && (this.fireEvent("onResizeArea", this.currentid), f = b - f - d, 0 < d + f - 1 ? this.setAreaSize(this.currentid, null, d + f - 1) : (this.memory[this.currentid].height = 0, this.memory[this.currentid].top = b, this.is_drawing = this.DM_RECTANGLE_RESIZE_TOP));
		this.is_drawing && (this._repaint(j,
			this.config.CL_DRAW_SHAPE, e, b), this._updatecoords(this.currentid))
	}
};
imgmap.prototype.img_mouseup = function(a) {
	var e = this._getPos(this.pic),
		b = this.isMSIE ? window.event.x + this.pic_container.scrollLeft - this.pic.offsetLeft : a.clientX - e.x,
		a = this.isMSIE ? window.event.y + this.pic_container.scrollTop - this.pic.offsetTop : a.clientY - e.y;
	this.is_drawing != this.DM_RECTANGLE_DRAW && (this.is_drawing != this.DM_SQUARE_DRAW && this.is_drawing != this.DM_POLYGON_DRAW && this.is_drawing != this.DM_POLYGON_LASTDRAW) && (this.draggedId = null, this.is_drawing = 0, this.statusMessage(this.strings.READY), this.relaxArea(this.currentid),
		this.areas[this.currentid] != this._getLastArea() && (this.memory[this.currentid].downx = b, this.memory[this.currentid].downy = a))
};
imgmap.prototype.img_mousedown = function(a) {
	var e = this._getPos(this.pic),
		b = this.isMSIE ? window.event.x + this.pic_container.scrollLeft - this.pic.offsetLeft : a.clientX - e.x,
		e = this.isMSIE ? window.event.y + this.pic_container.scrollTop - this.pic.offsetTop : a.clientY - e.y;
	a || (a = window.event);
	a.shiftKey && this.is_drawing == this.DM_POLYGON_DRAW && (this.is_drawing = this.DM_POLYGON_LASTDRAW);
	a = this.areas[this.currentid];
	this.is_drawing == this.DM_POLYGON_DRAW ? (a.xpoints[a.xpoints.length] = b - 5, a.ypoints[a.ypoints.length] = e - 5,
		this.memory[this.currentid].downx = b, this.memory[this.currentid].downy = e) : this.is_drawing && this.is_drawing != this.DM_POLYGON_DRAW ? (this.is_drawing == this.DM_POLYGON_LASTDRAW && (a.xpoints[a.xpoints.length] = b - 5, a.ypoints[a.ypoints.length] = e - 5, this._updatecoords(this.currentid), this.is_drawing = 0, this._polygonshrink(a)), this.is_drawing = 0, this.statusMessage(this.strings.READY), this.relaxArea(this.currentid), this._getLastArea()) : this.nextShape && (this.addNewArea(), this.initArea(this.currentid, this.nextShape),
		"poly" == this.areas[this.currentid].shape ? (this.is_drawing = this.DM_POLYGON_DRAW, this.statusMessage(this.strings.POLYGON_DRAW), this.areas[this.currentid].style.left = b + "px", this.areas[this.currentid].style.top = e + "px", this.areas[this.currentid].style.width = 0, this.areas[this.currentid].style.height = 0, this.areas[this.currentid].xpoints = [], this.areas[this.currentid].ypoints = [], this.areas[this.currentid].xpoints[0] = b, this.areas[this.currentid].ypoints[0] = e) : "rect" == this.areas[this.currentid].shape ? (this.is_drawing =
			this.DM_RECTANGLE_DRAW, this.statusMessage(this.strings.RECTANGLE_DRAW), this.areas[this.currentid].style.left = b + "px", this.areas[this.currentid].style.top = e + "px", this.areas[this.currentid].style.width = 0, this.areas[this.currentid].style.height = 0) : "circle" == this.areas[this.currentid].shape && (this.is_drawing = this.DM_SQUARE_DRAW, this.statusMessage(this.strings.SQUARE_DRAW), this.areas[this.currentid].style.left = b + "px", this.areas[this.currentid].style.top = e + "px", this.areas[this.currentid].style.width = 0, this.areas[this.currentid].style.height =
			0), this._setBorder(this.areas[this.currentid], "DRAW"), this.memory[this.currentid].downx = b, this.memory[this.currentid].downy = e)
};
imgmap.prototype.highlightArea = function(a, e) {
	if (!this.is_drawing) {
		var b = this.areas[a];
		b && "undefined" != b.shape && (e && this.fireEvent("onFocusArea", b), this._setBorder(b, "HIGHLIGHT"), this._setopacity(b, this.config.CL_HIGHLIGHT_BG, "-" + this.config.highlight_opacity), this._repaint(b, this.config.CL_HIGHLIGHT_SHAPE))
	}
};
imgmap.prototype.blurArea = function(a, e) {
	if (!this.is_drawing) {
		var b = this.areas[a];
		b && "undefined" != b.shape && (e && this.fireEvent("onBlurArea", b), this._setBorder(b, "NORM"), this._setopacity(b, this.config.CL_NORM_BG, "-" + this.config.norm_opacity), this._repaint(b, this.config.CL_NORM_SHAPE))
	}
};
imgmap.prototype.area_mousemove = function(a) {
	if (this.is_drawing) this.img_mousemove(a);
	else {
		var e = this.isMSIE ? window.event.srcElement : a.currentTarget;
		"DIV" == e.tagName && (e = e.parentNode);
		if ("image" == e.tagName || "group" == e.tagName || "shape" == e.tagName || "stroke" == e.tagName) e = e.parentNode.parentNode;
		this.isOpera && (a.layerX = a.offsetX, a.layerY = a.offsetY);
		var b = this.isMSIE ? window.event.offsetX : a.layerX,
			a = this.isMSIE ? window.event.offsetY : a.layerY;
		CKEDITOR.env.webkit && (b -= window.scrollX, a -= window.scrollY);
		var d =
			"rect" == e.shape || "circle" == e.shape;
		e.style.cursor = d && 6 > b && 6 < a ? "w-resize" : d && b > parseInt(e.style.width, 10) - 6 && 6 < a ? "e-resize" : d && 6 < b && 6 > a ? "n-resize" : d && a > parseInt(e.style.height, 10) - 6 && 6 < b ? "s-resize" : "move";
		if (e.aid != this.draggedId) "move" == e.style.cursor && (e.style.cursor = "default");
		else {
			e = this.areas[this.currentid];
			if (6 > b && 6 < a) "circle" == e.shape ? (this.is_drawing = this.DM_SQUARE_RESIZE_LEFT, this.statusMessage(this.strings.SQUARE_RESIZE_LEFT)) : "rect" == e.shape && (this.is_drawing = this.DM_RECTANGLE_RESIZE_LEFT,
				this.statusMessage(this.strings.RECTANGLE_RESIZE_LEFT));
			else if (b > parseInt(e.style.width, 10) - 6 && 6 < a) "circle" == e.shape ? (this.is_drawing = this.DM_SQUARE_RESIZE_RIGHT, this.statusMessage(this.strings.SQUARE_RESIZE_RIGHT)) : "rect" == e.shape && (this.is_drawing = this.DM_RECTANGLE_RESIZE_RIGHT, this.statusMessage(this.strings.RECTANGLE_RESIZE_RIGHT));
			else if (6 < b && 6 > a) "circle" == e.shape ? (this.is_drawing = this.DM_SQUARE_RESIZE_TOP, this.statusMessage(this.strings.SQUARE_RESIZE_TOP)) : "rect" == e.shape && (this.is_drawing =
				this.DM_RECTANGLE_RESIZE_TOP, this.statusMessage(this.strings.RECTANGLE_RESIZE_TOP));
			else if (a > parseInt(e.style.height, 10) - 6 && 6 < b) "circle" == e.shape ? (this.is_drawing = this.DM_SQUARE_RESIZE_BOTTOM, this.statusMessage(this.strings.SQUARE_RESIZE_BOTTOM)) : "rect" == e.shape && (this.is_drawing = this.DM_RECTANGLE_RESIZE_BOTTOM, this.statusMessage(this.strings.RECTANGLE_RESIZE_BOTTOM));
			else if ("circle" == e.shape) this.is_drawing = this.DM_SQUARE_MOVE, this.statusMessage(this.strings.SQUARE_MOVE), this.memory[this.currentid].rdownx =
				b, this.memory[this.currentid].rdowny = a;
			else if ("rect" == e.shape) this.is_drawing = this.DM_RECTANGLE_MOVE, this.statusMessage(this.strings.RECTANGLE_MOVE), this.memory[this.currentid].rdownx = b, this.memory[this.currentid].rdowny = a;
			else if ("poly" == e.shape) {
				if (e.xpoints)
					for (var d = 0, f = e.xpoints.length; d < f; d++) this.memory[this.currentid].xpoints[d] = e.xpoints[d], this.memory[this.currentid].ypoints[d] = e.ypoints[d];
				"poly" == e.shape && (this.is_drawing = this.DM_POLYGON_MOVE, this.statusMessage(this.strings.POLYGON_MOVE));
				this.memory[this.currentid].rdownx = b;
				this.memory[this.currentid].rdowny = a
			}
			this.memory[this.currentid].width = parseInt(e.style.width, 10);
			this.memory[this.currentid].height = parseInt(e.style.height, 10);
			this.memory[this.currentid].top = parseInt(e.style.top, 10);
			this.memory[this.currentid].left = parseInt(e.style.left, 10);
			this._setBorder(e, "DRAW");
			this._setopacity(e, this.config.CL_DRAW_BG, this.config.draw_opacity)
		}
	}
};
imgmap.prototype.area_mouseup = function(a) {
	if (this.is_drawing) this.img_mouseup(a);
	else {
		a = this.isMSIE ? window.event.srcElement : a.currentTarget;
		"DIV" == a.tagName && (a = a.parentNode);
		if ("image" == a.tagName || "group" == a.tagName || "shape" == a.tagName || "stroke" == a.tagName) a = a.parentNode.parentNode;
		this.areas[this.currentid] != a && "undefined" == typeof a.aid ? this.log("Cannot identify target area", 1) : this.draggedId = null
	}
};
imgmap.prototype.area_mouseover = function(a) {
	if (!this.is_drawing) {
		a = this.isMSIE ? window.event.srcElement : a.currentTarget;
		"DIV" == a.tagName && (a = a.parentNode);
		if ("image" == a.tagName || "group" == a.tagName || "shape" == a.tagName || "stroke" == a.tagName) a = a.parentNode.parentNode;
		this.highlightArea(a.aid, !0)
	}
};
imgmap.prototype.area_mouseout = function(a) {
	if (!this.is_drawing) {
		a = this.isMSIE ? window.event.srcElement : a.currentTarget;
		"DIV" == a.tagName && (a = a.parentNode);
		if ("image" == a.tagName || "group" == a.tagName || "shape" == a.tagName || "stroke" == a.tagName) a = a.parentNode.parentNode;
		this.currentid != a.aid && this.blurArea(a.aid, !0)
	}
};
imgmap.prototype.area_dblclick = function(a) {
	if (!this.is_drawing) {
		var e = this.isMSIE ? window.event.srcElement : a.currentTarget;
		"DIV" == e.tagName && (e = e.parentNode);
		if ("image" == e.tagName || "group" == e.tagName || "shape" == e.tagName || "stroke" == e.tagName) e = e.parentNode.parentNode;
		if (this.areas[this.currentid] != e) {
			if ("undefined" == typeof e.aid) {
				this.log("Cannot identify target area", 1);
				return
			}
			this.blurArea(this.currentid);
			this.currentid = e.aid
		}
		this.fireEvent("onDblClickArea", this.areas[this.currentid]);
		this.isMSIE ?
			window.event.cancelBubble = !0 : a.stopPropagation()
	}
};
imgmap.prototype.area_mousedown = function(a) {
	if (this.is_drawing) this.img_mousedown(a);
	else {
		var e = this.isMSIE ? window.event.srcElement : a.currentTarget;
		"DIV" == e.tagName && (e = e.parentNode);
		if ("image" == e.tagName || "group" == e.tagName || "shape" == e.tagName || "stroke" == e.tagName) e = e.parentNode.parentNode;
		if (this.areas[this.currentid] != e) {
			if ("undefined" == typeof e.aid) {
				this.log("Cannot identify target area", 1);
				return
			}
			this.blurArea(this.currentid);
			this.currentid = e.aid
		}
		this.selectedId = this.draggedId = this.currentid;
		this.fireEvent("onSelectArea", this.areas[this.currentid]);
		this.isMSIE ? window.event.cancelBubble = !0 : a.stopPropagation()
	}
};
imgmap.prototype.doc_keydown = function(a) {
	a = this.isMSIE ? event.keyCode : a.keyCode;
	46 == a ? null !== this.selectedId && !this.is_drawing && this.removeArea(this.selectedId) : 16 == a && this.is_drawing == this.DM_RECTANGLE_DRAW && (this.is_drawing = this.DM_SQUARE_DRAW, this.statusMessage(this.strings.SQUARE2_DRAW))
};
imgmap.prototype.doc_keyup = function(a) {
	if (16 == (this.isMSIE ? event.keyCode : a.keyCode) && this.is_drawing == this.DM_SQUARE_DRAW && "rect" == this.areas[this.currentid].shape) this.is_drawing = this.DM_RECTANGLE_DRAW, this.statusMessage(this.strings.RECTANGLE_DRAW)
};
imgmap.prototype.doc_mousedown = function() {
	this.is_drawing || (this.selectedId = null)
};
imgmap.prototype._getPos = function(a) {
	a = a.getBoundingClientRect();
	return {
		x: a.left,
		y: a.top
	}
};
imgmap.prototype._getLastArea = function() {
	for (var a = this.areas.length - 1; 0 <= a; a--)
		if (this.areas[a]) return this.areas[a];
	return null
};
imgmap.prototype.assignCSS = function(a, e) {
	for (var b = e.split(";"), d = 0; d < b.length; d++) {
		for (var f = b[d].split(":"), c = this.trim(f[0]).split("-"), h = c[0], j = 1; j < c.length; j++) h += c[j].replace(/^\w/, c[j].substring(0, 1).toUpperCase());
		a.style[this.trim(h)] = this.trim(f[1])
	}
};
imgmap.prototype.fireEvent = function(a, e) {
	if ("function" == typeof this.config.custom_callbacks[a]) return this.config.custom_callbacks[a](e)
};
imgmap.prototype.setAreaSize = function(a, e, b) {
	null === a && (a = this.currentid);
	a = this.areas[a];
	null !== e && (a.width = e, a.style.width = e + "px", a.setAttribute("width", e));
	null !== b && (a.height = b, a.style.height = b + "px", a.setAttribute("height", b))
};
imgmap.prototype.detectLanguage = function() {
	var a;
	if (navigator.userLanguage) a = navigator.userLanguage.toLowerCase();
	else if (navigator.language) a = navigator.language.toLowerCase();
	else return this.config.defaultLang;
	return 2 <= a.length ? a = a.substring(0, 2) : this.config.defaultLang
};
imgmap.prototype.disableSelection = function(a) {
	if ("undefined" == typeof a || !a) return !1;
	"undefined" != typeof a.onselectstart && (a.onselectstart = function() {
		return !1
	});
	"undefined" != typeof a.unselectable && (a.unselectable = "on");
	"undefined" != typeof a.style.MozUserSelect && (a.style.MozUserSelect = "none")
};
Function.prototype.bind = function(a) {
	var e = this;
	return function() {
		return e.apply(a, arguments)
	}
};
imgmap.prototype.trim = function(a) {
	return a.replace(/^\s+|\s+$/g, "")
};
document.createElement("canvas").getContext || function() {
	function a() {
		return this.context_ || (this.context_ = new i(this))
	}

	function e(a, b) {
		var c = B.call(arguments, 2);
		return function() {
			return a.apply(b, c.concat(B.call(arguments)))
		}
	}

	function b(a) {
		var b = a.srcElement;
		switch (a.propertyName) {
			case "width":
				b.style.width = b.attributes.width.nodeValue + "px";
				b.getContext().clearRect();
				break;
			case "height":
				b.style.height = b.attributes.height.nodeValue + "px", b.getContext().clearRect()
		}
	}

	function d(a) {
		a = a.srcElement;
		a.firstChild &&
			(a.firstChild.style.width = a.clientWidth + "px", a.firstChild.style.height = a.clientHeight + "px")
	}

	function f() {
		return [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		]
	}

	function c(a, b) {
		for (var c = f(), d, e, g, h = 0; 3 > h; h++)
			for (d = 0; 3 > d; d++) {
				for (g = e = 0; 3 > g; g++) e += a[h][g] * b[g][d];
				c[h][d] = e
			}
		return c
	}

	function h(a, b) {
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
		b.lineScale_ = a.lineScale_
	}

	function j(a) {
		var b, c = 1,
			d;
		if (a = "" + a, "rgb" == a.substring(0, 3)) {
			b = a.indexOf("(", 3);
			d = a.indexOf(")", b + 1);
			var e = a.substring(b + 1, d).split(",");
			b = "#";
			for (d = 0; 3 > d; d++) b += z[Number(e[d])];
			4 == e.length && "a" == a.substr(3, 1) && (c = e[3])
		} else b = a;
		return {
			color: b,
			alpha: c
		}
	}

	function g(a) {
		switch (a) {
			case "butt":
				return "flat";
			case "round":
				return "round";
			default:
				return "square"
		}
	}

	function i(a) {
		this.m_ =
			f();
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
		this.lineScale_ = this.arcScaleY_ = this.arcScaleX_ = 1
	}

	function k(a, b, c, d) {
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
		a.currentY_ = d.y
	}

	function n(a, b, c) {
		var d;
		a: {
			for (var e = 0; 3 > e; e++)
				for (d = 0; 2 > d; d++)
					if (!isFinite(b[e][d]) || isNaN(b[e][d])) {
						d = !1;
						break a
					}
			d = !0
		}
		if (d && (a.m_ = b, c)) a.lineScale_ = x(p(b[0][0] * b[1][1] - b[0][1] * b[1][0]))
	}

	function o(a) {
		this.type_ = a;
		this.r1_ = this.y1_ = this.x1_ = this.r0_ = this.y0_ = this.x0_ = 0;
		this.colors_ = []
	}

	function r() {}
	var l = Math,
		m = l.round,
		s = l.sin,
		t = l.cos,
		p = l.abs,
		x = l.sqrt,
		q = 10,
		u = q / 2,
		B = Array.prototype.slice,
		v = {
			init: function(a) {
				/MSIE/.test(navigator.userAgent) &&
					!window.opera && (a = a || document, a.createElement("canvas"), "complete" !== a.readyState ? a.attachEvent("onreadystatechange", e(this.init_, this, a)) : this.init_(a))
			},
			init_: function(a) {
				var b;
				a.namespaces.g_vml_ || a.namespaces.add("g_vml_", "urn:schemas-microsoft-com:vml", "#default#VML");
				a.namespaces.g_o_ || a.namespaces.add("g_o_", "urn:schemas-microsoft-com:office:office", "#default#VML");
				a.styleSheets.ex_canvas_ || (b = a.createStyleSheet(), b.owningElement.id = "ex_canvas_", b.cssText = "canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}g_vml_\\:*{behavior:url(#default#VML)}g_o_\\:*{behavior:url(#default#VML)}");
				a = a.getElementsByTagName("canvas");
				for (b = 0; b < a.length; b++) this.initElement(a[b])
			},
			initElement: function(c) {
				if (!c.getContext) {
					c.getContext = a;
					c.innerHTML = "";
					c.attachEvent("onpropertychange", b);
					c.attachEvent("onresize", d);
					var e = c.attributes;
					e.width && e.width.specified ? c.style.width = e.width.nodeValue + "px" : c.width = c.clientWidth;
					e.height && e.height.specified ? c.style.height = e.height.nodeValue + "px" : c.height = c.clientHeight
				}
				return c
			}
		},
		z, w, D;
	v.init();
	z = [];
	for (w = 0; 16 > w; w++)
		for (D = 0; 16 > D; D++) z[16 * w + D] = w.toString(16) +
			D.toString(16);
	w = i.prototype;
	w.clearRect = function() {
		this.element_.innerHTML = ""
	};
	w.beginPath = function() {
		this.currentPath_ = []
	};
	w.moveTo = function(a, b) {
		var c = this.getCoords_(a, b);
		this.currentPath_.push({
			type: "moveTo",
			x: c.x,
			y: c.y
		});
		this.currentX_ = c.x;
		this.currentY_ = c.y
	};
	w.lineTo = function(a, b) {
		var c = this.getCoords_(a, b);
		this.currentPath_.push({
			type: "lineTo",
			x: c.x,
			y: c.y
		});
		this.currentX_ = c.x;
		this.currentY_ = c.y
	};
	w.bezierCurveTo = function(a, b, c, d, e, f) {
		e = this.getCoords_(e, f);
		a = this.getCoords_(a, b);
		c = this.getCoords_(c,
			d);
		k(this, a, c, e)
	};
	w.quadraticCurveTo = function(a, b, c, d) {
		a = this.getCoords_(a, b);
		c = this.getCoords_(c, d);
		d = {
			x: this.currentX_ + 2 / 3 * (a.x - this.currentX_),
			y: this.currentY_ + 2 / 3 * (a.y - this.currentY_)
		};
		k(this, d, {
			x: d.x + (c.x - this.currentX_) / 3,
			y: d.y + (c.y - this.currentY_) / 3
		}, c)
	};
	w.arc = function(a, b, c, d, e, f) {
		var c = c * q,
			g = f ? "at" : "wa",
			h = a + t(d) * c - u,
			i = b + s(d) * c - u,
			d = a + t(e) * c - u,
			e = b + s(e) * c - u;
		h != d || f || (h += 0.125);
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
		})
	};
	w.rect = function(a, b, c, d) {
		this.moveTo(a, b);
		this.lineTo(a + c, b);
		this.lineTo(a + c, b + d);
		this.lineTo(a, b + d);
		this.closePath()
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
		this.currentPath_ = e
	};
	w.fillRect = function(a, b, c, d) {
		var e = this.currentPath_;
		this.beginPath();
		this.moveTo(a, b);
		this.lineTo(a + c, b);
		this.lineTo(a + c, b + d);
		this.lineTo(a,
			b + d);
		this.closePath();
		this.fill();
		this.currentPath_ = e
	};
	w.createLinearGradient = function(a, b, c, d) {
		var e = new o("gradient");
		return e.x0_ = a, e.y0_ = b, e.x1_ = c, e.y1_ = d, e
	};
	w.createRadialGradient = function(a, b, c, d, e, f) {
		var g = new o("gradientradial");
		return g.x0_ = a, g.y0_ = b, g.r0_ = c, g.x1_ = d, g.y1_ = e, g.r1_ = f, g
	};
	w.drawImage = function(a) {
		var b, c, d, e, f, g, h, i;
		d = a.runtimeStyle.width;
		e = a.runtimeStyle.height;
		var j, k, n;
		if (a.runtimeStyle.width = "auto", a.runtimeStyle.height = "auto", j = a.width, k = a.height, a.runtimeStyle.width = d, a.runtimeStyle.height =
			e, 3 == arguments.length) b = arguments[1], c = arguments[2], f = g = 0, h = d = j, i = e = k;
		else if (5 == arguments.length) b = arguments[1], c = arguments[2], d = arguments[3], e = arguments[4], f = g = 0, h = j, i = k;
		else if (9 == arguments.length) f = arguments[1], g = arguments[2], h = arguments[3], i = arguments[4], b = arguments[5], c = arguments[6], d = arguments[7], e = arguments[8];
		else throw Error("Invalid number of arguments");
		var o = this.getCoords_(b, c),
			p = [];
		if (p.push(" <g_vml_:group", ' coordsize="', 10 * q, ",", 10 * q, '"', ' coordorigin="0,0"', ' style="width:', 10,
			"px;height:", 10, "px;position:absolute;"), 1 != this.m_[0][0] || this.m_[0][1]) {
			n = [];
			n.push("M11=", this.m_[0][0], ",", "M12=", this.m_[1][0], ",", "M21=", this.m_[0][1], ",", "M22=", this.m_[1][1], ",", "Dx=", m(o.x / q), ",", "Dy=", m(o.y / q), "");
			var r = this.getCoords_(b + d, c),
				s = this.getCoords_(b, c + e);
			b = this.getCoords_(b + d, c + e);
			o.x = l.max(o.x, r.x, s.x, b.x);
			o.y = l.max(o.y, r.y, s.y, b.y);
			p.push("padding:0 ", m(o.x / q), "px ", m(o.y / q), "px 0;filter:progid:DXImageTransform.Microsoft.Matrix(", n.join(""), ", sizingmethod='clip');")
		} else p.push("top:",
			m(o.y / q), "px;left:", m(o.x / q), "px;");
		p.push(' ">', '<g_vml_:image src="', a.src, '"', ' style="width:', q * d, "px;", " height:", q * e, 'px;"', ' cropleft="', f / j, '"', ' croptop="', g / k, '"', ' cropright="', (j - f - h) / j, '"', ' cropbottom="', (k - g - i) / k, '"', " />", "</g_vml_:group>");
		this.element_.insertAdjacentHTML("BeforeEnd", p.join(""))
	};
	w.stroke = function(a) {
		var b = [],
			c = j(a ? this.fillStyle : this.strokeStyle),
			d = c.color,
			c = c.alpha * this.globalAlpha,
			e, f, h, i;
		b.push("<g_vml_:shape", ' filled="', !!a, '"', ' style="position:absolute;width:',
			10, "px;height:", 10, 'px;"', ' coordorigin="0 0" coordsize="', 10 * q, " ", 10 * q, '"', ' stroked="', !a, '"', ' path="');
		var k = i = h = null,
			n = null;
		for (f = 0; f < this.currentPath_.length; f++) {
			e = this.currentPath_[f];
			switch (e.type) {
				case "moveTo":
					b.push(" m ", m(e.x), ",", m(e.y));
					break;
				case "lineTo":
					b.push(" l ", m(e.x), ",", m(e.y));
					break;
				case "close":
					b.push(" x ");
					e = null;
					break;
				case "bezierCurveTo":
					b.push(" c ", m(e.cp1x), ",", m(e.cp1y), ",", m(e.cp2x), ",", m(e.cp2y), ",", m(e.x), ",", m(e.y));
					break;
				case "at":
				case "wa":
					b.push(" ", e.type,
						" ", m(e.x - this.arcScaleX_ * e.radius), ",", m(e.y - this.arcScaleY_ * e.radius), " ", m(e.x + this.arcScaleX_ * e.radius), ",", m(e.y + this.arcScaleY_ * e.radius), " ", m(e.xStart), ",", m(e.yStart), " ", m(e.xEnd), ",", m(e.yEnd))
			}
			e && ((null == h || e.x < h) && (h = e.x), (null == k || e.x > k) && (k = e.x), (null == i || e.y < i) && (i = e.y), (null == n || e.y > n) && (n = e.y))
		}
		if (b.push(' ">'), a)
			if ("object" == typeof this.fillStyle) {
				var d = this.fillStyle,
					o = 0;
				e = c = a = 0;
				var p = 1;
				"gradient" == d.type_ ? (o = d.x1_ / this.arcScaleX_, h = d.y1_ / this.arcScaleY_, f = this.getCoords_(d.x0_ /
					this.arcScaleX_, d.y0_ / this.arcScaleY_), o = this.getCoords_(o, h), o = 180 * Math.atan2(o.x - f.x, o.y - f.y) / Math.PI, 0 > o && (o += 360), 1.0E-6 > o && (o = 0)) : (f = this.getCoords_(d.x0_, d.y0_), e = k - h, p = n - i, a = (f.x - h) / e, c = (f.y - i) / p, e /= this.arcScaleX_ * q, p /= this.arcScaleY_ * q, f = l.max(e, p), e = 2 * d.r0_ / f, p = 2 * d.r1_ / f - e);
				h = d.colors_;
				h.sort(function(a, b) {
					return a.offset - b.offset
				});
				var n = h.length,
					k = h[0].color,
					r = h[n - 1].color,
					s = h[0].alpha * this.globalAlpha,
					t = h[n - 1].alpha * this.globalAlpha,
					u = [];
				for (f = 0; f < n; f++) i = h[f], u.push(i.offset * p + e + " " +
					i.color);
				b.push('<g_vml_:fill type="', d.type_, '"', ' method="none" focus="100%"', ' color="', k, '"', ' color2="', r, '"', ' colors="', u.join(","), '"', ' opacity="', t, '"', ' g_o_:opacity2="', s, '"', ' angle="', o, '"', ' focusposition="', a, ",", c, '" />')
			} else b.push('<g_vml_:fill color="', d, '" opacity="', c, '" />');
		else a = this.lineScale_ * this.lineWidth, 1 > a && (c *= a), b.push("<g_vml_:stroke", ' opacity="', c, '"', ' joinstyle="', this.lineJoin, '"', ' miterlimit="', this.miterLimit, '"', ' endcap="', g(this.lineCap), '"', ' weight="',
			a, 'px"', ' color="', d, '" />');
		b.push("</g_vml_:shape>");
		this.element_.insertAdjacentHTML("beforeEnd", b.join(""))
	};
	w.fill = function() {
		this.stroke(!0)
	};
	w.closePath = function() {
		this.currentPath_.push({
			type: "close"
		})
	};
	w.getCoords_ = function(a, b) {
		var c = this.m_;
		return {
			x: q * (a * c[0][0] + b * c[1][0] + c[2][0]) - u,
			y: q * (a * c[0][1] + b * c[1][1] + c[2][1]) - u
		}
	};
	w.save = function() {
		var a = {};
		h(this, a);
		this.aStack_.push(a);
		this.mStack_.push(this.m_);
		this.m_ = c(f(), this.m_)
	};
	w.restore = function() {
		h(this.aStack_.pop(), this);
		this.m_ = this.mStack_.pop()
	};
	w.translate = function(a, b) {
		n(this, c([
			[1, 0, 0],
			[0, 1, 0],
			[a, b, 1]
		], this.m_), !1)
	};
	w.rotate = function(a) {
		var b = t(a),
			a = s(a);
		n(this, c([
			[b, a, 0],
			[-a, b, 0],
			[0, 0, 1]
		], this.m_), !1)
	};
	w.scale = function(a, b) {
		this.arcScaleX_ *= a;
		this.arcScaleY_ *= b;
		n(this, c([
			[a, 0, 0],
			[0, b, 0],
			[0, 0, 1]
		], this.m_), !0)
	};
	w.transform = function(a, b, d, e, f, g) {
		n(this, c([
			[a, b, 0],
			[d, e, 0],
			[f, g, 1]
		], this.m_), !0)
	};
	w.setTransform = function(a, b, c, d, e, f) {
		n(this, [
			[a, b, 0],
			[c, d, 0],
			[e, f, 1]
		], !0)
	};
	w.clip = function() {};
	w.arcTo = function() {};
	w.createPattern = function() {
		return new r
	};
	o.prototype.addColorStop = function(a, b) {
		b = j(b);
		this.colors_.push({
			offset: a,
			color: b.color,
			alpha: b.alpha
		})
	};
	G_vmlCanvasManager = v;
	CanvasRenderingContext2D = i;
	CanvasGradient = o;
	CanvasPattern = r
}();
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
	}]
};