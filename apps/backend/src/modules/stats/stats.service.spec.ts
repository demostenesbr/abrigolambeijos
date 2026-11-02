import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  MIN_RECENT_AMOUNT,
  RECENT_MONTHS,
  StatsService,
} from './stats.service';

const sum = (value: number | null) => ({ _sum: { amount: value } });

describe('StatsService', () => {
  let service: StatsService;
  const prisma = {
    rescues: { count: jest.fn(), findMany: jest.fn() },
    adoptions: { count: jest.fn() },
    partners: { count: jest.fn() },
    donations: { aggregate: jest.fn() },
    pets: { count: jest.fn() },
    adopters: { count: jest.fn() },
    adoptionRequests: { count: jest.fn(), findMany: jest.fn() },
    recommendations: { count: jest.fn() },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(StatsService);
  });

  describe('getPublicStats', () => {
    const setup = (recent: number | null, overall: number | null) => {
      prisma.rescues.count.mockResolvedValue(4200);
      prisma.adoptions.count.mockResolvedValue(3100);
      prisma.partners.count.mockResolvedValue(87);
      prisma.donations.aggregate
        .mockResolvedValueOnce(sum(recent))
        .mockResolvedValueOnce(sum(overall));
    };

    it('counts only completed adoptions and active partners', async () => {
      setup(5000, 90000);
      await service.getPublicStats();
      expect(prisma.adoptions.count).toHaveBeenCalledWith({
        where: { status: 'completed' },
      });
      expect(prisma.partners.count).toHaveBeenCalledWith({
        where: { status: 'active' },
      });
    });

    it('sums only confirmed donations', async () => {
      setup(5000, 90000);
      await service.getPublicStats();
      for (const [args] of prisma.donations.aggregate.mock.calls as [
        { where: { status: string } },
      ][]) {
        expect(args.where.status).toBe('confirmed');
      }
    });

    it('uses the recent total when it reaches the minimum', async () => {
      setup(MIN_RECENT_AMOUNT, 90000);
      await expect(service.getPublicStats()).resolves.toMatchObject({
        rescuedAnimals: 4200,
        adoptions: 3100,
        activePartners: 87,
        totalRaised: MIN_RECENT_AMOUNT,
        totalRaisedPeriod: 'recent',
        totalRaisedMonths: RECENT_MONTHS,
      });
    });

    it('falls back to the all-time total when the recent one is too low', async () => {
      setup(MIN_RECENT_AMOUNT - 1, 90000);
      await expect(service.getPublicStats()).resolves.toMatchObject({
        totalRaised: 90000,
        totalRaisedPeriod: 'all_time',
      });
    });

    it('returns zero when there are no donations at all', async () => {
      setup(null, null);
      await expect(service.getPublicStats()).resolves.toMatchObject({
        totalRaised: 0,
        totalRaisedPeriod: 'all_time',
      });
    });
  });

  describe('getAdminOverview', () => {
    beforeEach(() => {
      prisma.pets.count.mockResolvedValue(10);
      prisma.adopters.count.mockResolvedValue(20);
      prisma.adoptionRequests.count.mockResolvedValue(3);
      prisma.adoptionRequests.findMany.mockResolvedValue([]);
      prisma.adoptions.count.mockResolvedValue(7);
      prisma.rescues.count.mockResolvedValue(5);
      prisma.recommendations.count.mockResolvedValue(9);
      prisma.partners.count.mockResolvedValue(6);
      prisma.donations.aggregate.mockResolvedValue(sum(100));
    });

    it('builds a six-month rescue series ending in the current month', async () => {
      const now = new Date();
      prisma.rescues.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          { createdAt: now },
          { createdAt: now },
          { createdAt: new Date(now.getFullYear() - 5, 0, 1) },
        ]);

      const result = await service.getAdminOverview();

      expect(result.rescuesByMonth).toHaveLength(6);
      const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      expect(result.rescuesByMonth[5]).toEqual({ month: current, value: 2 });
      expect(
        result.rescuesByMonth.slice(0, 5).every((item) => item.value === 0),
      ).toBe(true);
    });

    it('treats rescues that are not recovered as active', async () => {
      prisma.rescues.findMany.mockResolvedValue([]);
      await service.getAdminOverview();
      expect(prisma.rescues.count).toHaveBeenCalledWith({
        where: { status: { not: 'recovered' } },
      });
      expect(prisma.rescues.count).toHaveBeenCalledWith({
        where: { status: 'in_treatment' },
      });
    });

    it('exposes recurring and total donations from confirmed records only', async () => {
      prisma.rescues.findMany.mockResolvedValue([]);
      const result = await service.getAdminOverview();
      expect(result.donations).toEqual({
        thisMonth: 100,
        previousMonth: 100,
        total: 100,
        recurringThisMonth: 100,
      });
      const wheres = (
        prisma.donations.aggregate.mock.calls as [
          { where: { status: string; type?: string } },
        ][]
      ).map(([args]) => args.where);
      expect(wheres.every((where) => where.status === 'confirmed')).toBe(true);
      expect(wheres.some((where) => where.type === 'monthly')).toBe(true);
    });

    it('reports total and active partners separately', async () => {
      prisma.rescues.findMany.mockResolvedValue([]);
      prisma.partners.count.mockResolvedValueOnce(6).mockResolvedValueOnce(4);
      const result = await service.getAdminOverview();
      expect(result.partners).toEqual({ total: 6, active: 4 });
    });
  });
});
