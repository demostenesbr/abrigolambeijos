import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole, UserStatus } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    // Auto-cadastro sempre cria ADOPTER; papéis elevados só via ADMIN em /users
    const user = await this.usersService.create({
      ...registerDto,
      role: UserRole.ADOPTER,
      status: UserStatus.ACTIVE,
    });

    return this.buildAuthResponse(user.id, user.email, user.role);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuário inativo ou suspenso.');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    return this.buildAuthResponse(user.id, user.email, user.role);
  }

  private async buildAuthResponse(id: number, email: string, role: UserRole) {
    const accessToken = await this.jwtService.signAsync({
      sub: id,
      email,
      role,
    });
    return { accessToken, user: { id, email, role } };
  }
}
