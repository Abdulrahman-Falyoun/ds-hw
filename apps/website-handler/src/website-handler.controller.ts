import { Controller, Get } from '@nestjs/common';
import { WebsiteHandlerService } from './website-handler.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MAKE_PDF, TAKE_SCREENSHOT } from '../../patterns';

@Controller()
export class WebsiteHandlerController {
  constructor(private readonly websiteHandlerService: WebsiteHandlerService) {}


  @MessagePattern(TAKE_SCREENSHOT)
  takeScreenshot(@Payload() website: string) {
    return this.websiteHandlerService.takeScreenshot(website);
  }

}
