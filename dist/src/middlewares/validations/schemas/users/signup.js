"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpDataSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const joiHelpers_1 = require("../../../../helpers/joiHelpers");
const dataFormatConstants_1 = __importDefault(require("../../../../constants/dataFormatConstants"));
// Joi.objectId = objectId(Joi)
exports.signUpDataSchema = joi_1.default.object().keys({
    first_name: joi_1.default.string().required().regex(dataFormatConstants_1.default.NAME_REGEX).error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'First Name')),
    last_name: joi_1.default.string().required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Last Name')),
    email: joi_1.default.string().email().required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Email')),
    mobile: joi_1.default.string().regex(dataFormatConstants_1.default.INDIAN_PHONE_NUMBER_REGEX).error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Mobile')),
    username: joi_1.default.string().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Username')),
    password: joi_1.default.string().min(6).required().strict().error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.empty":
                    err.message = "Password is Missing!";
                    break;
                case "any.required":
                    err.message = "Password is Missing!";
                    break;
                case "string.min":
                    err.message = "Password must contain at least 6 Characters";
                    break;
                default:
                    break;
            }
        });
        return errors;
    }),
    confirm_password: joi_1.default.string().valid(joi_1.default.ref('password')).error(errors => {
        errors.forEach(err => {
            switch (err.code) {
                case "any.empty":
                    err.message = "Please Confirm Your Password!";
                    break;
                case "any.required":
                    err.message = "Please Confirm Your Password!";
                    break;
                case "any.allowOnly":
                    err.message = "Password & Confirm Password Do Not Match";
                    break;
                default:
                    break;
            }
        });
        return errors;
    }),
});
//# sourceMappingURL=signup.js.map