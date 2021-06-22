import { NestFactory } from '@nestjs/core';
import { ImageHandlerModule } from './image-handler.module';
import { ConfigService } from '@nestjs/config';
import { Colors, print, Symbols } from '../../../libs/printer/libs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { registerAsEurekaService } from '../../../libs/utils/eureka-handler';
import { IMAGE_HANDLER_ID } from '../../ids';
import { TracingModule } from '@dollarsign/nestjs-jaeger-tracing/dist';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ImageHandlerModule,
    {
      transport: Transport.REDIS,
      options: {
        auth_pass: process.env.REDIS_PASSWORD,
        url: process.env.REDIS_URL,
        ...TracingModule.getParserOptions(),
      },
    },
  );

  const eureka = registerAsEurekaService({
    app: 'image-handler',
    instanceId: IMAGE_HANDLER_ID,
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      $: 7346,
      '@enabled': true,
    },
    vipAddress: 'ds.ite',
    statusPageUrl: 'http://localhost:7346/info',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.AmazonInfo',
      name: 'MyOwn',
    },
  });

  try {
    eureka.start((err) => {
      if (err) {
        // console.log(`image-handler eureka error: `, err);
      }
    });
  } catch (e) {}
  await app.listen(() => {
    print(`Image handler service is running`, Colors.pending, Symbols.ok);
  });
}

bootstrap();
