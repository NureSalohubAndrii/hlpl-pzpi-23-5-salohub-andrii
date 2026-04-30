import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { useChatStore, type Message } from '../stores/chat.store';
import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export const useSocket = () => {
  const { token } = useAuthStore();
  const { addMessage } = useChatStore();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!token) {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
        isInitialized.current = false;
      }
      return;
    }

    if (socketInstance) {
      socketInstance.disconnect();
    }

    socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance?.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    const handleNewMessage = (message: Message) => {
      addMessage(message);
    };

    socketInstance.on('new_message', handleNewMessage);

    isInitialized.current = true;

    return () => {
      if (socketInstance) {
        socketInstance.off('new_message', handleNewMessage);
      }
    };
  }, [token, addMessage]);

  const sendMessage = (receiverId: string, content: string) => {
    if (!socketInstance) {
      console.warn('Socket not connected');
      return;
    }

    socketInstance.emit('send_message', {
      receiverId,
      content,
    });
  };

  return { sendMessage };
};
