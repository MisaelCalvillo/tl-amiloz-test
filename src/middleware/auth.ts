import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: any;  // You might want to replace 'any' with a more specific user type
}

function isJwtPayload(object: any): object is JwtPayload {
  return object && typeof object === 'object' && 'id' in object;
}

async function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const token = req.headers['x-access-token'] as string;
  if (!token) {
    res.status(403).send({ auth: false, message: 'No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, 'supersecret') as JwtPayload;

    if (!isJwtPayload(decoded)) {
      res.status(401).send({ auth: false, message: 'Invalid token payload.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(404).send({ auth: false, message: 'User not found.' });
      return;
    }

    // Add user to request object
    req.user = user;
    console.log('User authenticated:', user);
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
    } else {
      console.error('Error in verifyToken:', error);
      res.status(500).send({ auth: false, message: 'Internal server error.' });
    }
  } finally {
    await prisma.$disconnect();
  }
}

export default verifyToken;