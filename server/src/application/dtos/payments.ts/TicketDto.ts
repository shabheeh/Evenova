export interface TicketDto {
  id: string;
  eventId: string;
  ticketType: string;
  price: number;
  qrCode: string;
  attendeeName: string;
  attendeeEmail: string;
  isUsed: boolean;
  createdAt: Date;
  usedAt?: Date;
}