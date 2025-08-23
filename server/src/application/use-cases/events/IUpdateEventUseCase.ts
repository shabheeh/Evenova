import { CreateEventDto } from '@/application/dtos/events/CreateEventDto';
import { EventResponseDto } from '@/application/dtos/events/EventResponseDto';

export interface IUpdateEventUseCase {
  execute(
    eventId: string,
    eventData: Partial<CreateEventDto>,
    userId: string
  ): Promise<EventResponseDto>;
}
