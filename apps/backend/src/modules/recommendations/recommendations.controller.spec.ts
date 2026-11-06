import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsController } from './recommendations.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MlBridgeService } from './ml-bridge.service';
import { RecommendationsService } from './recommendations.service';
import { ModelReportService } from './model-report.service';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

describe('RecommendationsController', () => {
  let controller: RecommendationsController;
  const getReport = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationsController],
      providers: [
        RecommendationsService,
        { provide: PrismaService, useValue: {} },
        { provide: MlBridgeService, useValue: {} },
        { provide: ModelReportService, useValue: { getReport } },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<RecommendationsController>(
      RecommendationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('exposes the model report only under the admin controller', async () => {
    expect(Reflect.getMetadata(ROLES_KEY, RecommendationsController)).toEqual([
      UserRole.ADMIN,
    ]);
    await controller.getModelReport();
    expect(getReport).toHaveBeenCalledTimes(1);
  });
});
