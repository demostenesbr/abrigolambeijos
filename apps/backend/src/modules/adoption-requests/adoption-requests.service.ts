import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';
import { UpdateAdoptionRequestDto } from './dto/update-adoption-request.dto';

@Injectable()
export class AdoptionRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAdoptionRequestDto: CreateAdoptionRequestDto) {
    return this.prisma.adoptionRequests.create({
      data: createAdoptionRequestDto,
    });
  }

  findAll() {
    return this.prisma.adoptionRequests.findMany();
  }

  async findOne(id: number) {
    const adoptionRequest = await this.prisma.adoptionRequests.findUnique({
      where: { id },
    });
    if (!adoptionRequest) {
      throw new NotFoundException(
        `Solicitação de adoção #${id} não encontrada.`,
      );
    }
    return adoptionRequest;
  }

  async update(id: number, updateAdoptionRequestDto: UpdateAdoptionRequestDto) {
    await this.findOne(id);
    return this.prisma.adoptionRequests.update({
      where: { id },
      data: updateAdoptionRequestDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.adoptionRequests.delete({ where: { id } });
  }
}
