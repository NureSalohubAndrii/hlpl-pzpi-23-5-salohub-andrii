export interface PostAuthor {
  id: string;
  avatarUrl: string;
  fullName: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: PostAuthor;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
}

export interface CreatePostDto {
  title: string;
  description: string;
  imageUrl: string;
  authorId: string;
}
