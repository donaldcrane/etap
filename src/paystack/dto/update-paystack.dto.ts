import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePaystackDto } from './create-paystack.dto';

export class UpdatePaystackDto extends PartialType(CreatePaystackDto) {
  @ApiProperty()
  reference: string;

  @ApiProperty()
  authorization: PaystackAuthorizationData;

  @ApiProperty()
  amount: number;
}

export interface PaystackAuthorizationData {
  authorization_code: string;
  card_type: string;
  exp_month: string;
  exp_year: string;
  last4: string;
  reusable: boolean;
}
export interface CreateCardData {
  cardType: string;
  authorizationCode: string;
  last4: string;
  expirationYear: string;
  expirationMonth: string;
  userId: number;
}

export interface PaystackWebhookRequest {
  event: PaystackWebhookEnum;
  data: PaystackWebhookRequestData;
}

export interface PaystackWebhookRequestData {
  status: PaystackTransactionStatus;
  reference: string;
  gateway_response: string;
  amount: number;
  authorization: PaystackAuthorizationData;
}

export enum PaystackWebhookEnum {
  CHARGE_SUCCESS = 'charge.success',
}

export enum PaystackTransactionStatus {
  SUCCESS = 'success',
}
