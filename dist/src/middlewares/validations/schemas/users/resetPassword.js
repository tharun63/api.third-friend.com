"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.resetPasswordSchema = joi_1.default.object().keys({
    password: joi_1.default.string().min(6).required().strict().error(errors => {
        errors.forEach(err => {
            switch (err.type) {
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
    confirm_password: joi_1.default.string().required().valid(joi_1.default.ref('password')).error(errors => {
        errors.forEach(err => {
            switch (err.type) {
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
//# sourceMappingURL=resetPassword.js.map