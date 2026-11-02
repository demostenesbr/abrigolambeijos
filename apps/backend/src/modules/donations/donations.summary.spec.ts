import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import { DonationsService } from './donations.service';

describe('DonationsService.getSummary', () => {
  let service: DonationsService;
  const prisma = {
    donations: { aggregate: jest.fn(), findMany: jest.fn() },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(DonationsService);
  });

  it('summarises only confirmed donations', async () => {
    prisma.donations.aggregate.mockResolvedValue({
      _sum: { amount: 150 },
      _count: { _all: 2 },
    });
    prisma.donations.findMany.mockResolvedValue([
      { donorName: 'A' },
      { donorName: 'B' },
    ]);

    await expect(service.getSummary()).resolves.toEqual({
      totalAmount: 150,
      donationsCount: 2,
      donorsCount: 2,
    });
    expect(prisma.donations.aggregate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'confirmed' } }),
    );
    expect(prisma.donations.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'confirmed' } }),
    );
  });

  it('returns zeros when there are no confirmed donations', async () => {
    prisma.donations.aggregate.mockResolvedValue({
      _sum: { amount: null },
      _count: { _all: 0 },
    });
    prisma.donations.findMany.mockResolvedValue([]);

    await expect(service.getSummary()).resolves.toEqual({
      totalAmount: 0,
      donationsCount: 0,
      donorsCount: 0,
    });
  });
});
