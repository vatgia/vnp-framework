function formatNumber(nStr) {
    nStr += '';
    var x = nStr.split(',');
    var x1 = x[0];
    var x2 = '';
    var x2 = x.length > 1 ? ',' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
}

function onlyNumber(e)
{
    var keyword=null;
    if(window.event)
    {
        keyword=window.event.keyCode;
    }
    else
    {
        keyword=e.which;
    }
    
    if(keyword<48 || keyword>57)
    {
        if(keyword==48 || keyword==127)
        {
            return ;
        }
        return false;
    }
} 
function dropdown_menu_city(){
	$('#city-test').toggleClass('show');
}

function submit_form(element){
	$(element).submit();
}

function search(e){
	var form = $(e),
		catId = $('.selectpicker').attr('data-id'),
		strCat = catId > 0 ? 'value="'+catId + '"' : '',
		search = $('#search_all');

	if(search.val().trim() == ''){
		alert('Bạn chưa nhập từ khóa tìm kiếm');
		return false;
	}

	form.append('<input type="hidden" name="cat" '+strCat+' />');
}

function searchProductPublisher(e){
	var form = $(e),
		catId = $('.selectpicker').attr('data-id'),
		strCat = catId > 0 ? 'value="'+catId + '"' : '',
		search = $('#search_all');

	if(search.val().trim() == ''){
		alert('Bạn chưa nhập từ khóa tìm kiếm');
		return false;
	}
}

function addToCart(iPro, iSc, estore_id, estore_name, quantity, count_click, _return, vgs){
	var time = Date.now();
	$.get('/ajax/add_to_cart.php',
	{
		iPro        : iPro,
		iSc         : iSc,
		estore_id   : estore_id,
		estore_name : estore_name,
		quantity    : quantity,
		count_click : count_click,
        vgs         : vgs,
		return      : _return,
		_           : time
	}, function(data){
		if(data.error == ''){
			// thành công
			$('#totalProduct').html(data.total_product);
			$('html, body').animate({
				'scrollTop' : $(".icon_vg40_cart").position().top
			});
			flyToElement($('#carousel-2 .carousel-inner .item img').eq(0), $('.icon_vg40_cart'), 10);
		}else{
			// thất bại
			console.error('không thể thêm vào giỏ hàng');
		}
	}, 'json');
}

// Thoat khoi su kien click
$.fn.clickOff = function(callback, selfDestroy) {
    var clicked = false;
    var parent = this;
    var destroy = selfDestroy || true;

    parent.click(function() {
        clicked = true;
    });

    $(document).click(function(event) {
        if (!clicked) {
            callback(parent, event);
        }
        if (destroy) {
            //parent.clickOff = function() {};
            //parent.off("click");
            //$(document).off("click");
            //parent.off("clickOff");
        };
        clicked = false;
    });
};

/**
 * CountDownTimer dem nguoc thoi gian
 * @param {dt} dt datetime example (2016/05/19 23:59:59)
 * @param {element} element can dem nguoc
 * @param {class_name_add} ten class muon chen vao class cua cac phan tu so
 * @return void
 */
function CountDownTimer(dt, element, class_name_add){
	var dt = dt;
	var end            = new Date(dt);
    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    var timer;
    var element = element;
    var class_name_add = class_name_add;

    function showRemaining() {
        var now = new Date();
        var distance = end - now;
        if (distance < 0) {
            clearInterval(timer);
            $(element).html('Kết thúc khuyễn mại');
            return;
        }
        var days = Math.floor(distance / _day);
        days = days < 10 ? ('0' + days) : days;
        var hours = Math.floor((distance % _day) / _hour);
        hours = hours < 10 ? ('0' + hours) : hours;
        var minutes = Math.floor((distance % _hour) / _minute);
        minutes = minutes < 10 ? ('0' + minutes) : minutes;
        var seconds = Math.floor((distance % _minute) / _second);
        seconds = seconds < 10 ? ('0' + seconds) : seconds;

		var html  = '<span class="'+class_name_add+'">' + days + '</span> Ngày ';
		html     += '<span class="'+class_name_add+'">' + hours + '</span>:';
		html     += '<span class="'+class_name_add+'">' + minutes + '</span>:';
		html     += '<span class="'+class_name_add+'">' + seconds + '</span>';
        $(element).html(html);
    }

    timer = setInterval(showRemaining, 1000);
}

