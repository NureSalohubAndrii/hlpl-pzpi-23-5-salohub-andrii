import { useState } from 'react';
import type { ActionResult } from '../types/common.types';
import { ApiError, apiRequest } from '../api/client';
import { useUsersStore } from '../stores/users.store';
import type { User } from '../types/auth.types';

interface GetUsersResult {
  getAllUsers: () => Promise<ActionResult>;
  isLoading?: boolean;
}

export const useGetUsers = (): GetUsersResult => {
  const { setUsers } = useUsersStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAllUsers = async () => {
    setIsLoading(true);

    try {
      const response = await apiRequest<{ users: User[] }>('/users', {
        method: 'GET',
      });

      setUsers(response.users);
      return { success: true, error: null };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unexpected error';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { getAllUsers, isLoading };
};
