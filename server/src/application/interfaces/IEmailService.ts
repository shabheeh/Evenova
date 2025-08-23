import { Ticket } from "@/domain/entities/Ticket";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface IEmailService {
  sendOtpEmail(email: string, otp: string, name: string): Promise<void>;
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendTicketsEmail(
    email: string, 
    tickets: Ticket[], 
    eventId: string
  ): Promise<void>
}
