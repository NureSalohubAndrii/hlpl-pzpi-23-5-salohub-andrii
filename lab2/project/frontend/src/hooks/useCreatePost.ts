import { useState } from 'react';
import type { ActionResult } from '../types/common.types';
import type { CreatePostDto, Post } from '../types/posts.types';
import { ApiError, apiRequest } from '../api/client';
import { usePostsStore } from '../stores/posts.store';

interface UseCreatePostReturn {
  createPost: (data: CreatePostDto) => Promise<ActionResult>;
  isLoading: boolean;
}

export const useCreatePost = (): UseCreatePostReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { posts, setPosts } = usePostsStore();

  const createPost = async (data: CreatePostDto) => {
    setIsLoading(true);

    try {
      const response = await apiRequest<{ post: Post }>('/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (posts) {
        setPosts([response.post, ...posts]);
      }

      return { success: true, error: null };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unexpected error';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { createPost, isLoading };
};
