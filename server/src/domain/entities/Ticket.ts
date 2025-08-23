export interface Ticket {
  event: string;
  user: string;
  name: string;
  paymentId: string;
  quantity: number;
  foodIncluded: boolean;
  price: number;
  qrCode: string;
  isUsed: boolean;
  usedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
