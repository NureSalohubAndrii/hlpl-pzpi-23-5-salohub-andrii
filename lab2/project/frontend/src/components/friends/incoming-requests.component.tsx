import { Check, User, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useState, type FC } from 'react';
import DeleteFriendDialog from './delete-friend-dialog.component';
import { DeleteFriendType, type Friend } from '../../types/friends.types';

interface IncomingRequestsProps {
  requests: Friend[];
  onAccept: (id: string) => void;
  onRefresh: () => void;
}

export const IncomingRequests: FC<IncomingRequestsProps> = ({
  requests,
  onAccept,
  onRefresh,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeclineOpen, setIsDeclineOpen] = useState(false);

  const handleDeclineClick = (id: string, name: string) => {
    setSelectedRequest({ id, name });
    setIsDeclineOpen(true);
  };

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <div
          key={req.id}
          className="flex items-center justify-between p-3 border border-primary/20 bg-primary/5 rounded-xl"
        >
          <div className="flex items-center gap-3">
            {req.avatarUrl ? (
              <img
                src={req.avatarUrl}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <span className="font-medium text-sm">{req.fullName}</span>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onAccept(req.id)}
              title="Accept request"
            >
              <Check className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleDeclineClick(req.id, req.fullName)}
              title="Decline request"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}

      {selectedRequest && (
        <DeleteFriendDialog
          friendId={selectedRequest.id}
          friendName={selectedRequest.name}
          isOpen={isDeclineOpen}
          setIsOpen={setIsDeclineOpen}
          onSuccess={onRefresh}
          type={DeleteFriendType.REQUEST}
        />
      )}
    </div>
  );
};
