import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPetDto: CreatePetDto) {
    return this.prisma.pets.create({ data: createPetDto });
  }

  async findAll(query: PaginationQueryDto = {}) {
    // Sem `page` mantém o formato legado (array), usado por telas que só precisam de id/nome.
    if (!query.page) {
      return this.prisma.pets.findMany({ orderBy: { id: 'desc' } });
    }

    const page = query.page;
    const limit = query.limit ?? 20;
    const term = query.q?.trim();
    const where: Prisma.PetsWhereInput = term
      ? {
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { animalname: { contains: term, mode: 'insensitive' } },
            { race: { contains: term, mode: 'insensitive' } },
            { rganimal: { contains: term, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total, dogs, small, medium, large] =
      await this.prisma.$transaction([
        this.prisma.pets.findMany({
          where,
          orderBy: { id: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.pets.count({ where }),
        this.prisma.pets.count({ where: { species: 'Dog' } }),
        this.prisma.pets.count({ where: { size: 'Small' } }),
        this.prisma.pets.count({ where: { size: 'Medium' } }),
        this.prisma.pets.count({ where: { size: 'Large' } }),
      ]);

    return {
      items,
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
      summary: { dogs, small, medium, large },
    };
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
