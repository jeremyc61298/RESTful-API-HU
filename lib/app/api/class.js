"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = __importStar(require("../../config"));
const class_1 = require("../models/class");
const user_1 = require("../models/user");
const common_1 = require("./common");
function getAllClasses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let classes = yield class_1.Class.find().populate("teacher", "firstname lastname email");
            res.json(classes);
        }
        catch (err) {
            common_1.handleError(err, res);
        }
    });
}
exports.getAllClasses = getAllClasses;
function splitClassString(c) {
    if (c.length != config.classStringSize) {
        return { dept: null, num: null };
    }
    let dept = c.substr(0, config.deptStringSize).toUpperCase();
    let num = Number(c.substr(config.deptStringSize, config.classNumSize));
    return { dept: dept, num: num };
}
function findClassByIdParam(req, res, next, classid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (classid.length == config.objectIdLength) {
                res.locals.class = yield class_1.Class.findById(classid).populate("teacher", "firstname lastname email");
            }
            else {
                let c = splitClassString(classid);
                if (c.dept && c.num) {
                    res.locals.class = yield class_1.Class.findOne({ department: c.dept, number: c.num })
                        .populate("teacher", "firstname lastname email");
                }
            }
            next();
        }
        catch (err) {
            common_1.handleError(err, res);
        }
    });
}
exports.findClassByIdParam = findClassByIdParam;
function getClass(req, res) {
    if (res.locals.class) {
        res.json(res.locals.class);
    }
    else {
        res.status(404).json(new common_1.API_Error(common_1.ErrorMessage.classNotFound));
    }
}
exports.getClass = getClass;
function createClass(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let teacher = yield linkTeacher(req);
            if (teacher) {
                let c = new class_1.Class();
                c.department = req.body.department;
                c.number = req.body.number;
                c.title = req.body.title;
                c.teacher = teacher._id;
                yield c.save();
                res.json(c);
            }
            else {
                res.status(404).json(new common_1.API_Error(common_1.ErrorMessage.teacherNotFound));
            }
        }
        catch (err) {
            common_1.handleError(err, res);
        }
    });
}
exports.createClass = createClass;
function linkTeacher(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let teacherid = req.body.teacher;
        let teacher = null;
        if (teacherid) {
            if (teacherid.length == config.objectIdLength) {
                teacher = yield user_1.User.findById(teacherid);
            }
            else {
                teacher = yield user_1.User.findOne({ username: teacherid });
            }
            if (!teacher || teacher.role != common_1.Roles.teacher) {
                teacher = null;
            }
        }
        return teacher;
    });
}
function updateClass(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let c = res.locals.class;
        try {
            if (c) {
                c.department = req.body.department || c.department;
                c.number = req.body.number || c.number;
                c.title = req.body.title || c.title;
                c.teacher = (yield linkTeacher(req)) || c.teacher;
                yield c.save();
                res.json(c);
            }
            else {
                res.status(404).json(new common_1.API_Error(common_1.ErrorMessage.classNotFound));
            }
        }
        catch (err) {
            common_1.handleError(err, res);
        }
    });
}
exports.updateClass = updateClass;
function deleteClass(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (res.locals.class) {
                yield res.locals.class.remove();
                res.json(res.locals.class);
            }
            else {
                res.status(404).json(new common_1.API_Error(common_1.ErrorMessage.classNotFound));
            }
        }
        catch (err) {
            common_1.handleError(err, res);
        }
    });
}
exports.deleteClass = deleteClass;
//# sourceMappingURL=class.js.map