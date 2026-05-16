import { ExpressHandler } from '../../shared/types/express.types';
import { handleError } from '../../shared/utils/app-error.util';
import * as friendsService from './friends.service';

export const sendRequest: ExpressHandler = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user?.userId as string;
    await friendsService.sendFriendRequest(userId, friendId);
    res.status(200).json({ message: 'Friend request sent' });
  } catch (error) {
    handleError(res, error);
  }
};

export const acceptRequest: ExpressHandler = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user?.userId as string;
    await friendsService.acceptFriendRequest(userId, friendId);
    res.status(200).json({ message: 'Request accepted' });
  } catch (error) {
    handleError(res, error);
  }
};

export const getMyFriends: ExpressHandler = async (req, res) => {
  try {
    const userId = req.user?.userId as string;
    const data = await friendsService.getFriendSystemData(userId);
    res.status(200).json(data);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteFriend: ExpressHandler = async (req, res) => {
  try {
    const userId = req.user?.userId as string;
    const { friendId } = req.params;
    await friendsService.deleteFromFriends(userId, friendId);
    res.status(200).json({ message: 'Friend deleted' });
  } catch (error) {
    handleError(res, error);
  }
};
