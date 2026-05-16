import { useState, type FC } from 'react';
import { User, MessageSquare, Pencil, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Comment } from '../../types/comments.types';
import DeleteCommentDialog from './delete-comment-dialog.component';
import { useAuthStore } from '../../stores/auth.store';
import { useUpdateCommentMutation } from '../../queries/comments.queries';
import { Button } from '../ui/button';
import { Link } from '@tanstack/react-router';

interface CommentsListProps {
  comments: Comment[];
  isLoading: boolean;
  postId: string;
}

const CommentsList: FC<CommentsListProps> = ({ comments, isLoading, postId }) => {
  const { user } = useAuthStore();
  const { mutateAsync: updateComment, isPending: isUpdating } =
    useUpdateCommentMutation(postId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const handleStartEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editContent.trim()) return;
    await updateComment({ commentId: id, data: { content: editContent } });
    handleCancelEdit();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <MessageSquare className="w-4 h-4" />
        Comments ({comments.length})
      </div>

      <div className="space-y-6">
        {comments.map((comment) => {
          const isAuthor = user?.id === comment.author.id;
          const isEditing = editingId === comment.id;

          return (
            <div key={comment.id} className="flex gap-4 group">
              <Link
                to="/profile/$userId"
                params={{ userId: comment.author.id }}
                className="shrink-0"
              >
                {comment.author.avatarUrl ? (
                  <img
                    src={comment.author.avatarUrl}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-border"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center ring-1 ring-border">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </Link>

              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Link
                      to="/profile/$userId"
                      params={{ userId: comment.author.id }}
                      className="text-sm font-semibold hover:text-primary transition-colors truncate"
                    >
                      {comment.author.fullName}
                    </Link>
                    <span className="text-[11px] text-muted-foreground">
                      {format(new Date(comment.createdAt), 'MMM d, HH:mm')}
                    </span>
                  </div>

                  {isAuthor && !isEditing && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => handleStartEdit(comment)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-destructive hover:bg-destructive/10"
                        onClick={() => setCommentToDelete(comment.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    <textarea
                      className="w-full min-h-20 p-3 text-sm bg-background border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(comment.id)}
                        disabled={isUpdating || !editContent.trim()}
                      >
                        {isUpdating && (
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        )}
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm bg-muted/30 p-3 rounded-2xl rounded-tl-none border border-transparent whitespace-pre-wrap">
                    {comment.content}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DeleteCommentDialog
        commentId={commentToDelete ?? ''}
        postId={postId}
        open={!!commentToDelete}
        onOpenChange={(open) => !open && setCommentToDelete(null)}
      />
    </div>
  );
};

export default CommentsList;
