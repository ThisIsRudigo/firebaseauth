import * as utils from "../core/utils";
import Endpoints from "../core/endpoints";
import * as validator from "validator";
import { updateProfile } from "../user/account";
import { FirebaseUser } from "../models/firebase-user";

export interface FirebaseResponse {
  user: FirebaseUser;
  token: string;
  refreshToken: string;
  expiryMilliseconds: number;
}

export interface Extras {
  name: string;
  photoUrl: string;
  requestVerification: boolean;
}

export function register(apiKey: string, email: string, password: string, extras: string|Extras, callback?: Function): Promise<FirebaseResponse>;
export function register(apiKey: string, email: string, password: string, extras: string|Extras, callback: Function): Promise<FirebaseResponse> | void {
  return new Promise(function (resolve, reject) {

    if (typeof(callback) !== "function") {
      callback = (err: any, res: any) => {
        if (err) return reject(err);
        return resolve(res);
      };
    }

    if (!validator.isEmail(email)) {
      callback(utils.invalidArgumentError("Email"));
      return;
    }

    if (!validator.isLength(password, {min: 6})) {
      callback(utils.invalidArgumentError("Password. Password must be at least 6 characters"));
      return;
    }

    let name: string, photoUrl: string, requestVerification: boolean;

    if (extras) {
      if (typeof(extras) === "string") {
        name = extras;
      }
      else {
        name = extras.name;
        photoUrl = extras.photoUrl;
        requestVerification = extras.requestVerification;
      }
    }

    if (name && !validator.isLength(name, {min: 2})) {
      callback(utils.invalidArgumentError("Name"));
      return;
    }

    if (photoUrl && !validator.isURL(photoUrl)) {
      callback(utils.invalidArgumentError("Photo Url. Not a valid URL"));
      return;
    }

    if (requestVerification && typeof(requestVerification) !== "boolean") {
      callback(utils.invalidArgumentError("requestVerification"));
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
                      () => completeRegistration(apiKey, name, photoUrl, authResult, callback));
        }
        else {
          completeRegistration(apiKey, name, photoUrl, authResult, callback);
        }
        })
        .catch((err: any) => callback(utils.processFirebaseError(err)));

  });
}

function completeRegistration(apiKey: string, name: string, photoUrl: string, authResult: any, callback: Function) {
  if (name || photoUrl) {
    // save name as well before returning to caller
    updateProfile(apiKey, authResult.token, name, photoUrl, (err: any, user: any) => {
      authResult.user = user;
      callback(err, authResult); // will return error as well if the profile update failed
    });
  }
  else {
    // no extra info to update
    callback(undefined, authResult);
  }
}

export function signIn(apiKey: string, email: string, password: string, callback?: Function): Promise<FirebaseResponse>;
export function signIn(apiKey: string, email: string, password: string, callback: Function): Promise<FirebaseResponse> | void {
  return new Promise((resolve, reject) => {
    if (typeof(callback) !== "function") {
      callback = (err: any, res: any) => {
        if (err) return reject(err);
        return resolve(res);
      };
    }

    if (!validator.isEmail(email)) {
      callback(utils.invalidArgumentError("Email"));
      return;
    }

    if (!validator.isLength(password, {min: 6})) {
      callback(utils.invalidArgumentError("Password. Password must be at least 6 characters"));
      return;
    }

    const payload = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    Endpoints.post(Endpoints.urls(apiKey).signInUrl, payload)
      .then((userInfo: any) => callback(undefined, utils.processFirebaseAuthResult(userInfo)))
        .catch((err: any) => callback(utils.processFirebaseError(err)));
  });

}

