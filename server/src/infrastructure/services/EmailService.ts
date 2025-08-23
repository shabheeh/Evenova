import { injectable } from 'inversify';
import nodemailer from 'nodemailer';
import {
  IEmailService,
  EmailOptions,
} from '@/application/interfaces/IEmailService';
import { logger } from '@/infrastructure/config/logger';
import { TicketDocument } from '../database/models/Ticket.model';

@injectable()
export class EmailService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtpEmail(email: string, otp: string, name: string): Promise<void> {
    const emailOptions: EmailOptions = {
      to: email,
      subject: 'Verify Your Email - Event Management Platform',
      html: this.getOtpEmailTemplate(otp, name),
      text: `Hi ${name}, Your OTP for email verification is: ${otp}. This OTP will expire in 5 minutes.`,
    };

    await this.sendEmail(emailOptions);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const emailOptions: EmailOptions = {
      to: email,
      subject: 'Welcome to Event Management Platform',
      html: this.getWelcomeEmailTemplate(name),
      text: `Welcome ${name}! Your account has been successfully created.`,
    };

    await this.sendEmail(emailOptions);
  }

  private async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Evenova" <${process.env.SMTP_USER}>`,
        ...options,
      });
      logger.info('Email sent successfully', {
        to: options.to,
        subject: options.subject,
      });
    } catch (error) {
      logger.error('Failed to send email', { error, to: options.to });
      throw new Error('Failed to send email');
    }
  }

  async sendTicketsEmail(
    email: string,
    tickets: TicketDocument[],
  ): Promise<void> {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Your Event Tickets',
      html: this.generateTicketEmailHTML(tickets),
      attachments: tickets.map((ticket) => ({
        filename: `ticket-${ticket.id}.png`,
        path: `uploads/tickets/ticket-${ticket.id}.png`,
        cid: ticket.id,
      })),
    };

    await this.transporter.sendMail(mailOptions);
  }

  private getOtpEmailTemplate(otp: string, name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #f9fafb; }
            .otp-box { background-color: white; border: 2px solid #4f46e5; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #4f46e5; letter-spacing: 4px; }
            .footer { background-color: #374151; color: white; padding: 20px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Thank you for registering with Evenova Please use the following OTP to verify your email address:</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              <p><strong>This OTP will expire in 5 minutes.</strong></p>
              <p>If you didn't request this verification, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Evenova All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #f9fafb; }
            .footer { background-color: #374151; color: white; padding: 20px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Event Platform!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Welcome to Evenova Your account has been successfully created and verified.</p>
              <p>You can now:</p>
              <ul>
                <li>Browse and register for events</li>
                <li>Create and manage your own events (if you're an organizer)</li>
                <li>Purchase tickets and manage your bookings</li>
              </ul>
              <p>Thank you for joining us!</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Evenova All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateTicketEmailHTML(tickets: TicketDocument[]): string {
    return `
      <html>
        <body>
          <h2>Your Event Tickets</h2>
          <p>Thank you for your purchase! Please find your tickets attached.</p>
          
          <h3>Ticket Details:</h3>
          <ul>
            ${tickets
              .map(
                (ticket) => `
              <li>
                <strong>${ticket.name}</strong> - $${ticket.price}
                <br>Ticket ID: ${ticket.id}
                <br><img src="cid:${ticket.id}" alt="QR Code" width="150">
              </li>
            `
              )
              .join('')}
          </ul>
          
          <p>Please bring these tickets (either printed or on your mobile device) to the event.</p>
          <p>The QR codes will be scanned for entry.</p>
          
          <p>Thank you and enjoy the event!</p>
        </body>
      </html>
    `;
  }
}
