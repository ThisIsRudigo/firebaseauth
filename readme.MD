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
const FirebaseAuth = require('firebaseauth');
var firebase = new FirebaseAuth(process.env.FIREBASE_API_KEY);
```

# Usage

## Sign in with Email and Password
```
firebase.signInWithEmail(email, password, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});
```

## Sign in with token from Facebook
```
firebase.loginWithFacebook(token, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});
```

## Sign in with token from Google
```
firebase.loginWithGoogle(token, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});
```

## Sign in with token from Twitter
```
firebase.loginWithTwitter(token, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});
```

## Sign in with token from Github
```
firebase.loginWithGithub(token, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});
```

## Register with Email and Password (Name and Photo URL optional)
```
firebase.registerWithEmail(email, password, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});

firebase.registerWithEmail(email, password, name, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});

firebase.registerWithEmail(email, password, name, photoUrl, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});
```

## Send Verification Email to user
```
firebase.sendVerificationEmail(token, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});
```

## Verify user with oobCode gotten from verification email
```
firebase.verifyEmail(oobcode, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});
```

## Get user information
```
firebase.getProfile(token, function(err, authData){
	if (err)
		console.log(err);
	else{
		console.log(authData);
		console.log(authData[0].profileUrls);
	}
});
```

## Update user information
```
firebase.updateProfile(token, name, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});

firebase.updateProfile(token, name, photoUrl, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});
```

## Send password reset email
```
firebase.sendPasswordResetEmail(email, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});
```

## Reset password using oobCode gotten from password reset email
```
firebase.resetPassword(oobcode, newPassword, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});
```

## Refresh Firebase Access Token
```
firebase.refreshToken(refreshToken, function(err, authData){
	if (err)
		console.log(err);
	else
		console.log(authData);
});
```

## Set up resource protector middleware to control access to resouces/endpoints
```
// get service account json and dataaseURL from your firebase project console (Overview -> Settings -> Service Accounts)
// also check here for more configuration details https://stackoverflow.com/a/40900411
const serviceAccount = require("path/to/serviceAccountKey.json");
const databaseURL = "https://test-projects-1273.firebaseio.com";

// initialize default resource protector
const protector = firebase.protect(serviceAccount);

// or initialize resource protector with callback
// when using callback, remmeber to call next() or respond with an error after processing the information returned to the callback
const protector = firebase.protect(serviceAccount, function(req, res, next, error, data){
	if (error === 'ERROR_NO_TOKEN'){
		//token not supplied
		//handle error case
	}
	else if (error === 'ERROR_INVALID_TOKEN'){
		//token failed verification
		//handle error case
	}
	else if (error){
		//some other error (this should never happen!) occurred
		//handle as appropriate
	}
	else if (data.error){
		//there was no error with verifying the token, thus user id can be found in data.userId
		//there was however an error in getting user info from firebase using the id
	}
	else {
		//data contains user profile information (email, id etc)

		//do your stuff
		req.user = data;

		//REMEMBER TO CALL NEXT WHEN DONE
		next();
	}
});
```

## Protect endpoints with Firebase Access Token and Express
```
var express = require('express');
var app = express();

// to protect all routes below this point
app.use(protect);

// to protect specific endpoints
app.use('/protected-path', protect, function(req, res){
	//req.auth.userId contains firebase user id
	//req.auth.user contains user profile information

	res.send('hello there. your user id is ' + req.user.id);
})
```

# Errors

All authentication errors have the following structure
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
