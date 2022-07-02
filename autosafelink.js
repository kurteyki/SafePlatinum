/* remove space from string */
function trimString(str) {
	return str.replace(/^\s+/, '').replace(/\s+$/, ''); 
}

/* global CryptoJS */
var aesCrypto = {};

(function (obj) {
	'use strict';

	obj.formatter = {
		prefix: '',
		stringify: function (params) {
			var str = this.prefix;
			str += params.salt.toString();
			str += params.ciphertext.toString();
			return str;
		},
		parse: function (str) {
			var params = CryptoJS.lib.CipherParams.create({}),
			prefixLen = this.prefix.length;

			if (str.indexOf(this.prefix) !== 0) { return params; }

			params.ciphertext = CryptoJS.enc.Hex.parse(str.substring(16 + prefixLen));
			params.salt = CryptoJS.enc.Hex.parse(str.substring(prefixLen, 16 + prefixLen));
			return params;
		}
	};

	obj.encrypt = function (text, password) {
		try {
			return CryptoJS.AES.encrypt(text, password, { format: obj.formatter }).toString();
		} catch (err) { return ''; }
	};

	obj.decrypt = function (text, password) {
		try {
			var decrypted = CryptoJS.AES.decrypt(text, password, { format: obj.formatter });
			return decrypted.toString(CryptoJS.enc.Utf8);
		} catch (err) { return ''; }
	};
}(aesCrypto));

/* load crpyo js */
let scriptCrptoJS = document.createElement('script');
scriptCrptoJS.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
document.getElementsByTagName('head')[0].appendChild(scriptCrptoJS);
scriptCrptoJS.onload = function() {

	/* get blogger feed */
	function jsonp(url, callback) {
		var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
		window[callbackName] = function(data) {
			delete window[callbackName];
			document.body.removeChild(script);
			callback(data);
		};

		var script = document.createElement('script');
		script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
		document.body.appendChild(script);
	}

	jsonp(`https://www.blogger.com/feeds/${autoSafeLink.safeLinkConfig.blogId}/posts/default?alt=json-in-script&amp;max-results=15`, function(datajson) {

		let postLinks = [];
		var countPost = datajson.feed.openSearch$totalResults.$t;
		for(var i = 0; i < countPost; i++) {
			let postUrl;
			for (var s = 0; s < datajson.feed.entry[i].link.length; s++) {
				if(datajson.feed.entry[i].link[s].rel == 'alternate') {
					postUrl = datajson.feed.entry[i].link[s].href;
					break;
				}
			}
			postLinks[i] = postUrl;
		}

		/* replace link helper */
		const getDomainName = (url) => {
			var hostname;
			if (url.indexOf("://") > -1) {hostname = url.split('/')[2];}
			else {hostname = url.split('/')[0];}
			hostname = hostname.split(':')[0];
			hostname = hostname.split('?')[0];
			return hostname;
		}

		/* replace links */
		const tagLinks = document.getElementsByTagName("a");
		for (var i = 0; i < tagLinks.length; i++) {

			/* build linkException & onlyThisLink */
			let linkExceptionExtract = autoSafeLink.linkException.split(','),
			linkExceptionStatus = true,
			onlyThisLinkExtract = autoSafeLink.onlyThisLink.split(','),
			onlyThisLinkStatus = false;

			/* check onyThisExtract first > if nothing LinkException will work */
			if (onlyThisLinkExtract.length < 1) {   
				linkExceptionStatus = false; 				
				/* check linkException */
				for (var no = 0; no < linkExceptionExtract.length; no++) {
					if (getDomainName(tagLinks[i].href).match(getDomainName(linkExceptionExtract[no]))) {
						linkExceptionStatus = true
						break;
					}
				}
				/* skip if exception found */
				if (linkExceptionStatus) {continue;};
			}

			/* check onlyThisLink */
			for (var no = 0; no < onlyThisLinkExtract.length; no++) {
				if (getDomainName(tagLinks[i].href).match(getDomainName(onlyThisLinkExtract[no]))) {
					onlyThisLinkStatus = true
					break;
				}
			}			

			if (linkExceptionStatus == false || onlyThisLinkStatus == true) {	
				let randomIndex = parseInt(Math.random() * postLinks.length); 
				tagLinks[i].href = `${postLinks[randomIndex]}#?${autoSafeLink.safeLinkConfig.parameterName}=${aesCrypto.encrypt(trimString(tagLinks[i].href), trimString(autoSafeLink.safeLinkConfig.secretKey))}`
				tagLinks[i].target = "_blank";
			}

		}

	});    

};