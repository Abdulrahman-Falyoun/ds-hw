import { Controller, Get } from '@nestjs/common';
import { WebsiteHandlerService } from './website-handler.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  MAKE_PDF,
  TAKE_SCREENSHOT,
  TAKE_SCREENSHOT_AND_GET_METADATA,
} from '../../patterns';

@Controller()
export class WebsiteHandlerController {
  constructor(private readonly websiteHandlerService: WebsiteHandlerService) {}

  @MessagePattern(TAKE_SCREENSHOT)
  takeScreenshot(@Payload() website: string) {
    console.log(`screenshot for: ${website}`);
    return this.websiteHandlerService.takeScreenshot(website);
  }

  @MessagePattern(TAKE_SCREENSHOT_AND_GET_METADATA)
  getScreenshotAndItsMetadata(url: string) {
    return this.websiteHandlerService.getScreenshotAndItsMetadata(url);
  }
}
