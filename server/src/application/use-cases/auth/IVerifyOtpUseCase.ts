import { VerifyOtpDto } from '@/application/dtos/auth/VerifyOtpDto';
import { UserDto } from '@/application/dtos/user/userDto';

export interface IVerifyOtpUseCase {
  execute(data: VerifyOtpDto): Promise<UserDto>;
}
