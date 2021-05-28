import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageHandlerService {
  getHello(): string {
    return 'Hello World!';
  }
}
