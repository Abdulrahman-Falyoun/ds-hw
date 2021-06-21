import { Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileUploadModule } from '../../../libs/file-upload/src';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { TracingModule } from '@dollarsign/nestjs-jaeger-tracing/dist';
import {
  IMAGE_HANDLER_REDIS_PROXY_CLIENT,
  WEBSITE_HANDLER_REDIS_PROXY_CLIENT,
} from './ms-clients/redis-handler.client';
import { MainRequest } from './request/main.request';
import { MainEmitter } from './emitters/main.emitter';
import {
  RABBIT_HANDLER_REDIS_PROXY_CLIENT,
  RabbitHandlerClient,
} from './ms-clients/rabbit-handler.client';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'public/images'),
      serveRoot: '/files',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    FileUploadModule,
    ClientsModule.register([
      {
        name: 'GATEWAY_SERVICE',
        transport: Transport.TCP,
        options: {
          ...TracingModule.getParserOptions(),
        },
      },
      {
        name: IMAGE_HANDLER_REDIS_PROXY_CLIENT,
        transport: Transport.REDIS,
        options: {
          ...TracingModule.getParserOptions(),
        },
      },
      {
        name: WEBSITE_HANDLER_REDIS_PROXY_CLIENT,
        transport: Transport.REDIS,
        options: {
          ...TracingModule.getParserOptions(),
        },
      },
    ]),
    TracingModule.forRootAsync({
      useFactory: () => ({
        exporterConfig: {
          serviceName: 'gateway-service',
        },
        isSimpleSpanProcessor: true,
      }),
    }),
  ],
  controllers: [MainRequest],
  providers: [
    {
      provide: RABBIT_HANDLER_REDIS_PROXY_CLIENT,
      useValue: RabbitHandlerClient,
    },
    MainEmitter,
  ],
})
export class GatewayModule {}
