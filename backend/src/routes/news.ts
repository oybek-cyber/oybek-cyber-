import { Router } from 'express';
import { NewsController } from '@controllers/NewsController.js';
import { AuthMiddleware } from '@middleware/auth.js';

const router = Router();

// ─── Live RSS yangiliklari (public) ──────────────────────────────────────────
// GET /api/news/live?severity=critical&q=ransomware&refresh=true
router.get('/live', (req, res, next) => {
  NewsController.getLiveNews(req as any, res).catch(next);
});

// GET /api/news/cache-status
router.get('/cache-status', (req, res, next) => {
  NewsController.getCacheStatus(req as any, res).catch(next);
});

// ─── DB based routes (public) ─────────────────────────────────────────────────
router.get('/', (req, res, next) => {
  NewsController.getLatestNews(req as any, res).catch(next);
});

router.get('/category/:category', (req, res, next) => {
  NewsController.getNewsByCategory(req as any, res).catch(next);
});

router.get('/search', (req, res, next) => {
  NewsController.searchNews(req as any, res).catch(next);
});

// ─── Protected routes ─────────────────────────────────────────────────────────
router.post(
  '/:articleId/read',
  AuthMiddleware.authenticate,
  (req, res, next) => {
    NewsController.markAsRead(req as any, res).catch(next);
  }
);

export default router;
