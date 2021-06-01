import { Module } from '@nestjs/common';
import { MailHandlerController } from './mail-handler.controller';
import { MailHandlerService } from './mail-handler.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../gateway/src/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [MailHandlerController],
  providers: [MailHandlerService],
})
export class MailHandlerModule {}
