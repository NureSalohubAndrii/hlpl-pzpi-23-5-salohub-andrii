import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from '../api/comments.api';
import { QueryKey } from '../constants/query-keys';
import { queryClient } from '../lib/query-client';
import type { Comment, CreateCommentDto } from '../types/comments.types';

export const useCommentsQuery = (postId: string) => {
  return useQuery({
    queryKey: [QueryKey.COMMENTS, postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });
};

export const useCreateCommentMutation = (postId: string) => {
  return useMutation({
    mutationFn: (data: CreateCommentDto) => createComment(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [QueryKey.COMMENTS, postId],
      });
    },
  });
};

export const useUpdateCommentMutation = (postId: string) => {
  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: string;
      data: Partial<Pick<Comment, 'content'>>;
    }) => updateComment(commentId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [QueryKey.COMMENTS, postId],
      });
    },
  });
};

export const useDeleteCommentMutation = (postId: string) => {
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [QueryKey.COMMENTS, postId],
      });
    },
  });
};
