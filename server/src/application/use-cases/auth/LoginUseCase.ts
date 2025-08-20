import { AuthResponseDto } from '@/application/dtos/auth/AuthResponseDto';
import { LoginDto } from '@/application/dtos/auth/LoginDto';
import { IAuthService } from '@/application/interfaces/IAuthService';
import { ITokenService } from '@/application/interfaces/ITokenService';
import { toUserDto } from '@/application/mappers/userMapper';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { logger } from '@/infrastructure/config/logger';
import { TYPES } from '@/infrastructure/di/types';
import { ERROR_MESSAGES } from '@/shared/constants/errorMessages';
import { AuthError, AuthErrorCode, NotFoundError } from '@/utils/errors';
import { inject, injectable } from 'inversify';
import { ILoginUseCase } from './ILoginUseCase';

@injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IAuthService) private authService: IAuthService,
    @inject(TYPES.ITokenService) private tokenService: ITokenService
  ) {}

  async execute(loginData: LoginDto): Promise<AuthResponseDto> {
    try {
      const user = await this.userRepository.findByEmail(loginData.email);
      if (!user) {
        logger.warn('Login failed - user not found', {
          email: loginData.email,
        });
        throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
      }
      const isValidPassword = await this.authService.comparePassword(
        loginData.password,
        user.password
      );
      if (!isValidPassword) {
        logger.warn('login failed - invalid password');
        throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS);
      }

      const tokenPayload = {
        id: user._id.toString(),
        email: user.email,
        roles: user.roles,
      };

      const accessToken = this.tokenService.generateAccessToken(tokenPayload);
      const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

      const safeUser = toUserDto(user);

      logger.info('login successfull');

      return {
        user: safeUser,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      logger.error('login use case failed', {
        email: loginData.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}
