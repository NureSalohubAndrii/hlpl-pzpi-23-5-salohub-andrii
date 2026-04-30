import { eq } from 'drizzle-orm';
import { db } from '../../database';
import { posts } from '../../database/schema/posts.schema';
import { users } from '../../database/schema/users.schema';
import { CreatePostDto } from './types/posts.types';

export const createPost = async (data: CreatePostDto) => {
  const [newPost] = await db.insert(posts).values(data).returning();

  return await getPostById(newPost.id);
};

export const getAllPosts = async () => {
  const result = await db
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
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id));

  return result;
};

export const updatePost = async (
  postId: string,
  data: Partial<CreatePostDto>
) => {
  await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, postId));

  return await getPostById(postId);
};

export const deletePost = async (postId: string) => {
  await db.delete(posts).where(eq(posts.id, postId));
};

export const getPostById = async (postId: string) => {
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
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.id, postId));
  return post ?? null;
};
