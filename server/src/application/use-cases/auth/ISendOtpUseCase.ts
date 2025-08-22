import { SendOtpDto } from '@/application/dtos/auth/SendOtpDto';

export interface ISendOtpUseCase {
  execute(data: SendOtpDto): Promise<{ success: boolean; message: string }>;
}
