import { create } from 'zustand';
import type { User } from '../types/auth.types';

interface UsersState {
  users: User[] | null;
  setUsers: (users: User[]) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: null,
  setUsers: async (users) => {
    set({ users });
  },
}));
