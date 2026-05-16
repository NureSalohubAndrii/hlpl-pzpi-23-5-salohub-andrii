import { useMutation, useQuery } from '@tanstack/react-query';
import {
  acceptFriendRequest,
  deleteFriend,
  getFriendsMe,
  sendFriendRequest,
} from '../api/friends.api';
import { QueryKey } from '../constants/query-keys';
import { queryClient } from '../lib/query-client';

export const useFriendsMeQuery = () => {
  return useQuery({
    queryKey: [QueryKey.FRIENDS_ME],
    queryFn: getFriendsMe,
  });
};

export const useSendFriendRequestMutation = () => {
  return useMutation({
    mutationFn: (friendId: string) => sendFriendRequest(friendId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKey.FRIENDS_ME] });
    },
  });
};

export const useAcceptFriendRequestMutation = () => {
  return useMutation({
    mutationFn: (friendId: string) => acceptFriendRequest(friendId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKey.FRIENDS_ME] });
    },
  });
};

export const useDeleteFriendMutation = () => {
  return useMutation({
    mutationFn: (friendId: string) => deleteFriend(friendId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKey.FRIENDS_ME] });
    },
  });
};
