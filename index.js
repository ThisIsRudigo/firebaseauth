'use strict';

const emailPasswordProvider = require('./providers/email-password-provider');

function firebaseAuth(apiKey){
	if (typeof(apiKey) !== 'string' || apiKey.trim().lenght === 0)
		throw new Errow('Invalid or missing API Key');

	this.apiKey = apiKey;
}

firebaseAuth.prototype.signInWithEmail = function(email, password, callback) {
	emailPasswordProvider.signIn(this.apiKey, email, password, callback);
};

module.exports = firebaseAuth;