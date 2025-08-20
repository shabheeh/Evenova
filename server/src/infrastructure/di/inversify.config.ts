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
import { IRegisterUseCase } from '@/application/use-cases/auth/IRegisterUseCase';
import { RegisterUseCase } from '@/application/use-cases/auth/RegisterUseCase';
import { IAuthController } from '@/presentation/interfaces/IAuthController';
import { AuthController } from '@/presentation/controllers/AuthController';

export const container = new Container();

// services
container
  .bind<IAuthService>(TYPES.IAuthService)
  .to(AuthService)
  .inSingletonScope();
container
  .bind<ITokenService>(TYPES.ITokenService)
  .to(TokenService)
  .inSingletonScope();

// repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);

// use cases
container.bind<ILoginUseCase>(TYPES.ILoginUseCase).to(LoginUseCase);
container.bind<IRegisterUseCase>(TYPES.IRegisterUseCase).to(RegisterUseCase);

// controller
container.bind<IAuthController>(TYPES.IAuthController).to(AuthController);
