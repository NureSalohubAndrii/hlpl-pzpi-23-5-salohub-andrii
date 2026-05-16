import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { useState, type FC } from 'react';
import { useAuthStore } from '../stores/auth.store';
import DeletePostDialog from '../components/posts/delete-post-dialog.component';
import EditPostDialog from '../components/posts/edit-post-dialog.component';
import CreateCommentForm from '../components/comments/create-comment-form.component';
import CommentsList from '../components/comments/comments-list.component';
import PostPageSkeleton from '../components/posts/post-page-skeleton.component';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  ImageOff,
  Mail,
  Pencil,
  Trash2,
  User,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { usePostQuery } from '../queries/posts.queries';
import { useCommentsQuery } from '../queries/comments.queries';

interface PostPageProps {
  postId: string;
}

const PostPage: FC<PostPageProps> = ({ postId }) => {
  const { history } = useRouter();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
  } = usePostQuery(postId);

  const { data: comments = [], isLoading: isCommentsLoading } =
    useCommentsQuery(postId);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isOwner = user?.id === post?.author.id;

  if (isPostLoading) {
    return <PostPageSkeleton />;
  }

  if (isPostError || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 text-muted-foreground">
        <ImageOff className="w-12 h-12 opacity-30" />
        <p className="text-lg font-medium">Post not found</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/posts' })}
        >
          Back to posts
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto mt-8 px-4 pb-16 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => history.go(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <article className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="h-72 w-full bg-muted">
            {post.imageUrl ? (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
                <ImageOff className="w-12 h-12" />
                <span className="text-sm">No image</span>
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold leading-snug">{post.title}</h1>
              {isOwner && (
                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8"
                    onClick={() => setEditOpen(true)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {post.description && (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {post.description}
              </p>
            )}

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between flex-wrap gap-3">
              <Link
                to="/profile/$userId"
                params={{ userId: post.author.id }}
                className="flex items-center gap-3 group/author"
              >
                {post.author.avatarUrl ? (
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.fullName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-border group-hover/author:ring-primary/40 transition-all"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center ring-2 ring-border group-hover/author:ring-primary/40 transition-all">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium group-hover/author:text-primary transition-colors">
                    {post.author.fullName}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {post.author.email}
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover/author:opacity-100 transition-opacity" />
              </Link>

              <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <span className="opacity-40 font-mono text-[10px]">
                  ID: {post.id.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>
        </article>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-8">
          <CreateCommentForm postId={postId} />
          <div className="h-px bg-border" />
          <CommentsList
            comments={comments}
            isLoading={isCommentsLoading}
            postId={postId}
          />
        </div>
      </div>

      <EditPostDialog
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        post={post}
      />
      <DeletePostDialog
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        post={post}
        onSuccess={() => navigate({ to: '/posts' })}
      />
    </>
  );
};

export default PostPage;
