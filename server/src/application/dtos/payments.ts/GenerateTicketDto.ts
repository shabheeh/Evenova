import { TicketPurchaseDto } from "./CreatePaymentDto";

export interface GenerateTicketDto {
  paymentId: string;
  eventId: string;
  userId: string;
  tickets: TicketPurchaseDto[];
  customerEmail: string;
}