import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { Colors, Symbols, print } from '../../../libs/printer/libs';
import { Eureka, EurekaClient } from 'eureka-js-client';
import { registerAsEurekaService } from '../../../libs/utils/eureka-handler';


async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('port');

  const eureka = registerAsEurekaService({
    app: 'gateway',
    instanceId: 'gatewayID',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      '$': 7345,
      '@enabled': true,
    },
    vipAddress: 'ds.ite',
    statusPageUrl: 'http://localhost:7345/info',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.AmazonInfo',
      name: 'MyOwn',
    },
  });

  eureka.start(async (err) => {
    console.log('starting error: ', err);

    if (!err) {
      const config = eureka.getInstancesByVipAddress('ds.ite').filter(c => c.instanceId === 'gatewayID')[0];
      await app.listen(config.port['$'], () =>
        print(
          `Main service is listening on port ${PORT}`,
          Colors.pending,
          Symbols.ok,
        ),
      );
    }

  });


}

bootstrap();
