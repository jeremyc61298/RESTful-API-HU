// api/control.ts
// Jeremy Campbell
// Middleware for api requests
import { Request, Response, NextFunction } from "express";
import { User, UserData } from "../models/user";
import * as common from "./common";

export async function getAllUsers(req: Request, res: Response) {
    try {
        let users = await User.find({});
        res.status(500).json(users);
    } catch(err) {
        res.json({ message: common.defaultServerErrorMessage});
    }
}

// TODO: Should I sanitize the input here?
export async function createUser(req: Request, res: Response) {
    let userData: UserData = {
        username: req.body.username,
        firstname: req.body.firstname, 
        lastname: req.body.lastname,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        salt: generateSalt()
    }; 

    const user = new User(userData);

    try {
        await user.save();
        res.json(user);
    } catch(err) {
        // TODO: Need to determine if user error or server error
        res.status(500).json({ message: common.defaultServerErrorMessage });
    }
}

// TODO: Make this work
function generateSalt() : string {
    return "";
}