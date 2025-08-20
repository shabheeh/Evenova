import { User } from '@/domain/entities/User';
import mongoose, { HydratedDocument, Schema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
    },
    roles: {
      type: [String],
      enum: ['attendee', 'organizer', 'admin'],
      default: ['attendee'],
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
