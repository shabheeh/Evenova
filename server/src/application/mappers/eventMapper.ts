import { Event } from '@/domain/entities/Event';
import { CreateEventDto } from '../dtos/events/CreateEventDto';
import { EventResponseDto } from '../dtos/events/EventResponseDto';
import { PopulatedEventDocument } from '@/infrastructure/database/models/Event.model';
import { Types } from 'mongoose';
import { toUserDto } from './userMapper';

export const createEventDtoToEntity = (
  dto: CreateEventDto,
  organizer: string
): Event => {
  const tickets = dto.tickets.map((ticket) => ({
    name: ticket.name,
    price: parseFloat(ticket.price),
    quantity: parseInt(ticket.quantity),
    available: parseInt(ticket.quantity),
    foodIncluded: ticket.foodIncluded,
  }));

  const location = dto.isOnline ? undefined : dto.location;

  return {
    title: dto.title.trim(),
    category: dto.category.toLowerCase(),
    description: dto.description.trim(),
    image: dto.image,
    startDateTime: new Date(dto.startDateTime),
    endDateTime: new Date(dto.endDateTime),
    isOnline: dto.isOnline,
    location,
    onlineLink: dto.onlineLink?.trim() || undefined,
    tickets,
    capacity: parseInt(dto.capacity.toString()),
    tags: dto.tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag),
    needJudges: dto.needJudges,
    judges: dto.judges || [],
    organizer: new Types.ObjectId(organizer),
    status: 'draft',
    isActive: true,
    attendeesCount: 0,
  };
};

export const eventToResponseDto = (
  event: PopulatedEventDocument
): EventResponseDto => {
  return {
    id: event.id,
    title: event.title,
    category: event.category,
    description: event.description,
    image: event.image,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime,
    isOnline: event.isOnline,
    location: event.location,
    onlineLink: event.onlineLink,
    tickets: event.tickets,
    capacity: event.capacity, 
    tags: event.tags,
    needJudges: event.needJudges,
    judges: event.judges,
    organizer: toUserDto(event.organizer),
    status: event.status,
    attendeesCount: event.attendeesCount,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
};
