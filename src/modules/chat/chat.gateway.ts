import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly prismaService: PrismaService) {}
  @WebSocketServer()
  server: Server;

  @UseGuards(AuthGuard)
  @SubscribeMessage(CHAT_PATTERNS.SEND_MESSAGE)
  async handleSendMessage(
    @MessageBody()
    data: string,
    @CurrentMember() member: IMemberResDto,
  ) {
    const { content, channelId } = plainToInstance(
      SendMessageDto,
      JSON.parse(data),
    );
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
