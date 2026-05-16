import { ExpressHandler } from '../../shared/types/express.types';
import { handleError } from '../../shared/utils/app-error.util';
import * as likesServices from './likes.service';

export const createLike: ExpressHandler = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.userId as string;

    const like = await likesServices.createLike(postId, userId);
    res.status(201).json({ message: 'Post liked successfully', like });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteLike: ExpressHandler = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.userId as string;

    const like = await likesServices.deleteLike(postId, userId);
    res.status(200).json({ message: 'Post unliked successfully', like });
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserLikes: ExpressHandler = async (req, res) => {
  try {
    const userId = req.user?.userId as string;
    const userLikes = await likesServices.getUserLikes(userId);
    res.status(200).json({ likes: userLikes });
  } catch (error) {
    handleError(res, error);
  }
};

export const getPostLikes: ExpressHandler = async (req, res) => {
  try {
    const { postId } = req.params;
    const postLikes = await likesServices.getPostLikes(postId);
    res.status(200).json({ likes: postLikes });
  } catch (error) {
    handleError(res, error);
  }
};

export const getPostLikeCount: ExpressHandler = async (req, res) => {
  try {
    const { postId } = req.params;
    const likeCount = await likesServices.getPostLikeCount(postId);
    res.status(200).json({ likeCount });
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserLikedPosts: ExpressHandler = async (req, res) => {
  try {
    const userId = req.user?.userId as string;
    const likedPosts = await likesServices.getUserLikedPosts(userId);
    res.status(200).json({ likedPosts });
  } catch (error) {
    handleError(res, error);
  }
};

