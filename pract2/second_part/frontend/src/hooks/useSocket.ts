import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { useChatStore, type Message } from '../stores/chat.store';
import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export const useSocket = () => {
  const { token } = useAuthStore();
  const { addMessage } = useChatStore();
  const listenersAttached = useRef(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    if (!socketInstance) {
      socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
        auth: { token },
      });
    }

    if (!listenersAttached.current) {
      socketInstance.on('new_message', (message: Message) => {
        addMessage(message);
      });

      listenersAttached.current = true;
    }

    return () => {};
  }, [token]);

  const sendMessage = (receiverId: string, content: string) => {
    socketInstance?.emit('send_message', { receiverId, content });
  };

  return { sendMessage };
};
