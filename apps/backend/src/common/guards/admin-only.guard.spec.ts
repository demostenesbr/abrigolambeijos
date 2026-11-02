import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserRole, UserStatus } from '@prisma/client';
import request from 'supertest';
import { PrismaService } from '../prisma/prisma.service';
import { AdoptionsController } from '../../modules/adoptions/adoptions.controller';
import { AdoptionsService } from '../../modules/adoptions/adoptions.service';
import { DonationsController } from '../../modules/donations/donations.controller';
import { DonationsService } from '../../modules/donations/donations.service';
import { PartnersController } from '../../modules/partners/partners.controller';
import { PartnersService } from '../../modules/partners/partners.service';

const users: Record<
  string,
  { id: number; role: UserRole; status: UserStatus }
> = {
  admin: { id: 1, role: UserRole.ADMIN, status: UserStatus.ACTIVE },
  adopter: { id: 2, role: UserRole.ADOPTER, status: UserStatus.ACTIVE },
  protector: { id: 3, role: UserRole.PROTECTOR, status: UserStatus.ACTIVE },
  inactiveAdmin: { id: 4, role: UserRole.ADMIN, status: UserStatus.INACTIVE },
};

describe('Admin-only guards (donations, adoptions, partners)', () => {
  let app: INestApplication;
  const service = {
    create: jest.fn().mockResolvedValue({ id: 1 }),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({ id: 1 }),
    update: jest.fn().mockResolvedValue({ id: 1 }),
    remove: jest.fn().mockResolvedValue({ id: 1 }),
    getSummary: jest.fn().mockResolvedValue({ totalAmount: 0 }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [
        DonationsController,
        AdoptionsController,
        PartnersController,
      ],
      providers: [
        { provide: DonationsService, useValue: service },
        { provide: AdoptionsService, useValue: service },
        { provide: PartnersService, useValue: service },
        {
          provide: JwtService,
          useValue: {
            // O token de teste é o próprio nome do usuário.
            verifyAsync: (token: string) =>
              token in users
                ? Promise.resolve({ sub: users[token].id })
                : Promise.reject(new Error('invalid')),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            users: {
              findUnique: ({ where }: { where: { id: number } }) =>
                Promise.resolve(
                  Object.values(users)
                    .filter((user) => user.id === where.id)
                    .map((user) => ({
                      ...user,
                      email: 'a@a.com',
                      name: 'x',
                    }))[0] ?? null,
                ),
            },
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const protectedRoutes = ['donations', 'adoptions', 'partners'].flatMap(
    (resource) => [
      ['get', `/${resource}`],
      ['get', `/${resource}/1`],
      ['post', `/${resource}`],
      ['patch', `/${resource}/1`],
      ['delete', `/${resource}/1`],
    ],
  );

  describe.each(protectedRoutes)('%s %s', (method, path) => {
    const call = (token?: string) => {
      const req = request(app.getHttpServer())[
        method as 'get' | 'post' | 'patch' | 'delete'
      ](path);
      return token ? req.set('Authorization', `Bearer ${token}`) : req;
    };

    it('returns 401 without a token', async () => {
      await call().expect(401);
    });

    it('returns 401 with an invalid token', async () => {
      await call('garbage').expect(401);
    });

    it('returns 401 for an inactive admin', async () => {
      await call('inactiveAdmin').expect(401);
    });

    it.each(['adopter', 'protector'])('returns 403 for %s', async (token) => {
      await call(token).expect(403);
    });

    it('lets an ADMIN through the guards', async () => {
      const res = await call('admin');
      expect([401, 403]).not.toContain(res.status);
    });
  });

  describe('GET /donations/summary', () => {
    it('stays public for the donations page', async () => {
      await request(app.getHttpServer()).get('/donations/summary').expect(200);
    });
  });
});
