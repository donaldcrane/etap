import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @UseGuards(AuthGuard())
  @Get('credits')
  findAllCredits(@Query('date') date: Date, @Req() req: any) {
    return this.adminsService.findAllCredits(date, req.user);
  }

  @UseGuards(AuthGuard())
  @Get('debits')
  findAllDebits(@Query('date') date: Date, @Req() req: any) {
    return this.adminsService.findAllDebits(date, req.user);
  }
}
