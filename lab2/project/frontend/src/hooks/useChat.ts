import { useEffect, useState } from 'react';
import { useChatStore, type Message } from '../stores/chat.store';
import { ApiError, apiRequest } from '../api/client';

export const useChat = (receiverId: string) => {
  const { setMessages, clearMessages } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!receiverId) {
      return;
    }

    const fetchChatHistory = async () => {
      setIsLoading(true);
      clearMessages();

      try {
        const response = await apiRequest<{ messages: Message[] }>(
          `/messages/${receiverId}`,
          { method: 'GET' }
        );
        setMessages(response.messages);
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : 'Failed to load messages';
        console.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [receiverId]);

  return { isLoading };
};
