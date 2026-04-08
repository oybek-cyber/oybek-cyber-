import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, AppError, AuthPayload } from '@types/index.js';
import { JWTService } from '@utils/jwt.js';
import { AppErrorHandler } from '@utils/errors.js';
import logger from '@config/logger.js';

export class AuthMiddleware {
  static authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers['authorization'];

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw AppErrorHandler.unauthorized('Missing or invalid authorization header');
      }

      const token = authHeader.substring(7);

      try {
        const payload = JWTService.verifyAccessToken(token);
        req.user = payload;
        req.userId = payload.id;
        next();
      } catch (jwtError) {
        throw AppErrorHandler.unauthorized('Invalid or expired token');
      }
    } catch (error) {
      next(error);
    }
  };

  static authorize = (...allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          throw AppErrorHandler.unauthorized('Not authenticated');
        }

        if (!allowedRoles.includes(req.user.role)) {
          logger.warn(`Unauthorized access attempt: User ${req.user.id} tried to access restricted resource`);
          throw AppErrorHandler.forbidden('Insufficient permissions');
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };
}
