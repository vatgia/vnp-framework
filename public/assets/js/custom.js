var map, marker, infowindow;
function initMap(){
    if (map) {
        return;
    }

    map = new google.maps.Map(document.getElementById('ggMap'), {
		center      : {lat: lat, lng : lng},
		zoom        : 18,
		scrollwheel : false,
		mapTypeId   : google.maps.MapTypeId.ROADMAP
    });

    marker = new google.maps.Marker({
        position: {lat: lat, lng : lng},
        map: map
    });
}
var citylatLng = {
	0: [14.058324, 108.277199],
	5: [21.027266, 105.855453],
	6: [16.047079, 108.206230],
	7: [10.762622, 106.660172]
}

// check show popup by cookie
if($('#popupArea').length){
	setTimeout(function(){
		showPopupArea();

	}, 2000);
}

// click buy now
$('.btn--buy-now').click(function(){
	var quantity = $('#quantity').val(),
		_this = $(this),
		link = _this.attr('href');
	if(link == '#'){
		return;
	}
	_this.attr('href', link + '&quantity=' + quantity + '&_=' + Date.now());
});

$(document).ready(function(){

	// Header vatgia
	$('.header_bar .fr a').hover(function() {

		var content = $(this).attr('js');
		content = eval(content);
		if (content != "" && typeof(content) != "undefined") {
	        //console.log(typeof(content));
	        $(this).addClass('active simple_tip_active');
			if($(this).attr('pos') == 'right')
				pos = 'right: -1px';
			else
				pos = 'left: -1px';
			$(this).append(showSimpleTip(content,pos));
	    }
	}, function() {
		$(this).removeClass('active simple_tip_active');
		$(this).find('#simple_tip').remove();
	});

	$('.dropdown-menu-city').clickOff(function(){
		$('#city-test').removeClass('show');
	})
	$('.tab-style-branding .block__title').click(function(){
		if ($(this).attr('close') == 1){
			$('.list-all-cat').css('display','none');
			$(this).attr('close','0');
		} else if($(this).attr('close') == 0)
			$('.list-all-cat').css('display','block');
		if ($('.list-all-cat').css('display') == 'block')
			$(this).attr('close','1');
	})

	//show menu mobile
	$('#open-menu').click(function(){
		$('.overlay').toggleClass('transform-menu');
		$('.overlay').show();
		$('.toggle-nav-menu-mobile').css('z-index', '9999');
		$('#main-nav .hd-menu.hd-effect-4').show();
		$('#page-content').toggleClass('show');
		$('.toggle-nav-menu-mobile').show();

		$('.toggle-nav-menu-mobile').click(function(){
			$('#main-nav .hd-menu.hd-effect-4').hide();
			$('#page-content').removeClass('show');
			$('.overlay').removeClass('transform-menu');
			$('.overlay').hide();
			$('.toggle-nav-menu-mobile').css('z-index',-1);
			$('.toggle-nav-menu-mobile').hide();
		})

		$('.overlay').click(function(){
			$('#main-nav .hd-menu.hd-effect-4').hide();
			$('#page-content').removeClass('show');
			$('.overlay').removeClass('transform-menu');
			$('.overlay').hide();
			$('.toggle-nav-menu-mobile').css('z-index',-1);
			$('.toggle-nav-menu-mobile').hide();
		})
	})

	// go top
	$("a[href='#top']").click(function() {
		$("html, body").animate({ scrollTop: 0 }, "slow");
	    return false;
	});
	var Scroll_top = $(window).scrollTop();
	if(Scroll_top < 100){
		$('.btn--to-top.to-top').css('display','none');
	} else
		$('.btn--to-top.to-top').css('display','block');

	$(window).scroll(function(e) {
		var Scroll_top = $(window).scrollTop();
		if (Scroll_top < 100){
			$('.btn--to-top.to-top').css('display','none');				
		} else {
			$('.btn--to-top.to-top').css('display','block');
		}
	})

	// Lấy vị trí cho cat seach
	var width_catSearch = $('#catSearch').width();
	$('.search-box .select-cat .list').css('right','-'+(width_catSearch - $('.search-box .select-cat').width() - 35) /2 + 'px' );
	// Neo thanh menu
	if(window.screen.width > 767){
		window.onload = function() {
			$('#product-details .nav-tabs li a[href^="#"]').on('click', function (e) {
			    e.preventDefault();
			    $('#product-details .nav-tabs .active').removeClass('active');
			    var target = this.hash,
		        $target = $(target);
			    $('html, body').stop().animate({
			        'scrollTop': $target.offset().top
			    }, 500, 'swing', function () {
			        window.location.hash = target;
			    });
			});
		}
	} else {
		$( window ).load(function() {
			$('#product-details .nav-tabs li a[href^="#"]').on('click', function (e) {
			    e.preventDefault();
			    target = this.hash,
			    target = $(target);			    
		    	get_top = target.offset().top - 45;
			    if($('#product-details .nav-tabs').attr('fixed') == '0')
			    	get_top = get_top - 45;
			    $('html, body').stop().animate({
			        'scrollTop': get_top
			    }, 500, 'swing', function () {
			        window.location.hash = target;
			    });
			});
		});
	}

	// Menu footer
	$('.footer-menu .menu__heading').click(function(){
		$(this).parent().find('.menu__listing').toggleClass('expanded');
	})
	if(window.screen.width < 768){
		$('#page-content').before('<a class="toggle-nav-menu-mobile"><i class="hd hd-nav"></i></a>');
	}

	// Chọn danh mục search
	$('.header-main .search-box .selectpicker').hover(function(){
		$('.header-main .search-box .select-cat .list').toggleClass('show');
		$('.header-main .search-box .select-cat .list li').click(function(){
			var e = $(this);
			var text = e.text();
			text = text.replace(/^hot deal\s/i, "");
			$('.header-main .search-box .select-cat').css('background-color','#e6e6e6');
			$('.header-main .search-box .selectpicker').text(text).attr('data-id', e.attr('value'));
			$('.header-main .search-box .select-cat .list').removeClass('show');
			$('.search-box .select-cat .list').css('right', '-' + (width_catSearch - $('.search-box .select-cat').width() - 35) /2 + 'px' );
		})
	}, function(){})
	$('.header-main .search-box .selectpicker').clickOff(function(){
		$('.header-main .search-box .select-cat .list').removeClass('show');
	})
	$('.header-main .search-box #catSearch').hover(function(){}, function(){
		$('.header-main .search-box .select-cat .list').removeClass('show');
	})

	// Đồng hồ đếm ngược
	$('.timer-countdown').each(function() {
        CountDownTimer($(this).attr('date'),$(this),'');
    });

    // Đếm ngược cho trang chi tiết
    if($('#timerCountdown').length > 0){
		var endDate = new Date($('#timerCountdown').attr('data-time')),
			currentDate = new Date(),
			day01       = $('#day01'),
			day02       = $('#day02'),
			hour01      = $('#hour01'),
			hour02      = $('#hour02'),
			minute01    = $('#minute01'),
			minute02    = $('#minute02'),
			second01    = $('#second01'),
			second02    = $('#second02'),
			d1          = parseInt(day01.text()),
			d2          = parseInt(day02.text()),
			h1          = parseInt(hour01.text()),
			h2          = parseInt(hour02.text()),
			m1          = parseInt(minute01.text()),
			m2          = parseInt(minute02.text()),
			s1          = parseInt(second01.text()),
			s2          = parseInt(second02.text()),
			countdown;

		// sửa lại time countdown theo giờ của client
		var t   = Math.round((endDate - currentDate) / 1000),
			d02     = Math.floor(t / (24 * 60 * 60)),
			_hour   = t % (24 * 60 * 60), // lấy phần dư giờ của ngày
			h02     = Math.floor(_hour / (60 * 60)),
			_minute = _hour % (60 * 60),// lấy phần dư phút của giờ
			m02     = Math.floor(_minute / 60),
			s02     = _minute % 60, // lấy phần dư giây của phút
			d01     = 0,
			h01     = 0,
			m01     = 0,
			s01     = 0;

        if(d02 >= 10){
            d01 = Math.floor(d02 / 10);
            d02 = d02 % 10;
        }

        if(h02 >= 10){
            h01 = Math.floor(h02 / 10);
            h02 = h02 % 10;
        }

        if(m02 >= 10){
            m01 = Math.floor(m02 / 10);
            m02 = m02 % 10;
        }

        if(s02 >= 10){
            s01 = Math.floor(s02 / 10);
            s02 = s02 % 10;
        }

        second02.text(s02);
		second01.text(s01);
		minute02.text(m02);
		minute01.text(m01);
		hour02.text(h02);
		hour01.text(h01);
		day02.text(d02);
		day01.text(d01);

		s2 = s02;
		s1 = s01;
		m2 = m02;
		m1 = m01;
		h2 = h02;
		h1 = h01;
		d2 = d02;
		d1 = d01;

    	countdown = setInterval(function(){
    		//console.log(m1, m2, ' - ', s2, s1);
    		s2--;

 			// giây
    		if(s2 < 0){
    			s2 = 9;
    			s1 --;
    			second02.text(s2);
    		}else{
    			second02.text(s2);
    			return;
    		}
    		if(s1 < 0){
    			s1 = 5;
    			m2 --;
    			second01.text(s1);
    		}else{
    			second01.text(s1);
    			return;
    		}

    		// phút
    		if(m2 < 0){
    			m2 = 9;
    			m1 --;
    			minute02.text(m2);
    		}else{
    			minute02.text(m2);
    			return;
    		}
    		if(m1 < 0){
    			m1 = 5;
    			h2 --;
    			minute01.text(m1);
    		}else{
    			minute01.text(m1);
    			return;
    		}

    		// giờ
    		if(h2 < 0){
    			if(h1 <= 0){
	    			h2 = 3;
	    			h1 = 2;
	    			d2--;
	    		}else{
	    			h2 = 9;
	    			h1 --;
	    		}
    			hour02.text(h2);

    			if(d2 >= 0){
    				hour01.text(h1);
    			}
    		}else{
    			hour02.text(h2);
    			return;
    		}

    		// ngày
    		if(d2 < 0 && d1 == 0){
    			clearInterval(countdown);
    		}else if(d2 < 0){
    			d2 = 9;
    			d1--;
    			day02.text(d2);

    			if(d1 < 0){
    				return;
    			}
    			day01.text(d1);
    		}else{
	    		day02.text(d2);
    			return;
    		}
    	}, 1000);
    }
	// $('#timer-countdown').countdown($('#timer-countdown').text(), function(event) {
 //        $('#timer-countdown').text(event.strftime('%D ngày %H:%M:%S'));
 //    });

 	// Loc dia diem trang cat
	$('.product-filters .filter__body .filter__button').click(function(e){
		e.preventDefault();
		$(this).toggleClass('active');
		input = $(this).find('input');
		parent = $(this).parents('.parrent-city');

		if ($(this).hasClass('active')){
			input.prop( "checked", true );

			
		} else {

			input.prop( "checked", false );
			input.removeAttr( "checked");
			if (input.hasClass('city')){
				parent.find('.district input').removeAttr( "checked");
				parent.find('.district input').prop( "checked", false );
			}

			if (! input.hasClass('city')){
				// Tich vao quan huyen
				if (parent.find('.district .filter__button.active').length == 0) {
					// Neu khong co quan huyen nao duoc tich thi bo tich thanh pho luon
					parent.find('.city').prop( "checked", false );
					parent.find('.city').removeAttr( "checked");
				}
			}
		}
		
		$("#filter_page_category").submit();
	});

	$('.product-well .more-text').click(function(){
		$('.product-well').addClass('expanded');
		$('.product-well .more-text').hide();
		$('.product-well .less-text').css('display','block');
	})

	$('.product-well .less-text').click(function(){
		$('.product-well').removeClass('expanded');
		$('.product-well .less-text').hide();
		$('.product-well .more-text').show();
	})

	$('#box-cart').click(function(evt){
		$(this).parent().find('.dropdown-menu.dropdown-cart').toggleClass('show');
	})
	$('#box-cart').clickOff(function() {
	    $('.dropdown-menu.dropdown-cart').removeClass('show');
	});

	// Chon so luong mua
	$('.box-quantity .quantity__text').click(function() {
		openSelect('quantity');
	});

	// Show question thanh toan info
	$('.pay_info .fa-question-circle').hover(function(){
		$('.pay_info .item .question').show();
	}, function(){
		$('.pay_info .item .question').hide();
	})

	// Touch slide gallery detail
	$("#carousel-2").swipe({
		swipe:function(event, direction, distance, duration, fingerCount) {
			switch (direction) {
				case 'left' :
					$("#carousel-2").carousel('next');
				case 'right':
					$("#carousel-2").carousel('prev');
				default : return false;
			}
		},
		allowPageScroll:"vertical",
		preventDefaultEvents: false,
	})

	// Xu ly slide o trang chu pc
	$("#good-deal .carousel-control").click(function(){
		this_ = $(this).parents('.products');
		this_active = this_.find('.item.active');
		pos = this_.find('.item').length - 1;
		state = this_active.index();
		
		if ($(this).attr('data-slide') == 'next') {
			if (state < pos){
				last = this_active;
				next = this_active.next();
			} else {
				last = this_active;
				next = this_.find('.item:first-child');
			}
		} else {
			if (state >0) {
				next = this_active.prev();
				last = this_active;
			} else {
				last = this_active;
				next = this_.find('.item:last-child');
			}
		}
		
		next.addClass('active');
		last.removeClass('active');
		
	})

	// Load ajax trang hom de loc deal
	$("#good-deal .tab.nav li").click(function(){
		var this_ = $(this);
		val = this_.attr('val');
		$("#tab-content-ajax .tab-pane").hide();
		$("#cat-"+ val).fadeIn();
		
		if ($("#cat-"+val+" .products__inner").length < 1) {
			$("#tab-content-ajax").addClass('load');
			$.ajax({
			  	url: '/ajax_v1/deal_sort.php?value=' + val,
			  	success: function( result ) {
			  		result = '<div class="products__inner" pos="0">' + result + '</div>';
			  		$("#cat-"+val+" .products").append(result);
			  		$("#tab-content-ajax").removeClass('load');
			  		// Đồng hồ đếm ngược
					$("#cat-"+val+' .timer-countdown').each(function() {
				        CountDownTimer($(this).attr('date'),$(this),'');
				    });
			  	}
			});
		}
		$("#good-deal .tab.nav li").removeClass('active');
		this_.addClass('active');
	})

	// Show popup video
	$('.sidebar-video .media-left .background').click(function(){
		link = $(this).prev().attr('vid');
		href = $(this).parents('.media').find('.media-body a').attr('href');
		title = $(this).parents('.media').find('.media-body h4').attr('title');
		html = '<div id="iframe-youtube-home" class="embed-responsive embed-responsive-16by9">'
			+'<a href="'+href+'"><h4 class="media-heading">'+title+'</h4></a>'
			+'<iframe class="embed-responsive-item" width="560" height="315" src="https://www.youtube.com/embed/'
			+link+'" frameborder="0" allowfullscreen></iframe>'
			+'<span class="close-video">'
				+'<i class="fa fa-times" aria-hidden="true"></i>'
			+'</span>'
			+'</div>';
		$('.overlay').show();
		$('body').append(html);
		$('body').css('overflow','hidden');
		$(".close-video").click(function(){$('.overlay').click() } );
		$('.overlay').click(function(){
			$("#iframe-youtube-home").remove();
			$(".close-video").remove();
			$('body').css('overflow','visible');
			$('.overlay').hide();
		})
	})

	// Xu ly slide cho danh muc video o mobile
	if(window.screen.width < 640 && $(".sidebar-video .video .media").length > 2){
		$(".sidebar-video .video").append('<span id="video-left"> <i class="fa fa-circle active" aria-hidden="true"></i> <i class="fa fa-circle" aria-hidden="true"></i> </span>');
	}
	$("#video-left i").click(function(){
		if ($(".sidebar-video .video .media").length > 2) {
			if ($(this).index() > 0) {
				$(".sidebar-video .video .media").eq(0).hide();
				$(".sidebar-video .video .media").eq(1).hide();
				$(".sidebar-video .video .media").eq(2).fadeIn();
				$(".sidebar-video .video .media").eq(3).fadeIn();
				$("#video-left i").removeClass('active');
				$(this).addClass('active');
			} else {
				$(".sidebar-video .video .media").eq(2).hide();
				$(".sidebar-video .video .media").eq(3).hide();
				$(".sidebar-video .video .media").eq(0).fadeIn();
				$(".sidebar-video .video .media").eq(1).fadeIn();
				$("#video-left i").removeClass('active');
				$(this).addClass('active');
			}
		}
		
	})

	if (window.screen.width < 768) {
		latFirst = parseFloat($("#chose-address li:first-child").attr('lat') );
		lngFirst = parseFloat($("#chose-address li:first-child").attr('long') );
		$("#chose-address li:first-child")
		.after('<img src="https://maps.googleapis.com/maps/api/staticmap?center=&zoom=15&size=600x400&maptype=roadmap&key=AIzaSyDgOlALzCaCBf8HWHQy-XPPE6tZ_v5TrOM&markers=color:red|'+latFirst+','+lngFirst+'" />')
		;
		$("#chose-address li:first-child").next('img').show();
		$("#chose-address li:first-child").addClass('active');
	}
	// Mapker nha cung cap
	$("#chose-address li").click(function() {
		lat = parseFloat($(this).attr('lat') );
		lng = parseFloat($(this).attr('long') );
		if (lat > 0 && lng > 0 ) {
			if (window.screen.width < 768) {
				$("#chose-address img").hide();
				if (! $(this).next().is('img')) {
					$(this).after('<img src="https://maps.googleapis.com/maps/api/staticmap?center=&zoom=15&size=600x400&maptype=roadmap&key=AIzaSyDgOlALzCaCBf8HWHQy-XPPE6tZ_v5TrOM&markers=color:red|'+lat+','+lng+'" />');
					$(this).next('img').show();
				}
				else 
					$(this).next().show();
				$("#chose-address li").removeClass('active');
				$(this).addClass('active');
			}
			else {
				html = $(this).html() + $("#btn--buy-now")[0].outerHTML;
				mapGoPosition(map, marker, html, lat, lng, 15);
			}
				
			$("#chose-address li").removeClass('active');
			$(this).addClass('active');
		} else {
			var this_ = $(this);
			textSearch = $(this).find('.text')[0].innerHTML;
			if (window.screen.width > 767) {	
				searchByProvince(textSearch);
				$("#chose-address li").removeClass('active');
				this_.addClass('active');
			} else {
				geocoder = new google.maps.Geocoder();
				geocoder.geocode( { 'address': textSearch}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						lat = results[0].geometry.location.lat();
						lng = results[0].geometry.location.lng();
						$("#chose-address img").hide();
						if (! this_.next().is('img')) {
							this_.after('<img src="https://maps.googleapis.com/maps/api/staticmap?center=&zoom=15&size=600x400&maptype=roadmap&key=AIzaSyDgOlALzCaCBf8HWHQy-XPPE6tZ_v5TrOM&markers=color:red|'+lat+','+lng+'" />');
							this_.next('img').show();
						}
						else 
							this_.next().show();
						$("#chose-address li").removeClass('active');
						this_.addClass('active');
					}
				});
			}
		}
	})
	// Chon tinh thanh ban do
	$("#chose-city select").change(function(){		
		val = parseInt($(this).val());
		$("#chose-address li").removeClass('active');
		map.setCenter({lat: citylatLng[val][0], lng: citylatLng[val][1]});
		if (val == 0) {
			map.setZoom(5);
			$("#chose-address li").show();
		}
		else {
			map.setZoom(11);
			$("#chose-address li").hide();
		}
		if (infowindow) {
			infowindow.close();
		}
		if ($("#chose-address li[city='"+ val +"']").length == 1) {
			map.setZoom(15);
			lat = parseFloat($("#chose-address li[city='"+ val +"']").attr('lat'));
			lng = parseFloat($("#chose-address li[city='"+ val +"']").attr('long'));
			province = $("#chose-address li[city='"+ val +"']").find('.text')[0].innerHTML;
			if (lat != 0 && lng != 0) {
				html = $("#chose-address li[city='"+ val +"']").html() + $("#btn--buy-now")[0].outerHTML;
				mapGoPosition(map, marker, html, lat, lng, 15);
			} else {
				mapGoProvince(province, map, marker, 15);
			}
			$("#chose-address li[city='"+ val +"']").addClass('active');
		}

		$("#chose-address li[city='"+ val +"']").show();
	})
	// Tooltip select city map
	$('#chose-city [data-toggle="tooltip"]').tooltip({trigger: 'hover'});
	$('.pay_info .box-e-voucher').hover(function(){
		$('.pay_info .box-e-voucher [data-toggle="tooltip"]').tooltip('show');
	}, function(){
		$('.pay_info .box-e-voucher [data-toggle="tooltip"]').tooltip('hide');
	})
	$('.pay_info .box-evoucher').hover(function(){
		$('.pay_info .box-evoucher [data-toggle="tooltip"]').tooltip('show');
	}, function(){
		$('.pay_info .box-evoucher [data-toggle="tooltip"]').tooltip('hide');
	})
	$('.box-e-voucher [data-toggle="tooltip"]').tooltip({
		trigger: 'hover',
		html: true
	});
	$('.box-evoucher [data-toggle="tooltip"]').tooltip({
		trigger: 'hover',
		html: true
	});
	// Popup ban do
	$("#more-map").click(function(){
		$('.overlay').show();
		$("#dia-diem").append('<span class="close-video"><i class="fa fa-times" aria-hidden="true"></i></span>');
		$("#dia-diem").addClass('fixed');
		$('body').css('overflow','hidden');

		$("#dia-diem .close-video").click(function(){$('.overlay').click()})
		$('.overlay').click(function(){
			$('body').css('overflow','visible');
			$('.overlay').hide();
			$("#dia-diem").removeClass('fixed');
			$("#dia-diem .close-video").removeAttr();
		})
	})

	//
	$("#product-details .nav.nav-tabs li:first-child").addClass('active');

	// Show box vchat
	$(".not-found .chat").click(function(){
		if ($('#vgc_bc_off').length > 0) {
			vgc_sh_chat_contact();
		} else {
			vgchatClientToggleDiv({div_id : 'panel_body_vgchat', div_toggle : 'toggle'})
		}
	})

	// Neo header
    $(window).scroll(function() {
        var Scroll_top = $(window).scrollTop();
        if (window.screen.width > 767) {
             if (Scroll_top < 162) {
                $('#fixed-01').removeClass('fix');
                $('#fixed-02').removeClass('fix');
                $("#none-fix").css('margin-top','0px');
                $(".header-main").css("padding",'25px 0');
            } else {
                $('#fixed-01').addClass('fix');
                $('#fixed-02').addClass('fix');
                $("#none-fix").css('margin-top','162px');
                $(".header-main").css("padding",'12px 0');
            }
        }else{
            if (Scroll_top > 162) {
                $('#fixed-01').addClass('fix');
            }else{
            	$('#fixed-01').removeClass('fix');
            }
        }
    })
})

