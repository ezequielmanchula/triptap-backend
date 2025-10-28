import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // Importamos Auth para login/registro
import { ConfigModule } from '@nestjs/config';    // Para variables de entorno (JWT, DB, etc.)

@Module({
  imports: [
    PrismaModule,
    ConfigModule, // asegura acceso a process.env en este módulo
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
