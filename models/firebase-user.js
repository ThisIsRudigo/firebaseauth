'use strict';

function user(firebaseAuthResult) {
	this.email = firebaseAuthResult.email;
	this.displayName = firebaseAuthResult.displayName;
	this.userId = firebaseAuthResult.localId;
	this.newUser = !firebaseAuthResult.registered;
	this.authenticatedWith = "password";
}

function social_user(firebaseAuthResult) {
	this.email = firebaseAuthResult.email;
	this.emailVerified = firebaseAuthResult.emailVerified;
	this.displayName = firebaseAuthResult.displayName;
	this.userId = firebaseAuthResult.localId;
	this.photoUrl = firebaseAuthResult.photoUrl;
	this.authenticatedWith = firebaseAuthResult.providerId;
	this.socialProfileUrl = firebaseAuthResult.federatedId;
	this.sameCredentialExists = firebaseAuthResult.needConfirmation;
	this.rawUserInfo = firebaseAuthResult.rawUserInfo;
}

exports.user = user;
exports.social_user = social_user;