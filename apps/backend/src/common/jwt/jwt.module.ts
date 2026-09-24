import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';

const expiresIn = (process.env.JWT_EXPIRES_IN ??
  '1d') as unknown as NonNullable<SignOptions['expiresIn']>;

// Registrado globalmente para que qualquer módulo possa usar JwtAuthGuard sem import circular
@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn },
    }),
  ],
  exports: [JwtModule],
})
export class GlobalJwtModule {}
