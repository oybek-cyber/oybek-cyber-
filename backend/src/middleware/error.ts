import { Request, Response, NextFunction } from 'express';
import logger from '@config/logger.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(
    `[${statusCode}] ${message} - ${req.method} ${req.originalUrl}`,
    {
      error: err,
      url: req.originalUrl,
      method: req.method,
    }
  );

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    timestamp: new Date().toISOString(),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
};
