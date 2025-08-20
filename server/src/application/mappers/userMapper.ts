import { UserDto } from '../dtos/user/userDto';
import { UserDocument } from '@/infrastructure/database/models/User.model';

export const toUserDto = (user: UserDocument): UserDto => {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    phone: user.phone,
    roles: user.roles,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
