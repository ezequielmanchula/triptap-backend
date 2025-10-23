import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
// Intentar usar bcrypt nativo; si falla (bindings faltantes) usar bcryptjs como fallback para desarrollo
let bcrypt: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  bcrypt = require('bcrypt');
} catch (e) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  bcrypt = require('bcryptjs');
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: CreateUserDto) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({ data: { ...data, password: hashed } });
    // Do not return password
    const { password, ...safe } = user as any;
    return safe;
  }

  async login(data: LoginUserDto) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email }, select: { id: true, email: true, password: true } as any });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      throw new Error('Invalid credentials');
    }
    const { password, ...safe } = user as any;
    return safe;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
 
  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map(({ password, ...rest }) => rest);
  }
 
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const { password, ...rest } = user as any;
    return rest;
  }
 
}
