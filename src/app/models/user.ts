// user.ts
// Jeremy Campbell
// Model for a user
import "./db";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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

export interface UserData {
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    role: string, 
    password: string,
    salt: string
}

export interface User extends mongoose.Document, UserData { }

export const User = mongoose.model<User>("User", UserSchema);