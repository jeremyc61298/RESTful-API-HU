// class.ts
// Jeremy Campbell
// Model for a class 
import "./db";
import mongoose from "mongoose";
import * as config from "../../config";

const ClassSchema = new mongoose.Schema({
    department: {
        type: String,
        minlength: config.deptStringSize,
        maxlength: config.deptStringSize,
        uppercase: true
    },
    number: {
        type: Number,
        min: 100,
        max: 999,
        validate: { 
            validator: (value: number) => value == Math.floor(value),
            message: '{VALUE} is not a a correct class number'
        }
    },
    title: {
        type: String,
        trim: true,
        maxlength: 200
    },
   
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {
    toJSON: {
        getters: false, 
        virtuals: false,
        transform: (doc, obj, options) => {
            delete obj.__v;
            delete obj.students;
            return obj;
        }
    }
});

export interface ClassData {
    department: string,
    number: number,
    title: string,
    teacher: string,
    students: string
}

export interface Class extends mongoose.Document, ClassData { }

export const Class = mongoose.model<Class>("Class", ClassSchema);