"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInDataSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const joiHelpers_1 = require("../../../../helpers/joiHelpers");
const dataFormatConstants_1 = __importDefault(require("../../../../constants/dataFormatConstants"));
exports.signInDataSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required().regex(dataFormatConstants_1.default.EMAIL_REGEX).required().error((errors) => (0, joiHelpers_1.stringErrorHandler)(errors, "Email")),
    password: joi_1.default.string().required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Password')),
});
//# sourceMappingURL=signin.js.map