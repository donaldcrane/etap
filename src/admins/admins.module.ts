import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/auth/local.strategy';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AdminsController],
  providers: [
    AdminsService,
    UsersService,
    JwtService,
    AuthService,
    LocalStrategy,
  ],
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), PrismaModule],
  exports: [PassportModule],
})
export class AdminsModule {}
