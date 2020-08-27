(function() {
	function b(a) {
		this.editor = a;
		a.on("destroy", function() {
			this.maps = {};
			this.editor = null;
		});
		this.maps = {};
		this.CreatedMapsNames = [];
		return this;
	}

	function f(a) {
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

	function c(a) {
		var b = a.dataProcessor;
		var c = b && b.htmlFilter;
		var f = b && b.dataFilter;
		var i = a.plugins.googleMapsHandler;
		a.on("toHtml", function(a) {
			a.data.dataValue.forEach(function(a) {
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
		f.addRules({
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
		c.addRules({
			elements: {
				img: function(b) {
					var d = b.attributes.mapnumber;
					if (d) {
						var c;
						c = a.plugins.googleMapsHandler;
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
		b.toDataFormat = CKEDITOR.tools.override(b.toDataFormat, function(b) {
			return function(d, c) {
				var e = a.plugins.googleMapsHandler;
				e.CreatedMapsNames = [];
				if (!e.validateDOM()) {
					var f = a.document;
					d = a.config.fullPage ? f.getDocumentElement().getOuterHtml() : f.getBody().getHtml();
				}
				f = b.call(this, d, c);
				if (e.CreatedMapsNames.length > 0) {
					f = f + e.BuildEndingScript();
				}
				return f;
			};
		});
	}
	b.prototype = {
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
			var a = new f(this.editor);
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
	f.prototype.createHtmlElement = function() {
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
	f.prototype.createDivs = function(a) {
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
	f.prototype.updateHTMLElement = function(a) {
		this.editor.plugins.googleMapsHandler.maps[this.number] = this;
		a.setAttribute("width", this.width);
		a.setAttribute("height", this.height);
		var b = this.generateStaticMap();
		a.setAttribute("src", b);
		a.setAttribute("data-cke-saved-src", b);
		a.setAttribute("alt", "");
	};
	f.prototype.getMapTypeIndex = function(a) {
		return CKEDITOR.tools.indexOf(["roadmap", "satellite", "hybrid", "terrain"], a);
	};
	f.prototype.parseStaticMap = function(a) {
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
	f.prototype.parseStaticMap2 = function(a) {
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
	f.prototype.generateStaticMap = function() {
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
	f.prototype.generateStaticMarkers = function(a) {
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
	f.prototype.generateStaticPaths = function() {
		function a(a) {
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
			b = b + ("&path=color:0x" + f.color.replace("#", "") + a(f.opacity) + "|weight:" + f.weight + "|enc:" + f.points);
		}
		c = 0;
		for (; c < this.areasData.length; c++) {
			i = this.areasData[c];
			f = i.polylines[0];
			b = b + ("&path=color:0x" + f.color.replace("#", "") + a(f.opacity) + "|weight:" + f.weight + "|fillcolor:0x" + i.color.replace("#", "") + a(i.opacity) + "|enc:" + f.points);
		}
		return b;
	};
	f.prototype.updateDimensions = function(a) {
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
	f.prototype.decodeText = function(a) {
		return a.replace(/<\\\//g, "</").replace(/\\n/g, "\n").replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
	};
	f.prototype.encodeText = function(a) {
		return a.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/<\//g, "<\\/");
	};
	f.prototype.parse = function(a) {
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
	f.prototype.cssWidth = function() {
		return /\d+\D+/.test(this.width) ? this.width : this.width + "px";
	};
	f.prototype.cssHeight = function() {
		return /\d+\D+/.test(this.height) ? this.height : this.height + "px";
	};
	f.prototype.BuildScript = function() {
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
	
	/* aaaaa */
	CKEDITOR.plugins.add("googlemaps", {
		requires: ["dialog"],
		lang: ["en", "ar", "cs", "de", "el", "es", "fi", "fr", "it", "nl", "pl", "ru", "sk", "tr"],
		beforeInit: function() {},
		init: function(a) {
			a.plugins.googleMapsHandler = new b(a);
			var c = "div[id];img[id,src,style];script";
			if (a.config.googleMaps_WrapperClass) {
				c = c + (";div(" + a.config.googleMaps_WrapperClass + ")");
			}
			a.addCommand("googlemaps", new CKEDITOR.dialogCommand("googlemaps", {
				allowedContent: c,
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
		afterInit: function(a) {
			c(a);
			a.openNestedDialog = function(b, c, f) {
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
					if (c) {
						c(a);
					}
				};
				if (a._.storedDialogs[b]) {
					k(a._.storedDialogs[b]);
				} else {
					CKEDITOR.on("dialogDefinition", function(a) {
						if (a.data.name == b) {
							var c = a.data.definition;
							a.removeListener();
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
				a.openDialog(b);
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



CKEDITOR.dialog.add("googlemaps", function(b) {
	function f(a) {
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

	function c() {
		f.prototype = new google.maps.OverlayView;
		f.prototype.onAdd = function() {
			this.getPanes().overlayLayer.appendChild(this.div_);
			var a = this;
			this.listeners_ = [google.maps.event.addListener(this, "position_changed", function() {
				a.draw();
			}), google.maps.event.addListener(this, "title_changed", function() {
				a.draw();
			})];
		};
		f.prototype.onRemove = function() {
			this.div_.parentNode.removeChild(this.div_);
			var a = 0;
			var b = this.listeners_.length;
			for (; a < b; ++a) {
				google.maps.event.removeListener(this.listeners_[a]);
			}
		};
		f.prototype.draw = function() {
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

	function a() {
		if (window.google) {
			if (window.google.maps && (google.maps.drawing && (google.maps.geometry && google.maps.weather))) {
				e();
				return;
			}
			if (window.google.load) {
				d();
				return;
			}
		}
		window.CKE_googleMaps_callback = function() {
			e();
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

	function d() {
		var a = "";
		if (y.key) {
			a = "&key=" + y.key;
		}
		window.google.load("maps", "3", {
			callback: e,
			other_params: "sensor=false&libraries=drawing,geometry,places,weather" + a
		});
	}

	function e() {
		window.CKE_googleMaps_callback = null;
		c();
		R = document.getElementById(N);
		h();
		na = [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.TERRAIN];
		aa = true;
		var a = new google.maps.LatLng(y.centerLat, y.centerLon);
		a = {
			zoom: parseInt(y.zoom, 10),
			center: a,
			mapTypeId: na[y.mapType],
			heading: y.heading,
			tilt: y.tilt
		};
		C = new google.maps.Map(R, a);
		if (y.panorama) {
			a = y.panorama;
			var d = C.getStreetView();
			d.setVisible(true);
			d.setPov({
				heading: a.heading,
				pitch: a.pitch,
				zoom: a.zoom
			});
			d.setPosition(new google.maps.LatLng(a.lat, a.lng));
		}
		a = {
			editable: true
		};
		$ = new google.maps.drawing.DrawingManager({
			drawingControl: false,
			polylineOptions: a,
			rectangleOptions: a,
			circleOptions: a,
			polygonOptions: a,
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
		a = 0;
		for (; a < e.length; a++) {
			f = e[a];
			d = new google.maps.LatLng(parseFloat(f.lat), parseFloat(f.lon));
			u(d, f.text, f.color, f.title, f.maxWidth, false, f.open);
		}
		e = y.textsData;
		a = 0;
		for (; a < e.length; a++) {
			d = new google.maps.LatLng(parseFloat(e[a].lat), parseFloat(e[a].lon));
			J(d, e[a].title, e[a].className, false);
		}
		e = y.linesData;
		a = 0;
		for (; a < e.length; a++) {
			d = e[a];
			if (d.points) {
				s = google.maps.geometry.encoding.decodePath(d.points);
			} else {
				f = d.PointsData.split("|");
				s = [];
				t = 1;
				for (; t < f.length; t++) {
					v = f[t].split(",");
					s.push(new google.maps.LatLng(parseFloat(v[0]), parseFloat(v[1])));
				}
			}
			d = new google.maps.Polyline({
				map: C,
				path: s,
				strokeColor: d.color,
				strokeOpacity: d.opacity,
				strokeWeight: d.weight,
				clickable: false
			});
			d.OverlayType = "polyline";
			W.push(d);
		}
		e = y.areasData;
		a = 0;
		for (; a < e.length; a++) {
			f = e[a];
			d = f.polylines[0];
			d = new google.maps.Polygon({
				map: C,
				paths: google.maps.geometry.encoding.decodePath(d.points),
				strokeColor: d.color,
				strokeOpacity: d.opacity,
				strokeWeight: d.weight,
				fillColor: f.color,
				fillOpacity: f.opacity,
				clickable: false
			});
			d.OverlayType = "polygon";
			T.push(d);
		}
		e = y.circlesData;
		a = 0;
		for (; a < e.length; a++) {
			f = e[a];
			d = new google.maps.LatLng(parseFloat(f.lat), parseFloat(f.lon));
			d = new google.maps.Circle({
				map: C,
				center: d,
				radius: parseInt(f.radius, 10),
				strokeColor: f.color,
				strokeOpacity: f.opacity,
				strokeWeight: f.weight,
				fillColor: f.fillColor,
				fillOpacity: f.fillOpacity,
				clickable: false
			});
			d.OverlayType = "circle";
			ba.push(d);
		}
		Q();
		google.maps.event.addListener(C, "click", function(a) {
			if ("EditLine" == P) {
				M();
			} else {
				if ("AddMarker" == P && u(a.latLng, b.config.googleMaps_MarkerText || E.defaultMarkerText, p(), E.defaultTitle, 200, true), "AddText" == P && J(a.latLng, E.defaultTitle, "MarkerTitle", true), "AddCircle" == P) {
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
		a = I.getContentElement("Info", "searchDirection").getInputElement().$;
		a = new google.maps.places.Autocomplete(a);
		a.bindTo("bounds", C);
		google.maps.event.addListener(a, "place_changed", function() {
			l();
		});
		aa = false;
		if (CKEDITOR.env.ie7Compat) {
			i();
		}
		if (CKEDITOR.env.ie6Compat) {
			g();
		}
	}

	function g() {
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

	function h() {
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
		if (b.config.googleMaps_newOverlayColor) {
			return "String" == typeof b.config.googleMaps_newOverlayColor ? b.config.googleMaps_newOverlayColor : b.config.googleMaps_newOverlayColor(a);
		}
		Y += 1;
		return ea[Y % ea.length];
	}

	function p() {
		if (b.config.googleMaps_newMarkerColor) {
			return "String" == typeof b.config.googleMaps_newMarkerColor ? b.config.googleMaps_newMarkerColor : b.config.googleMaps_newMarkerColor();
		}
		fa += 1;
		return ga[fa % ga.length];
	}

	function t(a) {
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

	function s(a) {
		a.setOptions({
			clickable: true
		});
		google.maps.event.addListener(a, "mouseover", function() {
			if ("" === P) {
				if (a != ja) {
					w("EditLine");
					ja = a;
					a.setEditable(true);
				}
			}
		});
		google.maps.event.addListener(a, "click", function(c) {
			if ("Add" == P.substr(0, 3)) {
				google.maps.event.trigger(C, "click", c);
			} else {
				D = a;
				b.openNestedDialog("googlemapsLine", function(a) {
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
		if ("polygon" == a.OverlayType || "polyline" == a.OverlayType) {
			google.maps.event.addListener(a, "rightclick", function(b) {
				if (null != b.vertex) {
					var c = "polyline" == a.OverlayType ? 2 : 3;
					if (a.getPath().getLength() == c) {
						D = a;
						O();
					} else {
						a.getPath().removeAt(b.vertex);
					}
				}
			});
		}
	}

	function v(a) {
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
			icon: t(c),
			draggable: true
		});
		a.text = b;
		a.color = c;
		a.maxWidth = e;
		if ("" !== d) {
			b = new f({
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
			b.openNestedDialog("googlemapsMarker", B, H);
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
		D.setIcon(t(a.color));
		if ("" !== b) {
			if (!c) {
				c = new f({
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
		v(D);
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
			icon: b.plugins.googlemaps.path + "images/TextIcon.png",
			draggable: true
		});
		a.className = d;
		if ("" !== c) {
			c = new f({
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
			b.openNestedDialog("googlemapsText", function(b) {
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
				b = new f({
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
						s(a);
					}
					P = "";
					break;
				case "AddArea":
					K("btnAddNewArea", false);
					if (a = T[T.length - 1]) {
						a.setEditable(false);
						s(a);
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
						s(a);
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
	var ea = b.config.googleMaps_overlayColors || "#880000 #008800 #000088 #888800 #880088 #008888 #000000 #888888".split(" ");
	var Y = -1;
	var ga = b.config.googleMaps_markerColors || "green purple yellow blue orange red".split(" ");
	var fa = -1;
	var Z = b.config.googleMaps_Icons;
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
	var E = b.lang.googlemaps;
	var aa = true;
	if ("undefined" == typeof Z) {
		b.config.googleMaps_Icons = {};
		Z = b.config.googleMaps_Icons;
	}
	var sa = CKEDITOR.document.getHead().append("style");
	sa.setAttribute("type", "text/css");
	var ia;
	ia = "" + ("#" + N + " * {white-space:normal; cursor:inherit; text-align:inherit;}") + ("#" + N + " .Input_Text {cursor:text; border-style:inset; border-width:2px; margin-left:1em;}") + ("#" + N + " .Input_Button {border-style:outset; border-width:2px; margin:0 1em;}") + ("#" + N + " .Gmaps_Buttons {clear:both; text-align:center; margin-top:4px;}") + ("#" + N + " .Gmaps_Options td {clear:both}") + ("#" + N + " a {cursor:pointer}") + ("#" + N + " img {max-width: none;}") + ('.GMapsButton {cursor:pointer; background:url("' +
		b.plugins.googlemaps.path + 'images/sprite.png") no-repeat top left; width: 24px; height: 24px;}');
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
						s(W[a]);
					}
					a = 0;
					for (; a < T.length; a++) {
						s(T[a]);
					}
					a = 0;
					for (; a < ba.length; a++) {
						s(ba[a]);
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
						v(W[a]);
					}
					a = 0;
					for (; a < T.length; a++) {
						v(T[a]);
					}
					a = 0;
					for (; a < ba.length; a++) {
						v(ba[a]);
					}
				}
			});
			I.on("resize", L);
			var a = this.parts.contents;
			var b = a.getChildren();
			var c = b.count() - 1;
			for (; c >= 0; c--) {
				b.getItem(c).$.style.height = "64px";
			}
			a.appendHtml('<div id="Wrapper' + N + '" style="width:500px; height:370px; overflow:auto;"><div id="' + N + '" style="outline:0;"></div></div>');
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
			var c = b.plugins.googleMapsHandler;
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
							if (b.config.googleMaps_WrapperClass && (U.parentNode.nodeName == "DIV" && U.parentNode.className == b.config.googleMaps_WrapperClass)) {
								U = U.parentNode;
							}
							b.getSelection().selectElement(new CKEDITOR.dom.element(U));
						}
					}
					U = null;
				}
			}
			if (!y) {
				y = c.createNew();
				if (navigator.geolocation && !b.config.googleMaps_CenterLat) {
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
			a();
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
					onBlur: h,
					required: true
				}, {
					id: "txtHeight",
					type: "text",
					widths: ["55px", "60px"],
					width: "40px",
					labelLayout: "horizontal",
					label: E.height,
					onBlur: h,
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
						url: b.config.filebrowserKmlBrowseUrl || b.config.filebrowserBrowseUrl,
						onSelect: Q
					},
					label: b.lang.common.browseServer
				}]
			}]
		}]
	};
});
CKEDITOR.dialog.add("googlemapsIcons", function(b) {
	function f(a) {
		var b = document.createElement("IMG");
		b.src = a;
		return a = b.src;
	}
	var c = b.config.googleMaps_markerColors || "green purple yellow blue orange red".split(" ");
	var a = c.length;
	var d = [];
	var e;
	var g = 0;
	for (; g < a; g++) {
		var i = c[g];
		d.push({
			name: i,
			src: "//maps.gstatic.com/mapfiles/ms/micons/" + i + "-dot.png"
		});
	}
	if (c = b.config.googleMaps_Icons) {
		for (i in c) {
			d.push({
				name: i,
				src: c[i].marker.image
			});
		}
		a = Math.min(10, d.length);
	}
	var h = function(a) {
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
		e.onSelect(b);
		e.hide();
		a.data.preventDefault();
	};
	var j = CKEDITOR.tools.addFunction(function(a, c) {
		a = new CKEDITOR.dom.event(a);
		c = new CKEDITOR.dom.element(c);
		var d;
		d = a.getKeystroke();
		var e = "rtl" == b.lang.dir;
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
				h({
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
		g = 0;
		for (; g < d.length; g++) {
			if (0 === g % a) {
				b.push("<tr>");
			}
			var c = d[g];
			b.push('<td class="cke_centered" style="vertical-align: middle;"><a href="javascript:void(0)"', ' class="cke_hand" tabindex="-1" onkeydown="CKEDITOR.tools.callFunction( ', j, ', event, this );">', '<img class="cke_hand"  src="', c.src, '"', ' data-name="', c.name, '"', CKEDITOR.env.ie ? " onload=\"this.setAttribute('width', 2); this.removeAttribute('width');\" " : "", "></a>", "</td>");
			if (g % a == a - 1) {
				b.push("</tr>");
			}
		}
		if (g < a - 1) {
			for (; g < a - 1; g++) {
				b.push("<td></td>");
			}
			b.push("</tr>");
		}
		b.push("</tbody></table>");
		return b.join("");
	};
	i = {
		type: "html",
		html: "<div>" + k() + "</div>",
		id: "imagesSelector",
		onLoad: function(a) {
			e = a.sender;
		},
		focus: function() {
			var a = d.length;
			var b;
			b = 0;
			for (; b < a && d[b].name != e.initialName; b++) {}
			this.getElement().getElementsByTag("a").getItem(b).focus();
		},
		onClick: h,
		style: "width: 100%; border-collapse: separate;"
	};
	return {
		title: b.lang.googlemaps.selectIcon,
		minWidth: 270,
		minHeight: 80,
		contents: [{
			id: "Info",
			label: "",
			title: "",
			padding: 0,
			elements: [i, {
				type: "hbox",
				children: [{
					type: "button",
					id: "browse",
					style: "margin-top:4px;margin-bottom:2px; display:inline-block;",
					label: b.lang.common.browseServer,
					filebrowser: {
						action: "Browse",
						target: "Info:txtUrl",
						url: b.config.filebrowserIconBrowseUrl || (b.config.filebrowserImageBrowseUrl || b.config.filebrowserBrowseUrl)
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
						if (!b.config.googleMaps_Icons) {
							b.config.googleMaps_Icons = {};
						}
						if (!b.config.googleMaps_Icons[c]) {
							var h = {
								marker: {
									image: a
								}
							};
							var i = b.config.googleMaps_shadowMarker;
							if (i) {
								if ("String" != typeof i) {
									i = i(a);
								}
								h.shadow = {
									image: i
								};
							}
							b.config.googleMaps_Icons[c] = h;
							d.push({
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
							}, "rtl" == b.lang.dir ? 1001 : 101);
						}
					}
				}]
			}]
		}],
		buttons: [CKEDITOR.dialog.cancelButton]
	};
});
CKEDITOR.dialog.add("googlemapsLine", function(b) {
	function f(a, c) {
		var f = a.getDialog();
		b.openNestedDialog("colordialog", function(a) {
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
	var c;
	var a;
	return {
		title: b.lang.googlemaps.properties,
		minWidth: 230,
		minHeight: 140,
		resizable: false,
		buttons: [{
				type: "button",
				id: "deleteOverlay",
				label: b.lang.googlemaps.deleteMarker,
				onClick: function(a) {
					a = a.sender.getDialog();
					a.onRemoveOverlay();
					a.hide();
				}
			},
			CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton
		],
		onLoad: function() {
			c = this.getContentElement("Info", "fldAreaProperties").getElement();
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
				a = "polygon";
				c.show();
				e = this.getContentElement("Info", "cmbFillOpacity");
				e.setValue(b.fillOpacity);
				e.setInitValue();
				e = this.getContentElement("Info", "txtFillColor");
				e.setValue(b.fillColor);
				e.setInitValue();
				this.resize(230, 240);
			} else {
				a = "polyline";
				c.hide();
				this.resize(230, 140);
			}
		},
		getValues: function() {
			var b = {
				strokeWeight: parseInt(this.getValueOf("Info", "cmbStrokeWeight"), 10),
				strokeOpacity: parseFloat(this.getValueOf("Info", "cmbStrokeOpacity")),
				strokeColor: this.getValueOf("Info", "txtStrokeColor")
			};
			if ("polygon" == a) {
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
				label: b.lang.googlemaps.lineProperties,
				children: [{
					id: "cmbStrokeWeight",
					label: b.lang.googlemaps.strokeWeight + " ",
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
					label: b.lang.googlemaps.strokeOpacity + " ",
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
						label: b.lang.googlemaps.strokeColor,
						labelLayout: "horizontal",
						widths: ["55px", "65px"],
						width: "65px"
					}, {
						id: "btnColor",
						type: "button",
						label: b.lang.googlemaps.chooseColor,
						onClick: function() {
							f(this, "txtStrokeColor");
						}
					}]
				}]
			}, {
				type: "fieldset",
				id: "fldAreaProperties",
				label: b.lang.googlemaps.areaProperties,
				children: [{
					id: "cmbFillOpacity",
					label: b.lang.googlemaps.fillOpacity + " ",
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
						label: b.lang.googlemaps.fillColor,
						labelLayout: "horizontal",
						widths: ["55px", "65px"],
						style: "width:130px; ",
						width: "65px"
					}, {
						id: "btnFillColor",
						type: "button",
						label: b.lang.googlemaps.chooseColor,
						onClick: function() {
							f(this, "txtFillColor");
						}
					}]
				}]
			}]
		}]
	};
});
CKEDITOR.dialog.add("googlemapsMarker", function(b) {
	function f(a) {
		var b = d && d[a];
		return !b ? "//maps.gstatic.com/mapfiles/ms/micons/" + a + "-dot.png" : b.marker.image;
	}
	var c = "markerIcon" + CKEDITOR.tools.getNextNumber();
	var a = "GMapTexts" + CKEDITOR.tools.getNextNumber();
	var d = b.config.googleMaps_Icons;
	var e;
	var g;
	var i;
	return {
		title: b.lang.googlemaps.markerProperties,
		minWidth: 310,
		minHeight: 240,
		buttons: [{
				type: "button",
				id: "deleteMarker",
				label: b.lang.googlemaps.deleteMarker,
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
					CKEDITOR.instances[a].destroy();
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
			if (d = CKEDITOR.instances[a]) {
				d.setData(b.text);
			} else {
				document.getElementById(a).value = b.text;
			}
			e = b.color;
			document.getElementById(c).src = f(e);
		},
		getValues: function() {
			return {
				title: this.getValueOf("Info", "txtTooltip"),
				maxWidth: this.getValueOf("Info", "txtWidth"),
				text: CKEDITOR.instances[a].getData(),
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
					label: b.lang.googlemaps.tooltip
				}, {
					id: "txtWidth",
					type: "text",
					widths: ["40px", "36px"],
					width: "36px",
					labelLayout: "horizontal",
					label: b.lang.googlemaps.width
				}, {
					type: "html",
					html: "<div>px</div>"
				}, {
					type: "html",
					onClick: function(a) {
						if ("img" == a.data.getTarget().getName()) {
							b.openNestedDialog("googlemapsIcons", function(a) {
								a.initialName = e;
								a.onSelect = function(a) {
									e = a;
									document.getElementById(c).src = f(e);
								};
							}, null);
						}
					},
					html: '<div style="width:60px"><label style="float:left">' + b.lang.googlemaps.markerIcon + '</label><img id="' + c + '" class="cke_hand"></div>'
				}]
			}, {
				type: "html",
				onLoad: function() {
					var c = "elementspath,resize,googlemaps";
					var d = b.config.removePlugins;
					if (d) {
						c += "," + d;
					}
					if (b.config.wsc_stack) {
						delete b.config.wsc_stack;
					}
					if (CKEDITOR.config.wsc_stack) {
						CKEDITOR.config.wsc_stack = [];
					}
					d = CKEDITOR.tools.clone(b.config);
					d.customConfig = "";
					d.width = "300px";
					d.height = 140;
					d.toolbar = b.config.googleMaps_toolbar || [
						["Bold", "Italic", "Link", "Image"],
						["Undo", "Redo"],
						["GMapsInsertDirections"]
					];
					d.removePlugins = c;
					d.toolbarCanCollapse = false;
					d.on = {
						pluginsLoaded: function(a) {
							a.editor.addCommand("gmapsinsertdirections", {
								exec: function(a) {
									var c = "http://maps.google.com/maps?daddr=" + encodeURIComponent(i.getValueOf("Info", "txtTooltip")) + " @" + g.getPosition().toUrlValue();
									a.insertHtml("<a href='" + c + "' target='_blank'>" + b.lang.googlemaps.directionsTitle + "</a>");
								}
							});
							a.editor.ui.addButton("GMapsInsertDirections", {
								label: b.lang.googlemaps.directions,
								icon: b.plugins.googlemaps.path + "/icons/gmapsinsertdirections.png",
								command: "gmapsinsertdirections"
							});
						}
					};
					CKEDITOR.replace(a, d);
				},
				html: '<textarea id="' + a + '"></textarea>'
			}]
		}]
	};
});
CKEDITOR.dialog.add("googlemapsText", function(b) {
	return {
		title: b.lang.googlemaps.textProperties,
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