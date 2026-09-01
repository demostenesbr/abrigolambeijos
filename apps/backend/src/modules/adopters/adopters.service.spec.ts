import { Test, TestingModule } from '@nestjs/testing';
import { AdoptersService } from './adopters.service';

describe('AdoptersService', () => {
  let service: AdoptersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdoptersService],
    }).compile();

    service = module.get<AdoptersService>(AdoptersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
