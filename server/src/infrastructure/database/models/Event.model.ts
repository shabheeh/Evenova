import mongoose, { Schema, Document } from 'mongoose';
import { Event } from '@/domain/entities/Event';
import { UserDocument } from './User.model';

export interface EventDocument extends Event, Document {
  createdAt: Date;
  updatedAt: Date;
}
export interface PopulatedEventDocument
  extends Omit<Event, 'organizer'>,
    Document {
  organizer: UserDocument;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema(
  {
    venue: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  { _id: false }
);

const TicketSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    available: { type: Number, required: true, min: 0 },
    foodIncluded: { type: Boolean, default: false },
  },
  { _id: false }
);

const JudgeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    expertise: { type: String, required: true },
    bio: { type: String },
  },
  { _id: false }
);

const EventSchema = new Schema<EventDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    startDateTime: {
      type: Date,
      required: true,
      index: true,
    },
    endDateTime: {
      type: Date,
      required: true,
      index: true,
    },
    isOnline: {
      type: Boolean,
      required: true,
      index: true,
    },
    location: {
      type: LocationSchema,
      required: false,
    },
    onlineLink: {
      type: String,
    },
    tickets: {
      type: [TicketSchema],
      required: true,
      validate: {
        validator: (tickets) => tickets && tickets.length > 0,
        message: 'At least one ticket type is required',
      },
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    tags: {
      type: [String],
      required: true,
      index: true,
    },
    needJudges: {
      type: Boolean,
      required: true,
    },
    judges: {
      type: [JudgeSchema],
      default: [],
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
      default: 'draft',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    attendeesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const EventModel = mongoose.model<EventDocument>('Event', EventSchema);
