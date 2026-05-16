import { Link, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../../stores/auth.store';
import { Button } from '../ui/button';
import { LogOut, User } from 'lucide-react';

const Header = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate({
      to: '/',
    });
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex gap-4 items-center">
        <Link to="/posts">Posts</Link>
        <Link to="/users">Users</Link>
        {user?.isAdmin && (
          <Link
            to="/admin/logs"
            className="flex items-center gap-1 text-primary font-medium"
          >
            Logs
          </Link>
        )}
      </div>
      {user ? (
        <div className="flex gap-2">
          <Link to="/me">
            <Button className="flex gap-2" size="icon" variant="outline">
              <User />
            </Button>
          </Link>
          <Button className="flex gap-2" onClick={handleLogout}>
            <LogOut />
            <p>Log out</p>
          </Button>
        </div>
      ) : (
        <div>
          <Button>
            <Link to="/sign-in">Sign In</Link>
          </Button>
          <Button>
            <Link to="/sign-in">Sign Up</Link>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
