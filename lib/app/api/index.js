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
const passControl = __importStar(require("./pass"));
const classControl = __importStar(require("./class"));
const studentControl = __importStar(require("./student"));
const auth_1 = require("./auth");
const common_1 = require("./common");
exports.router = express_1.Router();
// Authentication 
exports.router.post("/login", auth_1.checkAuthentication);
exports.router.use(auth_1.checkToken);
// Users
exports.router.get("/users", userControl.verifyReadAllUsersAccess(common_1.Roles.admin, common_1.Roles.teacher), userControl.getAllUsers);
exports.router.get("/users/:userid", userControl.verifyReadUserAccess(common_1.Roles.admin, common_1.Roles.teacher), userControl.getUser);
exports.router.post("/users", auth_1.checkAuthorization(common_1.Roles.admin), userControl.createUser);
exports.router.delete("/users/:userid", auth_1.checkAuthorization(common_1.Roles.admin), userControl.deleteUser);
exports.router.put("/users/:userid", auth_1.checkAuthorization(common_1.Roles.admin), userControl.updateUser);
// Password Update
exports.router.post("/password/:userid", passControl.verifyUser, passControl.changePassword);
// Classes
exports.router.get("/classes", classControl.getAllClasses);
exports.router.get("/classes/:classid", classControl.getClass);
exports.router.post("/classes", auth_1.checkAuthorization(common_1.Roles.admin, common_1.Roles.teacher), classControl.createClass);
exports.router.post("/classes/:classid", auth_1.checkAuthorization(common_1.Roles.admin, common_1.Roles.teacher), classControl.updateClass);
exports.router.delete("/classes/:classid", auth_1.checkAuthorization(common_1.Roles.admin, common_1.Roles.teacher), classControl.deleteClass);
// Classes 
exports.router.get("/rosters/:classid", auth_1.checkAuthorization(common_1.Roles.admin, common_1.Roles.teacher), studentControl.getStudents);
exports.router.post("/rosters/:classid/:userid", auth_1.checkAuthorization(common_1.Roles.admin, common_1.Roles.teacher), studentControl.addStudentToClass);
exports.router.delete("/rosters/:classid/:userid", auth_1.checkAuthorization(common_1.Roles.admin, common_1.Roles.teacher), studentControl.deleteStudentFromClass);
// Parameter Handlers
exports.router.param("userid", userControl.findUserFromIdParam);
exports.router.param("classid", classControl.findClassByIdParam);
// Catch all 
exports.router.use(common_1.defautlUserError);
exports.router.use(common_1.defaultServerError);
//# sourceMappingURL=index.js.map