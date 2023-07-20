import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { CreatePaystackDto } from './dto/create-paystack.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  PaystackWebhookEnum,
  PaystackWebhookRequest,
} from './dto/update-paystack.dto';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

@Controller('paystack')
export class PaystackController {
  constructor(
    private readonly paystackService: PaystackService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard())
  @Post('initialize')
  initializeTransaction(
    @Body() createPaystackDto: CreatePaystackDto,
    @Req() req: any,
  ) {
    return this.paystackService.initialize(createPaystackDto, req.user);
  }

  @Post('verify')
  @HttpCode(200)
  verify(@Body() updatePaystackDto: PaystackWebhookRequest, @Req() req: any) {
    const secret = this.configService.get<string>('PAYSTACK_SECRET_KEY') ?? '';

    const hash = createHmac('sha512', secret)
      .update(JSON.stringify(updatePaystackDto))
      .digest('hex');
    if (hash !== req.headers['x-paystack-signature'])
      throw new UnauthorizedException('unauthorized');

    const { event, data } = updatePaystackDto;

    switch (event) {
      case PaystackWebhookEnum.CHARGE_SUCCESS:
        return this.paystackService.verify(data);
      default:
        throw new BadRequestException('unknown event Error');
    }
  }
}
