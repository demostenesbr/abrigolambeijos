import { Test, TestingModule } from '@nestjs/testing';
import { RescuesService } from './rescues.service';

describe('RescuesService', () => {
  let service: RescuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RescuesService],
    }).compile();

    service = module.get<RescuesService>(RescuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
