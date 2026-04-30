import { useState } from 'react';
import { ApiError, apiRequest } from '../api/client';

interface UseDeleteCommentReturn {
  deleteComment: (
    commentId: string
  ) => Promise<{ success: boolean; error: string | null }>;
  isLoading: boolean;
}

export const useDeleteComment = (): UseDeleteCommentReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteComment = async (commentId: string) => {
    setIsLoading(true);
    try {
      await apiRequest(`/comments/${commentId}`, { method: 'DELETE' });
      return { success: true, error: null };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unexpected error';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteComment, isLoading };
};
