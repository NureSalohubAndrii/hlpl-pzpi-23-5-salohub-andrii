import { and, asc, eq, or } from 'drizzle-orm';
import { db } from '../../database';
import { messages } from '../../database/schema/messages.schema';
import { users } from '../../database/schema/users.schema';
import { logAction } from '../logs/logs.service';

export const sendMessage = async (
  senderId: string,
  receiverId: string,
  content: string
) => {
  const start = Date.now();

  const [message] = await db
    .insert(messages)
    .values({
      senderId,
      content,
      receiverId,
    })
    .returning();

  await logAction({
    userId: senderId,
    method: 'POST',
    path: '/messages',
    statusCode: 201,
    payload: { receiverId },
    duration: Date.now() - start,
  });

  return message;
};

export const getConversation = async (userAId: string, userBId: string) => {
  const start = Date.now();

  const result = await db
    .select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      senderId: messages.senderId,
      receiverId: messages.receiverId,
      senderName: users.fullName,
    })
    .from(messages)
    .leftJoin(users, eq(users.id, messages.senderId))
    .where(
      or(
        and(eq(messages.senderId, userAId), eq(messages.receiverId, userBId)),
        and(eq(messages.senderId, userBId), eq(messages.receiverId, userAId))
      )
    )
    .orderBy(asc(messages.createdAt));

  await logAction({
    userId: userAId,
    method: 'GET',
    path: `/messages/conversation/${userBId}`,
    statusCode: 200,
    duration: Date.now() - start,
  });

  return result;
};
