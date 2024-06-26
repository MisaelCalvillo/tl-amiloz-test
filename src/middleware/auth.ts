import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

function isJwtPayload(object: any): object is JwtPayload {
    return object && typeof object === 'object' && 'id' in object;
}

function verifyToken(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> {
  const token = req.headers['x-access-token'] as string;
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, 'supersecret', (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    if (isJwtPayload(decoded)) {
        (req as any).userId = decoded?.id;
        (req as any).userRole = decoded?.role;
    }
    next();
  });

  return res;
}

export default verifyToken;