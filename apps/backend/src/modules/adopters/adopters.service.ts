import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAdopterDto } from './dto/create-adopter.dto';
import { UpdateAdopterDto } from './dto/update-adopter.dto';

@Injectable()
export class AdoptersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAdopterDto: CreateAdopterDto) {
    return this.prisma.adopters.create({ data: createAdopterDto });
  }

  findAll() {
    return this.prisma.adopters.findMany();
  }

  async findOne(id: number) {
    const adopter = await this.prisma.adopters.findUnique({ where: { id } });
    if (!adopter) {
      throw new NotFoundException(`Adotante #${id} não encontrado.`);
    }
    return adopter;
  }

  async update(id: number, updateAdopterDto: UpdateAdopterDto) {
    await this.findOne(id);
    return this.prisma.adopters.update({
      where: { id },
      data: updateAdopterDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.adopters.delete({ where: { id } });
  }
}
