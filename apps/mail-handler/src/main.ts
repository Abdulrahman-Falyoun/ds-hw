import { NestFactory } from '@nestjs/core';
import { MailHandlerModule } from './mail-handler.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Colors, print, Symbols } from '../../../libs/printer/libs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' })
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MailHandlerModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'mail_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen(() => {
    print(`Mail handler service is running`, Colors.pending, Symbols.ok);

  });
}

bootstrap().then();
