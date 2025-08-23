import { injectable, inject } from 'inversify';
import { TYPES } from '@/infrastructure/di/types';
import { ITicketRepository } from '@/domain/repositories/ITicketRepository';
import { Ticket } from '@/domain/entities/Ticket';
import { IEmailService } from '@/application/interfaces/IEmailService';
// import { ITicketService } from '@/application/interfaces/ITicketService';
import { IQRCodeService } from '@/application/interfaces/IQRCodeService';
import { GenerateTicketParams } from './IGenerateTicketUseCase';


@injectable()
export class GenerateTicketUseCase {
  constructor(
    @inject(TYPES.ITicketRepository)
    private ticketRepository: ITicketRepository,
    @inject(TYPES.IQRCodeService) private qrCodeService: IQRCodeService,
    @inject(TYPES.ITicketService)
    // private ticketGenerationService: ITicketService,
    // @inject(TYPES.IEmailService)
    private emailService: IEmailService
  ) {}

  async execute(params: GenerateTicketParams): Promise<Ticket[]> {
    const generatedTickets: Ticket[] = [];

    for (const ticketPurchase of params.tickets) {
      
        const qrData = JSON.stringify({
          event: params.eventId,
          payment: params.paymentId,
          name: ticketPurchase.name,
          quantity: ticketPurchase.quantity,
          foodIncluded: ticketPurchase.foodIncluded,
          price: ticketPurchase.price,
          timestamp: new Date().toISOString(),
        });

        const qrCode = await this.qrCodeService.generateQRCode(qrData);

        const ticket = {
          event: params.eventId,
          user: params.userId,
          paymentId: params.paymentId,
          name: ticketPurchase.name,
          quantity: ticketPurchase.quantity,
          foodIncluded: ticketPurchase.foodIncluded,
          price: ticketPurchase.price,
          qrCode: qrCode,
        } as Ticket

        const savedTicket = await this.ticketRepository.save(ticket);
        generatedTickets.push(savedTicket);

        // await this.ticketGenerationService.generateTicketImage(
        //   savedTicket,
        //   params.eventId
        // );
    }

    await this.emailService.sendTicketsEmail(
      params.customerEmail,
      generatedTickets,
      params.eventId
    );

    return generatedTickets;
  }
}
