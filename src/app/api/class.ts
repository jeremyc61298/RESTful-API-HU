// api/class.ts
// Jeremy Campbell
// Middleware for api requests that deal with classes
// Note, I use the populate method on the teacher, however it is still showing the _id
import { Request, Response, NextFunction } from "express";
import * as config from "../../config";
import { Class } from "../models/class";
import { User } from "../models/user";
import { Roles, handleError, API_Error, ErrorMessage } from "./common";

export async function getAllClasses(req: Request, res: Response) {
    try {
        let classes = await Class.find().populate("teacher", "firstname lastname email");
        res.json(classes);
    } catch (err) {
        handleError(err, res);
    }
}

function splitClassString(c: string): {dept: string | null; num: number | null;} {
    if (c.length != config.classStringSize) {
        return { dept: null, num: null };
    } 
    let dept = c.substr(0, config.deptStringSize).toUpperCase();
    let num = Number(c.substr(config.deptStringSize, config.classNumSize));
    return {dept: dept, num: num};
}

export async function findClassByIdParam(req: Request, res: Response, next: NextFunction, classid: string) {
    try {
        if (classid.length == config.objectIdLength) {
            let c = await Class.findById(classid)
                                        .populate("teacher", "firstname lastname email")
                                        .populate("students");
        } else {
            let c = splitClassString(classid);
            if (c.dept && c.num) {
                res.locals.class = await Class.findOne({department: c.dept, number: c.num})
                                                .populate("teacher", "firstname lastname email")
                                                .populate("students");
            }
        }
        next();
    } catch (err) {
        handleError(err, res);
    }
}

export function getClass(req: Request, res: Response) {
    if (res.locals.class) {
        res.json(res.locals.class);
    } else {
        res.status(404).json(new API_Error(ErrorMessage.classNotFound));
    }
}

export async function createClass(req: Request, res: Response) {
    try {
        let teacher = await linkTeacher(req);
        if (teacher) {
            let c = new Class();
            c.department = req.body.department;
            c.number = req.body.number;
            c.title = req.body.title;
            c.teacher = teacher._id; 
            await c.save();
            res.json(c);
        } else {
            res.status(404).json(new API_Error(ErrorMessage.teacherNotFound));
        }
    } catch(err) {
        handleError(err, res);
    }
}

async function linkTeacher(req: Request) {
    let teacherid = req.body.teacher;
    let teacher: User | null = null;
    if (teacherid) {
        if (teacherid.length == config.objectIdLength) {
            teacher = await User.findById(teacherid);
        } else {
            teacher = await User.findOne({username: teacherid});
        }
        if (!teacher || teacher.role != Roles.teacher) {
            teacher = null;
        } 
    }
    return teacher;
}

export async function updateClass(req: Request, res: Response) {
    let c = res.locals.class;
    try {
        if (c) {
            c.department = req.body.department || c.department;
            c.number = req.body.number || c.number;
            c.title = req.body.title || c.title;
            c.teacher = await linkTeacher(req) || c.teacher;
            await c.save();
            res.json(c);
        } else {
            res.status(404).json(new API_Error(ErrorMessage.classNotFound));
        }
    } catch (err) {
        handleError(err, res);
    }
}

export async function deleteClass(req: Request, res: Response) {
    try {
        if (res.locals.class) {
            await res.locals.class.remove();
            res.json(res.locals.class);
        } else {
            res.status(404).json(new API_Error(ErrorMessage.classNotFound));
        }
    } catch (err) {
        handleError(err, res);
    }
}