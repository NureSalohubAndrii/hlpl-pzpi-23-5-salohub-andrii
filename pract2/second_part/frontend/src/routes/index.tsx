import { createFileRoute } from '@tanstack/react-router';
import { useAuthStore } from '../stores/auth.store';
import SignUpPage from '../pages/sign-up.page';
import HomePage from '../pages/home.page';
import { useTokenInit } from '../hooks/useTokenInit';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const { isReady } = useTokenInit();

  if (!isReady) {
    return null;
  }

  if (!user) {
    return <SignUpPage />;
  }

  return <HomePage />;
}
