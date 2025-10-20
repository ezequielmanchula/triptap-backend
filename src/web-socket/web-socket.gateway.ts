import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinTrip')
  async handleJoinTrip(client: Socket, tripId: string) {
    console.log(`Client ${client.id} joined trip: ${tripId}`);
    await client.join(tripId);
  }

  @SubscribeMessage('leaveTrip')
  async handleLeaveTrip(client: Socket, tripId: string) {
    console.log(`Client ${client.id} left trip: ${tripId}`);
    await client.leave(tripId);
  }

  notifySeatFreed(tripId: number, seatNumber: number) {
    this.server.to(`trip-${tripId}`).emit('seatFreed', {
      tripId,
      seatNumber,
      timestamp: new Date(),
    });
  }

  notifySeatReserved(tripId: number, seatNumber: number) {
    this.server.to(`trip-${tripId}`).emit('seatReserved', {
      tripId,
      seatNumber,
      timestamp: new Date(),
    });
  }

  notifyBookingConfirmed(tripId: number, seatNumber: number) {
    this.server.to(`trip-${tripId}`).emit('bookingConfirmed', {
      tripId,
      seatNumber,
      timestamp: new Date(),
    });
  }
}
