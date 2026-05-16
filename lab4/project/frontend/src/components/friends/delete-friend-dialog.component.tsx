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
import { toast } from 'sonner';
import { DeleteFriendType } from '../../types/friends.types';
import { useDeleteFriendMutation } from '../../queries/friends.queries';

interface DeleteFriendDialogProps {
  friendId: string;
  friendName: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  type?: DeleteFriendType;
}

const DeleteFriendDialog: FC<DeleteFriendDialogProps> = ({
  friendId,
  friendName,
  isOpen,
  setIsOpen,
  type = DeleteFriendType.FRIEND,
}) => {
  const { mutateAsync: deleteFriend, isPending } = useDeleteFriendMutation();

  const handleDelete = async () => {
    try {
      await deleteFriend(friendId);
      setIsOpen(false);
    } catch {
      if (type === DeleteFriendType.FRIEND) {
        toast.error('Failed to delete friend');
      } else {
        toast.error('Failed to cancel friend request');
      }
    }
  };

  const config = {
    title:
      type === DeleteFriendType.FRIEND ? 'Remove Friend' : 'Cancel Request',
    description:
      type === DeleteFriendType.FRIEND
        ? `Are you sure you want to remove ${friendName} from your friends?`
        : `Are you sure you want to cancel/decline the request for ${friendName}?`,
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{config.title}</AlertDialogTitle>
          <AlertDialogDescription>{config.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending && (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            )}
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteFriendDialog;
