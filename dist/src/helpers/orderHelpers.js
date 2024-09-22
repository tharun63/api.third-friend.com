"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareOrderData = exports.mapOrderItemsToStripeFormat = void 0;
const mapOrderItemsToStripeFormat = function (bill_items) {
    return bill_items.map(item => ({
        price_data: {
            currency: 'inr',
            product_data: {
                name: item.journey_name,
            },
            unit_amount: item.total_amount * 100
        },
        quantity: 1,
    }));
};
exports.mapOrderItemsToStripeFormat = mapOrderItemsToStripeFormat;
const prepareOrderData = function (session, createOrder) {
    const { bill_items, delivery_to, drop_point, user, journey } = createOrder;
    return {
        pg_order_id: session.id,
        user: user,
        journey,
        journey_name: bill_items[0].journey_name,
        total_amount: bill_items[0].total_amount,
        pg_payment_status: session.status,
        delivery_to: delivery_to,
        drop_point: drop_point
    };
};
exports.prepareOrderData = prepareOrderData;
//# sourceMappingURL=orderHelpers.js.map