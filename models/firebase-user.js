'use strict';

function user(firebaseAuthResult) {
	this.email = firebaseAuthResult.email;
	this.displayName = firebaseAuthResult.displayName;
	this.Id = firebaseAuthResult.localId ? firebaseAuthResult.localId : firebaseAuthResult.user_id;
	this.newUser = (firebaseAuthResult.registered === false);
	this.authenticatedWith = "password";
}

function social_user(firebaseAuthResult) {
	this.email = firebaseAuthResult.email;
	this.emailVerified = firebaseAuthResult.emailVerified;
	this.displayName = firebaseAuthResult.displayName;
	this.Id = firebaseAuthResult.localId ? firebaseAuthResult.localId : firebaseAuthResult.user_id;
	this.photoUrl = firebaseAuthResult.photoUrl;
	this.authenticatedWith = firebaseAuthResult.providerId;
	this.socialProfileUrl = firebaseAuthResult.federatedId;
	this.sameCredentialExists = firebaseAuthResult.needConfirmation;
	this.rawUserInfo = firebaseAuthResult.rawUserInfo;
}

function user_profile(firebaseUserInfo){
	this.email = firebaseUserInfo.email;
	this.emailVerified = firebaseUserInfo.emailVerified;
	this.displayName = firebaseUserInfo.displayName ? firebaseUserInfo.displayName : '';
	this.Id = firebaseUserInfo.localId ? firebaseUserInfo.localId : firebaseUserInfo.user_id;
	this.photoUrl = firebaseUserInfo.photoUrl;
	this.passwordUpdatedAt = firebaseUserInfo.passwordUpdatedAt;
	this.tokenValidSince = firebaseUserInfo.validSince;
	this.accountDisabled = (firebaseUserInfo.disabled === true);
	this.lastLoginAt = firebaseUserInfo.lastLoginAt;
	this.accountCreatedAt = firebaseUserInfo.createdAt;
	this.profileUrls = firebaseUserInfo.providerUserInfo.map( function(provider) {
		return { 
			authenticatedWith: provider.providerId,
			profileUrl: provider.federatedId
		};
	});
}

exports.user = user;
exports.social_user = social_user;
exports.user_profile = user_profile;