import { Module } from '@nestjs/common';
import { MailHandlerController } from './mail-handler.controller';
import { MailHandlerService } from './mail-handler.service';

@Module({
  imports: [],
  controllers: [MailHandlerController],
  providers: [MailHandlerService],
})
export class MailHandlerModule {}
