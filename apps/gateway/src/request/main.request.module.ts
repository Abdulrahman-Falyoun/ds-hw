import { Module } from '@nestjs/common';
import { MainRequest } from './main.request';
import { MainEmitter } from '../emitters/main.emitter';
import { IMAGE_HANDLER_REDIS_PROXY_CLIENT, RedisHandlerClient } from '../ms-clients/redis-handler.client';
import {
  DiscoveryService,
  EurekaModule,
  EurekaModuleAsyncOptions,
  EurekaModuleOptions,
  EurekaModuleOptionsFactory,
  ServiceDefinition,
  ServiceDto,
} from 'nestjs-eureka';
import { Eureka, EurekaClient } from 'eureka-js-client';
import { RABBIT_HANDLER_REDIS_PROXY_CLIENT, RabbitHandlerClient } from '../ms-clients/rabbit-handler.client';

@Module({
  imports: [
    // EurekaModule.forRoot({
    //   eureka: {
    //     host: '192.168.99.100',
    //     port: 32768,
    //     servicePath: '/eureka/apps/',
    //   },
    //   service: {
    //     host: '192.168.33.209',
    //     port: 2341,
    //     name: 'gateway',
    //   },
    //   disableDiscovery: false,
    //   disable: false,
    // }),
  ],
  controllers: [
    MainRequest,
  ],
  providers: [
    MainEmitter,
    // DiscoveryService,
    // {
    //   useValue: new Eureka({
    //     eureka: {
    //       host: '192.168.99.100',
    //       port: 32768,
    //       fetchRegistry: false,
    //       registerWithEureka: false,
    //       servicePath: '/eureka/apps/',
    //       serviceUrls: {
    //         'us-east-1c': [
    //           'http://ec2-fake-552-627-568-165.compute-1.amazonaws.com:7001/eureka/v2/apps/', 'http://ec2-fake-368-101-182-134.compute-1.amazonaws.com:7001/eureka/v2/apps/',
    //         ],
    //       },
    //     },
    //     instance: {
    //       app: 'jqservice',
    //       hostName: 'localhost',
    //       instanceId: 'jqservice',
    //       ipAddr: '127.0.0.1',
    //       port: 8080,
    //       vipAddress: 'jq.test.something.com',
    //       dataCenterInfo: {
    //         name: 'MyOwn',
    //       },
    //     },
    //   }),
    //   provide: 'Eureka',
    // },
    {
      provide: IMAGE_HANDLER_REDIS_PROXY_CLIENT,
      useValue: RedisHandlerClient,
    },
    {
      provide: RABBIT_HANDLER_REDIS_PROXY_CLIENT,
      useValue: RabbitHandlerClient,
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
export class MainRequestModule {

}