'use strict';

const utils = require('./utils');
const format = require('string-format');
format.extend(String.prototype);

var endpoints = {
	signInUrl: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key={0}",
	signUpUrl: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key={0}",
	updateAccountInfoUrl: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key={0}",
	identityUrl: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyAssertion?key={0}"
};

/** returns different urls formatted with apikey */
endpoints.getSignInUrl = (apiKey)  => endpoints.signInUrl.format(apiKey);
endpoints.getSignUpUrl = (apiKey)  => endpoints.signUpUrl.format(apiKey);
endpoints.getUpdateAccountInfoUrl = (apiKey)  => endpoints.updateAccountInfoUrl.format(apiKey);

/**make post/get requests */
endpoints.post = function(url, body) {
	return utils.callEndpoint('POST', url, body);
};

module.exports = endpoints;
