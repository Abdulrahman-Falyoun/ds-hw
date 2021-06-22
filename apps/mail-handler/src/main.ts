import { NestFactory } from '@nestjs/core';
import { MailHandlerModule } from './mail-handler.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Colors, print, Symbols } from '../../../libs/printer/libs';
import * as dotenv from 'dotenv';
import { registerAsEurekaService } from '../../../libs/utils/eureka-handler';
import { MAIL_HANDLER_ID } from '../../ids';
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

  const eureka = registerAsEurekaService({
    app: 'mail-handler',
    instanceId: MAIL_HANDLER_ID,
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      '$': 7348,
      '@enabled': true,
    },
    vipAddress: 'ds.ite',
    statusPageUrl: 'http://localhost:7348/info',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.AmazonInfo',
      name: 'MyOwn',
    },
  });

  try {
    eureka.start(err => {
      if(err) {
        // console.log('mail-handler.ts eureka error: ', err);
      }
    })
  } catch (e) {

  }

  await app.listen(() => {
    print(`Mail handler service is running`, Colors.pending, Symbols.ok);

  });
}

bootstrap().then();
