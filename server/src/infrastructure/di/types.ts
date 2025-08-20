export const TYPES = {
  // services
  IAuthService: Symbol.for('IAuthService'),
  ITokenService: Symbol.for('ITokenService'),

  // respositories
  IUserRepository: Symbol.for('IUserRepository'),

  // use cases
  ILoginUseCase: Symbol.for('ILoginUseCase'),
  IRegisterUseCase: Symbol.for('IRegisterUseCase'),

  // controlers
  IAuthController: Symbol.for('IAuthController'),
};

export type TypeKeys = keyof typeof TYPES;
