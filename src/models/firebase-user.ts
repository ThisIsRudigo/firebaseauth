export class FirebaseUser {
	email: string;
	displayName: string;
	id: string;
	newUser: boolean;
    authenticatedWith: string;
    emailVerified: boolean;
    photoUrl: string;
    socialProfileUrl: string;
    sameCredentialExists: boolean;
    rawUserInfo: any;
    accountDisabled: boolean;
    profileUrls: any[];

    constructor(firebaseAuthResult: any) {
        this.email = firebaseAuthResult.email;
        this.displayName = firebaseAuthResult.displayName || "";
        this.photoUrl = firebaseAuthResult.photoUrl || "";
        this.id = firebaseAuthResult.localId || firebaseAuthResult.user_id || firebaseAuthResult.uid;
        this.newUser = (firebaseAuthResult.registered === false);
        this.authenticatedWith = "password";
    }
}

export class SocialUser extends FirebaseUser {
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

export class UserProfile extends FirebaseUser {
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