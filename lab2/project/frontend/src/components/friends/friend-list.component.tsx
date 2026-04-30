import { Trash2, User } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useState, type FC } from 'react';
import { Button } from '../ui/button';
import DeleteFriendDialog from './delete-friend-dialog.component';
import { DeleteFriendType, type Friend } from '../../types/friends.types';

interface FriendListProps {
  friends: Friend[];
  onRefresh: () => void;
}

export const FriendList: FC<FriendListProps> = ({ friends, onRefresh }) => {
  const [selectedFriend, setSelectedFriend] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFriend({ id, name });
    setIsDialogOpen(true);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {friends.map((friend) => (
        <div key={friend.id} className="relative group">
          <Link
            to="/profile/$userId"
            params={{ userId: friend.id }}
            className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {friend.avatarUrl ? (
                <img
                  src={friend.avatarUrl}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium text-sm truncate">
                  {friend.fullName}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {friend.email}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleDeleteClick(e, friend.id, friend.fullName)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      ))}

      {selectedFriend && (
        <DeleteFriendDialog
          friendId={selectedFriend.id}
          friendName={selectedFriend.name}
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onSuccess={onRefresh}
          type={DeleteFriendType.FRIEND}
        />
      )}
    </div>
  );
};
