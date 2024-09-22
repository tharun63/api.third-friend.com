"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const order_1 = require("../constants/order");
const deliverToSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    alternate_mobile: {
        type: String,
    }
}, {
    _id: false,
    versionKey: false,
});
const orderDataSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    journey_name: {
        type: String,
        required: true
    },
    total_amount: {
        type: Number,
        min: 0.0,
    },
    paid_amount: {
        type: Number,
        min: 0.0,
    },
    discount: {
        type: Number,
        default: 0.0
    },
    drop_point: {
        type: String
    },
    deliver_to: deliverToSchema,
    journey: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Journey",
    },
    order_status: {
        type: String,
        enum: order_1.ORDER_STATUS,
        default: order_1.DEFAULT_ORDER_STATUS
    },
    payment_status: {
        type: String,
        enum: order_1.PAYMENT_STATUS,
        default: order_1.DEFAULT_PAYMENT_STATUS
    },
    pg_order_id: {
        type: String,
    },
    pg_payment_id: {
        type: String
    },
    order_invoice_url: {
        type: String
    },
    invoice_id: {
        type: String
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
exports.OrderModel = (0, mongoose_1.model)("Order", orderDataSchema, "orders");
//# sourceMappingURL=order.js.map