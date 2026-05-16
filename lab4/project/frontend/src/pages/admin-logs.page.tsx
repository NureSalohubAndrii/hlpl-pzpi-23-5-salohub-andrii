import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../stores/auth.store';
import { useAdminLogsQuery } from '../queries/logs.queries';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, RefreshCw, ShieldOff } from 'lucide-react';
import { Button } from '../components/ui/button';

const METHOD_COLORS: Record<string, string> = {
  GET: 'text-blue-500',
  POST: 'text-green-500',
  PATCH: 'text-yellow-500',
  PUT: 'text-yellow-500',
  DELETE: 'text-red-500',
};

const statusColor = (code: number | null) => {
  if (!code) return 'text-muted-foreground';
  if (code < 300) return 'text-green-500';
  if (code < 400) return 'text-blue-500';
  if (code < 500) return 'text-yellow-500';
  return 'text-red-500';
};

const PAGE_SIZE = 50;

const AdminLogsPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data: logs, isLoading, isFetching, refetch } = useAdminLogsQuery(page, PAGE_SIZE);

  if (!user?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 text-muted-foreground">
        <ShieldOff className="w-12 h-12 opacity-30" />
        <p className="text-lg font-medium">Access denied</p>
        <Button variant="outline" size="sm" onClick={() => navigate({ to: '/posts' })}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto mt-8 px-4 pb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Request Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Auto-refreshes every 3 s
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Time</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Method</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Path</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Duration</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : !logs?.length ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    No logs yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(log.createdAt), 'MMM d, HH:mm:ss')}
                    </td>
                    <td className={`px-4 py-3 font-mono font-semibold whitespace-nowrap ${METHOD_COLORS[log.method] ?? ''}`}>
                      {log.method}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs max-w-xs truncate">
                      {log.path}
                    </td>
                    <td className={`px-4 py-3 font-mono font-semibold ${statusColor(log.statusCode)}`}>
                      {log.statusCode ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {log.duration != null ? `${log.duration} ms` : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground truncate max-w-[160px]">
                      {log.user ? (
                        <span title={log.user.email}>
                          {log.user.fullName ?? log.user.email}
                        </span>
                      ) : (
                        <span className="italic">anonymous</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => setPage((p) => p + 1)}
          disabled={!logs?.length || logs.length < PAGE_SIZE}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
};

export default AdminLogsPage;
