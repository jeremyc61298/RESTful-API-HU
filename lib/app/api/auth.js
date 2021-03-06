"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("../jwt"));
const config = __importStar(require("../../config"));
const user_1 = require("../models/user");
const common_1 = require("./common");
const secret = "spiderman";
function makeToken(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = yield jwt.signP({
            sub: user._id,
            preferred_username: user.username,
            role: user.role
        }, secret, {
            expiresIn: config.tokenExpireTime
        });
        return token;
    });
}
exports.makeToken = makeToken;
function checkAuthentication(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield user_1.User.findOne({ username: req.body.username });
        if (!user) {
            res.status(404).json(new common_1.API_Error(common_1.ErrorMessage.userNotFound));
        }
        else if (!req.body.password) {
            res.status(400).json(new common_1.API_Error(common_1.ErrorMessage.passwordNeeded));
        }
        else if (user.password.equals(yield common_1.encrypt(req.body.password, user.salt))) {
            // Password is correct
            try {
                let token = yield makeToken(user);
                res.json({
                    login: true,
                    token: token
                });
            }
            catch (err) {
                common_1.handleError(err, res);
            }
        }
        else {
            // Password is incorrect
            res.status(401).json({ login: false });
        }
    });
}
exports.checkAuthentication = checkAuthentication;
// Most of this code was given by Dr. Foust
function checkToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authorizationHeader = req.get("Authorization");
        if (authorizationHeader) {
            const match = authorizationHeader.match(/Bearer\s+(\S+)/i);
            if (match) {
                try {
                    const payload = yield jwt.verifyP(match[1], secret);
                    res.locals.obj_id = payload.sub;
                    res.locals.username = payload.preferred_username;
                    res.locals.role = payload.role;
                    next();
                }
                catch (err) {
                    res.status(401).json(err);
                }
            }
            else {
                res.status(401).json(new common_1.API_Error(common_1.ErrorMessage.incorrectAuthType));
            }
        }
        else {
            res.status(401).json(new common_1.API_Error(common_1.ErrorMessage.noAuthHeader));
        }
    });
}
exports.checkToken = checkToken;
function checkAuthorization(...allowedRoles) {
    return (req, res, next) => {
        if (allowedRoles.includes(res.locals.role)) {
            next();
        }
        else {
            res.status(403).json(new common_1.API_Error(common_1.ErrorMessage.notAuthorized));
        }
    };
}
exports.checkAuthorization = checkAuthorization;
//# sourceMappingURL=auth.js.map