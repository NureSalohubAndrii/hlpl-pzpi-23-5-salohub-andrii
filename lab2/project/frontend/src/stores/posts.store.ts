import { create } from 'zustand';
import type { Post } from '../types/posts.types';

interface PostsState {
  posts: Post[] | null;
  setPosts: (posts: Post[]) => Promise<void>;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: null,
  setPosts: async (posts) => {
    set({ posts });
  },
}));
