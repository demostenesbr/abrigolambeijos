import { Test, TestingModule } from '@nestjs/testing';
import { AdoptersController } from './adopters.controller';
import { AdoptersService } from './adopters.service';

describe('AdoptersController', () => {
  let controller: AdoptersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdoptersController],
      providers: [AdoptersService],
    }).compile();

    controller = module.get<AdoptersController>(AdoptersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
