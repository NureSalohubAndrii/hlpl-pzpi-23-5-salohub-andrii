import { useState } from 'react';
import { ApiError, apiRequest } from '../api/client';

interface UseDeletePostReturn {
  deletePost: (
    postId: string
  ) => Promise<{ success: boolean; error: string | null }>;
  isLoading: boolean;
}

export const useDeletePost = (): UseDeletePostReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const deletePost = async (postId: string) => {
    setIsLoading(true);
    try {
      await apiRequest(`/posts/${postId}`, { method: 'DELETE' });
      return { success: true, error: null };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unexpected error';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { deletePost, isLoading };
};
