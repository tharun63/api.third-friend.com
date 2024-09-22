import { Request, Response } from 'express';
import { StripeService } from '../services/stripePaymentService';
import { mapOrderItemsToStripeFormat,prepareOrderData } from "../helpers/orderHelpers";
import EmailServiceProvider from "../services/notifications/emailServiceProvider";
import {OrderDataServiceProvider} from "../services/database/orders";

const orderDataServiceProvider = new OrderDataServiceProvider();
export class OrderController {
    private stripeService: StripeService;

    constructor() {
        this.stripeService = new StripeService();
    }

    async order(req: Request, res: Response) {
        try {

            const order = await mapOrderItemsToStripeFormat(req.body.bill_items);

            console.log({order})


            const session = await this.stripeService.createCheckoutSession(order);
           

            const orderData = prepareOrderData(session,req.body);
            const orderRes = orderDataServiceProvider.saveOrder(orderData);

            let response = {
                payment_url: session.url,
                pg_order_id: session.id
            };


            res.json(response);
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
                   const pg_order_id = session.id;

                   const orderUpdateData = {
                    payment_status: session.status === 'complete' ? 'COMPLETED' : 'FAILED',
                    order_status: session.status === 'complete' ? 'CONFIRMED' : 'PENDING',
                    pg_payment_id: session.payment_intent,
                    paid_amount: session.amount_total/100
                   }
                    const  updateOrder = await orderDataServiceProvider.updateOrderByQuery({pg_order_id:pg_order_id},orderUpdateData);
                    await EmailServiceProvider.sendInvoiceEmail(session.customer_details.email, session);

                    break;


                case 'invoice.created':

                    session = event.data.object;

                    const data = await this.stripeService.listCheckoutSessions(session.payment_intent);



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
