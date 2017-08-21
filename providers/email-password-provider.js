'use strict';

const utils = require('../core/utils');
const endpoints = require('../core/endpoints');
const validator = require('validator');

exports.register = function(apiKey, email, password, name, photoUrl, callback){
	//search for callback function first
	if (typeof(name) === 'function'){
		callback = name
		name = null;
	}

	if (photoUrl && typeof(photoUrl) === 'function'){
		callback = photoUrl
		photoUrl = null;
	}

	if (typeof(callback) !== 'function'){
		callback('No valid callback function defined');
		return;
	}

	if (!validator.isEmail(email)){
		callback(utils.invalidArgumentError('Email'));
		return;
	}

	if (!validator.isLength(password, {min: 6})){
		callback(utils.invalidArgumentError('Password. Password must be at least 6 characters'));
		return;
	}

	if (photoUrl && !validator.isURL(photoUrl)) {
		callback(utils.invalidArgumentError('Photo Url. Not a valid URL'));
		return;
	}

	if (name && !validator.isLength(name, {min: 2})){
		callback(utils.invalidArgumentError('Name'));
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
			if (name || photoUrl){
				//save name as well before returning to caller
				updateUserProfile(apiKey, name, photoUrl, userInfo.idToken, callback);
			}
			else{
				//no name supplied, return
				callback(null, userInfo);
			}
	    })
	    .catch(function (err) {
			var error = utils.processFirebaseError(err);
			callback(error);
	    });
}

function updateUserProfile(apiKey, name, photoUrl, idToken, callback){
	var payload = {
		idToken: idToken,
		returnSecureToken: true
	}
	if (name)
		payload.displayName = name;

	if (photoUrl)
		payload.photoUrl = photoUrl;

	var updateInfoEndpoint = endpoints.getUpdateAccountInfoUrl(apiKey);
	console.log(updateInfoEndpoint)
	console.log()
	console.log(idToken)

	endpoints.post(updateInfoEndpoint, payload)
		.then(function(updatedUserInfo){
			callback(null, updatedUserInfo)
		})
		.catch(function(err){
			var error = utils.processFirebaseError(err);
			callback(error);
		})
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
		callback('No valid callback function defined');
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
			var error = utils.processFirebaseError(err);
			callback(error);
	    });
}