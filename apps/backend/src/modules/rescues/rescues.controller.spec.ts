import { Test, TestingModule } from '@nestjs/testing';
import { RescuesController } from './rescues.controller';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RescuesService } from './rescues.service';

describe('RescuesController', () => {
  let controller: RescuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RescuesController],
      providers: [RescuesService, { provide: PrismaService, useValue: {} }],
    }).compile();

    controller = module.get<RescuesController>(RescuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
