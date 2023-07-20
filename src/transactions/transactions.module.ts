import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LocalStrategy } from '../auth/local.strategy';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    UsersService,
    JwtService,
    AuthService,
    LocalStrategy,
  ],
  imports: [PrismaModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  exports: [PassportModule],
})
export class TransactionsModule {}
