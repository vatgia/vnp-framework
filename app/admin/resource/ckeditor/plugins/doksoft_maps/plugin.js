CKEDITOR.plugins.add("doksoft_maps", {
	icons: "doksoft_maps",
	init: function(b) {
		CKEDITOR.config.doksoft_maps_width = b.config.doksoft_maps_width || 400;
		CKEDITOR.config.doksoft_maps_height = b.config.doksoft_maps_height || 320;
		CKEDITOR.config.doksoft_maps_default_x = b.config.doksoft_maps_default_x || -25.363882;
		CKEDITOR.config.doksoft_maps_default_y = b.config.doksoft_maps_default_y || 131.044922;
		CKEDITOR.config.doksoft_maps_default_zoom = b.config.doksoft_maps_default_zoom || 4;
		CKEDITOR.config.doksoft_maps_auto_scaling_on_search = b.config.doksoft_maps_auto_scaling_on_search || true;
		b.path = this.path;
		CKEDITOR.dialog.add("doksoft_maps", this.path + "dialogs/doksoft_maps.js");
		cmd = b.addCommand("doksoft_maps", new CKEDITOR.dialogCommand("doksoft_maps"));
		b.ui.addButton("doksoft_maps", {
			title: "Add or edit Google Map",
			command: "doksoft_maps",
			icon: this.path + "icons/doksoft_maps.png"
		});
		if (b.contextMenu) {
			b.addMenuGroup("doksoft_maps_group");
			b.addMenuItem("doksoft_maps_item", {
				label: "Edit the map",
				command: "doksoft_maps",
				icon: this.path + "icons/doksoft_maps.png",
				group: "doksoft_maps_group"
			});
			b.contextMenu.addListener(function(e, f) {
				if (e && e.is("img") && e.$.className == "doksoft_maps_img") {
					return {
						doksoft_maps_item: CKEDITOR.TRISTATE_OFF
					};
				}
			});
		}
		generateStatMap = function(e) {
			return "http://maps.google.com/maps/api/staticmap?center=" + e.lat + "," + e.lng + "&zoom=" + e.zoom + "&size=" + e.width + "x" + e.height + "&maptype=" + e.type + "&markers=" + (function(h) {
				var g = [];
				for (var f in h) {
					g.push(h[f][0] + "," + h[f][1]);
				}
				return g.join("|");
			})(e.objects.Marker) + "&sensor=false";
		};
		b.on("doubleclick", function(e) {
			var f = e.data.element;
			if (f && f.is("img") && f.$.className == "doksoft_maps_img") {
				e.data.dialog = "doksoft_maps";
			}
		});
		var c = 1,
			a = "";
		this.softed = 0;
		this.unprotectSource = function(e) {
			if (!/<script[^>]*class[\s]*=[\s]*"doksoft_maps_google"[^>]*>/gi.test(e)) {
				a += '<script class="doksoft_maps_google" src="http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places,weather"><\/script>';
				a += '<script class="doksoft_maps_google" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerwithlabel/src/markerwithlabel_packed.js"><\/script>';
			}
			if (!/<script[^>]*class[\s]*=[\s]*"doksoft_maps_loadmap"[^>]*>/gi.test(e)) {
				a += '<script class="doksoft_maps_loadmap">' + "_loadmap = function(id,json){" + "var canva = document.getElementById(id);" + 'canva.style.width=json.width+"px";' + 'canva.style.height=json.height+"px";' + "var map = new google.maps.Map(canva,{" + "zoom: parseInt(json.zoom)," + "center: new google.maps.LatLng(parseFloat(json.lat),parseFloat(json.lng))," + "mapTypeId:json.type" + "});" + "if( json.settings ){" + " for( var id in json.settings )" + "map.set(id,json.settings[id]?true:false);" + "};" + "if( json.objects )" + " for( var type in json.objects ){" + "  for( var i in json.objects[type] ){" + "var object = 0;" + "switch( type ){" + "case 'Marker':" + "object = new google.maps.Marker({" + "position: new google.maps.LatLng( json.objects[type][i][0], json.objects[type][i][1])," + "map: map," + "title: json.objects[type][i][2]" + "});" + "(function(txt){" + "google.maps.event.addListener(object, 'click', function() {" + "(new google.maps.InfoWindow({content: txt})).open( map,object );" + "});" + "})(json.objects[type][i][2]);" + "break;" + "case 'Rectangle':" + "object = new google.maps.Rectangle({" + "bounds: new google.maps.LatLngBounds(" + "new google.maps.LatLng( json.objects[type][i][0][0], json.objects[type][i][0][1])," + "new google.maps.LatLng( json.objects[type][i][1][0], json.objects[type][i][1][1])" + ")," + "map: map," + "});" + "break;" + "case 'Polygon':case 'Polyline':" + "var path = json.objects[type][i],array_path = [];" + "for( var j in path )" + "array_path.push(" + "new google.maps.LatLng( path[j][0], path[j][1])" + ");" + "object = new google.maps[type]({" + "path: array_path," + "map: map," + "});" + "break;" + "case 'Text':" + "object = new MarkerWithLabel({" + "position: new google.maps.LatLng( json.objects[type][i][0], json.objects[type][i][1])," + "map: map," + "labelContent: json.objects[type][i][2]," + "labelAnchor: new google.maps.Point(22, 0)," + 'labelClass: "labels",' + "labelStyle: {opacity: 1.0, minWidth:'200px',textAlign:'left'}," + "icon: {}" + "});" + "break;" + "case 'Circle':" + "object = new google.maps.Circle({" + "radius: json.objects[type][i][2]," + "center:new google.maps.LatLng( json.objects[type][i][0], json.objects[type][i][1])," + "map: map," + "});" + "break;" + "case 'WeatherLayer':" + "object = new google.maps.weather.WeatherLayer({" + "temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT" + "});" + "object.setMap(map);" + "break;" + "case 'TrafficLayer':" + "object = new google.maps.TrafficLayer();" + "object.setMap(map);" + "break;" + "}" + "  }" + " }" + "};" + "loadmap = function( id,json ){" + "google.maps.event.addDomListener(window, 'load', function(){_loadmap(id,json)});" + "};" + "<\/script>";
			}
			return e.replace(/<img[^>]+?class[\s]*=[\s]*"doksoft_maps_img"[\s]*contenteditable="false"[\s]*data_script="([^"]*)"([^>]*)\/>/g, function(f, g) {
				b.plugins.doksoft_maps.softed = 1;
				c++;
				return '<div id="doksoft_maps' + c + '"></div><script class="doksoft_maps">loadmap("doksoft_maps' + c + '",' + decodeURIComponent(g) + ");<\/script>";
			});
		};
		var d = function(e) {
			return e.replace(/^loadmap\("doksoft_maps[0-9]+",/, "").replace(/\);$/, "");
		};
		this.protectSource = function(f, e) {
			return f.replace(/<script[^>]*class[\s]*=[\s]*"doksoft_maps"[^>]*>([^<]+)<\/script>/gi, function(i, h) {
				var g = "",
					j = d(h);
				try {
					g = '<img class="doksoft_maps_img" contenteditable="false" data_script="' + encodeURIComponent(j) + '" src="' + generateStatMap(JSON.parse(j)) + '"/>';
				} catch (k) {
					g = i;
				}
				return g;
			}).replace(/<div[^>]*id[\s]*=[\s]*"doksoft_maps[0-9]+"><\/div>/gi, "");
		};
		b.on("toHtml", function(e) {
			e.data.dataValue = CKEDITOR.plugins.registered.doksoft_maps.protectSource(e.data.dataValue);
		}, null, null, 1);
	},
	afterInit: function(a) {
		(function(f) {
			var e = f.dataProcessor,
				d = e && e.htmlFilter,
				c = e && e.dataFilter,
				b = f.plugins.doksoft_maps;
			c.addRules({
				comment: function(g) {
					return g;
				},
				elements: {
					img: function(g) {},
					div: function(g) {}
				}
			});
			d.addRules({
				elements: {
					img: function(g) {
						return g;
					}
				}
			});
			e.toDataFormat = CKEDITOR.tools.override(e.toDataFormat, function(g) {
				return function(i, h) {
					var k = g.call(this, i, h);
					soft = "";
					var j = b.unprotectSource(k);
					k = (b.softed ? soft : "") + j;
					return k;
				};
			});
			e.toHtml = CKEDITOR.tools.override(e.toHtml, function(g) {
				return function(i, h) {
					var j = b.protectSource(i);
					var k = g.call(this, j, h);
					return k;
				};
			});
		})(a);
	},
});
CKEDITOR.config.doksoft_maps_width = CKEDITOR.config.doksoft_maps_width || 400;
CKEDITOR.config.doksoft_maps_height = CKEDITOR.config.doksoft_maps_height || 320;