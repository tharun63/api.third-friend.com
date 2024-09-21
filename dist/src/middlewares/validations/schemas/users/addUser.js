"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserDataSchema = exports.addUserDataSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const joiHelpers_1 = require("../../../../helpers/joiHelpers");
const dataFormatConstants_1 = __importDefault(require("../../../../constants/dataFormatConstants"));
const user_1 = require("../../../../constants/user");
const JoiObjectId = (0, joiHelpers_1.objectId)(joi_1.default);
const currentYear = new Date().getFullYear();
const userDataSchema = {
    first_name: joi_1.default.string().max(40).regex(dataFormatConstants_1.default.NAME_REGEX).required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'First Name')),
    last_name: joi_1.default.string().max(40).required().regex(dataFormatConstants_1.default.NAME_REGEX).required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Last Name')),
    email: joi_1.default.string().required().regex(dataFormatConstants_1.default.EMAIL_REGEX).required().error((errors) => (0, joiHelpers_1.stringErrorHandler)(errors, "Email")),
    phone: joi_1.default.string().regex(dataFormatConstants_1.default.INDIAN_PHONE_NUMBER_REGEX).error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Phone')),
    user_name: joi_1.default.string()
        .required()
        .min(3)
        .max(60).regex((/[a-zA-Z]/) || (/(?:[A-Za-z].*?\d|\d.*?[A-Za-z])/)).error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Username')),
    user_type: joi_1.default.string().valid(user_1.ALL_USERS).required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'User Type')),
    password: joi_1.default.string().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Password'))
};
exports.addUserDataSchema = joi_1.default.object().keys(userDataSchema);
exports.updateUserDataSchema = joi_1.default.object().keys(Object.assign(Object.assign({}, userDataSchema), { user_id: JoiObjectId().required() }));
//# sourceMappingURL=addUser.js.map