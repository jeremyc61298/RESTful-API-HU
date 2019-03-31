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
// TODO: This needs to change to allow the userid to be an objectid or username
function verifyUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = res.locals.user;
            if (!user) {
                res.json(new common_1.API_Error(common_1.ErrorMessage.userNotFound));
            }
            else {
                if (res.locals.role != common_1.Roles.admin) {
                    console.log(user.role);
                    if (req.body.current &&
                        req.body.password &&
                        user.password.equals(yield common_1.encrypt(req.body.current, user.salt))) {
                        // Update their password if they are not logged in as an admin but supplied
                        // their correct current password
                        next();
                    }
                    else {
                        res.status(400).json({ updated: false });
                    }
                }
                else {
                    // Update their password if they are logged in as an admin
                    next();
                }
            }
        }
        catch (err) {
            common_1.handleError(err, res);
        }
    });
}
exports.verifyUser = verifyUser;
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.locals.user.password = yield common_1.encrypt(req.body.password, res.locals.user.salt);
            yield res.locals.user.save();
            res.json({ updated: true });
        }
        catch (err) {
            common_1.handleError(err, res);
        }
    });
}
exports.changePassword = changePassword;
//# sourceMappingURL=pass.js.map