function showSimpleTip(content,style){
	var html = '<div id="simple_tip" style="position:absolute; '+style+'; top:100%; background-color:white;z-index:9">';
	html += '<div class="simple_tip_wrapper header_bar_simple_tip">';
	html += '<div id="simple_tip_content">';
	html += content;
	html += '</div></div></div>';
	return html;
}

function loadAjaxContent(url){
	var key	= (typeof(arguments[1]) != "undefined" ? arguments[1] : "");
	if(key != ""){
		return $.ajax({ url: url}).responseText;
	}
}

function appDownloadSimpleTipGenerate(referrer) {
    html = '';
    html += '<table cellpadding="10" cellspacing="0"><tr>';
    html += '<td><i class="icon_appdl_main icon_appdl_qrcode"></i><div class="text_grey"><b>QUÉT MÃ ĐỂ TẢI</b></div></td>';
    html += '<td style="padding-top: 15px !important">';
    html += '<div><a href="https://play.google.com/store/apps/details?id=touch.vatgia.com&' + referrer + '" target="_blank" style="display: block;"><i class="icon_appdl_main icon_appdl_android"></i></a></div>';
    html += '<div style="margin-top: 10px;"><a href="https://itunes.apple.com/vn/app/vat-gia-thien-uong-mua-sam/id1018114852?mt=8&' + referrer + '" target="_blank" style="display: block;"><i class="icon_appdl_main icon_appdl_ios"></i></a></div>';
    html += '</td>';
    html += '</tr></table>';
    return html;
}

function showUsersInfo(uname,uloginname,uid,uavata,refer){
	html = "";
	html += '<div class="logged_information">';
    html += '	<ul>';
    html += '	<li class="user_information">';
    html += '   	<img src="'+uavata+'">';
    html += '       <div class="title ml">'+uname+'</div>';
    html += '       <div class="text ml">ID: #'+uid+' ('+uloginname+')</div>';
    html += '       <div class="text ml"><a class="manage_info" href="http://slave.vatgia.com/profile/?module=edit_profile" target="_blank">Thông tin cá nhân</a></div>';
    html += '       <div class="text ml"><a class="manage_info" href="/shop/'+ uid +'" target="_blank">Trang cửa hàng của publisher</a></div>';
    html += '       <div class="text ml"><a class="manage_info" href="/dashboard" target="_blank">Trang quản lí của publisher</a></div>';
    html += '   </li>';
    html += '	</ul>';
    html += '	<div class="logout">';
    html += '		<input type="button" class="form_button" value="Đăng xuất" onclick="location.href=\''+ window.app.logout_url +'\'">';
    html += '	</div>';
    html += '</div>';
    return html;
}

function openSelect(elm) {
	var element = document.getElementById(elm)
	var worked = false;
	if (document.createEvent) { // all browsers
	 	var e = document.createEvent("MouseEvents");
	 	e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	 	worked = element.dispatchEvent(e);

	} else if (element.fireEvent) { // ie
	 	worked = element.fireEvent("onmousedown");
	}

}

// Hieu ung di chuyen anh (thuong dung cho hieu ung click them gio hang)
function flyToElement(flyer, flyingTo, divider) {
	divider = divider < 0 ? 3 : divider;
	var $func = $(this);
	var flyerClone = $(flyer).clone();
	$(flyerClone).css({
		position: 'absolute',
		top: $(flyer).offset().top + "px",
		left: $(flyer).offset().left + "px",
		opacity: 1,
		'z-index': 1000
	});
	$('body').append($(flyerClone));
	var gotoX = $(flyingTo).offset().left + ($(flyingTo).width() / 2) - ($(flyer).width()/divider)/2;
	var gotoY = $(flyingTo).offset().top + ($(flyingTo).height() / 2) - ($(flyer).height()/divider)/2;

	$(flyerClone).animate({
	opacity: 0.4,
	left: gotoX,
	top: gotoY,
	width: $(flyer).width()/divider,
	height: $(flyer).height()/divider
	}, 700,
	function () {
		$(flyingTo).fadeOut('fast', function () {
			$(flyingTo).fadeIn('fast', function () {
				$(flyerClone).fadeOut('fast', function () {
					$(flyerClone).remove();
				});
			});
		});
	});
}


