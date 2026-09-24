import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';

@Injectable()
export class AdoptionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAdoptionDto: CreateAdoptionDto) {
    return this.prisma.adoptions.create({ data: createAdoptionDto });
  }

  findAll() {
    return this.prisma.adoptions.findMany();
  }

  async findOne(id: number) {
    const adoption = await this.prisma.adoptions.findUnique({ where: { id } });
    if (!adoption) {
      throw new NotFoundException(`Adoção #${id} não encontrada.`);
    }
    return adoption;
  }

  async update(id: number, updateAdoptionDto: UpdateAdoptionDto) {
    await this.findOne(id);
    return this.prisma.adoptions.update({
      where: { id },
      data: updateAdoptionDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.adoptions.delete({ where: { id } });
  }
}
