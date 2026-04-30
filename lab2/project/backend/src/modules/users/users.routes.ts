import { Router } from 'express';
import { getAllUsers, getUserById, updateMe } from './users.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.patch('/me', authMiddleware, updateMe);
router.get('/', authMiddleware, getAllUsers);
router.get('/:userId', getUserById);

export default router;
