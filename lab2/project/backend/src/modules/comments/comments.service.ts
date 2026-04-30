import { eq } from 'drizzle-orm';
import { db } from '../../database';
import { comments } from '../../database/schema/comments.schema';
import { type Comment } from './types/comments.types';
import { users } from '../../database/schema/users.schema';

export const createComment = async (data: Comment) => {
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
  data: Partial<Comment>
) => {
  const [updatedComment] = await db
    .update(comments)
    .set({ ...data })
    .where(eq(comments.id, commentId))
    .returning();

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

export const deleteComment = async (commentId: string) => {
  await db.delete(comments).where(eq(comments.id, commentId));
};
