import { container } from '@/infrastructure/di/inversify.config';
import express, { Router } from 'express';
import { IPaymentController } from '../interfaces/IPaymentController';
import { TYPES } from '@/infrastructure/di/types';
import { IWebhookController } from '../interfaces/IWebhookController';
import { authenticate } from '../middlewares/authMiddleware';
import { catchAsync } from '../middlewares/errorHandler';

const router = Router();

const paymentController = container.get<IPaymentController>(
  TYPES.IPaymentController
);
const webhookController = container.get<IWebhookController>(
  TYPES.IWebhookController
);

router.use(authenticate);

router.post('/create-payment-intent', catchAsync(paymentController.createPaymentIntent))
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  webhookController.handleStripeWebhook
);

export { router as paymentRoutes };