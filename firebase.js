const endpoints = require('./firebase-endpoints');
const rp = require('request-promise');

exports.signInWithEmailAndPassword = function(api_key, email, password, cb){
	if (!email){
		throw new Error('Email is required');
		return;
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
	        cb(err);
	    });
}