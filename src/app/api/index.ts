// api/index.ts
// Jeremy Campbell
// Routing for the RESTful API
import { Router } from "express";
import * as userControl from "./user";
import { checkAuthentication, checkToken, checkAuthorization, Roles } from "./auth";

export const router = Router();

// Authentication 
router.post("/login", checkAuthentication);
router.use(checkToken);

// Users
router.get("/users", userControl.getAllUsers);
router.get("/users/:userid", userControl.getUser);
router.post("/users", checkAuthorization(Roles.admin), userControl.createUser);

// Parameter Handlers
router.param("userid", userControl.userIdParam);