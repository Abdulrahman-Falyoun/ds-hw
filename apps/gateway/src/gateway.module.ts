import { Module } from '@nestjs/common';
import { ImageHandlerRequest } from './request/image-handler.request';
import { ImageHandlerEmitter } from './emitters/image-handler.emitter';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileUploadModule } from '../../../libs/file-upload/src';

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

  ],
  controllers: [
    ImageHandlerRequest,
  ],
  providers: [
    ImageHandlerEmitter,
  ],
})
export class GatewayModule {
}
