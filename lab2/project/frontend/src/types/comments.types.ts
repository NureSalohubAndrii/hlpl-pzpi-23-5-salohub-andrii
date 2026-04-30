export interface Comment {
  id: string;
  content: string;
  postId: string;
  createdAt: string;
  author: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    email: string;
  };
}

export interface CreateCommentDto {
  content: string;
  postId: string;
  authorId: string;
}
