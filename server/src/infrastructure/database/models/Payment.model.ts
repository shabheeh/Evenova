import { UserDto } from '@/application/dtos/user/userDto';
import { Payment, PaymentStatus } from '@/domain/entities/Payment';
import { Document, model, Schema } from 'mongoose';

export interface PaymentDocument extends Payment, Document {}

export interface PaymentDocumentPopulatedUser extends Omit<Payment, "user">, Document {
    user: UserDto;
}

const PaymentSchema = new Schema<PaymentDocument>(
  {
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    event: {
      type: String,
      required: true,
      ref: 'Event',
    },
    user: {
      type: String,
      required: true,
      ref: 'User',
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'inr',
      lowercase: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    tickets: [
      {
        name: {
          type: String,
          required: true,
        },
        foodIncluded: {
            type: Boolean,
            default: false,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const PaymentModel = model<PaymentDocument>('Payment', PaymentSchema);