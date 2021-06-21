import { Logger, Module } from '@nestjs/common';
import { ImageHandlerController } from './image-handler.controller';
import { ImageHandlerService } from './image-handler.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../configuration';
import { DatabaseModule } from '../../../libs/database/src';
import { MongooseModule } from '@nestjs/mongoose';
import { DS_FILE_SCHEMA } from '../../schema-names';
import { FileSchema } from '../../../libs/file-upload/src';
import { TracingModule } from '@dollarsign/nestjs-jaeger-tracing/dist';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  IMAGE_HANDLER_REDIS_PROXY_CLIENT,
  WEBSITE_HANDLER_REDIS_PROXY_CLIENT,
} from '../../gateway/src/ms-clients/redis-handler.client';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        schema: FileSchema,
        name: DS_FILE_SCHEMA,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configuration],
    }),
    DatabaseModule,
    TracingModule.forRoot({
      exporterConfig: {
        serviceName: 'image-handler-service',
      },
      isSimpleSpanProcessor: true,
    }),
    ClientsModule.register([
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
  ],
  controllers: [ImageHandlerController],
  providers: [ImageHandlerService],
})
export class ImageHandlerModule {}
