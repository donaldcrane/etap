import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard())
  @Get('credits')
  findAllCredits(@Req() req: any) {
    return this.transactionsService.findAllCredits(req.user.id);
  }

  @UseGuards(AuthGuard())
  @Get('credits/:id')
  findOneCredit(@Param('id') id: number, @Req() req: any) {
    return this.transactionsService.findOneCredit(+id, req.user.id);
  }

  @UseGuards(AuthGuard())
  @Get('debits')
  findAllDebits(@Req() req: any) {
    return this.transactionsService.findAllDebits(req.user.id);
  }

  @UseGuards(AuthGuard())
  @Get('debits/:id')
  findOneDebit(@Param('id') id: number, @Req() req: any) {
    return this.transactionsService.findOneDebit(+id, req.user.id);
  }
}
