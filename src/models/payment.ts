// import { Schema, model } from "mongoose";
// import { PAYMENT_STATUS, DEFAULT_PAYMENT_STATUS} from '../constants/order'


// const paymentDataSchema = new Schema(
//   {
//     user: {
//         type: Schema.Types.ObjectId,
//         required: true,
//         ref: "User",
//     }, 
//     order: {
//         type: Schema.Types.ObjectId,
//         required: true,
//         ref: "Order",
//     },  
//     order_amount: {
//         type: Number,
//         min: 0.0,
//     },
//     payment_amount:{
//         type: Number,
//         min: 0.0
//     },
//     journey: {
//         type: Schema.Types.ObjectId,
//         ref: "Journey",
//     },
//     payment_status: {
//         type: String,
//         enum: PAYMENT_STATUS,
//         default: DEFAULT_PAYMENT_STATUS
//     },

//     pg_order_id: {
//         type: String,
//     },
//     payment_id: {
//         type: String
//     },
//     order_invoice_url:{
//         type: String
//     },
//     invoice_id:{
//         type: String
//     },
//   },

//   {
//     timestamps: {
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//     },
//   }
// );



// export const PaymentModel = model("Payment", paymentDataSchema, "payments");

