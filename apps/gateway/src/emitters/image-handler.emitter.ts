import { Inject, Injectable } from '@nestjs/common';
import { IMAGE_HANDLER_REDIS_PROXY_CLIENT } from '../redis-clients/image-handler.client';
import { ClientProxy } from '@nestjs/microservices';
import { RESIZE_IMAGE } from '../../../patterns';


@Injectable()
export class ImageHandlerEmitter {
  constructor(@Inject(IMAGE_HANDLER_REDIS_PROXY_CLIENT) private readonly client: ClientProxy) {
  }

  public emitResizeImage(image: any) {
    return this.client.send(RESIZE_IMAGE, image).toPromise();
  }

}