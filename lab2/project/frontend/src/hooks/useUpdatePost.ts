import { useState } from 'react';
import { ApiError, apiRequest } from '../api/client';
import type { Post } from '../types/posts.types';

interface UseUpdatePostReturn {
  updatePost: (
    postId: string,
    data: Partial<Pick<Post, 'title' | 'description' | 'imageUrl'>>
  ) => Promise<{ success: boolean; post?: Post; error: string | null }>;
  isLoading: boolean;
}

export const useUpdatePost = (): UseUpdatePostReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const updatePost = async (
    postId: string,
    data: Partial<Pick<Post, 'title' | 'description' | 'imageUrl'>>
  ) => {
    setIsLoading(true);
    try {
      const response = await apiRequest<{ post: Post }>(`/posts/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return { success: true, post: response.post, error: null };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unexpected error';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { updatePost, isLoading };
};
