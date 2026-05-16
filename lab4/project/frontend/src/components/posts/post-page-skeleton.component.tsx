const PostPageSkeleton = () => (
  <div className="max-w-2xl mx-auto mt-8 px-4 animate-pulse w-full">
    <div className="h-8 w-20 bg-muted rounded mb-6" />
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="h-72 bg-muted" />
      <div className="p-6 flex flex-col gap-5">
        <div className="h-7 bg-muted rounded w-3/4" />
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted" />
            <div className="flex flex-col gap-1.5">
              <div className="h-4 bg-muted rounded w-28" />
              <div className="h-3 bg-muted rounded w-36" />
            </div>
          </div>
          <div className="h-4 bg-muted rounded w-24" />
        </div>
      </div>
    </div>
  </div>
);

export default PostPageSkeleton;
