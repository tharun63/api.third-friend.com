"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = __importDefault(require("../../config/app"));
const verifyToken = (token) => {
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, app_1.default.jwt.token_secret);
        return decodedToken;
    }
    catch (error) {
        return error; // Or handle the error as needed
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyTokenHelper.js.map