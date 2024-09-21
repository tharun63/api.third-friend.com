"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const user_1 = require("../constants/user");
const addressSchema = new mongoose_1.Schema({
    line_one: {
        type: String,
    },
    line_two: {
        type: String,
    },
    street: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
}, {
    _id: false,
    versionKey: false,
});
const userDataSchema = new mongoose_1.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    mobile: {
        type: String
    },
    user_status: {
        type: String,
        enum: user_1.ACCOUNT_STATUS,
        default: user_1.DEFAULT_ACCOUNT_STATUS
    },
    user_type: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    },
    address: addressSchema,
    password: {
        type: String,
        // required: true
    },
    google_id: {
        type: String,
        default: null
    },
    username: {
        type: String
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    auth_provider: {
        type: String,
        enum: ['GOOGLE', 'NA'],
        default: 'NA'
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
// userDataSchema.index({ username: 1 }, { background: true });
exports.UserModel = (0, mongoose_1.model)("User", userDataSchema, "users");
//# sourceMappingURL=user.js.map