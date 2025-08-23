export interface CreatePaymentDto {
  event: string;
  user: string;
  amount: number;
  currency: string;
  tickets: TicketPurchaseDto[];
  customerEmail: string;
}

export interface TicketPurchaseDto {
  name: string;
  foodIncluded: boolean;
  quantity: number;
  price: number;
}