import { type FC } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CreatePostDialog from './create-post-dialog.component';
import { useState } from 'react';

interface PostsFiltersProps {
  search: string;
  setSearch: (value: string) => void;
}

const PostsFilters: FC<PostsFiltersProps> = ({ search, setSearch }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, description or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-muted/20"
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="shrink-0">
          + Create Post
        </Button>
      </div>

      <CreatePostDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
};

export default PostsFilters;
