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

    signInWithEmail(email: string, password: string, callback: Callback) {
        emailPasswordProvider.signIn(this.apiKey, email, password, callback);
    }

    sendVerificationEmail(token: string, callback: Callback) {
        emailPasswordProvider.sendVerificationEmail(this.apiKey, token, callback);
    }

    verifyEmail(oobcode: string, callback: Callback) {
        emailPasswordProvider.verifyEmail(this.apiKey, oobcode, callback);
    }

    sendPasswordResetEmail(email: string, callback: Callback) {
        emailPasswordProvider.sendPasswordResetEmail(this.apiKey, email, callback);
    }

    verifyPasswordResetcode(oobcode: string, callback: Callback) {
        emailPasswordProvider.verifyPasswordResetCode(this.apiKey, oobcode, callback);
    }

    resetPassword(oobcode: string, newPassword: string, callback: Callback) {
        emailPasswordProvider.resetPassword(this.apiKey, oobcode, newPassword, callback);
    }

    changePassword(token: string, password: string, callback: Callback) {
        emailPasswordProvider.changePassword(this.apiKey, token, password, callback);
    }

    getProfile(token: string, callback: Callback) {
        account.getProfile(this.apiKey, token, callback);
    }

    updateProfile(token: string, name: string, photoUrl: string, callback: Callback) {
        account.updateProfile(this.apiKey, token, name, photoUrl, callback);
    }

    refreshToken(refreshToken: string, callback: Callback) {
        account.refreshToken(this.apiKey, refreshToken, callback);
    }

    registerWithEmail(email: string, password: string, extras: any, callback: Callback) {
        emailPasswordProvider.register(this.apiKey, email, password, extras, callback);
    }

    loginWithFacebook(providerToken: string, callback: Callback) {
        socialProviders.loginWithFacebook(this.apiKey, providerToken, callback);
    }

    linkWithFacebook(idToken: string, providerToken: string, callback: Function) {
        socialProviders.linkWithFacebook(this.apiKey, idToken, providerToken, callback);
    }

    loginWithGoogle(providerToken: string, callback: Callback) {
        socialProviders.loginWithGoogle(this.apiKey, providerToken, callback);
    }

    linkWithGoogle(idToken: string, providerToken: string, callback: Function) {
        socialProviders.linkWithGoogle(this.apiKey, idToken, providerToken, callback);
    }

    loginWithGithub(providerToken: string, callback: Callback) {
        socialProviders.loginWithGithub(this.apiKey, providerToken, callback);
    }

    linkWithGithub(idToken: string, providerToken: string, callback: Function) {
        socialProviders.linkWithGithub(this.apiKey, idToken, providerToken, callback);
    }

    loginWithTwitter(providerToken: string, callback: Callback) {
        socialProviders.loginWithTwitter(this.apiKey, providerToken, callback);
    }

    linkWithTwitter(idToken: string, providerToken: string, callback: Function) {
        socialProviders.linkWithTwitter(this.apiKey, idToken, providerToken, callback);
    }
}

export = FirebaseAuth;