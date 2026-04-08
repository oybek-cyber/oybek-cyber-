import { CourseRepository } from '@repositories/CourseRepository.js';
import { LessonRepository } from '@repositories/LessonRepository.js';
import { AppErrorHandler } from '@utils/errors.js';
import logger from '@config/logger.js';
import { CourseCategory, CourseLevel } from '@prisma/client';

export class CourseService {
  static async getAllCourses(
    filter?: {
      category?: CourseCategory;
      level?: CourseLevel;
      isPublished?: boolean;
    },
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const skip = (page - 1) * limit;

      const courses = await CourseRepository.findAll(
        {
          ...filter,
          deletedAt: null,
        },
        limit,
        skip
      );

      const total = await CourseRepository.countAll({
        ...filter,
        deletedAt: null,
      });

      return {
        courses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching courses:', error);
      throw AppErrorHandler.internalServerError('Failed to fetch courses');
    }
  }

  static async getCourseById(id: string) {
    try {
      const course = await CourseRepository.findById(id);
      if (!course) {
        throw AppErrorHandler.notFound('Course');
      }
      return course;
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw error;
      }
      logger.error('Error fetching course:', error);
      throw AppErrorHandler.internalServerError('Failed to fetch course');
    }
  }

  static async createCourse(instructorId: string, data: any) {
    try {
      const course = await CourseRepository.create({
        ...data,
        instructorId,
      });

      logger.info(`Course created: ${course.id} by instructor ${instructorId}`);
      return course;
    } catch (error) {
      logger.error('Error creating course:', error);
      throw AppErrorHandler.internalServerError('Failed to create course');
    }
  }

  static async updateCourse(courseId: string, instructorId: string, data: any) {
    try {
      const course = await CourseRepository.findById(courseId);
      if (!course) {
        throw AppErrorHandler.notFound('Course');
      }

      // Verify ownership
      if (course.instructorId !== instructorId) {
        throw AppErrorHandler.forbidden('You can only edit your own courses');
      }

      const updated = await CourseRepository.update(courseId, data);
      logger.info(`Course updated: ${courseId}`);
      return updated;
    } catch (error) {
      if (error instanceof Error && (error.message.includes('not found') || error.message.includes('only edit'))) {
        throw error;
      }
      logger.error('Error updating course:', error);
      throw AppErrorHandler.internalServerError('Failed to update course');
    }
  }

  static async publishCourse(courseId: string, instructorId: string, isPublished: boolean) {
    try {
      const course = await CourseRepository.findById(courseId);
      if (!course) {
        throw AppErrorHandler.notFound('Course');
      }

      if (course.instructorId !== instructorId) {
        throw AppErrorHandler.forbidden('You can only publish your own courses');
      }

      const updated = await CourseRepository.update(courseId, { isPublished });
      logger.info(`Course ${isPublished ? 'published' : 'unpublished'}: ${courseId}`);
      return updated;
    } catch (error) {
      if (error instanceof Error && (error.message.includes('not found') || error.message.includes('only publish'))) {
        throw error;
      }
      logger.error('Error publishing course:', error);
      throw AppErrorHandler.internalServerError('Failed to publish course');
    }
  }

  static async enrollUser(userId: string, courseId: string) {
    try {
      const course = await CourseRepository.findById(courseId);
      if (!course || !course.isPublished) {
        throw AppErrorHandler.notFound('Course');
      }

      const existing = await CourseRepository.findEnrollment(userId, courseId);
      if (existing) {
        throw AppErrorHandler.conflict('Already enrolled in this course');
      }

      const enrollment = await CourseRepository.enrollUser(userId, courseId);
      logger.info(`User ${userId} enrolled in course ${courseId}`);
      return enrollment;
    } catch (error) {
      if (error instanceof Error && (error.message.includes('not found') || error.message.includes('Already enrolled'))) {
        throw error;
      }
      logger.error('Error enrolling user:', error);
      throw AppErrorHandler.internalServerError('Enrollment failed');
    }
  }

  static async getUserEnrollments(userId: string) {
    try {
      return await CourseRepository.getUserEnrollments(userId);
    } catch (error) {
      logger.error('Error fetching enrollments:', error);
      throw AppErrorHandler.internalServerError('Failed to fetch enrollments');
    }
  }

  static async getCourseProgress(userId: string, courseId: string) {
    try {
      const enrollment = await CourseRepository.findEnrollment(userId, courseId);
      if (!enrollment) {
        throw AppErrorHandler.notFound('Enrollment');
      }

      const lessons = await LessonRepository.findByCourse(courseId);
      const completedLessons = lessons.filter((lesson) =>
        lesson.progress.some((p) => p.userId === userId && p.isCompleted)
      );

      const progress = (completedLessons.length / lessons.length) * 100 || 0;

      return {
        enrollment,
        totalLessons: lessons.length,
        completedLessons: completedLessons.length,
        progress,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw error;
      }
      logger.error('Error fetching progress:', error);
      throw AppErrorHandler.internalServerError('Failed to fetch progress');
    }
  }
}
