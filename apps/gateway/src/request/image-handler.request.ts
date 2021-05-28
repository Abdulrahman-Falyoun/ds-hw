import { Body, Controller, Logger, LoggerService, Post } from '@nestjs/common';
import { ImageHandlerEmitter } from '../emitters/image-handler.emitter';


@Controller('/image-handle')
export class ImageHandlerRequest {

  private readonly logger = new Logger(ImageHandlerRequest.name);

  constructor(
    private imageHandlerEmitter: ImageHandlerEmitter,
  ) {
  }


  @Post('/screenshot')
  takeScreenshot(@Body() data: { website: string }) {
    const { website } = data;
    this.logger.log(`Requested screenshot for: ${website}`);
    return this.imageHandlerEmitter.emitTakeScreenshot(website);
  }

  @Post()
  resize(@Body() payload: any) {
    return this.imageHandlerEmitter.emitResizeImage(payload);
  }
}