import { useState } from 'react';
import { ApiError, apiRequest } from '../api/client';

interface UseDeleteFriendReturn {
  deleteFriend: (
    friendId: string
  ) => Promise<{ success: boolean; error: string | null }>;
  isLoading: boolean;
}

export const useDeleteFriend = (): UseDeleteFriendReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteFriend = async (friendId: string) => {
    setIsLoading(true);
    try {
      await apiRequest(`/friends/${friendId}`, { method: 'DELETE' });
      return { success: true, error: null };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unexpected error';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteFriend, isLoading };
};
