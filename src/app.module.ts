import { Module } from '@nestjs/common';

import { BookingModule } from './booking/booking.module';
import { PrismaModule } from './prisma/prisma.module';
import { WebSocketModule } from './web-socket/web-socket.module';

import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BookingModule, PrismaModule, WebSocketModule, UsersModule, AuthModule],
})
export class AppModule {}
