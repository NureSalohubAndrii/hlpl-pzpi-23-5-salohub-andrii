import { useState } from 'react';
import { apiRequest } from '../api/client';
import type { Comment } from '../types/comments.types';

export const useGetComments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const getComments = async (postId: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest<{ comments: Comment[] }>(
        `/comments/${postId}`
      );
      setComments(response.comments);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { comments, getComments, isLoading, setComments };
};
