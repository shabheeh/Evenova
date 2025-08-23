import { IQRCodeService } from '@/application/interfaces/IQRCodeService';
import { injectable } from 'inversify';
import QRCode from 'qrcode';


@injectable()
export class QRCodeService implements IQRCodeService {
  async generateQRCode(data: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return qrCodeDataURL;
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error}`);
    }
  }
}