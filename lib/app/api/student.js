"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
function getStudents(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (res.locals.class) {
                console.log(res.locals.class);
                yield res.locals.class.populate("students").execPopulate();
                let students = res.locals.class.students;
                res.json(students);
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
exports.getStudents = getStudents;
function addStudentToClass(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let c = res.locals.class;
            let student = res.locals.user;
            if (c) {
                if (student) {
                    c.students.push(student);
                    yield c.save();
                    res.json(student);
                }
                else {
                    res.status(404).json(new common_1.API_Error(common_1.ErrorMessage.userNotFound));
                }
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
exports.addStudentToClass = addStudentToClass;
function deleteStudentFromClass(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (res.locals.class) {
                if (res.locals.user) {
                    yield res.locals.class.students.pull({ _id: res.locals.user._id });
                    res.json(res.locals.user);
                }
                else {
                    res.status(404).json(new common_1.API_Error(common_1.ErrorMessage.userNotFound));
                }
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
exports.deleteStudentFromClass = deleteStudentFromClass;
//# sourceMappingURL=student.js.map