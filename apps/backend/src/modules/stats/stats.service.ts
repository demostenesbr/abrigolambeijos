import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

const RECENT_MONTHS = 3;
// Abaixo deste valor no período recente, exibimos o total desde o início
const MIN_RECENT_AMOUNT = 1000;

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicStats() {
    const since = new Date();
    since.setMonth(since.getMonth() - RECENT_MONTHS);

    const [rescuedAnimals, adoptions, activePartners, recent, overall] =
      await Promise.all([
        this.prisma.rescues.count(),
        this.prisma.adoptions.count({ where: { status: 'completed' } }),
        this.prisma.partners.count(),
        this.prisma.donations.aggregate({
          _sum: { amount: true },
          where: { createdAt: { gte: since } },
        }),
        this.prisma.donations.aggregate({ _sum: { amount: true } }),
      ]);

    const recentTotal = recent._sum.amount ?? 0;
    const useRecent = recentTotal >= MIN_RECENT_AMOUNT;

    return {
      rescuedAnimals,
      adoptions,
      activePartners,
      totalRaised: useRecent ? recentTotal : (overall._sum.amount ?? 0),
      totalRaisedPeriod: useRecent ? 'recent' : 'all_time',
      totalRaisedMonths: RECENT_MONTHS,
    };
  }
}
