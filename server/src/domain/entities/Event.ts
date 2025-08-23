import { Types } from "mongoose";

export interface Judge {
  name: string;
  email: string;
  expertise: string;
  bio?: string;
}

export interface Ticket {
  name: string;
  price: number;
  quantity: number;
  available: number;
  foodIncluded: boolean;
}

export interface Location {
  venue: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface Event {
  title: string;
  category: string;
  description: string;
  image: string;
  startDateTime: Date;
  endDateTime: Date;
  isOnline: boolean;
  location: Location | undefined;
  onlineLink?: string | undefined;
  tickets: Ticket[];
  capacity: number;
  tags: string[];
  needJudges: boolean;
  judges: Judge[];
  organizer: Types.ObjectId;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  isActive: boolean;
  attendeesCount: number;
  // createdAt: Date,
  // updatedAt: Date,
}
