import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';

@Injectable()
export class AdoptionsService {
  constructor(private readonly prisma: PrismaService) {}

  // Valida adotante/animal e evita adoção duplicada na mesma transação (não há FKs no schema).
  create(createAdoptionDto: CreateAdoptionDto) {
    return this.prisma.$transaction(
      async (tx) => {
        const [adopter, pet, existing] = await Promise.all([
          tx.adopters.findUnique({ where: { id: createAdoptionDto.adopterId } }),
          tx.pets.findUnique({ where: { id: createAdoptionDto.animalId } }),
          tx.adoptions.findFirst({
            where: { animalId: createAdoptionDto.animalId },
          }),
        ]);
        if (!adopter) {
          throw new NotFoundException(
            `Adotante #${createAdoptionDto.adopterId} não encontrado.`,
          );
        }
        if (!pet) {
          throw new NotFoundException(
            `Pet #${createAdoptionDto.animalId} não encontrado.`,
          );
        }
        if (existing) {
          throw new ConflictException(
            `Pet #${createAdoptionDto.animalId} já possui uma adoção registrada.`,
          );
        }
        return tx.adoptions.create({ data: createAdoptionDto });
      },
      {
        maxWait: 5_000,
        timeout: 10_000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
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
