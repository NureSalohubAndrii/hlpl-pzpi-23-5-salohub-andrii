import { eq, ne } from 'drizzle-orm';
import { db } from '../../database';
import { users } from '../../database/schema/users.schema';
import { UpdateUserDto } from './types/users.type';

export const updateMe = async (userId: string, data: UpdateUserDto) => {
  const [updatedUser] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, userId))
    .returning();

  return updatedUser ?? null;
};

export const getAllUsers = async (excludeUserId: string) => {
  return await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(ne(users.id, excludeUserId));
};

export const getUserById = async (userId: string) => {
  const [currentUser] = await db
    .select({
      fullName: users.fullName,
      email: users.email,
      id: users.id,
      isEmailVerified: users.isEmailVerified,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.id, userId));

  return currentUser;
};
