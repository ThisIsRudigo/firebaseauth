import * as utils from "./utils";

export default class EndPoints {
    static urls = (apiKey: string) => {
        return {
            signInUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${apiKey}`,
            signUpUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${apiKey}`,
            sendVerificationEmailUrl:
                `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=${apiKey}`,
            verifyEmailUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=${apiKey}`,
            sendPasswordResetEmailUrl:
                `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=${apiKey}`,
            verifyPasswordResetcodeUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/resetPassword?key=${apiKey}`,
            resetPasswordUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/resetPassword?key=${apiKey}`,
            changePasswordUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=${apiKey}`,
            accountInfoUrl:`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${apiKey}`,
            refreshTokenUrl: `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
            updateAccountInfoUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/setAccountInfo?key=${apiKey}`,
            socialIdentityUrl: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyAssertion?key=${apiKey}`
        }
    };

    static post(url: string, body: any) {
        return utils.callEndpoint('POST', url, body);
    }
}