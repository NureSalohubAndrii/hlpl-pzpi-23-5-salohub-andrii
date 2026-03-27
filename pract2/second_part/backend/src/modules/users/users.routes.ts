import { Router } from 'express';
import { getAllUsers, updateMe } from './users.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.patch('/me', authMiddleware, updateMe);
router.get('/', authMiddleware, getAllUsers);

export default router;
