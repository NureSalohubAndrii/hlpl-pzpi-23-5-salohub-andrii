import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from '../api/posts.api';
import { QueryKey } from '../constants/query-keys';
import { queryClient } from '../lib/query-client';
import type { CreatePostDto, Post } from '../types/posts.types';

export const usePostsQuery = () => {
  return useQuery({
    queryKey: [QueryKey.POSTS],
    queryFn: getPosts,
  });
};

export const usePostQuery = (postId: string) => {
  return useQuery({
    queryKey: [QueryKey.POST, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useCreatePostMutation = () => {
  return useMutation({
    mutationFn: (data: CreatePostDto) => createPost(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });
};

export const useUpdatePostMutation = () => {
  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: string;
      data: Partial<Pick<Post, 'title' | 'description' | 'imageUrl'>>;
    }) => updatePost(postId, data),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData([QueryKey.POST, updatedPost.id], updatedPost);
      void queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });
};

export const useDeletePostMutation = () => {
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });
};
