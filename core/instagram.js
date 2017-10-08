/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */

  var admin = require("firebase-admin");
  exports.init = function (serviceAccount) {
    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://' + serviceAccount.project_id + '.firebaseio.com'
  });
};

exports.logInstagramUserIntoFirebase = function(instagramID, displayName, photoURL, callback) {
  if (!admin){
    callback('Not initialized');
    return;
  }

  // The UID we'll assign to the user.
  const uid = 'instagram:' + instagramID;
  console.log('this is the user uid: ', uid)

  // Create or update the user account.
  var userInfo = {
    displayName: displayName,
    photoURL: photoURL
  };
  console.log('this is the user info: ', userInfo)

  updateFirebaseUserOrCreateNewUser(uid, userInfo, function(err){
    if (err){
    console.log('this is the UPDATE ERROR: ', err)
    callback(err);
    return;
    }
    else{
      const token = admin.auth().createCustomToken(uid);
      console.log('this is the your TOKEN: ', token)
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

// function createCustomToken(uid, callback){
//     uid = uid;
//     admin.auth().createCustomToken(uid)
//        .then(function(token){
//           console.log('this is the your TOKEN: ', token)
//           callback(token);
//         })
//         .catch(function(error){
//                       console.log('this is the user error: ', error)

//           callback(error);
//         })
// }
// }