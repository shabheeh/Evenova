import { injectable, inject } from 'inversify';
import { TYPES } from '@/infrastructure/di/types';
import { IEventRepository } from '@/domain/repositories/IEventRepository';
import { EventResponseDto } from '../../dtos/events/EventResponseDto';
import { eventToResponseDto } from '../../mappers/eventMapper';
import { NotFoundError } from '@/utils/errors';
import { IGetEventUseCase } from './IGetEventUseCase';

@injectable()
export class GetEventUseCase implements IGetEventUseCase {
  constructor(
    @inject(TYPES.IEventRepository) private eventRepository: IEventRepository
  ) {}

  async execute(eventId: string): Promise<EventResponseDto> {
    const event = await this.eventRepository.findByIdAndPopulateOrganizer(eventId);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    return eventToResponseDto(event);
  }
}
