import { Ticket } from "../entities/Ticket";

export interface ITicketRepository {
  save(ticket: Ticket): Promise<Ticket>;
  findById(id: string): Promise<Ticket | null>;
  findByPaymentId(paymentId: string): Promise<Ticket[]>;
  findByEventId(eventId: string): Promise<Ticket[]>;
  markAsUsed(ticketId: string): Promise<void>;
}