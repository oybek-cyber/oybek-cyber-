import prisma from '@utils/prisma.js';

export class LessonRepository {
  static async findById(id: string) {
    return prisma.lesson.findUnique({
      where: { id },
      include: {
        resources: true,
        quiz: {
          include: {
            questions: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        progress: true,
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  static async findByCourseAndSlug(courseId: string, slug: string) {
    return prisma.lesson.findUnique({
      where: {
        courseId_slug: {
          courseId,
          slug,
        },
      },
      include: {
        resources: true,
        quiz: {
          include: {
            questions: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });
  }

  static async findByCourse(courseId: string) {
    return prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        resources: true,
        quiz: true,
        progress: true,
      },
    });
  }

  static async create(data: any) {
    return prisma.lesson.create({
      data,
      include: { createdBy: true },
    });
  }

  static async update(id: string, data: any) {
    return prisma.lesson.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.lesson.delete({
      where: { id },
    });
  }

  static async markAsComplete(userId: string, lessonId: string) {
    return prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  static async updateWatchedDuration(
    userId: string,
    lessonId: string,
    duration: number
  ) {
    return prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        watchedDuration: duration,
      },
      create: {
        userId,
        lessonId,
        watchedDuration: duration,
      },
    });
  }

  static async getProgress(userId: string, lessonId: string) {
    return prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });
  }
}
