import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaystackDto } from './dto/create-paystack.dto';
import { CreateCardData, UpdatePaystackDto } from './dto/update-paystack.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Users,
  enum_Transactions_status,
  enum_Transactions_type,
  enum_Wallet_Currency,
} from '@prisma/client';
import axios from 'axios';
import { TransactionDto } from './dto/transaction.dto';
import { ConfigService } from '@nestjs/config';
import { generateReference } from 'src/wallets/utils/generateReference';

@Injectable()
export class PaystackService {
  private readonly _include: any;
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  initTransaction = async (
    reference: string,
    id: number,
    data: TransactionDto,
  ) => {
    const { email, amount, callbackUrl } = data;
    const res = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100,
        reference,
        callback_url:
          callbackUrl ??
          `${this.configService.get<string>('CALLBACK_URL')}&id=${id}`,
      },
      {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>(
            'PAYSTACK_SECRET_KEY',
          )}`,
          'Accept-Encoding': 'identity',
        },
      },
    );

    if (!res.data.status) return { error: 'initializeTransactionError' };
    const { authorization_url: paymentUrl, access_code: accessCode } =
      res.data.data;
    return { paymentUrl, accessCode };
  };

  async initialize(createPaystackDto: CreatePaystackDto, user: Users) {
    if (!user) return { error: 'user does not exist' };
    const { amount, saveCard } = createPaystackDto;

    if (amount < 0 || isNaN(amount)) {
      throw new ConflictException('invalid amount');
    }
    const wallet = await this.prisma.wallets.findFirst({
      where: {
        userId: user.id,
        currency: enum_Wallet_Currency.naira,
      },
    });
    // Initialize transaction

    const reference = generateReference();
    const transaction = await this.prisma.transactions.create({
      data: {
        type: enum_Transactions_type.fundAccount,
        amount,
        currency: wallet.currency,
        userId: user.id,
        reference,
        saveCard,
        walletId: wallet.id,
      },
    });

    if (!transaction) {
      return new NotFoundException('error creating transaction');
    }
    const data = {
      email: user.email,
      amount: amount,
    };

    const paystackTransaction = await this.initTransaction(
      reference,
      transaction.id,
      data,
    );

    if (!paystackTransaction) return { error: 'paystack error' };

    return {
      message: 'transaction initiated successfully',
      data: paystackTransaction,
    };
  }

  async verify(updatePaystackDto: UpdatePaystackDto) {
    const { reference, amount, authorization, status } = updatePaystackDto;
    console.log(updatePaystackDto);
    const transaction = await this.prisma.transactions.findUnique({
      where: {
        reference,
      },
    });

    if (!transaction) {
      return new NotFoundException('transactionNotFoundError');
    }
    if (amount / 100 !== transaction.amount)
      return new ConflictException('transaction amount mismatch');

    if (status !== 'success') {
      await this.prisma.transactions.update({
        where: {
          reference,
        },
        data: {
          status: enum_Transactions_status.failed,
          confirmed: false,
        },
      });
      return new ConflictException('transaction was not successful');
    }
    const {
      last4,
      authorization_code: authorizationCode,
      card_type: cardType,
      exp_month: expirationMonth,
      exp_year: expirationYear,
    } = authorization;

    const cardData: CreateCardData = {
      cardType,
      authorizationCode,
      last4,
      expirationYear,
      expirationMonth,
      userId: transaction.userId,
    };

    await this.prisma.wallets.update({
      where: {
        id: transaction.walletId,
      },
      data: {
        balance: { increment: amount / 100 },
      },
    });
    const transactionData = await this.prisma.transactions.update({
      where: {
        reference,
      },
      data: {
        status: enum_Transactions_status.success,
        confirmed: true,
        card: {
          create: transaction.saveCard ? cardData : undefined,
        },
      },
    });

    return { transactionData };
  }
}
