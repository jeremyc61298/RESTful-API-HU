"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const crypto_1 = __importDefault(require("crypto"));
var Roles;
(function (Roles) {
    Roles["admin"] = "admin";
    Roles["teacher"] = "teacher";
    Roles["student"] = "student";
})(Roles = exports.Roles || (exports.Roles = {}));
// ERRORS
class API_Error {
    constructor(message) {
        this.message = message;
    }
}
exports.API_Error = API_Error;
var ErrorMessage;
(function (ErrorMessage) {
    ErrorMessage["defaultServer"] = "Oops! Something went wrong on our end";
    ErrorMessage["defaultUser"] = "Incorrect data in request";
    ErrorMessage["missingParams"] = "Missing parameters in request";
    ErrorMessage["passwordNeeded"] = "Please provide a password";
    ErrorMessage["userNotFound"] = "User not found";
    ErrorMessage["teacherNotFound"] = "Teacher not found";
    ErrorMessage["classNotFound"] = "Class not found";
    ErrorMessage["incorrectAuthType"] = "Incorrect authorization type";
    ErrorMessage["noAuthHeader"] = "No authorization header";
    ErrorMessage["notAuthorized"] = "Not authorized";
})(ErrorMessage = exports.ErrorMessage || (exports.ErrorMessage = {}));
function handleError(err, res) {
    if (err.name == "ValidationError" || (err.name == "MongoError" && err.code == 11000)) {
        res.status(400).json(err);
    }
    else {
        res.status(500).json(new API_Error(ErrorMessage.defaultServer));
    }
}
exports.handleError = handleError;
function defaultServerError(err, req, res, next) {
    res.json(new API_Error(ErrorMessage.defaultServer));
}
exports.defaultServerError = defaultServerError;
// ENCRYPTION
const pbkdf2P = util_1.default.promisify(crypto_1.default.pbkdf2);
function encrypt(password, salt) {
    return pbkdf2P(password, salt, 10000, 256, 'sha512');
}
exports.encrypt = encrypt;
//# sourceMappingURL=common.js.map