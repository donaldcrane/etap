/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() body: LoginUserDto) {
    console.log('login');
    return await this.authService.login(body);
  }
}
