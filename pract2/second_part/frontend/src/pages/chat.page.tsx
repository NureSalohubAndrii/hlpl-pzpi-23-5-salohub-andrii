import { useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';
import { useUsersStore } from '../stores/users.store';
import { useChat } from '../hooks/useChat';
import { useSocket } from '../hooks/useSocket';
import { ArrowLeft, User } from 'lucide-react';
import ChatWindow from '../components/chat-window.component';
import MessageInput from '../components/message-input.component';

interface ChatPageProps {
  userId: string;
}

const ChatPage: FC<ChatPageProps> = ({ userId }) => {
  const navigate = useNavigate();
  const { users } = useUsersStore();
  const { isLoading } = useChat(userId);
  const { sendMessage } = useSocket();

  const receiver = users?.find((user) => user.id === userId);

  const handleSend = (content: string) => {
    sendMessage(userId, content);
  };

  return (
    <section className="flex flex-col h-screen">
      <div className="flex items-center gap-3 p-3 border-b">
        <button
          onClick={() => navigate({ to: '/' })}
          className="p-1 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        {receiver?.avatarUrl ? (
          <img
            src={receiver.avatarUrl}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <User size={18} />
          </div>
        )}
        <div>
          <p className="font-semibold text-sm leading-tight">
            {receiver?.fullName ?? '...'}
          </p>
          <p className="text-xs text-muted-foreground">
            {receiver?.email ?? ''}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm min-w-2xl">
          Loading...
        </div>
      ) : (
        <ChatWindow />
      )}

      <MessageInput onSend={handleSend} />
    </section>
  );
};

export default ChatPage;
