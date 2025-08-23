import { injectable, inject } from 'inversify';
import { TYPES } from '@/infrastructure/di/types';

import { PaymentStatus } from '@/domain/entities/Payment';
import { IStripeService } from '@/application/interfaces/IStripeService';
import { IPaymentRepository } from '@/domain/repositories/IPaymentRespository';
import { CreatePaymentDto } from '@/application/dtos/payments.ts/CreatePaymentDto';
import { logger } from '@/infrastructure/config/logger';
import { ICreatePaymentIntentUseCase } from './ICreatePaymentIntentUseCase';



@injectable()
export class CreatePaymentIntentUseCase implements ICreatePaymentIntentUseCase {
  constructor(
    @inject(TYPES.IStripeService) private stripeService: IStripeService,
    @inject(TYPES.IPaymentRepository) private paymentRepository: IPaymentRepository
  ) {

  }

  async execute(dto: CreatePaymentDto): Promise<{ clientSecret: string; paymentId: string }> {
    
    const stripeResult = await this.stripeService.createPaymentIntent({
      amount: dto.amount,
      currency: dto.currency,
      eventId: dto.event,
      tickets: dto.tickets,
      customerEmail: dto.customerEmail,
    });

    
    const payment = {
      stripePaymentIntentId: stripeResult.paymentIntentId,
      event: dto.event,
      user: dto.user,
      amount: dto.amount,
      currency: dto.currency,
      status: PaymentStatus.PENDING,
      tickets: dto.tickets,
      customerEmail: dto.customerEmail
  };

    logger.debug(payment)

    const savedPayment = await this.paymentRepository.save(payment);


    return {
      clientSecret: stripeResult.clientSecret,
      paymentId: savedPayment.id
    };
  }
}