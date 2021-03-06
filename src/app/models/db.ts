// db.ts
// Jeremy Campbell
// MongoDB Database connection
import mongoose from "mongoose";
import * as config from "../../config";

export const db = mongoose.connect(
    `mongodb://${config.dbHost}/${config.dbName}`,
    { 
        useNewUrlParser: true,
        useCreateIndex: true 
    }
);