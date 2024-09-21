import { Request, Response } from 'express';
import { StripeService } from '../services/stripePaymentService';
import { mapOrderItemsToStripeFormat } from "../helpers/appHelpers";
import EmailServiceProvider from "../services/notifications/emailServiceProvider"
export class StripeController {
    private stripeService: StripeService;

    constructor() {
        this.stripeService = new StripeService();
    }

    async createCheckoutSession(req: Request, res: Response) {
        try {

            const order = await mapOrderItemsToStripeFormat(req.body.bill_items);
            console.log({order})


            const session = await this.stripeService.createCheckoutSession(order);
            res.json(session);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async webHook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'] as string;

        try {
            const event = await this.stripeService.webHook(req.body, sig);

            let session;

            switch (event.type) {

                case 'checkout.session.completed':

                    session = event.data.object;
                    await EmailServiceProvider.sendInvoiceEmail(session.customer_details.email, session);

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
        } catch (error) {
            res.status(400).send(`Webhook Error: ${error.message}`);
        }

       
    }

    async listCheckoutSessions(req: Request, res: Response) {
        try {
            const sessions = await this.stripeService.listCheckoutSessions(req.params.intent);
            res.json(sessions);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}
