import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from '@prisma/client';
import { ROLE } from 'src/auth/role.enum';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) {}

  async findAllCredits(date: Date, user: Users) {
    if (user.role !== ROLE.ADMIN) {
      throw new UnauthorizedException();
    }
    const data = await this.prisma.transactions.findMany({
      where: {
        createdAt: date ? { gte: date } : undefined,
      },
      include: { user: true },
    });
    return { message: 'credits fetched successfully', data };
  }

  async findAllDebits(date: Date, user: Users) {
    if (user.role !== ROLE.ADMIN) {
      throw new UnauthorizedException();
    }
    const data = await this.prisma.debits.findMany({
      where: {
        createdAt: date ? { gte: date } : undefined,
      },
    });
    return { message: 'debits fetched successfully', data };
  }
}
