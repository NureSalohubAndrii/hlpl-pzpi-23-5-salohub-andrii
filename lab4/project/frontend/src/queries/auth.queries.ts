import { useMutation } from '@tanstack/react-query';
import { login, register, verifyEmail } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';
import type { LoginDto, RegisterDto } from '../types/auth.types';

export const useLoginMutation = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginDto) => login(data),
    onSuccess: ({ user, accessToken }) => {
      setAuth(user, accessToken);
    },
  });
};

export const useRegisterMutation = () => {
  const { setRegisteredEmail } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterDto) => register(data),
    onSuccess: ({ email }) => {
      setRegisteredEmail(email);
    },
  });
};

export const useVerifyEmailMutation = () => {
  const { registeredEmail, setRegisteredEmail, setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (code: string) => {
      if (!registeredEmail) throw new Error('Missing email');
      return verifyEmail(registeredEmail, code);
    },
    onSuccess: ({ user, accessToken }) => {
      setAuth(user, accessToken);
      setRegisteredEmail(null);
    },
  });
};
