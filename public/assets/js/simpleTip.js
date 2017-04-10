var simpleTipConfig	= {
	version		: 20141103,
	object		: null,
	objectActive: null,
	timeOut		: null,
	lastActive	: -1,
	focus			: false
};
function simpleTip(){
	var selector	= (typeof(arguments[0]) != "undefined" ? arguments[0].find(".simple_tip") : $(".simple_tip"));
	selector.quickEach(function(index){
		switch(this.attr("event")){
			case "click":
				this.off("click").click(function(event){
					event.stopImmediatePropagation();
					if(typeof($(this).attr("deactive")) != "undefined" && $(this).attr("deactive") == 1) return false;
					if(simpleTipConfig.object === null || simpleTipConfig.lastActive != index){
						simpleTipShow($(this));
						simpleTipConfig.object.click(function(e){ e.stopImmediatePropagation(); });
						clickOutside(simpleTipRemove);
					}
					else simpleTipRemove();
					simpleTipConfig.lastActive	= index;
				});
				break;
			default:
				this.hoverIntent({
					over		: function(){ if(typeof($(this).attr("deactive")) != "undefined" && $(this).attr("deactive") == 1) return false; simpleTipShow($(this)); simpleTipConfig.lastActive	= index; },
					out		: function(){ if(!simpleTipConfig.focus && typeof($(this).attr("manualClose")) == "undefined") simpleTipConfig.timeOut	= setTimeout('simpleTipRemove();', 200); },
					interval	: (typeof(this.attr("interval")) != "undefined" ? this.attr("interval") : 100)
				});
				break;
		}
	});
}

function simpleTipConfirm(message, callback){
	var simpleTipConfirmOpts	= {
		valueTrue	: "Đồng ý",
		valueFalse	: "Hủy bỏ",
		addClass		: "simple_tip_confirm"
	}
	if(typeof(arguments[2]) != "undefined") $.extend(simpleTipConfirmOpts, arguments[2]);
	
	simpleTipConfirmCallback	= function(confirm){
		simpleTipRemove();
		if(typeof(callback) == "function") callback(confirm);
	};
	
	var strReturn	=  '<div class="' + simpleTipConfirmOpts.addClass + '">' +
								'<div class="message">' + message + '</div>' +
								'<div class="button">' +
									'<input type="button" class="simple_tip_confirm_true" value="' + simpleTipConfirmOpts.valueTrue + '" onclick="simpleTipConfirmCallback(true)" /> &nbsp' +
									'<input type="button" class="simple_tip_confirm_false" value="' + simpleTipConfirmOpts.valueFalse + '" onclick="simpleTipConfirmCallback(false)" />' +
								'</div>' +
							'</div>';
	return strReturn;
}

