import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './config/prisma.module';
import { modules } from './modules';

@Module({
  imports: [AppConfigModule, PrismaModule, ...modules],
})
export class AppModule {}
