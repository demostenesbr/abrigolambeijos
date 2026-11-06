import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserRole, UserStatus } from '@prisma/client';
import request from 'supertest';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';

describe('Solicitações públicas de parceria', () => {
  let app: INestApplication;
  const create = jest.fn().mockResolvedValue({ id: 1 });
  const update = jest.fn().mockResolvedValue({ id: 1, status: 'active' });
  const payload = {
    name: 'Clínica',
    type: 'Veterinária',
    contact: 'Pessoa responsável',
    email: 'clinica@example.com',
    phone: '11999999999',
    address: 'Rua A, 1',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    description: 'Atendimento veterinário',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PartnersController],
      providers: [
        PartnersService,
        {
          provide: PrismaService,
          useValue: {
            partners: {
              create,
              update,
              findUnique: jest
                .fn()
                .mockResolvedValue({ id: 1, status: 'pending' }),
            },
            users: {
              findUnique: jest.fn().mockResolvedValue({
                id: 1,
                email: 'admin@example.com',
                role: UserRole.ADMIN,
                status: UserStatus.ACTIVE,
              }),
            },
          },
        },
        {
          provide: JwtService,
          useValue: { verifyAsync: jest.fn().mockResolvedValue({ sub: 1 }) },
        },
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    create.mockClear();
    update.mockClear();
  });

  it('grava como pendente e não retorna dados privados', async () => {
    const response = await request(app.getHttpServer() as never)
      .post('/partners/applications')
      .send(payload)
      .expect(201);
    expect(response.body).toEqual({
      message: 'Solicitação de parceria recebida para análise.',
    });
    expect(create).toHaveBeenCalledWith({
      data: { ...payload, location: 'São Paulo, SP', status: 'pending' },
    });
  });

  it('rejeita tentativa de definir status e dados inválidos', async () => {
    await request(app.getHttpServer() as never)
      .post('/partners/applications')
      .send({ ...payload, status: 'active' })
      .expect(400);
    await request(app.getHttpServer() as never)
      .post('/partners/applications')
      .send({ ...payload, email: 'inválido' })
      .expect(400);
    await request(app.getHttpServer() as never)
      .post('/partners/applications')
      .send({ ...payload, name: '   ' })
      .expect(400);
    expect(create).not.toHaveBeenCalled();
  });

  it('mantém a criação e alteração de parceiros restritas', async () => {
    await request(app.getHttpServer() as never)
      .post('/partners')
      .send(payload)
      .expect(401);
    await request(app.getHttpServer() as never)
      .patch('/partners/1')
      .send({ status: 'active' })
      .expect(401);
    expect(create).not.toHaveBeenCalled();
  });

  it('permite ao administrador aprovar ou recusar uma solicitação', async () => {
    for (const status of ['active', 'rejected']) {
      await request(app.getHttpServer() as never)
        .patch('/partners/1')
        .set('Authorization', 'Bearer admin')
        .send({ ...payload, location: 'São Paulo, SP', status })
        .expect(200);
      expect(update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...payload, location: 'São Paulo, SP', status },
      });
    }
  });
});
