import { useState } from 'react';
import { ApiError, apiRequest } from '../api/client';
import type { Comment } from '../types/comments.types';

interface UseUpdateCommentReturn {
  updateComment: (
    commentId: string,
    data: Partial<Pick<Comment, 'content'>>
  ) => Promise<{ success: boolean; comment?: Comment; error: string | null }>;
  isLoading: boolean;
}

export const useUpdateComment = (): UseUpdateCommentReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const updateComment = async (
    commentId: string,
    data: Partial<Pick<Comment, 'content'>>
  ) => {
    setIsLoading(true);
    try {
      const response = await apiRequest<{ comment: Comment }>(
        `/comments/${commentId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      );
      return { success: true, comment: response.comment, error: null };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unexpected error';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateComment, isLoading };
};
