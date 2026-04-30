import { UserPlus, Check, UserCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { useFriendship } from '../../hooks/useFriendship';
import { useMemo } from 'react';
import type {
  Friend,
  IncomingFriendRequest,
  OutcomingFriendRequest,
} from '../../types/friends.types';

interface AddFriendButtonProps {
  userId: string;
  friends: Friend[];
  outgoingRequests: OutcomingFriendRequest[];
  incomingRequests: IncomingFriendRequest[];
  onAccept: (id: string) => void;
  onRefresh?: () => void;
}

export const AddFriendButton = ({
  userId,
  friends,
  outgoingRequests,
  incomingRequests,
  onRefresh,
  onAccept,
}: AddFriendButtonProps) => {
  const { sendRequest, isLoading } = useFriendship();

  const isFriend = useMemo(
    () => friends.some((friend) => friend.id === userId),
    [friends, userId]
  );
  const isSent = useMemo(
    () => outgoingRequests.some((friendRequest) => friendRequest.id === userId),
    [outgoingRequests, userId]
  );
  const hasIncoming = useMemo(
    () => incomingRequests.some((friendRequest) => friendRequest.id === userId),
    [incomingRequests, userId]
  );

  const handleAddFriend = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFriend || isSent || hasIncoming) {
      return;
    }

    const success = await sendRequest(userId);

    if (success && onRefresh) {
      onRefresh();
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
    return (
      <Button
        size="sm"
        variant="default"
        className="flex-1 gap-1.5 text-xs"
        onClick={() =>
          onAccept(
            incomingRequests.filter(
              (incomingRequest) => incomingRequest.id === userId
            )[0].id
          )
        }
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
      disabled={isLoading}
    >
      {isLoading ? (
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
