import { Response } from 'express';
import { AuthenticatedRequest } from '@app-types/index.js';
import { CommunityService } from '@services/CommunityService.js';

export class CommunityController {
  static async getMessages(req: AuthenticatedRequest, res: Response) {
    try {
      const messages = await CommunityService.getMessages();
      res.json({ success: true, data: messages });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async sendMessage(req: AuthenticatedRequest, res: Response) {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ success: false, message: 'Content is required' });
      }
      const message = await CommunityService.sendMessage(req.userId!, content);
      res.json({ success: true, data: message });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteMessage(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      // In a real app, check if user is admin or owner
      await CommunityService.deleteMessage(id);
      res.json({ success: true, message: 'Message deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
