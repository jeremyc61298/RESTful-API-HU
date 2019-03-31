"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const user_1 = require("../models/user");
const common_1 = require("./common");
const config = __importStar(require("../../config"));
function findUserFromUseridParam(req, res, next, userid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (userid.length == config.objectIdLength) {
                res.locals.user = yield user_1.User.findById(userid);
            }
            else {
                res.locals.user = yield user_1.User.findOne({ username: userid });
            }
            next();
        }
        catch (err) {
            common_1.handleError(err, res);
        }
    });
}
exports.findUserFromUseridParam = findUserFromUseridParam;
function verifyReadUserAccess(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(res.locals.role) && res.locals.user.username != res.locals.username) {
            // Only allow the user to read themselves. If they are requesting any other user besides
            // themselves, erase requested user from the response
            res.locals.user = null;
        }
        next();
    };
}
exports.verifyReadUserAccess = verifyReadUserAccess;
function verifyReadAllUsersAccess(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(res.locals.role)) {
            // Only allow the user to read themselves. If they are requesting any other users besides
            // themselves, erase requested users from the response
            res.locals.readUsersQuery = { username: res.locals.username };
        }
        else {
            res.locals.readUsersQuery = {};
        }
        next();
    };
}
exports.verifyReadAllUsersAccess = verifyReadAllUsersAccess;
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(res.locals.readUsersQuery);
            let users = yield user_1.User.find(res.locals.readUsersQuery);
            res.json(users);
        }
        catch (err) {
            common_1.handleError(err, res);
        }
    });
}
exports.getAllUsers = getAllUsers;
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.user) {
            res.json(res.locals.user);
        }
        else {
            res.status(400).json(new common_1.API_Error(common_1.ErrorMessage.userNotFound));
        }
    });
}
exports.getUser = getUser;
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = new user_1.User();
        user.username = req.body.username;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        user.role = req.body.role;
        user.salt = crypto_1.default.randomBytes(8);
        if (!req.body.password) {
            res.json(new common_1.API_Error(common_1.ErrorMessage.passwordNeeded));
        }
        else {
            try {
                user.password = yield common_1.encrypt(req.body.password, user.salt);
                yield user.save();
                res.json(user);
            }
            catch (err) {
                common_1.handleError(err, res);
            }
        }
    });
}
exports.createUser = createUser;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (res.locals.user) {
                yield res.locals.user.remove();
                res.json(res.locals.user);
            }
            else {
                res.status(400).json(new common_1.API_Error(common_1.ErrorMessage.userNotFound));
            }
        }
        catch (err) {
            common_1.handleError(err, res);
        }
    });
}
exports.deleteUser = deleteUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = res.locals.user;
        try {
            if (user) {
                user.username = req.body.username || user.username;
                user.firstname = req.body.firstname || user.firstname;
                user.lastname = req.body.lastname || user.lastname;
                user.email = req.body.email || user.email;
                user.role = req.body.role || user.role;
                yield user.save();
                res.json(user);
            }
            else {
                res.status(400).json(new common_1.API_Error(common_1.ErrorMessage.userNotFound));
            }
        }
        catch (err) {
            common_1.handleError(err, res);
        }
    });
}
exports.updateUser = updateUser;
//# sourceMappingURL=user.js.map