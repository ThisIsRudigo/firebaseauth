'use strict';

const emailPasswordProvider = require('./providers/email-password-provider');
const socialProviders = require('./providers/social-providers');
const account = require('./user/account');

function firebaseAuth(apiKey){
	if (typeof(apiKey) !== 'string' || apiKey.trim().length === 0)
		throw new Errow('Invalid or missing API Key');

	this.apiKey = apiKey;
}

firebaseAuth.prototype.protect = function(serviceAccount, callback) {
	var protector = require('./middlewares/protector');
	return protector.instance(serviceAccount, callback);
};

firebaseAuth.prototype.signInWithEmail = function(email, password, callback) {
	emailPasswordProvider.signIn(this.apiKey, email, password, callback);
};

firebaseAuth.prototype.sendVerificationEmail = function(token, callback) {
	emailPasswordProvider.sendVerificationEmail(this.apiKey, token, callback);
};

firebaseAuth.prototype.verifyEmail = function(oobcode, callback) {
	emailPasswordProvider.verifyEmail(this.apiKey, oobcode, callback);
};

firebaseAuth.prototype.sendPasswordResetEmail = function(email, callback) {
	emailPasswordProvider.sendPasswordResetEmail(this.apiKey, email, callback);
};

firebaseAuth.prototype.verifyPasswordResetcode = function(oobcode, callback) {
	emailPasswordProvider.verifyPasswordResetcode(this.apiKey, oobcode, callback);
};

firebaseAuth.prototype.resetPassword = function(oobcode, newPassword, callback) {
	emailPasswordProvider.resetPassword(this.apiKey, oobcode, newPassword, callback);
};

firebaseAuth.prototype.changePassword = function(token, password, callback) {
	emailPasswordProvider.changePassword(this.apiKey, token, password, callback);
};

firebaseAuth.prototype.getProfile = function(token, callback) {
	account.getProfile(this.apiKey, token, callback);
};

firebaseAuth.prototype.updateProfile = function(token, name, photoUrl, callback) {
	account.updateProfile(this.apiKey, token, name, photoUrl, callback);
};

firebaseAuth.prototype.refreshToken = function(refreshToken, callback) {
	account.refreshToken(this.apiKey, refreshToken, callback);
};

firebaseAuth.prototype.deleteAccount = function(token, callback) {
	account.deleteAccount(this.apiKey, token, callback);
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