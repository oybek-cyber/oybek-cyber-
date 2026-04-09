import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '@app-types/index.js';
import { NewsService } from '@services/NewsService.js';
import logger from '@config/logger.js';

export class NewsController {
  static async getLatestNews(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { limit = 20 } = req.query;

      const articles = await NewsService.getLatestNews(parseInt(limit as string, 10));

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'News articles retrieved successfully',
        data: articles,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Get latest news error:', error);
      throw error;
    }
  }

  static async getNewsByCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const { limit = 20 } = req.query;

      const articles = await NewsService.getNewsByCategory(
        category,
        parseInt(limit as string, 10)
      );

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'News articles retrieved successfully',
        data: articles,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Get category news error:', error);
      throw error;
    }
  }

  static async searchNews(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q) {
        res.status(400).json({
          success: false,
          status: 400,
          message: 'Search query required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const articles = await NewsService.searchNews(q as string);

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Search results retrieved successfully',
        data: articles,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Search news error:', error);
      throw error;
    }
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { articleId } = req.params;

      await NewsService.markAsRead(req.userId!, articleId);

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Article marked as read',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Mark as read error:', error);
      throw error;
    }
  }
}
