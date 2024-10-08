"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = require("../services/database/user");
const appHelpers_1 = require("../helpers/appHelpers");
const filterHelper_1 = __importDefault(require("../helpers/filterHelper"));
const paginationHelpers_1 = __importDefault(require("../helpers/paginationHelpers"));
const emailServiceProvider_1 = __importDefault(require("../services/notifications/emailServiceProvider"));
const moment_1 = __importDefault(require("moment"));
const app_1 = __importDefault(require("../../config/app"));
const messageHelper_1 = require("../helpers/messageHelper");
const userDataServiceProvider = new user_1.UserDataServiceProvider();
class UserController {
    async signIn(req, res, next) {
        try {
            const { token, refreshToken } = await (0, appHelpers_1.getUserAuthTokens)(req.user);
            const returnUserData = JSON.parse(JSON.stringify(req.user));
            delete returnUserData.password;
            const respData = {
                success: true,
                user_details: returnUserData,
                access_token: token,
                refresh_token: refreshToken,
                message: "User login success!",
            };
            return res.status(201).json(respData);
        }
        catch (error) {
            console.log({ error });
            return next(error);
        }
    }
    async signUp(req, res, next) {
        try {
            const userData = req.body;
            await userDataServiceProvider.saveUser(userData);
            return res.status(201).json({
                success: true,
                message: "User Registered  Successfully!",
            });
        }
        catch (err) {
            next(err);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            let user = req.user;
            // //prepare email link data for send email
            let emailPreparationData = (0, messageHelper_1.prepareEmailData)(user, "FORGOT_PASSWORD");
            // sending mail to user
            const { emailData } = (0, messageHelper_1.prepareForgotPasswordEmailData)(emailPreparationData);
            await emailServiceProvider_1.default.sendForgotPasswordEmail(emailData);
            return res.status(200).json({
                success: true,
                message: `Forgot Password Link sent to ${user.email} successfully. Please note that the Link will expire in 15 minutes`,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async verifyForgotPassword(req, res, next) {
        try {
            console.log(req.headers);
            return res.status(200).json({
                success: true,
                message: `User verified successfully`,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const { password, confirm_password } = req.body;
            let userId = req.user._id;
            const passwordExpiredAt = (0, moment_1.default)()
                .add(app_1.default.app.password_expire_in_days, "days")
                .utc()
                .format();
            await userDataServiceProvider.updatePassword(userId, password, passwordExpiredAt);
            return res.status(200).json({
                success: true,
                message: "Password reset successfully",
            });
        }
        catch (err) {
            next(err);
        }
    }
    // public async updateProfile(
    //   req: AuthRequest,
    //   res: Response,
    //   next: NextFunction
    // ) {
    //   try {
    //     let profile = req.body;
    //     if (profile.user_code) {
    //       delete profile.user_code;
    //     }
    //     if (profile.avatar) {
    //       delete profile.avatar;
    //     }
    //     await userDataServiceProvider.updateUserById(req.user._id, profile);
    //     return res.status(200).json({
    //       success: true,
    //       message: "Profile updated successfully",
    //     });
    //   } catch (error) {
    //     let respData = {
    //       success: false,
    //       message: error.message,
    //     };
    //     return res.status(error.statusCode || 500).json(respData);
    //   }
    // }
    async updatePassword(req, res, next) {
        try {
            //   const passwordExpiredAt = moment()
            //     .add(appConfig.app.password_expire_in_days, "days")
            //     .utc()
            //     .format();
            await userDataServiceProvider.updatePassword(req.user._id, req.body.new_password);
            let respData = {
                success: true,
                message: "Password Updated Successfully",
            };
            return res.status(201).json(respData);
        }
        catch (error) {
            return next(error);
        }
    }
    async getUserById(req, res, next) {
        try {
            const removePassword = true;
            let data = await userDataServiceProvider.userById(req.params.id, removePassword);
            return res.status(200).json({
                success: true,
                message: "User Account data fetched successfully",
                data: data,
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async getAllUsers(req, res, next) {
        try {
            let { skip, limit, sort, projection } = req.parsedFilterParams;
            let { query = {} } = req.parsedFilterParams;
            query = filterHelper_1.default.users(query, req.query);
            sort.updated_at = -1;
            projection = {
                first_name: 1,
                last_name: 1,
                status: 1,
                username: 1,
                user_type: 1,
            };
            const [users = [], count = 0] = await Promise.all([
                userDataServiceProvider.getAllUsers({ query, skip, limit, sort, projection, }),
                userDataServiceProvider.countAllUsers(query),
            ]);
            const response = paginationHelpers_1.default.getPaginationResponse({
                page: req.query.page || 1,
                count,
                limit,
                skip,
                data: users,
                message: "All User Detail fetched successfully",
                searchString: req.query.search_string,
            });
            return res.json(response);
        }
        catch (err) {
            return err;
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.js.map