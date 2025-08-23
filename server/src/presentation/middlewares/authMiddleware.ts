import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../application/interfaces/ITokenService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { AuthError, AuthErrorCode } from '@/utils/errors';
import { container } from '@/infrastructure/di/inversify.config';
import { TYPES } from '@/infrastructure/di/types';
import { Role } from '@/domain/entities/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: Role[];
  };
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new AuthError(AuthErrorCode.UNAUTHENTICATED);
    }

    const tokenService = container.get<ITokenService>(TYPES.ITokenService);
    const payload = tokenService.verifyAccessToken(token);

    const userRepository = container.get<IUserRepository>(
      TYPES.IUserRepository
    );
    const user = await userRepository.findById(payload.id);

    if (!user) {
      throw new AuthError(AuthErrorCode.USER_NOT_FOUND);
    }

    req.user = {
      id: payload.id,
      email: payload.email,
      roles: payload.roles,
    };

    next();
  } catch (_error) {
    next(new AuthError(AuthErrorCode.INVALID_TOKEN));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthError(AuthErrorCode.UNAUTHENTICATED));
    }

    const hasRole = req.user.roles.some((role) => roles.includes(role));
    if (!hasRole) {
      return next(new AuthError(AuthErrorCode.UNAUTHORIZED));
    }

    next();
  };
};
