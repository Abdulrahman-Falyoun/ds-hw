import { Controller } from '@nestjs/common';
import { ImageHandlerService } from './image-handler.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  FILE_METADATA,
  LARGEST_FILE,
  RESIZE_IMAGE,
  SEND_EMAIL,
  TAKE_SCREENSHOT,
} from '../../patterns';

@Controller()
export class ImageHandlerController {
  constructor(private readonly imageHandlerService: ImageHandlerService) {}

  @MessagePattern(RESIZE_IMAGE)
  async resizeImage(
    @Payload()
    payload: {
      image: Express.Multer.File;
      opts: { width: number; height: number };
    },
  ) {
    return await this.imageHandlerService.resizeImage(payload);
  }

  @MessagePattern(LARGEST_FILE)
  largestFile(@Payload() files: Express.Multer.File[]) {
    return this.imageHandlerService.largestFile(files);
  }

  @MessagePattern(FILE_METADATA)
  fileMetaData(file: string) {
    console.log({ file })
    return this.imageHandlerService.getMetadata(file);
  }
}
