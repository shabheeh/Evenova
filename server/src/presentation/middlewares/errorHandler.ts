import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let customError = err;
  if (!(customError instanceof AppError)) {
    customError = new AppError(
      customError.message || 'Internal Server Error',
      500,
      'error'
    );
  }

  const appError = customError as AppError;

  const response = {
    success: false,
    status: appError.status,
    code: appError.code,
    message: appError.message,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    // ...(process.env.NODE_ENV === 'development' && { stack: appError.stack }),
  };

  res.status(appError.statusCode).json(response);
};

export const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => next(new AppError(`Route ${req.originalUrl} not found`, 404, 'fail'));
