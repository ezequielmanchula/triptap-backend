import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  async login(data: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user || user.password !== data.password) {
      throw new Error('Invalid credentials');
    }
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
