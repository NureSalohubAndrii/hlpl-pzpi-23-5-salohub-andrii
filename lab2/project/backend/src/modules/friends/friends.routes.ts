import { Router } from 'express';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import {
  acceptRequest,
  deleteFriend,
  getMyFriends,
  sendRequest,
} from './friends.controller';

const router = Router();
router.get('/me', authMiddleware, getMyFriends);
router.post('/request/:friendId', authMiddleware, sendRequest);
router.patch('/accept/:friendId', authMiddleware, acceptRequest);
router.delete('/:friendId', authMiddleware, deleteFriend);

export default router;
