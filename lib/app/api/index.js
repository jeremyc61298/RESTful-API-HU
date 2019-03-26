"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// api/index.ts
// Jeremy Campbell
// Routing for the RESTful API
const express_1 = require("express");
const userControl = __importStar(require("./user"));
exports.router = express_1.Router();
exports.router.get("/users", userControl.getAllUsers);
//# sourceMappingURL=index.js.map