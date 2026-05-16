import { and, eq, ne, or } from 'drizzle-orm';
import { db } from '../../database';
import { friendships } from '../../database/schema/friendships.schema';
import { users } from '../../database/schema/users.schema';
import { logAction } from '../logs/logs.service';

export const sendFriendRequest = async (userId: string, friendId: string) => {
  const start = Date.now();
  const result = await db
    .insert(friendships)
    .values({ userId, friendId })
    .returning();

  await logAction({
    userId,
    method: 'POST',
    path: '/friends/request',
    statusCode: 201,
    payload: { friendId },
    duration: Date.now() - start,
  });

  return result;
};

export const acceptFriendRequest = async (userId: string, friendId: string) => {
  const start = Date.now();
  const result = await db
    .update(friendships)
    .set({ status: 'accepted' })
    .where(
      and(eq(friendships.userId, friendId), eq(friendships.friendId, userId))
    )
    .returning();

  await logAction({
    userId,
    method: 'PATCH',
    path: '/friends/accept',
    statusCode: 200,
    payload: { fromUserId: friendId },
    duration: Date.now() - start,
  });

  return result;
};

export const getFriendSystemData = async (currentUserId: string) => {
  const friends = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      avatarUrl: users.avatarUrl,
      email: users.email,
    })
    .from(friendships)
    .innerJoin(
      users,
      or(eq(users.id, friendships.userId), eq(users.id, friendships.friendId))
    )
    .where(
      and(
        eq(friendships.status, 'accepted'),
        or(
          eq(friendships.userId, currentUserId),
          eq(friendships.friendId, currentUserId)
        ),
        ne(users.id, currentUserId)
      )
    );

  const incomingRequests = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      avatarUrl: users.avatarUrl,
      requestId: friendships.id,
      createdAt: friendships.createdAt,
    })
    .from(friendships)
    .innerJoin(users, eq(users.id, friendships.userId))
    .where(
      and(
        eq(friendships.friendId, currentUserId),
        eq(friendships.status, 'pending')
      )
    );

  const outgoingRequests = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      avatarUrl: users.avatarUrl,
    })
    .from(friendships)
    .innerJoin(users, eq(users.id, friendships.friendId))
    .where(
      and(
        eq(friendships.userId, currentUserId),
        eq(friendships.status, 'pending')
      )
    );

  return { friends, incomingRequests, outgoingRequests };
};

export const deleteFromFriends = async (userId: string, friendId: string) => {
  const start = Date.now();
  await db
    .delete(friendships)
    .where(
      or(
        and(eq(friendships.userId, userId), eq(friendships.friendId, friendId)),
        and(eq(friendships.userId, friendId), eq(friendships.friendId, userId))
      )
    );

  await logAction({
    userId,
    method: 'DELETE',
    path: '/friends',
    statusCode: 204,
    payload: { friendId },
    duration: Date.now() - start,
  });
};
