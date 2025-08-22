export const TYPES = {
  // services
  IAuthService: Symbol.for('IAuthService'),
  ITokenService: Symbol.for('ITokenService'),
  IRedisService: Symbol.for('IRedisService'),
  IOtpService: Symbol.for('IOtpService'),
  IEmailService: Symbol.for('IEmailService'),

  // respositories
  IUserRepository: Symbol.for('IUserRepository'),

  // use cases
  ILoginUseCase: Symbol.for('ILoginUseCase'),
  IRegisterUseCase: Symbol.for('IRegisterUseCase'),
  ISendOtpUseCase: Symbol.for('ISendOtpUseCase'),
  IVerifyOtpUseCase: Symbol.for('IVerifyOtpUseCase'),

  // controlers
  IAuthController: Symbol.for('IAuthController'),
};

export type TypeKeys = keyof typeof TYPES;
