"use strict";
//services
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
// stripe.service.ts
const stripe_1 = require("stripe");
const app_1 = __importDefault(require("../../config/app"));
class StripeService {
    constructor() {
        this.stripe = new stripe_1.Stripe(app_1.default.payments.stripe.secret_key, {});
    }
    async createCheckoutSession(lineItems) {
        try {
            const session = await this.stripe.checkout.sessions.create({
                line_items: lineItems,
                mode: 'payment',
                invoice_creation: {
                    enabled: true,
                },
                success_url: 'https://api-third-friend-com.onrender.com/v1.0',
                cancel_url: 'http://localhost:3000',
            });
            return session;
        }
        catch (err) {
            console.log({ err });
        }
    }
    async webHook(body, sig) {
        let event;
        let secret = app_1.default.payments.stripe.web_hook_key;
        const payloadString = JSON.stringify(body, null, 2);
        const header = this.stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });
        try {
            event = this.stripe.webhooks.constructEvent(payloadString, header, secret);
        }
        catch (err) {
            console.log({ err });
        }
        return event;
    }
    async listCheckoutSessions(intent) {
        return await this.stripe.checkout.sessions.list({
            payment_intent: intent,
        });
    }
}
exports.StripeService = StripeService;
//# sourceMappingURL=stripePaymentService.js.map