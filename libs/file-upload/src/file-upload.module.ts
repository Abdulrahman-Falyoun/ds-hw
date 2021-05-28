import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadController } from './file-upload.controller';
import { pathToUploadedFiles } from './constants';
import { MongooseModule } from '@nestjs/mongoose';
import { DS_FILE_SCHEMA } from '../../../apps/schema-names';
import { FileSchema } from './file.model';
import { FileUploadService } from './file-upload.service';
import { ConfigModule } from '@nestjs/config';
import configurations from './configurations';
import { DatabaseModule } from '../../database/src';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configurations],
    }),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: pathToUploadedFiles,
      }),
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      {
        name: DS_FILE_SCHEMA,
        schema: FileSchema,
      },
    ]),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [],
})
export class FileUploadModule {
}
