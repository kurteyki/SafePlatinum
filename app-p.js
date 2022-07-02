/* function get parameter */
const getParameter = (name)=>{
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results == null ? null : decodeURI(results[1]) || 0;
}	

/* safelink logic */

/* get urlHash from parameter */
const urlHash = getParameter(safeLinkConfig.parameterName);

/* push new url to browser (remove hash parameter) */
history.pushState(null, "", location.href.split("#")[0]);

/* if urlHash exist > show coutndown */
if (urlHash != null){
	/* show and enable button getlink */
	$("#getlink").removeClass('d-none');	
	$("#getlink").prop('disabled',false);				
}else{
	/* remove main safelink */
	$("#main-getlink").remove();
	$("#main-gotolink").remove();
}

/* show coutnDown first but not loading */
let countDown = $("#timer").countdown360({
	radius      : 40,
	seconds     : safeLinkConfig.countDownTimer,
	strokeWidth : 4,
	fontColor   : '#FFF',
	fillStyle   : '#2196f3',
	strokeStyle : '#084e87',
	fontSize    : 24,
	autostart   : false,
	onComplete  : function () { 
		/* remove countdown */
		$('#timer').remove();
		/* show gotolink button */
		$("#gotolink").removeClass('d-none');
		$("#gotolink").prop('disabled',false);

		/* add event after countdown finish > gotolink on click */
		$("#gotolink").on("click",function(){
			/* decode hash */
			var urlHashDecode = aesCrypto.decrypt(trimString(urlHash),trimString(safeLinkConfig.secretKey));

			/* redirect */
			(urlHashDecode) ? window.location.href = urlHashDecode : alert('hash invalid');
			
		});								
	}
})	

/* when getlink click */
var getlinkClick = false;
$("#getlink").on("click", function(){

	/* scroll to gotolink */
	$('html, body').animate({
		scrollTop: eval($("#main-gotolink").offset().top - 100)
	}, 0);

	/* run countDown */
	if (!getlinkClick) {
		countDown.start();

		/* update getLinkClick > prevent double countDown */
		getlinkClick = true;							
	}

})