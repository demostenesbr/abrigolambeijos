import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';

@Injectable()
export class RecommendationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRecommendationDto: CreateRecommendationDto) {
    return this.prisma.recommendations.create({
      data: createRecommendationDto,
    });
  }

  findAll() {
    return this.prisma.recommendations.findMany();
  }

  async findOne(id: number) {
    const recommendation = await this.prisma.recommendations.findUnique({
      where: { id },
    });
    if (!recommendation) {
      throw new NotFoundException(`Recomendação #${id} não encontrada.`);
    }
    return recommendation;
  }

  async update(id: number, updateRecommendationDto: UpdateRecommendationDto) {
    await this.findOne(id);
    return this.prisma.recommendations.update({
      where: { id },
      data: updateRecommendationDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.recommendations.delete({ where: { id } });
  }
}
