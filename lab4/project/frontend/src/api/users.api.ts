import type { User } from '../types/auth.types';
import type { UpdateUserProfileDto, UserProfile } from '../types/users.types';
import { apiRequest } from './client';

export const getUsers = async (): Promise<User[]> => {
  const response = await apiRequest<{ users: User[] }>('/users', {
    method: 'GET',
  });
  return response.users;
};

export const getUserById = async (userId: string): Promise<UserProfile> => {
  return apiRequest<UserProfile>(`/users/${userId}`, { method: 'GET' });
};

export const updateProfile = async (data: UpdateUserProfileDto): Promise<User> => {
  const response = await apiRequest<{ user: User; message: string }>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return response.user;
};
