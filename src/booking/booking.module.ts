import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingsController } from './booking.controller';
import { WebSocketModule } from 'src/web-socket/web-socket.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BookingsController],
  providers: [BookingService],
  imports: [WebSocketModule, PrismaModule],
})
export class BookingModule {}
