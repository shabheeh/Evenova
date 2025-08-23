import { container } from '@/infrastructure/di/inversify.config';
import { Router } from 'express';
import { IEventController } from '../interfaces/IEventController';
import { TYPES } from '@/infrastructure/di/types';
import { catchAsync } from '../middlewares/errorHandler';
import { authenticate } from '../middlewares/authMiddleware';
import { validateCreateEvent } from '../validators/eventValidators';

const router = Router();

const eventController = container.get<IEventController>(TYPES.IEventControllr);

router.get('/', catchAsync(eventController.getEvents));
router.get('/:id', catchAsync(eventController.getEvent));

router.use(authenticate);

router.post('/', validateCreateEvent, catchAsync(eventController.createEvent));

export { router as eventRoutes };
