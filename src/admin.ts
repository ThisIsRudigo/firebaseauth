import admin from "firebase-admin";

export const FirebaseAdmin = admin;

declare namespace Admin {

}

class Admin {
    constructor(serviceAccount: any) {
        if (typeof(serviceAccount) !== 'object'
            || typeof(serviceAccount.type) !== 'string'
            || serviceAccount.type !== 'service_account') {
            throw new Error('serviceAccount is not a firebase service account credential json object');
        }

        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    }

    get(): admin {
        return admin;
    }
}

export function changePasswordAsAdmin(serviceAccount: any) {
    if (typeof(serviceAccount) !== 'object'
        || typeof(serviceAccount.type) !== 'string'
        || serviceAccount.type !== 'service_account') {
        throw new Error('serviceAccount is not a firebase service account credential json object');
    }

    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

    admin.auth().updateUser("", { password:  });
}

/*
if (typeof(serviceAccount) !== 'object'
            || typeof(serviceAccount.type) !== 'string'
            || serviceAccount.type !== 'service_account') {
            throw new Error('serviceAccount is not a firebase service account credential json object');
        }

        return admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
 */