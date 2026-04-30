import { Router } from 'express';
import * as authController from './auth.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { getMe } from './auth.controller';

const router = Router();

router.post('/register', authController.registerUser);
router.post('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.get('/me', authMiddleware, getMe);
// router.post('/reset-password');

export default router;
