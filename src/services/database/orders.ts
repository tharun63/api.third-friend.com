import { OrderModel } from "../../models/order";

export class OrderDataServiceProvider {


  public async saveOrder(orderData) {
    return await OrderModel.create(orderData);
  }

 
  async updateOrderById(orderId, data) {
    return OrderModel.updateOne({ _id: orderId }, { $set: data });
  }
  async updateOrderByQuery(query, data) {
    return OrderModel.updateOne(query, { $set: data });
  }

  async getAllOrders({
    query = {},
    skip = null,
    limit = null,
    sort = {},
    projection = {},
    lean = false,
  }) {
    if (lean) {
      return OrderModel.find(query)
        .collation({ locale: "en" })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(projection)
        .lean();
    }
    return OrderModel.find(query)
      .collation({ locale: "en" })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(projection);
  }

  async countAllOrders(query = {}) {
    return OrderModel.countDocuments(query);
  }

}
