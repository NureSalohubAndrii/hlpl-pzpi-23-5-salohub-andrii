import { createFileRoute } from '@tanstack/react-router';
import ChatPage from '../pages/chat.page';

export const Route = createFileRoute('/chat/$userId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();

  return <ChatPage userId={userId} />;
}
