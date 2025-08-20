import { AuthResponseDto } from '@/application/dtos/auth/AuthResponseDto';
import { LoginDto } from '@/application/dtos/auth/LoginDto';

export interface ILoginUseCase {
  execute(loginData: LoginDto): Promise<AuthResponseDto>;
}
