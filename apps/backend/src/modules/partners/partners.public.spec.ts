import { Test } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PartnersService } from './partners.service';

describe('PartnersService.findPublic', () => {
  it('returns only active partners and non-sensitive fields', async () => {
    const findMany = jest.fn().mockResolvedValue([]);
    const moduleRef = await Test.createTestingModule({
      providers: [
        PartnersService,
        { provide: PrismaService, useValue: { partners: { findMany } } },
      ],
    }).compile();

    await moduleRef.get(PartnersService).findPublic();

    const calls = findMany.mock.calls as unknown[][];
    const args = calls[0][0] as {
      where: { status: string };
      select: Record<string, boolean>;
    };
    expect(args.where).toEqual({ status: 'active' });
    expect(Object.keys(args.select).sort()).toEqual(
      ['city', 'description', 'id', 'name', 'state', 'type'].sort(),
    );
    expect(args.select).not.toHaveProperty('email');
    expect(args.select).not.toHaveProperty('phone');
    expect(args.select).not.toHaveProperty('contact');
  });
});
