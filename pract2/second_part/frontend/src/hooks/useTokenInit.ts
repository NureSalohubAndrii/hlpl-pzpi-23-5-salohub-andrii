import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { apiRequest } from '../api/client';
import type { User } from '../types/auth.types';

export const useTokenInit = () => {
  const [isReady, setIsReady] = useState(false);
  const { token, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setIsReady(true);
        return;
      }

      try {
        const user = await apiRequest<User>('/auth/me');
        setAuth(user, useAuthStore.getState().token!);
      } catch {
        clearAuth();
      } finally {
        setIsReady(true);
      }
    };

    init();
  }, []);

  return { isReady };
};
