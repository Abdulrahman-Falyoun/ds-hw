import { NestFactory } from '@nestjs/core';
import { ImageHandlerModule } from './image-handler.module';
import { ConfigService } from '@nestjs/config';
import { Colors, print, Symbols } from '../../../libs/printer/libs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ImageHandlerModule, {
    transport: Transport.REDIS,
    options: {
      auth_pass: process.env.REDIS_PASSWORD,
      url: process.env.REDIS_URL,
    },
  });

  await app.listen(() => {
    print(`Image handler service is running`, Colors.pending, Symbols.ok);
  });
}

bootstrap();
