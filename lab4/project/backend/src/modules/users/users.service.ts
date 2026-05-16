import { eq, ne } from 'drizzle-orm';
import { db } from '../../database';
import { users } from '../../database/schema/users.schema';
import { UpdateUserDto } from './types/users.type';
import { logAction } from '../logs/logs.service';

export const updateMe = async (userId: string, data: UpdateUserDto) => {
  const start = Date.now();

  const [updatedUser] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, userId))
    .returning();

  await logAction({
    userId,
    method: 'PATCH',
    path: '/users/me',
    statusCode: updatedUser ? 200 : 404,
    duration: Date.now() - start,
    payload: { fieldsUpdated: Object.keys(data) },
  });

  return updatedUser ?? null;
};

export const getAllUsers = async (excludeUserId: string) => {
  const start = Date.now();

  const result = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(ne(users.id, excludeUserId));

  await logAction({
    userId: excludeUserId,
    method: 'GET',
    path: '/users',
    statusCode: 200,
    duration: Date.now() - start,
  });

  return result;
};

export const getUserById = async (userId: string, requesterId?: string) => {
  const start = Date.now();

  const [currentUser] = await db
    .select({
      fullName: users.fullName,
      email: users.email,
      id: users.id,
      isEmailVerified: users.isEmailVerified,
      avatarUrl: users.avatarUrl,
      isAdmin: users.isAdmin,
    })
    .from(users)
    .where(eq(users.id, userId));

  await logAction({
    userId: requesterId,
    method: 'GET',
    path: `/users/${userId}`,
    statusCode: currentUser ? 200 : 404,
    duration: Date.now() - start,
  });

  return currentUser;
};
