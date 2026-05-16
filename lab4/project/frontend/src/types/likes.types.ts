export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface UserLike {
  id: string;
  postId: string;
  createdAt: string;
}

export interface PostLike {
  id: string;
  userId: string;
  createdAt: string;
}
