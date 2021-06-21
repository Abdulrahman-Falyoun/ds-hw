import { Inject, Injectable } from '@nestjs/common';
import {
  IMAGE_HANDLER_REDIS_PROXY_CLIENT,
  WEBSITE_HANDLER_REDIS_PROXY_CLIENT,
} from '../ms-clients/redis-handler.client';
import { ClientProxy } from '@nestjs/microservices';
import {
  FILE_METADATA,
  LARGEST_FILE,
  PDF_PAGE_AND_SEND_TO_EMAIL,
  RESIZE_IMAGE,
  SEND_EMAIL,
  TAKE_SCREENSHOT,
  TAKE_SCREENSHOT_AND_GET_METADATA,
} from '../../../patterns';
import { RABBIT_HANDLER_REDIS_PROXY_CLIENT } from '../ms-clients/rabbit-handler.client';

@Injectable()
export class MainEmitter {
  constructor(
    @Inject(RABBIT_HANDLER_REDIS_PROXY_CLIENT)
    private readonly rabbitHandlerClient: ClientProxy,
    @Inject(IMAGE_HANDLER_REDIS_PROXY_CLIENT) private imageClient: ClientProxy,
    @Inject(WEBSITE_HANDLER_REDIS_PROXY_CLIENT)
    private websiteClient: ClientProxy,
  ) {}

  public emitResizeImage({
    image,
    opts,
  }: {
    image: Express.Multer.File;
    opts: {
      height: number;
      width: number;
    };
  }) {
    return this.imageClient.send(RESIZE_IMAGE, { image, opts }).toPromise();
  }

  public emitGetMetadata(path: string) {
    return this.imageClient.send(FILE_METADATA, path).toPromise();
  }
  public emitLargestFile(files: Express.Multer.File[]) {
    return this.imageClient.send(LARGEST_FILE, files).toPromise();
  }
  public emitMakePDF({ to, text, website, subject }) {
    return this.rabbitHandlerClient.send(PDF_PAGE_AND_SEND_TO_EMAIL, {
      to: to || 'abdulrahman-falyoun@outlook.com',
      website: website || 'https://google.com',
      text: text || `Hi abdul, this is a pdf of google.com`,
      subject: subject || 'pdf snapshot',
    });
  }

  public emitTakeScreenshot(website: string) {
    return this.websiteClient.send(TAKE_SCREENSHOT, website).toPromise();
  }
  public emitTakeScreenshotAndGetMetadata(website: string) {
    return this.websiteClient
      .send(TAKE_SCREENSHOT_AND_GET_METADATA, website)
      .toPromise();
  }
}
