import {
  EventDocument,
  PopulatedEventDocument,
} from '@/infrastructure/database/models/Event.model';

import { IBaseRepository } from './IBaseRepository';

export interface IEventRepository extends IBaseRepository<EventDocument> {
  findByOrganizer(
    organizerId: string,
    skip?: number,
    limit?: number
  ): Promise<PopulatedEventDocument[]>;
  findByCategory(
    category: string,
    skip?: number,
    limit?: number
  ): Promise<PopulatedEventDocument[]>;
  findAll(
    filters?: EventFilters,
    skip?: number,
    limit?: number
  ): Promise<PopulatedEventDocument[]>;
  findByIdAndPopulateOrganizer(id: string): Promise<PopulatedEventDocument>;
  findByDateRange(startDate: Date, endDate: Date): Promise<EventDocument[]>;
  findByLocation(city: string, state?: string): Promise<EventDocument[]>;
  updateAttendeeCount(id: string, increment: number): Promise<boolean>;
  count(filters: EventFilters): Promise<number>;
}

export interface EventFilters {
  searchQuery?: string;
  state?: string;
  selectedDate?: Date;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  city?: string;
  isOnline?: boolean;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
}
