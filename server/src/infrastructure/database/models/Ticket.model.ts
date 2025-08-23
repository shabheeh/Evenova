import { Ticket } from '@/domain/entities/Ticket';
import { Document, model, Schema } from 'mongoose';

export interface TicketDocument extends Ticket, Document {}

const TicketSchema = new Schema<TicketDocument>(
  {
    event: {
      type: String,
      required: true,
      ref: 'Event',
    },
    user: {
      type: String,
      required: true,
      ref: 'User',
    },
    paymentId: {
      type: String,
      required: true,
      ref: 'Payment',
    },
    foodIncluded: {
      type: Boolean,
      required: true,
      default: false,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    qrCode: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

TicketSchema.index({ eventId: 1, isUsed: 1 });

export const TicketModel = model<TicketDocument>('Ticket', TicketSchema);
