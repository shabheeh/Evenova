import { injectable, inject } from 'inversify';
import { Response } from 'express';
import { TYPES } from '@/infrastructure/di/types';
import { CreatePaymentDto } from '@/application/dtos/payments.ts/CreatePaymentDto';
import { AuthRequest } from '../middlewares/authMiddleware';
import { ICreatePaymentIntentUseCase } from '@/application/use-cases/payment/ICreatePaymentIntentUseCase';
import { AuthError, AuthErrorCode } from '@/utils/errors';
import { logger } from '@/infrastructure/config/logger';
import { IPaymentController } from '../interfaces/IPaymentController';

@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject(TYPES.ICreatePaymentIntentUseCase)
    private createPaymentIntentUseCase: ICreatePaymentIntentUseCase
  ) {}

   createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {

      if (!req.user) {
        throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
      }

      const dto: CreatePaymentDto = {
        event: req.body.eventId,
        user: req.user.id,
        amount: req.body.amount,
        currency: req.body.currency || 'inr',
        tickets: req.body.tickets,
        customerEmail: req.body.customerEmail,
      };

      logger.debug("before ")
      const result = await this.createPaymentIntentUseCase.execute(dto);
      logger.debug("after")
      res.json({
        success: true,
        data: result,
      });
  }
}
