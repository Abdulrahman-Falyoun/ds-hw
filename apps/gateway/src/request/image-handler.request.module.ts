import { Module } from '@nestjs/common';
import { ImageHandlerRequest } from './image-handler.request';
import { ImageHandlerEmitter } from '../emitters/image-handler.emitter';
import { IMAGE_HANDLER_REDIS_PROXY_CLIENT, ImageHandlerClient } from '../redis-clients/image-handler.client';


@Module({
  imports: [],
  controllers: [
    ImageHandlerRequest,
  ],
  providers: [
    ImageHandlerEmitter,
    {
      provide: IMAGE_HANDLER_REDIS_PROXY_CLIENT,
      useValue: ImageHandlerClient,
    },
  ],
})
export class ImageHandlerRequestModule {

}