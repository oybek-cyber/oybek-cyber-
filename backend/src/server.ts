import express from 'express';
import { env, validateEnv } from '@config/env.js';
import logger from '@config/logger.js';
import { setupMiddleware, setupRoutes } from '@config/setup.js';
import prisma from '@utils/prisma.js';

const startServer = async (): Promise<void> => {
  try {
    // Validate environment variables
    validateEnv();
    logger.info('Environment variables validated');

    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection successful');

    // Create Express app
    const app = express();

    // Setup middleware
    setupMiddleware(app);
    logger.info('Middleware configured');

    // Setup routes
    setupRoutes(app);
    logger.info('Routes configured');

    // Start server
    app.listen(env.PORT, () => {
      logger.info(
        `🚀 Server running on ${env.API_URL} in ${env.NODE_ENV} mode`
      );
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully...');
      await prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully...');
      await prisma.$disconnect();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
