import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/userRoutes';
// import offerRoutes from './routes/offerRoutes';
// import loanRoutes from './routes/loanRoutes';
// import paymentRoutes from './routes/paymentRoutes';
// import verifyToken from './middleware/auth';

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).prisma = prisma;
  next();
});

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Service is running' });
});

app.use('/api', userRoutes);
// app.use('/api', verifyToken, offerRoutes);
// app.use('/api', verifyToken, loanRoutes);
// app.use('/api', verifyToken, paymentRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;