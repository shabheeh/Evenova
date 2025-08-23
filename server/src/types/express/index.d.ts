import { TokenPayload } from '../../application/interfaces/ITokenService';
declare global {
  namespace Express {
    export interface Request {
      user?: TokenPayload;
    }
  }
}
