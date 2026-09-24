import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SALT_ROUNDS = 10;

// Nunca expor o hash da senha nas respostas da API
function sanitize<T extends { password: string }>(user: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...safe } = user;
  return safe;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      SALT_ROUNDS,
    );
    const user = await this.prisma.users.create({
      data: { ...createUserDto, password: hashedPassword },
    });
    return sanitize(user);
  }

  async findAll() {
    const users = await this.prisma.users.findMany();
    return users.map(sanitize);
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário #${id} não encontrado.`);
    }
    return sanitize(user);
  }

  findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    const data = { ...updateUserDto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }
    const user = await this.prisma.users.update({ where: { id }, data });
    return sanitize(user);
  }

  async remove(id: number) {
    await this.findOne(id);
    const user = await this.prisma.users.delete({ where: { id } });
    return sanitize(user);
  }
}
