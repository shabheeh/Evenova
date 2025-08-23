export interface PaymentIntentDto {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
  receipt_email?: string;
  metadata: {
    eventId: string;
    tickets: string;
  };
}