import { useState } from 'react';
import { ApiError, apiRequest } from '../api/client';
import type { Comment, CreateCommentDto } from '../types/comments.types';
import type { ActionResult } from '../types/common.types';

export const useCreateComment = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createComment = async (
    data: CreateCommentDto
  ): Promise<ActionResult & { comment?: Comment }> => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest<{ comment: Comment }>(`/comments`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return { success: true, error: null, comment: response.comment };
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Error';
      return { success: false, error: message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createComment, isSubmitting };
};
