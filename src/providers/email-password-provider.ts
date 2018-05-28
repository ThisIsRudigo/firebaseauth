import * as utils from "../core/utils";
import Endpoints from "../core/endpoints";
import * as validator from "validator";
import { updateProfile } from "../user/account";
import { FirebaseUser } from "../models/firebase-user";

export function register(apiKey: string, email: string, password: string, ...more: any[]) {
    let extras: any, callback: Function;

    //search for callback function first
	if (more.length === 1) {
		callback = more[0];
	}
	else if (more.length === 2) {
	    extras = more[0];
	    callback = more[1];
    }

	if (typeof(callback) !== 'function'){
		throw new Error('No valid callback function defined');
	}

	if (!validator.isEmail(email)) {
		callback(utils.invalidArgumentError('Email'));
		return;
	}

	if (!validator.isLength(password, {min: 6})) {
		callback(utils.invalidArgumentError('Password. Password must be at least 6 characters'));
		return;
	}

	let name: string, photoUrl: string, requestVerification: boolean;

	if (extras) {
		const typeOfExtras = typeof(extras);

		if (typeOfExtras === 'string') {
			name = extras;
		}
		else if (typeOfExtras === 'object') {
			name = extras.name;
			photoUrl = extras.photoUrl;
			requestVerification = extras.requestVerification;
		}
		else {
			callback(utils.invalidArgumentError('Extras. Expected an object, found a ' + typeOfExtras));
			return;
		}
	}

	if (name && !validator.isLength(name, {min: 2})){
		callback(utils.invalidArgumentError('Name'));
		return;
	}

	if (photoUrl && !validator.isURL(photoUrl)) {
		callback(utils.invalidArgumentError('Photo Url. Not a valid URL'));
		return;
	}

	if (requestVerification && typeof(requestVerification) !== 'boolean'){
		callback(utils.invalidArgumentError('requestVerification'));
		return;
	}

	const payload = {
		email: email,
		password: password,
		returnSecureToken: true
	};
	const registerEndpoint = Endpoints.urls(apiKey).signUpUrl;

	Endpoints.post(registerEndpoint, payload)
		.then((userInfo: any) => {
			// get token and other basic auth info
			const authResult = utils.processFirebaseAuthResult(userInfo);

			// to send verification email?
			if (requestVerification === true) {
				sendVerificationEmail(apiKey, authResult.token,
                    () => completeRegistration(apiKey, name, photoUrl, authResult, callback))
			}
			else {
				completeRegistration(apiKey, name, photoUrl, authResult, callback)
			}
	    })
	    .catch((err: any) => callback(utils.processFirebaseError(err)));
}

function completeRegistration(apiKey: string, name: string, photoUrl: string, authResult: any, callback: Function) {
	if (name || photoUrl) {
		// save name as well before returning to caller
		updateProfile(apiKey, authResult.token, name, photoUrl, (err :any, user :any) => {
			authResult.user = user;
			callback(err, authResult); //will return error as well if the profile update failed
		});
	}
	else {
		// no extra info to update
		callback(null, authResult);
	}
}

export function signIn(apiKey: string, email: string, password: string, callback: Function) {
	if (!validator.isEmail(email)) {
		callback(utils.invalidArgumentError('Email'));
		return;
	}

	if (!validator.isLength(password, {min: 6})) {
		callback(utils.invalidArgumentError('Password. Password must be at least 6 characters'));
		return;
	}

	const payload = {
		email: email,
		password: password,
		returnSecureToken: true
	};

	Endpoints.post(Endpoints.urls(apiKey).signInUrl, payload)
		.then((userInfo: any) => callback(null, utils.processFirebaseAuthResult(userInfo)))
	    .catch((err: any) => callback(utils.processFirebaseError(err)));
}

export function sendVerificationEmail(apiKey: string, token: string, callback: Function){
	if (token.trim().length === 0) {
		callback(utils.invalidArgumentError('Token'));
		return;
	}

	const payload = {
		idToken: token,
		requestType: "VERIFY_EMAIL"
	};

	Endpoints.post(Endpoints.urls(apiKey).sendVerificationEmailUrl, payload)
		.then(() => callback(null, { status: "success" }))
	    .catch((err: any) => callback(utils.processFirebaseError(err)));
}

export function verifyEmail(apiKey: string, oobCode: string, callback: Function) {
	const payload = { oobCode: oobCode };

	Endpoints.post(Endpoints.urls(apiKey).verifyEmailUrl, payload)
		.then((userInfo: any) => callback(null, new FirebaseUser(userInfo)))
        .catch((err: any) => callback(utils.processFirebaseError(err)));
}

export function sendPasswordResetEmail(apiKey: string, email: string, callback: Function) {
	if (!validator.isEmail(email)) {
		callback(utils.invalidArgumentError('Email'));
		return;
	}

	const payload = {
		email: email,
		requestType: "PASSWORD_RESET"
	};

	Endpoints.post(Endpoints.urls(apiKey).sendPasswordResetEmailUrl, payload)
        .then(() => callback(null, { status: "success" }))
        .catch((err: any) => callback(utils.processFirebaseError(err)));
}

export function verifyPasswordResetCode(apiKey: string, oobCode: string, callback: Function) {
	if (typeof(oobCode) !== 'string') {
		callback(utils.invalidArgumentError('oobCode'));
		return;
	}

	Endpoints.post(Endpoints.urls(apiKey).verifyPasswordResetcodeUrl, { oobCode: oobCode })
        .then(() => callback(null, { verified: true }))
        .catch((err: any) => callback(utils.processFirebaseError(err)));
}

export function resetPassword(apiKey: string, oobCode: string, newPassword: string, callback: Function) {
	if (!validator.isLength(newPassword, { min: 6 })) {
		callback(utils.invalidArgumentError('Password. Password must be at least 6 characters'));
		return;
	}

	const payload = {
		oobCode: oobCode,
		newPassword: newPassword
	};

	Endpoints.post(Endpoints.urls(apiKey).resetPasswordUrl, payload)
        .then(() => callback(null, { status: "success" }))
        .catch((err: any) => callback(utils.processFirebaseError(err)));

}

export function changePassword(apiKey: string, token: string, password: string, callback: Function) {
    const payload = {
        password: password,
        idToken: token,
        returnSecureToken: true
    };

    if (!validator.isLength(password, {min: 6})){
        callback(utils.invalidArgumentError('Password. Password must be at least 6 characters'));
        return;
    }

    Endpoints.post(Endpoints.urls(apiKey).changePasswordUrl, payload)
        .then((userInfo: any) => callback(null, utils.processFirebaseAuthResult(userInfo)))
        .catch((err: any) => callback(utils.processFirebaseError(err)));

}