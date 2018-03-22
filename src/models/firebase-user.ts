export class User {
	email: string;
	displayName: string;
	id: string;
	newUser: boolean;
    authenticatedWith: string;

    constructor(firebaseAuthResult: any) {
        this.email = firebaseAuthResult.email;
        this.displayName = firebaseAuthResult.displayName || "";
        this.id = firebaseAuthResult.localId || firebaseAuthResult.user_id || firebaseAuthResult.uid;
        this.newUser = (firebaseAuthResult.registered === false);
        this.authenticatedWith = "password";
    }
}

export class SocialUser extends User {
    emailVerified: boolean;
    photoUrl: string;
    socialProfileUrl: string;
    sameCredentialExists: boolean;
    rawUserInfo: any;

    constructor(firebaseAuthResult: any) {
        super(firebaseAuthResult);
        this.emailVerified = firebaseAuthResult.emailVerified;
        this.photoUrl = firebaseAuthResult.photoUrl;
        this.authenticatedWith = firebaseAuthResult.providerId;
        this.socialProfileUrl = firebaseAuthResult.federatedId;
        this.sameCredentialExists = firebaseAuthResult.needConfirmation;
        this.rawUserInfo = firebaseAuthResult.rawUserInfo;
    }
}

export class UserProfile extends User {
    photoUrl: string;
    emailVerified: boolean;
    accountDisabled: boolean;
    profileUrls: any[];

    constructor(firebaseUserInfo: any) {
        super(firebaseUserInfo);
        this.emailVerified = firebaseUserInfo.emailVerified;
        this.photoUrl = firebaseUserInfo.photoUrl || firebaseUserInfo.photoURL;
        this.accountDisabled = (firebaseUserInfo.disabled === true);

        const providers = firebaseUserInfo.providerUserInfo || firebaseUserInfo.providerData;
        if (providers) {
            this.profileUrls = providers.map((provider: any) => {
                return {
                    authenticatedWith: provider.providerId,
                    profileUrl: provider.federatedId
                };
            });
        }
    }
}