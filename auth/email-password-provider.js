const endpoints = require('./endpoints');
const rp = require('request-promise');

exports.signIn = function(apiKey, email, password, callback){
	if (!email){
		
	}

	if (!password){
		throw new Error('Password is required');
		return;
	}

	var payload = {
		email: email,
		password: password,
		returnSecureToken: true
	}

	var options = {
	    method: 'POST',
	    uri: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" + api_key,
	    body: payload,
		json: true
	};
	 
	rp(options)
		.then(function (userInfo) {
	        cb(null, userInfo);
	    })
	    .catch(function (err) {
	        cb(err.response);
	    });
}