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

	if (firebaseUserInfo.localId)
		this.Id = firebaseUserInfo.localId
	else if (firebaseUserInfo.user_id)
		this.Id = firebaseUserInfo.user_id;
	else if (firebaseUserInfo.uid)
		this.Id = firebaseUserInfo.uid;

	this.photoUrl = firebaseUserInfo.photoUrl;
	this.accountDisabled = (firebaseUserInfo.disabled === true);
	var providers = firebaseUserInfo.providerUserInfo || firebaseUserInfo.providerData;
	if (providers){
		this.profileUrls = providers.map( function(provider) {
			return { 
				authenticatedWith: provider.providerId,
				profileUrl: provider.federatedId
			};
		});
	}
}

exports.user = user;
exports.social_user = social_user;
exports.user_profile = user_profile;