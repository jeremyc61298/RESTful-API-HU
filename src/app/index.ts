// app/index.ts
// Jeremy Campbell
// Main application logic for RESTful-API-HU
import * as config from "../config";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { router as apiRouter } from "./api";

export const app = express();

// Logging
app.use(morgan(config.logType));

app.use(express.static(process.cwd() + `/${config.staticDir}`));

// API Middileware
app.use("/api", bodyParser.json());
app.use("/api", apiRouter);