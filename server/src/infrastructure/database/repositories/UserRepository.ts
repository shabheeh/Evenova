import { injectable } from 'inversify';
import { BaseRepository } from './BaseRepository';
import { UserDocument, UserModel } from '../models/User.model';
import { IUserRepository } from '@/domain/repositories/IUserRepository';

@injectable()
export class UserRepository
  extends BaseRepository<UserDocument>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.findOne({ email: email.toLocaleLowerCase() });
  }

  async emailExists(email: string): Promise<boolean> {
    return await this.exists({ email: email.toLowerCase() });
  }
}
