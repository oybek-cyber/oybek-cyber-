import { NewsRepository } from '@repositories/NewsRepository.js';
import { AppErrorHandler } from '@utils/errors.js';
import logger from '@config/logger.js';

export class NewsService {
  static async getLatestNews(limit: number = 20) {
    try {
      const articles = await NewsRepository.findLatest(limit);
      return articles;
    } catch (error) {
      logger.error('Error fetching latest news:', error);
      throw AppErrorHandler.internalServerError('Failed to fetch news');
    }
  }

  static async getNewsByCategory(category: string, limit: number = 20) {
    try {
      const articles = await NewsRepository.findByCategory(category, limit);
      return articles;
    } catch (error) {
      logger.error('Error fetching category news:', error);
      throw AppErrorHandler.internalServerError('Failed to fetch news');
    }
  }

  static async getNewsBySeverity(severity: string, limit: number = 20) {
    try {
      const articles = await NewsRepository.findBySeverity(severity, limit);
      return articles;
    } catch (error) {
      logger.error('Error fetching severity-based news:', error);
      throw AppErrorHandler.internalServerError('Failed to fetch news');
    }
  }

  static async searchNews(query: string) {
    try {
      const articles = await NewsRepository.findAll({
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      });
      return articles;
    } catch (error) {
      logger.error('Error searching news:', error);
      throw AppErrorHandler.internalServerError('Search failed');
    }
  }

  static async createNewsArticle(data: any) {
    try {
      const article = await NewsRepository.create({
        title: data.title,
        description: data.description,
        content: data.content,
        imageUrl: data.imageUrl,
        source: data.source,
        sourceUrl: data.sourceUrl,
        category: data.category,
        severity: data.severity || 'INFORMATIONAL',
        publishedAt: new Date(),
      });

      logger.info(`News article created: ${article.id}`);
      return article;
    } catch (error) {
      logger.error('Error creating news article:', error);
      throw AppErrorHandler.internalServerError('Failed to create article');
    }
  }

  static async markAsRead(userId: string, articleId: string) {
    try {
      const article = await NewsRepository.findById(articleId);
      if (!article) {
        throw AppErrorHandler.notFound('Article');
      }

      await NewsRepository.markAsRead(userId, articleId);
      logger.info(`Article marked as read by user ${userId}`);
    } catch (error) {
      logger.error('Error marking article as read:', error);
      throw error;
    }
  }

  // Simulated RSS feed integration
  static async fetchFromRSS(): Promise<any[]> {
    // This would integrate with actual RSS feeds from:
    // - Krebs on Security
    // - The Hacker News
    // - Dark Reading
    // - Bleeping Computer
    // For now, return mock data
    return [];
  }
}
