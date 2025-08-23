export interface IQRCodeService {
  generateQRCode(data: string): Promise<string>;
}