import { Controller, Get } from '@nestjs/common';
import { ImageHandlerService } from './image-handler.service';

@Controller()
export class ImageHandlerController {
  constructor(private readonly imageHandlerService: ImageHandlerService) {}

  @Get()
  getHello(): string {
    return this.imageHandlerService.getHello();
  }
}
