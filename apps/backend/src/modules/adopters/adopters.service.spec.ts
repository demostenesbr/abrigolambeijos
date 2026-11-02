import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AdoptersService } from './adopters.service';

describe('AdoptersService', () => {
  let service: AdoptersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdoptersService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<AdoptersService>(AdoptersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
