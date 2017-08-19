'use strict';

const utils = require('../core/utils');
const endpoints = require('../core/endpoints');
const validator = require('validator');

exports.register = function(apiKey, email, password, name, callback){
	if (!validator.isEmail(email)){
		callback(utils.invalidArgumentError('Email'));
		return;
	}

	if (!validator.isLength(password, {min: 6})){
		callback(utils.invalidArgumentError('Password. Password must be at least 6 characters'));
		return;
	}

	if (typeof(name) === 'function'){
		callback = name
		delete name;
	}


	if (name && !validator.isLength(name, {min: 2})){
		callback(utils.invalidArgumentError('Name'));
		return;
	}

	if (typeof(callback) !== 'function'){
		callback(utils.invalidArgumentError('Callback'));
		return;
	}

	var payload = {
		email: email,
		password: password,
		returnSecureToken: true
	}
	var registerEndpoint = endpoints.getSignUpUrl(apiKey);

	endpoints.post(registerEndpoint, payload)
		.then(function (userInfo) {
			if (name){
				//save name as well before returning to caller
				payload = {
					displayName: name,
					idToken: userInfo.FirebaseToken,
					returnSecureToken: true
				}
				var updateInfoEndpoint = endpoints.getUpdateAccountInfoUrl(apiKey);

				endpoints.post(registerEndpoint, payload, function(){
					
				})
			}
			else{
				//no name supplied, return
				callback(null, userInfo);
			}
	    })
	    .catch(function (err) {
			var error = utils.processFirebaseError(err.response.body);
			callback(error);
	    });
}

exports.signIn = function(apiKey, email, password, callback){
	if (!validator.isEmail(email)){
		callback(utils.invalidArgumentError('Email'));
		return;
	}

	if (!validator.isLength(password, {min: 6})){
		callback(utils.invalidArgumentError('Password. Password must be at least 6 characters'));
		return;
	}

	if (typeof(callback) !== 'function'){
		callback(utils.invalidArgumentError('Callback'));
		return;
	}

	var payload = {
		email: email,
		password: password,
		returnSecureToken: true
	}
	var signInEndpoint = endpoints.getSignInUrl(apiKey);

	endpoints.post(signInEndpoint, payload)
		.then(function (userInfo) {
			callback(null, userInfo);
	    })
	    .catch(function (err) {
			var error = utils.processFirebaseError(err.response.body);
			callback(error);
	    });
}