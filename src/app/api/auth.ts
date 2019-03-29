// auth.ts
// Jeremy Campbell
// Authorization for the API feature
import { Request, Response, NextFunction } from "express";
import util from "util";
import crypto from "crypto";
import * as jwt from "../jwt";
import { User } from "../models/user";
import { API_Error, ErrorMessage, handleError } from "./common";

interface UserPayload extends jwt.Payload {
    sub: string;
    preferred_username: string;
    role: string;
}

const secret = "spiderman";

const pbkdf2P = util.promisify(crypto.pbkdf2);

export function encrypt(password: string, salt: Buffer) : Promise<Buffer> {
    return pbkdf2P(password, salt, 10000, 256, 'sha512');
}

export async function makeToken(user: User) {
    let token = await jwt.signP<UserPayload>({
        sub: user._id,
        preferred_username: user.username,
        role: user.role
    },
    secret, {
        expiresIn: "1min"
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