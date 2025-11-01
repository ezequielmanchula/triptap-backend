import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserProfileDto } from './dto/user-profile.dto';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Patch } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'Login exitoso con token JWT' })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({ status: 200, description: 'Lista de usuarios (sin passwords)' })
  async findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario logueado',
    type: UserProfileDto,
  })
  async getProfile(@CurrentUser() user: any): Promise<UserProfileDto> {
    return this.usersService.findOne(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Perfil de un usuario por ID (solo si coincide con el logueado)',
    type: UserProfileDto,
  })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    if (user.id !== +id) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este recurso',
      );
    }
    return this.usersService.findOne(+id);
  }

    @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado correctamente',
    type: UserProfileDto,
  })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateUserDto,
  ): Promise<UserProfileDto> {
    return this.usersService.update(user.id, dto);
  }

}
