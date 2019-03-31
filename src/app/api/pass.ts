// pass.ts
// Jeremy Campbell
// Middleware for updating a users password
import { Request, Response, NextFunction } from "express";
import {API_Error, ErrorMessage, handleError, Roles, encrypt } from "./common";

// TODO: This needs to change to allow the userid to be an objectid or username
export async function verifyUser(req: Request, res: Response, next: NextFunction) {   
    try {
        let user = res.locals.user;
        if (!user) {
            res.status(404).json(new API_Error(ErrorMessage.userNotFound));
        } else  {
            if (res.locals.role != Roles.admin) {
                if (req.body.current && 
                    req.body.password &&
                    user.password.equals(await encrypt(req.body.current, user.salt))) {
                    // Update their password if they are not logged in as an admin but supplied
                    // their correct current password
                    next();
                } else {
                    res.status(400).json({updated: false});
                }
            } else {
                // Update their password if they are logged in as an admin
                next();
            }
        }
    } catch (err) {
        handleError(err, res);
    }
}

export async function changePassword(req: Request, res: Response) {
    try {
        res.locals.user.password = await encrypt(req.body.password, res.locals.user.salt);
        await res.locals.user.save();
        res.json({updated: true});
    } catch (err) {
        handleError(err, res);
    }
}