import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import { connectDatabase } from './infrastructure/config/database';
import indexRoutes from './presentation/routes/index.routes';
import { httpLogger } from './presentation/middlewares/httpLogger';
import { errorHandler } from './presentation/middlewares/errorHandler';
import { logger } from './infrastructure/config/logger';
import { NotFoundError } from './utils/errors';
import { ERROR_MESSAGES } from './shared/constants/errorMessages';

const app = express();
const PORT = process.env.PORT || 5000;
const RATE_LIMIT_WINDOW_MS =
  Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS =
  Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: {
    error: ERROR_MESSAGES.TOO_MANY_REQUESTS,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

if (process.env.NODE_ENV === 'production') {
  app.use(limiter);
}

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(
  express.json({
    limit: '10mb',
    type: 'application/json',
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

app.use(compression());
app.use(cookieParser());
app.use(httpLogger);

app.get('/health', (_req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      used:
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total:
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
    },
  };

  logger.info('Health check accessed', { healthCheck });
  res.status(200).json(healthCheck);
});

app.use('/api', indexRoutes);

app.use('*catchAll', (req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    logger.info('Database connection established');

    const server = app.listen(PORT, () => {
      logger.info(
        `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
        {
          port: PORT,
          environment: process.env.NODE_ENV,
          nodeVersion: process.version,
          timestamp: new Date().toISOString(),
        }
      );
    });

    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      server.close((err) => {
        if (err) {
          logger.error('Error during server shutdown:', err);
          process.exit(1);
        }

        logger.info('Server closed successfully');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
};

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception - Server will exit:', {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

process.on(
  'unhandledRejection',
  (reason: unknown, promise: Promise<unknown>) => {
    const errorMessage =
      reason instanceof Error
        ? reason.message
        : typeof reason === 'string'
          ? reason
          : 'Unknown rejection reason';

    const errorStack = reason instanceof Error ? reason.stack : undefined;

    logger.error('Unhandled Rejection - Server will exit:', {
      reason: errorMessage,
      stack: errorStack,
      promise: promise.toString(),
    });
    process.exit(1);
  }
);

startServer();

export default app;
