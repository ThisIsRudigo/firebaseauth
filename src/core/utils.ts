import FirebaseError from "../models/firebase-error";
import constants from "./constants";
const rp = require("request-promise");
import { SocialUser, FirebaseUser } from "../models/firebase-user";

export function callEndpoint(method: string, url: string, data?: any, callback?: any){
	const options: any = {
		method: method,
		uri:url
	};

	if (data && method.toLowerCase().trim() === 'post'){
		options.body = data;
		options.json = true;
	}
	 
	if (!callback || typeof(callback) !== 'function')
		return rp(options);

	rp(options).then((data: any) => callback(null, data))
        .catch((error: any) => callback(error));
}

export function invalidArgumentError(argument: string) {
	return new FirebaseError(constants.errorCodes.INVALID_ARGUMENT_ERROR, `Invalid or missing field: ${argument}`);
}

export function processFirebaseAuthResult(firebaseAuthResult: any) {
	const authResult: any = processBasicFirebaseAuthResult(firebaseAuthResult);

	if (firebaseAuthResult.providerId && firebaseAuthResult.providerId.toLowerCase() !== 'password')
		authResult.user = new SocialUser(firebaseAuthResult);
	else
		authResult.user = new FirebaseUser(firebaseAuthResult);

	return authResult;
}

export function processBasicFirebaseAuthResult(firebaseAuthResult: any) {
	const expiresIn = firebaseAuthResult.expiresIn || firebaseAuthResult.expires_in;
    const expiry = (parseInt(expiresIn) - 60) * 1000; // minus 60 seconds for network lag

    return {
        token: firebaseAuthResult.idToken || firebaseAuthResult.id_token,
        expiryMilliseconds: expiry,
        refreshToken: firebaseAuthResult.refreshToken || firebaseAuthResult.refresh_token
    };
}

export function processFirebaseError(error: any) {
	//format for errors from firebase
	//var errorData = new { error = new { code = 0, message = "errorid" } };

	let errorCode = "UNKNOWN_ERROR",
        errorMessage = "Some error occurred",
        originalError = error;

	if (error.error && error.error.message === "invalid access_token, error code 43."){
		errorCode = "INVALID_ACCESS_TOKEN";
		errorMessage = "Invalid access token";
	}
	
	if (error && error.error && error.error.error){
		originalError = error.error.error;

		//valid error from firebase, check for message
		errorCode = error.error.error.message;

		switch (error.error.error.message)
		{
		    //general errors
		    case "CREDENTIAL_TOO_OLD_LOGIN_AGAIN":
		        errorMessage = "You need to login again";
		        break;

		    //possible errors from Third Party Authentication using GoogleIdentityUrl
		    case "INVALID_PROVIDER_ID : Provider Id is not supported.":
		        errorCode = "INVALID_PROVIDER_ID";
		        errorMessage = "Provider Id is not supported";
		        break;
		    case "MISSING_REQUEST_URI":
		        errorMessage = "Invalid request. REquest url is missing";
		        break;
		    case "A system error has occurred - missing or invalid postBody":
		        errorCode = "INVALID_REQUEST_BODY";
		        errorMessage = "Missing or invalid postBody";
		        break;
			case "INVALID_ID_TOKEN":
		    case "invalid access_token, error code 43.":
		        errorCode = "INVALID_ACCESS_TOKEN";
		        errorMessage = "Invalid access token";
		        break;

		    //possible errors from Email/Password Account Signup (via signupNewUser or setAccountInfo) or Signin
		    case "INVALID_EMAIL":
		        errorMessage = "Email address not valid";
		        break;
		    case "MISSING_PASSWORD":
		        errorMessage = "Password not provided";
		        break;

		    //possible errors from Email/Password Account Signup (via signupNewUser or setAccountInfo)
		    case "WEAK_PASSWORD : Password should be at least 6 characters":
		    	errorCode = "WEAK_PASSWORD";
		        errorMessage = "Password should be at least 6 characters";
		        break;
		    case "EMAIL_EXISTS":
		        errorMessage = "A user already exists with this email address";
		        break;

		    //possible errors from Email/Password Signin
		    case "INVALID_PASSWORD":
		        errorMessage = "Password is incorrect";
		        break;
		    case "EMAIL_NOT_FOUND":
		        errorMessage = "No user account exists with that email";
		        break;
		    case "USER_DISABLED":
		        errorMessage = "User account is disabled";
		        break;
		        
		    //possible errors from Account Delete
		    case "USER_NOT_FOUND":
		        errorMessage = "User account does not exist";
		        break;

		    //possible errors from Email/Password Signin or Password Recovery or Email/Password Sign up using setAccountInfo
		    case "MISSING_EMAIL":
		        errorMessage = "Email not provided";
		        break;

		    //possible errors from Password Recovery
		    case "MISSING_REQ_TYPE":
		        errorMessage = "Password recovery type not set";
		        break;

		    //possible errors from email verification and password reset
		    case "INVALID_OOB_CODE":
		        errorMessage = "Code (oobCode) is invalid";
		        break;

		    //possible errors from Getting Linked Accounts
		    case "INVALID_IDENTIFIER":
		        errorMessage = "Unknown or invalid identifier";
		        break;
		    case "MISSING_IDENTIFIER":
		        errorMessage = "Identifier not provided";
		        break;
		    case "FEDERATED_USER_ID_ALREADY_LINKED":
		        errorMessage = "Account has already been linked";
		        break;
		}
	}
	else if (error.error){
		originalError = error.error;
		//not firebase error!

		if (error.error){
			switch (error.error.code){
				//internet error on server or resource not available(?)
				case "ENOENT":
				case "ENOTFOUND":
					errorCode = "NETWORK_NOT_AVAILABLE";
					errorMessage = "Remote host is unreachable";
					break;
			}
		}		
	}

	return new FirebaseError(errorCode, errorMessage, originalError);
}