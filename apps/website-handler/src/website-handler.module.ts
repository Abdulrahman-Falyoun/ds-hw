import { Module } from '@nestjs/common';
import { WebsiteHandlerController } from './website-handler.controller';
import { WebsiteHandlerService } from './website-handler.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../gateway/src/configuration';
import { TracingModule } from '@dollarsign/nestjs-jaeger-tracing/dist';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  IMAGE_HANDLER_REDIS_PROXY_CLIENT,
  WEBSITE_HANDLER_REDIS_PROXY_CLIENT,
} from '../../gateway/src/ms-clients/redis-handler.client';

@Module({
  imports: [
    TracingModule.forRoot({
      exporterConfig: {
        serviceName: 'website-handler-service',
      },
      isSimpleSpanProcessor: true,
    }),
    ClientsModule.register([
      {
        name: WEBSITE_HANDLER_REDIS_PROXY_CLIENT,
        transport: Transport.REDIS,
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
    ]),
  ],
  controllers: [WebsiteHandlerController],
  providers: [WebsiteHandlerService],
})
export class WebsiteHandlerModule {}
