import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserLikedPosts, likePost, unlikePost } from '../api/likes.api';
import { QueryKey } from '../constants/query-keys';
import { queryClient } from '../lib/query-client';
import type { Post } from '../types/posts.types';

/** Keep list + detail post likeCount in sync with server after like/unlike. */
const adjustPostLikeCountInCache = (postId: string, delta: number) => {
  queryClient.setQueryData<Post[]>([QueryKey.POSTS], (prev) =>
    prev?.map((p) =>
      p.id === postId
        ? { ...p, likeCount: Math.max(0, p.likeCount + delta) }
        : p
    )
  );
  queryClient.setQueryData<Post | undefined>([QueryKey.POST, postId], (prev) =>
    prev
      ? { ...prev, likeCount: Math.max(0, prev.likeCount + delta) }
      : prev
  );
};

export const useUserLikedPostsQuery = (userId?: string) => {
  return useQuery({
    queryKey: [QueryKey.USER_LIKED_POSTS, userId],
    queryFn: getUserLikedPosts,
    enabled: !!userId,
  });
};

export const useLikePostMutation = () => {
  return useMutation({
    mutationFn: (postId: string) => likePost(postId),
    onSuccess: (_data, postId) => {
      adjustPostLikeCountInCache(postId, 1);
      void queryClient.invalidateQueries({
        queryKey: [QueryKey.USER_LIKED_POSTS],
      });
    },
  });
};

export const useUnlikePostMutation = () => {
  return useMutation({
    mutationFn: (postId: string) => unlikePost(postId),
    onSuccess: (_data, postId) => {
      adjustPostLikeCountInCache(postId, -1);
      void queryClient.invalidateQueries({
        queryKey: [QueryKey.USER_LIKED_POSTS],
      });
    },
  });
};
