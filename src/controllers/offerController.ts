import { Request, Response } from 'express';
import { OfferModel, CreateOfferData } from '../models/offer';
import { calculateOffer } from '../services/calculateOffer';

// TODO: Learn how to use the Request and Response types from Express
export const createOffer = async (req: any, res: Response): Promise<void> => {
  const { user } = req;
  const { 
    amount, 
    interestRate, 
    termInDays, 
    paymentFrequencyId, 
    status,
    loanId 
  } = req.body;

  try {
    // Input validation
    if (!amount || !interestRate || !termInDays || !paymentFrequencyId || !status) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (typeof amount !== 'number' || typeof interestRate !== 'number' || 
        typeof termInDays !== 'number' || typeof paymentFrequencyId !== 'string' || 
        typeof status !== 'string') {
      res.status(400).json({ error: 'Invalid input types' });
      return;
    }

    if (amount <= 0 || interestRate < 0 || termInDays <= 0) {
      res.status(400).json({ error: 'Invalid input values' });
      return;
    }

    // Calculate offer details
    const calculatedOffer = await calculateOffer({
      principalAmount: amount,
      annualInterestRate: interestRate,
      termInDays,
      paymentFrequencyId,
    });

    // Prepare data for creating the offer
    const offerData: CreateOfferData = {
      amount,
      interestRate,
      termInDays,
      installments: calculatedOffer.numberOfPayments,
      installmentAmount: calculatedOffer.paymentAmount,
      totalAmount: calculatedOffer.totalRepayment,
      paymentFrequencyId,
      status,
      loanId,
    };

    // Create the offer
    const offer = await OfferModel.create(user.id, offerData);
    res.status(201).json(offer);
  } catch (error) {
    console.error('Error in createOffer:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred while creating the offer' });
    }
  }
}

export const getOffersByUserId = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const offers = await OfferModel.findByUserId(userId);
    res.status(200).json(offers);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching offers', details: err });
  }
};

export const calculateOfferController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, interestRate, termInDays, paymentFrequencyId } = req.body;

    // Input validation
    if (!amount || !interestRate || !termInDays || !paymentFrequencyId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (
      typeof amount !== 'number' || 
      typeof interestRate !== 'number' || 
      typeof termInDays !== 'number' || 
      typeof paymentFrequencyId !== 'string') {
      res.status(400).json({ error: 'Invalid input types' });
      return;
    }

    if (amount <= 0 || interestRate < 0 || termInDays <= 0) {
      res.status(400).json({ error: 'Invalid input values' });
      return;
    }

    const offer = await calculateOffer({ 
      principalAmount: amount,
      annualInterestRate: interestRate,
      termInDays,
      paymentFrequencyId,
    });

    res.status(200).json(offer);
  } catch (error) {
    console.error('Error in calculateOfferController:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};