import { apiRequest } from './client';
import type { Message } from '../stores/chat.store';

export const getMessages = async (receiverId: string): Promise<Message[]> => {
  const response = await apiRequest<{ messages: Message[] }>(
    `/messages/${receiverId}`,
    { method: 'GET' }
  );
  return response.messages;
};
