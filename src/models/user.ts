import { User } from '@prisma/client';
import { prisma } from '../index';

export class UserModel {
  static async create( data: User ): Promise<User> {
    return prisma.user.create({
      data
    });
  }

  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }
}