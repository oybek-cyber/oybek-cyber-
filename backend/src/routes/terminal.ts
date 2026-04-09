import { Router } from 'express';
import { TerminalController } from '@controllers/TerminalController.js';
import { AuthMiddleware } from '@middleware/auth.js';
import { terminalLimiter } from '@middleware/rateLimiter.js';
import { AuthenticatedRequest } from '@app-types/index.js';

const router = Router();

// Public terminal chat endpoint (for demo)
router.post(
  '/chat',
  terminalLimiter,
  (req, res, next) => {
    TerminalController.chat(req as AuthenticatedRequest, res).catch(next);
  }
);

// Protected routes - require authentication
router.get(
  '/sessions',
  AuthMiddleware.authenticate,
  (req, res, next) => {
    TerminalController.listSessions(req as AuthenticatedRequest, res).catch(next);
  }
);

router.get(
  '/sessions/:sessionId',
  AuthMiddleware.authenticate,
  (req, res, next) => {
    TerminalController.getSession(req as AuthenticatedRequest, res).catch(next);
  }
);

router.delete(
  '/sessions/:sessionId',
  AuthMiddleware.authenticate,
  (req, res, next) => {
    TerminalController.deleteSession(req as AuthenticatedRequest, res).catch(next);
  }
);

export default router;
