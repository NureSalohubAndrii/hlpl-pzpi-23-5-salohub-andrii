import { useState } from 'react';
import { apiRequest } from '../api/client';
import { toast } from 'sonner';

export const useFriendship = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = async (friendId: string) => {
    setIsLoading(true);
    try {
      await apiRequest(`/friends/request/${friendId}`, { method: 'POST' });
      toast.success('Friend request sent!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to send request');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendRequest, isLoading };
};
