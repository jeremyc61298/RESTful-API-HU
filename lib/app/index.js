"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app/index.ts
// Jeremy Campbell
// Main application logic for RESTful-API-HU
const config = __importStar(require("../config"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const api_1 = require("./api");
exports.app = express_1.default();
// Logging
exports.app.use(morgan_1.default(config.logType));
exports.app.use(express_1.default.static(process.cwd() + `/${config.staticDir}`));
// API Middileware
exports.app.use("/api", body_parser_1.default.json());
exports.app.use("/api", api_1.router);
//# sourceMappingURL=index.js.map