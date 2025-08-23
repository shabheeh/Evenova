import { injectable } from 'inversify';
import {
  IEventRepository,
  EventFilters,
} from '@/domain/repositories/IEventRepository';

import {
  EventModel,
  EventDocument,
  PopulatedEventDocument,
} from '../models/Event.model';
import { BaseRepository } from './BaseRepository';
import { FilterQuery } from 'mongoose';

interface PriceCondition {
  $gte?: number;
  $lte?: number;
}

@injectable()
export class EventRepository
  extends BaseRepository<EventDocument>
  implements IEventRepository
{
  constructor() {
    super(EventModel);
  }

  async findByOrganizer(
    organizerId: string,
    skip: number = 0,
    limit: number = 6
  ): Promise<PopulatedEventDocument[]> {
    return this.model
      .find({ organizer: organizerId, isActive: true })
      .populate('organizer')
      .skip(skip)
      .limit(limit)
      .exec() as unknown as PopulatedEventDocument[];
  }

  async findByIdAndPopulateOrganizer(
    id: string
  ): Promise<PopulatedEventDocument> {
    return (await this.model
      .findById(id)
      .populate('organizer')) as unknown as PopulatedEventDocument;
  }

  async findAll(
    filters: EventFilters = {},
    skip: number = 0,
    limit: number = 6
  ): Promise<PopulatedEventDocument[]> {
    const query: FilterQuery<EventFilters> = { isActive: true };

    if (filters.searchQuery) {
      const searchRegex = new RegExp(filters.searchQuery, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    if (filters.state) {
      query['location.state'] = new RegExp(filters.state, 'i');
    }
    if (filters.selectedDate) {
      const selectedDate = new Date(filters.selectedDate);
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

      query.startDateTime = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    if (filters.categories && filters.categories.length > 0) {
      query.category = { $in: filters.categories };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const ticketPriceConditions: PriceCondition = {};

      if (filters.minPrice !== undefined) {
        ticketPriceConditions.$gte = filters.minPrice;
      }

      if (filters.maxPrice !== undefined) {
        ticketPriceConditions.$lte = filters.maxPrice;
      }

      query.tickets = {
        $elemMatch: {
          price: ticketPriceConditions,
        },
      };
    }

    return (await this.model
      .find(query)
      .populate('organizer')
      .sort({ startDateTime: 1 })
      .skip(skip)
      .limit(limit)
      .exec()) as unknown as PopulatedEventDocument[];
  }

  async count(filters: EventFilters = {}): Promise<number> {
    const query: FilterQuery<EventFilters> = { isActive: true };

    if (filters.searchQuery) {
      const searchRegex = new RegExp(filters.searchQuery, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    if (filters.state) {
      query['location.state'] = new RegExp(filters.state, 'i');
    }

    if (filters.selectedDate) {
      const selectedDate = new Date(filters.selectedDate);
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

      query.startDateTime = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    if (filters.categories && filters.categories.length > 0) {
      query.category = { $in: filters.categories };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const ticketPriceConditions: PriceCondition = {};

      if (filters.minPrice !== undefined) {
        ticketPriceConditions.$gte = filters.minPrice;
      }

      if (filters.maxPrice !== undefined) {
        ticketPriceConditions.$lte = filters.maxPrice;
      }

      query.tickets = {
        $elemMatch: {
          price: ticketPriceConditions,
        },
      };
    }

    return await this.model.countDocuments(query).exec();
  }

  async findByCategory(
    category: string,
    skip: number = 0,
    limit: number = 6
  ): Promise<PopulatedEventDocument[]> {
    return (await this.model
      .find({ category: category.toLowerCase(), isActive: true })
      .skip(skip)
      .limit(limit)
      .populate('organizer')
      .exec()) as unknown as PopulatedEventDocument[];
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<EventDocument[]> {
    return await this.findMany({
      startDateTime: { $gte: startDate, $lte: endDate },
      isActive: true,
    });
  }

  async findByLocation(city: string, state?: string): Promise<EventDocument[]> {
    const query: FilterQuery<EventFilters> = {
      'location.city': new RegExp(city, 'i'),
      isActive: true,
    };

    if (state) {
      query['location.state'] = new RegExp(state, 'i');
    }

    return await this.findMany(query);
  }

  async updateAttendeeCount(id: string, increment: number): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      id,
      { $inc: { attendeesCount: increment } },
      { new: true }
    );
    return !!result;
  }
}
