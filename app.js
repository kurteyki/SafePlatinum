/* remove space from string */
function trimString(str) {
	return str.replace(/^\s+/, '').replace(/\s+$/, ''); 
}

/* global CryptoJS 
* https://github.com/evgenyneu/aes-crypto-web
*/
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