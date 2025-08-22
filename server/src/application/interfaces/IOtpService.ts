export interface IOtpService {
  generateOtp(): string;
  generateOtpHash(otp: string, email: string): string;
  verifyOtp(otp: string, email: string, hash: string): boolean;
}
