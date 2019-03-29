"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class API_Error {
    constructor(message) {
        this.message = message;
    }
}
exports.API_Error = API_Error;
var ErrorMessage;
(function (ErrorMessage) {
    ErrorMessage["defaultServer"] = "Oops! Something went wrong on our end";
    ErrorMessage["defaultUser"] = "Incorrect data in request try again";
    ErrorMessage["passwordNeeded"] = "Please provide a password";
    ErrorMessage["userNotFound"] = "User not found";
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
//# sourceMappingURL=common.js.map