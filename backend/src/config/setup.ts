import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from '@config/env.js';
import { apiLimiter } from '@middleware/rateLimiter.js';
import { requestLogger, errorHandler, notFoundHandler } from '@middleware/error.js';

import authRoutes from '@routes/auth.js';
import terminalRoutes from '@routes/terminal.js';
import courseRoutes from '@routes/courses.js';
import newsRoutes from '@routes/news.js';
import healthRoutes from '@routes/health.js';

export const setupMiddleware = (app: Express): void => {
  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Request logging
  app.use(requestLogger);

  // Rate limiting
  app.use('/api/', apiLimiter);
};

export const setupRoutes = (app: Express): void => {
  // Health check routes (no auth required)
  app.use('/', healthRoutes);

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/terminal', terminalRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/news', newsRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);
};
