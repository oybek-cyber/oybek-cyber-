import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse, TerminalContextData } from '@app-types/index.js';
import { TerminalService } from '@services/TerminalService.js';
import { terminalChatSchema, validateData } from '@validators/schemas.js';
import prisma from '@utils/prisma.js';
import logger from '@config/logger.js';

export class TerminalController {
  static async chat(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { data, error } = await validateData(terminalChatSchema, req.body);
      if (error) {
        res.status(422).json({
          success: false,
          status: 422,
          message: error,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate message safety
      const isPromptSafe = await TerminalService.validatePrompt((data as any).message);
      if (!isPromptSafe) {
        res.status(400).json({
          success: false,
          status: 400,
          message:
            'Your message contains potentially harmful content. Please rephrase your question.',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get or create terminal session
      let session = null;
      if ((data as any).sessionId) {
        session = await prisma.terminalSession.findUnique({
          where: { id: (data as any).sessionId },
          include: { messages: { orderBy: { createdAt: 'asc' } } },
        });

        if (!session || session.userId !== req.userId) {
          res.status(403).json({
            success: false,
            status: 403,
            message: 'Unauthorized access to terminal session',
            timestamp: new Date().toISOString(),
          });
          return;
        }
      } else {
        session = await prisma.terminalSession.create({
          data: {
            userId: req.userId!,
            context: (data as any).context ? JSON.stringify((data as any).context) : undefined,
          },
        });
      }

      // Save user message
      await prisma.terminalMessage.create({
        data: {
          sessionId: session.id,
          role: 'USER',
          content: (data as any).message,
        },
      });

      // Get conversation history
      const messages =
        (session as any).messages?.map((m: any) => ({
          role: m.role.toLowerCase() as 'user' | 'assistant',
          content: m.content,
        })) || [];

      messages.push({
        role: 'user',
        content: (data as any).message,
      });

      // Get AI response
      const context: TerminalContextData | undefined =
        (data as any).context && typeof (data as any).context === 'object'
          ? {
              course: (data as any).context.course,
              lesson: (data as any).context.lesson,
              topic: (data as any).context.topic,
              level: (data as any).context.level,
            }
          : undefined;

      const aiResponse = await TerminalService.chat(messages, context);

      // Save AI message
      const assistantMessage = await prisma.terminalMessage.create({
        data: {
          sessionId: session.id,
          role: 'ASSISTANT',
          content: aiResponse.message,
          tokensUsed: aiResponse.tokensUsed,
        },
      });

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Message processed successfully',
        data: {
          sessionId: session.id,
          message: aiResponse.message,
          tokensUsed: aiResponse.tokensUsed,
          messageId: assistantMessage.id,
        },
        timestamp: new Date().toISOString(),
      };

      res.json(response);
      logger.info(`Terminal chat processed for user ${req.userId}`, {
        sessionId: session.id,
        tokensUsed: aiResponse.tokensUsed,
      });
    } catch (error) {
      logger.error('Terminal chat error:', error);
      throw error;
    }
  }

  static async getSession(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;

      const session = await prisma.terminalSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!session || session.userId !== req.userId) {
        res.status(403).json({
          success: false,
          status: 403,
          message: 'Unauthorized',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Session retrieved successfully',
        data: {
          id: session.id,
          title: session.title,
          context: session.context ? JSON.parse(session.context) : null,
          messages: session.messages.map((m) => ({
            id: m.id,
            role: m.role.toLowerCase(),
            content: m.content,
            createdAt: m.createdAt,
          })),
          startedAt: session.startedAt,
        },
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Get session error:', error);
      throw error;
    }
  }

  static async listSessions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 20 } = req.query;
      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 20;

      const sessions = await prisma.terminalSession.findMany({
        where: { userId: req.userId! },
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { startedAt: 'desc' },
        take: limitNum,
        skip: (pageNum - 1) * limitNum,
      });

      const total = await prisma.terminalSession.count({
        where: { userId: req.userId! },
      });

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Sessions retrieved successfully',
        data: {
          sessions: sessions.map((s) => ({
            id: s.id,
            title: s.title,
            startedAt: s.startedAt,
            lastMessage: s.messages[0]?.content,
          })),
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum),
          },
        },
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('List sessions error:', error);
      throw error;
    }
  }

  static async deleteSession(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;

      const session = await prisma.terminalSession.findUnique({
        where: { id: sessionId },
      });

      if (!session || session.userId !== req.userId) {
        res.status(403).json({
          success: false,
          status: 403,
          message: 'Unauthorized',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await prisma.terminalSession.delete({
        where: { id: sessionId },
      });

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Session deleted successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Delete session error:', error);
      throw error;
    }
  }
}
