import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserById, getUsers, updateProfile } from '../api/users.api';
import { QueryKey } from '../constants/query-keys';
import { queryClient } from '../lib/query-client';
import type { UpdateUserProfileDto } from '../types/users.types';
import { useAuthStore } from '../stores/auth.store';

export const useUsersQuery = () => {
  return useQuery({
    queryKey: [QueryKey.USERS],
    queryFn: getUsers,
  });
};

export const useUserProfileQuery = (userId: string) => {
  return useQuery({
    queryKey: [QueryKey.USER_PROFILE, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateProfileMutation = () => {
  const { setAuth, token } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateUserProfileDto) => updateProfile(data),
    onSuccess: (updatedUser) => {
      if (token) {
        setAuth(updatedUser, token);
      }
      void queryClient.invalidateQueries({ queryKey: [QueryKey.USERS] });
    },
  });
};
