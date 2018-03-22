import * as emailPasswordProvider from "./providers/email-password-provider";
import * as socialProviders from "./providers/social-providers";
import * as account from "./user/account";

export type Callback = (error: any, result: any) => void;

export default class FirebaseAuth {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
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

    loginWithGoogle(providerToken: string, callback: Callback) {
        socialProviders.loginWithGoogle(this.apiKey, providerToken, callback);
    }

    loginWithGithub(providerToken: string, callback: Callback) {
        socialProviders.loginWithGithub(this.apiKey, providerToken, callback);
    }

    loginWithTwitter(providerToken: string, callback: Callback) {
        socialProviders.loginWithTwitter(this.apiKey, providerToken, callback);
    }
}