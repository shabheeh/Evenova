import { Request, Response } from 'express';

export interface IEventController {
  createEvent(req: Request, res: Response): Promise<void>;
  updateEvent(req: Request, res: Response): Promise<void>;
  getEvent(req: Request, res: Response): Promise<void>;
  getEvents(req: Request, res: Response): Promise<void>;
  getMyEvents(req: Request, res: Response): Promise<void>;
}
