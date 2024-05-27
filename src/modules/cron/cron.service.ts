import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/config';

@Injectable()
export class CronService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkPing() {
    await this.prisma.channelMember.updateMany({
      where: {
        online: true,
        updatedAt: { lt: dayjs().subtract(1, 'minute').toDate() },
      },
      data: { online: false },
    });
  }
}
