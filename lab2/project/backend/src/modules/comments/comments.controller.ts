import { ExpressHandler } from '../../shared/types/express.types';
import { handleError } from '../../shared/utils/app-error.util';
import * as commentsService from './comments.service';

export const createComment: ExpressHandler = async (req, res) => {
  try {
    const comment = await commentsService.createComment(req.body);

    res.status(200).json({ message: 'Comment created successful', comment });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllComments: ExpressHandler = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await commentsService.getAllComments(postId);
    res.status(200).json({ comments });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateComment: ExpressHandler = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await commentsService.updateComment(commentId, req.body);

    res.status(200).json({ message: 'Comment updated', comment });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteComment: ExpressHandler = async (req, res) => {
  try {
    const { commentId } = req.params;
    await commentsService.deleteComment(commentId);
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    handleError(res, error);
  }
};
