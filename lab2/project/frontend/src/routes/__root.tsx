import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Toaster } from '../components/ui/sonner';
import Header from '../components/shared/header.component';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Header />
      <main className="flex justify-center px-6">
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}
