import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: process.env.CORS_WHITELIST.split(','),
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { port: 3020 },
  });

  await app.startAllMicroservices();

  await app.listen(3200);
}
bootstrap();
