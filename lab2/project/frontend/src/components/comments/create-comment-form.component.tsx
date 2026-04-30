import { useState, type FC } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { useCreateComment } from '../../hooks/useCreateComment';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import type { Comment } from '../../types/comments.types';

interface CreateCommentFormProps {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}

const CreateCommentForm: FC<CreateCommentFormProps> = ({
  postId,
  onCommentAdded,
}) => {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const { createComment, isSubmitting } = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    const result = await createComment({
      content,
      postId,
      authorId: user.id,
    });

    if (result.success && result.comment) {
      setContent('');
      onCommentAdded(result.comment);
    }
  };

  if (!user)
    return <p className="text-sm text-muted-foreground">Log in to comment</p>;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 bg-muted rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 ring-primary"
      />
      <Button size="icon" disabled={isSubmitting || !content.trim()}>
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default CreateCommentForm;
