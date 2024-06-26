// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export const createOffers = async (req: Request, res: Response): Promise<void> => {
//   const { userId } = req.params;
//   const { offers } = req.body; // Expecting an array of offers

//   try {
//     const createdOffers = await prisma.offer.createMany({
//       data: offers.map((offer: any) => ({
//         userId: parseInt(userId, 10),
//         amount: offer.amount,
//         term: offer.term,
//       })),
//     });

//     res.status(201).json({ createdOffers });
//   } catch (err) {
//     res.status(500).json({ error: 'Error creating offers.', details: err.message });
//   }
// };