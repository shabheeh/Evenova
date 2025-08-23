export interface IProcessPaymentWebhookUseCase  {
  execute(stripeEvent: any): Promise<void>;
}

export interface ProcessPaymentRequest {
  paymentIntentId: string;
  eventId: string;
  userId: string;
  customerEmail: string;
  tickets: {
    ticketTypeId: string;
    quantity: number;
    attendeeName?: string;
  }[];
}
