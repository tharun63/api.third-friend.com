import { Schema, model } from "mongoose";
import { JOURNEY_STATUS,DEFAULT_JOURNEY_STATUS,MODE_OF_TRANSPORT} from '../constants/journey'


const journeyDataSchema = new Schema(
  {
    origin: {
        type: String,
        lowercase: true,
        required:true
    },
    journey_status :{
      type: String,
      enum: JOURNEY_STATUS,
      default: DEFAULT_JOURNEY_STATUS
    },
    mode_of_transport: {
      type: String,
      enum: MODE_OF_TRANSPORT,
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
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    journey_begins_on: {
        type: Date,
        required: true
    },
    journey_ends_on: {
        type: Date,
        required: true
    },
    stops:{
            type: [String],
    },
    max_weight: {
        type: Number,
        required: true
    },
    is_user_verified: {
        type:Boolean,
        default: false
    },
    charge_per_kg: {
        type :Number,
        required: true
    },
    is_journey_verified:{
        type:Boolean,
        default: false
    },
    rating:{
        type: Number
    },
    is_booked:{
        type:Boolean,
        default: false
    }

   
  },

  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);



export const JourneyModel = model("Journey", journeyDataSchema, "journeys");

