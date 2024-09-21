"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthController = void 0;
const googleOAuthServiceProvider_1 = __importDefault(require("../services/googleOAuthServiceProvider"));
const user_1 = require("../services/database/user");
const customError_1 = require("../interfaces/customError");
const appHelpers_1 = require("../helpers/appHelpers");
const userDataServiceProvider = new user_1.UserDataServiceProvider();
class GoogleAuthController {
    async googleAuth(req, res, next) {
        try {
            const url = googleOAuthServiceProvider_1.default.generateAuthUrl();
            return res.redirect(url);
        }
        catch (error) {
            console.error({ error });
            const err = new customError_1.CustomError();
            err.status = 500;
            err.message = 'Failed to generate Google OAuth URL';
            return next(err);
        }
    }
    async googleAuthCallback(req, res, next) {
        try {
            const { code } = req.query;
            if (!code) {
                const err = new customError_1.CustomError();
                err.status = 400;
                err.message = 'No authorization code provided';
                throw err;
            }
            const userInfo = await googleOAuthServiceProvider_1.default.handleCallback(code);
            //  Check if the user already exists
            let existingUser = await userDataServiceProvider.getUserByEmail(userInfo.email);
            if (!existingUser) {
                //  If user doesn't exist, create a new one without a password
                const newUser = {
                    email: userInfo.email,
                    google_id: userInfo.sub, // Google user ID
                    first_name: userInfo.given_name,
                    last_name: userInfo.family_name,
                    password: null, // No password for Google users
                    auth_provider: "GOOGLE", // Mark as Google user
                };
                // Save the new user in the database
                existingUser = await userDataServiceProvider.saveUserFromGoogle(newUser);
            }
            const { token, refreshToken } = await (0, appHelpers_1.getUserAuthTokens)(existingUser);
            const returnUserData = JSON.parse(JSON.stringify(existingUser));
            delete returnUserData.password;
            const respData = {
                success: true,
                user_details: returnUserData,
                access_token: token,
                refresh_token: refreshToken,
                message: "User login success!",
            };
            return res.status(200).json({
                success: true,
                message: 'Google OAuth login successful',
                data: respData,
            });
        }
        catch (error) {
            console.error({ error });
            return next(error);
        }
    }
}
exports.GoogleAuthController = GoogleAuthController;
//# sourceMappingURL=googleAuthController.js.map