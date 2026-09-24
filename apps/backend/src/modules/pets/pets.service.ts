import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPetDto: CreatePetDto) {
    return this.prisma.pets.create({ data: createPetDto });
  }

  findAll() {
    return this.prisma.pets.findMany();
  }

  async findOne(id: number) {
    const pet = await this.prisma.pets.findUnique({ where: { id } });
    if (!pet) {
      throw new NotFoundException(`Pet #${id} não encontrado.`);
    }
    return pet;
  }

  async update(id: number, updatePetDto: UpdatePetDto) {
    await this.findOne(id);
    return this.prisma.pets.update({ where: { id }, data: updatePetDto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.pets.delete({ where: { id } });
  }
}
