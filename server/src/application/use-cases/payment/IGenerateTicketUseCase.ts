import { TicketPurchase } from "@/domain/entities/Payment";
import { Ticket } from "@/domain/entities/Ticket";

export interface IGenerateTicketUseCase {
  execute(params: GenerateTicketParams): Promise<Ticket[]>;
}

export interface GenerateTicketParams {
  paymentId: string;
  eventId: string;
  userId: string;
  tickets: TicketPurchase[];
  customerEmail: string;
}
