import mongoose from 'mongoose';
import Logger from './logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    await mongoose.connect(mongoUri);

    Logger.info('MongoDB Atlas connected successfully');
  } catch (error) {
    Logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  Logger.info('MongoDB connection established');
});

mongoose.connection.on('error', error => {
  Logger.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  Logger.warn('MongoDB connection disconnected');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    Logger.info('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    Logger.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});
