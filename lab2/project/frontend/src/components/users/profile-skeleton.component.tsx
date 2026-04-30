const ProfileSkeleton = () => (
  <section className="max-w-lg mx-auto mt-10 px-4 animate-pulse w-full">
    <div className="h-8 w-20 bg-muted rounded mb-6" />
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="h-28 bg-muted" />
      <div className="px-6 pb-6">
        <div className="w-20 h-20 rounded-full bg-muted -mt-12 mb-4 ring-4 ring-card" />
        <div className="h-5 bg-muted rounded w-40 mb-4" />
        <div className="h-4 bg-muted rounded w-56 mb-2" />
        <div className="h-4 bg-muted rounded w-32 mb-5" />
        <div className="h-px bg-border my-5" />
        <div className="h-10 bg-muted rounded" />
      </div>
    </div>
  </section>
);

export default ProfileSkeleton;
