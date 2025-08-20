import { Role } from '@/domain/entities/User';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  phone: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}
