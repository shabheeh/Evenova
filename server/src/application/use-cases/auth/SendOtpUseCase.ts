import { injectable, inject } from 'inversify';
import { SendOtpDto } from '@/application/dtos/auth/SendOtpDto';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IRedisService } from '@/application/interfaces/IRedisService';
import { IOtpService } from '@/application/interfaces/IOtpService';
import { IEmailService } from '@/application/interfaces/IEmailService';
import { IAuthService } from '@/application/interfaces/IAuthService';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { logger } from '@/infrastructure/config/logger';
import { TYPES } from '@/infrastructure/di/types';
import { ERROR_MESSAGES } from '@/shared/constants/errorMessages';
import { ConflictError } from '@/utils/errors';
import { ISendOtpUseCase } from './ISendOtpUseCase';

@injectable()
export class SendOtpUseCase implements ISendOtpUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IRedisService) private redisService: IRedisService,
    @inject(TYPES.IOtpService) private otpService: IOtpService,
    @inject(TYPES.IEmailService) private emailService: IEmailService,
    @inject(TYPES.IAuthService) private authService: IAuthService
  ) {}

  async execute(data: SendOtpDto): Promise<{ success: boolean; message: string }> {
    try {
      const email = new Email(data.email);
      const password = new Password(data.password);

      const existingUser = await this.userRepository.emailExists(email.getValue());
      if (existingUser) {
        logger.warn('OTP send failed - email already exists', { email: data.email });
        throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }

      const hashedPassword = await this.authService.hashPassword(password.getValue());

      const otp = this.otpService.generateOtp();
      const otpHash = this.otpService.generateOtpHash(otp, email.getValue());

      const tempUserData = {
        email: email.getValue(),
        password: hashedPassword,
        name: data.name.trim(),
        phone: data.phone.trim(),
        roles: data.roles || 'attendee',
        otpHash,
        timestamp: Date.now(),
      };

      const redisKey = `temp_user:${email.getValue()}`;
      await this.redisService.set(redisKey, JSON.stringify(tempUserData), 300);

      await this.emailService.sendOtpEmail(email.getValue(), otp, data.name);

      logger.info('OTP sent successfully', { email: data.email });

      return {
        success: true,
        message: 'OTP sent to your email. Please verify to complete registration.',
      };
    } catch (error) {
      logger.error('Send OTP use case failed', {
        email: data.email,
        error: error instanceof Error ? error.message : 'unknown error',
      });
      throw error;
    }
  }
}
