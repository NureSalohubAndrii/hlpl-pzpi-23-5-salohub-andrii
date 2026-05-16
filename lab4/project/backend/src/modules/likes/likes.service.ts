import { eq, count, desc, and } from 'drizzle-orm';
import { db } from '../../database';
import { likes } from '../../database/schema/likes.schema';
import { logAction } from '../logs/logs.service';

export const createLike = async (postId: string, userId: string) => {
  const start = Date.now();

  const existingLike = await db
    .select()
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));

  if (existingLike.length > 0) {
    throw new Error('User already liked this post');
  }

  const [newLike] = await db
    .insert(likes)
    .values({
      postId,
      userId,
    })
    .returning();

  await logAction({
    userId,
    method: 'POST',
    path: `/likes`,
    statusCode: 201,
    payload: { likeId: newLike.id, postId },
    duration: Date.now() - start,
  });

  return newLike;
};

export const deleteLike = async (postId: string, userId: string) => {
  const start = Date.now();

  const [deletedLike] = await db
    .delete(likes)
    .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
    .returning();

  if (!deletedLike) {
    throw new Error('Like not found');
  }

  await logAction({
    userId,
    method: 'DELETE',
    path: `/likes`,
    statusCode: 200,
    payload: { postId },
    duration: Date.now() - start,
  });

  return deletedLike;
};

export const getUserLikes = async (userId: string) => {
  const start = Date.now();

  const userLikes = await db
    .select({
      id: likes.id,
      postId: likes.postId,
      createdAt: likes.createdAt,
    })
    .from(likes)
    .where(eq(likes.userId, userId))
    .orderBy(desc(likes.createdAt));

  await logAction({
    userId,
    method: 'GET',
    path: `/likes`,
    statusCode: 200,
    duration: Date.now() - start,
  });

  return userLikes;
};

export const getPostLikes = async (postId: string) => {
  const start = Date.now();

  const postLikes = await db
    .select({
      id: likes.id,
      userId: likes.userId,
      createdAt: likes.createdAt,
    })
    .from(likes)
    .where(eq(likes.postId, postId))
    .orderBy(desc(likes.createdAt));

  await logAction({
    method: 'GET',
    path: `/likes/${postId}`,
    statusCode: 200,
    duration: Date.now() - start,
  });

  return postLikes;
};

export const getPostLikeCount = async (postId: string) => {
  const start = Date.now();

  const [{ count: likeCount }] = await db
    .select({ count: count() })
    .from(likes)
    .where(eq(likes.postId, postId));

  await logAction({
    method: 'GET',
    path: `/likes/${postId}/count`,
    statusCode: 200,
    duration: Date.now() - start,
  });

  return likeCount;
};

export const getUserLikedPosts = async (userId: string) => {
  const start = Date.now();

  const likedPosts = await db
    .select({
      postId: likes.postId,
      createdAt: likes.createdAt,
    })
    .from(likes)
    .where(eq(likes.userId, userId))
    .orderBy(desc(likes.createdAt));

  await logAction({
    userId,
    method: 'GET',
    path: `/liked-posts`,
    statusCode: 200,
    duration: Date.now() - start,
  });

  return likedPosts;
};

