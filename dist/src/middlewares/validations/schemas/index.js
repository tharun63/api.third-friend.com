"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signup_1 = require("./users/signup");
const signin_1 = require("./users/signin");
const forgotPassword_1 = require("./users/forgotPassword");
const forgotPasswordVerify_1 = require("./users/forgotPasswordVerify");
const updateProfile_1 = require("./users/updateProfile");
const addJourney_1 = require("./journeys/addJourney");
// import { updatePasswordDataSchema } from "./users/updatePassword";
exports.default = {
    "/signup": signup_1.signUpDataSchema,
    "/signin": signin_1.signInDataSchema,
    "/profile": updateProfile_1.updateProfileDataSchema,
    //   "/password/update": updatePasswordDataSchema,
    //   /* Forgot password */
    "/forgot-password": forgotPassword_1.forgotPasswordDataSchema,
    "/forgot-passowrd/verify": forgotPasswordVerify_1.forgotPasswordVerifyHeadersSchema,
    /* reset password */
    "/journey": {
        multi: true,
        post: addJourney_1.addJourneyDataSchema,
        patch: addJourney_1.updateJourneyDataSchema
    }
};
//# sourceMappingURL=index.js.map