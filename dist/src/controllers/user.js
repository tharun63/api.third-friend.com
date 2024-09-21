"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = require("../services/database/user");
const appHelpers_1 = require("../helpers/appHelpers");
const customError_1 = require("../interfaces/customError");
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
    async getProfile(req, res, next) {
        try {
            let advertiserDetails = await userDataServiceProvider.userById(req.user._id, true);
            const profile = {
                first_name: advertiserDetails.first_name,
                last_name: advertiserDetails.last_name,
                email: advertiserDetails.email,
                phone: advertiserDetails.phone,
                username: advertiserDetails.username,
                address: advertiserDetails.address,
                user_type: advertiserDetails.user_type
            };
            return res.status(200).json({
                success: true,
                message: "User profile fetched successfully",
                data: profile,
            });
        }
        catch (error) {
            let respData = {
                success: false,
                message: error.message,
            };
            return res.status(error.statusCode || 500).json(respData);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            let user = req.user;
            // //prepare email link data for send email
            let emailPreparationData = (0, messageHelper_1.prepareEmailData)(user, "FORGOT_PASSWORD");
            // sending mail to user
            const { emailData } = (0, messageHelper_1.prepareForgotPasswordEmailData)(emailPreparationData);
            await emailServiceProvider_1.default.sendForgotPasswordDetailsEmail(emailData);
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
    async updateProfile(req, res, next) {
        try {
            let profile = req.body;
            if (profile.user_code) {
                delete profile.user_code;
            }
            if (profile.avatar) {
                delete profile.avatar;
            }
            await userDataServiceProvider.updateUserById(req.user._id, profile);
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
            });
        }
        catch (error) {
            let respData = {
                success: false,
                message: error.message,
            };
            return res.status(error.statusCode || 500).json(respData);
        }
    }
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
    async AddUser(req, res, next) {
        try {
            const advertiserData = req.body;
            const requestedUser = req.user;
            advertiserData.username = advertiserData.username.toLowerCase();
            const exists = await userDataServiceProvider.userNameExists(advertiserData.username);
            if (exists) {
                const err = new customError_1.CustomError();
                err.status = 409;
                err.message = "Account with this username is already taken";
                throw err;
            }
            advertiserData.password = "123456";
            //   userData.password_expired_at = moment()
            //     .add(appConfig.app.password_expire_in_days, "days")
            //     .utc()
            //     .format();
            let savedUser = await userDataServiceProvider.saveUser(advertiserData);
            const addedUserName = savedUser.first_name + " " + savedUser.last_name;
            const role = savedUser.user_type
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            return res.status(201).json({
                success: true,
                message: "User Registered  Successfully!",
                data: savedUser
            });
        }
        catch (err) {
            next(err);
        }
    }
    //   public async UpdateUser(req: Request, res: Response, next: NextFunction) {
    //     try {
    //       const userData = req.body;
    //       userData.hospital_marketing_manager = userData.reporting_to;
    //       const userId = req.params.user_id;
    //       const requestUser: any = req.user;
    //       userData.username = userData.username.toLowerCase();
    //       const exists = await userDataServiceProvider.userNameExistsForUpdateUser(
    //         userData.username,
    //         userId
    //       );
    //       if (exists) {
    //         const err = new CustomError();
    //         err.status = 409;
    //         err.message = "Account with this username is already taken";
    //         throw err;
    //       }
    //       userData.user_code = req.body.username;
    //       userData.designation = userTypeDesignationMap[userData.user_type] || "User"
    //       let emailEventData = userData.settings.email_events;
    //       if (emailEventData.length) {
    //         userData.settings.email_notifications = true;
    //       } else {
    //         userData.settings.email_notifications = false;
    //       }
    //       await userDataServiceProvider.updateUserById(userId, userData);
    //       const auditSection = await logsHelper.auditTypeHelper(requestUser.user_type);
    //       await logsDataServiceProvider.userDataUpdated(
    //         userId,
    //         requestUser._id,
    //         requestUser.lab,
    //         auditSection
    //       );
    //       return res.status(201).json({
    //         success: true,
    //         message: "User Updated  Successfully!",
    //       });
    //     } catch (err) {
    //       next(err);
    //     }
    //   }
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