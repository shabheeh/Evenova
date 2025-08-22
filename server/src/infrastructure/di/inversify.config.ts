import { IAuthService } from '@/application/interfaces/IAuthService';
import { Container } from 'inversify';
import { TYPES } from './types';
import { AuthService } from '../services/AuthService';
import { ITokenService } from '@/application/interfaces/ITokenService';
import { TokenService } from '../services/TokenService';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { UserRepository } from '../database/repositories/UserRepository';
import { ILoginUseCase } from '@/application/use-cases/auth/ILoginUseCase';
import { LoginUseCase } from '@/application/use-cases/auth/LoginUseCase';
import { IAuthController } from '@/presentation/interfaces/IAuthController';
import { AuthController } from '@/presentation/controllers/AuthController';
import { IEmailService } from '@/application/interfaces/IEmailService';
import { EmailService } from '../services/EmailService';
import { IRedisService } from '@/application/interfaces/IRedisService';
import { RedisService } from '../services/RedisService';
import { IOtpService } from '@/application/interfaces/IOtpService';
import { OtpService } from '../services/OtpService';
import { ISendOtpUseCase } from '@/application/use-cases/auth/ISendOtpUseCase';
import { SendOtpUseCase } from '@/application/use-cases/auth/SendOtpUseCase';
import { IVerifyOtpUseCase } from '@/application/use-cases/auth/IVerifyOtpUseCase';
import { VerifyOtpUseCase } from '@/application/use-cases/auth/VerifyOtpUseCase';

export const container = new Container();

container
  .bind<IAuthService>(TYPES.IAuthService)
  .to(AuthService)
  .inSingletonScope();
container
  .bind<ITokenService>(TYPES.ITokenService)
  .to(TokenService)
  .inSingletonScope();
container.bind<IEmailService>(TYPES.IEmailService).to(EmailService);
container.bind<IRedisService>(TYPES.IRedisService).to(RedisService);
container.bind<IOtpService>(TYPES.IOtpService).to(OtpService);


// repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);

// use cases
container.bind<ILoginUseCase>(TYPES.ILoginUseCase).to(LoginUseCase);
container.bind<ISendOtpUseCase>(TYPES.ISendOtpUseCase).to(SendOtpUseCase);
container.bind<IVerifyOtpUseCase>(TYPES.IVerifyOtpUseCase).to(VerifyOtpUseCase);

// controller
container.bind<IAuthController>(TYPES.IAuthController).to(AuthController);
