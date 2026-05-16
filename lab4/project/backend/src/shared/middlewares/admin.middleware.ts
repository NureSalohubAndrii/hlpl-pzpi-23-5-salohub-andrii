import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.middleware';

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ message: 'Forbidden: admin access required' });
    return;
  }
  next();
};
