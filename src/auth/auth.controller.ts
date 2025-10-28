import { Controller, Post, Body, ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../user/users.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('User already exists');
    }

    // Creamos el usuario en DB
    const user = await this.usersService.register(dto);

    // Generamos token con AuthService
    return this.authService.login(user);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    const user = await this.usersService.login(dto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }
}
