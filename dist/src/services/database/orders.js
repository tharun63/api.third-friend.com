"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDataServiceProvider = void 0;
const order_1 = require("../../models/order");
class OrderDataServiceProvider {
    async saveOrder(orderData) {
        return await order_1.OrderModel.create(orderData);
    }
    async updateOrderById(orderId, data) {
        return order_1.OrderModel.updateOne({ _id: orderId }, { $set: data });
    }
    async updateOrderByQuery(query, data) {
        return order_1.OrderModel.updateOne(query, { $set: data });
    }
    async getAllOrders({ query = {}, skip = null, limit = null, sort = {}, projection = {}, lean = false, }) {
        if (lean) {
            return order_1.OrderModel.find(query)
                .collation({ locale: "en" })
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select(projection)
                .lean();
        }
        return order_1.OrderModel.find(query)
            .collation({ locale: "en" })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select(projection);
    }
    async countAllOrders(query = {}) {
        return order_1.OrderModel.countDocuments(query);
    }
}
exports.OrderDataServiceProvider = OrderDataServiceProvider;
//# sourceMappingURL=orders.js.map