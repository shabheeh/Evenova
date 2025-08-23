import { injectable, inject } from 'inversify';
import { TYPES } from '@/infrastructure/di/types';
import { PaymentStatus } from '@/domain/entities/Payment';
import { logger } from '@/infrastructure/config/logger';
import { IPaymentRepository } from '@/domain/repositories/IPaymentRespository';
import { IGenerateTicketUseCase } from './IGenerateTicketUseCase';
import { IProcessPaymentWebhookUseCase } from './IProcessPaymentWebhookUseCase';

@injectable()
export class ProcessPaymentWebhookUseCase implements IProcessPaymentWebhookUseCase {
  constructor(
    @inject(TYPES.IPaymentRepository) private paymentRepository: IPaymentRepository,
    @inject(TYPES.IGenerateTicketUseCase) private generateTicketUseCase: IGenerateTicketUseCase
  ) {}

  async execute(stripeEvent: any): Promise<void> {
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(stripeEvent.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(stripeEvent.data.object);
        break;
      default:
        logger.info(`Unhandled event type: ${stripeEvent.type}`);
    }
  }

  private async handlePaymentSucceeded(paymentIntent: any): Promise<void> {
    const payment = await this.paymentRepository.findByStripePaymentIntentId(paymentIntent.id);
    
    if (!payment) {
      logger.error(`Payment not found for Stripe Payment Intent: ${paymentIntent.id}`);
      return;
    }

    // Update payment status
    await this.paymentRepository.updateStatus(payment.id, PaymentStatus.SUCCEEDED);

    // Generate tickets
    await this.generateTicketUseCase.execute({
      paymentId: payment.id,
      eventId: payment.event,
      userId: payment.user.id,
      tickets: payment.tickets,
      customerEmail: paymentIntent.receipt_email
    });
  }

  private async handlePaymentFailed(paymentIntent: any): Promise<void> {
    const payment = await this.paymentRepository.findByStripePaymentIntentId(paymentIntent.id);
    
    if (payment) {
      await this.paymentRepository.updateStatus(payment.id, PaymentStatus.FAILED);
    }
  }
}