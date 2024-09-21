import { Schema, model } from "mongoose";
import { ACCOUNT_STATUS,DEFAULT_ACCOUNT_STATUS } from '../constants/user'

const addressSchema = new Schema({
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
})

const userDataSchema = new Schema(
  {
    email: {
        type: String,
        lowercase: true,
        unique:true
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
        enum: ACCOUNT_STATUS,
        default: DEFAULT_ACCOUNT_STATUS
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
        type:Boolean,
        default: false
    },
    auth_provider: {
        type:String,
        enum: ['GOOGLE','NA'],
        default: 'NA' 
    }
   
  },

  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);


// userDataSchema.index({ username: 1 }, { background: true });

export const UserModel = model("User", userDataSchema, "users");

