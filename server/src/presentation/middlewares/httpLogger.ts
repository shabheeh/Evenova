import { Request, Response, NextFunction } from 'express';
import Logger from '../../infrastructure/config/logger';

export interface LogRequest extends Request {
  startTime?: number;
}

export const httpLogger = (req: LogRequest, res: Response, next: NextFunction): void => {
  req.startTime = Date.now();

  const { method, url, ip } = req;
  const userAgent = req.get('User-Agent') || '';

  Logger.http(`${method} ${url} - ${ip} - ${userAgent}`);

  res.on('finish', () => {
    const duration = Date.now() - (req.startTime || 0);
    const { statusCode } = res;
    const contentLength = res.get('Content-Length') || 0;

    Logger.http(`${method} ${url} - ${statusCode} - ${contentLength} bytes - ${duration}ms`);
  });

  next();
};
