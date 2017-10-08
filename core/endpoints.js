'use strict';

const utils = require('./utils');
const format = require('string-format');
format.extend(String.prototype);

var endpoints = {
	signInUrl: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key={0}",
	signUpUrl: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key={0}",
	sendVerificationEmailUrl: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key={0}",
	verifyEmailUrl: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key={0}",
	sendPasswordResetEmailUrl: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key={0}",
	deleteAccountUrl: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount?key={0}",
	resetPasswordUrl: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/resetPassword?key={0}",
	changePasswordUrl: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key={0}",
	accountInfoUrl:"https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key={0}",
	refreshTokenUrl: "https://securetoken.googleapis.com/v1/token?key={0}",
	updateAccountInfoUrl: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key={0}",
	socialIdentityUrl: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyAssertion?key={0}"
};

/** returns different urls formatted with apikey */
endpoints.getSignInUrl = (apiKey)  => endpoints.signInUrl.format(apiKey);
endpoints.getSignUpUrl = (apiKey)  => endpoints.signUpUrl.format(apiKey);
endpoints.getsendVerificationEmailUrl = (apiKey) => endpoints.sendVerificationEmailUrl.format(apiKey);
endpoints.getverifyEmailUrl = (apiKey) => endpoints.verifyEmailUrl.format(apiKey);
endpoints.getsendPasswordResetEmailUrl = (apiKey) => endpoints.sendPasswordResetEmailUrl.format(apiKey);
endpoints.getDeleteAccountUrl = (apiKey) => endpoints.deleteAccountUrl.format(apiKey);
endpoints.getresetPasswordUrl = (apiKey) => endpoints.resetPasswordUrl.format(apiKey);
endpoints.getchangePasswordUrl = (apiKey) => endpoints.changePasswordUrl.format(apiKey);
endpoints.getAccountInfoUrl = (apiKey)  => endpoints.accountInfoUrl.format(apiKey);
endpoints.getRefreshTokenUrl = (apiKey)  => endpoints.refreshTokenUrl.format(apiKey);
endpoints.getUpdateAccountInfoUrl = (apiKey)  => endpoints.updateAccountInfoUrl.format(apiKey);
endpoints.getSocialIdentityUrl = (apiKey)  => endpoints.socialIdentityUrl.format(apiKey);

/**make post/get requests */
endpoints.post = function(url, body) {
	return utils.callEndpoint('POST', url, body);
};

module.exports = endpoints;
