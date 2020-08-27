$(document).ready(function() {

	//Select all anchor tag with rel set to tooltip
	$('a[rel=tooltip]').mouseover(function(e) {

		//Grab the title attribute's value and assign it to a variable
		var tip = $(this).attr('title');

		//Remove the title attribute's to avoid the native tooltip from the browser
		$(this).attr('title','');

		//Append the tooltip template and its value
		$(this).append('<div id="tooltip"><div class="tipHeader"></div><div class="tipBody">' + tip + '</div><div class="tipFooter"></div></div>');

		//Show the tooltip with faceIn effect
		//$('#tooltip').fadeIn('500');
		//$('#tooltip').fadeTo('10',0.9);

	}).mousemove(function(e) {

		//Keep changing the X and Y axis for the tooltip, thus, the tooltip move along with the mouse
		$('#tooltip').css('top', e.pageY + 25 );
		$('#tooltip').css('left', e.pageX - 30 );

	}).mouseout(function() {

		//Put back the title attribute's value
		$(this).attr('title',$('.tipBody').html());

		//Remove the appended tooltip template
		$(this).children('div#tooltip').remove();

	});
	$('.tooltip').mouseover(function(e) {

		//Grab the title attribute's value and assign it to a variable
		var tip = $(this).attr('title');

		//Remove the title attribute's to avoid the native tooltip from the browser
		$(this).attr('title','');

		//Append the tooltip template and its value
		$(this).append('<div id="tooltip"><div class="tipHeader"></div><div class="tipBody">' + tip + '</div><div class="tipFooter"></div></div>');

		//Show the tooltip with faceIn effect
		//$('#tooltip').fadeIn('500');
		//$('#tooltip').fadeTo('10',0.9);

	}).mousemove(function(e) {

		//Keep changing the X and Y axis for the tooltip, thus, the tooltip move along with the mouse
		$('#tooltip').css('top', e.pageY + 25 );
		$('#tooltip').css('left', e.pageX - 30 );

	}).mouseout(function() {

		//Put back the title attribute's value
		$(this).attr('title',$('.tipBody').html());

		//Remove the appended tooltip template
		$(this).children('div#tooltip').remove();

	});

});

// Create the tooltips only on document load
function checkall(total){

	if(document.getElementById("check_all").checked==true){
		for(i=1;i<=total;i++){
			document.getElementById("record_"+i).checked = true;
		}
	}else{
		for(i=1;i<=total;i++){
			document.getElementById("record_"+i).checked = false;
		}
	}
};
function deleteall(total){
	var listid = '0';
	var selected = false;
	for(i=1;i<=total;i++){
		if(document.getElementById("record_"+i).checked == true){
			id 		= 	document.getElementById("record_"+i).value;
			listid 	+= ','+id;
			$("#tr_"+id).hide('slow');
			selected = true;
		}
	}
	if(selected===true){
		$.ajax({
			type: "POST",
			url: "delete.php",
			data: "record_id="+listid,
			success: function(msg){
			  if(msg!=''){
			  	alert( msg );
			  }
			}
		 });
	}
}
function deleteone(id){
	$("#tr_"+id).remove();
	$.ajax({
		type: "POST",
		url: "delete.php",
		data: "record_id="+id,
		success: function(msg) {
			try {
				var jsonResponse = JSON.parse(msg);
				// Trigger when you delete a record
				$('body').trigger('delete_record', jsonResponse);
			} catch(error) {
				if(msg!='') {
			  		alert( msg );
			  	}
			}
		}
	 });
}

function loadpage(obj){
		$('#listing').load(obj.href);
}
function update_check(obj){
	obj.innerHTML = '<img src="../../resource/images/grid/indicator.gif" border="0">';
	$(obj).load(obj.href + '&checkbox=1');
	return false;
}
function submit_form(event,obj){
   var chCode  = ('charCode' in event) ? event.charCode : event.keyCode;
   var code    = event.which;
   if(code == 13 || chCode == 13){
      $(obj).parents('form').submit();
   }
}