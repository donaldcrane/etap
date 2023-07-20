import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(phone: string, pass: string): Promise<any> {
    const user: any = await this.userService.findOneByPhone(phone);
    if (user && (await UsersService.comparePassword(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(data: any) {
    const user: any = await this.userService.findOneByPhone(data.phone);
    if (!user) {
      throw new NotFoundException('Email does not exist.');
    }

    const isMatch = await UsersService.comparePassword(
      data.password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password.');
    }
    const payload = { phone: user.phone, id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { message: 'user logged in successfully', data: { user, token } };
  }
}
