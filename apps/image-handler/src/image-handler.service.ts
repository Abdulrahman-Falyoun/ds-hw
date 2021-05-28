import { Injectable } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class ImageHandlerService {

  takeScreenshot(website: string) {
    return `screenshot for ${website}`;
  }
}
