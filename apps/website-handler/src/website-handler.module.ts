import { Module } from '@nestjs/common';
import { WebsiteHandlerController } from './website-handler.controller';
import { WebsiteHandlerService } from './website-handler.service';

@Module({
  imports: [],
  controllers: [WebsiteHandlerController],
  providers: [WebsiteHandlerService],
})
export class WebsiteHandlerModule {}
