import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class CommunityService {
  static async sendMessage(userId: string, content: string) {
    return prisma.communityMessage.create({
      data: {
        userId,
        content,
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
            role: true,
          },
        },
      },
    });
  }

  static async getMessages(limit = 50) {
    return prisma.communityMessage.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
            role: true,
          },
        },
      },
    });
  }

  static async deleteMessage(messageId: string) {
    return prisma.communityMessage.delete({
      where: { id: messageId },
    });
  }
}
