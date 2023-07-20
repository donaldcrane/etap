import { IsNotEmpty, IsString } from 'class-validator';
import { enum_Wallet_Currency } from '@prisma/client';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  readonly currency: enum_Wallet_Currency;
}
