"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyModel = void 0;
const mongoose_1 = require("mongoose");
const journey_1 = require("../constants/journey");
const journeyDataSchema = new mongoose_1.Schema({
    origin: {
        type: String,
        lowercase: true,
        required: true
    },
    journey_status: {
        type: String,
        enum: journey_1.JOURNEY_STATUS,
        default: journey_1.DEFAULT_JOURNEY_STATUS
    },
    mode_of_transport: {
        type: String,
        enum: journey_1.MODE_OF_TRANSPORT,
        required: true
    },
    pick_up_point: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    remarks: {
        type: String
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    journey_begins_on: {
        type: Date,
        required: true
    },
    deleted_on: {
        type: Date,
    },
    journey_ends_on: {
        type: Date,
        required: true
    },
    stops: {
        type: [String],
    },
    max_weight: {
        type: Number,
        required: true
    },
    is_user_verified: {
        type: Boolean,
        default: false
    },
    charge_per_kg: {
        type: Number,
        required: true
    },
    is_journey_verified: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number
    },
    is_booked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
exports.JourneyModel = (0, mongoose_1.model)("Journey", journeyDataSchema, "journeys");
//# sourceMappingURL=journey.js.map