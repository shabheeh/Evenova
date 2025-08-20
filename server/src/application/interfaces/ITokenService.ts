import { Role } from '@/domain/entities/User';

export interface TokenPayload {
  id: string;
  email: string;
  roles: Role[];
}

export interface ITokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
}
