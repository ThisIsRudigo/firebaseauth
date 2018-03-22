export default class FirebaseError {
	code: string;
	message: string;
	originalError?: any;

	constructor(code: string, message: string, originalError?: any) {
        this.code = code;
        this.message = message;
        this.originalError = originalError;
    }
}