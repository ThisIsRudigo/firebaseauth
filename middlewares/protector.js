'use strict'

const user = require('../models/firebase-user');
const validator = require('validator');

const ERROR_NO_TOKEN = "ERROR_NO_TOKEN";
const ERROR_INVALID_TOKEN = "ERROR_INVALID_TOKEN";

function protector(serviceAccount, callback) {
	this.admin = require("firebase-admin");
	this.admin.initializeApp({
		credential: this.admin.credential.cert(serviceAccount)
	});

	this.callback = callback;

	var p = this;

	return function(req, res, next) {
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		if (!token){
			if (p.noCallbackRegistered(req, res, next, ERROR_NO_TOKEN))
				res.status(401).json({error: "No token provided"});

			return;
		}

		p.admin.auth().verifyIdToken(token)
			.then(function(decodedToken)
			{
				var info = {
					userId: decodedToken.uid
				}

				p.admin.auth().getUser(info.userId)
					.then(function(userRecord) {
						var userInfo = new user.user_profile(userRecord.toJSON());
						var shouldProceed = p.noCallbackRegistered(req, res, next, null, userInfo);

						if (shouldProceed){
							req.user = userInfo;
							next();
						}
				    })
				    .catch(function(error) {
				    	info.error = error;
				    	var shouldProceed = p.noCallbackRegistered(req, res, next, null, info);

				    	if (shouldProceed){
				    		//user token passed verification but couldn't get user info
				    		res.status(401).json({error: "An error occured while trying to verfiy your credentials"});
				    	}
				    });
			})
			.catch(function(error) {
				if (p.noCallbackRegistered(req, res, next, ERROR_INVALID_TOKEN))
					res.status(401).json({error: "Unauthorized access"});
			})
	}
}

protector.prototype.noCallbackRegistered = function(req, res, next, error, data) {
	// if a callback is registered, call the callback, else return true for no callback registered

	if (this.callback){
		this.callback(req, res, next, error, data);
		return false; //error was handled
	}

	return true;
};

exports.instance = function(serviceAccount, callback){
	if (typeof(serviceAccount) !== 'object' || typeof(serviceAccount.type) !== 'string' || serviceAccount.type !== 'service_account'){
		throw new Error('Invalid first argument: serviceAccount. Expected a firebase service account credential json object');
		return;
	}

	if (callback && typeof(callback) !== 'function'){
		throw new Error('Invalid third argument: callback. Expected a function. If you don\'t want to use a callback, remove the second argument from this method call');
		return;
	}

	return new protector(serviceAccount, callback);
}