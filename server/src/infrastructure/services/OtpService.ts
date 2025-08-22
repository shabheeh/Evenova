import { injectable } from 'inversify';
import crypto from 'crypto';
import { IOtpService } from '@/application/interfaces/IOtpService';

@injectable()
export class OtpService implements IOtpService {
  private readonly HASH_SECRET = process.env.OTP_HASH_SECRET || 'default-otp-secret';

  generateOtp(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }

  generateOtpHash(otp: string, email: string): string {
    const data = `${otp}:${email}:${this.HASH_SECRET}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  verifyOtp(otp: string, email: string, hash: string): boolean {
    const generatedHash = this.generateOtpHash(otp, email);
    return generatedHash === hash;
  }
}
