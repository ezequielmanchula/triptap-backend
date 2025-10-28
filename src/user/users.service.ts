import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

// Intentar usar bcrypt nativo; si falla usar bcryptjs
let bcrypt: any;
try {
  bcrypt = require('bcrypt');
} catch (e) {
  bcrypt = require('bcryptjs');
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService, // inyectamos JWT
  ) {}

  async register(data: CreateUserDto) {
    const hashed = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: { ...data, password: hashed },
    });

    const { password, ...safe } = user as any;

    // Generar token al registrarse
    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return { ...safe, token };
  }

  async login(data: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, email: true, password: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...safe } = user as any;

    // Generar token al loguearse
    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return { ...safe, token };
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
