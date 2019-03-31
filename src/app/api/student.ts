// student.ts
// Jeremy Campbell
// Students are being added to the class, but they are not displaying
// They are not deleting from the class
import { Request, Response, NextFunction } from "express";
import { Roles, handleError, API_Error, ErrorMessage } from "./common";
import { User } from "../models/user";

export async function getStudents(req: Request, res: Response) {
    try {
        if (res.locals.class) {
            res.json(res.locals.class.students);   
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
                let exists = c.students.find((elem: User) => {
                    return elem.username == student.username;
                });
                if (!exists) {
                    // Student not already in class
                    c.students.push(student);
                    await c.save();
                    res.json(student);
                } else {
                    res.status(40).json(new API_Error(ErrorMessage.studentAlreadyInClass));
                }
                
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
                res.locals.class.students.remove(res.locals.user._id);
                await res.locals.class.save();
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