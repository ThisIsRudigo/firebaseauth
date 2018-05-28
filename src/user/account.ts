import * as utils from "../core/utils";
import Endpoints from "../core/endpoints";
import * as validator from "validator";
import { UserProfile } from "../models/firebase-user";

export function getProfile(apiKey: string, token: string, callback: Function) {
	if (token.trim().length === 0) {
		callback(utils.invalidArgumentError('Token'));
		return;
	}

	const payload = { idToken: token };

    Endpoints.post(Endpoints.urls(apiKey).accountInfoUrl, payload)
		.then((result: any) => {
			const users = result.users.map((firebaseUserResult: any) => new UserProfile(firebaseUserResult));
			callback(null, users);
	   	})
	    .catch((err: any) => {
			callback(utils.processFirebaseError(err));
		})
}

export function updateProfile(apiKey: string, token: string, name: string, ...more: any[]) {
    let photoUrl: string;
    let callback: Function;

	if (more.length === 1) {
	    // expect callback
        callback = more[0];
    }
    else if (more.length === 2) {
	    photoUrl = more[0];
	    callback = more[1];
    }

	if (typeof(callback) !== 'function'){
		throw new Error('No valid callback function defined');
	}

	if (token.trim().length === 0) {
		callback(utils.invalidArgumentError('Token'));
		return;
	}

	if (!validator.isLength(name, {min: 2})) {
		callback(utils.invalidArgumentError('Name'));
		return;
	}

	if (photoUrl && !validator.isURL(photoUrl)) {
		callback(utils.invalidArgumentError('Photo Url. Not a valid URL'));
		return;
	}

	const payload: any = {
		idToken: token,
		displayName: name,
		returnSecureToken: true
	};

	if (photoUrl)
		payload.photoUrl = photoUrl;

	Endpoints.post(Endpoints.urls(apiKey).updateAccountInfoUrl, payload)
		.then((updatedUserInfo: any) => callback(null, new UserProfile(updatedUserInfo)))
		.catch((err: any) => utils.processFirebaseError(err));
}

export function refreshToken(apiKey: string, refreshToken: string, callback: Function) {
    if (refreshToken.trim().length === 0) {
		callback(utils.invalidArgumentError('Refresh Token'));
		return;
	}

	const payload = {
		refreshToken: refreshToken,
		grant_type: "refresh_token"
	};

	const refreshTokenEndpoint = Endpoints.urls(apiKey).refreshTokenUrl;
	Endpoints.post(refreshTokenEndpoint, payload)
		.then((userInfo: any) => callback(null, utils.processBasicFirebaseAuthResult(userInfo)))
		.catch((err: any) => callback(utils.processFirebaseError(err)));
}