import { Module } from '@nestjs/common';

import { BookingModule } from './booking/booking.module';
import { PrismaModule } from './prisma/prisma.module';
import { WebSocketModule } from './web-socket/web-socket.module';

@Module({
  imports: [BookingModule, PrismaModule, WebSocketModule],
})
export class AppModule {}
