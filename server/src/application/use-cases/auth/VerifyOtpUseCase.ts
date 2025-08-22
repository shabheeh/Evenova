import { injectable, inject } from 'inversify';
import { VerifyOtpDto } from '@/application/dtos/auth/VerifyOtpDto';
import { UserDto } from '@/application/dtos/user/userDto';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IRedisService } from '@/application/interfaces/IRedisService';
import { IOtpService } from '@/application/interfaces/IOtpService';
import { IEmailService } from '@/application/interfaces/IEmailService';
import { toUserDto } from '@/application/mappers/userMapper';
import { logger } from '@/infrastructure/config/logger';
import { TYPES } from '@/infrastructure/di/types';
import { ERROR_MESSAGES } from '@/shared/constants/errorMessages';
import { BadRequestError, NotFoundError } from '@/utils/errors';
import { Role } from '@/domain/entities/User';
import { IVerifyOtpUseCase } from './IVerifyOtpUseCase';

interface TempUserData {
  email: string;
  password: string;
  name: string;
  phone: string;
  location: string;
  roles: Role[];
  otpHash: string;
  timestamp: number;
}

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IRedisService) private redisService: IRedisService,
    @inject(TYPES.IOtpService) private otpService: IOtpService,
    @inject(TYPES.IEmailService) private emailService: IEmailService
  ) {}

  async execute(data: VerifyOtpDto): Promise<UserDto> {
    try {
      const redisKey = `temp_user:${data.email}`;
      
      const tempDataStr = await this.redisService.get(redisKey);
      if (!tempDataStr) {
        logger.warn('OTP verification failed - no temp data found', { email: data.email });
        throw new NotFoundError('OTP expired or invalid. Please request a new OTP.');
      }

      const tempUserData: TempUserData = JSON.parse(tempDataStr);

      const isValidOtp = this.otpService.verifyOtp(data.otp, data.email, tempUserData.otpHash);
      if (!isValidOtp) {
        logger.warn('OTP verification failed - invalid OTP', { email: data.email });
        throw new BadRequestError('Invalid OTP. Please try again.');
      }

      const existingUser = await this.userRepository.emailExists(tempUserData.email);
      if (existingUser) {
        logger.warn('OTP verification failed - email already exists', { email: data.email });
        await this.redisService.delete(redisKey);
        throw new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }

      const userData = {
        email: tempUserData.email,
        password: tempUserData.password,
        name: tempUserData.name,
        phone: tempUserData.phone,
        location: tempUserData.location,
        roles: tempUserData.roles,
      };

      const user = await this.userRepository.create(userData);

      await this.redisService.delete(redisKey);

      await this.emailService.sendWelcomeEmail(user.email, user.name);

      logger.info('User registration completed successfully', { 
        email: data.email,
        userId: user.id 
      });

      return toUserDto(user);
    } catch (error) {
      logger.error('Verify OTP use case failed', {
        email: data.email,
        error: error instanceof Error ? error.message : 'unknown error',
      });
      throw error;
    }
  }
}
