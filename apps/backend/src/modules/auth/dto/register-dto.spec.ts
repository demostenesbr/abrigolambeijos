import { ValidationPipe } from '@nestjs/common';
import { RegisterDto } from './register.dto';

describe('RegisterDto (auto-cadastro público)', () => {
  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });
  const meta = { type: 'body' as const, metatype: RegisterDto };
  const base = { email: 'a@a.com', password: '12345678', name: 'Ana' };

  it('aceita um cadastro comum', async () => {
    await expect(pipe.transform(base, meta)).resolves.toBeDefined();
  });

  it.each(['ADMIN', 'PROTECTOR', 'PARTNER', 'ADOPTER'])(
    'rejeita o envio de role=%s',
    async (role) => {
      await expect(pipe.transform({ ...base, role }, meta)).rejects.toThrow();
    },
  );

  it('rejeita o envio de status', async () => {
    await expect(
      pipe.transform({ ...base, status: 'ACTIVE' }, meta),
    ).rejects.toThrow();
  });
});
