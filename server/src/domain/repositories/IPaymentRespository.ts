import { PaymentDocument, PaymentDocumentPopulatedUser } from "@/infrastructure/database/models/Payment.model";
import { Payment, PaymentStatus } from "../entities/Payment";
import { CreatePaymentDto } from "@/application/dtos/payments.ts/CreatePaymentDto";

export interface IPaymentRepository {
  save(payment: CreatePaymentDocumentDto): Promise<PaymentDocument>;
  findById(id: string): Promise<Payment | null>;
  findByStripePaymentIntentId(stripeId: string): Promise<PaymentDocumentPopulatedUser | null>;
  updateStatus(id: string, status: PaymentStatus): Promise<void>;
}

export interface CreatePaymentDocumentDto extends CreatePaymentDto {
    stripePaymentIntentId: string;
    status: PaymentStatus;
}