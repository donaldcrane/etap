import { IsNotEmpty, IsNumber } from 'class-validator';

export class TransferDto {
  @IsNotEmpty()
  @IsNumber()
  readonly sendingWalletId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly receivingWalletId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}
