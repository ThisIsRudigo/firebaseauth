Firebase Authentication Library for Node JS
===========================================

Firebase authentication library - a node js wrapper around the Firebase REST API. It can generate Firebase auth token based on given email-password combination or OAuth token (issued by Google, Facebook, Twitter or Github). This Firebase token can then be used with REST queries against Firebase Database endpoints or for protecting resources/endpoints on a server.

# Installation and Setup

## Install
```
$ npm install firebaseauth
```

## Setup
```
/***
To use firebase authentication, you need to sign into or register at https://console.firebase.google.com
From the firebase console, create a project or select an existing one
Go to Overview -> Settings icon -> Project settings (General tab) to get your Web API Key

It is best practice to store api keys, secrets and passwords as environment variables
***/

const FirebaseAuth = require('firebaseauth');
var firebase = new FirebaseAuth(process.env.FIREBASE_API_KEY); 
```

# Usage

## Sign in with Email and Password
```
/***
Ensure you have enabled email-password authentication from your firebase console
From the console, go to Authentication (Sign in method tab) and enable Email/Password
***/

firebase.signInWithEmail(email, password, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});
```

## Sign in with token from Facebook
```
/***
Ensure you have enabled Facebook authentication from your firebase console
From the console, go to Authentication (Sign in method tab) and enable Facebook
Follow the instructions at https://firebase.google.com/docs/auth/web/facebook-login (Steps 2 and 3 specifically of the Before you begin section) to properly set up and configure Facebook authentication on your firebase project
***/

firebase.loginWithFacebook(token, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});
```

## Sign in with token from Google
```
/***
Ensure you have enabled authentication with Google from your firebase console
From the console, go to Authentication (Sign in method tab) and enable Google
***/

firebase.loginWithGoogle(token, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});
```

## Sign in with token from Twitter
```
/***
Ensure you have enabled Twitter authentication from your firebase console
From the console, go to Authentication (Sign in method tab) and enable Twitter
Follow the instructions at https://firebase.google.com/docs/auth/web/twitter-login (Steps 2 and 3 specifically of the Before you begin section) to properly set up and configure Twitter authentication on your firebase project
***/

firebase.loginWithTwitter(token, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});
```

## Sign in with token from Github
```
/***
Ensure you have enabled Github authentication from your firebase console
From the console, go to Authentication (Sign in method tab) and enable Github
Follow the instructions at https://firebase.google.com/docs/auth/web/github-auth (Steps 2 and 3 specifically of the Before you begin section) to properly set up and configure Github authentication on your firebase project
***/

firebase.loginWithGithub(token, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});
```

## Register with Email and Password (Name, Photo URL and requireVerification optional)
```
//just email and password signup
firebase.registerWithEmail(email, password, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});

//signup with email, password and name
firebase.registerWithEmail(email, password, name, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});

//signup with email, password and other info
var extras = {
	name: string,
	photoUrl: string (must be a valid url),
	requestVerification: boolean (true or false)
}
firebase.registerWithEmail(email, password, extras, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});
```

## Send Verification Email to user
```
firebase.sendVerificationEmail(token, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});
```

## Verify user with oobCode gotten from verification email
```
firebase.verifyEmail(oobcode, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});
```

## Get user information
```
firebase.getProfile(token, function(err, result){
	if (err)
		console.log(err);
	else{
		console.log(result); //array of connected accounts
		console.log(result[0].profileUrls);
	}
});
```

## Update user information
```
firebase.updateProfile(token, name, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});

firebase.updateProfile(token, name, photoUrl, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});
```

## Send password reset email
```
firebase.sendPasswordResetEmail(email, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});
```

## Verify password reset oobCode
```
firebase.verifyPasswordResetcode(oobCode, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});
```

## Reset password using oobCode gotten from password reset email
```
firebase.resetPassword(oobcode, newPassword, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});
```

## Refresh Firebase Access Token
```
firebase.refreshToken(refreshToken, function(err, result){
	if (err)
		console.log(err);
	else
		console.log(result);
});
```

## Set up resource protector middleware to control access to resouces/endpoints
```
/***
Get service account json from your firebase project console 
From your console, go to Overview -> Settings icon -> Project settings (Service Accounts tab)
**/

//create JSON object from your service account json file
const serviceAccount = require("path/to/serviceAccountKey.json");

/***
Initialize default resource protector
Default behaviour -> 
	all errors return 401 status with body {error: "error description"}
	if token is properly decoded, user info will be saved in req.user
***/
const protector = firebase.protect(serviceAccount);

/***
You can initialize resource protector with a callback
When using callback, remmeber to call next() or respond with an error after processing the information returned to the callback
***/

const protector = firebase.protect(serviceAccount, function(req, res, next, error, data){
	if (error === 'ERROR_NO_TOKEN'){
		//token not supplied
		//handle error case
		res.status(401).json({error: "No token provided"});
	}
	else if (error === 'ERROR_INVALID_TOKEN'){
		//token failed verification
		//handle error case
		res.status(401).json({error: "Unauthorized access"});
	}
	else if (error){
		//some other error (this should never happen!) occurred
		//handle as appropriate
		res.status(500).json({error: "Unexpected error"});
	}
	else if (data.error){
		//there was no error with verifying the token, thus user id can be found in data.userId
		//there was however an error in getting user info from firebase using the id
		res.status(401).json({error: "An error occured while trying to verfiy your credentials"});
	}
	else {
		//data contains user profile information (email, id etc)

		req.user = data;
		next();
	}
});
```

## Protect endpoints with Firebase Access Token and Express
```
var express = require('express');
var app = express();

// to protect all routes below this point
app.use(protector);

// to protect specific endpoints
app.use('/protected-path', protector, function(req, res){
	//req.auth.userId contains firebase user id
	//req.auth.user contains user profile information

	res.send('hello there. your user id is ' + req.user.id);
})
```

# Errors

All errors have the following structure
```
{
    code: any of the error codes below,
    message: human-readable description of the error,
    originalError: original response from firebase
}
```

## Error Codes
```
//general errors
INVALID_ACCESS_TOKEN
CREDENTIAL_TOO_OLD_LOGIN_AGAIN

//possible errors from Third Party Authentication
INVALID_PROVIDER_ID
MISSING_REQUEST_URI
MISSING_REQUEST_URI
INVALID_REQUEST_BODY

//possible errors from Email/Password Account Signup or Signin
INVALID_EMAIL
MISSING_PASSWORD

//possible errors from Email/Password Account Signup
WEAK_PASSWORD
EMAIL_EXISTS

//possible errors from Email/Password Signin
INVALID_PASSWORD
EMAIL_NOT_FOUND
USER_DISABLED

//possible errors from Email/Password Signin or Password Recovery or Email/Password Sign up
MISSING_EMAIL

//possible errors from Password Recovery
MISSING_REQ_TYPE

//possible errors from email verification and password reset
INVALID_OOB_CODE

//possible errors from Getting Linked Accounts
INVALID_IDENTIFIER
MISSING_IDENTIFIER
FEDERATED_USER_ID_ALREADY_LINKED

//possible errors from Account Delete
USER_NOT_FOUND

//errors from protect middleware
ERROR_NO_TOKEN
ERROR_INVALID_TOKEN

//other errors
NETWORK_NOT_AVAILABLE
UNKNOWN_ERROR
```
