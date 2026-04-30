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

export const register = async ({
  email,
  password,
  fullName,
}: RegisterUserDto) => {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser) {
    if (existingUser.isEmailVerified) {
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

  return { userId: user.id };
};

export const verifyEmail = async (email: string, code: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
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
    throw new AppError('Invalid or expired verification code', 400);
  }

  await db
    .update(users)
    .set({
      isEmailVerified: true,
    })
    .where(eq(users.id, user.id));
  await db.delete(verificationCode).where(eq(verificationCode.userId, user.id));

  const accessToken = generateAccessToken(user.id, user.email);
  const refreshToken = generateRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
    },
  };
};

export const login = async (email: string, password: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new AppError(
      'No matches for users, please check your email or login',
      401
    );
  }
  if (!user.isEmailVerified) {
    throw new AppError('Please verify your email', 403);
  }

  const match = await comparePassword(password, user.password ?? '');
  if (!match) {
    throw new AppError(
      'No matches for users, please check your email or login',
      401
    );
  }

  const accessToken = generateAccessToken(user.id, email);
  const refreshToken = generateRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
    },
  };
};

export const refreshToken = async (refreshToken: string) => {
  const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

  if (!decoded || typeof decoded === 'string') {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const { userId } = decoded as { userId: string };
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const newAccessToken = generateAccessToken(userId, user.email);
  const newRefreshToken = generateRefreshToken(userId);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
