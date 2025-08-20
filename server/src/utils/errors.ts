export enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  CONFLICT = 'CONFLICT',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INVALID_OTP = 'INVALID_OTP',
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  OTP_EXPIRED = 'OTP_EXPIRED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  USER_BLOCKED = 'USER_BLOCKED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public status: string = 'error',
    public code: ErrorCode | AuthErrorCode = ErrorCode.INTERNAL_ERROR
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400, 'fail', ErrorCode.BAD_REQUEST);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409, 'fail', ErrorCode.CONFLICT);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404, 'fail', ErrorCode.NOT_FOUND);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'fail', ErrorCode.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'fail', ErrorCode.FORBIDDEN);
  }
}

export class AuthError extends AppError {
  constructor(
    public code: AuthErrorCode,
    message?: string,
    public statusCode: number = 401
  ) {
    const defaultMessages = {
      [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password',
      [AuthErrorCode.INVALID_OTP]: 'Invalid OTP provided',
      [AuthErrorCode.INVALID_EMAIL_FORMAT]: 'Invalid email format',
      [AuthErrorCode.OTP_EXPIRED]: 'OTP has expired. Please request a new one',
      [AuthErrorCode.SESSION_EXPIRED]:
        'Session has expired. Please login again',
      [AuthErrorCode.TOKEN_EXPIRED]: 'Token has expired',
      [AuthErrorCode.INVALID_TOKEN]: 'Invalid or malformed token',
      [AuthErrorCode.USER_BLOCKED]: 'User account has been blocked',
      [AuthErrorCode.USER_NOT_FOUND]: 'User not found',
      [AuthErrorCode.UNAUTHENTICATED]: 'User is not authenticated',
      [AuthErrorCode.UNAUTHORIZED]: 'Not authorized',
    };

    super(message || defaultMessages[code], statusCode, 'fail', code);

    this.code = code;
  }
}
