import { Router } from 'express';
import {
  createLike,
  deleteLike,
  getUserLikes,
  getPostLikes,
  getPostLikeCount,
  getUserLikedPosts,
} from './likes.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/user', authMiddleware, getUserLikes);
router.get('/user/liked-posts', authMiddleware, getUserLikedPosts);

router.get('/post/:postId', getPostLikes);
router.get('/post/:postId/count', getPostLikeCount);

router.post('/post/:postId', authMiddleware, createLike);
router.delete('/post/:postId', authMiddleware, deleteLike);

export default router;

