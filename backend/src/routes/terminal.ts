import { Router } from 'express';
import { TerminalController } from '@controllers/TerminalController.js';
import { AuthMiddleware } from '@middleware/auth.js';
import { terminalLimiter } from '@middleware/rateLimiter.js';

const router = Router();

// Protected routes - require authentication
router.post(
  '/chat',
  AuthMiddleware.authenticate,
  terminalLimiter,
  (req, res, next) => {
    TerminalController.chat(req, res).catch(next);
  }
);

router.get(
  '/sessions',
  AuthMiddleware.authenticate,
  (req, res, next) => {
    TerminalController.listSessions(req, res).catch(next);
  }
);

router.get(
  '/sessions/:sessionId',
  AuthMiddleware.authenticate,
  (req, res, next) => {
    TerminalController.getSession(req, res).catch(next);
  }
);

router.delete(
  '/sessions/:sessionId',
  AuthMiddleware.authenticate,
  (req, res, next) => {
    TerminalController.deleteSession(req, res).catch(next);
  }
);

export default router;
