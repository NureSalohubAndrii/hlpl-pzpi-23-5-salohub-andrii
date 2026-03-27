import { useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { ApiError, apiRequest } from '../api/client';
import type { User } from '../types/auth.types';
import type { ActionResult } from '../types/common.types';

interface UseVerifyEmailReturn {
  verifyEmail: (code: string) => Promise<ActionResult>;
  isLoading: boolean;
}

export const useVerifyEmail = (): UseVerifyEmailReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { registeredEmail, setRegisteredEmail, setAuth } = useAuthStore();

  const verifyEmail = async (code: string) => {
    if (!registeredEmail) {
      return { success: false, error: 'Missing email' };
    }

    setIsLoading(true);

    try {
      const response = await apiRequest<{ user: User; accessToken: string }>(
        '/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({ email: registeredEmail, code }),
        }
      );

      setAuth(response.user, response.accessToken);
      setRegisteredEmail(null);
      return { success: true, error: null };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unexpected error';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { verifyEmail, isLoading };
};
