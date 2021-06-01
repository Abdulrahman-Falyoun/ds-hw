import { Controller } from '@nestjs/common';
import { MailHandlerService } from './mail-handler.service';
import {  MessagePattern, Payload } from '@nestjs/microservices';
import { PDF_PAGE_AND_SEND_TO_EMAIL } from '../../patterns';

@Controller()
export class MailHandlerController {
  constructor(private readonly mailHandlerService: MailHandlerService) {
  }


  @MessagePattern(PDF_PAGE_AND_SEND_TO_EMAIL)
  makePdfAndSendToEmail(@Payload() payload: { website: string, to: string, text: string, subject: string }) {
    return this.mailHandlerService
  }
}
