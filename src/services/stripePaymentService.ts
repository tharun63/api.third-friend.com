//services

// stripe.service.ts
import { Stripe } from 'stripe';
import config from "../../config/app";


export class StripeService {
    private readonly stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(config.payments.stripe.secret_key  as string, {
        });
    }

    async createCheckoutSession(lineItems: any[]): Promise<Stripe.Checkout.Session | undefined> {
        try{
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
        catch(err){
            console.log({err})
        }
        
    }

    async webHook(body: any, sig: string) {

        let event: Stripe.Event;

        let secret = config.payments.stripe.web_hook_key as string;
          
          const payloadString = JSON.stringify(body, null, 2);
          
          const header = this.stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
          });
          
          
        try{
           event = this.stripe.webhooks.constructEvent(payloadString, header, secret);


        }catch(err){
            console.log({err})
        }

        return event;

    }

    async listCheckoutSessions(intent: string) {
        return await this.stripe.checkout.sessions.list({
            payment_intent: intent,
        });
    }
}
