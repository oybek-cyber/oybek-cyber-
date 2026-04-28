import { Router } from 'express';
import { CommunityController } from '@controllers/CommunityController.js';
import { AuthMiddleware } from '@middleware/auth.js';

const router = Router();

router.get('/messages', AuthMiddleware.authenticate, CommunityController.getMessages);
router.post('/messages', AuthMiddleware.authenticate, CommunityController.sendMessage);
router.delete('/messages/:id', AuthMiddleware.authenticate, CommunityController.deleteMessage);

export default router;
