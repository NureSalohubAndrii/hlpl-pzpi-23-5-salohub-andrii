import type {
  LoginDto,
  RegisterDto,
  RegisterResponse,
  User,
} from '../types/auth.types';
import { apiRequest } from './client';

export const login = async (
  data: LoginDto
): Promise<{ user: User; accessToken: string }> => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const register = async (data: RegisterDto): Promise<RegisterResponse> => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const verifyEmail = async (
  email: string,
  code: string
): Promise<{ user: User; accessToken: string }> => {
  return apiRequest('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
};
