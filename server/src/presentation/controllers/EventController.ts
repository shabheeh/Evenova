import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/infrastructure/di/types';
import { HTTP_STATUS } from '@/shared/constants/httpStatusCodes';
import { ICreateEventUseCase } from '@/application/use-cases/events/ICreateEventUseCase';
import { IUpdateEventUseCase } from '@/application/use-cases/events/IUpdateEventUseCase';
import { IGetEventUseCase } from '@/application/use-cases/events/IGetEventUseCase';
import { IGetEventsUseCase } from '@/application/use-cases/events/IGetEventsUseCase';
import { BadRequestError } from '@/utils/errors';
import { ERROR_MESSAGES } from '@/shared/constants/errorMessages';
import { IEventController } from '../interfaces/IEventController';
import { AuthRequest } from '../middlewares/authMiddleware';

@injectable()
export class EventController implements IEventController {
  constructor(
    @inject(TYPES.ICreateEventUseCase)
    private createEventUseCase: ICreateEventUseCase,
    @inject(TYPES.IUpdateEventUseCase)
    private updateEventUseCase: IUpdateEventUseCase,
    @inject(TYPES.IGetEventUseCase) private getEventUseCase: IGetEventUseCase,
    @inject(TYPES.IGetEventsUseCase) private getEventsUseCase: IGetEventsUseCase
  ) {}

  createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    const event = await this.createEventUseCase.execute(req.body, req.user!.id);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  };

  updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError(ERROR_MESSAGES.REQUIRED_FIELD_MISSING);
    }

    const event = await this.updateEventUseCase.execute(
      id,
      req.body,
      req.user!.id
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  };

  getEvent = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError(ERROR_MESSAGES.REQUIRED_FIELD_MISSING);
    }
    const event = await this.getEventUseCase.execute(id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Event retrieved successfully',
      data: event,
    });
  };

  getEvents = async (req: Request, res: Response): Promise<void> => {
    const query = {
      searchQuery: (req.query.searchQuery as string) || '',
      location: (req.query.location as string) || '',
      selectedDate: req.query.selectedDate
        ? new Date(req.query.selectedDate as string)
        : undefined,
      selectedCategories: req.query.selectedCategories
        ? (req.query.selectedCategories as string)
            .split(',')
            .map((cat) => cat.trim())
        : [],
      priceRange: req.query.priceRange
        ? (JSON.parse(req.query.priceRange as string) as [number, number])
        : ([0, Infinity] as [number, number]),
      skip: parseInt(req.query.skip as string) || 0,
      limit: parseInt(req.query.limit as string) || 6,
    };

    const result = await this.getEventsUseCase.execute(query);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Events retrieved successfully',
      data: result,
    });
  };

  getMyEvents = async (_req: Request, res: Response): Promise<void> => {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'My events retrieved successfully',
      data: [],
    });
  };
}
