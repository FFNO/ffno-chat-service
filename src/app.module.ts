import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './config/prisma.module';
import { modules } from './modules';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AppConfigModule,
    ScheduleModule.forRoot(),
    PrismaModule,
    ...modules,
  ],
})
export class AppModule {}
