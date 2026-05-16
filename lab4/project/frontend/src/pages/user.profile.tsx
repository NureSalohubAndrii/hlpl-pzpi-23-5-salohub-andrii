import { useNavigate, useRouter } from '@tanstack/react-router';
import { type FC } from 'react';
import { ArrowLeft, Mail, ShieldCheck, ShieldOff, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import ProfileSkeleton from '../components/users/profile-skeleton.component';
import { AddFriendButton } from '../components/friends/add-friend-button.component';
import { useUserProfileQuery } from '../queries/users.queries';

interface UserProfilePageProps {
  userId: string;
}

const UserProfilePage: FC<UserProfilePageProps> = ({ userId }) => {
  const navigate = useNavigate();
  const { history } = useRouter();

  const { data: user, isLoading, isError } = useUserProfileQuery(userId);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 text-muted-foreground w-full">
        <User className="w-12 h-12 opacity-30" />
        <p className="text-lg font-medium">User not found</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/' })}
        >
          Go back
        </Button>
      </div>
    );
  }

  return (
    <section className="w-full max-w-lg mx-auto mt-10 px-4">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 gap-2 text-muted-foreground"
        onClick={() => history.go(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="h-28 bg-linear-to-br from-primary/20 to-primary/5" />

        <div className="px-6 pb-6">
          <div className="-mt-12 mb-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-card"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted ring-4 ring-card flex items-center justify-center">
                <User className="w-9 h-9 text-muted-foreground" />
              </div>
            )}
          </div>

          <h1 className="text-xl font-semibold">{user.fullName}</h1>

          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 shrink-0" />
              <span>{user.email}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              {user.isEmailVerified ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-green-600 dark:text-green-400">
                    Email verified
                  </span>
                </>
              ) : (
                <>
                  <ShieldOff className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    Email not verified
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="h-px bg-border my-5" />

          <div className="flex gap-2">
            <Button
              className="w-1/2 gap-2"
              onClick={() => navigate({ to: `/chat/${user.id}` })}
            >
              Message
            </Button>

            <AddFriendButton userId={user.id} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfilePage;
