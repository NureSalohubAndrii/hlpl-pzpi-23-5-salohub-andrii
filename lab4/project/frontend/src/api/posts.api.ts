import type { CreatePostDto, Post } from '../types/posts.types';
import { apiRequest } from './client';

export const getPosts = async (): Promise<Post[]> => {
  const response = await apiRequest<{ posts: Post[] }>('/posts', {
    method: 'GET',
  });
  return response.posts;
};

export const getPostById = async (postId: string): Promise<Post> => {
  const response = await apiRequest<{ post: Post }>(`/posts/${postId}`, {
    method: 'GET',
  });
  return response.post;
};

export const createPost = async (data: CreatePostDto): Promise<Post> => {
  const response = await apiRequest<{ post: Post }>('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.post;
};

export const updatePost = async (
  postId: string,
  data: Partial<Pick<Post, 'title' | 'description' | 'imageUrl'>>
): Promise<Post> => {
  const response = await apiRequest<{ post: Post }>(`/posts/${postId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return response.post;
};

export const deletePost = async (postId: string): Promise<void> => {
  await apiRequest(`/posts/${postId}`, { method: 'DELETE' });
};
