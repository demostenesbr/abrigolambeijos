import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole, UserStatus } from '@prisma/client';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
  status: UserStatus;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

interface JwtPayload {
  sub: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token de acesso ausente.');
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Token de acesso inválido ou expirado.');
    }

    // Recarrega o usuário do banco para revalidar role/status a cada requisição
    const user = await this.prisma.users.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuário inativo ou suspenso.');
    }

    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    return true;
  }

  private extractToken(request: AuthenticatedRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
