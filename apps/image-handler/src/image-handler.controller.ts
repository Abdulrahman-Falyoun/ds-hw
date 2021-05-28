import { Controller, Get } from '@nestjs/common';
import { ImageHandlerService } from './image-handler.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TAKE_SCREENSHOT } from '../../patterns';

@Controller()
export class ImageHandlerController {
  constructor(private readonly imageHandlerService: ImageHandlerService) {
  }

  @MessagePattern(TAKE_SCREENSHOT)
  takeScreenshot(@Payload() website: string): string {
    console.log(`Received website: ${website}`);
    return this.imageHandlerService.takeScreenshot(website);
  }
}
