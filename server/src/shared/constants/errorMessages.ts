export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Internal server error occurred',
  INVALID_REQUEST: 'Invalid request data',
  RESOURCE_NOT_FOUND: 'Requested resource not found',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  FORBIDDEN_ACCESS: 'Access forbidden',
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Authentication token has expired',
  TOKEN_INVALID: 'Invalid authentication token',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  REQUIRED_FIELD_MISSING: 'Required field is missing',
  INVALID_EMAIL_FORMAT: 'Invalid email format',
  PASSWORD_TOO_WEAK: 'Password must be at least 8 characters long',
  INVALID_DATE_FORMAT: 'Invalid date format',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',
  DATABASE_CONNECTION_ERROR: 'Database connection failed',
  DUPLICATE_ENTRY: 'Resource already exists',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
} as const;

export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
