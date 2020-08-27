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
			for (; j < subLn; j++) {
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
imgmap.prototype.log = function() {};
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
imgmap.prototype._normShape = function(line) {
	if (!line) {
		return "rect";
	}
	line = this.trim(line).toLowerCase();
	return "rect" == line.substring(0, 4) ? "rect" : "circ" == line.substring(0, 4) ? "circle" : "poly" == line.substring(0, 4) ? "poly" : "rect";
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
				for (; data < i; data++) {
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
					for (; data < i; data++) {
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
						for (; 60 >= data; data++) {
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
	for (; j < l2; j++) {
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
	for (; i < valuesLen; i++) {
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
		} catch (e) {}
		this.areas[k] = null;
		this.fireEvent("onRemoveArea", k);
	}
};
imgmap.prototype.removeAllAreas = function() {
	var i = 0;
	var valuesLen = this.areas.length;
	for (; i < valuesLen; i++) {
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
	for (; name < yCompLen; name++) {
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
		for (; i < valuesLen; i++) {
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
	for (; ti < nTokens; ti++) {
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
					for (; i < d; i++) {
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
					for (; s < e; s++) {
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
					for (; i < valuesLen; i += 2) {
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
	for (; i < valuesLen; i++) {
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
								for (; w < x; w++) {
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
											for (; i < valuesLen; i++) {
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
	return {
		x: r.left,
		y: r.top
	};
};
imgmap.prototype._getLastArea = function() {
	var unlock = this.areas.length - 1;
	for (; 0 <= unlock; unlock--) {
		if (this.areas[unlock]) {
			return this.areas[unlock];
		}
	}
	return null;
};
imgmap.prototype.assignCSS = function(node, pair) {
	var parameters = pair.split(";");
	var p = 0;
	for (; p < parameters.length; p++) {
		var trim = parameters[p].split(":");
		var nameParts = this.trim(trim[0]).split("-");
		var name = nameParts[0];
		var i = 1;
		for (; i < nameParts.length; i++) {
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
Function.prototype.bind = function(selfObj) {
	var matcherFunction = this;
	return function() {
		return matcherFunction.apply(selfObj, arguments);
	};
};
imgmap.prototype.trim = function(str) {
	return str.replace(/^\s+|\s+$/g, "");
};