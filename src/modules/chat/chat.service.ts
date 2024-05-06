import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDirectMessages(staffId: string, memberId: string) {
    const messages = await this.prismaService.message.findMany({
      where: {
        OR: [
          {
            senderId: staffId,
            receiverId: memberId,
          },
          {
            senderId: memberId,
            receiverId: staffId,
          },
        ],
      },
    });

    return { messages };
  }
}
