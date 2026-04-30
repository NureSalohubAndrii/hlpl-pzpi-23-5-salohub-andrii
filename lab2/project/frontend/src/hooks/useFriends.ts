import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../api/client';
import type {
  Friend,
  IncomingFriendRequest,
  OutcomingFriendRequest,
} from '../types/friends.types';

export const useFriends = () => {
  const [data, setData] = useState<{
    friends: Friend[];
    incomingRequests: IncomingFriendRequest[];
    outgoingRequests: OutcomingFriendRequest[];
  }>({
    friends: [],
    incomingRequests: [],
    outgoingRequests: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchFriends = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest<any>('/friends/me');
      setData(response);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptRequest = async (friendId: string) => {
    await apiRequest(`/friends/accept/${friendId}`, { method: 'PATCH' });
    await fetchFriends();
  };

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return { ...data, isLoading, acceptRequest, refresh: fetchFriends };
};
