"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileDataSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const joiHelpers_1 = require("../../../../helpers/joiHelpers");
const dataFormatConstants_1 = __importDefault(require("../../../../constants/dataFormatConstants"));
const currentYear = new Date().getFullYear();
const addressSchema = joi_1.default.object().keys({
    line_one: joi_1.default.string().error(joiHelpers_1.stringErrorHandler).error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Address Line1')),
    line_two: joi_1.default.string().error(joiHelpers_1.stringErrorHandler).error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Address Line2')),
    street: joi_1.default.string().error(joiHelpers_1.stringErrorHandler).error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Street')),
    city: joi_1.default.string().required().regex(dataFormatConstants_1.default.CITY_REGEX).error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'City')),
    state: joi_1.default.string().required().error(joiHelpers_1.stringErrorHandler).error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'State')),
    zip: joi_1.default.string().required().regex(dataFormatConstants_1.default.INDIAN_ZIP_REGEX).min(5).max(5).error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, "Zip code")),
});
exports.updateProfileDataSchema = joi_1.default.object().keys({
    first_name: joi_1.default.string().max(40).regex(dataFormatConstants_1.default.NAME_REGEX).required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'First Name')),
    last_name: joi_1.default.string().required().max(40).regex(dataFormatConstants_1.default.NAME_REGEX).required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Last Name')),
    email: joi_1.default.string().email().required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Email')),
    user_type: joi_1.default.string().required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'User Type')),
    phone: joi_1.default.string().regex(dataFormatConstants_1.default.INDIAN_PHONE_NUMBER_REGEX).error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, "Phone")),
    address: addressSchema,
});
//# sourceMappingURL=updateProfile.js.map