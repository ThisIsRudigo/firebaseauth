import * as admin from "firebase-admin";
import {UserProfile} from "../models/firebase-user";

const ERROR_NO_TOKEN = "ERROR_NO_TOKEN";
const ERROR_INVALID_TOKEN = "ERROR_INVALID_TOKEN";
const ERROR_RETRIEVE_USER_INFO = "ERROR_RETRIEVE_USER_INFO";

export type GuardCallback = (req: any, res: any, next: Function, error: any, data?: any) => void;
export interface GuardOptions {
	userIdOnly: boolean;
	tokenField: string;
}

export default class Guard {
    private callback: GuardCallback;
    private options: GuardOptions;

    constructor(serviceAccount: any);
    constructor(serviceAccount: any, options: GuardOptions);
    constructor(serviceAccount: any, callback: GuardCallback);
	constructor(serviceAccount: any, options: GuardOptions, callback: GuardCallback);
    constructor(serviceAccount: any, optionsOrCallback?: any, callback?: GuardCallback) {
        if (typeof(serviceAccount) !== 'object'
			|| typeof(serviceAccount.type) !== 'string'
			|| serviceAccount.type !== 'service_account') {
            throw new Error('serviceAccount is not a firebase service account credential json object');
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        if (!callback && optionsOrCallback instanceof Function) {
            this.callback = optionsOrCallback;
        }
        else if (optionsOrCallback instanceof Object) {
        	this.options = optionsOrCallback;
		}

		if (!!callback) {
        	this.callback = callback;
		}

		if (!this.options) {
            this.options = {
                tokenField: "token",
                userIdOnly: true
            };
        }
	}

	middleware(req: any, res: any, next: Function) {
		const token = req.headers[this.options.tokenField] || req.body[this.options.tokenField] || req.query[this.options.tokenField];
        if (!token) {
        	this.callback ? this.callback(req, res, next, ERROR_NO_TOKEN) : res.status(401).json({error: "No token provided"});
            return;
        }

        admin.auth().verifyIdToken(token)
            .then((decodedToken) => {
                const info: any = { userId: decodedToken.uid };
                if (this.options.userIdOnly) {
                	if (this.callback) {
                		this.callback(req, res, next, undefined, info);
					}
					else {
                        res.user = info;
                        next();
					}
				}
				else {
                	this.fetchUserInfo(info.userId, req, res, next);
				}
            })
            .catch((error) => {
            	if (this.callback) {
            		this.callback(req, res, next, ERROR_INVALID_TOKEN);
				}
				else {
                    res.status(401).json({
						message: "Unauthorized",
						error: error
                    });
				}
            })
	}

	private fetchUserInfo(userId: string, req: any, res: any, next: Function) {
        admin.auth().getUser(userId)
            .then(function(userRecord) {
                const userInfo = new UserProfile(userRecord.toJSON());
                if (this.callback) {
                	this.callback(req, res, next, undefined, userInfo);
				}
				else {
                    req.user = userInfo;
                    next();
				}
            })
            .catch(function(error) {
            	if (this.callback) {
            		this.callback(req, res, next, ERROR_RETRIEVE_USER_INFO, { userId: userId, error: error });
				}
				else {
                    res.status(401).json({error: "An error occurred while trying to load your account info"});
				}
            });
	}
}