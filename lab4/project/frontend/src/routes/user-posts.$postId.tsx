import { createFileRoute } from '@tanstack/react-router';
import PostPage from '../pages/post.page';

export const Route = createFileRoute('/user-posts/$postId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { postId } = Route.useParams();
  return <PostPage postId={postId} />;
}
