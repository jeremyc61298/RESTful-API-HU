// api/index.ts
// Jeremy Campbell
// Routing for the RESTful API
import { Router } from "express";
import * as userControl from "./user";
import * as passControl from "./pass";
import { checkAuthentication, checkToken, checkAuthorization } from "./auth";
import { Roles } from "./common";

export const router = Router();

// Authentication 
router.post("/login", checkAuthentication);
router.use(checkToken);

// Users
router.get("/users", 
            userControl.verifyReadAllUsersAccess(Roles.admin, Roles.teacher),
             userControl.getAllUsers);
router.get("/users/:userid", 
            userControl.verifyReadUserAccess(Roles.admin, Roles.teacher), 
            userControl.getUser);
router.post("/users", checkAuthorization(Roles.admin), userControl.createUser);
router.delete("/users/:userid", checkAuthorization(Roles.admin), userControl.deleteUser);
router.put("/users/:userid", checkAuthorization(Roles.admin), userControl.updateUser);

// Password Update
router.post("/password/:userid", passControl.verifyUser, passControl.changePassword);

// Parameter Handlers
router.param("userid", userControl.findUserFromUseridParam);