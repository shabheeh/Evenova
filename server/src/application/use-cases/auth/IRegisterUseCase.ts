import { RegisterDto } from '@/application/dtos/auth/RegisterDto';
import { UserDto } from '@/application/dtos/user/userDto';

export interface IRegisterUseCase {
  execute(registerData: RegisterDto): Promise<UserDto>;
}
