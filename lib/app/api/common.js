"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// api/common.ts
// Jeremy Campbell
// Shared code for the api feature
exports.defaultServerErrorMessage = "Oops! Something went wrong on our end";
exports.defaultUserErrorMessage = "Incorrect data, try again";
var MongooseErrorName;
(function (MongooseErrorName) {
    MongooseErrorName[MongooseErrorName["MongoError"] = 0] = "MongoError";
    MongooseErrorName[MongooseErrorName["ValidatorError"] = 1] = "ValidatorError";
})(MongooseErrorName || (MongooseErrorName = {}));
//# sourceMappingURL=common.js.map