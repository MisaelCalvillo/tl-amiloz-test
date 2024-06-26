import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if ((req as any).userRole !== 'admin') {
    return res.status(403).json({ message: 'Access forbidden: Admins only.' });
  }
  next();
};