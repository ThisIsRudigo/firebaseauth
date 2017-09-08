'use strict';

const utils = require('../core/utils');
const endpoints = require('../core/endpoints');
const validator = require('validator');
const user = require('../models/firebase-user');

exports.getProfile = function(apiKey, token, callback){
	if (typeof(callback) !== 'function'){
		throw new Error('No valid callback function defined');
		return;
	}

	if (typeof(token) !== 'string' || token.trim().length === 0){
		callback(utils.invalidArgumentError('Token'));
		return;
	}

	var payload = {
		idToken: token
	}

	var accountInfoEndpoint = endpoints.getAccountInfoUrl(apiKey);
	endpoints.post(accountInfoEndpoint, payload)
		.then(function(result){
			var users = result.users.map((firebaseUserResult) => new user.user_profile(firebaseUserResult));
			callback(null, users);
	   	})
	    .catch(function(err){
			var error = utils.processFirebaseError(err);
			callback(error);
		})
};

exports.updateProfile = function(apiKey, token, name, photoUrl, callback){
	if (photoUrl && typeof(photoUrl) === 'function'){
		callback = photoUrl
		photoUrl = null;
	}

	if (typeof(callback) !== 'function'){
		throw new Error('No valid callback function defined');
		return;
	}

	if (typeof(token) !== 'string' || token.trim().length === 0){
		callback(utils.invalidArgumentError('Token'));
		return;
	}

	if (!name || !validator.isLength(name, {min: 2})){
		callback(utils.invalidArgumentError('Name'));
		return;
	}

	if (photoUrl && !validator.isURL(photoUrl)) {
		callback(utils.invalidArgumentError('Photo Url. Not a valid URL'));
		return;
	}

	var payload = {
		idToken: token,
		displayName: name,
		returnSecureToken: true
	}

	if (photoUrl)
		payload.photoUrl = photoUrl;

	var updateInfoEndpoint = endpoints.getUpdateAccountInfoUrl(apiKey);
	endpoints.post(updateInfoEndpoint, payload)
		.then(function(updatedUserInfo){
			var authResult = new user.user_profile(updatedUserInfo);
			callback(null, authResult);
		})
		.catch(function(err){
			var error = utils.processFirebaseError(err);
			callback(error);
		})
}

exports.refreshToken = function(apiKey, refreshToken, callback) {
	if (typeof(callback) !== 'function'){
		throw new Error('No valid callback function defined');
		return;
	}

	if (typeof(refreshToken) !== 'string' || refreshToken.trim().length === 0){
		callback(utils.invalidArgumentError('Refresh Token'));
		return;
	}

	var payload = {
		refreshToken: refreshToken,
		grant_type: "refresh_token"
	}

	var refreshTokenEndpoint = endpoints.getRefreshTokenUrl(apiKey);
	endpoints.post(refreshTokenEndpoint, payload)
		.then(function(userInfo){
			var authResult = utils.processBasicFirebaseAuthResult(userInfo);
			callback(null, authResult);
		})
		.catch(function(err){
			var error = utils.processFirebaseError(err);
			callback(error);
		})
}

exports.deleteAccount = function(apiKey, token, callback) {
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
	}

	var deleteAccountEndpoint = endpoints.getDeleteAccountUrl(apiKey);
	endpoints.post(deleteAccountEndpoint, payload)
		.then(function(userInfo){
			var authResult = ({status: "SUCCESS"});
			callback(null, authResult);
		})
		.catch(function(err){
			var error = utils.processFirebaseError(err);
			callback(error);
		})
}