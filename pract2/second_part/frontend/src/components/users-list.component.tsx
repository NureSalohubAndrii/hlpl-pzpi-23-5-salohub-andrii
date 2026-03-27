import { useEffect } from 'react';
import { useGetUsers } from '../hooks/useGetUsers';
import { useUsersStore } from '../stores/users.store';
import { useNavigate } from '@tanstack/react-router';
import { User } from 'lucide-react';

const UsersList = () => {
  const { getAllUsers } = useGetUsers();
  const { users } = useUsersStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <section className="border-t mt-5">
      <h2 className="p-2 font-bold text-center">Users</h2>
      {users?.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer"
          onClick={() => navigate({ to: `/chat/${user.id}` })}
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} className="w-10 h-10 rounded-full" />
          ) : (
            <User width={50} height={50} />
          )}
          <div>
            <p className="font-medium">{user.fullName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default UsersList;
