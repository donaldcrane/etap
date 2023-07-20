import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  callbackUrl?: string;

  @ApiProperty()
  amount: number;
}
