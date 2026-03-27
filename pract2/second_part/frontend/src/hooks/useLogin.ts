import { useState } from 'react';
import type { LoginDto, User } from '../types/auth.types';
import { ApiError, apiRequest } from '../api/client';
import { useAuthStore } from '../stores/auth.store';
import type { ActionResult } from '../types/common.types';

interface UseLoginReturn {
  login: (data: LoginDto) => Promise<ActionResult>;
  isLoading: boolean;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setAuth } = useAuthStore();

  const login = async (data: LoginDto) => {
    setIsLoading(true);

    try {
      const response = await apiRequest<{ user: User; accessToken: string }>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      setAuth(response.user, response.accessToken);
      return { success: true, error: null };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unexpected error';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
