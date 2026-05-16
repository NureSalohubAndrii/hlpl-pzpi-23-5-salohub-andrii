import { useQuery } from '@tanstack/react-query';
import { getLogs } from '../api/logs.api';
import { QueryKey } from '../constants/query-keys';
import { useAuthStore } from '../stores/auth.store';

export const useAdminLogsQuery = (page = 1, limit = 50) => {
  const { user } = useAuthStore();
  const offset = (page - 1) * limit;

  return useQuery({
    queryKey: [QueryKey.ADMIN_LOGS, page, limit],
    queryFn: () => getLogs(limit, offset),
    enabled: !!user?.isAdmin,
    refetchInterval: 3000,
  });
};
