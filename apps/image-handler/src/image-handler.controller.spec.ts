import { Test, TestingModule } from '@nestjs/testing';
import { ImageHandlerController } from './image-handler.controller';
import { ImageHandlerService } from './image-handler.service';

describe('ImageHandlerController', () => {
  let imageHandlerController: ImageHandlerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ImageHandlerController],
      providers: [ImageHandlerService],
    }).compile();

    imageHandlerController = app.get<ImageHandlerController>(ImageHandlerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(imageHandlerController.getHello()).toBe('Hello World!');
    });
  });
});
