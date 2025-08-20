import {
  ITokenService,
  TokenPayload,
} from '@/application/interfaces/ITokenService';
import { ERROR_MESSAGES } from '@/shared/constants/errorMessages';
import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';

@injectable()
export class TokenService implements ITokenService {
  private readonly accessTokenSecret: string = process.env
    .JWT_ACCESS_SECRET as string;
  private readonly refreshTokenSecret: string = process.env
    .JWT_REFRESH_SECRET as string;
  //   private readonly accessTokenExpiry: string = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
  //   private readonly refreshTokenExpiry: string = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: '15m',
      issuer: 'evenova',
      audience: 'app-users',
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: '7d',
      issuer: 'evenova',
      audience: 'app-users',
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.accessTokenSecret, {
        issuer: 'evenova',
        audience: 'app-users',
      }) as TokenPayload;
    } catch (_error) {
      throw new Error(ERROR_MESSAGES.TOKEN_INVALID);
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'evenova',
        audience: 'app-users',
      }) as TokenPayload;
    } catch (_error) {
      throw new Error(ERROR_MESSAGES.TOKEN_INVALID);
    }
  }
}
