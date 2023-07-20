import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { enum_Users_role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  readonly lastName: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly role: enum_Users_role;

  @IsEmail({}, { message: 'Please input correct email' })
  @IsNotEmpty()
  @MaxLength(250)
  readonly email: string;

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
