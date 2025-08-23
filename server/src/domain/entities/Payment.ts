export interface Payment {
  event: string;
  user: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  tickets: TicketPurchase[];
  createdAt: Date,
  updatedAt: Date,
}


export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface TicketPurchase {
  name: string;
  foodIncluded: boolean;
  quantity: number;
  price: number;
}