import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  registeredEmail: string | null;
  setRegisteredEmail: (email: string | null) => void;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      registeredEmail: null,
      setRegisteredEmail: (email) => set({ registeredEmail: email }),
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null, registeredEmail: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
