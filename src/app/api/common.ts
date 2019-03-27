// api/common.ts
// Jeremy Campbell
// Shared code for the api feature
import { Response } from "express";

export const defaultServerError = {
    message: "Oops! Something went wrong on our end"
}

export const defaultUserErrorMessage = "Incorrect data in request, try again";

interface MongoError extends Error {
    code: number,
}

export function handleError(err: MongoError, res: Response) {
    if (err.name == "ValidationError" || (err.name == "MongoError" && err.code == 11000)) {
        res.status(400).json(err);
    } else {
        res.status(500).json(defaultServerError);
    }
}