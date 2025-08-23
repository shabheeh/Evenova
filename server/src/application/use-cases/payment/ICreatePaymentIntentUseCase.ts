import { CreatePaymentDto } from "@/application/dtos/payments.ts/CreatePaymentDto";

export interface ICreatePaymentIntentUseCase {
  execute(dto: CreatePaymentDto): Promise<{ clientSecret: string; paymentId: string }>
}

export interface CreatePaymentIntentRequest {
  eventId: string;
  userId: string;
  customerEmail: string;
  tickets: {
    ticketTypeId: string;
    quantity: number;
    attendeeName?: string;
  }[];
  currency?: string;
}
