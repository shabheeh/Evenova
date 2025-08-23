import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '@/infrastructure/di/types';
import { IProcessPaymentWebhookUseCase } from '@/application/use-cases/payment/IProcessPaymentWebhookUseCase';
import { IStripeService } from '@/application/interfaces/IStripeService';
import { logger } from '@/infrastructure/config/logger';


@injectable()
export class WebhookController {
  constructor(
    @inject(TYPES.IStripeService) private stripeService: IStripeService,
    @inject(TYPES.IProcessPaymentWebhookUseCase) 
    private processPaymentWebhookUseCase: IProcessPaymentWebhookUseCase
  ) {}

  async handleStripeWebhook(req: Request, res: Response): Promise<void> {
    const signature = req.headers['stripe-signature'] as string;
    const payload = req.body;

    try {

      const event = this.stripeService.verifyWebhookSignature(payload, signature);

      await this.processPaymentWebhookUseCase.execute(event);

      res.json({ received: true });
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
      res.status(400).json({ error: 'Webhook signature verification failed' });
    }
  }
}