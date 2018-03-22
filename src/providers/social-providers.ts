import * as utils from "../core/utils";
import Endpoints from "../core/endpoints";

const ids = {
	Facebook: "facebook.com",
	Google: "google.com",
	Github: "github.com",
	Twitter: "twitter.com"
};

function loginWithProviderID(apiKey: string, providerToken: string, providerId: string, callback: Function) {
	if (providerToken.trim().length === 0){
		callback(utils.invalidArgumentError('providerToken'));
		return;
	}

	const payload = {
		postBody: "access_token=" + providerToken + "&providerId=" + providerId,
		requestUri: "http://localhost",
		returnSecureToken: true,
		returnIdpCredential: true
	};

	Endpoints.post(new Endpoints(apiKey).urls.socialIdentityUrl, payload)
		.then((userInfo: any) => callback(null, utils.processFirebaseAuthResult(userInfo)))
	    .catch((err: any) => callback(utils.processFirebaseError(err)));
}

export function loginWithFacebook(apiKey: string, providerToken: string, callback: Function) {
	loginWithProviderID(apiKey, providerToken, ids.Facebook, callback)
}

export function loginWithGoogle(apiKey: string, providerToken: string, callback: Function) {
	loginWithProviderID(apiKey, providerToken, ids.Google, callback)
}

export function loginWithGithub(apiKey: string, providerToken: string, callback: Function) {
	loginWithProviderID(apiKey, providerToken, ids.Github, callback)
}

export function loginWithTwitter(apiKey: string, providerToken: string, callback: Function) {
	loginWithProviderID(apiKey, providerToken, ids.Twitter, callback)
}