//use 'strict'

const utils = require('./utils');
utils.init();

const firebase = require('./firebase');

exports.Firebase = function(firebase_api_key){
	this.api_key = firebase_api_key;

	this.signInWithEmailAndPassword = function(email, password, cb){
		firebase.signInWithEmailAndPassword(this.api_key, email, password, cb);
	}
}

//testing
firebase.signInWithEmailAndPassword("AIzaSyC-BTUR_lyKcPxhNPgWWuPOPtE2Xeqgggc", "weezysoft@gmail.com", "password", function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});