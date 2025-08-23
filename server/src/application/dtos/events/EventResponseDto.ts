import { UserDto } from "../user/userDto";

export interface EventResponseDto {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  startDateTime: Date;
  endDateTime: Date;
  isOnline: boolean;
  location?: {
    venue: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  } | undefined;
  onlineLink?: string | undefined;
  tickets: {
    name: string;
    price: number;
    quantity: number;
    available: number;
    foodIncluded: boolean;
  }[];
  capacity: number;
  tags: string[];
  needJudges: boolean;
  judges: {
    name: string;
    email: string;
    expertise: string;
    bio?: string;
  }[];
  organizer: UserDto;
  status: string;
  attendeesCount: number;
  createdAt: Date;
  updatedAt: Date;
}
