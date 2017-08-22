'use strict';

const emailPasswordProvider = require('./providers/email-password-provider');
const socialProviders = require('./providers/social-providers');

function firebaseAuth(apiKey){
	if (typeof(apiKey) !== 'string' || apiKey.trim().lenght === 0)
		throw new Errow('Invalid or missing API Key');

	this.apiKey = apiKey;
}

firebaseAuth.prototype.signInWithEmail = function(email, password, callback) {
	emailPasswordProvider.signIn(this.apiKey, email, password, callback);
};

firebaseAuth.prototype.registerWithEmail = function(email, password, name, photoUrl, callback) {
	emailPasswordProvider.register(this.apiKey, email, password, name, photoUrl, callback);
};

firebaseAuth.prototype.loginWithProviderID = function(providerToken, providerId, callback) {
	socialProviders.loginWithProviderID(this.apiKey, providerToken, providerId, callback);
};

firebaseAuth.prototype.loginWithFacebook = function(providerToken, callback) {
	socialProviders.loginWithFacebook(this.apiKey, providerToken, callback);
};

firebaseAuth.prototype.loginWithGoogle = function(providerToken, callback) {
	socialProviders.loginWithGoogle(this.apiKey, providerToken, callback);
};

firebaseAuth.prototype.loginWithGithub = function(providerToken, callback) {
	socialProviders.loginWithGithub(this.apiKey, providerToken, callback);
};

firebaseAuth.prototype.loginWithTwitter = function(providerToken, callback) {
	socialProviders.loginWithTwitter(this.apiKey, providerToken, callback);
};

module.exports = firebaseAuth;