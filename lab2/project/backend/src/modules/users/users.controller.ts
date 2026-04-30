import { ExpressHandler } from '../../shared/types/express.types';
import { handleError } from '../../shared/utils/app-error.util';
import { UpdateUserDto } from './types/users.type';
import * as userService from './users.service';

export const updateMe: ExpressHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: User ID not found' });
      return;
    }

    const updatedUser = await userService.updateMe(
      userId,
      req.body as UpdateUserDto
    );

    res.status(200).json({
      message: 'User data updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllUsers: ExpressHandler = async (req, res) => {
  try {
    const currentUserId = req.user?.userId;
    const allUsers = await userService.getAllUsers(currentUserId!);
    res.status(200).json({ users: allUsers });
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserById: ExpressHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = await userService.getUserById(userId);

    res.status(200).json({ ...currentUser });
  } catch (error) {
    handleError(res, error);
  }
};
