import { AxiosError } from 'axios';

/**
 * Standardized error response structure from API
 */
export interface ApiErrorResponse {
  status: number;
  message: string;
  details?: string | Record<string, any>;
  timestamp?: string;
}

/**
 * Handle API errors and provide user-friendly messages
 * Can be integrated with toast notification libraries (Sonner, React Hot Toast, etc.)
 */
export const handleApiError = (
  error: unknown,
  defaultMessage: string = 'An unexpected error occurred'
): string => {
  // Network or Axios error
  if (error instanceof AxiosError) {
    const { status, data } = error.response || {};

    // Handle different status codes
    switch (status) {
      case 400:
        return typeof data?.message === 'string' 
          ? data.message 
          : 'Invalid request. Please check your input.';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'This resource already exists.';
      case 422:
        return typeof data?.message === 'string' 
          ? data.message 
          : 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Bad gateway. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      case 504:
        return 'Request timeout. Please try again later.';
      default:
        if (status && status >= 400 && status < 500) {
          return typeof data?.message === 'string' 
            ? data.message 
            : 'Client error. Please try again.';
        }
        if (status && status >= 500) {
          return 'Server error. Please try again later.';
        }
    }
  }

  // Generic error
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  return defaultMessage;
};

/**
 * Format validation errors from API response
 * Useful for form validation feedback
 */
export const formatValidationErrors = (
  data: any
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (Array.isArray(data?.details)) {
    // Handle Joi validation errors
    data.details.forEach((error: any) => {
      errors[error.field || 'general'] = error.message;
    });
  } else if (typeof data?.details === 'object') {
    // Handle object-based errors
    Object.entries(data.details).forEach(([key, value]) => {
      errors[key] = typeof value === 'string' ? value : 'Invalid value';
    });
  }

  return errors;
};

/**
 * Log error for debugging/monitoring
 * In production, this can be sent to a logging service
 */
export const logError = (
  context: string,
  error: unknown,
  additionalInfo?: Record<string, any>
): void => {
  const isDevelopment = import.meta.env.DEV;

  if (isDevelopment) {
    console.error(`[${context}]`, error, additionalInfo);
  }

  // TODO: Send to logging service (e.g., Sentry, LogRocket, etc.)
};

/**
 * Create a safe try-catch wrapper for async operations
 * Returns [data, error] tuple for clean error handling
 */
export const asyncHandler = async <T,>(
  promise: Promise<T>
): Promise<[T | null, AxiosError<ApiErrorResponse> | null]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error as AxiosError<ApiErrorResponse>];
  }
};
