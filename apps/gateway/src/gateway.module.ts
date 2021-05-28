import { Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileUploadModule } from '../../../libs/file-upload/src';
import { ImageHandlerRequestModule } from './request/image-handler.request.module';

@Module({
  imports: [
    ImageHandlerRequestModule,
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
  controllers: [],
  providers: [],
})
export class GatewayModule {
}
