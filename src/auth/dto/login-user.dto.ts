import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @IsString()
  @MinLength(11, { message: 'phone number must be greater than 11 characters' })
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  readonly password: string;
}
