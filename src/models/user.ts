import { Schema, model } from "mongoose";
import { ACCOUNT_STATUS,DEFAULT_ACCOUNT_STATUS,ALL_USERS,DEFAULT_USER_TYPE,AUTH_PROVIDERS, DEFAULT_AUTH_PROVIDER} from '../constants/user'

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
        enum: ALL_USERS,
        default: DEFAULT_USER_TYPE
    },
    address: addressSchema,
    password: {
        type: String,
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
        enum: AUTH_PROVIDERS,
        default: DEFAULT_AUTH_PROVIDER 
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

