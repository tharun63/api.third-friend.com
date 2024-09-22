"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const stripePaymentService_1 = require("../services/stripePaymentService");
const orderHelpers_1 = require("../helpers/orderHelpers");
const emailServiceProvider_1 = __importDefault(require("../services/notifications/emailServiceProvider"));
const orders_1 = require("../services/database/orders");
const orderDataServiceProvider = new orders_1.OrderDataServiceProvider();
class OrderController {
    constructor() {
        this.stripeService = new stripePaymentService_1.StripeService();
    }
    async order(req, res) {
        try {
            const order = await (0, orderHelpers_1.mapOrderItemsToStripeFormat)(req.body.bill_items);
            console.log({ order });
            const session = await this.stripeService.createCheckoutSession(order);
            const orderData = (0, orderHelpers_1.prepareOrderData)(session, req.body);
            const orderRes = orderDataServiceProvider.saveOrder(orderData);
            let response = {
                payment_url: session.url,
                pg_order_id: session.id
            };
            res.json(response);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }
    async webHook(req, res) {
        const sig = req.headers['stripe-signature'];
        try {
            const event = await this.stripeService.webHook(req.body, sig);
            let session;
            switch (event.type) {
                case 'checkout.session.completed':
                    session = event.data.object;
                    const pg_order_id = session.id;
                    const orderUpdateData = {
                        payment_status: session.status === 'complete' ? 'COMPLETED' : 'FAILED',
                        order_status: session.status === 'complete' ? 'CONFIRMED' : 'PENDING',
                        pg_payment_id: session.payment_intent,
                        paid_amount: session.amount_total / 100
                    };
                    const updateOrder = await orderDataServiceProvider.updateOrderByQuery({ pg_order_id: pg_order_id }, orderUpdateData);
                    await emailServiceProvider_1.default.sendInvoiceEmail(session.customer_details.email, session);
                    break;
                case 'invoice.created':
                    session = event.data.object;
                    const data = await this.stripeService.listCheckoutSessions(session.payment_intent);
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }
            res.json(event);
        }
        catch (error) {
            res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }
    async listCheckoutSessions(req, res) {
        try {
            const sessions = await this.stripeService.listCheckoutSessions(req.params.intent);
            res.json(sessions);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=orderController.js.map