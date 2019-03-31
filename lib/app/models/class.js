"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// class.ts
// Jeremy Campbell
// Model for a class 
require("./db");
const mongoose_1 = __importDefault(require("mongoose"));
const ClassSchema = new mongoose_1.default.Schema({
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
    student: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "User"
    }
});
exports.Class = mongoose_1.default.model("Class", ClassSchema);
//# sourceMappingURL=class.js.map