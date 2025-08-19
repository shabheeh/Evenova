export const RESPONSE_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  DATA_RETRIEVED: 'Data retrieved successfully',
  OPERATION_COMPLETED: 'Operation completed successfully',
} as const;

export type ResponseMessage = typeof RESPONSE_MESSAGES[keyof typeof RESPONSE_MESSAGES];
