import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionsService {
  private readonly _include: any;
  constructor(private prisma: PrismaService) {}

  async findAllCredits(userId: number) {
    const data = await this.prisma.transactions.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        wallet: true,
        debit: true,
        card: true,
      },
    });

    return { message: 'credits fetched successfully', data };
  }

  async findAllDebits(userId: number) {
    const data = await this.prisma.debits.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        wallet: true,
        credit: true,
      },
    });

    return { message: 'Debits fetched successfully', data };
  }

  async findOneCredit(id: number, userId: number) {
    const data = await this.prisma.transactions.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        user: true,
        wallet: true,
        debit: true,
        card: true,
      },
    });
    if (!data) {
      throw new NotFoundException('transaction does not');
    }

    return { message: 'credit fetched successfully', data };
  }

  async findOneDebit(id: number, userId: number) {
    const data = await this.prisma.debits.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        user: true,
        wallet: true,
        credit: true,
      },
    });
    if (!data) {
      throw new NotFoundException('transaction does not');
    }

    return { message: 'debit fetched successfully', data };
  }
}
