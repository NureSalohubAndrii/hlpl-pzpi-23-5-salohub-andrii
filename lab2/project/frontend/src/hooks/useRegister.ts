import { useState } from 'react';
import type { RegisterDto, RegisterResponse } from '../types/auth.types';
import { useAuthStore } from '../stores/auth.store';
import { ApiError, apiRequest } from '../api/client';
import type { ActionResult } from '../types/common.types';

interface UseRegisterReturn {
  register: (data: RegisterDto) => Promise<ActionResult>;
  isLoading: boolean;
}

export const useRegister = (): UseRegisterReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { setRegisteredEmail } = useAuthStore();

  const register = async (data: RegisterDto) => {
    setIsLoading(true);

    try {
      const response = await apiRequest<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      setRegisteredEmail(response.email);
      return { success: true, error: null };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Unexpected error';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};
