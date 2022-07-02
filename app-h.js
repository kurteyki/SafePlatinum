$("#form-safelink").on("submit",function(e){
	e.preventDefault();

	/* get input value */
	var url = $("input[name=url]").val();

	/* animation */
	$("#result-safelink").html(`<div class="text-center"><div class="spinner-border text-primary" role="status"></div></div>`);

	/* get feed */
	$.ajax({
		url : '/feeds/posts/summary?alt=json-in-script',
		type: 'get',
		dataType: 'jsonp',
		success: function(data) {
			var link,
			content = data.feed.entry,
			links =new Array();	
			if (content !== undefined) {
				for (var i = 0; i < content.length; i++) {
					for (var j = 0; j < content[i].link.length; j++) {
						if (content[i].link[j].rel == "alternate") {
							link = content[i].link[j].href;
							break;
						}
					}
					links[i] = link;
					var randomIndex = parseInt(Math.random() * links.length);
				}

				var resulthashLink = `${links[randomIndex]}#?${safeLinkConfig.parameterName}=${aesCrypto.encrypt(trimString(url),trimString(safeLinkConfig.secretKey))}`;

				$("#result-safelink").html(`
					<div class="mb-3">
					<input id="resultLink" class="form-control" value="${resulthashLink}" onclick="this.focus();this.select()" readonly="readonly" type="text"/>
					</div>
					<div class="text-center">
					<button id="copyLink" type="button" class="btn btn-primary btn-sm">
					<i class="bi bi-clipboard"></i> Copy Link
					</button>
					</div>
					`);

			}else {
				/* no feed found */
				$("#result-safelink").html(`<div class="alert alert-warning" role="alert">no Post Found, please create Post first and remember feed status must full or summary</div>`);
			}
		},
		error: function() {
			/* fail get feed */
			$("#result-safelink").html('<div class="alert alert-warning" role="alert">fail get Feed, please try again or check your feed !</div>');
		}
	});
});

/* copy button */
$(document).on('click', '#copyLink', function(element){
	$("#resultLink").select();
	document.execCommand("copy");
	$(this).html(`<i class="bi bi-clipboard-check"></i> Link Copied to Clipboard`);
	/* reset text to default */
	setTimeout(function(){
		$("#copyLink").html(`<i class="bi bi-clipboard"></i> Copy Link`);
	},1000);
});