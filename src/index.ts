/// <reference path="./types/express.d.ts" />

import * as emailPasswordProvider from "./providers/email-password-provider";
import * as socialProviders from "./providers/social-providers";
import * as account from "./user/account";
import { Callback } from "./types";
import { Guard, GuardCallback, GuardOptions } from "./middlewares/guard";
import { RequestHandler } from "express";

class FirebaseAuth {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    static initTokenMiddleware(serviceAccount: any): RequestHandler;
    static initTokenMiddleware(serviceAccount: any, options: GuardOptions): RequestHandler;
    static initTokenMiddleware(serviceAccount: any, callback: GuardCallback): RequestHandler;
    static initTokenMiddleware(serviceAccount: any, options: GuardOptions, callback: GuardCallback): RequestHandler;
    static initTokenMiddleware(serviceAccount: any, optionsOrCallback?: any, callback?: GuardCallback): RequestHandler {
        return new Guard(serviceAccount, optionsOrCallback, callback).middleware;
    }

    signInWithEmail(email: string, password: string, callback?: Callback) {
        return emailPasswordProvider.signIn(this.apiKey, email, password, callback);
    }

    sendVerificationEmail(token: string, callback?: Callback) {
        return emailPasswordProvider.sendVerificationEmail(this.apiKey, token, callback);
    }

    verifyEmail(oobcode: string, callback?: Callback) {
        return emailPasswordProvider.verifyEmail(this.apiKey, oobcode, callback);
    }

    sendPasswordResetEmail(email: string, callback?: Callback) {
        return emailPasswordProvider.sendPasswordResetEmail(this.apiKey, email, callback);
    }

    verifyPasswordResetcode(oobcode: string, callback?: Callback) {
        return emailPasswordProvider.verifyPasswordResetCode(this.apiKey, oobcode, callback);
    }

    resetPassword(oobcode: string, newPassword: string, callback?: Callback) {
        return emailPasswordProvider.resetPassword(this.apiKey, oobcode, newPassword, callback);
    }

    changePassword(token: string, password: string, callback?: Callback) {
        return emailPasswordProvider.changePassword(this.apiKey, token, password, callback);
    }

    getProfile(token: string, callback?: Callback) {
        return account.getProfile(this.apiKey, token, callback);
    }

    updateProfile(token: string, name: string, photoUrl: string, callback?: Callback) {
        return account.updateProfile(this.apiKey, token, name, photoUrl, callback);
    }

    refreshToken(refreshToken: string, callback?: Callback) {
        return account.refreshToken(this.apiKey, refreshToken, callback);
    }

    registerWithEmail(email: string, password: string, extras: any, callback?: Callback) {
        return emailPasswordProvider.register(this.apiKey, email, password, extras, callback);
    }

    loginWithFacebook(providerToken: string, callback?: Callback) {
        return socialProviders.loginWithFacebook(this.apiKey, providerToken, callback);
    }

    linkWithFacebook(idToken: string, providerToken: string, callback?: Function) {
        return socialProviders.linkWithFacebook(this.apiKey, idToken, providerToken, callback);
    }

    loginWithGoogle(providerToken: string, callback?: Callback) {
        return socialProviders.loginWithGoogle(this.apiKey, providerToken, callback);
    }

    linkWithGoogle(idToken: string, providerToken: string, callback?: Function) {
        return socialProviders.linkWithGoogle(this.apiKey, idToken, providerToken, callback);
    }

    loginWithGithub(providerToken: string, callback?: Callback) {
        return socialProviders.loginWithGithub(this.apiKey, providerToken, callback);
    }

    linkWithGithub(idToken: string, providerToken: string, callback?: Function) {
        return socialProviders.linkWithGithub(this.apiKey, idToken, providerToken, callback);
    }

    loginWithTwitter(providerToken: string, callback?: Callback) {
        return socialProviders.loginWithTwitter(this.apiKey, providerToken, callback);
    }

    linkWithTwitter(idToken: string, providerToken: string, callback?: Function) {
        return socialProviders.linkWithTwitter(this.apiKey, idToken, providerToken, callback);
    }
}

export = FirebaseAuth;
