import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '@app-types/index.js';
import { CourseService } from '@services/CourseService.js';
import { createCourseSchema, updateCourseSchema, paginationSchema, validateData } from '@validators/schemas.js';
import { AuthMiddleware } from '@middleware/auth.js';
import logger from '@config/logger.js';

export class CourseController {
  static async listCourses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 20, category, level, isPublished } = req.query;

      const result = await CourseService.getAllCourses(
        {
          ...(category && { category: category as any }),
          ...(level && { level: level as any }),
          isPublished: isPublished === 'true',
        },
        parseInt(page as string, 10),
        parseInt(limit as string, 10)
      );

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Courses retrieved successfully',
        data: result,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('List courses error:', error);
      throw error;
    }
  }

  static async getCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;

      const course = await CourseService.getCourseById(courseId);

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Course retrieved successfully',
        data: course,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Get course error:', error);
      throw error;
    }
  }

  static async createCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { data, error } = await validateData(createCourseSchema, req.body);
      if (error) {
        res.status(422).json({
          success: false,
          status: 422,
          message: error,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const course = await CourseService.createCourse(req.userId!, data);

      const response: ApiResponse = {
        success: true,
        status: 201,
        message: 'Course created successfully',
        data: course,
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
      logger.info(`Course created: ${course.id}`);
    } catch (error) {
      logger.error('Create course error:', error);
      throw error;
    }
  }

  static async updateCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const { data, error } = await validateData(updateCourseSchema, req.body);
      if (error) {
        res.status(422).json({
          success: false,
          status: 422,
          message: error,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const course = await CourseService.updateCourse(courseId, req.userId!, data);

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Course updated successfully',
        data: course,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Update course error:', error);
      throw error;
    }
  }

  static async enrollCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;

      const enrollment = await CourseService.enrollUser(req.userId!, courseId);

      const response: ApiResponse = {
        success: true,
        status: 201,
        message: 'Enrolled successfully',
        data: enrollment,
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
      logger.info(`User ${req.userId} enrolled in course ${courseId}`);
    } catch (error) {
      logger.error('Enroll course error:', error);
      throw error;
    }
  }

  static async getProgress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;

      const progress = await CourseService.getCourseProgress(req.userId!, courseId);

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Progress retrieved successfully',
        data: progress,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Get progress error:', error);
      throw error;
    }
  }
}
