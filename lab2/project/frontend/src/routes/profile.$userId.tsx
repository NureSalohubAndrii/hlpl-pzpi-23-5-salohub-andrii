import { createFileRoute } from '@tanstack/react-router';
import UserProfilePage from '../pages/user.profile';

export const Route = createFileRoute('/profile/$userId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();

  return <UserProfilePage userId={userId} />;
}
