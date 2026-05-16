export enum DeleteFriendType {
  FRIEND = 'friend',
  REQUEST = 'request',
}

export interface Friend {
  avatarUrl: string;
  email: string;
  fullName: string;
  id: string;
}

export interface IncomingFriendRequest {
  avatarUrl: string;
  email: string;
  fullName: string;
  id: string;
  requestId: string;
}

export interface OutcomingFriendRequest {
  avatarUrl: string;
  fullName: string;
  id: string;
}
