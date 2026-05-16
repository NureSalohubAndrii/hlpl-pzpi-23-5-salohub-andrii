import { Router } from 'express';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { getConversation } from './messages.controller';

const router = Router();

router.get('/:userId', authMiddleware, getConversation);

export default router;
