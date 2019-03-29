// api/index.ts
// Jeremy Campbell
// Routing for the RESTful API
import { Router } from "express";
import * as userControl from "./user";

export const router = Router();

// Authentication 
router.use("/login");

// Users
router.get("/users", userControl.getAllUsers);
router.post("/users", userControl.createUser);