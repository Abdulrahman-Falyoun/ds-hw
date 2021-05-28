import { NestFactory } from '@nestjs/core';
import { ImageHandlerModule } from './image-handler.module';

async function bootstrap() {
  const app = await NestFactory.create(ImageHandlerModule);
  await app.listen(3000);
}
bootstrap();
