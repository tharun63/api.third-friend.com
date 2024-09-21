"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessControlMiddleware = void 0;
const customError_1 = require("../interfaces/customError");
class AccessControlMiddleware {
    async isAllowedToAccessUsers(req, res, next) {
        try {
            req.locals = req.locals || {};
            const { user_type: userType } = req.user;
            const allowedUserTypes = ["ADMIN"];
            const isUserNotAllowed = !allowedUserTypes.includes(userType);
            if (isUserNotAllowed) {
                const err = new customError_1.CustomError();
                err.status = 403;
                err.errorCode = "FORBIDDEN";
                err.message = "You are Not Allowed to Access Users.";
                throw err;
            }
            return next();
        }
        catch (err) {
            return next(err);
        }
    }
}
exports.AccessControlMiddleware = AccessControlMiddleware;
//# sourceMappingURL=accessControlMiddleware.js.map