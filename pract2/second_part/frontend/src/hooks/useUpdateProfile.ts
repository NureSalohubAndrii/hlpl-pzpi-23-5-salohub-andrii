import { useState } from 'react';
import { ApiError, apiRequest } from '../api/client';
import type { UpdateUserProfileDto } from '../types/users.types';
import { useAuthStore } from '../stores/auth.store';
import type { User } from '../types/auth.types';
import type { ActionResult } from '../types/common.types';

interface UseUpdateProfileReturn {
  updateProfile: (data: UpdateUserProfileDto) => Promise<ActionResult>;
  isLoading: boolean;
}

export const useUpdateProfile = (): UseUpdateProfileReturn => {
  const { setAuth, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateProfile = async (data: UpdateUserProfileDto) => {
    try {
      const response = await apiRequest<{ user: User; message: string }>(
        '/users/me',
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      );

      setAuth(response.user, token!);
      return { success: true, error: null };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unexpected error';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading };
};
