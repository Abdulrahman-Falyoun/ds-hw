import { Inject, Injectable } from '@nestjs/common';
import { IMAGE_HANDLER_REDIS_PROXY_CLIENT } from '../ms-clients/redis-handler.client';
import { ClientProxy } from '@nestjs/microservices';
import { LARGEST_FILE, PDF_PAGE_AND_SEND_TO_EMAIL, RESIZE_IMAGE, SEND_EMAIL, TAKE_SCREENSHOT } from '../../../patterns';
import { RABBIT_HANDLER_REDIS_PROXY_CLIENT } from '../ms-clients/rabbit-handler.client';


@Injectable()
export class MainEmitter {

  constructor(
    @Inject(IMAGE_HANDLER_REDIS_PROXY_CLIENT) private readonly client: ClientProxy,
    @Inject(RABBIT_HANDLER_REDIS_PROXY_CLIENT) private readonly rabbitHandlerClient: ClientProxy,
    ) {
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

  public emitLargestFile(files: Express.Multer.File[]) {
    return this.client.send(LARGEST_FILE, files);
  }
  public emitMakePDF({to, text, website, subject}) {
    return this.rabbitHandlerClient.send(PDF_PAGE_AND_SEND_TO_EMAIL, {
      to: to || 'abulrahman-falyoun@outlook.com',
      website: website || 'https://google.com',
      text: text || `Hi abdul, this is a pdf of google.com`,
      subject: subject || 'pdf snapshot'
    })
  }
}