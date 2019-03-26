"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
// Jeremy Campbell
// Entry point for RESTful-API-HU
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const config = __importStar(require("./config"));
const server = http_1.default.createServer(app_1.app);
server.listen(config.portNum, () => {
    console.log(`Listening on port ${config.portNum}`);
});
//# sourceMappingURL=server.js.map