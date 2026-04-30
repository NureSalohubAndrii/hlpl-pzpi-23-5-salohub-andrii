import { useState } from 'react';
import { apiRequest } from '../api/client';
import type { Post } from '../types/posts.types';

interface UseGetPostByIdReturn {
  getPostById: (postId: string) => Promise<Post | null>;
  isLoading: boolean;
}

export const useGetPostById = (): UseGetPostByIdReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const getPostById = async (postId: string): Promise<Post | null> => {
    setIsLoading(true);
    try {
      const response = await apiRequest<{ post: Post }>(`/posts/${postId}`, {
        method: 'GET',
      });
      return response.post;
    } catch {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { getPostById, isLoading };
};