function initMapList(idElement, locations, indexMarkerReturn, zoom){
	var markerFirst;
	var keyListCity = Object.keys(listCity);
	zoom = zoom || 11;
	if (keyListCity.length == 1){
		lat = citylatLng[keyListCity[0]][0];
		lng = citylatLng[keyListCity[0]][1];
		zoom = 11;
	} else {
		lat = citylatLng[0][0];
		lng = citylatLng[0][1];
	}

    map = new google.maps.Map(document.getElementById(idElement), {
		center      : new google.maps.LatLng(lat, lng),
		zoom        : zoom,
		scrollwheel : false,
		mapTypeId   : google.maps.MapTypeId.ROADMAP
    });
    geocoder = new google.maps.Geocoder();
    for (i = 0; i < locations.length; i++) {
    	lati = parseFloat(locations[i][0]);
    	lngi = parseFloat(locations[i][1]);
    	if (lati != 0 && lngi != 0) {
    		marker = new google.maps.Marker({
				position: new google.maps.LatLng(lati, lngi),
				map: map,
				icon: '/themes/v1/img/mapker.png'
			});
    	} else {
    		geocoder.geocode( { 'address': locations[i][2]}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					latResult = results[0].geometry.location.lat();
					lngResult = results[0].geometry.location.lng();
					marker = new google.maps.Marker({
						position: new google.maps.LatLng(latResult, lngResult),
						map: map,
						icon: '/themes/v1/img/mapker.png'
					});
				}
			});
    	}

		if (i == indexMarkerReturn) {
			markerFirst = marker;
		}
    }
    if (locations.length == 1) {
    	map.setZoom(15);
    	if (parseFloat(locations[0][0]) != 0 && parseFloat(locations[0][1]) != 0) {
    		map.setCenter({lat: parseFloat(locations[0][0]), lng: parseFloat(locations[0][1]) });
    	} else {
    		map.setCenter({lat: latResult, lng: lngResult });
    	}

		$("#chose-address li").addClass('active');
    }
    return markerFirst;
}

/**
 * Them thong tin mo ta tai dia diem trem ban do
 * @param  {object} map      Doi tuong da duoc map vao google map
 * @param  {object} marker   Doi tuong da duoc tao marker
 * @param  {string} html     Khoi html muon hien thi thong tin
 * @param  {Number} maxWidth Chieu rong cua khoi
 * @return {void}
 */
function mapAddInfowindow(map, marker, html, maxWidth){
	// Khong hien thi tren mobile
	if (window.screen.width > 767) {
		maxWidth = maxWidth || 400;
		maxWidth = parseInt(maxWidth);
		if (maxWidth < 1)
			maxWidth = 400;
		if (infowindow) {
			infowindow.close();
		}
		infowindow = new google.maps.InfoWindow({
			content: html,
			maxWidth: maxWidth
		})
		infowindow.open(map, marker);
	}
}

function searchByProvince(province){
	if (typeof(geocoder) == 'undefined' )
		geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': province}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter({lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()});
			map.setZoom(15);
			marker.setPosition({lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()});
			mapAddInfowindow(map, marker, '<b>Vị trí hiển thị tương đối !</b>');
		}
	});
}

function mapGoPosition(map, marker, html, lat, lng, zoom){
	if (typeof(zoom) == 'undefined' )
		zoom = 15;
	map.setZoom(zoom);
	marker.setPosition({lat: lat, lng: lng});
	map.setCenter({lat: lat, lng: lng});
	if (infowindow)
		infowindow.close();
	mapAddInfowindow(map, marker, html);
}

function mapGoProvince(province, map, marker, zoom){
	if (typeof(zoom) == 'undefined' )
		zoom = 15;
	geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': province}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setZoom(zoom);
			map.setCenter({lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()});
			marker.setPosition({lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()});
			if (infowindow)
				infowindow.close();
			mapAddInfowindow(map, marker, '<b>Vị trí hiển thị tương đối !</b>');
		}
	})
}

function getCookie(name){
	var nameEQ    = name + "=",
		strCookie = document.cookie,
		ca        = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function closePopup(e, v){
	var e = $(e),
		popup = e.parent();

	popup.hide();
}

function showPopupArea(){
	$('#popupArea').show();
}

function changeArea(area){
	$('#popupArea').hide();
	setCookie('area', area, 30);
	// location.reload(false);
}