import { Body, Controller, Post } from '@nestjs/common';
import { ImageHandlerEmitter } from '../emitters/image-handler.emitter';


@Controller('/image-handle')
export class ImageHandlerRequest {

  constructor(private imageHandlerEmitter: ImageHandlerEmitter) {
  }

  @Post()
  resize(@Body() payload: any) {
    return this.imageHandlerEmitter.emitResizeImage(payload);
  }
}