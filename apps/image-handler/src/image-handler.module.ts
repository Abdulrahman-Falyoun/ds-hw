import { Module } from '@nestjs/common';
import { ImageHandlerController } from './image-handler.controller';
import { ImageHandlerService } from './image-handler.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../configuration';
import { DatabaseModule } from '../../../libs/database/src';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configuration],
    }),
    DatabaseModule,
  ],
  controllers: [ImageHandlerController],
  providers: [ImageHandlerService],
})
export class ImageHandlerModule {
}
