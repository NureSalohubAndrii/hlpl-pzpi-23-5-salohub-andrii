import type { Comment, CreateCommentDto } from '../types/comments.types';
import { apiRequest } from './client';

export const getComments = async (postId: string): Promise<Comment[]> => {
  const response = await apiRequest<{ comments: Comment[] }>(
    `/comments/${postId}`,
    { method: 'GET' }
  );
  return response.comments;
};

export const createComment = async (data: CreateCommentDto): Promise<Comment> => {
  const response = await apiRequest<{ comment: Comment }>('/comments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.comment;
};

export const updateComment = async (
  commentId: string,
  data: Partial<Pick<Comment, 'content'>>
): Promise<Comment> => {
  const response = await apiRequest<{ comment: Comment }>(
    `/comments/${commentId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
  return response.comment;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await apiRequest(`/comments/${commentId}`, { method: 'DELETE' });
};
