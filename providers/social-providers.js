'use strict'

const utils = require('../core/utils');
const endpoints = require('../core/endpoints');

const ids = {
	Facebook: "facebook.com",
	Google: "google.com",
	Github: "github.com",
	Twitter: "twitter.com"
}

function loginWithProviderID(apiKey, providerToken, providerId, callback){
	if (typeof(callback) !== 'function'){
		throw new Error('No valid callback function defined');
		return;
	}

	if (typeof(providerToken) !== 'string' || providerToken.trim().length === 0){
		callback(utils.invalidArgumentError('providerToken'));
		return;
	}

	if (typeof(providerId) !== 'string' || providerId.trim().length === 0){
		callback(utils.invalidArgumentError('providerId'));
		return;
	}

	providerId = providerId.toLowerCase();
	var allowedProviders = Object.keys(ids).map((key) => ids[key]);
	if (allowedProviders.indexOf(providerId) < 0){
		callback(utils.invalidArgumentError('providerId. ' + providerId + ' not recognized'));
		return;
	}

	var payload = {
		access_token: providerToken,
		providerId: providerId,
		requestUri: "http://localhost",
		returnSecureToken: true,
		returnIdpCredential: true
	}
	var signInEndpoint = endpoints.getSocialIdentityUrl(apiKey);

	endpoints.post(signInEndpoint, payload)
		.then(function (userInfo) {
			var authResult = utils.processFirebaseAuthResult(userInfo);
			callback(null, authResult);
	    })
	    .catch(function (err) {
			console.log(err)
			var error = utils.processFirebaseError(err);
			callback(error);
	    });
}

exports.ids = ids;

exports.loginWithProviderID = loginWithProviderID;

exports.loginWithFacebook = function (apiKey, providerToken, callback){
	loginWithProviderID(apiKey, providerToken, ids.Facebook, callback)
}

exports.loginWithGoogle = function (apiKey, providerToken, callback){
	loginWithProviderID(apiKey, providerToken, ids.Google, callback)
}

exports.loginWithGithub = function (apiKey, providerToken, callback){
	loginWithProviderID(apiKey, providerToken, ids.Github, callback)
}

exports.loginWithTwitter = function (apiKey, providerToken, callback){
	loginWithProviderID(apiKey, providerToken, ids.Twitter, callback)
}