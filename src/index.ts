import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/userRoutes';
import offerRoutes from './routes/offerRoutes';
// import loanRoutes from './routes/loanRoutes';
// import paymentRoutes from './routes/paymentRoutes';

import { testCalculateOffer } from './services/calculateOffer';

export const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).prisma = prisma;
  next();
});

// Health check endpoint
app.get('/', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'ok', 
      message: 'Service is running', 
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Service is running, but database connection failed', 
      error: error
    });
  }
});

app.use('/api', userRoutes);
app.use('/api', offerRoutes);
// app.use('/api', verifyToken, loanRoutes);
// app.use('/api', verifyToken, paymentRoutes);

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);

  try {
    await prisma.$queryRaw`SELECT 1`;
    testCalculateOffer();
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed');
    process.exit(1);
  }
});

export default app;