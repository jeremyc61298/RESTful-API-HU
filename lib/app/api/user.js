"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const crypto_1 = __importDefault(require("crypto"));
const util_1 = __importDefault(require("util"));
const user_1 = require("../models/user");
const common = __importStar(require("./common"));
const pbkdf2P = util_1.default.promisify(crypto_1.default.pbkdf2);
function encrypt(password, salt) {
    return pbkdf2P(password, salt, 10000, 256, 'sha512');
}
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
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = new user_1.User();
        user.username = req.body.username;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        user.role = req.body.role;
        user.salt = crypto_1.default.randomBytes(8);
        if (!req.body.password) {
            res.json({ message: "Please provide a password" });
        }
        else {
            try {
                user.password = yield encrypt(req.body.password, user.salt);
                yield user.save();
                res.json(user);
            }
            catch (err) {
                common.handleError(err, res);
            }
        }
    });
}
exports.createUser = createUser;
//# sourceMappingURL=user.js.map