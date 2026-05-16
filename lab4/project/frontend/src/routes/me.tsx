import { createFileRoute, redirect } from '@tanstack/react-router';
import MyProfile from '../pages/my-profile.page';
import { useAuthStore } from '../stores/auth.store';

export const Route = createFileRoute('/me')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user;

    if (!user) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: MyProfile,
});
