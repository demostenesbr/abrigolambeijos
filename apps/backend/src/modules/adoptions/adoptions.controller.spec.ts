import { Test, TestingModule } from '@nestjs/testing';
import { AdoptionsController } from './adoptions.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AdoptionsService } from './adoptions.service';

describe('AdoptionsController', () => {
  let controller: AdoptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdoptionsController],
      providers: [
        AdoptionsService,
        { provide: PrismaService, useValue: {} },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<AdoptionsController>(AdoptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
