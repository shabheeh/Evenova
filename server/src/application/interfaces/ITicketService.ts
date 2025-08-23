import { Ticket } from '@/domain/entities/Ticket';

export interface ITicketService {
  generateTicketImage(ticket: Ticket, eventId: string): Promise<string>;
}
