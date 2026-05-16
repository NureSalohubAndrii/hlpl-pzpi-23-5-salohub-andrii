import { eq, count } from 'drizzle-orm';
import { db } from '../../database';
import { posts } from '../../database/schema/posts.schema';
import { users } from '../../database/schema/users.schema';
import { likes } from '../../database/schema/likes.schema';
import { CreatePostDto } from './types/posts.types';
import { logAction } from '../logs/logs.service';

export const createPost = async (data: CreatePostDto) => {
  const start = Date.now();
  const [newPost] = await db.insert(posts).values(data).returning();

  await logAction({
    userId: data.authorId,
    method: 'POST',
    path: '/posts',
    statusCode: 201,
    payload: { postId: newPost.id },
    duration: Date.now() - start,
  });

  return await getPostById(newPost.id);
};

export const getAllPosts = async () => {
  return await db
    .select({
      id: posts.id,
      title: posts.title,
      description: posts.description,
      imageUrl: posts.imageUrl,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      author: {
        id: users.id,
        avatarUrl: users.avatarUrl,
        fullName: users.fullName,
        email: users.email,
      },
      likeCount: count(likes.id).mapWith(Number),
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .leftJoin(likes, eq(posts.id, likes.postId))
    .groupBy(posts.id, users.id);
};

export const updatePost = async (
  postId: string,
  data: Partial<CreatePostDto>,
  userId: string
) => {
  const start = Date.now();
  await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, postId));

  await logAction({
    userId,
    method: 'PATCH',
    path: `/posts/${postId}`,
    statusCode: 200,
    duration: Date.now() - start,
  });

  return await getPostById(postId);
};

export const deletePost = async (postId: string, userId: string) => {
  const start = Date.now();
  await db.delete(posts).where(eq(posts.id, postId));

  await logAction({
    userId,
    method: 'DELETE',
    path: `/posts/${postId}`,
    statusCode: 204,
    duration: Date.now() - start,
  });
};

export const getPostById = async (postId: string) => {
  const start = Date.now();
  const [post] = await db
    .select({
      id: posts.id,
      title: posts.title,
      description: posts.description,
      imageUrl: posts.imageUrl,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      author: {
        id: users.id,
        avatarUrl: users.avatarUrl,
        fullName: users.fullName,
        email: users.email,
      },
      likeCount: count(likes.id).mapWith(Number),
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .leftJoin(likes, eq(posts.id, likes.postId))
    .where(eq(posts.id, postId))
    .groupBy(posts.id, users.id);

  if (post) {
    await logAction({
      method: 'GET',
      path: `/posts/${postId}`,
      statusCode: 200,
      duration: Date.now() - start,
    });
  }

  return post ?? null;
};
