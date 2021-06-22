import { NestFactory } from '@nestjs/core';
import { WebsiteHandlerModule } from './website-handler.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ImageHandlerModule } from '../../image-handler/src/image-handler.module';
import { Colors, print, Symbols } from '../../../libs/printer/libs';
import { registerAsEurekaService } from '../../../libs/utils/eureka-handler';
import { WEBSITE_HANDLER_ID } from '../../ids';
import { TracingModule } from '@dollarsign/nestjs-jaeger-tracing/dist';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WebsiteHandlerModule,
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
    app: 'website-handler',
    instanceId: WEBSITE_HANDLER_ID,
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      $: 7349,
      '@enabled': true,
    },
    vipAddress: 'ds.ite',
    statusPageUrl: 'http://localhost:7349/info',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.AmazonInfo',
      name: 'MyOwn',
    },
  });

  try {
    eureka.start((err) => {
      if (err) {
        // console.log('mail-handler.ts eureka error: ', err);
      }
    });
  } catch (e) {}
  await app.listen(() => {
    print(`Website handler service is running`, Colors.pending, Symbols.ok);
  });
}
bootstrap();
