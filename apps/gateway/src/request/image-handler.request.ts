import { Body, Controller, Inject, Logger, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageHandlerEmitter } from '../emitters/image-handler.emitter';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { pathToUploadedFiles } from '../../../../libs/file-upload/src/constants';
import { editFileName, imageFileFilter } from '../../../../libs/file-upload/src/helpers';
import { DiscoveryService } from 'nestjs-eureka';

@Controller('/image-handle')
export class ImageHandlerRequest {

  private readonly logger = new Logger(ImageHandlerRequest.name);

  constructor(
    private imageHandlerEmitter: ImageHandlerEmitter,
    private discoveryService: DiscoveryService
  ) {
    console.log(discoveryService);
    discoveryService.resolveHostname('jqservice')
  }


  @Post('/screenshot')
  takeScreenshot(@Body() data: { website: string }) {
    const { website } = data;
    this.logger.log(`Requested screenshot for: ${website}`);
    return this.imageHandlerEmitter.emitTakeScreenshot(website);
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

    return this.imageHandlerEmitter.emitResizeImage({ image, opts });
  }
}