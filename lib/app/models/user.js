"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// user.ts
// Jeremy Campbell
// Model for a user
require("./db");
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        match: /^[a-zA-Z\d]([a-zA-Z\d]|[_-][a-zA-Z\d])+$/,
        minlength: 3,
        maxlength: 30,
        unique: true
    },
    firstname: {
        type: String,
        trim: true,
        maxlength: 100
    },
    lastname: {
        type: String,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        match: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    },
    role: {
        type: String,
        enum: ["admin", "teacher", "student"]
    },
    password: {
        type: String
    },
    salt: {
        type: String
    }
}, {
    toJSON: {
        getters: false,
        virtuals: false,
        transform: (doc, obj, options) => {
            delete obj.__v;
            delete obj.password;
            delete obj.salt;
            return obj;
        }
    }
});
exports.User = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=user.js.map