import { prisma } from '../index';

interface OfferInput {
  principalAmount: number;
  annualInterestRate: number;
  termInDays: number;
  paymentFrequencyId: string;
}

interface CalculatedOffer extends OfferInput {
  numberOfPayments: number;
  paymentAmount: number;
  totalInterest: number;
  totalRepayment: number;
}

export async function calculateOffer(input: OfferInput): Promise<CalculatedOffer> {
  const { principalAmount, annualInterestRate, termInDays, paymentFrequencyId } = input;

  if (principalAmount <= 0 || termInDays <= 0) {
    throw new Error("Principal amount, and term must be positive numbers.");
  }

  const paymentFrequency = await prisma.paymentFrequency.findUnique({
    where: { id: paymentFrequencyId },
  });

  if (!paymentFrequency) {
    throw new Error(`Invalid payment frequency: ${paymentFrequencyId}`);
  }

  // Calculate number of payments
  const numberOfPayments = Math.max(1, Math.ceil(termInDays / paymentFrequency.days));

  // Calculate periodic interest rate
  const periodsPerYear = 365 / paymentFrequency.days;
  const periodicInterestRate = annualInterestRate / periodsPerYear;

  // Handle edge case of 0% interest rate
  if (periodicInterestRate === 0) {
    const paymentAmount = principalAmount / numberOfPayments;
    return {
      principalAmount,
      annualInterestRate,
      termInDays,
      paymentFrequencyId,
      numberOfPayments,
      paymentAmount: Number(paymentAmount.toFixed(2)),
      totalInterest: 0,
      totalRepayment: principalAmount,
    };
  }

  // Calculate payment amount using the loan payment formula
  const paymentAmount = 
    (principalAmount * periodicInterestRate * Math.pow(1 + periodicInterestRate, numberOfPayments)) /
    (Math.pow(1 + periodicInterestRate, numberOfPayments) - 1);

  // Calculate total repayment and total interest
  const totalRepayment = paymentAmount * numberOfPayments;
  const totalInterest = totalRepayment - principalAmount;

  return {
    principalAmount,
    annualInterestRate,
    termInDays,
    paymentFrequencyId,
    numberOfPayments,
    paymentAmount: Number(paymentAmount.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalRepayment: Number(totalRepayment.toFixed(2)),
  };
}

export async function testCalculateOffer() {
  try {
    const offer = await calculateOffer({
      principalAmount: 10000,
      annualInterestRate: 0.05, // 5% annual interest rate
      termInDays: 365, // 1 year
      paymentFrequencyId: 'monthly',
    });

    console.log('Calculated Offer:', offer);

    // Test with 0% interest rate
    const zeroInterestOffer = await calculateOffer({
      principalAmount: 10000,
      annualInterestRate: 0,
      termInDays: 365,
      paymentFrequencyId: 'monthly',
    });

    console.log('Zero Interest Offer:', zeroInterestOffer);

    // Test with very short term
    const shortTermOffer = await calculateOffer({
      principalAmount: 10000,
      annualInterestRate: 0.05,
      termInDays: 1,
      paymentFrequencyId: 'monthly',
    });

    console.log('Short Term Offer:', shortTermOffer);

  } catch (error) {
    console.error('Error calculating offer:', error);
  }
}