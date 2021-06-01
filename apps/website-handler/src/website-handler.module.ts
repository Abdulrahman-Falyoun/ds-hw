import { Module } from '@nestjs/common';
import { WebsiteHandlerController } from './website-handler.controller';
import { WebsiteHandlerService } from './website-handler.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../gateway/src/configuration';

@Module({
  imports: [

  ],
  controllers: [WebsiteHandlerController],
  providers: [WebsiteHandlerService],
})
export class WebsiteHandlerModule {}
