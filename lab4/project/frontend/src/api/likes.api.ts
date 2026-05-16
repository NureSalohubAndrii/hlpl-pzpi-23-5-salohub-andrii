import type { UserLike } from '../types/likes.types';
import { apiRequest } from './client';

export const likePost = async (postId: string): Promise<void> => {
  await apiRequest(`/likes/post/${postId}`, {
    method: 'POST',
  });
};

export const unlikePost = async (postId: string): Promise<void> => {
  await apiRequest(`/likes/post/${postId}`, {
    method: 'DELETE',
  });
};

export const getUserLikedPosts = async (): Promise<UserLike[]> => {
  const response = await apiRequest<{ likedPosts: UserLike[] }>(
    `/likes/user/liked-posts`,
    {
      method: 'GET',
    }
  );
  return response.likedPosts;
};
