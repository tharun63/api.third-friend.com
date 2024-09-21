"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapOrderItemsToStripeFormat = exports.getUserAuthTokens = exports.generateToken = void 0;
const app_1 = __importDefault(require("../../config/app"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = function (maxlength = 32) {
    var token = "";
    for (let i = 0; i < 4; i++) {
        token += Math.random().toString(36).substring(2, 15);
    }
    return token.substring(0, maxlength);
};
exports.generateToken = generateToken;
const getUserAuthTokens = function (userData) {
    let user = {
        id: userData._id,
        email: userData.email,
        user_type: userData.user_type,
        first_name: userData.first_name,
        last_name: userData.last_name,
    };
    let tokenSecret = app_1.default.jwt.token_secret + (userData.auth_provider === 'GOOGLE' ? userData.google_id : userData.password);
    let refreshTokenSecret = app_1.default.jwt.refresh_token_secret + (userData.auth_provider === 'GOOGLE' ? userData.google_id : userData.password);
    const token = jsonwebtoken_1.default.sign(user, tokenSecret, {
        expiresIn: app_1.default.jwt.token_life,
    });
    const refreshToken = jsonwebtoken_1.default.sign(user, refreshTokenSecret, {
        expiresIn: app_1.default.jwt.refresh_token_life,
    });
    return {
        token,
        refreshToken,
    };
};
exports.getUserAuthTokens = getUserAuthTokens;
const mapOrderItemsToStripeFormat = function (bill_items) {
    return bill_items.map(item => ({
        price_data: {
            currency: 'inr',
            product_data: {
                name: item.accession_id,
            },
            unit_amount: item.payment_amount * 100
        },
        quantity: 1,
    }));
};
exports.mapOrderItemsToStripeFormat = mapOrderItemsToStripeFormat;
//# sourceMappingURL=appHelpers.js.map