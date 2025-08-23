import { injectable, inject } from 'inversify';
import { TYPES } from '@/infrastructure/di/types';
import { IEventRepository } from '@/domain/repositories/IEventRepository';
import { BadRequestError } from '@/utils/errors';
import { createEventDtoToEntity, eventToResponseDto } from '../../mappers/eventMapper';
import { logger } from '@/infrastructure/config/logger';
import { CreateEventDto } from '../../dtos/events/CreateEventDto';
import { EventResponseDto } from '../../dtos/events/EventResponseDto';
import { ICreateEventUseCase } from './ICreateEventUseCase';

@injectable()
export class CreateEventUseCase implements ICreateEventUseCase {
  constructor(
    @inject(TYPES.IEventRepository) private eventRepository: IEventRepository,
  ) {}

  async execute(
    eventData: CreateEventDto,
    organizerId: string
  ): Promise<EventResponseDto> {
    try {
      logger.info('Creating new event', {
        title: eventData.title,
        organizerId,
      });

      const startDate = new Date(eventData.startDateTime);
      const endDate = new Date(eventData.endDateTime);
      const now = new Date();

      if (startDate < now) {
        throw new BadRequestError('Event start date cannot be in the past');
      }

      if (endDate <= startDate) {
        throw new BadRequestError('Event end date must be after start date');
      }

      const totalTickets = eventData.tickets.reduce(
        (sum, ticket) => sum + parseInt(ticket.quantity),
        0
      );
      if (totalTickets !== parseInt(eventData.capacity.toString())) {
        throw new BadRequestError(
          'Total ticket quantity must equal event capacity'
        );
      }

      if (
        eventData.needJudges &&
        (!eventData.judges || eventData.judges.length === 0)
      ) {
        throw new BadRequestError(
          'At least one judge is required when judges are needed'
        );
      }

      const eventEntity = createEventDtoToEntity(eventData, organizerId);

      const savedEvent = await this.eventRepository.create(eventEntity);
      const event = await this.eventRepository.findByIdAndPopulateOrganizer(savedEvent.id)
      logger.info('Event created successfully', {
        eventId: savedEvent.id,
        title: savedEvent.title,
      });

      return eventToResponseDto(event);
    } catch (error) {
        logger.error('Failed to create event', {
        error: error instanceof Error ? error.message : 'Unknown error',
        organizerId,
        eventData: { title: eventData.title },
      });
      throw error;
    }
  }
}
 