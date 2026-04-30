export interface User {
  fullName: string;
  email: string;
  id: string;
  isEmailVerified: boolean;
  avatarUrl?: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
