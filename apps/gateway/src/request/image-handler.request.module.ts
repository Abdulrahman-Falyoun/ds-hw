import { Module } from '@nestjs/common';
import { ImageHandlerRequest } from './image-handler.request';
import { ImageHandlerEmitter } from '../emitters/image-handler.emitter';
import { IMAGE_HANDLER_REDIS_PROXY_CLIENT, ImageHandlerClient } from '../redis-clients/image-handler.client';
import { DiscoveryService, EurekaModule } from 'nestjs-eureka';
import { EurekaClient } from 'eureka-js-client';


@Module({
  imports: [
    EurekaModule.forRoot({
        eureka: {
          host: '192.168.99.100',
          port: 32768,
          servicePath: '/eureka/apps/',
        },
      service: {
        host: '192.168.39.114',
        port: 2341,
        name: 'gateway',
      },
      disableDiscovery: false,
      disable: false,
    }),
  ],
  controllers: [
    ImageHandlerRequest,
  ],
  providers: [
    ImageHandlerEmitter,
    {
      provide: IMAGE_HANDLER_REDIS_PROXY_CLIENT,
      useValue: ImageHandlerClient,
    },
    // {
    //   useValue: {
    //     instance: {
    //       app: 'jqservice',
    //       hostName: 'localhost',
    //       ipAddr: '127.0.0.1',
    //       statusPageUrl: 'http://localhost:8080/info',
    //       port: {
    //         '$': 8080,
    //         '@enabled': 'true',
    //       },
    //       vipAddress: 'jq.test.something.com',
    //       dataCenterInfo: {
    //         '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
    //         name: 'MyOwn',
    //       },
    //     },
    //     eureka: {
    //       host: '192.168.99.100',
    //       port: 32768,
    //       servicePath: '/eureka/apps/',
    //     },
    //   },
    //   provide: 'eureka-instance',
    // },

  ],
})
export class ImageHandlerRequestModule {

}