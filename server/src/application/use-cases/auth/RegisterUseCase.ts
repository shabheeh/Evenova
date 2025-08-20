import { RegisterDto } from '@/application/dtos/auth/RegisterDto';
import { UserDto } from '@/application/dtos/user/userDto';
import { IAuthService } from '@/application/interfaces/IAuthService';
import { toUserDto } from '@/application/mappers/userMapper';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { logger } from '@/infrastructure/config/logger';
import { TYPES } from '@/infrastructure/di/types';
import { ERROR_MESSAGES } from '@/shared/constants/errorMessages';
import { ConflictError } from '@/utils/errors';
import { inject, injectable } from 'inversify';

@injectable()
export class RegisterUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IAuthService) private authService: IAuthService
  ) {}

  async execute(registerData: RegisterDto): Promise<UserDto> {
    try {
      const email = new Email(registerData.email);
      const password = new Password(registerData.password);

      const existingUser = await this.userRepository.emailExists(
        email.getValue()
      );

      if (existingUser) {
        logger.warn('Registration failed - email already existes', {
          email: registerData.email,
        });

        throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }

      const hashedPassword = await this.authService.hashPassword(
        password.getValue()
      );

      const userData = {
        email: email.getValue(),
        password: hashedPassword,
        name: registerData.name.trim(),
        phone: registerData.phone.trim(),
        roles: registerData.roles || ('attendee' as const),
      };

      const user = await this.userRepository.create(userData);

      const safeUser = toUserDto(user);

      return safeUser;
    } catch (error) {
      logger.error('Registration use case failed', {
        email: registerData.email,
        error: error instanceof Error ? error.message : 'unknown error',
      });
      throw error;
    }
  }
}
