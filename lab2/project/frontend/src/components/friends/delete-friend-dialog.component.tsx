import type { FC } from 'react';
import { useDeleteFriend } from '../../hooks/useDeleteFriend';
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

interface DeleteFriendDialogProps {
  friendId: string;
  friendName: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSuccess?: () => void;
  type?: DeleteFriendType;
}

const DeleteFriendDialog: FC<DeleteFriendDialogProps> = ({
  friendId,
  friendName,
  isOpen,
  setIsOpen,
  onSuccess,
  type = DeleteFriendType.FRIEND,
}) => {
  const { deleteFriend, isLoading: isDeleting } = useDeleteFriend();

  const handleDelete = async () => {
    const result = await deleteFriend(friendId);
    if (result.success) {
      setIsOpen(false);
      onSuccess?.();
    } else {
      if (type === DeleteFriendType.FRIEND) {
        toast.error('Failed to delete friend');
      } else {
        toast.error('Failed to delete friend request');
      }
    }
  };

  const config = {
    title:
      type === DeleteFriendType.FRIEND ? 'Remove Friend' : 'Cancel Request',
    description:
      type === 'friend'
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
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && (
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
