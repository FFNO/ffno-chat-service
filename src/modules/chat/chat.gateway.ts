import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from 'src/config';
import { CHAT_PATTERNS, IMemberResDto } from 'src/libs';
import { CurrentMember } from 'src/shared';
import { AuthGuard } from '../auth/auth.guard';

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
    data: any,
    @CurrentMember() member: IMemberResDto,
  ) {
    const { content, senderId, receiverId } = JSON.parse(data);
    console.log(
      '🚀 ~ ChatGateway ~ content, senderId, receiverId:',
      data,
      content,
      senderId,
      receiverId,
      member,
    );

    // const message = await this.prismaService.message.create({
    //   data: {
    //     content,
    //     senderId,
    //     receiverId,
    //   },
    // });

    // this.server.sockets.emit(
    //   CHAT_PATTERNS.RECEIVE_MESSAGE + [senderId, receiverId].sort().join(),
    //   message,
    // );
  }
}
