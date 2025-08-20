import { IAuthService } from '@/application/interfaces/IAuthService';
import bcrypt from 'bcryptjs';
import { injectable } from 'inversify';

@injectable()
export class AuthService implements IAuthService {
  private readonly saltRounds = 12;

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
