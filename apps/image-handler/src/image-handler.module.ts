import { Module } from '@nestjs/common';
import { ImageHandlerController } from './image-handler.controller';
import { ImageHandlerService } from './image-handler.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../configuration';
import { DatabaseModule } from '../../../libs/database/src';
import { MongooseModule } from '@nestjs/mongoose';
import { DS_FILE_SCHEMA } from '../../schema-names';
import { FileSchema } from '../../../libs/file-upload/src';

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
  ],
  controllers: [ImageHandlerController],
  providers: [ImageHandlerService],
})
export class ImageHandlerModule {
}
