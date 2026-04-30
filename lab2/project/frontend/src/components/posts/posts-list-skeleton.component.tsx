const PostsListSkeleton = () => (
  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <li
        key={i}
        className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden animate-pulse"
      >
        <div className="h-48 bg-muted" />
        <div className="flex flex-col gap-3 p-4">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-2/3" />
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-muted" />
              <div className="h-3 bg-muted rounded w-20" />
            </div>
            <div className="h-3 bg-muted rounded w-16" />
          </div>
        </div>
      </li>
    ))}
  </ul>
);

export default PostsListSkeleton;
