import { useState } from 'react';
import { usePostsStore } from '../stores/posts.store';
import type { ActionResult } from '../types/common.types';
import { ApiError, apiRequest } from '../api/client';
import type { Post } from '../types/posts.types';

interface GetPostsResult {
  getAllPosts: () => Promise<ActionResult>;
  isLoading?: boolean;
}

export const useGetPosts = (): GetPostsResult => {
  const { setPosts } = usePostsStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAllPosts = async () => {
    setIsLoading(true);

    try {
      const response = await apiRequest<{ posts: Post[] }>('/posts', {
        method: 'GET',
      });

      setPosts(response.posts);
      return { success: true, error: null };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unexpected error';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { getAllPosts, isLoading };
};
