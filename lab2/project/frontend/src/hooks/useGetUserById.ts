import { useState } from 'react';
import { apiRequest } from '../api/client';
import type { UserProfile } from '../types/users.types';

interface UseGetUserByIdReturn {
  getUserById: (userId: string) => Promise<UserProfile | null>;
  isLoading: boolean;
}

export const useGetUserById = (): UseGetUserByIdReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const getUserById = async (userId: string): Promise<UserProfile | null> => {
    setIsLoading(true);
    try {
      const response = await apiRequest<UserProfile>(`/users/${userId}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { getUserById, isLoading };
};
