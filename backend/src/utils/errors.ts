import { AppError } from '@app-types/index.js';

export class AppErrorHandler {
  static unauthorized(message: string = 'Unauthorized'): AppError {
    return new AppError(401, message, true);
  }

  static forbidden(message: string = 'Forbidden'): AppError {
    return new AppError(403, message, true);
  }

  static notFound(resource: string = 'Resource'): AppError {
    return new AppError(404, `${resource} not found`, true);
  }

  static badRequest(message: string = 'Bad Request'): AppError {
    return new AppError(400, message, true);
  }

  static conflict(message: string = 'Conflict'): AppError {
    return new AppError(409, message, true);
  }

  static internalServerError(message: string = 'Internal Server Error'): AppError {
    return new AppError(500, message, true);
  }

  static tooManyRequests(message: string = 'Too many requests'): AppError {
    return new AppError(429, message, true);
  }

  static validationError(message: string = 'Validation Error'): AppError {
    return new AppError(422, message, true);
  }
}
