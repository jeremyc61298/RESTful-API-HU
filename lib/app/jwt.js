"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// jwt.ts
// Jeremy Campbell
// A simple interface to Json Web Tokens for authorization into the API feature
// Code provided by Dr. Foust
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = __importDefault(require("util"));
exports.signP = util_1.default.promisify(jsonwebtoken_1.default.sign);
exports.verifyP = util_1.default.promisify(jsonwebtoken_1.default.verify);
//# sourceMappingURL=jwt.js.map