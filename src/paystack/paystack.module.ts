import { Module } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { PaystackController } from './paystack.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { LocalStrategy } from 'src/auth/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [PaystackController],
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), PrismaModule],

  providers: [
    PaystackService,
    JwtService,
    UsersService,
    AuthService,
    LocalStrategy,
  ],
})
export class PaystackModule {}
