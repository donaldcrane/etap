import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferDto } from './dto/transfer.dto';
import { rate } from './constant/rate';
import { generateReference } from './utils/generateReference';

@Injectable()
export class WalletsService {
  private readonly _include: any;
  constructor(private prisma: PrismaService) {
    this._include = {
      id: true,
      userId: true,
      currency: true,
      balance: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  async create(userId: number, createWalletDto: CreateWalletDto) {
    if (!rate[createWalletDto.currency]) {
      throw new ConflictException('invalid currency selected');
    }
    const data = await this.prisma.wallets.create({
      data: {
        userId,
        ...createWalletDto,
      },
    });

    return { message: 'wallet created successfully', data };
  }

  async findAll(id: number) {
    const data = await this.prisma.wallets.findMany({
      where: {
        userId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    return { message: 'wallets fetched successfully', data };
  }

  async findOne(id: number) {
    const data = await this.prisma.wallets.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
          },
        },
      },
    });
    if (!data) {
      throw new NotFoundException('wallet does not');
    }

    return { message: 'wallet fetched successfully', data };
  }

  async transfer(data: TransferDto, userId: number) {
    if (!userId || data.amount <= 0) {
      throw new ConflictException('invalid amount');
    }
    const sendingWallet = await this.prisma.wallets.findUnique({
      where: {
        id: data.sendingWalletId,
        userId,
      },
    });
    const receivingWallet = await this.prisma.wallets.findUnique({
      where: {
        id: data.receivingWalletId,
      },
    });
    if (!sendingWallet ?? !receivingWallet) {
      throw new NotFoundException(`sorry one of the wallet doesn't exist`);
    }
    // get both rates  charges
    const sendingExchangeRate = rate[sendingWallet.currency];
    const receivingExchangeRate = rate[receivingWallet.currency];

    // get both rates in naira
    const sendingAmount =
      (data.amount * receivingExchangeRate) / sendingExchangeRate; // 40 pounds
    const receivingAmountInNaira = receivingExchangeRate * data.amount; // 40000naira

    if (sendingWallet.balance < sendingAmount) {
      throw new ConflictException('insufficient funds');
    }

    const confirmed = receivingAmountInNaira >= 1000000 ? false : true;
    const reference = generateReference();

    await this.prisma.wallets.update({
      where: {
        id: sendingWallet.id,
      },
      data: {
        balance: { decrement: sendingAmount },
      },
    });

    const balance = await this.prisma.wallets.update({
      where: {
        id: receivingWallet.id,
      },
      data: {
        balance: { increment: data.amount },
      },
    });

    const credit = await this.prisma.transactions.create({
      data: {
        amount: data.amount,
        currency: receivingWallet.currency,
        confirmed,
        reference,
        type: 'walletTransfer',
        user: {
          connect: { id: userId },
        },
        wallet: {
          connect: { id: receivingWallet.id },
        },
      },
    });

    await this.prisma.debits.create({
      data: {
        amount: sendingAmount,
        currency: sendingWallet.currency,
        confirmed,
        exchangeRate: sendingExchangeRate,
        reference,
        user: {
          connect: { id: userId },
        },
        wallet: {
          connect: { id: sendingWallet.id },
        },
        credit: { connect: { id: credit.id } },
      },
    });

    return {
      message: 'transfer initaited successfully',
      data: { balance, credit },
    };
  }
}
