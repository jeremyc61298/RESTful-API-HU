// auth.ts
// Jeremy Campbell
// Authorization for the API feature
import { Request, Response } from "express";
import util from "util";
import crypto from "crypto";
import * as jwt from "../jwt";
import { User } from "../models/user";
import * as common from "./common";

interface UserPayload extends jwt.Payload {
    preferred_username: string;
}

const pbkdf2P = util.promisify(crypto.pbkdf2);

export function encrypt(password: string, salt: Buffer) : Promise<Buffer> {
    return pbkdf2P(password, salt, 10000, 256, 'sha512');
}

export async function makeToken(req: Request, res: Response) {

}

export async function checkAuthentication(req: Request, res: Response) {
    let user = await User.findOne({ username: req.body.username });
    if (!user) {
        res.status(404).json({ message: "User not found" });
    } else if (!req.body.password) {
        res.json(// Need error here);
    }else if (user.password.equals(await encrypt()))
}