import { useMemo, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { User, MessageCircle, ExternalLink, Search } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useDebounce } from '../../hooks/useDebounce';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AddFriendButton } from '../friends/add-friend-button.component';
import { useUsersQuery } from '../../queries/users.queries';

const UsersList = () => {
  const { data: users } = useUsersQuery();
  const { user: currentUser } = useAuthStore();
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!debouncedSearch.trim()) return users;

    const searchTerm = debouncedSearch.toLowerCase();
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
  }, [users, debouncedSearch]);

  return (
    <section className="w-full mt-8">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-semibold tracking-tight">Community</h2>
          <span className="text-sm text-muted-foreground">
            {filteredUsers.length} users
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-muted/20"
          />
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className="group flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
          >
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() =>
                navigate({
                  to: `/profile/$userId`,
                  params: { userId: user.id },
                })
              }
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-border group-hover:ring-primary/40 transition-all"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center ring-2 ring-border group-hover:ring-primary/40 transition-all">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5 text-xs"
                onClick={() => navigate({ to: `/chat/${user.id}` })}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Chat
              </Button>

              {currentUser?.id !== user.id && (
                <AddFriendButton userId={user.id} />
              )}

              <Button
                size="sm"
                variant="ghost"
                className="w-9 h-9 p-0 shrink-0"
                asChild
              >
                <Link to="/profile/$userId" params={{ userId: user.id }}>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {filteredUsers.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p>No users found matching your search.</p>
        </div>
      )}
    </section>
  );
};

export default UsersList;
