import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { useState, type FC } from 'react';
import type { Post } from '../../types/posts.types';
import { useUpdatePost } from '../../hooks/useUpdatePost';
import { usePostsStore } from '../../stores/posts.store';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

interface EditPostDialogProps {
  post: Post;
  editOpen: boolean;
  setEditOpen: (value: boolean) => void;
  onUpdate?: (updatedPost: Post) => void;
}

const EditPostDialog: FC<EditPostDialogProps> = ({
  editOpen,
  setEditOpen,
  post,
  onUpdate,
}) => {
  const { updatePost, isLoading: isUpdating } = useUpdatePost();
  const { posts, setPosts } = usePostsStore();

  const [form, setForm] = useState({
    title: post.title,
    description: post.description ?? '',
    imageUrl: post.imageUrl ?? '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    const result = await updatePost(post.id, form);
    if (result.success && result.post && posts) {
      setPosts(posts.map((p) => (p.id === post.id ? { ...p, ...form } : p)));
      onUpdate?.(result.post);
      setEditOpen(false);
    }
  };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-title"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-imageUrl">Image URL</Label>
            <Input
              id="edit-imageUrl"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setEditOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={!form.title.trim() || isUpdating}
          >
            {isUpdating && (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            )}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialog;
