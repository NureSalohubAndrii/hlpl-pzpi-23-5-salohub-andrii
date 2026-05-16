import { useState, type FC } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { useCreateCommentMutation } from '../../queries/comments.queries';

interface CreateCommentFormProps {
  postId: string;
}

const CreateCommentForm: FC<CreateCommentFormProps> = ({ postId }) => {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const { mutateAsync: createComment, isPending } =
    useCreateCommentMutation(postId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    await createComment({ content, postId, authorId: user.id });
    setContent('');
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
      <Button size="icon" disabled={isPending || !content.trim()}>
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default CreateCommentForm;
