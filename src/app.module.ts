import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BookingModule } from './booking/booking.module';
import { TripsModule } from './trips/trips.module';
import { PrismaModule } from './prisma/prisma.module';
import { WebSocketModule } from './web-socket/web-socket.module';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // variables de entorno disponibles en toda la app
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    BookingModule,
    TripsModule,
    WebSocketModule,
  ],
})
export class AppModule {}
