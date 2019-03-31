// api/control.ts
// Jeremy Campbell
// Middleware for api requests
import { Request, Response, NextFunction } from "express";
import crytpo from "crypto";
import { User } from "../models/user";
import { API_Error, ErrorMessage, handleError, encrypt, Roles } from "./common";
import * as config from "../../config";

export async function findUserFromUseridParam(req: Request, res: Response, next: NextFunction, userid: string) {
    try {
        if (userid.length == config.objectIdLength) {
            res.locals.user = await User.findById(userid);
        } else {
            res.locals.user = await User.findOne({username: userid});
        }
        next();
    } catch (err) {
        handleError(err, res);
    }
}


export function verifyReadUserAccess(...allowedRoles: Roles[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!allowedRoles.includes(res.locals.role) && res.locals.user.username != res.locals.username) {
            // Only allow the user to read themselves. If they are requesting any other user besides
            // themselves, erase requested user from the response
            res.locals.user = null;
        }
        next();
    }
}

export function verifyReadAllUsersAccess(...allowedRoles: Roles[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!allowedRoles.includes(res.locals.role)) {
            // Only allow the user to read themselves. If they are requesting any other users besides
            // themselves, erase requested users from the response
            res.locals.readUsersQuery = { username: res.locals.username };
        } else {
            res.locals.readUsersQuery = {};
        }
        next();
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {
        console.log(res.locals.readUsersQuery);
        let users = await User.find(res.locals.readUsersQuery);
        res.json(users);
    } catch(err) {
        handleError(err, res);
    }
}

export async function getUser(req: Request, res: Response) {
    if (res.locals.user) {
        res.json(res.locals.user);
    } else {
        res.status(400).json(new API_Error(ErrorMessage.userNotFound));
    }
}


export async function createUser(req: Request, res: Response) {
    let user = new User();
    user.username = req.body.username;
    user.firstname = req.body.firstname; 
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.role = req.body.role;
    user.salt = crytpo.randomBytes(8);

    if (!req.body.password) {
        res.json(new API_Error(ErrorMessage.passwordNeeded));
    } else {
        try {
            user.password = await encrypt(req.body.password, user.salt);
            await user.save();
            res.json(user);
        } catch(err) {
            handleError(err, res);
        }
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        if (res.locals.user) {
            await res.locals.user.remove();
            res.json(res.locals.user);
        } else {
            res.status(400).json(new API_Error(ErrorMessage.userNotFound));
        }
    } catch (err) {
        handleError(err, res);
    }
}

export async function updateUser(req: Request, res: Response) {
    let user = res.locals.user;
    try {
        if (user) {
            user.username = req.body.username || user.username;
            user.firstname = req.body.firstname || user.firstname;
            user.lastname = req.body.lastname || user.lastname;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            await user.save();
            res.json(user);
        } else {
            res.status(400).json(new API_Error(ErrorMessage.userNotFound));
        }
    } catch (err) {
        handleError(err, res);
    }
}