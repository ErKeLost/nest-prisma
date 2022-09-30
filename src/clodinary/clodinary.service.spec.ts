import { Test, TestingModule } from '@nestjs/testing';
import { ClodinaryService } from './clodinary.service';

describe('ClodinaryService', () => {
  let service: ClodinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClodinaryService],
    }).compile();

    service = module.get<ClodinaryService>(ClodinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
