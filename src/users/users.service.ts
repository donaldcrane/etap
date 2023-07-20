import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly _include: any;
  constructor(private prisma: PrismaService) {
    this._include = {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    };
  }
  static async generateHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  static async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...data } = createUserDto;

    const userExist = await this.prisma.users.findFirst({
      where: { OR: [{ phone: data.phone }, { email: data.email }] },
    });
    if (userExist) {
      throw new ConflictException('email or phone number already exist.');
    }

    const hashedPassword = await UsersService.generateHash(password);

    await this.prisma.users.create({
      data: {
        password: hashedPassword,
        ...data,
        wallet: {
          create: {
            currency: 'naira',
          },
        },
      },
    });
    return { message: 'user created successfully', data: null };
  }

  async findAll() {
    const data = await this.prisma.users.findMany({
      where: { role: { not: 'admin' } },
    });
    return { message: 'users fetched successfully', data };
  }

  async findOne(id: number) {
    const data = this.prisma.users.findUnique({ where: { id } });
    return data;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const data = this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });
    return { message: 'profile updated successfully', data };
  }

  async findOneByPhone(phone: string) {
    const data = this.prisma.users.findUnique({
      where: {
        phone,
      },
      select: {
        ...this._include,
        password: true,
      },
    });
    return data;
  }
}
