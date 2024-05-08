import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { plainToInstance } from 'class-transformer';
import { Server } from 'socket.io';
import { PrismaService } from 'src/config';
import { CHAT_PATTERNS, IMemberResDto } from 'src/libs';
import { CurrentMember } from 'src/shared';
import { AuthGuard } from '../auth/auth.guard';
import { SendMessageDto } from './chat.dto';
import { Socket } from 'socket.io';

@WebSocketGateway(3001, {
  cors: { origin: 'http://localhost:5173', credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly prismaService: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  @WebSocketServer()
  server: Server;

  @UseGuards(AuthGuard)
  @SubscribeMessage(CHAT_PATTERNS.SEND_MESSAGE)
  async handleSendMessage(
    @MessageBody()
    data: SendMessageDto,
    @CurrentMember() member: IMemberResDto,
  ) {
    const { content, channelId } = data;
    const senderId = member.id;

    const message = await this.prismaService.message.create({
      data: {
        content,
        senderId,
        channelId,
      },
    });

    this.server.sockets.emit(
      CHAT_PATTERNS.RECEIVE_MESSAGE + channelId,
      message,
    );
  }
}
