import { NestFactory } from '@nestjs/core';
import { WebsiteHandlerModule } from './website-handler.module';

async function bootstrap() {
  const app = await NestFactory.create(WebsiteHandlerModule);
  await app.listen(3000);
}
bootstrap();
