import axiosInstance from '@api/axiosInstance';
import { handleApiError, logError } from '@api/errorHandler';
import { AxiosError } from 'axios';

/**
 * Type definitions for Course Service
 */
export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  content?: string;
  videoUrl?: string;
  duration?: number;
  isCompleted?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration: number;
  lessonsCount: number;
  enrollmentCount: number;
  rating: number;
  lessons?: Lesson[];
  isEnrolled?: boolean;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  userId: string;
  progress: number;
  completedLessons: number;
  enrolledAt: string;
  completedAt?: string;
}

export interface CreateCourseDto {
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail?: string;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Course Service
 * Handles all course-related API calls
 */
class CourseService {
  /**
   * Get all courses with pagination and filtering
   */
  async getAllCourses(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Course> | null> {
    try {
      const queryParams = {
        page: params?.page || 1,
        limit: params?.limit || 10,
        sortBy: params?.sortBy || 'createdAt',
        order: params?.order || 'desc',
      };

      const response = await axiosInstance.get<PaginatedResponse<Course>>(
        '/courses',
        { params: queryParams }
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to fetch courses. Please try again.'
      );
      logError('CourseService.getAllCourses', error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get course by ID
   */
  async getCourseById(courseId: string): Promise<Course | null> {
    try {
      const response = await axiosInstance.get<Course>(
        `/courses/${courseId}`
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to fetch course details. Please try again.'
      );
      logError('CourseService.getCourseById', error, { courseId });
      throw new Error(errorMessage);
    }
  }

  /**
   * Get course with lessons (full details)
   */
  async getCourseWithLessons(courseId: string): Promise<Course | null> {
    try {
      const response = await axiosInstance.get<Course>(
        `/courses/${courseId}/lessons`
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to fetch course content. Please try again.'
      );
      logError('CourseService.getCourseWithLessons', error, { courseId });
      throw new Error(errorMessage);
    }
  }

  /**
   * Create a new course (admin/instructor only)
   */
  async createCourse(courseData: CreateCourseDto): Promise<Course | null> {
    try {
      const response = await axiosInstance.post<Course>(
        '/courses',
        courseData
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to create course. Please try again.'
      );
      logError('CourseService.createCourse', error, courseData);
      throw new Error(errorMessage);
    }
  }

  /**
   * Update course (admin/instructor only)
   */
  async updateCourse(
    courseId: string,
    courseData: UpdateCourseDto
  ): Promise<Course | null> {
    try {
      const response = await axiosInstance.put<Course>(
        `/courses/${courseId}`,
        courseData
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to update course. Please try again.'
      );
      logError('CourseService.updateCourse', error, { courseId });
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete course (admin only)
   */
  async deleteCourse(courseId: string): Promise<void> {
    try {
      await axiosInstance.delete(`/courses/${courseId}`);
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to delete course. Please try again.'
      );
      logError('CourseService.deleteCourse', error, { courseId });
      throw new Error(errorMessage);
    }
  }

  /**
   * Enroll in a course
   */
  async enrollCourse(courseId: string): Promise<CourseEnrollment | null> {
    try {
      const response = await axiosInstance.post<CourseEnrollment>(
        `/courses/${courseId}/enroll`
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to enroll in course. Please try again.'
      );
      logError('CourseService.enrollCourse', error, { courseId });
      throw new Error(errorMessage);
    }
  }

  /**
   * Get user's enrolled courses
   */
  async getMyEnrolledCourses(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Course> | null> {
    try {
      const queryParams = {
        page: params?.page || 1,
        limit: params?.limit || 10,
      };

      const response = await axiosInstance.get<PaginatedResponse<Course>>(
        '/courses/my-courses',
        { params: queryParams }
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to fetch your courses. Please try again.'
      );
      logError('CourseService.getMyEnrolledCourses', error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Mark lesson as completed
   */
  async completeLession(courseId: string, lessonId: string): Promise<void> {
    try {
      await axiosInstance.post(
        `/courses/${courseId}/lessons/${lessonId}/complete`
      );
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to mark lesson as completed. Please try again.'
      );
      logError('CourseService.completeLession', error, {
        courseId,
        lessonId,
      });
      throw new Error(errorMessage);
    }
  }

  /**
   * Get course progress
   */
  async getCourseProgress(courseId: string): Promise<CourseEnrollment | null> {
    try {
      const response = await axiosInstance.get<CourseEnrollment>(
        `/courses/${courseId}/progress`
      );

      return response.data;
    } catch (error) {
      logError('CourseService.getCourseProgress', error, { courseId });
      return null;
    }
  }
}

export default new CourseService();
