import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { BadRequestError } from '@/utils/errors';

const ticketSchema = z.object({
  name: z.string().min(1, 'Ticket name is required'),
  price: z.string().regex(/^\d+(\.\d{2})?$/, 'Invalid price format'),
  quantity: z.string().regex(/^\d+$/, 'Quantity must be a number'),
  foodIncluded: z.boolean(),
});

const judgeSchema = z.object({
  name: z.string().min(1, 'Judge name is required'),
  email: z.string().email('Valid email is required'),
  expertise: z.string().min(1, 'Expertise is required'),
  bio: z.string().optional(),
});

export const createEventSchema = z
  .object({
    title: z.string().min(1, 'Event name is required').max(100),
    category: z.string().min(1, 'Category is required').max(50),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(2000),
    image: z.string().url('Image must be a valid URL'),
    startDateTime: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      })
      .transform((val) => new Date(val))
      .refine((date) => date > new Date(), {
        message: 'Start date must be in the future',
      }),
    endDateTime: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid end date format',
      })
      .transform((val) => new Date(val)),
    isOnline: z.boolean(),
    location: z.object({
      venue: z.string().min(1, 'Venue is required').optional(),
      address: z.string().min(1, 'Address is required').optional(),
      city: z.string().min(1, 'City is required').optional(),
      state: z.string().min(1, 'State is required').optional(),
      zip: z
        .string()
        .regex(/^[1-9][0-9]{5}$/, 'Invalid ZIP code')
        .optional(),
    }),
    onlineLink: z.string().url('Invalid URL').optional(),
    tickets: z.array(ticketSchema).min(1, 'At least one ticket is required'),
    capacity: z.string().regex(/^\d+$/, 'Capacity must be a number'),
    tags: z.string().min(1, 'Tags are required'),
    needJudges: z.boolean(),
    judges: z.array(judgeSchema).optional(),
  })

  .refine((data) => data.endDateTime.getTime() > data.startDateTime.getTime(), {
    message: 'End date must be after start date',
    path: ['endDateTime'],
  })

  .refine(
    (data) => {
      if (!data.isOnline) {
        return (
          data.location.venue &&
          data.location.address &&
          data.location.city &&
          data.location.state &&
          data.location.zip
        );
      }
      return true;
    },
    {
      message: 'All location fields are required for in-person events',
      path: ['location'],
    }
  )
  .refine(
    (data) => {
      if (data.isOnline) {
        return !!data.onlineLink;
      }
      return true;
    },
    {
      message: 'Online link is required for online events',
      path: ['location.onlineLink'],
    }
  )

  .refine(
    (data) => {
      if (data.needJudges) {
        return data.judges && data.judges.length > 0;
      }
      return true;
    },
    {
      message: 'Add at least one judge or turn off Judges Needed',
      path: ['judges'],
    }
  )
  .refine(
    (data) => {
      const ticketQtySum = data.tickets.reduce(
        (acc, t) => acc + Number(t.quantity),
        0
      );
      return Number(data.capacity) === ticketQtySum;
    },
    {
      message: 'Capacity must equal the sum of all ticket quantities',
      path: ['capacity'],
    }
  );

export type CreateEventDto = z.infer<typeof createEventSchema>;

export const validateCreateEvent = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    req.body = createEventSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const message = err.issues?.[0]?.message ?? 'Invalid input';
      throw new BadRequestError(message);
    }
  }
};

export const validateUpdateEvent = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const updateSchema = createEventSchema.partial();
  try {
    req.body = updateSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const message = err.issues?.[0]?.message ?? 'Invalid input';
      throw new BadRequestError(message);
    }
    throw err;
  }
};
