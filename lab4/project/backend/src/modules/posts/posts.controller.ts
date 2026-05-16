import { ExpressHandler } from '../../shared/types/express.types';
import { handleError } from '../../shared/utils/app-error.util';
import * as postsServices from './posts.service';

export const createPost: ExpressHandler = async (req, res) => {
  try {
    const post = await postsServices.createPost(req.body);

    res.status(200).json({ message: 'Post created successful', post });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllPosts: ExpressHandler = async (_, res) => {
  try {
    const allPosts = await postsServices.getAllPosts();
    res.status(200).json({ posts: allPosts });
  } catch (error) {
    handleError(res, error);
  }
};

export const updatePost: ExpressHandler = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.userId as string;
    const post = await postsServices.updatePost(postId, req.body, userId);
    res.status(200).json({ message: 'Post updated', post });
  } catch (error) {
    handleError(res, error);
  }
};

export const deletePost: ExpressHandler = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.userId as string;
    await postsServices.deletePost(postId, userId);
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    handleError(res, error);
  }
};

export const getPostById: ExpressHandler = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postsServices.getPostById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.status(200).json({ post });
  } catch (error) {
    handleError(res, error);
  }
};
