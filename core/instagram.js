/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */

var admin;
exports.init = function (serviceAccount) {
  var admin = require("firebase-admin");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://' + serviceAccount.project_id + '.firebaseio.com'
  });
};
// Firebase Setup

exports.logInstagramUserIntoFirebase = function(instagramID, displayName, photoURL, callback) {
  if (!admin){
    callback('Not initialized');
    return;
  }

  // The UID we'll assign to the user.
  const uid = 'instagram:' + instagramID;

  // Create or update the user account.
  var userInfo = {
    displayName: displayName,
    photoURL: photoURL
  };

  updateFirebaseUserOrCreateNewUser(uid, userInfo, function(err){
    if (err)
      callback(err);
    else{
      const token = admin.auth().createCustomToken(uid);
      callback(token);
    }
  });
};

function updateFirebaseUserOrCreateNewUser(uid, userInfo, callback) {
  admin.auth().updateUser(uid, userInfo)
    .then(function(userRecord){
      callback(null);
    })
    .catch(function(error){
      if (error.code === 'auth/user-not-found') {
        createFirebaseUser(uid, userInfo, callback);
      }
      else {
        callback(error);
      }
    });
}

function createFirebaseUser(uid, userInfo, callback){
  userInfo.uid = uid;
  admin.auth().createUser(userInfo)
    .then(function(userRecord){
      callback(null);
    })
    .catch(function(error){
      callback(error);
    })
}