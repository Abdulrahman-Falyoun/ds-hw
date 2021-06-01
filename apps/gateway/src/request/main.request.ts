import {
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MainEmitter } from '../emitters/main.emitter';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { pathToUploadedFiles } from '../../../../libs/file-upload/src/constants';
import { editFileName, imageFileFilter } from '../../../../libs/file-upload/src/helpers';
import { DiscoveryService } from 'nestjs-eureka';

@Controller('/image-handle')
export class MainRequest {

  private readonly logger = new Logger(MainRequest.name);

  constructor(
    private mainEmitter: MainEmitter,
    private discoveryService: DiscoveryService
  ) {
    console.log(discoveryService);
    discoveryService.resolveHostname('jqservice')
  }


  @Post('/screenshot')
  takeScreenshot(@Body() data: { website: string }) {
    const { website } = data;
    this.logger.log(`Requested screenshot for: ${website}`);
    return this.mainEmitter.emitTakeScreenshot(website);
  }

  @Post('/largest-file')
  @UseInterceptors(
    FileInterceptor('images[]', {
      storage: diskStorage({
        destination: pathToUploadedFiles,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  largestFile(@UploadedFiles() files: Express.Multer.File[]) {
    return this.mainEmitter.emitLargestFile(files);
  }

  @Post('/pdf/send-email')
  sendEmail(@Body() data: { to: string, text: string, subject: string, website: string }) {
    return this.mainEmitter.emitMakePDF(data);
  }

  @Post('/resize')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: pathToUploadedFiles,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  resize(@UploadedFile() image: Express.Multer.File, @Query() opts: { width: number, height: number }) {

    return this.mainEmitter.emitResizeImage({ image, opts });
  }
}