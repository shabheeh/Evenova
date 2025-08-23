import { injectable } from 'inversify';
import Redis from 'ioredis';
import { IRedisService } from '@/application/interfaces/IRedisService';
import { logger } from '@/infrastructure/config/logger';

@injectable()
export class RedisService implements IRedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.client.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    this.client.on('error', (error) => {
      logger.error('Redis connection error:', { error });
    });
  }

  async set(
    key: string,
    value: string,
    expireInSeconds: number = 300
  ): Promise<void> {
    try {
      await this.client.setex(key, expireInSeconds, value);
      logger.debug('Redis key set successfully', { key, expireInSeconds });
    } catch (error) {
      logger.error('Redis set operation failed', { key, error });
      throw new Error('Failed to store data in Redis');
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      logger.debug('Redis key retrieved', { key, found: !!value });
      return value;
    } catch (error) {
      logger.error('Redis get operation failed', { key, error });
      throw new Error('Failed to retrieve data from Redis');
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.client.del(key);
      logger.debug('Redis key deleted', { key, deleted: result > 0 });
      return result > 0;
    } catch (error) {
      logger.error('Redis delete operation failed', { key, error });
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis exists operation failed', { key, error });
      return false;
    }
  }
}