export function sendVerificationEmail(apiKey: string, token: string, callback?: Function) {
  return new Promise((resolve, reject) => {
    if (typeof(callback) !== "function") {
      callback = (err: any, res: any) => {
        if (err) return reject(err);
        return resolve(res);
      };
    }
    if (token.trim().length === 0) {
      callback(utils.invalidArgumentError("Token"));
      return;
    }

    const payload = {
      idToken: token,
      requestType: "VERIFY_EMAIL"
    };

    Endpoints.post(Endpoints.urls(apiKey).sendVerificationEmailUrl, payload)
      .then(() => callback(undefined, { status: "success" }))
        .catch((err: any) => callback(utils.processFirebaseError(err)));
  });
}

export function verifyEmail(apiKey: string, oobCode: string, callback?: Function) {
  return new Promise((resolve, reject) => {
    if (typeof(callback) !== "function") {
      callback = (err: any, res: any) => {
        if (err) return reject(err);
        return resolve(res);
      };
    }
    const payload = { oobCode: oobCode };

    Endpoints.post(Endpoints.urls(apiKey).verifyEmailUrl, payload)
      .then((userInfo: any) => callback(undefined, new FirebaseUser(userInfo)))
          .catch((err: any) => callback(utils.processFirebaseError(err)));
  });
}

export function sendPasswordResetEmail(apiKey: string, email: string, callback?: Function) {
  return new Promise((resolve, reject) => {
    if (typeof(callback) !== "function") {
      callback = (err: any, res: any) => {
        if (err) return reject(err);
        return resolve(res);
      };
    }
    if (!validator.isEmail(email)) {
      callback(utils.invalidArgumentError("Email"));
      return;
    }

    const payload = {
      email: email,
      requestType: "PASSWORD_RESET"
    };

    Endpoints.post(Endpoints.urls(apiKey).sendPasswordResetEmailUrl, payload)
          .then(() => callback(undefined, { status: "success" }))
          .catch((err: any) => callback(utils.processFirebaseError(err)));
  });
}

export function verifyPasswordResetCode(apiKey: string, oobCode: string, callback?: Function) {
  return new Promise((resolve, reject) => {
    if (typeof(callback) !== "function") {
      callback = (err: any, res: any) => {
        if (err) return reject(err);
        return resolve(res);
      };
    }
    if (typeof(oobCode) !== "string") {
      callback(utils.invalidArgumentError("oobCode"));
      return;
    }

    Endpoints.post(Endpoints.urls(apiKey).verifyPasswordResetcodeUrl, { oobCode: oobCode })
          .then(() => callback(undefined, { verified: true }))
          .catch((err: any) => callback(utils.processFirebaseError(err)));
  });
}

export function resetPassword(apiKey: string, oobCode: string, newPassword: string, callback?: Function) {
  return new Promise((resolve, reject) => {
    if (typeof(callback) !== "function") {
      callback = (err: any, res: any) => {
        if (err) return reject(err);
        return resolve(res);
      };
    }
    if (!validator.isLength(newPassword, { min: 6 })) {
      callback(utils.invalidArgumentError("Password. Password must be at least 6 characters"));
      return;
    }

    const payload = {
      oobCode: oobCode,
      newPassword: newPassword
    };

    Endpoints.post(Endpoints.urls(apiKey).resetPasswordUrl, payload)
          .then(() => callback(undefined, { status: "success" }))
          .catch((err: any) => callback(utils.processFirebaseError(err)));
  });
}

export function changePassword(apiKey: string, token: string, password: string, callback?: Function) {
  return new Promise((resolve, reject) => {
    if (typeof(callback) !== "function") {
      callback = (err: any, res: any) => {
        if (err) return reject(err);
        return resolve(res);
      };
    }
    const payload = {
        password: password,
        idToken: token,
        returnSecureToken: true
    };

    if (!validator.isLength(password, {min: 6})) {
        callback(utils.invalidArgumentError("Password. Password must be at least 6 characters"));
        return;
    }

    Endpoints.post(Endpoints.urls(apiKey).changePasswordUrl, payload)
        .then((userInfo: any) => callback(undefined, utils.processFirebaseAuthResult(userInfo)))
        .catch((err: any) => callback(utils.processFirebaseError(err)));
  });

}
