import prisma from '@utils/prisma.js';

export class CourseRepository {
  static async findById(id: string) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        lessons: true,
        enrollments: true,
      },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: true,
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  static async findAll(filter?: any, take?: number, skip?: number) {
    return prisma.course.findMany({
      where: { ...filter },
      include: {
        instructor: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      take,
      skip,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async countAll(filter?: any) {
    return prisma.course.count({
      where: { ...filter },
    });
  }

  static async create(data: any) {
    return prisma.course.create({
      data,
      include: { instructor: true },
    });
  }

  static async update(id: string, data: any) {
    return prisma.course.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async enrollUser(userId: string, courseId: string) {
    return prisma.courseEnrollment.create({
      data: {
        userId,
        courseId,
      },
    });
  }

  static async findEnrollment(userId: string, courseId: string) {
    return prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
  }

  static async getUserEnrollments(userId: string) {
    return prisma.courseEnrollment.findMany({
      where: { userId },
      include: { course: true },
    });
  }
}

