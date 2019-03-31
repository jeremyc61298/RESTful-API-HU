"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// class.ts
// Jeremy Campbell
// Model for a class 
require("./db");
const mongoose_1 = __importDefault(require("mongoose"));
const config = __importStar(require("../../config"));
const ClassSchema = new mongoose_1.default.Schema({
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
            validator: (value) => value == Math.floor(value),
            message: '{VALUE} is not a a correct class number'
        }
    },
    title: {
        type: String,
        trim: true,
        maxlength: 200
    },
    teacher: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    students: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.Class = mongoose_1.default.model("Class", ClassSchema);
//# sourceMappingURL=class.js.map