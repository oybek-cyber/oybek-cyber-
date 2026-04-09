import prisma from '@utils/prisma.js';

export class NewsRepository {
  static async findById(id: string) {
    return prisma.newsArticle.findUnique({
      where: { id },
    });
  }

  static async findAll(filter?: any, take?: number, skip?: number) {
    return prisma.newsArticle.findMany({
      where: filter,
      take,
      skip,
      orderBy: { publishedAt: 'desc' },
    });
  }

  static async countAll(filter?: any) {
    return prisma.newsArticle.count({
      where: filter,
    });
  }

  static async findLatest(limit: number = 10) {
    return prisma.newsArticle.findMany({
      take: limit,
      orderBy: { publishedAt: 'desc' },
      where: {
        publishedAt: {
          lte: new Date(),
        },
      },
    });
  }

  static async findByCategory(category: string, limit?: number) {
    return prisma.newsArticle.findMany({
      where: { category },
      take: limit,
      orderBy: { publishedAt: 'desc' },
    });
  }

  static async findBySeverity(severity: string, limit?: number) {
    return prisma.newsArticle.findMany({
      where: { severity },
      take: limit,
      orderBy: { publishedAt: 'desc' },
    });
  }

  static async create(data: any) {
    return prisma.newsArticle.create({
      data,
    });
  }

  static async createMany(data: any[]) {
    return prisma.newsArticle.createMany({
      data,
    });
  }

  static async update(id: string, data: any) {
    return prisma.newsArticle.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.newsArticle.delete({
      where: { id },
    });
  }

  static async markAsRead(userId: string, articleId: string) {
    return prisma.newsArticle.update({
      where: { id: articleId },
      data: {
        readBy: {
          connect: { id: userId },
        },
      },
    });
  }

  static async getUserReadArticles(userId: string) {
    return prisma.newsArticle.findMany({
      where: {
        readBy: {
          some: { id: userId },
        },
      },
    });
  }
}
