import { type FC } from 'react';
import type { Post } from '../../types/posts.types';
import PostCard from './post-card.component';
import PostsListSkeleton from './posts-list-skeleton.component';

interface PostsListProps {
  isLoading?: boolean;
  posts: Post[];
}

const PostsList: FC<PostsListProps> = ({ isLoading = false, posts }) => {
  if (isLoading) {
    return <PostsListSkeleton />;
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
        <p className="text-lg font-medium">No posts found</p>
        <p className="text-sm">
          Try adjusting your search or create a new post
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ul>
  );
};

export default PostsList;
