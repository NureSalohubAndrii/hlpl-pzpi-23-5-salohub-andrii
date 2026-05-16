import { UserPlus, Check, UserCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { useMemo } from 'react';
import { toast } from 'sonner';
import {
  useAcceptFriendRequestMutation,
  useFriendsMeQuery,
  useSendFriendRequestMutation,
} from '../../queries/friends.queries';

interface AddFriendButtonProps {
  userId: string;
}

export const AddFriendButton = ({ userId }: AddFriendButtonProps) => {
  const { data } = useFriendsMeQuery();
  const { mutateAsync: sendRequest, isPending: isSending } =
    useSendFriendRequestMutation();
  const { mutate: acceptRequest } = useAcceptFriendRequestMutation();

  const isFriend = useMemo(
    () => (data?.friends ?? []).some((friend) => friend.id === userId),
    [data?.friends, userId]
  );
  const isSent = useMemo(
    () => (data?.outgoingRequests ?? []).some((req) => req.id === userId),
    [data?.outgoingRequests, userId]
  );
  const hasIncoming = useMemo(
    () => (data?.incomingRequests ?? []).some((req) => req.id === userId),
    [data?.incomingRequests, userId]
  );

  const handleAddFriend = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await sendRequest(userId);
      toast.success('Friend request sent!');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to send request';
      toast.error(msg);
    }
  };

  if (isFriend) {
    return (
      <Button
        size="sm"
        variant="secondary"
        className="flex-1 gap-1.5 text-xs"
        disabled
      >
        <UserCheck className="w-3.5 h-3.5" />
        Friends
      </Button>
    );
  }

  if (isSent) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="flex-1 gap-1.5 text-xs"
        disabled
      >
        <Check className="w-3.5 h-3.5" />
        Request Sent
      </Button>
    );
  }

  if (hasIncoming) {
    const incoming = (data?.incomingRequests ?? []).find((req) => req.id === userId);
    return (
      <Button
        size="sm"
        variant="default"
        className="flex-1 gap-1.5 text-xs"
        onClick={() => incoming && acceptRequest(incoming.id)}
      >
        Accept Request
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant="default"
      className="flex-1 gap-1.5 text-xs"
      onClick={handleAddFriend}
      disabled={isSending}
    >
      {isSending ? (
        'Sending...'
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          Add Friend
        </>
      )}
    </Button>
  );
};
