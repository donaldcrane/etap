import { IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class CreatePaystackDto {
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @IsBoolean()
  @IsNotEmpty()
  readonly saveCard: boolean;
}
