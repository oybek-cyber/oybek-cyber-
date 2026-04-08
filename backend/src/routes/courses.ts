import { Router } from 'express';
import { CourseController } from '@controllers/CourseController.js';
import { AuthMiddleware } from '@middleware/auth.js';

const router = Router();

// Public routes
router.get('/', (req, res, next) => {
  CourseController.listCourses(req, res).catch(next);
});

router.get('/:courseId', (req, res, next) => {
  CourseController.getCourse(req, res).catch(next);
});

// Protected routes - instructor only
router.post(
  '/',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('INSTRUCTOR', 'ADMIN'),
  (req, res, next) => {
    CourseController.createCourse(req, res).catch(next);
  }
);

router.put(
  '/:courseId',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('INSTRUCTOR', 'ADMIN'),
  (req, res, next) => {
    CourseController.updateCourse(req, res).catch(next);
  }
);

// Protected routes - student enrollment
router.post(
  '/:courseId/enroll',
  AuthMiddleware.authenticate,
  (req, res, next) => {
    CourseController.enrollCourse(req, res).catch(next);
  }
);

router.get(
  '/:courseId/progress',
  AuthMiddleware.authenticate,
  (req, res, next) => {
    CourseController.getProgress(req, res).catch(next);
  }
);

export default router;
