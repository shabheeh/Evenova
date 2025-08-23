import { TicketPurchase } from '@/domain/entities/Payment';

export interface IStripeService {
  createPaymentIntent(params: CreatePaymentIntentParams): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }>;
  verifyWebhookSignature(payload: string, signature: string): any;
}

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  eventId: string;
  tickets: TicketPurchase[];
  customerEmail: string;
}
