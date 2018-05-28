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

	Endpoints.post(Endpoints.urls(apiKey).socialIdentityUrl, payload)
		.then((userInfo: any) => callback(null, utils.processFirebaseAuthResult(userInfo)))
	    .catch((err: any) => callback(utils.processFirebaseError(err)));
}

function linkWithProviderID(apiKey: string, idToken: string, providerToken: string, providerId: string, callback: Function) {
    if (providerToken.trim().length === 0) {
        callback(utils.invalidArgumentError('providerToken'));
        return;
    }

    const payload = {
        idToken: idToken,
        postBody: "access_token=" + providerToken + "&providerId=" + providerId,
        requestUri: "http://localhost",
        returnSecureToken: true,
        returnIdpCredential: true
    };

    Endpoints.post(Endpoints.urls(apiKey).socialIdentityUrl, payload)
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

export function linkWithFacebook(apiKey: string, idToken: string, providerToken: string, callback: Function) {
    linkWithProviderID(apiKey, idToken, providerToken, ids.Facebook, callback)
}

export function linkWithGoogle(apiKey: string, idToken: string, providerToken: string, callback: Function) {
    linkWithProviderID(apiKey, idToken, providerToken, ids.Google, callback)
}

export function linkWithGithub(apiKey: string, idToken: string, providerToken: string, callback: Function) {
    linkWithProviderID(apiKey, idToken, providerToken, ids.Github, callback)
}

export function linkWithTwitter(apiKey: string, idToken: string, providerToken: string, callback: Function) {
    linkWithProviderID(apiKey, idToken, providerToken, ids.Twitter, callback)
}