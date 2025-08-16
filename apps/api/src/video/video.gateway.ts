// In apps/api/src/video/video.gateway.ts
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { RoomDto, SignalingDto } from './dto/signaling.dto';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, restrict this to your frontend URL
  },
})
export class VideoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(VideoGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: RoomDto,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(data.room);
    // Notify others in the room that a user has joined
    client.to(data.room).emit('user-joined', { clientId: client.id });
    this.logger.log(`Client ${client.id} joined room ${data.room}`);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('signal')
  handleSignal(
    @MessageBody() data: SignalingDto,
    @ConnectedSocket() client: Socket,
  ): void {
    // Broadcast the signal to others in the room
    client.to(data.room).emit('signal', {
      clientId: client.id,
      payload: data.payload,
    });
  }
}
