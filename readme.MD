Firebase Authentication Library
================================

Firebase authentication library - a node js wrapper around the Firebase REST API. It can generate Firebase auth token based on given email-password combination or OAuth token (issued by Google, Facebook, Twitter or Github). This Firebase token can then be used with REST queries against Firebase Database endpoints or for protecting resources/endpoints on a server.

#Usage
```
$ npm install firebasejs-auth
const FirebaseAuth = require('firebasejs-auth');

var firebase = new FirebaseAuth(process.env.FIREBASE_API_KEY);
```

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
