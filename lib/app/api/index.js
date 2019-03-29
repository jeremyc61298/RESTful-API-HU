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
const auth_1 = require("./auth");
exports.router = express_1.Router();
// Authentication 
exports.router.post("/login", auth_1.checkAuthentication);
exports.router.use(auth_1.checkToken);
// Users
exports.router.get("/users", userControl.getAllUsers);
exports.router.post("/users", auth_1.checkAuthorization(auth_1.Roles.admin), userControl.createUser);
//# sourceMappingURL=index.js.map