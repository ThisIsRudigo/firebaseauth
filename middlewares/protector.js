'use strict'

const user = require('../models/firebase-user');

const ERROR_NO_TOKEN = "ERROR_NO_TOKEN";
const ERROR_INVALID_TOKEN = "ERROR_INVALID_TOKEN";

function protector(serviceAccount, callback) {
	if (!serviceAccount){
		throw new Error('Please initialize with your firebase service key');
		return;
	}

	if (callback && typeof(callback) !== 'function'){
		throw new Error('Callback is not a function. If you don\'t want to use a callback, remove the second argument from this method call');
		return;
	}

	this.admin = require("firebase-admin");
	this.admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount)
	});

	this.callback = callback;
}

protector.prototype.requireToken = function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (!token){
		if (this.noCallbackRegistered(req, res, next, ERROR_NO_TOKEN))
			res.status(401).json({error: "No token provided"});

		return;
	}

	this.admin.auth().verifyIdToken(token)
		.then(function(decodedToken)
		{
			var info = {
				userId: decodedToken.uid
			}

			this.admin.auth().getUser(info.userId)
				.then(function(userRecord) {
					info.user = new user.user_profile(userRecord.toJSON());
					var shouldProceed = this.noCallbackRegistered(req, res, next, null, info);

					if (shouldProceed){
						req.auth = info;
						next();
					}
			    })
			    .catch(function(error) {
			    	info.error = error;
			    	var shouldProceed = this.noCallbackRegistered(req, res, next, null, info);

			    	if (shouldProceed){
			    		//user token passed verification but couldn't get user info
			    		res.status(401).json({error: "An error occured while trying to verfiy your credentials"});
			    	}
			    });
		})
		.catch(function(error) {
			if (this.noCallbackRegistered(req, res, next, ERROR_INVALID_TOKEN))
				res.status(401).json({error: "Unauthorized access"});
		})
}

protector.prototype.noCallbackRegistered = function(req, res, next, error, data) {
	// if a callback is registered, call the callback, else return true for no callback registered

	if (this.callback){
		this.callback(req, res, next, error, data);
		return false; //error was handled
	}

	return true;
};

module.exports = protector;