import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const { user } = req as Request & { user: User };
  if (user?.roleId !== 'admin') {
    res.status(403).json({ message: 'Access forbidden: Admins only.' });
  } else { 
    next();
  }
};