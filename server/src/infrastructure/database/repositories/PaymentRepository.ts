import { injectable } from 'inversify';
import { Payment, PaymentStatus } from '@/domain/entities/Payment';
import { BaseRepository } from './BaseRepository';
import { PaymentDocument, PaymentDocumentPopulatedUser, PaymentModel } from '../models/Payment.model';
import { CreatePaymentDocumentDto, IPaymentRepository } from '@/domain/repositories/IPaymentRespository';
import { logger } from '@/infrastructure/config/logger';

@injectable()
export class PaymentRepository
  extends BaseRepository<PaymentDocument>
  implements IPaymentRepository
{
  constructor() {
    super(PaymentModel);
  }
  async save(payment: CreatePaymentDocumentDto): Promise<PaymentDocument> {
    
    logger.debug(payment)

    const paymentDoc = new this.model({
      stripePaymentIntentId: payment.stripePaymentIntentId,
      event: payment.event,
      user: payment.user,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      tickets: payment.tickets,
    });

    const savedDoc = await paymentDoc.save();
    return savedDoc;
  }

  async findByStripePaymentIntentId(stripeId: string): Promise<PaymentDocumentPopulatedUser | null> {
    const paymentDoc = await PaymentModel.findOne({
      stripePaymentIntentId: stripeId,
    }).populate("user").exec();
    return paymentDoc as unknown as PaymentDocumentPopulatedUser;
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    const paymentDocs = await PaymentModel.find({ userId }).exec();
    return paymentDocs;
  }

  async findByEventId(eventId: string): Promise<Payment[]> {
    const paymentDocs = await PaymentModel.find({ eventId }).exec();
    return paymentDocs;
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<void> {
    await PaymentModel.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    ).exec();
  }

  async updateStripePaymentIntentId(
    id: string,
    stripeId: string
  ): Promise<void> {
    await PaymentModel.findByIdAndUpdate(
      id,
      { stripePaymentIntentId: stripeId },
      { new: true }
    ).exec();
  }

  async findSuccessfulPaymentsByEvent(eventId: string): Promise<Payment[]> {
    const paymentDocs = await PaymentModel.find({
      eventId,
      status: PaymentStatus.SUCCEEDED,
    }).exec();
    return paymentDocs;
  }

  async getTotalRevenue(eventId: string): Promise<number> {
    const result = await PaymentModel.aggregate([
      {
        $match: {
          eventId,
          status: PaymentStatus.SUCCEEDED,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]).exec();

    return result.length > 0 ? result[0].total : 0;
  }
}
