import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDirectMessages(memberId: string, channelId: string) {
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

    return { messages };
  }
}
