jQuery.fn.jtip = function(content, allowHtml, className){
	jQuery.fn.jtip.created.id = "jtip";
	$("body").append(jQuery.fn.jtip.created);

	var jtip = $(jQuery.fn.jtip.created);
		jtip.css({"position":"absolute","display":"none"});
		
	function _S(e){
		jtip.css({"display":"block", "top":e.pageY+16, "left":e.pageX});
	}
	function _H(){
		jtip.css({"display":"none"});
	}

	this.each(function(){
		$(this).mousemove(function(e){
			_S(e);
			if(allowHtml)
				jtip.html(content);
			else
				jtip.text(content);
			jtip.removeClass();
			if(className) jtip.addClass(className);
		});
		$(this).mouseout(function(){
			_H();
		});
	});	
};

jQuery.fn.jtip.created = document.createElement("div");