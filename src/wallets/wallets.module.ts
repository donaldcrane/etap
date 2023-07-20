import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LocalStrategy } from '../auth/local.strategy';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [WalletsController],
  providers: [
    WalletsService,
    UsersService,
    JwtService,
    AuthService,
    LocalStrategy,
  ],
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), PrismaModule],
  exports: [PassportModule],
})
export class WalletsModule {}
