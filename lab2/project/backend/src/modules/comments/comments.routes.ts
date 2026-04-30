import { Router } from 'express';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from './comments.controller';

const router = Router();

router.post('/', authMiddleware, createComment);
router.get('/:postId', getAllComments);
router.patch('/:commentId', authMiddleware, updateComment);
router.delete('/:commentId', authMiddleware, deleteComment);

export default router;
