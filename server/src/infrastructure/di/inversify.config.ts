import { IAuthService } from '@/application/interfaces/IAuthService';
import { Container } from 'inversify';
import { TYPES } from './types';
import { AuthService } from '../services/AuthService';
import { ITokenService } from '@/application/interfaces/ITokenService';
import { TokenService } from '../services/TokenService';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { UserRepository } from '../database/repositories/UserRepository';
import { ILoginUseCase } from '@/application/use-cases/auth/ILoginUseCase';
import { LoginUseCase } from '@/application/use-cases/auth/LoginUseCase';
import { IAuthController } from '@/presentation/interfaces/IAuthController';
import { AuthController } from '@/presentation/controllers/AuthController';
import { IEmailService } from '@/application/interfaces/IEmailService';
import { EmailService } from '../services/EmailService';
import { IRedisService } from '@/application/interfaces/IRedisService';
import { RedisService } from '../services/RedisService';
import { IOtpService } from '@/application/interfaces/IOtpService';
import { OtpService } from '../services/OtpService';
import { ISendOtpUseCase } from '@/application/use-cases/auth/ISendOtpUseCase';
import { SendOtpUseCase } from '@/application/use-cases/auth/SendOtpUseCase';
import { IVerifyOtpUseCase } from '@/application/use-cases/auth/IVerifyOtpUseCase';
import { VerifyOtpUseCase } from '@/application/use-cases/auth/VerifyOtpUseCase';
import { IEventRepository } from '@/domain/repositories/IEventRepository';
import { EventRepository } from '../database/repositories/EventRepository';
import { ICreateEventUseCase } from '@/application/use-cases/events/ICreateEventUseCase';
import { CreateEventUseCase } from '@/application/use-cases/events/CreateEventUseCase';
import { IUpdateEventUseCase } from '@/application/use-cases/events/IUpdateEventUseCase';
import { UpdateEventUseCase } from '@/application/use-cases/events/UpdateEventUseCase';
import { IGetEventUseCase } from '@/application/use-cases/events/IGetEventUseCase';
import { IGetEventsUseCase } from '@/application/use-cases/events/IGetEventsUseCase';
import { GetEventUseCase } from '@/application/use-cases/events/GetEventUseCase';
import { GetEventsUseCase } from '@/application/use-cases/events/GetEventsUseCase';
import { IEventController } from '@/presentation/interfaces/IEventController';
import { EventController } from '@/presentation/controllers/EventController';
import { IStripeService } from '@/application/interfaces/IStripeService';
import { StripeService } from '../services/StripePaymentService';
import { IQRCodeService } from '@/application/interfaces/IQRCodeService';
import { QRCodeService } from '../services/QRCodeService';
import { IPaymentRepository } from '@/domain/repositories/IPaymentRespository';
import { PaymentRepository } from '../database/repositories/PaymentRepository';
import { ITicketRepository } from '@/domain/repositories/ITicketRepository';
import { TicketRepository } from '../database/repositories/TicketRepository';
import { ICreatePaymentIntentUseCase } from '@/application/use-cases/payment/ICreatePaymentIntentUseCase';
import { CreatePaymentIntentUseCase } from '@/application/use-cases/payment/CreatePaymentIntentUseCase';
import { IGenerateTicketUseCase } from '@/application/use-cases/payment/IGenerateTicketUseCase';
import { GenerateTicketUseCase } from '@/application/use-cases/payment/GenerateTicketUseCase ';
import { IProcessPaymentWebhookUseCase } from '@/application/use-cases/payment/IProcessPaymentWebhookUseCase';
import { ProcessPaymentWebhookUseCase } from '@/application/use-cases/payment/ProcessPaymentWebhookUseCase';
import { IPaymentController } from '@/presentation/interfaces/IPaymentController';
import { PaymentController } from '@/presentation/controllers/PaymentController';
import { IWebhookController } from '@/presentation/interfaces/IWebhookController';
import { WebhookController } from '@/presentation/controllers/WebhookController';
import { ITicketService } from '@/application/interfaces/ITicketService';
import { TicketService } from '../services/TicketService';

export const container = new Container();

container
  .bind<IAuthService>(TYPES.IAuthService)
  .to(AuthService)
  .inSingletonScope();
container
  .bind<ITokenService>(TYPES.ITokenService)
  .to(TokenService)
  .inSingletonScope();
container.bind<IEmailService>(TYPES.IEmailService).to(EmailService);
container.bind<IRedisService>(TYPES.IRedisService).to(RedisService);
container.bind<IOtpService>(TYPES.IOtpService).to(OtpService);
container.bind<IStripeService>(TYPES.IStripeService).to(StripeService);
container.bind<IQRCodeService>(TYPES.IQRCodeService).to(QRCodeService)
container.bind<ITicketService>(TYPES.ITicketService).to(TicketService)

// repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IEventRepository>(TYPES.IEventRepository).to(EventRepository);
container.bind<IPaymentRepository>(TYPES.IPaymentRepository).to(PaymentRepository);
container.bind<ITicketRepository>(TYPES.ITicketRepository).to(TicketRepository);

// use cases
container.bind<ILoginUseCase>(TYPES.ILoginUseCase).to(LoginUseCase);
container.bind<ISendOtpUseCase>(TYPES.ISendOtpUseCase).to(SendOtpUseCase);
container.bind<IVerifyOtpUseCase>(TYPES.IVerifyOtpUseCase).to(VerifyOtpUseCase);
container
  .bind<ICreateEventUseCase>(TYPES.ICreateEventUseCase)
  .to(CreateEventUseCase);
container
  .bind<IUpdateEventUseCase>(TYPES.IUpdateEventUseCase)
  .to(UpdateEventUseCase);
container.bind<IGetEventUseCase>(TYPES.IGetEventUseCase).to(GetEventUseCase);
container.bind<IGetEventsUseCase>(TYPES.IGetEventsUseCase).to(GetEventsUseCase);
container.bind<ICreatePaymentIntentUseCase>(TYPES.ICreatePaymentIntentUseCase).to(CreatePaymentIntentUseCase);
container.bind<IGenerateTicketUseCase>(TYPES.IGenerateTicketUseCase).to(GenerateTicketUseCase);
container.bind<IProcessPaymentWebhookUseCase>(TYPES.IProcessPaymentWebhookUseCase).to(ProcessPaymentWebhookUseCase);


// controller
container.bind<IAuthController>(TYPES.IAuthController).to(AuthController);
container.bind<IEventController>(TYPES.IEventControllr).to(EventController);
container.bind<IPaymentController>(TYPES.IPaymentController).to(PaymentController);
container.bind<IWebhookController>(TYPES.IWebhookController).to(WebhookController)
