import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRescueDto } from './dto/create-rescue.dto';
import { UpdateRescueDto } from './dto/update-rescue.dto';

@Injectable()
export class RescuesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRescueDto: CreateRescueDto) {
    return this.prisma.rescues.create({ data: createRescueDto });
  }

  findAll() {
    return this.prisma.rescues.findMany();
  }

  async findOne(id: number) {
    const rescue = await this.prisma.rescues.findUnique({ where: { id } });
    if (!rescue) {
      throw new NotFoundException(`Resgate #${id} não encontrado.`);
    }
    return rescue;
  }

  async update(id: number, updateRescueDto: UpdateRescueDto) {
    await this.findOne(id);
    return this.prisma.rescues.update({
      where: { id },
      data: updateRescueDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.rescues.delete({ where: { id } });
  }
}
