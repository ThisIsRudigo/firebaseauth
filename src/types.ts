import FirebaseError from "./models/firebase-error";

export type Callback = (error: FirebaseError, result: any) => void;