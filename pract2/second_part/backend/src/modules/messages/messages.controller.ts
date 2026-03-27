import { ExpressHandler } from '../../shared/types/express.types';
import { handleError } from '../../shared/utils/app-error.util';
import * as messagesService from './messages.service';

export const getConversation: ExpressHandler = async (req, res) => {
  try {
    const currentUserId = req?.user?.userId;
    const { userId } = req.params;

    if (!currentUserId || !userId) {
      res.status(400).json({ message: 'Missing user IDs' });
      return;
    }

    const conversation = await messagesService.getConversation(
      currentUserId,
      userId
    );

    res.status(200).json({ messages: conversation });
  } catch (error) {
    handleError(res, error);
  }
};
