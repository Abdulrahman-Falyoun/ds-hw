import { Controller, Get } from '@nestjs/common';
import { ImageHandlerService } from './image-handler.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RESIZE_IMAGE, TAKE_SCREENSHOT } from '../../patterns';

@Controller()
export class ImageHandlerController {
  constructor(private readonly imageHandlerService: ImageHandlerService) {
  }

  @MessagePattern(TAKE_SCREENSHOT)
  takeScreenshot(@Payload() website: string) {
    return this.imageHandlerService.takeScreenshot(website);
  }


  @MessagePattern(RESIZE_IMAGE)
  async resizeImage(@Payload() payload: { image: Express.Multer.File; opts: { width: number; height: number } }) {
    return await this.imageHandlerService.resizeImage(payload);

  }
}
