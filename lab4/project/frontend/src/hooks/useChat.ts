import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../stores/chat.store';
import { ApiError } from '../api/client';
import { getMessages } from '../api/messages.api';

export const useChat = (receiverId: string) => {
  const setMessages = useChatStore((s) => s.setMessages);
  const clearMessages = useChatStore((s) => s.clearMessages);
  const setMessagesRef = useRef(setMessages);
  const clearMessagesRef = useRef(clearMessages);
  setMessagesRef.current = setMessages;
  clearMessagesRef.current = clearMessages;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!receiverId) return;

    const fetchChatHistory = async () => {
      setIsLoading(true);
      clearMessagesRef.current();

      try {
        const messages = await getMessages(receiverId);
        setMessagesRef.current(messages);
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
