import { Schema, model } from "mongoose";
import { PAYMENT_STATUS, DEFAULT_PAYMENT_STATUS} from '../constants/order'


const deliverToSchema = new Schema({
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
})


const orderDataSchema = new Schema(
  {
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    drop_point:{
        type:String
    },
    deliver_to: deliverToSchema,
    journey: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Journey",
    },
    payment_status: {
      type: String,
      enum: PAYMENT_STATUS,
      default: DEFAULT_PAYMENT_STATUS
    },
    pg_order_id: {
        type: String,
    },
    pg_payment_id: {
        type: String
    },
    order_invoice_url:{
        type: String
    },
    invoice_id:{
        type: String
    }
  },

  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);



export const OrderModel = model("Order", orderDataSchema, "orders");

