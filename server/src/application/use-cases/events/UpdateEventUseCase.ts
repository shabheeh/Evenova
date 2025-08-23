import { injectable, inject } from 'inversify';
import { TYPES } from '@/infrastructure/di/types';
import { IEventRepository } from '@/domain/repositories/IEventRepository';
import { CreateEventDto } from '../../dtos/events/CreateEventDto';
import { EventResponseDto } from '../../dtos/events/EventResponseDto';
import { eventToResponseDto } from '../../mappers/eventMapper';

import { logger } from '@/infrastructure/config/logger';
import { IUpdateEventUseCase } from './IUpdateEventUseCase';
import { ForbiddenError, NotFoundError } from '@/utils/errors';
import { EventDocument } from '@/infrastructure/database/models/Event.model';

@injectable()
export class UpdateEventUseCase implements IUpdateEventUseCase {
  constructor(
    @inject(TYPES.IEventRepository) private eventRepository: IEventRepository
  ) {}

  async execute(
    eventId: string,
    eventData: Partial<CreateEventDto>,
    userId: string
  ): Promise<EventResponseDto> {
    try {
      logger.info('Updating event', { eventId, userId });

      const existingEvent = await this.eventRepository.findById(eventId);
      if (!existingEvent) {
        throw new NotFoundError('Event not found');
      }

      if (existingEvent.organizer.toString() !== userId) {
        throw new ForbiddenError('You can only update your own events');
      }

      const updateData = {} as EventDocument;

      if (eventData.title)
        updateData.title = eventData.title.trim();
      if (eventData.category)
        updateData.category = eventData.category.toLowerCase();
      if (eventData.description)
        updateData.description = eventData.description.trim();
      if (eventData.image) updateData.image = eventData.image;
      if (eventData.startDateTime)
        updateData.startDateTime = new Date(eventData.startDateTime);
      if (eventData.endDateTime)
        updateData.endDateTime = new Date(eventData.endDateTime);

      if (eventData.isOnline !== undefined) {
        updateData.isOnline = eventData.isOnline;

        if (!eventData.isOnline && eventData.location) {
          updateData.location = eventData.location;
        } else if (eventData.isOnline) {
          updateData.onlineLink = eventData.onlineLink;
        }
      }

      if (eventData.tickets) {
        updateData.tickets = eventData.tickets.map((ticket) => ({
          name: ticket.name,
          price: parseFloat(ticket.price),
          quantity: parseInt(ticket.quantity),
          available: parseInt(ticket.quantity),
          foodIncluded: ticket.foodIncluded,
        }));
      }

      if (eventData.capacity)
        updateData.capacity = parseInt(eventData.capacity.toString());
      if (eventData.tags)
        updateData.tags = eventData.tags
          .split(',')
          .map((tag) => tag.trim().toLowerCase());
      if (eventData.needJudges !== undefined)
        updateData.needJudges = eventData.needJudges;
      if (eventData.judges) updateData.judges = eventData.judges;

      const updatedEvent = await this.eventRepository.update(
        eventId,
        updateData
      );
      if (!updatedEvent) {
        throw new NotFoundError('Failed to update event');
      }

      const event = await this.eventRepository.findByIdAndPopulateOrganizer(
        updatedEvent.id
      );

      logger.info('Event updated successfully', {
        eventId: updatedEvent.id,
        title: updatedEvent.title,
      });

      return eventToResponseDto(event);
    } catch (error) {
      logger.error('Failed to update event', {
        error: error instanceof Error ? error.message : 'Unknown error',
        eventId,
        userId,
      });
      throw error;
    }
  }
}
