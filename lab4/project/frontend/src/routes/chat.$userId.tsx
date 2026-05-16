import { createFileRoute, redirect } from '@tanstack/react-router';
import ChatPage from '../pages/chat.page';
import { useAuthStore } from '../stores/auth.store';

export const Route = createFileRoute('/chat/$userId')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user;

    if (!user) {
      throw redirect({
        to: '/',
      });
    }
  },

  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();

  return <ChatPage userId={userId} />;
}
