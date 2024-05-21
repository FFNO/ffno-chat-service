import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/config';
import { CHAT_PATTERNS, IMemberResDto } from 'src/libs';
import { CurrentMember } from 'src/shared';
import { AuthGuard } from '../auth/auth.guard';
import { NotificationService } from '../services/notification.service';
import { SendMessageDto } from './chat.dto';

@WebSocketGateway(3001, {
  cors: { origin: process.env.CORS_WHITELIST.split(','), credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

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

    console.log(`${senderId} sent to ${channelId}: ${content}`);

    const message = await this.prisma.message.create({
      data: {
        content,
        senderId,
        channelId,
        lastMessage: { connect: { id: channelId } },
      },
    });

    this.server.sockets.emit(
      CHAT_PATTERNS.RECEIVE_MESSAGE + channelId,
      message,
    );

    const offlineMembers = await this.prisma.channelMember.findMany({
      where: { channelId, online: false },
    });

    if (offlineMembers.length) {
      try {
        console.log(offlineMembers);

        await Promise.all(
          offlineMembers
            .filter(({ memberId }) => memberId !== senderId)
            .map((member) =>
              this.notificationService.sendWebPushNotification({
                memberId: member.memberId,
                title: 'You have new message',
                content: message.content,
                link: `/chat/${member.channelId}`,
              }),
            ),
        );
      } catch (error) {
        console.log('Error when sending notification');
        console.log(error);
      }
    }
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(CHAT_PATTERNS.PING)
  async ping(@CurrentMember() member: IMemberResDto) {
    await this.prisma.channelMember.updateMany({
      where: { memberId: member.id },
      data: { online: true },
    });
  }
}
