export interface UpdateUserProfileDto {
  fullName: string;
  avatarUrl?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  isEmailVerified: boolean;
}
