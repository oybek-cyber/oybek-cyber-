import { Router } from 'express';
import { AuthController } from '@controllers/AuthController.js';
import { AuthMiddleware } from '@middleware/auth.js';
import { authLimiter } from '@middleware/rateLimiter.js';

const router = Router();

// Public routes
router.post('/register', authLimiter, (req, res, next) => {
  AuthController.register(req, res).catch(next);
});

router.post('/login', authLimiter, (req, res, next) => {
  AuthController.login(req, res).catch(next);
});

router.post('/refresh-token', (req, res, next) => {
  AuthController.refreshToken(req, res).catch(next);
});

// Protected routes
router.get(
  '/me',
  AuthMiddleware.authenticate,
  (req, res, next) => {
    AuthController.getCurrentUser(req, res).catch(next);
  }
);

router.post(
  '/logout',
  AuthMiddleware.authenticate,
  (req, res, next) => {
    AuthController.logout(req, res).catch(next);
  }
);

export default router;
