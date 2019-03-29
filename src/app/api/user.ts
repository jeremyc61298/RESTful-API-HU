// api/control.ts
// Jeremy Campbell
// Middleware for api requests
import { Request, Response, NextFunction } from "express";
import crytpo from "crypto";
import { encrypt } from "./auth";
import { User } from "../models/user";
import * as common from "./common";

export async function getAllUsers(req: Request, res: Response) {
    try {
        let users = await User.find({});
        res.json(users);
    } catch(err) {
        common.handleError(err, res);
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
        res.json({ message: "Please provide a password"});
    } else {
        try {
            user.password = await encrypt(req.body.password, user.salt);
            await user.save();
            res.json(user);
        } catch(err) {
            common.handleError(err, res);
        }
    }
}