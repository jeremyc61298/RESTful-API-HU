// api/common.ts
// Jeremy Campbell
// Shared code for the api feature
import { Request, Response, NextFunction } from "express";
import util from "util";
import crypto from "crypto";
import mongoose, { Mongoose } from "mongoose";
import * as config from "../../config";

export enum Roles {
    admin = "admin",
    teacher = "teacher",
    student = "student"
}

// ERRORS

export class API_Error {
    message: ErrorMessage
    
    constructor(message: ErrorMessage) {
        this.message = message;
    }
}

export enum ErrorMessage {
    defaultServer = "Oops! Something went wrong on our end",
    defaultUser = "Incorrect data in request",
    missingParams = "Missing parameters in request",
    passwordNeeded = "Please provide a password",
    userNotFound = "User not found",
    teacherNotFound = "Teacher not found",
    classNotFound = "Class not found",
    incorrectAuthType = "Incorrect authorization type", 
    noAuthHeader = "No authorization header",
    notAuthorized = "Not authorized"
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

export function defaultServerError(err: Error, req: Request, res: Response, next: NextFunction){
    res.json(new API_Error(ErrorMessage.defaultServer));
}

// ENCRYPTION
const pbkdf2P = util.promisify(crypto.pbkdf2);

export function encrypt(password: string, salt: Buffer) : Promise<Buffer> {
    return pbkdf2P(password, salt, 10000, 256, 'sha512');
}

