import type { FC } from 'react';
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
import { useDeleteCommentMutation } from '../../queries/comments.queries';

interface DeleteCommentDialogProps {
  commentId: string;
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteCommentDialog: FC<DeleteCommentDialogProps> = ({
  commentId,
  postId,
  open,
  onOpenChange,
}) => {
  const { mutateAsync: deleteComment, isPending } =
    useDeleteCommentMutation(postId);

  const handleDelete = async () => {
    await deleteComment(commentId);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete comment?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure? This comment will be removed permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
          >
            {isPending && (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCommentDialog;
