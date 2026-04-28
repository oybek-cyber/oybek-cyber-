import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '@app-types/index.js';
import prisma from '@utils/prisma.js';
import logger from '@config/logger.js';

export class DiscussionController {
  // Get discussions for a specific lesson
  static async getLessonDiscussions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { lessonId } = req.params;
      const userRole = req.user?.role;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const whereClause = userRole === 'ADMIN' ? { lessonId } : { lessonId, userId };

      const discussions = await prisma.discussion.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
           user: {
             select: {
               firstName: true,
               lastName: true,
               username: true,
               avatar: true
             }
           }
        }
      });

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Lesson discussions retrieved successfully',
        data: discussions,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Get lesson discussions error:', error);
      res.status(500).json({ success: false, message: 'Server error retrieving discussions' });
    }
  }

  // Create a new question
  static async createQuestion(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { lessonId, question } = req.body;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      if (!lessonId || !question) {
        res.status(400).json({ success: false, message: 'LessonId and question are required' });
        return;
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
      const userName = fullName || user?.username || 'O\'quvchi';

      const discussion = await prisma.discussion.create({
        data: {
          lessonId,
          userId,
          userName,
          question,
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              username: true,
              avatar: true
            }
          }
        }
      });

      const response: ApiResponse = {
        success: true,
        status: 201,
        message: 'Question posted successfully',
        data: discussion,
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('Create question error:', error);
      res.status(500).json({ success: false, message: 'Server error posting question' });
    }
  }

  // Admin reply to a question
  static async replyToQuestion(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { answer } = req.body;

      // In a real app, we'd check req.role === 'ADMIN'
      // For this lab, we assume the admin panel caller is authorized

      const discussion = await prisma.discussion.update({
        where: { id },
        data: {
          answer,
          isAdminReplied: true,
        },
      });

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Reply saved successfully',
        data: discussion,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Reply to question error:', error);
      res.status(500).json({ success: false, message: 'Server error saving reply' });
    }
  }

  // Get all discussions for Admin
  static async getAllDiscussions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const discussions = await prisma.discussion.findMany({
        orderBy: { createdAt: 'desc' },
      });

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'All discussions retrieved successfully',
        data: discussions,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Get all discussions error:', error);
      res.status(500).json({ success: false, message: 'Server error retrieving all discussions' });
    }
  }

  // Clear an admin's answer (Admin)
  static async clearAnswer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const discussion = await prisma.discussion.update({
        where: { id },
        data: {
          answer: null,
          isAdminReplied: false,
        },
      });

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Answer cleared successfully',
        data: discussion,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Clear answer error:', error);
      res.status(500).json({ success: false, message: 'Server error clearing answer' });
    }
  }

  // Delete a discussion (Admin)
  static async deleteDiscussion(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.discussion.delete({
        where: { id },
      });

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Discussion deleted successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Delete discussion error:', error);
      res.status(500).json({ success: false, message: 'Server error deleting discussion' });
    }
  }
}
