// api/common.ts
// Jeremy Campbell
// Shared code for the api feature
import { Response } from "express";

export class API_Error {
    message: ErrorMessage
    
    constructor(message: ErrorMessage) {
        this.message = message;
    }
}

export enum ErrorMessage {
    defaultServer = "Oops! Something went wrong on our end",
    defaultUser = "Incorrect data in request try again",
    passwordNeeded = "Please provide a password"
}

interface MongoError extends Error {
    code: number,
}

export function handleError(err: MongoError, res: Response) {
    if (err.name == "ValidationError" || (err.name == "MongoError" && err.code == 11000)) {
        res.status(400).json(err);
    } else {
        res.status(500).json(new API_Error(ErrorMessage.defaultServer));
    }
}