import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE } from 'src/libs';
import { NotificationService } from './notification.service';

@Module({
  providers: [
    NotificationService,
    {
      provide: NOTIFICATION_SERVICE,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          options: {
            port: configService.get('NOTIFICATION_SERVICE_PORT') ?? 3010,
          },
          transport: Transport.TCP,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
