"use strict";
// users/forgotPasswordVerify.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordVerifyHeadersSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Define schema for the headers (e.g., expecting an Authorization token in headers)
exports.forgotPasswordVerifyHeadersSchema = joi_1.default.object({
    authorization: joi_1.default.string().required().description('JWT Authorization token'),
}).unknown(); // 'unknown()' allows other headers to pass through without validation
//# sourceMappingURL=forgotPasswordVerify.js.map