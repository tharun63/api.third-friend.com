"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareForgotPasswordEmailData = exports.prepareEmailData = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = __importDefault(require("../../config/app"));
const prepareEmailData = (user, action, expiresInMin = 15) => {
    const secretKey = app_1.default.jwt.token_secret;
    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const expirationTime = now + expiresInMin * 60;
    const payload = {
        user: user._id,
        email: user.email,
        lab: user.lab,
        action: action,
        exp: expirationTime
    };
    // generate JWT token
    const token = jsonwebtoken_1.default.sign(payload, secretKey);
    // include the token in your email data
    const emailData = {
        user_id: user._id,
        first_name: user.first_name,
        email: user.email,
        lab: user.lab,
        token: token,
        exp: expirationTime, // Include the expiration time
    };
    return emailData;
};
exports.prepareEmailData = prepareEmailData;
const prepareForgotPasswordEmailData = (emailPreparationData, subject = "Forgot Password") => {
    let email = emailPreparationData.email ? emailPreparationData.email + " " : "";
    let resetURL = app_1.default.app.ui_app_base_url +
        "/forgot-password/verify?Authorization=" +
        emailPreparationData.token;
    const expirationTimeMinutes = Math.floor((emailPreparationData.exp - Date.now() / 1000) / 60);
    const emailData = {
        first_name: emailPreparationData.first_name,
        email: email,
        subject,
        resetURL,
        expirationTimeMinutes, // Include expiration time in minutes
    };
    // const emailContent = {
    //   email,
    //   first_name: emailPreparationData.first_name,
    //   resetURL,
    //   expirationTimeMinutes, // Include expiration time in minutes
    // };
    return { emailData };
};
exports.prepareForgotPasswordEmailData = prepareForgotPasswordEmailData;
//# sourceMappingURL=messageHelper.js.map