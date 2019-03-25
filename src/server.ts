// server.ts
// Jeremy Campbell
// Entry point for RESTful-API-HU
import http from "http";
import { app } from "./app";
import * as config from "./config";

const server = http.createServer(app);

server.listen(config.portNum, () => {
    console.log(`Listening on port ${config.portNum}`);
});
