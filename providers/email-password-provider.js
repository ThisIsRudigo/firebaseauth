'use strict';

const utils = require('../core/utils');
const endpoints = require('../core/endpoints');
const validator = require('validator');
const account = require('../user/account');
const user = require('../models/firebase-user');

exports.register = function(apiKey, email, password, extras, callback){
	//search for callback function first
	if (typeof(extras) === 'function'){
		callback = extras
		extras = null;
	}

	if (typeof(callback) !== 'function'){
		throw new Error('No valid callback function defined');
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

	var name, photoUrl, requestVerification;

	if (extras){
		var typeOfExtras = typeof(extras);

		if (typeOfExtras === 'string'){
			name = extras;
		}
		else if (typeOfExtras === 'object'){
			name = extras.name;
			photoUrl = extras.photoUrl;
			requestVerification = extras.requestVerification;
		}
		else{
			callback(utils.invalidArgumentError('Extras. Expected an object, found a ' + typeOfExtras));
			return;
		}
	}

	if (name && !validator.isLength(name, {min: 2})){
		callback(utils.invalidArgumentError('Name'));
		return;
	}

	if (photoUrl && !validator.isURL(photoUrl)) {
		callback(utils.invalidArgumentError('Photo Url. Not a valid URL'));
		return;
	}

	if (requestVerification && typeof(requestVerification) !== 'boolean'){
		callback(utils.invalidArgumentError('requestVerification'));
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
			//get token and other basic auth info
			var authResult = utils.processFirebaseAuthResult(userInfo);

			//to send verification email?
			if (requestVerification === true){
				sendVerificationEmail(apiKey, authResult.token, function(err, result){
					//disregard result from send verification email
					completeRegistration(apiKey, name, photoUrl, authResult, callback)
				})
			}
			else{
				completeRegistration(apiKey, name, photoUrl, authResult, callback)
			}
	    })
	    .catch(function (err) {
			var error = utils.processFirebaseError(err);
			callback(error);
	    });
}

function completeRegistration(apiKey, name, photoUrl, authResult, callback){
	if (name || photoUrl){
		//save name as well before returning to caller
		account.updateProfile(apiKey, authResult.token, name, photoUrl, function(err, user){
			authResult.user = user;
			callback(err, authResult); //will return error as well if the profile update failed
		});
	}
	else{
		//no extra info to update
		callback(null, authResult);
	}
}

exports.signIn = function(apiKey, email, password, callback){
	if (typeof(callback) !== 'function'){
		throw new Error('No valid callback function defined');
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

	var payload = {
		email: email,
		password: password,
		returnSecureToken: true
	}
	var signInEndpoint = endpoints.getSignInUrl(apiKey);

	endpoints.post(signInEndpoint, payload)
		.then(function (userInfo) {
			var authResult = utils.processFirebaseAuthResult(userInfo);
			callback(null, authResult);
	    })
	    .catch(function (err) {
			var error = utils.processFirebaseError(err);
			callback(error);
	    });
}

exports.sendVerificationEmail = sendVerificationEmail;
function sendVerificationEmail(apiKey, token, callback){
	if (typeof(callback) !== 'function'){
		throw new Error('No valid callback function defined');
		return;
	}

	if (typeof(token) !== 'string' || token.trim().length === 0){
		callback(utils.invalidArgumentError('Token'));
		return;
	}

	var payload = {
		idToken: token,
		requestType: "VERIFY_EMAIL"
	}
	var sendVerificationEmailEndpoint = endpoints.getsendVerificationEmailUrl(apiKey);

	endpoints.post(sendVerificationEmailEndpoint, payload)
		.then(function (userEmail) {
			var authResult = ({status: "SUCCESS"});
			callback(null, authResult);
	    })
	    .catch(function (err) {
			var error = utils.processFirebaseError(err);
			callback(error);
	    });
}

exports.verifyEmail = function(apiKey, oobCode, callback){
	if (typeof(callback) !== 'function'){
		throw new Error('No valid callback function defined');
		return;
	}

	if (typeof(oobCode) !== 'string'){
		callback(utils.invalidArgumentError('oobCode'));
		return;
	}

	var payload = {
		oobCode: oobCode
	}
	var verifyEmailEndpoint = endpoints.getverifyEmailUrl(apiKey);

	endpoints.post(verifyEmailEndpoint, payload)
		.then(function (userInfo) {
			var authResult = new user.user(userInfo);
			callback(null, authResult);
	    })
	    .catch(function (err) {
			var error = utils.processFirebaseError(err);
			callback(error);
	    });
}

exports.sendPasswordResetEmail = function(apiKey, email, callback){
	if (typeof(callback) !== 'function'){
		throw new Error('No valid callback function defined');
		return;
	}

	if (!validator.isEmail(email)){
		callback(utils.invalidArgumentError('Email'));
		return;
	}

	var payload = {
		email: email,
		requestType: "PASSWORD_RESET"
	}

	var sendPasswordResetEmailEndpoint = endpoints.getsendPasswordResetEmailUrl(apiKey);

	endpoints.post(sendPasswordResetEmailEndpoint, payload)
		.then(function (userEmail) {
			var authResult = ({status: "success" })
			callback(null, authResult);
	    })
	    .catch(function (err) {
			var error = utils.processFirebaseError(err);
			callback(error);
	    });
}

exports.verifyPasswordResetcode = function(apiKey, oobCode, callback){
	if (typeof(callback) !== 'function'){
		throw new Error('No valid callback function defined');
		return;
	}

	if (typeof(oobCode) !== 'string'){
		callback(utils.invalidArgumentError('oobCode'));
		return;
	}

	var payload = {
		oobCode: oobCode
	}
	
	var verifyPasswordResetcodeEndpoint = endpoints.getverifyPasswordResetcodeUrl(apiKey);
	endpoints.post(verifyPasswordResetcodeEndpoint, payload)
		.then(function (userEmail) {
			var authResult = ({verified: true})
			callback(null, authResult);
	    })
	   .catch(function (err) {
			var error = utils.processFirebaseError(err);
			callback(error);
	    });
}

exports.resetPassword = function(apiKey, oobCode, newPassword, callback){
	if (typeof(callback) !== 'function'){
		throw new Error('No valid callback function defined');
		return;
	}

	if (!validator.isLength(newPassword, { min: 6 })) {
		callback(utils.invalidArgumentError('Password. Password must be at least 6 characters'));
		return;
	}

	var payload = {
		oobCode: oobCode,
		newPassword: newPassword
	}

	var resetPasswordEndpoint = endpoints.getresetPasswordUrl(apiKey);

	endpoints.post(resetPasswordEndpoint, payload)
		.then(function (userEmail) {
			var authResult = ({status: "success" })
			callback(null, authResult);
	    })
	    .catch(function (err) {
			var error = utils.processFirebaseError(err);
			callback(error);
	    });
};

exports.changePassword = function(apiKey, token, password, callback){
	if (typeof(callback) !== 'function'){
			throw new Error('No valid callback function defined');
			return;
		}

		var payload = {
			password: password,
			idToken: token,
			returnSecureToken: true
		};

		if (!validator.isLength(password, {min: 6})){
			callback(utils.invalidArgumentError('Password. Password must be at least 6 characters'));
			return;
		}

		var changePasswordEndpoint = endpoints.getchangePasswordUrl(apiKey);
		endpoints.post(changePasswordEndpoint, payload)
			.then(function (userInfo) {
				var authResult = utils.processFirebaseAuthResult(userInfo);
				callback(null, authResult);
	    	})
		    .catch(function (err) {
				var error = utils.processFirebaseError(err);
				callback(error);
		    });

}