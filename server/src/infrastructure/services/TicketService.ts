import { injectable, inject } from 'inversify';
import { TYPES } from '@/infrastructure/di/types';
// import sharp from 'sharp';
import { IEventRepository } from '@/domain/repositories/IEventRepository';
import { TicketDocument } from '../database/models/Ticket.model';
import { ITicketService } from '@/application/interfaces/ITicketService';

@injectable()
export class TicketService implements ITicketService {
  constructor(
    @inject(TYPES.IEventRepository) private eventRepository: IEventRepository
  ) {}

  async generateTicketImage(ticket: TicketDocument, eventId: string): Promise<string> {
    const event = await this.eventRepository.findById(eventId);
    
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }

    // const ticketTemplate = sharp('assets/ticket-template.png')
    //   .resize(800, 300);

    // Create overlay with event details
    // const ticketSvg = `
    //   <svg width="800" height="300">
    //     <text x="50" y="60" font-family="Arial" font-size="24" font-weight="bold">${event.title}</text>
    //     <text x="50" y="90" font-family="Arial" font-size="16">${new Date(event.startDateTime).toLocaleDateString()}</text>
    //     <text x="50" y="110" font-family="Arial" font-size="14">${event.location?.venue || 'Online Event'}</text>
    //     <text x="50" y="140" font-family="Arial" font-size="16">Ticket Type: ${ticket.name}</text>
    //     <text x="50" y="160" font-family="Arial" font-size="14">Ticket ID: ${ticket.id}</text>
    //     <text x="50" y="180" font-family="Arial" font-size="14">Price: $${ticket.price}</text>
    //   </svg>
    // `;

    // const qrCodeBuffer = Buffer.from(ticket.qrCode.split(',')[1], 'base64');
    
    // const ticketImage = await ticketTemplate
    //   .composite([
    //     {
    //       input: Buffer.from(ticketSvg),
    //       top: 0,
    //       left: 0
    //     },
    //     {
    //       input: qrCodeBuffer,
    //       top: 50,
    //       left: 600
    //     }
    //   ])
    //   .png()
    //   .toBuffer();

    const filename = `ticket-${ticket.id}.png`;
    // await this.saveTicketImage(ticketImage, filename);

    return filename;
  }
}