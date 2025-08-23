export const TYPES = {
  // services
  IAuthService: Symbol.for('IAuthService'),
  ITokenService: Symbol.for('ITokenService'),
  IRedisService: Symbol.for('IRedisService'),
  IOtpService: Symbol.for('IOtpService'),
  IEmailService: Symbol.for('IEmailService'),
  IStripeService: Symbol.for("IStripeService"),
  ITicketService: Symbol.for("ITicketService"),
  IQRCodeService: Symbol.for("IQRCodeService"),

  // respositories
  IUserRepository: Symbol.for('IUserRepository'),
  IEventRepository: Symbol.for('IEventRepository'),
  IPaymentRepository: Symbol.for("IPaymentRepository"),
  ITicketRepository: Symbol.for("ITicketRepository"),

  // use cases
  ILoginUseCase: Symbol.for('ILoginUseCase'),
  IRegisterUseCase: Symbol.for('IRegisterUseCase'),
  ISendOtpUseCase: Symbol.for('ISendOtpUseCase'),
  IVerifyOtpUseCase: Symbol.for('IVerifyOtpUseCase'),
  
  ICreateEventUseCase: Symbol.for('ICreateEventUseCase'),
  IGetEventUseCase: Symbol.for('IGetEventUseCase'),
  IGetEventsUseCase: Symbol.for('IGetEventsUseCase'),
  IUpdateEventUseCase: Symbol.for('IUpdateEventUseCase'),

  ICreatePaymentIntentUseCase: Symbol.for("ICreatePaymentIntentUseCase"),
  IProcessPaymentWebhookUseCase: Symbol.for("IProcessPaymentWebhookUseCase"),
  IGenerateTicketUseCase: Symbol.for("IGenerateTicketUseCase"),
  
  
  // controlers
  IAuthController: Symbol.for('IAuthController'),
  IEventControllr: Symbol.for('IEventController'),
  IPaymentController: Symbol.for("IPaymentController"),
  IWebhookController: Symbol.for("IWebhookController")
};

export type TypeKeys = keyof typeof TYPES;
