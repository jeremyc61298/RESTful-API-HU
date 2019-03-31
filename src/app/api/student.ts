// student.ts
// Jeremy Campbell
import { Request, Response, NextFunction } from "express";
import * as config from "../../config";
import { Class } from "../models/class";
import { User } from "../models/user";
import { Roles, handleError, API_Error, ErrorMessage } from "./common";

export async function getStudents(req: Request, res: Response) {
    try {
        if (res.locals.class) {
            console.log(res.locals.class);
            await res.locals.class.populate("students").execPopulate();
            let students = res.locals.class.students;
            res.json(students);   
        } else {
            res.status(404).json(new API_Error(ErrorMessage.classNotFound));
        }
    } catch (err) {
        handleError(err, res);
    }
}

export async function addStudentToClass(req: Request, res: Response) {
    try {
        let c = res.locals.class;
        let student = res.locals.user;
        if (c) {
            if (student) {
                c.students.push(student);
                await c.save();
                res.json(student);
            } else {
                res.status(404).json(new API_Error(ErrorMessage.userNotFound));
            }
        } else {
            res.status(404).json(new API_Error(ErrorMessage.classNotFound));
        }
    } catch (err) {
        handleError(err, res);
    }
}

export async function deleteStudentFromClass(req: Request, res: Response) {
    try {
        if (res.locals.class) {
            if (res.locals.user) {
                await res.locals.class.students.pull({_id: res.locals.user._id});
                res.json(res.locals.user);
            }else {
                res.status(404).json(new API_Error(ErrorMessage.userNotFound));
            }
        } else {
            res.status(404).json(new API_Error(ErrorMessage.classNotFound));
        }
    } catch (err) {
        handleError(err, res);
    }
}