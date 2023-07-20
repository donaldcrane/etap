import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { LocalStrategy } from 'src/auth/local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtService, AuthService, LocalStrategy],
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), PrismaModule],
  exports: [PassportModule],
})
export class UsersModule {}
