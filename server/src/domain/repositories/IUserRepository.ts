import { UserDocument } from '@/infrastructure/database/models/User.model';
import { IBaseRepository } from './IBaseRepository';

export interface IUserRepository extends IBaseRepository<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
  emailExists(email: string): Promise<boolean>;
}
