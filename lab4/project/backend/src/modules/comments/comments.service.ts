import { eq } from 'drizzle-orm';
import { db } from '../../database';
import { comments } from '../../database/schema/comments.schema';
import { type Comment } from './types/comments.types';
import { users } from '../../database/schema/users.schema';
import { logAction } from '../logs/logs.service';

export const createComment = async (data: Comment) => {
  const start = Date.now();
  const [newComment] = await db.insert(comments).values(data).returning();

  const result = await db
    .select({
      id: comments.id,
      content: comments.content,
      postId: comments.postId,
      createdAt: comments.createdAt,
      author: {
        id: users.id,
        avatarUrl: users.avatarUrl,
        fullName: users.fullName,
        email: users.email,
      },
    })
    .from(comments)
    .leftJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.id, newComment.id));

  await logAction({
    userId: data.authorId,
    method: 'POST',
    path: '/comments',
    statusCode: 201,
    duration: Date.now() - start,
    payload: { postId: data.postId },
  });

  return result[0];
};

export const getAllComments = async (postId: string) => {
  return await db
    .select({
      id: comments.id,
      content: comments.content,
      postId: comments.postId,
      createdAt: comments.createdAt,
      author: {
        id: users.id,
        avatarUrl: users.avatarUrl,
        fullName: users.fullName,
        email: users.email,
      },
    })
    .from(comments)
    .where(eq(comments.postId, postId))
    .leftJoin(users, eq(comments.authorId, users.id));
};

export const updateComment = async (
  commentId: string,
  data: Partial<Comment>,
  userId: string
) => {
  const start = Date.now();
  const [updatedComment] = await db
    .update(comments)
    .set({ ...data })
    .where(eq(comments.id, commentId))
    .returning();

  await logAction({
    userId,
    method: 'PATCH',
    path: `/comments/${commentId}`,
    statusCode: 200,
    duration: Date.now() - start,
  });

  const result = await db
    .select({
      id: comments.id,
      content: comments.content,
      postId: comments.postId,
      createdAt: comments.createdAt,
      author: {
        id: users.id,
        avatarUrl: users.avatarUrl,
        fullName: users.fullName,
        email: users.email,
      },
    })
    .from(comments)
    .leftJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.id, updatedComment.id));

  return result[0];
};

export const deleteComment = async (commentId: string, userId: string) => {
  const start = Date.now();
  await db.delete(comments).where(eq(comments.id, commentId));
  await logAction({
    userId,
    method: 'DELETE',
    path: `/comments/${commentId}`,
    statusCode: 204,
    duration: Date.now() - start,
  });
};
