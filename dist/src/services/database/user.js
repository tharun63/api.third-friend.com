"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDataServiceProvider = void 0;
const user_1 = require("../../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 12;
class UserDataServiceProvider {
    async saveUser(userData) {
        // Hash Password
        userData.password = await bcrypt_1.default.hash(userData.password, saltRounds);
        return await user_1.UserModel.create(userData);
    }
    async saveUserFromGoogle(userData) {
        return await user_1.UserModel.create(userData);
    }
    // Updated Email Verified Status
    async updateEmailVerifiedStatus(email, status) {
        // Update Email Verified Status
        const emailVerified = await user_1.UserModel.updateOne({ email }, { email_verified: status, status: "ACTIVE" });
        return emailVerified;
    }
    async login(email, password) {
        let match = false;
        const userDetails = await this.getUserByEmail(email);
        if (userDetails) {
            match = await bcrypt_1.default.compare(password, userDetails.password);
        }
        return match ? userDetails : null;
    }
    async getUserByEmail(email) {
        return await user_1.UserModel.findOne({
            email,
            status: { $ne: "ARCHIVED" },
        }).lean();
    }
    async emailExists(email) {
        const emailCount = await user_1.UserModel.countDocuments({ email });
        return emailCount ? true : false;
    }
    async userNameExists(username) {
        const userNamesCount = await user_1.UserModel.countDocuments({
            username,
            status: { $ne: "ARCHIVED" },
        });
        return userNamesCount ? true : false;
    }
    async updateUserById(advertiserId, data) {
        return user_1.UserModel.updateOne({ _id: advertiserId }, { $set: data });
    }
    async updateUserByQuery(query, data) {
        return user_1.UserModel.updateOne(query, { $set: data });
    }
    async updateUserByEmail(email, data) {
        return user_1.UserModel.findOne({ email }, { $set: data });
    }
    async updatePassword(advertiserId, password, passwordExpires = null) {
        // Hash Password
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        return await user_1.UserModel.updateOne({ _id: advertiserId }, {
            $set: {
                password: hashedPassword,
                //   password_expired_at: passwordExpires,
            },
        });
    }
    async getAllUsers({ query = {}, skip = null, limit = null, sort = {}, projection = {}, lean = false, }) {
        if (lean) {
            return user_1.UserModel.find(query)
                .collation({ locale: "en" })
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select(projection)
                .lean();
        }
        return user_1.UserModel.find(query)
            .collation({ locale: "en" })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select(projection);
    }
    async countAllUsers(query = {}) {
        return user_1.UserModel.countDocuments(query);
    }
    async updateUsers(query = {}, data) {
        return user_1.UserModel.updateMany(query, data);
    }
    async userById(userId, removePassword = false) {
        if (removePassword) {
            return user_1.UserModel.findOne({ _id: userId }, { password: 0 });
        }
        else {
            return user_1.UserModel.findById(userId);
        }
    }
}
exports.UserDataServiceProvider = UserDataServiceProvider;
//# sourceMappingURL=user.js.map