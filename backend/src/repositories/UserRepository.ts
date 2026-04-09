import prisma from '@utils/prisma.js';

export class UserRepository {
  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  static async findByGoogleId(googleId: string) {
    return prisma.user.findUnique({
      where: { googleId },
    });
  }

  static async create(data: {
    email: string;
    username: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    googleId?: string;
    googleEmail?: string;
    role?: string;
  }) {
    return prisma.user.create({
      data: {
        ...data,
        role: data.role || 'STUDENT',
      },
    });
  }

  static async update(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async findAll(filter?: any) {
    return prisma.user.findMany({
      where: {
        deletedAt: null,
        ...filter,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  static async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  static async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  static async revokeRefreshToken(token: string) {
    return prisma.refreshToken.delete({
      where: { token },
    });
  }
}
