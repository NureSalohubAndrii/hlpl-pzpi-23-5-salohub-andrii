import type {
  Friend,
  IncomingFriendRequest,
  OutcomingFriendRequest,
} from '../types/friends.types';
import { apiRequest } from './client';

export interface FriendsData {
  friends: Friend[];
  incomingRequests: IncomingFriendRequest[];
  outgoingRequests: OutcomingFriendRequest[];
}

export const getFriendsMe = async (): Promise<FriendsData> => {
  return apiRequest<FriendsData>('/friends/me', { method: 'GET' });
};

export const sendFriendRequest = async (friendId: string): Promise<void> => {
  await apiRequest(`/friends/request/${friendId}`, { method: 'POST' });
};

export const acceptFriendRequest = async (friendId: string): Promise<void> => {
  await apiRequest(`/friends/accept/${friendId}`, { method: 'PATCH' });
};

export const deleteFriend = async (friendId: string): Promise<void> => {
  await apiRequest(`/friends/${friendId}`, { method: 'DELETE' });
};
