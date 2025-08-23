import { EventResponseDto } from '@/application/dtos/events/EventResponseDto';
import { GetEventsQuery } from './GetEventsUseCase';

export interface IGetEventsUseCase {
  execute(query: GetEventsQuery): Promise<{
    events: EventResponseDto[];
    total: number;
    skip: number;
    limit: number;
    hasMore: boolean;
  }>;
}
 