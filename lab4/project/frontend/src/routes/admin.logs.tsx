import { createFileRoute, redirect } from '@tanstack/react-router';
import AdminLogsPage from '../pages/admin-logs.page';
import { useAuthStore } from '../stores/auth.store';

export const Route = createFileRoute('/admin/logs')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user;

    if (!user || !user.isAdmin) {
      throw redirect({ to: '/posts' });
    }
  },
  component: AdminLogsPage,
});
