import { Offer } from '@prisma/client';
import { prisma } from '../index';

export interface CreateOfferData {
  amount: number;
  interestRate: number;
  termInDays: number;
  installments: number;
  installmentAmount: number;
  totalAmount: number;
  paymentFrequencyId: string;
  status: string;
  loanId?: string;
}

export class OfferModel {
  static async create(userId: string, data: CreateOfferData): Promise<Offer> {
    return prisma.offer.create({
      data: {
        userId,
        amount: data.amount,
        interestRate: data.interestRate,
        termInDays: data.termInDays,
        installments: data.installments,
        installmentAmount: data.installmentAmount,
        totalAmount: data.totalAmount,
        paymentFrequencyId: data.paymentFrequencyId,
        status: data.status,
        loanId: data.loanId,
      },
    });
  }

  static async findByUserId(userId: string): Promise<Offer[]> {
    return prisma.offer.findMany({
      where: { userId },
      include: {
        paymentFrequency: true,
      },
    });
  }

  static async findById(id: string): Promise<Offer | null> {
    return prisma.offer.findUnique({
      where: { id },
      include: {
        paymentFrequency: true,
      },
    });
  }

  static async update(id: string, data: Partial<CreateOfferData>): Promise<Offer> {
    return prisma.offer.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string): Promise<Offer> {
    return prisma.offer.delete({
      where: { id },
    });
  }
}