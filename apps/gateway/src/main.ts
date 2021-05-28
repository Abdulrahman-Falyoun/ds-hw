import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { Colors, Symbols, print } from '../../../libs/printer/libs';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('port');


  await app.listen(PORT, () =>
    print(
      `Main service is listening on port ${PORT}`,
      Colors.pending,
      Symbols.ok,
    ),
  );

}

bootstrap();
