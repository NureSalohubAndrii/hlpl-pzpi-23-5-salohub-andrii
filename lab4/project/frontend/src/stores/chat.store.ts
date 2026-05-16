import { create } from 'zustand';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  senderName?: string | null;
}

interface ChatState {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => {
    set((state) => ({
      messages: state.messages.find((m) => m.id === message.id)
        ? state.messages
        : [...state.messages, message],
    }));
  },
  clearMessages: () => set({ messages: [] }),
}));
