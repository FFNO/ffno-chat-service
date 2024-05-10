import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config';
import { IGetListMessageDto } from 'src/libs';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async getChannelMessages(data: IGetListMessageDto) {
    const { memberId, channelId, channelName, channelImgUrl } = data;

    const channel = await this.prismaService.channel.findUnique({
      where: { id: channelId },
    });

    if (!channel && channelName && channelId.length === 73) {
      await this.prismaService.channel.create({
        data: {
          id: channelId,
          name: channelName,
          imgUrl: channelImgUrl,
          lastMessageId: null,
          members: {
            createMany: {
              data: channelId.split('_').map((memberId) => ({ memberId })),
            },
          },
        },
      });
    }

    const member = await this.prismaService.channelMember.findUnique({
      where: { memberId_channelId: { memberId, channelId } },
    });

    if (!member) {
      throw new ForbiddenException('You cannot access this channel');
    }

    const messages = await this.prismaService.message.findMany({
      where: { channelId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await this.prismaService.channelMember.update({
      where: { memberId_channelId: { memberId, channelId } },
      data: { seenAt: new Date() },
    });

    return { channelId, messages };
  }

  async getListChannel(memberId: string) {
    const channels = await this.prismaService.channel.findMany({
      where: { lastMessageId: { not: null }, members: { some: { memberId } } },
      include: { lastMessage: true },
      orderBy: { updatedAt: 'desc' },
    });

    return { total: channels.length, data: channels };
  }
}
