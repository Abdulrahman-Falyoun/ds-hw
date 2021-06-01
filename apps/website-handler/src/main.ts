import { NestFactory } from '@nestjs/core';
import { WebsiteHandlerModule } from './website-handler.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ImageHandlerModule } from '../../image-handler/src/image-handler.module';
import { Colors, print, Symbols } from '../../../libs/printer/libs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(WebsiteHandlerModule, {
    transport: Transport.REDIS,
    options: {
      auth_pass: process.env.REDIS_PASSWORD,
      url: process.env.REDIS_URL,
    },
  });

  await app.listen(() => {
    print(`Website handler service is running`, Colors.pending, Symbols.ok);
  });
}
bootstrap();
