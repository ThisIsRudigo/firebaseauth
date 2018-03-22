import * as utils from "./utils";

export default class EndPoints {
    private apiKey: string;
    urls = {
        signInUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${this.apiKey}`,
        signUpUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${this.apiKey}`,
        sendVerificationEmailUrl:
            `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=${this.apiKey}`,
        verifyEmailUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=${this.apiKey}`,
        sendPasswordResetEmailUrl:
            `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=${this.apiKey}`,
        verifyPasswordResetcodeUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/resetPassword?key=${this.apiKey}`,
        resetPasswordUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/resetPassword?key=${this.apiKey}`,
        changePasswordUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=${this.apiKey}`,
        accountInfoUrl:`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${this.apiKey}`,
        refreshTokenUrl: `https://securetoken.googleapis.com/v1/token?key=${this.apiKey}`,
        updateAccountInfoUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=${this.apiKey}`,
        socialIdentityUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyAssertion?key=${this.apiKey}`
    };

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    static post(url: string, body: any) {
        return utils.callEndpoint('POST', url, body);
    }
}