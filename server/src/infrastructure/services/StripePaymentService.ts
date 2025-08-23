import {
  CreatePaymentIntentParams,
  IStripeService,
} from '@/application/interfaces/IStripeService';
import { injectable } from 'inversify';
import Stripe from 'stripe';
import { logger } from '../config/logger';

@injectable()
export class StripeService implements IStripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-07-30.basil',
    });
  }

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }> {

    logger.debug("strpes service")
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100), // Convert to cents
      currency: params.currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        eventId: params.eventId,
        tickets: JSON.stringify(params.tickets),
      },
      receipt_email: params.customerEmail,
    }); 

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  }

  verifyWebhookSignature(payload: string, signature: string): any {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err}`);
    }
  }
}
