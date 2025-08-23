import { injectable } from 'inversify';
import { ITicketRepository } from '@/domain/repositories/ITicketRepository';
import { Ticket } from '@/domain/entities/Ticket';
import { BaseRepository } from './BaseRepository';
import { TicketDocument, TicketModel } from '../models/Ticket.model';

@injectable()
export class TicketRepository extends BaseRepository<TicketDocument> implements ITicketRepository {
  
    constructor() {
        super(TicketModel)
    }
  
    async save(ticket: Ticket): Promise<Ticket> {
    const ticketDoc = new this.model({
      event: ticket.event,
      user: ticket.user,
      paymentId: ticket.paymentId,
      name: ticket.name,
      price: ticket.price,
      foodIncluded: ticket.foodIncluded,
      quantity: ticket.quantity,
      qrCode: ticket.qrCode,
      isUsed: ticket.isUsed,
      usedAt: ticket.usedAt,
    });

    const savedDoc = await ticketDoc.save();
    return savedDoc;
  }

  async findByPaymentId(paymentId: string): Promise<Ticket[]> {
    const ticketDocs = await TicketModel.find({ paymentId }).exec();
    return ticketDocs;
  }

  async findByEventId(eventId: string): Promise<Ticket[]> {
    const ticketDocs = await TicketModel.find({ eventId }).exec();
    return ticketDocs;
  }

  async findByUserId(userId: string): Promise<Ticket[]> {
    const ticketDocs = await TicketModel.find({ userId }).exec();
    return ticketDocs;
  }

  async findByQRCode(qrCode: string): Promise<Ticket | null> {
    const ticketDoc = await TicketModel.findOne({ qrCode }).exec();
    return ticketDoc;
  }

  async markAsUsed(ticketId: string): Promise<void> {
    await TicketModel.findByIdAndUpdate(
      ticketId,
      {
        isUsed: true,
        usedAt: new Date(),
      },
      { new: true }
    ).exec();
  }

  async findUnusedTicketsByEvent(eventId: string): Promise<Ticket[]> {
    const ticketDocs = await TicketModel.find({
      eventId,
      isUsed: false,
    }).exec();
    return ticketDocs;
  }

  async countTicketsByEvent(eventId: string): Promise<number> {
    return await TicketModel.countDocuments({ eventId }).exec();
  }

}
