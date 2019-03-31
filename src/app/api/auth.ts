// auth.ts
// Jeremy Campbell
// Authorization for the API feature
import { Request, Response, NextFunction } from "express";
import * as jwt from "../jwt";
import * as config from "../../config";
import { User } from "../models/user";
import { API_Error, ErrorMessage, handleError, Roles, encrypt } from "./common";

interface UserPayload extends jwt.Payload {
    sub: string;
    preferred_username: string;
    role: string;
}

const secret = "spiderman";

export async function makeToken(user: User) {
    let token = await jwt.signP<UserPayload>({
        sub: user._id,
        preferred_username: user.username,
        role: user.role
    },
    secret, {
        expiresIn: config.tokenExpireTime
    });
    return token;
}

export async function checkAuthentication(req: Request, res: Response) {
    let user = await User.findOne({ username: req.body.username });
    if (!user) {
        res.status(404).json(new API_Error(ErrorMessage.userNotFound));
    } else if (!req.body.password) {
        res.status(400).json(new API_Error(ErrorMessage.passwordNeeded));
    } else if (user.password.equals(await encrypt(req.body.password, user.salt))) {
        // Password is correct
        try {
            let token = await makeToken(user);
            res.json({
                login: true,
                token: token
            });
        } catch (err) {
            handleError(err, res);
        }
    } else {
        // Password is incorrect
        res.status(401).json({ login: false });
    }
}

// Most of this code was given by Dr. Foust
export async function checkToken(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.get("Authorization");
    if (authorizationHeader) {
        const match = authorizationHeader.match(/Bearer\s+(\S+)/i);
        if (match) {
            try {
                const payload = await jwt.verifyP<UserPayload>(match[1], secret);
                res.locals.obj_id = payload.sub;
                res.locals.username = payload.preferred_username;
                res.locals.role = payload.role;
                next();
            } catch (err) {
                res.status(401).json(err);
            }
        } else {
            res.status(401).json(new API_Error(ErrorMessage.incorrectAuthType));
        }
    } else {
        res.status(401).json(new API_Error(ErrorMessage.noAuthHeader));
    }
}

export function checkAuthorization(...allowedRoles: Roles[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (allowedRoles.includes(res.locals.role)) {
            next();
        } else {
            res.status(403).json(new API_Error(ErrorMessage.notAuthorized));
        }
    }
}