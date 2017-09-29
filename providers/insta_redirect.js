'use strict';

const insta = require('../core/instagram');

// Instagram OAuth 2 setup
// const credentials = {
//   client: {
//     id: config.instagram.clientId,
//     secret: config.instagram.clientSecret
//   },
//   auth: {
//     tokenHost: 'https://api.instagram.com',
//     tokenPath: '/oauth/access_token'
//   }
// };

var oauth2;
exports.init = function (credentials) {
    oauth2 = require('simple-oauth2').create(credentials);
};

// const OAUTH_REDIRECT_PATH = '/redirect';
// const OAUTH_CALLBACK_PATH = '/instagram-callback';
// const OAUTH_MOBILE_CALLBACK_PATH = '/instagram-mobile-callback';
// const OAUTH_CODE_EXCHANGE_PATH = '/instagram-mobile-exchange-code';

// Custom URI scheme for Android and iOS apps.
// const APP_CUSTOM_SCHEME = 'instagram-sign-in-demo';

// Instagram scopes requested.
// const OAUTH_SCOPES = 'basic';

/**
 * Exchanges a given Instagram auth code passed in the 'code' URL query parameter for a Firebase auth token.
 */
 //d6ae06a0ee134e9ea7c485c449e8d157
exports.processInstagramAuthCode = function(serviceAccount, instagramAuthCode, redirectUri, callback){

  const oauthParams = {
    code: instagramAuthCode,
    redirect_uri: redirectUri
  };

  oauth2.authorizationCode.getToken(oauthParams)
    .then(function (results) {
      console.log('Auth code exchange result received:', results);
      // We have an Instagram access token and the user identity now.
      const instagramUserID = results.user.id;
      const profilePic = results.user.profile_picture;
      const userName = results.user.full_name;

      // Create a Firebase account and get the Custom Auth Token.
      insta.init(serviceAccount);
      insta.logInstagramUserIntoFirebase(instagramUserID, userName, profilePic, callback);
    });
};

/**
 * Passes the auth code to your Mobile application by redirecting to a custom scheme URL. This serves as a fallback in
 * case App Link/Universal Links are not supported on the device.
 * Native Mobile apps should use this callback.
 */
// exports.handleMobileRedirect = function(req, res){
//     res.redirect(APP_CUSTOM_SCHEME + ':/' + OAUTH_CALLBACK_PATH + '?' + req.originalUrl.split + '?' + [1]);
// };

/**
 * Exchanges a given Instagram auth code passed in the 'code' URL query parameter for a Firebase auth token and returns
 * a Firebase Custom Auth token, Instagram access token and user identity as a JSON object.
 * This endpoint is meant to be used by native mobile clients only since no Session Fixation attacks checks are done.
 */
// exports.handleTokenRedirect = function (req, res){
//   console.log('Received auth code:', req.query.code);
//   oauth2.authCode.getToken({
//     code: req.query.code,
//     redirect_uri: req.protocol + '://' + req.get('host') + OAUTH_MOBILE_CALLBACK_PATH
//   }).then(function (results){
//     console.log('Auth code exchange result received:', results);

//     // Create a Firebase Account and get the custom Auth Token.
//     insta.createFirebaseAccount(results.user.id, results.user.full_name, results.user.profile_picture, firebaseToken)
//         .then(function (firebaseToken){
//       // Send the custom token, access token and profile data as a JSON object.
//       res.send(firebaseToken);
//     });
//   });
// };