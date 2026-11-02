import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateDonationDto } from './donations/dto/create-donation.dto';
import { CreatePartnerDto } from './partners/dto/create-partner.dto';
import { CreateRescueDto } from './rescues/dto/create-rescue.dto';

const errorsFor = async <T extends object>(cls: new () => T, payload: object) =>
  (await validate(plainToInstance(cls, payload))).map((e) => e.property);

describe('status field validation', () => {
  const donation = { donorName: 'Ana', amount: 10 };
  const partner = {
    name: 'P',
    type: 'Vet',
    contact: 'c',
    email: 'p@p.com',
    phone: '1',
    address: 'a',
    city: 'SP',
    state: 'SP',
    country: 'BR',
    description: 'd',
    location: 'SP',
  };

  it('accepts donations with and without the new optional fields', async () => {
    expect(await errorsFor(CreateDonationDto, donation)).toEqual([]);
    expect(
      await errorsFor(CreateDonationDto, {
        ...donation,
        type: 'monthly',
        method: 'card',
        plan: 'Padrinho',
        status: 'pending',
      }),
    ).toEqual([]);
  });

  it('rejects invalid donation type, method and status', async () => {
    const errors = await errorsFor(CreateDonationDto, {
      ...donation,
      type: 'weekly',
      method: 'cash',
      status: 'done',
    });
    expect(errors.sort()).toEqual(['method', 'status', 'type']);
  });

  it('validates partner status', async () => {
    expect(
      await errorsFor(CreatePartnerDto, { ...partner, status: 'inactive' }),
    ).toEqual([]);
    expect(
      await errorsFor(CreatePartnerDto, { ...partner, status: 'banned' }),
    ).toEqual(['status']);
  });

  it('validates rescue status', async () => {
    const rescue = { name: 'R', location: 'SP' };
    expect(
      await errorsFor(CreateRescueDto, { ...rescue, status: 'in_treatment' }),
    ).toEqual([]);
    expect(
      await errorsFor(CreateRescueDto, { ...rescue, status: 'lost' }),
    ).toEqual(['status']);
  });
});