function simpleTipShow(domEle){
	simpleTipRemove();
	simpleTipConfig.objectActive	= domEle;
	// Lấy content
	var simpleTipContent	= "";
	if(typeof(simpleTipConfig.objectActive.attr("js")) != "undefined")				simpleTipContent = eval(simpleTipConfig.objectActive.attr("js"));
	else if(typeof(simpleTipConfig.objectActive.attr("ajax")) != "undefined")		simpleTipContent = $.ajax({ url: simpleTipConfig.objectActive.attr("ajax"), cache: false, async: false }).responseText;
	else if(typeof(simpleTipConfig.objectActive.attr("content")) != "undefined")	simpleTipContent = '<div class="simple_tip_content_text">' + simpleTipConfig.objectActive.attr("content") + '</div>';
	else if(typeof(simpleTipConfig.objectActive.attr("rel")) != "undefined")		simpleTipContent = $(simpleTipConfig.objectActive.attr("rel")).html();
	
	simpleTipConfig.objectActive.addClass("active simple_tip_active");
	var objectActiveOuterWidth	= simpleTipConfig.objectActive.outerWidth();
	var objectActiveOuterHeight= simpleTipConfig.objectActive.outerHeight();
	var objectActiveOffset		= simpleTipConfig.objectActive.offset();
	
	var addClass			= (typeof(simpleTipConfig.objectActive.attr("addClass")) != "undefined" ? ' ' + simpleTipConfig.objectActive.attr("addClass") : '');
	var hideArrow			= (typeof(simpleTipConfig.objectActive.attr("hideArrow")) != "undefined" ? simpleTipConfig.objectActive.attr("hideArrow") : 0);
	var position			= (typeof(simpleTipConfig.objectActive.attr("position")) != "undefined" ? simpleTipConfig.objectActive.attr("position") : "bottom");
	var contentPosition	= (typeof(simpleTipConfig.objectActive.attr("contentPosition")) != "undefined" ? simpleTipConfig.objectActive.attr("contentPosition") : "auto");
	var borderArrow		= (typeof(simpleTipConfig.objectActive.attr("borderArrow")) != "undefined" ? simpleTipConfig.objectActive.attr("borderArrow") : '');
	var bgArrow				= (typeof(simpleTipConfig.objectActive.attr("bgArrow")) != "undefined" ? simpleTipConfig.objectActive.attr("bgArrow") : '');
	var fixed				= (typeof(simpleTipConfig.objectActive.attr("fixed")) != "undefined" ? true : false);
	var marginTop			= (typeof(simpleTipConfig.objectActive.attr("marginTop")) != "undefined" ? parseInt(simpleTipConfig.objectActive.attr("marginTop")) : 0);
	var marginLeft			= (typeof(simpleTipConfig.objectActive.attr("marginLeft")) != "undefined" ? parseInt(simpleTipConfig.objectActive.attr("marginLeft")) : 0);
	var marginArrow		= (typeof(simpleTipConfig.objectActive.attr("marginArrow")) != "undefined" ? parseInt(simpleTipConfig.objectActive.attr("marginArrow")) : 0);		
	var scrollTop			= $(document).scrollTop();
	var scrollLeft			= $(document).scrollLeft();
	var windowWidth		= $(window).width();
	var documentHeight	= $(document).height();
	
	simpleTipConfig.object	= $('<div id="simple_tip"></div>');
	simpleTipConfig.object.html('<div class="simple_tip_wrapper' + addClass + '">' + (hideArrow == 0 ? '<span id="simple_tip_arrow" class="' + position + '"><b></b></span>' : '') + '<div id="simple_tip_content">' + simpleTipContent + '</div></div>');
	
	// Append to body tag
	$("body").append(simpleTipConfig.object);
	if(fixed) simpleTipConfig.object.css("position", "fixed");
	
	var arrowObject		= simpleTipConfig.object.find("#simple_tip_arrow");
	var posTop				= objectActiveOffset.top - (fixed ? scrollTop : 0) + marginTop;
	var posLeft				= objectActiveOffset.left - (fixed ? scrollLeft : 0) + marginLeft;
	var objectOuterWidth	= simpleTipConfig.object.outerWidth();
	var objectOuterHeight= simpleTipConfig.object.outerHeight();
	if(position == "top" || position == "bottom"){
		if(position == "top") posTop	-= (objectOuterHeight + (hideArrow == 0 ? 12 : 0));
		else posTop	+= (objectActiveOuterHeight + (hideArrow == 0 ? 12 : 0));	

		// Set vị trí right để tránh bị overflow
		if((posLeft + objectOuterWidth > windowWidth) || contentPosition == "left"){
			var posRight	= windowWidth - posLeft - objectActiveOuterWidth;
			if(objectOuterWidth > (windowWidth - posRight)) simpleTipConfig.object.css({ top: posTop, left: 5 });
			else simpleTipConfig.object.css({ top: posTop, right: posRight });
		}
		else simpleTipConfig.object.css({ top: posTop, left: posLeft });
		// Fix lại vị trí của simple tip arrow
		if(hideArrow == 0){
			var temp	= parseInt(((objectActiveOuterWidth > objectOuterWidth ? objectOuterWidth : objectActiveOuterWidth) - 19) / 2);
			temp	= objectActiveOffset.left - simpleTipConfig.object.offset().left + temp;
			if(temp < 0) temp = 0;
			if(temp > (simpleTipConfig.object.offset().left + objectOuterWidth)) arrowObject.css({ left: "auto", right: 0 + marginArrow });
			else arrowObject.css({ left: temp + marginArrow, right: "auto" });
		}
	}
	else{
		if(position == "left") posLeft	-= (objectOuterWidth + (hideArrow == 0 ? 12 : 0));
		else posLeft	+= (objectActiveOuterWidth + (hideArrow == 0 ? 12 : 0));
		// Set vị trí bottom để tránh bị overflow
		if(posTop + objectOuterHeight > documentHeight) simpleTipConfig.object.css({ top: posTop - objectOuterHeight + objectActiveOuterHeight, left: posLeft });
		else simpleTipConfig.object.css({ top: posTop, left: posLeft });
		// Fix lại vị trí của simple tip arrow
		if(hideArrow == 0){
			var temp	= parseInt(((objectOuterHeight > objectActiveOuterHeight ? objectActiveOuterHeight : objectOuterHeight) - 19) / 2);
			if(temp < 0) temp = 0;
			if(temp > 9) temp = 9;
			if(posTop + objectOuterHeight > documentHeight) arrowObject.css({ top: "auto", bottom: 0 + marginArrow });
			else arrowObject.css({ top: temp + marginArrow, bottom: "auto" });
		}
	}
	
	// Arrow Style
	var border_position = "border-" + position + "-color";
	if(borderArrow != '') $("#simple_tip_arrow").css(border_position, borderArrow);
	if(bgArrow != '') $("#simple_tip_arrow").find('b').css(border_position, bgArrow);
	
	// onShow
	if(typeof(simpleTipConfig.objectActive.attr("onShow")) != "undefined") eval(simpleTipConfig.objectActive.attr("onShow"));
	
	// Fix lỗi form submit
	if(simpleTipConfig.object.find("form").length){
		simpleTipConfig.object.find("form").attr("name", function(index, attr){
			return attr + "_" + Math.floor(Math.random() * 1000 + 1);
		});
	}
	
	simpleTipConfig.object.hover(
		function(){ simpleTipConfig.focus	= true; clearTimeout(simpleTipConfig.timeOut); },
		function(){
			var close	= true;
			if(simpleTipConfig.objectActive.attr("manualClose") == "1")	close	= false;
			if(simpleTipConfig.objectActive.attr("event") == "click")	close	= false;
			if(close) simpleTipConfig.timeOut	= setTimeout('simpleTipRemove();', 200); }
	);
}

function simpleTipRemove(){
	if(simpleTipConfig.object !== null){
		// onCleanup
		if(typeof(simpleTipConfig.objectActive.attr("onCleanup")) != "undefined") eval(simpleTipConfig.objectActive.attr("onCleanup"));
		
		clearTimeout(simpleTipConfig.timeOut);
		
		simpleTipConfig.object.remove();
		simpleTipConfig.object			= null;
		
		// onRemove
		if(typeof(simpleTipConfig.objectActive.attr("onRemove")) != "undefined") eval(simpleTipConfig.objectActive.attr("onRemove"));
		
		simpleTipConfig.objectActive.removeClass("active simple_tip_active");
		simpleTipConfig.objectActive	= null;
		
		simpleTipConfig.lastActive		= -1;
		simpleTipConfig.focus			= false;
	}
}