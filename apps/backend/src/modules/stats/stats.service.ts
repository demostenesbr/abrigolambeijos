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

  async getAdminOverview() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const seriesStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const staleBefore = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const thisMonth = { gte: startOfMonth };
    const sumOf = (range: { gte: Date; lt?: Date }) =>
      this.prisma.donations.aggregate({
        _sum: { amount: true },
        where: { createdAt: range },
      });

    const [
      pets,
      petsMonth,
      adopters,
      adoptersMonth,
      pendingRequests,
      staleRequests,
      completedAdoptions,
      completedAdoptionsMonth,
      rescues,
      rescuesMonth,
      recommendations,
      partners,
      donationsMonth,
      donationsPrevMonth,
      donationsTotal,
      recentRequests,
      recentRescues,
      rescueDates,
    ] = await Promise.all([
      this.prisma.pets.count(),
      this.prisma.pets.count({ where: { createdAt: thisMonth } }),
      this.prisma.adopters.count(),
      this.prisma.adopters.count({ where: { createdAt: thisMonth } }),
      this.prisma.adoptionRequests.count({ where: { status: 'pending' } }),
      this.prisma.adoptionRequests.count({
        where: { status: 'pending', requestDate: { lt: staleBefore } },
      }),
      this.prisma.adoptions.count({ where: { status: 'completed' } }),
      this.prisma.adoptions.count({
        where: { status: 'completed', adoptionDate: thisMonth },
      }),
      this.prisma.rescues.count(),
      this.prisma.rescues.count({ where: { createdAt: thisMonth } }),
      this.prisma.recommendations.count(),
      this.prisma.partners.count(),
      sumOf({ gte: startOfMonth }),
      sumOf({ gte: startOfPrevMonth, lt: startOfMonth }),
      this.prisma.donations.aggregate({ _sum: { amount: true } }),
      this.prisma.adoptionRequests.findMany({
        orderBy: { requestDate: 'desc' },
        take: 5,
        select: {
          id: true,
          userName: true,
          petName: true,
          requestDate: true,
          status: true,
        },
      }),
      this.prisma.rescues.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { id: true, name: true, location: true, createdAt: true },
      }),
      this.prisma.rescues.findMany({
        where: { createdAt: { gte: seriesStart } },
        select: { createdAt: true },
      }),
    ]);

    const monthKey = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const rescuesByMonth = Array.from({ length: 6 }, (_, index) => {
      const month = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
      return { month: monthKey(month), value: 0 };
    });
    for (const { createdAt } of rescueDates) {
      const bucket = rescuesByMonth.find(
        (item) => item.month === monthKey(createdAt),
      );
      if (bucket) bucket.value += 1;
    }

    return {
      pets: { total: pets, thisMonth: petsMonth },
      adopters: { total: adopters, thisMonth: adoptersMonth },
      adoptionRequests: { pending: pendingRequests, stale: staleRequests },
      adoptions: {
        completed: completedAdoptions,
        thisMonth: completedAdoptionsMonth,
      },
      rescues: { total: rescues, thisMonth: rescuesMonth },
      recommendations,
      partners,
      donations: {
        thisMonth: donationsMonth._sum.amount ?? 0,
        previousMonth: donationsPrevMonth._sum.amount ?? 0,
        total: donationsTotal._sum.amount ?? 0,
      },
      recentRequests,
      recentRescues,
      rescuesByMonth,
    };
  }
}
