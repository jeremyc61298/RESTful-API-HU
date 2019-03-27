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
const user_1 = require("../models/user");
const common = __importStar(require("./common"));
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let users = yield user_1.User.find({});
            res.json(users);
        }
        catch (err) {
            common.handleError(err, res);
        }
    });
}
exports.getAllUsers = getAllUsers;
// TODO: Should I sanitize the input here?
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userData = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            role: req.body.role,
            password: req.body.password,
            salt: generateSalt()
        };
        const user = new user_1.User(userData);
        try {
            yield user.save();
            res.json(user);
        }
        catch (err) {
            console.log(err);
            common.handleError(err, res);
        }
    });
}
exports.createUser = createUser;
// TODO: Make this work
function generateSalt() {
    return "";
}
//# sourceMappingURL=user.js.map