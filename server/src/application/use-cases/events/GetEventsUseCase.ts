import { injectable, inject } from 'inversify';
import { TYPES } from '@/infrastructure/di/types';
import {
  IEventRepository,
  EventFilters,
} from '@/domain/repositories/IEventRepository';
import { EventResponseDto } from '../../dtos/events/EventResponseDto';
import { eventToResponseDto } from '../../mappers/eventMapper';
import { IGetEventsUseCase } from './IGetEventsUseCase';

export interface FilterState {
  searchQuery: string;
  location: string;
  selectedDate: Date | undefined;
  selectedCategories: string[];
  priceRange: [number, number];
}

export interface GetEventsQuery extends FilterState {
  skip?: number;
  limit?: number;
}

@injectable()
export class GetEventsUseCase implements IGetEventsUseCase {
  constructor(
    @inject(TYPES.IEventRepository) private eventRepository: IEventRepository
  ) {}

  async execute(query: GetEventsQuery): Promise<{
    events: EventResponseDto[];
    total: number;
    skip: number;
    limit: number;
    hasMore: boolean;
  }> {
    const skip = Math.max(0, query.skip || 0);
    const limit = Math.min(50, Math.max(1, query.limit || 6));

    const filters: EventFilters = {};

    if (query.searchQuery && query.searchQuery.trim()) {
      filters.searchQuery = query.searchQuery.trim();
    }

    if (query.location && query.location.trim()) {
      filters.state = query.location.trim();
    }

    if (query.selectedDate) {
      filters.selectedDate = query.selectedDate;
    }

    if (query.selectedCategories && query.selectedCategories.length > 0) {
      filters.categories = query.selectedCategories;
    }

    if (
      query.priceRange &&
      Array.isArray(query.priceRange) &&
      query.priceRange.length === 2
    ) {
      const [minPrice, maxPrice] = query.priceRange;
      if (minPrice >= 0) filters.minPrice = minPrice;
      if (maxPrice >= 0) filters.maxPrice = maxPrice;
    }

    const events = await this.eventRepository.findAll(filters, skip, limit + 1);

    const hasMore = events.length > limit;
    const actualEvents = hasMore ? events.slice(0, limit) : events;

    const total = await this.eventRepository.count(filters);

    return {
      events: actualEvents.map(eventToResponseDto),
      total,
      skip, 
      limit, 
      hasMore,
    };
  }
}
