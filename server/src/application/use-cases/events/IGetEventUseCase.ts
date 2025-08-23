import { EventResponseDto } from '@/application/dtos/events/EventResponseDto';

export interface IGetEventUseCase {
  execute(eventId: string): Promise<EventResponseDto>;
}
