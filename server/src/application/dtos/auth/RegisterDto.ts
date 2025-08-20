import { Role } from '@/domain/entities/User';

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  phone: string;
  roles: Role[];
}
