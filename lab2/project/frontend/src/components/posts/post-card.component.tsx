import { useState, type FC } from 'react';
import type { Post } from '../../types/posts.types';
import { Calendar, ImageOff, User, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../stores/auth.store';
import { formatDistanceToNow } from 'date-fns';
import EditPostDialog from './edit-post-dialog.component';
import DeletePostDialog from './delete-post-dialog.component';
import { useNavigate } from '@tanstack/react-router';

interface PostCardProps {
  post: Post;
}

const PostCard: FC<PostCardProps> = ({ post }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isOwner = user?.id === post.author.id;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <li
        className="group flex flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30 cursor-pointer"
        onClick={() => navigate({ to: `/user-posts/${post.id}` })}
      >
        <div className="h-48 w-full overflow-hidden bg-muted">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
              <ImageOff className="w-10 h-10" />
              <span className="text-xs">No image</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 p-4 flex-1">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-sm leading-snug line-clamp-2">
              {post.title}
            </h3>
            {post.description && (
              <p className="text-xs text-muted-foreground line-clamp-3">
                {post.description}
              </p>
            )}
          </div>

          <div className="h-px bg-border mt-auto" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {post.author.avatarUrl ? (
                <img
                  src={post.author.avatarUrl}
                  alt={post.author.fullName}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-border"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center ring-1 ring-border">
                  <User className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
              <span className="text-xs text-muted-foreground truncate max-w-30">
                {post.author.fullName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Calendar className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {isOwner && (
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6"
                    onClick={() => setEditOpen(true)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6 text-destructive hover:text-destructive"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </li>

      <EditPostDialog
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        post={post}
      />

      <DeletePostDialog
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        post={post}
      />
    </>
  );
};

export default PostCard;
