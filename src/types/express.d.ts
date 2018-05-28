/// <reference types="express" />
import * as express from "express";
import { FirebaseUser } from "../models/firebase-user";

declare module "express" {
    interface Request {
        user: UserTokenRecord;
    }
}

interface UserTokenRecord extends FirebaseUser {
    token: string;
}