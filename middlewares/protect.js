'use strict'

const admin = require("firebase-admin");
var _initialized = false;

// exports.init(serviceKeyPath, databaseURL){
// 	var serviceAccount = require(serviceKeyPath);
// 	admin.initializeApp({
// 	  credential: admin.credential.cert(serviceAccount),
// 	  databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
// 	});
// }

exports.init = function(serviceAccount) {
	admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount)
	});

	_initialized = true;
}

exports.requireToken = function(req, res, next) {
	if (!_initialized){
		throw new Error('Please initialize with your friebase service key before calling requireToken');
		return;
	}
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (!token){
		res.status(401).json({error: "No token provided"});
		return;
	}

	admin.auth().verifyIdToken(token)
		.then(function(decodedToken) {
			req.firebaseUserID = decodedToken.uid;
			next();
		})
		.catch(function(error) {
			res.status(401).json({error: "Unauthorized access"});
		})
}