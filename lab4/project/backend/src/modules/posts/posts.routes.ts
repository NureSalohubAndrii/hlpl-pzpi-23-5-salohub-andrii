import { Router } from 'express';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from './posts.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/', getAllPosts);
router.post('/', authMiddleware, createPost);
router.get('/:postId', getPostById);
router.patch('/:postId', authMiddleware, updatePost);
router.delete('/:postId', authMiddleware, deletePost);

export default router;
