import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';

describe('CloudinaryController', () => {
  let controller: CloudinaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudinaryController],
      providers: [CloudinaryService],
    }).compile();

    controller = module.get<CloudinaryController>(CloudinaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
