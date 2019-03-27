// class.ts
// Jeremy Campbell
// Model for a class 
import "./db";
import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
    department: {
        type: String,
        minlength: 4,
        maxlength: 4,
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
    // TODO: Need to be able  to validate if user is a teacher or a student
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    student: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    }
});

export interface ClassData {
    department: number,
    number: number,
    title: string,
    // TODO: Not sure if these should be mongoose object id's or strings
    teacher: mongoose.Schema.Types.ObjectId,
    student: mongoose.Schema.Types.ObjectId
}

export interface Class extends mongoose.Document, ClassData { }

export const Class = mongoose.model<Class>("Class", ClassSchema);