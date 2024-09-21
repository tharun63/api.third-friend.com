"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeController = void 0;
const stripePaymentService_1 = require("../services/stripePaymentService");
const appHelpers_1 = require("../helpers/appHelpers");
const emailServiceProvider_1 = __importDefault(require("../services/notifications/emailServiceProvider"));
class StripeController {
    constructor() {
        this.stripeService = new stripePaymentService_1.StripeService();
    }
    async createCheckoutSession(req, res) {
        try {
            const order = await (0, appHelpers_1.mapOrderItemsToStripeFormat)(req.body.bill_items);
            console.log({ order });
            const session = await this.stripeService.createCheckoutSession(order);
            res.json(session);
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
                    await emailServiceProvider_1.default.sendInvoiceEmail(session.customer_details.email, session);
                    break;
                case 'invoice.created':
                    session = event.data.object;
                    const data = await this.stripeService.listCheckoutSessions(session.payment_intent);
                    const id = data.data[0].id;
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
exports.StripeController = StripeController;
//# sourceMappingURL=stripeController.js.map