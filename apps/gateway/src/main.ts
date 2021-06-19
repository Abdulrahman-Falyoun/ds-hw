import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { Colors, Symbols, print } from '../../../libs/printer/libs';
import { registerAsEurekaService } from '../../../libs/utils/eureka-handler';
import { GATEWAY_HANDLER_ID } from '../../ids';


export const gatewayEureka = registerAsEurekaService({
  app: 'gateway',
  instanceId: GATEWAY_HANDLER_ID,
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

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('port');

  gatewayEureka.start(async (err) => {

    if (err) {
      console.log('starting error: ', err);

    }

  });

  await app.listen(PORT, () =>
    print(
      `Main service is listening on port ${PORT}`,
      Colors.pending,
      Symbols.ok,
    ),
  );


}

bootstrap();
