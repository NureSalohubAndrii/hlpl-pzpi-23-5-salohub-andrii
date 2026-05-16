import bcypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password: string): Promise<string> => {
  return bcypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcypt.compare(password, hashedPassword);
};

export const generateVerificationCode = (): string => {
  const randomNumber = crypto.randomInt(1000, 10000);
  return randomNumber.toString();
};

export const generateAccessToken = (
  userId: string,
  email: string,
  isAdmin = false
): string => {
  return jwt.sign(
    { userId, email, isAdmin },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '2h' }
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

export const generateToken = () => {};
