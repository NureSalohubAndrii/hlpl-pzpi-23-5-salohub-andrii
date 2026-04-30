import { createFileRoute, useNavigate } from '@tanstack/react-router';
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
  const navigate = useNavigate();

  if (!isReady) {
    return null;
  }

  if (!user) {
    return <SignUpPage />;
  } else {
    navigate({ href: '/me' });
  }

  return <HomePage />;
}
