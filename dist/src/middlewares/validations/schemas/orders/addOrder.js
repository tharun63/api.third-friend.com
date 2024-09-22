"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderDataSchema = exports.addOrderDataSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const joiHelpers_1 = require("../../../../helpers/joiHelpers");
const dataFormatConstants_1 = __importDefault(require("../../../../constants/dataFormatConstants"));
joi_1.default.objectId = (0, joiHelpers_1.objectId)(joi_1.default);
const orderDataSchema = {
    journey: joi_1.default.objectId().required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Journey ID')),
    user: joi_1.default.objectId().required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'User ID')),
    drop_point: joi_1.default.string().max(40).required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Drop Point')),
    delivery_to: joi_1.default.object().keys({
        name: joi_1.default.string().required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Delivery To Name')),
        mobile: joi_1.default.string().required().regex(dataFormatConstants_1.default.INDIAN_PHONE_NUMBER_REGEX).error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, ' Delivery To Mobile')),
    }).required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Delivery To')),
    bill_items: joi_1.default.array().items(joi_1.default.object({
        journey_name: joi_1.default.string().max(50).required().error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Journey Name')),
        total_amount: joi_1.default.number().min(0).required().error(errors => (0, joiHelpers_1.numberErrorHandler)(errors, 'Total Amount')),
        discount: joi_1.default.number().min(0).required().error(errors => (0, joiHelpers_1.numberErrorHandler)(errors, 'Discount')),
    }).required()).min(1).error(errors => (0, joiHelpers_1.stringErrorHandler)(errors, 'Bill Items'))
};
exports.addOrderDataSchema = joi_1.default.object().keys(orderDataSchema);
exports.updateOrderDataSchema = joi_1.default.object().keys(Object.assign({}, orderDataSchema));
//# sourceMappingURL=addOrder.js.map