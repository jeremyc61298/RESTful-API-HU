"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultServerError = {
    message: "Oops! Something went wrong on our end"
};
exports.defaultUserErrorMessage = "Incorrect data in request, try again";
function handleError(err, res) {
    if (err.name == "ValidationError" || (err.name == "MongoError" && err.code == 11000)) {
        res.status(400).json(err);
    }
    else {
        res.status(500).json(exports.defaultServerError);
    }
}
exports.handleError = handleError;
//# sourceMappingURL=common.js.map