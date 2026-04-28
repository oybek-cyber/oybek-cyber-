import { Router } from 'express';
import { DiscussionController } from '@controllers/DiscussionController.js';
import { AuthMiddleware } from '@middleware/auth.js';

const router = Router();

// Public/Student routes (now protected)
router.get('/lesson/:lessonId', AuthMiddleware.authenticate, (req, res, next) => {
  DiscussionController.getLessonDiscussions(req as any, res).catch(next);
});

router.post('/', AuthMiddleware.authenticate, (req, res, next) => {
  DiscussionController.createQuestion(req as any, res).catch(next);
});

// Admin routes
router.get('/', (req, res, next) => {
  DiscussionController.getAllDiscussions(req as any, res).catch(next);
});

router.patch('/:id/reply', (req, res, next) => {
  DiscussionController.replyToQuestion(req as any, res).catch(next);
});

router.delete('/:id/reply', (req, res, next) => {
  DiscussionController.clearAnswer(req as any, res).catch(next);
});

router.delete('/:id', (req, res, next) => {
  DiscussionController.deleteDiscussion(req as any, res).catch(next);
});

export default router;
