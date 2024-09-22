import { Schema, model } from "mongoose";
import { PAYMENT_STATUS, DEFAULT_PAYMENT_STATUS,DEFAULT_ORDER_STATUS,ORDER_STATUS} from '../constants/order'


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
    journey_name :{
        type: String,
        required:true
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
    drop_point:{
        type:String
    },
    deliver_to: deliverToSchema,
    journey: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Journey",
    },
    order_status: {
      type: String,
      enum: ORDER_STATUS,
      default: DEFAULT_ORDER_STATUS
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

