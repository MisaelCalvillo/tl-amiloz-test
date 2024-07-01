import { Request, Response } from 'express';
import { prisma } from '../index';
import { User } from '@prisma/client';
import { LoanStatus, OfferStatus, PaymentStatus, Roles } from '../types';

export const loanController = {
  // Create a loan from an approved offer
  createLoan: async (req: Request, res: Response) => {
    const { offerId } = req.params;
    const { userId } = req.body; // Assuming the user ID is sent in the request body

    try {
      const offer = await prisma.offer.findUnique({
        where: { id: offerId },
        include: { paymentFrequency: true },
      });

      if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
      }

      if (offer.status !== 'APPROVED') {
        return res.status(400).json({ error: 'Offer is not approved' });
      }

      const loan = await prisma.$transaction(async (tx: any) => {
        const newLoan = await tx.loan.create({
          data: {
            userId,
            offerId: offer.id,
            totalAmount: offer.totalAmount,
            remainingAmount: offer.totalAmount,
            status: 'ACTIVE',
            approvedAt: new Date(),
          },
        });

        const installments = Array.from({ length: offer.installments }, (_, index) => {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + (index + 1) * offer.paymentFrequency.days);
          
          return tx.installment.create({
            data: {
              loanId: newLoan.id,
              amount: offer.installmentAmount,
              dueDate,
              status: 'PENDING',
            },
          });
        });

        await Promise.all(installments);

        await tx.offer.update({
          where: { id: offer.id },
          data: { status: 'CONVERTED' },
        });

        return newLoan;
      });

      res.status(201).json(loan);
    } catch (error) {
      console.error('Error creating loan:', error);
      res.status(500).json({ error: 'An error occurred while creating the loan' });
    }
  },

  // Get loan details
  getLoan: async (req: Request, res: Response) => {
    const { loanId } = req.params;
    const { user } = req as Request & { user: User };

    try {
      const loan = await prisma.loan.findUnique({
        where: { id: loanId },
        include: {
          offer: true,
          installments: {
            include: {
              payments: true,
            },
          },
        },
      });

      if (!loan) {
        return res.status(404).json({ error: 'Loan not found' });
      }

      // Check if the user is the owner of the loan or an admin
      if (loan.userId !== user.id || user.roleId !== Roles.ADMIN) {
          res.status(403).json({ error: 'You do not have permission to view this loan' });
          return;
      }

      res.json(loan);
    } catch (error) {
      console.error('Error fetching loan:', error);
      res.status(500).json({ error: 'An error occurred while fetching the loan' });
    }
  },

  // Update loan status
  updateLoanStatus: async (req: Request, res: Response) => {
    const { loanId } = req.params;
    const { status } = req.body;

    try {
      const updatedLoan = await prisma.loan.update({
        where: { id: loanId },
        data: { status },
      });

      res.json(updatedLoan);
    } catch (error) {
      console.error('Error updating loan status:', error);
      res.status(500).json({ error: 'An error occurred while updating the loan status' });
    }
  },

  // Get all loans (with pagination)
  getAllLoans: async (req: Request, res: Response) => {
    const { page = '1', limit = '10' } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    try {
      const loans = await prisma.loan.findMany({
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          offer: true,
        },
      });

      const totalLoans = await prisma.loan.count();

      res.json({
        loans,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalLoans / limitNumber),
        totalLoans,
      });
    } catch (error) {
      console.error('Error fetching loans:', error);
      res.status(500).json({ error: 'An error occurred while fetching loans' });
    }
  },

  approveLoan: async (req: Request, res: Response) => {
    const { offerId } = req.params;

    //TODO: Move this to a offer model
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { paymentFrequency: true },
    });

    if (!offer || offer.status !== OfferStatus.PENDING) {
      throw new Error('Invalid or already processed offer');
    }

    return prisma.$transaction(async (prisma) => {
      const loan = await prisma.loan.create({
        data: {
          userId: offer.userId,
          offerId: offer.id,
          totalAmount: offer.totalAmount,
          remainingAmount: offer.totalAmount,
          status: LoanStatus.ACTIVE,
          approvedAt: new Date(),
        },
      });
  
      const installments = Array.from({ length: offer.installments }, (_, index) => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (index + 1) * offer.paymentFrequency.days);
        
        return prisma.installment.create({
          data: {
            loanId: loan.id,
            amount: offer.installmentAmount,
            dueDate,
            status: PaymentStatus.PENDING,
          },
        });
      });
  
      await Promise.all(installments);
  
      await prisma.offer.update({
        where: { id: offer.id },
        data: { status: OfferStatus.APPROVED },
      });
  
      return loan;
    });
  }
};

export default loanController;