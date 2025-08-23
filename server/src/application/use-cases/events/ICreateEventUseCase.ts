import { CreateEventDto } from '@/application/dtos/events/CreateEventDto';
import { EventResponseDto } from '@/application/dtos/events/EventResponseDto';

export interface ICreateEventUseCase {
  execute(
    eventData: CreateEventDto,
    organizerId: string
  ): Promise<EventResponseDto>;
}
