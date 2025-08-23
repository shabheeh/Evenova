export interface CreateEventDto {
  title: string;
  category: string;
  description: string;
  image: string;
  startDateTime: Date;
  endDateTime: Date;
  isOnline: boolean;
  location?: Location;
  onlineLink?: string | undefined;
  tickets: TicketDto[];
  capacity: number;
  tags: string;
  needJudges: boolean;
  judges?: JudgeDto[];
}

export interface TicketDto {
  name: string;
  price: string;
  quantity: string;
  foodIncluded: boolean;
}

export interface JudgeDto {
  name: string;
  email: string;
  expertise: string;
  bio?: string;
}

export interface Location {
  venue: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}
