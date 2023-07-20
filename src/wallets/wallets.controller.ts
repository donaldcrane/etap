import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TransferDto } from './dto/transfer.dto';

@ApiTags('wallets')
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @UseGuards(AuthGuard())
  @Post()
  create(@Body() createWalletDto: CreateWalletDto, @Req() req: any) {
    return this.walletsService.create(req.user.id, createWalletDto);
  }

  @UseGuards(AuthGuard())
  @Get()
  findAll(@Req() req: any) {
    return this.walletsService.findAll(req.user.id);
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.walletsService.findOne(+id);
  }

  @UseGuards(AuthGuard())
  @Post('transfer')
  transfer(@Body() data: TransferDto, @Req() req: any) {
    return this.walletsService.transfer(data, req.user.id);
  }
}
