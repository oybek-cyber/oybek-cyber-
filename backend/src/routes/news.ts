import { Router } from 'express';
import { NewsController } from '@controllers/NewsController.js';
import { AuthMiddleware } from '@middleware/auth.js';

const router = Router();

// Public routes
router.get('/', (req, res, next) => {
  NewsController.getLatestNews(req, res).catch(next);
});

router.get('/category/:category', (req, res, next) => {
  NewsController.getNewsByCategory(req, res).catch(next);
});

router.get('/search', (req, res, next) => {
  NewsController.searchNews(req, res).catch(next);
});

// Protected routes
router.post(
  '/:articleId/read',
  AuthMiddleware.authenticate,
  (req, res, next) => {
    NewsController.markAsRead(req, res).catch(next);
  }
);

export default router;
