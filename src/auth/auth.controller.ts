import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../user/users.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const user = await this.usersService.register(dto);
    return user;
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    try {
      const user = await this.usersService.login(dto as any);
      return this.authService.login(user);
    } catch (err) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }
}
