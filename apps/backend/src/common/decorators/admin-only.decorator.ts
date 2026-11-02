import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

export const IS_PUBLIC_KEY = 'isPublic';

// Libera uma rota específica dentro de um controller protegido por @AdminOnly().
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Exige token válido e perfil ADMIN (classe ou rota).
export const AdminOnly = () =>
  applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(UserRole.ADMIN));
