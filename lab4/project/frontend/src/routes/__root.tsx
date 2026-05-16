import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Toaster } from '../components/ui/sonner';
import Header from '../components/shared/header.component';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/query-client';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header />
        <main className="flex justify-center px-6">
          <Outlet />
        </main>
        <Toaster />
      </QueryClientProvider>
    </>
  );
}
