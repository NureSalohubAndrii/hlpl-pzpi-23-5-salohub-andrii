import { useMemo, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import PostsFilters from '../components/posts/posts-filters.component';
import PostsList from '../components/posts/posts-list.component';
import { usePostsQuery } from '../queries/posts.queries';

const PostsPage = () => {
  const { data: posts, isLoading } = usePostsQuery();

  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search);

  const filteredPosts = useMemo(() => {
    if (!posts) {
      return [];
    }
    if (!debouncedSearch.trim()) {
      return posts;
    }

    const searchTerm = debouncedSearch.toLowerCase();

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.description.toLowerCase().includes(searchTerm) ||
        post.author.fullName.toLowerCase().includes(searchTerm) ||
        post.author.email.toLowerCase().includes(searchTerm)
    );
  }, [posts, debouncedSearch]);

  return (
    <section className="flex flex-col w-full mt-8">
      <PostsFilters search={search} setSearch={setSearch} />
      <PostsList posts={filteredPosts} isLoading={isLoading} />
    </section>
  );
};

export default PostsPage;
