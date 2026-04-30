import type { FC } from 'react';
import { useDeletePost } from '../../hooks/useDeletePost';
import { usePostsStore } from '../../stores/posts.store';
import type { Post } from '../../types/posts.types';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface DeletePostDialogProps {
  post: Post;
  deleteOpen: boolean;
  setDeleteOpen: (value: boolean) => void;
  onSuccess?: () => void;
}

const DeletePostDialog: FC<DeletePostDialogProps> = ({
  post,
  deleteOpen,
  setDeleteOpen,
  onSuccess,
}) => {
  const { posts, setPosts } = usePostsStore();
  const { deletePost, isLoading: isDeleting } = useDeletePost();

  const handleDelete = async () => {
    const result = await deletePost(post.id);
    if (result.success && posts) {
      setPosts(posts.filter((p) => p.id !== post.id));
      setDeleteOpen(false);
      onSuccess?.();
    }
  };

  return (
    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete post?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The post will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePostDialog;
