import { Inject, Injectable } from '@nestjs/common';
import { IMAGE_HANDLER_REDIS_PROXY_CLIENT } from '../redis-clients/image-handler.client';
import { ClientProxy } from '@nestjs/microservices';
import { RESIZE_IMAGE, TAKE_SCREENSHOT } from '../../../patterns';


@Injectable()
export class ImageHandlerEmitter {

  constructor(@Inject(IMAGE_HANDLER_REDIS_PROXY_CLIENT) private readonly client: ClientProxy) {
  }

  public emitResizeImage({ image, opts }: {
    image: Express.Multer.File, opts: {
      height: number; width: number
    }
  }) {
    return this.client.send(RESIZE_IMAGE, { image, opts }).toPromise();
  }

  public emitTakeScreenshot(website: string) {
    return this.client.send(TAKE_SCREENSHOT, website).toPromise();;
  }
}