"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../services/database/user");
const app_1 = __importDefault(require("../../config/app"));
const userDataServiceProvider = new user_1.UserDataServiceProvider();
const customError_1 = require("../interfaces/customError");
const verifyTokenHelper_1 = require("../helpers/verifyTokenHelper");
class AuthMiddleware {
    checkAuthHeader(req, res, next) {
        const userIdleTime = req.headers["user-idle-time-in-min"];
        if (userIdleTime &&
            (parseInt(userIdleTime) > app_1.default.app.auto_logout_in_min ||
                userIdleTime == -1)) {
            const respData = {
                success: false,
                message: "Session Timeout",
                errCode: "SESSION_TIMEOUT",
            };
            return res.status(401).json(respData);
        }
        if (!req.headers.authorization) {
            const respData = {
                success: false,
                message: "No Authorization Token",
            };
            return res.status(403).json(respData);
        }
        next();
    }
    async validateAccessToken(req, res, next) {
        try {
            const accessToken = req.headers.authorization || req.body.authorization;
            // Decode JWT received via Header
            const userDetails = jsonwebtoken_1.default.decode(accessToken);
            // Fetch User From DB
            const user = await userDataServiceProvider.userById(userDetails.id);
            const tokenSecret = app_1.default.jwt.token_secret + user.password;
            try {
                // Verify JWT
                jsonwebtoken_1.default.verify(accessToken, tokenSecret);
                // Add User to the Request Payload
                req.user = {
                    user_type: user.user_type,
                    google_id: user.google_id,
                    _id: user._id,
                    email: user.name,
                    user_status: user.user_status,
                    first_name: user.first_name,
                    last_name: user.last_name
                };
                next();
            }
            catch (error) {
                let respData = {
                    success: false,
                    message: error.message,
                    error: error,
                };
                return res.status(401).json(respData);
            }
        }
        catch (error) {
            let respData = {
                success: false,
                message: "Invalid Access Token",
            };
            return res.status(401).json(respData);
        }
    }
    async checkUserStatus(req, res, next) {
        try {
            const user = req.user;
            if (user.user_status === "ACTIVE") {
                return next();
            }
            const err = new customError_1.CustomError();
            if (user.user_status === "ARCHIVED") {
                err.status = 401;
                err.message = "UnAuthorized.Invalid Credentials.";
                err.errorCode = "UNAUTHORIZED";
                throw err;
            }
            err.status = 403;
            err.message = `Forbidden.You Account is on ${user.user_status} status.`;
            err.errorCode = "FORBIDDEN";
            throw err;
        }
        catch (err) {
            return next(err);
        }
    }
    async checkUserByEmail(req, res, next) {
        try {
            const email = req.body.email;
            const user = await userDataServiceProvider.getUserByEmail(email);
            if (!user) {
                throw new customError_1.CustomError(409, "Invalid Username");
            }
            req.user = user;
            return next();
        }
        catch (err) {
            next(err);
        }
    }
    // public async checkUserByEmail(
    //   req: AuthRequest,
    //   res: Response,
    //   next: NextFunction
    // ) {
    //   try {
    //     const email = req.body.email;
    //     const user = await userDataServiceProvider.getUserByEmail(email);
    //     if (!user) {
    //       throw new CustomError(409, "Invalid Email");
    //     }
    //     req.user = user;
    //     return next();
    //   } catch (err) {
    //     next(err);
    //   }
    // }
    async verifyUser(req, res, next) {
        try {
            const token = req.query.authorization;
            if (!token) {
                throw new customError_1.CustomError(401, "Token missing");
            }
            const verifyJWT = (0, verifyTokenHelper_1.verifyToken)(token);
            if (!verifyJWT || verifyJWT == null) {
                throw new customError_1.CustomError(409, "Invalid Token");
            }
            const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
            if (verifyJWT.exp && now > verifyJWT.exp) {
                throw new customError_1.CustomError(401, "Token has expired");
            }
            let userId = verifyJWT.user;
            const user = await userDataServiceProvider.userById(userId);
            if (!user) {
                throw new customError_1.CustomError(409, "Link has been expired");
            }
            req.user = user;
            return next();
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
exports.default = new AuthMiddleware();
//# sourceMappingURL=authMiddleware.js.map