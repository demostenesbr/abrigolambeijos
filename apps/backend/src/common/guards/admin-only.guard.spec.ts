import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserRole, UserStatus } from '@prisma/client';
import request from 'supertest';
import { PrismaService } from '../prisma/prisma.service';
import { AdoptersController } from '../../modules/adopters/adopters.controller';
import { AdoptersService } from '../../modules/adopters/adopters.service';
import { AdoptionRequestsController } from '../../modules/adoption-requests/adoption-requests.controller';
import { AdoptionRequestsService } from '../../modules/adoption-requests/adoption-requests.service';
import { AdoptionsController } from '../../modules/adoptions/adoptions.controller';
import { AdoptionsService } from '../../modules/adoptions/adoptions.service';
import { DonationsController } from '../../modules/donations/donations.controller';
import { DonationsService } from '../../modules/donations/donations.service';
import { PartnersController } from '../../modules/partners/partners.controller';
import { PartnersService } from '../../modules/partners/partners.service';
import { PetsController } from '../../modules/pets/pets.controller';
import { PetsService } from '../../modules/pets/pets.service';
import { RecommendationsController } from '../../modules/recommendations/recommendations.controller';
import { RecommendationsService } from '../../modules/recommendations/recommendations.service';
import { RescuesController } from '../../modules/rescues/rescues.controller';
import { RescuesService } from '../../modules/rescues/rescues.service';
import { StatsController } from '../../modules/stats/stats.controller';
import { StatsService } from '../../modules/stats/stats.service';
import { UsersController } from '../../modules/users/users.controller';
import { UsersService } from '../../modules/users/users.service';

type TestUser = { id: number; role: UserRole; status: UserStatus };

const users: Record<string, TestUser> = {
  admin: { id: 1, role: UserRole.ADMIN, status: UserStatus.ACTIVE },
  adopter: { id: 2, role: UserRole.ADOPTER, status: UserStatus.ACTIVE },
  protector: { id: 3, role: UserRole.PROTECTOR, status: UserStatus.ACTIVE },
  partner: { id: 5, role: UserRole.PARTNER, status: UserStatus.ACTIVE },
  inactiveAdmin: { id: 4, role: UserRole.ADMIN, status: UserStatus.INACTIVE },
};

const NON_ADMINS = ['adopter', 'protector', 'partner'];
const ADMIN_ONLY_RESOURCES = [
  'donations',
  'adoptions',
  'partners',
  'rescues',
  'pets',
  'adopters',
  'adoption-requests',
  'recommendations',
];

type Method = 'get' | 'post' | 'patch' | 'delete';

describe('Role-based access (backend)', () => {
  let app: INestApplication;
  const service = {
    create: jest.fn().mockResolvedValue({ id: 1 }),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({ id: 1 }),
    update: jest.fn().mockResolvedValue({ id: 1 }),
    remove: jest.fn().mockResolvedValue({ id: 1 }),
    getSummary: jest.fn().mockResolvedValue({ totalAmount: 0 }),
    generateForUser: jest.fn().mockResolvedValue({ results: [] }),
    getAdminOverview: jest.fn().mockResolvedValue({}),
    getPublicStats: jest.fn().mockResolvedValue({}),
    findPublic: jest.fn().mockResolvedValue([]),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [
        DonationsController,
        AdoptionsController,
        PartnersController,
        RescuesController,
        PetsController,
        AdoptersController,
        AdoptionRequestsController,
        RecommendationsController,
        StatsController,
        UsersController,
      ],
      providers: [
        ...[
          DonationsService,
          AdoptionsService,
          PartnersService,
          RescuesService,
          PetsService,
          AdoptersService,
          AdoptionRequestsService,
          RecommendationsService,
          StatsService,
          UsersService,
        ].map((provide) => ({ provide, useValue: service })),
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

  const call = (method: Method, path: string, token?: string) => {
    const req = request(app.getHttpServer() as never)[method](path);
    return token ? req.set('Authorization', `Bearer ${token}`) : req;
  };

  const adminRoutes = [
    ...ADMIN_ONLY_RESOURCES.flatMap((resource) => [
      ['get', `/${resource}`],
      ['get', `/${resource}/1`],
      ['post', `/${resource}`],
      ['patch', `/${resource}/1`],
      ['delete', `/${resource}/1`],
    ]),
    ['post', '/recommendations/generate'],
    ['get', '/stats/admin'],
    ['get', '/users'],
    ['post', '/users'],
    ['delete', '/users/1'],
  ] as [Method, string][];

  describe.each(adminRoutes)('%s %s', (method, path) => {
    it('returns 401 without a token', async () => {
      await call(method, path).expect(401);
    });

    it('returns 401 with an invalid token', async () => {
      await call(method, path, 'garbage').expect(401);
    });

    it('returns 401 for an inactive admin', async () => {
      await call(method, path, 'inactiveAdmin').expect(401);
    });

    it.each(NON_ADMINS)(
      'hides the route from %s with the same 404 as an unknown route',
      async (token) => {
        const res = await call(method, path, token);
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
          message: `Cannot ${method.toUpperCase()} ${path}`,
          error: 'Not Found',
          statusCode: 404,
        });
      },
    );

    it('lets an ADMIN through the guards', async () => {
      const res = await call(method, path, 'admin');
      expect([401, 403, 404]).not.toContain(res.status);
    });
  });

  describe('routes open to every profile', () => {
    it('GET /donations/summary and GET /stats are public', async () => {
      await call('get', '/donations/summary').expect(200);
      await call('get', '/stats').expect(200);
      await call('get', '/partners/public').expect(200);
    });

    it.each([...NON_ADMINS, 'admin'])(
      'POST /recommendations/me works for %s',
      async (token) => {
        const res = await call('post', '/recommendations/me', token).send({
          profile: {},
        });
        expect([401, 403, 404]).not.toContain(res.status);
      },
    );

    it('POST /recommendations/me still requires a token', async () => {
      await call('post', '/recommendations/me').expect(401);
    });
  });

  describe('users: own record only', () => {
    it('lets a profile read its own user', async () => {
      await call('get', '/users/2', 'adopter').expect(200);
    });

    it('answers like a missing user when reading someone else', async () => {
      const res = await call('get', '/users/1', 'adopter');
      expect(res.status).toBe(404);
      expect((res.body as { message: string }).message).toBe(
        'Usuário #1 não encontrado.',
      );
    });

    it('answers like a missing user when editing someone else', async () => {
      await call('patch', '/users/1', 'protector').expect(404);
    });

    it('does not let a non-admin change role or status', async () => {
      service.update.mockClear();
      await call('patch', '/users/2', 'adopter').send({
        role: 'ADMIN',
        status: 'ACTIVE',
        name: 'Novo',
      });
      const calls = service.update.mock.calls as unknown[][];
      const dto = calls[0]?.[1] as Record<string, unknown>;
      expect(dto).toBeDefined();
      expect(dto).not.toHaveProperty('role');
      expect(dto).not.toHaveProperty('status');
    });
  });
});
