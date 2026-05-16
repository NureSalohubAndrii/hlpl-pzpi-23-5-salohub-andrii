import { and, eq, gte } from 'drizzle-orm';
import { db } from '../../database';
import { users } from '../../database/schema/users.schema';
import { RegisterUserDto } from '../../shared/types/auth.types';
import { AppError } from '../../shared/utils/app-error.util';
import { verificationCode } from '../../database/schema/verification-code.schema';
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  generateVerificationCode,
  hashPassword,
  verifyToken,
} from '../../shared/utils/auth.util';
import { sendVerificationEmail } from '../email/email.service';
import { logAction } from '../logs/logs.service';

export const register = async ({
  email,
  password,
  fullName,
}: RegisterUserDto) => {
  const start = Date.now();

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser) {
    if (existingUser.isEmailVerified) {
      await logAction({
        method: 'POST',
        path: '/auth/register',
        statusCode: 409,
        payload: { email },
        duration: Date.now() - start,
        error: 'User already exists',
      });
      throw new AppError('User already exists', 409);
    }

    await db
      .delete(verificationCode)
      .where(eq(verificationCode.userId, existingUser.id));
    await db.delete(users).where(eq(users.id, existingUser.id));
  }

  const hashedPassword = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      fullName,
      email,
      password: hashedPassword,
    })
    .returning();

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

  await db.insert(verificationCode).values({
    userId: user.id,
    code,
    expiresAt,
  });

  await sendVerificationEmail(email, code);

  await logAction({
    userId: user.id,
    method: 'POST',
    path: '/auth/register',
    statusCode: 201,
    duration: Date.now() - start,
  });

  return { userId: user.id };
};

export const verifyEmail = async (email: string, code: string) => {
  const start = Date.now();
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    await logAction({
      method: 'POST',
      path: '/auth/verify-email',
      statusCode: 404,
      payload: { email },
      duration: Date.now() - start,
      error: 'User not found',
    });
    throw new AppError('User not found', 404);
  }

  const [codeResult] = await db
    .select({
      userId: verificationCode.userId,
      expiresAt: verificationCode.expiresAt,
    })
    .from(verificationCode)
    .where(
      and(
        eq(verificationCode.userId, user.id),
        eq(verificationCode.code, code),
        gte(verificationCode.expiresAt, new Date())
      )
    );

  if (!codeResult) {
    await logAction({
      userId: user.id,
      method: 'POST',
      path: '/auth/verify-email',
      statusCode: 400,
      duration: Date.now() - start,
      error: 'Invalid or expired code',
    });
    throw new AppError('Invalid or expired verification code', 400);
  }

  await db
    .update(users)
    .set({ isEmailVerified: true })
    .where(eq(users.id, user.id));

  await db.delete(verificationCode).where(eq(verificationCode.userId, user.id));

  const accessToken = generateAccessToken(user.id, user.email, user.isAdmin);
  const refreshToken = generateRefreshToken(user.id);

  await logAction({
    userId: user.id,
    method: 'POST',
    path: '/auth/verify-email',
    statusCode: 200,
    duration: Date.now() - start,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      isAdmin: user.isAdmin,
    },
  };
};

export const login = async (email: string, password: string) => {
  const start = Date.now();
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    await logAction({
      method: 'POST',
      path: '/auth/login',
      statusCode: 401,
      payload: { email },
      duration: Date.now() - start,
      error: 'User not found',
    });
    throw new AppError(
      'No matches for users, please check your email or login',
      401
    );
  }

  if (!user.isEmailVerified) {
    await logAction({
      userId: user.id,
      method: 'POST',
      path: '/auth/login',
      statusCode: 403,
      duration: Date.now() - start,
      error: 'Email not verified',
    });
    throw new AppError('Please verify your email', 403);
  }

  const match = await comparePassword(password, user.password ?? '');
  if (!match) {
    await logAction({
      userId: user.id,
      method: 'POST',
      path: '/auth/login',
      statusCode: 401,
      duration: Date.now() - start,
      error: 'Invalid password',
    });
    throw new AppError(
      'No matches for users, please check your email or login',
      401
    );
  }

  const accessToken = generateAccessToken(user.id, email, user.isAdmin);
  const refreshToken = generateRefreshToken(user.id);

  await logAction({
    userId: user.id,
    method: 'POST',
    path: '/auth/login',
    statusCode: 200,
    duration: Date.now() - start,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      isAdmin: user.isAdmin,
    },
  };
};

export const refreshToken = async (token: string) => {
  const start = Date.now();
  const decoded = verifyToken(token, process.env.REFRESH_TOKEN_SECRET!);

  if (!decoded || typeof decoded === 'string') {
    await logAction({
      method: 'POST',
      path: '/auth/refresh-token',
      statusCode: 401,
      duration: Date.now() - start,
      error: 'Invalid refresh token',
    });
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const { userId } = decoded as { userId: string };
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const newAccessToken = generateAccessToken(userId, user.email, user.isAdmin);
  const newRefreshToken = generateRefreshToken(userId);

  await logAction({
    userId,
    method: 'POST',
    path: '/auth/refresh-token',
    statusCode: 200,
    duration: Date.now() - start,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
