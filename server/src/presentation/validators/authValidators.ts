import { BadRequestError } from '@/utils/errors';
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

const loginSchema = z.object({
  email: z.email({ message: 'Please provide a valid email address' }),
  password: z.string().min(8, { message: 'Invalid password' }),
});

const registerSchema = z.object({
  email: z.email({ message: 'Please provide a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50),
  phone: z.string().optional(),
  role: z.enum(['attendee', 'organizer']).optional(),
});

export const validateLogin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const message = err.issues?.[0]?.message ?? 'Invalid input';
      throw new BadRequestError(message);
    }
    throw err;
  }
};

export const validateRegister = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const message = err.issues?.[0]?.message ?? 'Invalid input';
      throw new BadRequestError(message);
    }
    throw err;
  }
};
