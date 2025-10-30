import { WebSocketsGateway } from './web-socket.gateway';
import { Module } from '@nestjs/common';

@Module({
  providers: [WebSocketsGateway],
  exports: [WebSocketsGateway],
})
export class WebSocketModule {}
